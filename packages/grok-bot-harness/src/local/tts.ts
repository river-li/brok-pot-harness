/** Local CPU speech output. No model or gateway credentials leave the host. */
type SpeechRequest = {
  text: string;
  voiceId?: string;
  language?: "en" | "zh";
  speed?: number;
  signal?: AbortSignal;
};
type Options = { baseUrl?: string; timeoutMs?: number };
const MAX_AUDIO_BYTES = 44 + 24000 * 2 * 120;
class LocalSpeechError extends Error {}

export function createLocalSpeechService(options: Options = {}) {
  let url: URL;
  try {
    url = new URL(
      options.baseUrl ??
        process.env.GROKBOT_TTS_BASE_URL ??
        "http://speech:8000",
    );
    if (
      !["http:", "https:"].includes(url.protocol) ||
      url.username ||
      url.password ||
      url.search ||
      url.hash
    )
      throw new Error();
    url = new URL(url.href.replace(/\/$/, "") + "/speak");
  } catch {
    throw new LocalSpeechError(
      "The local speech endpoint must be an HTTP(S) base URL without credentials, query or fragment.",
    );
  }
  return async (
    request: SpeechRequest,
  ): Promise<{ audioBase64: string; mimeType: string }> => {
    if (
      typeof request.text !== "string" ||
      !request.text.trim() ||
      request.text.length > 2000
    )
      throw new LocalSpeechError(
        "Speech text must contain 1 to 2000 characters.",
      );
    const voiceId = request.voiceId ?? "altair",
      language = request.language ?? "en",
      speed = request.speed ?? 1;
    if (
      !/^[a-z]{2,16}$/.test(voiceId) ||
      !["en", "zh"].includes(language) ||
      ![0.75, 1, 1.25, 1.5].includes(speed)
    )
      throw new LocalSpeechError(
        "Invalid local voice preset, language or speech speed.",
      );
    const timeout = AbortSignal.timeout(options.timeoutMs ?? 60000);
    const signal = request.signal
      ? AbortSignal.any([timeout, request.signal])
      : timeout;
    try {
      const response = await fetch(url, {
        method: "POST",
        redirect: "error",
        signal,
        headers: { "content-type": "application/json", accept: "audio/wav" },
        body: JSON.stringify({ text: request.text, voiceId, language, speed }),
      });
      try {
        if (!response.ok) {
          const detail =
            response.status === 429
              ? "Local speech output is busy; try again shortly."
              : response.status === 400
                ? "Check the speech text, local voice preset, language and speed."
                : "Check the local speech service with npm run status.";
          throw new LocalSpeechError(
            `Speech output returned HTTP ${response.status}. ${detail}`,
          );
        }
        if (
          !/^audio\/wav(?:;|$)/i.test(
            response.headers.get("content-type") || "",
          ) ||
          !response.body
        )
          throw new LocalSpeechError(
            "Local speech output returned an invalid audio response.",
          );
        if (Number(response.headers.get("content-length")) > MAX_AUDIO_BYTES)
          throw new LocalSpeechError(
            "The speech response exceeds the size limit.",
          );
        const reader = response.body.getReader(),
          chunks: Uint8Array[] = [];
        let length = 0;
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            length += value.byteLength;
            if (length > MAX_AUDIO_BYTES)
              throw new LocalSpeechError(
                "The speech response exceeds the size limit.",
              );
            chunks.push(value);
          }
        } finally {
          await reader.cancel().catch(() => {});
          reader.releaseLock();
        }
        const audio = Buffer.concat(chunks, length);
        // The private service emits canonical mono PCM16 WAV at 24 kHz. Verify
        // its declared sizes as well as its media type before handing it to UI.
        if (
          length <= 44 ||
          (length - 44) % 2 !== 0 ||
          audio.toString("ascii", 0, 4) !== "RIFF" ||
          audio.readUInt32LE(4) !== length - 8 ||
          audio.toString("ascii", 8, 16) !== "WAVEfmt " ||
          audio.readUInt32LE(16) !== 16 ||
          audio.readUInt16LE(20) !== 1 ||
          audio.readUInt16LE(22) !== 1 ||
          audio.readUInt32LE(24) !== 24000 ||
          audio.readUInt32LE(28) !== 48000 ||
          audio.readUInt16LE(32) !== 2 ||
          audio.readUInt16LE(34) !== 16 ||
          audio.toString("ascii", 36, 40) !== "data" ||
          audio.readUInt32LE(40) !== length - 44
        )
          throw new LocalSpeechError(
            "Local speech output returned an invalid audio response.",
          );
        return { audioBase64: audio.toString("base64"), mimeType: "audio/wav" };
      } finally {
        await response.body?.cancel().catch(() => {});
      }
    } catch (error) {
      request.signal?.throwIfAborted();
      if (timeout.aborted)
        throw new LocalSpeechError("Local speech output timed out.");
      if (error instanceof LocalSpeechError) throw error;
      throw new LocalSpeechError(
        "Local speech output is unavailable. Check the host and speech service with npm run status.",
      );
    }
  };
}

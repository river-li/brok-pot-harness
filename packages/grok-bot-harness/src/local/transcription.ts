/** Retained transcription ports, backed by local Whisper through the host.
 * The desktop sends only the gateway token; the speech service receives no key. */
type Request = {
  audio: Uint8Array | readonly number[];
  mimeType: string;
  language?: string;
  signal?: AbortSignal;
};
type Result = { text: string; transcriptionTimeMs: number };
type Options = { baseUrl?: string; timeoutMs?: number; token?: string };
const MAX_AUDIO_BYTES = 25 * 1024 * 1024;
const MAX_RESPONSE_BYTES = 1024 * 1024;

class LocalTranscriptionError extends Error {}

function endpoint(base: string, route: string): URL {
  try {
    const url = new URL(base);
    if (
      !["http:", "https:"].includes(url.protocol) ||
      url.username ||
      url.password ||
      url.search ||
      url.hash
    )
      throw new Error();
    return new URL(url.href.replace(/\/$/, "") + route);
  } catch {
    throw new LocalTranscriptionError(
      "The local transcription endpoint must be an HTTP(S) base URL without credentials, query or fragment.",
    );
  }
}

function audioBytes(request: Request): Uint8Array<ArrayBuffer> {
  const length = request.audio?.length;
  if (!Number.isInteger(length) || length < 1 || length > MAX_AUDIO_BYTES)
    throw new LocalTranscriptionError(
      "Audio must be between 1 byte and 25 MiB.",
    );
  return Uint8Array.from(request.audio);
}

async function call(
  url: URL,
  init: RequestInit,
  request: Request,
  timeoutMs = 60000,
): Promise<Result> {
  const timeout = AbortSignal.timeout(timeoutMs);
  const signal = request.signal
    ? AbortSignal.any([timeout, request.signal])
    : timeout;
  try {
    const response = await fetch(url, { ...init, redirect: "error", signal });
    try {
      if (!response.ok) {
        const detail =
          response.status === 429
            ? "Local transcription is busy; try again shortly."
            : response.status === 503
              ? "The local speech model is still starting or unavailable."
              : response.status === 400
                ? "The audio recording is invalid or unsupported."
                : response.status === 413
                  ? "The audio recording exceeds the size limit."
                  : "Check the local host and speech service.";
        throw new LocalTranscriptionError(
          `Transcription returned HTTP ${response.status}. ${detail}`,
        );
      }
      if (
        !/^application\/json(?:;|$)/i.test(
          response.headers.get("content-type") || "",
        ) ||
        !response.body
      )
        throw new LocalTranscriptionError(
          "Local transcription returned an invalid response.",
        );
      if (Number(response.headers.get("content-length")) > MAX_RESPONSE_BYTES)
        throw new LocalTranscriptionError(
          "The transcription response exceeds the size limit.",
        );
      const reader = response.body.getReader();
      const chunks: Uint8Array[] = [];
      let length = 0;
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          length += value.byteLength;
          if (length > MAX_RESPONSE_BYTES)
            throw new LocalTranscriptionError(
              "The transcription response exceeds the size limit.",
            );
          chunks.push(value);
        }
      } finally {
        await reader.cancel().catch(() => {});
        reader.releaseLock();
      }
      try {
        const value = JSON.parse(
          Buffer.concat(chunks, length).toString("utf8"),
        );
        if (
          typeof value.text !== "string" ||
          typeof value.transcriptionTimeMs !== "number" ||
          !Number.isFinite(value.transcriptionTimeMs) ||
          value.transcriptionTimeMs < 0
        )
          throw new Error();
        return {
          text: value.text,
          transcriptionTimeMs: value.transcriptionTimeMs,
        };
      } catch {
        throw new LocalTranscriptionError(
          "Local transcription returned an invalid response.",
        );
      }
    } finally {
      await response.body?.cancel().catch(() => {});
    }
  } catch (error) {
    request.signal?.throwIfAborted();
    if (timeout.aborted)
      throw new LocalTranscriptionError("Local transcription timed out.");
    if (error instanceof LocalTranscriptionError) throw error;
    throw new LocalTranscriptionError(
      "Local transcription is unavailable. Check the host and speech service with npm run status.",
    );
  }
}

export function createLocalTranscribeService(options: Options = {}) {
  const url = endpoint(
    options.baseUrl ??
      process.env.GROKBOT_TRANSCRIPTION_BASE_URL ??
      "http://speech:8000",
    "/transcribe",
  );
  return async (request: Request): Promise<Result> => {
    const bytes = audioBytes(request);
    const mimeType = request.mimeType.split(";")[0].trim() || "audio/webm";
    if (
      !/^(?:(?:audio|video)\/[\w.+-]+|application\/octet-stream)$/i.test(
        mimeType,
      )
    )
      throw new LocalTranscriptionError("Unsupported audio media type.");
    if (request.language && !/^[a-z]{2,3}$/.test(request.language))
      throw new LocalTranscriptionError("Invalid transcription language hint.");
    return call(
      url,
      {
        method: "POST",
        headers: {
          "content-type": mimeType,
          accept: "application/json",
          ...(request.language
            ? { "x-transcription-language": request.language }
            : {}),
        },
        body: bytes,
      },
      request,
      options.timeoutMs,
    );
  };
}

export function createDesktopTranscribeService(options: Options = {}) {
  const url = endpoint(
    options.baseUrl ??
      process.env.SAND_HOST_GATEWAY_URL ??
      "http://127.0.0.1:1540",
    "/api/transcribeAudio",
  );
  return async (request: Request): Promise<Result> => {
    const bytes = audioBytes(request);
    const token = options.token ?? process.env.SAND_HOST_GATEWAY_TOKEN;
    if (!token)
      throw new LocalTranscriptionError(
        "Local gateway credentials are missing. Start the desktop with npm run start:desktop.",
      );
    return call(
      url,
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
          accept: "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          audioBase64: Buffer.from(bytes).toString("base64"),
          mimeType: request.mimeType,
          ...(request.language ? { language: request.language } : {}),
        }),
      },
      request,
      options.timeoutMs,
    );
  };
}

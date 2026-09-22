/** Local implementation of the retained renderer's realtime voice protocol.
 * Capture, task tools, approval and call-record persistence stay in the app.
 */
import { randomUUID } from "node:crypto";
import { setTimeout as delay } from "node:timers/promises";
import { ResponsesExecutor } from "./responses.js";
import { createLocalTranscribeService } from "./transcription.js";
import { createLocalSpeechService } from "./tts.js";

type Value = Record<string, any>;
type Message = {
  role: string;
  content: string | Value[];
  providerOptions?: Value;
};
type Tool = { name: string; description: string; parameters: Value };
type Settings = {
  instructions: string;
  tools: Tool[];
  voiceId: string;
  language?: "en" | "zh";
  speed: number;
  silenceMs: number;
};
export type VoicePorts = {
  respond(
    messages: Message[],
    tools: Tool[],
    signal: AbortSignal,
  ): ReturnType<ResponsesExecutor["stream"]>;
  transcribe(
    wav: Buffer,
    language: Settings["language"],
    signal: AbortSignal,
  ): Promise<string>;
  speak(text: string, settings: Settings, signal: AbortSignal): Promise<Buffer>;
};
const TOOL_NAMES = new Set([
  "send_task",
  "recall_text_messages",
  "stay_silent",
  "end_the_call",
]);
const SEED_NAMES = new Set(["work_landed", "work_overheard"]);
const RATE = 24000,
  FRAME_BYTES = 960,
  MAX_UTTERANCE_BYTES = RATE * 2 * 60;

export function pcmWav(pcm: Buffer): Buffer {
  const header = Buffer.alloc(44);
  header.write("RIFF");
  header.writeUInt32LE(36 + pcm.length, 4);
  header.write("WAVEfmt ", 8);
  header.writeUInt32LE(16, 16);
  header.writeUInt16LE(1, 20);
  header.writeUInt16LE(1, 22);
  header.writeUInt32LE(RATE, 24);
  header.writeUInt32LE(RATE * 2, 28);
  header.writeUInt16LE(2, 32);
  header.writeUInt16LE(16, 34);
  header.write("data", 36);
  header.writeUInt32LE(pcm.length, 40);
  return Buffer.concat([header, pcm]);
}

async function retryBusy<T>(
  run: () => Promise<T>,
  signal: AbortSignal,
): Promise<T> {
  const deadline = Date.now() + 60000;
  while (true) {
    signal.throwIfAborted();
    try {
      return await run();
    } catch (error) {
      if (
        !(error instanceof Error) ||
        !/HTTP 429\b/.test(error.message) ||
        Date.now() >= deadline
      )
        throw error;
      await delay(250, undefined, { signal });
    }
  }
}

export function localVoicePorts(): VoicePorts {
  const transcribe = createLocalTranscribeService(),
    speak = createLocalSpeechService();
  return {
    respond: (messages, tools, signal) =>
      new ResponsesExecutor(
        process.env.GROKBOT_MODEL || "gpt-5.6-sol",
        messages,
      ).stream({ signal }, undefined, tools, {
        maxTokens: 1536,
        parallelToolCalls: false,
      }),
    transcribe: (audio, language, signal) =>
      retryBusy(
        async () =>
          (await transcribe({ audio, mimeType: "audio/wav", language, signal }))
            .text,
        signal,
      ),
    speak: (text, settings, signal) =>
      retryBusy(async () => {
        const response = await speak({
          text,
          voiceId: settings.voiceId,
          speed: settings.speed,
          language:
            settings.language ?? (/\p{Script=Han}/u.test(text) ? "zh" : "en"),
          signal,
        });
        return Buffer.from(response.audioBase64, "base64").subarray(44);
      }, signal),
  };
}

function settingsFrom(value: Value): Settings {
  const input = value.audio?.input,
    output = value.audio?.output;
  if (
    typeof value.instructions !== "string" ||
    value.instructions.length > 64000 ||
    input?.format?.type !== "audio/pcm" ||
    input.format.rate !== RATE ||
    output?.format?.type !== "audio/pcm" ||
    output.format.rate !== RATE ||
    value.turn_detection?.type !== "server_vad"
  )
    throw new Error("Unsupported local voice session settings.");
  const rawLanguage = input.transcription?.language_hint;
  const language =
    rawLanguage == null ? undefined : String(rawLanguage).split("-")[0];
  if (language !== undefined && language !== "en" && language !== "zh")
    throw new Error("Local voice currently supports English and Mandarin.");
  const voiceId = value.voice ?? "altair",
    speed = output.speed ?? 1;
  if (
    typeof voiceId !== "string" ||
    !/^[a-z]{2,16}$/.test(voiceId) ||
    ![0.75, 1, 1.25, 1.5].includes(speed)
  )
    throw new Error("Invalid local voice preset or speed.");
  const silenceMs = value.turn_detection.silence_duration_ms ?? 600;
  if (!Number.isFinite(silenceMs) || silenceMs < 200 || silenceMs > 2000)
    throw new Error("Invalid voice pause duration.");
  if (
    !Array.isArray(value.tools) ||
    value.tools.length > 4 ||
    value.tools.some(
      (t: Value) =>
        t?.type !== "function" ||
        !TOOL_NAMES.has(t.name) ||
        typeof t.description !== "string" ||
        t.description.length > 12000 ||
        t.parameters?.type !== "object",
    ) ||
    new Set(value.tools.map((t: Value) => t.name)).size !== value.tools.length
  )
    throw new Error("Invalid retained voice tools.");
  return {
    instructions: value.instructions,
    tools: value.tools,
    voiceId,
    language,
    speed,
    silenceMs,
  };
}

type SpeechItem = {
  id: string;
  message: Message;
  text: string;
  segments: { text: string; startMs: number; endMs: number }[];
  cutMs?: number;
};
type ActiveResponse = {
  id: string;
  controller: AbortController;
  item: SpeechItem;
  finished: boolean;
};

export class LocalVoiceCall {
  private settings?: Settings;
  private readonly history: Message[] = [];
  private readonly items = new Map<string, SpeechItem>();
  private readonly pendingTools = new Map<string, string>();
  private readonly seeds = new Map<string, Value>();
  private readonly lifetime = new AbortController();
  private active?: ActiveResponse;
  private responseWanted = false;
  private responseInstructions?: string;
  private transcription: Promise<void> = Promise.resolve();
  private pendingTranscriptions = 0;
  private audioRemainder = Buffer.alloc(0);
  private preRoll: Buffer[] = [];
  private utterance: Buffer[] = [];
  private utteranceBytes = 0;
  private inputItem?: string;
  private loudFrames = 0;
  private silentFrames = 0;
  private audioIdle?: ReturnType<typeof setTimeout>;
  private closed = false;

  constructor(
    private send: (event: Value) => void,
    private closeTransport: (reason: string) => void,
    private ports = localVoicePorts(),
  ) {
    this.emit({
      type: "session.created",
      session: { id: randomUUID(), model: "grokbot-local-voice" },
    });
    this.emit({
      type: "conversation.created",
      conversation: { id: randomUUID() },
    });
  }
  private emit(event: Value) {
    if (!this.closed) this.send({ ...event, event_id: randomUUID() });
  }
  receive(event: Value) {
    if (this.closed) return;
    try {
      if (!event || typeof event.type !== "string")
        throw new Error("Invalid voice frame.");
      switch (event.type) {
        case "session.update":
          if (this.settings)
            throw new Error("This voice session has already been configured.");
          this.settings = settingsFrom(event.session ?? {});
          this.emit({ type: "session.updated" });
          return;
        case "input_audio_buffer.append":
          this.appendAudio(event.audio);
          return;
        case "input_audio_buffer.commit":
          this.commitAudio();
          return;
        case "input_audio_buffer.clear":
          this.clearAudio();
          return;
        case "response.create":
          if (
            event.response?.instructions != null &&
            (typeof event.response.instructions !== "string" ||
              event.response.instructions.length > 4000)
          )
            throw new Error("Invalid response instructions.");
          this.responseWanted = true;
          this.responseInstructions = event.response?.instructions;
          this.maybeRespond();
          return;
        case "response.cancel":
          this.cancelResponse();
          this.responseWanted = false;
          return;
        case "conversation.item.create":
          this.createItem(event.item);
          return;
        case "conversation.item.truncate":
          this.truncate(event);
          return;
        default:
          throw new Error("Unsupported local voice frame.");
      }
    } catch (error) {
      this.fail(
        error instanceof Error ? error.message : "Invalid voice request.",
      );
    }
  }
  private appendAudio(encoded: unknown) {
    // The retained recorder can emit a few frames before session.update.
    if (!this.settings) return;
    if (
      typeof encoded !== "string" ||
      encoded.length > 128000 ||
      encoded.length % 4 !== 0 ||
      !/^[A-Za-z0-9+/]*={0,2}$/.test(encoded)
    )
      throw new Error("Invalid voice audio frame.");
    const bytes = Buffer.from(encoded, "base64");
    if (bytes.length % 2 || bytes.length > 96000)
      throw new Error("Invalid PCM voice frame.");
    this.audioRemainder = Buffer.concat([this.audioRemainder, bytes]);
    while (this.audioRemainder.length >= FRAME_BYTES) {
      const frame = Buffer.from(this.audioRemainder.subarray(0, FRAME_BYTES));
      this.audioRemainder = this.audioRemainder.subarray(FRAME_BYTES);
      this.detect(frame);
    }
    clearTimeout(this.audioIdle);
    // Muting capture stops frames, including silence. Finish the last utterance
    // rather than leaving the renderer permanently in caller-speaking state.
    if (this.inputItem)
      this.audioIdle = setTimeout(
        () => this.commitAudio(),
        this.settings.silenceMs + 200,
      );
  }
  private detect(frame: Buffer) {
    let energy = 0;
    for (let i = 0; i < frame.length; i += 2)
      energy += (frame.readInt16LE(i) / 32768) ** 2;
    const loud = Math.sqrt(energy / (frame.length / 2)) >= 0.008;
    if (!this.inputItem) {
      this.preRoll.push(frame);
      if (this.preRoll.length > 10) this.preRoll.shift();
      this.loudFrames = loud ? this.loudFrames + 1 : 0;
      if (this.loudFrames < 3) return;
      this.inputItem = randomUUID();
      this.utterance = this.preRoll;
      this.preRoll = [];
      this.utteranceBytes = this.utterance.length * FRAME_BYTES;
      this.silentFrames = 0;
      this.responseWanted = false;
      this.emit({
        type: "input_audio_buffer.speech_started",
        item_id: this.inputItem,
      });
      this.cancelResponse();
      return;
    }
    this.utterance.push(frame);
    this.utteranceBytes += frame.length;
    this.silentFrames = loud ? 0 : this.silentFrames + 1;
    if (
      this.utteranceBytes >= MAX_UTTERANCE_BYTES ||
      this.silentFrames * 20 >= this.settings!.silenceMs
    )
      this.commitAudio();
  }
  private clearAudio() {
    clearTimeout(this.audioIdle);
    this.audioIdle = undefined;
    this.utterance = [];
    this.utteranceBytes = 0;
    this.preRoll = [];
    this.audioRemainder = Buffer.alloc(0);
    this.loudFrames = 0;
    this.silentFrames = 0;
    this.inputItem = undefined;
  }
  private commitAudio() {
    const id = this.inputItem;
    if (!id || this.closed) return;
    const pcm = Buffer.concat(this.utterance, this.utteranceBytes);
    // Keep the parser's unconsumed part when the VAD commits within one frame.
    const remainder = this.audioRemainder;
    this.clearAudio();
    this.audioRemainder = remainder;
    this.emit({ type: "input_audio_buffer.speech_stopped", item_id: id });
    this.emit({ type: "input_audio_buffer.committed", item_id: id });
    if (++this.pendingTranscriptions > 3) {
      this.fail(
        "Local speech input is arriving faster than it can be transcribed.",
      );
      return;
    }
    this.transcription = this.transcription.then(async () => {
      if (this.closed) return;
      try {
        const text = (
          await this.ports.transcribe(
            pcmWav(pcm),
            this.settings!.language,
            this.lifetime.signal,
          )
        ).trim();
        if (this.closed) return;
        this.emit({
          type: "conversation.item.input_audio_transcription.completed",
          item_id: id,
          transcript: text,
        });
        if (text) {
          this.history.push({ role: "user", content: text });
          this.responseWanted = true;
        }
      } catch {
        if (!this.closed) {
          this.emit({
            type: "conversation.item.input_audio_transcription.failed",
            item_id: id,
          });
          this.fail(
            "Local speech recognition failed. Check the speech service and reconnect.",
          );
        }
      } finally {
        --this.pendingTranscriptions;
        this.maybeRespond();
      }
    });
  }
  private createItem(item: Value) {
    if (!item || !this.settings)
      throw new Error("Configure the voice session first.");
    if (item.type === "function_call") {
      if (
        !SEED_NAMES.has(item.name) ||
        typeof item.call_id !== "string" ||
        !/^seeded-nudge-[\w-]{1,160}$/.test(item.call_id) ||
        this.seeds.has(item.call_id) ||
        this.seeds.size >= 16
      )
        throw new Error("Invalid voice work update.");
      this.seeds.set(item.call_id, {
        type: "tool-call",
        toolCallId: item.call_id,
        toolName: item.name,
        args: {},
      });
      return;
    }
    if (
      item.type !== "function_call_output" ||
      typeof item.call_id !== "string" ||
      typeof item.output !== "string" ||
      item.output.length > 128000
    )
      throw new Error("Invalid voice tool result.");
    const seed = this.seeds.get(item.call_id),
      name = this.pendingTools.get(item.call_id) ?? seed?.toolName;
    if (!name) throw new Error("Voice tool result has no matching call.");
    if (seed) {
      this.history.push({ role: "assistant", content: [seed] });
      this.seeds.delete(item.call_id);
    }
    this.history.push({
      role: "tool",
      content: [
        {
          type: "tool-result",
          toolCallId: item.call_id,
          toolName: name,
          result: item.output,
        },
      ],
    });
    this.pendingTools.delete(item.call_id);
    this.maybeRespond();
  }
  private maybeRespond() {
    if (
      this.closed ||
      !this.settings ||
      !this.responseWanted ||
      this.active ||
      this.inputItem ||
      this.pendingTranscriptions ||
      this.pendingTools.size ||
      this.seeds.size
    )
      return;
    if (JSON.stringify(this.history).length > 1024 * 1024) {
      this.fail(
        "This local call reached its context limit. Start a new call to continue.",
      );
      return;
    }
    const instructions = this.responseInstructions;
    this.responseInstructions = undefined;
    this.responseWanted = false;
    const message: Message = { role: "assistant", content: [] };
    const item: SpeechItem = {
      id: randomUUID(),
      message,
      text: "",
      segments: [],
    };
    const active: ActiveResponse = {
      id: randomUUID(),
      controller: new AbortController(),
      item,
      finished: false,
    };
    this.active = active;
    this.items.set(item.id, item);
    // IDs only need to remain addressable for recently queued playback.
    if (this.items.size > 128)
      this.items.delete(this.items.keys().next().value!);
    const history = this.history.slice();
    this.history.push(message);
    this.emit({ type: "response.created", response: { id: active.id } });
    void this.respond(active, history, instructions);
  }
  private async respond(
    active: ActiveResponse,
    history: Message[],
    instructions?: string,
  ) {
    const signal = AbortSignal.any([
        active.controller.signal,
        this.lifetime.signal,
      ]),
      settings = this.settings!;
    let audio = Promise.resolve(),
      pending = "",
      totalText = 0;
    const enqueue = (text: string) => {
      const clean = text.trim();
      if (!clean) return;
      audio = audio.then(async () => {
        signal.throwIfAborted();
        const pcm = await this.ports.speak(clean, settings, signal);
        signal.throwIfAborted();
        if (!pcm.length || pcm.length % 2 || pcm.length > RATE * 2 * 120)
          throw new Error("Invalid synthesized PCM.");
        const item = active.item,
          startMs = item.segments.at(-1)?.endMs ?? 0;
        item.segments.push({
          text: clean,
          startMs,
          endMs: startMs + (pcm.length / (RATE * 2)) * 1000,
        });
        item.text = item.segments.map((s) => s.text).join(" ");
        this.rewriteText(item, item.text);
        for (let offset = 0; offset < pcm.length; offset += (RATE * 2) / 5) {
          signal.throwIfAborted();
          this.emit({
            type: "response.output_audio.delta",
            response_id: active.id,
            item_id: item.id,
            content_index: 0,
            delta: pcm
              .subarray(offset, offset + (RATE * 2) / 5)
              .toString("base64"),
          });
        }
        this.emit({
          type: "response.output_audio_transcript.done",
          item_id: item.id,
          transcript: item.text,
        });
      });
      void audio.catch(() => {});
    };
    try {
      const result = this.ports.respond(
        [
          { role: "system", content: settings.instructions },
          ...history,
          ...(instructions ? [{ role: "system", content: instructions }] : []),
        ],
        settings.tools,
        signal,
      );
      for await (const event of result.fullStream) {
        signal.throwIfAborted();
        if (event.type !== "text-delta") continue;
        const delta = String(event.textDelta);
        totalText += delta.length;
        pending += delta;
        if (totalText > 8000)
          throw new Error("Voice reply exceeds the speech limit.");
        while (pending) {
          const match = /[.!?。！？]\s|[。！？]|\n/.exec(pending);
          const boundary =
            match && match.index < 350
              ? match.index + match[0].length
              : pending.length >= 350
                ? 350
                : 0;
          if (!boundary) break;
          enqueue(pending.slice(0, boundary));
          pending = pending.slice(boundary);
        }
      }
      const completed = await result.response;
      const assistant = completed.messages[0] as Message;
      // Some compatible streams only supply final text; retain that content too.
      if (!totalText)
        pending = Array.isArray(assistant.content)
          ? assistant.content
              .filter((p) => p.type === "text")
              .map((p) => p.text)
              .join(" ")
          : assistant.content;
      while (pending) {
        enqueue(pending.slice(0, 350));
        pending = pending.slice(350);
      }
      await audio;
      signal.throwIfAborted();
      Object.assign(active.item.message, assistant);
      const calls = Array.isArray(assistant.content)
        ? assistant.content.filter((p) => p.type === "tool-call")
        : [];
      if (
        calls.some(
          (call) => !settings.tools.some((t) => t.name === call.toolName),
        ) ||
        calls.length > 8
      )
        throw new Error("The model returned an unsupported voice tool.");
      for (const call of calls)
        this.pendingTools.set(call.toolCallId, call.toolName);
      for (const call of calls)
        this.emit({
          type: "response.function_call_arguments.done",
          call_id: call.toolCallId,
          name: call.toolName,
          arguments: JSON.stringify(call.args),
        });
      active.finished = true;
      this.emit({
        type: "response.done",
        response: { id: active.id, status: "completed" },
      });
    } catch {
      if (!signal.aborted && !this.closed)
        this.fail(
          "Local voice inference or speech output failed. Check the configured model API and speech service, then reconnect.",
        );
    } finally {
      if (
        Array.isArray(active.item.message.content) &&
        !active.item.message.content.length
      ) {
        const index = this.history.indexOf(active.item.message);
        if (index >= 0) this.history.splice(index, 1);
      }
      if (this.active === active) this.active = undefined;
      this.maybeRespond();
    }
  }
  private rewriteText(item: SpeechItem, text: string) {
    const content = Array.isArray(item.message.content)
      ? item.message.content.filter((p) => p.type !== "text")
      : [];
    item.message.content = [
      ...(text ? [{ type: "text", text }] : []),
      ...content,
    ];
    const saved = item.message.providerOptions?.localResponses?.items;
    if (Array.isArray(saved)) {
      if (!text && content.length === 0) {
        item.message.providerOptions!.localResponses.items = [];
        return;
      }
      let retainedText = false;
      item.message.providerOptions!.localResponses.items = saved.filter(
        (output: Value) => {
          if (output.type !== "message") return true;
          if (!text || retainedText) return false;
          output.content = [{ type: "output_text", text, annotations: [] }];
          retainedText = true;
          return true;
        },
      );
    }
  }
  private truncate(event: Value) {
    const item = this.items.get(event.item_id);
    if (!item) return;
    if (
      event.content_index !== 0 ||
      !Number.isFinite(event.audio_end_ms) ||
      event.audio_end_ms < 0
    )
      throw new Error("Invalid voice audio truncation.");
    item.cutMs = Math.min(item.cutMs ?? Infinity, event.audio_end_ms);
    // Keep only completed spoken segments: no claim that an unheard word was
    // spoken, and no approximate character-to-audio alignment in model context.
    const text = item.segments
      .filter((s) => s.endMs <= item.cutMs!)
      .map((s) => s.text)
      .join(" ");
    this.rewriteText(item, text);
    this.emit({
      type: "conversation.item.truncated",
      item_id: item.id,
      content_index: 0,
      audio_end_ms: item.cutMs,
      transcript: text || "…",
    });
  }
  private cancelResponse() {
    const active = this.active;
    if (!active || active.finished) return;
    active.finished = true;
    active.controller.abort();
    this.active = undefined;
    this.emit({
      type: "response.cancelled",
      response: { id: active.id, status: "cancelled" },
    });
  }
  private fail(message: string) {
    if (this.closed) return;
    this.emit({ type: "error", error: { message } });
    this.close();
    this.closeTransport(message);
  }
  close() {
    if (this.closed) return;
    this.closed = true;
    this.lifetime.abort();
    this.active?.controller.abort();
    this.clearAudio();
    this.history.length = 0;
    this.items.clear();
    this.pendingTools.clear();
    this.seeds.clear();
  }
}

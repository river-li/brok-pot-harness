const __mod=require('node:module');const __p=require('node:path');const __depsDir=__p.join(__dirname,'..','deps');process.env.NODE_PATH=__depsDir+(process.env.NODE_PATH?__p.delimiter+process.env.NODE_PATH:'');__mod.Module._initPaths();const __import_meta_url=require('node:url').pathToFileURL(__filename).href;
"use strict";

// src/host/extensions/content-search/search-index-worker.ts
var import_node_worker_threads = require("node:worker_threads");

// src/shared/errors/system-errno.ts
function findSystemErrno(error) {
  const seen = /* @__PURE__ */ new Set();
  let current = error;
  while (current != null && typeof current === "object" && !seen.has(current)) {
    seen.add(current);
    const code = current.code;
    if (typeof code === "string" && /^E[A-Z_]+$/.test(code)) return code;
    current = current.cause;
  }
  return void 0;
}

// src/shared/errors/errors.ts
function errorLogTag(error) {
  if (!(error instanceof Error)) return typeof error;
  const ownCode = error.code;
  const code = ownCode != null && ownCode.length > 0 ? ownCode : findSystemErrno(error);
  return code !== void 0 ? `${error.name} (${code})` : error.name;
}

// src/shared/invariant.ts
var SandInvariantViolation = class extends Error {
  constructor(message) {
    super(message);
    this.name = "SandInvariantViolation";
  }
};
var installedReporter = null;
var STRIPPED_MESSAGE = "Invariant violation (message stripped in packaged builds; the stack identifies the site)";
function messagesStripped() {
  return false;
}
var FRAME_LINE = /^at /;
function topApplicationFrame(violation) {
  const stack = violation.stack;
  if (typeof stack !== "string" || !stack.startsWith(headerOf(violation))) return null;
  for (const raw of stack.slice(headerOf(violation).length).split("\n")) {
    const frame = raw.trim();
    if (!FRAME_LINE.test(frame)) continue;
    return frame;
  }
  return null;
}
function headerOf(violation) {
  return violation.message === "" ? violation.name : `${violation.name}: ${violation.message}`;
}
function invariant(condition, message) {
  if (condition) return;
  failInvariant(message, invariant);
}
function failInvariant(message, boundary) {
  let violationMessage;
  if (messagesStripped()) {
    violationMessage = STRIPPED_MESSAGE;
  } else if (typeof message === "function") {
    violationMessage = message();
  } else {
    violationMessage = message;
  }
  const violation = new SandInvariantViolation(violationMessage);
  let frame = null;
  if ("captureStackTrace" in Error && typeof Error.captureStackTrace === "function") {
    Error.captureStackTrace(violation, boundary);
    if (installedReporter !== null) frame = topApplicationFrame(violation);
  }
  installedReporter?.({ name: violation.name, frame });
  throw violation;
}

// ../dune/scheduling/dist/internal/policies.js
var JITTER_SPREAD = { none: 0, equal: 1 / 2, full: 1 };

// src/host/storage/sqlite-busy.ts
var SQLITE_BUSY = 5;
var SQLITE_LOCKED = 6;
var SQLITE_IOERR = 10;
var SQLITE_CORRUPT = 11;
var SQLITE_CANTOPEN = 14;
var SQLITE_NOTADB = 26;
var SQLITE_PRIMARY_CODES = /* @__PURE__ */ new Map([
  ["SQLITE_BUSY", SQLITE_BUSY],
  ["SQLITE_LOCKED", SQLITE_LOCKED],
  ["SQLITE_IOERR", SQLITE_IOERR],
  ["SQLITE_CORRUPT", SQLITE_CORRUPT],
  ["SQLITE_CANTOPEN", SQLITE_CANTOPEN],
  ["SQLITE_NOTADB", SQLITE_NOTADB]
]);
function sqlitePrimaryCode(error) {
  if (!(error instanceof Error)) return void 0;
  if ("errcode" in error && typeof error.errcode === "number" && Number.isInteger(error.errcode)) {
    return error.errcode & 255;
  }
  if ("code" in error && typeof error.code === "string") {
    return SQLITE_PRIMARY_CODES.get(error.code.split("_", 2).join("_"));
  }
  return void 0;
}
function isSqliteCorruptError(error) {
  const code = sqlitePrimaryCode(error);
  return code === SQLITE_CORRUPT || code === SQLITE_NOTADB;
}

// src/host/extensions/content-search/search-index-db.ts
var import_node_path = require("node:path");
var import_node_sqlite2 = require("node:sqlite");

// src/shared/media/attachment-open-policy.ts
function attachmentExtension(nameOrPath) {
  const segments = nameOrPath.split(/[/\\]/);
  const base = segments[segments.length - 1] ?? "";
  const dot = base.lastIndexOf(".");
  if (dot <= 0 || dot === base.length - 1) return null;
  return base.slice(dot + 1).toLowerCase();
}

// src/shared/media/attachment-preview.ts
var TEXT_PREVIEWABLE_EXTENSIONS = /* @__PURE__ */ new Set([
  "txt",
  "text",
  "log",
  "md",
  "markdown",
  "mdx",
  "rst",
  "adoc",
  "tex",
  "json",
  "jsonc",
  "json5",
  "ndjson",
  "csv",
  "tsv",
  "xml",
  "yaml",
  "yml",
  "toml",
  "ini",
  "cfg",
  "conf",
  "env",
  "properties",
  "plist",
  "gradle",
  "html",
  "htm",
  "css",
  "scss",
  "sass",
  "less",
  "svg",
  "js",
  "jsx",
  "mjs",
  "cjs",
  "ts",
  "tsx",
  "mts",
  "cts",
  "py",
  "pyi",
  "rb",
  "go",
  "rs",
  "java",
  "kt",
  "kts",
  "c",
  "h",
  "cc",
  "cpp",
  "cxx",
  "hpp",
  "hh",
  "cs",
  "php",
  "swift",
  "scala",
  "dart",
  "lua",
  "pl",
  "pm",
  "r",
  "sql",
  "graphql",
  "gql",
  "proto",
  "vue",
  "svelte",
  "astro",
  "sh",
  "bash",
  "zsh",
  "fish",
  "bat",
  "ps1",
  "tf",
  "tfvars",
  "dockerfile",
  "diff",
  "patch"
]);
function isTextPreviewableName(nameOrPath) {
  const ext = attachmentExtension(nameOrPath);
  return ext != null && TEXT_PREVIEWABLE_EXTENSIONS.has(ext);
}
var BINARY_SNIFF_BYTE_WINDOW = 8 * 1024;

// src/shared/media/media-extensions.ts
function extensionOf(name) {
  const base = name.slice(Math.max(name.lastIndexOf("/"), name.lastIndexOf("\\")) + 1);
  const dot = base.lastIndexOf(".");
  return dot <= 0 ? "" : base.slice(dot).toLowerCase();
}
var IMAGE_MIME_FROM_EXTENSION = {
  ".avif": "image/avif",
  ".bmp": "image/bmp",
  ".gif": "image/gif",
  ".ico": "image/x-icon",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webp": "image/webp"
};
var CLIENT_NATIVE_IMAGE_MIME_FROM_EXTENSION = {
  ".heic": "image/heic",
  ".heif": "image/heif"
};
var SERVABLE_IMAGE_MIME_FROM_EXTENSION = {
  ...IMAGE_MIME_FROM_EXTENSION,
  ...CLIENT_NATIVE_IMAGE_MIME_FROM_EXTENSION
};
var VIDEO_MIME_FROM_EXTENSION = {
  ".m4v": "video/mp4",
  ".mov": "video/quicktime",
  ".mp4": "video/mp4",
  ".ogv": "video/ogg",
  ".webm": "video/webm"
};
var AUDIO_MIME_FROM_EXTENSION = {
  ".aac": "audio/aac",
  ".flac": "audio/flac",
  ".m4a": "audio/mp4",
  ".mp3": "audio/mpeg",
  ".oga": "audio/ogg",
  ".ogg": "audio/ogg",
  ".opus": "audio/ogg",
  ".wav": "audio/wav",
  ".weba": "audio/webm"
};

// src/shared/media/file-preview-kind.ts
var IMAGE_EXTENSIONS = new Set(
  Object.keys(SERVABLE_IMAGE_MIME_FROM_EXTENSION).map((ext) => ext.slice(1))
);
var VIDEO_EXTENSIONS = new Set(
  Object.keys(VIDEO_MIME_FROM_EXTENSION).map((ext) => ext.slice(1))
);
var AUDIO_EXTENSIONS = new Set(
  Object.keys(AUDIO_MIME_FROM_EXTENSION).map((ext) => ext.slice(1))
);
var MARKDOWN_EXTENSIONS = /* @__PURE__ */ new Set(["md", "markdown", "mdx"]);
var JSON_EXTENSIONS = /* @__PURE__ */ new Set(["json"]);
var HTML_EXTENSIONS = /* @__PURE__ */ new Set(["html", "htm"]);
var TABLE_EXTENSIONS = /* @__PURE__ */ new Set(["csv", "tsv", "xlsx", "xls"]);
function getFilePreviewKind(nameOrPath) {
  const ext = attachmentExtension(nameOrPath);
  if (ext == null) return "unknown";
  if (IMAGE_EXTENSIONS.has(ext)) return "image";
  if (VIDEO_EXTENSIONS.has(ext)) return "video";
  if (AUDIO_EXTENSIONS.has(ext)) return "audio";
  if (ext === "pdf") return "pdf";
  if (TABLE_EXTENSIONS.has(ext)) return "table";
  if (JSON_EXTENSIONS.has(ext)) return "json";
  if (MARKDOWN_EXTENSIONS.has(ext)) return "markdown";
  if (HTML_EXTENSIONS.has(ext)) return "html";
  if (ext === "docx") return "docx";
  if (isTextPreviewableName(nameOrPath)) return "text";
  return "unknown";
}

// src/shared/media/attachment-summary.ts
var JSON_EXTENSIONS2 = /* @__PURE__ */ new Set(["json", "jsonc", "json5", "ndjson"]);
var ARCHIVE_EXTENSIONS = /* @__PURE__ */ new Set([
  "zip",
  "tar",
  "gz",
  "tgz",
  "bz2",
  "tbz2",
  "xz",
  "txz",
  "zst",
  "7z",
  "rar"
]);
var TABLE_MIME_TYPES = /* @__PURE__ */ new Set([
  "text/csv",
  "text/tab-separated-values",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
]);
var DOCUMENT_MIME_TYPES = /* @__PURE__ */ new Set([
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
]);
var ARCHIVE_MIME_TYPES = /* @__PURE__ */ new Set([
  "application/zip",
  "application/x-zip-compressed",
  "application/gzip",
  "application/x-tar",
  "application/x-bzip2",
  "application/x-xz",
  "application/zstd",
  "application/x-7z-compressed",
  "application/x-rar-compressed",
  "application/vnd.rar"
]);
function classifyMimeType(rawMimeType) {
  const mime = (rawMimeType.split(";")[0] ?? "").trim().toLowerCase();
  if (mime.startsWith("image/")) return "image";
  if (mime.startsWith("video/")) return "video";
  if (mime.startsWith("audio/")) return "audio";
  if (mime === "application/pdf") return "pdf";
  if (mime === "text/markdown") return "markdown";
  if (TABLE_MIME_TYPES.has(mime)) return "table";
  if (mime === "application/json" || mime.endsWith("+json")) return "json";
  if (DOCUMENT_MIME_TYPES.has(mime)) return "document";
  if (ARCHIVE_MIME_TYPES.has(mime)) return "archive";
  if (mime.startsWith("text/")) return "text";
  return null;
}
function extensionSubject(source) {
  let pathname;
  try {
    pathname = new URL(source).pathname;
  } catch {
    return source;
  }
  try {
    return decodeURIComponent(pathname);
  } catch {
    return pathname;
  }
}
function classifyPathLike(source) {
  const subject = extensionSubject(source);
  const previewKind = getFilePreviewKind(subject);
  switch (previewKind) {
    case "image":
    case "video":
    case "audio":
    case "pdf":
    case "markdown":
    case "table":
      return previewKind;
    case "docx":
      return "document";
    case "html":
      return "text";
    case "json":
      return "json";
    case "text": {
      const ext = attachmentExtension(subject);
      return ext != null && JSON_EXTENSIONS2.has(ext) ? "json" : "text";
    }
    case "unknown": {
      const ext = attachmentExtension(subject);
      return ext != null && ARCHIVE_EXTENSIONS.has(ext) ? "archive" : null;
    }
  }
  const _exhaustive = previewKind;
  return _exhaustive;
}
function classifyAttachment(source) {
  if (source.mimeType != null && source.mimeType.length > 0) {
    const byMime = classifyMimeType(source.mimeType);
    if (byMime != null) return byMime;
  }
  if (source.fileName != null && source.fileName.length > 0) {
    const byName = classifyPathLike(source.fileName);
    if (byName != null) return byName;
  }
  if (source.urlOrPath != null && source.urlOrPath.length > 0) {
    const byPath = classifyPathLike(source.urlOrPath);
    if (byPath != null) return byPath;
  }
  return "file";
}

// src/shared/media/attachments.ts
var SAND_ATTACHMENT_KINDS = [
  "image",
  "video",
  "audio",
  "pdf",
  "markdown",
  "table",
  "json",
  "text",
  "document",
  "archive",
  "file"
];
var SAND_FALLBACK_ATTACHMENT_KIND = SAND_ATTACHMENT_KINDS[10];

// src/shared/media/image-mime.ts
function imageMimeFromPath(filePath) {
  return IMAGE_MIME_FROM_EXTENSION[extensionOf(filePath)];
}
function videoMimeFromPath(filePath) {
  return VIDEO_MIME_FROM_EXTENSION[extensionOf(filePath)];
}
function audioMimeFromPath(filePath) {
  return AUDIO_MIME_FROM_EXTENSION[extensionOf(filePath)];
}

// ../packages/grok-bot-voice-call-harness/dist/prompt/channel-platform.js
var VOICE_CALL_CHANNEL_PLATFORM = "voice";

// ../packages/grok-bot-voice-call-harness/dist/call/voice-channel.js
var ADDRESS_PREFIX = `${VOICE_CALL_CHANNEL_PLATFORM}:`;

// ../packages/grok-bot-voice-call-harness/dist/prompt/nudge-reply.js
var VOICE_CALL_REQUEST_CHAR_LIMIT = 2e3;
var VOICE_CALL_REQUEST_TOO_LONG_ERROR = `The task was not sent: request exceeds ${VOICE_CALL_REQUEST_CHAR_LIMIT} characters. Reformulate it within the limit while preserving every constraint, especially prohibitions and approval requirements. Do not drop constraints or split the task into executable pieces. Ask the caller to clarify if it cannot fit safely.`;

// ../packages/grok-bot-voice-call-harness/dist/prompt/main-loop-voice-prompt.js
var ADDRESS_SHAPE = `${VOICE_CALL_CHANNEL_PLATFORM}:<call>`;

// ../packages/grok-bot-voice-call-harness/dist/prompt/tool-names.js
var VOICE_CALL_HANGUP_TOOL = "end_the_call";
var VOICE_CALL_NUDGE_MAIN_TOOL = "send_task";
var VOICE_CALL_RECALL_TEXTS_TOOL = "recall_text_messages";
var VOICE_CALL_SILENT_TOOL = "stay_silent";
var VOICE_CALL_WORK_LANDED_TOOL = "work_landed";
var VOICE_CALL_WORK_OVERHEARD_TOOL = "work_overheard";
var VOICE_CALL_USER_MESSAGE_TOPIC = "user_message";
var VOICE_CALL_RECALL_TEXTS_SCOPE = `the written chat between you and this caller: "you" is what you sent them, "them" is what they typed to you. Nobody else writes in it, and nothing anyone else sent them is in it: not their other agents, not other people, not Slack, mail, or any other app. Word from any of those is a ${VOICE_CALL_NUDGE_MAIN_TOOL} job, never a read of this chat.`;
var VOICE_CALL_RECALL_TEXTS_WHEN = `If the answer might already be in the written chat, call ${VOICE_CALL_RECALL_TEXTS_TOOL}. Do not guess it, do not say you do not know, and do not ${VOICE_CALL_NUDGE_MAIN_TOOL} for it until you have read that chat.`;
var VOICE_CALL_RECALL_TEXTS_IF_UNREAD = `If the answer might already be in the written chat you have not read this call, ${VOICE_CALL_RECALL_TEXTS_TOOL} first.`;
var VoiceCallToolDescriptions = class {
  static sendTask() {
    return `Send a job that needs their computer, files, web, browser, or mail and chat they send. That call is a receipt, never the answer, and never the quick path. Speak a short beat on this response that names the job in how you talk, then call this. Never start that beat with a confirmation. Never say you are calling this tool. The outcome lands later as a ${VOICE_CALL_WORK_LANDED_TOOL} entry. Do not use this for a take, a recap of this call, a quiz from words already on the line, a story, a joke, talk they asked you to do yourself, or a fact already on the line. If the useful answer needs a fact you do not have about their world, ${VOICE_CALL_RECALL_TEXTS_TOOL} first when it might already be in this written chat; use this only when it is not there.`;
  }
  static sendTaskRequest() {
    return `The job itself: what to do or find out, and what to come back with. Not the caller's sentence. Add their exact words only where the wording itself is part of the job. Maximum ${VOICE_CALL_REQUEST_CHAR_LIMIT} characters; preserve every constraint, prohibition, and approval requirement. Overlong requests are rejected, never truncated.`;
  }
  static recallTextMessages() {
    return `Read ${VOICE_CALL_RECALL_TEXTS_SCOPE} Oldest first. ${VOICE_CALL_RECALL_TEXTS_WHEN} Say nothing about calling this.`;
  }
  static staySilent() {
    return `Say nothing this turn. This is only for a last-landed ${VOICE_CALL_WORK_LANDED_TOOL} or ${VOICE_CALL_WORK_OVERHEARD_TOOL} entry, when speaking would give them nothing new. Never use it when they just talked to you. Never on the unpaid turn after ${VOICE_CALL_NUDGE_MAIN_TOOL}. Never on a ${VOICE_CALL_WORK_LANDED_TOOL} outcome they have not heard. Never on the same turn as spoken words. The caller hears nothing. Say nothing about calling this.`;
  }
  static endTheCall() {
    return `Hang up and end this call. Use it only when the caller says a parting greeting like "all done", "bye", "thanks, that's all", "stop", "go away", "shut up", "stop listening", "leave me alone", "goodbye", or "hang up". An unclear pause, a task still open, "ok" in the middle of work, or a "stop" that cancels that work is not a hang-up. ALWAYS say your goodbye out loud first, including when hanging up is the last step of something else they asked for: the line drops the moment you call this, so nothing after it is heard. Never call it while they are still asking for something.`;
  }
};

// ../packages/grok-bot-voice-call-harness/dist/prompt/session-tools.js
var TOOLS = [
  {
    type: "function",
    name: VOICE_CALL_NUDGE_MAIN_TOOL,
    description: VoiceCallToolDescriptions.sendTask(),
    parameters: {
      type: "object",
      properties: {
        request: {
          type: "string",
          description: VoiceCallToolDescriptions.sendTaskRequest()
        }
      },
      required: ["request"]
    }
  },
  {
    type: "function",
    name: VOICE_CALL_RECALL_TEXTS_TOOL,
    description: VoiceCallToolDescriptions.recallTextMessages(),
    parameters: { type: "object", properties: {} }
  },
  {
    type: "function",
    name: VOICE_CALL_SILENT_TOOL,
    description: VoiceCallToolDescriptions.staySilent(),
    parameters: { type: "object", properties: {} }
  },
  {
    type: "function",
    name: VOICE_CALL_HANGUP_TOOL,
    description: VoiceCallToolDescriptions.endTheCall(),
    parameters: { type: "object", properties: {} }
  }
];

// ../packages/grok-bot-voice-call-harness/dist/prompt/tool-prompts.js
var KNOWN = {
  [VOICE_CALL_NUDGE_MAIN_TOOL]: {
    line: `- ${VOICE_CALL_NUDGE_MAIN_TOOL}: speak a short beat that names the job in how you talk, then send it. Never start that beat with a confirmation. Never say you are calling the tool. Work that needs their computer, files, web, browser, or mail and chat they send goes through it; do not refuse it. That call is a receipt, never the outcome, and never the quick path. The outcome lands later, on its own, as a ${VOICE_CALL_WORK_LANDED_TOOL} entry.`,
    inFlight: [],
    receipt: null
  },
  [VOICE_CALL_RECALL_TEXTS_TOOL]: {
    line: `- ${VOICE_CALL_RECALL_TEXTS_TOOL}: read ${VOICE_CALL_RECALL_TEXTS_SCOPE} ${VOICE_CALL_RECALL_TEXTS_WHEN}`,
    inFlight: [],
    receipt: null
  },
  [VOICE_CALL_SILENT_TOOL]: {
    line: `- ${VOICE_CALL_SILENT_TOOL}: say nothing this turn, only when the last landed entry is ${VOICE_CALL_WORK_LANDED_TOOL} or ${VOICE_CALL_WORK_OVERHEARD_TOOL} and there is nothing new to say. Never when they just talked to you. Never on the unpaid turn after ${VOICE_CALL_NUDGE_MAIN_TOOL}. Never on a ${VOICE_CALL_WORK_LANDED_TOOL} outcome they have not heard.`,
    inFlight: [
      `Never ${VOICE_CALL_SILENT_TOOL} on a turn they talked to you, even if a ${VOICE_CALL_WORK_LANDED_TOOL} entry just landed.`,
      `${VOICE_CALL_SILENT_TOOL} only when they have said nothing since your last line and the last thing that landed is a ${VOICE_CALL_WORK_LANDED_TOOL} or ${VOICE_CALL_WORK_OVERHEARD_TOOL} entry and speaking would give them nothing new.`,
      `Never ${VOICE_CALL_SILENT_TOOL} on the same turn as spoken words.`
    ],
    receipt: `Do not ${VOICE_CALL_SILENT_TOOL}.`
  },
  [VOICE_CALL_HANGUP_TOOL]: {
    line: `- ${VOICE_CALL_HANGUP_TOOL}: hang up only on a parting greeting. Say your goodbye first; the line drops the moment you call it.`,
    inFlight: [],
    receipt: null
  }
};

// ../packages/grok-bot-voice-call-harness/dist/session/async-update.js
var VoiceCallAsyncUpdate = class {
  static frame({ topic, eventId, texts, atMs }) {
    return {
      type: "async_update.add",
      event_id: eventId,
      async_update: {
        topic,
        payload: texts.map((content) => ({
          message: { type: "text", content },
          timestampMs: atMs
        }))
      }
    };
  }
};
var VoiceCallWrittenTurns = class _VoiceCallWrittenTurns {
  static TOPIC = VOICE_CALL_USER_MESSAGE_TOPIC;
  /** A written turn rides in the model's context for the rest of the call, so it is held to a spoken update's size. */
  static CHAR_LIMIT = VOICE_CALL_REQUEST_CHAR_LIMIT;
  static EVENT_ID_PREFIX = "written-turn";
  static eventId(entryId) {
    return `${_VoiceCallWrittenTurns.EVENT_ID_PREFIX}-${entryId}`;
  }
  static rides(wire) {
    return wire === "async-update";
  }
  static frame({ entryId, text, atMs }) {
    return VoiceCallAsyncUpdate.frame({
      topic: _VoiceCallWrittenTurns.TOPIC,
      eventId: _VoiceCallWrittenTurns.eventId(entryId),
      texts: [text.slice(0, _VoiceCallWrittenTurns.CHAR_LIMIT)],
      atMs
    });
  }
};

// ../packages/grok-bot-voice-call-harness/dist/session/mint-fault.js
var VOICE_CALL_MINT_REASONS = [
  "not_configured",
  "unsupported_model",
  "rejected",
  "unreachable",
  "malformed_response"
];
var VOICE_CALL_MINT_HTTP = ["429", "401", "403", "503"];
var MINT_HEADER_PREFIX = "voice_mint_";
var MINT_HEADER_BY_VALUE = (() => {
  const headers = /* @__PURE__ */ new Map();
  for (const reason of VOICE_CALL_MINT_REASONS) {
    headers.set(`${MINT_HEADER_PREFIX}${reason}`, {
      reason,
      http: "absent"
    });
    for (const http of VOICE_CALL_MINT_HTTP) {
      headers.set(`${MINT_HEADER_PREFIX}${reason}_${http}`, { reason, http });
    }
  }
  return headers;
})();

// ../packages/grok-bot-voice-call-harness/dist/session/response-cancel.js
var VoiceCallResponseCancel = class _VoiceCallResponseCancel {
  static EVENT_ID_PREFIX = "response_cancel.";
  static frame(sequence) {
    return {
      type: "response.cancel",
      event_id: `${_VoiceCallResponseCancel.EVENT_ID_PREFIX}${sequence}`
    };
  }
};

// ../packages/grok-bot-voice-call-harness/dist/session/seeded-nudge.js
var SEEDED_TOOL_BY_KIND = {
  ack: VOICE_CALL_WORK_LANDED_TOOL,
  progress: VOICE_CALL_WORK_LANDED_TOOL,
  outcome: VOICE_CALL_WORK_LANDED_TOOL,
  overheard: VOICE_CALL_WORK_OVERHEARD_TOOL
};
var SEEDED_CALL_ARGUMENTS = "{}";
var VoiceCallItemSeeding = class _VoiceCallItemSeeding {
  static SEEDED_TOOL = VOICE_CALL_WORK_LANDED_TOOL;
  static OVERHEARD_TOOL = VOICE_CALL_WORK_OVERHEARD_TOOL;
  static CALL_ID_PREFIX = "seeded-nudge";
  static callId(nudgeId) {
    return `${_VoiceCallItemSeeding.CALL_ID_PREFIX}-${nudgeId}`;
  }
  static seededTool(kind) {
    return SEEDED_TOOL_BY_KIND[kind];
  }
  static progressNote({ kind, texts, atMs }) {
    const at = new Date(atMs).toISOString().replace(/\.\d{3}Z$/, "Z");
    return kind === "overheard" ? { status: "in progress", steps: texts, at } : { status: "landed", updates: texts, at };
  }
  static isNudgeKind(value) {
    return value === "ack" || value === "progress" || value === "outcome" || value === "overheard";
  }
  /**
   * The kinds a nudge may be *sent* as, because these are the ones the caller
   * hears. An ack is the session's own bookkeeping for an update that repeats
   * what the voice side already said; offering it to the working side would
   * be offering a way to reach nobody.
   */
  static SPOKEN_KINDS = ["progress", "outcome"];
  /**
   * A seeded step rides in the model's context for the rest of the call, so it
   * is held to the same size a spoken nudge is.
   */
  static OVERHEARD_CHAR_LIMIT = VOICE_CALL_REQUEST_CHAR_LIMIT;
  /**
   * Whether seeding this update should also ask the model for a spoken turn.
   * The frames land in its history either way; asking is what reaches the ear,
   * and spending a turn on something already heard reads as the work stopping
   * rather than as progress.
   */
  static earnsASpokenTurn({ kind }) {
    const spoken = _VoiceCallItemSeeding.SPOKEN_KINDS;
    return spoken.includes(kind);
  }
  /**
   * An update nobody speaks stays a seeded pair on either wire: the
   * orchestrator opens a turn for every async update, and a step in progress
   * must not be spoken.
   */
  static delivery(seed, wire) {
    if (!_VoiceCallItemSeeding.earnsASpokenTurn(seed))
      return "filed";
    return wire === "async-update" ? "orchestrated" : "asked";
  }
  static frames(seed, wire) {
    if (_VoiceCallItemSeeding.delivery(seed, wire) === "orchestrated") {
      return [
        VoiceCallAsyncUpdate.frame({
          topic: VOICE_CALL_WORK_LANDED_TOOL,
          eventId: seed.callId,
          texts: seed.texts,
          atMs: seed.atMs
        })
      ];
    }
    return _VoiceCallItemSeeding.pair(seed);
  }
  /** The note lives on the output side; the call side carries `{}`. */
  static pair({ callId, kind, texts, atMs }) {
    return [
      {
        type: "conversation.item.create",
        item: {
          type: "function_call",
          name: _VoiceCallItemSeeding.seededTool(kind),
          call_id: callId,
          arguments: SEEDED_CALL_ARGUMENTS
        }
      },
      {
        type: "conversation.item.create",
        item: {
          type: "function_call_output",
          call_id: callId,
          output: JSON.stringify(_VoiceCallItemSeeding.progressNote({ kind, texts, atMs }))
        }
      }
    ];
  }
};

// ../packages/grok-bot-voice-call-harness/dist/session/protocol-fault.js
var FRAME_KIND_BY_EVENT_ID_PREFIX = [
  [`${VoiceCallWrittenTurns.EVENT_ID_PREFIX}-`, "async_update_add"],
  [`${VoiceCallItemSeeding.CALL_ID_PREFIX}-`, "async_update_add"],
  [VoiceCallResponseCancel.EVENT_ID_PREFIX, "response_cancel"]
];

// src/shared/transcript/transcript.ts
function isOutboundAgentPeerMessageEntry(entry) {
  return entry != null && entry.kind === "message" && entry.toAgent != null;
}
function isHiddenOutboundAgentPeerMessageEntry(entry) {
  return isOutboundAgentPeerMessageEntry(entry) && entry.toAgent.kind !== "agent" && entry.toAgent.kind !== "cloud-agent";
}

// ../packages/grok-bot-harness/src/host-diagnostics.ts
var pinnedReporter = null;
function reportHostDiagnostic(diagnostic) {
  pinnedReporter?.(diagnostic);
}

// src/host/fallback-diagnostics.ts
var reported = /* @__PURE__ */ new Set();
function reportFallback(stage, error) {
  const errorClass = errorLogTag(error);
  const key = `${stage} ${errorClass}`;
  if (reported.has(key)) return;
  reported.add(key);
  reportHostDiagnostic({ kind: "fallback_taken", stage, errorClass });
}

// src/host/storage/store-db.ts
var import_node_sqlite = require("node:sqlite");
var DB_BUSY_TIMEOUT_MS = 5e3;
function applyStorePragmas(db, options) {
  db.exec(`PRAGMA busy_timeout = ${options.busyTimeoutMs ?? DB_BUSY_TIMEOUT_MS}`);
  try {
    db.exec("PRAGMA journal_mode = WAL");
    db.exec("PRAGMA synchronous = NORMAL");
  } catch (error) {
    if (options.allowWalFailure !== true) throw error;
  }
  if (options.incrementalAutoVacuum === true) {
    db.exec("PRAGMA auto_vacuum = INCREMENTAL");
  }
}

// src/host/extensions/content-search/agent-content-search.ts
var AGENT_CONTENT_SEARCH_MAX_MATCHES_PER_AGENT = 5;
var SNIPPET_LEAD = 30;
var SNIPPET_TRAIL = 60;
var ELLIPSIS = "\u2026";
function entrySearchText(entry) {
  switch (entry.kind) {
    case "message":
      return entry.content;
    case "send-message":
      return entry.message.type === "text" ? entry.message.content : "";
    case "notice":
      return entry.text;
    default:
      return "";
  }
}
function flatten(text) {
  return text.replace(/\s+/g, " ").trim();
}
function buildContentSnippet(text, normalizedQuery) {
  if (normalizedQuery.length === 0) return null;
  const flat = flatten(text);
  const index = flat.toLowerCase().indexOf(normalizedQuery);
  if (index < 0) return null;
  const start = Math.max(0, index - SNIPPET_LEAD);
  const end = Math.min(flat.length, index + normalizedQuery.length + SNIPPET_TRAIL);
  const core = flat.slice(start, end);
  const prefix = start > 0 ? ELLIPSIS : "";
  const suffix = end < flat.length ? ELLIPSIS : "";
  return `${prefix}${core}${suffix}`;
}

// src/host/extensions/content-search/search-index-db.ts
var INDEXED_BODY_MAX_CHARS = 2e4;
var FTS_QUERY_MAX_TERMS = 8;
var SNIPPET_CONTEXT_TOKENS = 16;
var META_RECONCILE_DONE = "reconcile_done";
var ATTACHMENT_KINDS = new Set(SAND_ATTACHMENT_KINDS);
function parseAttachmentKind(kind) {
  return ATTACHMENT_KINDS.has(kind) ? kind : "file";
}
var CORE_SCHEMA = `
CREATE TABLE IF NOT EXISTS meta (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
) STRICT;
CREATE TABLE IF NOT EXISTS agents (
  agent_id TEXT PRIMARY KEY,
  fingerprint TEXT NOT NULL
) STRICT;
CREATE TABLE IF NOT EXISTS messages (
  id INTEGER PRIMARY KEY,
  agent_id TEXT NOT NULL,
  entry_id TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  timestamp_ms INTEGER NOT NULL,
  body TEXT NOT NULL,
  UNIQUE(agent_id, entry_id)
) STRICT;
CREATE INDEX IF NOT EXISTS messages_agent_recency
  ON messages(agent_id, timestamp_ms DESC);
CREATE TABLE IF NOT EXISTS media (
  id INTEGER PRIMARY KEY,
  agent_id TEXT NOT NULL,
  entry_id TEXT NOT NULL,
  file_name TEXT NOT NULL,
  ext TEXT NOT NULL,
  mime TEXT,
  kind TEXT NOT NULL,
  timestamp_ms INTEGER NOT NULL,
  width INTEGER,
  height INTEGER,
  UNIQUE(agent_id, entry_id)
) STRICT;
CREATE INDEX IF NOT EXISTS media_recency ON media(timestamp_ms DESC);
`;
var FTS_SCHEMA = `
CREATE VIRTUAL TABLE IF NOT EXISTS messages_fts USING fts5(
  body,
  content='messages',
  content_rowid='id',
  tokenize='unicode61 remove_diacritics 2',
  prefix='2 3'
);
CREATE TRIGGER IF NOT EXISTS messages_fts_insert AFTER INSERT ON messages BEGIN
  INSERT INTO messages_fts(rowid, body) VALUES (new.id, new.body);
END;
CREATE TRIGGER IF NOT EXISTS messages_fts_delete AFTER DELETE ON messages BEGIN
  INSERT INTO messages_fts(messages_fts, rowid, body)
    VALUES ('delete', old.id, old.body);
END;
CREATE TRIGGER IF NOT EXISTS messages_fts_update AFTER UPDATE ON messages BEGIN
  INSERT INTO messages_fts(messages_fts, rowid, body)
    VALUES ('delete', old.id, old.body);
  INSERT INTO messages_fts(rowid, body) VALUES (new.id, new.body);
END;
CREATE VIRTUAL TABLE IF NOT EXISTS media_fts USING fts5(
  file_name,
  content='media',
  content_rowid='id',
  tokenize='unicode61 remove_diacritics 2',
  prefix='2 3'
);
CREATE TRIGGER IF NOT EXISTS media_fts_insert AFTER INSERT ON media BEGIN
  INSERT INTO media_fts(rowid, file_name) VALUES (new.id, new.file_name);
END;
CREATE TRIGGER IF NOT EXISTS media_fts_delete AFTER DELETE ON media BEGIN
  INSERT INTO media_fts(media_fts, rowid, file_name)
    VALUES ('delete', old.id, old.file_name);
END;
CREATE TRIGGER IF NOT EXISTS media_fts_update AFTER UPDATE ON media BEGIN
  INSERT INTO media_fts(media_fts, rowid, file_name)
    VALUES ('delete', old.id, old.file_name);
  INSERT INTO media_fts(rowid, file_name) VALUES (new.id, new.file_name);
END;
`;
function isFts5Available() {
  let db;
  try {
    db = new import_node_sqlite2.DatabaseSync(":memory:");
    db.exec("CREATE VIRTUAL TABLE fts5_probe USING fts5(x)");
    return true;
  } catch (error) {
    reportFallback("search_index_db", error);
    return false;
  } finally {
    db?.close();
  }
}
function openSearchIndexDb(dbPath) {
  const db = new import_node_sqlite2.DatabaseSync(dbPath);
  try {
    applyStorePragmas(db, { incrementalAutoVacuum: true });
    return db;
  } catch (error) {
    try {
      db.close();
    } catch {
    }
    throw error;
  }
}
function openSearchIndexReadDb(dbPath) {
  const db = openSearchIndexDb(dbPath);
  db.exec("PRAGMA query_only = ON");
  return db;
}
function ensureSearchIndexSchema(db, isFtsEnabled) {
  db.exec(CORE_SCHEMA);
  if (isFtsEnabled) db.exec(FTS_SCHEMA);
}
function writeReconcileDone(db) {
  db.prepare(
    "INSERT INTO meta (key, value) VALUES (?, '1') ON CONFLICT(key) DO UPDATE SET value = '1'"
  ).run(META_RECONCILE_DONE);
}
function deriveMessageRow(entry) {
  if (isHiddenOutboundAgentPeerMessageEntry(entry)) return null;
  const body = entrySearchText(entry).trim();
  if (body.length === 0) return null;
  return {
    entryId: entry.id,
    role: entry.kind === "message" ? entry.role : "assistant",
    timestampMs: wholeMs(entry.timestampMs),
    body: body.slice(0, INDEXED_BODY_MAX_CHARS)
  };
}
function wholeMs(value) {
  return typeof value === "number" && Number.isFinite(value) ? Math.round(value) : 0;
}
function wholeDimension(value) {
  return typeof value === "number" && Number.isFinite(value) ? Math.round(value) : null;
}
function mediaFileName(fileName, urlOrPath) {
  const trimmed = fileName?.trim();
  if (trimmed != null && trimmed.length > 0) return trimmed;
  let subject = urlOrPath;
  try {
    subject = new URL(urlOrPath).pathname;
  } catch {
  }
  try {
    subject = decodeURIComponent(subject);
  } catch {
  }
  return (0, import_node_path.basename)(subject);
}
function deriveMediaRow(entry) {
  let fileName;
  let urlOrPath;
  let width = null;
  let height = null;
  if (entry.kind === "user-attachment") {
    urlOrPath = entry.file_path;
    fileName = mediaFileName(entry.file_name, urlOrPath);
    width = wholeDimension(entry.width);
    height = wholeDimension(entry.height);
  } else if (entry.kind === "send-message" && entry.message.type === "attachment") {
    urlOrPath = entry.message.url;
    fileName = mediaFileName(entry.message.file_name, urlOrPath);
  } else {
    return null;
  }
  if (fileName.length === 0) return null;
  const ext = (0, import_node_path.extname)(fileName).toLowerCase();
  const mime = imageMimeFromPath(fileName) ?? videoMimeFromPath(fileName) ?? audioMimeFromPath(fileName) ?? null;
  return {
    entryId: entry.id,
    fileName,
    ext,
    mime,
    kind: classifyAttachment({ fileName, urlOrPath }),
    timestampMs: wholeMs(entry.timestampMs),
    width,
    height
  };
}
function searchTerms(query) {
  return query.normalize("NFKC").trim().split(/\s+/).filter((term) => term.length > 0).slice(0, FTS_QUERY_MAX_TERMS);
}
function buildFtsMatchQuery(query) {
  const terms = searchTerms(query);
  if (terms.length === 0) return null;
  return terms.map((term) => `"${term.replaceAll('"', '""')}"*`).join(" ");
}
function termConjunction(column, terms) {
  return terms.map(() => `instr(lower(${column}), lower(?)) > 0`).join(" AND ");
}
function flattenSnippet(text) {
  return text.replace(/\s+/g, " ").trim();
}
var EFFECTIVE_TIMESTAMP = `CASE
	WHEN m.timestamp_ms > 0 THEN m.timestamp_ms
	ELSE COALESCE(
		(SELECT MAX(m2.timestamp_ms) FROM messages m2 WHERE m2.agent_id = m.agent_id),
		0
	)
END`;
function messageMatchSql(rowSource, snippetColumn) {
  return `SELECT
			m.agent_id AS agentId,
			m.entry_id AS entryId,
			m.role AS role,
			matched.ts AS timestampMs,
			${snippetColumn} AS snippet
		 FROM (
			SELECT match_rowid, ts FROM (
				SELECT
					match_rowid,
					ts,
					ROW_NUMBER() OVER (
						PARTITION BY agent_id
						ORDER BY ts DESC
					) AS agent_rank
				FROM (${rowSource})
			)
			WHERE agent_rank <= ${AGENT_CONTENT_SEARCH_MAX_MATCHES_PER_AGENT}
			ORDER BY ts DESC
			LIMIT ?
		 ) AS matched
		 JOIN messages m ON m.id = matched.match_rowid`;
}
function collectMessageMatches(rows, snippetOf) {
  const results = [];
  for (const row of rows) {
    if (typeof row.agentId !== "string" || typeof row.entryId !== "string" || row.role !== "user" && row.role !== "assistant" || typeof row.timestampMs !== "number") {
      continue;
    }
    const snippet = snippetOf(row);
    if (snippet == null) continue;
    results.push({
      agentId: row.agentId,
      entryId: row.entryId,
      role: row.role,
      timestampMs: row.timestampMs,
      snippet
    });
  }
  return results;
}
function searchMessages(db, query, limit, isFtsEnabled) {
  if (limit <= 0) return [];
  if (!isFtsEnabled) return searchMessagesPlain(db, query, limit);
  const match = buildFtsMatchQuery(query);
  if (match == null) return [];
  const rows = db.prepare(
    `${messageMatchSql(
      `SELECT
					messages_fts.rowid AS match_rowid,
					m.agent_id AS agent_id,
					${EFFECTIVE_TIMESTAMP} AS ts
				FROM messages_fts
				JOIN messages m ON m.id = messages_fts.rowid
				WHERE messages_fts MATCH ?`,
      `snippet(messages_fts, 0, '', '', '\u2026', ${SNIPPET_CONTEXT_TOKENS})`
    )}
			 JOIN messages_fts ON messages_fts.rowid = matched.match_rowid
			 WHERE messages_fts MATCH ?
			 ORDER BY matched.ts DESC`
  ).all(match, limit, match);
  return collectMessageMatches(
    rows,
    (row) => typeof row.snippet === "string" ? flattenSnippet(row.snippet) : null
  );
}
function searchMessagesPlain(db, query, limit) {
  const terms = searchTerms(query);
  if (terms.length === 0) return [];
  const rows = db.prepare(
    `${messageMatchSql(
      `SELECT
					m.id AS match_rowid,
					m.agent_id AS agent_id,
					${EFFECTIVE_TIMESTAMP} AS ts
				FROM messages m
				WHERE ${termConjunction("m.body", terms)}`,
      "m.body"
    )}
			 ORDER BY matched.ts DESC`
  ).all(...terms, limit);
  return collectMessageMatches(
    rows,
    (row) => typeof row.snippet === "string" ? plainSnippet(row.snippet, terms) : null
  );
}
function plainSnippet(body, terms) {
  for (const term of terms) {
    const snippet = buildContentSnippet(body, term.toLowerCase());
    if (snippet != null) return snippet;
  }
  const flat = flattenSnippet(body);
  const head = flat.slice(0, SNIPPET_CONTEXT_TOKENS * 8);
  return head.length < flat.length ? `${head}\u2026` : head;
}
var MEDIA_SELECT_COLUMNS = `
	md.agent_id AS agentId,
	md.entry_id AS entryId,
	md.file_name AS fileName,
	md.ext AS ext,
	md.mime AS mime,
	md.kind AS kind,
	md.timestamp_ms AS timestampMs,
	md.width AS width,
	md.height AS height`;
function mediaMatchRows(db, query, limit, isFtsEnabled) {
  if (isFtsEnabled) {
    const match = buildFtsMatchQuery(query);
    if (match == null) return browseMediaRows(db, limit);
    return db.prepare(
      `SELECT ${MEDIA_SELECT_COLUMNS}
				 FROM media_fts
				 JOIN media md ON md.id = media_fts.rowid
				 WHERE media_fts MATCH ?
				 ORDER BY md.timestamp_ms DESC
				 LIMIT ?`
    ).all(match, limit);
  }
  const terms = searchTerms(query);
  if (terms.length === 0) return browseMediaRows(db, limit);
  return db.prepare(
    `SELECT ${MEDIA_SELECT_COLUMNS}
			 FROM media md
			 WHERE ${termConjunction("md.file_name", terms)}
			 ORDER BY md.timestamp_ms DESC
			 LIMIT ?`
  ).all(...terms, limit);
}
function browseMediaRows(db, limit) {
  return db.prepare(
    `SELECT ${MEDIA_SELECT_COLUMNS}
			 FROM media md
			 ORDER BY md.timestamp_ms DESC
			 LIMIT ?`
  ).all(limit);
}
function searchMedia(db, query, limit, isFtsEnabled) {
  if (limit <= 0) return [];
  const rows = mediaMatchRows(db, query, limit, isFtsEnabled);
  const results = [];
  for (const row of rows) {
    if (typeof row.agentId !== "string" || typeof row.entryId !== "string" || typeof row.fileName !== "string" || typeof row.ext !== "string" || typeof row.kind !== "string" || typeof row.timestampMs !== "number") {
      continue;
    }
    results.push({
      agentId: row.agentId,
      entryId: row.entryId,
      fileName: row.fileName,
      ext: row.ext,
      mime: typeof row.mime === "string" ? row.mime : null,
      kind: parseAttachmentKind(row.kind),
      timestampMs: row.timestampMs,
      width: typeof row.width === "number" ? row.width : null,
      height: typeof row.height === "number" ? row.height : null
    });
  }
  return results;
}

// src/host/extensions/content-search/search-index-writer.ts
var import_node_fs = require("node:fs");
var import_node_path2 = require("node:path");
var import_node_sqlite3 = require("node:sqlite");
var STORE_FILENAME = "store.db";
var INCREMENTAL_VACUUM_PAGES = 512;
function prepareStatements(db) {
  return {
    upsertMessage: db.prepare(
      `INSERT INTO messages (agent_id, entry_id, role, timestamp_ms, body)
			 VALUES (?, ?, ?, ?, ?)
			 ON CONFLICT(agent_id, entry_id) DO UPDATE SET
				role = excluded.role,
				timestamp_ms = excluded.timestamp_ms,
				body = excluded.body`
    ),
    deleteMessage: db.prepare("DELETE FROM messages WHERE agent_id = ? AND entry_id = ?"),
    deleteAgentMessages: db.prepare("DELETE FROM messages WHERE agent_id = ?"),
    upsertMedia: db.prepare(
      `INSERT INTO media (
				agent_id, entry_id, file_name, ext, mime, kind,
				timestamp_ms, width, height
			 )
			 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
			 ON CONFLICT(agent_id, entry_id) DO UPDATE SET
				file_name = excluded.file_name,
				ext = excluded.ext,
				mime = excluded.mime,
				kind = excluded.kind,
				timestamp_ms = excluded.timestamp_ms,
				width = excluded.width,
				height = excluded.height`
    ),
    deleteMedia: db.prepare("DELETE FROM media WHERE agent_id = ? AND entry_id = ?"),
    deleteAgentMedia: db.prepare("DELETE FROM media WHERE agent_id = ?"),
    upsertFingerprint: db.prepare(
      `INSERT INTO agents (agent_id, fingerprint) VALUES (?, ?)
			 ON CONFLICT(agent_id) DO UPDATE SET fingerprint = excluded.fingerprint`
    ),
    deleteFingerprint: db.prepare("DELETE FROM agents WHERE agent_id = ?"),
    readFingerprint: db.prepare("SELECT fingerprint FROM agents WHERE agent_id = ?"),
    listIndexedAgentIds: db.prepare(
      `SELECT agent_id AS agentId FROM agents
			 UNION SELECT DISTINCT agent_id FROM messages
			 UNION SELECT DISTINCT agent_id FROM media`
    )
  };
}
var SandSearchIndexWriter = class {
  constructor(db, agentsRootDir) {
    this.db = db;
    this.agentsRootDir = agentsRootDir;
    this.statements = prepareStatements(db);
  }
  db;
  agentsRootDir;
  statements;
  storeConnections = /* @__PURE__ */ new Map();
  close() {
    for (const connection of this.storeConnections.values()) {
      try {
        connection.db.close();
      } catch {
      }
    }
    this.storeConnections.clear();
  }
  runJob(job) {
    switch (job.kind) {
      case "upsert-entries":
        this.upsertEntries(job.agentId, job.entries);
        return;
      case "delete-entry":
        this.deleteEntry(job.agentId, job.entryId);
        return;
      case "clear-agent":
        this.clearAgent(job.agentId);
        return;
      case "reindex-agents":
        for (const agentId of job.agentIds) this.reindexAgent(agentId);
        return;
      case "reconcile":
        this.reconcile();
        return;
    }
  }
  storeDbPath(agentId) {
    return (0, import_node_path2.join)(this.agentsRootDir, agentId, STORE_FILENAME);
  }
  evictStoreConnection(agentId) {
    const cached = this.storeConnections.get(agentId);
    if (cached == null) return;
    this.storeConnections.delete(agentId);
    try {
      cached.db.close();
    } catch {
    }
  }
  storeConnection(agentId) {
    const cached = this.storeConnections.get(agentId);
    if (cached != null) return cached;
    const path = this.storeDbPath(agentId);
    if (!(0, import_node_fs.existsSync)(path)) return null;
    try {
      const db = new import_node_sqlite3.DatabaseSync(path, { readOnly: true });
      db.exec(`PRAGMA busy_timeout = ${DB_BUSY_TIMEOUT_MS}`);
      const connection = { db };
      this.storeConnections.set(agentId, connection);
      return connection;
    } catch {
      return null;
    }
  }
  readStoreFingerprint(agentId) {
    const connection = this.storeConnection(agentId);
    if (connection == null) return null;
    try {
      const row = connection.db.prepare(
        "SELECT COUNT(*) AS count, COALESCE(MAX(seq), 0) AS maxSeq FROM transcript_entries"
      ).get();
      if (row == null || typeof row.count !== "number" || typeof row.maxSeq !== "number") {
        return null;
      }
      return `${row.count}:${row.maxSeq}`;
    } catch {
      this.evictStoreConnection(agentId);
      return null;
    }
  }
  inTransaction(operation) {
    this.db.exec("BEGIN IMMEDIATE");
    try {
      operation();
      this.db.exec("COMMIT");
    } catch (error) {
      try {
        this.db.exec("ROLLBACK");
      } catch {
      }
      throw error;
    }
  }
  applyEntry(agentId, entry) {
    let message = null;
    let media = null;
    try {
      message = deriveMessageRow(entry);
      media = deriveMediaRow(entry);
    } catch {
    }
    if (message != null) {
      this.statements.upsertMessage.run(
        agentId,
        message.entryId,
        message.role,
        message.timestampMs,
        message.body
      );
    } else {
      this.statements.deleteMessage.run(agentId, entry.id);
    }
    if (media != null) {
      this.statements.upsertMedia.run(
        agentId,
        media.entryId,
        media.fileName,
        media.ext,
        media.mime,
        media.kind,
        media.timestampMs,
        media.width,
        media.height
      );
    } else {
      this.statements.deleteMedia.run(agentId, entry.id);
    }
  }
  refreshFingerprint(agentId) {
    const fingerprint = this.readStoreFingerprint(agentId);
    if (fingerprint == null) {
      this.statements.deleteFingerprint.run(agentId);
    } else {
      this.statements.upsertFingerprint.run(agentId, fingerprint);
    }
  }
  upsertEntries(agentId, entries) {
    if (entries.length === 0) return;
    this.inTransaction(() => {
      for (const entry of entries) this.applyEntry(agentId, entry);
      this.refreshFingerprint(agentId);
    });
  }
  deleteEntry(agentId, entryId) {
    this.inTransaction(() => {
      this.statements.deleteMessage.run(agentId, entryId);
      this.statements.deleteMedia.run(agentId, entryId);
      this.refreshFingerprint(agentId);
    });
  }
  clearAgent(agentId) {
    this.evictStoreConnection(agentId);
    this.inTransaction(() => {
      this.statements.deleteAgentMessages.run(agentId);
      this.statements.deleteAgentMedia.run(agentId);
      this.statements.deleteFingerprint.run(agentId);
    });
    this.db.exec(`PRAGMA incremental_vacuum(${INCREMENTAL_VACUUM_PAGES})`);
  }
  reindexAgent(agentId) {
    this.evictStoreConnection(agentId);
    if (!(0, import_node_fs.existsSync)(this.storeDbPath(agentId))) {
      this.clearAgent(agentId);
      return;
    }
    const connection = this.storeConnection(agentId);
    if (connection == null) return;
    let rows;
    try {
      rows = connection.db.prepare("SELECT seq, entry FROM transcript_entries ORDER BY seq").all();
    } catch {
      this.evictStoreConnection(agentId);
      return;
    }
    let maxSeq = 0;
    const entries = [];
    for (const row of rows) {
      if (typeof row.seq === "number" && row.seq > maxSeq) maxSeq = row.seq;
      if (typeof row.entry !== "string") continue;
      try {
        const parsed = JSON.parse(row.entry);
        if (parsed != null && typeof parsed === "object" && typeof parsed.id === "string" && typeof parsed.kind === "string") {
          entries.push(parsed);
        }
      } catch {
      }
    }
    const fingerprint = `${rows.length}:${maxSeq}`;
    this.inTransaction(() => {
      this.statements.deleteAgentMessages.run(agentId);
      this.statements.deleteAgentMedia.run(agentId);
      for (const entry of entries) this.applyEntry(agentId, entry);
      this.statements.upsertFingerprint.run(agentId, fingerprint);
    });
    this.db.exec(`PRAGMA incremental_vacuum(${INCREMENTAL_VACUUM_PAGES})`);
  }
  reconcile() {
    let agentDirs;
    try {
      agentDirs = (0, import_node_fs.readdirSync)(this.agentsRootDir, { withFileTypes: true }).filter((dirent) => dirent.isDirectory()).map((dirent) => dirent.name);
    } catch {
      agentDirs = [];
    }
    const onDisk = new Set(agentDirs);
    const indexedRows = this.statements.listIndexedAgentIds.all();
    for (const row of indexedRows) {
      if (typeof row.agentId !== "string") continue;
      if (!onDisk.has(row.agentId)) this.clearAgent(row.agentId);
    }
    for (const agentId of agentDirs) {
      if (!(0, import_node_fs.existsSync)(this.storeDbPath(agentId))) continue;
      const storeFingerprint = this.readStoreFingerprint(agentId);
      if (storeFingerprint == null) continue;
      const indexed = this.statements.readFingerprint.get(agentId);
      if (indexed?.fingerprint !== storeFingerprint) {
        this.reindexAgent(agentId);
      }
    }
    writeReconcileDone(this.db);
  }
};

// src/host/extensions/content-search/search-index-worker.ts
function errorMessage(error) {
  return error instanceof Error ? error.message : String(error);
}
function serveJobs(port2, config) {
  invariant(
    typeof config.indexDbPath === "string" && typeof config.agentsRootDir === "string",
    "search-index-worker needs indexDbPath + agentsRootDir"
  );
  const db = openSearchIndexDb(config.indexDbPath);
  ensureSearchIndexSchema(db, isFts5Available());
  const writer = new SandSearchIndexWriter(db, config.agentsRootDir);
  port2.on("message", (request) => {
    let response;
    try {
      writer.runJob(request.job);
      response = { requestId: request.requestId, ok: true };
    } catch (error) {
      response = {
        requestId: request.requestId,
        ok: false,
        message: errorMessage(error),
        isIndexCorrupt: isSqliteCorruptError(error)
      };
    }
    port2.postMessage(response);
  });
}
function runQuery(db, { kind, query, limit }, isFtsEnabled) {
  switch (kind) {
    case "messages":
      return { kind, matches: searchMessages(db, query, limit, isFtsEnabled) };
    case "media":
      return { kind, matches: searchMedia(db, query, limit, isFtsEnabled) };
    default: {
      const exhaustive = kind;
      return exhaustive;
    }
  }
}
function serveQueries(port2, config) {
  invariant(
    typeof config.indexDbPath === "string" && typeof config.isFtsEnabled === "boolean",
    "search-index-worker reader needs indexDbPath + isFtsEnabled"
  );
  let db;
  port2.on("message", (request) => {
    let response;
    try {
      db ??= openSearchIndexReadDb(config.indexDbPath);
      response = {
        requestId: request.requestId,
        ok: true,
        ...runQuery(db, request.query, config.isFtsEnabled)
      };
    } catch (error) {
      response = {
        requestId: request.requestId,
        ok: false,
        message: errorMessage(error),
        errorClass: errorLogTag(error),
        isIndexCorrupt: isSqliteCorruptError(error)
      };
    }
    port2.postMessage(response);
  });
}
var port = import_node_worker_threads.parentPort;
invariant(port != null, "search-index-worker must run as a worker_thread");
var data = import_node_worker_threads.workerData;
switch (data?.role) {
  case "writer":
    serveJobs(port, data);
    break;
  case "reader":
    serveQueries(port, data);
    break;
  default:
    invariant(false, "search-index-worker needs a writer or reader role");
}

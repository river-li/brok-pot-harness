/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/grok-bot-harness/src/runner/transcript-trace.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_agent_pb();
init_dist3();
init_zod();
var SAND_TRANSCRIPT_DEFAULT_MESSAGES = 30;
var SAND_TRANSCRIPT_MAX_MESSAGES = 200;
var SAND_TRANSCRIPT_MAX_BYTES = 48e3;
var SAND_TRANSCRIPT_MAX_PART_CHARS = 4e3;
var TRANSCRIPT_BLOB_READ_CONCURRENCY = 8;
var textPartSchema2 = external_exports.object({ type: external_exports.literal("text"), text: external_exports.string() });
var reasoningPartSchema2 = external_exports.object({ type: external_exports.literal("reasoning"), text: external_exports.string() });
var imagePartSchema2 = external_exports.object({ type: external_exports.literal("image") });
var filePartSchema2 = external_exports.object({ type: external_exports.literal("file"), filename: external_exports.string().optional() });
var toolCallPartSchema2 = external_exports.object({
  type: external_exports.literal("tool-call"),
  toolCallId: external_exports.string().optional(),
  toolName: external_exports.string(),
  args: external_exports.unknown().optional(),
  input: external_exports.unknown().optional()
});
var toolResultPartSchema2 = external_exports.object({
  type: external_exports.literal("tool-result"),
  toolCallId: external_exports.string().optional(),
  toolName: external_exports.string(),
  result: external_exports.unknown().optional(),
  output: external_exports.unknown().optional()
});
var messagePartSchema = external_exports.discriminatedUnion("type", [
  textPartSchema2,
  reasoningPartSchema2,
  imagePartSchema2,
  filePartSchema2,
  toolCallPartSchema2,
  toolResultPartSchema2
]);
var promptMessageSchema = external_exports.object({
  role: external_exports.string(),
  content: external_exports.union([external_exports.string(), external_exports.array(external_exports.unknown())]).optional(),
  providerOptions: external_exports.object({ cursor: external_exports.object({ isSummary: external_exports.boolean().optional() }).optional() }).optional()
});
function stripSandPromptMarkers(text2) {
  let stripped = text2;
  for (const marker17 of [SAND_HIDDEN_PROMPT_MARKER, SAND_TRUSTED_AUTOMATION_PROMPT_MARKER]) {
    if (stripped.startsWith(marker17)) {
      stripped = stripped.slice(marker17.length);
    }
  }
  return stripped;
}
function boundedText2(text2) {
  return truncateMiddle(text2, SAND_TRANSCRIPT_MAX_PART_CHARS);
}
function boundedPayload(value) {
  if (typeof value === "string") return boundedText2(value);
  let serialized;
  try {
    serialized = JSON.stringify(value);
  } catch {
    return "[unserializable]";
  }
  if (serialized === void 0) return null;
  return serialized.length <= SAND_TRANSCRIPT_MAX_PART_CHARS ? value : boundedText2(serialized);
}
var PREAMBLE_BLOCK_PATTERNS = ["available_subagent_types", "dynamic_tool_catalog"].map(
  (tag) => new RegExp(`<${tag}(?:\\s[^>]*)?>[\\s\\S]*?</${tag}>`, "g")
);
function userTextOf(text2) {
  let stripped = stripContextTags(stripSandPromptMarkers(text2));
  for (const pattern of PREAMBLE_BLOCK_PATTERNS) {
    stripped = stripped.replace(pattern, "");
  }
  return stripped.trim();
}
function tracePartOf(part, role) {
  switch (part.type) {
    case "text": {
      const text2 = role === "user" ? userTextOf(part.text) : part.text.trim();
      return text2.length === 0 ? void 0 : { type: "text", text: boundedText2(text2) };
    }
    case "reasoning": {
      const thinking = part.text.trim();
      return thinking.length === 0 ? void 0 : { type: "thinking", thinking: boundedText2(thinking) };
    }
    case "image":
      return { type: "text", text: "[Image]" };
    case "file":
      return {
        type: "text",
        text: part.filename === void 0 ? "[File]" : `[File: ${part.filename}]`
      };
    case "tool-call":
      return {
        type: "tool_use",
        ...part.toolCallId === void 0 ? {} : { id: part.toolCallId },
        name: part.toolName,
        input: boundedPayload(part.args ?? part.input ?? {})
      };
    case "tool-result":
      return {
        type: "tool_result",
        ...part.toolCallId === void 0 ? {} : { tool_use_id: part.toolCallId },
        name: part.toolName,
        result: boundedPayload(part.result ?? part.output ?? null)
      };
  }
}
function contentParts(message) {
  const { content, role } = message;
  if (typeof content === "string") {
    const text2 = role === "user" ? userTextOf(content) : content.trim();
    return text2.length === 0 ? [] : [{ type: "text", text: boundedText2(text2) }];
  }
  const parts = [];
  for (const raw of content ?? []) {
    const parsed2 = messagePartSchema.safeParse(raw);
    if (!parsed2.success) continue;
    const part = tracePartOf(parsed2.data, role);
    if (part !== void 0) parts.push(part);
  }
  return parts;
}
function formatSandTranscriptTraceLine(message) {
  const parsed2 = promptMessageSchema.safeParse(message);
  if (!parsed2.success) return void 0;
  const { role, providerOptions } = parsed2.data;
  if (role === "system" || providerOptions?.cursor?.isSummary === true) {
    return void 0;
  }
  const content = contentParts(parsed2.data);
  if (content.length === 0) return void 0;
  return JSON.stringify({ role, message: { content } });
}
function renderSandSpokenMessages(messages2) {
  const lines2 = [];
  let bytes = 0;
  let firstPosition;
  for (let index = messages2.length - 1; index >= 0; index--) {
    const message = messages2[index];
    if (message === void 0) continue;
    const line = JSON.stringify({
      role: message.role,
      message: { content: [{ type: "text", text: boundedText2(message.text) }] }
    });
    if (lines2.length > 0 && bytes + line.length > SAND_TRANSCRIPT_MAX_BYTES) {
      return { lines: lines2, omittedOlder: true, firstPosition };
    }
    bytes += line.length;
    lines2.unshift(line);
    firstPosition = message.position;
  }
  return { lines: lines2, omittedOlder: false, firstPosition };
}
async function listMessageBlobIds(ctx, blobStore, state) {
  const ids = [];
  for (const archiveRef of state.summaryArchives) {
    const archiveBytes = await blobStore.getBlob(ctx, archiveRef);
    if (archiveBytes === void 0) continue;
    ids.push(...ConversationSummaryArchive.fromBinary(archiveBytes).summarizedMessages);
  }
  ids.push(...state.rootPromptMessagesJson);
  return ids;
}
function clampSandTranscriptMessageLimit(limit) {
  const safe = limit !== void 0 && Number.isFinite(limit) && limit > 0 ? Math.floor(limit) : SAND_TRANSCRIPT_DEFAULT_MESSAGES;
  return Math.min(safe, SAND_TRANSCRIPT_MAX_MESSAGES);
}
async function readSandTranscriptWindow(args) {
  if (args.state === void 0) {
    return { lines: [], firstIndex: 0, endIndex: 0, totalMessages: 0 };
  }
  const ids = await listMessageBlobIds(args.ctx, args.blobStore, args.state);
  const totalMessages = ids.length;
  const endIndex = args.before === void 0 ? totalMessages : Math.max(0, Math.min(args.before, totalMessages));
  const limit = clampSandTranscriptMessageLimit(args.limit);
  const lines2 = [];
  let firstIndex = endIndex;
  let bytes = 0;
  let reachedByteCap = false;
  while (firstIndex > 0 && lines2.length < limit && !reachedByteCap) {
    const chunkEnd = firstIndex;
    const chunkStart = Math.max(0, chunkEnd - (limit - lines2.length));
    const chunkLines = await asyncMapValues(
      ids.slice(chunkStart, chunkEnd),
      async (blobId) => {
        const hydrated = await hydrateBlobIds(args.ctx, args.blobStore, [blobId]);
        return hydrated.messages.map((message) => formatSandTranscriptTraceLine(message)).find((formatted) => formatted !== void 0);
      },
      { max: TRANSCRIPT_BLOB_READ_CONCURRENCY }
    );
    for (let index = chunkEnd - 1; index >= chunkStart; index--) {
      const line = chunkLines[index - chunkStart];
      if (line !== void 0) {
        if (lines2.length > 0 && bytes + line.length > SAND_TRANSCRIPT_MAX_BYTES) {
          reachedByteCap = true;
          break;
        }
        bytes += line.length;
        lines2.unshift(line);
      }
      firstIndex = index;
    }
  }
  return { lines: lines2, firstIndex, endIndex, totalMessages };
}


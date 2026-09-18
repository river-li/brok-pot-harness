var import_node_crypto86 = require("node:crypto");
init_zod();
init_errors();
init_unknown_record();
var TranscriptJournalFailure = class extends SandDomainError {
  isTranscriptJournalFailure = true;
};
var TranscriptOccurrenceConflictError = class extends TranscriptJournalFailure {
  name = "TranscriptOccurrenceConflictError";
};
var TranscriptJournalCorruptionError = class extends TranscriptJournalFailure {
  name = "TranscriptJournalCorruptionError";
};
var TranscriptJournalWriteError = class extends TranscriptJournalFailure {
  name = "TranscriptJournalWriteError";
};
function sha2562(value) {
  return (0, import_node_crypto86.createHash)("sha256").update(value).digest("hex");
}
function bytesEqual(left, right) {
  return Buffer.from(left).equals(Buffer.from(right));
}
function checkpointIdentity(checkpoint) {
  const turnHex = (index) => {
    const turn = checkpoint.turns.at(index);
    return turn == null ? "" : Buffer.from(turn).toString("hex");
  };
  return sha2562(`${checkpoint.turns.length}:${turnHex(-2)}:${turnHex(-1)}`);
}
function isMissingFile(error41) {
  return error41 instanceof Error && "code" in error41 && error41.code === "ENOENT";
}
function fileIdentity(stats) {
  return {
    size: Number(stats.size),
    device: String(stats.dev),
    inode: String(stats.ino)
  };
}
var sha256HexSchema = external_exports.string().regex(/^[0-9a-f]{64}$/);
var journalCountSchema = external_exports.number().int().nonnegative().max(Number.MAX_SAFE_INTEGER);
var deferredStepSchema = external_exports.object({ turnIndex: journalCountSchema, stepIndex: journalCountSchema }).strict();
var pendingCheckpointSchema = external_exports.object({
  version: external_exports.literal(1),
  previousCheckpointHash: sha256HexSchema,
  checkpointHash: sha256HexSchema,
  appendOffset: journalCountSchema,
  fileDevice: external_exports.string(),
  fileInode: external_exports.string(),
  lines: external_exports.array(external_exports.string()),
  cursor: external_exports.object({ turnCount: journalCountSchema, deferredStep: deferredStepSchema.nullish() }).strict()
}).strict();
function describeIssues2(error41) {
  return error41.issues.map(
    (issue2) => issue2.path.length === 0 ? issue2.message : `${issue2.path.join(".")}: ${issue2.message}`
  ).join("; ");
}
function parseDeferredStep(value) {
  if (value == null) return void 0;
  const parsed2 = deferredStepSchema.safeParse(value);
  if (!parsed2.success) {
    throw new TranscriptJournalCorruptionError(
      `transcript deferred cursor is invalid: ${describeIssues2(parsed2.error)}`
    );
  }
  return parsed2.data;
}
function parsePendingCheckpoint(raw) {
  const value = JSON.parse(raw);
  if (!isUnknownRecord(value)) {
    throw new TranscriptJournalCorruptionError("pending transcript checkpoint is not an object");
  }
  const parsed2 = pendingCheckpointSchema.safeParse(value);
  if (!parsed2.success) {
    throw new TranscriptJournalCorruptionError(
      `pending transcript checkpoint is invalid: ${describeIssues2(parsed2.error)}`
    );
  }
  for (const line of parsed2.data.lines) {
    const envelope = JSON.parse(line);
    if (!isUnknownRecord(envelope) || !("role" in envelope) || !("message" in envelope)) {
      throw new TranscriptJournalCorruptionError(
        "pending transcript line does not use the legacy message envelope"
      );
    }
  }
  const { cursor, ...checkpoint } = parsed2.data;
  return {
    ...checkpoint,
    cursor: {
      turnCount: cursor.turnCount,
      ...cursor.deferredStep == null ? {} : { deferredStep: cursor.deferredStep }
    }
  };
}
async function writeAll(handle, bytes, position) {
  let written = 0;
  while (written < bytes.byteLength) {
    const result = await handle.write(
      bytes,
      written,
      bytes.byteLength - written,
      position + written
    );
    if (result.bytesWritten === 0) {
      throw new TranscriptJournalWriteError("transcript JSONL write made no progress");
    }
    written += result.bytesWritten;
  }
  return position + written;
}
function formatTextLine(role, text2) {
  return formatSingleMessageJsonl({ role, content: text2 });
}
function formatToolLine(role, name17, payload) {
  return JSON.stringify({
    role,
    message: {
      content: role === "assistant" ? [{ type: "tool_use", name: name17, input: payload }] : [{ type: "tool_result", name: name17, result: payload }]
    }
  });
}
function toolParts(step) {
  if (step.message.case !== "toolCall") return null;
  const tool = step.message.value.tool;
  if (tool.case == null) return null;
  const name17 = tool.case === "mcpToolCall" ? tool.value.args?.toolName ?? tool.value.args?.name ?? "mcp" : tool.case.replace(/ToolCall$/, "").replace(/([a-z0-9])([A-Z])/g, "$1_$2").toLowerCase();
  return {
    name: name17,
    input: tool.value.args?.toJson() ?? {},
    ...tool.value.result == null ? {} : { result: tool.value.result.toJson() }
  };
}

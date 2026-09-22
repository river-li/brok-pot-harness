var import_promises81 = require("node:fs/promises");
var import_node_path177 = require("node:path");
init_errors();
var UnexpectedIncrementalFullWriteError = class extends SandDomainError {
  name = "UnexpectedIncrementalFullWriteError";
};
function countTranscriptMessageLines(jsonl) {
  let count = 0;
  for (const line of jsonl.split("\n")) {
    const trimmed = line.trim();
    if (trimmed.length === 0) continue;
    let value;
    try {
      value = JSON.parse(trimmed);
    } catch {
      value = null;
    }
    if (value != null && typeof value === "object" && "type" in value && (value.type === "metadata" || value.type === "turn_ended")) {
      continue;
    }
    count++;
  }
  return count;
}
var LegacyFileTranscriptMirror = class {
  constructor(transcriptsDir) {
    this.transcriptsDir = transcriptsDir;
  }
  transcriptsDir;
  jsonlPathFor(conversationId) {
    const safeId = getSafeConversationId2(conversationId);
    return (0, import_node_path177.join)(this.transcriptsDir, safeId, `${safeId}.jsonl`);
  }
  transcriptStore(blobStore, writeTranscript) {
    return new TranscriptStore(this.transcriptsDir, blobStore, writeTranscript, {
      writeText: false,
      writeJsonl: true,
      appendFile: async (filePath, content) => {
        await (0, import_promises81.mkdir)((0, import_node_path177.dirname)(filePath), { recursive: true });
        await (0, import_promises81.appendFile)(filePath, content, "utf8");
      },
      fallbackToFullWriteOnIncrementalFailure: false,
      pathResolver: (id, ext2) => {
        const safeId = getSafeConversationId2(id);
        return (0, import_node_path177.join)(this.transcriptsDir, safeId, `${safeId}.${ext2}`);
      }
    });
  }
  async writeIncremental(ctx, conversationId, state, blobStore, previousRootPromptCount) {
    const currentCount = state.rootPromptMessagesJson.length;
    if (previousRootPromptCount === 0 || currentCount < previousRootPromptCount) {
      return null;
    }
    const store = this.transcriptStore(blobStore, async () => {
      throw new UnexpectedIncrementalFullWriteError(
        "incremental transcript mirror attempted a full write"
      );
    });
    const writtenCount = await store.writeFromStateIncremental(
      ctx,
      state,
      conversationId,
      previousRootPromptCount
    );
    return writtenCount === 0 ? null : writtenCount;
  }
  async writeFull(ctx, conversationId, state, blobStore) {
    let wroteFile = false;
    const store = this.transcriptStore(blobStore, async (filePath, content) => {
      await (0, import_promises81.mkdir)((0, import_node_path177.dirname)(filePath), { recursive: true });
      if (filePath === this.jsonlPathFor(conversationId)) {
        let existing;
        try {
          existing = await (0, import_promises81.readFile)(filePath, "utf8");
        } catch (error42) {
          reportFallbackUnlessAbsent("legacy_transcript_mirror", error42);
          existing = null;
        }
        if (existing != null && countTranscriptMessageLines(content) < countTranscriptMessageLines(existing)) {
          return;
        }
      }
      await (0, import_promises81.writeFile)(filePath, content, "utf8");
      wroteFile = true;
    });
    const completed = await store.writeFromStateFull(ctx, state, conversationId);
    return completed && (wroteFile || state.summaryArchives.length === 0 && state.rootPromptMessagesJson.length === 0);
  }
};

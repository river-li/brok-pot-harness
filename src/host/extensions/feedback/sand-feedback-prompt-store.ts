var import_node_fs61 = require("node:fs");
var import_node_path105 = require("node:path");
init_unknown_record();
function coerceEpochMs(value) {
  return typeof value === "number" && Number.isFinite(value) ? value : void 0;
}
function parseFeedbackPromptFile(raw) {
  let value;
  try {
    value = JSON.parse(raw);
  } catch {
    return { version: 1 };
  }
  if (!isUnknownRecord(value)) return { version: 1 };
  const firstSeenAtMs = coerceEpochMs(value.firstSeenAtMs);
  const lastShownAtMs = coerceEpochMs(value.lastShownAtMs);
  return {
    version: 1,
    ...firstSeenAtMs != null ? { firstSeenAtMs } : {},
    ...lastShownAtMs != null ? { lastShownAtMs } : {}
  };
}
var SandFeedbackPromptStore = class {
  constructor(rootDir, logWriteFailure) {
    this.logWriteFailure = logWriteFailure;
    this.filePath = (0, import_node_path105.join)(rootDir, SAND_FEEDBACK_PROMPT_FILE_NAME);
  }
  logWriteFailure;
  filePath;
  ensureFirstSeenAtMs(nowMs2) {
    const file2 = this.read();
    if (file2.firstSeenAtMs != null) return file2.firstSeenAtMs;
    this.write({ ...file2, firstSeenAtMs: nowMs2 });
    return nowMs2;
  }
  lastShownAtMs() {
    return this.read().lastShownAtMs ?? null;
  }
  markShown(nowMs2) {
    this.write({ ...this.read(), lastShownAtMs: nowMs2 });
  }
  read() {
    try {
      return parseFeedbackPromptFile((0, import_node_fs61.readFileSync)(this.filePath, "utf8"));
    } catch (error41) {
      reportFallbackUnlessAbsent("sand_feedback_prompt_store", error41);
      return { version: 1 };
    }
  }
  write(file2) {
    try {
      writeFileAtomicSync(this.filePath, JSON.stringify(file2));
    } catch (error41) {
      this.logWriteFailure(`feedback prompt store write failed: ${String(error41)}`);
    }
  }
};

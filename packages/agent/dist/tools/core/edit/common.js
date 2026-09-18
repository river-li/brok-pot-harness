var logger80 = createLogger("@anysphere/agent");
var PLAN_MODE_NON_MARKDOWN_EDIT_ERROR = "Cannot edit non markdown files in plan mode";
function assertPlanModeAllowsFileEdit(path30, stateHandler) {
  if (stateHandler.mode !== AgentMode.PLAN || isPlanModeAllowedEditPath(path30)) {
    return;
  }
  throw new ToolCallRejectedError(PLAN_MODE_NON_MARKDOWN_EDIT_ERROR);
}
var editCommonPerformEditCounter = createCounter("agent.tools.edit_common.perform_edit.total", {
  description: "Total performEdit operations",
  labelNames: []
});
var editCommonPerformEditSuccessCounter = createCounter("agent.tools.edit_common.perform_edit.success", {
  description: "Successful performEdit operations",
  labelNames: []
});
var editCommonPerformEditErrorCounter = createCounter("agent.tools.edit_common.perform_edit.error", {
  description: "Failed performEdit operations",
  labelNames: ["error_type"]
});
var editCommonPerformEditLatencyHistogram = createHistogram("agent.tools.edit_common.perform_edit.latency_ms", {
  description: "Latency of performEdit operations in milliseconds",
  labelNames: []
});
var editCommonPerformWriteCounter = createCounter("agent.tools.edit_common.perform_write.total", {
  description: "Total performWrite operations",
  labelNames: []
});
var editCommonPerformWriteErrorCounter = createCounter("agent.tools.edit_common.perform_write.error", {
  description: "Failed performWrite operations",
  labelNames: ["error_type"]
});
var { dir: workerDir, extension } = resolveWorkerLocation(__import_meta_url, "diff-worker");
var sanitizedEnvForWorkers = Object.fromEntries(Object.entries(process.env).filter(([key, value]) => key !== "NSOLID_STATSD" && value !== void 0));
var _piscinaWorkerPool;
function isSeaProcess() {
  return "sea" in process.versions;
}
function getPiscinaWorkerPool() {
  if (isSeaProcess()) {
    throw new Error("Piscina worker pool is not available in the self-contained worker SEA");
  }
  if (_piscinaWorkerPool === void 0) {
    _piscinaWorkerPool = new import_piscina.Piscina({
      minThreads: Math.max(1, Math.floor(import_node_os14.default.availableParallelism() / 2)),
      maxThreads: Math.max(1, Math.floor(import_node_os14.default.availableParallelism() / 2)),
      execArgv: extension === "ts" ? ["--experimental-strip-types"] : void 0,
      env: sanitizedEnvForWorkers
    });
  }
  return _piscinaWorkerPool;
}
var DIFF_SIZE_THRESHOLD = 256 * 1024;
function isNotebookViewTypeResolutionError(errorMessage4) {
  return errorMessage4.includes("Missing viewType for");
}
var NOTEBOOK_VIEW_TYPE_MODEL_ERROR = "This notebook could not be opened for editing because the editor environment has no notebook provider for it (for example, Jupyter/notebook support is unavailable). This is an environment limitation, not a problem with the edit itself \u2014 retrying will not help.";
var WritePermissionDeniedError = class extends CustomToolCallError {
  constructor(isReadonly, message, modelMessage) {
    super(ToolErrorClassification.UNEXPECTED_ENVIRONMENT, {
      error: message,
      clientVisibleErrorMessage: message,
      modelVisibleErrorMessage: modelMessage
    });
    this.isReadonly = isReadonly;
  }
};
var WriteRejectedError = class extends CustomToolCallError {
  constructor(reason, message) {
    super(ToolErrorClassification.USER_REJECTED, {
      error: message,
      clientVisibleErrorMessage: message,
      modelVisibleErrorMessage: reason
    });
    this.reason = reason;
  }
};
async function performWrite(ctx, resourceAccessor, path30, content, editInfo, meta, stateHandler) {
  editCommonPerformWriteCounter.increment(ctx, 1);
  assertPlanModeAllowsFileEdit(path30, stateHandler);
  const writeExecutor = resourceAccessor.get(writeExecutorResource);
  const writeArgs = new WriteArgs({
    path: path30,
    fileText: content,
    toolCallId: meta.toolCallId
  });
  const writeExecId = generateSeededUuid(`${meta.toolCallId}-write`);
  const writeResult2 = await writeExecutor.execute(ctx, writeArgs, {
    execId: writeExecId,
    hookContextCollector: meta.hookContextCollector,
    // So skipPathWriteDrain only applies when eager decoration will
    // actually run for this write (meta.enableAgentStoreConflictNotices).
    enableAgentStoreConflictNotices: meta.enableAgentStoreConflictNotices === true
  });
  if (writeResult2.result.case === void 0) {
    editCommonPerformWriteErrorCounter.increment(ctx, 1, {
      error_type: "unknown"
    });
    throw new ToolCallError({
      clientVisibleErrorMessage: "Unknown error",
      modelVisibleErrorMessage: "Unknown error",
      error: "Unknown error"
    });
  }
  switch (writeResult2.result.case) {
    case "success": {
      void stateHandler.recordFileState(writeResult2.result.value.path, content, editInfo.originalContent);
      const resultForModel = await decoratePostWriteResultForModel(ctx, resourceAccessor, writeResult2.result.value.path, editInfo.resultForModel, meta.toolCallId, {
        enableAgentStoreConflictNotices: meta.enableAgentStoreConflictNotices === true,
        writeBarrierTimeoutMs: meta.writeBarrierTimeoutMs,
        onWriteBarrier: meta.onWriteBarrier
      });
      return {
        modified: content,
        edit: {
          resultForModel,
          linesAdded: editInfo.linesAdded,
          linesRemoved: editInfo.linesRemoved,
          diffString: editInfo.diffString,
          beforeContentToReturn: editInfo.beforeContentToReturn ?? editInfo.originalContent,
          afterContentToReturn: editInfo.afterContentToReturn ?? content
        }
      };
    }
    case "permissionDenied": {
      editCommonPerformWriteErrorCounter.increment(ctx, 1, {
        error_type: "permission_denied"
      });
      const permissionDenied = writeResult2.result.value;
      const detail = permissionDenied.error ? `: ${permissionDenied.error}` : "";
      throw new WritePermissionDeniedError(permissionDenied.isReadonly ?? false, `Write permission denied: ${path30}${detail}`, `Write permission denied: ${path30}${detail}`);
    }
    case "noSpace":
      editCommonPerformWriteErrorCounter.increment(ctx, 1, {
        error_type: "no_space"
      });
      throw new CustomToolCallError(ToolErrorClassification.BAD_USER_DEVICE_STATE, {
        clientVisibleErrorMessage: "No space left on device",
        modelVisibleErrorMessage: "No space left on device",
        error: "No space left on device"
      });
    case "rejected": {
      const writeRejectedReason = writeResult2.result.value.reason;
      if (writeRejectedReason.includes("Failed to find tool call context")) {
        editCommonPerformWriteErrorCounter.increment(ctx, 1, {
          error_type: "write_error"
        });
        throw new ToolCallError({
          clientVisibleErrorMessage: `Edit rejected: ${writeRejectedReason}`,
          modelVisibleErrorMessage: writeRejectedReason,
          error: `Edit rejected: ${writeRejectedReason}`
        });
      }
      editCommonPerformWriteErrorCounter.increment(ctx, 1, {
        error_type: "rejected"
      });
      throw new WriteRejectedError(writeRejectedReason, `Edit rejected: ${writeRejectedReason}`);
    }
    case "error": {
      const writeError = writeResult2.result.value.error;
      if (writeError === WORKTREE_GUARD_ERROR) {
        throw new ToolCallUnexpectedEnvironmentError(writeError);
      }
      if (isNotebookViewTypeResolutionError(writeError)) {
        editCommonPerformWriteErrorCounter.increment(ctx, 1, {
          error_type: "notebook_view_type_unresolved"
        });
        throw new CustomToolCallError(ToolErrorClassification.UNEXPECTED_ENVIRONMENT, {
          error: writeError,
          clientVisibleErrorMessage: writeError,
          modelVisibleErrorMessage: NOTEBOOK_VIEW_TYPE_MODEL_ERROR
        });
      }
      editCommonPerformWriteErrorCounter.increment(ctx, 1, {
        error_type: "write_error"
      });
      throw new ToolCallError({
        clientVisibleErrorMessage: writeError,
        modelVisibleErrorMessage: writeError,
        error: writeError
      });
    }
    default: {
      const _exhaustiveCheck = writeResult2.result;
      throw new Error(`Unhandled writeResult.result: ${String(writeResult2.result)}`);
    }
  }
}
var getDiffString = async (params) => {
  const totalSize = params.original.length + params.new.length;
  const useWorker = totalSize > DIFF_SIZE_THRESHOLD && !isSeaProcess();
  if (useWorker) {
    return await getPiscinaWorkerPool().run(params, {
      filename: import_node_path52.default.join(workerDir, `./diff-worker.${extension}`)
    });
  } else {
    return calculateDiff(params);
  }
};

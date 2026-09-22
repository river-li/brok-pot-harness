init_shell_exec_pb();
async function handleBlockReason(blockReason, callbacks) {
  switch (blockReason.type) {
    case "needsApproval":
      return callbacks.onNeedsApproval(blockReason.approvalReason, blockReason.approvalDetails);
    case "userRejected":
      return callbacks.onUserRejected(blockReason.reason);
    case "cursorIgnore":
      return callbacks.onPermissionDenied("Blocked by cursor ignore");
    case "permissionsConfig":
      return callbacks.onPermissionDenied("Blocked by permissions configuration", {
        isReadonly: blockReason.isReadonly
      });
    case "cursorFiles":
      return callbacks.onPermissionDenied("Blocked by cursor files protection");
    case "adminBlock":
      return callbacks.onPermissionDenied("Blocked by admin repository block");
    case "adminCommandDenylist":
      return callbacks.onPermissionDenied(formatAdminCommandDenylistBlockReason(blockReason.pattern));
    case "unsafeResolution":
      return callbacks.onPermissionDenied(blockReason.message);
    default: {
      const _exhaustive = blockReason;
      throw new Error(`Unhandled block reason type: ${JSON.stringify(_exhaustive)}`);
    }
  }
}
function shellBlockReasonMessage(reason) {
  switch (reason.type) {
    case "userRejected":
      return reason.reason;
    case "unsafeResolution":
      return reason.message;
    case "adminCommandDenylist":
      return formatAdminCommandDenylistBlockReason(reason.pattern);
    case "needsApproval":
    case "cursorIgnore":
    case "adminBlock":
    case "permissionsConfig":
    case "cursorFiles":
      return "Command is not allowed";
    default: {
      const _exhaustive = reason;
      return `Command is not allowed (${JSON.stringify(_exhaustive)})`;
    }
  }
}
function shellCommandBlockResult(command, workingDirectory, reason) {
  if (reason.type === "permissionsConfig") {
    return {
      case: "permissionDenied",
      value: new ShellPermissionDenied({
        command,
        workingDirectory,
        error: "Command blocked by permissions configuration",
        isReadonly: reason.isReadonly ?? false
      })
    };
  }
  return {
    case: "rejected",
    value: new ShellRejected({
      command,
      workingDirectory,
      reason: shellBlockReasonMessage(reason)
    })
  };
}

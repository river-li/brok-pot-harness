var __awaiter38 = function(thisArg, _arguments, P2, generator) {
  function adopt(value) {
    return value instanceof P2 ? value : new P2(function(resolve29) {
      resolve29(value);
    });
  }
  return new (P2 || (P2 = Promise))(function(resolve29, reject2) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject2(e);
      }
    }
    function rejected3(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject2(e);
      }
    }
    function step(result) {
      result.done ? resolve29(result.value) : adopt(result.value).then(fulfilled, rejected3);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
function runBeforeShellExecutionPermissionHook(_a19) {
  return __awaiter38(this, arguments, void 0, function* ({ hookExecutor, baseHookRequest, command, cwd, sandbox }) {
    const beforeHookResponse = yield hookExecutor.executeHookForStep(HookStep.beforeShellExecution, Object.assign(Object.assign({}, baseHookRequest), {
      command,
      cwd,
      sandbox
    }));
    if ((beforeHookResponse === null || beforeHookResponse === void 0 ? void 0 : beforeHookResponse.permission) === "deny") {
      const reason = createHookDenialMessage("Command execution", beforeHookResponse.user_message);
      throw new HookDeniedError(reason);
    }
    if ((beforeHookResponse === null || beforeHookResponse === void 0 ? void 0 : beforeHookResponse.permission) === "ask") {
      return createForcePromptHookApprovalRequirement(beforeHookResponse.user_message);
    }
    return void 0;
  });
}

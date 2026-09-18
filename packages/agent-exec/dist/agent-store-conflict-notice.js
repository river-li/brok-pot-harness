var __awaiter30 = function(thisArg, _arguments, P2, generator) {
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
var RemoteAgentStoreConflictNoticeStub = class {
  execute(_ctx, args) {
    return __awaiter30(this, void 0, void 0, function* () {
      if (args.op === "ack") {
        return { kind: "acked", count: 0 };
      }
      if (args.op === "release") {
        return { kind: "released", count: 0 };
      }
      if (args.op === "noteDeferredEagerWrittenPaths") {
        return { kind: "noted", count: 0 };
      }
      return { kind: "not-applicable" };
    });
  }
};
var agentStoreConflictNoticeExecutorResource = createResource((_remote) => new RemoteAgentStoreConflictNoticeStub(), (_implementation, _controlled) => {
});
function conflictNoticeSyncAndPeek(executor, ctx, args, options2) {
  return __awaiter30(this, void 0, void 0, function* () {
    const result = yield executor.execute(ctx, Object.assign(Object.assign(Object.assign(Object.assign({ op: "syncAndPeek" }, (args === null || args === void 0 ? void 0 : args.conversationId) !== void 0 ? { conversationId: args.conversationId } : {}), (args === null || args === void 0 ? void 0 : args.writtenPaths) !== void 0 ? { writtenPaths: args.writtenPaths } : {}), (args === null || args === void 0 ? void 0 : args.timeoutMs) !== void 0 ? { timeoutMs: args.timeoutMs } : {}), (args === null || args === void 0 ? void 0 : args.eager) === true ? { eager: true } : {}), options2);
    return result;
  });
}
function conflictNoticePeek(executor, ctx, args, options2) {
  return __awaiter30(this, void 0, void 0, function* () {
    const result = yield executor.execute(ctx, Object.assign({ op: "peek" }, (args === null || args === void 0 ? void 0 : args.conversationId) !== void 0 ? { conversationId: args.conversationId } : {}), options2);
    return result;
  });
}
function conflictNoticeAck(executor, ctx, eventIds, args, options2) {
  return __awaiter30(this, void 0, void 0, function* () {
    if (eventIds.length === 0) {
      return;
    }
    yield executor.execute(ctx, Object.assign({ op: "ack", eventIds }, (args === null || args === void 0 ? void 0 : args.conversationId) !== void 0 ? { conversationId: args.conversationId } : {}), options2);
  });
}
function conflictNoticeRelease(executor, ctx, eventIds, args, options2) {
  return __awaiter30(this, void 0, void 0, function* () {
    if (eventIds.length === 0) {
      return;
    }
    yield executor.execute(ctx, Object.assign({ op: "release", eventIds }, (args === null || args === void 0 ? void 0 : args.conversationId) !== void 0 ? { conversationId: args.conversationId } : {}), options2);
  });
}
function conflictNoticeNoteDeferredEagerWrittenPaths(executor, ctx, writtenPaths, args, options2) {
  return __awaiter30(this, void 0, void 0, function* () {
    if (writtenPaths.length === 0) {
      return;
    }
    yield executor.execute(ctx, Object.assign({ op: "noteDeferredEagerWrittenPaths", writtenPaths }, (args === null || args === void 0 ? void 0 : args.conversationId) !== void 0 ? { conversationId: args.conversationId } : {}), options2);
  });
}

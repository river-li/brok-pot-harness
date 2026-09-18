var __awaiter28 = function(thisArg, _arguments, P2, generator) {
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
function toUnredactedInteractionListener(delegate, privacyMode) {
  return {
    sendUpdate(ctx, update) {
      return __awaiter28(this, void 0, void 0, function* () {
        yield delegate.sendUpdate(ctx, toRedactedInteractionUpdate(update, privacyMode));
      });
    },
    query(ctx, query) {
      return __awaiter28(this, void 0, void 0, function* () {
        const redactedResponse = yield delegate.query(ctx, toRedactedInteractionQuery(query, privacyMode));
        return fromRedactedInteractionResponse(redactedResponse, PrivacyCapability.UNSAFE_ALWAYS_ALLOWED);
      });
    },
    enqueuePostTurnEndedWork: delegate.enqueuePostTurnEndedWork ? (work) => delegate.enqueuePostTurnEndedWork(work) : void 0,
    flushPostTurnEndedWork: delegate.flushPostTurnEndedWork ? (ctx) => delegate.flushPostTurnEndedWork(ctx) : void 0
  };
}
function toRedactedInteractionListener(delegate, privacyMode) {
  return {
    sendUpdate(ctx, update) {
      return __awaiter28(this, void 0, void 0, function* () {
        yield delegate.sendUpdate(ctx, fromRedactedInteractionUpdate(update, PrivacyCapability.UNSAFE_ALWAYS_ALLOWED));
      });
    },
    query(ctx, query) {
      return __awaiter28(this, void 0, void 0, function* () {
        const response = yield delegate.query(ctx, fromRedactedInteractionQuery(query, PrivacyCapability.UNSAFE_ALWAYS_ALLOWED));
        return toRedactedInteractionResponse(response, privacyMode);
      });
    },
    enqueuePostTurnEndedWork: delegate.enqueuePostTurnEndedWork ? (work) => delegate.enqueuePostTurnEndedWork(work) : void 0,
    flushPostTurnEndedWork: delegate.flushPostTurnEndedWork ? (ctx) => delegate.flushPostTurnEndedWork(ctx) : void 0
  };
}

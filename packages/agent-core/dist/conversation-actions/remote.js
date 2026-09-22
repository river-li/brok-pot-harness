/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/agent-core/dist/conversation-actions/remote.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_dist4();
var __awaiter20 = function(thisArg, _arguments, P2, generator) {
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
var logger = createLogger("RemoteConversationActionManager");
var PENDING_STEER_FALLBACK_DEADLINE_MS = 5 * 60 * 1e3;
var NoopConversationActionReceiver = class {
  pop(_ctx) {
    return __awaiter20(this, void 0, void 0, function* () {
      return void 0;
    });
  }
  peek(_ctx) {
    return __awaiter20(this, void 0, void 0, function* () {
      return void 0;
    });
  }
};


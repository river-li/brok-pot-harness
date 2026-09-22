var __awaiter74 = function(thisArg, _arguments, P2, generator) {
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
var DeferredAnalyticsBuffer = class {
  constructor() {
    this.events = [];
  }
  track(eventName, props, timestamp3) {
    this.events.push({ eventName, props, timestamp: timestamp3 });
  }
  flush(_timeoutMs) {
    return __awaiter74(this, void 0, void 0, function* () {
    });
  }
  getEvents() {
    return this.events;
  }
  clear() {
    this.events = [];
  }
};

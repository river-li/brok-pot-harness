var __awaiter32 = function(thisArg, _arguments, P2, generator) {
  function adopt(value) {
    return value instanceof P2 ? value : new P2(function(resolve14) {
      resolve14(value);
    });
  }
  return new (P2 || (P2 = Promise))(function(resolve14, reject2) {
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
      result.done ? resolve14(result.value) : adopt(result.value).then(fulfilled, rejected3);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
var InMemoryTokenStorage = class {
  constructor() {
    this.tokens = /* @__PURE__ */ new Map();
    this.clientInfo = /* @__PURE__ */ new Map();
  }
  loadTokens(identifier) {
    return __awaiter32(this, void 0, void 0, function* () {
      return this.tokens.get(identifier);
    });
  }
  saveTokens(identifier, tokens) {
    return __awaiter32(this, void 0, void 0, function* () {
      this.tokens.set(identifier, tokens);
    });
  }
  loadClientInformation(identifier) {
    return __awaiter32(this, void 0, void 0, function* () {
      return this.clientInfo.get(identifier);
    });
  }
  saveClientInformation(identifier, clientInfo) {
    return __awaiter32(this, void 0, void 0, function* () {
      this.clientInfo.set(identifier, clientInfo);
    });
  }
};

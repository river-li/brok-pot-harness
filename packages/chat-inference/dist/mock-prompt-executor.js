var __awaiter21 = function(thisArg, _arguments, P2, generator) {
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
var __await8 = function(v2) {
  return this instanceof __await8 ? (this.v = v2, this) : new __await8(v2);
};
var __asyncGenerator8 = function(thisArg, _arguments, generator) {
  if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
  var g2 = generator.apply(thisArg, _arguments || []), i, q2 = [];
  return i = Object.create((typeof AsyncIterator === "function" ? AsyncIterator : Object).prototype), verb("next"), verb("throw"), verb("return", awaitReturn), i[Symbol.asyncIterator] = function() {
    return this;
  }, i;
  function awaitReturn(f2) {
    return function(v2) {
      return Promise.resolve(v2).then(f2, reject2);
    };
  }
  function verb(n, f2) {
    if (g2[n]) {
      i[n] = function(v2) {
        return new Promise(function(a, b2) {
          q2.push([n, v2, a, b2]) > 1 || resume(n, v2);
        });
      };
      if (f2) i[n] = f2(i[n]);
    }
  }
  function resume(n, v2) {
    try {
      step(g2[n](v2));
    } catch (e) {
      settle(q2[0][3], e);
    }
  }
  function step(r) {
    r.value instanceof __await8 ? Promise.resolve(r.value.v).then(fulfill, reject2) : settle(q2[0][2], r);
  }
  function fulfill(value) {
    resume("next", value);
  }
  function reject2(value) {
    resume("throw", value);
  }
  function settle(f2, v2) {
    if (f2(v2), q2.shift(), q2.length) resume(q2[0][0], q2[0][1]);
  }
};
var MockPromptBuilder = class extends BasePromptBuilder {
};
var MockPromptExecutor = class extends BasePromptExecutor {
  constructor(options2, initialMessages) {
    super(new MockPromptBuilder(initialMessages));
    this.options = () => {
      var _a19, _b2, _c2, _d, _e2;
      var _f, _g, _h, _j, _k, _l, _m, _o2, _p;
      const opts = options2 === null || options2 === void 0 ? void 0 : options2();
      return {
        response: (_f = opts === null || opts === void 0 ? void 0 : opts.response) !== null && _f !== void 0 ? _f : "This is a mock response.",
        toolCalls: (_g = opts === null || opts === void 0 ? void 0 : opts.toolCalls) !== null && _g !== void 0 ? _g : [],
        streamDelay: (_h = opts === null || opts === void 0 ? void 0 : opts.streamDelay) !== null && _h !== void 0 ? _h : 0,
        chunkSize: (_j = opts === null || opts === void 0 ? void 0 : opts.chunkSize) !== null && _j !== void 0 ? _j : 1,
        usage: {
          inputTokens: (_k = (_a19 = opts === null || opts === void 0 ? void 0 : opts.usage) === null || _a19 === void 0 ? void 0 : _a19.inputTokens) !== null && _k !== void 0 ? _k : 10,
          outputTokens: (_l = (_b2 = opts === null || opts === void 0 ? void 0 : opts.usage) === null || _b2 === void 0 ? void 0 : _b2.outputTokens) !== null && _l !== void 0 ? _l : 20,
          cacheReadTokens: (_m = (_c2 = opts === null || opts === void 0 ? void 0 : opts.usage) === null || _c2 === void 0 ? void 0 : _c2.cacheReadTokens) !== null && _m !== void 0 ? _m : 0,
          cacheWriteTokens: (_o2 = (_d = opts === null || opts === void 0 ? void 0 : opts.usage) === null || _d === void 0 ? void 0 : _d.cacheWriteTokens) !== null && _o2 !== void 0 ? _o2 : 0,
          maxTokens: (_p = (_e2 = opts === null || opts === void 0 ? void 0 : opts.usage) === null || _e2 === void 0 ? void 0 : _e2.maxTokens) !== null && _p !== void 0 ? _p : 1e3
        },
        simulateError: opts === null || opts === void 0 ? void 0 : opts.simulateError
      };
    };
  }
  stream(_ctx, invocationId, _tools, _options) {
    const options2 = this.options();
    const responseText = options2.response;
    const toolCalls3 = options2.toolCalls;
    const chunkSize = options2.chunkSize;
    const streamDelay = options2.streamDelay;
    const simulateError = options2.simulateError;
    const usage = options2.usage;
    const fullStream = (function() {
      return __asyncGenerator8(this, arguments, function* () {
        if (responseText) {
          for (let i = 0; i < responseText.length; i += chunkSize) {
            const chunk = responseText.slice(i, i + chunkSize);
            if (streamDelay > 0) {
              yield __await8(new Promise((resolve29) => setTimeout(resolve29, streamDelay)));
            }
            yield yield __await8({
              type: "text-delta",
              textDelta: chunk
            });
          }
        }
        for (const toolCall of toolCalls3) {
          if (streamDelay > 0) {
            yield __await8(new Promise((resolve29) => setTimeout(resolve29, streamDelay)));
          }
          yield yield __await8({
            type: "tool-call-streaming-start",
            toolCallId: toolCall.toolCallId,
            toolName: toolCall.toolName
          });
          const argsJson = JSON.stringify(toolCall.args);
          for (let i = 0; i < argsJson.length; i += chunkSize) {
            const chunk = argsJson.slice(i, i + chunkSize);
            if (streamDelay > 0) {
              yield __await8(new Promise((resolve29) => setTimeout(resolve29, streamDelay)));
            }
            yield yield __await8({
              type: "tool-call-delta",
              toolCallId: toolCall.toolCallId,
              toolName: toolCall.toolName,
              argsTextDelta: chunk
            });
          }
          if (streamDelay > 0) {
            yield __await8(new Promise((resolve29) => setTimeout(resolve29, streamDelay)));
          }
          yield yield __await8({
            type: "tool-call",
            toolCallId: toolCall.toolCallId,
            toolName: toolCall.toolName,
            args: toolCall.args
          });
        }
        if (simulateError) {
          yield yield __await8({
            type: "error",
            error: simulateError
          });
          throw simulateError;
        }
        yield yield __await8({
          type: "finish",
          finishReason: "stop",
          usage: {
            promptTokens: usage.inputTokens,
            completionTokens: usage.outputTokens,
            totalTokens: usage.inputTokens + usage.outputTokens
          },
          logprobs: void 0,
          response: {
            id: "mock-response-id",
            timestamp: /* @__PURE__ */ new Date(),
            modelId: "mock-model"
          }
        });
      });
    })();
    const response = (() => __awaiter21(this, void 0, void 0, function* () {
      const content = [];
      if (responseText) {
        content.push({
          type: "text",
          text: simulateError ? responseText.slice(0, chunkSize) : responseText
        });
      }
      for (const toolCall of toolCalls3) {
        content.push({
          type: "tool-call",
          toolCallId: toolCall.toolCallId,
          toolName: toolCall.toolName,
          args: toolCall.args
        });
      }
      const messages2 = [
        {
          role: "assistant",
          content: content.length > 0 ? content : "",
          id: "mock-message-id"
        }
      ];
      const result = {
        id: "mock-response-id",
        timestamp: /* @__PURE__ */ new Date(),
        modelId: "mock-model",
        messages: messages2
      };
      if (simulateError) {
        result.error = simulateError;
      }
      return result;
    }))();
    const usagePromise = Promise.resolve({
      promptTokens: usage.inputTokens,
      completionTokens: usage.outputTokens,
      totalTokens: usage.inputTokens + usage.outputTokens
    });
    const extendedUsage = Promise.resolve({
      inputTokens: usage.inputTokens,
      outputTokens: usage.outputTokens,
      cacheReadTokens: usage.cacheReadTokens,
      cacheWriteTokens: usage.cacheWriteTokens,
      maxTokens: usage.maxTokens
    });
    const providerMetadata = Promise.resolve(void 0);
    return {
      fullStream,
      response,
      usage: usagePromise,
      extendedUsage,
      providerMetadata,
      invocationId: Promise.resolve(invocationId !== null && invocationId !== void 0 ? invocationId : crypto.randomUUID())
    };
  }
};
function createMockPromptExecutor(options2) {
  return new MockPromptExecutor(() => options2(), void 0);
}

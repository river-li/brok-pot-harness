var __asyncValues7 = function(o) {
  if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
  var m2 = o[Symbol.asyncIterator], i;
  return m2 ? m2.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function() {
    return this;
  }, i);
  function verb(n) {
    i[n] = o[n] && function(v2) {
      return new Promise(function(resolve29, reject2) {
        v2 = o[n](v2), settle(resolve29, reject2, v2.done, v2.value);
      });
    };
  }
  function settle(resolve29, reject2, d, v2) {
    Promise.resolve(v2).then(function(v3) {
      resolve29({ value: v3, done: d });
    }, reject2);
  }
};
var __await7 = function(v2) {
  return this instanceof __await7 ? (this.v = v2, this) : new __await7(v2);
};
var __asyncGenerator7 = function(thisArg, _arguments, generator) {
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
    r.value instanceof __await7 ? Promise.resolve(r.value.v).then(fulfill, reject2) : settle(q2[0][2], r);
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
var middlewareChainDuration = createHistogram("agent.ttft.middlewareChainMs", {
  description: "Total synchronous time inside the middleware chain from tracing middleware entry to inner stream() returning (may exclude async preprocessing done by middleware wrappers)"
});
var ttftHistogram = createHistogram("chat_inference.ttft_ms", {
  description: "Time to first token in milliseconds",
  labelNames: ["outcome"]
});
var ttfToolCallHistogram = createHistogram("chat_inference.ttf_toolcall_ms", {
  description: "Time to first tool call in milliseconds",
  labelNames: ["outcome"]
});
var e2eLatencyHistogram = createHistogram("chat_inference.e2e_latency_ms", {
  description: "End-to-end latency in milliseconds",
  labelNames: ["outcome"]
});
var inputMessagesHistogram = createHistogram("chat_inference.input_messages", {
  description: "Distribution of input message counts per request",
  labelNames: ["message_type"]
});
var inputCharactersHistogram = createHistogram("chat_inference.input_characters", {
  description: "Distribution of input character counts per request",
  labelNames: ["message_type"]
});
var requestOutcomeCounter = createCounter("chat_inference.request_outcome", {
  description: "Count of request outcomes",
  labelNames: ["outcome"]
});
function getMessageTextContent(message) {
  if (message.role === "user" || message.role === "assistant") {
    if (typeof message.content === "string") {
      return message.content;
    }
    if (Array.isArray(message.content)) {
      return message.content.map((part) => {
        if (part.type === "text" && "text" in part) {
          return part.text;
        }
        return "";
      }).join("");
    }
  }
  if (message.role === "tool") {
    if (typeof message.content === "string") {
      return message.content;
    }
    if (Array.isArray(message.content)) {
      return message.content.map((part) => {
        if (part.type === "tool-result" && "result" in part) {
          return typeof part.result === "string" ? part.result : JSON.stringify(part.result);
        }
        return "";
      }).join("");
    }
  }
  return "";
}
function analyzeMessages(messages2) {
  const stats = {
    userCount: 0,
    assistantCount: 0,
    toolCount: 0,
    userChars: 0,
    assistantChars: 0,
    toolChars: 0
  };
  for (const message of messages2) {
    const textContent = getMessageTextContent(message);
    const charCount = textContent.length;
    switch (message.role) {
      case "user":
        stats.userCount++;
        stats.userChars += charCount;
        break;
      case "assistant":
        stats.assistantCount++;
        stats.assistantChars += charCount;
        break;
      case "tool":
        stats.toolCount++;
        stats.toolChars += charCount;
        break;
    }
  }
  return stats;
}
var TracingMiddleware = class extends BaseMiddleware {
  stream(ctx, invocationId, tools, options2) {
    const startTime = performance.now();
    let firstTokenTime = null;
    let seenFirstToken = false;
    let firstToolCallTime = null;
    let seenFirstToolCall = false;
    const inputMessages = this.innerExecutor.getMessages();
    const messageStats = analyzeMessages(inputMessages);
    inputMessagesHistogram.histogram(ctx, messageStats.userCount, {
      message_type: "user"
    });
    inputMessagesHistogram.histogram(ctx, messageStats.assistantCount, {
      message_type: "assistant"
    });
    inputMessagesHistogram.histogram(ctx, messageStats.toolCount, {
      message_type: "tool"
    });
    inputCharactersHistogram.histogram(ctx, messageStats.userChars, {
      message_type: "user"
    });
    inputCharactersHistogram.histogram(ctx, messageStats.assistantChars, {
      message_type: "assistant"
    });
    inputCharactersHistogram.histogram(ctx, messageStats.toolChars, {
      message_type: "tool"
    });
    const streamResult = this.innerExecutor.stream(ctx, invocationId, tools, options2);
    middlewareChainDuration.histogram(ctx, performance.now() - startTime);
    const tracedFullStream = function() {
      return __asyncGenerator7(this, arguments, function* () {
        var _a19, e_1, _b2, _c2;
        try {
          try {
            for (var _d = true, _e2 = __asyncValues7(streamResult.fullStream), _f; _f = yield __await7(_e2.next()), _a19 = _f.done, !_a19; _d = true) {
              _c2 = _f.value;
              _d = false;
              const part = _c2;
              if (!seenFirstToken) {
                firstTokenTime = performance.now();
                seenFirstToken = true;
                const ttft = firstTokenTime - startTime;
                ttftHistogram.histogram(ctx, ttft, { outcome: "success" });
              }
              if (!seenFirstToolCall && (part.type === "tool-call" || part.type === "tool-call-delta")) {
                firstToolCallTime = performance.now();
                seenFirstToolCall = true;
                const ttfToolCall = firstToolCallTime - startTime;
                ttfToolCallHistogram.histogram(ctx, ttfToolCall, {
                  outcome: "success"
                });
              }
              yield yield __await7(part);
            }
          } catch (e_1_1) {
            e_1 = { error: e_1_1 };
          } finally {
            try {
              if (!_d && !_a19 && (_b2 = _e2.return)) yield __await7(_b2.call(_e2));
            } finally {
              if (e_1) throw e_1.error;
            }
          }
        } catch (error41) {
          if (!seenFirstToken) {
            ttftHistogram.histogram(ctx, performance.now() - startTime, {
              outcome: "failure"
            });
          }
          throw error41;
        }
      });
    };
    const tracedResponse = streamResult.response.then((response) => {
      const endTime = performance.now();
      const e2eLatency = endTime - startTime;
      e2eLatencyHistogram.histogram(ctx, e2eLatency, { outcome: "success" });
      if (response.error) {
        requestOutcomeCounter.increment(ctx, 1, { outcome: "failure" });
      } else {
        requestOutcomeCounter.increment(ctx, 1, { outcome: "success" });
      }
      return response;
    }).catch((error41) => {
      const endTime = performance.now();
      const e2eLatency = endTime - startTime;
      e2eLatencyHistogram.histogram(ctx, e2eLatency, { outcome: "failure" });
      requestOutcomeCounter.increment(ctx, 1, { outcome: "failure" });
      throw error41;
    });
    return {
      fullStream: tracedFullStream(),
      response: tracedResponse,
      usage: streamResult.usage,
      providerMetadata: streamResult.providerMetadata,
      extendedUsage: streamResult.extendedUsage,
      invocationId: streamResult.invocationId
    };
  }
};
var createTracingMiddleware = () => {
  return (executor) => new TracingMiddleware(executor);
};
var tracingMiddleware = createTracingMiddleware();

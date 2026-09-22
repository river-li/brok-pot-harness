init_dist4();
init_exec_pb();
init_dist3();
var __awaiter31 = function(thisArg, _arguments, P2, generator) {
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
var __addDisposableResource2 = function(env, value, async) {
  if (value !== null && value !== void 0) {
    if (typeof value !== "object" && typeof value !== "function") throw new TypeError("Object expected.");
    var dispose, inner;
    if (async) {
      if (!Symbol.asyncDispose) throw new TypeError("Symbol.asyncDispose is not defined.");
      dispose = value[Symbol.asyncDispose];
    }
    if (dispose === void 0) {
      if (!Symbol.dispose) throw new TypeError("Symbol.dispose is not defined.");
      dispose = value[Symbol.dispose];
      if (async) inner = dispose;
    }
    if (typeof dispose !== "function") throw new TypeError("Object not disposable.");
    if (inner) dispose = function() {
      try {
        inner.call(this);
      } catch (e) {
        return Promise.reject(e);
      }
    };
    env.stack.push({ value, dispose, async });
  } else if (async) {
    env.stack.push({ async: true });
  }
  return value;
};
var __disposeResources2 = /* @__PURE__ */ (function(SuppressedError2) {
  return function(env) {
    function fail(e) {
      env.error = env.hasError ? new SuppressedError2(e, env.error, "An error was suppressed during disposal.") : e;
      env.hasError = true;
    }
    var r, s3 = 0;
    function next() {
      while (r = env.stack.pop()) {
        try {
          if (!r.async && s3 === 1) return s3 = 0, env.stack.push(r), Promise.resolve().then(next);
          if (r.dispose) {
            var result = r.dispose.call(r.value);
            if (r.async) return s3 |= 2, Promise.resolve(result).then(next, function(e) {
              fail(e);
              return next();
            });
          } else s3 |= 1;
        } catch (e) {
          fail(e);
        }
      }
      if (s3 === 1) return env.hasError ? Promise.reject(env.error) : Promise.resolve();
      if (env.hasError) throw env.error;
    }
    return next();
  };
})(typeof SuppressedError === "function" ? SuppressedError : function(error42, suppressed, message) {
  var e = new Error(message);
  return e.name = "SuppressedError", e.error = error42, e.suppressed = suppressed, e;
});
var __asyncValues10 = function(o) {
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
var __await10 = function(v2) {
  return this instanceof __await10 ? (this.v = v2, this) : new __await10(v2);
};
var __asyncGenerator10 = function(thisArg, _arguments, generator) {
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
    r.value instanceof __await10 ? Promise.resolve(r.value.v).then(fulfill, reject2) : settle(q2[0][2], r);
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
var logger12 = createLogger("ExecutorResource");
var hookAdditionalContextDelivered = createCounter("agent_exec.hook_additional_context.delivered", {
  description: "Hook additional_context carriers drained into the caller collector",
  labelNames: ["hook_event_name"]
});
var ExecutorResource = class {
  constructor(execManager, serializeArgs, deserializeResult) {
    this.execManager = execManager;
    this.serializeArgs = serializeArgs;
    this.deserializeResult = deserializeResult;
  }
  execute(parentCtx, args, options2) {
    return __awaiter31(this, void 0, void 0, function* () {
      const env_1 = { stack: [], error: void 0, hasError: false };
      try {
        const span = __addDisposableResource2(env_1, createSpan(parentCtx.withName("ExecutorResource.execute")), false);
        const ctx = span.ctx;
        if ((options2 === null || options2 === void 0 ? void 0 : options2.execId) !== void 0) {
          span.span.setAttribute("exec.id", options2.execId);
        }
        const spanContextData = getSpanContextData(ctx);
        const spanContext = spanContextData ? new SpanContext(spanContextData) : void 0;
        const messageStream = this.execManager.createExecInstance(ctx, (id) => {
          const serialized = this.serializeArgs(id, args);
          return new ExecServerMessage({
            id: serialized.id,
            message: serialized.message,
            execId: options2 === null || options2 === void 0 ? void 0 : options2.execId,
            machineId: options2 === null || options2 === void 0 ? void 0 : options2.machineId,
            spanContext,
            acceptHookAdditionalContexts: (options2 === null || options2 === void 0 ? void 0 : options2.hookContextCollector) !== void 0
          });
        });
        const withFirstItem = yield getFirstItem(messageStream);
        if (withFirstItem === void 0) {
          throw new Error("No exec result");
        }
        let { firstItem: result, rest } = withFirstItem;
        const pushHookContexts = (message) => {
          if ((options2 === null || options2 === void 0 ? void 0 : options2.hookContextCollector) !== void 0 && message.hookAdditionalContexts.length > 0) {
            options2.hookContextCollector.push(...message.hookAdditionalContexts);
            for (const carrier of message.hookAdditionalContexts) {
              hookAdditionalContextDelivered.increment(ctx, 1, {
                hook_event_name: carrier.hookEventName
              });
            }
          }
        };
        pushHookContexts(result);
        let resultValue = this.deserializeResult(result);
        while (resultValue === void 0) {
          const next = yield getFirstItem(rest);
          if (next === void 0) {
            throw new Error("No result value");
          }
          result = next.firstItem;
          rest = next.rest;
          pushHookContexts(result);
          resultValue = this.deserializeResult(result);
        }
        void (() => __awaiter31(this, void 0, void 0, function* () {
          var _a19, e_2, _b2, _c2;
          try {
            try {
              for (var _d = true, rest_1 = __asyncValues10(rest), rest_1_1; rest_1_1 = yield rest_1.next(), _a19 = rest_1_1.done, !_a19; _d = true) {
                _c2 = rest_1_1.value;
                _d = false;
                const message = _c2;
                pushHookContexts(message);
              }
            } catch (e_2_1) {
              e_2 = { error: e_2_1 };
            } finally {
              try {
                if (!_d && !_a19 && (_b2 = rest_1.return)) yield _b2.call(rest_1);
              } finally {
                if (e_2) throw e_2.error;
              }
            }
          } catch (error42) {
            logger12.info(ctx, "Ignoring exec stream shutdown during detached drain", { error: error42 });
          }
        }))().catch(() => {
        });
        return resultValue;
      } catch (e_1) {
        env_1.error = e_1;
        env_1.hasError = true;
      } finally {
        __disposeResources2(env_1);
      }
    });
  }
};
var StreamExecutorResource = class {
  constructor(execManager, serializeArgs, deserializeStream) {
    this.execManager = execManager;
    this.serializeArgs = serializeArgs;
    this.deserializeStream = deserializeStream;
  }
  execute(parentCtx, args, options2) {
    return __asyncGenerator10(this, arguments, function* execute_1() {
      var _a19, e_3, _b2, _c2;
      const env_2 = { stack: [], error: void 0, hasError: false };
      try {
        const span = __addDisposableResource2(env_2, createSpan(parentCtx.withName("StreamExecutorResource.execute")), false);
        const ctx = span.ctx;
        const spanContextData = getSpanContextData(ctx);
        const spanContext = spanContextData ? new SpanContext(spanContextData) : void 0;
        const messageStream = this.execManager.createExecInstance(ctx, (id) => {
          const serialized = this.serializeArgs(id, args);
          return new ExecServerMessage({
            id: serialized.id,
            message: serialized.message,
            execId: options2 === null || options2 === void 0 ? void 0 : options2.execId,
            machineId: options2 === null || options2 === void 0 ? void 0 : options2.machineId,
            spanContext,
            acceptHookAdditionalContexts: (options2 === null || options2 === void 0 ? void 0 : options2.hookContextCollector) !== void 0 || (options2 === null || options2 === void 0 ? void 0 : options2.deliverAgentStoreConflictNotices) === true
          });
        });
        try {
          for (var _d = true, messageStream_1 = __asyncValues10(messageStream), messageStream_1_1; messageStream_1_1 = yield __await10(messageStream_1.next()), _a19 = messageStream_1_1.done, !_a19; _d = true) {
            _c2 = messageStream_1_1.value;
            _d = false;
            const message = _c2;
            if ((options2 === null || options2 === void 0 ? void 0 : options2.hookContextCollector) !== void 0 && message.hookAdditionalContexts.length > 0) {
              options2.hookContextCollector.push(...message.hookAdditionalContexts);
            }
            const streamValue = this.deserializeStream(message);
            if (streamValue !== void 0) {
              yield yield __await10(streamValue);
            }
          }
        } catch (e_3_1) {
          e_3 = { error: e_3_1 };
        } finally {
          try {
            if (!_d && !_a19 && (_b2 = messageStream_1.return)) yield __await10(_b2.call(messageStream_1));
          } finally {
            if (e_3) throw e_3.error;
          }
        }
      } catch (e_4) {
        env_2.error = e_4;
        env_2.hasError = true;
      } finally {
        __disposeResources2(env_2);
      }
    });
  }
};

/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/agent-exec/dist/controlled.js
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_dist();
var __await9 = function(v2) {
  return this instanceof __await9 ? (this.v = v2, this) : new __await9(v2);
};
var __asyncGenerator9 = function(thisArg, _arguments, generator) {
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
    r.value instanceof __await9 ? Promise.resolve(r.value.v).then(fulfill, reject2) : settle(q2[0][2], r);
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
var __asyncValues8 = function(o) {
  if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
  var m2 = o[Symbol.asyncIterator], i;
  return m2 ? m2.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function() {
    return this;
  }, i);
  function verb(n) {
    i[n] = o[n] && function(v2) {
      return new Promise(function(resolve14, reject2) {
        v2 = o[n](v2), settle(resolve14, reject2, v2.done, v2.value);
      });
    };
  }
  function settle(resolve14, reject2, d, v2) {
    Promise.resolve(v2).then(function(v3) {
      resolve14({ value: v3, done: d });
    }, reject2);
  }
};
var logger5 = createLogger("SimpleControlledExecManager");
var AGENT_STORE_CONFLICT_HOOK_EVENT_NAME = "agentStoreConflict";
var controlledExecDuration = createHistogram("agent_exec.controlled.exec.duration_ms", {
  description: "Duration of controlled exec operations in milliseconds",
  labelNames: ["exec_case"]
});
var controlledExecSuccess = createCounter("agent_exec.controlled.exec.success", {
  description: "Count of successful controlled exec operations",
  labelNames: ["exec_case"]
});
var controlledExecError = createCounter("agent_exec.controlled.exec.error", {
  description: "Count of failed controlled exec operations",
  labelNames: ["exec_case"]
});
var SimpleControlledExecHandler = class {
  constructor(exec2, deserializeArgs, serializeResult) {
    this.exec = exec2;
    this.deserializeArgs = deserializeArgs;
    this.serializeResult = serializeResult;
  }
  handle(ctx, serverMessage) {
    const r = this.deserializeArgs(serverMessage);
    if (r === void 0) {
      return void 0;
    }
    const { id, args } = r;
    function generator(self2) {
      return __asyncGenerator9(this, arguments, function* generator_1() {
        const startTime = performance.now();
        const hookContextCollector = [];
        const result = yield __await9(self2.exec.execute(ctx, args, {
          execId: serverMessage.execId,
          hookContextCollector,
          deliverAgentStoreConflictNotices: serverMessage.acceptHookAdditionalContexts === true
        }));
        const message = self2.serializeResult(id, result);
        message.localExecutionTimeMs = Math.round(Math.max(0, performance.now() - startTime));
        if (hookContextCollector.length > 0) {
          message.hookAdditionalContexts = hookContextCollector;
        }
        yield yield __await9(message);
      });
    }
    return generator(this);
  }
};
var SimpleControlledStreamExecHandler = class {
  constructor(exec2, deserializeArgs, serializeStream) {
    this.exec = exec2;
    this.deserializeArgs = deserializeArgs;
    this.serializeStream = serializeStream;
  }
  handle(ctx, serverMessage) {
    const r = this.deserializeArgs(serverMessage);
    if (r === void 0) {
      return void 0;
    }
    const { id, args } = r;
    function generator(self2) {
      return __asyncGenerator9(this, arguments, function* generator_2() {
        var _a20, e_1, _b2, _c2;
        const startTime = performance.now();
        const hookContextCollector = [];
        const stream3 = self2.exec.execute(ctx, args, {
          execId: serverMessage.execId,
          hookContextCollector,
          deliverAgentStoreConflictNotices: serverMessage.acceptHookAdditionalContexts === true
        });
        try {
          try {
            for (var _d = true, stream_1 = __asyncValues8(stream3), stream_1_1; stream_1_1 = yield __await9(stream_1.next()), _a20 = stream_1_1.done, !_a20; _d = true) {
              _c2 = stream_1_1.value;
              _d = false;
              const event = _c2;
              const message = self2.serializeStream(id, event);
              message.localExecutionTimeMs = Math.round(Math.max(0, performance.now() - startTime));
              yield yield __await9(message);
            }
          } catch (e_1_1) {
            e_1 = { error: e_1_1 };
          } finally {
            try {
              if (!_d && !_a20 && (_b2 = stream_1.return)) yield __await9(_b2.call(stream_1));
            } finally {
              if (e_1) throw e_1.error;
            }
          }
        } finally {
          const conflictCarriers = hookContextCollector.filter((c) => c.hookEventName === AGENT_STORE_CONFLICT_HOOK_EVENT_NAME);
          if (conflictCarriers.length > 0) {
            yield yield __await9(new ExecClientMessage({
              id,
              hookAdditionalContexts: conflictCarriers
            }));
          }
        }
      });
    }
    return generator(this);
  }
};


init_shell_exec_pb();
init_dist2();
var __awaiter33 = function(thisArg, _arguments, P2, generator) {
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
var __asyncValues12 = function(o) {
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
var __await13 = function(v2) {
  return this instanceof __await13 ? (this.v = v2, this) : new __await13(v2);
};
var __asyncGenerator13 = function(thisArg, _arguments, generator) {
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
    r.value instanceof __await13 ? Promise.resolve(r.value.v).then(fulfill, reject2) : settle(q2[0][2], r);
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
function isExecutorLike(impl) {
  return typeof impl === "object" && impl !== null && "execute" in impl && typeof impl.execute === "function";
}
function isAsyncIterable(value) {
  return typeof value === "object" && value !== null && Symbol.asyncIterator in value && typeof value[Symbol.asyncIterator] === "function";
}
function isPromiseLike(value) {
  return typeof value === "object" && value !== null && "then" in value && typeof value.then === "function";
}
function isShellBackgroundedStreamEvent(event) {
  if (typeof event !== "object" || event === null) {
    return false;
  }
  const nested = event.event;
  return (nested === null || nested === void 0 ? void 0 : nested.case) === "backgrounded";
}
function extractWritePath(args) {
  if (typeof args !== "object" || args === null) {
    return void 0;
  }
  const path31 = args.path;
  return typeof path31 === "string" && path31.length > 0 ? path31 : void 0;
}
function wakeBehaviorFor(resourceSymbol) {
  if (resourceSymbol === writeExecutorResource.symbol || resourceSymbol === deleteExecutorResource.symbol || resourceSymbol === piWriteExecutorResource.symbol || resourceSymbol === piEditExecutorResource.symbol) {
    return { kind: "path" };
  }
  if (resourceSymbol === shellExecutorResource.symbol || resourceSymbol === shellStreamExecutorResource.symbol || resourceSymbol === backgroundShellExecutorResource.symbol || resourceSymbol === piBashExecutorResource.symbol) {
    return { kind: "exposed" };
  }
  return void 0;
}
var DEFAULT_WRITE_BARRIER_TIMEOUT_MS = 2e3;
function awaitForceWrittenPathBeforeDrain(force, args, wake, options2) {
  return __awaiter33(this, void 0, void 0, function* () {
    const report = (event) => {
      var _a19;
      try {
        (_a19 = options2.onWriteBarrier) === null || _a19 === void 0 ? void 0 : _a19.call(options2, event);
      } catch (_b2) {
      }
    };
    if (force === void 0 || (wake === null || wake === void 0 ? void 0 : wake.kind) !== "path") {
      return;
    }
    const writtenPath = extractWritePath(args);
    if (writtenPath === void 0) {
      return;
    }
    if (!(options2.timeoutMs > 0)) {
      report({ durationMs: 0, outcome: "skipped" });
      return;
    }
    const start = Date.now();
    const forceOutcome = force(writtenPath).then((result) => result, () => "error");
    const raced = yield Promise.race([
      forceOutcome,
      delay2(options2.timeoutMs).then(() => "timeout")
    ]);
    if (raced === "not_store_path") {
      return;
    }
    report({ durationMs: Date.now() - start, outcome: raced });
  });
}
var AgentStoreConflictDrainResourceAccessor = class _AgentStoreConflictDrainResourceAccessor {
  cacheCarriersForExecId(execId, carriers) {
    const existing = this.carriersByExecId.get(execId);
    if (existing !== void 0 && existing.length > 0 && carriers.length === 0) {
      return;
    }
    if (this.carriersByExecId.has(execId)) {
      this.carriersByExecId.delete(execId);
    }
    this.carriersByExecId.set(execId, carriers);
    while (this.carriersByExecId.size > _AgentStoreConflictDrainResourceAccessor.CARRIERS_BY_EXEC_ID_MAX) {
      const oldest = this.carriersByExecId.keys().next().value;
      if (oldest === void 0) {
        break;
      }
      this.carriersByExecId.delete(oldest);
    }
  }
  constructor(inner, drain, wake, options2) {
    var _a19;
    this.inner = inner;
    this.wake = wake;
    this.carriersByExecId = /* @__PURE__ */ new Map();
    this.inFlightByExecId = /* @__PURE__ */ new Map();
    this.resolveDrain = typeof drain === "function" ? drain : (_ctx) => drain;
    this.skipPathWriteDrain = options2 === null || options2 === void 0 ? void 0 : options2.skipPathWriteDrain;
    this.onWakeWrittenPath = options2 === null || options2 === void 0 ? void 0 : options2.onWakeWrittenPath;
    this.forceWrittenPathBeforeDrain = options2 === null || options2 === void 0 ? void 0 : options2.forceWrittenPathBeforeDrain;
    this.writeBarrierTimeoutMs = (_a19 = options2 === null || options2 === void 0 ? void 0 : options2.writeBarrierTimeoutMs) !== null && _a19 !== void 0 ? _a19 : DEFAULT_WRITE_BARRIER_TIMEOUT_MS;
    this.resolveWriteBarrierTimeoutMs = options2 === null || options2 === void 0 ? void 0 : options2.resolveWriteBarrierTimeoutMs;
    this.onWriteBarrier = options2 === null || options2 === void 0 ? void 0 : options2.onWriteBarrier;
  }
  resolveTimeoutMs() {
    if (this.resolveWriteBarrierTimeoutMs !== void 0) {
      try {
        const resolved = this.resolveWriteBarrierTimeoutMs();
        if (typeof resolved === "number" && Number.isFinite(resolved)) {
          return resolved;
        }
      } catch (_a19) {
      }
    }
    return this.writeBarrierTimeoutMs;
  }
  get(resource) {
    return this.wrapImpl(resource.symbol, this.inner.get(resource));
  }
  *entries() {
    for (const [resource, impl] of this.inner.entries()) {
      yield [resource, this.wrapImpl(resource.symbol, impl)];
    }
  }
  wrapImpl(resourceSymbol, impl) {
    if (!isExecutorLike(impl)) {
      return impl;
    }
    const wake = wakeBehaviorFor(resourceSymbol);
    const resolveDrain = this.resolveDrain;
    const wakeCoordinator = this.wake;
    const skipPathWriteDrain = this.skipPathWriteDrain;
    const forceWrittenPathBeforeDrain = this.forceWrittenPathBeforeDrain;
    const resolveTimeoutMs = () => this.resolveTimeoutMs();
    const onWriteBarrier = this.onWriteBarrier;
    const onWakeWrittenPath = this.onWakeWrittenPath;
    const fireWake = (args, ctx) => {
      if (wake === void 0 || wakeCoordinator === void 0) {
        return;
      }
      try {
        if (wake.kind === "path") {
          const writtenPath = extractWritePath(args);
          if (writtenPath !== void 0) {
            wakeCoordinator.wakeForWrittenPath(writtenPath);
            onWakeWrittenPath === null || onWakeWrittenPath === void 0 ? void 0 : onWakeWrittenPath(writtenPath, ctx);
          }
        } else {
          wakeCoordinator.wakeExposedMounts();
        }
      } catch (_a19) {
      }
    };
    const cacheCarriersForExecId = this.cacheCarriersForExecId.bind(this);
    const carriersByExecId = this.carriersByExecId;
    const inFlightByExecId = this.inFlightByExecId;
    const appendDrain = (ctx, options2) => __awaiter33(this, void 0, void 0, function* () {
      const collector = options2 === null || options2 === void 0 ? void 0 : options2.hookContextCollector;
      if (collector === void 0) {
        return [];
      }
      if ((options2 === null || options2 === void 0 ? void 0 : options2.deliverAgentStoreConflictNotices) === false) {
        return [];
      }
      const execId = (options2 === null || options2 === void 0 ? void 0 : options2.execId) !== void 0 && options2.execId.length > 0 ? options2.execId : void 0;
      if (execId !== void 0) {
        const cached2 = carriersByExecId.get(execId);
        if (cached2 !== void 0) {
          if (cached2.length > 0) {
            collector.push(...cached2);
          }
          return cached2;
        }
        const inFlight = inFlightByExecId.get(execId);
        if (inFlight !== void 0) {
          const carriers = yield inFlight;
          if (carriers.length > 0) {
            collector.push(...carriers);
          }
          return carriers;
        }
      }
      const runPeek = (attachTo) => __awaiter33(this, void 0, void 0, function* () {
        const drain = resolveDrain(ctx);
        let claimedIds = [];
        try {
          const peeked = yield drain.peek();
          claimedIds = peeked.eventIds;
          if (peeked.carriers.length > 0) {
            attachTo.push(...peeked.carriers);
            drain.ack(peeked.eventIds);
            if (execId !== void 0) {
              cacheCarriersForExecId(execId, peeked.carriers);
            }
            return peeked.carriers;
          } else if (claimedIds.length > 0) {
            drain.ack(claimedIds);
          }
          const empty2 = [];
          if (execId !== void 0) {
            cacheCarriersForExecId(execId, empty2);
          }
          return empty2;
        } catch (_a19) {
          if (claimedIds.length > 0) {
            drain.release(claimedIds);
          }
          return [];
        }
      });
      if (execId === void 0) {
        return yield runPeek(collector);
      }
      const pending = runPeek(collector);
      inFlightByExecId.set(execId, pending);
      try {
        return yield pending;
      } finally {
        if (inFlightByExecId.get(execId) === pending) {
          inFlightByExecId.delete(execId);
        }
      }
    });
    return new Proxy(impl, {
      get: (target, prop, receiver) => {
        if (prop !== "execute") {
          return Reflect.get(target, prop, receiver);
        }
        return (ctx, args, options2) => {
          const result = target.execute.call(target, ctx, args, options2);
          if (isAsyncIterable(result)) {
            return (function wrapped() {
              return __asyncGenerator13(this, arguments, function* wrapped_1() {
                var _a19, e_1, _b2, _c2;
                let drained = false;
                let failed2 = false;
                let completedNormally = false;
                try {
                  try {
                    for (var _d = true, result_1 = __asyncValues12(result), result_1_1; result_1_1 = yield __await13(result_1.next()), _a19 = result_1_1.done, !_a19; _d = true) {
                      _c2 = result_1_1.value;
                      _d = false;
                      const event = _c2;
                      if (resourceSymbol === shellStreamExecutorResource.symbol && isShellBackgroundedStreamEvent(event)) {
                        if (!drained) {
                          fireWake(args, ctx);
                          const carriers = yield __await13(appendDrain(ctx, options2));
                          drained = true;
                          if (carriers.length > 0) {
                            yield yield __await13(new ShellStream({
                              event: {
                                case: "hookContext",
                                value: new ShellStreamHookContext({
                                  hookAdditionalContexts: [...carriers]
                                })
                              }
                            }));
                          }
                        }
                        yield yield __await13(event);
                        continue;
                      }
                      yield yield __await13(event);
                    }
                  } catch (e_1_1) {
                    e_1 = { error: e_1_1 };
                  } finally {
                    try {
                      if (!_d && !_a19 && (_b2 = result_1.return)) yield __await13(_b2.call(result_1));
                    } finally {
                      if (e_1) throw e_1.error;
                    }
                  }
                  completedNormally = true;
                } catch (error41) {
                  failed2 = true;
                  throw error41;
                } finally {
                  fireWake(args, ctx);
                  if (!drained && !failed2 && completedNormally) {
                    yield __await13(appendDrain(ctx, options2));
                  }
                }
              });
            })();
          }
          if (isPromiseLike(result)) {
            return (() => __awaiter33(this, void 0, void 0, function* () {
              try {
                const value = yield result;
                fireWake(args, ctx);
                const skipDrain = resourceSymbol === writeExecutorResource.symbol && (skipPathWriteDrain === null || skipPathWriteDrain === void 0 ? void 0 : skipPathWriteDrain()) === true && (options2 === null || options2 === void 0 ? void 0 : options2.enableAgentStoreConflictNotices) === true;
                if (!skipDrain) {
                  yield awaitForceWrittenPathBeforeDrain(forceWrittenPathBeforeDrain, args, wake, {
                    timeoutMs: resolveTimeoutMs(),
                    onWriteBarrier
                  });
                  yield appendDrain(ctx, options2);
                }
                return value;
              } catch (error41) {
                fireWake(args, ctx);
                throw error41;
              }
            }))();
          }
          fireWake(args, ctx);
          return result;
        };
      }
    });
  }
};
AgentStoreConflictDrainResourceAccessor.CARRIERS_BY_EXEC_ID_MAX = 32;

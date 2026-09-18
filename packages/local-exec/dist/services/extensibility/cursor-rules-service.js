var __addDisposableResource12 = function(env, value, async) {
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
var __disposeResources12 = /* @__PURE__ */ (function(SuppressedError2) {
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
})(typeof SuppressedError === "function" ? SuppressedError : function(error41, suppressed, message) {
  var e = new Error(message);
  return e.name = "SuppressedError", e.error = error41, e.suppressed = suppressed, e;
});
var rulesLogger = createLogger("local-exec:cursor-rules");
var MergedCursorRulesService = class _MergedCursorRulesService {
  /**
   * `getAgentStoreSkillsContext` is required, not defaulted: always-apply
   * skills travel this channel rather than the skills channel, so a surface
   * that forgets it injects a store skill and its `~/.cursor/skills` twin into
   * every prompt twice with two different bodies. Surfaces with no store pass
   * `NO_AGENT_STORE_SKILLS`.
   */
  constructor(cursorRulesServices, getAgentStoreSkillsContext) {
    this.cursorRulesServices = cursorRulesServices;
    this.getAgentStoreSkillsContext = getAgentStoreSkillsContext;
    this.onChangeCallbacks = /* @__PURE__ */ new Set();
  }
  async getAllCursorRules(ctx) {
    const env_1 = { stack: [], error: void 0, hasError: false };
    try {
      const span = __addDisposableResource12(env_1, createSpan(ctx.withName("MergedCursorRulesService.getAllCursorRules")), false);
      const allRulesPromises = this.cursorRulesServices.map((service) => service.getAllCursorRules(span.ctx).catch((err) => {
        (0, import_node_util4.debuglog)("Failed to load cursor rules from service:", err);
        return [];
      }));
      const allRulesArrays = await Promise.all(allRulesPromises);
      const allRules = allRulesArrays.flat();
      return dedupePreferringAgentStore(allRules, this.getAgentStoreSkillsContext());
    } catch (e_1) {
      env_1.error = e_1;
      env_1.hasError = true;
    } finally {
      __disposeResources12(env_1);
    }
  }
  reload(ctx) {
    for (const service of this.cursorRulesServices) {
      service.reload(ctx);
    }
  }
  scheduleDidChangeRules() {
    if (this.changeTimer !== void 0) {
      return;
    }
    this.changeTimer = setTimeout(() => {
      this.changeTimer = void 0;
      for (const callback of Array.from(this.onChangeCallbacks)) {
        callback();
      }
    }, _MergedCursorRulesService.CHANGE_COALESCE_MS);
  }
  ensureChangeListenersRegistered() {
    if (this.disposeChangeListeners !== void 0) {
      return;
    }
    this.disposeChangeListeners = this.cursorRulesServices.map((service) => service.onDidChangeRules(() => this.scheduleDidChangeRules()));
  }
  disposeChangeListenersIfUnused() {
    if (this.onChangeCallbacks.size > 0 || this.disposeChangeListeners === void 0) {
      return;
    }
    for (const dispose of this.disposeChangeListeners) {
      dispose();
    }
    this.disposeChangeListeners = void 0;
    if (this.changeTimer !== void 0) {
      clearTimeout(this.changeTimer);
      this.changeTimer = void 0;
    }
  }
  onDidChangeRules(callback) {
    this.onChangeCallbacks.add(callback);
    this.ensureChangeListenersRegistered();
    return () => {
      this.onChangeCallbacks.delete(callback);
      this.disposeChangeListenersIfUnused();
    };
  }
  dispose() {
    if (this.changeTimer !== void 0) {
      clearTimeout(this.changeTimer);
      this.changeTimer = void 0;
    }
    this.onChangeCallbacks.clear();
    if (this.disposeChangeListeners !== void 0) {
      for (const dispose of this.disposeChangeListeners) {
        dispose();
      }
      this.disposeChangeListeners = void 0;
    }
    for (const service of this.cursorRulesServices) {
      if (service.dispose) {
        service.dispose();
      }
    }
  }
};
MergedCursorRulesService.CHANGE_COALESCE_MS = 1e3;

/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/local-exec/dist/services/extensibility/agent-skills-service.js
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/2
var import_node_util9 = require("node:util");
init_dist();

// @recovered-fragment 2/2
var __addDisposableResource22 = function(env, value, async) {
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
var __disposeResources22 = /* @__PURE__ */ (function(SuppressedError2) {
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
})(typeof SuppressedError === "function" ? SuppressedError : function(error3, suppressed, message) {
  var e = new Error(message);
  return e.name = "SuppressedError", e.error = error3, e.suppressed = suppressed, e;
});
var log3 = (0, import_node_util9.debuglog)("merged-agent-skills");
var MergedAgentSkillsService = class _MergedAgentSkillsService {
  constructor(services, getDisabledManagedSkillPaths = () => [], getPromptSortContext) {
    this.services = services;
    this.getDisabledManagedSkillPaths = getDisabledManagedSkillPaths;
    this.getPromptSortContext = getPromptSortContext;
    this.onChangeCallbacks = /* @__PURE__ */ new Set();
  }
  async getAllAgentSkills(ctx) {
    const env_1 = { stack: [], error: void 0, hasError: false };
    try {
      const span = __addDisposableResource22(env_1, createSpan(ctx.withName("MergedAgentSkillsService.getAllAgentSkills")), false);
      const allPromises = this.services.map((service) => service.getAllAgentSkills(span.ctx).catch((err) => {
        log3("Failed to load agent skills from service: %s", err instanceof Error ? err.message : String(err));
        return [];
      }));
      const [allArrays, disabledPaths] = await Promise.all([
        Promise.all(allPromises),
        Promise.resolve(this.getDisabledManagedSkillPaths()).catch((err) => {
          log3("getDisabledManagedSkillPaths rejected; fail-open: %s", err instanceof Error ? err.message : String(err));
          return [];
        })
      ]);
      const allSkills = allArrays.flat();
      const sortContext = this.getPromptSortContext?.();
      const deduped = dedupePreferringAgentStore(allSkills, sortContext ?? NO_AGENT_STORE_SKILLS);
      let result = deduped;
      if (disabledPaths.length > 0) {
        result = deduped.filter((skill) => !isPathSuffixMatch(skill.fullPath, disabledPaths));
      }
      if (sortContext !== void 0) {
        return sortAgentSkillsForPromptOrder(result, sortContext);
      }
      return result;
    } catch (e_1) {
      env_1.error = e_1;
      env_1.hasError = true;
    } finally {
      __disposeResources22(env_1);
    }
  }
  reload(ctx) {
    for (const service of this.services) {
      service.reload(ctx);
    }
  }
  scheduleDidChangeSkills() {
    if (this.changeTimer !== void 0) {
      return;
    }
    this.changeTimer = setTimeout(() => {
      this.changeTimer = void 0;
      for (const callback of Array.from(this.onChangeCallbacks)) {
        callback();
      }
    }, _MergedAgentSkillsService.CHANGE_COALESCE_MS);
  }
  ensureChangeListenersRegistered() {
    if (this.disposeChangeListeners !== void 0) {
      return;
    }
    this.disposeChangeListeners = this.services.map((service) => service.onDidChangeSkills(() => this.scheduleDidChangeSkills()));
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
  onDidChangeSkills(callback) {
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
    for (const service of this.services) {
      service.dispose();
    }
  }
};
MergedAgentSkillsService.CHANGE_COALESCE_MS = 1500;
function isPathSuffixMatch(fullPath, suffixes) {
  if (!fullPath) {
    return false;
  }
  const normalizedPath = fullPath.replace(/\\/g, "/");
  return suffixes.some((suffix) => normalizedPath.endsWith(suffix));
}


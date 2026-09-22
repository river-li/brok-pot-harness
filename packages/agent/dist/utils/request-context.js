/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/agent/dist/utils/request-context.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/2
init_dist4();
init_request_context_exec_pb();
init_privacy_mode_pb();

// @recovered-fragment 2/2
var __addDisposableResource18 = function(env, value, async) {
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
var __disposeResources18 = /* @__PURE__ */ (function(SuppressedError2) {
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
function filterRequestContextByActorIdentity(requestContext, actorIdentity) {
  const filteredRules = filterByActorIdentity(requestContext.rules, actorIdentity);
  const filteredAgentSkills = filterByActorIdentity(requestContext.agentSkills, actorIdentity);
  const changed = filteredRules.length !== requestContext.rules.length || filteredAgentSkills.length !== requestContext.agentSkills.length;
  requestContext.rules = filteredRules;
  requestContext.agentSkills = filteredAgentSkills;
  return changed;
}
async function resolveRequestContext({ parentCtx, maybeRequestContext, resources, options: options2 }) {
  const env_1 = { stack: [], error: void 0, hasError: false };
  try {
    const span = __addDisposableResource18(env_1, createSpan(parentCtx.withName("getRequestContext")), false);
    const ctx = span.ctx;
    const applyAgentNotesFolderOverrides = (requestContext2) => {
      const env = requestContext2.env;
      if (env === void 0) {
        return false;
      }
      const projectFolder = env.projectFolder;
      if (projectFolder === void 0 || projectFolder.length === 0) {
        return false;
      }
      const pathModule = getRequestPathModule(requestContext2);
      const notesSessionId = options2?.notesSessionId;
      const metaAgentNotesEnabled = options2?.metaAgentNotesEnabled === true;
      let changed = false;
      if (notesSessionId !== void 0 && notesSessionId.length > 0) {
        const notesFolder = pathModule.join(projectFolder, "agent-notes", notesSessionId);
        if (metaAgentNotesEnabled || (env.agentConversationNotesFolder?.length ?? 0) === 0) {
          if (env.agentConversationNotesFolder !== notesFolder) {
            env.agentConversationNotesFolder = notesFolder;
            changed = true;
          }
        }
      }
      if (metaAgentNotesEnabled && env.agentSharedNotesFolder !== "") {
        env.agentSharedNotesFolder = "";
        changed = true;
      }
      return changed;
    };
    if (maybeRequestContext) {
      const notesChanged = applyAgentNotesFolderOverrides(maybeRequestContext);
      const actorFilteringChanged = filterRequestContextByActorIdentity(maybeRequestContext, options2?.actorIdentity);
      return {
        requestContext: maybeRequestContext,
        provenance: notesChanged || actorFilteringChanged ? "providedModified" : "providedUnchanged"
      };
    }
    const requestContextExecutor = resources.get(requestContextExecutorResource);
    const requestContextResult = await requestContextExecutor.execute(ctx, new RequestContextArgs({
      notesSessionId: options2?.notesSessionId
    }));
    if (requestContextResult.result.case !== "success") {
      throw new Error("Failed to get request context");
    }
    const requestContext = requestContextResult.result.value.requestContext;
    if (!requestContext) {
      throw new Error("Failed to get request context");
    }
    applyAgentNotesFolderOverrides(requestContext);
    filterRequestContextByActorIdentity(requestContext, options2?.actorIdentity);
    return { requestContext, provenance: "executorFetched" };
  } catch (e_1) {
    env_1.error = e_1;
    env_1.hasError = true;
  } finally {
    __disposeResources18(env_1);
  }
}
async function getRequestContext(parentCtx, maybeRequestContext, resources, options2) {
  return (await resolveRequestContext({
    parentCtx,
    maybeRequestContext,
    resources,
    options: options2
  })).requestContext;
}
async function getRedactedRequestContext(parentCtx, maybeRequestContext, resources, options2) {
  const unrededacted = await getRequestContext(parentCtx, maybeRequestContext ? fromRedactedRequestContext(maybeRequestContext, PrivacyCapability.UNSAFE_ALWAYS_ALLOWED) : void 0, resources, options2);
  return toRedactedRequestContext(unrededacted, maybeRequestContext?._privacyMode ?? PrivacyMode.UNSPECIFIED);
}


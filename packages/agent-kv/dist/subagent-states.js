var __awaiter42 = function(thisArg, _arguments, P2, generator) {
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
var SUBAGENT_STATE_BLOB_FETCH_CONCURRENCY = 8;
var logger21 = createLogger("@anysphere/agent-kv:subagent-states");
function resolveSubagentPersistedStates(ctx, state, blobStore) {
  return __awaiter42(this, void 0, void 0, function* () {
    var _a19, _b2;
    const resolved = Object.assign({}, (_a19 = state.subagentStates) !== null && _a19 !== void 0 ? _a19 : {});
    const refEntries = Object.entries((_b2 = state.subagentStateRefs) !== null && _b2 !== void 0 ? _b2 : {});
    if (refEntries.length === 0) {
      return resolved;
    }
    const loads = yield asyncMapValues(refEntries, (_a20) => __awaiter42(this, [_a20], void 0, function* ([subagentId, blobId]) {
      const blob = yield blobStore.getBlob(ctx, blobId);
      if (blob === void 0) {
        if (resolved[subagentId] === void 0) {
          return { kind: "missing", blobIdHex: toHex3(blobId) };
        }
        logger21.warn(ctx, "Subagent state ref blob not found; falling back to inline entry", { subagentId });
        return { kind: "fallback" };
      }
      try {
        return {
          kind: "loaded",
          subagentId,
          state: SubagentPersistedState.fromBinary(blob)
        };
      } catch (error41) {
        return { kind: "failed", error: error41 };
      }
    }), { max: SUBAGENT_STATE_BLOB_FETCH_CONCURRENCY });
    const missingBlobIdHexes = loads.flatMap((load2) => load2.kind === "missing" ? [load2.blobIdHex] : []);
    if (missingBlobIdHexes.length > 0) {
      throw new BlobNotFoundError(missingBlobIdHexes);
    }
    const firstFailedLoad = loads.find((load2) => load2.kind === "failed");
    if (firstFailedLoad !== void 0 && firstFailedLoad.kind === "failed") {
      throw firstFailedLoad.error;
    }
    for (const load2 of loads) {
      if (load2.kind === "loaded") {
        resolved[load2.subagentId] = load2.state;
      }
    }
    return resolved;
  });
}

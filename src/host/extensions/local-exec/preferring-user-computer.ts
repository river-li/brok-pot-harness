/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/host/extensions/local-exec/preferring-user-computer.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
function createPreferringUserComputerBox(preferred, fallback2, isFallbackAvailable = () => true) {
  const pick2 = async () => {
    await preferred.prepare();
    if (preferred.isAvailable()) return preferred.box;
    return isFallbackAvailable() ? fallback2 : preferred.box;
  };
  const routed = /* @__PURE__ */ new Map();
  const current = async (agentId) => routed.get(agentId) ?? await pick2();
  return {
    routeFor: (agentId) => {
      const route = routed.get(agentId);
      if (route === void 0) return void 0;
      return route === fallback2 ? "fallback" : "preferred";
    },
    ensureReady: async (ctx, agentId) => {
      const route = await pick2();
      routed.set(agentId, route);
      return route.ensureReady(ctx, agentId);
    },
    hibernate: async (ctx, agentId) => {
      const route = await current(agentId);
      routed.delete(agentId);
      return route.hibernate(ctx, agentId);
    },
    runState: async (ctx, agentId) => (await pick2()).runState(ctx, agentId),
    listBoxes: async () => (await pick2()).listBoxes(),
    uploadFile: async (ctx, agentId, boxPath, data) => (await current(agentId)).uploadFile(ctx, agentId, boxPath, data),
    downloadFile: async (ctx, agentId, boxPath, options2) => (await current(agentId)).downloadFile(ctx, agentId, boxPath, options2)
  };
}
function createPreferringUserComputers(preferred, fallback2, routeFor = () => void 0) {
  return {
    list: () => {
      const primary = preferred.userComputers.list();
      const known = new Set(primary.map((computer) => computer.id));
      return [...primary, ...fallback2.list().filter((computer) => !known.has(computer.id))];
    },
    resolve: (id, scope) => {
      if (id === void 0 && scope !== void 0 && routeFor(scope.agentId) === "fallback") {
        return fallback2.resolve(id, scope) ?? preferred.userComputers.resolve(id, scope);
      }
      return preferred.userComputers.resolve(id, scope) ?? fallback2.resolve(id, scope);
    }
  };
}


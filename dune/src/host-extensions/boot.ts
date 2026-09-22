init_dist();
var HOST_EXTENSION_START_DEADLINE = "host-extension-start";
var HostExtensionGraphError = class extends Error {
  constructor(message) {
    super(message);
    this.name = "HostExtensionGraphError";
  }
};
var HostExtensionStartError = class extends Error {
  extensionId;
  constructor(extensionId, cause) {
    super(`host extension "${extensionId}" failed to start`, { cause });
    this.name = "HostExtensionStartError";
    this.extensionId = extensionId;
  }
};
function resolveHostExtensionBootOrder(extensions) {
  const peersOf = /* @__PURE__ */ new Map();
  for (const extension3 of extensions) {
    if (peersOf.has(extension3.id)) {
      throw new HostExtensionGraphError(`two host extensions declare the id "${extension3.id}"`);
    }
    peersOf.set(extension3.id, new Set(extension3.dependencies));
  }
  for (const extension3 of extensions) {
    for (const dependency of extension3.dependencies) {
      if (dependency === extension3.id) {
        throw new HostExtensionGraphError(
          `host extension "${extension3.id}" declares itself as a peer`
        );
      }
      if (!peersOf.has(dependency)) {
        throw new HostExtensionGraphError(
          `host extension "${extension3.id}" requires the peer "${dependency}", which is not in this build`
        );
      }
    }
  }
  const remaining = [...peersOf.keys()].sort();
  const started2 = /* @__PURE__ */ new Set();
  const order = [];
  while (remaining.length > 0) {
    const index = remaining.findIndex(
      (id2) => [...peersOf.get(id2) ?? []].every((peer) => started2.has(peer))
    );
    if (index === -1) {
      throw new HostExtensionGraphError(
        `host extension peer cycle: ${describeCycle(peersOf, started2)}`
      );
    }
    const id = remaining[index];
    remaining.splice(index, 1);
    started2.add(id);
    order.push(id);
  }
  return order;
}
async function startHostExtensions(options2) {
  const order = resolveHostExtensionBootOrder(options2.extensions);
  const byId = new Map(options2.extensions.map((extension3) => [extension3.id, extension3]));
  const startDeadline = options2.startTimeoutMs === void 0 ? null : createDeadlinePolicy({
    name: HOST_EXTENSION_START_DEADLINE,
    timeoutMs: options2.startTimeoutMs,
    clock: options2.clock ?? realClock
  });
  const keepAlive = startDeadline === null ? null : createProcessKeepAlive({ name: HOST_EXTENSION_START_DEADLINE });
  const apis = {};
  const teardowns = [];
  const stopStarted = async () => {
    for (const teardown of teardowns.splice(0).reverse()) {
      try {
        await teardown.run();
      } catch (error42) {
        options2.onStopFailure(teardown.extensionId, error42);
      }
    }
  };
  try {
    for (const id of order) {
      const extension3 = byId.get(id);
      if (extension3 == null) {
        throw new HostExtensionGraphError(
          `the resolved boot order names an unknown host extension "${id}"`
        );
      }
      const deps = {};
      for (const dependency of extension3.dependencies) deps[dependency] = apis[dependency];
      const start = async () => extension3.start({
        deps,
        host: options2.host,
        onStop: (teardown) => {
          teardowns.push({ extensionId: id, run: teardown });
        }
      });
      try {
        apis[id] = await (startDeadline === null ? start() : startDeadline.run(start));
      } catch (error42) {
        await stopStarted();
        throw new HostExtensionStartError(id, error42);
      }
    }
  } finally {
    keepAlive?.dispose();
  }
  return { order, apis, stop: stopStarted };
}
function describeCycle(peersOf, started2) {
  const onPath = [];
  const walk = (id) => {
    const seenAt = onPath.indexOf(id);
    if (seenAt !== -1) return [...onPath.slice(seenAt), id];
    onPath.push(id);
    for (const peer of [...peersOf.get(id) ?? []].sort()) {
      if (started2.has(peer)) continue;
      const cycle = walk(peer);
      if (cycle != null) return cycle;
    }
    onPath.pop();
    return null;
  };
  const unsettled = [...peersOf.keys()].filter((id) => !started2.has(id)).sort();
  for (const id of unsettled) {
    const cycle = walk(id);
    if (cycle != null) return cycle.join(" \u2192 ");
  }
  return unsettled.join(" \u2192 ");
}

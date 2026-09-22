/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/grok-bot-harness/src/runner/frozen-tool-descriptions-middleware.ts
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
function isDescribedTool(tool) {
  return "description" in tool && typeof tool.description === "string" && "parameters" in tool;
}
var schemaShaByParameters = /* @__PURE__ */ new WeakMap();
function schemaShaOf(tool) {
  const parameters2 = tool.parameters;
  if (!isUnknownRecord(parameters2)) return sha256HexOfText("");
  const cached2 = schemaShaByParameters.get(parameters2);
  if (cached2 !== void 0) return cached2;
  let serialized;
  try {
    serialized = JSON.stringify(parameters2.jsonSchema) ?? "";
  } catch {
    serialized = "";
  }
  const sha = sha256HexOfText(serialized);
  schemaShaByParameters.set(parameters2, sha);
  return sha;
}
var FrozenToolDescriptionsMiddleware = class extends BaseMiddleware {
  constructor(innerExecutor, deps) {
    super(innerExecutor);
    this.deps = deps;
  }
  deps;
  stream(ctx, invocationId, tools, options2) {
    if (tools === void 0 || tools.length === 0) {
      return this.innerExecutor.stream(ctx, invocationId, tools, options2);
    }
    const live = /* @__PURE__ */ new Map();
    for (const tool of tools) {
      if (isDescribedTool(tool)) {
        live.set(tool.name, { description: tool.description, schemaSha: schemaShaOf(tool) });
      }
    }
    const resolved = resolveFrozenToolDescriptions({
      snapshot: this.deps.store.getToolDescriptionSnapshot(),
      compactionEpoch: this.deps.compactionEpoch(),
      live
    });
    if (resolved.snapshotToPersist !== void 0) {
      this.deps.store.setToolDescriptionSnapshot(resolved.snapshotToPersist);
    }
    const sent = tools.map((tool) => {
      if (!isDescribedTool(tool)) return tool;
      const description9 = resolved.descriptions.get(tool.name);
      if (description9 === void 0 || description9 === tool.description) return tool;
      return { ...tool, description: description9 };
    });
    return this.innerExecutor.stream(ctx, invocationId, sent, options2);
  }
};
function createFrozenToolDescriptionsMiddleware(deps) {
  return (executor) => new FrozenToolDescriptionsMiddleware(executor, deps);
}


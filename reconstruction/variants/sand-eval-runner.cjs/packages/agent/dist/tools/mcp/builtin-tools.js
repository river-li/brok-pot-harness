/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/agent/dist/tools/mcp/builtin-tools.js
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_esm13();
function resolveToolDescription(tool, props) {
  if ("descriptionGenerator" in tool) {
    return tool.descriptionGenerator(props, { promptVisible: false });
  }
  return tool.description;
}
var BUILTIN_TOOLS_SERVER_USE_INSTRUCTIONS = "Native Cursor tools for this session. These are highly recommended and useful tools that you should use when the right situation arises. Don't be afraid to look at one if it seems relevant, even if you don't end up using it. You MUST read the tool schemas before calling them.";
function buildBuiltinToolsServerUseInstructions(tools) {
  const lines2 = tools.flatMap((tool) => {
    const text2 = getConciseStaticContext(tool.contextType);
    return text2 === void 0 ? [] : [`- ${tool.name}: ${text2}`];
  });
  if (lines2.length === 0) {
    return BUILTIN_TOOLS_SERVER_USE_INSTRUCTIONS;
  }
  return [
    BUILTIN_TOOLS_SERVER_USE_INSTRUCTIONS,
    "",
    "Here are some crucial instructions:",
    ...lines2
  ].join("\n");
}
var DynamicToolRegistry = class {
  constructor(options2 = {}) {
    this.options = options2;
    this.toolsByName = /* @__PURE__ */ new Map();
    this.staticToolNames = /* @__PURE__ */ new Set();
    this.descriptionProps = { allTools: {} };
    this.cachedMcpDescriptors = /* @__PURE__ */ new Map();
  }
  replaceTools({ dynamicTools, allTools }) {
    const nextToolsByName = /* @__PURE__ */ new Map();
    for (const tool of dynamicTools) {
      nextToolsByName.set(tool.name, tool);
    }
    let nextStaticToolNames = /* @__PURE__ */ new Set();
    if (this.usesDirectToolRecovery()) {
      const dynamicToolSet = new Set(dynamicTools);
      nextStaticToolNames = new Set(allTools.filter((tool) => !dynamicToolSet.has(tool)).map((tool) => tool.name));
    }
    const nextDescriptionProps = buildDescriptionGeneratorProps(allTools);
    const descriptor2 = buildBuiltinToolsMcpDescriptorFromTools([...nextToolsByName.values()].sort((a, b2) => a.name.localeCompare(b2.name)), nextDescriptionProps);
    const nextCachedDescriptors = /* @__PURE__ */ new Map();
    if (descriptor2 !== void 0) {
      nextCachedDescriptors.set("", descriptor2);
    }
    this.toolsByName = nextToolsByName;
    this.staticToolNames = nextStaticToolNames;
    this.descriptionProps = nextDescriptionProps;
    this.cachedMcpDescriptors = nextCachedDescriptors;
  }
  isEmpty() {
    return this.toolsByName.size === 0;
  }
  getTool(name17) {
    return this.toolsByName.get(name17);
  }
  isStaticTool(name17) {
    return this.staticToolNames.has(name17);
  }
  usesDirectToolRecovery() {
    return this.options.directToolRecoveryEnabled === true;
  }
  getTools() {
    return [...this.toolsByName.values()].sort((a, b2) => a.name.localeCompare(b2.name));
  }
  getToolNames() {
    return this.getTools().map((tool) => tool.name);
  }
  getDescriptionProps() {
    return this.descriptionProps;
  }
  getMcpDescriptor(toolNames) {
    const key = toolNames === void 0 ? "" : `${toolNames.discoveryToolName}\0${toolNames.invocationToolName}`;
    const cached2 = this.cachedMcpDescriptors.get(key);
    if (cached2 !== void 0) {
      return cached2;
    }
    const descriptor2 = buildBuiltinToolsMcpDescriptorFromTools(this.getTools(), this.descriptionProps);
    if (descriptor2 !== void 0) {
      this.cachedMcpDescriptors.set(key, descriptor2);
    }
    return descriptor2;
  }
};
function buildBuiltinToolsMcpDescriptorFromTools(tools, descriptionProps) {
  if (tools.length === 0) {
    return void 0;
  }
  const toolDescriptors = tools.map((tool) => {
    const schema2 = tool.parameters.jsonSchema;
    return new McpToolDescriptor({
      toolName: tool.name,
      description: resolveToolDescription(tool, descriptionProps),
      ...schema2 !== void 0 ? { inputSchema: Value.fromJson(schema2) } : {}
    });
  });
  return new McpDescriptor({
    serverIdentifier: CURSOR_DYNAMIC_TOOLS_NAMESPACE,
    serverName: CURSOR_DYNAMIC_TOOLS_NAMESPACE,
    serverUseInstructions: buildBuiltinToolsServerUseInstructions(tools),
    tools: toolDescriptors
  });
}
function isReservedDynamicToolsNamespace(namespace) {
  return namespace === CURSOR_DYNAMIC_TOOLS_NAMESPACE;
}
function parseDynamicInvocationArgs(args) {
  let parsed = args;
  if (typeof args === "string") {
    try {
      parsed = JSON.parse(args);
    } catch {
      return void 0;
    }
  }
  if (parsed === null || typeof parsed !== "object" || Array.isArray(parsed)) {
    return void 0;
  }
  const namespace = "namespace" in parsed ? parsed.namespace : void 0;
  const server = "server" in parsed ? parsed.server : void 0;
  const toolName = "toolName" in parsed ? parsed.toolName : void 0;
  const resolvedNamespace = namespace ?? server;
  return {
    namespace: typeof resolvedNamespace === "string" ? resolvedNamespace : void 0,
    toolName: typeof toolName === "string" ? toolName : void 0,
    arguments: "arguments" in parsed ? parsed.arguments : void 0
  };
}
function resolveDynamicDispatch(rawArgs, dynamicToolRegistry) {
  const invocation = parseDynamicInvocationArgs(rawArgs);
  if (invocation?.namespace === void 0 || !isReservedDynamicToolsNamespace(invocation.namespace)) {
    return { kind: "external" };
  }
  if (invocation.toolName === void 0) {
    return { kind: "dynamic", registeredToolName: void 0 };
  }
  return {
    kind: "dynamic",
    registeredToolName: dynamicToolRegistry.getTool(invocation.toolName)?.name
  };
}
function agentToolResultToMcpToolResult(rendered) {
  const content = rendered.content.map((item) => {
    if (item.type === "text") {
      return new McpToolResultContentItem({
        content: {
          case: "text",
          value: new McpTextContent({ text: item.text })
        }
      });
    }
    if (item.type === "image") {
      return new McpToolResultContentItem({
        content: {
          case: "image",
          value: new McpImageContent({
            data: Buffer.from(item.data, "base64"),
            mimeType: item.mimeType ?? "image/png"
          })
        }
      });
    }
    return new McpToolResultContentItem({
      content: {
        case: "text",
        value: new McpTextContent({ text: JSON.stringify(item) })
      }
    });
  });
  return new McpToolResult({
    result: {
      case: "success",
      value: new McpSuccess({
        content,
        isError: rendered.isError
      })
    }
  });
}


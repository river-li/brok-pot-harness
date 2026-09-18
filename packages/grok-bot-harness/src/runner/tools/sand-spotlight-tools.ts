function withSpotlightedToolResult(tool) {
  return {
    ...tool,
    render: async (ctx, output, props) => {
      const rendered = await tool.render(ctx, output, props);
      return {
        ...rendered,
        content: spotlightToolResultContent(tool.name, rendered.content)
      };
    }
  };
}
function fencedToolSet(tools, spotlightEnabled, dynamicToolRegistry) {
  const finalTools = spotlightEnabled ? tools.map(withSpotlightedToolResult) : [...tools];
  if (dynamicToolRegistry === void 0) {
    return ToolSetHandle.fromTools(finalTools);
  }
  const { staticTools, dynamicTools } = partitionDynamicTools(finalTools, "final");
  return ToolSetHandle.fromTools({ staticTools, dynamicTools, dynamicToolRegistry });
}

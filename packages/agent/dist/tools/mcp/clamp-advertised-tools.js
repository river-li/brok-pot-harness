init_dist4();
var logger90 = createLogger("@anysphere/agent:advertised-tools-clamp");
var advertisedToolsClamped = createCounter("agent.tools.total_clamped", {
  description: "Advertised tool lists sliced to maxAdvertisedTools by dropping trailing direct MCP tools"
});

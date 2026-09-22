// Real MCP protocol fixture shared by HTTP/SSE and actual stdio children.
const assert = require("node:assert/strict");
function respond(message, identity) {
  if (message.id === undefined) return undefined;
  let result;
  switch (message.method) {
    case "initialize":
      result = {
        protocolVersion: message.params.protocolVersion,
        capabilities: { tools: {} },
        serverInfo: { name: `fixture-${identity}`, version: "1" },
      };
      break;
    case "ping":
      result = {};
      break;
    case "tools/list":
      result = {
        tools: [
          {
            name: "echo",
            description: `Echo from ${identity}`,
            inputSchema: {
              type: "object",
              properties: { text: { type: "string" } },
              required: ["text"],
            },
          },
        ],
      };
      break;
    case "tools/call":
      assert.equal(message.params.name, "echo");
      result = {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              identity,
              text: message.params.arguments.text,
            }),
          },
        ],
        isError: false,
      };
      break;
    default:
      return {
        jsonrpc: "2.0",
        id: message.id,
        error: { code: -32601, message: "Unknown fixture method" },
      };
  }
  return { jsonrpc: "2.0", id: message.id, result };
}
module.exports = { respond };
if (require.main === module) {
  const identity = process.env.GROKBOT_MCP_IDENTITY;
  assert.ok(identity);
  assert.equal(process.env.LITELLM_API_KEY, undefined);
  require("node:fs").appendFileSync(
    process.env.GROKBOT_MCP_PID_FILE,
    `${process.pid}\n`,
  );
  require("node:readline")
    .createInterface({ input: process.stdin })
    .on("line", (line) => {
      const message = JSON.parse(line);
      const response = respond(message, identity);
      if (response) process.stdout.write(JSON.stringify(response) + "\n");
    });
}

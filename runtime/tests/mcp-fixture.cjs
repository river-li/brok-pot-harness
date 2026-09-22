// Minimal, real JSON-RPC MCP servers for transport integration tests.
const assert = require("node:assert/strict");
const { randomUUID } = require("node:crypto");
const sseSessions = new Map();
function respond(message, transport, onCall = () => {}) {
  if (message.id === undefined) return undefined;
  let result;
  switch (message.method) {
    case "initialize":
      result = {
        protocolVersion: message.params.protocolVersion,
        capabilities: { tools: {} },
        serverInfo: { name: "grokbot-local-fixture", version: "1.0.0" },
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
            description: "Echo the supplied verification text.",
            inputSchema: {
              type: "object",
              properties: { text: { type: "string" } },
              required: ["text"],
            },
            annotations: {
              readOnlyHint: true,
              destructiveHint: false,
              openWorldHint: false,
            },
          },
        ],
      };
      break;
    case "tools/call":
      assert.equal(message.params.name, "echo");
      if (transport === "stdio") {
        assert.equal(process.env.GROKBOT_MCP_TEST_VALUE, "configured-locally");
        assert.equal(
          process.env.LITELLM_API_KEY,
          undefined,
          "Model key must not reach stdio server",
        );
      }
      onCall(message.params.arguments.text);
      result = {
        content: [
          {
            type: "text",
            text: `fixture-${transport}:${message.params.arguments.text}`,
          },
        ],
        isError: false,
      };
      break;
    default:
      return {
        jsonrpc: "2.0",
        id: message.id,
        error: { code: -32601, message: "Method not found" },
      };
  }
  return { jsonrpc: "2.0", id: message.id, result };
}
async function handleHttp(req, res, onCall) {
  assert.equal(req.headers.authorization, "Bearer fixture-mcp-token");
  if (req.headers.origin) {
    res.writeHead(403);
    res.end();
    return;
  }
  if (req.method !== "POST") {
    res.writeHead(405);
    res.end();
    return;
  }
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const message = JSON.parse(Buffer.concat(chunks));
  if (message.method === "initialize")
    await new Promise((resolve) => setTimeout(resolve, 250));
  const result = respond(message, "http", onCall);
  res.writeHead(result ? 200 : 202, { "content-type": "application/json" });
  res.end(result ? JSON.stringify(result) : undefined);
}
async function handleLegacySse(req, res, onCall) {
  assert.equal(req.headers.authorization, "Bearer fixture-mcp-token");
  if (req.headers.origin) {
    res.writeHead(403);
    res.end();
    return;
  }
  if (req.url === "/sse" && req.method === "GET") {
    const id = randomUUID();
    sseSessions.set(id, res);
    res.on("close", () => sseSessions.delete(id));
    res.writeHead(200, {
      "content-type": "text/event-stream",
      "cache-control": "no-cache",
    });
    res.write(`event: endpoint\ndata: /sse-post?id=${id}\n\n`);
    return;
  }
  if (req.url.startsWith("/sse-post?") && req.method === "POST") {
    const id = new URL(req.url, "http://localhost").searchParams.get("id");
    const stream = sseSessions.get(id);
    if (!stream) {
      res.writeHead(404);
      res.end();
      return;
    }
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    const message = JSON.parse(Buffer.concat(chunks));
    if (message.method === "initialize")
      await new Promise((resolve) => setTimeout(resolve, 250));
    const result = respond(message, "sse", onCall);
    if (result)
      stream.write(`event: message\ndata: ${JSON.stringify(result)}\n\n`);
    res.writeHead(202);
    res.end();
    return;
  }
  res.writeHead(405);
  res.end();
}
module.exports = { handleHttp, handleLegacySse };
if (require.main === module) {
  require("node:readline")
    .createInterface({ input: process.stdin })
    .on("line", (line) => {
      const message = JSON.parse(line);
      try {
        const result = respond(message, "stdio");
        if (result) process.stdout.write(JSON.stringify(result) + "\n");
      } catch {
        process.stdout.write(
          JSON.stringify({
            jsonrpc: "2.0",
            id: message.id,
            error: { code: -32603, message: "Fixture execution failed" },
          }) + "\n",
        );
      }
    });
}

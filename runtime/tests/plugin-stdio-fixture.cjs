/* This file is copied into a test plugin, then executed from its snapshot. */
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
require("node:readline")
  .createInterface({ input: process.stdin })
  .on("line", (line) => {
    const m = JSON.parse(line);
    if (m.id === undefined) return;
    let result;
    try {
      switch (m.method) {
        case "initialize":
          result = {
            protocolVersion: m.params.protocolVersion,
            capabilities: { tools: {} },
            serverInfo: { name: "copied-plugin", version: "1" },
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
                description: "Echo through the copied local plugin.",
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
          assert.equal(m.params.name, "echo");
          assert.equal(process.env.LITELLM_API_KEY, undefined);
          assert.notEqual(process.env.HOST_KEY_PROBE, "fixture-model-key");
          assert.ok(
            ["configured-one", "configured-two"].includes(
              process.env.PLUGIN_TOKEN,
            ),
          );
          result = {
            content: [
              {
                type: "text",
                text: JSON.stringify({
                  text: m.params.arguments.text,
                  resource: fs.readFileSync(
                    path.join(__dirname, "resource.txt"),
                    "utf8",
                  ),
                  configured: process.env.PLUGIN_TOKEN,
                }),
              },
            ],
            isError: false,
          };
          break;
        default:
          throw Error("Unknown method");
      }
      process.stdout.write(
        JSON.stringify({ jsonrpc: "2.0", id: m.id, result }) + "\n",
      );
    } catch {
      process.stdout.write(
        JSON.stringify({
          jsonrpc: "2.0",
          id: m.id,
          error: { code: -32603, message: "Plugin fixture failed" },
        }) + "\n",
      );
    }
  });

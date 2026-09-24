"use strict";

const assert = require("node:assert/strict");
const test = require("node:test");
const { DEFAULT_PROMPT, runProviderSmoke } = require("./provider-smoke.cjs");

test("provider smoke sends one fixed authenticated prompt and reports no response or credential data", async () => {
  const key = "fixture-provider-secret-do-not-print";
  let request;
  const output = [];
  const fetchImpl = async (url, options) => {
    request = { url, options };
    return {
      ok: true,
      status: 200,
      json: async () => ({
        status: "completed",
        output: [{ type: "message", content: [{ type: "output_text", text: "fixture-response-private-content" }] }],
      }),
    };
  };
  const result = await runProviderSmoke({
    GROKBOT_CONTAINER_API_URL: "https://api.example.net/v1/",
    GROKBOT_MODEL: "fixture-model",
    LITELLM_API_KEY: key,
    GROKBOT_REASONING_EFFORT: "low",
  }, fetchImpl, (message) => output.push(message));
  assert.equal(request.url, "https://api.example.net/v1/responses");
  assert.equal(request.options.headers.authorization, "Bearer " + key);
  const body = JSON.parse(request.options.body);
  assert.equal(body.input[0].content[0].text, DEFAULT_PROMPT);
  assert.equal(body.model, "fixture-model");
  assert.equal(body.stream, false);
  assert.equal(result.status, "completed");
  assert.equal(output.length, 1);
  assert.doesNotMatch(output.join("\n"), /fixture-response-private-content|fixture-provider-secret/);
});

test("provider smoke rejects missing server credentials before making a request", async () => {
  let called = false;
  await assert.rejects(
    runProviderSmoke({ GROKBOT_CONTAINER_API_URL: "https://api.example.net/v1", GROKBOT_MODEL: "fixture-model" }, async () => {
      called = true;
    }, () => {}),
    /LITELLM_API_KEY is not configured/,
  );
  assert.equal(called, false);
});

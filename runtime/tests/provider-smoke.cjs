"use strict";

const DEFAULT_PROMPT = "Reply with exactly the word OK.";

async function runProviderSmoke(env = process.env, fetchImpl = fetch, write = console.log) {
  const baseUrl = env.GROKBOT_RESPONSES_BASE_URL || env.GROKBOT_CONTAINER_API_URL;
  const model = env.GROKBOT_MODEL;
  const key = env.LITELLM_API_KEY;
  if (typeof baseUrl !== "string" || !/^https?:\/\//i.test(baseUrl)) {
    throw new Error("The configured Responses API URL is missing or invalid.");
  }
  if (typeof model !== "string" || !model.trim()) {
    throw new Error("The configured model ID is missing.");
  }
  if (typeof key !== "string" || !key.trim()) {
    throw new Error("LITELLM_API_KEY is not configured for the server.");
  }

  const responseUrl = baseUrl.replace(/\/+$/, "") + "/responses";
  let response;
  try {
    response = await fetchImpl(responseUrl, {
      method: "POST",
      headers: {
        authorization: "Bearer " + key,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model,
        input: [{ role: "user", content: [{ type: "input_text", text: DEFAULT_PROMPT }] }],
        max_output_tokens: 32,
        reasoning: { effort: env.GROKBOT_REASONING_EFFORT || "low" },
        stream: false,
      }),
      signal: AbortSignal.timeout(120_000),
    });
  } catch {
    throw new Error("The configured Responses service could not be reached from the server network.");
  }
  if (!response.ok) {
    throw new Error("The configured Responses service returned HTTP " + response.status + ". Check the server URL, model, and credentials.");
  }

  let payload;
  try {
    payload = await response.json();
  } catch {
    throw new Error("The configured Responses service returned an invalid response.");
  }
  const hasText = Array.isArray(payload.output) && payload.output.some((item) =>
    item.type === "message" && Array.isArray(item.content) && item.content.some((part) =>
      part.type === "output_text" && typeof part.text === "string" && part.text.trim().length > 0,
    ),
  );
  if (payload.status !== "completed" || !hasText) {
    throw new Error("The configured Responses service did not complete the smoke prompt with text.");
  }

  write("PASS external Responses service returned a completed response for the configured model.");
  return { status: payload.status, model };
}

if (require.main === module) {
  runProviderSmoke().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}

module.exports = { DEFAULT_PROMPT, runProviderSmoke };

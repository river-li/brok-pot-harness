/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/shared/agents/agent-model.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var SAND_DEFAULT_MODEL_ID, SAND_DEFAULT_MODEL_SELECTION;
var init_agent_model = __esm({
  "src/shared/agents/agent-model.ts"() {
    "use strict";
    SAND_DEFAULT_MODEL_ID = "grok-4.5";
    SAND_DEFAULT_MODEL_SELECTION = {
      modelId: SAND_DEFAULT_MODEL_ID,
      maxMode: true,
      parameters: [
        { id: "effort", value: "high" },
        { id: "fast", value: "true" }
      ]
    };
  }
});


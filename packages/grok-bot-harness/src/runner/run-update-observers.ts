/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/grok-bot-harness/src/runner/run-update-observers.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
function createRunUpdateObservers(run) {
  return {
    noteUpdate: (update) => {
      switch (update.type) {
        case "text-delta":
          run.observeFirstToken("text");
          run.collectors.collectText(update.text);
          return;
        case "thinking-delta":
          run.observeFirstToken("thinking");
          return;
        case "tool-call":
          run.observeFirstToken("tool_call");
          return;
        case "send-message":
          run.collectors.collectSendMessage();
          if (update.message.type === "widget" || update.message.type === "secret-request" || update.message.type === "auto-review-approval" || update.message.type === "credential-request") {
            run.pause();
          }
          if (update.message.type === "text") {
            run.collectors.collectAgentMessage(update.message.content);
          }
          return;
        default:
          return;
      }
    },
    noteMessageDispatched: run.onMessageDispatched,
    noteReactionApplied: run.collectors.collectReaction
  };
}


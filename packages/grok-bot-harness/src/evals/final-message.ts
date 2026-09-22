/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/grok-bot-harness/src/evals/final-message.ts
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
function selectSandEvalFinalMessage(args) {
  return args.deliveredMessages.length === 0 && args.systemPrompt != null ? args.assistantText : args.deliveredMessages.join("\n\n");
}


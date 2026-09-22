/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/grok-bot-harness/src/evals/run-to-pause.ts
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
async function runSandAgentToPause(runner, options2) {
  const pendingCompletions = [];
  runner.setBackgroundSubagentHandler((completion) => {
    pendingCompletions.push(completion);
  });
  let result = await runner.run(options2.prompt, options2.runOptions);
  let revivalIndex = 0;
  while (true) {
    await runner.drainBackgroundSubagents();
    const completions = pendingCompletions.splice(0);
    if (completions.length === 0) return result;
    revivalIndex += 1;
    result = await runner.run(buildSubagentRevivalPrompt(completions, runner), {
      ...options2.revivalRunOptions?.(revivalIndex, completions),
      hidden: true,
      isSilenceAllowed: true
    });
  }
}


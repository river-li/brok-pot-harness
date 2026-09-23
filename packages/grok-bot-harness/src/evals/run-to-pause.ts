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
    result = await runner.run(buildSubagentRevival(completions, runner), {
      ...options2.revivalRunOptions?.(revivalIndex, completions),
      hidden: true,
      isSilenceAllowed: true
    });
  }
}

var NO_TOOLS_SECTION = `
## No tools

You have no tools. Respond in plain text only. Do not emit \`<tool_call>\` XML, JSON tool-call payloads, function-call markup, or the name of a tool, even if the request or an earlier message mentions one.

If no video is attached, say so and stop. Do not claim you extracted frames or watched a file you were not given, and do not describe a path that appears only in the request text.
`;
function createMediaSubagentSystemPromptOverride(specialistPrompt) {
  const prompt = `${specialistPrompt.trim()}
${NO_TOOLS_SECTION}`;
  return () => prompt;
}

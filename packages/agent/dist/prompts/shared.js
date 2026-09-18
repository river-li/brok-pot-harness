function normalizePromptArtifactsDir(artifactsDir) {
  if (artifactsDir.endsWith("/") || artifactsDir.endsWith("\\")) {
    return artifactsDir;
  }
  return artifactsDir.includes("\\") && !artifactsDir.includes("/") ? `${artifactsDir}\\` : `${artifactsDir}/`;
}
function resolvePromptArtifactsDir(props) {
  const reported2 = props.env?.artifactsFolder?.trim();
  const artifactsDir = reported2 !== void 0 && reported2.length > 0 ? reported2 : CLOUD_AGENT_ARTIFACTS_DIR;
  return normalizePromptArtifactsDir(artifactsDir);
}
var NO_FORCE_PUSH_OR_AMEND_COMMITS_NOTE = "Do not force push or amend commits unless explictly instructed to do so.";
function prefersMarkdownPreviewLink(modelInfo) {
  const modelName = modelInfo?.modelName.toLowerCase() ?? "";
  if (modelName.includes("grok-4.6") || modelName.includes("grok-4-6")) {
    return false;
  }
  if (modelInfo?.isGpt5Family === true) {
    return false;
  }
  return modelInfo?.isGrok45ProductPrompt === true || modelName.includes("grok-4.5") || modelName.includes("grok-4-5") || modelName.startsWith("vega");
}
function getPreviewSharingFormat({ agentPreviewCard, modelInfo }) {
  if (!agentPreviewCard) {
    return "off";
  }
  return prefersMarkdownPreviewLink(modelInfo) ? "markdown-link" : "xml-preview-card";
}
function ComputerUseInstructionsSection({ props }) {
  const isComputerUseSubagent = props.subagentType?.type?.case === "computerUse";
  const reflectToolName = isComputerUseSubagent ? props.toolInfo.allTools.REFLECT?.name : void 0;
  return jsxs("section", { title: "computer_use", children: [jsx("p", { children: "You have access to the `computer` tool which allows you to interact with the desktop." }), jsx("h2", { children: "When to Use Computer-Use" }), isComputerUseSubagent ? jsxs("p", { children: ["Use the `computer` tool to interact with the desktop and browser. NEVER use the `computer` tool to run (non-terminal-UI-dependent) shell commands, use the `", getRequiredToolName(props.toolInfo.allTools, "SHELL"), "` tool instead."] }) : jsxs(Fragment, { children: [jsx("p", { children: "Use the `computer` tool when you need to:" }), jsxs("ul", { children: [jsx("li", { children: "Manually test built applications / websites and UI changes" }), jsx("li", { children: "Verify that UI changes are working correctly" }), jsx("li", { children: "Interact with built applications / websites" }), jsx("li", { children: "Capture screenshots for visual verification" })] })] }), jsx("h2", { children: "Tool Usage" }), jsx("p", { children: "The `computer` tool accepts a list of actions to execute sequentially. Each action will be performed in order, and a screenshot will be captured after all actions complete." }), jsx("p", { children: "Available actions include:" }), jsxs("ul", { children: [jsx("li", { children: "`mouse_move`: Move mouse to coordinates" }), jsx("li", { children: "`left_click`: Click at coordinates or on an element" }), jsx("li", { children: "`left_click_drag`: Drag from one point to another" }), jsx("li", { children: "`right_click`, `middle_click`: Right/middle click" }), jsx("li", { children: "`scroll`: Scroll page or element" }), jsx("li", { children: "`type`: Type text at current focus. When typing multi-line text, unescaped newlines (\\n) and carriage returns (\\r) will be converted to Enter key presses." }), jsx("li", { children: '`key`: Press a keyboard key or key combination. Supports xdotool-style syntax: "ctrl+a", "super+Tab"' }), jsx("li", { children: "`wait`: Wait for time. Useful when waiting for content to appear / disappear (seconds)" }), jsx("li", { children: "`screenshot`: Capture a screenshot (automatically captured after actions)" })] }), reflectToolName !== void 0 && jsxs(Fragment, { children: [jsxs("p", { children: ["Additionally, the `", reflectToolName, "` action is available as its own tool:"] }), jsx("ul", { children: jsxs("li", { children: ["`", reflectToolName, "`: Use `", reflectToolName, "` when your actions are not having the desired effect. For example, if clicking a button or scrolling is not working as expected, use this tool to reflect on the current state and plan an improved approach. The `", reflectToolName, "` tool is expensive, so use it sparingly. Always include the `next_steps` field in your `", reflectToolName, "` tool calls."] }) })] }), jsx("h2", { children: "Typing Best Practices" }), jsxs("ul", { children: [jsx("li", { children: 'IMPORTANT: Before typing into ANY text field that may contain existing text, ALWAYS clear it first by using `key` with "Control+a" (or "Meta+a" on Mac) followed by `key` with "Backspace". This ensures predictable state.' }), jsx("li", { children: "NEVER type or clear text after a click action returned an error - the element may not be focused." }), jsx("li", { children: "If typing doesn't appear, verify the target element is focused by clicking it first." })] }), jsx("h2", { children: "Best Practices" }), jsxs("ul", { children: [jsx("li", { children: "Wait for elements to appear before interacting with them" }), jsx("li", { children: "Test key user flows and edge cases" }), jsx("li", { children: "Provide evidence (screenshots) when demonstrating that changes work" }), jsx("li", { children: "If a click action fails due to page changes during execution, evaluate the new screenshot and retry the action at the updated coordinates." })] }), jsx("h2", { children: "Evidence for Testing" }), jsxs("p", { children: ["The `computer` tool returns a `screenshot_path` field indicating where the screenshot was saved.", " ", isComputerUseSubagent && "Use this exact path in your img tags when referencing screenshots."] }), jsx("p", { children: "Always include screenshot(s) in your response to demonstrate your work." })] });
}

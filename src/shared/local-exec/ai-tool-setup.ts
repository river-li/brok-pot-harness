init_v4();
var SAND_AI_TOOL_SOURCES = ["claude_code", "codex"];
var SAND_AI_TOOL_DISPLAY_NAMES = {
  claude_code: "Claude Code",
  codex: "Codex"
};
var SAND_AI_TOOL_SETUP_MAX_ITEMS = 40;
var SAND_AI_TOOL_SETUP_MAX_TEXT_CHARS = 160;
var SAND_AI_TOOL_SETUP_ITEM_KINDS = ["session", "mcp_server", "skill", "plugin"];
var setupItemSchema = object({
  kind: _enum2(SAND_AI_TOOL_SETUP_ITEM_KINDS),
  title: string2().max(SAND_AI_TOOL_SETUP_MAX_TEXT_CHARS),
  excerpt: string2().max(SAND_AI_TOOL_SETUP_MAX_TEXT_CHARS).optional(),
  occurredAtMs: number2().int().nonnegative().optional()
});
var setupSchema = object({
  source: _enum2(SAND_AI_TOOL_SOURCES),
  found: boolean2(),
  sessionCount: number2().int().nonnegative(),
  lastActiveAtMs: number2().int().nonnegative().optional(),
  items: array(setupItemSchema).max(SAND_AI_TOOL_SETUP_MAX_ITEMS)
});
function parseSandAiToolSetup(u2) {
  const result = setupSchema.safeParse(u2);
  if (!result.success) {
    throw new SandWireParseError(`ai tool setup: ${describeZodIssues(result.error)}`);
  }
  return result.data;
}
function describeAiToolSetupRead(source) {
  return { action: "read-ai-tool-setup", target: SAND_AI_TOOL_DISPLAY_NAMES[source] };
}

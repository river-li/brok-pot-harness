init_zod();
var primitiveSkillSchema = external_exports.object({
  /** Plugin-root-relative path to the SKILL.md file. */
  path: external_exports.string(),
  name: external_exports.string().optional(),
  description: external_exports.string().optional(),
  globs: external_exports.array(external_exports.string()).optional(),
  alwaysApply: external_exports.boolean().optional(),
  /** Full markdown body including frontmatter. */
  content: external_exports.string(),
  environments: external_exports.array(external_exports.string()).optional(),
  disabledEnvironments: external_exports.array(external_exports.string()).optional()
});
var primitiveRuleSchema = primitiveSkillSchema.extend({
  name: external_exports.string()
});
var primitiveAgentSchema = external_exports.object({
  /** Plugin-root-relative path to the agent markdown file. */
  path: external_exports.string(),
  name: external_exports.string(),
  description: external_exports.string().optional(),
  tools: external_exports.array(external_exports.string()).optional(),
  model: external_exports.string().optional(),
  /** Full agent prompt/instructions (markdown body). */
  prompt: external_exports.string(),
  permissionMode: external_exports.enum(["default", "readonly"]).optional()
});
var primitiveCommandSchema = external_exports.object({
  /** Plugin-root-relative path to the command file. */
  path: external_exports.string(),
  name: external_exports.string(),
  description: external_exports.string().optional(),
  argumentHint: external_exports.string().optional(),
  /** Full command template body. */
  content: external_exports.string()
});
var hooksConfigSchema = external_exports.custom((value) => typeof value === "object" && value !== null && typeof value.hooks === "object" && value.hooks !== null);
var primitiveHooksSchema = external_exports.object({
  config: hooksConfigSchema,
  /** Plugin-root-relative path to the file the hooks config came from. */
  sourcePath: external_exports.string().optional()
});
var variablesJsonSchema = external_exports.custom((value) => typeof value === "object" && value !== null);
var pluginPrimitiveManifestSchema = external_exports.object({
  schemaVersion: external_exports.number().int(),
  displayName: external_exports.string().optional(),
  description: external_exports.string().optional(),
  authorName: external_exports.string().optional(),
  skills: external_exports.array(primitiveSkillSchema),
  rules: external_exports.array(primitiveRuleSchema),
  agents: external_exports.array(primitiveAgentSchema),
  commands: external_exports.array(primitiveCommandSchema),
  /**
   * Verbatim (unexpanded) MCP config: `${CURSOR_PLUGIN_ROOT}` and `${VAR}`
   * placeholders preserved. `mcpServerSourcePaths` are plugin-root-relative.
   */
  mcpConfig: mcpConfigSchema.extend({
    mcpServerSourcePaths: external_exports.record(external_exports.string(), external_exports.string()).optional()
  }).optional(),
  hooks: primitiveHooksSchema.optional(),
  /** Set when the plugin's hooks config failed to parse/validate at load time. */
  hooksError: external_exports.string().optional(),
  /**
   * Raw capability strings from the plugin manifest. Kept as strings (not the
   * `Capability` enum) so manifests written by newer builders still parse.
   */
  capabilities: external_exports.array(external_exports.string()),
  variablesSchema: variablesJsonSchema.optional()
});

/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/shared/bot-templates/bot-template-recipe.ts
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/2
init_grok_bot_templates();
init_zod();

// @recovered-fragment 2/2
function nonEmptyEnumValues(values) {
  const first = values[0];
  invariant(first !== void 0, "bot template avatar enum must have at least one value");
  return [first, ...values.slice(1)];
}
var botTemplateAvatarColors = nonEmptyEnumValues(GROK_BOT_MARK_COLORS);
var botTemplateAvatarShapes = nonEmptyEnumValues(GROK_BOT_MARK_SHAPES);
var skillSchema = external_exports.object({
  name: external_exports.string().min(1),
  description: external_exports.string().min(1),
  content: external_exports.string().min(1)
});
var skillShareRefSchema = external_exports.object({
  name: external_exports.string().min(1),
  description: external_exports.string().optional(),
  content: external_exports.string().optional()
});
var skillShareArgsRefSchema = skillShareRefSchema.extend({
  content: external_exports.string().min(1)
});
var routineSchema = external_exports.object({
  name: external_exports.string().min(1),
  slug: external_exports.string().min(1),
  description: external_exports.string().min(1),
  content: external_exports.string().min(1)
});
var automationShareRefSchema = external_exports.object({
  slug: external_exports.string().min(1),
  name: external_exports.string().optional(),
  description: external_exports.string().optional(),
  content: external_exports.string().optional()
});
var automationShareArgsRefSchema = automationShareRefSchema.extend({
  content: external_exports.string().min(1),
  description: external_exports.string().min(1)
});
var memorySchema = external_exports.object({
  kind: external_exports.preprocess(
    (value) => value === null ? void 0 : value,
    external_exports.enum(SAND_MEMORY_KINDS).optional()
  ),
  createdAt: external_exports.preprocess((value) => value === null ? void 0 : value, external_exports.string().optional()),
  content: external_exports.string().min(1)
});
var pluginSchema = external_exports.object({
  name: external_exports.string().min(1),
  description: external_exports.string().min(1).optional(),
  pluginId: external_exports.string().min(1)
});
var pluginShareRefSchema = external_exports.object({
  pluginId: external_exports.string().min(1),
  name: external_exports.string().optional(),
  description: external_exports.string().optional()
});
var botProfileSchema = external_exports.object({
  name: external_exports.string().min(1),
  description: external_exports.string().min(1),
  avatarColor: external_exports.enum(botTemplateAvatarColors).optional(),
  avatarShape: external_exports.enum(botTemplateAvatarShapes).optional()
});
var botTemplateGettingStartedSchema = external_exports.object({
  skill: external_exports.string().min(1)
});
function requireGettingStartedSkill(template, ctx) {
  const skillName2 = template.gettingStarted?.skill;
  if (skillName2 === void 0) return;
  if (template.skills.some((skill) => skill.name === skillName2)) return;
  ctx.addIssue({
    code: external_exports.ZodIssueCode.custom,
    path: ["gettingStarted", "skill"],
    message: "gettingStarted.skill must name one of this recipe's skills"
  });
}
var botTemplateObjectSchema = external_exports.object({
  profile: botProfileSchema,
  memory: external_exports.array(memorySchema),
  skills: external_exports.array(skillSchema),
  routines: external_exports.array(routineSchema),
  plugins: external_exports.array(pluginSchema),
  gettingStarted: botTemplateGettingStartedSchema.optional()
});
var botTemplateSchema = botTemplateObjectSchema.superRefine(requireGettingStartedSkill);
var botTemplateDraftObjectSchema = botTemplateObjectSchema.extend({
  skills: external_exports.array(skillShareRefSchema),
  routines: external_exports.array(automationShareRefSchema),
  plugins: external_exports.array(pluginShareRefSchema)
});
var botTemplateDraftSchema = botTemplateDraftObjectSchema.superRefine(
  requireGettingStartedSkill
);
var botTemplateShareArgsSchema = botTemplateDraftObjectSchema.extend({
  skills: external_exports.array(skillShareArgsRefSchema),
  routines: external_exports.array(automationShareArgsRefSchema),
  visibility: external_exports.enum(SAND_BOT_TEMPLATE_VISIBILITIES).optional()
});
var BOT_TEMPLATE_RECIPE_CONTENT_TYPE = "application/json";
var BOT_TEMPLATE_RECIPE_MAX_BYTES = GROK_BOT_TEMPLATE_BLOB_MAX_BYTES;
function stampBotTemplateShareArgs(args, mark) {
  return {
    profile: {
      ...args.profile,
      avatarShape: mark.avatarShape ?? args.profile.avatarShape,
      avatarColor: mark.avatarColor ?? args.profile.avatarColor
    },
    memory: args.memory,
    skills: args.skills,
    routines: args.routines,
    plugins: args.plugins,
    ...args.gettingStarted === void 0 ? {} : { gettingStarted: args.gettingStarted }
  };
}
function withShippedClientRequiredTitle(template) {
  return {
    ...template,
    profile: { ...template.profile, title: template.profile.name }
  };
}
function botTemplateRecipeJson(template) {
  return JSON.stringify(withShippedClientRequiredTitle(template));
}
function encodeBotTemplateRecipe(template) {
  return Uint8Array.from(new TextEncoder().encode(botTemplateRecipeJson(template)));
}


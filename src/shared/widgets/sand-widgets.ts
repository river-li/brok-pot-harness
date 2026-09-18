init_zod();
var widgetActionStyleSchema = external_exports.enum(SAND_WIDGET_ACTION_STYLES);
var choiceOptionSchema = external_exports.object({
  label: external_exports.string().trim().min(1),
  value: external_exports.string().trim().min(1).optional().describe(
    "Text sent back to you when this option is picked. Defaults to the label. Make it read like something the user would naturally say in reply."
  ),
  description: external_exports.string().trim().min(1).optional(),
  style: widgetActionStyleSchema.optional()
});
var sandWidgetSchema = external_exports.object({
  prompt: external_exports.string().trim().min(1),
  helpText: external_exports.string().trim().min(1).optional(),
  options: external_exports.array(choiceOptionSchema).min(1).max(6),
  multiSelect: external_exports.boolean().optional().describe(
    "When true, several options may apply. The user toggles any subset, then submits once. Picked values return in one reply, one per line."
  ),
  allowCustom: external_exports.boolean().optional().describe(
    "When true, the user can type a custom free-text answer instead of choosing one of the options."
  ),
  dismissOnMoveOn: external_exports.boolean().optional().describe(
    "When true, this widget auto-dismisses (becomes inert, shows a muted Dismissed state) once the user sends a newer message without answering it. Omit/false to keep the question live and answerable indefinitely. Set true only for low-stakes questions that become moot if the user moves on; keep it off for real decisions you still need answered."
  )
});

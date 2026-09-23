init_zod();
var VOICE_CALL_SEARCH_MISSING_QUERY_ERROR = `${VOICE_CALL_SEARCH_CONVERSATIONS_TOOL} needs a query: a few words naming the fact you want`;
var INPUT5 = external_exports.object({
  query: external_exports.string().trim().superRefine((query, ctx) => {
    if (query.length > 0)
      return;
    ctx.addIssue({
      code: external_exports.ZodIssueCode.custom,
      message: VOICE_CALL_SEARCH_MISSING_QUERY_ERROR
    });
  }),
  scope: external_exports.enum(VOICE_CALL_SEARCH_SCOPES).optional(),
  id: external_exports.string().trim().optional(),
  from: external_exports.string().trim().optional(),
  to: external_exports.string().trim().optional(),
  if_missing: external_exports.enum(VOICE_CALL_SEARCH_MISS_FALLBACKS)
});
var OUTPUT5 = external_exports.object({
  hits: external_exports.array(external_exports.object({
    id: external_exports.string().min(1),
    where: external_exports.string(),
    when: external_exports.string(),
    writer: external_exports.enum(["you", "them"]),
    quote: external_exports.string().max(VOICE_CALL_SEARCH_QUOTE_CHAR_LIMIT),
    text: external_exports.string().max(VOICE_CALL_SEARCH_OPEN_CHAR_LIMIT).optional(),
    before: external_exports.string().max(VOICE_CALL_SEARCH_CONTEXT_CHAR_LIMIT).optional(),
    after: external_exports.string().max(VOICE_CALL_SEARCH_CONTEXT_CHAR_LIMIT).optional()
  })).max(VOICE_CALL_SEARCH_HIT_LIMIT),
  more: external_exports.boolean()
});
var SearchConversationsTool = class _SearchConversationsTool extends VoiceCallTool {
  static definition = {
    name: VOICE_CALL_SEARCH_CONVERSATIONS_TOOL,
    descriptor: VoiceCallSessionTools.descriptor(VOICE_CALL_SEARCH_CONVERSATIONS_TOOL),
    input: INPUT5,
    output: OUTPUT5,
    invalidInputError: `invalid arguments for ${VOICE_CALL_SEARCH_CONVERSATIONS_TOOL}`
  };
  static defaultScope = "everything";
  search;
  constructor(search) {
    super(_SearchConversationsTool.definition);
    this.search = search;
  }
  async execute(input, call) {
    const given = (value) => value !== void 0 && value.length > 0 ? value : void 0;
    const id = given(input.id);
    const from2 = given(input.from);
    const to3 = given(input.to);
    return await this.search({
      query: input.query,
      scope: input.scope ?? _SearchConversationsTool.defaultScope,
      ...id === void 0 ? {} : { id },
      ...from2 === void 0 ? {} : { from: from2 },
      ...to3 === void 0 ? {} : { to: to3 }
    }, call);
  }
};

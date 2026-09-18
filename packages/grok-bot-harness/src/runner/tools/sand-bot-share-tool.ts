init_esm2();
function nonEmptyAvatar(value) {
  return value != null && value.length > 0 ? value : void 0;
}
function botTemplateShareToMessage(result) {
  return {
    type: "bot-template-share",
    shareId: result.id,
    name: result.name,
    avatarShape: result.avatarShape,
    avatarColor: result.avatarColor,
    body: result.description,
    shareUrl: result.shareUrl,
    version: result.version,
    published: result.published,
    ...result.activeVersion == null ? {} : { activeVersion: result.activeVersion },
    ...result.visibility == null ? {} : { visibility: result.visibility }
  };
}
var SAND_CREATE_BOT_SHARE_JSON_TOOL_NAME = "create_bot_share_json";
var createBotShareJsonParameters = botTemplateShareArgsSchema;
var BOT_SHARE_JSON_INVALID_MESSAGE = "The recipe could not be staged. Check the required profile fields and try again.";
var BOT_SHARE_JSON_GETTING_STARTED_UNKNOWN_SKILL_MESSAGE = "This call's gettingStarted.skill does not name any skill passed in skills. Set gettingStarted.skill to the exact name of the onboarding skill and include that skill (name, description, content) in skills, then retry. Omit gettingStarted only if the template should have no first-run onboarding.";
var BOT_SHARE_JSON_TOO_LARGE_MESSAGE = "This create_bot_share_json call is too large. The host limit was exceeded. Reduce the payload and retry. Do not retry the same payload.";
function recipeArgChars(recipe) {
  return JSON.stringify(recipe)?.length ?? 0;
}
var BOT_TEMPLATE_SHARE_DIRECT_CHAT_REQUIRED_MESSAGE = "Sharing a template isn't available in this conversation. Share from a direct chat with the assistant.";
var BOT_TEMPLATE_SHARE_REASON_HEADER = "x-grok-bot-share-reason";
var BOT_TEMPLATE_SHARING_DISABLED_MESSAGE = "Grok Bot template sharing is disabled. Tell the user template sharing is not available. Do not say their team turned sharing off. Do not retry create_bot_share_json.";
var BOT_TEMPLATE_PUBLIC_SHARING_DISABLED_MESSAGE = "Public Grok Bot template sharing is not allowed. Tell the user they can still share with the team. Retry create_bot_share_json with visibility team. Do not omit visibility \u2014 that keeps an existing PUBLIC parent and fails again. Do not say all template sharing is disabled.";
var BOT_TEMPLATE_TEAM_SHARED_SOURCE_MESSAGE = "This bot is shared with the team, so it cannot be saved as a template. Tell the user they can still share a template from a personal bot. Do not retry create_bot_share_json.";
var PUBLIC_SHARING_DISABLED_MARKERS = [
  "Public Grok Bot template sharing is not allowed",
  "Public Grok Bot template sharing is disabled"
];
var SHARING_DISABLED_MARKER = "Grok Bot template sharing is disabled";
var TEAM_SHARED_SOURCE_MARKER = "A team-shared bot cannot be saved as a template";
function botTemplateShareRefusalReason(error41) {
  if (error41 instanceof ConnectError) {
    const header = error41.metadata.get(BOT_TEMPLATE_SHARE_REASON_HEADER);
    if (header === "none" || header === "public_disabled" || header === "team_shared_source") {
      return header;
    }
  }
  const message = error41 instanceof Error ? error41.message : String(error41);
  if (PUBLIC_SHARING_DISABLED_MARKERS.some((marker17) => message.includes(marker17))) {
    return "public_disabled";
  }
  if (message.includes(TEAM_SHARED_SOURCE_MARKER)) {
    return "team_shared_source";
  }
  if (message.includes(SHARING_DISABLED_MARKER)) {
    return "none";
  }
  return void 0;
}
function botTemplateShareRefusalToolResult(error41) {
  const reason = botTemplateShareRefusalReason(error41);
  if (reason === "none") {
    return BOT_TEMPLATE_SHARING_DISABLED_MESSAGE;
  }
  if (reason === "public_disabled") {
    return BOT_TEMPLATE_PUBLIC_SHARING_DISABLED_MESSAGE;
  }
  if (reason === "team_shared_source") {
    return BOT_TEMPLATE_TEAM_SHARED_SOURCE_MESSAGE;
  }
  return void 0;
}
function shareScopeDescriptionSuffix(scope) {
  if (scope?.kind === "disabled") {
    return " Template sharing is disabled. Tell the user it is not available. Do not say their team turned sharing off. Do not call this tool.";
  }
  if (scope?.kind === "choose") {
    return ' This user can choose TEAM or PUBLIC for a first template. Send a question widget asking which they want, then wait for their reply. Do not read or pack anything and do not call this tool until they choose. Pass top-level visibility as "team" or "public". TEAM may keep team-internal refs; PUBLIC stays conservative.';
  }
  if (scope?.kind === "current" && scope.visibility === "team") {
    return ' Current template scope is TEAM. Follow the export skill: team-internal refs are OK; still scrub secrets and individual PII. Pass top-level visibility as "team". Do not pass visibility as "public" \u2014 making a team template public is a separate owner confirmation, not this export.';
  }
  if (scope?.kind === "current" && scope.visibility === "public") {
    return ' Current template scope is PUBLIC. Follow the export skill: stay conservative. Pass top-level visibility as "public", or pass visibility as "team" only if the user wants this export to become a team template.';
  }
  if (scope?.kind === "forced" && scope.visibility === "team") {
    return ' This user can only create TEAM templates. Do not ask about PUBLIC. Pass top-level visibility as "team".';
  }
  if (scope?.kind === "forced" && scope.visibility === "public") {
    return ' This user can only create PUBLIC templates. Do not ask about TEAM. Pass top-level visibility as "public".';
  }
  return ' Follow the export skill visibility options and do not guess. If this bot already has a template, use its current TEAM or PUBLIC visibility as the redaction scope and pass that visibility explicitly. Do not pass visibility as "public" to switch a TEAM template \u2014 that is a separate owner confirmation. If no current scope is named and the user can choose TEAM or PUBLIC, send a question widget before reading or packing, wait for their reply, then pass top-level visibility as "team" or "public". If only one audience is allowed, pass that one. If sharing is disabled, tell the user and do not retry.';
}
function botTemplateShareCreateInputFromRecipe(args) {
  const mark = resolveGrokBotMark({
    agentId: args.sourceAgentId,
    avatarShape: nonEmptyAvatar(args.avatar?.avatarShape) ?? nonEmptyAvatar(args.recipe.profile.avatarShape) ?? GROK_BOT_CUSTOM_URL_MARK.shape,
    avatarColor: nonEmptyAvatar(args.avatar?.avatarColor) ?? nonEmptyAvatar(args.recipe.profile.avatarColor) ?? GROK_BOT_CUSTOM_URL_MARK.color
  });
  if (recipeArgChars(args.recipe) > READ_CHAR_HARD_LIMIT) {
    return { error: BOT_SHARE_JSON_TOO_LARGE_MESSAGE };
  }
  const stamped = botTemplateDraftSchema.safeParse(
    stampBotTemplateShareArgs(args.recipe, {
      avatarShape: mark.shape,
      avatarColor: mark.color
    })
  );
  if (!stamped.success) {
    return {
      error: stamped.error.issues.some((issue2) => issue2.path[0] === "gettingStarted") ? BOT_SHARE_JSON_GETTING_STARTED_UNKNOWN_SKILL_MESSAGE : BOT_SHARE_JSON_INVALID_MESSAGE
    };
  }
  const bytes = encodeBotTemplateRecipe(stamped.data);
  if (bytes.byteLength > BOT_TEMPLATE_RECIPE_MAX_BYTES) {
    return { error: BOT_SHARE_JSON_TOO_LARGE_MESSAGE };
  }
  return {
    name: args.recipe.profile.name,
    avatarShape: mark.shape,
    avatarColor: mark.color,
    description: args.recipe.profile.description,
    sourceAgentId: args.sourceAgentId,
    ...args.requestedVisibility == null ? {} : { requestedVisibility: args.requestedVisibility },
    blob: {
      bytes,
      contentType: BOT_TEMPLATE_RECIPE_CONTENT_TYPE
    }
  };
}
function resolvedToolVisibility(args) {
  if (args.scope?.kind === "current") {
    if (args.requested === "team" && args.scope.visibility === "public") {
      return "team";
    }
    return args.scope.visibility;
  }
  if (args.requested != null) {
    return args.requested;
  }
  if (args.scope?.kind === "forced") {
    return args.scope.visibility;
  }
  return void 0;
}
var CREATE_BOT_SHARE_JSON_GETTING_STARTED_DESCRIPTION = ` To give the template a first-run onboarding, pass gettingStarted as {"skill": <name>} naming exactly one of this call's skills entries \u2014 per the export skill, a short getting-started skill authored for this template that asks the new owner its setup questions (what to connect, what to be called, how their team works); the imported bot runs it as its first conversation with its new owner. A gettingStarted naming a skill not passed in skills fails the call; omit gettingStarted when the template has no onboarding skill.`;
function createBotShareJsonDescription(scope, gettingStarted) {
  return "Stage a draft version of this bot from the reusable recipe. After visibility is known and the recipe has been packed and scrubbed, call this tool with profile (name, description, and optional avatarShape/avatarColor), memory, skills, routines, plugins, " + (gettingStarted ? "optional gettingStarted, " : "") + `and top-level visibility ("public" or "team") selected according to the scope guidance below. Omit avatars; the host copies the source bot's live geometric avatar when one exists and uses recipe avatars only as a fallback. Write profile.description as a short storefront label shown on template cards, share pages, and imports: one or two sentences telling someone who has never seen this bot what it does and who it is for.` + shareScopeDescriptionSuffix(scope) + " For memory, pass job or convention facts only \u2014 content plus optional kind (profile or log) and createdAt (YYYY-MM-DD) \u2014 keeping each fact's original text and scrubbing only secrets, PII, private links, internal ids, company trade secrets, and parts not relevant to sharing the workflow. Skip [episode] and [note] lines; the host drops those prefixes and does not copy memory/ from disk. Empty memory is correct when nothing is a reusable convention. For every selected skill, pass its folder slug or frontmatter name and scrubbed prose content, plus an optional scrubbed description. Content is required even when no personal details need changing; copy the skill's job text, not the SKILL.md file. The host uses only that prose as the skill body, filters out skill refs without it, with a copied SKILL.md (YAML frontmatter included), or that are live references, and packs name, description, and content (a SKILL.md built from that prose). Mechanical-id fill-ins are for routines, not skills. Never edit the live skill to scrub it; scrub in these arguments only." + (gettingStarted ? CREATE_BOT_SHARE_JSON_GETTING_STARTED_DESCRIPTION : "") + " For every selected routine, pass its automations folder slug, scrubbed prose content, and a required description \u2014 one short scrubbed sentence stating the trigger's intention (why it fires and what firing it accomplishes) \u2014 plus an optional scrubbed name. Content is required even when no personal details need changing; copy the routine's job text, not automation.json. The host uses only that prose as the routine's job text, filters out routine refs without it or with a copied automation.json body, generalizes mechanical ids into fill-in placeholders, and packs name, slug, description, and content (generalized job plus fill-in list in content). Never edit the live routine to scrub it; scrub in these arguments only. For plugins, pass installed marketplace plugin ids only \u2014 ones used in this conversation or a kept routine or skill depends on; do not grep log/ or scan older transcripts; do not invent ids or copy tokens; the host packs name, description, and pluginId from the installed set. Non-marketplace connectors cannot be packed; per the export skill, add a kind:log memory naming the service (no secrets) instead of SearchPlugins/InstallPlugin. Empty arrays leave that kind out. Do not invent a long prose body. For a required visibility choice, send a question widget, not a normal chat message, and wait for the reply before packing or calling this tool. Never paste a draft in chat. The version stays private until the owner publishes it.";
}
function createCreateBotShareJsonTool(deps) {
  return defineCommunicateTool(deps, {
    id: "CREATE_TASK",
    name: SAND_CREATE_BOT_SHARE_JSON_TOOL_NAME,
    description: () => createBotShareJsonDescription(
      deps.peekShareScope?.() ?? deps.share.peekShareScope?.(),
      deps.isGettingStartedEnabled?.() === true
    ),
    parameters: createBotShareJsonParameters,
    execute: async (ctx, recipe, shareDeps) => {
      if (!shareDeps.canPublish) {
        return BOT_TEMPLATE_SHARE_DIRECT_CHAT_REQUIRED_MESSAGE;
      }
      const scope = await (shareDeps.getShareScope?.() ?? shareDeps.share.getShareScope?.());
      if (scope?.kind === "disabled") {
        return BOT_TEMPLATE_SHARING_DISABLED_MESSAGE;
      }
      const requestedVisibility = resolvedToolVisibility({
        scope,
        requested: recipe.visibility
      });
      const sourceAgentId = shareDeps.getSourceAgentId();
      const input = botTemplateShareCreateInputFromRecipe({
        recipe,
        sourceAgentId,
        avatar: shareDeps.getSourceAvatar?.(),
        ...requestedVisibility == null ? {} : { requestedVisibility }
      });
      if ("error" in input) {
        return input.error;
      }
      try {
        const created = await shareDeps.share.create(input, ctx.signal);
        shareDeps.emitShare(botTemplateShareToMessage(created));
        return `Staged unpublished version ${created.version} of "${created.name}". It is not public until you confirm it.`;
      } catch (error41) {
        const refusal = botTemplateShareRefusalToolResult(error41);
        if (refusal != null) {
          return refusal;
        }
        throw error41;
      }
    }
  });
}

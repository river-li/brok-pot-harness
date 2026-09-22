/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/grok-bot-harness/src/runner/tools/sand-agent-management-tools.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_unknown_record();
init_zod();
var SEND_TO_AGENT_TARGET_ID_ALIASES = ["target", "agentId", "agent_id"];
var SEND_TO_AGENT_MESSAGE_ALIASES = ["content"];
var SEND_TO_AGENT_FAN_OUT_KEYS = ["target_ids", "targets"];
var SEND_TO_AGENT_ALIAS_KEYS = /* @__PURE__ */ new Set([
  ...SEND_TO_AGENT_TARGET_ID_ALIASES,
  ...SEND_TO_AGENT_MESSAGE_ALIASES
]);
function normalizeSendToAgentArgs(value, ctx) {
  if (!isUnknownRecord(value)) return value;
  const pick2 = (canonical, aliases) => value[canonical] !== void 0 ? value[canonical] : aliases.map((alias) => value[alias]).find((entry) => entry !== void 0);
  const targetId = pick2("target_id", SEND_TO_AGENT_TARGET_ID_ALIASES);
  const message = pick2("message", SEND_TO_AGENT_MESSAGE_ALIASES);
  if (targetId === void 0) {
    const fanOutKey = SEND_TO_AGENT_FAN_OUT_KEYS.find((key) => value[key] !== void 0);
    if (fanOutKey !== void 0) {
      ctx.addIssue({
        code: external_exports.ZodIssueCode.custom,
        path: [fanOutKey],
        message: `${SAND_SEND_TO_AGENT_TOOL_NAME} delivers to ONE recipient per call. Pass a single id as "target_id" (with "message") and call it once per recipient. Fan out to several agents only when the user explicitly asked you to contact them.`
      });
    }
  }
  return {
    ...Object.fromEntries(
      Object.entries(value).filter(([key]) => !SEND_TO_AGENT_ALIAS_KEYS.has(key))
    ),
    ...targetId === void 0 ? {} : { target_id: targetId },
    ...message === void 0 ? {} : { message },
    ...value.priority === void 0 ? {} : { priority: preprocessLenientBoolean(value.priority) }
  };
}
var SEND_TO_AGENT_PRIORITY_REQUIRED_DESCRIPTION = "REQUIRED. Is this message actionable for the recipient? true: they should act on it, or someone is waiting on their reply (a task, a question you or the user needs answered, a handoff, a STOP or change of plan) \u2014 it is delivered now and wakes them. false: informational only (a status update, FYI, acknowledgement, thanks, or a reply nobody is waiting for) \u2014 it is held and read at the start of their next turn, whenever that is, without waking them. Ignored for groups, which always post immediately.";
function refineSendToAgentImages(value, ctx) {
  for (const [index, image2] of (value.images ?? []).entries()) {
    if (!isValidAttachmentUrl(image2.url)) {
      ctx.addIssue({
        code: external_exports.ZodIssueCode.custom,
        path: ["images", index, "url"],
        message: "each images url must include a file:// or https:// scheme"
      });
    }
  }
}
var sendToAgentParameters = external_exports.object({
  target_id: external_exports.string().trim().min(1).describe(
    "The id of the target \u2014 either another agent or a GROUP you belong to. Use an id from your teammates list, ListAgents, or ListGroups \u2014 not a name."
  ),
  message: external_exports.string().trim().min(1).describe(
    "What to say. Write it as if texting a teammate: lead with the point, keep it short."
  ),
  images: external_exports.array(
    external_exports.object({
      url: external_exports.string().trim().min(1).describe("file:// or https:// URL of the image."),
      alt: external_exports.string().trim().optional().describe(
        "Optional short description of this image, shown on hover and as its fullscreen caption."
      )
    })
  ).optional().describe(
    "Optional image(s) to send with the message \u2014 a screenshot, chart, or photo the other agent needs. Delivered with your message: a 1:1 recipient actually sees them (like an image the user sends), and they render with your text in the exchange. Not delivered to groups."
  ),
  priority: external_exports.boolean().optional().describe(
    "When true (1:1 only; ignored for groups), mark the message urgent: it jumps the recipient's queue and interrupts a routine or other background work, but never a user turn or another agent's message already in progress \u2014 it is delivered right after. Use for STOP / supersede / time-critical instructions. Default false: waits its turn, but still runs ahead of routines and other background work."
  )
}).superRefine(refineSendToAgentImages);
var sendToAgentLenientParameters = external_exports.preprocess(normalizeSendToAgentArgs, sendToAgentParameters);
var sendToAgentPriorityRequiredParameters = external_exports.preprocess(
  normalizeSendToAgentArgs,
  sendToAgentParameters._def.schema.extend({
    priority: external_exports.boolean().describe(SEND_TO_AGENT_PRIORITY_REQUIRED_DESCRIPTION)
  }).superRefine(refineSendToAgentImages)
);
var SEND_TO_AGENT_DESCRIPTION_CONTROL_HEAD = "Send a message to ANOTHER of your user's agents, OR post into a GROUP chat you belong to, by its id (not the user \u2014 SendToUser is how you reach the user). This is FIRE-AND-FORGET and asynchronous, like texting: it delivers your message, wakes that agent (or the group's members), and returns immediately with a delivery acknowledgement. Peer messages run ahead of routines and other background work; messages reaching a busy agent queue up and arrive together on its next turn. priority=true on a 1:1 send marks it urgent (STOP / supersede): it jumps the recipient's queue and interrupts a routine or background work, but never a user turn or another agent's message already in progress (ignored for groups). It does NOT return their reply, and you must not wait or poll for one in this turn \u2014 send it and move on. Any reply arrives later as its own message that wakes you on a fresh turn. ";
var SEND_TO_AGENT_DESCRIPTION_PRIORITY_REQUIRED_HEAD = "Send a message to ANOTHER of your user's agents, OR post into a GROUP chat you belong to, by its id (not the user \u2014 SendToUser is how you reach the user). This is FIRE-AND-FORGET and asynchronous, like texting: it delivers your message and returns immediately with a delivery acknowledgement. priority is REQUIRED and decides how a 1:1 message reaches its recipient. priority=true wakes them now \u2014 use it when they should act on the message or someone is waiting on their reply (a task, a question you or the user needs answered, a handoff, a STOP or change of plan). priority=false does NOT wake them \u2014 the message is held and read at the start of their next turn, whenever that is (possibly much later) \u2014 use it for anything informational: a status update, FYI, acknowledgement, thanks, or a reply nobody is waiting for. When in doubt whether someone is waiting, true. Group posts always land immediately. It does NOT return their reply, and you must not wait or poll for one in this turn \u2014 send it and move on. Any reply arrives later as its own message: a priority reply wakes you on a fresh turn, an informational one is handed to you at your next turn. ";
var SEND_TO_AGENT_DESCRIPTION_TAIL = `Get agent ids from your teammates list or ListAgents, and group ids from ListGroups. To include image(s) \u2014 a screenshot, chart, or photo the other agent needs \u2014 pass images: [{"url":"file:///absolute/path/to/shot.png","alt":"..."}] (file:// or https://). A 1:1 recipient actually sees them, like an image the user sends; never paste an image as a markdown ![](...) in the message text. Group posts are text-only today, so send images to an agent directly. Use it deliberately and sparingly \u2014 waking another agent or a whole group is a real side effect, so treat it like messaging on the user's behalf. Message someone or post to a group only when it truly serves the user's goal, not because one was mentioned or complained about, and don't spam a group. Never relay the user's private or unfiltered words (especially a complaint or criticism) verbatim; if relaying is warranted, paraphrase the actionable point diplomatically, not their tone. If you're unsure the user wants this sent, handle it yourself or ask first. Keep the message purposeful, professional, and minimal. One clearly relevant recipient can be normal work; messaging SEVERAL agents about the same effort (or posting it to a group) is a fan-out that wakes every recipient, and their replies land back in the user's chats and rooms \u2014 so fan out only when the user explicitly asked you to contact those agents. Otherwise propose it first with a question widget and wait for a yes, and never fan out "meanwhile" while you're waiting on the user for data or a decision.`;
function describeSendToAgentTool(priorityRequired) {
  return (priorityRequired ? SEND_TO_AGENT_DESCRIPTION_PRIORITY_REQUIRED_HEAD : SEND_TO_AGENT_DESCRIPTION_CONTROL_HEAD) + SEND_TO_AGENT_DESCRIPTION_TAIL;
}
async function resolveSendToAgentImages(ctx, images, resolveImageSource) {
  const resolved = [];
  for (const image2 of images) {
    const url2 = resolveImageSource != null ? await resolveImageSource(ctx, image2.url) : image2.url;
    const alt = image2.alt != null && image2.alt.length > 0 ? image2.alt : void 0;
    resolved.push({ url: url2, ...alt != null ? { alt } : {} });
  }
  return resolved;
}
function selectSendToAgentParameters(deps, priorityRequired) {
  if (priorityRequired) {
    return { parameters: sendToAgentPriorityRequiredParameters, variant: "priority_required" };
  }
  if (deps.acceptArgumentAliases?.() === true) {
    return { parameters: sendToAgentLenientParameters, variant: "lenient" };
  }
  return { parameters: sendToAgentParameters, variant: "default" };
}
function createSendToAgentTool(deps) {
  const priorityRequired = deps.priorityRequired?.() === true;
  const { parameters: parameters2, variant } = selectSendToAgentParameters(deps, priorityRequired);
  return defineCommunicateTool(deps, {
    id: "SEND_TO_TASK",
    name: SAND_SEND_TO_AGENT_TOOL_NAME,
    description: describeSendToAgentTool(priorityRequired),
    parameters: parameters2,
    schemaVariant: variant,
    issueFields: SEND_TO_AGENT_FAN_OUT_KEYS,
    onArgsRejected: deps.onArgsRejected,
    describeActivity: (args) => ({ target: args.target_id }),
    execute: async (ctx, args, d) => {
      const self2 = d.getSelfAgentId();
      if (self2 != null && args.target_id === self2) {
        return "You can't message yourself with SendToAgent. Use SendToUser to talk to the user, or pick a different target id.";
      }
      const images = await resolveSendToAgentImages(ctx, args.images ?? [], d.resolveImageSource);
      return d.sendToAgent(
        args.target_id,
        args.message,
        images.length > 0 ? images : void 0,
        args.priority
      );
    }
  });
}
var createAgentParameters = external_exports.object({
  name: external_exports.string().trim().min(1).describe("A short, human-readable name for the new agent."),
  description: external_exports.string().trim().default("").describe(
    "The new agent's persona / instructions: what it is for and how it should behave. This becomes its profile and shapes its replies. Optional but strongly recommended."
  ),
  section_id: external_exports.string().trim().min(1).optional().describe(
    `Optional sidebar section id from ${SAND_LIST_SECTIONS_TOOL_NAME}. Omit it to leave the new agent unassigned.`
  )
});
function createListSectionsTool(management) {
  return defineCommunicateTool(management, {
    id: "READ",
    name: SAND_LIST_SECTIONS_TOOL_NAME,
    description: "List the user's current sidebar sections, including each section's stable id and display name. Use a returned id with CreateAgent to place a new teammate in that section. If there are no custom sections, CreateAgent should omit section_id.",
    parameters: external_exports.object({}),
    execute: async (_ctx, _args, m2) => {
      const sections = await m2.listSections();
      if (sections.length === 0) {
        return "If there are no custom sections, CreateAgent should omit section_id.";
      }
      return sections.map((section) => `- ${section.name} (id: ${section.id})`).join("\n");
    }
  });
}
function createCreateAgentTool(management) {
  return defineCommunicateTool(management, {
    id: "CREATE_TASK",
    name: SAND_CREATE_AGENT_TOOL_NAME,
    description: `Create a new agent (a new teammate assistant) for your user, with a name, an optional persona/description, and an optional sidebar section id from ${SAND_LIST_SECTIONS_TOOL_NAME}. Returns the new agent's id so you can immediately message it with SendToAgent. Use this to spin up a focused teammate for a job. You have no tool to delete an agent, so only create one when it is genuinely useful; the user can delete an agent themselves from the sidebar (right-click the agent \u2192 "Delete").`,
    parameters: createAgentParameters,
    execute: async (_ctx, args, m2) => {
      const created = await m2.create({
        name: args.name,
        description: args.description,
        ...args.section_id === void 0 ? {} : { sectionId: args.section_id }
      });
      const placement = args.section_id === void 0 ? "" : ` in sidebar section ${args.section_id}`;
      return `Created agent "${created.name}" (id: ${created.id})${placement}.`;
    }
  });
}
var updateAgentParameters = external_exports.object({
  agent_id: external_exports.string().trim().min(1).describe("The id of the agent to update."),
  name: external_exports.string().trim().optional().describe("A new name for the agent. Omit to leave the name unchanged."),
  description: external_exports.string().trim().optional().describe("A new persona/description for the agent. Omit to leave it unchanged.")
});
function createUpdateAgentTool(management) {
  return defineCommunicateTool(management, {
    id: "PLATFORM_ACTION",
    name: SAND_UPDATE_AGENT_TOOL_NAME,
    description: "Edit an existing agent's profile: its name and/or description. Only the fields you provide are changed; the rest are left exactly as they were, and there is no way to clear or delete an agent through this tool. Use it to refine a teammate you (or the user) created.",
    parameters: updateAgentParameters,
    describeActivity: (args) => ({ target: args.agent_id }),
    execute: async (_ctx, args, m2) => {
      const patch = {};
      if (args.name != null && args.name.length > 0) patch.name = args.name;
      if (args.description != null && args.description.length > 0) {
        patch.description = args.description;
      }
      if (patch.name == null && patch.description == null) {
        return "Nothing to update: provide a new name and/or description.";
      }
      const updated = await m2.update(args.agent_id, patch);
      if (updated == null) {
        return `No agent found with id ${args.agent_id}.`;
      }
      return `Updated agent "${updated.name}" (id: ${updated.id}).`;
    }
  });
}
var setPrimaryBotParameters = external_exports.object({
  agent_id: external_exports.string().trim().min(1).describe("The id of the agent to make the user's primary bot, from your teammates list.")
});
function createSetPrimaryBotTool(setPrimaryBot) {
  return defineCommunicateTool(
    { setPrimaryBot },
    {
      id: "PLATFORM_ACTION",
      name: SAND_SET_PRIMARY_BOT_TOOL_NAME,
      description: `Make one of the user's existing agents their primary bot: the bot pinned at the top of their sidebar that they hand tasks to first. Only call it when the user has asked to change their primary bot (for example by answering "Choose another bot"). Before calling: list their existing bots from your teammates list with a one-line reason each would or would not suit the role, ask which one they want, and wait for their answer. Then call this with that agent's id and confirm the change in one sentence. Passing your own id keeps you as the primary bot. The user can also change this themselves from the sidebar.`,
      parameters: setPrimaryBotParameters,
      describeActivity: (args) => ({ target: args.agent_id }),
      execute: async (_ctx, args, d) => {
        const chosen = await d.setPrimaryBot(args.agent_id);
        return `"${chosen.name}" (id: ${chosen.id}) is now the user's primary bot.`;
      }
    }
  );
}


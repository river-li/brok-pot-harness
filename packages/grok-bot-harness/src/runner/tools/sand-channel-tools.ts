init_zod();
var createChannelParameters = external_exports.object({
  name: external_exports.string().trim().min(1).describe('A short, human-readable name for the channel (e.g. "Launch team").'),
  member_ids: external_exports.array(external_exports.string().trim().min(1)).min(1).describe(
    `The agent ids to seat in the channel, up to ${GROUP_MAX_MEMBERS2}. Use ids from your teammates list, not names, and never a channel id (channels cannot nest).`
  )
});
function createCreateChannelTool(management) {
  return defineCommunicateTool(management, {
    id: "CREATE_TASK",
    name: SAND_CREATE_CHANNEL_TOOL_NAME,
    description: `Create a channel, a named group chat of one or more of your user's agents, and get its id back. Post into it afterwards with ${SAND_SEND_TO_AGENT_TOOL_NAME} using that id; every member sees the post and can reply into the channel. You have no tool to delete a channel, so only create one the user actually needs; the user can delete it from the sidebar. Creating a channel is a real side effect the user sees in their sidebar. Do it when the user asked for a room or a task genuinely needs a standing group, never speculatively. Include your own id in member_ids if you should take part: membership is what lets you post into a channel and change it with ${SAND_UPDATE_CHANNEL_TOOL_NAME} later.`,
    parameters: createChannelParameters,
    describeActivity: (args) => ({ detail: args.name }),
    execute: async (_ctx, args, m2) => {
      const { channel, members } = await m2.create({ name: args.name, memberIds: args.member_ids });
      const memberNames = members.map((member) => member.name).join(", ");
      return `Channel "${channel.name}" is ready (id: ${channel.id}). Members: ${memberNames}. Post into it with ${SAND_SEND_TO_AGENT_TOOL_NAME} using that id.`;
    }
  });
}
var updateChannelParameters = external_exports.object({
  channel_id: external_exports.string().trim().min(1).describe("The id of the channel to change."),
  add_member_ids: external_exports.array(external_exports.string().trim().min(1)).optional().describe("Agent ids to add to the channel. Ids that are not existing agents are ignored."),
  remove_member_ids: external_exports.array(external_exports.string().trim().min(1)).optional().describe("Agent ids to remove from the channel.")
});
function createUpdateChannelTool(management) {
  return defineCommunicateTool(management, {
    id: "PLATFORM_ACTION",
    name: SAND_UPDATE_CHANNEL_TOOL_NAME,
    description: `Add and/or remove member agents of an existing channel (a group chat) by its id. Only the ids you pass change; the rest of the roster stays exactly as it was, and a channel holds at most ${GROUP_MAX_MEMBERS2} members. A channel always keeps at least one member. A removal that would empty it is refused. Members you add see the channel in their next channel turn; removed members simply stop receiving its posts. You can only change channels you are currently a member of; any other channel is reported as not found.`,
    parameters: updateChannelParameters,
    describeActivity: (args) => ({ target: args.channel_id }),
    execute: async (_ctx, args, m2) => {
      const current = m2.members(args.channel_id);
      if (current == null) {
        return `No channel found with id ${args.channel_id}.`;
      }
      const additions = args.add_member_ids ?? [];
      const removals = new Set(args.remove_member_ids ?? []);
      if (additions.length === 0 && removals.size === 0) {
        return "Nothing to change: provide add_member_ids and/or remove_member_ids.";
      }
      const next = [];
      for (const id of [...current.map((member) => member.id), ...additions]) {
        if (removals.has(id) || next.includes(id)) continue;
        next.push(id);
      }
      if (next.length === 0) {
        return "A channel needs at least one member, so this removal was not applied.";
      }
      const updated = await m2.setMembers(args.channel_id, next);
      if (updated == null) {
        return `No channel found with id ${args.channel_id}.`;
      }
      const members = m2.members(updated.id) ?? [];
      const memberNames = members.map((member) => member.name).join(", ");
      return `Updated channel "${updated.name}" (id: ${updated.id}). Members: ${memberNames}.`;
    }
  });
}

var SAND_UPDATE_APP_HOME_TOOL_NAME = "update_app_home";
var updateAppHomeParameters = external_exports.object({
  action: external_exports.enum(["set", "clear"]).describe("set replaces the whole board with the fields below; clear empties it."),
  headline: external_exports.string().trim().max(SAND_APP_HOME_LIMITS.headlineChars).optional().describe("set only. One line under your name, e.g. what you are focused on this week."),
  sections: external_exports.array(sandAppHomeSectionSchema).max(SAND_APP_HOME_LIMITS.sections).optional().describe(
    `set only. Up to ${SAND_APP_HOME_LIMITS.sections} titled sections, each with up to ${SAND_APP_HOME_LIMITS.itemsPerSection} items or a short body. A project board is "In progress", "Blocked", "Done" with one item per piece of work and its link.`
  ),
  footer: external_exports.string().trim().max(SAND_APP_HOME_LIMITS.footerChars).optional().describe("set only. One quiet closing line, e.g. how to hand you work.")
});
function sandAppHomeDocumentFromArgs(args) {
  const parsed2 = parseSandAppHomeDocument({
    ...args.headline === void 0 || args.headline.length === 0 ? {} : { headline: args.headline },
    sections: args.sections ?? [],
    ...args.footer === void 0 || args.footer.length === 0 ? {} : { footer: args.footer }
  });
  if (!parsed2.ok) {
    throw new SandToolInputError(`the board was not published: ${parsed2.reason}.`);
  }
  return parsed2.document;
}
function describeBoard(args) {
  if (args.action === "clear") return "clear";
  if (args.headline !== void 0 && args.headline.length > 0) return args.headline;
  const sections = args.sections ?? [];
  return sections.map((section) => section.title).join(", ") || "board";
}
function createUpdateAppHomeTool(appHome) {
  return defineCommunicateTool(appHome, {
    id: "PLATFORM_ACTION",
    name: SAND_UPDATE_APP_HOME_TOOL_NAME,
    description: "Publish or clear the board on your Slack app's Home tab: the page your creator sees when they open your app in Slack's sidebar. You have this tool only when your installed Slack app has a Home tab. It goes to your creator only, and you have it only in your creator's own conversation with you (main), so put nothing on it that came from a Slack channel, group DM or thread, or from someone else's private DM with you. set replaces the whole board (there is no partial edit); clear empties it. Use it like a project board: what you are working on, what is blocked and on whom, what you finished recently, each item with its pull request or document link. Republish when a piece of work starts, blocks, ships, or is dropped, not on every step. Keep it scannable: a few sections, one line per item, no logs or transcripts.",
    parameters: updateAppHomeParameters,
    describeActivity: (args) => ({ detail: describeBoard(args) }),
    execute: async (_ctx, args, home) => {
      const outcome = args.action === "clear" ? await home.clear() : await home.publish(sandAppHomeDocumentFromArgs(args));
      return outcome.ok ? outcome.detail : `Not published \u2014 ${outcome.reason}`;
    }
  });
}

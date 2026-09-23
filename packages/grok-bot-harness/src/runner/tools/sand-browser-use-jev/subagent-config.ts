init_subagents_pb();
var BROWSER_USE_JEV_SUBAGENT_TYPE = "browserUseJev";
function isBrowserUseJevSubagentType(subagentType) {
  return isBuiltinSubagent(subagentType, BROWSER_USE_JEV_SUBAGENT_TYPE);
}
function createSandBrowserUseJevSubagentConfig() {
  return {
    subagent_type: new SubagentType({
      type: {
        case: "custom",
        value: new SubagentTypeCustom({ name: BROWSER_USE_JEV_SUBAGENT_TYPE })
      }
    }),
    description: [
      "Your browser. Delegate any task that needs the web (looking something up, reading a page, checking a site, filling a form) to this subagent, which drives its own window in your computer's browser and reports back.",
      "Dispatch it as soon as a request needs live web information; do not answer such requests from memory or narrate that you will browse without dispatching it. Run one at a time: wait for its report before dispatching another, and give several independent lookups to one dispatch as a list.",
      "It figures out where to go on its own, so a starting URL is optional. Give it a tightly-scoped task, the exact values it needs, and exactly what to report back; it cannot ask follow-ups.",
      "It reads structured page snapshots and a classifier picks each click, fill, scroll or hover; a text model only writes what to type and the final report.",
      "When it finishes, its report is your answer: relay it to the user with SendToUser. It cannot act as the user and never types passwords, one-time codes or payment details, even ones in its task: at a login, 2FA, captcha or payment step it stops and reports the current URL so you can hand the user the box with request_box_help and dispatch it again."
    ].join(" "),
    preserveTaskTool: false,
    subagentSource: "builtin"
  };
}

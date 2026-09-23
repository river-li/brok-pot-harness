init_subagents_pb();
var BROWSER_USE_SUBAGENT_TYPE2 = "browserUse";
function isBrowserUseSubagentType(subagentType) {
  return isBuiltinSubagent(subagentType, BROWSER_USE_SUBAGENT_TYPE2);
}
function createSandBrowserUseSubagentConfig(options2) {
  return {
    subagent_type: new SubagentType({
      type: {
        case: "custom",
        value: new SubagentTypeCustom({ name: BROWSER_USE_SUBAGENT_TYPE2 })
      }
    }),
    description: [
      "Delegate a self-contained web task to a background subagent that drives your box's browser at the page level without touching the desktop's mouse or keyboard. It navigates, reads structured page snapshots, clicks elements by reference, fills forms, and takes screenshots.",
      "Prefer it over computerUse for browser-only work: page snapshots give it exact element targets, so it is faster and more reliable than pixel clicking, and it shares the box browser's persistent logins.",
      "Use computerUse instead when the task needs the desktop itself (GUI apps, file dialogs, drag interactions) or a site that defeats DOM automation.",
      "It runs in the background like any Task: you are notified when it finishes, so do not poll or await it.",
      "It runs headless and cannot ask follow-ups, so give it a tightly-scoped, self-contained task with the specifics it needs (site, exact values), explicit success criteria, and what to report back.",
      options2?.credentialFillEnabled === true ? "It cannot act as the user. At a direct username/password login it stops and reports the exact current URL so you can call ListCredentials before request_box_help. For SSO, passkey, a puzzle or image captcha, or payment, hand the user the box and dispatch it again to continue. It also stops at a 2FA code page unless your task says 1Password fills the one-time code for this login; say so when ListCredentials showed one, and it then waits for the code to be filled for it. A press-and-hold I'm-human button is a mouse hold, not a human step: it holds it with browser_click holdDurationMs until the widget completes." : "It cannot act as the user. At any login it stops so you can hand the user the box with request_box_help, then dispatch it again to continue. A press-and-hold I'm-human button is a mouse hold, not a human step: it holds it with browser_click holdDurationMs until the widget completes."
    ].join(" "),
    preserveTaskTool: false,
    subagentSource: "builtin"
  };
}

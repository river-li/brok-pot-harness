init_subagents_pb();
var COMPUTER_USE_SUBAGENT_TYPE = "computerUse";
function isComputerUseSubagentType(subagentType) {
  return isBuiltinSubagent(subagentType, COMPUTER_USE_SUBAGENT_TYPE);
}
function computerUseSubagentDescription(options2) {
  const combined = options2.combined === true;
  return [
    ...combined ? [
      "Delegate a self-contained browser or desktop task to a background subagent that operates your box's browser and desktop \u2014 websites, GUI apps, file dialogs, and drag interactions. It shares the box browser's persistent logins."
    ] : [
      "Delegate a self-contained browser or desktop task to a background subagent that drives your box's desktop \u2014 websites, GUI apps, file dialogs, and drag interactions \u2014 by screenshot, click, drag, type, key, scroll, and wait."
    ],
    displaySpaceSentence(),
    "It runs in the background like any Task: you are notified when it finishes, so do not poll or await it.",
    `It runs headless and cannot ask follow-ups, so give it a tightly-scoped, self-contained task \u2014 the smallest concrete step rather than a sprawling goal \u2014 with the specifics it needs (site, account, exact values), explicit success criteria and stopping point, and what to report back; break a big ${combined ? "" : "GUI "}goal into several narrow dispatches, and if one runs long or loops, steer it with MessageSubagent or stop it with StopSubagent.`,
    "Only one computerUse subagent can run at a time, because they share your desktop's single screen \u2014 never dispatch a second while one is still running.",
    options2.credentialFillEnabled === true ? `${combined ? "" : "It cannot act as the user. "}At a direct username/password login it stops and reports the exact current URL so you can call ListCredentials before request_box_help. For SSO, passkey, a puzzle or image captcha, or payment, hand the user the box and then dispatch it again to continue. It also stops at a 2FA code page unless your task says 1Password fills the one-time code for this login; say so when ListCredentials showed one, and it then waits for the code to be filled for it. A press-and-hold I'm-human button is a mouse hold, not a human step: it holds it with Computer click holdDurationMs until the widget completes.` : `${combined ? "" : "It cannot act as the user. "}At any login it stops so you can hand the user the box with request_box_help, then dispatch it again to continue. A press-and-hold I'm-human button is a mouse hold, not a human step: it holds it with Computer click holdDurationMs until the widget completes.`
  ].join(" ");
}
function createSandComputerUseSubagentConfig(options2 = {}) {
  return {
    subagent_type: new SubagentType({
      type: {
        case: "custom",
        value: new SubagentTypeCustom({ name: COMPUTER_USE_SUBAGENT_TYPE })
      }
    }),
    description: computerUseSubagentDescription(options2),
    preserveTaskTool: false,
    subagentSource: "builtin"
  };
}

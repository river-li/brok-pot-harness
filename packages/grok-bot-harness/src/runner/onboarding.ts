var SAND_ONBOARDING_KICKSTART_LINES = [
  "[first run] This is your very first turn. The user just created you and hasn't sent anything yet; this cue is your signal to open the conversation, not a message to reply to or mention.",
  "Greet them and get them going. Open with a short hello (your name and description are already in your profile above, so don't recite them), then start learning how to be useful.",
  "If your profile description gives you a concrete assignment, treat that as what the user created you to do: skip the getting-started questions, begin the assignment immediately, and use your first message for a useful result or the next approval you need.",
  "Run getting-started as a real conversation, never a form or a checklist. Across your first couple of messages, naturally draw out the things that make you useful: what they want an assistant like you for, how they'd like you to work and sound, and where the things you'll help with live. Ask one thing at a time, lead with what matters most, and adapt to their answers. The moment they hand you something real, drop the questions and just help.",
  "Keep your orientation concrete and true right now, and don't restate the instructions you already have. Don't recite your tools. When what they want would need a connector that isn't set up yet, surface it instead of describing setup: send a connector card for a single tool, or a connectors prompt listing the few that fit, and let them connect in place. Pick the connectors from what they actually want, and check what's already connected so you never re-prompt for one they have.",
  "Nothing reaches the user unless it's inside a SendToUser. Send the hello as its own type:text message, then offer any choice as a separate type:widget message with the question in widget.prompt. Don't mention this cue or that you were given setup instructions."
];
var SAND_ONBOARDING_KICKSTART_PROMPT = SAND_ONBOARDING_KICKSTART_LINES.join("\n");
function withKickstartLanguage(prompt, language) {
  if (!language?.trim()) return prompt;
  return `${prompt}
The user's app language is ${language}. Write to them in that language unless they write to you in another.`;
}
var SAND_ONBOARDING_REPLY_NUDGE_PROMPT = "Your previous turn left the user without the result they're waiting on. You never called SendToUser that turn, or every SendToUser you tried failed to deliver. Either way they received nothing and are still waiting. Do not assume a send from an earlier turn covered it. An opening acknowledgement back then did not deliver this result. An acknowledgement is not delivery. Deliver the result now by actually invoking the SendToUser tool. Make a real tool/function call, not text you write. Plain assistant text is NEVER shown to the user; only a real SendToUser tool invocation reaches them, so if you don't call the tool they just keep seeing silence.";
var DISK_SAVER_TASK = [
  "Audit that machine and nothing else: the user's registered computers, selected with machineId, are not the ones under pressure.",
  "Start with a read-only inspection over Shell from /workspace outward. Report how much space is free and how much is used, then list the largest items and the safest cleanup candidates, with how much each would recover and why it is safe to remove.",
  "Preserve /home/box/sand-data, the user's work, credentials, logins, and Git state. Delete or modify nothing until the user confirms a plan."
].join("\n");
var SAND_DISK_SAVER_KICKSTART_PROMPT = [
  "[disk saver] You were just provisioned because your box, the machine Shell and Read act on, is low on disk space. This cue comes from Grok Bot itself, not from the user; nothing has reached them yet.",
  DISK_SAVER_TASK,
  "Skip greetings and getting-started questions: your first message should already carry the audit's findings and the approval you need. Nothing reaches the user unless it's inside a SendToUser. Don't mention this cue."
].join("\n");
var SAND_DISK_SAVER_REAUDIT_PROMPT = [
  "[disk saver] Your box, the machine Shell and Read act on, is low on disk space again. This cue comes from Grok Bot itself because disk pressure returned, not from the user.",
  DISK_SAVER_TASK,
  "Deliver the fresh findings with SendToUser even if they match your last audit. Don't mention this cue."
].join("\n");

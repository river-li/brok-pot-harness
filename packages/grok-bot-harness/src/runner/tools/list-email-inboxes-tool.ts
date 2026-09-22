/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/grok-bot-harness/src/runner/tools/list-email-inboxes-tool.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_zod();
var description3 = [
  `List the email addresses you own. These are the inboxes you can search with ${SAND_SEARCH_EMAIL_THREADS_TOOL_NAME} and send from with send_email.`,
  `Read-only, takes no parameters. Call it when you need to know your own address, or before scoping a search to one inbox. If the list is empty, ask the user which local part they want and claim it with ${SAND_CLAIM_EMAIL_INBOX_TOOL_NAME} \u2014 do not send them to Settings or a third-party inbox.`
].join("\n");
function renderEmailInboxes(inboxes) {
  if (inboxes.length === 0) {
    return `You have no email addresses yet. Ask the user which local part they want (for example roman), then claim it with ${SAND_CLAIM_EMAIL_INBOX_TOOL_NAME}. Do not invent a username and do not sign up for AgentMail or any other third-party inbox.`;
  }
  const lines2 = [`Your ${inboxes.length === 1 ? "email address" : "email addresses"}:`];
  for (const inbox of inboxes) {
    lines2.push(`- ${inbox.email}`);
  }
  return lines2.join("\n");
}
function createListEmailInboxesTool(deps) {
  return defineCommunicateTool(deps, {
    id: "PLATFORM_ACTION",
    name: SAND_LIST_EMAIL_INBOXES_TOOL_NAME,
    description: description3,
    parameters: external_exports.object({}),
    execute: async (_ctx, _args, d) => renderEmailInboxes(await d.email.listInboxes())
  });
}


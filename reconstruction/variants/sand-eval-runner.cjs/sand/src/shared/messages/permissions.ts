/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/shared/messages/permissions.ts
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var MESSAGES_OP_GRANTS = {
  "check-permissions": [],
  "find-chats": ["fullDiskAccess"],
  items: ["fullDiskAccess"],
  search: ["fullDiskAccess"],
  activity: ["fullDiskAccess"],
  "fetch-attachment": ["fullDiskAccess"],
  "find-contacts": ["contacts"],
  send: ["automation"]
};
function hasMessagesGrant(permissions, grant) {
  switch (grant) {
    case "fullDiskAccess":
      return permissions.fullDiskAccess;
    case "automation":
      return permissions.automation === "granted";
    case "contacts":
      return permissions.contacts === "granted";
  }
}
function missingMessagesGrants(permissions, grants) {
  return grants.filter((grant) => !hasMessagesGrant(permissions, grant));
}
var MESSAGES_GRANT_NAMES = {
  fullDiskAccess: "Full Disk Access",
  automation: "Automation for Messages",
  contacts: "Contacts"
};
function listMessagesGrantNames(grants) {
  const names3 = grants.map((grant) => MESSAGES_GRANT_NAMES[grant]);
  const last = names3.pop();
  if (last === void 0) return "";
  return names3.length === 0 ? last : `${names3.join(", ")} and ${last}`;
}
function messagesGrantsMissingMessage(grants) {
  const pronoun = grants.length === 1 ? "it" : "them";
  return `The user's Mac has not granted Grok Bot ${listMessagesGrantNames(grants)}, so this cannot run. Ask the user to grant ${pronoun} to Grok Bot in System Settings under Privacy & Security, then try again.`;
}


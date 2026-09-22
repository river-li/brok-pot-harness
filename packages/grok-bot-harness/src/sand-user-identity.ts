/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/grok-bot-harness/src/sand-user-identity.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var MAX_FULL_NAME_LENGTH = 200;
function normalizeSandUserFullName(raw) {
  if (raw == null) return void 0;
  const clamped = clampLine(raw, MAX_FULL_NAME_LENGTH);
  return clamped.length > 0 ? clamped : void 0;
}
function renderUserIdentitySystemPrompt(fullName) {
  const name17 = normalizeSandUserFullName(fullName);
  if (name17 == null) return "";
  return `Your user is ${name17}; when acting through their accounts and apps, such as Slack, speak as them and never refer to them in the third person.`;
}


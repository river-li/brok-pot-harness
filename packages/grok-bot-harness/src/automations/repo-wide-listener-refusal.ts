/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/grok-bot-harness/src/automations/repo-wide-listener-refusal.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var REPO_WIDE_FIREHOSE_EVENT_KINDS = [
  "pr-pushed",
  "pr-comment",
  "inline-review-comment",
  "review-commented"
];
var FIREHOSE_EVENT_KIND_SET = new Set(
  REPO_WIDE_FIREHOSE_EVENT_KINDS
);
function isFirehoseKind(kind) {
  return FIREHOSE_EVENT_KIND_SET.has(kind);
}
function isBoundedListener(listener) {
  if (listener.pr !== void 0) return true;
  return (listener.userAllowlist ?? []).some((login) => login.trim().length > 0);
}
function findUnboundedRepoListener(trigger2) {
  for (const listener of triggerListeners(trigger2)) {
    if (listener.type !== "github" && listener.type !== "origin") continue;
    if (isBoundedListener(listener)) continue;
    const events = listener.events;
    const firehoseKinds = events.filter(isFirehoseKind);
    if (firehoseKinds.length === 0) continue;
    return { listener, firehoseKinds };
  }
  return void 0;
}
function renderUnboundedRepoListenerRefusal({
  listener,
  firehoseKinds
}) {
  return `the ${listener.type} listener on "${listener.repo}" was not saved: ${firehoseKinds.join(", ")} are not scoped on the repo. Narrow it with a 'pr' or 'userAllowlist' filter and try again.`;
}


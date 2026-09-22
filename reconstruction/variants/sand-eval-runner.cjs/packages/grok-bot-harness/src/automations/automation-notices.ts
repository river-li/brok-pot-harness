/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/grok-bot-harness/src/automations/automation-notices.ts
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var GITHUB_LISTENER_SCOPE = "github-listener-scope";
var SAND_FIVE_MINUTE_AUTOMATION_FLOOR_NOTICE_ID = "sand-five-minute-automation-floor";
var GITHUB_LISTENER_SCOPE_CREATED_BEFORE_MS = Date.UTC(2026, 6, 30);
var githubListenerScopeNotice = {
  id: GITHUB_LISTENER_SCOPE,
  applies: (automation) => automation.createdAt < GITHUB_LISTENER_SCOPE_CREATED_BEFORE_MS && triggerListeners(automation.trigger).some(
    (listener) => listener.type === "github" && (listener.userAllowlist === void 0 || listener.userAllowlist.length === 0)
  ),
  lines: [
    `NOTICE ${GITHUB_LISTENER_SCOPE} (raised once for this routine, and only here \u2014 act on it now or not at all): this routine's github listener filters nobody, so it fires for everyone in the repo, the shape of a listener written before userAllowlist existed. A listener can be too broad in the other direction too, with an events[] list naming kinds the saved prompt never cared about. The question to settle is whether this wake (and others like it) are WASTED: the event was never what this routine is for. Do not confuse that with a routine that is quiet BY DESIGN \u2014 a saved prompt along the lines of "only tell me if X" is meant to produce silence most of the time, and that silence is it working, not a listener to fix. The wasted fire is the one where the EVENT was out of scope, not the one where the news simply turned out to be uninteresting.`,
    `If this fire is wasted, fix the listener now, in this turn. Judge by the routine's saved prompt and this wake's <github_event>. Match the fix to the mismatch: when the routine is about the user's OWN work ("my PRs", "reviews on my code") and the pr_owner/actor is somebody else, set userAllowlist to their real login (confirm it, e.g. with \`gh api user\`; never guess it from their display name); when the event KIND was never in scope, drop that kind from events[]. Both go through update_state action "update". An allowlist does nothing at all on ci-passed/ci-failed (CI is never user-gated), so never reach for one there \u2014 drop the kind instead if it was the wasted one. Then tell the user \u2014 do so even when this wake would otherwise have stayed quiet, since a fix nobody hears about looks like a routine that silently stopped working: name the routine, what you changed, and that you can put it back whenever they want. Put it back with the same tool the moment they ask, without argument \u2014 a too-broad listener is only noise, but a too-narrow one goes quiet and they would never find out on their own. Leave it alone when the mismatch is not genuinely clear: if the saved prompt could just as easily have meant "anyone" (repo-wide triage, or watching a repo the user does not contribute to), or you cannot confirm their login, or this event is clearly in scope (e.g. their own PR) \u2014 change nothing and say nothing.`
  ]
};
var fiveMinuteAutomationFloorNotice = {
  id: SAND_FIVE_MINUTE_AUTOMATION_FLOOR_NOTICE_ID,
  applies: (automation) => automation.pendingNotices?.includes(SAND_FIVE_MINUTE_AUTOMATION_FLOOR_NOTICE_ID) === true,
  lines: [
    `NOTICE ${SAND_FIVE_MINUTE_AUTOMATION_FLOOR_NOTICE_ID} (raised once for this routine, and only here \u2014 tell the user now): the minimum routine interval is now 5 minutes. This routine's old cadence was below that floor, so the app changed it to run every 5 minutes. Send the user a plain message naming this routine and explaining those three facts. Do not change the schedule back below 5 minutes.`
  ]
};


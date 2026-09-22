/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/shared/automations/listener-integrations.ts
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var LISTENER_INTEGRATIONS = [
  {
    platform: "github",
    displayName: "GitHub",
    blurb: "Let automations watch a repo's PRs, comments, issues, and CI."
  },
  {
    platform: "origin",
    displayName: "Origin",
    blurb: "Let automations watch a native Origin repo's PRs, reviews, comments, and CI."
  },
  {
    platform: "slack",
    displayName: "Slack",
    blurb: "Wake automations on Slack messages, mentions, and reactions."
  }
];
function listenerIntegrationManifest(platform) {
  return LISTENER_INTEGRATIONS.find((entry) => entry.platform === platform);
}


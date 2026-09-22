/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/shared/automations/listener-integrations.ts
 * Bundle: sand-host/host-main.cjs
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
function listenerIntegrationManifest(platform2) {
  return LISTENER_INTEGRATIONS.find((entry) => entry.platform === platform2);
}
var SCM_CONNECT_CARD_INTEGRATIONS = [
  {
    platform: "gitlab",
    displayName: "GitLab",
    blurb: "Let cloud agents work on your GitLab repositories."
  },
  {
    platform: "bitbucket",
    displayName: "Bitbucket",
    blurb: "Let cloud agents work on your Bitbucket repositories."
  },
  {
    platform: "azure-devops",
    displayName: "Azure DevOps",
    blurb: "Let cloud agents work on your Azure DevOps repositories."
  }
];
function connectCardManifest(platform2) {
  return listenerIntegrationManifest(platform2) ?? SCM_CONNECT_CARD_INTEGRATIONS.find((entry) => entry.platform === platform2);
}
var SCM_PROVIDER_GHE_APPLICATION_UUID = {
  gitlab: "ad3ea84c-ede1-42fe-889a-16a8c94ccfdf",
  bitbucket: "b17b0c4e-c10d-42fe-889a-16a8c94bb01d",
  "azure-devops": "ad0fa84c-ade1-42fe-889a-16a8c94cad05"
};
var SCM_CONNECT_PROVIDERS = ["github", "gitlab", "bitbucket", "azure-devops"];
function isScmConnectProvider(platform2) {
  return SCM_CONNECT_PROVIDERS.some((provider) => provider === platform2);
}


/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/shared/channels/channels.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var CONNECTOR_MANIFESTS = [{
  platform: DISCORD_PLATFORM,
  displayName: "Discord",
  blurb: (
    /*i18n*/
    {
      id: "PMfhSP",
      message: "Message in Discord servers and DMs (coming soon)."
    }
  ),
  credentialLabel: (
    /*i18n*/
    {
      id: "qWvCPP",
      message: "bot token"
    }
  ),
  availability: "coming-soon",
  connectGuide: ""
}, {
  platform: SLACK_PLATFORM,
  displayName: "Slack",
  blurb: (
    /*i18n*/
    {
      id: "wGCaT2",
      message: "Message in Slack channels and DMs (coming soon)."
    }
  ),
  credentialLabel: (
    /*i18n*/
    {
      id: "hN+ReX",
      message: "app token"
    }
  ),
  availability: "coming-soon",
  connectGuide: ""
}];
function findConnectorManifest(platform2) {
  return CONNECTOR_MANIFESTS.find((manifest) => manifest.platform === platform2);
}
function hasChannelsToShow(manifests, connections) {
  const hasConnectable = manifests.some((manifest) => manifest.availability === "available");
  return hasConnectable || connections.length > 0;
}


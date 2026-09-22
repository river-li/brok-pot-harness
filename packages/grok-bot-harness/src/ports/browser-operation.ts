/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/grok-bot-harness/src/ports/browser-operation.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var SAND_BROWSER_CDP_METHOD_BUCKETS = [
  "Accessibility.getFullAXTree",
  "Accessibility.queryAXTree",
  "DOM.describeNode",
  "DOM.focus",
  "DOM.getBoxModel",
  "DOM.getDocument",
  "DOM.getOuterHTML",
  "DOM.querySelector",
  "DOM.querySelectorAll",
  "DOM.scrollIntoViewIfNeeded",
  "Emulation.setDeviceMetricsOverride",
  "Emulation.setUserAgentOverride",
  "Network.emulateNetworkConditions",
  "Network.enable",
  "Network.setExtraHTTPHeaders",
  "Page.captureScreenshot",
  "Page.getFrameTree",
  "Page.getNavigationHistory",
  "Page.handleJavaScriptDialog",
  "Page.navigate",
  "Page.printToPDF",
  "Page.reload",
  "Performance.getMetrics",
  "Runtime.callFunctionOn",
  "Runtime.evaluate",
  "Runtime.getProperties"
];
var listedCdpMethods = new Set(SAND_BROWSER_CDP_METHOD_BUCKETS);
function isListedSandBrowserCdpMethod(method) {
  return listedCdpMethods.has(method);
}
function toSandBrowserCdpMethodBucket(method) {
  return isListedSandBrowserCdpMethod(method) ? method : "other";
}


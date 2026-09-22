/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/utils/dist/escape-html.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
function escapeHtml(value) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}
var init_escape_html = __esm({
  "../packages/utils/dist/escape-html.js"() {
    "use strict";
  }
});


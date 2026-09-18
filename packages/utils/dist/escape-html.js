function escapeHtml(value) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}
var init_escape_html = __esm({
  "../packages/utils/dist/escape-html.js"() {
    "use strict";
  }
});

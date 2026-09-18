var SAND_AUTO_REVIEW_SECRET_VALUE_PATTERN = /^(?:bearer\s+|sk[-_]|gh[pousr]_|xox[baprs]-|AIza)[^\s]*$/i;
var SAND_AUTO_REVIEW_SECRET_KEY_PATTERN = /(?:auth|credential|key|password|secret|signature|token)/i;
function redactSandAutoReviewInlineSecrets(value) {
  return value.replace(/https?:\/\/[^\s"'`]+/gi, (rawUrl) => {
    try {
      const href = new URL(rawUrl).href.replace(/^(https?:\/\/)[^/?#]*@/i, "$1");
      const withoutHash = href.split("#")[0] ?? href;
      return withoutHash.split("?")[0] ?? withoutHash;
    } catch {
      return rawUrl;
    }
  }).replace(
    /((?:--)?(?:api[_-]?key|authorization|credential|password|secret|signature|token)\s*(?:=|:|\s)\s*)(?:"[^"]*"|'[^']*'|[^\s]+)/gi,
    "$1\u2026"
  ).replace(/\bBearer\s+[^\s"'`]+/gi, "Bearer \u2026").replace(/\b(?:sk[-_]|gh[pousr]_|xox[baprs]-|AIza)[A-Za-z0-9+/_=-]+/gi, "\u2026");
}

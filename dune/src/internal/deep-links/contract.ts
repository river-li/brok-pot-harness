/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../dune/src/internal/deep-links/contract.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
function hasDeepLinkControlCharacters(value) {
  for (let index = 0; index < value.length; index++) {
    const code = value.charCodeAt(index);
    if (code <= 31 || code >= 127 && code <= 159) return true;
  }
  return false;
}
var DeepLinkDeclarationError = class extends Error {
  constructor(message) {
    super(message);
    this.name = "DeepLinkDeclarationError";
  }
};
var DeepLinkBuildError = class extends Error {
  constructor(message) {
    super(message);
    this.name = "DeepLinkBuildError";
  }
};


/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/shared/search/search.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var SAND_SEARCH_UNAVAILABLE_MESSAGE = "sand-search-index-unavailable";
var SandSearchUnavailableError = class extends Error {
  constructor() {
    super(SAND_SEARCH_UNAVAILABLE_MESSAGE);
    this.name = "SandSearchUnavailableError";
  }
};


var SAND_SEARCH_UNAVAILABLE_MESSAGE = "sand-search-index-unavailable";
var SandSearchUnavailableError = class extends Error {
  constructor() {
    super(SAND_SEARCH_UNAVAILABLE_MESSAGE);
    this.name = "SandSearchUnavailableError";
  }
};

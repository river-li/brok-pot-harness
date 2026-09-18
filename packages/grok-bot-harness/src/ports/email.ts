var SAND_EMAIL_SEARCH_MODES = ["hybrid", "keyword", "semantic"];
function isInlineEmailAttachment(summary) {
  return summary.disposition === "inline" && summary.contentId !== null;
}
var SandEmailError = class extends Error {
  constructor(message) {
    super(message);
    this.name = "SandEmailError";
  }
};

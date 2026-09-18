var GROK_BOT_CUSTOM_URL_MARK = { shape: "blob", color: "black" };
function grokBotHasCustomPicture(input) {
  return (input.avatarDataUrl ?? "").length > 0 || (input.avatarVersion ?? "").length > 0;
}

function agentWakeOf(source) {
  switch (source) {
    case void 0:
    case "turn":
    case "web-search":
    case "web-fetch":
    case "generate-image":
    case "idle-compaction":
      return void 0;
    default:
      return source;
  }
}
function isValidAttachmentUrl(rawUrl) {
  try {
    const url2 = new URL(rawUrl);
    return url2.protocol === "file:" || url2.protocol === "https:";
  } catch {
    return false;
  }
}

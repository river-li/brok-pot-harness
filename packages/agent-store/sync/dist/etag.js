function stripS3EtagQuotes(raw) {
  const trimmed = raw === null || raw === void 0 ? void 0 : raw.trim();
  if (trimmed === void 0 || trimmed.length === 0) {
    return "";
  }
  return trimmed.startsWith('"') && trimmed.endsWith('"') ? trimmed.slice(1, -1) : trimmed;
}
function normalizeS3Etag(raw) {
  return stripS3EtagQuotes(raw).toLowerCase();
}

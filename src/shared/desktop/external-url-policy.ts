function externalUrl(value) {
  if (typeof value !== "string" || value.length === 0) return null;
  try {
    return new URL(value);
  } catch {
    return null;
  }
}
function isHttpExternalUrl(value) {
  const url2 = externalUrl(value);
  return url2?.protocol === "http:" || url2?.protocol === "https:";
}

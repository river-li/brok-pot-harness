function encodeBackgroundWorkMetadata(metadata) {
  const encoded = {};
  if (typeof metadata.title === "string" && metadata.title.trim().length > 0) {
    encoded.title = metadata.title;
  }
  if (typeof metadata.cwd === "string" && metadata.cwd.trim().length > 0) {
    encoded.cwd = metadata.cwd;
  }
  if (typeof metadata.startTimeMs === "number" && Number.isFinite(metadata.startTimeMs) && metadata.startTimeMs > 0) {
    encoded.startTimeMs = String(Math.floor(metadata.startTimeMs));
  }
  return Object.keys(encoded).length > 0 ? encoded : void 0;
}
function decodeBackgroundWorkMetadata(metadata) {
  const decoded = {};
  const title = metadata === null || metadata === void 0 ? void 0 : metadata.title;
  if (typeof title === "string" && title.trim().length > 0) {
    decoded.title = title;
  }
  const cwd = metadata === null || metadata === void 0 ? void 0 : metadata.cwd;
  if (typeof cwd === "string" && cwd.trim().length > 0) {
    decoded.cwd = cwd;
  }
  const rawStart = metadata === null || metadata === void 0 ? void 0 : metadata.startTimeMs;
  if (typeof rawStart === "string" && rawStart.length > 0) {
    const parsed = Number(rawStart);
    if (Number.isFinite(parsed) && parsed > 0) {
      decoded.startTimeMs = Math.floor(parsed);
    }
  }
  return decoded;
}

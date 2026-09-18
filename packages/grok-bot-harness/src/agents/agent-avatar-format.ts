var import_node_path31 = require("node:path");
var CANONICAL_AVATAR_FILENAME = "avatar.png";
var CONVENTIONAL_AVATAR_EXTENSIONS = ["png", "jpg", "jpeg", "webp", "gif", "svg"];
var CONVENTIONAL_AVATAR_RE = new RegExp(
  `^avatar\\.(${CONVENTIONAL_AVATAR_EXTENSIONS.join("|")})$`,
  "i"
);
function isConventionalAvatarFilename(name17) {
  return CONVENTIONAL_AVATAR_RE.test(name17);
}
function conventionalAvatarRank(name17) {
  if (name17 === CANONICAL_AVATAR_FILENAME) return -1;
  const ext2 = (0, import_node_path31.extname)(name17).slice(1).toLowerCase();
  const index = CONVENTIONAL_AVATAR_EXTENSIONS.findIndex((extension3) => extension3 === ext2);
  return index === -1 ? CONVENTIONAL_AVATAR_EXTENSIONS.length : index;
}
function sortConventionalAvatarFilenames(names3) {
  return names3.filter(isConventionalAvatarFilename).sort((a, b2) => conventionalAvatarRank(a) - conventionalAvatarRank(b2) || a.localeCompare(b2));
}
function extensionForMime(mime2) {
  switch (mime2) {
    case "image/png":
      return "png";
    case "image/jpeg":
      return "jpg";
    case "image/webp":
      return "webp";
    case "image/gif":
      return "gif";
    case "image/svg+xml":
      return "svg";
    default:
      return null;
  }
}
var AVATAR_MAX_BYTES = 5 * 1024 * 1024;
var SVG_SNIFF_BYTES = 1024;
function sniffAvatarMimeType(bytes) {
  if (bytes.length >= 8 && bytes[0] === 137 && bytes[1] === 80 && bytes[2] === 78 && bytes[3] === 71 && bytes[4] === 13 && bytes[5] === 10 && bytes[6] === 26 && bytes[7] === 10) {
    return "image/png";
  }
  if (bytes.length >= 3 && bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255) {
    return "image/jpeg";
  }
  if (bytes.length >= 6) {
    const header = bytes.toString("latin1", 0, 6);
    if (header === "GIF87a" || header === "GIF89a") return "image/gif";
  }
  if (bytes.length >= 12 && bytes.toString("latin1", 0, 4) === "RIFF" && bytes.toString("latin1", 8, 12) === "WEBP") {
    return "image/webp";
  }
  const head = bytes.toString("utf8", 0, Math.min(bytes.length, SVG_SNIFF_BYTES)).replace(/^\uFEFF/, "").trimStart().toLowerCase();
  if (head.startsWith("<") && head.includes("<svg")) return "image/svg+xml";
  return null;
}

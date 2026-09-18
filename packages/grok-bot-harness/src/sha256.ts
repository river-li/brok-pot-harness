var import_node_crypto33 = require("node:crypto");
function sha256Hex(data) {
  return (0, import_node_crypto33.createHash)("sha256").update(data).digest("hex");
}
function sha256HexOfText(text2) {
  return (0, import_node_crypto33.createHash)("sha256").update(text2, "utf8").digest("hex");
}

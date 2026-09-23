var import_node_path73 = __toESM(require("node:path"), 1);
function getRequestPathModule(requestContext) {
  const isWindows3 = requestContext.env?.osVersion?.toLowerCase().includes("win32") === true;
  return isWindows3 ? import_node_path73.default.win32 : import_node_path73.default.posix;
}

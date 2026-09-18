var import_node_os30 = require("node:os");
function resolveTimeZone() {
  try {
    return new Intl.DateTimeFormat().resolvedOptions().timeZone || void 0;
  } catch {
    return void 0;
  }
}
function createHostRequestContext(options2) {
  const {
    transcriptsFolder,
    shell,
    resolveUserTimeZone = () => void 0,
    resolveRules = async () => [],
    resolveUserFullName = () => void 0
  } = options2;
  return {
    resolve: () => {
      const userFullName = normalizeSandUserFullName(resolveUserFullName());
      return {
        osVersion: `${(0, import_node_os30.type)()} ${(0, import_node_os30.release)()}`,
        shell,
        timeZone: resolveUserTimeZone() ?? resolveTimeZone(),
        transcriptsFolder,
        mountedAgentStores: [],
        ...userFullName != null ? { userFullName } : {}
      };
    },
    resolveRules
  };
}

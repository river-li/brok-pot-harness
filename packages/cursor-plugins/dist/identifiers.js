function getPluginDbId(ident) {
  switch (ident.source) {
    case "cursor-first-party":
    case "cursor-third-party":
      return ident.sourceInfo.pluginDbId;
    case "claude-plugin":
    case "user-local":
    case "extension":
      return void 0;
    default: {
      const _exhaustive = ident;
      return void 0;
    }
  }
}

function offersConnectorFileTools(args) {
  if (!args.hasConnectorFilesPort) return false;
  return args.mcpToolCount > 0 || args.mcpDiscoveryUnavailable;
}

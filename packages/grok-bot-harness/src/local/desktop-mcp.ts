/** Keep the retained desktop Plugins UI on the same local manager as agents. */
type Args = Record<string, unknown>;
export function createLocalDesktopMcpEdge(
  options: {
    baseUrl?: string;
    token?: string;
    configError?: (failure: unknown) => Error;
  } = {},
) {
  const base = new URL(
    options.baseUrl ??
      process.env.SAND_HOST_GATEWAY_URL ??
      "http://127.0.0.1:1540",
  );
  const token = options.token ?? process.env.SAND_HOST_GATEWAY_TOKEN;
  const call = async (method: string, args: Args = {}): Promise<any> => {
    if (!token)
      throw Error(
        "Local gateway credentials are missing. Start the local desktop launcher.",
      );
    const response = await fetch(new URL(`/api/${method}`, base), {
      method: "POST",
      redirect: "error",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(args),
      signal: AbortSignal.timeout(30000),
    });
    const result = (await response.json()) as any;
    if (!response.ok) {
      if (result.mcpConfigFailure && options.configError)
        throw options.configError(result.mcpConfigFailure);
      throw Error(
        typeof result.error === "string"
          ? result.error
          : `Local plugin request failed (${response.status}).`,
      );
    }
    return result;
  };
  return {
    getMcpState: () => call("getMcpState"),
    getGrokBotAgentMcpServers: (_args: Args) => call("getMcpState"),
    getEffectivePlugins: () => call("getEffectiveMcpPlugins"),
    getMcpCatalog: () => call("getMcpCatalog"),
    getMcpTeamPopularity: async () => ({}),
    getMcpPluginLogo: async () => null,
    installEntry: (args: Args) => call("installMcpEntry", args),
    updatePluginInstall: (args: Args) => call("updateMcpPluginInstall", args),
    removeMcpServer: (args: Args) => call("removeMcpServer", args),
    uninstallPlugin: (args: Args) => call("uninstallMcpPlugin", args),
    authenticateMcpServer: (args: Args) => call("authenticateMcpServer", args),
    renameMcpAccount: (args: Args) => call("renameMcpAccount", args),
    removeMcpAccount: (args: Args) => call("removeMcpAccount", args),
    setMcpCustomInstructions: (args: Args) =>
      call("setMcpCustomInstructions", args),
    listMcpServerTools: (args: Args) => call("listMcpServerTools", args),
    toggleMcpToolDisabled: (args: Args) => call("toggleMcpToolDisabled", args),
  };
}

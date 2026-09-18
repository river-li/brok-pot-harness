var searchPluginsParameters = external_exports.object({
  query: external_exports.string().trim().optional().describe(
    `Optional. What you're looking for, in natural language (e.g. "manage linear issues" or "write word documents") \u2014 results come back ranked by relevance. Omit to list the whole catalog.`
  )
});
var getPluginParameters = external_exports.object({
  plugin_id: external_exports.string().trim().min(1).describe("The stable plugin id from SearchPlugins.")
});
var installPluginParameters = external_exports.object({
  plugin_id: external_exports.string().trim().min(1).describe("The stable plugin id from SearchPlugins."),
  values: external_exports.record(external_exports.string(), external_exports.string()).optional().describe(
    `Optional setup values keyed by the plugin's field key from GetPlugin (e.g. { "CONTEXT7_API_KEY": "..." }). Provide every required field. Ask the user for any secret you don't already have.`
  )
});
var PLUGIN_QUERY_MIN_TOKEN_LENGTH = 3;
function tokenizePluginQuery(query) {
  return [
    ...new Set(
      query.toLowerCase().split(/[^a-z0-9]+/).filter((token) => token.length >= PLUGIN_QUERY_MIN_TOKEN_LENGTH)
    )
  ];
}
function scorePluginForToken(plugin, token) {
  const name17 = plugin.name.toLowerCase();
  const displayName2 = plugin.displayName.toLowerCase();
  if (name17 === token || displayName2 === token) return 8;
  if (name17.includes(token) || displayName2.includes(token)) return 5;
  if (plugin.skills.some((skill) => skill.name.toLowerCase().includes(token))) {
    return 3;
  }
  if (plugin.category.toLowerCase().includes(token)) return 2;
  if (plugin.description.toLowerCase().includes(token)) return 1;
  return 0;
}
function rankPluginsLexically(plugins, query) {
  const tokens = tokenizePluginQuery(query);
  const byName = (a, b2) => a.displayName.localeCompare(b2.displayName);
  if (tokens.length === 0) return [...plugins].sort(byName);
  return plugins.map((plugin) => ({
    plugin,
    score: tokens.reduce((sum, token) => sum + scorePluginForToken(plugin, token), 0)
  })).filter((entry) => entry.score > 0).sort((a, b2) => b2.score - a.score || byName(a.plugin, b2.plugin)).map((entry) => entry.plugin);
}
var addMcpServerParameters = external_exports.object({
  name: external_exports.string().trim().min(1).describe('A short, unique name for the server, e.g. "superpowers".'),
  url: external_exports.string().trim().min(1).optional().describe(
    "For a remote server: its MCP endpoint URL (https). Provide url OR command, not both."
  ),
  headers: external_exports.record(external_exports.string(), external_exports.string()).optional().describe(
    'Optional HTTP headers for a remote server with static bearer/API-key auth, e.g. { "Authorization": "Bearer <token>" }. Ask the user for any secret rather than guessing.'
  ),
  auth: external_exports.object({
    CLIENT_ID: external_exports.string().trim().min(1).describe("The OAuth client ID the server publishes for pre-registered clients."),
    CLIENT_SECRET: external_exports.string().optional().describe(
      "Optional OAuth client secret. Ask the user for it rather than guessing; many public clients need none."
    ),
    scopes: external_exports.array(external_exports.string()).optional().describe('Optional OAuth scopes to request, e.g. ["tweet.read", "offline.access"].')
  }).optional().describe(
    "Optional OAuth client settings for a remote server whose provider does not support dynamic client registration and instead publishes a pre-registered client ID. Use `headers` for static bearer/API-key auth; use `auth` only for OAuth. Remote servers only \u2014 never combine with `command`."
  ),
  command: external_exports.string().trim().min(1).optional().describe(
    `For a local (stdio) server: the executable to run on Grok Bot's computer, e.g. "npx". Provide command OR url, not both.`
  ),
  args: external_exports.array(external_exports.string()).optional().describe('Arguments for the stdio command, e.g. ["-y", "@acme/mcp-server"].'),
  env: external_exports.record(external_exports.string(), external_exports.string()).optional().describe(
    'Environment variables for the stdio command, e.g. { "API_KEY": "<token>" }. Ask the user for any secret rather than guessing.'
  )
});
function validateRemoteMcpUrl(rawUrl) {
  let parsed2;
  try {
    parsed2 = new URL(rawUrl);
  } catch {
    return `"${rawUrl}" is not a valid URL. Ask the user for the server's full https endpoint (e.g. https://example.com/mcp) and try again.`;
  }
  if (parsed2.protocol !== "http:" && parsed2.protocol !== "https:") {
    return `The server URL must be http(s); "${parsed2.protocol}" is not supported. Grok Bot only connects remote http/sse MCP servers over HTTP(S), so ask the user for an https endpoint.`;
  }
  if (parsed2.username.length > 0 || parsed2.password.length > 0) {
    return `Don't put credentials in the server URL \u2014 pass them as headers instead (e.g. { "Authorization": "Bearer <token>" }), so they aren't stored in plaintext in the URL. Ask the user for the token and try again with a clean URL.`;
  }
  return null;
}
function buildServerConfigJson(args) {
  if (args.url != null && args.url.length > 0) {
    const config2 = {
      type: "http",
      url: args.url,
      ...args.headers != null && Object.keys(args.headers).length > 0 ? { headers: args.headers } : {},
      ...args.auth != null ? { auth: args.auth } : {}
    };
    return JSON.stringify(config2);
  }
  if (args.command != null && args.command.length > 0) {
    const config2 = {
      command: args.command,
      ...args.args != null && args.args.length > 0 ? { args: args.args } : {},
      ...args.env != null && Object.keys(args.env).length > 0 ? { env: args.env } : {}
    };
    return JSON.stringify(config2);
  }
  return null;
}
var restartMcpServersParameters = external_exports.object({});
var forceReauthField = external_exports.boolean().optional().describe(
  "Discard the stored credential and start a fresh sign-in, so the user can re-authenticate or pick a different account/workspace. This is also the wrong-identity fix: if the user authorized the wrong identity for a label, re-run with the SAME account_label and this flag \u2014 don't remove the account. Reach for it when auth seems stuck: a server that used to work keeps failing with auth errors, reads as connected while its tools reject calls, or a plain sign-in keeps failing or reports already-authenticated without fixing anything. A normal sign-in reuses the stored session, so signing out and back in clears a lot of odd auth errors. Explain that to the user, ask whether to sign the server out and start over, and re-run with this flag only once they agree. Don't reach for it on a single transient error. It deletes a credential shared with the user's other Cursor surfaces, so confirm with the user first. Omit it for a normal first-time sign-in."
);
var AUTHENTICATE_MCP_SERVER_DESCRIPTION = "Authenticate an installed MCP server that needs it (status needsAuth, or a tool call failing with an auth error). This is the only way to start a connector's auth: its connect card is shown to the user automatically \u2014 never compose a card, paste an authorization link, or reach the same service another way while its authorization is pending. The user authorizes in place and you're resumed automatically, so finish unrelated work, then end your turn.";
function buildServerIdentifierParameterSchemas(mcpMetaToolNames) {
  const serverIdentifierDescription = `The server identifier shown by GetMcpServerStatus \u2014 the same identifier ${mcpMetaToolNames.discovery} and ${mcpMetaToolNames.invocation} address, e.g. "dashboard-team-1-Slack". Never a display name.`;
  const serverIdParameters = external_exports.object({
    server_id: external_exports.string().trim().min(1).describe(serverIdentifierDescription)
  });
  const accountLifecycleParameters = serverIdParameters.extend({
    account_label: external_exports.string().trim().min(1).describe(
      `The account's label exactly as shown by GetMcpServerStatus (account="\u2026"); the quoted form is accepted verbatim.`
    )
  });
  return {
    serverIdParameters,
    serverStatusParameters: external_exports.object({
      server_id: external_exports.string().trim().optional().describe(
        `Optional. One server to report on. ${serverIdentifierDescription} Omit to list every installed server.`
      )
    }),
    setInstructionsParameters: external_exports.object({
      server_id: external_exports.string().trim().min(1).describe(serverIdentifierDescription),
      instructions: external_exports.string().describe(
        `The custom instructions to follow whenever you use this connector \u2014 how the user wants it used (e.g. "Reply in threads on Slack."). Pass an empty string to clear them and fall back to the connector's default.`
      )
    }),
    authenticateParameters: serverIdParameters.extend({
      force_reauth: forceReauthField
    }),
    authenticateMultiAccountParameters: serverIdParameters.extend({
      account_label: external_exports.string().trim().min(1).describe(
        `Which account on this server to sign in \u2014 REQUIRED. Labels show as account="\u2026" in GetMcpServerStatus; pass an existing label exactly as listed (the quoted form is accepted verbatim), or a NEW short lowercase label (e.g. "work", "personal") to add another account \u2014 adding one changes the user's configuration, so confirm with a question widget first. If the user hasn't said which account or what to call a new one, ask before calling. Use "default" for a server with a single unlabeled account.`
      ),
      force_reauth: forceReauthField
    }),
    accountLifecycleParameters,
    renameAccountParameters: accountLifecycleParameters.extend({
      new_account_label: external_exports.string().trim().min(1).describe('The new short lowercase label (e.g. "work").')
    })
  };
}
function truncateOneLine(value, max) {
  const oneLine = value.replace(/\s+/g, " ").trim();
  return oneLine.length > max ? `${oneLine.slice(0, max - 1)}\u2026` : oneLine;
}
function describeInstalled(server) {
  const parts = [
    `- ${server.serverIdentifier}: ${server.name} [${server.status}]`,
    `account=${encodeMcpAccountLabelForListing(server.accountKey)}`,
    `transport=${server.transport}`,
    server.disabledToolCount != null && server.disabledToolCount > 0 ? `tools=${server.toolCount}/${server.toolCount + server.disabledToolCount} enabled` : `tools=${server.toolCount}`
  ];
  if (server.pluginId != null) {
    parts.push(`plugin=${server.pluginId} (remove via UninstallPlugin \u2014 removes the whole plugin)`);
  }
  if (server.statusDetail != null && server.statusDetail.length > 0) {
    parts.push(`detail="${server.statusDetail}"`);
  }
  if (server.customInstructions.length > 0 && server.customInstructions !== getDefaultMcpCustomInstruction(server.name)) {
    parts.push(`instructions="${truncateOneLine(server.customInstructions, 120)}"`);
  }
  return parts.join(" \xB7 ");
}
function noInstalledServerMessage(token) {
  return `No installed MCP server "${token}". Run GetMcpServerStatus to list every server with its identifier.`;
}
function describeBuiltinScmAuthRefusal(resolution) {
  const identifier = resolution.serverIdentifier;
  if (identifier === void 0 || cursorScmProviderForMcpServerIdentifier(identifier) == null) {
    return null;
  }
  const name17 = resolution.serverName ?? identifier;
  return `"${name17}" is a built-in source-control server: it uses the user's ${name17} connection in Cursor, not an MCP sign-in, so there is nothing to authenticate here. If its status is needsAuth, the user has not connected ${name17} in Cursor: call ${SAND_REQUEST_SCM_CONNECT_TOOL_NAME} with intent "connect" when you have that tool; otherwise say plainly that ${name17} is not connected to their Cursor account and that connecting it (the same integration cloud agents use) unblocks these tools \u2014 no link and no settings path.`;
}
function describeServerIdResolutionFailure(token, resolution) {
  switch (resolution.kind) {
    case "listing-unreadable":
      return `Could not resolve MCP server "${token}" because the installed-server listing could not be read. No change was made; run GetMcpServerStatus and retry once it succeeds.`;
    case "unknown-name":
      return noInstalledServerMessage(token);
    default: {
      const _exhaustive = resolution;
      return _exhaustive;
    }
  }
}
function describeInstalledList(servers) {
  if (servers.length === 0) {
    return "No MCP servers are installed.";
  }
  return [`${servers.length} installed MCP server(s):`, ...servers.map(describeInstalled)].join(
    "\n"
  );
}
function describePluginInstallState(plugin) {
  if (!plugin.isInstalled) return "installed=no";
  return plugin.installMode != null ? `installed=yes (${plugin.installMode})` : "installed=yes";
}
function describePluginIncludes(plugin) {
  const parts = [];
  if (plugin.connectorCount > 0) {
    parts.push(`${plugin.connectorCount} connector${plugin.connectorCount === 1 ? "" : "s"}`);
  }
  if (plugin.skills.length > 0) {
    parts.push(`${plugin.skills.length} skill${plugin.skills.length === 1 ? "" : "s"}`);
  }
  return parts.length > 0 ? parts.join(", ") : "no primitives";
}
function describePluginSummary(plugin) {
  const parts = [
    `- ${plugin.pluginId}: ${plugin.displayName} \u2014 ${plugin.description}`,
    `  (${[
      describePluginInstallState(plugin),
      `includes: ${describePluginIncludes(plugin)}`,
      `category=${plugin.category}`
    ].join("; ")})`
  ];
  const guidance = getDefaultMcpCustomInstruction(plugin.displayName);
  if (guidance.length > 0) {
    parts.push(`  usage guidance: ${guidance}`);
  }
  return parts.join("\n");
}
function describePluginFields(detail) {
  if (detail.fields.length === 0) return null;
  const lines2 = detail.fields.map((field) => {
    const flags = [
      field.isRequired ? "required" : "optional",
      ...field.isSecret ? ["secret \u2014 ask the user, never guess"] : []
    ].join(", ");
    return `  - ${field.key} (${field.label}; ${flags})`;
  });
  return ["Setup fields (pass in InstallPlugin values):", ...lines2].join("\n");
}
function describePluginConnectorType(detail) {
  switch (detail.connectorType) {
    case void 0:
      return null;
    case "team":
      return "Credential: team \u2014 the bot carries the `${VAR}` values above (or the plugin is skills-only); no per-person sign-in.";
    case "user":
      return "Credential: user \u2014 each person signs in through their own connect card; there is no `${VAR}` to set on the bot.";
    default: {
      const _exhaustive = detail.connectorType;
      return _exhaustive;
    }
  }
}
function describePluginDetail(detail) {
  const sections = [
    `${detail.pluginId}: ${detail.displayName} \u2014 ${detail.description}`,
    `${describePluginInstallState(detail)} \xB7 includes: ${describePluginIncludes(detail)} \xB7 category=${detail.category}`
  ];
  if (detail.skills.length > 0) {
    sections.push(
      [
        "Skills:",
        ...detail.skills.map(
          (skill) => `  - ${skill.name}${skill.description.length > 0 ? ` \u2014 ${truncateOneLine(skill.description, 140)}` : ""}`
        )
      ].join("\n")
    );
  }
  const fields2 = describePluginFields(detail);
  if (fields2 != null) sections.push(fields2);
  const connectorType = describePluginConnectorType(detail);
  if (connectorType != null) sections.push(connectorType);
  if (detail.servers.length > 0) {
    sections.push(
      [
        "Its installed MCP server(s) \u2014 statuses live in GetMcpServerStatus:",
        ...detail.servers.map(describeInstalled)
      ].join("\n")
    );
  }
  if (detail.isInstalled && detail.installMode === "team-required") {
    sections.push("Required by the user's team \u2014 it cannot be uninstalled.");
  }
  return sections.join("\n");
}
var CARD_SHOWN_NOTE = "Its connect card is now in the chat. Finish unrelated work, then end your turn \u2014 you're resumed automatically when the user authorizes. Don't send a link, another card, or reach the service another way meanwhile.";
function newNeedsAuthRows(before, after) {
  const beforeIdentifiers = new Set(before.map((s3) => s3.serverIdentifier));
  const rows = /* @__PURE__ */ new Map();
  for (const server of after) {
    if (beforeIdentifiers.has(server.serverIdentifier)) continue;
    if (server.status !== "needsAuth") continue;
    rows.set(server.id, server.name);
  }
  return [...rows.entries()].map(([id, name17]) => ({ id, name: name17 }));
}
function emitAndDescribeAuthResult(result, isForceReauth, serverId, emitConnectorCard) {
  const name17 = result.serverName;
  switch (result.kind) {
    case "started": {
      emitConnectorCard?.({
        connector: name17,
        serverId,
        variant: "connect"
      });
      if (result.completionUnconfirmed === true) {
        return `Started a fresh sign-in for "${name17}"; its connect card is now in the chat. Its current credential stays usable, so completion cannot be confirmed automatically \u2014 do not assume the re-auth finished, and ask the user or re-check GetMcpServerStatus later instead of waiting.`;
      }
      return isForceReauth ? `Signed "${name17}" out and started a fresh sign-in. ${CARD_SHOWN_NOTE}` : `Authentication started for "${name17}". ${CARD_SHOWN_NOTE}`;
    }
    case "already-authenticated":
      emitConnectorCard?.({
        connector: name17,
        serverId,
        variant: "connected"
      });
      return `"${name17}" is already authenticated and connected; a confirmation card is now in the chat. To re-authenticate or switch accounts, call this again with force_reauth: true (confirm with the user first).`;
    case "not-configured":
      return `"${name17}" is not installed, so there is nothing to authenticate. Install it first.`;
    case "not-supported":
      return `"${name17}" does not support interactive authentication: ${result.message}`;
    case "unreachable":
      return `Sign-in for "${name17}" never started. The server or its configuration failed the check: "${result.message}" \u2014 not a missing credential, so the user authenticating in Settings would hit the same error. Tell them what it reported instead of sending them to Settings.${isForceReauth ? "" : ` If "${name17}" used to work and its auth now seems stuck, signing out and back in often clears errors like this: ask the user whether to sign "${name17}" out and start over, and only then call this again with force_reauth: true.`}`;
    default: {
      const _exhaustive = result;
      return _exhaustive;
    }
  }
}
var PERSONAL_MCP_MANAGEMENT_COPY = {
  searchDescription: "Search the plugins the user could install (or already has): marketplace plugins bundling connectors and skills. Say what you're looking for in natural language and results come back ranked by relevance, each with its STABLE plugin id, install state, and what it includes. Use this to discover a capability (Linear, Notion, writing Word documents, \u2026) or to check whether a plugin is installed. Inspect one result with GetPlugin; connector runtime statuses (connected/needsAuth) live in GetMcpServerStatus. This is read-only and never needs the user's permission.",
  searchEmptyWithQuery: (query) => `No plugins match "${query}". Try different words, or search with no query to list everything.`,
  searchEmpty: "The plugin catalog is empty or unavailable right now. Try again shortly.",
  getDescription: "Full detail for one plugin by its STABLE plugin id (from SearchPlugins): what it includes (connectors, skills), its install state, any setup fields InstallPlugin needs (with required/secret flags), and the installed MCP servers backing it. Read this before installing a plugin with setup fields, and before uninstalling (to know the full scope you must disclose). Read-only.",
  installDescription: "Install a plugin by its STABLE plugin id (from SearchPlugins) into the user's Cursor account. Only call this after the user has agreed \u2014 confirm with a question widget first, since installing changes the user's configuration. Idempotent: re-installing an installed plugin is safe. Pass any setup values GetPlugin lists (ask the user for secrets like API keys \u2014 never guess). If an installed connector needs authentication, its connect card is shown to the user automatically \u2014 finish unrelated work, then end your turn; you're resumed when they authorize. New tools and skills become available on your next message.",
  installed: (displayName2, pluginId) => `Installed ${displayName2} (plugin ${pluginId}).`,
  addDescription: "Add an MCP server that isn't in the catalog to the user's Cursor account \u2014 use this when the user gives you a link or a launch command for a server that SearchPlugins doesn't know. Only call this after the user agrees to add it \u2014 confirm with a question widget first, since it changes the user's account configuration and the server can run commands or reach external services on their behalf. Provide EITHER a remote `url` OR a local `command` with `args` (and `env` for secrets) \u2014 not both. For a remote server's credentials, use `headers` for static bearer/API-key auth, or `auth` for an OAuth provider that publishes a pre-registered client ID (its `CLIENT_ID`, optional `CLIENT_SECRET`, and `scopes`) instead of supporting dynamic client registration. A remote server runs on the backend; a `command` server runs on your computer, which has node, npm, bun, python3, and uv, so `npx -y <pkg>` and `uvx <pkg>` both work \u2014 install anything else it needs with Shell first. That command also runs in this user's other agents, so say so when you confirm. Ask the user for the exact endpoint or command and any secrets rather than guessing; if you only have a link, open it first (WebFetch) to find the connection details. Newly added tools become available to you on your next message.",
  added: (name17) => `Added "${name17}".`,
  uninstallServerDescription: (multiAccount) => "Remove ONE custom MCP server \u2014 a server added with AddMcpServer, not one that came from a plugin \u2014 by its server identifier. This is destructive and deletes the server with all of its accounts, so confirm with the user via a question widget first. A server the listing marks `plugin=<id>` came from a marketplace plugin: removing it would uninstall that WHOLE plugin, which this tool refuses \u2014 use UninstallPlugin for those so the confirmation can disclose the full scope." + (multiAccount ? " To remove just one account and keep the server, use RemoveMcpAccount instead." : ""),
  uninstallServerPluginRow: (row, pluginId) => `${row.name} was installed from marketplace plugin ${pluginId}, so removing it removes that whole plugin \u2014 every connector and skill it added, not just this server. Use UninstallPlugin with plugin id ${pluginId} instead, and disclose that full scope to the user first.`,
  uninstallPluginDescription: (multiAccount) => "Uninstall a plugin by its STABLE plugin id (from SearchPlugins). This is destructive and removes the WHOLE PLUGIN \u2014 its install record and EVERY connector and skill it added \u2014 so confirm with the user via a question widget first, and your confirmation must disclose that full scope (list what goes). Plugins required by the user's team cannot be uninstalled." + (multiAccount ? " This removes each of its servers with ALL of their accounts; to remove just one account from a server, use RemoveMcpAccount instead." : ""),
  notInstalled: (displayName2, pluginId) => `${displayName2} (plugin ${pluginId}) is not installed \u2014 nothing to uninstall.`,
  uninstalled: (displayName2, pluginId) => `Uninstalled ${displayName2} (plugin ${pluginId}) \u2014 its install record and every connector it added are gone.`
};
var TEAM_MCP_MANAGEMENT_COPY = {
  searchDescription: "Search the plugins this bot can carry for the whole team: marketplace plugins bundling connectors and skills. Say what you're looking for in natural language and results come back ranked by relevance, each with its STABLE plugin id, whether it is on the bot (installed=yes means every teammate's turns get it), and what it includes. Team-credential plugins list `${VAR}` fields the bot carries for everyone; user-login plugins show each person their own connect card. Use this to discover a capability (Linear, Notion, writing Word documents, \u2026) or to check whether the bot already has a plugin. Inspect one result with GetPlugin; connector runtime statuses (connected/needsAuth) live in GetMcpServerStatus. This is read-only and never needs anyone's permission.",
  searchEmptyWithQuery: (query) => `No plugins match "${query}". Try different words, or search with no query to list everything this bot could carry.`,
  searchEmpty: "No plugins match: this bot's catalog is empty from here. A team admin publishes plugins from the dashboard, and the owner adds them from their own conversation with the bot.",
  getDescription: "Full detail for one plugin by its STABLE plugin id (from SearchPlugins): what it includes (connectors, skills), whether it is on this bot, any setup fields InstallPlugin takes (with required/secret flags), its credential shape (team `${VAR}` values the bot carries vs a connect card per person), and the bot's MCP servers backing it. Read this before adding a plugin with setup fields, and before removing one (to know the full scope you must disclose to the team). Read-only.",
  installDescription: "Add a plugin by its STABLE plugin id (from SearchPlugins) to this bot for everyone on the team. Only the bot owner can, from their own conversation with the bot; from anyone else's conversation say the owner or a team admin (Team access) can add it and do not call this. When the owner names the plugin and asks to add it, add it right away \u2014 no confirmation widget; the result already says it is on the bot for the whole team. Use a question widget only when the catalog match is ambiguous, you would be adding something they did not name, or you need a non-secret setup value first. Idempotent: adding a plugin already on the bot is safe. Pass any non-secret setup values GetPlugin lists (a site, a region, a toolset). Secret setup values (API keys, tokens) must never go through `values` on a shared bot: add the plugin without them, then send one SendToUser secret-request per secret field with the plugin's id as plugin_id and the field key as name, so the owner fills it through the masked card. If a user-login connector needs authentication, its connect card is shown automatically \u2014 finish unrelated work, then end your turn; you're resumed when they authorize. New tools and skills reach the bot on your next message.",
  installed: (displayName2, pluginId) => `Added ${displayName2} (plugin ${pluginId}) to this bot for the whole team.`,
  addDescription: "Add an MCP server that isn't in the catalog to this bot for the whole team \u2014 use this when the owner gives you a link or a launch command for a server that SearchPlugins doesn't know. Only the bot owner can, from their own conversation with the bot. When the owner hands you the server and asks to add it, add it right away \u2014 no confirmation widget; say in your reply that every teammate's turns get it and that it can run commands or reach external services on the bot's behalf. Use a question widget only when the connection details are ambiguous or you would be adding a server they did not name. Provide EITHER a remote `url` OR a local `command` with `args` (and `env` for secrets) \u2014 not both. For a remote server's credentials, use `headers` for static bearer/API-key auth, or `auth` for an OAuth provider that publishes a pre-registered client ID (its `CLIENT_ID`, optional `CLIENT_SECRET`, and `scopes`) instead of supporting dynamic client registration. A remote server runs on the backend for everyone; a `command` server runs on the owner's box (node, npm, bun, python3, and uv are there, so `npx -y <pkg>` and `uvx <pkg>` both work) and is unavailable in teammates' private conversations, so prefer a remote `url` for a team server and say so when you add it. Ask the owner for the exact endpoint or command and any secrets rather than guessing; if you only have a link, open it first (WebFetch) to find the connection details. Newly added tools reach the bot on your next message.",
  added: (name17) => `Added "${name17}" to this bot for the whole team.`,
  uninstallServerDescription: () => "Remove ONE custom MCP server that was added to this bot with AddMcpServer, by its server identifier. This removes it from the bot for every teammate, so confirm with the owner via a question widget first and disclose that scope. Only the bot owner can, from their own conversation. This bot stores every server as a plugin, so the listing marks each row `plugin=<id>`: remove it with UninstallPlugin and that id, which removes the plugin from the bot for the whole team.",
  uninstallServerPluginRow: (row, pluginId) => `${row.name} is plugin ${pluginId} on this bot, so removing it removes that plugin from the bot for every teammate \u2014 every connector and skill it added, not just this server. Use UninstallPlugin with plugin id ${pluginId}, and disclose that full scope to the owner first.`,
  uninstallPluginDescription: () => "Remove a plugin from this bot by its STABLE plugin id (from SearchPlugins). This removes it for every teammate \u2014 its connectors, its skills, and any team `${VAR}` values configured for it \u2014 so confirm with the owner via a question widget first, and your confirmation must disclose that full scope (list what goes). Only the bot owner can, from their own conversation with the bot; from anyone else's conversation say the owner or a team admin (Team access) can remove it and do not call this.",
  notInstalled: (displayName2, pluginId) => `${displayName2} (plugin ${pluginId}) is not on this bot \u2014 nothing to remove.`,
  uninstalled: (displayName2, pluginId) => `Removed ${displayName2} (plugin ${pluginId}) from this bot for every teammate \u2014 its connectors and skills are gone from their turns.`
};
var MCP_AWAITING_SELECTION_MESSAGE = "You just sent a question widget, so this turn is waiting on the user's selection \u2014 their answer arrives as the next message. Don't install, uninstall, restart, or authenticate an MCP server in the same turn as the confirmation widget; wait for the user to confirm, then do it on your next turn.";
var MCP_TEAM_SETUP_UNDERWAY_MESSAGE = "Nothing was added. This bot's setup is already running from the owner's message: a background pass is picking its plugins, and the owner sees them as a card in this chat to tick and set up. Leave plugins to that card this turn; when the owner later names one and asks for it, add it then.";
function createMcpManagementTools(management, getRequestingAgentId, isAwaitingUserSelection, isMultiAccountEnabled, emitConnectorCard, mcpMetaToolNames = SAND_STATIC_MCP_META_TOOL_NAMES, options2) {
  const copy = options2?.teamBot === true ? TEAM_MCP_MANAGEMENT_COPY : PERSONAL_MCP_MANAGEMENT_COPY;
  const {
    serverIdParameters,
    serverStatusParameters,
    setInstructionsParameters,
    authenticateParameters,
    authenticateMultiAccountParameters,
    accountLifecycleParameters,
    renameAccountParameters
  } = buildServerIdentifierParameterSchemas(mcpMetaToolNames);
  const multiAccount = isMultiAccountEnabled?.() === true;
  const blockedByPendingSelection = () => isAwaitingUserSelection?.() === true;
  const resolveServerId = async (deps, token) => {
    const trimmed = token.trim();
    if (isMcpServerId(trimmed)) return { kind: "resolved", serverId: trimmed };
    const listing = await readMcpInstalledListing(() => deps.listInstalled());
    if (listing.kind === "unreadable") return { kind: "listing-unreadable" };
    const row = resolveMcpServerRowByIdentifierOrLegacyId(listing.servers, trimmed);
    return row == null ? { kind: "unknown-name" } : {
      kind: "resolved",
      serverId: row.id,
      serverIdentifier: row.serverIdentifier,
      serverName: row.name
    };
  };
  const guardMutation = (execute) => async (ctx, args, deps) => {
    if (blockedByPendingSelection()) {
      return MCP_AWAITING_SELECTION_MESSAGE;
    }
    return execute(ctx, args, deps);
  };
  const teamSetupUnderway = () => options2?.isTeamSetupUnderway?.() === true;
  const emitNeedsAuthCards = (before, after) => {
    const rows = newNeedsAuthRows(before, after);
    if (rows.length === 0 || emitConnectorCard == null) return null;
    for (const row of rows) {
      emitConnectorCard({
        connector: row.name,
        serverId: row.id,
        variant: "connect"
      });
    }
    return rows.length === 1 ? `"${rows[0].name}" needs authentication. ${CARD_SHOWN_NOTE}` : `${rows.map((row) => `"${row.name}"`).join(", ")} need authentication; their connect cards are now in the chat. Finish unrelated work, then end your turn \u2014 you're resumed when the user authorizes.`;
  };
  return [
    defineCommunicateTool(management, {
      id: "SEARCH_PLUGINS",
      name: "SearchPlugins",
      description: copy.searchDescription,
      parameters: searchPluginsParameters,
      execute: async (_ctx, args, deps) => {
        const query = (args.query ?? "").trim();
        const plugins = rankPluginsLexically(await deps.listPlugins(), query);
        if (plugins.length === 0) {
          return query.length > 0 ? copy.searchEmptyWithQuery(query) : copy.searchEmpty;
        }
        const heading = query.length > 0 ? `${plugins.length} plugin(s) matching "${query}" (best first):` : `${plugins.length} plugin(s) available:`;
        return [heading, ...plugins.map(describePluginSummary)].join("\n");
      }
    }),
    defineCommunicateTool(management, {
      id: "GET_PLUGIN",
      name: "GetPlugin",
      description: copy.getDescription,
      parameters: getPluginParameters,
      execute: async (_ctx, args, deps) => {
        const detail = await deps.getPlugin(args.plugin_id);
        if (detail == null) {
          return `No plugin with id "${args.plugin_id}". Ids come from SearchPlugins \u2014 run it and use the id it lists.`;
        }
        return describePluginDetail(detail);
      }
    }),
    defineCommunicateTool(management, {
      id: "INSTALL_PLUGIN",
      name: "InstallPlugin",
      description: copy.installDescription,
      parameters: installPluginParameters,
      describeActivity: (args) => /^\d+$/.test(args.plugin_id) ? void 0 : { detail: args.plugin_id },
      execute: guardMutation(async (_ctx, args, deps) => {
        if (teamSetupUnderway()) return MCP_TEAM_SETUP_UNDERWAY_MESSAGE;
        const before = await deps.getPlugin(args.plugin_id);
        if (before == null) {
          return `No plugin with id "${args.plugin_id}". Ids come from SearchPlugins \u2014 run it and use the id it lists.`;
        }
        await deps.install({
          id: args.plugin_id,
          values: args.values
        });
        const after = await deps.getPlugin(args.plugin_id);
        if (after == null || !after.isInstalled) {
          return `The install request for "${before.displayName}" completed, but the plugin does not read as installed yet. Re-check with GetPlugin before relying on it.`;
        }
        const cardNote = emitNeedsAuthCards(before.servers, after.servers);
        return [
          copy.installed(after.displayName, after.pluginId),
          ...cardNote != null ? [cardNote] : [],
          describePluginDetail(after)
        ].join("\n");
      })
    }),
    defineCommunicateTool(management, {
      id: "ADD_MCP_SERVER",
      name: "AddMcpServer",
      description: copy.addDescription,
      parameters: addMcpServerParameters,
      describeActivity: (args) => ({ detail: args.name }),
      execute: guardMutation(async (_ctx, args, deps) => {
        if (teamSetupUnderway()) return MCP_TEAM_SETUP_UNDERWAY_MESSAGE;
        const hasUrl = args.url != null && args.url.length > 0;
        const hasCommand = args.command != null && args.command.length > 0;
        if (args.auth != null && hasCommand) {
          return "`auth` only applies to a remote server (`url`) \u2014 a local `command` server has no OAuth client. Drop `auth` (put secrets in `env`), or provide the server's remote `url` instead.";
        }
        if (args.auth != null && !hasUrl) {
          return "`auth` only applies to a remote server, so provide the server's `url` alongside it.";
        }
        if (hasUrl) {
          const urlError = validateRemoteMcpUrl(args.url ?? "");
          if (urlError != null) {
            return urlError;
          }
        }
        const configJson = buildServerConfigJson(args);
        if (configJson == null) {
          return "To add a server I need either a remote `url` (http/sse) or a local `command` to run. Ask the user which one applies, then try again.";
        }
        const before = await deps.listInstalled();
        const servers = await deps.add({ name: args.name, configJson });
        const cardNote = emitNeedsAuthCards(before, servers);
        return [
          copy.added(args.name),
          ...cardNote != null ? [cardNote] : [],
          describeInstalledList(servers)
        ].join("\n");
      })
    }),
    defineCommunicateTool(management, {
      id: "UNINSTALL_MCP_SERVER",
      name: "UninstallMcpServer",
      description: copy.uninstallServerDescription(multiAccount),
      parameters: serverIdParameters,
      describeActivity: (args) => ({ detail: args.server_id }),
      execute: guardMutation(async (_ctx, args, deps) => {
        const installed = await deps.listInstalled();
        const row = resolveMcpServerRowByIdentifierOrLegacyId(installed, args.server_id);
        if (row == null) {
          return noInstalledServerMessage(args.server_id);
        }
        if (row.pluginId != null) {
          return copy.uninstallServerPluginRow(row, row.pluginId);
        }
        if (row.isTeamServer) {
          return `${row.name} is provided by the user's team, so it can't be removed here \u2014 a team admin manages it. The user can hide it in Settings \u2192 Plugins.`;
        }
        const result = await deps.removeServer(row.id);
        if (result.removed) {
          return [
            `Removed MCP server ${row.name} (${row.serverIdentifier}).`,
            describeInstalledList(result.servers)
          ].join("\n");
        }
        if (result.reason === "team-server") {
          return [
            `Removed the user's own copy of ${row.name}, but a team-provided server of the same name still resolves \u2014 team servers are managed by the team admin and can't be removed here.`,
            describeInstalledList(result.servers)
          ].join("\n");
        }
        return [
          `The removal request for ${row.name} completed, but it still reads as installed. Re-check with GetMcpServerStatus; the user can also remove it in Settings \u2192 Plugins.`,
          describeInstalledList(result.servers)
        ].join("\n");
      })
    }),
    defineCommunicateTool(management, {
      id: "UNINSTALL_PLUGIN",
      name: "UninstallPlugin",
      description: copy.uninstallPluginDescription(multiAccount),
      parameters: getPluginParameters,
      execute: guardMutation(async (_ctx, args, deps) => {
        const detail = await deps.getPlugin(args.plugin_id);
        if (detail == null) {
          return `No plugin with id "${args.plugin_id}". Ids come from SearchPlugins \u2014 run it and use the id it lists.`;
        }
        if (!detail.isInstalled) {
          return copy.notInstalled(detail.displayName, detail.pluginId);
        }
        if (detail.installMode === "team-required") {
          return `${detail.displayName} is required by the user's team and cannot be uninstalled.`;
        }
        const result = await deps.uninstallPlugin(args.plugin_id);
        if (result.removed) {
          return copy.uninstalled(detail.displayName, detail.pluginId);
        }
        if (result.reason === "team-server") {
          return `Removed the user's own install of ${detail.displayName}, but a team-provided copy still resolves \u2014 team servers are managed by the team admin and can't be removed here.`;
        }
        return `The uninstall request for ${detail.displayName} completed, but it still reads as installed. Re-check with GetPlugin; the user can also remove it in Settings \u2192 Plugins.`;
      })
    }),
    defineCommunicateTool(management, {
      id: "GET_MCP_SERVER_STATUS",
      name: "GetMcpServerStatus",
      description: `The runtime status of the user's installed MCP servers (connected / needsAuth / error, per account). Pass server_id (the server identifier, NEVER a display name) for one server; omit it to list everything. Use this to see which connectors still need authentication, to find the identifier a lifecycle tool needs \u2014 the same one ${mcpMetaToolNames.discovery} and ${mcpMetaToolNames.invocation} address \u2014 or to check a connector after installing or authenticating. Read-only and never needs the user's permission.`,
      parameters: serverStatusParameters,
      execute: async (_ctx, args, deps) => {
        const installed = await deps.listInstalled();
        const serverId = args.server_id?.trim();
        if (serverId != null && serverId.length > 0) {
          const rows = resolveMcpServerRowsByIdentifierOrLegacyId(installed, serverId);
          if (rows.length === 0) {
            return `No installed MCP server "${serverId}". Omit server_id to list every server with its identifier.`;
          }
          return rows.map(describeInstalled).join("\n");
        }
        return describeInstalledList(installed);
      }
    }),
    defineCommunicateTool(management, {
      id: "SET_MCP_INSTRUCTIONS",
      name: "SetMcpInstructions",
      description: `Set (or clear) an installed connector's custom instructions \u2014 the guidance you follow whenever you use that server (e.g. "Reply in threads on Slack"). Use this when the user tells you how they want a connector used, so the preference persists across turns. Pass an empty string to clear it and fall back to the connector's default. This changes a saved preference, not the connection (no OAuth needed); the current value shows in GetMcpServerStatus when it's been customized.`,
      parameters: setInstructionsParameters,
      execute: guardMutation(async (_ctx, args, deps) => {
        const resolution = await resolveServerId(deps, args.server_id);
        if (resolution.kind !== "resolved") {
          return describeServerIdResolutionFailure(args.server_id, resolution);
        }
        const servers = await deps.setInstructions({
          serverId: resolution.serverId,
          instructions: args.instructions
        });
        const action = args.instructions.trim().length === 0 ? "Cleared" : "Updated";
        return [
          `${action} custom instructions for MCP server ${args.server_id}.`,
          describeInstalledList(servers)
        ].join("\n");
      })
    }),
    defineCommunicateTool(management, {
      id: "RESTART_MCP_SERVERS",
      name: "RestartMcpServers",
      description: "Restart (reconnect) the installed MCP servers \u2014 useful when a server is stuck, errored, or you just finished authenticating one. Confirm with the user first if a server is mid-task.",
      parameters: restartMcpServersParameters,
      execute: guardMutation(async (_ctx, _args, deps) => {
        const servers = await deps.restart();
        return ["Restarted MCP servers.", describeInstalledList(servers)].join("\n");
      })
    }),
    ...multiAccount ? [
      defineCommunicateTool(management, {
        id: "AUTHENTICATE_MCP_SERVER",
        name: "AuthenticateMcpServer",
        description: AUTHENTICATE_MCP_SERVER_DESCRIPTION,
        parameters: authenticateMultiAccountParameters,
        describeActivity: (args) => ({ detail: args.server_id }),
        execute: guardMutation(async (_ctx, args, deps) => {
          const resolution = await resolveServerId(deps, args.server_id);
          if (resolution.kind !== "resolved") {
            return describeServerIdResolutionFailure(args.server_id, resolution);
          }
          const builtinRefusal = describeBuiltinScmAuthRefusal(resolution);
          if (builtinRefusal != null) return builtinRefusal;
          const requestingAgentId = getRequestingAgentId?.() ?? void 0;
          const result = await deps.authenticate(
            resolution.serverId,
            decodeMcpAccountLabelArgument(args.account_label),
            {
              forceReauth: args.force_reauth === true,
              ...requestingAgentId == null ? {} : { requestingAgentId }
            }
          );
          return emitAndDescribeAuthResult(
            result,
            args.force_reauth === true,
            resolution.serverId,
            emitConnectorCard
          );
        })
      }),
      defineCommunicateTool(management, {
        id: "REMOVE_MCP_ACCOUNT",
        name: "RemoveMcpAccount",
        description: "Remove ONE account from an MCP server: the account and its credential are deleted, while the server and its other accounts stay. This is destructive \u2014 confirm with the user via a question widget before calling it. To remove a whole custom server (every account), use UninstallMcpServer; to remove a server's whole plugin (every connector, skill, and account), use UninstallPlugin.",
        parameters: accountLifecycleParameters,
        execute: guardMutation(async (_ctx, args, deps) => {
          const accountKey = decodeMcpAccountLabelArgument(args.account_label);
          const resolution = await resolveServerId(deps, args.server_id);
          if (resolution.kind !== "resolved") {
            return describeServerIdResolutionFailure(args.server_id, resolution);
          }
          const servers = await deps.removeAccount({
            serverId: resolution.serverId,
            accountKey
          });
          return [
            `Removed account "${formatMcpAccountLabelForPrompt(accountKey)}" from MCP server ${args.server_id}.`,
            describeInstalledList(servers)
          ].join("\n");
        })
      }),
      defineCommunicateTool(management, {
        id: "RENAME_MCP_ACCOUNT",
        name: "RenameMcpAccount",
        description: `Rename one of an MCP server's accounts (change its label). The account's server identifier changes with the label at the next listing, so after renaming, re-run GetMcpServerStatus (or ${mcpMetaToolNames.discovery}) before calling that account's tools again \u2014 stale identifiers fail cleanly. Confirm with a question widget first.`,
        parameters: renameAccountParameters,
        execute: guardMutation(async (_ctx, args, deps) => {
          const accountKey = decodeMcpAccountLabelArgument(args.account_label);
          const newAccountKey = decodeMcpAccountLabelArgument(args.new_account_label);
          const resolution = await resolveServerId(deps, args.server_id);
          if (resolution.kind !== "resolved") {
            return describeServerIdResolutionFailure(args.server_id, resolution);
          }
          const servers = await deps.renameAccount({
            serverId: resolution.serverId,
            accountKey,
            newAccountKey
          });
          return [
            `Renamed account "${formatMcpAccountLabelForPrompt(accountKey)}" to "${formatMcpAccountLabelForPrompt(newAccountKey)}" on MCP server ${args.server_id}.`,
            describeInstalledList(servers)
          ].join("\n");
        })
      })
    ] : [
      defineCommunicateTool(management, {
        id: "AUTHENTICATE_MCP_SERVER",
        name: "AuthenticateMcpServer",
        description: AUTHENTICATE_MCP_SERVER_DESCRIPTION,
        parameters: authenticateParameters,
        describeActivity: (args) => ({ detail: args.server_id }),
        execute: guardMutation(async (_ctx, args, deps) => {
          const resolution = await resolveServerId(deps, args.server_id);
          if (resolution.kind !== "resolved") {
            return describeServerIdResolutionFailure(args.server_id, resolution);
          }
          const builtinRefusal = describeBuiltinScmAuthRefusal(resolution);
          if (builtinRefusal != null) return builtinRefusal;
          const requestingAgentId = getRequestingAgentId?.() ?? void 0;
          const result = await deps.authenticate(resolution.serverId, "default", {
            forceReauth: args.force_reauth === true,
            ...requestingAgentId == null ? {} : { requestingAgentId }
          });
          return emitAndDescribeAuthResult(
            result,
            args.force_reauth === true,
            resolution.serverId,
            emitConnectorCard
          );
        })
      })
    ]
  ];
}

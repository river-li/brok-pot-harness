init_errors();
var BOT_SECRET_PUT_TIMEOUT_MS = 3e4;
async function carryBoxSecretsToBot(deps, args) {
  const card = await deps.readCard(args.names);
  return carrySecretsToGrokBot(
    {
      reveal: async (name17) => card.get(name17) ?? null,
      put: (serverId, secret) => deps.client.putGrokBotSecret(
        { id: serverId, ...secret },
        { timeoutMs: BOT_SECRET_PUT_TIMEOUT_MS }
      ),
      reportFailure: (error42) => deps.log(`box secrets: carry to bot ${args.serverId} failed (${errorLogTag(error42)})`)
    },
    args
  );
}

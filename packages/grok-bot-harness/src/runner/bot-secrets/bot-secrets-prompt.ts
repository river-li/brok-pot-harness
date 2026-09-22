var DESCRIPTION_MAX_LENGTH = 500;
function renderBotSecretsSection(secrets) {
  if (secrets === void 0 || secrets.length === 0) return null;
  const entries = [...secrets].sort((a, b2) => a.name.localeCompare(b2.name)).map((secret) => {
    const description9 = clampLine(secret.description, DESCRIPTION_MAX_LENGTH);
    return description9.length === 0 ? `- ${secret.name}` : `- ${secret.name}: ${description9}`;
  });
  return [
    "## Bot secrets",
    'Your owner configured these credentials for you. Each is set as an environment variable on your Shell commands (foreground and background) and nowhere else: not in files on the box, not in other tools, and not visible to you. Use them by name, e.g. `curl -H "Authorization: Bearer $NAME"`.',
    ...entries,
    "Never print, echo, or write a secret's value anywhere; any output containing one shows [REDACTED], so do not try to verify a value by looking at it. If a task needs a credential that is not listed here, do not ask for it as a personal secret and do not ask anyone to paste a token. In the owner's Grok Bot app DM, request it with secret-request so it is saved on this bot. Anywhere else, including Slack, tell the owner to continue in the Grok Bot app or add it in the bot's Secrets settings."
  ].join("\n");
}

var GROK_BOT_SECRET_NAME_MAX_LENGTH = 128;
var GROK_BOT_SECRET_VALUE_MIN_LENGTH = 8;
var GROK_BOT_SECRET_VALUE_MAX_KIB = 4;
var GROK_BOT_SECRET_VALUE_MAX_BYTES = GROK_BOT_SECRET_VALUE_MAX_KIB * 1024;
var SECRET_NAME_PATTERN = /^[A-Z][A-Z0-9_]*$/;
var RESERVED_EXACT_NAMES = /* @__PURE__ */ new Set([
  "PATH",
  "HOME",
  "USER",
  "SHELL",
  "TERM",
  "PWD",
  "DISPLAY",
  "HTTP_PROXY",
  "HTTPS_PROXY",
  "ALL_PROXY",
  "NO_PROXY"
]);
var RESERVED_NAME_PREFIXES = ["LD_", "CURSOR_", "CLOUD_AGENT_", "SAND_"];
var CURSOR_SANDBOX_ENV_NAME_PATTERN2 = /CURSOR_SANDBOX/i;
function validateGrokBotSecretName(name17) {
  if (name17.length === 0) return { kind: "empty" };
  if (name17.length > GROK_BOT_SECRET_NAME_MAX_LENGTH) return { kind: "long" };
  if (!SECRET_NAME_PATTERN.test(name17)) {
    return { kind: "format" };
  }
  if (RESERVED_EXACT_NAMES.has(name17)) {
    return { kind: "reserved-name", name: name17 };
  }
  const reservedPrefix = RESERVED_NAME_PREFIXES.find((prefix) => name17.startsWith(prefix));
  if (reservedPrefix !== void 0) {
    return { kind: "reserved-prefix", prefix: reservedPrefix };
  }
  if (CURSOR_SANDBOX_ENV_NAME_PATTERN2.test(name17)) return { kind: "reserved-sandbox" };
  return null;
}
function validateGrokBotSecretValue(value) {
  if (value.length === 0) return { kind: "empty" };
  if (value.length < GROK_BOT_SECRET_VALUE_MIN_LENGTH) return { kind: "short" };
  if (new TextEncoder().encode(value).byteLength > GROK_BOT_SECRET_VALUE_MAX_BYTES) {
    return { kind: "long" };
  }
  return null;
}
async function carrySecretsToGrokBot(deps, args) {
  const results = [];
  for (const name17 of new Set(args.names)) {
    results.push({ name: name17, outcome: await carryOneSecret(deps, { serverId: args.serverId, name: name17 }) });
  }
  return results;
}
async function carryOneSecret(deps, { serverId, name: name17 }) {
  if (validateGrokBotSecretName(name17) !== null) return "invalid-name";
  const value = await deps.reveal(name17);
  if (value === null) return "missing";
  if (validateGrokBotSecretValue(value.trim()) !== null) return "invalid-value";
  try {
    await deps.put(serverId, { name: name17, description: "", value });
    return "copied";
  } catch (error42) {
    deps.reportFailure(error42);
    return "failed";
  }
}

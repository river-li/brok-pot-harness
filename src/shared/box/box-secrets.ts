init_cloud_agent();
init_env_var_names();
init_locale();
var MAX_BOX_SECRET_COUNT = 100;
var MAX_BOX_SECRET_VALUE_LENGTH = 32 * 1024;
var MAX_BOX_SECRETS_TOTAL_LENGTH = 96 * 1024;
function validateBoxSecrets(secrets, locale = DEFAULT_LOCALE) {
  const keys = Object.keys(secrets);
  if (keys.length > MAX_BOX_SECRET_COUNT) {
    return `Too many secrets (max ${MAX_BOX_SECRET_COUNT})`;
  }
  let totalLength = 0;
  for (const key of keys) {
    const keyError = validateBoxSecretKey(key);
    if (keyError != null) return keyError;
    const value = secrets[key] ?? "";
    if (value.length > MAX_BOX_SECRET_VALUE_LENGTH) {
      const BOX_SECRET_VALUE_TOO_LARGE_MESSAGE = `The value of ${key} is too large (max ${MAX_BOX_SECRET_VALUE_LENGTH.toLocaleString(locale)} characters)`;
      return BOX_SECRET_VALUE_TOO_LARGE_MESSAGE;
    }
    totalLength += key.length + value.length;
  }
  if (totalLength > MAX_BOX_SECRETS_TOTAL_LENGTH) {
    return "The combined size of all secrets is too large";
  }
  return null;
}
function buildBoxSecretsEnv(secrets) {
  const names3 = Object.keys(secrets).sort();
  if (names3.length === 0) return {};
  const env = {};
  for (const name17 of names3) env[name17] = secrets[name17] ?? "";
  env[CLOUD_AGENT_INJECTED_SECRET_NAMES_ENV_VAR] = names3.join(",");
  return env;
}

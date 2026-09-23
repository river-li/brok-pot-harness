var SAND_LESS_SUBAGENT_FANOUT_EXPERIMENT_NAME = "sand_less_subagent_fanout";
var GROK_BOT_BROWSER_USE_PLAYWRIGHT_EXPERIMENT_NAME = "grok_bot_browser_use_playwright_ab";
var SAND_MEMORY_FACTS_IN_USER_INFO_EXPERIMENT_NAME = "sand_memory_facts_in_user_info_ab";
var SAND_USAGE_WARNING_EXPERIMENT_NAME = "sand_usage_warning_policy_2026_08";
var SAND_GROUP_CHAT_DISCOURAGEMENT_EXPERIMENT_NAME = "sand_group_chat_discouragement_2026_09";
var SAND_ONBOARDING_JOB_ROLE_EXPERIMENT_NAME = "sand_onboarding_job_role";
var SAND_COMPUTER_USE_MODEL_CONFIG_NAME = "sand_computer_use_playwright_config";
var SAND_BROWSER_USE_MODEL_CONFIG_NAME = "sand_browser_use_model";
var SandConfigParseError = class extends Error {
  constructor(path31, options2) {
    super(`config value rejected at ${path31}`, options2);
    this.path = path31;
    this.name = "SandConfigParseError";
  }
  path;
};
var SAND_CONFIG_ROOT_PATH = "$";
function issuePath(path31) {
  return path31.length === 0 ? SAND_CONFIG_ROOT_PATH : path31.join(".");
}
function schemaConfigEntry(fallbackValues, schema2) {
  return {
    fallbackValues,
    parse: (value) => {
      const result = schema2.safeParse(
        isUnknownRecord(value) ? { ...fallbackValues, ...value } : value
      );
      if (!result.success) {
        throw new SandConfigParseError(issuePath(result.error.issues[0]?.path ?? []));
      }
      return { ...fallbackValues, ...result.data };
    }
  };
}
function fieldParsersConfigEntry(fallbackValues, parsers) {
  return {
    fallbackValues,
    parse: (value) => {
      if (!isUnknownRecord(value)) throw new SandConfigParseError(SAND_CONFIG_ROOT_PATH);
      const merged = { ...fallbackValues, ...value };
      const parsed2 = Object.fromEntries(
        Object.entries(parsers).map(([field, parseField]) => {
          try {
            return [field, parseField(merged[field])];
          } catch (error42) {
            throw new SandConfigParseError(field, { cause: error42 });
          }
        })
      );
      return { ...fallbackValues, ...parsed2 };
    }
  };
}
function tableOf(keys, build2) {
  return Object.fromEntries(keys.map((key) => [key, build2(key)]));
}
var SAND_EXPERIMENT_REGISTRY = {
  FLAGS,
  EXPERIMENTS: tableOf(
    EXPERIMENT_NAMES,
    (name17) => fieldParsersConfigEntry(EXPERIMENTS[name17].fallbackValues, EXPERIMENTS[name17].parseValue)
  ),
  DYNAMIC_CONFIGS: tableOf(
    DYNAMIC_CONFIGS_KEYS,
    (name17) => schemaConfigEntry(DYNAMIC_CONFIGS[name17].fallbackValues, DYNAMIC_CONFIG_SCHEMAS[name17])
  )
};

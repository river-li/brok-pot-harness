function expandPluginVariables(value, pluginPath) {
  return value.replace(/\$\{CLAUDE_PLUGIN_ROOT\}/g, () => pluginPath).replace(/\$\{CURSOR_PLUGIN_ROOT\}/g, () => pluginPath);
}

function normalizePluginRef(value) {
  return value.trim().toLowerCase();
}
function pluginMatchesRef(source, ref) {
  const key = normalizePluginRef(ref.pluginId);
  if (key.length === 0) return false;
  return normalizePluginRef(source.pluginId) === key || normalizePluginRef(source.name) === key || normalizePluginRef(source.displayName) === key;
}
function packedName(source, pluginId) {
  const displayName2 = source.displayName.trim();
  if (displayName2.length > 0) return displayName2;
  const kebabName = source.name.trim();
  if (kebabName.length > 0) return kebabName;
  return pluginId;
}
function toPackedPlugin(source) {
  const pluginId = source.pluginId.trim();
  if (pluginId.length === 0) return null;
  const name17 = packedName(source, pluginId);
  const description9 = source.description.trim();
  if (description9.length > 0) return { name: name17, pluginId, description: description9 };
  return { name: name17, pluginId };
}
function packPluginsFromInstalled(installed, selected) {
  const packable = installed.filter(
    (source) => source.isInstalled && source.pluginId.trim().length > 0
  );
  const used = /* @__PURE__ */ new Set();
  const packed = [];
  for (const ref of selected) {
    const match2 = packable.find((source) => !used.has(source) && pluginMatchesRef(source, ref));
    if (match2 == null) continue;
    const plugin = toPackedPlugin(match2);
    if (plugin == null) continue;
    used.add(match2);
    packed.push(plugin);
  }
  return packed;
}
function packPluginsIntoRecipe(recipe, installed) {
  return { ...recipe, plugins: packPluginsFromInstalled(installed, recipe.plugins) };
}

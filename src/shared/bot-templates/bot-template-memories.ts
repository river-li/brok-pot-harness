var MEMORY_EPISODE_PREFIX2 = "[episode] ";
var MEMORY_NOTE_PREFIX2 = "[note] ";
var MEMORY_MAX_CONTENT_LENGTH2 = 500;
var BOT_TEMPLATE_MEMORY_EXPORT_LIMIT = 32;
function normalizeMemoryContent2(raw) {
  return raw.replace(/\s+/g, " ").trim().slice(0, MEMORY_MAX_CONTENT_LENGTH2);
}
function memoryDedupeKey2(content) {
  return normalizeMemoryContent2(content).toLowerCase();
}
function isExcludedPrefix(content) {
  const trimmed = content.trim();
  return trimmed.toLowerCase().startsWith(MEMORY_EPISODE_PREFIX2) || trimmed.toLowerCase().startsWith(MEMORY_NOTE_PREFIX2);
}
function isExportableMemoryContent(content) {
  const normalized = normalizeMemoryContent2(content);
  return normalized.length > 0 && !isExcludedPrefix(normalized);
}
function packedKind(kind) {
  return kind === "profile" || kind === "log" ? kind : void 0;
}
function sanitizePackedMemories(selected) {
  const seen = /* @__PURE__ */ new Set();
  const packed = [];
  for (const row of selected) {
    if (packed.length >= BOT_TEMPLATE_MEMORY_EXPORT_LIMIT) break;
    const content = normalizeMemoryContent2(row.content);
    if (!isExportableMemoryContent(content)) continue;
    const key = memoryDedupeKey2(content);
    if (seen.has(key)) continue;
    seen.add(key);
    const createdAt = row.createdAt?.trim();
    const kind = packedKind(row.kind);
    packed.push({
      content,
      ...createdAt != null && createdAt.length > 0 ? { createdAt } : {},
      ...kind == null ? {} : { kind }
    });
  }
  return packed;
}
function packMemoriesIntoRecipe(recipe) {
  return { ...recipe, memory: sanitizePackedMemories(recipe.memory) };
}

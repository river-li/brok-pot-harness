var MEMORY_DIRNAME = "memory";
var MEMORY_PROFILE_FILENAME = "profile.md";
var MEMORY_LOG_DIRNAME = "log";
var USER_MEMORY_DIRNAME = "user-memory";
var USER_MEMORY_SHARD_PARENT_DIRNAME = "by-agent";
function getAgentMemoryDir(agentDir) {
  return (0, import_node_path120.join)(agentDir, MEMORY_DIRNAME);
}
function getUserMemoryDir(sandRoot) {
  return (0, import_node_path120.join)(sandRoot, USER_MEMORY_DIRNAME);
}
function getUserMemoryShardsDir(sandRoot) {
  return (0, import_node_path120.join)(getUserMemoryDir(sandRoot), USER_MEMORY_SHARD_PARENT_DIRNAME);
}
function getUserMemoryShardDir(sandRoot, agentId) {
  return (0, import_node_path120.join)(getUserMemoryShardsDir(sandRoot), agentId);
}
var MEMORY_PROFILE_HEADER = [
  "# About the user",
  "",
  "<!-- Enduring facts: who the user is, how to address them, lasting preferences.",
  "     Kept in mind every turn. Safe to read, grep, and edit.",
  '     One fact per line, as "- (YYYY-MM-DD) <fact>". -->',
  ""
].join("\n");
var MEMORY_LOG_HEADER = [
  "# Memory log",
  "",
  '<!-- Dated facts, one per line as "- (YYYY-MM-DD) <fact>". Safe to read, grep, and edit. -->',
  ""
].join("\n");
var MEMORY_FACT_LINE = /^-\s+\((\d{4}-\d{2}-\d{2})\)\s+(.+?)\s*$/;
function memoryIdFor(content) {
  return (0, import_node_crypto56.createHash)("sha1").update(memoryDedupeKey(content)).digest("hex").slice(0, 16);
}
function serializeMemoryFactLine(content, createdAt) {
  return `- (${formatMemoryDate(createdAt)}) ${content}`;
}
var MEMORY_DREAMING_DIRNAME = ".dreaming";
var MEMORY_EVIDENCE_DIRNAME = "evidence";
var MEMORY_EVIDENCE_FILE = /^([0-9a-f-]{36})\.json$/;
function getMemoryEvidenceDir(memoryDir) {
  return (0, import_node_path120.join)(memoryDir, MEMORY_DREAMING_DIRNAME, MEMORY_EVIDENCE_DIRNAME);
}
function memoryEvidenceFileName(id) {
  return `${id}.json`;
}
function memoryEvidenceIdFromFileName(name17) {
  return MEMORY_EVIDENCE_FILE.exec(name17)?.[1] ?? null;
}
var memoryEvidenceFileSchema = external_exports.object({
  id: external_exports.string().refine((id) => memoryEvidenceIdFromFileName(memoryEvidenceFileName(id)) !== null),
  occurredAt: external_exports.number().finite().nonnegative(),
  user: external_exports.string(),
  assistant: external_exports.string()
});
function parseMemoryEvidenceFile(raw) {
  let parsed2;
  try {
    parsed2 = JSON.parse(raw);
  } catch {
    return null;
  }
  const evidence = memoryEvidenceFileSchema.safeParse(parsed2);
  if (!evidence.success) return null;
  const { id, occurredAt, user, assistant } = evidence.data;
  return {
    id,
    occurredAt,
    user: boundMemoryEvidenceText(user),
    assistant: boundMemoryEvidenceText(assistant)
  };
}
function parseMemoryFacts(raw, kind, base, path31) {
  const facts = [];
  let order = base;
  for (const [lineIndex, line] of raw.split("\n").entries()) {
    const match2 = MEMORY_FACT_LINE.exec(line);
    if (match2 == null) continue;
    const content = normalizeMemoryContent(match2[2] ?? "");
    if (content.length === 0) continue;
    const createdAt = Date.parse(`${match2[1]}T00:00:00Z`);
    facts.push({
      id: memoryIdFor(content),
      content,
      createdAt: Number.isFinite(createdAt) ? createdAt : 0,
      kind,
      order: order++,
      path: path31,
      firstLine: lineIndex,
      lastLine: lineIndex
    });
  }
  return facts;
}
function memoryFactsByMostRecent(a, b2) {
  if (b2.createdAt !== a.createdAt) return b2.createdAt - a.createdAt;
  return b2.order - a.order;
}
function memoryFactToRecord({
  id,
  content,
  createdAt,
  kind
}) {
  return { id, content, createdAt, kind };
}

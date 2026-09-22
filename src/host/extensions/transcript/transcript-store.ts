/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/host/extensions/transcript/transcript-store.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
function materialize2(entries) {
  const byId = /* @__PURE__ */ new Map();
  for (const entry of entries) {
    if (!byId.has(entry.id)) byId.set(entry.id, entry);
  }
  return { kind: "materialized", entries, byId };
}
var mirror = materialize2([]);
function materialized() {
  if (mirror.kind === "deferred") mirror = materialize2([...mirror.read()]);
  return mirror;
}
function getTranscript() {
  return materialized().entries;
}
function findEntry(id) {
  return materialized().byId.get(id);
}
function findEntryWhere(matches) {
  return materialized().entries.find(matches);
}
function setTranscript(entries) {
  mirror = materialize2([...entries]);
}
function setTranscriptSource(read) {
  mirror = { kind: "deferred", read };
}
function appendEntry(entry) {
  const { entries, byId } = materialized();
  if (!byId.has(entry.id)) byId.set(entry.id, entry);
  mirror = { kind: "materialized", entries: [...entries, entry], byId };
}
function updateEntry(id, update) {
  const { entries, byId } = materialized();
  let first = null;
  let updated = null;
  const next = entries.map((entry) => {
    if (entry.id !== id) return entry;
    updated = update(entry);
    first ??= updated;
    return updated;
  });
  if (first == null || updated == null) return null;
  byId.set(id, first);
  mirror = { kind: "materialized", entries: next, byId };
  return updated;
}
function removeEntry(id) {
  const { entries, byId } = materialized();
  const next = entries.filter((entry) => entry.id !== id);
  if (next.length === entries.length) return false;
  byId.delete(id);
  mirror = { kind: "materialized", entries: next, byId };
  return true;
}
function clearTranscript() {
  mirror = materialize2([]);
}


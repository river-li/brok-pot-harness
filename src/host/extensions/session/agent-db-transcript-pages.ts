/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/host/extensions/session/agent-db-transcript-pages.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
function readTranscriptPage(statements, query) {
  const beforeSeq = query.beforeSeq ?? null;
  const sinceMs = query.sinceMs ?? null;
  const rows = statements.listTranscriptPage.all(
    beforeSeq,
    beforeSeq,
    sinceMs,
    sinceMs,
    query.untilMs,
    query.limit + 1
  );
  const hasMore = rows.length > query.limit;
  const selected = rows.slice(0, query.limit);
  const entries = [];
  for (const row of selected.toReversed()) {
    if (typeof row.entry !== "string") continue;
    const entry = parseTranscriptEntry(row.entry) ?? parseSandSpendInitiationEntry(row.entry);
    if (entry != null) entries.push(entry);
  }
  const oldestSeq = selected.at(-1)?.seq;
  return {
    entries,
    nextBeforeSeq: hasMore && typeof oldestSeq === "number" ? oldestSeq : void 0
  };
}
function readTranscriptWindow(statements, query, threadCountsFor) {
  const beforeSeq = typeof query.beforeSeq === "number" && Number.isFinite(query.beforeSeq) ? query.beforeSeq : null;
  const limit = Number.isInteger(query.limit) && query.limit > 0 ? Math.min(query.limit, 5e3) : 500;
  const rows = statements.listTranscriptWindow.all(beforeSeq, beforeSeq, limit + 1);
  const hasMore = rows.length > limit;
  const selected = rows.slice(0, limit);
  const entries = [];
  for (const row of selected.toReversed()) {
    if (typeof row.entry !== "string") continue;
    const entry = parseTranscriptEntry(row.entry);
    if (entry != null) entries.push(entry);
  }
  const oldestSeq = selected.at(-1)?.seq;
  return {
    entries,
    nextBeforeSeq: hasMore && typeof oldestSeq === "number" ? oldestSeq : void 0,
    threadCounts: threadCountsFor(entries)
  };
}
function readTranscriptTail(statements, query) {
  const beforeSeq = typeof query.beforeSeq === "number" && Number.isFinite(query.beforeSeq) ? query.beforeSeq : null;
  const limit = Number.isInteger(query.limit) && query.limit > 0 ? Math.min(query.limit, 5e3) : 500;
  const rows = statements.listTranscriptTail.all(beforeSeq, beforeSeq, limit + 1);
  const hasMore = rows.length > limit;
  const selected = rows.slice(0, limit);
  const entries = [];
  for (const row of selected.toReversed()) {
    if (typeof row.entry !== "string") continue;
    const entry = parseTranscriptEntry(row.entry);
    if (entry != null) entries.push(entry);
  }
  const oldestSeq = selected.at(-1)?.seq;
  return {
    entries,
    nextBeforeSeq: hasMore && typeof oldestSeq === "number" ? oldestSeq : void 0
  };
}


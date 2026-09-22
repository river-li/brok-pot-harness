var INDEXED_BODY_MAX_CHARS = 2e4;
var FTS_QUERY_MAX_TERMS = 8;
var SNIPPET_CONTEXT_TOKENS = 16;
var META_RECONCILE_DONE = "reconcile_done";
var ATTACHMENT_KINDS = new Set(SAND_ATTACHMENT_KINDS);
function parseAttachmentKind(kind) {
  return ATTACHMENT_KINDS.has(kind) ? kind : "file";
}
var CORE_SCHEMA = `
CREATE TABLE IF NOT EXISTS meta (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
) STRICT;
CREATE TABLE IF NOT EXISTS agents (
  agent_id TEXT PRIMARY KEY,
  fingerprint TEXT NOT NULL
) STRICT;
CREATE TABLE IF NOT EXISTS messages (
  id INTEGER PRIMARY KEY,
  agent_id TEXT NOT NULL,
  entry_id TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  timestamp_ms INTEGER NOT NULL,
  body TEXT NOT NULL,
  UNIQUE(agent_id, entry_id)
) STRICT;
CREATE INDEX IF NOT EXISTS messages_agent_recency
  ON messages(agent_id, timestamp_ms DESC);
CREATE TABLE IF NOT EXISTS media (
  id INTEGER PRIMARY KEY,
  agent_id TEXT NOT NULL,
  entry_id TEXT NOT NULL,
  file_name TEXT NOT NULL,
  ext TEXT NOT NULL,
  mime TEXT,
  kind TEXT NOT NULL,
  timestamp_ms INTEGER NOT NULL,
  width INTEGER,
  height INTEGER,
  UNIQUE(agent_id, entry_id)
) STRICT;
CREATE INDEX IF NOT EXISTS media_recency ON media(timestamp_ms DESC);
`;
var FTS_SCHEMA = `
CREATE VIRTUAL TABLE IF NOT EXISTS messages_fts USING fts5(
  body,
  content='messages',
  content_rowid='id',
  tokenize='unicode61 remove_diacritics 2',
  prefix='2 3'
);
CREATE TRIGGER IF NOT EXISTS messages_fts_insert AFTER INSERT ON messages BEGIN
  INSERT INTO messages_fts(rowid, body) VALUES (new.id, new.body);
END;
CREATE TRIGGER IF NOT EXISTS messages_fts_delete AFTER DELETE ON messages BEGIN
  INSERT INTO messages_fts(messages_fts, rowid, body)
    VALUES ('delete', old.id, old.body);
END;
CREATE TRIGGER IF NOT EXISTS messages_fts_update AFTER UPDATE ON messages BEGIN
  INSERT INTO messages_fts(messages_fts, rowid, body)
    VALUES ('delete', old.id, old.body);
  INSERT INTO messages_fts(rowid, body) VALUES (new.id, new.body);
END;
CREATE VIRTUAL TABLE IF NOT EXISTS media_fts USING fts5(
  file_name,
  content='media',
  content_rowid='id',
  tokenize='unicode61 remove_diacritics 2',
  prefix='2 3'
);
CREATE TRIGGER IF NOT EXISTS media_fts_insert AFTER INSERT ON media BEGIN
  INSERT INTO media_fts(rowid, file_name) VALUES (new.id, new.file_name);
END;
CREATE TRIGGER IF NOT EXISTS media_fts_delete AFTER DELETE ON media BEGIN
  INSERT INTO media_fts(media_fts, rowid, file_name)
    VALUES ('delete', old.id, old.file_name);
END;
CREATE TRIGGER IF NOT EXISTS media_fts_update AFTER UPDATE ON media BEGIN
  INSERT INTO media_fts(media_fts, rowid, file_name)
    VALUES ('delete', old.id, old.file_name);
  INSERT INTO media_fts(rowid, file_name) VALUES (new.id, new.file_name);
END;
`;
function isFts5Available() {
  let db;
  try {
    db = new import_node_sqlite2.DatabaseSync(":memory:");
    db.exec("CREATE VIRTUAL TABLE fts5_probe USING fts5(x)");
    return true;
  } catch (error) {
    reportFallback("search_index_db", error);
    return false;
  } finally {
    db?.close();
  }
}
function openSearchIndexDb(dbPath) {
  const db = new import_node_sqlite2.DatabaseSync(dbPath);
  try {
    applyStorePragmas(db, { incrementalAutoVacuum: true });
    return db;
  } catch (error) {
    try {
      db.close();
    } catch {
    }
    throw error;
  }
}
function openSearchIndexReadDb(dbPath) {
  const db = openSearchIndexDb(dbPath);
  db.exec("PRAGMA query_only = ON");
  return db;
}
function ensureSearchIndexSchema(db, isFtsEnabled) {
  db.exec(CORE_SCHEMA);
  if (isFtsEnabled) db.exec(FTS_SCHEMA);
}
function writeReconcileDone(db) {
  db.prepare(
    "INSERT INTO meta (key, value) VALUES (?, '1') ON CONFLICT(key) DO UPDATE SET value = '1'"
  ).run(META_RECONCILE_DONE);
}
function deriveMessageRow(entry) {
  if (isHiddenOutboundAgentPeerMessageEntry(entry)) return null;
  const body = entrySearchText(entry).trim();
  if (body.length === 0) return null;
  return {
    entryId: entry.id,
    role: entry.kind === "message" ? entry.role : "assistant",
    timestampMs: wholeMs(entry.timestampMs),
    body: body.slice(0, INDEXED_BODY_MAX_CHARS)
  };
}
function wholeMs(value) {
  return typeof value === "number" && Number.isFinite(value) ? Math.round(value) : 0;
}
function wholeDimension(value) {
  return typeof value === "number" && Number.isFinite(value) ? Math.round(value) : null;
}
function mediaFileName(fileName, urlOrPath) {
  const trimmed = fileName?.trim();
  if (trimmed != null && trimmed.length > 0) return trimmed;
  let subject = urlOrPath;
  try {
    subject = new URL(urlOrPath).pathname;
  } catch {
  }
  try {
    subject = decodeURIComponent(subject);
  } catch {
  }
  return (0, import_node_path.basename)(subject);
}
function deriveMediaRow(entry) {
  let fileName;
  let urlOrPath;
  let width = null;
  let height = null;
  if (entry.kind === "user-attachment") {
    urlOrPath = entry.file_path;
    fileName = mediaFileName(entry.file_name, urlOrPath);
    width = wholeDimension(entry.width);
    height = wholeDimension(entry.height);
  } else if (entry.kind === "send-message" && entry.message.type === "attachment") {
    urlOrPath = entry.message.url;
    fileName = mediaFileName(entry.message.file_name, urlOrPath);
  } else {
    return null;
  }
  if (fileName.length === 0) return null;
  const ext = (0, import_node_path.extname)(fileName).toLowerCase();
  const mime = imageMimeFromPath(fileName) ?? videoMimeFromPath(fileName) ?? audioMimeFromPath(fileName) ?? null;
  return {
    entryId: entry.id,
    fileName,
    ext,
    mime,
    kind: classifyAttachment({ fileName, urlOrPath }),
    timestampMs: wholeMs(entry.timestampMs),
    width,
    height
  };
}
function searchTerms(query) {
  return query.normalize("NFKC").trim().split(/\s+/).filter((term) => term.length > 0).slice(0, FTS_QUERY_MAX_TERMS);
}
function buildFtsMatchQuery(query) {
  const terms = searchTerms(query);
  if (terms.length === 0) return null;
  return terms.map((term) => `"${term.replaceAll('"', '""')}"*`).join(" ");
}
function termConjunction(column, terms) {
  return terms.map(() => `instr(lower(${column}), lower(?)) > 0`).join(" AND ");
}
function flattenSnippet(text) {
  return text.replace(/\s+/g, " ").trim();
}
var EFFECTIVE_TIMESTAMP = `CASE
	WHEN m.timestamp_ms > 0 THEN m.timestamp_ms
	ELSE COALESCE(
		(SELECT MAX(m2.timestamp_ms) FROM messages m2 WHERE m2.agent_id = m.agent_id),
		0
	)
END`;
function messageMatchSql(rowSource, snippetColumn) {
  return `SELECT
			m.agent_id AS agentId,
			m.entry_id AS entryId,
			m.role AS role,
			matched.ts AS timestampMs,
			${snippetColumn} AS snippet
		 FROM (
			SELECT match_rowid, ts FROM (
				SELECT
					match_rowid,
					ts,
					ROW_NUMBER() OVER (
						PARTITION BY agent_id
						ORDER BY ts DESC
					) AS agent_rank
				FROM (${rowSource})
			)
			WHERE agent_rank <= ${AGENT_CONTENT_SEARCH_MAX_MATCHES_PER_AGENT}
			ORDER BY ts DESC
			LIMIT ?
		 ) AS matched
		 JOIN messages m ON m.id = matched.match_rowid`;
}
function collectMessageMatches(rows, snippetOf) {
  const results = [];
  for (const row of rows) {
    if (typeof row.agentId !== "string" || typeof row.entryId !== "string" || row.role !== "user" && row.role !== "assistant" || typeof row.timestampMs !== "number") {
      continue;
    }
    const snippet = snippetOf(row);
    if (snippet == null) continue;
    results.push({
      agentId: row.agentId,
      entryId: row.entryId,
      role: row.role,
      timestampMs: row.timestampMs,
      snippet
    });
  }
  return results;
}
function searchMessages(db, query, limit, isFtsEnabled) {
  if (limit <= 0) return [];
  if (!isFtsEnabled) return searchMessagesPlain(db, query, limit);
  const match = buildFtsMatchQuery(query);
  if (match == null) return [];
  const rows = db.prepare(
    `${messageMatchSql(
      `SELECT
					messages_fts.rowid AS match_rowid,
					m.agent_id AS agent_id,
					${EFFECTIVE_TIMESTAMP} AS ts
				FROM messages_fts
				JOIN messages m ON m.id = messages_fts.rowid
				WHERE messages_fts MATCH ?`,
      `snippet(messages_fts, 0, '', '', '\u2026', ${SNIPPET_CONTEXT_TOKENS})`
    )}
			 JOIN messages_fts ON messages_fts.rowid = matched.match_rowid
			 WHERE messages_fts MATCH ?
			 ORDER BY matched.ts DESC`
  ).all(match, limit, match);
  return collectMessageMatches(
    rows,
    (row) => typeof row.snippet === "string" ? flattenSnippet(row.snippet) : null
  );
}
function searchMessagesPlain(db, query, limit) {
  const terms = searchTerms(query);
  if (terms.length === 0) return [];
  const rows = db.prepare(
    `${messageMatchSql(
      `SELECT
					m.id AS match_rowid,
					m.agent_id AS agent_id,
					${EFFECTIVE_TIMESTAMP} AS ts
				FROM messages m
				WHERE ${termConjunction("m.body", terms)}`,
      "m.body"
    )}
			 ORDER BY matched.ts DESC`
  ).all(...terms, limit);
  return collectMessageMatches(
    rows,
    (row) => typeof row.snippet === "string" ? plainSnippet(row.snippet, terms) : null
  );
}
function plainSnippet(body, terms) {
  for (const term of terms) {
    const snippet = buildContentSnippet(body, term.toLowerCase());
    if (snippet != null) return snippet;
  }
  const flat = flattenSnippet(body);
  const head = flat.slice(0, SNIPPET_CONTEXT_TOKENS * 8);
  return head.length < flat.length ? `${head}\u2026` : head;
}
var MEDIA_SELECT_COLUMNS = `
	md.agent_id AS agentId,
	md.entry_id AS entryId,
	md.file_name AS fileName,
	md.ext AS ext,
	md.mime AS mime,
	md.kind AS kind,
	md.timestamp_ms AS timestampMs,
	md.width AS width,
	md.height AS height`;
function mediaMatchRows(db, query, limit, isFtsEnabled) {
  if (isFtsEnabled) {
    const match = buildFtsMatchQuery(query);
    if (match == null) return browseMediaRows(db, limit);
    return db.prepare(
      `SELECT ${MEDIA_SELECT_COLUMNS}
				 FROM media_fts
				 JOIN media md ON md.id = media_fts.rowid
				 WHERE media_fts MATCH ?
				 ORDER BY md.timestamp_ms DESC
				 LIMIT ?`
    ).all(match, limit);
  }
  const terms = searchTerms(query);
  if (terms.length === 0) return browseMediaRows(db, limit);
  return db.prepare(
    `SELECT ${MEDIA_SELECT_COLUMNS}
			 FROM media md
			 WHERE ${termConjunction("md.file_name", terms)}
			 ORDER BY md.timestamp_ms DESC
			 LIMIT ?`
  ).all(...terms, limit);
}
function browseMediaRows(db, limit) {
  return db.prepare(
    `SELECT ${MEDIA_SELECT_COLUMNS}
			 FROM media md
			 ORDER BY md.timestamp_ms DESC
			 LIMIT ?`
  ).all(limit);
}
function searchMedia(db, query, limit, isFtsEnabled) {
  if (limit <= 0) return [];
  const rows = mediaMatchRows(db, query, limit, isFtsEnabled);
  const results = [];
  for (const row of rows) {
    if (typeof row.agentId !== "string" || typeof row.entryId !== "string" || typeof row.fileName !== "string" || typeof row.ext !== "string" || typeof row.kind !== "string" || typeof row.timestampMs !== "number") {
      continue;
    }
    results.push({
      agentId: row.agentId,
      entryId: row.entryId,
      fileName: row.fileName,
      ext: row.ext,
      mime: typeof row.mime === "string" ? row.mime : null,
      kind: parseAttachmentKind(row.kind),
      timestampMs: row.timestampMs,
      width: typeof row.width === "number" ? row.width : null,
      height: typeof row.height === "number" ? row.height : null
    });
  }
  return results;
}

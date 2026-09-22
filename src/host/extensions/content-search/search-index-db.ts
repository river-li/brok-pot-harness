/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/host/extensions/content-search/search-index-db.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/2
var import_node_sqlite3 = require("node:sqlite");

// @recovered-fragment 2/2
var SEARCH_INDEX_SCHEMA_VERSION = 1;
var SEARCH_INDEX_FILENAME = "search-index.db";
var META_RECONCILE_DONE = "reconcile_done";
var ATTACHMENT_KINDS = new Set(SAND_ATTACHMENT_KINDS);
var CORE_SCHEMA2 = `
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
    db = new import_node_sqlite3.DatabaseSync(":memory:");
    db.exec("CREATE VIRTUAL TABLE fts5_probe USING fts5(x)");
    return true;
  } catch (error42) {
    reportFallback("search_index_db", error42);
    return false;
  } finally {
    db?.close();
  }
}
function openSearchIndexDb(dbPath) {
  const db = new import_node_sqlite3.DatabaseSync(dbPath);
  try {
    applyStorePragmas(db, { incrementalAutoVacuum: true });
    return db;
  } catch (error42) {
    try {
      db.close();
    } catch {
    }
    throw error42;
  }
}
function ensureSearchIndexSchema(db, isFtsEnabled) {
  db.exec(CORE_SCHEMA2);
  if (isFtsEnabled) db.exec(FTS_SCHEMA);
}
function readSearchIndexFileMode(db) {
  const names3 = new Set(
    db.prepare("SELECT name FROM sqlite_master WHERE name IN ('meta', 'messages_fts')").all().map((row) => row.name)
  );
  if (!names3.has("meta")) return "fresh";
  return names3.has("messages_fts") ? "fts" : "plain";
}
function readSearchIndexSchemaVersion(db) {
  const row = db.prepare("PRAGMA user_version").get();
  return typeof row?.user_version === "number" ? row.user_version : 0;
}
function stampSearchIndexSchemaVersion(db) {
  db.exec(`PRAGMA user_version = ${SEARCH_INDEX_SCHEMA_VERSION}`);
}
function readReconcileDone(db) {
  const row = db.prepare("SELECT value FROM meta WHERE key = ?").get(META_RECONCILE_DONE);
  return row?.value === "1";
}


var WINDOW_ENTRY_FILTER_SQL = `json_extract(entry, '$.kind') != 'tool-call'
        AND COALESCE(json_extract(entry, '$.branched'), 0) != 1`;
var BRANCHED_ENTRY_FILTER_SQL = `COALESCE(json_extract(entry, '$.branched'), 0) = 1`;
var SCHEMA = `
CREATE TABLE IF NOT EXISTS kv (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
) STRICT;
-- Conversation blobs are owned by the agent's isolation worker in its own
-- conversation-blobs.db; nothing writes this table any more. It stays declared
-- so an agent restored from an offline or pre-worker box keeps its legacy blobs
-- readable: the worker ATTACHes store.db and adopts them once, and the salvage
-- path still copies these rows out of a corrupt store. Clearing the
-- conversation still truncates it so a legacy tree can never outlive the clear.
CREATE TABLE IF NOT EXISTS blobs (
  id TEXT PRIMARY KEY,
  data BLOB NOT NULL
) STRICT;
CREATE TABLE IF NOT EXISTS transcript_entries (
  seq INTEGER PRIMARY KEY,
  id TEXT NOT NULL UNIQUE,
  entry TEXT NOT NULL
) STRICT;
CREATE TABLE IF NOT EXISTS automation_completion_inbox (
  seq INTEGER PRIMARY KEY,
  id TEXT NOT NULL UNIQUE,
  text TEXT NOT NULL,
  attribution TEXT NOT NULL,
  acknowledged INTEGER NOT NULL DEFAULT 0 CHECK (acknowledged IN (0, 1))
) STRICT;
CREATE INDEX IF NOT EXISTS idx_transcript_window
  ON transcript_entries(seq, entry)
  WHERE ${WINDOW_ENTRY_FILTER_SQL};
CREATE INDEX IF NOT EXISTS idx_transcript_branched
  ON transcript_entries(seq, entry)
  WHERE ${BRANCHED_ENTRY_FILTER_SQL};
CREATE INDEX IF NOT EXISTS idx_automation_completion_inbox_pending
  ON automation_completion_inbox(seq)
  WHERE acknowledged = 0;
`;
var MAIN_TRANSCRIPT_PAGE_KINDS_SQL = MAIN_TRANSCRIPT_PAGE_KINDS.map((kind) => `'${kind}'`).join(
  ", "
);
var MAIN_TRANSCRIPT_MESSAGE_FILTER_SQL = `
        COALESCE(json_extract(entry, '$.branched'), 0) != 1
        AND (
          json_extract(entry, '$.kind') IN (${MAIN_TRANSCRIPT_PAGE_KINDS_SQL})
          OR (
            json_extract(entry, '$.kind') = 'message'
            AND (
              json_extract(entry, '$.role') = 'user'
              OR json_extract(entry, '$.fromAgent') IS NOT NULL
              OR json_extract(entry, '$.toAgent') IS NOT NULL
            )
          )
        )`;
var DIVIDER_ANCHOR_ENTRY_FILTER_SQL = `
        COALESCE(json_extract(entry, '$.branched'), 0) != 1
        AND (
          json_extract(entry, '$.kind') = 'send-message'
          OR (
            json_extract(entry, '$.kind') = 'message'
            AND (
              json_extract(entry, '$.fromAgent') IS NOT NULL
              OR json_extract(entry, '$.toAgent') IS NOT NULL
            )
          )
        )`;
function prepareStatements(db) {
  return {
    getKv: db.prepare("SELECT value FROM kv WHERE key = ?"),
    setKv: db.prepare(
      "INSERT INTO kv (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value"
    ),
    compareAndSetKv: db.prepare("UPDATE kv SET value = ? WHERE key = ? AND value = ?"),
    deleteKv: db.prepare("DELETE FROM kv WHERE key = ?"),
    listPendingAutomationCompletions: db.prepare(`
      SELECT id, text, attribution
      FROM automation_completion_inbox
      WHERE acknowledged = 0
      ORDER BY seq
      LIMIT ?
    `),
    insertAutomationCompletion: db.prepare(`
      INSERT OR IGNORE INTO automation_completion_inbox (id, text, attribution)
      VALUES (?, ?, ?)
    `),
    getAutomationCompletionState: db.prepare(
      "SELECT acknowledged FROM automation_completion_inbox WHERE id = ?"
    ),
    acknowledgeAutomationCompletion: db.prepare(
      "UPDATE automation_completion_inbox SET acknowledged = 1 WHERE id = ?"
    ),
    clearAutomationCompletions: db.prepare("DELETE FROM automation_completion_inbox"),
    hasLegacyBlob: db.prepare("SELECT 1 AS present FROM blobs LIMIT 1"),
    legacyBlobBytes: db.prepare("SELECT COALESCE(SUM(length(data)), 0) AS total FROM blobs"),
    clearBlobs: db.prepare("DELETE FROM blobs"),
    listTranscriptEntries: db.prepare("SELECT entry FROM transcript_entries ORDER BY seq"),
    listTranscriptEntriesAfterSeq: db.prepare(
      "SELECT entry FROM transcript_entries WHERE seq > ? ORDER BY seq"
    ),
    newestDividerAnchorTimestamp: db.prepare(`
      SELECT json_extract(entry, '$.timestampMs') AS timestampMs
      FROM transcript_entries
      WHERE json_extract(entry, '$.timestampMs') IS NOT NULL
        AND ${DIVIDER_ANCHOR_ENTRY_FILTER_SQL}
      ORDER BY seq DESC
      LIMIT 1
    `),
    listTranscriptPage: db.prepare(`
      SELECT seq, entry
      FROM transcript_entries
      WHERE (? IS NULL OR seq < ?)
        AND (
          json_extract(entry, '$.timestampMs') IS NULL
          OR (? IS NULL OR json_extract(entry, '$.timestampMs') >= ?)
        )
        AND (
          json_extract(entry, '$.timestampMs') IS NULL
          OR json_extract(entry, '$.timestampMs') <= ?
        )
        AND (
          (${MAIN_TRANSCRIPT_MESSAGE_FILTER_SQL})
          OR json_extract(entry, '$.kind') = 'spend-initiation'
        )
      ORDER BY seq DESC
      LIMIT ?
    `),
    listTranscriptWindow: db.prepare(`
      SELECT seq, entry
      FROM transcript_entries
      WHERE (? IS NULL OR seq < ?)
        AND ${WINDOW_ENTRY_FILTER_SQL}
        AND json_extract(entry, '$.kind') != 'spend-initiation'
      ORDER BY seq DESC
      LIMIT ?
    `),
    listTranscriptTail: db.prepare(`
      SELECT seq, entry
      FROM transcript_entries
      WHERE (? IS NULL OR seq < ?)
        AND json_extract(entry, '$.kind') != 'spend-initiation'
      ORDER BY seq DESC
      LIMIT ?
    `),
    listBranchedEntries: db.prepare(
      `SELECT entry FROM transcript_entries WHERE ${BRANCHED_ENTRY_FILTER_SQL} ORDER BY seq`
    ),
    getTranscriptEntry: db.prepare("SELECT entry FROM transcript_entries WHERE id = ?"),
    getTranscriptEntrySeq: db.prepare("SELECT seq FROM transcript_entries WHERE id = ?"),
    insertTranscriptEntry: db.prepare(
      "INSERT OR IGNORE INTO transcript_entries (id, entry) VALUES (?, ?)"
    ),
    updateTranscriptEntry: db.prepare("UPDATE transcript_entries SET entry = ? WHERE id = ?"),
    deleteTranscriptEntry: db.prepare("DELETE FROM transcript_entries WHERE id = ?"),
    clearTranscriptEntries: db.prepare("DELETE FROM transcript_entries")
  };
}

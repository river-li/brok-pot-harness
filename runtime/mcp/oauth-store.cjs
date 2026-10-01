"use strict";

const fs = require("node:fs");
const path = require("node:path");
const { randomBytes, createCipheriv, createDecipheriv } = require("node:crypto");
const MAX_BYTES = 32 * 1024 * 1024;

function privateFile(file, maxSize, credential = false) {
  const fd = fs.openSync(file, fs.constants.O_RDONLY | fs.constants.O_NOFOLLOW);
  try {
    const stat = fs.fstatSync(fd);
    const parent = credential ? fs.lstatSync(path.dirname(file)) : null;
    const privateGroupRead = credential && parent.isDirectory() && !parent.isSymbolicLink() &&
      !(parent.mode & 0o077) && parent.uid === process.getuid() && !(stat.mode & 0o037);
    if (!stat.isFile() || ((stat.mode & 0o077) && !privateGroupRead) || stat.size > maxSize) throw new Error("Unsafe OAuth storage file.");
    return fs.readFileSync(fd);
  } finally { fs.closeSync(fd); }
}

function openOAuthStore({ directory, keyFile, binding }) {
  let db;
  let key;
  let owned = false;
  let broken = false;
  const owner = randomBytes(24).toString("hex");
  const aad = Buffer.from(JSON.stringify({ version: 1, binding }));
  const unavailable = () => new Error("OAuth persistent storage is unavailable; repair storage before restarting.");
  try {
    key = privateFile(keyFile, 32, true);
    if (key.length !== 32) throw unavailable();
    fs.mkdirSync(directory, { recursive: true, mode: 0o700 });
    const dir = fs.lstatSync(directory);
    if (!dir.isDirectory() || dir.isSymbolicLink() || (dir.mode & 0o077)) throw unavailable();
    const file = path.join(directory, "grants.sqlite");
    try { fs.closeSync(fs.openSync(file, fs.constants.O_CREAT | fs.constants.O_EXCL | fs.constants.O_WRONLY, 0o600)); }
    catch (error) { if (error.code !== "EEXIST") throw error; }
    privateFile(file, MAX_BYTES * 3);
    for (const suffix of ["-journal", "-wal", "-shm"]) {
      try { privateFile(file + suffix, MAX_BYTES * 3); }
      catch (error) { if (error.code !== "ENOENT") throw error; }
    }
    // Lazy import preserves the Node 18+ memory-only bridge.
    const { DatabaseSync } = require("node:sqlite");
    db = new DatabaseSync(file);
    db.exec("PRAGMA journal_mode=DELETE; PRAGMA synchronous=FULL; PRAGMA busy_timeout=1000;");
    db.exec("CREATE TABLE IF NOT EXISTS state (id INTEGER PRIMARY KEY CHECK(id=1), payload BLOB NOT NULL); CREATE TABLE IF NOT EXISTS owner (id INTEGER PRIMARY KEY CHECK(id=1), pid INTEGER NOT NULL, nonce TEXT NOT NULL);");
    db.exec("BEGIN IMMEDIATE");
    const previous = db.prepare("SELECT pid FROM owner WHERE id=1").get();
    if (previous) {
      try { process.kill(previous.pid, 0); throw unavailable(); }
      catch (error) { if (error.code !== "ESRCH") throw error; }
    }
    const row = db.prepare("SELECT payload FROM state WHERE id=1").get();
    let initial = null;
    if (row) {
      const bytes = Buffer.from(row.payload);
      if (bytes.length < 29 || bytes.length > MAX_BYTES || bytes[0] !== 1) throw unavailable();
      const decipher = createDecipheriv("aes-256-gcm", key, bytes.subarray(1, 13));
      decipher.setAAD(aad);
      decipher.setAuthTag(bytes.subarray(13, 29));
      initial = JSON.parse(Buffer.concat([decipher.update(bytes.subarray(29)), decipher.final()]).toString("utf8"));
    }
    db.prepare("INSERT OR REPLACE INTO owner VALUES (1, ?, ?)").run(process.pid, owner);
    db.exec("COMMIT");
    owned = true;

    function check() {
      if (broken || !owned) throw unavailable();
      try {
        if (db.prepare("SELECT nonce FROM owner WHERE id=1").get()?.nonce !== owner) throw unavailable();
      } catch { broken = true; throw unavailable(); }
    }
    function save(value) {
      check();
      try {
        const plaintext = Buffer.from(JSON.stringify(value));
        if (plaintext.length + 29 > MAX_BYTES) throw unavailable();
        const nonce = randomBytes(12);
        const cipher = createCipheriv("aes-256-gcm", key, nonce);
        cipher.setAAD(aad);
        const ciphertext = Buffer.concat([cipher.update(plaintext), cipher.final()]);
        plaintext.fill(0);
        const payload = Buffer.concat([Buffer.from([1]), nonce, cipher.getAuthTag(), ciphertext]);
        db.exec("BEGIN IMMEDIATE");
        check();
        db.prepare("INSERT OR REPLACE INTO state VALUES (1, ?)").run(payload);
        db.exec("COMMIT");
      } catch {
        try { db.exec("ROLLBACK"); } catch { /* No open transaction. */ }
        broken = true;
        throw unavailable();
      }
    }
    function close() {
      if (!owned) return;
      try { db.prepare("DELETE FROM owner WHERE id=1 AND nonce=?").run(owner); }
      finally { owned = false; db.close(); key.fill(0); }
    }
    return { initial, save, check, close };
  } catch {
    if (db) { try { db.exec("ROLLBACK"); } catch {} try { db.close(); } catch {} }
    key?.fill(0);
    throw unavailable();
  }
}

module.exports = { openOAuthStore };

#!/exec-daemon/node

import {
  existsSync,
  lstatSync,
  renameSync,
  unlinkSync,
  writeFileSync,
} from "node:fs";
import { writeFile } from "node:fs/promises";

const DEFAULT_MAX_BYTES = 1024 * 1024;
const rawMaxBytes = process.env.SAND_BOX_BOUNDED_LOG_MAX_BYTES;
const parsedMaxBytes =
  rawMaxBytes !== undefined && /^[1-9][0-9]*$/.test(rawMaxBytes)
    ? Number(rawMaxBytes)
    : DEFAULT_MAX_BYTES;
const maxBytes =
  Number.isSafeInteger(parsedMaxBytes) && parsedMaxBytes > 0
    ? parsedMaxBytes
    : DEFAULT_MAX_BYTES;

const logPath = process.argv[2];
const ownerPid = process.argv[3];
const rotatedPath = `${logPath}.1`;
const capacity = maxBytes * 2;
const ring = Buffer.allocUnsafe(capacity);
let writeOffset = 0;
let retainedLength = 0;
let dirty = false;
let loggingDisabled = false;
let flushPromise;

function unlinkIfPresent(path) {
  try {
    unlinkSync(path);
  } catch (error) {
    if (error?.code !== "ENOENT") throw error;
  }
}

function removeUnsafeOrOversized(path) {
  try {
    const info = lstatSync(path);
    if (!info.isFile() || info.size > maxBytes) unlinkSync(path);
  } catch (error) {
    if (error?.code !== "ENOENT") throw error;
  }
}

function append(chunk) {
  if (chunk.length >= capacity) {
    chunk.copy(ring, 0, chunk.length - capacity);
    writeOffset = 0;
    retainedLength = capacity;
    dirty = true;
    return;
  }
  const beforeWrap = Math.min(chunk.length, capacity - writeOffset);
  chunk.copy(ring, writeOffset, 0, beforeWrap);
  if (beforeWrap < chunk.length) {
    chunk.copy(ring, 0, beforeWrap);
  }
  writeOffset = (writeOffset + chunk.length) % capacity;
  retainedLength = Math.min(capacity, retainedLength + chunk.length);
  dirty = true;
}

function snapshot() {
  const result = Buffer.allocUnsafe(retainedLength);
  const start = (writeOffset - retainedLength + capacity) % capacity;
  const beforeWrap = Math.min(retainedLength, capacity - start);
  ring.copy(result, 0, start, start + beforeWrap);
  if (beforeWrap < retainedLength) {
    ring.copy(result, beforeWrap, 0, retainedLength - beforeWrap);
  }
  return result;
}

function prepareLogs() {
  if (!/^[1-9][0-9]*$/.test(ownerPid ?? "")) {
    throw new Error("missing managed process pid");
  }
  writeFileSync(`${logPath}.lock`, `${ownerPid}\n`, { mode: 0o600 });
  removeUnsafeOrOversized(logPath);
  removeUnsafeOrOversized(rotatedPath);
  if (existsSync(logPath)) {
    unlinkIfPresent(rotatedPath);
    renameSync(logPath, rotatedPath);
  }
}

async function writeSnapshot(value) {
  const split = Math.max(0, value.length - maxBytes);
  const older = value.subarray(0, split);
  const current = value.subarray(split);
  if (older.length > 0) {
    await writeFile(rotatedPath, older, { mode: 0o600 });
  } else {
    unlinkIfPresent(rotatedPath);
  }
  await writeFile(logPath, current, { mode: 0o600 });
}

function startFlush() {
  if (
    loggingDisabled ||
    !dirty ||
    flushPromise !== undefined ||
    retainedLength === 0
  ) {
    return;
  }
  dirty = false;
  const value = snapshot();
  flushPromise = writeSnapshot(value)
    .catch(() => {
      loggingDisabled = true;
    })
    .finally(() => {
      flushPromise = undefined;
    });
}

try {
  prepareLogs();
} catch {
  loggingDisabled = true;
}

const flushTimer = setInterval(startFlush, 250);
try {
  for await (const chunk of process.stdin) {
    if (!loggingDisabled) append(chunk);
  }
} catch (error) {
  if (!loggingDisabled) {
    const midLine =
      retainedLength > 0 && ring[(writeOffset - 1 + capacity) % capacity] !== 0x0a;
    append(
      Buffer.from(
        `${midLine ? "\n" : ""}box-bounded-log: the managed process's output stream failed, the sink is exiting: ${String(error)}\n`,
      ),
    );
  }
} finally {
  clearInterval(flushTimer);
}

if (flushPromise !== undefined) await flushPromise;
if (!loggingDisabled && dirty) {
  startFlush();
  if (flushPromise !== undefined) await flushPromise;
}

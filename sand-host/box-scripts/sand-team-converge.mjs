import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, renameSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

process.umask(0o077);

const MANAGED_ROOT = process.env.SAND_MANAGED_ROOT || "/opt/sand-managed";
const ASSIGNMENT_PATH =
  process.env.SAND_MANIFEST_ASSIGNMENT_PATH || join(MANAGED_ROOT, "assignment.json");
const MANIFESTS_ROOT = process.env.SAND_MANIFESTS_ROOT || join(MANAGED_ROOT, "manifests");
const RECEIPTS_ROOT = process.env.SAND_SETUP_RECEIPTS_ROOT || join(MANAGED_ROOT, "receipts");
const STATUS_PATH = process.env.SAND_SETUP_STATUS_PATH || "/run/sand/managed-setup-status.json";
const LOCK_PATH =
  process.env.SAND_SETUP_LOCK_PATH || join(dirname(STATUS_PATH), "managed-setup-converge.lock");
const IMAGE_SHA_PATH = process.env.SAND_BOX_IMAGE_SHA_PATH || "/etc/sand-box-image-sha";
const SCHEMA_VERSION = 1;
const SECRET_ENVELOPE_VERSION = 1;
const EXECUTOR_VERSION = "3.0.0";
const SAFE_PATH_SEGMENT = /^[A-Za-z0-9][A-Za-z0-9._-]{0,127}$/;
const ENV_NAME = /^[A-Za-z_][A-Za-z0-9_]*$/;
const RESERVED_ENV_NAMES = new Set([
  "PATH",
  "HOME",
  "USER",
  "SHELL",
  "TERM",
  "PWD",
  "DISPLAY",
  "CLOUD_AGENT_INJECTED_SECRET_NAMES",
]);
const RESERVED_ENV_PREFIXES = ["SAND_", "__CURSOR", "LD_"];
const CURSOR_SANDBOX_ENV_NAME = /CURSOR_SANDBOX/i;
const MAX_SECRETS_PER_TEAM = 100;
const MAX_SECRET_VALUE_BYTES = 32 * 1024;
const MAX_SECRET_ENV_BYTES = 96 * 1024;
const DEFAULT_SCRIPT_TIMEOUT_MS = 30 * 60 * 1000;
const configuredScriptTimeoutMs = Number(process.env.SAND_SETUP_SCRIPT_TIMEOUT_MS);
const SCRIPT_TIMEOUT_MS =
  Number.isFinite(configuredScriptTimeoutMs) && configuredScriptTimeoutMs > 0
    ? configuredScriptTimeoutMs
    : DEFAULT_SCRIPT_TIMEOUT_MS;
const FORCE_SETUP = process.env.SAND_MANAGED_SETUP_FORCE === "1";

function log(message) {
  console.log(`[sand-managed-converge] ${new Date().toISOString()} ${message}`);
}

function readFileOrNull(path) {
  try {
    return readFileSync(path, "utf8");
  } catch {
    return null;
  }
}

function writeJsonAtomic(path, value) {
  mkdirSync(dirname(path), { recursive: true });
  const tmp = `${path}.tmp-${process.pid}`;
  writeFileSync(tmp, `${JSON.stringify(value, null, 2)}\n`);
  renameSync(tmp, path);
}

function writeStatus(fields) {
  const status = {
    schemaVersion: SCHEMA_VERSION,
    updatedAt: new Date().toISOString(),
    failureClass: null,
    ...fields,
  };
  writeJsonAtomic(STATUS_PATH, status);
  log(`status: phase=${status.phase} failureClass=${status.failureClass}`);
}

function acquireLock() {
  mkdirSync(dirname(LOCK_PATH), { recursive: true });
  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      mkdirSync(LOCK_PATH);
      writeFileSync(join(LOCK_PATH, "pid"), String(process.pid));
      return () => rmSync(LOCK_PATH, { recursive: true, force: true });
    } catch (error) {
      if (error?.code !== "EEXIST") throw error;
      const ownerPid = Number(readFileOrNull(join(LOCK_PATH, "pid")));
      if (Number.isInteger(ownerPid) && ownerPid > 0) {
        try {
          process.kill(ownerPid, 0);
          return null;
        } catch (killError) {
          if (killError?.code === "EPERM") return null;
        }
      }
      rmSync(LOCK_PATH, { recursive: true, force: true });
    }
  }
  throw new Error("could not acquire converge lock");
}

function isSafePathSegment(value) {
  return typeof value === "string" && SAFE_PATH_SEGMENT.test(value);
}

function isValidScope(scope) {
  return (
    scope !== null &&
    typeof scope === "object" &&
    !Array.isArray(scope) &&
    scope.kind === "team" &&
    isSafePathSegment(scope.id)
  );
}

function isValidManifestRef(ref) {
  return (
    ref !== null &&
    typeof ref === "object" &&
    !Array.isArray(ref) &&
    isValidScope(ref.scope) &&
    isSafePathSegment(ref.manifestId) &&
    isSafePathSegment(ref.revision)
  );
}

function manifestRefKey(ref) {
  return `${ref.scope.kind}\0${ref.scope.id}\0${ref.manifestId}`;
}

function parseAssignment(raw) {
  const assignment = JSON.parse(raw);
  if (
    assignment === null ||
    typeof assignment !== "object" ||
    Array.isArray(assignment) ||
    assignment.schemaVersion !== SCHEMA_VERSION ||
    !Array.isArray(assignment.manifests) ||
    !assignment.manifests.every(isValidManifestRef)
  ) {
    throw new Error(
      "expected { schemaVersion: 1, manifests: [{ scope: { kind, id }, manifestId, revision }] }",
    );
  }
  const keys = assignment.manifests.map(manifestRefKey);
  if (new Set(keys).size !== keys.length) {
    throw new Error("assigned manifest identities must be unique");
  }
  return assignment;
}

function parseSecretEnvelope(raw) {
  const envelope = JSON.parse(raw);
  if (
    envelope === null ||
    typeof envelope !== "object" ||
    Array.isArray(envelope) ||
    envelope.version !== SECRET_ENVELOPE_VERSION ||
    !Array.isArray(envelope.teams)
  ) {
    throw new Error("managed setup Team Secrets envelope is invalid");
  }
  const byTeam = new Map();
  for (const team of envelope.teams) {
    if (
      team === null ||
      typeof team !== "object" ||
      Array.isArray(team) ||
      !isSafePathSegment(team.teamId) ||
      !Array.isArray(team.secrets) ||
      team.secrets.length > MAX_SECRETS_PER_TEAM ||
      byTeam.has(team.teamId)
    ) {
      throw new Error("managed setup Team Secrets scope is invalid");
    }
    const env = {};
    let totalBytes = 0;
    for (const secret of team.secrets) {
      if (
        secret === null ||
        typeof secret !== "object" ||
        Array.isArray(secret) ||
        typeof secret.name !== "string" ||
        !ENV_NAME.test(secret.name) ||
        RESERVED_ENV_NAMES.has(secret.name) ||
        RESERVED_ENV_PREFIXES.some(prefix => secret.name.startsWith(prefix)) ||
        CURSOR_SANDBOX_ENV_NAME.test(secret.name) ||
        typeof secret.value !== "string" ||
        Buffer.byteLength(secret.value, "utf8") > MAX_SECRET_VALUE_BYTES ||
        Object.hasOwn(env, secret.name)
      ) {
        throw new Error("managed setup Team Secret is invalid");
      }
      totalBytes +=
        Buffer.byteLength(secret.name, "utf8") +
        Buffer.byteLength(secret.value, "utf8");
      env[secret.name] = secret.value;
    }
    if (totalBytes > MAX_SECRET_ENV_BYTES) {
      throw new Error("managed setup Team Secrets are too large");
    }
    byTeam.set(team.teamId, env);
  }
  return byTeam;
}

function isValidEntry(entry) {
  return (
    entry !== null &&
    typeof entry === "object" &&
    !Array.isArray(entry) &&
    isSafePathSegment(entry.id) &&
    typeof entry.setup === "string" &&
    (entry.check === undefined || typeof entry.check === "string")
  );
}

function parseManifest(raw, assigned) {
  const manifest = JSON.parse(raw);
  const entries =
    manifest !== null &&
    typeof manifest === "object" &&
    !Array.isArray(manifest) &&
    manifest.schemaVersion === SCHEMA_VERSION &&
    isValidManifestRef(manifest) &&
    manifestRefKey(manifest) === manifestRefKey(assigned) &&
    manifest.revision === assigned.revision &&
    Array.isArray(manifest.entries) &&
    manifest.entries.every(isValidEntry) &&
    new Set(manifest.entries.map((entry) => entry.id)).size === manifest.entries.length
      ? manifest.entries
      : null;
  if (entries === null) {
    throw new Error("manifest identity or shape does not match its assignment");
  }
  return { manifest, entries };
}

function manifestPath(ref) {
  return join(
    MANIFESTS_ROOT,
    ref.scope.kind,
    ref.scope.id,
    ref.manifestId,
    ref.revision,
    "manifest.json",
  );
}

function receiptPath(ref, entryId) {
  return join(RECEIPTS_ROOT, ref.scope.kind, ref.scope.id, ref.manifestId, `${entryId}.json`);
}

function hash(value) {
  return createHash("sha256").update(value).digest("hex");
}

function entryHash(entry) {
  return hash(
    JSON.stringify({
      id: entry.id,
      setup: entry.setup,
      check: entry.check ?? null,
    }),
  );
}

function redactSecrets(output, secretValues) {
  let redacted = output;
  for (const value of secretValues) {
    if (value.length > 0) redacted = redacted.split(value).join("[REDACTED]");
  }
  return redacted;
}

function runScript(entryId, kind, script, secrets, secretValues) {
  log(`entry ${entryId}: running ${kind}`);
  const result = spawnSync("bash", ["-c", script], {
    encoding: "utf8",
    env: { ...process.env, ...secrets },
    maxBuffer: 10 * 1024 * 1024,
    timeout: SCRIPT_TIMEOUT_MS,
    killSignal: "SIGKILL",
  });
  if (result.stdout)
    process.stdout.write(redactSecrets(result.stdout, secretValues));
  if (result.stderr)
    process.stderr.write(redactSecrets(result.stderr, secretValues));
  if (result.error != null) {
    if (result.error.code === "ETIMEDOUT") {
      return `${kind} timed out after ${SCRIPT_TIMEOUT_MS}ms`;
    }
    return `${kind} could not run: ${result.error}`;
  }
  if (result.status !== 0) {
    return `${kind} exited ${result.status}`;
  }
  return null;
}

function readEntryReceipt(ref, entry) {
  const raw = readFileOrNull(receiptPath(ref, entry.id));
  if (raw === null) return null;
  try {
    const receipt = JSON.parse(raw);
    return receipt !== null &&
      typeof receipt === "object" &&
      !Array.isArray(receipt) &&
      receipt.schemaVersion === SCHEMA_VERSION &&
      isValidManifestRef(receipt) &&
      manifestRefKey(receipt) === manifestRefKey(ref) &&
      receipt.entryId === entry.id &&
      receipt.entryHash === entryHash(entry) &&
      receipt.executorVersion === EXECUTOR_VERSION
      ? receipt
      : null;
  } catch (error) {
    log(`entry ${entry.id}: receipt unreadable (${error}); re-applying`);
    return null;
  }
}

function receiptMatchesCurrentManifest(receipt, ref, manifestHash) {
  return receipt.revision === ref.revision && receipt.manifestHash === manifestHash;
}

function writeReceipt(ref, manifestHash, entry, imageSha) {
  writeJsonAtomic(receiptPath(ref, entry.id), {
    schemaVersion: SCHEMA_VERSION,
    ...ref,
    manifestHash,
    entryId: entry.id,
    entryHash: entryHash(entry),
    imageSha,
    executorVersion: EXECUTOR_VERSION,
    appliedAt: new Date().toISOString(),
  });
}

function reconcileEntry(
  ref,
  manifestHash,
  entry,
  imageSha,
  secrets,
  secretValues
) {
  const path = receiptPath(ref, entry.id);
  const hadReceipt = existsSync(path);
  const entryReceipt = readEntryReceipt(ref, entry);
  const receipt =
    entryReceipt !== null && imageSha.length !== 0 && entryReceipt.imageSha === imageSha
      ? entryReceipt
      : null;
  const receiptInvalidated =
    hadReceipt && receipt === null && (entryReceipt === null || imageSha.length !== 0);

  if (!FORCE_SETUP && entry.check !== undefined && !receiptInvalidated) {
    const checkError = runScript(
      entry.id,
      "check",
      entry.check,
      secrets,
      secretValues
    );
    if (checkError === null) {
      log(`entry ${entry.id}: already compliant`);
      if (receipt === null || !receiptMatchesCurrentManifest(receipt, ref, manifestHash)) {
        writeReceipt(ref, manifestHash, entry, imageSha);
      }
      return null;
    }
    rmSync(path, { force: true });
  } else if (!FORCE_SETUP && receipt !== null) {
    log(`entry ${entry.id}: receipt matches; no-op`);
    if (!receiptMatchesCurrentManifest(receipt, ref, manifestHash)) {
      writeReceipt(ref, manifestHash, entry, imageSha);
    }
    return null;
  }

  rmSync(path, { force: true });
  const setupError = runScript(
    entry.id,
    "setup",
    entry.setup,
    secrets,
    secretValues
  );
  if (setupError !== null) return setupError;
  if (entry.check !== undefined) {
    const checkError = runScript(
      entry.id,
      "check",
      entry.check,
      secrets,
      secretValues
    );
    if (checkError !== null) return checkError;
  }
  writeReceipt(ref, manifestHash, entry, imageSha);
  return null;
}

function publishApplying(assignmentHash, manifestStatuses) {
  writeStatus({
    phase: "applying",
    message: "Applying assigned setup manifests.",
    assignmentHash,
    manifests: manifestStatuses,
  });
}

function main(secretsByTeam, secretValues) {
  let assignmentRaw;
  try {
    assignmentRaw = readFileSync(ASSIGNMENT_PATH, "utf8");
  } catch (error) {
    if (error?.code === "ENOENT") {
      log(`no assignment at ${ASSIGNMENT_PATH}; no-op`);
      writeStatus({ phase: "idle", message: "No setup manifests assigned." });
      return;
    }
    writeStatus({
      phase: "failed",
      failureClass: "team-setup-failed",
      message: `Manifest assignment unreadable: ${error}`,
    });
    return;
  }

  const assignmentHash = hash(assignmentRaw);
  let assignment;
  try {
    assignment = parseAssignment(assignmentRaw);
  } catch (error) {
    writeStatus({
      phase: "failed",
      failureClass: "team-setup-failed",
      message: `Manifest assignment is invalid: ${error}`,
      assignmentHash,
    });
    return;
  }
  const assignedTeamIds = new Set(
    assignment.manifests.map(ref => ref.scope.id)
  );
  if ([...secretsByTeam.keys()].some(teamId => !assignedTeamIds.has(teamId))) {
    throw new Error("managed setup Team Secrets include an unassigned team");
  }

  if (assignment.manifests.length === 0) {
    writeStatus({
      phase: "idle",
      message: "No setup manifests assigned.",
      assignmentHash,
      manifests: [],
    });
    return;
  }

  const imageSha = (readFileOrNull(IMAGE_SHA_PATH) ?? "").trim();
  const manifestStatuses = assignment.manifests.map((ref) => ({
    ...ref,
    phase: "pending",
  }));
  publishApplying(assignmentHash, manifestStatuses);

  let succeededEntries = 0;
  let failedEntries = 0;
  let succeededEmptyManifests = 0;
  for (const [manifestIndex, ref] of assignment.manifests.entries()) {
    const secrets = secretsByTeam.get(ref.scope.id) ?? {};
    manifestStatuses[manifestIndex] = { ...ref, phase: "applying" };
    publishApplying(assignmentHash, manifestStatuses);

    let manifestRaw;
    try {
      manifestRaw = readFileSync(manifestPath(ref), "utf8");
    } catch (error) {
      failedEntries += 1;
      manifestStatuses[manifestIndex] = {
        ...ref,
        phase: "failed",
        lastError: `Manifest unreadable: ${error}`,
      };
      publishApplying(assignmentHash, manifestStatuses);
      continue;
    }

    const currentManifestHash = hash(manifestRaw);
    let entries;
    try {
      ({ entries } = parseManifest(manifestRaw, ref));
    } catch (error) {
      failedEntries += 1;
      manifestStatuses[manifestIndex] = {
        ...ref,
        manifestHash: currentManifestHash,
        phase: "failed",
        lastError: `Manifest is invalid: ${error}`,
      };
      publishApplying(assignmentHash, manifestStatuses);
      continue;
    }

    const entryStatuses = entries.map((entry) => ({
      entryId: entry.id,
      phase: "pending",
    }));
    manifestStatuses[manifestIndex] = {
      ...ref,
      manifestHash: currentManifestHash,
      phase: "applying",
      entries: entryStatuses,
    };
    publishApplying(assignmentHash, manifestStatuses);

    let manifestFailed = false;
    for (const [entryIndex, entry] of entries.entries()) {
      entryStatuses[entryIndex] = {
        entryId: entry.id,
        phase: "applying",
      };
      publishApplying(assignmentHash, manifestStatuses);
      let error;
      try {
        error = reconcileEntry(
          ref,
          currentManifestHash,
          entry,
          imageSha,
          secrets,
          secretValues
        );
      } catch (reconcileError) {
        error = `reconciliation failed: ${reconcileError}`;
        try {
          rmSync(receiptPath(ref, entry.id), { force: true });
        } catch (rmError) {
          log(`receipt for entry ${entry.id} not removed: ${String(rmError)}`);
        }
      }
      if (error === null) {
        succeededEntries += 1;
        entryStatuses[entryIndex] = { entryId: entry.id, phase: "ok" };
      } else {
        failedEntries += 1;
        manifestFailed = true;
        entryStatuses[entryIndex] = {
          entryId: entry.id,
          phase: "failed",
          lastError: error,
        };
        log(`entry ${entry.id}: ${error}`);
      }
      publishApplying(assignmentHash, manifestStatuses);
    }

    if (entries.length === 0) succeededEmptyManifests += 1;
    let manifestPhase = "ok";
    if (manifestFailed) {
      manifestPhase = entryStatuses.some((entry) => entry.phase === "ok") ? "degraded" : "failed";
    }
    manifestStatuses[manifestIndex] = {
      ...ref,
      manifestHash: currentManifestHash,
      phase: manifestPhase,
      entries: entryStatuses,
    };
    publishApplying(assignmentHash, manifestStatuses);
  }

  const hasSuccess = succeededEntries > 0 || succeededEmptyManifests > 0;
  const hasFailure = failedEntries > 0;
  let phase = "ok";
  let failureClass = null;
  if (hasFailure) {
    phase = hasSuccess ? "degraded" : "failed";
    failureClass = hasSuccess ? "team-setup-degraded" : "team-setup-failed";
  }
  writeStatus({
    phase,
    failureClass,
    message: hasFailure
      ? `${failedEntries} setup item(s) failed.`
      : "Assigned setup manifests are compliant.",
    assignmentHash,
    manifests: manifestStatuses,
  });
  log(
    `converged ${assignment.manifests.length} manifest(s): ${succeededEntries} entries ok, ${failedEntries} failed`,
  );
}

let releaseLock = null;
try {
  const envelopeRaw = readFileSync(0, "utf8");
  if (envelopeRaw.trim().length === 0) {
    log("no Team Secrets envelope on stdin; only the host launches converge");
    process.exitCode = 1;
  } else {
    const secretsByTeam = parseSecretEnvelope(envelopeRaw);
    const secretValues = [
      ...new Set(
        [...secretsByTeam.values()].flatMap(secrets => Object.values(secrets))
      ),
    ].sort((a, b) => b.length - a.length);
    releaseLock = acquireLock();
    if (releaseLock === null) {
      log("another converge process is already running");
      process.exitCode = 1;
    } else {
      if (FORCE_SETUP) log("force setup requested");
      main(secretsByTeam, secretValues);
    }
  }
} catch (error) {
  log(`converge crashed: ${error?.stack ?? error}`);
  process.exitCode = 1;
  try {
    writeStatus({
      phase: "failed",
      failureClass: "team-setup-failed",
      message: `Converge crashed: ${error}`,
    });
  } catch (statusError) {
    log(`status write failed: ${String(statusError)}`);
  }
} finally {
  releaseLock?.();
}

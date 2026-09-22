/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/host/box/box-file-transfer.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var import_node_crypto48 = require("node:crypto");
var import_node_path107 = require("node:path");
init_write_exec_pb();
init_errors();
var SandBoxFileTransferError = class extends SandDomainError {
  name = "SandBoxFileTransferError";
};
var TRANSFER_TOOL_CALL_ID = "sand-box-file-transfer";
var BoxShellTransientError = class extends SandDomainError {
  name = "BoxShellTransientError";
};
var BoxShellSignalKilledError = class extends BoxShellTransientError {
  name = "BoxShellSignalKilledError";
};
var BoxShellUnavailableError = class extends BoxShellTransientError {
  name = "BoxShellUnavailableError";
};
function isSignalKillFailure(exitCode, signal) {
  return signal.length > 0 || exitCode < 0;
}
function shellSingleQuote(value) {
  return `'${value.replaceAll("'", `'\\''`)}'`;
}
function describeShellFailure(result) {
  switch (result.case) {
    case "failure": {
      const { exitCode, signal, stderr, aborted: aborted2 } = result.value;
      const head = exitCode < 0 || signal.length > 0 ? `killed by signal ${signal.length > 0 ? signal : "(unknown)"}${aborted2 ? " (aborted)" : ""}` : `exit ${exitCode}${aborted2 ? " (aborted)" : ""}`;
      return stderr.length > 0 ? `${head}: ${stderr}` : head;
    }
    case "spawnError":
      return `exec-daemon spawn error: ${result.value.error}`;
    case "permissionDenied":
      return `permission denied: ${result.value.error}`;
    case "rejected":
      return `exec-daemon rejected the command: ${result.value.reason}`;
    case "timeout":
      return `exec-daemon timed out after ${result.value.timeoutMs}ms`;
    default:
      return result.case ?? "unknown (no result from exec-daemon)";
  }
}
function asTransientBoxShellError(result, context2) {
  switch (result.case) {
    case "failure":
      if (isSignalKillFailure(result.value.exitCode, result.value.signal)) {
        return new BoxShellSignalKilledError(
          `${context2} signal-killed (${describeShellFailure(result)})`
        );
      }
      return void 0;
    case "spawnError":
    case "timeout":
    case "rejected":
      return new BoxShellUnavailableError(`${context2} (${describeShellFailure(result)})`);
    case "permissionDenied":
      return void 0;
    default:
      return void 0;
  }
}
async function runBoxShell(ctx, accessor, script) {
  const shell = accessor.get(shellExecutorResource);
  const command = `bash -lc ${shellSingleQuote(script)}`;
  const result = await shell.execute(
    ctx,
    buildHostShellArgs({
      command,
      name: "bash",
      workingDirectory: "/",
      toolCallId: TRANSFER_TOOL_CALL_ID
    })
  );
  if (result.result.case === "success" && result.result.value.exitCode === 0) {
    return;
  }
  const transient = asTransientBoxShellError(result.result, "box shell command");
  if (transient !== void 0) throw transient;
  const detail = result.result.case === "success" ? `exit ${result.result.value.exitCode}: ${result.result.value.stderr}` : describeShellFailure(result.result);
  throw new SandBoxFileTransferError(`box shell command failed (${detail})`);
}
async function uploadFileViaExecDaemon(ctx, accessor, boxPath, data) {
  const parent = import_node_path107.posix.dirname(boxPath);
  await runBoxShell(ctx, accessor, `mkdir -p -- ${shellSingleQuote(parent)}`);
  const partPath = `${boxPath}.sand-${(0, import_node_crypto48.randomBytes)(8).toString("hex")}.part`;
  try {
    await writeFileBytesViaExecDaemon(ctx, accessor, partPath, data);
  } catch (error42) {
    await runBoxShell(ctx, accessor, `rm -f -- ${shellSingleQuote(partPath)}`).catch(() => {
    });
    throw error42;
  }
  await runBoxShell(
    ctx,
    accessor,
    `mv -f -- ${shellSingleQuote(partPath)} ${shellSingleQuote(boxPath)}`
  );
}
async function writeFileBytesViaExecDaemon(ctx, accessor, boxPath, data) {
  const writer = accessor.get(writeExecutorResource);
  const result = await writer.execute(
    ctx,
    new WriteArgs({
      path: boxPath,
      /*
       * protobuf-es initializes a bytes field as `new Uint8Array(0)`, so the emitted declaration types
       * it `Uint8Array<ArrayBuffer>` under TypeScript 5.7+, and a `Uint8Array<ArrayBufferLike>` is not
       * assignable to it (TS2322); copy into an ArrayBuffer-backed view.
       * https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-7.html#typedarrays-are-now-generic-over-arraybufferlike
       */
      fileBytes: Uint8Array.from(data),
      toolCallId: TRANSFER_TOOL_CALL_ID
    })
  );
  if (result.result.case === "success") {
    return;
  }
  let reason;
  if (result.result.case === "error") {
    reason = result.result.value.error;
  } else if (result.result.case === "rejected") {
    reason = result.result.value.reason;
  } else {
    reason = result.result.case;
  }
  throw new SandBoxFileTransferError(
    `upload to box ${boxPath} failed (${result.result.case}): ${reason}`
  );
}


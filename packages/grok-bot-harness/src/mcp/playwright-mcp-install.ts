var INSTALL_ROOT = "/usr/local/lib/sand-playwright-mcp";
var BIN_DIR = "/usr/local/bin";
var STAGE_PARENT = "/tmp/sand-playwright-mcp";
var INSTALL_SCRIPT_FILE = "install.sh";
var REPORT_PREFIX = "PLAYWRIGHT_MCP_INSTALL ";
var PROBE_TIMEOUT_MS = 15e3;
var INSTALL_TIMEOUT_MS = 18e4;
var BOX_IMAGE_SHA = /^[0-9a-f]{1,40}$/u;
var PROBE_LINE = /^(present|missing) (\d+) (.*)$/u;
var PlaywrightMcpInstallError = class extends Error {
  reason;
  boxImageSha;
  constructor(args) {
    const { reason, boxImageSha, detail, cause } = args;
    super(`playwright-mcp ${reason} on box image ${boxImageSha}: ${detail}`, { cause });
    this.name = "PlaywrightMcpInstallError";
    this.reason = reason;
    this.boxImageSha = boxImageSha;
  }
};
function playwrightMcpProbeCommand() {
  return `printf '%s %s %s\\n' "$(command -v playwright-mcp >/dev/null 2>&1 && echo present || echo missing)" "$(id -u)" "$(cat /etc/sand-box-image-sha 2>/dev/null)"`;
}
function lastNonEmptyLine(stdout) {
  return stdout.split("\n").filter((line) => line.length > 0).at(-1);
}
function parsePlaywrightMcpProbe(stdout) {
  const line = lastNonEmptyLine(stdout);
  const match2 = line === void 0 ? null : PROBE_LINE.exec(line);
  if (match2 === null) return void 0;
  const [, state, uid, sha] = match2;
  if (state === void 0 || uid === void 0 || sha === void 0) return void 0;
  return {
    present: state === "present",
    uid: Number(uid),
    boxImageSha: BOX_IMAGE_SHA.test(sha) ? sha : "unknown"
  };
}
function sha512HexOfIntegrity(integrity) {
  const prefix = "sha512-";
  if (!integrity.startsWith(prefix)) {
    throw new Error(`integrity ${integrity} is not a sha512 pin`);
  }
  const digest = Buffer.from(integrity.slice(prefix.length), "base64");
  if (digest.byteLength !== 64) {
    throw new Error(`integrity ${integrity} decodes to ${String(digest.byteLength)} bytes, not 64`);
  }
  return digest.toString("hex");
}
function shellQuote(value) {
  return `'${value.replaceAll("'", `'\\''`)}'`;
}
function playwrightMcpInstallCommand(args) {
  const words2 = [
    `${args.stageDir}/${INSTALL_SCRIPT_FILE}`,
    args.stageDir,
    INSTALL_ROOT,
    BIN_DIR,
    PLAYWRIGHT_MCP_MANIFEST.version,
    PLAYWRIGHT_MCP_MANIFEST.entry,
    ...PLAYWRIGHT_MCP_MANIFEST.packages.map(
      (pkg) => `${pkg.file}:${sha512HexOfIntegrity(pkg.integrity)}:${pkg.name}`
    )
  ];
  const command = `bash ${words2.map(shellQuote).join(" ")}`;
  return args.uid === 0 ? command : `sudo -n ${command}`;
}
function parsePlaywrightMcpInstallReport(stdout, exitCode) {
  const marker17 = stdout.split("\n").filter((line) => line.startsWith(REPORT_PREFIX)).at(-1)?.slice(REPORT_PREFIX.length).trimEnd();
  const [word, ...rest] = marker17 === void 0 ? [] : marker17.split(" ");
  if (word === "install_failed") return { failed: rest.join(" ") || "unknown" };
  if (exitCode === 0 && (word === "installed" || word === "present")) return word;
  if (exitCode === 3 && word === "hash_mismatch") return "hash_mismatch";
  if (exitCode !== 0) return { failed: `exit_${String(exitCode)}` };
  return { failed: "no_report" };
}
function shellOutcome(result) {
  switch (result.result.case) {
    case "success":
    case "failure":
      return { stdout: result.result.value.stdout, exitCode: result.result.value.exitCode };
    default:
      return { failure: result.result.case ?? "no_result" };
  }
}
async function ensurePlaywrightMcpInstalled(args) {
  const { box, connection, ctx, agentId, source } = args;
  const attach = (outcome, boxImageSha) => recordPlaywrightAttach(ctx, { outcome, source: source.kind, boxImageSha });
  if (source.kind === "image_only") {
    attach("image_only", "unknown");
    return { kind: "image_only" };
  }
  const fail = (args2) => {
    attach(args2.reason, args2.boxImageSha);
    reportHostDiagnostic({
      kind: "playwright_mcp_install_failed",
      reason: args2.reason,
      errorClass: args2.detail
    });
    return new PlaywrightMcpInstallError(args2);
  };
  const shell = connection.remoteAccessor.get(shellExecutorResource);
  const probed = shellOutcome(
    await shell.execute(
      ctx,
      buildHostShellArgs({
        command: playwrightMcpProbeCommand(),
        name: "sh",
        workingDirectory: "/workspace",
        toolCallId: `playwright-mcp-probe-${agentId}`,
        timeoutMs: PROBE_TIMEOUT_MS
      })
    )
  );
  if ("failure" in probed) {
    throw fail({ reason: "probe_failed", boxImageSha: "unknown", detail: probed.failure });
  }
  const probe = parsePlaywrightMcpProbe(probed.stdout);
  if (probe === void 0) {
    throw fail({
      reason: "probe_failed",
      boxImageSha: "unknown",
      detail: `unparsable probe, exit_${String(probed.exitCode)}`
    });
  }
  if (probe.present) {
    attach("present", probe.boxImageSha);
    return { kind: "present", boxImageSha: probe.boxImageSha };
  }
  const stageDir = `${STAGE_PARENT}/${(0, import_node_crypto54.randomUUID)()}`;
  try {
    await box.uploadFile(
      ctx,
      agentId,
      `${stageDir}/${INSTALL_SCRIPT_FILE}`,
      Buffer.from(playwright_mcp_install_default, "utf8")
    );
    for (const pkg of PLAYWRIGHT_MCP_MANIFEST.packages) {
      await box.uploadFile(
        ctx,
        agentId,
        `${stageDir}/${pkg.file}`,
        await source.readTarball(pkg.file)
      );
    }
  } catch (error41) {
    throw fail({
      reason: "upload_failed",
      boxImageSha: probe.boxImageSha,
      detail: errorLogTag(error41),
      cause: error41
    });
  }
  const installed = shellOutcome(
    await shell.execute(
      ctx,
      buildHostShellArgs({
        command: playwrightMcpInstallCommand({ stageDir, uid: probe.uid }),
        name: "bash",
        workingDirectory: "/workspace",
        toolCallId: `playwright-mcp-install-${agentId}`,
        timeoutMs: INSTALL_TIMEOUT_MS
      })
    )
  );
  const report = "failure" in installed ? { failed: installed.failure } : parsePlaywrightMcpInstallReport(installed.stdout, installed.exitCode);
  if (report === "present" || report === "installed") {
    attach(report, probe.boxImageSha);
    return { kind: report, boxImageSha: probe.boxImageSha };
  }
  if (report === "hash_mismatch") {
    throw fail({
      reason: "hash_mismatch",
      boxImageSha: probe.boxImageSha,
      detail: "a staged tarball failed its sha512 check"
    });
  }
  throw fail({ reason: "install_failed", boxImageSha: probe.boxImageSha, detail: report.failed });
}

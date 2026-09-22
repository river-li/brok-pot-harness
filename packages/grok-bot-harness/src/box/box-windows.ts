/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/grok-bot-harness/src/box/box-windows.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/2
init_errors();

// @recovered-fragment 2/2
var SandBoxWindowError = class extends Error {
};
var SAND_BOX_WINDOW_OWNER_TOKEN_PATTERN = /^[A-Za-z0-9_-]+$/;
function envInt(name17, fallback2) {
  const raw = process.env[name17];
  if (raw === void 0 || raw.trim().length === 0) return fallback2;
  const value = Number.parseInt(raw.trim(), 10);
  return Number.isInteger(value) && value > 0 ? value : fallback2;
}
var SAND_BOX_MAX_WINDOWS = envInt("SAND_BOX_MAX_WINDOWS", 100);
async function runWindowScript(ctx, accessor, label, windowIndex, opts = {}) {
  const { ownerToken } = opts;
  if (isPrimaryWindowIndex(windowIndex)) {
    reportHostDiagnostic({ kind: "window_guard_refused", stage: label });
    return;
  }
  if (ownerToken !== void 0 && !SAND_BOX_WINDOW_OWNER_TOKEN_PATTERN.test(ownerToken)) {
    throw new SandBoxWindowError(`refusing to run ${label} with a malformed owner token`);
  }
  const shell = accessor.get(shellExecutorResource);
  const command = ownerToken !== void 0 ? `/usr/local/bin/${label} ${windowIndex} ${ownerToken}` : `/usr/local/bin/${label} ${windowIndex}`;
  const result = await shell.execute(
    ctx,
    buildHostShellArgs({
      command,
      name: label,
      workingDirectory: "/workspace",
      toolCallId: `sand-${label}`
    })
  );
  if (result.result.case !== "success") {
    throw new SandBoxWindowError(`${label} failed (${result.result.case})`);
  }
  const { exitCode, stderr } = result.result.value;
  if (exitCode === SAND_BOX_WINDOW_UNAVAILABLE_EXIT_CODE) {
    throw new SandBoxNoMonitorAvailableError(
      `${label} could not claim display :${windowIndex}: it is a live fork owned by a different agent`
    );
  }
  if (exitCode !== 0) {
    throw new SandBoxWindowError(`${label} exited ${exitCode}: ${stderr}`);
  }
}
async function runStartWindow(ctx, accessor, windowIndex, ownerToken) {
  await runWindowScript(ctx, accessor, "start-window", windowIndex, {
    ownerToken
  });
}
async function runStopWindow(ctx, accessor, windowIndex) {
  await runWindowScript(ctx, accessor, "stop-window", windowIndex);
}
async function touchSandMonitorBusyLease(ctx, accessor, windowIndex) {
  if (!Number.isInteger(windowIndex) || windowIndex < 1) return;
  try {
    await accessor.get(shellExecutorResource).execute(
      ctx,
      buildHostShellArgs({
        command: `touch /tmp/sand-monitor-busy-${windowIndex}`,
        name: "touch",
        workingDirectory: "/workspace",
        toolCallId: "sand-monitor-busy-lease"
      })
    );
  } catch (error42) {
    reportHostDiagnosticOrStderr({
      kind: "box_monitor_busy_lease_touch_failed",
      errorClass: errorLogTag(error42)
    });
  }
}
function sandBoxWindowKey(agentId, windowIndex) {
  return `${agentId}#${windowIndex}`;
}
function clearAgentWindowConnections(connections, agentId) {
  const prefix = `${agentId}#`;
  for (const key of connections.keys()) {
    if (key.startsWith(prefix)) {
      connections.delete(key);
    }
  }
}
function primarySandBoxWindow(connection) {
  return {
    windowIndex: 1,
    computerUse: connection.remoteAccessor,
    vncUrl: connection.vncUrl
  };
}
function createWindowMcpHost(daemon) {
  let pushed;
  return {
    loadMcpServers: async (ctx, configJson, options2) => {
      if (pushed?.configJson === configJson) {
        return await pushed.load;
      }
      const load2 = daemon.loadMcpServers(ctx, configJson, options2);
      const attempt = { configJson, load: load2 };
      pushed = attempt;
      try {
        return await load2;
      } catch (error42) {
        if (pushed === attempt) pushed = void 0;
        throw error42;
      }
    },
    mcpResourceAccessor: (ctx) => daemon.mcpResourceAccessor(ctx)
  };
}


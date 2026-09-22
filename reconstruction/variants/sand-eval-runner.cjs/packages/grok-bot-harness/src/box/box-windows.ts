/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/grok-bot-harness/src/box/box-windows.ts
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
function envInt(name17, fallback2) {
  const raw = process.env[name17];
  if (raw === void 0 || raw.trim().length === 0) return fallback2;
  const value = Number.parseInt(raw.trim(), 10);
  return Number.isInteger(value) && value > 0 ? value : fallback2;
}
var SAND_BOX_MAX_WINDOWS = envInt("SAND_BOX_MAX_WINDOWS", 100);
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
  } catch (error3) {
    reportHostDiagnosticOrStderr({
      kind: "box_monitor_busy_lease_touch_failed",
      errorClass: errorLogTag(error3)
    });
  }
}


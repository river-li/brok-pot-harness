/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/grok-bot-harness/src/runner/box-reference-docs.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/2
var import_promises51 = require("node:fs/promises");
var import_node_path106 = require("node:path");

// @recovered-fragment 2/2
function settingsRowLink(label, anchor) {
  return `[${label}](${buildSandSettingsDeepLinkUrl(anchor)})`;
}
var SETTINGS_TAB_NAMES = {
  general: "General",
  computer: "Computer",
  usage: "Usage & Billing",
  updates: "Updates"
};
function linkableRowsByTab(anchors) {
  return [...Map.groupBy(anchors, (anchor) => settingsAnchorSection(anchor, null))].map(([section, rows]) => `${SETTINGS_TAB_NAMES[section]}: ${rows.join(", ")}`).join("; ");
}
var SAND_BOX_REFERENCE_DIR = "/home/box/reference";
var LEGACY_SAND_BOX_REFERENCE_DIR = "/home/box/sand-reference";
var DEBUGGING_THE_BOX_FILE = "debugging-the-box.md";
var SAND_APP_UI_FILE = "app-ui.md";
var SAND_BOX_DEBUGGING_REFERENCE_PATH = `${SAND_BOX_REFERENCE_DIR}/${DEBUGGING_THE_BOX_FILE}`;
var SAND_APP_UI_REFERENCE_PATH = `${SAND_BOX_REFERENCE_DIR}/${SAND_APP_UI_FILE}`;
var SAND_BOX_DEBUGGING_REFERENCE_DOC = [
  "# Debugging the box",
  "",
  "When the box acts up (won't start, Shell or Screenshot calls fail, a computerUse subagent reports Computer failures, or the desktop won't render), diagnose it yourself before giving up, and keep the user posted with a plain status instead of going silent.",
  `- Is it up? If a Shell command returns output, the box is running and its daemon is healthy. If a box tool instead comes back saying the computer is still starting up (its image is downloading or it's booting), that's transient: wait a few seconds and retry, since a first boot or image pull can take minutes. If Shell and Screenshot aren't offered to you at all, the box substrate is down; in the local Docker setup that means Docker isn't running, which the user fixes from the app's "computer needs Docker" prompt.`,
  "- Run the self-check. The box ships a box-doctor health check that runs once at startup and on demand: run `box-doctor` over Shell to probe the live box, or read its last startup result at /tmp/box-doctor.log (its summary also lands in the box's startup log alongside the other /tmp logs). It verifies the handful of things that silently break the box (a valid /etc/machine-id, Chrome and its version, DNS/egress, the system clock, and the D-Bus session bus) and prints one `[box-doctor] PASS|FAIL <name>: <detail>` line per check plus a final `[box-doctor] SUMMARY`. When a page or login times out for no clear reason, run this first and report the failing check to the user instead of guessing.",
  "- Desktop not rendering? Capture it with Screenshot to see the real screen, then use Shell only for read-only diagnostics. The primary desktop is display :1, so xdpyinfo -display :1 confirms the X server is up. The desktop comes up with no browser window, so no Chrome process is normal until a computerUse subagent opens it. Each desktop piece logs under /tmp on the box (start-desktop.log for the overall bringup, plus x11vnc:1.log and novnc:1.log), so tail those to see which one failed; a stale X or Chrome lock left over from a wake is a known cause. If Chrome itself will not start, launch it from Shell with the box's own `box-chrome` launcher (never a raw chrome binary), then inspect the resulting process and logs with Shell; don't drive GUI apps from Shell with input automation such as xdotool or Shell CDP.",
  "- Which runtime, and is it healthy? The box runs either as a local Docker container (dev) or a brokered anyrun pod (the shipped default), behind the same Shell and Screenshot surfaces plus the Computer tool delegated to computerUse subagents. Tell them apart by testing for /.dockerenv from Shell (present means Docker, absent means anyrun). On Docker you can inspect the runtime from the shell surface for the user's computer with docker ps, docker logs, and docker inspect on the sand-box- container, and a stopped Docker daemon is why the box won't come up. On anyrun the pod's lifecycle is managed server-side, so there's nothing to inspect locally; lean on the in-box probes above.",
  "- Commands failing? Check the basics over Shell: df -h /workspace for disk (your persistent scratch space) plus the command's own error text. Files and installed tools persist across turns, so a tool that went missing just needs reinstalling.",
  `- Next steps: retry first, since most failures are just a box still booting. You can't rebuild the box yourself, so if it's wedged or stuck on a stale image, surface a clear status and tell the user to recover it with ${settingsRowLink("Update Grok Bot's Computer", "update-computer")} (its button says "Update") \u2014 it moves the box to a fresh instance while keeping files and logins, and can unstick a wedged box. Installed software (apt/npm/pip packages, CLIs, docker images) does not survive the move, so tell the user that up front and reinstall what you need after. That is the recovery action to point users at; the ${settingsRowLink("Reset Grok Bot's Computer", "reset-computer")} row below it restores from the last saved snapshot and can lose recent unsynced work, so never direct the user to it. request_box_help is for handing the user a manual step on a working desktop (a login or captcha), not a repair tool.`,
  ""
].join("\n");
function sandAppUiReferenceDoc(visibility = {}) {
  const extras = [
    ...visibility.chromeCookieImport === true ? ["cookie import"] : [],
    ...visibility.boxEgressTunnel === true ? [settingsRowLink("Route egress through this desktop", "egress")] : []
  ];
  const computerLead = extras.length === 0 ? "registered machines and box recovery" : `registered machines, ${extras.join(", ")}, and box recovery`;
  const settingsTabs = Object.values(SETTINGS_TAB_NAMES).join(", ");
  const taughtAnchors = taughtSettingsAnchorIds(visibility);
  return [
    "# The Grok Bot app UI (real paths \u2014 never invent others)",
    "",
    `A compact map of Grok Bot's real interface so you can guide the user or self-recover. Use only what's listed here; for anything else, follow "Never fabricate data" and say you're unsure rather than inventing a path.`,
    `- Opening settings: the sidebar account button at the bottom-left (avatar + account name), the Cmd+, shortcut, or the command palette's "Open settings". There's no gear icon or macOS Preferences menu item.`,
    `- Deleting an agent: the user does this from the sidebar \u2014 right-click the agent's row and choose "Delete" (a permanent delete that removes the agent and its transcript, with a confirm). It's not in Settings; there's no archive or hide, just this permanent delete.`,
    `- Settings tabs: ${settingsTabs}. Usage & Billing appears only when enabled for the current account. Rows you can link by anchor: ${linkableRowsByTab(taughtAnchors)}. Some rows exist only on some accounts, builds, or states; if the user cannot find a row, say so.`,
    `- General: the account card ("Sign In with Cursor" / "Sign Out"), appearance controls (${settingsRowLink("Theme", "theme")} with Follow System / Light / Dark and ${settingsRowLink("Language", "language")}), system controls, agent defaults, and security keys.`,
    `- Computer: ${computerLead}. Recovery is ${settingsRowLink("Update Grok Bot's Computer", "update-computer")} (its button says "Update"; it moves the box to a fresh instance keeping files and logins, but installed software must be reinstalled), a two-click confirm ("Click Again to Confirm"). The ${settingsRowLink("Reset Grok Bot's Computer", "reset-computer")} row (button "Reset") is the destructive recovery of last resort: it restores from the last saved snapshot and can lose recent unsynced work, so steer users to Update instead.`,
    "- Usage & Billing: included and on-demand usage plus plan controls.",
    `- Updates: ${settingsRowLink("Update Track", "update-channel")} (Stable / Nightly) and "Check for Updates", which update the Grok Bot app itself, distinct from ${settingsRowLink("Update Grok Bot's Computer", "update-computer")} (which recreates the box).`,
    `- Per-agent info pane (separate from the global Settings): open it by clicking the agent's name in the chat header (or Cmd+Shift+I), close it with the "X" in the pane's own header. It shows a live preview of that agent's computer (click it to open the full screen view) over its Routines list, plus Channels when a channel connector is available to connect or one is already connected, and Members in group chats. The gear beside the "X" opens a per-agent Settings subpage (avatar, name, title, description, and per-assistant notifications).`,
    ""
  ].join("\n");
}
var SAND_APP_UI_REFERENCE_DOC = sandAppUiReferenceDoc();
async function writeSandBoxReferenceDocs(referenceDir = SAND_BOX_REFERENCE_DIR, visibility = {}) {
  const encoder2 = new TextEncoder();
  const written = [];
  const docs = [
    { fileName: DEBUGGING_THE_BOX_FILE, contents: SAND_BOX_DEBUGGING_REFERENCE_DOC },
    { fileName: SAND_APP_UI_FILE, contents: sandAppUiReferenceDoc(visibility) }
  ];
  for (const doc of docs) {
    const path31 = (0, import_node_path106.join)(referenceDir, doc.fileName);
    await writeFileAtomic(path31, encoder2.encode(doc.contents));
    written.push(path31);
  }
  return written;
}
async function provisionSandBoxPromptArtifacts() {
  const outcomes = await Promise.allSettled([
    getSandRootDir() === SAND_BOX_DATA_ROOT ? ensureDataRootAlias({
      dataRoot: SAND_BOX_DATA_ROOT,
      aliasPath: SAND_BOX_MODEL_VISIBLE_DATA_ROOT
    }) : Promise.resolve(),
    writeSandBoxReferenceDocs(),
    (0, import_promises51.rm)(LEGACY_SAND_BOX_REFERENCE_DIR, { recursive: true, force: true })
  ]);
  const failed2 = outcomes.find(
    (outcome) => outcome.status === "rejected"
  );
  if (failed2 != null) throw failed2.reason;
}


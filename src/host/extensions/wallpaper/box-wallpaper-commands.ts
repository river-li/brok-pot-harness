/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/host/extensions/wallpaper/box-wallpaper-commands.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var import_node_child_process15 = require("node:child_process");
var import_node_fs98 = require("node:fs");
var import_promises80 = require("node:fs/promises");
var import_node_path175 = require("node:path");
var import_node_util15 = require("node:util");
var runCommand2 = (0, import_node_util15.promisify)(import_node_child_process15.execFile);
var SAND_WALLPAPER_COMMAND = "/usr/local/bin/sand-wallpaper";
var SAND_WALLPAPER_TONE_SCRIPT = "/usr/local/bin/sand-wallpaper-tone.mjs";
var X_SOCKET_DIR = "/tmp/.X11-unix";
var COMMAND_TIMEOUT_MS2 = 1e4;
var X_SOCKET_NAME = /^X(\d+)$/;
function parseTonePlan(stdout) {
  const [tone, seconds, ...rest] = stdout.trim().split(/\s+/);
  if (tone === void 0 || seconds === void 0 || rest.length > 0) return void 0;
  if (!/^[a-z]+$/.test(tone) || !/^\d+$/.test(seconds)) return void 0;
  return { tone, msUntilNextBoundary: Number(seconds) * 1e3 };
}
async function readLiveDisplays(socketDir) {
  const entries = await (0, import_promises80.readdir)(socketDir).catch(() => []);
  const numbers = entries.flatMap((entry) => {
    const num = X_SOCKET_NAME.exec(entry)?.[1];
    return num !== void 0 ? [num] : [];
  }).sort((left, right) => Number(left) - Number(right));
  const displays = [];
  for (const num of numbers) {
    const stats = (0, import_node_fs98.lstatSync)((0, import_node_path175.join)(socketDir, `X${num}`), { throwIfNoEntry: false });
    if (stats === void 0 || !stats.isSocket()) continue;
    displays.push({ display: `:${num}`, uid: stats.uid, gid: stats.gid });
  }
  return displays;
}
function createBoxWallpaperCommands(options2) {
  const nodePath = options2.nodePath ?? process.execPath;
  const toneScriptPath = options2.toneScriptPath ?? SAND_WALLPAPER_TONE_SCRIPT;
  const wallpaperCommandPath = options2.wallpaperCommandPath ?? SAND_WALLPAPER_COMMAND;
  const xSocketDir = options2.xSocketDir ?? X_SOCKET_DIR;
  return {
    isAvailable: (0, import_node_fs98.existsSync)(toneScriptPath) && (0, import_node_fs98.existsSync)(wallpaperCommandPath),
    async resolvePlan() {
      const result = await runCommand2(nodePath, [toneScriptPath, options2.settingsPath], {
        timeout: COMMAND_TIMEOUT_MS2
      }).catch((error42) => {
        options2.log(`wallpaper: tone helper failed (${describe2(error42)})`);
        return void 0;
      });
      if (result === void 0) return void 0;
      const plan = parseTonePlan(result.stdout);
      if (plan === void 0) {
        options2.log(`wallpaper: tone helper printed an unusable plan`);
      }
      return plan;
    },
    async paint() {
      try {
        for (const { display, uid, gid } of await readLiveDisplays(xSocketDir)) {
          await runCommand2(wallpaperCommandPath, ["paint", display], {
            timeout: COMMAND_TIMEOUT_MS2,
            ...asDisplayOwner({ uid, gid })
          }).catch((error42) => {
            options2.log(`wallpaper: paint of ${display} failed (${describe2(error42)})`);
          });
        }
      } catch (error42) {
        options2.log(`wallpaper: reading live displays failed (${describe2(error42)})`);
      }
    }
  };
}
function asDisplayOwner(owner) {
  const self2 = process.getuid?.();
  if (self2 !== 0 || owner.uid === self2 && owner.gid === process.getgid?.()) return {};
  return owner;
}
function describe2(error42) {
  return error42 instanceof Error ? error42.message : String(error42);
}


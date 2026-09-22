/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/local-exec/dist/computer-use/display.js
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var import_node_child_process7 = require("node:child_process");
var import_node_util6 = require("node:util");
init_dist3();
var execFileAsync2 = (0, import_node_util6.promisify)(import_node_child_process7.execFile);
var execFileUtf8Async = execFileAsync2;
var execFileSyncUtf8 = import_node_child_process7.execFileSync;
function parseDisplayNum(display) {
  const colonIndex = display.lastIndexOf(":");
  if (colonIndex === -1) {
    throw new Error(`Invalid X11 display string: ${display} (missing ':')`);
  }
  const afterColon = display.slice(colonIndex + 1);
  const numStr = afterColon.split(".")[0];
  const num = parseInt(numStr, 10);
  if (!Number.isFinite(num) || num < 0) {
    throw new Error(`Invalid X11 display number in: ${display} (parsed: ${numStr})`);
  }
  return num;
}
function parseXrandrOutput(output) {
  let width;
  let height;
  let refreshRate;
  for (const line of output.split("\n")) {
    if (line.includes("*")) {
      const resMatch = line.trim().match(/^(\d+)x(\d+)/);
      if (resMatch) {
        width = parseInt(resMatch[1], 10);
        height = parseInt(resMatch[2], 10);
      }
      const rateMatch = line.match(/(\d+(?:\.\d+)?)\*(?:\+)?/);
      if (rateMatch) {
        const rate = parseFloat(rateMatch[1]);
        if (rate > 0 && rate <= 500) {
          refreshRate = Math.round(rate);
        }
      }
      if (width && height) {
        break;
      }
    }
  }
  if (!width || !height) {
    const currentMatch = output.match(/current\s+(\d+)\s*x\s*(\d+)/i);
    if (currentMatch) {
      width = parseInt(currentMatch[1], 10);
      height = parseInt(currentMatch[2], 10);
    }
  }
  if (!width || !height) {
    throw new Error(`Could not detect display resolution from xrandr output.
Expected a line with '*' indicating active mode, or 'current WxH'.
xrandr output:
${output}`);
  }
  if (!refreshRate) {
    refreshRate = 60;
  }
  return { width, height, refreshRate };
}
var DEFAULT_COMPUTER_USE_API_WIDTH = 1280;
var DEFAULT_COMPUTER_USE_DISPLAY_WIDTH = 1920;
var DEFAULT_COMPUTER_USE_DISPLAY_HEIGHT = 1200;
function computerUseApiCanvas(args = {}) {
  const displayWidth = args.displayWidth ?? DEFAULT_COMPUTER_USE_DISPLAY_WIDTH;
  const displayHeight = args.displayHeight ?? DEFAULT_COMPUTER_USE_DISPLAY_HEIGHT;
  const width = args.apiWidth ?? DEFAULT_COMPUTER_USE_API_WIDTH;
  return {
    width,
    height: Math.round(width * displayHeight / displayWidth)
  };
}
function resolutionConfigForDisplay(displayWidth, displayHeight, apiWidth, apiHeight) {
  const api = computerUseApiCanvas({
    displayWidth,
    displayHeight,
    apiWidth
  });
  return {
    display: { width: displayWidth, height: displayHeight },
    api: {
      width: api.width,
      height: apiHeight ?? api.height
    }
  };
}
function ffmpegScreenshotScaleArgs(displayWidth, displayHeight, apiWidth, apiHeight) {
  if (apiWidth === displayWidth && apiHeight === displayHeight) {
    return [];
  }
  return ["-vf", `scale=${apiWidth}:${apiHeight}`];
}
async function detectDisplay(display) {
  const { stdout } = await spawnWorkload(execFileUtf8Async, "xrandr", ["--display", display], {
    timeout: 5e3,
    encoding: "utf8"
  });
  const info2 = parseXrandrOutput(stdout);
  const resolution = resolutionConfigForDisplay(info2.width, info2.height);
  return {
    display: info2,
    resolution,
    resolutionString: `${info2.width}x${info2.height}`
  };
}
function detectDisplaySync(display) {
  const stdout = spawnWorkload(execFileSyncUtf8, "xrandr", ["--display", display], {
    encoding: "utf-8",
    timeout: 5e3
  });
  const info2 = parseXrandrOutput(stdout);
  const resolution = resolutionConfigForDisplay(info2.width, info2.height);
  return {
    display: info2,
    resolution,
    resolutionString: `${info2.width}x${info2.height}`
  };
}
var DEFAULT_WAIT_TIMEOUT_MS = 3e4;
var POLL_INTERVAL_MS = 500;
function isX11Installed() {
  try {
    spawnWorkload(import_node_child_process7.execFileSync, "xdpyinfo", ["-version"], {
      stdio: "ignore",
      timeout: 500
    });
    return true;
  } catch {
    return false;
  }
}
async function waitForDisplay(display, timeoutMs = DEFAULT_WAIT_TIMEOUT_MS) {
  if (!isX11Installed()) {
    throw new Error(`X11 is not installed (xdpyinfo not found in PATH). Cannot wait for display ${display}.`);
  }
  const startTime = Date.now();
  while (Date.now() - startTime < timeoutMs) {
    try {
      await spawnWorkload(execFileAsync2, "xdpyinfo", ["-display", display], {
        timeout: 2e3
      });
      return;
    } catch {
      await new Promise((resolve14) => setTimeout(resolve14, POLL_INTERVAL_MS));
    }
  }
  throw new Error(`Timed out waiting for X11 display ${display} after ${timeoutMs}ms`);
}


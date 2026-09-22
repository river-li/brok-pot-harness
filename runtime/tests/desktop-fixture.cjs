/* Control only an Electron instance launched by this test, never another app. */
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const net = require("node:net");
const { spawn, execFileSync } = require("node:child_process");
const { pathToFileURL } = require("node:url");
const { setTimeout: delay } = require("node:timers/promises");

async function freePort() {
  const server = net.createServer();
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const port = server.address().port;
  await new Promise((resolve) => server.close(resolve));
  return port;
}
async function desktopFixture({
  root,
  profile,
  base,
  token,
  enableVoice = false,
  extraArgs = [],
}) {
  fs.mkdirSync(profile, { recursive: true });
  const port = await freePort();
  const log = fs.openSync(path.join(profile, "desktop.log"), "a", 0o600);
  const env = {
    ...process.env,
    GROKBOT_LOCAL_MODE: "1",
    GROKBOT_LOCAL_VOICE: enableVoice ? "1" : "0",
    SAND_BACKEND_URL: "http://127.0.0.1:9",
    SAND_USER_DATA_DIR: profile,
    SAND_HOST_GATEWAY_URL: base,
    SAND_HOST_GATEWAY_TOKEN: token,
    SAND_DEV_BOX_CONTROL_PLANE: "0",
    SAND_ATTACH_PROD_BOX: "0",
    SAND_DEV_CONTROL_PORT: String(await freePort()),
    SAND_DISABLE_TELEMETRY: "1",
    SAND_DISABLE_ANALYTICS: "1",
  };
  delete env.ELECTRON_RUN_AS_NODE;
  delete env.LITELLM_API_KEY;
  const child = spawn(
    require("electron"),
    [
      path.join(root, ".runtime/desktop"),
      `--user-data-dir=${profile}`,
      "--remote-debugging-address=127.0.0.1",
      `--remote-debugging-port=${port}`,
      ...extraArgs,
    ],
    { env, stdio: ["ignore", log, log] },
  );
  let socket, command;
  const pending = new Map();
  const waitFor = async (predicate, timeout, label) => {
    const deadline = Date.now() + timeout;
    while (Date.now() < deadline) {
      assert.equal(
        child.exitCode,
        null,
        "The test desktop exited unexpectedly",
      );
      if (await predicate()) return;
      await delay(200);
    }
    throw Error(`Timed out waiting for ${label}`);
  };
  async function close() {
    let daemonPid;
    try {
      daemonPid = JSON.parse(
        fs.readFileSync(
          path.join(profile, "sand-data/local-exec-daemon.json"),
          "utf8",
        ),
      ).pid;
    } catch {}
    if (socket?.readyState === WebSocket.OPEN)
      await command("Browser.close").catch(() => {});
    socket?.close();
    for (const item of pending.values()) clearTimeout(item.timer);
    if (child.exitCode === null) {
      child.kill("SIGTERM");
      await Promise.race([
        new Promise((resolve) => child.once("exit", resolve)),
        delay(5000),
      ]);
      if (child.exitCode === null) child.kill("SIGKILL");
    }
    // A short UI failure can close the window while its daemon is still being
    // registered. Read this private profile again after Electron has exited.
    if (!Number.isSafeInteger(daemonPid)) {
      try {
        daemonPid = JSON.parse(
          fs.readFileSync(
            path.join(profile, "sand-data/local-exec-daemon.json"),
            "utf8",
          ),
        ).pid;
      } catch {}
    }
    if (Number.isSafeInteger(daemonPid)) {
      try {
        const executable = execFileSync(
          "ps",
          ["-p", String(daemonPid), "-o", "command="],
          { encoding: "utf8" },
        ).trim();
        if (
          executable.endsWith(
            path.join(root, ".runtime/desktop/dist/local-exec-daemon/main.cjs"),
          )
        )
          process.kill(daemonPid, "SIGTERM");
      } catch {}
    }
    fs.closeSync(log);
  }
  try {
    let page;
    await waitFor(
      async () => {
        try {
          const pages = await fetch(`http://127.0.0.1:${port}/json/list`, {
            signal: AbortSignal.timeout(1000),
          }).then((r) => r.json());
          page = pages.find(
            (p) =>
              p.type === "page" &&
              p.url ===
                pathToFileURL(
                  path.join(root, ".runtime/desktop/dist/renderer/index.html"),
                ).href,
          );
          return !!page;
        } catch {
          return false;
        }
      },
      30000,
      "the rebuilt test window",
    );
    socket = new WebSocket(page.webSocketDebuggerUrl);
    await new Promise((resolve, reject) => {
      socket.addEventListener("open", resolve, { once: true });
      socket.addEventListener("error", reject, { once: true });
    });
    let sequence = 0;
    socket.addEventListener("message", (event) => {
      const message = JSON.parse(event.data),
        item = pending.get(message.id);
      if (!item) return;
      pending.delete(message.id);
      clearTimeout(item.timer);
      if (message.error) item.reject(Error(message.error.message));
      else item.resolve(message.result);
    });
    command = (method, params = {}) =>
      new Promise((resolve, reject) => {
        const id = ++sequence;
        const timer = setTimeout(() => {
          pending.delete(id);
          reject(Error(`${method} timed out`));
        }, 10000);
        pending.set(id, { resolve, reject, timer });
        socket.send(JSON.stringify({ id, method, params }));
      });
    const evaluate = async (expression) => {
      const result = await command("Runtime.evaluate", {
        expression,
        returnByValue: true,
        awaitPromise: true,
      });
      assert.equal(
        result.exceptionDetails,
        undefined,
        "Renderer evaluation failed",
      );
      return result.result?.value;
    };
    const clickElement = async (expression) => {
      const point = await evaluate(`(() => {
        const element = (${expression});
        if (!element || element.disabled || element.closest('[inert]') || getComputedStyle(element).visibility !== 'visible') return null;
        for (let parent = element; parent; parent = parent.parentElement) {
          if (parent.getAnimations().some(a => a.playState === 'running' && a.effect?.getTiming().iterations !== Infinity)) return null;
        }
        element.scrollIntoView({block: 'center'});
        const r = element.getBoundingClientRect();
        return r.width > 0 && r.height > 0 ? {x:r.x+r.width/2, y:r.y+r.height/2} : null;
      })()`);
      if (!point) return false;
      await command("Input.dispatchMouseEvent", {
        type: "mouseMoved",
        ...point,
      });
      await command("Input.dispatchMouseEvent", {
        type: "mousePressed",
        ...point,
        button: "left",
        clickCount: 1,
      });
      await command("Input.dispatchMouseEvent", {
        type: "mouseReleased",
        ...point,
        button: "left",
        clickCount: 1,
      });
      return true;
    };
    const click = (label) =>
      clickElement(
        `[...document.querySelectorAll('button')].find(b => (b.getAttribute('aria-label') === ${JSON.stringify(label)} || b.innerText.trim() === ${JSON.stringify(label)}) && !b.closest('[inert]') && b.getBoundingClientRect().width > 0 && getComputedStyle(b).visibility === 'visible')`,
      );
    const screenshot = async (filename) => {
      const result = await command("Page.captureScreenshot", { format: "png" });
      fs.writeFileSync(filename, Buffer.from(result.data, "base64"), {
        mode: 0o600,
      });
    };
    const pressEscape = async () => {
      for (const type of ["keyDown", "keyUp"])
        await command("Input.dispatchKeyEvent", {type, key:"Escape", code:"Escape", windowsVirtualKeyCode:27, nativeVirtualKeyCode:27});
    };
    return { evaluate, click, clickElement, screenshot, waitFor, close, pressEscape };
  } catch (error) {
    await close();
    throw error;
  }
}
module.exports = { desktopFixture, freePort };

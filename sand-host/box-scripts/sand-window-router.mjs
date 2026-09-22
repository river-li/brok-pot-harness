import http from "node:http";
import { readFileSync } from "node:fs";
import { Buffer } from "node:buffer";
import { timingSafeEqual } from "node:crypto";
import { pathToFileURL } from "node:url";

// >>> box port table (from sand/src/shared/box/box-contract.ts; regenerate: pnpm --filter sand run gen:box-ports) >>>
export const SAND_BOX_DISPLAY_HEADER = "x-sand-display";
export const SAND_BOX_WINDOW_OWNER_HEADER = "x-sand-window-owner";
export const WINDOW_TOKEN_DIR = "/tmp/sand-window-tokens.d";
export const DEFAULT_LISTEN_PORT = 1339;
export const DEFAULT_PRIMARY_PORT = 1337;
export const DEFAULT_FORK_EXEC_BASE = 14000;
// <<< box port table <<<

function firstHeader(raw) {
  return Array.isArray(raw) ? raw[0] : raw;
}

export function parseDisplayNumber(raw) {
  const value = firstHeader(raw);
  const num = Number.parseInt(value ?? "1", 10);
  return Number.isInteger(num) ? num : 1;
}

export function tokensMatch(a, b) {
  if (typeof a !== "string" || typeof b !== "string") return false;
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length === 0 || ab.length !== bb.length) return false;
  return timingSafeEqual(ab, bb);
}

export function decideWindowRoute({
  displayHeader,
  ownerHeader,
  primaryPort,
  execBase,
  lookupBoundToken,
}) {
  const display = parseDisplayNumber(displayHeader);
  if (display <= 1) return { port: primaryPort };
  const owner = firstHeader(ownerHeader);
  const bound = lookupBoundToken(display);
  if (bound === undefined || !tokensMatch(owner, bound)) {
    return {
      reject: {
        status: 403,
        message: `sand-window-router: forbidden (display :${display} owner-token mismatch)`,
      },
    };
  }
  return { port: execBase + display };
}

function readBoundToken(display) {
  try {
    const raw = readFileSync(`${WINDOW_TOKEN_DIR}/${display}`, "utf8").trim();
    return raw.length > 0 ? raw : undefined;
  } catch {
    return undefined;
  }
}

export function createWindowRouterServer({
  primaryPort,
  execBase,
  lookupBoundToken = readBoundToken,
}) {
  const server = http.createServer((req, res) => {
    const decision = decideWindowRoute({
      displayHeader: req.headers[SAND_BOX_DISPLAY_HEADER],
      ownerHeader: req.headers[SAND_BOX_WINDOW_OWNER_HEADER],
      primaryPort,
      execBase,
      lookupBoundToken,
    });
    if (decision.reject !== undefined) {
      if (!res.headersSent) {
        res.writeHead(decision.reject.status, { "content-type": "text/plain" });
      }
      res.end(decision.reject.message);
      req.resume();
      return;
    }
    const upstream = http.request(
      {
        host: "127.0.0.1",
        port: decision.port,
        method: req.method,
        path: req.url,
        headers: req.headers,
      },
      (upstreamRes) => {
        res.writeHead(upstreamRes.statusCode ?? 502, upstreamRes.headers);
        upstreamRes.pipe(res);
        endCallerStreamWhenDaemonDropsMidResponse(upstreamRes, res);
      },
    );
    upstream.on("error", (err) => {
      if (res.destroyed) return;
      if (!res.headersSent) res.writeHead(502, { "content-type": "text/plain" });
      res.end(`sand-window-router upstream error: ${String(err)}`);
    });
    forwardCallerHangUpToDaemon(res, upstream);
    req.pipe(upstream);
  });
  server.timeout = 0;
  return server;
}

function forwardCallerHangUpToDaemon(res, upstream) {
  res.on("close", () => {
    const callerHungUpBeforeResponseFinished = !res.writableFinished;
    if (callerHungUpBeforeResponseFinished) upstream.destroy();
  });
}

function endCallerStreamWhenDaemonDropsMidResponse(upstreamRes, res) {
  upstreamRes.on("error", () => res.destroy());
}

function main() {
  const LISTEN_PORT = Number(process.argv[2] || DEFAULT_LISTEN_PORT);
  const PRIMARY_PORT = Number(process.argv[3] || DEFAULT_PRIMARY_PORT);
  const EXEC_BASE = Number(process.argv[4] || DEFAULT_FORK_EXEC_BASE);

  const server = createWindowRouterServer({
    primaryPort: PRIMARY_PORT,
    execBase: EXEC_BASE,
  });
  server.listen(LISTEN_PORT, "0.0.0.0", () => {
    process.stdout.write(
      `sand-window-router listening pid=${process.pid} port=${LISTEN_PORT} primary=${PRIMARY_PORT} fork_base=${EXEC_BASE} (owner-token enforced)\n`,
    );
  });
}

if (process.argv[1] != null && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main();
}

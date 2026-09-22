/** Voice sockets share the authenticated local gateway's listening socket.
 * The renderer gets a one-use, one-minute ticket, never a model/gateway key.
 */
import { randomBytes, timingSafeEqual } from "node:crypto";
import type { IncomingMessage, Server, ServerResponse } from "node:http";
import type { Duplex } from "node:stream";
import { WebSocketServer, WebSocket } from "ws";
import { LocalVoiceCall, type VoicePorts } from "./voice-call.js";

export const LOCAL_VOICE_MODEL = "grokbot-local-voice";
export function attachLocalVoiceServer(
  server: Server,
  authToken: string,
  ports?: VoicePorts,
) {
  const tickets = new Map<string, number>();
  const sockets = new WebSocketServer({
    noServer: true,
    maxPayload: 256 * 1024,
    perMessageDeflate: false,
    handleProtocols: (protocols) =>
      [...protocols].find((p) => p.startsWith("grokbot-voice.")) ?? false,
  });
  const calls = new Map<WebSocket, LocalVoiceCall>();
  const timers = new Map<WebSocket, ReturnType<typeof setTimeout>>();
  let closed = false;
  const authorized = (request: IncomingMessage) => {
    const supplied = Buffer.from(request.headers.authorization ?? ""),
      expected = Buffer.from(`Bearer ${authToken}`);
    return (
      authToken.length > 0 &&
      supplied.length === expected.length &&
      timingSafeEqual(supplied, expected)
    );
  };
  const json = (response: ServerResponse, status: number, value: unknown) => {
    response.writeHead(status, {
      "content-type": "application/json",
      "cache-control": "no-store",
    });
    response.end(JSON.stringify(value));
  };
  const upgrade = (request: IncomingMessage, socket: Duplex, head: Buffer) => {
    const reject = (code: number) =>
      socket.end(
        `HTTP/1.1 ${code} Rejected\r\nConnection: close\r\nContent-Length: 0\r\n\r\n`,
      );
    try {
      const url = new URL(request.url ?? "/", "http://localhost");
      if (
        closed ||
        url.pathname !== "/local/voice" ||
        url.searchParams.get("model") !== LOCAL_VOICE_MODEL
      ) {
        reject(404);
        return;
      }
      if (
        request.headers.origin != null &&
        !["null", "file://"].includes(request.headers.origin)
      ) {
        reject(403);
        return;
      }
      const protocols = String(request.headers["sec-websocket-protocol"] ?? "")
        .split(",")
        .map((p) => p.trim());
      const ticket =
        protocols.length === 1 && protocols[0]!.startsWith("grokbot-voice.")
          ? protocols[0]!.slice(14)
          : "";
      const expires = tickets.get(ticket);
      tickets.delete(ticket);
      if (!expires || expires < Date.now()) {
        reject(401);
        return;
      }
      if (calls.size >= 2) {
        reject(429);
        return;
      }
      sockets.handleUpgrade(request, socket, head, (ws) => {
        const finish = (reason: string) => ws.close(1000, reason.slice(0, 100));
        const call = new LocalVoiceCall(
          (event) => {
            if (ws.readyState !== WebSocket.OPEN) return;
            if (ws.bufferedAmount > 4 * 1024 * 1024) {
              ws.terminate();
              return;
            }
            ws.send(JSON.stringify(event));
          },
          finish,
          ports,
        );
        calls.set(ws, call);
        const timeout = setTimeout(
          () => {
            call.close();
            finish("Local call reached its 90-minute limit.");
          },
          90 * 60 * 1000,
        );
        timeout.unref();
        timers.set(ws, timeout);
        ws.on("message", (data, isBinary) => {
          if (isBinary) {
            call.close();
            finish("Only JSON voice frames are supported.");
            return;
          }
          try {
            call.receive(JSON.parse(data.toString()));
          } catch {
            call.close();
            finish("Invalid voice frame.");
          }
        });
        ws.on("error", () => call.close());
        ws.on("close", () => {
          call.close();
          calls.delete(ws);
          clearTimeout(timers.get(ws));
          timers.delete(ws);
        });
      });
    } catch {
      reject(400);
    }
  };
  server.on("upgrade", upgrade);
  return {
    handleRequest(request: IncomingMessage, response: ServerResponse) {
      if (
        request.url !== "/local/voice/credential" ||
        request.method !== "POST"
      )
        return false;
      if (closed) {
        json(response, 503, { error: "Local voice is unavailable." });
        return true;
      }
      if (request.headers.origin != null) {
        json(response, 403, {
          error: "Browser-origin credential requests are not allowed.",
        });
        return true;
      }
      if (!authorized(request)) {
        json(response, 401, { error: "Unauthorized." });
        return true;
      }
      if (
        request.headers["transfer-encoding"] ||
        Number(request.headers["content-length"] ?? 0) > 1024
      ) {
        json(response, 413, { error: "Invalid credential request size." });
        return true;
      }
      request.resume();
      for (const [ticket, expires] of tickets)
        if (expires < Date.now()) tickets.delete(ticket);
      if (tickets.size >= 32 || calls.size >= 2) {
        json(response, 429, { error: "Local voice is busy." });
        return true;
      }
      const ticket = randomBytes(32).toString("hex"),
        expires = Date.now() + 60000;
      tickets.set(ticket, expires);
      json(response, 200, {
        clientSecret: ticket,
        expiresAtUnixSeconds: Math.floor(expires / 1000),
        model: LOCAL_VOICE_MODEL,
      });
      return true;
    },
    close() {
      closed = true;
      tickets.clear();
      server.off("upgrade", upgrade);
      for (const [ws, call] of calls) {
        call.close();
        clearTimeout(timers.get(ws));
        ws.terminate();
      }
      calls.clear();
      timers.clear();
      sockets.close();
    },
  };
}

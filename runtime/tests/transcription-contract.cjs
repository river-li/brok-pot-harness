const { test } = require("node:test");
const assert = require("node:assert/strict");
const http = require("node:http");
const { gzipSync } = require("node:zlib");
const {
  createLocalTranscribeService,
  createDesktopTranscribeService,
} = require("../../dist/local/transcription.js");

async function fixture(t, handler) {
  const server = http.createServer(handler);
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  t.after(() => {
    server.closeAllConnections();
    return new Promise((resolve) => server.close(resolve));
  });
  return `http://127.0.0.1:${server.address().port}`;
}
function reply(res, body) {
  res.writeHead(200, { "content-type": "application/json" });
  res.end(JSON.stringify(body));
}
const recording = {
  audio: Uint8Array.from([0, 1, 255, 2, 128]),
  mimeType: "audio/webm;codecs=opus",
  language: "zh",
};

test("Desktop routes binary audio through the authenticated local gateway", async (t) => {
  let seen;
  const baseUrl = await fixture(t, async (req, res) => {
    const chunks = [];
    for await (const c of req) chunks.push(c);
    seen = {
      url: req.url,
      headers: req.headers,
      body: JSON.parse(Buffer.concat(chunks)),
    };
    reply(res, { text: "你好", transcriptionTimeMs: 12 });
  });
  assert.deepEqual(
    await createDesktopTranscribeService({
      baseUrl,
      token: "local-gateway-fixture",
    })(recording),
    { text: "你好", transcriptionTimeMs: 12 },
  );
  assert.equal(seen.url, "/api/transcribeAudio");
  assert.equal(seen.headers.authorization, "Bearer local-gateway-fixture");
  assert.deepEqual(seen.body, {
    audioBase64: Buffer.from(recording.audio).toString("base64"),
    mimeType: recording.mimeType,
    language: "zh",
  });
});

test("Host forwards actual audio bytes and language without model or gateway credentials", async (t) => {
  let seen;
  const baseUrl = await fixture(t, async (req, res) => {
    const chunks = [];
    for await (const c of req) chunks.push(c);
    seen = { url: req.url, headers: req.headers, body: Buffer.concat(chunks) };
    reply(res, { text: "hello", transcriptionTimeMs: 1 });
  });
  await createLocalTranscribeService({ baseUrl, token: "must-not-forward" })(
    recording,
  );
  assert.equal(seen.url, "/transcribe");
  assert.equal(seen.headers.authorization, undefined);
  assert.equal(seen.headers.cookie, undefined);
  assert.equal(seen.headers["content-type"], "audio/webm");
  assert.equal(seen.headers["x-transcription-language"], "zh");
  assert.deepEqual(seen.body, Buffer.from(recording.audio));
});

test("Transcription validates input and rejects invalid or credentialed service addresses", async () => {
  const transcribe = createLocalTranscribeService({
    baseUrl: "http://127.0.0.1:9",
  });
  for (const audio of [new Uint8Array(), new Uint8Array(25 * 1024 * 1024 + 1)])
    await assert.rejects(
      transcribe({ ...recording, audio }),
      /between 1 byte and 25 MiB/,
    );
  await assert.rejects(
    transcribe({ ...recording, mimeType: "text/html" }),
    /Unsupported audio media type/,
  );
  await assert.rejects(
    transcribe({ ...recording, language: "zh\r\nother: header" }),
    /Invalid transcription language/,
  );
  for (const baseUrl of [
    "file:///tmp",
    "http://user:password@example.com",
    "http://example.com/?token=hidden",
  ])
    assert.throws(
      () => createLocalTranscribeService({ baseUrl }),
      /HTTP\(S\) base URL without credentials/,
    );
});

test("Transcription accepts silence, validates result shape and bounds decoded responses", async (t) => {
  let body = { text: "", transcriptionTimeMs: 0 },
    compressed = false;
  const baseUrl = await fixture(t, (_req, res) => {
    if (compressed) {
      const data = gzipSync(
        JSON.stringify({
          text: "x".repeat(1024 * 1024 + 1),
          transcriptionTimeMs: 2,
        }),
      );
      res.writeHead(200, {
        "content-type": "application/json",
        "content-encoding": "gzip",
        "content-length": data.length,
      });
      res.end(data);
    } else reply(res, body);
  });
  const transcribe = createLocalTranscribeService({ baseUrl });
  assert.deepEqual(await transcribe(recording), body);
  for (body of [
    null,
    { text: "private-provider-text", transcriptionTimeMs: -1 },
    { text: 1, transcriptionTimeMs: 0 },
    { text: "private-provider-text" },
  ])
    await assert.rejects(
      transcribe(recording),
      /^Error: Local transcription returned an invalid response\.$/,
    );
  compressed = true;
  await assert.rejects(
    transcribe(recording),
    /response exceeds the size limit/,
  );
});

test("Transcription sanitizes HTTP errors, rejects redirects and preserves cancellation", async (t) => {
  let mode = "error";
  const baseUrl = await fixture(t, (_req, res) => {
    if (mode === "stall") return;
    if (mode === "stream") {
      res.writeHead(200, { "content-type": "application/json" });
      res.write("{");
      return;
    }
    res.writeHead(mode === "redirect" ? 302 : 503, {
      location: "http://127.0.0.1:9",
    });
    res.end("secret-provider-body");
  });
  const transcribe = createLocalTranscribeService({ baseUrl });
  await assert.rejects(
    transcribe(recording),
    (error) =>
      /HTTP 503/.test(error.message) &&
      !error.message.includes("secret-provider-body"),
  );
  mode = "redirect";
  await assert.rejects(
    transcribe(recording),
    /Local transcription is unavailable/,
  );
  for (mode of ["stall", "stream"]) {
    await assert.rejects(
      createLocalTranscribeService({ baseUrl, timeoutMs: 40 })(recording),
      /Local transcription timed out/,
    );
    const controller = new AbortController(),
      reason = new Error("caller-cancel");
    const pending = transcribe({ ...recording, signal: controller.signal });
    setTimeout(() => controller.abort(reason), 40);
    await assert.rejects(pending, (error) => error === reason);
  }
});

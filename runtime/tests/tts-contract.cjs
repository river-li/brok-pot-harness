const { test } = require("node:test");
const assert = require("node:assert/strict");
const http = require("node:http");
const { gzipSync } = require("node:zlib");
const { createLocalSpeechService } = require("../../dist/local/tts.js");
async function fixture(t, handler) {
  const server = http.createServer(handler);
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  t.after(() => {
    server.closeAllConnections();
    return new Promise((resolve) => server.close(resolve));
  });
  return `http://127.0.0.1:${server.address().port}`;
}
function wav() {
  const body = Buffer.alloc(44 + 4800);
  body.write("RIFF");
  body.writeUInt32LE(body.length - 8, 4);
  body.write("WAVEfmt ", 8);
  body.writeUInt32LE(16, 16);
  body.writeUInt16LE(1, 20);
  body.writeUInt16LE(1, 22);
  body.writeUInt32LE(24000, 24);
  body.writeUInt32LE(48000, 28);
  body.writeUInt16LE(2, 32);
  body.writeUInt16LE(16, 34);
  body.write("data", 36);
  body.writeUInt32LE(body.length - 44, 40);
  return body;
}
test("Speech sends text and voice settings without credentials and preserves PCM audio", async (t) => {
  let seen;
  const baseUrl = await fixture(t, async (req, res) => {
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    seen = {
      url: req.url,
      headers: req.headers,
      body: JSON.parse(Buffer.concat(chunks)),
    };
    res.writeHead(200, { "content-type": "audio/wav" });
    res.end(wav());
  });
  const request = { text: "你好", voiceId: "ara", language: "zh", speed: 0.75 };
  const result = await createLocalSpeechService({ baseUrl })(request);
  assert.deepEqual(seen.body, request);
  assert.equal(seen.url, "/speak");
  assert.equal(seen.headers.authorization, undefined);
  assert.equal(seen.headers.cookie, undefined);
  assert.equal(result.mimeType, "audio/wav");
  assert.deepEqual(Buffer.from(result.audioBase64, "base64"), wav());
});
test("Speech rejects invalid input, endpoints, audio formats and oversized decoded output", async (t) => {
  for (const baseUrl of [
    "file:///tmp",
    "http://user:secret@example.com",
    "http://example.com/?key=secret",
  ])
    assert.throws(
      () => createLocalSpeechService({ baseUrl }),
      /HTTP\(S\) base URL/,
    );
  let mode = "invalid";
  const baseUrl = await fixture(t, (_req, res) => {
    if (mode === "oversized") {
      const body = gzipSync(Buffer.alloc(6 * 1024 * 1024));
      res.writeHead(200, {
        "content-type": "audio/wav",
        "content-encoding": "gzip",
        "content-length": body.length,
      });
      res.end(body);
    } else {
      res.writeHead(200, {
        "content-type": mode === "type" ? "text/html" : "audio/wav",
      });
      const body = wav();
      body.writeUInt32LE(16000, 24);
      res.end(body);
    }
  });
  const speak = createLocalSpeechService({ baseUrl });
  for (const request of [
    { text: "" },
    { text: "x".repeat(2001) },
    { text: "hi", voiceId: "../bad" },
    { text: "hi", language: "xx" },
    { text: "hi", speed: 0 },
  ])
    await assert.rejects(speak(request), /Speech text|Invalid local/);
  for (mode of ["invalid", "type"])
    await assert.rejects(speak({ text: "hi" }), /invalid audio/);
  mode = "oversized";
  await assert.rejects(speak({ text: "hi" }), /size limit/);
});
test("Speech redacts service errors, refuses redirects and respects timeout/cancellation", async (t) => {
  let mode = "error";
  const baseUrl = await fixture(t, (_req, res) => {
    if (mode === "stall") return;
    if (mode === "stream") {
      res.writeHead(200, { "content-type": "audio/wav" });
      res.write(wav().subarray(0, 44));
      return;
    }
    res.writeHead(mode === "redirect" ? 302 : 429, {
      location: "http://127.0.0.1:9",
    });
    res.end("secret-from-provider");
  });
  const speak = createLocalSpeechService({ baseUrl, timeoutMs: 100 });
  await assert.rejects(
    speak({ text: "hi" }),
    /HTTP 429\. Local speech output is busy/,
  );
  mode = "redirect";
  await assert.rejects(
    speak({ text: "hi" }),
    /^Error: Local speech output is unavailable/,
  );
  for (mode of ["stall", "stream"])
    await assert.rejects(speak({ text: "hi" }), /timed out/);
  const controller = new AbortController();
  controller.abort(new Error("cancelled-by-caller"));
  await assert.rejects(
    speak({ text: "hi", signal: controller.signal }),
    /cancelled-by-caller/,
  );
});

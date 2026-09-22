const test = require("node:test");
const assert = require("node:assert/strict");
const http = require("node:http");
const { gzipSync } = require("node:zlib");
const { createLocalWebFetchService } = require("../../dist/local/web-fetch.js");

async function fixture(t, handler) {
  const server = http.createServer(handler);
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  t.after(() => {
    server.closeAllConnections();
    server.close();
  });
  return `http://127.0.0.1:${server.address().port}`;
}

test("local fetch follows redirects and returns semantic Markdown with absolute links", async (t) => {
  const visits = [];
  const base = await fixture(t, (req, res) => {
    visits.push(req.url);
    assert.equal(req.headers.authorization, undefined);
    assert.equal(req.headers.cookie, undefined);
    if (req.url === "/start") {
      res.writeHead(302, { location: "/docs/page" });
      res.end();
      return;
    }
    assert.equal(req.url, "/docs/page");
    res.writeHead(200, { "content-type": "text/html; charset=utf-8" });
    res.end(
      '<!doctype html><base href="/reference/"><h1>你好 &amp; world</h1><p>A <strong>bold</strong> <a href="next">link</a>.</p><pre><code>const n = 1;</code></pre><table><thead><tr><th>Name</th><th>Value</th></tr></thead><tbody><tr><td>a</td><td>b</td></tr></tbody></table><script src="/never-load">secret-script</script><style>secret-style</style><a href="javascript:alert(1)">plain link</a>',
    );
  });
  const result = await createLocalWebFetchService()({}, base + "/start");
  assert.equal(result.error, undefined);
  assert.match(result.content, /# 你好 & world/);
  assert.ok(result.content.includes(`[link](${base}/reference/next)`));
  assert.match(result.content, /\*\*bold\*\*/);
  assert.match(result.content, /```[\s\S]*const n = 1;[\s\S]*```/);
  assert.match(result.content, /\| Name \| Value \|/);
  assert.doesNotMatch(result.content, /secret-script|secret-style|javascript:/);
  assert.deepEqual(visits, ["/start", "/docs/page"]);
});

test("text decoding, HTTP failures and binary content keep distinct results", async (t) => {
  const base = await fixture(t, (req, res) => {
    if (req.url === "/text") {
      res.writeHead(200, {
        "content-type": "text/plain; charset=windows-1252",
      });
      res.end(Buffer.from([0x63, 0x61, 0x66, 0xe9]));
    } else if (req.url === "/missing") {
      res.writeHead(404, { "content-type": "text/html" });
      res.end("not the requested page");
    } else {
      res.writeHead(200, { "content-type": "application/pdf" });
      res.end("%PDF");
    }
  });
  const fetchPage = createLocalWebFetchService();
  assert.deepEqual(await fetchPage({}, base + "/text"), { content: "café" });
  assert.match((await fetchPage({}, base + "/missing")).error, /HTTP 404/);
  assert.match(
    (await fetchPage({}, base + "/binary")).error,
    /content type.*application\/pdf/,
  );
});

test("download cap applies to decompressed streaming bodies", async (t) => {
  const body = gzipSync("x".repeat(65536));
  const base = await fixture(t, (req, res) => {
    res.writeHead(200, {
      "content-type": "text/plain",
      "content-encoding": "gzip",
      "content-length": body.length,
    });
    res.end(body);
  });
  assert.match(
    (await createLocalWebFetchService({ maxBytes: 1024 })({}, base)).error,
    /size limit/,
  );
});

test("redirect limits and URL validation apply before following a redirect", async (t) => {
  let visits = 0;
  const base = await fixture(t, (req, res) => {
    visits++;
    res.writeHead(302, {
      location: req.url === "/bad" ? "file:///etc/passwd" : "/loop",
    });
    res.end();
  });
  const fetchPage = createLocalWebFetchService({ maxRedirects: 2 });
  assert.match((await fetchPage({}, base + "/loop")).error, /redirect limit/);
  assert.equal(visits, 3);
  assert.match((await fetchPage({}, base + "/bad")).error, /redirect URL/);
  for (const url of [
    "file:///etc/passwd",
    "http://name:password@localhost/",
    "not a url",
  ]) {
    assert.match((await fetchPage({}, url)).error, /HTTP or HTTPS/);
  }
  assert.equal(visits, 4);
});

test("timeout is a tool result while caller cancellation propagates", async (t) => {
  const base = await fixture(t, () => {});
  const timeout = await createLocalWebFetchService({ timeoutMs: 30 })({}, base);
  assert.equal(timeout.isTimeout, true);
  const controller = new AbortController();
  const pending = createLocalWebFetchService()(
    { signal: controller.signal },
    base,
  );
  controller.abort(new DOMException("cancelled", "AbortError"));
  await assert.rejects(pending, { name: "AbortError" });
});

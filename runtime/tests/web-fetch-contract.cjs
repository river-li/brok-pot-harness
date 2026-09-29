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
  const result = await createLocalWebFetchService({ allowPrivateNetwork: true })({}, base + "/start");
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
  const fetchPage = createLocalWebFetchService({ allowPrivateNetwork: true });
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
    (await createLocalWebFetchService({ allowPrivateNetwork: true, maxBytes: 1024 })({}, base)).error,
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
  const fetchPage = createLocalWebFetchService({ allowPrivateNetwork: true, maxRedirects: 2 });
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
  const timeout = await createLocalWebFetchService({ allowPrivateNetwork: true, timeoutMs: 30 })({}, base);
  assert.equal(timeout.isTimeout, true);
  const controller = new AbortController();
  const pending = createLocalWebFetchService({ allowPrivateNetwork: true })(
    { signal: controller.signal },
    base,
  );
  controller.abort(new DOMException("cancelled", "AbortError"));
  await assert.rejects(pending, { name: "AbortError" });
});

test("production defaults block local, metadata, mapped and alternate-format literals before connecting", async () => {
  const fetchPage = createLocalWebFetchService();
  for (const host of ["127.0.0.1", "2130706433", "0x7f000001", "10.0.0.1",
    "172.16.0.1", "192.168.1.1", "169.254.169.254", "100.100.100.200", "168.63.129.16",
    "localhost", "sub.localhost.", "[::1]", "[::ffff:127.0.0.1]", "[fd00::1]", "[fe80::1]"]) {
    assert.match((await fetchPage({}, `http://${host}/`)).error, /non-public/, host);
  }
});

test("address policy accepts public IPv4 and IPv6 and rejects special-use ranges", () => {
  const { isPublicAddress } = require("../../dist/local/web-fetch-network.js");
  for (const address of ["8.8.8.8", "1.1.1.1", "93.184.215.14", "2606:4700:4700::1111", "2001:4860:4860::8888"])
    assert.equal(isPublicAddress(address), true, address);
  for (const address of ["0.0.0.0", "192.0.2.1", "198.18.0.1", "198.51.100.1", "203.0.113.1", "224.0.0.1", "255.255.255.255", "::", "::ffff:8.8.8.8", "64:ff9b::a00:1", "2002:7f00:1::", "2001:db8::1", "ff02::1", "not-an-ip"])
    assert.equal(isPublicAddress(address), false, address);
});

test("socket lookup rejects private and mixed DNS answers, including rebinding on a later connection", async (t) => {
  const dns = require("node:dns");
  const { publicLookup } = require("../../dist/local/web-fetch-network.js");
  let answers = [{ address: "8.8.8.8", family: 4 }];
  let queries = 0;
  t.mock.method(dns, "lookup", (hostname, options, callback) => {
    assert.equal(hostname, "fixture.example");
    assert.equal(options.all, true);
    queries++;
    callback(null, answers);
  });
  const lookup = (options = {}) => new Promise((resolve, reject) => {
    publicLookup("fixture.example", options, (error, address, family) =>
      error ? reject(error) : resolve({ address, family }));
  });
  assert.deepEqual(await lookup(), { address: "8.8.8.8", family: 4 });
  answers = [{ address: "127.0.0.1", family: 4 }];
  await assert.rejects(lookup(), /non-public/);
  answers = [{ address: "8.8.8.8", family: 4 }, { address: "::ffff:169.254.169.254", family: 6 }];
  await assert.rejects(lookup({ all: true }), /non-public/);
  assert.equal(queries, 3);
});

test("production transport validates redirect destinations and installs the socket lookup", async (t) => {
  const { PassThrough } = require("node:stream");
  const { EventEmitter } = require("node:events");
  const { publicLookup } = require("../../dist/local/web-fetch-network.js");
  let requests = 0;
  t.mock.method(http, "request", (url, options, receive) => {
    requests++;
    assert.equal(url.hostname, "public.example");
    assert.equal(options.lookup, publicLookup);
    assert.equal(options.agent, false);
    const request = new EventEmitter();
    request.end = () => {
      const response = new PassThrough();
      response.statusCode = 302;
      response.headers = { location: "http://169.254.169.254/latest/meta-data/" };
      receive(response);
      response.end();
    };
    return request;
  });
  assert.match((await createLocalWebFetchService()({}, "http://public.example/")).error, /non-public/);
  assert.equal(requests, 1);
});

test("compressed bodies preserve timeout and cancellation after response headers", async (t) => {
  let receivedHeaders;
  let headers = new Promise((resolve) => { receivedHeaders = resolve; });
  const base = await fixture(t, (_req, res) => {
    res.writeHead(200, { "content-type": "text/plain", "content-encoding": "gzip" });
    res.write(gzipSync("unfinished body").subarray(0, 12));
    receivedHeaders();
  });
  assert.equal((await createLocalWebFetchService({ allowPrivateNetwork: true, timeoutMs: 30 })({}, base)).isTimeout, true);
  headers = new Promise((resolve) => { receivedHeaders = resolve; });
  const controller = new AbortController();
  const pending = createLocalWebFetchService({ allowPrivateNetwork: true })({ signal: controller.signal }, base);
  await headers;
  controller.abort(new DOMException("cancelled", "AbortError"));
  await assert.rejects(pending, { name: "AbortError" });
});

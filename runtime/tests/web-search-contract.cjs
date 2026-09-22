const { test } = require("node:test");
const assert = require("node:assert/strict");
const http = require("node:http");
const { gzipSync } = require("node:zlib");
const {
  createLocalWebSearchService,
} = require("../../dist/local/web-search.js");

async function fixture(t, handler) {
  const server = http.createServer(handler);
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  t.after(() => {
    server.closeAllConnections();
    return new Promise((resolve) => server.close(resolve));
  });
  return `http://127.0.0.1:${server.address().port}`;
}
function json(res, value) {
  res.writeHead(200, { "content-type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(value));
}

test("WebSearch sends only the query and returns cleaned, unique source URLs and snippets", async (t) => {
  let request;
  const baseUrl = await fixture(t, async (req, res) => {
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    request = {
      url: req.url,
      method: req.method,
      headers: req.headers,
      body: new URLSearchParams(Buffer.concat(chunks).toString()),
    };
    json(res, {
      results: [
        {
          url: "https://example.com/docs?a=1&b=2",
          title: "Example &amp; <b>Docs</b>",
          content:
            "<p>Before <em>match</em>.</p><script>hidden()</script><p>After.</p>",
        },
        { url: "https://example.com/docs?a=1&b=2", title: "Duplicate" },
        { url: "javascript:alert(1)", title: "bad" },
        {
          url: "https://name:secret@example.com/",
          title: "embedded credentials",
        },
        { url: "https://second.example/", content: "Next result" },
        { url: "https://third.example/", content: "Limit result" },
      ],
      unresponsive_engines: [["optional-engine", "temporarily unavailable"]],
    });
  });
  const result = await createLocalWebSearchService({ baseUrl, maxResults: 2 })(
    {},
    {
      searchTerm: '  中文 "query" & site:example.com  ',
      explanation: "This must not be forwarded",
    },
  );
  assert.equal(request.url, "/search");
  assert.equal(request.method, "POST");
  assert.equal(request.body.get("q"), '中文 "query" & site:example.com');
  assert.deepEqual([...request.body.keys()].sort(), [
    "categories",
    "format",
    "q",
  ]);
  assert.equal(request.headers.authorization, undefined);
  assert.equal(request.headers.cookie, undefined);
  assert.deepEqual(result, {
    documents: [
      {
        url: "https://example.com/docs?a=1&b=2",
        title: "Example & Docs",
        text: "Before match. After.",
      },
      {
        url: "https://second.example/",
        title: "second.example",
        text: "Next result",
      },
    ],
  });
});

test("WebSearch distinguishes no matches from failed or malformed search engines", async (t) => {
  let reply = { results: [] };
  const baseUrl = await fixture(t, (_req, res) => json(res, reply));
  const search = createLocalWebSearchService({ baseUrl });
  assert.match(
    (await search({}, { searchTerm: "empty" })).answer,
    /No web search results/,
  );
  reply = { results: [], answers: ["2 &lt; 3"] };
  assert.equal((await search({}, { searchTerm: "answer" })).answer, "2 < 3");
  reply = { results: [], unresponsive_engines: [["engine", "blocked"]] };
  await assert.rejects(
    search({}, { searchTerm: "blocked" }),
    /API request failed: 503/,
  );
  reply = { results: [{ url: "file:///secret" }] };
  await assert.rejects(
    search({}, { searchTerm: "bad URL" }),
    /no usable result URLs/,
  );
  reply = { error: "provider detail that should not appear in the error" };
  await assert.rejects(
    search({}, { searchTerm: "bad shape" }),
    /^Error: Local web search returned an invalid JSON response\.$/,
  );
});

test("WebSearch keeps provider bodies out of errors and does not follow redirects", async (t) => {
  const secret = "sensitive-provider-body";
  let mode = "status",
    redirectRequests = 0;
  const other = await fixture(t, (_req, res) => {
    redirectRequests++;
    res.end("not expected");
  });
  const baseUrl = await fixture(t, (_req, res) => {
    if (mode === "redirect") res.writeHead(302, { location: other });
    else if (mode === "status")
      res.writeHead(429, { "content-type": "application/json" });
    else if (mode === "invalid")
      res.writeHead(200, { "content-type": "application/json" });
    else res.writeHead(200, { "content-type": "text/html" });
    res.end(secret);
  });
  const search = createLocalWebSearchService({ baseUrl });
  await assert.rejects(
    search({}, { searchTerm: "status" }),
    (error) =>
      /API request failed: 429/.test(error.message) &&
      !error.message.includes(secret),
  );
  mode = "redirect";
  await assert.rejects(
    search({}, { searchTerm: "redirect" }),
    /Local web search is unavailable/,
  );
  assert.equal(redirectRequests, 0);
  for (mode of ["invalid", "html"])
    await assert.rejects(
      search({}, { searchTerm: mode }),
      /^Error: Local web search returned an invalid JSON response\.$/,
    );
});

test("WebSearch bounds decompressed bytes and validates configuration and input", async (t) => {
  let requests = 0;
  const baseUrl = await fixture(t, (_req, res) => {
    requests++;
    const compressed = gzipSync(
      JSON.stringify({ results: [], answers: ["x".repeat(5000)] }),
    );
    res.writeHead(200, {
      "content-type": "application/json",
      "content-encoding": "gzip",
      "content-length": compressed.length,
    });
    res.end(compressed);
  });
  const search = createLocalWebSearchService({ baseUrl, maxBytes: 256 });
  await assert.rejects(
    search({}, { searchTerm: "large" }),
    /exceeds the download size limit/,
  );
  for (const searchTerm of ["", "   ", "x".repeat(8193)])
    await assert.rejects(search({}, { searchTerm }), /search term between/);
  assert.equal(requests, 1);
  for (const baseUrl of [
    "file:///tmp",
    "https://user:secret@example.com",
    "http://example.com/?token=secret",
    "http://example.com/#fragment",
  ])
    assert.throws(
      () => createLocalWebSearchService({ baseUrl }),
      /^Error: GROKBOT_SEARCH_BASE_URL must be/,
    );
});

test("WebSearch honours timeout and caller cancellation before headers and during streaming", async (t) => {
  let stream = false;
  const baseUrl = await fixture(t, (_req, res) => {
    if (stream) {
      res.writeHead(200, { "content-type": "application/json" });
      res.write('{"results":[');
    }
  });
  for (stream of [false, true]) {
    await assert.rejects(
      createLocalWebSearchService({ baseUrl, timeoutMs: 50 })(
        {},
        { searchTerm: "timeout" },
      ),
      /Local web search timed out/,
    );
    const controller = new AbortController();
    const reason = new Error("cancelled-by-caller");
    const pending = createLocalWebSearchService({ baseUrl })(
      { signal: controller.signal },
      { searchTerm: "cancel" },
    );
    setTimeout(() => controller.abort(reason), 50);
    await assert.rejects(pending, (error) => error === reason);
  }
});

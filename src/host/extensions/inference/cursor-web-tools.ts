/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/host/extensions/inference/cursor-web-tools.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_aiserver_connect();
init_aiserver_pb();
init_cursor_inference();
function createCursorWebSearchService(options2, createClient2 = createSandCursorBackendClient) {
  if (process.env.GROKBOT_LOCAL_MODE === "1") return require("./local/web-search.js").createLocalWebSearchService();
  const client = createClient2(AiService, options2);
  return async (_ctx, args) => {
    const response = await client.runWebSearch(
      new RunWebSearchRequest({
        searchTerm: args.searchTerm,
        explanation: args.explanation,
        modelId: options2.modelId
      })
    );
    return {
      answer: response.answer,
      documents: response.documents.map((document2) => ({
        url: document2.url,
        title: document2.title,
        text: document2.text
      }))
    };
  };
}
var WEB_FETCH_BLOCKED_HINT = " The site may be blocking this tool's fetch provider; this is not evidence the page does not exist. Fall back to a browser subagent when one is available, or `curl` via Shell.";
var WEB_FETCH_BLOCK_PAGE_ERROR = `The fetched page is a firewall block page, not the real content.${WEB_FETCH_BLOCKED_HINT}`;
var WEB_FETCH_BLOCKED_ERROR_PATTERN = /\b403\b|forbidden/i;
var F5_WAF_BLOCK_PAGE_PATTERN = /requested url was rejected/i;
var WEB_FETCH_BLOCK_PAGE_SNIFF_MAX_CHARS = 2048;
function isWebFetchBlockPageContent(content) {
  return content.length <= WEB_FETCH_BLOCK_PAGE_SNIFF_MAX_CHARS && F5_WAF_BLOCK_PAGE_PATTERN.test(content);
}
function createCursorWebFetchService(options2, createClient2 = createSandCursorBackendClient) {
  if (process.env.GROKBOT_LOCAL_MODE === "1") {
    const fetchLocal = require("./local/web-fetch.js").createLocalWebFetchService();
    return async (ctx, url2) => {
      const result = await fetchLocal(ctx, url2);
      if ("content" in result && isWebFetchBlockPageContent(result.content)) return { error: WEB_FETCH_BLOCK_PAGE_ERROR };
      if ("error" in result && WEB_FETCH_BLOCKED_ERROR_PATTERN.test(result.error)) return { ...result, error: `${result.error}${WEB_FETCH_BLOCKED_HINT}` };
      return result;
    };
  }
  const client = createClient2(AiService, options2);
  return async (_ctx, url2) => {
    const response = await client.runWebFetch(new RunWebFetchRequest({ url: url2 }));
    switch (response.result.case) {
      case "success": {
        const content = response.result.value.content;
        if (isWebFetchBlockPageContent(content)) {
          return { error: WEB_FETCH_BLOCK_PAGE_ERROR };
        }
        return { content };
      }
      case "error": {
        const error42 = response.result.value.error;
        return {
          error: WEB_FETCH_BLOCKED_ERROR_PATTERN.test(error42) ? `${error42}${WEB_FETCH_BLOCKED_HINT}` : error42,
          isTimeout: response.result.value.isTimeout
        };
      }
      case void 0:
        return { error: "Web fetch returned no result." };
      default: {
        const _exhaustive = response.result;
        return _exhaustive;
      }
    }
  };
}

/** Local implementation of the retained WebSearch service port. The original
 * tool keeps discovery, approval, hooks and result rendering. SearXNG runs in
 * this workspace's Compose stack and receives no model or vendor credentials. */
const {
  createDocument,
}: { createDocument(html: string): Document } = require("@mixmark-io/domino");

type SearchResult = {
  answer?: string;
  documents: { url: string; title: string; text: string }[];
};
type Options = {
  baseUrl?: string;
  timeoutMs?: number;
  maxBytes?: number;
  maxResults?: number;
};

function plainText(value: unknown, maxLength: number): string {
  if (typeof value !== "string") return "";
  const document = createDocument(value);
  for (const element of Array.from(
    document.querySelectorAll("script,style,template,noscript"),
  ))
    element.remove();
  for (const element of Array.from(
    document.querySelectorAll("br,p,div,li,h1,h2,h3,h4,h5,h6"),
  ))
    element.appendChild(document.createTextNode(" "));
  return (document.body.textContent || "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);
}

export function createLocalWebSearchService(options: Options = {}) {
  let endpoint: URL;
  try {
    const base = new URL(
      options.baseUrl ??
        process.env.GROKBOT_SEARCH_BASE_URL ??
        "http://search:8080",
    );
    if (
      !["http:", "https:"].includes(base.protocol) ||
      base.username ||
      base.password ||
      base.search ||
      base.hash
    )
      throw new Error();
    endpoint = new URL(base.href.replace(/\/$/, "") + "/search");
  } catch {
    throw new Error(
      "GROKBOT_SEARCH_BASE_URL must be an HTTP(S) base URL without credentials, query or fragment.",
    );
  }
  const maxBytes = options.maxBytes ?? 2 * 1024 * 1024;
  const maxResults = options.maxResults ?? 10;
  return async (
    ctx: { signal?: AbortSignal },
    args: { searchTerm: string; explanation?: string },
  ): Promise<SearchResult> => {
    const query = args.searchTerm.trim();
    if (!query || query.length > 8192)
      throw new Error(
        "WebSearch requires a search term between 1 and 8192 characters.",
      );
    const timeout = AbortSignal.timeout(options.timeoutMs ?? 30000);
    const signal = ctx.signal
      ? AbortSignal.any([ctx.signal, timeout])
      : timeout;
    let response: Response;
    try {
      response = await fetch(endpoint, {
        method: "POST",
        redirect: "error",
        signal,
        headers: {
          accept: "application/json",
          "content-type": "application/x-www-form-urlencoded",
          "user-agent": "GrokBotLocal/0.44.0 WebSearch",
        },
        body: new URLSearchParams({
          q: query,
          format: "json",
          categories: "general",
        }),
      });
    } catch {
      ctx.signal?.throwIfAborted();
      if (timeout.aborted) throw new Error("Local web search timed out.");
      throw new Error(
        "Local web search is unavailable. Check the search service with npm run status and npm run logs.",
      );
    }
    try {
      // Never include provider bodies/URLs in errors: they may echo input or
      // service credentials. This status format keeps the original error mapper.
      if (!response.ok)
        throw new Error(
          `API request failed: ${response.status}. Local web search service returned an error.`,
        );
      if (
        !/^application\/json(?:;|$)/i.test(
          response.headers.get("content-type") || "",
        ) ||
        !response.body
      )
        throw new Error("Local web search returned an invalid JSON response.");
      if (Number(response.headers.get("content-length")) > maxBytes)
        throw new Error(
          "Local web search response exceeds the download size limit.",
        );
      const reader = response.body.getReader();
      const chunks: Uint8Array[] = [];
      let size = 0;
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          size += value.byteLength;
          if (size > maxBytes)
            throw new Error(
              "Local web search response exceeds the download size limit.",
            );
          chunks.push(value);
        }
      } catch (error) {
        ctx.signal?.throwIfAborted();
        if (timeout.aborted) throw new Error("Local web search timed out.");
        if (
          error instanceof Error &&
          error.message ===
            "Local web search response exceeds the download size limit."
        )
          throw error;
        throw new Error("Local web search response was interrupted.");
      } finally {
        await reader.cancel().catch(() => {});
        reader.releaseLock();
      }
      let data: {
        results: unknown[];
        answers?: unknown[];
        unresponsive_engines?: unknown[];
      };
      try {
        const parsed = JSON.parse(Buffer.concat(chunks, size).toString("utf8"));
        if (
          !parsed ||
          typeof parsed !== "object" ||
          !Array.isArray(parsed.results)
        )
          throw new Error();
        data = parsed;
      } catch {
        throw new Error("Local web search returned an invalid JSON response.");
      }
      const documents: SearchResult["documents"] = [];
      const seen = new Set<string>();
      for (const raw of data.results) {
        if (!raw || typeof raw !== "object") continue;
        const row = raw as Record<string, unknown>;
        if (typeof row.url !== "string") continue;
        let url: URL;
        try {
          url = new URL(row.url);
          if (
            !["http:", "https:"].includes(url.protocol) ||
            url.username ||
            url.password
          )
            continue;
        } catch {
          continue;
        }
        if (seen.has(url.href)) continue;
        seen.add(url.href);
        documents.push({
          url: url.href,
          title: plainText(row.title, 500) || url.hostname,
          text: plainText(row.content, 8000),
        });
        if (documents.length >= maxResults) break;
      }
      if (documents.length) return { documents };
      if (data.results.length)
        throw new Error("Local web search returned no usable result URLs.");
      if (
        Array.isArray(data.unresponsive_engines) &&
        data.unresponsive_engines.length
      )
        throw new Error(
          "API request failed: 503. Search engines were unavailable or blocked; no results could be verified.",
        );
      const answers = Array.isArray(data.answers)
        ? data.answers
            .map((value) => plainText(value, 8000))
            .filter(Boolean)
            .slice(0, 5)
        : [];
      return {
        documents: [],
        answer:
          answers.join("\n\n") ||
          "No web search results were returned for this query.",
      };
    } finally {
      await response.body?.cancel().catch(() => {});
    }
  };
}

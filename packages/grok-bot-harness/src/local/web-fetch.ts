/** Local implementation of the retained WebFetch service port. Approval stays
 * in the original agent tool; this transport never attaches model credentials. */
import TurndownService = require("turndown");

const {
  createDocument,
}: { createDocument(html: string): Document } = require("@mixmark-io/domino");
const { gfm }: { gfm: TurndownService.Plugin } = require("turndown-plugin-gfm");
type Result = { content: string } | { error: string; isTimeout?: boolean };
type Options = { timeoutMs?: number; maxBytes?: number; maxRedirects?: number };

function httpUrl(input: string, base?: URL): URL {
  const url = new URL(input, base);
  if (!["http:", "https:"].includes(url.protocol))
    throw new Error("WebFetch requires an HTTP or HTTPS URL.");
  if (url.username || url.password)
    throw new Error("WebFetch does not support credentials in URLs.");
  return url;
}

export function htmlToMarkdown(html: string, finalUrl: URL): string {
  const document = createDocument(html);
  let base = finalUrl;
  const baseHref = document.querySelector("base[href]")?.getAttribute("href");
  if (baseHref) {
    try {
      base = httpUrl(baseHref, finalUrl);
    } catch {}
  }
  // Domino parses markup without running scripts or loading subresources.
  for (const element of Array.from(
    document.querySelectorAll(
      "script,style,noscript,template,iframe,object,embed",
    ),
  ))
    element.remove();
  for (const element of Array.from(
    document.querySelectorAll("a[href],img[src]"),
  )) {
    const attribute = element.tagName === "A" ? "href" : "src";
    try {
      const url = new URL(element.getAttribute(attribute)!, base);
      if (
        !["http:", "https:", "mailto:"].includes(url.protocol) ||
        url.username ||
        url.password
      )
        throw new Error();
      element.setAttribute(attribute, url.href);
    } catch {
      element.removeAttribute(attribute);
    }
  }
  const converter = new TurndownService({
    headingStyle: "atx",
    codeBlockStyle: "fenced",
    bulletListMarker: "-",
  });
  converter.use(gfm);
  return converter.turndown(document.body).trim();
}

export function createLocalWebFetchService(options: Options = {}) {
  const maxBytes = options.maxBytes ?? 8 * 1024 * 1024;
  const maxRedirects = options.maxRedirects ?? 10;
  return async (
    ctx: { signal?: AbortSignal },
    input: string,
  ): Promise<Result> => {
    let url: URL;
    try {
      url = httpUrl(input);
    } catch {
      return {
        error:
          "WebFetch requires an HTTP or HTTPS URL without embedded credentials.",
      };
    }
    const timeout = AbortSignal.timeout(options.timeoutMs ?? 30000);
    const signal = ctx.signal
      ? AbortSignal.any([ctx.signal, timeout])
      : timeout;
    try {
      for (let redirects = 0; ; redirects++) {
        const response = await fetch(url, {
          signal,
          redirect: "manual",
          headers: {
            accept:
              "text/html, application/xhtml+xml, text/plain, text/markdown, application/json;q=0.8",
            "user-agent": "GrokBotLocal/0.44.0 WebFetch",
          },
        });
        try {
          if ([301, 302, 303, 307, 308].includes(response.status)) {
            const location = response.headers.get("location");
            if (!location)
              return { error: "Web fetch redirect has no Location header." };
            if (redirects >= maxRedirects)
              return { error: "Web fetch exceeded the redirect limit." };
            try {
              url = httpUrl(location, url);
            } catch {
              return {
                error:
                  "Web fetch refused an invalid or credentialed redirect URL.",
              };
            }
            continue;
          }
          if (!response.ok)
            return { error: `Web fetch returned HTTP ${response.status}.` };
          const contentType = response.headers.get("content-type") || "";
          const mime = contentType.split(";")[0].trim().toLowerCase();
          const html = mime === "text/html" || mime === "application/xhtml+xml";
          const text =
            mime.startsWith("text/") ||
            /^(application\/(json|xml)|application\/[\w.+-]+\+(json|xml))$/.test(
              mime,
            );
          if (!html && !text)
            return {
              error: `Web fetch does not support this content type (${mime || "unspecified"}). Use a file or browser tool for binary content.`,
            };
          if (Number(response.headers.get("content-length")) > maxBytes)
            return {
              error: "Web fetch response exceeds the download size limit.",
            };
          if (!response.body) return { content: "" };
          const reader = response.body.getReader();
          const chunks: Uint8Array[] = [];
          let length = 0;
          try {
            while (true) {
              const { done, value } = await reader.read();
              if (done) break;
              length += value.byteLength;
              if (length > maxBytes)
                return {
                  error: "Web fetch response exceeds the download size limit.",
                };
              chunks.push(value);
            }
          } finally {
            await reader.cancel().catch(() => {});
            reader.releaseLock();
          }
          const charset =
            /charset\s*=\s*["']?([^;\s"']+)/i.exec(contentType)?.[1] || "utf-8";
          let decoder: TextDecoder;
          try {
            decoder = new TextDecoder(charset);
          } catch {
            decoder = new TextDecoder("utf-8");
          }
          const content = decoder.decode(Buffer.concat(chunks, length));
          return { content: html ? htmlToMarkdown(content, url) : content };
        } finally {
          await response.body?.cancel().catch(() => {});
        }
      }
    } catch {
      ctx.signal?.throwIfAborted();
      if (timeout.aborted)
        return { error: "Web fetch timed out.", isTimeout: true };
      return {
        error:
          "Web fetch failed. Check the URL, network connection and TLS certificate.",
      };
    }
  };
}

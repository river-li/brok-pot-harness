/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/grok-bot-harness/src/runner/bot-block-detection.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var SAND_BOT_BLOCK_FAMILIES = [
  "google_sorry",
  "google_signin_rejected",
  "google_device_redirect",
  "recaptcha",
  "cloudflare_challenge",
  "akamai",
  "hcaptcha",
  "arkose",
  "linkedin_checkpoint",
  "datadome",
  "perimeterx",
  "imperva",
  "distil",
  "aws_waf",
  "vercel_checkpoint",
  "generic_access_denied"
];
var BOT_BLOCK_ERROR_TYPE = "bot_block";
var MAX_BLOCKED_HOST_LENGTH = 100;
var MAX_BLOCKED_URL_LENGTH = 1024;
var MAX_WALL_EPISODE_DURATION_MS = 216e5;
var CROSS_SITE_QUICK_RESOLUTION_MS = 12e4;
var SENTINEL_SITE_BUCKETS = /* @__PURE__ */ new Set(["ip", "local", "private"]);
function resolutionKindFor(args) {
  const crossSiteKind = args.durationMs <= CROSS_SITE_QUICK_RESOLUTION_MS ? "cross_site_quick" : "cross_site_late";
  if (!URL.canParse(args.resolvedUrl)) return crossSiteKind;
  const resolvedHost = new URL(args.resolvedUrl).hostname.toLowerCase().replace(/^www\./, "");
  if (resolvedHost.length === 0) return crossSiteKind;
  if (resolvedHost === args.blockedHost) return "same_site";
  const blockedBucket = boundedSiteBucket(args.blockedHost);
  if (!SENTINEL_SITE_BUCKETS.has(blockedBucket) && boundedSiteBucket(resolvedHost) === blockedBucket) {
    return "same_site";
  }
  return crossSiteKind;
}
var BOT_BLOCK_SIGNATURES = [
  {
    family: "google_sorry",
    confidence: "high",
    host: { equals: ["google.com"], suffix: [".google.com"] },
    path: { prefix: ["/sorry"] }
  },
  {
    family: "google_signin_rejected",
    confidence: "high",
    host: { equals: ["accounts.google.com"] },
    path: { includes: ["/signin/rejected"] }
  },
  {
    family: "google_device_redirect",
    confidence: "high",
    host: { equals: ["g.co"] },
    path: { equals: ["/sc"], prefix: ["/sc/"] }
  },
  {
    family: "recaptcha",
    confidence: "low",
    path: { includes: ["/recaptcha/api2/", "/recaptcha/enterprise/"] }
  },
  {
    family: "cloudflare_challenge",
    confidence: "high",
    path: { includes: ["/cdn-cgi/challenge-platform/"] }
  },
  {
    family: "cloudflare_challenge",
    confidence: "high",
    host: { equals: ["challenges.cloudflare.com"] }
  },
  {
    family: "cloudflare_challenge",
    confidence: "high",
    title: { equals: ["Just a moment..."] }
  },
  {
    family: "cloudflare_challenge",
    confidence: "high",
    title: { startsWith: ["Attention Required! | Cloudflare"] }
  },
  {
    family: "akamai",
    confidence: "high",
    path: { includes: ["/_sec/cp_challenge", "/akam/"] }
  },
  {
    family: "akamai",
    confidence: "high",
    host: {
      suffix: [
        ".akamaihd.net",
        ".akamaized.net",
        ".akamai.net",
        ".akamaiedge.net",
        ".edgesuite.net",
        ".edgekey.net"
      ]
    }
  },
  {
    family: "hcaptcha",
    confidence: "low",
    host: { equals: ["hcaptcha.com"], suffix: [".hcaptcha.com"] }
  },
  {
    family: "arkose",
    confidence: "high",
    host: { suffix: [".arkoselabs.com", ".funcaptcha.com"] }
  },
  {
    family: "linkedin_checkpoint",
    confidence: "high",
    host: { equals: ["linkedin.com"], suffix: [".linkedin.com"] },
    path: { prefix: ["/checkpoint/challenge"] }
  },
  {
    family: "datadome",
    confidence: "high",
    host: {
      equals: ["captcha-delivery.com", "captcha.datadome.co"],
      suffix: [".captcha-delivery.com"]
    }
  },
  {
    family: "perimeterx",
    confidence: "high",
    path: { includes: ["/px/captcha"] }
  },
  {
    family: "perimeterx",
    confidence: "high",
    host: {
      equals: ["captcha.px-cdn.net"],
      suffix: [".px-cloud.net"]
    }
  },
  {
    family: "perimeterx",
    confidence: "high",
    title: { equals: ["Access to this page has been denied"] }
  },
  {
    family: "imperva",
    confidence: "high",
    path: { includes: ["/_Incapsula_Resource"] }
  },
  {
    family: "distil",
    confidence: "high",
    title: { equals: ["Pardon Our Interruption"] }
  },
  {
    family: "aws_waf",
    confidence: "high",
    host: { suffix: [".token.awswaf.com"] }
  },
  {
    family: "vercel_checkpoint",
    confidence: "high",
    title: { startsWith: ["Vercel Security Checkpoint"] }
  },
  {
    family: "vercel_checkpoint",
    confidence: "high",
    path: { includes: ["/.well-known/vercel/security/"] }
  },
  {
    family: "generic_access_denied",
    confidence: "low",
    host: { equals: ["google.com"], suffix: [".google.com"] },
    title: { equals: ["Access Denied"] }
  },
  {
    family: "akamai",
    confidence: "low",
    title: { equals: ["Access Denied"] }
  }
];
function matchesHost(criteria, hostname3) {
  return (criteria.equals?.includes(hostname3) ?? false) || (criteria.suffix?.some((suffix) => hostname3.endsWith(suffix)) ?? false);
}
function matchesPath(criteria, pathname) {
  return (criteria.equals?.includes(pathname) ?? false) || (criteria.prefix?.some((prefix) => pathname.startsWith(prefix)) ?? false) || (criteria.includes?.some((part) => pathname.includes(part)) ?? false);
}
function matchesTitle(criteria, title) {
  return (criteria.equals?.includes(title) ?? false) || (criteria.startsWith?.some((prefix) => title.startsWith(prefix)) ?? false);
}
function matchesSignature(signature, page) {
  return (signature.host === void 0 || matchesHost(signature.host, page.hostname)) && (signature.path === void 0 || matchesPath(signature.path, page.pathname)) && (signature.title === void 0 || matchesTitle(signature.title, page.title));
}
function telemetrySafePageUrl(url2) {
  return `${url2.origin}${url2.pathname}`.slice(0, MAX_BLOCKED_URL_LENGTH);
}
function classifyBotBlockPage(page) {
  if (!URL.canParse(page.url)) return void 0;
  const url2 = new URL(page.url);
  const hostname3 = url2.hostname.toLowerCase().replace(/^www\./, "");
  const title = page.title.trim();
  for (const signature of BOT_BLOCK_SIGNATURES) {
    if (matchesSignature(signature, {
      hostname: hostname3,
      pathname: url2.pathname,
      title
    })) {
      return {
        family: signature.family,
        confidence: signature.confidence,
        blockedHost: hostname3.slice(0, MAX_BLOCKED_HOST_LENGTH),
        blockedUrl: telemetrySafePageUrl(url2)
      };
    }
  }
  return void 0;
}
var slotsByConversation = /* @__PURE__ */ new Map();
function beginTurnBotBlock(args) {
  if (args.conversationId.length === 0) return;
  slotsByConversation.set(args.conversationId, { turnId: void 0, hit: void 0 });
}
function bindTurnBotBlock(args) {
  if (args.conversationId.length === 0) return;
  const existing = slotsByConversation.get(args.conversationId);
  if (existing !== void 0) {
    existing.turnId = args.turnId;
    return;
  }
  slotsByConversation.set(args.conversationId, { turnId: args.turnId, hit: void 0 });
}
function noteTurnBotBlock(args) {
  if (args.conversationId.length === 0) return;
  const slot = slotsByConversation.get(args.conversationId);
  if (slot === void 0) return;
  if (args.turnId !== void 0 && slot.turnId !== void 0 && args.turnId !== slot.turnId) {
    return;
  }
  slot.hit = args.hit;
}
function peekTurnBotBlock(conversationId) {
  return slotsByConversation.get(conversationId)?.hit;
}
function consumeTurnBotBlock(conversationId) {
  const hit = slotsByConversation.get(conversationId)?.hit;
  slotsByConversation.delete(conversationId);
  return hit;
}
function adjustTurnOutcomeForBotBlock(args) {
  if (args.outcome === "error" && peekTurnBotBlock(args.conversationId) !== void 0) {
    return { outcome: "error", errorType: BOT_BLOCK_ERROR_TYPE };
  }
  return { outcome: args.outcome, errorType: "none" };
}
function withBotBlockDetection(auditor, onHit, lookupSigned = () => void 0, onResolved, now = Date.now) {
  const episodesByPageId = /* @__PURE__ */ new Map();
  return {
    record: (record2) => {
      auditor.record(record2);
      if (record2.action.kind !== "browserNavigation") return;
      const pageId = record2.action.pageId;
      const hit = classifyBotBlockPage({
        url: record2.action.url,
        title: record2.action.pageTitle
      });
      if (hit === void 0) {
        const episode2 = episodesByPageId.get(pageId);
        if (episode2 !== void 0) {
          episodesByPageId.delete(pageId);
          const durationMs = Math.min(now() - episode2.firstSeenMs, MAX_WALL_EPISODE_DURATION_MS);
          const resolvedSameTurn = episode2.mintTurnId !== void 0 && record2.turnId !== void 0 ? episode2.mintTurnId === record2.turnId : void 0;
          onResolved?.(
            {
              family: episode2.hit.family,
              blockedHost: episode2.hit.blockedHost,
              durationMs,
              wallEpisodeId: episode2.episodeId,
              resolutionKind: resolutionKindFor({
                blockedHost: episode2.hit.blockedHost,
                resolvedUrl: record2.action.url,
                durationMs
              }),
              ...resolvedSameTurn === void 0 ? {} : { resolvedSameTurn }
            },
            record2
          );
        }
        return;
      }
      const signed = withSignedLookup(hit, record2.action.url, lookupSigned);
      const existing = episodesByPageId.get(pageId);
      const episode = existing !== void 0 && existing.hit.family === signed.family && existing.hit.blockedHost === signed.blockedHost ? existing : {
        episodeId: crypto.randomUUID(),
        hit: signed,
        url: record2.action.url,
        firstSeenMs: now(),
        mintTurnId: record2.turnId
      };
      episode.url = record2.action.url;
      episodesByPageId.set(pageId, episode);
      const stamped = { ...signed, wallEpisodeId: episode.episodeId };
      noteTurnBotBlock({
        conversationId: record2.agentId,
        hit: stamped,
        turnId: record2.turnId
      });
      onHit(stamped, record2);
    },
    wallEpisodeForNavigation: (record2) => {
      if (record2.action.kind !== "browserNavigation") return void 0;
      const episode = episodesByPageId.get(record2.action.pageId);
      return episode !== void 0 && episode.url === record2.action.url ? episode.episodeId : void 0;
    }
  };
}
function withSignedLookup(hit, url2, lookupSigned) {
  if (!URL.canParse(url2)) return hit;
  const detail = lookupSigned(new URL(url2).origin);
  if (detail === void 0) return hit;
  return {
    ...hit,
    webBotAuthSigned: detail.signed,
    ...detail.source === void 0 ? {} : { webBotAuthSignatureSource: detail.source }
  };
}


var PresignedUrlRejectedError = class extends Error {
  constructor(options2) {
    super(options2.message);
    this.name = "PresignedUrlRejectedError";
    this.code = options2.code;
    this.url = options2.url;
  }
};
function defaultPresignedUrlValidator(url2) {
  assertSafeAuthority(url2);
  if (url2.protocol !== "https:") {
    throw new PresignedUrlRejectedError({
      code: "scheme_not_allowed",
      message: `Refused presigned URL with non-https scheme: ${url2.protocol}`,
      url: redactPresignedUrlString(url2)
    });
  }
  const hostname3 = stripIPv6Brackets(url2.hostname);
  if (isLocalOrInternalHost(hostname3)) {
    throw new PresignedUrlRejectedError({
      code: "private_host_not_allowed",
      message: `Refused https presigned URL with private/internal host: ${hostname3}`,
      url: redactPresignedUrlString(url2)
    });
  }
  if (!isAwsS3Hostname(hostname3)) {
    throw new PresignedUrlRejectedError({
      code: "host_not_allowed",
      message: `Refused presigned URL whose host is not an AWS S3 endpoint: ${hostname3}`,
      url: redactPresignedUrlString(url2)
    });
  }
}
function isAwsS3Hostname(hostname3) {
  const lowered = hostname3.toLowerCase();
  if (lowered !== "amazonaws.com" && !lowered.endsWith(".amazonaws.com")) {
    return false;
  }
  const labels = lowered.split(".");
  return labels.some((label) => S3_OBJECT_LABELS.has(label));
}
var S3_OBJECT_LABELS = /* @__PURE__ */ new Set(["s3", "s3-accelerate", "s3-fips"]);
function createHostAllowlistValidator(allowedHosts) {
  const allowed = new Set(allowedHosts.map((host) => host.toLowerCase()));
  return (url2) => {
    defaultPresignedUrlValidator(url2);
    if (!allowed.has(url2.hostname.toLowerCase())) {
      throw new PresignedUrlRejectedError({
        code: "host_not_allowed",
        message: `Refused presigned URL whose host is not in the allowlist: ${url2.hostname}`,
        url: redactPresignedUrlString(url2)
      });
    }
  };
}
var BCS_AGENT_STORE_BUCKET_HOSTS = [
  "agent-stores.s3.us-east-1.amazonaws.com",
  "agent-stores.s3.amazonaws.com"
];
var PLAYGROUND_AGENT_STORE_BUCKET_HOSTS = [
  "agent-stores-928182716709-us-west-2-an.s3.us-west-2.amazonaws.com",
  "agent-stores-928182716709-us-west-2-an.s3.amazonaws.com"
];
function createBcsPresignedUrlValidator() {
  return createHostAllowlistValidator(BCS_AGENT_STORE_BUCKET_HOSTS);
}
function isLocalAgentStoreBackendUrl(backendUrl) {
  const trimmed = backendUrl.trim();
  if (trimmed === "") {
    return false;
  }
  return trimmed.includes("localhost") || trimmed.includes("lclhst.build");
}
function isPlaygroundAgentStoreBackendUrl(backendUrl) {
  try {
    const hostname3 = new URL(backendUrl).hostname.toLowerCase();
    return hostname3 === "playground.cursor.sh" || hostname3.endsWith(".playground.cursor.sh");
  } catch (_a19) {
    return false;
  }
}
function createAgentStorePresignedUrlValidatorForBackend(backendUrl) {
  if (isLocalAgentStoreBackendUrl(backendUrl)) {
    return createLocalDevAgentStorePresignedUrlValidator();
  }
  if (isPlaygroundAgentStoreBackendUrl(backendUrl)) {
    return createHostAllowlistValidator(PLAYGROUND_AGENT_STORE_BUCKET_HOSTS);
  }
  return createBcsPresignedUrlValidator();
}
function createLocalDevAgentStorePresignedUrlValidator() {
  const bcsValidator = createBcsPresignedUrlValidator();
  return (url2) => {
    assertSafeAuthority(url2);
    const hostname3 = stripIPv6Brackets(url2.hostname);
    if (url2.protocol === "http:" && isLoopbackHostName(hostname3)) {
      return;
    }
    bcsValidator(url2);
  };
}
function assertSafeAuthority(url2) {
  if (url2.username !== "" || url2.password !== "") {
    throw new PresignedUrlRejectedError({
      code: "userinfo_not_allowed",
      message: "Refused presigned URL with embedded userinfo",
      url: redactPresignedUrlString(url2)
    });
  }
}
function redactPresignedUrlString(url2) {
  try {
    const parsed2 = typeof url2 === "string" ? new URL(url2) : url2;
    return `${parsed2.protocol}//${parsed2.host}${parsed2.pathname}`;
  } catch (_a19) {
    return "<unparseable-presigned-url>";
  }
}
function assertPresignedUrlSafe(args) {
  let parsed2;
  try {
    parsed2 = new URL(args.rawUrl);
  } catch (_a19) {
    throw new Error(`Refusing unparseable presigned URL for ${args.relPath}`);
  }
  try {
    args.validatePresignedUrl(parsed2);
  } catch (error41) {
    throw new Error(`Refusing presigned URL for ${args.relPath}: ${error41 instanceof Error ? error41.message : String(error41)}`, { cause: error41 instanceof Error ? error41 : void 0 });
  }
}
function isLoopbackHostName(hostname3) {
  const lowered = hostname3.toLowerCase();
  return lowered === "localhost" || lowered === "ip6-localhost" || lowered === "127.0.0.1" || lowered === "::1" || lowered === "0:0:0:0:0:0:0:1";
}
function isLocalOrInternalHost(hostname3) {
  if (hostname3.length === 0) {
    return true;
  }
  if (isLoopbackHostName(hostname3)) {
    return true;
  }
  if (isIPv4Address(hostname3)) {
    return isPrivateOrInternalIPv4(hostname3);
  }
  if (isIPv6Address(hostname3)) {
    return isPrivateOrInternalIPv6(hostname3);
  }
  return false;
}
function stripIPv6Brackets(hostname3) {
  return hostname3.startsWith("[") && hostname3.endsWith("]") ? hostname3.slice(1, -1) : hostname3;
}
function isIPv4Address(hostname3) {
  const parts = hostname3.split(".");
  if (parts.length !== 4) {
    return false;
  }
  return parts.every((part) => {
    if (part.length === 0 || part.length > 3) {
      return false;
    }
    if (!/^\d+$/.test(part)) {
      return false;
    }
    const n = Number(part);
    return Number.isInteger(n) && n >= 0 && n <= 255;
  });
}
function isPrivateOrInternalIPv4(hostname3) {
  const [a, b2] = hostname3.split(".").map(Number);
  if (a === void 0 || b2 === void 0) {
    return true;
  }
  if (a === 0)
    return true;
  if (a === 10)
    return true;
  if (a === 127)
    return true;
  if (a === 169 && b2 === 254)
    return true;
  if (a === 172 && b2 >= 16 && b2 <= 31)
    return true;
  if (a === 192 && b2 === 168)
    return true;
  if (a === 100 && b2 >= 64 && b2 <= 127)
    return true;
  if (a >= 224 && a <= 239)
    return true;
  if (a >= 240)
    return true;
  return false;
}
function isIPv6Address(hostname3) {
  return hostname3.includes(":");
}
function isPrivateOrInternalIPv6(hostname3) {
  const lowered = hostname3.toLowerCase();
  if (lowered === "::" || lowered === "::1") {
    return true;
  }
  const mapped = extractIPv4MappedAddress(lowered);
  if (mapped !== void 0) {
    return isPrivateOrInternalIPv4(mapped);
  }
  if (lowered.startsWith("fc") || lowered.startsWith("fd")) {
    return true;
  }
  if (lowered.startsWith("fe8") || lowered.startsWith("fe9")) {
    return true;
  }
  if (lowered.startsWith("fea") || lowered.startsWith("feb")) {
    return true;
  }
  if (lowered.startsWith("ff")) {
    return true;
  }
  return false;
}
function extractIPv4MappedAddress(hostname3) {
  const dotted = hostname3.match(/^(?:0:0:0:0:0|::):?ffff:(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})$/i);
  if (dotted) {
    return dotted[1];
  }
  if (hostname3.startsWith("::ffff:")) {
    const tail = hostname3.slice("::ffff:".length);
    if (isIPv4Address(tail)) {
      return tail;
    }
    const hex = tail.match(/^([0-9a-f]{1,4}):([0-9a-f]{1,4})$/i);
    if (hex) {
      const high = Number.parseInt(hex[1], 16);
      const low = Number.parseInt(hex[2], 16);
      if (Number.isFinite(high) && Number.isFinite(low) && high >= 0 && high <= 65535 && low >= 0 && low <= 65535) {
        return `${high >> 8 & 255}.${high & 255}.${low >> 8 & 255}.${low & 255}`;
      }
    }
  }
  return void 0;
}

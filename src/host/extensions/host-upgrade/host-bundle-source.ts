init_dist();
init_errors();
var SandHostBundleSourceError = class extends SandDomainError {
  name = "SandHostBundleSourceError";
};
var VERSION_CACHE_TTL_MS = 10 * 6e4;
function hostBundleBaseUrl(override) {
  return override ?? SAND_HOST_BUNDLE_PUBLIC_BASE_URL;
}
function resolveHostBundleChannel(liveConfiguredChannel) {
  const live = typeof liveConfiguredChannel === "string" ? liveConfiguredChannel.trim() : liveConfiguredChannel;
  return coerceSandHostBundleChannel(live);
}
function hostBundleVersionUrl(channel, base = SAND_HOST_BUNDLE_PUBLIC_BASE_URL) {
  return `${base}/${sandHostBundleVersionFileName(channel)}`;
}
function hostBundleTarballUrl(version3, base = SAND_HOST_BUNDLE_PUBLIC_BASE_URL) {
  return `${base}/${SAND_HOST_BUNDLE_S3_PREFIX}-${version3}.tgz`;
}
function hostBundleDigestUrl(version3, base = SAND_HOST_BUNDLE_PUBLIC_BASE_URL) {
  return `${hostBundleTarballUrl(version3, base)}.sha256`;
}
var cachedVersions = /* @__PURE__ */ new Map();
async function fetchLatestHostBundleVersion(fetchFn = fetch, channel = resolveHostBundleChannel(), base = SAND_HOST_BUNDLE_PUBLIC_BASE_URL) {
  const cached2 = cachedVersions.get(channel);
  if (cached2 !== void 0 && Date.now() - cached2.at < VERSION_CACHE_TTL_MS) {
    return cached2.version;
  }
  try {
    const resp = await fetchFn(hostBundleVersionUrl(channel, base));
    if (!resp.ok) return void 0;
    const raw = (await resp.text()).trim();
    if (!SHORT_GIT_SHA_REGEX.test(raw)) return void 0;
    cachedVersions.set(channel, { version: raw, at: Date.now() });
    return raw;
  } catch (error41) {
    reportFallback("host_bundle_source", error41);
    return void 0;
  }
}
async function fetchHostBundleDigest(fetchFn, version3, base) {
  const url2 = hostBundleDigestUrl(version3, base);
  const resp = await fetchFn(url2);
  if (!resp.ok) {
    throw new SandHostBundleSourceError(
      `sand host bundle: digest ${url2} missing (status ${resp.status}); tarball not requested`
    );
  }
  const sha2563 = parseSandHostBundleDigest(await resp.text());
  if (sha2563 === null) {
    throw new SandHostBundleSourceError(
      `sand host bundle: digest ${url2} malformed; tarball not requested`
    );
  }
  return sha2563;
}
async function fetchHostBundle(fetchFn, version3, base) {
  if (!SHORT_GIT_SHA_REGEX.test(version3)) {
    throw new SandHostBundleSourceError(
      `sand host bundle: refusing malformed version "${version3}"`
    );
  }
  const sha2563 = await fetchHostBundleDigest(fetchFn, version3, base);
  const url2 = hostBundleTarballUrl(version3, base);
  const resp = await fetchFn(url2);
  if (!resp.ok) {
    throw new SandHostBundleSourceError(
      `sand host bundle: fetch ${url2} failed (status ${resp.status})`
    );
  }
  const bytes = new Uint8Array(await resp.arrayBuffer());
  if (bytes.length === 0) {
    throw new SandHostBundleSourceError(`sand host bundle: fetched empty tarball from ${url2}`);
  }
  return { bytes, sha256: sha2563 };
}
async function resolveHostBundleSource(fetchFn = fetch, channel = resolveHostBundleChannel(), base = SAND_HOST_BUNDLE_PUBLIC_BASE_URL) {
  const version3 = await fetchLatestHostBundleVersion(fetchFn, channel, base);
  if (version3 === void 0) return void 0;
  return {
    version: version3,
    loadBundle: () => fetchHostBundle(fetchFn, version3, base)
  };
}

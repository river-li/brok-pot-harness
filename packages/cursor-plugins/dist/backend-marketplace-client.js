var __awaiter56 = function(thisArg, _arguments, P2, generator) {
  function adopt(value) {
    return value instanceof P2 ? value : new P2(function(resolve29) {
      resolve29(value);
    });
  }
  return new (P2 || (P2 = Promise))(function(resolve29, reject2) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject2(e);
      }
    }
    function rejected3(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject2(e);
      }
    }
    function step(result) {
      result.done ? resolve29(result.value) : adopt(result.value).then(fulfilled, rejected3);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
var __rest5 = function(s3, e) {
  var t = {};
  for (var p2 in s3) if (Object.prototype.hasOwnProperty.call(s3, p2) && e.indexOf(p2) < 0)
    t[p2] = s3[p2];
  if (s3 != null && typeof Object.getOwnPropertySymbols === "function")
    for (var i = 0, p2 = Object.getOwnPropertySymbols(s3); i < p2.length; i++) {
      if (e.indexOf(p2[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s3, p2[i]))
        t[p2[i]] = s3[p2[i]];
    }
  return t;
};
var log = (0, import_node_util3.debuglog)("cursor-plugins");
function normalizeEffectiveUserPluginsResponse(response) {
  const plugins = response.plugins;
  if (!Array.isArray(plugins) || plugins.length === 0) {
    return response;
  }
  const normalized = plugins.map((ep) => {
    const cv = ep.configuredVariables;
    if (cv === void 0 || cv === null) {
      return ep;
    }
    if (typeof cv === "object") {
      const maybeProto = cv;
      if (typeof maybeProto.toJson === "function") {
        let json3;
        try {
          json3 = maybeProto.toJson();
        } catch (_a19) {
          return ep;
        }
        return Object.assign(Object.assign({}, ep), { configuredVariables: json3 !== null && typeof json3 === "object" && !Array.isArray(json3) ? json3 : void 0 });
      }
    }
    return ep;
  });
  return Object.assign(Object.assign({}, response), { plugins: normalized });
}
function catalogInstallNameForPlugin(params) {
  var _a19;
  const trimmed = (_a19 = params.name) === null || _a19 === void 0 ? void 0 : _a19.trim();
  if (trimmed !== void 0 && trimmed.length > 0) {
    return trimmed;
  }
  return params.pluginId;
}
function resolveEffectivePluginMarketplace(plugin, marketplaces) {
  if ((plugin === null || plugin === void 0 ? void 0 : plugin.marketplace) !== void 0) {
    return plugin.marketplace;
  }
  if ((plugin === null || plugin === void 0 ? void 0 : plugin.marketplaceId) === void 0) {
    return void 0;
  }
  return (marketplaces !== null && marketplaces !== void 0 ? marketplaces : []).find((m2) => m2.id !== void 0 && String(m2.id) === String(plugin.marketplaceId));
}
function resolveInstallGitUrl(pluginGitUrl, marketplace) {
  var _a19;
  const distributionGitUrl = (_a19 = marketplace === null || marketplace === void 0 ? void 0 : marketplace.distributionGitUrl) === null || _a19 === void 0 ? void 0 : _a19.trim();
  if (!distributionGitUrl) {
    return pluginGitUrl;
  }
  if ((marketplace === null || marketplace === void 0 ? void 0 : marketplace.gitUrl) && !isSameCanonicalRepo(pluginGitUrl, marketplace.gitUrl)) {
    return pluginGitUrl;
  }
  return distributionGitUrl;
}
function resolveMarketplaceCloneGitUrl(marketplace) {
  var _a19;
  return ((_a19 = marketplace === null || marketplace === void 0 ? void 0 : marketplace.distributionGitUrl) === null || _a19 === void 0 ? void 0 : _a19.trim()) || (marketplace === null || marketplace === void 0 ? void 0 : marketplace.gitUrl);
}
function toSourceFallbackEntry(entry) {
  const fallback2 = entry.originSourceFallback;
  if (fallback2 === void 0) {
    return void 0;
  }
  let marketplace = entry.marketplace;
  if (marketplace !== void 0) {
    if (fallback2.marketplaceGitUrl !== void 0) {
      marketplace = Object.assign(Object.assign({}, marketplace), { gitUrl: fallback2.marketplaceGitUrl });
    } else {
      const { gitUrl: _gitUrl, gitRef: _gitRef } = marketplace, rest = __rest5(marketplace, ["gitUrl", "gitRef"]);
      marketplace = rest;
    }
  }
  return Object.assign(Object.assign({}, entry), {
    downloadUrl: fallback2.downloadUrl,
    marketplace,
    // The retry never contacts Origin, so it must neither report an Origin
    // load nor re-enter this fallback.
    isOriginBacked: void 0,
    originSourceFallback: void 0
  });
}
function resolveEffectivePluginRef(effectivePlugin, marketplaces) {
  var _a19, _b2;
  if (effectivePlugin.pinnedGitRef) {
    return effectivePlugin.pinnedGitRef;
  }
  if ((_a19 = effectivePlugin.plugin) === null || _a19 === void 0 ? void 0 : _a19.gitRef) {
    return effectivePlugin.plugin.gitRef;
  }
  const mkt = resolveEffectivePluginMarketplace(effectivePlugin.plugin, marketplaces);
  const pluginGitUrl = (_b2 = effectivePlugin.plugin) === null || _b2 === void 0 ? void 0 : _b2.gitUrl;
  const mktGitUrl = mkt === null || mkt === void 0 ? void 0 : mkt.gitUrl;
  const hasOwnRepo = pluginGitUrl && mktGitUrl && pluginGitUrl !== mktGitUrl;
  if (!hasOwnRepo && (mkt === null || mkt === void 0 ? void 0 : mkt.gitRef)) {
    return mkt.gitRef;
  }
  return "main";
}
var BACKEND_GIT_PREFIX = "backend-git://";
function encodeBackendPluginSource(gitUrl, ref, gitPath) {
  const pathPart = gitPath ? `#${encodeURIComponent(gitPath)}` : "";
  return `${BACKEND_GIT_PREFIX}${encodeURIComponent(gitUrl)}@${encodeURIComponent(ref)}${pathPart}`;
}
function decodeBackendPluginSource(downloadUrl) {
  if (!downloadUrl.startsWith(BACKEND_GIT_PREFIX))
    return null;
  const rest = downloadUrl.slice(BACKEND_GIT_PREFIX.length);
  const hashIdx = rest.indexOf("#");
  const refPart = hashIdx >= 0 ? rest.slice(0, hashIdx) : rest;
  const pathPart = hashIdx >= 0 ? rest.slice(hashIdx + 1) : void 0;
  const atIdx = refPart.lastIndexOf("@");
  if (atIdx < 0)
    return null;
  const gitUrl = decodeURIComponent(refPart.slice(0, atIdx));
  const ref = decodeURIComponent(refPart.slice(atIdx + 1));
  const gitPath = pathPart ? decodeURIComponent(pathPart) : void 0;
  return { gitUrl, ref, gitPath };
}
var BACKEND_RELEASE_PREFIX = "backend-release://";
function encodeBackendReleaseSource(opts) {
  const tagPart = opts.tag ? `@${encodeURIComponent(opts.tag)}` : "";
  return `${BACKEND_RELEASE_PREFIX}${encodeURIComponent(opts.repo)}#${encodeURIComponent(opts.asset)}${tagPart}`;
}
function decodeBackendReleaseSource(downloadUrl) {
  if (!downloadUrl.startsWith(BACKEND_RELEASE_PREFIX))
    return null;
  const rest = downloadUrl.slice(BACKEND_RELEASE_PREFIX.length);
  const hashIdx = rest.indexOf("#");
  if (hashIdx < 0)
    return null;
  const repo = decodeURIComponent(rest.slice(0, hashIdx));
  const afterHash = rest.slice(hashIdx + 1);
  const atIdx = afterHash.lastIndexOf("@");
  const asset = atIdx >= 0 ? decodeURIComponent(afterHash.slice(0, atIdx)) : decodeURIComponent(afterHash);
  const tag = atIdx >= 0 ? decodeURIComponent(afterHash.slice(atIdx + 1)) : void 0;
  return { repo, asset, tag };
}
var SHA_REF_REGEX2 = /^[0-9a-f]{7,40}$/i;
function getCanonicalRepoIdentity(gitUrl) {
  let segments;
  try {
    segments = getCanonicalMarketplacePathSegments(gitUrl);
  } catch (_a19) {
    return null;
  }
  return `${segments.host}\0${segments.pathSegments.join("\0")}`;
}
function isSameCanonicalRepo(left, right) {
  if (left.trim() === right.trim()) {
    return true;
  }
  const leftIdentity = getCanonicalRepoIdentity(left);
  const rightIdentity = getCanonicalRepoIdentity(right);
  return leftIdentity !== null && leftIdentity === rightIdentity;
}
function deriveGitPathFromMarketplaceManifest(cloneDir, pluginName) {
  return __awaiter56(this, void 0, void 0, function* () {
    var _a19;
    for (const manifestRelPath of MARKETPLACE_MANIFEST_PATHS) {
      const manifestPath2 = (0, import_node_path62.join)(cloneDir, manifestRelPath);
      let content;
      try {
        content = yield (0, import_promises33.readFile)(manifestPath2, "utf-8");
      } catch (_b2) {
        continue;
      }
      const parseResult = parseMarketplaceManifest(content);
      if (!parseResult.success) {
        return {
          type: "manifest-unresolved",
          reason: `Invalid marketplace manifest at ${manifestRelPath}: ${parseResult.error}`
        };
      }
      const manifest = parseResult.data;
      const entry = manifest.plugins.find((p2) => p2.name === pluginName.toLowerCase());
      if (!entry) {
        return {
          type: "manifest-unresolved",
          reason: `Plugin ${JSON.stringify(pluginName)} not found in ${manifestRelPath}`
        };
      }
      if (typeof entry.source !== "string" && entry.source.source === "git-subdir") {
        return {
          type: "manifest-unresolved",
          // git-subdir points at a different repository, so resolving it against the
          // marketplace clone root would produce the wrong install source.
          reason: `Plugin ${JSON.stringify(pluginName)} uses unsupported git-subdir source`
        };
      }
      const resolved = resolvePluginSourcePath(entry.source, (_a19 = manifest.metadata) === null || _a19 === void 0 ? void 0 : _a19.pluginRoot);
      if (!resolved || !isPathSafe(resolved)) {
        return {
          type: "manifest-unresolved",
          reason: `Plugin ${JSON.stringify(pluginName)} has unresolved or unsafe source path`
        };
      }
      return { type: "resolved", gitPath: resolved };
    }
    return { type: "no-manifest" };
  });
}
function shallowClone(gitUrl_1, ref_1, targetDir_1) {
  return __awaiter56(this, arguments, void 0, function* (gitUrl, ref, targetDir, pluginLogger = noopPluginMetricsLogger, extraGitConfig, materialize3 = "all", sparsePluginClones = false) {
    const startTime = performance.now();
    const isSha = SHA_REF_REGEX2.test(ref);
    const isHead = ref.toUpperCase() === "HEAD";
    const gitConfig = Object.assign(Object.assign({}, extraGitConfig), { "safe.directory": targetDir });
    const remoteTimeoutMs = sparsePluginClones ? REMOTE_GIT_TIMEOUT_MS : void 0;
    const localTimeoutMs = sparsePluginClones ? LOCAL_GIT_TIMEOUT_MS : void 0;
    const { sparse, sparseDirs } = yield resolveSparseClonePlan(materialize3, sparsePluginClones);
    const sparseCloneArgs = sparse ? ["--filter=blob:none", "--sparse"] : [];
    const sparseSshBatchMode = sparse ? true : void 0;
    const setSparseDirs = (timeoutMs) => __awaiter56(this, void 0, void 0, function* () {
      if (sparse) {
        yield setSparseCheckoutDirs(targetDir, sparseDirs, {
          extraGitConfig: gitConfig,
          timeoutMs,
          sshBatchMode: true
        });
      }
    });
    const attemptClone = (cloneUrl, sshBatchMode) => __awaiter56(this, void 0, void 0, function* () {
      let stderr = "";
      if (isHead) {
        ({ stderr } = yield execGitNonInteractive(["clone", "--depth", "1", ...sparseCloneArgs, cloneUrl, targetDir], {
          extraGitConfig: gitConfig,
          timeoutMs: remoteTimeoutMs,
          sshBatchMode
        }));
        yield setSparseDirs(remoteTimeoutMs);
      } else if (isSha) {
        yield execGitNonInteractive(["init"], {
          cwd: targetDir,
          extraGitConfig: gitConfig,
          timeoutMs: localTimeoutMs
        });
        yield execGitNonInteractive(["remote", "add", "origin", cloneUrl], {
          cwd: targetDir,
          extraGitConfig: gitConfig,
          timeoutMs: localTimeoutMs
        });
        yield setSparseDirs(localTimeoutMs);
        ({ stderr } = yield execGitNonInteractive([
          "fetch",
          "--depth",
          "1",
          ...sparse ? ["--filter=blob:none"] : [],
          "origin",
          ref
        ], {
          cwd: targetDir,
          extraGitConfig: gitConfig,
          timeoutMs: remoteTimeoutMs,
          sshBatchMode
        }));
        yield execGitNonInteractive(["checkout", "FETCH_HEAD"], {
          cwd: targetDir,
          extraGitConfig: gitConfig,
          timeoutMs: remoteTimeoutMs,
          sshBatchMode
        });
      } else {
        ({ stderr } = yield execGitNonInteractive([
          "clone",
          "--depth",
          "1",
          "--branch",
          ref,
          ...sparseCloneArgs,
          cloneUrl,
          targetDir
        ], {
          extraGitConfig: gitConfig,
          timeoutMs: remoteTimeoutMs,
          sshBatchMode
        }));
        yield setSparseDirs(remoteTimeoutMs);
      }
      return stderr;
    });
    const alreadySsh = gitUrl.startsWith("git@") || gitUrl.startsWith("ssh://");
    const sshUrl = alreadySsh ? null : toScmSshUrl(gitUrl);
    let cloneStderr = "";
    if (sshUrl !== null) {
      try {
        cloneStderr = yield attemptClone(sshUrl, true);
      } catch (error41) {
        if (sparsePluginClones && isKilledSubprocessError(error41)) {
          throw error41;
        }
        yield (0, import_promises33.rm)(targetDir, { recursive: true, force: true });
        yield (0, import_promises33.mkdir)(targetDir, { recursive: true });
        cloneStderr = yield attemptClone(gitUrl, sparseSshBatchMode);
      }
    } else {
      cloneStderr = yield attemptClone(gitUrl, sparseSshBatchMode);
    }
    if (sparse && serverIgnoredFilter(cloneStderr)) {
      pluginLogger.log("warn", `shallowClone: server ignored --filter=blob:none for ${gitUrl}; sparse clone downloaded a full pack`);
      pluginLogger.increment("backend_marketplace_client.shallow_clone.filter_ignored_by_server", 1);
    }
    const elapsed = (performance.now() - startTime).toFixed(1);
    log("shallowClone %s@%s completed in %sms", gitUrl, ref, elapsed);
    pluginLogger.log("info", `shallowClone ${gitUrl}@${ref} completed in ${elapsed}ms (${sparse ? "sparse" : "full"})`);
  });
}
var MAX_UNCOMPRESSED_EXTRACT_BYTES = 500 * 1024 * 1024;
var MAX_EXTRACT_FILE_COUNT = 5e4;
var MAX_EXTRACT_COMPRESSION_RATIO = 100;
var MAX_RELEASE_ASSET_BYTES = 100 * 1024 * 1024;
function downloadReleaseToDir(repo, asset, tag, targetDir, expectedSha256, githubToken) {
  return __awaiter56(this, void 0, void 0, function* () {
    const buffer = yield downloadReleaseAssetBuffer({
      repo,
      asset,
      tag,
      expectedSha256,
      githubToken
    });
    const compressedSize = buffer.byteLength;
    yield (0, import_promises33.mkdir)(targetDir, { recursive: true });
    const tempDir = yield (0, import_promises33.mkdtemp)((0, import_node_path62.join)((0, import_node_os14.tmpdir)(), "release-asset-"));
    const tempTarPath = (0, import_node_path62.join)(tempDir, "asset.tar.gz");
    const extractDir = (0, import_node_path62.join)(tempDir, "extracted");
    try {
      yield (0, import_promises33.writeFile)(tempTarPath, buffer);
      yield (0, import_promises33.mkdir)(extractDir, { recursive: true });
      let totalUncompressedSize = 0;
      let entryCount = 0;
      yield So({
        file: tempTarPath,
        cwd: extractDir,
        onReadEntry: (entry) => {
          entryCount++;
          if (entryCount > MAX_EXTRACT_FILE_COUNT) {
            throw new Error(`Release archive contains too many files (>${MAX_EXTRACT_FILE_COUNT}).`);
          }
          totalUncompressedSize += entry.size;
          if (totalUncompressedSize > MAX_UNCOMPRESSED_EXTRACT_BYTES) {
            throw new Error(`Release archive uncompressed size exceeds maximum of ${MAX_UNCOMPRESSED_EXTRACT_BYTES} bytes.`);
          }
          if (compressedSize > 0 && totalUncompressedSize / compressedSize > MAX_EXTRACT_COMPRESSION_RATIO) {
            throw new Error(`Release archive has suspicious compression ratio (>${MAX_EXTRACT_COMPRESSION_RATIO}x).`);
          }
        }
      });
      const topEntries = yield (0, import_promises33.readdir)(extractDir, { withFileTypes: true });
      const topDirs = topEntries.filter((e) => e.isDirectory());
      const topFiles = topEntries.filter((e) => e.isFile());
      let sourceDir = extractDir;
      if (topDirs.length === 1 && topFiles.length === 0) {
        const wrapperDir = (0, import_node_path62.join)(extractDir, topDirs[0].name);
        const wrapperContents = yield (0, import_promises33.readdir)(wrapperDir);
        if (containsPluginRootDir(wrapperContents)) {
          sourceDir = wrapperDir;
        }
      }
      const sourceEntries = yield (0, import_promises33.readdir)(sourceDir);
      yield Promise.all(sourceEntries.map((name17) => (0, import_promises33.cp)((0, import_node_path62.join)(sourceDir, name17), (0, import_node_path62.join)(targetDir, name17), {
        recursive: true,
        verbatimSymlinks: true
      })));
    } finally {
      yield (0, import_promises33.rm)(tempDir, { recursive: true, force: true }).catch(() => {
      });
    }
  });
}
function parseReleaseRepo(repo) {
  const parts = repo.split("/");
  if (parts.length === 3) {
    return {
      apiBase: `https://${parts[0]}/api/v3`,
      ownerRepo: `${parts[1]}/${parts[2]}`,
      host: parts[0]
    };
  }
  if (parts.length === 2) {
    return {
      apiBase: "https://api.github.com",
      ownerRepo: repo,
      host: "github.com"
    };
  }
  throw new Error(`Invalid release repo format: ${repo}`);
}
function isAllowedReleaseDownloadHost(downloadHost, repoHost) {
  if (downloadHost === repoHost || downloadHost.endsWith(".githubusercontent.com")) {
    return true;
  }
  if (repoHost === "github.com") {
    return downloadHost === "github.com";
  }
  return downloadHost.endsWith(`.${repoHost}`);
}
function downloadReleaseAssetBuffer(opts) {
  return __awaiter56(this, void 0, void 0, function* () {
    const { repo, asset, tag } = opts;
    const { apiBase, ownerRepo, host } = parseReleaseRepo(repo);
    const isTrustedHost = host === "github.com";
    const authHeaders = isTrustedHost && opts.githubToken !== void 0 && opts.githubToken.length > 0 ? { Authorization: `token ${opts.githubToken}` } : {};
    const releaseUrl = tag ? `${apiBase}/repos/${ownerRepo}/releases/tags/${encodeURIComponent(tag)}` : `${apiBase}/repos/${ownerRepo}/releases/latest`;
    const releaseRes = yield fetch(releaseUrl, {
      headers: Object.assign({ Accept: "application/vnd.github.v3+json", "User-Agent": "CursorPluginInstaller" }, authHeaders)
    });
    if (!releaseRes.ok) {
      throw new Error(`Failed to fetch release from ${releaseUrl}: ${releaseRes.status} ${releaseRes.statusText}`);
    }
    const release = yield releaseRes.json();
    const matchingAsset = release.assets.find((a) => a.name === asset);
    if (!matchingAsset) {
      const available = release.assets.map((a) => a.name).join(", ");
      throw new Error(`Release asset "${asset}" not found. Available assets: ${available}`);
    }
    if (matchingAsset.size > MAX_RELEASE_ASSET_BYTES) {
      throw new Error(`Release asset "${asset}" exceeds maximum size of ${MAX_RELEASE_ASSET_BYTES} bytes (actual: ${matchingAsset.size})`);
    }
    const downloadUrl = new URL(matchingAsset.browser_download_url);
    if (downloadUrl.protocol !== "https:" || !isAllowedReleaseDownloadHost(downloadUrl.hostname, host)) {
      throw new Error(`Refusing to download release asset from untrusted host: ${downloadUrl.hostname}`);
    }
    const assetRes = yield fetch(matchingAsset.browser_download_url, {
      headers: Object.assign({ "User-Agent": "CursorPluginInstaller", Accept: "application/octet-stream" }, authHeaders)
    });
    if (!assetRes.ok) {
      throw new Error(`Failed to download release asset: ${assetRes.status} ${assetRes.statusText}`);
    }
    if (assetRes.url) {
      const finalUrl = new URL(assetRes.url);
      if (finalUrl.protocol !== "https:" || !isAllowedReleaseDownloadHost(finalUrl.hostname, host)) {
        throw new Error(`Refusing to download release asset: redirected to untrusted host: ${finalUrl.hostname}`);
      }
    }
    const buf = Buffer.from(yield assetRes.arrayBuffer());
    if (buf.byteLength > MAX_RELEASE_ASSET_BYTES) {
      throw new Error(`Release asset "${asset}" actual download size exceeds maximum of ${MAX_RELEASE_ASSET_BYTES} bytes (actual: ${buf.byteLength})`);
    }
    if (opts.expectedSha256) {
      const actualSha256 = (0, import_node_crypto24.createHash)("sha256").update(buf).digest("hex");
      if (actualSha256 !== opts.expectedSha256) {
        throw new Error(`Release asset "${asset}" integrity check failed: expected SHA-256 ${opts.expectedSha256}, got ${actualSha256}`);
      }
    }
    return buf;
  });
}
function clonePluginToDir(entry_1, targetDir_1) {
  return __awaiter56(this, arguments, void 0, function* (entry, targetDir, pluginLogger = noopPluginMetricsLogger, extraGitConfig, options2) {
    var _a19;
    const sparsePluginClones = (_a19 = options2 === null || options2 === void 0 ? void 0 : options2.sparsePluginClones) !== null && _a19 !== void 0 ? _a19 : false;
    const materializeTimeoutMs = sparsePluginClones ? REMOTE_GIT_TIMEOUT_MS : void 0;
    const releaseSource = decodeBackendReleaseSource(entry.downloadUrl);
    if (releaseSource) {
      if (entry.gitPath) {
        const tempDir2 = yield (0, import_promises33.mkdtemp)((0, import_node_path62.join)((0, import_node_os14.tmpdir)(), "release-plugin-"));
        try {
          yield downloadReleaseToDir(releaseSource.repo, releaseSource.asset, releaseSource.tag, tempDir2, options2 === null || options2 === void 0 ? void 0 : options2.expectedReleaseAssetSha256, options2 === null || options2 === void 0 ? void 0 : options2.githubToken);
          const sourceDir = validateAndResolveSubpath(tempDir2, entry.gitPath);
          yield (0, import_promises33.mkdir)(targetDir, { recursive: true });
          yield (0, import_promises33.cp)(sourceDir, targetDir, {
            recursive: true,
            verbatimSymlinks: true
          });
        } finally {
          yield (0, import_promises33.rm)(tempDir2, { recursive: true, force: true }).catch(() => {
          });
        }
      } else {
        yield downloadReleaseToDir(releaseSource.repo, releaseSource.asset, releaseSource.tag, targetDir, options2 === null || options2 === void 0 ? void 0 : options2.expectedReleaseAssetSha256, options2 === null || options2 === void 0 ? void 0 : options2.githubToken);
      }
      return;
    }
    const source = decodeBackendPluginSource(entry.downloadUrl);
    if (!source) {
      throw new Error(`Invalid download URL format for plugin ${entry.pluginId}: ${entry.downloadUrl}`);
    }
    const tempDir = yield (0, import_promises33.mkdtemp)((0, import_node_path62.join)((0, import_node_os14.tmpdir)(), "backend-plugin-"));
    try {
      yield shallowClone(source.gitUrl, source.ref, tempDir, pluginLogger, extraGitConfig, source.gitPath ? materializeSpecForGitPaths([source.gitPath]) : [], sparsePluginClones);
      let sourceDir;
      if (source.gitPath) {
        sourceDir = validateAndResolveSubpath(tempDir, source.gitPath);
      } else {
        const derivedGitPath = yield deriveGitPathFromMarketplaceManifest(tempDir, entry.name);
        if (derivedGitPath.type === "resolved") {
          yield materializeSparseDirs(tempDir, materializeSpecForGitPaths([derivedGitPath.gitPath]), { extraGitConfig, timeoutMs: materializeTimeoutMs });
          sourceDir = validateAndResolveSubpath(tempDir, derivedGitPath.gitPath);
        } else if (derivedGitPath.type === "manifest-unresolved") {
          throw new Error(`Unable to install plugin ${JSON.stringify(entry.name)} without gitPath: ${derivedGitPath.reason}`);
        } else {
          yield materializeSparseDirs(tempDir, "all", {
            extraGitConfig,
            timeoutMs: materializeTimeoutMs
          });
          sourceDir = tempDir;
        }
      }
      yield (0, import_promises33.mkdir)(targetDir, { recursive: true });
      yield (0, import_promises33.cp)(sourceDir, targetDir, {
        recursive: true,
        verbatimSymlinks: true
      });
    } finally {
      yield (0, import_promises33.rm)(tempDir, { recursive: true, force: true }).catch(() => {
      });
    }
  });
}
var BackendMarketplaceClient = class {
  constructor(getEffectiveUserPlugins, optionsOrMarketplaceCacheRoot, pluginLogger, marketplaceCacheOptions, listOptions) {
    var _a19, _b2, _c2, _d, _e2, _f, _g;
    this.getEffectiveUserPlugins = getEffectiveUserPlugins;
    const options2 = typeof optionsOrMarketplaceCacheRoot === "string" || optionsOrMarketplaceCacheRoot === void 0 ? {
      marketplaceCacheRoot: optionsOrMarketplaceCacheRoot,
      pluginLogger,
      marketplaceCacheOptions,
      listOptions
    } : optionsOrMarketplaceCacheRoot;
    const resolvedMarketplaceCacheOptions = (_a19 = options2.marketplaceCacheOptions) !== null && _a19 !== void 0 ? _a19 : marketplaceCacheOptions;
    this.pluginLogger = (_c2 = (_b2 = options2.pluginLogger) !== null && _b2 !== void 0 ? _b2 : pluginLogger) !== null && _c2 !== void 0 ? _c2 : noopPluginMetricsLogger;
    this.extraGitConfig = options2.extraGitConfig;
    this.awaitAuthReady = options2.awaitAuthReady;
    this.githubToken = options2.githubToken;
    this.sparsePluginClones = (_d = options2.sparsePluginClones) !== null && _d !== void 0 ? _d : false;
    this.marketplaceCache = options2.marketplaceCacheRoot ? new MarketplaceCacheManager(options2.marketplaceCacheRoot, Object.assign(Object.assign({}, resolvedMarketplaceCacheOptions), { extraGitConfig: (_e2 = resolvedMarketplaceCacheOptions === null || resolvedMarketplaceCacheOptions === void 0 ? void 0 : resolvedMarketplaceCacheOptions.extraGitConfig) !== null && _e2 !== void 0 ? _e2 : options2.extraGitConfig, sparsePluginClones: this.sparsePluginClones })) : void 0;
    const resolvedListOptions = (_f = options2.listOptions) !== null && _f !== void 0 ? _f : listOptions;
    this.allowedMarketplaceNames = (resolvedListOptions === null || resolvedListOptions === void 0 ? void 0 : resolvedListOptions.allowedMarketplaceNames) ? new Set(resolvedListOptions.allowedMarketplaceNames) : void 0;
    this.enableInlinePlugins = (_g = resolvedListOptions === null || resolvedListOptions === void 0 ? void 0 : resolvedListOptions.enableInlinePlugins) !== null && _g !== void 0 ? _g : false;
  }
  isMarketplaceAllowed(marketplace) {
    if (this.allowedMarketplaceNames === void 0) {
      return true;
    }
    return (marketplace === null || marketplace === void 0 ? void 0 : marketplace.name) !== void 0 && this.allowedMarketplaceNames.has(marketplace.name);
  }
  listEnabledPlugins(_userId, _teamId) {
    return __awaiter56(this, void 0, void 0, function* () {
      var _a19;
      var _b2, _c2, _d, _e2, _f, _g, _h, _j, _k, _l, _m, _o2, _p, _q, _r2;
      const response = yield this.getEffectiveUserPlugins();
      const pluginList = (_b2 = response.plugins) !== null && _b2 !== void 0 ? _b2 : [];
      const marketplacesList = (_c2 = response.marketplaces) !== null && _c2 !== void 0 ? _c2 : [];
      const plugins = [];
      const listFailures = [];
      const resolvedShaByGitRef = /* @__PURE__ */ new Map();
      const resolveVersionSha = (repoUrl, gitRef) => __awaiter56(this, void 0, void 0, function* () {
        const key = `${repoUrl}\0${gitRef}`;
        let sha = resolvedShaByGitRef.get(key);
        if (!sha) {
          const extraGitConfig = resolveExtraGitConfig(this.extraGitConfig);
          const timeoutMs = this.sparsePluginClones ? LS_REMOTE_TIMEOUT_MS : void 0;
          const alreadySsh = repoUrl.startsWith("git@") || repoUrl.startsWith("ssh://");
          const sshUrl = alreadySsh ? null : toScmSshUrl(repoUrl);
          const runLsRemote = (url2, sshBatchMode) => __awaiter56(this, void 0, void 0, function* () {
            const options2 = {};
            if (sshBatchMode)
              options2.sshBatchMode = true;
            if (extraGitConfig !== void 0) {
              options2.extraGitConfig = extraGitConfig;
            }
            if (timeoutMs !== void 0)
              options2.timeoutMs = timeoutMs;
            return (Object.keys(options2).length > 0 ? yield resolveGitRemoteRef(url2, gitRef, options2) : yield resolveGitRemoteRef(url2, gitRef)).fullSha;
          });
          if (sshUrl !== null) {
            try {
              sha = yield runLsRemote(sshUrl, true);
            } catch (error41) {
              if (this.sparsePluginClones && isKilledSubprocessError(error41)) {
                throw error41;
              }
              sha = yield runLsRemote(repoUrl, false);
            }
          } else {
            sha = yield runLsRemote(repoUrl, false);
          }
          resolvedShaByGitRef.set(key, sha);
        }
        return sha;
      });
      const resolveVersionShaWithSourceFallback = (args) => __awaiter56(this, void 0, void 0, function* () {
        const { preferredGitUrl, sourceGitUrl, gitRef, pluginId } = args;
        if (preferredGitUrl !== sourceGitUrl) {
          if (this.awaitAuthReady !== void 0) {
            yield this.awaitAuthReady();
          }
          const preferredKey = `${preferredGitUrl}\0${gitRef}`;
          const isFirstOriginAttempt = !resolvedShaByGitRef.has(preferredKey);
          if (isFirstOriginAttempt) {
            this.pluginLogger.increment("marketplace.origin_distribution.fetch", 1);
          }
          let resolved;
          try {
            resolved = {
              sha: yield resolveVersionSha(preferredGitUrl, gitRef),
              gitUrl: preferredGitUrl
            };
          } catch (err) {
            if (isFirstOriginAttempt) {
              this.pluginLogger.increment("marketplace.origin_distribution.fetch.error", 1);
            }
            this.pluginLogger.captureException(err, {
              error_type: "distribution_url_fallback"
            });
            this.pluginLogger.log("warn", `Distribution mirror ${preferredGitUrl}@${gitRef} unavailable (not synced yet or unreachable); falling back to source ${sourceGitUrl}`, {
              pluginId,
              preferredGitUrl,
              sourceGitUrl,
              gitRef,
              error: String(err)
            });
          }
          if (resolved !== void 0) {
            if (isFirstOriginAttempt) {
              try {
                this.pluginLogger.log("info", `Resolved plugin ${pluginId} from Origin distribution mirror ${preferredGitUrl}@${gitRef}`, {
                  pluginId,
                  preferredGitUrl,
                  gitRef
                });
              } catch (_a20) {
              }
            }
            return resolved;
          }
        }
        return {
          sha: yield resolveVersionSha(sourceGitUrl, gitRef),
          gitUrl: sourceGitUrl
        };
      });
      for (const ep of pluginList) {
        if (!ep.isEnabled || !((_a19 = ep.plugin) === null || _a19 === void 0 ? void 0 : _a19.name))
          continue;
        const p2 = ep.plugin;
        const mkt = resolveEffectivePluginMarketplace(p2, marketplacesList);
        if (!this.isMarketplaceAllowed(mkt)) {
          this.pluginLogger.log("info", `Skipping plugin ${p2.name} because marketplace ${(_d = mkt === null || mkt === void 0 ? void 0 : mkt.name) !== null && _d !== void 0 ? _d : "<none>"} is not allowed`, {
            pluginId: p2.name,
            marketplaceName: mkt === null || mkt === void 0 ? void 0 : mkt.name,
            allowedMarketplaceNames: this.allowedMarketplaceNames !== void 0 ? Array.from(this.allowedMarketplaceNames) : void 0
          });
          continue;
        }
        const name17 = catalogInstallNameForPlugin({
          name: p2.name,
          pluginId: p2.id !== void 0 ? String(p2.id) : (_e2 = p2.name) !== null && _e2 !== void 0 ? _e2 : ""
        });
        const pluginId = name17;
        if (!p2.gitUrl) {
          if (!this.enableInlinePlugins) {
            this.pluginLogger.log("info", `Skipping plugin ${name17} without gitUrl (enableInlinePlugins=false)`, { pluginId });
            continue;
          }
          const inlineJson = ep.inlineContentJson;
          if (!inlineJson) {
            this.pluginLogger.log("info", `Skipping DB-inline plugin ${name17}: no inline content provided`, { pluginId });
            continue;
          }
          const version4 = (0, import_node_crypto24.createHash)("sha256").update(`${(_f = p2.id) !== null && _f !== void 0 ? _f : "0"}:${(_g = p2.updatedAt) !== null && _g !== void 0 ? _g : "0"}`).digest("hex").slice(0, 40);
          const marketplace2 = (mkt === null || mkt === void 0 ? void 0 : mkt.name) ? {
            id: mkt.id !== void 0 ? `${mkt.name}-${mkt.id}` : `${mkt.name}-inline`,
            name: mkt.name
          } : void 0;
          this.pluginLogger.log("info", `BackendMarketplaceClient: Adding DB-inline plugin: ${pluginId}`, {
            pluginId,
            marketplaceId: (_h = marketplace2 === null || marketplace2 === void 0 ? void 0 : marketplace2.id) !== null && _h !== void 0 ? _h : "unknown",
            version: version4
          });
          plugins.push({
            pluginId,
            pluginDbId: p2.id !== void 0 ? String(p2.id) : void 0,
            configuredVariables: ep.configuredVariables,
            isTeamRequired: ep.isTeamRequired,
            name: name17,
            version: version4,
            downloadUrl: `inline://${(_j = p2.id) !== null && _j !== void 0 ? _j : pluginId}`,
            marketplaceDbId: (mkt === null || mkt === void 0 ? void 0 : mkt.id) !== void 0 ? String(mkt.id) : void 0,
            marketplace: marketplace2,
            inlineContentJson: inlineJson
          });
          continue;
        }
        const gitUrl = p2.gitUrl;
        const preferredInstallGitUrl = resolveInstallGitUrl(gitUrl, mkt);
        const ref = resolveEffectivePluginRef(ep, marketplacesList);
        const releaseSource = getReleasePluginSource(p2, ref);
        const marketplaceRef = (_k = mkt === null || mkt === void 0 ? void 0 : mkt.gitRef) !== null && _k !== void 0 ? _k : ref;
        let version3;
        let installGitUrl = preferredInstallGitUrl;
        try {
          if (releaseSource !== void 0) {
            version3 = `release/${releaseSource.releaseTag}`;
          } else {
            const resolved = yield resolveVersionShaWithSourceFallback({
              preferredGitUrl: preferredInstallGitUrl,
              sourceGitUrl: gitUrl,
              gitRef: ref,
              pluginId
            });
            version3 = resolved.sha;
            installGitUrl = resolved.gitUrl;
          }
        } catch (err) {
          this.pluginLogger.captureException(err, {
            error_type: "resolve_version_sha"
          });
          this.pluginLogger.log("error", `Failed to resolve version for plugin ${name17}@${ref}, skipping plugin`, {
            pluginId,
            ref,
            error: String(err)
          });
          const errorMsg = err instanceof Error ? err.message : String(err);
          listFailures.push({
            pluginName: name17,
            pluginId,
            pluginDbId: p2.id !== void 0 ? String(p2.id) : void 0,
            marketplaceName: mkt === null || mkt === void 0 ? void 0 : mkt.name,
            errorMessage: errorMsg,
            errorType: /timed?\s*out/i.test(errorMsg) ? "timeout" : "clone"
          });
          continue;
        }
        let downloadUrl;
        if (releaseSource !== void 0) {
          downloadUrl = encodeBackendReleaseSource({
            repo: releaseSource.releaseRepo,
            asset: releaseSource.releaseAsset,
            tag: releaseSource.releaseTag
          });
        } else {
          downloadUrl = encodeBackendPluginSource(installGitUrl, ref, (_l = p2.gitPath) !== null && _l !== void 0 ? _l : void 0);
        }
        const marketplaceCloneGitUrl = resolveMarketplaceCloneGitUrl(mkt);
        let effectiveMarketplaceCloneGitUrl = marketplaceCloneGitUrl;
        let sourceMarketplaceCloneGitUrl = mkt === null || mkt === void 0 ? void 0 : mkt.gitUrl;
        let marketplaceGitRef = marketplaceRef;
        if ((mkt === null || mkt === void 0 ? void 0 : mkt.gitUrl) && marketplaceCloneGitUrl) {
          const marketplaceUsesPluginRepo = isSameCanonicalRepo(gitUrl, mkt.gitUrl);
          const preferredCacheRepoUrl = marketplaceUsesPluginRepo ? installGitUrl : marketplaceCloneGitUrl;
          const sourceCacheRepoUrl = marketplaceUsesPluginRepo ? gitUrl : mkt.gitUrl;
          const cacheRef = marketplaceUsesPluginRepo ? ref : marketplaceRef;
          sourceMarketplaceCloneGitUrl = sourceCacheRepoUrl;
          try {
            const resolved = yield resolveVersionShaWithSourceFallback({
              preferredGitUrl: preferredCacheRepoUrl,
              sourceGitUrl: sourceCacheRepoUrl,
              gitRef: cacheRef,
              pluginId
            });
            marketplaceGitRef = resolved.sha;
            effectiveMarketplaceCloneGitUrl = resolved.gitUrl;
          } catch (err) {
            this.pluginLogger.captureException(err, {
              error_type: "resolve_marketplace_cache_ref"
            });
            this.pluginLogger.log("warn", `Failed to resolve marketplace cache ref for plugin ${name17} from ${preferredCacheRepoUrl}@${cacheRef}, falling back to raw ref`, {
              pluginId,
              cacheRepoUrl: preferredCacheRepoUrl,
              cacheRef,
              error: String(err)
            });
            effectiveMarketplaceCloneGitUrl = sourceCacheRepoUrl;
          }
        }
        const marketplace = (mkt === null || mkt === void 0 ? void 0 : mkt.name) ? Object.assign({ id: mkt.id !== void 0 ? `${mkt.name}-${mkt.id}` : `${mkt.name}-${encodeURIComponent((_m = mkt.gitUrl) !== null && _m !== void 0 ? _m : "project")}`, name: mkt.name }, effectiveMarketplaceCloneGitUrl && {
          gitUrl: effectiveMarketplaceCloneGitUrl,
          gitRef: marketplaceGitRef
        }) : void 0;
        const resolvedToOrigin = installGitUrl !== gitUrl || effectiveMarketplaceCloneGitUrl !== sourceMarketplaceCloneGitUrl;
        const originSourceFallback = releaseSource === void 0 && resolvedToOrigin ? {
          downloadUrl: encodeBackendPluginSource(gitUrl, ref, (_o2 = p2.gitPath) !== null && _o2 !== void 0 ? _o2 : void 0),
          marketplaceGitUrl: sourceMarketplaceCloneGitUrl
        } : void 0;
        this.pluginLogger.log("info", `BackendMarketplaceClient: Adding enabled plugin: ${pluginId} from ${marketplaceGitRef} at ${p2.gitPath}`, {
          pluginId,
          marketplaceId: (_p = marketplace === null || marketplace === void 0 ? void 0 : marketplace.id) !== null && _p !== void 0 ? _p : "unknown",
          gitPath: (_q = p2.gitPath) !== null && _q !== void 0 ? _q : void 0,
          gitRef: marketplaceGitRef
        });
        plugins.push({
          pluginId,
          pluginDbId: p2.id !== void 0 ? String(p2.id) : void 0,
          configuredVariables: ep.configuredVariables,
          isTeamRequired: ep.isTeamRequired,
          name: name17,
          version: version3,
          downloadUrl,
          marketplaceDbId: (mkt === null || mkt === void 0 ? void 0 : mkt.id) !== void 0 ? String(mkt.id) : void 0,
          marketplace,
          gitPath: (_r2 = p2.gitPath) !== null && _r2 !== void 0 ? _r2 : void 0,
          // For git-backed plugins: installGitUrl !== gitUrl means the
          // distribution mirror resolved successfully and the plugin's content
          // will be fetched from Origin (not the source repo). installPlugin
          // uses this to emit the origin_distribution.load metric + log on a
          // successful content fetch/clone. Not set for release-backed plugins
          // (which use a tarball download URL unrelated to Origin).
          isOriginBacked: releaseSource === void 0 && installGitUrl !== gitUrl ? true : void 0,
          originSourceFallback
        });
      }
      return { plugins, listFailures };
    });
  }
  /**
   * Whether the direct-install fallback would repeat the identical git fetch
   * that the marketplace-cache install just attempted. Used only to suppress
   * the fallback after a budget-killed fetch (a stalled network), where
   * repeating the same fetch would burn another multi-minute budget for the
   * same outcome. Every other failure keeps the legacy fallback: it fails
   * fast when it is truly a duplicate, and it rescues failures the direct
   * install does NOT duplicate (cache-dir races, SSH-pinned promisor
   * materialization in an HTTPS-only environment, a moved branch tip).
   */
  isDirectInstallSameFetch(entry) {
    const mkt = entry.marketplace;
    if (!(mkt === null || mkt === void 0 ? void 0 : mkt.gitUrl) || !mkt.gitRef) {
      return false;
    }
    const direct = decodeBackendPluginSource(entry.downloadUrl);
    if (!direct) {
      return false;
    }
    if (!isSameCanonicalRepo(direct.gitUrl, mkt.gitUrl)) {
      return false;
    }
    return direct.ref === mkt.gitRef || entry.version === mkt.gitRef;
  }
  installPlugin(entry, targetDir) {
    return __awaiter56(this, void 0, void 0, function* () {
      var _a19;
      if (entry.inlineContentJson) {
        yield synthesizeInlinePluginDir({
          targetDir,
          inlineContentJson: entry.inlineContentJson,
          pluginName: entry.name
        });
        return;
      }
      if (entry.isOriginBacked && this.awaitAuthReady !== void 0) {
        yield this.awaitAuthReady();
      }
      try {
        yield this.installFromEntryUrls(entry, targetDir);
        return;
      } catch (err) {
        const sourceEntry = toSourceFallbackEntry(entry);
        if (sourceEntry === void 0) {
          throw err;
        }
        this.pluginLogger.captureException(err, {
          error_type: "install_plugin_from_origin_distribution"
        });
        this.pluginLogger.log("warn", `Failed to install plugin ${entry.name} from the Origin distribution mirror, falling back to the source repo`, {
          pluginId: entry.pluginId,
          version: entry.version,
          sourceDownloadUrl: sourceEntry.downloadUrl,
          sourceMarketplaceGitUrl: (_a19 = sourceEntry.marketplace) === null || _a19 === void 0 ? void 0 : _a19.gitUrl,
          error: String(err)
        });
        this.pluginLogger.increment("marketplace.origin_distribution.install.source_fallback", 1);
        yield (0, import_promises33.rm)(targetDir, { recursive: true, force: true });
        try {
          yield this.installFromEntryUrls(sourceEntry, targetDir);
        } catch (sourceErr) {
          this.pluginLogger.increment("marketplace.origin_distribution.install.source_fallback.error", 1);
          throw sourceErr;
        }
      }
    });
  }
  /**
   * Install a plugin from exactly the URLs its entry carries: the shared
   * marketplace clone first, then a direct clone of the plugin's own repo.
   * Origin-vs-source URL selection belongs to the caller.
   */
  installFromEntryUrls(entry, targetDir) {
    return __awaiter56(this, void 0, void 0, function* () {
      const isReleaseBacked = decodeBackendReleaseSource(entry.downloadUrl) !== null;
      if (!isReleaseBacked) {
        try {
          if (yield this.tryInstallFromMarketplaceCache(entry, targetDir)) {
            this.emitOriginLoadIfApplicable(entry);
            return;
          }
        } catch (err) {
          this.pluginLogger.captureException(err, {
            error_type: "install_plugin_from_marketplace_cache"
          });
          if (this.sparsePluginClones && this.isDirectInstallSameFetch(entry) && isKilledSubprocessError(err)) {
            this.pluginLogger.log("warn", `Failed to install plugin ${entry.name} from marketplace cache; skipping direct install fallback because it would repeat the identical fetch`, {
              pluginId: entry.pluginId,
              version: entry.version,
              error: String(err)
            });
            throw err;
          }
          this.pluginLogger.log("warn", `Failed to install plugin ${entry.name} from marketplace cache, falling back to direct install`, {
            pluginId: entry.pluginId,
            version: entry.version,
            error: String(err)
          });
        }
      }
      yield clonePluginToDir(entry, targetDir, this.pluginLogger, resolveExtraGitConfig(this.extraGitConfig), {
        githubToken: this.githubToken,
        sparsePluginClones: this.sparsePluginClones
      });
      this.emitOriginLoadIfApplicable(entry);
    });
  }
  /**
   * Emit `marketplace.origin_distribution.load` and a structured log when
   * the entry was installed from the Origin distribution mirror. Call only
   * after a successful install (cache or direct clone). Errors from logging
   * or metrics are swallowed so they never corrupt the install outcome.
   */
  emitOriginLoadIfApplicable(entry) {
    if (!entry.isOriginBacked) {
      return;
    }
    try {
      this.pluginLogger.increment("marketplace.origin_distribution.load", 1);
      this.pluginLogger.log("info", `Loaded plugin ${entry.pluginId} from Origin distribution (fetch complete)`, { pluginId: entry.pluginId });
    } catch (_a19) {
    }
  }
  /**
   * Materialize every plugin directory a batch of entries needs, using one
   * sparse checkout per marketplace repo, before any of them is installed.
   *
   * {@link tryInstallFromMarketplaceCache} asks for a single directory at a
   * time. Against a sparse clone each of those is its own lazy fetch from the
   * promisor remote, serialized behind the per-repo lock — so installing N
   * plugins from one monorepo costs N fetches, each paying connection setup,
   * auth, and server-side pack generation. Handing the full directory set to
   * the `ensureCloned` call that CREATES the clone folds them into the single
   * checkout that clone already performs, because the sparse cone is written
   * before the fetch. Every later per-plugin call then finds its directory
   * present and stays local.
   *
   * Callers must pass the very entries their installs will use — in practice
   * `loadFromMarketplaceSource`'s `onPluginsListed` hook. The clone directory
   * is derived from `marketplace.gitUrl`, which {@link listEnabledPlugins} may
   * resolve to the Origin distribution mirror rather than the source repo, and
   * mirror reachability is re-evaluated on every listing. Prewarming entries
   * from a separate listing risks cloning a URL the installs never ask for.
   *
   * Best effort — a repo that fails to prewarm just falls back to the
   * per-plugin path.
   */
  prewarmMarketplaceClones(entries) {
    return __awaiter56(this, void 0, void 0, function* () {
      var _a19;
      const cache3 = this.marketplaceCache;
      if (!cache3) {
        return;
      }
      const groups = /* @__PURE__ */ new Map();
      for (const entry of entries) {
        const mkt = entry.marketplace;
        if (!(mkt === null || mkt === void 0 ? void 0 : mkt.gitUrl)) {
          continue;
        }
        const gitRef = (_a19 = mkt.gitRef) !== null && _a19 !== void 0 ? _a19 : "main";
        const key = `${mkt.id}\0${mkt.gitUrl}\0${gitRef}`;
        let group = groups.get(key);
        if (group === void 0) {
          group = {
            marketplaceId: mkt.id,
            gitUrl: mkt.gitUrl,
            gitRef,
            gitPaths: []
          };
          groups.set(key, group);
        }
        if (entry.gitPath) {
          group.gitPaths.push(entry.gitPath);
        }
      }
      for (const group of groups.values()) {
        const materialize3 = materializeSpecForGitPaths(group.gitPaths);
        const start = performance.now();
        try {
          yield cache3.ensureCloned(group.marketplaceId, group.gitUrl, group.gitRef, this.pluginLogger, { materialize: materialize3 });
          this.pluginLogger.log("info", `Prewarmed marketplace clone ${group.gitUrl}@${group.gitRef} for ${group.gitPaths.length} plugin directories`, {
            marketplaceId: group.marketplaceId,
            gitUrl: group.gitUrl,
            gitRef: group.gitRef,
            requestedDirs: group.gitPaths.length,
            materialize: materialize3 === "all" ? "all" : materialize3.length
          });
          this.pluginLogger.increment("marketplace_cache_manager.prewarm.success", 1, { materialize: materialize3 === "all" ? "all" : "dirs" });
        } catch (err) {
          this.pluginLogger.captureException(err, {
            error_type: "prewarm_marketplace_clone"
          });
          this.pluginLogger.log("warn", `Failed to prewarm marketplace clone ${group.gitUrl}@${group.gitRef}; falling back to per-plugin materialization`, {
            marketplaceId: group.marketplaceId,
            gitUrl: group.gitUrl,
            gitRef: group.gitRef,
            error: String(err)
          });
          this.pluginLogger.increment("marketplace_cache_manager.prewarm.error", 1);
        }
        this.pluginLogger.distribution("marketplace_cache_manager.prewarm.duration", performance.now() - start);
      }
    });
  }
  tryInstallFromMarketplaceCache(entry, targetDir) {
    return __awaiter56(this, void 0, void 0, function* () {
      var _a19, _b2;
      var _c2, _d;
      const cache3 = this.marketplaceCache;
      const mkt = entry.marketplace;
      if (!cache3 || !mkt || !mkt.gitUrl) {
        this.pluginLogger.log("info", "No marketplace cache or marketplace metadata, skipping cache check", {
          pluginId: entry.pluginId,
          name: entry.name,
          version: entry.version,
          marketplaceId: (_a19 = entry.marketplace) === null || _a19 === void 0 ? void 0 : _a19.id
        });
        return false;
      }
      const clonePath = yield cache3.ensureCloned(mkt.id, mkt.gitUrl, (_c2 = mkt.gitRef) !== null && _c2 !== void 0 ? _c2 : "main", this.pluginLogger, {
        materialize: entry.gitPath ? materializeSpecForGitPaths([entry.gitPath]) : []
      });
      const gitPath = (_d = entry.gitPath) !== null && _d !== void 0 ? _d : yield cache3.resolvePluginPath(clonePath, entry.name);
      if (!gitPath) {
        this.pluginLogger.log("info", "No git path found for plugin, skipping cache check", {
          pluginId: entry.pluginId,
          name: entry.name,
          version: entry.version,
          marketplaceId: (_b2 = entry.marketplace) === null || _b2 === void 0 ? void 0 : _b2.id
        });
        return false;
      }
      if (entry.gitPath === void 0) {
        yield cache3.ensureMaterialized(clonePath, materializeSpecForGitPaths([gitPath]), this.pluginLogger);
      }
      const sourcePath = cache3.getPluginDir(clonePath, gitPath);
      yield cache3.copyPluginToDir(sourcePath, targetDir);
      return true;
    });
  }
  discoverMarketplacePlugins(marketplaceId, gitUrl, gitRef) {
    return __awaiter56(this, void 0, void 0, function* () {
      const cache3 = this.marketplaceCache;
      if (!cache3) {
        throw new Error("discoverMarketplacePlugins requires a MarketplaceCacheManager (marketplaceCacheRoot)");
      }
      const clonePath = yield cache3.ensureCloned(marketplaceId, gitUrl, gitRef, this.pluginLogger, { materialize: [] });
      return cache3.discoverPlugins(clonePath);
    });
  }
};
function createBackendMarketplaceClient(getEffectiveUserPlugins, marketplaceCacheRoot, pluginLogger, marketplaceCacheOptions, listOptions) {
  return new BackendMarketplaceClient(getEffectiveUserPlugins, marketplaceCacheRoot, pluginLogger, marketplaceCacheOptions, listOptions);
}

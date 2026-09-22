/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/cursor-plugins/dist/git-remote-ref-resolve.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var __awaiter54 = function(thisArg, _arguments, P2, generator) {
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
var SHA_REF_REGEX = /^[0-9a-f]{7,40}$/i;
var FULL_SHA_REGEX = /^[0-9a-f]{40}$/i;
function parseResolvedCommitSha(stdout) {
  var _a19;
  var _b2;
  if (stdout === void 0 || stdout === "") {
    return void 0;
  }
  const shaLines = stdout.split(/\r?\n/).map((line) => {
    const [sha, refName] = line.split("	");
    if (!sha || !refName || !/^[0-9a-f]{40}$/i.test(sha)) {
      return void 0;
    }
    return { sha, refName };
  }).filter((line) => line !== void 0);
  if (shaLines.length === 0) {
    return void 0;
  }
  return (_b2 = (_a19 = shaLines.find((line) => line.refName.endsWith("^{}"))) === null || _a19 === void 0 ? void 0 : _a19.sha) !== null && _b2 !== void 0 ? _b2 : shaLines[0].sha;
}
function resolveExactRemoteNamedHexRef(gitUrl, ref, options2) {
  return __awaiter54(this, void 0, void 0, function* () {
    var _a19;
    const { stdout } = yield execGitNonInteractive(["ls-remote", gitUrl, `refs/heads/${ref}`, `refs/tags/${ref}`, `refs/tags/${ref}^{}`], {
      sshBatchMode: options2 === null || options2 === void 0 ? void 0 : options2.sshBatchMode,
      extraGitConfig: options2 === null || options2 === void 0 ? void 0 : options2.extraGitConfig,
      timeoutMs: options2 === null || options2 === void 0 ? void 0 : options2.timeoutMs
    });
    return (_a19 = parseResolvedCommitSha(stdout)) === null || _a19 === void 0 ? void 0 : _a19.toLowerCase();
  });
}
function resolveGitRemoteRef(gitUrl, ref, options2) {
  return __awaiter54(this, void 0, void 0, function* () {
    const r = ref.trim();
    if (FULL_SHA_REGEX.test(r)) {
      return { fullSha: r.toLowerCase() };
    }
    if (SHA_REF_REGEX.test(r)) {
      try {
        const namedRefSha = yield resolveExactRemoteNamedHexRef(gitUrl, r, options2);
        if (namedRefSha) {
          return { fullSha: namedRefSha };
        }
      } catch (_a19) {
      }
      return { fullSha: r.toLowerCase() };
    }
    let stdout;
    try {
      if (r.toUpperCase() === "HEAD") {
        const result2 = yield execGitNonInteractive(["ls-remote", "--symref", gitUrl, "HEAD"], {
          sshBatchMode: options2 === null || options2 === void 0 ? void 0 : options2.sshBatchMode,
          extraGitConfig: options2 === null || options2 === void 0 ? void 0 : options2.extraGitConfig,
          timeoutMs: options2 === null || options2 === void 0 ? void 0 : options2.timeoutMs
        });
        const commitSha2 = parseResolvedCommitSha(result2.stdout);
        if (!commitSha2) {
          throw new Error(`git ls-remote did not return a resolvable commit for HEAD (${gitUrl})`);
        }
        return {
          fullSha: commitSha2.toLowerCase(),
          headSymrefStdout: result2.stdout
        };
      }
      const result = yield execGitNonInteractive(["ls-remote", gitUrl, r], {
        sshBatchMode: options2 === null || options2 === void 0 ? void 0 : options2.sshBatchMode,
        extraGitConfig: options2 === null || options2 === void 0 ? void 0 : options2.extraGitConfig,
        timeoutMs: options2 === null || options2 === void 0 ? void 0 : options2.timeoutMs
      });
      stdout = result.stdout;
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      const wrappedError = new Error(`Failed to resolve git ref "${r}" for ${gitUrl}: ${message}`);
      wrappedError.cause = err;
      throw wrappedError;
    }
    const commitSha = parseResolvedCommitSha(stdout);
    if (!commitSha) {
      throw new Error(`git ls-remote did not return a resolvable commit for ref "${r}" (${gitUrl})`);
    }
    return { fullSha: commitSha.toLowerCase() };
  });
}


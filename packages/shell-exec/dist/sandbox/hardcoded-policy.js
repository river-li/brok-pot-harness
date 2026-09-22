function getHardcodedAllowedReadPaths(platform = process.platform, homeDir = import_node_os3.default.homedir(), bundledPaths = {}) {
  const paths = [];
  for (const entry of HARDCODED_ALLOWED_READ_PATHS) {
    if (entry.platform !== platform) {
      continue;
    }
    if (entry.scope === "global") {
      paths.push(entry.path);
      continue;
    }
    const candidate = entry.scope === "home" ? (0, import_node_path5.join)(homeDir, entry.path) : bundledPaths[entry.path];
    if (!candidate) {
      continue;
    }
    try {
      const isAllowedFile = entry.scope === "home" ? (0, import_node_fs3.lstatSync)(candidate).isFile() : (0, import_node_fs3.statSync)(candidate).isFile();
      if (isAllowedFile) {
        paths.push(candidate);
      }
    } catch {
    }
  }
  return paths;
}
function convertPathsToIgnoreMapping(...paths) {
  const mapping = {};
  for (const p2 of paths) {
    let isDir = false;
    try {
      isDir = (0, import_node_fs3.existsSync)(p2) && (0, import_node_fs3.statSync)(p2).isDirectory();
    } catch {
    }
    if (isDir) {
      if (!mapping[p2])
        mapping[p2] = [];
      mapping[p2].push("**");
    } else {
      const lastSlash = p2.lastIndexOf("/");
      const dir = lastSlash > 0 ? p2.slice(0, lastSlash) : "/";
      const file = lastSlash >= 0 ? p2.slice(lastSlash + 1) : p2;
      if (!mapping[dir])
        mapping[dir] = [];
      if (file) {
        mapping[dir].push(file, `${file}/**`);
      } else {
        mapping[dir].push("**");
      }
    }
  }
  return mapping;
}
function getWorkspaceWriteProtectionMapping(workspaceDir) {
  const patterns = HARDCODED_WRITE_PROTECTION_PATTERNS.filter((e) => e.type === "workspace").map((e) => e.pattern);
  return { [workspaceDir]: patterns };
}
function getGitWriteProtectionMapping(gitDirParent) {
  const patterns = HARDCODED_WRITE_PROTECTION_PATTERNS.filter((e) => e.type === "git").map((e) => e.pattern);
  return { [gitDirParent]: patterns };
}
function getWorktreeWriteProtectionMapping(workspaceDir) {
  const patterns = HARDCODED_WRITE_PROTECTION_PATTERNS.filter((e) => e.type === "worktree").map((e) => e.pattern);
  return { [workspaceDir]: patterns };
}
function getHardcodedNetworkPolicy() {
  if (HARDCODED_NETWORK_DENYLIST.length === 0) {
    return void 0;
  }
  return {
    version: 1,
    // Note: We don't set a default here - that's determined by the merge
    deny: [...HARDCODED_NETWORK_DENYLIST]
  };
}
function getEffectiveSandboxReadBoundary(requested, workspaceReadEnabled) {
  if (!workspaceReadEnabled) {
    return "system";
  }
  return requested ?? "system";
}
function getHardcodedSandboxPolicy(workspaceDir) {
  const networkPolicy = getHardcodedNetworkPolicy();
  const homeDir = import_node_os3.default.homedir();
  const additionalReadonlyPaths = [];
  for (const entry of HARDCODED_WRITE_PROTECTION_PATTERNS) {
    switch (entry.type) {
      case "workspace":
        break;
      case "git":
        break;
      case "worktree":
        break;
      case "absolute": {
        additionalReadonlyPaths.push(entry.pattern);
        break;
      }
      case "home": {
        if (homeDir.length > 0) {
          additionalReadonlyPaths.push((0, import_node_path5.join)(homeDir, entry.pattern));
        }
        break;
      }
      default: {
        const _exhaustive = entry.type;
        throw new Error(`Unknown entry type: ${_exhaustive}`);
      }
    }
  }
  return {
    type: "workspace_readwrite",
    additionalReadonlyPaths,
    writeProtectionMapping: getWorkspaceWriteProtectionMapping(workspaceDir),
    ...networkPolicy && { networkPolicy },
    networkPolicyStrict: true
  };
}
function getWorkspaceIgnore() {
  if (_workspaceIgnore === null) {
    _workspaceIgnore = (0, import_ignore.default)({ ignoreCase: true });
    _workspaceIgnore.add(HARDCODED_WRITE_PROTECTION_PATTERNS.filter((e) => e.type === "workspace").map((e) => e.pattern));
  }
  return _workspaceIgnore;
}
function getGitIgnore() {
  if (_gitIgnore === null) {
    _gitIgnore = (0, import_ignore.default)({ ignoreCase: true });
    _gitIgnore.add(HARDCODED_WRITE_PROTECTION_PATTERNS.filter((e) => e.type === "git").map((e) => e.pattern));
  }
  return _gitIgnore;
}
async function resolveWorktreeGitDirParent(workspaceDir) {
  try {
    const commonDir = await spawnPromise("git", ["rev-parse", "--git-common-dir"], {
      cwd: workspaceDir
    });
    return (0, import_node_path5.dirname)((0, import_node_path5.resolve)(workspaceDir, commonDir.trim()));
  } catch {
    return null;
  }
}
function getAbsoluteAndHomePaths() {
  if (_absoluteAndHomePaths !== null)
    return _absoluteAndHomePaths;
  const homeDir = import_node_os3.default.homedir();
  const paths = [];
  for (const entry of HARDCODED_WRITE_PROTECTION_PATTERNS) {
    switch (entry.type) {
      case "absolute":
        paths.push(entry.pattern);
        break;
      case "home":
        if (homeDir.length > 0) {
          paths.push((0, import_node_path5.join)(homeDir, entry.pattern));
        }
        break;
      default:
        break;
    }
  }
  _absoluteAndHomePaths = paths;
  return paths;
}
async function resolveGitContext(workspaceDir) {
  const cached2 = _gitContextCache.get(workspaceDir);
  if (cached2)
    return cached2;
  const dotGitStat = await (0, import_promises3.stat)((0, import_node_path5.join)(workspaceDir, ".git")).catch(() => null);
  const isWorktree = dotGitStat?.isFile() ?? false;
  if (!isWorktree) {
    const result2 = { isWorktree: false, gitDirParent: workspaceDir };
    _gitContextCache.set(workspaceDir, result2);
    return result2;
  }
  const gitDirParent = await resolveWorktreeGitDirParent(workspaceDir);
  const result = {
    isWorktree: true,
    gitDirParent: gitDirParent ?? workspaceDir
  };
  _gitContextCache.set(workspaceDir, result);
  return result;
}
function normalizeRootDir(rootDir) {
  if (!rootDir.endsWith(import_node_path5.sep)) {
    return rootDir;
  }
  const withoutTrailingSep = rootDir.slice(0, -1);
  if (withoutTrailingSep === "" || process.platform === "win32" && /^[a-zA-Z]:$/.test(withoutTrailingSep)) {
    return rootDir;
  }
  return withoutTrailingSep;
}
function rootDescendantPrefix(root) {
  return root.endsWith(import_node_path5.sep) ? root : root + import_node_path5.sep;
}
function isPathUnder(absolutePath, rootDir) {
  const root = normalizeRootDir(rootDir);
  if (_caseInsensitiveFs) {
    const lower = absolutePath.toLowerCase();
    const rootLower = root.toLowerCase();
    return lower === rootLower || lower.startsWith(rootDescendantPrefix(rootLower));
  }
  return absolutePath === root || absolutePath.startsWith(rootDescendantPrefix(root));
}
function relativeForwardSlash(rootDir, absolutePath) {
  const root = normalizeRootDir(rootDir);
  if (_caseInsensitiveFs) {
    return (0, import_node_path5.relative)(root.toLowerCase(), absolutePath.toLowerCase()).replace(/\\/g, "/");
  }
  return (0, import_node_path5.relative)(root, absolutePath).replace(/\\/g, "/");
}
async function isHardcodedWriteProtected(absolutePath, workspaceDir) {
  if (isPathUnder(absolutePath, workspaceDir)) {
    const relPath = relativeForwardSlash(workspaceDir, absolutePath);
    if (getWorkspaceIgnore().ignores(relPath))
      return true;
  }
  const { isWorktree, gitDirParent } = await resolveGitContext(workspaceDir);
  if (isPathUnder(absolutePath, gitDirParent)) {
    const gitRelPath = relativeForwardSlash(gitDirParent, absolutePath);
    if (getGitIgnore().ignores(gitRelPath))
      return true;
  }
  if (isWorktree && isPathUnder(absolutePath, workspaceDir)) {
    const relPath = relativeForwardSlash(workspaceDir, absolutePath);
    if (relPath === ".git")
      return true;
  }
  for (const protectedPath of getAbsoluteAndHomePaths()) {
    if (isPathUnder(absolutePath, protectedPath))
      return true;
  }
  return false;
}
var import_node_fs3, import_promises3, import_node_os3, import_node_path5, import_ignore, HARDCODED_ALLOWED_READ_PATHS, HARDCODED_WRITE_PROTECTION_PATTERNS, HARDCODED_PROTECTED_GIT_PATTERNS, CURSOR_ALLOWED_WRITE_SUBDIRS, HARDCODED_NETWORK_DENYLIST, _workspaceIgnore, _gitIgnore, _absoluteAndHomePaths, _gitContextCache, _caseInsensitiveFs;
var init_hardcoded_policy = __esm({
  "../packages/shell-exec/dist/sandbox/hardcoded-policy.js"() {
    "use strict";
    import_node_fs3 = require("node:fs");
    import_promises3 = require("node:fs/promises");
    import_node_os3 = __toESM(require("node:os"), 1);
    import_node_path5 = require("node:path");
    init_dist3();
    import_ignore = __toESM(require_ignore(), 1);
    HARDCODED_ALLOWED_READ_PATHS = [
      { platform: "linux", scope: "global", path: "/bin" },
      { platform: "linux", scope: "global", path: "/sbin" },
      { platform: "linux", scope: "global", path: "/usr/bin" },
      { platform: "linux", scope: "global", path: "/usr/sbin" },
      { platform: "linux", scope: "global", path: "/usr/local/bin" },
      { platform: "linux", scope: "global", path: "/lib" },
      { platform: "linux", scope: "global", path: "/lib64" },
      { platform: "linux", scope: "global", path: "/usr/lib" },
      { platform: "linux", scope: "global", path: "/usr/lib64" },
      { platform: "linux", scope: "global", path: "/usr/local/lib" },
      { platform: "linux", scope: "global", path: "/usr/libexec" },
      { platform: "linux", scope: "global", path: "/usr/share" },
      { platform: "linux", scope: "global", path: "/etc/ld.so.cache" },
      { platform: "linux", scope: "global", path: "/etc/ld.so.conf" },
      { platform: "linux", scope: "global", path: "/etc/ld.so.conf.d" },
      { platform: "linux", scope: "global", path: "/etc/ssl/certs" },
      { platform: "linux", scope: "global", path: "/etc/ssl/openssl.cnf" },
      { platform: "linux", scope: "global", path: "/etc/ssl/cert.pem" },
      { platform: "linux", scope: "global", path: "/etc/ssl/ca-bundle.pem" },
      {
        platform: "linux",
        scope: "global",
        path: "/etc/ssl/certs/ca-certificates.crt"
      },
      { platform: "linux", scope: "global", path: "/etc/pki/tls/certs" },
      { platform: "linux", scope: "global", path: "/etc/pki/tls/openssl.cnf" },
      { platform: "linux", scope: "global", path: "/etc/pki/ca-trust/extracted" },
      { platform: "linux", scope: "global", path: "/etc/resolv.conf" },
      { platform: "linux", scope: "global", path: "/etc/hosts" },
      { platform: "linux", scope: "global", path: "/etc/nsswitch.conf" },
      { platform: "linux", scope: "global", path: "/etc/gai.conf" },
      { platform: "linux", scope: "global", path: "/etc/alternatives" },
      // Exact system shell and Git configuration files. These make standard
      // shell initialization and repository Git commands work in Workspace
      // read mode without granting a broad /etc read root.
      { platform: "linux", scope: "global", path: "/etc/profile" },
      { platform: "linux", scope: "global", path: "/etc/bash.bashrc" },
      { platform: "linux", scope: "global", path: "/etc/zsh/zshenv" },
      { platform: "linux", scope: "global", path: "/etc/zsh/zprofile" },
      { platform: "linux", scope: "global", path: "/etc/zsh/zshrc" },
      { platform: "linux", scope: "global", path: "/etc/zsh/zlogin" },
      { platform: "linux", scope: "global", path: "/etc/gitconfig" },
      // Exact user shell and Git config files. These are resolved relative to
      // HOME only when they exist as regular files; their parent directory is
      // never granted.
      { platform: "linux", scope: "home", path: ".bashrc" },
      { platform: "linux", scope: "home", path: ".bash_profile" },
      { platform: "linux", scope: "home", path: ".profile" },
      { platform: "linux", scope: "home", path: ".zshenv" },
      { platform: "linux", scope: "home", path: ".zprofile" },
      { platform: "linux", scope: "home", path: ".zshrc" },
      { platform: "linux", scope: "home", path: ".zlogin" },
      { platform: "linux", scope: "home", path: ".gitconfig" },
      { platform: "linux", scope: "bundled", path: "ripgrep" },
      { platform: "darwin", scope: "global", path: "/bin" },
      { platform: "darwin", scope: "global", path: "/usr/bin" },
      { platform: "darwin", scope: "global", path: "/usr/lib" },
      { platform: "darwin", scope: "global", path: "/usr/libexec" },
      { platform: "darwin", scope: "global", path: "/usr/share" },
      { platform: "darwin", scope: "global", path: "/System/Library" },
      { platform: "darwin", scope: "global", path: "/System/Cryptexes" },
      { platform: "darwin", scope: "global", path: "/Library/Apple" },
      {
        platform: "darwin",
        scope: "global",
        path: "/Library/Developer/CommandLineTools"
      },
      { platform: "darwin", scope: "global", path: "/private/etc/ssl/cert.pem" },
      { platform: "darwin", scope: "global", path: "/private/etc/ssl/certs" },
      { platform: "darwin", scope: "global", path: "/private/etc/hosts" },
      { platform: "darwin", scope: "global", path: "/private/etc/resolv.conf" },
      { platform: "darwin", scope: "global", path: "/etc/profile" },
      { platform: "darwin", scope: "global", path: "/etc/bashrc" },
      { platform: "darwin", scope: "global", path: "/etc/zshenv" },
      { platform: "darwin", scope: "global", path: "/etc/zprofile" },
      { platform: "darwin", scope: "global", path: "/etc/zshrc" },
      { platform: "darwin", scope: "global", path: "/etc/zlogin" },
      { platform: "darwin", scope: "global", path: "/etc/gitconfig" },
      { platform: "darwin", scope: "home", path: ".bashrc" },
      { platform: "darwin", scope: "home", path: ".bash_profile" },
      { platform: "darwin", scope: "home", path: ".profile" },
      { platform: "darwin", scope: "home", path: ".zshenv" },
      { platform: "darwin", scope: "home", path: ".zprofile" },
      { platform: "darwin", scope: "home", path: ".zshrc" },
      { platform: "darwin", scope: "home", path: ".zlogin" },
      { platform: "darwin", scope: "home", path: ".gitconfig" },
      { platform: "darwin", scope: "bundled", path: "ripgrep" },
      { platform: "darwin", scope: "global", path: "/dev/null" },
      { platform: "darwin", scope: "global", path: "/dev/zero" },
      { platform: "darwin", scope: "global", path: "/dev/random" },
      { platform: "darwin", scope: "global", path: "/dev/urandom" }
    ];
    HARDCODED_WRITE_PROTECTION_PATTERNS = [
      // --- Workspace-relative patterns (all use **/ to match at any depth) ---
      // .cursor config files (json, .workspace-trusted) with carve-outs
      { type: "workspace", pattern: "**/.cursor/*.json" },
      { type: "workspace", pattern: "**/.cursor/**/*.json" },
      { type: "workspace", pattern: "**/.cursor/.workspace-trusted" },
      { type: "workspace", pattern: "!**/.cursor/rules" },
      { type: "workspace", pattern: "!**/.cursor/rules/**" },
      { type: "workspace", pattern: "!**/.cursor/commands" },
      { type: "workspace", pattern: "!**/.cursor/commands/**" },
      { type: "workspace", pattern: "!**/.cursor/worktrees" },
      { type: "workspace", pattern: "!**/.cursor/worktrees/**" },
      { type: "workspace", pattern: "!**/.cursor/skills" },
      { type: "workspace", pattern: "!**/.cursor/skills/**" },
      { type: "workspace", pattern: "!**/.cursor/agents" },
      { type: "workspace", pattern: "!**/.cursor/agents/**" },
      // .claude hooks & settings (can execute shell commands)
      { type: "workspace", pattern: "**/.claude/*.json" },
      { type: "workspace", pattern: "**/.claude/**/*.json" },
      // .vscode settings
      { type: "workspace", pattern: "**/.vscode/**" },
      // JetBrains project settings (run configurations, file watchers, etc.)
      { type: "workspace", pattern: "**/.idea/**" },
      // Python virtual environments auto-discovered and executed by VS Code
      { type: "workspace", pattern: "**/.venv/" },
      { type: "workspace", pattern: "**/venv/" },
      // Workspace files
      { type: "workspace", pattern: "**/*.code-workspace" },
      { type: "workspace", pattern: "**/.cursorignore" },
      { type: "workspace", pattern: "**/.workspace-trusted" },
      // Cursor config filenames protected at any depth within .cursor/
      { type: "workspace", pattern: "**/.cursor/**/cli.json" },
      { type: "workspace", pattern: "**/.cursor/**/cli-config.json" },
      { type: "workspace", pattern: "**/.cursor/**/mcp.json" },
      { type: "workspace", pattern: "**/.cursor/**/mcp-approvals.json" },
      { type: "workspace", pattern: "**/.cursor/**/permissions.json" },
      // --- Git-directory patterns (resolved to git common dir at runtime) ---
      // git types are always resolved to gitDirParent
      // for normal workspaces, gitDirParent === workspaceDir
      // for worktrees, gitDirParent is the main repo root
      // **/ prefix covers submodule .git dirs nested under the parent repo.
      { type: "git", pattern: "**/.git/hooks/**" },
      { type: "git", pattern: "**/.git/config" },
      { type: "git", pattern: "**/.git/config.worktree" },
      { type: "git", pattern: "**/.git/info/attributes" },
      // Redirects $GIT_COMMON_DIR so git reads config/hooks from an
      // attacker-controlled tree (H1 #3725338 / fsmonitor RCE via gitdir confusion).
      { type: "git", pattern: "**/.git/commondir" },
      { type: "git", pattern: "**/.git/worktrees/*/commondir" },
      // --- Worktree patterns (applied to worktree workspace dir when .git is a pointer file) ---
      // For worktrees, the .git file is a file containing the path to the real .git directory.
      { type: "worktree", pattern: ".git" },
      // --- Absolute system paths ---
      { type: "absolute", pattern: "/etc/ssl/cert.pem" },
      { type: "absolute", pattern: "/etc/ssl/ca-bundle.pem" },
      { type: "absolute", pattern: "/private/etc/ssl/cert.pem" },
      { type: "absolute", pattern: "/etc/ssl/certs/ca-certificates.crt" },
      { type: "absolute", pattern: "/etc/pki/tls/certs/ca-bundle.crt" },
      {
        type: "absolute",
        pattern: "/etc/pki/ca-trust/extracted/pem/tls-ca-bundle.pem"
      },
      // --- Home-relative paths ---
      // Do not add ~/.ssh here. Workspace write containment already denies writes
      // outside the workspace, so the rule only bit when $HOME itself was the
      // workspace — and an agent with write access to your home directory has
      // already won.
      // Ephemeral cursorsandbox policy JSON. Must stay non-writable inside the
      // sandbox; not in CURSOR_ALLOWED_WRITE_SUBDIRS.
      { type: "home", pattern: ".cursor/sandbox-policies" }
    ];
    HARDCODED_PROTECTED_GIT_PATTERNS = HARDCODED_WRITE_PROTECTION_PATTERNS.filter((e) => e.type === "git").map((e) => e.pattern);
    CURSOR_ALLOWED_WRITE_SUBDIRS = HARDCODED_WRITE_PROTECTION_PATTERNS.filter((e) => e.type === "workspace" && e.pattern.startsWith("!") && !e.pattern.endsWith("/**")).map((e) => e.pattern.replace(/^!(\*\*\/)?/, ""));
    HARDCODED_NETWORK_DENYLIST = [
      // Placeholder - to be populated with known malicious destinations
      // Examples (not actual blocks):
      // "*.malware-domain.com",
      // "192.168.0.0/16", // Private network ranges might be blocked in certain contexts
    ];
    _workspaceIgnore = null;
    _gitIgnore = null;
    _absoluteAndHomePaths = null;
    _gitContextCache = /* @__PURE__ */ new Map();
    _caseInsensitiveFs = process.platform === "win32" || process.platform === "darwin";
  }
});

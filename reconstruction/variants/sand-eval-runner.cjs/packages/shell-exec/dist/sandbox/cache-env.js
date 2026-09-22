/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/shell-exec/dist/sandbox/cache-env.js
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
function generateSessionId() {
  return (0, import_node_crypto2.randomBytes)(16).toString("hex");
}
function getSessionId() {
  if (!cachedSessionId) {
    cachedSessionId = generateSessionId();
  }
  return cachedSessionId;
}
function getSandboxCacheEnv() {
  const cacheRoot = (0, import_node_path4.join)((0, import_node_os2.tmpdir)(), SANDBOX_CACHE_DIR, getSessionId());
  return {
    // npm
    NPM_CONFIG_CACHE: (0, import_node_path4.join)(cacheRoot, "npm"),
    // pnpm
    PNPM_STORE_PATH: (0, import_node_path4.join)(cacheRoot, "pnpm-store"),
    // Go
    GOCACHE: (0, import_node_path4.join)(cacheRoot, "go-build"),
    GOMODCACHE: (0, import_node_path4.join)(cacheRoot, "go-mod"),
    // Cargo/Rust - only redirect build artifacts, NOT CARGO_HOME/RUSTUP_HOME
    // which contain toolchain binaries (cargo, rustc, etc.)
    CARGO_TARGET_DIR: (0, import_node_path4.join)(cacheRoot, "cargo-target"),
    // pip / uv
    PIP_CACHE_DIR: (0, import_node_path4.join)(cacheRoot, "pip"),
    UV_CACHE_DIR: (0, import_node_path4.join)(cacheRoot, "uv"),
    // Bun
    BUN_INSTALL_CACHE_DIR: (0, import_node_path4.join)(cacheRoot, "bun"),
    // Yarn
    YARN_CACHE_FOLDER: (0, import_node_path4.join)(cacheRoot, "yarn"),
    // node-gyp
    npm_config_devdir: (0, import_node_path4.join)(cacheRoot, "node-gyp"),
    // Playwright
    PLAYWRIGHT_BROWSERS_PATH: (0, import_node_path4.join)(cacheRoot, "playwright"),
    // Puppeteer
    PUPPETEER_CACHE_DIR: (0, import_node_path4.join)(cacheRoot, "puppeteer"),
    // Turbo
    TURBO_CACHE_DIR: (0, import_node_path4.join)(cacheRoot, "turbo"),
    // Gradle (Java/Kotlin/Android)
    GRADLE_USER_HOME: (0, import_node_path4.join)(cacheRoot, "gradle"),
    // Conda/Mamba (Python data science)
    CONDA_PKGS_DIRS: (0, import_node_path4.join)(cacheRoot, "conda"),
    // Poetry (Python)
    POETRY_CACHE_DIR: (0, import_node_path4.join)(cacheRoot, "poetry"),
    // Ruby - only redirect spec cache, NOT GEM_HOME which contains installed gems with executables
    GEM_SPEC_CACHE: (0, import_node_path4.join)(cacheRoot, "gem-specs"),
    BUNDLE_PATH: (0, import_node_path4.join)(cacheRoot, "bundle"),
    // Composer (PHP)
    COMPOSER_HOME: (0, import_node_path4.join)(cacheRoot, "composer"),
    // Homebrew (macOS)
    HOMEBREW_CACHE: (0, import_node_path4.join)(cacheRoot, "homebrew"),
    // Cypress (E2E testing)
    CYPRESS_CACHE_FOLDER: (0, import_node_path4.join)(cacheRoot, "cypress"),
    // nx (monorepo)
    NX_CACHE_DIRECTORY: (0, import_node_path4.join)(cacheRoot, "nx"),
    // .NET/NuGet
    NUGET_PACKAGES: (0, import_node_path4.join)(cacheRoot, "nuget"),
    // ccache (C/C++ compilation)
    CCACHE_DIR: (0, import_node_path4.join)(cacheRoot, "ccache"),
    // CocoaPods (iOS)
    CP_HOME_DIR: (0, import_node_path4.join)(cacheRoot, "cocoapods")
    // NOTE: We intentionally do NOT redirect the following "HOME" variables
    // because they contain toolchain binaries, not just caches:
    // - CARGO_HOME (~/.cargo/bin/cargo, rustc, etc.)
    // - RUSTUP_HOME (~/.rustup toolchains)
    // - VOLTA_HOME (~/.volta/bin/node, npm, etc.)
    // - GEM_HOME (installed gems with executables)
    // - PIPX_HOME (virtual envs with CLI tools)
    // - DENO_DIR (compiled binaries)
  };
}
var import_node_crypto2, import_node_os2, import_node_path4, SANDBOX_CACHE_DIR, cachedSessionId;
var init_cache_env = __esm({
  "../packages/shell-exec/dist/sandbox/cache-env.js"() {
    "use strict";
    import_node_crypto2 = require("node:crypto");
    import_node_os2 = require("node:os");
    import_node_path4 = require("node:path");
    SANDBOX_CACHE_DIR = "cursor-sandbox-cache";
  }
});


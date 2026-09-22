/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/constants/dist/sand-box-archive.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var SAND_BOX_PERSIST_ARCHIVE_EXCLUDES, SAND_WORKSPACE_IGNORE_FILE_NAME, SAND_BOX_WORKSPACE_DEFAULT_IGNORE_PATTERNS;
var init_sand_box_archive = __esm({
  "../packages/constants/dist/sand-box-archive.js"() {
    "use strict";
    SAND_BOX_PERSIST_ARCHIVE_EXCLUDES = [
      "home/box/chrome-profile/**/Cache",
      "home/box/chrome-profile/**/Code Cache",
      "home/box/chrome-profile/**/GPUCache",
      "home/box/chrome-profile/**/Service Worker/CacheStorage"
    ];
    SAND_WORKSPACE_IGNORE_FILE_NAME = ".sandignore";
    SAND_BOX_WORKSPACE_DEFAULT_IGNORE_PATTERNS = [
      // Node / JS / web build output + tooling caches. node_modules is the dominant
      // file-count contributor on a JS box and is fully regenerable from a lockfile.
      "node_modules/",
      ".next/",
      ".nuxt/",
      ".svelte-kit/",
      ".turbo/",
      ".parcel-cache/",
      ".cache/",
      "dist/",
      "build/",
      "out/",
      "coverage/",
      // Python bytecode, virtualenvs, and tool caches — all rebuilt from sources /
      // requirements.
      "__pycache__/",
      "*.pyc",
      "*.pyo",
      ".venv/",
      "venv/",
      ".pytest_cache/",
      ".mypy_cache/",
      ".ruff_cache/",
      ".tox/",
      ".ipynb_checkpoints/",
      "*.egg-info/",
      ".eggs/",
      // Rust / Java / Gradle build output.
      "target/",
      ".gradle/",
      // Coredumps. Only the pid-suffixed (`core.1234`) and `*.core` forms — a bare
      // `core` is intentionally excluded from this list (see SAFETY CONTRACT above).
      "core.[0-9]*",
      "*.core",
      "/browser-cdp/",
      "/screenshots/"
    ];
  }
});


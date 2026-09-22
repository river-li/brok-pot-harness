/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/shell-exec/dist/types.js
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var KnownShellExecutor, SHELL_ENV_OVERRIDES;
var init_types4 = __esm({
  "../packages/shell-exec/dist/types.js"() {
    "use strict";
    (function(KnownShellExecutor2) {
      KnownShellExecutor2["Zsh"] = "zsh";
      KnownShellExecutor2["ZshLight"] = "zsh-light";
      KnownShellExecutor2["Bash"] = "bash";
      KnownShellExecutor2["PowerShell"] = "powershell";
      KnownShellExecutor2["Naive"] = "naive";
    })(KnownShellExecutor || (KnownShellExecutor = {}));
    SHELL_ENV_OVERRIDES = {
      TERM: "dumb",
      NO_COLOR: "1",
      FORCE_COLOR: "0",
      _ZO_DOCTOR: "0"
    };
  }
});


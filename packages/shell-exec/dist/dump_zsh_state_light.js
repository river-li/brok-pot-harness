var ZSH_STATE_LIGHT_MARKER, zshScript2, dump_zsh_state_light_default;
var init_dump_zsh_state_light = __esm({
  "../packages/shell-exec/dist/dump_zsh_state_light.js"() {
    "use strict";
    ZSH_STATE_LIGHT_MARKER = "__CURSOR_ZSH_STATE_LIGHT_VALID__";
    zshScript2 = `#!/usr/bin/env zsh

# Usage:
#   source dump_zsh_state_light.zsh
#   dump_zsh_state_light
# Or execute directly (captures a subshell's state):
#   ./dump_zsh_state_light.zsh

# Lightweight version that skips function tracking for better performance

# Define a function so sourcing won't alter caller state; emulate locally inside
function dump_zsh_state_light() {
  emulate -L zsh -o errreturn -o pipefail
  set -u


  # Helper to log timing, only if DUMP_ZSH_STATE_TIMING is set
  if [[ -n "\${DUMP_ZSH_STATE_TIMING:-}" ]]; then
    # Timing setup
    typeset start_time=\${EPOCHREALTIME}
    typeset step_start=\${EPOCHREALTIME}
    _log_timing() {
      typeset step_name="$1"
      typeset now=\${EPOCHREALTIME}
      typeset step_duration=$((now - step_start))
      typeset total_duration=$((now - start_time))
      builtin printf "[TIMING] %-20s: %6.3fs (total: %6.3fs)
" "$step_name" "$step_duration" "$total_duration" >&2
      step_start=$now
    }
  else
    _log_timing() { :; }
  fi

  # Ensure parameter arrays are available
  builtin zmodload -F zsh/parameter p:parameters p:options p:aliases p:galiases p:saliases 2>/dev/null || true
  _log_timing "zmodload"

  # Helper to print a line to stdout
  _emit() {
    builtin print -r -- "$1"
  }

  # Helper to safely encode and emit unsafe values
  _emit_encoded() {
    local content="$1"
    local var_name="$2"
    if [[ -n "$content" ]]; then
      # Use here-document to avoid argument list length limits entirely
      builtin printf 'cursor_snap_%s=$(command base64 -d <<'''CURSOR_SNAP_EOF_%s'''
' "$var_name" "$var_name"
      command base64 <<<"$content" | command tr -d '
'
      builtin printf '
CURSOR_SNAP_EOF_%s
' "$var_name"
      builtin printf ')
'
      builtin printf 'eval "$cursor_snap_%s"
' "$var_name"
    fi
  }

  _log_timing "init"

  # Emit validity marker so we can detect if dump_zsh_state_light completed
  _emit "__CURSOR_ZSH_STATE_LIGHT_VALID__"

  # Header
  _emit "$PWD"

  _emit "# zsh state dump (light) generated on $(command date +'%Y-%m-%d %H:%M:%S %z')"
  _log_timing "header"

  # Working directory
  _log_timing "working_dir"

  # Drop ELECTRON_RUN_AS_NODE by exact name so one command exporting it can't
  # bake it into the snapshot that every later command re-evals (IDE-2911:
  # Cypress boots as plain Node until a new chat). Exact unset rather than the
  # line-based grep below, which would also eat vars whose name or multiline
  # value merely contains the token. The shell exits right after the dump.
  builtin unset ELECTRON_RUN_AS_NODE 2>/dev/null || true

  # Environment variables (exported)
  # Filter out: proxy settings plus request/session-scoped vars that must not
  # leak across shell executions.
  # Under a non-UTF-8 locale zsh writes byte 0xa7 inside $'...' as M-', which
  # its own parser reads as the closing quote (zsh 5.9 Src/utils.c quotestring,
  # https://github.com/zsh-users/zsh/blob/zsh-5.9/Src/utils.c); the sed rewrites
  # that one escape to the \xA7 form so the restore eval can parse it. It runs
  # only on scalar $'...' lines: a plain-quoted value can hold the same four
  # characters literally, and there they must stay.
  local env_vars
  env_vars=$(builtin typeset -xp 2>/dev/null | command grep -viE '_proxy=|CURSOR_SANDBOX|SUDO_ASKPASS|CURSOR_ASKPASS|CURSOR_CONVERSATION_ID|CURSOR_REQUEST_ID|CURSOR_AGENT_STORE' | command sed "/^export[^=]*=[\\$]'/ s/\\\\\\\\M-'/\\\\\\\\xa7/g" || true)
  _emit_encoded "$env_vars" "ENV_VARS_B64"
  _log_timing "env_variables"

  # Options (replayable as setopt lines). Exclude the errreturn/nounset/pipefail this
  # function force-enables above, so they are not baked into the restored snapshot and
  # leaked onto every subsequent command (a stray pipefail makes a successful
  # 'cmd | head' report exit 141).
  local zsh_opts
  zsh_opts=$(setopt 2>/dev/null | command grep -vE '^(errreturn|nounset|pipefail)$' | command awk '{printf "builtin setopt %s 2>/dev/null || true\\n", $0}' || true)
  _emit_encoded "$zsh_opts" "ZSH_OPTS_B64"
  _log_timing "options"

  # SKIP FUNCTIONS - this is the key difference for performance

  # Aliases (regular, global, and suffix)
  {
    builtin alias -L 2>/dev/null || true
    builtin alias -gL 2>/dev/null || true
    builtin alias -sL 2>/dev/null || true
  }
  _log_timing "aliases"

  # Done
  _emit "# end of zsh state dump (light)"
  _log_timing "finalize"
}
`;
    dump_zsh_state_light_default = zshScript2;
  }
});

#!/usr/bin/env bash
set -euo pipefail
# Keep the pinned Box's execution/display stack; own the application lifecycle locally.
export SAND_SUPERVISOR_ENABLED=0
export SAND_DESKTOP_SUPERVISION_DISABLED=1
export SAND_BOX_SCRIPT_SYNC_DISABLED=1
export SAND_BOX_AUTO_UPDATE=0
export SAND_BOX_STORE_SYNC=0
export SAND_BOX_STORE_COPY_IN=0
export SAND_DISABLE_TELEMETRY=1
export SAND_DISABLE_ANALYTICS=1
export GROKBOT_LOCAL_MODE=1
export SAND_BACKEND_URL=http://127.0.0.1:9
mkdir -p /workspace /home/box/sand-data
# The model key belongs to inference in the host, not the tool execution process.
env -u LITELLM_API_KEY /usr/local/bin/start-sand-box > /tmp/grokbot-box.log 2>&1 &
box_pid=$!
/exec-daemon/node /home/box/sand-host/host-main.cjs &
host_pid=$!
stop() { kill -TERM "$host_pid" "$box_pid" 2>/dev/null || true; wait "$host_pid" "$box_pid" 2>/dev/null || true; }
trap stop TERM INT EXIT
wait -n "$host_pid" "$box_pid"

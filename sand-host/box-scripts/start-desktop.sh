#!/usr/bin/env bash
set -euo pipefail

export DISPLAY="${DISPLAY:-:1}"
export HOME="${HOME:-/home/box}"
export XDG_RUNTIME_DIR="${SAND_XDG_RUNTIME_DIR:-${XDG_RUNTIME_DIR:-/tmp/xdg-runtime}}"
mkdir -p "${XDG_RUNTIME_DIR}"
chmod 700 "${XDG_RUNTIME_DIR}" || true

if [ -r /usr/local/bin/sand-desktop-supervise.sh ]; then
	# shellcheck source=/dev/null
	. /usr/local/bin/sand-desktop-supervise.sh
fi
if ! command -v sand_desktop_register >/dev/null 2>&1; then
	sand_desktop_register() { :; }
fi

SAND_BOX_CGROUPS_LIB="${SAND_BOX_CGROUPS_LIB:-/usr/local/bin/box-cgroups.sh}"
if [ -r "${SAND_BOX_CGROUPS_LIB}" ]; then
	# shellcheck source=/dev/null
	. "${SAND_BOX_CGROUPS_LIB}"
fi
if ! command -v sand_cgroup_join >/dev/null 2>&1; then
	sand_cgroup_join() { :; }
fi
sand_cgroup_join "${SAND_CGROUP_INTERACTIVE_NAME:-interactive}"

SAND_DESKTOP_NUM="${DISPLAY#:}"
SAND_DESKTOP_NUM="${SAND_DESKTOP_NUM%%.*}"
SAND_DESKTOP_GROUP="d${SAND_DESKTOP_NUM:-1}"

/usr/local/bin/ensure-machine-id || true

SCREEN_WIDTH="${SCREEN_WIDTH:-1280}"
SCREEN_HEIGHT="${SCREEN_HEIGHT:-800}"

# >>> box port table (from sand/src/shared/box/box-contract.ts; regenerate: pnpm --filter sand run gen:box-ports) >>>
SAND_BOX_PORT_HOST_GATEWAY=1340
SAND_BOX_NOVNC_TOKEN_DIR="/tmp/sand-novnc-tokens.d"
VNC_PORT="${SAND_VNC_PORT:-5900}"
NOVNC_PORT="${SAND_NOVNC_PORT:-6080}"
# <<< box port table <<<
NOVNC_HEARTBEAT_S="${SAND_NOVNC_HEARTBEAT_S:-30}"

if [ -z "${DBUS_SESSION_BUS_ADDRESS:-}" ]; then
	eval "$(dbus-launch --sh-syntax)"
fi

BOX_DISPLAY_NUM="${DISPLAY#:}"
BOX_DISPLAY_NUM="${BOX_DISPLAY_NUM%%.*}"
if [ "${BOX_DISPLAY_NUM:-1}" -ge 2 ] 2>/dev/null; then
	BOX_USER_XDG_DIR="/tmp/xdg-runtime-box-${BOX_DISPLAY_NUM}"
else
	BOX_USER_XDG_DIR="/tmp/xdg-runtime-box"
fi
if [ "$(id -u)" -eq 0 ]; then
	install -d -o box -g box -m 700 "${BOX_USER_XDG_DIR}" 2>/dev/null || true
	rm -f "${BOX_USER_XDG_DIR}/dbus-session-address"
	BOX_DBUS_ADDRESS="$(runuser -u box -- env \
		XDG_RUNTIME_DIR="${BOX_USER_XDG_DIR}" DISPLAY="${DISPLAY}" HOME=/home/box \
		dbus-launch --sh-syntax 2>/dev/null \
		| sed -n "s/^DBUS_SESSION_BUS_ADDRESS='\(.*\)';/\1/p")"
	if [ -n "${BOX_DBUS_ADDRESS}" ]; then
		printf '%s' "${BOX_DBUS_ADDRESS}" >"${BOX_USER_XDG_DIR}/dbus-session-address"
		chown box:box "${BOX_USER_XDG_DIR}/dbus-session-address" 2>/dev/null || true
	fi
else
	mkdir -p "${BOX_USER_XDG_DIR}" 2>/dev/null || true
	chmod 700 "${BOX_USER_XDG_DIR}" 2>/dev/null || true
	printf '%s' "${DBUS_SESSION_BUS_ADDRESS:-}" >"${BOX_USER_XDG_DIR}/dbus-session-address" 2>/dev/null || true
fi

if [ -n "${SAND_GATEWAY_TOKEN:-}" ]; then
	mkdir -p "${BOX_USER_XDG_DIR}" 2>/dev/null || true
	printf '%s\n%s\n' "${SAND_GATEWAY_TOKEN}" "${SAND_HOST_PORT:-${SAND_BOX_PORT_HOST_GATEWAY}}" \
		>"${BOX_USER_XDG_DIR}/sand-gateway-credential" 2>/dev/null || true
	chmod 600 "${BOX_USER_XDG_DIR}/sand-gateway-credential" 2>/dev/null || true
fi

/usr/local/bin/box-bounded-log --run "/tmp/xvfb${DISPLAY}.log" -- \
	/usr/local/bin/box-xvfb "${DISPLAY}" -screen 0 "${SCREEN_WIDTH}x${SCREEN_HEIGHT}x24" -ac +extension GLX +render -noreset &
sand_desktop_register "${SAND_DESKTOP_GROUP}" xvfb 0 "/tmp/xvfb${DISPLAY}.log" "$!" -- \
	/usr/local/bin/box-bounded-log --run "/tmp/xvfb${DISPLAY}.log" -- \
	/usr/local/bin/box-xvfb "${DISPLAY}" -screen 0 "${SCREEN_WIDTH}x${SCREEN_HEIGHT}x24" -ac +extension GLX +render -noreset

DISPLAY_READY=false
for _ in $(seq 1 100); do
	if xdpyinfo -display "${DISPLAY}" >/dev/null 2>&1; then
		DISPLAY_READY=true
		break
	fi
	sleep 0.2
done

if [ "${DISPLAY_READY}" != "true" ]; then
	echo "X display did not become ready" >&2
	exit 1
fi

if [ -x /usr/local/bin/sand-wallpaper ]; then
	/usr/local/bin/sand-wallpaper paint || true
else
	hsetroot -cover /usr/share/backgrounds/cursor-box-wallpaper.jpg \
		|| hsetroot -solid "#1e2330" \
		|| xsetroot -solid "#1e2330" \
		|| true
fi

X11VNC_ARGS=(
	-display "${DISPLAY}"
	-localhost
	-nopw
	-shared
	-forever
	-noxdamage
	-rfbport "${VNC_PORT}"
	-quiet
)
/usr/local/bin/box-bounded-log --run "/tmp/x11vnc${DISPLAY}.log" -- \
	/usr/local/bin/box-x11vnc "${X11VNC_ARGS[@]}" &
sand_desktop_register "${SAND_DESKTOP_GROUP}" x11vnc 3 "/tmp/x11vnc${DISPLAY}.log" "$!" -- \
	/usr/local/bin/box-bounded-log --run "/tmp/x11vnc${DISPLAY}.log" -- \
	/usr/local/bin/box-x11vnc "${X11VNC_ARGS[@]}"

if [ -n "${SAND_NOVNC_TOKEN:-}" ]; then
	TOKEN_DIR="${SAND_NOVNC_TOKEN_DIR:-${SAND_BOX_NOVNC_TOKEN_DIR}}"
	mkdir -p "${TOKEN_DIR}"
	printf '%s: localhost:%s\n' "${SAND_NOVNC_TOKEN}" "${VNC_PORT}" \
		>"${TOKEN_DIR}/${SAND_NOVNC_TOKEN}"
else
	WEBSOCKIFY_ARGS=(
		--web=/usr/share/novnc
		--heartbeat="${NOVNC_HEARTBEAT_S}"
		"0.0.0.0:${NOVNC_PORT}"
		"localhost:${VNC_PORT}"
	)
	/usr/local/bin/box-bounded-log --run "/tmp/novnc${DISPLAY}.log" -- \
		websockify "${WEBSOCKIFY_ARGS[@]}" &
	sand_desktop_register "${SAND_DESKTOP_GROUP}" websockify 4 "/tmp/novnc${DISPLAY}.log" "$!" -- \
		/usr/local/bin/box-bounded-log --run "/tmp/novnc${DISPLAY}.log" -- \
		websockify "${WEBSOCKIFY_ARGS[@]}"
fi

/usr/local/bin/box-bounded-log --run "/tmp/xfwm4${DISPLAY}.log" -- \
	/usr/local/bin/box-xfwm4 --compositor=off &
sand_desktop_register "${SAND_DESKTOP_GROUP}" xfwm4 1 "/tmp/xfwm4${DISPLAY}.log" "$!" -- \
	/usr/local/bin/box-bounded-log --run "/tmp/xfwm4${DISPLAY}.log" -- \
	/usr/local/bin/box-xfwm4 --compositor=off

for _ in $(seq 1 50); do
	if xprop -root _NET_SUPPORTING_WM_CHECK >/dev/null 2>&1; then
		break
	fi
	sleep 0.2
done

PICOM_ARGS=(
	--backend xrender
	--no-vsync
	--no-frame-pacing
	--no-use-damage
)
/usr/local/bin/box-bounded-log --run "/tmp/picom${DISPLAY}.log" -- \
	/usr/local/bin/box-picom "${PICOM_ARGS[@]}" &
sand_desktop_register "${SAND_DESKTOP_GROUP}" picom 2 "/tmp/picom${DISPLAY}.log" "$!" -- \
	/usr/local/bin/box-bounded-log --run "/tmp/picom${DISPLAY}.log" -- \
	/usr/local/bin/box-picom "${PICOM_ARGS[@]}"

cat >/usr/local/bin/box-chrome <<'EOF'
#!/usr/bin/env bash
# >>> box-chrome port table (from sand/src/shared/box/box-contract.ts; regenerate: pnpm --filter sand run gen:box-ports) >>>
SAND_BOX_CDP_PORT_BASE=9222
SAND_BOX_PORT_HOST_GATEWAY=1340
# <<< box-chrome port table <<<
/usr/local/bin/ensure-machine-id || true

if [ -r /usr/local/bin/box-cgroups.sh ]; then
	# shellcheck source=/dev/null
	. /usr/local/bin/box-cgroups.sh
	sand_cgroup_join "${SAND_CGROUP_INTERACTIVE_NAME:-interactive}"
fi

BOX_DISPLAY_NUM="${DISPLAY#:}"
BOX_DISPLAY_NUM="${BOX_DISPLAY_NUM%%.*}"
BOX_PRIMARY_XDG="/tmp/xdg-runtime-box"
if [ "${BOX_DISPLAY_NUM:-1}" -ge 2 ] 2>/dev/null; then
	CHROME_PROFILE="${CHROME_USER_DATA_DIR:-/home/box/chrome-profile/Fork-${BOX_DISPLAY_NUM}}"
	CHROME_XDG="/tmp/xdg-runtime-box-${BOX_DISPLAY_NUM}"
	CHROME_DEBUG_PORT="${SAND_CHROME_REMOTE_DEBUG_PORT:-$((SAND_BOX_CDP_PORT_BASE + BOX_DISPLAY_NUM))}"
	if [ -z "${CHROME_USER_DATA_DIR:-}" ]; then
		LEGACY_CHROME_PROFILE="/home/box/chrome-profile-${BOX_DISPLAY_NUM}"
		if [ -d "${LEGACY_CHROME_PROFILE}" ] && [ ! -L "${LEGACY_CHROME_PROFILE}" ] && [ ! -e "${CHROME_PROFILE}" ]; then
			mkdir -p /home/box/chrome-profile
			mv "${LEGACY_CHROME_PROFILE}" "${CHROME_PROFILE}" 2>/dev/null || true
		fi
		SAND_CHROME_PROFILE_DIR="${CHROME_PROFILE}" /usr/local/bin/link-chrome-session || true
	fi
else
	CHROME_PROFILE="${CHROME_USER_DATA_DIR:-/home/box/chrome-profile}"
	CHROME_XDG="${BOX_PRIMARY_XDG}"
	CHROME_DEBUG_PORT="${SAND_CHROME_REMOTE_DEBUG_PORT:-$((SAND_BOX_CDP_PORT_BASE + 1))}"
fi
CHROME_DBUS_ADDRESS="${DBUS_SESSION_BUS_ADDRESS:-}"
if [ "$(id -u)" -eq 0 ]; then
	CHROME_DBUS_ADDRESS=""
fi
if [ -r "${CHROME_XDG}/dbus-session-address" ]; then
	CHROME_DBUS_ADDRESS="$(cat "${CHROME_XDG}/dbus-session-address" 2>/dev/null || true)"
fi
CHROME_FLAGS=(
	--no-sandbox
	--disable-dev-shm-usage
	--password-store=basic
	--no-first-run
	--no-default-browser-check
	--hide-crash-restore-bubble
	--start-maximized
	--class=box-chrome
	--user-data-dir="${CHROME_PROFILE}"
)
# WebGL on this GPU-less Xvfb box. Default --enable-unsafe-swiftshader keeps a
# software context and prints ANGLE(... SwiftShader Device (Subzero) ...).
# sand_enable_spoof_gpu writes /tmp/sand-enable-spoof-gpu (or set
# SAND_ENABLE_SPOOF_GPU=1) so we launch with --use-angle=gl instead: no WebGL
# context, and no SwiftShader renderer string. SAND_CHROME_LEGACY_GPU=1
# restores blocklist-ignore + software WebGPU. Chrome must restart to pick up
# a marker flip.
if [ "${SAND_CHROME_LEGACY_GPU:-0}" = "1" ]; then
	CHROME_FLAGS+=(
		--ignore-gpu-blocklist
		--enable-unsafe-webgpu
	)
elif [ "${SAND_ENABLE_SPOOF_GPU:-0}" = "1" ] || [ -e "${SAND_ENABLE_SPOOF_GPU_FILE:-/tmp/sand-enable-spoof-gpu}" ]; then
	CHROME_FLAGS+=(
		--use-angle=gl
	)
else
	CHROME_FLAGS+=(
		--enable-unsafe-swiftshader
	)
fi
CHROME_FLAGS+=(
	--remote-debugging-port="${CHROME_DEBUG_PORT}"
	--remote-debugging-address=127.0.0.1
)
SAND_CHROME_UA_TOKEN="GrokAgent/1.0"
SAND_CHROME_UA_OWNER_FILE="${SAND_CHROME_UA_OWNER_FILE:-/tmp/sand-ua-user}"
SAND_CHROME_UA_OWNER="$(sed -n 1p "${SAND_CHROME_UA_OWNER_FILE}" 2>/dev/null | tr -cd '0-9a-f' | cut -c1-16 || true)"
[ -z "${SAND_CHROME_UA_OWNER}" ] || SAND_CHROME_UA_TOKEN="${SAND_CHROME_UA_TOKEN} (u:${SAND_CHROME_UA_OWNER})"
SAND_CHROME_UA_DISABLED_FILE="${SAND_CHROME_UA_DISABLED_FILE:-/tmp/sand-ua-token-disabled}"
[ ! -e "${SAND_CHROME_UA_DISABLED_FILE}" ] || SAND_CHROME_UA_TOKEN=""
SAND_CHROME_UA_MAJOR="$(google-chrome-stable --version 2>/dev/null | sed -n 's/^[^0-9]*\([0-9][0-9]*\)\..*$/\1/p' || true)"
if [ -n "${SAND_CHROME_UA_MAJOR}" ] && [ -n "${SAND_CHROME_UA_TOKEN}" ]; then
	CHROME_FLAGS+=(
		--user-agent="Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${SAND_CHROME_UA_MAJOR}.0.0.0 Safari/537.36 ${SAND_CHROME_UA_TOKEN}"
	)
fi
SAND_EGRESS_PROXY_FILE=/tmp/sand-egress-proxy
if [ -r "${SAND_EGRESS_PROXY_FILE}" ]; then
	SAND_EGRESS_PROXY_ADDR="$(sed -n 1p "${SAND_EGRESS_PROXY_FILE}" 2>/dev/null || true)"
	if [ -n "${SAND_EGRESS_PROXY_ADDR}" ]; then
		CHROME_FLAGS+=(
			--proxy-server="http://${SAND_EGRESS_PROXY_ADDR}"
			--proxy-bypass-list="localhost;127.0.0.1;[::1]"
		)
	fi
fi
/usr/local/bin/box-chrome-policy || true
SAND_WEBAUTHN_ID_FILE=/usr/local/share/sand-webauthn-proxy.id
SAND_WEBAUTHN_MARKER=/home/box/.sand-webauthn-proxy-enabled
CHROME_LOG="/tmp/chrome${DISPLAY:-:1}.log"
SAND_CHROME_PREPARE=0
if [ "${1:-}" = "--sand-prepare" ]; then
	SAND_CHROME_PREPARE=1
	shift
fi
if [ "$(id -u)" -eq 0 ]; then
	mkdir -p "${CHROME_PROFILE}" "${CHROME_XDG}" /workspace
	chown box:box "${CHROME_PROFILE}" 2>/dev/null || true
	chown -R box:box "${CHROME_XDG}" 2>/dev/null || true
else
	mkdir -p "${CHROME_PROFILE}" "${CHROME_XDG}" 2>/dev/null || true
fi
chmod 700 "${CHROME_PROFILE}" "${CHROME_XDG}" 2>/dev/null || true
# Chrome watches /etc/localtime for zone changes only while TZ is unset in its environment
# (https://chromium.googlesource.com/chromium/src/+/refs/tags/151.0.7922.169/services/device/time_zone_monitor/time_zone_monitor_linux.cc),
# so the browser is launched without TZ and follows the box clock sand-box-timezone sets.
CHROME_ENV=(
	env
	-u TZ
	DISPLAY="${DISPLAY:-:1}"
	HOME=/home/box
	XDG_RUNTIME_DIR="${CHROME_XDG}"
	DBUS_SESSION_BUS_ADDRESS="${CHROME_DBUS_ADDRESS}"
)
if [ -f "${SAND_WEBAUTHN_MARKER}" ]; then
	SAND_WEBAUTHN_GATEWAY_TOKEN="${SAND_GATEWAY_TOKEN:-}"
	SAND_WEBAUTHN_GATEWAY_PORT="${SAND_HOST_PORT:-${SAND_BOX_PORT_HOST_GATEWAY}}"
	for SAND_WEBAUTHN_CRED_FILE in \
		"${CHROME_XDG}/sand-gateway-credential" \
		"${BOX_PRIMARY_XDG}/sand-gateway-credential"; do
		[ -r "${SAND_WEBAUTHN_CRED_FILE}" ] || continue
		SAND_WEBAUTHN_FILE_TOKEN="$(sed -n 1p "${SAND_WEBAUTHN_CRED_FILE}" 2>/dev/null || true)"
		if [ -n "${SAND_WEBAUTHN_FILE_TOKEN}" ]; then
			SAND_WEBAUTHN_GATEWAY_TOKEN="${SAND_WEBAUTHN_FILE_TOKEN}"
			SAND_WEBAUTHN_GATEWAY_PORT="$(sed -n 2p "${SAND_WEBAUTHN_CRED_FILE}" 2>/dev/null || true)"
			break
		fi
	done
	CHROME_ENV+=(
		SAND_GATEWAY_TOKEN="${SAND_WEBAUTHN_GATEWAY_TOKEN}"
		SAND_HOST_PORT="${SAND_WEBAUTHN_GATEWAY_PORT:-${SAND_BOX_PORT_HOST_GATEWAY}}"
	)
fi
if [ "$(id -u)" -eq 0 ]; then
	CHROME_ENV=(runuser -u box -- "${CHROME_ENV[@]}")
fi

chrome_ready() {
	curl --max-time 0.2 -fsS "http://127.0.0.1:${CHROME_DEBUG_PORT}/json/version" >/dev/null 2>&1
}

launch_chrome() {
	setsid -f /usr/local/bin/box-bounded-log --run "${CHROME_LOG}" -- \
		"${CHROME_ENV[@]}" \
		nice -n 10 google-chrome-stable "${CHROME_FLAGS[@]}" "$@" \
		</dev/null >/dev/null 2>&1 9>&-
}

wait_for_chrome() {
	local visible="$1"
	CHROME_CDP_READY_MS=""
	for _ in $(seq 1 100); do
		if chrome_ready; then
			[ -n "${CHROME_CDP_READY_MS}" ] || CHROME_CDP_READY_MS="$(date +%s%3N)"
			if [ "${visible}" -eq 0 ] || DISPLAY="${DISPLAY:-:1}" xdotool search --onlyvisible --class chrome >/dev/null 2>&1; then
				return
			fi
		fi
		sleep 0.1
	done
	return 1
}

next_launch_attempt() {
	local counter="${CHROME_PROFILE}/.sand-launch-count"
	local boot="${SAND_BOX_BOOT_ID:-${SAND_BOX_BOOT_STARTED_AT_MS:-unknown}}"
	local recorded_boot="" count=0
	read -r recorded_boot count 2>/dev/null <"${counter}" || true
	[ "${recorded_boot}" = "${boot}" ] && [ "${count}" -ge 0 ] 2>/dev/null || count=0
	count=$((count + 1))
	printf '%s %s\n' "${boot}" "${count}" 2>/dev/null >"${counter}" || true
	printf '%s' "${count}"
}

start_chrome() {
	local mode="$1" visible=1 started_ms attempt outcome duration_ms
	shift
	[ "${mode}" = window ] || visible=0
	attempt="$(next_launch_attempt)"
	started_ms="$(date +%s%3N)"
	launch_chrome "$@"
	if wait_for_chrome "${visible}"; then
		outcome=ready
	elif [ -n "${CHROME_CDP_READY_MS}" ]; then
		outcome=window_timeout
	else
		outcome=cdp_timeout
	fi
	duration_ms=$((${CHROME_CDP_READY_MS:-$(date +%s%3N)} - started_ms))
	[ "${duration_ms}" -ge 0 ] || duration_ms=0
	printf '{"kind":"chrome_launch","display":%s,"mode":"%s","attempt":%s,"outcome":"%s","durationMs":%s}\n' \
		"${BOX_DISPLAY_NUM:-1}" "${mode}" "${attempt}" "${outcome}" "${duration_ms}" \
		2>/dev/null >>"${SAND_BOX_TELEMETRY_LOG:-/tmp/sand-box-telemetry.log}" || true
	[ "${outcome}" = ready ]
}

exec 9>"${CHROME_PROFILE}/.sand-launch.lock"
flock -w 15 9 || exit 1

# A force-installed extension gets NO incognito access by default, and Chrome
# reports that by simply not proxying: an incognito window falls through to
# Chrome's own WebAuthn stack, which in a box with no USB shows a "touch your
# key" dialog that can never be satisfied. Grant it the same way the
# chrome://extensions toggle does, by seeding the profile pref. Only while this
# profile's Chrome is down — a running Chrome rewrites Preferences from memory
# on exit and would drop the edit — and re-applied on every cold launch so a
# profile that lost the grant heals itself.
if [ -f "${SAND_WEBAUTHN_MARKER}" ] && [ -r "${SAND_WEBAUTHN_ID_FILE}" ] &&
	! chrome_ready && command -v python3 >/dev/null 2>&1; then
	SAND_INCOGNITO_SEED=(python3 -)
	if [ "$(id -u)" -eq 0 ]; then
		SAND_INCOGNITO_SEED=(runuser -u box -- python3 -)
	fi
	"${SAND_INCOGNITO_SEED[@]}" "${CHROME_PROFILE}/Default/Preferences" "$(cat "${SAND_WEBAUTHN_ID_FILE}")" <<'SAND_INCOGNITO_EOF' || true
import json, os, sys

prefs, extension_id = sys.argv[1], sys.argv[2]
try:
    with open(prefs, encoding="utf-8") as handle:
        settings = json.load(handle)
except (OSError, ValueError):
    settings = {}
entry = (
    settings.setdefault("extensions", {})
    .setdefault("settings", {})
    .setdefault(extension_id, {})
)
if entry.get("incognito") is not True:
    entry["incognito"] = True
    os.makedirs(os.path.dirname(prefs), exist_ok=True)
    with open(prefs, "w", encoding="utf-8") as handle:
        json.dump(settings, handle, separators=(",", ":"))
SAND_INCOGNITO_EOF
fi

if [ "${SAND_CHROME_PREPARE}" -eq 1 ]; then
	if chrome_ready; then
		wait_for_chrome 0
	else
		start_chrome prepare --no-startup-window
	fi
	exit
fi

if chrome_ready; then
	launch_chrome "$@"
	wait_for_chrome 1
else
	start_chrome window "$@"
fi
EOF
chmod +x /usr/local/bin/box-chrome

# GTK3's org.gtk.Settings.FileChooser schema defines window-size and window-position
# as the GtkFileChooserDialog's window size and position, and the dconf writes below
# seed those keys (https://gitlab.gnome.org/GNOME/gtk/-/raw/gtk-3-24/gtk/org.gtk.Settings.FileChooser.gschema.xml).
dconf write /org/gtk/settings/file-chooser/window-size "(1100, 680)" 2>/dev/null || true
dconf write /org/gtk/settings/file-chooser/window-position "(90, 60)" 2>/dev/null || true
if [ "$(id -u)" -eq 0 ]; then
	runuser -u box -- env HOME=/home/box \
		dconf write /org/gtk/settings/file-chooser/window-size "(1100, 680)" 2>/dev/null || true
	runuser -u box -- env HOME=/home/box \
		dconf write /org/gtk/settings/file-chooser/window-position "(90, 60)" 2>/dev/null || true
fi

mkdir -p "${HOME}/.local/share/applications"
# StartupWMClass declares the WM class the launched application's window carries
# (https://specifications.freedesktop.org/desktop-entry-spec/latest/recognized-keys.html),
# so it must equal the class box-chrome passes with --class.
cat >"${HOME}/.local/share/applications/box-chrome.desktop" <<'EOF'
[Desktop Entry]
Version=1.0
Type=Application
Name=Google Chrome
Exec=/usr/local/bin/box-chrome --new-window %U
Icon=google-chrome
StartupWMClass=box-chrome
Categories=Network;WebBrowser;
MimeType=x-scheme-handler/http;x-scheme-handler/https;
EOF

mkdir -p "${HOME}/.config" 2>/dev/null || true
cat >"${HOME}/.config/mimeapps.list" <<'EOF'
[Default Applications]
x-scheme-handler/http=box-chrome.desktop
x-scheme-handler/https=box-chrome.desktop
EOF

write_dconf_setting() {
	local path="$1"
	local value="$2"
	for _ in $(seq 1 20); do
		dconf write "${path}" "${value}" >/dev/null 2>&1 || true
		if [ "$(dconf read "${path}" 2>/dev/null || true)" = "${value}" ]; then
			return 0
		fi
		sleep 0.1
	done
	echo "start-desktop: failed to persist dconf ${path}=${value}" >&2
	return 1
}

# At start Plank loads only the .dockitem files present in its launchers folder, in
# its dock-items order, then rewrites that setting from what it loaded, so a seeded
# dock-items entry whose file is missing at start is dropped (https://github.com/ricotz/plank/blob/master/lib/DockController.vala).
configure_plank_dock() {
	local dock_name="$1"
	local launchers="${HOME}/.config/plank/${dock_name}/launchers"
	local dconf_path="/net/launchpad/plank/docks/${dock_name}"
	local chrome_launcher="${HOME}/.local/share/applications/box-chrome.desktop"
	local thunar_launcher="/usr/share/applications/thunar.desktop"
	local terminal_launcher="/usr/share/applications/xfce4-terminal.desktop"
	mkdir -p "${launchers}"
	printf '[PlankDockItemPreferences]\nLauncher=file://%s\n' \
		"${chrome_launcher}" \
		>"${launchers}/chrome.dockitem"
	printf '[PlankDockItemPreferences]\nLauncher=file://%s\n' \
		"${thunar_launcher}" \
		>"${launchers}/thunar.dockitem"
	printf '[PlankDockItemPreferences]\nLauncher=file://%s\n' \
		"${terminal_launcher}" \
		>"${launchers}/xfce4-terminal.dockitem"
	write_dconf_setting "${dconf_path}/dock-items" "['chrome.dockitem', 'thunar.dockitem', 'xfce4-terminal.dockitem']" || true
	write_dconf_setting "${dconf_path}/position" "'bottom'" || true
	write_dconf_setting "${dconf_path}/theme" "'Transparent'" || true
	write_dconf_setting "${dconf_path}/icon-size" 48 || true
	write_dconf_setting "${dconf_path}/hide-mode" "'none'" || true
}

start_dock_once() {
	local pid_file="$1" log="$2"
	shift 2
	local lock_file="${pid_file}.lock"
	(
		flock -w 10 9 2>/dev/null || true
		local existing=""
		if [ -f "${pid_file}" ]; then
			existing="$(tr -dc '0-9' <"${pid_file}" 2>/dev/null || true)"
		fi
		if [ -n "${existing}" ] && kill -0 "${existing}" >/dev/null 2>&1; then
			exit 0
		fi
		# A flock(2) lock lives on the open file description and is released only when
		# every duplicate fd, a forked child's copy included, is closed
		# (https://man7.org/linux/man-pages/man2/flock.2.html), so 9>&- keeps the lock fd
		# out of the dock's process.
		setsid nohup /usr/local/bin/box-bounded-log --run "${log}" -- "$@" \
			>/dev/null 2>&1 9>&- &
		echo "$!" >"${pid_file}"
	) 9>"${lock_file}"
}

configure_plank_dock dock1

start_dock_once "/tmp/plank${DISPLAY}-dock1.pid" "/tmp/plank${DISPLAY}-dock1.log" \
	/usr/local/bin/box-plank --name dock1
sand_desktop_register "${SAND_DESKTOP_GROUP}" dock 5 "/tmp/plank${DISPLAY}-dock1.log" \
	"$(tr -dc '0-9' <"/tmp/plank${DISPLAY}-dock1.pid" 2>/dev/null || true)" \
	"/tmp/plank${DISPLAY}-dock1.pid" -- \
	/usr/local/bin/box-bounded-log --run "/tmp/plank${DISPLAY}-dock1.log" -- \
	/usr/local/bin/box-plank --name dock1

mkdir -p /workspace
cd /workspace

tail -f /dev/null

#!/bin/sh
set -eu

STAGE=$1
ROOT=$2
BIN_DIR=$3
VERSION=$4
ENTRY=$5
shift 5

trap 'rm -rf "$STAGE"' EXIT

report() {
	printf 'PLAYWRIGHT_MCP_INSTALL %s\n' "$1"
}

installed_version() {
	"$BIN_DIR/playwright-mcp" --version 2>/dev/null || true
}

for triple in "$@"; do
	file=${triple%%:*}
	rest=${triple#*:}
	expected=${rest%%:*}
	actual=$(sha512sum "$STAGE/$file" 2>/dev/null | cut -d ' ' -f 1)
	if [ "$actual" != "$expected" ]; then
		report "hash_mismatch $file"
		exit 3
	fi
done

mkdir -p "$ROOT"
exec 9>"$ROOT/.lock"
if ! flock -w 120 9; then
	report "install_failed lock_timeout"
	exit 1
fi

if [ "$(installed_version)" = "Version $VERSION" ]; then
	report present
	exit 0
fi

TREE="$ROOT/$VERSION"
if [ ! -e "$TREE/node_modules/$ENTRY" ]; then
	WORK=$(mktemp -d "$ROOT/.tmp.XXXXXX")
	for triple in "$@"; do
		file=${triple%%:*}
		dest=${triple##*:}
		mkdir -p "$WORK/node_modules/$dest"
		tar -xzf "$STAGE/$file" -C "$WORK/node_modules/$dest" --strip-components=1 --no-same-owner
	done
	chmod -R a+rX "$WORK"
	if ! mv -T "$WORK" "$TREE" 2>/dev/null; then
		rm -rf "$WORK"
	fi
fi

chmod 755 "$TREE/node_modules/$ENTRY"
LINK_TMP="$BIN_DIR/.playwright-mcp.$$"
ln -s "$TREE/node_modules/$ENTRY" "$LINK_TMP"
mv -T "$LINK_TMP" "$BIN_DIR/playwright-mcp"

if [ "$(installed_version)" != "Version $VERSION" ]; then
	rm -f "$BIN_DIR/playwright-mcp"
	report "install_failed version_check"
	exit 1
fi

report installed
exit 0

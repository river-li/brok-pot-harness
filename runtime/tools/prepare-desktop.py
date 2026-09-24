#!/usr/bin/env python3
"""Stage the retained desktop resources with platform-matched public natives."""
from pathlib import Path
import shutil
import argparse
import json
from build_profile import configuration, write_bootstrap, bootstrap_bundle
from patch_local_coordinator import patch_local_coordinator

ROOT = Path(__file__).resolve().parents[2]
source = ROOT / 'vendor/desktop'
parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--profile', choices=['local', 'original'], default=configuration()['profile'])
parser.add_argument('--output', type=Path)
args = parser.parse_args()
config = configuration(args.profile)
target = args.output or ROOT / ('.runtime/desktop' if args.profile == 'local' else '.runtime/desktop-original')
if not (source / 'package.json').exists():
    raise SystemExit('Desktop resources missing. Run runtime/tools/import-desktop.py first.')
shutil.copytree(source, target, dirs_exist_ok=True)
if args.profile == 'local':
    patch_local_coordinator(target / 'dist/node-agent-coordinator/main.cjs')
shutil.copytree(ROOT / 'runtime/desktop-src', target / 'dist/electron-main', dirs_exist_ok=True)
shutil.copytree(ROOT / 'runtime/renderer-src', target / 'dist/renderer', dirs_exist_ok=True)
if args.profile == 'local':
    for name in ['remote-client-main.cjs', 'remote-client-connection.cjs', 'remote-client-secure-storage.cjs', 'remote-client-preload.cjs', 'remote-client.html', 'remote-client-ui.js']:
        shutil.copy2(ROOT / 'runtime' / name, target / name)
local = ROOT / 'dist/local'
if not local.exists():
    raise SystemExit('Compiled local adapters missing. Run npm run build first.')
shutil.copytree(local, target / 'dist/electron-main/local', dirs_exist_ok=True)
(target / 'dist/electron-main/local/package.json').write_text('{"type":"commonjs"}\n')
main = target / 'dist/electron-main'
write_bootstrap(main, config)
entrypoint = main / 'main.cjs'
shutil.copytree(ROOT / 'assets/branding', main / 'branding', dirs_exist_ok=True)
entrypoint.write_bytes(bootstrap_bundle(entrypoint.read_bytes()).replace(
    b'require("./build-profile.cjs");',
    b'require("./build-profile.cjs");\nrequire("./branding.cjs");', 1))
renderer = target / 'dist/renderer'
(renderer / 'build-profile.js').write_text(
    'globalThis.__GROKBOT_BUILD_FEATURES__ = Object.freeze(' + json.dumps(config['features']) + ');\n')
html = renderer / 'index.html'
html_source = html.read_text()
marker = '<script type="module"'
if html_source.count(marker) != 1:
    raise ValueError('Expected one desktop renderer module entrypoint')
html.write_text(html_source.replace(marker, '<script src="./build-profile.js"></script>\n    ' + marker, 1))
for name in ['tree-sitter', 'tree-sitter-bash', 'node-addon-api', 'node-gyp-build', 'web-tree-sitter']:
    installed = ROOT / 'runtime/node_modules' / name
    if not installed.exists():
        raise SystemExit(f'Missing desktop dependency {name}; run npm install --prefix runtime')
    destination = target / 'dist/deps' / name
    if destination.exists():
        shutil.rmtree(destination)
    shutil.copytree(installed, destination)
print(f'Desktop resources staged in {target} (profile: {config["profile"]})')

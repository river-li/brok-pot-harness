#!/usr/bin/env python3
"""Package the staged local or independent remote desktop with project branding."""
import argparse
import json
import plistlib
import shutil
import subprocess
import sys
from pathlib import Path
ROOT = Path(__file__).resolve().parents[2]

ELECTRON_PATH_MARKER = 'GBH_ELECTRON_PATH='


def resolve_electron_executable(root=ROOT):
    """Resolve Electron even when its npm module prints first-run download progress."""
    resolver = (
        "const electronPath = require('./runtime/node_modules/electron'); "
        f"process.stdout.write('{ELECTRON_PATH_MARKER}' + JSON.stringify(electronPath) + '\\n');"
    )
    result = subprocess.run(
        ['node', '-e', resolver], cwd=root, text=True, capture_output=True, check=True
    )
    paths = [
        json.loads(line[len(ELECTRON_PATH_MARKER):])
        for line in result.stdout.splitlines()
        if line.startswith(ELECTRON_PATH_MARKER)
    ]
    if len(paths) != 1 or not isinstance(paths[0], str):
        raise RuntimeError('Electron did not report one executable path while packaging.')
    electron = Path(paths[0])
    if not electron.is_file():
        raise RuntimeError('Electron executable is missing after its package install completed.')
    return electron


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--remote', action='store_true', help='package the independent URL/token connection client')
    args = parser.parse_args()
    if sys.platform != 'darwin':
        raise SystemExit('This packager currently supports macOS only.')
    staged = ROOT / '.runtime/desktop'
    config = json.loads((staged / 'dist/electron-main/build-profile.json').read_text())
    if config['profile'] != 'local':
        raise SystemExit('Prepare the local desktop first.')
    electron = resolve_electron_executable()
    source = electron.parents[2]
    remote = args.remote
    output_name = 'Grokbot Remote Client.app' if remote else 'Grokbot Harness.app'
    output = ROOT / '.runtime/packages' / output_name
    if output.exists():
        shutil.rmtree(output)
    output.parent.mkdir(parents=True, exist_ok=True)
    subprocess.run(['ditto', str(source), str(output)], check=True)
    resources = output / 'Contents/Resources'
    app = resources / 'app'
    shutil.copytree(staged, app, ignore=shutil.ignore_patterns('AGENTS.md', 'README.md', 'import-manifest.json'))
    (resources / 'default_app.asar').unlink(missing_ok=True)
    shutil.copy2(ROOT / 'assets/branding/AppIcon.icns', resources / 'AppIcon.icns')
    metadata = output / 'Contents/Info.plist'
    with metadata.open('rb') as f:
        info = plistlib.load(f)
    product_name = 'Grokbot Remote Client' if remote else 'Grokbot Harness'
    bundle_id = 'local.gbh.remoteclient' if remote else 'local.gbh.desktop'
    info.update(CFBundleName=product_name, CFBundleDisplayName=product_name,
                CFBundleIdentifier=bundle_id, CFBundleIconFile='AppIcon.icns')
    with metadata.open('wb') as f:
        plistlib.dump(info, f)
    package = json.loads((app/'package.json').read_text())
    package['main'] = 'remote-client-main.cjs' if remote else 'packaged-main.cjs'
    package['productName'] = product_name
    (app/'package.json').write_text(json.dumps(package, indent=2)+'\n')
    if remote:
        (app/'local-launch.json').unlink(missing_ok=True)
    else:
        (app/'local-launch.json').write_text(json.dumps({'projectRoot':str(ROOT)}, indent=2)+'\n')
        shutil.copy2(ROOT/'runtime/packaged-main.cjs', app/'packaged-main.cjs')
    subprocess.run(['codesign','--force','--deep','--sign','-',str(output)], check=True, capture_output=True)
    if remote:
        print(f'Packaged independent remote desktop, ad-hoc signed: {output}')
        print('The client starts with a server URL and Gateway token. Host and Box run separately on the server.')
    else:
        print(f'Packaged local desktop, ad-hoc signed: {output}')
        print('Host runs separately. Configure GROKBOT_PROJECT_ROOT when using another checkout.')


if __name__ == '__main__':
    main()

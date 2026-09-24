#!/usr/bin/env python3
"""Package the staged local or independent remote desktop with project branding."""
import argparse
import hashlib
import json
import os
import plistlib
import platform
import re
import shutil
import subprocess
import sys
from pathlib import Path
ROOT = Path(__file__).resolve().parents[2]

ELECTRON_PATH_MARKER = 'GBH_ELECTRON_PATH='
LOCAL_RUNTIME_PATHS = (
    'runtime/server.cjs', 'runtime/compose.yaml', 'runtime/box-entrypoint.sh',
    'runtime/search/settings.yml', 'runtime/speech',
    'runtime/tests/provider-smoke.cjs', '.runtime/build/sand-host', '.runtime/build/deps',
)


def copy_local_runtime(root, target):
    """Bundle only the local server inputs; reject links and any missing build input."""
    target.mkdir(parents=True, exist_ok=True)
    inventory = []
    for relative in LOCAL_RUNTIME_PATHS:
        source = root / relative
        if not source.exists() or source.is_symlink():
            raise RuntimeError(f'Missing or linked local runtime input: {relative}')
        files = sorted(source.rglob('*')) if source.is_dir() else [source]
        for file in files:
            if file.is_symlink():
                raise RuntimeError(f'Linked local runtime input: {file.relative_to(root)}')
            if not file.is_file():
                continue
            name = file.relative_to(root).as_posix()
            destination = target / name
            destination.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(file, destination)
            inventory.append({
                'path': name, 'sha256': hashlib.sha256(destination.read_bytes()).hexdigest(),
                'mode': 0o755 if os.access(file, os.X_OK) else 0o644,
            })
    profile = json.loads((target / '.runtime/build/sand-host/build-profile.json').read_text())
    if profile.get('profile') != 'local':
        raise RuntimeError('Unified app requires a local Host build.')
    digest = hashlib.sha256(''.join(
        f"{entry['path']}:{entry['sha256']}:{entry['mode']}\n" for entry in inventory
    ).encode()).hexdigest()
    (target / 'manifest.json').write_text(json.dumps({
        'schemaVersion': 1, 'digest': digest, 'files': inventory,
    }, indent=2) + '\n')
    return digest


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


def source_revision(root=ROOT):
    source_sha = subprocess.run(
        ['git', 'rev-parse', '--verify', 'HEAD^{commit}'], cwd=root,
        text=True, capture_output=True, check=True,
    ).stdout.strip()
    changes = subprocess.run(
        ['git', 'status', '--porcelain=v1', '--untracked-files=all'], cwd=root,
        text=True, capture_output=True, check=True,
    ).stdout.strip()
    return source_sha, not bool(changes)


def write_release_resources(resources, version, source_sha, clean, architecture,
                            electron_version, electron_dist, root=ROOT, product='Grokbot Remote Client'):
    notices = root / 'release/RESOURCE-NOTICES.md'
    release_notes = root / 'release/RELEASE-NOTES.md'
    electron_license = electron_dist / 'LICENSE'
    chromium_license = electron_dist / 'LICENSES.chromium.html'
    for file in (notices, release_notes, electron_license, chromium_license):
        if not file.is_file():
            raise RuntimeError(f'Missing required release notice: {file.name}')
    shutil.copy2(notices, resources / 'GBH-Resource-Notices.md')
    shutil.copy2(release_notes, resources / 'GBH-Release-Notes.md')
    shutil.copy2(electron_license, resources / 'Electron-LICENSE')
    shutil.copy2(chromium_license, resources / 'Chromium-LICENSES.html')

    retained = json.loads((root / 'vendor/desktop/import-manifest.json').read_text())
    desktop_provenance = {
        'source': 'retained desktop bundle imported for local recovery',
        'version': retained['version'],
        'sha256': retained['sha256'],
        'files': retained['files'],
    }
    (resources / 'GBH-Retained-Desktop-Provenance.json').write_text(
        json.dumps(desktop_provenance, indent=2) + '\n'
    )
    manifest = {
        'schemaVersion': 1,
        'product': product,
        'releaseVersion': version,
        'compatibilityId': 'gbh-remote-v1',
        'sourceCommit': source_sha,
        'sourceTreeClean': clean,
        'buildProfile': 'local',
        'upstreamBaseline': 'bfe1879',
        'retainedDesktopVersion': retained['version'],
        'retainedDesktopSha256': retained['sha256'],
        'electronVersion': electron_version,
        'nodeVersion': subprocess.run(
            [shutil.which('node') or 'node', '--version'],
            text=True, capture_output=True, check=True,
        ).stdout.strip().removeprefix('v'),
        'buildEnvironment': {
            'system': platform.system(),
            'release': platform.release(),
            'machine': platform.machine(),
        },
        'clientPlatform': f'macos/{architecture}',
        'architecture': architecture,
        'sourceAvailableAtRuntime': False,
    }
    (resources / 'GBH-Release-Manifest.json').write_text(json.dumps(manifest, indent=2) + '\n')
    return manifest


def set_candidate_bundle_version(info, version):
    # Apple requires three numeric components in the marketing version. Keep
    # the preview suffix in GBH-Release-Manifest.json and use its sequence as
    # the numeric bundle build identifier.
    match = re.fullmatch(r'(\d+\.\d+\.\d+)-preview\.(\d+)', version)
    if not match:
        raise ValueError(f'Unsupported preview bundle version: {version}')
    info['CFBundleShortVersionString'] = match.group(1)
    info['CFBundleVersion'] = match.group(2)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--remote', action='store_true', help='package the independent URL/token connection client')
    parser.add_argument('--unified', action='store_true', help='package a portable Brokpot app with local Docker and remote server choices')
    parser.add_argument('--release-candidate', action='store_true', help='enforce the supported preview client build matrix and include candidate provenance')
    args = parser.parse_args()
    if args.remote and args.unified:
        raise SystemExit('--remote and --unified are mutually exclusive.')
    if sys.platform != 'darwin':
        raise SystemExit('This packager currently supports macOS only.')
    if args.release_candidate and not args.remote:
        raise SystemExit('--release-candidate requires --remote.')
    staged = ROOT / '.runtime/desktop'
    config = json.loads((staged / 'dist/electron-main/build-profile.json').read_text())
    if config['profile'] != 'local':
        raise SystemExit('Prepare the local desktop first.')
    electron = resolve_electron_executable()
    source = electron.parents[2]
    remote = args.remote
    release_candidate = args.release_candidate
    architecture = platform.machine().lower()
    if release_candidate and architecture != 'arm64':
        raise SystemExit('The preview Remote Client candidate currently supports macOS arm64 only.')
    node_version = subprocess.run(
        [shutil.which('node') or 'node', '--version'],
        text=True, capture_output=True, check=True,
    ).stdout.strip()
    if release_candidate and node_version != 'v24.14.0':
        raise SystemExit(f'Remote Client candidate requires Node.js v24.14.0; found {node_version}.')
    electron_package = json.loads((ROOT / 'runtime/node_modules/electron/package.json').read_text())
    expected_electron = '42.11.6'
    if release_candidate and electron_package.get('version') != expected_electron:
        raise SystemExit(f'Remote Client candidate requires Electron {expected_electron}.')
    output_name = 'Brokpot.app' if args.unified else ('Grokbot Remote Client.app' if remote else 'Grokbot Harness.app')
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
    product_name = 'Brokpot' if args.unified else ('Grokbot Remote Client' if remote else 'Grokbot Harness')
    bundle_id = 'app.brokpot.desktop' if args.unified else ('local.gbh.remoteclient' if remote else 'local.gbh.desktop')
    info.update(CFBundleName=product_name, CFBundleDisplayName=product_name,
                CFBundleIdentifier=bundle_id, CFBundleIconFile='AppIcon.icns')
    if release_candidate:
        project = json.loads((ROOT / 'release/project.json').read_text())
        set_candidate_bundle_version(info, project['projectVersion'])
    with metadata.open('wb') as f:
        plistlib.dump(info, f)
    package = json.loads((app/'package.json').read_text())
    package['main'] = 'unified-main.cjs' if args.unified else ('remote-client-main.cjs' if remote else 'packaged-main.cjs')
    package['productName'] = product_name
    (app/'package.json').write_text(json.dumps(package, indent=2)+'\n')
    if args.unified:
        for name in ['unified-main.cjs', 'unified-desktop-main.cjs', 'unified-local.cjs', 'unified-preload.cjs',
                     'unified-welcome.html', 'unified-welcome-ui.js']:
            shutil.copy2(ROOT / 'runtime' / name, app / name)
        digest = copy_local_runtime(ROOT, app / 'local-server')
        (app / 'local-launch.json').unlink(missing_ok=True)
        project = json.loads((ROOT / 'release/project.json').read_text())
        source_sha, clean = source_revision()
        write_release_resources(resources, project['projectVersion'], source_sha, clean,
                                architecture, electron_package['version'], electron.parents[3],
                                ROOT, product='Brokpot')
    elif remote:
        if release_candidate:
            project = json.loads((ROOT / 'release/project.json').read_text())
            source_sha, clean = source_revision()
            resources.mkdir(parents=True, exist_ok=True)
            write_release_resources(resources, project['projectVersion'], source_sha, clean,
                                    architecture, electron_package['version'], electron.parents[3], ROOT)
        (app/'local-launch.json').unlink(missing_ok=True)
    else:
        (app/'local-launch.json').write_text(json.dumps({'projectRoot':str(ROOT)}, indent=2)+'\n')
        shutil.copy2(ROOT/'runtime/packaged-main.cjs', app/'packaged-main.cjs')
    subprocess.run(['codesign','--force','--deep','--sign','-',str(output)], check=True, capture_output=True)
    if release_candidate:
        architecture_report = subprocess.run(
            ['lipo', '-archs', str(output / 'Contents/MacOS/Electron')],
            text=True, capture_output=True, check=True,
        ).stdout.strip().split()
        if architecture_report != ['arm64']:
            raise RuntimeError(f'Expected an arm64-only Electron app; lipo reported {architecture_report}')
    if args.unified:
        print(f'Packaged portable Brokpot desktop, ad-hoc signed: {output}')
        print(f'Bundled local runtime inventory: {digest}')
    elif remote:
        print(f'Packaged independent remote desktop, ad-hoc signed: {output}')
        print('The client starts with a server URL and Gateway token. Host and Box run separately on the server.')
    else:
        print(f'Packaged local desktop, ad-hoc signed: {output}')
        print('Host runs separately. Configure GROKBOT_PROJECT_ROOT when using another checkout.')


if __name__ == '__main__':
    main()

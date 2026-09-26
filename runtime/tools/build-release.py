#!/usr/bin/env python3
"""Build matching portable macOS desktop and linux/amd64 server artifacts."""
import hashlib
import json
import platform
import subprocess
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
PROJECT = json.loads((ROOT / 'release/project.json').read_text())


def run(*command, cwd=ROOT):
    subprocess.run(command, cwd=cwd, check=True)


def output(*command, cwd=ROOT):
    return subprocess.run(command, cwd=cwd, text=True, check=True, capture_output=True).stdout.strip()


def checksum(file):
    digest = hashlib.sha256()
    with file.open('rb') as source:
        for chunk in iter(lambda: source.read(1024 * 1024), b''):
            digest.update(chunk)
    return digest.hexdigest()


def main():
    if platform.system() != 'Darwin':
        raise SystemExit('Unified release assembly currently requires a macOS builder with Docker Desktop.')
    if output('node', '--version') != 'v' + PROJECT['nodeVersion']:
        raise SystemExit(f"Release assembly requires Node.js v{PROJECT['nodeVersion']}.")
    if output('git', 'status', '--porcelain=v1', '--untracked-files=all'):
        raise SystemExit('Commit or remove source changes before assembling a release.')
    sha = output('git', 'rev-parse', 'HEAD')
    version = PROJECT['projectVersion']
    release_root = ROOT / '.runtime/release' / version
    release_root.mkdir(parents=True, exist_ok=True)

    # The Linux archive must be built from exactly the same committed tree as
    # the Mac app. The temporary bundle contains no working data or credentials.
    with tempfile.TemporaryDirectory(prefix='brokpot-release-') as temporary:
        temp = Path(temporary)
        bundle = temp / 'source.bundle'
        run('git', 'bundle', 'create', str(bundle), 'HEAD')
        container_command = (
            'git clone --quiet /input/source.bundle /source && '
            'cd /source && npm ci --ignore-scripts && '
            'python3 runtime/tools/package-release.py --source-sha ' + sha + ' --output /output'
        )
        run('docker', 'run', '--rm', '--platform', 'linux/amd64',
            '--mount', f'type=bind,source={temp},target=/input,readonly',
            '--mount', f'type=bind,source={release_root},target=/output',
            'node:24.14.0-bookworm', 'sh', '-ec', container_command)

    run('npm', 'ci')
    run('npm', 'ci', '--prefix', 'runtime')
    run('npm', 'run', 'package:mac:unified')
    app = ROOT / '.runtime/packages/Brokpot.app'
    archive = release_root / f'Brokpot-v{version}-macos-{platform.machine().lower()}.zip'
    archive.unlink(missing_ok=True)
    run('ditto', '-c', '-k', '--sequesterRsrc', '--keepParent', str(app), str(archive))
    server = release_root / f'gbh-server-v{version}-linux-amd64.tar.gz'
    if not server.is_file():
        raise RuntimeError('The Linux server archive was not created.')
    manifest = {
        'schemaVersion': 1, 'sourceCommit': sha, 'releaseVersion': version,
        'artifacts': [{ 'name': item.name, 'sha256': checksum(item) } for item in (server, archive)],
        'macSigning': 'ad-hoc', 'serverPlatform': 'linux/amd64',
        'macPlatform': f'macos/{platform.machine().lower()}',
    }
    (release_root / 'release-build.json').write_text(json.dumps(manifest, indent=2) + '\n')
    for item in (server, archive):
        (release_root / f'{item.name}.sha256').write_text(f'{checksum(item)}  {item.name}\n')
    print(f'Release artifacts: {release_root}')
    print('Artifacts are locally signed only; publication requires the release workflow.')


if __name__ == '__main__':
    main()

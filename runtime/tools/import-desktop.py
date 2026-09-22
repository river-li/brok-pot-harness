#!/usr/bin/env python3
"""Extract the locally installed desktop release without changing the app."""
import argparse
import hashlib
import json
from pathlib import Path, PurePosixPath
import shutil
import struct

ROOT = Path(__file__).resolve().parents[2]


def unpack(app: Path, output: Path):
    archive = app / 'Contents/Resources/app.asar'
    external = archive.with_name('app.asar.unpacked')
    if output.exists():
        raise SystemExit(f'Output already exists: {output}')
    output.mkdir(parents=True)
    entries = []
    with archive.open('rb') as handle:
        _, header_size, _, json_size = struct.unpack('<4I', handle.read(16))
        if not 0 < json_size < header_size < archive.stat().st_size:
            raise ValueError('Invalid ASAR header')
        index = json.loads(handle.read(json_size))
        base = 8 + header_size

        def walk(tree, prefix=PurePosixPath()):
            for name, item in tree.items():
                relative = prefix / name
                if relative.is_absolute() or '..' in relative.parts:
                    raise ValueError(f'Unsafe archive path: {relative}')
                if 'files' in item:
                    walk(item['files'], relative)
                    continue
                if 'link' in item:
                    raise ValueError(f'Unexpected ASAR link: {relative}')
                path = output / relative
                path.parent.mkdir(parents=True, exist_ok=True)
                if item.get('unpacked'):
                    data = (external / relative).read_bytes()
                else:
                    handle.seek(base + int(item['offset']))
                    data = handle.read(item['size'])
                    if len(data) != item['size']:
                        raise ValueError(f'Truncated entry: {relative}')
                path.write_bytes(data)
                if item.get('executable') or (external / relative).exists() and (external / relative).stat().st_mode & 0o111:
                    path.chmod(0o755)
                entries.append({'path': str(relative), 'sha256': hashlib.sha256(data).hexdigest(), 'bytes': len(data)})

        walk(index['files'])
    manifest = {'source': str(archive), 'sha256': hashlib.sha256(archive.read_bytes()).hexdigest(),
                'version': json.loads((output / 'package.json').read_text())['version'], 'files': entries}
    (output / 'import-manifest.json').write_text(json.dumps(manifest, indent=2) + '\n')
    print(f'Imported desktop {manifest["version"]}: {len(entries)} files into {output}')


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--app', type=Path, default=Path('/Applications/Grok Bot.app'))
    parser.add_argument('--output', type=Path, default=ROOT / 'vendor/desktop')
    args = parser.parse_args()
    unpack(args.app, args.output)

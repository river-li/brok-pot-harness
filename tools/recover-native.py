#!/usr/bin/env python3
"""Export a clean native-layout snapshot without overwriting maintained sources."""
import argparse
import importlib.util
import json
import hashlib
from pathlib import Path
import shutil
import tempfile

ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location('recovery', ROOT / 'tools/recover-bundles.py')
recovery = importlib.util.module_from_spec(spec)
spec.loader.exec_module(recovery)

def native_path(path):
    if path.startswith('variants/'):
        return 'reconstruction/' + path
    return path[5:] if path.startswith('sand/') else path

def export(output):
    if output.exists():
        raise ValueError(f'Output already exists; choose a new --output: {output}')
    with tempfile.TemporaryDirectory() as scratch:
        temporary = Path(scratch)
        manifest = recovery.recover(ROOT / 'sand-host', temporary)
        for file in manifest['files']:
            for occurrence in file['occurrences']:
                source = temporary / 'recovered' / occurrence['output']
                occurrence['output'] = native_path(occurrence['output'])
                destination = output / occurrence['output']
                destination.parent.mkdir(parents=True, exist_ok=True)
                shutil.copy2(source, destination)
                if not occurrence.get('decodedResource'):
                    destination.write_text(destination.read_text().replace(' * See recovery-manifest.json for exact byte ranges.', ' * See reconstruction-manifest.json for exact byte ranges.', 1))
        for bundle in manifest['bundles']:
            if 'output' not in bundle:
                continue
            source = temporary / 'recovered' / bundle['output']
            bundle['output'] = 'reconstruction/' + bundle['output']
            destination = output / bundle['output']
            destination.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(source, destination)
        manifest['bundleRoot'] = 'sand-host'
        manifest['outputHashes'] = {str(p.relative_to(output)): hashlib.sha256(p.read_bytes()).hexdigest() for p in sorted(output.rglob('*')) if p.is_file()}
        (output / 'reconstruction-manifest.json').write_text(json.dumps(manifest, indent=2) + '\n')
    print(f'Clean baseline exported to {output}; maintained sources were not changed.')

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--output', type=Path, default=ROOT / '.runtime/recovered-clean')
    export(parser.parse_args().output)

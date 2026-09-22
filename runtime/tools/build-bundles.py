#!/usr/bin/env python3
"""Rebuild runnable release bundles from editable recovered module fragments.

Retains original bundle ordering, dependency code and helper scope. No guessed
imports or type declarations are introduced. Untouched input round-trips exactly.
"""
import argparse
import hashlib
import importlib.util
import json
from pathlib import Path
import re
import shutil
import sys

sys.path.insert(0, str(Path(__file__).resolve().parent))
from build_profile import configuration, write_bootstrap, bootstrap_bundle

ROOT = Path(__file__).resolve().parents[2]
PROJECT = ROOT
spec = importlib.util.spec_from_file_location('recovery', PROJECT / 'tools/recover-bundles.py')
recovery = importlib.util.module_from_spec(spec)
spec.loader.exec_module(recovery)
MARKER = re.compile(rb'^// @recovered-fragment (\d+)/(\d+)\n', re.M)


def build(output: Path, project: Path = PROJECT, profile=None):
    config = configuration(profile) if profile is not None else None
    manifest = json.loads((project / 'reconstruction-manifest.json').read_text())
    original = project / 'sand-host'
    replacements = {}
    for file in manifest['files']:
        for occurrence in file['occurrences']:
            source_path = project / occurrence['output']
            contents = source_path.read_bytes()
            fragments = occurrence['fragments']
            if occurrence.get('decodedResource'):
                if len(fragments) != 1:
                    raise ValueError('Unexpected multi-fragment resource')
                fragment = fragments[0]
                source = (original / occurrence['bundle']).read_bytes()[fragment['startByte']:fragment['endByte']]
                decoded, assignment_end = recovery.decode_literal(source, with_end=True)
                if decoded.encode() == contents:
                    parts = [source]
                else:
                    prefix = re.match(rb'(\s*var \w+\s*=\s*)', source)[1]
                    parts = [prefix + json.dumps(contents.decode(), ensure_ascii=True).encode() + b';' + source[assignment_end:]]
            else:
                markers = list(MARKER.finditer(contents))
                if len(markers) != len(fragments) or any(
                    (int(m[1]), int(m[2])) != (i + 1, len(fragments)) for i, m in enumerate(markers)
                ):
                    raise ValueError(f'Missing/reordered fragment markers: {occurrence["output"]}')
                parts = [contents[m.end():markers[i + 1].start() if i + 1 < len(markers) else len(contents)]
                         for i, m in enumerate(markers)]
            for fragment, body in zip(fragments, parts):
                replacements.setdefault(occurrence['bundle'], []).append((fragment['startByte'], fragment['endByte'], body))
    target = output / 'sand-host'
    # Keep scripts, worker locations, package.json and bundled runtime deps.
    shutil.copytree(original, target, dirs_exist_ok=True)
    if (project / 'vendor/host-modules').exists():
        shutil.copytree(project / 'vendor/host-modules', target / 'node_modules', dirs_exist_ok=True)
    shutil.copytree(project / 'vendor/deps', output / 'deps', dirs_exist_ok=True)
    if config is not None:
        write_bootstrap(target, config)
    local = project / 'dist/local'
    if local.exists():
        shutil.copytree(local, target / 'local', dirs_exist_ok=True)
        # Pure-JS dependencies of the local WebFetch adapter. Copy them into
        # the output so the Linux host never resolves packages from this Mac.
        if (local / 'web-fetch.js').exists():
            for package in ('turndown', 'turndown-plugin-gfm', '@mixmark-io/domino', 'ws'):
                dependency = project / 'node_modules' / package
                if not dependency.is_dir():
                    raise FileNotFoundError(f'Missing {package}; run npm ci before building')
                shutil.copytree(dependency, target / 'local/node_modules' / package, dirs_exist_ok=True)
    outputs = []
    for bundle in manifest['bundles']:
        source = (original / bundle['path']).read_bytes()
        if hashlib.sha256(source).hexdigest() != bundle['sha256']:
            raise ValueError(f'Original release changed; regenerate recovery first: {bundle["path"]}')
        if 'output' in bundle:
            result = (project / bundle['output']).read_bytes()
        else:
            chunks, end = [], 0
            for start, stop, body in sorted(replacements.get(bundle['path'], [])):
                if start < end:
                    raise ValueError('Overlapping source ranges')
                chunks.extend([source[end:start], body])
                end = stop
            chunks.append(source[end:])
            result = b''.join(chunks)
        if config is not None and bundle['path'] == 'host-main.cjs':
            result = bootstrap_bundle(result)
        (target / bundle['path']).write_bytes(result)
        outputs.append({'path': bundle['path'], 'sha256': hashlib.sha256(result).hexdigest(),
                        'identicalToRelease': result == source})
    (output / 'build-manifest.json').write_text(json.dumps({**({'configuration': config} if config else {}), 'bundles': outputs}, indent=2) + '\n')
    print(f'Built {len(outputs)} bundles/scripts; {sum(b["identicalToRelease"] for b in outputs)} byte-identical to release')


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--profile', choices=['local', 'original'], default=configuration()['profile'])
    parser.add_argument('--output', type=Path)
    args = parser.parse_args()
    build(args.output or ROOT / ('.runtime/build' if args.profile == 'local' else '.runtime/build-original'), profile=args.profile)

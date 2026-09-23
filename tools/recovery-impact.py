#!/usr/bin/env python3
"""Navigate recovered fragments and review their read-only change impact."""
from __future__ import annotations

import argparse
from collections import defaultdict
import hashlib
import json
import os
from pathlib import Path, PurePosixPath
import re
import subprocess
import sys

ROOT = Path(__file__).resolve().parents[1]
MANIFEST_NAME = 'reconstruction-manifest.json'
MARKER = re.compile(rb'^// @recovered-fragment (\d+)/(\d+)\n', re.M)
IDENTIFIER = re.compile(r'^[A-Za-z_$][\w$]*$')
IMPORT_FROM = re.compile(r'''^\s*import\s+(?!\()(?:.+?\s+from\s+)?(['"])[^'"\r\n]+\1\s*;?\s*$''')
IMPORT_EXPORT_FROM = re.compile(r'''^\s*export\s+(?:\*|\{)[^;\r\n]*?\s+from\s+(['"])[^'"\r\n]+\1''')
RECOVERED_ROOTS = ('src/', 'dune/', 'packages/', 'reconstruction/')


def digest(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def clean_path(value: str) -> str:
    """Normalize a user/manifest path without resolving outside the checkout."""
    return PurePosixPath(value.replace('\\', '/')).as_posix().removeprefix('./')


def source_aliases(value: str, root: Path) -> set[str]:
    raw = value.replace('\\', '/')
    if Path(value).is_absolute():
        try:
            raw = Path(value).resolve().relative_to(root.resolve()).as_posix()
        except ValueError:
            return set()
    if raw.startswith('raw-text:'):
        for anchor in ('/packages/', '/sand/', '/dune/'):
            if anchor in raw:
                raw = raw[raw.index(anchor) + 1:]
                break
        else:
            return set()
    aliases = {clean_path(raw)}
    if raw.startswith('../packages/') or raw.startswith('../dune/'):
        aliases.add(clean_path(raw[3:]))
    if raw.startswith('src/'):
        aliases.add(clean_path('sand/' + raw))
    if raw.startswith('sand/src/'):
        aliases.add(clean_path(raw[5:]))
    if raw.startswith('sand-host/'):
        aliases.add(clean_path(raw[len('sand-host/'):]))
    return aliases


def output_aliases(value: str, root: Path) -> set[str]:
    aliases = source_aliases(value, root)
    for alias in list(aliases):
        if alias.startswith('sand/src/'):
            aliases.add(alias[5:])
        elif alias.startswith('src/'):
            aliases.add('sand/' + alias)
    return aliases


class RecoveryIndex:
    def __init__(self, root: Path):
        self.root = root.resolve()
        self.manifest_path = self.root / MANIFEST_NAME
        self.manifest = json.loads(self.manifest_path.read_text())
        self.files = self.manifest['files']
        self.bundles = {clean_path(item['path']): item for item in self.manifest['bundles']}
        self.aliases: dict[str, list[dict]] = defaultdict(list)
        self.files_by_output: dict[str, list[dict]] = defaultdict(list)
        self.spans_by_bundle: dict[str, list[dict]] = defaultdict(list)
        for file_record in self.files:
            seen = set()
            for occurrence in file_record['occurrences']:
                occurrence_key = (occurrence['output'], occurrence['bundle'])
                if occurrence_key in seen:
                    continue
                seen.add(occurrence_key)
                entry = {'file': file_record, 'occurrence': occurrence}
                self.files_by_output[clean_path(occurrence['output'])].append(entry)
                aliases = output_aliases(file_record['path'], self.root)
                aliases.update(output_aliases(occurrence['output'], self.root))
                for fragment in occurrence['fragments']:
                    aliases.update(source_aliases(fragment['source'], self.root))
                for alias in aliases:
                    self.aliases[alias].append(entry)
                for number, fragment in enumerate(occurrence['fragments'], 1):
                    self.spans_by_bundle[clean_path(occurrence['bundle'])].append({
                        **entry, 'fragment': fragment,
                        'fragment_index': number,
                        'fragment_count': len(occurrence['fragments']),
                    })
        for spans in self.spans_by_bundle.values():
            spans.sort(key=lambda item: (item['fragment']['startByte'], item['fragment']['endByte']))
        for bundle in self.manifest['bundles']:
            if 'output' not in bundle:
                continue
            file_record = {'path': bundle['output'], 'variantCount': 1}
            occurrence = {'bundle': bundle['path'], 'output': bundle['output'],
                          'fragments': [], 'standalone': True}
            entry = {'file': file_record, 'occurrence': occurrence}
            output = clean_path(bundle['output'])
            self.files_by_output[output].append(entry)
            aliases = output_aliases(bundle['output'], self.root)
            aliases.update(source_aliases(bundle['path'], self.root))
            for alias in aliases:
                self.aliases[alias].append(entry)

    def resolve_source(self, value: str) -> list[dict]:
        matches = []
        seen = set()
        for alias in source_aliases(value, self.root):
            for entry in self.aliases.get(alias, []):
                key = (entry['file']['path'], entry['occurrence']['output'], entry['occurrence']['bundle'])
                if key not in seen:
                    seen.add(key)
                    matches.append(entry)
        return sorted(matches, key=lambda item: (item['file']['path'], item['occurrence']['bundle']))

    def bundle_key(self, value: str) -> str:
        aliases = source_aliases(value, self.root)
        for alias in aliases:
            if alias in self.bundles:
                return alias
        return clean_path(value).removeprefix('sand-host/')


def validate_occurrence(root: Path, file_record: dict, occurrence: dict) -> list[str]:
    errors = []
    output = clean_path(occurrence['output'])
    source_path = root / output
    label = f'{output} ({occurrence["bundle"]})'
    if not source_path.is_file():
        return [f'{label}: maintained fragment file is missing']
    if occurrence.get('standalone'):
        return []
    contents = source_path.read_bytes()
    fragments = occurrence['fragments']
    if occurrence.get('decodedResource'):
        if len(fragments) != 1:
            errors.append(f'{label}: decoded resource must map to exactly one artifact range')
    else:
        markers = list(MARKER.finditer(contents))
        if len(markers) != len(fragments):
            errors.append(f'{label}: found {len(markers)} fragment markers; manifest requires {len(fragments)}')
        for index, marker in enumerate(markers, 1):
            expected = (index, len(fragments))
            actual = (int(marker.group(1)), int(marker.group(2)))
            if actual != expected:
                line = contents.count(b'\n', 0, marker.start()) + 1
                errors.append(f'{label}:{line}: marker is {actual[0]}/{actual[1]}; expected {expected[0]}/{expected[1]} (missing, reordered, or renumbered fragment)')
    prior_end = -1
    bundle_path = root / 'sand-host' / clean_path(occurrence['bundle'])
    bundle_size = bundle_path.stat().st_size if bundle_path.is_file() else None
    for index, fragment in enumerate(fragments, 1):
        start, end = fragment.get('startByte'), fragment.get('endByte')
        # The manifest's byte and line coordinates refer to the immutable release bundle.
        if not isinstance(start, int) or not isinstance(end, int) or start < 0 or end <= start:
            errors.append(f'{label}: manifest fragment {index} has an invalid byte range')
        else:
            if start < prior_end:
                errors.append(f'{label}: manifest fragment ranges are out of order or overlap at fragment {index}')
            if bundle_size is not None and end > bundle_size:
                errors.append(f'{label}: manifest fragment {index} ends past the immutable bundle size ({bundle_size} bytes)')
            prior_end = end
        if fragment.get('startLine', 0) < 1 or fragment.get('endLine', 0) < fragment.get('startLine', 0):
            errors.append(f'{label}: manifest fragment {index} has an invalid source line range')
    return errors


def advisory_imports(root: Path, entries: list[dict]) -> list[tuple[str, int, str]]:
    """Find likely static imports; this lexical heuristic is advisory only."""
    findings = []
    seen = set()
    for entry in entries:
        occurrence = entry['occurrence']
        if occurrence.get('decodedResource') or occurrence.get('standalone'):
            continue
        output = clean_path(occurrence['output'])
        if output in seen:
            continue
        seen.add(output)
        path = root / output
        if not path.is_file():
            continue
        try:
            lines = path.read_text(encoding='utf-8').splitlines()
        except (UnicodeDecodeError, OSError):
            continue
        for number, line in enumerate(lines, 1):
            stripped = line.lstrip()
            if stripped.startswith(('//', '/*', '*')):
                continue
            if IMPORT_FROM.match(line) or IMPORT_EXPORT_FROM.match(line):
                findings.append((output, number, line.strip()[:180]))
    return findings


def format_fragment(entry: dict, fragment: dict, index: int, count: int) -> str:
    file_record, occurrence = entry['file'], entry['occurrence']
    return (f"{file_record['path']} → {occurrence['output']} | {occurrence['bundle']} "
            f"fragment {index}/{count}, bytes [{fragment['startByte']}, {fragment['endByte']}), "
            f"lines {fragment['startLine']}-{fragment['endLine']}")


def source_map_lines(entries: list[dict]) -> list[str]:
    lines = []
    for entry in entries:
        occurrence = entry['occurrence']
        file_record = entry['file']
        if occurrence.get('standalone'):
            lines.append(f"Maintained standalone: {occurrence['output']} → sand-host/{occurrence['bundle']} "
                         f"({file_record['variantCount']} variant(s), no recovered fragment markers)")
            continue
        lines.append(f"Maintained: {occurrence['output']} (logical source {file_record['path']}; {file_record['variantCount']} variant(s))")
        if occurrence.get('decodedResource'):
            lines.append(f"  {occurrence['bundle']}: decoded resource, artifact bytes " +
                         ', '.join(f"[{f['startByte']}, {f['endByte']})" for f in occurrence['fragments']))
        else:
            for i, fragment in enumerate(occurrence['fragments'], 1):
                lines.append('  ' + format_fragment(entry, fragment, i, len(occurrence['fragments'])))
    return lines


def map_command(index: RecoveryIndex, args) -> int:
    if args.source:
        entries = index.resolve_source(args.source)
        if not entries:
            print(f'No reconstruction-manifest entry matches source path: {args.source}', file=sys.stderr)
            return 2
        print(f'Source path: {args.source}')
        print('\n'.join(source_map_lines(entries)))
        return 0
    if args.symbol:
        if not IDENTIFIER.fullmatch(args.symbol):
            print('Symbol lookup accepts one JavaScript identifier at a time.', file=sys.stderr)
            return 2
        pattern = re.compile(rf'(?<![\w$]){re.escape(args.symbol)}(?![\w$])')
        found = []
        for output, entries in sorted(index.files_by_output.items()):
            path = index.root / output
            if not path.is_file():
                continue
            try:
                lines = path.read_text(encoding='utf-8').splitlines()
            except (UnicodeDecodeError, OSError):
                continue
            matching_lines = [number for number, line in enumerate(lines, 1) if pattern.search(line)]
            if matching_lines:
                for entry in entries:
                    found.append((entry, matching_lines))
        if not found:
            print(f'Symbol not found in maintained recovered sources: {args.symbol}', file=sys.stderr)
            return 1
        print(f'Symbol: {args.symbol} (lexical text match; comments and strings can match)')
        for entry, matching_lines in found:
            output = entry['occurrence']['output']
            print(f"Maintained: {output} (matching source lines {', '.join(map(str, matching_lines[:12]))}" +
                  (f", +{len(matching_lines) - 12} more" if len(matching_lines) > 12 else '') + ')')
            print('\n'.join('  ' + line for line in source_map_lines([entry])))
        return 0
    artifact = index.bundle_key(args.artifact)
    if artifact not in index.bundles:
        print(f'Unknown reconstruction artifact: {args.artifact}', file=sys.stderr)
        return 2
    bundle = index.bundles[artifact]
    if args.offset < 0 or args.offset >= bundle['bytes']:
        print(f'Offset must be in [0, {bundle["bytes"]}) for {artifact}.', file=sys.stderr)
        return 2
    spans = index.spans_by_bundle.get(artifact, [])
    matches = [span for span in spans if span['fragment']['startByte'] <= args.offset < span['fragment']['endByte']]
    print(f'Artifact: sand-host/{artifact}, baseline byte offset {args.offset}')
    if not matches:
        if 'output' in bundle:
            print(f"Maintained standalone/resource output: {bundle['output']} → sand-host/{artifact}")
            return 0
        print('Offset is outside a mapped first-party fragment (bundle scaffold, vendor code, or an unmapped resource).')
        return 0
    for match in matches:
        print('  ' + format_fragment(match, match['fragment'], match['fragment_index'], match['fragment_count']))
    return 0


def git_paths(root: Path, base: str | None = None) -> tuple[list[str], str | None]:
    if base is None:
        base = 'HEAD'
    try:
        resolved = subprocess.run(['git', '-C', str(root), 'rev-parse', '--verify', '--end-of-options', f'{base}^{{tree}}'],
                                  check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        tree = os.fsdecode(resolved.stdout).strip()
    except (OSError, subprocess.CalledProcessError) as error:
        detail = error.stderr.decode(errors='replace').strip() if isinstance(error, subprocess.CalledProcessError) else str(error)
        return [], detail or f'base is not a valid Git tree-ish: {base}'
    try:
        result = subprocess.run(['git', '-C', str(root), 'diff', '--name-only', '-z', '--no-ext-diff', '--no-renames', tree, '--'],
                                check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        tracked = [os.fsdecode(path) for path in result.stdout.split(b'\0') if path]
    except (OSError, subprocess.CalledProcessError) as error:
        detail = error.stderr.decode(errors='replace').strip() if isinstance(error, subprocess.CalledProcessError) else str(error)
        return [], detail or 'git diff is unavailable'
    try:
        result = subprocess.run(['git', '-C', str(root), 'ls-files', '--others', '--exclude-standard', '-z'],
                                check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        untracked = [os.fsdecode(path) for path in result.stdout.split(b'\0') if path]
    except (OSError, subprocess.CalledProcessError):
        untracked = []
    return sorted(set(tracked + untracked)), None


def changed_paths_for_impact(root: Path, base: str) -> tuple[list[str], str | None]:
    return git_paths(root, base)


def is_under(path: str, root_name: str) -> bool:
    normalized = clean_path(path)
    return normalized == root_name or normalized.startswith(root_name + '/')


def nearest_neighbors(index: RecoveryIndex, changed_entries: list[dict], changed_keys: set[tuple[str, str]]) -> dict[str, list[dict]]:
    output: dict[str, list[dict]] = defaultdict(list)
    for entry in changed_entries:
        bundle = clean_path(entry['occurrence']['bundle'])
        spans = index.spans_by_bundle.get(bundle, [])
        for position, span in enumerate(spans):
            if (span['file']['path'], span['occurrence']['output']) != (entry['file']['path'], entry['occurrence']['output']):
                continue
            for neighbor_position in (position - 1, position + 1):
                if 0 <= neighbor_position < len(spans):
                    neighbor = spans[neighbor_position]
                    key = (neighbor['file']['path'], neighbor['occurrence']['output'])
                    if key in changed_keys or neighbor['file']['path'] == entry['file']['path']:
                        continue
                    neighbor_key = (bundle, key[0], key[1])
                    if not any((item['bundle'], item['file']['path'], item['occurrence']['output']) == neighbor_key
                               for item in output[bundle]):
                        output[bundle].append({'bundle': bundle, 'file': neighbor['file'],
                                               'occurrence': neighbor['occurrence'],
                                               'fragment': neighbor['fragment'],
                                               'fragment_index': neighbor['fragment_index'],
                                               'fragment_count': neighbor['fragment_count']})
    return output


def verification_for(changed: list[str], mapped: list[dict]) -> list[str]:
    checks = []
    if mapped:
        checks.extend(['npm run build -- --profile local', 'npm run test:recovery', 'npm run test:runtime-build'])
    paths = [clean_path(path) for path in changed]
    if any(path.startswith('packages/grok-bot-harness/') for path in paths):
        checks.append('docker compose -f runtime/compose.yaml exec app node /opt/grokbot/tests/agent-sandbox.cjs (fixture model; requires a ready isolated gbh-local app)')
    if any(path.startswith('src/host/') for path in paths):
        if any(path.endswith(('host-gateway-api.ts', 'gateway-server.ts', 'gateway-protocol.ts')) for path in paths):
            checks.append('SAND_GATEWAY_TOKEN="$(cat .runtime/gateway-token)" node runtime/tests/gateway.cjs (isolated disposable Host data; leaves a test Agent record)')
        else:
            checks.append('Select the Host runtime contract that covers the changed extension or startup behavior; test:runtime-build checks reconstruction/profile wiring only.')
    if any(path.startswith('packages/grok-bot-harness/src/local/') for path in paths):
        checks.append('npm run check:local')
    if any(path.startswith(('tools/', 'reconstruction/')) for path in paths):
        checks.append('npm run test:recovery')
    if any(path.startswith(('docs/',)) or path.endswith('.md') for path in paths):
        checks.append('npm run docs:check')
    return list(dict.fromkeys(checks))


def impact_command(index: RecoveryIndex, args) -> int:
    root = index.root
    changed, error = changed_paths_for_impact(root, args.base)
    if error:
        print(f'Cannot read diff from {root}: {error}', file=sys.stderr)
        return 2
    print(f'Change impact against {args.base} (tracked diff plus untracked, non-ignored files)')
    build_errors = verify_runtime_build(root)
    if not changed:
        print('No changed paths.')
        if build_errors:
            print('\nGuardrail errors')
            for message in build_errors:
                print('  ERROR ' + message)
            return 1
        if (root / '.runtime' / 'build').exists():
            print('Generated .runtime/build integrity: valid.')
        return 0
    print(f'Changed paths: {len(changed)}')
    mapped: list[dict] = []
    changed_keys = set()
    unmapped = []
    guardrail_errors = []
    source_validation_errors = []
    for path in changed:
        if is_under(path, 'sand-host'):
            guardrail_errors.append(f'{path}: sand-host is the immutable release baseline')
        if is_under(path, '.runtime/build'):
            guardrail_errors.append(f'{path}: .runtime/build is generated output; rebuild from maintained source')
        entries = index.resolve_source(path)
        if not entries:
            unmapped.append(path)
            continue
        for entry in entries:
            key = (entry['file']['path'], entry['occurrence']['output'], entry['occurrence']['bundle'])
            if key in changed_keys:
                continue
            changed_keys.add(key)
            mapped.append(entry)
            source_validation_errors.extend(validate_occurrence(root, entry['file'], entry['occurrence']))
    print('\nReconstructed source impact')
    if not mapped:
        print('  No changed path maps to a maintained reconstructed source file.')
    else:
        artifact_sources: dict[str, set[str]] = defaultdict(set)
        for entry in mapped:
            occurrence = entry['occurrence']
            artifact_sources[clean_path(occurrence['bundle'])].add(occurrence['output'])
            print(f"  {entry['file']['path']} -> {occurrence['output']} ({occurrence['bundle']})")
        print('\nRebuilt artifacts by profile')
        for artifact in sorted(artifact_sources):
            print(f'  sand-host/{artifact}')
            print(f'    local (localWorkspace=true): .runtime/build/sand-host/{artifact}')
            print(f'    original (localWorkspace=false): .runtime/build-original/sand-host/{artifact}')
        print('\nAffected artifact ranges (immutable baseline coordinates)')
        for entry in mapped:
            occurrence = entry['occurrence']
            if occurrence.get('standalone'):
                print(f"  {occurrence['output']} -> sand-host/{occurrence['bundle']} (standalone artifact; no fragment ranges)")
                continue
            for number, fragment in enumerate(occurrence['fragments'], 1):
                print('  ' + format_fragment(entry, fragment, number, len(occurrence['fragments'])))
        neighbors = nearest_neighbors(index, mapped, {(entry['file']['path'], entry['occurrence']['output']) for entry in mapped})
        if neighbors:
            print('\nNearby maintained modules (same bundle order; context, not inferred dependencies)')
            for artifact, entries in sorted(neighbors.items()):
                print(f'  {artifact}:')
                for entry in entries[:12]:
                    print('    ' + format_fragment(entry, entry['fragment'], entry['fragment_index'], entry['fragment_count']))
        sibling_paths = set()
        for entry in mapped:
            directory = str(PurePosixPath(entry['file']['path']).parent)
            for file_record in index.files:
                if file_record['path'] != entry['file']['path'] and str(PurePosixPath(file_record['path']).parent) == directory:
                    sibling_paths.add(file_record['path'])
        if sibling_paths:
            print('\nSame-directory maintained modules to inspect for neighboring interfaces')
            for path in sorted(sibling_paths)[:16]:
                print('  ' + path)
        profiles = json.loads((root / 'runtime/build-profiles.json').read_text())['profiles']
        print('\nProfile conditions from runtime/build-profiles.json')
        for name, config in profiles.items():
            print(f'  {name}: {json.dumps(config, sort_keys=True)}; output root .runtime/build' +
                  ('-original' if name == 'original' else ''))
    if source_validation_errors:
        print('\nFragment mapping errors')
        for message in source_validation_errors:
            print('  ERROR ' + message)
    if unmapped:
        print('\nUnmapped changed paths (not represented in reconstruction-manifest.json)')
        for path in unmapped:
            print('  ' + path)
    checks = verification_for(changed, mapped)
    if checks:
        print('\nRecommended verification')
        for check in checks:
            print('  ' + check)
    imports = advisory_imports(root, mapped)
    if imports:
        print('\nPossible standalone imports (advisory heuristic; inspect manually, never blocks)')
        for output, line, code in imports[:20]:
            print(f'  {output}:{line}: {code}')
        if len(imports) > 20:
            print(f'  ... {len(imports) - 20} more candidate(s)')
        print('  Detection is lexical and can match comments, strings, or retained syntax.')
    guardrail_errors.extend(build_errors)
    if guardrail_errors:
        print('\nGuardrail errors')
        for message in guardrail_errors:
            print('  ERROR ' + message)
    return 1 if guardrail_errors or source_validation_errors else 0


def protected_git_paths(root: Path) -> tuple[list[str], str | None]:
    changed, error = git_paths(root, 'HEAD')
    if error:
        return [], error
    return [path for path in changed if is_under(path, 'sand-host') or is_under(path, '.runtime/build')], None


def compare_tree(source: Path, target: Path, label: str, *, ignore_node_modules: bool = False) -> list[str]:
    errors = []
    if not source.is_dir():
        if target.exists():
            errors.append(f'{label} exists but its build source {source} is missing')
        return errors
    if not target.is_dir():
        return [f'{label} is missing']
    source_files = {}
    for path in source.rglob('*'):
        if not path.is_file():
            continue
        relative = path.relative_to(source).as_posix()
        if ignore_node_modules and relative.startswith('node_modules/'):
            continue
        source_files[relative] = path
    target_files = {}
    for path in target.rglob('*'):
        if not path.is_file():
            continue
        relative = path.relative_to(target).as_posix()
        if ignore_node_modules and relative.startswith('node_modules/'):
            continue
        target_files[relative] = path
    for relative in sorted(set(source_files) - set(target_files)):
        errors.append(f'{label}/{relative} is missing')
    for relative in sorted(set(target_files) - set(source_files)):
        errors.append(f'{label}/{relative} is not present in its build source')
    for relative in sorted(set(source_files) & set(target_files)):
        if digest(source_files[relative].read_bytes()) != digest(target_files[relative].read_bytes()):
            errors.append(f'{label}/{relative} differs from its build source')
    return errors


def verify_runtime_build(root: Path) -> list[str]:
    errors = []
    output = root / '.runtime' / 'build'
    if not output.exists():
        return errors
    manifest_path = output / 'build-manifest.json'
    if not manifest_path.is_file():
        return ['.runtime/build exists without build-manifest.json; its generated artifacts cannot be verified']
    allowed_outputs = {'sand-host', 'deps', 'build-manifest.json'}
    for child in output.iterdir():
        if child.name not in allowed_outputs:
            errors.append(f'.runtime/build/{child.name} is not a declared build output')
    try:
        build_manifest = json.loads(manifest_path.read_text())
    except (OSError, json.JSONDecodeError) as error:
        return [f'.runtime/build/build-manifest.json cannot be read: {error}']
    declared = {}
    generated_profile_files = {'build-profile.json', 'build-profile.cjs'}
    configuration = build_manifest.get('configuration')
    if not isinstance(configuration, dict):
        errors.append('.runtime/build/build-manifest.json does not record the selected build profile')
    else:
        expected_json = (json.dumps(configuration, indent=2) + '\n').encode()
        literal = json.dumps(configuration, separators=(',', ':'))
        expected_cjs = (
            '// Generated from runtime/build-profiles.json. Rebuild to change mode.\n'
            f'const config = {literal};\n'
            'Object.freeze(config.features);\nObject.freeze(config);\n'
            'process.env.GROKBOT_LOCAL_MODE = config.features.localWorkspace ? "1" : "0";\n'
            'module.exports = config;\n'
        ).encode()
        for name, expected_bytes in (('build-profile.json', expected_json), ('build-profile.cjs', expected_cjs)):
            path = output / 'sand-host' / name
            if not path.is_file():
                errors.append(f'.runtime/build/sand-host/{name} is missing')
            elif path.read_bytes() != expected_bytes:
                errors.append(f'.runtime/build/sand-host/{name} differs from build-manifest.json configuration')
    for bundle in build_manifest.get('bundles', []):
        relative = clean_path(bundle['path'])
        declared[relative] = bundle['sha256']
        path = output / 'sand-host' / relative
        if not path.is_file():
            errors.append(f'.runtime/build/sand-host/{relative} is missing (listed in build-manifest.json)')
        elif digest(path.read_bytes()) != bundle['sha256']:
            errors.append(f'.runtime/build/sand-host/{relative} differs from build-manifest.json')
    expected = {clean_path(bundle['path']) for bundle in json.loads((root / MANIFEST_NAME).read_text())['bundles']}
    for path in sorted(expected - set(declared)):
        errors.append(f'.runtime/build/build-manifest.json does not declare reconstructed artifact {path}')
    built_root = output / 'sand-host'
    baseline_root = root / 'sand-host'
    if built_root.is_dir():
        for path in sorted(baseline_root.rglob('*')):
            if not path.is_file():
                continue
            relative = path.relative_to(baseline_root).as_posix()
            if relative.startswith(('node_modules/', 'local/')) or relative in declared or relative in generated_profile_files:
                continue
            target = built_root / relative
            if not target.is_file():
                errors.append(f'.runtime/build/sand-host/{relative} is missing from the copied release tree')
            elif digest(target.read_bytes()) != digest(path.read_bytes()):
                errors.append(f'.runtime/build/sand-host/{relative} differs from the immutable release baseline')
        baseline_files = {path.relative_to(baseline_root).as_posix() for path in baseline_root.rglob('*') if path.is_file()}
        for path in sorted(built_root.rglob('*')):
            if not path.is_file():
                continue
            relative = path.relative_to(built_root).as_posix()
            if relative.startswith('node_modules/') or relative in baseline_files or relative in generated_profile_files:
                continue
            if relative.startswith('local/'):
                if relative.startswith('local/node_modules/'):
                    continue
                # Checked against dist/local below.
                continue
            errors.append(f'.runtime/build/sand-host/{relative} is not present in the release tree')
    errors.extend(compare_tree(root / 'dist/local', built_root / 'local', '.runtime/build/sand-host/local', ignore_node_modules=True))
    errors.extend(compare_tree(root / 'vendor/host-modules', built_root / 'node_modules', '.runtime/build/sand-host/node_modules'))
    errors.extend(compare_tree(root / 'vendor/deps', output / 'deps', '.runtime/build/deps'))
    for package in ('turndown', 'turndown-plugin-gfm', '@mixmark-io/domino', 'ws'):
        source = root / 'node_modules' / package
        target = built_root / 'local/node_modules' / package
        errors.extend(compare_tree(source, target, f'.runtime/build/sand-host/local/node_modules/{package}'))
    return errors


def check_command(index: RecoveryIndex, args) -> int:
    selected: list[dict]
    if args.source:
        selected = []
        for source in args.source:
            entries = index.resolve_source(source)
            if not entries:
                print(f'No reconstruction-manifest entry matches source path: {source}', file=sys.stderr)
                return 2
            selected.extend(entries)
        selected = list({(entry['file']['path'], entry['occurrence']['output'], entry['occurrence']['bundle']): entry
                         for entry in selected}.values())
    else:
        selected = [entry for entries in index.files_by_output.values() for entry in entries]
    errors = []
    for entry in selected:
        errors.extend(validate_occurrence(index.root, entry['file'], entry['occurrence']))
    # Byte hashes in reconstruction-manifest are immutable source-range anchors.
    # They are checked here independently of whether maintained fragments changed.
    if not args.source:
        for bundle in index.manifest['bundles']:
            path = index.root / 'sand-host' / bundle['path']
            if not path.is_file():
                errors.append(f'sand-host/{bundle["path"]} is missing')
            elif digest(path.read_bytes()) != bundle['sha256']:
                errors.append(f'sand-host/{bundle["path"]} differs from the manifest byte baseline')
        errors.extend(verify_runtime_build(index.root))
    protected, git_error = protected_git_paths(index.root)
    if git_error is None:
        for path in protected:
            errors.append(f'{path}: protected release/generated output changed in the worktree')
    else:
        print(f'Git worktree drift check unavailable: {git_error}')
    print(f'Validated {len(selected)} manifest-backed output occurrence(s).')
    if args.source:
        print('Source-only check: release bundle byte hashes and full .runtime/build integrity were not checked.')
    if git_error is None:
        current_recovery_changes, _ = git_paths(index.root, 'HEAD')
        recovery_changes = [path for path in current_recovery_changes if path.startswith(RECOVERED_ROOTS)]
        if recovery_changes:
            print(f'Recovery source drift: {len(recovery_changes)} changed or untracked path(s) relative to HEAD.')
            for path in recovery_changes[:30]:
                print('  ' + path)
            if len(recovery_changes) > 30:
                print(f'  ... {len(recovery_changes) - 30} more')
        else:
            print('Recovery source drift: none (maintained source paths match the Git worktree baseline).')
    imports = advisory_imports(index.root, selected)
    if imports:
        print(f'Possible standalone imports: {len(imports)} candidate(s) (advisory only; no failure).')
        for output, line, code in imports[:20]:
            print(f'  {output}:{line}: {code}')
        print('This lexical heuristic can match comments, strings, or retained syntax; review candidates manually.')
    if errors:
        print('Recovery integrity errors:')
        for error in errors:
            print('  ERROR ' + error)
        return 1
    print('Recovery integrity: no marker/order or protected artifact errors.')
    return 0


def make_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description=__doc__)
    subparsers = parser.add_subparsers(dest='command', required=True)
    map_parser = subparsers.add_parser('map', help='map a baseline artifact offset, symbol, or source path')
    map_parser.add_argument('--root', type=Path, default=ROOT, help=argparse.SUPPRESS)
    query = map_parser.add_mutually_exclusive_group(required=True)
    query.add_argument('--source', help='maintained or manifest source path')
    query.add_argument('--symbol', help='one JavaScript identifier to search lexically')
    query.add_argument('--artifact', help='baseline bundle path, such as host-main.cjs')
    map_parser.add_argument('--offset', type=int, help='UTF-8 byte offset in immutable sand-host bundle (zero-based)')
    impact_parser = subparsers.add_parser('impact', help='report reconstruction impact for the current diff')
    impact_parser.add_argument('--root', type=Path, default=ROOT, help=argparse.SUPPRESS)
    impact_parser.add_argument('--base', default='HEAD', help='git tree-ish to diff against (default: HEAD)')
    check_parser = subparsers.add_parser('check', help='check markers, baseline hashes, and protected outputs')
    check_parser.add_argument('--root', type=Path, default=ROOT, help=argparse.SUPPRESS)
    check_parser.add_argument('--source', action='append', help='limit marker validation to this maintained source path; may repeat')
    return parser


def main() -> int:
    parser = make_parser()
    args = parser.parse_args()
    if args.command == 'map' and args.artifact and args.offset is None:
        parser.error('map --artifact requires --offset')
    if args.command == 'map' and args.offset is not None and not args.artifact:
        parser.error('map --offset requires --artifact')
    try:
        index = RecoveryIndex(args.root)
    except (OSError, json.JSONDecodeError, KeyError) as error:
        print(f'Cannot load reconstruction manifest under {args.root}: {error}', file=sys.stderr)
        return 2
    if args.command == 'map':
        return map_command(index, args)
    if args.command == 'impact':
        return impact_command(index, args)
    return check_command(index, args)


if __name__ == '__main__':
    raise SystemExit(main())

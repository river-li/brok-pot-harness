#!/usr/bin/env python3
"""Recover inspectable module trees without executing release code.

The existing src/ reconstruction is deliberately left untouched. Output is
owned by this script only under recovered/ and recovery-manifest.json.
"""
from __future__ import annotations

import argparse
import bisect
import hashlib
import json
from pathlib import Path, PurePosixPath
import re

# Include raw-text and non-code resources as boundaries, even when not selected.
HEADER = re.compile(rb'^// ((?:\.\./|src/|raw-text:)[^\r\n]+\.[a-zA-Z0-9]+)[ \t]*\r?$', re.M)
EXTENSIONS = {'.js', '.mjs', '.cjs'}


def digest(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def source_destination(source: str) -> str | None:
    if source.startswith('raw-text:'):
        for anchor in ('/packages/', '/sand/', '/dune/'):
            if anchor in source:
                source = source[source.index(anchor) + 1:]
                break
        else:
            return None
    elif source.startswith('../packages/') or source.startswith('../dune/'):
        source = source[3:]
    elif source.startswith('src/'):
        source = 'sand/' + source
    else:
        return None
    path = PurePosixPath(source)
    if path.is_absolute() or '..' in path.parts or 'node_modules' in path.parts:
        raise ValueError(f'Unsafe first-party source path: {source}')
    return path.as_posix()


def split_bundle(data: bytes) -> list[dict]:
    markers = list(HEADER.finditer(data))
    newlines = [m.start() for m in re.finditer(b'\n', data)]
    result = []
    for i, marker in enumerate(markers):
        start = marker.end()
        if data[start:start + 1] == b'\n':
            start += 1
        end = markers[i + 1].start() if i + 1 < len(markers) else len(data)
        result.append(dict(source=marker[1].decode(), startByte=start, endByte=end,
                           startLine=bisect.bisect_left(newlines, start) + 1,
                           endLine=bisect.bisect_left(newlines, max(start, end - 1)) + 1,
                           body=data[start:end]))
    return result


def decode_literal(body: bytes, *, with_end: bool = False):
    """Decode an esbuild raw-text string without evaluating JavaScript."""
    text = body.decode()
    match = re.match(r"\s*var \w+\s*=\s*([`\"'])", text)
    if not match:
        raise ValueError('Expected raw-text variable initialized to a literal')
    quote = match[1]
    i = match.end()
    result = []
    escapes = {'n': '\n', 'r': '\r', 't': '\t', 'b': '\b', 'f': '\f', 'v': '\v', '0': '\0'}
    while i < len(text):
        ch = text[i]
        i += 1
        if ch == quote:
            ending = re.match(r'\s*;', text[i:])
            if not ending:
                raise ValueError('Expected end of literal assignment')
            value = ''.join(result)
            return (value, len(text[:i + ending.end()].encode())) if with_end else value
        if quote == '`' and ch == '$' and text[i:i + 1] == '{':
            raise ValueError('Interpolated resource is not a static literal')
        if ch != '\\':
            result.append(ch)
            continue
        ch = text[i]
        i += 1
        if ch in escapes:
            result.append(escapes[ch])
        elif ch in ('x', 'u'):
            if ch == 'u' and text[i:i + 1] == '{':
                end = text.index('}', i)
                result.append(chr(int(text[i + 1:end], 16)))
                i = end + 1
            else:
                size = 2 if ch == 'x' else 4
                result.append(chr(int(text[i:i + size], 16)))
                i += size
        elif ch == '\r':
            if text[i:i + 1] == '\n':
                i += 1
        elif ch != '\n':
            result.append(ch)
    raise ValueError('Unterminated raw-text literal')


def recover(bundle_root: Path, project: Path) -> dict:
    paths = sorted(p for p in bundle_root.rglob('*')
                   if p.suffix in EXTENSIONS and 'node_modules' not in p.parts)
    # Stable canonical selection: main, eval, then auxiliary bundles.
    paths.sort(key=lambda p: (0 if p.name == 'host-main.cjs' else
                             1 if p.name == 'sand-eval-runner.cjs' else 2, str(p)))
    groups: dict[str, list[dict]] = {}
    inventory = []
    writes: dict[str, bytes] = {}
    raw_items = []
    for path in paths:
        relative = path.relative_to(bundle_root).as_posix()
        data = path.read_bytes()
        fragments = split_bundle(data)
        info = dict(path=relative, bytes=len(data), sha256=digest(data),
                    moduleFragments=len(fragments), firstPartyFragments=0)
        inventory.append(info)
        if not fragments:
            # No evidence of original TS modules: preserve extension and bytes.
            target = ('vendor/pdfjs/' if relative == 'pdf.worker.mjs' else
                      'standalone/sand-host/') + relative
            writes[target] = data
            info.update(kind='vendor' if relative == 'pdf.worker.mjs' else 'standalone', output=target)
            continue
        info['kind'] = 'bundle'
        by_source: dict[str, list[dict]] = {}
        for fragment in fragments:
            destination = source_destination(fragment['source'])
            if destination is None:
                continue
            info['firstPartyFragments'] += 1
            if not fragment['source'].startswith('raw-text:') and PurePosixPath(destination).suffix not in {'.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs', '.mts', '.cts'}:
                destination += '.js'  # e.g. compiled .po modules contain JavaScript
            by_source.setdefault(destination, []).append(fragment)
        for destination, parts in by_source.items():
            body = b''.join(p['body'] for p in parts)
            occurrence = dict(bundle=relative, sha256=digest(body),
                              fragments=[{k: v for k, v in p.items() if k != 'body'} for p in parts],
                              body=body, partBodies=[p['body'] for p in parts])
            groups.setdefault(destination, []).append(occurrence)
            if parts[0]['source'].startswith('raw-text:'):
                raw_items.append(occurrence)
    decoded = [decode_literal(o['body']) for o in raw_items]
    for occurrence, resource in zip(raw_items, decoded):
        occurrence['body'] = resource.encode()
        occurrence['decodedResource'] = True

    files = []
    for destination, occurrences in sorted(groups.items()):
        seen = {}
        for occurrence in occurrences:
            body = occurrence.pop('body')
            part_bodies = occurrence.pop('partBodies')
            if not occurrence.get('decodedResource'):
                body = b''.join(
                    f'// @recovered-fragment {i + 1}/{len(part_bodies)}\n'.encode() + part
                    for i, part in enumerate(part_bodies)
                )
            content_hash = digest(body)
            if content_hash in seen:
                target = seen[content_hash]
            else:
                target = destination if not seen else 'variants/' + occurrence['bundle'] + '/' + destination
                if not occurrence.get('decodedResource'):
                    header = ('/* Recovered emitted JavaScript; original types/imports may be absent.\n'
                              f' * Source: {occurrence["fragments"][0]["source"]}\n'
                              f' * Bundle: sand-host/{occurrence["bundle"]}\n'
                              ' * See recovery-manifest.json for exact byte ranges. */\n').encode()
                    body = header + body
                writes[target] = body
                seen[content_hash] = target
            occurrence['output'] = target
        files.append(dict(path=destination, variantCount=len(seen), occurrences=occurrences))

    # Check all collisions before touching output; preserve locally edited files.
    manifest_path = project / 'recovery-manifest.json'
    old = json.loads(manifest_path.read_text()) if manifest_path.exists() else {}
    output = project / 'recovered'
    for relative, body in writes.items():
        dest = output / relative
        if dest.exists() and dest.read_bytes() != body:
            if old.get('outputHashes', {}).get(relative) != digest(dest.read_bytes()):
                raise RuntimeError(f'Refusing to overwrite locally modified file: {dest}')
    stale = set(old.get('outputHashes', {})) - set(writes)
    for relative in stale:
        dest = output / relative
        if dest.exists() and digest(dest.read_bytes()) != old['outputHashes'][relative]:
            raise RuntimeError(f'Refusing to remove locally modified file: {dest}')
    for relative in stale:
        (output / relative).unlink(missing_ok=True)
    for relative, body in writes.items():
        dest = output / relative
        dest.parent.mkdir(parents=True, exist_ok=True)
        dest.write_bytes(body)
    manifest = dict(formatVersion=1, bundleRoot='sand-host',
                    rangeConvention='UTF-8 byte offsets: start inclusive, end exclusive; lines inclusive',
                    selection='host-main, sand-eval-runner, then sorted auxiliary bundles; differing versions retained',
                    moduleCount=len(files), outputCount=len(writes), bundles=inventory, files=files,
                    outputHashes={p: digest(b) for p, b in sorted(writes.items())})
    manifest_path.write_text(json.dumps(manifest, indent=2) + '\n')
    return manifest


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--bundle-root', type=Path, default=Path(__file__).resolve().parents[1] / 'sand-host')
    parser.add_argument('--project', type=Path, default=Path(__file__).resolve().parents[1])
    args = parser.parse_args()
    manifest = recover(args.bundle_root, args.project)
    print(json.dumps({k: manifest[k] for k in ('moduleCount', 'outputCount')}))


if __name__ == '__main__':
    main()

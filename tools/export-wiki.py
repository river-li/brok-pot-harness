#!/usr/bin/env python3
"""Validate authored docs and export a self-contained native GitHub Wiki.

No network access or publication. Repository links become source URLs; documentation
links become Wiki URLs; referenced project media is copied into the Wiki export.
"""
from __future__ import annotations

import argparse
import html
import json
import os
from pathlib import Path
import re
import shutil
import subprocess
import unicodedata
from urllib.parse import quote, unquote, urlsplit

ROOT = Path(__file__).resolve().parents[1]
SKIP_DIRS = {'.git', '.runtime', 'node_modules', 'sand-host', 'vendor', 'licenses', 'dist', 'site-src', 'site'}
TRANSLATION = re.compile(r'\.[a-z]{2}(?:-[A-Za-z]+)?\.md$')
FENCE = re.compile(r'(^[ \t]*```[^\n]*\n.*?^[ \t]*```[^\n]*$|^[ \t]*~~~[^\n]*\n.*?^[ \t]*~~~[^\n]*$)', re.M | re.S)
LINK = re.compile(r'(\]\()(<[^>\n]+>|[^\s)]+)')
ATTRIBUTE = re.compile(r'((?:href|src)=["\'])([^"\']+)', re.I)
CJK = re.compile(r'[\u3400-\u9fff]')
PRIVATE = re.compile(r'/Users/|\b192\.168\.\d+\.\d+|\b10\.\d+\.\d+\.\d+|\b172\.(?:1[6-9]|2\d|3[01])\.\d+\.\d+|https?://[^/\s]+\.(?:home|lan)\b')


def authored_docs(root: Path) -> list[Path]:
    result = []
    for directory, children, names in os.walk(root):
        children[:] = sorted(n for n in children if n not in SKIP_DIRS and not n.startswith('.'))
        result.extend(Path(directory) / n for n in sorted(names) if n.endswith('.md'))
    # This guide is authored here; nested vendor documentation is upstream material.
    if (root / 'vendor/README.md').exists():
        result.append(root / 'vendor/README.md')
    return sorted(result)


def prose(text: str) -> str:
    return FENCE.sub('', text)


def targets(text: str) -> list[str]:
    body = prose(text)
    return [m.group(2).strip('<>') for m in LINK.finditer(body)] + [html.unescape(m.group(2)) for m in ATTRIBUTE.finditer(body)]


def local_target(root: Path, source: Path, target: str):
    parsed = urlsplit(target)
    if parsed.scheme or parsed.netloc:
        return None
    path = (source.parent / unquote(parsed.path)).resolve() if parsed.path else source
    try:
        path.relative_to(root)
    except ValueError as error:
        raise ValueError(f'{source.relative_to(root)}: link leaves repository: {target}') from error
    return path, unquote(parsed.fragment)


def anchors(text: str) -> set[str]:
    body = prose(text)
    result = set(re.findall(r'(?:id|name)=["\']([^"\']+)', body))
    seen = {}
    for heading in re.findall(r'^#{1,6}\s+(.+?)\s*#*$', body, re.M):
        heading = re.sub(r'<[^>]+>', '', heading).lower()
        slug = ''.join(c for c in heading if not unicodedata.category(c).startswith(('P', 'S')) or c in '-_').replace(' ', '-')
        count = seen.get(slug, 0)
        seen[slug] = count + 1
        result.add(slug + (f'-{count}' if count else ''))
    return result


def validate(root: Path, docs: list[Path]) -> dict:
    errors = []
    count = 0
    package = root / 'package.json'
    scripts = json.loads(package.read_text()).get('scripts', {}) if package.exists() else {}
    for source in docs:
        text = source.read_text()
        label = str(source.relative_to(root))
        if not TRANSLATION.search(source.name) and CJK.search(text):
            errors.append(f'{label}: non-English prose belongs in a language-suffixed translation')
        if PRIVATE.search(text):
            errors.append(f'{label}: personal path or private network example')
        for number, line in enumerate(text.splitlines(), 1):
            if line.rstrip() != line:
                errors.append(f'{label}:{number}: trailing whitespace')
        for command in re.findall(r'npm run ([\w:-]+)', text):
            if command not in scripts:
                errors.append(f'{label}: unknown npm script {command}')
        for target in targets(text):
            try:
                resolved = local_target(root, source, target)
                if resolved is None:
                    continue
                count += 1
                path, anchor = resolved
                if not path.exists():
                    errors.append(f'{label}: missing link target {target}')
                elif anchor and path.suffix == '.md' and anchor not in anchors(path.read_text()):
                    errors.append(f'{label}: missing heading anchor {target}')
            except ValueError as error:
                errors.append(str(error))
    template = root / '.env.example'
    if template.exists() and PRIVATE.search(template.read_text()):
        errors.append('.env.example: private network example or personal path')
    if errors:
        raise ValueError('\n'.join(errors))
    return {'documents': len(docs), 'localLinks': count}


def page_name(path: Path) -> str:
    value = path.as_posix()
    special = {
        'README.md': 'Project', 'CONTRIBUTING.md': 'Contributing',
        'MIGRATION_STATUS.md': 'Maintenance-Status', 'docs/README.md': 'Documentation',
        'docs/media/README.md': 'Demonstrations', 'packages/README.md': 'Packages',
        'src/host/extensions/README.md': 'Host-Extensions', 'src/host/README.md': 'Host',
        'src/shared/README.md': 'Shared', 'src/README.md': 'Source',
        'assets/branding/README.md': 'Branding', 'runtime/BUILD_PROFILES.md': 'Build-Profiles',
        'runtime/VOICE.md': 'Voice-Bridge', 'tools/README.md': 'Repository-Tools',
    }
    if value in special:
        return special[value]
    if path.parts[:2] == ('docs', 'wiki'):
        return path.stem
    if value.startswith('src/host/extensions/'):
        return 'Host-Extension-' + path.parts[3]
    if value.startswith('packages/'):
        return 'Package-' + '-'.join(path.parts[1:-1])
    return '-'.join(p.replace('_', '-') for p in path.parts[:-1]) + ('' if path.name == 'README.md' else '-' + path.stem)


def page_map(root: Path, docs: list[Path]) -> dict[Path, str]:
    result, used = {}, set()
    for path in docs:
        if path.name == 'AGENTS.md' or TRANSLATION.search(path.name):
            continue
        name = page_name(path.relative_to(root))
        if name.lower() in used:
            raise ValueError(f'Wiki page name collision: {name}')
        used.add(name.lower())
        result[path] = name
    if 'Home' not in result.values():
        raise ValueError('Wiki requires docs/wiki/Home.md')
    return result


def repository_slug(value: str) -> str:
    value = value.strip().rstrip('/')
    if value.startswith('git@github.com:'):
        value = value.split(':', 1)[1]
    elif value.startswith('https://'):
        parsed = urlsplit(value)
        if parsed.hostname != 'github.com' or parsed.username or parsed.password or parsed.query or parsed.fragment:
            raise ValueError('Use a credential-free github.com repository URL or OWNER/REPO')
        value = parsed.path.lstrip('/')
    if value.endswith('.git'):
        value = value[:-4]
    if not re.fullmatch(r'[A-Za-z0-9_.-]+/[A-Za-z0-9_.-]+', value) or value.endswith('.wiki'):
        raise ValueError('Expected the main GitHub repository as OWNER/REPO or a GitHub URL')
    return value


def origin_repository(root: Path) -> str:
    result = subprocess.run(['git', 'remote', 'get-url', 'origin'], cwd=root, capture_output=True, text=True)
    if result.returncode:
        raise ValueError('No origin remote; pass --repository OWNER/REPO')
    return repository_slug(result.stdout)


def rewrite(root: Path, source: Path, text: str, pages: dict, repository: str, ref: str, assets: set[Path]) -> str:
    base = f'https://github.com/{repository}'
    if source.relative_to(root).parts[:2] == ('docs', 'wiki') and not source.name.startswith('_'):
        # GitHub renders _Footer.md globally; omit the source-browser footer.
        text = re.sub(r'\n---\n\[Documentation\]\(Home\.md\)[^\n]*\n?$', '\n', text)
    def convert(target: str) -> str:
        resolved = local_target(root, source, html.unescape(target.strip('<>')))
        if resolved is None:
            return target
        path, anchor = resolved
        parsed = urlsplit(target.strip('<>'))
        suffix = '#' + quote(anchor, safe='-_.~') if anchor else ''
        if not parsed.path:
            return suffix
        if path in pages:
            return f'{base}/wiki/{quote(pages[path])}{suffix}'
        relative = path.relative_to(root).as_posix()
        if relative.startswith(('docs/media/', 'assets/branding/')) and path.is_file():
            assets.add(path)
            return f'https://raw.githubusercontent.com/wiki/{repository}/assets/{quote(relative)}{suffix}'
        mode = 'tree' if path.is_dir() else 'blob'
        query = '?' + parsed.query if parsed.query else ''
        return f'{base}/{mode}/{quote(ref, safe="")}/{quote(relative)}{query}{suffix}'
    def section(part: str) -> str:
        part = LINK.sub(lambda m: m.group(1) + convert(m.group(2)), part)
        return ATTRIBUTE.sub(lambda m: m.group(1) + convert(m.group(2)), part)
    # Fence contents are source examples, not navigation.
    return ''.join(part if i % 2 else section(part) for i, part in enumerate(FENCE.split(text)))


def export(root: Path, output: Path, repository: str, ref: str, docs: list[Path]) -> dict:
    # Only a generated directory under .runtime can be replaced.
    if output.is_symlink() or (root / '.runtime').is_symlink():
        raise ValueError('Wiki output and .runtime must not be symlinks')
    output = output.resolve()
    runtime = (root / '.runtime').resolve()
    if output.parent != runtime or output.name in {'data', 'workspace', 'profiles', 'models', 'build', 'desktop', 'tests', 'showcase'}:
        raise ValueError('Output must be a dedicated direct child of .runtime (default: .runtime/wiki)')
    marker = output / '.gbh-wiki-export.json'
    if output.exists():
        if not marker.is_file():
            raise ValueError('Refusing to replace a directory not marked as a Wiki export')
        metadata = json.loads(marker.read_text())
        if metadata.get('generator') != 'gbh-wiki-export':
            raise ValueError('Invalid Wiki export ownership marker')
    pages = page_map(root, docs)
    assets: set[Path] = set()
    rendered = {name + '.md': rewrite(root, source, source.read_text(), pages, repository, ref, assets) for source, name in pages.items()}
    # All validation and rendering happen before replacing a previous export.
    if output.exists():
        shutil.rmtree(output)
    output.mkdir(parents=True)
    for name, content in rendered.items():
        (output / name).write_text(content)
    for source in sorted(assets):
        destination = output / 'assets' / source.relative_to(root)
        destination.parent.mkdir(parents=True, exist_ok=True)
        shutil.copyfile(source, destination)
    metadata = {'generator': 'gbh-wiki-export', 'repository': repository, 'sourceRef': ref, 'pages': sorted(rendered),
                'assets': [str(Path('assets') / p.relative_to(root)) for p in sorted(assets)]}
    marker.write_text(json.dumps(metadata, indent=2) + '\n')
    return {'pages': len(pages), 'assets': len(assets), 'output': str(output)}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--check', action='store_true', help='Validate source docs without writing output')
    parser.add_argument('--repository', help='GitHub OWNER/REPO or URL; defaults to origin')
    parser.add_argument('--ref', default='main', help='Source branch or commit for code links (default: main)')
    parser.add_argument('--output', type=Path, default=ROOT / '.runtime/wiki')
    args = parser.parse_args()
    try:
        docs = authored_docs(ROOT)
        report = validate(ROOT, docs)
        if not args.check:
            repository = repository_slug(args.repository) if args.repository else origin_repository(ROOT)
            report.update(export(ROOT, args.output, repository, args.ref, docs))
        print(json.dumps(report, indent=2))
    except (ValueError, OSError) as error:
        parser.exit(1, f'{error}\n')


if __name__ == '__main__':
    main()

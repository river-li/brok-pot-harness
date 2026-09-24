#!/usr/bin/env python3
"""Build the Pages site from authored Markdown and explicitly linked media."""
from __future__ import annotations

import argparse
import html
from html.parser import HTMLParser
import json
import os
from pathlib import Path
import posixpath
import re
import shutil
import subprocess
import sys
from urllib.parse import quote, unquote, urljoin, urlsplit

ROOT = Path(__file__).resolve().parents[1]
STATE = Path('.runtime/docs-site')
SOURCE_DIR = STATE / 'src'
OUTPUT_DIR = STATE / 'site'
OWNER_FILE = '.gbh-docs-site.json'
GENERATOR = 'gbh-docs-site'
DEFAULT_REPOSITORY = 'river-li/brok-pot-harness'
SKIP_DIRS = {'.git', '.runtime', 'node_modules', 'sand-host', 'vendor', 'licenses', 'dist', 'site-src', 'site'}
MEDIA_DIRS = {('docs', 'media'), ('assets', 'branding')}
MEDIA_SUFFIXES = {'.gif', '.jpeg', '.jpg', '.json', '.mp3', '.mp4', '.ogg', '.pdf', '.png', '.svg', '.wav', '.webm', '.webp'}
COMMIT_RE = re.compile(r'^[0-9a-fA-F]{7,64}$')
FENCE_RE = re.compile(
    r'(^[ \t]*```[^\n]*\n.*?^[ \t]*```[^\n]*$|^[ \t]*~~~[^\n]*\n.*?^[ \t]*~~~[^\n]*$)',
    re.M | re.S,
)
LINK_RE = re.compile(r'\]\((<[^>\n]+>|[^\s)]+)')
ATTRIBUTE_RE = re.compile(r'((?:href|src|poster|data)=["\'])([^"\']+)', re.I)


def markdown_sources(root: Path) -> list[Path]:
    result: list[Path] = []
    for directory, children, names in os.walk(root, followlinks=False):
        parent = Path(directory)
        children[:] = sorted(
            name for name in children
            if name not in SKIP_DIRS and not name.startswith('.') and not (parent / name).is_symlink()
        )
        for name in sorted(names):
            path = parent / name
            if name.endswith('.md') and name != 'AGENTS.md' and not name.startswith('_') and not path.is_symlink():
                result.append(path)
    vendor_readme = root / 'vendor/README.md'
    if vendor_readme.is_file() and not vendor_readme.is_symlink():
        result.append(vendor_readme)
    return sorted(set(result))


def repository_slug(value: str) -> str:
    value = value.strip().strip('/')
    if not re.fullmatch(r'[A-Za-z0-9_.-]+/[A-Za-z0-9_.-]+', value):
        raise ValueError('GBH_DOCS_REPOSITORY must be an OWNER/REPO slug')
    return value


def repository() -> str:
    configured = os.environ.get('GBH_DOCS_REPOSITORY')
    action_repository = os.environ.get('GITHUB_REPOSITORY') if os.environ.get('GITHUB_ACTIONS') == 'true' else None
    return repository_slug(configured or action_repository or DEFAULT_REPOSITORY)


def default_site_url(slug: str) -> str:
    owner, name = slug.split('/', 1)
    if name.casefold() == f'{owner}.github.io'.casefold():
        return f'https://{owner}.github.io/'
    return f'https://{owner}.github.io/{name}/'


def checked_site_url(slug: str) -> str:
    value = os.environ.get('GBH_DOCS_SITE_URL') or default_site_url(slug)
    parsed = urlsplit(value)
    if parsed.scheme not in {'http', 'https'} or not parsed.netloc or parsed.query or parsed.fragment:
        raise ValueError('GBH_DOCS_SITE_URL must be an http(s) URL without query or fragment')
    path = parsed.path or '/'
    if not path.endswith('/'):
        path += '/'
    return parsed._replace(path=path).geturl()


def source_commit(root: Path) -> str:
    value = os.environ.get('GBH_DOCS_SOURCE_COMMIT')
    if not value:
        result = subprocess.run(['git', 'rev-parse', 'HEAD'], cwd=root, check=True, capture_output=True, text=True)
        value = result.stdout.strip()
    if not COMMIT_RE.fullmatch(value):
        raise ValueError('Could not identify a valid source commit for the site artifact')
    return value.lower()


def route_for_page(relative: Path) -> str:
    value = relative.as_posix()
    if relative.name in {'README.md', 'index.md'}:
        value = relative.parent.as_posix()
    else:
        value = relative.with_suffix('').as_posix()
    return '' if value == '.' else value.rstrip('/')


def assert_no_symlink_components(root: Path, path: Path) -> None:
    absolute_root = root.resolve()
    absolute_path = Path(os.path.abspath(path))
    try:
        relative = absolute_path.relative_to(absolute_root)
    except ValueError as error:
        raise ValueError(f'local link leaves repository: {path}') from error
    current = absolute_root
    for part in relative.parts:
        current /= part
        if current.is_symlink():
            raise ValueError(f'symbolic links are not site inputs: {current.relative_to(absolute_root)}')


def local_target(root: Path, source: Path, value: str) -> tuple[Path, object] | None:
    target = html.unescape(value.strip().strip('<>'))
    parsed = urlsplit(target)
    if parsed.scheme or parsed.netloc:
        return None
    if not parsed.path:
        return source, parsed
    if parsed.path.startswith('/'):
        candidate = root / unquote(parsed.path.lstrip('/'))
    else:
        candidate = source.parent / unquote(parsed.path)
    candidate = Path(os.path.abspath(candidate))
    assert_no_symlink_components(root, candidate)
    return candidate, parsed


def references(text: str) -> list[str]:
    result: list[str] = []
    for index, part in enumerate(FENCE_RE.split(text)):
        if index % 2:
            continue
        result.extend(match.group(1).strip('<>') for match in LINK_RE.finditer(part))
        result.extend(html.unescape(match.group(2)) for match in ATTRIBUTE_RE.finditer(part))
    return result


def is_public_media(root: Path, path: Path) -> bool:
    try:
        relative = path.relative_to(root)
    except ValueError:
        return False
    return relative.parts[:2] in MEDIA_DIRS and path.suffix.lower() in MEDIA_SUFFIXES and path.is_file()


def public_asset_paths(root: Path, docs: list[Path]) -> set[Path]:
    assets: set[Path] = set()
    for source in docs:
        for target in references(source.read_text()):
            resolved = local_target(root, source, target)
            if resolved is None:
                continue
            path, _parsed = resolved
            if path.exists() and is_public_media(root, path):
                assets.add(path)
    return assets


def relative_url(source_route: str, destination: str, is_page: bool) -> str:
    relative = posixpath.relpath(destination or '.', source_route or '.')
    if relative == '.':
        relative = './'
    elif is_page and not relative.endswith('/'):
        relative += '/'
    return quote(relative, safe='/-._~')


def github_source_url(repository_name: str, commit: str, path: Path, root: Path, parsed: object) -> str:
    kind = 'tree' if path.is_dir() else 'blob'
    relative = quote(path.relative_to(root).as_posix(), safe='/-._~')
    value = f'https://github.com/{repository_name}/{kind}/{commit}/{relative}'
    if parsed.query:
        value += '?' + parsed.query
    if parsed.fragment:
        value += '#' + quote(parsed.fragment, safe='-._~!$&\'()*+,;=:@/?')
    return value


def rewrite_target(
    root: Path,
    source: Path,
    source_relative: Path,
    raw_target: str,
    included_pages: set[Path],
    included_assets: set[Path],
    repository_name: str,
    commit: str,
    html_attribute: bool = False,
) -> str:
    value = html.unescape(raw_target.strip().strip('<>'))
    resolved = local_target(root, source, value)
    if resolved is None:
        return raw_target
    target_path, parsed = resolved
    if not parsed.path:
        return raw_target
    if not target_path.exists():
        raise ValueError(f'{source_relative}: missing site link target {parsed.path}')

    page_path = target_path
    if target_path.is_dir() and (target_path / 'README.md') in included_pages:
        page_path = target_path / 'README.md'
    if page_path in included_pages:
        if html_attribute:
            destination = route_for_page(page_path.relative_to(root))
            relative = relative_url(route_for_page(source_relative), destination, True)
        else:
            destination = page_path.relative_to(root).as_posix()
            relative = quote(posixpath.relpath(destination, source_relative.parent.as_posix() or '.'), safe='/-._~')
    elif target_path in included_assets:
        destination = target_path.relative_to(root).as_posix()
        if html_attribute:
            relative = relative_url(route_for_page(source_relative), destination, False)
        else:
            relative = quote(posixpath.relpath(destination, source_relative.parent.as_posix() or '.'), safe='/-._~')
    else:
        return github_source_url(repository_name, commit, target_path, root, parsed)

    if parsed.query:
        relative += '?' + parsed.query
    if parsed.fragment:
        relative += '#' + quote(parsed.fragment, safe='-._~!$&\'()*+,;=:@/?')
    return relative


def rewrite_document(
    root: Path,
    source: Path,
    included_pages: set[Path],
    included_assets: set[Path],
    repository_name: str,
    commit: str,
) -> str:
    source_relative = source.relative_to(root)

    def transform(part: str) -> str:
        part = LINK_RE.sub(
            lambda match: '](' + rewrite_target(
                root, source, source_relative, match.group(1), included_pages, included_assets, repository_name, commit
            ),
            part,
        )

        def html_link(match: re.Match[str]) -> str:
            updated = rewrite_target(
                root,
                source,
                source_relative,
                match.group(2),
                included_pages,
                included_assets,
                repository_name,
                commit,
                html_attribute=True,
            )
            return match.group(1) + updated

        return ATTRIBUTE_RE.sub(html_link, part)

    return ''.join(part if index % 2 else transform(part) for index, part in enumerate(FENCE_RE.split(source.read_text())))


def prepare_site(
    root: Path = ROOT,
    repository_name: str | None = None,
    commit: str | None = None,
) -> dict:
    root = root.resolve()
    runtime = root / '.runtime'
    if runtime.is_symlink():
        raise ValueError('.runtime must not be a symlink')
    runtime.mkdir(exist_ok=True)
    if not runtime.is_dir():
        raise ValueError('.runtime must be a directory')
    state = root / STATE
    if state.is_symlink():
        raise ValueError('.runtime/docs-site must not be a symlink')
    marker = state / OWNER_FILE
    if marker.is_symlink():
        raise ValueError('Documentation-site ownership marker must not be a symlink')
    if state.exists() and not marker.is_file():
        raise ValueError('Refusing to replace an unowned .runtime/docs-site directory')
    if marker.is_file():
        metadata = json.loads(marker.read_text())
        if metadata.get('generator') != GENERATOR:
            raise ValueError('Invalid documentation-site ownership marker')

    docs = markdown_sources(root)
    pages = set(docs)
    if not (root / 'README.md') in pages or not (root / 'docs/wiki/Home.md') in pages:
        raise ValueError('The project README and docs/wiki/Home.md are required site inputs')
    routes = [route_for_page(path.relative_to(root)) for path in docs]
    if len(routes) != len(set(routes)):
        raise ValueError('Two Markdown inputs map to the same website page route')
    assets = public_asset_paths(root, docs)
    repository_name = repository_slug(repository_name or repository())
    site_url = checked_site_url(repository_name)
    commit = (commit or source_commit(root)).lower()
    if not COMMIT_RE.fullmatch(commit):
        raise ValueError('Source commit must be a Git commit identifier')

    rendered = {
        source.relative_to(root): rewrite_document(root, source, pages, assets, repository_name, commit)
        for source in docs
    }
    js = root / 'docs/assets/javascripts/mermaid-init.js'
    if not js.is_file() or js.is_symlink():
        raise ValueError('docs/assets/javascripts/mermaid-init.js must be a regular file')

    state.mkdir(parents=True, exist_ok=True)
    source_dir = root / SOURCE_DIR
    output_dir = root / OUTPUT_DIR
    for destination in (source_dir, output_dir):
        if destination.is_symlink():
            raise ValueError(f'{destination.relative_to(root)} must not be a symlink')
    if source_dir.exists():
        shutil.rmtree(source_dir)
    source_dir.mkdir(parents=True)
    for relative, content in rendered.items():
        destination = source_dir / relative
        destination.parent.mkdir(parents=True, exist_ok=True)
        destination.write_text(content)
    for asset in sorted(assets | {js}):
        destination = source_dir / asset.relative_to(root)
        destination.parent.mkdir(parents=True, exist_ok=True)
        shutil.copyfile(asset, destination)

    metadata = {
        'generator': GENERATOR,
        'repository': repository_name,
        'siteUrl': site_url,
        'sourceCommit': commit,
        'pages': [path.as_posix() for path in sorted(rendered)],
        'assets': [path.relative_to(root).as_posix() for path in sorted(assets | {js})],
    }
    marker.write_text(json.dumps(metadata, indent=2) + '\n')
    return metadata


def site_environment(root: Path) -> dict[str, str]:
    env = os.environ.copy()
    slug = repository()
    env['GBH_DOCS_REPOSITORY'] = slug
    env['GBH_DOCS_REPOSITORY_URL'] = 'https://github.com/' + slug
    env['GBH_DOCS_SITE_URL'] = checked_site_url(slug)
    env['GBH_DOCS_SOURCE_COMMIT'] = source_commit(root)
    return env


def mkdocs_python(root: Path) -> str:
    override = os.environ.get('GBH_DOCS_PYTHON')
    if override:
        return override
    local_python = root / '.runtime/docs-venv/bin/python'
    return str(local_python) if local_python.is_file() else sys.executable


class HTMLDocument(HTMLParser):
    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.links: list[str] = []
        self.anchors: set[str] = set()

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        values = dict(attrs)
        for key in ('id', 'name'):
            if values.get(key):
                self.anchors.add(values[key] or '')
        for key in ('href', 'src', 'poster', 'data'):
            if values.get(key):
                self.links.append(values[key] or '')

    def handle_startendtag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        self.handle_starttag(tag, attrs)


def _site_page_url(site_url: str, relative: Path) -> str:
    if relative.name == 'index.html':
        route = '' if relative.parent.as_posix() == '.' else relative.parent.as_posix() + '/'
    else:
        route = relative.as_posix()
    return urljoin(site_url, route)


def _artifact_file_allowed(relative: Path) -> bool:
    parts = relative.parts
    if any(part.startswith('.') or part in {'node_modules', 'profiles', 'data', 'workspace', 'dist', 'tests'} for part in parts):
        return False
    suffix = relative.suffix.lower()
    if suffix == '.html' or relative.as_posix() in {'404.html', 'source-commit.txt'}:
        return True
    if len(parts) > 1 and parts[0] in {'css', 'js'} and suffix in {'.css', '.js'}:
        return True
    if len(parts) > 1 and parts[0] in {'css', 'js'} and suffix == '.map':
        return True
    if len(parts) > 1 and parts[0] == 'search' and suffix in {'.js', '.json'}:
        return True
    if len(parts) > 1 and parts[0] in {'fonts', 'webfonts'} and suffix in {'.woff', '.woff2', '.ttf'}:
        return True
    if parts[0] == 'img' and suffix in {'.ico', '.png', '.svg'}:
        return True
    if relative.as_posix() == 'sitemap.xml' or relative.as_posix() == 'sitemap.xml.gz':
        return True
    if relative.as_posix() == 'docs/assets/javascripts/mermaid-init.js':
        return True
    if parts[:2] in MEDIA_DIRS and suffix in MEDIA_SUFFIXES:
        return True
    return False


def verify_output(root: Path = ROOT, output: Path | None = None, site_url: str | None = None) -> dict:
    root = root.resolve()
    output = output or (root / OUTPUT_DIR)
    if (root / '.runtime').is_symlink() or (root / STATE).is_symlink():
        raise ValueError('.runtime/docs-site must not be a symlink')
    expected = (root / OUTPUT_DIR).resolve()
    if output.is_symlink() or output.resolve() != expected:
        raise ValueError(f'Only {OUTPUT_DIR.as_posix()} is a valid Pages artifact directory')
    output = expected
    if not output.is_dir():
        raise ValueError('Pages artifact directory is missing or is a symlink')
    marker = root / STATE / OWNER_FILE
    if marker.is_symlink() or not marker.is_file():
        raise ValueError('Documentation-site ownership marker is missing')
    metadata = json.loads(marker.read_text())
    if metadata.get('generator') != GENERATOR:
        raise ValueError('Invalid documentation-site ownership marker')
    slug = repository()
    site_url = site_url or metadata.get('siteUrl') or checked_site_url(slug)
    commit_file = output / 'source-commit.txt'
    if not commit_file.is_file() or not COMMIT_RE.fullmatch(commit_file.read_text().strip()):
        raise ValueError('Pages artifact must contain a valid source-commit.txt')

    expected_pages = {
        Path(route_for_page(Path(source))) / 'index.html' if route_for_page(Path(source)) else Path('index.html')
        for source in metadata.get('pages', [])
    }
    files = sorted(path for path in output.rglob('*') if path.is_file())
    errors: list[str] = []
    for path in files:
        relative = path.relative_to(output)
        if path.is_symlink() or (relative not in expected_pages and not _artifact_file_allowed(relative)):
            errors.append(f'forbidden artifact file: {relative.as_posix()}')
    if errors:
        raise ValueError('\n'.join(errors))

    pages: dict[Path, HTMLDocument] = {}
    for path in files:
        if path.suffix.lower() != '.html':
            continue
        parsed = HTMLDocument()
        parsed.feed(path.read_text(encoding='utf-8'))
        pages[path.relative_to(output)] = parsed

    for unexpected in sorted(set(pages) - expected_pages - {Path('404.html')}):
        errors.append(f'unexpected HTML page in site artifact: {unexpected.as_posix()}')
    for missing in sorted(expected_pages - set(pages)):
        errors.append(f'missing generated page in site artifact: {missing.as_posix()}')

    base_path = urlsplit(site_url).path or '/'
    if not base_path.endswith('/'):
        base_path += '/'
    origin = urlsplit(site_url)
    for relative, document in pages.items():
        page_url = _site_page_url(site_url, relative)
        for target in document.links:
            resolved = urlsplit(urljoin(page_url, target))
            if not resolved.path and not resolved.fragment:
                continue
            if resolved.scheme not in {'http', 'https'} or resolved.netloc != origin.netloc:
                continue
            if not (resolved.path == base_path.rstrip('/') or resolved.path.startswith(base_path)):
                errors.append(f'{relative.as_posix()}: link escapes site base path: {target}')
                continue
            local_path = unquote(resolved.path[len(base_path):]) if resolved.path.startswith(base_path) else ''
            if not local_path:
                local_relative = Path('index.html')
            elif local_path.endswith('/'):
                local_relative = Path(local_path) / 'index.html'
            else:
                local_relative = Path(local_path)
                if not local_relative.suffix:
                    local_relative = local_relative / 'index.html'
            destination = output / local_relative
            if not destination.is_file():
                errors.append(f'{relative.as_posix()}: missing site target {target}')
                continue
            if resolved.fragment:
                anchor = unquote(resolved.fragment)
                target_document = pages.get(local_relative)
                if target_document and anchor not in target_document.anchors:
                    errors.append(f'{relative.as_posix()}: missing site anchor {target}')

    if errors:
        raise ValueError('\n'.join(errors))
    return {'pages': len(pages), 'files': len(files), 'sourceCommit': commit_file.read_text().strip(), 'siteUrl': site_url}


def prepare(root: Path = ROOT) -> dict:
    metadata = prepare_site(root)
    print(json.dumps({'pages': len(metadata['pages']), 'assets': len(metadata['assets']), 'sourceCommit': metadata['sourceCommit']}, indent=2))
    return metadata


def build(root: Path = ROOT) -> dict:
    root = root.resolve()
    prepare_site(root)
    env = site_environment(root)
    result = subprocess.run([mkdocs_python(root), '-m', 'mkdocs', 'build', '--clean', '--strict'], cwd=root, env=env)
    if result.returncode:
        raise SystemExit(result.returncode)
    output = root / OUTPUT_DIR
    (output / 'source-commit.txt').write_text(env['GBH_DOCS_SOURCE_COMMIT'] + '\n')
    report = verify_output(root, output, env['GBH_DOCS_SITE_URL'])
    print(json.dumps(report, indent=2))
    return report


def serve(root: Path = ROOT) -> None:
    root = root.resolve()
    prepare_site(root)
    env = site_environment(root)
    result = subprocess.run(
        [mkdocs_python(root), '-m', 'mkdocs', 'serve', '--dev-addr', '127.0.0.1:8000'],
        cwd=root,
        env=env,
    )
    raise SystemExit(result.returncode)


def setup(root: Path = ROOT) -> None:
    root = root.resolve()
    runtime = root / '.runtime'
    if runtime.is_symlink():
        raise ValueError('.runtime must not be a symlink')
    runtime.mkdir(exist_ok=True)
    venv = runtime / 'docs-venv'
    if venv.is_symlink():
        raise ValueError('.runtime/docs-venv must not be a symlink')
    if not (venv / 'bin/python').is_file():
        subprocess.run([sys.executable, '-m', 'venv', str(venv)], cwd=root, check=True)
    subprocess.run(
        [str(venv / 'bin/python'), '-m', 'pip', 'install', '--disable-pip-version-check', '-r', 'docs/requirements-pages.txt'],
        cwd=root,
        check=True,
    )


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('command', choices={'setup', 'prepare', 'build', 'serve', 'verify'})
    args = parser.parse_args()
    try:
        if args.command == 'setup':
            setup()
        elif args.command == 'prepare':
            prepare()
        elif args.command == 'build':
            build()
        elif args.command == 'serve':
            serve()
        else:
            print(json.dumps(verify_output(), indent=2))
    except (OSError, ValueError, subprocess.CalledProcessError) as error:
        parser.exit(1, f'{error}\n')


if __name__ == '__main__':
    main()

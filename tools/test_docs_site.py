"""Regression tests for the generated documentation site boundary and links."""
import importlib.util
from pathlib import Path
import tempfile
import unittest

spec = importlib.util.spec_from_file_location('docs_site', Path(__file__).with_name('docs-site.py'))
site = importlib.util.module_from_spec(spec)
spec.loader.exec_module(site)


class DocumentationSiteTest(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name).resolve()
        files = {
            'README.md': (
                '<a href="docs/wiki/Home.md">Docs</a><img src="assets/branding/icon.png">\n'
                '<details>\n<summary>Animation</summary>\n\n'
                '![Demo](docs/media/diagram.png)\n\n[Notes](docs/media/README.md)\n\n</details>\n'
            ),
            'README.zh.md': (
                '<a href="docs/wiki/Home.md">文档</a>\n'
                '<details>\n<summary>动画</summary>\n\n'
                '![演示](docs/media/diagram.png)\n\n[说明](docs/media/README.md)\n\n</details>\n'
            ),
            'CONTRIBUTING.md': '# Contributing\n',
            'docs/wiki/Home.md': '# Home\n[Architecture](Architecture.md#request-flow)\n',
            'docs/wiki/Architecture.md': '# Request flow\n[Diagram](../media/diagram.png)\n',
            'docs/media/README.md': '# Media\n',
            'packages/example/README.md': '[Runner](src/runner)\n',
            'packages/example/src/runner/main.ts': 'export {}\n',
            'runtime/renderer-src/README.md': '# Renderer guide\n',
            'runtime/renderer-src/index.html': '<script>implementation</script>\n',
            'runtime/data/session.json': '{"private":true}\n',
            'AGENTS.md': '# Private agent guidance\n',
            '.env.example': 'TOKEN=placeholder\n',
            'docs/media/diagram.png': 'public media\n',
            'assets/branding/icon.png': 'public icon\n',
            'docs/assets/javascripts/mermaid-init.js': 'window.mermaid = true;\n',
        }
        for name, contents in files.items():
            path = self.root / name
            path.parent.mkdir(parents=True, exist_ok=True)
            path.write_text(contents)
        (self.root / '.runtime/data').mkdir(parents=True)
        (self.root / '.runtime/data/diagnostic.log').write_text('private diagnostic\n')

    def test_staging_rewrites_links_and_excludes_unapproved_tree_content(self):
        commit = 'a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2'
        metadata = site.prepare_site(self.root, 'fork-owner/renamed-repo', commit)
        stage = self.root / '.runtime/docs-site/src'

        self.assertIn('href="docs/wiki/Home/"', (stage / 'README.md').read_text())
        self.assertIn('href="../docs/wiki/Home/"', (stage / 'README.zh.md').read_text())
        self.assertIn('<details markdown="block">', (stage / 'README.md').read_text())
        self.assertIn('<details markdown="block">', (stage / 'README.zh.md').read_text())
        runner = (stage / 'packages/example/README.md').read_text()
        self.assertIn(f'https://github.com/fork-owner/renamed-repo/tree/{commit}/packages/example/src/runner', runner)
        self.assertTrue((stage / 'runtime/renderer-src/README.md').is_file())
        self.assertFalse((stage / 'runtime/renderer-src/index.html').exists())
        self.assertTrue((stage / 'docs/media/diagram.png').is_file())
        self.assertTrue((stage / 'assets/branding/icon.png').is_file())
        self.assertTrue((stage / 'docs/assets/javascripts/mermaid-init.js').is_file())
        for excluded in ('.env.example', 'AGENTS.md', 'runtime/data/session.json', 'runtime/renderer-src/index.html'):
            self.assertFalse((stage / excluded).exists(), excluded)
        self.assertFalse(any(path.is_symlink() for path in stage.rglob('*')))
        self.assertEqual(metadata['repository'], 'fork-owner/renamed-repo')

    def test_preview_links_are_checked_under_a_project_base_path(self):
        site.prepare_site(self.root, 'fork-owner/renamed-repo', 'b' * 40)
        output = self.root / '.runtime/docs-site/site'
        pages = [Path(name) for name in site.json.loads((self.root / '.runtime/docs-site/.gbh-docs-site.json').read_text())['pages']]
        for source in pages:
            route = site.route_for_page(source)
            destination = output / route / 'index.html' if route else output / 'index.html'
            destination.parent.mkdir(parents=True, exist_ok=True)
            destination.write_text('<h1 id="request-flow">Page</h1>\n')
        (output / 'source-commit.txt').write_text('b' * 40 + '\n')
        index = output / 'index.html'
        index.write_text(
            '<a href="docs/wiki/Architecture/#request-flow">Architecture</a>'
            '<img src="docs/media/diagram.png" alt="Diagram">\n'
        )
        (output / 'docs/wiki/Architecture/index.html').write_text(
            '<h1 id="request-flow">Architecture</h1><a href="../../../">Home</a>\n'
        )
        (output / 'docs/media/diagram.png').parent.mkdir(parents=True, exist_ok=True)
        (output / 'docs/media/diagram.png').write_text('media')

        report = site.verify_output(self.root, site_url='https://fork-owner.github.io/renamed-repo/')
        self.assertEqual(report['sourceCommit'], 'b' * 40)

        (output / 'index.html').write_text('<a href="docs/wiki/Architecture/#missing">Broken</a>\n')
        with self.assertRaisesRegex(ValueError, 'missing site anchor'):
            site.verify_output(self.root, site_url='https://fork-owner.github.io/renamed-repo/')

    def test_output_rejects_unexpected_runtime_files_and_absolute_root_links(self):
        site.prepare_site(self.root, 'fork-owner/renamed-repo', 'c' * 40)
        output = self.root / '.runtime/docs-site/site'
        output.mkdir(parents=True)
        (output / 'source-commit.txt').write_text('c' * 40 + '\n')
        (output / 'index.html').write_text('<a href="/docs/wiki/Home/">Home</a>\n')
        (output / '.env').write_text('LITELLM_API_KEY=secret\n')
        (output / 'runtime/renderer-src').mkdir(parents=True)
        (output / 'runtime/renderer-src/implementation.js').write_text('private bundle')

        with self.assertRaisesRegex(ValueError, 'forbidden artifact file'):
            site.verify_output(self.root, site_url='https://fork-owner.github.io/renamed-repo/')

        (output / '.env').unlink()
        with self.assertRaisesRegex(ValueError, 'forbidden artifact file'):
            site.verify_output(self.root, site_url='https://fork-owner.github.io/renamed-repo/')

        (output / 'runtime/renderer-src/implementation.js').unlink()
        (output / 'runtime/renderer-src').rmdir()
        with self.assertRaisesRegex(ValueError, 'escapes site base path'):
            site.verify_output(self.root, site_url='https://fork-owner.github.io/renamed-repo/')

    def test_workflow_checks_every_pr_and_runs_parser_regression(self):
        workflow = (site.ROOT / '.github/workflows/docs-pages.yml').read_text()
        self.assertIn('  pull_request:\n', workflow)
        self.assertIn('  push:\n    branches: [main]\n', workflow)
        self.assertFalse(any(line.lstrip().startswith('paths:') for line in workflow.splitlines()))
        self.assertIn("test_docs_site_markdown.py", workflow)
        self.assertEqual(site.default_site_url('example-owner/renamed-repo'), 'https://example-owner.github.io/renamed-repo/')
        self.assertEqual(site.default_site_url('example-owner/example-owner.github.io'), 'https://example-owner.github.io/')


if __name__ == '__main__':
    unittest.main()

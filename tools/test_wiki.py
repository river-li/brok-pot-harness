"""Integration checks for documentation export across repository boundaries."""
import importlib.util
import json
from pathlib import Path
import tempfile
import unittest

spec = importlib.util.spec_from_file_location('export_wiki', Path(__file__).with_name('export-wiki.py'))
wiki = importlib.util.module_from_spec(spec)
spec.loader.exec_module(wiki)


class WikiExportTest(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name).resolve()
        for name, body in {
            'README.md': '# Project\n[Guide](docs/wiki/Home.md)\n',
            'README.zh.md': '# 中文\n[English](README.md)\n',
            'docs/wiki/Home.md': '# Home\n[API](Configuration.md#api-options)\n'
                '[Package](../../packages/example/README.md)\n[Code](../../src/main.ts)\n'
                '[Sources](../../src)\n![Demo](../media/demo.png)\n'
                '<img src="../media/demo.png" alt="Demo" />\n'
                '```md\n[Literal](not-a-page.md)\n```\n'
                '\n---\n[Documentation](Home.md) · [Project](../../README.md)\n',
            'docs/wiki/Configuration.md': '# Configuration\n## API options\n[Home](Home.md)\n',
            'docs/wiki/_Sidebar.md': '[Home](Home.md)\n',
            'docs/wiki/_Footer.md': '[Project](../../README.md)\n',
            'packages/example/README.md': '# Example\n[Code](../../src/main.ts)\n',
            'src/main.ts': 'export const example = true;\n',
            'AGENTS.md': '# Rules\nKeep source intact.\n',
            'vendor/upstream/README.md': '# 上游资源\n',
            'package.json': json.dumps({'scripts': {}}),
        }.items():
            p = self.root / name
            p.parent.mkdir(parents=True, exist_ok=True)
            p.write_text(body)
        p = self.root / 'docs/media/demo.png'
        p.parent.mkdir(parents=True, exist_ok=True)
        p.write_bytes(b'fixture-asset')
        self.docs = wiki.authored_docs(self.root)

    def test_export_routes_pages_sources_media_and_keeps_examples(self):
        self.assertGreater(wiki.validate(self.root, self.docs)['localLinks'], 0)
        output = self.root / '.runtime/wiki'
        wiki.export(self.root, output, 'example/project', 'release/docs', self.docs)
        home = (output / 'Home.md').read_text()
        self.assertIn('https://github.com/example/project/wiki/Configuration#api-options', home)
        self.assertIn('https://github.com/example/project/wiki/Package-example', home)
        self.assertIn('https://github.com/example/project/blob/release%2Fdocs/src/main.ts', home)
        self.assertIn('https://github.com/example/project/tree/release%2Fdocs/src', home)
        self.assertIn('https://raw.githubusercontent.com/wiki/example/project/assets/docs/media/demo.png', home)
        self.assertEqual((output / 'assets/docs/media/demo.png').read_bytes(), b'fixture-asset')
        self.assertIn('[Literal](not-a-page.md)', home)
        self.assertNotIn('[Documentation]', home)
        self.assertTrue((output / '_Sidebar.md').exists())
        self.assertTrue((output / '_Footer.md').exists())
        self.assertFalse((output / 'AGENTS.md').exists())
        self.assertFalse(any('zh' in p.name for p in output.glob('*.md')))
        self.assertEqual((self.root / 'README.md').read_text(), '# Project\n[Guide](docs/wiki/Home.md)\n')
        # Regeneration replaces only the exporter-owned output, including stale pages.
        (output / 'Obsolete.md').write_text('old')
        wiki.export(self.root, output, 'example/project', 'main', self.docs)
        self.assertFalse((output / 'Obsolete.md').exists())

    def test_missing_heading_and_english_policy_are_reported(self):
        (self.root / 'docs/wiki/Configuration.md').write_text('# 配置\n')
        with self.assertRaisesRegex(ValueError, 'non-English'):
            wiki.validate(self.root, self.docs)
        (self.root / 'docs/wiki/Configuration.md').write_text('# Configuration\n')
        with self.assertRaisesRegex(ValueError, 'missing heading anchor'):
            wiki.validate(self.root, self.docs)

    def test_protects_unowned_output_and_outside_links(self):
        output = self.root / '.runtime/wiki'
        output.mkdir(parents=True)
        (output / 'keep.txt').write_text('user data')
        with self.assertRaisesRegex(ValueError, 'not marked'):
            wiki.export(self.root, output, 'example/project', 'main', self.docs)
        self.assertEqual((output / 'keep.txt').read_text(), 'user data')
        with self.assertRaisesRegex(ValueError, 'dedicated'):
            wiki.export(self.root, self.root / '.runtime/data', 'example/project', 'main', self.docs)
        with self.assertRaisesRegex(ValueError, 'leaves repository'):
            wiki.local_target(self.root, self.root / 'README.md', '../../outside.md')

    def test_repository_selection_rejects_credentials_and_wrong_destination(self):
        self.assertEqual(wiki.repository_slug('git@github.com:example/project.git'), 'example/project')
        self.assertEqual(wiki.repository_slug('https://github.com/example/project'), 'example/project')
        for value in ['https://token@github.com/example/project', 'https://other.example/example/project', 'example/project.wiki.git']:
            with self.assertRaises(ValueError):
                wiki.repository_slug(value)

    def test_refuses_duplicate_page_names(self):
        extra = self.root / 'docs/wiki/Project.md'
        extra.write_text('# Duplicate\n')
        with self.assertRaisesRegex(ValueError, 'collision'):
            wiki.page_map(self.root, self.docs + [extra])


if __name__ == '__main__':
    unittest.main()

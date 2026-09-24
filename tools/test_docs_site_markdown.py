"""Render staged README details with the project's configured MkDocs parser."""
from html.parser import HTMLParser
import importlib.util
import os
from pathlib import Path
import unittest
from unittest.mock import patch
from urllib.parse import urljoin

from mkdocs.config import load_config
from mkdocs.structure.files import File, Files
from mkdocs.structure.pages import Page

site_spec = importlib.util.spec_from_file_location(
    'docs_site', Path(__file__).with_name('docs-site.py')
)
site = importlib.util.module_from_spec(site_spec)
site_spec.loader.exec_module(site)


class DetailsContent(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.depth = 0
        self.details = 0
        self.images = []
        self.links = []
        self.current_link = None

    def handle_starttag(self, tag, attrs):
        values = dict(attrs)
        if tag == 'details':
            self.details += 1
            self.depth += 1
        elif self.depth and tag == 'img':
            self.images.append(values)
        elif self.depth and tag == 'a':
            self.current_link = {'attrs': values, 'text': ''}
            self.links.append(self.current_link)

    def handle_endtag(self, tag):
        if tag == 'a':
            self.current_link = None
        elif tag == 'details' and self.depth:
            self.depth -= 1

    def handle_data(self, data):
        if self.current_link is not None:
            self.current_link['text'] += data


class DetailsMarkdownTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        with patch.dict(os.environ, site.site_environment(site.ROOT)):
            cls.config = load_config(config_file=str(site.ROOT / 'mkdocs.yml'))
        cls.docs_dir = Path(cls.config.docs_dir)
        if not cls.docs_dir.is_dir():
            raise RuntimeError('Run npm run docs:site:build before the details parser regression')
        if 'md_in_html' not in cls.config.markdown_extensions:
            raise RuntimeError('mkdocs.yml must enable the md_in_html extension')
        cls.site_url = cls.config.site_url
        cls.files = Files(
            File(
                path.relative_to(cls.docs_dir).as_posix(),
                str(cls.docs_dir),
                cls.config.site_dir,
                cls.config.use_directory_urls,
            )
            for path in cls.docs_dir.rglob('*')
            if path.is_file()
        )

    def assert_details_routes_media(self, uri):
        source_file = self.files.get_file_from_path(uri)
        self.assertIsNotNone(source_file)
        page = Page(None, source_file, self.config)
        page.markdown = source_file.content_string
        page.render(self.config, self.files)

        rendered = DetailsContent()
        rendered.feed(page.content)
        self.assertEqual(rendered.details, 1, uri)
        self.assertEqual(len(rendered.images), 1, uri)
        self.assertEqual(len(rendered.links), 1, uri)

        image_src = rendered.images[0].get('src')
        link = rendered.links[0]
        self.assertTrue(image_src, uri)
        expected_link_text = {
            'README.md': 'Recording details and reproduction',
            'README.zh.md': '媒体说明与复现方法',
        }[uri]
        self.assertEqual(link['text'].strip(), expected_link_text, uri)

        page_url = urljoin(self.site_url, page.url)
        expected_gif = urljoin(self.site_url, 'docs/media/agent-demo.gif')
        expected_notes = urljoin(self.site_url, 'docs/media/')
        self.assertEqual(urljoin(page_url, image_src), expected_gif, uri)
        self.assertEqual(urljoin(page_url, link['attrs'].get('href', '')), expected_notes, uri)

    def test_english_and_translated_details_render_and_resolve_under_site_base(self):
        self.assert_details_routes_media('README.md')
        self.assert_details_routes_media('README.zh.md')


if __name__ == '__main__':
    unittest.main()

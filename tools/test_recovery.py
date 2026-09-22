import importlib.util
from pathlib import Path
import tempfile
import unittest

spec = importlib.util.spec_from_file_location('recovery', Path(__file__).with_name('recover-bundles.py'))
r = importlib.util.module_from_spec(spec)
spec.loader.exec_module(r)


class RecoveryTests(unittest.TestCase):
    def test_unicode_byte_offsets_and_foreign_boundaries(self):
        data = ('// src/a.ts\nconst a = "中文";\n'
                '// ../node_modules/pkg/index.js\nvar thirdParty = 1;\n'
                '// raw-text:/repo/packages/p/script.sh\nvar text = `hi`;\n'
                '// src/a.ts\nconst b = 2;\n').encode()
        parts = r.split_bundle(data)
        self.assertEqual(len(parts), 4)
        for part in parts:
            self.assertEqual(data[part['startByte']:part['endByte']], part['body'])
        self.assertNotIn(b'thirdParty', parts[0]['body'])
        self.assertEqual(parts[-1]['startLine'], 8)
        self.assertIsNone(r.source_destination(parts[1]['source']))

    def test_paths(self):
        self.assertEqual(r.source_destination('src/host/worker.ts'), 'sand/src/host/worker.ts')
        self.assertEqual(r.source_destination('../packages/agent/src/worker.ts'), 'packages/agent/src/worker.ts')
        with self.assertRaises(ValueError):
            r.source_destination('../packages/../../outside.ts')

    def test_static_resource_unescaping(self):
        self.assertEqual(r.decode_literal(br'var x = `a\n\`\${x}\x21\u4e2d`;'), 'a\n`${x}!中')
        with self.assertRaises(ValueError):
            r.decode_literal(b'var x = `${execute()}`;')

    def test_variants_repeated_fragments_and_safe_rerun(self):
        with tempfile.TemporaryDirectory() as temp:
            root = Path(temp)
            bundles, project = root / 'bundles', root / 'project'
            bundles.mkdir()
            project.mkdir()
            (bundles / 'host-main.cjs').write_text('// src/a.ts\nvar a = 1;\n// src/a.ts\nvar b = 2;\n')
            (bundles / 'worker.js').write_text('// src/a.ts\nvar a = 3;\n')
            (bundles / 'plain.mjs').write_text('export const x = 1;\n')
            manifest = r.recover(bundles, project)
            self.assertEqual(manifest['moduleCount'], 1)
            self.assertEqual(manifest['files'][0]['variantCount'], 2)
            self.assertEqual(len(manifest['files'][0]['occurrences'][0]['fragments']), 2)
            self.assertEqual(r.recover(bundles, project), manifest)
            path = project / 'recovered/sand/src/a.ts'
            path.write_text('local edit')
            with self.assertRaises(RuntimeError):
                r.recover(bundles, project)
            self.assertEqual(path.read_text(), 'local edit')


if __name__ == '__main__':
    unittest.main()

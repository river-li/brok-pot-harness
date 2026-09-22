import importlib.util
from pathlib import Path
import shutil
import subprocess
import tempfile
import unittest
import json
import os

spec = importlib.util.spec_from_file_location('build', Path(__file__).parents[1] / 'tools/build-bundles.py')
b = importlib.util.module_from_spec(spec)
spec.loader.exec_module(b)


def recover_fixture(originals, project):
    manifest = b.recovery.recover(originals, project)
    for file in manifest['files']:
        for occurrence in file['occurrences']:
            source = project / 'recovered' / occurrence['output']
            target = project / occurrence['output']
            target.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(source, target)
    (project / 'reconstruction-manifest.json').write_text(json.dumps(manifest))
    (project / 'sand-host').mkdir(exist_ok=True)
    shutil.copytree(originals, project / 'sand-host', dirs_exist_ok=True)
    (project / 'vendor/deps').mkdir(parents=True, exist_ok=True)


class BuildTests(unittest.TestCase):
    def test_profiles_keep_original_paths_and_select_mode_before_entrypoint(self):
        with tempfile.TemporaryDirectory() as directory:
            project = Path(directory)
            originals = project / 'vendor/release/sand-host'
            originals.mkdir(parents=True)
            (project / 'vendor/release/deps').mkdir()
            text = ('// ../packages/grok-bot-harness/src/config.ts\n'
                    'function originalAccount() { return "original-account-path"; }\n'
                    'console.log(process.env.GROKBOT_LOCAL_MODE === "1" ? "local-workspace" : originalAccount());\n')
            (originals / 'host-main.cjs').write_text(text)
            recover_fixture(originals, project)
            # Native source paths are installed by recover_fixture.
            for profile, expected, conflicting in [('local', 'local-workspace', '0'), ('original', 'original-account-path', '1')]:
                target = project / profile
                b.build(target, project, profile=profile)
                entry = target / 'sand-host/host-main.cjs'
                self.assertIn(text, entry.read_text(), 'Both builds must retain the same original implementation')
                result = subprocess.run(['node', str(entry)], env={**os.environ, 'GROKBOT_LOCAL_MODE': conflicting},
                                        text=True, capture_output=True, check=True)
                self.assertEqual(result.stdout.strip(), expected, 'The built profile must take precedence over stale launch environments')
                config = json.loads((target / 'build-manifest.json').read_text())['configuration']
                self.assertEqual(config['profile'], profile)
                for feature in ['vendorLogin', 'billing', 'cloudProvisioning', 'remoteSync']:
                    self.assertEqual(config['features'][feature], profile == 'original')
            with self.assertRaises(ValueError):
                b.build(project / 'bad', project, profile='typo')

    def test_exact_roundtrip_then_run_changed_source_and_resource(self):
        with tempfile.TemporaryDirectory() as directory:
            project = Path(directory)
            originals = project / 'vendor/release/sand-host'
            originals.mkdir(parents=True)
            (project / 'vendor/release/deps').mkdir()
            text = ('// ../packages/grok-bot-harness/src/config.ts\n'
                    'var value = 1;\n'
                    '// raw-text:/repo/packages/grok-bot-harness/src/message.mjs\n'
                    'var message = `hello`;\nconsole.log(value, message);\n')
            (originals / 'host-main.cjs').write_text(text)
            recover_fixture(originals, project)
            # Native source paths are installed by recover_fixture.
            target = project / 'out'
            b.build(target, project)
            self.assertEqual((target / 'sand-host/host-main.cjs').read_text(), text)
            source = project / 'packages/grok-bot-harness/src/config.ts'
            source.write_text(source.read_text().replace('value = 1', 'value = 2'))
            (project / 'packages/grok-bot-harness/src/message.mjs').write_text('edited script')
            b.build(target, project)
            result = subprocess.run(['node', str(target / 'sand-host/host-main.cjs')], text=True, capture_output=True, check=True)
            self.assertEqual(result.stdout.strip(), '2 edited script')


if __name__ == '__main__':
    unittest.main()

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
profile_spec = importlib.util.spec_from_file_location('build_profile', Path(__file__).parents[1] / 'tools/build_profile.py')
build_profile = importlib.util.module_from_spec(profile_spec)
profile_spec.loader.exec_module(build_profile)


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
    def test_generated_bootstrap_confines_local_network_and_preserves_original_profile(self):
        tracked = [
            'GROKBOT_LOCAL_MODE', 'SAND_BACKEND_URL', 'CURSOR_API_BASE_URL',
            'SAND_HOST_GATEWAY_URL', 'SAND_DEV_BOX_CONTROL_PLANE',
            'SAND_ATTACH_PROD_BOX', 'SAND_DEV_CONTROL_PORT',
            'SAND_DISABLE_TELEMETRY', 'SAND_DISABLE_ANALYTICS',
        ]

        def run_bootstrap(profile, values):
            with tempfile.TemporaryDirectory() as directory:
                output = Path(directory)
                build_profile.write_bootstrap(output, build_profile.configuration(profile))
                probe = output / 'probe.cjs'
                probe.write_text(
                    'const config = require("./build-profile.cjs");\n'
                    'const keys = ' + json.dumps(tracked) + ';\n'
                    'console.log(JSON.stringify({profile: config.profile, features: config.features, env: Object.fromEntries(keys.map(key => [key, process.env[key] ?? null]))}));\n'
                )
                env = os.environ.copy()
                for key in tracked:
                    env.pop(key, None)
                env.update(values)
                result = subprocess.run(['node', str(probe)], env=env, text=True, capture_output=True, check=True)
                return json.loads(result.stdout)

        local = run_bootstrap('local', {
            'GROKBOT_LOCAL_MODE': '0',
            'SAND_BACKEND_URL': 'https://api2.cursor.sh',
            'CURSOR_API_BASE_URL': 'https://api2.cursor.sh',
            'SAND_DEV_BOX_CONTROL_PLANE': '1',
            'SAND_ATTACH_PROD_BOX': '1',
            'SAND_DEV_CONTROL_PORT': '1541',
            'SAND_DISABLE_TELEMETRY': '0',
            'SAND_DISABLE_ANALYTICS': '0',
        })
        self.assertEqual(local['profile'], 'local')
        self.assertFalse(local['features']['cloudProvisioning'])
        self.assertEqual(local['env']['GROKBOT_LOCAL_MODE'], '1')
        self.assertEqual(local['env']['SAND_BACKEND_URL'], 'http://127.0.0.1:9')
        self.assertEqual(local['env']['CURSOR_API_BASE_URL'], 'http://127.0.0.1:9')
        self.assertEqual(local['env']['SAND_HOST_GATEWAY_URL'], 'http://127.0.0.1:1540')
        self.assertEqual(local['env']['SAND_DEV_BOX_CONTROL_PLANE'], '0')
        self.assertEqual(local['env']['SAND_ATTACH_PROD_BOX'], '0')
        self.assertEqual(local['env']['SAND_DEV_CONTROL_PORT'], '0')
        self.assertEqual(local['env']['SAND_DISABLE_TELEMETRY'], '1')
        self.assertEqual(local['env']['SAND_DISABLE_ANALYTICS'], '1')

        custom_host = 'https://gbh.example.test:1840'
        local_custom = run_bootstrap('local', {
            'SAND_HOST_GATEWAY_URL': custom_host,
            'CURSOR_API_BASE_URL': 'https://api2.cursor.sh',
        })
        self.assertEqual(local_custom['env']['SAND_HOST_GATEWAY_URL'], custom_host)
        self.assertEqual(local_custom['env']['SAND_BACKEND_URL'], 'http://127.0.0.1:9')

        original = run_bootstrap('original', {
            'GROKBOT_LOCAL_MODE': '1',
            'CURSOR_API_BASE_URL': 'https://api2.cursor.sh',
            'SAND_DEV_BOX_CONTROL_PLANE': '1',
            'SAND_ATTACH_PROD_BOX': '1',
            'SAND_DISABLE_TELEMETRY': '0',
            'SAND_DISABLE_ANALYTICS': '0',
        })
        self.assertEqual(original['profile'], 'original')
        self.assertTrue(original['features']['cloudProvisioning'])
        self.assertEqual(original['env']['GROKBOT_LOCAL_MODE'], '0')
        self.assertIsNone(original['env']['SAND_BACKEND_URL'])
        self.assertEqual(original['env']['CURSOR_API_BASE_URL'], 'https://api2.cursor.sh')
        self.assertIsNone(original['env']['SAND_HOST_GATEWAY_URL'])
        self.assertEqual(original['env']['SAND_DEV_BOX_CONTROL_PLANE'], '1')
        self.assertEqual(original['env']['SAND_ATTACH_PROD_BOX'], '1')
        self.assertEqual(original['env']['SAND_DISABLE_TELEMETRY'], '0')
        self.assertEqual(original['env']['SAND_DISABLE_ANALYTICS'], '0')

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

import importlib.util
import json
from pathlib import Path
import shutil
import subprocess
import sys
import tempfile
import unittest


ROOT = Path(__file__).resolve().parents[1]
SCRIPT = Path(__file__).with_name('recovery-impact.py')
spec = importlib.util.spec_from_file_location('recovery_impact', SCRIPT)
ri = importlib.util.module_from_spec(spec)
spec.loader.exec_module(ri)


class RecoveryImpactTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.actual = ri.RecoveryIndex(ROOT)
        cls.harness_path = 'packages/grok-bot-harness/src/runner/sand-agent-runner.ts'
        cls.host_path = 'src/host/host-gateway-api.ts'

    def cli(self, *args, root=None):
        command = [sys.executable, str(SCRIPT)]
        if args and args[0] in ('map', 'impact', 'check'):
            command.extend(args[:1])
            command.extend(['--root', str(root or ROOT)])
            command.extend(args[1:])
        return subprocess.run(command, check=False, text=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)

    def fixture(self, root: Path, logical_paths):
        manifest_paths = set()
        for path in logical_paths:
            manifest_paths.update(entry['file']['path'] for entry in self.actual.resolve_source(path))
        selected = [record for record in self.actual.files if record['path'] in manifest_paths]
        self.assertEqual({record['path'] for record in selected}, manifest_paths)
        for record in selected:
            for occurrence in record['occurrences']:
                output = occurrence['output']
                target = root / output
                target.parent.mkdir(parents=True, exist_ok=True)
                shutil.copy2(ROOT / output, target)
        (root / 'runtime').mkdir(parents=True, exist_ok=True)
        shutil.copy2(ROOT / 'runtime/build-profiles.json', root / 'runtime/build-profiles.json')
        # Keep the real manifest index so impact can report untouched neighboring fragments.
        shutil.copy2(ROOT / ri.MANIFEST_NAME, root / ri.MANIFEST_NAME)
        subprocess.run(['git', '-C', str(root), 'init', '-q'], check=True)
        subprocess.run(['git', '-C', str(root), 'config', 'user.email', 'recovery-impact@example.invalid'], check=True)
        subprocess.run(['git', '-C', str(root), 'config', 'user.name', 'Recovery Impact Tests'], check=True)
        subprocess.run(['git', '-C', str(root), 'add', '-A'], check=True)
        subprocess.run(['git', '-C', str(root), 'commit', '-qm', 'fixture baseline'], check=True)
        return selected

    def test_maps_real_manifest_paths_offsets_and_symbol(self):
        entries = self.actual.resolve_source(self.harness_path)
        self.assertEqual({entry['occurrence']['bundle'] for entry in entries},
                         {'host-main.cjs', 'sand-eval-runner.cjs'})
        self.assertTrue(any(entry['file']['variantCount'] == 2 for entry in entries))

        occurrence = next(entry['occurrence'] for entry in entries if entry['occurrence']['bundle'] == 'host-main.cjs')
        offset = occurrence['fragments'][0]['startByte']
        mapped = self.cli('map', '--artifact', 'host-main.cjs', '--offset', str(offset))
        self.assertEqual(mapped.returncode, 0, mapped.stderr)
        self.assertIn(self.harness_path, mapped.stdout)
        self.assertIn('fragment 1/2', mapped.stdout)
        self.assertIn('baseline byte offset', mapped.stdout)

        by_symbol = self.cli('map', '--symbol', 'SandAgentRunner')
        self.assertEqual(by_symbol.returncode, 0, by_symbol.stderr)
        self.assertIn('SandAgentRunner', by_symbol.stdout)
        self.assertIn('sand-eval-runner.cjs', by_symbol.stdout)

        host_entries = self.actual.resolve_source(self.host_path)
        self.assertTrue(host_entries)
        self.assertEqual(host_entries[0]['occurrence']['bundle'], 'host-main.cjs')

        standalone_path = 'reconstruction/standalone/sand-host/box-scripts/box-bounded-log.mjs'
        standalone = self.cli('map', '--source', standalone_path)
        self.assertEqual(standalone.returncode, 0, standalone.stderr)
        self.assertIn('Maintained standalone', standalone.stdout)
        standalone_offset = self.cli('map', '--artifact', 'box-scripts/box-bounded-log.mjs', '--offset', '10')
        self.assertEqual(standalone_offset.returncode, 0, standalone_offset.stderr)
        self.assertIn(standalone_path, standalone_offset.stdout)

    def test_impact_maps_changed_harness_and_host_fragments_to_artifacts_and_checks(self):
        with tempfile.TemporaryDirectory() as temporary:
            root = Path(temporary)
            selected = self.fixture(root, {self.harness_path, self.host_path})
            for record in selected:
                for occurrence in record['occurrences']:
                    path = root / occurrence['output']
                    with path.open('ab') as source:
                        source.write(b'\n// issue-16 impact fixture edit\n')
            report = self.cli('impact', '--base=HEAD^{tree}', root=root)
            self.assertEqual(report.returncode, 0, report.stderr + '\n' + report.stdout)
            self.assertIn('host-main.cjs', report.stdout)
            self.assertIn('sand-eval-runner.cjs', report.stdout)
            self.assertIn('.runtime/build/sand-host/host-main.cjs', report.stdout)
            self.assertIn('.runtime/build-original/sand-host/host-main.cjs', report.stdout)
            self.assertIn('localWorkspace=true', report.stdout)
            self.assertIn('localWorkspace=false', report.stdout)
            self.assertIn('agent-sandbox.cjs', report.stdout)
            self.assertIn('runtime/tests/gateway.cjs', report.stdout)
            self.assertIn('npm run test:recovery', report.stdout)
            self.assertIn('Profile conditions', report.stdout)
            self.assertIn('neighboring interfaces', report.stdout)

    def test_option_like_base_is_rejected_without_creating_a_diff_output(self):
        with tempfile.TemporaryDirectory() as temporary:
            root = Path(temporary) / 'checkout'
            root.mkdir()
            self.fixture(root, {self.harness_path})
            output = Path(temporary) / 'should-not-be-created'
            result = self.cli('impact', f'--base=--output={output}', root=root)
            self.assertEqual(result.returncode, 2, result.stdout + result.stderr)
            self.assertFalse(output.exists())
            self.assertIn('Cannot read diff', result.stderr)

    def test_ignored_runtime_build_drift_is_checked_without_changed_paths(self):
        with tempfile.TemporaryDirectory() as temporary:
            root = Path(temporary)
            baseline = b'release artifact'
            expected_build = b'clean built artifact'
            (root / '.gitignore').write_text('.runtime/\n')
            (root / 'sand-host').mkdir()
            (root / 'sand-host/host-main.cjs').write_bytes(baseline)
            (root / 'runtime').mkdir()
            (root / 'runtime/build-profiles.json').write_text('{"profiles": {}}\n')
            manifest = {
                'files': [],
                'bundles': [{'path': 'host-main.cjs', 'bytes': len(baseline), 'sha256': ri.digest(baseline)}],
            }
            (root / ri.MANIFEST_NAME).write_text(json.dumps(manifest))
            config = {'features': {'localWorkspace': True}}
            build = root / '.runtime/build/sand-host'
            build.mkdir(parents=True)
            (build / 'build-profile.json').write_text(json.dumps(config, indent=2) + '\n')
            (build / 'build-profile.cjs').write_text(
                '// Generated from runtime/build-profiles.json. Rebuild to change mode.\n'
                f'const config = {json.dumps(config, separators=(",", ":"))};\n'
                'Object.freeze(config.features);\nObject.freeze(config);\n'
                'process.env.GROKBOT_LOCAL_MODE = config.features.localWorkspace ? "1" : "0";\n'
                'module.exports = config;\n'
            )
            (build / 'host-main.cjs').write_bytes(b'manually edited artifact')
            (root / '.runtime/build/build-manifest.json').write_text(json.dumps({
                'configuration': config,
                'bundles': [{'path': 'host-main.cjs', 'sha256': ri.digest(expected_build)}],
            }))
            subprocess.run(['git', '-C', str(root), 'init', '-q'], check=True)
            subprocess.run(['git', '-C', str(root), 'config', 'user.email', 'recovery-impact@example.invalid'], check=True)
            subprocess.run(['git', '-C', str(root), 'config', 'user.name', 'Recovery Impact Tests'], check=True)
            subprocess.run(['git', '-C', str(root), 'add', '-A'], check=True)
            subprocess.run(['git', '-C', str(root), 'commit', '-qm', 'fixture baseline'], check=True)

            result = self.cli('impact', root=root)
            self.assertEqual(result.returncode, 1, result.stdout + result.stderr)
            self.assertIn('No changed paths.', result.stdout)
            self.assertIn('.runtime/build/sand-host/host-main.cjs differs from build-manifest.json', result.stdout)

    def test_marker_order_failure_is_reported_by_source_check(self):
        with tempfile.TemporaryDirectory() as temporary:
            root = Path(temporary)
            self.fixture(root, {self.harness_path})
            source = root / self.harness_path
            contents = source.read_bytes()
            self.assertIn(b'// @recovered-fragment 1/2\n', contents)
            source.write_bytes(contents.replace(b'// @recovered-fragment 1/2\n',
                                                b'// @recovered-fragment 2/2\n', 1))
            result = self.cli('check', '--source', self.harness_path, root=root)
            self.assertEqual(result.returncode, 1, result.stdout + result.stderr)
            self.assertIn('marker is 2/2; expected 1/2', result.stdout)

    def test_import_candidate_is_advisory_and_never_blocks_impact(self):
        with tempfile.TemporaryDirectory() as temporary:
            root = Path(temporary)
            self.fixture(root, {self.harness_path})
            source = root / self.harness_path
            with source.open('ab') as output:
                output.write(b'\nimport { guessedThing } from "./guessed.js";\n')
            result = self.cli('impact', root=root)
            self.assertEqual(result.returncode, 0, result.stderr + '\n' + result.stdout)
            self.assertIn('Possible standalone imports', result.stdout)
            self.assertIn('never blocks', result.stdout)

    def test_immutable_baseline_edits_are_reported_in_impact(self):
        with tempfile.TemporaryDirectory() as temporary:
            root = Path(temporary)
            self.fixture(root, {self.host_path})
            baseline = root / 'sand-host' / 'edited-bundle.cjs'
            baseline.parent.mkdir(parents=True)
            baseline.write_text('accidental edit')
            result = self.cli('impact', root=root)
            self.assertEqual(result.returncode, 1, result.stdout + result.stderr)
            self.assertIn('sand-host is the immutable release baseline', result.stdout)

    def test_generated_build_integrity_detects_manual_artifact_edit(self):
        with tempfile.TemporaryDirectory() as temporary:
            root = Path(temporary)
            (root / 'sand-host').mkdir()
            (root / 'sand-host/host-main.cjs').write_bytes(b'release')
            (root / '.runtime/build/sand-host').mkdir(parents=True)
            built = root / '.runtime/build/sand-host/host-main.cjs'
            built.write_bytes(b'manually edited')
            baseline_digest = ri.digest(b'release')
            build_digest = ri.digest(b'built')
            (root / ri.MANIFEST_NAME).write_text(json.dumps({
                'bundles': [{'path': 'host-main.cjs', 'bytes': 7, 'sha256': baseline_digest}],
            }))
            (root / '.runtime/build/build-manifest.json').write_text(json.dumps({
                'bundles': [{'path': 'host-main.cjs', 'sha256': build_digest}],
            }))
            errors = ri.verify_runtime_build(root)
            self.assertTrue(any('differs from build-manifest.json' in error for error in errors), errors)


if __name__ == '__main__':
    unittest.main()

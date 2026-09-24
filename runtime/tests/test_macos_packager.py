import importlib.util
import json
import subprocess
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch


PACKAGER_PATH = Path(__file__).parents[1] / "tools" / "package-macos.py"
SPEC = importlib.util.spec_from_file_location("package_macos", PACKAGER_PATH)
PACKAGER = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(PACKAGER)


class MacPackagerElectronPathTests(unittest.TestCase):
    def test_first_run_download_output_does_not_corrupt_electron_path(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            electron_package = root / "runtime/node_modules/electron"
            electron_package.mkdir(parents=True)
            self.assertFalse((electron_package / "path.txt").exists())

            executable = root / "Electron.app/Contents/MacOS/Electron"
            executable.parent.mkdir(parents=True)
            executable.write_text("fixture executable")

            completed = subprocess.CompletedProcess(
                ["node"],
                0,
                stdout=(
                    "Downloading Electron binary...\n"
                    + PACKAGER.ELECTRON_PATH_MARKER
                    + json.dumps(str(executable))
                    + "\n"
                ),
                stderr="",
            )
            with patch.object(PACKAGER.subprocess, "run", return_value=completed) as run:
                resolved = PACKAGER.resolve_electron_executable(root)

        self.assertEqual(resolved, executable)
        self.assertTrue(run.call_args.kwargs["check"])
        self.assertTrue(run.call_args.kwargs["capture_output"])

    def test_missing_path_marker_is_a_packaging_error(self):
        completed = subprocess.CompletedProcess(
            ["node"], 0, stdout="Downloading Electron binary...\n", stderr=""
        )
        with patch.object(PACKAGER.subprocess, "run", return_value=completed):
            with self.assertRaisesRegex(RuntimeError, "one executable path"):
                PACKAGER.resolve_electron_executable(Path("/tmp/fresh-electron-install"))

    def test_remote_release_resources_include_notices_and_sanitized_provenance(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            resources = root / "Remote.app/Contents/Resources"
            electron_dist = root / "electron/dist"
            resources.mkdir(parents=True)
            electron_dist.mkdir(parents=True)
            (root / "release").mkdir()
            (root / "vendor/desktop").mkdir(parents=True)
            (root / "release/RESOURCE-NOTICES.md").write_text("Notice inventory\n")
            (root / "release/RELEASE-NOTES.md").write_text("Preview notes\n")
            (electron_dist / "LICENSE").write_text("Electron license\n")
            (electron_dist / "LICENSES.chromium.html").write_text("Chromium licenses\n")
            (root / "vendor/desktop/import-manifest.json").write_text(json.dumps({
                "source": "/Applications/Grok Bot.app/Contents/Resources/app.asar",
                "version": "0.44.0",
                "sha256": "a" * 64,
                "files": [{"path": "index.js", "sha256": "b" * 64, "bytes": 9}],
            }))

            manifest = PACKAGER.write_release_resources(
                resources, "0.1.0-preview.1", "c" * 40, True, "arm64", "42.11.6", electron_dist, root
            )
            stored = json.loads((resources / "GBH-Release-Manifest.json").read_text())
            provenance = json.loads((resources / "GBH-Retained-Desktop-Provenance.json").read_text())

            self.assertEqual(provenance["files"][0]["path"], "index.js")
            self.assertNotIn("/Applications", json.dumps(provenance))
            self.assertTrue((resources / "Electron-LICENSE").is_file())
            self.assertTrue((resources / "Chromium-LICENSES.html").is_file())
            self.assertTrue((resources / "GBH-Release-Notes.md").is_file())
            self.assertEqual(manifest["compatibilityId"], "gbh-remote-v1")
            self.assertEqual(manifest["sourceCommit"], "c" * 40)
            self.assertEqual(manifest["electronVersion"], "42.11.6")
            self.assertEqual(manifest["clientPlatform"], "macos/arm64")
            self.assertEqual(stored["retainedDesktopSha256"], "a" * 64)

    def test_candidate_bundle_version_uses_product_version(self):
        info = {"CFBundleVersion": "42.11.6"}
        PACKAGER.set_candidate_bundle_version(info, "0.1.0-preview.1")
        self.assertEqual(info["CFBundleVersion"], "1")
        self.assertEqual(info["CFBundleShortVersionString"], "0.1.0")


if __name__ == "__main__":
    unittest.main()

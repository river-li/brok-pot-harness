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


if __name__ == "__main__":
    unittest.main()

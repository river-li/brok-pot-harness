"""Regression tests for scoped maintenance-guidance discovery."""
import importlib.util
from contextlib import redirect_stdout
from io import StringIO
from pathlib import Path
import tempfile
import unittest

spec = importlib.util.spec_from_file_location(
    "check_guidance", Path(__file__).with_name("check-guidance.py")
)
check_guidance = importlib.util.module_from_spec(spec)
spec.loader.exec_module(check_guidance)


class GuidanceCheckTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name)

    def add_component(self, relative, source_name="index.ts", with_guide=True):
        directory = self.root / relative
        directory.mkdir(parents=True)
        (directory / "README.md").write_text("# Component\n")
        (directory / source_name).write_text("export {};\n")
        if with_guide:
            (directory / "AGENTS.md").write_text("# Maintenance\n")
        return Path(relative)

    def run_checker(self):
        output = StringIO()
        with redirect_stdout(output):
            status = check_guidance.main(self.root)
        return status, output.getvalue()

    def test_owned_component_with_guide_passes(self):
        self.add_component("src/owned")

        status, output = self.run_checker()

        self.assertEqual(status, 0)
        self.assertIn("1 README-declared source components", output)

    def test_owned_component_without_guide_is_reported(self):
        component = self.add_component("packages/new-component", with_guide=False)

        status, output = self.run_checker()

        self.assertEqual(status, 1)
        self.assertIn(str(component), output)
        self.assertIn("Add component-specific maintenance guidance", output)
        self.assertNotIn("remove the README", output)

    def test_dependencies_and_generated_paths_are_pruned_but_dist_source_is_kept(self):
        dependency = self.root / "runtime/node_modules/example-dependency"
        generated = self.root / "runtime/.runtime/build/generated-component"
        for directory in (dependency, generated):
            directory.mkdir(parents=True)
            (directory / "README.md").write_text("# Third party or generated\n")
            (directory / "index.js").write_text("module.exports = {};\n")

        maintained_dist = self.add_component(
            "packages/recovered-package/dist", "module.js", with_guide=False
        )

        status, output = self.run_checker()

        self.assertEqual(status, 1)
        self.assertIn(str(maintained_dist), output)
        self.assertNotIn("node_modules", output)
        self.assertNotIn(".runtime", output)


if __name__ == "__main__":
    unittest.main()

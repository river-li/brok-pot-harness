"""Regression tests for PR-base enforcement, event diff selection, and gate failures."""

import importlib.util
import os
from pathlib import Path
import subprocess
import tempfile
import unittest
from unittest.mock import patch


ROOT = Path(__file__).resolve().parent
SCRIPT = ROOT / "ci/run-required-gates.py"
SPEC = importlib.util.spec_from_file_location("run_required_gates", SCRIPT)
CI = importlib.util.module_from_spec(SPEC)
assert SPEC and SPEC.loader
SPEC.loader.exec_module(CI)
STAGED_SCRIPT = ROOT / "ci/check-staged.py"
INSTALLER_SCRIPT = ROOT / "install-pre-commit.py"


def git(repo: Path, *args: str) -> str:
    result = subprocess.run(
        ["git"] + list(args), cwd=repo, check=True, capture_output=True, text=True
    )
    return result.stdout.strip()


def commit_file(repo: Path, name: str, content: str, message: str) -> str:
    destination = repo / name
    destination.parent.mkdir(parents=True, exist_ok=True)
    destination.write_text(content, encoding="utf-8")
    git(repo, "add", name)
    git(repo, "commit", "-m", message)
    return git(repo, "rev-parse", "HEAD")


class RequiredGateTests(unittest.TestCase):
    def setUp(self) -> None:
        self.temporary = tempfile.TemporaryDirectory(prefix="gbh-ci-gates-")
        self.addCleanup(self.temporary.cleanup)
        self.repo = Path(self.temporary.name)
        git(self.repo, "init", "--quiet")
        git(self.repo, "symbolic-ref", "HEAD", "refs/heads/main")
        git(self.repo, "config", "user.name", "CI Gate Test")
        git(self.repo, "config", "user.email", "ci-gate-test@example.invalid")
        self.base = commit_file(self.repo, "base.txt", "baseline\n", "baseline")
        self.add_origin_main()

    def add_origin_main(self, commit: str = "") -> None:
        git(self.repo, "update-ref", "refs/remotes/origin/main", commit or self.base)

    def pr_context(self, base: str, head: str, base_ref: str = "main") -> dict:
        return {
            "CI_DEFAULT_BRANCH": "main",
            "CI_PR_BASE_REF": base_ref,
            "CI_PR_BASE_SHA": base,
            "CI_PR_HEAD_SHA": head,
        }

    def test_current_main_pr_base_and_descendant_head_pass(self) -> None:
        git(self.repo, "checkout", "--quiet", "-b", "feature")
        head = commit_file(self.repo, "feature.txt", "change\n", "feature")

        error = CI.validate_pr_base("pull_request", self.pr_context(self.base, head), self.repo)

        self.assertIsNone(error)

    def test_non_main_base_is_rejected(self) -> None:
        error = CI.validate_pr_base(
            "pull_request", self.pr_context(self.base, self.base, "agent/other-pr"), self.repo
        )

        self.assertEqual(error, "pull request base must be main; got agent/other-pr")

    def test_pr_base_validation_command_exits_nonzero_for_stacked_target(self) -> None:
        environment = dict(os.environ)
        environment.update({
            "CI_EVENT": "pull_request",
            "CI_DEFAULT_BRANCH": "main",
            "CI_PR_BASE_REF": "agent/other-pr",
        })
        result = subprocess.run(
            ["python3", str(SCRIPT), "--validate-pr-base"],
            cwd=ROOT,
            env=environment,
            check=False,
            capture_output=True,
            text=True,
        )

        self.assertNotEqual(result.returncode, 0)
        self.assertIn("base must be main", result.stderr)

    def test_outdated_base_sha_is_rejected(self) -> None:
        current_main = commit_file(self.repo, "main-update.txt", "current\n", "advance main")
        self.add_origin_main(current_main)

        error = CI.validate_pr_base(
            "pull_request", self.pr_context(self.base, current_main), self.repo
        )

        self.assertEqual(error, "pull request base commit does not match current origin/main")

    def test_pr_head_must_include_current_main(self) -> None:
        git(self.repo, "checkout", "--quiet", "-b", "feature")
        old_head = commit_file(self.repo, "feature.txt", "change\n", "feature from old main")
        git(self.repo, "checkout", "--quiet", "main")
        current_main = commit_file(self.repo, "main-update.txt", "current\n", "advance main")
        self.add_origin_main(current_main)

        error = CI.validate_pr_base(
            "pull_request", self.pr_context(current_main, old_head), self.repo
        )

        self.assertEqual(
            error, "pull request head does not include current origin/main; update from main before review"
        )

    def test_pull_request_diff_uses_source_head_and_records_merge_checkout(self) -> None:
        git(self.repo, "checkout", "--quiet", "-b", "feature")
        pr_head = commit_file(self.repo, "feature.txt", "change\n", "feature change")
        git(self.repo, "checkout", "--quiet", "main")
        git(self.repo, "merge", "--no-ff", "feature", "-m", "synthetic PR merge")
        merge_checkout = git(self.repo, "rev-parse", "HEAD")

        command, description, details, error = CI.select_diff_command(
            "pull_request",
            {
                "CI_EVENT_SHA": merge_checkout,
                "CI_PR_BASE_REF": "main",
                "CI_PR_BASE_SHA": self.base,
                "CI_PR_HEAD_SHA": pr_head,
                "CI_DEFAULT_BRANCH": "main",
            },
            self.repo,
        )

        self.assertIsNone(error)
        self.assertEqual(command, ["git", "diff", "--check", "{}...{}".format(self.base, pr_head)])
        self.assertIn("pull request source diff", description)
        self.assertEqual(details["checked_out_commit"], merge_checkout)
        self.assertEqual(details["pull_request_head"], pr_head)

    def test_normal_push_uses_before_and_checked_out_head(self) -> None:
        head = commit_file(self.repo, "pushed.txt", "pushed\n", "pushed")

        command, _, details, error = CI.select_diff_command(
            "push",
            {"CI_EVENT_SHA": head, "CI_BEFORE_SHA": self.base},
            self.repo,
        )

        self.assertIsNone(error)
        self.assertEqual(command, ["git", "diff", "--check", self.base, head])
        self.assertEqual(details["diff_head"], head)

    def test_new_branch_push_uses_default_branch_common_base(self) -> None:
        git(self.repo, "checkout", "--quiet", "-b", "new-branch")
        head = commit_file(self.repo, "new-branch.txt", "branch\n", "new branch")

        command, description, details, error = CI.select_diff_command(
            "push",
            {
                "CI_EVENT_SHA": head,
                "CI_BEFORE_SHA": "0" * 40,
                "CI_DEFAULT_BRANCH": "main",
            },
            self.repo,
        )

        self.assertIsNone(error)
        self.assertEqual(command, ["git", "diff", "--check", self.base, head])
        self.assertIn("new branch", description)
        self.assertEqual(details["diff_base"], self.base)

    def test_manual_dispatch_uses_default_branch_common_base(self) -> None:
        git(self.repo, "checkout", "--quiet", "-b", "manual-check")
        head = commit_file(self.repo, "manual.txt", "manual\n", "manual change")

        command, description, details, error = CI.select_diff_command(
            "workflow_dispatch",
            {"CI_EVENT_SHA": head, "CI_DEFAULT_BRANCH": "main"},
            self.repo,
        )

        self.assertIsNone(error)
        self.assertEqual(command, ["git", "diff", "--check", self.base, head])
        self.assertIn("manual dispatch", description)
        self.assertEqual(details["checked_out_commit"], head)

    def test_bad_pull_request_ref_fails_without_fallback(self) -> None:
        command, _, _, error = CI.select_diff_command(
            "pull_request",
            self.pr_context("not-a-commit", self.base),
            self.repo,
        )

        self.assertIsNone(command)
        self.assertEqual(error, "pull request base SHA is not a full commit SHA")

    def test_unsupported_event_fails(self) -> None:
        command, _, _, error = CI.select_diff_command("pull_request_target", {}, self.repo)

        self.assertIsNone(command)
        self.assertEqual(error, "unsupported CI event")

    def test_root_commit_is_compared_with_empty_tree(self) -> None:
        root_only = tempfile.TemporaryDirectory(prefix="gbh-ci-root-")
        self.addCleanup(root_only.cleanup)
        repo = Path(root_only.name)
        git(repo, "init", "--quiet")
        git(repo, "symbolic-ref", "HEAD", "refs/heads/main")
        git(repo, "config", "user.name", "CI Gate Test")
        git(repo, "config", "user.email", "ci-gate-test@example.invalid")
        head = commit_file(repo, "root.txt", "root commit\n", "root commit")
        git(repo, "update-ref", "refs/remotes/origin/main", head)
        empty = git(repo, "hash-object", "-t", "tree", "/dev/null")

        command, description, details, error = CI.select_diff_command(
            "push",
            {
                "CI_EVENT_SHA": head,
                "CI_BEFORE_SHA": "0" * 40,
                "CI_DEFAULT_BRANCH": "main",
            },
            repo,
        )

        self.assertIsNone(error)
        self.assertEqual(command, ["git", "diff", "--check", empty, head])
        self.assertIn("root commit against empty tree", description)
        self.assertEqual(details["diff_head"], head)

    def test_whitespace_error_fails_selected_push_range(self) -> None:
        head = commit_file(self.repo, "bad.txt", "trailing space \n", "bad whitespace")
        environment = {
            "CI_EVENT": "push",
            "CI_EVENT_SHA": head,
            "CI_BEFORE_SHA": self.base,
            "GITHUB_ACTIONS": "true",
        }

        _, _, details, error = CI.select_diff_command("push", environment, self.repo)
        self.assertIsNone(error)

        def run_capture(label, command):
            result = subprocess.run(command, cwd=self.repo, check=False, capture_output=True)
            return "passed" if result.returncode == 0 else "failed (exit {})".format(result.returncode)

        with patch.dict(os.environ, environment):
            result, _ = CI.diff_check(details, run_capture)

        self.assertEqual(result, "failed (exit 2)")
        self.assertEqual(details["diff_head"], head)

    def test_build_failure_skips_contracts(self) -> None:
        invoked = []

        def record_execution(name, command):
            invoked.append((name, command))
            return "passed"

        results = CI.contract_results("failed (exit 1)", record_execution)

        self.assertEqual(invoked, [])
        self.assertEqual(len(results), len(CI.CONTRACTS))
        self.assertTrue(all(result.startswith("not run") for _, result in results))

    def test_remote_contracts_are_in_the_required_gate(self) -> None:
        self.assertIn(
            ("Remote client, server, and recovery contracts", ["npm", "run", "test:remote-contracts"]),
            CI.CONTRACTS,
        )

    def test_docs_only_and_code_changes_select_intended_gates(self) -> None:
        docs_scope, docs_gates = CI.gate_plan(["README.md", "docs/wiki/Workflow.md"])
        code_scope, code_gates = CI.gate_plan(["packages/example/src/change.ts"])

        self.assertEqual(docs_scope, "documentation-only")
        self.assertEqual([name for name, _ in docs_gates], [name for name, _ in CI.DOC_GATES])
        self.assertEqual(code_scope, "full source and contract")
        self.assertEqual([name for name, _ in code_gates], [name for name, _ in CI.FULL_GATES])
        self.assertEqual(CI.gate_plan([])[0], "full source and contract")

    def test_uncommitted_plain_checkout_fails_pre_pr_validation(self) -> None:
        result = subprocess.run(
            ["python3", str(SCRIPT), "--pre-pr", "--root", str(self.repo)],
            cwd=ROOT,
            check=False,
            capture_output=True,
            text=True,
        )

        self.assertNotEqual(result.returncode, 0)
        self.assertIn("task branch", result.stderr)

    def linked_task_worktree(self, name: str = "agent/docs") -> Path:
        linked = self.repo / "linked-worktree"
        git(self.repo, "worktree", "add", "--quiet", "-b", name, str(linked), self.base)
        commit_file(linked, "docs/change.md", "A coherent documentation change.\n", "docs change")
        return linked

    def test_clean_linked_worktree_on_current_main_passes_pre_pr_validation(self) -> None:
        linked = self.linked_task_worktree()

        error, details = CI.validate_pre_pr(linked, fetch=False)

        self.assertIsNone(error)
        self.assertEqual(details["current_main"], self.base)
        self.assertEqual(details["branch"], "agent/docs")
        self.assertEqual(details["changed_paths"], ["docs/change.md"])
        self.assertEqual(CI.gate_plan(details["changed_paths"])[0], "documentation-only")

    def test_git_rename_selects_full_lane_for_pre_pr_and_ci(self) -> None:
        base = commit_file(
            self.repo, "tools/check-example.js", "console.log('fixture');\n", "add example"
        )
        self.add_origin_main(base)
        linked = self.repo / "rename-worktree"
        git(self.repo, "worktree", "add", "--quiet", "-b", "agent/rename", str(linked), base)
        (linked / "docs").mkdir()
        git(linked, "mv", "tools/check-example.js", "docs/check-example.md")
        git(linked, "commit", "-m", "rename unchanged example")
        head = git(linked, "rev-parse", "HEAD")

        self.assertEqual(
            git(self.repo, "diff", "--name-only", "{}...{}".format(base, head)).splitlines(),
            ["docs/check-example.md"],
            "the fixture must reproduce Git's default rename detection",
        )

        error, pre_pr = CI.validate_pre_pr(linked, fetch=False)

        self.assertIsNone(error)
        self.assertEqual(set(pre_pr["changed_paths"]), {"docs/check-example.md", "tools/check-example.js"})
        self.assertEqual(CI.gate_plan(pre_pr["changed_paths"])[0], "full source and contract")

        git(self.repo, "merge", "--no-ff", "agent/rename", "-m", "synthetic PR merge")
        merge_checkout = git(self.repo, "rev-parse", "HEAD")
        _, _, ci_details, error = CI.select_diff_command(
            "pull_request",
            {
                "CI_EVENT_SHA": merge_checkout,
                "CI_DEFAULT_BRANCH": "main",
                "CI_PR_BASE_REF": "main",
                "CI_PR_BASE_SHA": base,
                "CI_PR_HEAD_SHA": head,
            },
            self.repo,
        )

        self.assertIsNone(error)
        ci_paths, error = CI.changed_paths(ci_details, self.repo)

        self.assertIsNone(error)
        self.assertEqual(set(ci_paths), {"docs/check-example.md", "tools/check-example.js"})
        self.assertEqual(CI.gate_plan(ci_paths)[0], "full source and contract")

    def test_pre_pr_rejects_stale_main_and_uncommitted_worktree_changes(self) -> None:
        linked = self.linked_task_worktree()
        (linked / "untracked.txt").write_text("not committed\n", encoding="utf-8")

        error, _ = CI.validate_pre_pr(linked, fetch=False)
        self.assertEqual(error, "worktree is not clean; commit or remove staged, unstaged, and untracked changes first")

        (linked / "untracked.txt").unlink()
        current_main = commit_file(self.repo, "main-update.txt", "new main\n", "advance main")
        self.add_origin_main(current_main)

        error, _ = CI.validate_pre_pr(linked, fetch=False)
        self.assertEqual(error, "branch does not contain current origin/main; update it and rerun the checks")

    def test_ci_runner_without_event_fails_with_local_command(self) -> None:
        environment = dict(os.environ)
        environment.pop("CI_EVENT", None)
        result = subprocess.run(
            ["python3", str(SCRIPT)], cwd=ROOT, env=environment, check=False, capture_output=True, text=True
        )

        self.assertNotEqual(result.returncode, 0)
        self.assertIn("npm run ci:pre-pr", result.stderr)


class StagedGateTests(unittest.TestCase):
    def setUp(self) -> None:
        temporary = tempfile.TemporaryDirectory(prefix="gbh-staged-gates-")
        self.addCleanup(temporary.cleanup)
        self.repo = Path(temporary.name)
        git(self.repo, "init", "--quiet")
        git(self.repo, "symbolic-ref", "HEAD", "refs/heads/main")
        git(self.repo, "config", "user.name", "Staged Gate Test")
        git(self.repo, "config", "user.email", "staged-gate-test@example.invalid")
        commit_file(self.repo, "package.json", '{"name":"fixture"}\n', "baseline")

    def run_staged_gate(self) -> subprocess.CompletedProcess:
        return subprocess.run(
            ["python3", str(STAGED_SCRIPT), "--root", str(self.repo)],
            cwd=ROOT,
            check=False,
            capture_output=True,
            text=True,
        )

    def test_staged_immutable_or_generated_outputs_exit_nonzero(self) -> None:
        paths = [".runtime/generated.js", "sand-host/host-main.cjs", "dist/local/generated.js"]
        for relative in paths:
            path = self.repo / relative
            path.parent.mkdir(parents=True, exist_ok=True)
            path.write_text("generated\n", encoding="utf-8")
            git(self.repo, "add", "-f", relative)

        result = self.run_staged_gate()

        self.assertNotEqual(result.returncode, 0)
        self.assertIn("generated runtime output", result.stderr)
        self.assertIn("immutable release baseline", result.stderr)
        self.assertIn("generated local build output", result.stderr)

    def test_staged_marker_reordering_exits_nonzero(self) -> None:
        source = self.repo / "src/recovered.ts"
        source.parent.mkdir(parents=True)
        source.write_text("// @recovered-fragment 1/2\nconst one = 1;\n// @recovered-fragment 2/2\nconst two = 2;\n", encoding="utf-8")
        git(self.repo, "add", "src/recovered.ts")
        git(self.repo, "commit", "-m", "add recovered fixture")
        source.write_text("// @recovered-fragment 2/2\nconst one = 1;\n// @recovered-fragment 1/2\nconst two = 2;\n", encoding="utf-8")
        git(self.repo, "add", "src/recovered.ts")

        result = self.run_staged_gate()

        self.assertNotEqual(result.returncode, 0)
        self.assertIn("marker identity or order", result.stderr)

    def test_staged_whitespace_error_exits_nonzero(self) -> None:
        note = self.repo / "note.md"
        note.write_text("staged trailing space \n", encoding="utf-8")
        git(self.repo, "add", "note.md")

        result = self.run_staged_gate()

        self.assertNotEqual(result.returncode, 0)
        self.assertIn("staged whitespace check failed", result.stderr)

    def test_invalid_staged_json_fails_even_when_worktree_is_fixed(self) -> None:
        manifest = self.repo / "package.json"
        manifest.write_text('{"name":}\n', encoding="utf-8")
        git(self.repo, "add", "package.json")
        manifest.write_text('{"name":"fixed in worktree"}\n', encoding="utf-8")

        result = self.run_staged_gate()

        self.assertNotEqual(result.returncode, 0)
        self.assertIn("invalid staged JSON", result.stderr)

    def test_valid_index_passes_even_if_worktree_has_unstaged_invalid_json(self) -> None:
        manifest = self.repo / "package.json"
        manifest.write_text('{"name":"staged"}\n', encoding="utf-8")
        git(self.repo, "add", "package.json")
        manifest.write_text('{"name":}\n', encoding="utf-8")

        result = self.run_staged_gate()

        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertIn("Only the Git index was checked", result.stdout)


class HookInstallerTests(unittest.TestCase):
    def setUp(self) -> None:
        temporary = tempfile.TemporaryDirectory(prefix="gbh-hook-installer-")
        self.addCleanup(temporary.cleanup)
        self.repo = Path(temporary.name)
        git(self.repo, "init", "--quiet")
        git(self.repo, "symbolic-ref", "HEAD", "refs/heads/main")
        source = self.repo / "tools/hooks/pre-commit"
        source.parent.mkdir(parents=True)
        source.write_bytes((ROOT / "hooks/pre-commit").read_bytes())

    def install(self) -> subprocess.CompletedProcess:
        return subprocess.run(
            ["python3", str(INSTALLER_SCRIPT), "--root", str(self.repo)],
            cwd=ROOT,
            check=False,
            capture_output=True,
            text=True,
        )

    def hook_path(self) -> Path:
        return Path(git(self.repo, "rev-parse", "--path-format=absolute", "--git-path", "hooks/pre-commit"))

    def test_installer_copies_hook_and_is_idempotent(self) -> None:
        first = self.install()
        second = self.install()

        self.assertEqual(first.returncode, 0, first.stderr)
        self.assertEqual(second.returncode, 0, second.stderr)
        self.assertEqual(self.hook_path().read_bytes(), (ROOT / "hooks/pre-commit").read_bytes())
        self.assertTrue(self.hook_path().stat().st_mode & 0o111)

    def test_installer_refuses_to_overwrite_existing_hook(self) -> None:
        destination = self.hook_path()
        destination.parent.mkdir(parents=True, exist_ok=True)
        destination.write_text("#!/bin/sh\nexit 42\n", encoding="utf-8")

        result = self.install()

        self.assertNotEqual(result.returncode, 0)
        self.assertIn("Refusing to replace", result.stderr)
        self.assertEqual(destination.read_text(encoding="utf-8"), "#!/bin/sh\nexit 42\n")

    def test_installer_refuses_custom_hooks_path_without_changing_config(self) -> None:
        custom = self.repo / "private-hooks"
        custom.mkdir()
        marker = custom / "pre-commit"
        marker.write_text("leave intact\n", encoding="utf-8")
        git(self.repo, "config", "core.hooksPath", "private-hooks")

        result = self.install()

        self.assertNotEqual(result.returncode, 0)
        self.assertIn("core.hooksPath is already configured", result.stderr)
        self.assertEqual(marker.read_text(encoding="utf-8"), "leave intact\n")
        self.assertFalse((self.repo / ".git/hooks/pre-commit").exists())


if __name__ == "__main__":
    unittest.main()

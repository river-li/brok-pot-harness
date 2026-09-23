"""Regression tests for event-aware CI diff selection and whitespace failures."""
import contextlib
import importlib.util
import io
import os
from pathlib import Path
import subprocess
import tempfile
import unittest
from unittest.mock import patch


ROOT = Path(__file__).resolve().parents[1]
SCRIPT = ROOT / "tools/ci/run-required-gates.py"
SPEC = importlib.util.spec_from_file_location("run_required_gates", SCRIPT)
CI = importlib.util.module_from_spec(SPEC)
assert SPEC and SPEC.loader
SPEC.loader.exec_module(CI)


def git(repo: Path, *args: str) -> str:
    result = subprocess.run(
        ["git", *args], cwd=repo, check=True, capture_output=True, text=True
    )
    return result.stdout.strip()


def commit_file(repo: Path, name: str, content: str, message: str) -> str:
    destination = repo / name
    destination.parent.mkdir(parents=True, exist_ok=True)
    destination.write_text(content, encoding="utf-8")
    git(repo, "add", name)
    git(repo, "commit", "-m", message)
    return git(repo, "rev-parse", "HEAD")


class RequiredGateDiffTests(unittest.TestCase):
    def setUp(self) -> None:
        self.temporary = tempfile.TemporaryDirectory(prefix="gbh-ci-gates-")
        self.addCleanup(self.temporary.cleanup)
        self.repo = Path(self.temporary.name)
        git(self.repo, "init", "--quiet")
        git(self.repo, "symbolic-ref", "HEAD", "refs/heads/main")
        git(self.repo, "config", "user.name", "CI Gate Test")
        git(self.repo, "config", "user.email", "ci-gate-test@example.invalid")
        self.base = commit_file(self.repo, "base.txt", "baseline\n", "baseline")

    def add_origin_main(self, commit: str | None = None) -> None:
        git(self.repo, "update-ref", "refs/remotes/origin/main", commit or self.base)

    def test_pull_request_checks_source_head_and_reports_merge_checkout(self) -> None:
        git(self.repo, "checkout", "--quiet", "-b", "feature")
        pr_head = commit_file(self.repo, "feature.txt", "change\n", "feature change")
        git(self.repo, "checkout", "--quiet", "main")
        base = commit_file(self.repo, "base-update.txt", "base update\n", "base update")
        git(self.repo, "merge", "--no-ff", "feature", "-m", "synthetic PR merge")
        merge_checkout = git(self.repo, "rev-parse", "HEAD")
        self.assertNotEqual(merge_checkout, pr_head)

        command, description, details, error = CI.select_diff_command(
            "pull_request",
            {
                "CI_EVENT_SHA": merge_checkout,
                "CI_PR_BASE_SHA": base,
                "CI_PR_HEAD_SHA": pr_head,
            },
            self.repo,
        )

        self.assertIsNone(error)
        self.assertEqual(command, ["git", "diff", "--check", f"{base}...{pr_head}"])
        self.assertIn("pull request source diff", description)
        self.assertEqual(details["checked_out_commit"], merge_checkout)
        self.assertEqual(details["pull_request_head"], pr_head)

    def test_normal_push_uses_before_and_checked_out_head(self) -> None:
        head = commit_file(self.repo, "pushed.txt", "pushed\n", "pushed change")

        command, _, details, error = CI.select_diff_command(
            "push",
            {"CI_EVENT_SHA": head, "CI_BEFORE_SHA": self.base},
            self.repo,
        )

        self.assertIsNone(error)
        self.assertEqual(command, ["git", "diff", "--check", self.base, head])
        self.assertEqual(details["diff_head"], head)

    def test_new_branch_push_uses_default_branch_common_base(self) -> None:
        self.add_origin_main()
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
        self.add_origin_main()
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

    def test_invalid_ci_ref_fails_instead_of_falling_back_to_working_tree(self) -> None:
        command, _, _, error = CI.select_diff_command(
            "pull_request",
            {
                "CI_PR_BASE_SHA": "not-a-commit",
                "CI_PR_HEAD_SHA": self.base,
            },
            self.repo,
        )

        self.assertIsNone(command)
        self.assertEqual(error, "pull request base SHA is not a full commit SHA")

    def test_root_commit_is_compared_with_empty_tree_even_when_default_ref_points_at_it(self) -> None:
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

    def test_whitespace_error_fails_the_selected_push_range(self) -> None:
        head = commit_file(self.repo, "bad.txt", "trailing space \n", "bad whitespace")
        environment = {
            "CI_EVENT": "push",
            "CI_EVENT_SHA": head,
            "CI_BEFORE_SHA": self.base,
            "GITHUB_ACTIONS": "true",
        }

        with patch.object(CI, "ROOT", self.repo), patch.dict(os.environ, environment):
            with contextlib.redirect_stdout(io.StringIO()), contextlib.redirect_stderr(io.StringIO()):
                result, _, details = CI.diff_check()

        self.assertEqual(result, "failed (exit 2)")
        self.assertEqual(details["diff_head"], head)


if __name__ == "__main__":
    unittest.main()

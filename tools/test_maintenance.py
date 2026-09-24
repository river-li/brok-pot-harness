"""Behavior tests for registered maintenance tasks and GitHub evidence reports."""

import json
import os
from pathlib import Path
import subprocess
import sys
import tempfile
import textwrap
import unittest
from unittest.mock import patch

from maintenance_workflow import invalidate_labels, readiness, triage
from maintenance_workflow.common import MaintenanceError, repository_identity


TOOLS_DIRECTORY = Path(__file__).resolve().parent
SCRIPT = TOOLS_DIRECTORY / "maintenance.py"
COMPARE_FIXTURE = (
    TOOLS_DIRECTORY / "fixtures" / "maintenance" / "github-compare-response.json"
)


def git(repository: Path, *arguments: str) -> str:
    result = subprocess.run(
        ["git"] + list(arguments),
        cwd=str(repository),
        check=True,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True,
    )
    return result.stdout.strip()


def review_record(
    head: str,
    base: str,
    verdict: str = "READY_TO_MERGE",
    login: str = "reviewer",
    state: str = "COMMENTED",
    submitted_at: str = "2026-09-23T12:00:00Z",
    summary: str = "简体中文评审摘要：已检查当前差异和验证结果。",
) -> dict:
    metadata = (
        "<details>\n"
        "<summary>GBH review evidence</summary>\n\n"
        "verdict: {}\n"
        "head-sha: {}\n"
        "base-sha: {}\n"
        "</details>"
    ).format(verdict, head, base)
    return {
        "id": int(submitted_at[17:19].replace("Z", "") or "0"),
        "state": state,
        "submitted_at": submitted_at,
        "commit_id": head,
        "user": {"login": login},
        "body": "{}\n\n{}".format(summary, metadata),
    }


def current_comparison(base: str, ahead: int = 2, behind: int = 0) -> dict:
    status = "ahead" if behind == 0 and ahead > 0 else "diverged"
    return {
        "base_commit": {"sha": base},
        "merge_base_commit": {"sha": base if behind == 0 else "e" * 40},
        "status": status,
        "ahead_by": ahead,
        "behind_by": behind,
        "total_commits": ahead,
    }


class TemporaryRepository:
    def setUp_repository(self) -> None:
        self.temporary = tempfile.TemporaryDirectory(prefix="gbh-maintenance-")
        self.addCleanup(self.temporary.cleanup)
        self.directory = Path(self.temporary.name)
        self.seed = self.directory / "seed"
        self.origin = self.directory / "origin.git"
        self.coordinator = self.directory / "coordinator"
        self.fake_bin = self.directory / "bin"
        self.fake_bin.mkdir()
        self.initialize_remote()
        self.install_fake_gh()

    def initialize_remote(self) -> None:
        self.seed.mkdir()
        git(self.seed, "init", "--quiet", "--initial-branch=main")
        git(self.seed, "config", "user.name", "Maintenance Test")
        git(self.seed, "config", "user.email", "maintenance-test@example.invalid")
        (self.seed / "README.md").write_text("test repository\n", encoding="utf-8")
        (self.seed / ".gitignore").write_text(".runtime/\n", encoding="utf-8")
        git(self.seed, "add", "README.md", ".gitignore")
        git(self.seed, "commit", "--quiet", "-m", "initial main")
        self.base_sha = git(self.seed, "rev-parse", "HEAD")
        git(self.directory, "init", "--bare", "--quiet", str(self.origin))
        git(self.seed, "remote", "add", "origin", str(self.origin))
        git(self.seed, "push", "--quiet", "-u", "origin", "main")
        git(
            self.directory,
            "clone",
            "--quiet",
            "--branch",
            "main",
            str(self.origin),
            str(self.coordinator),
        )
        git(self.coordinator, "config", "user.name", "Maintenance Test")
        git(self.coordinator, "config", "user.email", "maintenance-test@example.invalid")
        git(
            self.coordinator,
            "config",
            "url.{}.insteadOf".format(self.origin.as_uri()),
            "https://github.com/river-li/gbh.git",
        )
        git(
            self.coordinator,
            "remote",
            "set-url",
            "origin",
            "https://github.com/river-li/gbh.git",
        )

    def install_fake_gh(self) -> None:
        executable = self.fake_bin / "gh"
        executable.write_text(
            textwrap.dedent(
                """\
                #!/usr/bin/env python3
                import json
                import os
                import sys

                args = sys.argv[1:]
                log_path = os.environ.get("GH_TEST_LOG")
                if log_path:
                    with open(log_path, "a", encoding="utf-8") as log_file:
                        log_file.write(json.dumps(args) + "\\n")

                def emit(value):
                    print(json.dumps(value))

                if args[:2] == ["api", "--hostname"]:
                    endpoint = args[-1]
                    if endpoint == "repos/river-li/gbh":
                        emit({
                            "full_name": "river-li/brok-pot-harness",
                            "html_url": "https://github.com/river-li/brok-pot-harness",
                            "default_branch": "main",
                        })
                    elif endpoint.endswith("/branches/main"):
                        emit({"commit": {"sha": os.environ["FIXTURE_MAIN_SHA"]}})
                    elif "/compare/" in endpoint:
                        emit(json.loads(os.environ["FIXTURE_COMPARISON"]))
                    elif "/commits/" in endpoint:
                        emit({"sha": os.environ["FIXTURE_HEAD_SHA"]})
                    elif endpoint.endswith("/pulls/42/reviews?per_page=100"):
                        emit(json.loads(os.environ["FIXTURE_REVIEW_PAGES"]))
                    else:
                        sys.exit(4)
                elif args[:2] == ["issue", "view"]:
                    number = int(args[2])
                    emit({
                        "number": number,
                        "title": "Maintenance test issue",
                        "state": "OPEN",
                        "url": "https://github.com/river-li/brok-pot-harness/issues/{}".format(number),
                    })
                elif args[:2] == ["issue", "list"]:
                    emit([])
                elif args[:2] == ["pr", "view"]:
                    number = int(args[2])
                    readiness_pr = os.environ.get("FIXTURE_READINESS_PR")
                    if readiness_pr:
                        emit(json.loads(readiness_pr))
                        sys.exit(0)
                    merge_sha = os.environ.get("FIXTURE_MERGE_SHA", "")
                    state = os.environ.get("FIXTURE_PR_STATE", "OPEN")
                    emit({
                        "number": number,
                        "state": state,
                        "mergedAt": "2026-09-22T10:00:00Z" if state == "MERGED" else None,
                        "mergeCommit": {"oid": merge_sha} if merge_sha else None,
                        "url": "https://github.com/river-li/brok-pot-harness/pull/{}".format(number),
                    })
                elif args[:2] == ["pr", "list"]:
                    emit([])
                elif args[:2] == ["pr", "checks"]:
                    emit(json.loads(os.environ["FIXTURE_CHECKS"]))
                elif args[:2] == ["run", "list"]:
                    emit([])
                elif args[:2] == ["run", "view"]:
                    emit({"jobs": []})
                else:
                    sys.exit(5)
                """
            ),
            encoding="utf-8",
        )
        executable.chmod(0o755)

    def environment(self, **overrides: str) -> dict:
        environment = dict(os.environ)
        environment["PATH"] = str(self.fake_bin) + os.pathsep + environment.get("PATH", "")
        environment["FIXTURE_MAIN_SHA"] = self.base_sha
        environment.update(overrides)
        return environment


class MaintenanceTaskTests(TemporaryRepository, unittest.TestCase):
    def setUp(self) -> None:
        self.setUp_repository()

    def start_task(
        self, slug: str, *paths: str, extra: tuple = ()
    ) -> subprocess.CompletedProcess:
        arguments = [
            sys.executable,
            str(SCRIPT),
            "task",
            "start",
            "--issue",
            "5",
            "--slug",
            slug,
            "--owner",
            "implementation-agent",
            "--reviewer",
            "coordinator-agent",
            "--reviewer-account",
            "reviewer-login",
        ]
        for path in paths:
            arguments.extend(["--path", path])
        arguments.extend(["--accept", "observable behavior is delivered"])
        arguments.extend(["--check", "python3 -m unittest discover -s tools"])
        arguments.extend(extra)
        return subprocess.run(
            arguments,
            cwd=str(self.coordinator),
            env=self.environment(),
            check=False,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
        )

    def test_task_start_preserves_dirty_primary_branch_and_creates_current_main_worktree(self) -> None:
        git(self.coordinator, "switch", "--create", "ci/claude-review")
        (self.coordinator / "README.md").write_text(
            "user's uncommitted primary checkout change\n", encoding="utf-8"
        )
        dirty_file = self.coordinator / "docs" / "user-change.md"
        dirty_file.parent.mkdir()
        dirty_file.write_text("keep this file\n", encoding="utf-8")
        original_branch = git(self.coordinator, "branch", "--show-current")
        original_head = git(self.coordinator, "rev-parse", "HEAD")
        original_status = git(self.coordinator, "status", "--short")
        original_readme = (self.coordinator / "README.md").read_text(encoding="utf-8")

        result = self.start_task("workflow-test", "tools/maintenance.py", "tools/test_maintenance.py")

        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertEqual(git(self.coordinator, "branch", "--show-current"), original_branch)
        self.assertEqual(git(self.coordinator, "rev-parse", "HEAD"), original_head)
        self.assertEqual(git(self.coordinator, "status", "--short"), original_status)
        self.assertEqual(
            (self.coordinator / "README.md").read_text(encoding="utf-8"), original_readme
        )
        self.assertEqual(dirty_file.read_text(encoding="utf-8"), "keep this file\n")

        task_worktree = self.coordinator / ".runtime" / "worktrees" / "workflow-test"
        self.assertEqual(git(task_worktree, "rev-parse", "HEAD"), self.base_sha)
        self.assertEqual(git(task_worktree, "branch", "--show-current"), "agent/workflow-test")
        self.assertNotEqual(
            git(task_worktree, "rev-parse", "--absolute-git-dir"),
            git(task_worktree, "rev-parse", "--path-format=absolute", "--git-common-dir"),
        )
        bundle_path = Path(result.stdout.split("Task bundle: ", 1)[1].strip())
        bundle = bundle_path.read_text(encoding="utf-8")
        self.assertIn("Owner agent: implementation-agent", bundle)
        self.assertIn("Designated reviewer agent: coordinator-agent", bundle)
        self.assertIn("Expected reviewer GitHub account: @reviewer-login", bundle)
        self.assertIn("observable behavior is delivered", bundle)
        self.assertIn("GBH review evidence metadata block", bundle)
        self.assertIn("cannot prove historical branch creation", bundle)

    def test_task_start_fails_closed_when_fetched_main_differs_from_canonical_main(self) -> None:
        result = subprocess.run(
            [
                sys.executable,
                str(SCRIPT),
                "task",
                "start",
                "--issue",
                "5",
                "--slug",
                "stale-main",
                "--owner",
                "implementation-agent",
                "--reviewer",
                "coordinator-agent",
                "--reviewer-account",
                "reviewer-login",
                "--path",
                "tools",
                "--accept",
                "observable behavior is delivered",
                "--check",
                "python3 -m unittest discover -s tools",
            ],
            cwd=str(self.coordinator),
            env=self.environment(FIXTURE_MAIN_SHA="f" * 40),
            check=False,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
        )

        self.assertEqual(result.returncode, 2)
        self.assertIn("does not match the canonical GitHub main SHA", result.stderr)
        self.assertFalse((self.coordinator / ".runtime" / "worktrees" / "stale-main").exists())

    def test_overlapping_registered_ownership_stops_without_creating_second_worktree(self) -> None:
        first = self.start_task("owner-one", "packages/agent")
        self.assertEqual(first.returncode, 0, first.stderr)

        second = self.start_task("owner-two", "packages/agent/src")

        self.assertEqual(second.returncode, 2)
        self.assertIn("overlaps registered task owner-one", second.stderr)
        self.assertIn("implementation-agent", second.stderr)
        self.assertFalse((self.coordinator / ".runtime" / "worktrees" / "owner-two").exists())
        branch_result = subprocess.run(
            ["git", "show-ref", "--verify", "--quiet", "refs/heads/agent/owner-two"],
            cwd=str(self.coordinator),
            check=False,
        )
        self.assertNotEqual(branch_result.returncode, 0)

    def test_unmerged_pr_dependency_stops_before_registration_or_worktree_creation(self) -> None:
        checked = subprocess.run(
            [
                sys.executable,
                str(SCRIPT),
                "task",
                "start",
                "--issue",
                "5",
                "--slug",
                "blocked-dependency",
                "--owner",
                "implementation-agent",
                "--reviewer",
                "coordinator-agent",
                "--reviewer-account",
                "reviewer-login",
                "--path",
                "docs/wiki",
                "--accept",
                "observable behavior is delivered",
                "--check",
                "python3 -m unittest discover -s tools",
                "--depends-on-pr",
                "28",
            ],
            cwd=str(self.coordinator),
            env=self.environment(FIXTURE_PR_STATE="OPEN"),
            check=False,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
        )

        self.assertEqual(checked.returncode, 2)
        self.assertIn("Dependency PR #28 is not merged", checked.stderr)
        self.assertFalse((self.coordinator / ".runtime" / "worktrees" / "blocked-dependency").exists())
        registry = self.coordinator / ".git" / "maintenance" / "tasks.json"
        self.assertFalse(registry.exists())

    def test_existing_task_paths_and_branches_are_left_untouched(self) -> None:
        existing_path = self.coordinator / ".runtime" / "worktrees" / "occupied"
        existing_path.mkdir(parents=True)
        (existing_path / "keep.txt").write_text("preserve me\n", encoding="utf-8")

        result = self.start_task("occupied", "tools")

        self.assertEqual(result.returncode, 2)
        self.assertIn("already exists", result.stderr)
        self.assertEqual((existing_path / "keep.txt").read_text(encoding="utf-8"), "preserve me\n")

        git(self.coordinator, "branch", "agent/preexisting", self.base_sha)
        branch_result = self.start_task("preexisting", "tools")

        self.assertEqual(branch_result.returncode, 2)
        self.assertIn("Task branch already exists", branch_result.stderr)
        self.assertEqual(git(self.coordinator, "rev-parse", "agent/preexisting"), self.base_sha)
        self.assertFalse((self.coordinator / ".runtime" / "worktrees" / "preexisting").exists())


class MaintenanceRepositoryBindingTests(TemporaryRepository, unittest.TestCase):
    def setUp(self) -> None:
        self.setUp_repository()
        self.log_path = self.directory / "gh-commands.jsonl"

    def test_foreign_gh_repo_cannot_redirect_origin_resolution_or_triage_queries(self) -> None:
        with patch.dict(os.environ, self.environment(), clear=True):
            repository, host = repository_identity(self.coordinator)
            self.assertEqual((repository, host), ("river-li/brok-pot-harness", "github.com"))
            report = triage.fetch_triage_report(self.coordinator, limit=3)

        self.assertIn("Repository: river-li/brok-pot-harness", report)
        commands = [
            json.loads(line)
            for line in self.log_path.read_text(encoding="utf-8").splitlines()
        ]
        self.assertGreaterEqual(len(commands), 6)
        serialized = json.dumps(commands)
        self.assertNotIn("attacker/foreign", serialized)
        self.assertIn("repos/river-li/gbh", serialized)
        self.assertIn("repos/river-li/brok-pot-harness/branches/main", serialized)
        for command in commands:
            if command[:2] in (["issue", "list"], ["run", "list"], ["pr", "list"]):
                self.assertIn("--repo", command)
                repo_index = command.index("--repo")
                self.assertEqual(command[repo_index + 1], "github.com/river-li/brok-pot-harness")

    def test_readiness_pins_all_queries_and_accepts_designated_verdict_on_later_review_page(self) -> None:
        self.log_path.write_text("", encoding="utf-8")
        head = "b" * 40
        review_pages = [
            [
                {
                    "id": review_id,
                    "state": "COMMENTED",
                    "submitted_at": "2026-09-23T10:{:02d}:00Z".format(review_id % 60),
                    "commit_id": head,
                    "user": {"login": "unrelated-reviewer"},
                    "body": "An ordinary review note.",
                }
                for review_id in range(100)
            ],
            [review_record(head, self.base_sha, login="reviewer")],
        ]
        fixture_pr = {
            "number": 42,
            "title": "Readiness integration fixture",
            "url": "https://github.com/river-li/brok-pot-harness/pull/42",
            "state": "OPEN",
            "isDraft": False,
            "author": {"login": "implementation-agent"},
            "baseRefName": "main",
            "baseRefOid": self.base_sha,
            "headRefName": "agent/readiness-fixture",
            "headRefOid": head,
            "labels": [],
            "mergeable": "MERGEABLE",
            "reviewDecision": "REVIEW_REQUIRED",
        }
        env = self.environment(
            FIXTURE_HEAD_SHA=head,
            FIXTURE_COMPARISON=json.dumps(current_comparison(self.base_sha)),
            FIXTURE_REVIEW_PAGES=json.dumps(review_pages),
            FIXTURE_READINESS_PR=json.dumps(fixture_pr),
            FIXTURE_CHECKS=json.dumps(
                [{"name": "offline gates", "state": "SUCCESS", "bucket": "pass"}]
            ),
        )

        with patch.dict(os.environ, env, clear=True):
            report = readiness.fetch_pr_readiness(
                self.coordinator,
                42,
                requested_reviewer_account="reviewer",
            )

        self.assertIn("Current READY_TO_MERGE COMMENT", report)
        self.assertIn("Current evidence is ready for the coordinator's human merge decision", report)
        commands = [
            json.loads(line)
            for line in self.log_path.read_text(encoding="utf-8").splitlines()
        ]
        review_query = next(
            command
            for command in commands
            if any("/pulls/42/reviews" in argument for argument in command)
        )
        self.assertIn("--paginate", review_query)
        self.assertIn("--slurp", review_query)
        self.assertTrue(
            any(
                "repos/river-li/brok-pot-harness/compare/" in argument
                for command in commands
                for argument in command
            )
        )
        for command in commands:
            self.assertNotIn("attacker/foreign", json.dumps(command))

    def environment(self, **overrides: str) -> dict:
        environment = super().environment(**overrides)
        environment["GH_TEST_LOG"] = str(self.log_path)
        environment["GH_REPO"] = "attacker/foreign"
        return environment


class MaintenanceReadinessTests(unittest.TestCase):
    def setUp(self) -> None:
        self.base = "a" * 40
        self.head = "b" * 40
        self.pr = {
            "number": 42,
            "title": "Example workflow change",
            "url": "https://github.com/river-li/brok-pot-harness/pull/42",
            "state": "OPEN",
            "isDraft": False,
            "author": {"login": "implementation-agent"},
            "baseRefName": "main",
            "baseRefOid": self.base,
            "headRefName": "agent/workflow-change",
            "headRefOid": self.head,
            "labels": [],
            "mergeable": "MERGEABLE",
            "reviewDecision": "REVIEW_REQUIRED",
        }
        self.comparison = current_comparison(self.base)
        self.head_commit = {"sha": self.head}
        self.checks = [
            {
                "name": "offline gates",
                "state": "SUCCESS",
                "bucket": "pass",
                "link": "https://github.com/river-li/brok-pot-harness/actions/runs/123",
            }
        ]
        self.assignment = {
            "owner": "implementation-agent",
            "reviewer": "coordinator-agent",
            "reviewer_account": "reviewer",
        }

    def evaluate(
        self,
        reviews: list = None,
        current_pr: dict = None,
        current_main: str = None,
        checks: list = None,
        initial_pr: dict = None,
        initial_main: str = None,
        assignment: dict = None,
        comparison: dict = None,
        head_commit: dict = None,
        requested_account: str = None,
    ) -> tuple:
        final_pr = current_pr or self.pr
        return readiness.evaluate_readiness(
            initial_pr or self.pr,
            initial_main or self.base,
            comparison or self.comparison,
            head_commit or self.head_commit,
            checks if checks is not None else self.checks,
            reviews if reviews is not None else [review_record(self.head, self.base)],
            final_pr,
            current_main or self.base,
            self.assignment if assignment is None else assignment,
            requested_account,
        )

    def test_exact_designated_ready_comment_and_current_checks_support_human_decision(self) -> None:
        ready, report = self.evaluate()

        self.assertTrue(ready)
        self.assertIn("Current READY_TO_MERGE COMMENT", report)
        self.assertIn("@reviewer", report)
        self.assertIn("GitHub account metadata identifies the posting account", report)

    def test_unassigned_outsider_ready_comment_is_not_accepted(self) -> None:
        review = review_record(
            self.head,
            self.base,
            login="unassigned-outsider",
            summary="I am @reviewer and approve this change.",
        )
        ready, report = self.evaluate(reviews=[review])

        self.assertFalse(ready)
        self.assertIn("@unassigned-outsider was not assigned as the trusted reviewer", report)
        self.assertNotIn("Current READY_TO_MERGE COMMENT", report)

    def test_no_trusted_reviewer_binding_never_produces_ready(self) -> None:
        assignment_without_account = {
            "owner": "implementation-agent",
            "reviewer": "coordinator-agent",
        }
        ready, report = self.evaluate(
            assignment=assignment_without_account,
            requested_account=None,
        )

        self.assertFalse(ready)
        self.assertIn("No trusted reviewer account is bound", report)
        self.assertIn("no COMMENT verdict can qualify as ready evidence", report)

    def test_assigned_needs_changes_verdict_is_preserved_and_blocks_readiness(self) -> None:
        review = review_record(self.head, self.base, verdict="NEEDS_CHANGES")
        ready, report = self.evaluate(reviews=[review])

        self.assertFalse(ready)
        self.assertIn("Current NEEDS_CHANGES COMMENT by expected GitHub actor @reviewer", report)
        self.assertIn("requests changes and blocks readiness", report)
        self.assertNotIn("Current READY_TO_MERGE COMMENT", report)

    def test_formal_changes_requested_stays_blocking_after_later_plain_comment(self) -> None:
        formal_request = {
            "id": 1,
            "state": "CHANGES_REQUESTED",
            "submitted_at": "2026-09-23T11:00:00Z",
            "commit_id": self.head,
            "user": {"login": "formal-reviewer"},
            "body": "Please address the failure case.",
        }
        later_plain_comment = {
            "id": 2,
            "state": "COMMENTED",
            "submitted_at": "2026-09-23T13:00:00Z",
            "commit_id": self.head,
            "user": {"login": "formal-reviewer"},
            "body": "Thanks, I will check again.",
        }
        pr = dict(self.pr)
        pr["reviewDecision"] = "CHANGES_REQUESTED"
        ready, report = self.evaluate(
            current_pr=pr,
            reviews=[
                review_record(self.head, self.base),
                formal_request,
                later_plain_comment,
            ],
        )

        self.assertFalse(ready)
        self.assertIn("GitHub reviewDecision is CHANGES_REQUESTED", report)
        self.assertIn("formal CHANGES_REQUESTED review remains from @formal-reviewer", report)
        self.assertIn("Current READY_TO_MERGE COMMENT", report)

    def test_latest_formal_approval_resolves_that_reviewers_prior_request(self) -> None:
        formal_request = {
            "id": 1,
            "state": "CHANGES_REQUESTED",
            "submitted_at": "2026-09-23T11:00:00Z",
            "commit_id": self.head,
            "user": {"login": "formal-reviewer"},
            "body": "Please address the failure case.",
        }
        later_approval = {
            "id": 2,
            "state": "APPROVED",
            "submitted_at": "2026-09-23T13:00:00Z",
            "commit_id": self.head,
            "user": {"login": "formal-reviewer"},
            "body": "The follow-up is addressed.",
        }
        pr = dict(self.pr)
        pr["reviewDecision"] = "APPROVED"
        ready, report = self.evaluate(
            current_pr=pr,
            reviews=[review_record(self.head, self.base), formal_request, later_approval],
        )

        self.assertTrue(ready)
        self.assertNotIn("formal CHANGES_REQUESTED review remains", report)

    def test_stale_head_or_base_verdict_is_rejected(self) -> None:
        new_head_pr = dict(self.pr)
        new_head_pr["headRefOid"] = "c" * 40
        ready, report = self.evaluate(
            initial_pr=new_head_pr,
            current_pr=new_head_pr,
            reviews=[review_record(self.head, self.base)],
            head_commit={"sha": "c" * 40},
        )
        self.assertFalse(ready)
        self.assertIn("Stale READY_TO_MERGE verdict", report)

        new_base_pr = dict(self.pr)
        new_base_pr["baseRefOid"] = "d" * 40
        ready, report = self.evaluate(
            initial_pr=new_base_pr,
            current_pr=new_base_pr,
            current_main="d" * 40,
            reviews=[review_record(self.head, self.base)],
        )
        self.assertFalse(ready)
        self.assertIn("Stale READY_TO_MERGE verdict", report)

    def test_old_passing_head_checks_do_not_override_a_newer_main(self) -> None:
        newer_main = "c" * 40
        ready, report = self.evaluate(
            current_main=newer_main,
            initial_main=self.base,
            comparison=current_comparison(self.base),
        )

        self.assertFalse(ready)
        self.assertIn("UNSTABLE", report)
        self.assertIn("PR base does not equal current main", report)

    def test_compare_must_prove_requested_head_and_current_main_ancestry(self) -> None:
        diverged = current_comparison(self.base, ahead=3, behind=1)
        ready, report = self.evaluate(comparison=diverged)

        self.assertFalse(ready)
        self.assertIn("did not confirm that this PR head contains current main", report)

        wrong_commit = {"sha": "c" * 40}
        ready, report = self.evaluate(head_commit=wrong_commit)
        self.assertFalse(ready)
        self.assertIn("did not confirm that this PR head contains current main", report)

    def test_captured_github_compare_response_uses_real_endpoint_schema(self) -> None:
        comparison = json.loads(COMPARE_FIXTURE.read_text(encoding="utf-8"))
        captured_head = "5ca45b4bc57afeb9db7bdf4c5bce7160eca6bdfe"
        captured_main = comparison["base_commit"]["sha"]
        self.assertNotIn("head_commit", comparison)
        self.assertIn("base_commit", comparison)
        self.assertIn("merge_base_commit", comparison)
        self.assertIn("behind_by", comparison)
        self.assertFalse(
            readiness.comparison_proves_current_main(
                comparison,
                {"sha": captured_head},
                captured_main,
                captured_head,
            )
        )

    def test_current_pending_checks_block_readiness(self) -> None:
        changed_check = dict(self.checks[0])
        changed_check["state"] = "IN_PROGRESS"
        changed_check["bucket"] = "pending"
        ready, report = self.evaluate(checks=[changed_check])

        self.assertFalse(ready)
        self.assertIn("offline gates: IN_PROGRESS (pending)", report)

    def test_cli_no_checks_response_is_reported_as_unverified(self) -> None:
        response = subprocess.CompletedProcess(
            args=["gh", "pr", "checks"],
            returncode=1,
            stdout="",
            stderr="no checks reported on the 'agent/example' branch",
        )
        with patch("maintenance_workflow.readiness.subprocess.run", return_value=response):
            checks = readiness.fetch_required_checks(Path("."), "github.com/river-li/brok-pot-harness", 42)

        self.assertEqual(checks, [])
        ready, report = self.evaluate(checks=checks)
        self.assertFalse(ready)
        self.assertIn("No required check results were returned", report)

    def test_review_pending_trigger_and_stale_labels_are_not_evidence(self) -> None:
        pending_pr = dict(self.pr)
        pending_pr["labels"] = [{"name": "review:pending"}]
        ready, report = self.evaluate(current_pr=pending_pr)
        self.assertFalse(ready)
        self.assertIn("triggers the Claude review workflow", report)

        stale_label_pr = dict(self.pr)
        stale_label_pr["labels"] = [
            {"name": "review:ready-to-merge"},
            {"name": "review:changes-requested"},
        ]
        ready, report = self.evaluate(current_pr=stale_label_pr, reviews=[])
        self.assertFalse(ready)
        self.assertEqual(report.count("is not backed by the trusted current COMMENT verdict"), 2)

    def test_pr_or_main_moving_during_collection_is_unstable(self) -> None:
        changed_pr = dict(self.pr)
        changed_pr["headRefOid"] = "c" * 40
        ready, report = self.evaluate(initial_pr=self.pr, current_pr=changed_pr)

        self.assertFalse(ready)
        self.assertIn("UNSTABLE", report)

        ready, report = self.evaluate(initial_main=self.base, current_main="d" * 40)
        self.assertFalse(ready)
        self.assertIn("UNSTABLE", report)

    def test_reviews_from_all_paginated_pages_are_flattened_and_bad_pages_fail_closed(self) -> None:
        first_page = [{"id": number} for number in range(100)]
        last_page = [{"id": 100}]
        flattened = readiness.flatten_pages([first_page, last_page])

        self.assertEqual(len(flattened), 101)
        with self.assertRaises(MaintenanceError):
            readiness.flatten_pages([first_page, ["truncated or malformed review"]])
        with self.assertRaises(MaintenanceError):
            readiness.flatten_pages([{} , ["unexpected page shape"]])


class MaintenanceTriageTests(unittest.TestCase):
    def test_repeat_failure_candidates_are_deduplicated_and_not_called_root_causes(self) -> None:
        issues = [
            {
                "number": 7,
                "title": "Cannot install MCP plugin",
                "state": "OPEN",
                "url": "https://github.com/river-li/brok-pot-harness/issues/7",
                "body": "Bearer raw-secret-value",
            },
            {
                "number": 9,
                "title": "cannot install: MCP plugin",
                "state": "CLOSED",
                "url": "https://github.com/river-li/brok-pot-harness/issues/9",
                "body": "transcript should stay private",
            },
        ]
        runs = [
            {
                "databaseId": 101,
                "workflowName": "Required CI",
                "event": "pull_request",
                "headBranch": "agent/example",
                "conclusion": "failure",
                "url": "https://github.com/river-li/brok-pot-harness/actions/runs/101",
            },
            {
                "databaseId": 102,
                "workflowName": "Required CI",
                "event": "pull_request",
                "headBranch": "agent/example",
                "conclusion": "failure",
                "url": "https://github.com/river-li/brok-pot-harness/actions/runs/102",
            },
            {
                "databaseId": 101,
                "workflowName": "Required CI",
                "event": "pull_request",
                "headBranch": "agent/example",
                "conclusion": "failure",
                "url": "https://github.com/river-li/brok-pot-harness/actions/runs/101",
            },
        ]

        report = triage.format_triage_report(
            "river-li/brok-pot-harness",
            issues,
            runs,
            100,
        )

        self.assertIn("#7 [OPEN] Cannot install MCP plugin", report)
        self.assertIn("#9 [CLOSED] cannot install: MCP plugin", report)
        self.assertIn("2 failed runs", report)
        self.assertEqual(report.count("actions/runs/101"), 1)
        self.assertIn("Grouping uses workflow, event, and branch only", report)
        self.assertNotIn("raw-secret-value", report)
        self.assertNotIn("transcript should stay private", report)

    def test_merged_pr31_failure_is_historical_and_reports_the_actual_failed_gate(self) -> None:
        current_main = "a" * 40
        run = {
            "databaseId": 35928497679,
            "workflowName": "Required CI",
            "event": "pull_request",
            "headBranch": "agent/pr31",
            "headSha": "b" * 40,
            "conclusion": "failure",
            "url": "https://github.com/river-li/brok-pot-harness/actions/runs/35928497679",
            "createdAt": "2026-09-23T22:00:00Z",
        }
        pr = {
            "number": 31,
            "state": "MERGED",
            "headRefName": "agent/pr31",
            "headRefOid": "b" * 40,
            "baseRefName": "main",
            "baseRefOid": "c" * 40,
        }
        details = {
            "jobs": [
                {
                    "name": "Offline gates",
                    "conclusion": "failure",
                    "steps": [
                        {"name": "Require current main as the PR base", "conclusion": "failure"},
                        {"name": "Install root dependencies from lockfile", "conclusion": "skipped"},
                        {"name": "Run required offline gates", "conclusion": "skipped"},
                    ],
                }
            ]
        }
        report = triage.format_triage_report(
            "river-li/brok-pot-harness",
            [],
            [run],
            100,
            [pr],
            current_main,
            {str(run["databaseId"]): details},
        )

        self.assertIn("historical: PR #31 is merged", report)
        self.assertIn("does not establish a product regression", report)
        self.assertIn("Require current main as the PR base", report)
        self.assertIn("Install root dependencies from lockfile", report)
        self.assertIn("Run required offline gates", report)


class ReviewLabelInvalidationTests(unittest.TestCase):
    def test_pull_request_head_or_base_update_removes_only_review_labels(self) -> None:
        calls = []

        def fake_api(repository, endpoint, method="GET", paginate=False):
            calls.append((endpoint, method, paginate))
            if endpoint.endswith("/labels?per_page=100"):
                first_page = [
                    {"name": "other-label-{}".format(number)}
                    for number in range(100)
                ]
                next_page = [
                    {"name": "review:ready-to-merge"},
                    {"name": "review:changes-requested"},
                    {"name": "review:pending"},
                    {"name": "area:tools"},
                ]
                return [first_page, next_page]
            return None

        payload = {"action": "synchronize", "pull_request": {"number": 17}}
        changed = invalidate_labels.invalidate_stale_labels(
            "pull_request_target",
            payload,
            "river-li/brok-pot-harness",
            fake_api,
        )

        self.assertEqual(
            changed,
            {
                17: [
                    "review:ready-to-merge",
                    "review:changes-requested",
                    "review:pending",
                ]
            },
        )
        deleted = [call for call in calls if call[1] == "DELETE"]
        self.assertEqual(len(deleted), 3)
        self.assertTrue(all("area%3Atools" not in call[0] for call in deleted))
        label_query = next(call for call in calls if call[0].endswith("labels?per_page=100"))
        self.assertTrue(label_query[2])

    def test_malformed_label_pages_fail_closed_without_removing_a_partial_set(self) -> None:
        calls = []

        def fake_api(repository, endpoint, method="GET", paginate=False):
            calls.append((endpoint, method, paginate))
            if endpoint.endswith("labels?per_page=100"):
                return [[{"name": "area:tools"}, None]]
            return None

        with self.assertRaises(invalidate_labels.InvalidationError):
            invalidate_labels.invalidate_stale_labels(
                "pull_request_target",
                {"action": "synchronize", "pull_request": {"number": 17}},
                "river-li/brok-pot-harness",
                fake_api,
            )

        self.assertFalse(any(method == "DELETE" for _, method, _ in calls))

    def test_main_push_invalidates_all_open_main_prs_and_irrelevant_events_do_nothing(self) -> None:
        calls = []

        def fake_api(repository, endpoint, method="GET", paginate=False):
            calls.append((endpoint, method, paginate))
            if endpoint.endswith("/pulls?state=open&base=main&per_page=100"):
                return [
                    {"number": 4, "base": {"ref": "main"}},
                    {"number": 5, "base": {"ref": "release"}},
                ]
            if endpoint.endswith("/issues/4/labels?per_page=100"):
                return [{"name": "review:ready-to-merge"}]
            if endpoint.endswith("/issues/5/labels?per_page=100"):
                return [{"name": "review:ready-to-merge"}]
            return None

        changed = invalidate_labels.invalidate_stale_labels(
            "push",
            {"ref": "refs/heads/main"},
            "river-li/brok-pot-harness",
            fake_api,
        )
        self.assertEqual(changed, {4: ["review:ready-to-merge"]})
        self.assertIn(
            (
                "repos/river-li/brok-pot-harness/pulls?state=open&base=main&per_page=100",
                "GET",
                True,
            ),
            calls,
        )

        calls.clear()
        no_change = invalidate_labels.invalidate_stale_labels(
            "pull_request_target",
            {"action": "edited", "pull_request": {"number": 4}, "changes": {"title": {}}},
            "river-li/brok-pot-harness",
            fake_api,
        )
        self.assertEqual(no_change, {})
        self.assertEqual(calls, [])

        no_change = invalidate_labels.invalidate_stale_labels(
            "push",
            {"ref": "refs/heads/release"},
            "river-li/brok-pot-harness",
            fake_api,
        )
        self.assertEqual(no_change, {})
        self.assertEqual(calls, [])

    def test_invalidation_workflow_uses_trusted_main_and_narrow_permissions(self) -> None:
        workflow = (
            TOOLS_DIRECTORY.parent
            / ".github"
            / "workflows"
            / "invalidate-review-readiness.yml"
        ).read_text(encoding="utf-8")

        self.assertIn("pull_request_target:", workflow)
        self.assertIn("branches: [main]", workflow)
        self.assertIn("types: [synchronize, edited]", workflow)
        self.assertIn("ref: main", workflow)
        self.assertIn("persist-credentials: false", workflow)
        self.assertIn("contents: read", workflow)
        self.assertIn("issues: write", workflow)
        self.assertIn("pull-requests: read", workflow)
        self.assertNotIn("contents: write", workflow)
        self.assertNotIn("review:pending", workflow)


if __name__ == "__main__":
    unittest.main()

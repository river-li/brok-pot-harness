"""Offline tests for the bounded, read-only triage report."""

from contextlib import redirect_stderr, redirect_stdout
from datetime import datetime, timezone
import importlib.util
import io
import json
from pathlib import Path
import tempfile
import unittest
from unittest.mock import patch


spec = importlib.util.spec_from_file_location("triage", Path(__file__).with_name("triage.py"))
triage = importlib.util.module_from_spec(spec)
spec.loader.exec_module(triage)


class TriageReportTest(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name)
        (self.root / ".github").mkdir()
        (self.root / "docs/wiki").mkdir(parents=True)
        (self.root / ".github/issue-labels.yml").write_text(
            "labels:\n  - name: area:runtime\n  - name: priority:normal\n"
            "  - name: status:needs-triage\n  - name: status:in-progress\n",
            encoding="utf-8",
        )
        (self.root / "package.json").write_text('{"version":"0.0.0-reconstructed"}', encoding="utf-8")
        (self.root / "docs/wiki/Features.md").write_text(
            "## Support status\n\n| Status | Capabilities |\n| --- | --- |\n"
            "| Current-version integration coverage | Desktop and local execution |\n"
            "| Still need local adapters | Messages integration |\n\n## Later\n",
            encoding="utf-8",
        )
        (self.root / "docs/wiki/Verification.md").write_text(
            "## Coverage still needed\n\n- Full voice calls.\n- Physical audio devices.\n\n## Later\n",
            encoding="utf-8",
        )
        self.now = datetime(2026, 9, 23, tzinfo=timezone.utc)

    def issue(self, number, body="", title="safe fixture title", updated="2026-09-20T00:00:00Z", labels=None):
        return {
            "number": number,
            "title": title,
            "body": body,
            "updatedAt": updated,
            "createdAt": "2026-08-01T00:00:00Z",
            "labels": labels or [],
        }

    def ci_run(self, ident, conclusion, created, sha, *, branch="main", jobs=None, workflow="CI"):
        return {
            "databaseId": ident,
            "workflowName": workflow,
            "headBranch": branch,
            "headSha": sha,
            "createdAt": created,
            "conclusion": conclusion,
            "jobs": jobs or [{"name": "tests", "conclusion": "failure"}],
        }

    def report(self, issues, runs, prs=None, diagnostics_dir=None):
        return triage.build_report(
            issues, runs, prs, repo="example/project", root=self.root,
            diagnostics_dir=diagnostics_dir, now=self.now,
        )

    def test_repeated_ci_failures_group_and_link_to_prior_green_revision(self):
        runs = [
            self.ci_run(10, "success", "2026-09-10T00:00:00Z", "a" * 40),
            self.ci_run(11, "failure", "2026-09-11T00:00:00Z", "b" * 40),
            self.ci_run(12, "failure", "2026-09-12T00:00:00Z", "c" * 40),
        ]
        report = self.report([], runs)
        self.assertIn("1 new signature group(s)", report)
        self.assertIn("run #11", report)
        self.assertIn("run #12", report)
        self.assertIn("Reproduction status: Failed in CI; not checked outside CI", report)
        self.assertIn("Last known good release/revision: " + "a" * 40, report)
        self.assertIn("First known bad release/revision: " + "b" * 40, report)
        self.assertIn("workflow/job level", report)

    def test_exact_signature_suppresses_new_proposal(self):
        run = self.ci_run(21, "failure", "2026-09-12T00:00:00Z", "b" * 40)
        signature = triage.signature_for("CI", ["tests"], [])
        issue = self.issue(7, f"Triage failure signature: {signature}\nReproduction status: Failed in CI")
        report = self.report([issue], [run])
        self.assertIn("No untracked CI failure signature produced a new proposal", report)
        self.assertIn(f"{signature} is already recorded on [#7]", report)

    def test_likely_legacy_duplicate_is_held_for_human_review(self):
        diagnostics = self.root / "diagnostics"
        diagnostics.mkdir()
        (diagnostics / "31.txt").write_text("TypeError at a private path", encoding="utf-8")
        run = self.ci_run(31, "failure", "2026-09-12T00:00:00Z", "d" * 40)
        issue = self.issue(9, "Workflow CI job tests TypeError during the same run")
        report = self.report([issue], [run], diagnostics_dir=diagnostics)
        self.assertNotIn("### Proposed issue:", report)
        self.assertIn("manual duplicate review against #9", report)

    def test_report_does_not_render_issue_text_or_raw_diagnostics(self):
        token = "ghp_" + "A" * 32
        private_text = "private conversation phrase that must never appear"
        body = (
            f"Triage failure signature: v1:sha256:{'f' * 64}\n"
            f"Actual behavior: {private_text}\nSanitized diagnostics: Authorization: Bearer {token}\n"
            "User path: /Users/alice/project/private.txt\nContact alice@example.com"
        )
        issue = self.issue(3, body=body, title=f"{private_text} alice@example.com")
        diagnostics = self.root / "diagnostics"
        diagnostics.mkdir()
        (diagnostics / "44.txt").write_text(
            f"TypeError Authorization: Bearer {token}; {private_text}; /Users/alice/session.txt",
            encoding="utf-8",
        )
        run = self.ci_run(44, "failure", "2026-09-12T00:00:00Z", "e" * 40)
        report = self.report([issue], [run], diagnostics_dir=diagnostics)
        for forbidden in [token, private_text, "alice@example.com", "/Users/alice", "Sanitized diagnostics"]:
            self.assertNotIn(forbidden, report)
        self.assertIn("TypeError", report)

    def test_issue_form_release_field_stale_and_merged_unverified_follow_up(self):
        issue = self.issue(
            14,
            "### Project release or revision\n\nv1.2.3\n\n"
            "Reproduction status: suspected regression\nFix PR: #88\nVerification evidence: Pending",
            updated="2026-07-01T00:00:00Z",
            labels=[{"name": "area:runtime"}, {"name": "status:in-progress"}],
        )
        report = self.report([issue], [], {88: {"number": 88, "state": "merged"}})
        self.assertIn("stale (30+ days", report.lower())
        self.assertIn("issue #14", report)
        self.assertIn("PR #88", report)
        self.assertIn("suspected regression", report)
        self.assertIn("v1.2.3", report)

    def test_diagnostic_identifiers_are_allowlisted_and_read_size_is_bounded(self):
        self.assertEqual(triage.safe_release("/Users/alice/build"), "Present in issue; omitted as unrecognized")
        self.assertEqual(triage.diagnostic_tokens("Token=ghp_" + "B" * 40 + " TS2345"), ["TS2345"])
        diagnostics = self.root / "diagnostics"
        diagnostics.mkdir()
        (diagnostics / "55.txt").write_bytes(b"TypeError" + b"x" * (triage.MAX_DIAGNOSTIC_BYTES + 10))
        excerpt, truncated = triage.diagnostic_for(
            self.ci_run(55, "failure", "2026-09-12T00:00:00Z", "f" * 40), diagnostics,
        )
        self.assertTrue(truncated)
        self.assertEqual(len(excerpt.encode("utf-8")), triage.MAX_DIAGNOSTIC_BYTES)

    def test_proposal_cap_is_enforced(self):
        runs = [
            self.ci_run(61, "failure", "2026-09-01T00:00:00Z", "a" * 40,
                     jobs=[{"name": "unit", "conclusion": "failure"}]),
            self.ci_run(62, "failure", "2026-09-02T00:00:00Z", "b" * 40,
                     jobs=[{"name": "build", "conclusion": "failure"}]),
        ]
        candidates, notes = triage.collect_candidates(runs, [], None, "example/project", "1.0.0", 1)
        self.assertEqual(len(candidates), 1)
        self.assertTrue(any("Proposal cap" in note for note in notes))

    def test_offline_cli_dry_run_never_calls_github(self):
        issues = self.root / "issues.json"
        runs = self.root / "runs.json"
        issues.write_text("[]", encoding="utf-8")
        runs.write_text("[]", encoding="utf-8")
        output = io.StringIO()
        with patch.object(triage, "command") as gh_command, redirect_stdout(output):
            status = triage.main([
                "--dry-run", "--issues-json", str(issues), "--runs-json", str(runs),
                "--repo", "example/project", "--output", "-",
            ])
        self.assertEqual(status, 0)
        gh_command.assert_not_called()
        self.assertIn("Read-only issue triage report", output.getvalue())

    def test_cli_selected_repo_scopes_issue_run_job_and_pr_reads(self):
        commands = []

        def fake_gh_json(args, max_bytes=triage.MAX_RESPONSE_BYTES):
            commands.append(args)
            if args[:2] == ["issue", "list"]:
                return [self.issue(7, "Fix PR: #88")]
            if args[:2] == ["run", "list"]:
                return [self.ci_run(123, "failure", "2026-09-22T00:00:00Z", "a" * 40)]
            if args[:2] == ["run", "view"]:
                return {"jobs": [{"name": "tests", "conclusion": "failure"}]}
            if args[:2] == ["pr", "view"]:
                return {"number": 88, "state": "MERGED", "mergedAt": "2026-09-22T00:00:00Z"}
            self.fail(f"Unexpected GitHub read command: {args[:2]}")

        output = io.StringIO()
        with patch.object(triage, "gh_json", side_effect=fake_gh_json), redirect_stdout(output):
            status = triage.main(["--dry-run", "--repo", "example/target", "--output", "-"])

        self.assertEqual(status, 0)
        self.assertEqual([args[:2] for args in commands], [
            ["issue", "list"], ["run", "list"], ["run", "view"], ["pr", "view"],
        ])
        for args in commands:
            with self.subTest(command=args[:2]):
                self.assertIn("--repo", args)
                self.assertEqual(args[args.index("--repo") + 1], "example/target")
        self.assertIn("Read-only issue triage report", output.getvalue())

    def test_cli_requires_explicit_dry_run_and_bounds_inputs(self):
        for args in ([], ["--dry-run", "--max-issues", "101"]):
            with redirect_stderr(io.StringIO()), self.assertRaises(SystemExit) as error:
                triage.parse_args(args)
            self.assertEqual(error.exception.code, 2)
        with self.assertRaises(triage.TriageError):
            triage.load_json(self.root / "missing.json", list)
        invalid = self.root / "invalid.json"
        invalid.write_text("{}", encoding="utf-8")
        with self.assertRaises(triage.TriageError):
            triage.load_json(invalid, list)
        with self.assertRaises(triage.TriageError):
            triage.validate_diagnostics_dir(self.root)


if __name__ == "__main__":
    unittest.main()

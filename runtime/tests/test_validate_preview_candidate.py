import importlib.util
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
SPEC = importlib.util.spec_from_file_location(
    "validate_preview_candidate", ROOT / "runtime/tools/validate-preview-candidate.py"
)
MODULE = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(MODULE)


def fixture():
    source = "a" * 40
    run = {
        "workflow_id": 13,
        "event": "push",
        "head_branch": "agent/preview-release",
        "head_sha": source,
        "status": "completed",
        "conclusion": "success",
        "run_attempt": 2,
    }
    workflow = {"id": 13, "path": MODULE.WORKFLOW_PATH, "state": "active"}
    jobs = {"jobs": [
        {"name": name, "status": "completed", "conclusion": "success"}
        for name in MODULE.REQUIRED_JOBS
    ]}
    pulls = [{
        "number": 52,
        "state": "closed",
        "merged_at": "2026-09-24T12:00:00Z",
        "base": {"ref": "main"},
        "head": {"ref": "agent/preview-release", "sha": source},
    }]
    return run, workflow, jobs, pulls, source


class CandidateValidationTests(unittest.TestCase):
    def validate(self, data):
        run, workflow, jobs, pulls, source = data
        return MODULE.validate_candidate(run, workflow, jobs, pulls, source, 2, "0.1.0-preview.1")

    def test_accepts_only_exact_passed_source_run_and_merged_pr(self):
        result = self.validate(fixture())
        self.assertEqual(result["sourceCommit"], "a" * 40)
        self.assertEqual(result["mergedPullRequests"], [52])

    def test_rejects_a_successful_attempt_for_different_source(self):
        data = fixture()
        data[0]["head_sha"] = "b" * 40
        with self.assertRaisesRegex(ValueError, "identity, attempt, or conclusion"):
            self.validate(data)

    def test_rejects_any_failed_required_job(self):
        data = fixture()
        data[2]["jobs"][0]["conclusion"] = "failure"
        with self.assertRaisesRegex(ValueError, "did not pass"):
            self.validate(data)

    def test_rejects_run_without_merged_source_pr(self):
        data = fixture()
        data[3][0]["merged_at"] = None
        with self.assertRaisesRegex(ValueError, "no merged PR"):
            self.validate(data)

    def test_rejects_candidate_from_another_workflow(self):
        data = fixture()
        data[1]["path"] = ".github/workflows/other.yml"
        with self.assertRaisesRegex(ValueError, "not the active trusted workflow"):
            self.validate(data)


if __name__ == "__main__":
    unittest.main()

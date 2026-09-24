#!/usr/bin/env python3
"""Fail closed unless one exact candidate run passed and its source PR merged."""

import argparse
import json
import re
import sys
from pathlib import Path


WORKFLOW_PATH = ".github/workflows/preview-release-candidate.yml"
SOURCE_BRANCH = "agent/preview-release"
REQUIRED_JOBS = {
    "server candidate (linux/amd64)",
    "remote client candidate (macOS arm64)",
    "attest candidate artifacts",
}


def load_json(path):
    return json.loads(Path(path).read_text())


def validate_candidate(run, workflow, jobs, pulls, source_sha, attempt, release_version):
    if not re.fullmatch(r"[0-9a-f]{40}", source_sha):
        raise ValueError("candidate source SHA must be a full lowercase commit SHA")
    if not re.fullmatch(r"[0-9]+", str(attempt)) or int(attempt) < 1:
        raise ValueError("candidate run attempt must be a positive integer")
    if not re.fullmatch(r"[0-9]+\.[0-9]+\.[0-9]+-preview\.[0-9]+", release_version):
        raise ValueError("release version must be a preview version")
    if workflow.get("path") != WORKFLOW_PATH or workflow.get("state") != "active":
        raise ValueError("candidate workflow is not the active trusted workflow")
    if run.get("workflow_id") != workflow.get("id"):
        raise ValueError("candidate run did not use the trusted workflow")
    if (run.get("event") != "push" or run.get("head_branch") != SOURCE_BRANCH or
            run.get("head_sha") != source_sha or run.get("status") != "completed" or
            run.get("conclusion") != "success" or run.get("run_attempt") != int(attempt)):
        raise ValueError("candidate run identity, attempt, or conclusion does not match the requested source")

    job_rows = jobs.get("jobs")
    if not isinstance(job_rows, list):
        raise ValueError("candidate run jobs response is invalid")
    passed = set()
    for job in job_rows:
        name = job.get("name")
        if name in REQUIRED_JOBS:
            if name in passed or job.get("status") != "completed" or job.get("conclusion") != "success":
                raise ValueError(f"required candidate job did not pass exactly once: {name}")
            passed.add(name)
    if passed != REQUIRED_JOBS:
        missing = ", ".join(sorted(REQUIRED_JOBS - passed))
        raise ValueError(f"candidate is missing successful required jobs: {missing}")

    merged = [pull for pull in pulls if pull.get("state") == "closed" and pull.get("merged_at") and
              pull.get("base", {}).get("ref") == "main" and
              pull.get("head", {}).get("ref") == SOURCE_BRANCH and
              pull.get("head", {}).get("sha") == source_sha]
    if not merged:
        raise ValueError("candidate source commit has no merged PR to main")
    return {
        "sourceCommit": source_sha,
        "releaseVersion": release_version,
        "candidateAttempt": int(attempt),
        "trustedWorkflow": WORKFLOW_PATH,
        "passedJobs": sorted(passed),
        "mergedPullRequests": sorted(pull["number"] for pull in merged),
    }


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--run", required=True, type=Path)
    parser.add_argument("--workflow", required=True, type=Path)
    parser.add_argument("--jobs", required=True, type=Path)
    parser.add_argument("--pulls", required=True, type=Path)
    parser.add_argument("--source-sha", required=True)
    parser.add_argument("--attempt", required=True)
    parser.add_argument("--release-version", required=True)
    parser.add_argument("--repository-root", type=Path, default=Path.cwd())
    args = parser.parse_args()
    project = json.loads((args.repository_root / "release/project.json").read_text())
    if project.get("projectVersion") != args.release_version:
        raise ValueError("requested release version does not match the trusted main-branch project version")
    result = validate_candidate(
        load_json(args.run), load_json(args.workflow), load_json(args.jobs),
        load_json(args.pulls), args.source_sha, args.attempt, args.release_version,
    )
    print(json.dumps(result, indent=2))


if __name__ == "__main__":
    try:
        main()
    except (OSError, json.JSONDecodeError, ValueError) as error:
        print(f"candidate validation failed: {error}", file=sys.stderr)
        raise SystemExit(1)

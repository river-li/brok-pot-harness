"""Bounded, read-only issue and workflow-run candidate reports."""

import re
import unicodedata
from pathlib import Path
from typing import Dict, List, Mapping, Optional, Sequence, Tuple

from .common import (
    MaintenanceError,
    repository_argument,
    repository_identity,
    repository_root,
    run_gh_json,
    safe_evidence_url,
    sanitize_text,
)


FAILURE_CONCLUSIONS = {"failure", "timed_out", "startup_failure"}
MAX_JOB_SUMMARIES = 20


def normalize_issue_title(title: str) -> str:
    normalized = unicodedata.normalize("NFKC", title).casefold()
    normalized = re.sub(r"[^\w]+", " ", normalized, flags=re.UNICODE)
    return " ".join(normalized.split())


def issue_duplicate_groups(issues: Sequence[Mapping[str, object]]) -> List[List[Mapping[str, object]]]:
    grouped: Dict[str, List[Mapping[str, object]]] = {}
    for issue in issues:
        title = issue.get("title")
        if not isinstance(title, str):
            continue
        normalized = normalize_issue_title(title)
        if normalized:
            grouped.setdefault(normalized, []).append(issue)
    return [group for group in grouped.values() if len(group) > 1]


def run_identity(run: Mapping[str, object]) -> str:
    database_id = run.get("databaseId")
    if database_id is not None:
        return str(database_id)
    return str(run.get("url") or "")


def is_failed_run(run: Mapping[str, object]) -> bool:
    conclusion = str(run.get("conclusion") or "").casefold()
    status = str(run.get("status") or "").casefold()
    return conclusion in FAILURE_CONCLUSIONS or status in FAILURE_CONCLUSIONS


def is_action_required_run(run: Mapping[str, object]) -> bool:
    return str(run.get("conclusion") or run.get("status") or "").casefold() == "action_required"


def repeat_failure_groups(
    runs: Sequence[Mapping[str, object]],
) -> Tuple[List[List[Mapping[str, object]]], List[Mapping[str, object]]]:
    seen_ids = set()
    grouped: Dict[Tuple[str, str, str], List[Mapping[str, object]]] = {}
    failures: List[Mapping[str, object]] = []
    for run in runs:
        identity = run_identity(run)
        if not identity or identity in seen_ids or not is_failed_run(run):
            continue
        seen_ids.add(identity)
        failures.append(run)
        workflow = str(run.get("workflowName") or run.get("name") or "Unknown workflow")
        event = str(run.get("event") or "unknown event")
        branch = str(run.get("headBranch") or "unknown branch")
        grouped.setdefault((workflow, event, branch), []).append(run)
    repeated = [group for group in grouped.values() if len(group) > 1]
    repeated_ids = {run_identity(run) for group in repeated for run in group}
    single_runs = [run for run in failures if run_identity(run) not in repeated_ids]
    return repeated, single_runs


def issue_reference(issue: Mapping[str, object], repository: str) -> str:
    number = issue.get("number")
    state = sanitize_text(issue.get("state")).upper()
    title = sanitize_text(issue.get("title")) or "(untitled)"
    url = safe_evidence_url(issue.get("url"))
    expected_prefix = "https://github.com/{}/issues/".format(repository)
    state_label = " [{}]".format(state) if state else ""
    if url and url.startswith(expected_prefix):
        return "#{}{} {} — {}".format(number, state_label, title, url)
    return "#{}{} {}".format(number, state_label, title)


def run_context(
    run: Mapping[str, object],
    pull_requests: Sequence[Mapping[str, object]],
    current_main: str,
) -> str:
    branch = str(run.get("headBranch") or "")
    head_sha = str(run.get("headSha") or "").lower()
    matching_branch = [pr for pr in pull_requests if pr.get("headRefName") == branch]
    exact_matches = [pr for pr in matching_branch if str(pr.get("headRefOid") or "").lower() == head_sha]
    pull_request = exact_matches[0] if exact_matches else (matching_branch[0] if matching_branch else None)
    if pull_request:
        number = pull_request.get("number", "?")
        state = str(pull_request.get("state") or "").upper()
        if state == "MERGED":
            return (
                "historical: PR #{} is merged; this failure does not establish a product regression"
            ).format(number)
        if state != "OPEN":
            return "historical: PR #{} is closed".format(number)
        current_head = str(pull_request.get("headRefOid") or "").lower()
        current_base = str(pull_request.get("baseRefOid") or "").lower()
        if current_head != head_sha:
            return "historical: PR #{} has advanced beyond this run's head".format(number)
        if pull_request.get("baseRefName") != "main" or current_base != current_main.lower():
            return "attention needed: PR #{} is not based on current main".format(number)
        return "current PR #{} head/base".format(number)
    if branch == "main":
        if head_sha == current_main.lower():
            return "current main head"
        return "historical: main has advanced beyond this run"
    return "attention needed: no matching current or historical PR was found in the sample"


def summarize_job_steps(details: Mapping[str, object]) -> List[str]:
    jobs = details.get("jobs") if isinstance(details, dict) else None
    if not isinstance(jobs, list):
        return []
    failed_steps = []
    skipped_steps = []
    failed_jobs = []
    for job in jobs:
        if not isinstance(job, dict):
            continue
        job_name = sanitize_text(job.get("name")) or "Unnamed job"
        if str(job.get("conclusion") or "").casefold() == "failure":
            failed_jobs.append(job_name)
        steps = job.get("steps")
        if not isinstance(steps, list):
            continue
        for step in steps:
            if not isinstance(step, dict):
                continue
            name = sanitize_text(step.get("name")) or "Unnamed step"
            conclusion = str(step.get("conclusion") or "").casefold()
            if conclusion == "failure":
                failed_steps.append(name)
            elif conclusion == "skipped":
                skipped_steps.append(name)
    summaries = []
    if failed_jobs:
        summaries.append("failed jobs: {}".format(", ".join(failed_jobs)))
    if failed_steps:
        summaries.append("failed steps: {}".format(", ".join(failed_steps)))
    if skipped_steps:
        summaries.append("skipped steps: {}".format(", ".join(skipped_steps)))
    return summaries


def run_reference(
    run: Mapping[str, object],
    pull_requests: Sequence[Mapping[str, object]],
    current_main: str,
    details: Mapping[str, object],
) -> str:
    workflow = sanitize_text(run.get("workflowName") or run.get("name")) or "Unknown workflow"
    branch = sanitize_text(run.get("headBranch")) or "unknown branch"
    event = sanitize_text(run.get("event")) or "unknown event"
    url = safe_evidence_url(run.get("url"))
    reference = "{} / {} / {}".format(workflow, event, branch)
    if url:
        reference = "{} — {}".format(reference, url)
    return "{}; {}".format(reference, run_context(run, pull_requests, current_main))


def format_triage_report(
    repository: str,
    issues: Sequence[Mapping[str, object]],
    runs: Sequence[Mapping[str, object]],
    limit: int,
    pull_requests: Sequence[Mapping[str, object]] = (),
    current_main: str = "",
    job_summaries: Optional[Mapping[str, Mapping[str, object]]] = None,
) -> str:
    job_summaries = job_summaries or {}
    duplicate_groups = issue_duplicate_groups(issues)
    repeated_runs, single_runs = repeat_failure_groups(runs)
    action_required_runs = [run for run in runs if is_action_required_run(run)]
    duplicate_numbers = {
        str(issue.get("number")) for group in duplicate_groups for issue in group
    }
    other_open_issues = [
        issue
        for issue in issues
        if str(issue.get("state") or "").upper() == "OPEN"
        and str(issue.get("number")) not in duplicate_numbers
    ]
    lines = [
        "# Maintenance triage dry-run",
        "",
        "Repository: {}".format(repository),
        "Read-only sample: up to {} recent issues and {} workflow runs.".format(limit, limit),
        "No issue, label, comment, or workflow state was changed. Issue bodies and run logs are not included.",
        "",
        "## Possible duplicate issue titles",
    ]
    if not duplicate_groups:
        lines.append("No exact normalized-title groups were found in this sample.")
    else:
        lines.append(
            "These are candidates only. Compare profile, baseline, component, and reproduction "
            "before linking or labeling."
        )
        for group in duplicate_groups:
            lines.append("")
            lines.append("- Candidate group:")
            for issue in sorted(group, key=lambda item: int(item.get("number") or 0)):
                lines.append("  - " + issue_reference(issue, repository))
    lines.extend(["", "## Other sampled open issues"])
    if not other_open_issues:
        lines.append("No additional open issue was found in this sample.")
    else:
        for issue in sorted(other_open_issues, key=lambda item: int(item.get("number") or 0)):
            lines.append("- " + issue_reference(issue, repository))
    lines.extend(["", "## Repeated CI failures"])
    if not repeated_runs:
        lines.append("No repeated workflow/event/branch groups were found in this sample.")
    else:
        lines.append(
            "Grouping uses workflow, event, and branch only; it does not prove a common root cause."
        )
        for group in repeated_runs:
            first = group[0]
            workflow = sanitize_text(first.get("workflowName") or first.get("name")) or "Unknown workflow"
            event = sanitize_text(first.get("event")) or "unknown event"
            branch = sanitize_text(first.get("headBranch")) or "unknown branch"
            lines.append("")
            lines.append("- {} / {} / {}: {} failed runs".format(workflow, event, branch, len(group)))
            for run in sorted(group, key=lambda item: str(item.get("createdAt") or "")):
                details = job_summaries.get(run_identity(run), {})
                lines.append("  - " + run_reference(run, pull_requests, current_main, details))
                for summary in summarize_job_steps(details):
                    lines.append("    - " + summary)
    lines.extend(["", "## Other recent failed runs"])
    if not single_runs:
        lines.append("No ungrouped recent failures were found.")
    else:
        for run in sorted(single_runs, key=lambda item: str(item.get("createdAt") or "")):
            details = job_summaries.get(run_identity(run), {})
            lines.append("- " + run_reference(run, pull_requests, current_main, details))
            for summary in summarize_job_steps(details):
                lines.append("  - " + summary)
    lines.extend(["", "## Runs requiring an external action"])
    if not action_required_runs:
        lines.append("No recent action-required workflow runs were found.")
    else:
        lines.append(
            "An action-required conclusion can indicate an approval gate; it is not reported as "
            "a failed product check."
        )
        for run in sorted(action_required_runs, key=lambda item: str(item.get("createdAt") or "")):
            lines.append("- " + run_reference(run, pull_requests, current_main, {}))
    lines.extend(
        [
            "",
            "## Suggested next step",
            (
                "Open the linked issue or failed-run evidence, compare the actual reproduction "
                "or failed job, and record one actionable owner/evidence pair. Create or label "
                "issues only under explicit task authority."
            ),
        ]
    )
    return "\n".join(lines) + "\n"


def fetch_triage_report(start: Path, limit: int = 100) -> str:
    if limit < 1 or limit > 100:
        raise MaintenanceError("--limit must be between 1 and 100.")
    root = repository_root(start)
    repository, host = repository_identity(root)
    gh_repository = repository_argument(repository, host)
    issue_result = run_gh_json(
        [
            "issue",
            "list",
            "--repo",
            gh_repository,
            "--state",
            "all",
            "--limit",
            str(limit),
            "--json",
            "number,title,state,url,updatedAt",
        ],
        root,
    )
    run_result = run_gh_json(
        [
            "run",
            "list",
            "--repo",
            gh_repository,
            "--limit",
            str(limit),
            "--json",
            "databaseId,workflowName,event,headBranch,headSha,status,conclusion,url,createdAt",
        ],
        root,
    )
    pull_request_result = run_gh_json(
        [
            "pr",
            "list",
            "--repo",
            gh_repository,
            "--state",
            "all",
            "--limit",
            str(limit),
            "--json",
            "number,state,mergedAt,headRefName,headRefOid,baseRefName,baseRefOid,url",
        ],
        root,
    )
    current_main_result = run_gh_json(
        ["api", "--hostname", host, "repos/{}/branches/main".format(repository)],
        root,
    )
    if (
        not isinstance(issue_result, list)
        or not isinstance(run_result, list)
        or not isinstance(pull_request_result, list)
    ):
        raise MaintenanceError("GitHub returned an unexpected issue, PR, or workflow-run list.")
    main_commit = current_main_result.get("commit") if isinstance(current_main_result, dict) else None
    current_main = main_commit.get("sha") if isinstance(main_commit, dict) else None
    if not isinstance(current_main, str) or not re.fullmatch(r"[0-9a-fA-F]{40,64}", current_main):
        raise MaintenanceError("GitHub did not return current main commit evidence.")
    failures = [run for run in run_result if isinstance(run, dict) and is_failed_run(run)]
    job_summaries: Dict[str, Mapping[str, object]] = {}
    for run in failures[:MAX_JOB_SUMMARIES]:
        identity = run_identity(run)
        if not identity.isdigit():
            continue
        detail = run_gh_json(
            ["run", "view", identity, "--repo", gh_repository, "--json", "jobs"],
            root,
        )
        if isinstance(detail, dict):
            job_summaries[identity] = detail
    return format_triage_report(
        repository,
        issue_result,
        run_result,
        limit,
        pull_request_result,
        current_main,
        job_summaries,
    )

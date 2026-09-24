"""Read-only PR readiness evidence tied to live head, base, checks, and reviewer account."""

import json
import re
import subprocess
from pathlib import Path
from typing import Dict, List, Mapping, Optional, Sequence, Tuple

from .common import (
    MaintenanceError,
    github_main_sha,
    repository_argument,
    repository_identity,
    repository_root,
    run_gh_json,
    safe_evidence_url,
    sanitize_text,
)
from .tasks import find_task_assignment, validate_reviewer_account


SHA_PATTERN = re.compile(r"^(?:[0-9a-f]{40}|[0-9a-f]{64})$", re.IGNORECASE)
METADATA_BLOCK_PATTERN = re.compile(
    r"<details>\s*<summary>GBH review evidence</summary>(.*?)</details>",
    re.IGNORECASE | re.DOTALL,
)


def parse_review_verdict(body: object) -> Optional[Tuple[str, str, str]]:
    if not isinstance(body, str):
        return None
    block = METADATA_BLOCK_PATTERN.search(body)
    if not block:
        return None
    fields = {}
    for line in block.group(1).splitlines():
        key, separator, value = line.strip().partition(":")
        if separator:
            fields[key.strip().casefold()] = value.strip()
    verdict = fields.get("verdict", "").upper()
    head = fields.get("head-sha", "").lower()
    base = fields.get("base-sha", "").lower()
    if verdict not in {"READY_TO_MERGE", "NEEDS_CHANGES"}:
        return None
    if not SHA_PATTERN.fullmatch(head) or not SHA_PATTERN.fullmatch(base):
        return None
    return verdict, head, base


def latest_reviews_by_actor(
    reviews: Sequence[Mapping[str, object]], formal_only: bool = False
) -> Dict[str, Mapping[str, object]]:
    latest: Dict[str, Mapping[str, object]] = {}
    formal_states = {"APPROVED", "CHANGES_REQUESTED", "DISMISSED"}
    for review in reviews:
        user = review.get("user")
        login = user.get("login") if isinstance(user, dict) else None
        submitted_at = review.get("submitted_at")
        state = str(review.get("state") or "").upper()
        if not isinstance(login, str) or not login or not isinstance(submitted_at, str):
            continue
        if formal_only and state not in formal_states:
            continue
        key = login.casefold()
        previous = latest.get(key)
        previous_time = previous.get("submitted_at") if previous else None
        previous_id = int(previous.get("id") or 0) if previous else 0
        review_id = int(review.get("id") or 0)
        if not isinstance(previous_time, str) or (submitted_at, review_id) >= (previous_time, previous_id):
            latest[key] = review
    return latest


def latest_process_verdicts(
    reviews: Sequence[Mapping[str, object]],
) -> Dict[str, Tuple[Mapping[str, object], Tuple[str, str, str]]]:
    latest: Dict[str, Tuple[Mapping[str, object], Tuple[str, str, str]]] = {}
    for review in reviews:
        if str(review.get("state") or "").upper() != "COMMENTED":
            continue
        user = review.get("user")
        login = user.get("login") if isinstance(user, dict) else None
        submitted_at = review.get("submitted_at")
        parsed = parse_review_verdict(review.get("body"))
        if not isinstance(login, str) or not login or not isinstance(submitted_at, str) or not parsed:
            continue
        key = login.casefold()
        previous = latest.get(key)
        previous_review = previous[0] if previous else None
        previous_time = previous_review.get("submitted_at") if previous_review else None
        previous_id = int(previous_review.get("id") or 0) if previous_review else 0
        review_id = int(review.get("id") or 0)
        if not isinstance(previous_time, str) or (submitted_at, review_id) >= (previous_time, previous_id):
            latest[key] = (review, parsed)
    return latest


def review_decision_blocks(pr: Mapping[str, object], reviews: Sequence[Mapping[str, object]]) -> List[str]:
    blockers = []
    decision = str(pr.get("reviewDecision") or "").upper()
    if decision == "CHANGES_REQUESTED":
        blockers.append("GitHub reviewDecision is CHANGES_REQUESTED")
    latest_formal = latest_reviews_by_actor(reviews, formal_only=True)
    for key, review in sorted(latest_formal.items()):
        state = str(review.get("state") or "").upper()
        if state == "CHANGES_REQUESTED":
            user = review.get("user")
            login = user.get("login") if isinstance(user, dict) else key
            blockers.append("formal CHANGES_REQUESTED review remains from @{}".format(login))
    return blockers


def check_bucket(check: Mapping[str, object]) -> str:
    bucket = check.get("bucket")
    if isinstance(bucket, str) and bucket:
        return bucket.casefold()
    state = str(check.get("state") or "unknown").casefold()
    if state in {"success", "neutral"}:
        return "pass"
    if state in {"failure", "error", "timed_out", "cancelled", "action_required"}:
        return "fail"
    if state in {"pending", "queued", "in_progress", "expected"}:
        return "pending"
    return "unknown"


def review_labels(pr: Mapping[str, object]) -> List[str]:
    labels = pr.get("labels")
    if not isinstance(labels, list):
        return []
    return [label["name"] for label in labels if isinstance(label, dict) and isinstance(label.get("name"), str)]


def fetch_required_checks(root: Path, repository: str, number: int) -> List[Mapping[str, object]]:
    result = subprocess.run(
        [
            "gh",
            "pr",
            "checks",
            str(number),
            "--repo",
            repository,
            "--required",
            "--json",
            "name,state,bucket,link",
        ],
        cwd=str(root),
        check=False,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True,
    )
    if result.returncode not in {0, 1, 8}:
        raise MaintenanceError(
            "gh pr checks could not read current required checks (exit {}).".format(
                result.returncode
            )
        )
    if not result.stdout.strip():
        if result.returncode == 1 and "no checks reported" in result.stderr.casefold():
            return []
        raise MaintenanceError(
            "GitHub returned no required-check data; PR readiness is unavailable."
        )
    try:
        checks = json.loads(result.stdout)
    except (TypeError, ValueError):
        raise MaintenanceError("GitHub returned an unexpected required-check response.")
    if not isinstance(checks, list) or any(not isinstance(check, dict) for check in checks):
        raise MaintenanceError("GitHub returned an incomplete required-check response.")
    return checks


def resolve_trusted_account(
    task_assignment: Optional[Mapping[str, object]], requested_account: Optional[str]
) -> Tuple[Optional[str], bool, str]:
    assigned = task_assignment.get("reviewer_account") if task_assignment else None
    if assigned:
        assigned_account = validate_reviewer_account(str(assigned))
    else:
        assigned_account = None
    if requested_account:
        requested = validate_reviewer_account(requested_account)
        if assigned_account and requested.casefold() != assigned_account.casefold():
            return None, False, "explicit reviewer account conflicts with the registered task policy"
        return requested, True, "explicit readiness argument" if not assigned_account else "registered task policy"
    if assigned_account:
        return assigned_account, True, "registered task policy"
    return None, False, "no trusted reviewer account was supplied"


def comparison_proves_current_main(
    comparison: Mapping[str, object],
    head_commit: Mapping[str, object],
    current_main: str,
    head: str,
) -> bool:
    base_commit = comparison.get("base_commit")
    merge_base = comparison.get("merge_base_commit")
    base_sha = base_commit.get("sha") if isinstance(base_commit, dict) else None
    requested_head_sha = head_commit.get("sha")
    merge_base_sha = merge_base.get("sha") if isinstance(merge_base, dict) else None
    status = str(comparison.get("status") or "").lower()
    try:
        ahead_by = int(comparison.get("ahead_by", -1))
        behind_by = int(comparison.get("behind_by", -1))
    except (TypeError, ValueError):
        return False
    return (
        str(base_sha or "").lower() == current_main.lower()
        and str(requested_head_sha or "").lower() == head.lower()
        and str(merge_base_sha or "").lower() == current_main.lower()
        and status == "ahead"
        and ahead_by > 0
        and behind_by == 0
    )


def evaluate_readiness(
    pr_before: Mapping[str, object],
    current_main_before: str,
    comparison: Mapping[str, object],
    comparison_head_commit: Mapping[str, object],
    checks: Sequence[Mapping[str, object]],
    reviews: Sequence[Mapping[str, object]],
    pr_after: Mapping[str, object],
    current_main_after: str,
    task_assignment: Optional[Mapping[str, object]],
    requested_reviewer_account: Optional[str] = None,
) -> Tuple[bool, str]:
    head = str(pr_after.get("headRefOid") or "").lower()
    base = str(pr_after.get("baseRefOid") or "").lower()
    author_data = pr_after.get("author")
    author = author_data.get("login") if isinstance(author_data, dict) else None
    changed_during_read = (
        pr_before.get("headRefOid") != pr_after.get("headRefOid")
        or pr_before.get("baseRefOid") != pr_after.get("baseRefOid")
        or current_main_before.lower() != current_main_after.lower()
    )
    trusted_account, binding_valid, binding_source = resolve_trusted_account(
        task_assignment, requested_reviewer_account
    )
    current_verdicts = latest_process_verdicts(reviews)
    stale_verdicts = []
    untrusted_verdicts = []
    accepted_verdict: Optional[Tuple[str, str, Mapping[str, object]]] = None
    for login, (review, parsed) in current_verdicts.items():
        verdict, reviewed_head, reviewed_base = parsed
        reviewer = review.get("user")
        actual_login = str(reviewer.get("login") or login) if isinstance(reviewer, dict) else login
        review_commit = str(review.get("commit_id") or "").lower()
        if not trusted_account or login != trusted_account.casefold():
            untrusted_verdicts.append(actual_login)
            continue
        if reviewed_head != head or reviewed_base != base or review_commit != head:
            stale_verdicts.append((actual_login, verdict))
            continue
        accepted_verdict = (actual_login, verdict, review)

    formal_blockers = review_decision_blocks(pr_after, reviews)
    required_checks_pass = bool(checks) and all(check_bucket(check) == "pass" for check in checks)
    base_is_current = (
        pr_after.get("baseRefName") == "main"
        and bool(base)
        and base == current_main_after.lower()
    )
    ancestry_is_current = comparison_proves_current_main(
        comparison, comparison_head_commit, current_main_after.lower(), head
    )
    is_open = str(pr_after.get("state") or "").upper() == "OPEN"
    is_draft = bool(pr_after.get("isDraft"))
    mergeable = str(pr_after.get("mergeable") or "").upper() == "MERGEABLE"
    labels = review_labels(pr_after)
    pending_trigger = "review:pending" in labels
    ready_comment = bool(
        accepted_verdict
        and accepted_verdict[1] == "READY_TO_MERGE"
        and str(accepted_verdict[2].get("state") or "").upper() == "COMMENTED"
    )
    ready = all(
        [
            not changed_during_read,
            is_open,
            not is_draft,
            mergeable,
            base_is_current,
            ancestry_is_current,
            required_checks_pass,
            binding_valid,
            ready_comment,
            not formal_blockers,
            not pending_trigger,
        ]
    )

    lines = [
        "# Pull request readiness evidence",
        "",
        "PR: #{} {}".format(pr_after.get("number", "?"), safe_evidence_url(pr_after.get("url")) or ""),
        "Title: {}".format(sanitize_text(pr_after.get("title")) or "(untitled)"),
        "Observed head: {}".format(head or "unavailable"),
        "Observed base: {} {}".format(pr_after.get("baseRefName") or "unknown", base or "unavailable"),
        "Current main: {}".format(current_main_after or "unavailable"),
        "",
        "## Main ancestry and base",
    ]
    if base_is_current:
        lines.append("PR base equals the current main SHA.")
    else:
        lines.append("PR base does not equal current main, or its base branch is not main.")
    if ancestry_is_current:
        lines.append(
            "GitHub compare confirms current main is an ancestor of this PR head and the PR "
            "contains commits ahead of main."
        )
    else:
        lines.append("GitHub compare did not confirm that this PR head contains current main.")
    lines.extend(["", "## Required checks for the current PR head"])
    if not checks:
        lines.append("No required check results were returned; required CI is unverified.")
    else:
        for check in checks:
            name = sanitize_text(check.get("name")) or "Unnamed check"
            state = sanitize_text(check.get("state")) or "unknown"
            bucket = check_bucket(check)
            url = safe_evidence_url(check.get("link"))
            reference = " — {}".format(url) if url else ""
            lines.append("- {}: {} ({}){}".format(name, state, bucket, reference))
    lines.extend(["", "## Review evidence"])
    if task_assignment:
        lines.append(
            "Task assignment: owner {}, reviewer agent {}, expected GitHub account @{}.".format(
                sanitize_text(task_assignment.get("owner")) or "unknown",
                sanitize_text(task_assignment.get("reviewer")) or "unknown",
                sanitize_text(task_assignment.get("reviewer_account")) or "unbound",
            )
        )
    else:
        lines.append("No local task assignment was found for this PR branch.")
    if trusted_account:
        lines.append("Trusted reviewer account: @{} ({})".format(trusted_account, binding_source))
    else:
        lines.append("No trusted reviewer account is bound; no COMMENT verdict can qualify as ready evidence.")
    if accepted_verdict:
        reviewer_login, verdict, review = accepted_verdict
        lines.append(
            "- Current {} COMMENT by expected GitHub actor @{} on head {} and base {}.".format(
                verdict, reviewer_login, head, base
            )
        )
        if verdict == "NEEDS_CHANGES":
            lines.append("- The assigned reviewer verdict requests changes and blocks readiness.")
        if reviewer_login.casefold() == str(author or "").casefold():
            lines.append(
                "- The expected reviewer account matches the PR author account. A separately "
                "designated agent may share this account, but the coordinator must verify the "
                "agent-role separation from the task assignment."
            )
    elif trusted_account:
        lines.append(
            "No current exact-head/base COMMENT verdict by expected account @{} was found.".format(
                trusted_account
            )
        )
    for login in untrusted_verdicts:
        lines.append("- COMMENT verdict by @{} was not assigned as the trusted reviewer and was ignored.".format(login))
    for login, verdict in stale_verdicts:
        lines.append(
            "- Stale {} verdict by @{} does not match the current head, base, or review commit.".format(
                verdict, login
            )
        )
    for blocker in formal_blockers:
        lines.append("- Blocking formal review state: {}.".format(blocker))
    decision = str(pr_after.get("reviewDecision") or "").upper()
    if decision and decision != "CHANGES_REQUESTED":
        lines.append("GitHub reviewDecision: {}.".format(decision))
    elif not decision:
        lines.append("GitHub reviewDecision was unavailable.")
    if pending_trigger:
        lines.append(
            "- review:pending is present; adding it triggers the Claude review workflow and is "
            "not a neutral pending marker."
        )
    expected_labels = {
        "review:ready-to-merge": "READY_TO_MERGE",
        "review:changes-requested": "NEEDS_CHANGES",
    }
    current_verdict_name = accepted_verdict[1] if accepted_verdict else None
    for label, verdict_name in expected_labels.items():
        if label in labels and current_verdict_name != verdict_name:
            lines.append(
                "- {} is not backed by the trusted current COMMENT verdict and is not readiness "
                "evidence.".format(label)
            )
    if author:
        lines.append("PR author GitHub actor: @{}.".format(author))
    lines.append(
        "GitHub account metadata identifies the posting account; it cannot prove agent identity "
        "or technical review quality."
    )
    lines.extend(["", "## Result"])
    if changed_during_read:
        lines.append("UNSTABLE: the PR head/base or main SHA changed while this report was collected. Rerun it.")
    elif ready:
        lines.append("Current evidence is ready for the coordinator's human merge decision.")
    else:
        lines.append("Not ready for a merge decision. Resolve the missing or blocking evidence above and rerun.")
    lines.extend(
        [
            "",
            (
                "This command is read-only. It did not approve, label, comment, merge, or run PR "
                "code. The report does not replace code review or merge authority."
            ),
        ]
    )
    return ready, "\n".join(lines) + "\n"


def flatten_pages(value: object) -> List[Mapping[str, object]]:
    if not isinstance(value, list):
        raise MaintenanceError("GitHub returned an unexpected paginated review response.")
    flattened = []
    for page in value:
        if isinstance(page, list):
            if len(page) > 100 or any(not isinstance(item, dict) for item in page):
                raise MaintenanceError(
                    "GitHub returned an incomplete review page; readiness is unavailable."
                )
            flattened.extend(page)
        elif isinstance(page, dict):
            flattened.append(page)
        else:
            raise MaintenanceError("GitHub returned an incomplete review page; readiness is unavailable.")
    return flattened


def fetch_pr_readiness(start: Path, number: int, requested_reviewer_account: Optional[str] = None) -> str:
    if number < 1:
        raise MaintenanceError("Pull request number must be positive.")
    root = repository_root(start)
    repository, host = repository_identity(root)
    gh_repository = repository_argument(repository, host)
    pr_fields = (
        "number,title,url,state,isDraft,author,baseRefName,baseRefOid,headRefName,"
        "headRefOid,labels,mergeable,reviewDecision"
    )

    def read_pr() -> Mapping[str, object]:
        result = run_gh_json(
            ["pr", "view", str(number), "--repo", gh_repository, "--json", pr_fields],
            root,
        )
        if not isinstance(result, dict):
            raise MaintenanceError("GitHub did not return pull request metadata.")
        return result

    pr_before = read_pr()
    main_before = github_main_sha(repository, host, root)
    head_before = str(pr_before.get("headRefOid") or "").lower()
    comparison = run_gh_json(
        [
            "api",
            "--hostname",
            host,
            "repos/{}/compare/{}...{}".format(repository, main_before, head_before),
        ],
        root,
    )
    if not isinstance(comparison, dict):
        raise MaintenanceError("GitHub did not return main ancestry comparison evidence.")
    comparison_head_commit = run_gh_json(
        [
            "api",
            "--hostname",
            host,
            "repos/{}/commits/{}".format(repository, head_before),
        ],
        root,
    )
    if not isinstance(comparison_head_commit, dict):
        raise MaintenanceError("GitHub did not return the requested PR head commit.")
    check_result = fetch_required_checks(root, gh_repository, number)
    review_pages = run_gh_json(
        [
            "api",
            "--hostname",
            host,
            "--paginate",
            "--slurp",
            "repos/{}/pulls/{}/reviews?per_page=100".format(repository, number),
        ],
        root,
    )
    reviews = flatten_pages(review_pages)
    pr_after = read_pr()
    main_after = github_main_sha(repository, host, root)
    task_assignment = find_task_assignment(root, str(pr_after.get("headRefName") or ""))
    _, report = evaluate_readiness(
        pr_before,
        main_before,
        comparison,
        comparison_head_commit,
        check_result,
        reviews,
        pr_after,
        main_after,
        task_assignment,
        requested_reviewer_account,
    )
    return report

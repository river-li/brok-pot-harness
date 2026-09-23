#!/usr/bin/env python3
"""Create a bounded, read-only issue and regression triage report."""

from __future__ import annotations

import argparse
from datetime import datetime, timezone
import hashlib
import json
from pathlib import Path
import re
import subprocess
import sys
from typing import Any


ROOT = Path(__file__).resolve().parent.parent
MAX_ISSUES = 100
MAX_RUNS = 50
MAX_PROPOSALS = 10
MAX_DIAGNOSTIC_BYTES = 64 * 1024
MAX_RESPONSE_BYTES = 8 * 1024 * 1024
MAX_PR_READS = 10
RUN_ID_RE = re.compile(r"^[1-9][0-9]{0,19}$")
SHA_RE = re.compile(r"^[0-9a-fA-F]{7,40}$")
SIGNATURE_RE = re.compile(r"(?i)\bv1:sha256:([0-9a-f]{64})\b")
FIELD_RE = re.compile(r"(?im)^\s*(?:[-*]\s*)?(?:\*\*)?([^:\n*]+?)(?:\*\*)?\s*:\s*(.*?)\s*$")
KNOWN_ERRORS = {
    "AssertionError", "ConnectionError", "FileNotFoundError", "ImportError",
    "IndexError", "KeyError", "ModuleNotFoundError", "NotImplementedError",
    "OSError", "PermissionError", "RangeError", "ReferenceError", "RuntimeError",
    "SyntaxError", "TimeoutError", "TypeError", "ValueError", "JSONDecodeError",
}
ERROR_TOKEN_RE = re.compile(
    r"(?<![A-Za-z0-9_])(" + "|".join(re.escape(x) for x in sorted(KNOWN_ERRORS, key=len, reverse=True))
    + r"|TS[0-9]{4}|ERR_(?:MODULE_NOT_FOUND|INVALID_ARG_TYPE|ASSERTION|REQUIRE_ESM|"
    + r"STREAM_DESTROYED|HTTP_HEADERS_SENT|NETWORK|CONNECTION_RESET)"
    + r"|E(?:ACCES|ADDRINUSE|CONNRESET|CONNREFUSED|EXIST|INTR|INVAL|ISDIR|MFILE|"
    + r"NFILE|NOENT|NOMEM|NOTDIR|NOTEMPTY|PERM|PIPE|TIMEDOUT|XDEV)"
    + r"|HTTP[ _-]?[1-5][0-9]{2})(?![A-Za-z0-9_])"
)
SECRET_RE = re.compile(
    r"(?i)(?:\b(?:authorization|api[_-]?key|access[_-]?token|session[_-]?token|gateway[_-]?token)\b\s*[:=]\s*|\bbearer\s+)([^\s,;]+)"
)
TOKEN_RE = re.compile(r"\b(?:gh[pousr]_[A-Za-z0-9_]{16,}|github_pat_[A-Za-z0-9_]{16,}|sk-[A-Za-z0-9_-]{16,}|xox[baprs]-[A-Za-z0-9-]{12,})\b")
EMAIL_RE = re.compile(r"(?i)\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b")
PATH_RE = re.compile(r"(?:(?:/Users|/home|/root|/private/var)/[^\s\"'<>]+|[A-Za-z]:\\Users\\[^\s\"'<>]+|~/[^\s\"'<>]+)")
URL_RE = re.compile(r"(?i)\bhttps?://[^\s<>\"']+")
PR_REF_RE = re.compile(r"(?i)^(?:#([1-9][0-9]*)|https://github\.com/[A-Za-z0-9_.-]+/[A-Za-z0-9_.-]+/pull/([1-9][0-9]*))$")


class TriageError(Exception):
    """An error safe to show to the operator."""


def redact_untrusted(value: str) -> str:
    text = SECRET_RE.sub("[redacted]", value)
    text = TOKEN_RE.sub("[redacted]", text)
    text = EMAIL_RE.sub("[redacted]", text)
    text = PATH_RE.sub("[redacted-path]", text)
    # URLs can contain user information, private paths, and query tokens.
    return URL_RE.sub("[redacted-url]", text)


def safe_identifier(value: Any, fallback: str, limit: int = 100) -> str:
    text = redact_untrusted(str(value or ""))
    text = re.sub(r"[^A-Za-z0-9 ._:/-]+", " ", text)
    text = re.sub(r"\s+", " ", text).strip(" ._:/-")
    return text[:limit].strip() or fallback


def normalize(value: Any, fallback: str) -> str:
    text = safe_identifier(value, fallback, 120).lower()
    return re.sub(r"[^a-z0-9]+", " ", text).strip() or fallback


def parse_datetime(value: Any) -> datetime | None:
    if not isinstance(value, str) or not value:
        return None
    try:
        parsed = datetime.fromisoformat(value.replace("Z", "+00:00"))
    except ValueError:
        return None
    if parsed.tzinfo is None:
        parsed = parsed.replace(tzinfo=timezone.utc)
    return parsed.astimezone(timezone.utc)


def days_since(value: Any, now: datetime) -> int | None:
    parsed = parse_datetime(value)
    return None if parsed is None else max(0, (now - parsed).days)


def issue_field(body: str, *names: str) -> str:
    wanted = {re.sub(r"[^a-z]", "", name.lower()) for name in names}
    for match in FIELD_RE.finditer(body or ""):
        name = re.sub(r"[^a-z]", "", match.group(1).lower())
        if name in wanted:
            return match.group(2).strip().strip(chr(96) + "*_ ")
    lines = (body or "").splitlines()
    for index, line in enumerate(lines):
        heading = re.match(r"^\s*#{1,6}\s+(.+?)\s*#*\s*$", line)
        if not heading or re.sub(r"[^a-z]", "", heading.group(1).lower()) not in wanted:
            continue
        for answer in lines[index + 1:]:
            if answer.strip():
                if answer.lstrip().startswith("#"):
                    break
                return answer.strip()
    return ""


def issue_signature(issue: dict[str, Any]) -> str | None:
    body = str(issue.get("body") or "")
    marker = issue_field(body, "Triage failure signature", "Triage signature")
    match = SIGNATURE_RE.search(marker) or SIGNATURE_RE.search(body)
    return f"v1:sha256:{match.group(1).lower()}" if match else None


def safe_release(value: str) -> str:
    value = value.strip().strip(chr(96) + "*_ ")
    if SHA_RE.fullmatch(value):
        return value.lower()
    if re.fullmatch(r"[vV]?\d+(?:\.\d+){0,3}(?:[-+][A-Za-z0-9.-]+)?", value):
        return value
    if value.lower() in {"unknown", "not applicable", "n/a", "not recorded"}:
        return "Not recorded"
    return "Not recorded" if not value else "Present in issue; omitted as unrecognized"


def safe_repo(slug: str) -> str:
    if not re.fullmatch(r"[A-Za-z0-9_.-]+/[A-Za-z0-9_.-]+", slug):
        raise TriageError("Repository slug must use owner/name format, without credentials or a URL.")
    return slug


def diagnostic_tokens(text: str) -> list[str]:
    """Keep only allow-listed exception classes and common machine error codes."""
    return sorted({
        token.upper() if token.startswith(("TS", "ERR_", "HTTP", "E")) else token
        for token in ERROR_TOKEN_RE.findall(text or "")
    })


def signature_for(workflow: str, jobs: list[str], tokens: list[str]) -> str:
    dimensions = [normalize(workflow, "workflow")]
    dimensions.extend(sorted({normalize(job, "job") for job in jobs}))
    dimensions.extend(tokens)
    digest = hashlib.sha256("\n".join(dimensions).encode("utf-8")).hexdigest()
    return f"v1:sha256:{digest}"


def run_id(run: dict[str, Any]) -> str | None:
    value = str(run.get("databaseId", run.get("id", "")))
    return value if RUN_ID_RE.fullmatch(value) else None


def failed_jobs(run: dict[str, Any]) -> list[str]:
    jobs = run.get("jobs") or run.get("failedJobs") or []
    names: set[str] = set()
    if isinstance(jobs, list):
        for job in jobs:
            if isinstance(job, str):
                names.add(safe_identifier(job, "failed job"))
            elif isinstance(job, dict):
                state = str(job.get("conclusion") or job.get("status") or "failure").lower()
                if state in {"failure", "timed_out", "startup_failure", "action_required"}:
                    names.add(safe_identifier(job.get("name"), "failed job"))
    return sorted(names or {"workflow failure (job detail unavailable)"})


def diagnostic_for(run: dict[str, Any], directory: Path | None) -> tuple[str, bool]:
    ident = run_id(run)
    if directory is None or ident is None:
        return "", False
    path = directory / f"{ident}.txt"
    try:
        if path.is_symlink() or not path.is_file():
            return "", False
        with path.open("rb") as source:
            data = source.read(MAX_DIAGNOSTIC_BYTES + 1)
    except OSError:
        return "", False
    truncated = len(data) > MAX_DIAGNOSTIC_BYTES
    return data[:MAX_DIAGNOSTIC_BYTES].decode("utf-8", errors="replace"), truncated


def runtime_triage_dir() -> Path:
    runtime = ROOT / ".runtime"
    directory = runtime / "triage"
    if runtime.is_symlink() or directory.is_symlink():
        raise TriageError("The triage runtime directory must not be a symlink.")
    return directory.resolve()


def current_version(root: Path) -> str:
    try:
        package = json.loads((root / "package.json").read_text(encoding="utf-8"))
        value = str(package.get("version") or "")
        return value if re.fullmatch(r"[A-Za-z0-9.+_-]{1,64}", value) else "Not recorded"
    except (OSError, json.JSONDecodeError):
        return "Not recorded"


def current_revision(root: Path) -> str:
    try:
        result = subprocess.run(
            ["git", "rev-parse", "HEAD"], cwd=root, check=True,
            stdout=subprocess.PIPE, stderr=subprocess.DEVNULL, text=True, timeout=10,
        )
        return result.stdout.strip().lower() if SHA_RE.fullmatch(result.stdout.strip()) else "Not recorded"
    except (OSError, subprocess.SubprocessError):
        return "Not recorded"


def known_labels(root: Path) -> set[str]:
    try:
        text = (root / ".github/issue-labels.yml").read_text(encoding="utf-8")
    except OSError:
        return set()
    return set(re.findall(r"(?m)^\s+- name: ([^\n]+)$", text))


def issue_labels(issue: dict[str, Any], known: set[str]) -> list[str]:
    names = set()
    for label in issue.get("labels") or []:
        name = label.get("name") if isinstance(label, dict) else label
        if isinstance(name, str) and name in known:
            names.add(name)
    return sorted(names)


def pr_number(issue: dict[str, Any]) -> int | None:
    raw = issue_field(str(issue.get("body") or ""), "Fix PR", "Pull request")
    if not raw or raw.lower() in {"none", "not linked", "pending", "unknown"}:
        return None
    match = PR_REF_RE.fullmatch(raw)
    return int(match.group(1) or match.group(2)) if match else None


def support_rows(path: Path) -> list[tuple[str, str]]:
    try:
        lines = path.read_text(encoding="utf-8").splitlines()
    except OSError:
        return []
    active = False
    rows: list[tuple[str, str]] = []
    for line in lines:
        if line.startswith("## "):
            if active:
                break
            active = line[3:].strip().casefold() == "support status"
            continue
        if active and line.startswith("|"):
            cells = [cell.strip() for cell in line.strip().strip("|").split("|")]
            if len(cells) >= 2 and cells[0] not in {"Status", "---"} and set(cells[0]) - {"-", ":"}:
                rows.append((cells[0], cells[1]))
    return rows[:20]


def coverage_bullets(path: Path) -> list[str]:
    try:
        lines = path.read_text(encoding="utf-8").splitlines()
    except OSError:
        return []
    active = False
    result: list[str] = []
    for line in lines:
        if line.startswith("## "):
            if active:
                break
            active = line[3:].strip().casefold() == "coverage still needed"
            continue
        if active and line.startswith("- "):
            result.append(line[2:].strip())
    return result[:20]


def legacy_matches(candidate: dict[str, Any], issues: list[dict[str, Any]]) -> list[int]:
    """Hold likely unmarked duplicates for a person; never treat text similarity as proof."""
    tokens = candidate["tokens"]
    if not tokens:
        return []
    jobs = [normalize(job, "job") for job in candidate["jobs"]]
    workflow = normalize(candidate["workflow"], "workflow")
    result = []
    for issue in issues:
        number = issue.get("number")
        if issue_signature(issue) or not isinstance(number, int):
            continue
        searchable = normalize(f"{issue.get('title') or ''} {issue.get('body') or ''}", "")
        if all(token.lower() in searchable for token in tokens) and (
            any(job in searchable for job in jobs) or workflow in searchable
        ):
            result.append(number)
    return sorted(set(result))


def proposal_title(candidate: dict[str, Any], regression: bool) -> str:
    workflow = safe_identifier(candidate["workflow"], "workflow", 45)
    job = safe_identifier(candidate["jobs"][0], "failed job", 45)
    prefix = "[Bug]: Suspected CI regression" if regression else "[Bug]: CI failure"
    return f"{prefix} in {workflow} / {job}"[:120]


def collect_candidates(
    runs: list[dict[str, Any]], issues: list[dict[str, Any]], diagnostics_dir: Path | None,
    repo: str, version: str, max_proposals: int,
) -> tuple[list[dict[str, Any]], list[str]]:
    failed = [run for run in runs if str(run.get("conclusion") or "").lower() in {"failure", "timed_out", "startup_failure"}]
    groups: dict[str, dict[str, Any]] = {}
    for run in failed:
        workflow = safe_identifier(run.get("workflowName") or run.get("name"), "workflow")
        jobs = failed_jobs(run)
        excerpt, truncated = diagnostic_for(run, diagnostics_dir)
        tokens = diagnostic_tokens(excerpt)
        signature = signature_for(workflow, jobs, tokens)
        item = groups.setdefault(signature, {
            "signature": signature, "workflow": workflow, "jobs": jobs, "tokens": tokens,
            "runs": [], "diagnostic_truncated": False,
        })
        item["runs"].append(run)
        item["diagnostic_truncated"] = item["diagnostic_truncated"] or truncated

    indexed: dict[str, list[int]] = {}
    for issue in issues:
        signature = issue_signature(issue)
        if signature and isinstance(issue.get("number"), int):
            indexed.setdefault(signature, []).append(issue["number"])

    ordered = sorted(groups.values(), key=lambda group: min(
        parse_datetime(run.get("createdAt")) or datetime.max.replace(tzinfo=timezone.utc)
        for run in group["runs"]
    ))
    candidates: list[dict[str, Any]] = []
    notes: list[str] = []
    for item in ordered:
        item["runs"].sort(key=lambda run: parse_datetime(run.get("createdAt")) or datetime.max.replace(tzinfo=timezone.utc))
        exact = sorted(indexed.get(item["signature"], []))
        first = item["runs"][0]
        first_time = parse_datetime(first.get("createdAt"))
        branch = str(first.get("headBranch") or "")
        workflow_key = normalize(first.get("workflowName") or first.get("name"), "workflow")
        earlier_green = [
            run for run in runs if str(run.get("conclusion") or "").lower() == "success"
            and normalize(run.get("workflowName") or run.get("name"), "workflow") == workflow_key
            and str(run.get("headBranch") or "") == branch
            and first_time and parse_datetime(run.get("createdAt"))
            and parse_datetime(run.get("createdAt")) < first_time
        ]
        later_green = any(
            str(run.get("conclusion") or "").lower() == "success"
            and normalize(run.get("workflowName") or run.get("name"), "workflow") == workflow_key
            and str(run.get("headBranch") or "") == branch
            and first_time and parse_datetime(run.get("createdAt"))
            and parse_datetime(run.get("createdAt")) > first_time
            for run in runs
        )
        good = max(earlier_green, key=lambda run: parse_datetime(run.get("createdAt"))) if earlier_green else None
        item.update({
            "exact_issues": exact,
            "legacy_issues": [] if exact else legacy_matches(item, issues),
            "first_bad": safe_release(str(first.get("headSha") or "")),
            "last_good": safe_release(str(good.get("headSha") or "")) if good else "Not recorded",
            "regression": bool(good),
            "intermittent": later_green,
            "repo": repo,
            "version": version,
        })
        item["title"] = proposal_title(item, item["regression"])
        if exact:
            continue
        if item["legacy_issues"]:
            numbers = ", ".join(f"#{number}" for number in item["legacy_issues"])
            notes.append(f"Signature {item['signature']} needs manual duplicate review against {numbers}; no proposal was emitted.")
            continue
        if len(candidates) < max_proposals:
            candidates.append(item)
        elif not any("Proposal cap" in note for note in notes):
            notes.append(f"Proposal cap ({max_proposals}) reached; additional signatures are omitted.")
    return candidates, notes


def proposal_lines(candidate: dict[str, Any]) -> list[str]:
    ids = [run_id(run) for run in candidate["runs"]]
    ids = [ident for ident in ids if ident]
    lines = [
        f"### Proposed issue: {candidate['title']}", "",
        f"CI failed in workflow {candidate['workflow']} / job(s) {', '.join(candidate['jobs'])}.", "",
        f"- Failure signature: {candidate['signature']}",
        "- Reproduction status: Failed in CI; not checked outside CI",
        f"- Affected release/revision: {candidate['first_bad']} (audit checkout version {candidate['version']}; confirm it at that revision)",
        f"- First known bad release/revision: {candidate['first_bad']}",
        f"- Last known good release/revision: {candidate['last_good']}",
        "- Fix PR: None",
        "- Verification evidence: Pending",
        "- Suggested taxonomy: area:runtime, status:needs-triage; priority needs maintainer assessment",
        "- CI evidence: " + (", ".join(f"[run #{ident}](https://github.com/{candidate['repo']}/actions/runs/{ident})" for ident in ids) or "run IDs unavailable"),
    ]
    if candidate["intermittent"]:
        lines.append("- Follow-up: a later run on the same branch succeeded; assess intermittency before calling this a regression.")
    elif candidate["regression"]:
        lines.append("- Follow-up: a prior run on the same branch succeeded; compare commits and environment before confirming a regression.")
    else:
        lines.append("- Follow-up: no prior successful run on the same branch appeared in the bounded history; regression status is unknown.")
    if candidate["tokens"]:
        lines.append("- Diagnostic identifiers: " + ", ".join(candidate["tokens"]))
    else:
        lines.append("- Signature precision: workflow/job level because no allow-listed diagnostic class or code was available.")
    if candidate["diagnostic_truncated"]:
        lines.append("- A supplied diagnostic excerpt exceeded the limit; only its first 64 KiB was inspected.")
    lines.extend(["", "Copy this proposal into the bug form only after comparing the existing open issue list. Keep the signature and evidence fields intact."])
    return lines


def build_report(
    issues: list[dict[str, Any]], runs: list[dict[str, Any]], prs: dict[int, dict[str, Any]] | None = None,
    *, repo: str = "repository/unknown", root: Path = ROOT, diagnostics_dir: Path | None = None,
    issue_limit: int = MAX_ISSUES, run_limit: int = MAX_RUNS, max_proposals: int = MAX_PROPOSALS,
    now: datetime | None = None,
) -> str:
    repo = safe_repo(repo)
    now = (now or datetime.now(timezone.utc)).astimezone(timezone.utc)
    prs = prs or {}
    labels_known = known_labels(root)
    rows = []
    stale: list[tuple[int, int]] = []
    fixed_unverified: list[tuple[int, int]] = []
    indexed: dict[str, list[int]] = {}
    for issue in issues[:issue_limit]:
        number = issue.get("number")
        if not isinstance(number, int):
            continue
        labels = issue_labels(issue, labels_known)
        age = days_since(issue.get("updatedAt"), now)
        body = str(issue.get("body") or "")
        affected = issue_field(body, "Affected release/revision", "Project release or revision")
        release = safe_release(affected) if affected else "Not recorded"
        reproduction = issue_field(body, "Reproduction status").lower()
        if reproduction in {"not assessed outside ci", "failed in ci", "failed in ci; not checked outside ci",
                            "reproduced", "not reproduced",
                            "suspected regression", "needs info", "blocked", "unknown", "not applicable"}:
            pass
        elif reproduction:
            reproduction = "Recorded; value omitted"
        else:
            reproduction = "Not recorded"
        rows.append((issue, labels, age, release, reproduction))
        if age is not None and age >= 30:
            stale.append((number, age))
        signature = issue_signature(issue)
        if signature:
            indexed.setdefault(signature, []).append(number)
        verification = issue_field(body, "Verification evidence", "Verification").lower()
        fix = pr_number(issue)
        pr = prs.get(fix, {}) if fix else {}
        merged = bool(pr.get("mergedAt")) or str(pr.get("state") or "").lower() == "merged"
        if fix and merged and verification in {"", "pending", "not verified", "unverified"}:
            fixed_unverified.append((number, fix))

    unresolved_fix_refs = [
        (issue.get("number"), ref)
        for issue in issues[:issue_limit]
        if isinstance(issue.get("number"), int)
        and (ref := pr_number(issue)) is not None
        and ref not in prs
    ]
    version = current_version(root)
    candidates, notes = collect_candidates(runs[:run_limit], issues[:issue_limit], diagnostics_dir, repo, version, max_proposals)
    revision = current_revision(root)
    failures = [r for r in runs[:run_limit] if str(r.get("conclusion") or "").lower() in {"failure", "timed_out", "startup_failure"}]
    lines = [
        "# Read-only issue triage report", "",
        f"- Generated: {now.strftime('%Y-%m-%d %H:%M UTC')}",
        f"- Repository: {repo}",
        f"- Audited revision: {revision} (project version {version})",
        f"- Scope: up to {issue_limit} open issues; up to {run_limit} recent workflow runs; failed-job details for at most 10 runs; at most {max_proposals} issue proposals",
        "- Writes: none to GitHub; this report is the only optional output",
        "- Privacy: issue titles/bodies, reporter identities, raw diagnostics, and log excerpts are never rendered", "",
        "## Existing open issues", "",
        f"Scanned {len(rows)} open issues. The index shows issue number, recognized taxonomy labels, and update age only.", "",
        "| Issue | Area | Priority | Status | Reproduction | Affected release/revision | Last updated |",
        "| --- | --- | --- | --- | --- | --- | ---: |",
    ]
    if rows:
        for issue, labels, age, release, reproduction in rows:
            area = next((label for label in labels if label.startswith("area:")), "—")
            priority = next((label for label in labels if label.startswith("priority:")), "—")
            status = next((label for label in labels if label.startswith("status:")), "unmarked")
            updated = f"{age} days ago" if age is not None else "unknown"
            lines.append(f"| [#{issue['number']}](https://github.com/{repo}/issues/{issue['number']}) | {area} | {priority} | {status} | {reproduction} | {release} | {updated} |")
    else:
        lines.append("| None returned | — | — | — | — | — | — |")
    if len(issues) >= issue_limit:
        lines.append(f"\nThe issue scan reached its {issue_limit}-issue cap; older open issues may be omitted.")

    lines.extend(["", "## Follow-up queue", ""])
    if stale:
        lines.append("- **Stale (30+ days without an update):** " + ", ".join(f"[#{n}](https://github.com/{repo}/issues/{n}) ({age} days)" for n, age in sorted(stale, key=lambda pair: -pair[1])))
    else:
        lines.append("- No issue exceeded the 30-day stale threshold in this scan.")
    if fixed_unverified:
        lines.append("- **Merged fix PR with verification pending:** " + ", ".join(f"[issue #{n}](https://github.com/{repo}/issues/{n}) / PR #{pr}" for n, pr in fixed_unverified))
    else:
        lines.append("- No structured merged-fix / pending-verification marker was found.")
    if unresolved_fix_refs:
        lines.append(f"- Linked PR state was unavailable or beyond the {MAX_PR_READS}-PR read cap for {len(unresolved_fix_refs)} issue(s); fixed-but-unverified detection may be incomplete.")
    marker_count = sum(len(nums) for nums in indexed.values())
    lines.append(f"- Issues carrying a triage failure signature: {marker_count}; unmarked open issues requiring manual comparison: {max(0, len(rows) - marker_count)}.")
    duplicates = [(sig, nums) for sig, nums in indexed.items() if len(nums) > 1]
    if duplicates:
        lines.append("- **Conflicting duplicate markers:** " + "; ".join(f"{sig}: " + ", ".join(f"#{n}" for n in nums) for sig, nums in duplicates) + ". Resolve the canonical issue manually; nothing was relabeled or closed.")

    lines.extend(["", "## CI failures and regression signals", "", f"Reviewed {len(runs[:run_limit])} recent workflow runs; {len(failures)} failed or timed-out runs were considered."])
    if len(runs) >= run_limit:
        lines.append(f"The run scan reached its {run_limit}-run cap; older failures may be omitted.")
    if len(failures) > 10:
        lines.append("Detailed failed-job reads were capped at 10 runs; remaining failures may have workflow-level signatures.")
    if candidates:
        lines.extend(["", f"{len(candidates)} new signature group(s) have issue proposals for maintainer review.", ""])
        for candidate in candidates:
            lines.extend(proposal_lines(candidate))
            lines.append("")
    else:
        lines.append("No untracked CI failure signature produced a new proposal.")
    if notes:
        lines.extend(["", "### Held for duplicate review", ""])
        lines.extend(f"- {note}" for note in notes)
    if failures:
        tracked = {sig: nums for sig, nums in indexed.items() if any(
            signature_for(safe_identifier(run.get("workflowName") or run.get("name"), "workflow"),
                          failed_jobs(run), diagnostic_tokens(diagnostic_for(run, diagnostics_dir)[0])) == sig
            for run in failures
        )}
        lines.extend(["", "### Failure groups already tracked", ""])
        if tracked:
            for sig, nums in sorted(tracked.items()):
                lines.append(f"- {sig} is already recorded on " + ", ".join(f"[#{n}](https://github.com/{repo}/issues/{n})" for n in sorted(set(nums))) + ".")
        else:
            lines.append("- No exact signature marker matched. Similar unmarked reports still need human comparison before filing.")

    lines.extend(["", "## Feature and verification context", "", "These current support statements are context for a maintainer; they do not automatically become issues."])
    for status, capability in support_rows(root / "docs/wiki/Features.md"):
        lines.append(f"- **{status}:** {capability}")
    lines.extend(["", "The verification reference currently lists these coverage gaps:"])
    gaps = coverage_bullets(root / "docs/wiki/Verification.md")
    lines.extend(f"- {gap}" for gap in gaps) if gaps else lines.append("- No Coverage still needed section was available.")

    lines.extend([
        "", "## Triage decisions for a maintainer", "",
        "- Compare every proposal with the open issue list before filing. Exact signature markers deduplicate automatically; a possible text match without a marker is held for human review.",
        "- Treat a prior green run as a regression signal only. Verify profile, baseline, and environment before marking status:confirmed.",
        "- Keep user reports open and unchanged. Do not auto-close, relabel, or copy their text into a proposal.",
        "- After a fix, record Fix PR and leave Verification evidence: Pending until the appropriate check passes; then add the exact check/run link and verification layer.", "",
    ])
    return "\n".join(lines)


def command(args: list[str], timeout: int = 45, max_bytes: int = MAX_RESPONSE_BYTES) -> bytes:
    try:
        result = subprocess.run(args, cwd=ROOT, stdout=subprocess.PIPE, stderr=subprocess.DEVNULL, timeout=timeout)
    except FileNotFoundError as exc:
        raise TriageError("GitHub CLI is unavailable; install gh and retry.") from exc
    except subprocess.TimeoutExpired as exc:
        raise TriageError("A GitHub read request timed out; retry the dry run later.") from exc
    except OSError as exc:
        raise TriageError("A GitHub read request could not be started.") from exc
    if result.returncode:
        raise TriageError("A GitHub read request failed; check gh auth status and repository access.")
    if len(result.stdout) > max_bytes:
        raise TriageError("GitHub response exceeded the configured safety bound.")
    return result.stdout


def gh_json(args: list[str], max_bytes: int = MAX_RESPONSE_BYTES) -> Any:
    try:
        return json.loads(command(["gh", *args], max_bytes=max_bytes))
    except json.JSONDecodeError as exc:
        raise TriageError("GitHub returned invalid JSON; no report was written.") from exc


def load_json(path: Path, top_type: type) -> Any:
    try:
        if path.stat().st_size > MAX_RESPONSE_BYTES:
            raise TriageError("Fixture snapshot exceeds the 8 MiB read limit.")
        value = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        raise TriageError("Could not read a valid JSON fixture snapshot.") from exc
    if not isinstance(value, top_type):
        raise TriageError("JSON fixture snapshot has the wrong top-level shape.")
    return value


def fetch_issues(limit: int, snapshot: Path | None) -> list[dict[str, Any]]:
    data = load_json(snapshot, list) if snapshot else gh_json([
        "issue", "list", "--state", "open", "--limit", str(limit), "--json",
        "number,title,body,labels,createdAt,updatedAt",
    ])
    return [item for item in data if isinstance(item, dict)][:limit]


def fetch_runs(limit: int, snapshot: Path | None) -> list[dict[str, Any]]:
    if snapshot:
        data = load_json(snapshot, list)
    else:
        data = gh_json(["run", "list", "--limit", str(limit), "--json",
                        "databaseId,name,workflowName,headBranch,headSha,event,createdAt,updatedAt,conclusion,status"])
        result = []
        detail_requests = 0
        for run in data[:limit]:
            if not isinstance(run, dict):
                continue
            if str(run.get("conclusion") or "").lower() in {"failure", "timed_out", "startup_failure"}:
                ident = run_id(run)
                if ident and detail_requests < 10:
                    try:
                        jobs = gh_json(["run", "view", ident, "--json", "jobs"], 2 * 1024 * 1024)
                    except TriageError:
                        jobs = {}
                    if isinstance(jobs, dict):
                        run["jobs"] = jobs.get("jobs") or []
                    detail_requests += 1
            result.append(run)
        data = result
    return [item for item in data if isinstance(item, dict)][:limit]


def fetch_prs(issues: list[dict[str, Any]], snapshot: Path | None, offline: bool = False) -> dict[int, dict[str, Any]]:
    if snapshot:
        data = load_json(snapshot, list)
        return {x["number"]: x for x in data if isinstance(x, dict) and isinstance(x.get("number"), int)}
    if offline:
        return {}
    prs: dict[int, dict[str, Any]] = {}
    numbers = sorted({n for issue in issues if (n := pr_number(issue)) is not None})[:MAX_PR_READS]
    for number in numbers:
        try:
            value = gh_json(["pr", "view", str(number), "--json", "number,state,mergedAt"], 64 * 1024)
        except TriageError:
            continue
        if isinstance(value, dict):
            prs[number] = value
    return prs


def parse_args(argv: list[str]) -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--dry-run", action="store_true", help="generate a report only; no GitHub writes exist")
    parser.add_argument("--repo", help="GitHub owner/name; otherwise use the current gh repository")
    parser.add_argument("--max-issues", type=int, default=MAX_ISSUES, help="open issue scan cap (1-100)")
    parser.add_argument("--max-runs", type=int, default=MAX_RUNS, help="recent workflow run cap (1-50)")
    parser.add_argument("--max-proposals", type=int, default=MAX_PROPOSALS, help="issue proposal cap (1-10)")
    parser.add_argument("--diagnostics-dir", type=Path, help="directory of manually sanitized <run-id>.txt excerpts")
    parser.add_argument("--issues-json", type=Path, help="offline open-issue snapshot for tests/review")
    parser.add_argument("--runs-json", type=Path, help="offline workflow-run snapshot for tests/review")
    parser.add_argument("--pull-requests-json", type=Path, help="offline PR-state snapshot for tests/review")
    parser.add_argument("--output", default=".runtime/triage/report.md", help="report path or - for stdout")
    args = parser.parse_args(argv)
    if not args.dry_run:
        parser.error("only read-only dry runs are supported; pass --dry-run")
    if not 1 <= args.max_issues <= MAX_ISSUES:
        parser.error(f"--max-issues must be between 1 and {MAX_ISSUES}")
    if not 1 <= args.max_runs <= MAX_RUNS:
        parser.error(f"--max-runs must be between 1 and {MAX_RUNS}")
    if not 1 <= args.max_proposals <= MAX_PROPOSALS:
        parser.error(f"--max-proposals must be between 1 and {MAX_PROPOSALS}")
    if bool(args.issues_json) != bool(args.runs_json):
        parser.error("offline mode requires both --issues-json and --runs-json")
    return args


def validate_diagnostics_dir(path: Path | None) -> Path | None:
    if path is None:
        return None
    owned = runtime_triage_dir() / "sanitized-input"
    if path.is_symlink():
        raise TriageError("The sanitized diagnostic directory must not be a symlink.")
    resolved = path.resolve()
    try:
        resolved.relative_to(owned)
    except ValueError as exc:
        raise TriageError("Sanitized diagnostic excerpts must be inside .runtime/triage/sanitized-input.") from exc
    if not resolved.is_dir():
        raise TriageError("Sanitized diagnostic directory is unavailable.")
    return resolved


def main(argv: list[str] | None = None) -> int:
    args = parse_args(argv if argv is not None else sys.argv[1:])
    try:
        owned_output = runtime_triage_dir()
        diagnostics_dir = validate_diagnostics_dir(args.diagnostics_dir)
        offline = bool(args.issues_json and args.runs_json)
        if args.repo:
            repo = safe_repo(args.repo)
        elif offline:
            repo = "repository/unknown"
        else:
            data = gh_json(["repo", "view", "--json", "nameWithOwner"], 64 * 1024)
            repo = safe_repo(str(data.get("nameWithOwner") or ""))
        issues = fetch_issues(args.max_issues, args.issues_json)
        runs = fetch_runs(args.max_runs, args.runs_json)
        prs = fetch_prs(issues, args.pull_requests_json, offline=offline)
        report = build_report(
            issues, runs, prs, repo=repo, root=ROOT, diagnostics_dir=diagnostics_dir,
            issue_limit=args.max_issues, run_limit=args.max_runs, max_proposals=args.max_proposals,
        )
    except TriageError as exc:
        print(f"triage: {exc}", file=sys.stderr)
        return 2
    if args.output == "-":
        sys.stdout.write(report)
        return 0
    target_path = ROOT / args.output if not Path(args.output).is_absolute() else Path(args.output)
    symlink_target = target_path.is_symlink()
    target = target_path.resolve()
    try:
        if target.parent != owned_output or symlink_target:
            raise ValueError("not a report file in the dedicated output directory")
    except ValueError:
        print("triage: report output must stay inside .runtime/triage or use --output -", file=sys.stderr)
        return 2
    try:
        target.parent.mkdir(parents=True, exist_ok=True)
        if target.exists() and target.read_text(encoding="utf-8", errors="replace").splitlines()[:1] != ["# Read-only issue triage report"]:
            print("triage: refusing to overwrite a file not owned by the triage report", file=sys.stderr)
            return 2
        target.write_text(report, encoding="utf-8")
    except OSError:
        print("triage: could not write the review report", file=sys.stderr)
        return 2
    print(f"Wrote read-only triage report to {target}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

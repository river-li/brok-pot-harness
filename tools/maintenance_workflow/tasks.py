"""Task scope registry, current-main linked worktree setup, and handoff bundles."""

from contextlib import contextmanager
import fcntl
import json
import os
from pathlib import Path, PurePosixPath
import re
import subprocess
import tempfile
from typing import Dict, Iterator, List, Mapping, Optional, Sequence, Tuple

from .common import (
    MaintenanceError,
    common_git_directory,
    github_main_sha,
    repository_argument,
    repository_identity,
    repository_root,
    run_git,
    run_gh_json,
    safe_evidence_url,
    sanitize_text,
    utc_now,
)


SLUG_PATTERN = re.compile(r"^[a-z0-9][a-z0-9-]{1,46}$")
SHA_PATTERN = re.compile(r"^(?:[0-9a-f]{40}|[0-9a-f]{64})$", re.IGNORECASE)
ACTIVE_TASK_STATUSES = {"preparing", "active", "failed"}


def normalized_owned_paths(values: Sequence[str]) -> List[str]:
    if not values:
        raise MaintenanceError("At least one explicit --path ownership entry is required.")
    normalized_paths = []
    for value in values:
        raw_value = value.strip()
        if not raw_value or "\\" in raw_value or any(char in raw_value for char in "*?[]"):
            raise MaintenanceError("Ownership paths must be explicit repository-relative paths.")
        path = PurePosixPath(raw_value)
        if path.is_absolute() or ".." in path.parts or not path.parts or path == PurePosixPath("."):
            raise MaintenanceError("Ownership paths cannot escape or name the repository root.")
        clean_path = "/".join(part for part in path.parts if part not in {"", "."})
        if clean_path not in normalized_paths:
            normalized_paths.append(clean_path)
    return sorted(normalized_paths)


def paths_overlap(first: str, second: str) -> bool:
    first_parts = PurePosixPath(first).parts
    second_parts = PurePosixPath(second).parts
    common_length = min(len(first_parts), len(second_parts))
    return first_parts[:common_length] == second_parts[:common_length]


def registry_paths(common_dir: Path) -> Tuple[Path, Path, Path]:
    directory = common_dir / "maintenance"
    return directory / "tasks.json", directory / "registry.lock", directory / "tasks"


def load_registry(path: Path) -> Dict[str, object]:
    if not path.exists():
        return {"version": 1, "tasks": {}}
    try:
        registry = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, ValueError):
        raise MaintenanceError("Local task ownership state is unreadable; inspect it before continuing.")
    if not isinstance(registry, dict) or registry.get("version") != 1 or not isinstance(registry.get("tasks"), dict):
        raise MaintenanceError("Local task ownership state has an unsupported format.")
    return registry


def write_registry(path: Path, registry: Mapping[str, object]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    temporary_path = None
    try:
        with tempfile.NamedTemporaryFile(
            mode="w", encoding="utf-8", dir=str(path.parent), prefix="tasks-", suffix=".tmp", delete=False
        ) as temporary_file:
            temporary_path = Path(temporary_file.name)
            json.dump(registry, temporary_file, indent=2, sort_keys=True)
            temporary_file.write("\n")
            temporary_file.flush()
            os.fsync(temporary_file.fileno())
        os.replace(str(temporary_path), str(path))
    finally:
        if temporary_path and temporary_path.exists():
            temporary_path.unlink()


@contextmanager
def locked_registry(common_dir: Path) -> Iterator[Dict[str, object]]:
    registry_path, lock_path, _ = registry_paths(common_dir)
    lock_path.parent.mkdir(parents=True, exist_ok=True)
    with lock_path.open("a+") as lock_file:
        fcntl.flock(lock_file.fileno(), fcntl.LOCK_EX)
        try:
            registry = load_registry(registry_path)
            yield registry
            write_registry(registry_path, registry)
        finally:
            fcntl.flock(lock_file.fileno(), fcntl.LOCK_UN)


def task_conflict(
    registry: Mapping[str, object], slug: str, owned_paths: Sequence[str]
) -> Optional[str]:
    task_records = registry.get("tasks")
    if not isinstance(task_records, dict):
        raise MaintenanceError("Local task ownership state has an unsupported format.")
    for registered_slug, record in task_records.items():
        if registered_slug == slug or not isinstance(record, dict):
            continue
        if record.get("status") not in ACTIVE_TASK_STATUSES:
            continue
        registered_paths = record.get("paths")
        if not isinstance(registered_paths, list):
            continue
        for requested_path in owned_paths:
            for existing_path in registered_paths:
                if isinstance(existing_path, str) and paths_overlap(requested_path, existing_path):
                    owner = sanitize_text(record.get("owner")) or "unknown owner"
                    return (
                        "scope {} overlaps registered task {} ({}, owner {}). "
                        "Coordinate or wait for release."
                    ).format(requested_path, registered_slug, existing_path, owner)
    return None


def validate_reviewer_account(value: str) -> str:
    account = value.strip().lstrip("@").strip()
    if not re.fullmatch(r"[A-Za-z0-9-]{1,39}", account):
        raise MaintenanceError("--reviewer-account must be one GitHub login without spaces.")
    return account


def validate_task_arguments(
    args: object,
) -> Tuple[str, str, str, List[str], List[str], List[str], List[str]]:
    if not SLUG_PATTERN.fullmatch(args.slug):
        raise MaintenanceError("Task slug must be 2–47 lowercase letters, digits, or hyphens.")
    owner = sanitize_text(args.owner)
    reviewer = sanitize_text(args.reviewer)
    if not owner or not reviewer:
        raise MaintenanceError("Both --owner and --reviewer are required.")
    if owner.casefold() == reviewer.casefold():
        raise MaintenanceError("Implementation owner and designated reviewer must be different agents.")
    reviewer_account = validate_reviewer_account(args.reviewer_account)
    owned_paths = normalized_owned_paths(args.path)
    acceptance = [sanitize_text(item) for item in args.accept if sanitize_text(item)]
    checks = [sanitize_text(item) for item in args.check if sanitize_text(item)]
    rollout = [sanitize_text(item) for item in args.rollout if sanitize_text(item)]
    if not acceptance:
        raise MaintenanceError("At least one --accept observable outcome is required.")
    if not checks:
        raise MaintenanceError("At least one --check pre-merge verification command is required.")
    return owner, reviewer, reviewer_account, owned_paths, acceptance, checks, rollout


def dependency_records(
    numbers: Sequence[int], repository: str, host: str, root: Path, base_sha: str
) -> List[Dict[str, object]]:
    gh_repository = repository_argument(repository, host)
    records = []
    for number in numbers:
        if number < 1:
            raise MaintenanceError("Dependency PR numbers must be positive.")
        dependency = run_gh_json(
            [
                "pr",
                "view",
                str(number),
                "--repo",
                gh_repository,
                "--json",
                "number,state,mergedAt,mergeCommit,url",
            ],
            root,
        )
        if not isinstance(dependency, dict):
            raise MaintenanceError("Could not verify dependency PR #{}.".format(number))
        merge_commit_data = dependency.get("mergeCommit")
        merge_commit = merge_commit_data.get("oid") if isinstance(merge_commit_data, dict) else None
        if str(dependency.get("state") or "").upper() != "MERGED" or not dependency.get("mergedAt"):
            raise MaintenanceError(
                "Dependency PR #{} is not merged. Wait for it to merge, then start from updated main.".format(number)
            )
        if not isinstance(merge_commit, str) or not SHA_PATTERN.fullmatch(merge_commit):
            raise MaintenanceError("Could not verify dependency PR #{} merge commit.".format(number))
        ancestor = subprocess.run(
            ["git", "merge-base", "--is-ancestor", merge_commit, base_sha],
            cwd=str(root),
            check=False,
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
        )
        if ancestor.returncode != 0:
            raise MaintenanceError(
                "Dependency PR #{} is merged but is not in fetched origin/main. "
                "Fetch updated main before starting.".format(number)
            )
        records.append(
            {
                "number": int(number),
                "url": safe_evidence_url(dependency.get("url")) or "",
                "merge_sha": merge_commit.lower(),
            }
        )
    return records


def build_task_bundle(record: Mapping[str, object]) -> str:
    paths = record.get("paths") if isinstance(record.get("paths"), list) else []
    acceptance = record.get("acceptance") if isinstance(record.get("acceptance"), list) else []
    checks = record.get("checks") if isinstance(record.get("checks"), list) else []
    rollout = record.get("rollout") if isinstance(record.get("rollout"), list) else []
    dependencies = record.get("dependencies") if isinstance(record.get("dependencies"), list) else []
    lines = [
        "# Task #{}: {}".format(record.get("issue"), sanitize_text(record.get("title")) or "(untitled)"),
        "",
        "Issue: {}".format(record.get("issue_url") or "unavailable"),
        "Repository: {}".format(record.get("repository") or "unknown"),
        "Starting origin/main SHA: {}".format(record.get("base_sha") or "unavailable"),
        "Worktree: {}".format(record.get("worktree") or "unavailable"),
        "Branch: {}".format(record.get("branch") or "unavailable"),
        "Owner agent: {}".format(sanitize_text(record.get("owner")) or "unknown"),
        "Designated reviewer agent: {}".format(sanitize_text(record.get("reviewer")) or "unknown"),
        "Expected reviewer GitHub account: @{}".format(record.get("reviewer_account") or "unknown"),
        "",
        "## Bounded ownership",
    ]
    lines.extend("- {}".format(path) for path in paths)
    lines.extend(["", "## Acceptance evidence"])
    lines.extend("- {}".format(sanitize_text(item)) for item in acceptance)
    lines.extend(["", "## Pre-merge checks"])
    lines.extend("- {}".format(sanitize_text(item)) for item in checks)
    lines.extend(["", "## Expected post-merge rollout"])
    if rollout:
        lines.extend("- {}".format(sanitize_text(item)) for item in rollout)
    else:
        lines.append("- None declared.")
    lines.append("A rollout that only runs after merge is not a pre-merge dependency by itself.")
    lines.extend(["", "## PR dependencies"])
    if dependencies:
        lines.extend(
            "- PR #{} must already be merged into the starting main snapshot.".format(item)
            for item in dependencies
        )
    else:
        lines.append("- None declared.")
    lines.extend(
        [
            "",
            "## Delivery and handoff",
            "- Keep the change within the listed ownership; coordinate new overlapping work before editing it.",
            "- Implement acceptance with relevant tests and documentation in this delivery.",
            "- Run the listed checks and report exact results, limitations, head SHA, and main base SHA.",
            (
                "- Open one PR targeting main with a concise explanation of behavior and design. "
                "Use Refs #{} while criteria remain open; use Fixes only when acceptance is met "
                "and closure on merge is intended."
            ).format(record.get("issue")),
            (
                "- Hand the published head and base to the designated reviewer agent, distinct from "
                "the implementation owner. A designated coordinator may review when separate from "
                "the author."
            ),
            (
                "- Submit a natural-language review summary first, followed by a GBH review evidence "
                "metadata block containing verdict, head SHA, and base SHA."
            ),
            (
                "- GitHub account metadata identifies the posting account; the task's prior account "
                "binding and reviewer role provide process evidence, not proof of agent identity."
            ),
            "- The coordinator routes findings and merges only under explicit merge authority.",
            "",
            "## Limits",
            (
                "- The worktree was created from the fetched origin/main SHA above. Git cannot prove "
                "historical branch creation or detect copied commits from unmerged work."
            ),
            (
                "- Ownership conflicts are checked only against tasks registered in this shared Git "
                "metadata. Other clones and unregistered tasks need coordinator coordination."
            ),
            "- Task setup changes local Git refs/worktree metadata only; it does not post or change GitHub state.",
        ]
    )
    return "\n".join(lines) + "\n"


def task_start(args: object, start: Path) -> str:
    root = repository_root(start)
    common_dir = common_git_directory(root)
    if root.resolve() != common_dir.parent.resolve():
        raise MaintenanceError("Run task setup from the primary checkout, not from another linked worktree.")
    if args.issue < 1:
        raise MaintenanceError("Issue number must be positive.")
    owner, reviewer, reviewer_account, owned_paths, acceptance, checks, rollout = validate_task_arguments(args)
    repository, host = repository_identity(root)
    gh_repository = repository_argument(repository, host)

    fetch_result = subprocess.run(
        ["git", "fetch", "--no-tags", "origin", "+refs/heads/main:refs/remotes/origin/main"],
        cwd=str(root),
        check=False,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
    )
    if fetch_result.returncode:
        raise MaintenanceError("Could not fetch origin/main. Check origin access and retry.")
    base_sha = run_git(["rev-parse", "--verify", "refs/remotes/origin/main^{commit}"], root).lower()
    github_base_sha = github_main_sha(repository, host, root)
    if base_sha != github_base_sha:
        raise MaintenanceError(
            "Fetched origin/main does not match the canonical GitHub main SHA. "
            "Main may have moved or origin fetch resolution differs; fetch again and retry."
        )

    issue_result = run_gh_json(
        ["issue", "view", str(args.issue), "--repo", gh_repository, "--json", "number,title,state,url"],
        root,
    )
    if not isinstance(issue_result, dict) or str(issue_result.get("number")) != str(args.issue):
        raise MaintenanceError("GitHub did not return the requested issue.")
    if str(issue_result.get("state") or "").upper() != "OPEN":
        raise MaintenanceError("Issue #{} is not open; confirm the selected work before setup.".format(args.issue))
    issue_url = safe_evidence_url(issue_result.get("url"))
    if not issue_url:
        raise MaintenanceError("GitHub did not return a safe issue URL.")

    dependencies = dependency_records(args.depends_on_pr, repository, host, root, base_sha)
    worktree = root / ".runtime" / "worktrees" / args.slug
    branch = "agent/{}".format(args.slug)
    registry_path, _, bundle_directory = registry_paths(common_dir)
    bundle_path = bundle_directory / "{}.md".format(args.slug)
    if os.path.lexists(str(worktree)):
        raise MaintenanceError("Task worktree path already exists; it was left untouched: {}".format(worktree))
    if os.path.lexists(str(bundle_path)):
        raise MaintenanceError("Task bundle already exists; it was left untouched: {}".format(bundle_path))
    branch_check = subprocess.run(
        ["git", "show-ref", "--verify", "--quiet", "refs/heads/{}".format(branch)],
        cwd=str(root),
        check=False,
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
    )
    if branch_check.returncode == 0:
        raise MaintenanceError("Task branch already exists; it was left untouched: {}".format(branch))
    if branch_check.returncode != 1:
        raise MaintenanceError("Could not verify whether the task branch already exists.")

    record = {
        "slug": args.slug,
        "issue": int(args.issue),
        "title": sanitize_text(issue_result.get("title")),
        "issue_url": issue_url,
        "repository": repository,
        "base_sha": base_sha,
        "branch": branch,
        "worktree": str(worktree),
        "owner": owner,
        "reviewer": reviewer,
        "reviewer_account": reviewer_account,
        "paths": owned_paths,
        "acceptance": acceptance,
        "checks": checks,
        "rollout": rollout,
        "dependencies": [item["number"] for item in dependencies],
        "dependency_evidence": dependencies,
        "status": "preparing",
        "created_at": utc_now(),
    }
    with locked_registry(common_dir) as registry:
        conflict = task_conflict(registry, args.slug, owned_paths)
        if conflict:
            raise MaintenanceError(conflict)
        task_records = registry["tasks"]
        if args.slug in task_records:
            raise MaintenanceError("Task slug {} is already registered; inspect or release it first.".format(args.slug))
        task_records[args.slug] = record

    try:
        worktree.parent.mkdir(parents=True, exist_ok=True)
        add_result = subprocess.run(
            ["git", "worktree", "add", "-b", branch, str(worktree), base_sha],
            cwd=str(root),
            check=False,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
        )
        if add_result.returncode:
            raise MaintenanceError(
                "Git could not create the linked worktree (exit {}). The task registration "
                "remains failed for inspection.".format(add_result.returncode)
            )
        created_sha = run_git(["rev-parse", "--verify", "HEAD^{commit}"], worktree).lower()
        created_branch = run_git(["branch", "--show-current"], worktree)
        if created_sha != base_sha or created_branch != branch:
            raise MaintenanceError(
                "Created worktree did not match the recorded main snapshot; inspect it before release."
            )
        record["status"] = "active"
        record["bundle_path"] = str(bundle_path)
        record["created_at"] = utc_now()
        bundle_directory.mkdir(parents=True, exist_ok=True)
        with bundle_path.open("x", encoding="utf-8") as bundle_file:
            bundle_file.write(build_task_bundle(record))
    except Exception:
        with locked_registry(common_dir) as registry:
            task_records = registry.get("tasks")
            if isinstance(task_records, dict) and args.slug in task_records:
                task_records[args.slug]["status"] = "failed"
                task_records[args.slug]["failure_note"] = (
                    "Setup stopped; inspect worktree and bundle paths before release."
                )
        raise

    with locked_registry(common_dir) as registry:
        registry["tasks"][args.slug] = record
    return "Created task #{} at {}\nBranch: {}\nStarting main SHA: {}\nTask bundle: {}".format(
        args.issue, worktree, branch, base_sha, bundle_path
    )


def find_task_assignment(start: Path, branch: str) -> Optional[Mapping[str, object]]:
    try:
        root = repository_root(start)
        common_dir = common_git_directory(root)
        registry_path, _, _ = registry_paths(common_dir)
        registry = load_registry(registry_path)
    except MaintenanceError:
        return None
    task_records = registry.get("tasks")
    if not isinstance(task_records, dict):
        return None
    for record in task_records.values():
        if isinstance(record, dict) and record.get("branch") == branch and record.get("status") in ACTIVE_TASK_STATUSES:
            return record
    return None


def task_list(start: Path) -> str:
    root = repository_root(start)
    common_dir = common_git_directory(root)
    registry_path, _, _ = registry_paths(common_dir)
    registry = load_registry(registry_path)
    task_records = registry.get("tasks")
    lines = ["# Registered maintenance tasks", ""]
    if not isinstance(task_records, dict) or not task_records:
        lines.append("No tasks are registered in this checkout.")
    else:
        for slug, record in sorted(task_records.items()):
            if not isinstance(record, dict):
                continue
            paths = record.get("paths")
            scope = ", ".join(path for path in paths if isinstance(path, str)) if isinstance(paths, list) else ""
            lines.append(
                "- {}: {} #{}; owner {}; reviewer {} (@{}); scope {}; status {}".format(
                    slug,
                    sanitize_text(record.get("title")) or "(untitled)",
                    record.get("issue", "?"),
                    sanitize_text(record.get("owner")) or "unknown",
                    sanitize_text(record.get("reviewer")) or "unknown",
                    sanitize_text(record.get("reviewer_account")) or "unbound",
                    scope,
                    record.get("status", "unknown"),
                )
            )
    return "\n".join(lines) + "\n"


def task_release(args: object, start: Path) -> str:
    if not sanitize_text(args.reason):
        raise MaintenanceError("A short --reason is required to release task ownership.")
    root = repository_root(start)
    common_dir = common_git_directory(root)
    with locked_registry(common_dir) as registry:
        task_records = registry.get("tasks")
        if not isinstance(task_records, dict) or args.slug not in task_records:
            raise MaintenanceError("Task {} is not registered in this checkout.".format(args.slug))
        record = task_records[args.slug]
        if not isinstance(record, dict):
            raise MaintenanceError("Task state is malformed; inspect it before release.")
        if record.get("status") not in ACTIVE_TASK_STATUSES:
            raise MaintenanceError("Task {} is already released or inactive.".format(args.slug))
        record["status"] = "released"
        record["released_at"] = utc_now()
        record["release_reason"] = sanitize_text(args.reason)
    return "Released ownership for task {}. The worktree and branch were left untouched.".format(args.slug)

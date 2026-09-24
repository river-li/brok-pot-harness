#!/usr/bin/env python3
"""Run required offline PR gates and report the tested checkout and source range."""

from pathlib import Path
import os
import re
import subprocess
import sys
from typing import List, Mapping, Optional, Tuple


ROOT = Path(__file__).resolve().parents[2]
REPORT = ROOT / ".runtime/tests/ci/required-gates.md"
CONTRACTS = [
    ("Responses and Auto-review contracts", ["npm", "run", "test:responses-contract"]),
    ("Web fetch contract", ["npm", "run", "test:web-fetch"]),
    ("Web search contract", ["npm", "run", "test:web-search"]),
    ("Transcription contract", ["npm", "run", "test:transcription"]),
    ("TTS contract", ["npm", "run", "test:tts"]),
    ("Voice contracts", ["npm", "run", "test:voice"]),
    ("MCP store contract", ["npm", "run", "test:mcp-store"]),
    ("MCP scope contract", ["npm", "run", "test:mcp-scopes"]),
    ("Plugin file contract", ["npm", "run", "test:plugin-files"]),
    ("Curated marketplace and Bot recipe contract", ["npm", "run", "test:marketplace-contract"]),
    ("Desktop keychain policy contract", ["npm", "run", "test:desktop-keychain"]),
    ("Remote client, server, and recovery contracts", ["npm", "run", "test:remote-contracts"]),
]
SHA_RE = re.compile(r"^(?:[0-9a-fA-F]{40}|[0-9a-fA-F]{64})$")
ZERO_SHA_RE = re.compile(r"^(?:0{40}|0{64})$")
CI_EVENTS = {"pull_request", "push", "workflow_dispatch"}
DOC_SUFFIXES = {".md", ".mdx"}
FULL_GATES = [
    ("Strict local TypeScript", ["npm", "run", "check:local"]),
    ("Recovery tests", ["npm", "run", "test:recovery"]),
    ("Runtime build tests", ["npm", "run", "test:runtime-build"]),
    ("JavaScript syntax", ["npm", "run", "check:syntax"]),
    ("Docs and scoped-guide audit", ["npm", "run", "docs:check"]),
]
DOC_GATES = [
    ("Recovery tests", ["npm", "run", "test:recovery"]),
    ("Docs and scoped-guide audit", ["npm", "run", "docs:check"]),
]


def run(label: str, command: List[str]) -> str:
    print("\n=== {} ===".format(label), flush=True)
    print("$ " + " ".join(command), flush=True)
    try:
        result = subprocess.run(command, cwd=ROOT, check=False)
    except OSError as error:
        print("Could not start check: {}".format(error), file=sys.stderr, flush=True)
        return "failed"
    return "passed" if result.returncode == 0 else "failed (exit {})".format(result.returncode)


def git_output(command: List[str], root: Path) -> Optional[str]:
    result = subprocess.run(
        ["git"] + command,
        cwd=root,
        check=False,
        capture_output=True,
        text=True,
    )
    if result.returncode:
        return None
    return result.stdout.strip()


def git_command(command: List[str], root: Path) -> subprocess.CompletedProcess:
    return subprocess.run(
        ["git"] + command,
        cwd=root,
        check=False,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
    )


def resolve_commit(value: str, label: str, root: Path) -> Tuple[Optional[str], Optional[str]]:
    if not SHA_RE.fullmatch(value):
        return None, "{} is not a full commit SHA".format(label)
    resolved = git_output(["rev-parse", "--verify", "--quiet", "{}^{{commit}}".format(value)], root)
    if not resolved:
        return None, "{} does not resolve to a commit".format(label)
    return resolved, None


def current_commit(root: Path) -> Tuple[Optional[str], Optional[str]]:
    resolved = git_output(["rev-parse", "--verify", "HEAD^{commit}"], root)
    if not resolved:
        return None, "checked-out HEAD does not resolve to a commit"
    return resolved, None


def is_root_commit(commit: str, root: Path) -> bool:
    parents = git_output(["rev-list", "--parents", "-n", "1", commit], root)
    return bool(parents) and len(parents.split()) == 1


def empty_tree(root: Path) -> Optional[str]:
    return git_output(["hash-object", "-t", "tree", "/dev/null"], root)


def common_base(base: str, head: str, root: Path) -> Optional[str]:
    return git_output(["merge-base", base, head], root)


def is_ancestor(base: str, head: str, root: Path) -> Optional[bool]:
    result = subprocess.run(
        ["git", "merge-base", "--is-ancestor", base, head],
        cwd=root,
        check=False,
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
    )
    if result.returncode == 0:
        return True
    if result.returncode == 1:
        return False
    return None


def default_branch_commit(branch: str, root: Path) -> Tuple[Optional[str], Optional[str]]:
    valid = subprocess.run(
        ["git", "check-ref-format", "--branch", branch],
        cwd=root,
        check=False,
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
    )
    if valid.returncode:
        return None, "default branch name is invalid"
    resolved = git_output(
        ["rev-parse", "--verify", "--quiet", "refs/remotes/origin/{}^{{commit}}".format(branch)],
        root,
    )
    if not resolved:
        return None, "origin default branch is unavailable"
    return resolved, None


def validate_pr_base(event: Optional[str], context: Mapping[str, str], root: Path = ROOT) -> Optional[str]:
    """Reject stacked or stale PRs before installing dependencies or running gates."""
    if event != "pull_request":
        return None

    base_ref = context.get("CI_PR_BASE_REF", "").strip()
    if base_ref != "main":
        return "pull request base must be main; got {}".format(base_ref or "missing")
    if context.get("CI_DEFAULT_BRANCH", "").strip() != "main":
        return "repository default branch is not main"

    base, error = resolve_commit(context.get("CI_PR_BASE_SHA", "").strip(), "pull request base SHA", root)
    if error:
        return error
    head, error = resolve_commit(context.get("CI_PR_HEAD_SHA", "").strip(), "pull request head SHA", root)
    if error:
        return error
    current_main, error = default_branch_commit("main", root)
    if error:
        return error
    if base != current_main:
        return "pull request base commit does not match current origin/main"

    ancestor = is_ancestor(base, head, root)
    if ancestor is None:
        return "could not verify that the pull request head includes its base"
    if not ancestor:
        return "pull request head does not include current origin/main; update from main before review"
    return None


def validate_pre_pr(root: Path = ROOT, fetch: bool = False) -> Tuple[Optional[str], dict]:
    """Check that this is a clean linked worktree containing current origin/main."""
    details = {"event": "pre-pr"}
    branch = git_output(["symbolic-ref", "--quiet", "--short", "HEAD"], root)
    if not branch:
        return "HEAD is detached; switch to the PR branch before running pre-PR checks", details
    details["branch"] = branch
    if branch == "main":
        return "pre-PR checks require a task branch, not main", details

    git_dir = git_output(["rev-parse", "--absolute-git-dir"], root)
    common_dir = git_output(["rev-parse", "--path-format=absolute", "--git-common-dir"], root)
    if not git_dir or not common_dir or Path(git_dir).resolve() == Path(common_dir).resolve():
        return "pre-PR checks require an isolated linked worktree; create one with git worktree add", details
    details["linked_worktree"] = "yes"

    status = git_command(["status", "--porcelain=v1", "--untracked-files=all"], root)
    if status.returncode:
        return "could not read worktree status", details
    if status.stdout:
        return "worktree is not clean; commit or remove staged, unstaged, and untracked changes first", details

    if fetch:
        result = subprocess.run(
            ["git", "fetch", "--no-tags", "origin", "+refs/heads/main:refs/remotes/origin/main"],
            cwd=root,
            check=False,
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
        )
        if result.returncode:
            return "could not fetch current origin/main; check origin access and retry", details

    main, error = default_branch_commit("main", root)
    if error:
        return "{}; fetch origin main before retrying".format(error), details
    head, error = current_commit(root)
    if error:
        return error, details
    details["current_main"] = main
    details["checked_out_commit"] = head
    ancestor = is_ancestor(main, head, root)
    if ancestor is None:
        return "could not verify the branch against current origin/main", details
    if not ancestor:
        return "branch does not contain current origin/main; update it and rerun the checks", details

    changed = git_command(["diff", "--name-only", "--no-renames", "-z", "{}...{}".format(main, head)], root)
    if changed.returncode:
        return "could not select the branch changes against current origin/main", details
    paths = [part.decode("utf-8", "surrogateescape") for part in changed.stdout.split(b"\0") if part]
    if not paths:
        return "branch has no committed changes relative to current origin/main", details
    details["diff_base"] = main
    details["diff_head"] = head
    details["diff_range"] = "{}...{} (current origin/main to task branch)".format(main, head)
    details["changed_paths"] = paths
    return None, details


def select_diff_command(
    event: Optional[str],
    context: Mapping[str, str],
    root: Path = ROOT,
) -> Tuple[Optional[List[str]], str, dict, Optional[str]]:
    """Choose a verified diff range for PR, push, dispatch, or local runs."""
    details = {}
    checkout, error = current_commit(root)
    if error:
        return None, "unavailable", details, error
    details["checked_out_commit"] = checkout

    event_sha = context.get("CI_EVENT_SHA", "").strip()
    if event_sha:
        expected, error = resolve_commit(event_sha, "event commit", root)
        if error:
            return None, "unavailable", details, error
        if expected != checkout:
            return None, "unavailable", details, "event commit does not match checked-out HEAD"

    if not event:
        if context.get("GITHUB_ACTIONS") == "true":
            return None, "unavailable", details, "CI event name is missing"
        details["event"] = "local"
        details["diff_range"] = "working tree"
        return ["git", "diff", "--check"], "git diff --check (local working tree)", details, None

    if event not in CI_EVENTS:
        return None, "unavailable", details, "unsupported CI event"
    details["event"] = event

    if event == "pull_request":
        error = validate_pr_base(event, context, root)
        if error:
            return None, "unavailable", details, error
        base, error = resolve_commit(context.get("CI_PR_BASE_SHA", "").strip(), "pull request base SHA", root)
        if error:
            return None, "unavailable", details, error
        head, error = resolve_commit(context.get("CI_PR_HEAD_SHA", "").strip(), "pull request head SHA", root)
        if error:
            return None, "unavailable", details, error
        details["pull_request_base"] = base
        details["pull_request_head"] = head
        details["diff_range"] = "{}...{} (pull request source diff)".format(base, head)
        return ["git", "diff", "--check", "{}...{}".format(base, head)], details["diff_range"], details, None

    if event == "push":
        before_value = context.get("CI_BEFORE_SHA", "").strip()
        if not before_value:
            return None, "unavailable", details, "push before SHA is missing"
        if not ZERO_SHA_RE.fullmatch(before_value):
            before, error = resolve_commit(before_value, "push before SHA", root)
            if error:
                return None, "unavailable", details, error
            details["diff_base"] = before
            details["diff_head"] = checkout
            details["diff_range"] = "{} {} (push before/head trees)".format(before, checkout)
            return ["git", "diff", "--check", before, checkout], details["diff_range"], details, None

    if event in {"push", "workflow_dispatch"} and is_root_commit(checkout, root):
        tree = empty_tree(root)
        if tree:
            details["diff_base"] = tree
            details["diff_head"] = checkout
            details["diff_range"] = "{} {} (root commit against empty tree)".format(tree, checkout)
            return ["git", "diff", "--check", tree, checkout], details["diff_range"], details, None

    branch = context.get("CI_DEFAULT_BRANCH", "").strip()
    if not branch:
        return None, "unavailable", details, "default branch is missing and checkout is not a root commit"
    default, error = default_branch_commit(branch, root)
    if error:
        return None, "unavailable", details, error
    base = common_base(default, checkout, root)
    if not base:
        return None, "unavailable", details, "default branch and checkout have no common base"

    mode = "new branch" if event == "push" else "manual dispatch"
    details["diff_base"] = base
    details["diff_head"] = checkout
    details["diff_range"] = "{} {} ({}; origin default branch common base)".format(base, checkout, mode)
    return ["git", "diff", "--check", base, checkout], details["diff_range"], details, None


def changed_paths(details: Mapping[str, str], root: Path = ROOT) -> Tuple[List[str], Optional[str]]:
    event = details.get("event")
    if event == "pull_request":
        base = details.get("pull_request_base")
        head = details.get("pull_request_head")
        revision = "{}...{}".format(base, head) if base and head else ""
    else:
        base = details.get("diff_base")
        head = details.get("diff_head")
        revision = "{} {}".format(base, head) if base and head else ""
    if not revision:
        return [], "verified source range is unavailable for changed-path selection"
    result = git_command(["diff", "--name-only", "--no-renames", "-z"] + revision.split(), root)
    if result.returncode:
        return [], "could not read changed paths from the verified source range"
    return [part.decode("utf-8", "surrogateescape") for part in result.stdout.split(b"\0") if part], None


def gate_plan(paths: List[str]) -> Tuple[str, List[Tuple[str, List[str]]]]:
    if paths and all(Path(path).suffix.lower() in DOC_SUFFIXES for path in paths):
        return "documentation-only", list(DOC_GATES)
    return "full source and contract", list(FULL_GATES)


def diff_check(details: Mapping[str, str], execute=run) -> Tuple[str, str]:
    event = details.get("event")
    if event == "pull_request":
        base = details.get("pull_request_base")
        head = details.get("pull_request_head")
        revision = "{}...{}".format(base, head) if base and head else ""
        description = "{} (pull request source diff)".format(revision)
    else:
        base = details.get("diff_base")
        head = details.get("diff_head")
        revision = "{} {}".format(base, head) if base and head else ""
        description = details.get("diff_range", revision or "unavailable")
    if not revision:
        print("Diff hygiene could not select a verified source range", file=sys.stderr, flush=True)
        return "failed (unavailable range)", description
    return execute("Diff hygiene", ["git", "diff", "--check"] + revision.split()), description


def contract_results(build_result: str, execute=run) -> List[Tuple[str, str]]:
    if build_result != "passed":
        return [(name, "not run (local build failed)") for name, _ in CONTRACTS]
    return [(name, execute(name, command)) for name, command in CONTRACTS]


def checked_out_sha() -> str:
    commit, error = current_commit(ROOT)
    return commit if not error and commit else "unavailable"


def write_report(
    results: List[Tuple[str, str]],
    overall: str,
    diff_details: Mapping[str, str],
    selection: str,
    changed_count: int,
) -> None:
    event = diff_details.get("event", "unknown")
    lines = [
        "# Required CI evidence",
        "",
        "- Result: **{}**".format(overall),
        "- Build profile: local",
        "- Verification layer: required offline PR gates",
        "- Event: {}".format(event),
        "- Checked-out commit: {}".format(diff_details.get("checked_out_commit", checked_out_sha())),
        "- Selected lane: {} ({} changed paths)".format(selection, changed_count),
    ]
    if "pull_request_base" in diff_details:
        lines.append("- Pull request base commit: {}".format(diff_details["pull_request_base"]))
        lines.append("- Pull request head commit: {}".format(diff_details["pull_request_head"]))
    if "diff_range" in diff_details:
        lines.append("- Diff hygiene range: {}".format(diff_details["diff_range"]))
    lines.extend([
        "- External inference: **not attempted**. Fixture responses in contract tests are not provider evidence.",
        "- Contents: check names and outcomes only; no prompts, transcripts, screenshots, logs, credentials, or environment values.",
        "",
        "| Required gate | Result |",
        "| --- | --- |",
    ])
    lines.extend("| {} | {} |".format(name, result) for name, result in results)
    content = "\n".join(lines) + "\n"
    REPORT.parent.mkdir(parents=True, exist_ok=True)
    REPORT.write_text(content, encoding="utf-8")
    summary = os.environ.get("GITHUB_STEP_SUMMARY")
    if summary:
        with open(summary, "a", encoding="utf-8") as stream:
            stream.write(content)


def validate_only(root: Path = ROOT) -> int:
    event = os.environ.get("CI_EVENT")
    error = validate_pr_base(event, os.environ, root)
    if error:
        print("PR base validation failed: {}".format(error), file=sys.stderr, flush=True)
        return 1
    if event == "pull_request":
        print("PASS: PR targets current main and its head includes the base commit.", flush=True)
    return 0


def execute_required(details: dict, paths: List[str], root: Path = ROOT, execute=run) -> int:
    selection, gates = gate_plan(paths)
    print("Selected checks: {} ({} changed paths)".format(selection, len(paths)), flush=True)
    results: List[Tuple[str, str]] = []
    build_result = "not required for documentation-only changes"
    if selection != "documentation-only":
        build_result = execute("Recovery/build integrity", ["npm", "run", "build", "--", "--profile", "local"])
        results.append(("Recovery/build integrity (npm run build -- --profile local)", build_result))
    for name, command in gates:
        results.append((name, execute(name, command)))
    if selection != "documentation-only":
        results.extend(contract_results(build_result, execute))
    diff_result, diff_description = diff_check(details, execute)
    results.append(("Diff hygiene ({})".format(diff_description), diff_result))
    overall = "passed" if all(result == "passed" for _, result in results) else "failed"
    write_report(results, overall, details, selection, len(paths))
    return 0 if overall == "passed" else 1


def pre_pr(root: Path = ROOT) -> int:
    error, details = validate_pre_pr(root, fetch=True)
    if error:
        print("Pre-PR validation failed: {}".format(error), file=sys.stderr, flush=True)
        print("Git can verify current ancestry, cleanliness, and worktree isolation; it cannot prove the branch's creation history or infer intent.", file=sys.stderr, flush=True)
        return 1
    print("PASS: clean linked worktree on {} contains current origin/main.".format(details.get("branch")), flush=True)
    print("This verifies present ancestry only; it cannot prove where the branch was originally created or that work was not copied from an unmerged branch.", flush=True)
    return execute_required(details, details["changed_paths"], root)


def main(argv: Optional[List[str]] = None) -> int:
    import argparse

    parser = argparse.ArgumentParser(description=__doc__)
    modes = parser.add_mutually_exclusive_group()
    modes.add_argument("--validate-pr-base", action="store_true")
    modes.add_argument("--pre-pr", action="store_true")
    parser.add_argument("--root", type=Path, default=ROOT, help=argparse.SUPPRESS)
    arguments = parser.parse_args(sys.argv[1:] if argv is None else argv)
    root = arguments.root.resolve()
    if arguments.validate_pr_base:
        return validate_only(root)
    if arguments.pre_pr:
        return pre_pr(root)

    event = os.environ.get("CI_EVENT")
    if not event:
        print("CI event is missing. Use npm run ci:pre-pr for local branch validation.", file=sys.stderr)
        return 2
    if event not in CI_EVENTS:
        print("Unsupported CI event: {}".format(event), file=sys.stderr)
        return 2
    if event == "pull_request":
        error = validate_pr_base(event, os.environ, root)
        if error:
            print("PR base validation failed: {}".format(error), file=sys.stderr, flush=True)
            return 1
    command, description, details, error = select_diff_command(event, os.environ, root)
    if error:
        print("Could not select CI source range: {}".format(error), file=sys.stderr, flush=True)
        return 1
    paths, error = changed_paths(details, root)
    if error:
        print("Could not select CI checks: {}".format(error), file=sys.stderr, flush=True)
        return 1
    details["diff_range"] = description
    print("Build profile: local | Verification layer: required offline PR gates", flush=True)
    return execute_required(details, paths, root)


if __name__ == "__main__":
    raise SystemExit(main())

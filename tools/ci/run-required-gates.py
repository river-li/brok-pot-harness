#!/usr/bin/env python3
"""Run the required offline PR gates and write a redacted evidence summary."""
from pathlib import Path
import os
import re
import subprocess
import sys
from typing import Mapping

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
    ("Desktop keychain policy contract", ["npm", "run", "test:desktop-keychain"]),
]
SHA_RE = re.compile(r"^(?:[0-9a-fA-F]{40}|[0-9a-fA-F]{64})$")
ZERO_SHA_RE = re.compile(r"^(?:0{40}|0{64})$")
CI_EVENTS = {"pull_request", "push", "workflow_dispatch"}


def run(label: str, command: list[str]) -> str:
    print(f"\n=== {label} ===", flush=True)
    print("$ " + " ".join(command), flush=True)
    try:
        result = subprocess.run(command, cwd=ROOT, check=False)
    except OSError as error:
        print(f"Could not start check: {error}", file=sys.stderr, flush=True)
        return "failed"
    return "passed" if result.returncode == 0 else f"failed (exit {result.returncode})"


def git_output(command: list[str], root: Path) -> str | None:
    result = subprocess.run(
        ["git", *command],
        cwd=root,
        check=False,
        capture_output=True,
        text=True,
    )
    if result.returncode:
        return None
    return result.stdout.strip()


def resolve_commit(value: str, label: str, root: Path) -> tuple[str | None, str | None]:
    if not SHA_RE.fullmatch(value):
        return None, f"{label} is not a full commit SHA"
    resolved = git_output(["rev-parse", "--verify", "--quiet", f"{value}^{{commit}}"], root)
    if not resolved:
        return None, f"{label} does not resolve to a commit"
    return resolved, None


def current_commit(root: Path) -> tuple[str | None, str | None]:
    resolved = git_output(["rev-parse", "--verify", "HEAD^{commit}"], root)
    if not resolved:
        return None, "checked-out HEAD does not resolve to a commit"
    return resolved, None


def is_root_commit(commit: str, root: Path) -> bool:
    parents = git_output(["rev-list", "--parents", "-n", "1", commit], root)
    return bool(parents) and len(parents.split()) == 1


def empty_tree(root: Path) -> str | None:
    return git_output(["hash-object", "-t", "tree", "/dev/null"], root)


def common_base(base: str, head: str, root: Path) -> str | None:
    return git_output(["merge-base", base, head], root)


def default_branch_commit(branch: str, root: Path) -> tuple[str | None, str | None]:
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
        ["rev-parse", "--verify", "--quiet", f"refs/remotes/origin/{branch}^{{commit}}"],
        root,
    )
    if not resolved:
        return None, "origin default branch is unavailable"
    return resolved, None


def select_diff_command(
    event: str | None,
    context: Mapping[str, str],
    root: Path = ROOT,
) -> tuple[list[str] | None, str, dict[str, str], str | None]:
    """Choose a diff check range; missing or malformed CI refs are failures."""
    details: dict[str, str] = {}
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
        base, error = resolve_commit(context.get("CI_PR_BASE_SHA", "").strip(), "pull request base SHA", root)
        if error:
            return None, "unavailable", details, error
        head, error = resolve_commit(context.get("CI_PR_HEAD_SHA", "").strip(), "pull request head SHA", root)
        if error:
            return None, "unavailable", details, error
        details["pull_request_base"] = base
        details["pull_request_head"] = head
        details["diff_range"] = f"{base}...{head} (pull request source diff)"
        return ["git", "diff", "--check", f"{base}...{head}"], details["diff_range"], details, None

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
            details["diff_range"] = f"{before} {checkout} (push before/head trees)"
            return ["git", "diff", "--check", before, checkout], details["diff_range"], details, None

    if event in {"push", "workflow_dispatch"} and is_root_commit(checkout, root):
        tree = empty_tree(root)
        if tree:
            details["diff_base"] = tree
            details["diff_head"] = checkout
            details["diff_range"] = f"{tree} {checkout} (root commit against empty tree)"
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
    details["diff_range"] = f"{base} {checkout} ({mode}; origin default branch common base)"
    return ["git", "diff", "--check", base, checkout], details["diff_range"], details, None


def diff_check() -> tuple[str, str, dict[str, str]]:
    command, description, details, error = select_diff_command(
        os.environ.get("CI_EVENT"), os.environ, ROOT
    )
    if error:
        print(f"Diff hygiene could not select a verified range: {error}", file=sys.stderr, flush=True)
        return "failed", description, details
    return run("Diff hygiene", command or []), description, details


def checked_out_sha() -> str:
    commit, error = current_commit(ROOT)
    return commit if not error and commit else "unavailable"


def write_report(results: list[tuple[str, str]], overall: str, diff_details: Mapping[str, str]) -> None:
    profile = "local"
    layer = "required offline PR gates"
    event = diff_details.get("event", "unknown")
    lines = [
        "# Required CI evidence",
        "",
        f"- Result: **{overall}**",
        f"- Build profile: `{profile}`",
        f"- Verification layer: `{layer}`",
        f"- Event: `{event}`",
        f"- Checked-out commit: `{diff_details.get('checked_out_commit', checked_out_sha())}`",
    ]
    if "pull_request_base" in diff_details:
        lines.append(f"- Pull request base commit: `{diff_details['pull_request_base']}`")
        lines.append(f"- Pull request head commit: `{diff_details['pull_request_head']}`")
    if "diff_range" in diff_details:
        lines.append(f"- Diff hygiene range: `{diff_details['diff_range']}`")
    lines.extend([
        "- External inference: **not attempted**. Fixture responses in contract tests are not provider evidence.",
        "- Contents: check names and outcomes only; no prompts, transcripts, screenshots, logs, credentials, or environment values.",
        "",
        "| Required gate | Result |",
        "| --- | --- |",
    ])
    lines.extend(f"| {name} | {result} |" for name, result in results)
    content = "\n".join(lines) + "\n"
    REPORT.parent.mkdir(parents=True, exist_ok=True)
    REPORT.write_text(content, encoding="utf-8")
    summary = os.environ.get("GITHUB_STEP_SUMMARY")
    if summary:
        with open(summary, "a", encoding="utf-8") as stream:
            stream.write(content)


def main() -> int:
    print("Build profile: local | Verification layer: required offline PR gates", flush=True)
    results: list[tuple[str, str]] = []
    build_result = run("Recovery/build integrity", ["npm", "run", "build", "--", "--profile", "local"])
    results.append(("Recovery/build integrity (`npm run build -- --profile local`)", build_result))
    for name, command in [
        ("Strict local TypeScript (`npm run check:local`)", ["npm", "run", "check:local"]),
        ("Recovery tests (`npm run test:recovery`)", ["npm", "run", "test:recovery"]),
        ("Runtime build tests (`npm run test:runtime-build`)", ["npm", "run", "test:runtime-build"]),
        ("JavaScript syntax (`npm run check:syntax`)", ["npm", "run", "check:syntax"]),
        ("Docs export (`npm run docs:check`)", ["npm", "run", "docs:check"]),
    ]:
        results.append((name, run(name.split(" (`", 1)[0], command)))
    if build_result == "passed":
        for name, command in CONTRACTS:
            results.append((name, run(name, command)))
    else:
        results.extend((name, "not run (local build failed)") for name, _ in CONTRACTS)
    diff_result, diff_description, diff_details = diff_check()
    results.append((f"Diff hygiene (`{diff_description}`)", diff_result))
    overall = "passed" if all(result == "passed" for _, result in results) else "failed"
    write_report(results, overall, diff_details)
    return 0 if overall == "passed" else 1


if __name__ == "__main__":
    raise SystemExit(main())

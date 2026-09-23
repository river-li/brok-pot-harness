#!/usr/bin/env python3
"""Fast checks against the Git index that the next commit will record."""

import argparse
import json
from pathlib import Path
import re
import subprocess
import sys
from typing import List, Optional, Tuple


ROOT = Path(__file__).resolve().parents[2]
MARKER = re.compile(rb"^// @recovered-fragment (\d+)/(\d+)\r?$", re.M)
SOURCE_SUFFIXES = {".cjs", ".js", ".jsx", ".mjs", ".ts", ".tsx"}


def git(root: Path, arguments: List[str], capture: bool = True) -> subprocess.CompletedProcess:
    return subprocess.run(
        ["git"] + arguments,
        cwd=root,
        check=False,
        stdout=subprocess.PIPE if capture else None,
        stderr=subprocess.PIPE if capture else None,
    )


def staged_paths(root: Path) -> Tuple[List[str], Optional[str]]:
    result = git(root, ["diff", "--cached", "--name-only", "--no-renames", "-z"])
    if result.returncode:
        return [], result.stderr.decode("utf-8", "replace").strip() or "could not read the Git index"
    return [part.decode("utf-8", "surrogateescape") for part in result.stdout.split(b"\0") if part], None


def index_blob(root: Path, path: str) -> Optional[bytes]:
    result = git(root, ["show", ":" + path])
    return result.stdout if result.returncode == 0 else None


def head_blob(root: Path, path: str) -> Optional[bytes]:
    result = git(root, ["show", "HEAD:" + path])
    return result.stdout if result.returncode == 0 else None


def forbidden_output(path: str) -> Optional[str]:
    parts = Path(path).parts
    if parts and parts[0] == ".runtime":
        return "is generated runtime output; change its maintained input instead"
    if parts and parts[0] == "sand-host":
        return "is the immutable release baseline; change maintained source instead"
    if len(parts) >= 2 and parts[:2] == ("dist", "local"):
        return "is generated local build output; change its TypeScript source instead"
    return None


def check_markers(path: str, before: Optional[bytes], after: bytes) -> List[str]:
    if Path(path).suffix not in SOURCE_SUFFIXES:
        return []
    old_markers = MARKER.findall(before or b"")
    new_markers = MARKER.findall(after)
    if old_markers and old_markers != new_markers:
        return ["{} changes recovered-fragment marker identity or order".format(path)]
    if new_markers:
        values = [(int(index), int(count)) for index, count in new_markers]
        count = len(values)
        if any(total != count for _, total in values) or [index for index, _ in values] != list(range(1, count + 1)):
            return ["{} has invalid recovered-fragment boundaries; keep markers in 1/n through n/n order".format(path)]
    return []


def check_staged(root: Path = ROOT) -> List[str]:
    """Return failures while reading file bodies only from the index, never the worktree."""
    paths, error = staged_paths(root)
    if error:
        return [error]

    failures: List[str] = []
    whitespace = git(root, ["diff", "--cached", "--check"])
    if whitespace.returncode:
        detail = whitespace.stderr.decode("utf-8", "replace").strip()
        if whitespace.stdout:
            detail = (detail + "\n" if detail else "") + whitespace.stdout.decode("utf-8", "replace").strip()
        failures.append("staged whitespace check failed" + (":\n" + detail if detail else ""))

    for path in paths:
        reason = forbidden_output(path)
        if reason:
            failures.append("{} {}".format(path, reason))
            continue
        suffix = Path(path).suffix.lower()
        if suffix not in {".json", ".py"} and Path(path).suffix not in SOURCE_SUFFIXES:
            continue
        staged = index_blob(root, path)
        if staged is None:  # A staged deletion has no index blob.
            continue
        before = head_blob(root, path)
        failures.extend(check_markers(path, before, staged))
        if suffix == ".json":
            try:
                json.loads(staged)
            except (UnicodeDecodeError, json.JSONDecodeError) as error:
                failures.append("{} has invalid staged JSON: {}".format(path, error))
        elif suffix == ".py":
            try:
                compile(staged, path, "exec")
            except (SyntaxError, ValueError) as error:
                failures.append("{} has invalid staged Python syntax: {}".format(path, error))
    return failures


def main(argv: Optional[List[str]] = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--root", type=Path, default=ROOT, help=argparse.SUPPRESS)
    arguments = parser.parse_args(argv)
    failures = check_staged(arguments.root.resolve())
    if failures:
        for failure in failures:
            print("FAIL: " + failure, file=sys.stderr)
        print("Fix the staged version, then rerun npm run ci:pre-commit.", file=sys.stderr)
        return 1
    print("PASS: staged whitespace, generated-output, recovered-fragment, JSON, and Python checks.")
    print("Only the Git index was checked; unstaged edits were not included.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

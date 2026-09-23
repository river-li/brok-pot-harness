#!/usr/bin/env python3
"""Install the repository's optional pre-commit hook without replacing hooks."""

import argparse
from pathlib import Path
import os
import subprocess
import sys


ROOT = Path(__file__).resolve().parents[1]


def git(root: Path, *arguments: str) -> subprocess.CompletedProcess:
    return subprocess.run(
        ["git"] + list(arguments),
        cwd=root,
        check=False,
        capture_output=True,
        text=True,
    )


def install(root: Path = ROOT) -> int:
    source = root / "tools/hooks/pre-commit"
    top = git(root, "rev-parse", "--show-toplevel")
    if top.returncode or Path(top.stdout.strip()).resolve() != root.resolve():
        print("Run npm run hooks:install from this repository worktree.", file=sys.stderr)
        return 1

    configured = git(root, "config", "--show-origin", "--get-all", "core.hooksPath")
    if configured.returncode == 0 and configured.stdout.strip():
        print("Refusing to install: core.hooksPath is already configured. No Git setting was changed.", file=sys.stderr)
        return 1
    if configured.returncode not in (0, 1):
        print("Could not inspect core.hooksPath; no Git setting was changed.", file=sys.stderr)
        return 1

    destination_result = git(root, "rev-parse", "--path-format=absolute", "--git-path", "hooks/pre-commit")
    if destination_result.returncode:
        print("Could not locate this repository's hooks directory.", file=sys.stderr)
        return 1
    destination = Path(destination_result.stdout.strip())
    expected = source.read_bytes()
    if destination.exists() or destination.is_symlink():
        try:
            if destination.is_file() and destination.read_bytes() == expected:
                print("PASS: this repository hook is already installed at {}".format(destination))
                return 0
        except OSError:
            pass
        print("Refusing to replace an existing pre-commit hook at {}".format(destination), file=sys.stderr)
        return 1

    try:
        destination.parent.mkdir(parents=True, exist_ok=True)
        descriptor = os.open(str(destination), os.O_WRONLY | os.O_CREAT | os.O_EXCL, 0o755)
        with os.fdopen(descriptor, "wb") as stream:
            stream.write(expected)
        destination.chmod(0o755)
    except FileExistsError:
        print("Refusing to replace a pre-commit hook created during installation.", file=sys.stderr)
        return 1
    except OSError as error:
        print("Could not install the hook: {}".format(error), file=sys.stderr)
        return 1
    print("Installed the optional pre-commit hook at {}".format(destination))
    print("It checks staged content only; bypass remains possible with Git's normal controls.")
    return 0


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--root", type=Path, default=ROOT, help=argparse.SUPPRESS)
    arguments = parser.parse_args()
    raise SystemExit(install(arguments.root.resolve()))

#!/usr/bin/env python3
"""Require scoped maintenance guidance for declared source components."""

import os
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
SOURCE_ROOTS = ("src", "packages", "dune", "reconstruction", "runtime", "tools")
SOURCE_SUFFIXES = {
    ".ts",
    ".tsx",
    ".js",
    ".cjs",
    ".mjs",
    ".py",
    ".sh",
    ".html",
    ".css",
}
PRUNED_DIR_NAMES = {
    "node_modules",
    ".runtime",
    "__pycache__",
    ".pytest_cache",
    ".mypy_cache",
    ".ruff_cache",
    ".cache",
    "coverage",
}


def audit(root: Path):
    """Return README-declared source components and those missing a guide.

    Prune installed dependencies and generated runtime/cache directories in
    os.walk's top-down directory list, before the walker descends into them.
    Do not prune ``dist``: retained emitted JavaScript there is maintained
    source in this repository.
    """
    root = root.resolve()
    components = []
    missing = []
    for root_name in SOURCE_ROOTS:
        source_root = root / root_name
        if not source_root.is_dir():
            continue
        for current, directories, filenames in os.walk(source_root, topdown=True):
            directories[:] = sorted(
                name for name in directories if name not in PRUNED_DIR_NAMES
            )
            if "README.md" not in filenames:
                continue
            if not any(Path(name).suffix in SOURCE_SUFFIXES for name in filenames):
                continue
            directory = Path(current)
            relative = directory.relative_to(root)
            components.append(relative)
            if not (directory / "AGENTS.md").is_file():
                missing.append(relative)
    return components, missing


def main(root: Path = ROOT) -> int:
    components, missing = audit(root)
    if missing:
        print("Maintained source component README(s) without direct AGENTS.md:")
        for directory in missing:
            print(f"  {directory}")
        print(
            "Add component-specific maintenance guidance for each owned "
            "source component."
        )
        return 1

    print(
        f"Scoped guidance coverage OK: {len(components)} README-declared "
        "source components have direct AGENTS.md guidance."
    )
    return 0


if __name__ == "__main__":
    sys.exit(main())

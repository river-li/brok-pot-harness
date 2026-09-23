#!/usr/bin/env python3
"""Require scoped maintenance guidance for declared source components."""

from pathlib import Path
import sys


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


def has_direct_source(directory: Path) -> bool:
    return any(
        path.is_file() and path.suffix in SOURCE_SUFFIXES
        for path in directory.iterdir()
    )


def main() -> int:
    components = []
    missing = []
    for root_name in SOURCE_ROOTS:
        root = ROOT / root_name
        if not root.is_dir():
            continue
        for readme in sorted(root.rglob("README.md")):
            directory = readme.parent
            if not has_direct_source(directory):
                continue
            components.append(directory.relative_to(ROOT))
            if not (directory / "AGENTS.md").is_file():
                missing.append(directory.relative_to(ROOT))

    if missing:
        print("Maintained source component README(s) without direct AGENTS.md:")
        for directory in missing:
            print(f"  {directory}")
        print(
            "Add component-specific maintenance guidance or remove the README "
            "if this is not an owned source boundary."
        )
        return 1

    print(
        f"Scoped guidance coverage OK: {len(components)} README-declared "
        "source components have direct AGENTS.md guidance."
    )
    return 0


if __name__ == "__main__":
    sys.exit(main())

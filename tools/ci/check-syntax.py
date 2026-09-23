#!/usr/bin/env python3
"""Parse maintained runtime JavaScript and freshly built application outputs."""
from pathlib import Path
import subprocess
import sys

ROOT = Path(__file__).resolve().parents[2]
SOURCE_ROOTS = [
    ROOT / "runtime",
    ROOT / "tools",
    ROOT / "dist/local",
    ROOT / ".runtime/build/sand-host",
]
EXTENSIONS = {".cjs", ".js", ".mjs"}
SKIP_DIRS = {"node_modules", "__pycache__"}


def source_files(root: Path):
    if not root.exists():
        return
    for path in sorted(root.rglob("*")):
        if not path.is_file() or path.suffix not in EXTENSIONS:
            continue
        if SKIP_DIRS.intersection(path.parts):
            continue
        yield path


def check(path: Path) -> bool:
    relative = path.relative_to(ROOT)
    print(f"syntax: {relative}", flush=True)
    if path.suffix == ".js" and path.is_relative_to(ROOT / "runtime/renderer-src"):
        result = subprocess.run(
            ["node", "--check", "--input-type=module"],
            input=path.read_bytes(),
            cwd=ROOT,
            check=False,
        )
    else:
        result = subprocess.run(["node", "--check", str(path)], cwd=ROOT, check=False)
    return result.returncode == 0


def main() -> int:
    missing = [root.relative_to(ROOT) for root in SOURCE_ROOTS if not root.exists()]
    if missing:
        print("syntax check inputs are missing: " + ", ".join(map(str, missing)), file=sys.stderr)
        return 1
    files = [path for root in SOURCE_ROOTS for path in source_files(root)]
    if not files:
        print("No JavaScript syntax inputs found", file=sys.stderr)
        return 1
    failures = [path for path in files if not check(path)]
    if failures:
        print("JavaScript syntax failures: " + ", ".join(str(p.relative_to(ROOT)) for p in failures), file=sys.stderr)
        return 1
    print(f"PASS JavaScript syntax: {len(files)} maintained and built files")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

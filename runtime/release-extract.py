#!/usr/bin/env python3
"""Safely extract a GBH server release tarball into a new directory."""

import os
import pathlib
import sys
import tarfile


MAX_MEMBERS = 200_000
MAX_TOTAL_BYTES = 2_000_000_000


def safe_name(name, is_dir=False):
    if not isinstance(name, str) or not name or "\\" in name or name.startswith("/"):
        raise ValueError("release archive contains an unsafe path")
    raw_parts = name.split("/")
    if is_dir and raw_parts[-1] == "":
        raw_parts.pop()
    if not raw_parts or any(part in ("", ".", "..") for part in raw_parts):
        raise ValueError("release archive contains an unsafe path")
    path = pathlib.PurePosixPath(*raw_parts)
    if not path.parts:
        raise ValueError("release archive contains an unsafe path")
    return path


def extract(archive_path, destination):
    destination_path = pathlib.Path(destination)
    if destination_path.is_symlink():
        raise ValueError("release extraction destination cannot be a symlink")
    root = destination_path.resolve()
    if root.exists() and any(root.iterdir()):
        raise ValueError("release extraction destination must be empty")
    root.mkdir(parents=True, exist_ok=True, mode=0o700)
    with tarfile.open(archive_path, "r:gz") as archive:
        members = archive.getmembers()
        if len(members) > MAX_MEMBERS or sum(member.size for member in members if member.isfile()) > MAX_TOTAL_BYTES:
            raise ValueError("release archive exceeds extraction limits")
        seen = set()
        for member in members:
            relative = safe_name(member.name, member.isdir())
            normalized = relative.as_posix().rstrip("/")
            if normalized in seen:
                raise ValueError("release archive contains duplicate paths")
            seen.add(normalized)
            if not (member.isdir() or member.isfile()):
                raise ValueError("release archive contains a link or special file")
            target = root.joinpath(*relative.parts)
            if not target.is_relative_to(root):
                raise ValueError("release archive path escapes its destination")
            if member.isdir():
                target.mkdir(parents=True, exist_ok=True, mode=0o755)
                continue
            target.parent.mkdir(parents=True, exist_ok=True, mode=0o755)
            source = archive.extractfile(member)
            if source is None:
                raise ValueError("release archive contains an unreadable file")
            mode = 0o755 if member.mode & 0o111 else 0o644
            with source, target.open("xb") as output:
                while chunk := source.read(1024 * 1024):
                    output.write(chunk)
            os.chmod(target, mode)


def main(argv):
    if len(argv) != 3:
        raise SystemExit("usage: release-extract.py <archive.tar.gz> <empty destination>")
    try:
        extract(argv[1], argv[2])
    except (OSError, tarfile.TarError, ValueError) as error:
        print(f"Could not extract release archive: {error}", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))

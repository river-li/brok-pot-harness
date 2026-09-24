#!/usr/bin/env python3
"""Assemble a relocatable linux/amd64 self-hosted server release."""

import argparse
import gzip
import hashlib
import json
import os
import platform
import shutil
import subprocess
import sys
import tarfile
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
PROJECT_FILE = ROOT / "release/project.json"
COPY_PATHS = (
    "runtime/server.cjs",
    "runtime/release.cjs",
    "runtime/release-extract.py",
    "runtime/compose.yaml",
    "runtime/box-entrypoint.sh",
    "runtime/search/settings.yml",
    "runtime/speech",
    "runtime/tests/provider-smoke.cjs",
    "release/RESOURCE-NOTICES.md",
    "release/RELEASE-NOTES.md",
    "release/SERVER-INSTALL.md",
    "vendor/local-resource-manifest.json",
    ".runtime/build/sand-host",
    ".runtime/build/deps",
)
REQUIRED_FILES = (
    "runtime/server.cjs",
    "runtime/release.cjs",
    "runtime/release-extract.py",
    "runtime/compose.yaml",
    "runtime/box-entrypoint.sh",
    "runtime/speech/licenses/KOKORO-MODEL-LICENSE",
    "runtime/speech/licenses/KOKORO-ONNX-LICENSE",
    "runtime/tests/provider-smoke.cjs",
    ".runtime/build/sand-host/build-profile.json",
    ".runtime/build/deps/runtime-deps-manifest.json",
    "release/retained-desktop-provenance.json",
    "release/RELEASE-NOTES.md",
)


def run_git(*args):
    result = subprocess.run(["git", *args], cwd=ROOT, text=True, capture_output=True, check=True)
    return result.stdout.strip()


def reject_links(root):
    for directory, names, files in os.walk(root, followlinks=False):
        for name in names + files:
            path = Path(directory) / name
            if path.is_symlink():
                raise RuntimeError(f"release payload cannot contain symlinks: {path.relative_to(root)}")
            if not path.is_dir() and not path.is_file():
                raise RuntimeError(f"release payload contains a special file: {path.relative_to(root)}")


def verify_inputs_are_regular(relative):
    source = ROOT / relative
    if source.is_symlink():
        raise RuntimeError(f"release input cannot be a symlink: {relative}")
    if source.is_dir():
        reject_links(source)
    elif not source.is_file():
        raise RuntimeError(f"release input is missing or not a regular file: {relative}")


def digest_file(path):
    digest = hashlib.sha256()
    with path.open("rb") as stream:
        for chunk in iter(lambda: stream.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def source_revision(source_sha, allow_dirty):
    resolved = run_git("rev-parse", "--verify", f"{source_sha}^{{commit}}")
    head = run_git("rev-parse", "HEAD")
    if resolved != head:
        raise RuntimeError("--source-sha must match the checked-out HEAD exactly")
    changes = run_git("status", "--porcelain=v1", "--untracked-files=all")
    if changes and not allow_dirty:
        raise RuntimeError("refusing to package a dirty source checkout")
    epoch = int(run_git("show", "-s", "--format=%ct", resolved))
    return resolved, epoch, not bool(changes)


def copy_payload(package_root):
    for relative in COPY_PATHS:
        source = ROOT / relative
        verify_inputs_are_regular(relative)
        target = package_root / relative
        target.parent.mkdir(parents=True, exist_ok=True)
        if source.is_dir():
            shutil.copytree(source, target, symlinks=False)
        else:
            shutil.copy2(source, target)

    import_manifest = json.loads((ROOT / "vendor/desktop/import-manifest.json").read_text())
    provenance = {
        "source": "retained desktop bundle imported for local recovery",
        "version": import_manifest["version"],
        "sha256": import_manifest["sha256"],
        "files": import_manifest["files"],
    }
    provenance_path = package_root / "release/retained-desktop-provenance.json"
    provenance_path.write_text(json.dumps(provenance, indent=2) + "\n")

    for relative in REQUIRED_FILES:
        if not (package_root / relative).is_file():
            raise RuntimeError(f"release payload is missing required file {relative}")
    profile = json.loads((package_root / ".runtime/build/sand-host/build-profile.json").read_text())
    if profile.get("profile") != "local":
        raise RuntimeError("release server requires a Host built with the local profile")


def write_installer(package_root, project):
    script = """#!/bin/sh
set -eu
release_dir="$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)"
export GBH_RELEASE_HOME="${GBH_RELEASE_HOME:-${HOME}/.local/opt/gbh}"
export GBH_SERVER_STATE_DIR="${GBH_SERVER_STATE_DIR:-${HOME}/.local/share/gbh}"
node_bin="${NODE:-node}"
node_version="$("$node_bin" --version)"
if [ "$node_version" != "v__NODE_VERSION__" ]; then
  echo "This release requires Node.js v__NODE_VERSION__; found $node_version" >&2
  exit 1
fi
exec "$node_bin" "$release_dir/runtime/release.cjs" install --source "$release_dir"
"""
    script = script.replace("__NODE_VERSION__", project["nodeVersion"])
    path = package_root / "install.sh"
    path.write_text(script)
    path.chmod(0o755)


def build_environment(project):
    node = shutil.which("node")
    npm = shutil.which("npm")
    if not node or not npm:
        raise RuntimeError("Node.js and npm are required to build the server release")
    node_version = subprocess.run([node, "--version"], text=True, capture_output=True, check=True).stdout.strip()
    npm_version = subprocess.run([npm, "--version"], text=True, capture_output=True, check=True).stdout.strip()
    expected_node = f"v{project['nodeVersion']}"
    if node_version != expected_node:
        raise RuntimeError(f"release build requires {expected_node}; found {node_version}")
    if platform.system() != "Linux" or platform.machine().lower() not in {"x86_64", "amd64"}:
        raise RuntimeError("server release packaging must run on a Linux x86_64 build host")
    return {
        "system": platform.system(),
        "release": platform.release(),
        "machine": platform.machine(),
        "python": platform.python_version(),
        "node": node_version,
        "npm": npm_version,
    }


def build_manifest(package_root, project, source_sha, tree_epoch, clean, environment):
    speech_image = f"gbh-server-speech:{project['projectVersion'].lower()}-{source_sha[:12]}"
    compose = package_root / "runtime/compose.yaml"
    compose_text = compose.read_text()
    old = "image: ${GROKBOT_SPEECH_IMAGE:-gbh-local-speech:reconstructed}"
    if compose_text.count(old) != 1:
        raise RuntimeError("Compose speech image declaration changed; update release packaging explicitly")
    compose.write_text(compose_text.replace(old, f"image: {speech_image}"))

    manifest = {
        "schemaVersion": 1,
        "product": "Grokbot Harness Preview",
        "releaseVersion": project["projectVersion"],
        "compatibilityId": "gbh-remote-v1",
        "stateFormat": project["stateFormat"],
        "sourceCommit": source_sha,
        "sourceDateEpoch": tree_epoch,
        "sourceTreeClean": clean,
        "buildProfile": "local",
        "upstreamBaseline": project["upstreamHostBaseline"],
        "retainedDesktopVersion": project["retainedDesktopVersion"],
        "nodeVersion": project["nodeVersion"],
        "serverPlatform": project["serverPlatform"],
        "clientPlatform": project["clientPlatform"],
        "buildEnvironment": {
            **environment,
        },
        "speechImage": speech_image,
        "externalImages": {
            "box": "public.ecr.aws/k0i0n2g5/cursorenvironments/universal@sha256:322c3a9031d61e210a05400dd74c82bbb1fdb42db315a8cf5ab39368c2f0c1c8",
            "search": "docker.io/searxng/searxng@sha256:6869f20676fd91e3f856bcaefc510bc363fdd126f7bd860f49f2ffcb3b305da0",
            "speechBase": "python:3.12-slim-bookworm@sha256:d5ae74acb8026b32a2f6deea45003c5bd4e2880700c19c44bda54670ad3eff90",
        },
        "sourceAvailableAtRuntime": False,
    }
    (package_root / "release-manifest.json").write_text(json.dumps(manifest, indent=2) + "\n")


def write_checksums(package_root):
    files = sorted(path for path in package_root.rglob("*") if path.is_file() and path.name != "SHA256SUMS")
    lines = [f"{digest_file(path)}  {path.relative_to(package_root).as_posix()}" for path in files]
    (package_root / "SHA256SUMS").write_text("\n".join(lines) + "\n")


def create_archive(package_root, archive_path, epoch):
    archive_path.parent.mkdir(parents=True, exist_ok=True)
    with archive_path.open("wb") as raw:
        with gzip.GzipFile(filename="", mode="wb", fileobj=raw, mtime=0, compresslevel=9) as compressed:
            with tarfile.open(fileobj=compressed, mode="w", format=tarfile.PAX_FORMAT) as archive:
                for path in sorted(package_root.rglob("*")):
                    relative = path.relative_to(package_root).as_posix()
                    info = archive.gettarinfo(str(path), arcname=relative)
                    info.uid = 0
                    info.gid = 0
                    info.uname = ""
                    info.gname = ""
                    info.mtime = epoch
                    if path.is_file():
                        with path.open("rb") as source:
                            archive.addfile(info, source)
                    else:
                        archive.addfile(info)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--version", help="project release version; defaults to release/project.json")
    parser.add_argument("--source-sha", help="must equal checked-out HEAD; defaults to HEAD")
    parser.add_argument("--output", type=Path, help="output directory; default is .runtime/release/<version>")
    parser.add_argument("--allow-dirty", action="store_true", help="mark a local artifact non-publishable")
    args = parser.parse_args()

    project = json.loads(PROJECT_FILE.read_text())
    version = args.version or project["projectVersion"]
    if version != project["projectVersion"]:
        raise SystemExit("--version must match release/project.json")
    source_sha, epoch, clean = source_revision(args.source_sha or run_git("rev-parse", "HEAD"), args.allow_dirty)
    if not clean and not args.allow_dirty:
        raise SystemExit("refusing to package a dirty source checkout")

    output_root = args.output or ROOT / ".runtime/release" / version
    package_root = output_root / "gbh-server"
    archive_path = output_root / f"gbh-server-v{version}-linux-amd64.tar.gz"
    environment = build_environment(project)
    if package_root.exists():
        shutil.rmtree(package_root)
    archive_path.unlink(missing_ok=True)
    build_root = ROOT / ".runtime/build"
    shutil.rmtree(build_root, ignore_errors=True)
    subprocess.run(["npm", "run", "build", "--", "--profile", "local"], cwd=ROOT, check=True)
    package_root.mkdir(parents=True)
    copy_payload(package_root)
    write_installer(package_root, project)
    build_manifest(package_root, project, source_sha, epoch, clean, environment)
    reject_links(package_root)
    write_checksums(package_root)
    create_archive(package_root, archive_path, epoch)
    digest = digest_file(archive_path)
    (output_root / f"{archive_path.name}.sha256").write_text(f"{digest}  {archive_path.name}\n")
    print(f"Server release package: {archive_path}")
    print(f"SHA-256: {digest}")
    print(f"Source: {source_sha} (clean={str(clean).lower()})")
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except (OSError, ValueError, RuntimeError, subprocess.CalledProcessError) as error:
        raise SystemExit(str(error))

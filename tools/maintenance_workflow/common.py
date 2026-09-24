"""Shared Git, GitHub, and output-sanitizing helpers for maintenance commands."""

from pathlib import Path
import json
import re
import subprocess
from typing import Iterable, Optional, Sequence, Tuple
from urllib.parse import urlparse


REPOSITORY_PATTERN = re.compile(r"^[A-Za-z0-9_.-]+/[A-Za-z0-9_.-]+$")
SHA_PATTERN = re.compile(r"^(?:[0-9a-f]{40}|[0-9a-f]{64})$", re.IGNORECASE)
SECRET_ASSIGNMENT_PATTERN = re.compile(
    r"(?i)\b(api[_-]?key|token|secret|password)\b\s*[:=]\s*\S+"
)
TOKEN_PATTERN = re.compile(r"\b(?:gh[pousr]_[A-Za-z0-9_]{12,}|github_pat_[A-Za-z0-9_]{12,})\b")
PRIVATE_PATH_PATTERN = re.compile(r"(?<!\w)(?:/Users|/home)/[^\s,;:]+")


class MaintenanceError(Exception):
    """A safe, user-facing workflow error."""


def run_git(arguments: Sequence[str], cwd: Path, allow_failure: bool = False) -> str:
    result = subprocess.run(
        ["git"] + list(arguments),
        cwd=str(cwd),
        check=False,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True,
    )
    if result.returncode and not allow_failure:
        command = arguments[0] if arguments else "command"
        raise MaintenanceError(
            "git {} failed (exit {}). Check the repository state and retry.".format(
                command, result.returncode
            )
        )
    return result.stdout.strip()


def repository_root(start: Path) -> Path:
    root = run_git(["rev-parse", "--show-toplevel"], start)
    if not root:
        raise MaintenanceError("The current directory is not inside a Git repository.")
    return Path(root).resolve()


def run_gh_json(
    arguments: Sequence[str],
    cwd: Path,
    accepted_exit_codes: Iterable[int] = (0,),
) -> object:
    accepted = set(accepted_exit_codes)
    result = subprocess.run(
        ["gh"] + list(arguments),
        cwd=str(cwd),
        check=False,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True,
    )
    if result.returncode not in accepted:
        command = arguments[0] if arguments else "query"
        raise MaintenanceError(
            "gh {} could not read current repository data (exit {}). Check gh authentication, "
            "repository access, and the command prerequisites.".format(command, result.returncode)
        )
    try:
        return json.loads(result.stdout)
    except (TypeError, ValueError):
        raise MaintenanceError("GitHub returned data in an unexpected format; no report was written.")


def origin_repository(root: Path) -> Tuple[str, str]:
    remote_url = run_git(["config", "--get", "remote.origin.url"], root)
    if not remote_url:
        raise MaintenanceError("The repository has no origin remote.")
    if ":" in remote_url and "://" not in remote_url:
        match = re.fullmatch(r"(?:[^@/]+@)?([^:]+):(.+)", remote_url)
        if not match:
            raise MaintenanceError("The origin URL is not a supported GitHub remote.")
        host = match.group(1).lower()
        path = match.group(2)
    else:
        parsed = urlparse(remote_url)
        if parsed.scheme not in {"https", "ssh", "git"} or not parsed.hostname:
            raise MaintenanceError("The origin URL is not a supported GitHub remote.")
        host = parsed.hostname.lower()
        path = parsed.path.lstrip("/")
    if host not in {"github.com"}:
        raise MaintenanceError("This maintenance workflow currently supports github.com origin remotes only.")
    path = path[:-4] if path.endswith(".git") else path
    repository = path.strip("/")
    if not REPOSITORY_PATTERN.fullmatch(repository):
        raise MaintenanceError("The origin URL must identify exactly one GitHub owner/repository.")
    return host, repository


def repository_identity(root: Path) -> Tuple[str, str]:
    host, origin_slug = origin_repository(root)
    metadata = run_gh_json(
        ["api", "--hostname", host, "repos/{}".format(origin_slug)],
        root,
    )
    if not isinstance(metadata, dict):
        raise MaintenanceError("GitHub did not return repository metadata for origin.")
    canonical_slug = metadata.get("full_name")
    default_branch = metadata.get("default_branch")
    html_url = metadata.get("html_url")
    if not isinstance(canonical_slug, str) or not REPOSITORY_PATTERN.fullmatch(canonical_slug):
        raise MaintenanceError("Could not identify the canonical repository for origin.")
    canonical_url = urlparse(str(html_url or ""))
    if canonical_url.scheme != "https" or canonical_url.netloc != host:
        raise MaintenanceError("GitHub repository metadata did not match the origin host.")
    if default_branch != "main":
        raise MaintenanceError("This workflow requires the origin repository default branch to be main.")
    return canonical_slug, host


def repository_argument(repository: str, host: str) -> str:
    return "{}/{}".format(host, repository)


def github_main_sha(repository: str, host: str, root: Path) -> str:
    result = run_gh_json(
        ["api", "--hostname", host, "repos/{}/branches/main".format(repository)],
        root,
    )
    if not isinstance(result, dict):
        raise MaintenanceError("GitHub did not return the current main branch.")
    commit = result.get("commit")
    sha = commit.get("sha") if isinstance(commit, dict) else None
    if not isinstance(sha, str) or not SHA_PATTERN.fullmatch(sha):
        raise MaintenanceError("GitHub did not return a full current main SHA.")
    return sha.lower()


def sanitize_text(value: object) -> str:
    text = " ".join(str(value or "").split())
    text = TOKEN_PATTERN.sub("[redacted token]", text)
    text = SECRET_ASSIGNMENT_PATTERN.sub(lambda match: match.group(1) + "=[redacted]", text)
    text = PRIVATE_PATH_PATTERN.sub("[private path]", text)
    return text


def safe_evidence_url(value: object) -> Optional[str]:
    if not isinstance(value, str):
        return None
    parsed = urlparse(value)
    if parsed.scheme != "https" or parsed.netloc != "github.com":
        return None
    if any(character.isspace() for character in value):
        return None
    return value


def utc_now() -> str:
    from datetime import datetime, timezone

    return datetime.now(timezone.utc).replace(microsecond=0).isoformat()


def common_git_directory(root: Path) -> Path:
    common = run_git(["rev-parse", "--path-format=absolute", "--git-common-dir"], root)
    if not common:
        raise MaintenanceError("Could not find the shared Git directory for task ownership state.")
    return Path(common).resolve()

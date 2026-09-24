"""Remove stale review labels using only authenticated GitHub API requests."""

import json
import os
import re
import subprocess
import sys
from typing import Callable, Dict, List, Mapping, Optional, Sequence
from urllib.parse import quote


REPOSITORY_PATTERN = re.compile(r"^[A-Za-z0-9_.-]+/[A-Za-z0-9_.-]+$")
REVIEW_LABELS = (
    "review:ready-to-merge",
    "review:changes-requested",
    "review:pending",
)


class InvalidationError(Exception):
    """A safe label invalidation failure."""


def gh_api(repository: str, endpoint: str, method: str = "GET", paginate: bool = False) -> object:
    command = ["gh", "api", "--hostname", "github.com"]
    if paginate:
        command.extend(["--paginate", "--slurp"])
    if method != "GET":
        command.extend(["--method", method])
    command.append(endpoint)
    result = subprocess.run(
        command,
        check=False,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True,
    )
    if result.returncode:
        raise InvalidationError("GitHub API label invalidation failed (exit {}).".format(result.returncode))
    if method != "GET":
        return None
    try:
        return json.loads(result.stdout)
    except (TypeError, ValueError):
        raise InvalidationError("GitHub returned an unexpected label invalidation response.")


def flatten_api_pages(value: object) -> List[Mapping[str, object]]:
    if not isinstance(value, list):
        raise InvalidationError("GitHub returned an unexpected paginated PR list.")
    flattened = []
    for page in value:
        if isinstance(page, list):
            if len(page) > 100 or any(not isinstance(item, dict) for item in page):
                raise InvalidationError("GitHub returned an incomplete paginated PR or label list.")
            flattened.extend(page)
        elif isinstance(page, dict):
            flattened.append(page)
        else:
            raise InvalidationError("GitHub returned an incomplete PR page.")
    return flattened


def should_invalidate_event(event_name: str, payload: Mapping[str, object]) -> bool:
    if event_name == "push":
        return payload.get("ref") == "refs/heads/main"
    if event_name != "pull_request_target":
        return False
    action = str(payload.get("action") or "")
    if action == "synchronize":
        return True
    if action == "edited":
        changes = payload.get("changes")
        return isinstance(changes, dict) and isinstance(changes.get("base"), dict)
    return False


def event_pull_request_numbers(
    event_name: str,
    payload: Mapping[str, object],
    repository: str,
    api: Callable[..., object],
) -> List[int]:
    if event_name == "pull_request_target":
        pull_request = payload.get("pull_request")
        number = pull_request.get("number") if isinstance(pull_request, dict) else None
        if not isinstance(number, int) or number < 1:
            raise InvalidationError("GitHub event did not include a valid pull request number.")
        return [number]
    pull_requests = api(
        repository,
        "repos/{}/pulls?state=open&base=main&per_page=100".format(repository),
        paginate=True,
    )
    numbers = []
    for item in flatten_api_pages(pull_requests):
        base = item.get("base")
        number = item.get("number")
        if isinstance(number, int) and isinstance(base, dict) and base.get("ref") == "main":
            numbers.append(number)
    return numbers


def invalidate_stale_labels(
    event_name: str,
    payload: Mapping[str, object],
    repository: str,
    api: Callable[..., object] = gh_api,
) -> Dict[int, List[str]]:
    if not REPOSITORY_PATTERN.fullmatch(repository):
        raise InvalidationError("GITHUB_REPOSITORY is not an owner/repository identifier.")
    if not should_invalidate_event(event_name, payload):
        return {}
    numbers = event_pull_request_numbers(event_name, payload, repository, api)
    changed = {}
    for number in numbers:
        label_pages = api(
            repository,
            "repos/{}/issues/{}/labels?per_page=100".format(repository, number),
            paginate=True,
        )
        labels = flatten_api_pages(label_pages)
        existing = {label.get("name") for label in labels}
        removed = []
        for label in REVIEW_LABELS:
            if label not in existing:
                continue
            encoded_label = quote(label, safe="")
            api(
                repository,
                "repos/{}/issues/{}/labels/{}".format(repository, number, encoded_label),
                method="DELETE",
            )
            removed.append(label)
        if removed:
            changed[number] = removed
    return changed


def main() -> int:
    event_path = os.environ.get("GITHUB_EVENT_PATH", "")
    event_name = os.environ.get("GITHUB_EVENT_NAME", "")
    repository = os.environ.get("GITHUB_REPOSITORY", "")
    if not event_path:
        print("label invalidation: GITHUB_EVENT_PATH is missing", file=sys.stderr)
        return 2
    try:
        with open(event_path, "r", encoding="utf-8") as event_file:
            payload = json.load(event_file)
        if not isinstance(payload, dict):
            raise InvalidationError("GitHub event payload is malformed.")
        changed = invalidate_stale_labels(event_name, payload, repository)
    except (OSError, ValueError, InvalidationError) as error:
        print("label invalidation: {}".format(error), file=sys.stderr)
        return 2
    for number, labels in sorted(changed.items()):
        print("Removed stale review labels from PR #{}: {}".format(number, ", ".join(labels)))
    if not changed:
        print("No stale review labels were present.")
    return 0


if __name__ == "__main__":
    sys.exit(main())

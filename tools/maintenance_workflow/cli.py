"""Command line for task setup, triage, and readiness evidence."""

import argparse
from pathlib import Path
import sys
from typing import Optional, Sequence

from .common import MaintenanceError, repository_root
from .readiness import fetch_pr_readiness
from .tasks import task_list, task_release, task_start
from .triage import fetch_triage_report


def parse_arguments(argv: Optional[Sequence[str]] = None) -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Prepare registered maintenance worktrees and produce read-only GitHub evidence."
    )
    subcommands = parser.add_subparsers(dest="command", required=True)

    task_parser = subcommands.add_parser(
        "task", help="coordinate task ownership and worktree setup"
    )
    task_commands = task_parser.add_subparsers(dest="task_command", required=True)
    start_parser = task_commands.add_parser(
        "start", help="create a bounded linked worktree from current main"
    )
    start_parser.add_argument("--issue", type=int, required=True)
    start_parser.add_argument("--slug", required=True)
    start_parser.add_argument("--owner", required=True, help="implementation agent name")
    start_parser.add_argument(
        "--reviewer", required=True, help="separately designated reviewer agent name"
    )
    start_parser.add_argument(
        "--reviewer-account", required=True, help="trusted GitHub login for review evidence"
    )
    start_parser.add_argument(
        "--path",
        action="append",
        required=True,
        help="owned repository-relative file or directory",
    )
    start_parser.add_argument(
        "--accept", action="append", required=True, help="observable acceptance outcome"
    )
    start_parser.add_argument(
        "--check", action="append", required=True, help="pre-merge check command and evidence"
    )
    start_parser.add_argument(
        "--rollout", action="append", default=[], help="expected post-merge rollout evidence"
    )
    start_parser.add_argument("--depends-on-pr", action="append", type=int, default=[])
    task_commands.add_parser("list", help="show locally registered ownership")
    release_parser = task_commands.add_parser("release", help="release ownership without deleting work")
    release_parser.add_argument("--slug", required=True)
    release_parser.add_argument("--reason", required=True)

    triage_parser = subcommands.add_parser(
        "triage", help="print a bounded, read-only issue and CI report"
    )
    triage_parser.add_argument(
        "--limit", type=int, default=100, help="sample size from 1 through 100 (default 100)"
    )

    pr_parser = subcommands.add_parser(
        "pr", help="report current pull request readiness evidence"
    )
    pr_commands = pr_parser.add_subparsers(dest="pr_command", required=True)
    readiness_parser = pr_commands.add_parser(
        "readiness", help="check live head/base, checks, and review evidence"
    )
    readiness_parser.add_argument("number", type=int)
    readiness_parser.add_argument(
        "--reviewer-account",
        help="trusted GitHub reviewer login when no matching task policy is registered",
    )
    return parser.parse_args(argv)


def main(argv: Optional[Sequence[str]] = None) -> int:
    args = parse_arguments(argv)
    start = Path.cwd()
    try:
        if args.command == "task":
            if args.task_command == "start":
                print(task_start(args, start))
            elif args.task_command == "list":
                print(task_list(start), end="")
            else:
                print(task_release(args, start))
            return 0
        if args.command == "triage":
            print(fetch_triage_report(start, args.limit), end="")
            return 0
        if args.command == "pr" and args.pr_command == "readiness":
            print(fetch_pr_readiness(start, args.number, args.reviewer_account), end="")
            return 0
    except MaintenanceError as error:
        print("maintenance: {}".format(error), file=sys.stderr)
        return 2
    return 2

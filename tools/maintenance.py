#!/usr/bin/env python3
"""Entry point for the repository maintenance CLI."""

import sys

from maintenance_workflow.cli import main


if __name__ == "__main__":
    sys.exit(main())

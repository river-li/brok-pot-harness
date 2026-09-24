#!/usr/bin/env python3
"""Build and install the portable Brokpot app in the current user's Applications."""
import argparse
import shutil
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--destination', type=Path, default=Path.home() / 'Applications',
                        help='Applications directory (default: ~/Applications)')
    args = parser.parse_args()
    if sys.platform != 'darwin':
        raise SystemExit('install:mac requires macOS.')
    for command in (
        ['npm', 'run', 'build', '--', '--profile', 'local'],
        ['npm', 'run', 'prepare:desktop', '--', '--profile', 'local'],
        ['python3', 'runtime/tools/package-macos.py', '--unified'],
    ):
        subprocess.run(command, cwd=ROOT, check=True)
    source = ROOT / '.runtime/packages/Brokpot.app'
    destination = args.destination.expanduser().resolve() / 'Brokpot.app'
    destination.parent.mkdir(parents=True, exist_ok=True)
    if destination.exists():
        shutil.rmtree(destination)
    subprocess.run(['ditto', str(source), str(destination)], check=True)
    print(f'Installed Brokpot at {destination}')
    print('Open the app and choose Run locally or Connect to a Brokpot server.')


if __name__ == '__main__':
    main()

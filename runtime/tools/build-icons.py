#!/usr/bin/env python3
"""Convert the selected rounded artwork to macOS icon formats without redrawing it."""
from pathlib import Path
import subprocess
import tempfile
ROOT = Path(__file__).resolve().parents[2]
source = ROOT / 'assets/branding/icon-rounded.png'
target = ROOT / 'assets/branding'
with tempfile.TemporaryDirectory() as temp:
    iconset = Path(temp) / 'AppIcon.iconset'
    iconset.mkdir()
    for size in [16, 32, 128, 256, 512]:
        for scale in [1, 2]:
            name = f'icon_{size}x{size}' + ('@2x' if scale == 2 else '') + '.png'
            subprocess.run(['sips', '-z', str(size*scale), str(size*scale), str(source), '--out', str(iconset/name)], check=True, stdout=subprocess.DEVNULL)
    subprocess.run(['iconutil', '-c', 'icns', str(iconset), '-o', str(target/'AppIcon.icns')], check=True)
    subprocess.run(['sips', '-z', '512', '512', str(source), '--out', str(target/'icon.png')], check=True, stdout=subprocess.DEVNULL)
print('Generated AppIcon.icns and icon.png from the rounded artwork.')

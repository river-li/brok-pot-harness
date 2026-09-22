#!/usr/bin/env python3
"""Package the staged local desktop with project branding; no credentials bundled."""
import json
import plistlib
import shutil
import subprocess
import sys
from pathlib import Path
ROOT = Path(__file__).resolve().parents[2]
if sys.platform != 'darwin':
    raise SystemExit('This packager currently supports macOS only.')
staged = ROOT / '.runtime/desktop'
config = json.loads((staged / 'dist/electron-main/build-profile.json').read_text())
if config['profile'] != 'local':
    raise SystemExit('Prepare the local desktop first.')
electron = Path(subprocess.check_output(['node', '-p', "require('./runtime/node_modules/electron')"], cwd=ROOT, text=True).strip())
source = electron.parents[2]
output = ROOT / '.runtime/packages/Grokbot Harness.app'
if output.exists():
    shutil.rmtree(output)
output.parent.mkdir(parents=True, exist_ok=True)
subprocess.run(['ditto', str(source), str(output)], check=True)
resources = output / 'Contents/Resources'
app = resources / 'app'
shutil.copytree(staged, app, ignore=shutil.ignore_patterns('AGENTS.md', 'README.md', 'import-manifest.json'))
(resources / 'default_app.asar').unlink(missing_ok=True)
shutil.copy2(ROOT / 'assets/branding/AppIcon.icns', resources / 'AppIcon.icns')
metadata = output / 'Contents/Info.plist'
with metadata.open('rb') as f:
    info = plistlib.load(f)
info.update(CFBundleName='Grokbot Harness', CFBundleDisplayName='Grokbot Harness',
            CFBundleIdentifier='local.gbh.desktop', CFBundleIconFile='AppIcon.icns')
with metadata.open('wb') as f:
    plistlib.dump(info, f)
package = json.loads((app/'package.json').read_text())
package['main'] = 'packaged-main.cjs'
package['productName'] = 'Grokbot Harness'
(app/'package.json').write_text(json.dumps(package, indent=2)+'\n')
# A same-machine convenience default, not a secret or a dependency on source code.
(app/'local-launch.json').write_text(json.dumps({'projectRoot':str(ROOT)}, indent=2)+'\n')
shutil.copy2(ROOT/'runtime/packaged-main.cjs', app/'packaged-main.cjs')
subprocess.run(['codesign','--force','--deep','--sign','-',str(output)], check=True, capture_output=True)
print(f'Packaged local, ad-hoc signed desktop: {output}')
print('Host runs separately. Configure GROKBOT_PROJECT_ROOT when using another checkout.')

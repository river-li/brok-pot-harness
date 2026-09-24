"""Build-time selection; original service implementations remain in the bundles."""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]


def configuration(profile=None):
    source = json.loads((ROOT / 'runtime/build-profiles.json').read_text())
    if source.get('version') != 1:
        raise ValueError('Unsupported build profiles version')
    name = profile or source['defaultProfile']
    if name not in ('local', 'original') or name not in source['profiles']:
        raise ValueError(f'Unknown build profile: {name}')
    local = source['profiles'][name].get('localWorkspace')
    if not isinstance(local, bool) or local != (name == 'local'):
        raise ValueError('local and original profiles must select their corresponding workspace mode')
    return {'version': 1, 'profile': name, 'features': {
        'localWorkspace': local,
        'vendorLogin': not local,
        'billing': not local,
        'cloudProvisioning': not local,
        'remoteSync': not local,
    }}


def write_bootstrap(directory, config):
    directory.mkdir(parents=True, exist_ok=True)
    literal = json.dumps(config, separators=(',', ':'))
    (directory / 'build-profile.json').write_text(json.dumps(config, indent=2) + '\n')
    (directory / 'build-profile.cjs').write_text(
        '// Generated from runtime/build-profiles.json. Rebuild to change mode.\n'
        f'const config = {literal};\n'
        'Object.freeze(config.features);\nObject.freeze(config);\n'
        'process.env.GROKBOT_LOCAL_MODE = config.features.localWorkspace ? "1" : "0";\n'
        'if (config.features.localWorkspace) {\n'
        '  const localBackend = "http://127.0.0.1:9";\n'
        '  process.env.SAND_BACKEND_URL = localBackend;\n'
        '  process.env.CURSOR_API_BASE_URL = localBackend;\n'
        '  process.env.SAND_HOST_GATEWAY_URL ||= "http://127.0.0.1:1540";\n'
        '  process.env.SAND_DEV_BOX_CONTROL_PLANE = "0";\n'
        '  process.env.SAND_ATTACH_PROD_BOX = "0";\n'
        '  process.env.SAND_DEV_CONTROL_PORT = "0";\n'
        '  process.env.SAND_DISABLE_TELEMETRY = "1";\n'
        '  process.env.SAND_DISABLE_ANALYTICS = "1";\n'
        '}\n'
        'module.exports = config;\n')


def bootstrap_bundle(source):
    # Keep the strict directive effective for entrypoints which use it.
    prefix = b'require("./build-profile.cjs");\n'
    if source.startswith(b'"use strict";'):
        position = len(b'"use strict";')
        return source[:position] + b'\n' + prefix + source[position:]
    return prefix + source

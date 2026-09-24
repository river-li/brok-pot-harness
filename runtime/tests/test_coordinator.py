"""Exercise the staged coordinator's local RPC schema without starting Electron."""
import importlib.util
import json
from pathlib import Path
import re
import shutil
import subprocess
import tempfile
import unittest


ROOT = Path(__file__).resolve().parents[2]
VENDOR = ROOT / 'vendor/desktop/dist/node-agent-coordinator/main.cjs'
spec = importlib.util.spec_from_file_location(
    'patch_local_coordinator', ROOT / 'runtime/tools/patch_local_coordinator.py'
)
patcher = importlib.util.module_from_spec(spec)
spec.loader.exec_module(patcher)


class CoordinatorMarketplaceTests(unittest.TestCase):
    def test_local_replies_cross_retained_validation_and_invalid_values_fail(self):
        original = VENDOR.read_bytes()
        with tempfile.TemporaryDirectory() as directory:
            staged = Path(directory) / 'coordinator.cjs'
            shutil.copy2(VENDOR, staged)
            patcher.patch_local_coordinator(staged)
            source = staged.read_text()
            subprocess.run(['node', '--check', str(staged)], check=True,
                           capture_output=True, text=True)

            # Execute the retained pure validator, not a replacement validator.
            # These anchors are pinned by the patcher's source hash. The rest of
            # the coordinator is deliberately not loaded: it starts app services.
            validator = source[source.index('function Wb('):source.index('var qA=')]
            reply_validator = re.search(
                r'function JA\(.*?\}r\(JA,"gatewayReplySchemaError"\);', source
            ).group(0)
            compressed = re.search(r'var qA="([^"]+)"', source).group(1)
            methods = [
                'previewLocalBotRecipe', 'importLocalBotRecipe',
                'updateLocalBotRecipe', 'removeLocalBotRecipe',
                'refreshLocalMarketplacePlugin',
            ]
            for method in methods:
                self.assertIn(method + ':_().args(', source,
                              'RPC argument dispatch must expose ' + method)
                self.assertIn(method + ':{args:"object",reply:"record"}', source,
                              'Reply whitelist must expose ' + method)

            probe = Path(directory) / 'probe.cjs'
            probe.write_text('''
const assert = require('node:assert/strict');
const { inflateRawSync } = require('node:zlib');
const r = () => {}; // Retained function-name annotations have no validation role.
''' + validator + reply_validator + '\nconst schema = JSON.parse(inflateRawSync(Buffer.from('
                + json.dumps(compressed) + ', "base64")));\n' + '''
const recipe = {
  shareId: 'private-recipe', shareUrl: null, name: 'Example pot',
  avatarShape: 'circle', avatarColor: 'teal', body: 'Read the project.',
  localRecipe: true, editable: true, published: false,
  skills: [{ name: 'Review', description: 'Read first', content: 'Inspect files.' }],
};
const cases = [
  ['listBotTemplates', [recipe]],
  ['previewLocalBotRecipe', {
    name: 'Example pot', description: 'Read the project.',
    dependencies: [], plugins: [], routines: [], skills: [],
  }],
  ['importLocalBotRecipe', recipe],
  ['updateLocalBotRecipe', recipe],
  ['removeLocalBotRecipe', { removed: true }],
  ['refreshLocalMarketplacePlugin', { pluginId: 'example', refreshed: true }],
];
for (const [method, reply] of cases) {
  assert.equal(JA(schema, method, reply), null, method);
  assert.notEqual(JA(schema, method, 'invalid reply'), null, method);
}
assert.notEqual(JA(schema, 'importLocalBotRecipe', { ...recipe, shareUrl: 42 }), null);
assert.notEqual(JA(schema, 'removeLocalBotRecipe', {}), null);
for (const method of ['previewLocalBotRecipe', 'importLocalBotRecipe']) {
  assert.equal(gt(schema.methods[method].args, { recipeJson: '{}' }, schema), null);
  assert.notEqual(gt(schema.methods[method].args, { recipeJson: 42 }, schema), null);
}
assert.equal(gt(schema.methods.updateLocalBotRecipe.args,
  { shareId: 'private-recipe', recipeJson: '{}' }, schema), null);
assert.notEqual(gt(schema.methods.updateLocalBotRecipe.args,
  { recipeJson: '{}' }, schema), null);
''')
            subprocess.run(['node', str(probe)], check=True,
                           capture_output=True, text=True)
        self.assertEqual(VENDOR.read_bytes(), original,
                         'Local preparation must not mutate the vendor baseline')

    def test_source_drift_is_rejected_before_any_write(self):
        with tempfile.TemporaryDirectory() as directory:
            staged = Path(directory) / 'coordinator.cjs'
            changed = VENDOR.read_bytes() + b'\n// simulated upstream revision\n'
            staged.write_bytes(changed)
            with self.assertRaisesRegex(ValueError, 'requires review'):
                patcher.patch_local_coordinator(staged)
            self.assertEqual(staged.read_bytes(), changed)


if __name__ == '__main__':
    unittest.main()

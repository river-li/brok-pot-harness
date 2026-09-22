const assert = require('node:assert/strict');
const { createRequire } = require('node:module');
const { join } = require('node:path');
const root = process.env.GROKBOT_ROOT || '/home/box';
// Match the release Host's native dependency bootstrap in this standalone test.
process.env.NODE_PATH = join(root, 'deps');
require('node:module').Module._initPaths();
const requireHost = createRequire(join(root, 'sand-host/host-main.cjs'));
const { Piscina } = requireHost('piscina');

(async () => {
  for (const [file, verify] of [
    ['diff-worker.js', r => { assert.equal(r.linesAdded, 1); assert.equal(r.linesRemoved, 1); }],
    ['diff-patch-worker.js', r => assert.match(r.patch, /-old\n\+new/)],
    ['unified-diff-worker.js', r => assert.match(r.unifiedDiff, /-old\n\+new/)],
  ]) {
    const pool = new Piscina({ filename: join(root, 'sand-host', file), minThreads: 1, maxThreads: 1 });
    try {
      verify(await pool.run({ filePath: 'sample.txt', original: 'old\n', new: 'new\n' }));
      console.log(`PASS ${file} through Piscina`);
    } finally { await pool.destroy(); }
  }
  const Parser = require(join(root, 'deps/tree-sitter'));
  const Bash = require(join(root, 'deps/tree-sitter-bash'));
  const parser = new Parser(); parser.setLanguage(Bash);
  assert.equal(parser.parse('printf hello').rootNode.type, 'program');
  console.log('PASS tree-sitter + Bash grammar');
  const chunker = require(join(root, 'deps/@anysphere/tree-chunk-napi'));
  assert.ok(Object.keys(chunker).length > 0);
  console.log('PASS native tree chunker loads');
})().catch(error => { console.error(error); process.exitCode = 1; });

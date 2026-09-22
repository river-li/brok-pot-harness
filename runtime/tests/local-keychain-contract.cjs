const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const policy = require('../desktop-src/local-keychain.cjs');
test('local default never calls OS storage; opt-in and original retain it', async () => {
  const before = {...process.env};
  try {
    process.env.GROKBOT_LOCAL_MODE='1';delete process.env.GROKBOT_LOCAL_KEYCHAIN;
    const forbidden={isEncryptedStorageAvailable(){throw Error('Keychain touched')},waitForEncryptedStorage(){throw Error('Keychain touched')}};
    assert.equal(policy.available(forbidden),false);
    assert.equal(await policy.wait(forbidden),false);
    process.env.GROKBOT_LOCAL_KEYCHAIN='1';
    assert.equal(policy.available({isEncryptedStorageAvailable:()=>true}),true);
    process.env.GROKBOT_LOCAL_MODE='0';delete process.env.GROKBOT_LOCAL_KEYCHAIN;
    assert.equal(await policy.wait({waitForEncryptedStorage:async()=>true}),true);
  } finally {
    for(const key of ['GROKBOT_LOCAL_MODE','GROKBOT_LOCAL_KEYCHAIN']) {
      if(before[key]===undefined)delete process.env[key];else process.env[key]=before[key];
    }
  }
});
test('local non-secret machine identity persists with restricted permissions', async () => {
  const dir=fs.mkdtempSync(path.join(os.tmpdir(),'gbh-identity-'));
  try {
    const id=await policy.machineId(dir);
    assert.equal(await policy.machineId(dir),id);
    assert.equal(fs.statSync(path.join(dir,'local-machine-id')).mode & 0o777,0o600);
    fs.writeFileSync(path.join(dir,'local-machine-id'),'invalid');
    await assert.rejects(async()=>policy.machineId(dir),/Invalid local-machine-id/);
  } finally {fs.rmSync(dir,{recursive:true,force:true})}
});

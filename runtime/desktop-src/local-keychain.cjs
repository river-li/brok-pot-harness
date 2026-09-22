/* Local startup must not initialize inherited account/Keychain storage. */
const fs = require('node:fs');
const path = require('node:path');
const {randomUUID} = require('node:crypto');
function isAllowed(env = process.env) {
  return env.GROKBOT_LOCAL_MODE !== '1' || env.GROKBOT_LOCAL_KEYCHAIN === '1';
}
function available(core) {
  return isAllowed() && core.isEncryptedStorageAvailable();
}
function wait(core, ...args) {
  return isAllowed() ? core.waitForEncryptedStorage(...args) : Promise.resolve(false);
}
function machineId(userData) {
  fs.mkdirSync(userData, {recursive:true});
  const file = path.join(userData, 'local-machine-id');
  try { fs.writeFileSync(file, randomUUID()+'\n', {flag:'wx',mode:0o600}); }
  catch (error) { if (error.code !== 'EEXIST') throw error; }
  const value = fs.readFileSync(file,'utf8').trim();
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)) {
    throw new Error('Invalid local-machine-id; preserve the file and inspect it before resetting this desktop identity.');
  }
  return Promise.resolve(value);
}
module.exports = {isAllowed, available, wait, machineId};

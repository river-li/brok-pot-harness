const { spawn } = require('node:child_process');
const { join } = require('node:path');
const fs = require('node:fs');
const root = join(__dirname, '..');
const launchArgs = process.argv.slice(2);
const remoteIndex = launchArgs.indexOf('--remote');
const remoteClient = remoteIndex !== -1;
if (remoteClient) launchArgs.splice(remoteIndex, 1);
const reconfigureIndex = launchArgs.indexOf('--reconfigure');
const reconfigure = reconfigureIndex !== -1;
if (reconfigure) launchArgs.splice(reconfigureIndex, 1);
const profileIndex = launchArgs.indexOf('--profile');
const buildProfile = profileIndex === -1 ? 'local' : launchArgs.splice(profileIndex, 2)[1];
if (!['local','original'].includes(buildProfile)) throw Error('Unknown desktop build profile. Use local or original.');
const isLocal = buildProfile === 'local';
if (remoteClient && !isLocal) throw Error('The remote client requires a local-profile desktop build.');
if (!remoteClient) require('./config.cjs')(root);
const electron = require('electron');
const desktop = join(root, isLocal ? '.runtime/desktop' : '.runtime/desktop-original');
const built = JSON.parse(fs.readFileSync(join(desktop, 'dist/electron-main/build-profile.json'),'utf8'));
if (built.profile !== buildProfile) throw Error('Desktop build profile mismatch. Run npm run prepare:desktop with the intended --profile.');
if (remoteClient) {
  const env = { ...process.env, GROKBOT_LOCAL_MODE: '1', GBH_REMOTE_RECONFIGURE: reconfigure ? '1' : '0' };
  delete env.ELECTRON_RUN_AS_NODE;
  for (const name of Object.keys(env)) {
    if (/(?:API_KEY|TOKEN|SECRET|PASSWORD)$/i.test(name)) delete env[name];
  }
  const child = spawn(electron, [join(desktop, 'remote-client-main.cjs'), ...launchArgs], { env, stdio: 'inherit' });
  child.on('error', error => {console.error(error.message); process.exitCode = 1;});
  child.on('exit', code => {process.exitCode = code ?? 1;});
  for (const signal of ['SIGINT','SIGTERM']) process.on(signal, () => child.kill(signal));
} else {
const profile = join(root, isLocal ? '.runtime/profiles/desktop' : '.runtime/profiles/desktop-original');
fs.mkdirSync(profile, { recursive: true });
const env = { ...process.env, ...(isLocal ? {
  GROKBOT_LOCAL_MODE: '1',
  GROKBOT_LOCAL_VOICE: process.env.GROKBOT_LOCAL_VOICE ?? '1',
  SAND_BACKEND_URL: 'http://127.0.0.1:9',
  SAND_USER_DATA_DIR: profile,
  SAND_HOST_GATEWAY_URL: process.env.SAND_HOST_GATEWAY_URL || 'http://127.0.0.1:1540',
  SAND_DEV_BOX_CONTROL_PLANE: '0', SAND_ATTACH_PROD_BOX: '0',
  SAND_DISABLE_TELEMETRY: '1', SAND_DISABLE_ANALYTICS: '1',
} : {GROKBOT_LOCAL_MODE: '0'}), SAND_USER_DATA_DIR: profile };
const tokenFile = join(root, '.runtime/gateway-token');
if (isLocal && !env.SAND_HOST_GATEWAY_TOKEN && fs.existsSync(tokenFile)) env.SAND_HOST_GATEWAY_TOKEN = fs.readFileSync(tokenFile, 'utf8').trim();
delete env.ELECTRON_RUN_AS_NODE;
delete env.LITELLM_API_KEY;
const args = [desktop, `--user-data-dir=${profile}`, ...launchArgs];
const child = spawn(electron, args, { env, stdio: 'inherit' });
child.on('error', error => {console.error(error.message); process.exitCode = 1;});
child.on('exit', code => {process.exitCode = code ?? 1;});
for (const signal of ['SIGINT','SIGTERM']) process.on(signal, () => child.kill(signal));
}

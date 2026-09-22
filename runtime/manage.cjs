const { spawnSync } = require('node:child_process');
const { randomBytes } = require('node:crypto');
const { join, resolve } = require('node:path');
const fs = require('node:fs');
const root = join(__dirname, '..');
const command = process.argv[2] || 'start';
const state = join(root, '.runtime');
fs.mkdirSync(state, {recursive: true});
require('./config.cjs')(root);
const tokenFile = join(state, 'gateway-token');
if (!fs.existsSync(tokenFile)) fs.writeFileSync(tokenFile, randomBytes(32).toString('hex'), {mode: 0o600, flag: 'wx'});
const env = {...process.env, GROKBOT_GATEWAY_TOKEN: fs.readFileSync(tokenFile, 'utf8').trim()};
const searchSecretFile = join(state, 'search-secret');
if (!fs.existsSync(searchSecretFile)) fs.writeFileSync(searchSecretFile, randomBytes(32).toString('hex'), {mode: 0o600, flag: 'wx'});
env.GROKBOT_SEARCH_SECRET = fs.readFileSync(searchSecretFile, 'utf8').trim();
const base = new URL(env.GROKBOT_RESPONSES_BASE_URL || 'http://litellm.home/v1');
if (base.hostname === '127.0.0.1' || base.hostname === 'localhost') base.hostname = 'host.docker.internal';
env.GROKBOT_CONTAINER_API_URL ||= base.toString().replace(/\/$/, '');
for (const name of ['data','workspace','models/whisper','models/kokoro']) fs.mkdirSync(join(state,name), {recursive:true});
const actions = {start:['up','-d','--build'],stop:['stop'],status:['ps'],logs:['logs','--tail','80'],restart:['restart']};
if (!actions[command]) throw Error(`Unknown command ${command}`);
if (command === 'start' && !fs.existsSync(join(state,'build/sand-host/host-main.cjs'))) throw Error('Run npm run build first.');
if (['start','restart'].includes(command)) {
  const config = JSON.parse(fs.readFileSync(join(state,'build/sand-host/build-profile.json'),'utf8'));
  if (config.profile !== 'local') throw Error('The local Compose launcher requires a local build. Run npm run build -- --profile local.');
}
const composeArgs = ['compose','-f',join(__dirname,'compose.yaml')];
if (env.GROKBOT_COMPOSE_OVERRIDE) {
  const override = resolve(root, env.GROKBOT_COMPOSE_OVERRIDE);
  if (!fs.existsSync(override)) throw Error(`Compose override does not exist: ${override}`);
  composeArgs.push('-f', override);
}
const result = spawnSync('docker', [...composeArgs,...actions[command]], {cwd:root,env,stdio:'inherit'});
if (result.error) console.error(result.error.message);
process.exitCode = result.status ?? 1;

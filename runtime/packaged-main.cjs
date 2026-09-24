"use strict";

const fs = require('node:fs');
const path = require('node:path');
const {app} = require('electron');
const defaults = require('./local-launch.json');
const root = process.env.GROKBOT_PROJECT_ROOT || defaults.projectRoot;
process.env.GROKBOT_LOCAL_MODE = '1';
process.env.GROKBOT_LOCAL_VOICE ??= '1';
process.env.GROKBOT_LOCAL_KEYCHAIN ??= '0';
process.env.SAND_BACKEND_URL = 'http://127.0.0.1:9';
process.env.SAND_HOST_GATEWAY_URL ||= 'http://127.0.0.1:1540';
process.env.SAND_USER_DATA_DIR ||= path.join(app.getPath('appData'), 'Grokbot Harness');
process.env.SAND_DISABLE_TELEMETRY = '1';
process.env.SAND_DISABLE_ANALYTICS = '1';
process.env.SAND_DEV_BOX_CONTROL_PLANE = '0';
process.env.SAND_DEV_CONTROL_PORT ||= '0';
process.env.SAND_ATTACH_PROD_BOX = '0';
const tokenPath = path.join(root, '.runtime/gateway-token');
if (!process.env.SAND_HOST_GATEWAY_TOKEN && fs.existsSync(tokenPath)) {
  process.env.SAND_HOST_GATEWAY_TOKEN = fs.readFileSync(tokenPath, 'utf8').trim();
}
delete process.env.LITELLM_API_KEY;
require('./dist/electron-main/main.cjs');

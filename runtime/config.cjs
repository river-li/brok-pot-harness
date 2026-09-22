const fs = require('node:fs');
const { join } = require('node:path');
const { parseEnv } = require('node:util');
// Project configuration wins over stale inherited values. Never log credentials.
module.exports = function loadLocalConfig(root = join(__dirname, '..')) {
  const file = join(root, '.env');
  if (!fs.existsSync(file)) return;
  for (const [key, value] of Object.entries(parseEnv(fs.readFileSync(file, 'utf8')))) {
    if ((key.startsWith('GROKBOT_') || key === 'LITELLM_API_KEY') && value !== '') process.env[key] = value;
  }
};

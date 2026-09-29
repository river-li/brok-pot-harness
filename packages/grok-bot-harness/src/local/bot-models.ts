/** Host-owned model overrides. A session snapshots its model; no shared env mutation. */
import { existsSync, readFileSync, mkdirSync, renameSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { randomUUID } from 'node:crypto';

function root() {
  const value = process.env.SAND_DATA_ROOT;
  if (!value) throw new Error('Host data directory unavailable');
  return value;
}
function file(id: string) {
  if (!/^[a-zA-Z0-9_-]{1,128}$/.test(id)) throw new Error('Invalid Bot ID');
  return join(root(), 'bot-models', id + '.json');
}
export function botModel(id?: string) {
  let model: string | null = null;
  if (id && existsSync(file(id))) {
    const saved = JSON.parse(readFileSync(file(id), 'utf8'));
    if (typeof saved.modelId !== 'string' || !saved.modelId.trim()) throw new Error('Invalid saved Bot model');
    model = saved.modelId;
  }
  const defaultModel = process.env.GROKBOT_MODEL || 'gpt-5.6-sol';
  return { modelId: model, defaultModel, effectiveModel: model ?? defaultModel };
}
export async function modelCatalog() {
  const base = (process.env.GROKBOT_RESPONSES_BASE_URL || 'http://litellm.home/v1').replace(/\/$/, '');
  const response = await fetch(base + '/models', {
    headers: { Authorization: 'Bearer ' + (process.env.LITELLM_API_KEY || '') },
    redirect: 'error', signal: AbortSignal.timeout(15000),
  });
  if (!response.ok) throw new Error('Model catalog unavailable (' + response.status + ')');
  const data = await response.json() as { data?: Array<{ id?: unknown }> };
  if (!Array.isArray(data.data) || data.data.length > 10000) throw new Error('Invalid model catalog');
  const models = [...new Set(data.data.map(row => row.id).filter((id): id is string => typeof id === 'string' && id.length > 0 && id.length <= 200))];
  return { models, defaultModel: botModel().defaultModel };
}
export async function setBotModel(id: string, modelId: string | null) {
  const destination = file(id);
  if (modelId !== null && !(await modelCatalog()).models.includes(modelId)) throw new Error('Model is not available on this Host');
  mkdirSync(join(root(), 'bot-models'), { recursive: true, mode: 0o700 });
  // Null is represented by removing the override, not pinning today's default.
  const { unlinkSync } = await import('node:fs');
  if (modelId === null) { if (existsSync(destination)) unlinkSync(destination); }
  else {
    const temporary = destination + '.' + randomUUID();
    writeFileSync(temporary, JSON.stringify({ modelId }), { mode: 0o600 });
    renameSync(temporary, destination);
  }
  return botModel(id);
}

/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/grok-bot/dist/mark-deal.js
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var GROK_BOT_MARK_SHAPES = [
  "blob",
  "pebble",
  "bean",
  "egg",
  "squircle",
  "tablet",
  "capsule",
  "cylinder",
  "hex",
  "gem",
  "crystal",
  "wedge",
  "shield",
  "dome",
  "arch",
  "cloud",
  "teardrop",
  "leaf"
];
var GROK_BOT_MARK_DEALT_SHAPES = [
  "blob",
  "pebble",
  "squircle",
  "tablet",
  "wedge",
  "hex",
  "cloud",
  "teardrop"
];
var GROK_BOT_MARK_COLORS = GROK_BOT_COLORS.map(({ id }) => id);
var GROK_BOT_MARK_DEALT_HUES = GROK_BOT_HUES.map(({ id }) => id);
var PRODUCT_SEED = 1;
var HUE_STREAM_SEED = 1;
function hashMarkKey(key) {
  let hash = 2166136261;
  for (let index = 0; index < key.length; index++) {
    hash ^= key.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}
function grokBotMarkSeed(key) {
  return (hashMarkKey(key) ^ Math.imul(PRODUCT_SEED, 2654435769)) >>> 0;
}
function grokBotMarkRandom(seed) {
  let state = seed >>> 0;
  return () => {
    state = state + 1831565813 | 0;
    let value = Math.imul(state ^ state >>> 15, 1 | state);
    value = value + Math.imul(value ^ value >>> 7, 61 | value) ^ value;
    return ((value ^ value >>> 14) >>> 0) / 4294967296;
  };
}
function grokBotMarkHueIndex(seed) {
  const random2 = grokBotMarkRandom((seed ^ Math.imul(HUE_STREAM_SEED, 2654435769)) >>> 0);
  return Math.floor(random2() * GROK_BOT_MARK_DEALT_HUES.length);
}
function grokBotMarkHueIndexForKey(key) {
  return grokBotMarkHueIndex(grokBotMarkSeed(key));
}
function grokBotMarkColorForKey(key) {
  return GROK_BOT_MARK_DEALT_HUES[grokBotMarkHueIndexForKey(key)] ?? "black";
}
function shapeSeed(key) {
  let hash = hashMarkKey(key) | 0;
  hash = Math.imul(hash ^ hash >>> 16, 73244475);
  hash = Math.imul(hash ^ hash >>> 13, 3266489909);
  return (hash ^ hash >>> 16) >>> 0;
}
function grokBotMarkShapeForKey(key) {
  return GROK_BOT_MARK_DEALT_SHAPES[shapeSeed(key) % GROK_BOT_MARK_DEALT_SHAPES.length] ?? "blob";
}
function knownShape(value) {
  return value == null ? void 0 : GROK_BOT_MARK_SHAPES.find((shape) => shape === value);
}
function knownColor(value) {
  return value == null ? void 0 : GROK_BOT_MARK_COLORS.find((color) => color === value);
}
function resolveGrokBotMark(input) {
  return {
    shape: knownShape(input.avatarShape) ?? grokBotMarkShapeForKey(input.agentId),
    color: knownColor(input.avatarColor) ?? grokBotMarkColorForKey(input.agentId)
  };
}


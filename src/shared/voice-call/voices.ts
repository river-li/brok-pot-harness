/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/shared/voice-call/voices.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var SAND_VOICES = [
  { id: "altair", label: "Altair" },
  { id: "ara", label: "Ara" },
  { id: "atlas", label: "Atlas" },
  { id: "aurora", label: "Aurora" },
  { id: "carina", label: "Carina" },
  { id: "castor", label: "Castor" },
  { id: "celeste", label: "Celeste" },
  { id: "cosmo", label: "Cosmo" },
  { id: "eve", label: "Eve" },
  { id: "helios", label: "Helios" },
  { id: "helix", label: "Helix" },
  { id: "iris", label: "Iris" },
  { id: "kepler", label: "Kepler" },
  { id: "leo", label: "Leo" },
  { id: "liora", label: "Liora" },
  { id: "lumen", label: "Lumen" },
  { id: "luna", label: "Luna" },
  { id: "lux", label: "Lux" },
  { id: "naksh", label: "Naksh" },
  { id: "orion", label: "Orion" },
  { id: "perseus", label: "Perseus" },
  { id: "rex", label: "Rex" },
  { id: "rigel", label: "Rigel" },
  { id: "sal", label: "Sal" },
  { id: "sirius", label: "Sirius" },
  { id: "ursa", label: "Ursa" },
  { id: "zagan", label: "Zagan" },
  { id: "zenith", label: "Zenith" }
];
function normalizeSandVoiceId(raw) {
  const id = raw?.trim().toLowerCase();
  return SAND_VOICES.find((voice) => voice.id === id)?.id ?? null;
}
var SAND_VOICE_SPEEDS = [
  { value: 0.75, label: "0.75x" },
  { value: 1, label: "1x" },
  { value: 1.25, label: "1.25x" },
  { value: 1.5, label: "1.5x" },
  { value: 2, label: "2x" }
];
var DEFAULT_SAND_VOICE_SPEED = 1;
var SAND_VOICE_LANGUAGE_AUTO = "auto";
var SAND_VOICE_LANGUAGES = [
  { id: "en", label: "English" },
  { id: "ar-EG", label: "Arabic (Egypt)" },
  { id: "ar-SA", label: "Arabic (Saudi Arabia)" },
  { id: "ar-AE", label: "Arabic (United Arab Emirates)" },
  { id: "bn", label: "Bengali" },
  { id: "ca", label: "Catalan" },
  { id: "zh", label: "Chinese (Simplified)" },
  { id: "da", label: "Danish" },
  { id: "nl", label: "Dutch" },
  { id: "fi", label: "Finnish" },
  { id: "fr", label: "French" },
  { id: "de", label: "German" },
  { id: "hi", label: "Hindi" },
  { id: "hu", label: "Hungarian" },
  { id: "id", label: "Indonesian" },
  { id: "it", label: "Italian" },
  { id: "ja", label: "Japanese" },
  { id: "ko", label: "Korean" },
  { id: "pl", label: "Polish" },
  { id: "pt-BR", label: "Portuguese (Brazil)" },
  { id: "pt-PT", label: "Portuguese (Portugal)" },
  { id: "ru", label: "Russian" },
  { id: "es-MX", label: "Spanish (Mexico)" },
  { id: "es-ES", label: "Spanish (Spain)" },
  { id: "sv", label: "Swedish" },
  { id: "th", label: "Thai" },
  { id: "tr", label: "Turkish" },
  { id: "vi", label: "Vietnamese" }
];
var DEFAULT_SAND_VOICE_LANGUAGE = SAND_VOICE_LANGUAGE_AUTO;
function normalizeSandVoiceSpeed(raw) {
  let speed = Number.NaN;
  if (typeof raw === "number") speed = raw;
  else if (typeof raw === "string") speed = Number.parseFloat(raw);
  if (!Number.isFinite(speed)) return DEFAULT_SAND_VOICE_SPEED;
  let closest = SAND_VOICE_SPEEDS[0].value;
  let closestDistance = Math.abs(closest - speed);
  for (const option of SAND_VOICE_SPEEDS) {
    const distance2 = Math.abs(option.value - speed);
    if (distance2 < closestDistance) {
      closest = option.value;
      closestDistance = distance2;
    }
  }
  return closest;
}
function normalizeSandVoiceLanguage(raw) {
  if (typeof raw !== "string") return DEFAULT_SAND_VOICE_LANGUAGE;
  const trimmed = raw.trim();
  if (trimmed.length === 0) return DEFAULT_SAND_VOICE_LANGUAGE;
  const lowered = trimmed.toLowerCase();
  if (lowered === SAND_VOICE_LANGUAGE_AUTO) return DEFAULT_SAND_VOICE_LANGUAGE;
  const exact = SAND_VOICE_LANGUAGES.find((language) => language.id.toLowerCase() === lowered);
  if (exact !== void 0) return exact.id;
  const prefix = lowered.split("-")[0] ?? lowered;
  const prefixMatches = SAND_VOICE_LANGUAGES.filter((language) => {
    const id = language.id.toLowerCase();
    return id === prefix || id.startsWith(`${prefix}-`);
  });
  const [onlyMatch] = prefixMatches;
  return onlyMatch !== void 0 && prefixMatches.length === 1 ? onlyMatch.id : DEFAULT_SAND_VOICE_LANGUAGE;
}


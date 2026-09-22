/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/shared/media/transcribe-language.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var WHISPER_1_LANGUAGE_HINTS = /* @__PURE__ */ new Set([
  "af",
  "ar",
  "az",
  "be",
  "bg",
  "bs",
  "ca",
  "cs",
  "cy",
  "da",
  "de",
  "el",
  "en",
  "es",
  "et",
  "fa",
  "fi",
  "fr",
  "gl",
  "he",
  "hi",
  "hr",
  "hu",
  "hy",
  "id",
  "is",
  "it",
  "ja",
  "kk",
  "kn",
  "ko",
  "lt",
  "lv",
  "mi",
  "mk",
  "mr",
  "ms",
  "ne",
  "nl",
  "no",
  "pl",
  "pt",
  "ro",
  "ru",
  "sk",
  "sl",
  "sr",
  "sv",
  "sw",
  "ta",
  "th",
  "tl",
  "tr",
  "uk",
  "ur",
  "vi",
  "zh"
]);
function toWhisperLanguageHint(bcp47Tag) {
  const primarySubtag = bcp47Tag.trim().split("-")[0]?.toLowerCase() ?? "";
  return WHISPER_1_LANGUAGE_HINTS.has(primarySubtag) ? primarySubtag : void 0;
}


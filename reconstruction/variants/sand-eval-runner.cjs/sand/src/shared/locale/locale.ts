/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/shared/locale/locale.ts
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var SUPPORTED_LOCALE_ROWS = [
  { tag: "en", endonym: "English", englishName: "English", direction: "ltr" },
  { tag: "hi", endonym: "\u0939\u093F\u0928\u094D\u0926\u0940", englishName: "Hindi", direction: "ltr" },
  { tag: "zh-CN", endonym: "\u7B80\u4F53\u4E2D\u6587", englishName: "Simplified Chinese", direction: "ltr" },
  { tag: "zh-TW", endonym: "\u7E41\u9AD4\u4E2D\u6587", englishName: "Traditional Chinese", direction: "ltr" },
  { tag: "pl", endonym: "Polski", englishName: "Polish", direction: "ltr" },
  { tag: "es", endonym: "Espa\xF1ol", englishName: "Spanish", direction: "ltr" },
  { tag: "pt", endonym: "Portugu\xEAs", englishName: "Portuguese", direction: "ltr" },
  { tag: "ja", endonym: "\u65E5\u672C\u8A9E", englishName: "Japanese", direction: "ltr" },
  { tag: "fr", endonym: "Fran\xE7ais", englishName: "French", direction: "ltr" },
  { tag: "ko", endonym: "\uD55C\uAD6D\uC5B4", englishName: "Korean", direction: "ltr" },
  { tag: "de", endonym: "Deutsch", englishName: "German", direction: "ltr" },
  { tag: "ru", endonym: "\u0420\u0443\u0441\u0441\u043A\u0438\u0439", englishName: "Russian", direction: "ltr" },
  { tag: "tr", endonym: "T\xFCrk\xE7e", englishName: "Turkish", direction: "ltr" },
  { tag: "ar", endonym: "\u0627\u0644\u0639\u0631\u0628\u064A\u0629", englishName: "Arabic", direction: "rtl" },
  { tag: "it", endonym: "Italiano", englishName: "Italian", direction: "ltr" },
  { tag: "sv", endonym: "Svenska", englishName: "Swedish", direction: "ltr" },
  { tag: "uk", endonym: "\u0423\u043A\u0440\u0430\u0457\u043D\u0441\u044C\u043A\u0430", englishName: "Ukrainian", direction: "ltr" },
  { tag: "nl", endonym: "Nederlands", englishName: "Dutch", direction: "ltr" },
  { tag: "el", endonym: "\u0395\u03BB\u03BB\u03B7\u03BD\u03B9\u03BA\u03AC", englishName: "Greek", direction: "ltr" },
  { tag: "af", endonym: "Afrikaans", englishName: "Afrikaans", direction: "ltr" },
  { tag: "he", endonym: "\u05E2\u05D1\u05E8\u05D9\u05EA", englishName: "Hebrew", direction: "rtl" },
  { tag: "vi", endonym: "Ti\u1EBFng Vi\u1EC7t", englishName: "Vietnamese", direction: "ltr" },
  { tag: "id", endonym: "Bahasa Indonesia", englishName: "Indonesian", direction: "ltr" },
  { tag: "ur", endonym: "\u0627\u0631\u062F\u0648", englishName: "Urdu", direction: "rtl" },
  { tag: "th", endonym: "\u0E44\u0E17\u0E22", englishName: "Thai", direction: "ltr" },
  { tag: "bn", endonym: "\u09AC\u09BE\u0982\u09B2\u09BE", englishName: "Bengali", direction: "ltr" },
  { tag: "cs", endonym: "\u010Ce\u0161tina", englishName: "Czech", direction: "ltr" },
  { tag: "hu", endonym: "Magyar", englishName: "Hungarian", direction: "ltr" },
  { tag: "nb", endonym: "Norsk bokm\xE5l", englishName: "Norwegian Bokm\xE5l", direction: "ltr" },
  { tag: "da", endonym: "Dansk", englishName: "Danish", direction: "ltr" },
  { tag: "fi", endonym: "Suomi", englishName: "Finnish", direction: "ltr" }
];
var SUPPORTED_LOCALES = SUPPORTED_LOCALE_ROWS.map(
  (row) => row.tag
);
var DEFAULT_LOCALE = "en";
var SAND_LANGUAGE_PREFERENCES = ["system", ...SUPPORTED_LOCALES];


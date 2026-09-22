/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/shared/locale/list-format.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var conjunctionListFormatter = lazyMemoizedIntlFactory(
  (locale) => new Intl.ListFormat(locale, { style: "long", type: "conjunction" })
);
var narrowListFormatter = lazyMemoizedIntlFactory(
  (locale) => new Intl.ListFormat(locale, { style: "narrow", type: "conjunction" })
);
var unitListFormatter = lazyMemoizedIntlFactory(
  (locale) => new Intl.ListFormat(locale, { style: "short", type: "unit" })
);


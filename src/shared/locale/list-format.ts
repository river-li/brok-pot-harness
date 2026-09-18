var conjunctionListFormatter = lazyMemoizedIntlFactory(
  (locale) => new Intl.ListFormat(locale, { style: "long", type: "conjunction" })
);
var narrowListFormatter = lazyMemoizedIntlFactory(
  (locale) => new Intl.ListFormat(locale, { style: "narrow", type: "conjunction" })
);
var unitListFormatter = lazyMemoizedIntlFactory(
  (locale) => new Intl.ListFormat(locale, { style: "short", type: "unit" })
);

/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/shared/locale/intl-factory.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_dist5();
function lazyMemoizedIntlFactory(create) {
  let slot;
  return () => {
    const locale = i18n.locale;
    if (slot == null || slot.locale !== locale) {
      slot = { locale, value: create(locale, slot?.value) };
    }
    return slot.value;
  };
}


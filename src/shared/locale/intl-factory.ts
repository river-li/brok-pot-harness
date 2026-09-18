init_dist4();
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

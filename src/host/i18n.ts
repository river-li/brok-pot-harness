/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/host/i18n.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/2
init_dist5();
init_locale();

// @recovered-fragment 2/2
function activateHostLocale() {
  i18n.loadAndActivate({ locale: DEFAULT_LOCALE, messages });
}


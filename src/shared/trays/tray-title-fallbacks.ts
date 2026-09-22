/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/shared/trays/tray-title-fallbacks.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
function trayTitleFallback(kind) {
  const descriptor2 = TITLE_BY_KIND[kind];
  return descriptor2.message ?? String(descriptor2.id ?? "");
}
function automationFailedTitleFallback(name17) {
  return `Routine "${name17}" failed`;
}
function hostTrayTitle(args) {
  const overriddenTitle = args.description?.title;
  if (overriddenTitle != null) return { title: overriddenTitle };
  if (args.kind === "automation_failed") {
    return {
      title: automationFailedTitleFallback(args.name),
      titleKind: args.kind,
      titleParams: { name: args.name }
    };
  }
  return { title: trayTitleFallback(args.kind), titleKind: args.kind };
}


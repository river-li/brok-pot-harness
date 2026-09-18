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

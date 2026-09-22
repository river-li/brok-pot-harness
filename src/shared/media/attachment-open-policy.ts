/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/shared/media/attachment-open-policy.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
function attachmentExtension(nameOrPath) {
  const segments = nameOrPath.split(/[/\\]/);
  const base = segments[segments.length - 1] ?? "";
  const dot = base.lastIndexOf(".");
  if (dot <= 0 || dot === base.length - 1) return null;
  return base.slice(dot + 1).toLowerCase();
}


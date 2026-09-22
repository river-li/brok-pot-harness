/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../dune/src/host-extensions/define.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
function defineHostExtension(options2) {
  const declaration = Object.freeze({
    kind: "host-extension",
    ...options2,
    dependencies: Object.freeze([...options2.dependencies])
  });
  return declaration;
}


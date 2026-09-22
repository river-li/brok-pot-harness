/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/cursor-plugins/dist/capabilities.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_zod();
var CapabilitySchema = external_exports.enum(["canvas"]);
var CapabilitiesSchema = external_exports.array(CapabilitySchema).transform((capabilities) => {
  return [...new Set(capabilities)].sort();
});


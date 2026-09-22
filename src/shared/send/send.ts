/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/shared/send/send.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var SAND_CLIENT_SURFACE_DESKTOP = "desktop";
var SAND_CLIENT_SURFACE_MOBILE = "mobile";
var SAND_APPROVAL_PLATFORM_DESKTOP = "desktop";
var SAND_APPROVAL_PLATFORM_IOS = "ios";
var SAND_APPROVAL_PLATFORM_ANDROID = "android";
function isSandClientSurface(value) {
  return value === SAND_CLIENT_SURFACE_DESKTOP || value === SAND_CLIENT_SURFACE_MOBILE;
}
function isSandApprovalPlatform(value) {
  return value === SAND_APPROVAL_PLATFORM_DESKTOP || value === SAND_APPROVAL_PLATFORM_IOS || value === SAND_APPROVAL_PLATFORM_ANDROID;
}
var SAND_AUTOMATION_WRITE_PROVENANCE_UNTRUSTED = "untrusted";
var SAND_AUTOMATION_WRITE_PROVENANCE_TEMPLATE_IMPORT = "template_import";


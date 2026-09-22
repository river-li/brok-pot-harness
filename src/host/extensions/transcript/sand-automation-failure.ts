/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/host/extensions/transcript/sand-automation-failure.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
function isBackgroundAutomationTrigger(trigger2) {
  return trigger2 === "schedule" || trigger2 === "event";
}
function failureBucketFromDetail(detail) {
  const text2 = (detail ?? "").trim().toLowerCase();
  if (text2.length === 0) return "unknown";
  const normalized = text2.replace(/\([^)]*\)/g, " ").replace(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/g, " ").replace(/0x[0-9a-f]+/g, " ").replace(/\d+/g, " ").replace(/[^a-z ]+/g, " ").replace(/\s+/g, " ").trim();
  const signature = normalized.split(" ").filter(Boolean).slice(0, 6).join(" ");
  return signature.length > 0 ? signature : "unknown";
}
function shouldNotifyAutomationFailure(occurrence) {
  if (occurrence <= 1) return true;
  return (occurrence & occurrence - 1) === 0;
}


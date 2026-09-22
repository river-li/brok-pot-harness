/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/shared/locale/timezone.ts
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
function formatUtcOffset(now, timeZone) {
  try {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone,
      timeZoneName: "shortOffset"
    }).formatToParts(now);
    const raw = parts.find((part) => part.type === "timeZoneName")?.value;
    if (raw == null) return null;
    const offset = raw.replace(/^GMT/, "");
    return `UTC${offset.length > 0 ? offset : "+0"}`;
  } catch {
    return null;
  }
}
function renderTimeZoneSystemPrompt(timeZone, now = /* @__PURE__ */ new Date()) {
  if (timeZone == null || timeZone.length === 0) return "";
  const offset = formatUtcOffset(now, timeZone);
  const zone = offset != null ? `${timeZone} (currently ${offset})` : timeZone;
  return [
    "## Time",
    `The user lives in ${zone}, and the box clock is set to that zone, so \`date\`, file mtimes, and other box-local times already read in the user's time. Report every time to them in that zone with a short label (a tag like "PT" is enough). A timestamp that carries its own zone \u2014 a gh or API value ending in Z or an explicit UTC offset, a git log line with its own offset, a log line marked UTC \u2014 is not box-local: convert it to the user's zone before reporting it rather than parroting it back.`
  ].join("\n");
}


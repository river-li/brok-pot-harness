function isValidIanaTimeZone(timeZone) {
  if (timeZone.length === 0) return false;
  try {
    new Intl.DateTimeFormat("en-US", { timeZone });
    return true;
  } catch {
    return false;
  }
}
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
    `The user lives in ${zone}, and the box clock is set to that zone, so \`date\`, file mtimes, and other box-local times already read in the user's time. Report every time to them in that zone with a short label (a tag like "PT" is enough). A timestamp that carries its own zone is not box-local. Examples are a gh or API value ending in Z or an explicit UTC offset, a git log line with its own offset, and a log line marked UTC. Convert such a timestamp to the user's zone before reporting it rather than parroting it back.`
  ].join("\n");
}

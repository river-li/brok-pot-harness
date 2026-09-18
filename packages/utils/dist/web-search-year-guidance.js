function getIsoDateYearString(dateString) {
  if (dateString.length !== 10 || dateString[4] !== "-" || dateString[7] !== "-") {
    throw new Error(`Expected ISO date string, got: ${dateString}`);
  }
  return dateString.slice(0, 4);
}
function buildWebSearchYearGuidance(promptDateString) {
  const currentYear = getIsoDateYearString(promptDateString);
  const parsedYear = Number.parseInt(currentYear, 10);
  const previousYear = Number.isNaN(parsedYear) ? currentYear : String(parsedYear - 1);
  return `IMPORTANT - Use the correct year in search queries:
- Today's date is ${promptDateString}. You MUST use this year when searching for recent information, documentation, or current events.
- Example: If today is ${promptDateString} and the user asks for "latest React docs", search for "React documentation ${currentYear}", NOT "React documentation ${previousYear}"`;
}
var init_web_search_year_guidance = __esm({
  "../packages/utils/dist/web-search-year-guidance.js"() {
    "use strict";
  }
});

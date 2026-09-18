var COOKIE_IMPORT_SKIP_SITES = [
  "Linear",
  "Okta",
  "United Airlines (united.com)",
  "Rippling",
  "Databricks",
  "Airtable"
];
function skipSitesInProse(conjunction) {
  const sites = [...COOKIE_IMPORT_SKIP_SITES];
  const last = sites.pop();
  return last === void 0 ? "" : `${sites.join(", ")}, ${conjunction} ${last}`;
}
function cookieImportFirstBullet() {
  return `- When the blocking step is a sign-in, try the user's own Chrome cookies before interrupting them: call request_cookie_origin_approval with no origins to see which sites and profiles their Chrome has, and if the site is listed, request it \u2014 approving is one click for the user, and the imported session usually signs the browser in with no takeover at all. Only when that path is exhausted (the site isn't listed, the user denies, or the page still demands a fresh login) do the sign-in in the box browser. The exception is ${skipSitesInProse("and")} (match each listed product and its domains): on those sites an imported session only sticks when the user's own Chrome already holds a live one, and a login made fresh just to feed the import doesn't persist. So if the origins listing shows their Chrome has the site, request it as usual; if it doesn't, skip the import \u2014 never send the user off to log in to Chrome just to feed it \u2014 and handle the typed login in the box browser like any other site: request_user_form when that tool is among your tools and the snapshot shows fillable fields, request_box_help otherwise.`;
}
function cookieImportSkipToolNote() {
  return `Listing origins (omitting origins) is always fine. Do not request origins for ${skipSitesInProse("or")} unless the listing shows the user's Chrome has the site: for those, a login made fresh just to feed the import does not persist, so with no existing Chrome session send the user to the normal sign-in on the box instead.`;
}

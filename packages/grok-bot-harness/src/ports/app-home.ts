/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/grok-bot-harness/src/ports/app-home.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_zod();
var SAND_APP_HOME_ITEM_STATUSES = ["todo", "in_progress", "blocked", "done"];
var SAND_APP_HOME_LIMITS = {
  headlineChars: 200,
  footerChars: 200,
  sections: 8,
  sectionTitleChars: 80,
  sectionBodyChars: 1200,
  itemsPerSection: 12,
  itemTextChars: 200,
  itemNoteChars: 200,
  urlChars: 1024,
  documentBytes: 16 * 1024
};
function isHttpUrl(value) {
  let parsed2;
  try {
    parsed2 = new URL(value);
  } catch {
    return false;
  }
  return parsed2.protocol === "https:" || parsed2.protocol === "http:";
}
var boundedText = (max) => external_exports.string().trim().min(1).max(max);
var sandAppHomeLinkUrlSchema = external_exports.string().trim().min(1).max(SAND_APP_HOME_LIMITS.urlChars).refine(isHttpUrl, { message: "must be an absolute http(s) URL" });
var sandAppHomeItemSchema = external_exports.object({
  text: boundedText(SAND_APP_HOME_LIMITS.itemTextChars).describe(
    "One piece of work or one fact, as a short line."
  ),
  status: external_exports.enum(SAND_APP_HOME_ITEM_STATUSES).optional().describe("Where this item stands; omit for plain bullets."),
  url: sandAppHomeLinkUrlSchema.optional().describe("An https link the item points at, e.g. the pull request."),
  note: boundedText(SAND_APP_HOME_LIMITS.itemNoteChars).optional().describe("A short aside rendered after the item, e.g. what it is waiting on.")
});
var sandAppHomeSectionSchema = external_exports.object({
  title: boundedText(SAND_APP_HOME_LIMITS.sectionTitleChars),
  body: boundedText(SAND_APP_HOME_LIMITS.sectionBodyChars).optional().describe("A short paragraph under the title; use items for lists instead."),
  items: external_exports.array(sandAppHomeItemSchema).max(SAND_APP_HOME_LIMITS.itemsPerSection).optional().describe("Bulleted lines under the title.")
});
var sandAppHomeDocumentSchema = external_exports.object({
  headline: boundedText(SAND_APP_HOME_LIMITS.headlineChars).optional().describe("One line shown under the bot's name, e.g. the current focus."),
  sections: external_exports.array(sandAppHomeSectionSchema).max(SAND_APP_HOME_LIMITS.sections),
  footer: boundedText(SAND_APP_HOME_LIMITS.footerChars).optional().describe("One quiet line at the bottom, e.g. how to reach the bot.")
}).refine(
  (document2) => document2.headline !== void 0 || document2.footer !== void 0 || document2.sections.length > 0,
  { message: "a board needs a headline, a footer, or at least one section" }
);
function sandAppHomeDocumentByteLength(document2) {
  return new TextEncoder().encode(JSON.stringify(document2)).byteLength;
}
function parseSandAppHomeDocument(value) {
  const parsed2 = sandAppHomeDocumentSchema.safeParse(value);
  if (!parsed2.success) {
    const issue2 = parsed2.error.issues[0];
    const path31 = issue2 === void 0 || issue2.path.length === 0 ? "" : `${issue2.path.join(".")}: `;
    return { ok: false, reason: `${path31}${issue2?.message ?? "invalid board"}` };
  }
  const bytes = sandAppHomeDocumentByteLength(parsed2.data);
  if (bytes > SAND_APP_HOME_LIMITS.documentBytes) {
    return {
      ok: false,
      reason: `the board is ${bytes} bytes serialized; the limit is ${SAND_APP_HOME_LIMITS.documentBytes}`
    };
  }
  return { ok: true, document: parsed2.data };
}


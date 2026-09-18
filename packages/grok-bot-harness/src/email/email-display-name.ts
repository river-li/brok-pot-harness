var GROK_BOT_EMAIL_DISPLAY_NAME_MAX_LENGTH = 128;
var CONTROL_OR_DEL = /[\u0000-\u001F\u007F]/;
var ENCODED_WORD = /=\?[^?]*\?[BQbq]\?[^?]*\?=/;
var RESERVED_LOCAL_PARTS = /* @__PURE__ */ new Set([
  "abuse",
  "account",
  "accounts",
  "admin",
  "administrator",
  "alerts",
  "billing",
  "careers",
  "compliance",
  "contact",
  "hello",
  "help",
  "helpdesk",
  "hostmaster",
  "hr",
  "info",
  "legal",
  "mail",
  "mailer-daemon",
  "marketing",
  "no-reply",
  "noc",
  "noreply",
  "notification",
  "notifications",
  "notify",
  "official",
  "payments",
  "postmaster",
  "press",
  "privacy",
  "root",
  "safety",
  "sales",
  "security",
  "service",
  "staff",
  "status",
  "support",
  "team",
  "trust",
  "updates",
  "verify",
  "webmaster",
  "www",
  "anysphere",
  "cursor",
  "cursorai",
  "grok",
  "grokbot",
  "xai"
]);
var SUBSTRING_MATCH_MIN_LENGTH = 6;
var BARE_MAILBOX_EMAIL = /^[^\s<>@,;:"\\\x00-\x1f\x7f]+@[^\s<>@,;:"\\\x00-\x1f\x7f]+\.[^\s<>@,;:"\\\x00-\x1f\x7f]+$/;
function mailboxDisplayNameShapeError(name17) {
  if (name17.length > GROK_BOT_EMAIL_DISPLAY_NAME_MAX_LENGTH) {
    return `must be at most ${GROK_BOT_EMAIL_DISPLAY_NAME_MAX_LENGTH} characters.`;
  }
  if (CONTROL_OR_DEL.test(name17) || new RegExp("\\p{Cf}", "u").test(name17)) {
    return "must not contain control or format characters.";
  }
  if (ENCODED_WORD.test(name17)) {
    return "must not contain encoded-words.";
  }
  if (/[<>]/.test(name17)) {
    return "must not contain < or >.";
  }
  return void 0;
}
var HAS_LATIN_LETTER = new RegExp("\\p{Script=Latin}", "u");
var HAS_CYRILLIC_LETTER = new RegExp("\\p{Script=Cyrillic}", "u");
var HAS_GREEK_LETTER = new RegExp("\\p{Script=Greek}", "u");
function foldReservedDisplayName(value) {
  return value.normalize("NFKC").toLowerCase().replace(/[\p{Cf}\p{Cc}]/gu, "");
}
function mixesLatinWithLookalikeScript(value) {
  return HAS_LATIN_LETTER.test(value) && (HAS_CYRILLIC_LETTER.test(value) || HAS_GREEK_LETTER.test(value));
}
function reservedTermIn(value) {
  const lowered = foldReservedDisplayName(value);
  const tokens = new Set(lowered.split(/[\s._-]+/).filter((t) => t.length > 0));
  const collapsed = lowered.replaceAll(/[\s._-]/g, "");
  return [...RESERVED_LOCAL_PARTS].find((term) => {
    const collapsedTerm = term.replaceAll("-", "");
    return tokens.has(term) || tokens.has(collapsedTerm) || collapsedTerm.length >= SUBSTRING_MATCH_MIN_LENGTH && collapsed.includes(collapsedTerm);
  });
}
function mailboxDisplayNameError(name17) {
  const shape = mailboxDisplayNameShapeError(name17);
  if (shape !== void 0) {
    return shape;
  }
  if (mixesLatinWithLookalikeScript(name17.normalize("NFKC"))) {
    return "must not mix Latin letters with Cyrillic or Greek letters.";
  }
  const reservedTerm = reservedTermIn(name17);
  if (reservedTerm !== void 0) {
    return `may not contain "${reservedTerm}", which is reserved.`;
  }
  return void 0;
}

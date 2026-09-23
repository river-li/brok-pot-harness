var USER_FORM_MAX_FIELDS = 8;
var USER_FORM_MAX_TITLE_LENGTH = 120;
var USER_FORM_MAX_INSTRUCTION_LENGTH = 400;
var USER_FORM_MAX_LABEL_LENGTH = 120;
var userFormTargetSchema = external_exports.object({
  kind: external_exports.enum(["ref", "selector", "label"]).describe(
    'How the host finds the element to fill: "ref" is an [ref=eN] handle from the latest browser snapshot (preferred; refs stay valid until the next snapshot or navigation), "selector" is a CSS selector, "label" is the visible field label text.'
  ),
  value: external_exports.string().trim().min(1).describe("The ref, selector, or label text.")
});
var userFormOptionSchema = external_exports.object({
  label: external_exports.string().trim().min(1).describe("Option text shown to the user."),
  value: external_exports.string().min(1).describe("Value submitted (and filled) when picked.")
});
var userFormFieldSchema = external_exports.object({
  id: external_exports.string().trim().min(1).max(64).describe("Stable field id; the fill receipt refers to fields by this id."),
  label: external_exports.string().trim().min(1).describe("Field label shown to the user."),
  type: external_exports.enum([
    "text",
    "email",
    "tel",
    "password",
    "otp",
    "number",
    "date",
    "select",
    "textarea",
    "checkbox"
  ]).describe(
    'Input type; drives the native input and autocomplete. "password" and "otp" are ALWAYS treated as secret (masked input) regardless of the secret flag.'
  ),
  required: external_exports.boolean().optional().describe("When true, the user must fill it to submit."),
  placeholder: external_exports.string().trim().optional().describe("Optional placeholder text."),
  options: external_exports.array(userFormOptionSchema).max(20).optional().describe('Choices for type "select". Required for selects, ignored otherwise.'),
  secret: external_exports.boolean().optional().describe(
    "Marks a credential so the card masks the input and the host demands a verified destination. Set for card numbers, SSNs, and other credentials; password/otp are secret no matter what you pass. Note EVERY field is write-only regardless of this flag: no submitted value, secret or not, is ever returned to you."
  ),
  target: userFormTargetSchema.optional().describe(
    "Where the host writes the value in the box browser. Values are write-only, and nothing comes back on the receipt, so a field without a target is never filled anywhere; give a target to every field whose value the page needs. Required for secret fields (a secret with nowhere to go would be lost). Any target requires the form to claim the destination domain."
  ),
  extra_key: external_exports.string().trim().max(255).optional().describe(
    `Vault key for leftover ("extra") fields. See the "Vault extras" section of this tool's description. Set it on every leftover field. Saved values are shared across sites by this exact key, so reuse the saved key naming the same fact rather than inventing a synonym. Ignored on name/email/phone/address fields, refused on anything secret-shaped, and username-shaped fields are keyed per site no matter what you pass.`
  )
});
var requestUserFormParameters = external_exports.object({
  title: external_exports.string().trim().min(1).describe("Short form title shown on the in-chat card."),
  instruction: external_exports.string().trim().min(1).describe(
    'One or two sentences telling the user what to fill and why (e.g. "Sign in to your Acme account to continue checkout"). No paragraph.'
  ),
  reason: external_exports.enum(["auth", "checkout", "profile", "other"]).catch("other").describe(
    'Why the user is needed: "auth" for sign-in credentials, "checkout" for payment/shipping details, "profile" for account/profile data, "other" otherwise.'
  ),
  domain: external_exports.string().trim().optional().catch(void 0).describe(
    'Destination site the values are filled into, from the browser bar (e.g. "acme.com"). The host resolves the live open tab under this domain, shows that exact host to the user on the card, and ENFORCES it. At submit time values fill only a page on that exact host (www and the bare domain count as the same host; other subdomains do not), otherwise nothing is filled and every targeted field comes back fillFailed. REQUIRED whenever any field is secret (password/otp or secret:true) or carries a fill target. Nothing is ever filled into an unverified page. Omit only for target-less, secret-free forms when the site is genuinely unknown. The card then warns and steers toward the box screen.'
  ),
  fields: external_exports.array(userFormFieldSchema).min(1).max(USER_FORM_MAX_FIELDS).describe(`The form fields, 1-${USER_FORM_MAX_FIELDS}.`),
  submitAfterFill: external_exports.boolean().optional().describe(
    "When true, after the fills succeed the host ALSO submits the page by pressing Enter in the filled field (the same Enter-submit browser_type's submit flag uses). Default false/omitted: the host only fills and never touches the site's submit control, and you click it yourself after resuming. This is ONLY for one-shot code steps where Enter-submit is the whole action and staleness is the real risk (an OTP / verification-code prompt is the canonical case), and the host ENFORCES that scope: the form must claim a domain and carry exactly ONE targeted single-line text field (the code), the card discloses the submit to the user, and the Enter press runs only when every targeted fill succeeded. Leave it off for logins, checkout, and anything where submitting has side effects worth verifying first. A multi-field form with submitAfterFill is rejected, and so is one whose field looks like payment or government-ID data (card number, CVV, SSN, IBAN, ...). The receipt reports whether the submit was attempted and whether it succeeded."
  )
});
var ALWAYS_SECRET_TYPES = /* @__PURE__ */ new Set(["password", "otp"]);
function isSecretUserFormField(field) {
  return field.secret === true || ALWAYS_SECRET_TYPES.has(field.type);
}
var ENTER_SUBMIT_INELIGIBLE_TYPES = /* @__PURE__ */ new Set([
  "select",
  "checkbox",
  "textarea"
]);
function isSubmitAnchorUserFormField(field) {
  return field.target != null && !ENTER_SUBMIT_INELIGIBLE_TYPES.has(field.type);
}
var PAYMENT_LIKE_FIELD_PATTERN = /\b(?:card|cv[vcn]\d?|pan|ssn|social\s*security|iban|routing|swift|bic)\b|\baccount\s*number\b/i;
function fieldSniffText(field) {
  return `${field.id} ${field.label}`.replace(/_/g, " ").replace(new RegExp("(\\p{Ll}|\\p{N})(\\p{Lu})", "gu"), "$1 $2").replace(new RegExp("(\\p{Lu}+)(\\p{Lu}\\p{Ll})", "gu"), "$1 $2").replace(new RegExp("(\\p{L})(\\p{N})", "gu"), "$1 $2");
}
function userFormFieldLooksPaymentLike(field) {
  return PAYMENT_LIKE_FIELD_PATTERN.test(fieldSniffText(field));
}
var CREDENTIAL_LIKE_FIELD_PATTERN = /\b(?:pass(?:word|phrase|code)?|passwd|pwd?|otp|one.?time|log.?in|session|confirmation|account|verification\s*code|security\s*code|auth(?:enticat(?:ion|or))?\s*code|2fa|mfa|totp|api.?keys?|access.?keys?|private\s*keys?|ssh\s*keys?|keys?|jwt|bearer|o?auth|secret|token|credential|passkey|(?:seed|recovery)\s*phrase|mnemonic|seed|wallet|security\s*(?:question|answer)s?|maiden\s*name|pin|passport|national\s*id|government\s*id|govt\s*id|tax\s*id|itin|licen[sc]e)\b/i;
var BARE_CODE_FIELD_PATTERN = /\bcodes?\b/i;
var NON_SECRET_CODE_QUALIFIER_PATTERN = /\b(?:postal|zip|country|area|dial(?:ing)?)[\s_-]*codes?\b/i;
function userFormFieldLooksCredentialLike(field) {
  const text2 = fieldSniffText(field);
  if (CREDENTIAL_LIKE_FIELD_PATTERN.test(text2)) return true;
  return BARE_CODE_FIELD_PATTERN.test(text2) && !NON_SECRET_CODE_QUALIFIER_PATTERN.test(text2);
}
var USER_FORM_LOCALHOST = "localhost";
var USER_FORM_LOOPBACK_HOSTS = /* @__PURE__ */ new Set([
  USER_FORM_LOCALHOST,
  // pragma: allowlist secret
  "127.0.0.1",
  "[::1]",
  "::1"
]);
function isLoopbackUserFormHost(host) {
  return USER_FORM_LOOPBACK_HOSTS.has(host.trim().toLowerCase());
}
function normalizeUserFormDomain(raw) {
  if (raw.trim().toLowerCase() === "::1") return "[::1]";
  return normalizeBoxHelpDomain(raw);
}
function userFormVaultHostScope(domain2) {
  if (domain2 == null) return void 0;
  const host = domain2.trim().toLowerCase().replace(/^www\./, "");
  if (host.length === 0) return void 0;
  if (isLoopbackUserFormHost(host)) return USER_FORM_LOCALHOST;
  if ((0, import_tldts2.getDomain)(host, { allowPrivateDomains: true }) === null) return void 0;
  return host;
}
function isOneShotSubmitUserForm(form) {
  return form.submitAfterFill === true && form.domain != null && form.fields.filter(isSubmitAnchorUserFormField).length === 1 && !form.fields.some(userFormFieldLooksPaymentLike);
}
function normalizeUserFormRequest(args) {
  const seenIds = /* @__PURE__ */ new Set();
  const domain2 = args.domain != null ? normalizeUserFormDomain(args.domain) : void 0;
  const fields2 = args.fields.map((field) => {
    if (seenIds.has(field.id)) {
      throw new SandToolInputError(`Duplicate field id "${field.id}": field ids must be unique.`);
    }
    seenIds.add(field.id);
    const secret = isSecretUserFormField(field);
    if (secret && domain2 == null) {
      throw new SandToolInputError(
        `Field "${field.id}" is secret but the form claims no domain. Secret values are only ever filled into a page the host can verify. Without a claimed destination the fill would write them into whatever page is live. Pass the destination domain from the browser bar, or hand the user the screen with request_box_help.`
      );
    }
    if (secret && field.target == null) {
      throw new SandToolInputError(
        `Field "${field.id}" is secret but has no target. Secret values are write-only. They are filled into the browser and never returned to you, so a secret field without a fill target would lose the value. Add a target (take a browser snapshot for refs), or hand the user the screen with request_box_help.`
      );
    }
    if (field.target != null && domain2 == null) {
      throw new SandToolInputError(
        `Field "${field.id}" has a fill target but the form claims no domain. The host only ever writes values into a page it can verify against a claimed destination. An untargeted destination would let the fill land on whatever page is live. Pass the destination domain from the browser bar, or hand the user the screen with request_box_help.`
      );
    }
    if (field.type === "select" && (field.options == null || field.options.length === 0)) {
      throw new SandToolInputError(`Select field "${field.id}" needs at least one option.`);
    }
    return {
      id: field.id,
      label: clampLine(field.label, USER_FORM_MAX_LABEL_LENGTH),
      type: field.type,
      ...field.required != null ? { required: field.required } : {},
      ...field.placeholder != null && field.placeholder.length > 0 ? { placeholder: clampLine(field.placeholder, USER_FORM_MAX_LABEL_LENGTH) } : {},
      ...field.options != null ? { options: field.options } : {},
      ...secret ? { secret: true } : {},
      ...field.target != null ? { target: field.target } : {},
      ...field.extra_key != null && field.extra_key.length > 0 && !secret ? { extraKey: field.extra_key } : {}
    };
  });
  if (args.submitAfterFill === true) {
    if (domain2 == null) {
      throw new SandToolInputError(
        "submitAfterFill needs the destination domain from the browser bar: the host only ever submits a page it verified against the claimed destination."
      );
    }
    const anchorCount = fields2.filter(isSubmitAnchorUserFormField).length;
    if (anchorCount !== 1) {
      throw new SandToolInputError(
        `submitAfterFill is only for one-shot code steps: the form must carry exactly ONE targeted single-line text field (the code) for the host to press Enter in, and this form has ${anchorCount}. For logins, checkout, and other multi-field steps leave submitAfterFill off and click the submit control yourself after resuming.`
      );
    }
    const paymentLike = fields2.find((field) => userFormFieldLooksPaymentLike(field));
    if (paymentLike !== void 0) {
      throw new SandToolInputError(
        `Field "${paymentLike.id}" looks like payment-instrument or government-ID data, so submitAfterFill is refused. The host never auto-submits a form carrying card/SSN-class values. Re-issue the form WITHOUT submitAfterFill. The host fills only, and you click the site's submit control yourself after resuming.`
      );
    }
  }
  return {
    title: clampLine(args.title, USER_FORM_MAX_TITLE_LENGTH),
    instruction: clampBlock(args.instruction, USER_FORM_MAX_INSTRUCTION_LENGTH),
    reason: args.reason,
    ...domain2 != null ? { domain: domain2 } : {},
    fields: fields2,
    ...args.submitAfterFill === true ? { submitAfterFill: true } : {}
  };
}
function buildUserFormVaultKeysSection(catalog) {
  const lines2 = catalog.map((key) => {
    const showHost = key.originHost !== void 0 && !key.extraKey.startsWith(`${key.originHost} `);
    return showHost ? `- ${key.extraKey}  (${key.originHost})` : `- ${key.extraKey}`;
  });
  const catalogText = lines2.length === 0 ? "No saved extra keys yet." : `Saved extra keys:
${lines2.join("\n")}`;
  return "\n\nVault extras: leftover typed fields (not name/email/phone/address, never passwords or secrets) are saved under extra_key so later forms on ANY site can prefill them.\n- Name the fact with extra_key on every leftover field. Keys are shared across sites and matched by exact string, so one fact gets one key everywhere: traveller_number / ktn / known-traveler / tsa-precheck are one fact, so reuse ktn on every site that asks. The host ignores extra_key on identity fields and refuses it on anything secret-shaped.\n- Scan the saved keys below first. If the field is the SAME FACT as a saved key, set extra_key to that exact string; do not invent a synonym. Invent a new short key only when nothing in the list is the same fact.\n- If you omit extra_key, the host falls back to keying the value by the field's normalized label, which rematches only where another site words its label identically. Keying by label is always worse than a key you name.\n- Usernames are the exception: the host keys username-shaped fields per site automatically, because the same label names a different value on every site.\n- If any other fact is site-bound (this airline's frequent flyer, a membership number that is not portable), put a site token in the key (aa frequent flyer, not frequent flyer).\n- Never put a value, SSN, password, OTP, or payment number in extra_key.\n\n" + catalogText;
}
function createRequestUserFormTool(deps) {
  const vaultKeysSection = deps.vaultKeysCatalog !== void 0 ? buildUserFormVaultKeysSection(deps.vaultKeysCatalog) : "";
  return defineCommunicateTool(deps, {
    id: "REQUEST_USER_FORM",
    name: "request_user_form",
    description: "Show the user a native in-chat form for a step where a page needs THEM to type something, such as a login, a checkout address, or a phone number. Multi-step sign-ins (email first, password only after Continue, as on Walmart, PayPal, Amazon, and Microsoft) get ONE form PER STEP. Request only the fields visible on the live page right now, because a next-step field sits hidden in the DOM until the site reveals it, its fill comes back fillFailed, and the value the user typed into your form is simply lost. Advance the page yourself after resuming (e.g. click Continue), then request the next step with a new form. On submit the HOST fills the live box browser directly (same insert path as browser_fill). By default it never clicks the site's own submit button, so you do that after resuming, unless you explicitly opt in with submitAfterFill for one-shot code steps. Your turn ends when you call this; you are resumed with a receipt once the user submits or dismisses. The receipt is status-only. Per field it says filled / fill failed / not filled, and NO submitted value is ever returned to you or enters this conversation, not a username, email, address, code, password, or anything else. For secret fields the receipt IS the verification. Recover from a failed secret fill by re-asking with a new form (fresh target) or with request_box_help, never by taking a screenshot to see what landed (structured snapshots redact secret values; a screenshot is raw page pixels and redacts nothing). Non-secret outcomes can be verified from the page itself (fresh snapshot), or re-asked. Give each field a target (an [ref=eN] from the latest browser snapshot, a CSS selector, or a field label) so the host knows where to fill; secret fields require one. A browser subagent's report includes the [ref=eN] values. Always pass the destination domain from the browser bar. Before showing the card the host PREFLIGHTS every targeted field against the live page: when every one of them is structurally unreachable (inside a cross-origin frame the host cannot enter, or behind a closed shadow root), the form is refused up front with per-field reasons and the user is never asked to type, so treat that refusal as final and call request_box_help instead of re-issuing the form; when only some fields are unreachable the card shows without them and the result says which were dropped. Use this instead of asking for credentials in chat, and instead of request_box_help when the step is just typing; the box handoff stays for captchas, passkeys, 3DS prompts, QR codes, device approvals, and custom widgets a form cannot express." + vaultKeysSection,
    parameters: requestUserFormParameters,
    execute: async (_ctx, args, d) => {
      const agentId = d.getAgentId();
      invariant(agentId != null, "request_user_form was called outside an agent run.");
      const form = normalizeUserFormRequest(args);
      const outcome = await d.requestForm({ agentId, form });
      if (outcome.kind === "canceled") {
        return "The form was NOT shown: the request was canceled while it was being prepared (the conversation or agent was shut down or reset). Do not re-issue it.";
      }
      if (outcome.kind === "unfillable") {
        return buildUserFormUnfillableResult(form, outcome.fieldKinds);
      }
      if (outcome.kind === "driver_unavailable") {
        return buildUserFormDriverUnavailableResult(form);
      }
      if (outcome.kind === "unsupported_turn") {
        return buildUserFormUnsupportedTurnResult(form, outcome.reason);
      }
      const skipped2 = outcome.skippedFieldKinds;
      const shownForm = {
        ...form,
        ...skipped2 !== void 0 ? { fields: form.fields.filter((field) => skipped2[field.id] === void 0) } : {},
        ...outcome.liveHost != null ? { liveHost: outcome.liveHost } : {}
      };
      d.endTurn({ toolCallId: d.toolCallId });
      d.onSendMessage({ type: "user-form", formRequest: shownForm }, Date.now(), {
        requestId: outcome.requestId
      });
      return "Showed the form to the user; your turn is over. When they submit, the host fills the browser and resumes you with a per-field receipt (fill statuses only, never the submitted values). If they dismiss it, you'll be resumed with that outcome. If they choose to do the step on the screen instead, the host hands them the box directly (same as request_box_help) and you'll be resumed when they hand it back." + (skipped2 !== void 0 ? `

${buildUserFormSkippedFieldsNote(skipped2)}` : "");
    }
  });
}

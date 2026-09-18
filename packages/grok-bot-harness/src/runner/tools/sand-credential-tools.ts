init_zod();
var SHARED_VAULT = `the "${CREDENTIAL_MINT_DEFAULT_VAULT_NAME}" 1Password vault`;
var listCredentialsParameters = external_exports.object({
  site: external_exports.string().trim().optional().describe(
    "Current website URL or domain. Always pass this when a browser login is blocked; only credentials allowed for that live site are returned."
  ),
  query: external_exports.string().trim().optional().describe(
    "Optional service/name search when no website URL is available, e.g. reform or stripe."
  ),
  forceRefresh: external_exports.boolean().optional().describe(
    `Set true to refresh the catalog from 1Password before listing, after the user says they just added or moved an item into ${SHARED_VAULT}, or on their next request to log in or retry after a missing result. Leave unset otherwise: the catalog already refreshes on its own and provider refreshes are rate limited.`
  )
});
function credentialSiteHost(raw) {
  try {
    return new URL(raw.includes("://") ? raw : `https://${raw}`).hostname;
  } catch {
    return raw;
  }
}
function describeCredential(view) {
  const siteHosts = [...new Set(view.sites.map(credentialSiteHost))];
  const sites = siteHosts.length > 0 ? ` \xB7 ${siteHosts.slice(0, 2).join(", ")}` : "";
  const browser = ` \xB7 browser login${view.siteMatch != null ? ` ${view.siteMatch} match` : ""}`;
  const oneTimeCode = view.hasOneTimeCode ? " \xB7 one-time code in 1Password" : "";
  return `- "${view.title}" (${view.category}${sites}${browser}${oneTimeCode}) \u2014 credential_id: ${view.credentialId} \xB7 connection_id: ${view.connectionId} \xB7 catalog_revision: ${view.catalogRevision}`;
}
var ONE_TIME_CODE_GUIDANCE = "A login marked one-time code in 1Password also has its verification code filled for you when the site asks, so that step is not a handoff; a login without the mark has no code in 1Password, so a verification-code page is a request_box_help step.";
var NO_ONE_TIME_CODE_GUIDANCE = "None of these logins carries a one-time code in 1Password, so a verification-code page after the fill is a request_box_help step.";
var CREDENTIAL_REQUEST_GUIDANCE = 'To fill the 1Password login for the sign-in page you are on, send {"type":"credential-request","credential":{"kind":"browser-login","credential_id":"\u2026","connection_id":"\u2026","catalog_revision":"\u2026","site":"https://current.example/login","purpose":"sign in to continue the requested task"}}. Use the URL computerUse reports, never one of the 1Password item URLs above. Grok Bot treats `site` as a hint, binds the fill to the open page allowed by the item\'s target rules, then fills that same page once the fill is accepted. You learn only the outcome: filled, declined by the user, or failed with a reason. You never receive a username or password, and you never ask the user to type or paste one. One request covers the whole login: on a username-first page the username is submitted and the password step that follows is filled for you as it appears, and when the site asks for a one-time code the login carries, it is filled for you too. After a fill, continue with computerUse and submit only per the user\'s instruction. Use request_box_help only for a remaining SSO, passkey, captcha, or payment step, or a code the login does not carry. To the user, call these their 1Password logins and say 1Password filled it; never "saved login" or "saved credentials".';
var MISSING_LOGIN_GUIDANCE = `Only items in ${SHARED_VAULT} are visible to you, and 1Password items are placed in that vault by hand. Tell the user the login was not found there and that they may need to add or move it into ${SHARED_VAULT}. On their next request to log in or retry, call ListCredentials with forceRefresh true before reporting it missing again; they do not need to mention 1Password. Use request_box_help only if they prefer to sign in themselves.`;
function createCredentialTools(access5) {
  return [
    defineCommunicateTool(access5, {
      id: "LIST_CREDENTIALS",
      name: "ListCredentials",
      description: `Search the 1Password logins the user shares with you through the 1Password integration, by website/domain or service name: titles and sites only \u2014 never values. Only items in ${SHARED_VAULT} are visible; anything the user keeps elsewhere in 1Password is not. MANDATORY FIRST STEP at a direct username/password login, before any in-chat form, request_box_help, or asking the user to type: pass the current URL/domain in site. Matching follows each item's 1Password hostname behavior; saved URL paths and queries are ignored. Each result says whether the login carries a one-time code in 1Password. Then fill the matching login with SendToUser type credential-request; Grok Bot binds your site hint to the actual open allowed page and fills it there, and a one-time code the login carries is filled for you when the site asks. When a needed login is missing, tell the user it is not in ${SHARED_VAULT} and that they may need to add or move it there in 1Password. On their next request to log in or retry, call again with forceRefresh true before reporting it missing again; they do not need to mention 1Password. Only hand off when there is no usable match and the user prefers to sign in themselves, or the remaining step is SSO, passkey, captcha, payment, or a code the login does not carry. To the user, call these their 1Password logins, never "saved login". This is read-only, metadata-only, and never needs permission.`,
      parameters: listCredentialsParameters,
      execute: async (_ctx, args, deps) => {
        if (deps.turnRefusal !== void 0) {
          return `No 1Password logins were listed: ${SAND_CREDENTIAL_TURN_REFUSAL_PHRASE[deps.turnRefusal]}.`;
        }
        if (!await deps.isConnected()) {
          return `No 1Password vault is connected. Connecting one shares ${SHARED_VAULT} with you. ${ONEPASSWORD_CONNECT_CARD_HINT}`;
        }
        const site = args.site != null && args.site.length > 0 ? args.site : void 0;
        const query = args.query != null && args.query.length > 0 ? args.query : void 0;
        const views = await deps.list({
          ...site != null ? { site } : {},
          ...query != null ? { query } : {},
          ...args.forceRefresh === true ? { forceRefresh: true } : {}
        });
        if (views.length === 0) {
          if (site != null) {
            return `No 1Password login in ${SHARED_VAULT} is allowed to fill ${site}. Do not request an arbitrary item for this page. ${MISSING_LOGIN_GUIDANCE}`;
          }
          return query != null ? `No 1Password login in ${SHARED_VAULT} matches "${query}". ${MISSING_LOGIN_GUIDANCE}` : `The "${CREDENTIAL_MINT_DEFAULT_VAULT_NAME}" 1Password vault has no logins visible to you. ${MISSING_LOGIN_GUIDANCE}`;
        }
        return [
          site != null ? `${views.length} 1Password login(s) allowed for ${site}:` : `${views.length} 1Password login(s) available:`,
          ...views.map(describeCredential),
          "",
          views.some((view) => view.hasOneTimeCode) ? ONE_TIME_CODE_GUIDANCE : NO_ONE_TIME_CODE_GUIDANCE,
          CREDENTIAL_REQUEST_GUIDANCE
        ].join("\n");
      }
    })
  ];
}

init_dist3();
init_zod();
init_system_errno();
var X11_UNIX_DIR = "/tmp/.X11-unix";
var CDP_PORT_BASE = 9222;
var MAX_DISPLAY_NUMBER = 256;
function browserWindowIndexOfCdpPort(port) {
  const windowIndex = port - CDP_PORT_BASE;
  return Number.isInteger(windowIndex) && windowIndex > 0 && windowIndex <= MAX_DISPLAY_NUMBER ? windowIndex : void 0;
}
function browserWindowIndexOfDebuggerUrl(webSocketDebuggerUrl) {
  if (!URL.canParse(webSocketDebuggerUrl)) return void 0;
  const port = Number.parseInt(new URL(webSocketDebuggerUrl).port, 10);
  return Number.isInteger(port) ? browserWindowIndexOfCdpPort(port) : void 0;
}
var CDP_TIMEOUT_MS = 2e3;
var cdpDeadline = createDeadlinePolicy({
  name: "sand-browser-credential-cdp",
  timeoutMs: CDP_TIMEOUT_MS
});
var BROWSER_PAGE_FORM_KINDS = [
  "login",
  "username-first",
  "one-time-code",
  "signup-or-reset",
  "unsubmittable-login",
  "none"
];
var credentialAuditElementSchema = external_exports.object({
  tag: external_exports.string(),
  type: external_exports.string().optional(),
  name: external_exports.string().optional(),
  id: external_exports.string().optional(),
  autocomplete: external_exports.string().optional(),
  ariaLabel: external_exports.string().optional(),
  formActionOrigin: external_exports.string().optional(),
  formMethod: external_exports.string().optional()
}).strict();
var browserFillAuditContextSchema = external_exports.object({
  targetUrl: external_exports.string(),
  elements: external_exports.array(credentialAuditElementSchema).max(8)
}).strict();
var browserPageStateSchema = external_exports.object({
  hasFocus: external_exports.boolean(),
  formKind: external_exports.enum(BROWSER_PAGE_FORM_KINDS).optional(),
  documentTimeOriginMs: external_exports.number().finite().nonnegative().optional(),
  audit: browserFillAuditContextSchema.optional()
}).strict();
var cdpTargetSchema = external_exports.object({
  id: external_exports.string(),
  type: external_exports.string(),
  url: external_exports.string(),
  webSocketDebuggerUrl: external_exports.string()
}).passthrough();
var cdpRuntimeResponseSchema = external_exports.object({
  id: external_exports.number(),
  error: external_exports.unknown().optional(),
  result: external_exports.object({
    exceptionDetails: external_exports.unknown().optional(),
    result: external_exports.object({ value: external_exports.unknown() }).passthrough()
  }).passthrough()
}).passthrough();
var cdpMessageIdSchema = external_exports.object({ id: external_exports.number().optional() }).passthrough();
function isLoopbackHost3(host) {
  return host === "localhost" || // pragma: allowlist secret
  host === "127.0.0.1" || host === "[::1]" || host === "::1";
}
function trustedDebuggerUrl(args) {
  if (!URL.canParse(args.raw)) return null;
  const url2 = new URL(args.raw);
  if (url2.protocol !== "ws:" || url2.username !== "" || url2.password !== "" || !isLoopbackHost3(url2.hostname.toLowerCase()) || Number(url2.port) !== args.expectedPort || url2.pathname !== `/devtools/page/${args.expectedTargetId}`) {
    return null;
  }
  return url2.toString();
}
async function discoverMonitorPorts(reportFailure) {
  let entries;
  try {
    entries = await (0, import_promises50.readdir)(X11_UNIX_DIR);
  } catch (error42) {
    reportFailure("discover-monitor-ports", error42);
    return { ok: false };
  }
  const ports = [];
  for (const entry of entries) {
    const match2 = /^X(\d+)$/.exec(entry);
    if (match2 == null) continue;
    const displayNumber = Number.parseInt(match2[1], 10);
    if (!Number.isInteger(displayNumber) || displayNumber <= 0 || displayNumber > MAX_DISPLAY_NUMBER) {
      continue;
    }
    ports.push(CDP_PORT_BASE + displayNumber);
  }
  return { ok: true, ports: ports.sort((a, b2) => a - b2) };
}
async function listPageTargetsOnPort(port, fetchImpl) {
  try {
    const listing = await cdpDeadline.run(async (signal) => {
      const response = await fetchImpl(`http://127.0.0.1:${port}/json/list`, { signal });
      if (!response.ok) {
        return { ok: false, status: response.status };
      }
      const payload2 = await response.json();
      return { ok: true, payload: payload2 };
    });
    if (!listing.ok) {
      return {
        ok: false,
        error: new Error(`CDP target listing failed with HTTP ${listing.status}`)
      };
    }
    const { payload } = listing;
    if (!Array.isArray(payload)) {
      return { ok: false, error: new Error("CDP target listing was not an array") };
    }
    const targets = [];
    for (const value of payload) {
      const parsed2 = cdpTargetSchema.safeParse(value);
      if (!parsed2.success || parsed2.data.type !== "page") continue;
      const { id, url: url2, webSocketDebuggerUrl } = parsed2.data;
      if (url2.length === 0 || webSocketDebuggerUrl.length === 0) continue;
      const trustedWebSocketDebuggerUrl = trustedDebuggerUrl({
        raw: webSocketDebuggerUrl,
        expectedPort: port,
        expectedTargetId: id
      });
      if (trustedWebSocketDebuggerUrl == null) continue;
      targets.push({
        browserCdpPort: port,
        targetId: id,
        url: url2,
        webSocketDebuggerUrl: trustedWebSocketDebuggerUrl
      });
    }
    return { ok: true, targets };
  } catch (error42) {
    if (findSystemErrno(error42) === "ECONNREFUSED") return { ok: true, targets: [] };
    return { ok: false, error: error42 };
  }
}
async function listTargetsOnPort(port, item, fetchImpl) {
  const result = await listPageTargetsOnPort(port, fetchImpl);
  return result.ok ? {
    ok: true,
    targets: result.targets.filter(
      (target) => matchCredentialItemToSite(item, target.url) != null
    )
  } : result;
}
async function discoverMatchingTargets(item, windowIndex, reportFailure) {
  const ownPort = CDP_PORT_BASE + windowIndex;
  const own = await listTargetsOnPort(ownPort, item, fetch);
  if (!own.ok) {
    reportFailure("list-targets", own.error);
    return [];
  }
  if (own.targets.length > 0) return own.targets;
  const monitorPorts = await discoverMonitorPorts(reportFailure);
  if (!monitorPorts.ok) return [];
  const targetGroups = await asyncMapValues(
    monitorPorts.ports.filter((port) => port !== ownPort),
    (port) => listTargetsOnPort(port, item, fetch),
    { max: 8 }
  );
  return targetGroups.flatMap((result) => {
    if (result.ok) return result.targets;
    reportFailure("list-targets", result.error);
    return [];
  });
}
function partitionTargetsByWindow(targets, windowIndex) {
  const own = targets.filter(
    (target) => browserWindowIndexOfCdpPort(target.browserCdpPort) === windowIndex
  );
  return { own, elsewhere: own.length < targets.length };
}
async function discoverPageTargets(reportFailure) {
  const monitorPorts = await discoverMonitorPorts(reportFailure);
  if (!monitorPorts.ok) return { targets: [], complete: false };
  const targetGroups = await asyncMapValues(
    [...monitorPorts.ports],
    (port) => listPageTargetsOnPort(port, fetch),
    { max: 8 }
  );
  const targets = targetGroups.flatMap((result) => {
    if (result.ok) return result.targets;
    reportFailure("list-targets", result.error);
    return [];
  });
  return {
    targets,
    complete: targetGroups.every((result) => result.ok)
  };
}
async function evaluateOnTarget(target, expression) {
  return await cdpDeadline.run(
    (signal) => new Promise((resolve29, reject2) => {
      const socket = new WebSocket(target.webSocketDebuggerUrl);
      let settled = false;
      const abort = () => finish(new Error("CDP command timed out"));
      const finish = (error42, value) => {
        if (settled) return;
        settled = true;
        signal.removeEventListener("abort", abort);
        socket.close();
        if (error42 != null) reject2(error42);
        else resolve29(value);
      };
      signal.addEventListener("abort", abort, { once: true });
      socket.onopen = () => {
        socket.send(
          JSON.stringify({
            id: 1,
            method: "Runtime.evaluate",
            params: { expression, returnByValue: true, awaitPromise: true }
          })
        );
      };
      socket.onmessage = (event) => {
        if (typeof event.data !== "string") return;
        let message;
        try {
          message = JSON.parse(event.data);
        } catch (error42) {
          finish(new Error("CDP response was not valid JSON", { cause: error42 }));
          return;
        }
        const envelope = cdpMessageIdSchema.safeParse(message);
        if (!envelope.success || envelope.data.id !== 1) return;
        const parsed2 = cdpRuntimeResponseSchema.safeParse(message);
        if (!parsed2.success || parsed2.data.error !== void 0 || parsed2.data.result.exceptionDetails !== void 0) {
          finish(new Error("CDP command failed"));
          return;
        }
        finish(null, parsed2.data.result.result.value);
      };
      socket.onerror = () => finish(new Error("CDP connection failed"));
      socket.onclose = () => finish(new Error("CDP connection closed"));
    })
  );
}
function inspectBrowserDocument() {
  const inputs = [];
  const unownedControls = [];
  const visit2 = (root) => {
    inputs.push(...root.querySelectorAll("input"));
    for (const element of root.querySelectorAll("input, select, textarea")) {
      if ((element instanceof HTMLInputElement || element instanceof HTMLSelectElement || element instanceof HTMLTextAreaElement) && element.form === null) {
        unownedControls.push(element);
      }
    }
    for (const element of root.querySelectorAll("*")) {
      if (element.shadowRoot != null) visit2(element.shadowRoot);
    }
  };
  visit2(document);
  const composedParent = (element) => {
    if (element.parentElement !== null) return element.parentElement;
    const root = element.getRootNode();
    return root instanceof ShadowRoot ? root.host : null;
  };
  const owningForm = (input) => input.form;
  const labelsFor = (input) => input.labels === null ? [] : [...input.labels];
  const centerHitBelongsTo = (input, rect) => {
    const root = input.getRootNode();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    let hit;
    if (root instanceof ShadowRoot) {
      let documentBoundary = root.host;
      let boundaryRoot = documentBoundary.getRootNode();
      while (boundaryRoot instanceof ShadowRoot) {
        const boundaryHit = boundaryRoot.elementFromPoint(x, y);
        if (boundaryHit !== documentBoundary && boundaryHit !== input && (boundaryHit === null || !input.contains(boundaryHit))) {
          return false;
        }
        documentBoundary = boundaryRoot.host;
        boundaryRoot = documentBoundary.getRootNode();
      }
      const documentHit = input.ownerDocument.elementFromPoint(x, y);
      if (documentHit !== documentBoundary && documentHit !== input && (documentHit === null || !input.contains(documentHit))) {
        return false;
      }
      hit = root.elementFromPoint(x, y);
    } else {
      hit = input.ownerDocument.elementFromPoint(x, y);
    }
    if (hit === input || hit !== null && input.contains(hit)) return true;
    return labelsFor(input).some((label) => hit === label || hit !== null && label.contains(hit));
  };
  const elementAndAncestorsAreVisible = (input) => {
    if (input.getAttribute("aria-hidden") === "true") return false;
    let element = input;
    while (element !== null) {
      if (Element.prototype.hasAttribute.call(element, "hidden") || Element.prototype.hasAttribute.call(element, "inert")) {
        return false;
      }
      const style = getComputedStyle(element);
      const opacity = Number.parseFloat(style.opacity);
      if (style.display === "none" || style.visibility === "hidden" || style.visibility === "collapse" || element === input && style.pointerEvents === "none" || Number.isFinite(opacity) && opacity < 0.1 || style.clipPath === "inset(50%)" || style.clipPath === "inset(100%)" || style.clipPath === "circle(0px)") {
        return false;
      }
      element = composedParent(element);
    }
    return true;
  };
  const presentable = (input) => {
    if (!input.isConnected || Element.prototype.matches.call(input, ":disabled") || input.readOnly || input.getAttribute("aria-disabled") === "true" || !elementAndAncestorsAreVisible(input)) {
      return false;
    }
    const rect = input.getBoundingClientRect();
    return Number.isFinite(rect.left) && Number.isFinite(rect.top) && Number.isFinite(rect.right) && Number.isFinite(rect.bottom) && rect.width >= 8 && rect.height >= 8;
  };
  const eligible = (input) => {
    if (!presentable(input)) return false;
    const rect = input.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    if (x < 0 || y < 0 || x >= globalThis.innerWidth || y >= globalThis.innerHeight) {
      return false;
    }
    return centerHitBelongsTo(input, rect);
  };
  const revealed = window.__sandCredentialInspectRevealed instanceof WeakSet ? window.__sandCredentialInspectRevealed : window.__sandCredentialInspectRevealed = /* @__PURE__ */ new WeakSet();
  const revealedOnceIsEligible = (input) => {
    if (revealed.has(input)) return eligible(input);
    revealed.add(input);
    const scrollIntoView = Element.prototype.scrollIntoView;
    if (typeof scrollIntoView !== "function") return false;
    scrollIntoView.call(input, { block: "nearest", inline: "nearest" });
    return eligible(input);
  };
  const inViewPasswords = inputs.filter(
    (input) => input.type.toLowerCase() === "password" && eligible(input)
  );
  const presentablePasswords = inputs.filter(
    (input) => input.type.toLowerCase() === "password" && presentable(input)
  );
  const onlyOffscreenPassword = inViewPasswords.length === 0 && presentablePasswords.length === 1 ? presentablePasswords[0] : void 0;
  const passwords = onlyOffscreenPassword !== void 0 && revealedOnceIsEligible(onlyOffscreenPassword) ? [onlyOffscreenPassword] : inViewPasswords;
  const autocompleteTokens = (input) => (input.getAttribute("autocomplete") ?? "").toLowerCase().split(/\s+/).filter((token) => token.length > 0);
  const descriptorFor = (input) => {
    const text2 = [
      input.name,
      input.id,
      input.getAttribute("aria-label") ?? "",
      input.placeholder,
      ...labelsFor(input).map((label) => label.textContent ?? "")
    ];
    const labelledBy = (input.getAttribute("aria-labelledby") ?? "").split(/\s+/);
    const root = input.getRootNode();
    for (const id of labelledBy) {
      if (id.length === 0) continue;
      const label = root instanceof ShadowRoot ? root.getElementById(id) : input.ownerDocument.getElementById(id);
      if (label !== null) text2.push(label.textContent ?? "");
    }
    return text2.join(" ").toLowerCase();
  };
  const usernameScore = (input, positions) => {
    const tokens = autocompleteTokens(input);
    let score2 = 0;
    if (tokens.includes("username")) score2 += 1e3;
    else if (tokens.includes("email")) score2 += 800;
    if (input.type.toLowerCase() === "email") score2 += 500;
    if (input.type.toLowerCase() === "tel") score2 += 250;
    if (/(?:^|\W)(?:user(?:name|[\s_-]*id)?|e[\s_-]*mail|login)(?:\W|$)/i.test(descriptorFor(input))) {
      score2 += 400;
    }
    if (positions.inputIndex < positions.passwordIndex) score2 += 100;
    return score2;
  };
  const resolveUsername = (password, form, isEligible) => {
    const passwordIndex = password === null ? inputs.length : inputs.indexOf(password);
    const ranked = inputs.filter((input) => {
      const type2 = input.type.toLowerCase();
      return (type2 === "text" || type2 === "email" || type2 === "tel" || type2 === "search") && (form === void 0 || owningForm(input) === form) && isEligible(input);
    }).map((input) => ({
      input,
      score: usernameScore(input, {
        inputIndex: inputs.indexOf(input),
        passwordIndex
      })
    })).filter((candidate) => candidate.score >= 400).sort((left, right) => right.score - left.score);
    const best = ranked[0];
    if (best === void 0) return { kind: "missing" };
    if (ranked[1]?.score === best.score) return { kind: "ambiguous" };
    return { kind: "found", input: best.input };
  };
  const accountSetupPath = /(?:^|[/_-])(?:register|signup|sign-up|create-account|forgot-password|forgotpassword|password-reset|reset-password|recover-password|password-recovery)(?:[/_-]|$)/i.test(
    location.pathname
  );
  const usernameLike = (input) => {
    const type2 = input.type.toLowerCase();
    if (type2 !== "text" && type2 !== "email" && type2 !== "tel" && type2 !== "search") return false;
    const tokens = autocompleteTokens(input);
    return tokens.includes("username") || tokens.includes("email") || type2 === "email" || /(?:^|\W)(?:user(?:name|[\s_-]*id)?|e[\s_-]*mail|login)(?:\W|$)/i.test(descriptorFor(input));
  };
  const oneTimeCodeTypeAllowed = (input) => {
    const type2 = input.type.toLowerCase();
    return type2 === "text" || type2 === "tel" || type2 === "number";
  };
  const numericEntryHinted = (input) => {
    const type2 = input.type.toLowerCase();
    const inputMode = (input.getAttribute("inputmode") ?? "").toLowerCase();
    return type2 === "tel" || type2 === "number" || inputMode === "numeric" || inputMode === "tel" || inputMode === "decimal" || /\\d|\[0-9\]/.test(input.getAttribute("pattern") ?? "");
  };
  const ONE_TIME_CODE_MIN_LENGTH = 5;
  const describesPaymentCard = (descriptor2) => /(?:^|[^a-z])(?:cvv|cvc|cvn|csc|card|credit|debit|payment|expir\w*)(?:[^a-z]|$)/.test(
    descriptor2
  );
  const describesAnotherKindOfCode = (descriptor2) => describesPaymentCard(descriptor2) || /(?:^|[^a-z])(?:zip|postal|post|country|area|region|dial(?:l?ing)?|pin|promo(?:tion(?:al)?)?|coupon|discount|voucher|gift|referr?al|invite|invitation|sort|swift|iban|bank|routing|tax|company|employer|product|item|sku|bar|qr)(?:[^a-z]|$)/.test(
    descriptor2
  );
  const describesOneTimeCode = (text2) => /(?:^|[^a-z])(?:(?:totp|otp|2fa|mfa|one[\s_-]*time[\s_-]*(?:code|pin|pass(?:word|code))|two[\s_-]*factor|multi[\s_-]*factor|authenticator|passcode)(?:[\s_-]*(?:code|token|input|field|digits?))?|(?:verification|verify|security|auth(?:entication)?|confirmation)[\s_-]*code)(?:[^a-z]|$)/.test(
    text2
  );
  const mentionsCode = (text2) => /(?:^|[^a-z])code(?:[^a-z]|$)/.test(text2);
  const describesPaymentCardCodePhrase = (text2) => /(?:^|[^a-z])(?:cvv|cvc|cvn|csc|(?:card|credit|debit|payment)[\s_-]*(?:security[\s_-]*|verification[\s_-]*)?codes?)(?:[^a-z]|$)/.test(
    text2
  );
  const describesAnotherKindOfCodePhrase = (text2) => describesPaymentCardCodePhrase(text2) || /(?:^|[^a-z])(?:zip|postal|post|country|area|region|dial(?:l?ing)?|pin|promo(?:tion(?:al)?)?|coupon|discount|voucher|gift(?:[\s_-]*card)?|referr?al|invite|invitation|sort|swift|iban|bank|routing|tax|company|employer|product|item|sku|bar|qr)[\s_-]*codes?(?:[^a-z]|$)/.test(
    text2
  );
  const formCollectsPaymentCard = (form) => form !== null && inputs.some(
    (input) => owningForm(input) === form && (autocompleteTokens(input).some((token) => token.startsWith("cc-")) || /(?:^|[^a-z])(?:card[\s_-]*number|cc[\s_-]*num|cvv|cvc|cvn|csc|expir\w*)(?:[^a-z]|$)/.test(
      descriptorFor(input)
    ))
  );
  const oneTimeCodeScore = (input) => {
    if (!oneTimeCodeTypeAllowed(input)) return 0;
    const tokens = autocompleteTokens(input);
    const maxLength = input.maxLength;
    if (tokens.includes("username") || tokens.includes("email") || tokens.includes("current-password") || tokens.includes("new-password") || tokens.some((token) => token.startsWith("cc-")) || maxLength > 0 && maxLength < ONE_TIME_CODE_MIN_LENGTH) {
      return 0;
    }
    if (tokens.includes("one-time-code")) return 1e3;
    const descriptor2 = descriptorFor(input);
    if (describesPaymentCard(descriptor2) || formCollectsPaymentCard(owningForm(input))) return 0;
    if (describesOneTimeCode(descriptor2)) return 600;
    if (!describesAnotherKindOfCode(descriptor2) && mentionsCode(descriptor2) && (numericEntryHinted(input) || maxLength >= ONE_TIME_CODE_MIN_LENGTH && maxLength <= 10)) {
      return 400;
    }
    return 0;
  };
  const GROUP_CONTEXT_HOPS = 3;
  const GROUP_CONTEXT_TEXT_LIMIT = 4e3;
  const composedContains = (ancestor, node) => {
    for (let current = node; current !== null; current = composedParent(current)) {
      if (current === ancestor) return true;
    }
    return false;
  };
  const contextTextOf = (container) => [container.textContent ?? "", container.shadowRoot?.textContent ?? ""].join(" ").slice(0, GROUP_CONTEXT_TEXT_LIMIT).toLowerCase();
  const splitDigitGroupSignal = (boxes) => {
    if (boxes.some((box) => autocompleteTokens(box).includes("one-time-code"))) return "strong";
    const firstBox = boxes[0];
    const lastBox = boxes[boxes.length - 1];
    if (firstBox === void 0 || lastBox === void 0) return null;
    let container = composedParent(firstBox);
    while (container !== null && !composedContains(container, lastBox)) {
      container = composedParent(container);
    }
    const contexts = [];
    for (let hop = 0; container !== null && hop <= GROUP_CONTEXT_HOPS; hop += 1) {
      contexts.push(contextTextOf(container));
      if (container === document.body) break;
      container = composedParent(container);
    }
    const descriptors = boxes.map(descriptorFor).join(" ");
    if (describesOneTimeCode(descriptors)) return "strong";
    const boxesNameAnotherKindOfCode = describesAnotherKindOfCode(descriptors);
    let weak = mentionsCode(descriptors);
    for (const context2 of contexts) {
      if (describesPaymentCardCodePhrase(context2)) return null;
      if (describesOneTimeCode(context2)) return "strong";
      if (describesAnotherKindOfCodePhrase(context2)) return null;
      if (mentionsCode(context2)) weak = true;
    }
    return weak && !boxesNameAnotherKindOfCode ? "weak" : null;
  };
  const splitDigitGroupShape = (isEligible) => {
    const boxes = inputs.filter(
      (input) => oneTimeCodeTypeAllowed(input) && input.maxLength === 1 && isEligible(input) && !describesPaymentCard(descriptorFor(input))
    );
    const firstBox = boxes[0];
    const lastBox = boxes[boxes.length - 1];
    if (boxes.length < 4 || boxes.length > 10 || firstBox === void 0 || lastBox === void 0 || boxes.some((box) => owningForm(box) !== owningForm(firstBox)) || formCollectsPaymentCard(owningForm(firstBox))) {
      return null;
    }
    const interleaved = inputs.slice(inputs.indexOf(firstBox), inputs.indexOf(lastBox) + 1).some(
      (input) => !boxes.includes(input) && oneTimeCodeTypeAllowed(input) && isEligible(input)
    );
    return interleaved ? null : splitDigitGroupSignal(boxes);
  };
  const rankedOneTimeCodeControls = (isEligible) => inputs.filter((input) => input.maxLength !== 1 && isEligible(input)).map((input) => ({ input, score: oneTimeCodeScore(input) })).filter((candidate) => candidate.score >= 400).sort((left, right) => right.score - left.score);
  const oneTimeCodeShape = () => {
    const ranked = rankedOneTimeCodeControls(eligible);
    const best = ranked[0];
    if (best !== void 0 && ranked[1]?.score !== best.score) {
      return best.score >= 600 ? "strong" : "weak";
    }
    if (best === void 0) {
      const group = splitDigitGroupShape(eligible);
      if (group !== null) return group;
    }
    if (best !== void 0) return null;
    const presentableControls = rankedOneTimeCodeControls(presentable);
    const onlyOffscreen = presentableControls.length === 1 ? presentableControls[0] : void 0;
    if (onlyOffscreen === void 0 || !revealedOnceIsEligible(onlyOffscreen.input)) return null;
    return onlyOffscreen.score >= 600 ? "strong" : "weak";
  };
  const onlyPassword = passwords[0];
  const newPassword = passwords.length === 1 && onlyPassword !== void 0 && autocompleteTokens(onlyPassword).includes("new-password");
  const passwordForm = onlyPassword === void 0 ? null : owningForm(onlyPassword);
  const eligibleUsername = onlyPassword === void 0 ? { kind: "missing" } : resolveUsername(onlyPassword, passwordForm, eligible);
  const isLockedIdentityControl = (input) => (Element.prototype.matches.call(input, ":disabled") || input.readOnly || input.getAttribute("aria-disabled") === "true") && input.value.trim().length > 0;
  const anyUsername = onlyPassword === void 0 ? { kind: "missing" } : resolveUsername(onlyPassword, passwordForm, (input) => !isLockedIdentityControl(input));
  const usernameFillable = eligibleUsername.kind === "found" || eligibleUsername.kind === "missing" && anyUsername.kind === "missing";
  const passwordControlVisible = inputs.some(
    (input) => input.type.toLowerCase() === "password" && elementAndAncestorsAreVisible(input)
  );
  const inViewUsernameOnly = resolveUsername(null, void 0, eligible);
  const offscreenUsernameOnly = !passwordControlVisible && inViewUsernameOnly.kind === "missing" ? resolveUsername(null, void 0, presentable) : null;
  const usernameOnly = offscreenUsernameOnly?.kind === "found" && revealedOnceIsEligible(offscreenUsernameOnly.input) ? offscreenUsernameOnly : inViewUsernameOnly;
  const username = inputs.some((input) => usernameLike(input) && eligible(input));
  const usernameFirstShaped = !passwordControlVisible && usernameOnly.kind === "found";
  const loginShaped = passwords.length === 1 && !newPassword && usernameFillable;
  const oneTimeCode = passwordControlVisible || loginShaped ? null : oneTimeCodeShape();
  const formControls = (form) => {
    if (form === null) return unownedControls.filter(elementAndAncestorsAreVisible);
    const getter = Object.getOwnPropertyDescriptor(HTMLFormElement.prototype, "elements")?.get;
    const elements = typeof getter === "function" ? getter.call(form) : null;
    return elements instanceof HTMLFormControlsCollection ? [...elements] : [];
  };
  const loginFormIsSubmittable = (form, controlsToFill) => {
    if (form !== null && Element.prototype.hasAttribute.call(form, "novalidate")) return true;
    return formControls(form).every(
      (element) => !(element instanceof HTMLInputElement || element instanceof HTMLSelectElement || element instanceof HTMLTextAreaElement) || controlsToFill.includes(element) || !element.willValidate || element.validity.valid
    );
  };
  const looksLikeOneTimeCodeControl = (input) => oneTimeCodeScore(input) >= 600 || oneTimeCodeTypeAllowed(input) && input.maxLength === 1 && !describesPaymentCard(descriptorFor(input));
  const loginSubmittable = loginShaped && onlyPassword !== void 0 && loginFormIsSubmittable(passwordForm, [
    eligibleUsername.kind === "found" ? eligibleUsername.input : null,
    onlyPassword,
    ...inputs.filter(looksLikeOneTimeCodeControl)
  ]);
  let formKind = "none";
  if (accountSetupPath || newPassword) {
    formKind = "signup-or-reset";
  } else if (loginShaped) {
    formKind = loginSubmittable ? "login" : "unsubmittable-login";
  } else if (oneTimeCode === "strong") {
    formKind = "one-time-code";
  } else if (usernameFirstShaped && username) {
    formKind = "username-first";
  } else if (oneTimeCode === "weak") {
    formKind = "one-time-code";
  }
  const auditElements = inputs.slice(0, 8).map((input) => {
    const form = input.form;
    const action = form === null ? null : Element.prototype.getAttribute.call(form, "action");
    const actionParser = document.createElement("a");
    if (form !== null) {
      actionParser.href = action === null || action.length === 0 ? location.href : action;
    }
    const method = form === null ? null : Element.prototype.getAttribute.call(form, "method");
    const ariaLabel = input.getAttribute("aria-label");
    const autocomplete = input.getAttribute("autocomplete");
    return {
      tag: input.tagName.toLowerCase(),
      ...input.type.length > 0 ? { type: input.type } : {},
      ...input.name.length > 0 ? { name: input.name } : {},
      ...input.id.length > 0 ? { id: input.id } : {},
      ...autocomplete !== null && autocomplete.length > 0 ? { autocomplete } : {},
      ...ariaLabel !== null && ariaLabel.length > 0 ? { ariaLabel } : {},
      ...form !== null ? { formActionOrigin: actionParser.origin } : {},
      ...method !== null && method.length > 0 ? { formMethod: method } : {}
    };
  });
  return {
    hasFocus: document.hasFocus(),
    formKind,
    documentTimeOriginMs: performance.timeOrigin,
    audit: {
      targetUrl: location.href,
      elements: auditElements
    }
  };
}
async function inspectTarget(target, reportFailure) {
  let value;
  try {
    value = await evaluateOnTarget(target, `(${inspectBrowserDocument.toString()})()`);
  } catch (error42) {
    reportFailure("inspect-target", error42);
    return null;
  }
  const parsed2 = browserPageStateSchema.safeParse(value);
  return parsed2.success ? parsed2.data : null;
}
function hostFromSite(raw) {
  const value = raw.trim();
  if (value.length === 0) return null;
  const candidate = value.includes("://") ? value : `https://${value}`;
  return URL.canParse(candidate) ? new URL(candidate).host.toLowerCase() : null;
}
function normalizedCredentialPathname(pathname) {
  return pathname.length > 1 ? pathname.replace(/\/+$/, "") || "/" : pathname;
}
function filledWhatFor(request5) {
  return request5.username == null || request5.username.trim().length === 0 ? "the saved password" : "the saved login";
}
function unconfirmedSubmitDetail(request5, host) {
  return `Filled ${filledWhatFor(request5)} in ${host} and submitted it, but the page kept the sign-in form up, which async logins do while the request is in flight. Continue with a computerUse subagent to check whether the sign-in went through before doing anything else; if it is still on the sign-in form, use request_box_help rather than requesting this credential again.`;
}
function trustedBrowserOrigin(raw) {
  const value = raw.trim();
  if (value.length === 0) return null;
  const candidate = value.includes("://") ? value : `https://${value}`;
  if (!URL.canParse(candidate)) return null;
  const url2 = new URL(candidate);
  const host = url2.hostname.toLowerCase();
  if (url2.protocol !== "https:" && !(url2.protocol === "http:" && isLoopbackHost3(host))) {
    return null;
  }
  return url2.origin.toLowerCase();
}
async function chooseBrowserCredentialTarget(targets, targetSite, inspect) {
  if (targets.length === 0) return null;
  if (targets.length === 1) return targets[0];
  const hintedOrigin = trustedBrowserOrigin(targetSite);
  const sameOrigin = targets.filter((target) => trustedBrowserOrigin(target.url) === hintedOrigin);
  if (sameOrigin.length === 1) return sameOrigin[0];
  const states = await asyncMapValues(
    sameOrigin.length === 0 ? [...targets] : [...sameOrigin],
    async (target) => ({
      target,
      state: await inspect(target)
    }),
    { max: 8 }
  );
  const focused = states.filter((candidate) => candidate.state?.hasFocus === true);
  return focused.length === 1 ? focused[0].target : null;
}
function clearanceOf(result) {
  return result.cleared ? { cleared: true } : { cleared: false, clearTarget: result.clearTarget };
}
function credentialFillFailureDetail(result) {
  if (result.kind === "unavailable") {
    return "The matching browser page closed or stopped responding. Reopen the sign-in page and try again.";
  }
  switch (result.reason) {
    case "signup-or-reset-page":
      return "This looks like a sign-up or password-reset page, not a sign-in page. Open the sign-in page and try again.";
    case "invalid-request":
      return "The matching page address is not eligible for secure credential filling.";
    case "origin-mismatch":
    case "frame-mismatch":
      return "The matching page navigated away from the approved address. Open the sign-in page and try again.";
    case "frame-not-active":
      return "The matching sign-in page is not active. Focus the intended page and try again.";
    case "password-field-count":
      return "The matching page does not have exactly one eligible password field. Open the sign-in form and try again.";
    case "password-field-ineligible":
      return "The matching page does not have an eligible current-password field. Open the sign-in form and try again.";
    case "username-field-missing":
    case "username-field-ambiguous":
      return "The matching page does not have one unambiguous username field. Open the sign-in form and try again.";
    case "one-time-code-field-missing":
    case "one-time-code-field-ambiguous":
      return "The matching page does not have one unambiguous one-time code field. Open the verification step and try again.";
    case "form-action-mismatch":
      return "The matching form sends credentials to an address outside this login's approved sites.";
    case "form-not-submittable":
      return "The matching sign-in form cannot be submitted automatically because another required field is empty, so nothing was filled. Hand the user the screen with request_box_help to finish signing in; never ask them to type or paste a password.";
    case "identity-changed":
      return "The matching sign-in form changed while it was being filled. Check the page and try again.";
    case "unsupported-page":
      return "The matching sign-in form does not support secure filling.";
    case "submit-failed":
      return "The matching sign-in form could not be submitted safely, so the filled values were cleared. Hand the user the screen with request_box_help to finish signing in; never ask them to type or paste a password.";
    default:
      return result.reason;
  }
}
function credentialFillAuditResult(result) {
  const inForm = result.inForm === void 0 ? {} : { inForm: result.inForm };
  if (result.kind === "filled") {
    return {
      outcome: "success",
      reason: result.submitted ? "filled" : "filled-without-submit",
      ...inForm
    };
  }
  if (result.kind === "unavailable") {
    return { outcome: "failed", reason: "page-unavailable", ...inForm };
  }
  const refused2 = (reason) => ({
    outcome: "refused",
    reason,
    fillRefusalReason: result.reason,
    ...inForm
  });
  switch (result.reason) {
    case "invalid-request":
      return refused2("invalid-target-url");
    case "origin-mismatch":
    case "frame-mismatch":
      return refused2("target-changed");
    case "signup-or-reset-page":
      return refused2("signup-or-reset-page");
    case "password-field-count":
    case "password-field-ineligible":
    case "username-field-missing":
    case "username-field-ambiguous":
      return refused2("no-login-fields");
    case "one-time-code-field-missing":
    case "one-time-code-field-ambiguous":
      return refused2("no-one-time-code-field");
    case "unsupported-page":
      return refused2("unsupported-page");
    case "frame-not-active":
    case "form-action-mismatch":
    case "identity-changed":
      return refused2("fill-refused");
    case "form-not-submittable":
      return refused2("form-not-submittable");
    case "submit-failed":
      return {
        outcome: "failed",
        reason: "submit-failed",
        fillRefusalReason: result.reason,
        ...inForm
      };
    default:
      return result.reason;
  }
}
var BrowserCredentialFiller = class {
  cdpOperations = /* @__PURE__ */ new Map();
  discoverPages;
  discoverTargets;
  inspectTarget;
  executeFill;
  audit;
  constructor(options2) {
    const reportFailure = options2.reportFailure ?? (() => void 0);
    this.discoverPages = options2.discoverPages ?? (() => discoverPageTargets(reportFailure));
    this.discoverTargets = options2.discoverTargets ?? ((item, windowIndex) => discoverMatchingTargets(item, windowIndex, reportFailure));
    const runInspection = options2.inspectTarget ?? ((target) => inspectTarget(target, reportFailure));
    this.inspectTarget = (target) => this.enqueueCdpOperation(target, () => runInspection(target));
    this.executeFill = (request5) => this.enqueueCdpOperation(request5, () => options2.executeFill(request5));
    this.audit = options2.audit ?? (() => void 0);
  }
  async enqueueCdpOperation(target, operation) {
    const key = JSON.stringify([target.browserCdpPort, target.targetId]);
    let entry = this.cdpOperations.get(key);
    if (entry === void 0) {
      entry = { queue: new PromiseQueue({ max: 1 }), pending: 0 };
      this.cdpOperations.set(key, entry);
    }
    entry.pending += 1;
    try {
      return await entry.queue.enqueue(operation);
    } finally {
      entry.pending -= 1;
      if (entry.pending === 0 && this.cdpOperations.get(key) === entry) {
        this.cdpOperations.delete(key);
      }
    }
  }
  async listPages() {
    return await this.discoverPages();
  }
  async inspect(target) {
    return await this.inspectTarget(target);
  }
  auditFill(args) {
    const { request: request5 } = args;
    const sensitiveValues = "password" in request5 ? [request5.username, request5.password, request5.oneTimeCode] : [request5.oneTimeCode];
    this.audit(
      {
        event: args.event,
        operation: args.operation ?? ("password" in request5 ? "browser-fill" : "browser-one-time-code-fill"),
        outcome: args.outcome,
        reason: args.reason,
        fillRefusalReason: args.fillRefusalReason,
        inForm: args.inForm,
        targetUrl: args.targetUrl,
        credentialId: request5.item.credentialId,
        elements: args.elements ?? [],
        submitRequested: true,
        approvalMode: args.event === "auto-fill" ? "always-allow" : "allow-once"
      },
      sensitiveValues.filter((value) => value !== void 0)
    );
  }
  async fillSelectedTarget(targetWebSocketDebuggerUrl, request5, event = "allow-once", options2 = {}) {
    const operation = options2.operation ?? "browser-fill";
    const discovery = await this.listPages();
    const target = discovery.targets.find(
      (candidate) => candidate.webSocketDebuggerUrl === targetWebSocketDebuggerUrl
    );
    if (target == null) {
      this.auditFill({
        event,
        request: request5,
        operation,
        outcome: "refused",
        reason: "target-closed",
        targetUrl: request5.targetSite
      });
      return {
        filled: false,
        detail: "the inspected browser page is no longer open",
        cleared: true
      };
    }
    if (trustedBrowserOrigin(target.url) !== trustedBrowserOrigin(request5.targetSite) || matchCredentialItemToSite(request5.item, target.url) == null) {
      this.auditFill({
        event,
        request: request5,
        operation,
        outcome: "refused",
        reason: "target-changed",
        targetUrl: target.url
      });
      return {
        filled: false,
        detail: "the inspected browser page navigated away from the approved address",
        cleared: true
      };
    }
    const execution = await this.executeTargetFill(target, request5, options2.steps);
    const audit = credentialFillAuditResult(execution.result);
    this.auditFill({
      event,
      request: request5,
      operation,
      ...audit,
      targetUrl: execution.audit?.targetUrl ?? target.url,
      elements: execution.audit?.elements
    });
    const { result } = execution;
    if (result.kind !== "filled") {
      return { filled: false, detail: credentialFillFailureDetail(result), ...clearanceOf(result) };
    }
    return {
      filled: true,
      submitted: result.submitted,
      target,
      ...stepOf(execution),
      ...result.submitConfirmed === false ? {
        detail: unconfirmedSubmitDetail(
          request5,
          hostFromSite(target.url) ?? "the sign-in page"
        )
      } : {},
      ...clearanceOf(result)
    };
  }
  async fillOneTimeCodeOnTarget(targetWebSocketDebuggerUrl, request5, event) {
    const discovery = await this.listPages();
    const target = discovery.targets.find(
      (candidate) => candidate.webSocketDebuggerUrl === targetWebSocketDebuggerUrl
    );
    if (target == null) {
      this.auditFill({
        event,
        request: request5,
        outcome: "refused",
        reason: "target-closed",
        targetUrl: request5.targetSite
      });
      return { filled: false, detail: "the verification page is no longer open", cleared: true };
    }
    const expectedOrigin = trustedBrowserOrigin(target.url);
    if (expectedOrigin == null || expectedOrigin !== trustedBrowserOrigin(request5.targetSite) || matchCredentialItemToSite(request5.item, target.url) == null) {
      this.auditFill({
        event,
        request: request5,
        outcome: "refused",
        reason: "target-changed",
        targetUrl: target.url
      });
      return {
        filled: false,
        detail: "the verification page navigated away from the approved address",
        cleared: true
      };
    }
    const state = await this.inspectTarget(target);
    if (state === null) {
      this.auditFill({
        event,
        request: request5,
        outcome: "failed",
        reason: "page-unavailable",
        targetUrl: target.url
      });
      return {
        filled: false,
        detail: credentialFillFailureDetail({ kind: "unavailable", cleared: true }),
        cleared: true
      };
    }
    const liveUrl = state.audit?.targetUrl ?? target.url;
    const livePage = URL.canParse(liveUrl) ? new URL(liveUrl) : null;
    if (livePage == null || trustedBrowserOrigin(liveUrl) !== expectedOrigin || matchCredentialItemToSite(request5.item, liveUrl) == null) {
      this.auditFill({
        event,
        request: request5,
        outcome: "refused",
        reason: "target-changed",
        targetUrl: liveUrl
      });
      return {
        filled: false,
        detail: "the verification page navigated away from the approved address",
        cleared: true
      };
    }
    if (state.formKind !== "one-time-code") {
      this.auditFill({
        event,
        request: request5,
        outcome: "refused",
        reason: "no-one-time-code-field",
        targetUrl: liveUrl,
        elements: state.audit?.elements
      });
      return {
        filled: false,
        detail: credentialFillFailureDetail({
          kind: "refused",
          reason: "one-time-code-field-missing",
          cleared: true
        }),
        cleared: true
      };
    }
    const result = await this.executeFill({
      browserCdpPort: target.browserCdpPort,
      targetId: target.targetId,
      expectedOrigin,
      expectedPathname: normalizedCredentialPathname(livePage.pathname),
      allowedFormActionOrigins: allowedFormActionOriginsFor(request5.item, expectedOrigin),
      step: "one-time-code",
      oneTimeCode: request5.oneTimeCode,
      submit: true
    });
    this.auditFill({
      event,
      request: request5,
      ...credentialFillAuditResult(result),
      targetUrl: liveUrl,
      elements: state.audit?.elements
    });
    if (result.kind !== "filled") {
      return { filled: false, detail: credentialFillFailureDetail(result), ...clearanceOf(result) };
    }
    const host = hostFromSite(liveUrl);
    return {
      filled: true,
      ...clearanceOf(result),
      submitted: result.submitted,
      step: "one-time-code",
      target,
      detail: result.submitted ? `Filled the one-time code in ${host ?? "the verification page"}.` : `Filled the one-time code in ${host ?? "the verification page"} but did not submit it because the form does not POST. Submit the verification form to continue.`
    };
  }
  async resolveTarget(item, siteHint, windowIndex) {
    if (windowIndex === void 0) {
      return {
        ok: false,
        reason: "target-window-unknown",
        detail: "This agent's own browser window could not be determined, so no browser page was matched. Open the sign-in page with computerUse in this agent's window and try again."
      };
    }
    const { own: targets, elsewhere } = partitionTargetsByWindow(
      await this.discoverTargets(item, windowIndex),
      windowIndex
    );
    if (targets.length === 0) {
      return elsewhere ? {
        ok: false,
        reason: "target-page-in-other-window",
        detail: "No open HTTPS browser page in this agent's own browser window matches this credential's 1Password hostname rules. A matching page is open in another browser window, which this agent cannot use. Open the sign-in page in this agent's own window and try again."
      } : {
        ok: false,
        reason: "target-no-matching-page",
        detail: "No open HTTPS browser page in this agent's browser window matches this credential's 1Password hostname rules. Open the sign-in page and try again."
      };
    }
    const inspected = await asyncMapValues(
      [...targets],
      async (target2) => ({
        target: target2,
        state: await this.inspectTarget(target2)
      }),
      { max: 8 }
    );
    const eligible = inspected.filter(
      (candidate) => candidate.state?.formKind === "login" || candidate.state?.formKind === "username-first"
    );
    if (eligible.length === 0) {
      const onlySignupOrReset = inspected.every(
        (candidate) => candidate.state?.formKind === "signup-or-reset"
      );
      const unsubmittable = inspected.some(
        (candidate) => candidate.state?.formKind === "unsubmittable-login"
      );
      if (onlySignupOrReset) {
        return {
          ok: false,
          reason: "signup-or-reset-page",
          detail: "The matching page is a sign-up or password-reset form, not a sign-in form. Open the sign-in page and try again."
        };
      }
      if (unsubmittable) {
        return {
          ok: false,
          reason: "form-not-submittable",
          detail: credentialFillFailureDetail({
            kind: "refused",
            reason: "form-not-submittable",
            cleared: true
          })
        };
      }
      return {
        ok: false,
        reason: "target-no-login-form",
        detail: "The matching page does not have a complete sign-in form with an eligible password field. Open the password step and try again."
      };
    }
    const states = new Map(inspected.map((candidate) => [candidate.target, candidate.state]));
    const target = await chooseBrowserCredentialTarget(
      eligible.map((candidate) => candidate.target),
      siteHint,
      async (candidate) => states.get(candidate) ?? null
    );
    if (target == null) {
      return {
        ok: false,
        reason: "target-ambiguous",
        detail: "More than one matching browser page is open in this agent's browser window. Focus the intended sign-in page and try again."
      };
    }
    const targetOrigin = trustedBrowserOrigin(target.url);
    return targetOrigin == null ? {
      ok: false,
      reason: "target-invalid-origin",
      detail: "The matching browser page has an invalid address. Reopen the sign-in page and try again."
    } : {
      ok: true,
      targetSite: targetOrigin,
      targetWebSocketDebuggerUrl: target.webSocketDebuggerUrl
    };
  }
  async fill(request5, windowIndex, event = "allow-once") {
    const picked = await this.pickFillTarget(request5, windowIndex, event);
    return picked.ok ? await this.fillPickedTarget(picked.target, request5, event) : picked.result;
  }
  async pickFillTarget(request5, windowIndex, event = "allow-once") {
    const refuse2 = (reason, detail) => {
      this.auditFill({
        event,
        request: request5,
        outcome: "refused",
        reason,
        targetUrl: request5.targetSite
      });
      return { ok: false, result: { filled: false, detail, cleared: true } };
    };
    const requestedOrigin = trustedBrowserOrigin(request5.targetSite);
    const requestedHost = hostFromSite(request5.targetSite);
    if (requestedOrigin == null || requestedHost == null) {
      return refuse2("invalid-target-url", "the requested login URL is invalid");
    }
    if (windowIndex === void 0) {
      return refuse2(
        "window-unknown",
        "this agent's own browser window could not be determined, so nothing was filled"
      );
    }
    const atRequestedSite = (target2) => trustedBrowserOrigin(target2.url) === requestedOrigin && hostFromSite(target2.url) === requestedHost;
    const { own: targets, elsewhere } = partitionTargetsByWindow(
      (await this.discoverTargets(request5.item, windowIndex)).filter(atRequestedSite),
      windowIndex
    );
    if (targets.length === 0) {
      return elsewhere ? refuse2(
        "page-in-other-window",
        "the matching browser page is open in another browser window, not in this agent's own window; open the login page in this agent's window and try again"
      ) : refuse2(
        "no-matching-page",
        "no open HTTPS browser page in this agent's browser window at the requested host matches this item's 1Password website rules"
      );
    }
    const target = await chooseBrowserCredentialTarget(
      targets,
      request5.targetSite,
      this.inspectTarget
    );
    if (target == null) {
      return refuse2(
        "ambiguous-page",
        "more than one matching browser page is open in this agent's browser window; focus the intended login page and try again"
      );
    }
    return { ok: true, target };
  }
  async fillPickedTarget(target, request5, event = "allow-once") {
    const execution = await this.executeTargetFill(target, request5);
    const audit = credentialFillAuditResult(execution.result);
    this.auditFill({
      event,
      request: request5,
      ...audit,
      targetUrl: execution.audit?.targetUrl ?? target.url,
      elements: execution.audit?.elements
    });
    const { result } = execution;
    const clearance = clearanceOf(result);
    if (result.kind !== "filled") {
      return {
        filled: false,
        detail: credentialFillFailureDetail(result),
        ...clearance
      };
    }
    const host = hostFromSite(target.url);
    if (host == null) {
      return { filled: false, detail: "the requested login URL is invalid", ...clearance };
    }
    const filled = { filled: true, submitted: result.submitted, target, ...stepOf(execution) };
    if (execution.step === "username-first") return { ...filled, ...clearance };
    const filledWhat = filledWhatFor(request5);
    let detail;
    if (result.submitConfirmed === false) {
      detail = unconfirmedSubmitDetail(request5, host);
    } else if (result.submitted) {
      detail = `Filled ${filledWhat} in ${host}.`;
    } else {
      detail = `Filled ${filledWhat} in ${host} but did not submit it because the page did not take the submit over and the form does not POST. Submit the sign-in form to continue.`;
    }
    return { ...filled, detail, ...clearance };
  }
  async executeTargetFill(target, request5, steps = ["login", "username-first"]) {
    const targetUrl = URL.canParse(target.url) ? new URL(target.url) : null;
    const expectedOrigin = trustedBrowserOrigin(target.url);
    if (targetUrl == null || expectedOrigin == null || expectedOrigin !== trustedBrowserOrigin(request5.targetSite) || matchCredentialItemToSite(request5.item, target.url) == null) {
      return { result: { kind: "refused", reason: "origin-mismatch", cleared: true } };
    }
    const state = await this.inspectTarget(target);
    if (state === null) return { result: { kind: "unavailable", cleared: true } };
    if (state.formKind === "signup-or-reset") {
      return {
        result: { kind: "refused", reason: "signup-or-reset-page", cleared: true },
        audit: state.audit
      };
    }
    if (state.formKind === "unsubmittable-login") {
      return {
        result: { kind: "refused", reason: "form-not-submittable", cleared: true },
        audit: state.audit
      };
    }
    if (state.formKind !== "login" && state.formKind !== "username-first" || !steps.includes(state.formKind)) {
      return {
        result: { kind: "refused", reason: "password-field-ineligible", cleared: true },
        audit: state.audit
      };
    }
    if (state.formKind === "username-first" && (request5.username == null || request5.username.trim().length === 0)) {
      return {
        result: { kind: "refused", reason: "username-field-missing", cleared: true },
        audit: state.audit
      };
    }
    return {
      result: await this.executeFill({
        browserCdpPort: target.browserCdpPort,
        targetId: target.targetId,
        expectedOrigin,
        expectedPathname: normalizedCredentialPathname(targetUrl.pathname),
        allowedFormActionOrigins: allowedFormActionOriginsForFill(
          request5.item,
          expectedOrigin,
          state
        ),
        step: state.formKind,
        ...request5.username == null || request5.username.trim().length === 0 ? {} : { username: request5.username },
        password: request5.password,
        ...state.formKind === "login" && request5.oneTimeCode !== void 0 ? { oneTimeCode: request5.oneTimeCode } : {},
        submit: true
      }),
      audit: state.audit,
      step: state.formKind
    };
  }
};
function allowedFormActionOriginsFor(item, expectedOrigin) {
  return [
    ...new Set(
      item.sites.flatMap((site) => {
        const origin = trustedBrowserOrigin(site);
        return origin == null || origin === expectedOrigin ? [] : [origin];
      })
    )
  ];
}
function allowedFormActionOriginsForFill(item, expectedOrigin, state) {
  const allowed = new Set(allowedFormActionOriginsFor(item, expectedOrigin));
  for (const element of state.audit?.elements ?? []) {
    if (element.formActionOrigin === void 0) continue;
    const origin = trustedBrowserOrigin(element.formActionOrigin);
    if (origin == null || origin === expectedOrigin || allowed.has(origin)) continue;
    if (matchCredentialItemToSite(item, origin) != null) allowed.add(origin);
  }
  return [...allowed];
}
function stepOf(execution) {
  return execution.step === void 0 ? {} : { step: execution.step };
}

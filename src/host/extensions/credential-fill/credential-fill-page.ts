function prepareCredentialFillInPage(policy) {
  const refusal = (reason) => ({
    kind: "refused",
    reason
  });
  const currentPageMatches = () => {
    const pathname = globalThis.location.pathname.length > 1 ? globalThis.location.pathname.replace(/\/+$/, "") || "/" : globalThis.location.pathname;
    return globalThis.location.origin === policy.expectedOrigin && pathname === policy.expectedPathname;
  };
  const frameIsActive = () => document.visibilityState === "visible";
  const composedParent = (element) => {
    if (element.parentElement !== null) return element.parentElement;
    const root = element.getRootNode();
    return root instanceof ShadowRoot ? root.host : null;
  };
  const collectInputs = () => {
    const inputs = [];
    const visit2 = (root) => {
      inputs.push(...root.querySelectorAll("input"));
      for (const element of root.querySelectorAll("*")) {
        if (element.shadowRoot !== null) visit2(element.shadowRoot);
      }
    };
    visit2(document);
    return inputs;
  };
  const owningForm = (input) => input.form;
  const isValidatableControl = (element) => element instanceof HTMLInputElement || element instanceof HTMLSelectElement || element instanceof HTMLTextAreaElement;
  const collectUnownedControls = () => {
    const controls = [];
    const visit2 = (root) => {
      for (const element of root.querySelectorAll("input, select, textarea")) {
        if (isValidatableControl(element) && element.form === null && elementAndAncestorsAreVisible(element)) {
          controls.push(element);
        }
      }
      for (const element of root.querySelectorAll("*")) {
        if (element.shadowRoot !== null) visit2(element.shadowRoot);
      }
    };
    visit2(document);
    return controls;
  };
  const labelsFor = (input) => {
    const labels = input.labels;
    return labels === null ? [] : [...labels];
  };
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
    for (const label of labelsFor(input)) {
      if (hit === label || hit !== null && label.contains(hit)) return true;
    }
    return false;
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
  const controlIsPresentable = (input) => {
    if (!input.isConnected || Element.prototype.matches.call(input, ":disabled") || input.readOnly || input.getAttribute("aria-disabled") === "true" || !elementAndAncestorsAreVisible(input)) {
      return false;
    }
    const rect = input.getBoundingClientRect();
    return Number.isFinite(rect.left) && Number.isFinite(rect.top) && Number.isFinite(rect.right) && Number.isFinite(rect.bottom) && rect.width >= 8 && rect.height >= 8;
  };
  const rectCenterIsWithinViewport = (rect) => {
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    return x >= 0 && y >= 0 && x < globalThis.innerWidth && y < globalThis.innerHeight;
  };
  const boundControlIsEligible = (input) => controlIsPresentable(input) && rectCenterIsWithinViewport(input.getBoundingClientRect());
  const controlIsEligible = (input) => boundControlIsEligible(input) && centerHitBelongsTo(input, input.getBoundingClientRect());
  const revealedControlIsEligible = (input) => {
    const scrollIntoView = Element.prototype.scrollIntoView;
    if (typeof scrollIntoView !== "function") return false;
    scrollIntoView.call(input, { block: "nearest", inline: "nearest" });
    return controlIsEligible(input);
  };
  const passwordCandidates = (inputs) => inputs.filter((input) => input.type.toLowerCase() === "password" && controlIsEligible(input));
  const hasVisiblePasswordControl = (inputs) => inputs.some(
    (input) => input.type.toLowerCase() === "password" && elementAndAncestorsAreVisible(input)
  );
  const isLockedIdentityControl = (input) => (Element.prototype.matches.call(input, ":disabled") || input.readOnly || input.getAttribute("aria-disabled") === "true") && input.value.trim().length > 0;
  const passwordCandidatesAfterRevealingTheOnlyOffscreenOne = (inputs) => {
    const presentable = inputs.filter(
      (input) => input.type.toLowerCase() === "password" && controlIsPresentable(input)
    );
    const only = presentable.length === 1 ? presentable[0] : void 0;
    if (only === void 0) return presentable;
    return revealedControlIsEligible(only) ? [only] : [];
  };
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
  const autocompleteTokens = (input) => (input.getAttribute("autocomplete") ?? "").toLowerCase().split(/\s+/).filter((token) => token.length > 0);
  const usernameScore = (input, positions) => {
    const tokens = autocompleteTokens(input);
    let score = 0;
    if (tokens.includes("username")) score += 1e3;
    else if (tokens.includes("email")) score += 800;
    if (input.type.toLowerCase() === "email") score += 500;
    if (input.type.toLowerCase() === "tel") score += 250;
    if (/(?:^|\W)(?:user(?:name|[\s_-]*id)?|e[\s_-]*mail|login)(?:\W|$)/i.test(descriptorFor(input))) {
      score += 400;
    }
    if (positions.inputIndex < positions.passwordIndex) score += 100;
    return score;
  };
  const resolveUsername = (inputs, password2, form2, isEligible) => {
    const passwordIndex = password2 === null ? inputs.length : inputs.indexOf(password2);
    const ranked = inputs.filter((input) => {
      const type2 = input.type.toLowerCase();
      return (type2 === "text" || type2 === "email" || type2 === "tel" || type2 === "search") && (form2 === void 0 || owningForm(input) === form2) && isEligible(input);
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
  const usernameAfterRevealingTheBestOffscreenOne = (inputs, password2, form2) => {
    const presentable = resolveUsername(inputs, password2, form2, controlIsPresentable);
    if (presentable.kind !== "found") return presentable;
    return revealedControlIsEligible(presentable.input) ? presentable : { kind: "missing" };
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
  const formCollectsPaymentCard = (form2) => form2 !== null && collectInputs().some(
    (input) => owningForm(input) === form2 && (autocompleteTokens(input).some((token) => token.startsWith("cc-")) || /(?:^|[^a-z])(?:card[\s_-]*number|cc[\s_-]*num|cvv|cvc|cvn|csc|expir\w*)(?:[^a-z]|$)/.test(
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
  const BESIDE_PASSWORD_MINIMUM_SCORE = 600;
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
  const splitDigitGroup = (inputs, form2, isEligible) => {
    const boxes = inputs.filter(
      (input) => oneTimeCodeTypeAllowed(input) && input.maxLength === 1 && (form2 === void 0 || owningForm(input) === form2) && isEligible(input) && !describesPaymentCard(descriptorFor(input))
    );
    const firstBox = boxes[0];
    const lastBox = boxes[boxes.length - 1];
    if (boxes.length < 4 || boxes.length > 10 || firstBox === void 0 || lastBox === void 0) {
      return null;
    }
    const groupForm = owningForm(firstBox);
    if (boxes.some((box) => owningForm(box) !== groupForm) || formCollectsPaymentCard(groupForm)) {
      return null;
    }
    const interleaved = inputs.slice(inputs.indexOf(firstBox), inputs.indexOf(lastBox) + 1).some(
      (input) => !boxes.includes(input) && oneTimeCodeTypeAllowed(input) && isEligible(input)
    );
    if (interleaved) return null;
    const signal = splitDigitGroupSignal(boxes);
    return signal === null ? null : { inputs: boxes, signal };
  };
  const resolveOneTimeCode = (inputs, form2, isEligible, minimumScore = 400) => {
    const ranked = inputs.filter((input) => (form2 === void 0 || owningForm(input) === form2) && isEligible(input)).map((input) => ({ input, score: oneTimeCodeScore(input) })).filter((candidate) => candidate.score >= minimumScore && candidate.input.maxLength !== 1).sort((left, right) => right.score - left.score);
    const best = ranked[0];
    if (best !== void 0 && ranked[1]?.score !== best.score) {
      return { kind: "found", inputs: [best.input] };
    }
    const group = splitDigitGroup(inputs, form2, isEligible);
    if (group !== null && (group.signal === "strong" || minimumScore <= 400)) {
      return { kind: "found", inputs: group.inputs };
    }
    return best === void 0 ? { kind: "missing" } : { kind: "ambiguous" };
  };
  const oneTimeCodeAfterRevealingTheOffscreenOne = (inputs, form2) => {
    const presentable = resolveOneTimeCode(inputs, form2, controlIsPresentable);
    if (presentable.kind !== "found") return presentable;
    return presentable.inputs.every(revealedControlIsEligible) ? presentable : { kind: "missing" };
  };
  const sameControls = (left, right) => left.length === right.length && left.every((input, index) => right[index] === input);
  const formActionAllowed = (form2) => {
    const parser = document.createElement("a");
    const action = Element.prototype.getAttribute.call(form2, "action");
    parser.href = action === null || action.length === 0 ? globalThis.location.href : action;
    return parser.origin === policy.expectedOrigin || policy.allowedFormActionOrigins.includes(parser.origin);
  };
  const formUsesPost = (form2) => Element.prototype.getAttribute.call(form2, "method")?.trim().toLowerCase() === "post";
  const formElementsGetter = Object.getOwnPropertyDescriptor(
    HTMLFormElement.prototype,
    "elements"
  )?.get;
  const submitButtonOf = (form2) => {
    const elements = typeof formElementsGetter === "function" ? formElementsGetter.call(form2) : null;
    if (!(elements instanceof HTMLFormControlsCollection)) return null;
    for (const element of elements) {
      if (element instanceof HTMLButtonElement && element.type === "submit" || element instanceof HTMLInputElement && element.type === "submit") {
        return element;
      }
    }
    return null;
  };
  const handOffSubmitToPage = (form2) => {
    const submitter = submitButtonOf(form2);
    const event = new SubmitEvent("submit", {
      bubbles: true,
      cancelable: true,
      ...submitter === null ? {} : { submitter }
    });
    return !EventTarget.prototype.dispatchEvent.call(form2, event);
  };
  const formCarriesAPasswordValue = (form2) => collectInputs().some(
    (input) => input.type.toLowerCase() === "password" && owningForm(input) === form2 && input.value.length > 0
  );
  const controlsAreValidOnceFilled = (controls, controlsToFill) => {
    for (const element of controls) {
      if (isValidatableControl(element) && !controlsToFill.includes(element) && element.willValidate && !element.validity.valid) {
        return false;
      }
    }
    return true;
  };
  const formIsSubmittableOnceFilled = (form2, controlsToFill) => {
    if (form2 === null) return controlsAreValidOnceFilled(collectUnownedControls(), controlsToFill);
    if (Element.prototype.hasAttribute.call(form2, "novalidate")) return true;
    const elements = typeof formElementsGetter === "function" ? formElementsGetter.call(form2) : null;
    if (!(elements instanceof HTMLFormControlsCollection)) return false;
    return controlsAreValidOnceFilled(elements, controlsToFill);
  };
  const prepare = () => {
    if (!currentPageMatches()) return refusal("origin-mismatch");
    if (!frameIsActive()) return refusal("frame-not-active");
    if (/(?:^|[/_-])(?:register|signup|sign-up|create-account|forgot-password|forgotpassword|password-reset|reset-password|recover-password|password-recovery)(?:[/_-]|$)/i.test(
      globalThis.location.pathname
    )) {
      return refusal("signup-or-reset-page");
    }
    const inputs = collectInputs();
    if (policy.step === "username-first") {
      if (hasVisiblePasswordControl(inputs)) return refusal("password-field-count");
      const inViewUsername = resolveUsername(inputs, null, void 0, controlIsEligible);
      const username3 = inViewUsername.kind === "missing" ? usernameAfterRevealingTheBestOffscreenOne(inputs, null, void 0) : inViewUsername;
      if (username3.kind === "missing") return refusal("username-field-missing");
      if (username3.kind === "ambiguous") return refusal("username-field-ambiguous");
      const form3 = owningForm(username3.input);
      if (form3 !== null && (!form3.isConnected || !formActionAllowed(form3))) {
        return refusal("form-action-mismatch");
      }
      return { kind: "ready", username: username3.input, password: null, oneTimeCode: [], form: form3 };
    }
    if (policy.step === "one-time-code") {
      if (hasVisiblePasswordControl(inputs)) return refusal("one-time-code-field-missing");
      const inView = resolveOneTimeCode(inputs, void 0, controlIsEligible);
      const oneTimeCode2 = inView.kind === "missing" ? oneTimeCodeAfterRevealingTheOffscreenOne(inputs, void 0) : inView;
      if (oneTimeCode2.kind === "missing") return refusal("one-time-code-field-missing");
      if (oneTimeCode2.kind === "ambiguous") return refusal("one-time-code-field-ambiguous");
      const firstControl = oneTimeCode2.inputs[0];
      const form3 = firstControl === void 0 ? null : owningForm(firstControl);
      if (form3 !== null && (!form3.isConnected || !formActionAllowed(form3))) {
        return refusal("form-action-mismatch");
      }
      return {
        kind: "ready",
        username: null,
        password: null,
        oneTimeCode: oneTimeCode2.inputs,
        form: form3
      };
    }
    const inViewPasswords = passwordCandidates(inputs);
    const passwords = inViewPasswords.length === 0 ? passwordCandidatesAfterRevealingTheOnlyOffscreenOne(inputs) : inViewPasswords;
    if (passwords.length !== 1) return refusal("password-field-count");
    const password2 = passwords[0];
    if (password2 === void 0 || password2.type.toLowerCase() !== "password" || autocompleteTokens(password2).includes("new-password")) {
      return refusal(
        password2 !== void 0 && autocompleteTokens(password2).includes("new-password") ? "signup-or-reset-page" : "password-field-ineligible"
      );
    }
    const form2 = owningForm(password2);
    const inForm = form2 !== null;
    const refusalInForm = (reason) => ({
      ...refusal(reason),
      inForm
    });
    if (form2 !== null && (!form2.isConnected || !formActionAllowed(form2))) {
      return refusalInForm("form-action-mismatch");
    }
    const besidePassword = (username3) => {
      if (!policy.oneTimeCodeExpected) return [];
      const others = inputs.filter((input) => input !== password2 && input !== username3);
      const oneTimeCode2 = resolveOneTimeCode(
        others,
        form2,
        controlIsEligible,
        BESIDE_PASSWORD_MINIMUM_SCORE
      );
      return oneTimeCode2.kind === "found" ? oneTimeCode2.inputs : [];
    };
    const readyToFill = (username3) => {
      const oneTimeCode2 = besidePassword(username3);
      return formIsSubmittableOnceFilled(form2, [username3, password2, ...oneTimeCode2]) ? { kind: "ready", username: username3, password: password2, oneTimeCode: oneTimeCode2, form: form2 } : refusalInForm("form-not-submittable");
    };
    if (!policy.usernameExpected) return readyToFill(null);
    const username2 = resolveUsername(inputs, password2, form2, controlIsEligible);
    if (username2.kind === "missing") {
      const ineligibleUsername = resolveUsername(
        inputs,
        password2,
        form2,
        (input) => !isLockedIdentityControl(input)
      );
      if (ineligibleUsername.kind !== "missing") {
        return refusalInForm(
          ineligibleUsername.kind === "ambiguous" ? "username-field-ambiguous" : "username-field-missing"
        );
      }
      return readyToFill(null);
    }
    if (username2.kind === "ambiguous") return refusalInForm("username-field-ambiguous");
    return readyToFill(username2.input);
  };
  const prepared = prepare();
  if (prepared.kind === "refused") return prepared;
  const { username, password, oneTimeCode, form } = prepared;
  const nativeValueSetter = Object.getOwnPropertyDescriptor(
    HTMLInputElement.prototype,
    "value"
  )?.set;
  if (nativeValueSetter === void 0) {
    return { kind: "refused", reason: "unsupported-page" };
  }
  const writtenSecrets = /* @__PURE__ */ new Set();
  const writtenControls = /* @__PURE__ */ new Map();
  let handOffHref = globalThis.location.href;
  const markSnapshotSecret = (input, value) => {
    input.setAttribute("data-sand-secret-filled", "");
    const own = input.ownerDocument.defaultView ?? window;
    if (value.length >= 2) (own.__sandSecretFillValues ??= /* @__PURE__ */ new Set()).add(value);
  };
  let disarmNativeSubmissionGuard = () => {
  };
  const armNativeSubmissionGuard = (guarded) => {
    disarmNativeSubmissionGuard();
    const listener = (event) => {
      if (event.target !== guarded) return;
      event.preventDefault();
      event.stopImmediatePropagation();
    };
    const root = guarded.getRootNode();
    const pageWindow = guarded.ownerDocument.defaultView;
    EventTarget.prototype.addEventListener.call(root, "submit", listener, true);
    pageWindow?.addEventListener("submit", listener, true);
    disarmNativeSubmissionGuard = () => {
      EventTarget.prototype.removeEventListener.call(root, "submit", listener, true);
      pageWindow?.removeEventListener("submit", listener, true);
      disarmNativeSubmissionGuard = () => {
      };
    };
  };
  const setInputValue = (input, value, revalidate) => {
    input.focus({ preventScroll: true });
    input.dispatchEvent(new KeyboardEvent("keydown", { bubbles: true, composed: true }));
    input.dispatchEvent(new KeyboardEvent("keyup", { bubbles: true, composed: true }));
    const failure2 = revalidate();
    if (failure2 !== null) return refusal(failure2);
    nativeValueSetter.call(input, value);
    const secret = input.type.toLowerCase() === "password" || oneTimeCode.includes(input);
    if (secret) markSnapshotSecret(input, value);
    writtenControls.set(input, {
      value,
      type: input.type.toLowerCase(),
      secret,
      id: input.id,
      name: input.name,
      autocomplete: input.getAttribute("autocomplete"),
      form: owningForm(input)
    });
    input.dispatchEvent(
      new InputEvent("input", {
        bubbles: true,
        composed: true,
        inputType: "insertText",
        data: value
      })
    );
    input.dispatchEvent(new Event("change", { bubbles: true }));
    return input.value.length > 0 ? { kind: "ok" } : refusal("identity-changed");
  };
  const currentStructuralIdentityFailure = () => {
    if (!currentPageMatches()) return "origin-mismatch";
    if (!frameIsActive()) return "frame-not-active";
    if (form !== null && (!form.isConnected || !formActionAllowed(form))) {
      return "form-action-mismatch";
    }
    if (username !== null) {
      const type2 = username.type.toLowerCase();
      const writtenUsername = writtenControls.get(username);
      const writtenUsernameStillMatches = writtenUsername === void 0 || username.value === writtenUsername.value || username.value.trim().toLowerCase() === writtenUsername.value.trim().toLowerCase();
      if (!boundControlIsEligible(username) || type2 !== "text" && type2 !== "email" && type2 !== "tel" && type2 !== "search" || owningForm(username) !== form || !writtenUsernameStillMatches) {
        return "identity-changed";
      }
    }
    const inputs = collectInputs();
    const oneTimeCodeControlsIntact = (formConstraint) => {
      if (oneTimeCode.some(
        (input) => !boundControlIsEligible(input) || !oneTimeCodeTypeAllowed(input) || owningForm(input) !== form
      )) {
        return false;
      }
      const current = resolveOneTimeCode(
        inputs.filter((input) => input !== password && input !== username),
        formConstraint,
        boundControlIsEligible,
        policy.step === "one-time-code" ? void 0 : BESIDE_PASSWORD_MINIMUM_SCORE
      );
      return current.kind === "found" && sameControls(current.inputs, oneTimeCode);
    };
    if (policy.step === "one-time-code") {
      return oneTimeCode.length > 0 && !hasVisiblePasswordControl(inputs) && oneTimeCodeControlsIntact(void 0) ? null : "identity-changed";
    }
    if (password === null) {
      if (policy.step !== "username-first" || username === null || hasVisiblePasswordControl(inputs)) {
        return "identity-changed";
      }
      const currentUsername = resolveUsername(inputs, null, form, boundControlIsEligible);
      return currentUsername.kind === "found" && currentUsername.input === username ? null : "identity-changed";
    }
    if (oneTimeCode.length > 0 && !oneTimeCodeControlsIntact(form)) return "identity-changed";
    if (policy.step !== "login" || !boundControlIsEligible(password) || password.type.toLowerCase() !== "password" || owningForm(password) !== form || autocompleteTokens(password).includes("new-password")) {
      return "identity-changed";
    }
    const passwords = inputs.filter(
      (input) => input.type.toLowerCase() === "password" && (input === password ? boundControlIsEligible(input) : controlIsEligible(input))
    );
    if (passwords.length !== 1 || passwords[0] !== password) return "identity-changed";
    if (username !== null) {
      const currentUsername = resolveUsername(inputs, password, form, boundControlIsEligible);
      if (currentUsername.kind !== "found" || currentUsername.input !== username) {
        return "identity-changed";
      }
    } else if (policy.usernameExpected && resolveUsername(inputs, password, form, (input) => !isLockedIdentityControl(input)).kind !== "missing") {
      return "identity-changed";
    }
    return null;
  };
  const currentIdentityFailure = () => {
    const structuralFailure = currentStructuralIdentityFailure();
    if (structuralFailure !== null) return structuralFailure;
    const inputs = collectInputs();
    if (username !== null) {
      const currentUsername = resolveUsername(inputs, password, form, controlIsEligible);
      if (currentUsername.kind !== "found" || currentUsername.input !== username) {
        return "identity-changed";
      }
    }
    return null;
  };
  const untypedValueTypes = /* @__PURE__ */ new Set([
    "button",
    "checkbox",
    "color",
    "file",
    "image",
    "radio",
    "range",
    "reset",
    "submit"
  ]);
  const secretHolders = (liveInputs) => {
    const holders = /* @__PURE__ */ new Set();
    const filled = liveInputs.filter(
      (input) => input.value.length > 0 && !untypedValueTypes.has(input.type.toLowerCase())
    );
    for (const input of filled) {
      if (writtenSecrets.has(input.value)) holders.add(input);
    }
    const singles = filled.filter((input) => input.value.length === 1);
    for (const secret of writtenSecrets) {
      if (secret.length < 2) continue;
      for (let start = 0; start + secret.length <= singles.length; start += 1) {
        const window2 = singles.slice(start, start + secret.length);
        if (window2.map((input) => input.value).join("") !== secret) continue;
        for (const box of window2) holders.add(box);
      }
    }
    return holders;
  };
  const clearWritten = (shouldClear) => {
    disarmNativeSubmissionGuard();
    const controlsToClear = /* @__PURE__ */ new Set();
    const liveInputs = collectInputs();
    let clearSecrets = false;
    for (const [input, written] of writtenControls) {
      if (!shouldClear(written)) continue;
      controlsToClear.add(input);
      if (written.secret) {
        clearSecrets = true;
        continue;
      }
      for (const candidate of liveInputs) {
        if (candidate === input || candidate.value !== written.value) continue;
        const sameIdentity = candidate.type.toLowerCase() === written.type && (candidate.id === written.id && candidate.name === written.name && candidate.getAttribute("autocomplete") === written.autocomplete || written.form !== null && owningForm(candidate) === written.form);
        if (sameIdentity) controlsToClear.add(candidate);
      }
    }
    if (clearSecrets) {
      for (const holder of secretHolders(liveInputs)) controlsToClear.add(holder);
    }
    for (const input of controlsToClear) {
      if (input.value.length === 0) continue;
      nativeValueSetter.call(input, "");
      input.dispatchEvent(
        new InputEvent("input", {
          bubbles: true,
          composed: true,
          inputType: "insertText"
        })
      );
      input.dispatchEvent(new Event("change", { bubbles: true }));
    }
    return secretResidue();
  };
  const secretResidue = () => {
    for (const [input, written] of writtenControls) {
      if (!written.secret || written.value.length === 0) continue;
      if (input.isConnected && input.value === written.value) return { cleared: false };
    }
    if (writtenSecrets.size === 0) return { cleared: true };
    return { cleared: secretHolders(collectInputs()).size === 0 };
  };
  const clear = () => clearWritten(() => true);
  const submissionCarriesValues = (controls, expectedValues) => {
    if (form === null || controls.length === 0 || controls.length !== expectedValues.length) {
      return false;
    }
    const data = new FormData(form);
    return controls.every((control, index) => {
      const expected = expectedValues[index];
      if (expected === void 0 || control.form !== form || control.value !== expected) {
        return false;
      }
      const name17 = control.name.trim();
      if (name17.length === 0) return true;
      return data.getAll(name17).some((candidate) => typeof candidate === "string" && candidate === expected);
    });
  };
  const submissionCarriesPassword = (expectedPassword) => password !== null && submissionCarriesValues([password], [expectedPassword]);
  const handOffTaken = () => {
    const taken = () => {
      if (password === null || globalThis.location.href !== handOffHref) return true;
      const written = writtenControls.get(password);
      if (written === void 0) return true;
      return !collectInputs().some(
        (input) => input.type.toLowerCase() === "password" && input.value === written.value && controlIsPresentable(input)
      );
    };
    if (!taken()) return false;
    disarmNativeSubmissionGuard();
    return true;
  };
  const handedOff = () => password === null ? { kind: "ok", submitted: true } : { kind: "ok", submitted: false, settling: true };
  const handOffEnterToPage = (input) => {
    const guarded = owningForm(input);
    if (guarded !== null) armNativeSubmissionGuard(guarded);
    input.focus({ preventScroll: true });
    return password === null ? { kind: "ok", submitted: true, pressEnter: true } : { kind: "ok", submitted: false, settling: true, pressEnter: true };
  };
  const submitFilledForm = (carried) => {
    handOffHref = globalThis.location.href;
    if (form === null) {
      if (password === null) return { kind: "ok", submitted: false };
      if (!formIsSubmittableOnceFilled(null, [])) {
        clear();
        return refusal("submit-failed");
      }
      return handOffEnterToPage(password);
    }
    const formIsValid = Element.prototype.hasAttribute.call(form, "novalidate") || HTMLFormElement.prototype.checkValidity.call(form);
    if (!formUsesPost(form)) {
      const submittable = formIsValid && formActionAllowed(form);
      if (submittable && handOffSubmitToPage(form)) return handedOff();
      if (password === null) return { kind: "ok", submitted: false };
      if (!submittable) {
        clear();
        return refusal("submit-failed");
      }
      if (handOffTaken()) return handedOff();
      return handOffEnterToPage(password);
    }
    const requestSubmit = HTMLFormElement.prototype.requestSubmit;
    if (typeof requestSubmit !== "function") {
      clear();
      return refusal("unsupported-page");
    }
    if (!formIsValid || !carried || !formActionAllowed(form)) {
      clear();
      return refusal("submit-failed");
    }
    try {
      requestSubmit.call(form);
    } catch {
      clear();
      return refusal("submit-failed");
    }
    return handedOff();
  };
  return {
    kind: "ready",
    oneTimeCodeControls: oneTimeCode.length,
    ...password === null ? {} : { inForm: form !== null },
    fillUsername(value) {
      if (username === null) return { kind: "ok" };
      const before = currentIdentityFailure();
      if (before !== null) return refusal(before);
      const fill = setInputValue(username, value, currentIdentityFailure);
      if (fill.kind === "refused") {
        clear();
        return fill;
      }
      const after = currentStructuralIdentityFailure();
      if (after === null) return { kind: "ok" };
      clear();
      return refusal(after);
    },
    revalidateAfterUsernameEvents() {
      const failure2 = currentStructuralIdentityFailure();
      if (failure2 === null) return { kind: "ok" };
      clear();
      return refusal(failure2);
    },
    submitUsername() {
      const failure2 = currentStructuralIdentityFailure();
      if (failure2 !== null) {
        clear();
        return refusal(failure2);
      }
      if (password !== null || username === null) {
        clear();
        return refusal("submit-failed");
      }
      if ((form === null || !formUsesPost(form)) && formCarriesAPasswordValue(form)) {
        return { kind: "ok", submitted: false };
      }
      if (form === null) {
        if (!formIsSubmittableOnceFilled(null, [])) {
          clear();
          return refusal("submit-failed");
        }
        return handOffEnterToPage(username);
      }
      const requestSubmit = HTMLFormElement.prototype.requestSubmit;
      if (typeof requestSubmit !== "function") {
        clear();
        return refusal("unsupported-page");
      }
      if (!Element.prototype.hasAttribute.call(form, "novalidate") && !HTMLFormElement.prototype.checkValidity.call(form)) {
        clear();
        return refusal("submit-failed");
      }
      if (!formActionAllowed(form)) {
        clear();
        return refusal("submit-failed");
      }
      try {
        requestSubmit.call(form);
      } catch {
        clear();
        return refusal("submit-failed");
      }
      return { kind: "ok", submitted: true };
    },
    fillPassword(value, submit) {
      if (password === null) {
        clear();
        return refusal("password-field-ineligible");
      }
      const before = currentStructuralIdentityFailure();
      if (before !== null) {
        clear();
        return refusal(before);
      }
      writtenSecrets.add(value);
      const fill = setInputValue(password, value, () => {
        if (password.type.toLowerCase() !== "password") {
          return "password-field-ineligible";
        }
        return currentStructuralIdentityFailure();
      });
      if (fill.kind === "refused") {
        clear();
        return fill;
      }
      const after = currentStructuralIdentityFailure();
      if (after !== null) {
        clear();
        return refusal(after);
      }
      if (!submit) return { kind: "ok" };
      return submitFilledForm(submissionCarriesPassword(value));
    },
    fillOneTimeCode(value, submit) {
      let chunks = null;
      if (oneTimeCode.length === 1) {
        chunks = [value];
      } else if (oneTimeCode.length === value.length) {
        chunks = [...value];
      }
      if (oneTimeCode.length === 0 || chunks === null) {
        clear();
        return refusal("one-time-code-field-missing");
      }
      const before = currentStructuralIdentityFailure();
      if (before !== null) {
        clear();
        return refusal(before);
      }
      writtenSecrets.add(value);
      for (const control of oneTimeCode) markSnapshotSecret(control, value);
      for (const [index, control] of oneTimeCode.entries()) {
        const chunk = chunks[index];
        if (chunk === void 0) {
          clear();
          return refusal("one-time-code-field-missing");
        }
        const fill = setInputValue(control, chunk, currentStructuralIdentityFailure);
        if (fill.kind === "refused") {
          clear();
          return fill;
        }
      }
      const after = currentStructuralIdentityFailure();
      if (after !== null) {
        clear();
        return refusal(after);
      }
      if (!submit) return { kind: "ok" };
      return submitFilledForm(submissionCarriesValues(oneTimeCode, chunks));
    },
    handOffTaken,
    clearSubmittedSecrets() {
      return clearWritten((written) => written.secret);
    },
    clear,
    secretResidue
  };
}

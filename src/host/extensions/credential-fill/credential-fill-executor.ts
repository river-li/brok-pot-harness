var TARGET_LOOKUP_DEADLINE = createDeadlinePolicy({
  name: "credential-fill.target-lookup",
  timeoutMs: 3e3
});
var CREDENTIAL_FILL_OBJECT_GROUP = "sand-credential-fill";
var CREDENTIAL_FILL_WORLD = "sand-credential-fill";
var SETTLE_USERNAME_EVENTS_FUNCTION = `async function() {
	await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
	return this.revalidateAfterUsernameEvents();
}`;
var IN_PAGE_SETTLE = `const settle = () => new Promise((resolve) => {
	let done = false;
	const finish = () => {
		if (done) return;
		done = true;
		resolve();
	};
	requestAnimationFrame(() => requestAnimationFrame(finish));
	setTimeout(finish, 50);
});`;
var SETTLE_SUBMIT_AND_CLEAR_SECRETS_FUNCTION = `async function() {
	${IN_PAGE_SETTLE}
	await settle();
	this.clearSubmittedSecrets();
	await settle();
	if (this.secretResidue().cleared) return { cleared: true };
	this.clearSubmittedSecrets();
	await settle();
	return this.secretResidue();
}`;
var CLEAR_PREPARED_STATE_FUNCTION = `async function() {
	${IN_PAGE_SETTLE}
	this.clear();
	await settle();
	if (this.secretResidue().cleared) return { cleared: true };
	this.clear();
	await settle();
	return this.secretResidue();
}`;
var targetListSchema = external_exports.array(
  external_exports.object({
    id: external_exports.string(),
    type: external_exports.string(),
    url: external_exports.string(),
    webSocketDebuggerUrl: external_exports.string().optional()
  }).passthrough()
);
var frameTreeNodeSchema = external_exports.lazy(
  () => external_exports.object({
    frame: external_exports.object({
      id: external_exports.string(),
      url: external_exports.string(),
      loaderId: external_exports.string().optional()
    }).passthrough(),
    childFrames: external_exports.array(frameTreeNodeSchema).optional()
  }).passthrough()
);
var frameTreeResultSchema = external_exports.object({ frameTree: frameTreeNodeSchema }).passthrough();
var isolatedWorldResultSchema = external_exports.object({ executionContextId: external_exports.number().int().nonnegative() }).passthrough();
var runtimeCallResultSchema = external_exports.object({
  result: external_exports.object({
    objectId: external_exports.string().optional(),
    value: external_exports.unknown().optional()
  }).passthrough(),
  exceptionDetails: external_exports.unknown().optional()
}).passthrough();
var preparedStatusSchema = external_exports.discriminatedUnion("kind", [
  external_exports.object({
    kind: external_exports.literal("ready"),
    oneTimeCodeControls: external_exports.number().int().nonnegative().optional(),
    inForm: external_exports.boolean().optional()
  }),
  external_exports.object({
    kind: external_exports.literal("refused"),
    reason: external_exports.string(),
    inForm: external_exports.boolean().optional()
  })
]);
var ONE_TIME_CODE_MAX_LENGTH = 16;
var pageStepSchema = external_exports.discriminatedUnion("kind", [
  external_exports.object({
    kind: external_exports.literal("ok"),
    submitted: external_exports.boolean().optional(),
    settling: external_exports.boolean().optional(),
    pressEnter: external_exports.boolean().optional()
  }),
  external_exports.object({
    kind: external_exports.literal("refused"),
    reason: external_exports.string()
  })
]);
var pageClearanceSchema = external_exports.object({ cleared: external_exports.boolean() }).passthrough();
var connectionRefusedSchema = external_exports.object({
  cause: external_exports.union([
    external_exports.object({ code: external_exports.literal("ECONNREFUSED") }).passthrough(),
    external_exports.object({ errors: external_exports.array(external_exports.object({ code: external_exports.literal("ECONNREFUSED") }).passthrough()) }).passthrough()
  ])
});
var absoluteUrlSchema = external_exports.string().url();
function isLoopbackHost2(host) {
  return host === "localhost" || // pragma: allowlist secret
  host === "127.0.0.1" || host === "[::1]" || host === "::1";
}
function normalizedOrigin(raw) {
  const parsed2 = absoluteUrlSchema.safeParse(raw);
  if (!parsed2.success) return void 0;
  const url2 = new URL(parsed2.data);
  if (url2.username !== "" || url2.password !== "") return void 0;
  const host = url2.hostname.toLowerCase();
  if (url2.protocol !== "https:" && !(url2.protocol === "http:" && isLoopbackHost2(host))) {
    return void 0;
  }
  return url2.origin;
}
function normalizedPathname(raw) {
  if (typeof raw !== "string" || !raw.startsWith("/")) return void 0;
  const base = "https://credential-fill.invalid";
  const url2 = new URL(raw, base);
  if (url2.origin !== base || url2.search !== "" || url2.hash !== "" || url2.pathname !== raw) {
    return void 0;
  }
  return url2.pathname.length > 1 ? url2.pathname.replace(/\/+$/, "") || "/" : url2.pathname;
}
function trustedTargetWebSocket(args) {
  const parsed2 = absoluteUrlSchema.safeParse(args.raw);
  if (!parsed2.success) return void 0;
  const url2 = new URL(parsed2.data);
  const host = url2.hostname.toLowerCase();
  if (url2.protocol !== "ws:" || url2.username !== "" || url2.password !== "" || !isLoopbackHost2(host) || Number(url2.port) !== args.port || url2.pathname !== `/devtools/page/${args.targetId}`) {
    return void 0;
  }
  return url2.toString();
}
function frameById(tree, frameId) {
  if (tree.frame.id === frameId) return tree.frame;
  for (const child of tree.childFrames ?? []) {
    const match2 = frameById(child, frameId);
    if (match2 !== void 0) return match2;
  }
  return void 0;
}
function knownRefusalReason(value) {
  switch (value) {
    case "invalid-request":
    case "origin-mismatch":
    case "frame-mismatch":
    case "frame-not-active":
    case "password-field-count":
    case "password-field-ineligible":
    case "username-field-missing":
    case "username-field-ambiguous":
    case "one-time-code-field-missing":
    case "one-time-code-field-ambiguous":
    case "form-action-mismatch":
    case "form-not-submittable":
    case "identity-changed":
    case "signup-or-reset-page":
    case "unsupported-page":
    case "submit-failed":
      return value;
    default:
      return void 0;
  }
}
function parsedRuntimeCall(value) {
  const parsed2 = runtimeCallResultSchema.safeParse(value);
  if (!parsed2.success || parsed2.data.exceptionDetails !== void 0) return void 0;
  return parsed2.data.result;
}
var HAND_OFF_SETTLE_DEFAULT = { intervalMs: 250, timeoutMs: 3e3 };
var CredentialFillExecutor = class {
  constructor(options2) {
    this.options = options2;
  }
  options;
  queue = new PromiseQueue({ max: 1 });
  async fill(request5) {
    return await this.queue.enqueue(() => this.execute(request5));
  }
  async verifyCleared(target) {
    return await this.queue.enqueue(() => this.verify(target));
  }
  async execute(request5) {
    const formContext = {};
    const result = await this.executeSteps(request5, formContext);
    return formContext.inForm === void 0 ? result : { ...result, inForm: formContext.inForm };
  }
  async executeSteps(request5, formContext) {
    const expectedOrigin = normalizedOrigin(request5.expectedOrigin);
    const expectedPathname = normalizedPathname(request5.expectedPathname);
    const allowedFormActionOrigins = request5.allowedFormActionOrigins?.map(normalizedOrigin) ?? [];
    const step = request5.step ?? "login";
    const username = request5.username === void 0 || request5.username.trim().length === 0 ? void 0 : request5.username;
    const password = request5.password === void 0 || request5.password.length === 0 ? void 0 : request5.password;
    const oneTimeCode = request5.oneTimeCode === void 0 || request5.oneTimeCode.length === 0 ? void 0 : request5.oneTimeCode;
    if (expectedOrigin === void 0 || expectedPathname === void 0 || allowedFormActionOrigins.some((origin) => origin === void 0) || !Number.isSafeInteger(request5.browserCdpPort) || request5.browserCdpPort < 1 || request5.browserCdpPort > 65535 || request5.targetId.length === 0 || request5.frameId !== void 0 && request5.frameId.length === 0 || step !== "login" && step !== "username-first" && step !== "one-time-code" || step === "username-first" && username === void 0 || (step === "one-time-code" ? oneTimeCode === void 0 || password !== void 0 || username !== void 0 : password === void 0) || oneTimeCode !== void 0 && (oneTimeCode.length > ONE_TIME_CODE_MAX_LENGTH || /\s/.test(oneTimeCode))) {
      return { kind: "refused", reason: "invalid-request", cleared: true };
    }
    const listing = await this.listTarget(request5.browserCdpPort, request5.targetId);
    if (listing.kind !== "ready") return { kind: "unavailable", cleared: true };
    if (normalizedOrigin(listing.url) !== expectedOrigin || normalizedPathname(new URL(listing.url).pathname) !== expectedPathname) {
      return { kind: "refused", reason: "origin-mismatch", cleared: true };
    }
    const clearTargetBase = {
      browserCdpPort: request5.browserCdpPort,
      targetId: request5.targetId,
      ...request5.frameId === void 0 ? {} : { frameId: request5.frameId }
    };
    let connection;
    let preparedObjectId;
    let writtenPage;
    const refusedInPage = (reason) => ({
      kind: "refused",
      reason: knownRefusalReason(reason) ?? "unsupported-page",
      cleared: true
    });
    try {
      connection = await this.connect(listing.webSocketDebuggerUrl);
      const frameTree = frameTreeResultSchema.parse(await connection.send("Page.getFrameTree"));
      const frame = request5.frameId === void 0 ? frameTree.frameTree.frame : frameById(frameTree.frameTree, request5.frameId);
      if (frame === void 0 || normalizedOrigin(frame.url) !== expectedOrigin) {
        return { kind: "refused", reason: "frame-mismatch", cleared: true };
      }
      if (normalizedPathname(new URL(frame.url).pathname) !== expectedPathname) {
        return { kind: "refused", reason: "frame-mismatch", cleared: true };
      }
      const isolatedWorld = isolatedWorldResultSchema.parse(
        await connection.send("Page.createIsolatedWorld", {
          frameId: frame.id,
          worldName: CREDENTIAL_FILL_WORLD,
          grantUniveralAccess: false
        })
      );
      const prepared = parsedRuntimeCall(
        await connection.send("Runtime.callFunctionOn", {
          executionContextId: isolatedWorld.executionContextId,
          functionDeclaration: `function(policy) { return (${prepareCredentialFillInPage.toString()})(policy); }`,
          arguments: [
            {
              value: {
                expectedOrigin,
                expectedPathname,
                allowedFormActionOrigins,
                step,
                usernameExpected: username !== void 0,
                oneTimeCodeExpected: oneTimeCode !== void 0
              }
            }
          ],
          objectGroup: CREDENTIAL_FILL_OBJECT_GROUP,
          returnByValue: false
        })
      );
      preparedObjectId = prepared?.objectId;
      if (preparedObjectId === void 0) return { kind: "unavailable", cleared: true };
      const status = await this.callPreparedState(connection, preparedObjectId, {
        functionDeclaration: 'function() { return this.kind === "ready" ? { kind: "ready", oneTimeCodeControls: this.oneTimeCodeControls, inForm: this.inForm } : { kind: "refused", reason: this.reason, inForm: this.inForm }; }'
      });
      const parsedStatus = preparedStatusSchema.safeParse(status);
      if (!parsedStatus.success) return { kind: "unavailable", cleared: true };
      if (parsedStatus.data.inForm !== void 0) formContext.inForm = parsedStatus.data.inForm;
      if (parsedStatus.data.kind === "refused") return refusedInPage(parsedStatus.data.reason);
      if (step === "one-time-code") {
        if (oneTimeCode === void 0) {
          return { kind: "refused", reason: "invalid-request", cleared: true };
        }
        const codePage = {
          connection,
          preparedObjectId,
          frameId: frame.id,
          clearTarget: {
            ...clearTargetBase,
            oneTimeCodeDigest: passwordDigest(oneTimeCode),
            oneTimeCodeLength: oneTimeCode.length
          }
        };
        writtenPage = codePage;
        const codeResult = await this.callPreparedState(connection, preparedObjectId, {
          functionDeclaration: "function(value, submit) { return this.fillOneTimeCode(value, submit); }",
          arguments: [{ value: oneTimeCode }, { value: request5.submit === true }]
        });
        const codeStep = pageStepSchema.safeParse(codeResult);
        if (!codeStep.success) {
          return { kind: "unavailable", ...await this.clearAfterSecretWrite(codePage) };
        }
        if (codeStep.data.kind === "refused") {
          return {
            kind: "refused",
            reason: knownRefusalReason(codeStep.data.reason) ?? "unsupported-page",
            ...await this.clearAfterSecretWrite(codePage)
          };
        }
        if (codeStep.data.submitted !== true) {
          return {
            kind: "filled",
            submitted: false,
            cleared: false,
            clearTarget: codePage.clearTarget
          };
        }
        return { kind: "filled", submitted: true, ...await this.clearSubmittedSecrets(codePage) };
      }
      if (password === void 0) {
        return { kind: "refused", reason: "invalid-request", cleared: true };
      }
      if (username !== void 0) {
        const usernameResult = await this.callPreparedState(connection, preparedObjectId, {
          functionDeclaration: "function(value) { return this.fillUsername(value); }",
          arguments: [{ value: username }]
        });
        const usernameStep = pageStepSchema.safeParse(usernameResult);
        if (!usernameStep.success) {
          await this.clearPreparedState(connection, preparedObjectId);
          return { kind: "unavailable", cleared: true };
        }
        if (usernameStep.data.kind === "refused") {
          await this.clearPreparedState(connection, preparedObjectId);
          return refusedInPage(usernameStep.data.reason);
        }
        const settledUsernameResult = await this.callPreparedState(connection, preparedObjectId, {
          functionDeclaration: SETTLE_USERNAME_EVENTS_FUNCTION
        });
        const settledUsernameStep = pageStepSchema.safeParse(settledUsernameResult);
        if (!settledUsernameStep.success) {
          await this.clearPreparedState(connection, preparedObjectId);
          return { kind: "unavailable", cleared: true };
        }
        if (settledUsernameStep.data.kind === "refused") {
          await this.clearPreparedState(connection, preparedObjectId);
          return refusedInPage(settledUsernameStep.data.reason);
        }
      }
      if (step === "username-first") {
        if (request5.submit !== true) {
          await this.clearPreparedState(connection, preparedObjectId);
          return { kind: "filled", submitted: false, cleared: true };
        }
        const submitResult = await this.callPreparedState(connection, preparedObjectId, {
          functionDeclaration: "function() { return this.submitUsername(); }"
        });
        const submitStep = pageStepSchema.safeParse(submitResult);
        if (!submitStep.success) {
          await this.clearPreparedState(connection, preparedObjectId);
          return { kind: "unavailable", cleared: true };
        }
        if (submitStep.data.kind === "refused") {
          await this.clearPreparedState(connection, preparedObjectId);
          return refusedInPage(submitStep.data.reason);
        }
        if (submitStep.data.pressEnter === true && !await this.pressEnter(connection)) {
          await this.clearPreparedState(connection, preparedObjectId);
          return { kind: "refused", reason: "submit-failed", cleared: true };
        }
        return {
          kind: "filled",
          submitted: submitStep.data.submitted === true,
          cleared: true
        };
      }
      const oneTimeCodeControls = parsedStatus.data.oneTimeCodeControls ?? 0;
      const codeBesidePassword = oneTimeCode !== void 0 && (oneTimeCodeControls === 1 || oneTimeCodeControls === oneTimeCode.length);
      const clearTarget = {
        ...clearTargetBase,
        passwordDigest: passwordDigest(password),
        ...codeBesidePassword ? {
          oneTimeCodeDigest: passwordDigest(oneTimeCode),
          oneTimeCodeLength: oneTimeCode.length
        } : {}
      };
      const preparedPage = {
        connection,
        preparedObjectId,
        frameId: frame.id,
        clearTarget
      };
      if (codeBesidePassword) {
        writtenPage = preparedPage;
        const codeResult = await this.callPreparedState(connection, preparedObjectId, {
          functionDeclaration: "function(value, submit) { return this.fillOneTimeCode(value, submit); }",
          arguments: [{ value: oneTimeCode }, { value: false }]
        });
        const codeStep = pageStepSchema.safeParse(codeResult);
        if (!codeStep.success) {
          return { kind: "unavailable", ...await this.clearAfterSecretWrite(preparedPage) };
        }
        if (codeStep.data.kind === "refused") {
          return {
            kind: "refused",
            reason: knownRefusalReason(codeStep.data.reason) ?? "unsupported-page",
            ...await this.clearAfterSecretWrite(preparedPage)
          };
        }
      }
      writtenPage = preparedPage;
      const passwordResult = await this.callPreparedState(connection, preparedObjectId, {
        functionDeclaration: "function(value, submit) { return this.fillPassword(value, submit); }",
        arguments: [{ value: password }, { value: request5.submit === true }]
      });
      const passwordStep = pageStepSchema.safeParse(passwordResult);
      if (!passwordStep.success) {
        return {
          kind: "unavailable",
          ...await this.clearAfterSecretWrite(preparedPage)
        };
      }
      if (passwordStep.data.kind === "refused") {
        return {
          kind: "refused",
          reason: knownRefusalReason(passwordStep.data.reason) ?? "unsupported-page",
          ...await this.clearAfterSecretWrite(preparedPage)
        };
      }
      if (passwordStep.data.pressEnter === true && !await this.pressEnter(connection)) {
        return {
          kind: "refused",
          reason: "submit-failed",
          ...await this.clearAfterSecretWrite(preparedPage)
        };
      }
      let submitConfirmed = true;
      if (passwordStep.data.settling === true) {
        submitConfirmed = await this.handOffTaken(connection, preparedObjectId, frame);
      } else if (passwordStep.data.submitted !== true) {
        return { kind: "filled", submitted: false, cleared: false, clearTarget };
      }
      const clearance = await this.clearSubmittedSecrets(preparedPage);
      return {
        kind: "filled",
        submitted: true,
        ...submitConfirmed ? {} : { submitConfirmed: false },
        ...clearance
      };
    } catch (error42) {
      this.options.reportFailure(`execute-${errorLogTag(error42)}`);
      if (writtenPage === void 0) return { kind: "unavailable", cleared: true };
      return { kind: "unavailable", ...await this.clearAfterSecretWrite(writtenPage) };
    } finally {
      if (connection !== void 0) {
        try {
          await connection.send("Runtime.releaseObjectGroup", {
            objectGroup: CREDENTIAL_FILL_OBJECT_GROUP
          });
        } catch (error42) {
          this.options.reportFailure(`release-object-group-${errorLogTag(error42)}`);
        }
        connection.close();
      }
    }
  }
  clearance(cleared, clearTarget) {
    return cleared ? { cleared: true } : { cleared: false, clearTarget };
  }
  async clearAfterSecretWrite(page) {
    try {
      if (await this.clearPreparedState(page.connection, page.preparedObjectId)) {
        return { cleared: true };
      }
    } catch (error42) {
      this.options.reportFailure(`clear-written-${errorLogTag(error42)}`);
    }
    return await this.verifyFrameCleared(page.connection, page.frameId, page.clearTarget);
  }
  async clearSubmittedSecrets(page) {
    try {
      const settled = pageClearanceSchema.safeParse(
        await this.callPreparedState(page.connection, page.preparedObjectId, {
          functionDeclaration: SETTLE_SUBMIT_AND_CLEAR_SECRETS_FUNCTION
        })
      );
      if (settled.success && settled.data.cleared) return { cleared: true };
    } catch (error42) {
      this.options.reportFailure(`clear-submitted-${errorLogTag(error42)}`);
    }
    return await this.verifyFrameCleared(page.connection, page.frameId, page.clearTarget);
  }
  async verify(target) {
    if (!Number.isSafeInteger(target.browserCdpPort) || target.targetId.length === 0) {
      return { cleared: false, clearTarget: target };
    }
    const listing = await this.listTarget(target.browserCdpPort, target.targetId);
    if (listing.kind === "closed") return { cleared: true };
    if (listing.kind === "unknown") return { cleared: false, clearTarget: target };
    let connection;
    try {
      connection = await this.connect(listing.webSocketDebuggerUrl);
      const frameTree = frameTreeResultSchema.parse(await connection.send("Page.getFrameTree"));
      const frame = target.frameId === void 0 ? frameTree.frameTree.frame : frameById(frameTree.frameTree, target.frameId);
      if (frame === void 0) return { cleared: true };
      return await this.verifyFrameCleared(connection, frame.id, target);
    } catch (error42) {
      this.options.reportFailure(`verify-${errorLogTag(error42)}`);
      return { cleared: false, clearTarget: target };
    } finally {
      connection?.close();
    }
  }
  async verifyFrameCleared(connection, frameId, target) {
    try {
      const isolatedWorld = isolatedWorldResultSchema.parse(
        await connection.send("Page.createIsolatedWorld", {
          frameId,
          worldName: CREDENTIAL_FILL_WORLD,
          grantUniveralAccess: false
        })
      );
      const result = parsedRuntimeCall(
        await connection.send("Runtime.callFunctionOn", {
          executionContextId: isolatedWorld.executionContextId,
          functionDeclaration: `async function(secrets) {
	${IN_PAGE_SETTLE}
	return (${clearFilledSecretsInPage.toString()})(secrets, settle);
}`,
          arguments: [
            {
              value: {
                ...target.passwordDigest === void 0 ? {} : { passwordDigest: target.passwordDigest },
                ...target.oneTimeCodeDigest === void 0 ? {} : {
                  oneTimeCodeDigest: target.oneTimeCodeDigest,
                  oneTimeCodeLength: target.oneTimeCodeLength
                }
              }
            }
          ],
          awaitPromise: true,
          returnByValue: true
        })
      );
      const clearance = pageClearanceSchema.safeParse(result?.value);
      return this.clearance(clearance.success && clearance.data.cleared, target);
    } catch (error42) {
      this.options.reportFailure(`verify-frame-${errorLogTag(error42)}`);
      return { cleared: false, clearTarget: target };
    }
  }
  async listTarget(browserCdpPort, targetId) {
    const fetchImpl = this.options.fetchImpl ?? fetch;
    try {
      const payload = await TARGET_LOOKUP_DEADLINE.run(async (signal) => {
        const response = await fetchImpl(`http://127.0.0.1:${browserCdpPort}/json/list`, {
          signal
        });
        if (!response.ok) return void 0;
        return await response.json();
      });
      if (payload === void 0) return { kind: "unknown" };
      const targets = targetListSchema.parse(payload);
      const target = targets.find(
        (candidate) => candidate.id === targetId && candidate.type === "page"
      );
      if (target === void 0) return { kind: "closed" };
      const webSocketDebuggerUrl = target.webSocketDebuggerUrl === void 0 ? void 0 : trustedTargetWebSocket({
        raw: target.webSocketDebuggerUrl,
        port: browserCdpPort,
        targetId
      });
      if (webSocketDebuggerUrl === void 0) return { kind: "unknown" };
      return { kind: "ready", webSocketDebuggerUrl, url: target.url };
    } catch (error42) {
      this.options.reportFailure(`target-lookup-${errorLogTag(error42)}`);
      if (!(error42 instanceof DeadlineExceededError) && connectionRefusedSchema.safeParse(error42).success) {
        return { kind: "closed" };
      }
      return { kind: "unknown" };
    }
  }
  async connect(url2) {
    if (this.options.connect !== void 0) return await this.options.connect(url2);
    return await openCdpConnection(url2, this.options.reportFailure);
  }
  async callPreparedState(connection, objectId, call) {
    const result = parsedRuntimeCall(
      await connection.send("Runtime.callFunctionOn", {
        objectId,
        functionDeclaration: call.functionDeclaration,
        ...call.arguments === void 0 ? {} : { arguments: call.arguments },
        awaitPromise: true,
        returnByValue: true
      })
    );
    return result?.value;
  }
  async pressEnter(connection) {
    const key = {
      key: "Enter",
      code: "Enter",
      windowsVirtualKeyCode: 13,
      nativeVirtualKeyCode: 13
    };
    try {
      await connection.send("Input.dispatchKeyEvent", {
        type: "keyDown",
        ...key,
        text: "\r",
        unmodifiedText: "\r"
      });
      await connection.send("Input.dispatchKeyEvent", { type: "keyUp", ...key });
      return true;
    } catch (error42) {
      this.options.reportFailure(`press-enter-${errorLogTag(error42)}`);
      return false;
    }
  }
  async handOffTaken(connection, objectId, frame) {
    const { intervalMs, timeoutMs } = this.options.handOffSettle ?? HAND_OFF_SETTLE_DEFAULT;
    const deadline = Date.now() + timeoutMs;
    for (; ; ) {
      await delay2(intervalMs);
      try {
        const taken = await this.callPreparedState(connection, objectId, {
          functionDeclaration: "function() { return this.handOffTaken(); }"
        });
        if (taken === true) return true;
      } catch (error42) {
        const tree = frameTreeResultSchema.parse(await connection.send("Page.getFrameTree"));
        const live = tree.frameTree.frame.id === frame.id ? tree.frameTree.frame : frameById(tree.frameTree, frame.id);
        if (live === void 0 || live.url !== frame.url || frame.loaderId !== void 0 && live.loaderId !== frame.loaderId) {
          return true;
        }
        throw error42;
      }
      if (Date.now() >= deadline) return false;
    }
  }
  async clearPreparedState(connection, objectId) {
    const clearance = pageClearanceSchema.safeParse(
      await this.callPreparedState(connection, objectId, {
        functionDeclaration: CLEAR_PREPARED_STATE_FUNCTION
      })
    );
    return clearance.success && clearance.data.cleared;
  }
};

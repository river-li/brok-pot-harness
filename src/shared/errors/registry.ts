var SAND_ERROR_DEFINITIONS = {
  "SAND-E0001": {
    name: "unregistered",
    domain: "registry",
    retryable: false,
    summary: "A value that is not a registered SandError reached the emit boundary and was reclassified; the original code and payload never ship.",
    payload: [],
    seededFrom: "sandErrorTags emit-boundary validation in registry.ts"
  },
  "SAND-E0101": {
    name: "gatewayRefused",
    domain: "transport",
    retryable: true,
    summary: "Gateway connection refused: nothing accepted the desktop-to-box connect.",
    payload: ["errno"],
    seededFrom: "classifyGatewayFetchFailure `refused` in gateway-reachability.ts"
  },
  "SAND-E0102": {
    name: "gatewayTimeout",
    domain: "transport",
    retryable: true,
    summary: "Gateway attempt timed out: the deadline fired with no reply.",
    payload: ["errno"],
    seededFrom: "classifyGatewayFetchFailure `timeout` in gateway-reachability.ts"
  },
  "SAND-E0103": {
    name: "gatewayHttp5xx",
    domain: "transport",
    retryable: true,
    summary: "Gateway replied 5xx: the pod proxy routed but the gateway or host errored.",
    payload: ["httpStatus"],
    seededFrom: "classifyGatewayHttpResponse `http_5xx` in gateway-reachability.ts"
  },
  "SAND-E0104": {
    name: "gatewayDns",
    domain: "transport",
    retryable: true,
    summary: "Gateway host name did not resolve.",
    payload: ["errno"],
    seededFrom: "classifyGatewayFetchFailure `dns` in gateway-reachability.ts"
  },
  "SAND-E0105": {
    name: "gatewayNetwork",
    domain: "transport",
    retryable: true,
    summary: "Gateway transport failed on a live-but-broken route.",
    payload: ["errno"],
    seededFrom: "classifyGatewayFetchFailure `network` in gateway-reachability.ts"
  },
  "SAND-E0106": {
    name: "backendHttpStatus",
    domain: "transport",
    retryable: true,
    summary: "Cursor backend replied with a non-ok HTTP status.",
    payload: ["httpStatus"],
    seededFrom: "classifyDeliveryError BackendStatusError in sand-automation-fire-consumer.ts"
  },
  "SAND-E0107": {
    name: "backendUnreachable",
    domain: "transport",
    retryable: true,
    summary: "Cursor backend was unreachable over the transport.",
    payload: ["errno"],
    seededFrom: "classifyDeliveryError errno branch in sand-automation-fire-consumer.ts"
  },
  "SAND-E0108": {
    name: "backendDeliveryFailed",
    domain: "transport",
    retryable: true,
    summary: "Backend delivery attempt failed outside the status and errno shapes; the caller retries with backoff.",
    payload: [],
    seededFrom: "classifyDeliveryError fallback in sand-automation-fire-consumer.ts"
  },
  "SAND-E0109": {
    name: "logShipTimeout",
    domain: "transport",
    retryable: true,
    summary: "A structured-log submitLogs attempt hit the transport submit deadline; the batch requeues and redelivers.",
    payload: ["batchEntries"],
    seededFrom: "isDeadlineExpiry in structured-log-transport.ts shipLogs"
  },
  "SAND-E0110": {
    name: "streamStalled",
    domain: "transport",
    retryable: true,
    summary: "Established gateway event stream went silent past the stall watchdog and was torn down; the loop reconnects.",
    payload: [],
    seededFrom: "stallWatchdog downReason `stall-timeout` in gateway-client.ts"
  },
  "SAND-E0111": {
    name: "localExecNoProviders",
    domain: "transport",
    retryable: true,
    summary: "Local-machine action refused: no desktop is registered on the reverse local-exec channel.",
    payload: [],
    seededFrom: "requireProvider providers.size === 0 in local-exec-bridge.ts"
  },
  "SAND-E0112": {
    name: "localExecProvidersStale",
    domain: "transport",
    retryable: true,
    summary: "Local-machine action refused: desktops are registered on the reverse local-exec channel but none heartbeated inside the liveness window.",
    payload: [],
    seededFrom: "requireProvider live-resolve miss in local-exec-bridge.ts"
  },
  "SAND-E0113": {
    name: "localExecComputerUnknown",
    domain: "transport",
    retryable: true,
    summary: "Local-machine action refused: the addressed computer matches no registered desktop connection.",
    payload: [],
    seededFrom: "requireProvider unknown-computerId branch in local-exec-bridge.ts"
  },
  "SAND-E0114": {
    name: "localExecComputerAmbiguous",
    domain: "transport",
    retryable: true,
    summary: "Local-machine action refused: multiple computers are registered and the caller omitted machineId.",
    payload: [],
    seededFrom: "requireProvider missing-computerId branch in local-exec-bridge.ts"
  },
  "SAND-E0115": {
    name: "localExecMessagesUnsupported",
    domain: "transport",
    retryable: false,
    summary: "Messages op refused: the addressed computer is connected but its desktop app never declared the messagesOp capability.",
    payload: [],
    seededFrom: "requireProvider messages-op capability branch in local-exec-bridge.ts"
  },
  "SAND-E0116": {
    name: "gatewayPodHibernated",
    domain: "transport",
    retryable: true,
    summary: "Gateway route answered that the box pod is hibernated or mid-transition on its node.",
    payload: ["httpStatus"],
    seededFrom: "classifyGatewayHttpResponse `pod_hibernated` in gateway-reachability.ts"
  },
  "SAND-E0201": {
    name: "boxAccessDenied",
    domain: "auth",
    retryable: false,
    summary: "Backend refused box access for a NO_STORAGE (privacy-mode) account.",
    payload: [],
    seededFrom: "SandGatewayFailureMetadata `no-storage` in gateway-reachability.ts"
  },
  "SAND-E0202": {
    name: "gatewayAccessDenied",
    domain: "auth",
    retryable: false,
    summary: "Gateway attempt was refused by an auth/entitlement gate (401/403); a retry cannot fix it.",
    payload: ["httpStatus"],
    seededFrom: "classifyGatewayHttpResponse `access_denied` in gateway-reachability.ts"
  },
  "SAND-E0203": {
    name: "connectorAuthStartRefused",
    domain: "auth",
    retryable: false,
    summary: "Connector OAuth flow could not start: the connector cannot mint a sign-in link in its current state.",
    payload: ["reason"],
    seededFrom: "authenticateServer refusal branches in mcp-auth-watch-lifecycle.ts"
  },
  "SAND-E0204": {
    name: "connectorAuthStartFailed",
    domain: "auth",
    retryable: true,
    summary: "Connector OAuth flow failed to start: the backend OAuth status probe failed.",
    payload: ["reason"],
    seededFrom: "checkAuthStatus throw in mcp-auth-watch-lifecycle.ts authenticateServer"
  },
  "SAND-E0205": {
    name: "connectorOauthCallbackFailed",
    domain: "auth",
    retryable: true,
    summary: "Connector OAuth callback did not complete: the provider redirected an error or no code, or the backend rejected the exchange.",
    payload: ["reason"],
    seededFrom: "loopback handleRequest failure branches in mcp-oauth-loopback.ts"
  },
  "SAND-E0206": {
    name: "connectorAuthAbandoned",
    domain: "auth",
    retryable: true,
    summary: "Connector OAuth flow expired: the started flow's token never landed within the watch window.",
    payload: [],
    seededFrom: "pollPendingAuthWatch expiry in mcp-auth-watch-lifecycle.ts"
  },
  "SAND-E0207": {
    name: "webauthnNoProvider",
    domain: "auth",
    retryable: true,
    summary: "WebAuthn proxy ceremony refused: no desktop is registered on the reverse WebAuthn channel.",
    payload: [],
    seededFrom: "selectProvider empty registry in webauthn-proxy-bridge.ts"
  },
  "SAND-E0208": {
    name: "webauthnProviderStale",
    domain: "auth",
    retryable: true,
    summary: "WebAuthn proxy ceremony refused: desktops are registered but none heartbeated inside the liveness window.",
    payload: [],
    seededFrom: "selectProvider live-resolve miss in webauthn-proxy-bridge.ts"
  },
  "SAND-E0209": {
    name: "webauthnCeremonyTimedOut",
    domain: "auth",
    retryable: true,
    summary: "WebAuthn proxy ceremony timed out: the desktop never settled it inside the ceremony deadline.",
    payload: [],
    seededFrom: "DeadlineExceededError branch in webauthn-proxy-bridge.ts requestCeremony"
  },
  "SAND-E0210": {
    name: "webauthnConsentDeclined",
    domain: "auth",
    retryable: false,
    summary: "WebAuthn proxy ceremony declined by the user at the desktop consent prompt.",
    payload: [],
    seededFrom: "consent decline branch in node-agent-coordinator/webauthn/provider.ts"
  },
  "SAND-E0211": {
    name: "webauthnSignFailed",
    domain: "auth",
    retryable: true,
    summary: "WebAuthn proxy signing leg failed on the desktop: the signer reported a DOMException instead of an assertion.",
    payload: ["domError", "signErrorClass"],
    seededFrom: "signer error frames in node-agent-coordinator/webauthn/provider.ts"
  },
  "SAND-E0212": {
    name: "webauthnDesktopFailed",
    domain: "auth",
    retryable: true,
    summary: "WebAuthn proxy ceremony failed on the desktop outside the declined and signing shapes, or an older desktop reported no stage attribution.",
    payload: ["domError", "signErrorClass"],
    seededFrom: "unattributed error settlement in webauthn-proxy-bridge.ts"
  },
  "SAND-E0213": {
    name: "webauthnDispatchFailed",
    domain: "auth",
    retryable: true,
    summary: "WebAuthn proxy ceremony dispatch failed: the selected desktop's request stream refused the ceremony write.",
    payload: [],
    seededFrom: "provider.send throw in webauthn-proxy-bridge.ts requestCeremony"
  },
  "SAND-E0214": {
    name: "sessionRefreshHttpStatus",
    domain: "auth",
    retryable: true,
    summary: "Cursor session token refresh got a non-ok HTTP status; the session is kept and a later refresh may succeed.",
    payload: ["httpStatus"],
    seededFrom: "non-ok /oauth/token response in cursor-auth.ts runRefreshAccessToken"
  },
  "SAND-E0215": {
    name: "sessionRefreshNetwork",
    domain: "auth",
    retryable: true,
    summary: "Cursor session token refresh failed on the transport before any backend verdict; the session is kept.",
    payload: ["errno"],
    seededFrom: "fetch throw in cursor-auth.ts runRefreshAccessToken"
  },
  "SAND-E0216": {
    name: "sessionRefreshBadPayload",
    domain: "auth",
    retryable: true,
    summary: "Cursor session token refresh returned an ok status without a usable token payload; the session is kept.",
    payload: [],
    seededFrom: "unreadable body / empty access_token branches in cursor-auth.ts runRefreshAccessToken"
  },
  "SAND-E0217": {
    name: "sessionRefreshRejected",
    domain: "auth",
    retryable: false,
    summary: "Cursor session refresh was terminally rejected by the backend's shouldLogout verdict with no rotation-race rescue; the user was signed out.",
    payload: [],
    seededFrom: "shouldLogout sign-out in cursor-auth.ts runRefreshAccessToken"
  },
  "SAND-E0218": {
    name: "sessionPolicyRefused",
    domain: "auth",
    retryable: false,
    summary: "Cursor session refresh was refused by the device's MDM sign-in policy; the user was signed out.",
    payload: [],
    seededFrom: "MDM policy verdict in cursor-auth.ts runRefreshAccessToken"
  },
  "SAND-E0219": {
    name: "sessionSecretsUnavailable",
    domain: "auth",
    retryable: false,
    summary: "OS secure storage is unavailable, so the signed-in session's Cursor tokens are held in memory only and will not survive a restart.",
    payload: [],
    seededFrom: "noteSecretsUnavailableSession in cursor-auth.ts storeAuthentication callers"
  },
  "SAND-E0220": {
    name: "credentialSubmitFailed",
    domain: "auth",
    retryable: false,
    summary: "Browser credential fill wrote the password but the sign-in form could not be submitted safely, so the filled values were cleared and the user has to sign in themselves.",
    payload: [],
    seededFrom: "submit-failed refusal in credential-fill-executor.ts execute, projected by reportCredentialFillOutcome in structured-log-telemetry.ts"
  },
  "SAND-E0301": {
    name: "bootStageStalled",
    domain: "rebuild",
    retryable: true,
    summary: "Box rebuild stalled before completing a boot stage.",
    payload: ["stage"],
    seededFrom: "SAND_BOX_BOOT_STAGES in host/ports/telemetry.ts"
  },
  "SAND-E0302": {
    name: "hostLifecycleStalled",
    domain: "rebuild",
    retryable: true,
    summary: "In-box host startup stalled inside a lifecycle phase.",
    payload: [],
    seededFrom: "HostLifecycleProgress watchdog in host-lifecycle-progress.ts"
  },
  "SAND-E0303": {
    name: "hostLifecycleFailed",
    domain: "rebuild",
    retryable: true,
    summary: "In-box host startup failed inside a lifecycle phase.",
    payload: [],
    seededFrom: "HostLifecycleProgress.fail in host-lifecycle-progress.ts"
  },
  "SAND-E0304": {
    name: "boxImageCheckTimedOut",
    domain: "rebuild",
    retryable: true,
    summary: "Box image-update check hit its deadline before the backend answered.",
    payload: [],
    seededFrom: "DeadlineExceededError branch in forever-box-service.ts"
  },
  "SAND-E0305": {
    name: "boxImageCheckFailed",
    domain: "rebuild",
    retryable: true,
    summary: "Box image-update check failed before its deadline.",
    payload: ["errorClass"],
    seededFrom: "Image-check catch fallback in forever-box-service.ts"
  },
  "SAND-E0401": {
    name: "providerOverloaded",
    domain: "agent",
    retryable: true,
    summary: "Model provider is overloaded (capacity or rate limit).",
    payload: ["connectCode"],
    seededFrom: "isProviderCapacityError in transient-stream-error.ts"
  },
  "SAND-E0402": {
    name: "firstTokenStall",
    domain: "agent",
    retryable: true,
    summary: "Model provider streamed nothing within the first-token deadline.",
    payload: [],
    seededFrom: "isFirstTokenStallError in transient-stream-error.ts"
  },
  "SAND-E0403": {
    name: "streamReset",
    domain: "agent",
    retryable: true,
    summary: "Turn stream dropped on a transient transport reset.",
    payload: ["connectCode", "errno"],
    seededFrom: "isTransientStreamError in transient-stream-error.ts"
  },
  "SAND-E0404": {
    name: "contextWindowOverflow",
    domain: "agent",
    retryable: false,
    summary: "Turn hit a context-window overflow dead end a retry would repeat.",
    payload: [],
    seededFrom: "isContextOverflowDeadEnd in transient-stream-error.ts"
  },
  "SAND-E0405": {
    name: "backendRejected",
    domain: "agent",
    retryable: false,
    summary: "Backend rejected the turn with a terminal structured error.",
    payload: ["connectCode"],
    seededFrom: "isRetryableProviderError false + findBackendConnectError in turn-runtime.ts"
  },
  "SAND-E0406": {
    name: "turnRetryable",
    domain: "agent",
    retryable: true,
    summary: "Turn failed retryably outside every more specific shape.",
    payload: ["connectCode"],
    seededFrom: "isRetryableProviderError true in turn-runtime.ts"
  },
  "SAND-E0407": {
    name: "agentUnclassified",
    domain: "agent",
    retryable: false,
    summary: "Agent-path operation failed outside every classified shape.",
    payload: [],
    seededFrom: "classifyAgentError fallback in turn-runtime.ts"
  },
  "SAND-E0408": {
    name: "backendCapacityDeferred",
    domain: "agent",
    retryable: true,
    summary: "Backend deferred the turn at capacity with a server-paced retry-after; the runner sleeps the paced delay and retries.",
    payload: ["connectCode", "retryAfterMs"],
    seededFrom: "isProviderCapacityError + serverRetryAfterMsFromError in classifyAgentError (turn-runtime.ts)"
  },
  "SAND-E0409": {
    name: "memorySynthesisInvalidOutput",
    domain: "agent",
    retryable: false,
    summary: "Memory synthesis produced an invalid proposal: unparseable output, an unknown evidence citation, or a change the memory state rejected.",
    payload: [],
    seededFrom: "MemorySynthesisAttemptError invalid-output + applySynthesis invalid in memory-synthesis-service.ts"
  },
  "SAND-E0410": {
    name: "memorySynthesisRejected",
    domain: "agent",
    retryable: false,
    summary: "Memory synthesis verification did not approve the proposed changes.",
    payload: [],
    seededFrom: "MemorySynthesisAttemptError rejected in memory-synthesis-service.ts"
  },
  "SAND-E0411": {
    name: "memorySynthesisStale",
    domain: "agent",
    retryable: true,
    summary: "Memory files changed under a synthesis run; the pending evidence re-queues against the fresh state.",
    payload: [],
    seededFrom: "applySynthesis stale in memory-synthesis-service.ts"
  },
  "SAND-E0412": {
    name: "memorySynthesisEvidenceDropped",
    domain: "agent",
    retryable: false,
    summary: "Pending synthesis evidence was shed by a capacity cap before any run consumed it.",
    payload: [],
    seededFrom: "recordTurn overflow shedding in memory-synthesis-service.ts"
  },
  "SAND-E0413": {
    name: "memorySynthesisFailed",
    domain: "agent",
    retryable: true,
    summary: "Memory synthesis run failed outside the classified shapes (inference transport or deadline).",
    payload: [],
    seededFrom: "runAgent catch fallback in memory-synthesis-service.ts"
  },
  "SAND-E0414": {
    name: "conversationTooLarge",
    domain: "agent",
    retryable: false,
    summary: "Turn refused at the conversation-size hard cap: the live conversation tree is over the limit and GC could not shrink it, so the refusal repeats until GC succeeds or the user starts a new conversation.",
    payload: [],
    seededFrom: "SandConversationTooLargeError turn gate in conversation-size-limits.ts"
  },
  "SAND-E0415": {
    name: "streamIdleStall",
    domain: "agent",
    retryable: true,
    summary: "A turn stream that had already produced output went silent past the mid-stream idle deadline; the attempt is cancelled so the step settles, and only re-entered from a resume checkpoint.",
    payload: [],
    seededFrom: "isStreamIdleError in transient-stream-error.ts"
  },
  "SAND-E0416": {
    name: "agentIdentitySyncFailed",
    domain: "agent",
    retryable: true,
    summary: "Durable agent-identity sync against /sand/agents failed (boot GET after its bounded retries, or a write-through push/delete); the box keeps its durable profile.json / cache copy and the next reconcile retries.",
    payload: ["op", "httpStatus"],
    seededFrom: "SandAgentIdentityService reconcile/push/delete failure legs in agent-identity-service.ts"
  },
  "SAND-E0417": {
    name: "botBlock",
    domain: "agent",
    retryable: false,
    summary: "Turn landed on a bot-detection or auth-challenge wall (google.com/sorry, Cloudflare challenge, Akamai, ...); classified from the page URL + title by withBotBlockDetection.",
    payload: ["family"],
    seededFrom: "SandError.botBlock constructor"
  },
  "SAND-E0418": {
    name: "turnBackendUnreachable",
    domain: "agent",
    retryable: true,
    summary: "Turn never reached the Cursor backend: the transport failed on a Node system error (a refused connect or an unresolved host) with no server response.",
    payload: ["errno"],
    seededFrom: "isBackendUnreachableError in transient-stream-error.ts"
  },
  "SAND-E0501": {
    name: "updateFeedFetchFailed",
    domain: "update",
    retryable: true,
    summary: "Update-feed fetch threw before any HTTP status arrived (network, DNS, or TLS transport).",
    payload: [],
    seededFrom: "classifyUpdateCheckError `fetch_throw` in update-telemetry.ts"
  },
  "SAND-E0502": {
    name: "updateFeedHttpStatus",
    domain: "update",
    retryable: true,
    summary: "Update server replied with a non-ok HTTP status.",
    payload: ["httpStatus"],
    seededFrom: "classifyUpdateCheckError `http_non_ok` in update-telemetry.ts"
  },
  "SAND-E0503": {
    name: "updateFeedMalformed",
    domain: "update",
    retryable: false,
    summary: "Update server's response body failed the feed schema.",
    payload: [],
    seededFrom: "classifyUpdateCheckError `malformed_body` in update-telemetry.ts"
  },
  "SAND-E0504": {
    name: "updateCheckAborted",
    domain: "update",
    retryable: true,
    summary: "Update check aborted before a result (dispose, track change, or gate change); the next scheduled check retries.",
    payload: [],
    seededFrom: "checkForUpdates abort closure in sand-update-service.ts"
  },
  "SAND-E0505": {
    name: "updateDisabledByEnv",
    domain: "update",
    retryable: false,
    summary: "Updater is inert: updates disabled by environment override.",
    payload: [],
    seededFrom: "computeUpdateDisabledReason `disabled-by-env` in update-gate.ts"
  },
  "SAND-E0506": {
    name: "updateDisabledLabBuild",
    domain: "update",
    retryable: false,
    summary: "Updater is inert: a Sand Lab one-off build outside every track never self-updates.",
    payload: [],
    seededFrom: "computeUpdateDisabledReason `lab-build` in update-gate.ts"
  },
  "SAND-E0507": {
    name: "updateDisabledNotPackaged",
    domain: "update",
    retryable: false,
    summary: "Updater is inert: an unpackaged development run has nothing to update.",
    payload: [],
    seededFrom: "computeUpdateDisabledReason `not-packaged` in update-gate.ts"
  },
  "SAND-E0508": {
    name: "updateDisabledUnsupportedPlatform",
    domain: "update",
    retryable: false,
    summary: "Updater is inert: the platform has no supported update path.",
    payload: [],
    seededFrom: "computeUpdateDisabledReason `unsupported-platform` in update-gate.ts"
  },
  "SAND-E0509": {
    name: "updateStagedNotAdopted",
    domain: "update",
    retryable: true,
    summary: "A Squirrel-staged desktop build was not the one running on the next launch: ShipIt did not swap it in (an apply failure, or an unclean termination that skipped the swap). The updater re-stages on its next check.",
    payload: [],
    seededFrom: "decideUpdateApplySettlement staged/squirrel branch in apply-marker.ts"
  },
  "SAND-E0510": {
    name: "updateApplyIncomplete",
    domain: "update",
    retryable: true,
    summary: "An explicit restart-to-update was requested but the next launch still ran the old build: the handoff (ShipIt swap, or the parked Windows installer) never completed.",
    payload: [],
    seededFrom: "decideUpdateApplySettlement requested/spawned branches in apply-marker.ts"
  },
  "SAND-E0511": {
    name: "updateInstallerSpawnFailed",
    domain: "update",
    retryable: true,
    summary: "The parked Windows installer failed to spawn as the app quit for restart-to-update; the user relaunches into the old build.",
    payload: ["errno"],
    seededFrom: "installOnQuit spawn-error callback recorded by applyStagedOnQuit"
  },
  "SAND-E0512": {
    name: "updateAutoRelaunchFailed",
    domain: "update",
    retryable: false,
    summary: "The update applied but the post-install auto-relaunch never brought Sand back; the confirm arrived late, from a manual launch (SAND-1269).",
    payload: [],
    seededFrom: "decideUpdateApplySettlement confirmed_late branch in apply-marker.ts"
  },
  "SAND-E0513": {
    name: "updateCheckTimedOut",
    domain: "update",
    retryable: true,
    summary: "Update-feed fetch hit the check deadline with no response (black-holed network or captive portal); the in-flight guard clears and the next scheduled check retries.",
    payload: [],
    seededFrom: "classifyUpdateCheckError `timeout` in update-telemetry.ts"
  },
  "SAND-E0514": {
    name: "updateAppImageReplaceFailed",
    domain: "update",
    retryable: true,
    summary: "The verified AppImage could not replace the running one at restart-to-update (the rename or the mode change failed, or the AppImage path was no longer a regular file); the old AppImage stays in place and the user relaunches into the old build.",
    payload: ["errno"],
    seededFrom: "installOnQuit failure callback recorded by applyStagedOnQuit for the appimage mechanism"
  },
  "SAND-E0601": {
    name: "desktopStartupFailed",
    domain: "desktop",
    retryable: false,
    summary: "Desktop bootstrap threw before the app finished starting; the payload names the phase that was in progress.",
    payload: ["phase"],
    seededFrom: "app.whenReady bootstrap catch in electron-main/main.cts"
  },
  "SAND-E0602": {
    name: "desktopStartupStuck",
    domain: "desktop",
    retryable: true,
    summary: "Desktop bootstrap sat in one phase past the stuck watchdog without finishing, failing, or quitting.",
    payload: ["phase"],
    seededFrom: "desktop-startup-telemetry.ts stuck watchdog"
  },
  "SAND-E0603": {
    name: "desktopUncaughtException",
    domain: "desktop",
    retryable: false,
    summary: "Desktop main process uncaught exception, kept alive by the process crash guard.",
    payload: [],
    seededFrom: "installProcessCrashGuards reporter in electron-main/main.cts"
  },
  "SAND-E0604": {
    name: "desktopUnhandledRejection",
    domain: "desktop",
    retryable: false,
    summary: "Desktop main process unhandled promise rejection, kept alive by the process crash guard.",
    payload: [],
    seededFrom: "installProcessCrashGuards reporter in electron-main/main.cts"
  },
  "SAND-E0605": {
    name: "desktopChildProcessGone",
    domain: "desktop",
    retryable: true,
    summary: "An Electron child process (renderer, GPU, or utility) died abnormally under the desktop main process.",
    payload: ["process", "reason"],
    seededFrom: "render-process-gone / child-process-gone wiring in renderer-lifecycle-telemetry.ts"
  },
  "SAND-E0606": {
    name: "desktopCoordinatorHandoffFailed",
    domain: "desktop",
    retryable: true,
    summary: "A coordinator port handoff leg threw while transferring a data port; the next request or relaunch re-serves.",
    payload: ["leg"],
    seededFrom: "coordinator port sinks in electron-main/main.cts"
  },
  "SAND-E0607": {
    name: "desktopCoordinatorExitTimeout",
    domain: "desktop",
    retryable: true,
    summary: "A departing coordinator did not confirm exit within the account-handoff deadline; the handoff blocked on a zombie.",
    payload: ["timeoutMs"],
    seededFrom: "stop() deadline in coordinator-account-runtime.ts"
  },
  "SAND-E0608": {
    name: "desktopLocalExecSpawnFailed",
    domain: "desktop",
    retryable: true,
    summary: "The detached local-exec daemon failed to spawn from the desktop bundle.",
    payload: ["errno"],
    seededFrom: "spawnLocalExecDaemon error observer in local-exec-native.ts"
  },
  "SAND-E0609": {
    name: "desktopVncLivenessStall",
    domain: "desktop",
    retryable: true,
    summary: "The interactive box-desktop viewer forwarded repeated key/click input while the framebuffer drew nothing and the wire stayed silent for the rolling window: the connected-but-frozen fingerprint the RFB lifecycle cannot see.",
    payload: [],
    seededFrom: "createVncLivenessDetector emission in box-vnc-liveness.ts"
  },
  "SAND-E0610": {
    name: "desktopUncleanExit",
    domain: "desktop",
    retryable: false,
    summary: "A prior desktop session's alive marker was never settled by a clean quit: the main process died out from under the app (native crash, OS OOM kill, force-quit, or power loss), observed and reported at the next boot.",
    payload: [],
    seededFrom: "decideUncleanExitSettlement in desktop-unclean-exit-telemetry.ts"
  },
  "SAND-E0611": {
    name: "clientRestoreFailed",
    domain: "desktop",
    retryable: true,
    summary: "The renderer Client's restore threw before it published ready; the payload names the last restore stage that completed, and the shell offers Retry.",
    payload: ["stage"],
    seededFrom: "restore catch in electron-renderer/client/sand-client.ts"
  },
  "SAND-E0612": {
    name: "clientRestoreStuck",
    domain: "desktop",
    retryable: true,
    summary: "The renderer Client's restore passed the stuck deadline without publishing ready or failed; the payload names the last restore stage that completed.",
    payload: ["stage"],
    seededFrom: "restore stuck deadline in electron-renderer/client/sand-client.ts"
  },
  "SAND-E0613": {
    name: "desktopPreloadError",
    domain: "desktop",
    retryable: false,
    summary: "The main window's preload script threw before it exposed the desktop bridge, so the renderer that loads next has no capability and the app never runs.",
    payload: ["errorClass"],
    seededFrom: "preload-error listener in renderer-lifecycle-telemetry.ts"
  },
  "SAND-E0614": {
    name: "policyStopped",
    domain: "desktop",
    retryable: false,
    summary: "A Dune polling tick or frame callback threw, so the named background loop stopped and never runs again until the process restarts.",
    payload: ["reason"],
    seededFrom: "policyStopped rows in desktop-structured-log-telemetry.ts and structured-log-telemetry.ts"
  },
  "SAND-E0700": {
    name: "clientSliceCorrupt",
    domain: "storage",
    retryable: false,
    summary: "A persisted Client slice failed its envelope parse or its owner's value codec at load; the owner resets the slice.",
    payload: [],
    seededFrom: "parseEnvelope corrupt + noteValueRejected in client/persistence.ts"
  },
  "SAND-E0701": {
    name: "clientSliceIoError",
    domain: "storage",
    retryable: true,
    summary: "A Client persistence port operation (read, write, remove, or list) threw.",
    payload: ["errno"],
    seededFrom: "PersistenceRegistry port-operation catch in client/persistence.ts"
  },
  "SAND-E0702": {
    name: "clientSliceQuotaExceeded",
    domain: "storage",
    retryable: false,
    summary: "A Client slice write was refused for storage quota; retrying cannot free space.",
    payload: [],
    seededFrom: "isQuotaFailure branch of reportThrown in client/persistence.ts"
  },
  "SAND-E0703": {
    name: "clientQueuedFlushNonceMismatch",
    domain: "storage",
    retryable: false,
    summary: "A queued send reached the Host with a nonce whose accepted digest did not match.",
    payload: [],
    seededFrom: "NONCE_DIGEST_MISMATCH in client/send/send-journal.ts queuedFlushFailureCause"
  },
  "SAND-E0704": {
    name: "clientQueuedFlushCapabilityUnavailable",
    domain: "storage",
    retryable: false,
    summary: "A queued send could not flush because the Host lacks the required send capability.",
    payload: [],
    seededFrom: "SAND_SOURCE_CAPABILITY_UNAVAILABLE in client/send/send-journal.ts queuedFlushFailureCause"
  },
  "SAND-E0705": {
    name: "clientQueuedFlushHostRejected",
    domain: "storage",
    retryable: false,
    summary: "Acceptance-status resolution proved that the Host rejected a queued send.",
    payload: [],
    seededFrom: "rejected acceptance status in client/send/send-journal.ts resolveRecord"
  },
  "SAND-E0706": {
    name: "clientQueuedSendSuperseded",
    domain: "storage",
    retryable: false,
    summary: "An explicit recovery action retired an offline-queued send without delivery proof.",
    payload: [],
    seededFrom: "retireCanceled in client/send/send-journal.ts"
  },
  "SAND-E0707": {
    name: "clientQueuedSendAckExpired",
    domain: "storage",
    retryable: false,
    summary: "A flushed queued send received no authoritative echo before its online ACK deadline.",
    payload: [],
    seededFrom: "markAckTimedOut in client/send/send-journal.ts"
  },
  "SAND-E0720": {
    name: "journalAppendFailed",
    domain: "storage",
    retryable: true,
    summary: "Committing the prepared transcript WAL into the canonical journal failed; the checkpoint stays durable and the turn path surfaces the error.",
    payload: ["errno"],
    seededFrom: "commitCheckpoint in transcript-mirror.ts"
  },
  "SAND-E0721": {
    name: "journalCheckpointFailed",
    domain: "storage",
    retryable: true,
    summary: "Deriving or writing the pending transcript WAL checkpoint failed before anything was committed.",
    payload: ["errno"],
    seededFrom: "prepareCheckpoint in transcript-mirror.ts"
  },
  "SAND-E0722": {
    name: "journalCorruptTail",
    domain: "storage",
    retryable: false,
    summary: "The transcript journal was missing, truncated, or torn at open for a conversation with durable history; it was discarded and rebuilt from the checkpoint.",
    payload: ["tail", "errno"],
    seededFrom: "initialize rebuild branch in transcript-mirror.ts"
  },
  "SAND-E0723": {
    name: "journalReplayFailed",
    domain: "storage",
    retryable: true,
    summary: "Reconciling the pending transcript WAL against the durable checkpoint at recover failed; the journal cannot advance until the mismatch resolves.",
    payload: ["errno"],
    seededFrom: "recover in transcript-mirror.ts"
  },
  "SAND-E0724": {
    name: "journalRebuildFailed",
    domain: "storage",
    retryable: true,
    summary: "Re-deriving the transcript journal from the durable checkpoint failed after a corrupt or absent journal was discarded; the next recover retries the rebuild.",
    payload: ["tail", "errno"],
    seededFrom: "initialize rebuild branch in transcript-mirror.ts"
  },
  "SAND-E0725": {
    name: "checkpointPublicationFailed",
    domain: "storage",
    retryable: true,
    summary: "Publishing the turn's checkpoint root pointer was not durably persisted; the prior checkpoint stays authoritative and the turn fails closed.",
    payload: [],
    seededFrom: "SandCheckpointPublicationError latestRootBlobId publish gate in agent-db.ts"
  },
  "SAND-E0801": {
    name: "cookieApprovalNoMachine",
    domain: "chrome-import",
    retryable: true,
    summary: "Chrome cookie origin approval refused: no desktop coordinator is connected, so there is no machine to ask.",
    payload: [],
    seededFrom: "providers.size === 0 refusal in cookie-origin-approval-bridge.ts request, and hasUserComputer() false in grokBotCookieOriginApprovalPort.ts"
  },
  "SAND-E0802": {
    name: "cookieApprovalMachineStale",
    domain: "chrome-import",
    retryable: true,
    summary: "Chrome cookie origin approval refused: desktops are registered but none heartbeated inside the liveness window.",
    payload: [],
    seededFrom: "selectProvider live-resolve miss in cookie-origin-approval-bridge.ts request"
  },
  "SAND-E0803": {
    name: "cookieApprovalNoWindow",
    domain: "chrome-import",
    retryable: true,
    summary: "Chrome cookie origin approval refused: no Grok Bot window on the desktop carries the approval hook.",
    payload: [],
    seededFrom: "CookieOriginApprovalNoWindowError branches in cookie-origin-approval-executor.ts"
  },
  "SAND-E0804": {
    name: "cookieApprovalNoMatch",
    domain: "chrome-import",
    retryable: false,
    summary: "Chrome cookie origin approval refused: no Chrome cookies match the requested origins.",
    payload: [],
    seededFrom: "matchCookieOriginApprovalItems empty branch in cookie-origin-approval-executor.ts"
  },
  "SAND-E0805": {
    name: "cookieApprovalExpired",
    domain: "chrome-import",
    retryable: true,
    summary: "Chrome cookie origin approval refused: the ask TTL fired before the user answered.",
    payload: [],
    seededFrom: "askTtl expiry in cookie-origin-approval-bridge.ts request"
  },
  "SAND-E0806": {
    name: "cookieApprovalAborted",
    domain: "chrome-import",
    retryable: false,
    summary: "Chrome cookie origin approval refused: the request was cancelled (turn abort) before the user answered.",
    payload: [],
    seededFrom: "abort refusals in cookie-origin-approval-bridge.ts and cancelAndRefuse/abortedReply in cookie-origin-approval-executor.ts"
  },
  "SAND-E0807": {
    name: "cookieApprovalUnavailable",
    domain: "chrome-import",
    retryable: true,
    summary: "Chrome cookie origin approval refused: the desktop present leg failed outside every classified shape.",
    payload: [],
    seededFrom: "unclassified present-leg refusals in cookie-origin-approval-executor.ts and node-agent-coordinator/cookie-origin-approval/provider.ts"
  },
  "SAND-E0808": {
    name: "cookieApprovalEnumerateFailed",
    domain: "chrome-import",
    retryable: true,
    summary: "Chrome cookie origin approval failed: desktop cookie enumeration threw.",
    payload: ["errorClass"],
    seededFrom: "listCookieAllowItems catch in cookie-origin-approval-executor.ts"
  },
  "SAND-E0809": {
    name: "cookieApprovalCollectFailed",
    domain: "chrome-import",
    retryable: true,
    summary: "Chrome cookie origin approval failed: desktop cookie collection after a grant threw.",
    payload: ["errorClass"],
    seededFrom: "collectCookiesForGrants catch in cookie-origin-approval-executor.ts"
  },
  "SAND-E0810": {
    name: "cookieInjectFailed",
    domain: "chrome-import",
    retryable: true,
    summary: "Chrome cookie inject failed in the box: the inject leg threw (script error, box Chrome CDP missing, or box unreachable).",
    payload: ["errorClass"],
    seededFrom: "inject catch in cookie-origin-approval-service.ts"
  },
  "SAND-E0811": {
    name: "cookieImportGateOff",
    domain: "chrome-import",
    retryable: false,
    summary: "Chrome cookie inject refused: the sand_import_chrome_cookies gate is off, so a retry cannot succeed until the gate flips.",
    payload: [],
    seededFrom: "isEnabled() false branch in chrome-cookie-import-service.ts inject"
  },
  "SAND-E0812": {
    name: "chromeCookieImportFailed",
    domain: "chrome-import",
    retryable: true,
    summary: "Manual Settings Chrome cookie import failed outside every classified shape.",
    payload: ["errorClass"],
    seededFrom: "importChromeCookies catch in main-edge.ts"
  }
};
function buildSandErrorConstructors() {
  const constructors = {};
  for (const [code, definition2] of Object.entries(SAND_ERROR_DEFINITIONS)) {
    constructors[definition2.name] = (payload) => ({ code, ...payload });
  }
  return constructors;
}
var SandError = buildSandErrorConstructors();
var UNREGISTERED_CODE = "SAND-E0001";
var BOUNDED_TAG_VALUE = /^[0-9A-Za-z._|:-]{1,64}$/;
function isRegisteredCode(code) {
  return typeof code === "string" && Object.hasOwn(SAND_ERROR_DEFINITIONS, code);
}
function sandErrorWireCode(error41) {
  const code = error41.code;
  return isRegisteredCode(code) ? code : UNREGISTERED_CODE;
}
function tagName(field) {
  return field.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
}
function sandErrorTags(error41) {
  const code = sandErrorWireCode(error41);
  const definition2 = SAND_ERROR_DEFINITIONS[code];
  const tags = {
    error_code: code,
    error_domain: definition2.domain,
    error_retryable: String(definition2.retryable)
  };
  if (code !== error41.code) return tags;
  const declared = new Set(definition2.payload);
  for (const [field, value] of Object.entries(error41)) {
    if (field === "code" || value === void 0 || !declared.has(field)) continue;
    if (typeof value === "number" && Number.isFinite(value)) {
      tags[tagName(field)] = String(value);
    } else if (typeof value === "boolean") {
      tags[tagName(field)] = String(value);
    } else if (typeof value === "string" && BOUNDED_TAG_VALUE.test(value)) {
      tags[tagName(field)] = value;
    }
  }
  return tags;
}

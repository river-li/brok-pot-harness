var BOX_CDP_PORT_BASE2 = 9222;
var SENSITIVE_BROWSER_POLL_MS = 100;
function createSandBrowserOpRunner(deps) {
  let uploaded;
  const ensureUploaded = (ctx) => {
    uploaded ??= deps.agentBox.uploadFile(
      ctx,
      deps.boxId,
      SAND_BROWSER_DRIVER_BOX_PATH,
      import_node_buffer7.Buffer.from(SAND_BROWSER_DRIVER_SOURCE, "utf8")
    ).catch((error42) => {
      uploaded = void 0;
      throw new Error(`Could not install the browser driver on the box: ${errorMessage(error42)}`);
    });
    return uploaded;
  };
  const sensitiveRequest = async (ctx, encoded, op) => {
    const downloadFile = deps.agentBox.downloadFile?.bind(deps.agentBox);
    const terminalsFolder = deps.terminalsFolder;
    if (downloadFile === void 0 || terminalsFolder === void 0) {
      return { ok: false, infra: true, error: "protected browser transport is unavailable" };
    }
    const spawned = await deps.resourceAccessor.get(backgroundShellExecutorResource).execute(
      ctx,
      new BackgroundShellSpawnArgs({
        command: `node ${SAND_BROWSER_DRIVER_BOX_PATH} --stdin`,
        workingDirectory: "/workspace",
        toolCallId: `sand-user-form-${op}-${Date.now()}`,
        enableWriteShellStdinTool: true,
        suppressStdinLogging: true,
        skipApproval: true,
        description: "Run protected browser form operation"
      })
    );
    if (spawned.result.case !== "success") {
      return {
        ok: false,
        infra: true,
        error: `browser driver could not start (${spawned.result.case ?? "unknown"})`
      };
    }
    const shellId = spawned.result.value.shellId;
    const terminalPath = `${terminalsFolder}/${shellId}.txt`;
    const deadlineMs = Date.now() + SAND_BROWSER_DRIVER_SHELL_TIMEOUT_MS;
    const written = await deps.resourceAccessor.get(writeBackgroundShellInputExecutorResource).execute(ctx, new WriteShellStdinArgs({ shellId, chars: `${encoded}
` }));
    if (written.result.case !== "success") {
      return {
        ok: false,
        infra: true,
        error: `browser driver input failed (${written.result.case ?? "unknown"})`
      };
    }
    const downloadTerminal = async () => await downloadFile(ctx, deps.boxId, terminalPath, {
      maxBytes: 512 * 1024
    }).then(
      (data) => ({
        kind: "downloaded",
        output: import_node_buffer7.Buffer.from(data).toString("utf8")
      }),
      () => ({ kind: "unavailable" })
    );
    while (Date.now() < deadlineMs) {
      const terminal = await downloadTerminal();
      if (terminal.kind === "downloaded") {
        const response = parseDriverResponse(terminal.output);
        if (response !== void 0) {
          return {
            ok: response.ok,
            ...response.infra === true ? { infra: true } : {},
            ...response.error !== void 0 ? { error: response.error } : {},
            ...response.data !== void 0 ? { data: response.data } : {},
            ...response.url !== void 0 ? { url: response.url } : {},
            ...response.meta !== void 0 ? { meta: response.meta } : {},
            ...response.control !== void 0 ? { control: response.control } : {},
            ...response.opDurationMs !== void 0 ? { opDurationMs: response.opDurationMs } : {}
          };
        }
        if (parseShellTerminalFooter(terminal.output).kind !== "running") {
          return {
            ok: false,
            infra: true,
            error: "browser driver exited without a result"
          };
        }
      }
      await (deps.wait ?? delay3)(SENSITIVE_BROWSER_POLL_MS);
    }
    return {
      ok: false,
      infra: true,
      error: "browser driver timed out"
    };
  };
  return {
    async run(ctx, op, args) {
      const request5 = {
        ...args,
        op,
        display: deps.windowIndex,
        cdpPort: BOX_CDP_PORT_BASE2 + deps.windowIndex,
        launchBrowser: false
      };
      const encoded = import_node_buffer7.Buffer.from(JSON.stringify(request5), "utf8").toString("base64");
      const containsSubmittedValue = deps.protectSubmittedValues === true && (Object.hasOwn(args, "value") || Object.hasOwn(args, "values"));
      let result;
      try {
        await ensureUploaded(ctx);
        if (containsSubmittedValue) {
          return await sensitiveRequest(ctx, encoded, op);
        }
        result = await deps.resourceAccessor.get(shellExecutorResource).execute(
          ctx,
          buildHostShellArgs({
            command: `node ${SAND_BROWSER_DRIVER_BOX_PATH} ${encoded}`,
            name: "node",
            workingDirectory: "/workspace",
            toolCallId: `sand-user-form-${op}-${Date.now()}`,
            timeoutMs: SAND_BROWSER_DRIVER_SHELL_TIMEOUT_MS
          })
        );
      } catch (error42) {
        return { ok: false, infra: true, error: errorMessage(error42) };
      }
      if (result.result.case !== "success") {
        return {
          ok: false,
          infra: true,
          error: describeSandBrowserShellError(result)
        };
      }
      const response = parseDriverResponse(result.result.value.stdout);
      if (response === void 0) {
        return {
          ok: false,
          infra: true,
          error: describeSandBrowserShellError(result)
        };
      }
      return {
        ok: response.ok,
        ...response.infra === true ? { infra: true } : {},
        ...response.error !== void 0 ? { error: response.error } : {},
        ...response.data !== void 0 ? { data: response.data } : {},
        ...response.url !== void 0 ? { url: response.url } : {},
        ...response.meta !== void 0 ? { meta: response.meta } : {},
        ...response.control !== void 0 ? { control: response.control } : {},
        ...response.opDurationMs !== void 0 ? { opDurationMs: response.opDurationMs } : {}
      };
    }
  };
}
var SNAPSHOT_REF_PATTERN = /\[ref=(e\d+)\]/;
var SNAPSHOT_LINE_ROLE_PATTERN = /^\s*- (\S+)/;
var SNAPSHOT_LINE_NAME_PATTERN = /^\s*- \S+ "((?:[^"\\]|\\.)*)"/;
function pickRefLine(lines2, preferredRole, matches) {
  let any2;
  for (const line of lines2) {
    const match2 = SNAPSHOT_REF_PATTERN.exec(line);
    if (match2?.[1] === void 0) continue;
    if (!matches(line)) continue;
    if (preferredRole === void 0 || SNAPSHOT_LINE_ROLE_PATTERN.exec(line)?.[1] === preferredRole) {
      return { preferred: match2[1], any: any2 ?? match2[1] };
    }
    any2 ??= match2[1];
  }
  return any2 === void 0 ? {} : { any: any2 };
}
function lettersAndDigitsSoAVisibleLabelMatchesItsCamelCaseAriaLabelName(text2) {
  return text2.toLowerCase().replace(/[^\p{L}\p{N}]/gu, "");
}
var LABEL_WORD_PATTERN = /[\p{L}\p{N}]+/gu;
function wordsOf(text2) {
  return text2.toLowerCase().match(LABEL_WORD_PATTERN) ?? [];
}
function wordsOfLabelAfterCollapsingEmailAddressAndPhoneNumber(text2) {
  const words2 = wordsOf(text2);
  const collapsed = [];
  for (let i = 0; i < words2.length; i++) {
    const word = words2[i];
    if (word === void 0) continue;
    const next = words2[i + 1];
    if (word === "email" && next === "address" || word === "phone" && next === "number") {
      collapsed.push(word);
      i++;
      continue;
    }
    collapsed.push(word);
  }
  return collapsed;
}
function pickTheOnlyPreferredRoleRefWhoseNameCarriesEveryWordOfTheLabelInAnyOrder(lines2, needle, preferredRole) {
  if (preferredRole === void 0) return void 0;
  const labelWords = wordsOfLabelAfterCollapsingEmailAddressAndPhoneNumber(needle);
  if (labelWords.length === 0) return void 0;
  let only;
  for (const line of lines2) {
    const ref = SNAPSHOT_REF_PATTERN.exec(line)?.[1];
    if (ref === void 0 || SNAPSHOT_LINE_ROLE_PATTERN.exec(line)?.[1] !== preferredRole) continue;
    const nameWords = new Set(wordsOf(SNAPSHOT_LINE_NAME_PATTERN.exec(line)?.[1] ?? ""));
    if (!labelWords.every((word) => nameWords.has(word))) continue;
    if (only !== void 0) return void 0;
    only = ref;
  }
  return only;
}
function pickTheOnlyPreferredRoleRefWhoseNameIsEntirelyContainedInTheLabel(lines2, needle, preferredRole) {
  if (preferredRole === void 0) return void 0;
  const labelWords = new Set(wordsOfLabelAfterCollapsingEmailAddressAndPhoneNumber(needle));
  if (labelWords.size === 0) return void 0;
  let only;
  for (const line of lines2) {
    const ref = SNAPSHOT_REF_PATTERN.exec(line)?.[1];
    if (ref === void 0 || SNAPSHOT_LINE_ROLE_PATTERN.exec(line)?.[1] !== preferredRole) continue;
    const nameWords = wordsOfLabelAfterCollapsingEmailAddressAndPhoneNumber(
      SNAPSHOT_LINE_NAME_PATTERN.exec(line)?.[1] ?? ""
    );
    if (nameWords.length === 0 || !nameWords.every((word) => labelWords.has(word))) continue;
    if (only !== void 0) return void 0;
    only = ref;
  }
  return only;
}
function resolveLabelRefFromSnapshot(snapshot, label, preferredRole) {
  const needle = label.trim().toLowerCase();
  if (needle.length === 0) return void 0;
  const lines2 = snapshot.split("\n");
  const verbatim = pickRefLine(lines2, preferredRole, (line) => line.toLowerCase().includes(needle));
  if (verbatim.preferred !== void 0) return verbatim.preferred;
  const significantNeedle = lettersAndDigitsSoAVisibleLabelMatchesItsCamelCaseAriaLabelName(needle);
  const significant = significantNeedle.length === 0 ? {} : pickRefLine(lines2, preferredRole, (line) => {
    const name17 = SNAPSHOT_LINE_NAME_PATTERN.exec(line)?.[1];
    return name17 !== void 0 && lettersAndDigitsSoAVisibleLabelMatchesItsCamelCaseAriaLabelName(name17).includes(
      significantNeedle
    );
  });
  return significant.preferred ?? verbatim.any ?? significant.any ?? pickTheOnlyPreferredRoleRefWhoseNameCarriesEveryWordOfTheLabelInAnyOrder(
    lines2,
    needle,
    preferredRole
  ) ?? pickTheOnlyPreferredRoleRefWhoseNameIsEntirelyContainedInTheLabel(lines2, needle, preferredRole);
}
function firstRefFromSnapshot(snapshot) {
  return SNAPSHOT_REF_PATTERN.exec(snapshot)?.[1];
}
function fillOpFor(field) {
  if (field.type === "checkbox") return null;
  if (field.type === "select") {
    return { op: "select_option", args: (ref, value) => ({ ref, values: [value] }) };
  }
  if (isSecretUserFormField(field)) {
    return { op: "fill", args: (ref, value) => ({ ref, value, secret: true }) };
  }
  return { op: "fill", args: (ref, value) => ({ ref, value }) };
}
function fillableSnapshotRole(field) {
  return field.type === "select" ? "combobox" : "textbox";
}
function isTargetedUserFormFillValue(entry) {
  return entry.field.target != null && fillOpFor(entry.field) !== null;
}
function userFormFillValuesOf(form, values) {
  return form.fields.flatMap((field) => {
    const value = values[field.id];
    if (value == null || value.length === 0) return [];
    if (form.domain == null && (field.target != null || isSecretUserFormField(field))) {
      return [];
    }
    return [
      {
        field: {
          id: field.id,
          label: field.label,
          type: field.type,
          ...isSecretUserFormField(field) ? { secret: true } : {},
          ...field.target != null ? { target: field.target } : {}
        },
        value
      }
    ];
  });
}
function userFormFieldOutcomesOf(form, result) {
  const outcomeById = new Map(result.outcomes.map((outcome) => [outcome.id, outcome]));
  return form.fields.map((field) => outcomeById.get(field.id) ?? { id: field.id, filled: false });
}
var FIELD_FAILURE_KIND_RANK_MOST_DIAGNOSTIC_FIRST = {
  driver_unavailable: 0,
  in_unreachable_frame: 1,
  in_closed_shadow: 2,
  target_gone: 3,
  fill_op_failed: 4,
  target_missing: 5
};
function classifyUserFormFailureReason(result, outcomes) {
  const anythingFailed = outcomes.some((outcome) => outcome.fillFailed === true) || result.domainMismatch != null;
  if (!anythingFailed) return void 0;
  if (result.domainMismatch != null) {
    if (result.domainMismatch.phase === "mid_fill") return "mid_fill_domain_drift";
    return result.domainMismatch.liveHost != null ? "domain_mismatch" : "no_matching_tab";
  }
  if (result.pageMoved != null) return "page_moved";
  let mostDiagnostic;
  for (const kind of Object.values(result.fillFailureKinds ?? {})) {
    if (mostDiagnostic === void 0 || FIELD_FAILURE_KIND_RANK_MOST_DIAGNOSTIC_FIRST[kind] < FIELD_FAILURE_KIND_RANK_MOST_DIAGNOSTIC_FIRST[mostDiagnostic]) {
      mostDiagnostic = kind;
    }
  }
  return mostDiagnostic ?? "fill_op_failed";
}
function classifyFailedLookup(result) {
  return result.infra === true ? "driver_unavailable" : "target_missing";
}
function classifyFailedWrite(result) {
  if (result.infra === true) return "driver_unavailable";
  if (isStaleRefDriverError(result.error)) return "target_gone";
  if (isHiddenTargetDriverError(result.error)) return "target_missing";
  return "fill_op_failed";
}
function classifyUnresolvedSelector(meta) {
  if (meta?.selectorClosedShadow === true) return "in_closed_shadow";
  return "target_missing";
}
async function resolveTargetRef(ctx, runner, target, preferredRole, fullSnapshot, belt) {
  if (target.kind === "ref") return { ref: target.value };
  if (target.kind === "selector") {
    const scoped = await runner.run(ctx, "snapshot", {
      selector: target.value,
      interactive: true,
      maxDepth: 4
    });
    if (!scoped.ok || scoped.data === void 0 || !belt.trustResult(scoped)) {
      return { failure: classifyFailedLookup(scoped) };
    }
    const ref2 = firstRefFromSnapshot(scoped.data);
    if (ref2 !== void 0) return { ref: ref2 };
    return { failure: classifyUnresolvedSelector(scoped.meta) };
  }
  const snapshot = await fullSnapshot();
  if (!snapshot.ok || snapshot.data === void 0 || !belt.trustResult(snapshot)) {
    return { failure: classifyFailedLookup(snapshot) };
  }
  const ref = resolveLabelRefFromSnapshot(snapshot.data, target.value, preferredRole);
  if (ref !== void 0) return { ref };
  return {
    failure: (snapshot.meta?.unreachableFrames ?? 0) > 0 ? "in_unreachable_frame" : "target_missing"
  };
}
function isStaleRefDriverError(error42) {
  return error42 !== void 0 && error42.includes(SAND_BROWSER_STALE_REF_ERROR);
}
function isHiddenTargetDriverError(error42) {
  return error42 !== void 0 && error42.includes(SAND_BROWSER_HIDDEN_TARGET_ERROR);
}
var RETRY_CANNOT_CURE = /* @__PURE__ */ new Set([
  "in_unreachable_frame",
  "in_closed_shadow"
]);
var PREFLIGHT_UNCHECKED = { checked: false, doomedFieldKinds: {} };
function snapshotDataWithMeta(result) {
  if (!result.ok || result.data === void 0) return void 0;
  if (result.meta === void 0) return { data: result.data };
  return { data: result.data, meta: result.meta };
}
function hasHostFillableUserFormTargets(fields2) {
  return fields2.some((field) => field.target != null && fillOpFor(field) !== null);
}
function isUserFormPreflightUnfillable(fields2, preflight) {
  if (!preflight.checked) return false;
  const targeted = fields2.filter((field) => field.target != null && fillOpFor(field) !== null);
  return targeted.length > 0 && targeted.every((field) => preflight.doomedFieldKinds[field.id] !== void 0);
}
async function preflightUserFormTargets(ctx, runner, fields2, claimedDomain) {
  const targeted = fields2.filter((field) => field.target != null && fillOpFor(field) !== null);
  if (targeted.length === 0) return { checked: true, doomedFieldKinds: {} };
  if (!targeted.some((field) => field.target?.kind !== "ref")) {
    return { checked: true, doomedFieldKinds: {} };
  }
  const liveHost = await readLivePageHost(ctx, runner);
  if (liveHost === void 0 || !hostWithinClaimedUserFormDomain(liveHost, claimedDomain)) {
    return PREFLIGHT_UNCHECKED;
  }
  const doomed = /* @__PURE__ */ new Map();
  let probeFullSnapshot;
  const fullSnapshot = async () => {
    probeFullSnapshot ??= runner.run(ctx, "snapshot", { interactive: true, probe: true });
    return snapshotDataWithMeta(await probeFullSnapshot);
  };
  for (const field of targeted) {
    const target = field.target;
    if (target == null || target.kind === "ref") continue;
    if (target.kind === "selector") {
      const scoped = await runner.run(ctx, "snapshot", {
        selector: target.value,
        interactive: true,
        maxDepth: 4,
        probe: true
      });
      if (!scoped.ok || scoped.data === void 0) continue;
      if (firstRefFromSnapshot(scoped.data) !== void 0) continue;
      const kind = classifyUnresolvedSelector(scoped.meta);
      if (kind === "in_closed_shadow" || kind === "in_unreachable_frame") {
        doomed.set(field.id, kind);
      }
      continue;
    }
    const snapshot = await fullSnapshot();
    if (snapshot === void 0) continue;
    const ref = resolveLabelRefFromSnapshot(
      snapshot.data,
      target.value,
      fillableSnapshotRole(field)
    );
    if (ref !== void 0) continue;
    if ((snapshot.meta?.unreachableFrames ?? 0) > 0) {
      doomed.set(field.id, "in_unreachable_frame");
    }
  }
  return { checked: true, doomedFieldKinds: Object.fromEntries(doomed) };
}
function hostMatchesConsentedUserFormHost(host, consentedHost) {
  const liveRaw = host.toLowerCase();
  const consentedRaw = consentedHost.toLowerCase();
  if (liveRaw.length > 0 && liveRaw === consentedRaw) return true;
  const live = liveRaw.replace(/^www\./, "");
  const consented = consentedRaw.replace(/^www\./, "");
  if (isLoopbackUserFormHost(live) || isLoopbackUserFormHost(consented)) {
    return isLoopbackUserFormHost(live) && isLoopbackUserFormHost(consented);
  }
  if ((0, import_tldts3.getDomain)(consented, { allowPrivateDomains: true }) === null) return false;
  return live === consented;
}
function hostWithinClaimedUserFormDomain(host, claimedDomain) {
  if (hostMatchesConsentedUserFormHost(host, claimedDomain)) return true;
  const liveHost = host.toLowerCase().replace(/^www\./, "");
  const claimed = claimedDomain.toLowerCase().replace(/^www\./, "");
  if ((0, import_tldts3.getDomain)(claimed, { allowPrivateDomains: true }) === null) return false;
  return liveHost.endsWith(`.${claimed}`);
}
function fillableHostOfUrl(url2) {
  try {
    const parsed2 = new URL(url2);
    if (parsed2.protocol !== "https:" && !(parsed2.protocol === "http:" && isLoopbackUserFormHost(parsed2.hostname))) {
      return void 0;
    }
    return parsed2.hostname.length > 0 ? parsed2.hostname : void 0;
  } catch {
    return void 0;
  }
}
async function readLivePageHost(ctx, runner) {
  return livePageHostOf(await runner.run(ctx, "screenshot", {}));
}
function livePageHostOf(probe) {
  if (!probe.ok || probe.url === void 0) return void 0;
  return fillableHostOfUrl(probe.url);
}
async function resolveUserFormLiveHost(ctx, runner, claimedDomain) {
  const lastUsed = await readLivePageHost(ctx, runner);
  if (lastUsed !== void 0 && hostWithinClaimedUserFormDomain(lastUsed, claimedDomain)) {
    return lastUsed;
  }
  try {
    const listed = await runner.run(ctx, "tabs", { action: "list" });
    if (!listed.ok || listed.data === void 0) return void 0;
    const entries = JSON.parse(listed.data);
    if (!Array.isArray(entries)) return void 0;
    const listedTabs = entries;
    for (const entry of listedTabs) {
      if (entry === null || typeof entry !== "object") continue;
      const { url: url2 } = entry;
      if (typeof url2 !== "string") continue;
      const host = fillableHostOfUrl(url2);
      if (host !== void 0 && hostWithinClaimedUserFormDomain(host, claimedDomain)) {
        return host;
      }
    }
    return void 0;
  } catch {
    return void 0;
  }
}
async function selectTabOnConsentedHost(ctx, runner, consentedHost) {
  const listed = await runner.run(ctx, "tabs", { action: "list" });
  if (!listed.ok || listed.data === void 0) {
    return listed.infra === true ? "driver_unavailable" : "no_tab";
  }
  let entries;
  try {
    entries = JSON.parse(listed.data);
  } catch {
    return "no_tab";
  }
  if (!Array.isArray(entries)) return "no_tab";
  const listedTabs = entries;
  let driverDied = false;
  for (const entry of listedTabs) {
    if (entry === null || typeof entry !== "object") continue;
    const { index, url: url2 } = entry;
    if (typeof index !== "number" || typeof url2 !== "string") continue;
    const host = fillableHostOfUrl(url2);
    if (host === void 0 || !hostMatchesConsentedUserFormHost(host, consentedHost)) continue;
    const selected = await runner.run(ctx, "tabs", { action: "select", index });
    const selectedHost = selected.url !== void 0 ? fillableHostOfUrl(selected.url) : void 0;
    if (selected.ok && selectedHost !== void 0 && hostMatchesConsentedUserFormHost(selectedHost, consentedHost)) {
      return "selected";
    }
    driverDied ||= selected.infra === true;
  }
  return driverDied ? "driver_unavailable" : "no_tab";
}
function createConsentedHostBelt(ctx, runner, consentedHost) {
  let lost = false;
  let moved = false;
  let anchorUrl;
  let liveHost;
  const markLost = (host) => {
    lost = true;
    if (host !== void 0) liveHost = host;
    return false;
  };
  const anchorFirstOnHostUrlAndMarkMovedWhenALaterOneDiffers = (url2) => {
    if (url2 === void 0) return;
    anchorUrl ??= url2;
    if (url2 !== anchorUrl) moved = true;
  };
  return {
    get lost() {
      return lost;
    },
    get movedToAnotherUrlWithinConsentedHost() {
      return moved;
    },
    get liveHost() {
      return liveHost;
    },
    async okToWrite() {
      if (consentedHost === void 0) return true;
      if (lost || moved) return false;
      const probe = await runner.run(ctx, "screenshot", {});
      const host = livePageHostOf(probe);
      if (host !== void 0) {
        if (!hostMatchesConsentedUserFormHost(host, consentedHost)) return markLost(host);
        anchorFirstOnHostUrlAndMarkMovedWhenALaterOneDiffers(probe.url);
        return !moved;
      }
      const selection = await selectTabOnConsentedHost(ctx, runner, consentedHost);
      if (selection === "no_tab") return markLost(void 0);
      return selection === "selected";
    },
    trustResult(result) {
      if (consentedHost === void 0 || result.url === void 0) return true;
      const host = fillableHostOfUrl(result.url);
      if (host !== void 0 && hostMatchesConsentedUserFormHost(host, consentedHost)) {
        anchorFirstOnHostUrlAndMarkMovedWhenALaterOneDiffers(result.url);
        return true;
      }
      return markLost(host);
    }
  };
}
var PAGE_MOVED_SNAPSHOT_MAX_CHARS = 5e3;
var SCRUBBED_VALUE_PLACEHOLDER = "<submitted-value>";
var MIN_SCRUB_CHARS_SO_LONE_CHARACTERS_DO_NOT_SHRED_THE_SNAPSHOT = 2;
function scrubSubmittedUserFormValues(text2, values) {
  const longestFirstSoAValueContainingAnotherIsNeverHalfScrubbed = [
    ...new Set(
      values.map((value) => value.trim()).filter((v2) => v2.length >= MIN_SCRUB_CHARS_SO_LONE_CHARACTERS_DO_NOT_SHRED_THE_SNAPSHOT)
    )
  ].sort((a, b2) => b2.length - a.length);
  let scrubbed = text2;
  for (const needle of longestFirstSoAValueContainingAnotherIsNeverHalfScrubbed) {
    const escaped = needle.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    scrubbed = scrubbed.replace(new RegExp(escaped, "gi"), SCRUBBED_VALUE_PLACEHOLDER);
  }
  return scrubbed;
}
function scrubThenClampSoACutCanNeverSplitAValueBackIntoView(data, submittedValues) {
  return clampBlock(
    scrubSubmittedUserFormValues(data, submittedValues),
    PAGE_MOVED_SNAPSHOT_MAX_CHARS
  );
}
function failAllFills(values) {
  return values.map(
    (entry) => entry.field.target != null ? { id: entry.field.id, filled: false, fillFailed: true } : { id: entry.field.id, filled: false }
  );
}
function driverUnavailableFillResult(values, submitAfterFill) {
  const kinds = Object.fromEntries(
    values.filter((entry) => entry.field.target != null).map((entry) => [entry.field.id, "driver_unavailable"])
  );
  return {
    outcomes: failAllFills(values),
    ...Object.keys(kinds).length > 0 ? { fillFailureKinds: kinds } : {},
    ...submitAfterFill === true ? { submit: { attempted: false } } : {}
  };
}
async function gateConsentedHostTab(ctx, runner, consentedHost) {
  const probe = await runner.run(ctx, "screenshot", {});
  if (probe.infra === true) return { kind: "driver_unavailable" };
  const liveHost = livePageHostOf(probe);
  if (liveHost !== void 0 && hostMatchesConsentedUserFormHost(liveHost, consentedHost)) {
    return { kind: "ok", refTargetsSuspectAfterTabSwitch: false };
  }
  const selection = await selectTabOnConsentedHost(ctx, runner, consentedHost);
  if (selection === "driver_unavailable") return { kind: "driver_unavailable" };
  if (selection === "no_tab") {
    return liveHost !== void 0 ? { kind: "no_tab", liveHost } : { kind: "no_tab" };
  }
  return { kind: "ok", refTargetsSuspectAfterTabSwitch: true };
}
var REMAP_CANNOT_CURE = /* @__PURE__ */ new Set([
  "driver_unavailable",
  "in_unreachable_frame",
  "in_closed_shadow"
]);
async function fillSandUserFormValues(ctx, runner, values, consentedHost, submitAfterFill, observeTiming, clock = realClock) {
  let refTargetsSuspectAfterTabSwitch = false;
  if (consentedHost !== void 0) {
    const gate = await gateConsentedHostTab(ctx, runner, consentedHost);
    if (gate.kind === "driver_unavailable") {
      return driverUnavailableFillResult(values, submitAfterFill);
    }
    if (gate.kind === "no_tab") {
      return {
        outcomes: failAllFills(values),
        domainMismatch: gate.liveHost !== void 0 ? { liveHost: gate.liveHost, phase: "gate" } : { phase: "gate" },
        ...submitAfterFill === true ? { submit: { attempted: false } } : {}
      };
    }
    refTargetsSuspectAfterTabSwitch = gate.refTargetsSuspectAfterTabSwitch;
  }
  const belt = createConsentedHostBelt(ctx, runner, consentedHost);
  const outcomes = /* @__PURE__ */ new Map();
  const failureKinds = /* @__PURE__ */ new Map();
  const filledControls = /* @__PURE__ */ new Map();
  const targeted = values.filter(isTargetedUserFormFillValue);
  for (const entry of values) {
    if (!targeted.includes(entry)) {
      outcomes.set(entry.field.id, { id: entry.field.id, filled: false });
    }
  }
  const rank = (entry) => {
    const kind = entry.field.target?.kind;
    if (kind === "ref") return refTargetsSuspectAfterTabSwitch ? 2 : 0;
    return kind === "selector" ? 1 : 2;
  };
  const ordered = [...targeted].sort((a, b2) => rank(a) - rank(b2));
  let fullSnapshotResult;
  const fullSnapshot = () => {
    fullSnapshotResult ??= runner.run(ctx, "snapshot", { interactive: true });
    return fullSnapshotResult;
  };
  const submittedValues = values.map((entry) => entry.value);
  for (const entry of ordered) {
    const declaredTarget = entry.field.target;
    const op = fillOpFor(entry.field);
    if (declaredTarget == null || op === null) continue;
    if (belt.lost || belt.movedToAnotherUrlWithinConsentedHost) {
      outcomes.set(entry.field.id, { id: entry.field.id, filled: false, fillFailed: true });
      continue;
    }
    const target = refTargetsSuspectAfterTabSwitch && declaredTarget.kind === "ref" ? { kind: "label", value: entry.field.label } : declaredTarget;
    let filled = false;
    let failureKind;
    const resolved = await resolveTargetRef(
      ctx,
      runner,
      target,
      fillableSnapshotRole(entry.field),
      fullSnapshot,
      belt
    );
    if ("failure" in resolved) {
      failureKind = resolved.failure;
    } else if (await belt.okToWrite()) {
      const writeStartedAt = clock.monotonicNow();
      const result = await runner.run(ctx, op.op, op.args(resolved.ref, entry.value));
      observeTiming?.(
        "write",
        result.opDurationMs ?? Math.max(0, clock.monotonicNow() - writeStartedAt)
      );
      filled = result.ok && belt.trustResult(result);
      if (filled && result.control !== void 0) {
        filledControls.set(entry.field.id, result.control);
      }
      if (!filled) failureKind = classifyFailedWrite(result);
    } else if (!belt.lost && !belt.movedToAnotherUrlWithinConsentedHost) {
      failureKind = "driver_unavailable";
    }
    outcomes.set(
      entry.field.id,
      filled ? { id: entry.field.id, filled: true } : { id: entry.field.id, filled: false, fillFailed: true }
    );
    if (!filled && failureKind !== void 0) failureKinds.set(entry.field.id, failureKind);
  }
  let pageMoved;
  let lastFreshSnapshotForTheRemapOffer;
  let healOutcome = "none";
  for (const entry of ordered) {
    if (belt.lost || belt.movedToAnotherUrlWithinConsentedHost || pageMoved !== void 0) break;
    if (outcomes.get(entry.field.id)?.fillFailed !== true) continue;
    const firstPassKind = failureKinds.get(entry.field.id);
    if (firstPassKind !== void 0 && RETRY_CANNOT_CURE.has(firstPassKind)) continue;
    const target = entry.field.target;
    const op = fillOpFor(entry.field);
    if (target == null || op === null) continue;
    const healStartedAt = clock.monotonicNow();
    const retried = await retryFillOnce(ctx, runner, entry, target, op, belt, firstPassKind);
    observeTiming?.("heal", Math.max(0, clock.monotonicNow() - healStartedAt));
    if (healOutcome === "none") healOutcome = "missed";
    if (retried.kind === "filled") {
      healOutcome = "landed";
      outcomes.set(entry.field.id, { id: entry.field.id, filled: true });
      failureKinds.delete(entry.field.id);
      if (retried.control !== void 0) filledControls.set(entry.field.id, retried.control);
      continue;
    }
    lastFreshSnapshotForTheRemapOffer = retried.freshSnapshot ?? lastFreshSnapshotForTheRemapOffer;
    if (retried.kind === "vanished") {
      pageMoved = {
        signal: "target_vanished",
        ...retried.freshSnapshot !== void 0 ? {
          valueScrubbedFreshSnapshot: scrubThenClampSoACutCanNeverSplitAValueBackIntoView(
            retried.freshSnapshot,
            submittedValues
          )
        } : {}
      };
    }
  }
  const finalOutcomes = values.map(
    (entry) => outcomes.get(entry.field.id) ?? { id: entry.field.id, filled: false }
  );
  const anyFillFailed = finalOutcomes.some((outcome) => outcome.fillFailed === true);
  const kinds = {
    ...failureKinds.size > 0 ? { fillFailureKinds: Object.fromEntries(failureKinds) } : {},
    ...filledControls.size > 0 ? { filledControls: Object.fromEntries(filledControls) } : {}
  };
  if (belt.lost) {
    return {
      outcomes: finalOutcomes,
      domainMismatch: belt.liveHost !== void 0 ? { liveHost: belt.liveHost, phase: "mid_fill" } : { phase: "mid_fill" },
      ...kinds,
      healOutcome,
      ...submitAfterFill === true ? { submit: { attempted: false } } : {}
    };
  }
  if (pageMoved === void 0 && belt.movedToAnotherUrlWithinConsentedHost && anyFillFailed) {
    const fresh = await runner.run(ctx, "snapshot", { interactive: true });
    pageMoved = {
      signal: "navigated",
      ...fresh.ok && fresh.data !== void 0 ? {
        valueScrubbedFreshSnapshot: scrubThenClampSoACutCanNeverSplitAValueBackIntoView(
          fresh.data,
          submittedValues
        )
      } : {}
    };
  }
  const remapFieldIds = consentedHost === void 0 ? [] : finalOutcomes.filter((outcome) => outcome.fillFailed === true).map((outcome) => outcome.id).filter((id) => {
    const kind = failureKinds.get(id);
    return kind === void 0 || !REMAP_CANNOT_CURE.has(kind);
  });
  let remap;
  if (remapFieldIds.length > 0) {
    if (pageMoved?.valueScrubbedFreshSnapshot !== void 0) {
      remap = { fieldIds: remapFieldIds };
    } else {
      const fresh = lastFreshSnapshotForTheRemapOffer ?? await readTrustedFreshSnapshot(ctx, runner, belt);
      remap = {
        fieldIds: remapFieldIds,
        ...fresh !== void 0 ? {
          valueScrubbedFreshSnapshot: scrubThenClampSoACutCanNeverSplitAValueBackIntoView(
            fresh,
            submittedValues
          )
        } : {}
      };
    }
  }
  const remapOffer = remap !== void 0 ? { remap } : {};
  if (pageMoved !== void 0) {
    return {
      outcomes: finalOutcomes,
      pageMoved,
      ...kinds,
      healOutcome,
      ...remapOffer,
      ...submitAfterFill === true ? { submit: { attempted: false } } : {}
    };
  }
  if (submitAfterFill !== true) {
    return { outcomes: finalOutcomes, ...kinds, healOutcome, ...remapOffer };
  }
  const anchor = anyFillFailed || belt.movedToAnotherUrlWithinConsentedHost ? void 0 : [...values].reverse().find(
    (entry) => isSubmitAnchorUserFormField(entry.field) && outcomes.get(entry.field.id)?.filled === true
  );
  let submit;
  if (anchor === void 0) {
    submit = { attempted: false };
  } else {
    const submitStartedAt = clock.monotonicNow();
    const submitted = await submitByEnterInLastFilledField(ctx, runner, anchor, belt);
    observeTiming?.(
      "submit",
      submitted.opDurationMs ?? Math.max(0, clock.monotonicNow() - submitStartedAt)
    );
    submit = { attempted: true, succeeded: submitted.succeeded };
  }
  return { outcomes: finalOutcomes, ...kinds, healOutcome, ...remapOffer, submit };
}
async function readTrustedFreshSnapshot(ctx, runner, belt) {
  const fresh = await runner.run(ctx, "snapshot", { interactive: true });
  return fresh.ok && belt.trustResult(fresh) ? fresh.data : void 0;
}
function classifyRefusedVisibilityProbe(probe) {
  if (probe.infra === true) return "driver_unavailable";
  return isStaleRefDriverError(probe.error) ? "target_gone" : "hidden_target";
}
async function remapSandUserFormValues(ctx, runner, values, consentedHost) {
  const gate = await gateConsentedHostTab(ctx, runner, consentedHost);
  if (gate.kind === "driver_unavailable") return driverUnavailableFillResult(values);
  if (gate.kind === "no_tab") {
    return {
      outcomes: failAllFills(values),
      domainMismatch: gate.liveHost !== void 0 ? { liveHost: gate.liveHost, phase: "gate" } : { phase: "gate" }
    };
  }
  const belt = createConsentedHostBelt(ctx, runner, consentedHost);
  const outcomes = [];
  const failureKinds = /* @__PURE__ */ new Map();
  const filledControls = /* @__PURE__ */ new Map();
  let fullSnapshotResult;
  const fullSnapshot = () => {
    fullSnapshotResult ??= runner.run(ctx, "snapshot", { interactive: true });
    return fullSnapshotResult;
  };
  for (const entry of values) {
    const declaredTarget = entry.field.target;
    const op = fillOpFor(entry.field);
    if (declaredTarget == null || op === null) {
      outcomes.push({ id: entry.field.id, filled: false });
      continue;
    }
    const fail = (kind) => {
      outcomes.push({ id: entry.field.id, filled: false, fillFailed: true });
      if (kind !== void 0) failureKinds.set(entry.field.id, kind);
    };
    if (belt.lost) {
      fail(void 0);
      continue;
    }
    if (belt.movedToAnotherUrlWithinConsentedHost) {
      fail("page_moved");
      continue;
    }
    const resolved = await resolveTargetRef(
      ctx,
      runner,
      declaredTarget,
      fillableSnapshotRole(entry.field),
      fullSnapshot,
      belt
    );
    if ("failure" in resolved) {
      fail(resolved.failure);
      continue;
    }
    if (!await belt.okToWrite()) {
      if (belt.lost) fail(void 0);
      else fail(belt.movedToAnotherUrlWithinConsentedHost ? "page_moved" : "driver_unavailable");
      continue;
    }
    const probe = await runner.run(ctx, "get_bounding_box", { ref: resolved.ref });
    if (!probe.ok) {
      fail(classifyRefusedVisibilityProbe(probe));
      continue;
    }
    if (!belt.trustResult(probe)) {
      fail(void 0);
      continue;
    }
    const result = await runner.run(ctx, op.op, op.args(resolved.ref, entry.value));
    if (!result.ok) {
      fail(classifyFailedWrite(result));
      continue;
    }
    if (!belt.trustResult(result)) {
      fail(void 0);
      continue;
    }
    outcomes.push({ id: entry.field.id, filled: true });
    if (result.control !== void 0) filledControls.set(entry.field.id, result.control);
  }
  return {
    outcomes,
    ...belt.lost ? { domainMismatch: midFillDomainMismatch(belt) } : {},
    ...failureKinds.size > 0 ? { fillFailureKinds: Object.fromEntries(failureKinds) } : {},
    ...filledControls.size > 0 ? { filledControls: Object.fromEntries(filledControls) } : {}
  };
}
function midFillDomainMismatch(belt) {
  return belt.liveHost !== void 0 ? { liveHost: belt.liveHost, phase: "mid_fill" } : { phase: "mid_fill" };
}
async function retryFillOnce(ctx, runner, entry, target, op, belt, firstPassKind) {
  const resolved = await resolveRefFromFreshSnapshot(ctx, runner, entry, target, belt);
  if (resolved.kind === "miss") {
    const controlProvenGoneNotMerelyReRendered = target.kind === "ref" && firstPassKind === "target_gone";
    const kind = controlProvenGoneNotMerelyReRendered ? "vanished" : "no_heal";
    if (resolved.snapshot === void 0) return { kind };
    return { kind, freshSnapshot: resolved.snapshot };
  }
  if (resolved.kind === "unavailable" || !await belt.okToWrite()) return { kind: "no_heal" };
  const result = await runner.run(ctx, op.op, op.args(resolved.ref, entry.value));
  if (!result.ok || !belt.trustResult(result)) return { kind: "no_heal" };
  return result.control !== void 0 ? { kind: "filled", control: result.control } : { kind: "filled" };
}
async function resolveRefFromFreshSnapshot(ctx, runner, entry, target, belt) {
  if (target.kind === "selector") {
    const scoped = await runner.run(ctx, "snapshot", {
      selector: target.value,
      interactive: true,
      maxDepth: 4
    });
    if (scoped.infra === true) return { kind: "unavailable" };
    if (scoped.ok && scoped.data !== void 0) {
      if (!belt.trustResult(scoped)) return { kind: "unavailable" };
      const ref2 = firstRefFromSnapshot(scoped.data);
      if (ref2 !== void 0) return { kind: "ref", ref: ref2 };
      if (classifyUnresolvedSelector(scoped.meta) !== "target_missing") {
        return { kind: "unavailable" };
      }
    }
  }
  const label = target.kind === "label" ? target.value : entry.field.label;
  const snapshot = await runner.run(ctx, "snapshot", { interactive: true });
  if (!snapshot.ok || snapshot.data === void 0 || !belt.trustResult(snapshot)) {
    return { kind: "unavailable" };
  }
  const ref = resolveLabelRefFromSnapshot(snapshot.data, label, fillableSnapshotRole(entry.field));
  return ref !== void 0 ? { kind: "ref", ref } : { kind: "miss", snapshot: snapshot.data };
}
async function submitByEnterInLastFilledField(ctx, runner, entry, belt) {
  const target = entry.field.target ?? {
    kind: "label",
    value: entry.field.label
  };
  const resolved = await resolveRefFromFreshSnapshot(ctx, runner, entry, target, belt);
  if (resolved.kind !== "ref" || !await belt.okToWrite()) return { succeeded: false };
  const result = await runner.run(ctx, "type", { ref: resolved.ref, text: "", submit: true });
  return {
    succeeded: result.ok && belt.trustResult(result),
    ...result.opDurationMs !== void 0 ? { opDurationMs: result.opDurationMs } : {}
  };
}

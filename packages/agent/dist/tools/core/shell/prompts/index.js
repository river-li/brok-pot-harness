/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/agent/dist/tools/core/shell/prompts/index.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/2
init_zod();

// @recovered-fragment 2/2
function getDescription2({ version: version3, enableTerminalFiles, sandboxEnabled, isReadonly, enableGithubTools, useMinimalHarness, compactShellDescription, enableBlockUntilMs, requireBlockUntilMs, defaultBlockUntilMs, enableTmuxGuidance, tmuxSharedSessionName, enableJobCompletionNotifications, enableJobProgressNotifications, includeCommandSubstitutionWarning, allTools, sandboxNetworkInfo, enablePrCreationForgeGuidance }) {
  if (version3 === "cursor-0226") {
    if (useMinimalHarness) {
      return getDescriptionDsv3(sandboxEnabled, version3, {
        isReadonly,
        enableBlockUntilMs,
        enableTmuxGuidance,
        sandboxNetworkInfo,
        tmuxSharedSessionName,
        useMinimalHarness: true,
        requireBlockUntilMs,
        defaultBlockUntilMs,
        enableJobProgressNotifications
      });
    }
    return getDescriptionDsv3(sandboxEnabled, version3, {
      isReadonly,
      enableBlockUntilMs,
      enableTmuxGuidance,
      sandboxNetworkInfo,
      tmuxSharedSessionName,
      requireBlockUntilMs,
      defaultBlockUntilMs,
      enableJobProgressNotifications
    });
  }
  if (version3 === "dsv3-1018" || version3 === "dsv3-1205") {
    return getDescriptionDsv3(sandboxEnabled, version3, {
      isReadonly,
      enableBlockUntilMs,
      enableTmuxGuidance,
      sandboxNetworkInfo,
      awaitToolName: allTools.AWAIT?.name,
      tmuxSharedSessionName,
      useMinimalHarness,
      requireBlockUntilMs,
      defaultBlockUntilMs,
      enableJobCompletionNotifications,
      enableJobProgressNotifications
    });
  }
  return renderContent(jsx(ShellDescriptionComponent, { enableTerminalFiles, sandboxEnabled, isReadonly, enableGithubTools, useMinimalHarness, compactShellDescription, enableBlockUntilMs: enableBlockUntilMs ?? false, defaultBlockUntilMs, enableTmuxGuidance, tmuxSharedSessionName, enableJobCompletionNotifications, enableJobProgressNotifications, includeCommandSubstitutionWarning, allTools, sandboxNetworkInfo, enablePrCreationForgeGuidance }));
}
function getToolName2(version3) {
  switch (version3) {
    case "dsv3-1018":
      return "run_terminal_cmd";
    case "cursor-0226":
    case "dsv3-1205":
    case "latest":
    case "gpt5-codex":
    case "codex-cloud":
    case "haiku":
      return "Shell";
    default: {
      const _exhaustive = version3;
      throw new Error(`Unhandled version: ${_exhaustive}`);
    }
  }
}
function getParametersSchema2({ version: version3, sandboxEnabled, isReadonly, enableBlockUntilMs, strictArgParsing, requireBlockUntilMs, defaultBlockUntilMs, useMinimalHarness, enableJobProgressNotifications }) {
  if (version3 === "dsv3-1018" || version3 === "dsv3-1205" || version3 === "cursor-0226") {
    let dsv3Schema = getParametersSchemaDsv3(sandboxEnabled, version3, {
      isReadonly,
      enableBlockUntilMs,
      strictArgParsing,
      requireBlockUntilMs,
      defaultBlockUntilMs,
      enableJobProgressNotifications
    });
    if (useMinimalHarness && dsv3Schema instanceof external_exports.ZodObject) {
      dsv3Schema = dsv3Schema.omit({
        description: true
      });
    }
    return dsv3Schema;
  }
  let baseSchema = enableBlockUntilMs === true ? getParametersSchemaWithBlockUntil(defaultBlockUntilMs ?? 3e4) : parametersSchemaLatest4;
  if (enableJobProgressNotifications === true && baseSchema instanceof external_exports.ZodObject) {
    baseSchema = baseSchema.extend({
      notify_on_output: notifyOnOutputSchema
    });
  }
  if (useMinimalHarness && baseSchema instanceof external_exports.ZodObject) {
    baseSchema = baseSchema.omit({
      description: true
    });
  }
  if (sandboxEnabled) {
    if (baseSchema instanceof external_exports.ZodObject) {
      const sandboxedSchema = baseSchema.extend({
        required_permissions: getRequiredPermissionsSchema({
          isReadonly: isReadonly === true,
          strict: strictArgParsing === true
        })
      });
      return sandboxedSchema;
    }
  }
  return baseSchema;
}


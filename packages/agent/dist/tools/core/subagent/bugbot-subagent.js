var BUGBOT_SUBAGENT_TYPE = "bugbot";
function buildBugbotSubagentPrompt(supportNaturalLanguage) {
  const reviewTargetParagraph = supportNaturalLanguage ? "You are performing a code review of local code changes. The user message contains the changes to review \u2014 either a diff or, when no diff is available, a natural-language description of what changed \u2014 along with the exact XML response format you must use. When you are given a description instead of a diff, use your tools to open the referenced files and base every finding on the real code." : "You are performing a code review of a local diff. The user message contains the diff to review and the exact XML response format you must use.";
  const introducedBy = supportNaturalLanguage ? "the changes" : "the diff";
  return `You are a bug-finding expert helping developers catch critical issues before they reach production. Your analysis will be used to prevent bugs that could impact the codebase. Focus on identifying genuine issues that automated tools cannot catch.

${reviewTargetParagraph}

Tool Usage Guidance:
You have access to readonly tools to explore the codebase and verify your findings. Using tools to validate potential bugs and understand the codebase context will significantly improve your accuracy and reduce false positives.

Use tools proactively to:
- Verify if functions, variables, or imports actually exist before claiming they're missing.
- Check how values are initialized and handled before claiming null/undefined errors.
- Find type definitions and usage patterns before reporting type mismatches.
- Search for error handling patterns before claiming missing try/catch blocks.
- Verify async/await usage before reporting promise-related issues.
- Check cross-file dependencies and exports before claiming import errors.
- Look for existing validation or sanitization before reporting security issues.
- Understand the broader context of code changes to avoid misinterpreting intent.

Parallel tool calls are critical. For maximum efficiency, invoke all relevant tools simultaneously rather than sequentially. When you need to verify multiple things, call all tools together in a single response.

Bug-finding focus:
- Logical errors, wrong conditions, stale callsites, broken contracts, and changed invariants.
- Unexpected behavior introduced by ${introducedBy}.
- Serious memory leaks, resource issues, security vulnerabilities, concurrency bugs, race conditions, off-by-one errors, and incorrect API usage.
- Code quality issues only when they are important enough to justify a CI rerun.

Ignore:
- Minor stylistic, security, or performance issues unless severe.
- Bugs that a linter or compiler would catch.
- Undefined/reference errors or missing imports unless you have concrete evidence they are not tooling-visible.
- Naming conventions, typos, generic missing error handling, TODOs, and speculative issues.

Before reporting a finding, verify it is real, introduced by ${introducedBy}, and important enough to flag to the author. If no bugs are found, return the empty answer format requested by the user.`;
}
var BUGBOT_SUBAGENT_DESCRIPTION_DEFAULT = 'Use only when the user *explicitly* asks for a Bugbot-like review of local code changes. When launching this subagent, set the Task description to exactly "Bugbot". Launch exactly one Bugbot subagent with `run_in_background: false` unless the user explicitly asks to run in background. Use this fixed prompt form: "Full Repository Path: ...\\nDiff: <one of: \\"branch changes\\", \\"uncommitted changes\\">\\nCustom Instructions: ..."; default to `Diff: branch changes`; include `Custom Instructions` only when the user gave specific review instructions. This subagent is single-shot and does not support `resume`; always launch a fresh subagent instead.';
var BUGBOT_SUBAGENT_DESCRIPTION_PROACTIVE = 'Use for Bugbot-like review of local code changes. Also use proactively near the end of substantial implementation or bug-fix work when local changes are ready for a final bug-finding pass; skip for trivial docs, comments, formatting, or config-only changes. When launching this subagent, set the Task description to exactly "Bugbot". Launch exactly one Bugbot subagent with `run_in_background: false` unless the user explicitly asks to run in background. Use this fixed prompt form: "Full Repository Path: ...\\nDiff: <one of: \\"branch changes\\", \\"uncommitted changes\\">\\nCustom Instructions: ..."; default to `Diff: branch changes`; include `Custom Instructions` only when the user gave specific review instructions. This subagent is single-shot and does not support `resume`; always launch a fresh subagent instead.';
var BUGBOT_SUBAGENT_DESCRIPTION_WITH_NATURAL_LANGUAGE_DEFAULT = 'Use only when the user *explicitly* asks for a Bugbot-like review of local code changes. When launching this subagent, set the Task description to exactly "Bugbot". Launch exactly one Bugbot subagent with `run_in_background: false` unless the user explicitly asks to run in background. Use this fixed prompt form: "Full Repository Path: ...\\nDiff: <one of: \\"branch changes\\", \\"uncommitted changes\\", \\"natural language\\">\\nChange Description: ...\\nCustom Instructions: ..."; default to `Diff: branch changes`; include `Change Description` only when `Diff` is `natural language`, formatting it as one block per changed file (a `<path> (added|modified|deleted|renamed)` header followed by bullets of what changed, mentioning line numbers or ranges inline where helpful), and only use `natural language` as a last resort after a regular diff-based review failed because the diff could not be computed; include `Custom Instructions` only when the user gave specific review instructions. This subagent is single-shot and does not support `resume`; always launch a fresh subagent instead.';
var BUGBOT_SUBAGENT_DESCRIPTION_WITH_NATURAL_LANGUAGE_PROACTIVE = 'Use for Bugbot-like review of local code changes. Also use proactively near the end of substantial implementation or bug-fix work when local changes are ready for a final bug-finding pass; skip for trivial docs, comments, formatting, or config-only changes. When launching this subagent, set the Task description to exactly "Bugbot". Launch exactly one Bugbot subagent with `run_in_background: false` unless the user explicitly asks to run in background. Use this fixed prompt form: "Full Repository Path: ...\\nDiff: <one of: \\"branch changes\\", \\"uncommitted changes\\", \\"natural language\\">\\nChange Description: ...\\nCustom Instructions: ..."; default to `Diff: branch changes`; include `Change Description` only when `Diff` is `natural language`, formatting it as one block per changed file (a `<path> (added|modified|deleted|renamed)` header followed by bullets of what changed, mentioning line numbers or ranges inline where helpful), and only use `natural language` as a last resort after a regular diff-based review failed because the diff could not be computed; include `Custom Instructions` only when the user gave specific review instructions. This subagent is single-shot and does not support `resume`; always launch a fresh subagent instead.';
var BUGBOT_INCLUDED_TOOL_IDENTIFIERS = /* @__PURE__ */ new Set([
  "GLOB",
  "GREP",
  "READ",
  "SEMANTIC_SEARCH",
  "WEB_SEARCH"
]);
function createBugbotSubagentConfig(options2) {
  const supportNaturalLanguage = options2?.supportNaturalLanguage === true;
  const enableProactiveReview = options2?.enableProactiveReview === true;
  const trimmedModelOverride = options2?.modelOverride?.trim();
  const modelOverride = trimmedModelOverride === "" ? void 0 : trimmedModelOverride;
  const composerModelIds = [SubagentComposerModelId.fast, SubagentComposerModelId.standard];
  const defaultModelIds = modelOverride !== void 0 ? [modelOverride, ...composerModelIds.filter((modelId) => modelId !== modelOverride)] : composerModelIds;
  return {
    subagent_type: new SubagentType({
      type: {
        case: "custom",
        value: new SubagentTypeCustom({ name: BUGBOT_SUBAGENT_TYPE })
      }
    }),
    description: supportNaturalLanguage ? enableProactiveReview ? BUGBOT_SUBAGENT_DESCRIPTION_WITH_NATURAL_LANGUAGE_PROACTIVE : BUGBOT_SUBAGENT_DESCRIPTION_WITH_NATURAL_LANGUAGE_DEFAULT : enableProactiveReview ? BUGBOT_SUBAGENT_DESCRIPTION_PROACTIVE : BUGBOT_SUBAGENT_DESCRIPTION_DEFAULT,
    preserveTaskTool: false,
    permissionMode: CustomSubagentPermissionMode.READONLY,
    subagentSource: "builtin",
    // Fast first, standard Composer as the fallback. Without the fallback, a
    // team policy that blocks the fast variant sends the review to the parent
    // model (fallback_parent_model), which can be a slow/expensive reasoning
    // model — reviews that take 2-6 min on Composer have run 30+ min on it.
    defaultModelIds,
    userRequestedModelId: modelOverride === void 0 ? SubagentComposerModelId.fast : void 0,
    forceDefaultModel: true,
    systemPromptOverride: () => buildBugbotSubagentPrompt(supportNaturalLanguage),
    toolsOverride: (callerTools) => callerTools.filter((tool) => BUGBOT_INCLUDED_TOOL_IDENTIFIERS.has(tool.toolIdentifier)),
    isGithubBugbotSubagent: false
  };
}

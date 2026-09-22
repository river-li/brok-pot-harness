init_subagents_pb();
var SECURITY_REVIEW_SUBAGENT_TYPE = "security-review";
var SECURITY_REVIEW_SUBAGENT_PROMPT = `You are a security expert performing a thorough security review of local code changes. Your analysis will be used to catch concrete security vulnerabilities before they reach production.

You are reviewing a local diff. The user message contains the diff to review and the exact response expectations.

Tool Usage Guidance:
You have access to readonly tools to explore the codebase and validate exploitability. Use tools proactively before reporting a finding.

Use tools to:
- Trace attacker-controlled data to its source.
- Verify authentication and authorization checks.
- Check framework-level validation, escaping, and ORM parameterization.
- Inspect surrounding code before claiming a boundary bypass.
- Confirm that a finding is introduced by the diff, not unchanged existing code.

Security review focus:
- Authorization, privilege escalation, cross-tenant or cross-user access.
- Credential, secret, token, or sensitive data exposure.
- Injection, unsafe deserialization, path traversal, SSRF, XSS, CSRF, and command execution.
- Privacy or storage policy bypasses for protected code, prompts, or user data.
- Feature gate or control-plane bypasses with security impact.

Ignore:
- Style, maintainability, or performance issues without security impact.
- Findings that require the attacker to already have equivalent privileges.
- Same-user or same-host local workspace issues unless the diff crosses a real sandbox, privilege, or tenant boundary.
- Speculative prompt-injection claims without a concrete autonomous security consequence.
- Vulnerabilities in unchanged code that are only visible as context.

Before reporting a finding, verify that it is real, introduced by the diff, and meaningful enough for a security reviewer to act on. If no security issues are found, say that clearly.`;
var SECURITY_REVIEW_INCLUDED_TOOL_IDENTIFIERS = /* @__PURE__ */ new Set([
  "GLOB",
  "GREP",
  "READ",
  "SEMANTIC_SEARCH",
  "WEB_SEARCH"
]);
function createSecurityReviewSubagentConfig() {
  return {
    subagent_type: new SubagentType({
      type: {
        case: "custom",
        value: new SubagentTypeCustom({ name: SECURITY_REVIEW_SUBAGENT_TYPE })
      }
    }),
    description: 'Use only when the user *explicitly* asks for a security review of local code changes. When launching this subagent, set the Task description to exactly "Security Review". Launch exactly one security-review subagent with `run_in_background: false` unless the user explicitly asks to run in background. Use this fixed prompt form: "Full Repository Path: ...\\nDiff: <one of: \\"branch changes\\", \\"uncommitted changes\\">\\nCustom Instructions: ..."; default to `Diff: branch changes`; include `Custom Instructions` only when the user gave specific review instructions. This subagent is single-shot and does not support `resume`; always launch a fresh subagent instead.',
    preserveTaskTool: false,
    permissionMode: CustomSubagentPermissionMode.READONLY,
    subagentSource: "builtin",
    // Fast first, standard Composer as the fallback — same chain as the Bugbot
    // subagent, so a team policy that blocks the fast variant degrades to
    // standard Composer instead of the parent model.
    defaultModelIds: [SubagentComposerModelId.fast, SubagentComposerModelId.standard],
    userRequestedModelId: SubagentComposerModelId.fast,
    forceDefaultModel: true,
    systemPromptOverride: () => SECURITY_REVIEW_SUBAGENT_PROMPT,
    toolsOverride: (callerTools) => callerTools.filter((tool) => SECURITY_REVIEW_INCLUDED_TOOL_IDENTIFIERS.has(tool.toolIdentifier))
  };
}

/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/redacted-protos/dist/generated/agent/v1/agent_skills_redacted.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_agent_skills_pb();
function toRedactedAgentSkill(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    fullPath: createRedactedString(msg.fullPath, DataClassification.PATH, "full_path", privacyMode),
    content: createRedactedString(msg.content, DataClassification.CODE, "content", privacyMode),
    description: createRedactedString(msg.description, DataClassification.CODE, "description", privacyMode),
    parseError: msg.parseError !== void 0 ? createRedactedString(msg.parseError, DataClassification.CODE, "parse_error", privacyMode) : void 0,
    environments: msg.environments,
    disabledEnvironments: msg.disabledEnvironments,
    gitRemoteOrigin: msg.gitRemoteOrigin !== void 0 ? createRedactedString(msg.gitRemoteOrigin, DataClassification.PATH, "git_remote_origin", privacyMode) : void 0,
    disableModelInvocation: msg.disableModelInvocation,
    plugin: msg.plugin,
    marketplace: msg.marketplace,
    pluginId: msg.pluginId,
    marketplaceId: msg.marketplaceId,
    globs: msg.globs.map((v2) => createRedactedString(v2, DataClassification.PATH, "globs", privacyMode)),
    scopedTo: msg.scopedTo
  };
}
function fromRedactedAgentSkill(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new AgentSkill({
    fullPath: msg.fullPath.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    content: msg.content.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    description: msg.description.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    parseError: msg.parseError?.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    environments: msg.environments,
    disabledEnvironments: msg.disabledEnvironments,
    gitRemoteOrigin: msg.gitRemoteOrigin?.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    disableModelInvocation: msg.disableModelInvocation,
    plugin: msg.plugin,
    marketplace: msg.marketplace,
    pluginId: msg.pluginId,
    marketplaceId: msg.marketplaceId,
    globs: msg.globs.map((v2) => v2.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing })),
    scopedTo: msg.scopedTo
  });
}


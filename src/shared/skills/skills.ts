/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/shared/skills/skills.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var SAND_SKILL_PUBLISH_REFUSED = "skill-publish/refused";
var SKILL_PUBLISH_REFUSAL_PREFIX = `${SAND_SKILL_PUBLISH_REFUSED}: `;
var SandSkillPublishError = class extends Error {
  refusalKind;
  constructor(reason, refusalKind) {
    super(`${SKILL_PUBLISH_REFUSAL_PREFIX}${reason}`);
    this.name = "SandSkillPublishError";
    if (refusalKind !== void 0) this.refusalKind = refusalKind;
  }
};
var SKILL_REFERENCE_NODE_TYPE = "workflowReference";
var LEGACY_SKILL_REFERENCE_NODE_TYPE = SKILL_REFERENCE_NODE_TYPE;


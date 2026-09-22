/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/agent/dist/utils/team-rules.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_cursor_rules_pb();
function teamRuleToCursorRule(rule) {
  const globs = rule.globs ?? [];
  const type2 = globs.length > 0 ? new CursorRuleType({
    type: {
      case: "fileGlobbed",
      value: new CursorRuleTypeFileGlobs({ globs: [...globs] })
    }
  }) : new CursorRuleType({
    type: { case: "global", value: new CursorRuleTypeGlobal({}) }
  });
  return new CursorRule2({
    fullPath: rule.name,
    content: rule.content,
    type: type2,
    source: CursorRuleSource.TEAM,
    isRequired: rule.isRequired
  });
}


var TEAM_RULES_REQUEST_TIMEOUT_MS = 1e4;
function appliesToSand(rule) {
  return rule.agentType === TeamRuleAgentType.SAND || rule.agentType === TeamRuleAgentType.ALL;
}
function errorLabel2(error42) {
  if (error42 instanceof ConnectError) {
    return `ConnectError(code=${error42.code})`;
  }
  return errorClassOf(error42);
}
function directMemberTeamIds(response) {
  return response.teams.filter((team) => team.id > 0 && team.isDirectMember).map((team) => team.id);
}
function createSandTeamRulesResolver(options2) {
  const client = options2.client ?? createSandCursorBackendClient(DashboardService, options2);
  const report = options2.report ?? (() => {
  });
  const fetchTeamRules = async (teamId) => {
    const response = await client.getTeamRules(
      new GetTeamRulesRequest({ activeOnly: true, teamId, includeMemberGroupRules: true }),
      { timeoutMs: TEAM_RULES_REQUEST_TIMEOUT_MS }
    );
    return response.rules.filter(appliesToSand).map(teamRuleToCursorRule);
  };
  return createSandTeamRulesResolverFromLoad({
    load: async () => {
      const selectedTeamId = await options2.getSelectedTeamId();
      if (selectedTeamId !== void 0) {
        try {
          return { outcome: "rules", rules: await fetchTeamRules(selectedTeamId) };
        } catch (error42) {
          report({
            extension: "managed_setup",
            kind: "team_rules_fetch",
            errorClass: errorLabel2(error42)
          });
          return { outcome: "incomplete" };
        }
      }
      let teamIds;
      try {
        const teamsResponse = await client.getTeams(new GetTeamsRequest({ activeOnly: true }), {
          timeoutMs: TEAM_RULES_REQUEST_TIMEOUT_MS
        });
        teamIds = directMemberTeamIds(teamsResponse);
      } catch (error42) {
        report({
          extension: "managed_setup",
          kind: "team_rules_membership",
          errorClass: errorLabel2(error42)
        });
        return { outcome: "incomplete" };
      }
      if (teamIds.length === 0) {
        return { outcome: "no_team" };
      }
      try {
        const batches = await Promise.all(teamIds.map(fetchTeamRules));
        return {
          outcome: "rules",
          rules: mergeTeamRulesByFullPath(batches)
        };
      } catch (error42) {
        report({
          extension: "managed_setup",
          kind: "team_rules_fetch",
          errorClass: errorLabel2(error42)
        });
        return { outcome: "incomplete" };
      }
    },
    reportLoadFailure: (error42) => {
      report({
        extension: "managed_setup",
        kind: "team_rules_retry",
        errorClass: errorLabel2(error42)
      });
    }
  });
}

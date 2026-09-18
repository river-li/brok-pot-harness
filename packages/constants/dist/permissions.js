var TeamPermission, TEAM_PERMISSIONS, OrganizationPermission, ORGANIZATION_PERMISSIONS, AgentStorePermission, AGENT_STORE_PERMISSIONS, AgentStoreSharePermission, AGENT_STORE_SHARE_PERMISSIONS, GrokBotTemplatePermission, GROK_BOT_TEMPLATE_PERMISSIONS, KeyringPermission, KEYRING_PERMISSIONS, EnvironmentPermission, ENVIRONMENT_PERMISSIONS;
var init_permissions = __esm({
  "../packages/constants/dist/permissions.js"() {
    "use strict";
    TeamPermission = {
      ReadSpend: "team.spend.read",
      ReadTeamMemberSpend: "team.member_spend.read",
      ReadPrivacyMode: "team.privacy_mode.read",
      ReadSsoConfiguration: "team.sso.read",
      ReadTeamRules: "team.rules.read",
      ManageTeamRules: "team.rules.manage",
      ReadTeamHooks: "team.hooks.read",
      ManageTeamHooks: "team.hooks.manage",
      ReadCommitMetrics: "team.commit_metrics.read",
      ManageDirectoryGroups: "team.directory_groups.manage",
      ManageProtectedGitScopes: "team.protected_git_scopes.manage",
      ReadBackgroundComposers: "team.background_composers.read",
      ListTeamBackgroundComposers: "team.background_composers.list",
      ManageTeamBackgroundComposers: "team.background_composers.manage",
      ManageFullSelfDriving: "team.full_self_driving.manage",
      ManagePublicProfileSettings: "team.public_profile_settings.manage",
      ManageMemberSpendLimits: "team.member_spend_limits.manage",
      ManageTeamMcpServers: "team.mcp_servers.manage",
      ManageScimConfiguration: "team.scim_configuration.manage",
      ManageBillingGroups: "team.billing_groups.manage",
      ReadGroups: "team.groups.read",
      ManageGroups: "team.groups.manage",
      ReadTeamMembers: "team.members.read",
      ManageTeamMembers: "team.members.manage",
      ReadTeamMembership: "team.membership.read",
      ReadTeamInvites: "team.invites.read",
      ManageTeamInvites: "team.invites.manage",
      ManageTeamApiKeys: "team.api_keys.manage",
      ReadTeamRepos: "team.repos.read",
      ManageTeamRepos: "team.repos.manage",
      ReadTeamSettings: "team.settings.read",
      ManageTeamSettings: "team.settings.manage",
      ReadTeamBilling: "team.billing.read",
      ManageTeamBilling: "team.billing.manage",
      ReadAuditLogs: "team.audit_logs.read",
      ReadTeamAnalytics: "team.analytics.read",
      ManageTeamAnalytics: "team.analytics.manage",
      ManageTeamPrivacy: "team.privacy.manage",
      ReadTeamCommands: "team.commands.read",
      ManageTeamCommands: "team.commands.manage",
      ReadBugbot: "team.bugbot.read",
      ManageBugbot: "team.bugbot.manage",
      ReadTeamSharingSettings: "team.sharing_settings.read",
      ManageTeamSharingSettings: "team.sharing_settings.manage",
      ManageTeamBackgroundAgentSettings: "team.background_agent_settings.manage",
      ReadTeamPlugins: "team.plugins.read",
      ManageTeamPlugins: "team.plugins.manage",
      ReadTeamIntegrations: "team.integrations.read",
      ManageTeamIntegrations: "team.integrations.manage",
      ReadDataExports: "team.data_exports.read",
      ReadGithubIdentityMappings: "team.github_identity_mappings.read"
    };
    TEAM_PERMISSIONS = Object.values(TeamPermission);
    OrganizationPermission = {
      ReadMembers: "organization.members.read",
      WriteMembers: "organization.members.write",
      ManageMemberships: "organization.memberships.manage",
      ManageOrganization: "organization.manage",
      ManageTeams: "organization.teams.manage",
      ReadGroups: "organization.groups.read",
      ManageGroups: "organization.groups.manage",
      ManageApiKeys: "organization.api_keys.manage",
      ManageIdentityProviders: "organization.identity_providers.manage",
      ReadSpend: "organization.spend.read",
      ReadAuditLogs: "organization.audit_logs.read",
      ReadBilling: "organization.billing.read"
    };
    ORGANIZATION_PERMISSIONS = Object.values(OrganizationPermission);
    AgentStorePermission = {
      ReadAgentStore: "agent_store.read",
      WriteAgentStore: "agent_store.write",
      ShareAgentStore: "agent_store.share"
    };
    AGENT_STORE_PERMISSIONS = Object.values(AgentStorePermission);
    AgentStoreSharePermission = {
      ReadAgentStoreShare: "agent_store_share.read"
    };
    AGENT_STORE_SHARE_PERMISSIONS = Object.values(AgentStoreSharePermission);
    GrokBotTemplatePermission = {
      ReadGrokBotTemplate: "grok_bot_template.read",
      WriteGrokBotTemplate: "grok_bot_template.write",
      ShareGrokBotTemplate: "grok_bot_template.share",
      DeleteGrokBotTemplate: "grok_bot_template.delete"
    };
    GROK_BOT_TEMPLATE_PERMISSIONS = Object.values(GrokBotTemplatePermission);
    KeyringPermission = {
      ManageKeyring: "keyring.manage",
      AttachKeyring: "keyring.attach"
    };
    KEYRING_PERMISSIONS = Object.values(KeyringPermission);
    EnvironmentPermission = {
      ManageEnvironmentSecurity: "environment.security.manage",
      ManageEnvironmentWorkload: "environment.workload.manage",
      UseEnvironment: "environment.use"
    };
    ENVIRONMENT_PERMISSIONS = Object.values(EnvironmentPermission);
  }
});

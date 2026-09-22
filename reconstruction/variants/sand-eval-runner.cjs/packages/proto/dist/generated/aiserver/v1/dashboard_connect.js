/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/proto/dist/generated/aiserver/v1/dashboard_connect.js
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/2
init_esm13();

// @recovered-fragment 2/2
var DashboardService = {
  typeName: "aiserver.v1.DashboardService",
  methods: {
    /**
     * @generated from rpc aiserver.v1.DashboardService.GetTeams
     */
    getTeams: {
      name: "GetTeams",
      I: GetTeamsRequest,
      O: GetTeamsResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.GetMe
     */
    getMe: {
      name: "GetMe",
      I: GetMeRequest,
      O: GetMeResponse,
      kind: MethodKind.Unary
    },
    /**
     * Candidate discovery for the Cursor Link account-collapse UI. This is a
     * read-only, Cursor-session-authenticated preflight; it does not mutate
     * identity links or run an account collapse.
     *
     * @generated from rpc aiserver.v1.DashboardService.ListCollapseCandidates
     */
    listCollapseCandidates: {
      name: "ListCollapseCandidates",
      I: ListCollapseCandidatesRequest,
      O: ListCollapseCandidatesResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.GetUnificationIntent
     */
    getUnificationIntent: {
      name: "GetUnificationIntent",
      I: GetUnificationIntentRequest,
      O: GetUnificationIntentResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.UpsertUnificationIntent
     */
    upsertUnificationIntent: {
      name: "UpsertUnificationIntent",
      I: UpsertUnificationIntentRequest,
      O: UpsertUnificationIntentResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.StartUnifyGrokOAuth
     */
    startUnifyGrokOAuth: {
      name: "StartUnifyGrokOAuth",
      I: StartUnifyGrokOAuthRequest,
      O: StartUnifyGrokOAuthResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.CompleteUnifyGrokOAuth
     */
    completeUnifyGrokOAuth: {
      name: "CompleteUnifyGrokOAuth",
      I: CompleteUnifyGrokOAuthRequest,
      O: CompleteUnifyGrokOAuthResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.StartUnifyXLogin
     */
    startUnifyXLogin: {
      name: "StartUnifyXLogin",
      I: StartUnifyXLoginRequest,
      O: StartUnifyXLoginResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.CompleteUnifyXLogin
     */
    completeUnifyXLogin: {
      name: "CompleteUnifyXLogin",
      I: CompleteUnifyXLoginRequest,
      O: CompleteUnifyXLoginResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.StartCollapseSourceProof
     */
    startCollapseSourceProof: {
      name: "StartCollapseSourceProof",
      I: StartCollapseSourceProofRequest,
      O: StartCollapseSourceProofResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.CompleteCollapseSourceProof
     */
    completeCollapseSourceProof: {
      name: "CompleteCollapseSourceProof",
      I: CompleteCollapseSourceProofRequest,
      O: CompleteCollapseSourceProofResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.ProvisionUnifyGrokAccount
     */
    provisionUnifyGrokAccount: {
      name: "ProvisionUnifyGrokAccount",
      I: ProvisionUnifyGrokAccountRequest,
      O: ProvisionUnifyGrokAccountResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.FinalizeIndividualUnification
     */
    finalizeIndividualUnification: {
      name: "FinalizeIndividualUnification",
      I: FinalizeIndividualUnificationRequest,
      O: FinalizeIndividualUnificationResponse,
      kind: MethodKind.Unary
    },
    /**
     * Partner-auth (xAI identity assertion) twins of the Cursor-session
     * individual-unification RPCs, so Grok's backend can drive the same funnel
     * for its own signed-in user. The person is always the assertion's subject;
     * request bodies never carry an xAI identity. The funnel RPCs reuse the
     * Cursor-entry step machine (DRAFT -> AWAITING_PAYMENT -> COLLAPSING ->
     * FINALIZING -> DONE); payment stays on the Grok side and is observed via
     * the shared identitydb billing row.
     *
     * @generated from rpc aiserver.v1.DashboardService.GetOrCreateXaiUnificationIntent
     */
    getOrCreateXaiUnificationIntent: {
      name: "GetOrCreateXaiUnificationIntent",
      I: GetOrCreateXaiUnificationIntentRequest,
      O: GetOrCreateXaiUnificationIntentResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.GetXaiUnificationIntent
     */
    getXaiUnificationIntent: {
      name: "GetXaiUnificationIntent",
      I: GetXaiUnificationIntentRequest,
      O: GetXaiUnificationIntentResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.SelectXaiUnificationCursorAccount
     */
    selectXaiUnificationCursorAccount: {
      name: "SelectXaiUnificationCursorAccount",
      I: SelectXaiUnificationCursorAccountRequest,
      O: SelectXaiUnificationCursorAccountResponse,
      kind: MethodKind.Unary
    },
    /**
     * Partner-auth twin of ListCollapseCandidates: read-only candidate
     * discovery for the asserted xAI user. It does not mutate identity links.
     *
     * @generated from rpc aiserver.v1.DashboardService.ListXaiUnificationCollapseCandidates
     */
    listXaiUnificationCollapseCandidates: {
      name: "ListXaiUnificationCollapseCandidates",
      I: ListXaiUnificationCollapseCandidatesRequest,
      O: ListCollapseCandidatesResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.StartXaiUnificationCursorAccountProof
     */
    startXaiUnificationCursorAccountProof: {
      name: "StartXaiUnificationCursorAccountProof",
      I: StartXaiUnificationCursorAccountProofRequest,
      O: StartXaiUnificationCursorAccountProofResponse,
      kind: MethodKind.Unary
    },
    /**
     * The Cursor callback first calls without a bearer to exchange the WorkOS
     * code and obtain an opaque continuation. It sends only that continuation
     * to Grok, whose backend calls again with the receiving user's xAI assertion.
     *
     * @generated from rpc aiserver.v1.DashboardService.CompleteXaiUnificationCursorAccountProof
     */
    completeXaiUnificationCursorAccountProof: {
      name: "CompleteXaiUnificationCursorAccountProof",
      I: CompleteXaiUnificationCursorAccountProofRequest,
      O: CompleteXaiUnificationCursorAccountProofResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.AdvanceXaiUnificationIntent
     */
    advanceXaiUnificationIntent: {
      name: "AdvanceXaiUnificationIntent",
      I: AdvanceXaiUnificationIntentRequest,
      O: AdvanceXaiUnificationIntentResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.GetAgenticOnboardingConfig
     */
    getAgenticOnboardingConfig: {
      name: "GetAgenticOnboardingConfig",
      I: GetAgenticOnboardingConfigRequest,
      O: GetAgenticOnboardingConfigResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.GetUserOrganizations
     */
    getUserOrganizations: {
      name: "GetUserOrganizations",
      I: GetUserOrganizationsRequest,
      O: GetUserOrganizationsResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.GetTeamLinkedOrganization
     */
    getTeamLinkedOrganization: {
      name: "GetTeamLinkedOrganization",
      I: GetTeamLinkedOrganizationRequest,
      O: GetTeamLinkedOrganizationResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.SetUserDefaultTeam
     */
    setUserDefaultTeam: {
      name: "SetUserDefaultTeam",
      I: SetUserDefaultTeamRequest,
      O: SetUserDefaultTeamResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.GetOrganizationMembers
     */
    getOrganizationMembers: {
      name: "GetOrganizationMembers",
      I: GetOrganizationMembersRequest,
      O: GetOrganizationMembersResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.GetOrganizationMember
     */
    getOrganizationMember: {
      name: "GetOrganizationMember",
      I: GetOrganizationMemberRequest,
      O: GetOrganizationMemberResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.ListOrganizationIdentityProviders
     */
    listOrganizationIdentityProviders: {
      name: "ListOrganizationIdentityProviders",
      I: ListOrganizationIdentityProvidersRequest,
      O: ListOrganizationIdentityProvidersResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.UpdateOrganizationIdentityProviderSsoSettings
     */
    updateOrganizationIdentityProviderSsoSettings: {
      name: "UpdateOrganizationIdentityProviderSsoSettings",
      I: UpdateOrganizationIdentityProviderSsoSettingsRequest,
      O: UpdateOrganizationIdentityProviderResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.SetOrganizationIdentityProviderAllowDomainJoin
     */
    setOrganizationIdentityProviderAllowDomainJoin: {
      name: "SetOrganizationIdentityProviderAllowDomainJoin",
      I: SetOrganizationIdentityProviderAllowDomainJoinRequest,
      O: UpdateOrganizationIdentityProviderResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.AddOrganizationIdentityProviderDomainJoin
     */
    addOrganizationIdentityProviderDomainJoin: {
      name: "AddOrganizationIdentityProviderDomainJoin",
      I: AddOrganizationIdentityProviderDomainJoinRequest,
      O: UpdateOrganizationIdentityProviderResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.RemoveOrganizationIdentityProviderDomainJoin
     */
    removeOrganizationIdentityProviderDomainJoin: {
      name: "RemoveOrganizationIdentityProviderDomainJoin",
      I: RemoveOrganizationIdentityProviderDomainJoinRequest,
      O: UpdateOrganizationIdentityProviderResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.MergeOrganizationIdentityProvider
     */
    mergeOrganizationIdentityProvider: {
      name: "MergeOrganizationIdentityProvider",
      I: MergeOrganizationIdentityProviderRequest,
      O: MergeOrganizationIdentityProviderResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.PreflightMergeOrganizationIdentityProvider
     */
    preflightMergeOrganizationIdentityProvider: {
      name: "PreflightMergeOrganizationIdentityProvider",
      I: PreflightMergeOrganizationIdentityProviderRequest,
      O: PreflightMergeOrganizationIdentityProviderResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.GetOrganizationMergeIdpRequest
     */
    getOrganizationMergeIdpRequest: {
      name: "GetOrganizationMergeIdpRequest",
      I: GetOrganizationMergeIdpRequestRequest,
      O: GetOrganizationMergeIdpRequestResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.ListOrganizationMergeIdpRequests
     */
    listOrganizationMergeIdpRequests: {
      name: "ListOrganizationMergeIdpRequests",
      I: ListOrganizationMergeIdpRequestsRequest,
      O: ListOrganizationMergeIdpRequestsResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.MoveOrganizationMemberToTeam
     */
    moveOrganizationMemberToTeam: {
      name: "MoveOrganizationMemberToTeam",
      I: MoveOrganizationMemberToTeamRequest,
      O: MoveOrganizationMemberToTeamResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.SetOrganizationMemberTeams
     */
    setOrganizationMemberTeams: {
      name: "SetOrganizationMemberTeams",
      I: SetOrganizationMemberTeamsRequest,
      O: SetOrganizationMemberTeamsResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.RemoveOrganizationMember
     */
    removeOrganizationMember: {
      name: "RemoveOrganizationMember",
      I: RemoveOrganizationMemberRequest,
      O: RemoveOrganizationMemberResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.BulkMoveOrganizationMembers
     */
    bulkMoveOrganizationMembers: {
      name: "BulkMoveOrganizationMembers",
      I: BulkMoveOrganizationMembersRequest,
      O: BulkMoveOrganizationMembersResponse,
      kind: MethodKind.Unary
    },
    /**
     * Async variant of BulkMoveOrganizationMembers: validates and enqueues a
     * background job, returning a handle the client polls via GetBackgroundJob.
     *
     * @generated from rpc aiserver.v1.DashboardService.StartBulkMoveOrganizationMembers
     */
    startBulkMoveOrganizationMembers: {
      name: "StartBulkMoveOrganizationMembers",
      I: StartBulkMoveOrganizationMembersRequest,
      O: StartBulkMoveOrganizationMembersResponse,
      kind: MethodKind.Unary
    },
    /**
     * Generic background-job status read. Authorization is delegated to the
     * registered job's view policy, keyed by the opaque job handle.
     *
     * @generated from rpc aiserver.v1.DashboardService.GetBackgroundJob
     */
    getBackgroundJob: {
      name: "GetBackgroundJob",
      I: GetBackgroundJobRequest,
      O: GetBackgroundJobResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.SetOrganizationMemberRole
     */
    setOrganizationMemberRole: {
      name: "SetOrganizationMemberRole",
      I: SetOrganizationMemberRoleRequest,
      O: SetOrganizationMemberRoleResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.UpdateOrganization
     */
    updateOrganization: {
      name: "UpdateOrganization",
      I: UpdateOrganizationRequest,
      O: UpdateOrganizationResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.UpdateOrganizationTeam
     */
    updateOrganizationTeam: {
      name: "UpdateOrganizationTeam",
      I: UpdateOrganizationTeamRequest,
      O: UpdateOrganizationTeamResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.CreateOrganizationTeam
     */
    createOrganizationTeam: {
      name: "CreateOrganizationTeam",
      I: CreateOrganizationTeamRequest,
      O: CreateOrganizationTeamResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.PreviewOrganizationTeamSettingsCopy
     */
    previewOrganizationTeamSettingsCopy: {
      name: "PreviewOrganizationTeamSettingsCopy",
      I: PreviewOrganizationTeamSettingsCopyRequest,
      O: PreviewOrganizationTeamSettingsCopyResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.GetOrganizationTeamAdminCandidates
     */
    getOrganizationTeamAdminCandidates: {
      name: "GetOrganizationTeamAdminCandidates",
      I: GetOrganizationTeamAdminCandidatesRequest,
      O: GetOrganizationTeamAdminCandidatesResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.GetDirectoryGroups
     */
    getDirectoryGroups: {
      name: "GetDirectoryGroups",
      I: GetDirectoryGroupsRequest,
      O: GetDirectoryGroupsResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.UpdateDirectoryGroupSettings
     */
    updateDirectoryGroupSettings: {
      name: "UpdateDirectoryGroupSettings",
      I: UpdateDirectoryGroupSettingsRequest,
      O: UpdateDirectoryGroupSettingsResponse,
      kind: MethodKind.Unary
    },
    /**
     * Organization-level group management
     *
     * @generated from rpc aiserver.v1.DashboardService.GetOrganizationGroups
     */
    getOrganizationGroups: {
      name: "GetOrganizationGroups",
      I: GetOrganizationGroupsRequest,
      O: GetOrganizationGroupsResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.GetOrganizationGroup
     */
    getOrganizationGroup: {
      name: "GetOrganizationGroup",
      I: GetOrganizationGroupRequest,
      O: GetOrganizationGroupResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.GetOrganizationGroupMembers
     */
    getOrganizationGroupMembers: {
      name: "GetOrganizationGroupMembers",
      I: GetOrganizationGroupMembersRequest,
      O: GetOrganizationGroupMembersResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.CreateOrganizationGroup
     */
    createOrganizationGroup: {
      name: "CreateOrganizationGroup",
      I: CreateOrganizationGroupRequest,
      O: CreateOrganizationGroupResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.UpdateOrganizationGroup
     */
    updateOrganizationGroup: {
      name: "UpdateOrganizationGroup",
      I: UpdateOrganizationGroupRequest,
      O: UpdateOrganizationGroupResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.DeleteOrganizationGroup
     */
    deleteOrganizationGroup: {
      name: "DeleteOrganizationGroup",
      I: DeleteOrganizationGroupRequest,
      O: DeleteOrganizationGroupResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.AddOrganizationGroupMembers
     */
    addOrganizationGroupMembers: {
      name: "AddOrganizationGroupMembers",
      I: AddOrganizationGroupMembersRequest,
      O: AddOrganizationGroupMembersResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.RemoveOrganizationGroupMembers
     */
    removeOrganizationGroupMembers: {
      name: "RemoveOrganizationGroupMembers",
      I: RemoveOrganizationGroupMembersRequest,
      O: RemoveOrganizationGroupMembersResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.UpdateOrganizationGroupMember
     */
    updateOrganizationGroupMember: {
      name: "UpdateOrganizationGroupMember",
      I: UpdateOrganizationGroupMemberRequest,
      O: UpdateOrganizationGroupMemberResponse,
      kind: MethodKind.Unary
    },
    /**
     * Service accounts are group principals the same way users are (an active
     * SERVICE_ACCOUNT -> GROUP membership edge); these mirror the member RPCs.
     *
     * @generated from rpc aiserver.v1.DashboardService.GetOrganizationGroupServiceAccountMembers
     */
    getOrganizationGroupServiceAccountMembers: {
      name: "GetOrganizationGroupServiceAccountMembers",
      I: GetOrganizationGroupServiceAccountMembersRequest,
      O: GetOrganizationGroupServiceAccountMembersResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.GetOrganizationServiceAccounts
     */
    getOrganizationServiceAccounts: {
      name: "GetOrganizationServiceAccounts",
      I: GetOrganizationServiceAccountsRequest,
      O: GetOrganizationServiceAccountsResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.AddOrganizationGroupServiceAccounts
     */
    addOrganizationGroupServiceAccounts: {
      name: "AddOrganizationGroupServiceAccounts",
      I: AddOrganizationGroupServiceAccountsRequest,
      O: AddOrganizationGroupServiceAccountsResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.RemoveOrganizationGroupServiceAccounts
     */
    removeOrganizationGroupServiceAccounts: {
      name: "RemoveOrganizationGroupServiceAccounts",
      I: RemoveOrganizationGroupServiceAccountsRequest,
      O: RemoveOrganizationGroupServiceAccountsResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.GetOrganizationGroupAutorunSettings
     */
    getOrganizationGroupAutorunSettings: {
      name: "GetOrganizationGroupAutorunSettings",
      I: GetOrganizationGroupAutorunSettingsRequest,
      O: GetOrganizationGroupAutorunSettingsResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.UpdateOrganizationGroupAutorunSettings
     */
    updateOrganizationGroupAutorunSettings: {
      name: "UpdateOrganizationGroupAutorunSettings",
      I: UpdateOrganizationGroupAutorunSettingsRequest,
      O: UpdateOrganizationGroupAutorunSettingsResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.GetOrganizationGroupMcpSettings
     */
    getOrganizationGroupMcpSettings: {
      name: "GetOrganizationGroupMcpSettings",
      I: GetOrganizationGroupMcpSettingsRequest,
      O: GetOrganizationGroupMcpSettingsResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.UpdateOrganizationGroupMcpSettings
     */
    updateOrganizationGroupMcpSettings: {
      name: "UpdateOrganizationGroupMcpSettings",
      I: UpdateOrganizationGroupMcpSettingsRequest,
      O: UpdateOrganizationGroupMcpSettingsResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.ResetOrganizationGroupAgentRunModeToAutoReview
     */
    resetOrganizationGroupAgentRunModeToAutoReview: {
      name: "ResetOrganizationGroupAgentRunModeToAutoReview",
      I: ResetOrganizationGroupAgentRunModeToAutoReviewRequest,
      O: ResetOrganizationGroupAgentRunModeToAutoReviewResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.GetOrganizationGroupModelAllowlist
     */
    getOrganizationGroupModelAllowlist: {
      name: "GetOrganizationGroupModelAllowlist",
      I: GetOrganizationGroupModelAllowlistRequest,
      O: GetOrganizationGroupModelAllowlistResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.UpdateOrganizationGroupModelAllowlist
     */
    updateOrganizationGroupModelAllowlist: {
      name: "UpdateOrganizationGroupModelAllowlist",
      I: UpdateOrganizationGroupModelAllowlistRequest,
      O: UpdateOrganizationGroupModelAllowlistResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.GetOrganizationGroupAutoReviewSettings
     */
    getOrganizationGroupAutoReviewSettings: {
      name: "GetOrganizationGroupAutoReviewSettings",
      I: GetOrganizationGroupAutoReviewSettingsRequest,
      O: GetOrganizationGroupAutoReviewSettingsResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.UpdateOrganizationGroupAutoReviewSettings
     */
    updateOrganizationGroupAutoReviewSettings: {
      name: "UpdateOrganizationGroupAutoReviewSettings",
      I: UpdateOrganizationGroupAutoReviewSettingsRequest,
      O: UpdateOrganizationGroupAutoReviewSettingsResponse,
      kind: MethodKind.Unary
    },
    /**
     * Smart Auto routing settings at the org-group level. Admins may only enable
     * when the smart_auto_routing_admin_enabled Statsig gate passes.
     *
     * @generated from rpc aiserver.v1.DashboardService.GetOrganizationGroupSmartAutoSettings
     */
    getOrganizationGroupSmartAutoSettings: {
      name: "GetOrganizationGroupSmartAutoSettings",
      I: GetOrganizationGroupSmartAutoSettingsRequest,
      O: GetOrganizationGroupSmartAutoSettingsResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.UpdateOrganizationGroupSmartAutoSettings
     */
    updateOrganizationGroupSmartAutoSettings: {
      name: "UpdateOrganizationGroupSmartAutoSettings",
      I: UpdateOrganizationGroupSmartAutoSettingsRequest,
      O: UpdateOrganizationGroupSmartAutoSettingsResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.CreateOrganizationGroupAnthropicCyberEnrollmentUrl
     */
    createOrganizationGroupAnthropicCyberEnrollmentUrl: {
      name: "CreateOrganizationGroupAnthropicCyberEnrollmentUrl",
      I: CreateOrganizationGroupAnthropicCyberEnrollmentUrlRequest,
      O: CreateOrganizationGroupAnthropicCyberEnrollmentUrlResponse,
      kind: MethodKind.Unary
    },
    /**
     * Org admin asks Cursor to enroll this group in the Anthropic EFS program.
     * The request is reviewed by a privileged Cursor employee in anytool
     * (ReviewAnthropicEfsRequestInternal); the group's status is returned on
     * GetOrganizationGroup. Rejected while the organization itself is requested
     * or approved (RequestOrganizationAnthropicEfs), and gated on the
     * `anthropic_efs` Statsig gate for the requesting admin.
     *
     * @generated from rpc aiserver.v1.DashboardService.RequestOrganizationGroupAnthropicEfs
     */
    requestOrganizationGroupAnthropicEfs: {
      name: "RequestOrganizationGroupAnthropicEfs",
      I: RequestOrganizationGroupAnthropicEfsRequest,
      O: RequestOrganizationGroupAnthropicEfsResponse,
      kind: MethodKind.Unary
    },
    /**
     * Org admin asks Cursor to enroll the whole organization in the Anthropic
     * EFS program. Same review flow and Statsig gate as the group-level request.
     *
     * @generated from rpc aiserver.v1.DashboardService.RequestOrganizationAnthropicEfs
     */
    requestOrganizationAnthropicEfs: {
      name: "RequestOrganizationAnthropicEfs",
      I: RequestOrganizationAnthropicEfsRequest,
      O: RequestOrganizationAnthropicEfsResponse,
      kind: MethodKind.Unary
    },
    /**
     * The organization's own EFS request status plus whether the viewer may
     * request (the `anthropic_efs` gate); drives the organization settings page
     * and the EFS section of an org-owned group's settings page.
     *
     * @generated from rpc aiserver.v1.DashboardService.GetOrganizationAnthropicEfsStatus
     */
    getOrganizationAnthropicEfsStatus: {
      name: "GetOrganizationAnthropicEfsStatus",
      I: GetOrganizationAnthropicEfsStatusRequest,
      O: GetOrganizationAnthropicEfsStatusResponse,
      kind: MethodKind.Unary
    },
    /**
     * Internal-only (anytool, via internal-service + acting-employee auth):
     * approve, reject, or revoke a group's or organization's Anthropic EFS
     * enrollment request.
     *
     * @generated from rpc aiserver.v1.DashboardService.ReviewAnthropicEfsRequestInternal
     */
    reviewAnthropicEfsRequestInternal: {
      name: "ReviewAnthropicEfsRequestInternal",
      I: ReviewAnthropicEfsRequestInternalRequest,
      O: ReviewAnthropicEfsRequestInternalResponse,
      kind: MethodKind.Unary
    },
    /**
     * Team-scoped canonical group management (groups table + GROUP→TEAM membership)
     *
     * @generated from rpc aiserver.v1.DashboardService.GetTeamGroups
     */
    getTeamGroups: {
      name: "GetTeamGroups",
      I: GetTeamGroupsRequest,
      O: GetTeamGroupsResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.GetTeamGroup
     */
    getTeamGroup: {
      name: "GetTeamGroup",
      I: GetTeamGroupRequest,
      O: GetTeamGroupResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.GetTeamGroupMembers
     */
    getTeamGroupMembers: {
      name: "GetTeamGroupMembers",
      I: GetTeamGroupMembersRequest,
      O: GetTeamGroupMembersResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.CreateTeamGroup
     */
    createTeamGroup: {
      name: "CreateTeamGroup",
      I: CreateTeamGroupRequest,
      O: CreateTeamGroupResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.UpdateTeamGroup
     */
    updateTeamGroup: {
      name: "UpdateTeamGroup",
      I: UpdateTeamGroupRequest,
      O: UpdateTeamGroupResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.DeleteTeamGroup
     */
    deleteTeamGroup: {
      name: "DeleteTeamGroup",
      I: DeleteTeamGroupRequest,
      O: DeleteTeamGroupResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.AddTeamGroupMembers
     */
    addTeamGroupMembers: {
      name: "AddTeamGroupMembers",
      I: AddTeamGroupMembersRequest,
      O: AddTeamGroupMembersResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.RemoveTeamGroupMembers
     */
    removeTeamGroupMembers: {
      name: "RemoveTeamGroupMembers",
      I: RemoveTeamGroupMembersRequest,
      O: RemoveTeamGroupMembersResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.UpdateTeamGroupMember
     */
    updateTeamGroupMember: {
      name: "UpdateTeamGroupMember",
      I: UpdateTeamGroupMemberRequest,
      O: UpdateTeamGroupMemberResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.GetTeamGroupAutorunSettings
     */
    getTeamGroupAutorunSettings: {
      name: "GetTeamGroupAutorunSettings",
      I: GetTeamGroupAutorunSettingsRequest,
      O: GetTeamGroupAutorunSettingsResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.UpdateTeamGroupAutorunSettings
     */
    updateTeamGroupAutorunSettings: {
      name: "UpdateTeamGroupAutorunSettings",
      I: UpdateTeamGroupAutorunSettingsRequest,
      O: UpdateTeamGroupAutorunSettingsResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.GetTeamGroupMcpSettings
     */
    getTeamGroupMcpSettings: {
      name: "GetTeamGroupMcpSettings",
      I: GetTeamGroupMcpSettingsRequest,
      O: GetTeamGroupMcpSettingsResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.UpdateTeamGroupMcpSettings
     */
    updateTeamGroupMcpSettings: {
      name: "UpdateTeamGroupMcpSettings",
      I: UpdateTeamGroupMcpSettingsRequest,
      O: UpdateTeamGroupMcpSettingsResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.ResetTeamGroupAgentRunModeToAutoReview
     */
    resetTeamGroupAgentRunModeToAutoReview: {
      name: "ResetTeamGroupAgentRunModeToAutoReview",
      I: ResetTeamGroupAgentRunModeToAutoReviewRequest,
      O: ResetTeamGroupAgentRunModeToAutoReviewResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.GetTeamGroupModelAllowlist
     */
    getTeamGroupModelAllowlist: {
      name: "GetTeamGroupModelAllowlist",
      I: GetTeamGroupModelAllowlistRequest,
      O: GetTeamGroupModelAllowlistResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.UpdateTeamGroupModelAllowlist
     */
    updateTeamGroupModelAllowlist: {
      name: "UpdateTeamGroupModelAllowlist",
      I: UpdateTeamGroupModelAllowlistRequest,
      O: UpdateTeamGroupModelAllowlistResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.GetTeamGroupAutoReviewSettings
     */
    getTeamGroupAutoReviewSettings: {
      name: "GetTeamGroupAutoReviewSettings",
      I: GetTeamGroupAutoReviewSettingsRequest,
      O: GetTeamGroupAutoReviewSettingsResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.UpdateTeamGroupAutoReviewSettings
     */
    updateTeamGroupAutoReviewSettings: {
      name: "UpdateTeamGroupAutoReviewSettings",
      I: UpdateTeamGroupAutoReviewSettingsRequest,
      O: UpdateTeamGroupAutoReviewSettingsResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.GetTeamSandNetworkSettings
     */
    getTeamSandNetworkSettings: {
      name: "GetTeamSandNetworkSettings",
      I: GetTeamSandNetworkSettingsRequest,
      O: GetTeamSandNetworkSettingsResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.GetTeamGrokBotTrial
     */
    getTeamGrokBotTrial: {
      name: "GetTeamGrokBotTrial",
      I: GetTeamGrokBotTrialRequest,
      O: GetTeamGrokBotTrialResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.UpdateTeamSandNetworkSettings
     */
    updateTeamSandNetworkSettings: {
      name: "UpdateTeamSandNetworkSettings",
      I: UpdateTeamSandNetworkSettingsRequest,
      O: UpdateTeamSandNetworkSettingsResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.GetTeamGroupSandNetworkSettings
     */
    getTeamGroupSandNetworkSettings: {
      name: "GetTeamGroupSandNetworkSettings",
      I: GetTeamGroupSandNetworkSettingsRequest,
      O: GetTeamGroupSandNetworkSettingsResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.UpdateTeamGroupSandNetworkSettings
     */
    updateTeamGroupSandNetworkSettings: {
      name: "UpdateTeamGroupSandNetworkSettings",
      I: UpdateTeamGroupSandNetworkSettingsRequest,
      O: UpdateTeamGroupSandNetworkSettingsResponse,
      kind: MethodKind.Unary
    },
    /**
     * Per-group Grok Bot capabilities (Cloud Agents, local execution ceiling,
     * local egress, Auto-review enforce + rules). Gate `grok_bot_group_settings`.
     *
     * @generated from rpc aiserver.v1.DashboardService.GetTeamGroupGrokBotCapabilities
     */
    getTeamGroupGrokBotCapabilities: {
      name: "GetTeamGroupGrokBotCapabilities",
      I: GetTeamGroupGrokBotCapabilitiesRequest,
      O: GetTeamGroupGrokBotCapabilitiesResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.UpdateTeamGroupGrokBotCapabilities
     */
    updateTeamGroupGrokBotCapabilities: {
      name: "UpdateTeamGroupGrokBotCapabilities",
      I: UpdateTeamGroupGrokBotCapabilitiesRequest,
      O: UpdateTeamGroupGrokBotCapabilitiesResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.GetTeamGroupSmartAutoSettings
     */
    getTeamGroupSmartAutoSettings: {
      name: "GetTeamGroupSmartAutoSettings",
      I: GetTeamGroupSmartAutoSettingsRequest,
      O: GetTeamGroupSmartAutoSettingsResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.UpdateTeamGroupSmartAutoSettings
     */
    updateTeamGroupSmartAutoSettings: {
      name: "UpdateTeamGroupSmartAutoSettings",
      I: UpdateTeamGroupSmartAutoSettingsRequest,
      O: UpdateTeamGroupSmartAutoSettingsResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.CreateTeamGroupAnthropicCyberEnrollmentUrl
     */
    createTeamGroupAnthropicCyberEnrollmentUrl: {
      name: "CreateTeamGroupAnthropicCyberEnrollmentUrl",
      I: CreateTeamGroupAnthropicCyberEnrollmentUrlRequest,
      O: CreateTeamGroupAnthropicCyberEnrollmentUrlResponse,
      kind: MethodKind.Unary
    },
    /**
     * Team-scoped twin of RequestOrganizationGroupAnthropicEfs.
     *
     * @generated from rpc aiserver.v1.DashboardService.RequestTeamGroupAnthropicEfs
     */
    requestTeamGroupAnthropicEfs: {
      name: "RequestTeamGroupAnthropicEfs",
      I: RequestTeamGroupAnthropicEfsRequest,
      O: RequestTeamGroupAnthropicEfsResponse,
      kind: MethodKind.Unary
    },
    /**
     * The EFS request status of the team's linked organization (if any) plus
     * whether the viewer may request (the `anthropic_efs` gate); drives the
     * EFS section of a team-owned group's settings page.
     *
     * @generated from rpc aiserver.v1.DashboardService.GetTeamAnthropicEfsStatus
     */
    getTeamAnthropicEfsStatus: {
      name: "GetTeamAnthropicEfsStatus",
      I: GetTeamAnthropicEfsStatusRequest,
      O: GetTeamAnthropicEfsStatusResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.ListTeamGroupScimDirectories
     */
    listTeamGroupScimDirectories: {
      name: "ListTeamGroupScimDirectories",
      I: ListTeamGroupScimDirectoriesRequest,
      O: ListTeamGroupScimDirectoriesResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.ListTeamGroupScimGroupsFromUpstream
     */
    listTeamGroupScimGroupsFromUpstream: {
      name: "ListTeamGroupScimGroupsFromUpstream",
      I: ListTeamGroupScimGroupsFromUpstreamRequest,
      O: ListTeamGroupScimGroupsFromUpstreamResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.ListTeamGroupScimTargetMappings
     */
    listTeamGroupScimTargetMappings: {
      name: "ListTeamGroupScimTargetMappings",
      I: ListTeamGroupScimTargetMappingsRequest,
      O: ListTeamGroupScimTargetMappingsResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.CreateTeamGroupScimTargetMapping
     */
    createTeamGroupScimTargetMapping: {
      name: "CreateTeamGroupScimTargetMapping",
      I: CreateTeamGroupScimTargetMappingRequest,
      O: CreateTeamGroupScimTargetMappingResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.DeleteTeamGroupScimTargetMapping
     */
    deleteTeamGroupScimTargetMapping: {
      name: "DeleteTeamGroupScimTargetMapping",
      I: DeleteTeamGroupScimTargetMappingRequest,
      O: DeleteTeamGroupScimTargetMappingResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.GetGroups
     */
    getGroups: {
      name: "GetGroups",
      I: GetGroupsRequest,
      O: GetGroupsResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.GetGroupMembers
     */
    getGroupMembers: {
      name: "GetGroupMembers",
      I: GetGroupMembersRequest,
      O: GetGroupMembersResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.CreateGroup
     */
    createGroup: {
      name: "CreateGroup",
      I: CreateGroupRequest,
      O: CreateGroupResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.UpdateGroup
     */
    updateGroup: {
      name: "UpdateGroup",
      I: UpdateGroupRequest,
      O: UpdateGroupResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.DeleteGroup
     */
    deleteGroup: {
      name: "DeleteGroup",
      I: DeleteGroupRequest,
      O: DeleteGroupResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.AddGroupMembers
     */
    addGroupMembers: {
      name: "AddGroupMembers",
      I: AddGroupMembersRequest,
      O: AddGroupMembersResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.RemoveGroupMembers
     */
    removeGroupMembers: {
      name: "RemoveGroupMembers",
      I: RemoveGroupMembersRequest,
      O: RemoveGroupMembersResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.BulkAssignGroupMembers
     */
    bulkAssignGroupMembers: {
      name: "BulkAssignGroupMembers",
      I: BulkAssignGroupMembersRequest,
      O: BulkAssignGroupMembersResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.PreviewAttachGroupToDirectory
     */
    previewAttachGroupToDirectory: {
      name: "PreviewAttachGroupToDirectory",
      I: PreviewAttachGroupToDirectoryRequest,
      O: PreviewAttachGroupToDirectoryResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.DetachGroupFromDirectory
     */
    detachGroupFromDirectory: {
      name: "DetachGroupFromDirectory",
      I: DetachGroupFromDirectoryRequest,
      O: DetachGroupFromDirectoryResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.GetScimConflicts
     */
    getScimConflicts: {
      name: "GetScimConflicts",
      I: GetScimConflictsRequest,
      O: GetScimConflictsResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.ListScimDirectories
     */
    listScimDirectories: {
      name: "ListScimDirectories",
      I: ListScimDirectoriesRequest,
      O: ListScimDirectoriesResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.GetOrganizationScimConfigurationLinks
     */
    getOrganizationScimConfigurationLinks: {
      name: "GetOrganizationScimConfigurationLinks",
      I: ListScimDirectoriesRequest,
      O: GetOrganizationScimConfigurationLinksResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.CreateScimDirectory
     */
    createScimDirectory: {
      name: "CreateScimDirectory",
      I: CreateScimDirectoryRequest,
      O: CreateScimDirectoryResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.UpdateScimDirectorySyncSettings
     */
    updateScimDirectorySyncSettings: {
      name: "UpdateScimDirectorySyncSettings",
      I: UpdateScimDirectorySyncSettingsRequest,
      O: UpdateScimDirectorySyncSettingsResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.DeleteScimDirectory
     */
    deleteScimDirectory: {
      name: "DeleteScimDirectory",
      I: DeleteScimDirectoryRequest,
      O: DeleteScimDirectoryResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.ListScimGroupsFromUpstream
     */
    listScimGroupsFromUpstream: {
      name: "ListScimGroupsFromUpstream",
      I: ListScimGroupsFromUpstreamRequest,
      O: ListScimGroupsFromUpstreamResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.ListScimTargetMappings
     */
    listScimTargetMappings: {
      name: "ListScimTargetMappings",
      I: ListScimTargetMappingsRequest,
      O: ListScimTargetMappingsResponse,
      kind: MethodKind.Unary
    },
    /**
     * Org-scoped list of every active group target mapping (SCIM directory group
     * and Cursor organization group sources), so the admin UI can render all
     * sources feeding each team/group with their roles. ListScimTargetMappings is
     * scoped to one SCIM directory and cannot surface Cursor-group mappings.
     *
     * @generated from rpc aiserver.v1.DashboardService.ListOrganizationGroupTargetMappings
     */
    listOrganizationGroupTargetMappings: {
      name: "ListOrganizationGroupTargetMappings",
      I: ListOrganizationGroupTargetMappingsRequest,
      O: ListOrganizationGroupTargetMappingsResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.CreateScimTargetMapping
     */
    createScimTargetMapping: {
      name: "CreateScimTargetMapping",
      I: CreateScimTargetMappingRequest,
      O: CreateScimTargetMappingResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.DeleteScimTargetMapping
     */
    deleteScimTargetMapping: {
      name: "DeleteScimTargetMapping",
      I: DeleteScimTargetMappingRequest,
      O: DeleteScimTargetMappingResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.GetActivationCheckoutUrl
     */
    getActivationCheckoutUrl: {
      name: "GetActivationCheckoutUrl",
      I: GetActivationCheckoutUrlRequest,
      O: GetActivationCheckoutUrlResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.CheckPromotionEligibility
     */
    checkPromotionEligibility: {
      name: "CheckPromotionEligibility",
      I: CheckPromotionEligibilityRequest,
      O: CheckPromotionEligibilityResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.ActivatePromotion
     */
    activatePromotion: {
      name: "ActivatePromotion",
      I: ActivatePromotionRequest,
      O: ActivatePromotionResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.GetTeamCustomerPortalUrl
     */
    getTeamCustomerPortalUrl: {
      name: "GetTeamCustomerPortalUrl",
      I: GetTeamCustomerPortalUrlRequest,
      O: GetTeamCustomerPortalUrlResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.CancelPendingTeamSubscriptionNow
     */
    cancelPendingTeamSubscriptionNow: {
      name: "CancelPendingTeamSubscriptionNow",
      I: CancelPendingTeamSubscriptionNowRequest,
      O: CancelPendingTeamSubscriptionNowResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.CreatePendingTeamProCheckout
     */
    createPendingTeamProCheckout: {
      name: "CreatePendingTeamProCheckout",
      I: CreatePendingTeamProCheckoutRequest,
      O: CreatePendingTeamProCheckoutResponse,
      kind: MethodKind.Unary
    },
    /**
     * Prepaid billing (self-serve teams): balance, top-ups, auto top-up. The
     * billing mode is read here but set by Cursor only (no RPC).
     * See docs/prepaid-auto-topups-plan.md.
     *
     * @generated from rpc aiserver.v1.DashboardService.GetTeamPrepaidBilling
     */
    getTeamPrepaidBilling: {
      name: "GetTeamPrepaidBilling",
      I: GetTeamPrepaidBillingRequest,
      O: GetTeamPrepaidBillingResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.SetTeamPrepaidAutoTopUp
     */
    setTeamPrepaidAutoTopUp: {
      name: "SetTeamPrepaidAutoTopUp",
      I: SetTeamPrepaidAutoTopUpRequest,
      O: SetTeamPrepaidAutoTopUpResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.CreatePrepaidTopUp
     */
    createPrepaidTopUp: {
      name: "CreatePrepaidTopUp",
      I: CreatePrepaidTopUpRequest,
      O: CreatePrepaidTopUpResponse,
      kind: MethodKind.Unary
    },
    /**
     * Prepaid billing for self-serve individuals (team-less accounts): the same
     * wallet operations scoped to the authenticated user.
     *
     * @generated from rpc aiserver.v1.DashboardService.GetUserPrepaidBilling
     */
    getUserPrepaidBilling: {
      name: "GetUserPrepaidBilling",
      I: GetUserPrepaidBillingRequest,
      O: GetUserPrepaidBillingResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.SetUserPrepaidAutoTopUp
     */
    setUserPrepaidAutoTopUp: {
      name: "SetUserPrepaidAutoTopUp",
      I: SetUserPrepaidAutoTopUpRequest,
      O: SetUserPrepaidAutoTopUpResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.CreateUserPrepaidTopUp
     */
    createUserPrepaidTopUp: {
      name: "CreateUserPrepaidTopUp",
      I: CreateUserPrepaidTopUpRequest,
      O: CreateUserPrepaidTopUpResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.GetTeamMembers
     */
    getTeamMembers: {
      name: "GetTeamMembers",
      I: GetTeamMembersRequest,
      O: GetTeamMembersResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.SendTeamInvite
     */
    sendTeamInvite: {
      name: "SendTeamInvite",
      I: SendTeamInviteRequest,
      O: SendTeamInviteResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.GetTeamInviteLink
     */
    getTeamInviteLink: {
      name: "GetTeamInviteLink",
      I: GetTeamInviteLinkRequest,
      O: GetTeamInviteLinkResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.AcceptInvite
     */
    acceptInvite: {
      name: "AcceptInvite",
      I: AcceptInviteRequest,
      O: AcceptInviteResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.GetTeamInviteMetadata
     */
    getTeamInviteMetadata: {
      name: "GetTeamInviteMetadata",
      I: GetTeamInviteMetadataRequest,
      O: GetTeamInviteMetadataResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.ListContactImportConnections
     */
    listContactImportConnections: {
      name: "ListContactImportConnections",
      I: ListContactImportConnectionsRequest,
      O: ListContactImportConnectionsResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.GetGoogleContactImportAuthUrl
     */
    getGoogleContactImportAuthUrl: {
      name: "GetGoogleContactImportAuthUrl",
      I: GetGoogleContactImportAuthUrlRequest,
      O: GetGoogleContactImportAuthUrlResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.ConnectGoogleContactImportCallback
     */
    connectGoogleContactImportCallback: {
      name: "ConnectGoogleContactImportCallback",
      I: ConnectGoogleContactImportCallbackRequest,
      O: ConnectGoogleContactImportCallbackResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.ListContactImportContacts
     */
    listContactImportContacts: {
      name: "ListContactImportContacts",
      I: ListContactImportContactsRequest,
      O: ListContactImportContactsResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.GetContactImportAvatar
     */
    getContactImportAvatar: {
      name: "GetContactImportAvatar",
      I: GetContactImportAvatarRequest,
      O: GetContactImportAvatarResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.DisconnectContactImportConnection
     */
    disconnectContactImportConnection: {
      name: "DisconnectContactImportConnection",
      I: DisconnectContactImportConnectionRequest,
      O: DisconnectContactImportConnectionResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.CreateTeam
     */
    createTeam: {
      name: "CreateTeam",
      I: CreateTeamRequest,
      O: CreateTeamResponse,
      kind: MethodKind.Unary
    },
    /**
     * Domain-based team joining
     *
     * @generated from rpc aiserver.v1.DashboardService.GetJoinableTeamsByDomain
     */
    getJoinableTeamsByDomain: {
      name: "GetJoinableTeamsByDomain",
      I: GetJoinableTeamsByDomainRequest,
      O: GetJoinableTeamsByDomainResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.JoinTeamByDomain
     */
    joinTeamByDomain: {
      name: "JoinTeamByDomain",
      I: JoinTeamByDomainRequest,
      O: JoinTeamByDomainResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.UpdateTeamDomainJoinSetting
     */
    updateTeamDomainJoinSetting: {
      name: "UpdateTeamDomainJoinSetting",
      I: UpdateTeamDomainJoinSettingRequest,
      O: UpdateTeamDomainJoinSettingResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.GetTeamMemberDomains
     */
    getTeamMemberDomains: {
      name: "GetTeamMemberDomains",
      I: GetTeamMemberDomainsRequest,
      O: GetTeamMemberDomainsResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.GetTeamIdForReactivation
     */
    getTeamIdForReactivation: {
      name: "GetTeamIdForReactivation",
      I: GetTeamIdForReactivationRequest,
      O: GetTeamIdForReactivationResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.ChangeSeat
     */
    changeSeat: {
      name: "ChangeSeat",
      I: ChangeSeatRequest,
      O: ChangeSeatResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.ChangeTeamSubscription
     */
    changeTeamSubscription: {
      name: "ChangeTeamSubscription",
      I: ChangeTeamSubscriptionRequest,
      O: ChangeTeamSubscriptionResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.ConnectGithubCallback
     */
    connectGithubCallback: {
      name: "ConnectGithubCallback",
      I: ConnectGithubCallbackRequest,
      O: ConnectGithubCallbackResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.RegisterGithubCursorCode
     */
    registerGithubCursorCode: {
      name: "RegisterGithubCursorCode",
      I: RegisterGithubCursorCodeRequest,
      O: RegisterGithubCursorCodeResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.PrepareGithubConnectFlow
     */
    prepareGithubConnectFlow: {
      name: "PrepareGithubConnectFlow",
      I: PrepareGithubConnectFlowRequest,
      O: PrepareGithubConnectFlowResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.CompleteGithubConnectFlow
     */
    completeGithubConnectFlow: {
      name: "CompleteGithubConnectFlow",
      I: CompleteGithubConnectFlowRequest,
      O: CompleteGithubConnectFlowResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.DisconnectGithub
     */
    disconnectGithub: {
      name: "DisconnectGithub",
      I: DisconnectGithubRequest,
      O: DisconnectGithubResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.PrepareSetupGithubEnterpriseApp
     */
    prepareSetupGithubEnterpriseApp: {
      name: "PrepareSetupGithubEnterpriseApp",
      I: PrepareSetupGithubEnterpriseAppRequest,
      O: PrepareSetupGithubEnterpriseAppResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.FinishSetupGithubEnterpriseApp
     */
    finishSetupGithubEnterpriseApp: {
      name: "FinishSetupGithubEnterpriseApp",
      I: FinishSetupGithubEnterpriseAppRequest,
      O: FinishSetupGithubEnterpriseAppResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.ListGithubEnterpriseApps
     */
    listGithubEnterpriseApps: {
      name: "ListGithubEnterpriseApps",
      I: ListGithubEnterpriseAppsRequest,
      O: ListGithubEnterpriseAppsResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.DeleteGithubEnterpriseApp
     */
    deleteGithubEnterpriseApp: {
      name: "DeleteGithubEnterpriseApp",
      I: DeleteGithubEnterpriseAppRequest,
      O: DeleteGithubEnterpriseAppResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.SetupGitlabEnterpriseInstance
     */
    setupGitlabEnterpriseInstance: {
      name: "SetupGitlabEnterpriseInstance",
      I: SetupGitlabEnterpriseInstanceRequest,
      O: SetupGitlabEnterpriseInstanceResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.ListGitlabEnterpriseInstances
     */
    listGitlabEnterpriseInstances: {
      name: "ListGitlabEnterpriseInstances",
      I: ListGitlabEnterpriseInstancesRequest,
      O: ListGitlabEnterpriseInstancesResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.SetGitlabEnterpriseHostControlledServiceAccountToken
     */
    setGitlabEnterpriseHostControlledServiceAccountToken: {
      name: "SetGitlabEnterpriseHostControlledServiceAccountToken",
      I: SetGitlabEnterpriseHostControlledServiceAccountTokenRequest,
      O: SetGitlabEnterpriseHostControlledServiceAccountTokenResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.RotateGitlabEnterpriseWebhookSecret
     */
    rotateGitlabEnterpriseWebhookSecret: {
      name: "RotateGitlabEnterpriseWebhookSecret",
      I: RotateGitlabEnterpriseWebhookSecretRequest,
      O: RotateGitlabEnterpriseWebhookSecretResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.DeleteGitlabEnterpriseInstance
     */
    deleteGitlabEnterpriseInstance: {
      name: "DeleteGitlabEnterpriseInstance",
      I: DeleteGitlabEnterpriseInstanceRequest,
      O: DeleteGitlabEnterpriseInstanceResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.SetupBitbucketServerInstance
     */
    setupBitbucketServerInstance: {
      name: "SetupBitbucketServerInstance",
      I: SetupBitbucketServerInstanceRequest,
      O: SetupBitbucketServerInstanceResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.ListBitbucketServerInstances
     */
    listBitbucketServerInstances: {
      name: "ListBitbucketServerInstances",
      I: ListBitbucketServerInstancesRequest,
      O: ListBitbucketServerInstancesResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.UpdateBitbucketServerInstanceToken
     */
    updateBitbucketServerInstanceToken: {
      name: "UpdateBitbucketServerInstanceToken",
      I: UpdateBitbucketServerInstanceTokenRequest,
      O: UpdateBitbucketServerInstanceTokenResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.DeleteBitbucketServerInstance
     */
    deleteBitbucketServerInstance: {
      name: "DeleteBitbucketServerInstance",
      I: DeleteBitbucketServerInstanceRequest,
      O: DeleteBitbucketServerInstanceResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.SyncGitlabRepos
     */
    syncGitlabRepos: {
      name: "SyncGitlabRepos",
      I: SyncGitlabReposRequest,
      O: SyncGitlabReposResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.GetGitlabReposSyncStatus
     */
    getGitlabReposSyncStatus: {
      name: "GetGitlabReposSyncStatus",
      I: GetGitlabReposSyncStatusRequest,
      O: GetGitlabReposSyncStatusResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.UpdateRole
     */
    updateRole: {
      name: "UpdateRole",
      I: UpdateRoleRequest,
      O: UpdateRoleResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.RemoveMember
     */
    removeMember: {
      name: "RemoveMember",
      I: RemoveMemberRequest,
      O: RemoveMemberResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.GetMemberRemovalInsights
     */
    getMemberRemovalInsights: {
      name: "GetMemberRemovalInsights",
      I: GetMemberRemovalInsightsRequest,
      O: GetMemberRemovalInsightsResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.GetSignUpType
     */
    getSignUpType: {
      name: "GetSignUpType",
      I: GetSignUpTypeRequest,
      O: GetSignUpTypeResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.GetHardLimit
     */
    getHardLimit: {
      name: "GetHardLimit",
      I: GetHardLimitRequest,
      O: GetHardLimitResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.SetHardLimit
     */
    setHardLimit: {
      name: "SetHardLimit",
      I: SetHardLimitRequest,
      O: SetHardLimitResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.GetSpendLimitPolicy
     */
    getSpendLimitPolicy: {
      name: "GetSpendLimitPolicy",
      I: GetSpendLimitPolicyRequest,
      O: GetSpendLimitPolicyResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.SetSpendLimitPolicy
     */
    setSpendLimitPolicy: {
      name: "SetSpendLimitPolicy",
      I: SetSpendLimitPolicyRequest,
      O: SetSpendLimitPolicyResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.GetOrgTeamBudgets
     */
    getOrgTeamBudgets: {
      name: "GetOrgTeamBudgets",
      I: GetOrgTeamBudgetsRequest,
      O: GetOrgTeamBudgetsResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.SetOrgTeamBudget
     */
    setOrgTeamBudget: {
      name: "SetOrgTeamBudget",
      I: SetOrgTeamBudgetRequest,
      O: SetOrgTeamBudgetResponse,
      kind: MethodKind.Unary
    },
    /**
     * Daily spend aggregated across all teams in the organization (org admin).
     *
     * @generated from rpc aiserver.v1.DashboardService.GetOrgDailySpendByCategory
     */
    getOrgDailySpendByCategory: {
      name: "GetOrgDailySpendByCategory",
      I: GetOrgDailySpendByCategoryRequest,
      O: GetDailySpendByCategoryResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.EnableOnDemandSpend
     */
    enableOnDemandSpend: {
      name: "EnableOnDemandSpend",
      I: EnableOnDemandSpendRequest,
      O: EnableOnDemandSpendResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.DeleteAccount
     */
    deleteAccount: {
      name: "DeleteAccount",
      I: DeleteAccountRequest,
      O: DeleteAccountResponse,
      kind: MethodKind.Unary
    },
    /**
     * v0 trusted-ID account-collapse control plane. The server currently hard-gates
     * these product RPCs to internal dogfood callers until candidate discovery and
     * ownership proof are implemented.
     *
     * @generated from rpc aiserver.v1.DashboardService.StartAccountCollapseRun
     */
    startAccountCollapseRun: {
      name: "StartAccountCollapseRun",
      I: StartAccountCollapseRunRequest,
      O: StartAccountCollapseRunResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.GetAccountCollapseRun
     */
    getAccountCollapseRun: {
      name: "GetAccountCollapseRun",
      I: GetAccountCollapseRunRequest,
      O: GetAccountCollapseRunResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.StartAccountCollapseRunInternal
     */
    startAccountCollapseRunInternal: {
      name: "StartAccountCollapseRunInternal",
      I: StartAccountCollapseRunRequest,
      O: StartAccountCollapseRunResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.GetAccountCollapseRunInternal
     */
    getAccountCollapseRunInternal: {
      name: "GetAccountCollapseRunInternal",
      I: GetAccountCollapseRunRequest,
      O: GetAccountCollapseRunResponse,
      kind: MethodKind.Unary
    },
    /**
     * Partner (Grok) account-collapse control plane. Both RPCs
     * are authenticated by a per-user xAI identity assertion carried as the
     * bearer token and pinned to a dedicated audience (no Cursor session), and
     * the assertion's subject must hold a live identity join to the target
     * Cursor user. They wrap the same collapse engine as
     * StartAccountCollapseRun / GetAccountCollapseRun; nothing is forked.
     *
     * @generated from rpc aiserver.v1.DashboardService.StartCursorAccountCollapse
     */
    startCursorAccountCollapse: {
      name: "StartCursorAccountCollapse",
      I: StartCursorAccountCollapseRequest,
      O: StartCursorAccountCollapseResponse,
      kind: MethodKind.Unary
    },
    /**
     * Read the target's active (PENDING or RUNNING) collapse run for Unified
     * Dash progress polling. The response run is absent when no run is active.
     *
     * @generated from rpc aiserver.v1.DashboardService.GetCursorAccountCollapseByTarget
     */
    getCursorAccountCollapseByTarget: {
      name: "GetCursorAccountCollapseByTarget",
      I: GetCursorAccountCollapseByTargetRequest,
      O: GetCursorAccountCollapseByTargetResponse,
      kind: MethodKind.Unary
    },
    /**
     * Cursor-session twins for the Unified Dashboard. The target is always the
     * authenticated, merged Cursor user and is never accepted from the request.
     *
     * @generated from rpc aiserver.v1.DashboardService.StartCursorSessionAccountCollapse
     */
    startCursorSessionAccountCollapse: {
      name: "StartCursorSessionAccountCollapse",
      I: StartCursorSessionAccountCollapseRequest,
      O: StartCursorAccountCollapseResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.GetCursorSessionAccountCollapse
     */
    getCursorSessionAccountCollapse: {
      name: "GetCursorSessionAccountCollapse",
      I: GetCursorSessionAccountCollapseRequest,
      O: GetCursorAccountCollapseByTargetResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.ListCursorSessionAccountCollapseCandidates
     */
    listCursorSessionAccountCollapseCandidates: {
      name: "ListCursorSessionAccountCollapseCandidates",
      I: ListCursorSessionAccountCollapseCandidatesRequest,
      O: ListCollapseCandidatesResponse,
      kind: MethodKind.Unary
    },
    /**
     * Sends a download link email to the authenticated user
     *
     * @generated from rpc aiserver.v1.DashboardService.SendDownloadEmail
     */
    sendDownloadEmail: {
      name: "SendDownloadEmail",
      I: SendDownloadEmailRequest,
      O: SendDownloadEmailResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.GetMonthlyInvoice
     */
    getMonthlyInvoice: {
      name: "GetMonthlyInvoice",
      I: GetMonthlyInvoiceRequest,
      O: GetMonthlyInvoiceResponse,
      kind: MethodKind.Unary
    },
    /**
     * Lists distinct invoice cycles (month- or start-time-based) for the current owner (user or team)
     *
     * @generated from rpc aiserver.v1.DashboardService.ListInvoiceCycles
     */
    listInvoiceCycles: {
      name: "ListInvoiceCycles",
      I: ListInvoiceCyclesRequest,
      O: ListInvoiceCyclesResponse,
      kind: MethodKind.Unary
    },
    /**
     * Gets daily spend breakdown by category (model or usage_type) for the billing period
     *
     * @generated from rpc aiserver.v1.DashboardService.GetDailySpendByCategory
     */
    getDailySpendByCategory: {
      name: "GetDailySpendByCategory",
      I: GetDailySpendByCategoryRequest,
      O: GetDailySpendByCategoryResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.GetPricingHistory
     * @deprecated
     */
    getPricingHistory: {
      name: "GetPricingHistory",
      I: GetPricingHistoryRequest,
      O: GetPricingHistoryResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.ListBackgroundComposerSecrets
     */
    listBackgroundComposerSecrets: {
      name: "ListBackgroundComposerSecrets",
      I: ListBackgroundComposerSecretsRequest,
      O: ListBackgroundComposerSecretsResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.CreateBackgroundComposerSecret
     */
    createBackgroundComposerSecret: {
      name: "CreateBackgroundComposerSecret",
      I: CreateBackgroundComposerSecretRequest,
      O: CreateBackgroundComposerSecretResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.CreateBackgroundComposerSecretBatch
     */
    createBackgroundComposerSecretBatch: {
      name: "CreateBackgroundComposerSecretBatch",
      I: CreateBackgroundComposerSecretBatchRequest,
      O: CreateBackgroundComposerSecretBatchResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.RevokeBackgroundComposerSecret
     */
    revokeBackgroundComposerSecret: {
      name: "RevokeBackgroundComposerSecret",
      I: RevokeBackgroundComposerSecretRequest,
      O: RevokeBackgroundComposerSecretResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.UpdateBackgroundComposerSecret
     */
    updateBackgroundComposerSecret: {
      name: "UpdateBackgroundComposerSecret",
      I: UpdateBackgroundComposerSecretRequest,
      O: UpdateBackgroundComposerSecretResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.GetMcpConfig
     */
    getMcpConfig: {
      name: "GetMcpConfig",
      I: GetMcpConfigRequest,
      O: GetMcpConfigResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.GetEffectiveMcpConfigForUser
     */
    getEffectiveMcpConfigForUser: {
      name: "GetEffectiveMcpConfigForUser",
      I: GetEffectiveMcpConfigForUserRequest,
      O: GetEffectiveMcpConfigForUserResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.GetAvailableMcpServers
     */
    getAvailableMcpServers: {
      name: "GetAvailableMcpServers",
      I: GetAvailableMcpServersRequest,
      O: GetAvailableMcpServersResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.GetMcpServerUsageSummary
     */
    getMcpServerUsageSummary: {
      name: "GetMcpServerUsageSummary",
      I: GetMcpServerUsageSummaryRequest,
      O: GetMcpServerUsageSummaryResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.SetMcpConfig
     */
    setMcpConfig: {
      name: "SetMcpConfig",
      I: SetMcpConfigRequest,
      O: SetMcpConfigResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.UpdateUserDefaultMcpSettings
     */
    updateUserDefaultMcpSettings: {
      name: "UpdateUserDefaultMcpSettings",
      I: UpdateUserDefaultMcpSettingsRequest,
      O: UpdateUserDefaultMcpSettingsResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.MarkMcpServersSeen
     */
    markMcpServersSeen: {
      name: "MarkMcpServersSeen",
      I: MarkMcpServersSeenRequest,
      O: MarkMcpServersSeenResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.StoreMcpOAuthToken
     */
    storeMcpOAuthToken: {
      name: "StoreMcpOAuthToken",
      I: StoreMcpOAuthTokenRequest,
      O: StoreMcpOAuthTokenResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.GetMcpOAuthTokens
     */
    getMcpOAuthTokens: {
      name: "GetMcpOAuthTokens",
      I: GetMcpOAuthTokensRequest,
      O: GetMcpOAuthTokensResponse,
      kind: MethodKind.Unary
    },
    /**
     * Sand backend-execution RPCs: list and execute the calling user's HTTP/SSE
     * MCP tools entirely on the backend (reusing the cloud-agent
     * BackendHttpMcpManager + BackendDbTokenStorage), so the Sand in-box host
     * never connects an MCP client or holds an MCP OAuth token. Auth is the
     * caller's Cursor session; the user can only ever act on their own tokens.
     *
     * @generated from rpc aiserver.v1.DashboardService.ListSandMcpTools
     */
    listSandMcpTools: {
      name: "ListSandMcpTools",
      I: ListSandMcpToolsRequest,
      O: ListSandMcpToolsResponse,
      kind: MethodKind.Unary
    },
    /**
     * Admin-only preview of one team-owned URL MCP's tools. Discovery uses the
     * calling admin's personal MCP credentials and never changes team policy or
     * the admin's enabled-server settings.
     *
     * @generated from rpc aiserver.v1.DashboardService.PreviewTeamMcpTools
     */
    previewTeamMcpTools: {
      name: "PreviewTeamMcpTools",
      I: PreviewTeamMcpToolsRequest,
      O: PreviewTeamMcpToolsResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.ExecuteSandMcpTool
     */
    executeSandMcpTool: {
      name: "ExecuteSandMcpTool",
      I: ExecuteSandMcpToolRequest,
      O: ExecuteSandMcpToolResponse,
      kind: MethodKind.Unary
    },
    /**
     * Sand Auto-review: classify a proposed Shell/MCP/Computer action for
     * the calling user's session. The backend hardcodes the Sand classifier prompt
     * and model policy; clients supply bounded SmartModeClassifierArgs only.
     *
     * @generated from rpc aiserver.v1.DashboardService.ClassifySandAutoReview
     */
    classifySandAutoReview: {
      name: "ClassifySandAutoReview",
      I: ClassifySandAutoReviewRequest,
      O: ClassifySandAutoReviewResponse,
      kind: MethodKind.Unary
    },
    /**
     * Report a batch of Sand agent actions (stdio MCP calls, shell commands,
     * browser navigations, computer-use session summaries) for the calling
     * user's Sand action telemetry stream. See RecordSandAuditEventsRequest.
     *
     * @generated from rpc aiserver.v1.DashboardService.RecordSandAuditEvents
     */
    recordSandAuditEvents: {
      name: "RecordSandAuditEvents",
      I: RecordSandAuditEventsRequest,
      O: RecordSandAuditEventsResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.McpOAuthRefreshLockBegin
     */
    mcpOAuthRefreshLockBegin: {
      name: "McpOAuthRefreshLockBegin",
      I: McpOAuthRefreshLockBeginRequest,
      O: McpOAuthRefreshLockBeginResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.McpOAuthRefreshLockRelease
     */
    mcpOAuthRefreshLockRelease: {
      name: "McpOAuthRefreshLockRelease",
      I: McpOAuthRefreshLockReleaseRequest,
      O: McpOAuthRefreshLockReleaseResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.DeleteMcpOAuthToken
     */
    deleteMcpOAuthToken: {
      name: "DeleteMcpOAuthToken",
      I: DeleteMcpOAuthTokenRequest,
      O: DeleteMcpOAuthTokenResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.ValidateMcpOAuthTokens
     */
    validateMcpOAuthTokens: {
      name: "ValidateMcpOAuthTokens",
      I: ValidateMcpOAuthTokensRequest,
      O: ValidateMcpOAuthTokensResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.CheckHttpMcpStatus
     */
    checkHttpMcpStatus: {
      name: "CheckHttpMcpStatus",
      I: CheckHttpMcpStatusRequest,
      O: CheckHttpMcpStatusResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.StoreMcpOAuthPendingState
     */
    storeMcpOAuthPendingState: {
      name: "StoreMcpOAuthPendingState",
      I: StoreMcpOAuthPendingStateRequest,
      O: StoreMcpOAuthPendingStateResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.GetMcpOAuthPendingState
     */
    getMcpOAuthPendingState: {
      name: "GetMcpOAuthPendingState",
      I: GetMcpOAuthPendingStateRequest,
      O: GetMcpOAuthPendingStateResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.RenameMcpOAuthAccount
     */
    renameMcpOAuthAccount: {
      name: "RenameMcpOAuthAccount",
      I: RenameMcpOAuthAccountRequest,
      O: RenameMcpOAuthAccountResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.DeleteMcpOAuthAccount
     */
    deleteMcpOAuthAccount: {
      name: "DeleteMcpOAuthAccount",
      I: DeleteMcpOAuthAccountRequest,
      O: DeleteMcpOAuthAccountResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.CompleteMcpOAuth
     */
    completeMcpOAuth: {
      name: "CompleteMcpOAuth",
      I: CompleteMcpOAuthRequest,
      O: CompleteMcpOAuthResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.GetPluginMcpConfig
     */
    getPluginMcpConfig: {
      name: "GetPluginMcpConfig",
      I: GetPluginMcpConfigRequest,
      O: GetPluginMcpConfigResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.BatchGetPluginMcpConfig
     */
    batchGetPluginMcpConfig: {
      name: "BatchGetPluginMcpConfig",
      I: BatchGetPluginMcpConfigRequest,
      O: BatchGetPluginMcpConfigResponse,
      kind: MethodKind.Unary
    },
    /**
     * Deprecated: do not add new callers. Install plugins via InstallUserPlugin,
     * which syncs the plugin's MCP rows server-side; existing callers are being
     * migrated off this RPC.
     *
     * @generated from rpc aiserver.v1.DashboardService.AddMcpServersFromPlugin
     * @deprecated
     */
    addMcpServersFromPlugin: {
      name: "AddMcpServersFromPlugin",
      I: AddMcpServersFromPluginRequest,
      O: AddMcpServersFromPluginResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.MoveUserMcpServerToTeam
     */
    moveUserMcpServerToTeam: {
      name: "MoveUserMcpServerToTeam",
      I: MoveUserMcpServerToTeamRequest,
      O: MoveUserMcpServerToTeamResponse,
      kind: MethodKind.Unary
    },
    /**
     * The team-wide MCP placement default (`mcpPlacementDefault` in team admin
     * settings): a dedicated pair, not a slice of UpdateTeamAdminSettings, so
     * the bulk save can never echo it and only an explicit admin action writes
     * it. Both require ManageTeamMcpServers on the active team.
     *
     * @generated from rpc aiserver.v1.DashboardService.GetTeamMcpPlacementDefault
     */
    getTeamMcpPlacementDefault: {
      name: "GetTeamMcpPlacementDefault",
      I: GetTeamMcpPlacementDefaultRequest,
      O: GetTeamMcpPlacementDefaultResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.UpdateTeamMcpPlacementDefault
     */
    updateTeamMcpPlacementDefault: {
      name: "UpdateTeamMcpPlacementDefault",
      I: UpdateTeamMcpPlacementDefaultRequest,
      O: UpdateTeamMcpPlacementDefaultResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.MigrateTeamMcpServersToDefaultMarketplace
     */
    migrateTeamMcpServersToDefaultMarketplace: {
      name: "MigrateTeamMcpServersToDefaultMarketplace",
      I: MigrateTeamMcpServersToDefaultMarketplaceRequest,
      O: MigrateTeamMcpServersToDefaultMarketplaceResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.ProbeMcpUrl
     */
    probeMcpUrl: {
      name: "ProbeMcpUrl",
      I: ProbeMcpUrlRequest,
      O: ProbeMcpUrlResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.CreateTeamWithFreeTrial
     */
    createTeamWithFreeTrial: {
      name: "CreateTeamWithFreeTrial",
      I: CreateTeamWithFreeTrialRequest,
      O: CreateTeamWithFreeTrialResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.CreateTeamWithOrg
     */
    createTeamWithOrg: {
      name: "CreateTeamWithOrg",
      I: CreateTeamWithOrgRequest,
      O: CreateTeamWithOrgResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.GetTeamHasValidPaymentMethod
     */
    getTeamHasValidPaymentMethod: {
      name: "GetTeamHasValidPaymentMethod",
      I: GetTeamHasValidPaymentMethodRequest,
      O: GetTeamHasValidPaymentMethodResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.GetTeamPrivacyModeForced
     */
    getTeamPrivacyModeForced: {
      name: "GetTeamPrivacyModeForced",
      I: GetTeamPrivacyModeForcedRequest,
      O: GetTeamPrivacyModeForcedResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.SwitchTeamPrivacyMode
     */
    switchTeamPrivacyMode: {
      name: "SwitchTeamPrivacyMode",
      I: SwitchTeamPrivacyModeRequest,
      O: SwitchTeamPrivacyModeResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.UpdateFastRequests
     */
    updateFastRequests: {
      name: "UpdateFastRequests",
      I: UpdateFastRequestsRequest,
      O: UpdateFastRequestsResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.GetFastRequests
     */
    getFastRequests: {
      name: "GetFastRequests",
      I: GetFastRequestsRequest,
      O: GetFastRequestsResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.GetDownloadLink
     */
    getDownloadLink: {
      name: "GetDownloadLink",
      I: GetDownloadLinkRequest,
      O: GetDownloadLinkResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.GetCliDownloadUrl
     */
    getCliDownloadUrl: {
      name: "GetCliDownloadUrl",
      I: GetCliDownloadUrlRequest,
      O: GetCliDownloadUrlResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.GetSsoConfigurationLinks
     */
    getSsoConfigurationLinks: {
      name: "GetSsoConfigurationLinks",
      I: GetSsoConfigurationLinksRequest,
      O: GetSsoConfigurationLinksResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.GetScimConfigurationLinks
     */
    getScimConfigurationLinks: {
      name: "GetScimConfigurationLinks",
      I: GetScimConfigurationLinksRequest,
      O: GetScimConfigurationLinksResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.SetAdminOnlyUsagePricing
     */
    setAdminOnlyUsagePricing: {
      name: "SetAdminOnlyUsagePricing",
      I: SetAdminOnlyUsagePricingRequest,
      O: SetAdminOnlyUsagePricingResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.GetYearlyUpgradeEligibility
     */
    getYearlyUpgradeEligibility: {
      name: "GetYearlyUpgradeEligibility",
      I: GetYearlyUpgradeEligibilityRequest,
      O: GetYearlyUpgradeEligibilityResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.UpgradeToYearly
     */
    upgradeToYearly: {
      name: "UpgradeToYearly",
      I: UpgradeToYearlyRequest,
      O: UpgradeToYearlyResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.GetEnterpriseCTAEligibility
     */
    getEnterpriseCTAEligibility: {
      name: "GetEnterpriseCTAEligibility",
      I: GetEnterpriseCTAEligibilityRequest,
      O: GetEnterpriseCTAEligibilityResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.GetUsageBasedPremiumRequests
     */
    getUsageBasedPremiumRequests: {
      name: "GetUsageBasedPremiumRequests",
      I: GetUsageBasedPremiumRequestsRequest,
      O: GetUsageBasedPremiumRequestsResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.SetUsageBasedPremiumRequests
     */
    setUsageBasedPremiumRequests: {
      name: "SetUsageBasedPremiumRequests",
      I: SetUsageBasedPremiumRequestsRequest,
      O: SetUsageBasedPremiumRequestsResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.GetReferrals
     */
    getReferrals: {
      name: "GetReferrals",
      I: GetReferralsRequest,
      O: GetReferralsResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.GetReferralCodes
     */
    getReferralCodes: {
      name: "GetReferralCodes",
      I: GetReferralCodesRequest,
      O: GetReferralCodesResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.CreateP2PReferralLink
     */
    createP2PReferralLink: {
      name: "CreateP2PReferralLink",
      I: CreateP2PReferralLinkRequest,
      O: CreateP2PReferralLinkResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.GetP2PReferralStatus
     */
    getP2PReferralStatus: {
      name: "GetP2PReferralStatus",
      I: GetP2PReferralStatusRequest,
      O: GetP2PReferralStatusResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.SendP2PReferralInvites
     */
    sendP2PReferralInvites: {
      name: "SendP2PReferralInvites",
      I: SendP2PReferralInvitesRequest,
      O: SendP2PReferralInvitesResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.GetP2PReferralHistory
     */
    getP2PReferralHistory: {
      name: "GetP2PReferralHistory",
      I: GetP2PReferralHistoryRequest,
      O: GetP2PReferralHistoryResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.CheckReferralAllowlist
     */
    checkReferralAllowlist: {
      name: "CheckReferralAllowlist",
      I: CheckReferralAllowlistRequest,
      O: CheckReferralAllowlistResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.CheckReferralCode
     */
    checkReferralCode: {
      name: "CheckReferralCode",
      I: CheckReferralCodeRequest,
      O: CheckReferralCodeResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.RedeemGiftCode
     */
    redeemGiftCode: {
      name: "RedeemGiftCode",
      I: RedeemGiftCodeRequest,
      O: RedeemGiftCodeResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.GetEventCodeInfo
     */
    getEventCodeInfo: {
      name: "GetEventCodeInfo",
      I: GetEventCodeInfoRequest,
      O: GetEventCodeInfoResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.RedeemEventCode
     */
    redeemEventCode: {
      name: "RedeemEventCode",
      I: RedeemEventCodeRequest,
      O: RedeemEventCodeResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.GetTeamRepos
     */
    getTeamRepos: {
      name: "GetTeamRepos",
      I: GetTeamReposRequest,
      O: GetTeamReposResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.GetTeamReposOrEmptyIfNotInTeam
     */
    getTeamReposOrEmptyIfNotInTeam: {
      name: "GetTeamReposOrEmptyIfNotInTeam",
      I: GetTeamReposRequest,
      O: GetTeamReposResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.GetTeamRules
     */
    getTeamRules: {
      name: "GetTeamRules",
      I: GetTeamRulesRequest,
      O: GetTeamRulesResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.CreateTeamRule
     */
    createTeamRule: {
      name: "CreateTeamRule",
      I: CreateTeamRuleRequest,
      O: CreateTeamRuleResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.UpdateTeamRule
     */
    updateTeamRule: {
      name: "UpdateTeamRule",
      I: UpdateTeamRuleRequest,
      O: UpdateTeamRuleResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.DeleteTeamRule
     */
    deleteTeamRule: {
      name: "DeleteTeamRule",
      I: DeleteTeamRuleRequest,
      O: DeleteTeamRuleResponse,
      kind: MethodKind.Unary
    },
    /**
     * GROUP-owned Grok Bot rules; see GetTeamGroupRulesRequest.
     *
     * @generated from rpc aiserver.v1.DashboardService.GetTeamGroupRules
     */
    getTeamGroupRules: {
      name: "GetTeamGroupRules",
      I: GetTeamGroupRulesRequest,
      O: GetTeamGroupRulesResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.CreateTeamGroupRule
     */
    createTeamGroupRule: {
      name: "CreateTeamGroupRule",
      I: CreateTeamGroupRuleRequest,
      O: CreateTeamGroupRuleResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.UpdateTeamGroupRule
     */
    updateTeamGroupRule: {
      name: "UpdateTeamGroupRule",
      I: UpdateTeamGroupRuleRequest,
      O: UpdateTeamGroupRuleResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.DeleteTeamGroupRule
     */
    deleteTeamGroupRule: {
      name: "DeleteTeamGroupRule",
      I: DeleteTeamGroupRuleRequest,
      O: DeleteTeamGroupRuleResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.GetTeamHooks
     */
    getTeamHooks: {
      name: "GetTeamHooks",
      I: GetTeamHooksRequest,
      O: GetTeamHooksResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.CreateTeamHook
     */
    createTeamHook: {
      name: "CreateTeamHook",
      I: CreateTeamHookRequest,
      O: CreateTeamHookResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.UpdateTeamHook
     */
    updateTeamHook: {
      name: "UpdateTeamHook",
      I: UpdateTeamHookRequest,
      O: UpdateTeamHookResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.DeleteTeamHook
     */
    deleteTeamHook: {
      name: "DeleteTeamHook",
      I: DeleteTeamHookRequest,
      O: DeleteTeamHookResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.GetTeamCommands
     */
    getTeamCommands: {
      name: "GetTeamCommands",
      I: GetTeamCommandsRequest,
      O: GetTeamCommandsResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.CreateTeamCommand
     */
    createTeamCommand: {
      name: "CreateTeamCommand",
      I: CreateTeamCommandRequest,
      O: CreateTeamCommandResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.UpdateTeamCommand
     */
    updateTeamCommand: {
      name: "UpdateTeamCommand",
      I: UpdateTeamCommandRequest,
      O: UpdateTeamCommandResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.DeleteTeamCommand
     */
    deleteTeamCommand: {
      name: "DeleteTeamCommand",
      I: DeleteTeamCommandRequest,
      O: DeleteTeamCommandResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.GetGlobalCommands
     */
    getGlobalCommands: {
      name: "GetGlobalCommands",
      I: GetGlobalCommandsRequest,
      O: GetGlobalCommandsResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.GetRepoSlashCommands
     */
    getRepoSlashCommands: {
      name: "GetRepoSlashCommands",
      I: GetRepoSlashCommandsRequest,
      O: GetRepoSlashCommandsResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.GetBackgroundComposerSlashCommands
     */
    getBackgroundComposerSlashCommands: {
      name: "GetBackgroundComposerSlashCommands",
      I: GetBackgroundComposerSlashCommandsRequest,
      O: GetBackgroundComposerSlashCommandsResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.GetCloudAgentPluginsSnapshot
     */
    getCloudAgentPluginsSnapshot: {
      name: "GetCloudAgentPluginsSnapshot",
      I: GetCloudAgentPluginsSnapshotRequest,
      O: GetCloudAgentPluginsSnapshotResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.GetBugbotTeamRules
     */
    getBugbotTeamRules: {
      name: "GetBugbotTeamRules",
      I: GetBugbotTeamRulesRequest,
      O: GetBugbotTeamRulesResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.CreateBugbotTeamRule
     */
    createBugbotTeamRule: {
      name: "CreateBugbotTeamRule",
      I: CreateBugbotTeamRuleRequest,
      O: CreateBugbotTeamRuleResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.UpdateBugbotTeamRule
     */
    updateBugbotTeamRule: {
      name: "UpdateBugbotTeamRule",
      I: UpdateBugbotTeamRuleRequest,
      O: UpdateBugbotTeamRuleResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.DeleteBugbotTeamRule
     */
    deleteBugbotTeamRule: {
      name: "DeleteBugbotTeamRule",
      I: DeleteBugbotTeamRuleRequest,
      O: DeleteBugbotTeamRuleResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.GetBugbotLearnedRules
     */
    getBugbotLearnedRules: {
      name: "GetBugbotLearnedRules",
      I: GetBugbotLearnedRulesRequest,
      O: GetBugbotLearnedRulesResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.UpdateBugbotLearnedRule
     */
    updateBugbotLearnedRule: {
      name: "UpdateBugbotLearnedRule",
      I: UpdateBugbotLearnedRuleRequest,
      O: UpdateBugbotLearnedRuleResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.DeleteBugbotLearnedRule
     */
    deleteBugbotLearnedRule: {
      name: "DeleteBugbotLearnedRule",
      I: DeleteBugbotLearnedRuleRequest,
      O: DeleteBugbotLearnedRuleResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.CreateBugbotManualRepositoryRule
     */
    createBugbotManualRepositoryRule: {
      name: "CreateBugbotManualRepositoryRule",
      I: CreateBugbotManualRepositoryRuleRequest,
      O: CreateBugbotManualRepositoryRuleResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.GetBugbotManualRepositoryRules
     */
    getBugbotManualRepositoryRules: {
      name: "GetBugbotManualRepositoryRules",
      I: GetBugbotManualRepositoryRulesRequest,
      O: GetBugbotManualRepositoryRulesResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.UpdateBugbotManualRepositoryRule
     */
    updateBugbotManualRepositoryRule: {
      name: "UpdateBugbotManualRepositoryRule",
      I: UpdateBugbotManualRepositoryRuleRequest,
      O: UpdateBugbotManualRepositoryRuleResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.DeleteBugbotManualRepositoryRule
     */
    deleteBugbotManualRepositoryRule: {
      name: "DeleteBugbotManualRepositoryRule",
      I: DeleteBugbotManualRepositoryRuleRequest,
      O: DeleteBugbotManualRepositoryRuleResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.RunDiamondToBugbotMigration
     */
    runDiamondToBugbotMigration: {
      name: "RunDiamondToBugbotMigration",
      I: RunDiamondToBugbotMigrationRequest,
      O: RunDiamondToBugbotMigrationResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.GetBugbotRuleAnalytics
     */
    getBugbotRuleAnalytics: {
      name: "GetBugbotRuleAnalytics",
      I: GetBugbotRuleAnalyticsRequest,
      O: GetBugbotRuleAnalyticsResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.GetBugbotRuleById
     */
    getBugbotRuleById: {
      name: "GetBugbotRuleById",
      I: GetBugbotRuleByIdRequest,
      O: GetBugbotRuleByIdResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.CreateTeamRepo
     */
    createTeamRepo: {
      name: "CreateTeamRepo",
      I: CreateTeamRepoRequest,
      O: CreateTeamRepoResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.DeleteTeamRepo
     */
    deleteTeamRepo: {
      name: "DeleteTeamRepo",
      I: DeleteTeamRepoRequest,
      O: DeleteTeamRepoResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.AddRepoPattern
     */
    addRepoPattern: {
      name: "AddRepoPattern",
      I: AddRepoPatternRequest,
      O: AddRepoPatternResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.RemoveRepoPattern
     */
    removeRepoPattern: {
      name: "RemoveRepoPattern",
      I: RemoveRepoPatternRequest,
      O: RemoveRepoPatternResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.SetTeamRepoType
     */
    setTeamRepoType: {
      name: "SetTeamRepoType",
      I: SetTeamRepoTypeRequest,
      O: SetTeamRepoTypeResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.GetTeamAdminSettings
     */
    getTeamAdminSettings: {
      name: "GetTeamAdminSettings",
      I: GetTeamAdminSettingsRequest,
      O: GetTeamAdminSettingsResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.GetTeamAdminSettingsOrEmptyIfNotInTeam
     */
    getTeamAdminSettingsOrEmptyIfNotInTeam: {
      name: "GetTeamAdminSettingsOrEmptyIfNotInTeam",
      I: GetTeamAdminSettingsRequest,
      O: GetTeamAdminSettingsResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.GetBaseTeamAdminSettings
     */
    getBaseTeamAdminSettings: {
      name: "GetBaseTeamAdminSettings",
      I: GetBaseTeamAdminSettingsRequest,
      O: GetTeamAdminSettingsResponse,
      kind: MethodKind.Unary
    },
    /**
     * Narrow read of the single effective Origin opt-out flag. Callers that only
     * gate on Origin availability should prefer this over GetTeamAdminSettings,
     * which assembles the full admin-settings blob (directory-group overrides,
     * model access control, browser policy) to return one boolean.
     *
     * @generated from rpc aiserver.v1.DashboardService.GetTeamOriginDisabled
     */
    getTeamOriginDisabled: {
      name: "GetTeamOriginDisabled",
      I: GetTeamOriginDisabledRequest,
      O: GetTeamOriginDisabledResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.UpdateTeamAdminSettings
     */
    updateTeamAdminSettings: {
      name: "UpdateTeamAdminSettings",
      I: UpdateTeamAdminSettingsRequest,
      O: UpdateTeamAdminSettingsResponse,
      kind: MethodKind.Unary
    },
    /**
     * Customer OpenTelemetry export destination settings (dashboard session
     * surface over the same service layer as the team Admin API at
     * /settings/customer-telemetry-destinations). Reads are REDACTED: no RPC
     * ever returns credential material — `has_credentials` only. The whole
     * surface is dark behind the team-ruled Statsig gate
     * `customer_telemetry_destination_admin_api`.
     *
     * @generated from rpc aiserver.v1.DashboardService.GetTeamCustomerTelemetryDestinations
     */
    getTeamCustomerTelemetryDestinations: {
      name: "GetTeamCustomerTelemetryDestinations",
      I: GetTeamCustomerTelemetryDestinationsRequest,
      O: GetTeamCustomerTelemetryDestinationsResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.CreateTeamCustomerTelemetryDestination
     */
    createTeamCustomerTelemetryDestination: {
      name: "CreateTeamCustomerTelemetryDestination",
      I: CreateTeamCustomerTelemetryDestinationRequest,
      O: CreateTeamCustomerTelemetryDestinationResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.UpdateTeamCustomerTelemetryDestination
     */
    updateTeamCustomerTelemetryDestination: {
      name: "UpdateTeamCustomerTelemetryDestination",
      I: UpdateTeamCustomerTelemetryDestinationRequest,
      O: UpdateTeamCustomerTelemetryDestinationResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.DeleteTeamCustomerTelemetryDestination
     */
    deleteTeamCustomerTelemetryDestination: {
      name: "DeleteTeamCustomerTelemetryDestination",
      I: DeleteTeamCustomerTelemetryDestinationRequest,
      O: DeleteTeamCustomerTelemetryDestinationResponse,
      kind: MethodKind.Unary
    },
    /**
     * Probe a candidate export destination (endpoint + write-only candidate
     * credentials) before saving: runs the SSRF/private-IP/DNS safety gate,
     * then POSTs a minimal OTLP request through the egress proxy. Admin-tier
     * (ManageTeamSettings); shares the Admin API's team-ruled Statsig gate. The
     * response is secret-free (a coarse outcome + optional HTTP status code).
     *
     * @generated from rpc aiserver.v1.DashboardService.TestTeamCustomerTelemetryDestinationConnection
     */
    testTeamCustomerTelemetryDestinationConnection: {
      name: "TestTeamCustomerTelemetryDestinationConnection",
      I: TestTeamCustomerTelemetryDestinationConnectionRequest,
      O: TestTeamCustomerTelemetryDestinationConnectionResponse,
      kind: MethodKind.Unary
    },
    /**
     * Delivery health for one export destination: a rolling 60-minute counter
     * window, last success/error, queue/breaker gauges, and recent error
     * classes, all read from the worker-written maindb health rows (replica
     * reads, so regional dashboard hosts serve the same view). Member-tier
     * (ReadTeamSettings) like the destination read; shares the Admin API's
     * team-ruled Statsig gate. The response is secret-free by construction:
     * outcome classes, counts, timestamps, and HTTP status codes only.
     *
     * @generated from rpc aiserver.v1.DashboardService.GetTeamCustomerTelemetryDestinationHealth
     */
    getTeamCustomerTelemetryDestinationHealth: {
      name: "GetTeamCustomerTelemetryDestinationHealth",
      I: GetTeamCustomerTelemetryDestinationHealthRequest,
      O: GetTeamCustomerTelemetryDestinationHealthResponse,
      kind: MethodKind.Unary
    },
    /**
     * Team-level opt-in for CONVERSATION CONTENT export through the customer
     * telemetry pipeline (the conversation_content family): the scrubbed text
     * of members' prompts and assistant responses, delivered only to the
     * team's own destinations that additionally enable the family and its
     * sub-toggles. A dedicated pair (not a slice of UpdateTeamAdminSettings,
     * and not a destination field): the opt-in is a team-wide consent decision
     * layered ABOVE destination config, its enable path hard-blocks NO_STORAGE
     * teams, and it must survive destination delete/recreate. Admin-tier
     * (ManageTeamSettings) for the update; shares the destination surface's
     * team-ruled Statsig gate.
     *
     * @generated from rpc aiserver.v1.DashboardService.GetTeamCustomerTelemetryContentExportOptIn
     */
    getTeamCustomerTelemetryContentExportOptIn: {
      name: "GetTeamCustomerTelemetryContentExportOptIn",
      I: GetTeamCustomerTelemetryContentExportOptInRequest,
      O: GetTeamCustomerTelemetryContentExportOptInResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.UpdateTeamCustomerTelemetryContentExportOptIn
     */
    updateTeamCustomerTelemetryContentExportOptIn: {
      name: "UpdateTeamCustomerTelemetryContentExportOptIn",
      I: UpdateTeamCustomerTelemetryContentExportOptInRequest,
      O: UpdateTeamCustomerTelemetryContentExportOptInResponse,
      kind: MethodKind.Unary
    },
    /**
     * Team-Managed LLM Gateway Credential (Customer-Managed Authentication).
     * Dedicated write-only Dashboard surface — never send secrets through
     * UpdateTeamAdminSettings. Reads return configured/version/updated metadata
     * only. Gated on `llm_gateway_beta`. Impersonation-blocked by default.
     *
     * @generated from rpc aiserver.v1.DashboardService.GetTeamLlmGatewayCredentialStatus
     */
    getTeamLlmGatewayCredentialStatus: {
      name: "GetTeamLlmGatewayCredentialStatus",
      I: GetTeamLlmGatewayCredentialStatusRequest,
      O: GetTeamLlmGatewayCredentialStatusResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.SetTeamLlmGatewayCredential
     */
    setTeamLlmGatewayCredential: {
      name: "SetTeamLlmGatewayCredential",
      I: SetTeamLlmGatewayCredentialRequest,
      O: SetTeamLlmGatewayCredentialResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.ReplaceTeamLlmGatewayCredential
     */
    replaceTeamLlmGatewayCredential: {
      name: "ReplaceTeamLlmGatewayCredential",
      I: ReplaceTeamLlmGatewayCredentialRequest,
      O: ReplaceTeamLlmGatewayCredentialResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.ClearTeamLlmGatewayCredential
     */
    clearTeamLlmGatewayCredential: {
      name: "ClearTeamLlmGatewayCredential",
      I: ClearTeamLlmGatewayCredentialRequest,
      O: ClearTeamLlmGatewayCredentialResponse,
      kind: MethodKind.Unary
    },
    /**
     * No-ZDR (data-retention) per-model consent, recorded at the appropriate
     * top-level owner. Dashboard-only (no IDE entry) and impersonation-blocked.
     *
     * @generated from rpc aiserver.v1.DashboardService.SetTeamNoZdrModelConsent
     */
    setTeamNoZdrModelConsent: {
      name: "SetTeamNoZdrModelConsent",
      I: SetTeamNoZdrModelConsentRequest,
      O: SetTeamNoZdrModelConsentResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.SetOrganizationNoZdrModelConsent
     */
    setOrganizationNoZdrModelConsent: {
      name: "SetOrganizationNoZdrModelConsent",
      I: SetOrganizationNoZdrModelConsentRequest,
      O: SetOrganizationNoZdrModelConsentResponse,
      kind: MethodKind.Unary
    },
    /**
     * Permanent org-level lock that disables on-demand spend on all linked teams
     * and blocks team admins from re-enabling it (ENT-3788).
     *
     * @generated from rpc aiserver.v1.DashboardService.GetOrganizationOnDemandSpendDisabled
     */
    getOrganizationOnDemandSpendDisabled: {
      name: "GetOrganizationOnDemandSpendDisabled",
      I: GetOrganizationOnDemandSpendDisabledRequest,
      O: GetOrganizationOnDemandSpendDisabledResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.SetOrganizationOnDemandSpendDisabled
     */
    setOrganizationOnDemandSpendDisabled: {
      name: "SetOrganizationOnDemandSpendDisabled",
      I: SetOrganizationOnDemandSpendDisabledRequest,
      O: SetOrganizationOnDemandSpendDisabledResponse,
      kind: MethodKind.Unary
    },
    /**
     * Org-wide hide for the in-app credit-request button. Team admins cannot
     * set or override this. Unset organizations keep the button (ENT-4621).
     *
     * @generated from rpc aiserver.v1.DashboardService.GetOrganizationCreditRequestButtonHidden
     */
    getOrganizationCreditRequestButtonHidden: {
      name: "GetOrganizationCreditRequestButtonHidden",
      I: GetOrganizationCreditRequestButtonHiddenRequest,
      O: GetOrganizationCreditRequestButtonHiddenResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.SetOrganizationCreditRequestButtonHidden
     */
    setOrganizationCreditRequestButtonHidden: {
      name: "SetOrganizationCreditRequestButtonHidden",
      I: SetOrganizationCreditRequestButtonHiddenRequest,
      O: SetOrganizationCreditRequestButtonHiddenResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.GetOrganizationRemoteControlSettings
     */
    getOrganizationRemoteControlSettings: {
      name: "GetOrganizationRemoteControlSettings",
      I: GetOrganizationRemoteControlSettingsRequest,
      O: GetOrganizationRemoteControlSettingsResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.UpdateOrganizationRemoteControlSettings
     */
    updateOrganizationRemoteControlSettings: {
      name: "UpdateOrganizationRemoteControlSettings",
      I: UpdateOrganizationRemoteControlSettingsRequest,
      O: UpdateOrganizationRemoteControlSettingsResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.SetUserNoZdrModelConsent
     */
    setUserNoZdrModelConsent: {
      name: "SetUserNoZdrModelConsent",
      I: SetUserNoZdrModelConsentRequest,
      O: SetUserNoZdrModelConsentResponse,
      kind: MethodKind.Unary
    },
    /**
     * Retired: membership-scoped (userId + teamId) "team individual approval"
     * no-ZDR consent was never launched. Retained for wire compatibility; the
     * server always fails closed (individual no-ZDR consent is admin-managed).
     *
     * @generated from rpc aiserver.v1.DashboardService.SetTeamMemberNoZdrModelConsent
     */
    setTeamMemberNoZdrModelConsent: {
      name: "SetTeamMemberNoZdrModelConsent",
      I: SetTeamMemberNoZdrModelConsentRequest,
      O: SetTeamMemberNoZdrModelConsentResponse,
      kind: MethodKind.Unary
    },
    /**
     * Reads a SINGLE owner's no-ZDR consents (never the merged effective map),
     * so each dashboard surface reflects exactly what its owner selected: the
     * team panel shows only the admin's team-wide grants, the personal panel
     * shows only the caller's own grants. Enforcement still ORs the scopes.
     *
     * @generated from rpc aiserver.v1.DashboardService.GetNoZdrModelConsentStatus
     */
    getNoZdrModelConsentStatus: {
      name: "GetNoZdrModelConsentStatus",
      I: GetNoZdrModelConsentStatusRequest,
      O: GetNoZdrModelConsentStatusResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.UpdateTeamInviteLinkTTLSetting
     */
    updateTeamInviteLinkTTLSetting: {
      name: "UpdateTeamInviteLinkTTLSetting",
      I: UpdateTeamInviteLinkTTLSettingRequest,
      O: UpdateTeamInviteLinkTTLSettingResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.UpdateTeamMemberInviteSetting
     */
    updateTeamMemberInviteSetting: {
      name: "UpdateTeamMemberInviteSetting",
      I: UpdateTeamMemberInviteSettingRequest,
      O: UpdateTeamMemberInviteSettingResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.UpdateTeamSandOnboardingCompleted
     */
    updateTeamSandOnboardingCompleted: {
      name: "UpdateTeamSandOnboardingCompleted",
      I: UpdateTeamSandOnboardingCompletedRequest,
      O: UpdateTeamSandOnboardingCompletedResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.UpdateTeamSandSetupChecklistItem
     */
    updateTeamSandSetupChecklistItem: {
      name: "UpdateTeamSandSetupChecklistItem",
      I: UpdateTeamSandSetupChecklistItemRequest,
      O: UpdateTeamSandSetupChecklistItemResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.MarkTeamSandOnboardingSeen
     */
    markTeamSandOnboardingSeen: {
      name: "MarkTeamSandOnboardingSeen",
      I: MarkTeamSandOnboardingSeenRequest,
      O: MarkTeamSandOnboardingSeenResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.GetTeamGrokBotEligibleUserIds
     */
    getTeamGrokBotEligibleUserIds: {
      name: "GetTeamGrokBotEligibleUserIds",
      I: GetTeamGrokBotEligibleUserIdsRequest,
      O: GetTeamGrokBotEligibleUserIdsResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.SendTeamSandOnboardingInvites
     */
    sendTeamSandOnboardingInvites: {
      name: "SendTeamSandOnboardingInvites",
      I: SendTeamSandOnboardingInvitesRequest,
      O: SendTeamSandOnboardingInvitesResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.GetProtectedGitScopes
     */
    getProtectedGitScopes: {
      name: "GetProtectedGitScopes",
      I: GetProtectedGitScopesRequest,
      O: GetProtectedGitScopesResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.CreateProtectedGitScope
     */
    createProtectedGitScope: {
      name: "CreateProtectedGitScope",
      I: CreateProtectedGitScopeRequest,
      O: CreateProtectedGitScopeResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.DeleteProtectedGitScope
     */
    deleteProtectedGitScope: {
      name: "DeleteProtectedGitScope",
      I: DeleteProtectedGitScopeRequest,
      O: DeleteProtectedGitScopeResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.CreateTeamFreeTrialCode
     */
    createTeamFreeTrialCode: {
      name: "CreateTeamFreeTrialCode",
      I: CreateTeamFreeTrialCodeRequest,
      O: CreateTeamFreeTrialCodeResponse,
      kind: MethodKind.Unary
    },
    /**
     * Service-to-service variant of CreateTeamFreeTrialCode for internal callers
     * (e.g. the accountingsphere service) that authenticate with a shared service
     * token instead of a human Cursor-team session. Reuses the same request /
     * response messages and business logic; the human-team-membership check is
     * intentionally not applied because there is no user session.
     *
     * @generated from rpc aiserver.v1.DashboardService.CreateTeamFreeTrialCodeInternal
     */
    createTeamFreeTrialCodeInternal: {
      name: "CreateTeamFreeTrialCodeInternal",
      I: CreateTeamFreeTrialCodeRequest,
      O: CreateTeamFreeTrialCodeResponse,
      kind: MethodKind.Unary
    },
    /**
     * Service-to-service endpoint for the accountingsphere O2C control panel to
     * set or clear a TOKEN_BASED_CONTRACT_TRIAL team's committed-usage-pool
     * override (team.trial_spend_limit_override_dollars, ENT-3832).
     * Authenticated with the same shared service token as
     * CreateTeamFreeTrialCodeInternal; no human session is involved.
     *
     * @generated from rpc aiserver.v1.DashboardService.SetTrialSpendLimitOverrideInternal
     */
    setTrialSpendLimitOverrideInternal: {
      name: "SetTrialSpendLimitOverrideInternal",
      I: SetTrialSpendLimitOverrideInternalRequest,
      O: SetTrialSpendLimitOverrideInternalResponse,
      kind: MethodKind.Unary
    },
    /**
     * Read-side companion to SetTrialSpendLimitOverrideInternal so the O2C
     * control panel can display a trial's current override, the configurable
     * default, and the effective cap without write access side effects.
     *
     * @generated from rpc aiserver.v1.DashboardService.GetTrialSpendLimitInternal
     */
    getTrialSpendLimitInternal: {
      name: "GetTrialSpendLimitInternal",
      I: GetTrialSpendLimitInternalRequest,
      O: GetTrialSpendLimitInternalResponse,
      kind: MethodKind.Unary
    },
    /**
     * xAI grok-backend reads an xAI user's current-period consumer usage
     * (included-allowance meter + per-product split) for the grok.com usage
     * meter. Authenticated by a per-user xAI identity assertion as the bearer
     * token; the user is its subject. No Cursor session.
     *
     * @generated from rpc aiserver.v1.DashboardService.GetXaiUserUsageSnapshot
     */
    getXaiUserUsageSnapshot: {
      name: "GetXaiUserUsageSnapshot",
      I: GetXaiUserUsageSnapshotRequest,
      O: GetXaiUserUsageSnapshotResponse,
      kind: MethodKind.Unary
    },
    /**
     * xAI grok-backend reads and manages the prepaid wallet of an xAI user
     * whose consumer billing lives in Cursor: balance, top-up history and the
     * auto top-up rule. Same messages as the user RPCs above; the wallet is
     * the linked Cursor user's own, or their team's when they are on one.
     * `eligible` is false when the wallet cannot take top-ups from this user:
     * prepaid billing is off for them, or the wallet is their team's and they
     * may not manage team billing (every other field is then empty, not
     * unreadable). Authenticated by a per-user xAI identity assertion as the
     * bearer token, pinned to its own audience so an assertion minted for the
     * usage read cannot change a rule. NOT_FOUND when Cursor has no account
     * for the subject. No Cursor session.
     *
     * @generated from rpc aiserver.v1.DashboardService.GetXaiUserPrepaidBilling
     */
    getXaiUserPrepaidBilling: {
      name: "GetXaiUserPrepaidBilling",
      I: GetUserPrepaidBillingRequest,
      O: GetUserPrepaidBillingResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.SetXaiUserPrepaidAutoTopUp
     */
    setXaiUserPrepaidAutoTopUp: {
      name: "SetXaiUserPrepaidAutoTopUp",
      I: SetUserPrepaidAutoTopUpRequest,
      O: SetUserPrepaidAutoTopUpResponse,
      kind: MethodKind.Unary
    },
    /**
     * Mints the signed-in user's xAI commerce bearer: the Cursor-signed partner
     * JWT for their linked Grok account, plus the origin the commerce RPCs go
     * to, for clients that drive xAI's commerce surfaces themselves (the
     * browser-hosted `@x-clients/commerce-ui` pages, the IDE's Buy Credits
     * modal topping up through the Grok billing service). Typed successor of
     * the `xaiCommerceBearerToken` ClientAction verb: same 5-minute credential,
     * same per-minute limit, gate chosen by `purpose`. Refusals come back in
     * the response, not as errors, so a caller can branch on the reason (an
     * unlinked account starts account linking) without matching copy.
     *
     * @generated from rpc aiserver.v1.DashboardService.GetXaiCommerceBearerToken
     */
    getXaiCommerceBearerToken: {
      name: "GetXaiCommerceBearerToken",
      I: GetXaiCommerceBearerTokenRequest,
      O: GetXaiCommerceBearerTokenResponse,
      kind: MethodKind.Unary
    },
    /**
     * Service-to-service endpoints for the accountingsphere O2C control panel to
     * read and update enterprise-contract-expiry offboarding overrides. These
     * control banner visibility and the delay applied to future phases.
     * Authenticated with the accountingsphere shared service token; no human
     * Cursor-team session is involved.
     *
     * @generated from rpc aiserver.v1.DashboardService.GetTeamOffboardingConfigInternal
     */
    getTeamOffboardingConfigInternal: {
      name: "GetTeamOffboardingConfigInternal",
      I: GetTeamOffboardingConfigInternalRequest,
      O: GetTeamOffboardingConfigInternalResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.UpdateTeamOffboardingConfigInternal
     */
    updateTeamOffboardingConfigInternal: {
      name: "UpdateTeamOffboardingConfigInternal",
      I: UpdateTeamOffboardingConfigInternalRequest,
      O: UpdateTeamOffboardingConfigInternalResponse,
      kind: MethodKind.Unary
    },
    /**
     * Service-to-service endpoint for the accountingsphere credit-grant queue to
     * create a manual team credit grant — the same credit_grant row Anytool's
     * creditGrant.create writes (manual: no policy condition, not global). Like
     * Anytool's prefill flow, the grant is promoted to the team's linked Cursor
     * organization (org-owned row) when exactly one link exists, so it pools
     * across the org's teams; otherwise it stays team-owned. Authenticated with
     * the same shared service token as CreateTeamFreeTrialCodeInternal; no human
     * session is involved, so the request's `created_by` is recorded for
     * attribution but never used for authorization.
     *
     * @generated from rpc aiserver.v1.DashboardService.CreateTeamCreditGrantInternal
     */
    createTeamCreditGrantInternal: {
      name: "CreateTeamCreditGrantInternal",
      I: CreateTeamCreditGrantInternalRequest,
      O: CreateTeamCreditGrantInternalResponse,
      kind: MethodKind.Unary
    },
    /**
     * Read-side companion to CreateTeamCreditGrantInternal so the
     * accountingsphere credit-grant queue can tell a team's first grant from an
     * additional grant without relying on Slack history. Mirrors Anytool's
     * creditGrant.listByTeam (manual grants only), and also returns grants owned
     * by the team's unambiguously linked Cursor organization so org-promoted
     * grants are not missed.
     *
     * @generated from rpc aiserver.v1.DashboardService.ListTeamCreditGrantsInternal
     */
    listTeamCreditGrantsInternal: {
      name: "ListTeamCreditGrantsInternal",
      I: ListTeamCreditGrantsInternalRequest,
      O: ListTeamCreditGrantsInternalResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.CreateTeamsTrialV2ReferralCode
     */
    createTeamsTrialV2ReferralCode: {
      name: "CreateTeamsTrialV2ReferralCode",
      I: CreateTeamsTrialV2ReferralCodeRequest,
      O: CreateTeamsTrialV2ReferralCodeResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.GetTeamAnalytics
     */
    getTeamAnalytics: {
      name: "GetTeamAnalytics",
      I: GetTeamAnalyticsRequest,
      O: GetTeamAnalyticsResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.GetUserAnalytics
     */
    getUserAnalytics: {
      name: "GetUserAnalytics",
      I: GetUserAnalyticsRequest,
      O: GetUserAnalyticsResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.GetTeamRawData
     */
    getTeamRawData: {
      name: "GetTeamRawData",
      I: GetTeamRawDataRequest,
      O: GetTeamRawDataResponse,
      kind: MethodKind.Unary
    },
    /**
     * Deprecated: the last client branch that used this response for UI was 2.2.0-pre.17.
     * 2.2.0-pre.18+ and stable 2.2 still call it after chat turns, but only fold
     * the response into unused composer.usageData. Return an empty response for compatibility.
     *
     * @generated from rpc aiserver.v1.DashboardService.GetClientUsageData
     * @deprecated
     */
    getClientUsageData: {
      name: "GetClientUsageData",
      I: GetClientUsageDataRequest,
      O: GetClientUsageDataResponse,
      kind: MethodKind.Unary
    },
    /**
     * In the client, we want to show some information about the current period's usage.
     *
     * @generated from rpc aiserver.v1.DashboardService.GetCurrentPeriodUsage
     */
    getCurrentPeriodUsage: {
      name: "GetCurrentPeriodUsage",
      I: GetCurrentPeriodUsageRequest,
      O: GetCurrentPeriodUsageResponse,
      kind: MethodKind.Unary
    },
    /**
     * Caller-scoped Sand usage and reset APIs. The authenticated session is the
     * only source of user identity; requests intentionally carry no user id.
     *
     * Period-start freshness: UseSandBankedReset returns an authoritative
     * new_current_period_start from primary state. GetSandUsageStatus may briefly
     * lag (cached anchors). After a successful reset, clients should prefer the
     * reset response's new_current_period_start whenever it is greater than
     * GetSandUsageStatusResponse.current_period_start, then resume trusting
     * GetSandUsageStatus after about 1 minute.
     *
     * @generated from rpc aiserver.v1.DashboardService.UseSandBankedReset
     */
    useSandBankedReset: {
      name: "UseSandBankedReset",
      I: UseSandBankedResetRequest,
      O: UseSandBankedResetResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.ListSandBankedResets
     */
    listSandBankedResets: {
      name: "ListSandBankedResets",
      I: ListSandBankedResetsRequest,
      O: ListSandBankedResetsResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.GetSandUsageStatus
     */
    getSandUsageStatus: {
      name: "GetSandUsageStatus",
      I: GetSandUsageStatusRequest,
      O: GetSandUsageStatusResponse,
      kind: MethodKind.Unary
    },
    /**
     * User-triggered claim of the one-time Sand free-trial credit. Caller-scoped
     * like the other Sand RPCs: the authenticated session is the only source of
     * user identity. Callers with a stored payment method are activated
     * synchronously; callers without one receive a setup-mode Stripe Checkout
     * URL, and activation completes via the checkout webhook. Fails with
     * ALREADY_EXISTS when the user already redeemed and FAILED_PRECONDITION when
     * ineligible (paid plan, team member, trial disabled, or a bound card
     * already funded a trial).
     *
     * @generated from rpc aiserver.v1.DashboardService.StartSandTrial
     */
    startSandTrial: {
      name: "StartSandTrial",
      I: StartSandTrialRequest,
      O: StartSandTrialResponse,
      kind: MethodKind.Unary
    },
    /**
     * Read-only companion to StartSandTrial: whether a claim by the caller
     * would currently be accepted (plan shape, rollout gates, kill switch, and
     * the once-per-user redemption slot). Caller-scoped like StartSandTrial;
     * reserves and mints nothing. The claim itself can still fail on checks
     * that only run at claim time (e.g. a card that already funded a trial).
     *
     * @generated from rpc aiserver.v1.DashboardService.IsEligibleForSandTrial
     */
    isEligibleForSandTrial: {
      name: "IsEligibleForSandTrial",
      I: IsEligibleForSandTrialRequest,
      O: IsEligibleForSandTrialResponse,
      kind: MethodKind.Unary
    },
    /**
     * What became of the caller's own trial claim, so a claimer waiting on the
     * checkout webhook can be told why it will never land. A plain read of the
     * caller's sand_trial_redemption row: no Stripe, no eligibility
     * recomputation, no writes. Separate from IsEligibleForSandTrial, which
     * answers "would a claim be accepted" with one reasonless boolean.
     *
     * @generated from rpc aiserver.v1.DashboardService.GetSandTrialClaimStatus
     */
    getSandTrialClaimStatus: {
      name: "GetSandTrialClaimStatus",
      I: GetSandTrialClaimStatusRequest,
      O: GetSandTrialClaimStatusResponse,
      kind: MethodKind.Unary
    },
    /**
     * Cancel the caller's own live Sand trial by expiring its credit grant
     * immediately. Free-plan individual callers only — every other shape holds
     * a plan or seat and has nothing to cancel here. The once-per-user
     * redemption slot stays consumed, so canceling never reopens eligibility.
     * FAILED_PRECONDITION when the caller is not on the free plan or has no
     * live trial grant to cancel.
     *
     * @generated from rpc aiserver.v1.DashboardService.CancelSandTrial
     */
    cancelSandTrial: {
      name: "CancelSandTrial",
      I: CancelSandTrialRequest,
      O: CancelSandTrialResponse,
      kind: MethodKind.Unary
    },
    /**
     * Server-owned answer to "may this account use Sand, and if not, why". The
     * client renders it rather than re-deriving eligibility, so the rule can
     * widen without an app release. Answers ineligible callers too.
     *
     * @generated from rpc aiserver.v1.DashboardService.GetSandAccessStatus
     */
    getSandAccessStatus: {
      name: "GetSandAccessStatus",
      I: GetSandAccessStatusRequest,
      O: GetSandAccessStatusResponse,
      kind: MethodKind.Unary
    },
    /**
     * The identifier the Grok Bot mobile apps hand to the marketing SDK (Braze
     * `external_id`): the caller's linked xAI user id, or empty when the Cursor
     * account has no live xAI identity. Caller-scoped like the other Sand RPCs
     * and deliberately separate from GetSandAccessStatus, which sits on the
     * mobile cold-start path and must not pick up an identitydb read.
     *
     * @generated from rpc aiserver.v1.DashboardService.GetSandMarketingIdentity
     */
    getSandMarketingIdentity: {
      name: "GetSandMarketingIdentity",
      I: GetSandMarketingIdentityRequest,
      O: GetSandMarketingIdentityResponse,
      kind: MethodKind.Unary
    },
    /**
     * Account-scoped roster of desktop installs available to Sand local
     * execution. The current install id comes only from x-cursor-checksum;
     * callers never choose it in the registration request.
     *
     * @generated from rpc aiserver.v1.DashboardService.RegisterSandMachine
     */
    registerSandMachine: {
      name: "RegisterSandMachine",
      I: RegisterSandMachineRequest,
      O: RegisterSandMachineResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.ListSandMachines
     */
    listSandMachines: {
      name: "ListSandMachines",
      I: ListSandMachinesRequest,
      O: ListSandMachinesResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.UpdateSandMachineLabel
     */
    updateSandMachineLabel: {
      name: "UpdateSandMachineLabel",
      I: UpdateSandMachineLabelRequest,
      O: UpdateSandMachineLabelResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.UpdateSandMachineLocalToolPermission
     */
    updateSandMachineLocalToolPermission: {
      name: "UpdateSandMachineLocalToolPermission",
      I: UpdateSandMachineLocalToolPermissionRequest,
      O: UpdateSandMachineLocalToolPermissionResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.GetSandMachineMessagesEnabled
     */
    getSandMachineMessagesEnabled: {
      name: "GetSandMachineMessagesEnabled",
      I: GetSandMachineMessagesEnabledRequest,
      O: GetSandMachineMessagesEnabledResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.UpdateSandMachineMessagesEnabled
     */
    updateSandMachineMessagesEnabled: {
      name: "UpdateSandMachineMessagesEnabled",
      I: UpdateSandMachineMessagesEnabledRequest,
      O: UpdateSandMachineMessagesEnabledResponse,
      kind: MethodKind.Unary
    },
    /**
     * A team member's durable ask that their team's admins enable Sand for the
     * team — the first consumer of the generic user_access_request table. At
     * most one
     * open ask per member; re-asking while one is pending is a no-op success.
     *
     * @generated from rpc aiserver.v1.DashboardService.RequestSandTeamAccess
     */
    requestSandTeamAccess: {
      name: "RequestSandTeamAccess",
      I: RequestSandTeamAccessRequest,
      O: RequestSandTeamAccessResponse,
      kind: MethodKind.Unary
    },
    /**
     * Admin view of the user_access_request table: everything still pending
     * for a team, each row carrying a server-rendered per-kind summary so
     * callers need no per-kind special-casing.
     *
     * @generated from rpc aiserver.v1.DashboardService.ListPendingUserAccessRequests
     */
    listPendingUserAccessRequests: {
      name: "ListPendingUserAccessRequests",
      I: ListPendingUserAccessRequestsRequest,
      O: ListPendingUserAccessRequestsResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.GetUsageSignalsProjectionSnapshot
     */
    getUsageSignalsProjectionSnapshot: {
      name: "GetUsageSignalsProjectionSnapshot",
      I: GetProjectionSnapshotRequest,
      O: GetProjectionSnapshotResponse,
      kind: MethodKind.Unary
    },
    /**
     * Lightweight plan metadata that can be fetched quickly for UI display.
     *
     * @generated from rpc aiserver.v1.DashboardService.GetPlanInfo
     */
    getPlanInfo: {
      name: "GetPlanInfo",
      I: GetPlanInfoRequest,
      O: GetPlanInfoResponse,
      kind: MethodKind.Unary
    },
    /**
     * Verify a signed Apple In-App Purchase transaction and grant the matching
     * individual plan. The iOS app calls this after a StoreKit purchase,
     * upgrade, restore, or Transaction.updates event (see [RFC] In-App Payments
     * v1). The server re-verifies the signed JWS offline against Apple's root
     * certs, maps the product id to a tier, binds the entitlement to the
     * authenticated account, and writes membershipStatus; it is idempotent on
     * (environment, original_transaction_id). Called with a mobile session: add
     * it to the authHandlers.ts mobile-session allowlist when the verifier lands
     * (intentionally NOT allowlisted yet, since only a throwing stub exists).
     *
     * @generated from rpc aiserver.v1.DashboardService.VerifyAppleTransaction
     */
    verifyAppleTransaction: {
      name: "VerifyAppleTransaction",
      I: VerifyAppleTransactionRequest,
      O: VerifyAppleTransactionResponse,
      kind: MethodKind.Unary
    },
    /**
     * Verify and acknowledge a Google Play subscription for the production Grok
     * Bot Android app. The server fixes the package to ai.x.grok.bot, fetches the
     * authoritative subscription from Google, binds it to the authenticated
     * account, records the ledger, acknowledges it, and only then grants access.
     *
     * @generated from rpc aiserver.v1.DashboardService.VerifyGooglePlayPurchase
     */
    verifyGooglePlayPurchase: {
      name: "VerifyGooglePlayPurchase",
      I: VerifyGooglePlayPurchaseRequest,
      O: VerifyGooglePlayPurchaseResponse,
      kind: MethodKind.Unary
    },
    /**
     * Returns the authenticated user's stable, opaque account identifier for
     * Google Play Billing. Android passes it as obfuscatedAccountId; it contains
     * no user identity and remains stable across authentication migrations.
     *
     * @generated from rpc aiserver.v1.DashboardService.GetGooglePlayBillingAccountId
     */
    getGooglePlayBillingAccountId: {
      name: "GetGooglePlayBillingAccountId",
      I: GetGooglePlayBillingAccountIdRequest,
      O: GetGooglePlayBillingAccountIdResponse,
      kind: MethodKind.Unary
    },
    /**
     * Internal-only (anytool, via internal-service + acting-employee auth): read
     * a Google Play subscription purchase from the Android Publisher API with the
     * backend's Play credentials. Read-only; never acknowledges or binds.
     *
     * @generated from rpc aiserver.v1.DashboardService.InspectGooglePlaySubscriptionInternal
     */
    inspectGooglePlaySubscriptionInternal: {
      name: "InspectGooglePlaySubscriptionInternal",
      I: InspectGooglePlaySubscriptionInternalRequest,
      O: InspectGooglePlaySubscriptionInternalResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.InspectGooglePlayTransactionsInternal
     */
    inspectGooglePlayTransactionsInternal: {
      name: "InspectGooglePlayTransactionsInternal",
      I: InspectGooglePlayTransactionsInternalRequest,
      O: InspectGooglePlayTransactionsInternalResponse,
      kind: MethodKind.Unary
    },
    /**
     * Server-owned Cursor Review eligibility for first-party review surfaces.
     *
     * @generated from rpc aiserver.v1.DashboardService.GetCursorReviewEntitlement
     */
    getCursorReviewEntitlement: {
      name: "GetCursorReviewEntitlement",
      I: GetCursorReviewEntitlementRequest,
      O: GetCursorReviewEntitlementResponse,
      kind: MethodKind.Unary
    },
    /**
     * Origin Review people-picker: authoring-time lookup of people the caller
     * can reference in a cursor.com inbox section filter. Resolves a free-text
     * prefix query against Cursor users who share a team with the caller (plus
     * the caller), and against exact GitHub-login matches among the GitHub
     * users registered on those teams. Returns forge-neutral person refs
     * (Cursor identity + linked GitHub identity) so the saved filter never
     * needs an identity lookup on inbox load. Typeahead-rate-limited per user.
     *
     * @generated from rpc aiserver.v1.DashboardService.SearchOriginReviewPeople
     */
    searchOriginReviewPeople: {
      name: "SearchOriginReviewPeople",
      I: SearchOriginReviewPeopleRequest,
      O: SearchOriginReviewPeopleResponse,
      kind: MethodKind.Unary
    },
    /**
     * Origin Review per-user preferences (theme, code style, ...) for cursor.com
     * review surfaces, stored in maindb keyed by the authenticated Cursor user.
     * The blob is schema-versioned and opaque to the server.
     *
     * @generated from rpc aiserver.v1.DashboardService.GetOriginReviewPreferences
     */
    getOriginReviewPreferences: {
      name: "GetOriginReviewPreferences",
      I: GetOriginReviewPreferencesRequest,
      O: GetOriginReviewPreferencesResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.SetOriginReviewPreferences
     */
    setOriginReviewPreferences: {
      name: "SetOriginReviewPreferences",
      I: SetOriginReviewPreferencesRequest,
      O: SetOriginReviewPreferencesResponse,
      kind: MethodKind.Unary
    },
    /**
     * Check if the user has an active usage limit policy
     * Deprecated: Use GetUsageLimitStatusAndActiveGrants instead
     *
     * @generated from rpc aiserver.v1.DashboardService.GetUsageLimitPolicyStatus
     */
    getUsageLimitPolicyStatus: {
      name: "GetUsageLimitPolicyStatus",
      I: GetUsageLimitPolicyStatusRequest,
      O: GetUsageLimitPolicyStatusResponse,
      kind: MethodKind.Unary
    },
    /**
     * Unified endpoint for usage limit status and active credit grants
     *
     * @generated from rpc aiserver.v1.DashboardService.GetUsageLimitStatusAndActiveGrants
     */
    getUsageLimitStatusAndActiveGrants: {
      name: "GetUsageLimitStatusAndActiveGrants",
      I: GetUsageLimitStatusAndActiveGrantsRequest,
      O: GetUsageLimitStatusAndActiveGrantsResponse,
      kind: MethodKind.Unary
    },
    /**
     * Promo credit grant balance (credit-grant-influencer*)
     *
     * @generated from rpc aiserver.v1.DashboardService.GetCreditGrantsBalance
     */
    getCreditGrantsBalance: {
      name: "GetCreditGrantsBalance",
      I: GetCreditGrantsBalanceRequest,
      O: GetCreditGrantsBalanceResponse,
      kind: MethodKind.Unary
    },
    /**
     * Credit grants marked as visible to the client (e.g. YC grants)
     *
     * @generated from rpc aiserver.v1.DashboardService.GetClientVisibleCreditGrants
     */
    getClientVisibleCreditGrants: {
      name: "GetClientVisibleCreditGrants",
      I: GetClientVisibleCreditGrantsRequest,
      O: GetClientVisibleCreditGrantsResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.GetAdvancedAnalyticsEnabled
     */
    getAdvancedAnalyticsEnabled: {
      name: "GetAdvancedAnalyticsEnabled",
      I: GetAdvancedAnalyticsEnabledRequest,
      O: GetAdvancedAnalyticsEnabledResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.GetTokenUsage
     */
    getTokenUsage: {
      name: "GetTokenUsage",
      I: GetTokenUsageRequest,
      O: GetTokenUsageResponse,
      kind: MethodKind.Unary
    },
    /**
     * New endpoint to validate and save a Bedrock IAM role
     *
     * @generated from rpc aiserver.v1.DashboardService.ValidateBedrockIamRole
     */
    validateBedrockIamRole: {
      name: "ValidateBedrockIamRole",
      I: ValidateBedrockIamRoleRequest,
      O: ValidateBedrockIamRoleResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.GetTeamSpend
     */
    getTeamSpend: {
      name: "GetTeamSpend",
      I: GetTeamSpendRequest,
      O: GetTeamSpendResponse,
      kind: MethodKind.Unary
    },
    /**
     * Economics-based seat-upgrade recommendations for a self-serve tiered team.
     * Returns recommendations for the FULL eligible team (all Standard, active,
     * non-free members) — not limited to a single page of the members table.
     *
     * @generated from rpc aiserver.v1.DashboardService.GetTeamSeatUpgradeRecommendations
     */
    getTeamSeatUpgradeRecommendations: {
      name: "GetTeamSeatUpgradeRecommendations",
      I: GetTeamSeatUpgradeRecommendationsRequest,
      O: GetTeamSeatUpgradeRecommendationsResponse,
      kind: MethodKind.Unary
    },
    /**
     * Pending member-requested seat-tier upgrades for the selected team.
     *
     * @generated from rpc aiserver.v1.DashboardService.GetPendingSeatTierUpgradeRequests
     */
    getPendingSeatTierUpgradeRequests: {
      name: "GetPendingSeatTierUpgradeRequests",
      I: GetPendingSeatTierUpgradeRequestsRequest,
      O: GetPendingSeatTierUpgradeRequestsResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.GetCurrentBillingCycle
     */
    getCurrentBillingCycle: {
      name: "GetCurrentBillingCycle",
      I: GetCurrentBillingCycleRequest,
      O: GetCurrentBillingCycleResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.GetMonthlyBillingCycle
     */
    getMonthlyBillingCycle: {
      name: "GetMonthlyBillingCycle",
      I: GetMonthlyBillingCycleRequest,
      O: GetMonthlyBillingCycleResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.GetBugbotSettings
     */
    getBugbotSettings: {
      name: "GetBugbotSettings",
      I: GetBugbotSettingsRequest,
      O: GetBugbotSettingsResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.GetBugbotAnalyticsV2
     */
    getBugbotAnalyticsV2: {
      name: "GetBugbotAnalyticsV2",
      I: GetBugbotAnalyticsV2Request,
      O: GetBugbotAnalyticsV2Response,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.GetBugBotPRAnalytics
     */
    getBugBotPRAnalytics: {
      name: "GetBugBotPRAnalytics",
      I: GetBugBotPRAnalyticsRequest,
      O: GetBugBotPRAnalyticsResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.GetGithubInstallations
     */
    getGithubInstallations: {
      name: "GetGithubInstallations",
      I: GetGithubInstallationsRequest,
      O: GetGithubInstallationsResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.GetGithubInstallationTenantGrants
     */
    getGithubInstallationTenantGrants: {
      name: "GetGithubInstallationTenantGrants",
      I: GetGithubInstallationTenantGrantsRequest,
      O: GetGithubInstallationTenantGrantsResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.GrantGithubInstallationTenant
     */
    grantGithubInstallationTenant: {
      name: "GrantGithubInstallationTenant",
      I: GrantGithubInstallationTenantRequest,
      O: GrantGithubInstallationTenantResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.RevokeGithubInstallationTenant
     */
    revokeGithubInstallationTenant: {
      name: "RevokeGithubInstallationTenant",
      I: RevokeGithubInstallationTenantRequest,
      O: RevokeGithubInstallationTenantResponse,
      kind: MethodKind.Unary
    },
    /**
     * Suggests high-traffic repos (by recent PR volume) that don't yet have
     * Bugbot enabled, to nudge users to enable Bugbot on more repos.
     *
     * @generated from rpc aiserver.v1.DashboardService.GetBugbotSuggestedRepos
     */
    getBugbotSuggestedRepos: {
      name: "GetBugbotSuggestedRepos",
      I: GetBugbotSuggestedReposRequest,
      O: GetBugbotSuggestedReposResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.GetScmConnectionStatus
     */
    getScmConnectionStatus: {
      name: "GetScmConnectionStatus",
      I: GetScmConnectionStatusRequest,
      O: GetScmConnectionStatusResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.GetGithubRepoAccessStatus
     */
    getGithubRepoAccessStatus: {
      name: "GetGithubRepoAccessStatus",
      I: GetGithubRepoAccessStatusRequest,
      O: GetGithubRepoAccessStatusResponse,
      kind: MethodKind.Unary
    },
    /**
     * GetScmConnectionStatus for several providers in one round trip, served
     * from a short per-user cache. The Sand desktop's integrations view asks
     * for every SCM provider on one tick; this replaces one call per provider.
     *
     * @generated from rpc aiserver.v1.DashboardService.GetScmConnectionStatuses
     */
    getScmConnectionStatuses: {
      name: "GetScmConnectionStatuses",
      I: GetScmConnectionStatusesRequest,
      O: GetScmConnectionStatusesResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.GetInstallationRepos
     */
    getInstallationRepos: {
      name: "GetInstallationRepos",
      I: GetInstallationReposRequest,
      O: GetInstallationReposResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.FetchAllInstallationRepos
     */
    fetchAllInstallationRepos: {
      name: "FetchAllInstallationRepos",
      I: FetchAllInstallationReposRequest,
      O: FetchAllInstallationReposResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.GetInstallationGithubUsers
     */
    getInstallationGithubUsers: {
      name: "GetInstallationGithubUsers",
      I: GetInstallationGithubUsersRequest,
      O: GetInstallationGithubUsersResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.GetUserAdminOrganizations
     */
    getUserAdminOrganizations: {
      name: "GetUserAdminOrganizations",
      I: GetUserAdminOrganizationsRequest,
      O: GetUserAdminOrganizationsResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.GetTeamGithubUsers
     */
    getTeamGithubUsers: {
      name: "GetTeamGithubUsers",
      I: GetTeamGithubUsersRequest,
      O: GetTeamGithubUsersResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.AddGithubUsersToTeam
     */
    addGithubUsersToTeam: {
      name: "AddGithubUsersToTeam",
      I: AddGithubUsersToTeamRequest,
      O: AddGithubUsersToTeamResponse,
      kind: MethodKind.Unary
    },
    /**
     * GitHub->Origin migration-window tool: resolves GitHub identities to the
     * Cursor users of a team/org the caller administers. Snapshot producer, not
     * a live resolver — the identity bridge decays continuously (unlinking
     * GitHub hard-deletes its rows) and freezes at GitHub decommissioning, so
     * callers must persist results (github_user_node_id + resolved_at) instead
     * of re-resolving at use time.
     *
     * @generated from rpc aiserver.v1.DashboardService.ResolveGithubIdentities
     */
    resolveGithubIdentities: {
      name: "ResolveGithubIdentities",
      I: ResolveGithubIdentitiesRequest,
      O: ResolveGithubIdentitiesResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.GetUserPullRequests
     */
    getUserPullRequests: {
      name: "GetUserPullRequests",
      I: GetUserPullRequestsRequest,
      O: GetUserPullRequestsResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.GetUserReviewRequests
     */
    getUserReviewRequests: {
      name: "GetUserReviewRequests",
      I: GetUserReviewRequestsRequest,
      O: GetUserReviewRequestsResponse,
      kind: MethodKind.Unary
    },
    /**
     * Get the pull request URL for a given repo URL and branch name
     *
     * @generated from rpc aiserver.v1.DashboardService.GetPullRequestForBranch
     */
    getPullRequestForBranch: {
      name: "GetPullRequestForBranch",
      I: GetPullRequestForBranchRequest,
      O: GetPullRequestForBranchResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.UpdateGithubRepoSettings
     */
    updateGithubRepoSettings: {
      name: "UpdateGithubRepoSettings",
      I: UpdateGithubRepoSettingsRequest,
      O: UpdateGithubRepoSettingsResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.UpdateGithubInstallationSettings
     */
    updateGithubInstallationSettings: {
      name: "UpdateGithubInstallationSettings",
      I: UpdateGithubInstallationSettingsRequest,
      O: UpdateGithubInstallationSettingsResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.UpdateAllGithubRepoSettings
     */
    updateAllGithubRepoSettings: {
      name: "UpdateAllGithubRepoSettings",
      I: UpdateAllGithubRepoSettingsRequest,
      O: UpdateAllGithubRepoSettingsResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.UpdateGithubInstallationTeamScope
     */
    updateGithubInstallationTeamScope: {
      name: "UpdateGithubInstallationTeamScope",
      I: UpdateGithubInstallationTeamScopeRequest,
      O: UpdateGithubInstallationTeamScopeResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.UpdateSelfGithubAllowlist
     */
    updateSelfGithubAllowlist: {
      name: "UpdateSelfGithubAllowlist",
      I: UpdateSelfGithubAllowlistRequest,
      O: UpdateSelfGithubAllowlistResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.GetTeamBugbotSettings
     */
    getTeamBugbotSettings: {
      name: "GetTeamBugbotSettings",
      I: GetTeamBugbotSettingsRequest,
      O: GetTeamBugbotSettingsResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.UpdateTeamBugbotSettings
     */
    updateTeamBugbotSettings: {
      name: "UpdateTeamBugbotSettings",
      I: UpdateTeamBugbotSettingsRequest,
      O: UpdateTeamBugbotSettingsResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.MigrateTeamBugbotToUsageBasedBilling
     */
    migrateTeamBugbotToUsageBasedBilling: {
      name: "MigrateTeamBugbotToUsageBasedBilling",
      I: MigrateTeamBugbotToUsageBasedBillingRequest,
      O: MigrateTeamBugbotToUsageBasedBillingResponse,
      kind: MethodKind.Unary
    },
    /**
     * Latest merged-PR scan stats + high-severity findings for the
     * "Bugbot found N bugs" upsell page (`/dashboard/bugbot?mergedPrScan=1`).
     * Team admins only; the scan rows are written by bugbotMergedPrScanCron.
     *
     * @generated from rpc aiserver.v1.DashboardService.GetBugbotMergedPrScanSummary
     */
    getBugbotMergedPrScanSummary: {
      name: "GetBugbotMergedPrScanSummary",
      I: GetBugbotMergedPrScanSummaryRequest,
      O: GetBugbotMergedPrScanSummaryResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.GetBugbotMode
     */
    getBugbotMode: {
      name: "GetBugbotMode",
      I: GetBugbotModeRequest,
      O: GetBugbotModeResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.UpdateBugbotMode
     */
    updateBugbotMode: {
      name: "UpdateBugbotMode",
      I: UpdateBugbotModeRequest,
      O: UpdateBugbotModeResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.GetBugBotProUserMode
     */
    getBugBotProUserMode: {
      name: "GetBugBotProUserMode",
      I: GetBugBotProUserModeRequest,
      O: GetBugBotProUserModeResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.UpdateBugBotProUserMode
     */
    updateBugBotProUserMode: {
      name: "UpdateBugBotProUserMode",
      I: UpdateBugBotProUserModeRequest,
      O: UpdateBugBotProUserModeResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.GetBugbotUserSettings
     */
    getBugbotUserSettings: {
      name: "GetBugbotUserSettings",
      I: GetBugbotUserSettingsRequest,
      O: GetBugbotUserSettingsResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.UpdateBugbotUserSettings
     */
    updateBugbotUserSettings: {
      name: "UpdateBugbotUserSettings",
      I: UpdateBugbotUserSettingsRequest,
      O: UpdateBugbotUserSettingsResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.GetFullSelfDrivingUserSettings
     */
    getFullSelfDrivingUserSettings: {
      name: "GetFullSelfDrivingUserSettings",
      I: GetFullSelfDrivingUserSettingsRequest,
      O: GetFullSelfDrivingUserSettingsResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.UpdateFullSelfDrivingUserSettings
     */
    updateFullSelfDrivingUserSettings: {
      name: "UpdateFullSelfDrivingUserSettings",
      I: UpdateFullSelfDrivingUserSettingsRequest,
      O: UpdateFullSelfDrivingUserSettingsResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.ListFullSelfDrivingRepoSettings
     */
    listFullSelfDrivingRepoSettings: {
      name: "ListFullSelfDrivingRepoSettings",
      I: ListFullSelfDrivingRepoSettingsRequest,
      O: ListFullSelfDrivingRepoSettingsResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.SetFullSelfDrivingRepoEnabled
     */
    setFullSelfDrivingRepoEnabled: {
      name: "SetFullSelfDrivingRepoEnabled",
      I: SetFullSelfDrivingRepoEnabledRequest,
      O: SetFullSelfDrivingRepoEnabledResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.GetFullSelfDrivingTeamSettings
     */
    getFullSelfDrivingTeamSettings: {
      name: "GetFullSelfDrivingTeamSettings",
      I: GetFullSelfDrivingTeamSettingsRequest,
      O: GetFullSelfDrivingTeamSettingsResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.UpdateFullSelfDrivingTeamSettings
     */
    updateFullSelfDrivingTeamSettings: {
      name: "UpdateFullSelfDrivingTeamSettings",
      I: UpdateFullSelfDrivingTeamSettingsRequest,
      O: UpdateFullSelfDrivingTeamSettingsResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.ListFullSelfDrivingTeamRepoSettings
     */
    listFullSelfDrivingTeamRepoSettings: {
      name: "ListFullSelfDrivingTeamRepoSettings",
      I: ListFullSelfDrivingTeamRepoSettingsRequest,
      O: ListFullSelfDrivingTeamRepoSettingsResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.SetFullSelfDrivingTeamRepoEnabled
     */
    setFullSelfDrivingTeamRepoEnabled: {
      name: "SetFullSelfDrivingTeamRepoEnabled",
      I: SetFullSelfDrivingTeamRepoEnabledRequest,
      O: SetFullSelfDrivingTeamRepoEnabledResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.ListFullSelfDrivingActiveAgents
     */
    listFullSelfDrivingActiveAgents: {
      name: "ListFullSelfDrivingActiveAgents",
      I: ListFullSelfDrivingActiveAgentsRequest,
      O: ListFullSelfDrivingActiveAgentsResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.ListFullSelfDrivingTeamActiveAgents
     */
    listFullSelfDrivingTeamActiveAgents: {
      name: "ListFullSelfDrivingTeamActiveAgents",
      I: ListFullSelfDrivingTeamActiveAgentsRequest,
      O: ListFullSelfDrivingTeamActiveAgentsResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.UpdateFullSelfDrivingPrConfig
     */
    updateFullSelfDrivingPrConfig: {
      name: "UpdateFullSelfDrivingPrConfig",
      I: UpdateFullSelfDrivingPrConfigRequest,
      O: UpdateFullSelfDrivingPrConfigResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.GetBugBotProUserSettings
     */
    getBugBotProUserSettings: {
      name: "GetBugBotProUserSettings",
      I: GetBugBotProUserSettingsRequest,
      O: GetBugBotProUserSettingsResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.UpdateBugBotProUserSettings
     */
    updateBugBotProUserSettings: {
      name: "UpdateBugBotProUserSettings",
      I: UpdateBugBotProUserSettingsRequest,
      O: UpdateBugBotProUserSettingsResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.MigrateBugBotProUserToUsageBasedBilling
     */
    migrateBugBotProUserToUsageBasedBilling: {
      name: "MigrateBugBotProUserToUsageBasedBilling",
      I: MigrateBugBotProUserToUsageBasedBillingRequest,
      O: MigrateBugBotProUserToUsageBasedBillingResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.GetGlassEarlyPreviewEnrollment
     */
    getGlassEarlyPreviewEnrollment: {
      name: "GetGlassEarlyPreviewEnrollment",
      I: GetGlassEarlyPreviewEnrollmentRequest,
      O: GetGlassEarlyPreviewEnrollmentResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.EnrollInGlassEarlyPreview
     */
    enrollInGlassEarlyPreview: {
      name: "EnrollInGlassEarlyPreview",
      I: EnrollInGlassEarlyPreviewRequest,
      O: EnrollInGlassEarlyPreviewResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.UnenrollFromGlassEarlyPreview
     */
    unenrollFromGlassEarlyPreview: {
      name: "UnenrollFromGlassEarlyPreview",
      I: UnenrollFromGlassEarlyPreviewRequest,
      O: UnenrollFromGlassEarlyPreviewResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.RecordBugbotDeeplinkEvent
     */
    recordBugbotDeeplinkEvent: {
      name: "RecordBugbotDeeplinkEvent",
      I: RecordBugbotDeeplinkEventRequest,
      O: RecordBugbotDeeplinkEventResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.RecordBugbotDeeplinkEventUnauthenticated
     */
    recordBugbotDeeplinkEventUnauthenticated: {
      name: "RecordBugbotDeeplinkEventUnauthenticated",
      I: RecordBugbotDeeplinkEventRequest,
      O: RecordBugbotDeeplinkEventResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.RevokeBugBotLicenses
     */
    revokeBugBotLicenses: {
      name: "RevokeBugBotLicenses",
      I: RevokeBugBotLicensesRequest,
      O: RevokeBugBotLicensesResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.RevokeUserBugbotLicense
     */
    revokeUserBugbotLicense: {
      name: "RevokeUserBugbotLicense",
      I: RevokeUserBugbotLicenseRequest,
      O: RevokeUserBugbotLicenseResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.StartBugbotBackfillLearning
     */
    startBugbotBackfillLearning: {
      name: "StartBugbotBackfillLearning",
      I: StartBugbotBackfillLearningRequest,
      O: StartBugbotBackfillLearningResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.GetBugbotBackfillStatus
     */
    getBugbotBackfillStatus: {
      name: "GetBugbotBackfillStatus",
      I: GetBugbotBackfillStatusRequest,
      O: GetBugbotBackfillStatusResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.SetSlackAuth
     */
    setSlackAuth: {
      name: "SetSlackAuth",
      I: SetSlackAuthRequest,
      O: SetSlackAuthResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.GetSlackTeamSettings
     */
    getSlackTeamSettings: {
      name: "GetSlackTeamSettings",
      I: GetSlackTeamSettingsRequest,
      O: GetSlackTeamSettingsResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.UpdateSlackTeamSettings
     */
    updateSlackTeamSettings: {
      name: "UpdateSlackTeamSettings",
      I: UpdateSlackTeamSettingsRequest,
      O: UpdateSlackTeamSettingsResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.GetSlackSettings
     */
    getSlackSettings: {
      name: "GetSlackSettings",
      I: GetSlackSettingsRequest,
      O: GetSlackSettingsResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.GetSlackModelOptions
     */
    getSlackModelOptions: {
      name: "GetSlackModelOptions",
      I: GetSlackModelOptionsRequest,
      O: GetSlackModelOptionsResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.GetSlackInstallUrl
     */
    getSlackInstallUrl: {
      name: "GetSlackInstallUrl",
      I: GetSlackInstallUrlRequest,
      O: GetSlackInstallUrlResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.GetSlackInstallUrlPublic
     */
    getSlackInstallUrlPublic: {
      name: "GetSlackInstallUrlPublic",
      I: GetPublicSlackInstallUrlRequest,
      O: GetPublicSlackInstallUrlResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.GetSlackInstallUrlPublicWithUserScopes
     */
    getSlackInstallUrlPublicWithUserScopes: {
      name: "GetSlackInstallUrlPublicWithUserScopes",
      I: GetPublicSlackInstallUrlWithUserScopesRequest,
      O: GetPublicSlackInstallUrlWithUserScopesResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.GetFilteredUsageEvents
     */
    getFilteredUsageEvents: {
      name: "GetFilteredUsageEvents",
      I: GetFilteredUsageEventsRequest,
      O: GetFilteredUsageEventsResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.GetAggregatedUsageEvents
     */
    getAggregatedUsageEvents: {
      name: "GetAggregatedUsageEvents",
      I: GetAggregatedUsageEventsRequest,
      O: GetAggregatedUsageEventsResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.GetAuditLogs
     */
    getAuditLogs: {
      name: "GetAuditLogs",
      I: GetAuditLogsRequest,
      O: GetAuditLogsResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.GetOrganizationAuditLogs
     */
    getOrganizationAuditLogs: {
      name: "GetOrganizationAuditLogs",
      I: GetOrganizationAuditLogsRequest,
      O: GetOrganizationAuditLogsResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.ListTeamDataExports
     */
    listTeamDataExports: {
      name: "ListTeamDataExports",
      I: ListTeamDataExportsRequest,
      O: ListTeamDataExportsResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.CreateTeamDataExportDownloadUrl
     */
    createTeamDataExportDownloadUrl: {
      name: "CreateTeamDataExportDownloadUrl",
      I: CreateTeamDataExportDownloadUrlRequest,
      O: CreateTeamDataExportDownloadUrlResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.GetUserPrivacyMode
     */
    getUserPrivacyMode: {
      name: "GetUserPrivacyMode",
      I: GetUserPrivacyModeRequest,
      O: GetUserPrivacyModeResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.SetUserPrivacyMode
     */
    setUserPrivacyMode: {
      name: "SetUserPrivacyMode",
      I: SetUserPrivacyModeRequest,
      O: SetUserPrivacyModeResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.WebAcknowledgeGracePeriodDisclaimer
     */
    webAcknowledgeGracePeriodDisclaimer: {
      name: "WebAcknowledgeGracePeriodDisclaimer",
      I: WebAcknowledgeGracePeriodDisclaimerRequest,
      O: WebAcknowledgeGracePeriodDisclaimerResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.SkipPrivacyModeGracePeriod
     */
    skipPrivacyModeGracePeriod: {
      name: "SkipPrivacyModeGracePeriod",
      I: SkipPrivacyModeGracePeriodRequest,
      O: SkipPrivacyModeGracePeriodResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.NeedsPrivacyModeMigration
     */
    needsPrivacyModeMigration: {
      name: "NeedsPrivacyModeMigration",
      I: NeedsPrivacyModeMigrationRequest,
      O: NeedsPrivacyModeMigrationResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.UpdateTeamPrivacyModeMigrationOptOut
     */
    updateTeamPrivacyModeMigrationOptOut: {
      name: "UpdateTeamPrivacyModeMigrationOptOut",
      I: UpdateTeamPrivacyModeMigrationOptOutRequest,
      O: UpdateTeamPrivacyModeMigrationOptOutResponse,
      kind: MethodKind.Unary
    },
    /**
     * Shared Conversation endpoints
     *
     * @generated from rpc aiserver.v1.DashboardService.ShareConversation
     */
    shareConversation: {
      name: "ShareConversation",
      I: ShareConversationRequest,
      O: ShareConversationResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.GetSharedConversation
     */
    getSharedConversation: {
      name: "GetSharedConversation",
      I: GetSharedConversationRequest,
      O: GetSharedConversationResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.GetPublicSharedConversation
     */
    getPublicSharedConversation: {
      name: "GetPublicSharedConversation",
      I: GetPublicSharedConversationRequest,
      O: GetPublicSharedConversationResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.ListSharedConversations
     */
    listSharedConversations: {
      name: "ListSharedConversations",
      I: ListSharedConversationsRequest,
      O: ListSharedConversationsResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.DeleteSharedConversation
     */
    deleteSharedConversation: {
      name: "DeleteSharedConversation",
      I: DeleteSharedConversationRequest,
      O: DeleteSharedConversationResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.UpdateSharedConversationVisibility
     */
    updateSharedConversationVisibility: {
      name: "UpdateSharedConversationVisibility",
      I: UpdateSharedConversationVisibilityRequest,
      O: UpdateSharedConversationVisibilityResponse,
      kind: MethodKind.Unary
    },
    /**
     * Shared Canvas endpoints (team-only v1; mirrors ShareConversation*)
     *
     * @generated from rpc aiserver.v1.DashboardService.ShareCanvas
     */
    shareCanvas: {
      name: "ShareCanvas",
      I: ShareCanvasRequest,
      O: ShareCanvasResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.GetSharedCanvas
     */
    getSharedCanvas: {
      name: "GetSharedCanvas",
      I: GetSharedCanvasRequest,
      O: GetSharedCanvasResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.GetPublicSharedCanvas
     */
    getPublicSharedCanvas: {
      name: "GetPublicSharedCanvas",
      I: GetPublicSharedCanvasRequest,
      O: GetPublicSharedCanvasResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.ListSharedCanvases
     */
    listSharedCanvases: {
      name: "ListSharedCanvases",
      I: ListSharedCanvasesRequest,
      O: ListSharedCanvasesResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.DeleteSharedCanvas
     */
    deleteSharedCanvas: {
      name: "DeleteSharedCanvas",
      I: DeleteSharedCanvasRequest,
      O: DeleteSharedCanvasResponse,
      kind: MethodKind.Unary
    },
    /**
     * Caller-scoped lookup so the IDE dropdown can show current state
     * without round-tripping through GetSharedCanvas.
     *
     * @generated from rpc aiserver.v1.DashboardService.LookupSharedCanvasByKey
     */
    lookupSharedCanvasByKey: {
      name: "LookupSharedCanvasByKey",
      I: LookupSharedCanvasByKeyRequest,
      O: LookupSharedCanvasByKeyResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.ListUserCanvases
     */
    listUserCanvases: {
      name: "ListUserCanvases",
      I: ListUserCanvasesRequest,
      O: ListUserCanvasesResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.GetCanvasMetadata
     */
    getCanvasMetadata: {
      name: "GetCanvasMetadata",
      I: GetCanvasMetadataRequest,
      O: GetCanvasMetadataResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.GetCanvasPayload
     */
    getCanvasPayload: {
      name: "GetCanvasPayload",
      I: GetCanvasPayloadRequest,
      O: GetCanvasPayloadResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.SetCanvasVisibility
     */
    setCanvasVisibility: {
      name: "SetCanvasVisibility",
      I: SetCanvasVisibilityRequest,
      O: SetCanvasVisibilityResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.DeleteCanvas
     */
    deleteCanvas: {
      name: "DeleteCanvas",
      I: DeleteCanvasRequest,
      O: DeleteCanvasResponse,
      kind: MethodKind.Unary
    },
    /**
     * Shared Conversation Settings (team admin settings for shared conversations feature)
     * These endpoints are available to all teams, not just enterprise
     *
     * @generated from rpc aiserver.v1.DashboardService.GetTeamSharedConversationSettings
     */
    getTeamSharedConversationSettings: {
      name: "GetTeamSharedConversationSettings",
      I: GetTeamSharedConversationSettingsRequest,
      O: GetTeamSharedConversationSettingsResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.UpdateTeamSharedConversationSettings
     */
    updateTeamSharedConversationSettings: {
      name: "UpdateTeamSharedConversationSettings",
      I: UpdateTeamSharedConversationSettingsRequest,
      O: UpdateTeamSharedConversationSettingsResponse,
      kind: MethodKind.Unary
    },
    /**
     * Shared Canvas Settings (team admin settings for shared canvases feature)
     * These endpoints are available to all teams, not just enterprise
     *
     * @generated from rpc aiserver.v1.DashboardService.GetTeamSharedCanvasSettings
     */
    getTeamSharedCanvasSettings: {
      name: "GetTeamSharedCanvasSettings",
      I: GetTeamSharedCanvasSettingsRequest,
      O: GetTeamSharedCanvasSettingsResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.UpdateTeamSharedCanvasSettings
     */
    updateTeamSharedCanvasSettings: {
      name: "UpdateTeamSharedCanvasSettings",
      I: UpdateTeamSharedCanvasSettingsRequest,
      O: UpdateTeamSharedCanvasSettingsResponse,
      kind: MethodKind.Unary
    },
    /**
     * Team admin control for the Projects feature (Glass / IDE / iOS). Available
     * to all teams — bulk UpdateTeamAdminSettings is gated on model access
     * control. Default is enabled; an explicit false hides Projects the same
     * way the glass_projects_enabled Statsig gate does.
     *
     * @generated from rpc aiserver.v1.DashboardService.GetTeamProjectsSettings
     */
    getTeamProjectsSettings: {
      name: "GetTeamProjectsSettings",
      I: GetTeamProjectsSettingsRequest,
      O: GetTeamProjectsSettingsResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.UpdateTeamProjectsSettings
     */
    updateTeamProjectsSettings: {
      name: "UpdateTeamProjectsSettings",
      I: UpdateTeamProjectsSettingsRequest,
      O: UpdateTeamProjectsSettingsResponse,
      kind: MethodKind.Unary
    },
    /**
     * Public Profile Settings (team admin control for public user profiles)
     * These endpoints are available to all teams, not just enterprise
     *
     * @generated from rpc aiserver.v1.DashboardService.GetTeamPublicProfileSettings
     */
    getTeamPublicProfileSettings: {
      name: "GetTeamPublicProfileSettings",
      I: GetTeamPublicProfileSettingsRequest,
      O: GetTeamPublicProfileSettingsResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.UpdateTeamPublicProfileSettings
     */
    updateTeamPublicProfileSettings: {
      name: "UpdateTeamPublicProfileSettings",
      I: UpdateTeamPublicProfileSettingsRequest,
      O: UpdateTeamPublicProfileSettingsResponse,
      kind: MethodKind.Unary
    },
    /**
     * Grok Bot public template sharing. Available to all teams, not just
     * enterprise — bulk UpdateTeamAdminSettings is gated on model access
     * control. Unset follows Statsig; a stored enum (`all` / `team_only` /
     * `none`) wins over the Statsig DC.
     *
     * @generated from rpc aiserver.v1.DashboardService.GetTeamSandShareBotExportSettings
     */
    getTeamSandShareBotExportSettings: {
      name: "GetTeamSandShareBotExportSettings",
      I: GetTeamSandShareBotExportSettingsRequest,
      O: GetTeamSandShareBotExportSettingsResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.UpdateTeamSandShareBotExportSettings
     */
    updateTeamSandShareBotExportSettings: {
      name: "UpdateTeamSandShareBotExportSettings",
      I: UpdateTeamSandShareBotExportSettingsRequest,
      O: UpdateTeamSandShareBotExportSettingsResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.UpdateTeamGrokBotCapabilities
     */
    updateTeamGrokBotCapabilities: {
      name: "UpdateTeamGrokBotCapabilities",
      I: UpdateTeamGrokBotCapabilitiesRequest,
      O: UpdateTeamGrokBotCapabilitiesResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.GetTeamSandHibernatedOwnerVmTerminationSettings
     */
    getTeamSandHibernatedOwnerVmTerminationSettings: {
      name: "GetTeamSandHibernatedOwnerVmTerminationSettings",
      I: GetTeamSandHibernatedOwnerVmTerminationSettingsRequest,
      O: GetTeamSandHibernatedOwnerVmTerminationSettingsResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.UpdateTeamSandHibernatedOwnerVmTerminationSettings
     */
    updateTeamSandHibernatedOwnerVmTerminationSettings: {
      name: "UpdateTeamSandHibernatedOwnerVmTerminationSettings",
      I: UpdateTeamSandHibernatedOwnerVmTerminationSettingsRequest,
      O: UpdateTeamSandHibernatedOwnerVmTerminationSettingsResponse,
      kind: MethodKind.Unary
    },
    /**
     * Smart Auto routing settings (team admin control for auto v3 / smart
     * routing). Admins may only enable when the smart_auto_routing_admin_enabled
     * Statsig gate passes for the team.
     *
     * @generated from rpc aiserver.v1.DashboardService.GetTeamSmartAutoSettings
     */
    getTeamSmartAutoSettings: {
      name: "GetTeamSmartAutoSettings",
      I: GetTeamSmartAutoSettingsRequest,
      O: GetTeamSmartAutoSettingsResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.UpdateTeamSmartAutoSettings
     */
    updateTeamSmartAutoSettings: {
      name: "UpdateTeamSmartAutoSettings",
      I: UpdateTeamSmartAutoSettingsRequest,
      O: UpdateTeamSmartAutoSettingsResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.GetTeamPromptCachingSettings
     */
    getTeamPromptCachingSettings: {
      name: "GetTeamPromptCachingSettings",
      I: GetTeamPromptCachingSettingsRequest,
      O: GetTeamPromptCachingSettingsResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.UpdateTeamPromptCachingSettings
     */
    updateTeamPromptCachingSettings: {
      name: "UpdateTeamPromptCachingSettings",
      I: UpdateTeamPromptCachingSettingsRequest,
      O: UpdateTeamPromptCachingSettingsResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.ResetTeamAgentRunModeToAutoReview
     */
    resetTeamAgentRunModeToAutoReview: {
      name: "ResetTeamAgentRunModeToAutoReview",
      I: ResetTeamAgentRunModeToAutoReviewRequest,
      O: ResetTeamAgentRunModeToAutoReviewResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.GetUserSmartAutoSettings
     */
    getUserSmartAutoSettings: {
      name: "GetUserSmartAutoSettings",
      I: GetUserSmartAutoSettingsRequest,
      O: GetUserSmartAutoSettingsResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.UpdateUserSmartAutoSettings
     */
    updateUserSmartAutoSettings: {
      name: "UpdateUserSmartAutoSettings",
      I: UpdateUserSmartAutoSettingsRequest,
      O: UpdateUserSmartAutoSettingsResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.GetTeamBackgroundAgentSettings
     */
    getTeamBackgroundAgentSettings: {
      name: "GetTeamBackgroundAgentSettings",
      I: GetTeamBackgroundAgentSettingsRequest,
      O: GetTeamBackgroundAgentSettingsResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.UpdateTeamBackgroundAgentSettings
     */
    updateTeamBackgroundAgentSettings: {
      name: "UpdateTeamBackgroundAgentSettings",
      I: UpdateTeamBackgroundAgentSettingsRequest,
      O: UpdateTeamBackgroundAgentSettingsResponse,
      kind: MethodKind.Unary
    },
    /**
     * Preferred repo source (unified repo concept): which forge backs repo
     * listings when a repo is mirrored between GitHub and Origin. The get
     * returns the requester's personal preference, the team default, and the
     * resolved effective value (user > team > github).
     *
     * @generated from rpc aiserver.v1.DashboardService.GetRepoSourcePreference
     */
    getRepoSourcePreference: {
      name: "GetRepoSourcePreference",
      I: GetRepoSourcePreferenceRequest,
      O: GetRepoSourcePreferenceResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.UpdateUserRepoSourcePreference
     */
    updateUserRepoSourcePreference: {
      name: "UpdateUserRepoSourcePreference",
      I: UpdateUserRepoSourcePreferenceRequest,
      O: UpdateUserRepoSourcePreferenceResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.UpdateTeamRepoSourcePreference
     */
    updateTeamRepoSourcePreference: {
      name: "UpdateTeamRepoSourcePreference",
      I: UpdateTeamRepoSourcePreferenceRequest,
      O: UpdateTeamRepoSourcePreferenceResponse,
      kind: MethodKind.Unary
    },
    /**
     * Which forge PRs should be created on for one repo, after applying the
     * requester's repo source preference to the repo's GitHub/Origin mirror
     * linkage. Used by local (non-cloud) agent surfaces to pick `co` vs `gh`.
     *
     * @generated from rpc aiserver.v1.DashboardService.ResolvePrCreationForge
     */
    resolvePrCreationForge: {
      name: "ResolvePrCreationForge",
      I: ResolvePrCreationForgeRequest,
      O: ResolvePrCreationForgeResponse,
      kind: MethodKind.Unary
    },
    /**
     * Revokes an existing invite link given its invite code
     *
     * @generated from rpc aiserver.v1.DashboardService.RevokeTeamInviteLink
     */
    revokeTeamInviteLink: {
      name: "RevokeTeamInviteLink",
      I: RevokeTeamInviteLinkRequest,
      O: RevokeTeamInviteLinkResponse,
      kind: MethodKind.Unary
    },
    /**
     * Lists all active invite links for a team including their expiration timestamps
     *
     * @generated from rpc aiserver.v1.DashboardService.ListTeamInviteLinks
     */
    listTeamInviteLinks: {
      name: "ListTeamInviteLinks",
      I: ListTeamInviteLinksRequest,
      O: ListTeamInviteLinksResponse,
      kind: MethodKind.Unary
    },
    /**
     * Updates the user's display name
     *
     * @generated from rpc aiserver.v1.DashboardService.UpdateUserName
     */
    updateUserName: {
      name: "UpdateUserName",
      I: UpdateUserNameRequest,
      O: UpdateUserNameResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.UploadUserProfilePicture
     */
    uploadUserProfilePicture: {
      name: "UploadUserProfilePicture",
      I: UploadUserProfilePictureRequest,
      O: UploadUserProfilePictureResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.UpdateUserProfilePicture
     */
    updateUserProfilePicture: {
      name: "UpdateUserProfilePicture",
      I: UpdateUserProfilePictureRequest,
      O: UpdateUserProfilePictureResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.ListInvoices
     */
    listInvoices: {
      name: "ListInvoices",
      I: ListInvoicesRequest,
      O: ListInvoicesResponse,
      kind: MethodKind.Unary
    },
    /**
     * Outstanding invoices for subscriptions that still block a new individual
     * checkout. Not a paginated invoice-history endpoint.
     *
     * @generated from rpc aiserver.v1.DashboardService.ListBlockingCheckoutInvoices
     */
    listBlockingCheckoutInvoices: {
      name: "ListBlockingCheckoutInvoices",
      I: ListBlockingCheckoutInvoicesRequest,
      O: ListBlockingCheckoutInvoicesResponse,
      kind: MethodKind.Unary
    },
    /**
     * Payable (open or uncollectible) invoices for every payment-failed team
     * (`unpaid` or `past_due` subscription) whose billing the caller can manage.
     * Powers the dashboard's cross-team payment-recovery banner (ENT-3746): a
     * multi-team admin must see every team's outstanding invoices, not just the
     * resolved dashboard team's. Not a paginated invoice-history endpoint.
     *
     * @generated from rpc aiserver.v1.DashboardService.ListPayableTeamInvoices
     */
    listPayableTeamInvoices: {
      name: "ListPayableTeamInvoices",
      I: ListPayableTeamInvoicesRequest,
      O: ListPayableTeamInvoicesResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.GetRemainingRefunds
     */
    getRemainingRefunds: {
      name: "GetRemainingRefunds",
      I: GetRemainingRefundsRequest,
      O: GetRemainingRefundsResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.GetServiceAccountSpendLimit
     */
    getServiceAccountSpendLimit: {
      name: "GetServiceAccountSpendLimit",
      I: GetServiceAccountSpendLimitRequest,
      O: GetServiceAccountSpendLimitResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.SetServiceAccountSpendLimit
     */
    setServiceAccountSpendLimit: {
      name: "SetServiceAccountSpendLimit",
      I: SetServiceAccountSpendLimitRequest,
      O: SetServiceAccountSpendLimitResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.SetUserHardLimit
     */
    setUserHardLimit: {
      name: "SetUserHardLimit",
      I: SetUserHardLimitRequest,
      O: SetUserHardLimitResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.SetUserMonthlyLimit
     */
    setUserMonthlyLimit: {
      name: "SetUserMonthlyLimit",
      I: SetUserMonthlyLimitRequest,
      O: SetUserMonthlyLimitResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.ToggleMarketingEmailOpt
     */
    toggleMarketingEmailOpt: {
      name: "ToggleMarketingEmailOpt",
      I: ToggleMarketingEmailOptRequest,
      O: ToggleMarketingEmailOptResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.GetMarketingEmailOpt
     */
    getMarketingEmailOpt: {
      name: "GetMarketingEmailOpt",
      I: GetMarketingEmailOptRequest,
      O: GetMarketingEmailOptResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.GetGlobalLeaderboardOptIn
     */
    getGlobalLeaderboardOptIn: {
      name: "GetGlobalLeaderboardOptIn",
      I: GetGlobalLeaderboardOptInRequest,
      O: GetGlobalLeaderboardOptInResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.SetGlobalLeaderboardOptIn
     */
    setGlobalLeaderboardOptIn: {
      name: "SetGlobalLeaderboardOptIn",
      I: SetGlobalLeaderboardOptInRequest,
      O: SetGlobalLeaderboardOptInResponse,
      kind: MethodKind.Unary
    },
    /**
     * Team API Key endpoints
     *
     * @generated from rpc aiserver.v1.DashboardService.CreateTeamApiKey
     */
    createTeamApiKey: {
      name: "CreateTeamApiKey",
      I: CreateTeamApiKeyRequest,
      O: CreateTeamApiKeyResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.RevokeTeamApiKey
     */
    revokeTeamApiKey: {
      name: "RevokeTeamApiKey",
      I: RevokeTeamApiKeyRequest,
      O: RevokeTeamApiKeyResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.ListTeamApiKeys
     */
    listTeamApiKeys: {
      name: "ListTeamApiKeys",
      I: ListTeamApiKeysRequest,
      O: ListTeamApiKeysResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.CreateOrganizationApiKey
     */
    createOrganizationApiKey: {
      name: "CreateOrganizationApiKey",
      I: CreateOrganizationApiKeyRequest,
      O: CreateOrganizationApiKeyResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.RevokeOrganizationApiKey
     */
    revokeOrganizationApiKey: {
      name: "RevokeOrganizationApiKey",
      I: RevokeOrganizationApiKeyRequest,
      O: RevokeOrganizationApiKeyResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.ListOrganizationApiKeys
     */
    listOrganizationApiKeys: {
      name: "ListOrganizationApiKeys",
      I: ListOrganizationApiKeysRequest,
      O: ListOrganizationApiKeysResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.CreateAutomationWebhookApiKey
     */
    createAutomationWebhookApiKey: {
      name: "CreateAutomationWebhookApiKey",
      I: CreateAutomationWebhookApiKeyRequest,
      O: CreateAutomationWebhookApiKeyResponse,
      kind: MethodKind.Unary
    },
    /**
     * Service account endpoints
     *
     * @generated from rpc aiserver.v1.DashboardService.CreateTeamServiceAccount
     */
    createTeamServiceAccount: {
      name: "CreateTeamServiceAccount",
      I: CreateTeamServiceAccountRequest,
      O: CreateTeamServiceAccountResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.ListTeamServiceAccounts
     */
    listTeamServiceAccounts: {
      name: "ListTeamServiceAccounts",
      I: ListTeamServiceAccountsRequest,
      O: ListTeamServiceAccountsResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.DeleteTeamServiceAccount
     */
    deleteTeamServiceAccount: {
      name: "DeleteTeamServiceAccount",
      I: DeleteTeamServiceAccountRequest,
      O: DeleteTeamServiceAccountResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.ArchiveTeamServiceAccount
     */
    archiveTeamServiceAccount: {
      name: "ArchiveTeamServiceAccount",
      I: ArchiveTeamServiceAccountRequest,
      O: ArchiveTeamServiceAccountResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.RotateServiceAccountApiKey
     */
    rotateServiceAccountApiKey: {
      name: "RotateServiceAccountApiKey",
      I: RotateServiceAccountApiKeyRequest,
      O: RotateServiceAccountApiKeyResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.GetTeamRepositoriesForServiceAccountScope
     */
    getTeamRepositoriesForServiceAccountScope: {
      name: "GetTeamRepositoriesForServiceAccountScope",
      I: GetTeamRepositoriesForServiceAccountScopeRequest,
      O: GetTeamRepositoriesForServiceAccountScopeResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.UpdateServiceAccountRepoScope
     */
    updateServiceAccountRepoScope: {
      name: "UpdateServiceAccountRepoScope",
      I: UpdateServiceAccountRepoScopeRequest,
      O: UpdateServiceAccountRepoScopeResponse,
      kind: MethodKind.Unary
    },
    /**
     * User API Key endpoints
     *
     * @generated from rpc aiserver.v1.DashboardService.CreateUserApiKey
     */
    createUserApiKey: {
      name: "CreateUserApiKey",
      I: CreateUserApiKeyRequest,
      O: CreateUserApiKeyResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.RevokeUserApiKey
     */
    revokeUserApiKey: {
      name: "RevokeUserApiKey",
      I: RevokeUserApiKeyRequest,
      O: RevokeUserApiKeyResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.ListUserApiKeys
     */
    listUserApiKeys: {
      name: "ListUserApiKeys",
      I: ListUserApiKeysRequest,
      O: ListUserApiKeysResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.ConfirmGithubInstallation
     */
    confirmGithubInstallation: {
      name: "ConfirmGithubInstallation",
      I: ConfirmGithubInstallationRequest,
      O: ConfirmGithubInstallationResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.UpdateTeamName
     */
    updateTeamName: {
      name: "UpdateTeamName",
      I: UpdateTeamNameRequest,
      O: UpdateTeamNameResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.UpdateTeamDashboardAnalyticsSetting
     */
    updateTeamDashboardAnalyticsSetting: {
      name: "UpdateTeamDashboardAnalyticsSetting",
      I: UpdateTeamDashboardAnalyticsSettingRequest,
      O: UpdateTeamDashboardAnalyticsSettingResponse,
      kind: MethodKind.Unary
    },
    /**
     * Ungated Origin opt-out writer, separate from the enterprise-gated bulk RPC.
     *
     * @generated from rpc aiserver.v1.DashboardService.UpdateTeamOriginSetting
     */
    updateTeamOriginSetting: {
      name: "UpdateTeamOriginSetting",
      I: UpdateTeamOriginSettingRequest,
      O: UpdateTeamOriginSettingResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.UpdateTeamScimRequireUserDirectorySetting
     */
    updateTeamScimRequireUserDirectorySetting: {
      name: "UpdateTeamScimRequireUserDirectorySetting",
      I: UpdateTeamScimRequireUserDirectorySettingRequest,
      O: UpdateTeamScimRequireUserDirectorySettingResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.GetTeamScimRequireUserDirectoryPreview
     */
    getTeamScimRequireUserDirectoryPreview: {
      name: "GetTeamScimRequireUserDirectoryPreview",
      I: GetTeamScimRequireUserDirectoryPreviewRequest,
      O: GetTeamScimRequireUserDirectoryPreviewResponse,
      kind: MethodKind.Unary
    },
    /**
     * Per-user agent-store skills settings: whether a user's skills live in
     * their Agent Store rather than in `~/.cursor/skills` on each machine. The
     * team ceiling for the same feature is
     * `user_agent_store_skills_sync_settings` on the team admin settings above.
     *
     * @generated from rpc aiserver.v1.DashboardService.GetEffectiveUserAgentStoreSkillsSettings
     */
    getEffectiveUserAgentStoreSkillsSettings: {
      name: "GetEffectiveUserAgentStoreSkillsSettings",
      I: GetEffectiveUserAgentStoreSkillsSettingsRequest,
      O: GetEffectiveUserAgentStoreSkillsSettingsResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.UpdateUserAgentStoreSkillsSettings
     */
    updateUserAgentStoreSkillsSettings: {
      name: "UpdateUserAgentStoreSkillsSettings",
      I: UpdateUserAgentStoreSkillsSettingsRequest,
      O: UpdateUserAgentStoreSkillsSettingsResponse,
      kind: MethodKind.Unary
    },
    /**
     * Slack User Settings Messages
     *
     * @generated from rpc aiserver.v1.DashboardService.GetSlackUserSettings
     */
    getSlackUserSettings: {
      name: "GetSlackUserSettings",
      I: GetSlackUserSettingsRequest,
      O: GetSlackUserSettingsResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.UpdateSlackUserSettings
     */
    updateSlackUserSettings: {
      name: "UpdateSlackUserSettings",
      I: UpdateSlackUserSettingsRequest,
      O: UpdateSlackUserSettingsResponse,
      kind: MethodKind.Unary
    },
    /**
     * Slack repo routing rules (used for repo picking in Slack)
     *
     * @generated from rpc aiserver.v1.DashboardService.GetSlackRepoRoutingRules
     */
    getSlackRepoRoutingRules: {
      name: "GetSlackRepoRoutingRules",
      I: GetSlackRepoRoutingRulesRequest,
      O: GetSlackRepoRoutingRulesResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.CreateSlackRepoRoutingRule
     */
    createSlackRepoRoutingRule: {
      name: "CreateSlackRepoRoutingRule",
      I: CreateSlackRepoRoutingRuleRequest,
      O: CreateSlackRepoRoutingRuleResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.UpdateSlackRepoRoutingRule
     */
    updateSlackRepoRoutingRule: {
      name: "UpdateSlackRepoRoutingRule",
      I: UpdateSlackRepoRoutingRuleRequest,
      O: UpdateSlackRepoRoutingRuleResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.DeleteSlackRepoRoutingRule
     */
    deleteSlackRepoRoutingRule: {
      name: "DeleteSlackRepoRoutingRule",
      I: DeleteSlackRepoRoutingRuleRequest,
      O: DeleteSlackRepoRoutingRuleResponse,
      kind: MethodKind.Unary
    },
    /**
     * Per-user Slack default-worker rules (repo -> My Machines worker name)
     *
     * @generated from rpc aiserver.v1.DashboardService.GetSlackDefaultWorkerRules
     */
    getSlackDefaultWorkerRules: {
      name: "GetSlackDefaultWorkerRules",
      I: GetSlackDefaultWorkerRulesRequest,
      O: GetSlackDefaultWorkerRulesResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.SetSlackDefaultWorkerRule
     */
    setSlackDefaultWorkerRule: {
      name: "SetSlackDefaultWorkerRule",
      I: SetSlackDefaultWorkerRuleRequest,
      O: SetSlackDefaultWorkerRuleResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.DeleteSlackDefaultWorkerRule
     */
    deleteSlackDefaultWorkerRule: {
      name: "DeleteSlackDefaultWorkerRule",
      I: DeleteSlackDefaultWorkerRuleRequest,
      O: DeleteSlackDefaultWorkerRuleResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.IsOnNewPricing
     */
    isOnNewPricing: {
      name: "IsOnNewPricing",
      I: IsOnNewPricingRequest,
      O: IsOnNewPricingResponse,
      kind: MethodKind.Unary
    },
    /**
     * Linear service methods
     *
     * @generated from rpc aiserver.v1.DashboardService.GetLinearAuthUrl
     */
    getLinearAuthUrl: {
      name: "GetLinearAuthUrl",
      I: GetLinearAuthUrlRequest,
      O: GetLinearAuthUrlResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.ConnectLinearCallback
     */
    connectLinearCallback: {
      name: "ConnectLinearCallback",
      I: ConnectLinearCallbackRequest,
      O: ConnectLinearCallbackResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.GetMicrosoftTeamsLinkContext
     */
    getMicrosoftTeamsLinkContext: {
      name: "GetMicrosoftTeamsLinkContext",
      I: GetMicrosoftTeamsLinkContextRequest,
      O: GetMicrosoftTeamsLinkContextResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.SetMicrosoftTeamsAuth
     */
    setMicrosoftTeamsAuth: {
      name: "SetMicrosoftTeamsAuth",
      I: SetMicrosoftTeamsAuthRequest,
      O: SetMicrosoftTeamsAuthResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.GetLinearStatus
     */
    getLinearStatus: {
      name: "GetLinearStatus",
      I: GetLinearStatusRequest,
      O: GetLinearStatusResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.DisconnectLinear
     */
    disconnectLinear: {
      name: "DisconnectLinear",
      I: DisconnectLinearRequest,
      O: DisconnectLinearResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.GetLinearTeams
     */
    getLinearTeams: {
      name: "GetLinearTeams",
      I: GetLinearTeamsRequest,
      O: GetLinearTeamsResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.GetLinearSettings
     */
    getLinearSettings: {
      name: "GetLinearSettings",
      I: GetLinearSettingsRequest,
      O: GetLinearSettingsResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.UpdateLinearTeamSetting
     */
    updateLinearTeamSetting: {
      name: "UpdateLinearTeamSetting",
      I: UpdateLinearTeamSettingRequest,
      O: UpdateLinearTeamSettingResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.UpdateLinearProjectSetting
     */
    updateLinearProjectSetting: {
      name: "UpdateLinearProjectSetting",
      I: UpdateLinearProjectSettingRequest,
      O: UpdateLinearProjectSettingResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.GetLinearLabels
     */
    getLinearLabels: {
      name: "GetLinearLabels",
      I: GetLinearLabelsRequest,
      O: GetLinearLabelsResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.GetLinearIssues
     */
    getLinearIssues: {
      name: "GetLinearIssues",
      I: GetLinearIssuesRequest,
      O: GetLinearIssuesResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.BatchGetLinearIssueSummaries
     */
    batchGetLinearIssueSummaries: {
      name: "BatchGetLinearIssueSummaries",
      I: BatchGetLinearIssueSummariesRequest,
      O: BatchGetLinearIssueSummariesResponse,
      kind: MethodKind.Unary
    },
    /**
     * xAI team link methods: Cursor org (team) <-> xAI team billing link used
     * for partner credit transfers. These link lifecycle methods are gated by
     * the `xai_team_link` feature flag.
     *
     * @generated from rpc aiserver.v1.DashboardService.GetXaiTeamLinkStatus
     */
    getXaiTeamLinkStatus: {
      name: "GetXaiTeamLinkStatus",
      I: GetXaiTeamLinkStatusRequest,
      O: GetXaiTeamLinkStatusResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.StartXaiTeamLink
     */
    startXaiTeamLink: {
      name: "StartXaiTeamLink",
      I: StartXaiTeamLinkRequest,
      O: StartXaiTeamLinkResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.ConfirmXaiTeamLink
     */
    confirmXaiTeamLink: {
      name: "ConfirmXaiTeamLink",
      I: ConfirmXaiTeamLinkRequest,
      O: ConfirmXaiTeamLinkResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.CancelXaiTeamLinkProposal
     */
    cancelXaiTeamLinkProposal: {
      name: "CancelXaiTeamLinkProposal",
      I: CancelXaiTeamLinkProposalRequest,
      O: CancelXaiTeamLinkProposalResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.UnlinkXaiTeam
     */
    unlinkXaiTeam: {
      name: "UnlinkXaiTeam",
      I: UnlinkXaiTeamRequest,
      O: UnlinkXaiTeamResponse,
      kind: MethodKind.Unary
    },
    /**
     * Cursor team <-> xAI team tenancy merge. These are intentionally distinct
     * from the organization-grained billing-link RPCs above and are gated by
     * the default-off `auth_unification` feature flag.
     *
     * @generated from rpc aiserver.v1.DashboardService.GetXaiCursorTeamMergeStatus
     */
    getXaiCursorTeamMergeStatus: {
      name: "GetXaiCursorTeamMergeStatus",
      I: GetXaiCursorTeamMergeStatusRequest,
      O: GetXaiCursorTeamMergeStatusResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.GetXaiCursorTeamMembershipPreview
     */
    getXaiCursorTeamMembershipPreview: {
      name: "GetXaiCursorTeamMembershipPreview",
      I: GetXaiCursorTeamMembershipPreviewRequest,
      O: GetXaiCursorTeamMembershipPreviewResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.StartXaiCursorTeamMerge
     */
    startXaiCursorTeamMerge: {
      name: "StartXaiCursorTeamMerge",
      I: StartXaiCursorTeamMergeRequest,
      O: StartXaiCursorTeamMergeResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.ConfirmXaiCursorTeamMerge
     */
    confirmXaiCursorTeamMerge: {
      name: "ConfirmXaiCursorTeamMerge",
      I: ConfirmXaiCursorTeamMergeRequest,
      O: ConfirmXaiCursorTeamMergeResponse,
      kind: MethodKind.Unary
    },
    /**
     * Pay-first team Unify: freezes the seat picks into an authoritative cart
     * and moves the TEAM intent to AWAITING_PAYMENT before the browser checkout.
     *
     * @generated from rpc aiserver.v1.DashboardService.PrepareXaiCursorTeamMergeCheckout
     */
    prepareXaiCursorTeamMergeCheckout: {
      name: "PrepareXaiCursorTeamMergeCheckout",
      I: PrepareXaiCursorTeamMergeCheckoutRequest,
      O: PrepareXaiCursorTeamMergeCheckoutResponse,
      kind: MethodKind.Unary
    },
    /**
     * Server-verifies the ComPlat purchase and advances the TEAM intent out of
     * AWAITING_PAYMENT. The durable team mapping is written only after this.
     *
     * @generated from rpc aiserver.v1.DashboardService.FinalizeXaiCursorTeamMergeCheckout
     */
    finalizeXaiCursorTeamMergeCheckout: {
      name: "FinalizeXaiCursorTeamMergeCheckout",
      I: FinalizeXaiCursorTeamMergeCheckoutRequest,
      O: FinalizeXaiCursorTeamMergeCheckoutResponse,
      kind: MethodKind.Unary
    },
    /**
     * Cursor-only team: creates (or returns) the xAI team mirroring this Cursor
     * team through xAI's partner ensure-team RPC, owned by the paying admin's
     * xAI user, and records it as the intent's intended xAI team before
     * checkout. Never writes the live team mapping.
     *
     * @generated from rpc aiserver.v1.DashboardService.EnsureXaiCursorTeamForMerge
     */
    ensureXaiCursorTeamForMerge: {
      name: "EnsureXaiCursorTeamForMerge",
      I: EnsureXaiCursorTeamForMergeRequest,
      O: EnsureXaiCursorTeamForMergeResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.CancelXaiCursorTeamMergeProposal
     */
    cancelXaiCursorTeamMergeProposal: {
      name: "CancelXaiCursorTeamMergeProposal",
      I: CancelXaiCursorTeamMergeProposalRequest,
      O: CancelXaiCursorTeamMergeProposalResponse,
      kind: MethodKind.Unary
    },
    /**
     * Pushes credits from the Cursor team's pool to the linked xAI team.
     * Requires an active link; safe no-op ("not configured") until the xAI
     * transfer endpoint + partner signing secret are provisioned.
     *
     * @generated from rpc aiserver.v1.DashboardService.TransferXaiCredits
     */
    transferXaiCredits: {
      name: "TransferXaiCredits",
      I: TransferXaiCreditsRequest,
      O: TransferXaiCreditsResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.GetXaiCreditTransferStatus
     */
    getXaiCreditTransferStatus: {
      name: "GetXaiCreditTransferStatus",
      I: GetXaiCreditTransferStatusRequest,
      O: TransferXaiCreditsResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.ListXaiCreditTransfers
     */
    listXaiCreditTransfers: {
      name: "ListXaiCreditTransfers",
      I: ListXaiCreditTransfersRequest,
      O: ListXaiCreditTransfersResponse,
      kind: MethodKind.Unary
    },
    /**
     * PagerDuty integration methods
     *
     * @generated from rpc aiserver.v1.DashboardService.GetPagerDutyAuthUrl
     */
    getPagerDutyAuthUrl: {
      name: "GetPagerDutyAuthUrl",
      I: GetPagerDutyAuthUrlRequest,
      O: GetPagerDutyAuthUrlResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.ConnectPagerDutyCallback
     */
    connectPagerDutyCallback: {
      name: "ConnectPagerDutyCallback",
      I: ConnectPagerDutyCallbackRequest,
      O: ConnectPagerDutyCallbackResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.GetPagerDutyStatus
     */
    getPagerDutyStatus: {
      name: "GetPagerDutyStatus",
      I: GetPagerDutyStatusRequest,
      O: GetPagerDutyStatusResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.GetPagerDutyServices
     */
    getPagerDutyServices: {
      name: "GetPagerDutyServices",
      I: GetPagerDutyServicesRequest,
      O: GetPagerDutyServicesResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.DisconnectPagerDuty
     */
    disconnectPagerDuty: {
      name: "DisconnectPagerDuty",
      I: DisconnectPagerDutyRequest,
      O: DisconnectPagerDutyResponse,
      kind: MethodKind.Unary
    },
    /**
     * Jira integration methods
     *
     * @generated from rpc aiserver.v1.DashboardService.GetJiraInstallUrl
     */
    getJiraInstallUrl: {
      name: "GetJiraInstallUrl",
      I: GetJiraInstallUrlRequest,
      O: GetJiraInstallUrlResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.LinkJiraInstallation
     */
    linkJiraInstallation: {
      name: "LinkJiraInstallation",
      I: LinkJiraInstallationRequest,
      O: LinkJiraInstallationResponse,
      kind: MethodKind.Unary
    },
    /**
     * Deprecated: use ListJiraInstallations. Collapses a multi-site team's
     * connection to the first installation by connectedAt.
     *
     * @generated from rpc aiserver.v1.DashboardService.GetJiraStatus
     * @deprecated
     */
    getJiraStatus: {
      name: "GetJiraStatus",
      I: GetJiraStatusRequest,
      O: GetJiraStatusResponse,
      kind: MethodKind.Unary
    },
    /**
     * ListJiraInstallations returns every live Jira installation linked to a
     * team. Replaces the singular GetJiraStatus on multi-site-flagged teams;
     * GetJiraStatus continues to work and returns the first installation for
     * backcompat.
     *
     * @generated from rpc aiserver.v1.DashboardService.ListJiraInstallations
     */
    listJiraInstallations: {
      name: "ListJiraInstallations",
      I: ListJiraInstallationsRequest,
      O: ListJiraInstallationsResponse,
      kind: MethodKind.Unary
    },
    /**
     * Bitbucket Forge app installation status for a team (the workspace-level
     * Cursor app, distinct from the per-user Bitbucket OAuth connection
     * reported by GetScmConnectionStatus).
     *
     * @generated from rpc aiserver.v1.DashboardService.GetBitbucketForgeStatus
     */
    getBitbucketForgeStatus: {
      name: "GetBitbucketForgeStatus",
      I: GetBitbucketForgeStatusRequest,
      O: GetBitbucketForgeStatusResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.DisconnectJira
     */
    disconnectJira: {
      name: "DisconnectJira",
      I: DisconnectJiraRequest,
      O: DisconnectJiraResponse,
      kind: MethodKind.Unary
    },
    /**
     * Deletes the team's Bitbucket Forge installation linkage (the mirror of
     * DisconnectJira for the Bitbucket Cursor app). Does not uninstall the
     * Forge app from the Bitbucket workspace; a workspace admin does that in
     * Bitbucket, which triggers the pre-uninstall webhook cleanup instead.
     *
     * @generated from rpc aiserver.v1.DashboardService.DisconnectBitbucketForge
     */
    disconnectBitbucketForge: {
      name: "DisconnectBitbucketForge",
      I: DisconnectBitbucketForgeRequest,
      O: DisconnectBitbucketForgeResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.GetJiraProjects
     */
    getJiraProjects: {
      name: "GetJiraProjects",
      I: GetJiraProjectsRequest,
      O: GetJiraProjectsResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.GetJiraTeamSettings
     */
    getJiraTeamSettings: {
      name: "GetJiraTeamSettings",
      I: GetJiraTeamSettingsRequest,
      O: GetJiraTeamSettingsResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.UpdateJiraTeamSettings
     */
    updateJiraTeamSettings: {
      name: "UpdateJiraTeamSettings",
      I: UpdateJiraTeamSettingsRequest,
      O: UpdateJiraTeamSettingsResponse,
      kind: MethodKind.Unary
    },
    /**
     * Deprecated: Jira-specific routing rules are no longer used. Server stubs
     * throw `FailedPrecondition` so old clients still calling these RPCs get a
     * graceful application-level error instead of transport-level Unimplemented.
     *
     * @generated from rpc aiserver.v1.DashboardService.GetJiraRoutingRules
     */
    getJiraRoutingRules: {
      name: "GetJiraRoutingRules",
      I: GetJiraRoutingRulesRequest,
      O: GetJiraRoutingRulesResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.CreateJiraRoutingRule
     */
    createJiraRoutingRule: {
      name: "CreateJiraRoutingRule",
      I: CreateJiraRoutingRuleRequest,
      O: CreateJiraRoutingRuleResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.UpdateJiraRoutingRule
     */
    updateJiraRoutingRule: {
      name: "UpdateJiraRoutingRule",
      I: UpdateJiraRoutingRuleRequest,
      O: UpdateJiraRoutingRuleResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.DeleteJiraRoutingRule
     */
    deleteJiraRoutingRule: {
      name: "DeleteJiraRoutingRule",
      I: DeleteJiraRoutingRuleRequest,
      O: DeleteJiraRoutingRuleResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.LinkJiraUser
     */
    linkJiraUser: {
      name: "LinkJiraUser",
      I: LinkJiraUserRequest,
      O: LinkJiraUserResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.ListJiraUserLinks
     */
    listJiraUserLinks: {
      name: "ListJiraUserLinks",
      I: ListJiraUserLinksRequest,
      O: ListJiraUserLinksResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.UnlinkJiraUser
     */
    unlinkJiraUser: {
      name: "UnlinkJiraUser",
      I: UnlinkJiraUserRequest,
      O: UnlinkJiraUserResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.DeleteBedrockIamRole
     */
    deleteBedrockIamRole: {
      name: "DeleteBedrockIamRole",
      I: DeleteBedrockIamRoleRequest,
      O: DeleteBedrockIamRoleResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.UnlinkSlackAccess
     */
    unlinkSlackAccess: {
      name: "UnlinkSlackAccess",
      I: UnlinkSlackAccessRequest,
      O: UnlinkSlackAccessResponse,
      kind: MethodKind.Unary
    },
    /**
     * List Slack conversations (channels and DMs) for the current user's connected Slack workspace
     *
     * @generated from rpc aiserver.v1.DashboardService.ListSlackConversations
     */
    listSlackConversations: {
      name: "ListSlackConversations",
      I: ListSlackConversationsRequest,
      O: ListSlackConversationsResponse,
      kind: MethodKind.Unary
    },
    /**
     * List Microsoft Teams channels available to the current user's connected Teams account
     *
     * @generated from rpc aiserver.v1.DashboardService.ListMicrosoftTeamsChannels
     */
    listMicrosoftTeamsChannels: {
      name: "ListMicrosoftTeamsChannels",
      I: ListMicrosoftTeamsChannelsRequest,
      O: ListMicrosoftTeamsChannelsResponse,
      kind: MethodKind.Unary
    },
    /**
     * Resolve specific Slack conversations by ID for the current user's connected Slack workspace
     *
     * @generated from rpc aiserver.v1.DashboardService.GetSlackConversationsByIds
     */
    getSlackConversationsByIds: {
      name: "GetSlackConversationsByIds",
      I: GetSlackConversationsByIdsRequest,
      O: GetSlackConversationsByIdsResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.LogSlackbotAuthConversionFunnel
     */
    logSlackbotAuthConversionFunnel: {
      name: "LogSlackbotAuthConversionFunnel",
      I: LogSlackbotAuthConversionFunnelRequest,
      O: LogSlackbotAuthConversionFunnelResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.LogClickedConnectSlack
     */
    logClickedConnectSlack: {
      name: "LogClickedConnectSlack",
      I: LogClickedConnectSlackRequest,
      O: LogClickedConnectSlackResponse,
      kind: MethodKind.Unary
    },
    /**
     * Check if the current user has access to user API keys
     *
     * @generated from rpc aiserver.v1.DashboardService.CheckUserApiKeyAccess
     */
    checkUserApiKeyAccess: {
      name: "CheckUserApiKeyAccess",
      I: CheckUserApiKeyAccessRequest,
      O: CheckUserApiKeyAccessResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.IsAllowedFreeTrialUsage
     */
    isAllowedFreeTrialUsage: {
      name: "IsAllowedFreeTrialUsage",
      I: IsAllowedFreeTrialUsageRequest,
      O: IsAllowedFreeTrialUsageResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.IsNextSetupRunFree
     */
    isNextSetupRunFree: {
      name: "IsNextSetupRunFree",
      I: IsNextSetupRunFreeRequest,
      O: IsNextSetupRunFreeResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.CompletedLinkSlackAccount
     */
    completedLinkSlackAccount: {
      name: "CompletedLinkSlackAccount",
      I: CompletedLinkSlackAccountRequest,
      O: CompletedLinkSlackAccountResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.NotifyBugbotTeamAdmins
     */
    notifyBugbotTeamAdmins: {
      name: "NotifyBugbotTeamAdmins",
      I: NotifyTeamAdminsRequest,
      O: NotifyTeamAdminsResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.GetAdminNotificationStatus
     */
    getAdminNotificationStatus: {
      name: "GetAdminNotificationStatus",
      I: GetAdminNotificationStatusRequest,
      O: GetAdminNotificationStatusResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.OptOutNewPricing
     */
    optOutNewPricing: {
      name: "OptOutNewPricing",
      I: OptOutNewPricingRequest,
      O: OptOutNewPricingResponse,
      kind: MethodKind.Unary
    },
    /**
     * Submit user feedback from the CLI. This is user-initiated and allowed in ghost mode.
     *
     * @generated from rpc aiserver.v1.DashboardService.SubmitFeedback
     */
    submitFeedback: {
      name: "SubmitFeedback",
      I: SubmitFeedbackRequest,
      O: SubmitFeedbackResponse,
      kind: MethodKind.Unary
    },
    /**
     * Submit user feedback from the authless CLI (agent-cli-local in authless
     * mode). Unlike SubmitFeedback, this requires no authentication and is
     * recorded as an anonymous user. It is user-initiated, so it is allowed even
     * when the client otherwise avoids contacting Cursor.
     *
     * @generated from rpc aiserver.v1.DashboardService.SubmitFeedbackAnon
     */
    submitFeedbackAnon: {
      name: "SubmitFeedbackAnon",
      I: SubmitFeedbackRequest,
      O: SubmitFeedbackResponse,
      kind: MethodKind.Unary
    },
    /**
     * Token-gated repository-protection claim. No Cursor account. The token is
     * the credential; the form must not write live CodebaseProtection rows.
     *
     * @generated from rpc aiserver.v1.DashboardService.SubmitRepositoryProtectionClaim
     */
    submitRepositoryProtectionClaim: {
      name: "SubmitRepositoryProtectionClaim",
      I: SubmitRepositoryProtectionClaimRequest,
      O: SubmitRepositoryProtectionClaimResponse,
      kind: MethodKind.Unary
    },
    /**
     * Anytool Activate. Internal service + acting employee. Writes hashed
     * MANUAL PRIVATE CodebaseProtection rows; submit must not.
     *
     * @generated from rpc aiserver.v1.DashboardService.ActivateRepositoryProtectionInvite
     */
    activateRepositoryProtectionInvite: {
      name: "ActivateRepositoryProtectionInvite",
      I: ActivateRepositoryProtectionInviteRequest,
      O: ActivateRepositoryProtectionInviteResponse,
      kind: MethodKind.Unary
    },
    /**
     * Get active offboarding banner for the current team
     *
     * @generated from rpc aiserver.v1.DashboardService.GetActiveOffboardingBanner
     */
    getActiveOffboardingBanner: {
      name: "GetActiveOffboardingBanner",
      I: GetActiveOffboardingBannerRequest,
      O: GetActiveOffboardingBannerResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.ClientAction
     */
    clientAction: {
      name: "ClientAction",
      I: ClientActionRequest,
      O: ClientActionResponse,
      kind: MethodKind.Unary
    },
    /**
     * Usage Alerts endpoints
     *
     * @generated from rpc aiserver.v1.DashboardService.ListUsageAlerts
     */
    listUsageAlerts: {
      name: "ListUsageAlerts",
      I: ListUsageAlertsRequest,
      O: ListUsageAlertsResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.CreateUsageAlerts
     */
    createUsageAlerts: {
      name: "CreateUsageAlerts",
      I: CreateUsageAlertsRequest,
      O: CreateUsageAlertsResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.DeleteUsageAlerts
     */
    deleteUsageAlerts: {
      name: "DeleteUsageAlerts",
      I: DeleteUsageAlertsRequest,
      O: DeleteUsageAlertsResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.UpdateUsageAlerts
     */
    updateUsageAlerts: {
      name: "UpdateUsageAlerts",
      I: UpdateUsageAlertsRequest,
      O: UpdateUsageAlertsResponse,
      kind: MethodKind.Unary
    },
    /**
     * Request individual spend limits opt-out for teams where user is admin
     *
     * @generated from rpc aiserver.v1.DashboardService.RequestIndividualLimitsOptOut
     */
    requestIndividualLimitsOptOut: {
      name: "RequestIndividualLimitsOptOut",
      I: RequestIndividualLimitsOptOutRequest,
      O: RequestIndividualLimitsOptOutResponse,
      kind: MethodKind.Unary
    },
    /**
     * Public marketplace endpoints (unauthenticated access allowed for public plugins)
     *
     * @generated from rpc aiserver.v1.DashboardService.ListMarketplacePlugins
     */
    listMarketplacePlugins: {
      name: "ListMarketplacePlugins",
      I: ListMarketplacePluginsRequest,
      O: ListMarketplacePluginsResponse,
      kind: MethodKind.Unary
    },
    /**
     * One publisher's publicly listed plugins for the Origin app marketplace
     * page. Signed-in callers only; never returns drafts, unlisted, deprecated,
     * or team-private plugins. Unknown publisher → empty list.
     *
     * @generated from rpc aiserver.v1.DashboardService.ListPublisherPublicPlugins
     */
    listPublisherPublicPlugins: {
      name: "ListPublisherPublicPlugins",
      I: ListPublisherPublicPluginsRequest,
      O: ListPublisherPublicPluginsResponse,
      kind: MethodKind.Unary
    },
    /**
     * Public user profile (handle, links, visibility) for cursor.com/profile and marketplace identity
     *
     * @generated from rpc aiserver.v1.DashboardService.GetUserProfile
     */
    getUserProfile: {
      name: "GetUserProfile",
      I: GetUserProfileRequest,
      O: GetUserProfileResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.UpdateUserProfile
     */
    updateUserProfile: {
      name: "UpdateUserProfile",
      I: UpdateUserProfileRequest,
      O: UpdateUserProfileResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.ClaimUserProfileHandle
     */
    claimUserProfileHandle: {
      name: "ClaimUserProfileHandle",
      I: ClaimUserProfileHandleRequest,
      O: ClaimUserProfileHandleResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.GetPublicProfileByHandle
     */
    getPublicProfileByHandle: {
      name: "GetPublicProfileByHandle",
      I: GetPublicProfileByHandleRequest,
      O: GetPublicProfileByHandleResponse,
      kind: MethodKind.Unary
    },
    /**
     * Render-path lookup for /@handle. Keeps the public-only cached lookup as the
     * first tier, then falls back to authenticated viewer-aware access for owner /
     * teammate-visible TEAM profiles. Do not use for metadata, OG images, or
     * other public-only surfaces.
     *
     * @generated from rpc aiserver.v1.DashboardService.GetViewableProfileByHandle
     */
    getViewableProfileByHandle: {
      name: "GetViewableProfileByHandle",
      I: GetViewableProfileByHandleRequest,
      O: GetViewableProfileByHandleResponse,
      kind: MethodKind.Unary
    },
    /**
     * Authenticated lookup that additionally returns TEAM profiles when the
     * caller shares an active team with the profile owner. PRIVATE profiles (and
     * TEAM profiles of non-teammates) return NotFound. Used by the portal as a
     * fallback when the unauthenticated GetPublicProfileByHandle returns NotFound.
     *
     * @generated from rpc aiserver.v1.DashboardService.GetTeamMemberProfileByHandle
     */
    getTeamMemberProfileByHandle: {
      name: "GetTeamMemberProfileByHandle",
      I: GetTeamMemberProfileByHandleRequest,
      O: GetTeamMemberProfileByHandleResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.GetPlugin
     */
    getPlugin: {
      name: "GetPlugin",
      I: GetPluginRequest,
      O: GetPluginResponse,
      kind: MethodKind.Unary
    },
    /**
     * DB-inline plugin CRUD. Caller must specify the marketplace_id to create the plugin in.
     * TODO: introduce user personal marketplaces later, if we want, so callers can omit
     * marketplace_id and have the server auto-resolve the caller's personal marketplace.
     *
     * @generated from rpc aiserver.v1.DashboardService.CreatePlugin
     */
    createPlugin: {
      name: "CreatePlugin",
      I: CreatePluginRequest,
      O: CreatePluginResponse,
      kind: MethodKind.Unary
    },
    /**
     * Replace the MCP config of an existing DB-inline plugin. Team-admin
     * (ManageTeamPlugins) only. Repo-backed plugins are rejected: their config
     * comes from the source repo and is overwritten by the next reindex.
     *
     * @generated from rpc aiserver.v1.DashboardService.UpdatePluginMcpConfig
     */
    updatePluginMcpConfig: {
      name: "UpdatePluginMcpConfig",
      I: UpdatePluginMcpConfigRequest,
      O: UpdatePluginMcpConfigResponse,
      kind: MethodKind.Unary
    },
    /**
     * Publish a plugin into the team's Origin-native default marketplace. Thin
     * orchestrator: ensure the team's repo-less "__DEFAULT__" marketplace,
     * provision/commit the plugin file bytes (decoded from a gzipped tar) into
     * its Origin-native repo (marketplace.origin_repo_uuid; no GitHub
     * upstream/mirror), create the plugin row owned by that marketplace (git_url
     * null), set an OPTIONAL team install policy, and install it for the
     * publishing user. Team-admin (ManageTeamPlugins) only.
     *
     * @generated from rpc aiserver.v1.DashboardService.PublishPlugin
     */
    publishPlugin: {
      name: "PublishPlugin",
      I: PublishPluginRequest,
      O: PublishPluginResponse,
      kind: MethodKind.Unary
    },
    /**
     * Remove a previously published plugin from the team's Origin-native default
     * marketplace. Inverse of PublishPlugin: hard-deletes the plugin row (and its
     * team install policy, install rows and MCP servers), then commits a deletion
     * of `plugins/<name>/` in the marketplace's Origin-native repo. The publisher
     * who owns the plugin may unpublish it; team admins (ManageTeamPlugins) may
     * unpublish any plugin in their marketplace.
     *
     * @generated from rpc aiserver.v1.DashboardService.UnpublishPlugin
     */
    unpublishPlugin: {
      name: "UnpublishPlugin",
      I: UnpublishPluginRequest,
      O: UnpublishPluginResponse,
      kind: MethodKind.Unary
    },
    /**
     * Parse a GitHub repository and return all plugins separately (multi-plugin support)
     *
     * @generated from rpc aiserver.v1.DashboardService.ParseGitHubRepoForPlugins
     */
    parseGitHubRepoForPlugins: {
      name: "ParseGitHubRepoForPlugins",
      I: ParseGitHubRepoForPluginRequest,
      O: ParseGitHubRepoForPluginsResponse,
      kind: MethodKind.Unary
    },
    /**
     * Parse a plugin publisher repository via backend-owned GitHub auth (internal operator flow only).
     *
     * @generated from rpc aiserver.v1.DashboardService.ParsePluginPublisherRepoInternal
     */
    parsePluginPublisherRepoInternal: {
      name: "ParsePluginPublisherRepoInternal",
      I: ParsePluginPublisherRepoInternalRequest,
      O: ParsePluginPublisherRepoInternalResponse,
      kind: MethodKind.Unary
    },
    /**
     * Reindex a previously imported plugin repository (internal operator flow only).
     *
     * @generated from rpc aiserver.v1.DashboardService.PreviewReindexPluginRepoInternal
     */
    previewReindexPluginRepoInternal: {
      name: "PreviewReindexPluginRepoInternal",
      I: PreviewReindexPluginRepoInternalRequest,
      O: PreviewReindexPluginRepoResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.ApplyReindexPluginRepoInternal
     */
    applyReindexPluginRepoInternal: {
      name: "ApplyReindexPluginRepoInternal",
      I: ApplyReindexPluginRepoInternalRequest,
      O: ApplyReindexPluginRepoResponse,
      kind: MethodKind.Unary
    },
    /**
     * Migrate plugins from one repo URL to another (parse target via same path as reindex; internal = anytool).
     *
     * @generated from rpc aiserver.v1.DashboardService.PreviewMigrateReindexPluginRepoInternal
     */
    previewMigrateReindexPluginRepoInternal: {
      name: "PreviewMigrateReindexPluginRepoInternal",
      I: PreviewMigrateReindexPluginRepoInternalRequest,
      O: PreviewMigrateReindexPluginRepoResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.ApplyMigrateReindexPluginRepoInternal
     */
    applyMigrateReindexPluginRepoInternal: {
      name: "ApplyMigrateReindexPluginRepoInternal",
      I: ApplyMigrateReindexPluginRepoInternalRequest,
      O: ApplyMigrateReindexPluginRepoResponse,
      kind: MethodKind.Unary
    },
    /**
     * Repair a default team marketplace's Origin distribution pair (internal operator flow only).
     *
     * @generated from rpc aiserver.v1.DashboardService.UpdateTeamMarketplaceOriginDistributionInternal
     */
    updateTeamMarketplaceOriginDistributionInternal: {
      name: "UpdateTeamMarketplaceOriginDistributionInternal",
      I: UpdateTeamMarketplaceOriginDistributionInternalRequest,
      O: UpdateTeamMarketplaceOriginDistributionInternalResponse,
      kind: MethodKind.Unary
    },
    /**
     * Internal-only (anytool, via internal-service + acting-employee auth): mint a
     * support-impersonation session for a target user without the WorkOS dashboard.
     * Returns a one-time redemption code (NOT the session token).
     *
     * @generated from rpc aiserver.v1.DashboardService.CreateSupportImpersonationSessionInternal
     */
    createSupportImpersonationSessionInternal: {
      name: "CreateSupportImpersonationSessionInternal",
      I: CreateSupportImpersonationSessionInternalRequest,
      O: CreateSupportImpersonationSessionInternalResponse,
      kind: MethodKind.Unary
    },
    /**
     * Internal-only (anytool, via internal-service + acting-employee auth):
     * remove a member while keeping the full backend organization lifecycle.
     *
     * @generated from rpc aiserver.v1.DashboardService.RemoveOrganizationMemberInternal
     */
    removeOrganizationMemberInternal: {
      name: "RemoveOrganizationMemberInternal",
      I: RemoveOrganizationMemberInternalRequest,
      O: RemoveOrganizationMemberInternalResponse,
      kind: MethodKind.Unary
    },
    /**
     * Plugin approval workflow (public plugins only)
     *
     * @generated from rpc aiserver.v1.DashboardService.SubmitPluginForApproval
     */
    submitPluginForApproval: {
      name: "SubmitPluginForApproval",
      I: SubmitPluginForApprovalRequest,
      O: SubmitPluginForApprovalResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.ApprovePlugin
     */
    approvePlugin: {
      name: "ApprovePlugin",
      I: ApprovePluginRequest,
      O: ApprovePluginResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.RejectPlugin
     */
    rejectPlugin: {
      name: "RejectPlugin",
      I: RejectPluginRequest,
      O: RejectPluginResponse,
      kind: MethodKind.Unary
    },
    /**
     * User plugin installations
     *
     * @generated from rpc aiserver.v1.DashboardService.ListUserPluginInstalls
     */
    listUserPluginInstalls: {
      name: "ListUserPluginInstalls",
      I: ListUserPluginInstallsRequest,
      O: ListUserPluginInstallsResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.InstallUserPlugin
     */
    installUserPlugin: {
      name: "InstallUserPlugin",
      I: InstallUserPluginRequest,
      O: InstallUserPluginResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.UpdateUserPluginInstall
     */
    updateUserPluginInstall: {
      name: "UpdateUserPluginInstall",
      I: UpdateUserPluginInstallRequest,
      O: UpdateUserPluginInstallResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.UninstallUserPlugin
     */
    uninstallUserPlugin: {
      name: "UninstallUserPlugin",
      I: UninstallUserPluginRequest,
      O: UninstallUserPluginResponse,
      kind: MethodKind.Unary
    },
    /**
     * Team plugin installations (admin can set isRequired)
     *
     * @generated from rpc aiserver.v1.DashboardService.ListTeamPluginInstalls
     */
    listTeamPluginInstalls: {
      name: "ListTeamPluginInstalls",
      I: ListTeamPluginInstallsRequest,
      O: ListTeamPluginInstallsResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.GetTeamPluginPopularity
     */
    getTeamPluginPopularity: {
      name: "GetTeamPluginPopularity",
      I: GetTeamPluginPopularityRequest,
      O: GetTeamPluginPopularityResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.GetTeamPluginPrimitiveUsage
     */
    getTeamPluginPrimitiveUsage: {
      name: "GetTeamPluginPrimitiveUsage",
      I: GetTeamPluginPrimitiveUsageRequest,
      O: GetTeamPluginPrimitiveUsageResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.ListTeamAvailableMarketplacePlugins
     */
    listTeamAvailableMarketplacePlugins: {
      name: "ListTeamAvailableMarketplacePlugins",
      I: ListTeamAvailableMarketplacePluginsRequest,
      O: ListTeamAvailableMarketplacePluginsResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.GetTeamPinnedMarketplacePlugins
     */
    getTeamPinnedMarketplacePlugins: {
      name: "GetTeamPinnedMarketplacePlugins",
      I: GetTeamPinnedMarketplacePluginsRequest,
      O: GetTeamPinnedMarketplacePluginsResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.UpdateTeamPinnedMarketplacePlugins
     */
    updateTeamPinnedMarketplacePlugins: {
      name: "UpdateTeamPinnedMarketplacePlugins",
      I: UpdateTeamPinnedMarketplacePluginsRequest,
      O: UpdateTeamPinnedMarketplacePluginsResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.InstallTeamPlugin
     */
    installTeamPlugin: {
      name: "InstallTeamPlugin",
      I: InstallTeamPluginRequest,
      O: InstallTeamPluginResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.UpdateTeamPluginInstall
     */
    updateTeamPluginInstall: {
      name: "UpdateTeamPluginInstall",
      I: UpdateTeamPluginInstallRequest,
      O: UpdateTeamPluginInstallResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.UninstallTeamPlugin
     */
    uninstallTeamPlugin: {
      name: "UninstallTeamPlugin",
      I: UninstallTeamPluginRequest,
      O: UninstallTeamPluginResponse,
      kind: MethodKind.Unary
    },
    /**
     * Get effective plugins for current user (user installs + team-required)
     *
     * @generated from rpc aiserver.v1.DashboardService.GetEffectiveUserPlugins
     */
    getEffectiveUserPlugins: {
      name: "GetEffectiveUserPlugins",
      I: GetEffectiveUserPluginsRequest,
      O: GetEffectiveUserPluginsResponse,
      kind: MethodKind.Unary
    },
    /**
     * Resolve plugins by name reference (for project-level plugin settings)
     *
     * @generated from rpc aiserver.v1.DashboardService.ResolvePluginsByRef
     */
    resolvePluginsByRef: {
      name: "ResolvePluginsByRef",
      I: ResolvePluginsByRefRequest,
      O: ResolvePluginsByRefResponse,
      kind: MethodKind.Unary
    },
    /**
     * Private marketplace management
     *
     * @generated from rpc aiserver.v1.DashboardService.ListMarketplaces
     */
    listMarketplaces: {
      name: "ListMarketplaces",
      I: ListMarketplacesRequest,
      O: ListMarketplacesResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.AddMarketplace
     */
    addMarketplace: {
      name: "AddMarketplace",
      I: AddMarketplaceRequest,
      O: AddMarketplaceResponse,
      kind: MethodKind.Unary
    },
    /**
     * Get the team's repo-less default marketplace, lazily creating it on
     * first call. Defaults are identified by is_default=true. Team-admin only.
     *
     * @generated from rpc aiserver.v1.DashboardService.GetOrCreateDefaultTeamMarketplace
     */
    getOrCreateDefaultTeamMarketplace: {
      name: "GetOrCreateDefaultTeamMarketplace",
      I: GetOrCreateDefaultTeamMarketplaceRequest,
      O: GetOrCreateDefaultTeamMarketplaceResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.UpdateMarketplace
     */
    updateMarketplace: {
      name: "UpdateMarketplace",
      I: UpdateMarketplaceRequest,
      O: UpdateMarketplaceResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.RemoveMarketplace
     */
    removeMarketplace: {
      name: "RemoveMarketplace",
      I: RemoveMarketplaceRequest,
      O: RemoveMarketplaceResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.RefreshMarketplace
     */
    refreshMarketplace: {
      name: "RefreshMarketplace",
      I: RefreshMarketplaceRequest,
      O: RefreshMarketplaceResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.ReindexAndApplyTeamMarketplaceChanges
     */
    reindexAndApplyTeamMarketplaceChanges: {
      name: "ReindexAndApplyTeamMarketplaceChanges",
      I: ReindexAndApplyTeamMarketplaceChangesRequest,
      O: ReindexAndApplyTeamMarketplaceChangesResponse,
      kind: MethodKind.Unary
    },
    /**
     * Client-side marketplace registration (client discovers plugins, sends metadata to backend)
     *
     * @generated from rpc aiserver.v1.DashboardService.RegisterMarketplaceAndPlugins
     */
    registerMarketplaceAndPlugins: {
      name: "RegisterMarketplaceAndPlugins",
      I: RegisterMarketplaceAndPluginsRequest,
      O: RegisterMarketplaceAndPluginsResponse,
      kind: MethodKind.Unary
    },
    /**
     * Team marketplace configuration (enterprise admin: SCIM scoping)
     *
     * @generated from rpc aiserver.v1.DashboardService.UpdateTeamMarketplaceConfig
     */
    updateTeamMarketplaceConfig: {
      name: "UpdateTeamMarketplaceConfig",
      I: UpdateTeamMarketplaceConfigRequest,
      O: UpdateTeamMarketplaceConfigResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.SetTeamMarketplaceRepository
     */
    setTeamMarketplaceRepository: {
      name: "SetTeamMarketplaceRepository",
      I: SetTeamMarketplaceRepositoryRequest,
      O: SetTeamMarketplaceRepositoryResponse,
      kind: MethodKind.Unary
    },
    /**
     * Enable/disable Origin-backed distribution for a team marketplace:
     * provisions a hidden Origin mirror of the marketplace repo and immediately
     * publishes distribution_git_url (mirror sync readiness is evaluated
     * lazily by consumers).
     *
     * @generated from rpc aiserver.v1.DashboardService.SetMarketplaceOriginDistribution
     */
    setMarketplaceOriginDistribution: {
      name: "SetMarketplaceOriginDistribution",
      I: SetMarketplaceOriginDistributionRequest,
      O: SetMarketplaceOriginDistributionResponse,
      kind: MethodKind.Unary
    },
    /**
     * Live sync status for the admin toggle: enabled from the marketplace row,
     * initial_sync_complete computed on demand from git-forge. No stored state.
     *
     * @generated from rpc aiserver.v1.DashboardService.GetMarketplaceOriginDistributionStatus
     */
    getMarketplaceOriginDistributionStatus: {
      name: "GetMarketplaceOriginDistributionStatus",
      I: GetMarketplaceOriginDistributionStatusRequest,
      O: GetMarketplaceOriginDistributionStatusResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.SetTeamMarketplacePluginPolicies
     */
    setTeamMarketplacePluginPolicies: {
      name: "SetTeamMarketplacePluginPolicies",
      I: SetTeamMarketplacePluginPoliciesRequest,
      O: SetTeamMarketplacePluginPoliciesResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.SetTeamMarketplacePluginPolicyVariables
     */
    setTeamMarketplacePluginPolicyVariables: {
      name: "SetTeamMarketplacePluginPolicyVariables",
      I: SetTeamMarketplacePluginPolicyVariablesRequest,
      O: SetTeamMarketplacePluginPolicyVariablesResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.ApplyTeamMarketplaceRequiredPlugins
     */
    applyTeamMarketplaceRequiredPlugins: {
      name: "ApplyTeamMarketplaceRequiredPlugins",
      I: ApplyTeamMarketplaceRequiredPluginsRequest,
      O: ApplyTeamMarketplaceRequiredPluginsResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.LinkPluginsToTeamMarketplace
     */
    linkPluginsToTeamMarketplace: {
      name: "LinkPluginsToTeamMarketplace",
      I: LinkPluginsToTeamMarketplaceRequest,
      O: LinkPluginsToTeamMarketplaceResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.UnlinkPluginsFromTeamMarketplace
     */
    unlinkPluginsFromTeamMarketplace: {
      name: "UnlinkPluginsFromTeamMarketplace",
      I: UnlinkPluginsFromTeamMarketplaceRequest,
      O: UnlinkPluginsFromTeamMarketplaceResponse,
      kind: MethodKind.Unary
    },
    /**
     * Read-only preview of which plugins' team MCP servers would be hard-deleted
     * by a policy save or a marketplace removal, so the client can warn before
     * proceeding. Mirrors the exact hard-delete computation used by the mutations.
     *
     * @generated from rpc aiserver.v1.DashboardService.PreviewTeamMarketplaceMcpImpact
     */
    previewTeamMarketplaceMcpImpact: {
      name: "PreviewTeamMarketplaceMcpImpact",
      I: PreviewTeamMarketplaceMcpImpactRequest,
      O: PreviewTeamMarketplaceMcpImpactResponse,
      kind: MethodKind.Unary
    },
    /**
     * Cursor-managed skills (built-in skills served from server)
     *
     * @generated from rpc aiserver.v1.DashboardService.GetManagedSkills
     */
    getManagedSkills: {
      name: "GetManagedSkills",
      I: GetManagedSkillsRequest,
      O: GetManagedSkillsResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.GetCursorUserState
     */
    getCursorUserState: {
      name: "GetCursorUserState",
      I: GetCursorUserStateRequest,
      O: GetCursorUserStateResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.SetJobData
     */
    setJobData: {
      name: "SetJobData",
      I: SetJobDataRequest,
      O: SetJobDataResponse,
      kind: MethodKind.Unary
    },
    /**
     * Linked bank / brokerage connections for the signed-in user. Proxies
     * ConnectorManager PartnerListFinancialConnections / PartnerListFinancialAccounts
     * (and PartnerDeleteFinancialConnection). User identity rides the partner JWT;
     * these RPCs are personal, not team-scoped.
     *
     * @generated from rpc aiserver.v1.DashboardService.ListFinancialConnections
     */
    listFinancialConnections: {
      name: "ListFinancialConnections",
      I: ListFinancialConnectionsRequest,
      O: ListFinancialConnectionsResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.ListFinancialAccounts
     */
    listFinancialAccounts: {
      name: "ListFinancialAccounts",
      I: ListFinancialAccountsRequest,
      O: ListFinancialAccountsResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.DashboardService.DeleteFinancialConnection
     */
    deleteFinancialConnection: {
      name: "DeleteFinancialConnection",
      I: DeleteFinancialConnectionRequest,
      O: DeleteFinancialConnectionResponse,
      kind: MethodKind.Unary
    },
    /**
     * Mints a Grok-hosted Plaid Link page for connecting another institution.
     * Grok holds the Plaid token; the page returns the browser to return_to.
     *
     * @generated from rpc aiserver.v1.DashboardService.StartFinancialLink
     */
    startFinancialLink: {
      name: "StartFinancialLink",
      I: StartFinancialLinkRequest,
      O: StartFinancialLinkResponse,
      kind: MethodKind.Unary
    }
  }
};


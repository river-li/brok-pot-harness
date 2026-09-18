init_esm();
var AutomationsService = {
  typeName: "aiserver.v1.AutomationsService",
  methods: {
    /**
     * @generated from rpc aiserver.v1.AutomationsService.CreateAutomation
     */
    createAutomation: {
      name: "CreateAutomation",
      I: CreateAutomationRequest,
      O: CreateAutomationResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.AutomationsService.ListAutomations
     */
    listAutomations: {
      name: "ListAutomations",
      I: ListAutomationsRequest,
      O: ListAutomationsResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.AutomationsService.GetAutomation
     */
    getAutomation: {
      name: "GetAutomation",
      I: GetAutomationRequest,
      O: GetAutomationResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.AutomationsService.UpdateAutomation
     */
    updateAutomation: {
      name: "UpdateAutomation",
      I: UpdateAutomationRequest,
      O: UpdateAutomationResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.AutomationsService.CreateSandAutomation
     */
    createSandAutomation: {
      name: "CreateSandAutomation",
      I: CreateAutomationRequest,
      O: CreateAutomationResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.AutomationsService.ListSandAutomations
     */
    listSandAutomations: {
      name: "ListSandAutomations",
      I: ListSandAutomationsRequest,
      O: ListAutomationsResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.AutomationsService.GetSandAutomation
     */
    getSandAutomation: {
      name: "GetSandAutomation",
      I: GetAutomationRequest,
      O: GetAutomationResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.AutomationsService.UpdateSandAutomation
     */
    updateSandAutomation: {
      name: "UpdateSandAutomation",
      I: UpdateAutomationRequest,
      O: UpdateAutomationResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.AutomationsService.DeleteSandAutomation
     */
    deleteSandAutomation: {
      name: "DeleteSandAutomation",
      I: DeleteAutomationRequest,
      O: DeleteAutomationResponse,
      kind: MethodKind.Unary
    },
    /**
     * Transfers ownership of a team automation to another team member. Team admin
     * only; used to re-home automations whose owner has left the team.
     *
     * @generated from rpc aiserver.v1.AutomationsService.ReassignAutomationOwner
     */
    reassignAutomationOwner: {
      name: "ReassignAutomationOwner",
      I: ReassignAutomationOwnerRequest,
      O: ReassignAutomationOwnerResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.AutomationsService.UpdateAutomationAuthoringMode
     */
    updateAutomationAuthoringMode: {
      name: "UpdateAutomationAuthoringMode",
      I: UpdateAutomationAuthoringModeRequest,
      O: UpdateAutomationAuthoringModeResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.AutomationsService.ValidateAutomationSpec
     */
    validateAutomationSpec: {
      name: "ValidateAutomationSpec",
      I: ValidateAutomationSpecRequest,
      O: ValidateAutomationSpecResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.AutomationsService.ApplyAutomationSpec
     */
    applyAutomationSpec: {
      name: "ApplyAutomationSpec",
      I: ApplyAutomationSpecRequest,
      O: ApplyAutomationSpecResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.AutomationsService.DeleteAutomation
     */
    deleteAutomation: {
      name: "DeleteAutomation",
      I: DeleteAutomationRequest,
      O: DeleteAutomationResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.AutomationsService.TestAutomation
     */
    testAutomation: {
      name: "TestAutomation",
      I: TestAutomationRequest,
      O: TestAutomationResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.AutomationsService.TestAutomationFilter
     */
    testAutomationFilter: {
      name: "TestAutomationFilter",
      I: TestAutomationFilterRequest,
      O: TestAutomationFilterResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.AutomationsService.ListAutomationRuns
     */
    listAutomationRuns: {
      name: "ListAutomationRuns",
      I: ListAutomationRunsRequest,
      O: ListAutomationRunsResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.AutomationsService.GetAutomationRun
     */
    getAutomationRun: {
      name: "GetAutomationRun",
      I: GetAutomationRunRequest,
      O: GetAutomationRunResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.AutomationsService.ListAllRuns
     */
    listAllRuns: {
      name: "ListAllRuns",
      I: ListAllRunsRequest,
      O: ListAllRunsResponse,
      kind: MethodKind.Unary
    },
    /**
     * AgentSDK v2 run history (agentsdk_automation_run rows) for one
     * automation; separate from the legacy run-list RPCs, which are unchanged.
     *
     * @generated from rpc aiserver.v1.AutomationsService.ListAgentSdkAutomationRuns
     */
    listAgentSdkAutomationRuns: {
      name: "ListAgentSdkAutomationRuns",
      I: ListAgentSdkAutomationRunsRequest,
      O: ListAgentSdkAutomationRunsResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.AutomationsService.GetRunSummary
     */
    getRunSummary: {
      name: "GetRunSummary",
      I: GetRunSummaryRequest,
      O: GetRunSummaryResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.AutomationsService.GetSecuritybotResolutionStats
     */
    getSecuritybotResolutionStats: {
      name: "GetSecuritybotResolutionStats",
      I: GetSecuritybotResolutionStatsRequest,
      O: GetSecuritybotResolutionStatsResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.AutomationsService.GetApprovalAgentAnalytics
     */
    getApprovalAgentAnalytics: {
      name: "GetApprovalAgentAnalytics",
      I: GetApprovalAgentAnalyticsRequest,
      O: GetApprovalAgentAnalyticsResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.AutomationsService.GetManagedAutomationTeamSettings
     */
    getManagedAutomationTeamSettings: {
      name: "GetManagedAutomationTeamSettings",
      I: GetManagedAutomationTeamSettingsRequest,
      O: GetManagedAutomationTeamSettingsResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.AutomationsService.UpdateManagedAutomationTeamSettings
     */
    updateManagedAutomationTeamSettings: {
      name: "UpdateManagedAutomationTeamSettings",
      I: UpdateManagedAutomationTeamSettingsRequest,
      O: UpdateManagedAutomationTeamSettingsResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.AutomationsService.GetChangeMonitorTeamSettings
     */
    getChangeMonitorTeamSettings: {
      name: "GetChangeMonitorTeamSettings",
      I: GetChangeMonitorTeamSettingsRequest,
      O: GetChangeMonitorTeamSettingsResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.AutomationsService.CancelAutomationRun
     */
    cancelAutomationRun: {
      name: "CancelAutomationRun",
      I: CancelAutomationRunRequest,
      O: CancelAutomationRunResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.AutomationsService.CancelAllAutomationRuns
     */
    cancelAllAutomationRuns: {
      name: "CancelAllAutomationRuns",
      I: CancelAllAutomationRunsRequest,
      O: CancelAllAutomationRunsResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.AutomationsService.RetryAutomationRun
     */
    retryAutomationRun: {
      name: "RetryAutomationRun",
      I: RetryAutomationRunRequest,
      O: RetryAutomationRunResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.AutomationsService.ListAutomationMemories
     */
    listAutomationMemories: {
      name: "ListAutomationMemories",
      I: ListAutomationMemoriesRequest,
      O: ListAutomationMemoriesResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.AutomationsService.GetAutomationMemory
     */
    getAutomationMemory: {
      name: "GetAutomationMemory",
      I: GetAutomationMemoryRequest,
      O: GetAutomationMemoryResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.AutomationsService.UpdateAutomationMemory
     */
    updateAutomationMemory: {
      name: "UpdateAutomationMemory",
      I: UpdateAutomationMemoryRequest,
      O: UpdateAutomationMemoryResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.AutomationsService.DeleteAutomationMemory
     */
    deleteAutomationMemory: {
      name: "DeleteAutomationMemory",
      I: DeleteAutomationMemoryRequest,
      O: DeleteAutomationMemoryResponse,
      kind: MethodKind.Unary
    },
    /**
     * Template RPCs
     *
     * @generated from rpc aiserver.v1.AutomationsService.ListWorkflowTemplates
     */
    listWorkflowTemplates: {
      name: "ListWorkflowTemplates",
      I: ListWorkflowTemplatesRequest,
      O: ListWorkflowTemplatesResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.AutomationsService.GetWorkflowTemplate
     */
    getWorkflowTemplate: {
      name: "GetWorkflowTemplate",
      I: GetWorkflowTemplateRequest,
      O: GetWorkflowTemplateResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.AutomationsService.CreateWorkflowFromTemplate
     */
    createWorkflowFromTemplate: {
      name: "CreateWorkflowFromTemplate",
      I: CreateWorkflowFromTemplateRequest,
      O: CreateWorkflowFromTemplateResponse,
      kind: MethodKind.Unary
    },
    /**
     * Prompt tool validation
     *
     * @generated from rpc aiserver.v1.AutomationsService.ValidateAutomationTools
     */
    validateAutomationTools: {
      name: "ValidateAutomationTools",
      I: ValidateAutomationToolsRequest,
      O: ValidateAutomationToolsResponse,
      kind: MethodKind.Unary
    },
    /**
     * AI-assisted builder: given conversation messages + context, returns
     * structured automation configuration blocks.
     *
     * @generated from rpc aiserver.v1.AutomationsService.BuilderCompletion
     */
    builderCompletion: {
      name: "BuilderCompletion",
      I: BuilderCompletionRequest,
      O: BuilderCompletionResponse,
      kind: MethodKind.Unary
    },
    /**
     * Disables an automation when team-level automations are turned off. Team admin only;
     * bypasses the "team automations enabled" gate used by UpdateAutomation.
     *
     * @generated from rpc aiserver.v1.AutomationsService.DisableAutomationForTeamShutdown
     */
    disableAutomationForTeamShutdown: {
      name: "DisableAutomationForTeamShutdown",
      I: DisableAutomationForTeamShutdownRequest,
      O: DisableAutomationForTeamShutdownResponse,
      kind: MethodKind.Unary
    },
    /**
     * Sentry Integration Platform (public app install + OAuth token exchange)
     *
     * @generated from rpc aiserver.v1.AutomationsService.GetSentryAuthUrl
     */
    getSentryAuthUrl: {
      name: "GetSentryAuthUrl",
      I: GetSentryAuthUrlRequest,
      O: GetSentryAuthUrlResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.AutomationsService.ConnectSentryCallback
     */
    connectSentryCallback: {
      name: "ConnectSentryCallback",
      I: ConnectSentryCallbackRequest,
      O: ConnectSentryCallbackResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.AutomationsService.GetSentryStatus
     */
    getSentryStatus: {
      name: "GetSentryStatus",
      I: GetSentryStatusRequest,
      O: GetSentryStatusResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.AutomationsService.GetSentryProjects
     */
    getSentryProjects: {
      name: "GetSentryProjects",
      I: GetSentryProjectsRequest,
      O: GetSentryProjectsResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.AutomationsService.DisconnectSentry
     */
    disconnectSentry: {
      name: "DisconnectSentry",
      I: DisconnectSentryRequest,
      O: DisconnectSentryResponse,
      kind: MethodKind.Unary
    }
  }
};

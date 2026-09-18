var temporalOnlyExperimentControlArm = () => false;
function composeBoxRunnerGates(deps) {
  const { experiments } = deps;
  const gate = (name17) => () => experiments.checkFeatureGate(name17, { disableExposureLog: true });
  const simplifiedRightPane = gate("sand_simplified_right_pane");
  const browserUsePlaywrightGate = gate("grok_bot_browser_use_playwright");
  const userForm = (options2) => experiments.checkFeatureGate("sand_user_form", {
    disableExposureLog: options2?.logExposure !== true
  });
  return composeSandRunnerGates({
    sendMessageDeliveryOwed: gate("sand_send_message_delivery_owed"),
    lessSubagentFanout: () => experiments.offerLessSubagentFanout(),
    reducePeerChatter: temporalOnlyExperimentControlArm,
    leanSendToUserDescription: temporalOnlyExperimentControlArm,
    dynamicTools: gate("grok_bot_dynamic_tools"),
    stableDynamicToolCatalog: gate("grok_bot_stable_dynamic_tool_catalog"),
    browserNavigationRecovery: gate("sand_browser_navigation_recovery"),
    browserUsePlaywright: () => browserUsePlaywrightGate() || experiments.offerBrowserUsePlaywright(),
    userForm,
    formVault: gate("grok_bot_form_vault"),
    draftExternalMessage: gate("sand_draft_external_message"),
    agentPromptedCookieSync: gate("agent_prompted_cookie_sync"),
    stripeLink: gate("grok_bot_stripe_link"),
    spotlight: () => resolveSpotlightEnabled(deps.spotlightOverride, gate("sand_spotlight")),
    mcpMultiAccount: gate("mcp_multi_account"),
    unicodeTyping: gate("sand_computer_use_unicode_typing"),
    cloudAgentsDisabledByTeam: deps.isCloudAgentsDisabledByTeamAdmin,
    cloudAgentArtifacts: gate("sand_cloud_agent_artifacts"),
    cloudAgentDurableWatch: gate("grok_bot_cloud_agent_durable_watch"),
    cloudAgentReplyModes: fixedGate(
      false,
      "the box host has no steer port; reply modes are Temporal-only"
    ),
    frozenToolDescriptions: fixedGate(
      false,
      "the box host has no tool-description snapshot store; frozen tool descriptions are Temporal-only"
    ),
    canvases: gate("sand_canvases"),
    cloudAgentProjects: gate("sand_enable_projects"),
    cloudAgentExchange: gate("sand_enable_bot2bot_cloud_agent_ui"),
    cloudCanvasTools: () => false,
    botShare: gate("sand_share_bot"),
    botShareGettingStarted: gate("grok_bot_template_onboarding"),
    teamAccessCards: () => false,
    scmConnectCard: gate("grok_bot_scm_connect_card"),
    voiceCall: gate("sand_voice_call"),
    messagesTools: gate("sand_messages_tools"),
    chromeCookieImport: gate("sand_import_chrome_cookies"),
    boxEgressTunnel: gate("sand_box_egress_tunnel"),
    onePasswordIntegration: gate("sand_1pass_integration"),
    agentEmail: gate("grok_bot_agent_mail"),
    checkSubscriptionUsage: gate("grok_bot_check_subscription_usage"),
    connectedActivity: gate("sand_connected_activity_tool"),
    updateCommunication: () => experiments.offerUpdateCommunication(),
    activeReactions: gate("grok_bot_active_reactions"),
    internalDetailsBoundary: gate("grok_bot_hide_internal_details"),
    agentDescription: () => !simplifiedRightPane(),
    fiveMinuteAutomationFloor: gate("sand_five_min_automation_floor")
  });
}

var SAND_TOOL_NAMES = [
  "AddMcpServer",
  "AuthenticateMcpServer",
  "ChatItems",
  "CheckIMessagePermissions",
  "CheckSubagent",
  "CheckSubscriptionUsage",
  "CloudAgent",
  "CopyFromBox",
  "CopyToBox",
  "CreateAgent",
  "CreateChannel",
  "DraftExternalMessage",
  "FetchConnectedActivity",
  "FetchIMessageAttachment",
  "FindContacts",
  "FindIMessageChats",
  "GetCredentialProviderStatus",
  "GetMcpServerStatus",
  "GetPlugin",
  "IMessageActivity",
  "InstallPlugin",
  "ListMachines",
  "ListCredentials",
  "ListSections",
  "MessageSubagent",
  "ReactToMessage",
  "ReadTranscript",
  "RecallMemory",
  "RemoveMcpAccount",
  "RenameMcpAccount",
  "RestartMcpServers",
  "SearchIMessages",
  "SearchPlugins",
  "SendFeedback",
  "SendIMessage",
  "SendToAgent",
  "SetMcpInstructions",
  "SetPrimaryBot",
  "StopSubagent",
  "UninstallMcpServer",
  "UninstallPlugin",
  "UpdateAgent",
  "UpdateChannel",
  "WakeParent",
  "create_bot_share_json",
  "nudge_voice_agent",
  "offer_slack_connect",
  "offer_team_access",
  "place_phone_call",
  "propose_carry_over",
  "propose_skills",
  "react_to_slack_message",
  "read_agent_activity",
  "read_sibling_thread",
  "remap_user_form_targets",
  "request_box_help",
  "request_1password_connect",
  "request_cookie_origin_approval",
  "request_scm_connect",
  "request_user_form",
  "request_virtual_card",
  "send_email",
  "slack_setup",
  "sort_memories",
  "team_publish",
  "update_app_home",
  "update_state",
  "upload_file",
  "download_file",
  "list_email_inboxes",
  "claim_email_inbox",
  "search_email_threads",
  "read_email_thread",
  "read_email_attachment",
  "browser_navigate",
  "browser_snapshot",
  "browser_click",
  "browser_mouse_click_xy",
  "browser_type",
  "browser_fill",
  "browser_select_option",
  "browser_press_key",
  "browser_scroll",
  "browser_drag",
  "browser_get_bounding_box",
  "browser_highlight",
  "browser_cdp",
  "browser_tabs",
  "browser_take_screenshot"
];
var sandToolNames = new Set(SAND_TOOL_NAMES);
function isSandToolName(value) {
  return typeof value === "string" && sandToolNames.has(value);
}
function descriptor(value) {
  if (typeof value !== "string") return void 0;
  return value.trim() || void 0;
}
function decodeSandToolActivity(currentStep) {
  if (currentStep == null || currentStep.length === 0) return void 0;
  let payload;
  try {
    payload = JSON.parse(currentStep);
  } catch {
    return void 0;
  }
  if (payload === null || typeof payload !== "object" || Array.isArray(payload) || !("__sand_tool__" in payload) || payload.__sand_tool__ !== true) {
    return void 0;
  }
  return {
    tool: "tool" in payload && isSandToolName(payload.tool) ? payload.tool : void 0,
    detail: "detail" in payload ? descriptor(payload.detail) : void 0,
    target: "target" in payload ? descriptor(payload.target) : void 0
  };
}

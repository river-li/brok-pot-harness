var SEND_TO_USER_TOOL_NOTES_POINTER = 'For type:secret-request and for Grok Bot in-app links in message content, follow "Tool notes" in your instructions; they track what this chat supports right now. ';
function renderSendToUserToolNotes(inputs) {
  return [
    "Tool notes: current details for your tools. When they change you are told in an instructions update.",
    `- SendToUser secret requests: ${secretRequestToolGuidance(inputs.resolveSecretRequestTarget).trim()}`,
    `- SendToUser in-app links: ${inAppLinksGuidance({
      chromeCookieImport: inputs.chromeCookieImport,
      boxEgressTunnel: inputs.boxEgressTunnel
    })}`
  ].join("\n");
}

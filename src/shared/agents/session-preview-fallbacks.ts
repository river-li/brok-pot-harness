function isSessionPreviewLink(message) {
  if (message.type !== "attachment" || message.file_name != null && message.file_name.length > 0) {
    return false;
  }
  try {
    return new URL(message.url).protocol === "https:";
  } catch {
    return false;
  }
}
function widgetPrompt(widget) {
  return typeof widget.prompt === "string" ? widget.prompt : void 0;
}
function sessionPreviewForWidget(args) {
  const prompt = widgetPrompt(args.widget);
  if (args.respondedValue != null) {
    return {
      kind: "widget_answered",
      ...prompt != null ? { prompt } : {},
      answer: getWidgetAnswerLabel(args.widget, args.respondedValue)
    };
  }
  if (args.dismissed) {
    return { kind: "widget_prompt", ...prompt != null ? { prompt } : {} };
  }
  const options2 = Array.isArray(args.widget.options) ? args.widget.options.map((option) => option.label) : [];
  return {
    kind: "widget_options",
    ...prompt != null ? { prompt } : {},
    options: options2
  };
}
function sessionPreviewForSendMessage(message) {
  switch (message.type) {
    case "text":
      return { kind: "message_text", text: message.content };
    case "attachment":
      if (isSessionPreviewLink(message)) {
        return { kind: "sent_link", url: message.url };
      }
      return {
        kind: "sent_attachments",
        count: 1,
        kinds: [
          {
            kind: classifyAttachment({
              fileName: message.file_name,
              urlOrPath: message.url
            }),
            count: 1
          }
        ]
      };
    case "widget": {
      const prompt = widgetPrompt(message.widget);
      return { kind: "widget_prompt", ...prompt != null ? { prompt } : {} };
    }
    case "cursor-agent": {
      const title = message.title?.trim();
      return {
        kind: "cursor_agent",
        ...title != null && title.length > 0 ? { title } : {}
      };
    }
    case "secret-request":
      return { kind: "secret_request", label: message.secretRequest.label };
    case "credential-request":
      return { kind: "message" };
    case "user-form":
      return { kind: "user_form", title: message.formRequest.title };
    case "email-draft":
      return { kind: "email_draft", text: message.draft.subject || message.draft.body };
    case "slack-draft":
      return { kind: "slack_draft", text: message.draft.body };
    case "permission-request":
      return { kind: "permission_request", title: message.permission.title };
    case "auto-review-approval":
      return { kind: "approval_required", summary: message.approval.summary };
    case "cookie-origin-approval":
      return { kind: "cookie_origin_approval" };
    case "local-tool-permission":
      return { kind: "local_tool_permission", target: message.ask.target };
    case "virtual-card-approval":
      return { kind: "virtual_card_approval", merchantName: message.approval.merchantName };
    case "connector":
      return message.variant === "connected" ? { kind: "connector_connected", connector: message.connector } : { kind: "connector_connect", connector: message.connector };
    case "connectors":
      return { kind: "connectors", connectors: message.connectors };
    case "listener-connect":
      return { kind: "listener_connect", platform: message.platform };
    case "team-access":
    case "slack-connect":
    case "scm-connect":
    case "onepassword-connect":
      return { kind: "message" };
    case "bot-template-share":
      return { kind: "bot_template_share", name: message.name };
  }
  const _exhaustive = message;
  void _exhaustive;
  return { kind: "message" };
}
function isLocalizableSessionPreview(preview) {
  switch (preview.kind) {
    case "message_text":
    case "secret_request":
    case "user_form":
    case "email_draft":
    case "slack_draft":
    case "permission_request":
      return false;
    case "widget_prompt":
      return preview.prompt == null;
    case "sent_link":
    case "sent_attachments":
    case "sent_agent_message":
    case "received_agent_message":
    case "widget_answered":
    case "widget_options":
    case "cursor_agent":
    case "approval_required":
    case "cookie_origin_approval":
    case "local_tool_permission":
    case "virtual_card_approval":
    case "connector_connected":
    case "connector_connect":
    case "connectors":
    case "listener_connect":
    case "bot_template_share":
    case "message":
      return true;
  }
}
function hostSessionPreview(preview) {
  switch (preview.kind) {
    case "message_text":
      return preview.text;
    case "sent_link":
      return `Sent a link \xB7 ${preview.url}`;
    case "sent_attachments":
      return formatAttachmentSentSummary(preview.count, preview.kinds);
    case "sent_agent_message": {
      const trimmed = preview.text.trim();
      return trimmed.length > 0 ? `Messaged ${preview.recipient}: ${trimmed}` : `Messaged ${preview.recipient}`;
    }
    case "received_agent_message": {
      const trimmed = preview.text.trim();
      return trimmed.length > 0 ? `Message from ${preview.sender}: ${trimmed}` : `Message from ${preview.sender}`;
    }
    case "widget_prompt":
      return preview.prompt ?? "Question";
    case "widget_answered":
      return `${preview.prompt ?? "Question"} \u2014 ${preview.answer}`;
    case "widget_options": {
      const prompt = preview.prompt ?? "Question";
      const options2 = preview.options.join(" / ");
      return options2.length > 0 ? `${prompt} \u2014 ${options2}` : prompt;
    }
    case "cursor_agent":
      return preview.title != null ? `Cursor agent: ${preview.title}` : "Cursor cloud agent";
    case "secret_request":
      return preview.label;
    case "user_form":
      return preview.title;
    case "email_draft":
    case "slack_draft":
      return preview.text;
    case "permission_request":
      return preview.title;
    case "approval_required":
      return `Approval required: ${preview.summary}`;
    case "cookie_origin_approval":
      return "The Bot wants to use your existing logins";
    case "local_tool_permission":
      return `Permission required: ${preview.target}`;
    case "virtual_card_approval":
      return `Approve a card for ${preview.merchantName}`;
    case "connector_connected":
      return `${preview.connector} connected`;
    case "connector_connect":
      return `Connect ${preview.connector}`;
    case "connectors":
      return preview.connectors.length > 0 ? `Connect ${preview.connectors.join(", ")}` : "Connect tools";
    case "listener_connect":
      return `Connect ${connectCardManifest(preview.platform)?.displayName ?? preview.platform}`;
    case "bot_template_share":
      return `Shared bot template: ${preview.name}`;
    case "message":
      return "Message";
  }
}

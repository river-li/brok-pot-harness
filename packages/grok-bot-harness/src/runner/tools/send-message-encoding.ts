/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/grok-bot-harness/src/runner/tools/send-message-encoding.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/2
var import_node_path170 = require("node:path");
init_agent_pb();
init_send_message_tool_pb();

// @recovered-fragment 2/2
function createSendMessageToolCall(toolCall) {
  return new ToolCall({
    tool: {
      case: "sendMessageToolCall",
      value: toolCall
    }
  });
}
function encodeSendMessage(message) {
  switch (message.type) {
    case "widget":
      return new SendMessageArgs({
        message: {
          case: "text",
          value: new SendMessageText({ content: summarizeWidget(message.widget) })
        }
      });
    case "cursor-agent": {
      const title = message.title?.trim();
      return new SendMessageArgs({
        message: {
          case: "text",
          value: new SendMessageText({
            content: title != null && title.length > 0 ? `Referenced Cursor cloud agent ${message.bcId} (${title})` : `Referenced Cursor cloud agent ${message.bcId}`
          })
        }
      });
    }
    case "secret-request":
      return new SendMessageArgs({
        message: {
          case: "text",
          value: new SendMessageText({
            content: summarizeSecretRequest(message.secretRequest)
          })
        }
      });
    case "credential-request":
      return new SendMessageArgs({
        message: {
          case: "text",
          value: new SendMessageText({
            content: summarizeCredentialRequest(message.credentialRequest)
          })
        }
      });
    case "user-form":
      return new SendMessageArgs({
        message: {
          case: "text",
          value: new SendMessageText({
            content: summarizeUserFormRequest(message.formRequest)
          })
        }
      });
    case "permission-request":
      return new SendMessageArgs({
        message: {
          case: "text",
          value: new SendMessageText({
            content: summarizePermissionRequest(message.permission)
          })
        }
      });
    case "auto-review-approval":
      return new SendMessageArgs({
        message: {
          case: "text",
          value: new SendMessageText({
            content: `Auto-review requested approval for: ${message.approval.summary}. Status: ${message.approval.status}.`
          })
        }
      });
    case "local-tool-permission":
      return new SendMessageArgs({
        message: {
          case: "text",
          value: new SendMessageText({
            content: `Asked the user for permission to use their computer (${message.ask.action}: ${message.ask.target}). Status: ${message.ask.status}.`
          })
        }
      });
    case "cookie-origin-approval":
      return new SendMessageArgs({
        message: {
          case: "text",
          value: new SendMessageText({
            content: `Asked the user to approve copying Chrome cookies for: ${message.approval.items.map((item) => item.origin).join(", ")}. Status: ${message.approval.status}.`
          })
        }
      });
    case "virtual-card-approval": {
      const breakdown = message.approval.lineItems.map((item) => `${item.label} ${item.amountCents}`).join(", ");
      return new SendMessageArgs({
        message: {
          case: "text",
          value: new SendMessageText({
            content: `Asked the user to authorize a virtual card for ${message.approval.merchantName} (${message.approval.amountCents} ${message.approval.currency.toUpperCase()}, in minor units; ${breakdown}) titled ${JSON.stringify(message.approval.title)}. Status: ${message.approval.status}.`
          })
        }
      });
    }
    case "email-draft": {
      const cc = message.draft.cc?.join(", ");
      const from2 = message.draft.from;
      return new SendMessageArgs({
        message: {
          case: "text",
          value: new SendMessageText({
            content: `Draft email${from2 == null ? "" : `
From: ${from2}`}
To: ${message.draft.to.join(", ")}${cc == null ? "" : `
Cc: ${cc}`}
Subject: ${message.draft.subject}

${message.draft.body}`
          })
        }
      });
    }
    case "slack-draft": {
      const workspace = message.draft.workspace;
      return new SendMessageArgs({
        message: {
          case: "text",
          value: new SendMessageText({
            content: `Draft Slack message${workspace == null ? "" : ` in ${workspace}`} to ${message.draft.target}
Thread: ${message.draft.thread ?? "New message"}

${message.draft.body}`
          })
        }
      });
    }
    case "connector":
      return new SendMessageArgs({
        message: {
          case: "text",
          value: new SendMessageText({
            content: message.variant === "connected" ? `Confirmed the ${message.connector} connector is connected` : `Asked the user to connect the ${message.connector} connector`
          })
        }
      });
    case "connectors":
      return new SendMessageArgs({
        message: {
          case: "text",
          value: new SendMessageText({
            content: `Asked the user to connect: ${message.connectors.join(", ")}`
          })
        }
      });
    case "listener-connect":
      return new SendMessageArgs({
        message: {
          case: "text",
          value: new SendMessageText({
            content: `Asked the user to connect ${listenerIntegrationManifest(message.platform)?.displayName ?? message.platform} for listener routines`
          })
        }
      });
    case "scm-connect":
      return new SendMessageArgs({
        message: {
          case: "text",
          value: new SendMessageText({
            content: "Asked the user to connect a source control integration for cloud agents"
          })
        }
      });
    case "onepassword-connect":
      return new SendMessageArgs({
        message: {
          case: "text",
          value: new SendMessageText({
            content: "Asked the user to connect 1Password for saved logins"
          })
        }
      });
    case "team-access":
      return new SendMessageArgs({
        message: {
          case: "text",
          value: new SendMessageText({
            content: "Offered to enable team access for this bot"
          })
        }
      });
    case "slack-connect":
      return new SendMessageArgs({
        message: {
          case: "text",
          value: new SendMessageText({
            content: "Offered to connect this bot to Slack"
          })
        }
      });
    case "bot-template-share":
      return new SendMessageArgs({
        message: {
          case: "text",
          value: new SendMessageText({
            content: `Staged unpublished version ${message.version ?? "?"} of "${message.name}". It is not public until you confirm it.`
          })
        }
      });
    case "text":
      return new SendMessageArgs({
        message: {
          case: "text",
          value: new SendMessageText({ content: encodeTextContent(message) })
        }
      });
    case "attachment":
      return new SendMessageArgs({
        message: {
          case: "attachment",
          value: new SendMessageAttachment({
            url: message.url,
            ...message.alt != null ? { alt: message.alt } : {}
          })
        }
      });
    default: {
      const _exhaustive = message;
      return _exhaustive;
    }
  }
}
function encodeTextContent(message) {
  const images = message.images ?? [];
  if (images.length === 0) return message.content;
  const markdown = images.map((image2) => {
    const alt = (image2.alt ?? "").replace(/[[\]\n]/g, " ").trim();
    return `![${alt}](${encodeMarkdownImageDestination(image2.url)})`;
  }).join("\n");
  return `${message.content}

${markdown}`;
}
function encodeMarkdownImageDestination(url2) {
  return `<${url2.replace(/[<>\r\n]/g, encodeURIComponent)}>`;
}
async function resolveBoxMediaAttachment(request5) {
  const { ctx, boxPath, box, boxId, remoteBoxHasDesktop, persistImage } = request5;
  if (!remoteBoxHasDesktop) return null;
  if (!isBoxRootPath(boxPath)) return null;
  let data;
  try {
    const files = await downloadBoxFiles(ctx, box, boxId, [boxPath]);
    const bytes = files.get(boxPath);
    if (bytes === void 0) return null;
    data = bytes;
  } catch {
    return null;
  }
  const imageMime = imageMimeFromPath(boxPath);
  if (imageMime != null) {
    if (persistImage == null) return null;
    try {
      const persisted = await persistImage(data, imageMime);
      return persisted?.fileUrl ?? null;
    } catch {
      return null;
    }
  }
  if (request5.persistMediaBytes == null) return null;
  try {
    return await request5.persistMediaBytes((0, import_node_path170.basename)(boxPath), data);
  } catch {
    return null;
  }
}


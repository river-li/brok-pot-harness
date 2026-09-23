init_selected_context_pb();
function buildComposedOfflineNote(composedAtMs) {
  if (!Number.isFinite(composedAtMs)) return "";
  return `[Composed offline at ${new Date(composedAtMs).toISOString()}]`;
}
function createUserMessage(id, content, options2) {
  const composedAtMs = options2.composedAtMs != null && Number.isFinite(options2.composedAtMs) ? options2.composedAtMs : void 0;
  return {
    kind: "message",
    id,
    role: "user",
    content,
    richText: options2.richText != null && options2.richText.length > 0 ? options2.richText : void 0,
    isStreaming: false,
    timestampMs: composedAtMs ?? Date.now(),
    ...options2.replyTo != null ? { replyTo: options2.replyTo } : {},
    ...options2.batchId != null ? { batchId: options2.batchId } : {},
    ...options2.branched === true ? { branched: true } : {},
    ...options2.clientNonce != null && options2.clientNonce.length > 0 ? { clientNonce: options2.clientNonce } : {},
    ...composedAtMs == null ? {} : { sentWhileOfflineAtMs: composedAtMs }
  };
}
function createSendMessageEntry(id, message, timestampMs2) {
  const replyTo = "reply_to" in message ? message.reply_to : void 0;
  return {
    kind: "send-message",
    id,
    message,
    timestampMs: timestampMs2,
    ...replyTo != null && replyTo.length > 0 ? { replyTo } : {}
  };
}
function stampBoxRequestEntry(entry, handoff) {
  return {
    ...entry,
    boxRequestId: handoff.requestId,
    boxInstruction: handoff.instruction
  };
}
function stampUserFormEntry(entry, userForm) {
  return {
    ...entry,
    formRequestId: userForm.requestId
  };
}
async function createUserAttachmentEntry(attachments, id, filePath, options2 = {}) {
  const dimensions = await attachments.readImageDimensions(filePath);
  const fileName = options2.fileName?.trim();
  const composedAtMs = options2.composedAtMs != null && Number.isFinite(options2.composedAtMs) ? options2.composedAtMs : void 0;
  return {
    kind: "user-attachment",
    id,
    file_path: filePath,
    timestampMs: composedAtMs ?? Date.now(),
    ...fileName != null && fileName.length > 0 ? { file_name: fileName } : {},
    ...options2.batchId != null ? { batchId: options2.batchId } : {},
    ...options2.clientNonce != null && options2.clientNonce.length > 0 ? { clientNonce: options2.clientNonce } : {},
    width: dimensions?.width,
    height: dimensions?.height,
    byteSize: options2.byteSize,
    ...options2.replyTo != null ? { replyTo: options2.replyTo } : {},
    ...options2.branched === true ? { branched: true } : {}
  };
}
function stripReplyTo(message) {
  switch (message.type) {
    case "auto-review-approval":
    case "cookie-origin-approval":
    case "local-tool-permission":
    case "connector-grant":
    case "virtual-card-approval":
      return message;
    case "email-draft":
    case "slack-draft":
      return message;
    case "text":
      return {
        type: "text",
        content: message.content,
        ...message.images != null ? { images: message.images } : {}
      };
    case "widget":
      return { type: "widget", widget: message.widget };
    case "cursor-agent":
      return { type: "cursor-agent", bcId: message.bcId };
    case "secret-request":
      return { type: "secret-request", secretRequest: message.secretRequest };
    case "credential-request":
      return {
        type: "credential-request",
        credentialRequest: message.credentialRequest
      };
    case "user-form":
      return { type: "user-form", formRequest: message.formRequest };
    case "permission-request":
      return { type: "permission-request", permission: message.permission };
    case "connector":
      return {
        type: "connector",
        connector: message.connector,
        variant: message.variant,
        ...message.serverId != null ? { serverId: message.serverId } : {},
        ...message.reason != null ? { reason: message.reason } : {},
        ...message.suggestions != null ? { suggestions: message.suggestions } : {}
      };
    case "connectors":
      return {
        type: "connectors",
        connectors: message.connectors,
        ...message.reason != null ? { reason: message.reason } : {}
      };
    case "listener-connect":
      return {
        type: "listener-connect",
        platform: message.platform,
        ...message.reason != null ? { reason: message.reason } : {}
      };
    case "team-access":
      return {
        type: "team-access",
        ...message.reason != null ? { reason: message.reason } : {}
      };
    case "slack-connect":
      return {
        type: "slack-connect",
        ...message.reason != null ? { reason: message.reason } : {}
      };
    case "scm-connect":
      return {
        type: "scm-connect",
        ...message.provider != null ? { provider: message.provider } : {},
        ...message.intent != null ? { intent: message.intent } : {},
        ...message.reason != null ? { reason: message.reason } : {},
        ...message.repo != null ? { repo: message.repo } : {}
      };
    case "onepassword-connect":
      return { type: "onepassword-connect" };
    case "attachment":
      return {
        type: "attachment",
        url: message.url,
        ...message.file_name != null ? { file_name: message.file_name } : {},
        ...message.alt != null ? { alt: message.alt } : {},
        ...message.channel != null ? { channel: message.channel } : {},
        ...message.width != null ? { width: message.width } : {},
        ...message.height != null ? { height: message.height } : {}
      };
    case "bot-template-share":
      return {
        type: "bot-template-share",
        shareId: message.shareId,
        name: message.name,
        avatarShape: message.avatarShape,
        avatarColor: message.avatarColor,
        body: message.body,
        shareUrl: message.shareUrl,
        ...message.version == null ? {} : { version: message.version },
        ...message.published == null ? {} : { published: message.published },
        ...message.activeVersion == null ? {} : { activeVersion: message.activeVersion },
        ...message.visibility == null ? {} : { visibility: message.visibility }
      };
    default: {
      const _exhaustive = message;
      return _exhaustive;
    }
  }
}
function withReplyTo(message, replyTo) {
  switch (message.type) {
    case "auto-review-approval":
    case "cookie-origin-approval":
    case "local-tool-permission":
    case "connector-grant":
    case "virtual-card-approval":
      return message;
    case "email-draft":
    case "slack-draft":
      return message;
    case "text":
      return {
        type: "text",
        content: message.content,
        ...message.images != null ? { images: message.images } : {},
        reply_to: replyTo
      };
    case "widget":
      return { type: "widget", widget: message.widget, reply_to: replyTo };
    case "cursor-agent":
      return { type: "cursor-agent", bcId: message.bcId, reply_to: replyTo };
    case "secret-request":
      return {
        type: "secret-request",
        secretRequest: message.secretRequest,
        reply_to: replyTo
      };
    case "credential-request":
      return {
        type: "credential-request",
        credentialRequest: message.credentialRequest,
        reply_to: replyTo
      };
    case "user-form":
      return {
        type: "user-form",
        formRequest: message.formRequest,
        reply_to: replyTo
      };
    case "permission-request":
      return {
        type: "permission-request",
        permission: message.permission,
        reply_to: replyTo
      };
    case "connector":
      return {
        type: "connector",
        connector: message.connector,
        variant: message.variant,
        reply_to: replyTo,
        ...message.serverId != null ? { serverId: message.serverId } : {},
        ...message.reason != null ? { reason: message.reason } : {},
        ...message.suggestions != null ? { suggestions: message.suggestions } : {}
      };
    case "listener-connect":
      return {
        type: "listener-connect",
        platform: message.platform,
        reply_to: replyTo,
        ...message.reason != null ? { reason: message.reason } : {}
      };
    case "team-access":
      return {
        type: "team-access",
        reply_to: replyTo,
        ...message.reason != null ? { reason: message.reason } : {}
      };
    case "slack-connect":
      return {
        type: "slack-connect",
        reply_to: replyTo,
        ...message.reason != null ? { reason: message.reason } : {}
      };
    case "scm-connect":
      return {
        type: "scm-connect",
        reply_to: replyTo,
        ...message.provider != null ? { provider: message.provider } : {},
        ...message.intent != null ? { intent: message.intent } : {},
        ...message.reason != null ? { reason: message.reason } : {},
        ...message.repo != null ? { repo: message.repo } : {}
      };
    case "onepassword-connect":
      return { type: "onepassword-connect", reply_to: replyTo };
    case "connectors":
      return {
        type: "connectors",
        connectors: message.connectors,
        reply_to: replyTo,
        ...message.reason != null ? { reason: message.reason } : {}
      };
    case "attachment":
      return {
        type: "attachment",
        url: message.url,
        reply_to: replyTo,
        ...message.file_name != null ? { file_name: message.file_name } : {},
        ...message.alt != null ? { alt: message.alt } : {},
        ...message.channel != null ? { channel: message.channel } : {},
        ...message.width != null ? { width: message.width } : {},
        ...message.height != null ? { height: message.height } : {}
      };
    case "bot-template-share":
      return {
        type: "bot-template-share",
        shareId: message.shareId,
        name: message.name,
        avatarShape: message.avatarShape,
        avatarColor: message.avatarColor,
        body: message.body,
        shareUrl: message.shareUrl,
        reply_to: replyTo,
        ...message.version == null ? {} : { version: message.version },
        ...message.published == null ? {} : { published: message.published },
        ...message.activeVersion == null ? {} : { activeVersion: message.activeVersion },
        ...message.visibility == null ? {} : { visibility: message.visibility }
      };
    default: {
      const _exhaustive = message;
      return _exhaustive;
    }
  }
}
function skippablePromptSummary(message) {
  if (message.type === "widget") return summarizeWidget(message.widget);
  return void 0;
}
function splitAttachmentPathsByChannel(attachmentPaths) {
  const isImage = (path31) => imageMimeFromPath(path31) !== void 0;
  const isVideo = (path31) => videoMimeFromPath(path31) !== void 0;
  return {
    imageAttachmentPaths: attachmentPaths.filter(isImage),
    videoAttachmentPaths: attachmentPaths.filter(isVideo),
    fileAttachmentPaths: attachmentPaths.filter((path31) => !isImage(path31) && !isVideo(path31))
  };
}
function buildSelectedVideos(videoAttachmentPaths) {
  return videoAttachmentPaths.map(
    (videoPath) => new SelectedVideo({
      path: videoPath,
      mimeType: videoMimeFromPath(videoPath) ?? "video/mp4",
      filename: (0, import_node_path156.basename)(videoPath),
      fps: 4
    })
  );
}
function collectInboundImages(envelopes) {
  const images = [];
  for (const envelope of envelopes) {
    for (const image2 of envelope.images ?? []) {
      images.push({ data: image2.data, mimeType: image2.mimeType });
    }
  }
  return images;
}
async function loadAgentInboundImages(images) {
  const paths = (images ?? []).flatMap((image2) => {
    const path31 = filePathFromFileUrl(image2.url);
    return path31 != null ? [path31] : [];
  });
  return await loadSelectedImageInputs(paths);
}
function areAttachmentsOnAgentBox(agentId, attachmentPaths) {
  if (attachmentPaths.length === 0) return false;
  const attachmentsDir = getAgentAttachmentsDir(resolveSandAgentDir(agentId));
  return attachmentPaths.every(
    (path31) => isPathWithin(attachmentsDir, reanchorSandPath(path31, { acceptBoxModelVisibleAlias: true }))
  );
}
async function statAttachedFileSizes(filePaths) {
  const sizes = /* @__PURE__ */ new Map();
  if (filePaths.length === 0) return sizes;
  await Promise.all(
    filePaths.map(async (filePath) => {
      try {
        const info2 = await (0, import_promises77.stat)(filePath);
        if (info2.isFile()) sizes.set(filePath, info2.size);
      } catch {
      }
    })
  );
  return sizes;
}

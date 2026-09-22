/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/host/extensions/session/session-projection.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
function peerMessageLastEntry(entry) {
  if (entry.toAgent?.kind === "agent") {
    const sessionPreview = {
      kind: "sent_agent_message",
      recipient: entry.toAgent.name,
      text: boundedPreviewSource(entry.content)
    };
    return {
      kind: "text",
      text: hostSessionPreview(sessionPreview),
      sessionPreview
    };
  }
  if (entry.fromAgent != null && entry.fromAgent.kind !== "cloud-agent") {
    const sessionPreview = {
      kind: "received_agent_message",
      sender: entry.fromAgent.name,
      text: boundedPreviewSource(entry.content)
    };
    return {
      kind: "text",
      text: hostSessionPreview(sessionPreview),
      sessionPreview
    };
  }
  return null;
}
function getUpdatedAtFromStats(metadata, dbStats) {
  const fsTime = Math.floor(Number(dbStats?.mtimeMs ?? 0));
  return Math.max(Number(metadata.createdAt), fsTime);
}
function getSummaryUpdatedAt(metadata, unreadState) {
  return Math.max(Number(metadata.createdAt), unreadState.lastActivityAt);
}
function seedActivityFromMtime(db, agentId, dbStats) {
  if (db.getUnreadState().lastActivityAt > 0) return;
  const latestRootBlobId = db.get("latestRootBlobId");
  if (latestRootBlobId.length === 0) return;
  db.seedActivityAsRead(
    getUpdatedAtFromStats(
      {
        ...getDefaultAgentMetadata(agentId),
        createdAt: db.get("createdAt"),
        latestRootBlobId
      },
      dbStats
    )
  );
}
function isSameAttachmentBatch(candidate, anchor) {
  return anchor != null && anchor.length > 0 && candidate === anchor;
}
function collectLastAttachmentBatchKinds(entries, index) {
  const last = entries[index];
  const kinds = [];
  if (last?.kind === "user-attachment") {
    for (let i = index; i >= 0; i--) {
      const entry = entries[i];
      if (entry?.kind !== "user-attachment" || i !== index && !isSameAttachmentBatch(entry.batchId, last.batchId)) {
        break;
      }
      kinds.push(
        classifyAttachment({
          fileName: entry.file_name,
          urlOrPath: entry.file_path
        })
      );
    }
  } else if (last?.kind === "send-message" && last.message.type === "attachment") {
    for (let i = index; i >= 0; i--) {
      const entry = entries[i];
      if (entry?.kind !== "send-message" || entry.message.type !== "attachment" || isSessionPreviewLink(entry.message) || i !== index && !isSameAttachmentBatch(entry.batchId, last.batchId)) {
        break;
      }
      kinds.push(
        classifyAttachment({
          fileName: entry.message.file_name,
          urlOrPath: entry.message.url
        })
      );
    }
  }
  return kinds.reverse();
}
function buildAttachmentLastEntry(entries, index) {
  const kinds = collectLastAttachmentBatchKinds(entries, index);
  return {
    kind: "attachment",
    count: kinds.length,
    kinds: countAttachmentKinds(kinds)
  };
}
function getLastMessageFromTranscript(entries) {
  const chat = getChatTranscriptEntries(entries);
  for (let i = chat.length - 1; i >= 0; i--) {
    const entry = chat[i];
    if (entry?.kind === "send-message") {
      let previewSource = sessionPreviewForSendMessage(entry.message);
      if (previewSource.kind === "message_text") {
        previewSource = {
          kind: "message_text",
          text: markdownToPreviewLine(previewSource.text)
        };
      }
      const pushMessageContent = getPushMessageContentFromTranscript(entries);
      return {
        id: entry.id,
        preview: capPreviewLine(hostSessionPreview(previewSource)),
        previewSource: isLocalizableSessionPreview(previewSource) ? previewSource : null,
        authorId: entry.author?.id ?? null,
        pushMessageContent: pushMessageContent?.message.id === entry.id ? pushMessageContent : null
      };
    }
  }
  return null;
}
function getLastEntryFromTranscript(entries) {
  const visible = getMainTranscriptEntries(entries);
  for (let i = visible.length - 1; i >= 0; i--) {
    const entry = visible[i];
    if (entry == null) continue;
    if (entry.kind === "message") {
      const peerPreview = peerMessageLastEntry(entry);
      if (peerPreview != null) {
        return peerPreview;
      }
      if (isAgentPeerMessageEntry(entry)) continue;
    }
    if (entry.kind === "send-message") {
      if (entry.message.type === "attachment") {
        if (isSessionPreviewLink(entry.message)) {
          return { kind: "link", url: entry.message.url };
        }
        return buildAttachmentLastEntry(visible, i);
      }
      const sessionPreview = entry.message.type === "widget" ? sessionPreviewForWidget({
        widget: entry.message.widget,
        respondedValue: entry.respondedValue,
        dismissed: entry.widgetDismissed === true
      }) : sessionPreviewForSendMessage(entry.message);
      return {
        kind: "text",
        text: boundedPreviewSource(hostSessionPreview(sessionPreview)),
        ...entry.author?.id == null ? {} : { authorId: entry.author.id },
        ...isLocalizableSessionPreview(sessionPreview) ? { sessionPreview } : {}
      };
    }
    if (entry.kind === "message" && entry.content.length > 0) {
      return { kind: "text", text: boundedPreviewSource(entry.content) };
    }
    if (entry.kind === "user-attachment") {
      return buildAttachmentLastEntry(visible, i);
    }
  }
  return null;
}
function previewsSettledWithin(tail, previews) {
  if (previews.lastEntry == null || previews.lastMessage == null) return false;
  const byId = new Map(tail.map((entry) => [entry.id, entry]));
  if (tail.some((entry) => isBranchedEntry(entry) && !branchChainStaysWithin(entry, byId))) {
    return false;
  }
  const visible = getMainTranscriptEntries(tail);
  if (previews.lastEntry.kind === "attachment" && isAttachmentEntry(visible[0])) return false;
  return previews.lastMessage.pushMessageContent != null || visible.filter((entry) => entry.kind === "send-message").length >= 2;
}
function branchChainStaysWithin(entry, byId) {
  let current = entry;
  const seen = /* @__PURE__ */ new Set([entry.id]);
  for (; ; ) {
    const parentId = getEntryReplyTo(current);
    if (parentId == null || seen.has(parentId)) return true;
    const parent = byId.get(parentId);
    if (parent == null) return false;
    if (!isBranchedEntry(parent)) return true;
    seen.add(parentId);
    current = parent;
  }
}
function isAttachmentEntry(entry) {
  return entry?.kind === "user-attachment" || entry?.kind === "send-message" && entry.message.type === "attachment";
}


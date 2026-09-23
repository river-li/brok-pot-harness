var GROK_BOT_RELATED_CONVERSATIONS_MAX = 8;
var LEAD2 = "Related conversations: other conversations of yours that people in this conversation took part in and can see from here. Links only; nothing from them is copied into this prompt. When the current conversation refers to one, open it with ReadTranscript (session_id) or, for a Slack thread, the Slack read tools, and say that you did.";
var LINK_LINE_SESSION_ID_RE = /^- .* \(session_id ([^\s)]+)\)/;
function linkLine(link) {
  const url2 = link.url === void 0 ? "" : `: ${link.url}`;
  return `- ${link.label} (session_id ${link.sessionId})${url2}`;
}
function sessionIdOfLinkLine(line) {
  return LINK_LINE_SESSION_ID_RE.exec(line)?.[1];
}
function linkLinesOf(render2) {
  return render2.split("\n").filter((line) => sessionIdOfLinkLine(line) !== void 0);
}
function renderLinkLines(lines2) {
  return lines2.length === 0 ? "" : [LEAD2, ...lines2.slice(0, GROK_BOT_RELATED_CONVERSATIONS_MAX)].join("\n");
}
function renderRelatedConversationsPrompt(links) {
  if (links.length === 0) return void 0;
  const lines2 = links.slice(0, GROK_BOT_RELATED_CONVERSATIONS_MAX).sort((a, b2) => a.sessionId.localeCompare(b2.sessionId)).map(linkLine);
  return renderLinkLines(lines2);
}
function resolveRelatedConversationsPromptSection(args) {
  const { snapshot, compactionEpoch, live } = args;
  const pinned = snapshot !== null && snapshot.compactionEpoch === compactionEpoch ? snapshot : null;
  const section = (render3) => render3.length > 0 ? render3 : null;
  if (live === void 0) return { render: null };
  if (pinned === null) {
    const render3 = renderRelatedConversationsPrompt(live) ?? "";
    return { render: section(render3), snapshotToPersist: { render: render3, compactionEpoch } };
  }
  const liveIds = new Set(live.map((link) => link.sessionId));
  const stillSeen = (render3) => linkLinesOf(render3).filter((line) => liveIds.has(sessionIdOfLinkLine(line) ?? ""));
  const render2 = renderLinkLines(stillSeen(pinned.render));
  const seenLines = stillSeen(pinned.announcedRender ?? pinned.render);
  const seenIds = new Set(seenLines.map(sessionIdOfLinkLine));
  const lastSeen = renderLinkLines(seenLines);
  const announced = renderLinkLines([
    ...seenLines,
    ...live.filter((link) => !seenIds.has(link.sessionId)).sort((a, b2) => a.sessionId.localeCompare(b2.sessionId)).map(linkLine)
  ]);
  const withNotes = (announcedRender) => announcedRender === render2 ? { render: render2, compactionEpoch } : { render: render2, compactionEpoch, announcedRender };
  const kept = withNotes(lastSeen);
  const unchanged = kept.render === pinned.render && kept.announcedRender === pinned.announcedRender;
  return {
    render: section(render2),
    ...unchanged ? {} : { snapshotToPersist: kept },
    ...announced === lastSeen ? {} : {
      update: {
        name: "related_conversations",
        lastSeen,
        live: announced,
        snapshotToPersist: withNotes(announced)
      }
    }
  };
}

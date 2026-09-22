init_dist4();
var logger58 = createLogger("@anysphere/agent");
var NAMED_AGENT_SELF_DOCUMENT_TAG = "agent_self_document";
var SELF_DOCUMENT_OPEN = `<${NAMED_AGENT_SELF_DOCUMENT_TAG}>`;
var SELF_DOCUMENT_CLOSE = `</${NAMED_AGENT_SELF_DOCUMENT_TAG}>`;
var SELF_DOCUMENT_BLOCK_REGEX = new RegExp(`${SELF_DOCUMENT_OPEN}[\\s\\S]*?${SELF_DOCUMENT_CLOSE}`);
var USER_INFO_CLOSE = "</user_info>";
function renderNamedAgentSelfDocumentBlock(contents) {
  const trimmed = contents?.trim();
  const rawBody = trimmed !== void 0 && trimmed !== "" ? trimmed : `You have not written ${NAMED_AGENT_STORE_SELF_PATH} yet.`;
  const body = rawBody.replaceAll(SELF_DOCUMENT_OPEN, `<\\${NAMED_AGENT_SELF_DOCUMENT_TAG}>`).replaceAll(SELF_DOCUMENT_CLOSE, `<\\/${NAMED_AGENT_SELF_DOCUMENT_TAG}>`);
  return [
    SELF_DOCUMENT_OPEN,
    `The current contents of your self document (${NAMED_AGENT_STORE_SELF_PATH}). This copy is refreshed for you automatically \u2014 never read the file to learn who you are.`,
    "",
    body,
    SELF_DOCUMENT_CLOSE
  ].join("\n");
}
function extractNamedAgentSelfDocumentBlock(text2) {
  if (text2 === void 0) {
    return void 0;
  }
  return SELF_DOCUMENT_BLOCK_REGEX.exec(text2)?.[0];
}
function refreshNamedAgentSelfDocumentInText(text2, contents) {
  const block = renderNamedAgentSelfDocumentBlock(contents);
  if (SELF_DOCUMENT_BLOCK_REGEX.test(text2)) {
    return text2.replace(SELF_DOCUMENT_BLOCK_REGEX, () => block);
  }
  const userInfoCloseIndex = text2.indexOf(USER_INFO_CLOSE);
  if (userInfoCloseIndex === -1) {
    return void 0;
  }
  const insertAt = userInfoCloseIndex + USER_INFO_CLOSE.length;
  return `${text2.slice(0, insertAt)}

${block}${text2.slice(insertAt)}`;
}
async function refreshNamedAgentSelfDocumentInMessages(ctx, messages2, getNamedAgentSelfDocument, privacyMode) {
  let contents;
  try {
    contents = await getNamedAgentSelfDocument();
  } catch (error42) {
    logger58.warn(ctx, "[self-document] refresh load failed; keeping stale copy", {
      error: error42
    });
    return messages2;
  }
  let foundTarget = false;
  let didRefresh = false;
  const refreshed = messages2.map((message) => {
    if (foundTarget || message.role !== "user") {
      return message;
    }
    const unredacted = fromRedactedCoreMessage(message, PrivacyCapability.UNSAFE_ALWAYS_ALLOWED);
    if (unredacted.role !== "user") {
      return message;
    }
    const content = unredacted.content;
    if (typeof content === "string") {
      const updated = refreshNamedAgentSelfDocumentInText(content, contents);
      if (updated === void 0) {
        return message;
      }
      foundTarget = true;
      if (updated === content) {
        return message;
      }
      didRefresh = true;
      return toRedactedCoreMessage({ ...unredacted, content: updated }, privacyMode);
    }
    let didUpdatePart = false;
    const updatedParts = content.map((part) => {
      if (foundTarget || part.type !== "text") {
        return part;
      }
      const updated = refreshNamedAgentSelfDocumentInText(part.text, contents);
      if (updated === void 0) {
        return part;
      }
      foundTarget = true;
      if (updated === part.text) {
        return part;
      }
      didUpdatePart = true;
      return { ...part, text: updated };
    });
    if (!didUpdatePart) {
      return message;
    }
    didRefresh = true;
    return toRedactedCoreMessage({ ...unredacted, content: updatedParts }, privacyMode);
  });
  return didRefresh ? refreshed : messages2;
}

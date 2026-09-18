var SandTerminalReadError = class extends Error {
};
async function pollShellTerminalFile(host, id, isCancelled, settle) {
  const pollMs = shellRewatchPollMs();
  const deadlineMs = Date.now() + SHELL_REWATCH_MAX_WAIT_MS;
  let missingReads = 0;
  let outputPath;
  while (!isCancelled()) {
    try {
      const pollCtx = host.ctx.with(sandLocalToolScopeKey, {
        agentId: host.getConversationId()
      });
      const connection = await host.box.ensureReady(pollCtx, host.getConversationId());
      const folder = connection.terminalsFolder;
      outputPath = sandTerminalFilePath(folder, id) ?? `${folder}/${id}.txt`;
      const snapshot = await readShellTerminalSnapshot(
        host,
        connection.remoteAccessor,
        outputPath,
        pollCtx
      );
      if (snapshot.exists) {
        missingReads = 0;
        const footer = parseShellTerminalFooter(snapshot.content);
        switch (footer.kind) {
          case "running":
            break;
          case "exited":
            settle(
              footer.exitCode === 0 ? "success" : "error",
              footer.exitCode === 0 ? void 0 : `exit_code=${footer.exitCode ?? "unknown"}`,
              outputPath
            );
            return;
          case "stream-failure":
            settle(
              "error",
              "the command's output stream failed; read its output file for the error",
              outputPath
            );
            return;
          default: {
            const _exhaustive = footer;
            return _exhaustive;
          }
        }
      } else {
        missingReads++;
        if (missingReads >= SHELL_REWATCH_MISSING_FILE_GIVE_UP) {
          settle(
            "error",
            "The command's terminal output file no longer exists, so its completion can no longer be observed (it may have been cleaned up).",
            outputPath
          );
          return;
        }
      }
    } catch (error41) {
      if (error41 instanceof SandLocalToolPermissionDeniedError) {
        settle(
          "error",
          "Grok Bot is no longer allowed to read this command's output on the user's computer, so its completion cannot be observed. The command keeps running; ask the user to approve reading its output file for the result.",
          outputPath
        );
        return;
      }
    }
    if (Date.now() >= deadlineMs) break;
    await delay3(pollMs);
  }
  if (isCancelled()) return;
  settle(
    "error",
    `The command is still running after ${Math.round(
      SHELL_REWATCH_MAX_WAIT_MS / 6e4
    )} minutes. It keeps running; check its output file for the result.`,
    outputPath
  );
}
async function readShellTerminalSnapshot(host, accessor, path31, ctx = host.ctx) {
  const readExecutor = accessor.get(readExecutorResource);
  const result = await readExecutor.execute(ctx, new ReadArgs({ path: path31, toolCallId: "" }));
  switch (result.result.case) {
    case "success": {
      const output = result.result.value.output;
      let content = "";
      if (output.case === "content") {
        content = output.value;
      } else if (output.case === "data") {
        content = import_node_buffer9.Buffer.from(output.value).toString("utf8");
      }
      return { exists: true, content };
    }
    case "fileNotFound":
      return { exists: false, content: "" };
    default:
      throw new SandTerminalReadError(
        `terminal file read failed (${result.result.case ?? "unknown"})`
      );
  }
}
async function collectPrependUserMessages(host, recentUserMessages, currentMessageId) {
  if (recentUserMessages == null || recentUserMessages.length === 0) {
    return { prependUserMessages: [], dedupeFloorMessageId: void 0 };
  }
  const state = host.getConversationState();
  const { lastUserMessageId, hasUserTurn } = await findConfirmedUserTurnWatermark(host, state);
  const selected = selectUnconfirmedUserMessages({
    recentUserMessages,
    currentMessageId,
    lastTurnUserMessageId: lastUserMessageId,
    hasConfirmedTurns: hasUserTurn
  });
  const prependUserMessages = selected.map((message) => {
    const addressNote = buildUserMessageAddressNote(message.id);
    const text2 = addressNote.length > 0 ? `${addressNote}
${message.text}` : message.text;
    return new UserMessage({
      text: text2,
      messageId: message.id,
      richText: message.richText != null && message.richText.length > 0 ? message.richText : void 0
    });
  });
  return {
    prependUserMessages,
    dedupeFloorMessageId: lastUserMessageId !== void 0 && lastUserMessageId.length > 0 ? lastUserMessageId : void 0
  };
}

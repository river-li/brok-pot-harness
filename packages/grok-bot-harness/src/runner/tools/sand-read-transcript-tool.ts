var SAND_READ_TRANSCRIPT_TOOL_NAME = "ReadTranscript";
var optionalId = (description9) => external_exports.string().trim().optional().describe(description9);
function presentId(value) {
  return value === void 0 || value.length === 0 ? void 0 : value;
}
var readTranscriptParameters = external_exports.object({
  session_id: optionalId(
    "Read another of your conversations (a session_id from the other active conversations list)."
  ),
  agent_id: optionalId(
    "Read another agent owned by the same user (an agent id from your agent directory)."
  ),
  subagent_id: optionalId(
    "Read a background subagent you dispatched with Task, running or finished (the Agent ID from the Task result)."
  ),
  limit: external_exports.number().int().positive().max(SAND_TRANSCRIPT_MAX_MESSAGES).optional().describe(
    `How many of the newest messages to return (default ${SAND_TRANSCRIPT_DEFAULT_MESSAGES}, max ${SAND_TRANSCRIPT_MAX_MESSAGES}).`
  ),
  before: external_exports.number().int().nonnegative().optional().describe(
    "Page back: return messages that come before this position. Use the `before` value from the previous result."
  )
});
function targetOf(args) {
  const sessionId = presentId(args.session_id);
  const agentId = presentId(args.agent_id);
  const subagentId = presentId(args.subagent_id);
  const named = [
    ...sessionId === void 0 ? [] : [{ kind: "session", sessionId }],
    ...agentId === void 0 ? [] : [{ kind: "agent", agentId }],
    ...subagentId === void 0 ? [] : [{ kind: "subagent", subagentId }]
  ];
  if (named.length > 1) {
    throw new SandToolInputError("Pass at most one of session_id, agent_id, or subagent_id.");
  }
  return named[0] ?? { kind: "self" };
}
function createReadTranscriptTool(deps) {
  return defineCommunicateTool(deps, {
    id: "SEARCH_CONVERSATIONS",
    name: SAND_READ_TRANSCRIPT_TOOL_NAME,
    description: "Read a full transcript: every user message, your replies, your reasoning, and each tool call with its input and result, one JSON object per line, oldest first. With no id it reads this conversation, including what was compacted out of your context, so use it to explain what you did in an earlier turn or routine run. Pass subagent_id for a Task subagent you dispatched, agent_id for another agent the same user owns, or session_id for another of your conversations. Returns the newest messages first; page back with `before`.",
    parameters: readTranscriptParameters,
    execute: async (ctx, args, toolDeps) => {
      const source = await toolDeps.transcriptReader.openTranscript(ctx, targetOf(args));
      if (source.kind === "refused") {
        return source.message;
      }
      if (source.kind === "messages-only") {
        const page = await source.readMessages({
          limit: clampSandTranscriptMessageLimit(args.limit),
          ...args.before === void 0 ? {} : { before: args.before }
        });
        const rendered = renderSandSpokenMessages(page.messages);
        const nextBefore = rendered.omittedOlder ? rendered.firstPosition : page.nextBefore;
        const pagingLine = nextBefore === void 0 ? "This is the start of the conversation." : `Older messages remain: call ReadTranscript again with the same target and before=${nextBefore}.`;
        if (rendered.lines.length === 0) {
          return [
            `No spoken messages in this stretch of ${source.label}; that conversation's tool activity stays private.`,
            pagingLine
          ].join("\n");
        }
        return [
          `Messages of ${source.label}, ${rendered.lines.length} shown. Only what was said there is shared; that conversation's tool activity stays private.`,
          ...rendered.lines,
          pagingLine
        ].join("\n");
      }
      const window2 = await readSandTranscriptWindow({
        ctx,
        blobStore: source.blobStore,
        state: source.state,
        ...args.limit === void 0 ? {} : { limit: args.limit },
        ...args.before === void 0 ? {} : { before: args.before }
      });
      if (window2.lines.length === 0) {
        return window2.totalMessages === 0 ? `No transcript recorded yet for ${source.label}.` : `No readable messages in ${source.label} before position ${window2.endIndex}.`;
      }
      return [
        `Transcript of ${source.label}, positions ${window2.firstIndex}\u2013${window2.endIndex - 1} of ${window2.totalMessages}:`,
        ...window2.lines,
        window2.firstIndex > 0 ? `Older messages remain: call ReadTranscript again with the same target and before=${window2.firstIndex}.` : "This is the start of the transcript."
      ].join("\n");
    }
  });
}

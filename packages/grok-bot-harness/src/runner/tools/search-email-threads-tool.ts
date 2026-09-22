init_zod();
var SEARCH_EMAIL_THREADS_DEFAULT_LIMIT = 10;
var SEARCH_EMAIL_THREADS_MAX_LIMIT = 25;
var SEARCH_EMAIL_THREADS_QUERY_MAX_CHARS = 1e3;
var ISO_TIMESTAMP_HINT = "an ISO 8601 timestamp such as 2026-09-01T00:00:00Z";
var searchEmailThreadsParameters = external_exports.object({
  query: external_exports.string().trim().min(1).max(SEARCH_EMAIL_THREADS_QUERY_MAX_CHARS).describe(
    "What to look for: a topic, a phrase, a name or an address. Matched against subjects and bodies."
  ),
  inbox_email: external_exports.string().trim().optional().describe(
    `Search only this inbox. Must be one of your own addresses (see ${SAND_LIST_EMAIL_INBOXES_TOOL_NAME}); omit to search all of them.`
  ),
  from_address: external_exports.string().trim().optional().describe("Only messages sent from this exact address."),
  after: external_exports.string().trim().optional().describe(`Only messages after this time, ${ISO_TIMESTAMP_HINT}.`),
  before: external_exports.string().trim().optional().describe(`Only messages before this time, ${ISO_TIMESTAMP_HINT}.`),
  limit: external_exports.number().int().min(1).max(SEARCH_EMAIL_THREADS_MAX_LIMIT).optional().catch(void 0).describe(
    `Maximum threads to return (default ${SEARCH_EMAIL_THREADS_DEFAULT_LIMIT}, max ${SEARCH_EMAIL_THREADS_MAX_LIMIT}).`
  ),
  mode: external_exports.enum(SAND_EMAIL_SEARCH_MODES).optional().catch(void 0).describe(
    '"hybrid" (default) blends keyword and meaning and suits most questions. "keyword" is exact-term matching: use it for a quoted phrase, an email address, an order or ticket number. "semantic" matches by meaning only.'
  )
});
var description6 = [
  "Search the email in your inboxes and get back matching conversation threads, newest activity and best match first.",
  `Each thread lists its id, subject, participants, message count, and up to two matching messages with a snippet. To read a whole conversation, call ${SAND_READ_EMAIL_THREAD_TOOL_NAME} with the thread id. Search first; do not guess thread ids.`,
  'Use mode "keyword" for an exact phrase, address or identifier; leave it on "hybrid" otherwise.',
  "Bodies of messages that arrived in the last minute may not be indexed yet, in which case the snippet says so; the message is still listed."
].join("\n");
function parseEmailTimestamp({
  value,
  field
}) {
  if (value === void 0 || value.length === 0) return void 0;
  const ms2 = Date.parse(value);
  if (Number.isNaN(ms2)) {
    throw new SandToolInputError(`${field} must be ${ISO_TIMESTAMP_HINT}; got "${value}".`);
  }
  return ms2;
}
function optionalText(value) {
  return value === void 0 || value.length === 0 ? void 0 : value;
}
function threadLines(thread, index) {
  const subject = thread.subject.trim().length > 0 ? thread.subject.trim() : "(no subject)";
  const lines2 = [
    `${index + 1}. ${subject}`,
    `   thread_id: ${thread.threadId} \xB7 ${thread.messageCount} ${thread.messageCount === 1 ? "message" : "messages"} \xB7 last ${formatEmailTimestamp(thread.lastMessageAtMs)}`
  ];
  if (thread.participants.length > 0) {
    lines2.push(`   participants: ${formatEmailAddresses(thread.participants)}`);
  }
  for (const match2 of thread.matchingMessages) {
    const from2 = match2.from === null ? "unknown sender" : formatEmailAddress(match2.from);
    lines2.push(
      `   - ${formatEmailDirection(match2.direction)} ${formatEmailTimestamp(match2.occurredAtMs)} from ${from2} (message_id ${match2.messageId})`
    );
    lines2.push(
      `     ${match2.snippet === null ? "(body not indexed yet or no longer available)" : match2.snippet}`
    );
  }
  return lines2;
}
function renderEmailThreadSearch(query, threads) {
  if (threads.length === 0) {
    return `No email threads match "${query}". Try different words, a wider time range, or mode "keyword" for an exact address or phrase.`;
  }
  const lines2 = [
    `${threads.length} ${threads.length === 1 ? "thread matches" : "threads match"} "${query}":`
  ];
  threads.forEach((thread, index) => {
    lines2.push(...threadLines(thread, index));
  });
  lines2.push(`Read a conversation with ${SAND_READ_EMAIL_THREAD_TOOL_NAME} and its thread_id.`);
  return lines2.join("\n");
}
async function searchEmailThreads(deps, args) {
  const afterMs = parseEmailTimestamp({ value: args.after, field: "after" });
  const beforeMs = parseEmailTimestamp({ value: args.before, field: "before" });
  if (afterMs !== void 0 && beforeMs !== void 0 && afterMs >= beforeMs) {
    throw new SandToolInputError("after must be earlier than before.");
  }
  const threads = await deps.email.searchThreads({
    query: args.query,
    inboxEmail: optionalText(args.inbox_email),
    fromAddress: optionalText(args.from_address),
    afterMs,
    beforeMs,
    limit: Math.min(
      args.limit ?? SEARCH_EMAIL_THREADS_DEFAULT_LIMIT,
      SEARCH_EMAIL_THREADS_MAX_LIMIT
    ),
    mode: args.mode
  });
  return renderEmailThreadSearch(args.query, threads);
}
function createSearchEmailThreadsTool(deps) {
  return defineCommunicateTool(deps, {
    id: "PLATFORM_ACTION",
    name: SAND_SEARCH_EMAIL_THREADS_TOOL_NAME,
    description: description6,
    parameters: searchEmailThreadsParameters,
    describeActivity: (args) => ({ detail: args.query }),
    execute: async (_ctx, args, d) => searchEmailThreads(d, args)
  });
}

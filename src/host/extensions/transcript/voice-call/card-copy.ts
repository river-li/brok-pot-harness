var import_node_crypto85 = require("node:crypto");
init_dist4();
var VOICE_CALL_CARD_COPY_DEADLINE_MS = 8e3;
async function authorVoiceCallCardCopy({
  record: record2,
  createExecutor,
  deadline
}) {
  const prompt = SandVoiceCallReceipt.prompt(record2);
  if (prompt === void 0) return void 0;
  try {
    const raw = await deadline.run(
      (signal) => streamText2({ executor: createExecutor(), prompt, signal })
    );
    return SandVoiceCallReceipt.parse(raw);
  } catch (error42) {
    reportFallback("voice_call_runtime", error42);
    return void 0;
  }
}
async function streamText2({
  executor,
  prompt,
  signal
}) {
  const [ctx, cancel] = createContext().with(conversationIdKey, (0, import_node_crypto85.randomUUID)()).with(requestIdKey, (0, import_node_crypto85.randomUUID)()).withCancel();
  const abort = () => {
    cancel(new SandRunAbortError({ intentional: false, reason: "voice call card copy deadline" }));
  };
  if (signal.aborted) abort();
  else signal.addEventListener("abort", abort, { once: true });
  try {
    executor.appendMessages([
      { role: "system", content: prompt.system },
      { role: "user", content: prompt.user }
    ]);
    const result = executor.stream(ctx, void 0, void 0, {});
    let text2 = "";
    for await (const part of result.fullStream) {
      if (part.type === "text-delta") {
        text2 += part.textDelta;
      } else if (part.type === "error") {
        throw part.error instanceof Error ? part.error : new Error(String(part.error));
      }
    }
    return text2;
  } finally {
    signal.removeEventListener("abort", abort);
  }
}

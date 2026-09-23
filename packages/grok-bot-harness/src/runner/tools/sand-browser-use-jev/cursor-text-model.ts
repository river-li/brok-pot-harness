init_scheduling();
var TEXT_CALL_DEADLINE_MS = 45e3;
var MIN_OUTPUT_BUDGET_TOKENS = 4096;
var OUTPUT_CAP = /max output tokens/i;
var JSON_SUFFIX = "\n\nRespond with exactly one JSON object and no other text, no code fences.";
var TEXT_DEADLINE = createDeadlinePolicy({
  name: "sand-browser-use-jev-text",
  timeoutMs: TEXT_CALL_DEADLINE_MS
});
function completionMessages(args, content) {
  return [
    { role: "system", content: args.json === true ? `${args.system}${JSON_SUFFIX}` : args.system },
    { role: "user", content }
  ];
}
var CursorTextModel = class {
  label;
  options;
  constructor(options2) {
    this.options = options2;
    this.label = `cursor/${options2.modelId}`;
  }
  complete(args) {
    return this.send(args, args.user);
  }
  completeWithImage(args) {
    return this.send(args, [
      { type: "image", image: args.imagePng, mimeType: "image/png" },
      { type: "text", text: args.user }
    ]);
  }
  async send(args, content) {
    const session = this.options.inference.createSession(() => void 0, {
      ...this.options.session,
      modelId: this.options.modelId
    });
    const executor = session.getExecutor(completionMessages(args, content));
    const result = executor.stream(this.options.ctx, void 0, void 0, {
      maxTokens: Math.max(args.maxTokens ?? 0, MIN_OUTPUT_BUDGET_TOKENS)
    });
    let text2 = "";
    try {
      await TEXT_DEADLINE.run(async (signal) => {
        for await (const part of result.fullStream) {
          if (signal.aborted) return;
          if (part.type === "text-delta") {
            text2 += part.textDelta;
          } else if (part.type === "error") {
            const error42 = part.error instanceof Error ? part.error : new Error(String(part.error));
            if (OUTPUT_CAP.test(error42.message) && text2.length > 0) return;
            throw error42;
          }
        }
      });
    } catch (error42) {
      if (!(error42 instanceof DeadlineExceededError)) throw error42;
      if (text2.length === 0) {
        throw new Error(
          `text model ${this.label} produced nothing within ${String(TEXT_CALL_DEADLINE_MS / 1e3)}s`,
          { cause: error42 }
        );
      }
    }
    return text2;
  }
};

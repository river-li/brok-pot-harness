/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/grok-bot-harness/src/evals/conversation-history.ts
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
function textContent(text2) {
  return new ConversationHistoryTextContent({ text: text2 });
}
function toolArgsJson(args) {
  try {
    JSON.parse(args);
    return args;
  } catch {
    return JSON.stringify(args);
  }
}
function buildSandEvalConversationHistory(request3) {
  if (request3.priorMessages == null || request3.priorMessages.length === 0) return void 0;
  const messages = request3.priorMessages.flatMap((message, messageIndex) => {
    if (message.role === "user")
      return [
        new ConversationHistoryMessage({
          message: {
            case: "user",
            value: new ConversationHistoryUserMessage({
              content: [
                new ConversationHistoryUserContent({
                  content: { case: "text", value: textContent(message.text) }
                })
              ]
            })
          }
        })
      ];
    const toolCalls3 = (message.toolCalls ?? []).map((call, toolCallIndex) => ({
      call,
      id: call.id ?? `${request3.runId}-prior-${messageIndex}-${toolCallIndex}`
    }));
    return [
      new ConversationHistoryMessage({
        message: {
          case: "assistant",
          value: new ConversationHistoryAssistantMessage({
            content: [
              new ConversationHistoryAssistantContent({
                content: { case: "text", value: textContent(message.text) }
              }),
              ...toolCalls3.map(
                ({ call, id }) => new ConversationHistoryAssistantContent({
                  content: {
                    case: "toolCall",
                    value: new ConversationHistoryToolCall({
                      toolCallId: id,
                      toolName: call.name,
                      argsJson: toolArgsJson(call.args)
                    })
                  }
                })
              )
            ]
          })
        }
      }),
      ...toolCalls3.map(
        ({ call, id }) => new ConversationHistoryMessage({
          message: {
            case: "tool",
            value: new ConversationHistoryToolMessage({
              toolCallId: id,
              toolName: call.name,
              content: [
                new ConversationHistoryToolResultContent({
                  content: { case: "text", value: textContent(call.result) }
                })
              ]
            })
          }
        })
      )
    ];
  });
  return new ConversationHistory({ messages, replaceUserInfo: true });
}


var MCP_UNAVAILABLE_REMINDER_MESSAGE = `<system_reminder>
Your MCP tools are temporarily unavailable for this turn: discovering the user's MCP connectors from the backend failed. This does NOT mean the user has no MCP connectors. Do not claim they have none or that a connector is missing; if the user needs an MCP tool, tell them MCP is temporarily unavailable and to retry shortly. Later turns rediscover connectors on their own.
</system_reminder>`;
var McpUnavailableReminderMiddleware = class extends BaseMiddleware {
  constructor(innerExecutor, isUnavailable, episodeId) {
    super(innerExecutor);
    this.isUnavailable = isUnavailable;
    this.episodeId = episodeId;
  }
  isUnavailable;
  episodeId;
  stream(ctx, invocationId, tools, options2) {
    if (this.isUnavailable()) {
      const alreadyInjected = this.innerExecutor.getMessages().some(
        (message) => message.providerOptions?.cursor?.sandMcpUnavailableReminderEpisodeId === this.episodeId
      );
      if (!alreadyInjected) {
        this.innerExecutor.appendMessages({
          role: "user",
          content: MCP_UNAVAILABLE_REMINDER_MESSAGE,
          providerOptions: {
            cursor: {
              sandMcpUnavailableReminder: true,
              sandMcpUnavailableReminderEpisodeId: this.episodeId
            }
          }
        });
      }
    }
    return this.innerExecutor.stream(ctx, invocationId, tools, options2);
  }
};
function createMcpUnavailableReminderMiddleware(args) {
  return (executor) => new McpUnavailableReminderMiddleware(executor, args.isUnavailable, args.episodeId);
}

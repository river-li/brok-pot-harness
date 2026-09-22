/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/host/extensions/auto-review/sand-backend-smart-mode-classifier-exec.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_smart_mode_classifier_exec_pb();
init_dashboard_connect();
init_dashboard_pb();
init_errors();
init_cursor_inference();
var SandSmartModeClassifierError = class extends SandDomainError {
  name = "SandSmartModeClassifierError";
};
function createSandBackendSmartModeClassifierExecutor(options2, client = createSandCursorBackendClient(DashboardService, options2)) {
  return {
    async execute(ctx, args) {
      const attemptIndex = ctx.get(smartModeClassifierAttemptIndexKey);
      const mode = ctx.get(smartModeClassifierModeKey) ?? "enforce";
      const turnRequestId = ctx.get(requestIdKey) ?? ctx.get(requestIdKey2);
      const response = await client.classifySandAutoReview(
        new ClassifySandAutoReviewRequest({
          args: new SmartModeClassifierArgs({
            target: args.target,
            conversationContext: args.conversationContext,
            parentConversationId: args.parentConversationId
          }),
          attemptIndex,
          mode
        }),
        {
          signal: ctx.signal,
          ...turnRequestId == null || turnRequestId === "" ? {} : { headers: { "x-request-id": turnRequestId } }
        }
      );
      if (response.result === void 0) {
        throw new SandSmartModeClassifierError("ClassifySandAutoReview returned no result");
      }
      return response.result;
    }
  };
}


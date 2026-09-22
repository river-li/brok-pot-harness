/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/grok-bot-harness/src/runner/steer/turn-steer.ts
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
function buildSteerUserMessage(prompt, options2) {
  return new UserMessage({
    text: options2.hidden === true ? `${SAND_HIDDEN_PROMPT_MARKER}${prompt}` : prompt,
    messageId: `${SAND_OFF_RECORD_MESSAGE_ID_PREFIX}${crypto.randomUUID()}`
  });
}
var SandSteerInbox = class {
  pending = [];
  poppedAwaitingTurn;
  admittedListeners = /* @__PURE__ */ new Set();
  accepting = false;
  beginRun() {
    this.accepting = true;
  }
  enqueue(prompt, options2) {
    if (!this.accepting) return { kind: "no-live-run" };
    const delivered = new Promise((settle) => {
      this.pending.push({
        action: new ConversationAction({
          action: {
            case: "userMessageAction",
            value: new UserMessageAction({
              userMessage: buildSteerUserMessage(prompt, options2)
            })
          }
        }),
        settle
      });
    });
    for (const listener of [...this.admittedListeners]) listener();
    return { kind: "steered", deliveredAtStepBoundary: delivered };
  }
  receiver(privacyMode) {
    const toolSignal = {
      hasPendingUserInjections: () => this.pending.length > 0,
      onUserInjectionAdmitted: (listener) => {
        this.admittedListeners.add(listener);
        return () => void this.admittedListeners.delete(listener);
      }
    };
    return {
      peek: (_ctx) => {
        this.settlePoppedAsDelivered();
        const head = this.pending[0];
        return Promise.resolve(
          head === void 0 ? void 0 : toRedactedConversationAction(head.action, privacyMode)
        );
      },
      pop: (_ctx) => {
        this.settlePoppedAsDelivered();
        const head = this.pending.shift();
        if (head === void 0) return Promise.resolve(void 0);
        this.poppedAwaitingTurn = head;
        return Promise.resolve(toRedactedConversationAction(head.action, privacyMode));
      },
      peekIsClaimedInjection: () => this.pending[0] !== void 0,
      failConsumedInjectionDelivery: () => {
        const popped = this.poppedAwaitingTurn;
        if (popped === void 0) return false;
        this.poppedAwaitingTurn = void 0;
        this.pending.unshift(popped);
        return true;
      },
      getContextInjectionToolSignal: () => toolSignal
    };
  }
  endRun() {
    this.settlePoppedAsDelivered();
    this.accepting = false;
    for (const steer of this.pending.splice(0)) steer.settle(false);
  }
  settlePoppedAsDelivered() {
    this.poppedAwaitingTurn?.settle(true);
    this.poppedAwaitingTurn = void 0;
  }
};


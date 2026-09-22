/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/proto/dist/generated/aiserver/v1/inference_connect.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_esm();
var InferenceService = {
  typeName: "aiserver.v1.InferenceService",
  methods: {
    /**
     * Stream executes a prompt with optional tools and returns a stream of results.
     * This mirrors the PromptExecutor.stream() method from @anysphere/chat-inference.
     *
     * @generated from rpc aiserver.v1.InferenceService.Stream
     */
    stream: {
      name: "Stream",
      I: InferenceStreamRequest,
      O: InferenceStreamResponse,
      kind: MethodKind.ServerStreaming
    },
    /**
     * RecordAgentFollowupClassification categorizes the user's follow-up message in an agent conversation
     * and records the result for analytics/tracking purposes.
     * This is used to determine if the user is dissatisfied, asking for more, starting a new task, etc.
     * Clients that run the agent loop themselves (Claude Code, Sand) call this at turn start.
     * Domain (task metadata) and issue (implicit-feedback) labeling are chained from AFC results.
     *
     * @generated from rpc aiserver.v1.InferenceService.RecordAgentFollowupClassification
     */
    recordAgentFollowupClassification: {
      name: "RecordAgentFollowupClassification",
      I: AgentFollowupCategorizationRequest,
      O: Empty,
      kind: MethodKind.Unary
    },
    /**
     * RecordAgentPostTurnLabeling runs post-turn safety and defect classifiers for clients that
     * run the agent loop themselves (e.g. Sand) and therefore do not go through the agent-server
     * categorization middleware. Call after the assistant turn has completed so the labelers see
     * the finished response.
     *
     * @generated from rpc aiserver.v1.InferenceService.RecordAgentPostTurnLabeling
     */
    recordAgentPostTurnLabeling: {
      name: "RecordAgentPostTurnLabeling",
      I: AgentPostTurnLabelingRequest,
      O: Empty,
      kind: MethodKind.Unary
    },
    /**
     * RunInference hosts one attempt of a client-run ("local") agent loop.
     *
     * The client sends run_request exactly once; the server performs the same
     * auth, usage admission, and model-allocation sequence as a backend agent
     * run (AgentService.Run) — including Auto / Auto Smart routing — and
     * replies with run_ready carrying the resolved model. The client then
     * drives any number of possibly-concurrent model calls via invoke_model;
     * each server frame is tagged with the invocation id it belongs to.
     *
     * Run-scoped billing lives on this RPC: usage admission happens exactly
     * once per stream, a mid-request usage monitor runs for the stream's
     * lifetime, and abort-before-output refund semantics match
     * AgentService.Run. One RunInference stream = one agent-run attempt;
     * retrying an attempt means opening a new stream (which re-admits, exactly
     * like retrying AgentService.Run).
     *
     * @generated from rpc aiserver.v1.InferenceService.RunInference
     */
    runInference: {
      name: "RunInference",
      I: RunInferenceClientMessage,
      O: RunInferenceServerMessage,
      kind: MethodKind.BiDiStreaming
    }
  }
};


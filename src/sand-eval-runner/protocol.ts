init_zod();
var SAND_EVAL_RUNNER_PROTOCOL_VERSION = 1;
var modelParameterSchema = external_exports.object({
  id: external_exports.string().min(1),
  value: external_exports.string()
});
var modelSchema = external_exports.object({
  modelId: external_exports.string().min(1),
  maxMode: external_exports.boolean(),
  parameters: external_exports.array(modelParameterSchema)
});
var requestContextSchema = external_exports.object({
  osVersion: external_exports.string().min(1).optional(),
  shell: external_exports.string().min(1).optional(),
  timeZone: external_exports.string().min(1).optional(),
  userFullName: external_exports.string().min(1).optional(),
  simulatedTime: external_exports.string().datetime({ offset: true }).optional()
});
var selectedImageSchema = external_exports.object({
  dataBase64: external_exports.string().min(1),
  mimeType: external_exports.string().min(1).optional()
});
var priorToolCallSchema = external_exports.object({
  id: external_exports.string().min(1).optional(),
  name: external_exports.string().min(1),
  args: external_exports.string(),
  result: external_exports.string()
});
var priorMessageSchema = external_exports.object({
  role: external_exports.enum(SAND_MESSAGE_ROLES),
  text: external_exports.string().min(1),
  toolCalls: external_exports.array(priorToolCallSchema).optional()
});
var desktopSchema = external_exports.object({
  display: external_exports.string().min(1)
});
var toolIdentifierSchema = external_exports.custom(
  (value) => typeof value === "string" && value.length > 0
);
var inferenceRequestContextSchema = external_exports.object({
  workload: external_exports.string().min(1),
  jobId: external_exports.string().min(1),
  user: external_exports.string().min(1),
  trafficType: external_exports.string().min(1).optional(),
  provider429RetryPolicy: external_exports.string().min(1).optional()
});
var sandEvalRunnerRequestSchema = external_exports.object({
  protocolVersion: external_exports.literal(SAND_EVAL_RUNNER_PROTOCOL_VERSION),
  runId: external_exports.string().min(1),
  prompt: external_exports.string().min(1),
  priorMessages: external_exports.array(priorMessageSchema).optional(),
  workspacePath: external_exports.string().min(1),
  model: modelSchema,
  selectedImages: external_exports.array(selectedImageSchema).optional(),
  mcpConfigPath: external_exports.string().min(1).optional(),
  requestContext: requestContextSchema.optional(),
  systemPrompt: external_exports.string().optional(),
  desktop: desktopSchema.optional(),
  webSearchFixtures: sandEvalWebSearchFixtureConfigSchema.optional(),
  disabledToolIdentifiers: external_exports.array(toolIdentifierSchema).optional(),
  inferenceRequestContext: inferenceRequestContextSchema.optional()
});
function serializeSandEvalRunnerError(error3) {
  if (error3 instanceof Error) {
    return {
      name: error3.name,
      message: error3.message,
      ...error3.stack != null ? { stack: error3.stack } : {}
    };
  }
  return {
    name: "Error",
    message: String(error3)
  };
}
function createSandEvalRunnerFailureResult(runId, error3, priorResult) {
  return {
    ...priorResult ?? {
      protocolVersion: SAND_EVAL_RUNNER_PROTOCOL_VERSION,
      runId,
      finalAssistantMessage: "",
      sentMessageCount: 0,
      reacted: false,
      toolCalls: [],
      updates: [],
      turnMessages: [],
      inferenceRequestIds: []
    },
    status: "failed",
    error: serializeSandEvalRunnerError(error3)
  };
}

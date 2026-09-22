/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/agent-kv/dist/agent-store.js
 * Bundle: sand-host/agent-isolation/agent-store-worker.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var AgentModes = ["default", "plan", "debug", "search"];
var ApprovalModeSettings = ["allowlist", "unrestricted", "auto-review"];
var agentModeSet = new Set(AgentModes);
var approvalModeSettingSet = new Set(ApprovalModeSettings);
var todoItemSerde = new ProtoSerde(TodoItem);
var userMessageSerde = new ProtoSerde(UserMessage);
var conversationStepSerde = new ProtoSerde(ConversationStep);
var conversationTurnStructureSerde = new ProtoSerde(ConversationTurnStructure);
var conversationSummarySerde = new ProtoSerde(ConversationSummary);
var shellCommandSerde = new ProtoSerde(ShellCommand);
var shellOutputSerde = new ProtoSerde(ShellOutput);


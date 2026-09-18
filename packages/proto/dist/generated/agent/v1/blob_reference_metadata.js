var BLOB_REFERENCE_METADATA_BY_MESSAGE_ID = {
  "agent.v1.AgentConversationTurnStructure": {
    messageType: "agent.v1.AgentConversationTurnStructure",
    fields: [
      { protoFieldName: "user_message", localFieldName: "userMessage", fieldNumber: 1, blobReferenceType: "agent.v1.UserMessage" },
      { protoFieldName: "steps", localFieldName: "steps", fieldNumber: 2, blobReferenceType: "agent.v1.ConversationStep" }
    ]
  },
  "agent.v1.ConversationStateStructure": {
    messageType: "agent.v1.ConversationStateStructure",
    fields: [
      { protoFieldName: "root_prompt_messages_json", localFieldName: "rootPromptMessagesJson", fieldNumber: 1, blobReferenceType: "json" },
      { protoFieldName: "todos", localFieldName: "todos", fieldNumber: 3, blobReferenceType: "agent.v1.TodoItem" },
      { protoFieldName: "summary", localFieldName: "summary", fieldNumber: 6, blobReferenceType: "agent.v1.ConversationSummary" },
      { protoFieldName: "plan", localFieldName: "plan", fieldNumber: 7, blobReferenceType: "agent.v1.ConversationPlan" },
      { protoFieldName: "turns", localFieldName: "turns", fieldNumber: 8, blobReferenceType: "agent.v1.ConversationTurnStructure" },
      { protoFieldName: "summary_archive", localFieldName: "summaryArchive", fieldNumber: 11, blobReferenceType: "agent.v1.ConversationSummaryArchive" },
      { protoFieldName: "file_states", localFieldName: "fileStates", fieldNumber: 12, blobReferenceType: "agent.v1.FileState" },
      { protoFieldName: "summary_archives", localFieldName: "summaryArchives", fieldNumber: 13, blobReferenceType: "agent.v1.ConversationSummaryArchive" },
      { protoFieldName: "subagent_state_refs", localFieldName: "subagentStateRefs", fieldNumber: 31, blobReferenceType: "agent.v1.SubagentPersistedState" }
    ]
  },
  "agent.v1.ConversationSummaryArchive": {
    messageType: "agent.v1.ConversationSummaryArchive",
    fields: [
      { protoFieldName: "summarized_messages", localFieldName: "summarizedMessages", fieldNumber: 1, blobReferenceType: "json" },
      { protoFieldName: "summary_message", localFieldName: "summaryMessage", fieldNumber: 4, blobReferenceType: "json" }
    ]
  },
  "agent.v1.ExtraContextEntry": {
    messageType: "agent.v1.ExtraContextEntry",
    fields: [
      { protoFieldName: "blob_id", localFieldName: "blobId", fieldNumber: 2, blobReferenceType: "string" }
    ]
  },
  "agent.v1.FileStateStructure": {
    messageType: "agent.v1.FileStateStructure",
    fields: [
      { protoFieldName: "content", localFieldName: "content", fieldNumber: 1, blobReferenceType: "string" },
      { protoFieldName: "initial_content", localFieldName: "initialContent", fieldNumber: 2, blobReferenceType: "string" }
    ]
  },
  "agent.v1.GetBlobArgs": {
    messageType: "agent.v1.GetBlobArgs",
    fields: [
      { protoFieldName: "blob_id", localFieldName: "blobId", fieldNumber: 1, blobReferenceType: "bytes" }
    ]
  },
  "agent.v1.InvocationContext": {
    messageType: "agent.v1.InvocationContext",
    fields: [
      { protoFieldName: "blob_id", localFieldName: "blobId", fieldNumber: 10, blobReferenceType: "agent.v1.InvocationContext" }
    ]
  },
  "agent.v1.PreFetchedBlob": {
    messageType: "agent.v1.PreFetchedBlob",
    fields: [
      { protoFieldName: "id", localFieldName: "id", fieldNumber: 1, blobReferenceType: "bytes" }
    ]
  },
  "agent.v1.ReadSuccess": {
    messageType: "agent.v1.ReadSuccess",
    fields: [
      { protoFieldName: "output_blob_id", localFieldName: "outputBlobId", fieldNumber: 7, blobReferenceType: "bytes" }
    ]
  },
  "agent.v1.ReadToolSuccess": {
    messageType: "agent.v1.ReadToolSuccess",
    fields: [
      { protoFieldName: "data_blob_id", localFieldName: "dataBlobId", fieldNumber: 9, blobReferenceType: "bytes" },
      { protoFieldName: "content_blob_id", localFieldName: "contentBlobId", fieldNumber: 10, blobReferenceType: "string" }
    ]
  },
  "agent.v1.RequestContextPartReferences": {
    messageType: "agent.v1.RequestContextPartReferences",
    fields: [
      { protoFieldName: "rules_blob_id", localFieldName: "rulesBlobId", fieldNumber: 1, blobReferenceType: "agent.v1.RequestContextRulesPart" },
      { protoFieldName: "skills_blob_id", localFieldName: "skillsBlobId", fieldNumber: 3, blobReferenceType: "agent.v1.RequestContextSkillsPart" },
      { protoFieldName: "subagents_blob_id", localFieldName: "subagentsBlobId", fieldNumber: 5, blobReferenceType: "agent.v1.RequestContextSubagentsPart" },
      { protoFieldName: "mcps_blob_id", localFieldName: "mcpsBlobId", fieldNumber: 7, blobReferenceType: "agent.v1.RequestContextMcpsPart" }
    ]
  },
  "agent.v1.SelectedDocument": {
    messageType: "agent.v1.SelectedDocument",
    fields: [
      { protoFieldName: "blob_id", localFieldName: "blobId", fieldNumber: 1, blobReferenceType: "bytes" }
    ]
  },
  "agent.v1.SelectedDocument.BlobIdWithData": {
    messageType: "agent.v1.SelectedDocument.BlobIdWithData",
    fields: [
      { protoFieldName: "blob_id", localFieldName: "blobId", fieldNumber: 1, blobReferenceType: "bytes" }
    ]
  },
  "agent.v1.SelectedExternalLink": {
    messageType: "agent.v1.SelectedExternalLink",
    fields: [
      { protoFieldName: "blob_id", localFieldName: "blobId", fieldNumber: 6, blobReferenceType: "string" }
    ]
  },
  "agent.v1.SelectedGitPRDiffSelection": {
    messageType: "agent.v1.SelectedGitPRDiffSelection",
    fields: [
      { protoFieldName: "blob_id", localFieldName: "blobId", fieldNumber: 6, blobReferenceType: "agent.v1.SelectedGitPRDiffSelection" }
    ]
  },
  "agent.v1.SelectedImage": {
    messageType: "agent.v1.SelectedImage",
    fields: [
      { protoFieldName: "blob_id", localFieldName: "blobId", fieldNumber: 1, blobReferenceType: "bytes" }
    ]
  },
  "agent.v1.SelectedImage.BlobIdWithData": {
    messageType: "agent.v1.SelectedImage.BlobIdWithData",
    fields: [
      { protoFieldName: "blob_id", localFieldName: "blobId", fieldNumber: 1, blobReferenceType: "bytes" }
    ]
  },
  "agent.v1.SelectedPullRequest": {
    messageType: "agent.v1.SelectedPullRequest",
    fields: [
      { protoFieldName: "blob_id", localFieldName: "blobId", fieldNumber: 7, blobReferenceType: "agent.v1.SelectedPullRequest" }
    ]
  },
  "agent.v1.SelectedVideo": {
    messageType: "agent.v1.SelectedVideo",
    fields: [
      { protoFieldName: "blob_id", localFieldName: "blobId", fieldNumber: 1, blobReferenceType: "bytes" }
    ]
  },
  "agent.v1.SelectedVideo.BlobIdWithData": {
    messageType: "agent.v1.SelectedVideo.BlobIdWithData",
    fields: [
      { protoFieldName: "blob_id", localFieldName: "blobId", fieldNumber: 1, blobReferenceType: "bytes" }
    ]
  },
  "agent.v1.SetBlobArgs": {
    messageType: "agent.v1.SetBlobArgs",
    fields: [
      { protoFieldName: "blob_id", localFieldName: "blobId", fieldNumber: 1, blobReferenceType: "bytes" }
    ]
  },
  "agent.v1.ShellConversationTurnStructure": {
    messageType: "agent.v1.ShellConversationTurnStructure",
    fields: [
      { protoFieldName: "shell_command", localFieldName: "shellCommand", fieldNumber: 1, blobReferenceType: "agent.v1.ShellCommand" },
      { protoFieldName: "shell_output", localFieldName: "shellOutput", fieldNumber: 2, blobReferenceType: "agent.v1.ShellOutput" }
    ]
  },
  "agent.v1.TruncatedToolCall": {
    messageType: "agent.v1.TruncatedToolCall",
    fields: [
      { protoFieldName: "original_step_blob_id", localFieldName: "originalStepBlobId", fieldNumber: 1, blobReferenceType: "agent.v1.ConversationStep" }
    ]
  },
  "agent.v1.UserMessage": {
    messageType: "agent.v1.UserMessage",
    fields: [
      { protoFieldName: "conversation_state_blob_id", localFieldName: "conversationStateBlobId", fieldNumber: 10, blobReferenceType: "agent.v1.ConversationStateStructure" },
      { protoFieldName: "text_blob_id", localFieldName: "textBlobId", fieldNumber: 18, blobReferenceType: "string" },
      { protoFieldName: "rich_text_blob_id", localFieldName: "richTextBlobId", fieldNumber: 19, blobReferenceType: "string" }
    ]
  }
};
function getBlobReferenceMessageMetadata(messageType) {
  if (!Object.prototype.hasOwnProperty.call(BLOB_REFERENCE_METADATA_BY_MESSAGE_ID, messageType)) {
    return void 0;
  }
  return BLOB_REFERENCE_METADATA_BY_MESSAGE_ID[messageType];
}
var BLOB_REFERENCE_MESSAGE_TYPE_BY_NAME = {
  "agent.v1.ConversationPlan": ConversationPlan,
  "agent.v1.ConversationStateStructure": ConversationStateStructure,
  "agent.v1.ConversationStep": ConversationStep,
  "agent.v1.ConversationSummary": ConversationSummary,
  "agent.v1.ConversationSummaryArchive": ConversationSummaryArchive,
  "agent.v1.ConversationTurnStructure": ConversationTurnStructure,
  "agent.v1.FileState": FileState,
  "agent.v1.InvocationContext": InvocationContext,
  "agent.v1.RequestContextMcpsPart": RequestContextMcpsPart,
  "agent.v1.RequestContextRulesPart": RequestContextRulesPart,
  "agent.v1.RequestContextSkillsPart": RequestContextSkillsPart,
  "agent.v1.RequestContextSubagentsPart": RequestContextSubagentsPart,
  "agent.v1.SelectedGitPRDiffSelection": SelectedGitPRDiffSelection,
  "agent.v1.SelectedPullRequest": SelectedPullRequest,
  "agent.v1.ShellCommand": ShellCommand,
  "agent.v1.ShellOutput": ShellOutput,
  "agent.v1.SubagentPersistedState": SubagentPersistedState,
  "agent.v1.TodoItem": TodoItem,
  "agent.v1.UserMessage": UserMessage
};
function isProtoBlobReferenceTypeName(blobReferenceType) {
  return Object.prototype.hasOwnProperty.call(BLOB_REFERENCE_MESSAGE_TYPE_BY_NAME, blobReferenceType);
}

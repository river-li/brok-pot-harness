init_agent_pb();
function formatMetaAgentNotesDirectoryInstruction(notesDirectory) {
  return `Write notes which may be useful for other agents working on the same problem to the ${notesDirectory}. If relevant note files already exist, read them and consider extending them.

Use informatively named files to make the notes easily navigable. Group notes about similar concepts underneath the same directories. Focus on information related to the design or implementation of the system which is likely to be helpful to other agents in the future.

If you write to note file(s), reference the key note(s) in your responses to the user.`;
}
function isMetaAgentNotesEnabled(featureFlags) {
  return featureFlags?.metaAgentNotes === true;
}
function buildRequestContextNotesOptions(config2) {
  return {
    // Preserve pre-meta behavior for non-meta sessions by falling back to
    // conversationId when notesSessionId is not explicitly set.
    notesSessionId: config2.notesSessionId ?? config2.conversationId,
    metaAgentNotesEnabled: isMetaAgentNotesEnabled(config2.featureFlags)
  };
}
function buildRequestContextOptions(config2) {
  return {
    ...buildRequestContextNotesOptions(config2),
    actorIdentity: config2.actorIdentity
  };
}
function buildUserInfoAgentNotesProps(config2, mode, env) {
  const includeAgentNotesPaths = mode === AgentMode.PROJECT || config2.enableAgentNotes !== false;
  const baseProps = buildRequestContextNotesOptions(config2);
  if (!includeAgentNotesPaths) {
    return baseProps;
  }
  if (mode === AgentMode.PROJECT) {
    return {
      ...baseProps,
      agentConversationNotesFolder: env?.agentConversationNotesFolder
    };
  }
  return {
    ...baseProps,
    agentSharedNotesFolder: env?.agentSharedNotesFolder,
    agentConversationNotesFolder: env?.agentConversationNotesFolder
  };
}

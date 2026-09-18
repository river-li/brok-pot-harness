var conversationSearchExecutorResource = createResource((execManager) => new ExecutorResource(execManager, createServerSerializer("conversationSearchArgs"), createClientDeserializer("conversationSearchResult")), (implementation, controlledExecManager) => {
  controlledExecManager.register(new SimpleControlledExecHandler(implementation, createServerDeserializer("conversationSearchArgs"), createClientSerializer("conversationSearchResult")));
});

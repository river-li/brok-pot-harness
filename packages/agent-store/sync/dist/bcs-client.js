init_agent_store_pb();
var AgentStoreUnauthorizedError = class extends Error {
  constructor(message = "Agent store token is unauthorized") {
    super(message);
    this.name = "AgentStoreUnauthorizedError";
  }
};
var AgentStoreDirectoryNotEmptyError = class extends Error {
  constructor(message = "Agent store directory is not empty") {
    super(message);
    this.name = "AgentStoreDirectoryNotEmptyError";
  }
};
var AgentStoreDirectoryListingError = class extends Error {
  constructor(message) {
    super(message);
    this.name = "AgentStoreDirectoryListingError";
  }
};
var AgentStoreProtocolError = class extends Error {
  constructor(message) {
    super(message);
    this.name = "AgentStoreProtocolError";
  }
};

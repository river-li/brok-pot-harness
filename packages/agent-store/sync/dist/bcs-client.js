/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/agent-store/sync/dist/bcs-client.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
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


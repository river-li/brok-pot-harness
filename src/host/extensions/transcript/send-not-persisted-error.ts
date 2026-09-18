init_errors();
var SandSendNotPersistedError = class extends SandDomainError {
  name = "SandSendNotPersistedError";
  constructor() {
    super(
      "Sand send could not persist to the addressed agent's store (db locked or closed); rejecting so the client retry is not swallowed."
    );
  }
};

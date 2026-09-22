/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/host/extensions/transcript/send-not-persisted-error.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_errors();
var SandSendNotPersistedError = class extends SandDomainError {
  name = "SandSendNotPersistedError";
  constructor() {
    super(
      "Sand send could not persist to the addressed agent's store (db locked or closed); rejecting so the client retry is not swallowed."
    );
  }
};


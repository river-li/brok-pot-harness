/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/host/extensions/box-store-sync/box-store-sync-error.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_errors();
var SandBoxStoreSyncError = class extends SandDomainError {
  name = "SandBoxStoreSyncError";
  copyInFailureCode;
  httpStatus;
  constructor(message, options2) {
    super(message, options2);
    this.copyInFailureCode = options2?.copyInFailureCode;
    this.httpStatus = options2?.httpStatus;
  }
};
var SandBoxStoreBlobHashMismatchError = class extends SandBoxStoreSyncError {
  name = "SandBoxStoreBlobHashMismatchError";
  code = "BLOB_HASH_MISMATCH";
  constructor() {
    super("Content-addressed object path does not match its payload SHA-256");
  }
};


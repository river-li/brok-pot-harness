/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/host/extensions/box-store-sync/object-store-port.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_errors();
var BoxStoreCanonicalWriteConflictError = class extends SandDomainError {
  name = "BoxStoreCanonicalWriteConflictError";
  key;
  conflictRelPath;
  baseEtag;
  baselineSource;
  constructor(args) {
    super(
      args.conflictRelPath == null ? `canonical write for ${args.key} lost a concurrent-write race` : `agent-store write for ${args.key} lost a concurrent-write race; content preserved at ${args.conflictRelPath}`
    );
    this.key = args.key;
    this.conflictRelPath = args.conflictRelPath;
    this.baseEtag = args.baseEtag ?? null;
    this.baselineSource = args.baselineSource ?? null;
  }
};


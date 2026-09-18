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

init_errors();
var SandMcpConfigError = class extends SandDomainError {
  constructor(message, failure2) {
    super(message);
    this.failure = failure2;
  }
  failure;
  name = "SandMcpConfigError";
};

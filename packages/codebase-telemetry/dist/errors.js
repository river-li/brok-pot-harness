var CodebaseTelemetryCleanupError = class extends AggregateError {
  constructor(errors, message, options2) {
    super(errors, message, options2);
    this.name = "CodebaseTelemetryCleanupError";
  }
};
function toNonEmptyErrors(errors) {
  if (errors.length === 0) {
    return void 0;
  }
  const [firstError, ...remainingErrors] = errors;
  return [firstError, ...remainingErrors];
}

var validateAfterMCPExecutionResponse = (value) => {
  const base = validateBaseHookResponse(value);
  if (!base.isValid) {
    return base;
  }
  return base;
};

var validatePostToolUseResponse = (value) => {
  const errors = [];
  const base = validateBaseHookResponse(value);
  if (!base.isValid) {
    return base;
  }
  validateOptionalString(value.additional_context, "additional_context", errors);
  return createValidationResult(errors.length === 0, errors);
};

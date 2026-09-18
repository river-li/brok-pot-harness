var validateBeforePromptSubmitResponse = (value) => {
  const baseValidation = validateBaseHookResponse(value);
  if (!baseValidation.isValid) {
    return baseValidation;
  }
  const errors = [];
  if (value.continue !== void 0 && typeof value.continue !== "boolean") {
    errors.push("continue must be a boolean if provided");
  }
  if (value.user_message !== void 0 && typeof value.user_message !== "string") {
    errors.push("user_message must be a string if provided");
  }
  if (value.additional_context !== void 0 && !isString2(value.additional_context)) {
    errors.push("additional_context must be a string if provided");
  }
  return createValidationResult(errors.length === 0, errors);
};

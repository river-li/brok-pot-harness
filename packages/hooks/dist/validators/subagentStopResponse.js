var validateSubagentStopResponse = (value) => {
  const baseValidation = validateBaseHookResponse(value);
  if (!baseValidation.isValid) {
    return baseValidation;
  }
  const errors = [];
  if (value !== void 0 && typeof value === "object" && value !== null && value.followup_message !== void 0 && typeof value.followup_message !== "string") {
    errors.push("followup_message must be a string if provided");
  }
  return createValidationResult(errors.length === 0, errors);
};

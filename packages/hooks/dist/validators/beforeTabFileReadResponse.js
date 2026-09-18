var validateBeforeTabFileReadResponse = (value) => {
  const errors = [];
  const baseValidation = validateBaseHookResponse(value);
  if (!baseValidation.isValid) {
    return baseValidation;
  }
  if (value.permission !== void 0) {
    const validPermissions = ["allow", "deny"];
    if (!validPermissions.includes(value.permission)) {
      errors.push(`Invalid permission value. Expected one of: ${validPermissions.join(", ")}, or undefined`);
    }
  }
  if (value.user_message !== void 0 && typeof value.user_message !== "string") {
    errors.push("user_message must be a string if provided");
  }
  return createValidationResult(errors.length === 0, errors);
};

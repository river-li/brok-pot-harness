var validateBaseHookResponse = (value) => {
  const errors = [];
  if (!isObject2(value)) {
    errors.push("Expected an object");
    return createValidationResult(false, errors);
  }
  return createValidationResult(true);
};

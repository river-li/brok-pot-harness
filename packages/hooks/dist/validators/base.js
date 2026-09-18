var isString2 = (value) => typeof value === "string";
var isObject2 = (value) => value !== null && typeof value === "object" && !Array.isArray(value);
var createValidationResult = (isValid3, errors = []) => ({
  isValid: isValid3,
  errors
});
function validateOptionalString(value, fieldName, errors) {
  if (value !== void 0 && !isString2(value)) {
    errors.push(`${fieldName} must be a string if provided`);
  }
}

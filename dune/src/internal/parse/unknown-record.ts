function isUnknownRecord2(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

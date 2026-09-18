function ensureFinitePositive({ value, name: name17, context: context2 }) {
  if (!Number.isFinite(value) || value <= 0) {
    throw new RangeError(`${context2} ${name17} must be a finite positive number, got ${value}`);
  }
  return value;
}

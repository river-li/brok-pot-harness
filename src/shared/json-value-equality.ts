init_unknown_record();
function hasPlainPrototype(value) {
  const proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
}
function areJsonValuesEqual(a, b2) {
  if (Object.is(a, b2)) return true;
  if (Array.isArray(a)) {
    if (!Array.isArray(b2) || a.length !== b2.length) return false;
    return a.every((item, index) => areJsonValuesEqual(item, b2[index]));
  }
  if (!isUnknownRecord(a) || !isUnknownRecord(b2)) return false;
  if (!hasPlainPrototype(a) || !hasPlainPrototype(b2)) return false;
  const keysA = Object.keys(a).filter((key) => a[key] !== void 0);
  const keysB = Object.keys(b2).filter((key) => b2[key] !== void 0);
  if (keysA.length !== keysB.length) return false;
  return keysA.every(
    (key) => Object.hasOwn(b2, key) && b2[key] !== void 0 && areJsonValuesEqual(a[key], b2[key])
  );
}

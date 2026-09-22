/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/grok-bot-harness/src/runner/struct-from-record.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_esm();
function structFromRecord(record2) {
  return Struct.fromJson(jsonObjectFrom(record2, ""));
}
function jsonObjectFrom(record2, path31) {
  const result = {};
  for (const [key, value] of Object.entries(record2)) {
    if (value === void 0) continue;
    result[key] = jsonValueFrom(value, path31 === "" ? key : `${path31}.${key}`);
  }
  return result;
}
function jsonValueFrom(value, path31) {
  if (value === null) return null;
  switch (typeof value) {
    case "string":
    case "boolean":
      return value;
    case "number":
      if (!Number.isFinite(value)) {
        throw new TypeError(`${path31} is a non-finite number; a Struct cannot carry it`);
      }
      return value;
    case "object":
      break;
    default:
      throw new TypeError(`${path31} is a ${typeof value}; a Struct cannot carry it`);
  }
  if (Array.isArray(value)) {
    return value.map(
      (entry, index) => entry === void 0 ? null : jsonValueFrom(entry, `${path31}[${index}]`)
    );
  }
  const prototype = Object.getPrototypeOf(value);
  if (prototype !== Object.prototype && prototype !== null) {
    throw new TypeError(`${path31} is not a plain object; a Struct cannot carry it`);
  }
  return jsonObjectFrom(value, path31);
}


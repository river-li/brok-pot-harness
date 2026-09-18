function describeReceived(value) {
  if (value === null) return "null";
  if (Array.isArray(value)) return "array";
  return typeof value;
}
function failed(path31, expected, value) {
  return { ok: false, path: path31, expected, received: describeReceived(value) };
}
function isOptionalValidator(validator2) {
  return validator2.optional === true;
}
function toValidator(expects, check2) {
  return {
    expects,
    check: check2,
    "~standard": {
      version: 1,
      vendor: "dune",
      validate: (value) => {
        const result = check2(value, []);
        return result.ok ? { value: result.value } : {
          issues: [
            {
              message: `must be ${result.expected}, got ${result.received}`,
              path: result.path
            }
          ]
        };
      }
    }
  };
}
function checkRpcFields(fields2, value, path31) {
  if (!isUnknownRecord2(value)) return failed(path31, "object", value);
  const entries = [];
  for (const [key, validator2] of Object.entries(fields2)) {
    const raw = Object.hasOwn(value, key) ? value[key] : void 0;
    if (raw === void 0 && isOptionalValidator(validator2)) continue;
    const result = validator2.check(raw, [...path31, key]);
    if (!result.ok) return result;
    entries.push([key, result.value]);
  }
  return { ok: true, value: Object.fromEntries(entries) };
}
function rpcString() {
  return toValidator(
    "string",
    (value, path31) => typeof value === "string" ? { ok: true, value } : failed(path31, "string", value)
  );
}
function rpcNumber() {
  return toValidator("number", (value, path31) => {
    if (typeof value !== "number") return failed(path31, "number", value);
    if (!Number.isFinite(value)) {
      return { ok: false, path: path31, expected: "number", received: "non-finite number" };
    }
    return { ok: true, value };
  });
}
function rpcBoolean() {
  return toValidator(
    "boolean",
    (value, path31) => typeof value === "boolean" ? { ok: true, value } : failed(path31, "boolean", value)
  );
}
function rpcLiteral(literal2) {
  const expects = JSON.stringify(literal2);
  return toValidator(
    expects,
    (value, path31) => value === literal2 ? { ok: true, value: literal2 } : failed(path31, expects, value)
  );
}
function rpcOptional(member) {
  return { ...member, optional: true };
}
function rpcNullable(member) {
  const expects = `${member.expects} | null`;
  return toValidator(expects, (value, path31) => {
    if (value === null) return { ok: true, value: null };
    const result = member.check(value, path31);
    if (result.ok || result.path.length !== path31.length) return result;
    return { ok: false, path: path31, expected: expects, received: result.received };
  });
}
function rpcUnion(...members) {
  const expects = [...new Set(members.map((member) => member.expects))].join(" | ");
  return toValidator(expects, (value, path31) => {
    for (const member of members) {
      const result = member.check(value, path31);
      if (result.ok) return result;
    }
    return failed(path31, expects, value);
  });
}
function rpcArray(member) {
  return toValidator(`array of ${member.expects}`, (value, path31) => {
    if (!Array.isArray(value)) return failed(path31, "array", value);
    const raw = value;
    const items = [];
    for (const [index, item] of raw.entries()) {
      const result = member.check(item, [...path31, index]);
      if (!result.ok) return result;
      items.push(result.value);
    }
    return { ok: true, value: items };
  });
}
function rpcObject(fields2) {
  return toValidator("object", (value, path31) => {
    return checkRpcFields(fields2, value, path31);
  });
}
function rpcRecord(value) {
  const expects = `record of ${value.expects}`;
  return toValidator(expects, (input, path31) => {
    if (!isUnknownRecord2(input)) return failed(path31, "object", input);
    const entries = [];
    for (const [key, raw] of Object.entries(input)) {
      const result = value.check(raw, path31);
      if (!result.ok) {
        return { ok: false, path: path31, expected: expects, received: result.received };
      }
      entries.push([key, result.value]);
    }
    return { ok: true, value: Object.fromEntries(entries) };
  });
}
function rpcUnknown() {
  return toValidator("unknown", (value) => ({ ok: true, value }));
}

/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/proto/dist/runtime/compact.js
 * Bundle: sand-host/agent-isolation/agent-store-worker.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
function defineOwn(target, key, value) {
  Object.defineProperty(target, key, {
    value,
    writable: true,
    enumerable: true,
    configurable: true
  });
  return value;
}
function fieldType(runtime, refs, token) {
  if (token.charAt(0) !== "#") {
    return { kind: "scalar", T: Number(token) };
  }
  const ref = refs[Number(token.slice(1))];
  return typeof ref === "function" ? { kind: "message", T: ref } : { kind: "enum", T: runtime.getEnumType(ref) };
}
function fieldsFromDescriptor(runtime, descriptor) {
  const entries = descriptor[0].split("|");
  const refs = descriptor.slice(1);
  const fields = [];
  for (let i = 1; i < entries.length; i++) {
    const tokens = entries[i].split(" ");
    const no = Number(tokens[0]);
    const name = tokens[1];
    let type = tokens[2];
    let mod = tokens[3];
    const last = type.charAt(type.length - 1);
    if (last === "?" || last === "*") {
      mod = last;
      type = type.slice(0, -1);
    }
    const comma = type.indexOf(",");
    if (comma !== -1) {
      fields.push({
        no,
        name,
        kind: "map",
        K: Number(type.slice(0, comma)),
        V: fieldType(runtime, refs, type.slice(comma + 1))
      });
      continue;
    }
    const field = Object.assign({ no, name }, fieldType(runtime, refs, type));
    if (mod === "?") {
      field.opt = true;
    } else if (mod === "*") {
      field.repeated = true;
    } else if (mod !== void 0) {
      field.oneof = mod;
    }
    fields.push(field);
  }
  return fields;
}
function nameFromDescriptor(descriptor) {
  const text = descriptor[0];
  const bar = text.indexOf("|");
  return bar === -1 ? text : text.slice(0, bar);
}
var CompactMessage = class extends Message {
  static get typeName() {
    const cls = this;
    return defineOwn(cls, "typeName", cls.$p() + nameFromDescriptor(cls.$()));
  }
  static get fields() {
    const cls = this;
    const descriptor = cls.$();
    const runtime = cls.runtime;
    const thunk = () => fieldsFromDescriptor(runtime, descriptor);
    return defineOwn(cls, "fields", runtime.util.newFieldList(thunk));
  }
};
function enumLocalNames(enumName, names) {
  const prefix = (enumName.charAt(0) + enumName.slice(1).replace(/[A-Z]/g, (c) => "_" + c)).toLowerCase() + "_";
  const stripped = [];
  for (const name of names) {
    if (!name.toLowerCase().startsWith(prefix)) {
      return names.slice();
    }
    const local = name.slice(prefix.length);
    if (local === "" || /^[0-9]/.test(local)) {
      return names.slice();
    }
    stripped.push(local);
  }
  return stripped;
}
function enumValuePrefix(enumName) {
  return (enumName.charAt(0) + enumName.slice(1).replace(/[A-Z]/g, (c) => "_" + c)).toUpperCase() + "_";
}
function enumType(runtime, packagePrefix, enumName, values, names) {
  const simpleName = enumName.slice(enumName.lastIndexOf(".") + 1);
  let protoNames;
  let localNames;
  if (names === 1) {
    const prefix = enumValuePrefix(simpleName);
    localNames = values.map((v) => v[1]);
    protoNames = localNames.map((local) => prefix + local);
  } else {
    protoNames = values.map((v) => v[1]);
    localNames = names === void 0 ? enumLocalNames(simpleName, protoNames) : names;
  }
  const enumObject = {};
  const infos = [];
  for (let i = 0; i < values.length; i++) {
    const no = values[i][0];
    enumObject[localNames[i]] = no;
    enumObject[no] = localNames[i];
    infos.push({ no, name: protoNames[i] });
  }
  runtime.util.setEnumType(enumObject, packagePrefix + enumName, infos);
  return enumObject;
}


/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/proto/dist/runtime/compact.js
 * Bundle: sand-host/host-main.cjs
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
function fieldsFromDescriptor(runtime, descriptor2) {
  const entries = descriptor2[0].split("|");
  const refs = descriptor2.slice(1);
  const fields2 = [];
  for (let i = 1; i < entries.length; i++) {
    const tokens = entries[i].split(" ");
    const no2 = Number(tokens[0]);
    const name17 = tokens[1];
    let type2 = tokens[2];
    let mod = tokens[3];
    const last = type2.charAt(type2.length - 1);
    if (last === "?" || last === "*") {
      mod = last;
      type2 = type2.slice(0, -1);
    }
    const comma = type2.indexOf(",");
    if (comma !== -1) {
      fields2.push({
        no: no2,
        name: name17,
        kind: "map",
        K: Number(type2.slice(0, comma)),
        V: fieldType(runtime, refs, type2.slice(comma + 1))
      });
      continue;
    }
    const field = Object.assign({ no: no2, name: name17 }, fieldType(runtime, refs, type2));
    if (mod === "?") {
      field.opt = true;
    } else if (mod === "*") {
      field.repeated = true;
    } else if (mod !== void 0) {
      field.oneof = mod;
    }
    fields2.push(field);
  }
  return fields2;
}
function nameFromDescriptor(descriptor2) {
  const text2 = descriptor2[0];
  const bar = text2.indexOf("|");
  return bar === -1 ? text2 : text2.slice(0, bar);
}
function enumLocalNames(enumName, names3) {
  const prefix = (enumName.charAt(0) + enumName.slice(1).replace(/[A-Z]/g, (c) => "_" + c)).toLowerCase() + "_";
  const stripped = [];
  for (const name17 of names3) {
    if (!name17.toLowerCase().startsWith(prefix)) {
      return names3.slice();
    }
    const local = name17.slice(prefix.length);
    if (local === "" || /^[0-9]/.test(local)) {
      return names3.slice();
    }
    stripped.push(local);
  }
  return stripped;
}
function enumValuePrefix(enumName) {
  return (enumName.charAt(0) + enumName.slice(1).replace(/[A-Z]/g, (c) => "_" + c)).toUpperCase() + "_";
}
function enumType(runtime, packagePrefix, enumName, values, names3) {
  const simpleName = enumName.slice(enumName.lastIndexOf(".") + 1);
  let protoNames;
  let localNames;
  if (names3 === 1) {
    const prefix = enumValuePrefix(simpleName);
    localNames = values.map((v2) => v2[1]);
    protoNames = localNames.map((local) => prefix + local);
  } else {
    protoNames = values.map((v2) => v2[1]);
    localNames = names3 === void 0 ? enumLocalNames(simpleName, protoNames) : names3;
  }
  const enumObject = {};
  const infos = [];
  for (let i = 0; i < values.length; i++) {
    const no2 = values[i][0];
    enumObject[localNames[i]] = no2;
    enumObject[no2] = localNames[i];
    infos.push({ no: no2, name: protoNames[i] });
  }
  runtime.util.setEnumType(enumObject, packagePrefix + enumName, infos);
  return enumObject;
}
var CompactMessage;
var init_compact = __esm({
  "../packages/proto/dist/runtime/compact.js"() {
    "use strict";
    init_esm();
    CompactMessage = class extends Message {
      static get typeName() {
        const cls = this;
        return defineOwn(cls, "typeName", cls.$p() + nameFromDescriptor(cls.$()));
      }
      static get fields() {
        const cls = this;
        const descriptor2 = cls.$();
        const runtime = cls.runtime;
        const thunk = () => fieldsFromDescriptor(runtime, descriptor2);
        return defineOwn(cls, "fields", runtime.util.newFieldList(thunk));
      }
    };
  }
});


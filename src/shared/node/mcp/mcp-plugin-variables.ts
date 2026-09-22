function isSecretVariableName(name17) {
  return name17.replace(/([a-z\d])([A-Z])/g, "$1_$2").replace(/([A-Z]+)([A-Z][a-z])/g, "$1_$2").replace(/[^a-z\d]+/gi, "_").toUpperCase().split("_").some((segment) => SECRET_WORDS2.has(segment));
}
function humanizeVariableName(name17) {
  const locale = i18n.locale || DEFAULT_LOCALE;
  return name17.split("_").filter((word) => word.length > 0).map((word) => {
    const lower = word.toLowerCase();
    if (ACRONYMS2.has(lower)) return word.toUpperCase();
    return word.charAt(0).toLocaleUpperCase(locale) + lower.slice(1);
  }).join(" ");
}
function toFieldType(value) {
  return value === "string" || value === "number" || value === "integer" || value === "boolean" ? value : null;
}
function toOptions(members) {
  if (!Array.isArray(members) || members.length === 0) return null;
  const options2 = [];
  for (const member of members) {
    if (typeof member !== "string" && typeof member !== "number" && typeof member !== "boolean") {
      return null;
    }
    options2.push({ label: String(member), rawValue: JSON.stringify(member) });
  }
  return options2;
}
function toDefaultValue(raw, type2, options2) {
  if (typeof raw !== "string" && typeof raw !== "number" && typeof raw !== "boolean") {
    return void 0;
  }
  if (type2 === "boolean") return Boolean(raw);
  return options2 != null ? JSON.stringify(raw) : String(raw);
}
function pluginVariablesSchemaToFields(schema2) {
  const root = isUnknownRecord(schema2) ? schema2 : void 0;
  const properties = root !== void 0 && isUnknownRecord(root.properties) ? root.properties : void 0;
  if (properties == null) return { fields: [], unsupportedFieldKeys: [] };
  const required2 = Array.isArray(root?.required) ? new Set(root.required.filter((key) => typeof key === "string")) : /* @__PURE__ */ new Set();
  const fields2 = [];
  const unsupportedFieldKeys = [];
  for (const [key, value] of Object.entries(properties)) {
    if (!isUnknownRecord(value)) {
      unsupportedFieldKeys.push(key);
      continue;
    }
    const type2 = toFieldType(value.type);
    if (type2 == null) {
      unsupportedFieldKeys.push(key);
      continue;
    }
    const options2 = toOptions(value.enum);
    if (value.enum !== void 0 && options2 == null) {
      unsupportedFieldKeys.push(key);
      continue;
    }
    const title = typeof value.title === "string" ? value.title : void 0;
    const description9 = typeof value.description === "string" ? value.description : void 0;
    const defaultValue = toDefaultValue(value.default, type2, options2);
    const isSecret = type2 === "string" && options2 == null && (value.format === "password" || value.writeOnly === true || isSecretVariableName(key));
    fields2.push({
      key,
      label: title ?? humanizeVariableName(key),
      type: type2,
      placeholder: key,
      isRequired: required2.has(key),
      isSecret,
      ...options2 != null ? { options: options2 } : {},
      ...defaultValue != null ? { defaultValue } : {},
      ...description9 != null ? { hint: description9 } : {}
    });
  }
  return { fields: fields2, unsupportedFieldKeys };
}
function effectiveFieldValue(field, values) {
  const provided = values[field.key];
  if (typeof provided === "string" ? provided.trim().length > 0 : provided !== void 0) {
    return provided;
  }
  if (field.defaultValue === void 0) return void 0;
  if (typeof field.defaultValue === "boolean") return field.defaultValue;
  return field.defaultValue.trim().length > 0 ? field.defaultValue : void 0;
}
function findMissingRequiredCatalogFields(fields2, values) {
  return fields2.filter(
    (field) => field.isRequired === true && effectiveFieldValue(field, values) === void 0
  );
}
var SECRET_WORDS2, ACRONYMS2;
var init_mcp_plugin_variables = __esm({
  "src/shared/node/mcp/mcp-plugin-variables.ts"() {
    "use strict";
    init_dist5();
    init_locale();
    init_unknown_record();
    SECRET_WORDS2 = /* @__PURE__ */ new Set([
      "CREDENTIAL",
      "CREDENTIALS",
      "KEY",
      "PASSPHRASE",
      "PASSWORD",
      "SECRET",
      "TOKEN"
    ]);
    ACRONYMS2 = /* @__PURE__ */ new Set([
      "url",
      "uri",
      "api",
      "id",
      "ssl",
      "tls",
      "http",
      "https",
      "db",
      "aws",
      "gcp"
    ]);
  }
});

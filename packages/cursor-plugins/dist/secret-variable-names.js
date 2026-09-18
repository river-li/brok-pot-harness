var SECRET_WORDS = /* @__PURE__ */ new Set([
  "CREDENTIAL",
  "CREDENTIALS",
  "KEY",
  "PASSPHRASE",
  "PASSWORD",
  "SECRET",
  "TOKEN"
]);
function toSegments(name17) {
  return name17.replace(/([a-z\d])([A-Z])/g, "$1_$2").replace(/([A-Z]+)([A-Z][a-z])/g, "$1_$2").replace(/[^a-z\d]+/gi, "_").toUpperCase().split("_").filter((segment) => segment.length > 0);
}
function isSecretPluginVariableName(name17) {
  return toSegments(name17).some((segment) => SECRET_WORDS.has(segment));
}

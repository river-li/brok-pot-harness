function getCursorModelName(part) {
  var _a19, _b2;
  const modelName = (_b2 = (_a19 = part.providerOptions) === null || _a19 === void 0 ? void 0 : _a19.cursor) === null || _b2 === void 0 ? void 0 : _b2.modelName;
  return typeof modelName === "string" ? modelName : void 0;
}
function providerOptionsFromModelName(modelName) {
  return modelName === void 0 ? {} : { providerOptions: { cursor: { modelName } } };
}

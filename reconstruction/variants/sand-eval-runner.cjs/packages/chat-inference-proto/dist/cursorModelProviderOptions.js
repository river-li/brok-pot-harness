/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/chat-inference-proto/dist/cursorModelProviderOptions.js
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
function getCursorModelName(part) {
  var _a20, _b2;
  const modelName = (_b2 = (_a20 = part.providerOptions) === null || _a20 === void 0 ? void 0 : _a20.cursor) === null || _b2 === void 0 ? void 0 : _b2.modelName;
  return typeof modelName === "string" ? modelName : void 0;
}
function providerOptionsFromModelName(modelName) {
  return modelName === void 0 ? {} : { providerOptions: { cursor: { modelName } } };
}


init_dist2();
init_dist3();
var DEV_SMART_MODE_CLASSIFIER_BLOCK_REASON = "This is a dev block whatever just retry it";
function createDevSmartModeClassifierOneShotState(token) {
  const trimmedToken = token?.trim();
  if (trimmedToken === void 0 || trimmedToken.length === 0) {
    return void 0;
  }
  let consumed = false;
  return {
    consume() {
      if (consumed) {
        return false;
      }
      consumed = true;
      return true;
    }
  };
}
function getDevSmartModeClassifierEnv(requestContext) {
  if (typeof process === "undefined" || process.env.NODE_ENV !== "development") {
    return void 0;
  }
  return requestContext?.env;
}
function createDevSmartModeClassifierBlockState(requestContext) {
  return createDevSmartModeClassifierOneShotState(getDevSmartModeClassifierEnv(requestContext)?.devForceNextSmartModeClassifierBlockToken);
}
function createDevSmartModeClassifierDelayState(requestContext) {
  return createDevSmartModeClassifierOneShotState(getDevSmartModeClassifierEnv(requestContext)?.devDelayNextSmartModeClassifierToken);
}
async function delayDevSmartModeClassifierIfRequested(state) {
  const consumed = state?.consume() === true;
  if (consumed) {
    await delay2(DEV_SMART_MODE_CLASSIFIER_DELAY_MS);
  }
}

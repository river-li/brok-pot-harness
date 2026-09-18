function attemptSync(operation) {
  try {
    return { ok: true, value: operation() };
  } catch (error41) {
    return { ok: false, error: error41 };
  }
}
var init_attempt = __esm({
  "../packages/utils/dist/attempt.js"() {
    "use strict";
  }
});

function attemptSync(operation) {
  try {
    return { ok: true, value: operation() };
  } catch (error42) {
    return { ok: false, error: error42 };
  }
}
var init_attempt = __esm({
  "../packages/utils/dist/attempt.js"() {
    "use strict";
  }
});

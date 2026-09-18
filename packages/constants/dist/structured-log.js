var STRUCTURED_LOG_REPLAY_MAX_AGE_MS, STRUCTURED_LOG_FUTURE_TIMESTAMP_MAX_SKEW_MS;
var init_structured_log = __esm({
  "../packages/constants/dist/structured-log.js"() {
    "use strict";
    STRUCTURED_LOG_REPLAY_MAX_AGE_MS = 17 * 60 * 60 * 1e3;
    STRUCTURED_LOG_FUTURE_TIMESTAMP_MAX_SKEW_MS = 2 * 60 * 60 * 1e3;
  }
});

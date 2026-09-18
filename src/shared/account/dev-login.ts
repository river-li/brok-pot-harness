function isDevBackendHostname(hostname3) {
  return hostname3 === "localhost" || hostname3 === "127.0.0.1" || hostname3 === "[::1]" || hostname3.endsWith(".lclhst.build") || hostname3 === "dev-staging.cursor.sh";
}
var init_dev_login = __esm({
  "src/shared/account/dev-login.ts"() {
    "use strict";
    init_errors();
  }
});

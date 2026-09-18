var CURSOR_AGENT_OIDC_TOKEN_PATH, CLOUD_AGENT_IDENTITY_GROK_BOT_BOX_TOKEN_PATH, GROK_BOT_BOX_IDENTITY_SOCKET_PATH;
var init_cloud_agent_identity = __esm({
  "../packages/constants/dist/cloud-agent-identity.js"() {
    "use strict";
    CURSOR_AGENT_OIDC_TOKEN_PATH = "/v1/tokens/oidc";
    CLOUD_AGENT_IDENTITY_GROK_BOT_BOX_TOKEN_PATH = "/cloud-agent/identity-token/sand-box";
    GROK_BOT_BOX_IDENTITY_SOCKET_PATH = "/tmp/sand-identity.sock";
  }
});

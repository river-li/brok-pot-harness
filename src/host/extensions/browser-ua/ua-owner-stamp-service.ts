var import_node_crypto43 = require("node:crypto");
init_errors();
init_cursor_token();
function uaOwnerStampForAccessToken(accessToken) {
  const sub = parseJwtPayload(accessToken)?.sub;
  if (sub == null || sub.length === 0) return null;
  return (0, import_node_crypto43.createHash)("sha256").update(sub, "utf8").digest("hex").slice(0, UA_OWNER_STAMP_LENGTH);
}
function createUaOwnerStampWriter(options2) {
  const path31 = options2.path ?? UA_OWNER_STAMP_PATH;
  let lastWritten = null;
  return async (accessToken) => {
    if (accessToken == null) return;
    const stamp = uaOwnerStampForAccessToken(accessToken);
    if (stamp == null || stamp === lastWritten) return;
    try {
      await writeFileAtomic(path31, `${stamp}
`, { mode: 420 });
      lastWritten = stamp;
    } catch (error42) {
      options2.log(`ua-owner stamp write failed: ${errorLogTag(error42)}`);
    }
  };
}

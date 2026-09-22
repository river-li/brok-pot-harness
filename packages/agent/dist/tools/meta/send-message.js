/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/agent/dist/tools/meta/send-message.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_zod();
var parametersSchema25 = external_exports.object({
  message: external_exports.string().trim().min(1, "Message must be non-empty").max(1e5, "Message must be at most 100000 characters").describe("User-visible message to send.")
});


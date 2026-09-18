init_zod();
var parametersSchema25 = external_exports.object({
  message: external_exports.string().trim().min(1, "Message must be non-empty").max(1e5, "Message must be at most 100000 characters").describe("User-visible message to send.")
});

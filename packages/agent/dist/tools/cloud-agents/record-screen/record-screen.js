init_zod();
var parametersSchema6 = external_exports.object({
  mode: external_exports.enum(["START_RECORDING", "SAVE_RECORDING", "DISCARD_RECORDING"]).describe("Recording mode: START_RECORDING to begin, SAVE_RECORDING to stop and save, DISCARD_RECORDING to discard"),
  save_as_filename: external_exports.string().optional().describe("Custom filename for the saved recording. Only use when mode=SAVE_RECORDING (ignored for other modes). Use to specify a human readable name describing the contents of the screen recording. Do not include slashes or file extension (absolute path and correct extension are automatically added).")
});

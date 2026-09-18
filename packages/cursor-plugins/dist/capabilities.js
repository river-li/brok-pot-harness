init_zod();
var CapabilitySchema = external_exports.enum(["canvas"]);
var CapabilitiesSchema = external_exports.array(CapabilitySchema).transform((capabilities) => {
  return [...new Set(capabilities)].sort();
});

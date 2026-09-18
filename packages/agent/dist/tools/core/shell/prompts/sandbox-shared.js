init_zod();
function hasNetworkAllowlist(info2) {
  if (!info2)
    return false;
  return info2.hasDefaults || info2.explicitEntries.length > 0;
}
function getRequiredPermissionsSchema({ isReadonly, strict = false }) {
  if (isReadonly) {
    return lenientArray(external_exports.array(external_exports.enum(["full_network", "network"])), {
      field: "required_permissions",
      primitiveItems: true
    }).optional().describe("Optional list of permissions to request if the command needs them (full_network).");
  }
  if (strict) {
    return lenientArray(external_exports.array(external_exports.enum(["full_network", "all"])).max(1), {
      field: "required_permissions",
      primitiveItems: true
    }).optional().describe("Optional list of permissions to request if the command needs them (full_network, all).");
  }
  return lenientArray(external_exports.array(external_exports.enum(["git_write", "full_network", "network", "all"])), { field: "required_permissions", primitiveItems: true }).optional().describe("Optional list of permissions to request if the command needs them (full_network, all).");
}

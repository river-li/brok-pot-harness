init_zod();
var BOX_STORE_MANIFEST_REL_PATH = "manifest.json";
var BOX_STORE_BLOBS_PREFIX = "blobs";
var BOX_STORE_LEGACY_MANIFEST_VERSION = 1;
var BOX_STORE_MANIFEST_VERSION = 2;
var manifestFileIdentitySchema = {
  sha: external_exports.string().min(1),
  size: external_exports.number().int().nonnegative()
};
var legacyManifestFileEntrySchema = external_exports.object({
  ...manifestFileIdentitySchema,
  kind: external_exports.undefined().optional(),
  mode: external_exports.undefined().optional()
});
var manifestFileEntrySchema = external_exports.object({
  kind: external_exports.literal("file"),
  ...manifestFileIdentitySchema,
  mode: external_exports.number().int().min(0).max(511)
});
var manifestSymlinkEntrySchema = external_exports.object({
  kind: external_exports.literal("symlink"),
  target: external_exports.string().min(1)
});
var manifestEntrySchema = external_exports.union([
  manifestFileEntrySchema,
  manifestSymlinkEntrySchema,
  legacyManifestFileEntrySchema
]);
var manifestHeaderSchema = {
  updatedAtMs: external_exports.number().int().nonnegative(),
  writerWindowId: external_exports.string().optional(),
  fullyHydrated: external_exports.boolean().optional()
};
var legacyManifestSchema = external_exports.object({
  version: external_exports.literal(BOX_STORE_LEGACY_MANIFEST_VERSION),
  ...manifestHeaderSchema,
  entries: external_exports.record(external_exports.string(), legacyManifestFileEntrySchema)
});
var currentManifestSchema = external_exports.object({
  version: external_exports.literal(BOX_STORE_MANIFEST_VERSION),
  ...manifestHeaderSchema,
  entries: external_exports.record(external_exports.string(), manifestEntrySchema)
});
var manifestSchema = external_exports.discriminatedUnion("version", [
  legacyManifestSchema,
  currentManifestSchema
]);
function isBoxStoreManifestFileEntry(entry) {
  return entry.kind !== "symlink";
}
function isBoxStoreManifestSymlinkEntry(entry) {
  return entry.kind === "symlink";
}
function boxStoreManifestEntriesEqual(left, right) {
  if (left == null || right == null) return left === right;
  if (isBoxStoreManifestSymlinkEntry(left) || isBoxStoreManifestSymlinkEntry(right)) {
    return isBoxStoreManifestSymlinkEntry(left) && isBoxStoreManifestSymlinkEntry(right) && left.target === right.target;
  }
  return left.sha === right.sha && left.size === right.size && left.kind === right.kind && left.mode === right.mode;
}
function isSymlinkManifestValue(entry) {
  return manifestSymlinkEntrySchema.safeParse(entry).success;
}

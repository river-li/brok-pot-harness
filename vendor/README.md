# vendor

Copied upstream dependency and desktop resources; not application state or credentials.

Build and launch from the [repository root](../README.md). Current verification and
limitations are recorded in [migration status](../MIGRATION_STATUS.md); copied tests or code
do not establish that this version has passed runtime verification.

Resources were copied from the prior local reconstruction into this repository.
Upstream package metadata, licenses and existing import manifests are retained.
No runtime path points to the old checkout or installed App. The Host version
is bfe1879; the copied desktop is separately versioned 0.44.0.

[local-resource-manifest.json](local-resource-manifest.json) records SHA-256
digests of copied resources for reproducibility. Model weights are downloaded or
cached under ignored `.runtime/models`, never read from the old checkout.

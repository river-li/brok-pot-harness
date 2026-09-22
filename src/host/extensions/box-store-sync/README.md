# box-store-sync

The box-store-sync Host extension and its lifecycle-bound services. Read extension.ts for dependencies and registration.

Entry points and reference files: [object-store-port.ts](object-store-port.ts), [box-copy-in-failure.ts](box-copy-in-failure.ts), [claim-set.ts](claim-set.ts), [box-store-sync-error.ts](box-store-sync-error.ts), [box-store-manifest.ts](box-store-manifest.ts), [workspace-ignore.ts](workspace-ignore.ts).

Build and launch from the [repository root](../../../../README.md). Current verification and
limitations are recorded in [migration status](../../../../MIGRATION_STATUS.md); copied tests or code
do not establish that this version has passed runtime verification.

Local mode disables background cloud sync and skips remote store cleanup when
deleting a local Agent. The original cleanup path remains for original builds.

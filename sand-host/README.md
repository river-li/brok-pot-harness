# sand-host

Immutable bfe1879 release baseline, worker files, extension artifacts and Box scripts.

Entry points and reference files: [diff-patch-worker.js](diff-patch-worker.js), [unified-diff-worker.js](unified-diff-worker.js), [package.json](package.json), [host-main.cjs](host-main.cjs), [sand-eval-runner.cjs](sand-eval-runner.cjs), [pdf-worker.js](pdf-worker.js).

Build and launch from the [repository root](../README.md). Current verification and
limitations are recorded in [migration status](../MIGRATION_STATUS.md); copied tests or code
do not establish that this version has passed runtime verification.

Do not implement fixes in this baseline. Edit mapped src/packages/dune fragments,
then run npm run build to generate .runtime/build.

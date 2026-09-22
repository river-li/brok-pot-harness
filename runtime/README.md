# runtime

Build profiles, Docker/desktop launchers, maintained desktop assets and verification tools.

Entry points and reference files: [manage.cjs](manage.cjs), [box-entrypoint.sh](box-entrypoint.sh), [package.json](package.json), [desktop.cjs](desktop.cjs), [build-profiles.json](build-profiles.json), [plugins.cjs](plugins.cjs).

Build and launch from the [repository root](../README.md). Current verification and
limitations are recorded in [migration status](../MIGRATION_STATUS.md); copied tests or code
do not establish that this version has passed runtime verification.

## Local launch configuration

The root README contains the complete build, API-key, permissions and mount guide.
`manage.cjs` loads the root `.env`, then starts this repository's Compose project.
`GROKBOT_SANDBOX_IMAGE` selects a compatible Box image; `GROKBOT_WORKSPACE_DIR`
selects the host folder mounted at `/workspace` (prefer an absolute path).
`GROKBOT_COMPOSE_OVERRIDE` adds one overlay file, resolved from the repository
root. Compose resolves relative mounts from `runtime/`, its first file's directory.
The same overlay is used for start, stop, status, logs and restart.
Run `npm start` after environment, image or mount changes; restart alone does not
recreate the container configuration. Setting `GROKBOT_LOCAL_VOICE=0` hides the
desktop local call entry point, not the speech container or dictation/preview.

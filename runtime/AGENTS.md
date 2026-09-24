# Runtime maintenance

This tree owns the build/prepare tools, local Compose and desktop launchers,
maintained Electron assets, and runtime tests. See the
[runtime README](README.md) for paths and commands and
[build-profile guide](BUILD_PROFILES.md) for output policy.

## Edit boundaries and invariants

- `manage.cjs` manages only this repository's `gbh-local` Compose project. It
  requires a local Host build and creates state under `.runtime`. Preserve the
  current pinned sandbox image, read-only Host mounts, and service ports for
  unrelated changes. A scoped launcher/config task may intentionally revise a
  default or add opt-in behavior; document the intended behavior and verify
  the affected Compose path.
- `server.cjs` owns the distinct `gbh-server` Compose project and persistent
  state profile. Keep generated state under its selected state directory,
  restrict token/env-file permissions, bind Gateway and display ports to
  loopback, and clean up only the project selected by its private config.
  Box startup may change data/workspace ownership to its in-container user on
  native Linux. Release checkpoints may reclaim only those two mounts through
  the pinned app image after verifying every project container is stopped;
  keep model caches outside the checkpoint and avoid changing unrelated owners.
  Server model keys are read from that server env or the invoking shell; do not
  place them in the remote desktop environment or logs.
- `release.cjs` manages only the versioned self-hosted preview under its chosen
  release home and state home. Keep the complete file/checksum inventory and
  product `stateFormat` gate mandatory. Checkpoint every listed state entry's
  recursive file hashes before replacing user state, and fail closed when a
  lock owner is unreadable or unverifiable. Stale-lock removal is an explicit
  operator recovery step; do not claim automatic recovery after process kill.
  Preserve unique speech image names per release so rollback Compose files
  continue to identify their own build. Document state roots outside the
  checkpoint, including external symlink targets and Docker storage.
- `desktop.cjs` validates the prepared desktop profile, keeps local/original
  data directories separate, injects local Gateway settings only for local,
  and removes `LITELLM_API_KEY` from the Electron environment. Preserve these
  boundaries when editing launch arguments or environment forwarding.
- Its `--remote` path loads a separate connection window without reading root
  `.env`, the local token file, Docker state, or the Host. Remote credentials
  may persist only through encrypted OS storage after an explicit user choice;
  never fall back to plaintext. The connected client uses its own profile and
  passes only Gateway/display connection values to the retained UI.
- Local and original artifacts are assembled from the same maintained source
  into separate output directories. Local profile policy disables vendor
  login, billing, cloud provisioning, and sync while retaining those original
  implementations. Original profile selection does not force runtime gates on
  or prove remote service availability.
- The optional Compose override is opt-in. Document its path relative to the
  repository root separately from mount paths relative to `runtime/compose.yaml`.
- Never print resolved environments, copy credentials, or put runtime user
  data in source. Use only this repository's services and test-owned processes.

## Verify runtime and launcher changes

```sh
npm run test:runtime-build
env GROKBOT_GATEWAY_TOKEN=test GROKBOT_SEARCH_SECRET=test \
  docker compose --env-file /dev/null -f runtime/compose.yaml config >/dev/null
```

For build-profile changes, build both profiles and run the runtime-build check:
`npm run build -- --profile local`, `npm run build -- --profile original`,
then `npm run test:runtime-build`. Check readiness with `npm run status` only
when exercising a launched service. Read the
[test guide](tests/README.md) before choosing live coverage; syntax/config
checks alone do not establish service behavior.

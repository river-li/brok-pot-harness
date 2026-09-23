# Runtime maintenance

This tree owns the build/prepare tools, local Compose and desktop launchers,
maintained Electron assets, and runtime tests. See the
[runtime README](README.md) for paths and commands and
[build-profile guide](BUILD_PROFILES.md) for output policy.

## Edit boundaries and invariants

- `manage.cjs` manages only this repository's `gbh-local` Compose project. It
  requires a local Host build and creates state under `.runtime`; do not change
  the pinned default sandbox image, read-only Host mounts, service ports, or
  test-owned cleanup while changing launch behavior.
- `desktop.cjs` validates the prepared desktop profile, keeps local/original
  data directories separate, injects local Gateway settings only for local,
  and removes `LITELLM_API_KEY` from the Electron environment. Preserve these
  boundaries when editing launch arguments or environment forwarding.
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

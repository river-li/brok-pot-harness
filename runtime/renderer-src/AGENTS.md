# renderer-src maintenance

Retained renderer components. Keep account/service implementations behind profile-dependent UI state.

Follow the repository AGENTS.md. Keep generated output under .runtime and preserve local/original profiles.
Use only this repository’s gbh-local services and test-owned processes. Never
copy credentials or infer successful execution from syntax checks alone.

## Edit boundaries and invariants

- This is maintained HTML, JavaScript, and assets assembled by
  `prepare:desktop`; it is not a complete original React/TypeScript source
  tree. Find feature code by its setting or UI text and preserve its current
  script-loading order.
- `index.html` owns page boot, resource loading, and CSP. Keep existing
  restrictions on scripts and network access when changing playback or UI
  behavior.
- The renderer receives profile-dependent account/service state. Keep original
  account implementations behind that policy and do not send model API keys,
  Gateway tokens, or Host-only secrets through renderer state or IPC.
- Make local presentation changes conditional on the built profile; do not
  delete retained service UI or change the original profile to implement the
  local default.

## Verify renderer changes

```sh
npm run prepare:desktop -- --profile local
```

For a UI flow, run `npm run test:desktop-live` with a ready local runtime and
the prepared desktop. `test:desktop-keychain` checks main-process storage
policy, not renderer behavior. See the
[test guide](../tests/README.md).

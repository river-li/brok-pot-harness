# desktop-src maintenance

Retained desktop main-process bundles with conditional local workspace adapters.

Follow the repository AGENTS.md. Keep generated output under .runtime and preserve local/original profiles.
Use only this repository’s gbh-local services and test-owned processes. Never
copy credentials or infer successful execution from syntax checks alone.

## Edit boundaries and invariants

- `main.cjs` / `main-app.cjs` own Electron startup, windows, IPC, workspace,
  and local-mode integration. `local-keychain.cjs` owns local secure-storage
  policy and the non-secret machine identity described in the
  [desktop README](README.md).
- Local startup must not initialize inherited Keychain storage by default.
  `GROKBOT_LOCAL_KEYCHAIN=1` is the explicit opt-in; keep machine identity
  persistence restricted and never replace encrypted secrets with plaintext
  disk persistence.
- Keep the model API key out of renderer IPC and child processes. Keep local
  Gateway/backend settings out of the original-profile launcher path. Retained
  account and service code stays present and profile-conditional.
- Assembly output belongs under `.runtime`; edit maintained sources here, not
  generated desktop output or `vendor/desktop` release assets.

## Verify desktop changes

```sh
npm run prepare:desktop -- --profile local
npm run test:desktop-keychain
```

After startup/storage changes, also run
`npm run test:desktop-keychain-live` with the prepared desktop; it audits actual
Electron `safeStorage` calls. For visible desktop flows use
`npm run test:desktop-live` against a ready local runtime. See the
[test guide](../tests/README.md); contract coverage and a prepared bundle do
not prove a live UI flow.

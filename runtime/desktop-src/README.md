# Electron main process

Maintained desktop main-process bundles and conditional local adapters.
Original resources stay in `vendor/desktop`; `prepare:desktop` overlays these files into an independent assembly directory.

| File | Responsibility |
| --- | --- |
| [main.cjs](main.cjs) | Desktop entry |
| [main-app.cjs](main-app.cjs) | Windows, IPC, workspace, local-mode integration |
| [local-keychain.cjs](local-keychain.cjs) | Optional encrypted-storage policy and non-secret machine identity |
| [branding.cjs](branding.cjs) | Development Dock icon |

Local mode skips inherited secure-storage initialization and encrypted Gateway caching by default.
`GROKBOT_LOCAL_KEYCHAIN=1` opts into optional Keychain features; secrets are not persisted as plaintext instead.
See [Keychain permissions](../../docs/wiki/Permissions.md#keychain).

After edits, build and prepare from the root, then quit and relaunch the desktop.
Storage changes require `test:desktop-keychain` and `test:desktop-keychain-live`;
the latter instruments actual Electron safeStorage calls.

[Renderer](../renderer-src/README.md) · [Packaging](../../docs/wiki/Packaging.md) · [Runtime](../README.md)

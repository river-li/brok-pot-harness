# Build and runtime

Assembles maintained source, upstream assets, and local adapters into Host and Electron artifacts,
and manages this repository's Docker services. Users should start with [Installation](../docs/wiki/Build-Guide.md).

| Entry / directory | Responsibility |
| --- | --- |
| [manage.cjs](manage.cjs) | Load settings, generate local credentials, manage the `gbh-local` Compose project |
| [server.cjs](server.cjs) | Install, configure, start, update, and rotate credentials for the separate `gbh-server` project |
| [config.cjs](config.cjs) | Root `.env` loading and precedence |
| [compose.yaml](compose.yaml), [box-entrypoint.sh](box-entrypoint.sh) | Services, mounts, ports, in-Box Host startup |
| [desktop.cjs](desktop.cjs) | Development Electron launch, profile, Gateway configuration |
| [remote-client-main.cjs](remote-client-main.cjs), [remote-client-connection.cjs](remote-client-connection.cjs), [remote-client-secure-storage.cjs](remote-client-secure-storage.cjs) | Independent URL/token client, encrypted connection store, bounded isolated OS credential helper, and authenticated capability check |
| [packaged-main.cjs](packaged-main.cjs) | Packaged app's local entry |
| [build-profiles.json](build-profiles.json) | Local/original policy |
| [desktop-src](desktop-src/README.md), [renderer-src](renderer-src/README.md) | Maintained main-process and UI assets |
| [tools](tools/README.md) | Reconstruction, desktop assembly, icons, packaging, demonstration capture |
| [search](search/README.md), [speech](speech/README.md) | Search and speech services |
| [tests](tests/README.md) | Contract, service, real-model, and desktop verification |
| [plugins.cjs](plugins.cjs) | Local plugin import and catalog listing |

## Runtime conventions

Run commands from the repository root. `.runtime` holds both build output and user data; do not delete it as a cache.
Use `npm start` to apply local launch-configuration changes. Use the dedicated `server:` npm scripts for the separately scoped persistent server. `npm run start:remote-desktop` opens the URL/token connection flow and does not start local Compose services. Restart affected processes after rebuilding source.
See [Sandbox](../docs/wiki/Sandbox.md) for data and [Configuration](../docs/wiki/Configuration.md) for precedence.

The remote Mac client uses the runtime's exact Electron 42.11.6 tool pin. Keep this at or above 42.5.1: Electron's macOS Safe Storage constructor previously touched Keychain during app readiness, even before the user chose to save a connection. The lazy initialization fix was backported to the 42.x line in [Electron PR 51924](https://releases.electronjs.org/pr/51924). This is a maintained packaging dependency; the recovered application source and its product version stay at the repository baseline.

[Build profiles](BUILD_PROFILES.md) · [Remote server guide](../docs/wiki/Remote-Server.md) · [Voice bridge](VOICE.md) · [Development](../docs/wiki/Development.md)

# Build and runtime

Assembles maintained source, upstream assets, and local adapters into Host and Electron artifacts,
and manages this repository's Docker services. Users should start with [Installation](../docs/wiki/Build-Guide.md).

| Entry / directory | Responsibility |
| --- | --- |
| [manage.cjs](manage.cjs) | Load settings, generate local credentials, manage the `gbh-local` Compose project |
| [config.cjs](config.cjs) | Root `.env` loading and precedence |
| [compose.yaml](compose.yaml), [box-entrypoint.sh](box-entrypoint.sh) | Services, mounts, ports, in-Box Host startup |
| [desktop.cjs](desktop.cjs) | Development Electron launch, profile, Gateway configuration |
| [packaged-main.cjs](packaged-main.cjs) | Packaged app's local entry |
| [build-profiles.json](build-profiles.json) | Local/original policy |
| [desktop-src](desktop-src/README.md), [renderer-src](renderer-src/README.md) | Maintained main-process and UI assets |
| [tools](tools/README.md) | Reconstruction, desktop assembly, icons, packaging, demonstration capture |
| [search](search/README.md), [speech](speech/README.md) | Search and speech services |
| [tests](tests/README.md) | Contract, service, real-model, and desktop verification |
| [plugins.cjs](plugins.cjs) | Local plugin import and catalog listing |

## Runtime conventions

Run commands from the repository root. `.runtime` holds both build output and user data; do not delete it as a cache.
Use `npm start` to apply launch-configuration changes. Restart affected processes after rebuilding source.
See [Sandbox](../docs/wiki/Sandbox.md) for data and [Configuration](../docs/wiki/Configuration.md) for precedence.

[Build profiles](BUILD_PROFILES.md) · [Voice bridge](VOICE.md) · [Development](../docs/wiki/Development.md)

# Documentation

**[Open the documentation →](wiki/Home.md)**

| Reading path | Start here |
| --- | --- |
| Use GBH | [Installation](wiki/Build-Guide.md) → [Configuration](wiki/Configuration.md) → [Sandbox](wiki/Sandbox.md) |
| Extend your workflow | [MCP, plugins, and Skills](wiki/Extensions.md) → [Permissions](wiki/Permissions.md) |
| Understand the code | [Architecture](wiki/Architecture.md) → [Packages](../packages/README.md) → [Development](wiki/Development.md) |
| Maintain the build | [Source recovery](wiki/Source-Recovery.md) → [Verification](wiki/Verification.md) |
| Host the documentation | [GitHub Pages + Wiki publishing](wiki/Publishing.md) |

English is the canonical language. Translations use separate language-suffixed files, such as
[README.zh.md](../README.zh.md). Directory README files explain modules; AGENTS.md files define maintenance rules.

## Documentation website and GitHub Wiki

`wiki/` contains the version-controlled documentation source. Export it with `npm run docs:wiki`
to create native GitHub Wiki pages, sidebar, footer, package guides, and extension guides.
The exporter rewrites navigation, source links, and media paths for the Wiki's separate repository.
The GitHub Pages website is built from the same authored Markdown via `npm run docs:site:build`.
See [Publishing](wiki/Publishing.md) for local preview, validation, deployment, rollback, and Wiki export.

`media/` contains real application screenshots and recordings with reproduction notes.

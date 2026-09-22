# cursor-config

Project and user permission-file providers for execution configuration.

## Start reading

| Entry | Purpose |
| --- | --- |
| [dist/project-permissions-file-provider.js](dist/project-permissions-file-provider.js) | Project Permissions File Provider |
| [dist/permissions-file-provider.js](dist/permissions-file-provider.js) | Permissions File Provider |
| [dist/paths.js](dist/paths.js) | Paths |

## Change boundaries

Permission files, desktop Settings, and Docker mounts are independent controls; do not collapse them into one switch.

Related modules: [local-exec](../local-exec/README.md) · [shell-exec](../shell-exec/README.md). These are reading links, not npm dependency declarations.

Build from the repository root. See [source recovery](../../docs/wiki/Source-Recovery.md) for bundle-scope rules and [development](../../docs/wiki/Development.md) for verification.

[← Package map](../README.md)

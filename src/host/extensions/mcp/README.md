# mcp

Manages Host MCP services and installs plugin Skills into the workspace.

## Entry points and registration

[extension.ts](extension.ts) declares the ID, dependencies, and startup behavior. [registry.ts](../registry.ts) registers the extension.

| Implementation | Purpose |
| --- | --- |
| [mcp-service.ts](mcp-service.ts) | MCP Service |
| [plugin-skills.ts](plugin-skills.ts) | Plugin Skills |
| [legacy-live-references.ts](legacy-live-references.ts) | Legacy Live References |

## Dependencies and change boundaries

Declared Host dependencies: [auth](../auth/README.md) · [experiments](../experiments/README.md) · [forever-box](../forever-box/README.md) · [settings](../settings/README.md) · [telemetry](../telemetry/README.md).

Keep connections, credentials, and temporary clients scoped; do not mix model and MCP credentials.

See [Configuration](../../../../docs/wiki/Configuration.md) for activation policy and [Features](../../../../docs/wiki/Features.md) for support status.

[← Host extension map](../README.md) · [Host](../../README.md)

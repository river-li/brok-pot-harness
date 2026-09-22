# cloud-agents

Retains cloud Agent polling, update streams, and artifact caching.

## Entry points and registration

[extension.ts](extension.ts) declares the ID, dependencies, and startup behavior. [registry.ts](../registry.ts) registers the extension.

| Implementation | Purpose |
| --- | --- |
| [cloud-agents-service.ts](cloud-agents-service.ts) | Cloud Agents Service |
| [cloud-agent-poll-loop.ts](cloud-agent-poll-loop.ts) | Cloud Agent Poll Loop |
| [cloud-agent-artifact-cache.ts](cloud-agent-artifact-cache.ts) | Cloud Agent Artifact Cache |

## Dependencies and change boundaries

Declared Host dependencies: [auth](../auth/README.md) · [experiments](../experiments/README.md) · [forever-box](../forever-box/README.md) · [team-admin-policy](../team-admin-policy/README.md).

The local profile disables cloud provisioning; retained source does not establish a usable cloud service.

See [Configuration](../../../../docs/wiki/Configuration.md) for activation policy and [Features](../../../../docs/wiki/Features.md) for support status.

[← Host extension map](../README.md) · [Host](../../README.md)

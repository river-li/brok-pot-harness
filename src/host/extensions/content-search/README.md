# content-search

Indexes and searches Agent content.

## Entry points and registration

[extension.ts](extension.ts) declares the ID, dependencies, and startup behavior. [registry.ts](../registry.ts) registers the extension.

| Implementation | Purpose |
| --- | --- |
| [search-index-service.ts](search-index-service.ts) | Search Index Service |
| [search-index-writer.ts](search-index-writer.ts) | Search Index Writer |
| [agent-content-search.ts](agent-content-search.ts) | Agent Content Search |

## Dependencies and change boundaries

Declared Host dependencies: [telemetry](../telemetry/README.md).

This is conversation-content search; web search belongs to inference and SearXNG adapters.

See [Configuration](../../../../docs/wiki/Configuration.md) for activation policy and [Features](../../../../docs/wiki/Features.md) for support status.

[← Host extension map](../README.md) · [Host](../../README.md)

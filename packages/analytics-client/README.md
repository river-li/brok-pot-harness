# analytics-client

Event conversion, buffering, and deferred buffering.

## Start reading

| Entry | Purpose |
| --- | --- |
| [dist/to-event-data.js](dist/to-event-data.js) | To Event Data |
| [dist/buffer.js](dist/buffer.js) | Buffer |
| [dist/deferred-buffer.js](dist/deferred-buffer.js) | Deferred Buffer |

## Change boundaries

Buffer changes must respect caller-side disable policies; retaining the module does not enable telemetry services.

Related modules: [metrics](../metrics/README.md) · [codebase-telemetry](../codebase-telemetry/README.md). These are reading links, not npm dependency declarations.

Build from the repository root. See [source recovery](../../docs/wiki/Source-Recovery.md) for bundle-scope rules and [development](../../docs/wiki/Development.md) for verification.

[← Package map](../README.md)

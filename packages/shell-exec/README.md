# shell-exec

Shell processes, output limits, environment filtering, and platform sandbox policies.

## Start reading

| Entry | Purpose |
| --- | --- |
| [dist/core.js](dist/core.js) | Core |
| [dist/env-filter.js](dist/env-filter.js) | Env Filter |
| [dist/output-limiter.js](dist/output-limiter.js) | Output Limiter |
| [dist/sandbox/policy-loader.js](dist/sandbox/policy-loader.js) | Policy Loader |

## Change boundaries

Preserve cancellation, output limits, and environment filtering when changing command lifecycle. Host owns Mac authorization settings.

Related modules: [local-exec](../local-exec/README.md) · [utils](../utils/README.md). These are reading links, not npm dependency declarations.

Build from the repository root. See [source recovery](../../docs/wiki/Source-Recovery.md) for bundle-scope rules and [development](../../docs/wiki/Development.md) for verification.

[← Package map](../README.md)

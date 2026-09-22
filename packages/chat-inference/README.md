# chat-inference

Prompt execution abstractions and middleware for images, reasoning effort, and tracing.

## Start reading

| Entry | Purpose |
| --- | --- |
| [dist/prompt-executor.js](dist/prompt-executor.js) | Prompt Executor |
| [dist/base.js](dist/base.js) | Base |
| [dist/middleware/effort-level-middleware.js](dist/middleware/effort-level-middleware.js) | Effort Level Middleware |

## Change boundaries

Local API requests live in Harness src/local/responses.ts; this package provides shared inference abstractions.

Related modules: [chat-inference-proto](../chat-inference-proto/README.md) · [grok-bot-harness](../grok-bot-harness/README.md). These are reading links, not npm dependency declarations.

Build from the repository root. See [source recovery](../../docs/wiki/Source-Recovery.md) for bundle-scope rules and [development](../../docs/wiki/Development.md) for verification.

[← Package map](../README.md)

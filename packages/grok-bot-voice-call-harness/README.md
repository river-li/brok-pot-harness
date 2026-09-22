# grok-bot-voice-call-harness

Voice-call tool definitions, RPC harness, and wire protocol.

## Start reading

| Entry | Purpose |
| --- | --- |
| [dist/harness/tool-definitions.js](dist/harness/tool-definitions.js) | Tool Definitions |
| [dist/harness/rpc-harness.js](dist/harness/rpc-harness.js) | RPC Harness |
| [dist/harness/tools/send-task.js](dist/harness/tools/send-task.js) | Send Task |

## Change boundaries

The call interface and main Agent task executor are separate layers; see Features for full-call support limits.

Related modules: [grok-bot-harness](../grok-bot-harness/README.md) · [chat-inference](../chat-inference/README.md). These are reading links, not npm dependency declarations.

Build from the repository root. See [source recovery](../../docs/wiki/Source-Recovery.md) for bundle-scope rules and [development](../../docs/wiki/Development.md) for verification.

[← Package map](../README.md)

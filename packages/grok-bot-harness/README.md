# grok-bot-harness

Composes Agent, prompts, tools, memory, and service ports into the Bot task runner.

## Start reading

| Entry | Purpose |
| --- | --- |
| [src/runner/sand-agent-runner.ts](src/runner/sand-agent-runner.ts) | Sand Agent Runner |
| [src/runner/tools/turn-toolset.ts](src/runner/tools/turn-toolset.ts) | Turn Toolset |
| [src/ports/box.ts](src/ports/box.ts) | Box |
| [src/local/README.md](src/local/README.md) | Local adapter guide |

## Change boundaries

Start with runner and ports for product behavior; independently maintained local replacements belong in strict TypeScript under src/local.

Related modules: [agent](../agent/README.md) · [agent-exec](../agent-exec/README.md) · [chat-inference](../chat-inference/README.md) · [grok-bot-voice-call-harness](../grok-bot-voice-call-harness/README.md). These are reading links, not npm dependency declarations.

Build from the repository root. See [source recovery](../../docs/wiki/Source-Recovery.md) for bundle-scope rules and [development](../../docs/wiki/Development.md) for verification.

[← Package map](../README.md)

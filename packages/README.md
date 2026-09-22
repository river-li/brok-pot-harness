# Package map

Browse every package by responsibility. Each guide identifies key source files, change boundaries, and neighboring modules.
These are maintenance boundaries, not independently running services or installable npm workspaces.

## Find the right layer

| Looking for | Start here |
| --- | --- |
| Bot prompts, tools, and capabilities | [grok-bot-harness](grok-bot-harness/README.md) |
| Inference and tool iterations | [agent](agent/README.md) |
| Tool calls reaching an execution environment | [agent-exec](agent-exec/README.md) → [local-exec](local-exec/README.md) → [shell-exec](shell-exec/README.md) |
| Local model, web, speech, and plugin adapters | [Harness src/local](grok-bot-harness/src/local/README.md) |
| Application startup, Gateway, persistence | [src/host](../src/host/README.md), outside packages |

## Browse by responsibility

### Agent and inference

| Package | Responsibility |
| --- | --- |
| [agent](agent/README.md) | Generic Agent state, interaction handling, tool orchestration, and context processing. |
| [agent-client](agent-client/README.md) | Connects to an Agent, drives turns, and detects stalled interactions. |
| [agent-core](agent-core/README.md) | Shared interaction queries, updates, listeners, and goal continuation. |
| [agent-summarization](agent-summarization/README.md) | Prepares summary input, manages context budgets, and coordinates background summaries and durable content. |
| [chat-inference](chat-inference/README.md) | Prompt execution abstractions and middleware for images, reasoning effort, and tracing. |
| [chat-inference-proto](chat-inference-proto/README.md) | Model clients and protocol conversion between prompt execution and the retained inference protocol. |
| [grok-bot-harness](grok-bot-harness/README.md) | Composes Agent, prompts, tools, memory, and service ports into the Bot task runner. |
| [grok-bot-voice-call-harness](grok-bot-voice-call-harness/README.md) | Voice-call tool definitions, RPC harness, and wire protocol. |

### Execution and permissions

| Package | Responsibility |
| --- | --- |
| [agent-exec](agent-exec/README.md) | Agent-facing interfaces for files, shell, MCP, subagents, and background work. |
| [local-exec](local-exec/README.md) | Concrete file, shell, MCP, screenshot, and computer-use implementations for an execution environment. |
| [shell-exec](shell-exec/README.md) | Shell processes, output limits, environment filtering, and platform sandbox policies. |
| [cursor-config](cursor-config/README.md) | Project and user permission-file providers for execution configuration. |

### MCP, plugins, and hooks

| Package | Responsibility |
| --- | --- |
| [mcp-core](mcp-core/README.md) | MCP connection lifecycle, authentication state machines, reconnection, and service policies. |
| [mcp-agent-exec](mcp-agent-exec/README.md) | Loads MCP clients into Agent execution with network, authentication, and approval handling. |
| [cursor-plugins](cursor-plugins/README.md) | Plugin manifest parsing, component discovery, loading, and variable handling. |
| [hooks](hooks/README.md) | Hook data structures, phase mapping, compatibility conversion, and response validation. |
| [hooks-carriers](hooks-carriers/README.md) | Collects and renders Hook results for Agent, with context size and shape limits. |
| [hooks-exec](hooks-exec/README.md) | Integrates Hooks into tool execution, including errors, sandbox handling, and tool phases. |

### Storage and context

| Package | Responsibility |
| --- | --- |
| [agent-kv](agent-kv/README.md) | Agent key-value/blob interfaces, serialization, caching, and retries. |
| [agent-store](agent-store/README.md) | Retained storage sync subpackage: indexes, locks, conflicts, and remote transport. |
| [agent-transcript](agent-transcript/README.md) | Execution trace formats, transcript paths, and context stripping for exports. |
| [context](context/README.md) | Execution contexts, scoped values, contextual logging, and abort reasons. |
| [context-rpc](context-rpc/README.md) | Connects caller context to resource RPC and streaming results across execution boundaries. |

### Protocols and foundations

| Package | Responsibility |
| --- | --- |
| [proto](proto/README.md) | Retained generated protocols for Agent, tools, services, and related messages. |
| [redacted-protos](redacted-protos/README.md) | Protocol-specific redacted representations for diagnostics and restricted data views. |
| [redaction](redaction/README.md) | Privacy modes, data classification, redaction schemas, and error conversion. |
| [constants](constants/README.md) | Shared identifiers and constants for tools, conversations, Box, and project behavior. |
| [utils](utils/README.md) | Shared helpers for processes, paths, async streams, caches, images, and repository URLs. |
| [git-core](git-core/README.md) | Git subprocess execution and environment construction. |
| [prompt-jsx](prompt-jsx/README.md) | JSX-style components and rendering for model prompt content. |
| [metrics](metrics/README.md) | Shared metric-recording interfaces. |

### Diagnostics and retained integrations

| Package | Responsibility |
| --- | --- |
| [agent-analytics](agent-analytics/README.md) | Commit-scoring types and Git repository helpers. |
| [analytics-client](analytics-client/README.md) | Event conversion, buffering, and deferred buffering. |
| [codebase-telemetry](codebase-telemetry/README.md) | Codebase telemetry sessions, controllers, channels, and privacy handling. |
| [canvas-shared](canvas-shared/README.md) | Retained Cloud Canvas shared representations and helpers. |
| [grok-bot](grok-bot/README.md) | Small shared Bot presentation and marking helpers. |
| [messages-mac](messages-mac/README.md) | Retained macOS Messages paging, phone-number, and wire helpers. |

## Build conventions

Most `dist/*.js` files are maintained release source. Together with recovered `.ts` fragments, they are assembled through
the manifest. Do not delete these dist directories as caches, add per-directory package.json files, or guess missing imports.
Strict TypeScript adapters live in Harness `src/local` and compile through the root build.

[Architecture](../docs/wiki/Architecture.md) · [Development](../docs/wiki/Development.md) ·
[Source recovery](../docs/wiki/Source-Recovery.md) · [Project](../README.md)

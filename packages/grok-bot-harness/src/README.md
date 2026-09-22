# Harness source

Composes the generic Agent into Bot product behavior: prompts, toolsets, memory, and external capability ports.
Host owns application calls and persistence; Harness decides which capabilities a task receives and how they fit together.

| Directory | Start reading |
| --- | --- |
| [runner](runner) | `sand-agent-runner.ts` for composition; prompts, review, and turn lifecycle alongside it |
| [runner/tools](runner/tools) | Tool implementations and sets; `turn-toolset.ts` is one composition entry |
| [ports](ports) | Capabilities supplied externally: Box, user computer, transport, and others |
| [local](local/README.md) | Standalone strict TypeScript adapters for local services |
| [skills](skills), [brain-docs](brain-docs) | Skills and memory documents |
| [automations](automations) | Automation definitions, triggers, and execution |

Outside `local`, recovered fragments still depend on original bundle scope; this entire tree is not a standalone TypeScript project.
Preserve original service paths and select local adapters conditionally.

[Harness](../README.md) · [Agent](../../agent/README.md) · [Development](../../../docs/wiki/Development.md)

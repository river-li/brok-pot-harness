# Eval runner

Retained evaluation runner with prompt, inference, environment, and protocol code.
The local desktop does not depend on it; evaluation execution is outside the verified recovery scope.

| Entry point | Purpose |
| --- | --- |
| [main.ts](main.ts) | Evaluation entry |
| [prompt.ts](prompt.ts), [inference.ts](inference.ts) | Evaluation prompt and inference |
| [environment.ts](environment.ts), [protocol.ts](protocol.ts) | Environment and protocol |
| [local-mcp.ts](local-mcp.ts) | MCP adaptation |

Recovered files do not establish a standalone working evaluation product. Verify runtime dependencies and build mappings
before extending this component.
[Source recovery](../../docs/wiki/Source-Recovery.md) · [Verification](../../docs/wiki/Verification.md)

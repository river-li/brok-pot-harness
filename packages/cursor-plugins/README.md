# cursor-plugins

Plugin manifest parsing, component discovery, loading, and variable handling.

## Start reading

| Entry | Purpose |
| --- | --- |
| [dist/manifest-parser.js](dist/manifest-parser.js) | Manifest Parser |
| [dist/component-discovery.js](dist/component-discovery.js) | Component Discovery |
| [dist/loader.js](dist/loader.js) | Loader |
| [dist/mcp-parser.js](dist/mcp-parser.js) | MCP Parser |

## Change boundaries

Review path validation and variable injection when changing formats. Harness adapters own local installation lifecycle.

Related modules: [mcp-core](../mcp-core/README.md) · [hooks](../hooks/README.md) · [local-exec](../local-exec/README.md). These are reading links, not npm dependency declarations.

Build from the repository root. See [source recovery](../../docs/wiki/Source-Recovery.md) for bundle-scope rules and [development](../../docs/wiki/Development.md) for verification.

[← Package map](../README.md)

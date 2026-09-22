# git-core

Git subprocess execution and environment construction.

## Start reading

| Entry | Purpose |
| --- | --- |
| [dist/git-exec.js](dist/git-exec.js) | Git Exec |
| [dist/process-env.js](dist/process-env.js) | Process Env |

## Change boundaries

Keep authentication variables scoped to the intended subprocess and out of logs.

Related modules: [utils](../utils/README.md) · [agent-analytics](../agent-analytics/README.md). These are reading links, not npm dependency declarations.

Build from the repository root. See [source recovery](../../docs/wiki/Source-Recovery.md) for bundle-scope rules and [development](../../docs/wiki/Development.md) for verification.

[← Package map](../README.md)

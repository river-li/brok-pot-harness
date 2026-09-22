# agent-client

Connects to an Agent, drives turns, and detects stalled interactions.

## Start reading

| Entry | Purpose |
| --- | --- |
| [dist/connect.js](dist/connect.js) | Connect |
| [dist/turn-runner.js](dist/turn-runner.js) | Turn Runner |
| [dist/interaction-controller.js](dist/interaction-controller.js) | Interaction Controller |
| [dist/stall-detector.js](dist/stall-detector.js) | Stall Detector |

## Change boundaries

Review disconnection, turn completion, and stall handling together rather than changing only a waiting indicator.

Related modules: [agent](../agent/README.md) · [agent-core](../agent-core/README.md). These are reading links, not npm dependency declarations.

Build from the repository root. See [source recovery](../../docs/wiki/Source-Recovery.md) for bundle-scope rules and [development](../../docs/wiki/Development.md) for verification.

[← Package map](../README.md)

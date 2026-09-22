# grok-bot-harness maintenance

Agent orchestration, tool composition, prompts, memory and MCP execution.

Follow the repository AGENTS.md. Preserve emitted identifiers and recovered-fragment markers.
These files are reconstructed in bundle scope; do not invent standalone imports
or replace newer upstream behavior with older code. Keep vendor paths intact
and apply local adaptations conditionally. Build from the repository root and
run the tests appropriate to the changed component.

# vendor maintenance

Copied upstream dependency and desktop resources; not application state or credentials.

Follow the repository AGENTS.md. Treat these files as upstream resources/baselines. Preserve licenses and provenance.
Do not bulk-format, silently upgrade binaries or edit shipped bundles to implement
local fixes. Runtime dependencies must remain self-contained and platform-matched.

Retain upstream resource bytes, licenses and package metadata; do not reformat
vendor code to satisfy whitespace checks. The vendor Git attribute preserves
that format. Update local-resource-manifest.json when replacing an asset.

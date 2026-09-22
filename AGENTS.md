# Repository guidance

## Scope and fidelity

This is the bfe1879 snapshot. Preserve its package paths, module behavior and
version. Local functionality is conditional: retain vendor login, billing, cloud
provisioning and synchronization implementations, disable them with the local
build profile. Do not restore these services by deleting code or bypassing
original action approvals. Eval execution is not required for current recovery.

## Source and build

The repository root is the build root. Read README.md and MIGRATION_STATUS.md.
Recovered files are emitted bundle fragments, not standalone TypeScript modules.
Preserve `// @recovered-fragment i/n` boundaries, original generated identifiers
and fragment order. Do not bulk-format legacy sources or add guessed imports.
Local adapters under packages/grok-bot-harness/src/local are strict TypeScript.
Builds reconstruct .runtime/build from reconstruction-manifest.json; never edit
.runtime outputs to implement changes. sand-host is the immutable release
baseline. Native layout and newer upstream changes take precedence over an old
implementation copied from another checkout.

## Commands and evidence

Use npm run build, npm run check:local and relevant runtime/tests checks.
Use npm run prepare:desktop after desktop edits. npm start runs only this
repository's gbh-local stack; gateway 1540, noVNC 6180/6181. Check service readiness
before live tests. Inspect test coverage before claiming a component works:
fixture-model tests prove local execution, not external inference. Keep the
migration status accurate; do not inherit another version's passing claim.

## Isolation and credentials

Keep resources needed at runtime inside this repository. Do not symlink to the
old checkout or installed Grok Bot.app. Never copy .env, gateway tokens, profiles
or application data from another repository. Use environment variables for model
keys, never print them or raw environments. Do not change other Compose stacks.
Tests should use private data/containers, clean up their own processes and retain
only useful diagnostics under ignored .runtime/tests.

## Documentation and changes

README files describe module responsibilities and operational use. Scoped
AGENTS files add maintenance constraints at component boundaries. Update both
when their directory's build, ownership or interfaces change. Prefer focused
patches, matching nearby naming/style. Run git diff --check before handing off.
Do not commit or publish unless requested. Existing user changes must be preserved.

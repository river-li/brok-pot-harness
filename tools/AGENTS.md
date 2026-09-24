# tools maintenance

Source extraction and clean native-layout export. Recovery does not overwrite maintained sources.

Follow the repository AGENTS.md. Keep generated output under .runtime and preserve local/original profiles.
Use only this repository’s gbh-local services and test-owned processes. Never
copy credentials or infer successful execution from syntax checks alone.


Documentation exports must preserve source Markdown and rewrite navigation for
the separate GitHub Wiki repository. Keep generated output under .runtime, never
include credentials or user data, and reject unowned output directories. Export
commands must not push or alter remotes. Test page/asset/source links and invalid
inputs before changing the exporter.

The Pages generator stages canonical Markdown, explicitly linked public media,
and the exact theme assets allowlisted in `tools/docs-site.py` under ignored
`.runtime/docs-site/`; do not publish symlink trees, runtime data, profiles,
private diagnostics, or implementation bundles. Validate that explicit inputs
have no symlinked path components, and keep the Material theme output allowlist
narrow. Pin non-documentation source links to the built source commit and keep generated files out of Git. See
[Publishing](../docs/wiki/Publishing.md) for site setup, preview, artifact
validation, rollback, and the distinct PR-validation/main-publication paths.
Cover source rewrites and output exclusions in `test_docs_site.py`, renderer
behavior with its Node fake-DOM test, and Markdown/parser output with the docs
dependency regression in `docs_site_markdown_regression.py`. Run `npm run docs:check`,
`npm run docs:site:build`, and `npm run docs:site:verify`; inspect the local
browser preview for routed links, anchors, media, details blocks, and Mermaid.

CI helpers and their regression tests live under tools/ci and tools/test_ci_gates.py.
Keep the required runner offline, preserve its source/base checkout reporting, and
include the scoped-guide audit through npm run docs:check. Follow the
[maintainer workflow](../docs/wiki/Agent-Maintainer-Playbook.md) for issue ownership,
main-based PRs, and independent review.

The repository-owned maintenance CLI lives in maintenance.py and
maintenance_workflow/. Keep task setup based on fetched origin/main without
switching or resetting the primary checkout. Triage and PR readiness stay
read-only, pin GitHub queries to the canonical repository for origin, and emit
sanitized evidence only. The stale-label action may remove only the review labels
documented in the maintainer workflow; it must execute trusted main-branch code
with `contents:read` and `pull-requests:write` permissions and never run PR code
with its token. PR label removal uses pull request write permission even though
the shared REST route is under Issues. Bind process
verdicts to a designated GitHub account while keeping the reviewer agent role
distinct from the implementation author. An explicitly designated coordinator
may review when distinct from the author; GitHub account metadata cannot prove
agent identity.

`check-guidance.py` defines source components as directories under its listed
maintained-source roots that have both a README and direct implementation
files. It prunes `node_modules`, `.runtime`, and known language/tool caches
before descending. Do not blanket-ignore `dist`: recovered emitted files in
package `dist/` directories are maintained source here. Keep the source suffix
list accurate when this repository adds a language, and add direct `AGENTS.md`
guidance when a component README is added. Do not expand the check to release
baselines, vendor assets, or documentation-only folders.

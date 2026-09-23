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

CI helpers and their regression tests live under tools/ci and tools/test_ci_gates.py.
Keep the required runner offline, preserve its source/base checkout reporting, and
include the scoped-guide audit through npm run docs:check. Follow the
[maintainer workflow](../docs/wiki/Agent-Maintainer-Playbook.md) for issue ownership,
main-based PRs, and independent review.

`check-guidance.py` defines source components as directories under its listed
maintained-source roots that have both a README and direct implementation
files. It prunes `node_modules`, `.runtime`, and known language/tool caches
before descending. Do not blanket-ignore `dist`: recovered emitted files in
package `dist/` directories are maintained source here. Keep the source suffix
list accurate when this repository adds a language, and add direct `AGENTS.md`
guidance when a component README is added. Do not expand the check to release
baselines, vendor assets, or documentation-only folders.

# tools maintenance

Source extraction, clean native-layout export, and offline CI validation. Recovery does not overwrite maintained sources.

Follow the repository AGENTS.md. Keep generated output under .runtime and preserve local/original profiles.
Use only this repository’s gbh-local services and test-owned processes. Never
copy credentials or infer successful execution from syntax checks alone.


Documentation exports must preserve source Markdown and rewrite navigation for
the separate GitHub Wiki repository. Keep generated output under .runtime, never
include credentials or user data, and reject unowned output directories. Export
commands must not push or alter remotes. Test page/asset/source links and invalid
inputs before changing the exporter.

CI helpers run existing repository commands, keep generated evidence under `.runtime`, and write only gate metadata to
uploadable summaries. Do not include credentials, prompts, transcripts, screenshots, or raw logs in CI artifacts.

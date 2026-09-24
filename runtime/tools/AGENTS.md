# tools maintenance

Bundle reconstruction and desktop staging with explicit local/original profiles.

Follow the repository AGENTS.md. Keep generated output under .runtime and preserve local/original profiles.
Use only this repository’s gbh-local services and test-owned processes. Never
copy credentials or infer successful execution from syntax checks alone.

The macOS packager's default mode remains the local checkout-aware app. Its
explicit `--remote` mode must produce an independent connection client, with a
distinct app/profile identity and no absolute project path or local token-file
lookup. Keep server and client packaging separate; never bundle provider keys,
Gateway tokens, or profiles.

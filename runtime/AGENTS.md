# runtime maintenance

Build profiles, Docker/desktop launchers, maintained desktop assets and verification tools.

Follow the repository AGENTS.md. Keep generated output under .runtime and preserve local/original profiles.
Use only this repository’s gbh-local services and test-owned processes. Never
copy credentials or infer successful execution from syntax checks alone.

Launch changes must preserve the default pinned image and read-only Host mounts.
The optional Compose overlay is explicitly selected, not automatically loaded.
Validate configuration with `docker compose config` using dummy credentials;
never print the real resolved environment. Document root-relative overlay paths
and Compose-relative mount paths separately.

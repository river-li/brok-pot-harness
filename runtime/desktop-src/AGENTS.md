# desktop-src maintenance

Retained desktop main-process bundles with conditional local workspace adapters.

Follow the repository AGENTS.md. Keep generated output under .runtime and preserve local/original profiles.
Use only this repository’s gbh-local services and test-owned processes. Never
copy credentials or infer successful execution from syntax checks alone.

Local startup must not initialize inherited Keychain storage by default. Keep
local-keychain.cjs policy, machine identity persistence and startup audit tests
in sync. Never replace encrypted secrets with plaintext disk persistence.

# Build profile implementation

User-facing options are in [Configuration](../docs/wiki/Configuration.md#build-time-feature-switches).
This page explains how policy reaches Host, desktop, and renderer.

## Policy source

[build-profiles.json](build-profiles.json) defines `local` and `original`, defaulting to local.
`localWorkspace` selects account-service policy as a group; vendor login, billing, provisioning, and sync code remain present.
Feature fields in generated `build-profile.json` describe the resulting policy, not independent editable switches.

[build_profile.py](tools/build_profile.py) is shared by Host reconstruction and desktop assembly.
The generated local entry sets `GROKBOT_LOCAL_MODE` before application code loads, points backend fallbacks at a loopback sentinel, defaults the Gateway to `127.0.0.1:1540`, and disables the development control plane, production Box attachment, telemetry, and analytics. An explicit `SAND_HOST_GATEWAY_URL` is kept for a self-hosted Gateway. The renderer receives the same profile policy and replaces the vendor connectivity hint with a configured-Host message. An inherited shell value cannot switch an already-built local artifact to original.

The original profile only sets `GROKBOT_LOCAL_MODE=0`; it retains its existing vendor backend defaults and does not receive local Gateway or cloud-switch overrides.

## Output isolation

| Content | local | original |
| --- | --- | --- |
| Host | `.runtime/build` | `.runtime/build-original` |
| Desktop | `.runtime/desktop` | `.runtime/desktop-original` |
| Development desktop data | `.runtime/profiles/desktop` | `.runtime/profiles/desktop-original` |

Both profiles use the same maintained source. Rebuild and prepare to change profiles.
`npm start` manages local Compose and rejects a non-local Host build.
The desktop launcher's `--profile original` uses a separate profile without injecting local Gateway/backend settings.

## Runtime experiments

Retained gates such as `sand_enable_account_switching` and `sand_transcript_server_tail` still govern their original paths.
Allowing original paths neither forces those gates on nor proves service availability.
`SAND_FEATURE_GATE_OVERRIDES` and `SAND_DYNAMIC_CONFIG_OVERRIDES` keep their original development/override rules;
they cannot re-enable account services disabled by the local profile.

When adding a setting, decide whether it belongs to build policy, runtime environment, or user Settings.
Avoid conflicting configuration sources for the same behavior.

## Verify changes

Build both profiles and run `npm run test:runtime-build` after policy changes.
Check policy load order, output isolation, and desktop consistency. Original-profile build inspection does not require login
or remote provisioning. Release baselines remain under `sand-host` and `vendor/desktop`; local conditions belong in maintained source.

[Source recovery](../docs/wiki/Source-Recovery.md) · [Runtime](README.md)

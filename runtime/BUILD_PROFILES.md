# Build profiles

The original login, billing, cloud provisioning and synchronization code is
retained. Local builds disable those paths and use the local workspace adapters.
They do not delete the original account UI or replace its implementation.

`runtime/build-profiles.json` selects the workspace mode. The current profiles
switch the account-dependent services together; the fields in generated
`build-profile.json` describe that policy, not independent settings to edit.
Original runtime feature gates, such as `sand_enable_account_switching` and
`sand_transcript_server_tail`, still apply when the original paths are allowed.
Allowing an original path does not force its vendor feature gate on.

The retained experiments layer also reads `SAND_FEATURE_GATE_OVERRIDES` and
`SAND_DYNAMIC_CONFIG_OVERRIDES`, with its original development/override rules.
Those runtime experiment switches are separate from the build's workspace mode;
they cannot turn vendor account services back on in a local build.

| Profile | Login / billing / cloud provisioning / remote sync | Execution |
| --- | --- | --- |
| `local` (default) | Disabled, implementation retained | Local host, Box and user-configured model API |
| `original` | Original paths allowed | Retained vendor integration and its original prerequisites |

Build and run the local app:

```sh
npm run build -- --profile local
npm run prepare:desktop -- --profile local
npm start
npm run start:desktop -- --profile local
```

Build the original profile without starting or contacting vendor services:

```sh
npm run build -- --profile original
npm run prepare:desktop -- --profile original
```

The two profiles have separate outputs: `.runtime/build` / `.runtime/desktop`
and `.runtime/build-original` / `.runtime/desktop-original`. Both are built from
the same editable sources. The generated entrypoint loads its profile before
application code and selects `GROKBOT_LOCAL_MODE`; a stale shell environment
cannot silently change the built mode. The renderer receives the same policy.
Rebuild to switch profiles. `npm start` is specifically the local Compose
launcher and rejects a non-local host build.

The desktop launcher also accepts `--profile original` and uses a separate
`.runtime/profiles/desktop-original` user-data directory. It does not inject the
local gateway or local backend settings into that launch. Do not interpret the
original profile as verification of vendor authentication, entitlement or cloud
availability: those services have not been exercised during local recovery.
The original profile is built and inspected without logging in or provisioning
anything remotely.

The byte-for-byte release baselines remain under `sand-host` and
`vendor/desktop`. Reconstructed sources retain the original code paths alongside
local adapters. This is conditional activation rather than dead-code removal.

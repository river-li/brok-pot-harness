# Configuration

Configuration has three layers: **build profile, startup environment, and desktop Settings**.
Start with [`.env.example`](../../.env.example); do not store settings by editing generated bundles.

## Sources and precedence

| Launch path | Configuration source |
| --- | --- |
| `npm start`, `npm run start:desktop` | Nonempty root `.env` values for `GROKBOT_*` / `LITELLM_API_KEY`, then inherited shell values |
| Packaged `.app` | Process environment and packaged Host location; does not load the root `.env` automatically |
| Host container | Variables explicitly passed through Compose by the launcher |
| Desktop Settings | Workspace / machine settings saved by the Host |

**Nonempty root `.env` values override the shell; empty values do not.** Run `npm start` after changing the key.
The Host inference adapter uses the model key; desktop launchers remove inherited `LITELLM_API_KEY`.

The `.env` loader does not import arbitrary `SAND_*` variables. Set container variables through a Compose overlay's
`environment` section, and desktop variables through the startup shell. See [config.cjs](../../runtime/config.cjs).

## Model API

| Variable | Value / default | Purpose |
| --- | --- | --- |
| `GROKBOT_RESPONSES_BASE_URL` | Set your Responses base URL | The adapter appends `/responses` |
| `GROKBOT_MODEL` | Set a provider-supported model ID | Used for inference and local Auto-review |
| `LITELLM_API_KEY` | Your service key | Set in `.env` or shell; may be blank for an unauthenticated service |
| `GROKBOT_REASONING_EFFORT` | `low` | Choose a reasoning level supported by the model and service |
| `GROKBOT_CONTEXT_TOKENS` | `128000` | Adapter context budget; match it to the model |
| `GROKBOT_INFERENCE_TIMEOUT_MS` | `180000` | Per-request inference timeout in milliseconds |
| `GROKBOT_CONTAINER_API_URL` | Computed when unset | Override the model URL used by the Host container |

Replace the URL, model, and key placeholders:

```dotenv
GROKBOT_RESPONSES_BASE_URL=https://api.example.com/v1
GROKBOT_MODEL=your-model-id
LITELLM_API_KEY=your-api-key
```

For an API running on the host, a URL such as `http://127.0.0.1:4000/v1` is supported. The launcher translates
`localhost` / `127.0.0.1` to `host.docker.internal` for the container. The service must accept connections from Docker.
Set `GROKBOT_CONTAINER_API_URL` only when host and container need different addresses.

## Build-time feature switches

Profiles are defined in [build-profiles.json](../../runtime/build-profiles.json). The default is `local`.

| Behavior | `local` | `original` |
| --- | --- | --- |
| Workspace / inference | Local Host, sandbox, and your API | Retained original service paths |
| Vendor login, billing, cloud provisioning, remote sync | Disabled together; implementation retained | Original paths allowed, still requiring their services and authorization |
| Tools and approvals | Retained | Retained |

```sh
npm run build -- --profile local
npm run prepare:desktop -- --profile local
```

Use `original` in both commands to build that profile. Output and development desktop profiles are separate;
`npm start` manages only the local backend. The four account-dependent services are currently switched **as a group**
through `localWorkspace`. There are no independent `DISABLE_BILLING` flags or general per-service pruning switches.

Retained runtime experiments, including `SAND_FEATURE_GATE_OVERRIDES` and `SAND_DYNAMIC_CONFIG_OVERRIDES`,
follow their original development-mode rules. They cannot re-enable account services disabled by the local profile.
See [build profile implementation](../../runtime/BUILD_PROFILES.md).

## Desktop and services

| Variable | Default | Apply changes with |
| --- | --- | --- |
| `GROKBOT_LOCAL_VOICE` | `1`, show the local call entry | Restart the desktop |
| `GROKBOT_LOCAL_KEYCHAIN` | `0`, disable optional desktop encrypted storage | Restart the desktop; enabling may prompt for macOS access |
| `GROKBOT_SEARCH_BASE_URL` | `http://search:8080` | `npm start` |
| `GROKBOT_TRANSCRIPTION_BASE_URL` | `http://speech:8000` | `npm start` |
| `GROKBOT_TTS_BASE_URL` | `http://speech:8000` | `npm start` |
| `GROKBOT_SPEECH_THREADS` | `4` | `npm start` |

`GROKBOT_LOCAL_VOICE=0` hides the call entry only. Dictation, previews, and the speech container remain available.
Default service URLs use Compose network names; no personal LAN address is required.
Full calls still need broader verification; see [Features](Features.md).

## Sandbox and permissions

| Option | Default | Details |
| --- | --- | --- |
| `GROKBOT_SANDBOX_IMAGE` | Digest-pinned Box image from Compose | [Custom image](Sandbox.md#custom-image) |
| `GROKBOT_WORKSPACE_DIR` | Repository `.runtime/workspace` | [Project mount](Sandbox.md#mount-a-project) |
| `GROKBOT_COMPOSE_OVERRIDE` | No extra configuration | [Compose overlay](Sandbox.md#add-extra-mounts) |
| Mac execution in Settings | `ask` | [ask / never / always](Permissions.md#mac-tool-permissions) |
| Auto-review in Settings | Application toggle and instructions | [Review modes](Permissions.md#auto-review) |
| `SAND_AUTO_REVIEW_MODE` | Selected by the retained review logic | Set `enforce`, `shadow`, or `off` explicitly in an overlay |

Apply Docker image, environment, and mount changes with `npm start`.
See [Permissions](Permissions.md) for how the controls interact.

---
[Documentation](Home.md) · [Get started](Build-Guide.md) · [Configuration](Configuration.md) · [Project](../../README.md)

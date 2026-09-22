# Host extension map

Host organizes sessions, inference, permissions, Box, and optional services as lifecycle extensions.
[registry.ts](registry.ts) registers them; each `extension.ts` declares an ID, dependencies, startup, and cleanup.
The [Dune boot coordinator](../../../dune/src/host-extensions/boot.ts) orders dependencies and detects missing peers or cycles.

## Read the core path first

`session` owns persistent sessions; `transcript` handles messages and run scheduling;
`turn-execution` supplies execution services; `inference` supplies models and related capabilities.
The Harness composes Agent behavior in `packages/grok-bot-harness`.
Start with `local-exec` / `local-tool-permission` for Mac tools, or `mcp` for tool-service integration.

The groups below describe responsibilities. Retained registration code does not mean a remote service is enabled
in the local profile. Each guide includes dependencies extracted from source and concrete implementation entry points.

## Identity, settings, and permissions

| Extension | Responsibility |
| --- | --- |
| [auth](auth/README.md) | Host identity, credential renewal, and selected-team context. |
| [settings](settings/README.md) | Persists workspace settings and publishes changes to other extensions. |
| [experiments](experiments/README.md) | Supplies feature gates, dynamic configuration, and development overrides. |
| [privacy-mode](privacy-mode/README.md) | Manages privacy mode and shared privacy state. |
| [local-tool-permission](local-tool-permission/README.md) | Resolves ask / never / always policies for Mac tools and handles approval requests. |
| [auto-review](auto-review/README.md) | Provides automatic tool-action review and waits for review outcomes. |
| [action-audit](action-audit/README.md) | Records action audits and connects the audit backend. |
| [team-admin-policy](team-admin-policy/README.md) | Exposes team administration policy to dependent services. |

## Conversations and tasks

| Extension | Responsibility |
| --- | --- |
| [session](session/README.md) | Creates and recovers Agent sessions, databases, state, and persistence paths. |
| [transcript](transcript/README.md) | Accepts messages, schedules turns, coordinates Agent lifecycle, and stores transcripts. |
| [turn-execution](turn-execution/README.md) | Provides execution services for an individual turn. |
| [server-agent-proxy](server-agent-proxy/README.md) | Proxies server-side Agent interactions and idle lifecycle. |
| [agent-identity](agent-identity/README.md) | Manages Agent names, identity capabilities, and historical identity backfills. |
| [resume-ownership](resume-ownership/README.md) | Coordinates run-resume ownership, Box rooms, and migration barriers. |
| [state-backstop](state-backstop/README.md) | Provides fallback handling for Host state. |
| [transcript-publish](transcript-publish/README.md) | Publishes transcript entries to subscribers. |
| [content-search](content-search/README.md) | Indexes and searches Agent content. |
| [memory](memory/README.md) | Manages Agent memory state, synthesis, and retained sync paths. |

## Models, tools, and execution

| Extension | Responsibility |
| --- | --- |
| [inference](inference/README.md) | Provides model inference, web tools, transcription, and voice previews to the Host. |
| [mcp](mcp/README.md) | Manages Host MCP services and installs plugin Skills into the workspace. |
| [local-exec](local-exec/README.md) | Bridges execution requests to the user's computer through Gateway or server adapters. |
| [forever-box](forever-box/README.md) | Manages the long-lived Box and disk-pressure handling. |
| [box-lifecycle](box-lifecycle/README.md) | Coordinates Box lifecycle events. |
| [box-timezone](box-timezone/README.md) | Manages Box timezone configuration. |
| [attachments](attachments/README.md) | Attachment storage, image/video renditions, and retained image-generation interfaces. |

## Credentials and browser

| Extension | Responsibility |
| --- | --- |
| [secrets](secrets/README.md) | Stores Bot secrets and manages carrying them between Bots. |
| [credential-provider](credential-provider/README.md) | Coordinates credential providers, browser filling, and verification follow-ups. |
| [credential-fill](credential-fill/README.md) | Executes and clears credential filling through browser control. |
| [user-form-vault](user-form-vault/README.md) | Stores and manages user form data. |
| [chrome-cookie-import](chrome-cookie-import/README.md) | Retains the Chrome cookie-import service. |
| [cookie-origin-approval](cookie-origin-approval/README.md) | Provides origin-scoped approval for cookie use. |
| [browser-ua](browser-ua/README.md) | Manages browser user agents, fingerprints, and Web Bot markers. |
| [webauthn-proxy](webauthn-proxy/README.md) | Proxies browser WebAuthn requests. |

## Automation and retained services

| Extension | Responsibility |
| --- | --- |
| [automations](automations/README.md) | Automation triggers, manual runs, listener integrations, and retained cloud sync. |
| [cloud-agents](cloud-agents/README.md) | Retains cloud Agent polling, update streams, and artifact caching. |
| [box-store-sync](box-store-sync/README.md) | Object-store synchronization, snapshots, packing, and transfer for Box state. |
| [remote-agent-messaging](remote-agent-messaging/README.md) | Retains remote Agent communication and member-turn coordination. |
| [notify-bus](notify-bus/README.md) | Connects the notification bus and provides a notification client. |
| [notifications](notifications/README.md) | Notification extension and mobile push delivery. |
| [email](email/README.md) | Retains email-service integration. |
| [messages-grants](messages-grants/README.md) | Manages Messages permission requests and their expiry. |
| [cycle-usage](cycle-usage/README.md) | Reads and exposes usage-cycle information. |
| [managed-setup](managed-setup/README.md) | Manages deployment settings, team rules, and managed Skills. |
| [user-skills-cache](user-skills-cache/README.md) | Caches and organizes user Skill files. |
| [bot-template-share](bot-template-share/README.md) | Stores and shares Bot templates. |
| [working-state-export](working-state-export/README.md) | Exports working state and manages warming eligibility. |

## Diagnostics and desktop support

| Extension | Responsibility |
| --- | --- |
| [telemetry](telemetry/README.md) | Aggregates Host diagnostics, structured logs, metrics, and lifecycle events. |
| [codebase-telemetry](codebase-telemetry/README.md) | Connects codebase snapshots and telemetry controllers to the Host. |
| [source-map](source-map/README.md) | Provides source-map diagnostic services. |
| [host-upgrade](host-upgrade/README.md) | Retains Host bundle acquisition, upgrades, and upgrade markers. |
| [feedback](feedback/README.md) | Handles feedback sampling, prompt storage, and product feedback. |
| [teach-recording](teach-recording/README.md) | Provides the Host teaching-recording service. |
| [trays](trays/README.md) | Manages tray-related Host state and services. |
| [wallpaper](wallpaper/README.md) | Manages the Box desktop wallpaper. |

## Change an extension

Read `extension.ts` dependencies before the service implementation. For interface changes, locate `context.deps` callers.
Preserve `onStop` cleanup and asynchronous cancellation; never implement changes directly in `.runtime` outputs.
Changes to the extension set also involve [extension-ids.generated.ts](extension-ids.generated.ts) and the registry.

[Host](../README.md) · [Architecture](../../../docs/wiki/Architecture.md) ·
[Build profiles](../../../docs/wiki/Configuration.md#build-time-feature-switches) · [Development](../../../docs/wiki/Development.md)

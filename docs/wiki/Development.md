# Development

Read [Architecture](Architecture.md), then the target directory's README and AGENTS.md.
Build from the repository root. Do not initialize new npm packages inside recovered directories or rearrange their layout.

## Find the code for your change

| Change | Start reading | Relevant checks |
| --- | --- | --- |
| Model requests, streaming events, tool results | [responses.ts](../../packages/grok-bot-harness/src/local/responses.ts) | Responses contracts and live API test |
| Toolsets or prompts | [Harness runner](../../packages/grok-bot-harness/src/runner), [Agent](../../packages/agent/README.md) | Rebuild and relevant Agent/sandbox integration |
| Host messages and run lifecycle | [transcript](../../src/host/extensions/transcript/README.md), [turn-execution](../../src/host/extensions/turn-execution/README.md) | Host build and desktop task integration |
| Mac permissions and approval | [local-tool-permission](../../src/host/extensions/local-tool-permission/README.md), [auto-review](../../src/host/extensions/auto-review/README.md) | Review contracts and Mac execution tests |
| MCP/plugin lifecycle | [Local adapters](../../packages/grok-bot-harness/src/local/README.md) | Scope, store, plugin-files, and live tests |
| Electron startup, Keychain, Dock icon | [desktop-src](../../runtime/desktop-src/README.md) | Prepare, Keychain contracts, desktop startup |
| UI, settings presentation, CSP | [renderer-src](../../runtime/renderer-src/README.md) | Prepare and relevant desktop interaction |
| Images, mounts, launch configuration | [runtime](../../runtime/README.md) | Compose configuration and startup |
| Recognition or synthesis | [speech](../../runtime/speech/README.md) | Service contracts, offline models, desktop audio |
| Bundle reconstruction and mappings | [Source recovery](Source-Recovery.md) | Recovery and runtime-build tests |
| Documentation and Wiki export | [Publishing](Publishing.md), [exporter](../../tools/export-wiki.py) | `docs:check`, exporter tests, preview |
| CI gates and evidence | [CI tiers](CI.md), [test guide](../../runtime/tests/README.md) | Required offline gates; optional Docker, provider, or macOS lane by change area |

## Edit and rebuild

1. Edit maintained source. Preserve original paths and put local behavior behind profile conditions.
2. Run strict local TypeScript checks and build.
3. Run tests for the affected behavior; prepare again after desktop changes.
4. Update user-facing and module documentation, then inspect the diff.

```sh
npm run check:local
npm run build -- --profile local
npm run test:runtime-build
git diff --check
```

For desktop changes, also run `npm run prepare:desktop -- --profile local`, quit the old desktop, and launch again.
Restart the backend after rebuilding Host code. Environment or mount changes require `npm start`.
See [Packaging](Packaging.md) for icon and app changes.

## Choose tests

The [test guide](../../runtime/tests/README.md) groups commands by dependency and purpose.
Contracts verify protocols, boundaries, and errors. Live API/UI tests verify external services and complete flows.
A deterministic model fixture can prove tool execution, but not real provider availability.
The [CI tiers guide](CI.md) names the required PR check, optional changed-area lanes, evidence artifacts, and runner prerequisites.

Run tests sharing a Box or display serially, or give them separate containers and profiles.
Tests must clean up only their own resources. Existing evidence and coverage gaps are in [Verification](Verification.md).

## Documentation conventions

- English is canonical. Keep translations in separate files such as `README.zh.md`, with language navigation.
- The project README explains the value, shows real results, and gives a short working quickstart.
- Wiki pages separate tutorials, configuration, architecture, and maintenance. Define settings in one reference.
- Directory READMEs explain responsibilities and entry points; AGENTS.md files define maintenance constraints.
- Use generic domains and paths. Project-default loopback ports and Compose service names are useful operational examples.
- Use isolated tasks for media, disclose time compression, and follow [recording notes](../media/README.md).

Run `npm run docs:check` after edits. The Wiki export handles its separate repository and URL conventions;
see [Publishing](Publishing.md).

## Commits and resources

Group changes by feature, keeping documentation, branding, and runtime logic reviewable separately.
Preserve upstream metadata, licenses, and provenance hashes. Do not reformat third-party resources.
Do not commit `.env`, `.runtime`, `dist`, `node_modules`, model keys, Gateway tokens, or user sessions.

---
[Documentation](Home.md) · [Get started](Build-Guide.md) · [Configuration](Configuration.md) · [Project](../../README.md)

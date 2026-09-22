# Features

GBH connects desktop conversations, agent execution, and a file workspace.
The default local build uses your model endpoint and runs the Host and Linux sandbox through Docker.

## Tasks and working files

Agents can read and write files, run Linux commands, inspect the display, and feed tool results back to the model.
Mount a project at `/workspace` and open the resulting files directly on your computer.
The desktop retains conversations, execution events, and replies for ongoing work with a Bot.

[Run your first task](Build-Guide.md#4-complete-your-first-task) · [Mount a project](Sandbox.md)

## Models and integrations

- **Responses API:** configurable URL, model, key, context budget, and timeout, with streaming tool calls.
- **MCP:** stdio / HTTP / SSE connections, workspace and inline configurations, scoped clients.
- **Plugins and Skills:** local import, installation, updates, and removal of reusable capabilities.
- **Web tools:** WebFetch content extraction and a local SearXNG search service.

[Model configuration](Configuration.md) · [Integration guide](Extensions.md)

## Desktop and speech

The retained desktop interface supports a local workspace, a custom icon, and macOS `.app` packaging.
Dictation uses CPU Whisper; Bot voice previews use Kokoro. After caching their models, speech inference runs locally.
Audio does not need to be sent to the model provider; submitting recognized text still invokes your configured model API.

[Package the app](Packaging.md) · [Speech service details](../../runtime/speech/README.md)

## Support status

| Status | Capabilities |
| --- | --- |
| Current-version integration coverage | Desktop → real model → sandbox → persisted reply; file operations and screenshots; MCP/plugins; English/Chinese dictation and voice previews |
| Adapter and contract coverage | Responses, Auto-review, WebFetch, WebSearch, speech interfaces, scope isolation |
| Retained implementations needing broader validation | Full calls, physical microphones/speakers, Mac execution and GUI, file transfer, attachments, recording workflows |
| Still need local adapters | Image/avatar generation, local Messages integration, additional TTS languages |
| Disabled in the local profile | Vendor login, billing, cloud provisioning, remote sync |

The verified desktop platform is Intel macOS. Image generation and full voice calls are not listed as completed features.
Building `original` does not establish that vendor services work. See [Verification](Verification.md) for evidence and limits.

---
[Documentation](Home.md) · [Get started](Build-Guide.md) · [Configuration](Configuration.md) · [Project](../../README.md)

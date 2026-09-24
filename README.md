# Grokbot Harness

**Give your agent a workspace. Get working files back.**

Grokbot Harness (GBH) is a desktop workspace you build and run yourself. Connect a Responses API
and let an agent work with files, run commands, and research the web inside a local Linux sandbox.
Extend its tools with MCP and Skills, then follow the work from one desktop conversation.

English · [Chinese README](README.zh.md) · [Hosted documentation](https://zichuan.li/brok-pot-harness/) · [Documentation source](docs/wiki/Home.md)

## Start here

- **Install** — [Build GBH and run your first task](docs/wiki/Build-Guide.md).
- **Configure** — [Connect a model and choose runtime options](docs/wiki/Configuration.md).
- **Run remotely** — [Deploy a persistent server and connect a separate desktop](docs/wiki/Remote-Server.md).
- **Understand** — [Explore the architecture and request flow](docs/wiki/Architecture.md).
- **Extend** — [Add MCP servers, plugins, and Skills](docs/wiki/Extensions.md).

The default `local` build runs without a vendor account and disables vendor login, billing,
cloud provisioning, and remote sync. Inference requests go to the API you configure;
model providers, search engines, and MCP tools may use the network.

<p align="center">
  <a href="docs/media/agent-demo.mp4"><img src="docs/media/agent-result.png" width="900" alt="The agent created and read back a Markdown checklist in the sandbox, then displayed the result in the desktop app" /></a>
</p>
<p align="center"><sub>A real task: send a request → create a checklist → read it back → deliver the result.</sub><br />
  <a href="docs/media/agent-demo.mp4">Watch the video</a> · <a href="docs/media/agent-result.png">Full screenshot</a>
</p>

<details>
<summary>Watch the agent at work (GIF)</summary>

![Agent task demonstration](docs/media/agent-demo.gif)

Waiting time is compressed. [Recording details and reproduction](docs/media/README.md).

</details>

## From a conversation to a finished task

| Get work done | Make it yours |
| --- | --- |
| **Work with your own files**<br />Mount a project at `/workspace` to read reference material, run scripts, and create deliverables. | **Choose your model**<br />Set a Responses API URL, model ID, and key. Stream replies and tool calls through the same interface. |
| **Connect your tools**<br />Use stdio, HTTP, or SSE MCP servers, and manage local plugins and Skills. | **Control execution**<br />Protect reference files with read-only mounts. Configure Auto-review and Mac tool permissions independently. |
| **Go from web to voice**<br />Search with SearXNG, extract web content, dictate with local Whisper, and preview voices with Kokoro. | **Build your desktop**<br />Package a macOS app with the project icon, customize the sandbox image, and choose your runtime settings. |

## Quickstart

The desktop is currently verified on **Intel macOS**. You need **Node.js 22.16+, Python 3.9+,
npm, Docker Desktop**, and a **Responses API** with streaming and tool-call support.
The first launch downloads container images and speech models.

**1. Install dependencies** from the repository root:

```sh
npm ci
npm ci --prefix runtime
# First-time setup only; edit an existing .env instead of overwriting it.
cp .env.example .env
```

**2. Connect a model.** Replace these placeholders in `.env`:

```dotenv
GROKBOT_RESPONSES_BASE_URL=https://api.example.com/v1
GROKBOT_MODEL=your-model-id
LITELLM_API_KEY=your-api-key
```

`.env` is ignored by Git. You can also supply the key through your shell.
See [configuration and precedence](docs/wiki/Configuration.md) for details.

**3. Build and launch:**

```sh
npm run build -- --profile local
npm run prepare:desktop -- --profile local
npm start
npm run status
# Launch the desktop after the services report healthy.
npm run start:desktop -- --profile local
```

Create a Bot and try: **“Create a project launch checklist in /workspace, save it as Markdown,
then read the file back to check it.”** Files appear in `.runtime/workspace` by default.
Use `npm stop` to stop the backend; your files and conversations remain on disk.

[Full installation guide](docs/wiki/Build-Guide.md) · [Mount your project](docs/wiki/Sandbox.md) ·
[Remote server and desktop client](docs/wiki/Remote-Server.md) ·
[Package the macOS app](docs/wiki/Packaging.md) · [Troubleshooting](docs/wiki/Troubleshooting.md)

### Releases and downloads

Check [GitHub Releases](https://github.com/river-li/brok-pot-harness/releases) for downloadable builds when available.
The [packaging guide](docs/wiki/Packaging.md) explains how to build the desktop app from this source tree.

The [published documentation](https://zichuan.li/brok-pot-harness/) is available online. See
[docs/wiki/Publishing.md](docs/wiki/Publishing.md) to configure Pages for a fork.

## Set up your workspace

- **Models and feature switches** → [API settings, build profiles, and runtime options](docs/wiki/Configuration.md)
- **Execution environment** → [Custom images, mounts, and backups](docs/wiki/Sandbox.md)
- **Tool permissions** → [Auto-review, Mac execution, and Keychain](docs/wiki/Permissions.md)
- **Integrations** → [MCP, plugins, and Skills](docs/wiki/Extensions.md)
- **Codebase** → [Architecture and request flow](docs/wiki/Architecture.md) · [Package map](packages/README.md)

## Development and project scope

GBH adapts retained Grok Bot release code for local use while preserving its package structure.
It is a development preview. Desktop conversations, real-model tool calls, sandbox file operations,
MCP/plugins, dictation, and voice previews have integration coverage. Full voice calls, Mac GUI
workflows, and other features need further work; see [supported features](docs/wiki/Features.md).

Contributions to tool adapters, setup, documentation, and tests are welcome.
The [contributing guide](CONTRIBUTING.md) points to the right modules and checks;
[source recovery](docs/wiki/Source-Recovery.md) explains how this codebase builds.

### Resources and licensing

This repository includes retained upstream code and assets. See [resource provenance](vendor/README.md)
and the notices in each resource directory. Those resources retain their respective license terms;
the project does not declare a single open-source license covering all upstream material.

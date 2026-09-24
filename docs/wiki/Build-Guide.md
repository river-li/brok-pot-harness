# Installation and your first task

This guide starts the desktop and local backend from source. By the end, your agent can create a file
in `/workspace` and you can open it on the host computer. **Run every command from the repository root**,
not from `packages/grok-bot-harness/`.

## 1. Prepare your environment

| Dependency | Requirement |
| --- | --- |
| Platform | Desktop verified on Intel macOS; other platforms need full validation |
| Node.js / npm | Node.js 22.16+; install using the lockfiles |
| Python | 3.9+ for reconstruction and desktop assembly |
| Docker Desktop | Running, with support for `linux/amd64` containers |
| Model endpoint | Responses API with streaming, tool calls, and tool-result replay |

The first installation downloads npm dependencies, Electron, container images, and speech models.
Required retained desktop resources are in the repository; the original Grok Bot.app is not needed.
Check your tools, then install:

```sh
node --version
python3 --version
docker info
npm ci
npm ci --prefix runtime
```

## 2. Configure a model

Create the configuration once. If `.env` already exists, edit it instead:

```sh
cp .env.example .env
chmod 600 .env
```

Replace these placeholders with your provider's settings:

```dotenv
GROKBOT_RESPONSES_BASE_URL=https://api.example.com/v1
GROKBOT_MODEL=your-model-id
LITELLM_API_KEY=your-api-key
```

The base URL usually ends in `/v1`; **do not append `/responses`**. Use a model ID exposed by your provider.
`LITELLM_API_KEY` is the adapter's environment variable name; running LiteLLM is not a requirement.

Alternatively, leave the key blank in `.env` and enter it in the terminal that will start the backend.
For macOS's default zsh:

```sh
read -rs 'LITELLM_API_KEY?API key: '
printf '\n'
export LITELLM_API_KEY
```

Nonempty `.env` values override the shell. Clear or update an old key in `.env` before supplying a new one
through the shell. See [Configuration](Configuration.md) for container access to a host-side API and inference options.

## 3. Build and start the backend

```sh
npm run build -- --profile local
npm run prepare:desktop -- --profile local
npm start
npm run status
```

`build` reconstructs the Host and compiles local adapters. `prepare:desktop` assembles the desktop.
`npm start` launches the `gbh-local` Docker Compose project: Host/sandbox, search, and speech.
Wait for **healthy** status. Initial speech model download and CPU loading can take time;
`npm run logs` shows progress.

## 4. Complete your first task

```sh
npm run start:desktop -- --profile local
```

Create a Bot, open its conversation, and send:

> Create launch-checklist.md in /workspace with a five-item project launch checklist. Read it back to verify the contents, then tell me where it was saved.

The agent uses your model API to plan, executes file operations in the sandbox, and returns a result in the conversation.
By default, `/workspace` maps to the repository's `.runtime/workspace`:

```sh
cat .runtime/workspace/launch-checklist.md
```

If the desktop connects but no model output arrives, see [Model requests do not complete](Troubleshooting.md#model-requests-do-not-complete).
Host health confirms startup, not valid model credentials.

## 5. Start, update, and stop

| Task | Command / action |
| --- | --- |
| Start the backend | `npm start` |
| Open the desktop | `npm run start:desktop -- --profile local` |
| Inspect status / logs | `npm run status` / `npm run logs` |
| Stop the backend and keep data | `npm stop` |
| Change a key, URL, image, or mount | Edit `.env` / overlay, then run `npm start` |
| Change Host source | Finish active tasks, rebuild, then `node runtime/manage.cjs restart` |
| Change desktop code or local adapters | Rebuild, prepare, quit and relaunch the desktop; restart the backend if affected |

Closing the desktop does not stop Docker. `restart` only restarts existing containers; it does not update their
environment. Use `npm start` for configuration changes. See [Sandbox and data](Sandbox.md) for storage and backup paths.

## Next steps

- [Install the portable macOS app](Packaging.md#install-the-portable-brokpot-app) for a desktop with local Docker and remote server choices.
- [Mount a project](Sandbox.md#mount-a-project) to work with real files.
- [Configure permissions](Permissions.md) for Mac tools and Auto-review.
- [Connect MCP and plugins](Extensions.md) to extend the agent.
- [Package a macOS app](Packaging.md) to launch from Finder.
- [Choose a build profile](Configuration.md#build-time-feature-switches) to understand local and original behavior.

---
[Documentation](Home.md) · [Get started](Build-Guide.md) · [Configuration](Configuration.md) · [Project](../../README.md)

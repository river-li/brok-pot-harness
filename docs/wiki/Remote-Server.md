# Remote server and desktop client

Run one Grok Bot Host, Gateway, and Box for your Bots on a server, then connect an independently packaged macOS desktop over an authenticated tunnel. The server owns Bot execution, model credentials, Skills and plugins, approvals, conversation state, and Box files. The desktop connects to that Host; it does not start Docker or a local Host in remote mode.

## What runs on each computer

| Server | Remote desktop |
| --- | --- |
| Host, Gateway, every Bot, Box, search, and speech services | Conversation UI and authenticated Gateway client |
| Model URL, model ID, and `LITELLM_API_KEY` | Gateway token, stored only when the OS offers encrypted storage and you choose **Remember this connection** |
| Bot state, workspace, Box tools, Skill/plugin files, server-side approvals | Attachment downloads to a local Save As destination and Box display over the forwarded ports |

Shell and file tools run in the server's Box. Existing authenticated Gateway attachment reads transfer server-owned files to the desktop. When the Remote Client is connected, the Mac can also register through the retained local-computer bridge for supported Mac actions; those actions remain subject to the Host's per-machine permission and approval rules. Keep the app and SSH tunnel open while a task needs the Mac. Box tools and their approvals remain server-side. Microphone/camera input, voice calls, and local-file upload are not verified in this feature.

The server is one operator's workspace. Its Gateway token grants access to every Bot on that Host; this release does not provide per-user accounts or Bot-level tenancy. Skills and plugins remain server-owned.

## Preview release archive

For a deployed server, use the relocatable archive and versioned manager in the [preview server install guide](../../release/SERVER-INSTALL.md). The archive is built from a clean source revision with the local profile, carries an exact file checksum inventory and resource notices, and is attested by the release candidate workflow. The final promotion workflow checks the Actions run and required jobs, signer workflow identity, source ref and commit, and archive signatures before publication. Follow the guide to verify both the checksum and attestation; the manifest and checksum alone are not signatures. The checkout-based commands below remain useful for development and recovery.

## Server platform and state

The server profile uses Docker Compose and pinned `linux/amd64` service images. It requires a Docker Engine that can run those images. This delivery was exercised on a `linux/aarch64` Docker Engine using amd64 emulation; native amd64, other server architectures, and non-Linux Docker Engines have not been verified here. The independent Remote Client package and UI flow were exercised on macOS arm64. Packaging uses the build host's Electron architecture; Intel macOS and universal builds are not verified. This repository has no Windows or Linux desktop package path.

By default, server state is kept under `.runtime/server` in the server checkout:

| Path | Contents |
| --- | --- |
| `data/` | Bot profiles, transcripts, approvals, credentials, and durable state |
| `workspace/` | The Box `/workspace` working directory; writable to the Box user inside a private `0700` parent directory |
| `models/` | Persistent speech model downloads |
| `gateway-token` and `search-secret` | Per-server generated secrets, mode `0600` |
| `server.env` | Private model endpoint, ID, and optional provider key, mode `0600` |

Back up the state directory before updating or moving the checkout. Choose a different state directory with `GBH_SERVER_STATE_DIR=/srv/gbh npm run server:install`; use that same setting for each later server command. `GBH_SERVER_ENV_FILE` selects a different env file. `GBH_SERVER_PROJECT` selects the Compose project. These `GBH_SERVER_*` settings are supplied to each command through the shell. Gateway and display ports can also be changed there with `GBH_SERVER_GATEWAY_PORT`, `GBH_SERVER_VNC_PORT`, and `GBH_SERVER_VNC_CONTROL_PORT`.

## Install and start the server

Run these commands from a checkout of the repository on the server:

```sh
npm ci
npm ci --prefix runtime
npm run build -- --profile local
npm run server:install
```

Edit `.runtime/server/server.env` and set the Responses API URL, provider-supported model ID, and model settings. Keep the file private. A key may be stored in this mode-`0600` file or supplied as a nonempty `LITELLM_API_KEY` in the shell that runs `server:start` and later model requests; a nonempty shell value takes precedence over `server.env`. The server script does not load the desktop checkout's `.env` file. The provider key stays on the server.

```dotenv
GROKBOT_CONTAINER_API_URL=https://api.example.com/v1
GROKBOT_MODEL=your-model-id
GROKBOT_CONTEXT_TOKENS=128000
GROKBOT_REASONING_EFFORT=low
GROKBOT_INFERENCE_TIMEOUT_MS=180000
LITELLM_API_KEY=your-server-side-key
```

Start and inspect this server's separate Compose project:

```sh
npm run server:start
npm run server:status
npm run server:logs
```

`server:start` requires a local-profile Host build and waits for an authenticated Gateway capability check. It starts the server's Host/Box plus its search and speech services. `server:provider-smoke` is an optional preflight: it starts a short-lived app container and sends one fixed, non-streaming “Reply with exactly the word OK” request to the configured provider. It can incur a provider charge; it never prints the key or response text. The deterministic fixture in the integration test is not external inference.

## Secure connection through SSH

The Gateway, primary Box display, and forked Box display bind to server loopback only. The supported connection path in this client is an authenticated SSH local forward. It accepts loopback HTTP only, with no URL credentials or token query strings. Direct public HTTP, direct HTTPS, and public unauthenticated display ports are not supported by this client.

From the desktop computer, keep this tunnel open while using the app:

```sh
ssh -N \
  -L 1540:127.0.0.1:1540 \
  -L 6180:127.0.0.1:6180 \
  -L 6181:127.0.0.1:6181 \
  user@server.example.com
```

Use your normal SSH key or agent setup. If the server ports were changed, forward each local port to the matching server loopback port and enter the **local** port numbers in the client form.

On a separate Mac, install the packaged **Grokbot Remote Client.app**. To build it from a fresh checkout, install both lockfiles and run:

```sh
npm ci
npm ci --prefix runtime
npm run build -- --profile local
npm run package:mac:remote
```

The app is written to `.runtime/packages/Grokbot Remote Client.app`; copy that app to the desktop Mac. For development, prepare the local desktop and run `npm run start:remote-desktop -- --profile local`.

In the connection window:

1. Enter `http://127.0.0.1:1540` as the Gateway URL.
2. Leave the display tunnel ports at `6180` and `6181`, or enter the local forwarded ports you chose.
3. Enter the current Gateway token and choose whether to remember the connection.
4. Select **Connect**. The client authenticates against `getHostStatus` before opening the workspace.

The token is created at `.runtime/server/gateway-token`. Read it only in a private server terminal and enter it into the client; never put it in a URL or share it in logs. Saved credentials are encrypted with the operating system's secure storage and scoped to the normalized server URL. A separate short-lived helper performs each OS storage operation with a private temporary Electron profile and a five-second deadline. If secure storage is unavailable, the client can connect for that session but will not save the token in plaintext.

The client and server must expose the `orderedReplicasV1` and `sendAcceptanceV1` Gateway capabilities. Use a matching release of the app and Host; a missing capability produces an incompatible-server error before opening the Bot list.

## Stop, update, and recover work

```sh
npm run server:stop
npm run server:update
npm run server:rotate-token
```

Stopping leaves the server state and workspace on disk. `server:update` stops this project, rebuilds the local-profile Host, and restarts it; if the build fails, the server remains stopped and can be restarted with `server:start` after the build is fixed. Stop/update can interrupt a running turn; they do not wait for every task to drain.

After a restart, work accepted before a user-visible acknowledgment is redriven from its persisted transcript. If the Bot already sent a visible acknowledgment, the Host does not silently replay that turn. It adds an interruption notice to the Bot transcript, tied to the original accepted message. Send the displayed `/continue-interrupted <message-id>` command in that same Bot to continue the original task without appending the original request again. As with other model/tool workflows, a restart can occur after an external side effect but before its result is saved; this continuation is best-effort and does not promise exactly-once external actions.

Token rotation replaces the server's Gateway token and restarts the Host. Existing clients then receive an authentication error. Read the new token from the private server token file and enter it again in the client; any remembered encrypted connection must be replaced.

## Test evidence and limits

`node runtime/tests/remote-server-live.cjs` runs an isolated Compose project with a real pinned Box and deterministic Responses fixture. It verifies server Box file creation and download, two-Bot state, authenticated API and event streaming, disconnect/reconnect, server restart, interrupted-turn recovery, token rotation, update persistence, and local-exec authentication/permission behavior with nonexistent fixture paths. It does not call an external model provider. `GBH_REMOTE_TEST_UI_REVIEW=1` also holds the server for a packaged-client review that downloads a Box attachment and denies a local Mac Read approval. The optional provider smoke is a separate, explicit request against the configured provider. See [Verification](Verification.md) and the [test guide](../../runtime/tests/README.md) for this checkout's recorded results.

---
[Documentation](Home.md) · [Installation](Build-Guide.md) · [Configuration](Configuration.md) · [Project](../../README.md)

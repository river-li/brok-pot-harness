# Sandbox and data

Docker Compose runs three services: `app` (Host and Linux Box), `search` (SearXNG), and
`speech` (Whisper / Kokoro). The project is named `gbh-local`; its definition is [compose.yaml](../../runtime/compose.yaml).

## Mount a project

By default, `/workspace` maps to the repository's `.runtime/workspace`. To use your own folder, set this in the root `.env`:

```dotenv
GROKBOT_WORKSPACE_DIR=/absolute/path/to/your-project
```

Use an existing **absolute path**, allow it in Docker Desktop's file-sharing settings, and run `npm start`.
Changes the agent makes under `/workspace` are written directly to that host folder.
Use a separate read-only mount for reference material.

## Add extra mounts

Create `.runtime/compose.local.yaml` and replace the example paths:

```yaml
services:
  app:
    volumes:
      - /absolute/path/to/reference:/mnt/reference:ro
      - /absolute/path/to/output:/mnt/output:rw
```

Select it in the root `.env`, then run `npm start`:

```dotenv
GROKBOT_COMPOSE_OVERRIDE=.runtime/compose.local.yaml
```

`ro` is read-only; `rw` is read/write. The overlay filename resolves from the **repository root**.
Relative volume sources inside it resolve from **`runtime/`**, the first Compose file's directory.
Prefer absolute paths. A mount with the same container target replaces the base mount;
do not cover `/home/box/sand-host` or `/home/box/deps`.

## Custom image

An image supplies the container filesystem; a bind mount supplies host files. Selecting an image does not mount a project.
The default Box uses a pinned `linux/amd64` image. Derive from it to add tools:

```dockerfile
FROM public.ecr.aws/k0i0n2g5/cursorenvironments/universal@sha256:322c3a9031d61e210a05400dd74c82bbb1fdb42db315a8cf5ab39368c2f0c1c8
# Add tools here; preserve the Box user, execution daemon, and display components.
```

Save this as `.runtime/Dockerfile.sandbox`, then build:

```sh
docker build --platform linux/amd64 -t gbh-sandbox:dev \
  -f .runtime/Dockerfile.sandbox .runtime
```

Set the image in the root `.env`:

```dotenv
GROKBOT_SANDBOX_IMAGE=gbh-sandbox:dev
```

Run `npm start` to apply it. Compatible images must retain `/exec-daemon/node`,
`/usr/local/bin/start-sand-box`, and the Box execution/display services.
A plain Ubuntu or Node image is not a drop-in replacement.

## Ports and services

| Host address | Purpose |
| --- | --- |
| `http://127.0.0.1:1540` | Host Gateway; business requests require a local token; internal port 1340 |
| `http://127.0.0.1:6180`, `6181` | Box noVNC displays; internal ports 6080 / 6081 |
| No published host port | Search uses `http://search:8080` inside Compose |
| No published host port | Speech uses `http://speech:8000` inside Compose |

Published ports bind to loopback by default. If you change the Gateway host port in
[compose.yaml](../../runtime/compose.yaml), also set `SAND_HOST_GATEWAY_URL` in the desktop's startup shell.
The root `.env` loader does not read `SAND_*`.

## Persistence and backups

| Path relative to the repository | Contents / container location |
| --- | --- |
| `.runtime/data` | Conversations, Agents, settings, plugins; `/home/box/sand-data` |
| `.runtime/workspace` or your custom folder | Working files; `/workspace` |
| `.runtime/profiles` | Development desktop profiles, separate from the packaged app |
| `.runtime/models/whisper`, `kokoro` | Downloaded speech model caches |
| `.runtime/gateway-token` | Credential for the local desktop-to-Host connection |
| `.runtime/build` | Rebuildable Host and read-only dependencies, not user data |

The packaged app stores its desktop profile in `~/Library/Application Support/Grokbot Harness` by default.
`npm stop` preserves these files. Before a backup, finish tasks, quit the desktop, and stop the backend.
Back up data, workspace, the relevant desktop profile, and private configuration.
Model caches can be downloaded again; build outputs can be recreated.
**Do not treat all of `.runtime` as disposable cache:** it also contains conversations and working files.

## Execution boundaries

The default Box has network access. Read-only mounts limit writes, not network traffic.
Auto-review and Mac tools have separate settings; see [Permissions](Permissions.md).
Ordinary workspaces do not require a privileged container or Docker socket mount.

---
[Documentation](Home.md) · [Get started](Build-Guide.md) · [Configuration](Configuration.md) · [Project](../../README.md)

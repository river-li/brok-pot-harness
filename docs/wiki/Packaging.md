# macOS packaging

## Install the portable Brokpot app

On macOS, with Node.js 24.14.0, Python 3, and Docker Desktop available, install
the app into your own Applications directory:

```sh
npm ci
npm ci --prefix runtime
npm run install:mac
open "$HOME/Applications/Brokpot.app"
```

`install:mac` builds the local Host and desktop, packages a signed `Brokpot.app`,
and copies it to `~/Applications`. Use `npm run install:mac -- --destination /path/to/Applications`
to choose another directory. The app contains its local Host, Compose inputs,
and desktop; it does not contain a model key or Gateway token. It can be moved
away from the source checkout. A fresh launch asks **Where do you want to run
your pots?** Choose **Run locally** to configure a Responses API endpoint and
start this app's `brokpot-local` Docker project. The first start downloads the
pinned container images and may build the speech image. Choose **Connect to a
Brokpot server** to open the existing encrypted remote connection flow without
starting local Docker. The welcome screen appears on every launch, with the
last choice highlighted, so the location can be changed explicitly.

Local state lives under `~/Library/Application Support/Brokpot/Local Server`;
the deployed, verified runtime lives under `Brokpot/Runtime`. Pots and model
settings stay on this Mac. Closing the desktop leaves its Docker services
running; stop only this app's project with `GBH_SERVER_STATE_DIR="$HOME/Library/Application Support/Brokpot/Local Server" GBH_SERVER_PROJECT=brokpot-local node "$HOME/Library/Application Support/Brokpot/Runtime/<digest>/runtime/server.cjs" stop`.
Remote profiles and encrypted credentials live under `Brokpot/Remote Client`.

For a matching pair of distribution artifacts from a **clean committed tree**,
run `npm run release:build` on macOS with Node.js 24.14.0 and Docker Desktop.
The command writes a portable macOS ZIP and a Linux/amd64 server `.tar.gz`,
checksums, and `release-build.json` under `.runtime/release/<version>/`. The
Linux archive is built in a separate Node 24.14.0 Docker container from a Git
bundle of the same commit. The Mac app uses an ad-hoc signature; distributing
it outside a trusted test group still needs Developer ID signing and notarization.

## Legacy checkout-aware app

Build a local `.app` with the project icon and launch it from Finder or the Dock.
Packaging runs on macOS and is verified with Intel Electron. Docker runs the backend separately.

## Build the app

Complete [dependency and model setup](Build-Guide.md), then run from the repository root:

```sh
npm run build -- --profile local
npm run package:mac
npm start
open '.runtime/packages/Grokbot Harness.app'
```

`package:mac` prepares the local desktop and writes `.runtime/packages/Grokbot Harness.app`.
It replaces an existing output at that path; quit the old app before rebuilding.

| Inside the app | Supplied by the runtime environment |
| --- | --- |
| Electron, desktop code/assets, local adapters, PNG / ICNS icons | Docker backend, model API, workspace, conversation data, speech caches |

The app uses an **ad-hoc signature** for local builds. Developer ID signing, notarization, DMG distribution,
and an automatic-update release pipeline are not provided.

## Connect to the Host

Packaged `local-launch.json` records the build checkout's path to locate `.runtime/gateway-token`.
It contains neither the token value nor a model API key. The default Gateway is `http://127.0.0.1:1540`.

To use a different checkout, launch explicitly:

```sh
GROKBOT_PROJECT_ROOT=/absolute/path/to/gbh \
  '.runtime/packages/Grokbot Harness.app/Contents/MacOS/Electron'
```

You can also provide `SAND_HOST_GATEWAY_URL` and `SAND_HOST_GATEWAY_TOKEN` in the startup environment.
The packaged app does not load the repository `.env`; desktop options such as `GROKBOT_LOCAL_VOICE` and
`GROKBOT_LOCAL_KEYCHAIN` use the startup environment as well. The Host launched by `npm start` still reads model configuration.

The desktop profile defaults to `~/Library/Application Support/Grokbot Harness`, separate from development's
`.runtime/profiles/desktop`. Moving the app does not migrate the backend or its data.

## Change the icon

[Branding assets](../../assets/branding/README.md) include the original artwork, selected rounded image, and platform outputs.
Place prepared rounded transparent artwork at `assets/branding/icon-rounded.png`, then run:

```sh
npm run build:icons
npm run package:mac
```

The converter uses macOS `sips` / `iconutil` to produce `icon.png` and `AppIcon.icns`.
`branding.cjs` sets the development Dock icon; the packaged app also sets `CFBundleIconFile`.
Conversion resizes and converts the selected artwork, without regenerating it. Upstream assets remain in `vendor/desktop`.

If Finder shows an old icon, quit the old app, confirm the output path, and relaunch that copy.

---
[Documentation](Home.md) · [Get started](Build-Guide.md) · [Configuration](Configuration.md) · [Project](../../README.md)

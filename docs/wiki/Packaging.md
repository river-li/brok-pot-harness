# macOS packaging

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

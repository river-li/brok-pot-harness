# Troubleshooting

Work through **backend → model → desktop → tools**. Start at the repository root:

```sh
npm run status
npm run logs
```

## Backend does not start

Check that Docker Desktop is running and `npm run build -- --profile local` has completed.
Rebuild local if the profile is missing or mismatched. For port conflicts, check the
[default ports](Sandbox.md#ports-and-services) without stopping another project's containers.

The speech service downloads and loads models on its first start. If logs show progress, wait;
after fixing a failed download, rerun `npm start`. Caches are in `.runtime/models`.
There is no need to delete conversations or all of `.runtime`.

## Model requests do not complete

| Symptom | Next check |
| --- | --- |
| `fetch failed` / DNS error | Verify the base URL and access from the Host container, not only from your browser |
| API 401 / 403 | Check the key and service authorization; an old root `.env` value may override a new shell key |
| API 400 / unknown model | Use a supported model ID and confirm Responses, streaming, and tool-call support |
| HTTP 200 without a terminal event | Inspect streaming events and upstream service logs; 200 does not establish completed inference |
| Timeout | Check model latency, service load, and `GROKBOT_INFERENCE_TIMEOUT_MS` |

After changing a key, URL, or model, run **`npm start`**. Restart alone does not update the container environment.
Renew credentials for the model service in that service; GBH's vendor login does not need to be enabled.
To test the endpoint independently:

```sh
npm run test:responses
```

This calls the real API, requires its configuration, and may incur provider charges.
See [Model API](Configuration.md#model-api) for settings.

## Desktop fails to connect or shows a blank window

Confirm Host health, then assemble and launch with matching profiles:

```sh
npm run build -- --profile local
npm run prepare:desktop -- --profile local
npm run start:desktop -- --profile local
```

Read errors in the startup terminal. The default Gateway port is 1540; `npm start` generates its local token.
Do not use another checkout's token. If a moved packaged app cannot connect, check
[Host location and GROKBOT_PROJECT_ROOT](Packaging.md#connect-to-the-host).

## Unexpected Keychain prompt

Current local builds disable optional Keychain storage by default. Quit the old app, rebuild and launch the latest output,
and check that `GROKBOT_LOCAL_KEYCHAIN=1` is not set. The `original` profile retains original behavior.
See [Keychain](Permissions.md#keychain); do not delete system Keychain items to troubleshoot startup.

## Tools cannot access files

Box `/workspace` and Mac tools use different execution paths. Check mount sources and targets, `ro/rw`, ownership,
and Docker Desktop sharing. The Mac `always` setting does not change mount permissions.
MCP stdio commands must also exist in their execution environment; see [Integrations](Extensions.md).

## Speech and display tests

For transcription or voice-preview timeouts, check CPU load, speech health, and request length.
Hardware audio and long calls need broader validation; see [Features](Features.md).
Run shared-Box Agent and screenshot tests serially to avoid display contention.

## Report a reproducible issue

Include system architecture, command/profile, minimal steps, expected behavior, actual behavior, and relevant errors.
Remove keys, tokens, personal paths, and conversation content before sharing logs.
Do not submit full container environments or `.env` files.

---
[Documentation](Home.md) · [Get started](Build-Guide.md) · [Configuration](Configuration.md) · [Project](../../README.md)

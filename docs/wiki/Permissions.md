# Permissions

First identify where a tool executes. Linux sandbox access, Mac tool execution, and Auto-review are separate controls.

| Control | Governs | Configure in |
| --- | --- | --- |
| Docker mounts and file permissions | Host files visible to the Box and whether they are writable | `.env`, Compose overlay, Docker Desktop |
| Mac tool permissions | Tools executed on the Mac through the desktop bridge | Desktop Settings |
| Auto-review | Model review of tool actions | Desktop Settings; optional Host environment setting |
| Keychain | Optional desktop encrypted storage | `GROKBOT_LOCAL_KEYCHAIN` |

## Container file access

Default Shell / Read tools execute in the Linux Box. Mount a project to make its files available.
`ro` prevents writes; `rw` allows writes subject to ownership and Docker Desktop sharing.
See [mount examples](Sandbox.md#add-extra-mounts).

## Mac tool permissions

MacShell / MacRead and related tools use the desktop bridge and follow the local execution setting:

| Value | Behavior |
| --- | --- |
| `ask` (default) | Show approval requests for Mac execution |
| `never` | Disable Mac tools; Linux sandbox tools remain available |
| `always` | Persistent permission, still subject to action type, permission ceilings, and other approvals |

Per-machine settings take precedence over the default. `always` cannot make a read-only Docker mount writable;
`never` does not remove directories already mounted into the Box.

## Auto-review

Enable Auto-review and set its instructions in Settings. Local review uses the configured Responses API and model,
while preserving the approval/rejection flow. To select a runtime mode, add this to a
[Compose overlay](Sandbox.md#add-extra-mounts):

```yaml
services:
  app:
    environment:
      SAND_AUTO_REVIEW_MODE: enforce
```

| Mode | Behavior |
| --- | --- |
| `enforce` | Enforce review decisions |
| `shadow` | Run review without enforcing its decisions |
| `off` | Disable this review layer |

Apply with `npm start`. This option takes effect only when **Auto-review is enabled in Settings**.
It does not enable that setting, grant Mac permissions, or change filesystem access.

## Keychain

Local desktops default to `GROKBOT_LOCAL_KEYCHAIN=0`: inherited startup secure-storage initialization and encrypted
Gateway caching are skipped. The non-secret machine ID is stored in the desktop profile's `local-machine-id` file
with mode `0600`. Secrets are not moved to plaintext disk storage. Some optional integrations retain secrets only
for the session; others require encrypted storage to be enabled.
The model key is used by the Host and does not require desktop Keychain access.

Set `GROKBOT_LOCAL_KEYCHAIN=1` and restart the desktop to enable optional encrypted storage; macOS may ask for access.
Development launches read the root `.env`; packaged launches require a startup environment variable.
See [Packaging](Packaging.md). The `original` profile retains its original secure-storage behavior.

## Network access

The local build disables vendor account services, but it is not an offline-only mode.
The configured model API, search engines, MCP servers, and plugins may use the network.
Data sent to them depends on your task and the tools invoked. Mounts and action review are not network isolation.

---
[Documentation](Home.md) · [Get started](Build-Guide.md) · [Configuration](Configuration.md) · [Project](../../README.md)

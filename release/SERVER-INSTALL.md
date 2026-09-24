# Install the GBH preview server

This archive is a self-hosted preview release. It contains a local-profile Host build, the pinned Compose configuration and image references, a release manifest, SHA-256 inventory, and resource notices. It does not contain the editable repository source or user data.

## Requirements

- Linux x86_64 for the supported server host, with Docker Engine and Docker Compose v2.
- Node.js exactly `24.14.0` and Python 3.9 or newer for release archive extraction. The manager checks the Node version before installing, starting, updating, or recovering a release.
- A Responses-compatible API endpoint, model ID, and provider key for Bot inference. The key stays on the server.
- SSH access to the server for remote Gateway and display connections. Ports bind to loopback by default.

The Compose services run as `linux/amd64`. The Box image, search image, and speech base image are digest-pinned. Speech is built locally and has a release-specific image name, so an older release can still use its own image on rollback. The candidate validation report names the exact Docker Engine host and emulation platform exercised; the Linux x86_64 artifact build alone is not a live-server test.

## Verify and install

Download the server `.tar.gz`, matching `.sha256` file, and client `.zip` from the same candidate or release. Install GitHub CLI with `gh attestation verify` support and authenticate it with `gh auth login`. Verify both SHA-256 sidecars. Read the source commit from the selected candidate run or published release notes, then verify both GitHub artifact attestations before extracting or launching anything. The attestation must identify the GBH preview candidate workflow and that exact source revision; the manifest and checksum file alone are not signatures.

Use the candidate run ID recorded in the published release notes (or the run that produced the selected Actions artifacts) to get the full source SHA from GitHub. Compare it with the release notes' source commit. The candidate signer is the repository workflow; `gh attestation verify` checks the signed artifact bytes against that source digest and workflow identity. Predicate metadata and a manifest supplied beside an artifact can be controlled by the workflow and are not a substitute for signature verification. See [`gh attestation verify`](https://cli.github.com/manual/gh_attestation_verify).

```sh
server=gbh-server-v0.1.0-preview.1-linux-amd64.tar.gz
client=gbh-remote-client-v0.1.0-preview.1-macos-arm64.zip
candidate_run_id=123456789
source_sha="$(gh run view "$candidate_run_id" --repo river-li/brok-pot-harness --json headSha --jq .headSha)"
sha256sum -c "$server.sha256"
sha256sum -c "$client.sha256"
gh attestation verify "$server" \
  --repo river-li/brok-pot-harness \
  --signer-workflow river-li/brok-pot-harness/.github/workflows/preview-release-candidate.yml \
  --source-ref refs/heads/agent/preview-release \
  --source-digest "$source_sha" \
  --format json
gh attestation verify "$client" \
  --repo river-li/brok-pot-harness \
  --signer-workflow river-li/brok-pot-harness/.github/workflows/preview-release-candidate.yml \
  --source-ref refs/heads/agent/preview-release \
  --source-digest "$source_sha" \
  --format json
```

```sh
mkdir -p /tmp/gbh-preview-install
tar -xzf "$server" -C /tmp/gbh-preview-install
cd /tmp/gbh-preview-install
./install.sh
```

The archive contents are at the extraction root. Set `NODE` to the full path of Node.js 24.14.0 if it is not on `PATH`. `GBH_RELEASE_HOME` and `GBH_SERVER_STATE_DIR` can select different install and state paths before running `install.sh`. They must be separate, non-nested directories. Defaults are `~/.local/opt/gbh` and `~/.local/share/gbh`; the chosen state path is saved in the generated launcher so later invocations use the same data. Pass a replacement state path to every later command only if you intend to override that saved path.

The installer verifies the complete package inventory, checks every file digest, copies the package into a versioned release directory, and creates `~/.local/opt/gbh/bin/gbh-server`. It initializes private state and starts no server until you configure the provider settings.

## Configure and start

Edit `~/.local/share/gbh/server.env` and set the server's API endpoint, model ID, and key:

```dotenv
GROKBOT_CONTAINER_API_URL=https://api.example.com/v1
GROKBOT_MODEL=your-model-id
GROKBOT_CONTEXT_TOKENS=128000
GROKBOT_REASONING_EFFORT=low
GROKBOT_INFERENCE_TIMEOUT_MS=180000
LITELLM_API_KEY=your-server-side-key
```

The file is created with mode `0600`. Start and inspect the project:

```sh
~/.local/opt/gbh/bin/gbh-server start
~/.local/opt/gbh/bin/gbh-server status
~/.local/opt/gbh/bin/gbh-server version
```

The installer stores the Gateway token at `~/.local/share/gbh/gateway-token`. Keep it private. The default Gateway and display ports are `1540`, `6180`, and `6181`, and bind to server loopback. Use the SSH forwarding instructions in the [remote server guide](https://github.com/river-li/brok-pot-harness/blob/main/docs/wiki/Remote-Server.md) to connect the separate macOS client.

## Update and rollback

Verify the new archive and attestation, then pass the archive directly to the manager:

```sh
~/.local/opt/gbh/bin/gbh-server update ./gbh-server-v0.1.0-preview.2-linux-amd64.tar.gz
~/.local/opt/gbh/bin/gbh-server version
```

The manager verifies the package before stopping the current server. It checkpoints `data/`, `workspace/`, `server.env`, and the two generated secrets; writes an update journal; activates the candidate; and starts it. A failed candidate startup is stopped before the previous release is selected, the checkpoint is restored, and the previous release is restarted. Updates with a different `stateFormat` are rejected until a tested migration exists. The model cache is retained outside the checkpoint. Symlinks inside `data/` and `workspace/` are preserved as links; their external target contents are not checkpointed. The top-level checkpointed entries cannot be symlinks.

On native Linux, Box may own files in `data/` and `workspace/` as its container user. Before a release checkpoint, the manager verifies that every service in this server project is stopped, then uses a one-shot root process from the pinned app image to return ownership of only those two mounts to the release operator. Starting the server gives those files back to Box as needed. Model caches and other server projects are not changed.

Rollback keeps user state created after the update. It takes a fresh checkpoint before switching versions, and restores that checkpoint if the old release fails to start:

```sh
~/.local/opt/gbh/bin/gbh-server rollback
```

An interrupted process may leave an operation lock. The preview does not delete a stale lock automatically. Check the lock's recorded hostname and PID, confirm that the process is no longer running on that host, remove only `~/.local/opt/gbh/release-operation.lock`, then run:

```sh
~/.local/opt/gbh/bin/gbh-server recover
```

Recovery validates the journal and recursive checkpoint hashes before changing current state. If the checkpoint is missing or corrupt, it stops and leaves live state untouched for operator repair. Backups and prior release directories remain under `~/.local/opt/gbh`; retain them until rollback is no longer needed. Recovery does not promise atomicity for state outside the listed checkpoint roots, Docker image storage, or symlink targets.

## Preview boundary

The server and separately packaged macOS arm64 Remote Client are one tested protocol pair. Inference availability depends on the operator's configured provider. Deterministic fixture tests with a real Box prove server execution and approval behavior, not provider availability. This release does not provide accounts, per-user Gateway tokens, public HTTP exposure, Windows/Linux desktop packages, or automatic state migration.

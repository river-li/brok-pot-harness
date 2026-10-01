# Durable OAuth grant design

## Contract

An explicitly configured local encrypted store enables grants without an absolute
expiry. Access tokens still expire in 15 minutes; refresh tokens rotate on every
exchange. Revocation and Gateway credential rotation still invalidate access.
Without storage configuration, the existing seven-day memory-only mode remains.
Existing memory-only grants cannot be recovered at deployment: reconnect once.

## Storage and key boundary

Use Node's built-in SQLite (Node >=22.13) on a local filesystem. One database row
contains a versioned AES-256-GCM encrypted snapshot of grants and token hashes.
Each commit uses a fresh 96-bit nonce and authenticates the format version plus
issuer/resource/client binding as additional data. Raw MCP access/refresh tokens
are never stored. Gateway credentials and per-grant refresh signing secrets are
inside the encrypted payload. Consent forms and authorization codes stay in RAM.
SQLite transactions with synchronous=FULL commit before successful token or
revocation responses. No plaintext journal or temporary snapshot is written.
The directory is 0700; database and key are 0600. A random 32-byte key is loaded
from a separate file, normally systemd LoadCredential, not an environment value.
The key must survive deploys and remain outside database backup directories.

SQLite stores a non-secret PID and random owner ID. Startup claims ownership in
an immediate transaction, rejects a live owner, and recovers only a dead local
owner. This is a single-process, single-machine service; network filesystems and
replicas are unsupported. PID reuse may require operator intervention rather
than guessing that a live process is stale. All writes check the owner ID.

## Token lifecycle and bounded state

Durable refresh tokens carry a grant ID, generation and HMAC-SHA256, authenticated
by a random per-grant secret encrypted in storage. The client treats the token as
opaque. Only the current refresh token hash is retained for each grant. A validly
signed earlier generation revokes the entire grant, even across restart. Forged
or future generations do not revoke it. Rotation increments the generation;
there is no growing list of used refresh tokens. Access hashes expire normally.
Active grants are bounded; the grant-count limit rejects new grants, not rotation
of an existing grant. The separate access-record limit also pauses refresh until
short-lived records expire or grants are revoked. Explicit revocation removes the credential from subsequent
snapshots. SQLite pages/journals/backups may contain older ciphertext: encryption
does not claim secure physical deletion or protection after host/root compromise.

## Failures and operations

Wrong key, corrupt ciphertext, incompatible binding/version or invalid decoded
state fails closed on startup, without overwriting data. Persistence errors latch
the running OAuth service unavailable; no successful response is issued for an
uncommitted mutation. Restart after repair. An in-flight rotation interrupted
between commit and delivery may require reauthorization, as with standard
single-use refresh rotation. Graceful or abrupt restarts otherwise preserve
issued grants. Persist revocation before acknowledging it.

Back up the stopped service's database and separately protect its key. Restoring
an old backup can resurrect revoked grants/consumed refresh tokens; after disaster
recovery, reset grants with a new key/database and reconnect instead of claiming
rollback protection. Key rotation currently requires stopping the service and
resetting grants. Never auto-generate a replacement key on startup.

## Acceptance

Test restart and crash recovery, refresh after more than seven days, replay after
rotation/restart, revocation persistence, wrong key/corruption/binding mismatch,
no plaintext credential/token on disk, restrictive modes, live-owner exclusion,
write failure before success, and bounded repeated rotation. Run the existing
OAuth/CSRF/PKCE/MCP suite. Deploy with a separate protected key and verify a real
public OAuth grant survives a service restart before reconnecting ChatGPT.

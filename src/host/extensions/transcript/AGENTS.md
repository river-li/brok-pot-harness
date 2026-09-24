# Transcript and scheduling maintenance

This Host extension accepts messages, owns per-Agent run scheduling, and
coordinates transcript and Agent lifecycle. See [its README](README.md) for
registration, dependencies, and the entry-point map.

## Ownership and invariants

- `extension.ts` declares dependencies and lifecycle; `send-pipeline.ts`
  handles send acceptance, duplicate client nonces, attachments, and transcript
  echoes; `run-scheduler.ts` owns queues; `transcript-manager.ts` owns shared
  transcript/session behavior; `agent-lifecycle.ts` creates, stops, and
  recovers Agent runners.
- Keep one active turn per Agent. Preserve queue priority (user, then Agent,
  then background), user-message selection ahead of group-member messages,
  cancellation callbacks, watchdog/grace handling, and drain semantics. Keep
  scheduling telemetry and accepted-time data intact. Upgrade/recreate pause
  and resume flow is coordinated by `upgrade-recreate-resume.ts` and
  `transcript-manager.ts`.
- Preserve nonce/digest idempotency and the durable transcript acceptance path
  when changing retries or send ordering. Keep refusal of sends to server-owned
  room sessions and the existing unattached-runner failure visible to callers.
- Remote-server interrupted-turn journaling is profile-scoped and keyed by the
  original accepted transcript message ID. Keep accepted work durable before
  queue dispatch, distinguish visible acknowledgment from completion, avoid
  clearing records based on another message's coalesced acknowledgment, and
  mirror startup/recovery notices into both the Agent database and active
  transcript view. Resume the same task only after an explicit same-Bot command.
- This layer schedules and persists; `turn-execution` binds the executor and
  the Harness owns runner/tool composition. Do not duplicate the Agent loop.
  Tool authorization remains with the existing local-tool-permission and
  Auto-review paths; do not short-circuit approvals here.
- Keep remote/cloud paths in source and apply local-profile policy at its
  existing boundary. These recovered files require their fragment markers,
  emitted identifiers, bundle order, and original bundle-scope symbols.

## Verify changes

```sh
npm run build -- --profile local
npm run test:runtime-build
```

For end-to-end Host persistence smoke coverage, use
`node runtime/tests/gateway.cjs` with a ready local Host and disposable data;
the script leaves a test Agent behind. The current runtime suite has no focused
assertion for queue lane ordering, cancellation races, or watchdog recovery.
Neither `test:runtime-build` nor the Gateway smoke proves those semantics, so
add/run a focused isolated scenario when changing them. See the
[test guide](../../../../runtime/tests/README.md).

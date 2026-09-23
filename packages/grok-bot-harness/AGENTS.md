# Harness maintenance

The Harness composes Bot prompts, tools, memory, and capability ports around
the generic Agent. See the [package README](README.md) and
[source map](src/README.md) for entry points.

## Edit boundaries and invariants

- `src/runner/sand-agent-runner.ts` adapts the Agent lifecycle and turn state;
  `src/runner/tools/turn-toolset.ts` assembles tools for a turn; `src/ports/`
  defines Host-supplied capabilities. Host transcript scheduling and durable
  conversation state remain in `src/host/extensions/transcript`.
- Tool composition carries policy. Preserve local-tool permission scopes,
  Auto-review gates, tool-call identity and call/result pairing, cancellation,
  and per-turn capability scoping. Machine-targeted tools retain their explicit
  local-tool approval path. Do not add a direct execution route around these
  wrappers.
- Preserve fail-closed Auto-review behavior and review-expiry handling when
  changing the runner or tool set. For policy changes, also read the Host
  [local-tool-permission](../../src/host/extensions/local-tool-permission/README.md)
  and [Auto-review](../../src/host/extensions/auto-review/README.md) guides.
- Files outside `src/local` are recovered bundle fragments. Keep paths,
  generated identifiers, fragment markers/order, and bundle-scope symbols;
  do not guess imports. `src/local` is a separate strict-TypeScript subtree.
- Preserve original service implementations. Local and original profiles use
  maintained source with conditional policy; do not delete vendor login,
  billing, cloud provisioning, or sync code to implement local behavior.

## Verify changes

```sh
npm run build -- --profile local
npm run test:runtime-build
```

`npm run check:local` checks only `src/local`, not recovered Harness files.
For runner/tool behavior, execute
`docker compose -f runtime/compose.yaml exec app node /opt/grokbot/tests/agent-sandbox.cjs`
against a ready `gbh-local` app. It runs the retained Agent loop and sandbox
tools against a deterministic Responses fixture; it does not prove external
model availability. `runtime/tests/agent-live.cjs` is the real-model counterpart
and requires `LITELLM_API_KEY`, which may incur API charges. See the
[test guide](../../runtime/tests/README.md).

# Runtime-test maintenance

This tree contains protocol contracts, isolated Host/Agent fixtures, and live
service/desktop flows. The [test README](README.md) is the command and
prerequisite matrix; recorded results and gaps are in
[Verification](../../docs/wiki/Verification.md).

## Test boundaries

- Keep test data, containers, processes, and diagnostics private to the test.
  Clean up only resources created by the test and leave useful diagnostics in
  ignored `.runtime/tests`, without keys, tokens, user sessions, or prompts.
- `agent-sandbox.cjs` runs the retained Agent loop with a deterministic
  Responses fixture and real sandbox tools. It proves local tool execution,
  not external inference. `agent-live.cjs` calls the configured model and may
  incur API charges.
- `gateway.cjs` calls the selected Host and intentionally leaves its test Agent
  record for separate persistence/restart inspection; run it only with
  disposable Host data. It is basic API smoke coverage, not an SSE,
  authorization, or scheduler concurrency contract.
- A contract test covers only the protocol/failure boundary it asserts. A
  prepared build or syntax check does not establish a live UI or service flow;
  follow the matching prerequisites in `README.md`.
- Keep `local` and `original` profile checks separate. Tests for retained
  original paths must not remove code or relax the local profile policy.

## Verification paths

Run the exact command from the README row matching the changed behavior. Common
build/profile checks are:

```sh
npm run check:local
npm run test:runtime-build
```

`check:local` only type-checks the standalone local-adapter tree;
`test:runtime-build` exercises reconstruction and profile selection. Use
`npm run build -- --profile local` before fixture/live checks that consume the
assembled Host. Do not run live or charged checks unless that evidence is
needed for the change.

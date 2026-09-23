---
name: reproduce-bug
description: Reproduce a reported GBH defect with the smallest relevant check and report what the evidence establishes. Use before changing code when a failure or repeatable symptom is available.
---

# Reproduce a bug

Use this workflow to turn a report into a repeatable, layer-specific observation. For the full issue process, follow the [agent maintainer playbook](../../../docs/wiki/Agent-Maintainer-Playbook.md).

## Inputs

- The report or issue, including expected and actual behavior.
- Minimal reproduction steps, command, revision, platform, and build profile when known.
- Sanitized logs or a small fixture. Never request `.env`, tokens, raw environments, private sessions, or unnecessary user data.

## Workflow

1. Read the root and applicable scoped `AGENTS.md`, the target module README, and [Troubleshooting](../../../docs/wiki/Troubleshooting.md). Separate observations from hypotheses.
2. Locate the maintained source and the narrowest relevant existing check. Use [Development](../../../docs/wiki/Development.md) and the [runtime test guide](../../../runtime/tests/README.md) to select a test layer.
3. Inspect a test before running it. Prefer deterministic contracts and private fixtures; report the exact command, result, and any required platform, profile, or service state. Do not launch the normal stack just to inspect a report.
4. If the symptom cannot be reproduced at that layer, state what was tried and what remains unverified. Run a live provider check only when it is relevant and the task explicitly authorizes it; see [Model requests do not complete](../../../docs/wiki/Troubleshooting.md#model-requests-do-not-complete).

## Evidence boundary

A fixture model or local fake endpoint proves only the exercised adapter, protocol, or local execution path. It does not establish external provider availability, behavior, or quality. A real-provider result must name the check and configured service context without exposing credentials. Follow the evidence definitions in [Verification](../../../docs/wiki/Verification.md) and the playbook.

## Safety boundaries

Keep credentials, raw environments, private sessions, and user data out of inputs and retained diagnostics. Do not make a live provider request without explicit task authorization, and do not edit `.runtime/build` or `sand-host` to reproduce a failure.

## Output to retain

Report the minimal steps and exact command, expected versus observed result, revision/profile/platform where relevant, evidence layer, and observed / inferred / not verified points. Keep only useful sanitized diagnostics under ignored `.runtime/tests` when a test needs them; clean up only resources created for this reproduction.

## Safe dry run

To classify existing Responses coverage without making a request, inspect the test fixture:

```sh
rg -n 'fixture-model|response.completed|server.listen|127.0.0.1' runtime/tests/responses-contract.cjs
```

The test uses an ephemeral loopback fake and a fixture model. This is contract evidence, not a real-provider reproduction.

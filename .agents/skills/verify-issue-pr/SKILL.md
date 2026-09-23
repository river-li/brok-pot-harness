---
name: verify-issue-pr
description: Map issue acceptance criteria to changes and actual verification evidence, then prepare a reviewable handoff or PR body. Use when implementation is ready for issue-level review.
---

# Verify an issue for review

This skill organizes acceptance evidence and handoff details. Follow the [agent maintainer playbook](../../../docs/wiki/Agent-Maintainer-Playbook.md) for the full issue workflow, authorization boundaries, and handoff states; do not replace it with this checklist.

## Inputs

- The complete issue: problem, acceptance criteria, dependencies, and exclusions.
- Current revision/base, worktree status, changed files, and implementation summary.
- The task's authorization for tests and any external or live action.

## Workflow

1. Read root and applicable scoped `AGENTS.md` plus relevant module documentation. Preserve pre-existing changes and scope.
2. Make a compact matrix: each acceptance criterion → changed source or document → relevant check → observed result. Choose checks using the [runtime test guide](../../../runtime/tests/README.md) and [Verification](../../../docs/wiki/Verification.md); do not treat a test file's presence or old recorded results as a pass.
3. Record exact commands and passed / failed / not run / blocked outcomes. Inspect the final status and diff, including `git diff --check`. State the evidence layer and what it does not establish.
4. Prepare the PR title/body or handoff with unmet criteria and limitations explicit. Create or update remote PRs, commit, or push only if that specific action is authorized by the task.

## Evidence boundary

A fixture-model pass can establish controlled local inference flow or tool execution, but not real-provider availability or quality. Contract, live model/service, and desktop evidence establish different scopes; label them separately. A real-provider check is run only when relevant and explicitly authorized. See the playbook's evidence table and [Verification](../../../docs/wiki/Verification.md).

## Safety boundaries

Follow applicable `AGENTS.md` and the playbook. Do not expose credentials or user data, infer live behavior from fixtures, or commit, push, or mutate a remote unless that action is explicitly authorized.

## Output to retain

Keep the acceptance-to-evidence matrix, exact check outcomes, evidence limits, diff-review result, and final handoff state. Include checks not run and why. Use a closing issue reference only when all acceptance criteria are met and closure on merge is intended.

## Safe dry run

For a documentation-only link correction, map “the link resolves to the intended page” to `npm run docs:check` and `git diff --check`; no runtime test or provider request is implied. Report those as documentation/diff evidence only. The [playbook example](../../../docs/wiki/Agent-Maintainer-Playbook.md#worked-example-illustrative) shows the handoff shape.

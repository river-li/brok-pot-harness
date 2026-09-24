---
name: agent-maintainer-playbook
description: Use this skill for GBH issue triage, focused maintenance, PR evidence, or release-candidate review.
---

# GBH project maintenance

Start with the [canonical maintainer workflow](../../../docs/wiki/Agent-Maintainer-Playbook.md). It defines ownership,
main-based worktrees, grouped delivery, independent review, merge authority, and issue closure.
Use `npm run maintenance -- task start` from the primary checkout to reserve a bounded scope and create a linked worktree from fetched `origin/main`. The primary checkout may be on another branch or contain uncommitted changes. Supply a separate reviewer agent and its trusted `--reviewer-account`. Use `npm run maintenance -- triage` for a bounded read-only dry-run and `npm run maintenance -- pr readiness <number>` for current head/base, checks, formal reviews, and exact account-bound process verdict evidence. These commands do not publish or change GitHub state; a trusted-main API workflow removes stale review labels after head/base changes. See the [tool guide](../../../tools/README.md#agent-maintainer-workflow).

Use the project reference that matches the task:

- **Reproduce a bug:** [Issue triage](../../../docs/wiki/Issue-Triage.md), [Troubleshooting](../../../docs/wiki/Troubleshooting.md),
  and the [runtime test guide](../../../runtime/tests/README.md).
- **Edit recovered source:** [Architecture](../../../docs/wiki/Architecture.md) and [Source recovery](../../../docs/wiki/Source-Recovery.md).
- **Verify a PR:** [CI](../../../docs/wiki/CI.md), [Verification](../../../docs/wiki/Verification.md), and the affected test guide.
- **Review release evidence:** [Verification](../../../docs/wiki/Verification.md), [Source recovery](../../../docs/wiki/Source-Recovery.md),
  [build profiles](../../../runtime/BUILD_PROFILES.md), and [Packaging](../../../docs/wiki/Packaging.md).

Keep conclusions tied to the commit, profile, platform, and evidence actually checked. Fixture tests do not establish
external provider behavior. Apply the authorization in the current task to any remote write or live check.

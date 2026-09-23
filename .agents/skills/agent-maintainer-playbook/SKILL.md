---
name: agent-maintainer-playbook
description: Use this skill for GBH issue triage, focused maintenance, PR evidence, or release-candidate review.
---

# GBH project maintenance

Start with the [canonical maintainer workflow](../../../docs/wiki/Agent-Maintainer-Playbook.md). It defines ownership,
main-based worktrees, grouped delivery, independent review, merge authority, and issue closure.

Use the project reference that matches the task:

- **Reproduce a bug:** [Issue triage](../../../docs/wiki/Issue-Triage.md), [Troubleshooting](../../../docs/wiki/Troubleshooting.md),
  and the [runtime test guide](../../../runtime/tests/README.md).
- **Edit recovered source:** [Architecture](../../../docs/wiki/Architecture.md) and [Source recovery](../../../docs/wiki/Source-Recovery.md).
- **Verify a PR:** [CI](../../../docs/wiki/CI.md), [Verification](../../../docs/wiki/Verification.md), and the affected test guide.
- **Review release evidence:** [Verification](../../../docs/wiki/Verification.md), [Source recovery](../../../docs/wiki/Source-Recovery.md),
  [build profiles](../../../runtime/BUILD_PROFILES.md), and [Packaging](../../../docs/wiki/Packaging.md).

Keep conclusions tied to the commit, profile, platform, and evidence actually checked. Fixture tests do not establish
external provider behavior. Apply the authorization in the current task to any remote write or live check.

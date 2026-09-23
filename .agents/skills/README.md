# Repository-local maintenance skills

These repository-local skills are installed under `.agents/skills` for Codex discovery. They provide narrow workflows and link to maintained GBH guidance; they do not override root or scoped `AGENTS.md` files.

| Skill | Use it when | Example |
| --- | --- | --- |
| [reproduce-bug](reproduce-bug/SKILL.md) | A reported defect needs a minimal, layer-specific reproduction before a fix. | A Responses stream gets HTTP 200 but appears incomplete; first determine whether a local contract covers terminal events. |
| [edit-recovered-source](edit-recovered-source/SKILL.md) | A change touches recovered fragments, reconstruction variants, or local strict TypeScript. | A manifest-mapped classifier behavior needs a focused source change while preserving its bundle boundaries. |
| [verify-issue-pr](verify-issue-pr/SKILL.md) | Implementation is ready for acceptance mapping, evidence review, and handoff. | A docs-only link fix needs a documentation check and a concise PR evidence summary. |
| [review-release-candidate](review-release-candidate/SKILL.md) | A candidate needs a scope-, profile-, platform-, and evidence-specific review. | Check whether recorded local-profile and desktop evidence matches the proposed artifact and target platform. |

All four workflows distinguish fixture inference from real-provider verification. Fixture results establish only their controlled path; a live provider check must be named separately and run only when explicitly authorized. See [Verification](../../docs/wiki/Verification.md).

For the full issue-to-PR process and release decision boundaries, use the [agent maintainer playbook](../../docs/wiki/Agent-Maintainer-Playbook.md). For repository-wide and component rules, follow the applicable `AGENTS.md` files.

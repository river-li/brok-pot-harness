# Agent maintainer playbook

This playbook is for an agent acting as the primary maintainer of one repository issue. Follow applicable system and
developer instructions; user instructions and explicit current-session authorization govern within that hierarchy and
their stated scope. Repository `AGENTS.md` files provide project context but must not be read as revoking authorization
already granted for this session. Preserve product action approvals, release-baseline fidelity, and secret protections.
Issue requirements define scope and acceptance criteria where consistent with governing instructions.

## 1. Intake and scope

1. Read the complete issue: problem, acceptance criteria, explicit exclusions, dependencies, and requested handoff.
2. Confirm the repository and isolated checkout. Run `git status --short` before editing and preserve all existing changes.
   Do not include unrelated work in a commit or PR.
3. Read the root `AGENTS.md` and every scoped `AGENTS.md` covering files you may touch. Read the relevant module README
   and architecture/recovery guidance before changing implementation. The [development guide](Development.md) maps
   common changes to code and checks.
4. Translate each acceptance criterion into a concrete change and a way to verify it. Keep the issue number with the
   work from branch/commit notes through the PR. Work on one issue per PR unless a maintainer approves a tightly
   coupled set.
5. Resolve ordinary ambiguity with a reasonable, bounded, reversible implementation choice and record that choice.
   Ask the issue owner only when a missing requirement, authority, or dependency materially blocks safe progress or
   changes acceptance. Do not silently expand scope or pull unavailable dependent issues into the work.

## 2. Investigate before editing

- Trace the relevant entry point, source ownership, existing behavior, tests, and nearby conventions. Check history only
  when it clarifies provenance or intent.
- Identify the maintained source, not just a generated artifact. In this repository, builds reconstruct `.runtime/build`
  from `reconstruction-manifest.json`; do not implement changes in build output or rewrite `sand-host`.
- For recovered code, preserve fragment markers, ordering, generated identifiers, and profile separation. Do not invent
  imports or bulk-format bundle fragments. See [Architecture](Architecture.md) and [Source recovery](Source-Recovery.md).
- Record important uncertainty as **observed**, **inferred**, or **not verified**, including its impact and what evidence
  or owner decision would resolve it. A test file's existence is not evidence that the behavior passes.

## 3. Implement the issue

- Fix the cause with the smallest focused change that satisfies the stated acceptance criteria. Preserve unrelated user
  edits and avoid opportunistic cleanup.
- Keep behavior in the correct source/profile. Retain original vendor login, billing, cloud provisioning, and sync
  implementations; local behavior must continue to be selected through the local build profile.
- Preserve the original user/action approval path. Never bypass approvals to make a test or flow pass.
- Update only documentation and tests required by the issue. Do not edit a separate issue's scope merely because it is
  adjacent or listed as a dependency.

## 4. Decision boundaries

- **External and paid actions:** Read-only investigation of public documentation, GitHub, and repository state, plus
  ordinary checks within assigned scope, is allowed through authorized tools and access. Do not ask again for an action
  already authorized in this task/session; that authorization covers only its stated scope. Keep remote writes—push,
  create or edit issues/PRs, post comments, change labels/settings, publish docs, or deploy—within that scope; do not
  extend it to unrelated writes. Live model/provider requests can incur cost or send data, so run them only when the
  current task/session authorizes that live test and it is relevant. Report when a requested live check is not run.
- **Destructive changes:** Delete data, alter retention, run destructive migrations, rewrite shared history, or remove
  resources only when the task/session authorization covers that specific target and effect. Preserve release-baseline
  fidelity and never touch unrelated resources. Stop for clarification if an irreversible action's target or impact is
  unclear; do not add blanket sign-offs for routine, reversible work within scope. Clean up only task-created resources
  according to repository test/run requirements.
- **Security-sensitive changes:** Authentication, secrets, authorization, tool approvals, sandbox boundaries, network
  exposure, and data retention need a focused security assessment and tests for allowed and denied paths when changed.
  Never expose secrets in logs or examples, or weaken an existing control to make the task easier. If the security impact
  remains uncertain or a required owner review is outstanding, report the specific concern and hold that change for
  review; do not impose extra sign-offs on unrelated reversible work.
- **Releases:** Tagging, signing, packaging for distribution, publishing, deploying, or announcing a release must be
  within explicit task/session authorization or release-owner scope. A code change or passing test alone does not
  authorize a release.

## 5. Verify and describe evidence

Choose checks that cover the changed behavior, run them from the repository root, and report the exact command and
outcome as **passed**, **failed**, **not run**, or **blocked**. Give a reason for anything not run or blocked. Map evidence
to acceptance criteria and state what it does *not* prove. Existing results in [Verification](Verification.md) are
dated coverage, not a substitute for checks on the current change.

| Evidence class | What it supports | What it does not establish by itself |
| --- | --- | --- |
| Fixture/deterministic | Local control flow using a controlled fake or fixture, such as tool execution against a fixture model | Availability, behavior, or quality of an external model/provider |
| Contract | Expected request/response shape, protocol, validation, and boundary behavior exercised by the contract test | That a live provider or deployed service currently conforms |
| Live model/service | The named live integration path worked against the configured service at the time tested | General provider reliability, other models/configurations, or behavior outside the exercised path |
| Desktop | The reported UI flow worked on the stated platform, build/profile, and app artifact | Other platforms, profiles, or workflows that were not exercised |

Use the [build guide](Build-Guide.md) and [source recovery guide](Source-Recovery.md) for build-specific steps. At minimum,
run `npm run docs:check` after documentation changes and `git diff --check` before handoff. For code, run the applicable
build, strict local check, and relevant tests; run `npm run prepare:desktop` after desktop edits. Docs-only changes do not
require a full runtime build. Check service readiness before any authorized live test. Never claim live inference from a
fixture test, desktop support from a headless contract, or success from a skipped/failed check.

## 6. Review and issue-to-PR traceability

Before handing off, inspect `git diff --check`, `git status --short`, the complete diff, and the changed-file list. Confirm
that generated output, credentials, profiles, user data, and unrelated edits are absent. Map every acceptance criterion
to a change and evidence result; identify any criterion that remains unmet.

When remote PR creation is authorized, include the issue reference in the PR title or body (`Refs #123`), describe the
behavioral change, and map acceptance criteria to evidence. Include exact checks and outcomes, evidence class and limits,
platform/profile where relevant, checks not run and why, security-sensitive decisions, and remaining limitations or
follow-ups. A draft PR may capture partial or blocked work when useful; state each unmet criterion, blocker, and next
action explicitly. Mark a PR ready for review only after all required acceptance criteria and verification gates are met
and the diff is self-reviewed. A PR's existence does not mean the issue is complete. Use a closing reference such as
`Fixes #123` only when all issue acceptance criteria are met and automatic closure on merge is intended. Do not manually
close an issue without authorization.

## 7. Handoff state and follow-up

End the handoff with one clear state:

- **Ready for review:** all acceptance criteria and required verification gates are met; the diff is self-reviewed and
  evidence limits are reported. Provide the commit and PR reference if those actions were authorized; otherwise state
  that the change remains local.
- **Blocked / needs decision:** name the unmet criterion or blocker, evidence collected, exact permission or answer
  needed, and the next safe action. A draft PR may be used if authorized, but must identify unmet criteria and must not
  imply completion.
- **Follow-up identified:** state what is outside this issue and whether it blocks acceptance. Create a separate issue only
  when remote issue creation is authorized; link it and include impact, reproduction/context, expected result, acceptance
  criteria, and known dependencies/evidence. If creation is not authorized, provide that issue description in the handoff.

Create a follow-up for an independently actionable out-of-scope defect, a non-blocking coverage gap, or work explicitly
deferred by the owner. Do not use a follow-up to disguise unmet acceptance criteria: resolve the gap in this issue with
approval, or mark the issue incomplete/blocked and request a scope decision. Avoid speculative issues without a concrete
impact and a verifiable expected result.

For release handoff, report the reviewed commit, verification state, known limitations, and any required release-owner
decision. This handoff is not permission to release or publish.

## Worked example (illustrative)

Issue `#123` asks to fix a broken relative link on one Wiki page. The agent checks the worktree and `docs/AGENTS.md`,
confirms the link target and scope, edits the authored Markdown source (not an exported Wiki copy), then runs
`npm run docs:check` and `git diff --check`. The handoff reports each actual result and says the evidence validates
documentation links only; it does not test runtime behavior. After self-review, if PR creation is authorized, the PR body
can use the following if both checks passed. Real handoffs must replace these example outcomes with the actual results:

```text
Refs #123

Acceptance: the relative link resolves to the intended source page.
Verification: npm run docs:check — passed; git diff --check — passed.
Evidence: documentation validation only; no runtime behavior tested.
Handoff: ready for review; no release or publication performed.
```

If the link checker cannot resolve the intended target, report the blocker and ask for clarification rather than
inventing a destination. If investigation instead finds an independent unrelated broken link, leave it unchanged and
offer a concrete follow-up description.

---
[Documentation](Home.md) · [Get started](Build-Guide.md) · [Configuration](Configuration.md) · [Project](../../README.md)

# Issue reports and triage

Use the [bug, feature, and documentation forms](../../.github/ISSUE_TEMPLATE) to create structured reports. The forms capture
the build profile, project release or revision, Host baseline, desktop version, platform, affected component, reproduction or use-case
steps, expected and actual behavior, and verification layer. Bug reports require the fields needed to reproduce and assess the behavior;
fields that may not apply to feature and documentation requests are optional or allow “Not applicable.”

Once a report is actionable, follow the [maintainer workflow](Agent-Maintainer-Playbook.md) to group related work into one delivery,
assign an owner, start from current main, and carry the change through independent review. The repository [maintenance CLI](../../tools/README.md#agent-maintenance-workflow)
can produce a bounded, read-only issue/CI candidate report; inspect linked evidence before making a triage decision. This page remains the reference for forms,
labels, privacy, and triage decisions.

The current source snapshot uses Host baseline **bfe1879**. For a bug report, verify and enter the baseline used by the affected build;
this repository value is not evidence about another build. Feature and documentation reports may leave contextual fields blank when they
do not apply. The project package version is `0.0.0-reconstructed`; report the actual release tag, branch, or commit when it differs. The
desktop resource version and Electron runtime version are separate values; include whichever is shown by your installation. See
[Source recovery](Source-Recovery.md) for version context and [Verification](Verification.md) for the evidence each verification layer establishes.

## Privacy contract

Provide only the smallest sanitized diagnostic excerpt needed to reproduce or assess an issue. Remove API keys, access/session/Gateway
tokens, raw environment dumps (including `.env`), private conversation data, user files, and unredacted personal paths. Do not attach
raw logs, environment files, profiles, or runtime data. If an error contains sensitive material, replace it with `[redacted]` and retain
the error type, relevant non-sensitive message, and the step where it occurred. Maintainers must not ask reporters to paste secrets or
private conversation contents.

## Label taxonomy and ownership

The exact names, colors, and descriptions are recorded in the [issue label manifest](../../.github/issue-labels.yml). The manifest is
version-controlled reference data and does not provision repository labels. GitHub settings will be synchronized after review; do not
claim the labels are active before provisioning. Issue forms apply `status:needs-triage` only after that label exists in repository settings.

| Prefix | Meaning | Who or what may change it |
| --- | --- | --- |
| `area:*` | One primary component: desktop, Host, Harness, runtime, integrations, documentation, source recovery, or other/unclassified. | A maintainer or explicitly authorized agent with GitHub triage permission may assign or revise one within the granted scope. |
| `priority:*` | Work execution order: high, normal, or low. Priority is separate from severity and user impact. | A maintainer or explicitly authorized agent with GitHub triage permission may assign or revise one within the granted scope. |
| `status:*` | Current triage or work state. Status labels are mutually exclusive. | Forms add only `status:needs-triage`. A maintainer or explicitly authorized agent with GitHub triage permission may change status within the granted scope. `status:confirmed` requires verification evidence. |

An explicit user/task authorization covering triage applies to its full scope; do not ask again for each reversible label change. An agent
acting under that grant is a maintainer for the authorized scope, not unattended automation, and must hold GitHub triage permission.
Unattended rules and bots default to proposal or dry-run mode and must not silently relabel or close user reports. Only repository
administrators change label definitions or repository label settings. They update this manifest and related form or documentation
references in a reviewed change, then synchronize GitHub settings. Reporters may suggest a label; they do not change the taxonomy through
the forms.

Use one label from each prefix once triaged. The priority descriptions define rationale: high goes early when it enables maintenance/CI
prerequisites or unblocks dependent work; normal is routine actionable work without a reason to go first; low is useful work that can safely
wait. These labels set execution order, not incident severity. Record severity, affected users, and concrete impact in the report evidence;
do not assign priority from severity alone. `status:needs-info`, `status:confirmed`, `status:in-progress`, `status:blocked`, `status:duplicate`,
`status:unsupported`, and `status:resolved` are the documented status transitions. If a label name, color, or meaning changes, update the
manifest, this page, and any form defaults together, then synchronize the repository label settings.

## Triage rules

1. **Duplicates:** Confirm that an existing issue describes the same behavior, link the canonical issue, and apply `status:duplicate`. Close
   it only when the task authorization covers closure. A similar symptom alone is not enough; retain distinct reports when their profile,
   baseline, component, or reproduction differs.
2. **Suspected regressions:** Ask for the last known good and first known bad release or revision, build profile, Host baseline, and the same
   minimal reproduction on both. Keep the report in triage or mark `status:needs-info` until evidence distinguishes a regression from profile,
   baseline, or environment differences. Apply `status:confirmed` only after an authorized maintainer reproduces or verifies the reported behavior.
3. **Unsupported environments:** Compare the claim with the current [Features](Features.md) and [Verification](Verification.md) pages. State the
   exact environment or workflow that is outside documented support and use `status:unsupported` only for that unsupported case. If the issue
   may also affect a documented, verified workflow, assess that workflow separately and keep the issue open while evidence is gathered. Close
   an unsupported-only report only when the task authorization covers closure and the support boundary is explained.
4. **Unclear evidence:** Apply `status:needs-info` and make one concise request for the specific missing detail, such as a release/revision,
   component, minimal reproduction step, expected-versus-actual result, or sanitized error excerpt. Keep the issue open while waiting; do not
   ask for credentials, raw environment data, or private conversations.

After triage, assign one `area:*` and one `priority:*` label. Choose priority from dependency order and the rationale above; record user impact
separately. Apply `status:resolved` only after a fix or correction is verified. Closing any report requires task authorization that covers
closure and a satisfied closure rule; explain the evidence, linked issue, or documented support boundary in the closing comment.

## Pre-merge review checklist

- Parse all three form files as YAML and confirm each has a unique name, title prefix, valid `body`, unique field IDs, and only supported
  field types and attributes. Confirm the chooser contains bug, feature, and documentation reports and blank issues are disabled.
- Confirm all three forms offer build profile, project release/revision, Host baseline, desktop version, platform, component, and verification
  layer. Confirm bug reproduction steps and expected/actual behavior are required; check that feature and documentation forms require a concrete
  use case or page path and an expected outcome while leaving irrelevant context optional.
- Confirm feature and documentation build profile, Host baseline, and verification layer are optional. Confirm the bug form asks the reporter
  to verify and enter the affected build's Host baseline instead of treating the repository baseline as evidence.
- Confirm other required bug values allow Unknown/Not sure when they cannot be determined.
- Confirm all free-text fields use plain-text rendering and there are no file-upload fields. Confirm the sanitized-diagnostics instructions
  exclude keys, tokens, raw environment dumps, and private conversation data in every form.
- Compare every label name, color, and description in `.github/issue-labels.yml` with the planned repository settings. Provision labels only
  after review; ensure `status:needs-triage` exists before expecting the forms to apply it.
- Review at least one triage example for each rule above: a duplicate with a canonical link, a suspected regression with first-good/first-bad
  revisions, an unsupported environment checked against current support docs, and an unclear report that receives a specific information request.
- Run `npm run docs:check` and `git diff --check` after documentation or form changes.

GitHub documents the [issue form schema](https://docs.github.com/en/communities/using-templates-to-encourage-useful-issues-and-pull-requests/syntax-for-githubs-form-schema)
and notes that a form label must already exist in repository settings to be applied.

---
[Documentation](Home.md) · [Get started](Build-Guide.md) · [Configuration](Configuration.md) · [Project](../../README.md)

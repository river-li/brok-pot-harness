# Issue reports and triage

Use the [bug, feature, and documentation forms](../../.github/ISSUE_TEMPLATE) to create structured reports. The forms capture
the build profile, project release or revision, Host baseline, desktop version, platform, affected component, reproduction or use-case
steps, expected and actual behavior, and verification layer. Bug reports require the fields needed to reproduce and assess the behavior;
fields that may not apply to feature and documentation requests are optional or allow “Not applicable.”

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

## Read-only agent audit

Run `npm run triage:dry-run` from the repository root. The routine reads at most 100 open issues and the 50 most recent
workflow runs with `gh`; it fetches failed-job names for at most 10 runs and reads state for at most 10 linked fix PRs.
It reads the support table in this page's
companion [Features](Features.md) reference and the `Coverage still needed` section of [Verification](Verification.md).
The review report is written to ignored `.runtime/triage/report.md`; `--output -` prints it instead. The routine has
no issue creation, comment, label, close, or other GitHub write path.

If a failed run needs a diagnostic signature, a maintainer may place already-sanitized excerpts in
`.runtime/triage/sanitized-input` as `<run-id>.txt` files. Each file is read up to 64 KiB. The CLI accepts
diagnostic inputs only from this dedicated ignored directory; do not place raw logs, application data,
profiles, `.env`, or user workspaces. Only recognized exception classes and machine error codes enter a signature;
the report never emits excerpts, issue titles or bodies, reporter identities, branch names, or raw URLs from input.
It does show issue numbers and approved taxonomy labels. The issue and run counts are capped and the report says
when a cap was reached.

### Signatures and issue proposals

A v1 failure signature is a SHA-256 digest of the normalized workflow name, failed job names, and any allow-listed
diagnostic classes or codes. It omits run IDs, branches, and revisions so repeated occurrences can group together.
Without a supplied diagnostic excerpt, the signature is only at workflow/job level and may group different errors in
the same job; inspect the CI run before treating it as one bug. The report combines repeats into one candidate.

An existing open issue is an exact duplicate only when its body contains the same
`Triage failure signature: v1:sha256:<64 lowercase hex>` marker. Exact matches are linked by issue number in the
report and suppress a new proposal. A likely text match against an unmarked report is withheld for a maintainer to
compare. Similar symptoms alone do not establish a duplicate. The report never resolves conflicts between several
issues with the same marker.

New proposals are suggestions only, capped at 10 per report. Review the safe issue index and the original CI runs
before filing through the bug form. Preserve the signature marker and add this neutral metadata to the issue body:

```text
Triage failure signature: v1:sha256:<64 lowercase hex>
Reproduction status: Failed in CI; not checked outside CI
Affected release/revision: <first failing commit>
Last known good release/revision: <prior successful commit or Unknown>
First known bad release/revision: <first failing commit>
Fix PR: None
Verification evidence: Pending
```

The package version shown by the report comes from the audited checkout and must be confirmed at the failing revision
before it is treated as that build's version. For user reports, preserve their
current body and labels; add a signature only after a maintainer establishes that it matches a specific failure.
Never copy diagnostic excerpts or reporter prose into generated proposals. To link the regression through its
lifecycle, keep the CI run URL and signature on the issue, fill `Fix PR` after a fix exists, and replace Pending with
the exact passing check/run and verification layer only after that check succeeds. Mark reproduction as reproduced
only after an authorized maintainer has reproduced or independently verified the behavior. A previous green CI run
is a regression signal, not proof; compare the build profile, Host baseline, and environment.

### Feature gaps and user reports

The report includes the support statements from Features and every bullet under Verification's coverage-gap heading.
During the weekly review, compare each statement with the linked open-issue index. Open the relevant issues to check
their component, affected release, reproduction evidence, and verification layer; the generated report itself never
copies user titles or bodies. Keep user reports unchanged while gathering this context.

If a documented gap has no matching issue, prepare a feature or documentation proposal from the relevant source
heading and statement. State the user-visible limitation, supported workflow affected (if any), and the smallest
verification needed to establish progress. Use the issue #4 component map for its area label and select priority
from dependency order after review. Do not mark an unverified support gap as a regression or infer priority from
severity. Leave build profile, release, and reproduction as not applicable when they do not apply.

### Cadence and ownership

The rotating repository maintainer assigned to triage owns the report and each unassigned follow-up. Run the audit
after a default-branch CI failure and once each week. Review stale open issues at 30 days without an update, and
again every two weeks while they remain open. Ask the assignee or reporter for the next useful step; do not close or
relabel reports automatically.

Review merged-fix issues with pending verification at the next post-merge check and each weekly pass. Keep them open
until the relevant verification layer passes and the evidence is recorded. For a suspected regression that breaks
the documented default workflow, compare the last known good and first known bad revisions promptly, ideally within
one business day. The maintainer records the reproduction outcome and affected release. These checks do not change
issue labels or close issues; status changes remain an explicit maintainer action under the taxonomy above.

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

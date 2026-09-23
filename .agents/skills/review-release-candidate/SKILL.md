---
name: review-release-candidate
description: Review a GBH release candidate's source, profile, artifacts, and verification evidence for stated scope. Use for a pre-release assessment; it does not authorize publishing or deployment.
---

# Review a release candidate

Review the candidate and its evidence against the stated release scope. Keep the assessment tied to the exact revision, profile, artifact, and platform. Use [Verification](../../../docs/wiki/Verification.md), [Source recovery](../../../docs/wiki/Source-Recovery.md), [build profile implementation](../../../runtime/BUILD_PROFILES.md), and [Packaging](../../../docs/wiki/Packaging.md) as authorities.

## Inputs

- Candidate commit/revision and intended release scope.
- Build profile, target platform, and artifact path where relevant.
- Acceptance evidence, test outputs, known limitations, and any required release-owner criteria.

## Workflow

1. Read root and applicable scoped `AGENTS.md` and the cited verification/build guidance. Confirm the exact candidate and inspect its status/diff without changing it.
2. Trace maintained source and profile to the candidate artifact. Confirm generated output is attributable to the current source and manifest; review profile isolation and immutable baseline fidelity.
3. Compare available checks with the candidate's scope using [Verification](../../../docs/wiki/Verification.md), the [runtime test guide](../../../runtime/tests/README.md), and [Packaging](../../../docs/wiki/Packaging.md). If evidence is missing, report it; run additional checks only when they are relevant and within the task's authorization. A packaging command may replace an existing artifact, so inspect its documented effects first.
4. Record findings by evidence layer, target platform/profile, and known coverage gaps. Hand off unresolved release-owner decisions rather than changing the candidate to make it pass.

## Evidence boundary

Fixture inference proves only the controlled path exercised, not external provider availability, behavior, or quality. A real-provider check is separate, potentially billable, and requires explicit task authorization. Contracts, live service checks, and desktop flows are not interchangeable; label the exact layer as defined by [Verification](../../../docs/wiki/Verification.md).

## Safety boundaries

Do not edit `.runtime/build` or `sand-host`; generated artifacts are review targets and `sand-host` is the immutable release baseline. This review does not authorize tagging, signing for distribution, publishing, deployment, announcement, or changes to release settings. Follow the task's explicit authorization and the playbook's release boundary.

## Output to retain

Report candidate revision, artifact, profile/platform, review scope, findings, exact evidence and outcomes, fixture/live distinction, gaps, and release-owner decisions. Give a review recommendation with its limits; do not imply release completion from a passing build alone.

## Safe dry run

Inspect the declared profile policy without building or writing artifacts:

```sh
python3 - <<'PY'
import json
from pathlib import Path

profiles = json.loads(Path("runtime/build-profiles.json").read_text())
print(json.dumps(profiles, indent=2))
PY
```

This reports the source policy only. It does not establish that a candidate artifact was built with that policy.

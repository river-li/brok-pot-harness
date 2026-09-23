# CI tiers and required gates

CI reports which build profile and verification layer ran. The required offline lane always uses the `local` profile.
The workflow files live in [`.github/workflows`](../../.github/workflows); CI is a check on this snapshot, not the dated
coverage record in [Verification](Verification.md).

## Required PR gate

Every pull request runs **Required CI / offline gates** on Ubuntu with Node.js 22.16.0 and Python 3.12.10. It installs
the root lockfile and runs the following commands in order:

1. `npm run build -- --profile local`
2. `npm run check:local`
3. `npm run test:recovery`
4. `npm run test:runtime-build`
5. `npm run check:syntax` for maintained runtime scripts and freshly generated app outputs
6. `npm run docs:check`
7. All offline contract scripts listed in the [test guide](../../runtime/tests/README.md)
8. `git diff --check` against a verified base/head range for the event

This lane does not start Docker, read model credentials, launch the desktop, or request inference from a provider. Contract
tests use controlled local fixtures. A fixture-model or contract pass is not external inference evidence. If the build
fails, dependent contracts are recorded as not run and the required job fails.

The report names the actual checked-out commit. For a pull request it also records the source head and base separately:
GitHub checks out its merge result, while diff hygiene compares the pull request source range. A push compares its
`before` commit with the checkout. A new-branch push compares the common base with the fetched origin default branch;
manual dispatch uses the same default-branch comparison. A root commit is compared with the empty tree. Missing,
malformed, or unavailable refs fail the gate instead of falling back to a local diff.

The selector has regression tests for pull requests, regular pushes, new branches, manual dispatch, invalid refs, root
commits, and whitespace failures. They run as part of `npm run test:recovery`.

To make the gate block merges, the repository's default-branch ruleset or branch protection must require the check named
**Required CI / offline gates**. A workflow file can publish a failing check, but repository settings determine whether a
red check blocks merging. Release candidacy requires this check to pass.

## Select checks by changed area

The offline gate runs for every pull request, so changes cannot avoid build, local type, syntax, contract, documentation,
or diff checks by falling outside a path filter. Additional lanes are selected as follows:

| Changed area | Required | Additional check |
| --- | --- | --- |
| Every pull request | Required CI / offline gates | Changes below add an optional lane where listed |
| `.github/workflows/**`, `runtime/compose.yaml`, Box entrypoint, runtime tests/tools, desktop source, Agent/Harness source, MCP or Agent host extensions | Required CI / offline gates | Isolated Docker integration runs automatically; it can also be dispatched manually |
| Responses transport or provider-specific behavior | Required CI / offline gates, including Responses contracts | Run the optional real-provider workflow when provider compatibility is part of the change |
| `runtime/desktop-src`, `runtime/renderer-src`, desktop resources or packaging | Required CI / offline gates | Run optional macOS desktop verification before release candidacy |
| Wiki pages, READMEs, or documentation exporter | Required CI / offline gates, including `docs:check` | No runtime lane is implied by a docs-only edit |

The Docker workflow's path list is authoritative for automatic selection. Workflow edits are included so changes to the
CI definitions exercise the isolated Docker lane. The macOS and provider workflows are manual so they do not spend
self-hosted desktop capacity or make billable/network requests on every pull request.

## Optional isolated Docker integration

The path-triggered Docker workflow validates Compose with non-secret sentinel values without starting its services,
builds the `local` profile, prepares the desktop, and runs `runtime/tests/plugins-live.cjs` with a fixture Responses
server. That test creates a run-specific Box container, data directory, and desktop profile. CI gives the run a unique
ID; cleanup targets only that run's container and test directory. Its diagnostics are removed in CI and are never
uploaded. The Ubuntu runner is discarded after the job.

This exercises plugin installation, a real local MCP process, fixture-driven Agent behavior, and desktop interactions in
an isolated integration environment. It does not validate a live model provider. Its status is optional and does not
replace the required offline gate.

## Optional real-provider verification

The manual `Optional real-provider verification` workflow runs `npm run test:responses` against the configured
Responses API after a local-profile build. Configure repository variables `GBH_CI_RESPONSES_BASE_URL` and
`GBH_CI_MODEL`, and secret `GBH_CI_LITELLM_API_KEY`. This sends the test's fixed verification prompt to that provider
and may incur charges. The job is separate from fixture contracts and the Docker lane. Its artifact contains only the
result, profile, verification layer, and commit; it does not contain prompts, responses, credentials, or logs.

## Optional macOS desktop verification

The manual `Optional macOS desktop verification` workflow uses a dedicated self-hosted runner labeled
`gbh-desktop-ci`. The runner needs a logged-in GUI session, Docker with `linux/amd64` support, and an ephemeral or
otherwise isolated workspace. It builds the local profile and runs the same plugin flow in native macOS Electron with a
private fixture-model Box container and profile. It does not need a provider key and does not establish external
inference. The workflow removes its run-specific container and test directory; do not point the runner at user data or
an unrelated Compose stack. The runner and hosted macOS result have not been verified by this change.

## Evidence artifacts

Each workflow uploads a concise Markdown result with the build profile, commit, verification layer, and gate result.
Artifacts omit logs, prompts, responses, conversation content, screenshots, environment values, and credentials. The
required-lane summary explicitly says that external inference was not attempted. Workflow logs remain separate from
these sanitized artifacts. All workflows start from a checkout and install dependencies from lockfiles; Docker and
desktop test data use run-specific directories. Re-runs use a distinct run attempt identifier, and cleanup removes only
the test-owned container and directory. A self-hosted Mac runner must provide an isolated workspace. These definitions
have not yet produced a hosted Actions result, so no Linux or macOS desktop support claim follows from the workflow
files alone.

---
[Development](Development.md) · [Tests](../../runtime/tests/README.md) · [Verification](Verification.md)

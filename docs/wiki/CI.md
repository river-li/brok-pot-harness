# Required pull request checks

Every pull request runs the offline workflow defined in [required-ci.yml](../../.github/workflows/required-ci.yml). Depending on the changed paths, it checks either documentation and recovery or the local build, contracts, documentation, and whitespace from a clean checkout.

## Required check

The workflow is named Required CI and its job check context is offline gates. It runs for pull requests to every base branch so it can reject a PR whose target is not main. Before installing dependencies, it also checks that the PR base SHA is the current origin/main commit and that the published head contains that base. A stale branch or a PR based on another PR fails before the full gate starts.

GitHub checks out the PR merge commit for build and test commands. The evidence records that checked-out commit and, for a PR, the separate source base and head SHAs. The whitespace check compares the source base/head range, not the merge commit. Pushes compare their before/head commits; new branch pushes and manual runs use the common base with origin/main. Root commits use the empty tree. Missing or invalid refs fail instead of falling back to an unverified diff.

The workflow installs the root dependencies from package-lock.json, then uses the shared gate runner to select checks from the verified changed paths. Markdown-only changes run the recovery and documentation checks. Any source, test, package/configuration, workflow, or other non-Markdown change runs the local build, strict type check, recovery and runtime-build tests, JavaScript syntax check, documentation and scoped-guide audit, and all offline contract scripts. An empty manual dispatch selects the full suite. Every run checks whitespace against its verified source range.

The separate invalidate-review-readiness.yml workflow clears review labels on PR head synchronization, base edits, and pushes to main. It checks out only trusted main-branch code and uses `contents:read` plus `pull-requests:write`; it never checks out or executes the PR head. Although the REST labels endpoint is under the shared Issues API route, PR label removal needs pull request write permission in the [GitHub Agentic Workflows safe-output permission map](https://github.github.com/gh-aw/specs/safe-outputs-specification/). This workflow is a stale-label cleanup signal, not a required merge check. The maintenance readiness command independently verifies current head/base SHAs, current checks, formal review state, and the designated process verdict.

The available commands are:

1. npm run build -- --profile local
2. npm run check:local
3. npm run test:recovery, including scoped-guide, CI event/base, and maintenance workflow behavior tests
4. npm run test:runtime-build
5. npm run check:syntax for maintained JavaScript and freshly built app outputs
6. npm run docs:check for Wiki links and README-declared source-component AGENTS.md coverage
7. All offline contract scripts in the [runtime test guide](../../runtime/tests/README.md)
8. git diff --check for the verified event range

Before publishing a PR, run npm run ci:pre-pr. It fetches current origin/main, requires a non-main task branch in a clean linked worktree, verifies that the current main commit is an ancestor of the branch, and runs the same path-selected gates used by CI. Install dependencies first with npm ci --no-audit --no-fund if needed. Git verifies present ancestry only; it cannot prove the branch's original creation point, detect copied commits from an unmerged branch, or infer a human's intent. CI checks the actual PR base and rejects any target other than main.

## Staged checks

An optional pre-commit hook checks the staged index only. It checks staged whitespace, rejects edits under .runtime, sand-host, and dist/local, preserves recovered-fragment marker identity and order, and parses staged JSON and Python syntax. Unstaged working-tree changes are not part of that result. Install it explicitly with npm run hooks:install. The installer refuses a configured custom core.hooksPath or an existing hook; it does not change Git configuration or replace another hook. The hook is a convenience and can be bypassed; CI reruns authoritative checks.

## Evidence and failure behavior

The required lane uses no provider key, starts no Docker or desktop services, and makes no paid model request. Contract tests use local fixtures or loopback services; their results cover only the paths those tests exercise. They do not establish external provider availability or desktop support.

The job summary and short-lived artifact record the result, build profile, verification layer, checked-out commit, source PR commits, and each gate outcome. They omit prompts, transcripts, screenshots, credentials, environment values, and logs. If setup fails before the runner starts, a fallback artifact records only the event and checkout metadata. A failed build marks dependent contracts as not run; any failed required gate keeps the job red. The same runner and selection rules serve pre-PR and CI modes.

## Main branch enforcement

Main branch protection requires the offline gates check from the GitHub Actions app (app ID 15368), with strict up-to-date checks and stale-review dismissal. The owner verified the effective rule. The GitHub approval count is zero because the publishing account cannot provide an independent approval; the process still requires the fresh separate-agent review described in the [maintainer workflow](Agent-Maintainer-Playbook.md). Keep the required check context in sync if the job name changes. This server-side rule enforces check success; useful scope, sound design, readable explanation, and truly independent review remain human/agent judgments that CI cannot prove.

Provider, live service, and desktop checks remain separate from this required offline workflow. Choose those checks only when the issue needs that evidence; see the [runtime test guide](../../runtime/tests/README.md) and [Verification](Verification.md).

---
[Maintainer workflow](Agent-Maintainer-Playbook.md) · [Development](Development.md) · [Verification](Verification.md)

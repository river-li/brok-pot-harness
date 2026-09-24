# Repository tools

Release recovery and documentation publishing utilities. Daily runtime builds use `npm run build` and
[runtime/tools](../runtime/tools/README.md).

| Tool | Responsibility |
| --- | --- |
| [recover-bundles.py](recover-bundles.py) | Identify release boundaries and extract JS/MJS/CJS modules |
| [recover-native.py](recover-native.py) | Export a clean recovery preserving the native layout |
| [test_recovery.py](test_recovery.py) | Recovery boundary and mapping tests |
| [export-wiki.py](export-wiki.py) | Validate English documentation and export native GitHub Wiki pages |
| [test_wiki.py](test_wiki.py) | Wiki navigation, media, source links, and validation tests |
| [check-guidance.py](check-guidance.py) | Ensure README-declared maintained source components have scoped AGENTS.md guidance |
| [maintenance.py](maintenance.py) | Create registered main-based task worktrees and print read-only issue, CI, and PR readiness evidence |
| [test_maintenance.py](test_maintenance.py) | Task ownership, worktree, dependency, triage, and stale-review evidence tests |
| [tools/ci](ci/) | Run required offline PR gates and syntax checks; covered by test_ci_gates.py |

## Agent maintenance workflow

The [canonical maintainer workflow](../docs/wiki/Agent-Maintainer-Playbook.md) owns policy. The CLI makes its recurring setup and evidence checks executable:

Run the CLI on POSIX Linux or macOS because its ownership lock uses Python's `fcntl`. It requires Git, Python 3, Node.js/npm for the package-script wrapper, and GitHub CLI (`gh`) authenticated for this repository's read operations. The checkout must have a GitHub.com `origin` whose canonical repository default branch is `main`; task setup also needs permission to fetch origin/main and create linked worktrees. The implementation and review agent runner is installed and authenticated separately. This CLI does not install or start an agent or model. The repository skill and this guide provide the workflow instructions without private local configuration.

```sh
npm run maintenance -- task start --issue 123 --slug focused-change \
  --owner implementation-agent --reviewer coordinator-agent \
  --reviewer-account github-reviewer-login \
  --path tools/maintenance.py --path tools/test_maintenance.py \
  --accept "observable behavior is delivered" \
  --check "npm run test:recovery" \
  --rollout "verify the published page after merge"
npm run maintenance -- task list
npm run maintenance -- triage --limit 100
npm run maintenance -- pr readiness 123 --reviewer-account github-reviewer-login
npm run maintenance -- task release --slug focused-change --reason "ownership ended after handoff"
```

Run task setup from the primary checkout; it may be on another branch and may contain user changes. Setup fetches `origin/main`, checks the open issue and explicitly declared PR dependencies, reserves repository-relative paths in shared Git metadata, and creates `.runtime/worktrees/<slug>` from the verified fetched main commit. It does not switch branches, reset files, or require the primary checkout to match main. Directory scopes include descendants. Existing branches, bundles, and worktree paths are left untouched. Registered overlapping scopes fail with the current owner; registration coordinates only tasks created through this shared Git metadata, so coordinate manually with other clones and unregistered tasks. Git can verify current ancestry, not historical branch creation.

After `task start`, read the generated bundle at the printed `Task bundle:` path. Start the separately installed implementation agent with its working directory set to the created worktree and provide the repository skill (`.agents/skills/agent-maintainer-playbook/SKILL.md`) and bundle as instructions. After publishing the PR, start a fresh session for the designated reviewer and provide the exact published head SHA, base SHA, diff, and verification evidence. The coordinator may review when explicitly assigned and distinct from the implementation owner; a fresh session still needs the exact revision and evidence.

Repository resolution starts from the Git `origin` URL and pins every GitHub query to the resulting canonical repository; `GH_REPO`, upstream defaults, or the current branch do not redirect it. Triage samples at most 100 issues and workflow runs. Exact normalized issue-title matches and repeated workflow/event/branch failures are candidates with links, not confirmed duplicates or common causes. It shows whether a sampled failure belongs to a current head, a merged/advanced historical PR, or an item needing attention; up to 20 failed runs include sanitized job and step names, not logs or issue bodies. Action-required runs are separate from failed checks. Reports are read-only and are not scheduled for unattended writes.

PR readiness rereads the PR head/base and `main` SHA around collection, fetches the exact head commit, and uses GitHub's compare response to require that the PR contain current main and have no commits behind it. It reads required checks for the current PR and all review pages (`gh api --paginate --slurp`); malformed or incomplete responses fail closed. A current `COMMENTED` process verdict must match the exact head and base, the comment's commit must equal the head, and its account must match the explicitly designated reviewer account from task policy or `--reviewer-account`. Without that binding, the report cannot say ready. A `NEEDS_CHANGES` verdict and outstanding formal `CHANGES_REQUESTED` review or GitHub review decision block readiness; a later plain comment does not dismiss a formal review. Same-account coordinator review is permitted only when that distinct reviewer role was designated. GitHub identifies the posting account, not the agent behind it.

Use a natural-language review summary first, then this structured block so prose remains readable:

```markdown
Reviewer summary: describe the reviewed changes and verification in natural language.

<details>
<summary>GBH review evidence</summary>

verdict: READY_TO_MERGE
head-sha: <full-head-sha>
base-sha: <full-main-sha>
</details>
```

The verdict is process evidence, not an approval, code-quality proof, or merge authorization. On head synchronization, base edits, and pushes to main, `.github/workflows/invalidate-review-readiness.yml` removes stale review labels through GitHub API calls. The workflow checks out trusted `main` code, grants only `contents:read` and `pull-requests:write`, and never executes PR code with its token. PR label removal needs pull request write permission even though the shared REST endpoint is under Issues. It removes `review:pending` if found because that label triggers the Claude workflow; this tooling never adds it. Readiness independently checks exact review SHAs, so stale comments and labels cannot qualify after a revision. Triage and readiness never post, label, approve, trigger Actions, merge, or run PR code. `npm run test:recovery` includes these behavior tests in the existing required CI lane.

## Clean source recovery

```sh
npm run recover
npm run test:recovery
```

Default output is `.runtime/recovered-clean`; an existing destination is rejected.
Use `npm run recover -- --output .runtime/recovered-review` for another destination.
Recovery does not overwrite maintained source and is not an application upgrade/deployment command.

## Documentation

```sh
npm run docs:check
npm run docs:site:build
npm run docs:wiki
```

`docs:check` validates Wiki links and the Pages staging regressions, then checks source component guidance under
`src/`, `packages/`, `dune/`, `reconstruction/`, `runtime/`, and `tools/`.
It prunes installed dependencies and generated/cache directories before
walking; maintained package `dist/` source remains in scope.
The [Development guide](../docs/wiki/Development.md#scoped-guidance-coverage)
defines which directories the check treats as components.

`docs:site:setup` installs the pinned MkDocs dependencies into ignored `.runtime/docs-venv/`.
`docs:site:build` generates an allowlisted source tree and renders the GitHub Pages website into
`.runtime/docs-site/site/` with MkDocs. `docs:site:serve` previews the same generated source tree.
The Wiki exporter writes `.runtime/wiki` and performs no network writes.
See [Publishing](../docs/wiki/Publishing.md) for local preview, Pages deployment, rollback, and the separate Wiki workflow.

[Source recovery](../docs/wiki/Source-Recovery.md) · [Maintenance rules](AGENTS.md)

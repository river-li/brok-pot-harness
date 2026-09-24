# Publish documentation (GitHub Pages and native Wiki)

The canonical documentation source remains this repository's Markdown (`docs/wiki`, module README files, and
referenced media). Publication has two independent destinations:

- **GitHub Pages website** (project site) for discoverable, navigable docs.
- **Native GitHub Wiki** (`<repository>.wiki.git`) for teams that still use Wiki workflows.

Do not claim either destination is live until you verify its URL after deployment.

## GitHub Pages website

## 1. Build and preview locally

From the repository root:

```sh
python3 -m venv .runtime/docs-venv
.runtime/docs-venv/bin/python -m pip install -r docs/requirements-pages.txt
npm run docs:check
npm run docs:site:build
npm run docs:site:serve
```

Then open <http://127.0.0.1:8000/>.

`docs:check` validates source links, component guidance, and the site generator's safety/link regressions.
`docs:site:build` stages authored Markdown and linked media under ignored `.runtime/docs-site/`, builds with
MkDocs, then checks generated links, anchors, and allowed output files. `docs:site:serve` prepares the same
staging tree before starting the preview server. Source-code links in the site point to the exact source commit.
Mermaid diagrams use a pinned browser renderer and are checked in the local browser preview.

For previews under a project base path (forks/renames), set:

```sh
GBH_DOCS_SITE_URL="https://OWNER.github.io/REPO/" npm run docs:site:build
```

When building a fork, set `GBH_DOCS_REPOSITORY` to its `OWNER/REPO` slug as well. GitHub Actions derives both
values from the repository that triggered the workflow. The site build output is `.runtime/docs-site/site/`;
it includes generated pages, linked documentation media, theme assets, and `source-commit.txt` only.

## 2. CI validation and deployment

`.github/workflows/docs-pages.yml` provides one pipeline:

- **Pull requests:** build + link validation only (no deployment credentials or Pages publish step).
- **`main` pushes / manual dispatch:** same validation, then uploads and deploys the Pages artifact to
  the `github-pages` environment.

The workflow runs for every pull request so its `Documentation site / build` check reports on unrelated changes too.

A broken doc link or failed site build fails this workflow, so the deployment job will not run.

The build stamps `source-commit.txt` with the exact source commit; this identifies which source commit produced
that published artifact.

## 3. Repository settings and discoverability

One-time repository settings:

1. **Settings → Pages**: set **Build and deployment → Source** to **GitHub Actions**.
2. After the first successful deployment, copy the returned `page_url`.
3. **Settings → General → Repository details → Homepage**: set it to that URL so the website appears in repository metadata.

For this repository, the expected project-site pattern is `https://river-li.github.io/brok-pot-harness/`.
Forks use `https://<fork-owner>.github.io/<fork-repo>/`.

## 4. Verify, troubleshoot, and roll back

After a deployment run:

1. Open the deployed HTTPS URL from the workflow summary.
2. Confirm navigation reaches a page from each major section and at least one component guide.
3. Confirm Mermaid diagrams render (for example, Architecture).
4. Confirm `source-commit.txt` matches the commit that triggered deployment.

If deployment fails:

- Open the failed workflow run, inspect the failing step logs, fix source/docs config, and re-run from a new commit.
- If build passes but deploy fails, re-run the failed jobs after correcting permissions or Pages settings.

Rollback options:

- **Preferred:** revert the bad commit on `main`; the workflow redeploys the previous-good content.
- **Emergency:** use GitHub Pages deployment history to redeploy the last good artifact, then follow with a source revert
  so source and published site stay in sync.

## Native GitHub Wiki export (separate destination)

GitHub Wikis are separate repositories. Exporting Markdown here does **not** publish anything until you push to
`<repository>.wiki.git`.

### 1. Validate and export

```sh
npm run docs:check
npm run docs:wiki
```

Optional repository/ref override:

```sh
npm run docs:wiki -- --repository OWNER/REPO --ref main
```

### 2. Copy into a Wiki checkout

```sh
git clone https://github.com/OWNER/REPO.wiki.git .runtime/wiki-checkout
cp .runtime/wiki/*.md .runtime/wiki-checkout/
cp -R .runtime/wiki/assets .runtime/wiki-checkout/
```

On updates:

```sh
git -C .runtime/wiki-checkout pull --ff-only
```

### 3. Review and publish

```sh
git -C .runtime/wiki-checkout status --short
git -C .runtime/wiki-checkout diff --check
git -C .runtime/wiki-checkout diff
git -C .runtime/wiki-checkout add -- '*.md' assets
git -C .runtime/wiki-checkout commit -m "docs: publish project wiki"
git -C .runtime/wiki-checkout push
```

The website deployment and the Wiki export are intentionally separate. Use whichever destination your audience needs,
or both.

---
[Documentation](Home.md) · [Development](Development.md) · [Project](../../README.md)

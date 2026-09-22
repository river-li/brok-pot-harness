# Publish the GitHub Wiki

The canonical documentation lives in this repository. The exporter builds a native GitHub Wiki from those sources:
Home, sidebar, footer, user guides, package guides, Host extension guides, and referenced media.
English is the default; the Chinese project overview stays in the separate `README.zh.md`.

## How hosting works

GitHub Wikis use a separate `<repository>.wiki.git` repository. Pushing Markdown into the main repository's `docs/`
directory alone does not publish a Wiki. Enable Wiki for the repository and create its initial Home page on GitHub before
cloning it. GitHub documents this [Wiki Git workflow](https://docs.github.com/en/communities/documenting-your-project-with-wikis/adding-or-editing-wiki-pages).

`Home.md` is the entry page. `_Sidebar.md` and `_Footer.md` supply shared navigation, following
[GitHub's sidebar and footer conventions](https://docs.github.com/en/communities/documenting-your-project-with-wikis/creating-a-footer-or-sidebar-for-your-wiki).
No website framework or GitHub Pages build is required for this native Wiki.

## 1. Validate and export

From the main repository root:

```sh
npm run docs:check
npm run docs:wiki
```

The export command reads the GitHub repository from `origin`, uses `main` for source-code links, and writes `.runtime/wiki`.
For a fork, another source branch, or a repository without an origin remote:

```sh
npm run docs:wiki -- --repository OWNER/REPO --ref main
```

`--repository` also accepts a credential-free `https://github.com/OWNER/REPO` URL.
`--ref` is the source branch or commit that readers should browse, not the Wiki branch.
Push the referenced source and assets to that branch before publishing links to them.

The exporter:

- Converts documentation links into native Wiki page URLs, including links to package and extension guides.
- Converts code links into main-repository `blob` / `tree` URLs at the selected ref.
- Copies referenced project media into the export and points embedded images at their Wiki asset URLs.
- Preserves fenced examples and validates local targets, heading anchors, English defaults, and public configuration examples.
- Replaces only an output directory carrying its own export marker. It never commits, pushes, or modifies source documents.

The default output is `.runtime/wiki`. A custom output must be a dedicated directory directly under `.runtime`.
The hidden `.gbh-wiki-export.json` records exported pages and assets; it is build metadata, not a Wiki page.

## 2. Copy into a Wiki checkout

After creating the first Wiki page on GitHub, replace `OWNER/REPO` and clone:

```sh
git clone https://github.com/OWNER/REPO.wiki.git .runtime/wiki-checkout
cp .runtime/wiki/*.md .runtime/wiki-checkout/
cp -R .runtime/wiki/assets .runtime/wiki-checkout/
```

On subsequent updates, update the Wiki checkout before copying:

```sh
git -C .runtime/wiki-checkout pull --ff-only
```

Keep the source of truth in this main repository. Copying overwrites matching Wiki files; coordinate with collaborators
before replacing direct edits made through GitHub. The export inventory helps identify obsolete managed pages,
but copying does not delete unrelated Wiki pages automatically.

## 3. Review and publish

```sh
git -C .runtime/wiki-checkout status --short
git -C .runtime/wiki-checkout diff --check
git -C .runtime/wiki-checkout diff
# After reviewing the content:
git -C .runtime/wiki-checkout add -- '*.md' assets
git -C .runtime/wiki-checkout commit -m "docs: publish project wiki"
git -C .runtime/wiki-checkout push
```

Use the Wiki checkout's default branch. The push publishes to `https://github.com/OWNER/REPO/wiki` and requires write access.
Use your configured Git credentials; do not put tokens in documentation or remote URLs.

## Maintain navigation and translations

Add user/developer pages under `docs/wiki`, then update Home and the sidebar.
Directory README guides are exported automatically with stable, unique Wiki names.
AGENTS.md files remain source maintenance instructions rather than Wiki pages.
Language-suffixed translations remain separate source documents and are not mixed into the English Wiki export.

Run `npm run docs:check` after editing. Changes to export behavior also require
`python3 -m unittest discover -s tools -p 'test_wiki.py'`.
An export prepares publishable files; it does not establish that the remote Wiki is live.

---
[Documentation](Home.md) · [Development](Development.md) · [Project](../../README.md)

# Documentation maintenance

The project README is a concise product entry point: purpose, real demonstration,
quickstart and links. Keep configuration definitions in wiki/Configuration.md,
installation in wiki/Build-Guide.md, architecture in wiki/Architecture.md and
verification evidence in wiki/Verification.md. Do not turn the landing page into
a migration log or duplicate full guides across pages.

Directory README files explain responsibilities, entry points and neighboring
modules. Validate package and Host extension coverage against source. Keep Wiki
navigation, relative file links and heading anchors valid.

Examples use reserved example domains, model placeholders and generic paths.
Never include personal directories, private LAN endpoints, credentials or user
sessions. Project-default loopback ports and Compose service names are appropriate
in operational references. Do not modify real .env files to sanitize examples.

Separate implemented behavior from verified support. Media must show the real
app; label time compression and fixture inference when used. Preserve third-party
license notices and resource provenance.


English is canonical for authored project documentation. Keep translations in
separate language-suffixed files such as README.zh.md and link the language
variants explicitly. Do not translate or rewrite upstream licensing material.

The source Wiki lives in docs/wiki. Export with npm run docs:wiki; the exporter
maps authored module guides into Wiki pages, rewrites source links, and includes
referenced project media. Preserve Home.md, _Sidebar.md, and _Footer.md. Run
npm run docs:check and tools/test_wiki.py after navigation/export changes. An
export is not a publication; do not claim the remote Wiki is live without a push.

The Pages site uses the same authored Markdown and the component READMEs linked
from it. Keep generated staging and output under ignored `.runtime/docs-site/`;
the site generator copies only Markdown and explicitly linked public media. Do
not add symlink trees or runtime/private files to the site inputs. See
[Publishing](wiki/Publishing.md) for the build, preview, artifact checks, and
publication flow. Site PRs validate with read-only credentials; only a
validated `main` push or manual `main` run publishes to Pages. Check rendered
anchors, media, details blocks, and Mermaid in the local browser preview before
claiming they work.

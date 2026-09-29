# Starter marketplace and Bot recipes

GBH includes a small, pinned starter catalog for reusable Skills and an HTTP MCP integration. It also includes GBH-curated Bot recipes and accepts user-provided recipe JSON. Each starter shows its source revision, terms, components, setup requirements, and current installation state before you add it.

> **Release availability:** `gbh-preview-v0.1.0-preview.1` was built before the marketplace change and does not include this UI. This guide describes the feature in the repository source. Check [GitHub Releases](https://github.com/river-li/brok-pot-harness/releases) for a later build before expecting it in a downloaded app.

## Where it runs

Marketplace discovery, imports, plugin settings, and credentials are owned by the Host. A separate desktop client does not need a source checkout, Git, Docker, or its own provider-key environment. You can enter a Firecrawl key in the connected desktop's setup form; the Host persists and uses that value, and it is not saved in a separate client profile. The Host fetches selected public source files and stores imported content and secret values in its own data directory. The Host needs outbound access to GitHub when installing a pinned starter and to the configured MCP endpoint when using Firecrawl.

Open **Settings → Plugins** in the desktop connected to the Host. The catalog entries are GBH-curated imports from the pinned sources below; they are not a mirror of another marketplace.

## Extend a deployed Host without rebuilding clients

User-imported Bot recipes are runtime data, not entries compiled into the Android
or desktop client. The authenticated `previewLocalBotRecipe`,
`importLocalBotRecipe`, `updateLocalBotRecipe`, and `removeLocalBotRecipe` Gateway
operations validate and maintain the Host catalog. The desktop **Manage pots**
flow uses these operations. Android reads `listBotTemplates` when Marketplace is
opened or refreshed, so newly imported recipes appear without a new APK.

A recipe can carry profile instructions, memories, private Skills, paused
routines, and references to Host-installed plugins. Updating a recipe increments
its version for future imports; it does not rewrite already-created Bots. Keep
the recipe JSON as a private deployment artifact and preserve the Host data
volume across upgrades. Do not add personal recipes or account credentials to
this repository's public starter sources.

Operator-imported local plugin bundles are also discovered at runtime. Use the
[local plugin importer](Extensions.md#import-a-local-plugin) against the data root
of the intended Host, then install the discovered entry through Plugins. For a
server whose state directory differs from the source checkout, do not accidentally
import into the checkout's unused `.runtime/data`: use the retained
`importLocalPlugin(dataRoot, sourceDirectory, name)` adapter with the deployed
Host's actual data root. Imported files and references must remain inside that
Host's persistent storage. Plugin installation and updates affect Bots sharing
that Host; credentials are configured separately.

The **remote pinned starter-source list** is still maintained in server source.
Adding an arbitrary GitHub URL is not a supported dynamic registry operation.
A new pinned starter source requires a server update; a user recipe or a local
plugin bundle does not require a client rebuild or a Host restart. Preserve
provenance and pin imported upstream revisions rather than silently following
`main`.

## Included starter sources

| Starter | What GBH imports | Pinned source and terms |
| --- | --- | --- |
| **Chrome Extension Builder** | The `chrome-extensions` Skill, its 23 bundled reference files, and the repository license notice. It provides extension development guidance; it does not install a build toolchain. | [GoogleChrome/modern-web-guidance, revision `22ab18dfb50a5d7e3bdcf471c14076a5534eae4e`](https://github.com/GoogleChrome/modern-web-guidance/tree/22ab18dfb50a5d7e3bdcf471c14076a5534eae4e/skills/chrome-extensions). The pinned repository [LICENSE](https://github.com/GoogleChrome/modern-web-guidance/blob/22ab18dfb50a5d7e3bdcf471c14076a5534eae4e/LICENSE) declares Apache-2.0. |
| **Firecrawl Web Research** | Eleven Firecrawl Skills and one `firecrawl` HTTP MCP connection. GBH uses an explicit bearer API key; the endpoint can be overridden with a compatible HTTP MCP URL. | [firecrawl/firecrawl-grok-plugin, revision `7100b62d09a40673fe1688175431b1baff7ed262`](https://github.com/firecrawl/firecrawl-grok-plugin/tree/7100b62d09a40673fe1688175431b1baff7ed262). The pinned [README](https://github.com/firecrawl/firecrawl-grok-plugin/blob/7100b62d09a40673fe1688175431b1baff7ed262/README.md) and [plugin manifest](https://github.com/firecrawl/firecrawl-grok-plugin/blob/7100b62d09a40673fe1688175431b1baff7ed262/.grok-plugin/plugin.json) declare AGPL-3.0; there is no repository-root `LICENSE` file at that pinned revision. |

These are independent GBH-curated entries. The [Grok Build plugin marketplace](https://github.com/xai-org/plugin-marketplace) is a different product format, not a Grok Bot recipe export. GBH does not claim to import xAI Bot marketplace listings or export templates from them.

Remote pinned imports are limited to the starters listed here; GBH does not accept an arbitrary plugin repository URL or import the Grok Build marketplace index as a general plugin catalog. The existing [manual local plugin-directory import](Extensions.md#import-a-local-plugin) remains available for bundles in GBH's retained plugin, Skill, and MCP formats.

The Chrome import contains 25 pinned files: one Skill, 23 reference files, and `LICENSE`. A private Host/Box runtime review verified that a recipe Bot read the public Skill and the nested `references/extensions/api-calling.md` file. See [Verification](Verification.md).

## Add and configure a starter

1. In **Settings → Plugins**, open a starter card and expand **Source, setup, and status**. Check the source URL and pinned revision, terms and license evidence, included components, omitted commands or routines, dependencies, and the Installation, Configuration, Enabled, and Connection rows.
2. Select **Add**. The Firecrawl form asks for a Firecrawl API key and allows an optional endpoint override. The Chrome starter has no credential requirement.
3. Save the form using its starter-specific Add action. Reopen **Source, setup, and status** to check the installed and configuration states. For an HTTP MCP starter, also check Connection; a saved key is not by itself proof that the remote service connected.

The Firecrawl starter uses `https://mcp.firecrawl.dev/v2/mcp` by default and sends the key as `Authorization: Bearer …`. Firecrawl's current [MCP setup guide](https://docs.firecrawl.dev/mcp-server/keyless) documents this endpoint and bearer-key format. GBH's curated entry requires an API key; it does not use Firecrawl's OAuth or keyless options. OAuth notes in the upstream bundle are retained as source provenance, not as an active connection. The endpoint override is optional and must point to a compatible HTTP MCP service.

Enter a real key only in the Host-owned **Firecrawl API key** field. The field is secret and its saved value is not returned in catalog details; no separate client environment variable or profile copy is required. To replace a saved key or endpoint, use **Edit Values** on the installed plugin. Firecrawl tools and usage are subject to the service's current plan and limits.

## Sources, revisions, and lifecycle

The Host downloads only the selected starter's pinned paths when you add it. It records the source URL, exact revision, terms, and content digests with the installation. GBH does not run installer hooks from marketplace content.

Plugin installs and connector credentials live in the Host's shared Plugins settings. A Bot recipe can refer to an installed plugin as a dependency; it does not make a separate credential or per-Bot copy. The detail page reports installed revision separately from an available revision when the curated pin changes.

An update keeps local edits to paths whose upstream contents have not changed. If the same file was edited locally and changed at the new source revision, GBH reports the conflicting path and stops the update so you can resolve it. The detail page lists detected local edits.

Uninstalling a marketplace plugin removes its installed Skills and MCP configuration from the Host's plugin settings. Existing Bot profiles and workspace files remain; Bots that depend on the removed plugin need it installed and configured again before they can use those capabilities. If an uninstalled starter's snapshot was edited locally, adding the same pinned starter again saves that old snapshot under its plugin directory in a `.uninstalled-edits-*` recovery folder and installs fresh pinned content. This preserves the old edits without presenting them as part of the clean reinstallation.

Firecrawl's pinned source contains an original `skill-gen` command template. GBH retains it as archived source material; it is unsupported as a runnable command and is not executed. The starter also does not install the upstream Firecrawl CLI fallback. No routines are included in either pinned starter. See [Extensions](Extensions.md) for the existing manual plugin-directory import flow, which remains supported.

## Bot recipes

GBH ships two locally curated recipes:

| Recipe | Profile | Dependency and setup |
| --- | --- | --- |
| **Chrome Extension Builder** | A Bot focused on building, debugging, and reviewing Chrome extensions. | Install **Chrome Extension Builder** so the pinned Skill and references are included in the Bot workflow. A private runtime turn verified access to `references/extensions/api-calling.md`. |
| **Web Research Assistant** | A Bot for sourced research using Firecrawl search, scraping, and crawl capabilities. | Install **Firecrawl Web Research** and configure its API key on the Host before relying on its MCP tools. |

These recipes are GBH-authored templates mapped to the pinned plugins above. They are not downloaded xAI Bot marketplace listings. A recipe can create a Bot profile and its memory, Skills, routines, and plugin dependencies, and can retain optional `gettingStarted` Skill metadata. Creating a recipe-based Bot does not provide missing plugins or credentials; resolve each dependency in **Settings → Plugins**. Imported routines remain inactive until you intentionally enable them.

### Create a pot from a recipe

1. Open **Marketplace → Pots**. Search the catalog or select a card under **Featured pots** or **Your pots**. The detail page shows instructions and the recipe's available Memories, Skills, Routines, and Integrations sections; select a Skill to read its content.
2. Check the integration requirements. Use a plugin row on the overview to open its detail, or **View all** to browse Plugins. Install and configure required plugins before relying on their capabilities.
3. Select **Import pot** on the recipe detail page. Brokpot creates the pot and applies the recipe through the existing setup flow. Imported routines remain inactive until you enable them intentionally. Importing a pot does not install missing plugins or supply credentials.

### Import or edit a local recipe

Open **Marketplace → Pots → Manage pots → Import recipe JSON**. Choose a `.json` file with **Choose recipe JSON** or paste its contents into **Recipe JSON**. Select **Preview JSON** and check the profile name, included Skills and routines, Plugin dependencies, and setup requirements. Correct any validation errors, preview again, and select **Import recipe** to add it to the local catalog. **Refresh** reloads the Host's recipe list. Close the manager to browse the imported card under **Your pots**.

For a user-imported recipe, select **Edit JSON**, change the JSON, then select **Preview JSON** and **Save recipe**. **Remove** asks you to confirm with **Confirm removal**; removal deletes the reusable recipe only, and existing Bots keep their profiles. GBH's two built-in recipes cannot be edited or removed from this screen. Importing the same recipe content again is idempotent and reuses the existing local recipe.

### User-provided recipe JSON

The local recipe importer accepts a JSON object with these fields:

| Field | Supported content |
| --- | --- |
| `profile` | Required `name` and `description`; optional string `avatarShape` and `avatarColor`. |
| `memory` | Required array of `{ "content": "…" }` records; it can be empty. Each record may have string `kind` and `createdAt`. |
| `skills` | Required array of `{ "name": "…", "description": "…", "content": "…" }`; it can be empty. |
| `routines` | Required array of `{ "name": "…", "slug": "…", "description": "…", "content": "…" }`; it can be empty. Imported routines are inactive. |
| `plugins` | Required array of `{ "name": "…", "pluginId": "…" }` records, with optional string `description`; it can be empty. Use a `pluginId` returned by the Host's Plugins catalog; unresolved IDs remain dependencies to set up. |
| `gettingStarted` | Optional `{ "skill": "…" }`; the value must match a Skill's `name` in the recipe. |

The format is intentionally strict. Only these top-level and per-field properties are accepted; unsupported fields produce a validation error instead of being silently discarded. JSON over 2 MiB is rejected. Recipe preview reports the name, Skills, routines, plugin dependencies, and setup requirements before import.

`gettingStarted.skill` must name one of the recipe's Skills. The importer stores this value, but the current local Bot creation flow does not automatically run that Skill or its prompt. Treat it as recipe metadata and ask the Bot to start the Skill when you want to use it.

This example uses the Host's stable local plugin ID for the curated Chrome starter. Replace it with the `pluginId` returned by the Host's plugin catalog when referencing another local plugin.

```json
{
  "profile": {
    "name": "Extension Review Helper",
    "description": "Build and review Chrome extensions with least-privilege permissions."
  },
  "memory": [
    {
      "kind": "profile",
      "createdAt": "2026-09-24T00:00:00Z",
      "content": "Ask which Chrome version to target when it is not specified."
    }
  ],
  "skills": [
    {
      "name": "Extension Review",
      "description": "Review an extension change for correctness and permission scope.",
      "content": "Read the relevant project files. Check that manifest permissions match the requested behavior. Explain any permission expansion before proposing it."
    }
  ],
  "routines": [
    {
      "name": "Review extension permissions",
      "slug": "review-extension-permissions",
      "description": "Check manifest permissions and explain their effects.",
      "content": "Review the extension manifest permissions, connect each permission to a requested feature, and identify permissions that appear broader than needed. Do not change files."
    }
  ],
  "plugins": [
    {
      "name": "Chrome Extension Builder",
      "description": "Pinned Chrome Extensions Skill and references.",
      "pluginId": "328858011860280"
    }
  ],
  "gettingStarted": {
    "skill": "Extension Review"
  }
}
```

Recipe import is idempotent: importing equivalent JSON again returns the existing local recipe instead of creating a duplicate. Updating a user-imported recipe changes the reusable template; it does not rewrite Bot profiles that were already created from it. Removing a user-imported recipe removes that template and leaves existing Bots in place. The two built-in GBH recipes are maintained with GBH and cannot be edited or removed through user recipe management.

## What has been verified

Private Host/Box runtime evidence verified starter discovery, pinned public-source imports, Chrome Skill installation through the Gateway, local recipe Bot creation and setup metadata, and Skill synchronization into the Bot workflow. A deterministic fixture-model turn read both the Chrome Skill and nested `references/extensions/api-calling.md`. A second fixture-model turn connected the Firecrawl recipe through its configured endpoint and bearer key to an HTTP MCP fixture, discovered and called its tool, passed the retained auto-review, and completed. The review made no external model or Firecrawl service calls; it validates the integration against the configured fixture only. An isolated desktop run also verified overview/detail navigation, recipe JSON import and editing, pot creation with the actual Skill persisted, recipe removal without deleting that pot's Skill, and plugin installation, tool toggles, restart persistence and uninstall. See [Verification](Verification.md) for evidence and limits.

---
[Documentation](Home.md) · [MCP, plugins, and Skills](Extensions.md) · [Project](../../README.md)

## Additional public Skill sources

The catalog also includes fixed revisions of OpenAI's GitHub CI Repair Skill
(`openai/skills@49f948faa9258a0c61caceaf225e179651397431`) and Anthropic's Web App
Testing and Frontend Design Skills
(`anthropics/skills@33375500bcea98d610eb30ce10ac4e59b89c390d`). Each imports only its
Skill directory, including helpers and its Apache-2.0 license. OpenAI's curated
subdirectory is mapped into the plugin's discoverable Skills directory. Imports
validate Git blob hashes and retain provenance; they do not run installation hooks
or install Python, Playwright, GitHub CLI, browser binaries, or credentials.

Android Bot details show Bot-owned Skills and shared installed plugin Skills,
plugins, MCP connection status and discovered tool names. Explicit connector setup
uses `addLocalMcpConnector`, gated by `localMcpConnectorsV1` in local mode. It accepts
an HTTPS MCP endpoint and an optional bearer token stored through the retained
MCP manager. This adds a shared server connection; it is not a per-Bot access
control boundary. OAuth-only services still need a provider authorization adapter.
Vendor-hosted OpenAI, Claude and Grok connectors and account tokens are not imported.

## External catalogs

For provider-hosted endpoints, authentication requirements, and the distinction
between an official service and a community listing, see the research-only
[Official MCP connection inventory](Official-MCP-Catalog.md). Inclusion in that
inventory does not mean a connector is installed or verified with this Host.

Hosts advertising `externalMarketplaceV1` expose public source browsing separately
from the curated starter catalog. Android 0.4.0 adds **Explore public sources**
with source selection, search, pagination, details, configuration and explicit
installation/update. Existing clients keep their original catalog and installation
methods. New upstream entries appear on the next uncached browse without an app
release. Metadata is cached for five minutes; upstream rate limits back off rather
than retrying aggressively. Catalog refresh never updates an installed extension.

Default sources are the official MCP Registry, ClawHub, GitHub Popular Skills,
OpenAI's Skills repository and Anthropic's Skills repository. The Host adapts upstream metadata into one
entry shape. It does not host or endorse those marketplaces. Source links identify
the publisher, and installation rechecks the selected version. ClawHub identities
include both publisher and slug; imports respect upstream moderation and validate
version file hashes. GitHub imports pin the resolved commit, validate Git blob
hashes, retain directory resources/executable modes and root license files, and
reject symlinks/submodules. Installation does not execute repository hooks.

Operators can replace the default source list without rebuilding by creating
`SAND_DATA_ROOT/marketplace-sources.json`:

```json
{
  "sources": [
    {"id":"mcp","title":"MCP Registry","kind":"mcp-registry","url":"https://registry.modelcontextprotocol.io/v0.1"},
    {"id":"clawhub","title":"ClawHub","kind":"clawhub","url":"https://clawhub.ai/api/v1"},
    {"id":"github-popular","title":"GitHub Popular Skills","kind":"github-topic","url":"https://github.com/topics/agent-skills"},
    {"id":"team","title":"Team Skills","kind":"github-skills","url":"https://github.com/OWNER/REPOSITORY","ref":"main"}
  ]
}
```

`enabled:false` hides a source. IDs must be unique, and changing a source's ID or
URL creates a different installation identity. Removing a source does not remove
already installed extensions. Custom registry endpoints must be public HTTPS;
metadata/file requests reject private destinations at socket DNS lookup, embedded
credentials and redirects. Private registries are not implemented.
To add a public Skills repository, add one source
record; its `SKILL.md` directories are discovered automatically.

**GitHub Popular Skills** searches public, non-fork, non-archived repositories
tagged with the [agent-skills topic](https://github.com/topics/agent-skills), sorted
by repository stars descending. Blank search browses popular repositories;
keywords search repository names, descriptions, and READMEs, not the full text of
every Skill. Up to 20 keywords are used; advanced GitHub query qualifiers are not accepted as operators.
Cards identify the owner/repository and repository star count; topic membership
and popularity do not mean official verification or a security review.

Each page inspects one repository and returns up to 30 actual `SKILL.md`
directories, including root-level Skills. **Load more** continues the same
repository before moving to the next ranked repository. A topic repository with
no Skills (or a tree exceeding listing limits) produces an empty page with a continuation when more repositories
exist. GitHub's first 1,000 search results are accessible; narrow the keywords for
additional results. This bounded approach avoids downloading every discovered
repository. Metadata is cached for five minutes, and GitHub 403/429 responses
trigger backoff. No GitHub token is required, so public API limits apply.

Topic entries use owner/repository/path identities. Before import the Host
rechecks topic eligibility and resolves the current default branch; a changed
commit requires reopening details. Root Skills import the repository snapshot
subject to the existing file/size limits. Nested Skills import their directory
and root license files. No third-party installer is executed. Existing Android
0.4.0 source/search/detail controls can display this Host-provided source without
a new RPC shape; deployment of the updated Host is still required. Hosts with a
custom source list must explicitly add the `github-topic` record above.

MCP Registry entries with concrete public HTTPS Streamable HTTP or SSE endpoints
can be installed through the retained plugin manager. Header metadata becomes
configuration fields; secrets are not returned by the catalog or persisted on
Android. Supply complete header values, including `Bearer` where needed. Package
only entries and endpoints requiring URL template substitution explain why they
cannot be installed automatically. Installing an endpoint is distinct from a
successful authenticated connection; inspect connection/tool status in Bot details.

**Current boundaries:** generic local OAuth/account-slot management and per-Bot
extension assignment remain unimplemented. Vendor OAuth is not reused. Installed
extensions and credentials are server-wide, explicitly labeled in the client;
OAuth-only providers need administrator setup. ClawHub entries without an exposed
version file manifest cannot yet be imported through GitHub handoff descriptors.
Codex/Claude Code worker execution adapters are not supplied by this catalog layer.

External installs reuse immutable local plugin snapshots and the existing
install/configure/uninstall lifecycle. The snapshot includes `.brokpot-source.json`
with upstream identity, version and file hashes. Updates are explicit and refuse
to replace a locally edited snapshot. Lost install replies can be retried without
replacing an existing configuration. Uninstall remains in **Marketplace → Plugins**.

# Starter marketplace and Bot recipes

GBH includes a small, pinned starter catalog for reusable Skills and an HTTP MCP integration. It also includes GBH-curated Bot recipes and accepts user-provided recipe JSON. Each starter shows its source revision, terms, components, setup requirements, and current installation state before you add it.

> **Release availability:** `gbh-preview-v0.1.0-preview.1` was built before the marketplace change and does not include this UI. This guide describes the feature in the repository source. Check [GitHub Releases](https://github.com/river-li/brok-pot-harness/releases) for a later build before expecting it in a downloaded app.

## Where it runs

Marketplace discovery, imports, plugin settings, and credentials are owned by the Host. A separate desktop client does not need a source checkout, Git, Docker, or its own provider-key environment. You can enter a Firecrawl key in the connected desktop's setup form; the Host persists and uses that value, and it is not saved in a separate client profile. The Host fetches selected public source files and stores imported content and secret values in its own data directory. The Host needs outbound access to GitHub when installing a pinned starter and to the configured MCP endpoint when using Firecrawl.

Open **Settings → Plugins** in the desktop connected to the Host. The catalog entries are GBH-curated imports from the pinned sources below; they are not a mirror of another marketplace.

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

Uninstalling a marketplace plugin removes its installed Skills and MCP configuration from the Host's plugin settings. Existing Bot profiles and workspace files remain; Bots that depend on the removed plugin need it installed and configured again before they can use those capabilities.

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

/** Pinned public starter sources fetched by the local server on explicit import. */
import { createHash } from "node:crypto";
import { chmodSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, join, relative, resolve, sep } from "node:path";

export type MarketplaceSource = {
  entryId: string;
  slug: string;
  owner: string;
  repository: string;
  revision: string;
  sourceUrl: string;
  terms: string;
  licenseEvidence: string;
  kind: "skill" | "mcp";
  displayName: string;
  description: string;
  supportedSkills: Array<{ name: string; description: string }>;
  omittedComponents: Array<{ kind: string; name: string; reason: string }>;
  dependencies: string[];
};

export type MarketplaceProvenance = {
  entryId: string;
  sourceUrl: string;
  revision: string;
  terms: string;
  licenseEvidence: string;
  upstreamDigest: string;
  upstreamFiles: Record<string, string>;
  installedSourceFiles: Record<string, string>;
};

export const MARKETPLACE_SOURCES: MarketplaceSource[] = [
  {
    entryId: "gbh.chrome-extensions",
    slug: "gbh-chrome-extensions",
    owner: "GoogleChrome",
    repository: "modern-web-guidance",
    revision: "22ab18dfb50a5d7e3bdcf471c14076a5534eae4e",
    sourceUrl:
      "https://github.com/GoogleChrome/modern-web-guidance/tree/22ab18dfb50a5d7e3bdcf471c14076a5534eae4e/skills/chrome-extensions",
    terms: "Apache-2.0",
    licenseEvidence: "Pinned repository LICENSE declares Apache-2.0.",
    kind: "skill",
    displayName: "Chrome Extension Builder",
    description:
      "A practical Chrome extension development Skill with its pinned reference files. It does not install or run build tools.",
    supportedSkills: [
      {
        name: "chrome-extensions",
        description: "Build, debug and review Chrome extensions.",
      },
    ],
    omittedComponents: [],
    dependencies: [],
  },
  {
    entryId: "gbh.firecrawl-web-research",
    slug: "gbh-firecrawl-web-research",
    owner: "firecrawl",
    repository: "firecrawl-grok-plugin",
    revision: "7100b62d09a40673fe1688175431b1baff7ed262",
    sourceUrl:
      "https://github.com/firecrawl/firecrawl-grok-plugin/tree/7100b62d09a40673fe1688175431b1baff7ed262",
    terms: "AGPL-3.0",
    licenseEvidence:
      "The pinned README and .grok-plugin/plugin.json declare AGPL-3.0; no LICENSE file is present at that revision.",
    kind: "mcp",
    displayName: "Firecrawl Web Research",
    description:
      "All 11 pinned Firecrawl Skills with an explicit bearer-key MCP connection. Upstream OAuth notes are retained as provenance but are not used as a connection state.",
    supportedSkills: (
      [
        ["firecrawl-agent", "Run multi-step web research tasks."],
        ["firecrawl-cli", "Use Firecrawl services from its CLI."],
        ["firecrawl-crawl", "Crawl a site with a controlled depth and page limit."],
        ["firecrawl-developer-search", "Search indexed developer documentation and code discussions."],
        ["firecrawl-download", "Download site content for a local task."],
        ["firecrawl-interact", "Interact with pages that require browser actions."],
        ["firecrawl-map", "Map links and pages on a site."],
        ["firecrawl-monitor", "Create and manage site change monitors."],
        ["firecrawl-parse", "Parse structured information from pages."],
        ["firecrawl-scrape", "Extract clean content from supplied URLs."],
        ["firecrawl-search", "Search the web and return full-page content."],
      ] as const
    ).map(([name, description]) => ({ name, description })),
    omittedComponents: [
      {
        kind: "command",
        name: "skill-gen",
        reason:
          "GBH does not execute imported command templates. The original file is retained in the imported source archive.",
      },
      {
        kind: "routine",
        name: "none",
        reason: "The pinned source contains no routines.",
      },
    ],
    dependencies: [
      "Firecrawl API key for hosted MCP; stored only in the server profile.",
      "Upstream CLI fallback (`npx firecrawl`) is not installed by GBH and requires Node/npm/network access.",
    ],
  },
];

export type StagedMarketplaceSource = {
  provenance: MarketplaceProvenance;
  source: MarketplaceSource;
  files: Record<string, string>;
};

type TreeBlob = { path: string; type: string; mode?: string; sha: string; size?: number };
type FetchLike = typeof fetch;
const MAX_TREE_FILES = 4000;
const MAX_FILE_BYTES = 2 * 1024 * 1024;
const MAX_BUNDLE_BYTES = 12 * 1024 * 1024;
const MAX_TREE_BYTES = 4 * 1024 * 1024;

function sourceById(entryId: string) {
  const source = MARKETPLACE_SOURCES.find((item) => item.entryId === entryId);
  if (!source) throw Error("This curated marketplace entry is unavailable.");
  return source;
}

function installedPath(source: MarketplaceSource, path: string) {
  if (source.kind !== "mcp") return path;
  if (path === ".mcp.json") return ".marketplace-source/firecrawl.mcp.json";
  if (path === "commands/skill-gen.md")
    return ".marketplace-source/commands/skill-gen.md";
  return path;
}

function selectedPath(source: MarketplaceSource, path: string) {
  if (source.kind === "skill")
    return path === "LICENSE" || path.startsWith("skills/chrome-extensions/");
  return (
    path === ".mcp.json" ||
    path === ".grok-plugin/plugin.json" ||
    path === "README.md" ||
    path === "commands/skill-gen.md" ||
    (/^skills\/[^/]+\/SKILL\.md$/.test(path))
  );
}

function safeDestination(root: string, path: string) {
  if (
    path.length === 0 ||
    path.split("/").some((part) => part === "" || part === "." || part === "..") ||
    path.startsWith("/") ||
    path.includes("\\")
  )
    throw Error("Pinned source contains an unsafe path.");
  const destination = resolve(root, path);
  const part = relative(root, destination);
  if (part === ".." || part.startsWith(".." + sep) || part.includes(sep + ".." + sep))
    throw Error("Pinned source contains an unsafe path.");
  return destination;
}

async function responseBytes(response: Response, maximum: number) {
  if (!response.ok) throw Error(`Pinned source request failed (${response.status}).`);
  const declared = Number(response.headers.get("content-length"));
  if (Number.isFinite(declared) && declared > maximum)
    throw Error("Pinned source file exceeds the size limit.");
  if (!response.body) throw Error("Pinned source response has no body.");
  const reader = response.body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;
  try {
    while (true) {
      const next = await reader.read();
      if (next.done) break;
      total += next.value.byteLength;
      if (total > maximum) {
        await reader.cancel();
        throw Error("Pinned source file exceeds the size limit.");
      }
      chunks.push(next.value);
    }
  } catch (error) {
    await reader.cancel().catch(() => {});
    throw error;
  }
  const data = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    data.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return data;
}

async function sourceFiles(source: MarketplaceSource, fetcher: FetchLike) {
  const api = `https://api.github.com/repos/${source.owner}/${source.repository}/git/trees/${source.revision}?recursive=1`;
  const response = await fetcher(api, {
    headers: { accept: "application/vnd.github+json", "user-agent": "GBH-local-marketplace" },
    redirect: "error",
    signal: AbortSignal.timeout(20000),
  });
  if (!response.ok) throw Error(`Pinned source tree request failed (${response.status}).`);
  const treeBytes = await responseBytes(response, MAX_TREE_BYTES);
  const tree = JSON.parse(new TextDecoder().decode(treeBytes)) as {
    truncated?: boolean;
    tree?: TreeBlob[];
  };
  if (tree.truncated || !Array.isArray(tree.tree) || tree.tree.length > MAX_TREE_FILES)
    throw Error("Pinned source tree is incomplete or exceeds the file-count limit.");
  const candidates = tree.tree.filter((item) => selectedPath(source, item.path));
  const invalid = candidates.find(
    (item) =>
      item.type === "commit" ||
      item.mode === "120000" ||
      item.mode === "160000" ||
      (item.type === "blob" && item.mode !== "100644" && item.mode !== "100755"),
  );
  if (invalid)
    throw Error(`Pinned source path is a symlink or submodule: ${invalid.path}.`);
  const selected = candidates
    .filter((item) => item.type === "blob")
    .sort((a, b) => a.path.localeCompare(b.path));
  if (!selected.some((item) => item.path.endsWith("/SKILL.md")))
    throw Error("Pinned source did not contain the expected Skill file.");
  let total = 0;
  const files: Record<string, Uint8Array> = {};
  const modes: Record<string, number> = {};
  for (const item of selected) {
    if (item.size !== undefined && item.size > MAX_FILE_BYTES)
      throw Error(`Pinned source file ${item.path} exceeds the size limit.`);
    const url = `https://raw.githubusercontent.com/${source.owner}/${source.repository}/${source.revision}/${item.path}`;
    const body = await responseBytes(
      await fetcher(url, {
        redirect: "error",
        signal: AbortSignal.timeout(20000),
      }),
      MAX_FILE_BYTES,
    );
    const blobHash = createHash("sha1")
      .update(`blob ${body.byteLength}\0`)
      .update(body)
      .digest("hex");
    if (blobHash !== item.sha) throw Error(`Pinned source hash mismatch for ${item.path}.`);
    total += body.byteLength;
    if (total > MAX_BUNDLE_BYTES) throw Error("Pinned source bundle exceeds the size limit.");
    files[item.path] = body;
    modes[item.path] = item.mode === "100755" ? 0o755 : 0o644;
  }
  return { files, modes };
}

function pluginManifest(source: MarketplaceSource) {
  const manifest: Record<string, unknown> = {
    name: source.slug,
    displayName: source.displayName,
    description: source.description,
    version: source.revision,
    repository: `https://github.com/${source.owner}/${source.repository}`,
    homepage: source.sourceUrl,
    license: source.terms,
    skills: "skills",
  };
  if (source.kind === "mcp") {
    manifest.variables = {
      type: "object",
      properties: {
        FIRECRAWL_MCP_URL: {
          type: "string",
          title: "Firecrawl MCP endpoint",
          description: "Optional endpoint override, stored on the server.",
          default: "https://mcp.firecrawl.dev/v2/mcp",
        },
        FIRECRAWL_API_KEY: {
          type: "string",
          title: "Firecrawl API key",
          description: "A Firecrawl API key used by the server-side MCP connection.",
          format: "password",
          writeOnly: true,
          minLength: 1,
        },
      },
      required: ["FIRECRAWL_API_KEY"],
      additionalProperties: false,
    };
  }
  return JSON.stringify(manifest, null, 2) + "\n";
}

/** Fetch only the pinned starter paths; no install hooks or unpinned git refs run. */
export async function stageMarketplaceSource(
  entryId: string,
  destinationRoot: string,
  fetcher: FetchLike = fetch,
): Promise<StagedMarketplaceSource> {
  const source = sourceById(entryId);
  mkdirSync(destinationRoot, { recursive: true, mode: 0o700 });
  const upstream = await sourceFiles(source, fetcher);
  const upstreamFiles: Record<string, string> = {};
  const installedSourceFiles: Record<string, string> = {};
  const sourceDigest = createHash("sha256");
  for (const [path, bytes] of Object.entries(upstream.files).sort(([a], [b]) => a.localeCompare(b))) {
    const digest = createHash("sha256").update(bytes).digest("hex");
    const mode = upstream.modes[path];
    const sourceState = `${digest}:${mode}`;
    const target = installedPath(source, path);
    const output = safeDestination(destinationRoot, target);
    mkdirSync(dirname(output), { recursive: true, mode: 0o700 });
    writeFileSync(output, bytes, { flag: "wx", mode });
    chmodSync(output, mode);
    upstreamFiles[path] = sourceState;
    installedSourceFiles[target] = sourceState;
    sourceDigest.update(path + "\0" + sourceState + "\0");
  }
  const manifestPath = safeDestination(destinationRoot, ".cursor-plugin/plugin.json");
  mkdirSync(dirname(manifestPath), { recursive: true, mode: 0o700 });
  const manifest = pluginManifest(source);
  writeFileSync(manifestPath, manifest, { flag: "wx", mode: 0o644 });
  installedSourceFiles[".cursor-plugin/plugin.json"] = createHash("sha256")
    .update(source.revision + "\0" + manifest)
    .digest("hex");
  if (source.kind === "mcp") {
    const mcpPath = safeDestination(destinationRoot, ".mcp.json");
    const mcpConfig =
      JSON.stringify(
        {
          mcpServers: {
            firecrawl: {
              type: "http",
              url: "${FIRECRAWL_MCP_URL:-https://mcp.firecrawl.dev/v2/mcp}",
              headers: { Authorization: "Bearer ${FIRECRAWL_API_KEY}" },
            },
          },
        },
        null,
        2,
      ) + "\n";
    writeFileSync(
      mcpPath,
      mcpConfig,
      { flag: "wx", mode: 0o600 },
    );
    installedSourceFiles[".mcp.json"] = createHash("sha256")
      .update(upstreamFiles[".mcp.json"] + "\0" + mcpConfig)
      .digest("hex");
  }
  return {
    source,
    files: Object.fromEntries(
      Object.entries(installedSourceFiles).map(([path, digest]) => [path, digest]),
    ),
    provenance: {
      entryId,
      sourceUrl: source.sourceUrl,
      revision: source.revision,
      terms: source.terms,
      licenseEvidence: source.licenseEvidence,
      upstreamDigest: sourceDigest.digest("hex"),
      upstreamFiles,
      installedSourceFiles,
    },
  };
}

export function marketplaceEntry(entryId: string) {
  return sourceById(entryId);
}

/** External catalogs are discovery sources, never implicit installation authority. */
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { catalogFetch, publicHttpsUrl, type CatalogFetch } from "./marketplace-http.js";
import { hashLocalPluginDirectory, importLocalPlugin, localPluginId, pluginBundlePath, writeAtomicJson } from "./plugin-files.js";

type Json = Record<string, any>;
export type CatalogSource = { id: string; title: string; kind: "mcp-registry" | "clawhub" | "github-skills" | "github-topic"; url: string; enabled?: boolean; ref?: string };
export type CatalogEntry = { key: string; sourceId: string; name: string; description: string; version: string; sourceUrl: string; kind: "mcp" | "skill"; pluginId: string; installable: boolean; reason?: string; fields?: Json[]; warnings?: string[]; fileCount?: number; license?: string };
const defaults: CatalogSource[] = [
  { id: "mcp", title: "MCP Registry", kind: "mcp-registry", url: "https://registry.modelcontextprotocol.io/v0.1" },
  { id: "clawhub", title: "ClawHub", kind: "clawhub", url: "https://clawhub.ai/api/v1" },
  { id: "github-popular", title: "GitHub Popular Skills", kind: "github-topic", url: "https://github.com/topics/agent-skills" },
  { id: "openai", title: "OpenAI Skills", kind: "github-skills", url: "https://github.com/openai/skills", ref: "main" },
  { id: "anthropic", title: "Anthropic Skills", kind: "github-skills", url: "https://github.com/anthropics/skills", ref: "main" },
];
const cache = new Map<string, { until: number; value: Json }>();
const pending = new Map<string, Promise<Json>>();
const backoff = new Map<string, number>();
const installs = new Map<string, Promise<unknown>>();
class GitHubListingError extends Error {}
const digest = (s: string | Uint8Array) => createHash("sha256").update(s).digest("hex");
function bounded(value: unknown, max = 500): string { return typeof value === "string" ? value.slice(0, max) : ""; }
function safePath(value: string) {
  if (!value || value.length > 500 || /[\\\x00-\x1f]/.test(value) || value.split("/").some(p => !p || p === "." || p === "..")) throw Error("Unsafe marketplace file path.");
  return value;
}
function identity(source: CatalogSource, key: string) {
  return "external-" + digest(source.id + "\0" + source.kind + "\0" + source.url + "\0" + key).slice(0, 24);
}
function sources(root: string): CatalogSource[] {
  const file = join(root, "marketplace-sources.json");
  const data = existsSync(file) ? readFileSync(file, "utf8") : "";
  if (data.length > 65536) throw Error("Marketplace sources configuration is too large.");
  const rows = data ? JSON.parse(data).sources : defaults;
  if (!Array.isArray(rows) || rows.length > 32) throw Error("Invalid marketplace sources configuration.");
  const ids = new Set<string>();
  return rows.map((s: CatalogSource) => {
    if (!/^[a-z][a-z0-9-]{0,39}$/.test(s.id) || ids.has(s.id) || !["mcp-registry", "clawhub", "github-skills", "github-topic"].includes(s.kind)) throw Error("Invalid marketplace source.");
    ids.add(s.id); const u = publicHttpsUrl(s.url);
    if (u.search || (s.kind === "github-skills" && (u.hostname !== "github.com" || !/^\/[\w.-]+\/[\w.-]+\/?$/.test(u.pathname)))) throw Error("Invalid marketplace source URL.");
    if (s.kind === "github-topic" && (u.origin !== "https://github.com" || !/^\/topics\/[a-z0-9][a-z0-9-]{0,49}\/?$/.test(u.pathname))) throw Error("Invalid GitHub topic URL.");
    return { ...s, url: s.url.replace(/\/$/, ""), title: bounded(s.title, 80) || s.id };
  }).filter(s => s.enabled !== false);
}
async function json(url: string, fetcher: CatalogFetch, fresh = false): Promise<Json> {
  const key = url; const host = new URL(url).origin;
  if (!fresh && cache.get(key)?.until! > Date.now()) return cache.get(key)!.value;
  if ((backoff.get(host) ?? 0) > Date.now()) throw Error("Marketplace rate limit reached. Try again later.");
  if (pending.has(key)) return pending.get(key)!;
  const op = (async () => {
    const response = await fetcher(url);
    if (response.status === 429 || (response.status === 403 && host === "https://api.github.com")) {
      const raw = response.headers.get("retry-after") ?? "60";
      const seconds = Number(raw);
      backoff.set(host, Date.now() + Math.min(3600000, Math.max(1000, Number.isFinite(seconds) ? seconds * 1000 : Date.parse(raw) - Date.now() || 60000)));
      throw Error("Marketplace rate limit reached. Try again later.");
    }
    if (!response.ok) throw Error(`Marketplace request failed (${response.status}).`);
    const text = await response.text();
    if (text.length > 4 * 1024 * 1024) throw Error("Marketplace metadata exceeds the size limit.");
    let value: Json;
    try { value = JSON.parse(text); } catch { throw Error("Marketplace returned invalid metadata."); }
    if (cache.size >= 100) cache.delete(cache.keys().next().value!);
    cache.set(key, { until: Date.now() + 5 * 60000, value });
    return value;
  })();
  pending.set(key, op);
  try { return await op; } finally { pending.delete(key); }
}
function endpoint(base: string, path: string, params: Record<string, string> = {}) {
  const url = new URL(base + path);
  Object.entries(params).forEach(([k,v]) => { if (v) url.searchParams.set(k,v); });
  return url.toString();
}
function baseEntry(s: CatalogSource, key: string, name: string, version: string, description: string, sourceUrl: string, kind: "skill" | "mcp"): CatalogEntry {
  return { key, sourceId: s.id, name: bounded(name, 180), version: bounded(version, 150), description: bounded(description, 3000), sourceUrl, kind, pluginId: localPluginId(identity(s,key)), installable: true };
}
function clawKey(key: string) {
  const parts = key.split("/");
  if (parts.length !== 2 || parts.some(p => !/^[\w.-]+$/.test(p))) throw Error("A publisher-qualified ClawHub Skill is required.");
  return { owner: parts[0], slug: parts[1] };
}
function clawRow(s: CatalogSource, row: Json) {
  const owner = row.ownerHandle ?? row.native?.ownerHandle;
  const slug = row.slug;
  if (typeof owner !== "string" || typeof slug !== "string") return null;
  const key = owner + "/" + slug; clawKey(key);
  return baseEntry(s,key,row.displayName || slug,row.latestVersion?.version || row.version || row.tags?.latest || "",row.summary || "",`${new URL(s.url).origin}/${owner}/skills/${slug}`,"skill");
}
function mcpRow(s: CatalogSource, wrapper: Json) {
  const raw = wrapper.server;
  if (!raw || typeof raw.name !== "string" || !raw.version) return null;
  const meta = wrapper._meta?.["io.modelcontextprotocol.registry/official"];
  if (meta && (meta.status !== "active" || meta.isLatest === false)) return null;
  return baseEntry(s,raw.name,raw.title || raw.name,raw.version,raw.description || "",`${new URL(s.url).origin}/?q=${encodeURIComponent(raw.name)}`,"mcp");
}
function mcpConfig(raw: Json) {
  const remote = (raw.remotes ?? []).find((r: Json) => r.type === "streamable-http" || r.type === "sse");
  if (!remote) return { reason: "This entry requires a local package runtime. Automatic package execution is not supported yet." };
  try { publicHttpsUrl(remote.url); } catch { return { reason: "This endpoint is not a supported public HTTPS URL." }; }
  if (/[{}]/.test(remote.url)) return { reason: "This endpoint requires a provider-specific URL. Configure it manually in Bot connectors." };
  const fields: Json[] = []; const headers: Record<string, string> = {};
  for (const h of remote.headers ?? []) {
    if (!/^[A-Za-z0-9-]{1,80}$/.test(h.name) || /^(host|connection|content-length|transfer-encoding)$/i.test(h.name)) return { reason: "Unsupported connection header." };
    const key = "HEADER_" + fields.length;
    const fixed = typeof h.value === "string" && !/[{}\r\n]/.test(h.value) ? h.value : undefined;
    if (fixed !== undefined) headers[h.name] = fixed;
    else {
      fields.push({ key, label: h.name, hint: bounded(h.description, 500) + " Enter the complete header value, including Bearer if required.", type: "string", isSecret: h.isSecret !== false, isRequired: h.isRequired !== false });
      headers[h.name] = "${" + key + ":-}";
    }
  }
  if (!Object.keys(headers).some(k => k.toLowerCase() === "authorization")) {
    fields.push({ key: "AUTHORIZATION", label: "Authorization (optional)", hint: "For API-key services, enter the full header, for example Bearer … . OAuth-only services require administrator setup.", type: "string", isSecret: true, isRequired: false });
    headers.Authorization = "${AUTHORIZATION:-}";
  }
  return { config: { type: remote.type === "sse" ? "sse" : "http", url: remote.url, headers }, fields };
}

export function createExternalMarketplace(root: string, fetcher: CatalogFetch = catalogFetch) {
  const source = (id: string) => { const s = sources(root).find(s => s.id === id); if (!s) throw Error("Marketplace source is disabled or unavailable."); return s; };
  const request = (url: string, fresh = false) => json(url,fetcher,fresh);
  async function github(s: CatalogSource, revision?: string, fresh = false) {
    const repo = new URL(s.url).pathname.replace(/^\//, "");
    const sha = revision ?? (await request(`https://api.github.com/repos/${repo}/commits/${encodeURIComponent(s.ref || "HEAD")}`,fresh)).sha;
    if (!/^[a-f0-9]{40}$/.test(sha)) throw Error("Cannot resolve the repository revision.");
    const tree = await request(`https://api.github.com/repos/${repo}/git/trees/${sha}?recursive=1`);
    if (tree.truncated || !Array.isArray(tree.tree) || tree.tree.length > 20000) throw new GitHubListingError("Repository listing is incomplete or too large.");
    return { repo, sha, files: tree.tree as Json[] };
  }
  function topicKey(key: string) {
    const [owner, name, ...parts] = key.split("/");
    if (![owner,name].every(p => p && /^[\w-][\w.-]*$/.test(p) && p !== "..")) throw Error("Invalid GitHub repository identity.");
    const path = parts.join("/");
    if (path) safePath(path);
    return { repo: `${owner}/${name}`, path };
  }
  async function topicRepository(s: CatalogSource, repo: string, fresh = false) {
    const meta = await request(`https://api.github.com/repos/${repo}`,fresh);
    if (meta.full_name !== repo || meta.private !== false || meta.archived || meta.fork || !meta.topics?.includes(s.url.split("/").pop())) throw Error("Repository is no longer eligible for this topic.");
    return { ...s, url: `https://github.com/${repo}`, ref: typeof meta.default_branch === "string" ? meta.default_branch : "HEAD" };
  }
  function skillPaths(files: Json[]) {
    return files.filter(f => f.type === "blob" && (f.path === "SKILL.md" || f.path.endsWith("/SKILL.md")));
  }
  async function inspect(sourceId: string, key: string, fresh = false) {
    const s = source(sourceId);
    if (key.length > 500) throw Error("Invalid marketplace entry.");
    if (s.kind === "mcp-registry") {
      const wrapper = await request(endpoint(s.url, `/servers/${encodeURIComponent(key)}/versions/latest`),fresh);
      const entry = mcpRow(s,wrapper);
      if (!entry || entry.key !== key) throw Error("This MCP entry is unavailable.");
      const parsed = mcpConfig(wrapper.server);
      return { s, entry: { ...entry, fields: parsed.fields ?? [], installable: !parsed.reason, reason: parsed.reason, warnings: ["Registry inclusion is not a security audit. OAuth-only services need administrator setup; adding an endpoint does not authorize an account."] }, config: parsed.config };
    }
    if (s.kind === "clawhub") {
      const { owner,slug } = clawKey(key);
      const metadata = await request(endpoint(s.url,`/skills/${encodeURIComponent(slug)}`,{owner}),fresh);
      if (metadata.owner?.handle !== owner || metadata.skill?.slug !== slug) throw Error("ClawHub publisher identity changed.");
      const version = metadata.latestVersion?.version;
      if (typeof version !== "string") throw Error("This Skill has no downloadable version.");
      const detail = await request(endpoint(s.url,`/skills/${encodeURIComponent(slug)}/versions/${encodeURIComponent(version)}`,{owner}),fresh);
      const files = detail.version?.files;
      const moderation = metadata.moderation;
      const blocked = moderation?.isSuspicious || moderation?.isMalwareBlocked || moderation?.isHidden || moderation?.isRemoved || ["malicious", "suspicious"].includes(detail.version?.security?.status);
      const entry = baseEntry(s,key,metadata.skill.displayName || slug,version,metadata.skill.summary || "",`${new URL(s.url).origin}/${owner}/skills/${slug}`,"skill");
      return { s, entry: { ...entry, installable: !blocked && Array.isArray(files) && files.length > 0, reason: blocked ? "This Skill is flagged or blocked by its source." : !Array.isArray(files) || !files.length ? "The source does not expose a compatible file manifest." : undefined, license: detail.version?.license || "See source license", fileCount: files?.length, warnings: [detail.version?.security?.hasWarnings ? "The source reports scan warnings. Review its listing before installing." : "Community Skill; source scanning is not a security guarantee."] }, files };
    }
    const parsed = s.kind === "github-topic" ? topicKey(key) : null;
    const skillPath = parsed ? parsed.path : key === "." ? "" : safePath(key);
    const repository = parsed ? await topicRepository(s,parsed.repo,fresh) : s;
    const repo = await github(repository,undefined,fresh);
    const files = repo.files.filter(f => !skillPath || f.path.startsWith(skillPath + "/") || /^(LICENSE|LICENCE|NOTICE)(\.[^/]*)?$/i.test(f.path));
    if (!files.some(f => f.path === (skillPath ? skillPath + "/" : "") + "SKILL.md")) throw Error("This Skill directory is unavailable.");
    return { s, entry: { ...baseEntry(s,key,skillPath.split("/").pop() || repo.repo,repo.sha,`Skill from ${repo.repo}. Includes its scripts and reference files.`,`${repository.url}/tree/${repo.sha}${skillPath ? "/"+skillPath.split("/").map(encodeURIComponent).join("/") : ""}`,"skill"),fileCount:files.filter(f=>f.type === "blob").length,license:"See included license files",warnings:["Community repository; topic membership and stars are not official verification or a security review.","Repository files are imported without running installation hooks."] }, files, repo: repo.repo, skillPath };
  }
  const installed = (pluginId: string) => {
    const stateFile = join(root,"plugins","local-installs.json");
    if (!existsSync(stateFile)) return null;
    const pointer = JSON.parse(readFileSync(stateFile,"utf8")).plugins?.[pluginId];
    if (!pointer) return null;
    const provenance = join(pluginBundlePath(root,pointer),".brokpot-source.json");
    return existsSync(provenance) ? JSON.parse(readFileSync(provenance,"utf8")).version as string : null;
  };
  const api = {
    sources: () => sources(root),
    async search({sourceId,q = "",cursor = ""}: {sourceId:string;q?:string;cursor?:string}) {
      const s = source(sourceId);
      if (q.length > 200 || cursor.length > 5000) throw Error("Marketplace query is too long.");
      if (s.kind === "mcp-registry") {
        const data = await request(endpoint(s.url,"/servers",{limit:"30",version:"latest",search:q,cursor}));
        return { entries: (data.servers ?? []).map((r:Json)=>mcpRow(s,r)).filter(Boolean), nextCursor: bounded(data.metadata?.nextCursor,5000) || null };
      }
      if (s.kind === "clawhub") {
        const data = await request(endpoint(s.url,q ? "/search" : "/skills",q ? {q,nonSuspiciousOnly:"true"} : {limit:"30",sort:"recommended",nonSuspiciousOnly:"true",cursor}));
        return { entries: (data.items ?? data.results ?? []).slice(0,60).map((r:Json)=>clawRow(s,r)).filter(Boolean), nextCursor: q ? null : bounded(data.nextCursor,5000) || null };
      }
      if (s.kind === "github-topic") {
        const position = cursor ? JSON.parse(cursor) : { page: 1, offset: 0 };
        if (!Number.isSafeInteger(position.page) || position.page < 1 || position.page > 1000 || !Number.isSafeInteger(position.offset) || position.offset < 0 || position.offset > 20000) throw Error("Invalid catalog cursor.");
        // Plain keywords only: callers cannot inject qualifiers that escape the topic.
        const terms = q.match(/[\p{L}\p{N}_-]+/gu) ?? [];
        const keywords = terms.filter(t => !["AND","OR","NOT"].includes(t.toUpperCase())).slice(0,20).map(t => `"${t}"`).join(" ");
        const query = `topic:${s.url.split("/").pop()} archived:false fork:false ${keywords}${keywords ? " in:name,description,readme" : ""}`;
        // One repository per page bounds API requests and never drops a large
        // collection's skills; its remaining directories use the offset cursor.
        const data = await request(endpoint("https://api.github.com","/search/repositories",{q:query,sort:"stars",order:"desc",per_page:"1",page:String(position.page)}));
        if (data.incomplete_results) throw Error("GitHub search is incomplete. Try again or narrow the keywords.");
        const meta = data.items?.[0];
        if (!meta) return {entries:[],nextCursor:null};
        const {repo: repoName} = topicKey(meta.full_name);
        const repository = await topicRepository(s,repoName);
        const nextRepository = position.page < Math.min(1000,data.total_count) ? JSON.stringify({page:position.page+1,offset:0}) : null;
        let repo;
        try { repo = await github(repository); } catch (error) {
          // Do not let an oversized topic repository prevent browsing the rest.
          // Transport/rate-limit failures still surface instead of looking empty.
          if (!(error instanceof GitHubListingError)) throw error;
          return {entries:[],nextCursor:nextRepository};
        }
        const rows = skillPaths(repo.files);
        const entries = rows.slice(position.offset,position.offset+30).map(f => {
          const path = f.path === "SKILL.md" ? "" : f.path.slice(0,-9);
          const key = repoName + (path ? "/"+path : "");
          return baseEntry(s,key,path.split("/").pop() || repoName,repo.sha,`${repoName} · ${Number.isSafeInteger(meta.stargazers_count) ? meta.stargazers_count : 0} stars · Community\n${bounded(meta.description,1000)}`,`${repository.url}/tree/${repo.sha}${path ? "/"+path.split("/").map(encodeURIComponent).join("/") : ""}`,"skill");
        });
        const nextCursor = position.offset+30 < rows.length ? JSON.stringify({page:position.page,offset:position.offset+30}) : nextRepository;
        return {entries,nextCursor};
      }
      const repo = await github(s);
      const rows = skillPaths(repo.files).filter(f=>f.path.toLowerCase().includes(q.toLowerCase()));
      const offset = cursor ? Number(cursor) : 0;
      if (!Number.isSafeInteger(offset) || offset < 0) throw Error("Invalid catalog cursor.");
      return { entries: rows.slice(offset,offset+30).map(f=> { const key = f.path === "SKILL.md" ? "." : f.path.slice(0,-9); return baseEntry(s,key,key === "." ? repo.repo : key.split("/").pop()!,repo.sha,`Skill from ${s.title}`,`${s.url}/tree/${repo.sha}/${key}`,"skill"); }),nextCursor:offset+30 < rows.length ? String(offset+30) : null };
    },
    async detail(args: {sourceId:string;key:string}) { const entry = (await inspect(args.sourceId,args.key)).entry; return {...entry,installedVersion:installed(entry.pluginId)}; },
    async install(args: {sourceId:string;key:string;version:string;values?:Json;update?:boolean}, apply: (pluginId:string,values:Json,update:boolean)=>Promise<unknown>) {
      const lock = root;
      const operation = (installs.get(lock) ?? Promise.resolve()).catch(()=>{}).then(async()=>{
        const s = source(args.sourceId); const id = localPluginId(identity(s,args.key));
        const previous = installed(id);
        if (previous && !args.update) return {pluginId:id,version:previous,alreadyInstalled:true};
        if (args.update && !previous) throw Error("This extension is not installed. Refresh before updating.");
        if (previous) {
          const pointer = JSON.parse(readFileSync(join(root,"plugins","local-installs.json"),"utf8")).plugins[id];
          if (hashLocalPluginDirectory(pluginBundlePath(root,pointer)).digest !== pointer.digest) throw Error("This extension has local edits. Preserve them before replacing its source.");
        }
        const entry = (await inspect(args.sourceId,args.key)).entry;
        const values = args.values ?? {};
        const fields = entry.fields ?? [];
        if (Object.keys(values).some(k=>!fields.some(f=>f.key===k)) || fields.some(f=>f.isRequired && (typeof values[f.key] !== "string" || !values[f.key].trim()))) throw Error("Complete the required connector configuration.");
        if (Object.values(values).some(v=>typeof v !== "string" || v.length>8192 || /[\r\n]/.test(v))) throw Error("Invalid connector configuration.");
        const prepared = await api.prepare(args);
        await apply(prepared.pluginId,values,!!args.update);
        return prepared;
      });
      installs.set(lock,operation);
      try {return await operation;} finally {if(installs.get(lock)===operation) installs.delete(lock);}
    },
    async prepare(args: {sourceId:string;key:string;version:string}) {
      const item = await inspect(args.sourceId,args.key,true);
      const {s,entry} = item;
      if (!entry.installable) throw Error(entry.reason || "This entry cannot be installed.");
      if (entry.version !== args.version) throw Error("The source version changed. Reopen the details before installing.");
      const slug = identity(s,args.key);
      mkdirSync(join(root,"plugins"),{recursive:true,mode:0o700});
      const stage = mkdtempSync(join(root,"plugins",".external-"));
      try {
        let total = 0;
        const hashes: Record<string,string> = {};
        const write = (path:string, bytes:Uint8Array, mode = 0o644) => {
          safePath(path); total += bytes.byteLength;
          if (bytes.byteLength > 2*1024*1024 || total > 12*1024*1024) throw Error("Skill files exceed the import size limit.");
          const file = join(stage,path); mkdirSync(dirname(file),{recursive:true,mode:0o700}); writeFileSync(file,bytes,{flag:"wx",mode}); hashes[path] = digest(bytes);
        };
        if (entry.kind === "skill") {
          const files = item.files as Json[];
          if (!Array.isArray(files) || files.length > 500) throw Error("Skill has too many files.");
          for (const file of files) {
            if (file.mode === "120000" || file.mode === "160000" || file.type === "commit") throw Error("Skill contains a symlink or submodule.");
            if (file.type && file.type !== "blob") continue;
            const path = safePath(file.path);
            if (file.size > 2*1024*1024) throw Error("Skill file exceeds the size limit.");
            const {owner,slug:skillSlug} = s.kind === "clawhub" ? clawKey(args.key) : {owner:"",slug:""};
            const url = s.kind === "clawhub" ? endpoint(s.url,`/skills/${encodeURIComponent(skillSlug)}/file`,{owner,path,version:entry.version}) : `https://raw.githubusercontent.com/${item.repo}/${entry.version}/${path.split("/").map(encodeURIComponent).join("/")}`;
            const response = await fetcher(url);
            if (!response.ok) throw Error(`Skill download failed (${response.status}).`);
            const bytes = new Uint8Array(await response.arrayBuffer());
            const hash = s.kind === "clawhub" ? digest(bytes) : createHash("sha1").update(`blob ${bytes.byteLength}\0`).update(bytes).digest("hex");
            if (hash !== (s.kind === "clawhub" ? file.sha256 : file.sha)) throw Error("Skill file integrity check failed.");
            const skillPath = "skillPath" in item ? item.skillPath : undefined;
            const relative = s.kind === "clawhub" || skillPath === "" ? path : skillPath && path.startsWith(skillPath+"/") ? path.slice(skillPath.length+1) : "upstream-license/"+path;
            write("skills/imported/"+relative,bytes,file.mode === "100755" ? 0o755 : 0o644);
          }
          if (!existsSync(join(stage,"skills/imported/SKILL.md"))) throw Error("Skill is missing SKILL.md.");
        }
        const manifest: Json = {name:slug,displayName:entry.name,description:entry.description,version:entry.version,homepage:entry.sourceUrl,...(entry.kind === "skill" ? {skills:"skills"} : {})};
        if (item.config) {
          const properties: Json = {}; const required: string[] = [];
          for (const f of entry.fields ?? []) { properties[f.key] = {type:"string",title:f.label,description:f.hint,...(f.isSecret ? {format:"password",writeOnly:true} : {}),...(f.isRequired ? {minLength:1} : {default:""})}; if (f.isRequired) required.push(f.key); }
          manifest.variables = {type:"object",properties,required,additionalProperties:false};
          write(".mcp.json",Buffer.from(JSON.stringify({mcpServers:{connector:item.config}})));
        }
        write(".cursor-plugin/plugin.json",Buffer.from(JSON.stringify(manifest)));
        write(".brokpot-source.json",Buffer.from(JSON.stringify({sourceId:s.id,key:entry.key,version:entry.version,sourceUrl:entry.sourceUrl,files:hashes})));
        const result = importLocalPlugin(root,stage,slug);
        writeAtomicJson(join(root,"marketplace-imports",result.pluginId+".json"),{...entry,digest:result.digest});
        return {pluginId:result.pluginId,version:entry.version};
      } finally { rmSync(stage,{recursive:true,force:true}); }
    },
  };
  return api;
}

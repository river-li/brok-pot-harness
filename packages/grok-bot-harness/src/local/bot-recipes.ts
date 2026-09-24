/** Local Bot starter recipes. Recipe files are stored in the Host data root;
 * their plugin dependencies are configured through the retained Plugins flow. */
import { createHash, randomBytes, randomUUID } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { localPluginId, writeAtomicJson } from "./plugin-files.js";

type Recipe = {
  shareId: string;
  version: number;
  profile: {
    name: string;
    description: string;
    avatarShape?: string;
    avatarColor?: string;
  };
  memory: Array<{ kind?: string; createdAt?: string; content: string }>;
  skills: Array<{ name: string; description: string; content: string }>;
  routines: Array<{ name: string; slug: string; description: string; content: string }>;
  plugins: Array<{ name: string; description?: string; pluginId: string }>;
  gettingStarted?: { skill: string };
  dependencies: string[];
};
type RecipeContent = Omit<Recipe, "shareId" | "version" | "dependencies">;
type Registry = {
  version: 1;
  recipes: Record<string, { version: number; recipe: RecipeContent; importedAtMs: number }>;
};
type Binding = {
  shareId: string;
  recipeDigest: string;
  operationId: string;
  createdAtMs: number;
  status: "creating" | "created";
  setupStatus: "pending" | "accepted";
  setupClientNonce: string;
  setupClientNonces: string[];
  setupPrompt?: { prompt: string; richText?: string };
};
type ImportState = { version: 1; agents: Record<string, Binding> };

const recipes: Recipe[] = [
  {
    shareId: "GBHLOCALCHROMEEXT0001",
    version: 1,
    profile: {
      name: "Chrome Extension Builder",
      description: "Build and review Chrome extensions with the pinned Chrome Extensions Skill.",
    },
    memory: [],
    skills: [
      {
        name: "Chrome Extension Builder",
        description: "Use the pinned Chrome Extensions Skill for extension work.",
        content: [
          "# Chrome Extension Builder",
          "",
          "Use the installed `chrome-extensions` Skill when building, debugging, or reviewing Chrome extensions. That Skill includes pinned reference files; consult the relevant reference before giving implementation advice.",
          "",
          "Ask for the target Chrome version and extension goal when they are unclear. Check manifest permissions against the requested behavior, explain permission changes, and do not perform destructive edits without the user's approval.",
        ].join("\n"),
      },
    ],
    routines: [],
    plugins: [
      {
        name: "Chrome Extension Builder",
        description: "Installs the pinned chrome-extensions Skill and references.",
        pluginId: localPluginId("gbh-chrome-extensions"),
      },
    ],
    dependencies: [
      "Install Chrome Extension Builder in Plugins to load the pinned Skill and its 23 reference files.",
    ],
  },
  {
    shareId: "GBHLOCALFIRECRAWL0001",
    version: 1,
    profile: {
      name: "Web Research Assistant",
      description: "Research supplied topics and URLs with Firecrawl Skills and MCP tools.",
    },
    memory: [],
    skills: [
      {
        name: "Web Research",
        description: "Use Firecrawl tools for sourced web research.",
        content: [
          "# Web Research",
          "",
          "Use the installed Firecrawl Skills and MCP tools for web search, scraping, and crawl tasks. Ask for a scope or target URL when needed. Prefer primary sources, keep source URLs beside each claim, and distinguish fetched facts from inference.",
          "",
          "This recipe depends on the Firecrawl Web Research plugin. Install it and configure its API key in Plugins before relying on Firecrawl tools. The MCP key is stored by the Host and is never included in this recipe.",
        ].join("\n"),
      },
    ],
    routines: [],
    plugins: [
      {
        name: "Firecrawl Web Research",
        description: "Installs Firecrawl Skills and the server-side MCP connection.",
        pluginId: localPluginId("gbh-firecrawl-web-research"),
      },
    ],
    dependencies: [
      "Install Firecrawl Web Research in Plugins and configure the API key on the Host.",
      "Its upstream CLI fallback requires Node, npm, and network access; GBH does not install it.",
    ],
  },
];
const staticRecipeById = new Map(recipes.map((recipe) => [recipe.shareId, recipe]));
const mutations = new Map<string, Promise<unknown>>();
const MAX_RECIPE_BYTES = 2 * 1024 * 1024;

function record(value: unknown): Record<string, any> {
  if (!value || typeof value !== "object" || Array.isArray(value))
    throw Error("Recipe data must be a JSON object.");
  return value as Record<string, any>;
}
function text(value: unknown, label: string) {
  if (typeof value !== "string" || value.trim().length === 0)
    throw Error(`Recipe ${label} must be a non-empty string.`);
  return value;
}
function textRows<T extends object>(
  value: unknown,
  label: string,
  required: string[],
  optional: string[] = [],
): T[] {
  if (!Array.isArray(value)) throw Error(`Recipe ${label} must be an array.`);
  return value.map((item, index) => {
    const entry = record(item), result: Record<string, string> = {};
    const allowed = new Set([...required, ...optional]);
    if (Object.keys(entry).some((key) => !allowed.has(key)))
      throw Error(`Recipe ${label}[${index}] contains unsupported fields.`);
    for (const field of required)
      result[field] = text(entry[field], `${label}[${index}].${field}`);
    for (const field of optional) {
      if (entry[field] === null || entry[field] === undefined) continue;
      result[field] = text(entry[field], `${label}[${index}].${field}`);
    }
    return result as T;
  });
}
function parseRecipeContent(value: unknown): RecipeContent {
  const source = record(value), profile = record(source.profile);
  const allowed = new Set(["profile", "memory", "skills", "routines", "plugins", "gettingStarted"]);
  if (Object.keys(source).some((key) => !allowed.has(key)))
    throw Error("Recipe contains unsupported top-level fields.");
  const profileAllowed = new Set(["name", "description", "avatarShape", "avatarColor"]);
  if (Object.keys(profile).some((key) => !profileAllowed.has(key)))
    throw Error("Recipe profile contains unsupported fields.");
  for (const field of ["avatarShape", "avatarColor"])
    if (profile[field] !== undefined && typeof profile[field] !== "string")
      throw Error(`Recipe profile.${field} must be a string.`);
  const recipe: RecipeContent = {
    profile: {
      name: text(profile.name, "profile.name"),
      description: text(profile.description, "profile.description"),
      ...(typeof profile.avatarShape === "string" ? { avatarShape: profile.avatarShape } : {}),
      ...(typeof profile.avatarColor === "string" ? { avatarColor: profile.avatarColor } : {}),
    },
    memory: textRows<{ kind?: string; createdAt?: string; content: string }>(source.memory, "memory", ["content"], ["kind", "createdAt"]),
    skills: textRows<{ name: string; description: string; content: string }>(source.skills, "skills", ["name", "description", "content"]),
    routines: textRows<{ name: string; slug: string; description: string; content: string }>(source.routines, "routines", ["name", "slug", "description", "content"]),
    plugins: textRows<{ name: string; description?: string; pluginId: string }>(source.plugins, "plugins", ["name", "pluginId"], ["description"]),
    ...(source.gettingStarted === undefined
      ? {}
      : (() => {
          const gettingStarted = record(source.gettingStarted);
          if (Object.keys(gettingStarted).some((key) => key !== "skill"))
            throw Error("Recipe gettingStarted contains unsupported fields.");
          return { gettingStarted: { skill: text(gettingStarted.skill, "gettingStarted.skill") } };
        })()),
  };
  if (
    recipe.gettingStarted &&
    !recipe.skills.some((skill) => skill.name === recipe.gettingStarted?.skill)
  )
    throw Error("Recipe gettingStarted.skill must name one of its Skills.");
  return recipe;
}
function parseRecipeJson(recipeJson: string) {
  if (new TextEncoder().encode(recipeJson).byteLength > MAX_RECIPE_BYTES)
    throw Error("Recipe exceeds the 2 MiB size limit.");
  let parsed: unknown;
  try {
    parsed = JSON.parse(recipeJson);
  } catch {
    throw Error("Recipe is not valid JSON.");
  }
  return parseRecipeContent(parsed);
}
function dependenciesFrom(recipe: RecipeContent) {
  return recipe.plugins.map(
    (plugin) => `Install ${plugin.name} (${plugin.pluginId}) in Plugins before using this recipe.`,
  );
}
function recipeDigest(recipe: Recipe) {
  return createHash("sha256").update(JSON.stringify(recipe)).digest("hex");
}
function contentDigest(content: RecipeContent) {
  return createHash("sha256").update(JSON.stringify(content)).digest("hex");
}
function publicView(recipe: Recipe) {
  const builtIn = staticRecipeById.has(recipe.shareId);
  return {
    shareId: recipe.shareId,
    name: recipe.profile.name,
    title: recipe.profile.name,
    avatarShape: recipe.profile.avatarShape ?? "",
    avatarColor: recipe.profile.avatarColor ?? "",
    description: recipe.profile.description,
    version: recipe.version,
    activeVersion: recipe.version,
    published: false,
    visibility: null,
    localRecipe: true,
    builtIn,
    editable: !builtIn,
    ...(recipe.gettingStarted === undefined
      ? {}
      : { gettingStartedSkill: recipe.gettingStarted.skill }),
    dependencies: recipe.dependencies,
    plugins: recipe.plugins,
  };
}
function dependenciesFor(recipe: RecipeContent) {
  return [
    ...dependenciesFrom(recipe),
    ...(recipe.plugins.some((plugin) => plugin.pluginId === localPluginId("gbh-firecrawl-web-research"))
      ? ["Configure the Firecrawl API key on the Host before using MCP tools."]
      : []),
  ];
}
function toRecipe(shareId: string, version: number, content: RecipeContent): Recipe {
  return {
    shareId,
    version,
    ...structuredClone(content),
    dependencies: dependenciesFor(content),
  };
}
function registryState(file: string): Registry {
  if (!existsSync(file)) return { version: 1, recipes: {} };
  const state = JSON.parse(readFileSync(file, "utf8")) as Registry;
  if (!state || state.version !== 1 || !state.recipes || typeof state.recipes !== "object" || Array.isArray(state.recipes))
    throw Error("Invalid local Bot recipe catalog.");
  for (const [shareId, entry] of Object.entries(state.recipes)) {
    if (!/^[A-Za-z0-9_-]{21}$/.test(shareId) || !entry || !Number.isSafeInteger(entry.version) || entry.version < 1 || !Number.isFinite(entry.importedAtMs))
      throw Error("Invalid local Bot recipe catalog entry.");
    parseRecipeContent(entry.recipe);
  }
  return state;
}

export function createLocalBotRecipeStore(root: string) {
  const file = join(root, "bot-recipes", "agent-imports.json");
  const catalogFile = join(root, "bot-recipes", "recipes.json");
  const setupNonce = (operationId: string) => `gbh-template-import:${operationId}`;
  const normalizeBinding = (binding: any): Binding => {
    const stableNonce =
      typeof binding.setupClientNonce === "string" && binding.setupClientNonce.length > 0
        ? binding.setupClientNonce
        : setupNonce(binding.operationId);
    return {
      ...binding,
      setupStatus: binding.setupStatus === "accepted" ? "accepted" : "pending",
      setupClientNonce: stableNonce,
      setupClientNonces: Array.isArray(binding.setupClientNonces)
        ? [...new Set(binding.setupClientNonces)]
        : [stableNonce],
    };
  };
  const readImports = (): ImportState => {
    if (!existsSync(file)) return { version: 1, agents: {} };
    const value = JSON.parse(readFileSync(file, "utf8")) as ImportState;
    if (!value || value.version !== 1 || !value.agents || typeof value.agents !== "object" || Array.isArray(value.agents))
      throw Error("Invalid local Bot recipe import state.");
    for (const [agentId, binding] of Object.entries(value.agents)) {
      if (
        !agentId ||
        !binding ||
        typeof binding.shareId !== "string" ||
        !/^[a-f0-9]{64}$/.test(binding.recipeDigest) ||
        !/^[a-f0-9-]{36}$/.test(binding.operationId) ||
        !Number.isFinite(binding.createdAtMs) ||
        (binding.status !== "creating" && binding.status !== "created") ||
        (binding.setupStatus !== undefined &&
          binding.setupStatus !== "pending" &&
          binding.setupStatus !== "accepted") ||
        (binding.setupClientNonce !== undefined &&
          (typeof binding.setupClientNonce !== "string" || binding.setupClientNonce.length === 0)) ||
        (binding.setupClientNonces !== undefined &&
          (!Array.isArray(binding.setupClientNonces) ||
            binding.setupClientNonces.some((nonce: unknown) => typeof nonce !== "string" || nonce.length === 0))) ||
        (binding.setupPrompt !== undefined &&
          (!binding.setupPrompt ||
            typeof binding.setupPrompt.prompt !== "string" ||
            (binding.setupPrompt.richText !== undefined &&
              typeof binding.setupPrompt.richText !== "string")))
      )
        throw Error("Invalid local Bot recipe import binding.");
      value.agents[agentId] = normalizeBinding(binding);
    }
    return value;
  };
  const mutate = <T>(key: string, operation: () => T): Promise<T> => {
    const previous = mutations.get(key) ?? Promise.resolve();
    const next = previous.catch(() => {}).then(operation);
    mutations.set(key, next);
    void next.finally(() => {
      if (mutations.get(key) === next) mutations.delete(key);
    }).catch(() => {});
    return next;
  };
  const registry = () => registryState(catalogFile);
  const allRecipes = () => {
    const result = [...recipes];
    for (const [shareId, entry] of Object.entries(registry().recipes))
      result.push(toRecipe(shareId, entry.version, parseRecipeContent(entry.recipe)));
    return result;
  };
  const getRecipe = (shareId: string, version?: number) => {
    const local = staticRecipeById.get(shareId);
    const state = local ? undefined : registry().recipes[shareId];
    const recipe = local ?? (state ? toRecipe(shareId, state.version, parseRecipeContent(state.recipe)) : undefined);
    if (!recipe || (version !== undefined && recipe.version !== version))
      throw Error("This local Bot recipe is unavailable or has changed.");
    return recipe;
  };
  return {
    list: () => allRecipes().map(publicView),
    get(shareId: string, version: number) {
      return structuredClone(getRecipe(shareId, version));
    },
    getView(shareId: string) {
      const recipe = allRecipes().find((item) => item.shareId === shareId);
      return recipe ? publicView(recipe) : null;
    },
    preview(recipeJson: string) {
      const content = parseRecipeJson(recipeJson);
      return {
        name: content.profile.name,
        description: content.profile.description,
        skills: content.skills.map(({ name, description }) => ({ name, description })),
        routines: content.routines.map(({ name, description }) => ({ name, description })),
        plugins: content.plugins.map(({ name, pluginId, description }) => ({ name, pluginId, description })),
        dependencies: dependenciesFor(content),
        ...(content.gettingStarted === undefined
          ? {}
          : { gettingStartedSkill: content.gettingStarted.skill }),
      };
    },
    import(recipeJson: string) {
      return mutate(catalogFile, () => {
        const content = parseRecipeJson(recipeJson), state = registry();
        const digest = contentDigest(content);
        for (const [shareId, entry] of Object.entries(state.recipes)) {
          if (contentDigest(parseRecipeContent(entry.recipe)) === digest)
            return publicView(toRecipe(shareId, entry.version, entry.recipe));
        }
        let shareId = "";
        do {
          shareId = randomBytes(16).toString("base64url").slice(0, 21);
        } while (state.recipes[shareId] || staticRecipeById.has(shareId));
        state.recipes[shareId] = { version: 1, recipe: content, importedAtMs: Date.now() };
        writeAtomicJson(catalogFile, state);
        return publicView(toRecipe(shareId, 1, content));
      });
    },
    update(shareId: string, recipeJson: string) {
      return mutate(catalogFile, () => {
        if (staticRecipeById.has(shareId)) throw Error("Built-in Bot recipes cannot be edited.");
        const state = registry(), current = state.recipes[shareId];
        if (!current) throw Error("Local Bot recipe is unavailable.");
        const next = parseRecipeJson(recipeJson);
        if (contentDigest(parseRecipeContent(current.recipe)) === contentDigest(next))
          return publicView(toRecipe(shareId, current.version, current.recipe));
        current.recipe = next;
        current.version += 1;
        writeAtomicJson(catalogFile, state);
        return publicView(toRecipe(shareId, current.version, current.recipe));
      });
    },
    remove(shareId: string) {
      return mutate(catalogFile, () => {
        if (staticRecipeById.has(shareId)) throw Error("Built-in Bot recipes cannot be removed.");
        const state = registry();
        if (!state.recipes[shareId]) return;
        delete state.recipes[shareId];
        writeAtomicJson(catalogFile, state);
      });
    },
    getBinding(agentId: string) {
      return readImports().agents[agentId];
    },
    recordSetupPrompt(
      agentId: string,
      operationId: string,
      prompt: { prompt: string; richText?: string },
      clientNonce: string,
    ) {
      return mutate(file, () => {
        const state = readImports(), binding = state.agents[agentId];
        if (!binding || binding.operationId !== operationId)
          throw Error("Local Bot recipe import operation changed.");
        if (!clientNonce || clientNonce.length > 512)
          throw Error("Invalid recipe setup send nonce.");
        if (binding.setupPrompt === undefined) {
          binding.setupPrompt = structuredClone(prompt);
        }
        if (!binding.setupClientNonces.includes(clientNonce))
          binding.setupClientNonces.push(clientNonce);
        writeAtomicJson(file, state);
        return {
          prompt: structuredClone(binding.setupPrompt),
          clientNonces: [...binding.setupClientNonces],
        };
      });
    },
    beginSetupResume(agentId: string, operationId: string) {
      return mutate(file, () => {
        const state = readImports(), binding = state.agents[agentId];
        if (!binding || binding.operationId !== operationId)
          throw Error("Local Bot recipe import operation changed.");
        const stable = binding.setupClientNonce;
        const nonce = `sand-resend-v1:${stable.length}:${stable}:${randomUUID()}`;
        if (binding.setupClientNonces.length >= 64)
          throw Error("Recipe setup reached its retry limit. Review the Bot transcript before continuing.");
        binding.setupClientNonces.push(nonce);
        writeAtomicJson(file, state);
        return nonce;
      });
    },
    completeSetup(agentId: string, operationId: string) {
      return mutate(file, () => {
        const state = readImports(), binding = state.agents[agentId];
        if (!binding || binding.operationId !== operationId)
          throw Error("Local Bot recipe import operation changed.");
        if (binding.setupStatus !== "accepted") {
          binding.setupStatus = "accepted";
          writeAtomicJson(file, state);
        }
        return binding;
      });
    },
    claim(shareId: string, version: number, agentId: string) {
      return mutate(file, () => {
        const recipe = getRecipe(shareId, version);
        if (!agentId || agentId.length > 128)
          throw Error("Invalid Bot ID for local recipe import.");
        const state = readImports(), current = state.agents[agentId];
        const digest = recipeDigest(recipe);
        if (current) {
          if (current.shareId !== shareId || current.recipeDigest !== digest)
            throw Error("This Bot ID is already bound to a different recipe import.");
          return current;
        }
        const operationId = randomUUID();
        const binding: Binding = {
          shareId,
          recipeDigest: digest,
          operationId,
          createdAtMs: Date.now(),
          status: "creating",
          setupStatus: "pending",
          setupClientNonce: setupNonce(operationId),
          setupClientNonces: [setupNonce(operationId)],
        };
        state.agents[agentId] = binding;
        writeAtomicJson(file, state);
        return binding;
      });
    },
    complete(agentId: string, operationId: string) {
      return mutate(file, () => {
        const state = readImports(), binding = state.agents[agentId];
        if (!binding || binding.operationId !== operationId)
          throw Error("Local Bot recipe import operation changed.");
        binding.status = "created";
        writeAtomicJson(file, state);
        return binding;
      });
    },
  };
}

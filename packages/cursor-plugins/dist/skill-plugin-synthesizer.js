var import_promises37 = require("node:fs/promises");
var import_node_path68 = require("node:path");
var __awaiter61 = function(thisArg, _arguments, P2, generator) {
  function adopt(value) {
    return value instanceof P2 ? value : new P2(function(resolve29) {
      resolve29(value);
    });
  }
  return new (P2 || (P2 = Promise))(function(resolve29, reject2) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject2(e);
      }
    }
    function rejected3(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject2(e);
      }
    }
    function step(result) {
      result.done ? resolve29(result.value) : adopt(result.value).then(fulfilled, rejected3);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
function skillPathSegments(relativePath) {
  if ((0, import_node_path68.isAbsolute)(relativePath)) {
    throw new Error(`Skill path "${relativePath}" must be relative to the skills root`);
  }
  const segments = relativePath.split(/[/\\]/).filter((segment) => segment.length > 0);
  if (segments.length === 0 || segments.some((segment) => segment === "." || segment === "..")) {
    throw new Error(`Skill path "${relativePath}" resolves to an unsafe path`);
  }
  return segments;
}
function synthesizeSkillPluginDir(options2) {
  return __awaiter61(this, void 0, void 0, function* () {
    var _a19;
    const { skills, targetDir, pluginName } = options2;
    if (skills.length === 0) {
      throw new Error("At least one skill directory is required");
    }
    const safeName = normalizeMarketplaceName(pluginName);
    if (safeName === "") {
      throw new Error(`Plugin name "${pluginName}" has no usable characters`);
    }
    const placements = skills.map(({ dir, relativePath }) => {
      const segments = skillPathSegments(relativePath);
      return { dir, segments, manifestPath: `skills/${segments.join("/")}` };
    });
    const duplicates = placements.map(({ manifestPath: manifestPath2 }) => manifestPath2).filter((path31, index, paths) => paths.indexOf(path31) !== index);
    if (duplicates.length > 0) {
      throw new Error(`Multiple skill folders would pack to the same path: ${duplicates.join(", ")}`);
    }
    const pluginDir = (0, import_node_path68.join)(targetDir, safeName);
    const skillsRoot = (0, import_node_path68.join)(pluginDir, "skills");
    yield (0, import_promises37.mkdir)(skillsRoot, { recursive: true });
    for (const { dir, segments } of placements) {
      const destination = (0, import_node_path68.join)(skillsRoot, ...segments);
      yield (0, import_promises37.mkdir)((0, import_node_path68.dirname)(destination), { recursive: true });
      yield (0, import_promises37.cp)(dir, destination, {
        recursive: true,
        // Follow symlinks and copy their physical contents into the plugin tree.
        dereference: true
      });
    }
    const manifest = {
      name: safeName,
      displayName: (_a19 = options2.displayName) !== null && _a19 !== void 0 ? _a19 : pluginName,
      // Manifest component paths are POSIX-style ("/"-separated): discovery
      // resolves them as `${basePrefix}${path}/SKILL.md`. Build them with literal
      // forward slashes rather than `path.join`, which would emit `skills\<name>`
      // on Windows and break discovery.
      skills: placements.map(({ manifestPath: manifestPath2 }) => manifestPath2)
    };
    yield (0, import_promises37.writeFile)((0, import_node_path68.join)(pluginDir, "plugin.json"), JSON.stringify(manifest, null, 2), "utf-8");
    return pluginDir;
  });
}

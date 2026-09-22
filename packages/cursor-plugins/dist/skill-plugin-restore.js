/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/cursor-plugins/dist/skill-plugin-restore.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var import_promises36 = require("node:fs/promises");
var import_node_path67 = require("node:path");
var __awaiter62 = function(thisArg, _arguments, P2, generator) {
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
function restoreSkillsFromPluginDir(options2) {
  return __awaiter62(this, void 0, void 0, function* () {
    const { skillDirs, pluginSkillsRoot, skillsRoot } = options2;
    if (skillDirs.length === 0) {
      throw new Error("At least one skill directory is required");
    }
    const restores = skillDirs.map((skillDir2) => {
      const relativePath = (0, import_node_path67.relative)((0, import_node_path67.resolve)(pluginSkillsRoot), (0, import_node_path67.resolve)(skillDir2));
      if (relativePath === "" || (0, import_node_path67.isAbsolute)(relativePath) || relativePath.split(import_node_path67.sep)[0] === "..") {
        throw new Error(`Skill folder "${skillDir2}" is not inside the plugin's skills directory`);
      }
      return { skillDir: skillDir2, target: (0, import_node_path67.join)(skillsRoot, relativePath) };
    });
    const duplicates = restores.map(({ target }) => target).filter((target, index, targets) => targets.indexOf(target) !== index);
    if (duplicates.length > 0) {
      throw new Error(`Multiple skill folders would restore to the same path: ${duplicates.join(", ")}`);
    }
    for (const { skillDir: skillDir2, target } of restores) {
      if (!(yield isDirectory(skillDir2))) {
        throw new Error(`Skill folder "${skillDir2}" is not a directory`);
      }
      if (yield pathEntryExists(target)) {
        throw new Error(`Cannot restore skill to "${target}": that path already exists`);
      }
    }
    yield (0, import_promises36.mkdir)(skillsRoot, { recursive: true });
    for (const { skillDir: skillDir2, target } of restores) {
      yield (0, import_promises36.mkdir)((0, import_node_path67.dirname)(target), { recursive: true });
      yield (0, import_promises36.cp)(skillDir2, target, {
        recursive: true,
        force: false,
        errorOnExist: true
      });
    }
    return restores.map(({ target }) => target);
  });
}
function isDirectory(path31) {
  return __awaiter62(this, void 0, void 0, function* () {
    try {
      return (yield (0, import_promises36.stat)(path31)).isDirectory();
    } catch (_a19) {
      return false;
    }
  });
}
function pathEntryExists(path31) {
  return __awaiter62(this, void 0, void 0, function* () {
    try {
      yield (0, import_promises36.lstat)(path31);
      return true;
    } catch (_a19) {
      return false;
    }
  });
}


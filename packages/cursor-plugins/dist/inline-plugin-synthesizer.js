var import_promises31 = require("node:fs/promises");
var import_node_os13 = require("node:os");
var import_node_path59 = require("node:path");
init_dist2();
var __awaiter54 = function(thisArg, _arguments, P2, generator) {
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
function currentOperatingSystemName() {
  const currentPlatform = (0, import_node_os13.platform)();
  if (currentPlatform === "win32") {
    return "Windows";
  }
  if (currentPlatform === "darwin") {
    return "Macintosh";
  }
  return "Linux";
}
function appliesToCurrentOperatingSystem(hook) {
  if (!hook.operatingSystems || hook.operatingSystems.length === 0) {
    return true;
  }
  return hook.operatingSystems.includes(currentOperatingSystemName());
}
function synthesizeInlinePluginDir(options2) {
  return __awaiter54(this, void 0, void 0, function* () {
    var _a19, _b2;
    const { targetDir, inlineContentJson, pluginName } = options2;
    const content = JSON.parse(inlineContentJson);
    yield (0, import_promises31.mkdir)(targetDir, { recursive: true });
    const manifestPaths = {};
    if (content.rules && content.rules.length > 0) {
      const rulesDir = (0, import_node_path59.join)(targetDir, "rules");
      yield (0, import_promises31.mkdir)(rulesDir, { recursive: true });
      const rulePaths = [];
      for (const rule of content.rules) {
        if (!rule.content)
          continue;
        if (rule.isActive === false)
          continue;
        const fileName = `${sanitizeFilename(rule.name)}.md`;
        const frontmatterLines = [];
        frontmatterLines.push(`description: ${yamlQuote(rule.name)}`);
        if (rule.globs && rule.globs.length > 0) {
          frontmatterLines.push(`globs: ${yamlQuote(rule.globs.join(", "))}`);
        }
        frontmatterLines.push(`alwaysApply: ${rule.isRequired === true}`);
        const header = `---
${frontmatterLines.join("\n")}
---

`;
        yield (0, import_promises31.writeFile)((0, import_node_path59.join)(rulesDir, fileName), header + rule.content, "utf-8");
        rulePaths.push(`rules/${fileName}`);
      }
      if (rulePaths.length > 0) {
        manifestPaths.rules = rulePaths;
      }
    }
    if (content.commands && content.commands.length > 0) {
      const commandsDir = (0, import_node_path59.join)(targetDir, "commands");
      yield (0, import_promises31.mkdir)(commandsDir, { recursive: true });
      const commandPaths = [];
      for (const cmd of content.commands) {
        if (!cmd.content)
          continue;
        if (cmd.isActive === false)
          continue;
        const fileName = `${sanitizeFilename(cmd.name)}.md`;
        const header = cmd.description ? `---
description: ${yamlQuote(cmd.description)}
---

` : "";
        yield (0, import_promises31.writeFile)((0, import_node_path59.join)(commandsDir, fileName), header + cmd.content, "utf-8");
        commandPaths.push(`commands/${fileName}`);
      }
      if (commandPaths.length > 0) {
        manifestPaths.commands = commandPaths;
      }
    }
    if (content.hooks && content.hooks.length > 0) {
      const hooksDir = (0, import_node_path59.join)(targetDir, "hooks");
      yield (0, import_promises31.mkdir)(hooksDir, { recursive: true });
      const hooksConfig = {};
      for (const hook of content.hooks) {
        const step = hook.hookStep;
        if (!step)
          continue;
        if (hook.isActive === false)
          continue;
        if (!appliesToCurrentOperatingSystem(hook))
          continue;
        if (!hooksConfig[step]) {
          hooksConfig[step] = [];
        }
        if (hook.hookType === "prompt") {
          hooksConfig[step].push(Object.assign({ type: "prompt", prompt: (_a19 = hook.promptContent) !== null && _a19 !== void 0 ? _a19 : "" }, hook.promptModel ? { model: hook.promptModel } : {}));
        } else {
          hooksConfig[step].push({
            type: "command",
            command: (_b2 = hook.scriptContent) !== null && _b2 !== void 0 ? _b2 : ""
          });
        }
      }
      yield (0, import_promises31.writeFile)((0, import_node_path59.join)(hooksDir, "hooks.json"), JSON.stringify({ version: 1, hooks: hooksConfig }, null, 2), "utf-8");
    }
    if (content.mcpServers && content.mcpServers.length > 0) {
      const mcpConfig = {};
      for (const server of content.mcpServers) {
        if (server.config) {
          mcpConfig[server.name] = server.config;
        }
      }
      if (Object.keys(mcpConfig).length > 0) {
        yield (0, import_promises31.writeFile)((0, import_node_path59.join)(targetDir, ".mcp.json"), JSON.stringify({ mcpServers: mcpConfig }, null, 2), "utf-8");
      }
    }
    const manifest = Object.assign({ name: pluginName }, manifestPaths);
    const pluginJsonDir = (0, import_node_path59.join)(targetDir, ".cursor-plugin");
    yield (0, import_promises31.mkdir)(pluginJsonDir, { recursive: true });
    yield (0, import_promises31.writeFile)((0, import_node_path59.join)(pluginJsonDir, "plugin.json"), JSON.stringify(manifest, null, 2), "utf-8");
  });
}
function yamlQuote(value) {
  if (/[\n\r:#[\]{}&*!|>'"%@`]/.test(value) || value.startsWith(" ") || value.endsWith(" ")) {
    return `"${value.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
  }
  return value;
}

/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/cursor-config/dist/permissions-file-provider.js
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/2
var import_node_fs19 = require("node:fs");
var import_promises24 = require("node:fs/promises");
var import_node_path43 = require("node:path");

// @recovered-fragment 2/2
var __awaiter55 = function(thisArg, _arguments, P2, generator) {
  function adopt(value) {
    return value instanceof P2 ? value : new P2(function(resolve14) {
      resolve14(value);
    });
  }
  return new (P2 || (P2 = Promise))(function(resolve14, reject2) {
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
      result.done ? resolve14(result.value) : adopt(result.value).then(fulfilled, rejected3);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
function filterStrings2(arr) {
  if (!Array.isArray(arr))
    return [];
  return arr.filter((t) => typeof t === "string");
}
function getFieldCaseInsensitive(obj, key) {
  const lower = key.toLowerCase();
  for (const k2 of Object.keys(obj)) {
    if (k2.toLowerCase() === lower)
      return obj[k2];
  }
  return void 0;
}
var PermissionsFileProvider = class _PermissionsFileProvider {
  constructor(permissions, autoRunInstructions) {
    this.permissions = permissions;
    this.autoRunInstructions = autoRunInstructions;
  }
  static getPermissionsFilePath() {
    return (0, import_node_path43.join)(getConfigDir(), "permissions.json");
  }
  static load(filePath) {
    return __awaiter55(this, void 0, void 0, function* () {
      var _a20, _b2, _c2;
      const path30 = filePath !== null && filePath !== void 0 ? filePath : _PermissionsFileProvider.getPermissionsFilePath();
      if (!(0, import_node_fs19.existsSync)(path30)) {
        return void 0;
      }
      try {
        const raw = yield (0, import_promises24.readFile)(path30, "utf8");
        const parsed = parse5(raw);
        if (!parsed || typeof parsed !== "object") {
          return void 0;
        }
        const mcpEntries = filterStrings2(getFieldCaseInsensitive(parsed, "mcpAllowlist"));
        const terminalEntries = filterStrings2(getFieldCaseInsensitive(parsed, "terminalAllowlist"));
        const autoRunConfig = (_a20 = getFieldCaseInsensitive(parsed, "autoReview")) !== null && _a20 !== void 0 ? _a20 : getFieldCaseInsensitive(parsed, "autoRun");
        const autoRun = parsePermissionsAutoRunConfig(autoRunConfig);
        const autoRunInstructions = {
          allowInstructions: (_b2 = autoRun === null || autoRun === void 0 ? void 0 : autoRun.allowInstructions) !== null && _b2 !== void 0 ? _b2 : [],
          blockInstructions: (_c2 = autoRun === null || autoRun === void 0 ? void 0 : autoRun.blockInstructions) !== null && _c2 !== void 0 ? _c2 : []
        };
        if (mcpEntries.length === 0 && terminalEntries.length === 0 && autoRunInstructions.allowInstructions.length === 0 && autoRunInstructions.blockInstructions.length === 0) {
          return void 0;
        }
        const allow = [
          ...terminalEntries.map((cmd) => `Shell(${cmd})`),
          ...mcpEntries.map((entry) => `Mcp(${entry})`)
        ];
        return new _PermissionsFileProvider({ allow, deny: [] }, autoRunInstructions);
      } catch (_d) {
        return void 0;
      }
    });
  }
  getPermissions() {
    return __awaiter55(this, void 0, void 0, function* () {
      return {
        allow: this.permissions.allow,
        deny: this.permissions.deny,
        approvalMode: "unrestricted",
        userConfiguredPolicy: { type: "insecure_none" }
      };
    });
  }
  getAutoRunInstructions() {
    return {
      allowInstructions: [...this.autoRunInstructions.allowInstructions],
      blockInstructions: [...this.autoRunInstructions.blockInstructions]
    };
  }
  updatePermissions(transformer) {
    return __awaiter55(this, void 0, void 0, function* () {
      void transformer;
    });
  }
};


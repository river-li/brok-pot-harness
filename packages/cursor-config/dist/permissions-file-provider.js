var __awaiter66 = function(thisArg, _arguments, P2, generator) {
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
    return (0, import_node_path69.join)(getConfigDir(), "permissions.json");
  }
  static load(filePath) {
    return __awaiter66(this, void 0, void 0, function* () {
      var _a19, _b2, _c2;
      const path31 = filePath !== null && filePath !== void 0 ? filePath : _PermissionsFileProvider.getPermissionsFilePath();
      if (!(0, import_node_fs43.existsSync)(path31)) {
        return void 0;
      }
      try {
        const raw = yield (0, import_promises41.readFile)(path31, "utf8");
        const parsed2 = parse9(raw);
        if (!parsed2 || typeof parsed2 !== "object") {
          return void 0;
        }
        const mcpEntries = filterStrings2(getFieldCaseInsensitive(parsed2, "mcpAllowlist"));
        const terminalEntries = filterStrings2(getFieldCaseInsensitive(parsed2, "terminalAllowlist"));
        const autoRunConfig = (_a19 = getFieldCaseInsensitive(parsed2, "autoReview")) !== null && _a19 !== void 0 ? _a19 : getFieldCaseInsensitive(parsed2, "autoRun");
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
    return __awaiter66(this, void 0, void 0, function* () {
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
    return __awaiter66(this, void 0, void 0, function* () {
      void transformer;
    });
  }
};

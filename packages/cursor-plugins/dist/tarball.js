var import_promises35 = require("node:fs/promises");
var import_node_os16 = require("node:os");
var import_node_path66 = require("node:path");
var __awaiter59 = function(thisArg, _arguments, P2, generator) {
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
function packPluginArtifact(dirPath) {
  return __awaiter59(this, void 0, void 0, function* () {
    const archivePath = (0, import_node_path66.join)(yield (0, import_promises35.mkdtemp)((0, import_node_path66.join)((0, import_node_os16.tmpdir)(), "cursor-plugin-artifact-")), "plugin.tgz");
    try {
      const entries = yield (0, import_promises35.readdir)(dirPath);
      yield Qn({
        cwd: dirPath,
        file: archivePath,
        gzip: true,
        portable: true,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        filter: (_path, stat28) => {
          var _a19;
          return !((_a19 = stat28.isSymbolicLink) === null || _a19 === void 0 ? void 0 : _a19.call(stat28));
        }
      }, entries);
      return yield (0, import_promises35.readFile)(archivePath);
    } finally {
      yield (0, import_promises35.rm)((0, import_node_path66.dirname)(archivePath), { recursive: true, force: true }).catch(() => {
      });
    }
  });
}

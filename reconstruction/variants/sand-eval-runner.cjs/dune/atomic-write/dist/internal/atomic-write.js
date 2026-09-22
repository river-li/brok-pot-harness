/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../dune/atomic-write/dist/internal/atomic-write.js
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var import_node_fs22 = require("node:fs");
var import_node_path57 = require("node:path");
var import_write_file_atomic = __toESM(require_lib4(), 1);
var __awaiter56 = function(thisArg, _arguments, P2, generator) {
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
function writeFileAtomic(path_1, data_1) {
  return __awaiter56(this, arguments, void 0, function* (path30, data, options2 = {}) {
    createParentsKeepingCallOrder(path30);
    yield (0, import_write_file_atomic.default)(path30, toLibraryData(data), freshLibraryOptions(options2));
  });
}
function createParentsKeepingCallOrder(path30) {
  (0, import_node_fs22.mkdirSync)((0, import_node_path57.dirname)(path30), { recursive: true });
}
function toLibraryData(data) {
  return typeof data === "string" ? data : Buffer.from(data.buffer, data.byteOffset, data.byteLength);
}
function freshLibraryOptions(options2) {
  return {
    mode: options2.mode,
    chown: false
  };
}


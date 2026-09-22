/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/git-core/dist/git-exec.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/2
var import_node_child_process5 = require("node:child_process");
var import_node_util2 = require("node:util");

// @recovered-fragment 2/2
var __awaiter52 = function(thisArg, _arguments, P2, generator) {
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
var __rest4 = function(s3, e) {
  var t = {};
  for (var p2 in s3) if (Object.prototype.hasOwnProperty.call(s3, p2) && e.indexOf(p2) < 0)
    t[p2] = s3[p2];
  if (s3 != null && typeof Object.getOwnPropertySymbols === "function")
    for (var i = 0, p2 = Object.getOwnPropertySymbols(s3); i < p2.length; i++) {
      if (e.indexOf(p2[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s3, p2[i]))
        t[p2[i]] = s3[p2[i]];
    }
  return t;
};
var execFileAsync = (0, import_node_util2.promisify)(import_node_child_process5.execFile);
function gitSubcommand(args) {
  const optionsWithValue = /* @__PURE__ */ new Set(["-c", "-C", "--git-dir", "--work-tree"]);
  for (let index = 0; index < args.length; index++) {
    const arg = args[index];
    if (optionsWithValue.has(arg)) {
      index++;
      continue;
    }
    if (arg.startsWith("-")) {
      continue;
    }
    return arg;
  }
  return void 0;
}
function withGitEnv(args, env) {
  return createGitProcessEnv({
    command: gitSubcommand(args),
    optionsEnv: env
  });
}
function gitExecFile(file2, args, options2) {
  return __awaiter52(this, void 0, void 0, function* () {
    const _a19 = options2 !== null && options2 !== void 0 ? options2 : {}, { env, encoding = "utf8" } = _a19, rest = __rest4(_a19, ["env", "encoding"]);
    const result = yield execFileAsync(file2, args, Object.assign(Object.assign({}, rest), { encoding, env: withGitEnv(args, env) }));
    return {
      stdout: String(result.stdout),
      stderr: String(result.stderr)
    };
  });
}


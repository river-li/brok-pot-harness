var __awaiter33 = function(thisArg, _arguments, P2, generator) {
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
var __await11 = function(v2) {
  return this instanceof __await11 ? (this.v = v2, this) : new __await11(v2);
};
var __asyncGenerator11 = function(thisArg, _arguments, generator) {
  if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
  var g2 = generator.apply(thisArg, _arguments || []), i, q2 = [];
  return i = Object.create((typeof AsyncIterator === "function" ? AsyncIterator : Object).prototype), verb("next"), verb("throw"), verb("return", awaitReturn), i[Symbol.asyncIterator] = function() {
    return this;
  }, i;
  function awaitReturn(f2) {
    return function(v2) {
      return Promise.resolve(v2).then(f2, reject2);
    };
  }
  function verb(n, f2) {
    if (g2[n]) {
      i[n] = function(v2) {
        return new Promise(function(a, b2) {
          q2.push([n, v2, a, b2]) > 1 || resume(n, v2);
        });
      };
      if (f2) i[n] = f2(i[n]);
    }
  }
  function resume(n, v2) {
    try {
      step(g2[n](v2));
    } catch (e) {
      settle(q2[0][3], e);
    }
  }
  function step(r) {
    r.value instanceof __await11 ? Promise.resolve(r.value.v).then(fulfill, reject2) : settle(q2[0][2], r);
  }
  function fulfill(value) {
    resume("next", value);
  }
  function reject2(value) {
    resume("throw", value);
  }
  function settle(f2, v2) {
    if (f2(v2), q2.shift(), q2.length) resume(q2[0][0], q2[0][1]);
  }
};
var READONLY_WRITE_ERROR_MESSAGE = "This operation is not allowed in readonly mode. The subagent was launched with readonly: true, which restricts write operations.";
function createReadonlyShellPermissionDenied(errorMessage6, args) {
  var _a19, _b2;
  return new ShellPermissionDenied({
    command: (_a19 = args.command) !== null && _a19 !== void 0 ? _a19 : "",
    workingDirectory: (_b2 = args.workingDirectory) !== null && _b2 !== void 0 ? _b2 : "",
    error: errorMessage6,
    isReadonly: true
  });
}
function createReadonlyShellExecutor(errorMessage6) {
  return {
    execute(_ctx, args) {
      return __awaiter33(this, void 0, void 0, function* () {
        return new ShellResult({
          result: {
            case: "permissionDenied",
            value: createReadonlyShellPermissionDenied(errorMessage6, args)
          }
        });
      });
    }
  };
}
function createReadonlyShellStreamExecutor(errorMessage6) {
  return {
    execute(_ctx, args) {
      return __asyncGenerator11(this, arguments, function* execute_1() {
        yield yield __await11(new ShellStream({
          event: {
            case: "permissionDenied",
            value: createReadonlyShellPermissionDenied(errorMessage6, args)
          }
        }));
      });
    }
  };
}
function createReadonlyBackgroundShellExecutor(errorMessage6) {
  return {
    execute(_ctx, args) {
      return __awaiter33(this, void 0, void 0, function* () {
        return new BackgroundShellSpawnResult({
          result: {
            case: "permissionDenied",
            value: createReadonlyShellPermissionDenied(errorMessage6, args)
          }
        });
      });
    }
  };
}
function createReadonlyWriteExecutor(errorMessage6) {
  return {
    execute(_ctx, args) {
      return __awaiter33(this, void 0, void 0, function* () {
        return new WriteResult({
          result: {
            case: "permissionDenied",
            value: new WritePermissionDenied({
              path: args.path,
              error: errorMessage6,
              isReadonly: true
            })
          }
        });
      });
    }
  };
}
function createReadonlyDeleteExecutor(errorMessage6) {
  return {
    execute(_ctx, args) {
      return __awaiter33(this, void 0, void 0, function* () {
        return new DeleteResult({
          result: {
            case: "permissionDenied",
            value: new DeletePermissionDenied({
              path: args.path,
              clientVisibleError: errorMessage6,
              isReadonly: true
            })
          }
        });
      });
    }
  };
}
function createReadonlyMcpExecutor(errorMessage6) {
  return {
    execute(_ctx, args) {
      return __awaiter33(this, void 0, void 0, function* () {
        return new McpResult({
          result: {
            case: "permissionDenied",
            value: new McpPermissionDenied({
              error: `${errorMessage6} Tool: ${args.name}`,
              isReadonly: true
            })
          }
        });
      });
    }
  };
}
function createReadonlyWriteBackgroundShellStdinExecutor(errorMessage6) {
  return {
    execute(_ctx, _args) {
      return __awaiter33(this, void 0, void 0, function* () {
        return new WriteShellStdinResult({
          result: {
            case: "error",
            value: new WriteShellStdinError({
              error: errorMessage6
            })
          }
        });
      });
    }
  };
}
function buildReadonlyResourceEntries(args) {
  const localEntries = [
    [
      writeExecutorResource,
      createReadonlyWriteExecutor(args.errorMessage)
    ],
    [
      deleteExecutorResource,
      createReadonlyDeleteExecutor(args.errorMessage)
    ],
    [mcpExecutorResource, createReadonlyMcpExecutor(args.errorMessage)]
  ];
  if (args.wrapShell) {
    localEntries.push([
      shellExecutorResource,
      createReadonlyShellExecutor(args.errorMessage)
    ], [
      shellStreamExecutorResource,
      createReadonlyShellStreamExecutor(args.errorMessage)
    ], [
      backgroundShellExecutorResource,
      createReadonlyBackgroundShellExecutor(args.errorMessage)
    ]);
  }
  if (args.includeWriteBackgroundShellStdin) {
    localEntries.push([
      writeBackgroundShellInputExecutorResource,
      createReadonlyWriteBackgroundShellStdinExecutor(args.errorMessage)
    ]);
  }
  return localEntries;
}
function createReadonlyResourceAccessor(baseAccessor, wrapShell) {
  return new CombinedResourceAccessor(baseAccessor, buildReadonlyResourceEntries({
    errorMessage: READONLY_WRITE_ERROR_MESSAGE,
    wrapShell,
    includeWriteBackgroundShellStdin: false
  }));
}

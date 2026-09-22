var import_node_crypto2 = require("node:crypto");
var fs7 = __toESM(require("node:fs"), 1);
var path8 = __toESM(require("node:path"), 1);
var __awaiter7 = function(thisArg, _arguments, P2, generator) {
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
var AGENT_STORE_PATH_SYNC_REQUESTS_DIR_NAME = "path-sync-requests";
var PATH_SYNC_REQUEST_STALE_MS = 6e4;
var PATH_SYNC_REQUEST_POLL_MS = 250;
var PATH_SYNC_REQUEST_WAIT_POLL_MS = 50;
var PRIVATE_FILE_MODE3 = 384;
var REQUEST_VERSION = 1;
function pathSyncRequestsDirForFilesDir(filesDir) {
  return path8.join(path8.dirname(path8.resolve(filesDir)), AGENT_STORE_SYNC_DIR_NAME, AGENT_STORE_PATH_SYNC_REQUESTS_DIR_NAME);
}
function requestPath(dir, id) {
  return path8.join(dir, `${id}.json`);
}
function tryNormalizeRelPaths(relPaths) {
  const out = [];
  const seen = /* @__PURE__ */ new Set();
  for (const raw of relPaths) {
    let canonical;
    try {
      canonical = normalizeRelPath(raw);
    } catch (_a19) {
      return void 0;
    }
    if (seen.has(canonical)) {
      continue;
    }
    seen.add(canonical);
    out.push(canonical);
  }
  return out;
}
function enqueuePathSyncRequest(args) {
  return __awaiter7(this, void 0, void 0, function* () {
    var _a19;
    const relPaths = tryNormalizeRelPaths(args.relPaths);
    if (relPaths === void 0 || relPaths.length === 0) {
      return void 0;
    }
    const dir = pathSyncRequestsDirForFilesDir(args.filesDir);
    try {
      ensureSecureDirectoryChain(dir);
    } catch (_b2) {
      return void 0;
    }
    const id = (0, import_node_crypto2.randomBytes)(16).toString("hex");
    const body = {
      v: REQUEST_VERSION,
      id,
      relPaths,
      createdAtMs: ((_a19 = args.now) !== null && _a19 !== void 0 ? _a19 : Date.now)()
    };
    const target = requestPath(dir, id);
    try {
      yield writeLockFileExclusive(target, `${JSON.stringify(body)}
`, PRIVATE_FILE_MODE3);
    } catch (_c2) {
      return void 0;
    }
    return id;
  });
}
function parseRequest(raw) {
  let parsed2;
  try {
    parsed2 = JSON.parse(raw);
  } catch (_a19) {
    return void 0;
  }
  if (typeof parsed2 !== "object" || parsed2 === null) {
    return void 0;
  }
  const record2 = parsed2;
  if (record2.v !== REQUEST_VERSION) {
    return void 0;
  }
  if (typeof record2.id !== "string" || record2.id.length === 0) {
    return void 0;
  }
  if (!Array.isArray(record2.relPaths)) {
    return void 0;
  }
  if (typeof record2.createdAtMs !== "number" || !Number.isFinite(record2.createdAtMs)) {
    return void 0;
  }
  const relPaths = tryNormalizeRelPaths(record2.relPaths.filter((p2) => typeof p2 === "string"));
  if (relPaths === void 0 || relPaths.length === 0) {
    return void 0;
  }
  return {
    v: REQUEST_VERSION,
    id: record2.id,
    relPaths,
    createdAtMs: record2.createdAtMs
  };
}
function listPathSyncRequests(args) {
  var _a19, _b2;
  const dir = pathSyncRequestsDirForFilesDir(args.filesDir);
  let names3;
  try {
    names3 = fs7.readdirSync(dir);
  } catch (_c2) {
    return [];
  }
  const now = ((_a19 = args.now) !== null && _a19 !== void 0 ? _a19 : Date.now)();
  const staleMs = (_b2 = args.staleMs) !== null && _b2 !== void 0 ? _b2 : PATH_SYNC_REQUEST_STALE_MS;
  const out = [];
  for (const name17 of names3) {
    if (!name17.endsWith(".json")) {
      continue;
    }
    const full = path8.join(dir, name17);
    let stat28;
    try {
      stat28 = fs7.lstatSync(full);
    } catch (_d) {
      continue;
    }
    if (stat28.isSymbolicLink() || !stat28.isFile()) {
      try {
        fs7.unlinkSync(full);
      } catch (_e2) {
      }
      continue;
    }
    let raw;
    try {
      raw = fs7.readFileSync(full, "utf8");
    } catch (_f) {
      continue;
    }
    const request5 = parseRequest(raw);
    if (request5 === void 0) {
      try {
        fs7.unlinkSync(full);
      } catch (_g) {
      }
      continue;
    }
    if (now - request5.createdAtMs > staleMs) {
      try {
        fs7.unlinkSync(full);
      } catch (_h) {
      }
      continue;
    }
    out.push(request5);
  }
  return out;
}
function inspectPathSyncRequest(args) {
  var _a19, _b2;
  const dir = pathSyncRequestsDirForFilesDir(args.filesDir);
  const full = requestPath(dir, args.requestId);
  let stat28;
  try {
    stat28 = fs7.lstatSync(full);
  } catch (error42) {
    if (typeof error42 === "object" && error42 !== null && "code" in error42 && error42.code === "ENOENT") {
      return "acked";
    }
    return "pending";
  }
  if (stat28.isSymbolicLink() || !stat28.isFile()) {
    try {
      fs7.unlinkSync(full);
    } catch (_c2) {
    }
    return "stale";
  }
  let raw;
  try {
    raw = fs7.readFileSync(full, "utf8");
  } catch (_d) {
    return "pending";
  }
  const request5 = parseRequest(raw);
  if (request5 === void 0) {
    try {
      fs7.unlinkSync(full);
    } catch (_e2) {
    }
    return "stale";
  }
  const now = ((_a19 = args.now) !== null && _a19 !== void 0 ? _a19 : Date.now)();
  const staleMs = (_b2 = args.staleMs) !== null && _b2 !== void 0 ? _b2 : PATH_SYNC_REQUEST_STALE_MS;
  if (now - request5.createdAtMs > staleMs) {
    try {
      fs7.unlinkSync(full);
    } catch (_f) {
    }
    return "stale";
  }
  return "pending";
}
function ackPathSyncRequests(args) {
  const dir = pathSyncRequestsDirForFilesDir(args.filesDir);
  for (const id of args.requestIds) {
    if (!/^[0-9a-f]+$/i.test(id)) {
      continue;
    }
    try {
      fs7.unlinkSync(requestPath(dir, id));
    } catch (_a19) {
    }
  }
}
function waitForPathSyncRequestAck(args) {
  return __awaiter7(this, void 0, void 0, function* () {
    var _a19;
    var _b2, _c2;
    const pollMs = (_b2 = args.pollMs) !== null && _b2 !== void 0 ? _b2 : PATH_SYNC_REQUEST_WAIT_POLL_MS;
    const delay5 = (_c2 = args.delay) !== null && _c2 !== void 0 ? _c2 : ((ms2) => new Promise((resolve29) => setTimeout(resolve29, ms2)));
    for (; ; ) {
      const presence = inspectPathSyncRequest(args);
      if (presence === "acked") {
        return "acked";
      }
      if (presence === "stale") {
        return "stale";
      }
      if (((_a19 = args.shouldAbort) === null || _a19 === void 0 ? void 0 : _a19.call(args)) === true) {
        return "aborted";
      }
      yield delay5(pollMs);
    }
  });
}

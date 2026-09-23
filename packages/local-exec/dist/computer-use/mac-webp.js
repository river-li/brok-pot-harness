var import_node_fs41 = require("node:fs");
var NodeModuleNs = __toESM(require("node:module"), 1);
var import_node_path61 = require("node:path");
var import_node_url7 = require("node:url");
var MAC_WEBP_RUNTIME_HELPER = "mac-webp-runtime.cjs";
function getCreateRequire() {
  const ns2 = NodeModuleNs;
  const createRequire = ns2.createRequire ?? ns2.default?.createRequire;
  if (typeof createRequire !== "function") {
    throw new Error("node:module createRequire is unavailable");
  }
  return createRequire;
}
var createCurrentModuleRequire = () => {
  const originalPrepareStackTrace = Error.prepareStackTrace;
  try {
    Error.prepareStackTrace = (_2, callSites) => callSites;
    const stack = new Error().stack;
    const currentModuleUrl = Array.isArray(stack) ? stack[0]?.getFileName() : void 0;
    return getCreateRequire()(typeof currentModuleUrl === "string" && currentModuleUrl.length > 0 ? currentModuleUrl : (0, import_node_path61.join)(process.cwd(), "package.json"));
  } finally {
    Error.prepareStackTrace = originalPrepareStackTrace;
  }
};
var nodeRequire;
function getNodeRequire() {
  nodeRequire ??= createCurrentModuleRequire();
  return nodeRequire;
}
function resolveFilename(id) {
  return getNodeRequire().resolve(id);
}
var MAC_WEBP_IMPORT_HOOK = "__MAC_WEBP_IMPORT__";
function stackFileNames() {
  const originalPrepareStackTrace = Error.prepareStackTrace;
  try {
    Error.prepareStackTrace = (_2, callSites) => callSites;
    const stack = new Error().stack;
    if (!Array.isArray(stack)) {
      return [];
    }
    const names3 = [];
    for (const site of stack) {
      const fileName = site.getFileName();
      if (typeof fileName === "string" && fileName.length > 0) {
        names3.push(fileName);
      }
    }
    return names3;
  } finally {
    Error.prepareStackTrace = originalPrepareStackTrace;
  }
}
function fileNameToPath(fileName) {
  return fileName.startsWith("file:") ? (0, import_node_url7.fileURLToPath)(fileName) : fileName;
}
function loadRuntimeImporter() {
  const candidates = [];
  const seen = /* @__PURE__ */ new Set();
  const add2 = (helperPath) => {
    if (!seen.has(helperPath)) {
      seen.add(helperPath);
      candidates.push(helperPath);
    }
  };
  for (const moduleFile of stackFileNames()) {
    const dir = (0, import_node_path61.dirname)(fileNameToPath(moduleFile));
    add2((0, import_node_path61.join)(dir, MAC_WEBP_RUNTIME_HELPER));
    add2((0, import_node_path61.join)(dir, "..", "..", "src", "computer-use", MAC_WEBP_RUNTIME_HELPER));
  }
  if (typeof process.argv[1] === "string" && process.argv[1].length > 0) {
    add2((0, import_node_path61.join)((0, import_node_path61.dirname)(process.argv[1]), MAC_WEBP_RUNTIME_HELPER));
  }
  add2((0, import_node_path61.join)(process.cwd(), "src", "computer-use", MAC_WEBP_RUNTIME_HELPER));
  add2((0, import_node_path61.join)(process.cwd(), "computer-use", MAC_WEBP_RUNTIME_HELPER));
  try {
    const packageRoot = (0, import_node_path61.dirname)(getNodeRequire().resolve("@anysphere/local-exec/package.json"));
    add2((0, import_node_path61.join)(packageRoot, "src", "computer-use", MAC_WEBP_RUNTIME_HELPER));
    add2((0, import_node_path61.join)(packageRoot, "dist", "computer-use", MAC_WEBP_RUNTIME_HELPER));
  } catch {
  }
  for (const helperPath of candidates) {
    try {
      const loaded = getNodeRequire()(helperPath);
      if (typeof loaded.importFile === "function") {
        return loaded.importFile.bind(loaded);
      }
    } catch {
    }
  }
  throw new Error("mac-webp runtime importer was not found next to the bundle");
}
var runtimeImporter;
function resolveRuntimeImporter() {
  const injected = globalThis[MAC_WEBP_IMPORT_HOOK];
  if (typeof injected === "function") {
    return injected;
  }
  runtimeImporter ??= loadRuntimeImporter();
  return runtimeImporter;
}
function importSpecifier(specifier) {
  return resolveRuntimeImporter()(specifier);
}
function resolveJsquashFile(...parts) {
  return resolveFilename(["@jsquash", "webp", ...parts].join("/"));
}
async function importJsquash(...parts) {
  return await importSpecifier((0, import_node_url7.pathToFileURL)(resolveJsquashFile(...parts)).href);
}
var memoizedAsync = (factory) => {
  let pending;
  return () => {
    if (pending === void 0) {
      const next = factory();
      next.catch(() => {
        if (pending === next) {
          pending = void 0;
        }
      });
      pending = next;
    }
    return pending;
  };
};
var loadDecoder = memoizedAsync(async () => {
  const mod = await importJsquash("decode.js");
  await mod.init({
    wasmBinary: await import_node_fs41.promises.readFile(resolveJsquashFile("codec", "dec", "webp_dec.wasm"))
  });
  return mod;
});
var loadEncoder = memoizedAsync(async () => {
  const [utils2, meta, enc] = await Promise.all([
    importJsquash("utils.js"),
    importJsquash("meta.js"),
    importJsquash("codec", "enc", "webp_enc.js")
  ]);
  const module2 = await utils2.initEmscriptenModule(enc.default, void 0, {
    wasmBinary: await import_node_fs41.promises.readFile(resolveJsquashFile("codec", "enc", "webp_enc.wasm"))
  });
  return { module: module2, defaultOptions: meta.defaultOptions };
});
var encodeJsquashWebp = async (bitmap, options2) => {
  const { module: module2, defaultOptions: defaultOptions2 } = await loadEncoder();
  const rgba = new Uint8ClampedArray(bitmap.data.buffer, bitmap.data.byteOffset, bitmap.data.byteLength);
  return Buffer.from(module2.encode(rgba, bitmap.width, bitmap.height, { ...defaultOptions2, ...options2 }));
};
var encodeMacLosslessWebp = (bitmap) => encodeJsquashWebp(bitmap, { lossless: 1, exact: 1 });

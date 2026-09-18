var import_node_path10 = require("node:path");
init_errors();
init_system_errno();
init_invariant();
var SAND_BOX_UPLOADS_DIR = "/workspace/uploads";
var SAND_BOX_WORKSPACE_ROOT = "/workspace";
var BOX_PATH_ROOTS = ["/workspace", "/home", "/root"];
function isBoxRootPath(path31) {
  return BOX_PATH_ROOTS.some((root) => path31 === root || path31.startsWith(`${root}/`));
}
function resolveBoxWorkspacePath(boxPath) {
  return import_node_path10.posix.isAbsolute(boxPath) ? import_node_path10.posix.normalize(boxPath) : import_node_path10.posix.join(SAND_BOX_WORKSPACE_ROOT, boxPath);
}
var BoxTransferError = class extends Error {
  constructor(message, options2) {
    super(message, options2);
    this.name = "BoxTransferError";
  }
};
var BoxFileUnreadableError = class extends Error {
};
var BoxFileTooLargeError = class extends Error {
};
var DEFAULT_BOX_TRANSFER_MAX_BYTES = 256 * 1024 * 1024;
function isSourceMissingError(error41) {
  if (error41 instanceof BoxFileUnreadableError) return true;
  if (findSystemErrno(error41) === "ENOENT") return true;
  const message = error41 instanceof Error ? error41.message.toLowerCase() : "";
  return message.includes("no such file or directory") || message.includes("enoent");
}
async function transferFileBetweenBoxes(ctx, args) {
  const { source, dest } = args;
  const maxBytes = args.maxBytes ?? DEFAULT_BOX_TRANSFER_MAX_BYTES;
  let data;
  try {
    data = await source.box.downloadFile(ctx, source.agentId, source.path);
  } catch (error41) {
    if (isSourceMissingError(error41)) {
      throw new BoxTransferError(`source file not found on ${source.label}: ${source.path}`, {
        cause: error41
      });
    }
    throw new BoxTransferError(
      `failed to read ${source.path} from ${source.label}: ${errorMessage(error41)}`,
      { cause: error41 }
    );
  }
  if (data.byteLength > maxBytes) {
    throw new BoxTransferError(
      `file is too large to transfer: ${source.path} on ${source.label} is ${data.byteLength} bytes, over the ${maxBytes}-byte limit`
    );
  }
  try {
    await dest.box.uploadFile(ctx, dest.agentId, dest.path, data);
  } catch (error41) {
    throw new BoxTransferError(
      `failed to write ${dest.path} on ${dest.label}: ${errorMessage(error41)}`,
      { cause: error41 }
    );
  }
  return data.byteLength;
}
var DEFAULT_BOX_TRANSFER_CONCURRENCY = 4;
async function forEachBounded(items, limit, fn) {
  const bound = Math.max(1, limit);
  let cursor = 0;
  let isAborted2 = false;
  async function worker() {
    while (cursor < items.length && !isAborted2) {
      const item = items[cursor++];
      try {
        await fn(item);
      } catch (error41) {
        isAborted2 = true;
        throw error41;
      }
    }
  }
  await Promise.all(Array.from({ length: Math.min(bound, items.length) }, worker));
}
async function forEachWavePipelined(items, opts) {
  const waveSize = Math.max(1, opts.waveSize);
  const concurrency = Math.max(1, opts.concurrency);
  const queue = [];
  let nextWaveStart = 0;
  let prepareInFlight;
  let failure2;
  let failed2 = false;
  let wakeWaiters = [];
  const wakeAll = () => {
    const waiters = wakeWaiters;
    wakeWaiters = [];
    for (const wake of waiters) wake();
  };
  const beginPrepareIfNeeded = () => {
    if (failed2 || prepareInFlight != null) return;
    if (nextWaveStart >= items.length) return;
    if (queue.length >= waveSize) return;
    const wave = items.slice(nextWaveStart, nextWaveStart + waveSize);
    nextWaveStart += waveSize;
    prepareInFlight = opts.prepareWave(wave).then((work) => {
      queue.push(...work);
    }).catch((error41) => {
      failed2 = true;
      failure2 ??= error41;
    }).finally(() => {
      prepareInFlight = void 0;
      beginPrepareIfNeeded();
      wakeAll();
    });
  };
  const worker = async () => {
    for (; ; ) {
      if (failed2) return;
      if (queue.length > 0) {
        const [work] = queue.splice(0, 1);
        beginPrepareIfNeeded();
        try {
          await opts.process(work);
        } catch (error41) {
          failed2 = true;
          failure2 ??= error41;
          wakeAll();
          return;
        }
        continue;
      }
      if (prepareInFlight == null && nextWaveStart >= items.length) return;
      beginPrepareIfNeeded();
      if (queue.length > 0) continue;
      if (prepareInFlight == null && nextWaveStart >= items.length) return;
      await new Promise((resolve29) => wakeWaiters.push(resolve29));
    }
  };
  beginPrepareIfNeeded();
  await Promise.all(Array.from({ length: concurrency }, worker));
  if (failed2) throw failure2;
}
async function downloadBoxFiles(ctx, box, agentId, boxPaths, opts) {
  const uniquePaths = [...new Set(boxPaths)];
  const downloaded = /* @__PURE__ */ new Map();
  await forEachBounded(
    uniquePaths,
    opts?.maxConcurrency ?? DEFAULT_BOX_TRANSFER_CONCURRENCY,
    async (boxPath) => {
      downloaded.set(boxPath, await box.downloadFile(ctx, agentId, boxPath));
    }
  );
  return new Map(
    uniquePaths.map((boxPath) => {
      const bytes = downloaded.get(boxPath);
      invariant(bytes !== void 0, () => `download from box ${boxPath} produced no bytes`);
      return [boxPath, bytes];
    })
  );
}

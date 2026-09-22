/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/grok-bot-harness/src/box/box-transfer.ts
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var import_node_path55 = require("node:path");
var SAND_BOX_UPLOADS_DIR = "/workspace/uploads";
var SAND_BOX_WORKSPACE_ROOT = "/workspace";
var BOX_PATH_ROOTS = ["/workspace", "/home", "/root"];
function isBoxRootPath(path30) {
  return BOX_PATH_ROOTS.some((root) => path30 === root || path30.startsWith(`${root}/`));
}
function resolveBoxWorkspacePath(boxPath) {
  return import_node_path55.posix.isAbsolute(boxPath) ? import_node_path55.posix.normalize(boxPath) : import_node_path55.posix.join(SAND_BOX_WORKSPACE_ROOT, boxPath);
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
function isSourceMissingError(error3) {
  if (error3 instanceof BoxFileUnreadableError) return true;
  if (findSystemErrno(error3) === "ENOENT") return true;
  const message = error3 instanceof Error ? error3.message.toLowerCase() : "";
  return message.includes("no such file or directory") || message.includes("enoent");
}
async function transferFileBetweenBoxes(ctx, args) {
  const { source, dest } = args;
  const maxBytes = args.maxBytes ?? DEFAULT_BOX_TRANSFER_MAX_BYTES;
  let data;
  try {
    data = await source.box.downloadFile(ctx, source.agentId, source.path);
  } catch (error3) {
    if (isSourceMissingError(error3)) {
      throw new BoxTransferError(`source file not found on ${source.label}: ${source.path}`, {
        cause: error3
      });
    }
    throw new BoxTransferError(
      `failed to read ${source.path} from ${source.label}: ${errorMessage(error3)}`,
      { cause: error3 }
    );
  }
  if (data.byteLength > maxBytes) {
    throw new BoxTransferError(
      `file is too large to transfer: ${source.path} on ${source.label} is ${data.byteLength} bytes, over the ${maxBytes}-byte limit`
    );
  }
  try {
    await dest.box.uploadFile(ctx, dest.agentId, dest.path, data);
  } catch (error3) {
    throw new BoxTransferError(
      `failed to write ${dest.path} on ${dest.label}: ${errorMessage(error3)}`,
      { cause: error3 }
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
      } catch (error3) {
        isAborted2 = true;
        throw error3;
      }
    }
  }
  await Promise.all(Array.from({ length: Math.min(bound, items.length) }, worker));
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


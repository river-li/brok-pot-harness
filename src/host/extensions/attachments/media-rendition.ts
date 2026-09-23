var import_node_child_process10 = require("node:child_process");
var import_node_crypto38 = require("node:crypto");
var import_node_fs50 = require("node:fs");
var import_node_os22 = require("node:os");
var import_node_path91 = require("node:path");
init_dist3();
init_errors();
init_system_errno();
var MEDIA_TOOL_TIMEOUT_MS = 2 * 60 * 1e3;
var MEDIA_TOOL_MAX_OUTPUT_BYTES = 4 * 1024 * 1024;
var TRANSCODE_CONCURRENCY = 2;
var FAILED_RESOLUTION_RETRY_MS = 30 * 1e3;
function runMediaTool(tool, args) {
  return new Promise((resolve29, reject2) => {
    (0, import_node_child_process10.execFile)(
      tool,
      [...args],
      {
        encoding: "utf8",
        maxBuffer: MEDIA_TOOL_MAX_OUTPUT_BYTES,
        timeout: MEDIA_TOOL_TIMEOUT_MS
      },
      (error42, stdout) => {
        if (error42 != null) {
          reject2(error42);
          return;
        }
        resolve29(stdout);
      }
    );
  });
}
function stepFor(medium, reportFailure) {
  return {
    attempt: (stage, operation, isExpected = () => false) => operation().then(
      (value) => value,
      (error42) => {
        if (!isExpected(error42)) {
          reportFailure({ medium, stage, errorClass: errorLogTag(error42) });
        }
        return null;
      }
    ),
    run: runMediaTool
  };
}
function isMissingPath(error42) {
  return findSystemErrno(error42) === "ENOENT";
}
async function hasRendition(renditionPath, step) {
  const stat28 = await step.attempt("cache_stat", () => import_node_fs50.promises.stat(renditionPath), isMissingPath);
  return stat28 !== null && stat28.isFile() && stat28.size > 0;
}
function createMediaRenditionCache(recipe) {
  const cacheDir = (0, import_node_path91.join)((0, import_node_os22.tmpdir)(), `sand-${recipe.medium}-rendition-${process.pid}`);
  const queue = new PromiseQueue({ max: TRANSCODE_CONCURRENCY });
  const resolutionBySourceVersion = /* @__PURE__ */ new Map();
  function removeEvicted(resolution) {
    if (!resolution.evicted || resolution.activeReaders > 0) return;
    void resolution.step.attempt("evicted_cleanup", async () => {
      await resolution.promise;
      await import_node_fs50.promises.rm(resolution.renditionPath, { force: true });
    });
  }
  async function produce({
    sourcePath,
    renditionPath,
    step
  }) {
    const plan = await recipe.plan(sourcePath, step);
    if (plan == null) return null;
    if (plan.kind === "source") return sourcePath;
    if (await hasRendition(renditionPath, step)) return renditionPath;
    return await step.attempt(
      "queue",
      () => queue.enqueue(async () => {
        if (await hasRendition(renditionPath, step)) return renditionPath;
        await import_node_fs50.promises.mkdir(cacheDir, { recursive: true });
        const tempPath = `${renditionPath}.${(0, import_node_crypto38.randomUUID)()}.tmp${recipe.renditionExtension}`;
        try {
          const command = await step.attempt(
            "transcode",
            () => step.run("ffmpeg", plan.ffmpegArgs(tempPath))
          );
          if (command === null) return null;
          const output = await step.attempt("output_stat", () => import_node_fs50.promises.stat(tempPath));
          if (output === null || !output.isFile() || output.size <= 0) return null;
          const rename7 = await step.attempt("rename", () => import_node_fs50.promises.rename(tempPath, renditionPath));
          return rename7 === null ? null : renditionPath;
        } finally {
          await step.attempt("temporary_cleanup", () => import_node_fs50.promises.rm(tempPath, { force: true }));
        }
      })
    );
  }
  return async (sourcePath, read, reportFailure = () => {
  }) => {
    const step = stepFor(recipe.medium, reportFailure);
    const stat28 = await step.attempt("source_stat", () => import_node_fs50.promises.stat(sourcePath), isMissingPath);
    if (stat28 === null || !stat28.isFile()) return await read(sourcePath);
    const sourceVersion = (0, import_node_crypto38.createHash)("sha256").update(sourcePath).update("\0").update(String(stat28.size)).update("\0").update(String(stat28.mtimeMs)).digest("hex");
    let resolution = resolutionBySourceVersion.get(sourceVersion);
    if (resolution != null) {
      if (resolution.retryAfter == null || resolution.retryAfter > Date.now()) {
        resolutionBySourceVersion.delete(sourceVersion);
        resolutionBySourceVersion.set(sourceVersion, resolution);
      } else {
        resolutionBySourceVersion.delete(sourceVersion);
        resolution.evicted = true;
        removeEvicted(resolution);
        resolution = void 0;
      }
    }
    if (resolution == null) {
      const renditionPath = (0, import_node_path91.join)(
        cacheDir,
        `${sourceVersion}.${(0, import_node_crypto38.randomUUID)()}${recipe.renditionExtension}`
      );
      const promise2 = produce({ sourcePath, renditionPath, step });
      const created = {
        renditionPath,
        promise: promise2,
        step,
        activeReaders: 0,
        evicted: false
      };
      resolution = created;
      resolutionBySourceVersion.set(sourceVersion, created);
      void step.attempt("queue", async () => {
        if (await promise2 == null) {
          created.retryAfter = Date.now() + FAILED_RESOLUTION_RETRY_MS;
        }
      });
      while (resolutionBySourceVersion.size > recipe.maxCached) {
        const oldestKey = resolutionBySourceVersion.keys().next().value;
        if (oldestKey == null) break;
        const oldest = resolutionBySourceVersion.get(oldestKey);
        resolutionBySourceVersion.delete(oldestKey);
        if (oldest != null) {
          oldest.evicted = true;
          removeEvicted(oldest);
        }
      }
    }
    resolution.activeReaders++;
    try {
      return await read(await resolution.promise ?? sourcePath);
    } finally {
      resolution.activeReaders--;
      removeEvicted(resolution);
    }
  };
}

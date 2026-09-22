/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/utils/dist/find-executable.js
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
function statSyncNoException(file) {
  try {
    return sfs.statSync(
      /* turbopackIgnore: true */
      file
    );
  } catch (_a20) {
    return null;
  }
}
function runDownPath(exe, pathMustMatch) {
  if (exe.match(/[\\/]/)) {
    return exe;
  }
  const cacheKey3 = pathMustMatch ? `${exe}\0${pathMustMatch.source}\0${pathMustMatch.flags}` : exe;
  const cached2 = runDownPathCache.get(cacheKey3);
  if (cached2 !== void 0) {
    return cached2;
  }
  const target = path2.join(
    /* turbopackIgnore: true */
    ".",
    exe
  );
  if (statSyncNoException(target)) {
    runDownPathCache.set(cacheKey3, target);
    return target;
  }
  const haystack = process.env.PATH.split(isWindows ? ";" : ":");
  for (const p2 of haystack) {
    const needle = path2.join(
      /* turbopackIgnore: true */
      p2,
      exe
    );
    if (statSyncNoException(needle) && (!pathMustMatch || pathMustMatch.test(needle))) {
      runDownPathCache.set(cacheKey3, needle);
      return needle;
    }
  }
  runDownPathCache.set(cacheKey3, exe);
  return exe;
}
function findActualExecutable(exe, args, pathMustMatch) {
  if (process.platform !== "win32") {
    return { cmd: runDownPath(exe), args };
  }
  if (!sfs.existsSync(
    /* turbopackIgnore: true */
    exe
  )) {
    const possibleExts = [".exe", ".bat", ".cmd", ".ps1"];
    const exeLower = exe.toLowerCase();
    if (possibleExts.some((ext2) => exeLower.endsWith(ext2))) {
      const resolvedPath = runDownPath(exe, pathMustMatch);
      if (sfs.existsSync(
        /* turbopackIgnore: true */
        resolvedPath
      )) {
        return findActualExecutable(resolvedPath, args, pathMustMatch);
      }
    }
    for (const ext2 of possibleExts) {
      const possibleFullPath = runDownPath(`${exe}${ext2}`, pathMustMatch);
      if (sfs.existsSync(
        /* turbopackIgnore: true */
        possibleFullPath
      )) {
        return findActualExecutable(possibleFullPath, args, pathMustMatch);
      }
    }
  }
  if (exe.match(/\.ps1$/i)) {
    const cmd = path2.join(
      /* turbopackIgnore: true */
      process.env.SYSTEMROOT,
      "System32",
      "WindowsPowerShell",
      "v1.0",
      "PowerShell.exe"
    );
    const psargs = ["-ExecutionPolicy", "Unrestricted", "-NoLogo", "-NonInteractive", "-File", exe];
    return { cmd, args: psargs.concat(args) };
  }
  if (exe.match(/\.(bat|cmd)$/i)) {
    const cmd = path2.join(
      /* turbopackIgnore: true */
      process.env.SYSTEMROOT,
      "System32",
      "cmd.exe"
    );
    const cmdArgs = ["/C", exe, ...args];
    return { cmd, args: cmdArgs };
  }
  if (exe.match(/\.(js)$/i)) {
    const cmd = process.execPath;
    const nodeArgs = [exe];
    return { cmd, args: nodeArgs.concat(args) };
  }
  return { cmd: exe, args };
}
var sfs, path2, isWindows, runDownPathCache;
var init_find_executable = __esm({
  "../packages/utils/dist/find-executable.js"() {
    "use strict";
    sfs = __toESM(require("node:fs"), 1);
    path2 = __toESM(require("node:path"), 1);
    init_lru_cache();
    isWindows = typeof process !== "undefined" && process.platform === "win32";
    runDownPathCache = new LRUCache({ max: 512 });
  }
});


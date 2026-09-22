var __awaiter4 = function(thisArg, _arguments, P2, generator) {
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
var STORE_LOCK_MTIME_UPDATE_MS = 1e3;
var STORE_LOCK_STALE_MS = 10 * 60 * 1e3;
var PRIVATE_LOCKFILE_MODE = 384;
var StoreLockError = class extends Error {
  constructor(options2) {
    super(options2.message);
    this.code = options2.code;
    this.lockPath = options2.lockPath;
    this.name = "StoreLockError";
  }
};
var StoreLock = class {
  constructor(options2, owner) {
    var _a19, _b2;
    this.options = options2;
    this.owner = owner;
    this.disposed = false;
    this.unhealthy = false;
    if (options2.mtimeUpdateMs > 0) {
      this.timer = setInterval(() => {
        void this.refreshMtime().catch(() => {
          this.clearTimer();
        });
      }, options2.mtimeUpdateMs);
      (_b2 = (_a19 = this.timer).unref) === null || _b2 === void 0 ? void 0 : _b2.call(_a19);
    }
  }
  /**
   * Re-read the on-disk lockfile and report whether this lock still owns it.
   * A stale-steal (another holder unlinked and rewrote the file) makes this
   * return `false`, which the engine uses to fence zombie writes. A missing
   * or unparseable file also reads as not-owned.
   */
  verifyStillOwned() {
    return __awaiter4(this, void 0, void 0, function* () {
      if (this.disposed) {
        return false;
      }
      const contents = yield readLockfileContents(this.options.lockPath, {
        fs: this.options.fs,
        throwOnInvalid: false
      });
      return contents !== void 0 && isSameOwner(contents, this.owner);
    });
  }
  /**
   * Last-resort: stop refreshing the lockfile mtime so the existing 10-minute
   * stale-steal can move ownership away from a wedged holder. Idempotent; only
   * a fresh {@link tryAcquireStoreLock} re-arms the heartbeat.
   */
  markUnhealthy() {
    this.unhealthy = true;
    this.clearTimer();
  }
  dispose() {
    return __awaiter4(this, void 0, void 0, function* () {
      if (this.disposed) {
        return;
      }
      this.disposed = true;
      this.clearTimer();
      const contents = yield readLockfileContents(this.options.lockPath, {
        fs: this.options.fs,
        throwOnInvalid: false
      });
      if (contents !== void 0 && isSameOwner(contents, this.owner)) {
        yield ignoreNotFound(() => this.options.fs.unlink(this.options.lockPath));
      }
    });
  }
  refreshMtime() {
    return __awaiter4(this, void 0, void 0, function* () {
      if (this.disposed || this.unhealthy) {
        return;
      }
      const contents = yield readLockfileContents(this.options.lockPath, this.options);
      if (this.disposed || this.unhealthy) {
        return;
      }
      if (contents === void 0 || !isSameOwner(contents, this.owner)) {
        this.clearTimer();
        return;
      }
      const now = new Date(this.options.now());
      yield ignoreNotFound(() => this.options.fs.utimes(this.options.lockPath, now, now));
    });
  }
  clearTimer() {
    if (this.timer !== void 0) {
      clearInterval(this.timer);
    }
  }
};
function tryAcquireStoreLock(options2) {
  return __awaiter4(this, void 0, void 0, function* () {
    const resolved = resolveOptions(options2);
    ensureSecureDirectoryChain(path5.dirname(resolved.lockPath));
    assertNoSymlinkInPath(resolved.lockPath);
    return tryAcquire(resolved, false);
  });
}
function readActiveStoreLockOwner(options2) {
  return __awaiter4(this, void 0, void 0, function* () {
    const resolved = resolveOptions(Object.assign(Object.assign({}, options2), { windowId: "read-active-owner", mtimeUpdateMs: 0 }));
    assertNoSymlinkInPath(resolved.lockPath);
    const owner = yield readLockfileContents(resolved.lockPath, {
      fs: resolved.fs,
      throwOnInvalid: false
    });
    if (owner === void 0) {
      return void 0;
    }
    assertSameOsUser(owner, resolved);
    if (!resolved.processExists(owner.pid)) {
      return void 0;
    }
    const elapsed = resolved.now() - (yield readMtime(resolved));
    if (elapsed > resolved.staleLockMs) {
      return void 0;
    }
    const verifiedOwner = yield readLockfileContents(resolved.lockPath, {
      fs: resolved.fs,
      throwOnInvalid: false
    });
    return verifiedOwner !== void 0 && isSameOwner(owner, verifiedOwner) ? owner : void 0;
  });
}
function getCurrentStoreLockIdentity(platform2 = process.platform) {
  var _a19;
  if (platform2 === "win32") {
    return { sid: readCurrentWindowsUserSid() };
  }
  const uid = (_a19 = process.geteuid) === null || _a19 === void 0 ? void 0 : _a19.call(process);
  if (uid === void 0) {
    throw new StoreLockError({
      code: "missing_identity",
      message: "Could not determine current uid for store lock",
      lockPath: ""
    });
  }
  return { uid };
}
function tryAcquire(options2, isSecondAttempt) {
  return __awaiter4(this, void 0, void 0, function* () {
    const owner = createOwner(options2);
    try {
      yield options2.fs.writeLockExclusive(options2.lockPath, JSON.stringify(owner), PRIVATE_LOCKFILE_MODE);
      return { kind: "acquired", lock: new StoreLock(options2, owner) };
    } catch (error42) {
      if (!(error42 instanceof Error) || getErrorCode(error42) !== "EEXIST") {
        throw error42;
      }
    }
    const contents = yield readLockfileContents(options2.lockPath, {
      fs: options2.fs,
      throwOnInvalid: false
    });
    if (contents === void 0) {
      if (isSecondAttempt) {
        return { kind: "held", owner: void 0 };
      }
      return yield stealLock(options2);
    }
    assertSameOsUser(contents, options2);
    if (isSecondAttempt) {
      return { kind: "held", owner: contents };
    }
    if (!options2.processExists(contents.pid)) {
      return yield stealLock(options2);
    }
    const elapsed = options2.now() - (yield readMtime(options2));
    if (elapsed <= options2.staleLockMs) {
      return { kind: "held", owner: contents };
    }
    yield delay(options2.staleRecheckDelayMs);
    const elapsedAfterRecheck = options2.now() - (yield readMtime(options2));
    if (elapsedAfterRecheck <= options2.staleLockMs) {
      return { kind: "held", owner: contents };
    }
    return yield stealLock(options2);
  });
}
function stealLock(options2) {
  return __awaiter4(this, void 0, void 0, function* () {
    yield ignoreNotFound(() => options2.fs.unlink(options2.lockPath));
    return yield tryAcquire(options2, true);
  });
}
function createOwner(options2) {
  return {
    uid: options2.identity.uid,
    sid: options2.identity.sid,
    pid: options2.pid,
    hostname: options2.hostname,
    windowId: options2.windowId,
    acquiredAt: options2.now()
  };
}
function readLockfileContents(lockPath, options2) {
  return __awaiter4(this, void 0, void 0, function* () {
    let raw;
    try {
      raw = yield options2.fs.readFile(lockPath, "utf8");
    } catch (error42) {
      if (error42 instanceof Error && getErrorCode(error42) === "ENOENT") {
        return void 0;
      }
      if (error42 instanceof Error && (getErrorCode(error42) === "EACCES" || getErrorCode(error42) === "EPERM")) {
        if (options2.throwOnInvalid === false) {
          return void 0;
        }
        throw new StoreLockError({
          code: "invalid_lockfile",
          message: `Unreadable agent store lockfile: ${lockPath}`,
          lockPath
        });
      }
      throw error42;
    }
    let parsed2;
    try {
      parsed2 = JSON.parse(raw);
    } catch (_a19) {
      if (options2.throwOnInvalid === false) {
        return void 0;
      }
      throw new StoreLockError({
        code: "invalid_lockfile",
        message: `Invalid agent store lockfile JSON: ${lockPath}`,
        lockPath
      });
    }
    const owner = storeLockOwnerFromJson(parsed2);
    if (owner === void 0) {
      if (options2.throwOnInvalid === false) {
        return void 0;
      }
      throw new StoreLockError({
        code: "invalid_lockfile",
        message: `Invalid agent store lockfile contents: ${lockPath}`,
        lockPath
      });
    }
    return owner;
  });
}
function readMtime(options2) {
  return __awaiter4(this, void 0, void 0, function* () {
    try {
      const stat28 = yield options2.fs.stat(options2.lockPath);
      return stat28.mtimeMs;
    } catch (error42) {
      if (error42 instanceof Error && getErrorCode(error42) === "ENOENT") {
        return 0;
      }
      throw error42;
    }
  });
}
function assertSameOsUser(owner, options2) {
  if (owner.uid !== options2.identity.uid) {
    throw new StoreLockError({
      code: "foreign_identity_lock",
      message: `Agent store lock is held by uid ${owner.uid}, expected ${options2.identity.uid}`,
      lockPath: options2.lockPath
    });
  }
  if (owner.sid !== options2.identity.sid) {
    throw new StoreLockError({
      code: "foreign_identity_lock",
      message: `Agent store lock is held by sid ${owner.sid}, expected ${options2.identity.sid}`,
      lockPath: options2.lockPath
    });
  }
}
function isSameOwner(left, right) {
  return left.pid === right.pid && left.hostname === right.hostname && left.windowId === right.windowId && left.acquiredAt === right.acquiredAt;
}
function resolveOptions(options2) {
  var _a19, _b2, _c2, _d, _e2, _f, _g, _h, _j;
  return {
    lockPath: path5.resolve(options2.lockPath),
    windowId: options2.windowId,
    hostname: (_a19 = options2.hostname) !== null && _a19 !== void 0 ? _a19 : os2.hostname(),
    identity: (_b2 = options2.identity) !== null && _b2 !== void 0 ? _b2 : getCurrentStoreLockIdentity(),
    now: (_c2 = options2.now) !== null && _c2 !== void 0 ? _c2 : Date.now,
    pid: (_d = options2.pid) !== null && _d !== void 0 ? _d : process.pid,
    processExists: (_e2 = options2.processExists) !== null && _e2 !== void 0 ? _e2 : defaultProcessExists,
    staleLockMs: (_f = options2.staleLockMs) !== null && _f !== void 0 ? _f : STORE_LOCK_STALE_MS,
    staleRecheckDelayMs: (_g = options2.staleRecheckDelayMs) !== null && _g !== void 0 ? _g : 2e3,
    mtimeUpdateMs: (_h = options2.mtimeUpdateMs) !== null && _h !== void 0 ? _h : STORE_LOCK_MTIME_UPDATE_MS,
    fs: (_j = options2.fs) !== null && _j !== void 0 ? _j : defaultStoreLockFs()
  };
}
function defaultStoreLockFs() {
  return {
    readFile: (targetPath, encoding) => fs5.promises.readFile(targetPath, encoding),
    stat: (targetPath) => fs5.promises.stat(targetPath),
    unlink: (targetPath) => fs5.promises.unlink(targetPath),
    utimes: (targetPath, atime, mtime) => fs5.promises.utimes(targetPath, atime, mtime),
    writeLockExclusive: (targetPath, data, mode) => writeLockFileExclusive(targetPath, data, mode)
  };
}
function readCurrentWindowsUserSid() {
  var _a19;
  const sid = (_a19 = readCurrentWindowsUserIdentity()) === null || _a19 === void 0 ? void 0 : _a19.sid;
  if (sid === void 0) {
    throw new StoreLockError({
      code: "missing_identity",
      message: "Could not determine current Windows lock identity",
      lockPath: ""
    });
  }
  return sid;
}
function defaultProcessExists(pid) {
  try {
    process.kill(pid, 0);
    return true;
  } catch (error42) {
    return error42 instanceof Error && getErrorCode(error42) === "EPERM";
  }
}
function ignoreNotFound(operation) {
  return __awaiter4(this, void 0, void 0, function* () {
    try {
      yield operation();
    } catch (error42) {
      if (!(error42 instanceof Error) || getErrorCode(error42) !== "ENOENT") {
        throw error42;
      }
    }
  });
}
function delay(ms2) {
  return __awaiter4(this, void 0, void 0, function* () {
    if (ms2 <= 0) {
      return;
    }
    yield new Promise((resolve29) => {
      setTimeout(resolve29, ms2);
    });
  });
}
function storeLockOwnerFromJson(value) {
  if (!isJsonObject(value)) {
    return void 0;
  }
  const { pid, hostname: hostname3, windowId, acquiredAt, uid, sid } = value;
  if (typeof pid !== "number" || typeof hostname3 !== "string" || typeof windowId !== "string" || typeof acquiredAt !== "number" || uid !== void 0 && typeof uid !== "number" || sid !== void 0 && typeof sid !== "string") {
    return void 0;
  }
  return {
    pid,
    hostname: hostname3,
    windowId,
    acquiredAt,
    uid,
    sid
  };
}
function isJsonObject(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
function getErrorCode(error42) {
  if ("code" in error42 && typeof error42.code === "string") {
    return error42.code;
  }
  return void 0;
}

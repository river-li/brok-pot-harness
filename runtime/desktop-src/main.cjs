"use strict";
!(function () {
  try {
    var e =
        "undefined" != typeof window
          ? window
          : "undefined" != typeof global
            ? global
            : "undefined" != typeof globalThis
              ? globalThis
              : "undefined" != typeof self
                ? self
                : {},
      n = new e.Error().stack;
    n &&
      ((e._sentryDebugIds = e._sentryDebugIds || {}),
      (e._sentryDebugIds[n] = "d5c68616-6972-4f69-8066-054b3cd70665"),
      (e._sentryDebugIdIdentifier =
        "sentry-dbid-d5c68616-6972-4f69-8066-054b3cd70665"));
  } catch (e) {}
})();
("use strict");
var pe = Object.create;
var b = Object.defineProperty;
var he = Object.getOwnPropertyDescriptor;
var _e = Object.getOwnPropertyNames;
var Se = Object.getPrototypeOf,
  Ee = Object.prototype.hasOwnProperty;
var i = (e, r) => b(e, "name", { value: r, configurable: !0 });
var w = (e, r) => () => (r || e((r = { exports: {} }).exports, r), r.exports);
var ge = (e, r, t, n) => {
  if ((r && typeof r == "object") || typeof r == "function")
    for (let o of _e(r))
      !Ee.call(e, o) &&
        o !== t &&
        b(e, o, {
          get: () => r[o],
          enumerable: !(n = he(r, o)) || n.enumerable,
        });
  return e;
};
var x = (e, r, t) => (
  (t = e != null ? pe(Se(e)) : {}),
  ge(
    r || !e || !e.__esModule
      ? b(t, "default", { value: e, enumerable: !0 })
      : t,
    e,
  )
);
var q = w((_) => {
  "use strict";
  Object.defineProperty(_, "__esModule", { value: !0 });
  _.signals = void 0;
  _.signals = [];
  _.signals.push("SIGHUP", "SIGINT", "SIGTERM");
  process.platform !== "win32" &&
    _.signals.push(
      "SIGALRM",
      "SIGABRT",
      "SIGVTALRM",
      "SIGXCPU",
      "SIGXFSZ",
      "SIGUSR2",
      "SIGTRAP",
      "SIGSYS",
      "SIGQUIT",
      "SIGIOT",
    );
  process.platform === "linux" &&
    _.signals.push("SIGIO", "SIGPOLL", "SIGPWR", "SIGSTKFLT");
});
var J = w((m) => {
  "use strict";
  var C;
  Object.defineProperty(m, "__esModule", { value: !0 });
  m.unload = m.load = m.onExit = m.signals = void 0;
  var T = q();
  Object.defineProperty(m, "signals", {
    enumerable: !0,
    get: i(function () {
      return T.signals;
    }, "get"),
  });
  var O = i(
      (e) =>
        !!e &&
        typeof e == "object" &&
        typeof e.removeListener == "function" &&
        typeof e.emit == "function" &&
        typeof e.reallyExit == "function" &&
        typeof e.listeners == "function" &&
        typeof e.kill == "function" &&
        typeof e.pid == "number" &&
        typeof e.on == "function",
      "processOk",
    ),
    v = Symbol.for("signal-exit emitter"),
    F = globalThis,
    De = Object.defineProperty.bind(Object),
    k = class {
      static {
        i(this, "Emitter");
      }
      emitted = { afterExit: !1, exit: !1 };
      listeners = { afterExit: [], exit: [] };
      count = 0;
      id = Math.random();
      constructor() {
        if (F[v]) return F[v];
        De(F, v, {
          value: this,
          writable: !1,
          enumerable: !1,
          configurable: !1,
        });
      }
      on(r, t) {
        this.listeners[r].push(t);
      }
      removeListener(r, t) {
        let n = this.listeners[r],
          o = n.indexOf(t);
        o !== -1 &&
          (o === 0 && n.length === 1 ? (n.length = 0) : n.splice(o, 1));
      }
      emit(r, t, n) {
        if (this.emitted[r]) return !1;
        this.emitted[r] = !0;
        let o = !1;
        for (let l of this.listeners[r]) o = l(t, n) === !0 || o;
        return (r === "exit" && (o = this.emit("afterExit", t, n) || o), o);
      }
    },
    P = class {
      static {
        i(this, "SignalExitBase");
      }
    },
    Ne = i(
      (e) => ({
        onExit(r, t) {
          return e.onExit(r, t);
        },
        load() {
          return e.load();
        },
        unload() {
          return e.unload();
        },
      }),
      "signalExitWrap",
    ),
    U = class extends P {
      static {
        i(this, "SignalExitFallback");
      }
      onExit() {
        return () => {};
      }
      load() {}
      unload() {}
    },
    G = class extends P {
      static {
        i(this, "SignalExit");
      }
      #a = B.platform === "win32" ? "SIGINT" : "SIGHUP";
      #t = new k();
      #e;
      #o;
      #i;
      #n = {};
      #r = !1;
      constructor(r) {
        (super(), (this.#e = r), (this.#n = {}));
        for (let t of T.signals)
          this.#n[t] = () => {
            let n = this.#e.listeners(t),
              { count: o } = this.#t,
              l = r;
            if (
              (typeof l.__signal_exit_emitter__ == "object" &&
                typeof l.__signal_exit_emitter__.count == "number" &&
                (o += l.__signal_exit_emitter__.count),
              n.length === o)
            ) {
              this.unload();
              let u = this.#t.emit("exit", null, t),
                c = t === "SIGHUP" ? this.#a : t;
              u || r.kill(r.pid, c);
            }
          };
        ((this.#i = r.reallyExit), (this.#o = r.emit));
      }
      onExit(r, t) {
        if (!O(this.#e)) return () => {};
        this.#r === !1 && this.load();
        let n = t?.alwaysLast ? "afterExit" : "exit";
        return (
          this.#t.on(n, r),
          () => {
            (this.#t.removeListener(n, r),
              this.#t.listeners.exit.length === 0 &&
                this.#t.listeners.afterExit.length === 0 &&
                this.unload());
          }
        );
      }
      load() {
        if (!this.#r) {
          ((this.#r = !0), (this.#t.count += 1));
          for (let r of T.signals)
            try {
              let t = this.#n[r];
              t && this.#e.on(r, t);
            } catch {}
          ((this.#e.emit = (r, ...t) => this.#l(r, ...t)),
            (this.#e.reallyExit = (r) => this.#s(r)));
        }
      }
      unload() {
        this.#r &&
          ((this.#r = !1),
          T.signals.forEach((r) => {
            let t = this.#n[r];
            if (!t) throw new Error("Listener not defined for signal: " + r);
            try {
              this.#e.removeListener(r, t);
            } catch {}
          }),
          (this.#e.emit = this.#o),
          (this.#e.reallyExit = this.#i),
          (this.#t.count -= 1));
      }
      #s(r) {
        return O(this.#e)
          ? ((this.#e.exitCode = r || 0),
            this.#t.emit("exit", this.#e.exitCode, null),
            this.#i.call(this.#e, this.#e.exitCode))
          : 0;
      }
      #l(r, ...t) {
        let n = this.#o;
        if (r === "exit" && O(this.#e)) {
          typeof t[0] == "number" && (this.#e.exitCode = t[0]);
          let o = n.call(this.#e, r, ...t);
          return (this.#t.emit("exit", this.#e.exitCode, null), o);
        } else return n.call(this.#e, r, ...t);
      }
    },
    B = globalThis.process;
  ((C = Ne(O(B) ? new G(B) : new U())),
    (m.onExit = C.onExit),
    (m.load = C.load),
    (m.unload = C.unload));
});
var Q = w((xt, y) => {
  "use strict";
  y.exports = ke;
  y.exports.sync = Ue;
  y.exports._getTmpname = H;
  y.exports._cleanupOnExit = V;
  var s = require("fs"),
    Le = require("node:crypto"),
    { onExit: Z } = J(),
    be = require("path"),
    { promisify: f } = require("util"),
    h = {},
    we = i(function () {
      try {
        return require("worker_threads").threadId;
      } catch {
        return 0;
      }
    }, "getId")(),
    Me = 0;
  function H(e) {
    return (
      e +
      "." +
      Le.createHash("sha1")
        .update(__filename)
        .update(String(process.pid))
        .update(String(we))
        .update(String(++Me))
        .digest()
        .readUInt32BE(0)
    );
  }
  i(H, "getTmpname");
  function V(e) {
    return () => {
      try {
        s.unlinkSync(typeof e == "function" ? e() : e);
      } catch {}
    };
  }
  i(V, "cleanupOnExit");
  function ve(e) {
    return new Promise((r) => {
      (h[e] || (h[e] = []), h[e].push(r), h[e].length === 1 && r());
    });
  }
  i(ve, "serializeActiveFile");
  function D(e) {
    return (
      e.code === "ENOSYS" ||
      ((!process.getuid || process.getuid() !== 0) &&
        (e.code === "EINVAL" || e.code === "EPERM"))
    );
  }
  i(D, "isChownErrOk");
  async function Fe(e, r, t = {}) {
    typeof t == "string" && (t = { encoding: t });
    let n,
      o,
      l = Z(V(() => o)),
      u = be.resolve(e);
    try {
      await ve(u);
      let c = await f(s.realpath)(e).catch(() => e);
      if (((o = H(c)), !t.mode || !t.chown)) {
        let a = await f(s.stat)(c).catch(() => {});
        a &&
          (t.mode == null && (t.mode = a.mode),
          t.chown == null &&
            process.getuid &&
            (t.chown = { uid: a.uid, gid: a.gid }));
      }
      ((n = await f(s.open)(o, "w", t.mode)),
        t.tmpfileCreated && (await t.tmpfileCreated(o)),
        ArrayBuffer.isView(r)
          ? await f(s.write)(n, r, 0, r.length, 0)
          : r != null &&
            (await f(s.write)(n, String(r), 0, String(t.encoding || "utf8"))),
        t.fsync !== !1 && (await f(s.fsync)(n)),
        await f(s.close)(n),
        (n = null),
        t.chown &&
          (await f(s.chown)(o, t.chown.uid, t.chown.gid).catch((a) => {
            if (!D(a)) throw a;
          })),
        t.mode &&
          (await f(s.chmod)(o, t.mode).catch((a) => {
            if (!D(a)) throw a;
          })),
        await f(s.rename)(o, c));
    } finally {
      (n && (await f(s.close)(n).catch(() => {})),
        l(),
        await f(s.unlink)(o).catch(() => {}),
        h[u].shift(),
        h[u].length > 0 ? h[u][0]() : delete h[u]);
    }
  }
  i(Fe, "writeFileAsync");
  async function ke(e, r, t, n) {
    t instanceof Function && ((n = t), (t = {}));
    let o = Fe(e, r, t);
    if (n)
      try {
        let l = await o;
        return n(l);
      } catch (l) {
        return n(l);
      }
    return o;
  }
  i(ke, "writeFile");
  function Ue(e, r, t) {
    typeof t == "string" ? (t = { encoding: t }) : t || (t = {});
    try {
      e = s.realpathSync(e);
    } catch {}
    let n = H(e);
    if (!t.mode || !t.chown)
      try {
        let a = s.statSync(e);
        ((t = Object.assign({}, t)),
          t.mode || (t.mode = a.mode),
          !t.chown && process.getuid && (t.chown = { uid: a.uid, gid: a.gid }));
      } catch {}
    let o,
      l = V(n),
      u = Z(l),
      c = !0;
    try {
      if (
        ((o = s.openSync(n, "w", t.mode || 438)),
        t.tmpfileCreated && t.tmpfileCreated(n),
        ArrayBuffer.isView(r)
          ? s.writeSync(o, r, 0, r.length, 0)
          : r != null &&
            s.writeSync(o, String(r), 0, String(t.encoding || "utf8")),
        t.fsync !== !1 && s.fsyncSync(o),
        s.closeSync(o),
        (o = null),
        t.chown)
      )
        try {
          s.chownSync(n, t.chown.uid, t.chown.gid);
        } catch (a) {
          if (!D(a)) throw a;
        }
      if (t.mode)
        try {
          s.chmodSync(n, t.mode);
        } catch (a) {
          if (!D(a)) throw a;
        }
      (s.renameSync(n, e), (c = !1));
    } finally {
      if (o)
        try {
          s.closeSync(o);
        } catch {}
      (u(), c && l());
    }
  }
  i(Ue, "writeFileSync");
});
var de = x(require("node:path"));
var E = require("node:path");
function I(e) {
  let r = new Set(),
    t = e;
  for (; t != null && typeof t == "object" && !r.has(t); ) {
    r.add(t);
    let n = t.code;
    if (typeof n == "string" && /^E[A-Z_]+$/.test(n)) return n;
    t = t.cause;
  }
}
i(I, "findSystemErrno");
var Ae = "SAND_USER_DATA_DIR",
  xe = "sand-data",
  Y = "--user-data-dir",
  X = "/home/box",
  dt = `${X}/${xe}`,
  ft = `${X}/agent-data`;
function Re(e) {
  for (let r = 0; r < e.length; r++) {
    let t = e[r];
    if (t === Y) {
      let o = e[r + 1];
      return o != null && !o.startsWith("--") ? o : null;
    }
    let n = `${Y}=`;
    if (t.startsWith(n)) return t.slice(n.length);
  }
  return null;
}
i(Re, "readUserDataDirArg");
function $(e = [], r = process.env, t = process.cwd()) {
  let o = (Re(e) ?? r[Ae])?.trim();
  return o == null || o.length === 0
    ? null
    : (0, E.isAbsolute)(o)
      ? o
      : (0, E.resolve)(t, o);
}
i($, "resolveSandUserDataDir");
var fe = require("electron");
var M = class extends Error {
    static {
      i(this, "SandInvariantViolation");
    }
    constructor(r) {
      (super(r), (this.name = "SandInvariantViolation"));
    }
  },
  ye = null;
var Ie =
  "Invariant violation (message stripped in packaged builds; the stack identifies the site)";
function Ce() {
  return !0;
}
i(Ce, "messagesStripped");
var Te = /^at /,
  Oe =
    /^at (?:new SandInvariantViolation\b|invariant\b|installInvariantReporter\b)/;
function Pe(e) {
  let r = e.stack;
  if (r == null || !r.startsWith(z(e))) return null;
  for (let t of r.slice(z(e).length).split(`
`)) {
    let n = t.trim();
    if (!(!Te.test(n) || Oe.test(n))) return n;
  }
  return null;
}
i(Pe, "topApplicationFrame");
function z(e) {
  return e.message === "" ? e.name : `${e.name}: ${e.message}`;
}
i(z, "headerOf");
function R(e, r) {
  if (e) return;
  let t;
  Ce() ? (t = Ie) : typeof r == "function" ? (t = r()) : (t = r);
  let n = new M(t);
  throw (ye?.({ name: n.name, frame: Pe(n) }), n);
}
i(R, "invariant");
var W = require("node:fs"),
  g = require("node:fs/promises"),
  N = x(require("node:module"), 1),
  p = x(require("node:path"), 1),
  K = x(require("node:vm"), 1);
var ee = require("node:fs"),
  te = require("node:path"),
  re = x(Q(), 1);
async function ne(e, r, t = {}) {
  (Be(e), await (0, re.default)(e, He(r), Ve(t)));
}
i(ne, "writeFileAtomic");
var Ge = /^(.+)\.\d{1,10}$/;
function oe(e) {
  return Ge.exec(e)?.[1];
}
i(oe, "writeTempTargetOf");
function Be(e) {
  (0, ee.mkdirSync)((0, te.dirname)(e), { recursive: !0 });
}
i(Be, "createParentsKeepingCallOrder");
function He(e) {
  return typeof e == "string"
    ? e
    : Buffer.from(e.buffer, e.byteOffset, e.byteLength);
}
i(He, "toLibraryData");
function Ve(e) {
  return { mode: e.mode, chown: !1 };
}
i(Ve, "freshLibraryOptions");
function j(e) {
  try {
    return { ok: !0, value: e() };
  } catch (r) {
    return { ok: !1, error: r };
  }
}
i(j, "attemptSync");
function ie(e) {
  return e instanceof Error ? (e.name.length > 0 ? e.name : "Error") : typeof e;
}
i(ie, "errorClassOf");
var je = 2,
  We = 3600 * 1e3,
  Ke = /\.v8$/;
function se(e) {
  return p.default.join(e, "v8-code-cache");
}
i(se, "codeCacheDirUnder");
function ae({ cacheDir: e, bundleName: r, buildId: t }) {
  return p.default.format({ dir: e, name: `${r}-${t}`, ext: ".v8" });
}
i(ae, "codeCacheFileFor");
function Ye(e) {
  return p.default.basename(e, p.default.extname(e));
}
i(Ye, "bundleNameOf");
function le(e) {
  return (
    typeof e == "object" &&
    e !== null &&
    "reportMainCodeCache" in e &&
    typeof e.reportMainCodeCache == "function"
  );
}
i(le, "isMainAppExports");
function ce(e) {
  let { bundlePath: r, cacheDir: t, buildId: n } = e,
    o = Ye(r),
    l = j(() =>
      (0, W.readFileSync)(ae({ cacheDir: t, bundleName: o, buildId: n })),
    ),
    u = new K.default.Script(Xe((0, W.readFileSync)(r, "utf8")), {
      filename: r,
      cachedData: l.ok ? l.value : void 0,
      importModuleDynamically:
        K.default.constants.USE_MAIN_CONTEXT_DEFAULT_LOADER,
    }),
    c = new N.default(r);
  c.filename = r;
  let a = u.runInThisContext();
  return (
    R(
      typeof a == "function",
      "The CommonJS wrapper did not evaluate to a function.",
    ),
    a.call(
      c.exports,
      c.exports,
      (0, N.createRequire)(r),
      c,
      r,
      p.default.dirname(r),
    ),
    (c.loaded = !0),
    {
      exports: c.exports,
      codeCache: {
        read: $e(l, u.cachedDataRejected),
        persist: i(
          (L) => ze(u, o, ae({ cacheDir: L, bundleName: o, buildId: n })),
          "persist",
        ),
      },
    }
  );
}
i(ce, "runMainBundleWithCodeCache");
function Xe(e) {
  return `(function (exports, require, module, __filename, __dirname) { ${e}
});`;
}
i(Xe, "wrapAsCommonJs");
function $e(e, r) {
  if (e.ok) return r === !0 ? { kind: "rejected" } : { kind: "hit" };
  let t = I(e.error);
  return t === "ENOENT"
    ? { kind: "absent" }
    : { kind: "unreadable", errorClass: t ?? ie(e.error) };
}
i($e, "codeCacheReadOf");
async function ze(e, r, t) {
  let n = e.createCachedData();
  return (
    await ne(t, n),
    await qe(p.default.dirname(t), r, p.default.basename(t)),
    n.byteLength
  );
}
i(ze, "persistCodeCache");
async function qe(e, r, t) {
  let n = Date.now(),
    o = await (0, g.readdir)(e),
    l = i(
      (d, S) =>
        Promise.all(
          o
            .filter((A) => A !== t && d(A))
            .map(async (A) => ({
              name: A,
              mtimeMs: await (0, g.stat)(p.default.join(e, A)).then(
                (me) => me.mtimeMs,
                () => S,
              ),
            })),
        ),
      "timestamped",
    ),
    u = i((d) => d.startsWith(`${r}-`) && Ke.test(d), "isCodeCacheEntry"),
    c = i((d) => {
      let S = oe(d);
      return S !== void 0 && u(S);
    }, "isCodeCacheEntryWriteTemp"),
    a = (await l(u, 0))
      .sort((d, S) => S.mtimeMs - d.mtimeMs)
      .slice(je)
      .map((d) => d.name),
    L = (await l(c, n)).filter((d) => n - d.mtimeMs > We).map((d) => d.name);
  await Promise.all(
    [...a, ...L].map((d) => (0, g.rm)(p.default.join(e, d), { force: !0 })),
  );
}
i(qe, "retireStaleEntries");
function Je(e) {
  return (
    typeof e == "object" &&
    e !== null &&
    "remainderDue" in e &&
    e.remainderDue instanceof Promise &&
    "noteStartupFailed" in e &&
    typeof e.noteStartupFailed == "function"
  );
}
i(Je, "isMainCoreExports");
function ue({ runBundle: e }) {
  let r = e("main-core");
  R(
    Je(r.exports),
    "main-core.cjs does not export remainderDue and noteStartupFailed.",
  );
  let { remainderDue: t, noteStartupFailed: n } = r.exports;
  return t
    .then(() => {
      let o = e("main-app");
      (R(le(o.exports), "main-app.cjs does not export reportMainCodeCache."),
        o.exports.reportMainCodeCache(r.codeCache),
        o.exports.reportMainCodeCache(o.codeCache));
    })
    .catch((o) => { console.error("[local:desktop:load]", o); n(o); });
}
i(ue, "runMainBundlesInOrder");
var Ze = se($(process.argv) ?? fe.app.getPath("userData"));
ue({
  runBundle: i(
    (e) =>
      ce({
        bundlePath: de.default.join(__dirname, `${e}.cjs`),
        cacheDir: Ze,
        buildId: "7e1506f2-52f7-4455-924b-fc2768adeb09",
      }),
    "runBundle",
  ),
});
//# debugId=d5c68616-6972-4f69-8066-054b3cd70665

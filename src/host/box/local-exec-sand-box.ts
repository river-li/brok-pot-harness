/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/host/box/local-exec-sand-box.ts
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/2
var import_promises27 = require("node:fs/promises");
var import_node_os16 = require("node:os");
var import_node_path68 = require("node:path");
init_dist4();

// @recovered-fragment 2/2
function resolveProjectDir(override) {
  const configured2 = override?.trim();
  return configured2 != null && configured2.length > 0 ? configured2 : (0, import_node_os16.homedir)();
}
var LocalExecSandBox = class {
  constructor(projectDir, protectedRoots = [], options2 = {}) {
    this.projectDir = projectDir;
    this.protectedRoots = protectedRoots;
    this.options = options2;
  }
  projectDir;
  protectedRoots;
  options;
  async ensureReady(ctx, _agentId) {
    const projectDir = resolveProjectDir(this.projectDir);
    const backgroundWorkRegistry = ctx.get(sandBackgroundWorkRegistryKey);
    const permissionsService = new MockPermissionsService();
    const ignoreService = new MockIgnoreService();
    const computerUseDisplay = this.options.computerUseDisplay?.trim();
    const terminalExecutor = createDefaultTerminalExecutor({
      env: {
        CURSOR_AGENT: "1",
        SAND_AGENT: "1",
        ...computerUseDisplay == null || computerUseDisplay.length === 0 ? {} : { DISPLAY: computerUseDisplay }
      }
    }).clone(projectDir);
    const shellCoreExecutor = new BaseShellCoreExecutor(terminalExecutor, projectDir, projectDir);
    const backgroundShellExecutor = new LocalBackgroundShellExecutor(
      permissionsService,
      shellCoreExecutor,
      ignoreService,
      projectDir,
      void 0,
      backgroundWorkRegistry
    );
    const shellStreamExecutor = new LocalShellStreamExecutor(
      permissionsService,
      shellCoreExecutor,
      ignoreService,
      backgroundShellExecutor.getManager()
    );
    const accessor = new RegistryResourceAccessor();
    accessor.register(backgroundShellExecutorResource, backgroundShellExecutor);
    accessor.register(shellStreamExecutorResource, shellStreamExecutor);
    const readExecutor = new LocalReadExecutor(permissionsService, projectDir);
    const lsExecutor = new LocalLsExecutor(permissionsService, ignoreService, projectDir);
    const protectedRoots = this.protectedRoots;
    accessor.register(readExecutorResource, {
      execute: async (ctx2, args) => {
        await assertPathOutsideProtectedRoots(protectedRoots, args.path, projectDir);
        return await readExecutor.execute(ctx2, args);
      }
    });
    accessor.register(lsExecutorResource, {
      execute: async (ctx2, args) => {
        await assertPathOutsideProtectedRoots(protectedRoots, args.path, projectDir);
        return await lsExecutor.execute(ctx2, args);
      }
    });
    if (computerUseDisplay != null && computerUseDisplay.length > 0) {
      accessor.register(
        shellExecutorResource,
        new LocalShellExecutor(permissionsService, shellCoreExecutor, ignoreService)
      );
      accessor.register(
        computerUseExecutorResource,
        new LazyX11ComputerUseExecutor({ display: computerUseDisplay })
      );
    }
    return {
      remoteAccessor: accessor,
      vncUrl: "",
      terminalsFolder: (0, import_node_path68.join)(projectDir, "terminals")
    };
  }
  async hibernate(_ctx, _agentId) {
  }
  async runState(_ctx, _agentId) {
    return "running";
  }
  async listBoxes() {
    return [];
  }
  getAgentWindowIndex(_agentId) {
    return this.displayWindowIndex();
  }
  getAssignedWindowIndexes() {
    const windowIndex = this.displayWindowIndex();
    return windowIndex === void 0 ? [] : [windowIndex];
  }
  async uploadFile(_ctx, _agentId, boxPath, data) {
    const target = this.resolveBoxPath(boxPath);
    await writeFileAtomic(target, data);
  }
  async downloadFile(_ctx, _agentId, boxPath, options2) {
    const target = this.resolveBoxPath(boxPath);
    await assertPathOutsideProtectedRoots(
      this.protectedRoots,
      target,
      resolveProjectDir(this.projectDir)
    );
    if (options2?.maxBytes != null) {
      const size = (await (0, import_promises27.stat)(target)).size;
      if (size > options2.maxBytes) {
        throw new BoxFileTooLargeError(
          `download from box ${target} refused: ${size} bytes is over the ${options2.maxBytes}-byte limit`
        );
      }
    }
    return new Uint8Array(await (0, import_promises27.readFile)(target));
  }
  resolveBoxPath(boxPath) {
    return (0, import_node_path68.isAbsolute)(boxPath) ? boxPath : (0, import_node_path68.resolve)(resolveProjectDir(this.projectDir), boxPath);
  }
  displayWindowIndex() {
    const display = this.options.computerUseDisplay?.trim();
    const match2 = display == null ? null : /^:(\d+)(?:\.\d+)?$/.exec(display);
    if (match2 == null) return void 0;
    const windowIndex = Number.parseInt(match2[1] ?? "", 10);
    return Number.isSafeInteger(windowIndex) && windowIndex > 0 ? windowIndex : void 0;
  }
};


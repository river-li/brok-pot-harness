var MacComputerUseRPCError = class extends Error {
  constructor(message, options2) {
    super(message);
    this.name = "MacComputerUseRPCError";
    this.code = options2?.code;
    this.userFacing = options2?.userFacing === true;
    this.tool = options2?.tool;
  }
};
function userFacingMacComputerUseError(error41) {
  if (error41 instanceof MacComputerUseRPCError && error41.userFacing && error41.message.trim().length > 0 && !macComputerUseErrorContainsPath(error41.message)) {
    return error41.message.trim();
  }
  return void 0;
}
function isMacComputerUseCaptureBlocked(error41) {
  if (!(error41 instanceof MacComputerUseRPCError)) {
    return false;
  }
  return error41.tool === "computer_use_screenshot" || error41.code === "permission_required";
}
function redactMacComputerUseError(error41) {
  if (typeof error41 === "object" && error41 !== null && "code" in error41 && typeof error41.code === "string") {
    return error41.code;
  }
  if (error41 instanceof Error) {
    if (macComputerUseErrorContainsPath(error41.message)) {
      return error41.name;
    }
    return error41.message.length > 0 ? `${error41.name}: ${error41.message}` : error41.name;
  }
  return "unknown";
}
function macComputerUseErrorContainsPath(message) {
  if (message.includes(os9.homedir())) {
    return true;
  }
  return message.includes("node_modules") || message.includes("Application Support") || /\.wasm\b/.test(message) || /(?:^|[\s'`"])(?:\/|\.{1,2}\/|[A-Za-z]:[\\/]|\\\\)/.test(message);
}
var MacComputerUseRPCClient = class _MacComputerUseRPCClient {
  constructor(mode) {
    this.mode = mode;
  }
  /**
   * Cheap probe used to gate executor registration; does not launch anything.
   * True when the sidecar app is on disk or a live service.json already names
   * a socket — either is enough to register the Mac executor.
   */
  static isInstalled() {
    if ((0, import_node_fs42.existsSync)(_MacComputerUseRPCClient.serviceExecutablePath())) {
      return true;
    }
    return (0, import_node_fs42.existsSync)(_MacComputerUseRPCClient.serviceStatePath());
  }
  screenshot(ctx) {
    return this.callTool(ctx, "computer_use_screenshot", {});
  }
  click(ctx, click) {
    return this.callTool(ctx, "computer_use_click", {
      method: "coordinate",
      ...click.coordinate !== void 0 && {
        x: click.coordinate.x,
        y: click.coordinate.y
      },
      button: click.button,
      count: click.count,
      modifier_keys: click.modifierKeys
    });
  }
  scroll(ctx, scroll) {
    return this.callTool(ctx, "computer_use_scroll", {
      x: scroll.coordinate?.x,
      y: scroll.coordinate?.y,
      direction: scroll.direction,
      amount: scroll.amount,
      modifier_keys: scroll.modifierKeys
    });
  }
  move(ctx, coordinate2) {
    return this.callTool(ctx, "computer_use_mouse_move", {
      x: coordinate2.x,
      y: coordinate2.y
    });
  }
  mouseButton(ctx, action) {
    return this.callTool(ctx, "computer_use_mouse_button", {
      button: action.button,
      action: action.action
    });
  }
  drag(ctx, drag) {
    return this.callTool(ctx, "computer_use_drag", {
      button: drag.button,
      path: drag.path,
      modifier_keys: drag.modifierKeys
    });
  }
  typeText(ctx, text2) {
    return this.callTool(ctx, "computer_use_typing", { value: text2 });
  }
  pressKey(ctx, key) {
    return this.callTool(ctx, "computer_use_press_key", {
      key: key.key,
      hold_duration_ms: key.holdDurationMs
    });
  }
  checkPermissions(ctx) {
    return this.callTool(ctx, "computer_use_check_permissions", {});
  }
  /**
   * Acquire the sidecar's remote-control lease. Since sidecar 0.0.13 the
   * remote mode admits input tools (click/scroll/move/drag/type/key) only
   * under an active session; without one every input call fails with
   * `session_required` while screenshots keep working. The session also shows
   * the sidecar's "Cursor is controlling this Mac" overlay with a Stop button.
   * No-op in companion mode, where the sidecar ties input to the IDE instead.
   */
  async startControl(ctx) {
    if (this.mode !== "remote" || this.activeSessionId !== void 0) {
      return;
    }
    _MacComputerUseRPCClient.throwIfAborted(ctx.signal);
    const requestID = (0, import_node_crypto25.randomUUID)();
    const response = await this.sendWithRelaunchRetry(ctx, () => ({
      id: _MacComputerUseRPCClient.requestID,
      method: "control/start",
      requestID,
      mode: this.mode
    }), "control/start");
    if (response.error !== void 0) {
      throw _MacComputerUseRPCClient.rpcError(response);
    }
    if (response.sessionId === void 0) {
      throw new MacComputerUseRPCError("local-cua control/start returned no session");
    }
    this.activeSessionId = response.sessionId;
  }
  /**
   * Release the lease taken by `startControl` (hides the overlay). Safe to
   * call without one. Never throws: release runs after the batch's result is
   * already decided, and a dead sidecar has already dropped the lease.
   */
  async releaseControl(ctx) {
    const sessionId = this.activeSessionId;
    if (sessionId === void 0) {
      return;
    }
    this.activeSessionId = void 0;
    try {
      const state = await _MacComputerUseRPCClient.readServiceState();
      if (state === void 0) {
        return;
      }
      const response = await _MacComputerUseRPCClient.sendOnce(_MacComputerUseRPCClient.socketPathFrom(state), {
        id: _MacComputerUseRPCClient.requestID,
        method: "control/release",
        requestID: (0, import_node_crypto25.randomUUID)(),
        mode: this.mode,
        sessionId
      }, _MacComputerUseRPCClient.defaultCallTimeoutMs);
      if (response.error !== void 0) {
        throw _MacComputerUseRPCClient.rpcError(response);
      }
    } catch (error41) {
      _MacComputerUseRPCClient.logger.warn(ctx, "local-cua control release failed", { error: redactMacComputerUseError(error41) });
    }
  }
  async callTool(ctx, name17, args) {
    _MacComputerUseRPCClient.throwIfAborted(ctx.signal);
    const timeoutMs = _MacComputerUseRPCClient.defaultCallTimeoutMs;
    const response = await this.sendWithRelaunchRetry(ctx, () => {
      const startedAtEpochSeconds = Date.now() / 1e3;
      const sessionId = this.activeSessionId;
      return {
        id: _MacComputerUseRPCClient.requestID,
        method: "tools/call",
        requestID: (0, import_node_crypto25.randomUUID)(),
        name: name17,
        arguments: args,
        timeoutSeconds: timeoutMs / 1e3,
        startedAtEpochSeconds,
        deadlineEpochSeconds: startedAtEpochSeconds + timeoutMs / 1e3,
        mode: this.mode,
        ...sessionId !== void 0 && { sessionId }
      };
    }, name17);
    if (response.error !== void 0) {
      throw _MacComputerUseRPCClient.rpcError(response, name17);
    }
    const result = response.result;
    if (result === void 0) {
      throw new MacComputerUseRPCError(`local-cua tool ${name17} returned no result`, { tool: name17 });
    }
    if (result.isError) {
      const text2 = result.message.trim();
      throw new MacComputerUseRPCError(text2.length > 0 ? text2 : `local-cua tool ${name17} reported an error`, { tool: name17, userFacing: text2.length > 0 });
    }
    return result;
  }
  /**
   * Send one request, relaunching the sidecar and retrying once only when the
   * request could not have reached it. Retrying a timeout or a disconnect
   * after write could duplicate a real click/type.
   */
  async sendWithRelaunchRetry(ctx, buildRequest, label) {
    const timeoutMs = _MacComputerUseRPCClient.defaultCallTimeoutMs;
    const socketPath = await this.ensureSocketPath(ctx);
    _MacComputerUseRPCClient.throwIfAborted(ctx.signal);
    try {
      return await _MacComputerUseRPCClient.sendOnce(socketPath, buildRequest(), timeoutMs, ctx.signal);
    } catch (error41) {
      if (!_MacComputerUseRPCClient.isPreDeliveryConnectionError(error41)) {
        throw error41;
      }
      _MacComputerUseRPCClient.logger.warn(ctx, "local-cua callTool failed; relaunching and retrying", {
        tool: label,
        error: _MacComputerUseRPCClient.spawnErrorCode(error41)
      });
      const retryPath = await this.ensureSocketPath(ctx, true);
      _MacComputerUseRPCClient.throwIfAborted(ctx.signal);
      if (this.activeSessionId !== void 0) {
        this.activeSessionId = void 0;
        await this.startControl(ctx);
      }
      return await _MacComputerUseRPCClient.sendOnce(retryPath, buildRequest(), timeoutMs, ctx.signal);
    }
  }
  static rpcError(response, tool) {
    return new MacComputerUseRPCError(response.error, {
      code: response.errorCode,
      userFacing: true,
      tool
    });
  }
  async ensureSocketPath(ctx, forceLaunch = false) {
    _MacComputerUseRPCClient.throwIfAborted(ctx.signal);
    if (!forceLaunch) {
      const state2 = await _MacComputerUseRPCClient.readServiceState();
      if (state2) {
        return _MacComputerUseRPCClient.socketPathFrom(state2);
      }
    }
    await this.launchAndWait(ctx);
    const state = await _MacComputerUseRPCClient.readServiceState();
    if (!state) {
      throw new MacComputerUseRPCError("local-cua sidecar did not publish service.json after launch");
    }
    return _MacComputerUseRPCClient.socketPathFrom(state);
  }
  async launchAndWait(ctx) {
    const appPath = _MacComputerUseRPCClient.serviceAppPath();
    _MacComputerUseRPCClient.logger.info(ctx, "launching local-cua sidecar", _MacComputerUseRPCClient.sidecarLaunchLogFields(appPath));
    if (process.env[_MacComputerUseRPCClient.directLaunchEnv] === "1") {
      await _MacComputerUseRPCClient.spawnSidecarProcess(ctx, _MacComputerUseRPCClient.serviceExecutablePath(), [], { detached: true });
    } else {
      await _MacComputerUseRPCClient.spawnSidecarProcess(ctx, "/usr/bin/open", [
        "-g",
        appPath
      ]);
    }
    const deadline = Date.now() + _MacComputerUseRPCClient.launchReadyTimeoutMs;
    while (Date.now() < deadline) {
      _MacComputerUseRPCClient.throwIfAborted(ctx.signal);
      const state = await _MacComputerUseRPCClient.readServiceState();
      if (state) {
        try {
          const response = await _MacComputerUseRPCClient.sendOnce(_MacComputerUseRPCClient.socketPathFrom(state), { id: _MacComputerUseRPCClient.requestID, method: "ping" }, 2e3, ctx.signal);
          if ("ok" in response) {
            return;
          }
        } catch {
        }
      }
      await delay2(_MacComputerUseRPCClient.launchPollIntervalMs);
    }
    throw new MacComputerUseRPCError("local-cua sidecar did not become ready in time");
  }
  static isPreDeliveryConnectionError(error41) {
    const code = redactMacComputerUseError(error41);
    return code === "ENOENT" || code === "ECONNREFUSED";
  }
  static appSupportDirectory() {
    const override = process.env[_MacComputerUseRPCClient.appSupportOverrideEnv];
    if (override && override.length > 0) {
      return override;
    }
    return path18.join(os9.homedir(), "Library", "Application Support", _MacComputerUseRPCClient.appSupportFolder);
  }
  static serviceStatePath() {
    return path18.join(_MacComputerUseRPCClient.appSupportDirectory(), "service.json");
  }
  /**
   * Sidecar .app path. `CUA_SERVICE_APP` wins; otherwise the product-profile
   * install at `~/.cursor/cursor-computer-use/Cursor Computer Use.app`.
   */
  static serviceAppPath() {
    const override = process.env[_MacComputerUseRPCClient.serviceAppOverrideEnv];
    if (override && override.length > 0) {
      return override;
    }
    return path18.join(os9.homedir(), ".cursor", "cursor-computer-use", `${_MacComputerUseRPCClient.serviceAppBundleName}.app`);
  }
  /**
   * Launch logs must not include the raw install path: it embeds the
   * operator home directory. Allowlist the known bundle name and hash
   * the original path so support can correlate without the raw string.
   */
  static sidecarLaunchLogFields(appPath) {
    const expectedName = `${_MacComputerUseRPCClient.serviceAppBundleName}.app`;
    return {
      appName: path18.basename(appPath) === expectedName ? expectedName : "custom",
      appPathHash: (0, import_node_crypto25.createHash)("sha256").update(appPath).digest("hex"),
      usingOverride: Boolean(process.env[_MacComputerUseRPCClient.serviceAppOverrideEnv])
    };
  }
  static spawnErrorCode(error41) {
    return redactMacComputerUseError(error41);
  }
  static socketError(error41) {
    const code = redactMacComputerUseError(error41);
    return new MacComputerUseRPCError(`local-cua RPC connection failed: ${code}`, { code });
  }
  static serviceExecutablePath() {
    return path18.join(_MacComputerUseRPCClient.serviceAppPath(), "Contents", "MacOS", "CUCursorService");
  }
  /**
   * Attach an `error` listener before the child can emit ENOENT. Node turns
   * an unhandled spawn error into an uncaught exception, which would take
   * down the exec-daemon instead of fail-softing computer use.
   */
  static spawnSidecarProcess(ctx, command, args, options2) {
    return new Promise((resolve29, reject2) => {
      const child = (0, import_node_child_process8.spawn)(command, [...args], {
        detached: options2?.detached === true,
        stdio: "ignore"
      });
      const fail = (error41) => {
        reject2(new MacComputerUseRPCError(`local-cua sidecar launch failed: ${_MacComputerUseRPCClient.spawnErrorCode(error41)}`));
      };
      child.once("error", fail);
      child.once("spawn", () => {
        child.removeListener("error", fail);
        child.on("error", (error41) => {
          _MacComputerUseRPCClient.logger.warn(ctx, "local-cua sidecar process error after launch", {
            error: _MacComputerUseRPCClient.spawnErrorCode(error41)
          });
        });
        child.unref();
        resolve29();
      });
    });
  }
  static async readServiceState() {
    try {
      const raw = await (0, import_promises38.readFile)(_MacComputerUseRPCClient.serviceStatePath(), "utf8");
      return MacRPCProtocol.parseServiceState(raw);
    } catch (error41) {
      if (error41 instanceof Error && "code" in error41 && error41.code === "ENOENT") {
        return void 0;
      }
      if (error41 instanceof MacRPCProtocolError) {
        return void 0;
      }
      throw new MacComputerUseRPCError("local-cua service state could not be read");
    }
  }
  static socketPathFrom(state) {
    return state.rpcSocketPath;
  }
  static abortError(signal) {
    return signal.reason instanceof Error ? signal.reason : new MacComputerUseRPCError("local-cua RPC aborted");
  }
  static throwIfAborted(signal) {
    if (signal.aborted) {
      throw _MacComputerUseRPCClient.abortError(signal);
    }
  }
  /** Send one newline-delimited JSON-RPC request over one connection. */
  static sendOnce(socketPath, request3, timeoutMs, signal) {
    if (signal?.aborted) {
      return Promise.reject(_MacComputerUseRPCClient.abortError(signal));
    }
    return new Promise((resolve29, reject2) => {
      let settled = false;
      let bufferedChunks = [];
      let bufferedBytes = 0;
      let requestDelivered = false;
      const socket = (0, import_node_net2.createConnection)({ path: socketPath });
      const finish = (fn) => {
        if (settled) {
          return;
        }
        settled = true;
        clearTimeout(timer);
        signal?.removeEventListener("abort", onAbort);
        socket.destroy();
        fn();
      };
      const onAbort = () => {
        finish(() => reject2(signal === void 0 ? new MacComputerUseRPCError("local-cua RPC aborted") : _MacComputerUseRPCClient.abortError(signal)));
      };
      const timer = setTimeout(() => {
        finish(() => reject2(new MacComputerUseRPCError(`local-cua RPC timed out after ${timeoutMs}ms`)));
      }, timeoutMs);
      signal?.addEventListener("abort", onAbort, { once: true });
      if (signal?.aborted) {
        onAbort();
        return;
      }
      socket.on("connect", () => {
        socket.write(`${JSON.stringify(request3)}
`, (error41) => {
          if (error41 != null) {
            finish(() => reject2(_MacComputerUseRPCClient.socketError(error41)));
            return;
          }
          requestDelivered = true;
        });
      });
      socket.on("data", (chunk) => {
        const newlineIndex = chunk.indexOf(10);
        const frameBytes = bufferedBytes + (newlineIndex < 0 ? chunk.length : newlineIndex);
        if (frameBytes > MacRPCProtocol.responseMaxBytes) {
          finish(() => reject2(new MacComputerUseRPCError("local-cua RPC response exceeded the size limit")));
          return;
        }
        if (newlineIndex < 0) {
          bufferedChunks.push(chunk);
          bufferedBytes += chunk.length;
          return;
        }
        bufferedChunks.push(chunk.subarray(0, newlineIndex));
        const line = Buffer.concat(bufferedChunks, frameBytes);
        bufferedChunks = [];
        bufferedBytes = 0;
        try {
          const parsed2 = MacRPCProtocol.parseResponse({
            line,
            expectedID: _MacComputerUseRPCClient.requestID
          });
          finish(() => resolve29(parsed2));
        } catch (error41) {
          finish(() => reject2(error41));
        }
      });
      socket.on("error", (error41) => {
        if (requestDelivered) {
          finish(() => reject2(new MacComputerUseRPCError("local-cua RPC connection failed after request delivery")));
          return;
        }
        finish(() => reject2(_MacComputerUseRPCClient.socketError(error41)));
      });
      socket.on("close", () => {
        const message = bufferedBytes > 0 ? "local-cua RPC response ended without a newline" : requestDelivered ? "local-cua RPC connection closed after request delivery" : "local-cua RPC connection closed";
        finish(() => reject2(new MacComputerUseRPCError(message)));
      });
    });
  }
};
MacComputerUseRPCClient.logger = createLogger("local-cua:rpc");
MacComputerUseRPCClient.serviceAppBundleName = "Cursor Computer Use";
MacComputerUseRPCClient.appSupportFolder = "cursor-computer-use";
MacComputerUseRPCClient.appSupportOverrideEnv = "CUA_APP_SUPPORT_DIR";
MacComputerUseRPCClient.serviceAppOverrideEnv = "CUA_SERVICE_APP";
MacComputerUseRPCClient.directLaunchEnv = "CUA_DIRECT_LAUNCH";
MacComputerUseRPCClient.defaultCallTimeoutMs = 45e3;
MacComputerUseRPCClient.launchReadyTimeoutMs = 8e3;
MacComputerUseRPCClient.launchPollIntervalMs = 200;
MacComputerUseRPCClient.requestID = 1;

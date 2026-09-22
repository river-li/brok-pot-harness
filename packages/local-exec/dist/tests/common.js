/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/local-exec/dist/tests/common.js
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var MockIgnoreService = class {
  isCursorIgnored(_filePath) {
    return Promise.resolve(false);
  }
  isGitIgnored(_filePath) {
    return Promise.resolve(false);
  }
  isIgnoredByAny(_filePath) {
    return Promise.resolve(false);
  }
  listCursorIgnoreFilesByRoot(_root) {
    return Promise.resolve([]);
  }
  isRepoBlocked(_filePath) {
    return Promise.resolve(false);
  }
  getCursorIgnoreMapping() {
    return Promise.resolve({});
  }
  getGitIgnoreMapping() {
    return Promise.resolve({});
  }
  getRepoBlockExcludeGlobs(_rootDirectory) {
    return Promise.resolve([]);
  }
};
var MockPendingDecisionProvider = class {
  requestApproval(_operation) {
    return Promise.resolve({ approved: true });
  }
};
var MockPermissionsService = class {
  constructor() {
    this._shouldBlockShellCommandImpl = async (_ctx, _cmd, _opts, requestedPolicy) => ({
      kind: "allow",
      policy: requestedPolicy ?? { type: "insecure_none" }
    });
    this._shouldEnforceShellInvariantBlocksImpl = async () => ({
      kind: "allow"
    });
    this._isShellCommandFullyAllowlistedImpl = async () => false;
    this._isMcpFullyAllowlistedImpl = async () => false;
  }
  shouldBlockRead(_filePath) {
    return Promise.resolve(false);
  }
  shouldBlockWrite(_ctx, _filePath, _newContents) {
    return Promise.resolve(false);
  }
  shouldBlockShellCommand(ctx, command, options2, requestedPolicy) {
    return this._shouldBlockShellCommandImpl(ctx, command, options2, requestedPolicy);
  }
  shouldEnforceShellInvariantBlocks(ctx, options2, requestedPolicy) {
    return this._shouldEnforceShellInvariantBlocksImpl(ctx, options2, requestedPolicy);
  }
  setShouldEnforceShellInvariantBlocks(impl) {
    this._shouldEnforceShellInvariantBlocksImpl = impl;
  }
  isShellCommandFullyAllowlisted(ctx, command, options2) {
    return this._isShellCommandFullyAllowlistedImpl(ctx, command, options2);
  }
  setIsShellCommandFullyAllowlisted(impl) {
    this._isShellCommandFullyAllowlistedImpl = impl;
  }
  shouldBlockMcp(_ctx, _args) {
    return Promise.resolve(false);
  }
  isMcpFullyAllowlisted(ctx, options2) {
    return this._isMcpFullyAllowlistedImpl(ctx, options2);
  }
  isWebFetchFullyAllowlisted(_ctx, _options) {
    return Promise.resolve(false);
  }
  setIsMcpFullyAllowlisted(impl) {
    this._isMcpFullyAllowlistedImpl = impl;
  }
  addToAllowList(_ctx, _kind, _value) {
    return Promise.resolve();
  }
  addToDenyList(_ctx, _kind, _value) {
    return Promise.resolve();
  }
  setShouldBlockShellCommand(impl) {
    this._shouldBlockShellCommandImpl = impl;
  }
};


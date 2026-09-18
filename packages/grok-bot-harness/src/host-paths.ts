var SAND_DATA_ROOT_ENV = "SAND_DATA_ROOT";
var SAND_PRODUCTION_DATA_DIRNAME = ".grokbot";
var SAND_USER_DATA_DIR_ENV = "SAND_USER_DATA_DIR";
var SAND_DATA_DIRNAME = "sand-data";
var USER_DATA_DIR_FLAG = "--user-data-dir";
var SAND_BOX_HOME_DIR = "/home/box";
var SAND_BOX_DATA_ROOT = `${SAND_BOX_HOME_DIR}/${SAND_DATA_DIRNAME}`;
var SAND_BOX_MODEL_VISIBLE_DATA_ROOT = `${SAND_BOX_HOME_DIR}/agent-data`;
function toModelVisibleText(text2) {
  return text2.replaceAll(SAND_BOX_DATA_ROOT, SAND_BOX_MODEL_VISIBLE_DATA_ROOT);
}
async function lstatIfExists(path31) {
  try {
    return await (0, import_promises2.lstat)(path31);
  } catch (error41) {
    if (findSystemErrno(error41) !== "ENOENT") throw error41;
    return null;
  }
}
async function ensureDataRootAlias(args) {
  const { dataRoot, aliasPath } = args;
  const existing = await lstatIfExists(aliasPath);
  if (existing != null) {
    if (!existing.isSymbolicLink()) {
      throw new Error(`Cannot create data-root alias at ${aliasPath}: path is not a symbolic link`);
    }
    if (await (0, import_promises2.readlink)(aliasPath) === dataRoot) return;
    await (0, import_promises2.rm)(aliasPath);
  }
  await (0, import_promises2.symlink)(dataRoot, aliasPath);
}
function readUserDataDirArg(argv) {
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === USER_DATA_DIR_FLAG) {
      const next = argv[i + 1];
      return next != null && !next.startsWith("--") ? next : null;
    }
    const prefix = `${USER_DATA_DIR_FLAG}=`;
    if (arg.startsWith(prefix)) return arg.slice(prefix.length);
  }
  return null;
}
function resolveSandUserDataDir(argv = [], env = process.env, cwd = process.cwd()) {
  const raw = readUserDataDirArg(argv) ?? env[SAND_USER_DATA_DIR_ENV];
  const trimmed = raw?.trim();
  if (trimmed == null || trimmed.length === 0) return null;
  return (0, import_node_path2.isAbsolute)(trimmed) ? trimmed : (0, import_node_path2.resolve)(cwd, trimmed);
}
function getSandProductionRootDir(homeDir = (0, import_node_os.homedir)()) {
  return (0, import_node_path2.join)(homeDir, SAND_PRODUCTION_DATA_DIRNAME);
}
function resolveSandDataRootOverride(env = process.env) {
  const override = env[SAND_DATA_ROOT_ENV]?.trim();
  return override != null && override.length > 0 && (0, import_node_path2.isAbsolute)(override) ? override : null;
}
function getSandRootDir(homeDir = (0, import_node_os.homedir)()) {
  const override = resolveSandDataRootOverride();
  if (override != null) return override;
  const userDataDir = resolveSandUserDataDir([], process.env);
  if (userDataDir != null) {
    return (0, import_node_path2.join)(userDataDir, SAND_DATA_DIRNAME);
  }
  const variant = getSandVariant();
  return variant === "sand" ? getSandProductionRootDir(homeDir) : (0, import_node_path2.join)(homeDir, ".cursor", variant);
}
function sandDataRelativeTail(storedPath, options2) {
  const match2 = /(?:[/\\]\.cursor[/\\]sand(?:-[^/\\]+)?|[/\\]\.grokbot)[/\\](.+)$/.exec(storedPath);
  if (match2?.[1] != null) return match2[1];
  if (options2.acceptBoxModelVisibleAlias !== true) return null;
  if (!isPathWithin(SAND_BOX_MODEL_VISIBLE_DATA_ROOT, storedPath)) return null;
  const rest = (0, import_node_path2.relative)(SAND_BOX_MODEL_VISIBLE_DATA_ROOT, storedPath);
  return rest.length === 0 ? null : rest;
}
function reanchorSandPath(storedPath, options2 = {}) {
  const root = getSandRootDir();
  if (isPathWithin(root, storedPath, { isInclusive: true })) return storedPath;
  const tail = sandDataRelativeTail(storedPath, options2);
  if (tail == null) return storedPath;
  const segments = tail.split(/[/\\]+/);
  if (segments.some((segment) => segment === "." || segment === "..")) {
    return storedPath;
  }
  return (0, import_node_path2.join)(root, ...segments);
}
function getGatewayDiscoveryPath(homeDir = (0, import_node_os.homedir)()) {
  return (0, import_node_path2.join)(getSandRootDir(homeDir), "gateway.json");
}
function getHostLockPath(homeDir = (0, import_node_os.homedir)()) {
  return (0, import_node_path2.join)(getSandRootDir(homeDir), "host.lock");
}
function getHostSecretsPath(homeDir = (0, import_node_os.homedir)()) {
  return (0, import_node_path2.join)(getSandRootDir(homeDir), "host-secrets.json");
}
var HOST_UPGRADE_MARKER_BASENAME = ".sand-host-upgrade.json";
var HOST_CRASH_MARKER_BASENAME = ".sand-host-crash.json";
function getHostUpgradeMarkerPath(homeDir = (0, import_node_os.homedir)()) {
  return (0, import_node_path2.join)(getSandRootDir(homeDir), HOST_UPGRADE_MARKER_BASENAME);
}
function getHostCrashMarkerPath(homeDir = (0, import_node_os.homedir)()) {
  return (0, import_node_path2.join)(getSandRootDir(homeDir), HOST_CRASH_MARKER_BASENAME);
}
var HTTP_PROXY_NAME_OVERRIDE_BASENAME = ".sand-http-proxy-name.json";
function getHttpProxyNameOverridePath(homeDir = (0, import_node_os.homedir)()) {
  return (0, import_node_path2.join)(getSandRootDir(homeDir), HTTP_PROXY_NAME_OVERRIDE_BASENAME);
}

/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/local-exec/dist/services/common.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
async function findGitRoot(ctx, gitExecutor, startPath) {
  try {
    const result = await gitExecutor.exec(ctx, startPath, ["rev-parse", "--show-toplevel"], {
      caller: "findGitRoot"
    });
    return result.stdout.trim();
  } catch {
    return null;
  }
}
async function getGitRemoteUrl(ctx, gitExecutor, gitRoot) {
  try {
    const result = await gitExecutor.exec(ctx, gitRoot, ["config", "--get", "remote.origin.url"], {
      caller: "getGitRemoteUrl"
    });
    return result.stdout.trim();
  } catch {
    return void 0;
  }
}
function toHostPath(rawUrl) {
  let url2 = rawUrl.trim();
  if (url2.startsWith("git@")) {
    url2 = `https://${url2.slice("git@".length).replace(":", "/")}`;
  }
  if (/^[a-z][a-z0-9+.-]*:\/\//i.test(url2) && !/^https?:\/\//i.test(url2)) {
    url2 = url2.replace(/^[a-z][a-z0-9+.-]*:\/\//i, "https://");
  }
  if (!/^https?:\/\//i.test(url2)) {
    url2 = `https://${url2}`;
  }
  try {
    const parsed2 = new URL(url2);
    const pathname = parsed2.pathname.replace(/\/+$/, "").replace(/\.git$/i, "").replace(/\/+$/, "");
    return parsed2.hostname + pathname;
  } catch {
    url2 = url2.replace(/^https?:\/\//i, "");
    url2 = url2.replace(/[?#].*$/, "");
    url2 = url2.replace(/\/+$/, "");
    url2 = url2.replace(/\.git$/i, "");
    url2 = url2.replace(/\/+$/, "");
    return url2;
  }
}
var DEFAULT_GLOB_IGNORE_DIRS = [
  "**/node_modules/**",
  "**/.git/**",
  "**/.turbo/**",
  "**/.next/**",
  "**/.cache/**",
  "**/.pnpm/**",
  "**/.yarn/**",
  "**/dist/**",
  "**/build/**",
  "**/out/**",
  "**/target/**",
  "**/.vscode/**",
  "**/.idea/**",
  "**/venv/**",
  "**/__pycache__/**",
  "**/logs/**",
  "**/tmp/**",
  "**/temp/**"
];


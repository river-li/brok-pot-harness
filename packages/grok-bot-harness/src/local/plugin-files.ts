/** Local bundle snapshots. Runtime state and all referenced resources stay in
 * the project's data directory; importing never enables or executes a plugin. */
import { createHash, randomUUID } from "node:crypto";
import {
  basename,
  dirname,
  isAbsolute,
  join,
  relative,
  resolve,
  sep,
} from "node:path";
import {
  chmodSync,
  copyFileSync,
  existsSync,
  lstatSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  realpathSync,
  renameSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs";

export type LocalPluginPointer = { version: 1; slug: string; digest: string };
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const digestPattern = /^[a-f0-9]{64}$/;
export function localPluginId(slug: string) {
  return String(
    2n ** 48n +
      BigInt(
        "0x" + createHash("sha256").update(slug).digest("hex").slice(0, 12),
      ),
  );
}
export function localPluginServerId(slug: string, name: string) {
  return String(
    2n ** 49n +
      BigInt(
        "0x" +
          createHash("sha256")
            .update(slug + "\0" + name)
            .digest("hex")
            .slice(0, 12),
      ),
  );
}
export function localPluginRoot(dataRoot: string) {
  return join(dataRoot, "plugins", "local");
}
export function writeAtomicJson(file: string, value: unknown, mode = 0o600) {
  mkdirSync(dirname(file), { recursive: true });
  const temporary = file + "." + randomUUID() + ".tmp";
  try {
    writeFileSync(temporary, JSON.stringify(value, null, 2) + "\n", {
      mode,
      flag: "wx",
    });
    renameSync(temporary, file);
  } finally {
    rmSync(temporary, { force: true });
  }
}
function within(root: string, file: string) {
  const part = relative(root, file);
  return (
    part === "" ||
    (!isAbsolute(part) && part !== ".." && !part.startsWith(".." + sep))
  );
}
export function pluginBundlePath(
  dataRoot: string,
  pointer: LocalPluginPointer,
) {
  if (
    pointer.version !== 1 ||
    !slugPattern.test(pointer.slug) ||
    !digestPattern.test(pointer.digest)
  )
    throw Error("Invalid local plugin snapshot.");
  const root = resolve(localPluginRoot(dataRoot));
  const file = join(root, pointer.slug, pointer.digest);
  if (!within(realpathSync(root), realpathSync(file)))
    throw Error("Local plugin snapshot escapes its directory.");
  return file;
}
export function listLocalPluginPointers(
  dataRoot: string,
): LocalPluginPointer[] {
  const root = localPluginRoot(dataRoot);
  if (!existsSync(root)) return [];
  const entries: LocalPluginPointer[] = [];
  const ids = new Set<string>();
  for (const entry of readdirSync(root, { withFileTypes: true }).sort((a, b) =>
    a.name.localeCompare(b.name),
  )) {
    if (!entry.isDirectory() || !slugPattern.test(entry.name)) continue;
    const pointer = JSON.parse(
      readFileSync(join(root, entry.name, "current.json"), "utf8"),
    ) as LocalPluginPointer;
    if (pointer.slug !== entry.name)
      throw Error("Local plugin snapshot name mismatch.");
    pluginBundlePath(dataRoot, pointer);
    const id = localPluginId(pointer.slug);
    if (ids.has(id))
      throw Error("Local plugin ID collision; import with another name.");
    ids.add(id);
    entries.push(pointer);
  }
  return entries;
}
export function importLocalPlugin(
  dataRoot: string,
  source: string,
  name?: string,
) {
  const input = realpathSync(source);
  if (!statSync(input).isDirectory()) throw Error("Import a plugin directory.");
  const slug =
    name ??
    basename(input)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  if (!slugPattern.test(slug))
    throw Error(
      "Plugin name must use lowercase letters, numbers and single hyphens.",
    );
  mkdirSync(localPluginRoot(dataRoot), { recursive: true, mode: 0o755 });
  const root = realpathSync(localPluginRoot(dataRoot));
  if (within(input, root) || within(root, input))
    throw Error("Import source and local plugin storage must be separate.");
  const stage = join(root, ".import-" + randomUUID());
  mkdirSync(stage, { mode: 0o755 });
  const hash = createHash("sha256");
  function copy(
    directory: string,
    destination: string,
    logical: string,
    ancestors: Set<string>,
  ) {
    const real = realpathSync(directory);
    if (!within(input, real))
      throw Error(
        "A plugin symlink points outside its source directory. Copy that resource into the plugin first.",
      );
    if (ancestors.has(real)) throw Error("Plugin symlink cycle.");
    const next = new Set(ancestors).add(real);
    for (const entry of readdirSync(real, { withFileTypes: true }).sort(
      (a, b) => a.name.localeCompare(b.name),
    )) {
      if (entry.name === ".git") continue;
      const from = join(real, entry.name),
        to = join(destination, entry.name),
        key = logical + entry.name;
      const actual = realpathSync(from);
      if (!within(input, actual))
        throw Error("A plugin symlink points outside its source directory.");
      const stats = statSync(actual);
      if (stats.isDirectory()) {
        mkdirSync(to, { mode: 0o755 });
        hash.update("dir\0" + key + "\0");
        copy(actual, to, key + "/", next);
      } else if (stats.isFile()) {
        const mode = stats.mode & 0o111 ? 0o755 : 0o644;
        copyFileSync(actual, to);
        chmodSync(to, mode);
        hash.update("file\0" + key + "\0" + mode + "\0");
        hash.update(readFileSync(to));
        hash.update("\0");
      } else
        throw Error(
          "Plugin bundles may contain only directories and regular files.",
        );
    }
  }
  try {
    copy(input, stage, "", new Set());
    const digest = hash.digest("hex");
    const folder = join(root, slug),
      destination = join(folder, digest);
    mkdirSync(folder, { recursive: true, mode: 0o755 });
    if (lstatSync(folder).isSymbolicLink())
      throw Error("Plugin storage directory cannot be a symlink.");
    if (!existsSync(destination)) renameSync(stage, destination);
    const pointer: LocalPluginPointer = { version: 1, slug, digest };
    writeAtomicJson(join(folder, "current.json"), pointer, 0o644);
    return { pluginId: localPluginId(slug), ...pointer, path: destination };
  } finally {
    rmSync(stage, { recursive: true, force: true });
  }
}

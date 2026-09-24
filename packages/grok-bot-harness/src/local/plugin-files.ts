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
  unlinkSync,
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

export type LocalPluginBundleHash = {
  digest: string;
  files: Record<string, string>;
};

/**
 * Hash the bytes and executable modes in a plugin snapshot. The digest in a
 * directory name is only a label: callers that make update/removal decisions
 * must compare it with a fresh walk of the files.
 */
export function hashLocalPluginDirectory(directory: string): LocalPluginBundleHash {
  const root = realpathSync(directory);
  const hash = createHash("sha256");
  const files: Record<string, string> = {};
  const withinRoot = (file: string) => {
    const part = relative(root, file);
    return (
      part === "" ||
      (!isAbsolute(part) && part !== ".." && !part.startsWith(".." + sep))
    );
  };

  function visit(folder: string, logical: string, ancestors: Set<string>) {
    const real = realpathSync(folder);
    if (!withinRoot(real)) throw Error("Plugin symlink points outside its snapshot.");
    if (ancestors.has(real)) throw Error("Plugin symlink cycle.");
    const next = new Set(ancestors).add(real);
    for (const entry of readdirSync(real, { withFileTypes: true }).sort((a, b) =>
      a.name.localeCompare(b.name),
    )) {
      if (entry.name === ".git") continue;
      if (entry.isSymbolicLink())
        throw Error("Plugin snapshots cannot contain symlinks.");
      const from = join(real, entry.name);
      if (!withinRoot(realpathSync(from)))
        throw Error("Plugin snapshot path escapes its directory.");
      const key = logical + entry.name;
      const stats = statSync(from);
      if (stats.isDirectory()) {
        hash.update("dir\0" + key + "\0");
        visit(from, key + "/", next);
      } else if (stats.isFile()) {
        const mode = stats.mode & 0o111 ? 0o755 : 0o644;
        const bytes = readFileSync(from);
        hash.update("file\0" + key + "\0" + mode + "\0");
        hash.update(bytes);
        hash.update("\0");
        files[key] =
          createHash("sha256").update(bytes).digest("hex") + ":" + mode.toString(8);
      } else {
        throw Error("Plugin snapshots may contain only directories and regular files.");
      }
    }
  }

  visit(root, "", new Set());
  return { digest: hash.digest("hex"), files };
}

/** Store an immutable snapshot without changing the current catalog pointer. */
export function snapshotLocalPlugin(
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
      } else {
        throw Error(
          "Plugin bundles may contain only directories and regular files.",
        );
      }
    }
  }
  try {
    copy(input, stage, "", new Set());
    const digest = hash.digest("hex");
    const pointer: LocalPluginPointer = { version: 1, slug, digest };
    const folder = join(root, slug),
      destination = join(folder, digest);
    mkdirSync(folder, { recursive: true, mode: 0o755 });
    if (lstatSync(folder).isSymbolicLink())
      throw Error("Plugin storage directory cannot be a symlink.");
    if (existsSync(destination)) {
      const actual = hashLocalPluginDirectory(destination);
      if (actual.digest !== digest)
        throw Error(
          "An existing plugin snapshot was edited; refusing to reuse its digest path.",
        );
      rmSync(stage, { recursive: true, force: true });
    } else {
      renameSync(stage, destination);
    }
    return { ...pointer, path: destination };
  } finally {
    rmSync(stage, { recursive: true, force: true });
  }
}

/** Advance the discoverable local snapshot pointer after a validated commit. */
export function writeLocalPluginPointer(
  dataRoot: string,
  pointer: LocalPluginPointer,
) {
  pluginBundlePath(dataRoot, pointer);
  const committed = {
    version: pointer.version,
    slug: pointer.slug,
    digest: pointer.digest,
  } satisfies LocalPluginPointer;
  writeAtomicJson(
    join(localPluginRoot(dataRoot), pointer.slug, "current.json"),
    committed,
    0o644,
  );
}
export function removeLocalPluginPointer(dataRoot: string, slug: string) {
  if (!slugPattern.test(slug)) throw Error("Invalid local plugin snapshot name.");
  const pointerFile = join(localPluginRoot(dataRoot), slug, "current.json");
  if (existsSync(pointerFile)) unlinkSync(pointerFile);
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
    const pointerFile = join(root, entry.name, "current.json");
    // A snapshot is staged before the install record commits. Without a
    // pointer it is deliberately invisible to the retained local plugin
    // catalog; a crash during preview/validation must not hide other entries.
    if (!existsSync(pointerFile)) continue;
    const pointer = JSON.parse(
      readFileSync(pointerFile, "utf8"),
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
  const pointer = snapshotLocalPlugin(dataRoot, source, name);
  writeLocalPluginPointer(dataRoot, pointer);
  return { pluginId: localPluginId(pointer.slug), ...pointer };
}

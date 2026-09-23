var nodeLocalBrainDocsIo = {
  readdir: (path31) => (0, import_promises79.readdir)(path31, { withFileTypes: true }),
  readFile: (path31) => (0, import_promises79.readFile)(path31),
  stat: (path31) => (0, import_promises79.stat)(path31),
  rm: (path31) => (0, import_promises79.rm)(path31, { recursive: true, force: true })
};
function createLocalBrainDocsFs(io2 = nodeLocalBrainDocsIo) {
  async function statIfPresent(path31) {
    try {
      return await io2.stat(path31);
    } catch (error42) {
      if (isMissingPath2(findSystemErrno(error42))) return null;
      throw error42;
    }
  }
  async function collectFile(path31, out) {
    let bytes;
    try {
      bytes = await io2.readFile(path31);
    } catch (error42) {
      if (isMissingPath2(findSystemErrno(error42))) return;
      throw error42;
    }
    out.set(path31, bytes.includes(0) ? null : Buffer.from(bytes).toString("utf8"));
  }
  async function collectDirectory(dir, out) {
    let entries;
    try {
      entries = await io2.readdir(dir);
    } catch (error42) {
      if (isMissingPath2(findSystemErrno(error42))) return;
      throw error42;
    }
    for (const entry of entries) {
      const path31 = (0, import_node_path175.join)(dir, entry.name);
      if (entry.isFile()) await collectFile(path31, out);
      else if (entry.isDirectory()) await collectDirectory(path31, out);
    }
  }
  async function collect(root, out) {
    const info2 = await statIfPresent(root);
    if (info2 === null) return;
    if (info2.isFile()) await collectFile(root, out);
    else if (info2.isDirectory()) await collectDirectory(root, out);
  }
  return {
    async readTree(roots) {
      const out = /* @__PURE__ */ new Map();
      for (const root of roots) await collect(root, out);
      return out;
    },
    async readFile(path31) {
      try {
        return new Uint8Array(await io2.readFile(path31));
      } catch (error42) {
        if (isMissingPath2(findSystemErrno(error42))) return null;
        throw error42;
      }
    },
    async writeFile(path31, content) {
      await writeFileAtomic(path31, content);
    },
    async removePath(path31) {
      if (await statIfPresent(path31) === null) return false;
      await io2.rm(path31);
      return true;
    },
    async listDirectories(path31) {
      try {
        return (await io2.readdir(path31)).filter((entry) => entry.isDirectory()).map((entry) => entry.name).sort();
      } catch (error42) {
        if (isMissingPath2(findSystemErrno(error42))) return [];
        throw error42;
      }
    }
  };
}

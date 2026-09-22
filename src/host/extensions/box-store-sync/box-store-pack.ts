var BOX_STORE_PACKS_PREFIX = "packs";
var BOX_STORE_PACK_INDEX_KEY = "packs/index.json";
var BOX_STORE_PACK_RETIRED_KEY = "packs/retired.json";
var PACK_INDEX_VERSION = 1;
var PACK_RETIRED_VERSION = 1;
var PACK_MEMBER_MAX_BYTES = 8 * 1024 * 1024;
var PACK_MAX_MEMBER_SIZE_SUM = 256 * 1024 * 1024;
var PACK_MEMBER_CLEN_BOUND = (size) => size + 4096 + Math.ceil(size / 512);
var PACK_OBJECT_MAX_BYTES = 320 * 1024 * 1024;
var PACK_INDEX_MAX_BYTES = 64 * 1024 * 1024;
var packMemberSchema = external_exports.object({
  sha: external_exports.string().min(1),
  size: external_exports.number().int().nonnegative().max(PACK_MEMBER_MAX_BYTES),
  offset: external_exports.number().int().nonnegative(),
  clen: external_exports.number().int().nonnegative(),
  vmtime: external_exports.number().int().nonnegative()
}).refine((member) => member.clen <= PACK_MEMBER_CLEN_BOUND(member.size), {
  message: "member clen exceeds the gzip expansion bound for its size"
});
var packEntrySchema = external_exports.object({
  id: external_exports.string().min(1),
  bytes: external_exports.number().int().nonnegative().max(PACK_OBJECT_MAX_BYTES),
  members: external_exports.array(packMemberSchema)
}).superRefine((pack, ctx) => {
  let sizeSum = 0;
  for (const member of pack.members) {
    if (member.offset + member.clen > pack.bytes) {
      ctx.addIssue({
        code: external_exports.ZodIssueCode.custom,
        message: "member range exceeds the pack object size"
      });
      return;
    }
    sizeSum += member.size;
  }
  if (sizeSum > PACK_MAX_MEMBER_SIZE_SUM) {
    ctx.addIssue({
      code: external_exports.ZodIssueCode.custom,
      message: "member size sum exceeds the pack cap"
    });
  }
});
var packIndexSchema = external_exports.object({
  version: external_exports.number().int(),
  maxVmtime: external_exports.number().int().nonnegative(),
  packs: external_exports.array(packEntrySchema)
});
var packRetiredSchema = external_exports.object({
  version: external_exports.number().int(),
  retired: external_exports.array(external_exports.string().min(1))
});
function parsePackIndex(raw) {
  let parsed2;
  try {
    parsed2 = JSON.parse(raw);
  } catch {
    return null;
  }
  const result = packIndexSchema.safeParse(parsed2);
  if (!result.success || result.data.version !== PACK_INDEX_VERSION) {
    return null;
  }
  return result.data;
}
function parsePackRetired(raw) {
  let parsed2;
  try {
    parsed2 = JSON.parse(raw);
  } catch {
    return null;
  }
  const result = packRetiredSchema.safeParse(parsed2);
  if (!result.success || result.data.version !== PACK_RETIRED_VERSION) {
    return null;
  }
  return result.data.retired;
}
function serializePackRetired(retired) {
  return JSON.stringify({ version: PACK_RETIRED_VERSION, retired });
}
async function buildPackFile(destPath, sources, shouldAbort) {
  const members = [];
  let offset = 0;
  let skipped2 = 0;
  const out = (0, import_node_fs12.createWriteStream)(destPath);
  let outError;
  out.on("error", (error42) => {
    outError ??= error42;
  });
  const write2 = (buf) => new Promise((resolve29, reject2) => {
    out.write(buf, (error42) => error42 == null ? resolve29() : reject2(error42));
  });
  try {
    for (const source of sources) {
      if (shouldAbort?.() === true) {
        out.destroy();
        return null;
      }
      let bytes;
      try {
        bytes = await (0, import_promises16.readFile)(source.absPath);
      } catch {
        skipped2 += 1;
        continue;
      }
      if (bytes.byteLength !== source.size || (0, import_node_crypto9.createHash)("sha256").update(bytes).digest("hex") !== source.sha) {
        skipped2 += 1;
        continue;
      }
      const compressed = (0, import_node_zlib.gzipSync)(bytes);
      await write2(compressed);
      members.push({
        sha: source.sha,
        size: source.size,
        offset,
        clen: compressed.byteLength,
        vmtime: source.vmtime
      });
      offset += compressed.byteLength;
    }
    await new Promise((resolve29) => {
      out.end(() => resolve29());
    });
    if (outError != null) throw outError;
  } catch (error42) {
    out.destroy();
    throw error42;
  }
  const fileBytes = (await (0, import_promises16.stat)(destPath)).size;
  return { members, fileBytes, skipped: skipped2 };
}
async function extractPackMembers(args) {
  const handle = await (0, import_promises16.open)(args.packPath, "r");
  const concurrency = Math.max(1, args.concurrency ?? 1);
  let extracted = 0;
  let mismatched = 0;
  let next = 0;
  const extractOne = async (member) => {
    const release = args.admitBytes ? await args.admitBytes(member.clen + member.size) : void 0;
    try {
      const compressed = Buffer.alloc(member.clen);
      const { bytesRead } = await handle.read(compressed, 0, member.clen, member.offset);
      let bytes;
      try {
        if (bytesRead !== member.clen) throw new SandBoxStoreSyncError("short read");
        bytes = (0, import_node_zlib.gunzipSync)(compressed, {
          maxOutputLength: Math.max(member.size, 1)
        });
      } catch {
        mismatched += 1;
        return;
      }
      if (bytes.byteLength !== member.size || (0, import_node_crypto9.createHash)("sha256").update(bytes).digest("hex") !== member.sha) {
        mismatched += 1;
        return;
      }
      await args.onBlob(member, new Uint8Array(bytes.buffer, bytes.byteOffset, bytes.byteLength));
      extracted += 1;
    } finally {
      release?.();
    }
  };
  try {
    const workers = [];
    for (let w2 = 0; w2 < Math.min(concurrency, args.members.length); w2++) {
      workers.push(
        (async () => {
          for (; ; ) {
            const index = next++;
            if (index >= args.members.length) return;
            const member = args.members[index];
            if (!args.wants(member)) continue;
            await extractOne(member);
          }
        })()
      );
    }
    await settleAllThenThrowFirst(workers);
  } finally {
    await handle.close();
  }
  return { extracted, mismatched };
}
function compareBySha(a, b2) {
  if (a.sha < b2.sha) return -1;
  if (a.sha > b2.sha) return 1;
  return 0;
}
function planPackMaintenance(input) {
  const index = input.index;
  const keptPacks = [];
  const retiredPackIds = [];
  const survivors = [];
  const packedShas = /* @__PURE__ */ new Set();
  for (const pack of index?.packs ?? []) {
    const isLive3 = (member) => input.live.get(member.sha) === member.size;
    if (pack.members.length > 0 && pack.members.every(isLive3)) {
      keptPacks.push(pack);
      for (const member of pack.members) packedShas.add(member.sha);
    } else {
      retiredPackIds.push(pack.id);
      for (const member of pack.members) {
        if (isLive3(member)) survivors.push({ sha: member.sha, size: member.size });
      }
    }
  }
  let untouchedMax = 0;
  for (const pack of keptPacks) {
    for (const member of pack.members) {
      untouchedMax = Math.max(untouchedMax, member.vmtime);
    }
  }
  const survivorShas = new Set(survivors.map((s3) => s3.sha));
  const newbies = [];
  for (const [sha, size] of input.eligible) {
    if (packedShas.has(sha) || survivorShas.has(sha)) continue;
    newbies.push({ sha, size });
  }
  newbies.sort(compareBySha);
  survivors.sort(compareBySha);
  const candidates = [
    ...survivors.map((s3) => ({ ...s3, survivor: true })),
    ...newbies.map((n) => ({ ...n, survivor: false }))
  ];
  const groups = [];
  let current = [];
  let currentBytes = 0;
  for (const member of candidates) {
    if (current.length > 0 && currentBytes + member.size > input.maxPackMemberSizeSum) {
      groups.push(current);
      current = [];
      currentBytes = 0;
    }
    current.push(member);
    currentBytes += member.size;
  }
  if (current.length > 0) groups.push(current);
  let deferredMembers = 0;
  const lastGroup = groups[groups.length - 1];
  if (lastGroup != null) {
    const lastBytes = lastGroup.reduce((sum, m2) => sum + m2.size, 0);
    if (lastGroup.length < input.minPackMembers && lastBytes < input.minPackBytes) {
      deferredMembers = lastGroup.length;
      groups.pop();
    }
  }
  let nextVmtime = Math.max(index?.maxVmtime ?? 0, untouchedMax);
  const newPacks = groups.map(
    (group) => group.map((member) => {
      if (member.survivor) {
        return { sha: member.sha, size: member.size, vmtime: untouchedMax };
      }
      nextVmtime += 1;
      return { sha: member.sha, size: member.size, vmtime: nextVmtime };
    })
  );
  return {
    keptPacks,
    retiredPackIds,
    newPacks,
    deferredMembers,
    newMaxVmtime: Math.max(nextVmtime, untouchedMax, index?.maxVmtime ?? 0)
  };
}
function isBoxStorePackBuildEnabled(env) {
  const raw = env.SAND_BOX_STORE_PACKS?.trim().toLowerCase();
  return !(raw === "0" || raw === "false" || raw === "no");
}

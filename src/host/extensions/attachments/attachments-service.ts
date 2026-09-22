var reanchorHostPath = (filePath) => reanchorSandPath(filePath, { acceptBoxModelVisibleAlias: true });
var SandAttachmentError = class extends SandDomainError {
  name = "SandAttachmentError";
};
function sha256(input) {
  return (0, import_node_crypto39.createHash)("sha256").update(input).digest("hex");
}
async function sha256OfFile(filePath) {
  const hash = (0, import_node_crypto39.createHash)("sha256");
  for await (const chunk of (0, import_node_fs51.createReadStream)(filePath)) hash.update(chunk);
  return hash.digest("hex");
}
function contentAddressedPath(attachmentsDir, content) {
  const sourceExt = (0, import_node_path92.extname)(content.filename).toLowerCase();
  return (0, import_node_path92.join)(attachmentsDir, `${content.hash}${sourceExt.length > 0 ? sourceExt : ".bin"}`);
}
async function ensureDir(dir) {
  await import_node_fs51.promises.mkdir(dir, { recursive: true });
}
async function writeContentAddressedFile(dir, targetPath, buffer) {
  await ensureDir(dir);
  try {
    await import_node_fs51.promises.access(targetPath);
  } catch {
    await import_node_fs51.promises.writeFile(targetPath, buffer);
  }
}
async function ingestAttachment(agentDir, sourcePath) {
  if (typeof sourcePath !== "string" || sourcePath.trim().length === 0) {
    throw new SandAttachmentError("Attachment file path is empty.");
  }
  if (!(0, import_node_path92.isAbsolute)(sourcePath)) {
    throw new SandAttachmentError(`Attachment path must be absolute: ${sourcePath}`);
  }
  const attachmentsDir = getAgentAttachmentsDir(agentDir);
  if (isPathWithin(attachmentsDir, sourcePath, { isInclusive: true })) {
    const stat29 = await import_node_fs51.promises.stat(sourcePath);
    return {
      absolutePath: sourcePath,
      hash: "preserved",
      bytes: stat29.size
    };
  }
  const stat28 = await import_node_fs51.promises.stat(sourcePath);
  if (!stat28.isFile()) {
    throw new SandAttachmentError(`Attachment source is not a file: ${sourcePath}`);
  }
  const byteLimit = attachmentByteLimitForName(sourcePath);
  if (stat28.size > byteLimit) {
    throw new AttachmentTooLargeError(byteLimit);
  }
  const buffer = await import_node_fs51.promises.readFile(sourcePath);
  const hash = sha256(buffer);
  const targetPath = contentAddressedPath(attachmentsDir, { hash, filename: sourcePath });
  await writeContentAddressedFile(attachmentsDir, targetPath, buffer);
  return { absolutePath: targetPath, hash, bytes: buffer.byteLength };
}
async function ingestAttachmentBytes(agentDir, filename, data) {
  if (typeof filename !== "string" || filename.trim().length === 0) {
    throw new SandAttachmentError("Attachment filename is empty.");
  }
  if (data.byteLength === 0) {
    throw new SandAttachmentError("Attachment is empty.");
  }
  const byteLimit = attachmentByteLimitForName(filename);
  if (data.byteLength > byteLimit) {
    throw new AttachmentTooLargeError(byteLimit);
  }
  const buffer = Buffer.from(data);
  const hash = sha256(buffer);
  const attachmentsDir = getAgentAttachmentsDir(agentDir);
  const targetPath = contentAddressedPath(attachmentsDir, { hash, filename });
  await writeContentAddressedFile(attachmentsDir, targetPath, buffer);
  return { absolutePath: targetPath, hash, bytes: buffer.byteLength };
}
var UPLOAD_PARTS_DIRNAME = ".uploads";
var STALE_UPLOAD_PART_MS = 60 * 60 * 1e3;
var UPLOAD_ID = /^[A-Za-z0-9-]{8,64}$/;
async function sweepStaleUploadParts(partsDir) {
  const cutoff = Date.now() - STALE_UPLOAD_PART_MS;
  for (const name17 of await import_node_fs51.promises.readdir(partsDir)) {
    const partPath = (0, import_node_path92.join)(partsDir, name17);
    try {
      const stat28 = await import_node_fs51.promises.stat(partPath);
      if (stat28.mtimeMs < cutoff) await import_node_fs51.promises.rm(partPath, { force: true });
    } catch (error42) {
      if (findSystemErrno(error42) !== "ENOENT") throw error42;
    }
  }
}
async function ingestAttachmentChunk(agentDir, chunk) {
  const { uploadId, filename, offset, totalSize, bytes } = chunk;
  if (filename.trim().length === 0) {
    throw new SandAttachmentError("Attachment filename is empty.");
  }
  if (!UPLOAD_ID.test(uploadId)) {
    throw new SandAttachmentError("Attachment upload id is malformed.");
  }
  if (!Number.isInteger(totalSize) || totalSize <= 0) {
    throw new SandAttachmentError("Attachment is empty.");
  }
  const byteLimit = attachmentByteLimitForName(filename);
  if (totalSize > byteLimit) {
    throw new AttachmentTooLargeError(byteLimit);
  }
  const end = offset + bytes.byteLength;
  if (!Number.isInteger(offset) || offset < 0 || bytes.byteLength === 0 || end > totalSize) {
    throw new SandAttachmentError("Attachment chunk lies outside the upload.");
  }
  const attachmentsDir = getAgentAttachmentsDir(agentDir);
  const partsDir = (0, import_node_path92.join)(attachmentsDir, UPLOAD_PARTS_DIRNAME);
  const partPath = (0, import_node_path92.join)(partsDir, `${uploadId}.part`);
  if (offset === 0) {
    await ensureDir(partsDir);
    await sweepStaleUploadParts(partsDir);
  }
  const handle = await import_node_fs51.promises.open(partPath, offset === 0 ? "w" : "r+");
  try {
    await handle.write(bytes, 0, bytes.byteLength, offset);
  } finally {
    await handle.close();
  }
  if (end < totalSize) return null;
  const hash = await sha256OfFile(partPath);
  const targetPath = contentAddressedPath(attachmentsDir, { hash, filename });
  await import_node_fs51.promises.rename(partPath, targetPath);
  return { absolutePath: targetPath, hash, bytes: totalSize };
}
async function isCloudAgentArtifactPath(resolved) {
  return await containWithin([SAND_CLOUD_AGENT_ARTIFACTS_BOX_ROOT], resolved) != null;
}
async function isReadableHostAttachmentPath(resolved) {
  return isPathWithin(getSandRootDir(), resolved) || await isCloudAgentArtifactPath(resolved);
}
async function readHostAttachmentImage(filePath, reportRenditionFailure = () => {
}) {
  if (typeof filePath !== "string" || filePath.length === 0) return null;
  const boxFile = await resolvePreviewBoxFile(filePath);
  if (boxFile != null) return await readImageAttachment(boxFile, reportRenditionFailure);
  const resolved = reanchorHostPath(filePath);
  if (!await isReadableHostAttachmentPath(resolved)) {
    return null;
  }
  return await readImageAttachment(resolved, reportRenditionFailure);
}
async function readHostAttachmentVideoBytes(filePath) {
  if (typeof filePath !== "string" || filePath.length === 0) return null;
  const boxFile = await resolvePreviewBoxFile(filePath);
  const resolved = boxFile ?? reanchorHostPath(filePath);
  if (boxFile == null && !await isReadableHostAttachmentPath(resolved)) {
    return null;
  }
  if (videoMimeFromPath(resolved) === void 0) return null;
  try {
    const stat28 = await import_node_fs51.promises.stat(resolved);
    if (!stat28.isFile() || stat28.size > VIDEO_BYTE_LIMIT) return null;
    return new Uint8Array(await import_node_fs51.promises.readFile(resolved));
  } catch (error42) {
    reportFallbackUnlessAbsent("attachments_service", error42);
    return null;
  }
}
var ATTACHMENT_CHUNK_MAX_BYTES = 8 * 1024 * 1024;
async function readHostAttachmentChunk(agentDir, filePath, offset, length, videoPlayback = false, reportRenditionFailure = () => {
}) {
  if (typeof filePath !== "string" || filePath.length === 0) return null;
  const reanchored = reanchorHostPath(filePath);
  const inAgentMedia = isPathWithin(getAgentAttachmentsDir(agentDir), reanchored) || isPathWithin(getAgentAssetsDir(agentDir), reanchored);
  const cloudArtifact = inAgentMedia ? false : await isCloudAgentArtifactPath(reanchored);
  const boxFile = inAgentMedia || cloudArtifact ? null : await resolvePreviewBoxFile(filePath);
  const source = boxFile ?? reanchored;
  if (!inAgentMedia && !cloudArtifact && boxFile == null) return null;
  if (videoPlayback && videoMimeFromPath(source) == null) return null;
  try {
    const readResolved = async (resolved) => {
      const stat28 = await import_node_fs51.promises.stat(resolved);
      if (!stat28.isFile()) return null;
      const totalSize = stat28.size;
      const mime2 = imageMimeFromPath(resolved) ?? videoMimeFromPath(resolved) ?? audioMimeFromPath(resolved) ?? null;
      const safeOffset = Number.isFinite(offset) ? Math.max(0, Math.floor(offset)) : 0;
      const start = Math.min(safeOffset, totalSize);
      const safeLength2 = Number.isFinite(length) ? Math.max(0, Math.floor(length)) : 0;
      const len = Math.min(safeLength2, ATTACHMENT_CHUNK_MAX_BYTES, totalSize - start);
      if (len <= 0) {
        return { bytesBase64: "", totalSize, mime: mime2 };
      }
      const handle = await import_node_fs51.promises.open(resolved, "r");
      try {
        const buffer = Buffer.alloc(len);
        const { bytesRead } = await handle.read(buffer, 0, len, start);
        return {
          bytesBase64: buffer.subarray(0, bytesRead).toString("base64"),
          totalSize,
          mime: mime2
        };
      } finally {
        await handle.close();
      }
    };
    if (videoPlayback) {
      return await withVideoPlaybackSource(source, readResolved, reportRenditionFailure);
    }
    return await readResolved(source);
  } catch (error42) {
    reportFallbackUnlessAbsent("attachments_service", error42);
    return null;
  }
}
async function readImageSize(buffer) {
  try {
    return readImageFileDimensions(buffer);
  } catch (error42) {
    if (error42 instanceof RangeError) return null;
    throw error42;
  }
}
async function readImageAttachment(filePath, reportRenditionFailure = () => {
}) {
  const resolved = reanchorHostPath(filePath);
  const sourceMime = servableImageMimeFromPath(resolved);
  if (sourceMime == null) return null;
  try {
    return await withDisplayableImageSource(
      resolved,
      async (displayPath) => {
        const data = await import_node_fs51.promises.readFile(displayPath);
        const size = await readImageSize(data);
        const mime2 = servableImageMimeFromPath(displayPath) ?? sourceMime;
        return {
          dataUrl: `data:${mime2};base64,${data.toString("base64")}`,
          width: size?.width ?? null,
          height: size?.height ?? null
        };
      },
      reportRenditionFailure
    );
  } catch (error42) {
    reportFallbackUnlessAbsent("attachments_service", error42);
    return null;
  }
}
async function readImageDimensions(filePath) {
  const resolved = reanchorHostPath(filePath);
  if (servableImageMimeFromPath(resolved) == null) return null;
  try {
    const data = await import_node_fs51.promises.readFile(resolved);
    return await readImageSize(data);
  } catch (error42) {
    reportFallbackUnlessAbsent("attachments_service", error42);
    return null;
  }
}
var VIDEO_DIMENSIONS_HEAD_BYTES = 1024 * 1024;
var VIDEO_DIMENSIONS_TAIL_BYTES = 8 * 1024 * 1024;
async function readVideoDimensions(filePath) {
  const resolved = reanchorHostPath(filePath);
  if (!isPathWithin(getSandRootDir(), resolved)) return null;
  if (videoMimeFromPath(resolved) === void 0) return null;
  try {
    const handle = await import_node_fs51.promises.open(resolved, "r");
    try {
      const { size } = await handle.stat();
      const headLength = Math.min(size, VIDEO_DIMENSIONS_HEAD_BYTES);
      const head = Buffer.alloc(headLength);
      await handle.read(head, 0, headLength, 0);
      const fromHead = Mp4Dimensions.read(head);
      if (fromHead != null || size <= headLength) return fromHead;
      const tailLength = Math.min(size, VIDEO_DIMENSIONS_TAIL_BYTES);
      const tail = Buffer.alloc(tailLength);
      await handle.read(tail, 0, tailLength, size - tailLength);
      return Mp4Dimensions.read(tail);
    } finally {
      await handle.close();
    }
  } catch (error42) {
    reportFallbackUnlessAbsent("attachments_service", error42);
    return null;
  }
}
async function readMediaDimensions(filePath) {
  const resolved = reanchorHostPath(filePath);
  if (!isPathWithin(getSandRootDir(), resolved)) return null;
  if (servableImageMimeFromPath(resolved) != null) return readImageDimensions(resolved);
  if (videoMimeFromPath(resolved) !== void 0) return readVideoDimensions(resolved);
  return null;
}
var ATTACHMENT_TEXT_PREVIEW_BYTE_CAP = 64 * 1024;
function resolveAttachmentOwnerDir(filePath) {
  if (typeof filePath !== "string" || filePath.length === 0) return null;
  const resolved = reanchorHostPath(filePath);
  const agentsRoot = (0, import_node_path92.join)(getSandRootDir(), "agents");
  if (!isPathWithin(agentsRoot, resolved)) return null;
  const rel = (0, import_node_path92.relative)(agentsRoot, resolved);
  const segments = rel.split(import_node_path92.sep);
  if (segments.length < 3) return null;
  const [agentId, bucket] = segments;
  if (!isSafeFolderId(agentId)) return null;
  if (bucket !== ATTACHMENTS_DIRNAME && bucket !== ASSETS_DIRNAME) return null;
  return (0, import_node_path92.join)(agentsRoot, agentId);
}
function resolveScopedAttachmentPath(agentDir, filePath) {
  if (typeof filePath !== "string" || filePath.length === 0) return null;
  const resolved = reanchorHostPath(filePath);
  if (!isPathWithin(getAgentAttachmentsDir(agentDir), resolved)) return null;
  return resolved;
}
async function resolvePreviewBoxFile(filePath) {
  const lexical = lexicalBoxFilePath(reanchorHostPath(filePath));
  if (lexical == null) return null;
  let real;
  try {
    real = await import_node_fs51.promises.realpath(lexical);
  } catch (error42) {
    reportFallbackUnlessAbsent("attachments_service", error42);
    return null;
  }
  if (resolvedBoxFilePath(real) == null) return null;
  try {
    const stat28 = await import_node_fs51.promises.stat(real);
    if (!stat28.isFile()) return null;
  } catch (error42) {
    reportFallbackUnlessAbsent("attachments_service", error42);
    return null;
  }
  return real;
}
async function readAttachmentText(agentDir, filePath) {
  const resolved = resolveScopedAttachmentPath(agentDir, filePath) ?? await resolvePreviewBoxFile(filePath);
  if (resolved == null) return null;
  try {
    const stat28 = await import_node_fs51.promises.stat(resolved);
    if (!stat28.isFile()) return null;
    const bytes = stat28.size;
    if (!isTextPreviewableName(resolved)) return { kind: "binary", bytes };
    const head = await readFileHead(resolved, ATTACHMENT_TEXT_PREVIEW_BYTE_CAP);
    if (looksLikeBinary(head)) return { kind: "binary", bytes };
    return {
      kind: "text",
      text: head.toString("utf8"),
      truncated: bytes > ATTACHMENT_TEXT_PREVIEW_BYTE_CAP,
      bytes
    };
  } catch (error42) {
    reportFallbackUnlessAbsent("attachments_service", error42);
    return null;
  }
}
async function readFileHead(filePath, maxBytes) {
  const handle = await import_node_fs51.promises.open(filePath, "r");
  try {
    const buffer = Buffer.alloc(maxBytes);
    const { bytesRead } = await handle.read(buffer, 0, maxBytes, 0);
    return buffer.subarray(0, bytesRead);
  } finally {
    await handle.close();
  }
}
async function persistImageBytes(targetDir, data, mimeType) {
  const buffer = Buffer.from(data);
  const hash = sha256(buffer);
  const ext2 = extensionFromImageMime(mimeType) ?? ".png";
  const targetPath = (0, import_node_path92.join)(targetDir, `${hash}${ext2}`);
  await writeContentAddressedFile(targetDir, targetPath, buffer);
  const size = await readImageSize(buffer);
  return {
    absolutePath: targetPath,
    fileUrl: (0, import_node_url12.pathToFileURL)(targetPath).href,
    bytes: buffer.byteLength,
    width: size?.width ?? null,
    height: size?.height ?? null
  };
}
function createAttachmentsService(deps) {
  let fallbackAgentId = null;
  const resolveRequestedAgentDir = (agentId) => {
    const resolvedId = agentId ?? fallbackAgentId;
    if (resolvedId == null || resolvedId.length === 0) {
      throw new SandAttachmentError("No active agent to attach to.");
    }
    return resolveSandAgentDir(resolvedId);
  };
  const tryResolveRequestedAgentDir = (agentId) => {
    try {
      return resolveRequestedAgentDir(agentId);
    } catch {
      return null;
    }
  };
  const resolveReadAgentDir = (path31, agentId) => resolveAttachmentOwnerDir(path31) ?? tryResolveRequestedAgentDir(agentId);
  return {
    setFallbackAgentId(agentId) {
      fallbackAgentId = agentId;
    },
    async upload(args) {
      const bytes = new Uint8Array(
        Buffer.from(typeof args.bytesBase64 === "string" ? args.bytesBase64 : "", "base64")
      );
      const result = await ingestAttachmentBytes(
        resolveRequestedAgentDir(args.agentId),
        args.filename,
        bytes
      );
      return { path: result.absolutePath };
    },
    async uploadChunk(args) {
      const result = await ingestAttachmentChunk(resolveRequestedAgentDir(args.agentId), {
        uploadId: args.uploadId,
        filename: args.filename,
        offset: args.offset,
        totalSize: args.totalSize,
        bytes: Buffer.from(args.bytesBase64, "base64")
      });
      return { committedPath: result?.absolutePath ?? null };
    },
    readImage: (args) => readHostAttachmentImage(args.path, deps.reportRenditionFailure),
    async readText(args) {
      const agentDir = resolveReadAgentDir(args.path, args.agentId);
      if (agentDir == null) {
        deps.report?.({
          extension: "attachments",
          kind: "read_text_miss",
          hasActive: args.agentId != null
        });
        return null;
      }
      return await readAttachmentText(agentDir, args.path);
    },
    async readChunk(args) {
      const agentDir = resolveReadAgentDir(args.path, args.agentId);
      if (agentDir == null) {
        deps.report?.({
          extension: "attachments",
          kind: "read_chunk_miss",
          hasActive: args.agentId != null
        });
        return null;
      }
      return await readHostAttachmentChunk(
        agentDir,
        args.path,
        args.offset,
        args.length,
        args.videoPlayback,
        deps.reportRenditionFailure
      );
    },
    ingest: ingestAttachment,
    ingestBytes: ingestAttachmentBytes,
    persistImageBytes,
    readImageDimensions,
    readMediaDimensions,
    readVideoBytes: readHostAttachmentVideoBytes,
    resolveChannelAttachment,
    resolveOwnerDir: resolveAttachmentOwnerDir,
    createGenerateImageResourceAccessor: createSandGenerateImageResourceAccessor,
    createGenerateImageService: (options2) => createSandGenerateImageService(deps.environment, deps.auth, options2),
    generateAvatarImage: createSandAvatarImageService(deps.environment, deps.auth)
  };
}

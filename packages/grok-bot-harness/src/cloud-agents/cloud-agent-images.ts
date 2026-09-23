var import_promises78 = require("node:fs/promises");
var import_node_path164 = require("node:path");
init_dist2();
var CLOUD_AGENT_DOCUMENT_BYTE_LIMIT = ATTACHMENT_BYTE_LIMIT;
var CLOUD_AGENT_VIDEO_BYTE_LIMIT = Math.min(
  VIDEO_BYTE_LIMIT,
  DEFAULT_INLINE_VIDEO_MAX_BYTES
);
var REQUEST_PROMPT_HEADROOM_BYTES = 2 * 1024 * 1024;
var CLOUD_AGENT_ATTACHMENTS_TOTAL_BYTE_LIMIT = BACKEND_REQUEST_BODY_SIZE_LIMIT_BYTES - REQUEST_PROMPT_HEADROOM_BYTES;
var CLOUD_AGENT_IMAGE_EXTENSIONS_HINT = "png, jpeg, gif, webp, \u2026";
var CLOUD_AGENT_DOCUMENT_EXTENSIONS_HINT = "pdf, txt, md, csv, tsv, json, yaml, xml, html, zip, tar, gz, docx, xlsx, pptx, \u2026";
var CLOUD_AGENT_VIDEO_EXTENSIONS_HINT = "mp4, mov, webm, \u2026";
var CLOUD_AGENT_TEXT_FALLBACK_MIME_TYPE = "text/plain";
var BYTES_PER_MB = 1024 * 1024;
function formatMegabytes(bytes) {
  return `${Math.round(bytes / BYTES_PER_MB)} MB`;
}
var CLOUD_AGENT_DOCUMENT_LIMIT_LABEL = formatMegabytes(CLOUD_AGENT_DOCUMENT_BYTE_LIMIT);
var CLOUD_AGENT_VIDEO_LIMIT_LABEL = formatMegabytes(CLOUD_AGENT_VIDEO_BYTE_LIMIT);
var CLOUD_AGENT_ATTACHMENTS_TOTAL_LIMIT_LABEL = formatMegabytes(
  CLOUD_AGENT_ATTACHMENTS_TOTAL_BYTE_LIMIT
);
function formatCloudAgentAttachmentTooLargeNotice(url2, limitBytes) {
  return `'${url2}' is too large to attach to a cloud agent (max ${formatMegabytes(limitBytes)}).`;
}
function formatCloudAgentAttachmentsOverTotalNotice(over) {
  return `'${over.url}' would take the attachments on this call past ${CLOUD_AGENT_ATTACHMENTS_TOTAL_LIMIT_LABEL} in total (the ${over.alreadyAttached} before it already add up to ${formatMegabytes(over.bytesSoFar)}; the backend accepts one ${formatMegabytes(BACKEND_REQUEST_BODY_SIZE_LIMIT_BYTES)} request and the prompt needs headroom). Attach fewer or smaller files, or split them between the launch and a follow-up reply.`;
}
function isEnvFileName(name17) {
  const base = import_node_path164.posix.basename(name17).toLowerCase();
  return base === ".env" || base.startsWith(".env.") || base.endsWith(".env");
}
function envFileRefusedMessage(url2) {
  return `Refused to attach '${url2}': .env-style files usually hold secrets and would be saved into the cloud agent's workspace, so they are never attached. Put the non-secret settings the agent needs in the prompt, or attach a copy with the secrets removed under another name.`;
}
function normalizedBoxPathFromFileUrl(url2) {
  const rawBoxPath = posixPathFromFileUrl(url2);
  return rawBoxPath == null ? null : import_node_path164.posix.normalize(rawBoxPath);
}
function toPhysicalBoxPath(boxPath) {
  const normalized = import_node_path164.posix.normalize(boxPath);
  const aliasPrefix = `${SAND_BOX_MODEL_VISIBLE_DATA_ROOT}/`;
  return normalized.startsWith(aliasPrefix) ? `${SAND_BOX_DATA_ROOT}/${normalized.slice(aliasPrefix.length)}` : normalized;
}
function toAliasBoxPath(boxPath) {
  const normalized = import_node_path164.posix.normalize(boxPath);
  const physicalPrefix = `${SAND_BOX_DATA_ROOT}/`;
  return normalized.startsWith(physicalPrefix) ? `${SAND_BOX_MODEL_VISIBLE_DATA_ROOT}/${normalized.slice(physicalPrefix.length)}` : normalized;
}
function boxDataRootSpellings(roots) {
  return [
    ...new Set(roots.flatMap((root) => [root, toPhysicalBoxPath(root), toAliasBoxPath(root)]))
  ];
}
function describeChannelNoun(channel) {
  return channel === "images" ? "image" : "file";
}
function notFileUrlMessage(url2, channel) {
  const noun = describeChannelNoun(channel);
  const example = channel === "images" ? "file:///workspace/shot.png" : "file:///workspace/report.pdf";
  return `'${url2}' is not a file:// url. Attach ${noun === "image" ? "an image the cloud agent can be shown" : "a file for the cloud agent"} by passing an absolute file:// path (a path in your box like ${example}, or one in your own attachments/assets folder). An https:// ${noun} has to be downloaded to a file first.`;
}
function unsupportedTypeMessage(url2, channel) {
  if (channel === "images") {
    return `'${url2}' is not a recognized image (${CLOUD_AGENT_IMAGE_EXTENSIONS_HINT}). Only images ride the cloud agent's vision channel; pass a document or video in files instead, so it is saved to the agent's workspace.`;
  }
  return `'${url2}' is not a file type the cloud agent attachments support. files takes documents (${CLOUD_AGENT_DOCUMENT_EXTENSIONS_HINT}), any text file (source, scripts, patches, configs) recognized by content, videos (${CLOUD_AGENT_VIDEO_EXTENSIONS_HINT}), and images to hand over as files; binary files of other kinds are refused. Describe or paste its contents in the prompt instead.`;
}
function unreadableMessage(url2, channel) {
  return `Could not read the ${describeChannelNoun(channel)} at '${url2}'. The path is one you're allowed to read, so check it actually exists in your box.`;
}
function refusedMessage(url2, channel) {
  return `Refused to read '${url2}': it is neither inside your own attachments/assets folder nor under /workspace in your box. Copy the ${describeChannelNoun(channel)} into /workspace first, then attach it from there.`;
}
function byteLimitFor(kind) {
  return kind === "video" ? CLOUD_AGENT_VIDEO_BYTE_LIMIT : CLOUD_AGENT_DOCUMENT_BYTE_LIMIT;
}
function classifyAttachment2(boxPath, channel) {
  if (channel === "images") {
    const mimeType = imageMimeFromPath(boxPath);
    return mimeType == null ? void 0 : { kind: "image", mimeType, sniffText: false };
  }
  const known = mediaKindAndMimeFromPath(boxPath);
  if (known != null) return { ...known, sniffText: false };
  return { kind: "document", mimeType: CLOUD_AGENT_TEXT_FALLBACK_MIME_TYPE, sniffText: true };
}
async function loadCloudAgentAttachments({
  ctx,
  imageUrls,
  fileUrls,
  agentDir,
  readBoxFile
}) {
  const mediaStoreRoots = getAgentMediaStoreRoots(agentDir);
  const images = [];
  const files = [];
  const channels = [
    ["images", imageUrls],
    ["files", fileUrls]
  ];
  let totalBytes = 0;
  for (const [channel, urls] of channels) {
    for (const url2 of urls) {
      const boxPath = normalizedBoxPathFromFileUrl(url2);
      if (boxPath == null) {
        return { ok: false, message: notFileUrlMessage(url2, channel) };
      }
      if (channel === "files" && isEnvFileName(boxPath)) {
        return { ok: false, message: envFileRefusedMessage(url2) };
      }
      const media = classifyAttachment2(boxPath, channel);
      if (media == null) {
        return { ok: false, message: unsupportedTypeMessage(url2, channel) };
      }
      const perFileLimit = byteLimitFor(media.kind);
      const remainingBytes = CLOUD_AGENT_ATTACHMENTS_TOTAL_BYTE_LIMIT - totalBytes;
      const overTotal = {
        url: url2,
        alreadyAttached: images.length + files.length,
        bytesSoFar: totalBytes
      };
      if (remainingBytes <= 0) {
        return { ok: false, message: formatCloudAgentAttachmentsOverTotalNotice(overTotal) };
      }
      const byteLimit = Math.min(perFileLimit, remainingBytes);
      const read = await readCloudAgentAttachment({
        ctx,
        hostPath: filePathFromFileUrl(url2),
        mediaStoreRoots,
        boxPath,
        byteLimit,
        readBoxFile
      });
      switch (read.kind) {
        case "loaded":
          if (media.sniffText && looksLikeBinary(read.data)) {
            return { ok: false, message: unsupportedTypeMessage(url2, channel) };
          }
          totalBytes += read.data.byteLength;
          if (channel === "images") {
            images.push({ data: read.data, path: read.path, mimeType: media.mimeType });
          } else {
            files.push({
              kind: media.kind === "video" ? "video" : "document",
              data: read.data,
              path: read.path,
              filename: import_node_path164.posix.basename(boxPath),
              mimeType: media.mimeType
            });
          }
          break;
        case "unreadable":
          return { ok: false, message: unreadableMessage(url2, channel) };
        case "refused":
          return { ok: false, message: refusedMessage(url2, channel) };
        case "too-large": {
          const overPerFile = read.size != null ? read.size > perFileLimit : byteLimit === perFileLimit;
          return {
            ok: false,
            message: overPerFile ? formatCloudAgentAttachmentTooLargeNotice(url2, perFileLimit) : formatCloudAgentAttachmentsOverTotalNotice(overTotal)
          };
        }
      }
    }
  }
  return { ok: true, images, files };
}
async function readCloudAgentAttachment({
  ctx,
  hostPath,
  mediaStoreRoots,
  boxPath,
  byteLimit,
  readBoxFile
}) {
  const contained = hostPath == null ? null : await containWithin(boxDataRootSpellings(mediaStoreRoots), hostPath);
  if (contained != null) {
    const hostRead = await readHostFileWithinLimit(contained, byteLimit);
    if (hostRead != null) {
      return hostRead.kind === "too-large" ? hostRead : { kind: "loaded", data: hostRead.data, path: contained };
    }
  }
  const inWorkspace2 = boxPath === SAND_BOX_WORKSPACE_ROOT || boxPath.startsWith(`${SAND_BOX_WORKSPACE_ROOT}/`);
  if (contained == null && !inWorkspace2) {
    return { kind: "refused" };
  }
  if (readBoxFile == null) {
    return { kind: "unreadable" };
  }
  try {
    const data = await readBoxFile(ctx, contained == null ? boxPath : toPhysicalBoxPath(boxPath), {
      maxBytes: byteLimit
    });
    if (data.byteLength > byteLimit) return { kind: "too-large" };
    return { kind: "loaded", data, path: boxPath };
  } catch (error42) {
    if (error42 instanceof BoxFileTooLargeError) {
      return { kind: "too-large" };
    }
    return { kind: "unreadable" };
  }
}
async function readHostFileWithinLimit(path31, byteLimit) {
  try {
    const info2 = await (0, import_promises78.stat)(path31);
    if (!info2.isFile()) return null;
    if (info2.size > byteLimit) return { kind: "too-large", size: info2.size };
    return { kind: "loaded", data: new Uint8Array(await (0, import_promises78.readFile)(path31)) };
  } catch {
    return null;
  }
}

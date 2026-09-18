var SAND_DOWNLOAD_FILE_TOOL_NAME = "download_file";
var downloadFileObjectSchema = external_exports.object({
  connection: external_exports.string().trim().min(1).describe(
    "Which connected account holds the file: the connection's identifier as GetMcpServerStatus lists it and as its own tools are prefixed with (e.g. user-onedrive, dashboard-team-1-Google-drive). The service short name (google-drive, onedrive, gmail) also works when exactly one account of that service is connected. A name that matches nothing is answered with the identifiers that can serve files."
  ),
  source: external_exports.object({
    fileId: external_exports.string().trim().optional().describe(
      "Provider file id from that connection's listing or search tools. Google Drive takes ids only."
    ),
    path: external_exports.string().trim().optional().describe(
      'OneDrive only: file path from the OneDrive root, e.g. "Documents/notes.txt". Provide exactly one of fileId or path.'
    )
  }).describe("Which file to pull. Provide exactly one of fileId or path."),
  destination: external_exports.object({
    path: external_exports.string().trim().optional().describe(
      "Absolute path on your computer for the file, name included; only paths under /workspace or your own agent directory (/home/box/agent-data/agents/<your id>) are accepted. Omit to land it in your downloads folder under the service's file name; the result tells you where. An existing file at the path is replaced."
    )
  }).default({}).describe("Where the file lands on your computer.")
});
var DOWNLOAD_FILE_URL_KEYS = ["url", "href"];
var DOWNLOAD_FILE_BOX_PATH_KEYS = ["file_path", "filePath", "path", "targetPath"];
var DOWNLOAD_FILE_WHAT_IT_IS = "download_file fetches a file from a connected Google Drive / OneDrive / Gmail account.";
var DOWNLOAD_FILE_SHAPE = 'Shape: {"connection": "google-drive", "source": {"fileId": "<id>"} | {"path": "<path>"}, "destination"?: {"path": "<box path>"}}.';
function explainWrongToolCall(value, ctx) {
  if (!isUnknownRecord(value) || value.connection !== void 0 || value.source !== void 0) {
    return value;
  }
  const urlKey = DOWNLOAD_FILE_URL_KEYS.find((key) => value[key] !== void 0);
  const boxPathKey = urlKey === void 0 ? DOWNLOAD_FILE_BOX_PATH_KEYS.find((key) => value[key] !== void 0) : void 0;
  const redirect = boxPathKey === void 0 ? "For a URL use WebFetch or Shell curl; for a file already on this box use Read." : "For a file already on this box use Read; for a URL use WebFetch or Shell curl.";
  const wrongKey = urlKey ?? boxPathKey;
  ctx.addIssue({
    code: external_exports.ZodIssueCode.custom,
    path: wrongKey === void 0 ? [] : [wrongKey],
    message: `${DOWNLOAD_FILE_WHAT_IT_IS} ${redirect} ${DOWNLOAD_FILE_SHAPE}`
  });
  return value;
}
var downloadFileParameters = external_exports.preprocess(explainWrongToolCall, downloadFileObjectSchema);
function nonEmpty4(value) {
  return value === void 0 || value.length === 0 ? void 0 : value;
}
function normalizeSource(source) {
  const fileId = nonEmpty4(source.fileId);
  const path31 = nonEmpty4(source.path);
  if (fileId !== void 0 && path31 !== void 0) {
    throw new SandToolInputError(
      "source.fileId and source.path are alternatives; pass exactly one."
    );
  }
  if (fileId !== void 0) return { fileId };
  if (path31 === void 0) {
    throw new SandToolInputError("source needs fileId or path; pass exactly one.");
  }
  return { path: path31 };
}
function normalizeDestinationPath(raw) {
  const path31 = nonEmpty4(raw);
  if (path31 === void 0) return void 0;
  if (!import_node_path167.posix.isAbsolute(path31)) {
    throw new SandToolInputError(
      `destination.path ${JSON.stringify(path31)} is not absolute. Pass the full path on your computer, e.g. "/home/box/agent-data/agents/<id>/downloads/report.pdf", or omit it.`
    );
  }
  const normalized = import_node_path167.posix.normalize(path31);
  if (normalized.endsWith("/")) {
    throw new SandToolInputError(
      "destination.path must name a file (folder plus file name), not a directory."
    );
  }
  return normalized;
}
function formatBytes(bytes) {
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  if (bytes >= 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${bytes} bytes`;
}
function describeDownloadFileOutcome(outcome, request3) {
  const source = request3.source.fileId !== void 0 ? `file ${request3.source.fileId}` : JSON.stringify(request3.source.path ?? "");
  switch (outcome.kind) {
    case "downloaded": {
      const lines2 = [
        `Downloaded ${source} from ${request3.connection} to ${outcome.boxPath} (${formatBytes(outcome.sizeBytes)}, ${outcome.mimeType}).`,
        `name: ${outcome.name}`,
        `id: ${outcome.id}`
      ];
      if (outcome.webUrl !== void 0) lines2.push(`link: ${outcome.webUrl}`);
      lines2.push(
        "The file is on your computer now; open it with Shell or the file tools. Its bytes are not in this conversation."
      );
      return lines2.join("\n");
    }
    case "needs_auth":
      return `The ${request3.connection} connection is installed but not signed in, so nothing was downloaded. Ask the user to connect ${request3.connection} again (AuthenticateMcpServer can start that), then retry.`;
    case "unknown_connection":
      return outcome.available.length === 0 ? "No connected service can serve files this turn, so nothing was downloaded. Tell the user which service you need connected." : `${JSON.stringify(request3.connection)} is not a connection that can serve files. Use one of: ${outcome.available.join(", ")}.`;
    case "destination_refused":
      return `Nothing was downloaded: download_file only writes under ${outcome.allowedRoots.join(" or ")}. Pass a destination.path under one of those directories, or omit it to use your downloads folder.`;
    case "not_found":
      return `Nothing was downloaded: ${outcome.message}`;
    case "too_large":
      return `Nothing was downloaded: ${source} on ${request3.connection} is over the ${formatBytes(outcome.maxBytes)} limit for download_file. Tell the user it is too large to fetch this way.`;
    case "rejected":
      return `${request3.connection} refused the download: ${outcome.message} Nothing was downloaded.`;
    case "unavailable":
      return `${outcome.message} Nothing was downloaded; try again in a moment or tell the user.`;
  }
}
var DOWNLOAD_FILE_DESCRIPTION = [
  "Fetch a file from one of the user's connected services onto your computer using the account they already connected. The file's bytes go straight from the service to your computer: you never read or paste them, so this works for any size or type up to the limit, and it is the right tool whenever you need to work on a file that lives in one of these services (read it, convert it, attach it, upload it somewhere else). Do not ask a service's own tools to print a file's contents into the conversation; download it and open it locally. The result tells you where the file landed.",
  "connection is the connection's identifier: the same one GetMcpServerStatus lists and that connection's own tools are prefixed with (for example user-onedrive, dashboard-team-1-Google-drive or user-Gmail--personal). The service short name (google-drive, onedrive or gmail) is accepted when exactly one account of that service is connected; with several accounts, name the identifier so the right account is used. Supported today:",
  "- Google Drive: source.fileId is a Drive file id from the Drive listing or search tools. Google Docs, Sheets, Slides and Drawings have no file of their own and are exported as .docx, .xlsx, .pptx and .png; the returned name carries that extension.",
  '- OneDrive: source.fileId is an item id from list_drive_items or search_drive_items, or source.path is a path from the OneDrive root (e.g. "Documents/notes.txt").',
  `- Gmail: source.fileId is "<message id>/<attachment id>", both from get_thread (each attachment listed on a message carries an id). This is the only way to get an email attachment's bytes; the Gmail tools themselves never return them.`,
  "destination.path is the full path on your computer, name included; omit it to land the file in your downloads folder under the service's file name. A connection that cannot serve files answers with the ones that can."
].join("\n");
async function runDownloadFile(args, deps) {
  const agentId = deps.getAgentId();
  invariant(agentId != null, "download_file was called outside an agent run.");
  const source = normalizeSource(args.source);
  const destinationPath = normalizeDestinationPath(args.destination.path);
  const destination = destinationPath === void 0 ? {} : { path: destinationPath };
  const resolution = resolveConnectorConnectionName(args.connection, await deps.listConnections());
  if (resolution.kind === "unknown") {
    return resolution.available.length === 0 ? "No connected service can serve files this turn, so nothing was downloaded. Tell the user which service you need connected." : `${JSON.stringify(args.connection)} is not a connection that can serve files. Use one of: ${describeConnectorConnections(resolution.available)}.`;
  }
  if (resolution.kind === "ambiguous") {
    return `${describeAmbiguousConnectorConnection(args.connection, resolution)} Nothing was downloaded.`;
  }
  const connection = resolution.connection;
  const request3 = { connection, source };
  const prepared = await deps.prepareDownload({
    agentId,
    connection,
    source,
    destination
  });
  if (prepared.kind !== "ready") {
    return describeDownloadFileOutcome(prepared, request3);
  }
  if (deps.reviewDownload !== void 0) {
    const decision = await deps.reviewDownload({
      toolCallId: deps.toolCallId ?? "",
      target: { connection, source, destination },
      ...deps.signal === void 0 ? {} : { signal: deps.signal }
    });
    if (!decision.allowed) {
      return `The download from ${connection} was not approved: ${decision.reason} Nothing was downloaded. Do not retry the same download unless the user asks for it.`;
    }
  }
  return describeDownloadFileOutcome(await prepared.download(), request3);
}
function createDownloadFileTool(deps) {
  return defineCommunicateTool(deps, {
    id: "DOWNLOAD_FILE",
    name: SAND_DOWNLOAD_FILE_TOOL_NAME,
    description: DOWNLOAD_FILE_DESCRIPTION,
    parameters: downloadFileParameters,
    onArgsRejected: deps.onArgsRejected,
    describeActivity: (args) => ({
      detail: args.source.path === void 0 ? args.source.fileId ?? "" : import_node_path167.posix.basename(args.source.path),
      target: args.connection
    }),
    execute: async (ctx, args, d) => runDownloadFile(args, { ...d, signal: ctx.signal })
  });
}

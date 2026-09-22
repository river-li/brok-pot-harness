/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/grok-bot-harness/src/runner/tools/upload-file-tool.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var import_node_path166 = require("node:path");
init_invariant();
init_unknown_record();
init_zod();
var SAND_UPLOAD_FILE_TOOL_NAME = "upload_file";
var UPLOAD_FILE_MAX_NAME_LENGTH = 255;
var uploadFileObjectSchema = external_exports.object({
  connection: external_exports.string().trim().min(1).describe(
    "Which connected account receives the file: the connection's identifier as GetMcpServerStatus lists it and as its own tools are prefixed with (e.g. user-onedrive, dashboard-team-1-Google-drive). The service short name (google-drive, onedrive, gmail, slack) also works when exactly one account of that service is connected. A name that matches nothing is answered with the identifiers that can receive files."
  ),
  sourcePath: external_exports.string().trim().min(1).describe(
    "Absolute path of the file on your computer, e.g. the path a Shell command or CopyToBox produced. Only files under /workspace or your own agent directory (/home/box/agent-data/agents/<your id>) can be sent; directories are not accepted."
  ),
  destination: external_exports.object({
    path: external_exports.string().trim().optional().describe(
      'Folder path inside the destination service, e.g. "Reports/2026". Omit to use the service root.'
    ),
    folderId: external_exports.string().trim().optional().describe(
      "Provider folder id, when you already have one from that connection's listing tools. Provide at most one of path or folderId."
    ),
    draftId: external_exports.string().trim().optional().describe(
      "Email connections only: the id of an existing draft, as returned by that connection's create_draft, to attach the file to. Not combined with path or folderId."
    ),
    name: external_exports.string().trim().optional().describe("File name at the destination. Defaults to the source file's name."),
    overwrite: external_exports.boolean().optional().describe(
      "OneDrive only: replace a file that already exists at the destination. Default false: an existing file makes the upload fail so you can pick another name."
    )
  }).default({}).describe(
    "Where the file lands. Which fields apply depends on the connection; see the description."
  )
});
function explainMissingSourcePath(value, ctx) {
  if (isUnknownRecord(value) && value.sourcePath === void 0) {
    ctx.addIssue({
      code: external_exports.ZodIssueCode.custom,
      path: [],
      message: 'upload_file sends a file that is already on your box into a connected Google Drive / OneDrive / Gmail account; sourcePath is the box path. Shape: {"connection": "google-drive", "sourcePath": "/workspace/report.pdf", "destination"?: {"path": "<folder>"} | {"folderId": "<id>"} | {"draftId": "<id>"}}.'
    });
  }
  return value;
}
var uploadFileParameters = external_exports.preprocess(explainMissingSourcePath, uploadFileObjectSchema);
function nonEmpty5(value) {
  return value === void 0 || value.length === 0 ? void 0 : value;
}
function normalizeDestination(destination) {
  const path31 = nonEmpty5(destination.path);
  const folderId = nonEmpty5(destination.folderId);
  const draftId = nonEmpty5(destination.draftId);
  const targetsGiven = [path31, folderId, draftId].filter((value) => value !== void 0).length;
  if (targetsGiven > 1) {
    throw new SandToolInputError(
      "destination.path, destination.folderId and destination.draftId are alternatives; pass one or none."
    );
  }
  if (destination.name !== void 0) {
    if (destination.name.length === 0 || destination.name.length > UPLOAD_FILE_MAX_NAME_LENGTH) {
      throw new SandToolInputError(
        `destination.name must be between 1 and ${UPLOAD_FILE_MAX_NAME_LENGTH} characters.`
      );
    }
    if (destination.name.includes("/") || destination.name.includes("\\") || destination.name.includes("\0")) {
      throw new SandToolInputError(
        "destination.name is a file name only; put folders in destination.path."
      );
    }
  }
  return {
    ...path31 === void 0 ? {} : { path: path31 },
    ...folderId === void 0 ? {} : { folderId },
    ...draftId === void 0 ? {} : { draftId },
    ...destination.name === void 0 ? {} : { name: destination.name },
    ...destination.overwrite === void 0 ? {} : { overwrite: destination.overwrite }
  };
}
function normalizeSourcePath(raw) {
  if (raw.includes("\0")) {
    throw new SandToolInputError("sourcePath contains an invalid character.");
  }
  if (!import_node_path166.posix.isAbsolute(raw)) {
    throw new SandToolInputError(
      `sourcePath ${JSON.stringify(raw)} is not absolute. Pass the full path on your computer, e.g. "/home/box/agent-data/agents/<id>/attachments/report.pdf".`
    );
  }
  const normalized = import_node_path166.posix.normalize(raw);
  if (normalized.endsWith("/")) {
    throw new SandToolInputError("sourcePath must name a file, not a directory.");
  }
  return normalized;
}
function formatBytes2(bytes) {
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  if (bytes >= 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${bytes} bytes`;
}
function describeUploadFileOutcome(outcome, request5) {
  switch (outcome.kind) {
    case "uploaded": {
      const lines2 = [
        `Uploaded ${request5.sourcePath} to ${request5.connection} as "${outcome.name}" (${formatBytes2(outcome.sizeBytes)}, ${outcome.mimeType}).`,
        `id: ${outcome.id}`
      ];
      if (outcome.webUrl !== void 0) lines2.push(`link: ${outcome.webUrl}`);
      lines2.push(
        "Share the link with the user if they need it; the file's bytes were sent directly and are not in this conversation."
      );
      return lines2.join("\n");
    }
    case "needs_auth":
      return `The ${request5.connection} connection is installed but not signed in, so nothing was uploaded. Ask the user to connect ${request5.connection} again (AuthenticateMcpServer can start that), then retry.`;
    case "unknown_connection":
      return outcome.available.length === 0 ? "No connected service can receive files this turn, so nothing was uploaded. Tell the user which service you need connected." : `${JSON.stringify(request5.connection)} is not a connection that can receive files. Use one of: ${outcome.available.join(", ")}.`;
    case "source_missing":
      return `Nothing was uploaded: ${request5.sourcePath} does not exist on your computer or is not a regular file. Check the path with Shell (ls -l) and retry.`;
    case "source_refused":
      return `Nothing was uploaded: upload_file only sends files under ${outcome.allowedRoots.join(" or ")}. Copy or save the file under one of those directories first, then retry with that path.`;
    case "too_large":
      return `Nothing was uploaded: ${request5.sourcePath} is over the ${formatBytes2(outcome.maxBytes)} limit for upload_file. Compress or split it, or tell the user it is too large to send this way.`;
    case "invalid_destination":
      return `Nothing was uploaded: ${outcome.message}`;
    case "rejected":
      return `${request5.connection} refused the upload: ${outcome.message} Nothing was uploaded.`;
    case "unavailable":
      return `${outcome.message} Nothing was uploaded; try again in a moment or tell the user.`;
  }
}
var UPLOAD_FILE_DESCRIPTION = [
  "Send a file from your computer to one of the user's connected services using the account they already connected. The file's bytes go straight from your computer to the service: you never read or paste them, so this works for any size or type up to the limit, and it is the right tool whenever the user wants a file you made or downloaded to land in one of these services. Do not read a file and re-create it with that service's own tools; upload it. The result names the created item and, where the service provides one, a link you can hand to the user.",
  CONNECTOR_CONNECTION_ARGUMENT_DESCRIPTION,
  '- Google Drive: destination.path is a folder path from My Drive root (e.g. "Reports/2026"; the folders must already exist), or destination.folderId is a Drive folder id from the Drive listing tools. Omit both for My Drive root. A new file is always created; Drive allows several files with one name.',
  '- OneDrive: destination.path is a folder path from the OneDrive root (e.g. "Documents/Reports"; the folders must already exist), or destination.folderId is a folder item id from list_drive_items. Omit both for the root. An existing file with the same name fails the upload unless destination.overwrite is true.',
  "- Gmail: destination.draftId is the draft id create_draft returned (or one from list_drafts); the file is attached to that draft and the draft id stays the same, so send it afterwards with send_message and that draftId. Attach last: Gmail's update_draft removes every attachment it is not handed again, so finish recipients, subject and body before calling upload_file, and never call update_draft on a draft that already has an attachment (make a new draft and attach again instead). Never put a file's contents into create_draft or send_message attachments yourself; that path cannot carry a real file. The draft with its attachments must stay under 25 MB.",
  "- Slack: the file is uploaded to the user's own Slack files, not posted anywhere; destination.path, folderId and draftId do not apply. The result carries the file's Slack link. To put the file in a channel or thread, send that link with the Slack connection's own message tool: Slack shares the file into the conversation and shows it under the message. Never paste a file's contents into a Slack message tool.",
  "destination.name sets the file name; it defaults to the source file's name. A connection that cannot receive files answers with the ones that can."
].join("\n");
async function runUploadFile(args, deps) {
  const agentId = deps.getAgentId();
  invariant(agentId != null, "upload_file was called outside an agent run.");
  const sourcePath = normalizeSourcePath(args.sourcePath);
  const destination = normalizeDestination(args.destination);
  const resolution = resolveConnectorConnectionName(args.connection, await deps.listConnections());
  if (resolution.kind === "unknown") {
    return resolution.available.length === 0 ? "No connected service can receive files this turn, so nothing was uploaded. Tell the user which service you need connected." : `${JSON.stringify(args.connection)} is not a connection that can receive files. Use one of: ${describeConnectorConnections(resolution.available)}.`;
  }
  if (resolution.kind === "ambiguous") {
    return `${describeAmbiguousConnectorConnection(args.connection, resolution)} Nothing was uploaded.`;
  }
  const connection = resolution.connection;
  const request5 = { connection, sourcePath };
  const staged = await deps.stage({ agentId, sourcePath });
  if (staged.kind !== "staged") {
    return describeUploadFileOutcome(staged, request5);
  }
  if (deps.reviewUpload !== void 0) {
    const decision = await deps.reviewUpload({
      toolCallId: deps.toolCallId ?? "",
      target: {
        connection,
        sourcePath,
        sha256: staged.sha256,
        sizeBytes: staged.sizeBytes,
        destination
      },
      ...deps.signal === void 0 ? {} : { signal: deps.signal }
    });
    if (!decision.allowed) {
      return `The upload to ${connection} was not approved: ${decision.reason} Nothing was uploaded. Do not retry the same upload unless the user asks for it.`;
    }
  }
  const outcome = await staged.upload({ connection, destination });
  return describeUploadFileOutcome(outcome, request5);
}
function createUploadFileTool(deps) {
  return defineCommunicateTool(deps, {
    id: "UPLOAD_FILE",
    name: SAND_UPLOAD_FILE_TOOL_NAME,
    description: UPLOAD_FILE_DESCRIPTION,
    parameters: uploadFileParameters,
    onArgsRejected: deps.onArgsRejected,
    describeActivity: (args) => ({
      detail: import_node_path166.posix.basename(args.sourcePath),
      target: args.connection
    }),
    execute: async (ctx, args, d) => runUploadFile(args, { ...d, signal: ctx.signal })
  });
}


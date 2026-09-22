/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/grok-bot-harness/src/runner/tools/read-email-attachment-tool.ts
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/2
var import_node_url8 = require("node:url");
init_zod();

// @recovered-fragment 2/2
var READ_EMAIL_ATTACHMENT_ID_MAX_LENGTH = 32;
var readEmailAttachmentParameters = external_exports.object({
  attachment_id: external_exports.string().trim().min(1).max(READ_EMAIL_ATTACHMENT_ID_MAX_LENGTH).describe(`An attachment_id listed by ${SAND_READ_EMAIL_THREAD_TOOL_NAME}.`)
});
var description4 = [
  `Open one email attachment by the attachment_id that ${SAND_READ_EMAIL_THREAD_TOOL_NAME} listed. Do not invent attachment ids.`,
  `Text-like attachments (plain text, CSV, JSON, calendar files) come back as text, cut off at ${Math.round(READ_EMAIL_ATTACHMENT_TEXT_MAX_BYTES / 1024)} KB.`,
  "Anything else (PDFs, images, spreadsheets, archives) is saved into your attachments folder on the box and the result gives you its path; read it there with the box Read tool or Shell, or attach it to a message by that path.",
  "Images pasted into a message body are listed as inline attachments and open the same way.",
  "An attachment marked skipped was too large to store and cannot be opened."
].join("\n");
function displayAttachmentName(summary) {
  return summary.filename.length > 0 ? summary.filename : `attachment-${summary.attachmentId}`;
}
function storedAttachmentName(summary) {
  if (summary.filename.length > 0) return summary.filename;
  return `email-attachment-${summary.attachmentId}.bin`;
}
function describe(summary) {
  return `"${displayAttachmentName(summary)}" (${summary.contentType}, ${formatEmailAttachmentSize(summary.sizeBytes)})`;
}
function renderEmailAttachmentText(attachment, text2, truncated) {
  const lines2 = [
    `Attachment ${describe(attachment.summary)}, attachment_id ${attachment.summary.attachmentId}:`,
    "",
    text2.trimEnd()
  ];
  if (truncated) {
    lines2.push(
      "",
      `[attachment text truncated at ${Math.round(READ_EMAIL_ATTACHMENT_TEXT_MAX_BYTES / 1024)} KB]`
    );
  }
  return lines2.join("\n");
}
function renderEmailAttachmentSaved(attachment, path30) {
  return [
    `Saved attachment ${describe(attachment.summary)} to ${path30}.`,
    "Read it there with the box Read tool or Shell, or attach it to a message by that path."
  ].join("\n");
}
async function readEmailAttachment(deps, args) {
  const attachment = await deps.email.readAttachment({ attachmentId: args.attachment_id });
  switch (attachment.content.kind) {
    case "text":
      return renderEmailAttachmentText(
        attachment,
        attachment.content.text,
        attachment.content.truncated
      );
    case "bytes": {
      const persist = deps.getPersistMediaBytes();
      if (persist === void 0) {
        throw new SandToolInputError(
          `Attachment ${describe(attachment.summary)} is not text and your attachments folder is unavailable right now, so it cannot be opened in this turn.`
        );
      }
      const url2 = await persist(storedAttachmentName(attachment.summary), attachment.content.data);
      if (url2 === null) {
        throw new SandToolInputError(
          `Attachment ${describe(attachment.summary)} could not be saved to your attachments folder.`
        );
      }
      return renderEmailAttachmentSaved(
        attachment,
        url2.startsWith("file:") ? (0, import_node_url8.fileURLToPath)(url2) : url2
      );
    }
  }
}
function createReadEmailAttachmentTool(deps) {
  return defineCommunicateTool(deps, {
    id: "PLATFORM_ACTION",
    name: SAND_READ_EMAIL_ATTACHMENT_TOOL_NAME,
    description: description4,
    parameters: readEmailAttachmentParameters,
    describeActivity: (args) => ({ detail: args.attachment_id }),
    execute: async (_ctx, args, d) => readEmailAttachment(d, args)
  });
}


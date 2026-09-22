/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/shared/media/attachment-limits.ts
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var ATTACHMENT_BYTE_LIMIT = 25 * 1024 * 1024;
var VIDEO_BYTE_LIMIT = 200 * 1024 * 1024;
var AttachmentTooLargeError = class extends Error {
  limitBytes;
  constructor(limitBytes) {
    super(`Attachment exceeds ${limitBytes} bytes.`);
    this.name = "AttachmentTooLargeError";
    this.limitBytes = limitBytes;
  }
};


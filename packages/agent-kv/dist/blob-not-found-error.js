/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/agent-kv/dist/blob-not-found-error.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var CONVERSATION_DATA_MISSING_MESSAGE = "This conversation's data is missing and can't be restored. Start a new chat to continue.";
var MAX_MESSAGE_BLOB_ID_HEXES = 3;
var MESSAGE_BLOB_ID_HEX_LENGTH = 12;
function formatMissingBlobSuffix(blobIdHexes) {
  if (blobIdHexes.length === 0) {
    return "";
  }
  const shown = blobIdHexes.slice(0, MAX_MESSAGE_BLOB_ID_HEXES).map((hex) => hex.slice(0, MESSAGE_BLOB_ID_HEX_LENGTH));
  const label = blobIdHexes.length === 1 ? `missing blob ${shown[0]}` : `${blobIdHexes.length} missing blobs: ${shown.join(", ")}${blobIdHexes.length > shown.length ? ", \u2026" : ""}`;
  return ` (${label})`;
}
var BlobNotFoundError = class extends Error {
  constructor(blobIdHexes, options2) {
    super(`${CONVERSATION_DATA_MISSING_MESSAGE}${formatMissingBlobSuffix(blobIdHexes)}`, (options2 === null || options2 === void 0 ? void 0 : options2.cause) !== void 0 ? { cause: options2.cause } : void 0);
    this.isUsageError = true;
    this.isBlobNotFound = true;
    this.name = "BlobNotFoundError";
    this.blobIdHexes = [...blobIdHexes];
  }
};
var MAX_CAUSE_CHAIN_DEPTH = 10;
function isBlobNotFoundErrorNode(error42) {
  if (!(error42 instanceof Error)) {
    return false;
  }
  return error42 instanceof BlobNotFoundError || error42.isBlobNotFound === true || error42.name === "BlobNotFoundError";
}
function findBlobNotFoundError(error42) {
  let current = error42;
  for (let depth = 0; depth < MAX_CAUSE_CHAIN_DEPTH; depth++) {
    if (current === null || current === void 0) {
      return void 0;
    }
    if (isBlobNotFoundErrorNode(current)) {
      return current;
    }
    if (typeof current !== "object" || !("cause" in current)) {
      return void 0;
    }
    current = current.cause;
  }
  return void 0;
}


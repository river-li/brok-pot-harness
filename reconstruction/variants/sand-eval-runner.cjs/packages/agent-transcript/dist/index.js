/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/agent-transcript/dist/index.js
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/2
init_dist3();

// @recovered-fragment 2/2
var __awaiter38 = function(thisArg, _arguments, P2, generator) {
  function adopt(value) {
    return value instanceof P2 ? value : new P2(function(resolve14) {
      resolve14(value);
    });
  }
  return new (P2 || (P2 = Promise))(function(resolve14, reject2) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject2(e);
      }
    }
    function rejected3(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject2(e);
      }
    }
    function step(result) {
      result.done ? resolve14(result.value) : adopt(result.value).then(fulfilled, rejected3);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
var TRANSCRIPTS_SUBDIR2 = TRANSCRIPTS_SUBDIR;
var getSafeConversationId2 = getSafeConversationId;
function toHex2(bytes) {
  return Array.from(bytes).map((b2) => b2.toString(16).padStart(2, "0")).join("");
}
function jsonReplacer(_key, value) {
  if (value instanceof Uint8Array) {
    return {
      __type: "Uint8Array",
      hex: toHex2(value)
    };
  }
  if (typeof value === "bigint") {
    return value.toString();
  }
  return value;
}
function createTranscriptBinaryPlaceholder(byteLength) {
  return `[Binary data omitted from transcript: ${byteLength} bytes]`;
}
function jsonReviver(_key, value) {
  if (value && typeof value === "object" && value.__type === "Uint8Array" && typeof value.hex === "string") {
    const v2 = value;
    return createTranscriptBinaryPlaceholder(v2.hex.length / 2);
  }
  return value;
}
var textEncoder = new TextEncoder();
var textDecoder = new TextDecoder();
var SERIALIZED_UINT8_ARRAY_MARKER = '"__type":"Uint8Array"';
var OVERSIZE_TRANSCRIPT_BLOB_THRESHOLD_BYTES = 5e6;
function formatBlobSizeMegabytes(bytes) {
  return `${(bytes / 1e6).toFixed(1)} MB`;
}
function createOversizeBlobOmittedMessage(blobSizeBytes) {
  return {
    role: "assistant",
    content: `[Oversize transcript blob omitted: ${formatBlobSizeMegabytes(blobSizeBytes)}]`
  };
}
var CoreMessageSerde = class {
  serialize(value) {
    const json2 = JSON.stringify(value, jsonReplacer);
    return textEncoder.encode(json2);
  }
  deserialize(blob) {
    const json2 = textDecoder.decode(blob);
    if (json2.includes(SERIALIZED_UINT8_ARRAY_MARKER)) {
      return JSON.parse(json2, jsonReviver);
    }
    return JSON.parse(json2);
  }
};
var coreMessageSerde = new CoreMessageSerde();
function hydrateBlobIds(ctx, blobStore, blobIds) {
  return __awaiter38(this, void 0, void 0, function* () {
    const messages = [];
    let hydratedBlobCount = 0;
    let hydratedBlobBytes = 0;
    let largestHydratedBlobBytes = 0;
    let totalDeserializeDurationMs = 0;
    let omittedOversizeBlobCount = 0;
    let omittedOversizeBlobBytes = 0;
    let largestOmittedOversizeBlobBytes = 0;
    for (const blobId of blobIds) {
      const blob = yield blobStore.getBlob(ctx, blobId);
      if (blob) {
        if (blob.length > OVERSIZE_TRANSCRIPT_BLOB_THRESHOLD_BYTES) {
          messages.push(createOversizeBlobOmittedMessage(blob.length));
          omittedOversizeBlobCount++;
          omittedOversizeBlobBytes += blob.length;
          largestOmittedOversizeBlobBytes = Math.max(largestOmittedOversizeBlobBytes, blob.length);
          continue;
        }
        try {
          const deserializeStart = performance.now();
          const message = coreMessageSerde.deserialize(blob);
          const deserializeDurationMs = performance.now() - deserializeStart;
          messages.push(message);
          hydratedBlobCount++;
          hydratedBlobBytes += blob.length;
          largestHydratedBlobBytes = Math.max(largestHydratedBlobBytes, blob.length);
          totalDeserializeDurationMs += deserializeDurationMs;
        } catch (_a20) {
        }
      }
    }
    return {
      messages,
      hydratedBlobCount,
      hydratedBlobBytes,
      largestHydratedBlobBytes,
      totalDeserializeDurationMs,
      omittedOversizeBlobCount,
      omittedOversizeBlobBytes,
      largestOmittedOversizeBlobBytes
    };
  });
}


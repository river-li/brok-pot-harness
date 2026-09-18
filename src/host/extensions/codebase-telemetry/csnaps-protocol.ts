init_errors();
var MAX_FRAME_BYTES = 1024 * 1024;
var CsnapsProtocolError = class extends SandDomainError {
  name = "CsnapsProtocolError";
};
var CsnapsResponseDecoder = class {
  buffer = Buffer.alloc(0);
  decode(chunk) {
    const input = this.buffer.length === 0 ? chunk : Buffer.concat([this.buffer, chunk]);
    const decoded = decodeFramePayloads(input);
    const responses = decoded.payloads.map(parseCsnapsResponse);
    this.buffer = Buffer.from(decoded.remainder);
    return responses;
  }
  assertComplete() {
    if (this.buffer.length !== 0) {
      throw new CsnapsProtocolError("truncated csnaps response frame");
    }
  }
};
function encodeCsnapsRequest(id, operation) {
  if (!Number.isSafeInteger(id) || id < 0) {
    throw new CsnapsProtocolError("invalid csnaps request ID");
  }
  return encodeFrame(Buffer.from(JSON.stringify(createCsnapsRequest(id, operation)), "utf8"));
}
function parseCsnapsOperationResult(operation, value) {
  switch (operation.method) {
    case "ping":
    case "snapshot":
    case "trigger_upload":
    case "flush_pending_uploads":
    case "shutdown":
      return parseEmptyResult(value);
    case "initialize":
      return parseInitializeResult(value);
    case "get_state":
      return parseGetStateResult(value);
    case "apply_codebase_specs":
      return parseApplyResult(value);
    default: {
      const _exhaustive = operation;
      return _exhaustive;
    }
  }
}
function createCsnapsRequest(id, operation) {
  switch (operation.method) {
    case "ping":
    case "get_state":
      return { id, method: operation.method, params: {} };
    case "initialize":
    case "apply_codebase_specs":
    case "snapshot":
    case "trigger_upload":
    case "flush_pending_uploads":
      return { id, method: operation.method, params: operation.params };
    case "shutdown":
      return { id, method: operation.method, params: {} };
    default: {
      const _exhaustive = operation;
      return _exhaustive;
    }
  }
}
function encodeFrame(payload) {
  if (payload.length > MAX_FRAME_BYTES) {
    throw new CsnapsProtocolError(
      `csnaps request frame length ${payload.length} exceeds ${MAX_FRAME_BYTES}-byte limit`
    );
  }
  const frame = Buffer.allocUnsafe(4 + payload.length);
  frame.writeUInt32BE(payload.length, 0);
  payload.copy(frame, 4);
  return frame;
}
function decodeFramePayloads(input) {
  const payloads = [];
  let offset = 0;
  while (input.length - offset >= 4) {
    const payloadLength = input.readUInt32BE(offset);
    if (payloadLength > MAX_FRAME_BYTES) {
      throw new CsnapsProtocolError(
        `csnaps response frame length ${payloadLength} exceeds ${MAX_FRAME_BYTES}-byte limit`
      );
    }
    if (input.length - offset < 4 + payloadLength) {
      break;
    }
    payloads.push(input.subarray(offset + 4, offset + 4 + payloadLength));
    offset += 4 + payloadLength;
  }
  return { payloads, remainder: input.subarray(offset) };
}
function parseCsnapsResponse(payload) {
  const json3 = payload.toString("utf8");
  let value;
  try {
    value = JSON.parse(json3);
  } catch (cause) {
    throw new CsnapsProtocolError("invalid csnaps response JSON", { cause });
  }
  if (value == null || typeof value !== "object" || !("id" in value) || typeof value.id !== "number" || !Number.isSafeInteger(value.id) || value.id < 0 || !("ok" in value) || typeof value.ok !== "boolean") {
    throw new CsnapsProtocolError("invalid csnaps response envelope");
  }
  if (value.ok) {
    if (!hasExactKeys(value, ["id", "ok", "result"]) || !("result" in value)) {
      throw new CsnapsProtocolError("invalid csnaps success response");
    }
    return { id: value.id, ok: true, result: value.result };
  }
  if (!hasExactKeys(value, ["error", "id", "ok"]) || !("error" in value) || !isCsnapsErrorCode(value.error)) {
    throw new CsnapsProtocolError("invalid csnaps error response");
  }
  return { id: value.id, ok: false, error: value.error };
}
function parseEmptyResult(value) {
  if (value == null || typeof value !== "object" || !hasExactKeys(value, [])) {
    throw new CsnapsProtocolError("invalid empty csnaps result");
  }
  return {};
}
function parseInitializeResult(value) {
  if (value == null || typeof value !== "object" || !hasExactKeys(value, ["state"]) || !("state" in value)) {
    throw new CsnapsProtocolError("invalid csnaps initialize result");
  }
  return { state: parseServiceState(value.state) };
}
function parseGetStateResult(value) {
  if (value == null || typeof value !== "object" || !hasExactKeys(value, ["state"]) || !("state" in value)) {
    throw new CsnapsProtocolError("invalid csnaps get state result");
  }
  return { state: parseServiceState(value.state) };
}
function parseApplyResult(value) {
  if (value == null || typeof value !== "object" || !hasExactKeys(value, ["rejected", "state"]) || !("rejected" in value) || !Array.isArray(value.rejected) || !("state" in value)) {
    throw new CsnapsProtocolError("invalid csnaps apply result");
  }
  return {
    state: parseServiceState(value.state),
    rejected: value.rejected.map(parseRejectedCodebase)
  };
}
function parseServiceState(value) {
  if (value == null || typeof value !== "object" || !hasExactKeys(value, ["isWithinStorageBudget", "tracked"]) || !("tracked" in value) || !Array.isArray(value.tracked) || !("isWithinStorageBudget" in value) || typeof value.isWithinStorageBudget !== "boolean") {
    throw new CsnapsProtocolError("invalid csnaps service state");
  }
  return {
    tracked: value.tracked.map(parseTrackedCodebase),
    isWithinStorageBudget: value.isWithinStorageBudget
  };
}
function parseTrackedCodebase(value) {
  if (value == null || typeof value !== "object" || !hasExactKeys(value, ["codebaseUuid", "environment", "kind", "path"]) || !("codebaseUuid" in value) || !isUuid(value.codebaseUuid) || !("path" in value) || typeof value.path !== "string" || !("kind" in value) || typeof value.kind !== "number" || !("environment" in value) || typeof value.environment !== "number") {
    throw new CsnapsProtocolError("invalid tracked csnaps codebase");
  }
  return {
    codebaseUuid: value.codebaseUuid,
    path: value.path,
    kind: value.kind,
    environment: value.environment
  };
}
function parseRejectedCodebase(value) {
  if (value == null || typeof value !== "object" || !hasExactKeys(value, ["kind", "path"]) || !("path" in value) || typeof value.path !== "string" || !("kind" in value) || typeof value.kind !== "number") {
    throw new CsnapsProtocolError("invalid rejected csnaps codebase");
  }
  return { path: value.path, kind: value.kind };
}
function hasExactKeys(value, keys) {
  const actual = Object.keys(value).sort();
  const expected = [...keys].sort();
  return actual.length === expected.length && actual.every((key, index) => key === expected[index]);
}
function isCsnapsErrorCode(value) {
  switch (value) {
    case "unknown_method":
    case "invalid_params":
    case "already_initialized":
    case "not_initialized":
    case "codebases_not_reconciled":
    case "shutting_down":
    case "server_busy":
    case "invalid_configuration":
    case "invalid_codebases":
    case "codebase_environment_conflict":
    case "corrupt_uuid_state":
    case "state_io":
    case "snapshot_failed":
    case "upload_disabled":
    case "internal_error":
      return true;
    default:
      return false;
  }
}
function isUuid(value) {
  return typeof value === "string" && /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/.test(value);
}

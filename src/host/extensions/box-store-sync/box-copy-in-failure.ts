function isCopyInNativeCode(code) {
  if (typeof code !== "string") return false;
  if (Object.hasOwn(import_node_os3.constants.errno, code)) return true;
  switch (code) {
    case "ENOTFOUND":
    case "EAI_AGAIN":
    case "ESOCKETTIMEDOUT":
    case "UND_ERR_CONNECT_TIMEOUT":
    case "UND_ERR_HEADERS_TIMEOUT":
    case "UND_ERR_BODY_TIMEOUT":
    case "UND_ERR_SOCKET":
      return true;
    default:
      return false;
  }
}
function copyInFailureOf(error42) {
  const seen = /* @__PURE__ */ new Set();
  const read = (error43) => {
    let current = error43;
    while (current != null && typeof current === "object" && seen.size < 16 && !seen.has(current)) {
      seen.add(current);
      if (current instanceof SandBoxStoreSyncError && current.copyInFailureCode != null) {
        return { code: current.copyInFailureCode };
      }
      if ("httpStatus" in current && typeof current.httpStatus === "number") {
        return { code: "http", httpStatus: current.httpStatus };
      }
      if (current instanceof AgentStoreUnauthorizedError) {
        return { code: "agent-store-unauthorized" };
      }
      if (current instanceof ConnectError) {
        return {
          code: "connect",
          connectCode: current.code,
          ...current.code === Code.Unknown && current.cause != null ? { cause: read(current.cause) } : {}
        };
      }
      if ("code" in current && isCopyInNativeCode(current.code)) {
        return {
          code: "native",
          nativeCode: current.code,
          ..."errno" in current && typeof current.errno === "number" ? { errno: current.errno } : {},
          ..."cause" in current && current.cause != null ? { cause: read(current.cause) } : {}
        };
      }
      current = "cause" in current ? current.cause : void 0;
    }
    return { code: "unknown" };
  };
  return read(error42);
}
function copyInFailureClassOf(failure2) {
  switch (failure2.code) {
    case "lock-held":
    case "no-credential":
      return failure2.code;
    case "agent-store-unauthorized":
      return "auth";
    case "presign-response-mismatch":
      return "s3";
    case "legacy-hydration-mark-unsupported":
    case "unsafe-manifest-path":
    case "unsafe-symlink-target":
    case "missing-blob":
    case "read-body-missing":
    case "read-limit-exceeded":
    case "hash-size-mismatch":
    case "insufficient-disk-space":
    case "restore-directory-escapes-root":
    case "restore-root-not-directory":
    case "restore-parent-not-directory":
    case "restore-destination-not-file":
    case "manifest-file-entry-missing":
    case "symlink-target-mismatch":
    case "hash-source-not-file":
    case "copy-source-not-file":
    case "unknown":
      return "unknown";
    case "http":
      return failure2.httpStatus === 401 || failure2.httpStatus === 403 ? "auth" : "unknown";
    case "connect":
      switch (failure2.connectCode) {
        case Code.Unauthenticated:
        case Code.PermissionDenied:
          return "auth";
        case Code.DeadlineExceeded:
          return "timeout";
        case Code.Unavailable:
          return "network";
        case Code.Unknown:
          return failure2.cause == null ? "unknown" : copyInFailureClassOf(failure2.cause);
        default:
          return "unknown";
      }
    case "native":
      switch (failure2.nativeCode) {
        case "ETIMEDOUT":
        case "ESOCKETTIMEDOUT":
        case "UND_ERR_CONNECT_TIMEOUT":
        case "UND_ERR_HEADERS_TIMEOUT":
        case "UND_ERR_BODY_TIMEOUT":
          return "timeout";
        case "ENOTFOUND":
        case "EAI_AGAIN":
        case "ECONNREFUSED":
        case "ECONNRESET":
        case "ECONNABORTED":
        case "ENETUNREACH":
        case "EHOSTUNREACH":
        case "EPIPE":
        case "UND_ERR_SOCKET":
          return "network";
        default:
          return failure2.cause == null ? "unknown" : copyInFailureClassOf(failure2.cause);
      }
    default: {
      const exhaustive = failure2;
      return exhaustive;
    }
  }
}

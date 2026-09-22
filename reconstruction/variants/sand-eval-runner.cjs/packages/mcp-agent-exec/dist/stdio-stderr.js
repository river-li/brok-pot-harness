/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/mcp-agent-exec/dist/stdio-stderr.js
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_dist5();
var __awaiter33 = function(thisArg, _arguments, P2, generator) {
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
var STDERR_FLUSH_TIMEOUT_MS = 250;
var STDERR_TAIL_PROPERTY = "mcpStdioStderrTail";
function captureStdioStderr(stderr) {
  let captured = "";
  let ended = stderr === null;
  if (stderr !== null) {
    stderr.on("data", (chunk) => {
      const remaining = STDIO_CONNECT_STDERR_CAPTURE_MAX_BYTES - captured.length;
      if (remaining <= 0) {
        return;
      }
      captured += chunk.toString().slice(0, remaining);
    });
    stderr.once("end", () => {
      ended = true;
    });
  }
  return {
    // The child's stderr is outside our control and can carry tokens or other
    // credentials, so redact before it reaches a log line or an error message.
    read: () => sanitizeErrorMessageForLog(captured.replace(/\s+/g, " ").trim(), {
      maxLength: STDIO_CONNECT_STDERR_CAPTURE_MAX_BYTES
    }),
    waitForFlush: () => __awaiter33(this, void 0, void 0, function* () {
      if (ended || stderr === null) {
        return;
      }
      yield new Promise((resolve14) => {
        let timer2;
        const finish = () => {
          if (timer2 !== void 0) {
            clearTimeout(timer2);
          }
          stderr.off("end", finish);
          resolve14();
        };
        timer2 = setTimeout(finish, STDERR_FLUSH_TIMEOUT_MS);
        timer2.unref();
        stderr.once("end", finish);
      });
    })
  };
}
function annotateMcpStdioConnectError(error3, stderrTail) {
  if (stderrTail === "") {
    return error3;
  }
  const annotated2 = error3 instanceof Error ? error3 : new Error(String(error3));
  annotated2.message = `${annotated2.message}; stderr: ${stderrTail}`;
  Object.defineProperty(annotated2, STDERR_TAIL_PROPERTY, {
    value: stderrTail,
    enumerable: false,
    configurable: true,
    writable: true
  });
  return annotated2;
}
function getMcpStdioStderrTail(error3) {
  if (!(error3 instanceof Error)) {
    return void 0;
  }
  const tail = error3[STDERR_TAIL_PROPERTY];
  return typeof tail === "string" ? tail : void 0;
}


/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/host/agent-isolation/worker-log-forwarding.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var MAX_FORWARDED_WORKER_LINE_BYTES = 8 * 1024;
function forwardStream(stream3, emit) {
  if (stream3 == null) return;
  let buffered3 = "";
  const emitLine = (line) => {
    if (line.length === 0) return;
    emit(
      line.length > MAX_FORWARDED_WORKER_LINE_BYTES ? `${line.slice(0, MAX_FORWARDED_WORKER_LINE_BYTES)}\u2026[truncated]` : line
    );
  };
  stream3.setEncoding("utf8");
  stream3.on("data", (chunk) => {
    buffered3 += chunk;
    const lines2 = buffered3.split("\n");
    buffered3 = lines2.pop() ?? "";
    for (const line of lines2) emitLine(line.replace(/\r$/, ""));
    if (buffered3.length > MAX_FORWARDED_WORKER_LINE_BYTES * 2) {
      emitLine(buffered3);
      buffered3 = "";
    }
  });
  const flush = () => {
    const remainder = buffered3;
    buffered3 = "";
    emitLine(remainder);
  };
  stream3.on("end", flush);
  stream3.on("close", flush);
  stream3.on("error", () => {
  });
}


var import_node_crypto75 = require("node:crypto");
var import_node_path162 = require("node:path");
init_utils_pb2();
function isLargeOutputSpillEnabled(env = process.env) {
  return env.SAND_DISABLE_LARGE_OUTPUT_SPILL !== "1";
}
var SAND_SHELL_FILE_OUTPUT_THRESHOLD_BYTES = BigInt(MCP_TEXT_FILE_THRESHOLD_BYTES);
function createSandMcpTextSpiller(opts) {
  const thresholdBytes = opts.thresholdBytes ?? MCP_TEXT_FILE_THRESHOLD_BYTES;
  return async (ctx, result) => {
    if (result.result.case !== "success") {
      return result;
    }
    const materialized2 = await materializeMcpTextOutput({
      contentItems: result.result.value.content,
      thresholdBytes,
      write: async (aggregateText) => {
        try {
          const relativePath = import_node_path162.posix.join(AGENT_TOOLS_DIR, `${(0, import_node_crypto75.randomUUID)()}.txt`);
          const capped = aggregateText.length > MAX_OUTPUT_FILE_SIZE ? aggregateText.slice(0, MAX_OUTPUT_FILE_SIZE) : aggregateText;
          const data = new TextEncoder().encode(capped);
          await opts.uploadTextFile(ctx, relativePath, data);
          return new OutputLocation({
            filePath: relativePath,
            sizeBytes: BigInt(data.byteLength),
            lineCount: BigInt(capped.split("\n").length)
          });
        } catch {
          return void 0;
        }
      }
    });
    if (materialized2 === void 0 || materialized2 === result.result.value.content) {
      return result;
    }
    const spilled = result.clone();
    if (spilled.result.case === "success") {
      spilled.result.value.content = materialized2;
    }
    return spilled;
  };
}

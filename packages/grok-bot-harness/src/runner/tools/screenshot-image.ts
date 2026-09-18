var import_node_buffer5 = require("node:buffer");
async function shrinkImageForModel(ctx, bytes, options2) {
  const bounded = await boundInlineImageForModel(ctx, bytes, options2);
  return {
    data: import_node_buffer5.Buffer.from(bounded.data).toString("base64"),
    mimeType: bounded.mimeType
  };
}

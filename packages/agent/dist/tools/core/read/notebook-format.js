/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/agent/dist/tools/core/read/notebook-format.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var MAX_OUTPUT_CHARS_PER_CELL = 2e3;
function extractTextFromData(data) {
  if (data["text/plain"]) {
    const textPlain = data["text/plain"];
    if (typeof textPlain === "string") {
      return textPlain;
    }
    if (Array.isArray(textPlain)) {
      return textPlain.filter((item) => typeof item === "string").join("");
    }
  }
  if (data["text/markdown"]) {
    const textMarkdown = data["text/markdown"];
    if (typeof textMarkdown === "string") {
      return textMarkdown;
    }
    if (Array.isArray(textMarkdown)) {
      return textMarkdown.filter((item) => typeof item === "string").join("");
    }
  }
  return void 0;
}
function extractOutputText(output) {
  if (!output || typeof output !== "object") {
    return void 0;
  }
  if (output.output_type === "error" && output.traceback) {
    const ESC = String.fromCharCode(27);
    const ansiPattern = new RegExp(`${ESC}\\[[0-9;]*m`, "g");
    return output.traceback.map((line) => line.replace(ansiPattern, "")).join("\n");
  }
  if ((output.output_type === "execute_result" || output.output_type === "display_data") && output.data && typeof output.data === "object") {
    return extractTextFromData(output.data);
  }
  if (output.text) {
    if (typeof output.text === "string") {
      return output.text;
    }
    if (Array.isArray(output.text)) {
      const stringElements = output.text.filter((item) => typeof item === "string");
      if (stringElements.length > 0) {
        return stringElements.join("");
      }
    }
  }
  return void 0;
}
function formatNotebookForLLM(rawContent) {
  const notebook = tryParseNotebook(rawContent);
  if (!notebook) {
    return rawContent;
  }
  const formattedCells = [];
  notebook.cells.forEach((cell, index) => {
    const source = extractCellSource(cell);
    const cellHeader = `
Cell ${index}:`;
    const cellContent = `\`\`\`
${source}\`\`\``;
    const cellParts = [`${cellHeader}
${cellContent}`];
    if (cell.outputs && cell.outputs.length > 0) {
      let outputText = "";
      for (const output of cell.outputs) {
        if (outputText.length >= MAX_OUTPUT_CHARS_PER_CELL) {
          break;
        }
        const extractedText = extractOutputText(output);
        if (extractedText) {
          if (outputText.length > 0 && !outputText.endsWith("\n")) {
            outputText += "\n";
          }
          outputText += extractedText;
        }
      }
      if (outputText.length > 0) {
        const isTruncated = outputText.length > MAX_OUTPUT_CHARS_PER_CELL;
        outputText = outputText.substring(0, MAX_OUTPUT_CHARS_PER_CELL);
        let outputHeader = `Cell ${index} output:`;
        if (isTruncated) {
          outputHeader = `Cell ${index} output (truncated at ${MAX_OUTPUT_CHARS_PER_CELL} chars):`;
        }
        const outputContent = `\`\`\`
${outputText}\`\`\``;
        cellParts.push(`${outputHeader}
${outputContent}`);
      }
    }
    formattedCells.push(cellParts.join("\n\n"));
  });
  if (formattedCells.length === 0) {
    return "Notebook is empty (0 cells)";
  }
  return `${formattedCells.join("\n\n")}

`;
}
var isJupyterNotebook2 = isJupyterNotebook;


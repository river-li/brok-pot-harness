/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/agent/dist/tools/core/formatting.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
function formatCodeBlock(codeBlock, options2) {
  let result;
  if (codeBlock.formattingOptions.enableLineNumbers === false) {
    if (codeBlock.detailedLines !== void 0) {
      result = codeBlock.detailedLines.map((line) => line.text).join("\n");
    } else {
      result = codeBlock.content;
    }
  } else {
    result = addLineNumbers(codeBlock.formattingOptions, codeBlock.detailedLines ?? codeBlock.content, codeBlock.startLineNumber);
  }
  if (options2.addAmountOfOmittedLines === true && codeBlock.totalLineNumbersInFile !== void 0) {
    if (codeBlock.startLineNumber > 1) {
      const numHiddenLines = codeBlock.startLineNumber - 1;
      result = `... ${numHiddenLines} ${numHiddenLines === 1 ? "line" : "lines"} not shown ...
${result}`;
    }
    const numLinesInCodeBlock = codeBlock.content.split("\n").length;
    const endLineNumber = codeBlock.startLineNumber + numLinesInCodeBlock - 1;
    if (codeBlock.totalLineNumbersInFile > endLineNumber) {
      const numHiddenLines = codeBlock.totalLineNumbersInFile - endLineNumber;
      result = `${result}
... ${numHiddenLines} ${numHiddenLines === 1 ? "line" : "lines"} not shown ...`;
    }
  }
  if (codeBlock.tag !== void 0) {
    let isFullFileSection = "";
    if (codeBlock.isFullFile === true) {
      isFullFileSection = ' isFullFile="true"';
    }
    let languageIdentifierSection = "";
    if (codeBlock.languageIdentifier !== void 0) {
      languageIdentifierSection = ` language="${codeBlock.languageIdentifier}"`;
    }
    let pathSection = "";
    if (codeBlock.filePath) {
      pathSection = ` path="${codeBlock.filePath}"`;
    }
    let extraAttributesSection = "";
    if (codeBlock.extraAttributes !== void 0) {
      extraAttributesSection = Object.entries(codeBlock.extraAttributes).map(([key, value]) => ` ${key}="${value}"`).join("");
    }
    if (result.trim() === "") {
      result = `<${codeBlock.tag}${pathSection}${isFullFileSection}${languageIdentifierSection}${extraAttributesSection}></${codeBlock.tag}>`;
    } else {
      result = `
<${codeBlock.tag}${pathSection}${isFullFileSection}${languageIdentifierSection}${extraAttributesSection}>
${result}
</${codeBlock.tag}>
`;
    }
  }
  return result;
}
function addLineNumbers(formattingOptions, code, startLineNumber) {
  if (formattingOptions.gpt5CodexCatN === true) {
    return addLineNumbersGpt5CodexCatN(code, startLineNumber);
  } else if (formattingOptions.gpt5StyleLineNumbers === true) {
    return addLineNumbersGpt5(code, startLineNumber);
  } else {
    return addLineNumbersDefault(code, startLineNumber, formattingOptions.sparseLineNumbers);
  }
}
function addLineNumbersGpt5CodexCatN(code, startLineNumber) {
  if (typeof code === "string") {
    const lines2 = code.split("\n");
    return lines2.map((line, index) => {
      const lineNumber = startLineNumber + index;
      const paddedLineNumber = lineNumber.toString().padStart(6, " ");
      return `${paddedLineNumber}  ${line}`;
    }).join("\n");
  } else {
    return code.map((line) => {
      if (Number.isInteger(line.lineNumber)) {
        const paddedLineNumber = line.lineNumber.toString().padStart(6, " ");
        return `${paddedLineNumber}  ${line.text}`;
      } else {
        return `...`.padStart(6, " ");
      }
    }).join("\n");
  }
}
function addLineNumbersDefault(code, startLineNumber, sparseN) {
  if (typeof code === "string") {
    const lines2 = code.split("\n");
    return lines2.map((line, index) => {
      const lineNumber = startLineNumber + index;
      if (sparseN !== void 0 && lineNumber % sparseN !== 0) {
        return line;
      }
      const paddedLineNumber = lineNumber.toString().padStart(6, " ");
      return `${paddedLineNumber}|${line}`;
    }).join("\n");
  } else {
    return code.map((line) => {
      if (Number.isInteger(line.lineNumber)) {
        if (sparseN !== void 0 && line.lineNumber % sparseN !== 0) {
          return line.text;
        }
        const paddedLineNumber = line.lineNumber.toString().padStart(6, " ");
        return `${paddedLineNumber}|${line.text}`;
      } else {
        return `...`.padStart(6, " ");
      }
    }).join("\n");
  }
}
function addLineNumbersGpt5(code, startLineNumber) {
  if (typeof code === "string") {
    const lines2 = code.split("\n");
    return lines2.map((line, index) => {
      const lineNumber = startLineNumber + index;
      return `L${lineNumber}:${line}`;
    }).join("\n");
  } else {
    return code.map((line) => {
      if (Number.isInteger(line.lineNumber)) {
        return `L${line.lineNumber}:${line.text}`;
      } else {
        return "...";
      }
    }).join("\n");
  }
}


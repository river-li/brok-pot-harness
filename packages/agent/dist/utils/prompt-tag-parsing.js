function findOpenTagEnd(content, startIndex) {
  let inQuote = false;
  for (let i = startIndex; i < content.length; i++) {
    const ch = content[i];
    if (inQuote) {
      if (ch === '"') {
        inQuote = false;
      }
      continue;
    }
    if (ch === '"') {
      inQuote = true;
      continue;
    }
    if (ch === ">") {
      return i;
    }
  }
  return -1;
}
function extractCompleteTagRangesMatching(promptContent, matches) {
  const ranges = [];
  const openTagPattern = /<([a-zA-Z_][a-zA-Z0-9_]*)(?=[\s/>])/g;
  let searchStart = 0;
  while (searchStart < promptContent.length) {
    openTagPattern.lastIndex = searchStart;
    const openMatch = openTagPattern.exec(promptContent);
    if (openMatch === null) {
      break;
    }
    const openIndex = openMatch.index;
    const tagName2 = openMatch[1];
    if (!matches(tagName2)) {
      searchStart = openIndex + 1;
      continue;
    }
    const openTagEnd = findOpenTagEnd(promptContent, openIndex + 1 + tagName2.length);
    if (openTagEnd === -1) {
      break;
    }
    const closeTag = `</${tagName2}>`;
    const closeIndex = promptContent.indexOf(closeTag, openTagEnd + 1);
    if (closeIndex === -1) {
      searchStart = openIndex + 1;
      continue;
    }
    const sectionEnd = closeIndex + closeTag.length;
    ranges.push({ start: openIndex, end: sectionEnd, tagName: tagName2 });
    searchStart = sectionEnd;
  }
  return ranges;
}
function extractSelfClosingTagRangesMatching(promptContent, matches) {
  const ranges = [];
  const openTagPattern = /<([a-zA-Z_][a-zA-Z0-9_]*)(?=[\s/>])/g;
  let searchStart = 0;
  while (searchStart < promptContent.length) {
    openTagPattern.lastIndex = searchStart;
    const openMatch = openTagPattern.exec(promptContent);
    if (openMatch === null) {
      break;
    }
    const openIndex = openMatch.index;
    const tagName2 = openMatch[1];
    if (!matches(tagName2)) {
      searchStart = openIndex + 1;
      continue;
    }
    const openTagEnd = findOpenTagEnd(promptContent, openIndex + 1 + tagName2.length);
    if (openTagEnd === -1) {
      break;
    }
    let lastNonWhitespaceIndex = openTagEnd - 1;
    while (lastNonWhitespaceIndex > openIndex && /\s/.test(promptContent[lastNonWhitespaceIndex])) {
      lastNonWhitespaceIndex--;
    }
    if (promptContent[lastNonWhitespaceIndex] !== "/") {
      searchStart = openIndex + 1;
      continue;
    }
    const sectionEnd = openTagEnd + 1;
    ranges.push({ start: openIndex, end: sectionEnd, tagName: tagName2 });
    searchStart = sectionEnd;
  }
  return ranges;
}
var MCP_SERVER_TAG_NAMES = /* @__PURE__ */ new Set([
  "mcp_file_system_server",
  "mcp_meta_tool_server",
  "namespace",
  // Legacy dynamic-tool prompts used this name.
  "dynamic_tool_namespace"
]);
function isMcpServerTagName(tagName2) {
  return MCP_SERVER_TAG_NAMES.has(tagName2);
}
function extractMcpServerTagRanges(promptContent) {
  const emittedStarts = /* @__PURE__ */ new Set();
  const ranges = [];
  const addRange = (range2) => {
    if (emittedStarts.has(range2.start)) {
      return;
    }
    emittedStarts.add(range2.start);
    ranges.push(range2);
  };
  for (const range2 of extractSelfClosingTagRangesMatching(promptContent, isMcpServerTagName)) {
    addRange(range2);
  }
  for (const range2 of extractCompleteTagRangesMatching(promptContent, isMcpServerTagName)) {
    addRange(range2);
  }
  return ranges;
}
function extractCompleteTagRanges(promptContent, tagName2) {
  return extractCompleteTagRangesMatching(promptContent, (candidate) => candidate === tagName2);
}

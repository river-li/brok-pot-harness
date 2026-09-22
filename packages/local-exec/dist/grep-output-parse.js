/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/local-exec/dist/grep-output-parse.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
function parseRipgrepContentOutput(stdout, clientLimitLines, ripgrepHardCuttoffLines) {
  const empty2 = {
    byFile: /* @__PURE__ */ new Map(),
    totalLines: 0,
    totalMatchedLines: 0,
    totalFiles: 0,
    clientTruncated: false,
    ripgrepTruncated: false
  };
  if (stdout.trim() === "") {
    return empty2;
  }
  const byFile = /* @__PURE__ */ new Map();
  const allFiles = /* @__PURE__ */ new Set();
  const bounds = new LineBounds();
  let totalMatchedLines = 0;
  let linesProcessed = 0;
  let totalLines = 0;
  let i = 0;
  while (nextRecordLineBounds(stdout, i, bounds)) {
    const lineStart = i;
    const lineEnd = bounds.lineEnd;
    i = bounds.nextStart;
    totalLines++;
    if (isDashDashLine(stdout, lineStart, lineEnd)) {
      continue;
    }
    let nul = -1;
    for (let q2 = lineStart; q2 < lineEnd; q2++) {
      if (stdout.charCodeAt(q2) === CharCode.NUL) {
        nul = q2;
        break;
      }
    }
    if (nul === -1) {
      continue;
    }
    let p2 = nul + 1;
    if (p2 >= lineEnd) {
      continue;
    }
    let lineNumber = 0;
    let digits = 0;
    while (p2 < lineEnd) {
      const c = stdout.charCodeAt(p2);
      if (c < CharCode.ZERO || c > CharCode.NINE) {
        break;
      }
      lineNumber = lineNumber * 10 + (c - CharCode.ZERO);
      digits++;
      p2++;
    }
    if (digits === 0 || p2 >= lineEnd || !Number.isFinite(lineNumber)) {
      continue;
    }
    const sep17 = stdout.charCodeAt(p2);
    if (sep17 !== CharCode.COLON && sep17 !== CharCode.DASH) {
      continue;
    }
    const isContextLine = sep17 === CharCode.DASH;
    if (isContextLine === false) {
      totalMatchedLines++;
    }
    const filename = stdout.slice(lineStart, nul);
    if (!allFiles.has(filename)) {
      allFiles.add(filename);
    }
    if (linesProcessed >= clientLimitLines) {
      continue;
    }
    const content = stdout.slice(p2 + 1, lineEnd);
    let fileResults = byFile.get(filename);
    if (fileResults === void 0) {
      fileResults = { file: filename, matches: [] };
      byFile.set(filename, fileResults);
    }
    fileResults.matches.push({ lineNumber, content, isContextLine });
    linesProcessed++;
  }
  const result = {
    byFile,
    totalLines: clampInt32(totalLines),
    totalMatchedLines: clampInt32(totalMatchedLines),
    totalFiles: clampInt32(allFiles.size),
    clientTruncated: linesProcessed >= clientLimitLines,
    ripgrepTruncated: totalLines >= ripgrepHardCuttoffLines
  };
  return result;
}
function parseRipgrepCountOutput(stdout, clientLimitLines, ripgrepHardCuttoffLines) {
  const trimmed = stdout.trim();
  if (trimmed === "") {
    return {
      counts: [],
      totalFiles: 0,
      totalMatches: 0,
      clientTruncated: false,
      ripgrepTruncated: false
    };
  }
  const allCounts = [];
  const bounds = new LineBounds();
  let i = 0;
  while (nextRecordLineBounds(trimmed, i, bounds)) {
    const lineStart = i;
    const lineEnd = bounds.lineEnd;
    i = bounds.nextStart;
    if (lineEnd === lineStart) {
      continue;
    }
    const colon = trimmed.lastIndexOf(":", lineEnd - 1);
    if (colon < lineStart || colon === lineStart) {
      continue;
    }
    const countString = trimmed.slice(colon + 1, lineEnd).trim();
    const parsedCount = parseInt(countString, 10);
    if (!Number.isFinite(parsedCount)) {
      continue;
    }
    allCounts.push({
      file: trimmed.slice(lineStart, colon),
      count: parsedCount
    });
  }
  const totalFiles = allCounts.length;
  let totalMatches = 0;
  for (let c = 0; c < allCounts.length; c++) {
    const entry = allCounts[c];
    if (entry !== void 0) {
      totalMatches += entry.count;
    }
  }
  const sliced = [];
  const keep = totalFiles < clientLimitLines ? totalFiles : clientLimitLines;
  for (let c = 0; c < keep; c++) {
    const entry = allCounts[c];
    if (entry !== void 0) {
      sliced.push(entry);
    }
  }
  return {
    counts: sliced,
    totalFiles: clampInt32(totalFiles),
    totalMatches: clampInt32(totalMatches),
    clientTruncated: totalFiles > clientLimitLines,
    ripgrepTruncated: totalFiles >= ripgrepHardCuttoffLines
  };
}
function parseRipgrepFilesOutput(stdout, clientLimitLines, ripgrepHardCuttoffLines) {
  const trimmed = stdout.trim();
  if (trimmed === "") {
    return {
      files: [],
      totalFiles: 0,
      clientTruncated: false,
      ripgrepTruncated: false
    };
  }
  const files = [];
  const bounds = new LineBounds();
  let totalFiles = 0;
  let i = 0;
  while (nextRecordLineBounds(trimmed, i, bounds)) {
    const lineStart = i;
    const lineEnd = bounds.lineEnd;
    i = bounds.nextStart;
    if (totalFiles < clientLimitLines) {
      files.push(trimmed.slice(lineStart, lineEnd));
    }
    totalFiles++;
  }
  return {
    files,
    totalFiles: clampInt32(totalFiles),
    clientTruncated: totalFiles > clientLimitLines,
    ripgrepTruncated: totalFiles >= ripgrepHardCuttoffLines
  };
}


/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/agent/dist/diff-processing.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var DIFF_TRUNCATION_NOTICE = "\n\n[diff truncated due to size]";
var DIFF_NO_BUDGET_MESSAGE = "[diff omitted due to size constraints]";
function formatParsedDiffWithTruncation(parsedDiff, maxCharLength, options2 = {}) {
  const { originalContent, truncationNotice: truncationNotice2 = DIFF_TRUNCATION_NOTICE, skipSorting = false } = options2;
  if (maxCharLength <= 0) {
    return DIFF_NO_BUDGET_MESSAGE;
  }
  if (parsedDiff.files.length === 0) {
    const content = originalContent ?? parsedDiff.preface;
    if (content.length <= maxCharLength) {
      return content;
    }
    return truncateWithNotice(content, maxCharLength, truncationNotice2);
  }
  const filesToProcess = skipSorting ? parsedDiff.files : [...parsedDiff.files].sort((a, b2) => a.content.length - b2.content.length);
  const allFilenames = parsedDiff.files.map((file2) => file2.fileName);
  const includedFilenames = filesToProcess.map((file2) => file2.fileName);
  const includedContents = filesToProcess.map((file2) => file2.content);
  const prefaceLength = parsedDiff.preface.length;
  let totalContentLength = includedContents.reduce((sum, c) => sum + c.length, 0);
  const buildDiffString = (maxCharsForSummary) => {
    const summary = buildTruncatedFilenameSummary(allFilenames, includedFilenames, maxCharsForSummary);
    return parsedDiff.preface + includedContents.join("") + summary;
  };
  const computeExpectedLength = () => {
    const summary = buildTruncatedFilenameSummary(allFilenames, includedFilenames);
    return prefaceLength + totalContentLength + summary.length;
  };
  let left = 0;
  let right = includedContents.length;
  let bestCount = 0;
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    const testTotalContentLength = includedContents.slice(0, mid).reduce((sum, c) => sum + c.length, 0);
    const testIncludedFilenames = includedFilenames.slice(0, mid);
    const testSummary = buildTruncatedFilenameSummary(allFilenames, testIncludedFilenames);
    const testExpectedLength = prefaceLength + testTotalContentLength + testSummary.length;
    if (testExpectedLength <= maxCharLength) {
      bestCount = mid;
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  includedContents.splice(bestCount);
  includedFilenames.splice(bestCount);
  totalContentLength = includedContents.reduce((sum, c) => sum + c.length, 0);
  let diffString = buildDiffString();
  if (diffString.length > maxCharLength) {
    const summaryBudget = Math.max(0, maxCharLength - parsedDiff.preface.length);
    diffString = buildDiffString(summaryBudget);
  }
  if (diffString.length > maxCharLength) {
    const content = originalContent ?? diffString;
    return truncateWithNotice(content, maxCharLength, truncationNotice2);
  }
  return diffString;
}
function buildTruncatedFilenameSummary(allFilenames, includedFilenames, maxChars) {
  const includedSet = new Set(includedFilenames);
  const excludedFilenames = allFilenames.filter((filename) => !includedSet.has(filename));
  if (excludedFilenames.length === 0) {
    return "";
  }
  const header = "\n\nThe following files were also edited, but their diff has been excluded for brevity:\n\n";
  const filenameLineLength = (filename) => `- ${filename}
`.length;
  const summaryLineLength = (remainingCount2) => `
- ${remainingCount2} more filenames (paths not included for brevity)`.length;
  if (maxChars === void 0) {
    const fileLines2 = excludedFilenames.map((filename) => `- ${filename}`).join("\n");
    return header + fileLines2;
  }
  let currentLength = header.length;
  const filesThatFit = [];
  for (const filename of excludedFilenames) {
    const lineLength = filenameLineLength(filename);
    const remainingCount2 = excludedFilenames.length - filesThatFit.length - 1;
    const needsSummary = remainingCount2 > 0;
    const summaryLength = needsSummary ? summaryLineLength(remainingCount2) : 0;
    if (currentLength + lineLength + summaryLength <= maxChars) {
      filesThatFit.push(filename);
      currentLength += lineLength;
    } else {
      break;
    }
  }
  const remainingCount = excludedFilenames.length - filesThatFit.length;
  if (filesThatFit.length === 0) {
    if (remainingCount > 0) {
      return `${header}- ${remainingCount} files (paths not included for brevity)`;
    }
    return "";
  }
  const fileLines = filesThatFit.map((filename) => `- ${filename}`).join("\n");
  let result = header + fileLines;
  if (remainingCount > 0) {
    result += `
- ${remainingCount} more filenames (paths not included for brevity)`;
  }
  return result;
}
function truncateWithNotice(diffContent, maxCharLength, truncationNotice2 = DIFF_TRUNCATION_NOTICE) {
  if (maxCharLength < DIFF_NO_BUDGET_MESSAGE.length) {
    return "";
  }
  if (maxCharLength < truncationNotice2.length) {
    return DIFF_NO_BUDGET_MESSAGE;
  }
  const visibleLength = maxCharLength - truncationNotice2.length;
  if (visibleLength <= 0) {
    return DIFF_NO_BUDGET_MESSAGE;
  }
  return diffContent.slice(0, visibleLength) + truncationNotice2;
}


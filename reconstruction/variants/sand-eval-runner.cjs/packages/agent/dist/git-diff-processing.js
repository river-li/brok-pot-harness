/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/agent/dist/git-diff-processing.js
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/2
init_dist2();

// @recovered-fragment 2/2
function buildGitDiffContent(content, fullContentLengthCharCount, tagName, intro) {
  let diffContent = content ?? "";
  let wasTruncated = fullContentLengthCharCount > diffContent.length;
  if (diffContent.length > MAX_GIT_DIFF_CHAR_LENGTH) {
    wasTruncated = true;
    diffContent = formatGitDiffWithTruncation(diffContent, MAX_GIT_DIFF_CHAR_LENGTH);
  }
  const formattedDiff = wasTruncated && !diffContent.endsWith(GIT_DIFF_TRUNCATION_NOTICE) ? diffContent + GIT_DIFF_TRUNCATION_NOTICE : diffContent;
  const text2 = [`<${tagName}>`, `  ${intro}${formattedDiff}`, `  </${tagName}>`].join("\n");
  return {
    type: "text",
    text: text2
  };
}
function buildGitDiffUncommittedUserContent(gitDiff) {
  return buildGitDiffContent(gitDiff.content, gitDiff.fullContentLengthCharCount, "git_diff", GIT_DIFF_UNCOMMITTED_INTRO);
}
function buildGitDiffUserContent(gitDiff) {
  return buildGitDiffContent(gitDiff.content, gitDiff.fullContentLengthCharCount, "git_diff_from_branch_to_main", GIT_DIFF_INTRO);
}
function formatGitDiffWithTruncation(diffContent, maxCharLength) {
  if (maxCharLength <= 0) {
    return DIFF_NO_BUDGET_MESSAGE;
  }
  if (diffContent.length <= maxCharLength) {
    return diffContent;
  }
  const parsedDiff = parseGitDiffContent(diffContent);
  return formatParsedDiffWithTruncation(parsedDiff, maxCharLength, {
    originalContent: diffContent,
    truncationNotice: GIT_DIFF_TRUNCATION_NOTICE
  });
}
function parseGitDiffContent(diffContent) {
  const diffHeaderRegex = /^diff --git a\/(.+?) b\/(.+?)$/gm;
  const fileMatches = [];
  let match2 = diffHeaderRegex.exec(diffContent);
  while (match2 !== null) {
    const fileName = match2[2]?.trim() ?? match2[1]?.trim() ?? "unknown file";
    fileMatches.push({ index: match2.index ?? 0, fileName });
    match2 = diffHeaderRegex.exec(diffContent);
  }
  if (fileMatches.length === 0) {
    return {
      preface: diffContent,
      files: []
    };
  }
  const files = [];
  const preface = diffContent.slice(0, fileMatches[0].index);
  for (let i = 0; i < fileMatches.length; i += 1) {
    const start = fileMatches[i]?.index ?? diffContent.length;
    const end = i + 1 < fileMatches.length ? fileMatches[i + 1]?.index ?? diffContent.length : diffContent.length;
    const fileContent = diffContent.slice(start, end);
    files.push({
      fileName: fileMatches[i]?.fileName ?? "unknown file",
      content: fileContent
    });
  }
  return {
    preface,
    files
  };
}


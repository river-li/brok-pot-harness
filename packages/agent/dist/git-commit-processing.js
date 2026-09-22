var GIT_COMMIT_APPROXIMATE_MAX_TOKENS_PER_COMMIT = 8e3;
var GIT_COMMIT_CHARS_PER_TOKEN = 4;
var MAX_GIT_COMMIT_CHAR_LENGTH = GIT_COMMIT_APPROXIMATE_MAX_TOKENS_PER_COMMIT * GIT_COMMIT_CHARS_PER_TOKEN;
var GIT_COMMIT_DIFF_TRUNCATION_NOTICE = "\n\n[commit diff truncated due to size; run `git show <sha>` locally for the full output]";
function buildGitCommitsUserContent(gitCommits) {
  if (gitCommits.length === 0) {
    return {
      type: "text",
      text: ""
    };
  }
  const formattedCommits = gitCommits.map((commit) => formatSingleCommit(commit)).join("\n\n");
  const text2 = [
    "<git_commits>",
    `The following git commit${gitCommits.length > 1 ? "s have" : " has"} been manually attached:`,
    "",
    formattedCommits,
    "</git_commits>"
  ].join("\n");
  return {
    type: "text",
    text: text2
  };
}
function formatSingleCommit(commit) {
  const sha = commit.sha ?? "unknown";
  const message = commit.message ?? "";
  const description9 = commit.description;
  const diff = commit.diff ?? "";
  const headerLength = `Commit: ${sha}
Message: ${message}
`.length + (description9 ? `Description:
${description9}
`.length : 0) + `
Diff:
`.length;
  const availableCharsForDiff = Math.max(0, MAX_GIT_COMMIT_CHAR_LENGTH - headerLength);
  const truncatedDiff = diff.length > availableCharsForDiff ? diff.slice(0, availableCharsForDiff - GIT_COMMIT_DIFF_TRUNCATION_NOTICE.length) + GIT_COMMIT_DIFF_TRUNCATION_NOTICE : diff;
  const parts = [`Commit: ${sha}`, `Message: ${message}`];
  if (description9?.trim()) {
    parts.push(`Description:
${description9}`);
  }
  if (truncatedDiff) {
    parts.push(`
Diff:
${truncatedDiff}`);
  }
  return parts.join("\n");
}

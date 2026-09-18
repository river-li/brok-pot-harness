var GIT_DIFF_APPROXIMATE_MAX_TOKENS, GIT_DIFF_CHARS_PER_TOKEN, MAX_GIT_DIFF_CHAR_LENGTH, GIT_DIFF_INTRO, GIT_DIFF_UNCOMMITTED_INTRO, GIT_DIFF_TRUNCATION_NOTICE;
var init_git_diff = __esm({
  "../packages/constants/dist/git-diff.js"() {
    "use strict";
    GIT_DIFF_APPROXIMATE_MAX_TOKENS = 1e4;
    GIT_DIFF_CHARS_PER_TOKEN = 4;
    MAX_GIT_DIFF_CHAR_LENGTH = GIT_DIFF_APPROXIMATE_MAX_TOKENS * GIT_DIFF_CHARS_PER_TOKEN;
    GIT_DIFF_INTRO = "Relevant Diff: The following is the git diff from the current branch to the main/default branch:\n\n";
    GIT_DIFF_UNCOMMITTED_INTRO = "Relevant Diff: The following is the git diff of uncommitted changes in the working tree:\n\n";
    GIT_DIFF_TRUNCATION_NOTICE = "\n\n[diff truncated due to size; run `git diff` locally for the full output]";
  }
});

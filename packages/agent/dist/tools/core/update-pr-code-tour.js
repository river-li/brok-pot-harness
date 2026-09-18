init_zod();
var parametersSchema17 = external_exports.object({
  feedback: external_exports.string().optional().describe("Natural-language instructions for regenerating the PR code tour, such as 'make it shorter' or 'focus on review risks'. Do not combine with markdown or artifactPath."),
  revisionId: external_exports.string().optional().describe("COMPLETE revision id to edit in place. Required for replace, section patch, and attach. From <pr_code_tour_context> or GetPrCodeTour."),
  markdown: external_exports.string().optional().describe("Replacement markdown for the whole tour, or the new section body when heading is also set."),
  heading: external_exports.string().optional().describe("ATX heading text or slug of the target section. With markdown: replace that section only. With artifactPath: attach the media into that file-anchored section (defaults to the last file-anchored section)."),
  artifactPath: external_exports.string().optional().describe("Media artifact to attach to the revision as visible, playable step media: an image (png/jpeg/gif/webp) or a recording (.mp4/.webm), given as a workspace artifact path (e.g. /opt/cursor/artifacts/demo.mp4) or an artifact URL this agent owns. Images must already be uploaded (walkthrough artifacts upload when referenced in a response or PR body). Recordings upload from the VM on attach, so a recording saved under the artifacts directory can be attached right after it is captured. Provide with revisionId. The attach fails with an actionable error rather than storing media a reader cannot see."),
  artifactAlt: external_exports.string().optional().describe("Optional alt text for an attached artifact; rendered as the media's caption."),
  baseSha: external_exports.string().optional().describe("Optional commit-subset base SHA. Provide together with headSha to generate the tour from the baseSha..headSha range instead of the full PR diff."),
  headSha: external_exports.string().optional().describe("Optional commit-subset head SHA. Provide together with baseSha to generate the tour from the baseSha..headSha range instead of the full PR diff."),
  sourceRevisionId: external_exports.string().optional().describe("Revision id to seed regeneration from (see <pr_code_tour_context>). Ignored for in-place edits."),
  scopeCommitHashes: external_exports.array(external_exports.string()).optional().describe("Commit SHAs selecting a subset of the pull request's commits. When set, the subset selection takes effect for tour regeneration; omit or pass an empty list for the full diff."),
  explicitUserPrompt: external_exports.string().optional().describe("Verbatim user prompt that takes effect for tour regeneration, kept distinct from agent-authored feedback.")
});

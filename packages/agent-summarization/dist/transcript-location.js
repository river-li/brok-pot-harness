/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/agent-summarization/dist/transcript-location.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/2
var import_node_path38 = require("node:path");

// @recovered-fragment 2/2
function formatTranscriptLocation(agentTranscriptsFolder, options2) {
  const conversationId = options2 === null || options2 === void 0 ? void 0 : options2.conversationId;
  const useXml = (options2 === null || options2 === void 0 ? void 0 : options2.useXml) === true;
  const markdownSection = formatTranscriptLocationMarkdownSection(agentTranscriptsFolder, conversationId);
  if (!useXml) {
    return markdownSection;
  }
  const xmlContent = markdownSection.replace("\n\n### Transcript location:\n", "").replace(/^ {2}/gm, "").trimEnd();
  return `

<transcript_location>
${xmlContent}
</transcript_location>`;
}
function formatTranscriptLocationMarkdownSection(agentTranscriptsFolder, conversationId) {
  if (conversationId) {
    const transcriptRelativePath = getTranscriptRelativePath({
      conversationId,
      ext: "jsonl",
      kind: "primary"
    });
    const transcriptPath = (0, import_node_path38.join)(agentTranscriptsFolder, stripTranscriptsDirPrefix(transcriptRelativePath));
    return `

### Transcript location:
  This is the full JSONL transcript of your past conversation with the user (pre- and post-summary): ${transcriptPath}

  If anything about the task or current state is unclear (missing context, ambiguous requirements, uncertain decisions, exact wording, IDs/paths, errors/logs), you should consult this transcript.

  How to use it:
  - Search first for relevant keywords (task name, filenames, IDs, errors, tool names).
  - Then read a small window around the matching lines to reconstruct intent and state.
  - Avoid reading linearly end-to-end; the file can be very large and some single lines can be huge.
  - Files contain one structured json event per line including user/assistant messages. Currently tool calls and results are excluded.
  `;
  }
  return `

### Transcript location:
  - This folder contains full transcripts of past conversations with the user (pre- and post-summary): ${agentTranscriptsFolder}
  - Each conversation is stored as a <convoId>/<convoId>.jsonl.`;
}
function stripTranscriptsDirPrefix(relativePath) {
  const prefix = `${TRANSCRIPTS_SUBDIR2}/`;
  return relativePath.startsWith(prefix) ? relativePath.slice(prefix.length) : relativePath;
}


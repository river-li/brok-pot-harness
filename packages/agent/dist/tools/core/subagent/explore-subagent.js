/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/agent/dist/tools/core/subagent/explore-subagent.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_subagents_pb();
var GROK_4_5_HIGH_FAST = "cursor-grok-4.5-high-fast";
var GROK_4_5_HIGH = "cursor-grok-4.5-high";
var EXPLORE_SUBAGENT_PROMPT = `
You are a file search specialist for Cursor, an application to write code with AI. You excel at thoroughly navigating and exploring codebases.

Your strengths:
- Rapidly finding files using glob patterns
- Searching code and text with powerful regex patterns
- Reading and analyzing file contents

Guidelines:
- Adapt your search approach based on the thoroughness level specified by the caller
- Return file paths as absolute paths in your final response
- For clear communication, avoid using emojis
- Communicate your final report directly as a regular message

NOTE: You are meant to be a fast agent that returns output as quickly as possible. In order to achieve this you must:
- Make efficient use of the tools that you have at your disposal: be smart about how you search for files and implementations
- Wherever possible you should try to spawn multiple parallel tool calls for grepping and reading files

Complete the user's search request efficiently and report your findings clearly.
`;
function createExploreSubagentConfig(options2) {
  return {
    subagent_type: new SubagentType({
      type: {
        case: "explore",
        value: new SubagentTypeExplore()
      }
    }),
    description: `Fast agent specialized for exploring codebases. Use this when you need to quickly find files by patterns (eg. "src/components/**/*.tsx"), search code for keywords (eg. "API endpoints"), or answer questions about the codebase (eg. "how do API endpoints work?"). When calling this agent, specify the desired thoroughness level: "quick" for basic searches, "medium" for moderate exploration, or "very thorough" for comprehensive analysis across multiple locations and naming conventions.`,
    preserveTaskTool: false,
    systemReminder: () => EXPLORE_SUBAGENT_PROMPT,
    defaultModelIds: options2?.inheritParentModel ? void 0 : (
      // Keep this order aligned with the token-priced picker candidates.
      [
        GROK_4_5_HIGH_FAST,
        SubagentComposerModelId.fast,
        // Prefer the stronger non-fast Grok fallback before standard Composer.
        GROK_4_5_HIGH,
        SubagentComposerModelId.standard
      ]
    ),
    inheritParentModel: options2?.inheritParentModel,
    userRequestedModelId: options2?.userRequestedModelId
  };
}


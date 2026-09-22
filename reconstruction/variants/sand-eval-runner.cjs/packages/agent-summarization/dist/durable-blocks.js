/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/agent-summarization/dist/durable-blocks.js
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var SUMMARIZERS = {
  external: {
    leading: [],
    trailing: [
      "plan",
      "transcript",
      "mode-prompt",
      "custom-mode",
      "project-root",
      "automation-trigger",
      "todos",
      "skills"
    ]
  },
  "self-summary": {
    leading: ["mode-prompt", "custom-mode", "project-root"],
    trailing: ["transcript", "todos", "automation-trigger", "skills"]
  },
  "openai-compaction": {
    leading: ["mode-prompt", "custom-mode", "project-root"],
    trailing: ["todos", "automation-trigger", "skills", "transcript"]
  },
  "anthropic-compaction": {
    leading: ["mode-prompt", "custom-mode", "project-root"],
    trailing: ["transcript", "todos", "automation-trigger", "skills"]
  },
  "xai-compaction": {
    leading: [],
    trailing: [
      "plan",
      "mode-prompt",
      "custom-mode",
      "project-root",
      "todos",
      "automation-trigger",
      "skills",
      "transcript"
    ]
  }
};
var BLOCK_SEPARATOR = "\n\n";
function todoUpdateTag(todoContent) {
  return `<todo_update>
${todoContent}
</todo_update>`;
}
function unwrapPlanContent(plan) {
  const rawContent = plan.content.unwrap(PrivacyCapability.UNSAFE_ALWAYS_ALLOWED);
  return rawContent && rawContent.trim().length > 0 ? rawContent : void 0;
}
function planFilePath(plan) {
  const planName = plan.name || "plan";
  const planFilename = planName.endsWith(".plan.md") ? planName : `${planName}.plan.md`;
  return plan.composerId ? `cursor-plan://${plan.composerId}/${planFilename}` : `cursor-plan:///${planFilename}`;
}
function renderTranscript(agentTranscriptsFolder, conversationId, useXml) {
  const section = formatTranscriptLocation(agentTranscriptsFolder, {
    conversationId,
    useXml
  });
  return section.startsWith(BLOCK_SEPARATOR) ? section.slice(BLOCK_SEPARATOR.length) : section;
}
var BLOCK_RENDERERS = {
  "mode-prompt": {
    render: (enrichments) => enrichments.modePrompt
  },
  "custom-mode": {
    render: (enrichments) => enrichments.customModeSkillBlock
  },
  "project-root": {
    render: (enrichments) => enrichments.projectRootPrompt
  },
  plan: {
    render: (enrichments) => {
      if (!enrichments.currentPlan) {
        return void 0;
      }
      const content = unwrapPlanContent(enrichments.currentPlan);
      if (content === void 0) {
        return void 0;
      }
      const instruction = "The below plan was previously created in this session. If you are still in plan mode, continue to iterate on the plan with the user given the rest of your context on the current conversation. Otherwise, if there are remaining relevant todos, you should continue to implement them according to the plan.";
      return `10. Current plan mode progress:
   ${instruction}

<file_contents path="${planFilePath(enrichments.currentPlan)}" isFullFile="true">
${content}
</file_contents>`;
    },
    overrides: {
      "xai-compaction": (enrichments) => {
        if (!enrichments.currentPlan) {
          return void 0;
        }
        const content = unwrapPlanContent(enrichments.currentPlan);
        return content === void 0 ? void 0 : `<current_plan>
${content}
</current_plan>`;
      }
    }
  },
  transcript: {
    render: (enrichments, context2) => context2.includeTranscript !== false && enrichments.agentTranscriptsFolder ? renderTranscript(enrichments.agentTranscriptsFolder, enrichments.conversationId, true) : void 0,
    overrides: {
      external: (enrichments, context2) => context2.includeTranscript !== false && enrichments.agentTranscriptsFolder ? renderTranscript(enrichments.agentTranscriptsFolder, enrichments.conversationId, false) : void 0
    }
  },
  "automation-trigger": {
    render: (enrichments) => enrichments.automationTriggerContext ? `NOTE: This is an automation run. The original trigger info that started this session:
${enrichments.automationTriggerContext}` : void 0,
    overrides: {
      external: (enrichments) => enrichments.automationTriggerContext ? `12. Automation trigger info (this is the original trigger that started this agent):

${enrichments.automationTriggerContext}` : void 0,
      "xai-compaction": (enrichments) => enrichments.automationTriggerContext
    }
  },
  todos: {
    render: (enrichments) => enrichments.todoContent ? `NOTE: There was an active todo list in the conversation. Here is the latest update before summarization:
${todoUpdateTag(enrichments.todoContent)}` : void 0,
    overrides: {
      "xai-compaction": (enrichments) => enrichments.todoContent ? todoUpdateTag(enrichments.todoContent) : void 0
    }
  },
  skills: {
    render: (enrichments) => enrichments.skillBlocks.length > 0 ? enrichments.skillBlocks.join(BLOCK_SEPARATOR) : void 0
  }
};
function placedBlockIds(summarizer) {
  const { leading, trailing } = SUMMARIZERS[summarizer];
  return [.../* @__PURE__ */ new Set([...leading, ...trailing])];
}
function renderDurableBlocks(summarizer, enrichments, context2 = {}) {
  var _a20;
  var _b2;
  const blocks = /* @__PURE__ */ new Map();
  for (const id of placedBlockIds(summarizer)) {
    const spec = BLOCK_RENDERERS[id];
    const render2 = (_b2 = (_a20 = spec.overrides) === null || _a20 === void 0 ? void 0 : _a20[summarizer]) !== null && _b2 !== void 0 ? _b2 : spec.render;
    const promptText = render2(enrichments, context2);
    if (promptText !== void 0 && promptText.length > 0) {
      blocks.set(id, promptText);
    }
  }
  return blocks;
}
function selectBlockPrompts(blocks, ids) {
  const seen = /* @__PURE__ */ new Set();
  const promptTexts = [];
  for (const id of ids) {
    if (seen.has(id)) {
      continue;
    }
    seen.add(id);
    const promptText = blocks.get(id);
    if (promptText !== void 0) {
      promptTexts.push(promptText);
    }
  }
  return promptTexts;
}
function appendDurableBlocks(summarizer, blocks) {
  return selectBlockPrompts(blocks, SUMMARIZERS[summarizer].trailing).map((promptText) => `${BLOCK_SEPARATOR}${promptText}`).join("");
}
function prependDurableBlocks(summarizer, blocks) {
  return selectBlockPrompts(blocks, SUMMARIZERS[summarizer].leading).map((promptText) => `${promptText}${BLOCK_SEPARATOR}`).join("");
}


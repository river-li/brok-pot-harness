var noopLogger = {
  warn: () => {
  },
  info: () => {
  }
};
function transformToolMatcher(matcher, logger110 = noopLogger) {
  if (!matcher || matcher === "*") {
    return "*";
  }
  const tools = matcher.split("|");
  const transformedTools = [];
  const warnings = [];
  for (const tool of tools) {
    const trimmedTool = tool.trim();
    if (trimmedTool.startsWith("mcp__")) {
      const parts = trimmedTool.split("__");
      if (parts.length >= 3) {
        const toolName = parts.slice(2).join("__");
        transformedTools.push(`MCP:${toolName}`);
        continue;
      }
    }
    const cursorTool = CLAUDE_TOOL_TO_CURSOR_TOOL[trimmedTool];
    if (cursorTool === null) {
      if (UNSUPPORTED_CLAUDE_TOOLS.includes(trimmedTool)) {
        warnings.push(`Tool "${trimmedTool}" is not supported in Cursor and will be ignored`);
      }
      continue;
    }
    if (cursorTool !== void 0) {
      if (!transformedTools.includes(cursorTool)) {
        transformedTools.push(cursorTool);
      }
    } else {
      transformedTools.push(trimmedTool);
    }
  }
  for (const warning of warnings) {
    logger110.warn(warning);
  }
  if (transformedTools.length === 0) {
    return null;
  }
  return transformedTools.join("|");
}
function transformHookScript(claudeScript, matcher) {
  const base = {
    loop_limit: null,
    failClosed: false
  };
  if (matcher && matcher !== "*") {
    base.matcher = matcher;
  }
  if (claudeScript.timeout !== void 0) {
    base.timeout = claudeScript.timeout;
  }
  if (claudeScript.type === "prompt") {
    if (!claudeScript.prompt) {
      return null;
    }
    return Object.assign({ type: "prompt", prompt: claudeScript.prompt }, base);
  }
  if (!claudeScript.command) {
    return null;
  }
  return Object.assign({ type: "command", command: claudeScript.command }, base);
}
function transformHookEntry(entry, event, logger110 = noopLogger) {
  const result = [];
  const usesToolMatcher = event === "PreToolUse" || event === "PostToolUse";
  let effectiveMatcher;
  if (usesToolMatcher) {
    const transformed = transformToolMatcher(entry.matcher, logger110);
    if (transformed === null) {
      logger110.warn(`All tools in matcher "${entry.matcher}" are unsupported, skipping hooks`);
      return [];
    }
    effectiveMatcher = transformed === "*" ? void 0 : transformed;
  } else if (event === "SessionStart" || event === "PreCompact") {
    if (entry.matcher && entry.matcher !== "*" && entry.matcher !== "" && // Check if it's a trigger-specific matcher
    (event === "SessionStart" ? ["startup", "resume", "clear", "compact"].includes(entry.matcher) : ["manual", "auto"].includes(entry.matcher))) {
      logger110.warn(`${event} trigger matcher "${entry.matcher}" is not supported in Cursor, hooks will fire for all triggers`);
    }
    effectiveMatcher = void 0;
  } else {
    effectiveMatcher = void 0;
  }
  for (const claudeScript of entry.hooks) {
    const transformed = transformHookScript(claudeScript, effectiveMatcher);
    if (transformed) {
      result.push(transformed);
    }
  }
  return result;
}
function transformClaudeHooksToConfig(claudeHooks, logger110 = noopLogger) {
  const cursorHooks = {};
  for (const [eventName, entries] of Object.entries(claudeHooks)) {
    const event = eventName;
    if (UNSUPPORTED_CLAUDE_EVENTS.includes(event)) {
      logger110.warn(`Claude Code event "${event}" is not supported in Cursor and will be ignored`);
      continue;
    }
    const cursorStep = CLAUDE_EVENT_TO_CURSOR_STEP[event];
    if (!cursorStep) {
      logger110.warn(`Unknown Claude Code event "${event}", skipping`);
      continue;
    }
    const scripts = [];
    if (Array.isArray(entries)) {
      for (const entry of entries) {
        const transformedScripts = transformHookEntry(entry, event, logger110);
        scripts.push(...transformedScripts);
      }
    } else if (entries !== void 0) {
      logger110.warn(`Claude Code event "${event}" has invalid value (expected array), skipping`);
    }
    if (scripts.length > 0) {
      const existingScripts = cursorHooks[cursorStep] || [];
      cursorHooks[cursorStep] = [...existingScripts, ...scripts];
    }
  }
  return {
    version: 1,
    hooks: cursorHooks
  };
}
function detectHooksSchema(obj) {
  if (typeof obj !== "object" || obj === null) {
    return "unknown";
  }
  const config2 = obj;
  const hooksObj = typeof config2.hooks === "object" && config2.hooks !== null ? config2.hooks : null;
  if (!hooksObj) {
    return "unknown";
  }
  for (const value of Object.values(hooksObj)) {
    if (!Array.isArray(value) || value.length === 0) {
      continue;
    }
    const firstEntry = value[0];
    if (typeof firstEntry !== "object" || firstEntry === null) {
      continue;
    }
    const entry = firstEntry;
    if ("hooks" in entry && Array.isArray(entry.hooks)) {
      return "claude-code";
    }
    if ("command" in entry || "prompt" in entry || "type" in entry) {
      return "cursor";
    }
  }
  return "unknown";
}

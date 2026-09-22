/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/agent/dist/tools/core/shell/command-modifiers.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_dist2();
var import_tree_sitter2 = __toESM(require("tree-sitter"), 1);
var import_tree_sitter_bash2 = __toESM(require("tree-sitter-bash"), 1);
function isPowerShell(shellType) {
  if (!shellType) {
    return false;
  }
  const lower = shellType.toLowerCase();
  return lower.includes("powershell") || lower.includes("pwsh");
}
var TRAILER_FLAG = ` --trailer "${CURSOR_COAUTHORED_BY_TRAILER}"`;
var PR_FOOTER = "\n\nMade with [Cursor](https://cursor.com)";
function hasCommitAttribution(command) {
  return hasCursorCommitAttribution(command);
}
var bashParser = new import_tree_sitter2.default();
bashParser.setLanguage(import_tree_sitter_bash2.default);
function applyBashModifier(command, config2) {
  if (!config2.quickCheck(command)) {
    return command;
  }
  if (config2.alreadyModified(command)) {
    return command;
  }
  const tree = bashParser.parse(command);
  const insertions = [];
  function traverse(node) {
    if (node.type === "command") {
      const commandName = node.childForFieldName("name");
      const args = node.childrenForFieldName("argument");
      if (commandName && config2.isApplicable(commandName.text, args)) {
        const position = config2.findPosition(node);
        if (position !== null) {
          insertions.push({ position, text: config2.insertText });
        }
      }
    }
    for (const child of node.children) {
      traverse(child);
    }
  }
  traverse(tree.rootNode);
  if (insertions.length === 0) {
    return command;
  }
  insertions.sort((a, b2) => b2.position - a.position);
  let result = command;
  for (const insertion of insertions) {
    result = result.slice(0, insertion.position) + insertion.text + result.slice(insertion.position);
  }
  return result;
}
var bashGitCommitTrailerConfig = {
  quickCheck: (command) => command.includes("git"),
  alreadyModified: (command) => hasCommitAttribution(command),
  isApplicable: (commandName, args) => {
    if (commandName !== "git") {
      return false;
    }
    for (const arg of args) {
      if (!arg.text.startsWith("-")) {
        return arg.text === "commit";
      }
    }
    return false;
  },
  findPosition: (commandNode) => {
    const args = commandNode.childrenForFieldName("argument");
    for (const arg of args) {
      if (arg.text === "commit") {
        return arg.endIndex;
      }
    }
    return null;
  },
  insertText: TRAILER_FLAG
};
function addGitCommitTrailerBash(command) {
  return applyBashModifier(command, bashGitCommitTrailerConfig);
}
var bashPrFooterConfig = {
  quickCheck: (command) => command.includes("gh"),
  alreadyModified: (command) => command.includes("Made with [Cursor]"),
  isApplicable: (commandName, args) => {
    if (commandName !== "gh") {
      return false;
    }
    let foundPr = false;
    for (const arg of args) {
      if (arg.text.startsWith("-")) {
        continue;
      }
      if (!foundPr) {
        if (arg.text === "pr") {
          foundPr = true;
        } else {
          return false;
        }
      } else {
        return arg.text === "create";
      }
    }
    return false;
  },
  findPosition: (commandNode) => {
    const args = commandNode.childrenForFieldName("argument");
    for (let i = 0; i < args.length; i++) {
      const arg = args[i];
      const argText = arg.text;
      if (argText === "--body" || argText === "-b") {
        const nextArg = args[i + 1];
        if (!nextArg) {
          return null;
        }
        return findInsertPositionInBashBodyValue(nextArg);
      }
      if (argText.startsWith("--body=") || argText.startsWith("-b=")) {
        const prefixLen = argText.startsWith("--body=") ? 7 : 3;
        const value = argText.slice(prefixLen);
        if (value.startsWith('"') && value.endsWith('"') || value.startsWith("'") && value.endsWith("'")) {
          return arg.endIndex - 1;
        }
        return arg.endIndex;
      }
    }
    return null;
  },
  insertText: PR_FOOTER
};
function findInsertPositionInBashBodyValue(valueNode) {
  const text2 = valueNode.text;
  if (text2.includes("<<")) {
    const eofMatch = text2.match(/\n(EOF|END)\s*\)?"?\s*$/);
    if (eofMatch && eofMatch.index !== void 0) {
      return valueNode.startIndex + eofMatch.index;
    }
  }
  if (valueNode.type === "string" || valueNode.type === "raw_string") {
    return valueNode.endIndex - 1;
  }
  return null;
}
function addPRGeneratedByFooterBash(command) {
  return applyBashModifier(command, bashPrFooterConfig);
}
function addGitCommitTrailerPowerShell(command) {
  if (!command.includes("git")) {
    return command;
  }
  if (hasCommitAttribution(command)) {
    return command;
  }
  const gitCommitRegex = /\bgit\s+commit\b/g;
  const insertions = [];
  let match2 = gitCommitRegex.exec(command);
  while (match2 !== null) {
    insertions.push({
      position: match2.index + match2[0].length,
      text: TRAILER_FLAG
    });
    match2 = gitCommitRegex.exec(command);
  }
  if (insertions.length === 0) {
    return command;
  }
  insertions.sort((a, b2) => b2.position - a.position);
  let result = command;
  for (const insertion of insertions) {
    result = result.slice(0, insertion.position) + insertion.text + result.slice(insertion.position);
  }
  return result;
}
function addPRGeneratedByFooterPowerShell(command) {
  if (!command.includes("gh")) {
    return command;
  }
  if (command.includes("Made with [Cursor]")) {
    return command;
  }
  if (!/\bgh\s+pr\s+create\b/.test(command)) {
    return command;
  }
  const hereStringMatch = command.match(/(--body\s+|--body=|-b\s+|-b=)@(["'])([\s\S]*?)\n\2@/);
  if (hereStringMatch && hereStringMatch.index !== void 0) {
    const fullMatchEnd = hereStringMatch.index + hereStringMatch[0].length;
    const insertPosition = fullMatchEnd - 3;
    return command.slice(0, insertPosition) + PR_FOOTER + command.slice(insertPosition);
  }
  const quotedBodyMatch = command.match(/(--body\s+|--body=|-b\s+|-b=)(["'])((?:[^"'\\]|\\.|`.)*)(\2)/);
  if (quotedBodyMatch && quotedBodyMatch.index !== void 0) {
    const insertPosition = quotedBodyMatch.index + quotedBodyMatch[1].length + 1 + quotedBodyMatch[3].length;
    return command.slice(0, insertPosition) + PR_FOOTER + command.slice(insertPosition);
  }
  return command;
}
function addGitCommitTrailer(shellType) {
  return isPowerShell(shellType) ? addGitCommitTrailerPowerShell : addGitCommitTrailerBash;
}
function addPRGeneratedByFooter(shellType) {
  return isPowerShell(shellType) ? addPRGeneratedByFooterPowerShell : addPRGeneratedByFooterBash;
}


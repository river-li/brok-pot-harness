/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/local-exec/dist/services/admin-command-denylist.js
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_dist3();
var ADMIN_COMMAND_DENYLIST_UNANALYZABLE_REASON = `Denied: this command could not be conclusively analyzed against your team's administrator command denylist, so it was blocked (fail-closed) and was not executed. It cannot be approved from this conversation; only a user can run it manually outside the agent. You may continue working on the task.`;
function deriveAdminCommandDenylistMatchForms({ command, parsingResult }) {
  return [.../* @__PURE__ */ new Set([command, ...parsingResult.executableCommands.map((c) => c.fullText)])];
}
var ANSI_C_ESCAPES = {
  a: "\x07",
  b: "\b",
  e: "\x1B",
  E: "\x1B",
  f: "\f",
  n: "\n",
  r: "\r",
  t: "	",
  v: "\v",
  "\\": "\\",
  "'": "'",
  '"': '"',
  "?": "?"
};
function canonicalizeCommandForDenylistMatching(command) {
  let result = "";
  let mode = "plain";
  let i = 0;
  while (i < command.length) {
    const character = command[i];
    if (mode === "plain") {
      if (character === "$" && command[i + 1] === "'") {
        mode = "ansi";
        i += 2;
      } else if (character === "$" && command[i + 1] === '"') {
        mode = "double";
        i += 2;
      } else if (character === "'") {
        mode = "single";
        i++;
      } else if (character === '"') {
        mode = "double";
        i++;
      } else if (character === "\\" && i + 1 < command.length) {
        if (command[i + 1] !== "\n") {
          result += command[i + 1];
        }
        i += 2;
      } else {
        result += character;
        i++;
      }
      continue;
    }
    if (mode === "single") {
      if (character === "'") {
        mode = "plain";
      } else {
        result += character;
      }
      i++;
      continue;
    }
    if (mode === "double") {
      if (character === '"') {
        mode = "plain";
        i++;
        continue;
      }
      if (character === "\\" && i + 1 < command.length) {
        const escaped2 = command[i + 1];
        if (escaped2 === "$" || escaped2 === "`" || escaped2 === '"' || escaped2 === "\\" || escaped2 === "\n") {
          if (escaped2 !== "\n") {
            result += escaped2;
          }
          i += 2;
          continue;
        }
      }
      result += character;
      i++;
      continue;
    }
    if (character === "'") {
      mode = "plain";
      i++;
      continue;
    }
    if (character !== "\\" || i + 1 >= command.length) {
      result += character;
      i++;
      continue;
    }
    const escaped = command[i + 1];
    const namedEscape = ANSI_C_ESCAPES[escaped];
    if (namedEscape !== void 0) {
      result += namedEscape;
      i += 2;
      continue;
    }
    const encoded = escaped === "x" ? command.slice(i + 2).match(/^[0-9a-fA-F]{1,2}/)?.[0] : escaped === "u" ? command.slice(i + 2).match(/^[0-9a-fA-F]{1,4}/)?.[0] : escaped === "U" ? command.slice(i + 2).match(/^[0-9a-fA-F]{1,8}/)?.[0] : command.slice(i + 1).match(/^[0-7]{1,3}/)?.[0];
    const isUnicodeEscape = escaped === "u" || escaped === "U";
    const radix = escaped === "x" || isUnicodeEscape ? 16 : 8;
    if (encoded !== void 0) {
      const value = Number.parseInt(encoded, radix);
      if (!isUnicodeEscape || value <= 1114111) {
        result += isUnicodeEscape ? String.fromCodePoint(value) : String.fromCharCode(value);
        i += encoded.length + (radix === 16 ? 2 : 1);
        continue;
      }
    }
    result += escaped;
    i += 2;
  }
  return normalizeAdminCommandDenylistText(result);
}
function matchAdminCommandDenylistRule({ rule, command }) {
  const trimmedRule = normalizeAdminCommandDenylistText(rule).trim();
  if (trimmedRule.length === 0) {
    return false;
  }
  if (getAdminCommandDenylistRuleError(trimmedRule) !== null) {
    return true;
  }
  return [
    command.trim(),
    normalizeAdminCommandDenylistText(command).trim(),
    canonicalizeCommandForDenylistMatching(command).trim()
  ].some((commandForm) => matchRuleAgainstCommand(trimmedRule, commandForm));
}
function matchRuleAgainstCommand(trimmedRule, trimmedCommand) {
  const colonRule = parseAdminCommandDenylistColonRule(trimmedRule);
  if (colonRule !== void 0) {
    const { executablePattern, argsPattern } = colonRule;
    const spaceIdx = trimmedCommand.indexOf(" ");
    const executable = spaceIdx === -1 ? trimmedCommand : trimmedCommand.slice(0, spaceIdx);
    const argsText = spaceIdx === -1 ? "" : trimmedCommand.slice(spaceIdx + 1).trim();
    if (matchesCommandGlob(executablePattern, executable) && matchesCommandGlob(argsPattern, argsText)) {
      return true;
    }
  }
  if (trimmedRule.includes("*")) {
    return matchesCommandGlob(trimmedRule, trimmedCommand);
  }
  return trimmedCommand === trimmedRule || trimmedCommand.startsWith(`${trimmedRule} `);
}
function findMatchingAdminCommandDenylistPattern({ matchForms, blockedCommands }) {
  const rules = blockedCommands.map((entry) => entry.trim()).filter((entry) => entry.length > 0);
  if (rules.length === 0) {
    return void 0;
  }
  const forms = matchForms.map((form) => form.trim()).filter((form) => form.length > 0);
  const effectiveForms = forms.length > 0 ? forms : [""];
  for (const rule of rules) {
    if (effectiveForms.some((command) => matchAdminCommandDenylistRule({ rule, command }))) {
      return rule;
    }
  }
  return void 0;
}
function formatAdminCommandDenylistBlockReason(pattern) {
  return `Denied: this command was blocked by administrator policy (denylist rule: ${pattern}) and was not executed. It cannot be approved from this conversation; only a user can run it manually outside the agent. You may continue working on the task.`;
}
function getModelShellAdminCommandDenylistBlockReason({ command, parsingResult, blockedCommands }) {
  if (blockedCommands.length === 0) {
    return void 0;
  }
  if (parsingResult.parsingFailed || parsingResult.executableCommands.length === 0) {
    return ADMIN_COMMAND_DENYLIST_UNANALYZABLE_REASON;
  }
  const matchedPattern = findMatchingAdminCommandDenylistPattern({
    matchForms: deriveAdminCommandDenylistMatchForms({
      command,
      parsingResult
    }),
    blockedCommands
  });
  return matchedPattern === void 0 ? void 0 : formatAdminCommandDenylistBlockReason(matchedPattern);
}


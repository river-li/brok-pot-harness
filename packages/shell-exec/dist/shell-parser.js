var import_tree_sitter = __toESM(require("tree-sitter"), 1);
var import_tree_sitter_bash = __toESM(require("tree-sitter-bash"), 1);
var TREE_SITTER_STUBBED_ERROR_CODE = "CURSOR_TREE_SITTER_STUBBED";
function isStubbedTreeSitterError(error42) {
  return typeof error42 === "object" && error42 !== null && error42.code === TREE_SITTER_STUBBED_ERROR_CODE;
}
var cachedParser;
function getParser() {
  if (cachedParser !== void 0) {
    return cachedParser;
  }
  try {
    const parser = new import_tree_sitter.default();
    parser.setLanguage(import_tree_sitter_bash.default);
    cachedParser = parser;
  } catch (error42) {
    if (!isStubbedTreeSitterError(error42)) {
      throw error42;
    }
    cachedParser = null;
    console.warn("shell-parser: tree-sitter natives are unavailable in this artifact; shell command analysis degrades to parsingFailed");
  }
  return cachedParser;
}
var redirectNodeTypes = /* @__PURE__ */ new Set([
  "file_redirect",
  "heredoc_redirect",
  "herestring_redirect",
  "heredoc",
  "here_string",
  "redirect",
  "redirection"
]);
var fileRedirectOperatorTypes = /* @__PURE__ */ new Set(["<", ">", ">>", ">|", "<>", "<&", ">&", "&>", "&>>"]);
function analyzeShellCommand(cmd) {
  const parser = getParser();
  if (parser === null) {
    return {
      legacy: {
        simpleCommands: [],
        hasInputRedirect: false,
        hasOutputRedirect: false
      },
      structured: {
        parsingFailed: true,
        executableCommands: [],
        hasRedirects: false,
        hasCommandSubstitution: false,
        redirects: []
      }
    };
  }
  const tree = parser.parse(cmd);
  const processedRedirectNodes = /* @__PURE__ */ new WeakSet();
  let sawRedirect = false;
  let allRedirectsAreAllowlistSafe = true;
  const legacy = {
    simpleCommands: [],
    hasInputRedirect: false,
    hasOutputRedirect: false
  };
  const structured = {
    parsingFailed: false,
    executableCommands: [],
    hasRedirects: false,
    hasCommandSubstitution: false,
    redirects: []
  };
  const recordRedirect = (isAllowlistSafe) => {
    sawRedirect = true;
    structured.hasRedirects = true;
    allRedirectsAreAllowlistSafe = allRedirectsAreAllowlistSafe && isAllowlistSafe;
  };
  const markRedirectsFromText = (txt) => {
    if (/(^|\s)[0-9]*<<?<?/.test(txt)) {
      legacy.hasInputRedirect = true;
    }
    if (/(^|\s)[0-9]*>>/.test(txt) || /(^|\s)[0-9]*>(\||&)?/.test(txt) || /(^|\s)&>/.test(txt) || /(^|\s)[0-9]+>&[0-9]+/.test(txt)) {
      legacy.hasOutputRedirect = true;
    }
  };
  const getFileRedirectParts = (node) => {
    const children = node.children;
    const operatorIndex = children.findIndex((child) => fileRedirectOperatorTypes.has(child.type));
    if (operatorIndex === -1) {
      return void 0;
    }
    return {
      operator: children[operatorIndex]?.type ?? "",
      target: children.slice(operatorIndex + 1).find((child) => child.type !== "comment")
    };
  };
  const parseFd = (node) => {
    if (!node || !/^\d+$/.test(node.text)) {
      return void 0;
    }
    return Number.parseInt(node.text, 10);
  };
  const getExplicitRedirectFd = (node) => parseFd(node.children.find((child) => child.type === "file_descriptor"));
  const createRedirectClassificationState = () => ({
    fdTargets: /* @__PURE__ */ new Map([
      [0, "original-stdin"],
      [1, "original-stdout"],
      [2, "original-stderr"]
    ])
  });
  const isAllowlistSafeOutputTarget = (target) => target === "original-stdout" || target === "original-stderr" || target === "dev-null";
  const getRedirectDestinationFds = (node, operator) => {
    if (operator === "&>" || operator === "&>>") {
      return [1, 2];
    }
    const explicitFd = getExplicitRedirectFd(node);
    if (explicitFd !== void 0) {
      return [explicitFd];
    }
    return operator.startsWith("<") ? [0] : [1];
  };
  const markRedirectLegacyFields = (node) => {
    markRedirectsFromText(node.text);
    if (node.type === "heredoc_redirect" || node.type === "herestring_redirect") {
      legacy.hasInputRedirect = true;
    }
  };
  const getHeredocReceiverCommandName = (node) => {
    const redirectedStatement = node.parent;
    if (redirectedStatement?.type !== "redirected_statement") {
      return void 0;
    }
    const commandNode = redirectedStatement.children.find((child) => child.type === "command");
    const commandName = commandNode?.childForFieldName("name");
    return commandName?.text;
  };
  const isInsideUnquotedCommandSubstitution = (node) => {
    let current = node.parent;
    while (current) {
      if (current.type === "command_substitution" && current.parent?.type !== "string") {
        return true;
      }
      current = current.parent;
    }
    return false;
  };
  const classifyHeredocRedirect = (node) => {
    const receiverCommandName = getHeredocReceiverCommandName(node);
    const isAllowlistSafe = receiverCommandName !== void 0 && !isInsideUnquotedCommandSubstitution(node);
    const redirect = {
      operator: isAllowlistSafe ? "<<" : "",
      destinationFds: isAllowlistSafe ? [0] : [],
      targetNodeType: node.type
    };
    if (isAllowlistSafe) {
      redirect.targetText = receiverCommandName;
    }
    return { redirect, isAllowlistSafe };
  };
  const isExactDevNullTarget = (node) => {
    if (!node) {
      return false;
    }
    if (node.type === "word") {
      return node.text === "/dev/null";
    }
    if (node.type === "raw_string") {
      return node.text === "'/dev/null'";
    }
    if (node.type === "string") {
      const namedChildren = node.namedChildren;
      return namedChildren.length === 1 && namedChildren[0]?.type === "string_content" && namedChildren[0].text === "/dev/null";
    }
    return false;
  };
  const getStaticRedirectTargetText = (node) => {
    if (!node) {
      return void 0;
    }
    if (node.type === "word") {
      return node.namedChildren.length === 0 ? node.text : void 0;
    }
    if (node.type === "number") {
      return node.text;
    }
    if (node.type === "raw_string") {
      if (node.text.length < 2) {
        return void 0;
      }
      return node.text.slice(1, -1);
    }
    if (node.type === "string") {
      const namedChildren = node.namedChildren;
      if (namedChildren.length === 0 || namedChildren.some((child) => child.type !== "string_content")) {
        return void 0;
      }
      return namedChildren.map((child) => child.text).join("");
    }
    return void 0;
  };
  const classifyFileRedirect = (node, state) => {
    const parts = getFileRedirectParts(node);
    if (!parts) {
      return false;
    }
    const { operator, target } = parts;
    const destinationFds = getRedirectDestinationFds(node, operator);
    const targetText = getStaticRedirectTargetText(target);
    const redirect = {
      operator,
      destinationFds,
      targetNodeType: target?.type ?? ""
    };
    if (targetText !== void 0) {
      redirect.targetText = targetText;
    }
    structured.redirects.push(redirect);
    if (operator === ">&") {
      const sourceFd = parseFd(target);
      const sourceTarget = sourceFd === void 0 ? void 0 : state.fdTargets.get(sourceFd);
      if (!isAllowlistSafeOutputTarget(sourceTarget)) {
        for (const fd of destinationFds) {
          state.fdTargets.set(fd, "unsafe");
        }
        return false;
      }
      for (const fd of destinationFds) {
        state.fdTargets.set(fd, sourceTarget);
      }
      return true;
    }
    if (operator === "<&") {
      const sourceFd = parseFd(target);
      const sourceTarget = sourceFd === void 0 ? void 0 : state.fdTargets.get(sourceFd);
      if (sourceTarget !== "dev-null") {
        for (const fd of destinationFds) {
          state.fdTargets.set(fd, "unsafe");
        }
        return false;
      }
      for (const fd of destinationFds) {
        state.fdTargets.set(fd, sourceTarget);
      }
      return true;
    }
    if (!isExactDevNullTarget(target)) {
      for (const fd of destinationFds) {
        state.fdTargets.set(fd, "unsafe");
      }
      return false;
    }
    for (const fd of destinationFds) {
      state.fdTargets.set(fd, "dev-null");
    }
    return true;
  };
  const processRedirectNode = (node, state) => {
    if (processedRedirectNodes.has(node)) {
      return;
    }
    processedRedirectNodes.add(node);
    markRedirectLegacyFields(node);
    if (node.type === "heredoc_redirect") {
      const { redirect, isAllowlistSafe } = classifyHeredocRedirect(node);
      structured.redirects.push(redirect);
      recordRedirect(isAllowlistSafe);
      return;
    }
    if (node.type !== "file_redirect") {
      structured.redirects.push({
        operator: "",
        destinationFds: [],
        targetNodeType: node.type
      });
      recordRedirect(false);
      return;
    }
    recordRedirect(classifyFileRedirect(node, state));
  };
  const processDirectRedirectChildren = (node) => {
    const state = createRedirectClassificationState();
    for (const child of node.children) {
      if (redirectNodeTypes.has(child.type)) {
        processRedirectNode(child, state);
      }
    }
  };
  function traverse(node) {
    const type2 = node.type;
    processDirectRedirectChildren(node);
    if (redirectNodeTypes.has(type2) && !processedRedirectNodes.has(node)) {
      processRedirectNode(node, createRedirectClassificationState());
    }
    if (type2 === "command") {
      const commandName = node.childForFieldName("name");
      if (commandName === null) {
        structured.parsingFailed = true;
      } else {
        legacy.simpleCommands.push(commandName.text);
        let commandFullText = commandName.text;
        const commandArgs = [];
        for (const arg of node.childrenForFieldName("argument")) {
          commandArgs.push({
            type: arg.type,
            value: arg.text
          });
          commandFullText += ` ${arg.text}`;
        }
        structured.executableCommands.push({
          name: commandName.text,
          args: commandArgs,
          fullText: commandFullText
        });
      }
    }
    if (type2 === "command_name" || type2 === "simple_command") {
      if (type2 === "command_name" && !legacy.simpleCommands.includes(node.text)) {
        legacy.simpleCommands.push(node.text);
      } else if (type2 === "simple_command") {
        const firstChild = node.firstNamedChild;
        if (firstChild && firstChild.type === "command_name") {
          if (!legacy.simpleCommands.includes(firstChild.text)) {
            legacy.simpleCommands.push(firstChild.text);
          }
        } else {
          legacy.simpleCommands.push(node.text);
        }
      }
    }
    if (type2 === "command_substitution" || type2 === "process_substitution") {
      structured.hasCommandSubstitution = true;
    }
    for (const child of node.children) {
      traverse(child);
    }
  }
  traverse(tree.rootNode);
  if (sawRedirect) {
    structured.allRedirectsAreDevNull = allRedirectsAreAllowlistSafe;
  }
  return {
    legacy,
    structured
  };
}

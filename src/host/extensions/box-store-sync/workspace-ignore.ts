var import_node_fs21 = require("node:fs");
var import_node_path22 = require("node:path");
init_dist2();
var IGNORE_NOTHING = {
  ignores: () => false,
  canPruneDir: () => false
};
function parseIgnorePatterns(text2) {
  const patterns = [];
  for (const rawLine of text2.split(/\r?\n/)) {
    const line = rawLine.replace(/\s+$/, "");
    if (line === "" || line.startsWith("#")) continue;
    patterns.push(line);
  }
  return patterns;
}
function compileWorkspaceIgnore(patterns) {
  const rules = [];
  for (const pattern of patterns) {
    let rule;
    try {
      rule = compileRule(pattern);
    } catch {
      if (pattern.startsWith("!")) return IGNORE_NOTHING;
      continue;
    }
    if (rule != null) rules.push(rule);
  }
  if (rules.length === 0) return IGNORE_NOTHING;
  const positiveDirRes = rules.filter((r) => !r.negated).map((r) => r.dirRe);
  const negations = rules.filter((r) => r.negated);
  return {
    ignores(relPath) {
      let ignored = false;
      for (const rule of rules) {
        if (rule.fileRe.test(relPath)) ignored = !rule.negated;
      }
      return ignored;
    },
    canPruneDir(relDir) {
      if (!positiveDirRes.some((re3) => re3.test(relDir))) return false;
      for (const negation of negations) {
        if (negationReaches(negation.negationReach, relDir)) return false;
      }
      return true;
    }
  };
}
function loadWorkspaceIgnore(workspaceDir, defaults2 = SAND_BOX_WORKSPACE_DEFAULT_IGNORE_PATTERNS) {
  const patterns = [...defaults2];
  try {
    const text2 = (0, import_node_fs21.readFileSync)((0, import_node_path22.join)(workspaceDir, SAND_WORKSPACE_IGNORE_FILE_NAME), "utf8");
    patterns.push(...parseIgnorePatterns(text2));
  } catch {
  }
  return compileWorkspaceIgnore(patterns);
}
function compileRule(rawPattern) {
  let pattern = rawPattern;
  let negated = false;
  if (pattern.startsWith("!")) {
    negated = true;
    pattern = pattern.slice(1);
  } else if (pattern.startsWith("\\!") || pattern.startsWith("\\#")) {
    pattern = pattern.slice(1);
  }
  let isDir = false;
  if (pattern.endsWith("/")) {
    isDir = true;
    pattern = pattern.slice(0, -1);
  }
  let anchored = false;
  if (pattern.startsWith("/")) {
    anchored = true;
    pattern = pattern.slice(1);
  }
  if (pattern === "") return null;
  if (pattern.includes("/")) anchored = true;
  const body = globToRegexBody(pattern);
  const prefix = anchored ? "^" : "^(?:.*/)?";
  const fileRe = new RegExp(`${prefix}${body}${isDir ? "/.*" : "(?:/.*)?"}$`);
  const dirRe = new RegExp(`${prefix}${body}(?:/.*)?$`);
  return {
    negated,
    fileRe,
    dirRe,
    negationReach: negated ? computeNegationReach(pattern, anchored) : void 0
  };
}
function computeNegationReach(pattern, anchored) {
  if (!anchored) return { everywhere: true, literalPrefix: "" };
  const literal2 = [];
  for (const segment of pattern.split("/")) {
    if (/[*?[]/.test(segment)) break;
    literal2.push(segment);
  }
  if (literal2.length === 0) return { everywhere: true, literalPrefix: "" };
  return { everywhere: false, literalPrefix: literal2.join("/") };
}
function negationReaches(reach, relDir) {
  if (reach == null) return false;
  if (reach.everywhere) return true;
  const prefix = reach.literalPrefix;
  return prefix === relDir || prefix.startsWith(`${relDir}/`) || relDir.startsWith(`${prefix}/`);
}
function globToRegexBody(glob) {
  let re3 = "";
  const n = glob.length;
  let i = 0;
  while (i < n) {
    const c = glob[i];
    if (c === "*") {
      let j2 = i;
      while (j2 < n && glob[j2] === "*") j2 += 1;
      const doubleStar = j2 - i >= 2;
      const segAligned = i === 0 || glob[i - 1] === "/";
      if (doubleStar && segAligned && glob[j2] === "/") {
        re3 += "(?:.*/)?";
        i = j2 + 1;
      } else if (doubleStar && segAligned) {
        re3 += ".*";
        i = j2;
      } else {
        re3 += "[^/]*";
        i = j2;
      }
    } else if (c === "?") {
      re3 += "[^/]";
      i += 1;
    } else if (c === "[") {
      const cls = readCharClass(glob, i);
      if (cls == null) {
        re3 += "\\[";
        i += 1;
      } else {
        re3 += cls.regex;
        i = cls.end;
      }
    } else if (c === "/") {
      re3 += "/";
      i += 1;
    } else {
      re3 += escapeRegexChar(c);
      i += 1;
    }
  }
  return re3;
}
function readCharClass(glob, start) {
  let j2 = start + 1;
  let negate2 = false;
  if (glob[j2] === "!" || glob[j2] === "^") {
    negate2 = true;
    j2 += 1;
  }
  const contentStart = j2;
  if (glob[j2] === "]") j2 += 1;
  while (j2 < glob.length && glob[j2] !== "]") j2 += 1;
  if (j2 >= glob.length) return null;
  const inner = glob.slice(contentStart, j2);
  return { regex: `[${negate2 ? "^" : ""}${inner}]`, end: j2 + 1 };
}
function escapeRegexChar(c) {
  return /[.*+?^${}()|[\]\\]/.test(c) ? `\\${c}` : c;
}

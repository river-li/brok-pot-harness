var CLICK_ROLES = /* @__PURE__ */ new Set([
  "link",
  "button",
  "menuitem",
  "menuitemcheckbox",
  "menuitemradio",
  "tab",
  "checkbox",
  "radio",
  "switch",
  "option",
  "treeitem",
  "combobox",
  "summary"
]);
var FILL_ROLES = /* @__PURE__ */ new Set(["textbox", "searchbox", "combobox", "spinbutton"]);
var LINE_PATTERN = /^\s*-\s+([a-zA-Z]+)(?:\s+"((?:[^"\\]|\\.)*)")?(.*?)\[ref=((?:f\d+)?e\d+|ax\d+)\]/u;
function matchLine(line) {
  const match2 = LINE_PATTERN.exec(line);
  const [whole, role, name17, rest, ref] = match2 ?? [];
  if (whole === void 0 || role === void 0 || ref === void 0)
    return void 0;
  return { role, name: name17, rest: rest ?? "", ref, length: whole.length };
}
function kindsFor(role, rest) {
  const kinds = [];
  if (FILL_ROLES.has(role)) {
    kinds.push("fill");
  }
  if (CLICK_ROLES.has(role) || rest.includes("[cursor=pointer]")) {
    kinds.push("click");
  }
  return kinds;
}
function parseSnapshotLine(rawLine) {
  const line = rawLine.replace(/^(\s*-\s+)'(.*)'(:?)\s*$/u, "$1$2$3");
  const groups = matchLine(line);
  if (groups === void 0) {
    return void 0;
  }
  const rest = `${groups.rest}${line.slice(groups.length)}`;
  const kinds = kindsFor(groups.role, rest);
  return {
    ref: groups.ref,
    role: groups.role,
    name: (groups.name ?? "").replace(/\\"/gu, '"'),
    kinds,
    line: line.trim()
  };
}
var URL_LINE_PATTERN = /^\s*-\s+\/url:\s*(.+)$/u;
var BOX_PATTERN = / \[box=(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?),(\d+(?:\.\d+)?),(\d+(?:\.\d+)?)\]/u;
function matchBox(line) {
  const [, , y, , h] = BOX_PATTERN.exec(line) ?? [];
  if (y === void 0 || h === void 0)
    return void 0;
  return { top: Number(y), height: Number(h) };
}
function placement(line, viewportHeight) {
  const box = matchBox(line);
  if (box === void 0) {
    return void 0;
  }
  const top = box.top;
  const bottom = top + box.height;
  if (bottom <= 0) {
    return "above";
  }
  if (top >= viewportHeight) {
    return "below";
  }
  return "visible";
}
function indentOf(line) {
  return line.length - line.trimStart().length;
}
function visibleLines(lines2, viewportHeight) {
  const kept = [];
  let above = 0;
  let below = 0;
  const ancestors = [];
  for (const line of lines2) {
    if (line.trim() === "") {
      continue;
    }
    const indent = indentOf(line);
    while (ancestors.length > 0 && (ancestors.at(-1)?.indent ?? -1) >= indent) {
      ancestors.pop();
    }
    const own = placement(line, viewportHeight);
    const effective = own ?? ancestors.at(-1)?.placement ?? "visible";
    ancestors.push({ indent, placement: effective });
    if (effective === "visible") {
      kept.push(line);
    } else if (own !== void 0) {
      if (effective === "above") {
        above += 1;
      } else {
        below += 1;
      }
    }
  }
  return { kept, above, below };
}
function buildSnapshot(raw, options2) {
  const lines2 = raw.split("\n");
  const windowed = options2.viewportHeight === void 0 ? { kept: lines2, above: 0, below: 0 } : visibleLines(lines2, options2.viewportHeight);
  const kept = [];
  let used = 0;
  let truncated = false;
  for (const rawLine of windowed.kept) {
    const line = rawLine.replace(BOX_PATTERN, "");
    if (used + line.length + 1 > options2.maxChars) {
      truncated = true;
      break;
    }
    kept.push(line);
    used += line.length + 1;
  }
  const elements = [];
  const seen = /* @__PURE__ */ new Set();
  for (const line of kept) {
    const url2 = URL_LINE_PATTERN.exec(line)?.[1];
    const last = elements.at(-1);
    if (url2 !== void 0 && last !== void 0 && last.url === void 0) {
      last.url = url2.replace(/^"|"$/gu, "");
      continue;
    }
    const element = parseSnapshotLine(line);
    if (element !== void 0 && !seen.has(element.ref)) {
      seen.add(element.ref);
      elements.push(element);
    }
  }
  const parts = [];
  if (windowed.above > 0) {
    parts.push(`\u2026 [${windowed.above} elements above the viewport; scroll up to see them]`);
  }
  parts.push(...kept);
  if (truncated) {
    parts.push(`\u2026 [${windowed.kept.length - kept.length} more on-screen lines cut for length]`);
  }
  if (windowed.below > 0) {
    parts.push(`\u2026 [${windowed.below} elements below the viewport; scroll down to see them]`);
  }
  return {
    text: parts.join("\n"),
    elements,
    source: "aria",
    truncated,
    offscreenAbove: windowed.above,
    offscreenBelow: windowed.below,
    totalLines: lines2.length
  };
}
var SKIPPED_AX_ROLES = /* @__PURE__ */ new Set(["InlineTextBox", "LineBreak", "none", "presentation"]);
var CONTAINER_AX_ROLES = /* @__PURE__ */ new Set([
  "generic",
  "GenericContainer",
  "group",
  "LayoutTable",
  "LayoutTableRow",
  "LayoutTableCell",
  "Section"
]);
var AX_ROLE_ALIASES = {
  StaticText: "text",
  RootWebArea: "document",
  Iframe: "iframe",
  IframePresentational: "iframe",
  PopUpButton: "combobox",
  ComboBoxSelect: "combobox",
  ComboBoxMenuButton: "combobox",
  MenuListPopup: "listbox",
  DisclosureTriangle: "button",
  ToggleButton: "button",
  ListMarker: "text"
};
function axString(value) {
  return typeof value?.value === "string" ? value.value : "";
}
function buildDeepSnapshot(nodes, maxChars) {
  const byId = new Map(nodes.map((node) => [node.nodeId, node]));
  const roots = nodes.filter((node) => node.parentId === void 0 || !byId.has(node.parentId));
  const lines2 = [];
  const elements = [];
  const seen = /* @__PURE__ */ new Set();
  const visit2 = (node, depth) => {
    const rawRole = axString(node.role);
    const role = AX_ROLE_ALIASES[rawRole] ?? rawRole;
    const name17 = axString(node.name).replace(/\s+/gu, " ").trim();
    const children = (node.childIds ?? []).map((id) => byId.get(id)).filter((child) => child !== void 0);
    if (node.ignored || SKIPPED_AX_ROLES.has(rawRole)) {
      for (const child of children) {
        visit2(child, depth);
      }
      return;
    }
    const indent = "  ".repeat(depth);
    if (role === "text") {
      if (name17 !== "") {
        lines2.push(`${indent}- text: ${name17}`);
      }
      return;
    }
    const kinds = kindsFor(role, "");
    const hidden = node.properties?.some((property) => property.name === "hidden" && property.value.value === true) ?? false;
    if (hidden) {
      return;
    }
    if (CONTAINER_AX_ROLES.has(rawRole) && name17 === "" && kinds.length === 0) {
      for (const child of children) {
        visit2(child, depth);
      }
      return;
    }
    const ref = node.backendDOMNodeId === void 0 ? void 0 : `ax${String(node.backendDOMNodeId)}`;
    const value = FILL_ROLES.has(role) ? "" : axString(node.value);
    const addressable = ref !== void 0 && (kinds.length > 0 || name17 !== "" || value !== "");
    const parts = [`${indent}- ${role}`];
    if (name17 !== "") {
      parts.push(` "${name17.replace(/"/gu, '\\"').slice(0, 200)}"`);
    }
    if (addressable) {
      parts.push(` [ref=${ref}]`);
    }
    if (value !== "") {
      parts.push(`: ${value.slice(0, 120)}`);
    }
    const line = parts.join("");
    lines2.push(line + (children.length > 0 && value === "" ? ":" : ""));
    if (addressable && ref !== void 0 && !seen.has(ref)) {
      seen.add(ref);
      elements.push({
        ref,
        role,
        name: name17,
        kinds,
        line: line.trim(),
        backendNodeId: node.backendDOMNodeId,
        frameIndex: node.frameIndex
      });
    }
    for (const child of children) {
      visit2(child, depth + 1);
    }
  };
  for (const root of roots) {
    visit2(root, 0);
  }
  const kept = [];
  let used = 0;
  let truncated = false;
  for (const line of lines2) {
    if (used + line.length + 1 > maxChars) {
      truncated = true;
      break;
    }
    kept.push(line);
    used += line.length + 1;
  }
  const keptRefs = new Set(kept.map((line) => matchLine(line)?.ref).filter((ref) => ref !== void 0));
  const text2 = truncated ? `${kept.join("\n")}
\u2026 [${String(lines2.length - kept.length)} more lines of the full accessibility tree cut for length]` : kept.join("\n");
  return {
    text: text2,
    elements: elements.filter((element) => keptRefs.has(element.ref)),
    source: "deep-a11y",
    truncated,
    offscreenAbove: 0,
    offscreenBelow: 0,
    totalLines: lines2.length
  };
}
function describeElement(element) {
  const name17 = element.name === "" ? "" : ` "${element.name}"`;
  const inline = element.line.split(`[ref=${element.ref}]`)[1] ?? "";
  const hint = inline.replace(/\s*\[[^\]]*\]/gu, "").replace(/^\s*:?\s*/u, "").trim().slice(0, 80);
  const url2 = element.url === void 0 ? "" : ` \u2192 ${element.url.slice(0, 100)}`;
  const role = element.role === "combobox" ? "dropdown (combobox)" : element.role;
  return `${role}${name17}${hint === "" ? "" : ` \u2014 ${hint}`}${url2}`;
}
function elementCriteria(elements, kind, limit) {
  const criteria = {};
  let count = 0;
  for (const element of elements) {
    if (kind !== "any" && !element.kinds.includes(kind)) {
      continue;
    }
    if (count >= limit) {
      break;
    }
    criteria[element.ref] = describeElement(element);
    count += 1;
  }
  criteria.none = kind === "click" ? "None of these elements should be clicked right now" : kind === "fill" ? "None of these fields or dropdowns should be filled right now" : "None of these elements is the right one";
  return criteria;
}

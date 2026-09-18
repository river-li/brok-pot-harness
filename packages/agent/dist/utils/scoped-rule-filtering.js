function normalizeEmailForMatch(raw) {
  return raw.trim().toLowerCase();
}
function getFrontmatterLines(text2) {
  const normalized = text2.replace(/\r\n/g, "\n");
  const openingFence = normalized.match(/^(?:\uFEFF|\s)*---\n/);
  if (openingFence === null) {
    return [];
  }
  const contentStart = openingFence[0].length;
  const end = normalized.indexOf("\n---", contentStart);
  if (end === -1) {
    return [];
  }
  return normalized.slice(contentStart, end).split("\n");
}
function indentation(line) {
  const match2 = line.match(/^\s*/);
  return match2 === null ? 0 : match2[0].length;
}
function normalizeFrontmatterScalar(value) {
  const trimmed = value.trim();
  if (trimmed.length < 2) {
    return trimmed;
  }
  const first = trimmed[0];
  const last = trimmed[trimmed.length - 1];
  if (first === `"` && last === `"` || first === `'` && last === `'`) {
    return trimmed.slice(1, -1).trim();
  }
  return trimmed;
}
function parseScopedToScalar(value) {
  const trimmed = normalizeFrontmatterScalar(value);
  const list = trimmed.startsWith("[") && trimmed.endsWith("]") ? trimmed.slice(1, -1) : trimmed;
  return list.split(",").map((entry) => normalizeFrontmatterScalar(entry)).filter((entry) => entry.length > 0);
}
function parseIndentedList(lines2, start, parentIndent) {
  const entries = [];
  for (let index = start + 1; index < lines2.length; index++) {
    const line = lines2[index];
    if (line.trim().length === 0) {
      continue;
    }
    const lineIndent = indentation(line);
    if (lineIndent < parentIndent) {
      break;
    }
    const listItem = line.match(/^\s*-\s*(.+)$/);
    if (listItem === null) {
      break;
    }
    entries.push(normalizeFrontmatterScalar(listItem[1]));
  }
  return entries.filter((entry) => entry.length > 0);
}
function locateScopedTo(lines2) {
  let metadataIndent;
  for (let index = 0; index < lines2.length; index++) {
    const line = lines2[index];
    const flatScopedTo = line.match(/^\s*metadata\.scopedTo\s*:\s*(.*)$/);
    if (flatScopedTo !== null) {
      return { index, inlineValue: flatScopedTo[1] };
    }
    const metadata = line.match(/^(\s*)metadata\s*:\s*$/);
    if (metadata !== null) {
      metadataIndent = metadata[1].length;
      continue;
    }
    if (metadataIndent === void 0) {
      continue;
    }
    if (line.trim().length > 0 && indentation(line) <= metadataIndent) {
      metadataIndent = void 0;
      continue;
    }
    const nestedScopedTo = line.match(/^\s*scopedTo\s*:\s*(.*)$/);
    if (nestedScopedTo !== null) {
      return { index, inlineValue: nestedScopedTo[1] };
    }
  }
  return void 0;
}
function parseScopedToFromFrontmatter(text2) {
  const lines2 = getFrontmatterLines(text2);
  const scopedTo = locateScopedTo(lines2);
  if (scopedTo === void 0) {
    return [];
  }
  return scopedTo.inlineValue.trim().length > 0 ? parseScopedToScalar(scopedTo.inlineValue) : parseIndentedList(lines2, scopedTo.index, indentation(lines2[scopedTo.index]));
}
function getEffectiveScopedTo(item) {
  if (item.scopedTo !== void 0 && item.scopedTo.length > 0) {
    return item.scopedTo;
  }
  const raw = item.frontmatter !== void 0 && item.frontmatter.length > 0 ? item.frontmatter : item.content;
  return raw !== void 0 && raw.length > 0 ? parseScopedToFromFrontmatter(raw) : [];
}
function filterByActorIdentity(items, actor) {
  return items.filter((item) => {
    const scopedTo = getEffectiveScopedTo(item);
    return scopedTo.length === 0 || actor !== void 0 && scopedTo.some((email3) => normalizeEmailForMatch(email3) === actor.email);
  });
}

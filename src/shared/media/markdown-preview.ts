var PREVIEW_SOURCE_MAX_CHARS = 4096;
var PREVIEW_LINE_MAX_CHARS = 200;
var INLINE_TAG_PATTERN = /<(\/?)([a-zA-Z]+)\s*(\/)?>/g;
var BACKTICK_RUN_PATTERN = /`+/g;
var FENCE_LINE_PATTERN = /^[ \t]*(`{3,}|~{3,})/;
function insideRanges(index, ranges) {
  return ranges.some(([from2, to3]) => index >= from2 && index < to3);
}
function fencedBlockRanges(input) {
  const ranges = [];
  let offset = 0;
  let openRun = "";
  let openIndent = 0;
  let openStart = -1;
  for (const line of input.split("\n")) {
    const match2 = FENCE_LINE_PATTERN.exec(line);
    const run = match2?.[1];
    const runIndent = match2 === null || run === void 0 ? 0 : match2[0].length - run.length;
    if (openStart < 0) {
      const infoString = match2 === null ? "" : line.slice(match2[0].length);
      if (run !== void 0 && (run[0] === "~" || !infoString.includes("`"))) {
        openRun = run;
        openIndent = runIndent;
        openStart = offset;
      }
    } else if (run !== void 0 && run[0] === openRun[0] && run.length >= openRun.length && line.trim() === run && runIndent <= openIndent + 3) {
      ranges.push([openStart, offset + line.length]);
      openStart = -1;
    }
    offset += line.length + 1;
  }
  if (openStart >= 0) ranges.push([openStart, input.length]);
  return ranges;
}
function blankLineGaps(input) {
  const gaps = [];
  let previous = -1;
  for (let at3 = input.indexOf("\n"); at3 >= 0; at3 = input.indexOf("\n", at3 + 1)) {
    if (previous >= 0) {
      let blank = true;
      for (let between = previous + 1; between < at3 && blank; between++) {
        const char = input[between];
        blank = char === " " || char === "	";
      }
      if (blank) gaps.push([previous, at3 + 1]);
    }
    previous = at3;
  }
  return gaps;
}
function codeSpanRanges(input, fences) {
  const runs = [];
  for (const match2 of input.matchAll(BACKTICK_RUN_PATTERN)) {
    if (!insideRanges(match2.index, fences)) {
      runs.push([match2.index, match2.index + match2[0].length]);
    }
  }
  const runIndicesByLength = /* @__PURE__ */ new Map();
  for (const [runIndex, run] of runs.entries()) {
    const length = run[1] - run[0];
    const indices = runIndicesByLength.get(length);
    if (indices === void 0) {
      runIndicesByLength.set(length, [runIndex]);
    } else {
      indices.push(runIndex);
    }
  }
  const cursorByLength = /* @__PURE__ */ new Map();
  const gaps = blankLineGaps(input);
  let gapIndex = 0;
  const ranges = [];
  let index = 0;
  while (index < runs.length) {
    const open9 = runs[index];
    if (open9 === void 0) break;
    const openLength = open9[1] - open9[0];
    const indices = runIndicesByLength.get(openLength) ?? [];
    let cursor = cursorByLength.get(openLength) ?? 0;
    while (cursor < indices.length) {
      const ahead = indices[cursor];
      if (ahead === void 0 || ahead > index) break;
      cursor += 1;
    }
    cursorByLength.set(openLength, cursor);
    while (gapIndex < gaps.length) {
      const gap = gaps[gapIndex];
      if (gap === void 0 || gap[0] >= open9[1]) break;
      gapIndex += 1;
    }
    const blankEnd = gaps[gapIndex]?.[1] ?? Number.POSITIVE_INFINITY;
    const closeIndex = indices[cursor];
    if (closeIndex === void 0) {
      index += 1;
      continue;
    }
    const close = runs[closeIndex];
    if (close === void 0 || close[0] >= blankEnd) {
      index += 1;
      continue;
    }
    ranges.push([open9[0], close[1]]);
    index = closeIndex + 1;
  }
  return ranges;
}
function stripInlineFormattingTags(input) {
  if (!input.includes("<")) return input;
  const fences = fencedBlockRanges(input);
  const protectedRanges = [...fences, ...codeSpanRanges(input, fences)];
  const removals = [];
  const openTags = [];
  for (const match2 of input.matchAll(INLINE_TAG_PATTERN)) {
    const start = match2.index;
    const end = start + match2[0].length;
    if (insideRanges(start, protectedRanges)) continue;
    const tag = match2[2]?.toLowerCase();
    if (tag === void 0 || !INLINE_FORMATTING_TAGS.has(tag)) continue;
    const isClose = match2[1] === "/";
    const isSelfClosing = match2[3] === "/";
    const isVoid = VOID_INLINE_FORMATTING_TAGS.has(tag);
    if (isSelfClosing && (isClose || !isVoid)) continue;
    if (isVoid) {
      removals.push([start, end]);
      continue;
    }
    if (!isClose) {
      openTags.push({ tag, start, end });
      continue;
    }
    const top = openTags.at(-1);
    if (top === void 0 || top.tag !== tag) continue;
    openTags.pop();
    removals.push([top.start, top.end], [start, end]);
  }
  if (removals.length === 0) return input;
  removals.sort((a, b2) => a[0] - b2[0]);
  let output = "";
  let cursor = 0;
  for (const [start, end] of removals) {
    output += input.slice(cursor, start);
    cursor = end;
  }
  return output + input.slice(cursor);
}
var MATH_SPAN_PATTERN = /\$\$(?:[^$\\]|\\[\s\S])+\$\$|\\\([\s\S]+?\\\)|\\\[[\s\S]+?\\\]/g;
var TEX_TEXT_MACRO_PATTERN = /\\(?:text(?:rm|sf|tt|normal|bf|md|it|up)?|emph|(?:textcolor|colorbox)\{[^{}]*\}|fcolorbox\{[^{}]*\}\{[^{}]*\})\{([^{}]*)\}|\\color\{[^{}]*\}/g;
function unwrapTexTextMacros(tex) {
  const unwrapped = tex.replace(TEX_TEXT_MACRO_PATTERN, "$1");
  return unwrapped === tex ? tex : unwrapTexTextMacros(unwrapped);
}
function flattenMathSpans(input) {
  const fences = fencedBlockRanges(input);
  const protectedRanges = [...fences, ...codeSpanRanges(input, fences)];
  return input.replace(
    MATH_SPAN_PATTERN,
    (span, offset) => insideRanges(offset, protectedRanges) ? span : unwrapTexTextMacros(span.slice(2, -2))
  );
}
var PREVIEW_TRANSFORMS = [
  [/`+/g, ""],
  [/!\[([^\]]*)\]\([^)]*\)/g, "$1"],
  [/\[([^\]]+)\]\([^)]*\)/g, "$1"],
  [/\\\$/g, "$"],
  [/^\s{0,3}#{1,6}\s+/gm, ""],
  [/^\s{0,3}>\s?/gm, ""],
  [/^\s{0,3}(?:[-*+]|\d+[.)])\s+/gm, ""],
  [/\*\*([^*]+)\*\*/g, "$1"],
  [/__([^_]+)__/g, "$1"],
  [/~~([^~]+)~~/g, "$1"],
  [/\*([^*\n]+)\*/g, "$1"],
  [/(?<!\w)_([^_\n]+)_(?!\w)/g, "$1"],
  [/\|/g, " "]
];
function markdownToPreviewText(input) {
  const flattened = PREVIEW_TRANSFORMS.reduce(
    (text2, [pattern, replacement]) => text2.replace(pattern, replacement),
    flattenMathSpans(stripInlineFormattingTags(input))
  );
  return flattened.replace(/\s+/g, " ").trim();
}
function isHighSurrogate2(codeUnit) {
  return codeUnit >= 55296 && codeUnit <= 56319;
}
function flatCopy(slice) {
  return slice.split("").join("");
}
function boundedPrefix(text2, maxChars) {
  const end = isHighSurrogate2(text2.charCodeAt(maxChars - 1)) ? maxChars - 1 : maxChars;
  return flatCopy(text2.slice(0, end));
}
function boundedPreviewSource(text2) {
  return text2.length <= PREVIEW_SOURCE_MAX_CHARS ? text2 : boundedPrefix(text2, PREVIEW_SOURCE_MAX_CHARS);
}
function capPreviewLine(line) {
  if (line.length <= PREVIEW_LINE_MAX_CHARS) return line;
  return `${boundedPrefix(line, PREVIEW_LINE_MAX_CHARS - 1).trimEnd()}\u2026`;
}
function markdownToPreviewLine(markdown) {
  return capPreviewLine(markdownToPreviewText(boundedPreviewSource(markdown)));
}

/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/agent/dist/tools/lenient-array.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_zod();
var parseWholeArray = (text2) => {
  if (namesAKeyTwice(text2)) {
    return void 0;
  }
  try {
    const parsed2 = JSON.parse(text2);
    return Array.isArray(parsed2) ? parsed2 : void 0;
  } catch {
    return void 0;
  }
};
var diagnose = (text2) => {
  if (namesAKeyTwice(text2)) {
    return "duplicate-key";
  }
  try {
    const parsed2 = JSON.parse(text2);
    return Array.isArray(parsed2) ? "unreachable" : `parsed-as-${typeof parsed2}`;
  } catch (error42) {
    const message = error42 instanceof Error ? error42.message : "";
    if (/Unexpected end of (JSON input|data)/.test(message)) {
      return "truncated";
    }
    try {
      const requoted = JSON.parse(text2.replace(/'/g, '"'));
      if (Array.isArray(requoted)) {
        return "python-repr";
      }
    } catch {
    }
    return "corrupt-json";
  }
};
var decodeLeadingJsonArray = (blob) => {
  const start = blob.indexOf("[");
  if (start < 0) {
    return void 0;
  }
  let depth = 0;
  for (const token of jsonTokens(blob, start)) {
    if (token.kind !== "punctuation") {
      continue;
    }
    if (token.char === "[" || token.char === "{") {
      depth++;
    } else if ((token.char === "]" || token.char === "}") && --depth === 0) {
      const value = parseWholeArray(blob.slice(start, token.index + 1));
      return value === void 0 ? void 0 : { value, rest: blob.slice(token.index + 1) };
    }
  }
  return void 0;
};
var looksMultiItem = (scalar) => /,\s*\S/.test(scalar) || /\n\s*\S/.test(scalar);
var repairStringifiedArray = (value, field, itemsArePrimitive) => {
  const trimmed = value.trim();
  if (trimmed === "") {
    return { ok: false, reason: "empty" };
  }
  const direct = parseWholeArray(trimmed);
  if (direct !== void 0) {
    return { ok: true, value: direct, strategy: "clean-json" };
  }
  const leaks = [...trimmed.matchAll(leakedParameter)];
  if (leaks.length > 0) {
    const names3 = leaks.map((match2) => match2[1]);
    const mine = leaks.filter((match2) => match2[1] === field);
    if (mine.length === 1 && names3.every((name17) => name17 === field)) {
      const inner = parseWholeArray((mine[0]?.[2] ?? "").trim());
      if (inner !== void 0) {
        return { ok: true, value: inner, strategy: "strip-leaked-markup" };
      }
    }
    return {
      ok: false,
      reason: `leaked-markup-unrecoverable(${[...new Set(names3)].join("|")})`
    };
  }
  if (itemsArePrimitive && !/^[[{]/.test(trimmed)) {
    if (looksMultiItem(trimmed)) {
      return { ok: false, reason: "scalar-looks-multi-item" };
    }
    if (parseWholeArray(`[${trimmed}]`) === void 0) {
      return { ok: true, value: [value], strategy: "wrap-scalar" };
    }
  }
  if (trimmed.startsWith("[")) {
    const leading = decodeLeadingJsonArray(trimmed);
    if (leading !== void 0 && /^[\s,\]}]*$/.test(leading.rest)) {
      return {
        ok: true,
        value: leading.value,
        strategy: "drop-contentless-tail"
      };
    }
  }
  return { ok: false, reason: diagnose(trimmed) };
};
function preprocessLenientArray(value, options2) {
  if (typeof value !== "string") {
    return value;
  }
  const repair = repairStringifiedArray(value, options2.field, options2.primitiveItems === true);
  return repair.ok ? repair.value : value;
}
function lenientArray(schema2, options2) {
  return external_exports.preprocess((value) => preprocessLenientArray(value, options2), schema2);
}


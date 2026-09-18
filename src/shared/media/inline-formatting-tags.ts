var INLINE_FORMATTING_TAGS = /* @__PURE__ */ new Map([
  ["u", "u"],
  ["ins", "u"],
  ["b", "strong"],
  ["strong", "strong"],
  ["i", "em"],
  ["em", "em"],
  ["s", "del"],
  ["strike", "del"],
  ["del", "del"],
  ["sub", "sub"],
  ["sup", "sup"],
  ["mark", "mark"],
  ["br", "br"]
]);
var VOID_INLINE_FORMATTING_TAGS = /* @__PURE__ */ new Set(["br"]);

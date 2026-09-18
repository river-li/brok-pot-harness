var import_gray_matter = __toESM(require_gray_matter(), 1);
var parseJavascriptFrontmatterAsPlaintext = () => {
  return {};
};
function grayMatter(content, options2) {
  return (0, import_gray_matter.default)(content, Object.assign(Object.assign({}, options2), { engines: Object.assign(Object.assign({}, options2 === null || options2 === void 0 ? void 0 : options2.engines), {
    // These must come after caller-provided engines so JS evaluation cannot
    // be re-enabled through options.
    js: parseJavascriptFrontmatterAsPlaintext,
    javascript: parseJavascriptFrontmatterAsPlaintext
  }) }));
}
function grayMatterStringify(content, data, options2) {
  return import_gray_matter.default.stringify({ content, data: {} }, data, options2);
}

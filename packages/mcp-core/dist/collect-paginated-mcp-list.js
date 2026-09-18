function collectPaginatedMcpList(args) {
  return __awaiter25(this, void 0, void 0, function* () {
    const items = [];
    const seenCursors = /* @__PURE__ */ new Set();
    let cursor;
    for (let pageCount = 1; ; pageCount++) {
      const page = yield args.fetchPage(cursor);
      const pageItems = args.itemsOf(page);
      items.push(...pageItems);
      const nextCursor = args.nextCursorOf(page);
      if (!nextCursor || seenCursors.has(nextCursor)) {
        return items;
      }
      if (pageCount >= MAX_MCP_LIST_PAGES) {
        throw new Error(`MCP list did not end after ${MAX_MCP_LIST_PAGES} pages; refusing to keep paging`);
      }
      seenCursors.add(nextCursor);
      cursor = nextCursor;
    }
  });
}
var __awaiter25, MAX_MCP_LIST_PAGES;
var init_collect_paginated_mcp_list = __esm({
  "../packages/mcp-core/dist/collect-paginated-mcp-list.js"() {
    "use strict";
    __awaiter25 = function(thisArg, _arguments, P2, generator) {
      function adopt(value) {
        return value instanceof P2 ? value : new P2(function(resolve14) {
          resolve14(value);
        });
      }
      return new (P2 || (P2 = Promise))(function(resolve14, reject2) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject2(e);
          }
        }
        function rejected3(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject2(e);
          }
        }
        function step(result) {
          result.done ? resolve14(result.value) : adopt(result.value).then(fulfilled, rejected3);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    MAX_MCP_LIST_PAGES = 1e3;
  }
});

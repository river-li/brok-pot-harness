var MESSAGES_PAGE_LIMITS = {
  items: { default: 50, max: 200 },
  search: { default: 25, max: 100 },
  "find-chats": { default: 50, max: 500 }
};
var MESSAGES_RESULT_CHAR_BUDGET = 64e3;
function isBelow(key, beforeMs, beforeId) {
  const keyMs = Date.parse(key.date);
  if (keyMs !== beforeMs)
    return keyMs < beforeMs;
  return key.id < beforeId;
}
function clampedLimit(requested, limits) {
  return Math.min(Math.max(1, requested !== null && requested !== void 0 ? requested : limits.default), limits.max);
}
function take(newestFirst, limit) {
  const taken = [];
  let chars = 2;
  for (const item of newestFirst) {
    if (taken.length >= limit)
      return { taken, cause: "limit" };
    const size = JSON.stringify(item).length + (taken.length > 0 ? 1 : 0);
    if (taken.length > 0 && chars + size > MESSAGES_RESULT_CHAR_BUDGET) {
      return { taken, cause: "bytes" };
    }
    taken.push(item);
    chars += size;
  }
  return { taken, cause: void 0 };
}
function pageNewest(ascending2, opts) {
  const before = opts.before;
  const beforeMs = before === void 0 ? void 0 : Date.parse(before.date);
  const eligible = before === void 0 || beforeMs === void 0 ? ascending2 : ascending2.filter((item) => isBelow(item, beforeMs, before.id));
  const { taken, cause } = take([...eligible].reverse(), clampedLimit(opts.limit, opts.limits));
  const page = taken.reverse();
  const oldest = page[0];
  return Object.assign({ page, total: ascending2.length }, cause === void 0 || oldest === void 0 ? {} : { truncated: cause, nextBefore: { date: oldest.date, id: oldest.id } });
}
function pageChats(chats, opts) {
  const newestFirst = [...chats].sort(byRecency);
  const { taken, cause } = take(newestFirst, clampedLimit(opts.limit, opts.limits));
  return Object.assign({ page: taken, total: chats.length }, cause === void 0 ? {} : { truncated: cause });
}
function byRecency(a, b2) {
  if (a.lastDate === void 0)
    return b2.lastDate === void 0 ? 0 : 1;
  if (b2.lastDate === void 0)
    return -1;
  return a.lastDate < b2.lastDate ? 1 : a.lastDate > b2.lastDate ? -1 : 0;
}

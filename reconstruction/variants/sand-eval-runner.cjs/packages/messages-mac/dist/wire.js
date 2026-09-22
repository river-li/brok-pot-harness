/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/messages-mac/dist/wire.js
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/2
init_v4();

// @recovered-fragment 2/2
var isoDateTime = iso_exports.datetime({ offset: true });
function wireBasename(name17) {
  const index = name17.lastIndexOf("/");
  return index === -1 ? name17 : name17.slice(index + 1);
}
var MESSAGES_SERVICES = ["iMessage", "SMS", "auto"];
var sendFields = {
  kind: literal("send"),
  text: string2(),
  service: _enum(MESSAGES_SERVICES).optional()
};
var pageLimit = number2().int().min(1).optional();
var pageCursor = strictObject({ date: isoDateTime, id: number2().int() }).optional();
var messagesOpSchema = union([
  strictObject({
    kind: literal("find-chats"),
    displayName: string2().optional(),
    handle: string2().optional(),
    limit: pageLimit
  }),
  strictObject({
    kind: literal("items"),
    chatGuid: string2().optional(),
    limit: pageLimit,
    before: pageCursor
  }),
  strictObject({
    kind: literal("search"),
    needle: string2(),
    limit: pageLimit,
    before: pageCursor
  }),
  strictObject({
    kind: literal("activity"),
    since: isoDateTime,
    until: isoDateTime.optional()
  }),
  strictObject(Object.assign(Object.assign({}, sendFields), { to: string2() })),
  strictObject(Object.assign(Object.assign({}, sendFields), { chatId: string2() })),
  strictObject({ kind: literal("check-permissions") }),
  strictObject({
    kind: literal("fetch-attachment"),
    messageGuid: string2(),
    attachmentGuid: string2()
  }),
  strictObject({
    kind: literal("find-contacts"),
    query: string2().trim().min(1)
  })
]);
var wireAttachment = object2({
  id: number2(),
  guid: string2(),
  filename: string2().optional().transform((name17) => name17 === void 0 ? void 0 : wireBasename(name17)),
  transferName: string2().optional(),
  mime: string2().optional(),
  uti: string2().optional(),
  totalBytes: number2().optional()
});
var wireMessage = object2({
  kind: literal("message"),
  id: number2(),
  guid: string2(),
  chatGuid: string2(),
  date: isoDateTime,
  fromMe: boolean2(),
  handle: string2().optional(),
  service: string2(),
  body: object2({
    text: string2(),
    runs: array(object2({
      text: string2(),
      mention: string2().optional(),
      part: number2().optional()
    })),
    fallback: boolean2(),
    edit: object2({ date: isoDateTime.optional() }).optional()
  }),
  replyToGuid: string2().optional(),
  threadOriginatorGuid: string2().optional(),
  tapbacks: array(object2({
    type: number2(),
    emoji: string2().optional(),
    handle: string2().optional(),
    fromMe: boolean2(),
    date: isoDateTime
  })),
  attachments: array(wireAttachment),
  edited: object2({ date: isoDateTime }).optional(),
  unsent: object2({ date: isoDateTime }).optional()
});
var wireGroupEvent = object2({
  kind: literal("event"),
  id: number2(),
  guid: string2(),
  chatGuid: string2(),
  date: isoDateTime,
  itemType: number2(),
  groupActionType: number2().optional(),
  groupTitle: string2().optional(),
  handle: string2().optional()
});
var wireChat = object2({
  id: number2(),
  guid: string2(),
  identifier: string2(),
  displayName: string2().optional(),
  service: string2(),
  handles: array(string2()),
  lastDate: isoDateTime.optional()
});
var pageEnvelopeFields = {
  total: number2().optional(),
  truncated: _enum(["limit", "bytes"]).optional()
};
var nextBeforeField = object2({ date: isoDateTime, id: number2() }).optional();
var grantState = _enum(["granted", "denied"]).catch("denied");
var peopleField = record(string2(), string2()).optional();
var messagesResultSchema = union([
  object2(Object.assign(Object.assign({ kind: literal("find-chats"), chats: array(wireChat) }, pageEnvelopeFields), { people: peopleField })),
  object2(Object.assign(Object.assign({ kind: literal("items"), items: array(union([wireMessage, wireGroupEvent])) }, pageEnvelopeFields), { nextBefore: nextBeforeField, people: peopleField })),
  object2(Object.assign(Object.assign({ kind: literal("search"), items: array(wireMessage) }, pageEnvelopeFields), { nextBefore: nextBeforeField, people: peopleField })),
  object2({
    kind: literal("activity"),
    items: array(object2({
      chatGuid: string2(),
      count: number2(),
      handles: array(string2()).optional(),
      displayName: string2().optional()
    })),
    people: peopleField
  }),
  object2({
    kind: literal("send"),
    text: string2(),
    service: string2(),
    via: string2(),
    verified: boolean2(),
    to: string2().optional(),
    chatId: string2().optional()
  }),
  object2({
    kind: literal("check-permissions"),
    version: string2(),
    verbs: array(string2()),
    fullDiskAccess: boolean2(),
    automation: _enum(["granted", "notAsked", "denied"]).catch("notAsked"),
    contacts: grantState
  }),
  object2({
    kind: literal("fetch-attachment"),
    filename: string2().transform(wireBasename),
    mime: string2(),
    bytesBase64: string2()
  }),
  object2({
    kind: literal("find-contacts"),
    region: string2().optional(),
    total: number2(),
    truncated: pageEnvelopeFields.truncated,
    contacts: array(object2({
      name: string2(),
      phones: array(string2()),
      unresolvedPhones: array(string2()).optional(),
      emails: array(string2())
    }))
  })
]);


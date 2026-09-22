/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/host/agent-isolation/conversation-blob-gc.ts
 * Bundle: sand-host/agent-isolation/agent-store-worker.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var LIVE_BLOB_TYPE_NAMES = {
  "agent.v1.ConversationPlan": "ConversationPlan",
  "agent.v1.ConversationStateStructure": "ConversationStateStructure",
  "agent.v1.ConversationStep": "ConversationStep",
  "agent.v1.ConversationSummary": "ConversationSummary",
  "agent.v1.ConversationSummaryArchive": "ConversationSummaryArchive",
  "agent.v1.ConversationTurnStructure": "ConversationTurnStructure",
  "agent.v1.FileState": "FileState",
  "agent.v1.InvocationContext": "InvocationContext",
  "agent.v1.RequestContextMcpsPart": "RequestContextMcpsPart",
  "agent.v1.RequestContextRulesPart": "RequestContextRulesPart",
  "agent.v1.RequestContextSkillsPart": "RequestContextSkillsPart",
  "agent.v1.RequestContextSubagentsPart": "RequestContextSubagentsPart",
  "agent.v1.SelectedGitPRDiffSelection": "SelectedGitPRDiffSelection",
  "agent.v1.SelectedPullRequest": "SelectedPullRequest",
  "agent.v1.ShellCommand": "ShellCommand",
  "agent.v1.ShellOutput": "ShellOutput",
  "agent.v1.SubagentPersistedState": "SubagentPersistedState",
  "agent.v1.TodoItem": "TodoItem",
  "agent.v1.UserMessage": "UserMessage",
  bytes: "bytes",
  json: "json",
  string: "string"
};
function liveBlobTypeNameOf(name) {
  return name == null ? void 0 : LIVE_BLOB_TYPE_NAMES[name];
}
var EDGES_NOT_WALKED_SO_REFERENTS_COLLECT = /* @__PURE__ */ new Set([
  "agent.v1.UserMessage.conversation_state_blob_id",
  "agent.v1.ConversationStateStructure.summary_archive",
  "agent.v1.ConversationStateStructure.summary_archives"
]);
function toHexId(bytes) {
  return Buffer.from(bytes.buffer, bytes.byteOffset, bytes.byteLength).toString("hex");
}
function fieldValue(message, field) {
  const record = message;
  if (!isUnknownRecord(record)) return void 0;
  if (!field.oneof) return record[field.localName];
  const selection = record[field.oneof.localName];
  if (!isUnknownRecord(selection) || selection.case !== field.localName) {
    return void 0;
  }
  return selection.value;
}
function* blobIdsIn(rawValue) {
  if (rawValue instanceof Uint8Array) {
    yield rawValue;
    return;
  }
  if (Array.isArray(rawValue)) {
    for (const entry of rawValue) {
      if (entry instanceof Uint8Array) yield entry;
    }
    return;
  }
  if (rawValue != null && typeof rawValue === "object") {
    for (const entry of Object.values(rawValue)) {
      if (entry instanceof Uint8Array) yield entry;
    }
  }
}
function collectReachableBlobHexIds({
  rootBytes,
  getBlobByHexId,
  onBlobReference
}) {
  const blobTypeByHexId = /* @__PURE__ */ new Map();
  let unresolvedProtoRefs = 0;
  function visitBlobReference(blobId, blobReferenceType) {
    if (blobId.length === 0) return;
    const hexId = toHexId(blobId);
    if (blobTypeByHexId.has(hexId)) return;
    blobTypeByHexId.set(hexId, blobReferenceType);
    onBlobReference?.(hexId);
    if (!isProtoBlobReferenceTypeName(blobReferenceType)) return;
    const childBytes = getBlobByHexId(hexId);
    if (childBytes == null) {
      unresolvedProtoRefs += 1;
      return;
    }
    let child;
    try {
      child = BLOB_REFERENCE_MESSAGE_TYPE_BY_NAME[blobReferenceType].fromBinary(childBytes);
    } catch {
      unresolvedProtoRefs += 1;
      return;
    }
    visitMessage(child);
  }
  function visitMessage(message) {
    const messageType = message.getType();
    const blobFieldsByLocalName = new Map(
      (getBlobReferenceMessageMetadata(messageType.typeName)?.fields ?? []).map((field) => [
        field.localFieldName,
        field
      ])
    );
    for (const field of messageType.fields.list()) {
      const rawValue = fieldValue(message, field);
      if (rawValue == null) continue;
      const blobField = blobFieldsByLocalName.get(field.localName);
      if (blobField != null) {
        if (EDGES_NOT_WALKED_SO_REFERENTS_COLLECT.has(
          `${messageType.typeName}.${blobField.protoFieldName}`
        )) {
          continue;
        }
        for (const blobId of blobIdsIn(rawValue)) {
          visitBlobReference(blobId, blobField.blobReferenceType);
        }
        continue;
      }
      if (field.kind === "message") {
        if (field.repeated) {
          if (Array.isArray(rawValue)) {
            for (const entry of rawValue) {
              if (isMessage(entry)) visitMessage(entry);
            }
          }
        } else if (isMessage(rawValue)) {
          visitMessage(rawValue);
        }
        continue;
      }
      if (field.kind === "map" && field.V.kind === "message" && typeof rawValue === "object") {
        for (const entry of Object.values(rawValue)) {
          if (isMessage(entry)) visitMessage(entry);
        }
      }
    }
  }
  visitMessage(ConversationStateStructure.fromBinary(rootBytes));
  return { blobTypeByHexId, unresolvedProtoRefs };
}


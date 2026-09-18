init_agent_pb();
init_todo_tool_pb();
function jsonReplacer2(_key, value) {
  if (value instanceof Uint8Array) {
    return {
      __type: "Uint8Array",
      hex: toHex3(value)
    };
  }
  if (typeof value === "bigint") {
    return value.toString();
  }
  return value;
}
function jsonReviver2(_key, value) {
  if (value && typeof value === "object" && // Narrow type
  value.__type === "Uint8Array" && typeof value.hex === "string") {
    const v2 = value;
    return fromHex(v2.hex);
  }
  return value;
}
var fastCoreMessageParseEnabled = false;
var UINT8ARRAY_MARKER = '"__type":"Uint8Array"';
var STRICT_HEX_RE = /^[0-9a-f]*$/;
function decodeHex(hex) {
  const clean = hex.trim().toLowerCase();
  if (clean.length % 2 !== 0)
    throw new Error("Invalid hex string length");
  if (STRICT_HEX_RE.test(clean)) {
    try {
      const out = new Uint8Array(clean.length / 2);
      Buffer.from(out.buffer, out.byteOffset, out.byteLength).write(clean, "hex");
      return out;
    } catch {
    }
  }
  return fromHex(clean);
}
function isEncodedUint8Array(value) {
  return value !== null && typeof value === "object" && value.__type === "Uint8Array" && typeof value.hex === "string";
}
function reviveUint8ArraysInPlace(node) {
  if (Array.isArray(node)) {
    for (let i = 0; i < node.length; i++) {
      node[i] = reviveUint8ArraysInPlace(node[i]);
    }
    return node;
  }
  if (node !== null && typeof node === "object") {
    const record2 = node;
    for (const key of Object.keys(record2)) {
      record2[key] = reviveUint8ArraysInPlace(record2[key]);
    }
    if (isEncodedUint8Array(node)) {
      return decodeHex(node.hex);
    }
    return node;
  }
  return node;
}
function parseWithUint8Arrays(json3) {
  const parsed2 = JSON.parse(json3);
  if (json3.includes(UINT8ARRAY_MARKER)) {
    return reviveUint8ArraysInPlace(parsed2);
  }
  return parsed2;
}
function parseCoreMessageJson(json3) {
  if (fastCoreMessageParseEnabled) {
    return parseWithUint8Arrays(json3);
  }
  return JSON.parse(json3, jsonReviver2);
}
var CoreMessageSerde2 = class {
  serialize(value) {
    const json3 = JSON.stringify(value, jsonReplacer2);
    return utf8Serde.serialize(json3);
  }
  deserialize(blob) {
    const json3 = utf8Serde.deserialize(blob);
    return parseCoreMessageJson(json3);
  }
  getBlobType() {
    return { kind: "json" };
  }
};
var coreMessageSerde2 = new CoreMessageSerde2();
var RedactedCoreMessageSerde = class {
  constructor(privacyMode) {
    this.privacyMode = privacyMode;
  }
  serialize(value) {
    const plainMessage = fromRedactedCoreMessage(value, PrivacyCapability.UNSAFE_ALWAYS_ALLOWED);
    const json3 = JSON.stringify(plainMessage, jsonReplacer2);
    return utf8Serde.serialize(json3);
  }
  deserialize(blob) {
    const json3 = utf8Serde.deserialize(blob);
    const plainMessage = parseCoreMessageJson(json3);
    return toRedactedCoreMessage(plainMessage, this.privacyMode);
  }
  getBlobType() {
    return { kind: "json" };
  }
};
function createRedactedCoreMessageSerde(privacyMode) {
  return new RedactedCoreMessageSerde(privacyMode);
}
var RedactedProtoSerde = class {
  constructor(protoType, toRedacted, fromRedacted, privacyMode) {
    this.protoType = protoType;
    this.toRedacted = toRedacted;
    this.fromRedacted = fromRedacted;
    this.privacyMode = privacyMode;
  }
  serialize(value) {
    const plainProto = this.fromRedacted(value, PrivacyCapability.UNSAFE_ALWAYS_ALLOWED);
    return plainProto.toBinary();
  }
  deserialize(blob) {
    const plainProto = this.protoType.fromBinary(blob);
    return this.toRedacted(plainProto, this.privacyMode);
  }
  getBlobType() {
    return { kind: "proto", typeName: this.protoType.typeName };
  }
};
function createRedactedProtoSerde(protoType, toRedacted, fromRedacted, privacyMode) {
  return new RedactedProtoSerde(protoType, toRedacted, fromRedacted, privacyMode);
}
var conversationTurnSerde = new ProtoSerde(ConversationTurn);
var todoItemSerde2 = new ProtoSerde(TodoItem);
var agentConversationTurnStructureSerde = new ProtoSerde(AgentConversationTurnStructure);
var userMessageSerde2 = new ProtoSerde(UserMessage);
var conversationStepSerde2 = new ProtoSerde(ConversationStep);
var conversationStateStructureSerde = new ProtoSerde(ConversationStateStructure);
var conversationTurnStructureSerde2 = new ProtoSerde(ConversationTurnStructure);
var conversationSummarySerde2 = new ProtoSerde(ConversationSummary);
var conversationSummaryArchiveSerde = new ProtoSerde(ConversationSummaryArchive);
var conversationPlanSerde = new ProtoSerde(ConversationPlan);
var shellCommandSerde2 = new ProtoSerde(ShellCommand);
var shellOutputSerde2 = new ProtoSerde(ShellOutput);
var fileStateSerde = new ProtoSerde(FileState);

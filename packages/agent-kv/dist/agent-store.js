/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/agent-kv/dist/agent-store.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/2
init_agent_pb();
init_todo_tool_pb();
init_dist3();
init_zod();

// @recovered-fragment 2/2
var __awaiter45 = function(thisArg, _arguments, P2, generator) {
  function adopt(value) {
    return value instanceof P2 ? value : new P2(function(resolve29) {
      resolve29(value);
    });
  }
  return new (P2 || (P2 = Promise))(function(resolve29, reject2) {
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
      result.done ? resolve29(result.value) : adopt(result.value).then(fulfilled, rejected3);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
var AgentModes = ["default", "plan", "debug", "search"];
var ApprovalModeSettings = ["allowlist", "unrestricted", "auto-review"];
var BLOB_ENCRYPTION_KEY_LENGTH_BYTES = 32;
var BLOB_ENCRYPTION_KEY_HEX_PATTERN = /^[0-9a-f]+$/;
function generateBlobEncryptionKeyHex() {
  const bytes = new Uint8Array(BLOB_ENCRYPTION_KEY_LENGTH_BYTES);
  crypto.getRandomValues(bytes);
  return toHex3(bytes);
}
function isValidBlobEncryptionKeyHex(value) {
  return typeof value === "string" && value.length === BLOB_ENCRYPTION_KEY_LENGTH_BYTES * 2 && BLOB_ENCRYPTION_KEY_HEX_PATTERN.test(value);
}
var _agentMetadataSchema = null;
function getAgentMetadataSchema() {
  if (_agentMetadataSchema === null) {
    _agentMetadataSchema = external_exports.object({
      agentId: external_exports.string(),
      latestRootBlobId: external_exports.custom((val) => val instanceof Uint8Array, {
        message: "Expected Uint8Array"
      }),
      name: external_exports.string(),
      createdAt: external_exports.number(),
      mode: external_exports.enum(AgentModes),
      isRunEverything: external_exports.boolean(),
      approvalMode: external_exports.enum(ApprovalModeSettings).optional(),
      lastUsedModel: external_exports.string().optional(),
      lastDebugServerPort: external_exports.number().int().positive().optional(),
      currentPlanUri: external_exports.string().optional(),
      subagentInfo: external_exports.union([
        external_exports.object({
          parentAgentId: external_exports.string().min(1),
          rootParentAgentId: external_exports.string().min(1),
          toolCallId: external_exports.string().min(1),
          typeName: external_exports.string().min(1)
        }),
        external_exports.undefined()
      ]),
      blobEncryptionKey: external_exports.string().optional()
    });
  }
  return _agentMetadataSchema;
}
var getDefaultAgentMetadata = (agentId) => ({
  agentId: agentId !== null && agentId !== void 0 ? agentId : crypto.randomUUID(),
  latestRootBlobId: new Uint8Array(),
  name: "New Agent",
  mode: "default",
  isRunEverything: false,
  approvalMode: void 0,
  createdAt: Date.now(),
  lastUsedModel: void 0,
  lastDebugServerPort: void 0,
  currentPlanUri: void 0,
  subagentInfo: void 0,
  blobEncryptionKey: generateBlobEncryptionKeyHex()
});
var agentModeSet = new Set(AgentModes);
function isAgentMode(value) {
  return agentModeSet.has(value);
}
var approvalModeSettingSet = new Set(ApprovalModeSettings);
function isApprovalModeSetting(value) {
  return approvalModeSettingSet.has(value);
}
function parseAgentSubagentInfo(value) {
  if (!value || typeof value !== "object") {
    return void 0;
  }
  const candidate = value;
  if (typeof candidate.parentAgentId !== "string" || candidate.parentAgentId.length === 0 || typeof candidate.rootParentAgentId !== "string" || candidate.rootParentAgentId.length === 0 || typeof candidate.toolCallId !== "string" || candidate.toolCallId.length === 0 || typeof candidate.typeName !== "string" || candidate.typeName.length === 0) {
    return void 0;
  }
  return {
    parentAgentId: candidate.parentAgentId,
    rootParentAgentId: candidate.rootParentAgentId,
    toolCallId: candidate.toolCallId,
    typeName: candidate.typeName
  };
}
var AgentMetadataSerde = class {
  serialize(value) {
    const serializedLatestRootBlobId = toHex3(value.latestRootBlobId);
    return utf8Serde.serialize(JSON.stringify(Object.assign(Object.assign({}, value), { latestRootBlobId: serializedLatestRootBlobId })));
  }
  deserialize(blob) {
    const json3 = JSON.parse(utf8Serde.deserialize(blob));
    const defaults2 = getDefaultAgentMetadata(json3.agentId);
    const latestRootBlobId = typeof json3.latestRootBlobId === "string" ? fromHex(json3.latestRootBlobId) : defaults2.latestRootBlobId;
    let isRunEverything = json3.isRunEverything === true;
    let rawMode = json3.mode;
    if (rawMode === "auto-run") {
      rawMode = "default";
      isRunEverything = true;
    }
    const mode = typeof rawMode === "string" && isAgentMode(rawMode) ? rawMode : "default";
    const rawApprovalMode = json3.approvalMode;
    const approvalMode = typeof rawApprovalMode === "string" && isApprovalModeSetting(rawApprovalMode) ? rawApprovalMode : void 0;
    const subagentInfo = parseAgentSubagentInfo(json3.subagentInfo);
    const blobEncryptionKey = isValidBlobEncryptionKeyHex(json3.blobEncryptionKey) ? json3.blobEncryptionKey : defaults2.blobEncryptionKey;
    return getAgentMetadataSchema().parse(Object.assign(Object.assign(Object.assign({}, defaults2), json3), {
      mode,
      isRunEverything,
      approvalMode,
      latestRootBlobId,
      subagentInfo,
      blobEncryptionKey
    }));
  }
  getBlobType() {
    return { kind: "json" };
  }
};
var todoItemSerde = new ProtoSerde(TodoItem);
var userMessageSerde = new ProtoSerde(UserMessage);
var conversationStepSerde = new ProtoSerde(ConversationStep);
var conversationTurnStructureSerde = new ProtoSerde(ConversationTurnStructure);
var conversationSummarySerde = new ProtoSerde(ConversationSummary);
var shellCommandSerde = new ProtoSerde(ShellCommand);
var shellOutputSerde = new ProtoSerde(ShellOutput);
function deriveConversationStateFromStructure(ctx, structure, blobStore) {
  return __awaiter45(this, void 0, void 0, function* () {
    const newState = new ConversationState();
    const turns = [];
    const turnBlobs = structure.turns;
    for (const turnBlobId of turnBlobs) {
      const turnBlob = yield blobStore.getBlob(ctx, turnBlobId);
      if (!turnBlob)
        continue;
      const turnStructure = conversationTurnStructureSerde.deserialize(turnBlob);
      let conversationTurn;
      switch (turnStructure.turn.case) {
        case "agentConversationTurn": {
          const agentTurnStructure = turnStructure.turn.value;
          const userMessageBlob = yield blobStore.getBlob(ctx, agentTurnStructure.userMessage);
          if (!userMessageBlob)
            continue;
          const userMessage2 = userMessageSerde.deserialize(userMessageBlob);
          const steps = [];
          for (const stepBlobId of agentTurnStructure.steps) {
            const stepBlob = yield blobStore.getBlob(ctx, stepBlobId);
            if (stepBlob) {
              const step = conversationStepSerde.deserialize(stepBlob);
              steps.push(step);
            }
          }
          const agentTurn = new AgentConversationTurn({ userMessage: userMessage2, steps });
          conversationTurn = new ConversationTurn({
            turn: { case: "agentConversationTurn", value: agentTurn }
          });
          break;
        }
        case "shellConversationTurn": {
          const shellTurnStructure = turnStructure.turn.value;
          const shellCommandBlob = yield blobStore.getBlob(ctx, shellTurnStructure.shellCommand);
          if (!shellCommandBlob)
            continue;
          const shellCommand = shellCommandSerde.deserialize(shellCommandBlob);
          const shellOutputBlob = yield blobStore.getBlob(ctx, shellTurnStructure.shellOutput);
          if (!shellOutputBlob)
            continue;
          const shellOutput = shellOutputSerde.deserialize(shellOutputBlob);
          const shellTurn = new ShellConversationTurn({
            shellCommand,
            shellOutput
          });
          conversationTurn = new ConversationTurn({
            turn: { case: "shellConversationTurn", value: shellTurn }
          });
          break;
        }
      }
      if (!conversationTurn)
        continue;
      turns.push(conversationTurn);
    }
    newState.turns = turns;
    const todos = [];
    for (const todoBlobId of structure.todos) {
      const todoBlob = yield blobStore.getBlob(ctx, todoBlobId);
      if (todoBlob) {
        const todo = todoItemSerde.deserialize(todoBlob);
        todos.push(todo);
      }
    }
    newState.todos = todos;
    if (structure.summary) {
      const summaryBlob = yield blobStore.getBlob(ctx, structure.summary);
      if (summaryBlob) {
        const summary = conversationSummarySerde.deserialize(summaryBlob);
        newState.summary = summary;
      }
    }
    return newState;
  });
}
var AgentStore2 = class {
  constructor(blobStore, metadataStore, options2 = {}) {
    this.blobStore = blobStore;
    this.metadataStore = metadataStore;
    this.serde = new ProtoSerde(ConversationStateStructure);
    this.conversationStateStructure = new ConversationStateStructure();
    this.fixedRootBlobId = options2.fixedRootBlobId;
  }
  subscribeToMetadata(key, callback) {
    return this.metadataStore.subscribe(key, () => {
      callback(this.metadataStore.get(key));
    });
  }
  setMetadata(key, value) {
    this.metadataStore.set(key, value);
  }
  getMetadata(key) {
    return this.metadataStore.get(key);
  }
  getId() {
    return this.getMetadata("agentId");
  }
  getBlobStore() {
    return this.blobStore;
  }
  getConversationStateStructure() {
    return this.conversationStateStructure;
  }
  /** Last agent turn's request_id, if any. */
  getLastRequestIdFromConversation(ctx) {
    return __awaiter45(this, void 0, void 0, function* () {
      const turns = this.conversationStateStructure.turns;
      if (turns.length === 0)
        return null;
      for (let i = turns.length - 1; i >= 0; i--) {
        const turnBlobId = turns[i];
        const turnBlob = yield this.blobStore.getBlob(ctx, turnBlobId);
        if (!turnBlob)
          continue;
        const turnStructure = conversationTurnStructureSerde.deserialize(turnBlob);
        if (turnStructure.turn.case === "agentConversationTurn") {
          const requestId2 = turnStructure.turn.value.requestId;
          return requestId2 !== null && requestId2 !== void 0 ? requestId2 : null;
        }
      }
      return null;
    });
  }
  getFullConversation(ctx) {
    return __awaiter45(this, void 0, void 0, function* () {
      return this.deserializeConversationStateStructure(ctx, this.conversationStateStructure);
    });
  }
  /**
   * Deserialize a ConversationStateStructure into a ConversationState.
   * This resolves all blob IDs into actual data.
   */
  deserializeConversationStateStructure(ctx, structure) {
    return __awaiter45(this, void 0, void 0, function* () {
      return deriveConversationStateFromStructure(ctx, structure, this.blobStore);
    });
  }
  /**
   * Get the full conversation state with subagent states for UI hydration.
   * This provides both the deserialized ConversationState and fully deserialized
   * subagent states, enabling complete UI reconstruction from checkpoint.
   */
  getFullConversationWithSubagents(ctx) {
    return __awaiter45(this, void 0, void 0, function* () {
      const structureSnapshot = this.conversationStateStructure;
      const conversationState = yield this.deserializeConversationStateStructure(ctx, structureSnapshot);
      const subagentStates = {};
      const persistedSubagentStates = yield resolveSubagentPersistedStates(ctx, structureSnapshot, this.blobStore);
      for (const [agentId, persistedState] of Object.entries(persistedSubagentStates)) {
        if (persistedState.conversationState) {
          const subagentConversation = yield this.deserializeConversationStateStructure(ctx, persistedState.conversationState);
          subagentStates[agentId] = {
            conversationState: subagentConversation,
            createdTimestampMs: persistedState.createdTimestampMs,
            lastUsedTimestampMs: persistedState.lastUsedTimestampMs,
            subagentType: persistedState.subagentType
          };
        }
      }
      return {
        conversationState,
        subagentStates
      };
    });
  }
  getLatestCheckpoint() {
    return this.getConversationStateStructure();
  }
  handleCheckpoint(ctx, checkpoint) {
    return __awaiter45(this, void 0, void 0, function* () {
      var _a19;
      const bytes = this.serde.serialize(checkpoint);
      const blobId = (_a19 = this.fixedRootBlobId) !== null && _a19 !== void 0 ? _a19 : yield getBlobId(bytes);
      yield this.blobStore.setBlob(ctx, blobId, bytes);
      this.setMetadata("latestRootBlobId", blobId);
      this.conversationStateStructure = checkpoint;
    });
  }
  resetFromDb(ctx) {
    return __awaiter45(this, void 0, void 0, function* () {
      yield this.tryResetFromDb(ctx);
    });
  }
  tryResetFromDb(ctx) {
    return __awaiter45(this, void 0, void 0, function* () {
      try {
        const rootBlobId = this.getMetadata("latestRootBlobId");
        if (!rootBlobId || rootBlobId.length === 0) {
          this.conversationStateStructure = new ConversationStateStructure();
          return false;
        }
        const bytes = yield this.blobStore.getBlob(ctx, rootBlobId);
        if (!bytes) {
          this.conversationStateStructure = new ConversationStateStructure();
          return false;
        }
        const structure = this.serde.deserialize(bytes);
        this.conversationStateStructure = structure;
        return true;
      } catch (_e2) {
        this.conversationStateStructure = new ConversationStateStructure();
        return false;
      }
    });
  }
  dispose() {
    return __awaiter45(this, void 0, void 0, function* () {
      if (this.blobStore instanceof Disposable) {
        yield this.blobStore.dispose();
      }
    });
  }
};


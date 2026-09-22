async function readAgentTodos(session, structure = session.agentStore.getConversationStateStructure()) {
  const ctx = createContext();
  const blobStore = session.agentStore.getBlobStore();
  const todos = [];
  for (const blobId of structure.todos) {
    const blob = await blobStore.getBlob(ctx, blobId);
    if (blob == null) continue;
    let item;
    try {
      item = TodoItem.fromBinary(blob);
    } catch (error42) {
      reportFallback("transcript_manager", error42);
      continue;
    }
    const todo = sandAgentTodoFromItem(item);
    if (todo != null) todos.push(todo);
  }
  return todos;
}
function todoRefFingerprint(structure) {
  return structure.todos.map((id) => Buffer.from(id).toString("base64")).join(".");
}
var AgentTodosRuntime = class {
  constructor(host) {
    this.host = host;
  }
  host;
  published = /* @__PURE__ */ new Map();
  publishedRefs = /* @__PURE__ */ new Map();
  publishing = /* @__PURE__ */ new Map();
  subscribe(listener) {
    this.host.roster.emitter.on("todos", listener);
    return () => {
      this.host.roster.emitter.off("todos", listener);
    };
  }
  async get(agentId) {
    try {
      const session = await this.host.sessions.resolveBackgroundSession(agentId);
      return await readAgentTodos(session);
    } catch (error42) {
      if (error42 instanceof AgentGoneError) return [];
      throw error42;
    }
  }
  publishFromSession(session) {
    const previous = this.publishing.get(session.id) ?? Promise.resolve();
    const next = previous.then(() => this.publishLatest(session)).catch((error42) => reportFallback("transcript_manager", error42));
    this.publishing.set(session.id, next);
    return next.finally(() => {
      if (this.publishing.get(session.id) === next) this.publishing.delete(session.id);
    });
  }
  async publishLatest(session) {
    const structure = session.agentStore.getConversationStateStructure();
    const refs = todoRefFingerprint(structure);
    if (this.publishedRefs.get(session.id) === refs) return;
    const todos = await readAgentTodos(session, structure);
    this.publishedRefs.set(session.id, refs);
    this.emitIfChanged(session.id, todos);
  }
  emitIfChanged(agentId, todos) {
    const fingerprint = JSON.stringify(
      todos.map((todo) => [todo.id, todo.status, todo.updatedAt, todo.content])
    );
    if (this.published.get(agentId) === fingerprint) return;
    this.published.set(agentId, fingerprint);
    const event = { agentId, todos };
    this.host.roster.emitter.emit("todos", event);
  }
};

/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/agent/dist/tools/core/todo/common.js
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/2
init_zod();

// @recovered-fragment 2/2
var todoStatusSchema = lenientEnum(external_exports.enum(["pending", "in_progress", "completed", "cancelled"]));
var todoItemSchema = external_exports.object({
  id: external_exports.string(),
  content: external_exports.string().optional(),
  status: todoStatusSchema
});
function stringToTodoStatus(status) {
  switch (status) {
    case "pending":
      return TodoStatus.PENDING;
    case "in_progress":
      return TodoStatus.IN_PROGRESS;
    case "completed":
      return TodoStatus.COMPLETED;
    case "cancelled":
      return TodoStatus.CANCELLED;
    default: {
      const _exhaustive = status;
      return TodoStatus.UNSPECIFIED;
    }
  }
}
function todoStatusToString(status) {
  switch (status) {
    case TodoStatus.PENDING:
      return "pending";
    case TodoStatus.IN_PROGRESS:
      return "in_progress";
    case TodoStatus.COMPLETED:
      return "completed";
    case TodoStatus.CANCELLED:
      return "cancelled";
    default:
      return "unspecified";
  }
}
var MAX_FINISHED_TODOS = 50;
function isFinishedTodo(todo) {
  return todo.status === TodoStatus.COMPLETED || todo.status === TodoStatus.CANCELLED;
}
function pruneFinishedTodos(todos) {
  const finishedWithIndex = todos.map((todo, index) => ({ todo, index })).filter(({ todo }) => isFinishedTodo(todo));
  if (finishedWithIndex.length <= MAX_FINISHED_TODOS) {
    return todos;
  }
  const byRecency2 = [...finishedWithIndex].sort((a, b2) => {
    const aUpdated = a.todo.updatedAt || a.todo.createdAt || BigInt(0);
    const bUpdated = b2.todo.updatedAt || b2.todo.createdAt || BigInt(0);
    if (aUpdated !== bUpdated) {
      return aUpdated > bUpdated ? -1 : 1;
    }
    return b2.index - a.index;
  });
  const prunedIndices = new Set(byRecency2.slice(MAX_FINISHED_TODOS).map(({ index }) => index));
  return todos.filter((_2, index) => !prunedIndices.has(index));
}
function formatTodosForSummarization(todoItems) {
  if (todoItems.length === 0)
    return void 0;
  const unwrapped = todoItems.map((todo) => fromRedactedTodoItem(todo, PrivacyCapability.UNSAFE_ALWAYS_ALLOWED));
  return pruneFinishedTodos(unwrapped).map((todo) => {
    const statusStr = todoStatusToString(todo.status).toUpperCase();
    return `- **${statusStr}**: ${todo.content} (id: ${todo.id})`;
  }).join("\n");
}
function createTodoItem(rawTodo, existingTodo) {
  return new TodoItem({
    id: rawTodo.id,
    content: rawTodo.content || existingTodo?.content || "",
    status: stringToTodoStatus(rawTodo.status),
    createdAt: existingTodo?.createdAt || BigInt(Date.now()),
    updatedAt: BigInt(Date.now())
  });
}
function createUpdateTodosToolCall(updateTodosTool) {
  return new ToolCall({
    tool: {
      case: "updateTodosToolCall",
      value: updateTodosTool
    }
  });
}
function createStreamingTodoParser(ctx, interactionHandler, meta, existingTodosMap) {
  const parser = new JSONParser({ emitPartialTokens: true });
  const streamedTodos = [];
  parser.onValue = ({ value, key, stack }) => {
    if (stack.length === 2 && typeof key === "number" && value && typeof value === "object" && "id" in value && "status" in value) {
      const todoItem = todoItemSchema.parse(value);
      streamedTodos.push(todoItem);
      const partialTodos = streamedTodos.map((todo) => {
        const existing = existingTodosMap.get(todo.id);
        return createTodoItem(todo, existing);
      });
      interactionHandler.emitPartialToolCall(ctx, meta.toolCallId, createUpdateTodosToolCall(new UpdateTodosToolCall({
        args: new UpdateTodosArgs({ todos: partialTodos })
      })));
    }
  };
  return { parser, streamedTodos };
}


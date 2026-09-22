/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/shared/agents/agent-todo-item.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_proto();
function statusOf(status) {
  switch (status) {
    case TodoStatus.UNSPECIFIED:
    case TodoStatus.PENDING:
      return "pending";
    case TodoStatus.IN_PROGRESS:
      return "in_progress";
    case TodoStatus.COMPLETED:
      return "completed";
    case TodoStatus.CANCELLED:
      return "cancelled";
    default:
      return null;
  }
}
function sandAgentTodoFromItem(item) {
  const status = statusOf(item.status);
  if (status == null || item.id.length === 0 || item.content.length === 0) return null;
  return {
    id: item.id,
    content: item.content,
    status,
    updatedAt: Number(item.updatedAt)
  };
}


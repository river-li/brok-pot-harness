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

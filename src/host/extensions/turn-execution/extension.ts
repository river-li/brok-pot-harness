var turnExecutionExtension = defineHostExtension({
  id: "turn-execution",
  dependencies: [],
  start: () => new TurnExecutionRegistry()
});

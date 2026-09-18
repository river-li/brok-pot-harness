var HooksToolName = {
  // File operations
  Read: "Read",
  Write: "Write",
  Delete: "Delete",
  LS: "List",
  // Search
  Grep: "Grep",
  // Shell operations
  /** User-facing shell tool name. All shell executors (streaming, non-streaming, background) use this. */
  Shell: "Shell",
  WriteShellStdin: "WriteShellStdin",
  // Web operations
  /** The simple fetch tool (lowercase "fetch" in agent) */
  Fetch: "Fetch",
  // Diagnostics
  ReadLints: "ReadLints",
  // MCP operations
  ListMcpResources: "ListMcpResources",
  FetchMcpResource: "FetchMcpResource",
  // Computer use
  /** Maps to "computer" in the agent, but we use ComputerUse for clarity in hooks */
  ComputerUse: "ComputerUse",
  // Screen recording
  RecordScreen: "RecordScreen"
};

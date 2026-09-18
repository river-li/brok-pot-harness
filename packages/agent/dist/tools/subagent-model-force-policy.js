var SubagentModelForcePolicy = {
  None: "none",
  /** BYOK or RL harness: subagent must use `forceModelId` (parent pin). */
  ParentPin: "parent_pin",
  /** Request-based, non-max: Composer family; explore picker may choose slug. */
  RequestBasedComposer: "request_based_composer"
};

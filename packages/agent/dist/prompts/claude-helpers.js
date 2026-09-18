function isSlackV1_5ThreadBoundSession(props) {
  if (props.isSlackV1_5 !== true) {
    return false;
  }
  const sessionKind = props.namedAgentSessionKind?.trim() ?? "";
  return sessionKind === "" || sessionKind === "slack_thread";
}

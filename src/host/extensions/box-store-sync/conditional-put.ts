function classifyConditionalPutStatus(status) {
  switch (status) {
    case 412:
      return "already-stored";
    case 409:
      return "concurrent-write";
    default:
      return "other";
  }
}

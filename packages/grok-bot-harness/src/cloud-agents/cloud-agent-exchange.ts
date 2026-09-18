function cloudAgentExchangeReportText(result) {
  return result.summary === void 0 ? result.text : quoteReport(result.summary);
}

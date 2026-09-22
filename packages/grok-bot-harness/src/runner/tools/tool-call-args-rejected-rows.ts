/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/grok-bot-harness/src/runner/tools/tool-call-args-rejected-rows.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
function toolCallArgsRejectedRows(report, harness) {
  const base = {
    conversation_id: report.conversationId,
    request_id: report.requestId,
    request_source: report.requestSource,
    harness,
    tool_name: report.toolName,
    tool_call_id: report.toolCallId,
    schema_variant: report.schemaVariant,
    rejection: report.rejection,
    issue_count: String(report.issueCount)
  };
  if (report.issues.length === 0) return [{ ...base, issue_index: "0" }];
  return report.issues.map((issue2, index) => ({
    ...base,
    issue_index: String(index),
    issue_field: issue2.field,
    issue_code: issue2.code,
    missing: String(issue2.missing)
  }));
}


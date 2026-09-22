/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/host/extensions/action-audit/action-audit-backend.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_dashboard_connect();
init_dashboard_pb();
init_cursor_inference();
function createSandAuditBatchSender(deps) {
  const client = createSandCursorBackendClient(DashboardService, {
    backend: deps.backend,
    getAccessToken: deps.getAccessToken,
    getTeamId: deps.getTeamId,
    getMachineId: deps.getMachineId
  });
  return async (events) => {
    if (events.length === 0) return;
    await client.recordSandAuditEvents(
      new RecordSandAuditEventsRequest({
        events: events.map((event) => toSandAuditEventProto(event, event.eventId))
      })
    );
  };
}


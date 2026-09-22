/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/analytics-client/dist/to-event-data.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_analytics_pb();
function toEventData(props) {
  const out = {};
  if (!props)
    return out;
  for (const [k2, v2] of Object.entries(props)) {
    if (typeof v2 === "string") {
      out[k2] = new EventData({ data: { case: "stringValue", value: v2 } });
    } else if (typeof v2 === "number") {
      out[k2] = new EventData({ data: { case: "doubleValue", value: v2 } });
    } else if (typeof v2 === "boolean") {
      out[k2] = new EventData({ data: { case: "boolValue", value: v2 } });
    } else if (typeof v2 === "bigint") {
      out[k2] = new EventData({ data: { case: "intValue", value: v2 } });
    }
  }
  return out;
}


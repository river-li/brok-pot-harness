/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/shared/observability/telemetry.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var SAND_TURN_CLIENT_OUTCOMES = ["success", "cancelled", "error"];
var SAND_CLIENT_PERSISTENCE_SLICES = [
  "bot-templates.deleted-shares",
  "client-meta.account-slot",
  "composer-drafts",
  "host-settings.onboarding",
  "roster.agent-avatars",
  "roster.last-roster",
  "selection.last-agent",
  "send-journal",
  "sidebar.last-sections",
  "transcript.replicas",
  "ui-agent-refs",
  "ui-layout",
  "usage-warning.dismissal",
  "other"
];
var SAND_CLIENT_PERSISTENCE_SLICE_SET = new Set(
  SAND_CLIENT_PERSISTENCE_SLICES
);
var UNCLAIMED_CARD_ENTRY_KINDS = [...SAND_TRANSCRIPT_ENTRY_KINDS, "unknown-kind"];


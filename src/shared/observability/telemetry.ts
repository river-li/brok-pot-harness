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
  "transcript.cloud-agent-peers",
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

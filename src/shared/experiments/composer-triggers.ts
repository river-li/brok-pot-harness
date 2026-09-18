var SAND_COMPOSER_TRIGGERS = ["slash", "at"];
var SAND_COMPOSER_TRIGGER_EXPERIMENTS = {
  slash: { gate: "sand_hide_slash_commands", experiment: "sand_hide_slash_commands_ab" },
  at: { gate: "sand_hide_at_mentions", experiment: "sand_hide_at_mentions_ab" }
};

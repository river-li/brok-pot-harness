init_dist2();
init_zod();
var ModelLifecycleTypeSchema = external_exports.enum([
  "off",
  "default-on",
  "default-off",
  "hidden",
  // We no longer show the model on the model picker, and we will show a deprecation warning if the user tries to use it.
  "end-of-life",
  // The model is not available to users externally (not in the model picker, not usable from agentserver),
  // but can be used internally by backend services (e.g. as a summarization model).
  "internal"
]);
var ModelDynamicConfigSchema = external_exports.object({
  lifecycle: ModelLifecycleTypeSchema,
  // Nullable (not optional/undefined): native Statsig rejects undefined
  // getValue fallbacks ("undefined cannot be represented as a serde_json::Value").
  pickerDisplayName: external_exports.string().min(1).nullish(),
  // Optional override for the model's catalog `upgradeModelId` (the deprecation
  // successor surfaced to clients and used for the end-of-life "Switch model"
  // suggestion). When set, it takes precedence over the inline catalog value,
  // letting us retarget deprecations without a deploy. Because these per-model
  // dynamic configs are evaluated with the user's country, this can differ by
  // region via Statsig targeting rules. Validated against the catalog at read
  // time; an invalid or self-referential value falls back to the inline value.
  // Nullable for the same Statsig fallback reason as pickerDisplayName.
  upgradeModelId: external_exports.string().min(1).nullish()
});
var FLAGS = {
  agent_goal_continuation: {
    client: true,
    default: true
  },
  // Client-side cohort authority for Agent Run WebSocket selection. Default
  // OFF preserves HTTP Poll/SSE. Every production percentage rule must also
  // require the minimum qualified client version; server admission is an
  // independent brake and does not define the rollout cohort.
  nal_websocket_client: {
    client: true,
    default: false
  },
  // Dispatch queued composer prompts as a fresh run (new request id / new
  // stream) at turn end instead of handing them to the live
  // conversation-action stream. The inline handoff reuses the current request
  // id for a brand-new user prompt, colliding request-id-keyed attribution
  // (completion logs, datagen snapshots, telemetry). Default-off ships the
  // legacy inline behavior until the gate is ramped.
  agent_queued_prompt_new_request_id: {
    client: true,
    default: false
  },
  // Dark-launch kill switch for the Org Billing Admin role (ENT-3122). Gates
  // whether `setOrganizationMemberRole` will assign `BILLING_ADMIN`; default OFF
  // so the role is unassignable until we intentionally enable it. `client: true`
  // so the portal org-members role picker can gate the "Billing Admin" option
  // on it; the backend still enforces the gate on assignment.
  org_billing_admin_role: {
    client: true,
    default: false
  },
  // Controls whether team Members pages can request linked organization admins.
  // The backend independently checks the same gate before returning identities.
  team_members_show_org_admins: {
    client: true,
    default: true
  },
  // Org admins can copy selected team-owned policy onto a newly created
  // linked team (ENT-4505). Default OFF so create stays the root-team
  // commercial snapshot until the portal wizard is ready. Client-readable
  // so the create-team wizard can hide the copy step.
  org_team_settings_copy_on_create: {
    client: true,
    default: true
  },
  // Per-org rollout for hiding the in-app credit-request button (ENT-4621).
  // Same shape as org_on_demand_spend_disable: portal useGateValue plus
  // backend checkGate, targeted on organizationPublicID. Default OFF so
  // ungated orgs keep the button and do not see the admin control.
  org_credit_request_button_hide: {
    client: true,
    default: false
  },
  // Shared rollout for SAND_MOBILE_SESSION. Default OFF in every
  // environment: loginDeepControl poll mint and /oauth/token JWT fallback
  // keep SESSION, and the sand-mobile client does not force-upgrade a
  // phone SESSION. When ON: a poll recorded as redirectTarget=sand +
  // mobile=1 mints SAND_MOBILE_SESSION, and a SandMobile/* SESSION
  // bearer narrows on /oauth/token. Native PKCE GetSessionToken
  // sand-native-mobile mapping is an unused/alternate path and is not
  // gated here. Unit: userID (poll mint and /oauth/token pass authId).
  // Fail-closed on Statsig miss. client: true so sand-mobile reads the
  // same gate as the backend.
  sand_mobile_session_upgrade: {
    client: true,
    default: false
  },
  // Shared mobile rollout for Remote Control v2. The backend admits
  // MOBILE_SESSION on eight exact presence/session routes, while iOS uses the
  // same assignment for RCv2 product UI and runtime. This is independent of
  // the legacy `mobile_remote_control` composer worker picker. Missing or
  // unavailable Statsig state fails closed.
  remote_agent_host_mobile: {
    client: true,
    default: false
  },
  // Client-side rollout gate for the response-comparison post-vote comment
  // prompt: after voting in the side-by-side "Which response is better?"
  // comparison, the vote button morphs into an optional inline comment box
  // and the comparison collapses after submit/skip instead of immediately.
  // Comments report as `agent.response_comparison.comment`, privacy-gated to
  // USAGE_CODEBASE_TRAINING_ALLOWED like the other comparison events. Default
  // OFF preserves the shipped instant-collapse behavior.
  response_comparison_comment_prompt: {
    client: true,
    default: false
  },
  // Glass-only refresh for semantic and special colors.
  cursor_new_colors: {
    client: true,
    default: false
  },
  // Shows the existing-team-member invite step in Grok Bot onboarding and the
  // matching invite action on the Grok Bot settings page.
  grok_bot_team_invite_members: {
    client: true,
    default: true
  },
  // Shows the "Existing / New users" toggle and the New-users tab (regular
  // team invites stamped with onboarding=grok_bot) inside the Grok Bot
  // member-invites modal. Off (and when Statsig is unavailable) the modal is
  // the shipped existing-members-only experience. Does not change
  // grok_bot_team_invite_members, which still controls whether the modal
  // exists at all.
  grok_bot_invite_new_users: {
    client: true,
    default: true
  },
  // Shows the Setup Checklist section on the Grok Bot team settings page
  // (admin-facing UI rollout; unit: userID). UI-only: the checklist RPC
  // (UpdateTeamSandSetupChecklistItem) stays permission-gated and is not
  // behind this flag. Default OFF fails closed (section hidden).
  grok_bot_setup_checklist: {
    client: true,
    default: true
  },
  // Replaces the single-member Grok Bot VM lookup with the searchable,
  // paginated fleet-management table on the team dashboard. UI-only: the
  // individual and bulk RPCs keep their organization-admin authorization.
  // Unit: teamID. Default OFF preserves the existing individual workflow.
  grok_bot_fleet_operations: {
    client: true,
    default: true
  },
  // Gates the owner-VM termination setting, its Dashboard RPCs, and the
  // enforcement sweep. Keep OFF until the setting and enforcement changes are
  // both deployed. Unit: teamID. Default OFF fails toward retaining VMs.
  grok_bot_hibernated_owner_vm_termination: {
    client: true,
    default: false
  },
  // Holds the Grok Bot cards on the last step of dashboard onboarding
  // (`/start-download`). Create via scripts/create-statsig-gate.sh
  // show_dashboard_onboarding_download_grok_bot, then ramp on userID. Off (the
  // default) means nobody is assigned to
  // `dashboard_onboarding_download_grok_bot` or its nested
  // `_primary` experiment, and the page renders exactly as it does today.
  show_dashboard_onboarding_download_grok_bot: {
    client: true,
    default: true
  },
  // Audience gate for the Glass top-bar Grok Bot CTA, read non-exposing and
  // ANDed into eligibility ahead of the glass_grok_bot_topbar_cta experiment.
  // It exists so an audience can be excluded in Statsig — the top-100
  // enterprises today — without that population landing in the experiment at
  // all: a user who fails this gate is never eligible, so neither arm logs an
  // exposure for them and the read stays clean.
  //
  // Separate from the experiment on purpose. Experiment targeting decides who
  // is measured; this decides who is allowed to be measured, and a segment
  // edit here does not disturb assignment for everyone else.
  //
  // Unit: userID. Default OFF fails closed, and requiresAuthenticatedBootstrap
  // holds it false until the identity's own values land — a segment exclusion
  // that read a pre-auth default would show the CTA to an excluded enterprise
  // for that window.
  glass_grok_bot_topbar_cta_show: {
    client: true,
    default: false,
    requiresAuthenticatedBootstrap: true
  },
  // Portal-only rollout for the Overview "Set up Grok Bot" checklist row.
  // Off hides it on every dashboard card so we can soak in prod before a
  // public flip. The catalog still lists and may persist first-use; the
  // Overview hook is what withholds the row. Unit: userID. Default OFF.
  // Create with `scripts/create-statsig-gate.sh --client
  // dashboard_grok_bot_onboarding_checklist` before enabling anyone; a
  // missing gate reads false on the portal.
  dashboard_grok_bot_onboarding_checklist: {
    client: true,
    default: false
  },
  // Per-user rollout / kill switch for sand-mobile reading transcripts from the
  // server transcript store (ListGrokBotTranscriptEntries for the open window
  // and older pages, WatchGrokBotTranscripts for the live tail) instead of the
  // in-box gateway. Covers every agent of the account, whichever harness runs
  // it. Read on the phone (the mobile twin of sand_transcript_server_tail, so
  // a desktop ramp never flips the phone); sticky for the session once observed
  // ON, with a permanent per-session fallback to the gateway when the stream
  // cannot be opened. When OFF (the default) the phone reads transcripts from
  // the box gateway exactly as before.
  sand_mobile_transcript_server_tail: {
    client: true,
    default: true
  },
  // Shared rollout for the backend sender and mobile presentation.
  sand_mobile_notification_sounds: {
    client: true,
    default: false
  },
  // Client rollout of sand-mobile's Settings → Agent → Agent Computer console
  // (the pushed page stating disk and software facts about the one shared
  // computer, and its Update Computer action). When OFF (the default for
  // everyone) the Agent group omits the row and the `/settings/agent-computer`
  // route redirects, so a stale nav entry cannot reach the page either.
  sand_mobile_agent_computer_console: {
    client: true,
    default: true
  },
  // Client rollout of sand-mobile speaking anything but English. When OFF (the
  // default for everyone) the app stays on its source locale whatever the
  // device asks for and whatever language the reader previously picked — the
  // stored preference is ignored, not cleared, so flipping the gate back on
  // returns them to it. Settings omits the Language row and the
  // `/settings/language` route redirects, so a stale nav entry cannot reach a
  // picker that would not take effect.
  sand_mobile_i18n: {
    client: true,
    default: true
  },
  // Client rollout of where sand-mobile seats the unread signal. When ON, the
  // chat's own mark wears the unread / awaiting badge on its outline and the
  // trailing dot at the end of the roster row, the pinned tile and the hidden
  // chats row is gone. When OFF (the default for everyone) the mark stays
  // quiet and that trailing dot is the signal, exactly as it shipped. The two
  // seats are mutually exclusive on every surface, so the gate moves the
  // marker rather than adding a second one.
  sand_mobile_unread_on_avatar: {
    client: true,
    default: false
  },
  // Rollout for the unread jump pills over sand-mobile's home roster: the two
  // floating "N unread" pills that count the unread chats scrolled past each
  // edge of the list and jump to the nearest one. OFF (the default) mounts no
  // overlay and wires no viewability tick, so the roster is the plain scrolling
  // list it was before them and an unread scrolled out of view carries no hint
  // beyond its own row dot. The per-row unread marker is not gated by this.
  sand_mobile_home_unread_jump_pills: {
    client: true,
    default: false
  },
  // Rollout for sand-mobile's Failures screen: the standing list of the host's
  // unresolved error trays, plus the home-header entry that counts them and
  // opens it. OFF (the default) leaves the app exactly as it shipped — a failed
  // turn still raises its toast, because the tray mirroring underneath is not
  // gated; only the new page and the way in are. The route redirects home while
  // it is OFF, so restored nav state cannot reach a page the header is not
  // offering.
  sand_mobile_failures_screen: {
    client: true,
    default: false
  },
  // Rollout for sand-mobile's Marketplace home. OFF (the default) keeps
  // Settings → Plugins as the current plugins-only directory. ON shows the
  // flagged home. Not a revival of retired desktop marketplace gates.
  sand_mobile_unified_marketplace: {
    client: true,
    default: false
  },
  // KILL SWITCH for sand-mobile's in-product feedback (Settings → Send
  // Feedback, which POSTs `/sand/feedback` to the same handler desktop uses).
  // When ON, Settings omits the row and the `/settings/feedback` route
  // redirects, so a stale nav entry cannot reach the page either. Default OFF,
  // which is what makes the feature on for everyone without a rollout: an app
  // whose bootstrap has not landed, or predates this gate, reads OFF and keeps
  // the feature. Turning it ON takes feedback away with no app release.
  sand_mobile_feedback_kill_switch: {
    client: true,
    default: false
  },
  // KILL SWITCH for sand-mobile's App Store update indicator (inbox avatar dot
  // and Settings update row). When OFF, no live lookup runs and the UI stays
  // hidden. Default ON so the feature ships enabled; turning it OFF kills it
  // with no app release.
  sand_mobile_app_store_update_indicator: {
    client: true,
    default: true
  },
  // Kill switch for sand-mobile's Links / Media / Files tabs on a Bot profile.
  // When OFF, the tab strip and conversation multimedia lists are omitted and
  // Info is the whole page it was before them. Default ON so the tabs ship
  // enabled; turning it OFF kills them with no app release.
  sand_mobile_profile_multimedia_tabs: {
    client: true,
    default: true
  },
  // Kill switch for sand-mobile's `/` skill trigger in the composer. When OFF,
  // typing `/` does not open the skills list and a pick is not a skill run.
  // Default ON so the menu ships enabled; turning it OFF kills it with no
  // app release.
  sand_mobile_slash_skill_trigger: {
    client: true,
    default: true
  },
  sand_mobile_dictation_diagnostics: {
    client: true,
    default: true
  },
  // KILL SWITCH for sand-mobile Settings → Manage Subscription. When ON,
  // Settings omits the row and `/settings/subscription` redirects, so a stale
  // nav entry cannot reach the page either. Default OFF, so an app whose
  // bootstrap has not landed, or predates this gate, keeps the page. Turning
  // it ON takes the page away with no app release.
  sand_mobile_manage_subscription_kill_switch: {
    client: true,
    default: false
  },
  // Rollout for the drag-down refresh on the sand-mobile home roster — iOS's
  // overscroll pill and Android's RefreshControl are the same gesture behind
  // this one gate. When OFF (the default) the roster offers no pull-to-refresh
  // at all: no gesture arms and no spinner mounts. Home's refresh on return to
  // the foreground is NOT gated by this, so a reader with the gesture off still
  // resumes on a current roster.
  sand_enable_home_pull_to_refresh: {
    client: true,
    default: false
  },
  // Client rollout of sand-mobile's special Settings card (the inset group
  // above Agent that currently hosts Model). When OFF (the default
  // for everyone) the card and its fields are omitted from Settings — the
  // Model sub-page itself is not redirected by this gate. When ON, the card
  // mounts only if at least one field inside it has something to show (today:
  // Model, which also yields to `sand_model_selection`).
  sand_special_settings: {
    client: true,
    default: false
  },
  sand_messages_tools: {
    client: true,
    default: false
  },
  // UserID rollout for the connected-activity agent tool. The gate only makes
  // the tool eligible; each turn also requires at least one source connected
  // for the acting user, and its schema lists only those connected sources.
  sand_connected_activity_tool: {
    client: true,
    default: false
  },
  // Per-user rollout for keeping Grok Bot's prompting, subagents, tools, and
  // implementation details private. Default ON makes the main-agent system
  // prompt redirect questions about those internals toward what the bot can do.
  grok_bot_hide_internal_details: {
    client: true,
    default: true
  },
  // Per-user rollout of Grok Bot's active emoji reactions. OFF (default) keeps
  // the shipped ReactToMessage description ("use this VERY sparingly"); ON adds
  // the "## Reactions" system-prompt section that makes tapbacks part of the
  // bot's everyday voice and rewrites the tool description to match.
  grok_bot_active_reactions: {
    client: true,
    default: false
  },
  // Per-user Sand rollout for the native SendMessage delivery scan. Default OFF
  // makes Sand skip historical hydration and keep generic empty-response
  // recovery eligible; callers that omit the AgentConfig field still scan.
  sand_send_message_delivery_owed: {
    client: true,
    default: false
  },
  // Per-user Sand rollout for retiring automation fires whose agent throws
  // AgentGoneError at vend time (SAND-565). OFF (default) is shadow mode: the
  // fire keeps the legacy silent-retry path and only telemetry records that it
  // would have been retired (`sand.automation.fire_dropped`
  // @reason:agent_gone_would_drop); a later successful vend for the same agent
  // emits `sand.automation.agent_gone_recovered`, the false-positive signal to
  // read before ramping. ON makes the drop terminal: the fire fails with
  // @reason:agent_gone and frees its server queue slot.
  sand_automation_agent_gone_terminal: {
    client: true,
    default: false
  },
  // Run each Sand automation in a fresh subagent. The server stamps its
  // owner-scoped decision onto server fires; the Sand host reads the same gate
  // for manual runs. Default OFF; no rollout is allocated at launch.
  sand_subagent_automation: {
    client: true,
    default: true
  },
  grok_bot_dynamic_tools: {
    client: true,
    default: true
  },
  // With grok_bot_dynamic_tools on, the built-in tool set offloaded into the
  // cursor namespace follows live box, device, and gate state, and its names
  // are rendered in two places at the front of the cached prompt prefix: the
  // GetDynamicTools description and the <user_info> catalogs. This gate pins
  // both for the life of a compaction epoch: the description points at the
  // <user_info> namespace entry instead of listing names, and a drifted
  // <user_info> catalog (dynamic tools, subagent types, subagent models) is
  // announced on the new user turn instead of re-rendering the first message.
  // Read per turn by both harnesses. OFF (the default) leaves prompt bytes
  // unchanged.
  grok_bot_stable_dynamic_tool_catalog: {
    client: true,
    default: true
  },
  grok_bot_browser_use_playwright: {
    client: true,
    default: false
  },
  // Server-hosted grok bot rooms (group chats): with the gate ON for the room
  // owner, CreateGrokBotRoom mints a `kind = ROOM, harness = TEMPORAL`
  // grok_bot_agent row whose turns the server-side room workflow hosts, so a
  // room whose members are all Temporal never wakes the owner's box. Rooms are
  // hosted where they were created, forever: OFF (the default) keeps every new
  // room on the box host, and existing box rooms keep working either way.
  grok_bot_server_rooms: {
    client: true,
    default: true
  },
  // Server-owned Grok Bot routines: a Temporal turn reads and writes the
  // agent's automations as the `agentPlatformWorkflow` rows the server
  // already fires from instead of the box's `automations/` folder, so a turn
  // that changes nothing else on the box never wakes it for routines.
  // Unit: userID. Default OFF (box files stay the source of truth).
  grok_bot_server_automations: {
    client: true,
    default: true
  },
  // Hosted MCP migration switch (spec 5.3 surface leg, 6.1): the IDE moves a
  // client-held OAuth grant for a server-placed MCP server onto the backend
  // through MigrateMcpOAuthGrant and deletes the local copy. Off, the IDE
  // holds every grant it has and never calls the RPC. Client-side only; the
  // last and slowest ramp, after routing. Unit: userID. Default OFF.
  mcp_grant_migration_enabled: {
    client: true,
    default: false
  },
  // Hosted MCP routing switch: the IDE stops handing server-placed MCP rows
  // to its utility process and the agent host's routing provider answers
  // their calls through McpToolService. Off, every row dials from the client
  // as today. Routing must never be on for a user whose server-placed rows
  // still have a live client-side connection, so the workbench filter and the
  // provider read this one gate and drop those rows in the same step.
  // Client-side only, ramped after mcp_tool_service_enabled and before
  // mcp_grant_migration_enabled. Unit: userID. Default OFF.
  hosted_mcp_routing_enabled: {
    client: true,
    default: false
  },
  // Durable Grok Bot agent identity (RFC "Durably Storing Grok Bot Data",
  // Phase 1): the /sand/agents CRUD surface over the grok_bot PlanetScale DB.
  // Per-user rollout, evaluated in the backend for every endpoint (fail
  // closed) AND in the Sand host via its SandExperimentService. Default OFF.
  grok_bot_durable_identity: {
    client: true,
    default: true
  },
  // Write-through for durable Grok Bot identity: the host mints/edits/deletes
  // server rows (RPC-first create, profile-edit push, delete tombstone).
  // Strictly narrower than grok_bot_durable_identity (reads/sync-down): writes
  // only run when BOTH are ON, so reads can roll out first and writes flip on
  // separately. Client-visible (host-evaluated). Default OFF.
  grok_bot_durable_identity_writes: {
    client: true,
    default: true
  },
  // Server-backed identity reads and writes used by bot template sharing.
  // Independent from broad durable-identity reconciliation so sharing does
  // not expose every server agent to the host.
  grok_bot_shared_identity: {
    client: true,
    default: true
  },
  // Backfill sweep for durable Grok Bot identity: the host mints server rows
  // for agents that were born local (no serverId marker) and stamps them, so an
  // account's whole roster becomes durable rather than only agents created
  // after write-through shipped. Narrower again than
  // grok_bot_durable_identity_writes: the sweep runs only when all three are
  // ON, so it can be staged and stopped without disturbing ordinary
  // write-through. Client-visible (host-evaluated). Default OFF.
  grok_bot_identity_backfill: {
    client: true,
    default: true
  },
  // Routes the owner's Grok Bot agent turns to the Temporal turn workflow
  // (grokBotTurnWorkflow) instead of / alongside the on-box harness. Evaluated
  // per owner on the backend at every entry point (SendGrokBotUserMessage,
  // automation fires); OFF keeps today's on-box path exactly. The rollout
  // phase (shadow vs live) comes from grok_bot_temporal_harness_rollout.
  // Client-visible so the Sand host can route cross-host SendToAgent through
  // the server gateway when ON. Default OFF.
  grok_bot_temporal_harness: {
    client: true,
    default: false
  },
  // Master switch for server-side Grok Bot agent memory on the Temporal
  // harness. OFF: no grok_bot_memory_shard access at all, every turn keeps the
  // legacy box memory path (safe before the table's migration is deployed;
  // also the emergency stop — facts already on the server become invisible,
  // not lost). ON: turns read the shard row and, once one exists, treat it as
  // authoritative. Client-visible because the in-box Sand host evaluates it
  // too: ON, the host overlays the Temporal-written user shards onto its
  // folders and pushes its own BOX agents' shards (GrokBotService memory
  // shard RPCs). Default OFF.
  grok_bot_server_memories: {
    client: true,
    default: true
  },
  // Master switch for the Stripe Link virtual-card flow. Guards the spend
  // request create itself, so OFF means no Link money movement is possible for
  // the user no matter which client asks. The harness reads the same gate
  // before offering request_virtual_card, so the tool and the create are
  // independently gated on one flag. Client-visible because the in-box Sand
  // host evaluates it too. Default OFF.
  grok_bot_stripe_link: {
    client: true,
    default: true
  },
  // Clean default-off rollout for Sand's replacement memory pipeline. The host
  // pins the first authenticated evaluation for its lifetime: control users
  // keep legacy extraction and treatment users get background synthesis.
  sand_memory_dreaming: {
    client: true,
    default: false
  },
  // Default-off rollout for Sand's 1Password agent and host integration.
  // Connection/state custody remains available independently; credential
  // approval and denial re-check this gate before contacting the box.
  sand_1pass_integration: {
    client: true,
    default: true
  },
  // Default-off visibility for Sand 1Password's Auto fill toggle. Off hides
  // the per-account opt-out and leaves Auto fill on for new connections. On
  // shows the toggle so a user can turn Auto fill off. Evaluated in the Sand
  // renderer. Unit: userID. Default OFF.
  // NOTE: the gate does not exist in Statsig yet, so it reads false everywhere.
  // Create it before trying to enable this
  // (scripts/create-statsig-gate.sh --client grok_bot_show_autofill_toggle).
  grok_bot_show_autofill_toggle: {
    client: true,
    default: false
  },
  // Sand's append-only transcript journal. Assignment unit: userID. Control
  // keeps the production legacy mirror; treatment pins a conversation to the
  // turn-only journal. Once treatment claims a transcript, its durable mode
  // marker keeps that conversation on the journal even if this gate turns off.
  sand_new_transcript_journal: {
    client: true,
    default: true
  },
  // Grok Bot completion-path cloud-agent artifact bring-back: when a watched
  // cloud agent run finishes, sync the artifacts its final report cites onto
  // the agent's box and teach the prompt to attach them (the guidance line in
  // the base system prompt). Kill switch for the whole feature: the
  // completion-path artifact RPCs (listArtifacts / getArtifactBytes) and box
  // disk writes, the prompt / tool auto-copy guidance, and the card's cited
  // artifact list plus its on-demand copy (ensureCloudAgentArtifacts). The
  // transcript dump half of the completion stays ungated. Client-visible
  // because the in-box Sand host and the renderer evaluate it too. Default OFF.
  // NOTE: the gate does not exist in Statsig yet, so it reads false everywhere.
  // Create it before trying to enable this
  // (scripts/create-statsig-gate.sh --client sand_cloud_agent_artifacts); the
  // in-box Sand host evaluates it from the client bootstrap, which only carries
  // gates that exist in Statsig.
  sand_cloud_agent_artifacts: {
    client: true,
    default: false
  },
  // Sand host: keep one StreamBackgroundComposerUpdates connection open per
  // running host and forward each update as a `cloud-agent-update` gateway
  // event, so a Done cloud agent row flips back to Running the moment
  // a follow-up revives the run instead of never (the desktop stops polling
  // once the run is terminal), and an open bot-to-bot exchange sheet
  // re-reads the follow-up's messages on the resumed poll.
  // Kill switch for the host-side connection only; the desktop's poll
  // cadence for running agents is unchanged either way. Read
  // on every streamed message and between reconnects, so a flip either way
  // applies within a minute (the server heartbeats every 10s). Default OFF;
  // the Statsig gate exists with only the feature's devs passing.
  sand_cloud_agent_status_stream: {
    client: true,
    default: false
  },
  // Grok Bot durable cloud-agent watch: the one gate for both harnesses. Off,
  // the CloudAgent tool's launch / reply / watch wake the bot once, when the run
  // it registered against finishes, with today's copy. On, launch / reply /
  // watch of an owned agent stay armed across every later run of that agent
  // (user follow-ups, its own subscriptions), the tool gains `unwatch` and
  // `watch confirm: true` adoption, and the revival names who started the run
  // and carries the runaway notice after 20 unattended runs. The Temporal turn
  // reads it per turn (resolveGrokBotTurnGates → cloudAgentDurableWatch, and
  // again in the revival turn to decide whether a durable record keeps
  // re-arming); the in-box Sand host reads it from the client bootstrap. Unit:
  // userID (the bot's owner). Default OFF; create via
  // scripts/create-statsig-gate.sh --client grok_bot_cloud_agent_durable_watch.
  grok_bot_cloud_agent_durable_watch: {
    client: true,
    default: false
  },
  // KILL SWITCH for the MCP catalog's per-server status: when ON, GetDynamicTools
  // goes back to reading every server that lists tools as connected instead of
  // carrying the host's needsAuth/error status. Read by the Temporal turn's
  // MCP port and, in the box, by the Sand host's MCP service from the client
  // bootstrap. Default OFF (statuses carried); flip ON to revert without a
  // deploy. Create via scripts/create-statsig-gate.sh --client
  // grok_bot_mcp_catalog_status_killswitch.
  grok_bot_mcp_catalog_status_killswitch: {
    client: true,
    default: false
  },
  // Sand desktop owns SCM connect/reconnect/OAuth completion instead of the box
  // host. When ON: the desktop mints account-bound connect flows (no PKCE
  // verifier) and redeems the callback itself, the host reads SCM status in one
  // GetScmConnectionStatuses batch and reports connected_at_ms so a reconnect
  // card can tell a fresh connection from the one it complained about, and the
  // access card polls GetGithubRepoAccessStatus for the repo it asked for. The
  // backend only accepts account-bound PrepareGithubConnectFlow when this is ON
  // for the caller. Default OFF (host-owned PKCE flow, per-provider status, no
  // connected_at_ms). Create via scripts/create-statsig-gate.sh --client
  // sand_desktop_scm_connect.
  sand_desktop_scm_connect: {
    client: true,
    default: false
  },
  // How Sand's Computer tool types characters that have no key on the X keymap.
  // They go straight to `xdotool type`, which silently drops or mistypes them
  // (`Aprenderás` reached a live page as `Aprenders`, SAND-1271). When ON, a
  // keycode is bound for each one first, which delivers them exactly. Read live
  // per Computer tool call, so a rollout or a kill applies to the next action
  // with no box or runner restart. Default OFF.
  // NOTE: the gate does not exist in Statsig yet, so it reads false everywhere.
  // Create it before trying to enable this
  // (scripts/create-statsig-gate.sh sand_computer_use_unicode_typing); the
  // in-box Sand host evaluates it from the client bootstrap, which only carries
  // gates that exist in Statsig.
  sand_computer_use_unicode_typing: {
    client: true,
    default: false
  },
  // Sand: on window focus, re-read weekly usage while a usage-limit error
  // card is showing and retract the card once the reading shows headroom.
  // The reading is GetSandUsageStatus, not the admission check that denies a
  // send, so the two can disagree (a retracted card comes back on the next
  // denied send). Default OFF / fail closed: ramp ON to enable; flipping back
  // OFF is the kill switch. Create with scripts/create-statsig-gate.sh
  // --client sand_usage_limit_tray_recovery before ramping.
  sand_usage_limit_tray_recovery: {
    client: true,
    default: false
  },
  // Sand Settings → Usage on-demand explainer, and SuperGrok Plus/Heavy
  // eligibility to enable Cursor on-demand (dashboard write paths). Default
  // OFF / fail closed. Create the Statsig gate with
  // scripts/create-statsig-gate.sh sand_on_demand_settings before ramping.
  sand_on_demand_settings: {
    client: true,
    default: false
  },
  // Web on-demand for store-billed (Apple IAP / Google Play) plans, the
  // Anthropic-style flow. Unit: userID. ON allows setHardLimit /
  // setUsageBasedPremiumRequests on store-managed memberships (billed to a
  // separate Stripe card), stops masking their hard limit in membership
  // reads, preserves the limit across store entitlement writes, unhides the
  // dashboard on-demand controls for planOwner APPLE, and adds the
  // help-article on-demand button to Apple-billed Grok Bot denials (App
  // Store guideline 3.1.1) — alone for Apple Ultra, after the Apple tier
  // upgrade for Apple Pro / Pro+. OFF (the default) keeps every legacy
  // behavior: store-managed memberships are rejected, masked, and cleared,
  // and the Apple CTAs stay on their current destinations. Read on the
  // backend and the portal website (sand-mobile's tray buttons are
  // server-driven), so flip it for both surfaces together. Create with
  // scripts/create-statsig-gate.sh --client store_billed_web_on_demand
  // before ramping; a missing gate reads false everywhere.
  store_billed_web_on_demand: {
    client: true,
    default: true
  },
  // Replaces the create-your-first-bot step with Cursor's server-driven
  // onboarding bot. Default OFF; the user is the assignment unit.
  sand_onboarding_bot: {
    client: true,
    default: false
  },
  sand_notification_sounds: {
    client: true,
    default: false
  },
  sand_scheduled_computer_updates: {
    client: true,
    default: false,
    requiresAuthenticatedBootstrap: true
  },
  sand_browser_navigation_recovery: {
    client: true,
    default: true
  },
  grok_bot_network_debugger: {
    client: true,
    default: false
  },
  // Sand's request_user_form communicate tool: a typed in-chat form whose
  // submitted values the host fills into the box browser (secrets write-only).
  // Evaluated in the Sand host via its SandExperimentService (read live per
  // run so a rollout or kill applies without a runner rebuild). Default OFF.
  sand_user_form: {
    client: true,
    default: true
  },
  // The user-form vault riding request_user_form: the host's silent save of
  // non-secret submitted values into the per-user backend store and their
  // prefill back into later forms. OFF leaves request_user_form exactly as
  // sand_user_form ships it — no save ever runs, prefill is empty, and the
  // Settings "Saved form values" surface stays empty — while ON restores the
  // vault path. Evaluated in the Sand host via its SandExperimentService (read
  // live per call so a rollout or kill applies without a runner rebuild).
  // Values never reach a model either way. Default OFF.
  grok_bot_form_vault: {
    client: true,
    default: false
  },
  // Server-controlled rollout of Sand's org chart (the agent-network view): the
  // Cmd-K palette's "Open Org Chart" command and the org-chart primary view that
  // draws the live agent/group graph. When OFF (the default for everyone) the
  // command is hidden and the org chart is unreachable; when ON it appears.
  // Evaluated in the Sand host via its SandExperimentService (read live so a
  // rollout takes effect without an app rebuild) and surfaced to the renderer
  // over the gateway. Default OFF.
  sand_agent_network: {
    client: true,
    default: false
  },
  // Server-controlled rollout of Sand's draft-before-send external messaging:
  // the DraftExternalMessage tool plus its system-prompt steering section. When
  // OFF (the default for everyone) the tool is never registered — the model
  // never sees it — the prompt section is absent, and connector direct sends
  // are untouched, i.e. exactly the pre-feature behavior. When ON the model
  // proposes email/Slack drafts as an editable composer card the user sends.
  // Evaluated in the Sand host via its SandExperimentService; fails closed to
  // this default while unseeded. Default OFF.
  sand_draft_external_message: {
    client: true,
    default: true
  },
  // The Sand host's pressure-triggered CPU flight recorder; read live per
  // pressure window, so this doubles as the kill switch. Knobs live in
  // sand_pressure_cpu_profiler_config.
  sand_enable_pressure_cpu_profiler: {
    client: true,
    default: true
  },
  sand_enable_accent_theming: {
    client: true,
    default: false
  },
  // Anonymized egress telemetry for the Sand in-box host: the periodic
  // one.one.one.one/cdn-cgi/trace probe that stamps the sha256 of the box's
  // egress IP (@ip_hash, never the raw IP) onto every host telemetry event for
  // blocked-IP tracking. Read live per probe tick in the host's telemetry
  // service, so this doubles as the kill switch. Default OFF.
  sand_anonymized_egress_telemetry: {
    client: true,
    default: true
  },
  // Rollout gate for Grok Bot Action Recording. First of the three checks in
  // `admitSandActionAudit` (backend/server/src/sand/sandAuditEvents.ts); the
  // Sand host, the dashboard's Action Recording switch, and the capabilities
  // write path read the same gate. Admitted events go to Kafka
  // `sand_action_audit_events` and the `grok_bot_agent_actions` telemetry
  // family, never customer_log. Gate matrix:
  // backend/server/src/customerTelemetry/RUNBOOK.md.
  sand_action_audit_logs: {
    client: true,
    default: false
  },
  // Per-user rollout of Sand's one-time retirement of the frozen legacy
  // conversation blobs in an existing agent's store.db. Conversation blobs are
  // owned by the agent's worker in its own conversation-blobs.db; store.db's
  // `blobs` table is the pre-isolation copy nothing writes any more. When ON,
  // a session open asks the agent's worker to prove that dedicated database is
  // authoritative — adoption completed, the pointer's whole current graph
  // resolves there, every shared row is byte-identical, and every legacy-only
  // row is a provably superseded checkpoint root — and only then clears the
  // table and records a per-store version marker (see
  // SandAgentSessionStore.retireLegacyStoreBlobsOnce). Evaluated in the Sand
  // host via its SandExperimentService and pinned once at host startup. There
  // is deliberately no env override: this is the only switch. While OFF the
  // retirement does nothing and records no marker, so a store retires on its
  // first open after the gate reaches it. Default OFF.
  sand_legacy_store_blob_retirement: {
    client: true,
    default: false
  },
  // Sand conversation-bundle size limits: background reachability GC over
  // conversation-blobs.db past the soft threshold, plus the turn-start hard
  // cap that compacts and refuses turns when the bundle stays over the limit.
  grok_bot_conversation_gc: {
    client: true,
    default: true
  },
  // Per-user rollout of the Sand notify bus: the in-box host holds one
  // /sand/notify SSE stream and drains relay queues on notify frames instead
  // of short-polling them every 4-15s. Evaluated in the Sand host via its
  // SandExperimentService; when OFF (the default) the host keeps the shipped
  // short-poll loops untouched, so every failure mode degrades to today's
  // behavior. Delivery correctness never depends on the stream: queues stay
  // durable and the host keeps a slow safety poll while connected.
  sand_notify_bus: {
    client: true,
    default: false
  },
  // Kill switch for the notify-connected pollers' 120s safety polls (the
  // periodic drains that cover a lost pub/sub publish while the /sand/notify
  // stream is up). KILL polarity: ON (the default) keeps the safety cadence;
  // turning it OFF makes a connected host drain only on notify frames,
  // (re)connect drain-alls, and owed acks — the zero-idle-poll end state.
  // Evaluated in the Sand host; gate-read failures degrade to ON, so every
  // failure mode keeps the safety net.
  sand_notify_safety_poll: {
    client: true,
    default: true
  },
  // User-scoped rollout for Sand's five-minute routine floor. ON makes the
  // server rewrite saved/Temporal schedules and clamp cron dispatch while the
  // Sand host rejects new sub-floor saves, migrates local automation.json
  // files, and queues the one-time in-conversation notice. OFF (including a
  // missing or failed Statsig read) preserves the current schedule behavior.
  sand_five_min_automation_floor: {
    client: true,
    default: true,
    requiresAuthenticatedBootstrap: true
  },
  // Sand renders a cloud agent through the bot-to-bot exchange UI (fold row
  // and exchange sheet with the Cursor icon and the agent's name) instead of
  // the cloud agent card. OFF keeps the card, the compact row, and the PR
  // references exactly as shipped, even for transcripts that already hold
  // exchange entries.
  sand_enable_bot2bot_cloud_agent_ui: {
    client: true,
    default: false,
    requiresAuthenticatedBootstrap: true
  },
  // Kill switch for the Sand desktop composer's `/` skill-command menu. ON
  // registers no `/` trigger on the composer editor, so typing `/` stays plain
  // text, the skills-and-actions menu never opens, and nothing in the composer
  // advertises slash commands. The `@` menu (agents, MCP servers, routines),
  // the agent's skills catalog, and model-side skill invocation are unchanged.
  // Desktop only; sand-mobile has no `/` menu. Default OFF keeps today's menu.
  // Once `sand_hide_slash_commands_ab` is started, its arm overrides this gate.
  sand_hide_slash_commands: {
    client: true,
    default: false
  },
  // Kill switch for the Sand desktop composer's `@` mention menu. ON keeps the
  // `@` trigger on the composer editor from going live, so typing `@` stays
  // plain text and the menu of agents, MCP servers, and routines never opens.
  // The `/` menu, chips already in a draft, and the mention node in the schema
  // are unchanged. Desktop only. Default OFF keeps today's menu. Once
  // `sand_hide_at_mentions_ab` is started, its arm overrides this gate.
  sand_hide_at_mentions: {
    client: true,
    default: false
  },
  // Agent titles (the role pill / "Label" field) on the Sand desktop. ON shows
  // and edits them everywhere they appear: the sidebar rows, rail, and pinned
  // tiles, the pin drag ghost, the command palette rows and its title search
  // keywords, the transcript author card, the details pane Label editors, and
  // the Team Bots detail fallback. OFF hides every one of those and offers no
  // editor, while the stored `title` still rides the roster untouched (no
  // migration, no rewrite into the name). Desktop only; sand-mobile reads its
  // own AgentTitle helper. Default OFF for the internal unship of roles.
  sand_agent_titles: {
    client: true,
    default: false
  },
  // Rollout gate for Sand's rolling stream-idle deadline. ON re-arms the turn
  // stream's deadline on every streamed event — and suspends it while a tool
  // call is in flight — so an inference stream severed AFTER its first token
  // rejects instead of leaving the step's promise pending forever (the
  // 2026-08-17 egress-reapply incident, where zombie turns pinned runningTurns
  // and blocked the forced-upgrade quiesce). OFF keeps the shipped behavior,
  // where the deadline is disarmed for good at first output. Evaluated in the
  // Sand host via its SandExperimentService, read live per stream attempt, and
  // overridden either way by SAND_STREAM_IDLE_DEADLINE_MS when that env var is
  // set. The budgets themselves live in sand_stream_deadline_config. Default
  // OFF, so every failure mode (gate absent from the console, anonymous or
  // missing bootstrap, gate-read error) degrades to the shipped behavior.
  sand_stream_idle_deadline: {
    client: true,
    default: true
  },
  // Kill switch for the GrokAgent UA token stamped onto box Chrome browsing
  // (box-chrome's --user-agent suffix and the UA-governor CDP override,
  // including the opaque `(u:<owner>)` stamp). KILL polarity: passing makes
  // the Sand host write the /tmp/sand-ua-token-disabled marker, which drops
  // the token from new Chrome launches and from every new tab's CDP override;
  // every failure mode (gate not yet created in the console, anonymous or
  // missing bootstrap, gate-read error) degrades to the shipped stamped UA.
  // Evaluated in the Sand host via its SandExperimentService and reconciled
  // live to the marker, so flipping it needs no host restart. Default OFF.
  sand_browser_ua_token_kill_switch: {
    client: true,
    default: true
  },
  // ENABLE flag for the box Chrome OS+GPU fingerprint spoof arm. Passing makes
  // the Sand host write /tmp/sand-browser-fingerprint-spoof with the windows
  // profile name. SAND_BROWSER_FINGERPRINT_SPOOF is an in-box governor knob
  // (mac/windows) and is not read from host TypeScript. Absent marker /
  // default-off keeps the honest Linux UA-CH path. Evaluated in the Sand host
  // via SandExperimentService and reconciled live, so a flip needs no host
  // restart. Default OFF.
  sand_browser_fingerprint_spoof: {
    client: true,
    default: false
  },
  // ENABLE flag for the box Chrome GPU-string hide. Passing makes the Sand
  // host write /tmp/sand-enable-spoof-gpu. box-chrome then launches with
  // --use-angle=gl instead of --enable-unsafe-swiftshader, which on the
  // GPU-less Xvfb box yields no WebGL context and drops the SwiftShader
  // UNMASKED_RENDERER string. SAND_ENABLE_SPOOF_GPU is the in-box env override.
  // Absent marker / default-off keeps SwiftShader WebGL. Evaluated live in the
  // Sand host so a flip needs no host restart. Chrome must be relaunched.
  // Default OFF.
  sand_enable_spoof_gpu: {
    client: true,
    default: false
  },
  // Rollout gate for box-store-sync's skip-inaccessible behavior (SAND-1922):
  // ON makes the snapshot walk SKIP permission-denied (EACCES/EPERM) and
  // manifest-unrepresentable entries (fifo/socket/device; symlinks under
  // manifest v1) instead of tallying metadata failures that make every
  // pre-swap flush report filesystem-metadata-incomplete and block the box
  // swap forever. Evaluated LIVE in the Sand host via its
  // SandExperimentService per decision, so flipping it needs no host restart
  // and reaches already-stuck boxes through the host-bundle hot-swap; every
  // failure mode degrades to default-off (today's failure behavior).
  sand_box_store_skip_inaccessible: {
    client: true,
    default: false
  },
  sand_working_state_warming: {
    client: true,
    default: true,
    requiresAuthenticatedBootstrap: true
  },
  // ENABLE flag / kill switch for box-facing Web Bot Auth signing
  // (POST /sand-box/web-bot-auth-signature). Same gate on both sides:
  // the in-box host reconciles it live to /tmp/sand-web-bot-auth (the
  // marker-file pattern) so the daemon is a full noop —
  // no CDP Fetch, no sign POST — when the file is absent; the sign
  // endpoint still checkGates as a second line. Default OFF.
  sand_web_bot_auth_signing: {
    client: true,
    default: true
  },
  // Additional scope for box-facing Web Bot Auth signing: XHR/Fetch requests.
  // The in-box host reconciles it live to /tmp/sand-web-bot-auth-xhr-fetch
  // (the marker-file pattern). Default OFF. The parent
  // /tmp/sand-web-bot-auth marker remains required for any CDP Fetch.
  sand_web_bot_auth_sign_xhr_fetch: {
    client: true,
    default: true
  },
  // Additional scope for box-facing Web Bot Auth signing: child-frame
  // documents and requests issued inside cross-origin iframes. The in-box
  // host reconciles it live to /tmp/sand-web-bot-auth-iframes (the
  // marker-file pattern). Default OFF. The parent /tmp/sand-web-bot-auth
  // marker remains required for any CDP Fetch.
  sand_web_bot_auth_sign_iframes: {
    client: true,
    default: false
  },
  // Per-user rollout / kill switch for the Grok Bot transcript double-write:
  // the Sand host mirroring each agent's client-facing transcript into the
  // server's grok_bot_transcript_entry row index (one row per entry via
  // CommitGrokBotTranscriptEntries; oversized bodies as CAS blobs in the
  // per-tenant box store). Evaluated live in the Sand host; when OFF (the
  // default) the host publishes nothing and the box store stays the only
  // transcript copy.
  sand_transcript_double_write: {
    client: true,
    default: true
  },
  // Per-user rollout / kill switch for the Grok Bot transcript store READ
  // path: when the Sand desktop cannot reach the in-box host for an agent's
  // transcript (box asleep, gateway down), Electron main reads the off-box
  // grok_bot_transcript_entry rows (ListGrokBotTranscriptEntries, plus CAS
  // blob bodies from the per-tenant box store) and paints them as the
  // restored transcript until the live host window installs. Evaluated in
  // Electron main; when OFF (the default) the desktop never calls the read
  // RPC and a host-unreachable open fails exactly as before.
  sand_transcript_store_read: {
    client: true,
    default: false
  },
  // Per-user rollout / kill switch for store-FIRST transcript opens in the Sand
  // desktop: on a healthy open of an agent with no installed live window, the
  // Client reads the server transcript store concurrently with the in-box
  // gateway open and paints the store tail as the restored transcript if it
  // lands first, so the server copy reaches the screen before the box replies.
  // The gateway tail still installs the live window when it arrives, and the
  // same store tail feeds the parity compare (sand.transcript.parity
  // @read_reason:store-first). Requires sand_transcript_store_read (the main
  // process returns null otherwise). Read in the renderer; when OFF (the
  // default) opens behave exactly as before (gateway first, shadow compare).
  sand_transcript_store_first: {
    client: true,
    default: false
  },
  // Per-user rollout / kill switch for the Sand desktop's server transcript
  // tail: when ON, the node-agent-coordinator streams transcript rows from the
  // Cursor backend (WatchGrokBotTranscripts) and serves openAgentTail /
  // getAgentTranscriptTail from the server transcript store instead of the
  // in-box gateway, re-stamping rows into the ordered transcript envelope the
  // renderer already consumes. Evaluated in Electron main (main.cts
  // resolveServerTranscriptTail) on every coordinator dial; sticky for the
  // coordinator's lifetime once observed ON. When OFF (the default) the desktop
  // reads transcripts from the box gateway exactly as before.
  sand_transcript_server_tail: {
    client: true,
    default: false
  },
  // Per-user rollout / kill switch for the Sand desktop's server-fed roster
  // activity for Temporal-hosted agents: when ON, the node-agent-coordinator
  // overlays isRunning / isComposingMessage / currentActivity /
  // awaitingUserResponse for `harness: "temporal"` roster rows from the
  // agent_state frames of WatchGrokBotTranscripts (the box host never runs
  // those turns, so its roster shows them idle). Box-hosted agents are
  // untouched. Requires sand_transcript_server_tail (the frames ride that
  // stream). When OFF (the default) the roster is exactly the host's.
  sand_roster_via_server: {
    client: true,
    default: false
  },
  // Per-user rollout of the Sand desktop's server fallback for box-local media
  // of `harness: "temporal"` agents: when the box gateway cannot serve an
  // attachments/ or assets/ file (GenerateImage output, screenshots) the
  // desktop reads it through ReadGrokBotAgentAttachmentChunk, which goes to
  // the owner's box over its exec-daemon. Box-hosted agents are untouched (the
  // gateway still answers first). When OFF (the default) the desktop behaves
  // exactly as before: gateway only.
  sand_attachments_via_server: {
    client: true,
    default: false
  },
  // Kill switch for the Sand desktop's better link unfurling: when ON, a link
  // the public scrape could not title is asked of the service that owns it
  // over the signed-in account (Notion pages, GitHub issues, and Slack
  // messages through the account's MCP connections, pull requests and cloud
  // agents through BackgroundComposerService), an untitled answer is remembered an hour so
  // the connector is re-asked hourly, and every link surface shows the host's
  // brand mark (Cursor included) with the Media tile's readable path label.
  // Evaluated in Electron main (link-preview-edge-deps.ts) on every read and
  // in the renderer on every mark, so flipping it OFF stops the connector
  // calls at once when a provider rate limits. When OFF (the default) link
  // unfurling is what it was before the connectors: the public scrape with
  // its day-long cache, the globe on cards and hover cards, the tile's
  // third-party marks, and the hostname/path label.
  sand_better_link_unfurling: {
    client: true,
    default: true
  },
  // Sand desktop: when ON, the box host's new-bot mint asks CreateGrokBotAgent
  // for harness TEMPORAL (server-side grok_bot_temporal_harness still decides;
  // a refusal falls back to a box create). OFF (default) = box harness.
  sand_create_temporal_agents: {
    client: true,
    default: false
  },
  // Per-user rollout / kill switch for grok_bot_agent_client_state as the
  // source of truth for a Temporal agent's hiddenFromSidebar / notifyOnUpdates
  // settings: a Temporal turn's update_state write and the desktop's
  // setAgentHiddenFromSidebar / setAgentNotifyOnUpdates for `harness:
  // "temporal"` rows go to the server row (box settings.json best-effort).
  // When OFF (the default) both write the box's settings.json as before.
  grok_bot_server_agent_settings: {
    client: true,
    default: true
  },
  // Sand desktop's CLIENT-SIDE pause kill switch. ON replaces the whole window
  // with the paused-computer cover and stops the desktop from reaching any box:
  // the coordinator refuses to resolve a gateway connection (dropping the live
  // event stream) and Electron main's connector refuses connect/recreate, so no
  // EnsureSandBox and no in-box request is made. The desktop keeps polling
  // Statsig off the cursor backend while paused, so flipping this back OFF
  // releases every client on its own. Evaluated in Electron main's
  // SandExperimentService; the renderer reads it straight off the experiments
  // snapshot (useSandClientPauseGate). Distinct from the backend's own
  // SAND_BOX_BLOCKED refusal, which shows the same cover from the server side.
  // Default OFF, and every fail-closed state (no bootstrap, gate absent,
  // exception) resolves to "not paused".
  sand_client_pause: {
    client: true,
    default: false
  },
  // Holds the desktop roster sidebar on "Waking your computer…" for up to 45s
  // when the first listAgents hits a hibernated box, instead of flipping to
  // "Can't reach your computer". Default OFF restores today's banner.
  sand_roster_waking_hold: {
    client: true,
    default: false
  },
  // Keeps Sand's computer update available while an agent is working. When
  // disabled, the computer leg waits for the box to become idle.
  sand_busy_one_click_update: {
    client: true,
    default: false
  },
  // Sand's Channels creation surface: the sidebar plus button becomes the
  // "New Bot / New Channel" menu whose New Channel row opens the create-channel
  // dialog. OFF (the default, and every fail-closed state) keeps the plain
  // "New chat" button — the pre-Channels group-chat entry through the
  // launcher's recipient picker. Existing groups/channels render either way.
  sand_channels: {
    client: true,
    default: false
  },
  // Sand desktop's "Get Grok Bot for iOS" account-menu row (opens the iOS
  // download page). When OFF (the default) the row is absent from the menu.
  sand_get_grok_bot_ios: {
    client: true,
    default: true
  },
  // Sand's account switcher entry points: the avatar menu's "Switch account"
  // drill-in and the Settings saved-accounts list. When OFF (the default) the
  // menu and Settings show the single-account shape; the per-account storage
  // below ships regardless and the switch machinery is unreachable.
  sand_enable_account_switching: {
    client: true,
    default: true
  },
  // Sand's role-selection onboarding screen between jobs and tools. OFF keeps
  // the existing walk and does not add role context to the created teammate.
  sand_onboarding_role_selection: {
    client: true,
    default: true
  },
  // Bot template sharing in Sand: the export/import managed skills and the
  // create_bot_share_json tool all key off this one gate, so a bad rollout is
  // a single kill switch. When OFF (the default) nothing is reachable — the
  // skills are not served and the tool is never registered. Default OFF.
  sand_share_bot: {
    client: true,
    default: true
  },
  // The user's main bot: SetGrokBotMainAgent (server-side admission) and the
  // Sand desktop's main-bot roster treatment, the replace-main-bot menu item
  // and picker. When OFF (the default) the RPC is refused and the desktop
  // shows every bot the same way; main_agent_id still rides
  // GetGrokBotUserRuntimeSettings so a client can read it without the gate.
  sand_grok_main_agent: {
    client: true,
    default: false
  },
  // Sand's macOS-only desktop mount: the "Mount on Desktop" sidebar row and the
  // floating bot panel it opens. Default OFF hides the row and opens no window.
  sand_desktop_mount: {
    client: true,
    default: false
  },
  // Sand marketplace "For you" judges a marketplace connector by authentication,
  // not by its install record: an added connector whose server row is still
  // needsAuth stays recommendable and its row shows a Connect button that starts
  // the connector OAuth. Default OFF keeps the install-record predicate and the
  // Added badge.
  sand_marketplace_for_you_auth_aware: {
    client: true,
    default: false
  },
  sand_header_template_share_menu: {
    client: true,
    default: true
  },
  // Grok Bot multiplayer: team-visible bots, Add to Slack, team roster, and the session UI.
  grok_bot_multiplayer: {
    client: true,
    default: false
  },
  // Team-bot Context page in Sand: the Overview card's Context value becomes
  // "N memories · N skills · N files" and opens the read-only Context page
  // (the bot's model-written two-sentence summary, the team's memories
  // verbatim, files, skills, the owner-only "show context notes to all
  // members" toggle). OFF keeps the Add-context dialog, and the backend spends
  // nothing: the post-turn hook and the RPCs return before reading the shard.
  // Name predates the Context page (it first gated memory scope promotion);
  // reused rather than minting a new Statsig object.
  // Unit: userID (the bot's owner).
  grok_bot_memory_scope_promotion: {
    client: true,
    default: false
  },
  // Group chats on top of grok_bot_multiplayer: a room with several people and up to three team-shared bots. Read on the creator at create and pinned on the creator for every later read, so a room's members lose it the moment the creator leaves the gate; the client reads it only to offer people and shared bots in the group picker. Off, rooms behave exactly as before.
  grok_bot_group_chats: {
    client: true,
    default: false
  },
  grok_bot_convert_to_team: {
    client: true,
    default: false
  },
  // Agent email inboxes, read on the caller: the user's email account and the inboxes under it. Off, every inbox RPC refuses and no address is claimed.
  grok_bot_agent_mail: {
    client: true,
    default: false
  },
  // More than one agent email address, on top of grok_bot_agent_mail and read on the inbox owner rather than the caller, because the bot's claim_email_inbox shares the settings UI's code path. On, the cap on live addresses per user rises from one to GROK_BOT_EMAIL_INBOX_MAX_PER_GATED_USER, the desktop Email row lists every address the user holds with a way to add another, and the agent's email prose teaches it to pick which address to send from. Off, the cap is one and the copy is unchanged. Losing the gate never removes an address: what a user already holds still lists, sends and deletes, and only a new claim past the cap is refused.
  grok_bot_agent_mail_multiple_inboxes: {
    client: true,
    default: false
  },
  grok_bot_scm_connect_card: {
    client: true,
    default: false
  },
  // Offers the CheckSubscriptionUsage tool (plan label, % of this cycle's
  // included usage, next reset) to Grok Bot parent agents on both harnesses.
  grok_bot_check_subscription_usage: {
    client: true,
    default: false
  },
  // Templated-bot onboarding generalization, shared across the export flow
  // (export-bot-template's getting-started authoring step, gettingStarted in
  // create_bot_share_json's description), the create-time kickstart, and the
  // import flow. Default OFF.
  grok_bot_template_onboarding: {
    client: true,
    default: false
  },
  // Shows the Links tab (links mentioned in the chat) in the Sand info pane.
  // Default OFF.
  grok_bot_links_list: {
    client: true,
    default: false
  },
  // Shows the Routines | Files | Links tabs under the Computer preview in the
  // Sand info pane. OFF keeps today's pane (Routines alone, Links only via
  // grok_bot_links_list). Default OFF.
  sand_agent_sidebar_files_links: {
    client: true,
    default: false
  },
  // Condenses the Sand details pane into one column: a click-to-edit profile
  // over Media | Computer (Members for a group) | Routines tabs. OFF keeps the
  // stacked computer preview, Routines list, and Settings-only profile edit.
  // Default OFF.
  sand_simplified_right_pane: {
    client: true,
    default: false
  },
  // Renames the Sand details pane's Routines tab to Tasks and leads it with the
  // agent's open todo list ("In progress") above a Routines section. OFF keeps
  // the Routines tab with only the routines list. Default OFF.
  sand_in_progress_tasks: {
    client: true,
    default: false
  },
  // Replaces the Sand details pane's model-authored todo list with one row per
  // user ask: each prompt the user sends is summarized into a one-line task
  // title by the NameTab task-summary prompt, and the row's status (queued,
  // in progress, needs input, done, failed, interrupted) follows the agent's
  // live roster state and the transcript. Implies the Tasks pane label. OFF
  // keeps the todo card (or the Routines-only pane when
  // sand_in_progress_tasks is also OFF). Default OFF.
  sand_turn_task_list: {
    client: true,
    default: false
  },
  // Sand right-hand Tasks pane: ON (with sand_in_progress_tasks) adds a
  // "Cloud agents" card under the bot's to-dos, grouped Running / Watching /
  // Done / Failed from the cloud agent status stream plus the subscription and
  // durable-watch reads. Default OFF.
  sand_cloud_agent_tasks_card: {
    client: true,
    default: false
  },
  // The whole one-time "Import cookies from Chrome" flow (internal/dogfood
  // only): the Settings card, the desktop.chromeCookies preload capability, the
  // main-edge list/import handlers, and the host cookie injector all key off
  // this one gate, so a bad rollout is a single kill switch. When OFF (the
  // default for everyone, and what a Statsig-unknown gate resolves to) there is
  // no reachable path — the card is hidden, the capability is omitted, and both
  // the main and host handlers refuse before any keychain, SQLite, CDP, or seed
  // I/O. Default OFF.
  sand_import_chrome_cookies: {
    client: true,
    default: false
  },
  // Agent-prompted cookie sync in the Sand desktop: the persisted
  // always-allow {profile, origin} grants and the main-edge list/put/remove
  // handlers that read and write them key off this one gate, so a bad rollout
  // is a single kill switch. When OFF (the default for everyone, and what a
  // Statsig-unknown gate resolves to) list is empty, put and remove refuse,
  // and nothing touches the grant file. Separate from
  // sand_import_chrome_cookies so the one-time import flow keeps its own kill
  // switch. Default OFF.
  agent_prompted_cookie_sync: {
    client: true,
    default: false
  },
  // Voice call in the Sand desktop: the chat-header capsule, the in-call
  // banner, the post-call transcript bubble, the xAI realtime client-secret
  // mint (MintSandVoiceCallSecret), and the middleman's inner-loop nudge all
  // key off this one gate, so a bad rollout is a single kill switch.
  // Default OFF.
  sand_voice_call: {
    client: true,
    default: false
  },
  // Grok Bot telephony: the agent placing an outbound call to an external
  // number. Requires sand_voice_call as well, which nothing here expresses.
  // Default OFF.
  sand_voice_outbound_call: {
    client: true,
    default: false
  },
  // Seeds the main agent's overheard work — its thinking, its tool calls, its
  // subagent calls — into the live voice session as read-only history items, so
  // the voice side knows where the work stands between nudges. It does not
  // touch whether the agent thinks. Off leaves the wire byte-identical to
  // today. Default OFF.
  sand_voice_call_overheard: {
    client: true,
    default: false
  },
  // system prompt. Off leaves the prompt byte-identical. Default OFF.
  // Registers `stay_silent` on the voice session and teaches it in the voice
  // prompt. Off hides the tool and every prompt line that names it. Default OFF.
  sand_voice_stay_silent: {
    client: true,
    default: false
  },
  // Delivers a spoken voice-call update (progress, outcome) as one xAI
  // realtime `async_update.add` under the `work_landed` topic; the orchestrator
  // inserts it and opens the turn. OFF keeps the seeded `work_landed`
  // function_call + function_call_output pair and the client's own
  // `response.create`, which is the shipped behavior and what a Statsig-unknown
  // gate resolves to. Needs async updates enabled on the xAI session; without
  // that the server refuses the frame. Default OFF.
  sand_voice_async_update: {
    client: true,
    default: true
  },
  // Start-or-steer for voice requests: while a turn is running, a relayed
  // request is drained into the live turn at its next step boundary instead
  // of waiting behind it as a queued hidden turn. OFF keeps the queue, which
  // is the shipped behavior and what a Statsig-unknown gate resolves to.
  sand_voice_steer: {
    client: true,
    default: true
  },
  // The final word of a finished turn reaches the voice call: when a turn the
  // owner started ends while they are on the line and nothing was sent to the
  // call's address, the box host reads the turn's closing text (or its last
  // chat message) onto the line as an outcome. OFF keeps the shipped behavior,
  // where such a turn finishes in writing and the caller hears nothing; it is
  // also what a Statsig-unknown gate resolves to.
  sand_voice_final_word: {
    client: true,
    default: false
  },
  // Sand's asynchronous voice memos: the composer's send-while-recording arrow
  // posts a spoken clip instead of dictated text, that message and the agent's
  // replies to it render as expandable memo pellets, and playing a reply
  // synthesizes its text through SynthesizeSpeech. OFF (the default, and every
  // fail-closed state) keeps dictation exactly as shipped — the arrow sends
  // transcribed text and every message renders as a text bubble. Read per
  // render in Sand only; no prompt, tool, or transcript bytes change either way.
  sand_voice_memos: {
    client: true,
    default: true
  },
  // Moves the voice-agent harness (prompt, tool list, tool execution) off the
  // Sand desktop onto the backend: ON has the desktop fetch its `session.update`
  // body from GrokBotService.VoiceCallHarnessSession and send every tool
  // call to GrokBotService.VoiceCallHarnessTool. OFF keeps the in-app package harness, which
  // is the shipped behavior and what a Statsig-unknown gate resolves to. The
  // xAI realtime socket stays on the desktop either way. Default OFF.
  sand_voice_server_harness: {
    client: true,
    default: true
  },
  // Rollout gate for Sand's window-focus staleness catch-up. OFF (the shipped
  // default, and what a Statsig-unknown gate resolves to) keeps the old edge:
  // every window focus runs the full noteReconnect. ON runs the pull-only
  // catch-up instead. The polarity puts every fail-closed state (no bootstrap,
  // gate absent from the console, exception) on the old behavior: roll out by
  // ramping ON; flipping back OFF is the kill switch.
  sand_focus_staleness_catch_up: {
    client: true,
    default: false
  },
  // Kill switch for routed-model disclosure under Smart Router. When ON, the
  // portal hides the team/group control, dashboard reads return false, writes
  // cannot enable it, and runtime disclosure ignores stored true values.
  // Client-facing because the portal reads it directly. Intentionally not
  // created in Statsig yet; the absent/default OFF state preserves disclosure.
  disable_smart_auto_show_routed_model: {
    client: true,
    default: false
  },
  migrate_default_model_config_to_auto_smart_cost: {
    client: true,
    default: false
  },
  // Prevents product app-open model nudges from changing a composer after its
  // model picker is already visible. Team-admin model policies are exempt.
  app_open_model_nudge_pre_render_only: {
    client: true,
    default: false
  },
  // Gates the GitHub workflow-run triage and PR-review-comment autofix
  // automation templates (and their new trigger types) on the client. Off by
  // default so old clients that lack the new trigger UI never surface them;
  // enable per client app version once those builds ship. Web (portal) does not
  // gate these templates.
  new_automation_templates_slack_github_triggers: {
    client: true,
    default: true
  },
  // Gates the shared Customer Evals UI in portal and Glass. Backend transport
  // remains available; this controls the client entry points only.
  customer_evals_ui: {
    client: true,
    default: false
  },
  // Client includes capped raw git stderr in exec throws. stderr can carry PII,
  // so this Statsig gate must stay scoped to internal devs.
  git_diff_collect_stderr: {
    client: true,
    default: false
  },
  glass_chat_switch_tracing: {
    client: true,
    default: false
  },
  // KILL SWITCH for Glass browser <webview> guest render throttling: hidden
  // and idle offscreen guests get `visibility: hidden` so Chromium pauses
  // their rAF/style/layout/paint/compositing while the page stays alive.
  // OFF (default, and when the gate is absent in Statsig) keeps throttling
  // on; turn ON to restore the pre-throttle behavior where hidden guests keep
  // rendering at the display rate. Unit: userID.
  glass_webview_guest_render_throttle_killswitch: {
    client: true,
    default: false
  },
  // When on, cached-agent adopt after a chat switch is scheduled with
  // setTimeout(0) so the keydown turn can paint (sidebar highlight) before
  // remounting the transcript. Off keeps queueMicrotask (same-task flush).
  glass_chat_switch_macrotask_adopt: {
    client: true,
    default: true
  },
  // When on, a conversation switch commits its surface in the task after the
  // click frame paints. Off keeps the next-task adopt and same-task cold load.
  glass_chat_switch_post_paint_commit: {
    client: true,
    default: false
  },
  // When on, Glass chat switches reuse the window-scoped cloud catalog TTL
  // (MCP servers, HTTP MCP status, managed skills). Off force-refreshes
  // every read; concurrent callers still coalesce.
  cloud_catalog_cache: {
    client: true,
    default: false
  },
  // ON: closing a Glass agent workspace disposes its InstantiationService
  // after a 30s grace period. OFF keeps today's behavior: released containers
  // stay alive until window close. Read at close time.
  glass_dispose_workspace_on_release: {
    client: true,
    default: false
  },
  // Shows the Glass diff meter: the Git entry in the dev performance bar and the
  // diff-tab panel that record git ops sent to the git extension. Internal devs only.
  glass_git_diff_meter: {
    client: true,
    default: false
  },
  // After an agent on the empty Glass Home workspace creates a project via
  // create_project, auto-chain move_agent_to_root onto the new dir so search
  // stops walking $HOME. Off = the agent stays on Home until it re-roots itself.
  glass_auto_reroot_after_create_project: {
    client: true,
    default: false
  },
  // Strengthens move_agent_to_root guidance so agents always re-root before
  // changing files in a worktree instead of continuing from the main checkout.
  glass_agent_worktree_reroot_prompt: {
    client: true,
    default: true
  },
  // Gates the Glass cloud meta-agent surface: sidebar Agents section, Add Agent
  // entry, and the specialized Create Agent flow.
  glass_cloud_meta_agents: {
    client: true,
    default: false
  },
  // When ON, Named Agent Slack routing collapses to a single conversation:
  // every matched Slack thread is delivered into the Named Agent's existing
  // home session instead of spawning a per-thread child session. If there is no
  // live home session, the router falls through to the default
  // per-thread behavior. Glass also uses this gate to replace the session list
  // with a single-session label, and the backend enables restricted parent
  // tool/delegation mode. Default OFF.
  named_agent_single_session: {
    client: true,
    default: false
  },
  // Gates the Glass empty-state / new-agent picker redesign.
  glass_empty_state_pickers_redesign: {
    client: true,
    default: true
  },
  // Glass empty-state recommended actions. Replaces the
  // `glass_recommended_actions` experiment. Distinct name because the
  // experiment still owns that Statsig namespace.
  // Empty-state placement owns exposure (after shared placement eligibility,
  // Statsig identity readiness, and the FTUX empty-state surface unlock).
  // FTUX only peeks so it can refresh the list without logging exposure.
  // Statsig rule (manual): "Created after 7/23 12am PT and not Enterprise
  // User", all environments, AND of:
  // - custom field createdAt after 7/23/2026 12:00 AM PDT
  // - user is not in segment "Enterprise Users"
  // - custom field teamID none of (case insensitive) "1"
  // ID type userID. Target application client. Default OFF.
  glass_empty_state_recommended_actions: {
    client: true,
    default: false
  },
  // Gates branch availability labels, expanded branch sources, recents, and
  // submit-time branch materialization/publish sync in the redesigned Glass
  // branch picker.
  glass_branch_picker_redesign: {
    client: true,
    default: false
  },
  // Gates the net-new `#` pull-request reference menu in the Glass composer.
  // Requires an eligible anchored-tray composer host.
  composer_pr_hash_menu: {
    client: true,
    default: false
  },
  // Shows type/provenance labels (for example User Skill, Repo Skill, Plugin
  // Skill, Built-in Action, Mode, Chat) in unified composer tray rows for
  // debugging. When OFF the tray shows no trailing labels; only functional
  // controls (MCP toggle, drill-in chevrons) remain. Default OFF.
  unified_composer_tray_debug: {
    client: true,
    default: false
  },
  // Gates remembering / seeding the New Agent environment + workspace
  // selection: inherit the source agent's repo + run-on target, and honor the
  // configurable default-environment setting. Default OFF preserves today's
  // local-biased New Agent behavior.
  glass_remember_new_agent_environment_selection: {
    client: true,
    default: true
  },
  // Mounts the Glass file-tab editor inside a shadow root so the document's
  // `:has()` rules can't trigger per-element style invalidation on Monaco's
  // per-frame token-span churn (large-file scroll jank). Evaluated at
  // editor-attach time, so it takes effect on reload. Off by default; ramp via
  // Statsig.
  glass_editor_shadow_isolation: {
    client: true,
    default: true
  },
  // When enabled, GlassShadowStyleMirror never calls _rebuild() synchronously
  // from its MutationObserver (style add/remove); it schedules via
  // RunOnceScheduler(0) instead so a large stylesheet can't burn tens of ms on
  // the agent-switch hot path. Off by default; ramp via Statsig.
  glass_defer_shadow_style_rebuild: {
    client: true,
    default: false
  },
  // When enabled, Glass file tabs no longer open the file-tree sidebar by
  // default. Explicit user opens still expand the sidebar.
  glass_filetree_dont_show_default: {
    client: true,
    default: false
  },
  // Kill switch for the Grok Bot enterprise audit-log work: stamping
  // CustomerLog.application_type on audit event envelopes (emitCustomerLog,
  // evaluated on a fixed synthetic user so it is a single global switch) and
  // the Application filter / "(Grok Bot)" label suffix on the dashboard audit
  // log. Also the deploy-ordering guard for the envelope field: must stay OFF
  // until the Bento audit templates listing it in known_fields and the
  // Postgres/ClickHouse columns are live, otherwise the sinks derive it as
  // every event's event_type. OFF at any later point is safe: new rows just
  // get an empty application_type and the UI hides the filter.
  sand_audit_logs: {
    client: true,
    default: true
  },
  // Kill switch for the active `limit_hit_ui_2027_07` experiment (also covers
  // the retired `limit_hit_ui_2026_06` registration). When ON, the new
  // limit-hit tray/modal treatment is force-disabled (clients render today's
  // control UI) without ending the experiment. Default OFF so the experiment
  // controls assignment.
  limit_hit_ui_kill_switch: {
    client: true,
    default: false
  },
  // Kill switch for the "Rate limited, retrying…" composer shimmer copy
  // (INF-9446). When ON, clients fall back to the generic "Reconnecting…"
  // string for rate-limited reconnects. Default OFF so the specific copy
  // shows; flip ON if the message misleads users during an incident.
  rate_limited_reconnect_message_kill_switch: {
    client: true,
    default: false
  },
  // When ON, prompt-input mention chips drop their hover X (remove) button in
  // Glass. Default OFF so chips keep today's removable chrome.
  glass_no_x_on_chips: {
    client: true,
    default: false
  },
  // Rich hover cards on `linear.app/<workspace>/issue/<TEAM-n>` links in chat,
  // served by `DashboardService.BatchGetLinearIssueSummaries` under the team's
  // Linear connection. Checked by the Glass/IDE client before attaching the
  // hover and by the RPC before spending the org's Linear request budget.
  // Default OFF.
  glass_preview_linear_tickets: {
    client: true,
    default: false
  },
  // Gates all Portal Codebase surfaces, including app installation and
  // management.
  origin_repos: {
    client: true,
    default: false
  },
  // Shared server/portal rollout gate; default OFF keeps the surfaces dark.
  origin_app_install_requests: {
    client: true,
    default: false
  },
  // Shared server/portal rollout gate; default OFF keeps the surfaces dark.
  origin_app_user_confirmation: {
    client: true,
    default: false
  },
  origin_app_deletion: {
    client: true,
    default: false
  },
  codebase_branches_redesign_in_progress: {
    client: true,
    default: false
  },
  // Lets the managed `automations` service account request reviewers on Origin
  // changes. When on, the Origin reviewer-candidate list + RequestReview
  // validation switch from caller-scoped to team-scoped for managed Cursor
  // service accounts (which have no org membership of their own), so an
  // automation can request any reviewer candidate of the repo-owner team.
  // Client exposure keeps the Automations editor aligned with this rollout.
  automations_origin_request_reviewers: {
    client: true,
    default: false
  },
  // API & SSH Keys IP allow list for Origin git over SSH and HTTPS.
  // Portal only. Default off. Target one user (User ID or cursorUserID).
  // Do not enable globally. Email rules do not match the portal.
  origin_inbound_ip_allowlist: {
    client: true,
    default: false
  },
  // Enables GitHub-style raw file links for Origin code browsing. The backend
  // Mint + client "View raw" button. Redemption uses the gate below.
  origin_raw_file_links: {
    client: true,
    default: true
  },
  origin_merge_queue_ui: {
    client: true,
    default: false
  },
  origin_inbox_osp_watch: {
    client: true,
    default: false
  },
  // Sand Auto-review enforce rollout (Shell/MCP/Computer).
  // Settings-on default is shadow for every reviewed surface. When this gate
  // is ON, those surfaces escalate to enforce. When OFF (default), they stay
  // in shadow. The Settings toggle remains the user kill switch (off ⇒ no
  // classifier). This gate is the only Statsig lever for enforce.
  // Local bring-up can still force a mode via SAND_AUTO_REVIEW_MODE.
  sand_auto_review: {
    client: true,
    default: true
  },
  // Team-admin lock that forces Sand Auto-review on for every member's Bots
  // (the "Enforce Auto-review for Bots" row on /dashboard/bot). Read in two
  // places: the portal hides the row when OFF, and the in-box host stops
  // honoring `sandAutoReviewControls.enforceEnabled` when OFF, so one flip is
  // both the rollout and the kill switch. Enterprise-only via targeting; the
  // bulk admin-settings write is entitlement-checked regardless. Default OFF.
  sand_auto_review_admin_enforce: {
    client: true,
    default: true
  },
  // Team-admin Auto-review rules for Bots (`sandAutoReviewControls.allow_instructions`
  // / `block_instructions`). Read in three places: the portal shows the team
  // rules editor, the classifier sources team rules from these Bot-owned fields
  // instead of the IDE-shared `autoReview`, and the desktop shows a member the
  // team's rules read-only. OFF (the default) is today's behavior everywhere:
  // the fields are stored and served but nothing acts on them. Separate from
  // `sand_auto_review_admin_enforce` so the lock and the rules roll out
  // independently. Enterprise-only via targeting; the bulk admin-settings
  // write is entitlement-checked regardless.
  sand_auto_review_admin_rules: {
    client: true,
    default: true
  },
  // Kill switch for the Sand "Allow local egress" team policy layer only
  // (portal row, write RPC, desktop enforcement); not the tunnel itself.
  sand_local_egress_admin_control: {
    client: true,
    default: true
  },
  // Master switch for Sand spotlighting: wrapping every tool result in the
  // <cursor_untrusted_data_1337> fence and teaching the agent, in its system
  // prompt, that fenced content is outside DATA that must not drive unrequested
  // actions. When OFF (the default for everyone) tool results reach the model
  // exactly as before and the prompt section is omitted. Evaluated in the Sand
  // host via its SandExperimentService and re-read per turn, so a rollout or
  // kill applies without a runner rebuild.
  //
  // The two halves MUST flip together, which is why one gate covers both: a
  // prompt that promises fences over unfenced results turns "no marker" into a
  // false trust signal, and fences with no prompt are unexplained noise.
  sand_spotlight: {
    client: true,
    default: true
  },
  smart_mode_classifier_shadow_mode: {
    client: true,
    default: false
  },
  ext_host_document_memory_estimates: {
    client: true,
    default: false
  },
  // Logs a structured `ext_host_cursor` warning (default off) when an extension
  // on the agent-exec isolated extension host touches a text-document API. Used
  // to verify agent-exec never needs document sync before we stop syncing
  // documents to it. Scoped to agent-exec only: retrieval and always-local
  // legitimately use these APIs, so tracking them would be pure noise.
  agent_exec_text_document_api_access_tracking: {
    client: true,
    default: false
  },
  // Default-off kill switch for the future cursor-agent-host topology. When ON,
  // the window-pinned workbench decision swaps the agent-exec fanout /
  // allowlist / dependency-backfill path over to cursor-agent-host so only one
  // of the pair is active in that window, regardless of workspace family.
  cursor_agent_host: {
    client: true,
    default: false
  },
  // Sub-feature under cursor_agent_host: when ON, move exec instantiation into
  // agent-host (host constructs once and injects into shared exec activate /
  // createAgentHost). When OFF (default), host-ON still uses the topology, but
  // exec keeps minting its local fallback when no gitExecutor is injected.
  // Reused for future exec migrations — not git-specific.
  cursor_agent_host_move_exec: {
    client: true,
    default: false
  },
  // Sub-feature under cursor_agent_host: admits new per-session SQLite stores.
  // Existing committed host stores remain sticky regardless of later gate
  // changes. The setting and environment variable are local development
  // overrides.
  cursor_agent_host_owned_session_storage: {
    client: true,
    default: false
  },
  // Sub-feature under cursor_agent_host: admits migrating a settled
  // renderer-owned chat to a host-owned store when it opens (CLIENT-540).
  // Requires cursor_agent_host_owned_session_storage. The
  // CURSOR_AGENT_HOST_MIGRATE_ON_OPEN environment variable is the local
  // development override.
  cursor_agent_host_session_storage_migrate_on_open: {
    client: true,
    default: false
  },
  // Enables native cloud subagent behavior in Agent Host. Initially routes
  // eligible new background cloud Tasks to the agent-host creator.
  cursor_agent_host_native_cloud_subagent: {
    client: true,
    default: false
  },
  // CLIENT-450: one gate for the host-run Task subagent interaction policy.
  // ON = children get the strongest policy the build supports:
  // BUBBLE_TO_PARENT (web search/fetch forward to the parent session's
  // interaction channel) in builds with only the bubbling change, and
  // SURFACE_TO_USER (questions additionally surface on the child session's
  // own channel) once that change is present. Builds with the host-executed
  // switch-mode change additionally approve child mode switches host-side
  // under either enabled policy. OFF keeps AUTO_REJECT for everything
  // (prior behavior). Read once at extension activation.
  cursor_agent_host_subagent_interactions: {
    client: true,
    default: false
  },
  // Runs eligible Agent Host turns through the in-process agent loop.
  // Unsupported turns continue through backend NAL.
  agent_host_local_loop: {
    client: true,
    default: false
  },
  // Zero-config local Ollama in Glass: models a local `ollama serve` lists
  // appear in the picker and run against 127.0.0.1:11434. Read live by the
  // renderer and per turn by the Agent Host router; OFF ⇒ nothing contacts
  // it. Internal-only: roll out to the Anysphere employee segment, no %.
  glass_local_ollama: {
    client: true,
    default: false
  },
  // Client-evaluated spawn bit for the Agent Host self-updater. The daemon
  // has no Statsig SDK; the extension passes `--updater` only when this gate
  // is on. Default-off so a dark Cursor build has zero updater argv.
  agent_host_updater: {
    client: true,
    default: false
  },
  // Server-side overlay behind `PrivateInferenceSettings.can_enable` on team
  // admin settings: the Anytool-registered team opt-in for the private
  // inference loop only takes effect for teams in this gate. The client never
  // reads this gate to decide activation; it reads the team setting
  // (`enabled && can_enable`) and its device's private-inference config.
  // `client: true` only keeps the flag in the generated client defaults.
  // Default-off ships dark; roll out with explicit team rules only.
  agent_host_private_inference: {
    client: true,
    default: false
  },
  // Perf Loop (E3): default-off kill switch that defers activation of
  // anysphere.cursor-agent-exec from the eager "*" activation event to
  // "onStartupFinished". cursor-agent-exec dominates the eager-activation
  // window on Glass root cold boots (~800ms code-load + ~9ms activate call),
  // so moving it out of the startup-critical eager window reclaims that time.
  // OFF (default) = unchanged eager "*" behavior. ON = the client rewrites the
  // extension's activation event so it loads just after eager activation
  // settles instead of blocking it. Absent gate reads false (safe default), so
  // this can ship dark and be flipped remotely without a redeploy.
  // The client ignores this gate entirely on a window with a remote authority
  // (Remote SSH / WSL / dev container / Glass agent workspaces): there the
  // extension runs in the remote extension host, so deferral buys no local
  // startup time, and Remote SSH is where agent-exec-never-activates reports
  // cluster (IDE-2473), so the rewrite stays out of that investigation.
  defer_cursor_agent_exec_activation: {
    client: true,
    default: false
  },
  shell_exec_output_backpressure: {
    client: true,
    default: true
  },
  file_watcher_metrics: {
    client: true,
    default: false
  },
  glass_shared_application_storage: {
    client: true,
    default: true
  },
  // Single-pass stringify for reactive-storage saves (IDE-2278). Default off.
  reactivestorage_single_pass_stringify: {
    client: true,
    default: true
  },
  /**
   * One-shot per-session persisted-storage size breakdown report (Sentry,
   * client_error_type=reactive_storage_size_report). Phase-0 measurement for
   * splitting the monolithic reactive-storage blobs into substorages — the
   * cross-window sync pipeline's cost scales with blob size and is the top
   * RendererBlocked freeze cluster on the 3.18 line. Default off; ramp via
   * Statsig (internal first).
   */
  reactive_storage_size_report_enabled: {
    client: true,
    default: false
  },
  /**
   * Persist the model catalog (availableDefaultModels2) under its own
   * storage key instead of inside the cross-window-synced reactive blob.
   * The catalog is ~95% of the typical blob and its most frequent writer
   * (5-min refresh), so evicting it removes most cross-window blob syncs.
   * Default off; ramp via Statsig (internal first).
   */
  model_catalog_own_key: {
    client: true,
    default: false
  },
  slow_ipc_deserialize_sentry: {
    client: true,
    default: false
  },
  /**
   * Sync large (>5MB) documents to the extension host as binary content chunks
   * instead of a JSON lines array, avoiding giant JSON.stringify renderer
   * freezes and V8 max-string-length failures on document open.
   */
  chunked_document_open_sync: {
    client: true,
    default: true
  },
  ripgrep_invocation_monitor: {
    client: true,
    default: false
  },
  /**
   * Makes `.cursor/rules` discovery pass `.cursorignore` files to ripgrep
   * (`--cursor-ignore`), so negation patterns can re-include gitignored rule
   * files (DESK-9199).
   */
  rules_discovery_respect_cursorignore: {
    client: true,
    default: false
  },
  /**
   * Allows custom subagent directory symlinks to resolve outside the workspace
   * root, supporting shared agent-definition repositories (DESK-8355).
   */
  subagents_discovery_allow_external_symlinks: {
    client: true,
    default: false
  },
  grep_fallback_monitor: {
    client: true,
    default: false
  },
  crepe_lazy_external_git_index: {
    client: true,
    default: false
  },
  exthost_rpc_channel_history: {
    client: true,
    default: false
  },
  exthost_rpc_metrics: {
    client: true,
    default: false
  },
  remote_exthost_watchdog: {
    client: true,
    default: false
  },
  // Lets an unattended Glass agent workspace detach its remote connection so
  // the proxy stops holding the pod's hibernation lease. Thresholds and guards
  // live in `glass_remote_connection_dormancy_config`; this gate is the
  // rollout control and the kill switch.
  glass_remote_connection_dormancy: {
    client: true,
    default: false
  },
  // Skips only remote extension-host workspace readiness healthchecks.
  disable_remote_workspace_reh_healthcheck: {
    client: true,
    default: false
  },
  // Service-account Repository Access modal: when on, the modal stops calling
  // `getTeamRepositoriesForServiceAccountScope` and instead fans out across
  // SCM providers via `useAllInstallations`. Default off keeps the legacy
  // aggregator path; flip on per cohort to roll out PR #124528.
  service_account_repo_scope_use_installation_fanout: {
    client: true,
    default: false
  },
  // Knowledge sources on cursor.com Integrations & MCP. Off hides the
  // section and fail-closes the dashboard enroll RPCs. Create with
  // `scripts/create-statsig-gate.sh --client grok_bot_gkw_connectors`.
  grok_bot_gkw_connectors: {
    client: true,
    default: false
  },
  // Gates the MakeGithubRequest Connect RPC (CS-58 / CS-97). Per-user;
  // default off. When off the handler throws Unimplemented and IDE
  // clients fall back to their existing direct-fetch path. Ramp once
  // the handler impl (CS-98), workbench migration (CS-100), and
  // cursor-retrieval migration (CS-101) have all merged.
  ide_make_github_request_enabled: {
    client: true,
    default: false
  },
  // Gates the clickable detail disclosure in Customize -> Hooks execution log
  // rows. Off keeps the log read-only while Customize rolls out; on lets users
  // expand a row to inspect the captured hook input, output, and error output.
  customize_hooks_execution_log_detail: {
    client: true,
    default: true
  },
  dashboard_agent_requests_heatmap: {
    client: true,
    default: false
  },
  bugbot_enable_bulk_rules_upload_in_portal: {
    client: true,
    default: false
  },
  // Portal team-rules UI: agent type picker (Cursor / Sand / Both) and list badges.
  // Backend agentType field stays available regardless; this gate only hides the
  // dashboard controls until rollout. Read via useGateValue in portal-website.
  team_rule_agent_type_ui: {
    client: true,
    default: false
  },
  advanced_setup_for_self_hosted_gitlab_available: {
    client: true,
    default: false
  },
  gitlab_com_service_account_token_available: {
    client: true,
    default: false
  },
  enable_bitbucket_data_center_onboarding: {
    client: true,
    default: true
  },
  // Top-level portal switch for the Bitbucket integration surfaces
  // (integrations list, installation fetches, managed-agents pickers). Read
  // via `useGateValue` in portal-website; registered here so the gate is not
  // a portal-only string constant.
  enable_bitbucket: {
    client: true,
    default: true
  },
  internal_team_user_profiles: {
    client: true,
    default: true
  },
  user_claim_handle_glass: {
    // Read by the Glass client to gate the in-client claim-handle / profile UI.
    client: true,
    default: false
  },
  user_profile_glass: {
    // Read by the Glass client to gate the profile UI (claim flows redirect to web).
    client: true,
    default: true
  },
  enable_cursor_agent_worker_extension: {
    client: true,
    default: false
  },
  automations_chain_prompts: {
    client: true,
    default: false
  },
  // Gates the website automations prompt model selector over to the
  // parameterized ModelPicker. When OFF (default), web automations keep the
  // legacy picker backed by the automations-scoped filtered model list.
  website_use_new_model_picker_for_automations: {
    client: true,
    default: true
  },
  green_dot_automation_status: {
    client: true,
    default: true
  },
  automations_validate_on_enable: {
    client: true,
    default: true
  },
  automations_retry_button: {
    client: true,
    default: false
  },
  managed_automations_team_revamp: {
    client: true,
    default: true
  },
  // Kill-switch / rollout for GitLab "extended" automation triggers beyond the
  // shipped baseline (lifecycle/push/comments): MR label changes and MR
  // approvals. When OFF (default), the matcher rejects these GitLab triggers and
  // the GitLab label fan-out is skipped, so behavior is byte-identical to before
  // (GitHub-only for these trigger kinds). Evaluated per the GitLab webhook's
  // repo-owner context on the backend, so it doubles as a gradual per-team
  // rollout. Exposed to the client (client: true) so the automations trigger
  // picker surfaces these GitLab triggers only when the backend will honor them
  // for the current user/team — keeping the UI from offering a trigger that
  // would silently never fire.
  automations_gitlab_extended_triggers: {
    client: true,
    default: true
  },
  // Kill-switch / rollout for Bitbucket "extended" automation triggers beyond the
  // shipped baseline (lifecycle/push/top-level comments): PR review approved /
  // changes-requested. When OFF (default), the matcher rejects the Bitbucket
  // pullRequestReview trigger and reviews stay a no-op, so behavior is
  // byte-identical to before. Evaluated per the Bitbucket webhook's repo-owner
  // context on the backend, so it doubles as a gradual per-team rollout. Exposed
  // to the client (client: true) so the trigger picker surfaces the Bitbucket
  // PR-review trigger only when the backend will honor it for the current
  // user/team. (Bitbucket has no PR labels, and inline comments can't be safely
  // pinned — only the mutable source head is in the comment payload — so neither
  // is included.)
  automations_bitbucket_extended_triggers: {
    client: true,
    default: false
  },
  // Forge-agnostic automations on Origin mirrors (single rollout flag for the
  // PRD in backend/server/src/automations/docs/origin-forge-agnostic-automations-prd.md):
  // GitHub-configured triggers also fire on the repo's Origin mirror, and
  // mirror-echo events (pushes / PR push/merge updates duplicated by mirroring)
  // run once from the source-of-truth forge with the skipped copy recorded as
  // a SKIPPED run. Supersedes automations_scm_alias_matching,
  // automations_scm_phase_routing, and automations_scm_dispatch_dedup — call
  // sites check "new flag OR old flag" until the old flags are deleted.
  // Client-visible: also gates the matching Automations UI (the Add Trigger
  // menu collapses the separate GitHub / Origin buckets into one
  // "Git trigger" entry). The repo-picker lock to the git trigger's
  // repository shipped ungated — pure-git launches always use the event's
  // repo, so the lock is accurate regardless of this flag.
  automations_forge_agnostic_mirrors: {
    client: true,
    default: false
  },
  managed_agents_enabled: {
    client: true,
    default: false
  },
  custom_agents_enabled: {
    client: true,
    default: true
  },
  debug_bot_customer_facing_ui: {
    client: true,
    default: false
  },
  agents_bugbot_bottom_upsell: {
    client: true,
    default: false
  },
  // Consolidated review-agents growth kit on the portal (shared enable CTAs,
  // From Cursor cards, deep links, invite-modal CTA, upsell destinations for
  // bugbot / security / pr-routing / self-driving). OFF: every Bugbot growth
  // surface runs its pre-kit code path byte-for-byte. ON: the wrapped
  // surfaces route through the agent-parameterized kit in
  // portal-website/apps/web/src/components/review-agents-growth/ (for Bugbot
  // the kit reproduces legacy behavior exactly; equality-tested).
  review_agents_shared_growth: {
    client: true,
    default: false
  },
  automations_org_scoped_triggers_ui: {
    client: true,
    default: false
  },
  // Automations editor: let git-only automations pin a multi-repo
  // environment (CPROD-2271). ON keeps the repo/environment picker
  // interactive in pure-git mode, offering multi-repo environments only,
  // and preserves a selected multi-repo environment across the pure-git
  // transition. OFF is the prior behaviour: picker locked to "Repository
  // from Git Trigger" and any environment cleared on that transition.
  // Ramp per team (GM first); no backend change is gated.
  automations_git_trigger_environment_targets: {
    client: true,
    default: true
  },
  /**
   * Gate rolling out no-repo cloud agents: when on, start requests that
   * set `DevcontainerStartingPoint.environment_id` with no repo URL and
   * no private worker are accepted and routed through the env-only
   * cloud-VM code path. When off, such requests are rejected with a
   * BadRequest. See the no-repo cloud agents plan for details.
   */
  cloud_agents_no_repo_enabled: {
    client: true,
    default: true
  },
  cloud_agent_resubmit_from_message: {
    client: true,
    default: true
  },
  /** Shows live Origin CI check rings in the Glass cloud-agent sidebar. */
  glass_cloud_agent_sidebar_ci_status: {
    client: true,
    default: false
  },
  /** Enables migration resume kickoffs after backend support reaches every region. */
  cloud_agent_migration_resume_kickoff: {
    client: true,
    default: true
  },
  /**
   * Glass-only ramp for forking a cloud agent from turn actions
   * (ForkBackgroundComposer). Portal uses `cloud_agent_fork_from_turn`.
   */
  glass_cloud_agent_fork_from_turn: {
    client: true,
    default: true
  },
  cloud_agent_use_prewarmed_pods: {
    client: true,
    default: true
  },
  /** Glass StreamConversation compact-blob filter gate. */
  glass_cloud_blob_prefetch_bloom_filter: {
    client: true,
    default: true
  },
  /**
   * IDE/Glass: when on, CloudAgentStream stops post-ready StreamConversation
   * reconnects on permanent Connect errors / terminal Aborted phrases. Default
   * off preserves historical reconnect-forever behavior for cautious rollout.
   */
  cloud_agent_stop_permanent_stream_reconnect: {
    client: true,
    default: true
  },
  /**
   * Glass: rebuild a mounted cloud-agent pane whose rendered transcript has
   * fallen behind the adapter, instead of leaving it stale until the user
   * switches tabs or refocuses the window. Kill switch for that repair.
   */
  cloud_agent_repair_stalled_pane: {
    client: true,
    default: true
  },
  /** Bounds renderer memory held by cloud agent transcript bodies. */
  cloud_agent_bounded_transcript_body_residency: {
    client: true,
    default: false
  },
  /** Plugin-backed slash commands, snapshot RPC, cloud-agent plugin MCP merge, and server VM manifest materialization. */
  cloud_agent_plugins: {
    client: true,
    default: true
  },
  // Shared portal/backend gate for duplicating named and multi-repo GitHub
  // cloud-agent environments onto their verified Origin mirrors. The portal
  // controls visibility; the backend remains authoritative and fails closed.
  cloud_agent_origin_env_migration_rpc: {
    client: true,
    default: false
  },
  local_agent_subagent_state_blob_refs: {
    client: true,
    default: false
  },
  cloud_agent_env_setup_with_dockerfiles: {
    client: true,
    default: false
  },
  // Umbrella rollout for the generalized environment-setup experience.
  // Initially gates setup snapshots, fast Save reuse, and related portal UX;
  // future env-setup improvements can share the same coordinated rollout.
  generalized_env_setup: {
    client: true,
    default: true
  },
  // When ON, a blocking `ask_question` interaction for a cloud agent will
  // auto-answer (reject the questionnaire so the model proceeds with reasonable
  // defaults) after a configurable timeout instead of blocking indefinitely.
  // The timeout comes from the composer owner's user setting
  // (askQuestionAutoAnswerTimeoutMinutes: 0 = disabled, up to 1 hour), falling
  // back to the cloudAgentAskQuestionDefaultTimeoutMs persistent config. Also
  // gates the timeout picker in the portal Cloud Agents settings, which reads
  // it client-side via useGateValue, so this must be client-available. Default
  // OFF preserves indefinite blocking.
  cloud_agent_ask_question_auto_answer: {
    client: true,
    default: false
  },
  // Controls whether the user-facing "Auto-Answer Timeout" configuration
  // control shows up in the portal Cloud Agents settings (the Questions
  // section / timeout picker). Read client-side via useGateValue, so it must
  // be client-available. When OFF (the default for everyone) the picker is
  // hidden and the effective timeout falls back to the server default; when ON
  // the user can configure the ask_question auto-answer timeout themselves.
  // Independent from `cloud_agent_ask_question_auto_answer`, which enables the
  // underlying auto-answer behavior.
  cloud_agent_ask_question_auto_answer_timeout_setting: {
    client: true,
    default: false
  },
  // Hard-cutover: default buildsEnabled to true and hide opt-out; fail closed.
  cloud_agent_env_builds_default_enabled: {
    client: true,
    default: true
  },
  // Portal-only: show the Builds-tab "Check with an agent" / "Run setup agent"
  // card that launches the migrate-to-builds setup agent. Independent of
  // build consumption / migrate skill / MCP tools so the card can be killed
  // without disabling those. Default off.
  cloud_agent_migrate_to_builds_setup_agent_cta: {
    client: true,
    default: true
  },
  cloud_agent_transcript_reliability_controls: {
    client: true,
    default: true
  },
  local_agent_transcript_search_in_glass: {
    client: true,
    default: true
  },
  // Gates the model-visible SearchConversations tool separately from the index
  // and palette UI because transcript snippets cross a different boundary.
  agent_conversation_search_tool: {
    client: true,
    default: true
  },
  // Kill switch for cached-cloud FTS metadata and body indexing in Glass. Local
  // SQLite search and in-renderer cloud metadata matching remain active.
  disable_cloud_agent_transcript_indexing_in_glass: {
    client: true,
    default: false
  },
  nal_agent_retries: {
    client: true,
    default: true
  },
  cli_harness_telemetry: {
    client: true,
    default: false
  },
  cli_image_arg: {
    client: true,
    default: false
  },
  "x-chat-context": {
    client: true,
    default: false
  },
  referral_codes_v2: {
    client: true,
    default: true
  },
  p2p_referrals_v1: {
    client: true,
    default: true
  },
  disk_usage_monitor: {
    client: true,
    default: false
  },
  oom_crash_watcher: {
    client: true,
    default: false
  },
  local_request_tracing: {
    client: true,
    default: false
  },
  local_request_trace_dd_slogs: {
    client: true,
    default: false
  },
  /** @deprecated Retained for released clients; new clients use memory_monitor_config. */
  memory_pressure_profiling: {
    client: true,
    default: true
  },
  // Anysphere-internal-only CPU monitor: detects sustained high CPU usage
  // across the Cursor process tree and offers to capture and upload a process
  // snapshot (similar to the memory monitor's heap snapshot flow). The client
  // additionally requires the server-provided internal/dev flag, so enabling
  // this gate for external users has no effect. Default OFF; tuned via the
  // `cpu_monitor_config` dynamic config.
  cpu_monitor_process_snapshot: {
    client: true,
    default: false
  },
  issue_traces_enabled: {
    client: true,
    default: true
  },
  glass_automations_ui: {
    client: true,
    default: true
  },
  // Default OFF preserves the pre-change count-suffixed VirtualizedDiff group key.
  glass_stable_diff_group_keys: {
    client: true,
    default: false
  },
  local_automations: {
    client: true,
    default: false
  },
  local_automations_nav: {
    client: true,
    default: false
  },
  // Enables the opt-in agent confetti cannon in Glass settings and cursor-app-control MCP.
  // Intentionally not created in Statsig yet; local overrides are used during development.
  glass_agent_confetti_cannon: {
    client: true,
    default: true
  },
  glass_install_plugin_tool_enabled: {
    client: true,
    default: true
  },
  cursor_backend_control_automation_mcp: {
    client: true,
    default: true
  },
  glass_configure_multi_root_option: {
    client: true,
    default: true
  },
  glass_multi_root_workspace_editing: {
    client: true,
    default: false
  },
  // Enables same-workspace connection repair for Glass Remote SSH reconnects.
  glass_remote_ssh_workspace_repair: {
    client: true,
    default: true
  },
  // Enables replacing management connections after server-side token loss during Glass Remote SSH repair.
  glass_remote_ssh_management_connection_token_loss_repair: {
    client: true,
    default: true
  },
  glass_custom_theme_support: {
    client: true,
    default: false
  },
  glass_send_feedback: {
    client: true,
    default: false
  },
  environment_param_for_subagent: {
    client: true,
    default: false
  },
  glass_assistant_message_selection_feedback: {
    client: true,
    default: false
  },
  glass_editor_panel_tab_copy_link: {
    client: true,
    default: false
  },
  glass_peaky_file_trees: {
    client: true,
    default: false
  },
  // Lets a markdown table in a Glass preview tab or chat transcript open from
  // its corner control. Off by default for a staged rollout.
  glass_markdown_table_expand: {
    client: true,
    default: false
  },
  // Shows the Save CTA on Glass's environment-setup save-ready composer tray
  // (parity with web). Off by default for gradual rollout / metric impact.
  save_button_glass_env_setup: {
    client: true,
    default: true
  },
  glass_status_bar_environment_picker: {
    client: true,
    default: false
  },
  // Renders Project CreateAgent / SendToAgent / StopAgent calls as one-line
  // transcript rows instead of Task cards. Off keeps the Task card.
  glass_project_agent_tool_rows: {
    client: true,
    default: false
  },
  glass_agent_branch_status_picker: {
    client: true,
    default: false
  },
  glass_all_changes_diff_scope: {
    client: true,
    default: false
  },
  glass_scm_dynamic_base_branch: {
    client: true,
    default: false
  },
  glass_direct_github_connect: {
    client: true,
    default: false
  },
  scm_connect_in_app_ad: {
    client: true,
    default: true
  },
  scm_connect_in_app_ad_gitlab: {
    client: true,
    default: true
  },
  // Routes the connect-SCM ad's eligibility checks through the cheap, cached
  // GetScmConnectionStatus probe instead of skipCache GetGithubAccessTokenForRepos
  // token minting (sev-1340). OFF reproduces the legacy behavior exactly.
  scm_connect_ad_cheap_probe: {
    client: true,
    default: true
  },
  /**
   * Claude Code import: settings, actual import, empty-state CTA, and import
   * modal.
   */
  import_cc_conversation: {
    client: true,
    default: true
  },
  import_cc_conversation_default: {
    client: true,
    default: false
  },
  glass_drafts_quick_action_pill: {
    client: true,
    default: false
  },
  glass_sidebar_source_metadata: {
    client: true,
    default: false
  },
  glass_sidebar_scroll_active_row_if_needed: {
    client: true,
    default: true
  },
  /**
   * Top-level Archive icon in the Glass sidebar action strip (between customize
   * and Open Workspace). When off, Archived stays in the customize/filter menu.
   */
  glass_sidebar_archive_toggle: {
    client: true,
    default: false
  },
  /**
   * Glass sidebar Show Environment: laptop icon for local agents, and laptop
   * glyph on the Customize menu Environment item. Off keeps the prior cloud-only
   * environment badge (local agents have no icon; menu uses cloud).
   */
  glass_sidebar_env_icons: {
    client: true,
    default: false
  },
  glass_btw_side_question: {
    client: true,
    default: false
  },
  /**
   * Durable side chats in Glass: spin off a persistent, non-blocking side
   * conversation tied to the current agent (rendered as an editor-panel tab).
   * Supersedes the ephemeral `/btw` overlay when enabled.
   */
  glass_side_chats: {
    client: true,
    default: true
  },
  /**
   * Gates cloud `/side` creation and Glass rediscovery; existing chats
   * reappear when re-enabled.
   */
  cloud_agent_side_chats: {
    client: true,
    default: true
  },
  /**
   * Cloud Desktop lease: humans taking control fence computer-use input on
   * the VM, and computer-use subagents stamp their actions. Assignment unit:
   * userID. Off keeps the legacy client-only takeover.
   */
  cloud_agent_desktop_lease: {
    client: true,
    default: true
  },
  /**
   * Machine tab and memory pressure alert for cloud agents: the exec-daemon
   * resource sampler, the worker relay, the pressure route and the client
   * tabs. Evaluated as the composer owner. Assignment unit: userID.
   */
  cloud_agent_machine_resources: {
    client: true,
    default: false
  },
  /**
   * Launched. Coordinator membership is pinned from isRootProjectDetails;
   * this gate is unused in code.
   */
  cloud_project_coordinator_v2: {
    client: true,
    default: true
  },
  /** Default-off rollout gate for authoritative Glass Project worker snapshots. */
  glass_project_worker_membership_rpc: {
    client: true,
    default: true
  },
  /**
   * Markdown list editing in Glass prompt inputs: `- ` / `1. ` auto-convert
   * to bullet/numbered lists with native Tab/Shift-Tab indent handling and
   * plain-text list serialization on submit.
   */
  glass_composer_markdown_support: {
    client: true,
    default: false
  },
  /**
   * Glass: a blocked cloud child's AskQuestion form is answered in the
   * child's own conversation rather than auto-surfaced in an ancestor's
   * questionnaire tray. The child's needs_attention badge, the coordinator's
   * WORKER_NEEDS_ATTENTION notification, and the coordinator row's own
   * blocked-worker lift are untouched, as is answering after deliberately
   * opening the child (row click, preview, or notification link).
   * Off = today's behavior: the ancestor loads waiting cloud children and
   * shows the first question it finds without being asked to.
   */
  glass_cloud_child_question_answered_in_child: {
    client: true,
    default: false
  },
  /**
   * Freehand annotation on PromptInput attached images (Glass, composer
   * message edit, Cursor Review). When off, the image lightbox stays
   * available without a drawing canvas.
   */
  prompt_input_image_annotation: {
    client: true,
    default: true
  },
  /**
   * Split editor-panel tabs into tiles in Glass: each tile hosts its own tab
   * strip, tabs can be dragged out to create new tiles or between tiles.
   * When off, the persisted panel layout is ignored and tabs render flat.
   */
  glass_split_tabs: {
    client: true,
    default: true
  },
  /**
   * Chrome DevTools style responsive design mode in Glass browser tabs: the
   * header toggle and the device / size / zoom pill. When off, browser tabs
   * render the page as before.
   */
  glass_browser_responsive_design_mode: {
    client: true,
    default: true
  },
  /**
   * First-open / automatic-default editor-panel tab is a PR tab when the
   * agent has PRs, instead of Changes. Flag-off keeps Changes as the default.
   *
   * Create the Statsig console gate (Cloud Agents must not):
   * `scripts/create-statsig-gate.sh --client glass_default_pr_tabs "First-open Glass editor default is PR tabs when the agent has PRs, not Changes"`
   */
  glass_default_pr_tabs: {
    client: true,
    default: false
  },
  /**
   * Keep the most recently selected Glass single-pane agent transcripts
   * mounted (hidden) across chat switches instead of unmounting the surface
   * on every switch.
   */
  glass_agent_surface_keepalive: {
    client: true,
    default: false
  },
  glass_lazy_file_tabs: {
    client: true,
    default: true
  },
  /**
   * Glass offline tray ("You're offline") while `navigator.onLine` is false.
   * Internal-only: target `custom.teamID == "1"` in Statsig. Off means no tray
   * and no window online/offline listeners, so external users see no change.
   */
  glass_offline_tray: {
    client: true,
    default: false
  },
  glass_projects_enabled: {
    client: true,
    default: false
  },
  /**
   * Forces the Remote Control user toggle on (stored setting OR this gate).
   * Console-targeted at Cloud Projects users; team allow, allowlist, plan,
   * and worker-extension availability checks still apply downstream.
   */
  internal_cloud_project_remote_control: {
    client: true,
    default: false
  },
  /**
   * Glass: adding a local agent to a cloud Project (sidebar drag, Add to
   * Project, Project pane drop). The agent converts to Remote Control on this
   * machine and attaches to the Project. Off hides every entry point; Remote
   * Control's own entry points are unaffected.
   */
  enable_add_local_agent_to_cloud_project: {
    client: true,
    default: false
  },
  /**
   * Glass rollout for Remote Control v2 runtime, settings, enrollment, idle,
   * and dispatcher entry. Default off and client-visible.
   */
  remote_agent_host_glass: {
    client: true,
    default: false
  },
  /**
   * Agents UI: present Glass Projects as Agents (sidebar section header, the
   * singular noun on the app tab and sidebar rail entry, and the create call to
   * action). Naming only — nothing about what a Project is or does changes, and
   * flags, storage keys, and telemetry keep the `Project` name.
   *
   * Every renamed surface is itself behind `glass_projects_enabled`, so this
   * gate is read on its own rather than ANDed with Projects; scope the rollout
   * to the Projects population in the console.
   */
  glass_projects_as_agents: {
    client: true,
    default: false
  },
  /**
   * First-Project onboarding: the kickoff overlay (two-message welcome
   * script) plus the two-milestone prompt guidance (first-Project intro and
   * the first notes.md write) on a user's first Project. Read at Glass
   * create-time stamping, at the cloud kickoff re-derivation, and at the
   * session-build prompt injection. When OFF (default) Projects create with
   * no onboarding behavior.
   */
  glass_first_project_onboarding: {
    client: true,
    default: true
  },
  /**
   * Dev-only escape hatch for exercising the first-Project experience: when
   * ON, the already-has-Projects veto is bypassed at Glass create-time
   * stamping and at the cloud kickoff re-derivation, so an account with
   * existing Projects still gets the first-Project treatment. Everything
   * else — the main glass_first_project_onboarding gate above and the
   * structural root-Project checks — still applies. Never ramp beyond dev
   * accounts.
   */
  dev_only_force_first_project_experience: {
    client: true,
    default: false
  },
  /**
   * Moves the leading notes.md TLDR from Project Overview into a headerless
   * card at the top of Project Notes. Off preserves the existing Overview
   * placement.
   */
  glass_project_notes_tldr_card: {
    client: true,
    default: true
  },
  /**
   * Notes-only title-bar Context toggle. Off hides the icon and keeps Notes.
   */
  glass_project_notes_only_title_context: {
    client: true,
    default: false
  },
  /**
   * Restyles Project Notes markdown links as bold, faintly underlined
   * Notion-like text with a low-opacity hover fill. Off keeps the default
   * blue link chip on Notes, Overview tasks, and composer end-of-turn.
   */
  glass_project_notes_notion_links: {
    client: true,
    default: false
  },
  /**
   * Project Notes document view: renders `notes.md` as a centered document
   * (title, description, structured Tasks with id/agent/PR/tag chips, durable
   * sections). Checked on the client for rendering and on the backend for
   * the coordinator `notes.md` lint reminder. The matching document prompt is
   * a rule on `project_prompt_text_config` conditioned on this gate, so OFF
   * reproduces today's Project UX end to end.
   */
  glass_project_notes_document: {
    client: true,
    default: false
  },
  /**
   * Clickable "Create a project" empty state in the Glass Projects sidebar
   * section, shown when the section is enabled but has no project rows.
   */
  glass_projects_empty_state: {
    client: true,
    default: false
  },
  /** Unread divider and jump pill in Glass Project parent conversations. */
  glass_projects_unread_divider: {
    client: true,
    default: true
  },
  /**
   * Opens the Apps pane when a Project is created, so a new Project lands with
   * Notes already visible instead of on a chat with no sign the pane exists.
   * When OFF (default) a new Project resolves visibility from stored intent
   * exactly as today.
   */
  glass_projects_open_apps_on_create: {
    client: true,
    default: false
  },
  /**
   * Glass Project composers (the coordinator and every Project subagent
   * thread) render the expanded typing-state layout from the start: `+` and
   * the model selector bottom-left, mic and submit bottom-right, and no
   * status row below the input. When OFF (default) a Project composer starts
   * in the collapsed idle layout and keeps its branch / environment / context
   * status row.
   */
  glass_projects_expanded_composer: {
    client: true,
    default: false
  },
  /**
   * Glass Project coordinators: no steer path. Plain Enter force-sends
   * (interrupts the running turn); the alternate submit chord (Cmd/Ctrl+Enter)
   * queues the message for its own turn; queue-row Send Now interrupts. When
   * OFF (default) Project submits follow the Queue Messages setting and the
   * Project steering policy.
   */
  glass_projects_prefer_interrupt: {
    client: true,
    default: true
  },
  /**
   * Gates the Connect-Vercel pill on Glass **cloud** agent New Project
   * conversations. Split from `glass_vercel_connect_pill_local` so the two
   * agent runtimes roll out independently.
   */
  glass_vercel_connect_pill_cloud: {
    client: true,
    default: false
  },
  /**
   * Gates the Connect-Vercel pill on Glass **local** agent New Project
   * conversations. Split from `glass_vercel_connect_pill_cloud` so the two
   * agent runtimes roll out independently.
   */
  glass_vercel_connect_pill_local: {
    client: true,
    default: false
  },
  /**
   * Gates the Vercel Publish pill on the portal-website agents page (the
   * web port of the Glass New Repository flow). Split from the Glass gates
   * so the web surface rolls out independently. Read by the portal's
   * Statsig client; the flow config itself still requires
   * `glass_new_repo_flow_server_config`.
   */
  web_vercel_publish_pill: {
    client: true,
    default: false
  },
  /**
   * Local interactive-child inbox: when an interactive parent-grounded child
   * (project thread, side chat) finishes a user-requested turn, the client
   * writes a result record into the parent's local Agent Inbox and surfaces
   * unseen entries as a path-only reminder on the parent's next real user
   * submit — the local mirror of the cloud resource-child inbox. Client-only.
   */
  local_interactive_child_inbox: {
    client: true,
    default: false
  },
  // Deprecated: fully launched. The VS Code client always treats this as
  // enabled; entry kept as a safety net for older clients.
  glass_diff_ci_tab: {
    client: true,
    default: true
  },
  managed_review_agent_skills_enabled: {
    client: true,
    default: false
  },
  // Deprecated: fully launched. The VS Code client always treats this as
  // enabled; entry kept as a safety net for older clients.
  glass_diff_commits_tab: {
    client: true,
    default: true
  },
  // Deprecated: fully launched. The VS Code client always treats this as
  // enabled; entry kept as a safety net for older clients.
  glass_diff_reviews_tab: {
    client: true,
    default: true
  },
  // Glass: offer Cloud / Remote Control as migration targets for worktree
  // agents ("Continue on" picker, /remote-control, mobile-initiated remote
  // control). The worktree-to-cloud pipeline strategy itself is not gated.
  glass_worktree_to_cloud: {
    client: true,
    default: true
  },
  // Cloud→local migration: when the branch checkout still hard-fails after
  // the deterministic recoveries, land the migration and hand the failure to
  // the migrated agent as a simulated checkout-branch message instead of
  // failing the whole move.
  glass_agentic_migration_reconcile: {
    client: true,
    default: false
  },
  // Glass: offer worktrees as migration targets for cloud agents — the
  // "Continue on" picker gains a Worktree submenu (existing worktrees + New
  // Worktree) and "Move to" menus list the same targets. The
  // cloud-to-worktree pipeline strategy itself is not gated.
  glass_cloud_to_worktree: {
    client: true,
    default: true
  },
  // Per-file "Viewed" toggle in the Glass PR tab Files Changed list.
  glass_pr_viewed: {
    client: true,
    default: true
  },
  glass_pr_realtime_updates: {
    client: true,
    default: false
  },
  glass_cursor_tab: {
    client: true,
    default: true
  },
  glass_avoid_secondary_scanline: {
    client: true,
    default: false
  },
  /** Sub-flag: include skill-invocation pills in auto-suggested quick actions. */
  glass_auto_suggested_quick_actions_skills: {
    client: true,
    default: false
  },
  /** Suggest pinned skills from keywords typed in the Glass prompt. */
  glass_skill_keyword_nudges: {
    client: true,
    default: false
  },
  /** Install skills from a pasted `npx skills add` command or skills.sh link in Customize. */
  skills_cli_install: {
    client: true,
    default: false
  },
  /** Glass follow-up pill to continue working after agent pauses (e.g., SSH disconnects). */
  glass_continue_working_pill: {
    client: true,
    default: true
  },
  /**
   * Show the follow-up PRs pill on regular (non-Project) Glass agents when
   * the thread has associated open PRs. Project parents stay on the existing
   * Beta Projects pill setting and ignore this gate.
   */
  glass_agent_pr_followup_pill: {
    client: true,
    default: false
  },
  glass_open_resource_tool_enabled: {
    client: true,
    default: true
  },
  /**
   * Group stacked pull requests in the Glass Projects PR tray and order rows
   * by `created_at`. Off, the tray keeps the pre-feature behavior: flat rows
   * ordered by recency, and no stack topology is fetched.
   */
  glass_pr_tray_stack_groups: {
    client: true,
    default: false
  },
  open_github_pr_links_in_review_cursor: {
    client: true,
    default: false
  },
  cursor_com_review_pages: {
    client: true,
    default: false
  },
  show_cursor_review_early_access_ad: {
    client: true,
    default: false
  },
  smart_allowlist_required: {
    client: true,
    default: false
  },
  bugbot_low_mode: {
    client: true,
    default: true
  },
  // Collapses the Bugbot dashboard setup into a single action for usage-based
  // (TOKEN) team admins: when ON, connecting GitHub (or clicking Enable when
  // already connected) enables the team plan + all repos in one step, with no
  // separate enable modal. Scoped to usage-based team admins; Pro individuals,
  // SEAT, and enterprise are out of scope and keep the explicit enable modal.
  // Read in the portal via useGateValue in bugbot/index.tsx. Default OFF so it
  // is dark-launchable. Bucket on teamID in the Statsig console.
  bugbot_connect_repo_implicit_enable: {
    client: true,
    default: true
  },
  // Team onboarding defaults — bucket on teamID in Statsig console.
  // Checked ONLY on the frontend (portal `useBugbotOnboardingDefaultsTreatment`)
  // so the experiment has a single exposure path; the portal forwards the
  // treatment decision to the backend (no backend `checkGate`). Pro/individual
  // users are out of scope. `client: true` so the portal client SDK serves it.
  bugbot_onboarding_high_effort_learning_defaults_team_v2: {
    client: true,
    default: true
  },
  bugbot_suggested_repos_banner: {
    client: true,
    default: true
  },
  // Growth experiment: let non-admin team members enable Bugbot on team-owned
  // repos via the per-repo enable path, instead of dead-ending on the
  // admin-only gate. GitHub-only (dotcom + GHE); GitLab/Azure/Bitbucket stay
  // admin-only because enable requires webhook/service-account setup. Only
  // relaxes when the team kill switch (bugbotTeamSettings.bugbotGloballyDisabled)
  // is off; admins keep the kill switch and installation-wide defaults stay
  // admin-only. Enterprise teams are excluded in code (kept on the admin-only
  // control). Read server-side in dashboardScmRepositoryHandlers (per-repo
  // enable authorization) and in the portal via useGateValue to switch the CTA
  // between enable and request. Default OFF (dark-launchable). Bucket on
  // teamID in the Statsig console.
  bugbot_non_admin_enablement: {
    client: true,
    default: true
  },
  use_model_parameters: {
    client: true,
    default: true
  },
  cloud_agent_default_model_picker: {
    client: true,
    default: true
  },
  // Exposes structured Auto Smart Optimize For variants in the Cloud Agent
  // default model picker. Runtime support must deploy before this gate rolls out.
  cloud_agent_default_auto_modes: {
    client: true,
    default: true
  },
  use_react_model_picker: {
    client: true,
    default: true
  },
  model_picker_max_badge: {
    client: true,
    default: false
  },
  model_picker_hover_options: {
    client: true,
    default: false
  },
  /**
   * Launched. New clients always hide the max-mode toggle for token-based
   * users. Kept registered so older clients that still read this gate keep
   * the same behavior.
   */
  model_picker_hide_max_mode_token_users: {
    client: true,
    default: true
  },
  bugbot_auto_spawn_cloud_agent: {
    client: true,
    default: true
  },
  bugbot_fail_check_on_findings: {
    client: true,
    default: false
  },
  vscode_text_model_telemetry: {
    client: true,
    default: false
  },
  composer_auto_routing_result_display: {
    client: true,
    default: true
  },
  // Shared backend/portal rollout for economics-based Premium seat
  // recommendations. Evaluation supplies teamID as a custom ID so rules can
  // target teams; portal gate-off keeps the legacy page-scoped heuristic.
  seat_upgrade_economics_recommendations: {
    client: true,
    default: true
  },
  self_serve_team_tiered_pricing_conversion: {
    client: true,
    default: true
  },
  self_serve_team_tiered_pricing_manual_conversion: {
    client: true,
    default: true
  },
  self_serve_team_tiered_pricing_new_team_creator: {
    client: true,
    default: true
  },
  // Rollout gate for the combined tokens-and-tiered conversion of legacy
  // request-priced self-serve teams (teamID-targetable). When ON for a team,
  // the tiered-pricing preview/convert endpoints route it through the
  // combined path that persists pricing_strategy=tokens and enables tiered
  // pricing in one transaction; when OFF, those teams keep today's
  // "Only token-priced self-serve teams" rejection. `client: true` because
  // the Grok Bot onboarding wizard reads the same gate to decide between
  // offering the combined switch and showing the request-pricing blocker
  // without firing a doomed preview; the backend still enforces the gate
  // (plus the sand_onboarding request origin) on both endpoints.
  self_serve_team_tiered_pricing_legacy_conversion: {
    client: true,
    default: false
  },
  enable_spend_alerts_percentage_threshold: {
    client: true,
    default: true
  },
  cursor_models_additional_budget: {
    client: true,
    default: false
  },
  composer_enable_bga_hydration_from_snapshot: {
    client: true,
    default: true
  },
  fix_remote_ssh_checkpoints: {
    client: true,
    default: false
  },
  glass_composer_header_pagination: {
    client: true,
    default: false
  },
  voice_mode_settings: {
    client: true,
    default: false
  },
  voice_dictation_streaming_only: {
    client: true,
    default: true
  },
  glass_realtime_voice: {
    client: true,
    default: false
  },
  cursor_blame: {
    client: true,
    default: false
  },
  cursor_skill_enabled: {
    client: true,
    default: false
  },
  onboard_skill_enabled: {
    client: true,
    default: false
  },
  ai_attribution_tool: {
    client: true,
    default: false
  },
  pr_metrics_admin_view_override: {
    client: true,
    default: false
  },
  portal_pr_code_tour: {
    client: true,
    default: false
  },
  enable_code_tours_custom_prompt: {
    client: true,
    default: false
  },
  // Path-scoped tour VIEW on cursor.com/review + Origin clients: a read-time
  // projection of the served tour onto one path prefix (never a scoped
  // generation). Console targets `graphite-client` + `client`.
  enable_code_tour_path_scope: {
    client: true,
    default: false
  },
  portal_pr_code_tour_stack_nav: {
    client: true,
    default: false
  },
  portal_pr_code_tour_stack_generate: {
    client: true,
    default: false
  },
  // Tour Walk chrome on the review Tour tab: next/prev section stepping, an
  // "N of M" counter, and resuming the viewer's last-read section on reopen
  // (localStorage, keyed per viewer + PR + tour scope). Console gate is
  // created manually: anysphere project, tag `origin`, target apps
  // `graphite-client` AND `client` (cursor.com portal). Fail-closed: off or
  // absent keeps the tour outline walk-free and writes no resume state.
  enable_code_tour_walk: {
    client: true,
    default: false
  },
  // Per-section reviewed marks persisted on the tour revision. Fail-closed:
  // when off or missing, no chrome renders and no persist writes happen.
  enable_code_tour_section_reviewed: {
    client: true,
    default: false
  },
  glass_pr_code_tour: {
    client: true,
    default: false
  },
  portal_pr_activity: {
    client: true,
    default: false
  },
  // cursor.com/agents PR tab takeover: for Origin-visible viewers, an agent
  // whose PR lives on Origin renders the Origin Review PR page (the
  // `@monologue/cursor-review-pr-page` `PrPage` mount) in place of the
  // portal-native `PRReviewPane`, with the agent conversation seated as the
  // page's agent panel. Off keeps today's pane for everyone; GitHub PRs are
  // never affected. Default OFF; prototype for the Origin PR-tab takeover.
  agents_origin_pr_tab: {
    client: true,
    default: false
  },
  // cursor.com/agents: the PR pane of a cloud agent whose PR is a github.com
  // PR renders the Cursor Review PR page instead of the portal-native
  // `PRReviewPane`, when Review's owner-eligibility verdict admits the repo
  // (forward-mirrored into Origin) with resolved Origin slugs; every other
  // GitHub PR keeps today's pane. Off keeps today's pane for every GitHub PR
  // and issues no eligibility probe. Independent of `agents_origin_pr_tab`.
  // Default OFF.
  agents_github_pr_tab: {
    client: true,
    default: false
  },
  // Glass-parity transcript tree for cloud agent conversations. Web chat v2:
  // cursor.com/agents/[bcId], the PR agent panel, and the side chat mount the
  // ported Glass transcript shell (PORTAL_GLASS_TRANSCRIPT_GATE in the portal's
  // constants/background-composer.ts) instead of the legacy AgentTurnsSection
  // tree. Off keeps the legacy tree. Unit: userID. Default OFF.
  portal_glass_transcript: {
    client: true,
    default: false
  },
  // Hides Project agents (composers with projectMetadata) from the portal
  // agents sidebar list.
  portal_hide_projects_sidebar: {
    client: true,
    default: true
  },
  enable_ex_hs: {
    client: true,
    default: true
  },
  stars_popup_ignore_dont_ask_again: {
    client: true,
    default: false
  },
  terminal_execution_service_2: {
    client: true,
    default: true
  },
  long_running_jobs: {
    client: true,
    default: true
  },
  background_nudge_2: {
    client: true,
    default: true
  },
  auto_background_foreground_tools_on_followup: {
    client: true,
    default: false
  },
  user_message_timestamps: {
    client: true,
    default: true
  },
  // Kill switch for opening a cloud agent's loopback <preview> URL via port
  // forwarding over the agent workspace's remote connection (Glass). When
  // off, Preview falls back to the previous behavior: opening the agent's
  // Desktop (VNC) tab. Checked client-side per click; no exposure logging.
  cloud_agent_preview_port_forward: {
    client: true,
    default: false
  },
  terminal_ui_2: {
    client: true,
    default: true
  },
  composer_protected_tooltip: {
    client: true,
    default: true
  },
  auto_open_review_during_plan_build: {
    client: true,
    default: false
  },
  analyze_query_intent: {
    client: true,
    default: false
  },
  mcp_allowlists: {
    client: true,
    default: true
  },
  allowlist_in_ask_every_time_mode: {
    client: true,
    default: false
  },
  analytics_output_channel: {
    client: true,
    default: false
  },
  // Raises the AnalyticsService eager-flush watermark (the queue length that
  // triggers an immediate microtask batch flush) from 3 to 10 when ON, coalescing
  // chatty sessions into ~3x fewer eager batch RPCs. The 60s flush timer is
  // unchanged, so freshness stays bounded. Default false = current behavior.
  analytics_batch_coalesce_watermark: {
    client: true,
    default: true
  },
  browser_features_access_control: {
    client: true,
    default: false
  },
  cli_sandbox_default_enable: {
    client: true,
    default: false
  },
  cli_auto_run_hint: {
    client: true,
    default: true
  },
  "cli.hints": {
    client: true,
    default: true
  },
  "cli.rewind": {
    client: true,
    default: true
  },
  cli_debug_mode: {
    client: true,
    default: true
  },
  cli_btw_side_question: {
    client: true,
    default: true
  },
  cli_model_picker: {
    client: true,
    default: true
  },
  // Zen mode in agent-cli: compact one-line tool call rendering. When the
  // gate is on, zen defaults on and /zen-mode toggles it; when off, zen is
  // forced off and the command/setting are hidden.
  cli_zen_mode_available: {
    client: true,
    default: false
  },
  // Inline image previews in agent-cli: render attached images and successful
  // GenerateImage results as real pictures in graphics-capable terminals
  // (kitty family / iTerm2). Acts as a kill switch — defaults on and falls back
  // to the `[Image #N]` text token wherever the protocol/terminal is unsupported.
  cli_show_images: {
    client: true,
    default: true
  },
  /**
   * Read-surface gate for the team-dashboard PR-metrics widgets (PR velocity,
   * PR cycle time, merged PRs by engineer). When ON for the caller, the
   * portal dashboard fetches the three /analytics/team/pr-metrics/* endpoints
   * and the backend widgets serve real data; when OFF, the frontend skips
   * the fetch and the backend short-circuits to an empty response. ANDed
   * with `github_webhook_analytics_enabled` (the ingestion master switch) on
   * both sides, so flipping either disables the read path. Previously a
   * Statsig-only gate read by the portal; registering here per the
   * `statsig-register-experiments-in-config` workspace rule so the backend
   * `checkGate` call typechecks against `FlagName`.
   */
  pr_analytics: {
    client: true,
    default: false
  },
  /**
   * Gates the xAI Console product shell and team-link lifecycle RPCs. Transfer
   * RPCs are intentionally data-gated by the organization's active link
   * instead. When OFF, the portal hides the integration and link RPCs reject,
   * which also starves the partner callback of valid states. Standard
   * userID-style gate (email / segment rules, like org_billing_admin_role) —
   * not an organizationID idType gate; the unsigned browser callback
   * deliberately does not re-check it. `client: true` because the portal reads
   * it via useGateValue.
   */
  xai_team_link: {
    client: true,
    default: true
  },
  /**
   * The browser-hosted commerce-ui surfaces on cursor.com for the unified
   * ComPlat paywall: the native-webview routes (`/webview/paywall`,
   * `/webview/manage`) that the iOS/Android clients and Grok Bot load, and the
   * Desktop path — ON, the Free limit-hit Upgrade button routes through the
   * `xaiCommercePaywall` dashboard verb, which hands Desktop's browser to
   * /promos/grok-upgrade instead of Stripe checkout — plus the
   * `xaiCommerceBearerToken` verb those pages call for the caller's commerce
   * bearer. The sole rollout flag for these surfaces: it does not also require
   * `xai_commerce_upgrade_poc` (the one-click upgrade POC), so the rollout is
   * not coupled to that audience. Unit: userID. Portal reads it through its
   * Statsig bootstrap allowlist. sand-mobile also requires
   * `sand_mobile_xai_commerce_webview` for the access-gate paywall
   * (`client: true`). Default OFF; enable for the mobile/commerce
   * dogfooders first.
   */
  xai_commerce_webview: {
    client: true,
    default: false
  },
  /**
   * sand-mobile-only AND on `xai_commerce_webview`: swap the access-gate
   * paywall for portal `/webview/paywall`. OFF (the default) keeps the native
   * page even when the shared commerce gate is on, so mobile can roll
   * independently of Desktop / cursor.com. Unit: userID. `client: true`.
   */
  sand_mobile_xai_commerce_webview: {
    client: true,
    default: false
  },
  /**
   * Client UI for the unified xAI / Grok / Cursor SKUs on individual plans:
   * the "Weekly usage limit reached" composer notice with Buy Credits /
   * Upgrade Plan CTAs, the in-IDE Buy Credits (top-up) modal, and its add-card
   * step. The SKUs are not readable by the client yet (they will live in the
   * billing DB), so every SKU-dependent read behind this gate is a stub in
   * `IUnifiedSkuBillingService` and the gate exists to exercise the UI. Unit:
   * userID. Default OFF; enable for internal dogfooders only.
   */
  unified_sku_billing_ui: {
    client: true,
    default: false
  },
  /** Gate loading of plugins from Claude Code. When off, CC plugin load returns empty. */
  enable_cc_plugin_import: {
    client: true,
    default: true
  },
  /** Show model picker contextual nudge (blue dot). InAppAdService tracks seen state. */
  model_picker_nudge: {
    client: true,
    default: false
  },
  terminal_ide_shell_exec: {
    client: true,
    default: true
  },
  cloud_agent_origin_repos: {
    client: true,
    default: false
  },
  // Agent-launch picker: New Project. Also the Start from scratch row in the
  // Glass Projects create surfaces (dialog + full page), which retired their
  // separate Projects-only entrypoint gate to share this one. Origin mint
  // still requires cloud_agent_origin_repos + team + a non-empty
  // GetRepoNamespace.
  cloud_agent_new_project_entrypoint: {
    client: true,
    default: false
  },
  // Start from scratch repository seed format. OFF keeps the README bootstrap;
  // ON creates a root commit with an empty tree so scaffolders see an empty
  // checkout. The initial commit/ref remains required for cloud-agent launch.
  cloud_agent_new_project_empty_root_commit: {
    client: true,
    default: false
  },
  // Kill switch for the no-namespace JIT create path (web submit + Glass
  // availability). OFF = pre-JIT behavior: web bounces empty-namespace users
  // to Origin onboarding on submit, Glass shows the Origin-unavailable toast.
  // ON = submit sends an empty owner and CreateRepoAndEnsureUserNamespace
  // provisions the caller's personal namespace just in time. Flipping OFF
  // only disables this entry path; namespaces and repos already created
  // through it are unaffected.
  cloud_agent_new_project_jit_no_namespace: {
    client: true,
    default: false
  },
  // "Create repo" followup pill + tray on agents running in New Project draft
  // mode (cloud AGENT_TEMP drafts and local no-remote projects). Publishing /
  // minting still requires cloud_agent_origin_repos and Origin access.
  agent_create_repo_tray: {
    client: true,
    default: false
  },
  // Sub-gate for the Create repo tray's CLOUD arm (publishing an AGENT_TEMP
  // draft through PublishBackgroundComposerTempRepo). The split lets the
  // local arm ramp first under the master gate while cloud drafts stay
  // hidden. Ramp order for the cloud arm: (1) origin_repo_name_alias_resolve
  // at 100% — the alias read side that keeps the still-running pod's git
  // access flowing through its draft remote after the rename; then (2) this
  // gate. Named `agent_*`, not `cloud_agent_*`: the tray serves local agents
  // too.
  agent_create_repo_tray_cloud_publish: {
    client: true,
    default: false
  },
  // Gates the codebase browse Ask Cursor prototype: the in-page agent sidebar
  // on `/codebase` browse routes. It does not affect an agent's tool surface.
  codebase_browse_ask_cursor: {
    client: true,
    default: false
  },
  // Gates the whole Origin Projects board (`/codebase/<team>/<repo>/projects`):
  // the repo nav entry, the routes (404 when off), project creation, and the
  // per-project coordinator spawn. Per-owner surface; fail-closed until the
  // console gate exists and is ramped.
  enable_origin_agentic_repo_board: {
    client: true,
    default: false
  },
  // Gates symbol navigation on `/codebase` blob views (RFC: Navigate by
  // Symbol): hover an identifier for its signature, click for the definition
  // & references sidebar, served by the search-backed code-intelligence Origin
  // APIs. Revisions without available results render unchanged either way.
  codebase_browse_symbol_nav: {
    client: true,
    default: true
  },
  // Fail-closed per-user carve-out: opted-in repository pickers — the
  // automations editor repo picker and the Security Reviewer
  // (botType "security-reviewer") managed Repo scope — list every hosted
  // Origin repo, including GitHub-sourced (inbound-mirrored) ones the picker
  // policy normally hides, uncollapsed from their GitHub rows. Selection
  // persists verbatim. Read server-side (ListHostedRepos picker policy) and
  // client-side in portal-website. Unit: userID. Default OFF.
  enable_automations_show_all_mirrored_repos: {
    client: true,
    default: false
  },
  // Gates the unified-repo "Creation Provider" setting (which forge pull
  // requests are created on for repos mirrored between GitHub and Origin):
  // the dashboard setting's visibility/writes and whether the preference
  // affects PR creation and preferred-PR-host guidance. Repo pickers only
  // require cloud_agent_origin_repos for Origin to be selectable at all.
  enable_forge_source_pr_creation_setting: {
    client: true,
    default: false
  },
  // Pins the effective Creation Provider to Origin, overriding stored
  // user/team preferences. Read by the backend preference resolver (behavior)
  // and client-side by the dashboard Creation Provider cell (locks the
  // control). Only takes effect while
  // enable_forge_source_pr_creation_setting and cloud_agent_origin_repos are
  // also enabled.
  origin_dogfooding_cursor_creation_provider_override: {
    client: true,
    default: false
  },
  // Disables non-admin Origin access requests. Unit: teamID.
  origin_request_access_disabled: {
    client: true,
    default: false
  },
  // Lets non-admin team members run self-serve Codebase onboarding; read by
  // SetupTeamNamespace and the portal Get Started flow (see
  // origin/featureGate.ts). Default OFF keeps namespace creation admin-only.
  origin_non_admin_namespace_creation_allowed: {
    client: true,
    default: true
  },
  // Killswitch for relaxing Origin's direct-user-grant write gate to accept
  // members of the owning team's linked organization (not only owning-team
  // members). Off preserves the stricter team-only check exactly. Read by the
  // backend write gate (isOriginOrgMemberDirectGrantsEnabled,
  // origin/featureGate.ts) and by the portal Add People picker
  // (useOriginOrgMemberDirectGrantsEnabled) so both flip together. REPO-568.
  origin_enable_org_member_direct_grants: {
    client: true,
    default: true
  },
  enable_origin_external_collaborators: {
    client: true,
    default: true
  },
  origin_repo_collaborators_tab: {
    client: true,
    default: true
  },
  enable_origin_external_sharing: {
    client: true,
    default: true
  },
  // When on, the repository settings CloneKit tab renders and
  // ListRepoCloneKits serves. When off, the RPC answers NotFound.
  enable_clonekit_in_app: {
    client: true,
    default: false
  },
  origin_mcp: {
    client: true,
    default: false,
    requiresAuthenticatedBootstrap: true
  },
  // Keeps Origin off for Enterprise teams after origin_user_access ramps to
  // everyone. Read by isOriginAccessAllowed and the portal originVisible seed.
  enable_origin_research_preview_for_enterprises: {
    client: true,
    default: true
  },
  marketplace_origin_distribution: {
    client: true,
    default: true
  },
  // Per-user gate for the Atlas surface (generated per-directory codebase
  // maps): the read RPCs, the cold-start bootstrap, and the portal UI, which
  // reads the same gate so ungated users never issue a request the RPCs would
  // deny. Rollout starts with individual user targeting rules; ships dark.
  // Always on in dev on the backend; the portal client is not bypassed.
  atlas_enabled: {
    client: true,
    default: false
  },
  // Multi MCP Auth. MUST stay off until the contract migration drops the
  // legacy (user_id, server_url) unique index; a second slot per server
  // violates it. client: true — Sand mirrors the gate.
  mcp_multi_account: {
    client: true,
    default: true
  },
  // Cloud agents: inject interactive `mcp_auth` for unauthenticated MCP servers.
  // Automations/Slack/API sessions stay out in shouldAllowInteractiveMcpAuthForSession.
  cloud_agent_interactive_mcp_auth: {
    client: true,
    default: true
  },
  // Store the disabled state of global (non-project-managed) MCP servers in
  // profile-scoped storage shared across all workspaces and MCP services,
  // instead of per-workspace storage. Includes the one-time migration of
  // legacy workspace-scoped entries. Off keeps the legacy per-workspace
  // disabled state for all servers.
  mcp_profile_scoped_global_disabled_state: {
    client: true,
    default: true
  },
  team_mcps_in_ide: {
    client: true,
    default: false
  },
  team_mcps_in_cli: {
    client: true,
    default: false
  },
  remote_permissions_file_path_admin: {
    client: true,
    default: false
  },
  // Admin-managed shell command denylist. Initially targeted to NVIDIA via
  // the Statsig `teamID` custom ID; default-off for every other team.
  admin_command_denylist: {
    client: true,
    default: false
  },
  // Enterprise admin button that resets every member's Agent run mode to
  // Auto-review. Team-ruled (`teamID`), default-off. Read by the portal
  // client SDK and enforced by `resetTeamAgentRunModeToAutoReview`.
  admin_reset_agent_run_mode_to_auto_review: {
    client: true,
    default: false
  },
  // Recovery lever for the Admin Command Denylist. Enforcement of stored
  // rules is deliberately NOT gated on the authoring flag above (a Statsig
  // outage must not fail open), so this inverted kill switch is the only
  // remote control over enforcement: OFF — the default, an unconfigured
  // gate, or an unreachable Statsig — means enforcement is active; turn it
  // ON to suspend denylist enforcement across all surfaces without shipping
  // a client.
  admin_command_denylist_enforcement_killswitch: {
    client: true,
    default: false
  },
  restrict_team_member_invite_button: {
    client: true,
    default: false
  },
  editor_bugbot: {
    client: true,
    default: true
  },
  bugbot_autorun_killswitch: {
    client: true,
    default: false
  },
  keybinding_migration_killswitch: {
    client: true,
    default: false
  },
  agent_review_fake_dev: {
    client: true,
    default: false
  },
  enable_moved_lines_treatment: {
    client: true,
    default: false
  },
  ide_cmd_enter_submit: {
    client: true,
    default: true
  },
  ide_nal_migration: {
    client: true,
    default: false
  },
  ide_new_sidebar: {
    client: true,
    default: false
  },
  playwright_mcp_provider: {
    client: true,
    default: true
  },
  web_audit_events: {
    client: true,
    default: false
  },
  web_cloud_agent_followup_model_picker: {
    client: true,
    default: true
  },
  web_cloud_agent_new_model_picker: {
    client: true,
    default: false
  },
  // Gates landing the user directly in the new agent's run view on kickoff
  // (portal /agents composer) instead of staying on the list. Default-off.
  web_cloud_agent_kickoff_lands_in_run_view: {
    client: true,
    default: true
  },
  web_cloud_agent_external_source_attachment: {
    client: true,
    default: true
  },
  // Cloud Agents onboarding UI and its automatic environment-setup path.
  // Automatic setup also requires `generalized_env_setup`.
  enable_new_cloud_onboarding_ui_changes: {
    client: true,
    default: false
  },
  // Portal AskQuestion tray and onboarding kickoff.
  cloud_agent_portal_ask_question: {
    client: true,
    default: false
  },
  "web.show_local_source_filter": {
    client: true,
    default: false
  },
  open_agent_window_bottom_convo: {
    client: true,
    default: false
  },
  open_agent_window_top: {
    client: true,
    default: true
  },
  "glass.enable_open_agent_in_window": {
    client: true,
    default: false
  },
  cloud_agent_best_of_n_disabled: {
    client: true,
    default: false
  },
  cloud_agent_prompt_upload_presign: {
    client: true,
    default: true
  },
  search_telemetry: {
    client: true,
    default: false
  },
  scim_require_user_directory_ui: {
    client: true,
    default: false
  },
  // Exception gate (Statsig unit teamID) that re-enables creating NEW legacy
  // billing groups from the unified Members | Groups UI. Default OFF: the
  // unified surface hides "Create new billing group" for everyone. When ON for
  // a team, the create option appears in the legacy Billing Groups section, but
  // ONLY for teams that already have >=1 billing group (both the portal and the
  // createGroup RPC enforce the existing-groups requirement). Managing/updating/
  // deleting existing billing groups does not depend on this gate. Read from the
  // portal client (useGateValue) and server-side in DashboardService.createGroup.
  allow_legacy_billing_group_creation: {
    client: true,
    default: false
  },
  new_file_ux: {
    client: true,
    default: true
  },
  internal_browser_evaluate: {
    client: true,
    default: false
  },
  // Deprecated: fully launched. The VS Code client always treats this as
  // enabled; entry kept as a safety net for older clients and for the
  // packages/agent-cli surfaces that still read it.
  browser_canvas: {
    client: true,
    default: true
  },
  // Turn-catalog membership. Default OFF. Cloud agents write a canvas
  // file under the store canvases path; people open
  // /canvas/<storeId>/<canvasId>; owners share from the UI. Do not put
  // this on canvasGatingFn — a false gate would delete
  // ~/.cursor/skills-cursor/canvas/ for IDE/CLI clients. Local desktop
  // GetManagedSkills stay V1/V2 and keep writing .canvas.tsx to the
  // managed canvases/ dir.
  cloud_canvas_skill: {
    client: true,
    default: false
  },
  // Writer gate for the dedicated `WriteCanvas` / `ReadCanvas` model tools.
  // Default OFF. Independent of `cloud_canvas_skill`, which stays the
  // viewer/turn-catalog gate: this only decides whether the canvas write/read
  // tools are offered to a run. Persist (`publishCanvas`) never reads this
  // gate.
  cloud_canvas_tools: {
    client: true,
    default: false
  },
  composer_separate_shell_activity_groups: {
    client: true,
    default: false
  },
  show_grouped_edit_diff_stats: {
    client: true,
    default: false
  },
  composer_end_of_turn_summary: {
    client: true,
    default: false
  },
  allowlist_toggle_menu: {
    client: true,
    default: true
  },
  slim_codeblock_render: {
    client: true,
    default: true
  },
  compact_terminal: {
    client: true,
    default: true
  },
  sand_android_iap_enabled: {
    client: true,
    default: true
  },
  composer_sandbox_settings_visible: {
    client: true,
    default: true
  },
  sandbox_force_disable_win32: {
    client: true,
    default: true
  },
  admin_network_controls: {
    client: true,
    default: true
  },
  mcp_access_network_allowlist: {
    client: true,
    default: false
  },
  // Lets team admins authenticate and discover live URL MCP tools while
  // configuring a Specific Tools policy in the portal.
  mcp_admin_tool_discovery: {
    client: true,
    default: true
  },
  mcp_admin_only_servers: {
    client: true,
    default: false
  },
  mcp_admin_only_tools: {
    client: true,
    default: false
  },
  sandbox_mcp_servers: {
    client: true,
    default: false
  },
  // Client/IDE Agent Read Access (user-local System/Workspace + allowlist).
  // Off also rolls back native Workspace isolation: sandbox policy JSON is
  // forced to System in getEffectiveSandboxReadBoundary / buildNativeSandboxPolicy.
  sandbox_read_control_portal: {
    client: true,
    default: false
  },
  // Team-admin Agent Read Access in the dashboard. Off = panel hidden and
  // admin-settings won't persist the team boundary (client can still ship).
  sandbox_read_control_portal_ui: {
    client: true,
    default: false
  },
  mcp_network_allowlist: {
    client: true,
    default: false
  },
  mcp_settings_overhaul: {
    client: true,
    default: true
  },
  mcp_settings_overhaul_portal: {
    client: true,
    default: true
  },
  // Team allowlist for EXTY-1383. Default OFF fails closed. When on, only
  // user-extended stdio MCP servers spawned on win32 skip the sandbox.
  // Admin-configured sandboxed MCPs still fail if the sandbox is unavailable.
  // Target with custom.teamID in Statsig; do not flip public / percentage.
  mcp_user_extension_stdio_unsandboxed_win32: {
    client: true,
    default: false
  },
  mcp_tool_allowlist_modes: {
    client: true,
    default: true
  },
  cloud_agent_environment_mcp_allowlist: {
    client: true,
    default: false
  },
  cloud_agent_environment_mcp_allowlist_ui: {
    client: true,
    default: false
  },
  // Cloud Agent Keyrings portal UI. Rolled out separately from the RPCs.
  cloud_agent_keyring_ui: {
    client: true,
    default: false
  },
  cursor_rules_batch_update: {
    client: true,
    default: true
  },
  agent_skills_batch_update: {
    client: true,
    default: true
  },
  mcp_structured_logging: {
    client: true,
    default: false
  },
  mcp_runtime_dedupe: {
    client: true,
    default: false
  },
  dedupe_mcp_servers: {
    client: true,
    default: true
  },
  mcp_oauth_unsafe_redirect_logging: {
    client: true,
    default: false
  },
  proper_well_known_for_mcp_scopes: {
    client: true,
    default: true
  },
  // Deprecated: fully launched. The VS Code client always treats this as
  // enabled; entry kept as a safety net for older clients.
  context_visualizer: {
    client: true,
    default: true
  },
  context_usage_canvas: {
    client: true,
    default: false
  },
  browser_mcp_chip: {
    client: true,
    default: true
  },
  /**
   * Client-side rollout gate for local computer use (macOS and Windows). The
   * client registers the Computer Use MCP provider only when this gate is on
   * and a local sidecar is installed. Server side, `disable_local_computer_use`
   * is the veto.
   *
   * Renamed from `mac_computer_use` when the Windows named-pipe backend
   * landed; the gate is still default-off, so the rename is a fresh rollout
   * rather than a migration of an exposed population.
   */
  local_computer_use: {
    client: true,
    default: false
  },
  /** Existing macOS dogfood gate, retained until local_computer_use is live. */
  mac_computer_use: {
    client: true,
    default: false
  },
  /**
   * Lists the Windows Computer Use `computer_batch` tool (several planned
   * actions in one call, one end frame) to the model. Read by the client at
   * each tool listing, never at activation; the tool itself is registered
   * whenever the Windows sidecar is, so a batch the model was shown runs.
   * Default off: the descriptor costs ≈2.1 KB of the 12 KB inline listing
   * budget, which the Windows listing does not have head room for yet.
   */
  windows_computer_use_batch: {
    client: true,
    default: false
  },
  playwright_autorun: {
    client: true,
    default: true
  },
  allow_download_prompts: {
    client: true,
    default: false
  },
  // Mid-run context injection (steering): client gate for the Steer /
  // Follow-up queue UI and admission; the server side checks the same gate.
  // See docs/rfcs/RFC-agent-active-context-injection.md.
  agent_context_injection: {
    client: true,
    default: true
  },
  /**
   * Shows the Team store root on the Glass Project Context tab and the
   * matching file-tab store forest. Off by default until Team has admin
   * controls. Does not gate cloud mounts: TEAM still auto-mounts when
   * `agent_store_principal_auto_mount` is on, and the prompt inventory
   * already omits TEAM.
   */
  project_agent_team_store: {
    client: true,
    default: false
  },
  // Independent client rollout control for auto-promoting active local root
  // Project follow-ups through the existing context-injection transport.
  project_followups_use_steering: {
    client: true,
    default: false
  },
  cloud_agent_docker_build_secrets_enabled: {
    client: true,
    default: true
  },
  clone_blob_upload: {
    client: true,
    default: true
  },
  internal_session_recording_status_bar: {
    client: true,
    default: false
  },
  // Routes Gemini video attachments through the presigned-PUT signed-URL
  // path (server-side mints S3 URL + uploads, IDE/Glass later moves to
  // direct PUT) instead of inline base64 in the agent request body. Off
  // by default until the Glass-side IDE-direct uploader lands; flipping
  // this gate today only changes where the bytes hit S3, not the 50MB
  // Fastify request-body ceiling.
  agent_video_signed_url_uploads: {
    // Read on the client too: the IDE/Glass video-attach send path branches
    // between inline bytes and the signed-URL PUT flow based on this gate.
    client: true,
    default: false
  },
  // Routes built-in Gemini video subagents through the Developer API Files
  // path, including the larger signed-URL attachment limit and Cursor's
  // Google AI Studio credential. Keep disabled until the backend and client
  // changes have landed.
  gemini_video_developer_api: {
    client: true,
    default: true
  },
  nal_task_tool: {
    client: true,
    default: true
  },
  explore_subagent: {
    client: true,
    default: true
  },
  enable_watch_video_in_ide: {
    client: true,
    default: true
  },
  shell_subagent: {
    client: true,
    default: true
  },
  enable_build_with_swarm: {
    client: true,
    default: false
  },
  explicit_subagent_models: {
    client: true,
    default: false
  },
  nal_trace: {
    client: true,
    default: false
  },
  ask_question_all_modes: {
    client: true,
    default: true
  },
  disable_terminal_output_ui_streaming: {
    client: true,
    default: false
  },
  generate_user_instructions: {
    client: true,
    default: false
  },
  ide_nal_rdv: {
    client: true,
    default: false
  },
  use_nlb_for_nal: {
    client: true,
    default: true
  },
  "use-usw1-agent-for-nal": {
    client: true,
    default: false
  },
  retry_interceptor_disabled: {
    client: true,
    default: false
  },
  retry_interceptor_enabled_for_streaming: {
    client: true,
    default: true
  },
  bidi_append_fix: {
    client: true,
    default: true
  },
  bidi_append_binary_encoding: {
    client: true,
    default: false
  },
  http1_keepalive_disabled: {
    client: true,
    default: false
  },
  ws_reachability_probe: {
    client: true,
    default: true
  },
  ws_dark_durability_probe: {
    client: true,
    default: false
  },
  large_proto_logging_enabled: {
    client: true,
    default: false
  },
  // Throttles the client structured-log uploader (AnalyticsService.submitLogs):
  // when ON, chatty windows batch to a 150-entry high watermark and backgrounded
  // (unfocused) windows flush every 60s instead of 3s. Default OFF keeps the
  // legacy ~3s/10-entry cadence so the fleet stays on the safe path until this
  // is rolled out in Statsig. Read from the shared cursor-network path used by
  // both Glass and the classic IDE.
  submitlogs_flush_throttle: {
    client: true,
    default: true
  },
  // Client rollout for slowing BackgroundComposerService listBackgroundComposers
  // polling while the window is unfocused. Default OFF is byte-for-byte the
  // current always-on adaptive 10s/60s/5min schedule.
  background_composer_list_focus_aware_poll: {
    client: true,
    default: true
  },
  // Internal-only access to the Agent SDK framework (packages/agent-serve,
  // published as @cursor/july). Default off = fail closed; target internal
  // teams in the Statsig console.
  agentkit_enabled: {
    client: true,
    default: false
  },
  agent_slack_bot_member_install: {
    client: true,
    default: false
  },
  // Rollout gate for Agent SDK v2 dashboard visibility and deploys.
  // Team targeting lives in Statsig. Multi-tenant HTTP deploy stays
  // Anysphere-only in the control plane.
  agent_sdk_v2: {
    client: true,
    default: false
  },
  enterprise_early_access: {
    client: true,
    default: false
  },
  // Gates per-model control within a BYOK provider section of the v2 model
  // allowlist (ENT-2904). When on, an admin who enables a BYOK section (e.g.
  // AWS Bedrock) can additionally restrict it to specific model identifiers via
  // `ModelAllowlistByokEntry.models`; the backend enforces that list in
  // `checkByokBlockedByAllowlist` and the dashboard surfaces the per-model
  // controls. When off (default), the `models` list is ignored and only the
  // section-level `enabled` toggle governs — the original all-or-nothing
  // behavior. `client: true` because the dashboard reads it via `useGateValue`
  // to show/hide the per-model controls. Default off to ramp via Statsig.
  use_byok_allowlist: {
    client: true,
    default: true
  },
  show_prerelease_release_track: {
    client: true,
    default: false
  },
  show_dogfood_release_track: {
    client: true,
    default: false
  },
  client_numeric_metrics: {
    client: true,
    default: true
  },
  /**
   * Master switch for desktop and Glass managed-cloud outage banners. When
   * false, clients skip Statuspage polling and hide outage trays. The portal
   * website still reads `portal_outage_alert` independently.
   */
  client_outage_banners: {
    client: true,
    default: false
  },
  solidjs_total_observers_metric: {
    client: true,
    default: false
  },
  renderer_heap_metrics: {
    client: true,
    default: false
  },
  /**
   * Enables the Glass React commit-churn collector's fiber walk and aggregate
   * event. The DevTools hook shim installs regardless of this gate, so the
   * rollout percentage doubles as the collector's sampling rate. Default off.
   */
  glass_react_commit_churn: {
    client: true,
    default: false
  },
  sand_renderer_heap_metrics: {
    client: true,
    default: false
  },
  collect_sample_for_unresponsive_ext_host: {
    client: true,
    default: false
  },
  unresponsive_ext_host_enhanced_attachments: {
    client: true,
    default: false
  },
  worktree_nal_only: {
    client: true,
    default: true
  },
  glass_precompute_diff_tokenization: {
    client: true,
    default: false
  },
  review_changes_fast_multi_diff: {
    client: true,
    default: false
  },
  cpp_perf_instrumentation: {
    client: true,
    default: true
  },
  hide_titlebar_default: {
    client: true,
    default: false
  },
  migrate_editor_mode: {
    client: true,
    default: true
  },
  show_dev_only_ttft_warning: {
    client: true,
    default: false
  },
  // Sole rollout gate for the review-CTA funnel: the Editor post-commit review
  // CTA (`first_commit_review_cta`) and the post-review Bugbot CTA
  // (`bugbot_github_pr_cta` / `glass_post_review_bugbot_cta` ads) on Glass and
  // Editor surfaces.
  // Server-checked in getCurrentInAppAd; replaces the retired experiment of
  // the same name and supersedes the former `first_commit_review_cta` gate
  // (Greg's allowlist-only rollout) and the never-created
  // `bugbot_github_pr_cta` gate.
  glass_local_review_first_bugbot_cta: {
    client: true,
    default: true
  },
  // Routes the Editor post-commit "Review my code" CTA through the managed
  // /review-bugbot skill. Off preserves the existing Agent Review flow.
  editor_review_cta_uses_review_bugbot: {
    client: true,
    default: false
  },
  // Emergency off switch for the always-on local-commit reflog watcher in
  // cursor-retrieval (`localCommitSignal.ts`), the producer for the post-commit
  // review CTA. Enabling it stops watcher registration on new windows and
  // suppresses `gitCommitWasRun` signals on live ones; worst case the CTA
  // simply never shows.
  local_commit_reflog_signal_killswitch: {
    client: true,
    default: false
  },
  /**
   * Cloud Agents: turn on progressive paged loading of GitLab installation
   * repos for the dashboard repo picker (per-page backend fetch + portal-side
   * `fetchNextPage` loop). Default off; flip per-team starting with large
   * GitLab Enterprise orgs (NVIDIA — see ASYNC-2148). Both backend and
   * frontend branches gate-check, so an off gate is a true no-op.
   */
  gitlab_progressive_repo_load_v1: {
    client: true,
    default: false
  },
  /**
   * Cloud Agents: turn on server-side repository search in the dashboard repo
   * picker (`SharedRepositoryPicker`). When on, typing in the picker's search
   * box fans the paginated `getInstallationRepos` RPC with the `search` term
   * across installations and merges the matches into the candidate list, so
   * users can find repos that haven't been loaded yet (e.g. a repo on page 40
   * of a multi-thousand-repo Azure DevOps org) without waiting for the full
   * list to load. Default off; the picker falls back to client-side filtering
   * of already-loaded repos when off, so an off gate is a true no-op. Roll out
   * per-team starting with large ADO / GitLab orgs (CSG).
   *
   * Caveat — this gate is provider-agnostic: when on it also makes the team's
   * GitHub picker search-first (page-1 + server search instead of load-all) and
   * fires a backend repo fetch per GitHub search keystroke. That is a no-op for
   * single-provider GitLab/ADO teams (the rollout targets — Agoda, Rivian, CSG)
   * because they have no GitHub installations to expand. Only flip it for a
   * mixed-provider team if they don't rely on GitHub scroll-to-find; otherwise
   * scope the load-stop to GitLab/ADO first (see PR #131859 discussion).
   */
  repo_picker_server_side_search_v1: {
    client: true,
    default: false
  },
  /**
   * Cloud Agents: search-first Azure DevOps repo picker. When on, the portal
   * warms each ADO installation by paging `getInstallationRepos` until
   * `hasMore: false`, persists the walk to IndexedDB (TTL + resume cursor)
   * so later sessions hydrate from disk, and stops listing ADO repos inline
   * in the repo dropdown — searches answer from the warmed local list
   * (capped at 100), with server-side search as the zero-local-results
   * fallback for repos created after the cached walk. Default off; flip
   * per-team starting with large ADO orgs. Disabling restores the legacy
   * fetch-all behavior, so an off gate is a true no-op.
   */
  azure_devops_progressive_repo_load_v1: {
    client: true,
    default: true
  },
  /**
   * Bugbot: controls whether Azure DevOps appears in Bugbot-specific settings
   * surfaces. Keep default off until ADO Bugbot webhooks/settings are ready; the
   * general Azure DevOps integration remains visible for Cloud Agents and
   * codebase-context use.
   */
  bugbot_azure_devops_settings: {
    client: true,
    default: true
  },
  meta_mcp_tool: {
    client: true,
    default: false
  },
  // Carry MCP tool input schemas as flat JSON strings (input_schema_json)
  // instead of recursive google.protobuf.Value trees in request context,
  // avoiding deep protobuf serialization stacks on the renderer main thread.
  mcp_input_schema_json: {
    client: true,
    default: true
  },
  ai_connect_stream_encode_yield: {
    client: true,
    default: false
  },
  ai_connect_stream_decode_yield: {
    client: true,
    default: false
  },
  // Forward AI stream chunks across the extension-host boundary as raw
  // protobuf envelope bytes (encode once, decode once) instead of the legacy
  // parse -> re-encode -> re-parse double codec. Resolved once per stream.
  ai_connect_stream_raw_bytes: {
    client: true,
    default: false
  },
  // Slim MCP meta-tool descriptors in request context: send only server
  // metadata plus tool names (no per-tool descriptions or input schemas).
  // Prompt construction and CallMcpTool routing only need names; GetMcpTools
  // fetches full definitions live via McpStateExecutor at discovery time.
  mcp_meta_tool_slim_descriptors: {
    client: true,
    default: true
  },
  // Single gate for local-conversation event subscriptions: the client MCP
  // surface, the backend RPCs, subscription creation, and LOCAL dispatch.
  local_agent_event_subscriptions: {
    client: true,
    default: true
  },
  web_cloud_agent_conversation_quick_access_rail: {
    client: true,
    default: false
  },
  mcp_direct_client_tool_fetch: {
    client: true,
    default: false
  },
  mcp_always_expose_auth_tool: {
    client: true,
    default: false
  },
  glass_mcp_app_focus_on_type_guard: {
    client: true,
    default: true
  },
  shared_chats: {
    client: true,
    default: false
  },
  shared_canvases: {
    client: true,
    default: true
  },
  share_transcripts_include_plan: {
    client: true,
    default: false
  },
  shared_transcripts_bulk_download: {
    client: true,
    default: false
  },
  use_ide_browser_script: {
    client: true,
    default: false
  },
  plan_mode_build_in_cloud: {
    client: true,
    default: true
  },
  expose_babysit_pr_cloud_entrypoint: {
    client: true,
    default: false
  },
  expose_branch_mismatch_continue_in_cloud_entrypoint: {
    client: true,
    default: false
  },
  expose_plan_build_in_cloud_entrypoint: {
    client: true,
    default: false
  },
  new_plan_editor: {
    client: true,
    default: true
  },
  ai_code_tracking_format_detection: {
    client: true,
    default: true
  },
  ai_code_tracking_v2_scoring: {
    client: true,
    default: true
  },
  ai_code_tracking_assume_all_commits_ai: {
    client: true,
    default: false
  },
  ai_code_tracking_use_commit_timestamp_for_tracking_start: {
    client: true,
    default: false
  },
  ai_code_tracking_git_operations_binding_fix: {
    client: true,
    default: false
  },
  ai_code_tracking_extension_backend: {
    client: true,
    default: false
  },
  /** Per-user Slack default-worker rules (repo -> My Machines worker): launch-path injection, the `@Cursor worker` management command, and the dashboard "Default Workers" section (client-read for the portal UI gate). */
  cloud_agent_slack_default_worker: {
    client: true,
    default: false
  },
  /**
   * Kill switch for the contextual Grok Bot banner. When on, the client stops
   * before scoring the prompt, so no keyword match, Sand access fetch, cadence
   * read, or experiment exposure happens on any keystroke. Separate from the
   * `grok_bot_contextual_banner` experiment so it can be flipped without
   * touching the experiment's allocation or its metrics.
   */
  grok_bot_contextual_banner_killswitch: {
    client: true,
    default: false
  },
  enable_cloud_agent_timings: {
    client: true,
    default: false
  },
  subagent_support_interrupt: {
    client: true,
    default: true
  },
  web_cloud_agent_environment_defaults: {
    client: true,
    default: false
  },
  web_cloud_agent_no_repo_entrypoint: {
    client: true,
    default: false
  },
  agent_store_dashboard: {
    client: true,
    default: false
  },
  /**
   * Dashboard agent-store undelete: surfaces tombstoned (soft-deleted) files
   * in ListAgentStoreEntries and enables the UndeleteAgentStoreFiles RPC that
   * restores a tombstoned file's pre-delete S3 version. Client-readable so
   * the dashboard can render the "Recently deleted" section with its Restore
   * action. Restores only succeed while the agent-stores bucket's
   * noncurrent-version retention still holds the pre-delete version.
   */
  agent_store_undelete: {
    client: true,
    default: false
  },
  // Gates @ Past Chat / @bcId attachment for cloud agents. Backend attaches
  // selected past-chat traces; Glass/portal hide the Past Chats picker when off.
  cloud_agent_bc_id_attachment: {
    client: true,
    default: false
  },
  cloud_persistent_terminals: {
    client: true,
    default: true
  },
  cloud_glass_shared_sessions: {
    client: true,
    default: false
  },
  shared_terminal_env_setup: {
    client: true,
    default: false
  },
  instant_grep_indexing: {
    client: true,
    default: false
  },
  cli_instant_grep_indexing: {
    client: true,
    default: false
  },
  push_git_tracked_state_exp: {
    client: true,
    default: true
  },
  instant_grep_user_search: {
    client: true,
    default: false
  },
  parallel_agent_workflow: {
    client: true,
    default: false
  },
  enable_multitask_mode: {
    client: true,
    default: true
  },
  // Route side-chat workspace and machine operations through the machine owner.
  // Off preserves per-chat workspace identity.
  cloud_guest_chats_no_workspace: {
    client: true,
    default: false
  },
  glass_subagent_followups: {
    client: true,
    default: false
  },
  // Gates skill-backed custom mode UI and reminder injection.
  glass_custom_modes: {
    client: true,
    default: false
  },
  cloud_custom_modes: {
    client: true,
    default: false
  },
  hide_async_subagent_task_notifications: {
    client: true,
    default: true
  },
  // Per-message sender attribution on cloud agent conversations in the
  // portal: renders the triggering user's name on human messages whose
  // sender differs from the viewer. Off (the default) keeps the pre-existing
  // unattributed message cards.
  cloud_agent_message_sender_attribution: {
    client: true,
    default: true
  },
  glass_subagent_tray_done_section: {
    client: true,
    default: false
  },
  enable_await_for_subagents: {
    client: true,
    default: false
  },
  fix_claude_subagent_await: {
    client: true,
    default: true
  },
  // Extends the SEV-1252 AwaitShell subagent-wait mitigation to Grok 4.6,
  // which vacuously slept on AwaitShell instead of ending its turn to collect
  // background Task subagent results (same failure mode Fable had).
  fix_grok_subagent_await: {
    client: true,
    default: true
  },
  public_leaderboard_web: {
    client: true,
    default: false
  },
  enable_cloud_agent_repo_selector: {
    client: true,
    default: false
  },
  route_ent_trial_to_model: {
    client: true,
    default: false
  },
  debug_mode_autorun_support_enabled: {
    client: true,
    default: false
  },
  analytics_conversation_classification: {
    client: true,
    default: false
  },
  use_cursor_github_app_id: {
    client: true,
    default: true
  },
  // Deprecated: legacy gate for early push-to-cloud UI.
  // Replaced by: send_to_cloud_on_followup, midturn_move_to_cloud_ads.
  push_local_agent_to_cloud: {
    client: true,
    default: false
  },
  send_to_cloud_on_followup: {
    client: true,
    default: false
  },
  midturn_move_to_cloud_ads: {
    client: true,
    default: false
  },
  cloud_agent_checkout_convert_to_local: {
    client: true,
    default: false
  },
  show_browser_popup: {
    client: true,
    default: false
  },
  agent_layout_show_diffs_quick_settings: {
    client: true,
    default: false
  },
  skip_git_telemetry_computations: {
    client: true,
    default: false
  },
  // Limits the throttling disable to remote workspaces so local turns retain Electron background throttling.
  composer_background_throttling_remote_only: {
    client: true,
    default: false
  },
  composer_gc_handles: {
    client: true,
    default: true
  },
  // RETIRED FROM CODE: structural byte walks deleted from the client
  // (#204626 / RendererBlocked on cyclic graphs from #203007). No code
  // reads this gate; keep the registration until the Statsig console gate
  // is archived. Do not re-enable.
  composer_retention_structural_byte_metrics: {
    client: true,
    default: false
  },
  // Incremental (grammar-state) tokenization for streaming transcript code
  // blocks via the VS Code TextMate tokenizer (Glass only).
  tokenize_stream_code_blocks: {
    client: true,
    default: true
  },
  composer_react_transcript_working_indicator: {
    client: true,
    default: false
  },
  // Transcript renders a mid-run steer directly below the last visible reply
  // (or the user message) with the interrupted work folded below it, instead
  // of at its stored delivery position. Presentation only; stored order is
  // unchanged either way.
  composer_transcript_steer_float_up: {
    client: true,
    default: false
  },
  // Renders <cursor-content kind="visualization"> tags in the composer
  // transcript as sandboxed inline visualizations. Default OFF until the
  // Statsig gate ramps.
  inline_visualizations: {
    client: true,
    default: false
  },
  diff_tab_viewport_virtualization: {
    client: true,
    default: false
  },
  private_cloud_workers: {
    client: true,
    default: false
  },
  allow_shared_private_worker_assignment: {
    client: true,
    default: true
  },
  private_workers_label_filtering: {
    client: true,
    default: false
  },
  skip_github_app_for_private_worker: {
    client: true,
    default: false
  },
  update_use_localhost: {
    client: true,
    default: false
  },
  hide_inline_changed_files: {
    client: true,
    default: false
  },
  wysiwyg_markdown_default: {
    client: true,
    default: false
  },
  markdown_embedded_project_databases: {
    client: true,
    default: false
  },
  skill_icon_color: {
    client: true,
    default: false
  },
  opt_devs_into_experimental_model_toggle: {
    client: true,
    default: false
  },
  default_on_chat_editors: {
    client: true,
    default: false
  },
  /**
   * Internal Anysphere: default tsgo on for engineers who have not previously
   * installed native-preview. When on, installs `typescriptteam.native-preview`
   * when missing and sets `js/ts.experimental.useTsgo` at user scope. Scoped
   * to team 1 in Statsig; client also guards with `isAnysphereUser()`.
   */
  default_tsgo_internal: {
    client: true,
    default: false
  },
  // CLI-to-desktop thread messaging bridge (internal rollout).
  desktop_bridge: {
    client: true,
    default: false
  },
  disable_no_title_bar: {
    client: true,
    default: false
  },
  show_debug_aux_pane_border: {
    client: true,
    default: false
  },
  // Glass typography refresh. Client-only styling gate; default off so control
  // renders today's typography. When on: (1) compressed chat markdown heading
  // scale in the React transcript only (h1 down to today's h2 size,
  // smooth gradient, em-based vertical rhythm), and (2) app-wide de-washed
  // full-opacity primary text color.
  glass_typography_refresh: {
    client: true,
    default: true
  },
  browser_subagent: {
    client: true,
    default: true
  },
  browser_subagent_gating: {
    client: true,
    default: false
  },
  browser_cpp_telemetry: {
    client: true,
    default: true
  },
  network_access_control: {
    client: true,
    default: true
  },
  git_snapshot_indexing: {
    client: true,
    default: true
  },
  cpp_telem_chunking: {
    client: true,
    default: true
    // Default: no chunking (original behavior)
  },
  // Deprecated: fully launched. The VS Code client always treats this as
  // enabled; entry kept as a safety net for older clients.
  marketplaces_enabled: {
    client: true,
    default: true
  },
  customize_page: {
    client: true,
    default: false
  },
  customize_page_leaderboard_enabled: {
    client: true,
    default: false
  },
  customize_manage_scope_multiselect: {
    client: true,
    default: true
  },
  customize_global_search: {
    client: true,
    default: true
  },
  customize_plugin_detail_mcp_management: {
    client: true,
    default: false
  },
  web_agent_pilled_page: {
    client: true,
    default: false
  },
  team_marketplace_mcps: {
    client: true,
    default: true
  },
  /**
   * Gates the Customize "Publish Skill" and "Unpublish Skill" row actions.
   * Publish packs a personal `~/.cursor/skills` skill, publishes it to the team
   * marketplace via `DashboardService.PublishPlugin`, and trashes the local copy
   * once the published commit is confirmed loaded from the plugin cache;
   * unpublish restores the skill to `~/.cursor/skills` and deletes that plugin.
   * Off means the skill row's overflow menu offers neither, so nothing
   * client-side can reach either RPC. The two share one gate so it can never
   * leave someone with a published skill and no way to take it back.
   */
  publish_user_skills: {
    client: true,
    default: true
  },
  /**
   * Treat the already-mounted user Agent Store's `skills/` dir as a skill
   * discovery root, and (later) offer to move a `~/.cursor/skills` skill into
   * it. Gates no mount and no access check: the mount it reads is the one
   * `agent_store_principal_local_mounts` already provides, at the source id
   * `buildUserAgentStoreSourceId` already produces. Off means there is no store
   * skills root, which is today's behavior, so it fails closed.
   */
  private_skills_user_store: {
    client: true,
    default: false
  },
  /**
   * Portal Edit MCP unification: when on, marketplace / picker / dashboard
   * edit flows use PluginAwareMcpServerModal (free vs configure-variables vs
   * read-only managed). When off, keep EditMcpFormView / McpServerModal with
   * isPluginManaged locking.
   */
  plugin_aware_mcp_edit_modal: {
    client: true,
    default: true
  },
  plugin_marketplace_allowlisted_publisher: {
    client: true,
    default: false
  },
  prompt_suggestion: {
    client: true,
    default: false
  },
  extension_signature_verification: {
    client: true,
    default: false
  },
  extension_gallery_query_chunking: {
    client: true,
    default: false
  },
  subagents_client_side_vscode: {
    client: true,
    default: true
  },
  // Sampling gate for MCP coalesce/throttle/debounce metrics.
  // Controls whether clients emit detailed mcp.coalescer.*, mcp.refresh_caches,
  // and mcp.instructions_for_composer metrics. Use rollout % to control volume.
  mcp_coalesce_metrics_sampling: {
    client: true,
    default: false
  },
  mcp_shared_process_transports: {
    client: true,
    default: false
  },
  // Per-box kill switch for the in-box egress tunnel: when on for the box owner,
  // the backend exposes the tunnel port and stamps the enable/bearer env so the
  // in-pod supervisor launches sand-egress-tunnel (workload egress can then exit
  // through an authenticated client, fail-open when none). Default off; the box
  // is byte-for-byte unchanged when off. client:true so the Sand desktop can read
  // it to gate the Beta-tab "route egress through this desktop" toggle (the box
  // is still stamped server-side, keyed to the owner, in sandBoxServer.ts).
  sand_box_egress_tunnel: {
    client: true,
    default: true
  },
  task_card_tips_enabled: {
    client: true,
    default: false
  },
  // Controls whether Codebase Telemetry V2 is enabled on the client.
  codebase_telemetry_v2: {
    client: true,
    default: true
  },
  // Controls whether Git history capture is enabled in Codebase Telemetry V2.
  codebase_telemetry_v2_git_history: {
    client: true,
    default: true
  },
  // Controls whether agent dotdirs other than `~/.cursor` are included
  // by Codebase Telemetry V2.
  codebase_telemetry_v2_agent_dot_dirs: {
    client: true,
    default: true
  },
  // Controls whether clients enforce codebase telemetry protection decisions.
  codebase_protection_client_enforcement: {
    client: true,
    default: false
  },
  // Controls client-side codebase sightings independently of telemetry admission.
  codebase_protection_reporting: {
    client: true,
    default: false
  },
  // Gates the gradual deprecation of Codebase Telemetry V1.
  codebase_telemetry_v1_deprecation: {
    client: true,
    default: true
  },
  // Gates Codebase Telemetry in the Sand host.
  sand_codebase_telemetry: {
    client: true,
    default: true
  },
  // Gates Orbit in the Sand host.
  sand_orbit: {
    client: true,
    default: false
  },
  // Kill switch for client-side codebase index building. When ON, the client
  // sends `x-codebase-indexing-enabled: false` on the indexing RPCs for ALL
  // users (semantic indexers included), so the server skips building/updating a
  // queryable Turbopuffer index while the client keeps syncing and emitting
  // training telemetry. Hides only semantic-index UI in IndexingView — do not
  // hide the Indexing & Docs settings tab (Docs / .cursorignore stay reachable).
  // Default OFF (indexing on); the client fails open so a Statsig outage never
  // silently disables indexing.
  disable_codebase_indexing: {
    client: true,
    default: true
  },
  // Client kill switch to hide @Docs mentions/settings ahead of deprecation.
  // Pair with disable_docs_server_usage for the backend turbopuffer no-op.
  // Default OFF so docs stay available until we intentionally disable them.
  disable_docs_client_usage: {
    client: true,
    default: true
  },
  composer_promo_expiration_reminder: {
    client: true,
    default: true
  },
  enable_plugin_nudge: {
    client: true,
    default: false
  },
  import_3p_plugins: {
    client: true,
    default: true
  },
  enable_local_3p_plugin_imports: {
    client: true,
    default: true
  },
  enable_new_team_member_usage_boost: {
    client: true,
    default: true
  },
  disable_push_request_context: {
    client: true,
    default: false
  },
  // Merged-PR scan ("we found a bug you merged" upsell). Master gate defaults
  // off; force-dry-run and circuit-breaker default on so the first enabled
  // ticks cannot send email until both are explicitly configured in Statsig.
  bugbot_merged_pr_scan: {
    client: true,
    default: true
  },
  windows_linux_update_auth_headers: {
    client: true,
    default: false
  },
  updater_recovery_windows: {
    client: true,
    default: true
  },
  glass_focus_outline: {
    client: true,
    default: false
  },
  glass_inline_assistant_turn_actions_bar: {
    client: true,
    default: true
  },
  // Skips the synchronous whole-file LCS diff that `addDecorationsOnlyDiff`
  // runs per streamed file change in Glass, where inline diff decorations are
  // always suppressed. The diff is computed on the first read instead.
  inline_diff_defer_hidden_diff_state: {
    client: true,
    default: false
  },
  // Parks persisted composer inline diffs at boot instead of eagerly pinning a
  // text model per stored diff, and caps the persisted backlog at load.
  // Restores happen inside accept/reject. Off = the old eager-restore behavior.
  park_inline_diffs: {
    client: true,
    default: false
  },
  enable_marketplace_plugin_logging: {
    client: true,
    default: true
  },
  // Rollout of sparse partial clones + subprocess kill budgets for plugin
  // repos, so plugins in large monorepos install without hitting the legacy
  // 30s full-clone timeout. See @anysphere/cursor-plugins.
  enable_sparse_plugin_clones: {
    client: true,
    default: true
  },
  /**
   * Kill-switch for running cursor-always-local in glass agent workspaces
   * (PR #89691). When ON, cursor-always-local loads in glass non-BC agent
   * workspaces (SSH remotes, devboxes) via the shared connect transport.
   * When OFF, the extension only loads in the glass root workspace — the
   * pre-PR behavior.
   */
  glass_always_local_agent_workspace: {
    client: true,
    default: true
  },
  /**
   * When ON, Glass local agent workspaces do not automatically start codebase
   * indexing. Explicit Compute/Sync index requests remain available.
   */
  glass_disable_eager_indexing_for_local_sessions: {
    client: true,
    default: false
  },
  /**
   * Kill-switch for allowlisting mechatroner.rainbow-csv in Glass root and
   * agent workspaces. When OFF, rainbow-csv remains filtered out.
   */
  glass_rainbow_csv_extension: {
    client: true,
    default: false
  },
  retry_hydration_optimization: {
    client: true,
    default: false
  },
  full_self_driving: {
    client: true,
    default: false
  },
  /**
   * Suggestions-platform write exposure for LOCAL / desktop composer agents:
   * the signed-in Cursor client registers the in-process `suggestions` MCP
   * provider (`record_pr_scoped_suggestion` / `list_pr_scoped_suggestions`)
   * that calls the PR-scoped `FullSelfDrivingService` RPCs with the user's
   * session (`vscode/src/vs/glass/browser/fsd/mcp/
   * glass-suggestions-platform-mcp.contribution.ts`), so `client: true`.
   * Server-side, the same gate selects the `local_agent_mcp` record surface
   * for producer `local_agent` (Always Apply enforce-on-record is skipped;
   * cards land OPEN in the tray), mirroring the cloud
   * `fsd_suggestions_platform_write_mcp` surface. Off ≡ pre-platform
   * behavior: no tools attach in the client and producer `local_agent`
   * records behave like any other external RPC producer. Stacked on
   * `fsd_pr_scoped_suggestions` (the store gate must be on for the same
   * users or every attached tool call refuses). Default-off; create the
   * gate in Statsig before enabling (scripts/create-statsig-gate.sh
   * fsd_suggestions_platform_local_mcp), then roll out
   * `fsd_dogfooders`@100% / everyone@0%.
   */
  fsd_suggestions_platform_local_mcp: {
    client: true,
    default: false
  },
  full_self_driving_glass: {
    client: true,
    default: false
  },
  full_self_driving_glass_pr_tab: {
    client: true,
    default: false
  },
  shutdown_hang_watchdog_darwin_sigkill: {
    client: true,
    default: true
  },
  cursor_shared_session_file_watcher: {
    client: true,
    default: false
  },
  cursor_update_supervisor: {
    client: true,
    default: false
  },
  cursor_private_inference_download_prompt: {
    client: true,
    default: false
  },
  cursor_cli_private_inference_download_prompt: {
    client: true,
    default: false
  },
  disable_sqlite_storage_backup: {
    client: true,
    default: true
  },
  /**
   * Client-driven Agent Store surfaces: the IDE / local CLI sync runtimes,
   * backend RPC enablement for those non-credentialed callers
   * (`isAgentStoreBackendEnabled`), and the cloud prompt's mounted-store
   * block. Deliberately NOT composed into private-worker sync
   * (`agent_store_sync_private_worker`) or cloud in-pod FUSE delivery. Those
   * surfaces' post-mint RPCs pass the backend gate via verified agent-store
   * credentials.
   */
  agent_store_sync_client: {
    client: true,
    default: false
  },
  /**
   * Let a cited agent-store file open from the local sync index alone,
   * without asking the server whether the mirror is current.
   *
   * Gated apart from `agent_store_sync_client` because it is the only step
   * that can serve bytes a revision behind. Off still resolves the citation,
   * just always against the server, so the arms differ in latency and
   * freshness rather than in whether opening a citation works at all.
   * `cursor.agent_store_sync.client.citation.*` splits both arms; ramp on
   * the tier-1 hit rate and the `behind` share of
   * `citation.served_staleness`. Unit: userID.
   */
  agent_store_citation_index_tier: {
    client: true,
    default: false
  },
  /** Auto-mount durable USER and TEAM stores for local IDE agents. */
  agent_store_principal_local_mounts: {
    client: true,
    default: false
  },
  /**
   * User-only ramp of `agent_store_principal_local_mounts`: auto-mount just
   * the durable USER store for local IDE/CLI agents, without the TEAM mount.
   * Consulted only while the combined gate is off — when both are on the
   * combined gate wins and this one changes nothing.
   */
  agent_store_local_user_mount: {
    client: true,
    default: true
  },
  /**
   * Deliver `quota_exceeded` journal notices on the conflict-notice rails
   * (cloud exec drain + local L-plan drain). Off → EDQUOT/silence only.
   */
  agent_store_quota_notices: {
    client: true,
    default: true
  },
  /** Kill switch / rollout for the proxy-agent TLS SecureContext cache (read in the ext host). */
  proxy_agent_secure_context_cache: {
    client: true,
    default: false
  },
  /**
   * Rollout for the client auto-disabling models unused past the backend's
   * disable_unused_models_after_n_hours threshold. When off, the client still
   * tracks last-used timestamps and logs what it would disable (dry run)
   * without writing the disable.
   */
  auto_disable_unused_models: {
    client: true,
    default: false
  },
  // When enabled, drops all user/project/team-customized prompt context — rules
  // (workspace .mdc, AGENTS.md, team/knowledge-base rules), skills, and MCP
  // (prompt instructions + tools) — from the agent prompt so the model runs
  // against a minimal, static prompt. Used for internal prompt experiments /
  // baselines. Default OFF preserves the full customized context.
  drop_custom_prompt_context: {
    client: true,
    default: false
  },
  // Reuses the ComposerEditorInput already installed in an editor group instead
  // of constructing a duplicate that is never disposed and leaks its SolidJS
  // effects. Default OFF until the rollout confirms tab open/close/replace
  // behavior is unchanged.
  composer_reuse_editor_input: {
    client: true,
    default: true
  },
  // Client kill switch for disposable leak / lifecycle-misuse telemetry.
  disposable_leak_reporting: {
    client: true,
    default: false
  }
};
var FEATURE_FLAGS = Object.keys(FLAGS);
var EXPERIMENTS = {
  /* BEGIN_EXPERIMENT_CONFIG */
  // User-level FinalizationRegistry safety-net cadence (60s control vs 1s
  // treatment). Fallback keeps the 60s default until the experiment is live.
  composer_gc_safety_net_1s: {
    client: true,
    fallbackValues: {
      enabled: false
    },
    parseValue: {
      enabled: parseBoolean
    }
  },
  // Internal Anysphere user-level tsgo memory experiment. Control preserves
  // auto imports; treatment disables their default and restarts native-preview.
  tsgo_disable_auto_imports_internal: {
    client: true,
    fallbackValues: {
      enabled: false
    },
    parseValue: {
      enabled: parseBoolean
    }
  },
  // Sand "Sand Model Selection" experiment (client-only; read by the Sand app).
  // The `enabled` parameter is the arm signal: Control = false, Test = true.
  // Fallback (not started / unallocated) is `enabled: false`, which — combined
  // with Sand keying "experiment active" off the Statsig group name rather than
  // this flag — means Sand behaves exactly as today until Jacob starts it.
  sand_model_selection: {
    client: true,
    fallbackValues: {
      enabled: false
    },
    parseValue: {
      enabled: parseBoolean
    }
  },
  // Sand main-agent reduced-fanout behavior. Control keeps current dispatch
  // behavior; treatment prefers executor reuse and requires explicit types for
  // new Task subagents.
  sand_less_subagent_fanout: {
    client: true,
    fallbackValues: {
      enabled: false
    },
    parseValue: {
      enabled: parseBoolean
    }
  },
  // Grok Bot plain-sentence tone A/B. Control keeps the shipped tone section;
  // treatment uses the complete-sentence rewrite in
  // packages/grok-bot-harness/src/runner/system-prompt.ts and the matching
  // SendToUser delivery check. Fallback is control so unallocated users see
  // no prompt change.
  grok_bot_update_communication: {
    client: true,
    fallbackValues: {
      enabled: false
    },
    parseValue: {
      enabled: parseBoolean
    }
  },
  // Grok Bot lean SendToUser tool description A/B. Control keeps the shipped
  // description; treatment drops the paragraphs that restate the "## SendToUser
  // is your only voice" system prompt section and keeps the message shapes
  // and parameters. Temporal harness only; the box harness pins control.
  // Fallback is control so unallocated users see no tool-definition change.
  grok_bot_lean_send_to_user_description: {
    client: true,
    fallbackValues: {
      enabled: false
    },
    parseValue: {
      enabled: parseBoolean
    }
  },
  // Grok Bot Playwright browser A/B. Control keeps the driver browser tools;
  // treatment offers the Playwright MCP surface. Fallback is control so an
  // unallocated user without the dogfood gate sees no change.
  grok_bot_browser_use_playwright_ab: {
    client: true,
    fallbackValues: {
      enabled: false
    },
    parseValue: {
      enabled: parseBoolean
    }
  },
  // Sand peer-chatter reduction. Control keeps current SendToAgent behavior
  // and [agent] wake wording; treatment accepts SendToAgent argument aliases,
  // refuses fan-out arrays with a one-recipient error, and asks woken agents
  // to reply only when requested or substantive.
  reduce_sand_peer_chatter: {
    client: true,
    fallbackValues: {
      enabled: false
    },
    parseValue: {
      enabled: parseBoolean
    }
  },
  // Sand desktop single-bot onboarding A/B. Control keeps the old
  // create-your-own-bot onboarding walk; treatment uses the onboarding-bot
  // hand-off. Fallback (not started / unallocated) is `enabled: false`; both
  // client and server fall back to the `sand_onboarding_bot` gate until the
  // experiment is started, so nothing changes for users until then.
  sand_onboarding_bot_ab: {
    client: true,
    fallbackValues: {
      enabled: false
    },
    parseValue: {
      enabled: parseBoolean
    }
  },
  // Sand desktop composer `/` menu A/B. Control keeps the `/` skills-and-actions
  // menu; treatment hides it. Fallback (not started / unallocated) is
  // `enabled: false`, and the client falls back to the `sand_hide_slash_commands`
  // gate until the experiment is started. An allocated control user stays on
  // `enabled: false` even when they pass the gate, so the arms stay clean.
  sand_hide_slash_commands_ab: {
    client: true,
    fallbackValues: {
      enabled: false
    },
    parseValue: {
      enabled: parseBoolean
    }
  },
  // Sand desktop composer `@` menu A/B. Control keeps the `@` menu of agents,
  // MCP servers, and routines; treatment hides it. Fallback (not started /
  // unallocated) is `enabled: false`, and the client falls back to the
  // `sand_hide_at_mentions` gate until the experiment is started. An allocated
  // control user stays on `enabled: false` even when they pass the gate.
  sand_hide_at_mentions_ab: {
    client: true,
    fallbackValues: {
      enabled: false
    },
    parseValue: {
      enabled: parseBoolean
    }
  },
  // Original stage-based limit-hit experience. Keep registered after the
  // silent-auto-switch relaunch so existing Statsig results remain intact.
  // Active reads use `limit_hit_ui_2027_07`.
  limit_hit_ui_2026_06: {
    client: true,
    fallbackValues: {
      group: "control"
    },
    parseValue: {
      group: parseEnum(["control", "treatment"])
    }
  },
  // Relaunch of the stage-based limit-hit experience (notice bubble above the
  // composer + Get More Usage / Adjust on-demand limit modals), in both Glass
  // and Classic. Control keeps today's usage-limit banners. Treatment keeps the
  // new UI for slow-pool / hard-block / model-switch, but 3p→1p auto-switch is
  // silent (no banner/CTA). Exposure is logged only once the user is actually
  // in a limit-hit stage (shared eligibility for both arms). Also gated by the
  // `limit_hit_ui_kill_switch` flag for instant rollback.
  limit_hit_ui_2027_07: {
    client: true,
    fallbackValues: {
      group: "control"
    },
    parseValue: {
      group: parseEnum(["control", "treatment"])
    }
  },
  // Original proactive third-party-usage nudge experiment. Keep registered
  // after the follow-up launches so existing Statsig results remain intact.
  third_party_usage_nudge_2026_07: {
    client: true,
    fallbackValues: {
      group: "control"
    },
    parseValue: {
      group: parseEnum(["control", "treatment"])
    }
  },
  // Follow-up policy experiment (see ExperimentParamTypes above). Backend-read
  // only, but marked client-facing because it drives a VS Code surface.
  third_party_usage_nudge_policy_2026_07: {
    client: true,
    fallbackValues: {
      policy: "none"
    },
    parseValue: {
      policy: parseEnum(["none", "90", "75_90"])
    }
  },
  sand_usage_warning_policy_2026_08: {
    client: true,
    fallbackValues: {
      policy: "none",
      firstThresholdPercent: 75,
      secondThresholdPercent: 90
    },
    parseValue: {
      policy: parseEnum(["none", "single", "double"]),
      firstThresholdPercent: parseNumber,
      secondThresholdPercent: parseNumber
    }
  },
  sand_group_chat_discouragement_2026_09: {
    client: true,
    fallbackValues: {
      policy: "control"
    },
    parseValue: {
      policy: parseEnum([
        "control",
        "notice",
        "notice_and_hide_create"
      ])
    }
  },
  // On-demand nudge experiment (see ExperimentParamTypes above). Backend-read
  // only, but marked client-facing because it drives a VS Code surface.
  third_party_on_demand_nudge_2026_08: {
    client: true,
    fallbackValues: {
      group: "control",
      copy: "cursor_models"
    },
    parseValue: {
      group: parseEnum(["control", "treatment"]),
      copy: parseEnum(["cursor_models", "grok_45"])
    }
  },
  // New-chat first-party switch (see ExperimentParamTypes above). Backend-read
  // only, but marked client-facing because it drives a VS Code surface.
  new_chat_first_party_switch_2026_08: {
    client: true,
    fallbackValues: {
      group: "control"
    },
    parseValue: {
      group: parseEnum(["control", "treatment"])
    }
  },
  grok_45_app_open_recent_composers_2026_08: {
    client: true,
    fallbackValues: {
      enabled: false
    },
    parseValue: {
      enabled: parseBoolean
    }
  },
  // Controls whether the Automations entrypoint row is shown in the editor/IDE
  // agents sidebar. Treatment (`enabled: true`) renders the row; control hides
  // it. Read on the client via `createExposedExperimentBoolean`.
  automations_button_in_ide: {
    client: true,
    fallbackValues: {
      enabled: false
    },
    parseValue: {
      enabled: parseBoolean
    }
  },
  // Glass-only "Local agents interruption" move-to-cloud tray. Control keeps
  // today's behavior (nothing); treatment shows a tray above the composer when
  // a generating local agent is interrupted by laptop sleep or a bad
  // connection, offering to continue the run in the cloud. Exposure is logged
  // at the shared eligibility boundary (interruption detected for an eligible
  // local agent, 24h cooldown elapsed) so both arms are counted symmetrically.
  local_agent_interruption_move_to_cloud_glass: {
    client: true,
    fallbackValues: {
      enabled: false
    },
    parseValue: {
      enabled: parseBoolean
    }
  },
  // Contextual Grok Bot download banner shown above the IDE and Glass
  // composers when the typed prompt reads as delegated knowledge work.
  // Control keeps today's behavior (nothing). Exposure is logged at the shared
  // eligibility boundary so both arms are counted symmetrically; the cadence
  // params below are read from the same call, so control's cadence budget is
  // spent identically to treatment's.
  grok_bot_contextual_banner: {
    client: true,
    fallbackValues: {
      enabled: false,
      cooldown_days: 1,
      max_shows: 5
    },
    parseValue: {
      enabled: parseBoolean,
      cooldown_days: parseNumber,
      max_shows: parseNumber
    }
  },
  // v2 of the above. Read when the server's nudge update arrives, which is
  // the same boundary v1 exposed at, one step later: the server has already
  // classified and spent the impression for both arms, so they stay
  // comparable. Separate experiment so v1 and v2 results do not mix.
  grok_bot_contextual_banner_v2: {
    client: true,
    fallbackValues: {
      enabled: false
    },
    parseValue: {
      enabled: parseBoolean
    }
  },
  // Glass-only "parallel local work" cloud nudge. Control keeps today's
  // behavior (nothing); `try_cloud` shows a toast with a "Try Cloud" routing
  // CTA; `educational` shows the same body copy with a single "Got It" button
  // and no routing (permanently suppresses on click). Exposure is logged at
  // the shared eligibility boundary (pattern held for the debounce window,
  // repo URL resolvable, 7-day cooldown elapsed) so all arms are counted
  // symmetrically.
  parallel_agents_try_cloud_nudge_glass: {
    client: true,
    fallbackValues: {
      variant: "control"
    },
    parseValue: {
      variant: parseEnum(["control", "try_cloud", "educational"])
    }
  },
  long_running_local_agent_cloud_nudge_glass: {
    client: true,
    fallbackValues: {
      variant: "control"
    },
    parseValue: {
      variant: parseEnum(["control", "try_cloud"])
    }
  },
  // Unit: userID. Extends the "Getting started" user checklist to enterprise
  // members. Default control (enabled:false) = no checklist for enterprise.
  dashboard_user_checklist_enterprise: {
    client: true,
    fallbackValues: {
      enabled: false
    },
    parseValue: {
      enabled: parseBoolean
    }
  },
  // Unit: teamID. Extends the "Team Setup" admin checklist to enterprise admins.
  // Default control (enabled:false) = no checklist for enterprise admins.
  dashboard_admin_setup_enterprise: {
    client: true,
    fallbackValues: {
      enabled: false
    },
    parseValue: {
      enabled: parseBoolean
    }
  },
  // Unit: teamID. Replaces the existing non-enterprise team-admin dashboard
  // checklist with the team-wide onboarding treatment. Default control keeps
  // the shipped checklist unchanged.
  dashboard_team_admin_onboarding_checklist: {
    client: true,
    fallbackValues: {
      enabled: false
    },
    parseValue: {
      enabled: parseBoolean
    }
  },
  // Unit: userID. Makes the portal account-setup role optional and removes
  // "Maybe Later". Default control preserves the shipped onboarding flow.
  onboarding_optional_job_role: {
    client: true,
    fallbackValues: {
      enabled: false
    },
    parseValue: {
      enabled: parseBoolean
    }
  },
  onboarding_grok_bot_cross_sell: {
    client: true,
    fallbackValues: {
      enabled: false
    },
    parseValue: {
      enabled: parseBoolean
    }
  },
  new_team_add_teammates_callout: {
    client: true,
    fallbackValues: {
      group: "control"
    },
    parseValue: {
      group: parseEnum(["control", "callout"])
    }
  },
  new_team_name_prefill: {
    client: true,
    fallbackValues: {
      group: "control"
    },
    parseValue: {
      group: parseEnum(["control", "domain_brand"])
    }
  },
  dashboard_member_remove_modal: {
    client: true,
    fallbackValues: {
      group: "control"
    },
    parseValue: {
      group: parseEnum([
        "control",
        "treatment_info",
        "treatment_warning"
      ])
    }
  },
  push_mcps: {
    client: true,
    fallbackValues: {
      group: "control"
    },
    parseValue: {
      group: parseEnum(["control", "enabled"])
    }
  },
  glass_setup_cloud_pill: {
    client: true,
    fallbackValues: {
      enabled: false,
      variant: "ghost"
    },
    parseValue: {
      enabled: parseBoolean,
      variant: parseEnum(["ghost", "primary"])
    }
  },
  // Unit: userID. Control restores the persisted active chat; treatment opens
  // New Agent without deleting the last-chat selection. Eligibility requires
  // an initial app start, an authoritative assignment, and a persisted active
  // chat. Explicit IDE launch intents are excluded.
  glass_start_on_new_chat: {
    client: true,
    fallbackValues: {
      enabled: false
    },
    parseValue: {
      enabled: parseBoolean
    }
  },
  send_to_cloud_composer_glass: {
    client: true,
    fallbackValues: {
      enabled: false
    },
    parseValue: {
      enabled: parseBoolean
    }
  },
  connect_repo_env_setup_pill_glass: {
    client: true,
    fallbackValues: {
      variant: "control"
    },
    parseValue: {
      variant: parseEnum([
        "control",
        "primary",
        "secondary",
        "tertiary"
      ])
    }
  },
  branch_mismatch_move_to_cloud_glass: {
    client: true,
    fallbackValues: {
      enabled: false
    },
    parseValue: {
      enabled: parseBoolean
    }
  },
  plan_build_cloud_button: {
    client: true,
    fallbackValues: {
      enabled: false
    },
    parseValue: {
      enabled: parseBoolean
    }
  },
  ide_connect_git_repos_start: {
    client: true,
    fallbackValues: {
      variant: "control"
    },
    parseValue: {
      variant: parseEnum([
        "control",
        "primary",
        "secondary",
        "tertiary"
      ])
    }
  },
  ide_steer_from_cloud_start: {
    client: true,
    fallbackValues: {
      enabled: false
    },
    parseValue: {
      enabled: parseBoolean
    }
  },
  cloud_agent_steer_from_phone_glass: {
    client: true,
    fallbackValues: {
      enabled: false
    },
    parseValue: {
      enabled: parseBoolean
    }
  },
  glass_account_menu_ios_download: {
    client: true,
    fallbackValues: {
      enabled: false
    },
    parseValue: {
      enabled: parseBoolean
    }
  },
  glass_account_menu_grok_bot: {
    client: true,
    fallbackValues: {
      enabled: false
    },
    parseValue: {
      enabled: parseBoolean
    }
  },
  glass_account_menu_usage_remaining: {
    client: true,
    fallbackValues: {
      enabled: false
    },
    parseValue: {
      enabled: parseBoolean
    }
  },
  glass_agent_demos_setup_pill: {
    client: true,
    fallbackValues: {
      enabled: false,
      variant: "ghost",
      cloud_target_only: false
    },
    parseValue: {
      enabled: parseBoolean,
      variant: parseEnum(["ghost", "primary"]),
      cloud_target_only: parseBoolean
    }
  },
  cloud_setup_cta_glass_running_agent_session: {
    client: true,
    fallbackValues: {
      variant: "control"
    },
    parseValue: {
      variant: parseEnum(["control", "chat_title", "composer_pill"])
    }
  },
  set_up_env_pill_glass: {
    client: true,
    fallbackValues: {
      variant: "control"
    },
    parseValue: {
      variant: parseEnum([
        "control",
        "primary",
        "secondary",
        "tertiary"
      ])
    }
  },
  agent_desktop_glass_env_setup: {
    client: true,
    fallbackValues: {
      enabled: false
    },
    parseValue: {
      enabled: parseBoolean
    }
  },
  glass_automations_sidebar_new_tag: {
    client: true,
    fallbackValues: {
      enabled: false
    },
    parseValue: {
      enabled: parseBoolean
    }
  },
  glass_grok_bot_topbar_cta: {
    client: true,
    fallbackValues: {
      enabled: false
    },
    parseValue: {
      enabled: parseBoolean
    }
  },
  glass_grok_bot_topbar_cta_new_chat_only: {
    client: true,
    fallbackValues: {
      enabled: false
    },
    parseValue: {
      enabled: parseBoolean
    }
  },
  glass_grok_bot_topbar_cta_hide_when_installed: {
    client: true,
    fallbackValues: {
      enabled: false
    },
    parseValue: {
      enabled: parseBoolean
    }
  },
  grok_bot_settings_sidebar: {
    client: true,
    fallbackValues: {
      enabled: false,
      download_url: "https://cursor.com/download/bot"
    },
    parseValue: {
      enabled: parseBoolean,
      download_url: parseString
    }
  },
  new_tag_cloud_runtime_glass: {
    client: true,
    fallbackValues: {
      enabled: false
    },
    parseValue: {
      enabled: parseBoolean
    }
  },
  runtime_picker_discovery_nudge_glass: {
    client: true,
    fallbackValues: {
      enabled: false
    },
    parseValue: {
      enabled: parseBoolean
    }
  },
  remote_control_runtime_picker_glass: {
    client: true,
    fallbackValues: {
      enabled: false
    },
    parseValue: {
      enabled: parseBoolean
    }
  },
  default_web_users_cloud_in_glass: {
    client: true,
    fallbackValues: {
      enabled: false
    },
    parseValue: {
      enabled: parseBoolean
    }
  },
  cloud_setup_cta_web_running_agent_session: {
    client: true,
    fallbackValues: {
      variant: "control"
    },
    parseValue: {
      variant: parseEnum([
        "control",
        "primary",
        "secondary",
        "tertiary"
      ])
    }
  },
  suggested_prompts: {
    client: true,
    fallbackValues: {
      enabled: false
    },
    parseValue: {
      enabled: parseBoolean
    }
  },
  suggested_mode_switch: {
    client: true,
    fallbackValues: {
      group: "control"
    },
    parseValue: {
      group: parseEnum(["control", "nudge"])
    }
  },
  plugin_keyword_nudge_rollout: {
    client: true,
    fallbackValues: {
      group: "control"
    },
    parseValue: {
      group: parseEnum(["control", "treatment"])
    }
  },
  marketplace_tab_customize_label: {
    client: true,
    fallbackValues: {
      group: "control"
    },
    parseValue: {
      group: parseEnum(["control", "treatment"])
    }
  },
  customize_default_manage_tab: {
    client: true,
    fallbackValues: {
      tab: "plugins"
    },
    parseValue: {
      tab: parseEnum(["plugins", "mcps"])
    }
  },
  customize_grok_bot_callout: {
    client: true,
    fallbackValues: {
      enabled: false
    },
    parseValue: {
      enabled: parseBoolean
    }
  },
  marketplace_card_install_cta_ab: {
    client: true,
    fallbackValues: {
      group: "control"
    },
    parseValue: {
      group: parseEnum(["control", "card_cta"])
    }
  },
  marketplace_detail_authenticate_cta_ab: {
    client: true,
    fallbackValues: {
      group: "control"
    },
    parseValue: {
      group: parseEnum(["control", "detail_auth_cta"])
    }
  },
  marketplace_try_in_chat_prompt_ab: {
    client: true,
    fallbackValues: {
      group: "control"
    },
    parseValue: {
      group: parseEnum(["control", "concrete_use_case_prompt"])
    }
  },
  composer_run_button_style: {
    client: true,
    fallbackValues: {
      buttonStyle: "primary"
    },
    parseValue: {
      buttonStyle: parseEnum(["primary", "secondary"])
    }
  },
  new_placeholder: {
    client: true,
    fallbackValues: {
      enabled: false
    },
    parseValue: {
      enabled: parseBoolean
    }
  },
  cursor_launch_at_login: {
    client: true,
    fallbackValues: {
      enabled: false
    },
    parseValue: {
      enabled: parseBoolean
    }
  },
  subscription_only_degraded_extended_usage: {
    client: true,
    fallbackValues: {
      enabled: false
    },
    parseValue: {
      enabled: parseBoolean
    }
  },
  onboarding_default_layout_agent: {
    client: true,
    fallbackValues: {
      enabled: "false"
    },
    parseValue: {
      enabled: parseString
    }
  },
  onboarding_left_right_chat: {
    client: true,
    fallbackValues: {
      enabled: "left"
    },
    parseValue: {
      enabled: parseEnum(["left", "right"])
    }
  },
  grok_bot_early_compaction: {
    client: true,
    fallbackValues: {
      enabled: false,
      contextTokenThreshold: 1e5
    },
    parseValue: {
      enabled: parseBoolean,
      // Invalid -> 0 disables treatment; keep this backend-only validator inline.
      contextTokenThreshold: (() => {
        const schema2 = external_exports.number().int().min(32e3).max(1e6).catch(0);
        return (value) => schema2.parse(value);
      })()
    }
  },
  separate_auto_and_api_usage_bars_for_individuals: {
    client: true,
    fallbackValues: {
      group: "control"
    },
    parseValue: {
      group: parseEnum(["control", "test"])
    }
  },
  onboarding_skip_post_login: {
    client: true,
    fallbackValues: {
      enabled: "control"
    },
    parseValue: {
      enabled: parseEnum(["control", "remove_features"])
    }
  },
  /**
   * A/B test for which model the locked free-user model picker is pinned to.
   * See type definition for variant semantics. Free-user lock UX itself is
   * always on (the `locked_picker` arm of the predecessor experiment shipped);
   * this experiment varies only the pinned model.
   *
   * Statsig ops: ramp via experiment allocation only (0% = off). No separate
   * gate. Fallback is honest control: a Statsig outage or 0% allocation keeps
   * today's "Auto"-pinned behavior.
   */
  free_user_locked_model_2026_05: {
    client: true,
    fallbackValues: {
      variant: "control"
    },
    parseValue: {
      variant: parseEnum([
        "control",
        "composer_2_5_fast",
        "composer_2_5",
        "grok_4_6"
      ])
    }
  },
  free_user_composer_grok_picker_2026_07: {
    client: true,
    fallbackValues: {
      group: "control"
    },
    parseValue: {
      group: parseEnum(["control", "treatment"])
    }
  },
  // v3 in `model_picker_experiments`. Console groups set layer param
  // `promote_first_party_variant` to `control` / `grouped_auto_expand`.
  model_picker_promote_first_party_v3: {
    client: true,
    fallbackValues: {
      variant: "control"
    },
    parseValue: {
      variant: parseEnum(["control", "grouped_auto_expand"])
    }
  },
  model_picker_usage_display_2026_08: {
    client: true,
    fallbackValues: {
      group: "control"
    },
    parseValue: {
      group: parseEnum(["control", "show_labels"])
    }
  },
  free_user_usage_summary_display_mode: {
    client: true,
    fallbackValues: {
      group: "control"
    },
    parseValue: {
      group: parseEnum(["control", "always_show_percentage"])
    }
  },
  pro_auto_mode_new_users: {
    client: true,
    fallbackValues: {
      group: "control"
    },
    parseValue: {
      group: parseEnum([
        "control",
        "pro_and_auto_default_auto",
        "pro_and_auto_default_pro"
      ])
    }
  },
  pro_auto_mode_existing_users: {
    client: true,
    fallbackValues: {
      group: "control"
    },
    parseValue: {
      group: parseEnum([
        "control",
        "pro_and_auto_default_auto_with_nudge"
      ])
    }
  },
  premium_auto_mode: {
    client: true,
    fallbackValues: {
      group: "control"
    },
    parseValue: {
      group: parseEnum(["control", "premium_auto_option"])
    }
  },
  terminal_tip: {
    client: true,
    fallbackValues: {
      enabled: false,
      message: "Install Cursor CLI?",
      action: "curl https://cursor.com/install -fsS | bash",
      show_every_hours: 0,
      show_count: 0
    },
    parseValue: {
      enabled: parseBoolean,
      message: parseString,
      action: parseString,
      show_every_hours: parseNumber,
      show_count: parseNumber
    }
  },
  /**
   * Experiment for the CLI install in-app ad.
   * Shows an ad to users who have claude/codex CLI but not Cursor agent CLI.
   * This is a separate experiment from terminal_tip to keep assignment close to exposure.
   */
  cli_install_ad: {
    client: true,
    fallbackValues: {
      enabled: false
    },
    parseValue: {
      enabled: parseBoolean
    }
  },
  /**
   * Experiment for the CLI install in-app ad v2.
   * Tests different timing strategies for showing the ad to users with competing CLIs.
   * - control: No ad shown
   * - minutes_delay: Show ad 5 minutes after first detecting a competing CLI
   * - day_delay: Show ad 24 hours after first detecting a competing CLI
   */
  cli_install_ad_v2: {
    client: true,
    fallbackValues: {
      variant: "control"
    },
    parseValue: {
      variant: parseEnum(["control", "minutes_delay", "day_delay"])
    }
  },
  new_chat_auto_switch: {
    client: true,
    fallbackValues: {
      group: "control"
    },
    parseValue: {
      group: parseEnum(["control", "popup", "inline_banner"])
    }
  },
  new_teams_pricing_cancellation_flow: {
    client: true,
    fallbackValues: {
      enabled: false
    },
    parseValue: {
      enabled: parseBoolean
    }
  },
  team_pending_cancellation_cancel_now: {
    client: true,
    fallbackValues: {
      enabled: false
    },
    parseValue: {
      enabled: parseBoolean
    }
  },
  yearly_upgrade_inplace: {
    client: true,
    fallbackValues: {
      enabled: false
    },
    parseValue: {
      enabled: parseBoolean
    }
  },
  portal_od_enable_limit_hit_2026_08: {
    client: true,
    fallbackValues: {
      group: "control"
    },
    parseValue: {
      group: parseEnum(["control", "treatment"])
    }
  },
  dashboard_user_menu_view_plans: {
    client: true,
    fallbackValues: {
      enabled: false
    },
    parseValue: {
      enabled: parseBoolean
    }
  },
  dashboard_create_team_sidebar_cta: {
    client: true,
    fallbackValues: {
      enabled: false
    },
    parseValue: {
      enabled: parseBoolean
    }
  },
  sidebar_bottom_section_cta: {
    client: true,
    fallbackValues: {
      group: "control"
    },
    parseValue: {
      group: parseEnum(["control", "create_team", "upgrade_to_pro"])
    }
  },
  sidebar_grok_bot_cta: {
    client: true,
    fallbackValues: {
      enabled: false
    },
    parseValue: {
      enabled: parseBoolean
    }
  },
  agents_grok_bot_cta: {
    client: true,
    fallbackValues: {
      enabled: false
    },
    parseValue: {
      enabled: parseBoolean
    }
  },
  spending_grok_bot_cta: {
    client: true,
    fallbackValues: {
      enabled: false
    },
    parseValue: {
      enabled: parseBoolean
    }
  },
  free_user_create_team_cta: {
    client: true,
    fallbackValues: {
      enabled: false
    },
    parseValue: {
      enabled: parseBoolean
    }
  },
  dashboard_free_overview_cleanup: {
    client: true,
    fallbackValues: {
      group: "control"
    },
    parseValue: {
      group: parseEnum([
        "control",
        "used_percentage",
        "remaining_percentage"
      ])
    }
  },
  download_bottom_dashboard: {
    client: true,
    fallbackValues: {
      enabled: false
    },
    parseValue: {
      enabled: parseBoolean
    }
  },
  dashboard_onboarding_download_grok_bot: {
    client: true,
    fallbackValues: {
      enabled: false
    },
    parseValue: {
      enabled: parseBoolean
    }
  },
  dashboard_onboarding_download_grok_bot_primary: {
    client: true,
    fallbackValues: {
      enabled: false
    },
    parseValue: {
      enabled: parseBoolean
    }
  },
  web_grok_bot_launch_ad: {
    client: true,
    fallbackValues: {
      enabled: false
    },
    parseValue: {
      enabled: parseBoolean
    }
  },
  web_cloud_agents_agent_window_ad: {
    client: true,
    fallbackValues: {
      enabled: false
    },
    parseValue: {
      enabled: parseBoolean
    }
  },
  router_settings_disabled_info: {
    client: true,
    fallbackValues: {
      enabled: false
    },
    parseValue: {
      enabled: parseBoolean
    }
  },
  onboarding_redirect_git_to_login_deep_control: {
    client: true,
    fallbackValues: {
      enabled: false
    },
    parseValue: {
      enabled: parseBoolean
    }
  },
  dashboard_invite_modal_version: {
    client: true,
    fallbackValues: {
      variant: "v2"
    },
    parseValue: {
      variant: parseEnum(["v2", "v3", "v3-contacts"])
    }
  },
  // Concluded (shipped `tertiary`); kept registered so deployed clients still
  // resolve it. Superseded on the pill by completely_free_env_setup_glass_and_web.
  set_up_env_pill_web: {
    client: true,
    fallbackValues: {
      variant: "control"
    },
    parseValue: {
      variant: parseEnum([
        "control",
        "primary",
        "secondary",
        "tertiary"
      ])
    }
  },
  completely_free_env_setup_glass_and_web: {
    client: true,
    fallbackValues: {
      variant: "control"
    },
    parseValue: {
      variant: parseEnum([
        "control",
        "primary",
        "secondary",
        "tertiary"
      ])
    }
  },
  env_setup_free_callout_web: {
    client: true,
    fallbackValues: {
      enabled: false
    },
    parseValue: {
      enabled: parseBoolean
    }
  },
  completely_free_env_setup_glass: {
    client: true,
    fallbackValues: {
      variant: "control"
    },
    parseValue: {
      variant: parseEnum(["control", "treatment"])
    }
  },
  dynamic_automation_templates: {
    client: true,
    fallbackValues: {
      group: "control"
    },
    parseValue: {
      group: parseEnum(["control", "treatment"])
    }
  },
  team_pinned_marketplace_plugins: {
    client: true,
    fallbackValues: {
      group: "control"
    },
    parseValue: {
      group: parseEnum(["control", "treatment"])
    }
  },
  glass_new_chat_header: {
    client: true,
    fallbackValues: {
      enabled: false
    },
    parseValue: {
      enabled: parseBoolean
    }
  },
  glass_ftux_wizard: {
    client: true,
    fallbackValues: {
      enabled: false
    },
    parseValue: {
      enabled: parseBoolean
    }
  },
  glass_ftux_app_scan: {
    client: true,
    fallbackValues: {
      enabled: false
    },
    parseValue: {
      enabled: parseBoolean
    }
  },
  terminal_agent_integration: {
    client: true,
    fallbackValues: {
      enabled: false
    },
    parseValue: {
      enabled: parseBoolean
    }
  },
  ide_update_ux_exp: {
    client: true,
    fallbackValues: {
      variant: "control"
    },
    parseValue: {
      variant: parseEnum(["control", "sidebar", "non_sidebar"])
    }
  },
  vega_launch_broadcast: {
    client: true,
    fallbackValues: {
      enabled: false
    },
    parseValue: {
      enabled: parseBoolean
    }
  },
  effort_first_model_picker: {
    client: true,
    fallbackValues: {
      variant: "control"
    },
    parseValue: {
      variant: parseEnum(["control", "treatment"])
    }
  },
  // Layer-allocated via `effort_first_compact_model_ids` only. Console groups
  // set that array to `["grok-4.6"]` (control) or `[]` (treatment).
  // `effort_first_variant` is not required on this experiment: prod
  // effort-first is the v3.14.7 targeting override, not leftover.
  effort_first_show_grok_name: {
    client: true,
    fallbackValues: {},
    parseValue: {}
  },
  slash_menu_team_discovery_ranking: {
    client: true,
    fallbackValues: {
      policy: "strict_tiers",
      half_life_ms: 7 * 24 * 60 * 60 * 1e3,
      team_pseudocount_cap: 0.8,
      team_min_sample_count: 5,
      team_min_score: 0.05,
      discovery_personal_recency_window_ms: 28 * 24 * 60 * 60 * 1e3,
      visible_item_count: 5,
      discovery_slot_positions: [4, 5],
      protected_top_count: 3,
      max_discovery_score_deficit: 0.25,
      discovery_seed: ""
    },
    parseValue: {
      policy: parseEnum([
        "strict_tiers",
        "blended",
        "floating_team_slots"
      ]),
      half_life_ms: parseNumber,
      team_pseudocount_cap: parseNumber,
      team_min_sample_count: parseNumber,
      team_min_score: parseNumber,
      discovery_personal_recency_window_ms: parseNumber,
      visible_item_count: parseNumber,
      discovery_slot_positions: parseNumberArray,
      protected_top_count: parseNumber,
      max_discovery_score_deficit: parseNumber,
      discovery_seed: parseString
    }
  }
  /* END_EXPERIMENT_CONFIG */
};
var EXPERIMENT_NAMES = Object.keys(EXPERIMENTS);
var mcpReconnectConfigFields = {
  fastRetryBaseDelayMs: external_exports.number().min(1e3).max(36e5),
  fastRetryMaxDelayMs: external_exports.number().min(1e3).max(36e5),
  /** Fast retry attempts before entering periodic retry (V2 FSM). */
  fastRetryMaxAttempts: external_exports.number().min(1).max(20).optional(),
  periodicRetryBaseDelayMs: external_exports.number().min(3e4).max(36e5),
  periodicRetryMaxDelayMs: external_exports.number().min(3e4).max(36e5),
  /** Max periodic retry rounds; null/undefined = unlimited (V1 compat). */
  maxPeriodicCycles: external_exports.number().min(0).max(1e4).nullish(),
  focusRetryCooldownMs: external_exports.number().min(5 * 6e4).max(36e5),
  /** Min time between inline transport re-inits on tool-call retry (per adapter instance). */
  inlineReconnectCooldownMs: external_exports.number().min(1e3).max(36e5).optional(),
  /** Client poll interval while waiting for a Redis refresh winner's backend OAuth tokens. */
  oauthBackendRefreshHydrationPollIntervalMs: external_exports.number().min(200).max(5e3).optional(),
  /** Consecutive streamable-HTTP session HTTP 404s before quarantine (non-retryable). */
  streamableHttpSession404TombstoneThreshold: external_exports.number().min(1).max(50).optional(),
  healthProbeTimeoutMs: external_exports.number().min(1e3).max(12e4).optional(),
  /**
   * Kill switch for AQ-1514 progress-aware MCP tool-call timeouts.
   * When false, desktop tool calls use the legacy hard 1-hour timeout.
   */
  toolCallBoundedTimeoutEnabled: external_exports.boolean().optional(),
  /** Idle silence before a tool call times out (progress resets this). */
  toolCallIdleTimeoutMs: external_exports.number().min(5e3).max(30 * 6e4).optional(),
  /** Absolute wall-clock cap for one tool call, even with progress. */
  toolCallMaxTotalTimeoutMs: external_exports.number().min(5e3).max(60 * 6e4).optional(),
  degradedProbeDelayMs: external_exports.number().min(1e3).max(36e5).optional(),
  maxDegradedProbeFailures: external_exports.number().min(1).max(20).optional(),
  keepaliveProbeDelayMs: external_exports.number().min(1e4).max(36e5).optional(),
  keepaliveJitterMs: external_exports.number().min(0).max(36e5).optional(),
  stabilityThresholdMs: external_exports.number().min(5e3).max(6e5).optional(),
  stdioConnectFailuresAreNonRetryable: external_exports.boolean().optional(),
  retryNonRetryableOnWake: external_exports.boolean().optional(),
  nonRetryableWakeRetryCooldownMs: external_exports.number().min(1e3).max(36e5).optional(),
  retryNonRetryableAutomatically: external_exports.boolean().optional(),
  networkResumeReconnectEnabled: external_exports.boolean().optional(),
  networkResumeReconnectDebounceMs: external_exports.number().min(0).max(18e5).optional()
};
var mcpReconnectConfigOverrideSchema = external_exports.object(mcpReconnectConfigFields).partial().extend({
  identifier: external_exports.string().optional(),
  hostname: external_exports.string().optional()
}).refine(
  (value) => value.identifier !== void 0 || value.hostname !== void 0,
  {
    message: "Each mcp_reconnect_config override requires identifier and/or hostname."
  }
);
var mcpReconnectConfigSchema = external_exports.object({
  ...mcpReconnectConfigFields,
  // nullish: native Statsig rejects undefined getValue fallbacks.
  overrides: external_exports.array(mcpReconnectConfigOverrideSchema).nullish()
});
var DEFAULT_FIRST_WINDOW_REACTIVATION_INACTIVE_DAYS = 7;
var GLASS_FTUX_FIRST_ACTION_APP_KEYS = [
  "figma",
  "slack",
  "linear",
  "notion-workspace"
];
var GLASS_FTUX_FIRST_ACTION_ICON_COUNT = 3;
var GlassFtuxFirstActionConfigEntrySchema = external_exports.discriminatedUnion("type", [
  external_exports.object({
    type: external_exports.literal("app"),
    app: external_exports.enum(GLASS_FTUX_FIRST_ACTION_APP_KEYS),
    title: external_exports.string().min(1),
    description: external_exports.string().min(1),
    prompt: external_exports.string().min(1)
  }).strict(),
  external_exports.object({
    type: external_exports.literal("icon"),
    icon: external_exports.string().min(1),
    title: external_exports.string().min(1),
    description: external_exports.string().min(1),
    prompt: external_exports.string().min(1)
  }).strict()
]);
var GlassFtuxFirstActionConfigListSchema = external_exports.array(GlassFtuxFirstActionConfigEntrySchema).length(
  GLASS_FTUX_FIRST_ACTION_APP_KEYS.length + GLASS_FTUX_FIRST_ACTION_ICON_COUNT
).superRefine((entries, ctx) => {
  const appKeys = entries.flatMap(
    (entry) => entry.type === "app" ? [entry.app] : []
  );
  const iconCount = entries.length - appKeys.length;
  if (iconCount !== GLASS_FTUX_FIRST_ACTION_ICON_COUNT) {
    ctx.addIssue({
      code: external_exports.ZodIssueCode.custom,
      message: `Expected exactly ${GLASS_FTUX_FIRST_ACTION_ICON_COUNT} icon actions, got ${iconCount}`
    });
  }
  for (const appKey of GLASS_FTUX_FIRST_ACTION_APP_KEYS) {
    const matches = appKeys.filter(
      (candidate) => candidate === appKey
    ).length;
    if (matches !== 1) {
      ctx.addIssue({
        code: external_exports.ZodIssueCode.custom,
        message: `Expected exactly one "${appKey}" action, got ${matches}`
      });
    }
  }
});
var GlassFtuxFirstActionRoleConfigSchema = external_exports.object({
  coding: GlassFtuxFirstActionConfigListSchema,
  tasks: GlassFtuxFirstActionConfigListSchema
}).strict();
var GLASS_FTUX_FIRST_ACTION_JOB_ROLE_KEYS = [
  "software-engineer",
  "designer",
  "product-manager",
  "researcher",
  "data-scientist",
  "student",
  "marketer",
  "operations",
  "something-else"
];
var GlassFtuxFirstActionConfigByJobRoleSchema = external_exports.record(external_exports.string().max(100), GlassFtuxFirstActionRoleConfigSchema).superRefine((byJobRole, ctx) => {
  const allowed = new Set(GLASS_FTUX_FIRST_ACTION_JOB_ROLE_KEYS);
  for (const roleKey of Object.keys(byJobRole)) {
    if (!allowed.has(roleKey)) {
      ctx.addIssue({
        code: external_exports.ZodIssueCode.custom,
        message: `Unknown FTUX first-action job role key: ${roleKey}`,
        path: [roleKey]
      });
    }
  }
});
var originServiceAccountRateLimitFamilyBudgets = {
  ci: external_exports.number().int().positive(),
  pr: external_exports.number().int().positive(),
  diff: external_exports.number().int().positive(),
  diff_files: external_exports.number().int().positive(),
  timeline: external_exports.number().int().positive(),
  threads: external_exports.number().int().positive(),
  stack: external_exports.number().int().positive(),
  mutations: external_exports.number().int().positive(),
  other: external_exports.number().int().positive(),
  git_reads: external_exports.number().int().positive()
};
var DYNAMIC_CONFIG_SCHEMAS = {
  cursor_private_inference_hard_stop: external_exports.object({
    enabled: external_exports.boolean(),
    // nullish: native Statsig rejects undefined getValue fallbacks.
    instructionsUrl: external_exports.string().nullish()
  }),
  mobile_iap_products: external_exports.object({
    products: external_exports.record(external_exports.string(), external_exports.enum(["pro", "pro_plus", "ultra"]))
  }),
  codebase_protection_reporting_config: external_exports.object({
    report_interval_ms: external_exports.number().int().positive(),
    jitter_fraction: external_exports.number().min(0).max(1)
  }),
  // Schedule for the Agent Host bridge registration wait (the pre-network
  // "is the remote bridge there at all" check). Read only on Agent Host
  // client paths; values are clamped client-side so a bad remote value can
  // neither disable the bound nor make it absurdly short.
  agent_host_bridge_wait: external_exports.object({
    initial_timeout_ms: external_exports.number(),
    retry_timeout_ms: external_exports.number(),
    max_attempts: external_exports.number()
  }),
  sand_working_state_warming_config: external_exports.object({
    maxClosureBytes: external_exports.number().int().positive(),
    maxClosureBlobs: external_exports.number().int().positive(),
    putConcurrency: external_exports.number().int().min(1).max(32),
    parallelListing: external_exports.boolean(),
    migrationAgentConcurrency: external_exports.number().int().min(1).max(32),
    migrationReadBatchBlobs: external_exports.number().int().min(1).max(64),
    migrationPutConcurrency: external_exports.number().int().min(1).max(32),
    migrationCopyConcurrency: external_exports.number().int().min(1).max(32)
  }),
  grok_bot_temporal_harness_rollout: external_exports.object({
    control: external_exports.enum(["legacy_gates", "config"]),
    mode: external_exports.enum(["off", "shadow", "live"]),
    autoReviewEnforce: external_exports.boolean()
  }),
  grok_bot_loop_detection: external_exports.object({
    mode: external_exports.enum(["off", "shadow", "on"])
  }),
  // Replaces Grok Bot's built-in base system prompt (the static "You are Grok
  // Bot..." sections) for a top-level agent turn on both harnesses. Every
  // dynamic section after it (profile, memory, skills, automations, MCP,
  // box, computer) and every tool stays as-is. Subagents and automation runs
  // keep their own prompts. An empty or whitespace-only `basePrompt` keeps
  // the built-in prompt. Read once per turn on the owner's Statsig user, so
  // target userID/teamID to scope an experiment.
  grok_bot_system_prompt_override: external_exports.object({
    basePrompt: external_exports.string()
  }),
  remote_workspace_readiness_config: external_exports.object({
    healthcheck_timeout_ms: external_exports.number().int().positive(),
    remote_extension_host_startup_grace_ms: external_exports.number().int().nonnegative()
  }),
  // Poll cadence for the cursor-blame commit poller (aiCodeTrackingService).
  ai_code_tracking_poll: external_exports.object({
    interval_ms: external_exports.number().int().positive()
  }),
  solidjs_stack_trace_limit: external_exports.object({
    stackTraceLimitFloor: external_exports.number().int().nonnegative()
  }),
  glass_remote_connection_dormancy_config: external_exports.object({
    // Consecutive minutes the whole window must be backgrounded or free of user
    // input before an agent workspace detaches. 0 disables this trigger.
    windowIdleMinutesToSuspend: external_exports.number().int().nonnegative(),
    // Consecutive minutes this workspace's agent must be off-screen while the
    // window itself is still attended. 0 disables this trigger, which is the
    // conservative rollout order: window-level idling first, per-agent second.
    hiddenAgentMinutesToSuspend: external_exports.number().int().nonnegative(),
    // Suspend even while the window holds OS focus, as long as there has been
    // no keyboard or pointer input. A focused-but-unattended window is the case
    // that costs the most pod time, but resuming on focus alone would churn, so
    // this is opt-in and pairs with resuming on user input instead.
    suspendWhileWindowFocused: external_exports.boolean(),
    // Backlog caps for a dormant workspace. Sends issued while suspended park
    // in the protocol's replay queue (nothing drains it) and the whole backlog
    // replays synchronously on resume, so crossing either cap wakes the
    // connection (`queue_pressure` resume) instead of growing without bound.
    maxDormantQueuedMessages: external_exports.number().int().positive(),
    maxDormantQueuedBytes: external_exports.number().int().positive(),
    // Hard ceilings past which a dormant session is written off instead of
    // resumed: a backlog this far above the wake caps means every
    // queue-pressure resume has been failing for a long time (and the queue
    // keeps growing), so the connection is treated as lost and handed to
    // workspace repair rather than re-dialed with an ever larger replay.
    hardMaxDormantQueuedMessages: external_exports.number().int().positive(),
    hardMaxDormantQueuedBytes: external_exports.number().int().positive()
  }),
  idle_extension_host_killer_config: external_exports.object({
    idleMinutesToKillExtensionHost: external_exports.number().int().nonnegative(),
    freeMemoryPercentageToKillExtensionHost: external_exports.number().min(0).max(100),
    // When cursor extension isolation is enabled (IDE only), whether the idle
    // killer also stops the user extension host. true = aggressive (kill the
    // user host too, more memory reclaimed but go-to-definition cold starts);
    // false = spare the user host and only stop Cursor builtin hosts. No effect
    // when isolation is disabled (single shared host is always stopped).
    killUserExtensionHost: external_exports.boolean()
  }),
  marketplace_listing_config: external_exports.object({
    rpcTimeoutMs: external_exports.number().int().positive()
  }),
  shell_exec_output_backpressure_config: external_exports.object({
    outputSuppressionWindowMs: external_exports.number().int().positive(),
    outputSuppressionThresholdCharsPerSecond: external_exports.number().int().positive(),
    outputSuppressionMinChars: external_exports.number().int().positive(),
    outputLimiterFlushIntervalMs: external_exports.number().int().positive(),
    outputLimiterMaxBufferedBytes: external_exports.number().int().positive(),
    extHostMinBatchIntervalMs: external_exports.number().int().positive(),
    extHostMaxBatchIntervalMs: external_exports.number().int().positive(),
    extHostBytesPerIntervalStep: external_exports.number().int().positive()
  }),
  editor_bugbot_config: external_exports.object({
    model: external_exports.string(),
    iterations: external_exports.number(),
    agentic_iterations: external_exports.number(),
    agentic_model: external_exports.string(),
    // Deep Review model override; empty string falls back to the code default
    // in editor-deep-review on the Review Agents model router.
    deep_review_model: external_exports.string(),
    context_lines: external_exports.number()
  }),
  client_speculative_summarization_config: external_exports.object({
    tokenUsageThresholdPercentage: external_exports.number(),
    tolerancePercentage: external_exports.number(),
    /** Maximum age for an in-flight speculative summarization before considered stale (minutes) */
    inflightMaxAgeMinutes: external_exports.number(),
    /** Timeout for the speculative summaries stream (minutes) */
    speculativeStreamTimeoutMinutes: external_exports.number()
  }),
  /**
   * Copy for the rate-limited reconnect shimmer (INF-9446). Remotely
   * adjustable so the wording can change during an incident without a
   * client release. The `rate_limited_reconnect_message_kill_switch` gate
   * separately reverts to the generic "Reconnecting…" string.
   */
  rate_limited_reconnect_message_config: external_exports.object({
    message: external_exports.string()
  }),
  new_conversation_ux_config: external_exports.object({
    enable: external_exports.boolean(),
    enabled_models: external_exports.array(external_exports.string()),
    force_enable_on_all_models: external_exports.boolean(),
    group_text: external_exports.boolean(),
    group_thinking: external_exports.boolean(),
    group_todos: external_exports.boolean(),
    group_edits: external_exports.boolean(),
    smooth_stream_enable: external_exports.boolean(),
    grouped_text_max_length: external_exports.number(),
    grouped_text_max_length_composer_family: external_exports.number(),
    tool_summary_mode: external_exports.string(),
    nest_tool_blocks: external_exports.boolean()
  }),
  meta_agent_config: external_exports.object({
    meta_parent_model: external_exports.string(),
    allow_subagent_followups: external_exports.boolean(),
    enable_notes: external_exports.boolean()
  }),
  task_card_tips: external_exports.object({
    startup_tips: external_exports.array(
      external_exports.object({
        id: external_exports.string(),
        text: external_exports.string(),
        enabled: external_exports.boolean().optional()
      })
    )
  }),
  product_tips_config: external_exports.object({
    tips: external_exports.array(
      external_exports.object({
        id: external_exports.string(),
        /**
         * Tip copy. To show OS-specific keyboard shortcuts, embed a
         * `{{key:commandId}}` token (optionally `{{key:commandId|fallback}}`)
         * instead of hardcoding keys — the client resolves it to the
         * platform label (e.g. `⌘D` on macOS, `Ctrl+D` elsewhere). Example:
         * "Use {{key:glass.splitTileHorizontalFromKeyboard|Ctrl+D}} to split
         * your view into tiled panes".
         */
        text: external_exports.string(),
        targetSurfaces: external_exports.array(external_exports.enum(["editor", "glass"])).min(1)
      }).strict()
    ),
    config: external_exports.object({
      intervalMs: external_exports.number().positive(),
      devIntervalMs: external_exports.number().positive().optional(),
      /** Minimum IDE semver. Clients below this version do not see product tips. */
      minClientVersion: external_exports.string()
    }).strict()
  }).strict(),
  agent_layout_migration: external_exports.object({
    showSettings: external_exports.boolean(),
    keepIsland: external_exports.boolean(),
    sidebarLocation: external_exports.enum(["left", "right", "user", "noop"])
  }),
  default_diff_mode: external_exports.object({
    default_diff_mode: external_exports.enum(["unified", "diffs"])
  }),
  switch_mode_tool_config: external_exports.object({
    enabledForNal: external_exports.boolean(),
    enabledForOal: external_exports.boolean(),
    fromModes: external_exports.array(external_exports.string()),
    targetModes: external_exports.array(external_exports.string())
  }),
  mcp_auth_status_copy_config: external_exports.object({
    authToolDescription: external_exports.string(),
    errorStatusMessage: external_exports.string(),
    needsAuthStatusMessageWithAuthTool: external_exports.string()
  }),
  mcp_reconnect_config: mcpReconnectConfigSchema,
  mcp_oauth_sweep_config: external_exports.object({
    /** Max age for OAuth attempt memento keys before they are swept (ms). */
    oauthAttemptTtlMs: external_exports.number().min(6e4).max(7 * 24 * 60 * 6e4),
    /** TTL for cross-process OAuth refresh lock (ms). */
    // nullish: native Statsig rejects undefined getValue fallbacks.
    refreshLockTtlMs: external_exports.number().min(2e3).max(12e4).nullish(),
    /** Max refresh lock hold (ms), including heartbeat renewals. */
    refreshLockMaxHoldMs: external_exports.number().min(3e4).max(36e5).optional(),
    /** TTL for cross-process OAuth registration lock (ms). */
    registrationLockTtlMs: external_exports.number().min(2e3).max(12e4).nullish()
  }),
  /** When enabled, preserve refresh tokens on clear network timeouts only; still wipe invalid-grant failures. */
  mcp_oauth_refresh_policy: external_exports.object({
    classifyBeforeWipe: external_exports.boolean()
  }),
  mcp_oauth_loopback_redirect: external_exports.object({
    enabled: external_exports.boolean(),
    denylist: external_exports.array(external_exports.string())
  }),
  /**
   * MCP OAuth Redis lock coordinator scoping and timing knobs. Coordination
   * itself is unconditional; these only decide which traffic it covers and
   * how long it waits.
   */
  mcp_oauth_backend_redis_lock_config: external_exports.object({
    operations: external_exports.array(external_exports.enum(["refresh", "registration"])),
    executorKinds: external_exports.array(
      external_exports.enum([
        "backendHttpMcp",
        "cloudAgent",
        "agentHost",
        "localIde",
        "remoteExtensionHost"
      ])
    ),
    providerAllowlist: external_exports.array(external_exports.string()),
    fallbackMode: external_exports.enum(["fail_open", "fail_closed"]),
    refreshLockTtlMs: external_exports.number().min(2e3).max(12e4),
    registrationLockTtlMs: external_exports.number().min(2e3).max(12e4),
    waitPollIntervalMs: external_exports.number().min(25).max(5e3),
    waitJitterMs: external_exports.number().min(0).max(5e3),
    maxWaitMs: external_exports.number().min(0).max(12e4)
  }),
  sand_pressure_cpu_profiler_config: external_exports.object({
    // A capture arms only when two pressure windows land within this span.
    sustainedPressureWindowMs: external_exports.number(),
    profileDurationMs: external_exports.number(),
    // Minimum time between capture starts.
    minIntervalMs: external_exports.number(),
    // Newest profiles kept on the box's disk.
    maxRetainedProfiles: external_exports.number()
  }),
  // Silence budgets for a Sand turn's inference stream, both doubled per
  // transient retry by the runner. A value <= 0 disables that deadline.
  sand_stream_deadline_config: external_exports.object({
    // Budget before the attempt's FIRST streamed token.
    firstTokenDeadlineMs: external_exports.number(),
    // Budget between streamed events once output has started, applied only
    // while sand_stream_idle_deadline is on. Suspended while a tool call is in
    // flight, so it bounds provider silence and never tool work.
    idleDeadlineMs: external_exports.number()
  }),
  inline_diff_performance_config: external_exports.object({
    maxDecorations: external_exports.number()
  }),
  tray_refresh_config: external_exports.object({
    /** Allow Electron main to refresh cloud rows when no renderer is visible. */
    enableMainProcessCloudRefresh: external_exports.boolean().default(false),
    /** Unfocused poll while any tray agent is running. */
    activeIntervalMs: external_exports.number().int().min(5e3).max(36e5),
    /** Unfocused poll when the tray list is non-empty and idle. */
    idleIntervalMs: external_exports.number().int().min(5e3).max(36e5),
    /** Unfocused poll when the tray list is empty. */
    emptyIntervalMs: external_exports.number().int().min(5e3).max(36e5),
    /** Min gap between hover/click refresh requests. */
    engagementThrottleMs: external_exports.number().int().min(1e3).max(6e4),
    /** Max agent rows across all tray sections. */
    menuCap: external_exports.number().int().min(1).max(100),
    /** Background poll while unfocused. */
    enablePoll: external_exports.boolean(),
    /** Refresh on tray hover/click. */
    enableEngagement: external_exports.boolean(),
    /** Refresh on resume / unlock-screen. */
    enablePower: external_exports.boolean()
  }),
  performance_events_config: external_exports.object({
    enabled: external_exports.boolean(),
    flushIntervalMs: external_exports.number(),
    sampleRate: external_exports.number(),
    maxScriptsPerLoaf: external_exports.number(),
    maxBatchBytes: external_exports.number(),
    loafThresholdMs: external_exports.number(),
    maxEventsPerFlush: external_exports.number()
  }),
  composer_sandboxing_promo: external_exports.object({
    version: external_exports.number()
  }),
  sandbox_default_network_allowlist: external_exports.object({
    allowlist: external_exports.array(external_exports.string())
  }),
  playwright_log_configs: external_exports.object({
    logSizeThreshold: external_exports.number(),
    logPreviewLines: external_exports.number(),
    logPreviewChars: external_exports.number()
  }),
  privacy_mode_acknowledgement_onboarding: external_exports.object({
    mode: external_exports.enum(["off", "on_logged_in", "on"])
  }),
  tools_concurrency_config: external_exports.object({
    // Map of tool names to their concurrency settings
    // Tool names match ClientSideToolV2 enum string values (e.g., "RIPGREP_RAW_SEARCH")
    tools: external_exports.record(
      external_exports.string(),
      external_exports.object({
        ttl: external_exports.number().optional(),
        maxConcurrent: external_exports.number().optional()
      })
    ),
    // Default values for tools not explicitly configured
    defaultTtl: external_exports.number(),
    defaultMaxConcurrent: external_exports.number()
  }),
  client_rg: external_exports.object({
    num_threads: external_exports.number(),
    fallback_num_threads: external_exports.number(),
    use_batch_executor: external_exports.boolean(),
    batch_executor_wait_ms: external_exports.number()
  }),
  http2_ping_config: external_exports.object({
    enabled: external_exports.array(external_exports.string()),
    pingIdleConnection: external_exports.boolean().nullable(),
    pingIntervalMs: external_exports.number().nullable(),
    pingTimeoutMs: external_exports.number().nullable(),
    idleConnectionTimeoutMs: external_exports.number().nullable()
  }),
  http2_agent_connection_pool_config: external_exports.object({
    poolSize: external_exports.number()
  }),
  http1_keepalive_config: external_exports.object({
    keepAliveInitialDelayMs: external_exports.number().nullable()
  }),
  // Sizes the bounded Agent WebSocket connection pool, and is read only after
  // the `nal_websocket_client` gate has already turned the WebSocket on. The
  // client honors a whole number in 1..4 and reads everything else -- missing,
  // malformed, out of range, or an unavailable lookup -- as one connection (see
  // cursor-network's agentRunWebSocketSelection.ts), so this can widen a
  // running rollout but can never start one. Client-read only.
  nal_websocket_client_pool: external_exports.object({
    maxConnections: external_exports.number()
  }),
  // Live-tunable knobs for the dark WebSocket durability probe (master gate
  // `ws_dark_durability_probe`). All three params default to today's hardcoded
  // client constants and are clamped client-side (see cursor-network's
  // ws-reachability-probe.ts) so a bad remote value cannot make the probe
  // abusive: idle hold is capped below the server's 45s socket lifetime, the
  // echo/verification timeout has a floor + ceiling, and concurrency has a
  // small cap. Client-read only.
  ws_dark_durability_probe_config: external_exports.object({
    // Idle hold between the initial and final echo, in ms (default ~30s).
    idleHoldMs: external_exports.number(),
    // Per-echo verification timeout / cadence, in ms (default 5s).
    echoTimeoutMs: external_exports.number(),
    // Number of concurrent probe sockets (default 4).
    concurrency: external_exports.number()
  }),
  abort_controller_logging_config: external_exports.object({
    sampling_rate: external_exports.number()
  }),
  hooks_client_config: external_exports.object({
    // How long the agent submit gate waits for managed hooks to finish loading
    // before proceeding, in milliseconds (EXTY-779 readiness barrier).
    hooks_ready_timeout_ms: external_exports.number()
  }),
  composer_hang_detection_config: external_exports.object({
    thresholds_ms: external_exports.array(external_exports.number())
  }),
  composer_errors_without_button_support: external_exports.object({
    error_type_denylist: external_exports.array(external_exports.string())
  }),
  nal_stall_detector_timeout_config: external_exports.object({
    advisoryTimeoutMs: external_exports.number(),
    failTimeoutMs: external_exports.number()
  }),
  nal_request_context_blob_transport_config: external_exports.object({
    mode: external_exports.enum(["legacy", "dual", "ref_only"]),
    max_blob_bytes: external_exports.number().int().positive(),
    max_inline_dynamic_bytes: external_exports.number().int().positive()
  }),
  simulated_thinking_error_timeout: external_exports.object({
    timeout_ms: external_exports.number()
  }),
  agent_loop_phase_display: external_exports.object({
    enabled: external_exports.boolean(),
    min_display_threshold_ms: external_exports.number()
  }),
  in_app_ads_dev_override_config: external_exports.object({
    ad_id_to_show: external_exports.string()
  }),
  in_app_ads_quiet_period_config: external_exports.object({
    quiet_period_ms: external_exports.number(),
    first_launch_quiet_period_ms: external_exports.number()
  }),
  environment_setup_resume_config: external_exports.object({
    max_resume_age_ms: external_exports.number().int().min(MIN_ENVIRONMENT_SETUP_MAX_RESUME_AGE_MS).max(MAX_ENVIRONMENT_SETUP_MAX_RESUME_AGE_MS)
  }),
  perf_monitor_control: external_exports.object({
    enabled: external_exports.boolean(),
    subsample_polling_rate_sec: external_exports.number(),
    sample_polling_rate_min: external_exports.number()
  }),
  glass_reactivated_user_routing_config: external_exports.object({
    user_routing_enabled: external_exports.boolean(),
    inactive_days: external_exports.number(),
    ch_timeout_ms: external_exports.number(),
    ch_cache_ttl_seconds: external_exports.number(),
    /** Kill switch for client-local first-window reactivation (disk-mirrored). */
    local_routing_enabled: external_exports.boolean()
  }),
  retry_interceptor_config: external_exports.object({
    // Array of retriable error configurations
    // Each entry specifies a code and optional errorMessage substring to match
    retriableErrors: external_exports.array(
      external_exports.object({
        // ConnectRPC error code name (e.g., "Unavailable", "Internal")
        code: external_exports.string(),
        // Optional substring to match in error message
        errorMessage: external_exports.string().optional(),
        // Optional method name to scope this rule to a specific RPC method
        method: external_exports.string().optional()
      })
    )
  }),
  retry_interceptor_params_config: external_exports.object({
    // Override parameters for retry interceptor behavior.
    // nullish: native Statsig rejects undefined getValue fallbacks.
    maxRetries: external_exports.number().nullish(),
    baseDelayMs: external_exports.number().nullish(),
    maxDelayMs: external_exports.number().nullish()
  }),
  text_delta_pacing_config: external_exports.object({
    // Max chars released per frame-driven coalescer flush; 0 disables pacing
    // (pure coalescing). Codex desktop uses 24.
    targetCharsPerFrame: external_exports.number(),
    // A frame releases at least ceil(buffered/maxLagFrames) chars so display
    // lag stays bounded under sustained pressure.
    maxLagFrames: external_exports.number(),
    // Max ms an ordering barrier waits for a graceful paced drain before
    // force-flushing; 0 = barriers flush instantly.
    barrierMaxWaitMs: external_exports.number()
  }),
  extension_monitor_control: external_exports.object({
    local_enabled: external_exports.boolean(),
    backend_reporting_enabled: external_exports.boolean(),
    // Gates per-process network bandwidth diagnostics (nettop reads, sample
    // network fields, live column). Optional and off unless explicitly set true.
    network_diagnostics_reporting_enabled: external_exports.boolean().optional(),
    subsample_polling_rate_sec: external_exports.number(),
    sample_polling_rate_min: external_exports.number()
  }),
  agent_memory_pressure_monitor: external_exports.object({
    // Master switch for the client-side monitor that identifies agent-spawned
    // processes and reports them under sustained low system memory. When false
    // the monitor is a complete no-op.
    monitor_enabled: external_exports.boolean(),
    // How long available memory must stay low, in seconds, before a report is
    // produced (converted to consecutive proclist samples at the configured
    // sampling cadence).
    low_memory_sustained_sec: external_exports.number(),
    // Minimum observed age, in seconds, for an agent-spawned process to be
    // included in a report. 0 includes every currently-observed process.
    min_agent_process_age_sec: external_exports.number(),
    // Memory is considered low when availability drops below this percentage
    // of total memory OR below the absolute floor in GB.
    low_memory_available_pct: external_exports.number(),
    low_memory_available_abs_gb: external_exports.number(),
    // System CPU utilization (0-100, all cores) at or above which the system
    // is considered under CPU pressure.
    cpu_high_pct: external_exports.number(),
    // How long CPU must stay high, in seconds, before a report is produced
    // (converted to consecutive proclist samples at the configured cadence).
    cpu_high_sustained_sec: external_exports.number(),
    // Agent processes below this CPU utilization (0-100, per core) are left
    // out of a report, so it surfaces the actual CPU consumers.
    min_reported_cpu_pct: external_exports.number()
  }),
  sand_process_metrics: external_exports.object({
    local_enabled: external_exports.boolean(),
    backend_reporting_enabled: external_exports.boolean(),
    subsample_polling_rate_sec: external_exports.number(),
    sample_polling_rate_min: external_exports.number()
  }),
  sand_rpc_tracing: external_exports.object({
    // Master switch for the Sand desktop backend-RPC CLIENT spans; when off
    // the interceptor is a pure passthrough (no spans, no traceparent header).
    enabled: external_exports.boolean(),
    // Fraction (0..1) of desktop-minted RPCs that record a span, decided per
    // request; read live so a Statsig change applies without restart.
    sample_ratio: external_exports.number()
  }),
  gc_trace_control: external_exports.object({
    enabled: external_exports.boolean(),
    drain_interval_sec: external_exports.number()
  }),
  disable_infinite_cloud_agent_stream_retries: external_exports.object({
    enabled: external_exports.boolean()
  }),
  cloud_agent_shared_blob_cache: external_exports.object({
    /** Max bytes for the IDE's shared cloud agent blob cache. */
    max_bytes: external_exports.number()
  }),
  /**
   * Concurrent-run cap for LOCAL (in-client / agent-host) Task subagents —
   * the local counterpart of `cloud_agent_subagent_limits.maxRunning`.
   * Safety net against runaway local fan-out (e.g. resume replays
   * re-spawning children). Target by `teamID` / `userID` in Statsig.
   */
  local_subagent_limits: external_exports.object({
    maxRunning: external_exports.number().int().positive()
  }),
  // Minimum Sand desktop version, as two independently movable floors:
  //  - min_version: DESKTOP updater floor (real stamped app version → update blocker).
  //  - backend_min_version: BACKEND gate on desktop-originated box endpoints
  //    (utils/sandMinClientVersionGate.ts). Keep the code fallback "". Intended
  //    prod floor after the accurate-version client ships and dry-run confirms
  //    coverage: "0.1.255". Separate from min_version because every build that
  //    still sends frozen 0.1.0 on the wire would share that desktop floor and
  //    block the whole fleet. While "" the backend gate only dry-runs.
  sand_min_client_version: external_exports.object({
    min_version: external_exports.string(),
    backend_min_version: external_exports.string(),
    // Desktop floor for receiving port-scoped noVNC viewer URLs (SAND-SEC-01).
    // A desktop below this predates the vnc-trust port_token header
    // re-attachment, so it keeps the pod-wide network_token. Empty disables the
    // port_token rollout for desktops (fail closed); set to the release that
    // ships the vnc-trust fix when ramping sand_novnc_port_token.
    novnc_port_token_min_version: external_exports.string(),
    // Desktop floor for the hosted MCP OAuth callback
    // (grok_bot_desktop_mcp_oauth_hosted_callback). A desktop below this does
    // not recognize a portal redirect plus `.tgd` state as its own loopback
    // flow and never arms its listener, so the rewrite is withheld from it.
    // Empty disables the rewrite for every desktop (fail closed).
    hosted_mcp_oauth_callback_min_version: external_exports.string()
  }),
  // Sand-mobile build support. An install below `min_recommended_build` gets a
  // dismissible update prompt; below `min_allowed_build` it must update before
  // continuing. The floor is the native build number (iOS `CFBundleVersion`),
  // not a version string, because CI stamps that number per release.
  // A floor of 0 keeps that level off. The client also requires an https
  // apple.com / cursor.com `update_url`, so a bad config fails open.
  sand_mobile_version_support: external_exports.object({
    min_recommended_build: external_exports.number(),
    min_allowed_build: external_exports.number(),
    update_url: external_exports.string()
  }),
  sand_computer_use_playwright_config: external_exports.object({
    modelId: external_exports.string().min(1),
    maxMode: external_exports.boolean(),
    parameters: external_exports.array(
      external_exports.object({
        id: external_exports.string().min(1),
        value: external_exports.string()
      })
    )
  }),
  // The complete model selection Sand's browserUse subagent runs on. Read in
  // the Sand host via getBrowserUseModelOverride.
  sand_browser_use_model: external_exports.object({
    modelId: external_exports.string().min(1),
    maxMode: external_exports.boolean(),
    parameters: external_exports.array(
      external_exports.object({
        id: external_exports.string().min(1),
        value: external_exports.string()
      })
    )
  }),
  // Grok bot conversation-bundle size limits (MB), enforced only while the
  // grok_bot_conversation_gc gate is on: past soft_limit_mb the host schedules
  // the background reachability sweep; a bundle still over hard_limit_mb after
  // the turn-start sweep refuses the turn. Read live per evaluation in the
  // grok bot host (not pinned at bootstrap), so a raise reaches a capped
  // conversation without a host restart. Non-positive values fall back to the
  // defaults.
  grok_bot_conversation_size_limits: external_exports.object({
    soft_limit_mb: external_exports.number(),
    hard_limit_mb: external_exports.number()
  }),
  // Sand's named-model allowlist outside `sand_model_selection`, plus optional
  // parameters mobile applies when the user explicitly picks a model.
  sand_model_filter: external_exports.object({
    allowedModelIds: external_exports.array(external_exports.string()),
    defaultParameters: external_exports.record(
      external_exports.string().min(1),
      external_exports.array(
        external_exports.object({
          id: external_exports.string().min(1),
          value: external_exports.string()
        })
      )
    )
  }),
  // The complete model request Sand's `sand_model_selection` TREATMENT arm
  // runs on: a catalog model id plus whatever structured parameters that model
  // supports. It replaces the retired `sand_default_model_auto` boolean gate,
  // whose only expressible destination was the backend Auto tier. Read live per
  // turn in the Sand host and decoded there by resolveSandDefaultModelConfig
  // (sand/src/shared/node/experiments/sand-model-config.ts), which refuses anything this schema
  // would reject and every payload below and keeps the turn on Sand's baked-in
  // default instead. Users outside the experiment, the control arm, explicit
  // user model selections, and the independent summarizer / computer-use /
  // pinned-subagent models are never affected.
  // No `version` key, and not `.strict()`: an unrecognized top-level key is
  // dropped rather than refusing the payload, so a console value still carrying
  // the retired `version` keeps routing as it does today.
  sand_default_model: external_exports.object({
    // The catalog model id to request, verbatim — a named model
    // (`claude-opus-4-8`, `gpt-5.6-sol`) or a routed tier (`default` for
    // Auto). Empty means "no override": the treatment arm keeps Sand's
    // baked-in default Opus request, byte-identical to the control arm.
    modelId: external_exports.string(),
    maxMode: external_exports.boolean(),
    // The model's parameters as structured id/value pairs — exactly the
    // `RequestedModel.parameters` wire shape Sand's own picker persists,
    // never a legacy encoded slug. Ids must be unique, and a routed model id
    // must carry none (routed tiers own their parameters server-side).
    parameters: external_exports.array(
      external_exports.object({
        id: external_exports.string().min(1),
        value: external_exports.string()
      })
    )
  }),
  // The `sand_default_model` counterpart for AUTOMATION runs: the model request
  // an allocated `sand_model_selection` user's automation wakes use instead of
  // `sand_default_model`. Same contract in every respect — same fields, same
  // shallow top-level inheritance over the fallback below, same decoder
  // (resolveSandDefaultModelConfig in sand/src/shared/node/experiments/sand-model-config.ts) —
  // so the two cannot drift. It applies only while the experiment is active,
  // and only to turns this box's own automation runtime stamped
  // `requestSource: "automation"`: a scheduled/event/"Run now" wake, the LOCAL
  // members of a room it fires, their subagents, and a forced-upgrade resume of
  // one. A refused payload falls back to `sand_default_model`, i.e. today's
  // behavior.
  sand_automations_model: external_exports.object({
    modelId: external_exports.string(),
    maxMode: external_exports.boolean(),
    parameters: external_exports.array(
      external_exports.object({
        id: external_exports.string().min(1),
        value: external_exports.string()
      })
    )
  }),
  // Sand's in-chat feedback prompt ("How was this result?"): the Sand host
  // samples successful user-visible turns and appends the prompt entry itself
  // — this deliberately does NOT reuse `agent_feedback_request_config`
  // (client: false, IDE/Glass tray semantics, different knob values).
  sand_feedback_prompt_config: external_exports.object({
    enabled: external_exports.boolean(),
    // One prompt per this many successful turns (1/N sampling).
    sample_rate_denominator: external_exports.number(),
    // Per-user suppression window after a prompt is shown.
    cooldown_seconds: external_exports.number(),
    // No prompts for this long after the user's first sign-in.
    signup_grace_seconds: external_exports.number()
  }),
  /**
   * Sync-based agent-store client knobs (glass / IDE / CLI / private workers).
   * Top-level fields apply to every surface; optional `surfaces.ide|cli|
   * private_worker` overrides layer on top. Clients clamp via
   * resolveAgentStoreSyncClientConfig.
   */
  agent_store_sync_client_config: external_exports.object({
    sync_debounce_ms: external_exports.number().int().min(250).max(36e5),
    sync_backoff_base_ms: external_exports.number().int().min(100).max(36e5),
    sync_backoff_max_ms: external_exports.number().int().min(100).max(36e5),
    project_sync_debounce_ms: external_exports.number().int().min(250).max(36e5),
    project_sync_backoff_base_ms: external_exports.number().int().min(100).max(36e5),
    project_sync_backoff_max_ms: external_exports.number().int().min(100).max(36e5),
    passive_retry_interval_ms: external_exports.number().int().min(0).max(36e5),
    passive_index_poll_interval_ms: external_exports.number().int().min(0).max(36e5),
    project_store_poll_interval_ms: external_exports.number().int().min(250).max(36e5),
    max_file_size_bytes: external_exports.number().int().min(1024).max(1024 * 1024 * 1024),
    token_refresh_buffer_ms: external_exports.number().int().min(0).max(10 * 6e4),
    rpc_retry_max_attempts: external_exports.number().int().min(1).max(10),
    rpc_retry_base_delay_ms: external_exports.number().int().min(1).max(6e4),
    rpc_retry_max_delay_ms: external_exports.number().int().min(1).max(5 * 6e4),
    rpc_retry_multiplier: external_exports.number().min(1).max(10),
    rpc_timeout_ms: external_exports.number().int().min(1e3).max(6e5),
    blob_idle_timeout_ms: external_exports.union([
      external_exports.literal(0),
      external_exports.number().int().min(1e3).max(6e5)
    ]),
    // `0` disables the whole-round watchdog.
    sync_round_timeout_ms: external_exports.union([
      external_exports.literal(0),
      external_exports.number().int().min(3e4).max(36e5)
    ]),
    sync_round_unwind_timeout_ms: external_exports.number().int().min(1e3).max(6e5),
    lock_release_failure_threshold: external_exports.number().int().min(1).max(20),
    // `0` disables host suspend/resume detection.
    resume_gap_threshold_ms: external_exports.union([
      external_exports.literal(0),
      external_exports.number().int().min(3e4).max(36e5)
    ]),
    // `0` disables the dirty-passive stalled-holder watchdog (observability).
    dirty_passive_stalled_threshold_ms: external_exports.union([
      external_exports.literal(0),
      external_exports.number().int().min(3e4).max(36e5)
    ]),
    s3_concurrency: external_exports.number().int().min(1).max(64),
    list_concurrency: external_exports.number().int().min(1).max(64),
    hash_concurrency: external_exports.number().int().min(1).max(64),
    presign_concurrency: external_exports.number().int().min(1).max(64),
    multipart_upload_threshold_bytes: external_exports.number().int().min(5 * 1024 * 1024).max(1024 * 1024 * 1024),
    multipart_part_size_bytes: external_exports.number().int().min(5 * 1024 * 1024).max(512 * 1024 * 1024),
    multipart_presign_window_size: external_exports.number().int().min(1).max(32),
    // Max pinned to the server presign cap (`agentStore:maxPresignFiles`).
    pull_presign_window_size: external_exports.number().int().min(1).max(1e3),
    multipart_complete_max_attempts: external_exports.number().int().min(1).max(5),
    multipart_max_restarts: external_exports.number().int().min(0).max(2),
    multipart_max_conflict_renames: external_exports.number().int().min(0).max(2),
    multipart_max_expiry_refreshes: external_exports.number().int().min(0).max(3),
    write_barrier_timeout_ms: external_exports.number().int().min(0).max(6e4),
    scoped_reserved_slots: external_exports.number().int().min(0).max(8),
    path_sync_request_poll_ms: external_exports.number().int().min(0).max(6e4),
    path_sync_request_wait_poll_ms: external_exports.number().int().min(1).max(6e4),
    // Must stay positive; 0 is not a disable.
    exclusive_mutation_claim_poll_ms: external_exports.number().int().min(50).max(6e4),
    // `0` disables local store-root reaping. Clients keep any other
    // positive value; missing falls back to 7 days.
    stale_store_root_max_idle_ms: external_exports.number().int().min(0),
    // `1` disables the SINCE tombstone cursor (always INCLUDE).
    tombstone_full_refresh_rounds: external_exports.number().int().min(1),
    // `0` disables the wall-clock INCLUDE refresh. Any other non-negative
    // integer is kept; missing falls back to 24 hours.
    tombstone_full_refresh_interval_ms: external_exports.number().int().min(0),
    // Extra age past the server floor before a local tombstone row is
    // dropped. Any non-negative integer is kept; missing falls back to 3 days.
    tombstone_prune_slack_ms: external_exports.number().int().min(0),
    surfaces: external_exports.record(
      external_exports.string(),
      external_exports.object({
        sync_debounce_ms: external_exports.number().int().min(250).max(36e5).optional(),
        sync_backoff_base_ms: external_exports.number().int().min(100).max(36e5).optional(),
        sync_backoff_max_ms: external_exports.number().int().min(100).max(36e5).optional(),
        project_sync_debounce_ms: external_exports.number().int().min(250).max(36e5).optional(),
        project_sync_backoff_base_ms: external_exports.number().int().min(100).max(36e5).optional(),
        project_sync_backoff_max_ms: external_exports.number().int().min(100).max(36e5).optional(),
        passive_retry_interval_ms: external_exports.number().int().min(0).max(36e5).optional(),
        passive_index_poll_interval_ms: external_exports.number().int().min(0).max(36e5).optional(),
        project_store_poll_interval_ms: external_exports.number().int().min(250).max(36e5).optional(),
        max_file_size_bytes: external_exports.number().int().min(1024).max(1024 * 1024 * 1024).optional(),
        token_refresh_buffer_ms: external_exports.number().int().min(0).max(10 * 6e4).optional(),
        rpc_retry_max_attempts: external_exports.number().int().min(1).max(10).optional(),
        rpc_retry_base_delay_ms: external_exports.number().int().min(1).max(6e4).optional(),
        rpc_retry_max_delay_ms: external_exports.number().int().min(1).max(5 * 6e4).optional(),
        rpc_retry_multiplier: external_exports.number().min(1).max(10).optional(),
        rpc_timeout_ms: external_exports.number().int().min(1e3).max(6e5).optional(),
        blob_idle_timeout_ms: external_exports.union([external_exports.literal(0), external_exports.number().int().min(1e3).max(6e5)]).optional(),
        sync_round_timeout_ms: external_exports.union([
          external_exports.literal(0),
          external_exports.number().int().min(3e4).max(36e5)
        ]).optional(),
        sync_round_unwind_timeout_ms: external_exports.number().int().min(1e3).max(6e5).optional(),
        lock_release_failure_threshold: external_exports.number().int().min(1).max(20).optional(),
        resume_gap_threshold_ms: external_exports.union([
          external_exports.literal(0),
          external_exports.number().int().min(3e4).max(36e5)
        ]).optional(),
        dirty_passive_stalled_threshold_ms: external_exports.union([
          external_exports.literal(0),
          external_exports.number().int().min(3e4).max(36e5)
        ]).optional(),
        s3_concurrency: external_exports.number().int().min(1).max(64).optional(),
        list_concurrency: external_exports.number().int().min(1).max(64).optional(),
        hash_concurrency: external_exports.number().int().min(1).max(64).optional(),
        presign_concurrency: external_exports.number().int().min(1).max(64).optional(),
        multipart_upload_threshold_bytes: external_exports.number().int().min(5 * 1024 * 1024).max(1024 * 1024 * 1024).optional(),
        multipart_part_size_bytes: external_exports.number().int().min(5 * 1024 * 1024).max(512 * 1024 * 1024).optional(),
        multipart_presign_window_size: external_exports.number().int().min(1).max(32).optional(),
        pull_presign_window_size: external_exports.number().int().min(1).max(1e3).optional(),
        multipart_complete_max_attempts: external_exports.number().int().min(1).max(5).optional(),
        multipart_max_restarts: external_exports.number().int().min(0).max(2).optional(),
        multipart_max_conflict_renames: external_exports.number().int().min(0).max(2).optional(),
        multipart_max_expiry_refreshes: external_exports.number().int().min(0).max(3).optional(),
        write_barrier_timeout_ms: external_exports.number().int().min(0).max(6e4).optional(),
        scoped_reserved_slots: external_exports.number().int().min(0).max(8).optional(),
        path_sync_request_poll_ms: external_exports.number().int().min(0).max(6e4).optional(),
        path_sync_request_wait_poll_ms: external_exports.number().int().min(1).max(6e4).optional(),
        exclusive_mutation_claim_poll_ms: external_exports.number().int().min(50).max(6e4).optional(),
        stale_store_root_max_idle_ms: external_exports.number().int().min(0).optional(),
        tombstone_full_refresh_rounds: external_exports.number().int().min(1).optional(),
        tombstone_full_refresh_interval_ms: external_exports.number().int().min(0).optional(),
        tombstone_prune_slack_ms: external_exports.number().int().min(0).optional()
      }).strict()
    ).default({})
  }).strict(),
  gemini_video_attachment_config: external_exports.object({
    maxBytes: external_exports.number().int().positive(),
    inlineMaxBytes: external_exports.number().int().positive(),
    signedUrlMaxBytes: external_exports.number().int().positive(),
    cloudMaxVideoAttachmentsPerRequest: external_exports.number().int().nonnegative(),
    cloudMaxDocumentAttachmentsPerRequest: external_exports.number().int().nonnegative(),
    localMaxVideoAttachmentsPerRequest: external_exports.number().int().positive(),
    localMaxTotalInlineVideoBytesPerRequest: external_exports.number().int().positive()
  }),
  background_composer_list_limit: external_exports.object({
    limit: external_exports.number()
  }),
  switch_to_model_slug_config: external_exports.object({
    /** The model slug to switch to when the switchToDynamicModelSlug command is executed */
    modelSlug: external_exports.string(),
    modelIdWithParams: external_exports.object({
      modelId: external_exports.string(),
      params: external_exports.array(
        external_exports.object({
          id: external_exports.string(),
          value: external_exports.string()
        })
      )
    })
  }),
  debug_mode_ui_instructions_config: external_exports.object({
    proceed_instructions: external_exports.string(),
    mark_fixed_instructions: external_exports.string()
  }),
  user_intent_config: external_exports.object({
    /** Maximum number of recent chats to read */
    maxChatsToRead: external_exports.number(),
    /** Maximum number of projects to group */
    maxProjectsToGroup: external_exports.number(),
    /** Model to use for user intent generation */
    model: external_exports.string(),
    /** The first step prompt template (context gathering). Use placeholders: {{agentTranscriptsPath}}, {{projectDirPath}}, {{maxChatsToRead}}, {{maxProjectsToGroup}}, {{userIntentDirPath}}, {{finalUserIntentDirPath}} */
    promptTemplate: external_exports.string(),
    /** The second step prompt template (file writing). Use placeholders: {{agentTranscriptsPath}}, {{projectDirPath}}, {{maxChatsToRead}}, {{maxProjectsToGroup}}, {{userIntentDirPath}}, {{finalUserIntentDirPath}} */
    secondStepPromptTemplate: external_exports.string()
  }),
  browser_default_url_config: external_exports.object({
    defaultUrl: external_exports.string()
  }),
  glass_per_app_tabs_config: external_exports.object({
    agentTabSelectionTTL: external_exports.number()
  }),
  glass_tiling_config: external_exports.object({
    showDraftsInSidebar: external_exports.boolean()
  }),
  glass_fsd_launch_pill_config: external_exports.object({
    /** Primary label on the FSD launch pill in Glass followup chrome. */
    pillLabel: external_exports.string().min(1).max(80),
    /** Tooltip shown on hover/focus for the launch pill. */
    tooltip: external_exports.string().min(1).max(240),
    /** aria-label for the cloud/local runtime dropdown trigger. */
    dropdownAriaLabel: external_exports.string().min(1).max(120),
    /** Dropdown menu option for cloud FSD. */
    cloudOptionLabel: external_exports.string().min(1).max(80),
    /** Dropdown menu option for local FSD. */
    localOptionLabel: external_exports.string().min(1).max(80),
    /** Fix-CI pill label when exactly one check failed (default chrome copy). */
    fixCiPillSingleLabel: external_exports.string().min(1).max(80),
    /** Fix-CI pill label template when multiple checks failed; use `{count}`. */
    fixCiPillPluralLabelTemplate: external_exports.string().min(1).max(120),
    fixCiPillLoadingLabel: external_exports.string().min(1).max(80),
    fixCiPillLoadingProgressLabel: external_exports.string().min(1).max(80),
    /** Fix-CI pill copy shown when `full_self_driving_glass` is enabled. */
    fsdFixCiPillSingleLabel: external_exports.string().min(1).max(80),
    /** FSD Fix-CI pill plural template when multiple checks failed; use `{count}`. */
    fsdFixCiPillPluralLabelTemplate: external_exports.string().min(1).max(120),
    fsdFixCiPillLoadingLabel: external_exports.string().min(1).max(80),
    fsdFixCiPillLoadingProgressLabel: external_exports.string().min(1).max(80)
  }),
  // Copy + destinations for the contextual Grok Bot banner, shared by both
  // the v1 and v2 experiments. Split from them so copy and the download link
  // can be retuned without a client release or a re-ramp.
  // Clients re-validate both URLs before opening them: `downloadUrl` must be
  // http(s) and `openUrl` must be a Grok Bot deep-link scheme.
  grok_bot_contextual_banner_copy: external_exports.object({
    title: external_exports.string().min(1).max(120),
    description: external_exports.string().min(1).max(240),
    /** CTA when Grok Bot is not installed on this machine. */
    downloadCtaLabel: external_exports.string().min(1).max(40),
    downloadUrl: external_exports.string().url(),
    /** CTA when Grok Bot is already installed. */
    openCtaLabel: external_exports.string().min(1).max(40),
    openUrl: external_exports.string().min(1).max(2048)
  }),
  glass_btw_side_question_prompt_config: external_exports.object({
    promptTemplate: external_exports.string()
  }),
  // Per-repository LRU cap for the Glass loaded-agent caches (local and cloud each); clients clamp to [2, 10].
  glass_loaded_agent_lru_cap: external_exports.object({
    max_loaded_agents: external_exports.number().int().min(2).max(10)
  }),
  // Release a hidden chat's resident bubble bodies when its transcript unmounts, keeping the last `keep_recent_hidden` for instant re-open. Off until `enabled`.
  composer_hidden_bubble_eviction: external_exports.object({
    enabled: external_exports.boolean(),
    keep_recent_hidden: external_exports.number().int().min(0)
  }),
  // Client-tunable Glass large-file code gate (bytes); clients clamp to [150KB, 50MB].
  glass_large_file_gate_config: external_exports.object({
    code_gate_bytes: external_exports.number().int().min(153600).max(52428800)
  }),
  // Datadog reporting of Glass workspace lifecycle: materialized gauges plus
  // created/closed/GC-finalized counters from the WorkspaceRetentionTracker.
  glass_workspace_lifecycle_metrics: external_exports.object({
    enabled: external_exports.boolean(),
    /** Interval in milliseconds between metric sweeps. */
    sweep_interval_ms: external_exports.number().int().positive(),
    /** Age in milliseconds after close before a still-unfinalized workspace counts as retained (leak signal). */
    retained_after_close_threshold_ms: external_exports.number().int().positive()
  }),
  glass_pr_operations_polling_config: external_exports.object({
    /** Glass PR tab CI checks (`usePullRequestChecks`). */
    prChecksPollIntervalMs: external_exports.number().int().positive(),
    prChecksPollMaxBackoffMs: external_exports.number().int().positive(),
    /** Per-error backoff multiplier for Glass PR checks polling (>= 1). */
    prChecksErrorBackoffMultiplier: external_exports.number().min(1).max(4),
    /** Redis TTL for SCM PR check status cache (`scmPullRequestCheckStatusCache`). */
    prChecksCacheTtlSeconds: external_exports.number().int().positive(),
    /** Redis TTL for SCM PR metadata cache (`scmPullRequestCache` metadata entries). */
    scmPrMetadataCacheTtlSeconds: external_exports.number().int().positive(),
    /** Per-viewer detailed PR status blob cache (`scmPullRequestCache`). */
    scmPrDetailedStatusCacheTtlSeconds: external_exports.number().int().positive(),
    /** Branch → PR URL list cache when at least one PR exists (`scmPullRequestForBranchCache`). */
    scmPrForBranchCacheTtlWhenPrsSeconds: external_exports.number().int().positive(),
    /** Branch → PR URL list negative cache (`scmPullRequestForBranchCache`). */
    scmPrForBranchCacheTtlWhenEmptySeconds: external_exports.number().int().positive(),
    /** PR codeowners path lookup cache (`scmPullRequestCodeownersCache`). */
    scmPrCodeownersCacheTtlSeconds: external_exports.number().int().positive(),
    /** PR commits page cache (`scmPullRequestPanelDataCache`). */
    scmPrCommitsCacheTtlSeconds: external_exports.number().int().positive(),
    /** PR timeline events page cache (`scmPullRequestPanelDataCache`). */
    scmPrTimelineEventsCacheTtlSeconds: external_exports.number().int().positive(),
    /** PR discussions cache (`scmPullRequestPanelDataCache`). */
    scmPrDiscussionsCacheTtlSeconds: external_exports.number().int().positive(),
    /** Successful check log excerpt cache (`scmPullRequestCheckLogExcerptCache`). */
    scmPrCheckLogExcerptOkTtlSeconds: external_exports.number().int().positive(),
    /** Miss / non-OK check log excerpt cache (`scmPullRequestCheckLogExcerptCache`). */
    scmPrCheckLogExcerptNegativeTtlSeconds: external_exports.number().int().positive(),
    /** Redis breaker after checks-scoped auth failure (`getDetailedPullRequestStatus`). */
    detailedPrStatusChecksScopedAuthBreakerTtlSeconds: external_exports.number().int().positive(),
    /** GitLab emoji reaction idempotency cache (`providerGitlab`). */
    scmGitlabEmojiReactionCacheTtlSeconds: external_exports.number().int().positive(),
    /** Local agent sidebar/header PR metadata batch refresh. */
    localAgentPrHeaderBatchPollIntervalMs: external_exports.number().int().positive(),
    /** Steady-state local agent PR state refresh. */
    localAgentPrStatePollIntervalMs: external_exports.number().int().positive(),
    /** Wall-clock offsets for local PR burst bumps after git/PR actions. */
    localAgentPrBurstBumpOffsetsMs: external_exports.array(external_exports.number().int().nonnegative()),
    /** Steady-state cloud agent PR state poller interval. */
    cloudAgentPrStatePollIntervalMs: external_exports.number().int().positive(),
    /** Wall-clock offsets for cloud PR burst bumps after git/PR actions. */
    cloudAgentPrBurstBumpOffsetsMs: external_exports.array(external_exports.number().int().nonnegative()),
    /** Cap cloud agent PR state poller error backoff (ms). */
    cloudAgentPrStatePollMaxBackoffMs: external_exports.number().int().positive(),
    /** Per-failure backoff multiplier for cloud PR state poller (>= 1). */
    cloudAgentPrErrorBackoffMultiplier: external_exports.number().min(1).max(4)
  }),
  cloud_agent_stream_reattach: external_exports.object({
    /** Kill switch: when false, a reconnect always resumes from the last offset (pre-fix behavior). */
    enabled: external_exports.boolean(),
    /** Reconnect gap past which the client re-attaches fresh and hydrates the snapshot atomically instead of replaying the missed backlog through the live lane. */
    rehydrateAfterMs: external_exports.number().int().nonnegative()
  }),
  tool_limits_config: external_exports.object({
    /** Maximum file size in bytes for deep search (default: 2MB) */
    readFilesToolMaxFileSizeInBytes: external_exports.number(),
    /** Maximum file size in characters before switching to search/replace (default: 150000) */
    editFileToolMaxFileSizeInChars: external_exports.number(),
    /** Maximum number of results for file search (default: 10) */
    fileSearchToolMaxResults: external_exports.number(),
    /** Character budget for list_dir_v2 on client side (default: 1000) */
    listDirV2ClientSideCharacterBudget: external_exports.number(),
    /** Maximum file size in bytes for read_file_v2 (default: 200MB) */
    readFileV2ToolMaxFileSizeInBytes: external_exports.number(),
    /** Maximum computation time in ms for composer diff (default: 1000) */
    composerDiffMaxComputationTimeMs: external_exports.number()
  }),
  /** Update prompt configuration for controlling frequency and throttling */
  update_prompt_config: external_exports.object({
    /** Minimum hours between any two prompts for a user */
    min_hours_between_prompts: external_exports.number(),
    /** Maximum times to prompt about a specific target version */
    max_prompts_per_version: external_exports.number(),
    /** Maximum prompts per day */
    max_prompts_per_day: external_exports.number(),
    /** How long "Remind me later" suppresses prompts (hours) */
    snooze_duration_hours: external_exports.number()
  }),
  internal_release_track_override: external_exports.object({
    releaseTrack: external_exports.string(),
    statsigUrl: external_exports.string(),
    // Unlocks dogfood/candidate as selectable tracks without forcing one.
    unlockInternalTracks: external_exports.boolean()
  }),
  sand_internal_release_track_override: external_exports.object({
    // Managed track override; "" leaves the user's saved selection in charge.
    releaseTrack: external_exports.string(),
    // Reveals internal tracks (dogfood) in Sand's picker without forcing one.
    unlockInternalTracks: external_exports.boolean()
  }),
  // Who may create or flip a Grok Bot template's parent audience. Fallback
  // `team_only` (any team member). Console targeting is team-scoped:
  // `all` lets the owner choose PUBLIC or TEAM, `none` disables export.
  // Users with no team create PUBLIC and never see an audience picker.
  // `team_only` keeps an already-PUBLIC template public (publish and
  // version updates still work) but blocks choosing PUBLIC again.
  // This config never gates public preview or import.
  sand_share_bot_export_policy: external_exports.object({
    policy: external_exports.enum(["all", "team_only", "none"])
  }),
  // The IN-BOX host bundle's release channel — the sibling of the config above,
  // which covers the DESKTOP app. Read live by the in-box host every watch tick
  // (sand/src/host/extensions/host-upgrade) and, for the supervisor's
  // pre-host boot-fetch, at box create by the broker.
  sand_host_bundle_channel: external_exports.object({
    // A SAND_HOST_BUNDLE_CHANNELS name. Left a plain string (like releaseTrack
    // above) because both readers funnel every channel signal through
    // coerceSandHostBundleChannel, so exactly one place decides what an
    // unrecognized value means. "" = no opinion.
    channel: external_exports.string(),
    // null = leave the built-in 24h host bundle watch in charge. Null rather
    // than 0 so no reader can spend it as a real interval: `?? default` on 0
    // yields a zero-delay timer, on null it yields the default. Bounds match
    // the host-side clamp, and per-field recovery means an out-of-range value
    // here cannot disturb `channel`.
    watchIntervalMs: external_exports.number().min(10 * 6e4).max(7 * 24 * 60 * 6e4).nullable()
  }),
  /** Configuration for giant JSON.stringify detection */
  giant_json_stringify_config: external_exports.object({
    /** Threshold in bytes above which to report to Sentry */
    sentry_threshold_bytes: external_exports.number(),
    /** When true, attach the JSON content to the Sentry error */
    attach_content: external_exports.boolean()
  }),
  /** Configuration for giant buffer retention detection */
  giant_buffer_retention_config: external_exports.object({
    /** Threshold in bytes above which to track VSBuffer allocations */
    allocation_threshold_bytes: external_exports.number(),
    /** Threshold in bytes above which to track blob URLs */
    blob_url_threshold_bytes: external_exports.number(),
    /** Age in milliseconds before a live allocation/blob URL is reported */
    retention_age_ms: external_exports.number(),
    /** Sweep interval in milliseconds */
    sweep_interval_ms: external_exports.number()
  }),
  /** Configuration for giant JSON.parse detection */
  giant_json_parse_config: external_exports.object({
    /** Threshold in bytes above which to report to Sentry */
    sentry_threshold_bytes: external_exports.number()
  }),
  /** Configuration for giant VSBuffer decode (TextDecoder) detection */
  giant_vsbuffer_decode_config: external_exports.object({
    /** Threshold in bytes above which to report to Sentry */
    sentry_threshold_bytes: external_exports.number()
  }),
  /** MCP IPC timeouts (ms) */
  mcp_ipc_timeouts: external_exports.object({
    metadata_timeout_ms: external_exports.number(),
    lifecycle_timeout_ms: external_exports.number(),
    dashboard_timeout_ms: external_exports.number(),
    recovery_per_retry_timeout_ms: external_exports.number()
  }),
  /** Configuration for Sentry session recording - internal users only */
  sentry_session_recording_config: external_exports.object({
    /** Sample rate for session replay recordings (0.0 to 1.0) */
    replays_session_sample_rate: external_exports.number().min(0).max(1)
  }),
  /**
   * ⚠️ SECURITY WARNING: Extension Signature Verification Bypass List ⚠️
   *
   * This config contains extension IDs that BYPASS signature verification entirely.
   * Extensions in this list will be loaded WITHOUT cryptographic verification,
   * creating a potential security vulnerability.
   *
   * This bypass exists because some extensions lack proper OpenVSX signatures.
   * Once all extensions in this list have upstream signatures, this config
   * should be RETIRED and the bypass mechanism removed.
   *
   * Adding extensions to this list should be done with extreme caution and
   * only after confirming the extension cannot be signed through normal channels.
   */
  extension_signature_verification_bypass_list: external_exports.object({
    /** Extension IDs that bypass signature verification (lowercase). USE WITH CAUTION. */
    extensionIds: external_exports.array(external_exports.string()),
    /** Minimum client version required for remote extension hash verification (semver). Clients below this version skip remote verification entirely. */
    remoteVerificationMinVersion: external_exports.string()
  }),
  /** UI labels for the auto spillover 2-bar UI in the spending tab */
  auto_spillover_ui_config: external_exports.object({
    autoTitle: external_exports.string(),
    autoDescription: external_exports.string(),
    apiTitle: external_exports.string(),
    apiDescription: external_exports.string(),
    /** Footer under the Cursor Models bar after included quota is exhausted */
    autoBeyondLimitDescription: external_exports.string(),
    /** Label suffix for the Auto model display message in the usage bar */
    autoUsageBarLabel: external_exports.string(),
    /** Label suffix for the named model display message in the usage bar */
    apiUsageBarLabel: external_exports.string()
  }),
  /** On/off switch and copy for the internal Glass agent-header perf-vote widget. */
  glass_perf_vote_config: external_exports.object({
    enabled: external_exports.boolean(),
    tagLabel: external_exports.string(),
    yellowTooltip: external_exports.string(),
    redTooltip: external_exports.string(),
    yellowTitle: external_exports.string(),
    redTitle: external_exports.string(),
    noteSubtitle: external_exports.string(),
    notePlaceholder: external_exports.string()
  }),
  portal_outage_alert: external_exports.object({
    enabled: external_exports.boolean(),
    title: external_exports.string(),
    description: external_exports.string()
  }),
  /** Configures extension-host file watcher metric batching. */
  file_watcher_metrics_config: external_exports.object({
    /** Delay before flushing aggregated watcher metric counts across the extension-host boundary. */
    flush_delay_ms: external_exports.number().int().positive()
  }),
  /** Configures renderer forwarded file-watcher storm Sentry diagnostics. */
  file_watcher_forwarded_storm_config: external_exports.object({
    /** Sliding window for forwarded-storm detection. */
    window_ms: external_exports.number().int().positive(),
    /** Minimum forwarded events in one window before reporting a storm diagnostic. */
    min_events: external_exports.number().int().positive(),
    /** Minimum delay between forwarded-storm Sentry reports per renderer bridge. */
    report_throttle_ms: external_exports.number().int().positive(),
    /** Number of redacted source buckets to include in the storm attachment. */
    top_buckets: external_exports.number().int().positive()
  }),
  /**
   * Rollout + client tuning for the BackgroundComposerUpdates push stream
   * (replaces per-surface gates). Disabled everywhere until a platform is
   * listed; every knob has a client-side fallback matching the values below.
   */
  cloud_agent_list_stream_config: external_exports.object({
    /** Platforms the updates stream is armed on: "glass", "web" (future: "tray", "ios"). Empty = disabled everywhere. */
    enabled_platforms: external_exports.array(external_exports.string()),
    /** List poll/refetch cadence while the stream is healthy (the safety poll). */
    safety_poll_interval_ms: external_exports.number().int().positive(),
    /** Silence (no events/heartbeats) before the client abandons an attach; must comfortably exceed the server heartbeat interval. */
    inactivity_timeout_ms: external_exports.number().int().positive(),
    /** Consecutive attach failures before the client disarms the stream and stays on full-cadence polling. */
    max_consecutive_failures: external_exports.number().int().positive(),
    /** Jittered reconnect backoff bounds between attach attempts. */
    reconnect_base_delay_ms: external_exports.number().int().positive(),
    reconnect_max_delay_ms: external_exports.number().int().positive(),
    /** Debounce for the reconcile refetch triggered by CREATED/METADATA_CHANGED/VISIBILITY_CHANGED events. */
    reconcile_delay_ms: external_exports.number().int().positive(),
    /**
     * Kill switch for the Glass sidebar's token-paged ListBackgroundComposers
     * fetch. Fail-open: absent/true keeps paging active; explicit false
     * reverts clients to the legacy single-page fetch (no paging fields sent).
     */
    use_list_page_tokens: external_exports.boolean(),
    /**
     * Floor between per-Project ListWorkersForManager refreshes while the
     * updates stream is OFF or unhealthy. The membership registry rides the
     * list poll's ticks (10s active / 30s idle); 0 keeps the legacy
     * refresh-on-every-tick behavior byte-for-byte.
     */
    membership_poll_interval_ms: external_exports.number().int().nonnegative(),
    /**
     * Floor between per-Project ListWorkersForManager refreshes while the
     * updates stream is healthy. MEMBERSHIP_CHANGED push events already
     * trigger targeted refreshes, so a long safety cadence (60–120s) is
     * enough; set it in the console when ramping. 0 (the fallback) keeps
     * the legacy refresh-on-every-safety-tick behavior byte-for-byte.
     */
    membership_safety_poll_interval_ms: external_exports.number().int().nonnegative()
  }),
  /** Dummy numeric value reported as Datadog gauge in marketplace search path; set in Statsig console. */
  statsig_dummy_gauge_config: external_exports.object({
    dummy: external_exports.number()
  }),
  /** @deprecated Retained for released clients; new clients use memory_monitor_config. */
  memory_monitor_user_toast_config: external_exports.object({
    heap_percent: external_exports.number()
  }),
  // Tuning for the Anysphere-internal CPU monitor (gated by the
  // `cpu_monitor_process_snapshot` feature gate).
  cpu_monitor_config: external_exports.object({
    /** Trigger when the summed CPU % of the Cursor process tree stays at or above this value. */
    total_cpu_percent: external_exports.number(),
    /** Trigger when any single process in the tree stays at or above this CPU %. */
    process_cpu_percent: external_exports.number(),
    /** How long (seconds) CPU usage must stay above a threshold before prompting. */
    sustained_seconds: external_exports.number(),
    /** How often (seconds) the renderer samples the process tree. */
    check_interval_seconds: external_exports.number(),
    /** Minimum time (seconds) between automatic prompts. */
    cooldown_seconds: external_exports.number(),
    /** Whether the captured snapshot also includes a system-wide process list (names only, no argv). */
    include_system_processes: external_exports.boolean()
  }),
  /** @deprecated Retained for released clients; new clients use memory_monitor_config. */
  memory_pressure_profiling_config: external_exports.object({
    trigger_heap_percent: external_exports.number(),
    duration_seconds: external_exports.number(),
    sampling_interval_bytes: external_exports.number(),
    cooldown_seconds: external_exports.number()
  }),
  /** Renderer memory monitoring, warning surfaces, metrics, and emergency profiling. */
  memory_monitor_config: external_exports.object({
    base_threshold_mb: external_exports.number().positive(),
    critical_offset_mb: external_exports.number().positive(),
    show_status_entry: external_exports.boolean(),
    show_internal_warning_popup: external_exports.boolean(),
    show_user_toast: external_exports.boolean(),
    user_toast_heap_percent: external_exports.number().min(1).max(100),
    emit_heap_usage_metric: external_exports.boolean(),
    emergency_profiling_enabled: external_exports.boolean(),
    emergency_profiling_trigger_heap_percent: external_exports.number().min(1).max(100),
    emergency_profiling_duration_seconds: external_exports.number().positive(),
    emergency_profiling_sampling_interval_bytes: external_exports.number().positive(),
    emergency_profiling_cooldown_seconds: external_exports.number().positive()
  }),
  slack_mcp_client_id: external_exports.object({
    clientId: external_exports.string()
  }),
  // Per job-role plugin onboarding catalog for
  // `/plugin/install-and-prompt?plugin=&role=` deeplinks and Glass empty-state
  // recommended actions. Keys are JOB_ROLE_SLUG values (e.g.
  // "software-engineer", "other"), not display labels. A (role, plugin) pair
  // absent from this map is a no-op for deeplinks, so this doubles as the
  // deeplink allowlist.
  plugin_onboarding_by_job_role: external_exports.object({
    byJobRole: external_exports.record(
      external_exports.string().max(100),
      external_exports.array(
        external_exports.object({
          pluginName: external_exports.string().min(1).max(100),
          title: external_exports.string().min(1),
          description: external_exports.string().min(1),
          prompt: external_exports.string().min(1).max(9979)
        })
      )
    ),
    // Ordered plugin names selected from byJobRole for recommended actions.
    // Missing role keys preserve the legacy behavior of selecting the first
    // four catalog entries; an explicit empty array disables recommendations
    // for that role.
    recommendedPluginNamesByJobRole: external_exports.record(
      external_exports.string().max(100),
      external_exports.array(external_exports.string().min(1).max(100)).max(4)
    )
  }),
  leaked_disposables_tracker: external_exports.object({
    enabled: external_exports.boolean(),
    reportIntervalMs: external_exports.number()
  }),
  // Installs the client's GC-based disposable tracker (never-disposed
  // disposables reported as `cursor.memory.leak.type:disposable_leak` spans)
  // for a per-window sample of sessions. The tracker captures a creation
  // stack for every disposable constructed, so it is expensive: keep console
  // rules targeted at the Anysphere team, and keep sessionSampleRate well
  // below 1 outside targeted debugging. The client additionally requires the
  // disposable_leak_reporting gate (which controls whether the leak reporter
  // is installed at all) before installing the tracker.
  gc_disposable_leak_reporting: external_exports.object({
    enabled: external_exports.boolean(),
    // Fraction of windows (rolled once per window, reused across config
    // refreshes) that install the tracker while enabled.
    sessionSampleRate: external_exports.number().min(0).max(1)
  }),
  solidjs_memo_audit_config: external_exports.object({
    enabled: external_exports.boolean(),
    sampleRate: external_exports.number(),
    maxEventsPerFlush: external_exports.number(),
    reportIntervalMs: external_exports.number(),
    deepProbe: external_exports.boolean(),
    deepProbeSampleRate: external_exports.number(),
    deepProbeMaxBytes: external_exports.number(),
    stackAttribution: external_exports.boolean(),
    stackCreationSampleRate: external_exports.number(),
    stackRedundantThreshold: external_exports.number(),
    maxTrackedCreationStacks: external_exports.number(),
    maxStackReportsPerSession: external_exports.number(),
    maxStackBytes: external_exports.number()
  }),
  solidjs_listener_stacks_config: external_exports.object({
    enabled: external_exports.boolean(),
    sampleRate: external_exports.number(),
    observerThreshold: external_exports.number(),
    maxTrackedSources: external_exports.number(),
    maxReportsPerSession: external_exports.number(),
    maxStackBytes: external_exports.number(),
    totalObserverThreshold: external_exports.number(),
    totalTriggeredSourceFloor: external_exports.number(),
    totalTriggeredMaxReports: external_exports.number()
  }),
  canvas_prompt_text_config: external_exports.object({
    skillDescription: external_exports.string(),
    errorFixPromptTemplate: external_exports.string(),
    welcomePageEnabled: external_exports.boolean(),
    marketplaceCategoryKey: external_exports.string(),
    marketplaceMaxCards: external_exports.number().int().positive()
  }),
  /**
   * First-action content by FTUX job role and use case. Role/use-case keys are
   * optional so the client fallback can remain empty and fail closed when the
   * Statsig config is unavailable. The dashboard schema requires the complete
   * nine-role × two-use-case catalog.
   */
  glass_ftux_first_action_config: external_exports.object({
    byJobRole: GlassFtuxFirstActionConfigByJobRoleSchema
  }).strict(),
  shutdown_hang_watchdog_config: external_exports.object({
    per_joiner_warn_ms: external_exports.number().int().nonnegative(),
    fire_on_will_shutdown_total_ms: external_exports.number().int().nonnegative(),
    process_exit_total_ms: external_exports.number().int().nonnegative()
  }),
  update_diagnostics: external_exports.object({
    enabled: external_exports.boolean(),
    restart_time_threshold_seconds: external_exports.number().nonnegative(),
    attach_ship_it_log: external_exports.boolean(),
    max_attachment_bytes: external_exports.number().int().nonnegative()
  }),
  // Sand desktop counterpart of `update_diagnostics`: when a macOS
  // restart-to-update settles stale_version, ship a gated Sentry event with a
  // sanitized tail of ShipIt's own log. Inert until enabled.
  sand_update_diagnostics: external_exports.object({
    enabled: external_exports.boolean(),
    max_attachment_bytes: external_exports.number().int().nonnegative()
  }),
  startup_diagnostics: external_exports.object({
    enabled: external_exports.boolean(),
    timer_name: external_exports.enum([
      "ellapsedLoadMainBundle",
      "ellapsedRunMainBundle",
      "ellapsedAppReady",
      "ellapsedExtensions",
      "ellapsedExtensionsReady",
      "ellapsedWindowLoad",
      "ellapsedRequire",
      "ellapsedEditorRestore",
      "ellapsedWorkbench",
      "ellapsedPreWorkbenchServices"
    ]),
    threshold_ms: external_exports.number().nonnegative()
  }),
  renderer_ping_config: external_exports.object({
    enabled: external_exports.boolean(),
    ping_interval_ms: external_exports.number().int().positive(),
    block_threshold_ms: external_exports.number().int().positive(),
    collect_stack_traces: external_exports.boolean(),
    report_rpc_drain: external_exports.boolean().optional()
  }),
  main_watcher_stall_probe_config: external_exports.object({
    enabled: external_exports.boolean(),
    flush_threshold_ms: external_exports.number().int().positive(),
    anchor_interval_ms: external_exports.number().int().positive(),
    anchor_lag_ms: external_exports.number().int().positive(),
    cooldown_ms: external_exports.number().int().positive(),
    session_cap: external_exports.number().int().positive()
  }),
  editor_input_latency_metrics_config: external_exports.object({
    enabled: external_exports.boolean(),
    sample_rate: external_exports.number().min(0).max(1),
    window_duration_ms: external_exports.number().int().positive()
  }),
  editor_tokenization_metrics_config: external_exports.object({
    enabled: external_exports.boolean(),
    sample_rate: external_exports.number().min(0).max(1),
    time_limit_ms: external_exports.number().int().positive().optional()
  }),
  ripgrep_invocation_monitor_config: external_exports.object({
    window_ms: external_exports.number().int().positive(),
    threshold: external_exports.number().int().positive(),
    max_records: external_exports.number().int().positive(),
    cooldown_ms: external_exports.number().int().nonnegative(),
    report_to_sentry: external_exports.boolean(),
    report_initialize_caches: external_exports.boolean()
  }),
  grep_fallback_monitor_config: external_exports.object({
    window_ms: external_exports.number().int().positive(),
    min_samples: external_exports.number().int().positive(),
    fallback_ratio_threshold: external_exports.number().min(0).max(1),
    cooldown_ms: external_exports.number().int().nonnegative(),
    report_to_sentry: external_exports.boolean()
  }),
  instant_grep_indexing_config: external_exports.object({
    // Crepe in-memory index document cap. When set, overrides the crate default
    // (10000) so an over-cap repo (the `too_large` no-snapshot bucket, sized by
    // `index_none_size`) can be given a larger budget without a client release.
    // nullish: native Statsig rejects undefined getValue fallbacks.
    max_in_memory_documents: external_exports.number().int().positive().nullish()
  }),
  git_diff_reply_limit_config: external_exports.object({
    enabled: external_exports.boolean(),
    max_reply_bytes: external_exports.number().int().positive()
  }),
  renderer_slow_interaction_sentry_config: external_exports.object({
    enabled: external_exports.boolean(),
    threshold_ms: external_exports.number().int().positive(),
    commit_attribution: external_exports.boolean().nullish()
    // Payloads that omit or null the key still parse, both read as off.
  }),
  glass_fps_monitor_config: external_exports.object({
    enabled: external_exports.boolean(),
    min_fps: external_exports.number().int().positive(),
    max_drops_per_interval: external_exports.number().int().nonnegative(),
    interval_sec: external_exports.number().int().positive(),
    // nullish: live config payloads predate these keys; a required key would
    // fail the whole config parse and disable the monitor.
    baseline_interval_sec: external_exports.number().int().positive().nullish(),
    baseline_sample_rate: external_exports.number().min(0).max(1).nullish()
  }),
  /**
   * Which "create an xAI account" path the org xAI Console offers in the
   * unlinked state (the `xai_team_link` gate remains the product shell):
   * `off` keeps the link-existing-only row, `signup_link` adds a create card
   * that opens the official xAI console signup page, and `create_and_link`
   * shows the create card as a stub until the Cursor-driven create endpoint
   * exists. Read client-side by the portal (OrgXaiConsoleView).
   */
  xai_team_link_create_mode: external_exports.object({
    mode: external_exports.enum(["off", "signup_link", "create_and_link"])
  }),
  /**
   * Exact immutable manifest for the dogfood-only macOS Computer Use runtime
   * sidecar. Empty keeps the existing embedded/development helper path.
   */
  mac_computer_use_sidecar_manifest: external_exports.strictObject({
    sidecarManifestUrl: external_exports.union([
      external_exports.literal(""),
      external_exports.string().regex(
        /^https:\/\/downloads\.cursor\.com\/computer-use-sidecar\/releases\/[A-Za-z0-9][A-Za-z0-9._-]*\/[A-Za-z0-9][A-Za-z0-9._-]*\/[0-9a-f]{40}\.json$/
      )
    ])
  }),
  /**
   * Exact immutable release manifests for the Windows Computer Use sidecar
   * (`cursor-cua-sidecar.exe`), one per published architecture. The client
   * picks its `process.arch` entry, downloads the bare signed executable the
   * manifest names, and verifies SHA-256 plus Authenticode before launching
   * it. Empty keeps the embedded/development sidecar path, and clearing a
   * value pulls an already-cached release.
   */
  windows_computer_use_sidecar_manifest: external_exports.strictObject({
    x64: external_exports.union([
      external_exports.literal(""),
      external_exports.string().regex(
        /^https:\/\/downloads\.cursor\.com\/computer-use-sidecar\/releases\/[A-Za-z0-9][A-Za-z0-9._-]*\/[A-Za-z0-9][A-Za-z0-9._-]*\/[0-9a-f]{40}-win32-x64\.json$/
      )
    ]),
    arm64: external_exports.union([
      external_exports.literal(""),
      external_exports.string().regex(
        /^https:\/\/downloads\.cursor\.com\/computer-use-sidecar\/releases\/[A-Za-z0-9][A-Za-z0-9._-]*\/[A-Za-z0-9][A-Za-z0-9._-]*\/[0-9a-f]{40}-win32-arm64\.json$/
      )
    ])
  }),
  /**
   * Per-platform Computer Use MCP instructions. Darwin mode is the agent
   * type (Glass companion vs worker remote); after that, clients read
   * `darwin.companion` or `darwin.remote`. A legacy string at `darwin` is
   * accepted so existing console rows stay valid, and ignored at read time.
   * Empty per-mode strings use the compiled fallback.
   */
  computer_use_mcp_instructions: external_exports.strictObject({
    darwin: external_exports.union([
      external_exports.string(),
      external_exports.strictObject({
        companion: external_exports.string(),
        remote: external_exports.string()
      })
    ]),
    win32: external_exports.string()
  }),
  change_monitor_enrollment: external_exports.object({
    enrolled: external_exports.boolean(),
    enableUI: external_exports.boolean(),
    orgs: external_exports.array(external_exports.string()).min(1)
  })
};
var DYNAMIC_CONFIGS = {
  /* BEGIN_DYNAMIC_CONFIGS */
  /**
   * Server-targeted regular-Cursor migration blocker for Tesla CPI. The
   * server-owned instructionsUrl is trusted: the client trims it and shows the
   * setup-instructions action only when it is non-empty.
   */
  cursor_private_inference_hard_stop: {
    client: true,
    fallbackValues: {
      enabled: false,
      instructionsUrl: null
    }
  },
  mobile_iap_products: {
    client: true,
    fallbackValues: {
      products: {
        "co.anysphere.cursor.pro.monthly": "pro",
        "co.anysphere.cursor.proplus.monthly": "pro_plus",
        "co.anysphere.cursor.ultra.monthly": "ultra",
        "co.anysphere.sand.pro.monthly": "pro",
        "co.anysphere.sand.proplus.monthly": "pro_plus",
        "co.anysphere.sand.ultra.monthly": "ultra"
      }
    }
  },
  codebase_protection_reporting_config: {
    client: true,
    fallbackValues: {
      report_interval_ms: 18e5,
      jitter_fraction: 0.2
    }
  },
  // Remote-tunable schedule for the Agent Host bridge registration wait
  // (initial attempt + retry tail) — the only wall-clock bound on the Agent
  // Host send path. Read only on Agent Host paths; the legacy runtime never
  // consults it. Fallbacks mirror the legacy agent-exec provider-wait
  // schedule (30s initial + 5s retries x 9 attempts ~= 70s total), so an
  // unset/unreachable config is behavior-neutral. Values are clamped
  // client-side (resolveAgentHostBridgeWaitSchedule in agentHostService.ts)
  // so a bad remote value cannot disable the bound or make it absurdly short.
  agent_host_bridge_wait: {
    client: true,
    fallbackValues: {
      initial_timeout_ms: 3e4,
      retry_timeout_ms: 5e3,
      max_attempts: 9
    }
  },
  sand_working_state_warming_config: {
    client: true,
    fallbackValues: {
      maxClosureBytes: 1024 * 1024 * 1024,
      maxClosureBlobs: 5e4,
      putConcurrency: 16,
      parallelListing: false,
      migrationAgentConcurrency: 8,
      migrationReadBatchBlobs: 32,
      migrationPutConcurrency: 8,
      migrationCopyConcurrency: 8
    }
  },
  grok_bot_temporal_harness_rollout: {
    client: true,
    fallbackValues: {
      control: "legacy_gates",
      mode: "shadow",
      autoReviewEnforce: false
    }
  },
  grok_bot_loop_detection: {
    client: true,
    fallbackValues: {
      mode: "off"
    }
  },
  grok_bot_system_prompt_override: {
    client: true,
    fallbackValues: {
      basePrompt: ""
    }
  },
  remote_workspace_readiness_config: {
    client: true,
    fallbackValues: {
      healthcheck_timeout_ms: 3e3,
      remote_extension_host_startup_grace_ms: 3e3
    }
  },
  ai_code_tracking_poll: {
    client: true,
    fallbackValues: {
      interval_ms: 6e5
    }
  },
  solidjs_stack_trace_limit: {
    client: true,
    fallbackValues: {
      stackTraceLimitFloor: 0
    }
  },
  glass_remote_connection_dormancy_config: {
    client: true,
    fallbackValues: {
      windowIdleMinutesToSuspend: 20,
      hiddenAgentMinutesToSuspend: 0,
      suspendWhileWindowFocused: false,
      maxDormantQueuedMessages: 1e3,
      maxDormantQueuedBytes: 4194304,
      hardMaxDormantQueuedMessages: 2e4,
      hardMaxDormantQueuedBytes: 67108864
    }
  },
  idle_extension_host_killer_config: {
    client: true,
    fallbackValues: {
      idleMinutesToKillExtensionHost: 0,
      freeMemoryPercentageToKillExtensionHost: 0,
      killUserExtensionHost: false
    }
  },
  marketplace_listing_config: {
    client: true,
    fallbackValues: {
      rpcTimeoutMs: 15e3
    }
  },
  editor_bugbot_config: {
    client: true,
    fallbackValues: {
      model: "claude-4-5-sonnet-20250929",
      iterations: 0,
      agentic_iterations: 1,
      agentic_model: "claude-4.5-haiku",
      deep_review_model: "",
      context_lines: 10
    }
  },
  client_speculative_summarization_config: {
    client: true,
    fallbackValues: {
      tokenUsageThresholdPercentage: 70,
      tolerancePercentage: 5,
      inflightMaxAgeMinutes: 5,
      speculativeStreamTimeoutMinutes: 5
    }
  },
  rate_limited_reconnect_message_config: {
    client: true,
    fallbackValues: {
      message: "Rate limited by model provider, retrying\u2026"
    }
  },
  new_conversation_ux_config: {
    client: true,
    fallbackValues: {
      enable: true,
      enabled_models: [],
      force_enable_on_all_models: true,
      group_text: true,
      group_thinking: true,
      group_todos: true,
      group_edits: false,
      smooth_stream_enable: false,
      grouped_text_max_length: 100,
      grouped_text_max_length_composer_family: 88,
      tool_summary_mode: "single_word",
      nest_tool_blocks: false
    }
  },
  meta_agent_config: {
    client: true,
    fallbackValues: {
      meta_parent_model: "claude-4.6-opus-high-fast",
      allow_subagent_followups: true,
      enable_notes: false
    }
  },
  task_card_tips: {
    client: true,
    fallbackValues: {
      startup_tips: [
        {
          id: "cloud-subagents",
          text: "Use /in-cloud for cloud subagents"
        }
      ]
    }
  },
  product_tips_config: {
    client: true,
    fallbackValues: {
      tips: [],
      config: {
        intervalMs: 8e3,
        minClientVersion: ""
      }
    }
  },
  composer_sandboxing_promo: {
    client: true,
    fallbackValues: {
      version: 0
    }
  },
  playwright_log_configs: {
    client: true,
    fallbackValues: {
      logSizeThreshold: 25e3,
      logPreviewLines: 25,
      logPreviewChars: 25e3
    }
  },
  privacy_mode_acknowledgement_onboarding: {
    client: true,
    fallbackValues: {
      mode: "on"
    }
  },
  tools_concurrency_config: {
    client: true,
    fallbackValues: {
      tools: {
        RIPGREP_RAW_SEARCH: {
          ttl: 1e4,
          maxConcurrent: 5
        },
        RIPGREP_SEARCH: {
          ttl: 1e4,
          maxConcurrent: 5
        }
      },
      defaultTtl: 1e4,
      defaultMaxConcurrent: 999999
      // Effectively unlimited
    }
  },
  client_rg: {
    client: true,
    fallbackValues: {
      num_threads: 4,
      fallback_num_threads: 4,
      use_batch_executor: false,
      batch_executor_wait_ms: 50
    }
  },
  http2_ping_config: {
    client: true,
    fallbackValues: {
      enabled: [],
      pingIdleConnection: null,
      pingIntervalMs: null,
      pingTimeoutMs: null,
      idleConnectionTimeoutMs: null
    }
  },
  http2_agent_connection_pool_config: {
    client: true,
    fallbackValues: {
      poolSize: 4
    }
  },
  http1_keepalive_config: {
    client: true,
    fallbackValues: {
      keepAliveInitialDelayMs: null
    }
  },
  nal_websocket_client_pool: {
    client: true,
    // One connection is the capacity the WebSocket transport shipped with.
    fallbackValues: {
      maxConnections: 1
    }
  },
  ws_dark_durability_probe_config: {
    client: true,
    // SAFE defaults == today's hardcoded client constants. The client clamps
    // each value before use, so these also document the intended baseline.
    fallbackValues: {
      idleHoldMs: 3e4,
      echoTimeoutMs: 5e3,
      concurrency: 4
    }
  },
  abort_controller_logging_config: {
    client: true,
    fallbackValues: {
      sampling_rate: 1
    }
  },
  hooks_client_config: {
    client: true,
    fallbackValues: {
      hooks_ready_timeout_ms: 2e3
    }
  },
  composer_hang_detection_config: {
    client: true,
    fallbackValues: {
      thresholds_ms: [
        2e3,
        4e3,
        6e3,
        8e3,
        1e4,
        12e3,
        14e3,
        16e3,
        32e3
      ]
    }
  },
  composer_errors_without_button_support: {
    client: true,
    fallbackValues: {
      error_type_denylist: []
    }
  },
  nal_stall_detector_timeout_config: {
    client: true,
    fallbackValues: {
      advisoryTimeoutMs: 20 * 1e3,
      failTimeoutMs: 30 * 1e3
    }
  },
  nal_request_context_blob_transport_config: {
    client: true,
    fallbackValues: {
      mode: "legacy",
      max_blob_bytes: 15 * 1024 * 1024,
      max_inline_dynamic_bytes: 1024 * 1024
    }
  },
  simulated_thinking_error_timeout: {
    client: true,
    fallbackValues: {
      timeout_ms: 15 * 1e3
    }
  },
  agent_loop_phase_display: {
    client: true,
    fallbackValues: {
      enabled: false,
      min_display_threshold_ms: 0
    }
  },
  in_app_ads_dev_override_config: {
    client: true,
    fallbackValues: {
      ad_id_to_show: ""
    }
  },
  in_app_ads_quiet_period_config: {
    client: true,
    fallbackValues: {
      quiet_period_ms: 6e5,
      // 10m between ads; bypass triggers + dev override
      first_launch_quiet_period_ms: 864e5
      // 24h after firstSessionDate; 0 disables
    }
  },
  environment_setup_resume_config: {
    client: true,
    fallbackValues: {
      max_resume_age_ms: DEFAULT_ENVIRONMENT_SETUP_MAX_RESUME_AGE_MS
    }
  },
  perf_monitor_control: {
    client: true,
    fallbackValues: {
      enabled: false,
      subsample_polling_rate_sec: 0,
      sample_polling_rate_min: 0
    }
  },
  glass_reactivated_user_routing_config: {
    // Client-readable so the IDE can mirror routing knobs to APPLICATION storage
    // for offline first-window reactivation (one boot behind).
    client: true,
    fallbackValues: {
      user_routing_enabled: false,
      inactive_days: DEFAULT_FIRST_WINDOW_REACTIVATION_INACTIVE_DAYS,
      ch_timeout_ms: 500,
      ch_cache_ttl_seconds: 86400,
      local_routing_enabled: true
    }
  },
  retry_interceptor_config: {
    client: true,
    fallbackValues: {
      retriableErrors: [
        {
          code: "Unavailable"
        },
        {
          code: "Internal"
        },
        {
          code: "DeadlineExceeded"
        }
      ]
    }
  },
  retry_interceptor_params_config: {
    client: true,
    fallbackValues: {
      maxRetries: null,
      baseDelayMs: null,
      maxDelayMs: null
    }
  },
  text_delta_pacing_config: {
    client: true,
    fallbackValues: {
      targetCharsPerFrame: 0,
      maxLagFrames: 8,
      barrierMaxWaitMs: 0
    }
  },
  extension_monitor_control: {
    client: true,
    fallbackValues: {
      local_enabled: false,
      backend_reporting_enabled: false,
      network_diagnostics_reporting_enabled: false,
      subsample_polling_rate_sec: 0,
      sample_polling_rate_min: 0
    }
  },
  agent_memory_pressure_monitor: {
    client: true,
    fallbackValues: {
      monitor_enabled: false,
      low_memory_sustained_sec: 30,
      min_agent_process_age_sec: 0,
      low_memory_available_pct: 10,
      low_memory_available_abs_gb: 3,
      cpu_high_pct: 90,
      cpu_high_sustained_sec: 30,
      min_reported_cpu_pct: 5
    }
  },
  sand_process_metrics: {
    client: true,
    fallbackValues: {
      local_enabled: false,
      backend_reporting_enabled: false,
      subsample_polling_rate_sec: 0,
      sample_polling_rate_min: 0
    }
  },
  // Fail-closed like the IDE's traceConfig (sampleRate ?? 0.0): tracing stays
  // off until this config enables it, and the 0.01 ratio mirrors the IDE
  // ext-host fallback so flipping `enabled` alone starts at a safe volume.
  sand_rpc_tracing: {
    client: true,
    fallbackValues: {
      enabled: false,
      sample_ratio: 0.01
    }
  },
  gc_trace_control: {
    client: true,
    fallbackValues: {
      enabled: false,
      drain_interval_sec: 120
    }
  },
  disable_infinite_cloud_agent_stream_retries: {
    client: true,
    fallbackValues: {
      enabled: false
    }
  },
  cloud_agent_shared_blob_cache: {
    client: true,
    fallbackValues: {
      max_bytes: 128 * 1024 * 1024
    }
  },
  local_subagent_limits: {
    client: true,
    fallbackValues: {
      maxRunning: 16
    }
  },
  sand_min_client_version: {
    client: true,
    fallbackValues: {
      min_version: "",
      backend_min_version: "",
      novnc_port_token_min_version: "",
      hosted_mcp_oauth_callback_min_version: ""
    }
  },
  sand_mobile_version_support: {
    client: true,
    fallbackValues: {
      min_recommended_build: 0,
      min_allowed_build: 0,
      update_url: ""
    }
  },
  // Both desktop subagents request the `sand-cua` virtual alias: the served
  // model and its parameters live in the backend's VIRTUAL_MODEL_ROUTING map
  // (Anytool), so a virtual id carries no parameters here. Pinning a named
  // model in either config takes that subagent off the alias and out of that
  // lever.
  sand_computer_use_playwright_config: {
    client: true,
    fallbackValues: {
      modelId: "sand-cua",
      maxMode: false,
      parameters: []
    }
  },
  sand_browser_use_model: {
    client: true,
    fallbackValues: {
      modelId: "sand-cua",
      maxMode: false,
      parameters: []
    }
  },
  grok_bot_conversation_size_limits: {
    client: true,
    fallbackValues: {
      soft_limit_mb: 256,
      hard_limit_mb: 1024
    }
  },
  sand_share_bot_export_policy: {
    client: true,
    fallbackValues: {
      policy: "team_only"
    }
  },
  sand_model_filter: {
    client: true,
    fallbackValues: {
      allowedModelIds: [],
      defaultParameters: {}
    }
  },
  sand_default_model: {
    client: true,
    // The routed `default` tier (Auto), parameterless and non-max — exactly the
    // request the retired `sand_default_model_auto` gate produced while ON,
    // which is where every allocated treatment user sits today. Keeping it as
    // the fallback is what makes the gate→config migration inert: a console
    // config that does not exist yet, or an evaluation that has not landed,
    // resolves to the same bytes the gate did. Routed ids take no parameters
    // (resolveLegacySlugFromMcidAndParams flags any as unexpected), so this
    // must stay parameterless.
    fallbackValues: {
      modelId: "default",
      maxMode: false,
      parameters: []
    }
  },
  sand_automations_model: {
    client: true,
    // The same routed `default` tier (Auto) `sand_default_model` falls back to,
    // which is where every allocated treatment user's automations sit today.
    // Keeping the two fallbacks identical is what makes shipping this config
    // inert: with nothing published, an automation run resolves to the same
    // bytes it resolves to now. Routed ids take no parameters
    // (resolveLegacySlugFromMcidAndParams flags any as unexpected), so this
    // must stay parameterless.
    //
    // OPERATOR NOTE: this config REPLACES `sand_default_model` for automation
    // runs rather than layering on it, so the two slots move independently in
    // both directions — publishing (or rolling back) one leaves the other where
    // it was. Nothing forks by turn source in code: an automation run diverges
    // only where an operator published a divergence here.
    fallbackValues: {
      modelId: "default",
      maxMode: false,
      parameters: []
    }
  },
  sand_feedback_prompt_config: {
    client: true,
    // Kill switch off by default: the prompt only appears once a Statsig rule
    // publishes enabled: true.
    fallbackValues: {
      enabled: false,
      sample_rate_denominator: 100,
      cooldown_seconds: 172800,
      signup_grace_seconds: 7200
    }
  },
  agent_store_sync_client_config: {
    client: true,
    fallbackValues: {
      // Mirrors AGENT_STORE_SYNC_CLIENT_CONFIG_DEFAULTS in
      // packages/agent-store/sync/src/sync-client-config.ts.
      sync_debounce_ms: 5e3,
      sync_backoff_base_ms: 5e3,
      sync_backoff_max_ms: 6e4,
      project_sync_debounce_ms: 5e3,
      project_sync_backoff_base_ms: 5e3,
      project_sync_backoff_max_ms: 6e4,
      passive_retry_interval_ms: 5e3,
      passive_index_poll_interval_ms: 2e3,
      project_store_poll_interval_ms: 4e3,
      max_file_size_bytes: AGENT_STORE_DEFAULT_MAX_FILE_SIZE_BYTES,
      token_refresh_buffer_ms: 6e4,
      rpc_retry_max_attempts: 3,
      rpc_retry_base_delay_ms: 250,
      rpc_retry_max_delay_ms: 5e3,
      rpc_retry_multiplier: 2,
      rpc_timeout_ms: 6e4,
      blob_idle_timeout_ms: 6e4,
      sync_round_timeout_ms: 3e5,
      sync_round_unwind_timeout_ms: 3e4,
      lock_release_failure_threshold: 3,
      resume_gap_threshold_ms: 12e4,
      dirty_passive_stalled_threshold_ms: 12e4,
      s3_concurrency: 8,
      list_concurrency: 4,
      hash_concurrency: 4,
      presign_concurrency: 4,
      multipart_upload_threshold_bytes: 64 * 1024 * 1024,
      multipart_part_size_bytes: 16 * 1024 * 1024,
      multipart_presign_window_size: 8,
      pull_presign_window_size: 500,
      multipart_complete_max_attempts: 3,
      multipart_max_restarts: 1,
      multipart_max_conflict_renames: 1,
      multipart_max_expiry_refreshes: 1,
      write_barrier_timeout_ms: 2e3,
      scoped_reserved_slots: 1,
      path_sync_request_poll_ms: 250,
      path_sync_request_wait_poll_ms: 50,
      exclusive_mutation_claim_poll_ms: 250,
      stale_store_root_max_idle_ms: 7 * 24 * 60 * 60 * 1e3,
      tombstone_full_refresh_rounds: 2880,
      tombstone_full_refresh_interval_ms: 24 * 60 * 60 * 1e3,
      tombstone_prune_slack_ms: 3 * 24 * 60 * 60 * 1e3,
      surfaces: {}
    }
  },
  gemini_video_attachment_config: {
    client: true,
    fallbackValues: {
      maxBytes: 30 * 1024 * 1024,
      inlineMaxBytes: 15 * 1024 * 1024,
      signedUrlMaxBytes: 15 * 1024 * 1024,
      cloudMaxVideoAttachmentsPerRequest: 5,
      cloudMaxDocumentAttachmentsPerRequest: 5,
      localMaxVideoAttachmentsPerRequest: 5,
      localMaxTotalInlineVideoBytesPerRequest: 35 * 1024 * 1024
    }
  },
  agent_layout_migration: {
    client: true,
    fallbackValues: {
      showSettings: false,
      keepIsland: false,
      sidebarLocation: "noop"
    }
  },
  default_diff_mode: {
    client: true,
    fallbackValues: {
      default_diff_mode: "diffs"
    }
  },
  switch_mode_tool_config: {
    client: true,
    fallbackValues: {
      enabledForNal: false,
      enabledForOal: false,
      fromModes: [],
      targetModes: []
    }
  },
  mcp_auth_status_copy_config: {
    client: true,
    fallbackValues: {
      authToolDescription: "Authenticate this MCP server so its tools can be used. Call this tool through your MCP tool-calling interface when STATUS.md indicates this server needs authentication.",
      errorStatusMessage: "The MCP server errored. If this server is important for completing the task, concisely inform the user and ask them to check the MCP status in Cursor's Customize page > MCPs; otherwise continue with a different approach.",
      needsAuthStatusMessageWithAuthTool: 'The MCP server needs authentication. Authenticate it by calling the `{authToolName}` tool for server "{serverIdentifier}" through your MCP tool-calling interface using an empty arguments object. If this server is important for completing the task, authenticate it first; otherwise continue with a different approach.'
    }
  },
  mcp_reconnect_config: {
    client: true,
    fallbackValues: {
      fastRetryBaseDelayMs: 5e3,
      fastRetryMaxDelayMs: 6e4,
      fastRetryMaxAttempts: 5,
      periodicRetryBaseDelayMs: 5 * 6e4,
      periodicRetryMaxDelayMs: 30 * 6e4,
      maxPeriodicCycles: null,
      focusRetryCooldownMs: 5 * 6e4,
      inlineReconnectCooldownMs: 5 * 6e4,
      oauthBackendRefreshHydrationPollIntervalMs: 500,
      streamableHttpSession404TombstoneThreshold: 5,
      healthProbeTimeoutMs: 1e4,
      // AQ-1514: keep bounded timeouts on by default; set false to revert to 1h hard timeout.
      toolCallBoundedTimeoutEnabled: true,
      toolCallIdleTimeoutMs: 12e4,
      toolCallMaxTotalTimeoutMs: 60 * 6e4,
      degradedProbeDelayMs: 3e4,
      maxDegradedProbeFailures: 3,
      keepaliveProbeDelayMs: 5 * 6e4,
      keepaliveJitterMs: 3e4,
      stabilityThresholdMs: 3e4,
      stdioConnectFailuresAreNonRetryable: true,
      retryNonRetryableOnWake: false,
      nonRetryableWakeRetryCooldownMs: 5 * 6e4,
      retryNonRetryableAutomatically: false,
      networkResumeReconnectEnabled: false,
      networkResumeReconnectDebounceMs: 5e3,
      overrides: null
    }
  },
  mcp_oauth_sweep_config: {
    client: true,
    fallbackValues: {
      oauthAttemptTtlMs: 36e5,
      refreshLockTtlMs: null,
      refreshLockMaxHoldMs: 12e4,
      registrationLockTtlMs: null
    }
  },
  mcp_oauth_refresh_policy: {
    client: true,
    fallbackValues: {
      classifyBeforeWipe: false
    }
  },
  mcp_oauth_loopback_redirect: {
    client: true,
    fallbackValues: {
      enabled: true,
      denylist: []
    }
  },
  mcp_oauth_backend_redis_lock_config: {
    client: true,
    fallbackValues: {
      operations: ["refresh"],
      executorKinds: ["backendHttpMcp", "cloudAgent", "agentHost"],
      providerAllowlist: [],
      fallbackMode: "fail_open",
      refreshLockTtlMs: 3e4,
      registrationLockTtlMs: 3e4,
      waitPollIntervalMs: 250,
      waitJitterMs: 100,
      maxWaitMs: 3e4
    }
  },
  sand_pressure_cpu_profiler_config: {
    client: true,
    // Conservative first deployment; tune via Statsig without a host roll.
    fallbackValues: {
      sustainedPressureWindowMs: 15e4,
      profileDurationMs: 15e3,
      minIntervalMs: 216e5,
      maxRetainedProfiles: 3
    }
  },
  sand_stream_deadline_config: {
    client: true,
    // The compiled defaults; widen either budget from Statsig without a host
    // roll if a legitimate provider gap turns out to exceed them.
    fallbackValues: {
      firstTokenDeadlineMs: 15e4,
      idleDeadlineMs: 9e4
    }
  },
  inline_diff_performance_config: {
    client: true,
    fallbackValues: {
      maxDecorations: 100
    }
  },
  tray_refresh_config: {
    client: true,
    fallbackValues: {
      enableMainProcessCloudRefresh: false,
      activeIntervalMs: 15e3,
      idleIntervalMs: 6e4,
      emptyIntervalMs: 3e5,
      engagementThrottleMs: 5e3,
      menuCap: 25,
      enablePoll: true,
      enableEngagement: true,
      enablePower: true
    }
  },
  performance_events_config: {
    client: true,
    fallbackValues: {
      enabled: false,
      flushIntervalMs: 3e4,
      sampleRate: 0,
      maxScriptsPerLoaf: 10,
      maxBatchBytes: 32 * 1024,
      // We only need enough LoAFs to correlate with RendererBlocked reports,
      // not exhaustive capture: only frames at least this long are recorded,
      // and at most maxEventsPerFlush LoAFs are kept per flush window.
      loafThresholdMs: 1e3,
      maxEventsPerFlush: 20
    }
  },
  background_composer_list_limit: {
    client: true,
    fallbackValues: {
      limit: 32
    }
  },
  switch_to_model_slug_config: {
    client: true,
    fallbackValues: {
      modelSlug: "",
      modelIdWithParams: {
        modelId: "",
        params: []
      }
    }
  },
  debug_mode_ui_instructions_config: {
    client: true,
    fallbackValues: {
      proceed_instructions: "Issue reproduced, please proceed",
      mark_fixed_instructions: "The issue has been fixed. Please clean up the instrumentation."
    }
  },
  user_intent_config: {
    client: true,
    fallbackValues: {
      maxChatsToRead: 100,
      maxProjectsToGroup: 5,
      model: "claude-4.5-opus-high-thinking",
      promptTemplate: `You are analyzing conversation transcripts to identify repeated user behaviors.

## Transcript Location
Transcripts are stored at: {{agentTranscriptsPath}}

## Transcript Format
Each '.txt' file is a human-readable conversation transcript with this structure:
- 'user:' sections contain user messages (often wrapped in '<user_query>' tags)
- 'assistant:' sections contain assistant responses
- '[Tool call]' blocks show which tools were invoked
- '[Tool result]' blocks show tool outputs

Files can be large. Focus on extracting the '<user_query>' sections which contain the actual user requests. Do NOT try to read the entire file contents because it will pollute your context.

## How to Read Transcripts
1. Use Glob to list files: "{{agentTranscriptsPath}}/*.txt"
2. For each file, extract just the '<user_query>' blocks - these show what users asked for
3. You can use Grep to search for '<user_query>' patterns across files

## Task
Analyze the {{maxChatsToRead}} most recent conversations (by file modification time). Be thorough and do not bias towards recency when analyzing conversations. Ignore trivial conversations and conversations where nothing concrete happened.

Your goal is to understand how the user interacts with the agent. Focus especially on the corrections that the user makes repeatedly. Focus on common terminal commands/workflows the user instructs the agent to do, changes, and other very stable patterns.

## Evidence Standards
When making claims about what the agent SHOULD or SHOULD NOT do, only cite conversations where:
- The user explicitly corrected the agent for doing something wrong
- The user undid or rejected an agent action
- The user gave an explicit instruction ('don\\'t do X', 'always do Y')

Do NOT infer 'don\\'t do X' from:
- The user asking a question about X (e.g., 'should we add tests?' does not mean 'don\\'t add tests proactively')
- The user doing X themselves (doesn't mean the agent shouldn't)
- Absence of the agent doing X

For each claim, ask: 'Is there a conversation where the user pushed back on the agent for doing this?' If not, don't include it as a guideline. For each piece of information you discern, you must cite 4 conversations. For each citation, verify that the conversation actually backs up your claim. Never include direct quotes from user messages; summarize at a high level.

These are the sections to cover. Do not overlap these with existing user and project rules; if there is overlap or conflict always go with the existing rules.

- Developer profile: How does the user interact with the agent. Focus on how much autonomy they like to give the agent vs. how much they would like to oversee the changes the agent is making. What is their workflow for getting tasks done. What kind of tasks do they often work on. Verify across many conversations, and do not extrapolate too hard.
- Frequented areas of the codebase: Parts of the codebase the user primarily works in, and what kinds of tasks correspond to each part of the codebase.
- Important terminal commands: Terminal commands/workflows the user runs repeatedly that are unique to the project/user workflow, and when they should be used. Focus on test, lint, and build commands. Do not include git commands.

Do not write any files in this step. You will be asked in a follow-up message to write the final user profile to disk.`,
      secondStepPromptTemplate: `Turn your analysis into a concise 'index.md' markdown file that will be shown to all agents in the future.

Write the file contents to: {{userIntentDirPath}}
(This is a temporary file path and will be atomically moved to {{finalUserIntentDirPath}}.)

Requirements:
- Do not cite user messages or transcripts directly (no quotes)
- Avoid overly specific task details; focus on stable patterns and preferences
- Keep it reasonably short
- For each guideline/claim, include 4 conversation citations and verify that each citation supports the claim`
    }
  },
  browser_default_url_config: {
    client: true,
    fallbackValues: {
      defaultUrl: "https://cursor.com"
    }
  },
  glass_per_app_tabs_config: {
    client: true,
    fallbackValues: {
      agentTabSelectionTTL: 3e4
    }
  },
  glass_tiling_config: {
    client: true,
    fallbackValues: {
      showDraftsInSidebar: false
    }
  },
  glass_fsd_launch_pill_config: {
    client: true,
    fallbackValues: {
      pillLabel: "Autopilot PR",
      tooltip: "Fix CI, conflicts, and comments with full self driving",
      dropdownAriaLabel: "Autopilot PR runtime",
      cloudOptionLabel: "Run in Cloud",
      localOptionLabel: "Run locally in a Worktree",
      fixCiPillSingleLabel: "Debug CI Failure",
      fixCiPillPluralLabelTemplate: "Debug {count} CI Failures",
      fixCiPillLoadingLabel: "Debugging CI",
      fixCiPillLoadingProgressLabel: "Debugging CI",
      fsdFixCiPillSingleLabel: "Fix CI with FSD",
      fsdFixCiPillPluralLabelTemplate: "Fix {count} CI Failures with FSD",
      fsdFixCiPillLoadingLabel: "Fixing CI with FSD",
      fsdFixCiPillLoadingProgressLabel: "Fixing CI with FSD"
    }
  },
  // Copy + destinations for the contextual Grok Bot banner. `downloadUrl` is
  // the unified marketing landing page (it picks the right installer per
  // platform); `openUrl` is the registered Grok Bot deep-link scheme.
  grok_bot_contextual_banner_copy: {
    client: true,
    fallbackValues: {
      title: "Grok Bot can do this for you",
      description: "An AI teammate that works in your tools and comes back with finished work.",
      downloadCtaLabel: "Download",
      downloadUrl: "https://cursor.com/download/bot",
      openCtaLabel: "Open Grok Bot",
      openUrl: "grokbot://"
    }
  },
  glass_btw_side_question_prompt_config: {
    client: true,
    fallbackValues: {
      promptTemplate: [
        "You are answering a single ephemeral question about the user's current work. Use the provided conversation as context and respond directly in one answer. Do not ask follow-up questions, do not request mode switches, and do not mention tool limitations unless absolutely necessary.",
        "If the conversation does not contain enough to answer, say so briefly.",
        "",
        "{{question}}"
      ].join("\n")
    }
  },
  // Per-repository LRU cap for Glass loaded agents; default 5 matches the previously hardcoded cap.
  glass_loaded_agent_lru_cap: {
    client: true,
    fallbackValues: {
      max_loaded_agents: 5
    }
  },
  // Release hidden chats' resident bubble bodies on transcript unmount; disabled until Statsig enables it.
  composer_hidden_bubble_eviction: {
    client: true,
    fallbackValues: {
      enabled: false,
      keep_recent_hidden: 1
    }
  },
  // Client-tunable Glass large-file code gate; default 10MB matches the previously hardcoded LARGE_FILE_GATE_CODE_BYTES.
  glass_large_file_gate_config: {
    client: true,
    fallbackValues: {
      code_gate_bytes: 10485760
    }
  },
  // Datadog reporting of Glass workspace lifecycle; disabled until the Statsig config turns it on.
  glass_workspace_lifecycle_metrics: {
    client: true,
    fallbackValues: {
      enabled: false,
      sweep_interval_ms: 6e4,
      retained_after_close_threshold_ms: 45e3
    }
  },
  glass_pr_operations_polling_config: {
    client: true,
    fallbackValues: {
      prChecksPollIntervalMs: 3e4,
      prChecksPollMaxBackoffMs: 18e4,
      prChecksErrorBackoffMultiplier: 1.5,
      // Intentionally 15m (not legacy 60s): bounds Redis hits; Glass may force provider reads via skipCache.
      prChecksCacheTtlSeconds: 900,
      scmPrMetadataCacheTtlSeconds: 60 * 60,
      scmPrDetailedStatusCacheTtlSeconds: 60,
      scmPrForBranchCacheTtlWhenPrsSeconds: 60,
      scmPrForBranchCacheTtlWhenEmptySeconds: 10,
      scmPrCodeownersCacheTtlSeconds: 300,
      scmPrCommitsCacheTtlSeconds: 300,
      scmPrTimelineEventsCacheTtlSeconds: 300,
      scmPrDiscussionsCacheTtlSeconds: 300,
      scmPrCheckLogExcerptOkTtlSeconds: 120,
      scmPrCheckLogExcerptNegativeTtlSeconds: 30,
      detailedPrStatusChecksScopedAuthBreakerTtlSeconds: 15 * 60,
      scmGitlabEmojiReactionCacheTtlSeconds: 30 * 60,
      localAgentPrHeaderBatchPollIntervalMs: 3e4,
      localAgentPrStatePollIntervalMs: 10 * 6e4,
      localAgentPrBurstBumpOffsetsMs: [
        3e3,
        6e3,
        9e3,
        15e3,
        2e4,
        25e3,
        3e4
      ],
      cloudAgentPrStatePollIntervalMs: 6e4,
      cloudAgentPrBurstBumpOffsetsMs: [
        3e3,
        6e3,
        9e3,
        15e3,
        2e4,
        25e3,
        3e4
      ],
      cloudAgentPrStatePollMaxBackoffMs: 3e5,
      cloudAgentPrErrorBackoffMultiplier: 1.5
    }
  },
  cloud_agent_stream_reattach: {
    client: true,
    fallbackValues: {
      enabled: true,
      rehydrateAfterMs: 12e4
    }
  },
  tool_limits_config: {
    client: true,
    fallbackValues: {
      readFilesToolMaxFileSizeInBytes: 2e6,
      editFileToolMaxFileSizeInChars: 15e4,
      fileSearchToolMaxResults: 10,
      listDirV2ClientSideCharacterBudget: 1e3,
      readFileV2ToolMaxFileSizeInBytes: 2e8,
      composerDiffMaxComputationTimeMs: 2e3
    }
  },
  /** Update prompt configuration for controlling frequency and throttling */
  update_prompt_config: {
    client: true,
    fallbackValues: {
      min_hours_between_prompts: 48,
      max_prompts_per_version: 3,
      max_prompts_per_day: 1,
      snooze_duration_hours: 72
    }
  },
  internal_release_track_override: {
    client: true,
    fallbackValues: {
      releaseTrack: "",
      statsigUrl: "",
      unlockInternalTracks: false
    }
  },
  sand_internal_release_track_override: {
    client: true,
    fallbackValues: {
      releaseTrack: "",
      unlockInternalTracks: false
    }
  },
  // In-box host bundle release channel; see the schema entry for field
  // semantics. The fallbacks are deliberately "no opinion" in BOTH fields, so
  // an absent or unreachable config leaves every box on exactly the behavior it
  // has today (the `latest` pointer, checked every ~24h). Use userID/teamID
  // rules to put internal users on `latest` once the fleet default moves to
  // `stable`, and to give them a shorter watchIntervalMs.
  sand_host_bundle_channel: {
    client: true,
    fallbackValues: {
      channel: "",
      watchIntervalMs: null
    }
  },
  /** Configuration for giant JSON.stringify detection */
  giant_json_stringify_config: {
    client: true,
    fallbackValues: {
      sentry_threshold_bytes: 1e7,
      attach_content: false
    }
  },
  /** Configuration for giant buffer retention detection */
  giant_buffer_retention_config: {
    client: true,
    fallbackValues: {
      allocation_threshold_bytes: 32 * 1024 * 1024,
      blob_url_threshold_bytes: 32 * 1024 * 1024,
      retention_age_ms: 5 * 6e4,
      sweep_interval_ms: 6e4
    }
  },
  /** Configuration for giant JSON.parse detection */
  giant_json_parse_config: {
    client: true,
    fallbackValues: {
      sentry_threshold_bytes: 1e9
    }
  },
  /** Configuration for giant VSBuffer decode (TextDecoder) detection */
  giant_vsbuffer_decode_config: {
    client: true,
    fallbackValues: {
      sentry_threshold_bytes: 2e7
    }
  },
  /** MCP IPC timeouts (ms) */
  mcp_ipc_timeouts: {
    client: true,
    fallbackValues: {
      metadata_timeout_ms: 1e4,
      lifecycle_timeout_ms: 1e4,
      dashboard_timeout_ms: 1e4,
      recovery_per_retry_timeout_ms: 1e4
    }
  },
  sentry_session_recording_config: {
    client: true,
    fallbackValues: {
      replays_session_sample_rate: 0
    }
  },
  /**
   * ⚠️ SECURITY WARNING: Extension Signature Verification Bypass List ⚠️
   *
   * Extensions in this list bypass ALL signature verification checks.
   * This is a TEMPORARY workaround for extensions that lack proper OpenVSX signatures.
   *
   * RETIRE THIS CONFIG once upstream signatures exist for all listed extensions.
   * Each extension here represents a potential attack vector if compromised.
   */
  extension_signature_verification_bypass_list: {
    client: true,
    fallbackValues: {
      extensionIds: [
        // Extensions without proper OpenVSX signatures - REMOVE as they get signed
        "nromanov.dotrush",
        "ms-python.python",
        "typescriptteam.native-preview",
        "typespec.typespec-vscode",
        "ms-toolsai.jupyter",
        "k3ndr1ckfu.tcl-language-support-for-vscode",
        "amiq.dvt"
      ],
      remoteVerificationMinVersion: "2.25.0"
    }
  },
  /** Server-controlled default network allowlist for sandboxed commands */
  sandbox_default_network_allowlist: {
    client: true,
    fallbackValues: {
      allowlist: []
    }
  },
  /** UI labels for the auto spillover 2-bar UI in the spending tab */
  auto_spillover_ui_config: {
    client: true,
    fallbackValues: AUTO_SPILLOVER_UI_DEFAULTS
  },
  glass_perf_vote_config: {
    client: true,
    fallbackValues: GLASS_PERF_VOTE_CONFIG_DEFAULTS
  },
  portal_outage_alert: {
    client: true,
    fallbackValues: {
      enabled: false,
      title: "",
      description: ""
    }
  },
  slack_mcp_client_id: {
    client: true,
    fallbackValues: {
      clientId: "3660753192626.8903469228982"
    }
  },
  file_watcher_metrics_config: {
    client: true,
    fallbackValues: { flush_delay_ms: 3e4 }
  },
  file_watcher_forwarded_storm_config: {
    client: true,
    fallbackValues: {
      window_ms: 1e4,
      min_events: 2500,
      report_throttle_ms: 5 * 6e4,
      top_buckets: 8
    }
  },
  cloud_agent_list_stream_config: {
    client: true,
    fallbackValues: {
      enabled_platforms: [],
      safety_poll_interval_ms: 6e4,
      inactivity_timeout_ms: 45e3,
      max_consecutive_failures: 5,
      reconnect_base_delay_ms: 1e3,
      reconnect_max_delay_ms: 6e4,
      reconcile_delay_ms: 1e3,
      use_list_page_tokens: true,
      membership_poll_interval_ms: 0,
      membership_safety_poll_interval_ms: 0
    }
  },
  statsig_dummy_gauge_config: {
    client: true,
    fallbackValues: { dummy: 0 }
  },
  /** @deprecated Retained for released clients; new clients use memory_monitor_config. */
  memory_monitor_user_toast_config: {
    client: true,
    fallbackValues: { heap_percent: 80 }
  },
  cpu_monitor_config: {
    client: true,
    fallbackValues: {
      total_cpu_percent: 250,
      process_cpu_percent: 95,
      sustained_seconds: 60,
      check_interval_seconds: 15,
      cooldown_seconds: 1800,
      include_system_processes: true
    }
  },
  /** @deprecated Retained for released clients; new clients use memory_monitor_config. */
  memory_pressure_profiling_config: {
    client: true,
    fallbackValues: {
      trigger_heap_percent: 70,
      duration_seconds: 30,
      sampling_interval_bytes: 4096,
      cooldown_seconds: 300
    }
  },
  memory_monitor_config: {
    client: true,
    fallbackValues: {
      base_threshold_mb: 1536,
      critical_offset_mb: 512,
      show_status_entry: false,
      show_internal_warning_popup: false,
      show_user_toast: true,
      user_toast_heap_percent: 80,
      emit_heap_usage_metric: false,
      emergency_profiling_enabled: true,
      emergency_profiling_trigger_heap_percent: 70,
      emergency_profiling_duration_seconds: 30,
      emergency_profiling_sampling_interval_bytes: 4096,
      emergency_profiling_cooldown_seconds: 300
    }
  },
  plugin_onboarding_by_job_role: {
    client: true,
    fallbackValues: {
      byJobRole: {},
      recommendedPluginNamesByJobRole: {}
    }
  },
  leaked_disposables_tracker: {
    client: true,
    fallbackValues: {
      enabled: false,
      reportIntervalMs: 6e4
    }
  },
  gc_disposable_leak_reporting: {
    client: true,
    fallbackValues: {
      enabled: false,
      sessionSampleRate: 0
    }
  },
  solidjs_memo_audit_config: {
    client: true,
    fallbackValues: {
      enabled: false,
      sampleRate: 1,
      maxEventsPerFlush: 5e4,
      reportIntervalMs: 6e4,
      deepProbe: false,
      deepProbeSampleRate: 0.01,
      deepProbeMaxBytes: 16384,
      stackAttribution: false,
      stackCreationSampleRate: 0.02,
      stackRedundantThreshold: 2,
      maxTrackedCreationStacks: 500,
      maxStackReportsPerSession: 10,
      maxStackBytes: 4e3
    }
  },
  solidjs_listener_stacks_config: {
    client: true,
    fallbackValues: {
      enabled: false,
      sampleRate: 1,
      observerThreshold: 2e3,
      maxTrackedSources: 500,
      maxReportsPerSession: 10,
      maxStackBytes: 4e3,
      totalObserverThreshold: 0,
      totalTriggeredSourceFloor: 200,
      totalTriggeredMaxReports: 20
    }
  },
  shell_exec_output_backpressure_config: {
    client: true,
    fallbackValues: {
      outputSuppressionWindowMs: 6e4,
      outputSuppressionThresholdCharsPerSecond: 64 * 1024,
      outputSuppressionMinChars: 256 * 1024,
      outputLimiterFlushIntervalMs: 50,
      outputLimiterMaxBufferedBytes: 256 * 1024,
      extHostMinBatchIntervalMs: 50,
      extHostMaxBatchIntervalMs: 500,
      extHostBytesPerIntervalStep: 1e4
    }
  },
  canvas_prompt_text_config: {
    client: true,
    fallbackValues: {
      skillDescription: "A Cursor Canvas is a live React app that the user can open beside the chat. You MUST use a canvas when the agent produces a standalone analytical artifact \u2014 quantitative analyses, billing investigations, security audits, architecture reviews, data-heavy content, timelines, charts, tables, interactive explorations, repeatable tools, or any response that benefits from visual layout. Especially prefer a canvas when presenting results from MCP tools (Datadog, Databricks, Linear, Sentry, Slack, etc.) where the data is the deliverable \u2014 render it in a rich canvas rather than dumping it into a markdown table or code block. If you catch yourself about to write a markdown table, stop and use a canvas instead. You MUST also read this skill whenever you create, edit, or debug any .canvas.tsx file.",
      errorFixPromptTemplate: [
        "The canvas at `{canvasPath}` has the following error:",
        "",
        '"""',
        "{errorMessage}",
        '"""',
        "",
        "Check if the canvas SDK has changed since this canvas was created.",
        "Update the canvas to use the latest SDK components according to the supplied documentation in the canvas skill."
      ].join("\n"),
      welcomePageEnabled: true,
      marketplaceCategoryKey: "canvas-featured",
      marketplaceMaxCards: 4
    }
  },
  glass_ftux_first_action_config: {
    client: true,
    fallbackValues: {
      byJobRole: {}
    }
  },
  shutdown_hang_watchdog_config: {
    client: true,
    fallbackValues: {
      per_joiner_warn_ms: 2e3,
      fire_on_will_shutdown_total_ms: 3e3,
      process_exit_total_ms: 5e3
    }
  },
  update_diagnostics: {
    client: true,
    fallbackValues: {
      enabled: false,
      restart_time_threshold_seconds: 30,
      attach_ship_it_log: true,
      max_attachment_bytes: 5e6
    }
  },
  sand_update_diagnostics: {
    client: true,
    fallbackValues: {
      enabled: false,
      max_attachment_bytes: 5e6
    }
  },
  startup_diagnostics: {
    client: true,
    fallbackValues: {
      enabled: false,
      timer_name: "ellapsedLoadMainBundle",
      threshold_ms: 3e4
    }
  },
  renderer_ping_config: {
    client: true,
    fallbackValues: {
      enabled: false,
      ping_interval_ms: 5e3,
      block_threshold_ms: 15e3,
      collect_stack_traces: true,
      report_rpc_drain: false
    }
  },
  main_watcher_stall_probe_config: {
    client: true,
    fallbackValues: {
      enabled: false,
      flush_threshold_ms: 250,
      anchor_interval_ms: 1e3,
      anchor_lag_ms: 500,
      cooldown_ms: 6e4,
      session_cap: 10
    }
  },
  editor_input_latency_metrics_config: {
    client: true,
    fallbackValues: {
      enabled: false,
      sample_rate: 0.01,
      window_duration_ms: 6e4
    }
  },
  editor_tokenization_metrics_config: {
    client: true,
    fallbackValues: {
      enabled: false,
      sample_rate: 0.01,
      time_limit_ms: 500
    }
  },
  ripgrep_invocation_monitor_config: {
    client: true,
    fallbackValues: {
      window_ms: 1e4,
      threshold: 50,
      max_records: 100,
      cooldown_ms: 3e5,
      report_to_sentry: true,
      report_initialize_caches: false
    }
  },
  grep_fallback_monitor_config: {
    client: true,
    fallbackValues: {
      window_ms: 6e4,
      min_samples: 20,
      fallback_ratio_threshold: 0.5,
      cooldown_ms: 3e5,
      report_to_sentry: true
    }
  },
  instant_grep_indexing_config: {
    client: true,
    fallbackValues: {
      max_in_memory_documents: null
    }
  },
  git_diff_reply_limit_config: {
    client: true,
    fallbackValues: {
      enabled: true,
      max_reply_bytes: 31457280
    }
  },
  renderer_slow_interaction_sentry_config: {
    client: true,
    fallbackValues: {
      enabled: false,
      threshold_ms: 1e3,
      commit_attribution: false
    }
  },
  glass_fps_monitor_config: {
    client: true,
    fallbackValues: {
      enabled: false,
      min_fps: 30,
      max_drops_per_interval: 3,
      interval_sec: 60,
      baseline_interval_sec: null,
      baseline_sample_rate: null
    }
  },
  /** Create-account path for the org xAI Console unlinked state. */
  xai_team_link_create_mode: {
    client: true,
    fallbackValues: {
      mode: "off"
    }
  },
  mac_computer_use_sidecar_manifest: {
    client: true,
    fallbackValues: {
      sidecarManifestUrl: ""
    }
  },
  windows_computer_use_sidecar_manifest: {
    client: true,
    fallbackValues: {
      x64: "",
      arm64: ""
    }
  },
  computer_use_mcp_instructions: {
    client: true,
    fallbackValues: {
      darwin: { companion: "", remote: "" },
      win32: ""
    }
  },
  // Factory APIs, portal Factory tab, and change-monitor admission.
  change_monitor_enrollment: {
    client: true,
    fallbackValues: {
      enrolled: false,
      enableUI: false,
      orgs: ["*"]
    }
  }
  /* END_DYNAMIC_CONFIGS */
};
var DYNAMIC_CONFIGS_KEYS = Object.keys(
  DYNAMIC_CONFIGS
);
var LAYERS = {
  /* BEGIN_LAYER_CONFIG */
  model_picker_experiments: {
    client: true,
    fallbackValues: {
      promote_first_party_variant: "control",
      effort_first_variant: "control",
      effort_first_compact_model_ids: ["grok-4.5", "grok-4.6"]
    },
    parseValue: {
      promote_first_party_variant: parseEnum([
        "control",
        "grok_primary",
        "pinned_selection",
        "grouped_auto_expand"
      ]),
      effort_first_variant: parseEnum(["control", "treatment"]),
      effort_first_compact_model_ids: parseStringArray
    }
  }
  /* END_LAYER_CONFIG */
};
function parseEnum(enumValues) {
  const parserFn = (value) => {
    if (enumValues.findIndex((v2) => v2 === value) === -1) {
      throw new Error(
        `Invalid value for enum: ${value}, expected one of: ${enumValues.join(", ")}`
      );
    }
    return value;
  };
  return Object.assign(parserFn, { enumValues });
}
function parseBoolean(value) {
  if (typeof value !== "boolean") {
    throw new Error(`Invalid value for boolean: ${value}`);
  }
  return value;
}
function parseString(value) {
  if (typeof value !== "string") {
    throw new Error(`Invalid value for string: ${value}`);
  }
  return value;
}
function parseNumber(value) {
  if (typeof value !== "number") {
    throw new Error(`Invalid value for number: ${value}`);
  }
  return value;
}
function parseNumberArray(value) {
  if (!Array.isArray(value)) {
    throw new Error(`Invalid value for number array: ${value}`);
  }
  return value.map(parseNumber);
}
function parseStringArray(value) {
  if (!Array.isArray(value)) {
    throw new Error(`Invalid value for string array: ${value}`);
  }
  return value.map(parseString);
}

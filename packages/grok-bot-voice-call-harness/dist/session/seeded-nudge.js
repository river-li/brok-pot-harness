var SEEDED_TOOL_BY_KIND = {
  ack: VOICE_CALL_WORK_LANDED_TOOL,
  progress: VOICE_CALL_WORK_LANDED_TOOL,
  outcome: VOICE_CALL_WORK_LANDED_TOOL,
  overheard: VOICE_CALL_WORK_OVERHEARD_TOOL
};
var SEEDED_CALL_ARGUMENTS = "{}";
var VoiceCallItemSeeding = class _VoiceCallItemSeeding {
  static SEEDED_TOOL = VOICE_CALL_WORK_LANDED_TOOL;
  static OVERHEARD_TOOL = VOICE_CALL_WORK_OVERHEARD_TOOL;
  static CALL_ID_PREFIX = "seeded-nudge";
  static callId(nudgeId) {
    return `${_VoiceCallItemSeeding.CALL_ID_PREFIX}-${nudgeId}`;
  }
  static seededTool(kind) {
    return SEEDED_TOOL_BY_KIND[kind];
  }
  static progressNote({ kind, texts, atMs }) {
    const at2 = new Date(atMs).toISOString().replace(/\.\d{3}Z$/, "Z");
    return kind === "overheard" ? { status: "in progress", steps: texts, at: at2 } : { status: "landed", updates: texts, at: at2 };
  }
  static isNudgeKind(value) {
    return value === "ack" || value === "progress" || value === "outcome" || value === "overheard";
  }
  /**
   * The kinds a nudge may be *sent* as, because these are the ones the caller
   * hears. An ack is the session's own bookkeeping for an update that repeats
   * what the voice side already said; offering it to the working side would
   * be offering a way to reach nobody.
   */
  static SPOKEN_KINDS = [
    "progress",
    "outcome"
  ];
  /**
   * A seeded step rides in the model's context for the rest of the call, so it
   * is held to the same size a spoken nudge is.
   */
  static OVERHEARD_CHAR_LIMIT = VOICE_CALL_REQUEST_CHAR_LIMIT;
  /**
   * Whether seeding this update should also ask the model for a spoken turn.
   * The frames land in its history either way; asking is what reaches the ear,
   * and spending a turn on something already heard reads as the work stopping
   * rather than as progress.
   */
  static earnsASpokenTurn({ kind }) {
    const spoken = _VoiceCallItemSeeding.SPOKEN_KINDS;
    return spoken.includes(kind);
  }
  /**
   * An update nobody speaks stays a seeded pair on either wire: the
   * orchestrator opens a turn for every async update, and a step in progress
   * must not be spoken.
   */
  static delivery(seed, wire) {
    if (!_VoiceCallItemSeeding.earnsASpokenTurn(seed))
      return "filed";
    return wire === "async-update" ? "orchestrated" : "asked";
  }
  static frames(seed, wire) {
    if (_VoiceCallItemSeeding.delivery(seed, wire) === "orchestrated") {
      return [
        VoiceCallAsyncUpdate.frame({
          topic: VOICE_CALL_WORK_LANDED_TOOL,
          eventId: seed.callId,
          texts: seed.texts,
          atMs: seed.atMs
        })
      ];
    }
    return _VoiceCallItemSeeding.pair(seed);
  }
  /** The note lives on the output side; the call side carries `{}`. */
  static pair({ callId, kind, texts, atMs }) {
    return [
      {
        type: "conversation.item.create",
        item: {
          type: "function_call",
          name: _VoiceCallItemSeeding.seededTool(kind),
          call_id: callId,
          arguments: SEEDED_CALL_ARGUMENTS
        }
      },
      {
        type: "conversation.item.create",
        item: {
          type: "function_call_output",
          call_id: callId,
          output: JSON.stringify(_VoiceCallItemSeeding.progressNote({ kind, texts, atMs }))
        }
      }
    ];
  }
};

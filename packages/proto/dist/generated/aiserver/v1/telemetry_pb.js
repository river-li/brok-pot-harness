var __protoPackage143, __protoMessage3136, PerformanceEventType, ProfileKind, InteractionType, SpanKind, ReportInlineActionRequest, ReportInlineActionResponse, ReportMetricsRequest, ReportMetricsRequest_Metric, ReportMetricsRequest_NamedMetric, ReportMetricsResponse, ScriptTiming, PerformanceEvent, SystemMetadata, SubmitPerformanceEventsRequest, SubmitPerformanceEventsResponse, CapturedProfile, Interaction, CapturedWebProfile, SubmitProfileRequest, SubmitProfileResponse, SubmitInteractionWindowRequest, SubmitInteractionWindowResponse, PerformanceMetric, TraceSpan, Status, Status_StatusCode, TraceLink, SubmitSpansRequest, SubmitSpansResponse, SubmitToolCallEventsRequest, SubmitToolCallEventsResponse, ToolCallTelemetryEvent, SubmitChatRequestEventsRequest, SubmitChatRequestEventsResponse, ChatRequestTelemetryEvent;
var init_telemetry_pb = __esm({
  "../packages/proto/dist/generated/aiserver/v1/telemetry_pb.js"() {
    "use strict";
    init_esm();
    init_compact();
    __protoPackage143 = "aiserver.v1.";
    __protoMessage3136 = class extends CompactMessage {
      static get runtime() {
        return defineOwn(this, "runtime", proto3);
      }
      static $p() {
        return __protoPackage143;
      }
    };
    PerformanceEventType = /* @__PURE__ */ enumType(proto3, __protoPackage143, "PerformanceEventType", [[0, "UNSPECIFIED"], [1, "CLICK"], [2, "POINTER"], [3, "TOUCH"], [4, "KEYDOWN"], [5, "KEYUP"], [6, "SCROLL"], [7, "LONG_ANIMATION_FRAME"], [8, "MOUSEDOWN"], [9, "MOUSEUP"]], 1);
    ProfileKind = /* @__PURE__ */ enumType(proto3, __protoPackage143, "ProfileKind", [[0, "UNSPECIFIED"], [1, "WALL"], [2, "ALLOCATION"], [3, "CPU"]], 1);
    InteractionType = /* @__PURE__ */ enumType(proto3, __protoPackage143, "InteractionType", [[0, "UNSPECIFIED"], [1, "CLICK"], [2, "KEYPRESS"]], 1);
    SpanKind = /* @__PURE__ */ enumType(proto3, __protoPackage143, "SpanKind", [[0, "UNSPECIFIED"], [1, "INTERNAL"], [2, "SERVER"], [3, "CLIENT"], [4, "PRODUCER"], [5, "CONSUMER"]], 1);
    ReportInlineActionRequest = class _ReportInlineActionRequest extends __protoMessage3136 {
      constructor(data) {
        super();
        this.action = "";
        this.generationUuid = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ReportInlineActionRequest().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ReportInlineActionRequest().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ReportInlineActionRequest().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ReportInlineActionRequest, a, b2);
      }
      static $() {
        return ["ReportInlineActionRequest|1 action 9|2 generation_uuid 9"];
      }
    };
    ReportInlineActionResponse = class _ReportInlineActionResponse extends __protoMessage3136 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ReportInlineActionResponse().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ReportInlineActionResponse().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ReportInlineActionResponse().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ReportInlineActionResponse, a, b2);
      }
      static $() {
        return ["ReportInlineActionResponse"];
      }
    };
    ReportMetricsRequest = class _ReportMetricsRequest extends __protoMessage3136 {
      constructor(data) {
        super();
        this.metrics = {};
        this.metricsList = [];
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ReportMetricsRequest().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ReportMetricsRequest().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ReportMetricsRequest().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ReportMetricsRequest, a, b2);
      }
      static $() {
        return ["ReportMetricsRequest|1 metrics 9,#0|2 metrics_list #1*", ReportMetricsRequest_Metric, ReportMetricsRequest_NamedMetric];
      }
    };
    ReportMetricsRequest_Metric = class _ReportMetricsRequest_Metric extends __protoMessage3136 {
      constructor(data) {
        super();
        this.tags = {};
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ReportMetricsRequest_Metric().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ReportMetricsRequest_Metric().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ReportMetricsRequest_Metric().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ReportMetricsRequest_Metric, a, b2);
      }
      static $() {
        return ["ReportMetricsRequest.Metric|1 value 1?|2 tags 9,9"];
      }
    };
    ReportMetricsRequest_NamedMetric = class _ReportMetricsRequest_NamedMetric extends __protoMessage3136 {
      constructor(data) {
        super();
        this.name = "";
        this.tags = {};
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ReportMetricsRequest_NamedMetric().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ReportMetricsRequest_NamedMetric().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ReportMetricsRequest_NamedMetric().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ReportMetricsRequest_NamedMetric, a, b2);
      }
      static $() {
        return ["ReportMetricsRequest.NamedMetric|1 name 9|2 value 1?|3 tags 9,9"];
      }
    };
    ReportMetricsResponse = class _ReportMetricsResponse extends __protoMessage3136 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ReportMetricsResponse().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ReportMetricsResponse().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ReportMetricsResponse().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ReportMetricsResponse, a, b2);
      }
      static $() {
        return ["ReportMetricsResponse"];
      }
    };
    ScriptTiming = class _ScriptTiming extends __protoMessage3136 {
      constructor(data) {
        super();
        this.name = "";
        this.startTime = 0;
        this.duration = 0;
        this.executionStart = 0;
        this.forcedStyleAndLayoutDuration = 0;
        this.pauseDuration = 0;
        this.sourceUrl = "";
        this.sourceFunctionName = "";
        this.sourceCharPosition = 0;
        this.invokerType = "";
        this.windowAttribution = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ScriptTiming().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ScriptTiming().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ScriptTiming().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ScriptTiming, a, b2);
      }
      static $() {
        return ["ScriptTiming|1 name 9|2 start_time 1|3 duration 1|4 execution_start 1|5 forced_style_and_layout_duration 1|6 pause_duration 1|7 source_url 9|8 source_function_name 9|9 source_char_position 5|10 invoker 9?|11 invoker_type 9|12 window_attribution 9"];
      }
    };
    PerformanceEvent = class _PerformanceEvent extends __protoMessage3136 {
      constructor(data) {
        super();
        this.eventType = PerformanceEventType.UNSPECIFIED;
        this.performanceTimestamp = 0;
        this.scripts = [];
        this.metadata = {};
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _PerformanceEvent().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _PerformanceEvent().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _PerformanceEvent().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_PerformanceEvent, a, b2);
      }
      static $() {
        return ["PerformanceEvent|1 event_type #0|2 timestamp #1|3 performance_timestamp 1|4 duration 1?|5 target_element 9?|6 target_class 9?|7 target_id 9?|26 target_aria_id 9?|8 client_x 5?|9 client_y 5?|10 key 9?|11 code 9?|12 ctrl_key 8?|13 alt_key 8?|14 shift_key 8?|15 meta_key 8?|16 scroll_x 1?|17 scroll_y 1?|18 scroll_delta_x 1?|19 scroll_delta_y 1?|21 render_start 1?|22 style_and_layout_start 1?|23 first_ui_event_timestamp 1?|24 blocking_duration 1?|25 scripts #2*|20 metadata 9,9", PerformanceEventType, Timestamp, ScriptTiming];
      }
    };
    SystemMetadata = class _SystemMetadata extends __protoMessage3136 {
      constructor(data) {
        super();
        this.additionalMetadata = {};
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _SystemMetadata().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _SystemMetadata().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _SystemMetadata().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_SystemMetadata, a, b2);
      }
      static $() {
        return ["SystemMetadata|1 timestamp #0|2 memory_used_mb 1?|3 memory_total_mb 1?|4 cpu_usage_percent 1?|5 active_tabs_count 5?|6 open_editors_count 5?|7 window_focused 8?|8 window_size 9?|9 additional_metadata 9,9", Timestamp];
      }
    };
    SubmitPerformanceEventsRequest = class _SubmitPerformanceEventsRequest extends __protoMessage3136 {
      constructor(data) {
        super();
        this.sessionId = "";
        this.events = [];
        this.clientVersion = "";
        this.clientCommit = "";
        this.platformTags = {};
        this.metrics = [];
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _SubmitPerformanceEventsRequest().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _SubmitPerformanceEventsRequest().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _SubmitPerformanceEventsRequest().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_SubmitPerformanceEventsRequest, a, b2);
      }
      static $() {
        return ["SubmitPerformanceEventsRequest|1 session_id 9|2 events #0*|3 system_metadata #1?|4 client_version 9|5 client_commit 9|6 platform_tags 9,9|7 window_type 9?|8 metrics #2*", PerformanceEvent, SystemMetadata, PerformanceMetric];
      }
    };
    SubmitPerformanceEventsResponse = class _SubmitPerformanceEventsResponse extends __protoMessage3136 {
      constructor(data) {
        super();
        this.success = false;
        this.eventsProcessed = 0;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _SubmitPerformanceEventsResponse().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _SubmitPerformanceEventsResponse().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _SubmitPerformanceEventsResponse().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_SubmitPerformanceEventsResponse, a, b2);
      }
      static $() {
        return ["SubmitPerformanceEventsResponse|1 success 8|2 error_message 9?|3 events_processed 5"];
      }
    };
    CapturedProfile = class _CapturedProfile extends __protoMessage3136 {
      constructor(data) {
        super();
        this.profileData = new Uint8Array(0);
        this.profileConfigId = "";
        this.profileKind = ProfileKind.UNSPECIFIED;
        this.tags = {};
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _CapturedProfile().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _CapturedProfile().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _CapturedProfile().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_CapturedProfile, a, b2);
      }
      static $() {
        return ["CapturedProfile|1 timestamp #0|2 duration #1|3 profile_data 12|4 profile_config_id 9|5 profile_kind #2|6 tags 9,9", Timestamp, Duration, ProfileKind];
      }
    };
    Interaction = class _Interaction extends __protoMessage3136 {
      constructor(data) {
        super();
        this.id = "";
        this.type = InteractionType.UNSPECIFIED;
        this.performanceStartTimestamp = 0;
        this.performanceEndTimestamp = 0;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _Interaction().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _Interaction().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _Interaction().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_Interaction, a, b2);
      }
      static $() {
        return ["Interaction|1 id 9|2 type #0|3 performance_start_timestamp 1|4 performance_end_timestamp 1", InteractionType];
      }
    };
    CapturedWebProfile = class _CapturedWebProfile extends __protoMessage3136 {
      constructor(data) {
        super();
        this.traceData = new Uint8Array(0);
        this.tags = {};
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _CapturedWebProfile().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _CapturedWebProfile().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _CapturedWebProfile().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_CapturedWebProfile, a, b2);
      }
      static $() {
        return ["CapturedWebProfile|1 timestamp #0|3 trace_data 12|4 tags 9,9", Timestamp];
      }
    };
    SubmitProfileRequest = class _SubmitProfileRequest extends __protoMessage3136 {
      constructor(data) {
        super();
        this.profiles = [];
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _SubmitProfileRequest().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _SubmitProfileRequest().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _SubmitProfileRequest().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_SubmitProfileRequest, a, b2);
      }
      static $() {
        return ["SubmitProfileRequest|1 profiles #0*", CapturedProfile];
      }
    };
    SubmitProfileResponse = class _SubmitProfileResponse extends __protoMessage3136 {
      constructor(data) {
        super();
        this.profileIds = [];
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _SubmitProfileResponse().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _SubmitProfileResponse().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _SubmitProfileResponse().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_SubmitProfileResponse, a, b2);
      }
      static $() {
        return ["SubmitProfileResponse|1 profile_ids 9*"];
      }
    };
    SubmitInteractionWindowRequest = class _SubmitInteractionWindowRequest extends __protoMessage3136 {
      constructor(data) {
        super();
        this.interactions = [];
        this.sessionId = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _SubmitInteractionWindowRequest().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _SubmitInteractionWindowRequest().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _SubmitInteractionWindowRequest().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_SubmitInteractionWindowRequest, a, b2);
      }
      static $() {
        return ["SubmitInteractionWindowRequest|1 time_origin #0|2 web_profile #1|3 interactions #2*|4 session_id 9", Timestamp, CapturedWebProfile, Interaction];
      }
    };
    SubmitInteractionWindowResponse = class _SubmitInteractionWindowResponse extends __protoMessage3136 {
      constructor(data) {
        super();
        this.success = false;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _SubmitInteractionWindowResponse().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _SubmitInteractionWindowResponse().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _SubmitInteractionWindowResponse().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_SubmitInteractionWindowResponse, a, b2);
      }
      static $() {
        return ["SubmitInteractionWindowResponse|1 success 8|2 error_message 9?"];
      }
    };
    PerformanceMetric = class _PerformanceMetric extends __protoMessage3136 {
      constructor(data) {
        super();
        this.name = "";
        this.value = 0;
        this.metadata = {};
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _PerformanceMetric().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _PerformanceMetric().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _PerformanceMetric().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_PerformanceMetric, a, b2);
      }
      static $() {
        return ["PerformanceMetric|1 timestamp #0|2 name 9|3 value 1|4 unit 9?|5 metadata 9,9", Timestamp];
      }
    };
    TraceSpan = class _TraceSpan extends __protoMessage3136 {
      constructor(data) {
        super();
        this.traceId = "";
        this.spanId = "";
        this.name = "";
        this.attributes = {};
        this.links = [];
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _TraceSpan().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _TraceSpan().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _TraceSpan().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_TraceSpan, a, b2);
      }
      static $() {
        return ["TraceSpan|1 trace_id 9|2 span_id 9|3 parent_span_id 9?|4 name 9|5 start_time #0|6 end_time #0|7 attributes 9,9|8 error 8?|9 trace_state 9?|10 flags 13?|11 kind #1?|12 status #2?|13 links #3*", Timestamp, SpanKind, Status, TraceLink];
      }
    };
    Status = class _Status extends __protoMessage3136 {
      constructor(data) {
        super();
        this.message = "";
        this.code = Status_StatusCode.UNSPECIFIED;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _Status().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _Status().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _Status().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_Status, a, b2);
      }
      static $() {
        return ["Status|1 message 9|2 code #0", Status_StatusCode];
      }
    };
    Status_StatusCode = /* @__PURE__ */ enumType(proto3, __protoPackage143, "Status.StatusCode", [[0, "UNSPECIFIED"], [1, "OK"], [2, "ERROR"]], 1);
    TraceLink = class _TraceLink extends __protoMessage3136 {
      constructor(data) {
        super();
        this.traceId = "";
        this.spanId = "";
        this.attributes = {};
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _TraceLink().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _TraceLink().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _TraceLink().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_TraceLink, a, b2);
      }
      static $() {
        return ["TraceLink|1 trace_id 9|2 span_id 9|3 trace_state 9?|4 attributes 9,9|5 flags 13?"];
      }
    };
    SubmitSpansRequest = class _SubmitSpansRequest extends __protoMessage3136 {
      constructor(data) {
        super();
        this.spans = [];
        this.clientVersion = "";
        this.clientCommit = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _SubmitSpansRequest().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _SubmitSpansRequest().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _SubmitSpansRequest().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_SubmitSpansRequest, a, b2);
      }
      static $() {
        return ["SubmitSpansRequest|1 spans #0*|2 client_version 9|3 client_commit 9", TraceSpan];
      }
    };
    SubmitSpansResponse = class _SubmitSpansResponse extends __protoMessage3136 {
      constructor(data) {
        super();
        this.success = false;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _SubmitSpansResponse().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _SubmitSpansResponse().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _SubmitSpansResponse().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_SubmitSpansResponse, a, b2);
      }
      static $() {
        return ["SubmitSpansResponse|1 success 8|2 error_message 9?"];
      }
    };
    SubmitToolCallEventsRequest = class _SubmitToolCallEventsRequest extends __protoMessage3136 {
      constructor(data) {
        super();
        this.sessionId = "";
        this.events = [];
        this.clientVersion = "";
        this.clientCommit = "";
        this.platformTags = {};
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _SubmitToolCallEventsRequest().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _SubmitToolCallEventsRequest().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _SubmitToolCallEventsRequest().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_SubmitToolCallEventsRequest, a, b2);
      }
      static $() {
        return ["SubmitToolCallEventsRequest|1 session_id 9|2 events #0*|3 client_version 9|4 client_commit 9|5 platform_tags 9,9|6 window_type 9?", ToolCallTelemetryEvent];
      }
    };
    SubmitToolCallEventsResponse = class _SubmitToolCallEventsResponse extends __protoMessage3136 {
      constructor(data) {
        super();
        this.success = false;
        this.eventsProcessed = 0;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _SubmitToolCallEventsResponse().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _SubmitToolCallEventsResponse().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _SubmitToolCallEventsResponse().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_SubmitToolCallEventsResponse, a, b2);
      }
      static $() {
        return ["SubmitToolCallEventsResponse|1 success 8|2 error_message 9?|3 events_processed 5"];
      }
    };
    ToolCallTelemetryEvent = class _ToolCallTelemetryEvent extends __protoMessage3136 {
      constructor(data) {
        super();
        this.toolCallId = "";
        this.toolType = "";
        this.chatRequestUuid = "";
        this.modelName = "";
        this.isParallel = false;
        this.success = false;
        this.metadata = {};
        this.isStream = false;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ToolCallTelemetryEvent().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ToolCallTelemetryEvent().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ToolCallTelemetryEvent().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ToolCallTelemetryEvent, a, b2);
      }
      static $() {
        return ["ToolCallTelemetryEvent|1 tool_call_id 9|2 tool_type 9|3 chat_request_uuid 9|4 model_name 9|5 start_time #0|6 end_time #0|7 duration #1|8 is_parallel 8|9 parallel_batch_size 5?|10 success 8|11 error_message 9?|12 metadata 9,9|13 approval_wait_duration #1?|14 is_stream 8", Timestamp, Duration];
      }
    };
    SubmitChatRequestEventsRequest = class _SubmitChatRequestEventsRequest extends __protoMessage3136 {
      constructor(data) {
        super();
        this.sessionId = "";
        this.events = [];
        this.clientVersion = "";
        this.clientCommit = "";
        this.platformTags = {};
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _SubmitChatRequestEventsRequest().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _SubmitChatRequestEventsRequest().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _SubmitChatRequestEventsRequest().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_SubmitChatRequestEventsRequest, a, b2);
      }
      static $() {
        return ["SubmitChatRequestEventsRequest|1 session_id 9|2 events #0*|3 client_version 9|4 client_commit 9|5 platform_tags 9,9|6 window_type 9?", ChatRequestTelemetryEvent];
      }
    };
    SubmitChatRequestEventsResponse = class _SubmitChatRequestEventsResponse extends __protoMessage3136 {
      constructor(data) {
        super();
        this.success = false;
        this.eventsProcessed = 0;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _SubmitChatRequestEventsResponse().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _SubmitChatRequestEventsResponse().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _SubmitChatRequestEventsResponse().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_SubmitChatRequestEventsResponse, a, b2);
      }
      static $() {
        return ["SubmitChatRequestEventsResponse|1 success 8|2 error_message 9?|3 events_processed 5"];
      }
    };
    ChatRequestTelemetryEvent = class _ChatRequestTelemetryEvent extends __protoMessage3136 {
      constructor(data) {
        super();
        this.chatRequestUuid = "";
        this.requestedModel = "";
        this.actualModel = "";
        this.success = false;
        this.completionStatus = "";
        this.metadata = {};
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ChatRequestTelemetryEvent().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ChatRequestTelemetryEvent().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ChatRequestTelemetryEvent().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ChatRequestTelemetryEvent, a, b2);
      }
      static $() {
        return ["ChatRequestTelemetryEvent|1 chat_request_uuid 9|2 requested_model 9|3 actual_model 9|4 start_time #0|5 end_time #0|6 duration #1|7 success 8|8 error_message 9?|9 transport 9?|10 completion_status 9|11 metadata 9,9|12 total_ttft_ms 1?|13 total_generate_ms 1?|14 total_stream_ms 1?|15 total_request_ms 1?|16 model_call_count 5?|17 total_tool_call_latency 1?|18 tool_call_count 5?", Timestamp, Duration];
      }
    };
  }
});

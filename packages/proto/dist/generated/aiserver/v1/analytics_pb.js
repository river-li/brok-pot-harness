var __protoPackage148, __protoMessage3141, ClientOS, ClientLogLevel, BootstrapStatsigRequest, BootstrapStatsigResponse, GetFirstWindowStatsigDecisionRequest, GetFirstWindowStatsigDecisionResponse, EventData, AnalyticsEvent, TrackEventsRequest, TrackEventsResponse, BatchEvent, AnalyticsContext, ClientInfo, BatchRequest, BatchResponse, ClientLogEntry, SubmitLogsRequest, SubmitLogsResponse, IngestConversationRequest, IngestConversationResponse, UploadIssueTraceRequest, UploadIssueTraceResponse, DownloadIssueTracesRequest, DownloadIssueTracesResponse;
var init_analytics_pb = __esm({
  "../packages/proto/dist/generated/aiserver/v1/analytics_pb.js"() {
    "use strict";
    init_esm();
    init_compact();
    __protoPackage148 = "aiserver.v1.";
    __protoMessage3141 = class extends CompactMessage {
      static get runtime() {
        return defineOwn(this, "runtime", proto3);
      }
      static $p() {
        return __protoPackage148;
      }
    };
    ClientOS = /* @__PURE__ */ enumType(proto3, __protoPackage148, "ClientOS", [[0, "CLIENT_OS_UNSPECIFIED"], [1, "CLIENT_OS_WINDOWS"], [2, "CLIENT_OS_MACOS"], [3, "CLIENT_OS_LINUX"], [4, "CLIENT_OS_IOS"], [5, "CLIENT_OS_ANDROID"]]);
    ClientLogLevel = /* @__PURE__ */ enumType(proto3, __protoPackage148, "ClientLogLevel", [[0, "UNSPECIFIED"], [1, "INFO"], [2, "DEBUG"], [3, "WARN"], [4, "ERROR"]], 1);
    BootstrapStatsigRequest = class _BootstrapStatsigRequest extends __protoMessage3141 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _BootstrapStatsigRequest().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _BootstrapStatsigRequest().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _BootstrapStatsigRequest().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_BootstrapStatsigRequest, a, b2);
      }
      static $() {
        return ["BootstrapStatsigRequest|1 ignore_dev_status 8?|2 operating_system #0?|3 device_model 9?|4 os_version 9?|5 form_factor 9?|6 stable_id 9?|7 client_channel 9?|8 bundle_id 9?", ClientOS];
      }
    };
    BootstrapStatsigResponse = class _BootstrapStatsigResponse extends __protoMessage3141 {
      constructor(data) {
        super();
        this.config = "";
        this.generatedAtMs = protoInt64.zero;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _BootstrapStatsigResponse().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _BootstrapStatsigResponse().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _BootstrapStatsigResponse().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_BootstrapStatsigResponse, a, b2);
      }
      static $() {
        return ["BootstrapStatsigResponse|1 config 9|2 generated_at_ms 4"];
      }
    };
    GetFirstWindowStatsigDecisionRequest = class _GetFirstWindowStatsigDecisionRequest extends __protoMessage3141 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _GetFirstWindowStatsigDecisionRequest().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _GetFirstWindowStatsigDecisionRequest().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _GetFirstWindowStatsigDecisionRequest().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_GetFirstWindowStatsigDecisionRequest, a, b2);
      }
      static $() {
        return ["GetFirstWindowStatsigDecisionRequest|1 operating_system #0?", ClientOS];
      }
    };
    GetFirstWindowStatsigDecisionResponse = class _GetFirstWindowStatsigDecisionResponse extends __protoMessage3141 {
      constructor(data) {
        super();
        this.variant = "";
        this.reason = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _GetFirstWindowStatsigDecisionResponse().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _GetFirstWindowStatsigDecisionResponse().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _GetFirstWindowStatsigDecisionResponse().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_GetFirstWindowStatsigDecisionResponse, a, b2);
      }
      static $() {
        return ["GetFirstWindowStatsigDecisionResponse|1 variant 9|2 reason 9"];
      }
    };
    EventData = class _EventData extends __protoMessage3141 {
      constructor(data) {
        super();
        this.data = { case: void 0 };
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _EventData().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _EventData().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _EventData().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_EventData, a, b2);
      }
      static $() {
        return ["EventData|1 string_value 9 data|2 int_value 3 data|3 bool_value 8 data|4 double_value 1 data"];
      }
    };
    AnalyticsEvent = class _AnalyticsEvent extends __protoMessage3141 {
      constructor(data) {
        super();
        this.eventName = "";
        this.eventData = {};
        this.timestamp = protoInt64.zero;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _AnalyticsEvent().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _AnalyticsEvent().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _AnalyticsEvent().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_AnalyticsEvent, a, b2);
      }
      static $() {
        return ["AnalyticsEvent|1 event_name 9|2 event_data 9,#0|3 timestamp 3", EventData];
      }
    };
    TrackEventsRequest = class _TrackEventsRequest extends __protoMessage3141 {
      constructor(data) {
        super();
        this.events = [];
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _TrackEventsRequest().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _TrackEventsRequest().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _TrackEventsRequest().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_TrackEventsRequest, a, b2);
      }
      static $() {
        return ["TrackEventsRequest|1 events #0*", AnalyticsEvent];
      }
    };
    TrackEventsResponse = class _TrackEventsResponse extends __protoMessage3141 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _TrackEventsResponse().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _TrackEventsResponse().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _TrackEventsResponse().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_TrackEventsResponse, a, b2);
      }
      static $() {
        return ["TrackEventsResponse"];
      }
    };
    BatchEvent = class _BatchEvent extends __protoMessage3141 {
      constructor(data) {
        super();
        this.event = "";
        this.timestamp = protoInt64.zero;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _BatchEvent().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _BatchEvent().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _BatchEvent().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_BatchEvent, a, b2);
      }
      static $() {
        return ["BatchEvent|1 event 9|2 properties #0|3 timestamp 3|4 user_id 9?|5 anonymous_id 9?|6 message_id 9?|7 context #1?", Struct, AnalyticsContext];
      }
    };
    AnalyticsContext = class _AnalyticsContext extends __protoMessage3141 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _AnalyticsContext().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _AnalyticsContext().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _AnalyticsContext().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_AnalyticsContext, a, b2);
      }
      static $() {
        return ["AnalyticsContext|1 client #0?", ClientInfo];
      }
    };
    ClientInfo = class _ClientInfo extends __protoMessage3141 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ClientInfo().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ClientInfo().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ClientInfo().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ClientInfo, a, b2);
      }
      static $() {
        return ["ClientInfo|1 os 9?|2 arch 9?|3 os_version 9?|4 version 9?|5 layout 9?"];
      }
    };
    BatchRequest = class _BatchRequest extends __protoMessage3141 {
      constructor(data) {
        super();
        this.events = [];
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _BatchRequest().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _BatchRequest().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _BatchRequest().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_BatchRequest, a, b2);
      }
      static $() {
        return ["BatchRequest|1 events #0*", BatchEvent];
      }
    };
    BatchResponse = class _BatchResponse extends __protoMessage3141 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _BatchResponse().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _BatchResponse().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _BatchResponse().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_BatchResponse, a, b2);
      }
      static $() {
        return ["BatchResponse"];
      }
    };
    ClientLogEntry = class _ClientLogEntry extends __protoMessage3141 {
      constructor(data) {
        super();
        this.level = ClientLogLevel.UNSPECIFIED;
        this.message = "";
        this.metadata = {};
        this.timestamp = protoInt64.zero;
        this.key = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ClientLogEntry().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ClientLogEntry().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ClientLogEntry().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ClientLogEntry, a, b2);
      }
      static $() {
        return ["ClientLogEntry|1 level #0|2 message 9|3 metadata 9,9|4 timestamp 3|5 error_message 9?|6 error_stack 9?|7 key 9", ClientLogLevel];
      }
    };
    SubmitLogsRequest = class _SubmitLogsRequest extends __protoMessage3141 {
      constructor(data) {
        super();
        this.logs = [];
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _SubmitLogsRequest().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _SubmitLogsRequest().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _SubmitLogsRequest().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_SubmitLogsRequest, a, b2);
      }
      static $() {
        return ["SubmitLogsRequest|1 logs #0*", ClientLogEntry];
      }
    };
    SubmitLogsResponse = class _SubmitLogsResponse extends __protoMessage3141 {
      constructor(data) {
        super();
        this.success = false;
        this.logsProcessed = 0;
        this.logsDropped = 0;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _SubmitLogsResponse().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _SubmitLogsResponse().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _SubmitLogsResponse().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_SubmitLogsResponse, a, b2);
      }
      static $() {
        return ["SubmitLogsResponse|1 success 8|2 error_message 9?|3 logs_processed 13|4 logs_dropped 13"];
      }
    };
    IngestConversationRequest = class _IngestConversationRequest extends __protoMessage3141 {
      constructor(data) {
        super();
        this.conversationId = "";
        this.transcript = "";
        this.lastUpdatedAt = protoInt64.zero;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _IngestConversationRequest().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _IngestConversationRequest().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _IngestConversationRequest().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_IngestConversationRequest, a, b2);
      }
      static $() {
        return ["IngestConversationRequest|1 conversation_id 9|2 transcript 9|3 transcript_json 9?|4 mode 9?|5 model 9?|6 last_updated_at 3"];
      }
    };
    IngestConversationResponse = class _IngestConversationResponse extends __protoMessage3141 {
      constructor(data) {
        super();
        this.success = false;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _IngestConversationResponse().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _IngestConversationResponse().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _IngestConversationResponse().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_IngestConversationResponse, a, b2);
      }
      static $() {
        return ["IngestConversationResponse|1 success 8|2 summary 9?|3 detailed_summary 9?|4 error_message 9?"];
      }
    };
    UploadIssueTraceRequest = class _UploadIssueTraceRequest extends __protoMessage3141 {
      constructor(data) {
        super();
        this.token = "";
        this.payload = "";
        this.payloadHash = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _UploadIssueTraceRequest().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _UploadIssueTraceRequest().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _UploadIssueTraceRequest().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_UploadIssueTraceRequest, a, b2);
      }
      static $() {
        return ["UploadIssueTraceRequest|1 token 9|2 payload 9|3 payload_hash 9"];
      }
    };
    UploadIssueTraceResponse = class _UploadIssueTraceResponse extends __protoMessage3141 {
      constructor(data) {
        super();
        this.eventId = "";
        this.size = protoInt64.zero;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _UploadIssueTraceResponse().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _UploadIssueTraceResponse().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _UploadIssueTraceResponse().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_UploadIssueTraceResponse, a, b2);
      }
      static $() {
        return ["UploadIssueTraceResponse|1 event_id 9|2 size 3"];
      }
    };
    DownloadIssueTracesRequest = class _DownloadIssueTracesRequest extends __protoMessage3141 {
      constructor(data) {
        super();
        this.token = "";
        this.limit = 0;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _DownloadIssueTracesRequest().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _DownloadIssueTracesRequest().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _DownloadIssueTracesRequest().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_DownloadIssueTracesRequest, a, b2);
      }
      static $() {
        return ["DownloadIssueTracesRequest|1 token 9|2 limit 5"];
      }
    };
    DownloadIssueTracesResponse = class _DownloadIssueTracesResponse extends __protoMessage3141 {
      constructor(data) {
        super();
        this.data = new Uint8Array(0);
        this.totalTraces = 0;
        this.totalBytes = protoInt64.zero;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _DownloadIssueTracesResponse().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _DownloadIssueTracesResponse().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _DownloadIssueTracesResponse().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_DownloadIssueTracesResponse, a, b2);
      }
      static $() {
        return ["DownloadIssueTracesResponse|1 data 12|2 total_traces 5|3 total_bytes 3"];
      }
    };
  }
});

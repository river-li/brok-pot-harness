/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/proto/dist/generated/aiserver/v1/telemetry_connect.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_telemetry_pb();
init_esm();
var MetricsService = {
  typeName: "aiserver.v1.MetricsService",
  methods: {
    /**
     * @generated from rpc aiserver.v1.MetricsService.ReportIncrement
     */
    reportIncrement: {
      name: "ReportIncrement",
      I: ReportMetricsRequest,
      O: ReportMetricsResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.MetricsService.ReportDecrement
     */
    reportDecrement: {
      name: "ReportDecrement",
      I: ReportMetricsRequest,
      O: ReportMetricsResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.MetricsService.ReportDistribution
     */
    reportDistribution: {
      name: "ReportDistribution",
      I: ReportMetricsRequest,
      O: ReportMetricsResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc aiserver.v1.MetricsService.ReportGauge
     */
    reportGauge: {
      name: "ReportGauge",
      I: ReportMetricsRequest,
      O: ReportMetricsResponse,
      kind: MethodKind.Unary
    }
  }
};
var PerformanceEventService = {
  typeName: "aiserver.v1.PerformanceEventService",
  methods: {
    /**
     * Submit a batch of performance events
     *
     * @generated from rpc aiserver.v1.PerformanceEventService.SubmitPerformanceEvents
     */
    submitPerformanceEvents: {
      name: "SubmitPerformanceEvents",
      I: SubmitPerformanceEventsRequest,
      O: SubmitPerformanceEventsResponse,
      kind: MethodKind.Unary
    }
  }
};
var ProfilingService = {
  typeName: "aiserver.v1.ProfilingService",
  methods: {
    /**
     * Submit a profile to the server
     *
     * @generated from rpc aiserver.v1.ProfilingService.SubmitProfile
     */
    submitProfile: {
      name: "SubmitProfile",
      I: SubmitProfileRequest,
      O: SubmitProfileResponse,
      kind: MethodKind.Unary
    }
  }
};
var WebProfilingService = {
  typeName: "aiserver.v1.WebProfilingService",
  methods: {
    /**
     * @generated from rpc aiserver.v1.WebProfilingService.SubmitInteractionWindow
     */
    submitInteractionWindow: {
      name: "SubmitInteractionWindow",
      I: SubmitInteractionWindowRequest,
      O: SubmitInteractionWindowResponse,
      kind: MethodKind.Unary
    }
  }
};
var TraceService = {
  typeName: "aiserver.v1.TraceService",
  methods: {
    /**
     * @generated from rpc aiserver.v1.TraceService.SubmitSpans
     */
    submitSpans: {
      name: "SubmitSpans",
      I: SubmitSpansRequest,
      O: SubmitSpansResponse,
      kind: MethodKind.Unary
    }
  }
};
var ToolCallEventService = {
  typeName: "aiserver.v1.ToolCallEventService",
  methods: {
    /**
     * Submit tool call events
     *
     * @generated from rpc aiserver.v1.ToolCallEventService.SubmitToolCallEvents
     */
    submitToolCallEvents: {
      name: "SubmitToolCallEvents",
      I: SubmitToolCallEventsRequest,
      O: SubmitToolCallEventsResponse,
      kind: MethodKind.Unary
    }
  }
};
var ChatRequestEventService = {
  typeName: "aiserver.v1.ChatRequestEventService",
  methods: {
    /**
     * Submit chat request events
     *
     * @generated from rpc aiserver.v1.ChatRequestEventService.SubmitChatRequestEvents
     */
    submitChatRequestEvents: {
      name: "SubmitChatRequestEvents",
      I: SubmitChatRequestEventsRequest,
      O: SubmitChatRequestEventsResponse,
      kind: MethodKind.Unary
    }
  }
};


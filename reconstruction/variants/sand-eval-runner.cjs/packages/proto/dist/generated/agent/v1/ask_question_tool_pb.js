/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/proto/dist/generated/agent/v1/ask_question_tool_pb.js
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_esm13();
init_compact();
var __protoPackage33 = "agent.v1.";
var __protoMessage333 = class extends CompactMessage {
  static get runtime() {
    return defineOwn(this, "runtime", proto3);
  }
  static $p() {
    return __protoPackage33;
  }
};
var AskQuestionToolCall = class _AskQuestionToolCall extends __protoMessage333 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _AskQuestionToolCall().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _AskQuestionToolCall().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _AskQuestionToolCall().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_AskQuestionToolCall, a, b2);
  }
  static $() {
    return ["AskQuestionToolCall|1 args #0|2 result #1", AskQuestionArgs, AskQuestionResult];
  }
};
var AskQuestionArgs = class _AskQuestionArgs extends __protoMessage333 {
  constructor(data) {
    super();
    this.title = "";
    this.questions = [];
    this.runAsync = false;
    this.asyncOriginalToolCallId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _AskQuestionArgs().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _AskQuestionArgs().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _AskQuestionArgs().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_AskQuestionArgs, a, b2);
  }
  static $() {
    return ["AskQuestionArgs|1 title 9|2 questions #0*|5 run_async 8|6 async_original_tool_call_id 9", AskQuestionArgs_Question];
  }
};
var AskQuestionArgs_Question = class _AskQuestionArgs_Question extends __protoMessage333 {
  constructor(data) {
    super();
    this.id = "";
    this.prompt = "";
    this.options = [];
    this.allowMultiple = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _AskQuestionArgs_Question().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _AskQuestionArgs_Question().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _AskQuestionArgs_Question().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_AskQuestionArgs_Question, a, b2);
  }
  static $() {
    return ["AskQuestionArgs.Question|1 id 9|2 prompt 9|3 options #0*|4 allow_multiple 8", AskQuestionArgs_Option];
  }
};
var AskQuestionArgs_Option = class _AskQuestionArgs_Option extends __protoMessage333 {
  constructor(data) {
    super();
    this.id = "";
    this.label = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _AskQuestionArgs_Option().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _AskQuestionArgs_Option().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _AskQuestionArgs_Option().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_AskQuestionArgs_Option, a, b2);
  }
  static $() {
    return ["AskQuestionArgs.Option|1 id 9|2 label 9"];
  }
};
var AskQuestionAsync = class _AskQuestionAsync extends __protoMessage333 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _AskQuestionAsync().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _AskQuestionAsync().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _AskQuestionAsync().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_AskQuestionAsync, a, b2);
  }
  static $() {
    return ["AskQuestionAsync"];
  }
};
var AskQuestionResult = class _AskQuestionResult extends __protoMessage333 {
  constructor(data) {
    super();
    this.result = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _AskQuestionResult().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _AskQuestionResult().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _AskQuestionResult().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_AskQuestionResult, a, b2);
  }
  static $() {
    return ["AskQuestionResult|1 success #0 result|2 error #1 result|3 rejected #2 result|4 async #3 result", AskQuestionSuccess, AskQuestionError, AskQuestionRejected, AskQuestionAsync];
  }
};
var AskQuestionSuccess = class _AskQuestionSuccess extends __protoMessage333 {
  constructor(data) {
    super();
    this.answers = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _AskQuestionSuccess().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _AskQuestionSuccess().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _AskQuestionSuccess().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_AskQuestionSuccess, a, b2);
  }
  static $() {
    return ["AskQuestionSuccess|1 answers #0*", AskQuestionSuccess_Answer];
  }
};
var AskQuestionSuccess_Answer = class _AskQuestionSuccess_Answer extends __protoMessage333 {
  constructor(data) {
    super();
    this.questionId = "";
    this.selectedOptionIds = [];
    this.freeformText = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _AskQuestionSuccess_Answer().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _AskQuestionSuccess_Answer().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _AskQuestionSuccess_Answer().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_AskQuestionSuccess_Answer, a, b2);
  }
  static $() {
    return ["AskQuestionSuccess.Answer|1 question_id 9|2 selected_option_ids 9*|3 freeform_text 9"];
  }
};
var AskQuestionError = class _AskQuestionError extends __protoMessage333 {
  constructor(data) {
    super();
    this.errorMessage = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _AskQuestionError().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _AskQuestionError().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _AskQuestionError().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_AskQuestionError, a, b2);
  }
  static $() {
    return ["AskQuestionError|1 error_message 9"];
  }
};
var AskQuestionRejected = class _AskQuestionRejected extends __protoMessage333 {
  constructor(data) {
    super();
    this.reason = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _AskQuestionRejected().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _AskQuestionRejected().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _AskQuestionRejected().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_AskQuestionRejected, a, b2);
  }
  static $() {
    return ["AskQuestionRejected|1 reason 9"];
  }
};


var __protoPackage126, __protoMessage3120, LintDiscriminator, LintGenerator, LintDiscriminatorResult, AiLintBug, LogprobsLintPayload, AiLintRule;
var init_lint_pb = __esm({
  "../packages/proto/dist/generated/aiserver/v1/lint_pb.js"() {
    "use strict";
    init_esm();
    init_utils_pb();
    init_compact();
    __protoPackage126 = "aiserver.v1.";
    __protoMessage3120 = class extends CompactMessage {
      static get runtime() {
        return defineOwn(this, "runtime", proto3);
      }
      static $p() {
        return __protoPackage126;
      }
    };
    LintDiscriminator = /* @__PURE__ */ enumType(proto3, __protoPackage126, "LintDiscriminator", [[0, "UNSPECIFIED"], [1, "SPECIFIC_RULES"], [2, "COMPILE_ERRORS"], [3, "CHANGE_BEHAVIOR"], [5, "RELEVANCE"], [6, "USER_AWARENESS"], [7, "CORRECTNESS"], [8, "CHUNKING"], [9, "TYPO"], [10, "CONFIDENCE"], [11, "DISMISSED_BUGS"]], 1);
    LintGenerator = /* @__PURE__ */ enumType(proto3, __protoPackage126, "LintGenerator", [[0, "UNSPECIFIED"], [1, "NAIVE"], [2, "COMMENT_PIPELINE"], [3, "SIMPLE_BUG"], [4, "SIMPLE_LINT_RULES"]], 1);
    LintDiscriminatorResult = class _LintDiscriminatorResult extends __protoMessage3120 {
      constructor(data) {
        super();
        this.discriminator = LintDiscriminator.UNSPECIFIED;
        this.allow = false;
        this.reasoning = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _LintDiscriminatorResult().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _LintDiscriminatorResult().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _LintDiscriminatorResult().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_LintDiscriminatorResult, a, b2);
      }
      static $() {
        return ["LintDiscriminatorResult|1 discriminator #0|2 allow 8|3 reasoning 9", LintDiscriminator];
      }
    };
    AiLintBug = class _AiLintBug extends __protoMessage3120 {
      constructor(data) {
        super();
        this.relativeWorkspacePath = "";
        this.uuid = "";
        this.message = "";
        this.replaceText = "";
        this.replaceInitialText = "";
        this.reevaluateInitialText = "";
        this.generator = LintGenerator.UNSPECIFIED;
        this.discriminatorResults = [];
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _AiLintBug().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _AiLintBug().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _AiLintBug().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_AiLintBug, a, b2);
      }
      static $() {
        return ["AiLintBug|1 relative_workspace_path 9|8 uuid 9|2 message 9|3 replace_range #0|4 replace_text 9|5 replace_initial_text 9|6 reevaluate_range #0|7 reevaluate_initial_text 9|9 generator #1|10 discriminator_results #2*|11 logprobs_payload #3", SimpleRange, LintGenerator, LintDiscriminatorResult, LogprobsLintPayload];
      }
    };
    LogprobsLintPayload = class _LogprobsLintPayload extends __protoMessage3120 {
      constructor(data) {
        super();
        this.chunk = "";
        this.problematicLine = "";
        this.startCol = 0;
        this.endCol = 0;
        this.mostLikelyReplace = "";
        this.lineChunkIndexZeroBased = 0;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _LogprobsLintPayload().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _LogprobsLintPayload().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _LogprobsLintPayload().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_LogprobsLintPayload, a, b2);
      }
      static $() {
        return ["LogprobsLintPayload|1 chunk 9|2 problematic_line 9|3 start_col 5|4 end_col 5|5 most_likely_replace 9|6 line_chunk_index_zero_based 5"];
      }
    };
    AiLintRule = class _AiLintRule extends __protoMessage3120 {
      constructor(data) {
        super();
        this.text = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _AiLintRule().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _AiLintRule().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _AiLintRule().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_AiLintRule, a, b2);
      }
      static $() {
        return ["AiLintRule|1 text 9"];
      }
    };
  }
});

var __protoPackage12, __protoMessage38, ApiKeyCredentials, AzureCredentials, BedrockCredentials, RequestedModel, RequestedModel_ModelParameterValue;
var init_requested_model_pb = __esm({
  "../packages/proto/dist/generated/agent/v1/requested_model_pb.js"() {
    "use strict";
    init_esm();
    init_compact();
    __protoPackage12 = "agent.v1.";
    __protoMessage38 = class extends CompactMessage {
      static get runtime() {
        return defineOwn(this, "runtime", proto3);
      }
      static $p() {
        return __protoPackage12;
      }
    };
    ApiKeyCredentials = class _ApiKeyCredentials extends __protoMessage38 {
      constructor(data) {
        super();
        this.apiKey = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ApiKeyCredentials().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ApiKeyCredentials().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ApiKeyCredentials().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ApiKeyCredentials, a, b2);
      }
      static $() {
        return ["ApiKeyCredentials|1 api_key 9|2 base_url 9?"];
      }
    };
    AzureCredentials = class _AzureCredentials extends __protoMessage38 {
      constructor(data) {
        super();
        this.apiKey = "";
        this.baseUrl = "";
        this.deployment = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _AzureCredentials().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _AzureCredentials().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _AzureCredentials().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_AzureCredentials, a, b2);
      }
      static $() {
        return ["AzureCredentials|1 api_key 9|2 base_url 9|3 deployment 9"];
      }
    };
    BedrockCredentials = class _BedrockCredentials extends __protoMessage38 {
      constructor(data) {
        super();
        this.accessKey = "";
        this.secretKey = "";
        this.region = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _BedrockCredentials().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _BedrockCredentials().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _BedrockCredentials().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_BedrockCredentials, a, b2);
      }
      static $() {
        return ["BedrockCredentials|1 access_key 9|2 secret_key 9|3 region 9|4 session_token 9?"];
      }
    };
    RequestedModel = class _RequestedModel extends __protoMessage38 {
      constructor(data) {
        super();
        this.modelId = "";
        this.maxMode = false;
        this.parameters = [];
        this.credentials = { case: void 0 };
        this.builtInModel = false;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _RequestedModel().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _RequestedModel().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _RequestedModel().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_RequestedModel, a, b2);
      }
      static $() {
        return ["RequestedModel|1 model_id 9|2 max_mode 8|3 parameters #0*|4 api_key_credentials #1 credentials|5 azure_credentials #2 credentials|6 bedrock_credentials #3 credentials|7 built_in_model 8", RequestedModel_ModelParameterValue, ApiKeyCredentials, AzureCredentials, BedrockCredentials];
      }
    };
    RequestedModel_ModelParameterValue = class _RequestedModel_ModelParameterValue extends __protoMessage38 {
      constructor(data) {
        super();
        this.id = "";
        this.value = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _RequestedModel_ModelParameterValue().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _RequestedModel_ModelParameterValue().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _RequestedModel_ModelParameterValue().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_RequestedModel_ModelParameterValue, a, b2);
      }
      static $() {
        return ["RequestedModel.ModelParameterValue|1 id 9|2 value 9"];
      }
    };
  }
});

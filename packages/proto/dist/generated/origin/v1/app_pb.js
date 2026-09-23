init_esm();
init_compact();
var __protoPackage178 = "origin.v1.";
var __protoMessage3169 = class extends CompactMessage {
  static get runtime() {
    return defineOwn(this, "runtime", proto3);
  }
  static $p() {
    return __protoPackage178;
  }
};
var RepoSelectionMode = /* @__PURE__ */ enumType(proto3, __protoPackage178, "RepoSelectionMode", [[0, "UNSPECIFIED"], [1, "ALL"], [2, "SELECTED"]], 1);
var AppInstallRequestOutcome = /* @__PURE__ */ enumType(proto3, __protoPackage178, "AppInstallRequestOutcome", [[0, "UNSPECIFIED"], [1, "CREATED"], [2, "ALREADY_PENDING"], [3, "DENIED_COOLDOWN"], [4, "ALREADY_INSTALLED"]], 1);
var App = class _App extends __protoMessage3169 {
  constructor(data) {
    super();
    this.id = "";
    this.displayName = "";
    this.webhookUrl = "";
    this.isPublic = false;
    this.namespaceSlug = "";
    this.events = [];
    this.createdAt = "";
    this.updatedAt = "";
    this.installationRedirectUris = [];
    this.iconUrl = "";
    this.description = "";
    this.websiteUrl = "";
    this.defaultScopes = [];
    this.webhookDisabledAt = "";
    this.webhookDeliveryState = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _App().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _App().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _App().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_App, a, b2);
  }
  static $() {
    return ["App|1 id 9|3 display_name 9|4 webhook_url 9|6 is_public 8|7 namespace_slug 9|8 events 9*|10 created_at 9|11 updated_at 9|12 installation_redirect_uris 9*|13 icon_url 9|14 description 9|15 website_url 9|16 default_scopes 9*|17 created_by #0|18 updated_by #0|19 webhook_disabled_at 9|20 webhook_delivery_state 9|21 marketplace_listing #1", ActorWithDisplay, AppMarketplaceListing];
  }
};
var AppStats = class _AppStats extends __protoMessage3169 {
  constructor(data) {
    super();
    this.installationCount = 0;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _AppStats().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _AppStats().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _AppStats().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_AppStats, a, b2);
  }
  static $() {
    return ["AppStats|1 installation_count 13"];
  }
};
var AppSigningKey = class _AppSigningKey extends __protoMessage3169 {
  constructor(data) {
    super();
    this.kid = "";
    this.createdAt = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _AppSigningKey().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _AppSigningKey().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _AppSigningKey().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_AppSigningKey, a, b2);
  }
  static $() {
    return ["AppSigningKey|1 kid 9|2 created_at 9"];
  }
};
var CreateAppRequest = class _CreateAppRequest extends __protoMessage3169 {
  constructor(data) {
    super();
    this.displayName = "";
    this.webhookUrl = "";
    this.namespaceSlug = "";
    this.publicKey = "";
    this.events = [];
    this.installationRedirectUris = [];
    this.description = "";
    this.websiteUrl = "";
    this.defaultScopes = [];
    this.workloadIdentityPolicies = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _CreateAppRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _CreateAppRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _CreateAppRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_CreateAppRequest, a, b2);
  }
  static $() {
    return ["CreateAppRequest|2 display_name 9|3 webhook_url 9|6 namespace_slug 9|7 public_key 9|8 events 9*|10 installation_redirect_uris 9*|11 description 9|12 website_url 9|13 default_scopes 9*|14 workload_identity_policies #0*", AppWorkloadIdentityPolicy];
  }
};
var CreateAppResponse = class _CreateAppResponse extends __protoMessage3169 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _CreateAppResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _CreateAppResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _CreateAppResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_CreateAppResponse, a, b2);
  }
  static $() {
    return ["CreateAppResponse|1 app #0", App];
  }
};
var GetAppRequest = class _GetAppRequest extends __protoMessage3169 {
  constructor(data) {
    super();
    this.id = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetAppRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetAppRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetAppRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetAppRequest, a, b2);
  }
  static $() {
    return ["GetAppRequest|1 id 9"];
  }
};
var GetAppResponse = class _GetAppResponse extends __protoMessage3169 {
  constructor(data) {
    super();
    this.signingKeys = [];
    this.workloadIdentityPolicies = [];
    this.workloadIdentityEnabled = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetAppResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetAppResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetAppResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetAppResponse, a, b2);
  }
  static $() {
    return ["GetAppResponse|1 app #0|2 stats #1|3 signing_keys #2*|4 workload_identity_policies #3*|5 workload_identity_enabled 8", App, AppStats, AppSigningKey, AppWorkloadIdentityPolicy];
  }
};
var AddAppSigningKeyRequest = class _AddAppSigningKeyRequest extends __protoMessage3169 {
  constructor(data) {
    super();
    this.appId = "";
    this.publicKey = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _AddAppSigningKeyRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _AddAppSigningKeyRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _AddAppSigningKeyRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_AddAppSigningKeyRequest, a, b2);
  }
  static $() {
    return ["AddAppSigningKeyRequest|1 app_id 9|2 public_key 9"];
  }
};
var AddAppSigningKeyResponse = class _AddAppSigningKeyResponse extends __protoMessage3169 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _AddAppSigningKeyResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _AddAppSigningKeyResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _AddAppSigningKeyResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_AddAppSigningKeyResponse, a, b2);
  }
  static $() {
    return ["AddAppSigningKeyResponse|1 key #0", AppSigningKey];
  }
};
var RevokeAppSigningKeyRequest = class _RevokeAppSigningKeyRequest extends __protoMessage3169 {
  constructor(data) {
    super();
    this.appId = "";
    this.kid = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _RevokeAppSigningKeyRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _RevokeAppSigningKeyRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _RevokeAppSigningKeyRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_RevokeAppSigningKeyRequest, a, b2);
  }
  static $() {
    return ["RevokeAppSigningKeyRequest|1 app_id 9|2 kid 9"];
  }
};
var RevokeAppSigningKeyResponse = class _RevokeAppSigningKeyResponse extends __protoMessage3169 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _RevokeAppSigningKeyResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _RevokeAppSigningKeyResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _RevokeAppSigningKeyResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_RevokeAppSigningKeyResponse, a, b2);
  }
  static $() {
    return ["RevokeAppSigningKeyResponse"];
  }
};
var ListNamespaceAppsRequest = class _ListNamespaceAppsRequest extends __protoMessage3169 {
  constructor(data) {
    super();
    this.namespaceSlug = "";
    this.pageSize = 0;
    this.pageToken = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ListNamespaceAppsRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ListNamespaceAppsRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ListNamespaceAppsRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ListNamespaceAppsRequest, a, b2);
  }
  static $() {
    return ["ListNamespaceAppsRequest|1 namespace_slug 9|2 page_size 13|3 page_token 9"];
  }
};
var ListNamespaceAppsResponse = class _ListNamespaceAppsResponse extends __protoMessage3169 {
  constructor(data) {
    super();
    this.nextPageToken = "";
    this.appMetadata = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ListNamespaceAppsResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ListNamespaceAppsResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ListNamespaceAppsResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ListNamespaceAppsResponse, a, b2);
  }
  static $() {
    return ["ListNamespaceAppsResponse|2 next_page_token 9|3 app_metadata #0*", AppDisplayMetadata];
  }
};
var AppMarketplaceListing = class _AppMarketplaceListing extends __protoMessage3169 {
  constructor(data) {
    super();
    this.slug = "";
    this.listedAt = "";
    this.tags = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _AppMarketplaceListing().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _AppMarketplaceListing().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _AppMarketplaceListing().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_AppMarketplaceListing, a, b2);
  }
  static $() {
    return ["AppMarketplaceListing|1 slug 9|2 listed_at 9|3 tags 9*|4 publisher_id 3?"];
  }
};
var AppDisplayMetadata = class _AppDisplayMetadata extends __protoMessage3169 {
  constructor(data) {
    super();
    this.id = "";
    this.displayName = "";
    this.ownerNamespace = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _AppDisplayMetadata().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _AppDisplayMetadata().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _AppDisplayMetadata().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_AppDisplayMetadata, a, b2);
  }
  static $() {
    return ["AppDisplayMetadata|1 id 9|3 display_name 9|4 icon_url 9?|5 description 9?|7 marketplace_listing #0|8 owner_namespace 9", AppMarketplaceListing];
  }
};
var ListPublicAppsRequest = class _ListPublicAppsRequest extends __protoMessage3169 {
  constructor(data) {
    super();
    this.pageSize = 0;
    this.pageToken = "";
    this.tag = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ListPublicAppsRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ListPublicAppsRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ListPublicAppsRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ListPublicAppsRequest, a, b2);
  }
  static $() {
    return ["ListPublicAppsRequest|1 page_size 13|2 page_token 9|3 tag 9"];
  }
};
var ListPublicAppsResponse = class _ListPublicAppsResponse extends __protoMessage3169 {
  constructor(data) {
    super();
    this.apps = [];
    this.nextPageToken = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ListPublicAppsResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ListPublicAppsResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ListPublicAppsResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ListPublicAppsResponse, a, b2);
  }
  static $() {
    return ["ListPublicAppsResponse|1 apps #0*|2 next_page_token 9", AppDisplayMetadata];
  }
};
var Installation = class _Installation extends __protoMessage3169 {
  constructor(data) {
    super();
    this.id = "";
    this.appId = "";
    this.namespaceSlug = "";
    this.createdAt = "";
    this.updatedAt = "";
    this.repoSelectionMode = RepoSelectionMode.UNSPECIFIED;
    this.repoIds = [];
    this.acceptedScopes = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _Installation().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _Installation().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _Installation().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_Installation, a, b2);
  }
  static $() {
    return ["Installation|1 id 9|2 app_id 9|3 namespace_slug 9|4 created_at 9|5 updated_at 9|6 repo_selection_mode #0|7 repo_ids 9*|8 accepted_scopes 9*|9 suspended_at 9?|11 installed_by #1|12 updated_by #1?|13 suspended_by #1?", RepoSelectionMode, ActorWithDisplay];
  }
};
var InstallationReference = class _InstallationReference extends __protoMessage3169 {
  constructor(data) {
    super();
    this.id = "";
    this.appId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _InstallationReference().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _InstallationReference().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _InstallationReference().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_InstallationReference, a, b2);
  }
  static $() {
    return ["InstallationReference|1 id 9|2 app_id 9|3 app_metadata #0", AppDisplayMetadata];
  }
};
var CreateInstallationRequest = class _CreateInstallationRequest extends __protoMessage3169 {
  constructor(data) {
    super();
    this.appId = "";
    this.namespaceSlug = "";
    this.repoIds = [];
    this.requestedScopes = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _CreateInstallationRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _CreateInstallationRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _CreateInstallationRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_CreateInstallationRequest, a, b2);
  }
  static $() {
    return ["CreateInstallationRequest|1 app_id 9|2 namespace_slug 9|3 repo_ids 9*|4 requested_scopes 9*|5 state 9?"];
  }
};
var CreateInstallationResponse = class _CreateInstallationResponse extends __protoMessage3169 {
  constructor(data) {
    super();
    this.installationReceipt = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _CreateInstallationResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _CreateInstallationResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _CreateInstallationResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_CreateInstallationResponse, a, b2);
  }
  static $() {
    return ["CreateInstallationResponse|1 installation #0|2 installation_receipt 9", Installation];
  }
};
var GetInstallationRequest = class _GetInstallationRequest extends __protoMessage3169 {
  constructor(data) {
    super();
    this.id = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetInstallationRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetInstallationRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetInstallationRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetInstallationRequest, a, b2);
  }
  static $() {
    return ["GetInstallationRequest|1 id 9"];
  }
};
var GetInstallationResponse = class _GetInstallationResponse extends __protoMessage3169 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetInstallationResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetInstallationResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetInstallationResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetInstallationResponse, a, b2);
  }
  static $() {
    return ["GetInstallationResponse|1 installation #0", Installation];
  }
};
var ListNamespaceInstallationsRequest = class _ListNamespaceInstallationsRequest extends __protoMessage3169 {
  constructor(data) {
    super();
    this.namespaceSlug = "";
    this.pageSize = 0;
    this.pageToken = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ListNamespaceInstallationsRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ListNamespaceInstallationsRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ListNamespaceInstallationsRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ListNamespaceInstallationsRequest, a, b2);
  }
  static $() {
    return ["ListNamespaceInstallationsRequest|1 namespace_slug 9|2 page_size 13|3 page_token 9"];
  }
};
var ListNamespaceInstallationsResponse = class _ListNamespaceInstallationsResponse extends __protoMessage3169 {
  constructor(data) {
    super();
    this.installations = [];
    this.nextPageToken = "";
    this.installationReferences = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ListNamespaceInstallationsResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ListNamespaceInstallationsResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ListNamespaceInstallationsResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ListNamespaceInstallationsResponse, a, b2);
  }
  static $() {
    return ["ListNamespaceInstallationsResponse|1 installations #0*|2 next_page_token 9|3 installation_references #1*", Installation, InstallationReference];
  }
};
var UpdateAppRequest = class _UpdateAppRequest extends __protoMessage3169 {
  constructor(data) {
    super();
    this.id = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _UpdateAppRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _UpdateAppRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _UpdateAppRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_UpdateAppRequest, a, b2);
  }
  static $() {
    return ["UpdateAppRequest|1 id 9|2 display_name 9?|3 webhook_url 9?|5 events #0?|6 is_public 8?|8 installation_redirect_uris #1?|9 description 9?|10 website_url 9?|11 default_scopes #2?|12 workload_identity_policies #3?", AppEventsReplace, AppInstallationRedirectUrisReplace, AppDefaultScopesReplace, AppWorkloadIdentityPoliciesReplace];
  }
};
var AppEventsReplace = class _AppEventsReplace extends __protoMessage3169 {
  constructor(data) {
    super();
    this.events = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _AppEventsReplace().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _AppEventsReplace().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _AppEventsReplace().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_AppEventsReplace, a, b2);
  }
  static $() {
    return ["AppEventsReplace|1 events 9*"];
  }
};
var AppInstallationRedirectUrisReplace = class _AppInstallationRedirectUrisReplace extends __protoMessage3169 {
  constructor(data) {
    super();
    this.installationRedirectUris = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _AppInstallationRedirectUrisReplace().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _AppInstallationRedirectUrisReplace().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _AppInstallationRedirectUrisReplace().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_AppInstallationRedirectUrisReplace, a, b2);
  }
  static $() {
    return ["AppInstallationRedirectUrisReplace|1 installation_redirect_uris 9*"];
  }
};
var AppDefaultScopesReplace = class _AppDefaultScopesReplace extends __protoMessage3169 {
  constructor(data) {
    super();
    this.scopes = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _AppDefaultScopesReplace().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _AppDefaultScopesReplace().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _AppDefaultScopesReplace().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_AppDefaultScopesReplace, a, b2);
  }
  static $() {
    return ["AppDefaultScopesReplace|1 scopes 9*"];
  }
};
var AppWorkloadIdentityClaimMatcher = class _AppWorkloadIdentityClaimMatcher extends __protoMessage3169 {
  constructor(data) {
    super();
    this.path = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _AppWorkloadIdentityClaimMatcher().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _AppWorkloadIdentityClaimMatcher().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _AppWorkloadIdentityClaimMatcher().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_AppWorkloadIdentityClaimMatcher, a, b2);
  }
  static $() {
    return ["AppWorkloadIdentityClaimMatcher|1 path 9|2 exact 9?|3 regex 9?"];
  }
};
var AppWorkloadIdentityPolicy = class _AppWorkloadIdentityPolicy extends __protoMessage3169 {
  constructor(data) {
    super();
    this.issuerFamily = "";
    this.issuer = "";
    this.claims = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _AppWorkloadIdentityPolicy().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _AppWorkloadIdentityPolicy().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _AppWorkloadIdentityPolicy().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_AppWorkloadIdentityPolicy, a, b2);
  }
  static $() {
    return ["AppWorkloadIdentityPolicy|1 issuer_family 9|2 issuer 9|3 subject_exact 9?|4 subject_regex 9?|5 claims #0*|6 enabled 8?", AppWorkloadIdentityClaimMatcher];
  }
};
var AppWorkloadIdentityPoliciesReplace = class _AppWorkloadIdentityPoliciesReplace extends __protoMessage3169 {
  constructor(data) {
    super();
    this.policies = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _AppWorkloadIdentityPoliciesReplace().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _AppWorkloadIdentityPoliciesReplace().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _AppWorkloadIdentityPoliciesReplace().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_AppWorkloadIdentityPoliciesReplace, a, b2);
  }
  static $() {
    return ["AppWorkloadIdentityPoliciesReplace|1 policies #0*", AppWorkloadIdentityPolicy];
  }
};
var SetAppWebhookDeliveryEnabledRequest = class _SetAppWebhookDeliveryEnabledRequest extends __protoMessage3169 {
  constructor(data) {
    super();
    this.appId = "";
    this.enabled = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _SetAppWebhookDeliveryEnabledRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _SetAppWebhookDeliveryEnabledRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _SetAppWebhookDeliveryEnabledRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_SetAppWebhookDeliveryEnabledRequest, a, b2);
  }
  static $() {
    return ["SetAppWebhookDeliveryEnabledRequest|1 app_id 9|2 enabled 8"];
  }
};
var SetAppWebhookDeliveryEnabledResponse = class _SetAppWebhookDeliveryEnabledResponse extends __protoMessage3169 {
  constructor(data) {
    super();
    this.transitioned = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _SetAppWebhookDeliveryEnabledResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _SetAppWebhookDeliveryEnabledResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _SetAppWebhookDeliveryEnabledResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_SetAppWebhookDeliveryEnabledResponse, a, b2);
  }
  static $() {
    return ["SetAppWebhookDeliveryEnabledResponse|1 app #0|2 transitioned 8", App];
  }
};
var SendAppWebhookTestDeliveryRequest = class _SendAppWebhookTestDeliveryRequest extends __protoMessage3169 {
  constructor(data) {
    super();
    this.appId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _SendAppWebhookTestDeliveryRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _SendAppWebhookTestDeliveryRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _SendAppWebhookTestDeliveryRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_SendAppWebhookTestDeliveryRequest, a, b2);
  }
  static $() {
    return ["SendAppWebhookTestDeliveryRequest|1 app_id 9"];
  }
};
var SendAppWebhookTestDeliveryResponse = class _SendAppWebhookTestDeliveryResponse extends __protoMessage3169 {
  constructor(data) {
    super();
    this.delivered = false;
    this.responseStatusCode = 0;
    this.deliveryId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _SendAppWebhookTestDeliveryResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _SendAppWebhookTestDeliveryResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _SendAppWebhookTestDeliveryResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_SendAppWebhookTestDeliveryResponse, a, b2);
  }
  static $() {
    return ["SendAppWebhookTestDeliveryResponse|1 delivered 8|2 response_status_code 5|3 delivery_id 9"];
  }
};
var UpdateAppResponse = class _UpdateAppResponse extends __protoMessage3169 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _UpdateAppResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _UpdateAppResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _UpdateAppResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_UpdateAppResponse, a, b2);
  }
  static $() {
    return ["UpdateAppResponse|1 app #0", App];
  }
};
var SetAppIconRequest = class _SetAppIconRequest extends __protoMessage3169 {
  constructor(data) {
    super();
    this.appId = "";
    this.icon = new Uint8Array(0);
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _SetAppIconRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _SetAppIconRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _SetAppIconRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_SetAppIconRequest, a, b2);
  }
  static $() {
    return ["SetAppIconRequest|1 app_id 9|2 icon 12"];
  }
};
var SetAppIconResponse = class _SetAppIconResponse extends __protoMessage3169 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _SetAppIconResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _SetAppIconResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _SetAppIconResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_SetAppIconResponse, a, b2);
  }
  static $() {
    return ["SetAppIconResponse|1 app #0", App];
  }
};
var DeleteAppRequest = class _DeleteAppRequest extends __protoMessage3169 {
  constructor(data) {
    super();
    this.id = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _DeleteAppRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _DeleteAppRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _DeleteAppRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_DeleteAppRequest, a, b2);
  }
  static $() {
    return ["DeleteAppRequest|1 id 9"];
  }
};
var DeleteAppResponse = class _DeleteAppResponse extends __protoMessage3169 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _DeleteAppResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _DeleteAppResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _DeleteAppResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_DeleteAppResponse, a, b2);
  }
  static $() {
    return ["DeleteAppResponse"];
  }
};
var DeleteInstallationRequest = class _DeleteInstallationRequest extends __protoMessage3169 {
  constructor(data) {
    super();
    this.id = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _DeleteInstallationRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _DeleteInstallationRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _DeleteInstallationRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_DeleteInstallationRequest, a, b2);
  }
  static $() {
    return ["DeleteInstallationRequest|1 id 9"];
  }
};
var DeleteInstallationResponse = class _DeleteInstallationResponse extends __protoMessage3169 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _DeleteInstallationResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _DeleteInstallationResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _DeleteInstallationResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_DeleteInstallationResponse, a, b2);
  }
  static $() {
    return ["DeleteInstallationResponse"];
  }
};
var PreviewAppInstallationOptions = class _PreviewAppInstallationOptions extends __protoMessage3169 {
  constructor(data) {
    super();
    this.includeGrantedScopes = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _PreviewAppInstallationOptions().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _PreviewAppInstallationOptions().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _PreviewAppInstallationOptions().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_PreviewAppInstallationOptions, a, b2);
  }
  static $() {
    return ["PreviewAppInstallationOptions|1 include_granted_scopes 8"];
  }
};
var PreviewAppInstallationRequest = class _PreviewAppInstallationRequest extends __protoMessage3169 {
  constructor(data) {
    super();
    this.namespaceSlug = "";
    this.appId = "";
    this.requestedScopes = [];
    this.summary = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _PreviewAppInstallationRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _PreviewAppInstallationRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _PreviewAppInstallationRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_PreviewAppInstallationRequest, a, b2);
  }
  static $() {
    return ["PreviewAppInstallationRequest|1 namespace_slug 9|2 app_id 9|3 requested_scopes 9*|4 summary 9|5 redirect_uri 9?|6 options #0", PreviewAppInstallationOptions];
  }
};
var PreviewAppInstallationScope = class _PreviewAppInstallationScope extends __protoMessage3169 {
  constructor(data) {
    super();
    this.scope = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _PreviewAppInstallationScope().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _PreviewAppInstallationScope().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _PreviewAppInstallationScope().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_PreviewAppInstallationScope, a, b2);
  }
  static $() {
    return ["PreviewAppInstallationScope|1 scope 9"];
  }
};
var PreviewAppInstallationResponse = class _PreviewAppInstallationResponse extends __protoMessage3169 {
  constructor(data) {
    super();
    this.summary = "";
    this.requestedScopes = [];
    this.grantedScopes = [];
    this.appWebsiteUrl = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _PreviewAppInstallationResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _PreviewAppInstallationResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _PreviewAppInstallationResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_PreviewAppInstallationResponse, a, b2);
  }
  static $() {
    return ["PreviewAppInstallationResponse|12 app #0|5 summary 9|6 requested_scopes #1*|7 granted_scopes #1*|8 existing_installation #2|10 app_website_url 9", AppDisplayMetadata, PreviewAppInstallationScope, ExistingInstallation];
  }
};
var ExistingInstallation = class _ExistingInstallation extends __protoMessage3169 {
  constructor(data) {
    super();
    this.installationId = "";
    this.repoSelectionMode = RepoSelectionMode.UNSPECIFIED;
    this.repoIds = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ExistingInstallation().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ExistingInstallation().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ExistingInstallation().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ExistingInstallation, a, b2);
  }
  static $() {
    return ["ExistingInstallation|1 installation_id 9|2 repo_selection_mode #0|3 repo_ids 9*", RepoSelectionMode];
  }
};
var AppMetadata = class _AppMetadata extends __protoMessage3169 {
  constructor(data) {
    super();
    this.id = "";
    this.displayName = "";
    this.namespaceSlug = "";
    this.iconUrl = "";
    this.description = "";
    this.websiteUrl = "";
    this.defaultScopes = [];
    this.installRedirectUri = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _AppMetadata().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _AppMetadata().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _AppMetadata().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_AppMetadata, a, b2);
  }
  static $() {
    return ["AppMetadata|1 id 9|3 display_name 9|4 namespace_slug 9|5 icon_url 9|6 description 9|7 website_url 9|8 default_scopes 9*|9 install_redirect_uri 9|10 is_public 8?|11 marketplace_listing #0", AppMarketplaceListing];
  }
};
var GetAppMetadataRequest = class _GetAppMetadataRequest extends __protoMessage3169 {
  constructor(data) {
    super();
    this.id = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetAppMetadataRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetAppMetadataRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetAppMetadataRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetAppMetadataRequest, a, b2);
  }
  static $() {
    return ["GetAppMetadataRequest|1 id 9"];
  }
};
var GetAppMetadataResponse = class _GetAppMetadataResponse extends __protoMessage3169 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetAppMetadataResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetAppMetadataResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetAppMetadataResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetAppMetadataResponse, a, b2);
  }
  static $() {
    return ["GetAppMetadataResponse|1 app #0|2 stats #1", AppMetadata, AppStats];
  }
};
var SuspendInstallationRequest = class _SuspendInstallationRequest extends __protoMessage3169 {
  constructor(data) {
    super();
    this.id = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _SuspendInstallationRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _SuspendInstallationRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _SuspendInstallationRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_SuspendInstallationRequest, a, b2);
  }
  static $() {
    return ["SuspendInstallationRequest|1 id 9"];
  }
};
var SuspendInstallationResponse = class _SuspendInstallationResponse extends __protoMessage3169 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _SuspendInstallationResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _SuspendInstallationResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _SuspendInstallationResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_SuspendInstallationResponse, a, b2);
  }
  static $() {
    return ["SuspendInstallationResponse"];
  }
};
var UnsuspendInstallationRequest = class _UnsuspendInstallationRequest extends __protoMessage3169 {
  constructor(data) {
    super();
    this.id = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _UnsuspendInstallationRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _UnsuspendInstallationRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _UnsuspendInstallationRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_UnsuspendInstallationRequest, a, b2);
  }
  static $() {
    return ["UnsuspendInstallationRequest|1 id 9"];
  }
};
var UnsuspendInstallationResponse = class _UnsuspendInstallationResponse extends __protoMessage3169 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _UnsuspendInstallationResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _UnsuspendInstallationResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _UnsuspendInstallationResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_UnsuspendInstallationResponse, a, b2);
  }
  static $() {
    return ["UnsuspendInstallationResponse"];
  }
};
var ListRepoInstallationsRequest = class _ListRepoInstallationsRequest extends __protoMessage3169 {
  constructor(data) {
    super();
    this.repoId = "";
    this.pageSize = 0;
    this.pageToken = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ListRepoInstallationsRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ListRepoInstallationsRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ListRepoInstallationsRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ListRepoInstallationsRequest, a, b2);
  }
  static $() {
    return ["ListRepoInstallationsRequest|1 repo_id 9|2 page_size 13|3 page_token 9"];
  }
};
var ListRepoInstallationsResponse = class _ListRepoInstallationsResponse extends __protoMessage3169 {
  constructor(data) {
    super();
    this.installations = [];
    this.nextPageToken = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ListRepoInstallationsResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ListRepoInstallationsResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ListRepoInstallationsResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ListRepoInstallationsResponse, a, b2);
  }
  static $() {
    return ["ListRepoInstallationsResponse|1 installations #0*|2 next_page_token 9", InstallationReference];
  }
};
var RequestAppInstallRequest = class _RequestAppInstallRequest extends __protoMessage3169 {
  constructor(data) {
    super();
    this.namespaceId = "";
    this.appId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _RequestAppInstallRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _RequestAppInstallRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _RequestAppInstallRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_RequestAppInstallRequest, a, b2);
  }
  static $() {
    return ["RequestAppInstallRequest|1 namespace_id 9|2 app_id 9"];
  }
};
var RequestAppInstallResponse = class _RequestAppInstallResponse extends __protoMessage3169 {
  constructor(data) {
    super();
    this.outcome = AppInstallRequestOutcome.UNSPECIFIED;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _RequestAppInstallResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _RequestAppInstallResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _RequestAppInstallResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_RequestAppInstallResponse, a, b2);
  }
  static $() {
    return ["RequestAppInstallResponse|1 outcome #0|2 cool_down_expires_at 9?", AppInstallRequestOutcome];
  }
};
var GetMyAppInstallRequestRequest = class _GetMyAppInstallRequestRequest extends __protoMessage3169 {
  constructor(data) {
    super();
    this.namespaceId = "";
    this.appId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetMyAppInstallRequestRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetMyAppInstallRequestRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetMyAppInstallRequestRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetMyAppInstallRequestRequest, a, b2);
  }
  static $() {
    return ["GetMyAppInstallRequestRequest|1 namespace_id 9|2 app_id 9"];
  }
};
var GetMyAppInstallRequestResponse = class _GetMyAppInstallRequestResponse extends __protoMessage3169 {
  constructor(data) {
    super();
    this.hasPendingRequest = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetMyAppInstallRequestResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetMyAppInstallRequestResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetMyAppInstallRequestResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetMyAppInstallRequestResponse, a, b2);
  }
  static $() {
    return ["GetMyAppInstallRequestResponse|1 has_pending_request 8"];
  }
};
var CancelMyAppInstallRequestRequest = class _CancelMyAppInstallRequestRequest extends __protoMessage3169 {
  constructor(data) {
    super();
    this.namespaceId = "";
    this.appId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _CancelMyAppInstallRequestRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _CancelMyAppInstallRequestRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _CancelMyAppInstallRequestRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_CancelMyAppInstallRequestRequest, a, b2);
  }
  static $() {
    return ["CancelMyAppInstallRequestRequest|1 namespace_id 9|2 app_id 9"];
  }
};
var CancelMyAppInstallRequestResponse = class _CancelMyAppInstallRequestResponse extends __protoMessage3169 {
  constructor(data) {
    super();
    this.canceled = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _CancelMyAppInstallRequestResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _CancelMyAppInstallRequestResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _CancelMyAppInstallRequestResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_CancelMyAppInstallRequestResponse, a, b2);
  }
  static $() {
    return ["CancelMyAppInstallRequestResponse|1 canceled 8"];
  }
};
var AppInstallRequest = class _AppInstallRequest extends __protoMessage3169 {
  constructor(data) {
    super();
    this.id = "";
    this.createdAt = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _AppInstallRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _AppInstallRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _AppInstallRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_AppInstallRequest, a, b2);
  }
  static $() {
    return ["AppInstallRequest|1 id 9|2 requester #0|4 created_at 9", ActorWithDisplay];
  }
};
var AppInstallRequestGroup = class _AppInstallRequestGroup extends __protoMessage3169 {
  constructor(data) {
    super();
    this.requests = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _AppInstallRequestGroup().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _AppInstallRequestGroup().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _AppInstallRequestGroup().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_AppInstallRequestGroup, a, b2);
  }
  static $() {
    return ["AppInstallRequestGroup|1 app #0|2 requests #1*", AppDisplayMetadata, AppInstallRequest];
  }
};
var ListAppInstallRequestsRequest = class _ListAppInstallRequestsRequest extends __protoMessage3169 {
  constructor(data) {
    super();
    this.namespaceId = "";
    this.pageSize = 0;
    this.pageToken = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ListAppInstallRequestsRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ListAppInstallRequestsRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ListAppInstallRequestsRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ListAppInstallRequestsRequest, a, b2);
  }
  static $() {
    return ["ListAppInstallRequestsRequest|1 namespace_id 9|2 page_size 13|3 page_token 9"];
  }
};
var ListAppInstallRequestsResponse = class _ListAppInstallRequestsResponse extends __protoMessage3169 {
  constructor(data) {
    super();
    this.groups = [];
    this.nextPageToken = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ListAppInstallRequestsResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ListAppInstallRequestsResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ListAppInstallRequestsResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ListAppInstallRequestsResponse, a, b2);
  }
  static $() {
    return ["ListAppInstallRequestsResponse|1 groups #0*|2 next_page_token 9", AppInstallRequestGroup];
  }
};
var DenyAppInstallRequestsRequest = class _DenyAppInstallRequestsRequest extends __protoMessage3169 {
  constructor(data) {
    super();
    this.namespaceId = "";
    this.appId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _DenyAppInstallRequestsRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _DenyAppInstallRequestsRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _DenyAppInstallRequestsRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_DenyAppInstallRequestsRequest, a, b2);
  }
  static $() {
    return ["DenyAppInstallRequestsRequest|1 namespace_id 9|2 app_id 9"];
  }
};
var DenyAppInstallRequestsResponse = class _DenyAppInstallRequestsResponse extends __protoMessage3169 {
  constructor(data) {
    super();
    this.deniedCount = 0;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _DenyAppInstallRequestsResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _DenyAppInstallRequestsResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _DenyAppInstallRequestsResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_DenyAppInstallRequestsResponse, a, b2);
  }
  static $() {
    return ["DenyAppInstallRequestsResponse|1 denied_count 13"];
  }
};
var PreviewAppUserConfirmationRequest = class _PreviewAppUserConfirmationRequest extends __protoMessage3169 {
  constructor(data) {
    super();
    this.installationId = "";
    this.redirectUri = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _PreviewAppUserConfirmationRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _PreviewAppUserConfirmationRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _PreviewAppUserConfirmationRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_PreviewAppUserConfirmationRequest, a, b2);
  }
  static $() {
    return ["PreviewAppUserConfirmationRequest|1 installation_id 9|2 redirect_uri 9|3 state 9?"];
  }
};
var AppUserConfirmationDisclosure = class _AppUserConfirmationDisclosure extends __protoMessage3169 {
  constructor(data) {
    super();
    this.userId = "";
    this.email = "";
    this.namespaceId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _AppUserConfirmationDisclosure().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _AppUserConfirmationDisclosure().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _AppUserConfirmationDisclosure().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_AppUserConfirmationDisclosure, a, b2);
  }
  static $() {
    return ["AppUserConfirmationDisclosure|1 user_id 9|2 email 9|3 namespace_id 9"];
  }
};
var PreviewAppUserConfirmationResponse = class _PreviewAppUserConfirmationResponse extends __protoMessage3169 {
  constructor(data) {
    super();
    this.installationId = "";
    this.namespaceSlug = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _PreviewAppUserConfirmationResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _PreviewAppUserConfirmationResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _PreviewAppUserConfirmationResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_PreviewAppUserConfirmationResponse, a, b2);
  }
  static $() {
    return ["PreviewAppUserConfirmationResponse|1 app #0|2 installation_id 9|3 namespace_slug 9|4 disclosure #1", AppDisplayMetadata, AppUserConfirmationDisclosure];
  }
};
var ConfirmAppUserConfirmationRequest = class _ConfirmAppUserConfirmationRequest extends __protoMessage3169 {
  constructor(data) {
    super();
    this.installationId = "";
    this.redirectUri = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ConfirmAppUserConfirmationRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ConfirmAppUserConfirmationRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ConfirmAppUserConfirmationRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ConfirmAppUserConfirmationRequest, a, b2);
  }
  static $() {
    return ["ConfirmAppUserConfirmationRequest|1 installation_id 9|2 redirect_uri 9|3 state 9?"];
  }
};
var ConfirmAppUserConfirmationResponse = class _ConfirmAppUserConfirmationResponse extends __protoMessage3169 {
  constructor(data) {
    super();
    this.confirmationReceipt = "";
    this.redirectUri = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ConfirmAppUserConfirmationResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ConfirmAppUserConfirmationResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ConfirmAppUserConfirmationResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ConfirmAppUserConfirmationResponse, a, b2);
  }
  static $() {
    return ["ConfirmAppUserConfirmationResponse|1 confirmation_receipt 9|2 redirect_uri 9"];
  }
};

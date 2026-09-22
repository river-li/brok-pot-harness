init_esm();
init_compact();
var __protoPackage159 = "origin.v1.";
var __protoMessage3151 = class extends CompactMessage {
  static get runtime() {
    return defineOwn(this, "runtime", proto3);
  }
  static $p() {
    return __protoPackage159;
  }
};
var AuthPolicyAppliesTo = /* @__PURE__ */ enumType(proto3, __protoPackage159, "AuthPolicyAppliesTo", [[0, "UNSPECIFIED"], [1, "REPOSITORY"], [2, "NAMESPACE"], [4, "APP"]], 1);
var GroupScope = /* @__PURE__ */ enumType(proto3, __protoPackage159, "GroupScope", [[0, "UNSPECIFIED"], [1, "ORG"], [2, "TEAM"]], 1);
var TeamGroupKind = /* @__PURE__ */ enumType(proto3, __protoPackage159, "TeamGroupKind", [[0, "UNSPECIFIED"], [1, "ADMINS"], [2, "MEMBERS"]], 1);
var AuthPolicyStatement = class _AuthPolicyStatement extends __protoMessage3151 {
  constructor(data) {
    super();
    this.resourceKind = "";
    this.action = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _AuthPolicyStatement().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _AuthPolicyStatement().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _AuthPolicyStatement().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_AuthPolicyStatement, a, b2);
  }
  static $() {
    return ["AuthPolicyStatement|1 resource_kind 9|2 action 9"];
  }
};
var HasOriginPermissionRequest = class _HasOriginPermissionRequest extends __protoMessage3151 {
  constructor(data) {
    super();
    this.scope = "";
    this.resource = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _HasOriginPermissionRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _HasOriginPermissionRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _HasOriginPermissionRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_HasOriginPermissionRequest, a, b2);
  }
  static $() {
    return ["HasOriginPermissionRequest|1 scope 9|2 namespace_slug 9 resource|3 repository #0 resource|4 app_id 9 resource", ClientRepoIdentifier];
  }
};
var HasOriginPermissionResponse = class _HasOriginPermissionResponse extends __protoMessage3151 {
  constructor(data) {
    super();
    this.allowed = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _HasOriginPermissionResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _HasOriginPermissionResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _HasOriginPermissionResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_HasOriginPermissionResponse, a, b2);
  }
  static $() {
    return ["HasOriginPermissionResponse|1 allowed 8"];
  }
};
var AuthPolicySummary = class _AuthPolicySummary extends __protoMessage3151 {
  constructor(data) {
    super();
    this.name = "";
    this.displayName = "";
    this.description = "";
    this.appliesTo = AuthPolicyAppliesTo.UNSPECIFIED;
    this.isOriginManaged = false;
    this.isCustom = false;
    this.statements = [];
    this.userFacingScopeCount = 0;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _AuthPolicySummary().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _AuthPolicySummary().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _AuthPolicySummary().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_AuthPolicySummary, a, b2);
  }
  static $() {
    return ["AuthPolicySummary|1 name 9|2 display_name 9|3 description 9|4 applies_to #0|5 is_origin_managed 8|6 is_custom 8|7 statements #1*|8 user_facing_scope_count 5", AuthPolicyAppliesTo, AuthPolicyStatement];
  }
};
var ListRepoAssignablePoliciesRequest = class _ListRepoAssignablePoliciesRequest extends __protoMessage3151 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ListRepoAssignablePoliciesRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ListRepoAssignablePoliciesRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ListRepoAssignablePoliciesRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ListRepoAssignablePoliciesRequest, a, b2);
  }
  static $() {
    return ["ListRepoAssignablePoliciesRequest|1 identifier #0", ClientRepoIdentifier];
  }
};
var ListRepoAssignablePoliciesResponse = class _ListRepoAssignablePoliciesResponse extends __protoMessage3151 {
  constructor(data) {
    super();
    this.policies = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ListRepoAssignablePoliciesResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ListRepoAssignablePoliciesResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ListRepoAssignablePoliciesResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ListRepoAssignablePoliciesResponse, a, b2);
  }
  static $() {
    return ["ListRepoAssignablePoliciesResponse|1 policies #0*", AuthPolicySummary];
  }
};
var GrantPolicyRef = class _GrantPolicyRef extends __protoMessage3151 {
  constructor(data) {
    super();
    this.name = "";
    this.displayName = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GrantPolicyRef().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GrantPolicyRef().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GrantPolicyRef().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GrantPolicyRef, a, b2);
  }
  static $() {
    return ["GrantPolicyRef|1 name 9|2 display_name 9"];
  }
};
var TeamGroupAccess = class _TeamGroupAccess extends __protoMessage3151 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _TeamGroupAccess().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _TeamGroupAccess().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _TeamGroupAccess().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_TeamGroupAccess, a, b2);
  }
  static $() {
    return ["TeamGroupAccess|1 namespace_policy #0|2 repo_policy #0|3 effective_policy #0", GrantPolicyRef];
  }
};
var GetRepoTeamAccessRequest = class _GetRepoTeamAccessRequest extends __protoMessage3151 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetRepoTeamAccessRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetRepoTeamAccessRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetRepoTeamAccessRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetRepoTeamAccessRequest, a, b2);
  }
  static $() {
    return ["GetRepoTeamAccessRequest|1 identifier #0", ClientRepoIdentifier];
  }
};
var GetRepoTeamAccessResponse = class _GetRepoTeamAccessResponse extends __protoMessage3151 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetRepoTeamAccessResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetRepoTeamAccessResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetRepoTeamAccessResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetRepoTeamAccessResponse, a, b2);
  }
  static $() {
    return ["GetRepoTeamAccessResponse|1 namespace #0|2 team_admins #1|3 team_members #1", OriginNamespace, TeamGroupAccess];
  }
};
var GrantPrincipal = class _GrantPrincipal extends __protoMessage3151 {
  constructor(data) {
    super();
    this.kind = "";
    this.externalId = "";
    this.displayName = "";
    this.email = "";
    this.groupAdminCount = 0;
    this.groupMemberCount = 0;
    this.groupScope = GroupScope.UNSPECIFIED;
    this.isIdpSynced = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GrantPrincipal().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GrantPrincipal().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GrantPrincipal().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GrantPrincipal, a, b2);
  }
  static $() {
    return ["GrantPrincipal|1 kind 9|2 external_id 9|3 display_name 9|4 email 9|5 group_admin_count 5|6 group_member_count 5|7 group_scope #0|8 is_idp_synced 8", GroupScope];
  }
};
var RepoGrantRow = class _RepoGrantRow extends __protoMessage3151 {
  constructor(data) {
    super();
    this.isNamespaceOwned = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _RepoGrantRow().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _RepoGrantRow().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _RepoGrantRow().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_RepoGrantRow, a, b2);
  }
  static $() {
    return ["RepoGrantRow|1 principal #0|2 namespace_policy #1|3 repo_policy #1|4 effective_policy #1|5 is_namespace_owned 8", GrantPrincipal, GrantPolicyRef];
  }
};
var ListRepoGrantsRequest = class _ListRepoGrantsRequest extends __protoMessage3151 {
  constructor(data) {
    super();
    this.page = 0;
    this.pageSize = 0;
    this.search = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ListRepoGrantsRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ListRepoGrantsRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ListRepoGrantsRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ListRepoGrantsRequest, a, b2);
  }
  static $() {
    return ["ListRepoGrantsRequest|1 identifier #0|2 page 5|3 page_size 5|4 search 9", ClientRepoIdentifier];
  }
};
var ListRepoGrantsResponse = class _ListRepoGrantsResponse extends __protoMessage3151 {
  constructor(data) {
    super();
    this.rows = [];
    this.totalCount = 0;
    this.listTruncated = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ListRepoGrantsResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ListRepoGrantsResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ListRepoGrantsResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ListRepoGrantsResponse, a, b2);
  }
  static $() {
    return ["ListRepoGrantsResponse|1 rows #0*|2 total_count 5|3 list_truncated 8", RepoGrantRow];
  }
};
var SetRepoTeamAccessRequest = class _SetRepoTeamAccessRequest extends __protoMessage3151 {
  constructor(data) {
    super();
    this.group = TeamGroupKind.UNSPECIFIED;
    this.policyUpdate = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _SetRepoTeamAccessRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _SetRepoTeamAccessRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _SetRepoTeamAccessRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_SetRepoTeamAccessRequest, a, b2);
  }
  static $() {
    return ["SetRepoTeamAccessRequest|1 identifier #0|2 group #1|3 policy_name 9 policy_update|4 clear_override 8 policy_update", ClientRepoIdentifier, TeamGroupKind];
  }
};
var SetRepoTeamAccessResponse = class _SetRepoTeamAccessResponse extends __protoMessage3151 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _SetRepoTeamAccessResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _SetRepoTeamAccessResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _SetRepoTeamAccessResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_SetRepoTeamAccessResponse, a, b2);
  }
  static $() {
    return ["SetRepoTeamAccessResponse|1 namespace #0|2 team_admins #1|3 team_members #1", OriginNamespace, TeamGroupAccess];
  }
};
var SetRepoUserAccessRequest = class _SetRepoUserAccessRequest extends __protoMessage3151 {
  constructor(data) {
    super();
    this.userId = "";
    this.policyUpdate = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _SetRepoUserAccessRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _SetRepoUserAccessRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _SetRepoUserAccessRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_SetRepoUserAccessRequest, a, b2);
  }
  static $() {
    return ["SetRepoUserAccessRequest|1 identifier #0|2 user_id 9|3 policy_name 9 policy_update|4 clear_access 8 policy_update", ClientRepoIdentifier];
  }
};
var SetRepoUserAccessResponse = class _SetRepoUserAccessResponse extends __protoMessage3151 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _SetRepoUserAccessResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _SetRepoUserAccessResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _SetRepoUserAccessResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_SetRepoUserAccessResponse, a, b2);
  }
  static $() {
    return ["SetRepoUserAccessResponse"];
  }
};
var SetRepoGroupAccessRequest = class _SetRepoGroupAccessRequest extends __protoMessage3151 {
  constructor(data) {
    super();
    this.groupId = "";
    this.policyUpdate = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _SetRepoGroupAccessRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _SetRepoGroupAccessRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _SetRepoGroupAccessRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_SetRepoGroupAccessRequest, a, b2);
  }
  static $() {
    return ["SetRepoGroupAccessRequest|1 identifier #0|2 group_id 9|3 policy_name 9 policy_update|4 clear_access 8 policy_update", ClientRepoIdentifier];
  }
};
var SetRepoGroupAccessResponse = class _SetRepoGroupAccessResponse extends __protoMessage3151 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _SetRepoGroupAccessResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _SetRepoGroupAccessResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _SetRepoGroupAccessResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_SetRepoGroupAccessResponse, a, b2);
  }
  static $() {
    return ["SetRepoGroupAccessResponse"];
  }
};
var NamespaceTeamGroupAccess = class _NamespaceTeamGroupAccess extends __protoMessage3151 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _NamespaceTeamGroupAccess().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _NamespaceTeamGroupAccess().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _NamespaceTeamGroupAccess().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_NamespaceTeamGroupAccess, a, b2);
  }
  static $() {
    return ["NamespaceTeamGroupAccess|1 policy #0", GrantPolicyRef];
  }
};
var GetNamespaceTeamAccessRequest = class _GetNamespaceTeamAccessRequest extends __protoMessage3151 {
  constructor(data) {
    super();
    this.namespaceSlug = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetNamespaceTeamAccessRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetNamespaceTeamAccessRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetNamespaceTeamAccessRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetNamespaceTeamAccessRequest, a, b2);
  }
  static $() {
    return ["GetNamespaceTeamAccessRequest|1 namespace_slug 9"];
  }
};
var GetNamespaceTeamAccessResponse = class _GetNamespaceTeamAccessResponse extends __protoMessage3151 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetNamespaceTeamAccessResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetNamespaceTeamAccessResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetNamespaceTeamAccessResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetNamespaceTeamAccessResponse, a, b2);
  }
  static $() {
    return ["GetNamespaceTeamAccessResponse|1 namespace #0|2 team_admins #1|3 team_members #1", OriginNamespace, NamespaceTeamGroupAccess];
  }
};
var SetNamespaceTeamAccessRequest = class _SetNamespaceTeamAccessRequest extends __protoMessage3151 {
  constructor(data) {
    super();
    this.namespaceSlug = "";
    this.group = TeamGroupKind.UNSPECIFIED;
    this.policyUpdate = { case: void 0 };
    this.retainSelfAdmin = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _SetNamespaceTeamAccessRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _SetNamespaceTeamAccessRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _SetNamespaceTeamAccessRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_SetNamespaceTeamAccessRequest, a, b2);
  }
  static $() {
    return ["SetNamespaceTeamAccessRequest|1 namespace_slug 9|2 group #0|3 policy_name 9 policy_update|4 clear_access 8 policy_update|5 retain_self_admin 8", TeamGroupKind];
  }
};
var SetNamespaceTeamAccessResponse = class _SetNamespaceTeamAccessResponse extends __protoMessage3151 {
  constructor(data) {
    super();
    this.selfAdminGranted = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _SetNamespaceTeamAccessResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _SetNamespaceTeamAccessResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _SetNamespaceTeamAccessResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_SetNamespaceTeamAccessResponse, a, b2);
  }
  static $() {
    return ["SetNamespaceTeamAccessResponse|1 namespace #0|2 team_admins #1|3 team_members #1|4 self_admin_granted 8", OriginNamespace, NamespaceTeamGroupAccess];
  }
};
var NamespaceGrantRow = class _NamespaceGrantRow extends __protoMessage3151 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _NamespaceGrantRow().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _NamespaceGrantRow().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _NamespaceGrantRow().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_NamespaceGrantRow, a, b2);
  }
  static $() {
    return ["NamespaceGrantRow|1 principal #0|2 policy #1", GrantPrincipal, GrantPolicyRef];
  }
};
var ListNamespaceGrantsRequest = class _ListNamespaceGrantsRequest extends __protoMessage3151 {
  constructor(data) {
    super();
    this.namespaceSlug = "";
    this.page = 0;
    this.pageSize = 0;
    this.search = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ListNamespaceGrantsRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ListNamespaceGrantsRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ListNamespaceGrantsRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ListNamespaceGrantsRequest, a, b2);
  }
  static $() {
    return ["ListNamespaceGrantsRequest|1 namespace_slug 9|2 page 5|3 page_size 5|4 search 9"];
  }
};
var ListNamespaceGrantsResponse = class _ListNamespaceGrantsResponse extends __protoMessage3151 {
  constructor(data) {
    super();
    this.rows = [];
    this.totalCount = 0;
    this.listTruncated = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ListNamespaceGrantsResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ListNamespaceGrantsResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ListNamespaceGrantsResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ListNamespaceGrantsResponse, a, b2);
  }
  static $() {
    return ["ListNamespaceGrantsResponse|1 rows #0*|2 total_count 5|3 list_truncated 8", NamespaceGrantRow];
  }
};
var SetNamespaceUserAccessRequest = class _SetNamespaceUserAccessRequest extends __protoMessage3151 {
  constructor(data) {
    super();
    this.namespaceSlug = "";
    this.userIds = [];
    this.policyUpdate = { case: void 0 };
    this.retainSelfAdmin = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _SetNamespaceUserAccessRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _SetNamespaceUserAccessRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _SetNamespaceUserAccessRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_SetNamespaceUserAccessRequest, a, b2);
  }
  static $() {
    return ["SetNamespaceUserAccessRequest|1 namespace_slug 9|2 user_ids 9*|3 policy_name 9 policy_update|4 clear_access 8 policy_update|5 retain_self_admin 8"];
  }
};
var SetNamespaceUserAccessResponse = class _SetNamespaceUserAccessResponse extends __protoMessage3151 {
  constructor(data) {
    super();
    this.selfAdminGranted = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _SetNamespaceUserAccessResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _SetNamespaceUserAccessResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _SetNamespaceUserAccessResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_SetNamespaceUserAccessResponse, a, b2);
  }
  static $() {
    return ["SetNamespaceUserAccessResponse|1 namespace #0|2 self_admin_granted 8", OriginNamespace];
  }
};
var SetNamespaceGroupAccessRequest = class _SetNamespaceGroupAccessRequest extends __protoMessage3151 {
  constructor(data) {
    super();
    this.namespaceSlug = "";
    this.groupIds = [];
    this.policyUpdate = { case: void 0 };
    this.retainSelfAdmin = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _SetNamespaceGroupAccessRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _SetNamespaceGroupAccessRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _SetNamespaceGroupAccessRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_SetNamespaceGroupAccessRequest, a, b2);
  }
  static $() {
    return ["SetNamespaceGroupAccessRequest|1 namespace_slug 9|2 group_ids 9*|3 policy_name 9 policy_update|4 clear_access 8 policy_update|5 retain_self_admin 8"];
  }
};
var SetNamespaceGroupAccessResponse = class _SetNamespaceGroupAccessResponse extends __protoMessage3151 {
  constructor(data) {
    super();
    this.selfAdminGranted = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _SetNamespaceGroupAccessResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _SetNamespaceGroupAccessResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _SetNamespaceGroupAccessResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_SetNamespaceGroupAccessResponse, a, b2);
  }
  static $() {
    return ["SetNamespaceGroupAccessResponse|1 namespace #0|2 self_admin_granted 8", OriginNamespace];
  }
};
var ListGroupGrantsInNamespaceRequest = class _ListGroupGrantsInNamespaceRequest extends __protoMessage3151 {
  constructor(data) {
    super();
    this.namespaceSlug = "";
    this.groupId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ListGroupGrantsInNamespaceRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ListGroupGrantsInNamespaceRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ListGroupGrantsInNamespaceRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ListGroupGrantsInNamespaceRequest, a, b2);
  }
  static $() {
    return ["ListGroupGrantsInNamespaceRequest|1 namespace_slug 9|2 group_id 9"];
  }
};
var GroupRepoGrant = class _GroupRepoGrant extends __protoMessage3151 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GroupRepoGrant().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GroupRepoGrant().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GroupRepoGrant().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GroupRepoGrant, a, b2);
  }
  static $() {
    return ["GroupRepoGrant|1 repository #0|2 namespace_policy #1|3 repo_policy #1|4 effective_policy #1", ClientRepoIdentifier, GrantPolicyRef];
  }
};
var ListGroupGrantsInNamespaceResponse = class _ListGroupGrantsInNamespaceResponse extends __protoMessage3151 {
  constructor(data) {
    super();
    this.repoGrants = [];
    this.listTruncated = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ListGroupGrantsInNamespaceResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ListGroupGrantsInNamespaceResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ListGroupGrantsInNamespaceResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ListGroupGrantsInNamespaceResponse, a, b2);
  }
  static $() {
    return ["ListGroupGrantsInNamespaceResponse|1 principal #0|2 namespace_policy #1|3 repo_grants #2*|4 list_truncated 8", GrantPrincipal, GrantPolicyRef, GroupRepoGrant];
  }
};
var ListNamespaceAssignablePoliciesRequest = class _ListNamespaceAssignablePoliciesRequest extends __protoMessage3151 {
  constructor(data) {
    super();
    this.namespaceSlug = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ListNamespaceAssignablePoliciesRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ListNamespaceAssignablePoliciesRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ListNamespaceAssignablePoliciesRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ListNamespaceAssignablePoliciesRequest, a, b2);
  }
  static $() {
    return ["ListNamespaceAssignablePoliciesRequest|1 namespace_slug 9"];
  }
};
var ListNamespaceAssignablePoliciesResponse = class _ListNamespaceAssignablePoliciesResponse extends __protoMessage3151 {
  constructor(data) {
    super();
    this.policies = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ListNamespaceAssignablePoliciesResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ListNamespaceAssignablePoliciesResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ListNamespaceAssignablePoliciesResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ListNamespaceAssignablePoliciesResponse, a, b2);
  }
  static $() {
    return ["ListNamespaceAssignablePoliciesResponse|1 policies #0*", AuthPolicySummary];
  }
};
var RepoShareInvite = class _RepoShareInvite extends __protoMessage3151 {
  constructor(data) {
    super();
    this.id = "";
    this.inviteeEmail = "";
    this.policyName = "";
    this.invitedByPrincipalKind = "";
    this.invitedByPrincipalId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _RepoShareInvite().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _RepoShareInvite().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _RepoShareInvite().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_RepoShareInvite, a, b2);
  }
  static $() {
    return ["RepoShareInvite|1 id 9|2 invitee_email 9|3 policy_name 9|4 expires_at #0|5 accepted_at #0|6 declined_at #0|7 revoked_at #0|8 created_at #0|9 invited_by_principal_kind 9|10 invited_by_principal_id 9", Timestamp];
  }
};
var CreateRepoShareInviteRequest = class _CreateRepoShareInviteRequest extends __protoMessage3151 {
  constructor(data) {
    super();
    this.inviteeEmail = "";
    this.policyName = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _CreateRepoShareInviteRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _CreateRepoShareInviteRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _CreateRepoShareInviteRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_CreateRepoShareInviteRequest, a, b2);
  }
  static $() {
    return ["CreateRepoShareInviteRequest|1 identifier #0|2 invitee_email 9|3 policy_name 9", ClientRepoIdentifier];
  }
};
var CreateRepoShareInviteResponse = class _CreateRepoShareInviteResponse extends __protoMessage3151 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _CreateRepoShareInviteResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _CreateRepoShareInviteResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _CreateRepoShareInviteResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_CreateRepoShareInviteResponse, a, b2);
  }
  static $() {
    return ["CreateRepoShareInviteResponse|1 invite #0", RepoShareInvite];
  }
};
var CreateRepoShareBatchInvitesRequest = class _CreateRepoShareBatchInvitesRequest extends __protoMessage3151 {
  constructor(data) {
    super();
    this.inviteeEmails = [];
    this.policyName = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _CreateRepoShareBatchInvitesRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _CreateRepoShareBatchInvitesRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _CreateRepoShareBatchInvitesRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_CreateRepoShareBatchInvitesRequest, a, b2);
  }
  static $() {
    return ["CreateRepoShareBatchInvitesRequest|1 identifier #0|2 invitee_emails 9*|3 policy_name 9", ClientRepoIdentifier];
  }
};
var RepoShareInviteAttemptError = class _RepoShareInviteAttemptError extends __protoMessage3151 {
  constructor(data) {
    super();
    this.message = "";
    this.code = 0;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _RepoShareInviteAttemptError().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _RepoShareInviteAttemptError().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _RepoShareInviteAttemptError().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_RepoShareInviteAttemptError, a, b2);
  }
  static $() {
    return ["RepoShareInviteAttemptError|1 message 9|2 code 5"];
  }
};
var RepoShareInviteAttempt = class _RepoShareInviteAttempt extends __protoMessage3151 {
  constructor(data) {
    super();
    this.inviteeEmail = "";
    this.outcome = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _RepoShareInviteAttempt().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _RepoShareInviteAttempt().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _RepoShareInviteAttempt().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_RepoShareInviteAttempt, a, b2);
  }
  static $() {
    return ["RepoShareInviteAttempt|1 invitee_email 9|2 invite #0 outcome|3 error #1 outcome", RepoShareInvite, RepoShareInviteAttemptError];
  }
};
var CreateRepoShareBatchInvitesResponse = class _CreateRepoShareBatchInvitesResponse extends __protoMessage3151 {
  constructor(data) {
    super();
    this.attempts = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _CreateRepoShareBatchInvitesResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _CreateRepoShareBatchInvitesResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _CreateRepoShareBatchInvitesResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_CreateRepoShareBatchInvitesResponse, a, b2);
  }
  static $() {
    return ["CreateRepoShareBatchInvitesResponse|1 attempts #0*", RepoShareInviteAttempt];
  }
};
var UpdateRepoShareInviteRequest = class _UpdateRepoShareInviteRequest extends __protoMessage3151 {
  constructor(data) {
    super();
    this.inviteId = "";
    this.rotateToken = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _UpdateRepoShareInviteRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _UpdateRepoShareInviteRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _UpdateRepoShareInviteRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_UpdateRepoShareInviteRequest, a, b2);
  }
  static $() {
    return ["UpdateRepoShareInviteRequest|1 identifier #0|2 invite_id 9|3 policy_name 9?|4 rotate_token 8", ClientRepoIdentifier];
  }
};
var UpdateRepoShareInviteResponse = class _UpdateRepoShareInviteResponse extends __protoMessage3151 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _UpdateRepoShareInviteResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _UpdateRepoShareInviteResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _UpdateRepoShareInviteResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_UpdateRepoShareInviteResponse, a, b2);
  }
  static $() {
    return ["UpdateRepoShareInviteResponse|1 invite #0", RepoShareInvite];
  }
};
var RevokeRepoShareInviteRequest = class _RevokeRepoShareInviteRequest extends __protoMessage3151 {
  constructor(data) {
    super();
    this.inviteId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _RevokeRepoShareInviteRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _RevokeRepoShareInviteRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _RevokeRepoShareInviteRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_RevokeRepoShareInviteRequest, a, b2);
  }
  static $() {
    return ["RevokeRepoShareInviteRequest|1 identifier #0|2 invite_id 9", ClientRepoIdentifier];
  }
};
var RevokeRepoShareInviteResponse = class _RevokeRepoShareInviteResponse extends __protoMessage3151 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _RevokeRepoShareInviteResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _RevokeRepoShareInviteResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _RevokeRepoShareInviteResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_RevokeRepoShareInviteResponse, a, b2);
  }
  static $() {
    return ["RevokeRepoShareInviteResponse|1 invite #0", RepoShareInvite];
  }
};
var ListRepoShareInvitesRequest = class _ListRepoShareInvitesRequest extends __protoMessage3151 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ListRepoShareInvitesRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ListRepoShareInvitesRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ListRepoShareInvitesRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ListRepoShareInvitesRequest, a, b2);
  }
  static $() {
    return ["ListRepoShareInvitesRequest|1 identifier #0", ClientRepoIdentifier];
  }
};
var ListRepoShareInvitesResponse = class _ListRepoShareInvitesResponse extends __protoMessage3151 {
  constructor(data) {
    super();
    this.invites = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ListRepoShareInvitesResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ListRepoShareInvitesResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ListRepoShareInvitesResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ListRepoShareInvitesResponse, a, b2);
  }
  static $() {
    return ["ListRepoShareInvitesResponse|1 invites #0*", RepoShareInvite];
  }
};
var RepoShareInviteDetails = class _RepoShareInviteDetails extends __protoMessage3151 {
  constructor(data) {
    super();
    this.inviteeEmail = "";
    this.inviterDisplayName = "";
    this.policyName = "";
    this.inviteId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _RepoShareInviteDetails().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _RepoShareInviteDetails().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _RepoShareInviteDetails().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_RepoShareInviteDetails, a, b2);
  }
  static $() {
    return ["RepoShareInviteDetails|1 invitee_email 9|2 repository #0|3 inviter_display_name 9|4 policy_name 9|5 expires_at #1|6 invite_id 9", ClientRepoIdentifier, Timestamp];
  }
};
var GetShareInviteByTokenRequest = class _GetShareInviteByTokenRequest extends __protoMessage3151 {
  constructor(data) {
    super();
    this.token = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetShareInviteByTokenRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetShareInviteByTokenRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetShareInviteByTokenRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetShareInviteByTokenRequest, a, b2);
  }
  static $() {
    return ["GetShareInviteByTokenRequest|1 token 9"];
  }
};
var GetShareInviteByTokenResponse = class _GetShareInviteByTokenResponse extends __protoMessage3151 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetShareInviteByTokenResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetShareInviteByTokenResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetShareInviteByTokenResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetShareInviteByTokenResponse, a, b2);
  }
  static $() {
    return ["GetShareInviteByTokenResponse|1 invite #0", RepoShareInviteDetails];
  }
};
var DeclineShareInviteRequest = class _DeclineShareInviteRequest extends __protoMessage3151 {
  constructor(data) {
    super();
    this.locator = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _DeclineShareInviteRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _DeclineShareInviteRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _DeclineShareInviteRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_DeclineShareInviteRequest, a, b2);
  }
  static $() {
    return ["DeclineShareInviteRequest|1 token 9 locator|2 invite_id 9 locator"];
  }
};
var DeclineShareInviteResponse = class _DeclineShareInviteResponse extends __protoMessage3151 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _DeclineShareInviteResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _DeclineShareInviteResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _DeclineShareInviteResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_DeclineShareInviteResponse, a, b2);
  }
  static $() {
    return ["DeclineShareInviteResponse"];
  }
};
var AcceptShareInviteRequest = class _AcceptShareInviteRequest extends __protoMessage3151 {
  constructor(data) {
    super();
    this.locator = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _AcceptShareInviteRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _AcceptShareInviteRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _AcceptShareInviteRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_AcceptShareInviteRequest, a, b2);
  }
  static $() {
    return ["AcceptShareInviteRequest|1 token 9 locator|2 invite_id 9 locator"];
  }
};
var AcceptShareInviteResponse = class _AcceptShareInviteResponse extends __protoMessage3151 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _AcceptShareInviteResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _AcceptShareInviteResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _AcceptShareInviteResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_AcceptShareInviteResponse, a, b2);
  }
  static $() {
    return ["AcceptShareInviteResponse|1 repository #0", ClientRepoIdentifier];
  }
};
var MyShareInvite = class _MyShareInvite extends __protoMessage3151 {
  constructor(data) {
    super();
    this.inviteId = "";
    this.inviterDisplayName = "";
    this.policyName = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _MyShareInvite().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _MyShareInvite().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _MyShareInvite().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_MyShareInvite, a, b2);
  }
  static $() {
    return ["MyShareInvite|1 invite_id 9|2 repository #0|3 inviter_display_name 9|4 policy_name 9|5 expires_at #1|6 created_at #1", ClientRepoIdentifier, Timestamp];
  }
};
var ListMyShareInvitesRequest = class _ListMyShareInvitesRequest extends __protoMessage3151 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ListMyShareInvitesRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ListMyShareInvitesRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ListMyShareInvitesRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ListMyShareInvitesRequest, a, b2);
  }
  static $() {
    return ["ListMyShareInvitesRequest"];
  }
};
var ListMyShareInvitesResponse = class _ListMyShareInvitesResponse extends __protoMessage3151 {
  constructor(data) {
    super();
    this.invites = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ListMyShareInvitesResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ListMyShareInvitesResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ListMyShareInvitesResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ListMyShareInvitesResponse, a, b2);
  }
  static $() {
    return ["ListMyShareInvitesResponse|1 invites #0*", MyShareInvite];
  }
};
var MyExternalRepository = class _MyExternalRepository extends __protoMessage3151 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _MyExternalRepository().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _MyExternalRepository().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _MyExternalRepository().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_MyExternalRepository, a, b2);
  }
  static $() {
    return ["MyExternalRepository|1 repository #0|2 policy #1|3 added_at #2", ClientRepoIdentifier, GrantPolicyRef, Timestamp];
  }
};
var ListMyExternalRepositoriesRequest = class _ListMyExternalRepositoriesRequest extends __protoMessage3151 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ListMyExternalRepositoriesRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ListMyExternalRepositoriesRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ListMyExternalRepositoriesRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ListMyExternalRepositoriesRequest, a, b2);
  }
  static $() {
    return ["ListMyExternalRepositoriesRequest"];
  }
};
var ListMyExternalRepositoriesResponse = class _ListMyExternalRepositoriesResponse extends __protoMessage3151 {
  constructor(data) {
    super();
    this.repositories = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ListMyExternalRepositoriesResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ListMyExternalRepositoriesResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ListMyExternalRepositoriesResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ListMyExternalRepositoriesResponse, a, b2);
  }
  static $() {
    return ["ListMyExternalRepositoriesResponse|1 repositories #0*", MyExternalRepository];
  }
};
var RepoExternalCollaboratorRow = class _RepoExternalCollaboratorRow extends __protoMessage3151 {
  constructor(data) {
    super();
    this.userId = "";
    this.displayName = "";
    this.email = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _RepoExternalCollaboratorRow().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _RepoExternalCollaboratorRow().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _RepoExternalCollaboratorRow().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_RepoExternalCollaboratorRow, a, b2);
  }
  static $() {
    return ["RepoExternalCollaboratorRow|1 user_id 9|2 display_name 9|3 email 9|4 policy #0|5 added_at #1", GrantPolicyRef, Timestamp];
  }
};
var ListRepoExternalCollaboratorsRequest = class _ListRepoExternalCollaboratorsRequest extends __protoMessage3151 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ListRepoExternalCollaboratorsRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ListRepoExternalCollaboratorsRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ListRepoExternalCollaboratorsRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ListRepoExternalCollaboratorsRequest, a, b2);
  }
  static $() {
    return ["ListRepoExternalCollaboratorsRequest|1 identifier #0", ClientRepoIdentifier];
  }
};
var ListRepoExternalCollaboratorsResponse = class _ListRepoExternalCollaboratorsResponse extends __protoMessage3151 {
  constructor(data) {
    super();
    this.rows = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ListRepoExternalCollaboratorsResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ListRepoExternalCollaboratorsResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ListRepoExternalCollaboratorsResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ListRepoExternalCollaboratorsResponse, a, b2);
  }
  static $() {
    return ["ListRepoExternalCollaboratorsResponse|1 rows #0*", RepoExternalCollaboratorRow];
  }
};
var SetRepoExternalCollaboratorAccessRequest = class _SetRepoExternalCollaboratorAccessRequest extends __protoMessage3151 {
  constructor(data) {
    super();
    this.userId = "";
    this.policyUpdate = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _SetRepoExternalCollaboratorAccessRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _SetRepoExternalCollaboratorAccessRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _SetRepoExternalCollaboratorAccessRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_SetRepoExternalCollaboratorAccessRequest, a, b2);
  }
  static $() {
    return ["SetRepoExternalCollaboratorAccessRequest|1 identifier #0|2 user_id 9|3 policy #1 policy_update|4 remove 8 policy_update", ClientRepoIdentifier, GrantPolicyRef];
  }
};
var SetRepoExternalCollaboratorAccessResponse = class _SetRepoExternalCollaboratorAccessResponse extends __protoMessage3151 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _SetRepoExternalCollaboratorAccessResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _SetRepoExternalCollaboratorAccessResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _SetRepoExternalCollaboratorAccessResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_SetRepoExternalCollaboratorAccessResponse, a, b2);
  }
  static $() {
    return ["SetRepoExternalCollaboratorAccessResponse"];
  }
};
var LeaveMyExternalRepositoryRequest = class _LeaveMyExternalRepositoryRequest extends __protoMessage3151 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _LeaveMyExternalRepositoryRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _LeaveMyExternalRepositoryRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _LeaveMyExternalRepositoryRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_LeaveMyExternalRepositoryRequest, a, b2);
  }
  static $() {
    return ["LeaveMyExternalRepositoryRequest|1 identifier #0", ClientRepoIdentifier];
  }
};
var LeaveMyExternalRepositoryResponse = class _LeaveMyExternalRepositoryResponse extends __protoMessage3151 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _LeaveMyExternalRepositoryResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _LeaveMyExternalRepositoryResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _LeaveMyExternalRepositoryResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_LeaveMyExternalRepositoryResponse, a, b2);
  }
  static $() {
    return ["LeaveMyExternalRepositoryResponse"];
  }
};

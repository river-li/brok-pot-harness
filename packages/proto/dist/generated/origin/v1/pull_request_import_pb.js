init_esm();
init_compact();
var __protoPackage166 = "origin.v1.";
var __protoMessage3158 = class extends CompactMessage {
  static get runtime() {
    return defineOwn(this, "runtime", proto3);
  }
  static $p() {
    return __protoPackage166;
  }
};
var ImportedGithubPullRequestState = /* @__PURE__ */ enumType(proto3, __protoPackage166, "ImportedGithubPullRequestState", [[0, "UNSPECIFIED"], [1, "OPEN"], [2, "CLOSED"], [3, "MERGED"]], 1);
var ImportedGithubReviewVerdict = /* @__PURE__ */ enumType(proto3, __protoPackage166, "ImportedGithubReviewVerdict", [[0, "UNSPECIFIED"], [1, "APPROVE"], [2, "REQUEST_CHANGES"], [3, "COMMENT"]], 1);
var ImportedGithubCommentSide = /* @__PURE__ */ enumType(proto3, __protoPackage166, "ImportedGithubCommentSide", [[0, "UNSPECIFIED"], [1, "LEFT"], [2, "RIGHT"]], 1);
var ImportGithubPullRequestRequest = class _ImportGithubPullRequestRequest extends __protoMessage3158 {
  constructor(data) {
    super();
    this.allowDefaultActorFallback = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ImportGithubPullRequestRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ImportGithubPullRequestRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ImportGithubPullRequestRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ImportGithubPullRequestRequest, a, b2);
  }
  static $() {
    return ["ImportGithubPullRequestRequest|1 identifier #0|2 pull_request #1|3 allow_default_actor_fallback 8", ClientRepoIdentifier, ImportedGithubPullRequest];
  }
};
var ImportGithubPullRequestResponse = class _ImportGithubPullRequestResponse extends __protoMessage3158 {
  constructor(data) {
    super();
    this.changeId = "";
    this.number = 0;
    this.versionsCreated = 0;
    this.reviewsCreated = 0;
    this.threadsCreated = 0;
    this.commentsCreated = 0;
    this.timelineEventsCreated = 0;
    this.warnings = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ImportGithubPullRequestResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ImportGithubPullRequestResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ImportGithubPullRequestResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ImportGithubPullRequestResponse, a, b2);
  }
  static $() {
    return ["ImportGithubPullRequestResponse|1 change_id 9|2 number 5|3 versions_created 5|4 reviews_created 5|5 threads_created 5|6 comments_created 5|7 timeline_events_created 5|8 warnings 9*"];
  }
};
var ImportedGithubPullRequest = class _ImportedGithubPullRequest extends __protoMessage3158 {
  constructor(data) {
    super();
    this.number = 0;
    this.githubNodeId = "";
    this.title = "";
    this.description = "";
    this.state = ImportedGithubPullRequestState.UNSPECIFIED;
    this.draft = false;
    this.authorLogin = "";
    this.headRef = "";
    this.headSha = "";
    this.baseRef = "";
    this.baseSha = "";
    this.mergeCommitSha = "";
    this.mergedByLogin = "";
    this.reviews = [];
    this.reviewComments = [];
    this.issueComments = [];
    this.timelineEvents = [];
    this.actors = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ImportedGithubPullRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ImportedGithubPullRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ImportedGithubPullRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ImportedGithubPullRequest, a, b2);
  }
  static $() {
    return ["ImportedGithubPullRequest|1 number 5|2 github_node_id 9|3 title 9|4 description 9|5 state #0|6 draft 8|7 author_login 9|8 head_ref 9|9 head_sha 9|10 base_ref 9|11 base_sha 9|12 created_at #1|13 merged_at #1?|14 closed_at #1?|15 merge_commit_sha 9|16 merged_by_login 9|17 reviews #2*|18 review_comments #3*|19 issue_comments #4*|20 timeline_events #5*|21 actors #6*", ImportedGithubPullRequestState, Timestamp, ImportedGithubReview, ImportedGithubReviewComment, ImportedGithubIssueComment, ImportedGithubTimelineEvent, ImportedGithubActor];
  }
};
var ImportedGithubActor = class _ImportedGithubActor extends __protoMessage3158 {
  constructor(data) {
    super();
    this.login = "";
    this.githubUserNodeId = "";
    this.githubUserDatabaseId = protoInt64.zero;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ImportedGithubActor().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ImportedGithubActor().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ImportedGithubActor().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ImportedGithubActor, a, b2);
  }
  static $() {
    return ["ImportedGithubActor|1 login 9|2 github_user_node_id 9|3 github_user_database_id 3"];
  }
};
var ImportedGithubReview = class _ImportedGithubReview extends __protoMessage3158 {
  constructor(data) {
    super();
    this.githubNodeId = "";
    this.authorLogin = "";
    this.verdict = ImportedGithubReviewVerdict.UNSPECIFIED;
    this.body = "";
    this.commitSha = "";
    this.dismissedByLogin = "";
    this.dismissalMessage = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ImportedGithubReview().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ImportedGithubReview().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ImportedGithubReview().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ImportedGithubReview, a, b2);
  }
  static $() {
    return ["ImportedGithubReview|1 github_node_id 9|2 author_login 9|3 verdict #0|4 body 9|5 commit_sha 9|6 submitted_at #1|7 dismissed_at #1?|8 dismissed_by_login 9|9 dismissal_message 9", ImportedGithubReviewVerdict, Timestamp];
  }
};
var ImportedGithubReviewComment = class _ImportedGithubReviewComment extends __protoMessage3158 {
  constructor(data) {
    super();
    this.githubNodeId = "";
    this.reviewGithubNodeId = "";
    this.inReplyToGithubNodeId = "";
    this.authorLogin = "";
    this.body = "";
    this.path = "";
    this.commitSha = "";
    this.side = ImportedGithubCommentSide.UNSPECIFIED;
    this.startLine = 0;
    this.endLine = 0;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ImportedGithubReviewComment().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ImportedGithubReviewComment().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ImportedGithubReviewComment().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ImportedGithubReviewComment, a, b2);
  }
  static $() {
    return ["ImportedGithubReviewComment|1 github_node_id 9|2 review_github_node_id 9|3 in_reply_to_github_node_id 9|4 author_login 9|5 body 9|6 path 9|7 commit_sha 9|8 side #0|9 start_line 5|10 end_line 5|11 created_at #1", ImportedGithubCommentSide, Timestamp];
  }
};
var ImportedGithubIssueComment = class _ImportedGithubIssueComment extends __protoMessage3158 {
  constructor(data) {
    super();
    this.githubNodeId = "";
    this.authorLogin = "";
    this.body = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ImportedGithubIssueComment().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ImportedGithubIssueComment().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ImportedGithubIssueComment().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ImportedGithubIssueComment, a, b2);
  }
  static $() {
    return ["ImportedGithubIssueComment|1 github_node_id 9|2 author_login 9|3 body 9|4 created_at #0", Timestamp];
  }
};
var ImportedGithubTimelineEvent = class _ImportedGithubTimelineEvent extends __protoMessage3158 {
  constructor(data) {
    super();
    this.githubEvent = "";
    this.actorLogin = "";
    this.label = "";
    this.subjectLogin = "";
    this.previousTitle = "";
    this.newTitle = "";
    this.previousSha = "";
    this.newSha = "";
    this.previousBaseRef = "";
    this.newBaseRef = "";
    this.dismissedReviewGithubNodeId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ImportedGithubTimelineEvent().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ImportedGithubTimelineEvent().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ImportedGithubTimelineEvent().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ImportedGithubTimelineEvent, a, b2);
  }
  static $() {
    return ["ImportedGithubTimelineEvent|1 github_event 9|2 actor_login 9|3 created_at #0|4 label 9|5 subject_login 9|6 previous_title 9|7 new_title 9|8 previous_sha 9|9 new_sha 9|10 previous_base_ref 9|11 new_base_ref 9|12 dismissed_review_github_node_id 9", Timestamp];
  }
};

/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/proto/dist/generated/origin/v1/origin_connect.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/2
init_esm();

// @recovered-fragment 2/2
var OriginService = {
  typeName: "origin.v1.OriginService",
  methods: {
    /**
     * -- Repos (origin-repos)
     *
     * @generated from rpc origin.v1.OriginService.ListHostedRepos
     */
    listHostedRepos: {
      name: "ListHostedRepos",
      I: ListHostedReposRequest,
      O: ListHostedReposResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc origin.v1.OriginService.CreateRepo
     */
    createRepo: {
      name: "CreateRepo",
      I: CreateRepoRequest,
      O: CreateRepoResponse,
      kind: MethodKind.Unary
    },
    /**
     * Creates a repo, first ensuring the caller's personal user namespace when
     * `identifier.org` is empty. Non-empty owners delegate to CreateRepo.
     *
     * @generated from rpc origin.v1.OriginService.CreateRepoAndEnsureUserNamespace
     */
    createRepoAndEnsureUserNamespace: {
      name: "CreateRepoAndEnsureUserNamespace",
      I: CreateRepoRequest,
      O: CreateRepoResponse,
      kind: MethodKind.Unary
    },
    /**
     * Publishes an agent_temp (draft) repo by flipping `repo_kind` from `agent_temp`
     * to `standard`, and re-emits the `repositoryCreated` Origin event so webhook
     * subscribers learn about the repo (create-time webhook fan-out is
     * suppressed for agent_temp repos). Optional `new_name` and `visibility`
     * are applied in the same write. Idempotent when the repo is already
     * standard; marketplace mirrors are never publishable.
     *
     * @generated from rpc origin.v1.OriginService.PublishAgentTempRepo
     */
    publishAgentTempRepo: {
      name: "PublishAgentTempRepo",
      I: PublishAgentTempRepoRequest,
      O: PublishAgentTempRepoResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc origin.v1.OriginService.CreateMirroredRepo
     */
    createMirroredRepo: {
      name: "CreateMirroredRepo",
      I: CreateMirroredRepoRequest,
      O: CreateRepoResponse,
      kind: MethodKind.Unary
    },
    /**
     * Returns the subset of the requested GitHub repos the caller can mirror
     * (GitHub repo admin or org admin). Used by the Sync Repo picker to hide
     * candidates CreateMirroredRepo would reject for missing admin.
     *
     * @generated from rpc origin.v1.OriginService.FilterMirrorableGithubRepos
     */
    filterMirrorableGithubRepos: {
      name: "FilterMirrorableGithubRepos",
      I: FilterMirrorableGithubReposRequest,
      O: FilterMirrorableGithubReposResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc origin.v1.OriginService.DeleteRepo
     */
    deleteRepo: {
      name: "DeleteRepo",
      I: DeleteRepoClientRequest,
      O: DeleteRepoClientResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc origin.v1.OriginService.DeleteMirroredRepo
     */
    deleteMirroredRepo: {
      name: "DeleteMirroredRepo",
      I: DeleteMirroredRepoRequest,
      O: DeleteMirroredRepoResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc origin.v1.OriginService.GetRepo
     */
    getRepo: {
      name: "GetRepo",
      I: GetRepoRequest,
      O: GetRepoResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc origin.v1.OriginService.GetRepoWithMirrorInfo
     */
    getRepoWithMirrorInfo: {
      name: "GetRepoWithMirrorInfo",
      I: GetRepoRequest,
      O: GetRepoWithMirrorInfoResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc origin.v1.OriginService.GetRepoByGithubMirror
     */
    getRepoByGithubMirror: {
      name: "GetRepoByGithubMirror",
      I: GetRepoByGithubMirrorRequest,
      O: GetRepoWithMirrorInfoResponse,
      kind: MethodKind.Unary
    },
    /**
     * Records one successful CloneKit bootstrap reported by `origin repo
     * clone-fast` as a `repository.clone_kit_bootstrapped` event.
     * Repository-read scoped, so the same capability that served the kit
     * authorizes reporting it.
     *
     * @generated from rpc origin.v1.OriginService.RecordCloneKitUsage
     */
    recordCloneKitUsage: {
      name: "RecordCloneKitUsage",
      I: RecordCloneKitUsageRequest,
      O: RecordCloneKitUsageResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc origin.v1.OriginService.UpdateRepoMergeSettings
     */
    updateRepoMergeSettings: {
      name: "UpdateRepoMergeSettings",
      I: UpdateRepoMergeSettingsRequest,
      O: UpdateRepoMergeSettingsResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc origin.v1.OriginService.UpdateRepoBranchDeletionSetting
     */
    updateRepoBranchDeletionSetting: {
      name: "UpdateRepoBranchDeletionSetting",
      I: UpdateRepoBranchDeletionSettingRequest,
      O: UpdateRepoBranchDeletionSettingResponse,
      kind: MethodKind.Unary
    },
    /**
     * Newest-first page of a repository's CloneKit generations, read from the
     * git-forge bundles bucket. Hidden (NOT_FOUND) while the
     * `enable_clonekit_in_app` gate is off for the caller.
     *
     * @generated from rpc origin.v1.OriginService.ListRepoCloneKits
     */
    listRepoCloneKits: {
      name: "ListRepoCloneKits",
      I: ListRepoCloneKitsRequest,
      O: ListRepoCloneKitsResponse,
      kind: MethodKind.Unary
    },
    /**
     * Change a repo's visibility (internal <-> private). Internal -> private
     * seeds a direct ORIGIN_REPO_ADMIN grant for the caller only when an
     * Internal-shelf-only grantee would otherwise lose access.
     *
     * @generated from rpc origin.v1.OriginService.UpdateRepoVisibility
     */
    updateRepoVisibility: {
      name: "UpdateRepoVisibility",
      I: UpdateRepoVisibilityRequest,
      O: UpdateRepoVisibilityResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc origin.v1.OriginService.UpdateRepoDefaultBranch
     */
    updateRepoDefaultBranch: {
      name: "UpdateRepoDefaultBranch",
      I: UpdateRepoDefaultBranchRequest,
      O: UpdateRepoDefaultBranchResponse,
      kind: MethodKind.Unary
    },
    /**
     * -- Mirror Sync (origin-sync)
     *
     * @generated from rpc origin.v1.OriginService.DetachRepoMirror
     */
    detachRepoMirror: {
      name: "DetachRepoMirror",
      I: DetachRepoMirrorRequest,
      O: DetachRepoMirrorResponse,
      kind: MethodKind.Unary
    },
    /**
     * Inverse of DetachRepoMirror: re-attach a detached GitHub mirror as an
     * outbound mirror and signal the catch-up push. Blocks on git-forge ref
     * comparison and, with wait_for_catch_up, on the push itself.
     *
     * @generated from rpc origin.v1.OriginService.ReattachRepoMirror
     */
    reattachRepoMirror: {
      name: "ReattachRepoMirror",
      I: ReattachRepoMirrorRequest,
      O: ReattachRepoMirrorResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc origin.v1.OriginService.TransitionRepoMirrorStatus
     */
    transitionRepoMirrorStatus: {
      name: "TransitionRepoMirrorStatus",
      I: TransitionRepoMirrorStatusRequest,
      O: TransitionRepoMirrorStatusResponse,
      kind: MethodKind.Unary
    },
    /**
     * Outbound-to-inbound cutover without the final reverse-mirror push; see
     * ForceRepoMirrorCutoverRequest. Unlike the operator-console path, this
     * public entry point requires the caller to be a GitHub admin of the
     * backing repo (same bar as TransitionRepoMirrorStatus).
     *
     * @generated from rpc origin.v1.OriginService.ForceRepoMirrorCutover
     */
    forceRepoMirrorCutover: {
      name: "ForceRepoMirrorCutover",
      I: ForceRepoMirrorCutoverRequest,
      O: ForceRepoMirrorCutoverResponse,
      kind: MethodKind.Unary
    },
    /**
     * Connect twin of the public REST SyncMirror for first-party callers.
     *
     * @generated from rpc origin.v1.OriginService.SyncMirror
     */
    syncMirror: {
      name: "SyncMirror",
      I: SyncMirrorRequest,
      O: SyncMirrorResponse,
      kind: MethodKind.Unary
    },
    /**
     * Mirror deploy key management: generate/rotate the per-repo SSH deploy
     * key used for mirror git transport, inspect its public half, or remove
     * it. The private key never leaves the server.
     *
     * @generated from rpc origin.v1.OriginService.CreateRepoMirrorDeployKey
     */
    createRepoMirrorDeployKey: {
      name: "CreateRepoMirrorDeployKey",
      I: CreateRepoMirrorDeployKeyRequest,
      O: CreateRepoMirrorDeployKeyResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc origin.v1.OriginService.GetRepoMirrorDeployKey
     */
    getRepoMirrorDeployKey: {
      name: "GetRepoMirrorDeployKey",
      I: GetRepoMirrorDeployKeyRequest,
      O: GetRepoMirrorDeployKeyResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc origin.v1.OriginService.DeleteRepoMirrorDeployKey
     */
    deleteRepoMirrorDeployKey: {
      name: "DeleteRepoMirrorDeployKey",
      I: DeleteRepoMirrorDeployKeyRequest,
      O: DeleteRepoMirrorDeployKeyResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc origin.v1.OriginService.GetMirrorTransitionJob
     */
    getMirrorTransitionJob: {
      name: "GetMirrorTransitionJob",
      I: GetMirrorTransitionJobRequest,
      O: GetMirrorTransitionJobResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc origin.v1.OriginService.GetActiveMirrorTransitionJob
     */
    getActiveMirrorTransitionJob: {
      name: "GetActiveMirrorTransitionJob",
      I: GetActiveMirrorTransitionJobRequest,
      O: GetActiveMirrorTransitionJobResponse,
      kind: MethodKind.Unary
    },
    /**
     * -- Access (origin-iam)
     *
     * @generated from rpc origin.v1.OriginService.GetRepoNamespace
     */
    getRepoNamespace: {
      name: "GetRepoNamespace",
      I: GetRepoNamespaceRequest,
      O: GetRepoNamespaceResponse,
      kind: MethodKind.Unary
    },
    /**
     * First-run onboarding probe: whether the team has claimed an Origin
     * namespace yet. Authorized by owning-team membership (any role), outside
     * the Origin policy framework — an unclaimed team has no Origin resource to
     * run a policy check against, and only the team's own members may learn its
     * claim status. Reveals existence only; resolving the namespace itself stays
     * on `GetRepoNamespace` and its policy-engine read check.
     *
     * @generated from rpc origin.v1.OriginService.DoesNamespaceExistForTeam
     */
    doesNamespaceExistForTeam: {
      name: "DoesNamespaceExistForTeam",
      I: DoesNamespaceExistForTeamRequest,
      O: DoesNamespaceExistForTeamResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc origin.v1.OriginService.GetAuthorizedNamespaces
     */
    getAuthorizedNamespaces: {
      name: "GetAuthorizedNamespaces",
      I: GetAuthorizedNamespacesRequest,
      O: GetAuthorizedNamespacesResponse,
      kind: MethodKind.Unary
    },
    /**
     * Claim a globally-unique namespace for an owner entity. A TEAM caller must
     * be an admin of the owning team; a USER caller may claim only their own
     * namespace. Returns `ALREADY_EXISTS` on either unique-key conflict.
     *
     * @generated from rpc origin.v1.OriginService.CreateOriginNamespace
     */
    createOriginNamespace: {
      name: "CreateOriginNamespace",
      I: CreateOriginNamespaceRequest,
      O: CreateOriginNamespaceResponse,
      kind: MethodKind.Unary
    },
    /**
     * Self-serve Codebase onboarding: claim the team's namespace with the
     * standard creation bootstrap (team admins → namespace Admin; team members
     * get no grant by default) in one atomic call. The grant is inserted only
     * when the namespace is created; an existing namespace's access is never
     * modified. Idempotent for the slug the team already owns. Caller must be
     * an admin of the owning team. Returns `ALREADY_EXISTS` when the slug is
     * taken by another owner, and `FAILED_PRECONDITION` when the team already
     * owns a different namespace.
     *
     * @generated from rpc origin.v1.OriginService.SetupTeamNamespace
     */
    setupTeamNamespace: {
      name: "SetupTeamNamespace",
      I: SetupTeamNamespaceRequest,
      O: SetupTeamNamespaceResponse,
      kind: MethodKind.Unary
    },
    /**
     * Self-serve personal Codebase onboarding: claim the calling user's own
     * namespace with the standard creation bootstrap (the owning user →
     * namespace Admin) in one atomic call. The grant is inserted only when the
     * namespace is created; an existing namespace's access is never modified.
     * Idempotent for the slug the user already owns. The caller may only claim a
     * namespace for their own user, must be on an eligible plan (Pro/Ultra),
     * must not belong to a team or organization, and must permit code storage
     * (not Privacy Mode Legacy). Returns `ALREADY_EXISTS` when the slug is taken
     * by another owner, and `FAILED_PRECONDITION` when the user already owns a
     * different namespace.
     *
     * @generated from rpc origin.v1.OriginService.SetupUserNamespace
     */
    setupUserNamespace: {
      name: "SetupUserNamespace",
      I: SetupUserNamespaceRequest,
      O: SetupUserNamespaceResponse,
      kind: MethodKind.Unary
    },
    /**
     * Server-authoritative slug preflight for Codebase onboarding. Given a
     * preferred slug it validates format, reserved route prefixes, the app-slug
     * blocklist, and global uniqueness, returning a clear message and a working
     * alternative when unavailable. Given an empty slug it returns a suggested
     * slug to prepopulate. The client keeps only lightweight trim/lowercase UX
     * and trusts this response for ok/error/alternative.
     *
     * @generated from rpc origin.v1.OriginService.SuggestOriginNamespace
     */
    suggestOriginNamespace: {
      name: "SuggestOriginNamespace",
      I: SuggestOriginNamespaceRequest,
      O: SuggestOriginNamespaceResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc origin.v1.OriginService.ListRepoAssignablePolicies
     */
    listRepoAssignablePolicies: {
      name: "ListRepoAssignablePolicies",
      I: ListRepoAssignablePoliciesRequest,
      O: ListRepoAssignablePoliciesResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc origin.v1.OriginService.GetRepoTeamAccess
     */
    getRepoTeamAccess: {
      name: "GetRepoTeamAccess",
      I: GetRepoTeamAccessRequest,
      O: GetRepoTeamAccessResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc origin.v1.OriginService.ListRepoGrants
     */
    listRepoGrants: {
      name: "ListRepoGrants",
      I: ListRepoGrantsRequest,
      O: ListRepoGrantsResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc origin.v1.OriginService.SetRepoTeamAccess
     */
    setRepoTeamAccess: {
      name: "SetRepoTeamAccess",
      I: SetRepoTeamAccessRequest,
      O: SetRepoTeamAccessResponse,
      kind: MethodKind.Unary
    },
    /**
     * Set (or clear) an individual team member's direct per-repo grant (the
     * individual analog of SetRepoTeamAccess and the repo analog of
     * SetNamespaceUserAccess). Grants are restricted to active members of the
     * owning team. Clearing removes only the repository grant; a namespace-level
     * grant (the inherited floor) is untouched.
     *
     * @generated from rpc origin.v1.OriginService.SetRepoUserAccess
     */
    setRepoUserAccess: {
      name: "SetRepoUserAccess",
      I: SetRepoUserAccessRequest,
      O: SetRepoUserAccessResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc origin.v1.OriginService.CreateRepoShareInvite
     */
    createRepoShareInvite: {
      name: "CreateRepoShareInvite",
      I: CreateRepoShareInviteRequest,
      O: CreateRepoShareInviteResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc origin.v1.OriginService.CreateRepoShareBatchInvites
     */
    createRepoShareBatchInvites: {
      name: "CreateRepoShareBatchInvites",
      I: CreateRepoShareBatchInvitesRequest,
      O: CreateRepoShareBatchInvitesResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc origin.v1.OriginService.UpdateRepoShareInvite
     */
    updateRepoShareInvite: {
      name: "UpdateRepoShareInvite",
      I: UpdateRepoShareInviteRequest,
      O: UpdateRepoShareInviteResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc origin.v1.OriginService.RevokeRepoShareInvite
     */
    revokeRepoShareInvite: {
      name: "RevokeRepoShareInvite",
      I: RevokeRepoShareInviteRequest,
      O: RevokeRepoShareInviteResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc origin.v1.OriginService.ListRepoShareInvites
     */
    listRepoShareInvites: {
      name: "ListRepoShareInvites",
      I: ListRepoShareInvitesRequest,
      O: ListRepoShareInvitesResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc origin.v1.OriginService.GetShareInviteByToken
     */
    getShareInviteByToken: {
      name: "GetShareInviteByToken",
      I: GetShareInviteByTokenRequest,
      O: GetShareInviteByTokenResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc origin.v1.OriginService.DeclineShareInvite
     */
    declineShareInvite: {
      name: "DeclineShareInvite",
      I: DeclineShareInviteRequest,
      O: DeclineShareInviteResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc origin.v1.OriginService.AcceptShareInvite
     */
    acceptShareInvite: {
      name: "AcceptShareInvite",
      I: AcceptShareInviteRequest,
      O: AcceptShareInviteResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc origin.v1.OriginService.ListMyShareInvites
     */
    listMyShareInvites: {
      name: "ListMyShareInvites",
      I: ListMyShareInvitesRequest,
      O: ListMyShareInvitesResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc origin.v1.OriginService.ListMyExternalRepositories
     */
    listMyExternalRepositories: {
      name: "ListMyExternalRepositories",
      I: ListMyExternalRepositoriesRequest,
      O: ListMyExternalRepositoriesResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc origin.v1.OriginService.LeaveMyExternalRepository
     */
    leaveMyExternalRepository: {
      name: "LeaveMyExternalRepository",
      I: LeaveMyExternalRepositoryRequest,
      O: LeaveMyExternalRepositoryResponse,
      kind: MethodKind.Unary
    },
    /**
     * Set (or clear) a canonical group's direct per-repo grant (the group analog
     * of SetRepoUserAccess and the repo analog of SetNamespaceGroupAccess). The
     * group must be an active group in the owning team's linked organization
     * or a team-level group owned by the owning team itself. A team group owned
     * by another team is refused, so cross-team sharing stays on organization
     * groups. Clearing removes only the repository grant; a namespace-level
     * group grant (the inherited floor) is untouched.
     *
     * @generated from rpc origin.v1.OriginService.SetRepoGroupAccess
     */
    setRepoGroupAccess: {
      name: "SetRepoGroupAccess",
      I: SetRepoGroupAccessRequest,
      O: SetRepoGroupAccessResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc origin.v1.OriginService.HasOriginPermission
     */
    hasOriginPermission: {
      name: "HasOriginPermission",
      I: HasOriginPermissionRequest,
      O: HasOriginPermissionResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc origin.v1.OriginService.GetNamespaceTeamAccess
     */
    getNamespaceTeamAccess: {
      name: "GetNamespaceTeamAccess",
      I: GetNamespaceTeamAccessRequest,
      O: GetNamespaceTeamAccessResponse,
      kind: MethodKind.Unary
    },
    /**
     * Set (or clear) a team group's namespace floor grant (the namespace analog
     * of SetRepoTeamAccess). A write that would leave the namespace without any
     * Admin-policy grant is rejected unless retain_self_admin keeps the caller
     * as a personal Codebase Admin.
     *
     * @generated from rpc origin.v1.OriginService.SetNamespaceTeamAccess
     */
    setNamespaceTeamAccess: {
      name: "SetNamespaceTeamAccess",
      I: SetNamespaceTeamAccessRequest,
      O: SetNamespaceTeamAccessResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc origin.v1.OriginService.ListNamespaceGrants
     */
    listNamespaceGrants: {
      name: "ListNamespaceGrants",
      I: ListNamespaceGrantsRequest,
      O: ListNamespaceGrantsResponse,
      kind: MethodKind.Unary
    },
    /**
     * Set (or clear) individual team members' direct namespace grants (the
     * individual analog of SetNamespaceTeamAccess). Grants are restricted to
     * active members of the owning team; a write that would leave the namespace
     * without any Admin-policy grant is rejected unless retain_self_admin keeps
     * the caller as a personal Codebase Admin.
     *
     * @generated from rpc origin.v1.OriginService.SetNamespaceUserAccess
     */
    setNamespaceUserAccess: {
      name: "SetNamespaceUserAccess",
      I: SetNamespaceUserAccessRequest,
      O: SetNamespaceUserAccessResponse,
      kind: MethodKind.Unary
    },
    /**
     * Set (or clear) canonical groups' direct namespace grants (the group analog
     * of SetNamespaceUserAccess). Each group must be an active group in the
     * owning team's linked organization or a team-level group owned by the
     * owning team itself (never another team's). A write that would leave the
     * namespace without any Admin-policy grant is rejected unless
     * retain_self_admin keeps the caller as a personal Codebase Admin.
     *
     * @generated from rpc origin.v1.OriginService.SetNamespaceGroupAccess
     */
    setNamespaceGroupAccess: {
      name: "SetNamespaceGroupAccess",
      I: SetNamespaceGroupAccessRequest,
      O: SetNamespaceGroupAccessResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc origin.v1.OriginService.ListNamespaceAssignablePolicies
     */
    listNamespaceAssignablePolicies: {
      name: "ListNamespaceAssignablePolicies",
      I: ListNamespaceAssignablePoliciesRequest,
      O: ListNamespaceAssignablePoliciesResponse,
      kind: MethodKind.Unary
    },
    /**
     * The grants one organization group holds in a namespace (its direct
     * namespace grant plus its per-repository grants), for the group page.
     * Edits go through SetNamespaceGroupAccess / SetRepoGroupAccess.
     *
     * @generated from rpc origin.v1.OriginService.ListGroupGrantsInNamespace
     */
    listGroupGrantsInNamespace: {
      name: "ListGroupGrantsInNamespace",
      I: ListGroupGrantsInNamespaceRequest,
      O: ListGroupGrantsInNamespaceResponse,
      kind: MethodKind.Unary
    },
    /**
     * `ALREADY_EXISTS` on a known fingerprint, without saying whose it is.
     *
     * @generated from rpc origin.v1.OriginService.AddSshPublicKey
     */
    addSshPublicKey: {
      name: "AddSshPublicKey",
      I: AddSshPublicKeyRequest,
      O: AddSshPublicKeyResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc origin.v1.OriginService.ListSshPublicKeys
     */
    listSshPublicKeys: {
      name: "ListSshPublicKeys",
      I: ListSshPublicKeysRequest,
      O: ListSshPublicKeysResponse,
      kind: MethodKind.Unary
    },
    /**
     * `NOT_FOUND` for an id the caller does not own, whether or not it exists.
     *
     * @generated from rpc origin.v1.OriginService.DeleteSshPublicKey
     */
    deleteSshPublicKey: {
      name: "DeleteSshPublicKey",
      I: DeleteSshPublicKeyRequest,
      O: DeleteSshPublicKeyResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc origin.v1.OriginService.UpsertOriginUserSlackNotification
     */
    upsertOriginUserSlackNotification: {
      name: "UpsertOriginUserSlackNotification",
      I: UpsertOriginUserSlackNotificationRequest,
      O: UpsertOriginUserSlackNotificationResponse,
      kind: MethodKind.Unary
    },
    /**
     * `NOT_FOUND` for an id the caller does not own, whether or not it exists.
     *
     * @generated from rpc origin.v1.OriginService.DeleteOriginUserSlackNotification
     */
    deleteOriginUserSlackNotification: {
      name: "DeleteOriginUserSlackNotification",
      I: DeleteOriginUserSlackNotificationRequest,
      O: DeleteOriginUserSlackNotificationResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc origin.v1.OriginService.GetOriginUserSlackNotification
     */
    getOriginUserSlackNotification: {
      name: "GetOriginUserSlackNotification",
      I: GetOriginUserSlackNotificationRequest,
      O: GetOriginUserSlackNotificationResponse,
      kind: MethodKind.Unary
    },
    /**
     * -- Git Operations
     *
     * @generated from rpc origin.v1.OriginService.GetCommit
     */
    getCommit: {
      name: "GetCommit",
      I: GetCommitClientRequest,
      O: GetCommitResponse,
      kind: MethodKind.Unary
    },
    /**
     * Read a Git blob object by SHA (GitHub `GET .../git/blobs/{file_sha}`).
     *
     * @generated from rpc origin.v1.OriginService.GetBlob
     */
    getBlob: {
      name: "GetBlob",
      I: GetBlobClientRequest,
      O: GetBlobResponse,
      kind: MethodKind.Unary
    },
    /**
     * Read an annotated Git tag object by SHA (GitHub `GET .../git/tags/{tag_sha}`).
     *
     * @generated from rpc origin.v1.OriginService.GetTag
     */
    getTag: {
      name: "GetTag",
      I: GetTagClientRequest,
      O: GetTagResponse,
      kind: MethodKind.Unary
    },
    /**
     * Read a Git tree object by SHA or ref (GitHub `GET .../git/trees/{tree_sha}`).
     *
     * @generated from rpc origin.v1.OriginService.GetTree
     */
    getTree: {
      name: "GetTree",
      I: GetTreeClientRequest,
      O: GetTreeResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc origin.v1.OriginService.ResolveRepoPath
     */
    resolveRepoPath: {
      name: "ResolveRepoPath",
      I: ResolveRepoPathClientRequest,
      O: ResolveRefPathResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc origin.v1.OriginService.GetRepoContent
     */
    getRepoContent: {
      name: "GetRepoContent",
      I: GetRepoContentClientRequest,
      O: GetRepoContentResponse,
      kind: MethodKind.Unary
    },
    /**
     * Capability token for raw.<host> file download. Portal/cursor.com mint;
     * HTTP redeem is separate. InvalidArgument for dirs; NotFound if gated/denied.
     *
     * @generated from rpc origin.v1.OriginService.MintRawRepoFileLink
     */
    mintRawRepoFileLink: {
      name: "MintRawRepoFileLink",
      I: MintRawRepoFileLinkClientRequest,
      O: MintRawRepoFileLinkClientResponse,
      kind: MethodKind.Unary
    },
    /**
     * Gzip tarball of the repository tree. Returns a short-lived signed URL.
     * Empty `ref` uses the default branch. Empty repositories fail with Aborted.
     * A cache miss generates the archive through git-httpd, writes it through to
     * object storage, and returns the signed URL on the same request. Success
     * always includes download_url.
     *
     * @generated from rpc origin.v1.OriginService.GetRepoTarball
     */
    getRepoTarball: {
      name: "GetRepoTarball",
      I: GetRepoTarballClientRequest,
      O: GetRepoTarballClientResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc origin.v1.OriginService.GetRepoContentAtSha
     */
    getRepoContentAtSha: {
      name: "GetRepoContentAtSha",
      I: GetRepoContentAtShaClientRequest,
      O: GetRepoContentResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc origin.v1.OriginService.GetRepoContentDetailsAtSha
     */
    getRepoContentDetailsAtSha: {
      name: "GetRepoContentDetailsAtSha",
      I: GetRepoContentDetailsAtShaClientRequest,
      O: GetRepoContentDetailsResponse,
      kind: MethodKind.Unary
    },
    /**
     * Several paths at one revision in one git-rpc call. Missing paths are
     * `found: false` results. See git_forge.v1.GitRpcService.BatchGetRepoContent.
     *
     * @generated from rpc origin.v1.OriginService.BatchGetRepoContentAtSha
     */
    batchGetRepoContentAtSha: {
      name: "BatchGetRepoContentAtSha",
      I: BatchGetRepoContentAtShaClientRequest,
      O: BatchGetRepoContentResponse,
      kind: MethodKind.Unary
    },
    /**
     * Symbol and definition lookup at an exact commit. The response's
     * provenance reports how results were produced (search-based by default).
     *
     * @generated from rpc origin.v1.OriginService.ResolveCodeIntelligenceSymbolAtPosition
     */
    resolveCodeIntelligenceSymbolAtPosition: {
      name: "ResolveCodeIntelligenceSymbolAtPosition",
      I: ResolveCodeIntelligenceSymbolAtPositionRequest,
      O: ResolveCodeIntelligenceSymbolAtPositionResponse,
      kind: MethodKind.Unary
    },
    /**
     * References at an exact commit (whole-word text matches for the
     * search-based default). The stream emits a provenance header, zero or
     * more locations, and a count trailer.
     *
     * @generated from rpc origin.v1.OriginService.FindCodeIntelligenceReferencesAtPosition
     */
    findCodeIntelligenceReferencesAtPosition: {
      name: "FindCodeIntelligenceReferencesAtPosition",
      I: FindCodeIntelligenceReferencesAtPositionRequest,
      O: FindCodeIntelligenceReferencesAtPositionResponse,
      kind: MethodKind.ServerStreaming
    },
    /**
     * Resolves CODEOWNERS owners for the given repo paths at a ref. Reads the
     * repo's ORIGIN_CODEOWNERS file at `base_ref`, parses it, and matches each
     * requested path. An absent/unreadable CODEOWNERS file yields empty owners.
     *
     * @generated from rpc origin.v1.OriginService.GetRepoCodeowners
     */
    getRepoCodeowners: {
      name: "GetRepoCodeowners",
      I: GetRepoCodeownersClientRequest,
      O: GetRepoCodeownersResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc origin.v1.OriginService.GetFileHistory
     */
    getFileHistory: {
      name: "GetFileHistory",
      I: GetFileHistoryClientRequest,
      O: GetFileHistoryResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc origin.v1.OriginService.GetFileHistoryPage
     */
    getFileHistoryPage: {
      name: "GetFileHistoryPage",
      I: GetFileHistoryPageClientRequest,
      O: GetFileHistoryPageResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc origin.v1.OriginService.GetFileHistoryPageWithDiffStats
     */
    getFileHistoryPageWithDiffStats: {
      name: "GetFileHistoryPageWithDiffStats",
      I: GetFileHistoryPageWithDiffStatsClientRequest,
      O: GetFileHistoryPageWithDiffStatsResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc origin.v1.OriginService.GetFuzzyPaths
     */
    getFuzzyPaths: {
      name: "GetFuzzyPaths",
      I: GetFuzzyPathsClientRequest,
      O: GetFuzzyPathsResponse,
      kind: MethodKind.Unary
    },
    /**
     * Exact glob-based blob path listing over a commit tree (Origin-capped).
     *
     * @generated from rpc origin.v1.OriginService.ListRepoPaths
     */
    listRepoPaths: {
      name: "ListRepoPaths",
      I: ListRepoPathsClientRequest,
      O: ListTreePathsResponse,
      kind: MethodKind.Unary
    },
    /**
     * Repo-wide code search (crepe-backed grep) pinned to a revision.
     * Streams matches as they are found; clients cancel by aborting the RPC.
     *
     * @generated from rpc origin.v1.OriginService.GrepRepo
     */
    grepRepo: {
      name: "GrepRepo",
      I: GrepRepoClientRequest,
      O: GrepRepoChunk,
      kind: MethodKind.ServerStreaming
    },
    /**
     * @generated from rpc origin.v1.OriginService.GetPullRequestDiff
     */
    getPullRequestDiff: {
      name: "GetPullRequestDiff",
      I: GetPullRequestDiffClientRequest,
      O: PullRequestDiffChunk,
      kind: MethodKind.ServerStreaming
    },
    /**
     * @generated from rpc origin.v1.OriginService.GetCommitDiff
     */
    getCommitDiff: {
      name: "GetCommitDiff",
      I: GetCommitDiffClientRequest,
      O: CommitDiffChunk,
      kind: MethodKind.ServerStreaming
    },
    /**
     * True-streaming variant of GetCommitDiff, passing through git-rpc's
     * GetCommitDiff2 stream contract: a metadata-only changed-file header
     * first, computed per-file entries correlated by header index as each one
     * finishes, and the aggregate stats trailer last. Unpaginated; the stream
     * covers the complete filtered change set.
     *
     * @generated from rpc origin.v1.OriginService.GetCommitDiff2
     */
    getCommitDiff2: {
      name: "GetCommitDiff2",
      I: GetCommitDiff2ClientRequest,
      O: CommitDiff2Chunk,
      kind: MethodKind.ServerStreaming
    },
    /**
     * Unary specialization of GetCommitDiff2's header: the complete
     * path-sorted changed-file metadata list, without the per-file entry
     * stream behind it. See git_forge.v1.GitRpcService.GetCommitChangedPaths.
     *
     * @generated from rpc origin.v1.OriginService.GetCommitChangedPaths
     */
    getCommitChangedPaths: {
      name: "GetCommitChangedPaths",
      I: GetCommitChangedPathsClientRequest,
      O: GetCommitChangedPathsResponse,
      kind: MethodKind.Unary
    },
    /**
     * Unary specialization of GetCommitDiff2's trailer: aggregate stats over a
     * commit diff's complete change set as one response. See
     * git_forge.v1.GitRpcService.GetCommitDiffStats.
     *
     * @generated from rpc origin.v1.OriginService.GetCommitDiffStats
     */
    getCommitDiffStats: {
      name: "GetCommitDiffStats",
      I: GetCommitDiffStatsClientRequest,
      O: GetCommitDiffStatsResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc origin.v1.OriginService.GetBlame
     */
    getBlame: {
      name: "GetBlame",
      I: GetBlameClientRequest,
      O: BlameChunk,
      kind: MethodKind.ServerStreaming
    },
    /**
     * Last-touching commit for each direct child of a directory tree. Unary,
     * unlike GetBlame: the response is the full set of per-entry commits.
     *
     * @generated from rpc origin.v1.OriginService.GetTreeBlame
     */
    getTreeBlame: {
      name: "GetTreeBlame",
      I: GetTreeBlameClientRequest,
      O: GetTreeBlameResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc origin.v1.OriginService.ListRefs
     */
    listRefs: {
      name: "ListRefs",
      I: ListRefsClientRequest,
      O: ListRefsResponse,
      kind: MethodKind.Unary
    },
    /**
     * Picker-style ref-name search with an exact-match fast path; see
     * git_forge.v1.GitRpcService.SearchRefs.
     *
     * @generated from rpc origin.v1.OriginService.SearchRefs
     */
    searchRefs: {
      name: "SearchRefs",
      I: SearchRefsClientRequest,
      O: SearchRefsResponse,
      kind: MethodKind.Unary
    },
    /**
     * ODB SHA-prefix commit lookup; see git_forge.v1.GitRpcService.LookupCommits.
     *
     * @generated from rpc origin.v1.OriginService.LookupCommits
     */
    lookupCommits: {
      name: "LookupCommits",
      I: LookupCommitsClientRequest,
      O: LookupCommitsResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc origin.v1.OriginService.CompareCommits
     */
    compareCommits: {
      name: "CompareCommits",
      I: CompareCommitsClientRequest,
      O: CompareCommitsResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc origin.v1.OriginService.ListCommitsInRange
     */
    listCommitsInRange: {
      name: "ListCommitsInRange",
      I: ListCommitsInRangeClientRequest,
      O: ListCommitsInRangeResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc origin.v1.OriginService.CanMerge
     */
    canMerge: {
      name: "CanMerge",
      I: CanMergeClientRequest,
      O: CanMergeResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc origin.v1.OriginService.CreateMergeCommitBypassingChecks
     */
    createMergeCommitBypassingChecks: {
      name: "CreateMergeCommitBypassingChecks",
      I: CreateMergeCommitBypassingChecksClientRequest,
      O: CreateMergeCommitBypassingChecksResponse,
      kind: MethodKind.Unary
    },
    /**
     * Create a commit on a branch from inline file upserts/deletes, without a
     * local git client. Rejected when the target branch has push-time rules
     * that would block a direct push.
     *
     * @generated from rpc origin.v1.OriginService.CreateCommitFromFiles
     */
    createCommitFromFiles: {
      name: "CreateCommitFromFiles",
      I: CreateCommitFromFilesClientRequest,
      O: CreateCommitFromFilesClientResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc origin.v1.OriginService.GetCollectedPullRequestDiff
     */
    getCollectedPullRequestDiff: {
      name: "GetCollectedPullRequestDiff",
      I: GetCollectedPullRequestDiffRequest,
      O: GetCollectedPullRequestDiffResponse,
      kind: MethodKind.Unary
    },
    /**
     * -- Diff service relay (origin/v1/diff_relay.proto)
     *
     * Origin API fronts `origin.diff.v1.DiffService` with an opaque bytes
     * envelope: it authorizes, mints the DiffGrant, and relays bytes it never
     * decodes. The five RPCs mirror the service's surface names. Default-off
     * behind a viewer gate and a per-repo kill switch; when not served the
     * envelope says so and the caller takes today's diff RPCs.
     *
     * @generated from rpc origin.v1.OriginService.GetDiffListing
     */
    getDiffListing: {
      name: "GetDiffListing",
      I: GetDiffListingClientRequest,
      O: OriginDiffEnvelope,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc origin.v1.OriginService.StreamDiffFiles
     */
    streamDiffFiles: {
      name: "StreamDiffFiles",
      I: StreamDiffFilesClientRequest,
      O: OriginDiffEnvelope,
      kind: MethodKind.ServerStreaming
    },
    /**
     * @generated from rpc origin.v1.OriginService.GetDiffFile
     */
    getDiffFile: {
      name: "GetDiffFile",
      I: GetDiffFileClientRequest,
      O: OriginDiffEnvelope,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc origin.v1.OriginService.GetDiffEngineInfo
     */
    getDiffEngineInfo: {
      name: "GetDiffEngineInfo",
      I: GetDiffEngineInfoClientRequest,
      O: OriginDiffEnvelope,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc origin.v1.OriginService.PortAnchors
     */
    portAnchors: {
      name: "PortAnchors",
      I: PortAnchorsClientRequest,
      O: OriginDiffEnvelope,
      kind: MethodKind.Unary
    },
    /**
     * -- Changes
     *
     * @generated from rpc origin.v1.OriginService.CreateChange
     */
    createChange: {
      name: "CreateChange",
      I: CreateChangeRequest,
      O: CreateChangeResponse,
      kind: MethodKind.Unary
    },
    /**
     * Privileged one-off import of a GitHub pull request into an inbound
     * (GitHub-sourced) mirror repo. See pull_request_import.proto.
     *
     * @generated from rpc origin.v1.OriginService.ImportGithubPullRequest
     */
    importGithubPullRequest: {
      name: "ImportGithubPullRequest",
      I: ImportGithubPullRequestRequest,
      O: ImportGithubPullRequestResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc origin.v1.OriginService.UpdateChange
     */
    updateChange: {
      name: "UpdateChange",
      I: UpdateChangeRequest,
      O: UpdateChangeResponse,
      kind: MethodKind.Unary
    },
    /**
     * Brings the change's head branch up to date with its base branch by
     * writing a merge commit to the head ref (GitHub's "Update branch").
     * Unstacked draft/open changes only.
     *
     * @generated from rpc origin.v1.OriginService.UpdateChangeBranch
     */
    updateChangeBranch: {
      name: "UpdateChangeBranch",
      I: UpdateChangeBranchRequest,
      O: UpdateChangeBranchResponse,
      kind: MethodKind.Unary
    },
    /**
     * Deletes a merged/closed change's head branch (GitHub's "Delete branch").
     *
     * @generated from rpc origin.v1.OriginService.DeleteChangeHeadBranch
     */
    deleteChangeHeadBranch: {
      name: "DeleteChangeHeadBranch",
      I: DeleteChangeHeadBranchRequest,
      O: DeleteChangeHeadBranchResponse,
      kind: MethodKind.Unary
    },
    /**
     * Re-creates a merged/closed change's head branch (GitHub's "Restore branch").
     *
     * @generated from rpc origin.v1.OriginService.RestorePullRequestBranch
     */
    restorePullRequestBranch: {
      name: "RestorePullRequestBranch",
      I: RestorePullRequestBranchRequest,
      O: RestorePullRequestBranchResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc origin.v1.OriginService.RetargetChange
     */
    retargetChange: {
      name: "RetargetChange",
      I: RetargetChangeRequest,
      O: RetargetChangeResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc origin.v1.OriginService.FoldChange
     */
    foldChange: {
      name: "FoldChange",
      I: FoldChangeRequest,
      O: FoldChangeResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc origin.v1.OriginService.SplitChangeIntoStack
     */
    splitChangeIntoStack: {
      name: "SplitChangeIntoStack",
      I: SplitChangeIntoStackRequest,
      O: SplitChangeIntoStackResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc origin.v1.OriginService.UpdateChangeMetadata
     */
    updateChangeMetadata: {
      name: "UpdateChangeMetadata",
      I: UpdateChangeMetadataRequest,
      O: UpdateChangeMetadataResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc origin.v1.OriginService.UpdateChangeStatus
     */
    updateChangeStatus: {
      name: "UpdateChangeStatus",
      I: UpdateChangeStatusRequest,
      O: UpdateChangeStatusResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc origin.v1.OriginService.CreateReview
     */
    createReview: {
      name: "CreateReview",
      I: CreateReviewRequest,
      O: CreateReviewResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc origin.v1.OriginService.UpdateReview
     */
    updateReview: {
      name: "UpdateReview",
      I: UpdateReviewRequest,
      O: UpdateReviewResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc origin.v1.OriginService.DismissReview
     */
    dismissReview: {
      name: "DismissReview",
      I: DismissReviewRequest,
      O: DismissReviewResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc origin.v1.OriginService.ListReviews
     */
    listReviews: {
      name: "ListReviews",
      I: ListReviewsRequest,
      O: ListReviewsResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc origin.v1.OriginService.ListChangeTimelineEvents
     */
    listChangeTimelineEvents: {
      name: "ListChangeTimelineEvents",
      I: ListChangeTimelineEventsRequest,
      O: ListChangeTimelineEventsResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc origin.v1.OriginService.StartReview
     */
    startReview: {
      name: "StartReview",
      I: StartReviewRequest,
      O: StartReviewResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc origin.v1.OriginService.SubmitReview
     */
    submitReview: {
      name: "SubmitReview",
      I: SubmitReviewRequest,
      O: SubmitReviewResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc origin.v1.OriginService.DiscardPendingReview
     */
    discardPendingReview: {
      name: "DiscardPendingReview",
      I: DiscardPendingReviewRequest,
      O: DiscardPendingReviewResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc origin.v1.OriginService.GetPendingReview
     */
    getPendingReview: {
      name: "GetPendingReview",
      I: GetPendingReviewRequest,
      O: GetPendingReviewResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc origin.v1.OriginService.RequestReview
     */
    requestReview: {
      name: "RequestReview",
      I: RequestReviewRequest,
      O: RequestReviewResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc origin.v1.OriginService.ApplyReviewRequestChanges
     */
    applyReviewRequestChanges: {
      name: "ApplyReviewRequestChanges",
      I: ApplyReviewRequestChangesRequest,
      O: ApplyReviewRequestChangesResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc origin.v1.OriginService.RequestReviews
     */
    requestReviews: {
      name: "RequestReviews",
      I: RequestReviewsRequest,
      O: RequestReviewsResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc origin.v1.OriginService.CloseReviewRequest
     */
    closeReviewRequest: {
      name: "CloseReviewRequest",
      I: CloseReviewRequestRequest,
      O: CloseReviewRequestResponse,
      kind: MethodKind.Unary
    },
    /**
     * Read the append-only review-request history log (requested / removed
     * events) for a change, for the PR activity timeline.
     *
     * @generated from rpc origin.v1.OriginService.ListReviewRequestEvents
     */
    listReviewRequestEvents: {
      name: "ListReviewRequestEvents",
      I: ListReviewRequestEventsRequest,
      O: ListReviewRequestEventsResponse,
      kind: MethodKind.Unary
    },
    /**
     * Assignee mutations. Independent of review requests; write
     * `ChangeAssignment` rows with `kind = ASSIGNEE`.
     *
     * @generated from rpc origin.v1.OriginService.AddAssignee
     */
    addAssignee: {
      name: "AddAssignee",
      I: AddAssigneeRequest,
      O: AddAssigneeResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc origin.v1.OriginService.RemoveAssignee
     */
    removeAssignee: {
      name: "RemoveAssignee",
      I: RemoveAssigneeRequest,
      O: RemoveAssigneeResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc origin.v1.OriginService.ListOriginRepoReviewerCandidates
     */
    listOriginRepoReviewerCandidates: {
      name: "ListOriginRepoReviewerCandidates",
      I: ListOriginRepoReviewerCandidatesRequest,
      O: ListOriginRepoReviewerCandidatesResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc origin.v1.OriginService.CreateComment
     */
    createComment: {
      name: "CreateComment",
      I: CreateCommentRequest,
      O: CreateCommentResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc origin.v1.OriginService.ListComments
     */
    listComments: {
      name: "ListComments",
      I: ListCommentsRequest,
      O: ListCommentsResponse,
      kind: MethodKind.Unary
    },
    /**
     * -- Comment Threads
     * Thread-aware comment RPCs. Coexist with `CreateComment` / `ListComments`
     * (which keep working on top of thread storage). Use these for anchored
     * diff comments, resolution state, and the full thread structure.
     *
     * @generated from rpc origin.v1.OriginService.CreateCommentThread
     */
    createCommentThread: {
      name: "CreateCommentThread",
      I: CreateCommentThreadRequest,
      O: CreateCommentThreadResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc origin.v1.OriginService.ListCommentThreads
     */
    listCommentThreads: {
      name: "ListCommentThreads",
      I: ListCommentThreadsRequest,
      O: ListCommentThreadsResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc origin.v1.OriginService.AddCommentToThread
     */
    addCommentToThread: {
      name: "AddCommentToThread",
      I: AddCommentToThreadRequest,
      O: AddCommentToThreadResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc origin.v1.OriginService.ResolveCommentThread
     */
    resolveCommentThread: {
      name: "ResolveCommentThread",
      I: ResolveCommentThreadRequest,
      O: ResolveCommentThreadResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc origin.v1.OriginService.ReopenCommentThread
     */
    reopenCommentThread: {
      name: "ReopenCommentThread",
      I: ReopenCommentThreadRequest,
      O: ReopenCommentThreadResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc origin.v1.OriginService.UpdateComment
     */
    updateComment: {
      name: "UpdateComment",
      I: UpdateCommentRequest,
      O: UpdateCommentResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc origin.v1.OriginService.DeleteComment
     */
    deleteComment: {
      name: "DeleteComment",
      I: DeleteCommentRequest,
      O: DeleteCommentResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc origin.v1.OriginService.SetCommentReaction
     */
    setCommentReaction: {
      name: "SetCommentReaction",
      I: SetCommentReactionRequest,
      O: SetCommentReactionResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc origin.v1.OriginService.ListCommentReactions
     */
    listCommentReactions: {
      name: "ListCommentReactions",
      I: ListCommentReactionsRequest,
      O: ListCommentReactionsResponse,
      kind: MethodKind.Unary
    },
    /**
     * -- File Viewed State
     *
     * @generated from rpc origin.v1.OriginService.MarkFileAsViewed
     */
    markFileAsViewed: {
      name: "MarkFileAsViewed",
      I: MarkFileAsViewedRequest,
      O: MarkFileAsViewedResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc origin.v1.OriginService.UnmarkFileAsViewed
     */
    unmarkFileAsViewed: {
      name: "UnmarkFileAsViewed",
      I: UnmarkFileAsViewedRequest,
      O: UnmarkFileAsViewedResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc origin.v1.OriginService.MarkDirectoryAsViewed
     */
    markDirectoryAsViewed: {
      name: "MarkDirectoryAsViewed",
      I: MarkDirectoryAsViewedRequest,
      O: MarkDirectoryAsViewedResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc origin.v1.OriginService.MarkAllFilesAsViewed
     */
    markAllFilesAsViewed: {
      name: "MarkAllFilesAsViewed",
      I: MarkAllFilesAsViewedRequest,
      O: MarkAllFilesAsViewedResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc origin.v1.OriginService.UnmarkAllFilesAsViewed
     */
    unmarkAllFilesAsViewed: {
      name: "UnmarkAllFilesAsViewed",
      I: UnmarkAllFilesAsViewedRequest,
      O: UnmarkAllFilesAsViewedResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc origin.v1.OriginService.ListFileViewedStates
     */
    listFileViewedStates: {
      name: "ListFileViewedStates",
      I: ListFileViewedStatesRequest,
      O: ListFileViewedStatesResponse,
      kind: MethodKind.Unary
    },
    /**
     * -- Pull Request Viewed State
     *
     * @generated from rpc origin.v1.OriginService.MarkPullRequestAsViewed
     */
    markPullRequestAsViewed: {
      name: "MarkPullRequestAsViewed",
      I: MarkPullRequestAsViewedRequest,
      O: MarkPullRequestAsViewedResponse,
      kind: MethodKind.Unary
    },
    /**
     * -- Generated Code Tours
     *
     * @generated from rpc origin.v1.OriginService.GetGeneratedCodeTour
     */
    getGeneratedCodeTour: {
      name: "GetGeneratedCodeTour",
      I: GetGeneratedCodeTourRequest,
      O: GetGeneratedCodeTourResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc origin.v1.OriginService.UpsertGeneratedCodeTour
     */
    upsertGeneratedCodeTour: {
      name: "UpsertGeneratedCodeTour",
      I: UpsertGeneratedCodeTourRequest,
      O: UpsertGeneratedCodeTourResponse,
      kind: MethodKind.Unary
    },
    /**
     * -- Merge When Ready
     *
     * @generated from rpc origin.v1.OriginService.EnableChangeMergeWhenReady
     */
    enableChangeMergeWhenReady: {
      name: "EnableChangeMergeWhenReady",
      I: EnableChangeMergeWhenReadyRequest,
      O: EnableChangeMergeWhenReadyResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc origin.v1.OriginService.GetChangeMergeWhenReady
     */
    getChangeMergeWhenReady: {
      name: "GetChangeMergeWhenReady",
      I: GetChangeMergeWhenReadyRequest,
      O: GetChangeMergeWhenReadyResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc origin.v1.OriginService.DisableChangeMergeWhenReady
     */
    disableChangeMergeWhenReady: {
      name: "DisableChangeMergeWhenReady",
      I: DisableChangeMergeWhenReadyRequest,
      O: DisableChangeMergeWhenReadyResponse,
      kind: MethodKind.Unary
    },
    /**
     * -- Merge queue (v0). The Merge button on a queue-enabled repo lands here
     * instead of MergeStack (D15); the queue lands the pull request later.
     *
     * @generated from rpc origin.v1.OriginService.EnqueueForMerge
     */
    enqueueForMerge: {
      name: "EnqueueForMerge",
      I: EnqueueForMergeRequest,
      O: EnqueueForMergeResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc origin.v1.OriginService.CancelMergeQueueEntry
     */
    cancelMergeQueueEntry: {
      name: "CancelMergeQueueEntry",
      I: CancelMergeQueueEntryRequest,
      O: CancelMergeQueueEntryResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc origin.v1.OriginService.GetMergeQueueStatus
     */
    getMergeQueueStatus: {
      name: "GetMergeQueueStatus",
      I: GetMergeQueueStatusRequest,
      O: GetMergeQueueStatusResponse,
      kind: MethodKind.Unary
    },
    /**
     * The whole queue for one target ref: live entries in order, every node
     * with its tested commit, the ledger. What a queue page and the traffic
     * run's live oracle read.
     *
     * @generated from rpc origin.v1.OriginService.GetMergeQueue
     */
    getMergeQueue: {
      name: "GetMergeQueue",
      I: GetMergeQueueRequest,
      O: GetMergeQueueResponse,
      kind: MethodKind.Unary
    },
    /**
     * Repository-admin configuration of a queue (repository:settings). Each
     * also requires the repository's merge-queue rollout gate; a queue row
     * exists only because one of these (or the operator's internal lever)
     * wrote it.
     *
     * @generated from rpc origin.v1.OriginService.GetMergeQueueConfig
     */
    getMergeQueueConfig: {
      name: "GetMergeQueueConfig",
      I: GetMergeQueueConfigRequest,
      O: GetMergeQueueConfigResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc origin.v1.OriginService.EnableMergeQueue
     */
    enableMergeQueue: {
      name: "EnableMergeQueue",
      I: EnableMergeQueueRequest,
      O: EnableMergeQueueResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc origin.v1.OriginService.DisableMergeQueue
     */
    disableMergeQueue: {
      name: "DisableMergeQueue",
      I: DisableMergeQueueRequest,
      O: DisableMergeQueueResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc origin.v1.OriginService.UpdateMergeQueueConfig
     */
    updateMergeQueueConfig: {
      name: "UpdateMergeQueueConfig",
      I: UpdateMergeQueueConfigRequest,
      O: UpdateMergeQueueConfigResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc origin.v1.OriginService.GetChange
     */
    getChange: {
      name: "GetChange",
      I: GetChangeRequest,
      O: GetChangeResponse,
      kind: MethodKind.Unary
    },
    /**
     * Used by portal-side Origin review assembly. Owned by Origin.
     *
     * @generated from rpc origin.v1.OriginService.GetChangeCodeownersApplication
     */
    getChangeCodeownersApplication: {
      name: "GetChangeCodeownersApplication",
      I: GetChangeCodeownersApplicationRequest,
      O: GetChangeCodeownersApplicationResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc origin.v1.OriginService.GetProjectedLatestVersions
     */
    getProjectedLatestVersions: {
      name: "GetProjectedLatestVersions",
      I: GetProjectedLatestVersionsRequest,
      O: GetProjectedLatestVersionsResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc origin.v1.OriginService.GetChangeStackPageData
     */
    getChangeStackPageData: {
      name: "GetChangeStackPageData",
      I: GetChangeStackPageDataRequest,
      O: GetChangeStackPageDataResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc origin.v1.OriginService.GetChangeStack
     */
    getChangeStack: {
      name: "GetChangeStack",
      I: GetChangeStackRequest,
      O: GetChangeStackResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc origin.v1.OriginService.ListChangeCommits
     */
    listChangeCommits: {
      name: "ListChangeCommits",
      I: ListChangeCommitsRequest,
      O: ListChangeCommitsResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc origin.v1.OriginService.ListChanges
     */
    listChanges: {
      name: "ListChanges",
      I: ListChangesRequest,
      O: ListChangesResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc origin.v1.OriginService.ListChangesByHeadRef
     */
    listChangesByHeadRef: {
      name: "ListChangesByHeadRef",
      I: ListChangesByHeadRefRequest,
      O: ListChangesByHeadRefResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc origin.v1.OriginService.GetCommitReferences
     */
    getCommitReferences: {
      name: "GetCommitReferences",
      I: GetCommitReferencesRequest,
      O: GetCommitReferencesResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc origin.v1.OriginService.BatchGetChanges
     */
    batchGetChanges: {
      name: "BatchGetChanges",
      I: BatchGetChangesRequest,
      O: BatchGetChangesResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc origin.v1.OriginService.GetSectionOfChanges
     */
    getSectionOfChanges: {
      name: "GetSectionOfChanges",
      I: GetSectionOfChangesRequest,
      O: GetSectionOfChangesResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc origin.v1.OriginService.CountSectionsOfChanges
     */
    countSectionsOfChanges: {
      name: "CountSectionsOfChanges",
      I: CountSectionsOfChangesRequest,
      O: CountSectionsOfChangesResponse,
      kind: MethodKind.Unary
    },
    /**
     * -- CI
     *
     * @generated from rpc origin.v1.OriginService.GetCiState
     */
    getCiState: {
      name: "GetCiState",
      I: GetCiStateRequest,
      O: GetCiStateResponse,
      kind: MethodKind.Unary
    },
    /**
     * GitHub-style per-commit rollup of the current check runs for many
     * commits in one round-trip, for list surfaces that draw one status glyph
     * per commit row (the commits page, the tree history sidebar, a merged
     * PR's merge commit). SHA-scoped repo-level checks read, like GetCiState's
     * `sha` arm; carries no change context, so nothing is judged required.
     *
     * @generated from rpc origin.v1.OriginService.BatchGetCommitCheckRollups
     */
    batchGetCommitCheckRollups: {
      name: "BatchGetCommitCheckRollups",
      I: BatchGetCommitCheckRollupsRequest,
      O: BatchGetCommitCheckRollupsResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc origin.v1.OriginService.GetCheckRun
     */
    getCheckRun: {
      name: "GetCheckRun",
      I: GetCheckRunRequest,
      O: GetCheckRunResponse,
      kind: MethodKind.Unary
    },
    /**
     * Lists the distinct check identities (actor + suite key) observed on the
     * repo recently — the coordinates a `require_status_checks` ruleset rule
     * targets. Backs the required-checks picker in repo settings.
     *
     * @generated from rpc origin.v1.OriginService.ListRepoCheckSources
     */
    listRepoCheckSources: {
      name: "ListRepoCheckSources",
      I: ListRepoCheckSourcesRequest,
      O: ListRepoCheckSourcesResponse,
      kind: MethodKind.Unary
    },
    /**
     * Upserts a check-run (and its group) for an integration installation.
     * Connect equivalent of `POST /api/v0/repos/:owner/:repo/check-runs`.
     *
     * @generated from rpc origin.v1.OriginService.PostCheckRun
     */
    postCheckRun: {
      name: "PostCheckRun",
      I: PostCheckRunRequest,
      O: PostCheckRunResponse,
      kind: MethodKind.Unary
    },
    /**
     * Appends 1-25 annotations to a check run, up to 100 durable annotations per
     * run. Like GitHub's output.annotations batch, the request is all-or-nothing;
     * unlike GitHub, this dedicated operation is append-only and is not
     * request-idempotent, so retrying an ambiguously failed call may append the
     * batch again.
     *
     * @generated from rpc origin.v1.OriginService.CreateCheckRunAnnotations
     */
    createCheckRunAnnotations: {
      name: "CreateCheckRunAnnotations",
      I: CreateCheckRunAnnotationsRequest,
      O: CreateCheckRunAnnotationsResponse,
      kind: MethodKind.Unary
    },
    /**
     * Lists append-only check annotations in ascending id order. Annotation ids
     * are time-sortable TypeIDs. Pagination uses an opaque token; page_size
     * defaults to 30 and is capped at 100. This is the Origin counterpart to
     * reading the annotations attached to a GitHub check run, with Origin's
     * explicit nested optional location shape.
     *
     * @generated from rpc origin.v1.OriginService.ListCheckRunAnnotations
     */
    listCheckRunAnnotations: {
      name: "ListCheckRunAnnotations",
      I: ListCheckRunAnnotationsRequest,
      O: ListCheckRunAnnotationsResponse,
      kind: MethodKind.Unary
    },
    /**
     * Asks the owning app to run a terminal re-requestable check again on the
     * change's current head. Stamps the re-request on the attempt row and
     * emits `repository.check_run.rerequested` to the owner installation.
     * Rejected for queued/in-progress runs, superseded attempts,
     * non-re-requestable runs, and attempts already re-requested (each
     * attempt is re-requestable exactly once).
     *
     * @generated from rpc origin.v1.OriginService.RerequestCheckRun
     */
    rerequestCheckRun: {
      name: "RerequestCheckRun",
      I: RerequestCheckRunRequest,
      O: RerequestCheckRunResponse,
      kind: MethodKind.Unary
    },
    /**
     * Aggregate "is this changeset ready to merge?" check. Combines CI
     * (latest CheckRunGroup per `(owner actor, key)` on the latest version's
     * head SHA), branch-level merge conflict detection (git-forge
     * `CanMerge`), and reviews (>=1 `approve` verdict on the latest
     * version). Returns the individual signals so callers can render
     * useful UI even when the aggregate is `false`.
     *
     * @generated from rpc origin.v1.OriginService.GetChangesetMergeability
     */
    getChangesetMergeability: {
      name: "GetChangesetMergeability",
      I: GetChangesetMergeabilityRequest,
      O: GetChangesetMergeabilityResponse,
      kind: MethodKind.Unary
    },
    /**
     * Atomic merge of an Origin stack identified by its top change. Standalone
     * changes are treated as a singleton stack, so this is the default merge
     * endpoint. Loads the root-to-target prefix, re-validates per-change
     * mergeability and that the top head contains every downstack head as a
     * git ancestor, then lands a single merge commit on trunk and marks every
     * member `merged` with that same merge commit OID. Idempotent on retry
     * when the top is already merged with a recorded SHA; rejects when prefix
     * members are out of `open` (operators must reconcile partial state
     * manually).
     *
     * @generated from rpc origin.v1.OriginService.MergeStack
     */
    mergeStack: {
      name: "MergeStack",
      I: MergeStackRequest,
      O: MergeStackResponse,
      kind: MethodKind.Unary
    },
    /**
     * Create a revert pull request for a merged pull request on a native or
     * outbound-mirrored repo: publishes a revert of the pull request's merge
     * commit on a new deterministic branch (`revert-<number>-<head>`, or
     * `revert-landing-<merge-sha prefix>` for a stack landing), then opens a
     * pull request for it. Reverting a member of an atomic stack landing undoes
     * the whole landing; that requires consent via `allow_stack_landing_revert`
     * and yields one landing-wide revert pull request that sibling calls
     * converge on. Idempotent: when an open pull request for that revert branch
     * already exists, returns it. Inbound-mirrored repos are rejected — GitHub
     * owns reverts there.
     *
     * @generated from rpc origin.v1.OriginService.RevertPullRequest
     */
    revertPullRequest: {
      name: "RevertPullRequest",
      I: RevertPullRequestRequest,
      O: RevertPullRequestResponse,
      kind: MethodKind.Unary
    },
    /**
     * Atomic restack of an Origin stack identified by its top change. All-or-nothing: either every
     * head ref moves in one forge transaction, or none do.
     *
     * @generated from rpc origin.v1.OriginService.RestackStack
     */
    restackStack: {
      name: "RestackStack",
      I: RestackStackRequest,
      O: RestackStackResponse,
      kind: MethodKind.Unary
    },
    /**
     * -- Apps
     *
     * @generated from rpc origin.v1.OriginService.GetApp
     */
    getApp: {
      name: "GetApp",
      I: GetAppRequest,
      O: GetAppResponse,
      kind: MethodKind.Unary
    },
    /**
     * Registers a new app owned by the request's namespace. Apps are always
     * created private; visibility is managed through the trusted internal API.
     * The caller generates the app signing key pair and supplies only the
     * public key.
     *
     * @generated from rpc origin.v1.OriginService.CreateApp
     */
    createApp: {
      name: "CreateApp",
      I: CreateAppRequest,
      O: CreateAppResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc origin.v1.OriginService.AddAppSigningKey
     */
    addAppSigningKey: {
      name: "AddAppSigningKey",
      I: AddAppSigningKeyRequest,
      O: AddAppSigningKeyResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc origin.v1.OriginService.RevokeAppSigningKey
     */
    revokeAppSigningKey: {
      name: "RevokeAppSigningKey",
      I: RevokeAppSigningKeyRequest,
      O: RevokeAppSigningKeyResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc origin.v1.OriginService.GetAppMetadata
     */
    getAppMetadata: {
      name: "GetAppMetadata",
      I: GetAppMetadataRequest,
      O: GetAppMetadataResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc origin.v1.OriginService.ListNamespaceApps
     */
    listNamespaceApps: {
      name: "ListNamespaceApps",
      I: ListNamespaceAppsRequest,
      O: ListNamespaceAppsResponse,
      kind: MethodKind.Unary
    },
    /**
     * Public marketplace catalog. Returns only public apps that have declared
     * default scopes. No per-caller Origin resource to authorize against.
     *
     * @generated from rpc origin.v1.OriginService.ListPublicApps
     */
    listPublicApps: {
      name: "ListPublicApps",
      I: ListPublicAppsRequest,
      O: ListPublicAppsResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc origin.v1.OriginService.CreateInstallation
     */
    createInstallation: {
      name: "CreateInstallation",
      I: CreateInstallationRequest,
      O: CreateInstallationResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc origin.v1.OriginService.GetInstallation
     */
    getInstallation: {
      name: "GetInstallation",
      I: GetInstallationRequest,
      O: GetInstallationResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc origin.v1.OriginService.ListNamespaceInstallations
     */
    listNamespaceInstallations: {
      name: "ListNamespaceInstallations",
      I: ListNamespaceInstallationsRequest,
      O: ListNamespaceInstallationsResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc origin.v1.OriginService.ListRepoInstallations
     */
    listRepoInstallations: {
      name: "ListRepoInstallations",
      I: ListRepoInstallationsRequest,
      O: ListRepoInstallationsResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc origin.v1.OriginService.UpdateApp
     */
    updateApp: {
      name: "UpdateApp",
      I: UpdateAppRequest,
      O: UpdateAppResponse,
      kind: MethodKind.Unary
    },
    /**
     * Pauses or resumes the app's outbound webhook delivery without touching
     * its webhook configuration. Resume also clears an automatic
     * failure-driven pause.
     *
     * @generated from rpc origin.v1.OriginService.SetAppWebhookDeliveryEnabled
     */
    setAppWebhookDeliveryEnabled: {
      name: "SetAppWebhookDeliveryEnabled",
      I: SetAppWebhookDeliveryEnabledRequest,
      O: SetAppWebhookDeliveryEnabledResponse,
      kind: MethodKind.Unary
    },
    /**
     * Sends a synchronous signed test delivery (event type `ping`) to the
     * app's webhook URL and reports the receiver outcome. Works while
     * delivery is paused: it is how a publisher verifies a fix before
     * resuming.
     *
     * @generated from rpc origin.v1.OriginService.SendAppWebhookTestDelivery
     */
    sendAppWebhookTestDelivery: {
      name: "SendAppWebhookTestDelivery",
      I: SendAppWebhookTestDeliveryRequest,
      O: SendAppWebhookTestDeliveryResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc origin.v1.OriginService.DeleteApp
     */
    deleteApp: {
      name: "DeleteApp",
      I: DeleteAppRequest,
      O: DeleteAppResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc origin.v1.OriginService.SetAppIcon
     */
    setAppIcon: {
      name: "SetAppIcon",
      I: SetAppIconRequest,
      O: SetAppIconResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc origin.v1.OriginService.DeleteInstallation
     */
    deleteInstallation: {
      name: "DeleteInstallation",
      I: DeleteInstallationRequest,
      O: DeleteInstallationResponse,
      kind: MethodKind.Unary
    },
    /**
     * Suspends an installation in its namespace: it stays configured but stops
     * receiving access until unsuspended. Idempotent when already suspended.
     *
     * @generated from rpc origin.v1.OriginService.SuspendInstallation
     */
    suspendInstallation: {
      name: "SuspendInstallation",
      I: SuspendInstallationRequest,
      O: SuspendInstallationResponse,
      kind: MethodKind.Unary
    },
    /**
     * Restores a suspended installation to the active state. Idempotent when
     * already active.
     *
     * @generated from rpc origin.v1.OriginService.UnsuspendInstallation
     */
    unsuspendInstallation: {
      name: "UnsuspendInstallation",
      I: UnsuspendInstallationRequest,
      O: UnsuspendInstallationResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc origin.v1.OriginService.ListReposForAppInstall
     */
    listReposForAppInstall: {
      name: "ListReposForAppInstall",
      I: ListReposForAppInstallRequest,
      O: ListHostedReposResponse,
      kind: MethodKind.Unary
    },
    /**
     * Reads the data a consent page needs to render an app-install authorization
     * request. Approval reuses CreateInstallation.
     *
     * @generated from rpc origin.v1.OriginService.PreviewAppInstallation
     */
    previewAppInstallation: {
      name: "PreviewAppInstallation",
      I: PreviewAppInstallationRequest,
      O: PreviewAppInstallationResponse,
      kind: MethodKind.Unary
    },
    /**
     * Records a human member's duplicate-safe ask to install an app.
     *
     * @generated from rpc origin.v1.OriginService.RequestAppInstall
     */
    requestAppInstall: {
      name: "RequestAppInstall",
      I: RequestAppInstallRequest,
      O: RequestAppInstallResponse,
      kind: MethodKind.Unary
    },
    /**
     * Whether the caller has a pending request for one app.
     *
     * @generated from rpc origin.v1.OriginService.GetMyAppInstallRequest
     */
    getMyAppInstallRequest: {
      name: "GetMyAppInstallRequest",
      I: GetMyAppInstallRequestRequest,
      O: GetMyAppInstallRequestResponse,
      kind: MethodKind.Unary
    },
    /**
     * Idempotently withdraws the caller's pending request for one app.
     *
     * @generated from rpc origin.v1.OriginService.CancelMyAppInstallRequest
     */
    cancelMyAppInstallRequest: {
      name: "CancelMyAppInstallRequest",
      I: CancelMyAppInstallRequestRequest,
      O: CancelMyAppInstallRequestResponse,
      kind: MethodKind.Unary
    },
    /**
     * Lists app-install requests for namespace admins.
     *
     * @generated from rpc origin.v1.OriginService.ListAppInstallRequests
     */
    listAppInstallRequests: {
      name: "ListAppInstallRequests",
      I: ListAppInstallRequestsRequest,
      O: ListAppInstallRequestsResponse,
      kind: MethodKind.Unary
    },
    /**
     * Denies every pending request for one app in the namespace.
     *
     * @generated from rpc origin.v1.OriginService.DenyAppInstallRequests
     */
    denyAppInstallRequests: {
      name: "DenyAppInstallRequests",
      I: DenyAppInstallRequestsRequest,
      O: DenyAppInstallRequestsResponse,
      kind: MethodKind.Unary
    },
    /**
     * -- Atlas
     * Generated per-directory codebase maps. Reads serve whatever the
     * `origin-atlas` Temporal queue has already generated; the only rpcs that
     * start generation are RefreshAtlasRepo and a layer being newly enabled.
     *
     * @generated from rpc origin.v1.OriginService.GetAtlasNode
     */
    getAtlasNode: {
      name: "GetAtlasNode",
      I: GetAtlasNodeRequest,
      O: GetAtlasNodeResponse,
      kind: MethodKind.Unary
    },
    /**
     * Which directories have generated Atlas content, so a read surface can
     * annotate a whole tree in one request instead of probing per directory.
     *
     * @generated from rpc origin.v1.OriginService.ListAtlasNodePaths
     */
    listAtlasNodePaths: {
      name: "ListAtlasNodePaths",
      I: ListAtlasNodePathsRequest,
      O: ListAtlasNodePathsResponse,
      kind: MethodKind.Unary
    },
    /**
     * Admin surface: per-layer enablement and generation progress for a repo.
     *
     * @generated from rpc origin.v1.OriginService.GetAtlasRepoStatus
     */
    getAtlasRepoStatus: {
      name: "GetAtlasRepoStatus",
      I: GetAtlasRepoStatusRequest,
      O: GetAtlasRepoStatusResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc origin.v1.OriginService.SetAtlasRepoConfig
     */
    setAtlasRepoConfig: {
      name: "SetAtlasRepoConfig",
      I: SetAtlasRepoConfigRequest,
      O: SetAtlasRepoConfigResponse,
      kind: MethodKind.Unary
    },
    /**
     * Regenerates whatever has drifted since the last run, against the current
     * default-branch head. This is what makes the `manual` freshness preset a
     * complete choice rather than a way to freeze a repo's map forever.
     *
     * @generated from rpc origin.v1.OriginService.RefreshAtlasRepo
     */
    refreshAtlasRepo: {
      name: "RefreshAtlasRepo",
      I: RefreshAtlasRepoRequest,
      O: RefreshAtlasRepoResponse,
      kind: MethodKind.Unary
    },
    /**
     * -- Rulesets
     * Merge-time rulesets stored in the Origin DB. These govern changeset
     * mergeability (distinct from git-httpd push-rules snapshots).
     *
     * @generated from rpc origin.v1.OriginService.ListRulesets
     */
    listRulesets: {
      name: "ListRulesets",
      I: ListRulesetsRequest,
      O: ListRulesetsResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc origin.v1.OriginService.GetRuleset
     */
    getRuleset: {
      name: "GetRuleset",
      I: GetRulesetRequest,
      O: GetRulesetResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc origin.v1.OriginService.UpsertRuleset
     */
    upsertRuleset: {
      name: "UpsertRuleset",
      I: UpsertRulesetRequest,
      O: UpsertRulesetResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc origin.v1.OriginService.DeleteRuleset
     */
    deleteRuleset: {
      name: "DeleteRuleset",
      I: DeleteRulesetRequest,
      O: DeleteRulesetResponse,
      kind: MethodKind.Unary
    },
    /**
     * -- Labels
     *
     * @generated from rpc origin.v1.OriginService.CreateLabel
     */
    createLabel: {
      name: "CreateLabel",
      I: CreateLabelRequest,
      O: CreateLabelResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc origin.v1.OriginService.UpdateLabel
     */
    updateLabel: {
      name: "UpdateLabel",
      I: UpdateLabelRequest,
      O: UpdateLabelResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc origin.v1.OriginService.DeleteLabel
     */
    deleteLabel: {
      name: "DeleteLabel",
      I: DeleteLabelRequest,
      O: DeleteLabelResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc origin.v1.OriginService.ListLabels
     */
    listLabels: {
      name: "ListLabels",
      I: ListLabelsRequest,
      O: ListLabelsResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc origin.v1.OriginService.GetLabelByName
     */
    getLabelByName: {
      name: "GetLabelByName",
      I: GetLabelByNameRequest,
      O: GetLabelByNameResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc origin.v1.OriginService.AddLabelToChange
     */
    addLabelToChange: {
      name: "AddLabelToChange",
      I: AddLabelToChangeRequest,
      O: AddLabelToChangeResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc origin.v1.OriginService.RemoveLabelFromChange
     */
    removeLabelFromChange: {
      name: "RemoveLabelFromChange",
      I: RemoveLabelFromChangeRequest,
      O: RemoveLabelFromChangeResponse,
      kind: MethodKind.Unary
    },
    /**
     * -- Access preflights
     *
     * @generated from rpc origin.v1.OriginService.CheckChangeCreationAccess
     */
    checkChangeCreationAccess: {
      name: "CheckChangeCreationAccess",
      I: CheckChangeCreationAccessRequest,
      O: CheckChangeCreationAccessResponse,
      kind: MethodKind.Unary
    },
    /**
     * -- Sync protocol
     * PROTOTYPE: general server-streaming sync watch for one change. Emits a
     * bootstrap snapshot then the change's sequenced sync-event envelopes for
     * its current head (PR lifecycle + CI), switching SHA streams when the head
     * moves; heartbeats keep long idle waits alive. Connect equivalent of the
     * prototype SSE stream; clients fold envelopes by (streamKind, streamKey,
     * seq) and repair gaps via a snapshot read. Repository-read scoped.
     *
     * @generated from rpc origin.v1.OriginService.WatchChangeSyncEvents
     */
    watchChangeSyncEvents: {
      name: "WatchChangeSyncEvents",
      I: WatchChangeSyncEventsRequest,
      O: WatchChangeSyncEventsResponse,
      kind: MethodKind.ServerStreaming
    },
    /**
     * Unary read of the same authoritative bootstrap snapshot emitted first by
     * WatchChangeSyncEvents. Performs no live-event subscription.
     *
     * @generated from rpc origin.v1.OriginService.GetChangeSyncSnapshot
     */
    getChangeSyncSnapshot: {
      name: "GetChangeSyncSnapshot",
      I: GetChangeSyncSnapshotRequest,
      O: GetChangeSyncSnapshotResponse,
      kind: MethodKind.Unary
    },
    /**
     * V2 multiplexed sync watch: one hanging connection for many changes.
     * First frame carries a server-minted connection_id; subsequent frames are
     * tagged snapshots/events, heartbeats, nacks, or removal acks. Initial
     * subscriptions may be empty. Mutate the set with
     * UpdateWatchChangeSyncSubscriptions.
     *
     * @generated from rpc origin.v1.OriginService.WatchChangeSyncEventsV2
     */
    watchChangeSyncEventsV2: {
      name: "WatchChangeSyncEventsV2",
      I: WatchChangeSyncEventsV2Request,
      O: WatchChangeSyncEventsV2Response,
      kind: MethodKind.ServerStreaming
    },
    /**
     * Enqueue add/remove for a V2 watch connection. Fire-and-forget: returns
     * after writing the control-stream command. Per-PR authz and same-principal
     * checks run in the hanging handler.
     *
     * @generated from rpc origin.v1.OriginService.UpdateWatchChangeSyncSubscriptions
     */
    updateWatchChangeSyncSubscriptions: {
      name: "UpdateWatchChangeSyncSubscriptions",
      I: UpdateWatchChangeSyncSubscriptionsRequest,
      O: UpdateWatchChangeSyncSubscriptionsResponse,
      kind: MethodKind.Unary
    },
    /**
     * Atomically move an existing branch to an existing descendant commit.
     * Rejected when push-time rules would block a direct update.
     *
     * @generated from rpc origin.v1.OriginService.FastForwardBranch
     */
    fastForwardBranch: {
      name: "FastForwardBranch",
      I: FastForwardBranchClientRequest,
      O: FastForwardBranchClientResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc origin.v1.OriginService.ListRepoExternalCollaborators
     */
    listRepoExternalCollaborators: {
      name: "ListRepoExternalCollaborators",
      I: ListRepoExternalCollaboratorsRequest,
      O: ListRepoExternalCollaboratorsResponse,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc origin.v1.OriginService.SetRepoExternalCollaboratorAccess
     */
    setRepoExternalCollaboratorAccess: {
      name: "SetRepoExternalCollaboratorAccess",
      I: SetRepoExternalCollaboratorAccessRequest,
      O: SetRepoExternalCollaboratorAccessResponse,
      kind: MethodKind.Unary
    },
    /**
     * -- App user confirmation
     * Returns the installation, namespace, and authenticated-user identity that
     * an app-user confirmation receipt would disclose.
     *
     * @generated from rpc origin.v1.OriginService.PreviewAppUserConfirmation
     */
    previewAppUserConfirmation: {
      name: "PreviewAppUserConfirmation",
      I: PreviewAppUserConfirmationRequest,
      O: PreviewAppUserConfirmationResponse,
      kind: MethodKind.Unary
    },
    /**
     * Issues identity evidence only after the authenticated user confirms.
     *
     * @generated from rpc origin.v1.OriginService.ConfirmAppUserConfirmation
     */
    confirmAppUserConfirmation: {
      name: "ConfirmAppUserConfirmation",
      I: ConfirmAppUserConfirmationRequest,
      O: ConfirmAppUserConfirmationResponse,
      kind: MethodKind.Unary
    }
  }
};


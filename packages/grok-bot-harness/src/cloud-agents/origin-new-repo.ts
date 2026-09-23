init_esm2();
var ORIGIN_GET_STARTED_URL = "https://cursor.com/codebase/get-started";
function pickOriginNewRepoNamespace(response) {
  for (const entry of response.namespaces) {
    const namespace = entry.namespace?.namespace.trim() ?? "";
    if (entry.namespace !== void 0 && namespace.length > 0 && entry.namespace.ownerType === OriginNamespaceOwnerType.TEAM && entry.accessReason === AuthorizedNamespaceAccessReason.TEAM_OWNERSHIP && entry.namespace.ownerEntityId > BigInt(0)) {
      return { kind: "team", namespace, teamId: entry.namespace.ownerEntityId.toString() };
    }
  }
  for (const entry of response.namespaces) {
    const namespace = entry.namespace?.namespace.trim() ?? "";
    if (namespace.length > 0 && entry.namespace?.ownerType === OriginNamespaceOwnerType.USER && entry.accessReason === AuthorizedNamespaceAccessReason.USER_OWNERSHIP) {
      return { kind: "user", namespace };
    }
  }
  return { kind: "provision_user_namespace" };
}
async function createOriginNewRepo(args) {
  const namespaces = await args.client.getAuthorizedNamespaces(
    new GetAuthorizedNamespacesRequest(),
    args.callOptions(args.selectedTeamId)
  );
  if (namespaces.originDisabledForTeam) {
    throw new SandCloudAgentLaunchError("New Origin projects are not enabled for this account.");
  }
  const target = pickOriginNewRepoNamespace(namespaces);
  if (target.kind === "provision_user_namespace" && !args.canProvisionUserNamespace()) {
    throw new SandCloudAgentLaunchError(
      `Create an Origin namespace before starting a new project: ${ORIGIN_GET_STARTED_URL}`
    );
  }
  const teamId = target.kind === "team" ? target.teamId : void 0;
  const response = await args.client.createRepoAndEnsureUserNamespace(
    new CreateRepoRequest({
      identifier: {
        org: target.kind === "provision_user_namespace" ? "" : target.namespace,
        name: args.name
      },
      repoKind: args.repoKind,
      visibility: args.visibility,
      defaultBranch: args.defaultBranch
    }),
    args.callOptions(teamId)
  ).catch((error42) => {
    throw describeOriginNewRepoRefusal(error42, target) ?? error42;
  });
  const defaultBranch = response.repository?.defaultBranch.trim() || args.defaultBranch;
  const org = response.repository?.identifier?.org.trim() ?? "";
  const name17 = response.repository?.identifier?.name.trim() ?? "";
  if (org.length === 0 || name17.length === 0) {
    throw new SandCloudAgentLaunchError(
      "Origin created the project but did not return its repository."
    );
  }
  return { org, name: name17, defaultBranch, ...teamId === void 0 ? {} : { teamId } };
}
function describeOriginNewRepoRefusal(error42, target) {
  const message = refusalMessage(error42, target.kind === "provision_user_namespace");
  return message === void 0 ? void 0 : new SandCloudAgentLaunchError(`${message}: ${ORIGIN_GET_STARTED_URL}`, { cause: error42 });
}
function refusalMessage(error42, provisioning) {
  if (!(error42 instanceof ConnectError)) {
    return void 0;
  }
  if (error42.code === Code.FailedPrecondition) {
    return provisioning ? "Origin can't set up a personal namespace for this account. Team members need a team Origin namespace (ask a team admin); otherwise check your plan and Privacy Mode, then try again" : "Origin can't create a new project for this account. Check your plan, Privacy Mode, and team Origin settings, then try again";
  }
  if (error42.code === Code.PermissionDenied && provisioning) {
    return "This credential can't set up an Origin namespace. Create one first, then try again";
  }
  return void 0;
}

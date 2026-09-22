/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/grok-bot-harness/src/cloud-agents/cloud-agent-request-composition.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_dist2();
init_agent_pb();
init_requested_model_pb();
init_selected_context_pb();
init_background_composer_pb();
init_dist3();
function buildCloudAgentRequestedModel(modelId, params) {
  const paramsMap = new Map(Object.entries(params ?? {}));
  const trimmedModelId = modelId?.trim();
  const hasModel = trimmedModelId != null && trimmedModelId.length > 0;
  if (!hasModel) {
    if (paramsMap.size > 0) {
      throw new SandCloudAgentLaunchError("'model' is required when 'model_params' are provided.");
    }
    return null;
  }
  return new RequestedModel({
    modelId: trimmedModelId,
    maxMode: true,
    parameters: Array.from(
      paramsMap,
      ([id, value]) => new RequestedModel_ModelParameterValue({ id, value })
    )
  });
}
function buildCloudAgentUserMessage(args) {
  const images = args.images ?? [];
  const files = args.files ?? [];
  return new UserMessage({
    text: args.prompt,
    messageId: args.messageId ?? crypto.randomUUID(),
    ...args.mode != null ? { mode: args.mode } : {},
    ...images.length > 0 || files.length > 0 ? {
      selectedContext: new SelectedContext({
        selectedImages: images.map(
          (image2) => new SelectedImage({
            dataOrBlobId: { case: "data", value: image2.data },
            path: image2.path ?? "",
            mimeType: image2.mimeType ?? ""
          })
        ),
        selectedDocuments: files.filter((file2) => file2.kind === "document").map(
          (file2) => new SelectedDocument({
            dataOrBlobId: { case: "data", value: file2.data },
            filename: file2.filename,
            mimeType: file2.mimeType
          })
        ),
        selectedVideos: files.filter((file2) => file2.kind === "video").map(
          (file2) => new SelectedVideo({
            dataOrBlobId: { case: "data", value: file2.data },
            filename: file2.filename,
            mimeType: file2.mimeType,
            materializeToFilesystem: true
          })
        )
      })
    } : {}
  });
}
function buildCloudAgentConversationAction(userMessage2) {
  return new ConversationAction({
    action: {
      case: "userMessageAction",
      value: new UserMessageAction({
        userMessage: userMessage2,
        sendToInteractionListener: true
      })
    }
  });
}
function trimRemotePath2(pathname) {
  const normalizedPath = pathname.replace(/\/+$/, "").replace(/\.git$/i, "");
  if (!normalizedPath || normalizedPath === "/") {
    return "";
  }
  return normalizedPath.startsWith("/") ? normalizedPath : `/${normalizedPath}`;
}
function toSanitizationCandidate2(rawUrl) {
  const hasScheme = /^[a-z][a-z0-9+.-]*:\/\//i.test(rawUrl);
  if (hasScheme) {
    return rawUrl;
  }
  const httpsCandidate = `https://${rawUrl}`;
  try {
    void new URL(httpsCandidate);
    return httpsCandidate;
  } catch {
    const scpLikeMatch = rawUrl.match(/^([^@/\s]+@)?([^:/\s]+):(.+)$/);
    if (scpLikeMatch) {
      const userInfo = scpLikeMatch[1] ?? "";
      const host = scpLikeMatch[2];
      const path31 = scpLikeMatch[3];
      return `ssh://${userInfo}${host}/${path31}`;
    }
    return httpsCandidate;
  }
}
function sanitizeRemoteUrl2(raw) {
  const rawUrl = raw.trim();
  if (!rawUrl) {
    return "";
  }
  try {
    const parsed2 = new URL(toSanitizationCandidate2(rawUrl));
    return `${parsed2.hostname}${trimRemotePath2(parsed2.pathname)}`.toLowerCase();
  } catch {
    return "";
  }
}
function sanitizeRemoteUrlForHttpUrl2(raw) {
  const rawUrl = raw.trim();
  if (!rawUrl) {
    return "";
  }
  try {
    const parsed2 = new URL(toSanitizationCandidate2(rawUrl));
    const protocol = parsed2.protocol === "http:" || parsed2.protocol === "https:" ? parsed2.protocol : "https:";
    return `${protocol}//${parsed2.host.toLowerCase()}${trimRemotePath2(parsed2.pathname)}`;
  } catch {
    const normalized = sanitizeRemoteUrl2(rawUrl);
    return normalized ? `https://${normalized}` : "";
  }
}
function buildRepoFromRemote(remote, baseBranch) {
  const sanitizedRepoUrl = sanitizeRemoteUrl2(remote);
  const httpRepoUrl = sanitizeRemoteUrlForHttpUrl2(remote);
  if (!sanitizedRepoUrl || !httpRepoUrl) {
    throw new SandCloudAgentLaunchError(
      `The Cursor agent could not parse the repository '${remote}'.`
    );
  }
  return { sanitizedRepoUrl, httpRepoUrl, baseBranch };
}
function rejectBareRepoSlug(requested) {
  if (!isRepoShorthand(requested)) return;
  throw new SandCloudAgentLaunchError(
    `'${requested}' is a bare owner/name and does not name the provider. Pass the full repository URL (for example https://github.com/${requested} or https://gitlab.com/${requested}); if the user only gave a name, look the repository up or ask them where it lives.`
  );
}
function isRepoShorthand(value) {
  return /^[A-Za-z0-9][A-Za-z0-9._-]*\/[A-Za-z0-9][A-Za-z0-9._-]*$/.test(value);
}
function describeSavedEnvironment(environment) {
  const name17 = environment.name.trim();
  return name17.length > 0 ? name17 : environment.publicId;
}
function resolveLaunchRepoReference(repoUrl, savedEnvironment) {
  const spelled = repoUrl?.trim() ?? "";
  const requested = normalizeLaunchRepoReference(spelled);
  rejectBareRepoSlug(requested);
  if (savedEnvironment == null) {
    if (requested.length === 0) {
      throw new SandCloudAgentLaunchError("'repo_url' is required to launch a cloud agent.");
    }
    return requested;
  }
  const label = describeSavedEnvironment(savedEnvironment);
  const repos = savedEnvironment.repoConfig?.repos ?? [];
  const primary = repos[0]?.repoUrl.trim() ?? "";
  if (primary.length === 0) {
    if (requested.length === 0) {
      throw new SandCloudAgentLaunchError(
        `The '${label}' environment has no repositories configured, so pass repo_url to pick the repo to launch on.`
      );
    }
    return requested;
  }
  if (requested.length === 0) {
    return primary;
  }
  const requestedKey = repoIdentityKey(requested);
  if (repoIdentityKeysEqual(requestedKey, repoIdentityKey(primary))) {
    return primary;
  }
  const isSecondaryRepo = repos.slice(1).some((entry) => repoIdentityKeysEqual(repoIdentityKey(entry.repoUrl), requestedKey));
  throw new SandCloudAgentLaunchError(
    isSecondaryRepo ? `'${spelled}' is a secondary repo of the '${label}' environment; the launch's branch/PR lands on its primary repo '${primary}'. Omit repo_url to use it.` : `'${spelled}' is not part of the '${label}' environment (repos: ${repos.map((entry) => entry.repoUrl).join(", ")}). Omit repo_url to use its primary repo, or pick a different environment.`
  );
}
function toStartRepoConfig(config2) {
  if (config2 == null || config2.repos.length === 0) {
    return void 0;
  }
  return new EnvironmentRepoConfig({
    repos: config2.repos.map((repo) => ({
      repoUrl: repo.repoUrl,
      scmRepoNodeId: repo.scmRepoNodeId,
      gitEnterpriseUuid: repo.gitEnterpriseUuid
    }))
  });
}
var PRIVATE_WORKER_SHARED_ASSIGNMENT_ALLOWED_LABEL_KEY = "cursor.private_worker.shared_assignment_allowed";
function resolveCloudAgentEnvironmentFields(repoUrl, environment) {
  if (environment == null || environment.type === "cloud") {
    return {};
  }
  switch (environment.type) {
    case "environment":
      return {};
    case "pool": {
      const repoLabel = deriveRepoLabelValueFromUrl(repoUrl);
      if (repoLabel == null) {
        throw new SandCloudAgentLaunchError(
          `The Cursor agent could not derive private-worker routing labels from '${repoUrl}'.`
        );
      }
      const labels = [new PrivateWorkerLabel({ key: "repo", value: repoLabel })];
      const name17 = environment.name?.trim();
      if (name17 != null && name17.length > 0) {
        labels.push(new PrivateWorkerLabel({ key: "pool", value: name17 }));
      }
      return { usePrivateWorker: true, labels };
    }
    case "machine": {
      const name17 = environment.name.trim();
      if (name17.length === 0) {
        throw new SandCloudAgentLaunchError(
          "A private-worker machine environment requires a registered name."
        );
      }
      return {
        usePrivateWorker: true,
        labels: [
          new PrivateWorkerLabel({ key: "name", value: name17 }),
          new PrivateWorkerLabel({
            key: PRIVATE_WORKER_SHARED_ASSIGNMENT_ALLOWED_LABEL_KEY,
            value: "true"
          })
        ]
      };
    }
    default: {
      const exhaustiveCheck = environment;
      return exhaustiveCheck;
    }
  }
}


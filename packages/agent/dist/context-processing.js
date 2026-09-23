var logger54 = createLogger("@anysphere/agent/context-processing");
function getSafeErrorType(error42) {
  return error42 instanceof Error ? error42.name || "Error" : typeof error42;
}
var enrichContextDuration = createHistogram("agent.ttft.enrichContextMs", {
  description: "Time for the parallelizable context enrichment tasks in processSelectedContext (external links, documentation, PR hydration, etc.)"
});
var enrichContextExternalLinksDuration = createHistogram("agent.ttft.enrichContext.externalLinksMs", {
  description: "Time for the external links enrichment sub-task",
  labelNames: ["hasWork"]
});
var enrichContextDocumentationDuration = createHistogram("agent.ttft.enrichContext.documentationMs", {
  description: "Time for the documentation hydration sub-task",
  labelNames: ["hasWork"]
});
var enrichContextBlobStoreDuration = createHistogram("agent.ttft.enrichContext.blobStoreMs", {
  description: "Time for the blob store hydration sub-task (PRs, diffs, extra context)",
  labelNames: ["hasWork"]
});
var enrichContextActiveTaskCount = createHistogram("agent.ttft.enrichContext.activeTaskCount", {
  description: "Number of enrichment sub-tasks that had actual work to do (0-3)."
});
var blobHydrationDuration = createHistogram("agent.ttft.blobHydrationMs", {
  description: "Time for the pre-enrichment Promise.all that hydrates images, videos, documents, and human changes",
  labelNames: ["hasImages", "hasVideos", "hasDocs"]
});
var invocationContextDuration = createHistogram("agent.ttft.invocationContextMs", {
  description: "Time to hydrate and process invocation context (Slack thread, GitHub PR, IDE state)",
  labelNames: ["kind"]
});
var processSelectedContextDuration = createHistogram("agent.ttft.processSelectedContextMs", {
  description: "Total wall-clock time for the entire processSelectedContext function"
});
var postEnrichmentAssemblyDuration = createHistogram("agent.ttft.postEnrichmentAssemblyMs", {
  description: "Time for sync context assembly after enrichment (rules, skills, git diffs, PRs, etc.)"
});
var MAX_RULE_LENGTH = 1e5;
var EXTERNAL_LINK_ENRICHMENT_MAX_CONCURRENCY = 4;
var EXTERNAL_LINK_INLINE_LIMIT = 2e4;
var EXTERNAL_LINK_CONTENT_TRUNCATION_LIMIT = 5e5;
var CODE_SELECTION_INLINE_LIMIT = 2e4;
function canUseWatchVideoSubagent(config2) {
  return shouldIncludeWatchVideoSubagent({
    agentType: config2.agentType,
    backgroundAgentSource: config2.backgroundAgentSource,
    featureFlags: config2.featureFlags
  });
}
function isPathWithinPrefix({ targetPath, prefix }) {
  const resolvedTarget = import_node_path71.default.resolve(targetPath);
  const resolvedPrefix = import_node_path71.default.resolve(prefix);
  return resolvedTarget === resolvedPrefix || resolvedTarget.startsWith(resolvedPrefix + import_node_path71.default.sep);
}
function isPathWithinAnyPrefix(targetPath, prefixes) {
  return prefixes.some((prefix) => isPathWithinPrefix({ targetPath, prefix }));
}
function isAttachmentStoragePath(targetPath, projectFolder) {
  if (projectFolder === void 0) {
    return false;
  }
  if (!isPathWithinPrefix({ targetPath, prefix: projectFolder })) {
    return false;
  }
  const relativePath = import_node_path71.default.relative(import_node_path71.default.resolve(projectFolder), import_node_path71.default.resolve(targetPath));
  const segments = relativePath.split(import_node_path71.default.sep).filter(Boolean);
  return segments.length >= 3 && segments[0] === "attachments" && segments[1] !== void 0 && segments[2] !== void 0;
}
function getTrustedSelectedDocumentPath(documentPath, requestContext) {
  const canonicalPath = import_node_path71.default.resolve(documentPath);
  const env = requestContext?.env;
  const allowedPrefixes = [
    env?.projectFolder ? import_node_path71.default.join(env.projectFolder, "uploads") : void 0,
    ...env?.workspacePaths.map((workspacePath) => import_node_path71.default.join(workspacePath, "uploads")) ?? [],
    env?.artifactsFolder
  ].filter((prefix) => prefix !== void 0);
  const isTrusted = isPathWithinAnyPrefix(canonicalPath, allowedPrefixes) || isAttachmentStoragePath(canonicalPath, env?.projectFolder);
  return isTrusted ? canonicalPath : void 0;
}
function assertAttachmentWithinMaxBytes(args) {
  const { data, maxBytes, label } = args;
  if (maxBytes !== void 0 && data.length > maxBytes) {
    throw new Error(`${label} exceeds maximum size of ${maxBytes} bytes (${Math.round(maxBytes / 1024 / 1024)}MB)`);
  }
}
async function hydrateSelectedAttachmentData(args) {
  const { ctx, blobStore, attachment, dataOrBlobId, missingBlobError, maxBytes, sizeErrorLabel, withBlobId } = args;
  if (dataOrBlobId?.case === "data") {
    const data = dataOrBlobId.value;
    assertAttachmentWithinMaxBytes({ data, maxBytes, label: sizeErrorLabel });
    const blobId = await getBlobId(data);
    await blobStore.setBlob(ctx, blobId, data);
    return {
      data,
      processedAttachment: withBlobId(new Uint8Array(blobId))
    };
  }
  if (dataOrBlobId?.case === "blobId") {
    const data = await blobStore.getBlob(ctx, dataOrBlobId.value);
    if (!data) {
      throw new Error(missingBlobError);
    }
    assertAttachmentWithinMaxBytes({ data, maxBytes, label: sizeErrorLabel });
    return {
      data,
      processedAttachment: attachment
    };
  }
  if (dataOrBlobId?.case === "blobIdWithData") {
    const { blobId, data } = dataOrBlobId.value;
    assertAttachmentWithinMaxBytes({ data, maxBytes, label: sizeErrorLabel });
    await blobStore.setBlobLocallyOnly(ctx, blobId, data);
    return {
      data,
      processedAttachment: withBlobId(new Uint8Array(blobId))
    };
  }
  if (dataOrBlobId?.case === "promptUploadRef") {
    throw new Error(`${sizeErrorLabel} still references an unresolved prompt upload.`);
  }
  return {
    data: void 0,
    processedAttachment: void 0
  };
}
async function resolveTrustedPathOnlyAttachmentPath(args) {
  const { ctx, readablePath, requestContext, attachmentKind, treatNonAbsoluteAsPathOnly } = args;
  const hasPathOnlyPayload = readablePath.length > 0 && (treatNonAbsoluteAsPathOnly || import_node_path71.default.isAbsolute(readablePath));
  if (!hasPathOnlyPayload) {
    return { hasPathOnlyPayload: false, trustedPath: void 0 };
  }
  const trustedPath = await resolveTrustedPathOnlyAttachmentCandidate({
    readablePath,
    requestContext,
    attachmentKind
  });
  if (trustedPath === void 0) {
    logger54.warn(ctx, `Ignoring untrusted path-only ${attachmentKind} attachment`);
  }
  return { hasPathOnlyPayload: true, trustedPath };
}
async function resolveTrustedPathOnlyAttachmentCandidate(args) {
  if (!import_node_path71.default.isAbsolute(args.readablePath)) {
    return void 0;
  }
  if (args.attachmentKind === "video") {
    return import_node_path71.default.resolve(args.readablePath);
  }
  return getTrustedSelectedDocumentPath(args.readablePath, args.requestContext);
}
function getSkillIdFromPath(fullPath) {
  const normalizedPath = fullPath.replace(/\\/g, "/").replace(/\/+$/, "");
  const withoutSkillSuffix = normalizedPath.replace(/\/SKILL\.md$/i, "");
  const pathParts = withoutSkillSuffix.split("/").filter(Boolean);
  return pathParts[pathParts.length - 1] ?? "Skill";
}
function appendRandomUploadSuffix(filename, fallbackFilename) {
  const sanitizedFilename = sanitizeFilename(filename) || fallbackFilename;
  const suffix = (0, import_node_crypto28.randomUUID)().replace(/[^a-zA-Z0-9]/g, "").slice(0, 4) || "file";
  const extension3 = import_node_path71.default.extname(sanitizedFilename);
  if (extension3.length === 0) {
    return `${sanitizedFilename}_${suffix}`;
  }
  const stem = sanitizedFilename.slice(0, -extension3.length);
  if (stem.length === 0) {
    return `${sanitizedFilename}_${suffix}`;
  }
  return `${stem}_${suffix}${extension3}`;
}
function isSelectedContextSkillFile(fullPath) {
  if (!fullPath)
    return false;
  const normalizedPath = fullPath.replace(/\\/g, "/");
  return normalizedPath.endsWith("/SKILL.md") || normalizedPath === "SKILL.md";
}
function resolveSelectedContextSkillSections(selectedContext) {
  const validRules = (selectedContext.cursorRules ?? []).map((cursorRule) => cursorRule.rule).filter((rule) => rule !== void 0 && rule.content !== void 0 && rule.content.trim().length > 0);
  const hasNewSkillsField = (selectedContext.selectedSkills?.length ?? 0) > 0;
  const selectedSkills = hasNewSkillsField ? (selectedContext.selectedSkills ?? []).filter((skill) => skill.content !== void 0 && skill.content.trim().length > 0).map((skill) => ({
    fullPath: skill.fullPath ?? "",
    content: skill.content,
    plugin: skill.plugin,
    marketplace: skill.marketplace,
    pluginId: skill.pluginId,
    marketplaceId: skill.marketplaceId
  })) : validRules.filter((rule) => isSelectedContextSkillFile(rule.fullPath)).map((rule) => ({
    fullPath: rule.fullPath ?? "",
    content: rule.content ?? "",
    plugin: rule.plugin,
    marketplace: rule.marketplace,
    pluginId: rule.pluginId,
    marketplaceId: rule.marketplaceId
  }));
  const regularRules = hasNewSkillsField ? validRules : validRules.filter((rule) => !isSelectedContextSkillFile(rule.fullPath));
  return { selectedSkills, regularRules };
}
var CUSTOM_MODE_ID_PREFIX = "custom-mode:";
var UNHYDRATED_CUSTOM_MODE_SOURCE_PATH_PREFIX = "unhydrated:";
function normalizeCustomModeSkillPath(skillPath) {
  const trimmed = skillPath.trim();
  let comparable = trimmed;
  if (trimmed.startsWith("file:")) {
    try {
      comparable = (0, import_node_url8.fileURLToPath)(trimmed);
    } catch {
      comparable = trimmed;
    }
  }
  return comparable.replaceAll("\\", "/").replace(/\/+$/, "");
}
function customModeSkillFolderName(skillPath) {
  const parts = normalizeCustomModeSkillPath(skillPath).split("/").filter((part) => part.length > 0);
  const skillMdIndex = parts.lastIndexOf("SKILL.md");
  if (skillMdIndex > 0) {
    return parts[skillMdIndex - 1];
  }
  return parts.at(-1);
}
function customModeSkillPathLooksLike(fullPath, identity) {
  const path31 = normalizeCustomModeSkillPath(fullPath);
  const needle = normalizeCustomModeSkillPath(identity);
  if (path31.length === 0 || needle.length === 0) {
    return false;
  }
  if (path31 === needle) {
    return true;
  }
  if (needle.includes("/")) {
    const suffix = needle.startsWith("/") ? needle : `/${needle}`;
    return path31.endsWith(suffix);
  }
  return customModeSkillFolderName(path31) === needle;
}
function findSelectedSkillForSubmittedCustomMode(skills, mode) {
  const unhydratedName = mode.sourcePath?.startsWith(UNHYDRATED_CUSTOM_MODE_SOURCE_PATH_PREFIX) ? mode.sourcePath.slice(UNHYDRATED_CUSTOM_MODE_SOURCE_PATH_PREFIX.length).trim() : void 0;
  const idRest = mode.id.startsWith(CUSTOM_MODE_ID_PREFIX) ? mode.id.slice(CUSTOM_MODE_ID_PREFIX.length) : mode.id;
  const identities = [
    unhydratedName === void 0 ? mode.sourcePath : void 0,
    unhydratedName,
    idRest,
    mode.managedSkillId
  ].filter((value) => typeof value === "string" && value.trim().length > 0);
  const exactIdMatch = skills.find((skill) => {
    const fullPath = skill.fullPath;
    return typeof fullPath === "string" && fullPath.length > 0 && `${CUSTOM_MODE_ID_PREFIX}${fullPath}` === mode.id;
  });
  if (exactIdMatch !== void 0) {
    return exactIdMatch;
  }
  return skills.find((skill) => identities.some((identity) => customModeSkillPathLooksLike(skill.fullPath ?? "", identity)));
}
function renderDurableCustomModeSkillBlock(selectedSkills, mode) {
  const matched = findSelectedSkillForSubmittedCustomMode(selectedSkills, mode);
  const content = matched?.content;
  if (matched === void 0 || content === void 0 || content.trim().length === 0) {
    return void 0;
  }
  return renderManuallyAttachedSkillsSection([
    {
      fullPath: matched.fullPath ?? "",
      content
    }
  ])?.trimEnd();
}
function stripSkillFrontmatterForPrompt(raw) {
  try {
    const parsed2 = grayMatter(raw);
    return parsed2.content;
  } catch {
    const frontmatterBlock = /^---\r?\n[\s\S]*?\r?\n---(?:\r?\n|$)/.exec(raw);
    return frontmatterBlock === null ? raw : raw.slice(frontmatterBlock[0].length);
  }
}
function renderManuallyAttachedSkillEntry(skill) {
  const fullPath = skill.fullPath;
  const normalizedPath = fullPath.replace(/\\/g, "/");
  const pathParts = normalizedPath.split("/");
  const skillMdIndex = pathParts.indexOf("SKILL.md");
  const skillName2 = skillMdIndex > 0 ? pathParts[skillMdIndex - 1] : "Skill";
  const content = stripSkillFrontmatterForPrompt(skill.content).trim().slice(0, MAX_RULE_LENGTH);
  return `Skill Name: ${skillName2}
Path: ${fullPath}
SKILL.md content:
${content}`;
}
function renderManuallyAttachedSkillsSection(selectedSkills) {
  if (selectedSkills.length === 0) {
    return void 0;
  }
  const prefix = `<manually_attached_skills>
The user has manually attached the following skills to their message.
These skills contain specific instructions or workflows that the user wants you to follow for this request.
Only read the files if needed, the full skill content is inlined here.
`;
  const suffix = `</manually_attached_skills>`;
  const skillsText = selectedSkills.map((skill) => renderManuallyAttachedSkillEntry(skill)).join("\n\n---\n\n");
  return `${prefix}
${skillsText}
${suffix}

`;
}
async function processSelectedContext(ctx, selectedContext, blobStore, config2, requestContext, resourceAccessor, mode, _modelId, conversationQuery, simulatedMsgReason, privacyMode) {
  const userContent = [];
  const selectedImages = [];
  const selectedVideos = [];
  const selectedDocuments = [];
  const imageFilePaths = [];
  const videoFilePaths = [];
  const documentFilePaths = [];
  const processSelectedContextStart = performance.now();
  const invocationContextStart = performance.now();
  let resolvedInvocationContext;
  if (selectedContext.invocationContext) {
    const sourceInvocationContext = selectedContext.invocationContext;
    if (sourceInvocationContext.data.case === "blobId") {
      if (!blobStore) {
        throw new Error("Blob store is required to hydrate invocation context blob");
      }
      const blobData = await blobStore.getBlob(ctx, sourceInvocationContext.data.value);
      if (!blobData) {
        throw new Error("Invocation context blob not found");
      }
      resolvedInvocationContext = InvocationContext.fromBinary(blobData);
    } else {
      resolvedInvocationContext = sourceInvocationContext;
    }
  }
  if (resolvedInvocationContext) {
    const invocationContext = resolvedInvocationContext;
    if (invocationContext.data.case === "slackThread") {
      const slackThread = invocationContext.data.value;
      const hasChannelInfo = slackThread.channelName !== void 0 && slackThread.channelName.length > 0 || slackThread.channelPurpose !== void 0 && slackThread.channelPurpose.length > 0 || slackThread.channelTopic !== void 0 && slackThread.channelTopic.length > 0;
      const hasThreadContext = slackThread.thread !== void 0 && slackThread.thread.length > 0;
      let slackContextText = "<slack_context>\n";
      if (hasChannelInfo) {
        slackContextText += "<slack_channel>\n";
        if (slackThread.channelName !== void 0 && slackThread.channelName.length > 0) {
          slackContextText += `Channel: #${slackThread.channelName}
`;
        }
        if (slackThread.channelPurpose !== void 0 && slackThread.channelPurpose.length > 0) {
          slackContextText += `Channel purpose: ${slackThread.channelPurpose}
`;
        }
        if (slackThread.channelTopic !== void 0 && slackThread.channelTopic.length > 0) {
          slackContextText += `Channel topic: ${slackThread.channelTopic}
`;
        }
        slackContextText += "</slack_channel>\n";
      }
      const senderLine = formatSlackSenderLine(slackThread.senderName, slackThread.senderId, slackThread.senderType);
      if (hasThreadContext || senderLine !== void 0) {
        slackContextText += "<slack_thread>\n";
        if (hasThreadContext) {
          slackContextText += `The user shared the following Slack thread for additional context
${slackThread.thread}
`;
        }
        if (senderLine !== void 0) {
          slackContextText += `${senderLine}
`;
        }
        slackContextText += "</slack_thread>\n";
      }
      slackContextText += "</slack_context>";
      userContent.push({
        type: "text",
        text: slackContextText
      });
    } else if (invocationContext.data.case === "microsoftTeamsThread") {
      const teamsThread = invocationContext.data.value;
      const hasChannelMetadata = teamsThread.channelName !== void 0 && teamsThread.channelName.length > 0 || teamsThread.channelDescription !== void 0 && teamsThread.channelDescription.length > 0 || teamsThread.teamName !== void 0 && teamsThread.teamName.length > 0 || teamsThread.teamDescription !== void 0 && teamsThread.teamDescription.length > 0;
      const hasTeamsThreadContext = teamsThread.thread !== void 0 && teamsThread.thread.length > 0;
      let teamsContextText = "<microsoft_teams_context>\n";
      if (hasChannelMetadata) {
        teamsContextText += "<microsoft_teams_channel>\n";
        if (teamsThread.teamName !== void 0 && teamsThread.teamName.length > 0) {
          teamsContextText += `Team: ${teamsThread.teamName}
`;
        }
        if (teamsThread.teamDescription !== void 0 && teamsThread.teamDescription.length > 0) {
          teamsContextText += `Team description: ${teamsThread.teamDescription}
`;
        }
        if (teamsThread.channelName !== void 0 && teamsThread.channelName.length > 0) {
          teamsContextText += `Channel: #${teamsThread.channelName}
`;
        }
        if (teamsThread.channelDescription !== void 0 && teamsThread.channelDescription.length > 0) {
          teamsContextText += `Channel description: ${teamsThread.channelDescription}
`;
        }
        teamsContextText += "</microsoft_teams_channel>\n";
      }
      if (hasTeamsThreadContext) {
        teamsContextText += `<microsoft_teams_thread>
The user shared the following Microsoft Teams thread for additional context
${teamsThread.thread}
</microsoft_teams_thread>
`;
      }
      teamsContextText += "</microsoft_teams_context>";
      userContent.push({
        type: "text",
        text: teamsContextText
      });
    } else if (invocationContext.data.case === "githubPr") {
      const pr2 = invocationContext.data.value;
      userContent.push({
        type: "text",
        text: `<github_pr_context>
Here is the context of the Pull Request you are working on:
PR Title: ${pr2.title}${pr2.description !== "" ? `
PR Description:
${pr2.description}` : ""}${pr2.comments !== "" ? `
Recent PR Comments/Reviews:
${pr2.comments}` : ""}${pr2.ciFailures !== void 0 && pr2.ciFailures !== "" ? `
Possibly Relevant CI Failures:
${pr2.ciFailures}` : ""}
</github_pr_context>`
      });
    } else if (invocationContext.data.case === "ideState") {
      const ideState = invocationContext.data.value;
      let recentlyViewedFiles = ideState.recentlyViewedFiles;
      let visibleFiles = ideState.visibleFiles;
      if (!config2.enableTerminalFiles) {
        recentlyViewedFiles = recentlyViewedFiles.filter((f2) => extractTerminalId(f2.path) === null);
        visibleFiles = visibleFiles.filter((f2) => extractTerminalId(f2.path) === null);
      }
      let recentlyViewedSection = "";
      if (recentlyViewedFiles.length > 0) {
        recentlyViewedSection = "Recently viewed files (recent at the top, oldest at the bottom):\n";
        const reversedFiles = [...recentlyViewedFiles].reverse();
        for (const file2 of reversedFiles) {
          recentlyViewedSection += `- ${file2.path}`;
          if (file2.totalLines !== -1) {
            recentlyViewedSection += ` (total lines: ${file2.totalLines})`;
          }
          if (file2.activeCommand && config2.enableTerminalFiles) {
            recentlyViewedSection += ` (active command: ${file2.activeCommand})`;
          }
          recentlyViewedSection += "\n";
        }
        recentlyViewedSection += "\n";
      }
      let visibleFilesSection = "";
      if (visibleFiles.length === 0) {
        visibleFilesSection = "User currently doesn't have any open files in their IDE.\n";
      } else {
        visibleFilesSection = "Files that are currently open and visible in the user's IDE:\n";
        for (const file2 of visibleFiles) {
          visibleFilesSection += `- ${file2.path}`;
          const hasTotalLines = file2.totalLines !== -1;
          if (file2.cursorPosition !== void 0) {
            if (hasTotalLines) {
              visibleFilesSection += ` (currently focused file, cursor is on line ${file2.cursorPosition.line}, total lines: ${file2.totalLines})`;
            } else {
              visibleFilesSection += ` (currently focused file, cursor is on line ${file2.cursorPosition.line})`;
            }
          } else if (hasTotalLines) {
            visibleFilesSection += ` (total lines: ${file2.totalLines})`;
          }
          if (file2.activeCommand && config2.enableTerminalFiles) {
            visibleFilesSection += ` (active command: ${file2.activeCommand})`;
          }
          visibleFilesSection += "\n";
        }
      }
      let currentlyViewedPrSection = "";
      const viewedPrs = ideState.currentlyViewedPrs;
      if (viewedPrs && viewedPrs.length > 0) {
        currentlyViewedPrSection = viewedPrs.length === 1 ? "\nCurrently viewing Pull Request:\n" : "\nCurrently viewing Pull Requests:\n";
        for (const viewedPr of viewedPrs) {
          if (viewedPr.number === void 0) {
            continue;
          }
          currentlyViewedPrSection += `PR #${viewedPr.number}`;
          if (viewedPr.title) {
            currentlyViewedPrSection += `: ${viewedPr.title}`;
          }
          currentlyViewedPrSection += "\n";
          if (viewedPr.url) {
            currentlyViewedPrSection += `- URL: ${viewedPr.url}
`;
          }
          if (viewedPr.summaryJson) {
            try {
              const summaryForBranch = JSON.parse(viewedPr.summaryJson);
              const headRef = summaryForBranch.headRef?.trim();
              const baseRef = summaryForBranch.baseRef?.trim();
              if (headRef) {
                currentlyViewedPrSection += `- Branch: ${headRef}${baseRef ? ` \u2192 ${baseRef}` : ""}
`;
              }
            } catch {
            }
          }
          if (viewedPr.description) {
            const maxDescriptionLength = 500;
            if (viewedPr.description.length > maxDescriptionLength) {
              const truncated = viewedPr.description.slice(0, maxDescriptionLength);
              currentlyViewedPrSection += `- Description: ${truncated}... (truncated, full description in summary.json)
`;
            } else {
              currentlyViewedPrSection += `- Description: ${viewedPr.description}
`;
            }
          }
          if (viewedPr.folderPath) {
            currentlyViewedPrSection += `- Some additional details about the PR are available in the folder ${viewedPr.folderPath}
`;
            currentlyViewedPrSection += `  - Contents:
`;
            currentlyViewedPrSection += `    - all.diff: Complete diff of all files in one file
`;
            currentlyViewedPrSection += `    - diffs/: Individual diff files if you need to read specific files
`;
            currentlyViewedPrSection += `    - summary.json: Metadata about the PR and changed files
`;
            currentlyViewedPrSection += `    - comments.json: Review comments on the PR
`;
            if (viewedPr.summaryJson) {
              try {
                const summary = JSON.parse(viewedPr.summaryJson);
                const totalDiffChars = summary.totalDiffSizeChars ?? summary.totalDiffSizeBytes;
                currentlyViewedPrSection += `- Summary: ${summary.totalFiles} files, ${summary.totalDiffLines} lines, ${totalDiffChars} chars
`;
                currentlyViewedPrSection += `- Files changed:
`;
                for (const file2 of summary.files || []) {
                  const diffFileName = file2.diffFileName || `${file2.path.replace(/\//g, "__")}.diff`;
                  const diffChars = file2.diffSizeChars ?? file2.diffSizeBytes;
                  const originalChars = file2.originalSizeChars ?? file2.originalSizeBytes;
                  currentlyViewedPrSection += `  - ${file2.path} (diff: diffs/${diffFileName})
`;
                  currentlyViewedPrSection += `    ${file2.status}, ${file2.diffLines} diff lines, ${diffChars} diff chars`;
                  if (originalChars !== void 0) {
                    currentlyViewedPrSection += `, ${originalChars} original chars`;
                  }
                  currentlyViewedPrSection += `
`;
                }
              } catch {
                currentlyViewedPrSection += `- Read summary.json for file list and diff sizes.
`;
              }
            }
          }
        }
      }
      userContent.push({
        type: "text",
        text: `<open_and_recently_viewed_files>
${recentlyViewedSection}${visibleFilesSection}${currentlyViewedPrSection}
Note: these files may or may not be relevant to the current conversation. Use the read file tool if you need to get the contents of some of them.
</open_and_recently_viewed_files>`
      });
    }
  }
  if (mode !== AgentMode.PROJECT && config2.enableAgentNotes && (requestContext.conversationNotesListing || requestContext.sharedNotesListing)) {
    const isMetaAgentNotes = config2.featureFlags?.metaAgentNotes === true;
    if (!isMetaAgentNotes) {
      const parts = ["<agent_notes>\nAgent notes for this conversation:\n"];
      if (requestContext.conversationNotesListing) {
        parts.push(`
Conversation notes:
${requestContext.conversationNotesListing}
`);
      }
      if (requestContext.sharedNotesListing) {
        parts.push(`
Shared notes:
${requestContext.sharedNotesListing}
`);
      }
      parts.push("</agent_notes>");
      userContent.push({
        type: "text",
        text: parts.join("")
      });
    }
  }
  const invocationContextKind = resolvedInvocationContext?.data.case ?? "none";
  invocationContextDuration.histogram(ctx, performance.now() - invocationContextStart, {
    kind: invocationContextKind
  });
  const blobHydrationStart = performance.now();
  const hasImages = selectedContext.selectedImages.length > 0;
  const hasVideos = selectedContext.selectedVideos.length > 0;
  const hasDocs = selectedContext.selectedDocuments.length > 0;
  const imageProcessingPromise = Promise.all(selectedContext.selectedImages.map(async (selectedImg, i) => {
    let imgBlobId;
    let imgData;
    let processedSelectedImage;
    if (selectedImg.dataOrBlobId?.case === "data") {
      imgData = selectedImg.dataOrBlobId.value;
      imgBlobId = await getBlobId(imgData);
      await blobStore.setBlob(ctx, imgBlobId, imgData);
      processedSelectedImage = new SelectedImage({
        ...selectedImg,
        dataOrBlobId: {
          case: "blobId",
          value: new Uint8Array(imgBlobId)
        }
      });
    } else if (selectedImg.dataOrBlobId?.case === "blobId") {
      imgBlobId = selectedImg.dataOrBlobId.value;
      imgData = await blobStore.getBlob(ctx, imgBlobId);
      if (!imgData) {
        throw new Error("Image not found");
      }
      processedSelectedImage = selectedImg;
    } else if (selectedImg.dataOrBlobId?.case === "blobIdWithData") {
      const blobIdWithData = selectedImg.dataOrBlobId.value;
      imgBlobId = blobIdWithData.blobId;
      imgData = blobIdWithData.data;
      await blobStore.setBlobLocallyOnly(ctx, imgBlobId, imgData);
      processedSelectedImage = new SelectedImage({
        ...selectedImg,
        dataOrBlobId: {
          case: "blobId",
          value: new Uint8Array(imgBlobId)
        }
      });
    } else if (selectedImg.dataOrBlobId?.case === "promptUploadRef") {
      throw new Error("Image still references an unresolved prompt upload.");
    }
    let imageFilePath;
    const resolvedMimeType = selectedImg.mimeType && selectedImg.mimeType.trim() !== "" ? selectedImg.mimeType : (imgData ? detectImageMimeType(imgData, selectedImg.path) : void 0) || "image/png";
    if (imgData) {
      if (config2.enableImageFiles && resourceAccessor && requestContext?.env !== void 0 && requestContext.env.projectFolder !== void 0 && requestContext.env.projectFolder !== "") {
        try {
          const mimeType = resolvedMimeType;
          const originalPath = selectedImg.path;
          const extensionFromPath = originalPath !== void 0 ? import_node_path71.default.extname(originalPath).replace(/^\./, "").toLowerCase() : void 0;
          let extension3 = "png";
          if (extensionFromPath && extensionFromPath !== "") {
            extension3 = extensionFromPath === "jpeg" ? "jpg" : extensionFromPath;
          } else if (mimeType.includes("jpeg") || mimeType.includes("jpg")) {
            extension3 = "jpg";
          } else if (mimeType.includes("gif")) {
            extension3 = "gif";
          } else if (mimeType.includes("webp")) {
            extension3 = "webp";
          }
          const originalFilename = originalPath !== void 0 ? import_node_path71.default.basename(originalPath) : void 0;
          const baseFilename = originalFilename !== void 0 && originalFilename !== "" ? import_node_path71.default.basename(originalFilename, import_node_path71.default.extname(originalFilename)) : selectedImg.uuid || `image-${Date.now()}-${i}`;
          const safeBaseFilename = sanitizeFilename(baseFilename) || `image-${Date.now()}-${i}`;
          const fileName = `${safeBaseFilename}.${extension3}`;
          const workspaceRoot = requestContext.env.workspacePaths[0];
          if (workspaceRoot !== void 0 && originalPath !== void 0 && originalPath !== "") {
            const normalizedOriginalPath = import_node_path71.default.normalize(originalPath);
            const normalizedWorkspaceRoot = import_node_path71.default.normalize(workspaceRoot);
            const relativePath = import_node_path71.default.relative(normalizedWorkspaceRoot, normalizedOriginalPath);
            if (!relativePath.startsWith("..") && !import_node_path71.default.isAbsolute(relativePath)) {
              imageFilePath = normalizedOriginalPath;
            }
          }
          if (imageFilePath === void 0) {
            const projectFolder = requestContext.env.projectFolder;
            const assetsDir = import_node_path71.default.join(projectFolder, "assets");
            const filePath = import_node_path71.default.join(assetsDir, fileName);
            imageFilePath = filePath;
            const writeExecutor = resourceAccessor.get(writeExecutorResource);
            void writeExecutor.execute(ctx, new WriteArgs({
              path: filePath,
              fileBytes: new Uint8Array(imgData),
              returnFileContentAfterWrite: false
            })).then(() => {
            }).catch(() => {
            });
          }
        } catch (_error) {
        }
      }
    }
    return {
      selectedImage: processedSelectedImage,
      imgData,
      mimeType: resolvedMimeType,
      imageFilePath
    };
  }));
  const videoProcessingPromise = Promise.all(selectedContext.selectedVideos.map(async (selectedVideo, i) => {
    const readableVideoPath = selectedVideo.path.trim();
    const pathOnlyVideo = !selectedVideo.dataOrBlobId?.case ? await resolveTrustedPathOnlyAttachmentPath({
      ctx,
      readablePath: readableVideoPath,
      requestContext,
      attachmentKind: "video",
      treatNonAbsoluteAsPathOnly: true
    }) : { hasPathOnlyPayload: false, trustedPath: void 0 };
    const displayFilename = selectedVideo.filename;
    const mimeType = selectedVideo.mimeType;
    const fps = selectedVideo.fps;
    if (pathOnlyVideo.hasPathOnlyPayload) {
      if (pathOnlyVideo.trustedPath === void 0) {
        return {
          processedSelectedVideo: void 0,
          videoData: void 0,
          mimeType,
          fps,
          filename: displayFilename,
          localFilePath: void 0
        };
      }
      const trustedPathOnlyVideoPath = pathOnlyVideo.trustedPath;
      if (!mimeType || !mimeType.startsWith("video/")) {
        throw new Error(`Video attachments require a video/* mime type, got ${mimeType}`);
      }
      return {
        processedSelectedVideo: new SelectedVideo({
          ...selectedVideo,
          path: trustedPathOnlyVideoPath
        }),
        videoData: void 0,
        mimeType,
        fps,
        localFilePath: trustedPathOnlyVideoPath,
        filename: displayFilename || import_node_path71.default.basename(trustedPathOnlyVideoPath)
      };
    }
    const materializeToFilesystem = selectedVideo.materializeToFilesystem === true;
    if (!materializeToFilesystem && !isGeminiModelId(_modelId)) {
      throw new Error("Video attachments are only supported for Gemini models");
    }
    if (fps !== void 0 && (!Number.isFinite(fps) || fps < 0.25 || fps > 20)) {
      throw new Error(`Video fps must be between 0.25 and 20, got ${fps}`);
    }
    if (!mimeType || !mimeType.startsWith("video/")) {
      throw new Error(`Video attachments require a video/* mime type, got ${mimeType}`);
    }
    let videoBlobId;
    let videoData;
    let processedSelectedVideo;
    const useSignedUrl = !materializeToFilesystem && isSignedUrlStorageAllowed(privacyMode) && config2.attachedMediaUrlProvider !== void 0;
    const maxVideoBytes = useSignedUrl ? getSignedUrlVideoMaxBytes(config2) : getInlineVideoMaxBytes(config2);
    if (selectedVideo.dataOrBlobId?.case === "signedUrl") {
      if (!useSignedUrl) {
        throw new Error("Attached media signed URLs are not available in this privacy mode");
      }
      const incomingSignedUrl = selectedVideo.dataOrBlobId.value;
      const renewed = await config2.attachedMediaUrlProvider.getSignedUrlForAttachedMedia(ctx, {
        conversationId: incomingSignedUrl.conversationId,
        key: incomingSignedUrl.key,
        mimeType
      });
      const signedUrl = new SelectedVideo_SignedUrl({
        url: renewed.getUrl,
        key: renewed.key,
        expiresAtUnixMs: renewed.expiresAtUnixMs,
        refreshAfterUnixMs: renewed.refreshAfterUnixMs,
        conversationId: incomingSignedUrl.conversationId
      });
      processedSelectedVideo = new SelectedVideo({
        ...selectedVideo,
        dataOrBlobId: {
          case: "signedUrl",
          value: signedUrl
        }
      });
      return {
        processedSelectedVideo,
        videoData: void 0,
        videoUrl: signedUrl.url,
        mimeType,
        fps,
        filename: displayFilename
      };
    } else if (selectedVideo.dataOrBlobId?.case === "data") {
      videoData = selectedVideo.dataOrBlobId.value;
      if (videoData.length > maxVideoBytes) {
        throw new Error(`Video exceeds maximum size of ${maxVideoBytes} bytes (${Math.round(maxVideoBytes / 1024 / 1024)}MB)`);
      }
      if (!useSignedUrl) {
        videoBlobId = await getBlobId(videoData);
        await blobStore.setBlob(ctx, videoBlobId, videoData);
        processedSelectedVideo = new SelectedVideo({
          ...selectedVideo,
          dataOrBlobId: {
            case: "blobId",
            value: new Uint8Array(videoBlobId)
          }
        });
      }
    } else if (selectedVideo.dataOrBlobId?.case === "blobId") {
      videoBlobId = selectedVideo.dataOrBlobId.value;
      videoData = await blobStore.getBlob(ctx, videoBlobId);
      if (!videoData) {
        throw new Error("Video not found in blob store");
      }
      if (videoData.length > maxVideoBytes) {
        throw new Error(`Video exceeds maximum size of ${maxVideoBytes} bytes (${Math.round(maxVideoBytes / 1024 / 1024)}MB)`);
      }
      processedSelectedVideo = selectedVideo;
    } else if (selectedVideo.dataOrBlobId?.case === "blobIdWithData") {
      const blobIdWithData = selectedVideo.dataOrBlobId.value;
      videoBlobId = blobIdWithData.blobId;
      videoData = blobIdWithData.data;
      if (videoData.length > maxVideoBytes) {
        throw new Error(`Video exceeds maximum size of ${maxVideoBytes} bytes (${Math.round(maxVideoBytes / 1024 / 1024)}MB)`);
      }
      if (!useSignedUrl) {
        await blobStore.setBlobLocallyOnly(ctx, videoBlobId, videoData);
        processedSelectedVideo = new SelectedVideo({
          ...selectedVideo,
          dataOrBlobId: {
            case: "blobId",
            value: new Uint8Array(videoBlobId)
          }
        });
      }
    } else {
      throw new Error("Video attachment has no data");
    }
    let videoFilePath;
    const filename = selectedVideo.filename || (selectedVideo.path.length > 0 ? import_node_path71.default.basename(selectedVideo.path) : `video-${Date.now()}-${i}`);
    if (materializeToFilesystem && videoData) {
      const videoRootPath = requestContext?.env?.projectFolder ?? requestContext?.env?.workspacePaths?.[0];
      if (resourceAccessor && videoRootPath !== void 0) {
        try {
          const safeFilename = appendRandomUploadSuffix(filename, `video-${Date.now()}-${i}`);
          const uploadsDir = import_node_path71.default.join(videoRootPath, "uploads");
          const filePath = import_node_path71.default.join(uploadsDir, safeFilename);
          const writeExecutor = resourceAccessor.get(writeExecutorResource);
          await writeExecutor.execute(ctx, new WriteArgs({
            path: filePath,
            fileBytes: new Uint8Array(videoData),
            returnFileContentAfterWrite: false
          }));
          videoFilePath = filePath;
          processedSelectedVideo = new SelectedVideo({
            ...processedSelectedVideo ?? selectedVideo,
            path: filePath
          });
        } catch (error42) {
          logger54.warn(ctx, "Failed to write video to filesystem", {
            errorType: getSafeErrorType(error42)
          });
          processedSelectedVideo = void 0;
        }
      }
    }
    if (materializeToFilesystem && videoFilePath === void 0) {
      processedSelectedVideo = void 0;
    } else if (useSignedUrl && videoData !== void 0) {
      const conversationId = config2.conversationId ?? "";
      const signedUrls = await config2.attachedMediaUrlProvider.getSignedUrlForAttachedMedia(ctx, { conversationId, mimeType, contentLengthBytes: videoData.length });
      await uploadAttachedMediaToSignedUrl({
        putUrl: signedUrls.putUrl,
        data: new Uint8Array(videoData),
        mimeType,
        signal: ctx.signal
      });
      processedSelectedVideo = new SelectedVideo({
        ...selectedVideo,
        dataOrBlobId: {
          case: "signedUrl",
          value: new SelectedVideo_SignedUrl({
            url: signedUrls.getUrl,
            key: signedUrls.key,
            expiresAtUnixMs: signedUrls.expiresAtUnixMs,
            refreshAfterUnixMs: signedUrls.refreshAfterUnixMs,
            conversationId
          })
        }
      });
      return {
        processedSelectedVideo,
        videoData: void 0,
        videoUrl: signedUrls.getUrl,
        mimeType,
        fps,
        filename: displayFilename
      };
    }
    return {
      processedSelectedVideo,
      videoData: materializeToFilesystem ? void 0 : videoData,
      mimeType,
      fps,
      filename,
      localFilePath: videoFilePath
    };
  }));
  const documentProcessingPromise = Promise.all(selectedContext.selectedDocuments.map(async (selectedDoc, i) => {
    const selectedDocPath = selectedDoc.path.trim();
    const trimmedFilename = selectedDoc.filename.trim();
    const readablePath = selectedDocPath || (import_node_path71.default.isAbsolute(trimmedFilename) ? trimmedFilename : "");
    const displayFilename = trimmedFilename && !import_node_path71.default.isAbsolute(trimmedFilename) ? trimmedFilename : import_node_path71.default.basename(readablePath);
    const hydratedDocument = await hydrateSelectedAttachmentData({
      ctx,
      blobStore,
      attachment: selectedDoc,
      dataOrBlobId: selectedDoc.dataOrBlobId,
      missingBlobError: "Document not found in blob store",
      sizeErrorLabel: "Document",
      withBlobId: (blobId) => new SelectedDocument({
        ...selectedDoc,
        dataOrBlobId: {
          case: "blobId",
          value: blobId
        }
      })
    });
    const docData = hydratedDocument.data;
    let processedSelectedDocument = hydratedDocument.processedAttachment;
    const pathOnlyDocument = !selectedDoc.dataOrBlobId?.case ? await resolveTrustedPathOnlyAttachmentPath({
      ctx,
      readablePath,
      requestContext,
      attachmentKind: "document",
      treatNonAbsoluteAsPathOnly: false
    }) : { hasPathOnlyPayload: false, trustedPath: void 0 };
    if (pathOnlyDocument.trustedPath !== void 0) {
      processedSelectedDocument = new SelectedDocument({
        ...selectedDoc,
        path: pathOnlyDocument.trustedPath
      });
    }
    let documentFilePath;
    const filename = displayFilename || `document-${Date.now()}-${i}`;
    if (docData) {
      const projectFolder = requestContext?.env?.projectFolder;
      const workspaceRootPath = requestContext?.env?.workspacePaths?.[0];
      const documentRootPath = projectFolder ?? workspaceRootPath;
      if (resourceAccessor && documentRootPath !== void 0) {
        try {
          const safeFilename = appendRandomUploadSuffix(filename, `document-${Date.now()}-${i}`);
          const uploadsDir = import_node_path71.default.join(documentRootPath, "uploads");
          const filePath = import_node_path71.default.join(uploadsDir, safeFilename);
          const writeExecutor = resourceAccessor.get(writeExecutorResource);
          await writeExecutor.execute(ctx, new WriteArgs({
            path: filePath,
            fileBytes: new Uint8Array(docData),
            returnFileContentAfterWrite: false
          }));
          documentFilePath = filePath;
          processedSelectedDocument = new SelectedDocument({
            ...processedSelectedDocument ?? selectedDoc,
            path: filePath
          });
        } catch (error42) {
          logger54.warn(ctx, "Failed to write document to filesystem", {
            errorType: getSafeErrorType(error42)
          });
          processedSelectedDocument = void 0;
        }
      }
    } else if (!docData && processedSelectedDocument && pathOnlyDocument.trustedPath !== void 0) {
      documentFilePath = pathOnlyDocument.trustedPath;
    }
    if (docData && documentFilePath === void 0) {
      processedSelectedDocument = void 0;
    }
    return {
      selectedDocument: processedSelectedDocument,
      docData,
      mimeType: selectedDoc.mimeType,
      filename,
      documentFilePath
    };
  }));
  const [imageProcessingResults, videoProcessingResults, documentProcessingResults] = await Promise.all([imageProcessingPromise, videoProcessingPromise, documentProcessingPromise]);
  blobHydrationDuration.histogram(ctx, performance.now() - blobHydrationStart, {
    hasImages: hasImages ? "true" : "false",
    hasVideos: hasVideos ? "true" : "false",
    hasDocs: hasDocs ? "true" : "false"
  });
  const allDocumentInfos = [];
  const allVideoInfos = [];
  for (const result of imageProcessingResults) {
    if (result.selectedImage) {
      selectedImages.push(result.selectedImage);
    }
    if (result.imageFilePath) {
      imageFilePaths.push(result.imageFilePath);
    }
    if (result.imgData && result.imgData.byteLength > 0) {
      userContent.push({
        type: "image",
        image: new Uint8Array(result.imgData),
        mimeType: result.mimeType
      });
    } else if (result.imgData) {
      logger54.warn(ctx, "Skipping empty image attachment data", {
        mimeType: result.mimeType
      });
    }
  }
  for (const result of videoProcessingResults) {
    if (result.processedSelectedVideo) {
      selectedVideos.push(result.processedSelectedVideo);
    }
    if (result.localFilePath) {
      videoFilePaths.push(result.localFilePath);
      allVideoInfos.push({
        path: result.localFilePath
      });
    }
    if ("videoUrl" in result && result.videoUrl) {
      userContent.push({
        type: "image",
        image: new URL(result.videoUrl),
        mimeType: result.mimeType,
        providerOptions: {
          cursor: {
            mimeType: result.mimeType,
            ...result.fps !== void 0 ? { videoFps: result.fps } : {}
          }
        }
      });
    } else if (result.videoData && result.videoData.byteLength > 0) {
      const base64Data = Buffer.from(result.videoData).toString("base64");
      const dataUrl = `data:${result.mimeType};base64,${base64Data}`;
      userContent.push({
        type: "image",
        image: dataUrl,
        // Data URL string (not Uint8Array) for video
        mimeType: result.mimeType,
        // Pass fps via providerOptions for geminiUtils.ts to read (video_metadata.fps)
        providerOptions: result.fps !== void 0 ? { cursor: { videoFps: result.fps } } : void 0
      });
    }
  }
  const getUploadsRootPath = () => {
    const projectFolder = requestContext?.env?.projectFolder;
    const workspaceRootPath = requestContext?.env?.workspacePaths?.[0];
    return projectFolder ?? workspaceRootPath;
  };
  const writeToUploadsDir = async (fileBytes, safeFilename) => {
    const documentRootPath = getUploadsRootPath();
    if (!resourceAccessor || documentRootPath === void 0) {
      return void 0;
    }
    const uploadsDir = import_node_path71.default.join(documentRootPath, "uploads");
    const filePath = import_node_path71.default.join(uploadsDir, safeFilename);
    const writeExecutor = resourceAccessor.get(writeExecutorResource);
    await writeExecutor.execute(ctx, new WriteArgs({
      path: filePath,
      fileBytes: new Uint8Array(fileBytes),
      returnFileContentAfterWrite: false
    }));
    return { path: filePath };
  };
  const writeCodeSelectionToFile = async (opts) => {
    const { content, originalPath, startLine, endLine, index } = opts;
    try {
      const originalBasename = import_node_path71.default.basename(originalPath) || "selection";
      const originalExt = import_node_path71.default.extname(originalBasename);
      const stem = originalExt.length > 0 ? originalBasename.slice(0, -originalExt.length) : originalBasename;
      const safeStem = sanitizeFilename(stem) || "selection";
      const safeExt = originalExt.length > 0 ? sanitizeFilename(originalExt.replace(/^\./, "")) || "txt" : "txt";
      const safeFilename = `${safeStem}-L${startLine}-L${endLine}-${index}.${safeExt}`;
      const fileBytes = new TextEncoder().encode(content);
      return await writeToUploadsDir(fileBytes, safeFilename);
    } catch (error42) {
      logger54.warn(ctx, "Failed to write long code selection to file", {
        originalPath,
        startLine,
        endLine,
        error: error42 instanceof Error ? error42.message : String(error42)
      });
      return void 0;
    }
  };
  for (const result of documentProcessingResults) {
    if (result.selectedDocument) {
      selectedDocuments.push(result.selectedDocument);
    }
    if (result.documentFilePath) {
      documentFilePaths.push(result.documentFilePath);
      allDocumentInfos.push({
        path: result.documentFilePath
      });
    }
  }
  const attachedFilesContent = [];
  for (let i = 0; i < selectedContext.codeSelections.length; i++) {
    const codeSelection = selectedContext.codeSelections[i];
    const startLine = codeSelection.range?.start?.line ?? 1;
    const endLine = codeSelection.range?.end?.line ?? startLine;
    const isJupyterNotebook3 = codeSelection.path.endsWith(".ipynb");
    if (config2.enableLongCodeSelectionSpillToFile && codeSelection.content.length > CODE_SELECTION_INLINE_LIMIT) {
      const spilled = await writeCodeSelectionToFile({
        content: codeSelection.content,
        originalPath: codeSelection.path,
        startLine,
        endLine,
        index: i
      });
      if (spilled !== void 0) {
        allDocumentInfos.push(spilled);
        attachedFilesContent.push({
          type: "text",
          text: `<code_selection lines="${startLine}-${endLine}" source="${codeSelection.path}" file="${spilled.path}">
The selection from \`${codeSelection.path}\` (lines ${startLine}-${endLine}) was too large to inline. Its full contents have been saved to \`${spilled.path}\`; read that file when you need the selection.
</code_selection>`
        });
        continue;
      }
    }
    const formattedContent = formatCodeBlock({
      content: codeSelection.content,
      filePath: codeSelection.path,
      startLineNumber: startLine,
      totalLineNumbersInFile: void 0,
      // We don't know total lines for a selection
      formattingOptions: {
        ...config2.formattingOptions,
        enableLineNumbers: config2.formattingOptions.enableLineNumbers !== false && !isJupyterNotebook3
      },
      tag: "code_selection",
      extraAttributes: {
        lines: `${startLine}-${endLine}`
      }
    }, {
      addAmountOfOmittedLines: false
    });
    attachedFilesContent.push({
      type: "text",
      text: formattedContent
    });
  }
  for (const terminal of selectedContext.terminals) {
    const extraAttributes = {};
    if (terminal.title) {
      extraAttributes.title = terminal.title;
    }
    if (terminal.path) {
      extraAttributes.path = terminal.path;
    }
    const formattedContent = formatCodeBlock({
      content: terminal.content,
      filePath: "",
      startLineNumber: 1,
      formattingOptions: {
        ...config2.formattingOptions,
        enableLineNumbers: false
      },
      tag: "terminal_output",
      extraAttributes: Object.keys(extraAttributes).length > 0 ? extraAttributes : void 0
    }, {
      addAmountOfOmittedLines: false
    });
    const truncatedContent = truncateOutput(formattedContent, SHELL_CHAR_HARD_LIMIT, true);
    attachedFilesContent.push({
      type: "text",
      text: truncatedContent.output
    });
  }
  for (const terminalSelection of selectedContext.terminalSelections) {
    const startLine = terminalSelection.range?.start?.line ?? 1;
    const endLine = terminalSelection.range?.end?.line ?? startLine;
    const extraAttributes = {};
    if (terminalSelection.title) {
      extraAttributes.title = terminalSelection.title;
    }
    if (terminalSelection.path) {
      extraAttributes.path = terminalSelection.path;
    }
    extraAttributes.lines = `${startLine}-${endLine}`;
    const formattedContent = formatCodeBlock({
      content: terminalSelection.content,
      filePath: "",
      startLineNumber: startLine,
      formattingOptions: {
        ...config2.formattingOptions,
        enableLineNumbers: false
      },
      tag: "terminal_selection",
      extraAttributes
    }, {
      addAmountOfOmittedLines: false
    });
    attachedFilesContent.push({
      type: "text",
      text: formattedContent
    });
  }
  if (attachedFilesContent.length > 0) {
    userContent.push({
      type: "text",
      text: `<attached_files>
${attachedFilesContent.map((part) => part.text).join("\n")}
</attached_files>`
    });
  }
  if (selectedContext.folders.length > 0) {
    const folderContents = [];
    for (const folder of selectedContext.folders) {
      if (!folder.directoryTree) {
        continue;
      }
      const formattedTree = renderDirectoryTreeWithinBudget(folder.directoryTree);
      const folderPath = folder.path;
      folderContents.push(`Folder: ${folderPath}
Contents of directory:
${formattedTree.result}`);
    }
    if (folderContents.length > 0) {
      userContent.push({
        type: "text",
        text: `<attached_folders>
Here are some folder${selectedContext.folders.length > 1 ? "s" : ""} I manually attached to my message:

${folderContents.join("\n\n")}
</attached_folders>`
      });
    }
  }
  const writeExternalLinkContentToFile = async (opts) => {
    const { content, url: url2, title, index } = opts;
    try {
      let basename24;
      try {
        const urlObj = new URL(url2);
        const lastSegment = urlObj.pathname.split("/").filter(Boolean).pop();
        basename24 = lastSegment ? decodeURIComponent(lastSegment) : urlObj.hostname;
      } catch {
        basename24 = "link";
      }
      const knownTextExtensions = /\.(md|txt|html|htm|json|xml|csv|tsv|yaml|yml|rst|tex|log)$/i;
      if (!knownTextExtensions.test(basename24)) {
        basename24 = `${basename24}.md`;
      }
      const sanitized = sanitizeFilename(basename24) || "link.md";
      const dotIdx = sanitized.lastIndexOf(".");
      const stem = sanitized.slice(0, dotIdx);
      const ext2 = sanitized.slice(dotIdx);
      const safeFilename = `${stem}-${index}${ext2}`;
      let contentToWrite = content;
      if (contentToWrite.length > EXTERNAL_LINK_CONTENT_TRUNCATION_LIMIT) {
        const truncatedChars = contentToWrite.length - EXTERNAL_LINK_CONTENT_TRUNCATION_LIMIT;
        contentToWrite = contentToWrite.slice(0, EXTERNAL_LINK_CONTENT_TRUNCATION_LIMIT) + `

[${truncatedChars.toLocaleString()} characters truncated due to size]`;
        logger54.warn(ctx, "Truncated external link content before writing", {
          url: url2,
          originalLength: content.length,
          truncatedLength: contentToWrite.length
        });
      }
      const header = `Source URL: ${url2}
Title: ${title}

`;
      const fileContent = header + contentToWrite;
      const fileBytes = new TextEncoder().encode(fileContent);
      return await writeToUploadsDir(fileBytes, safeFilename);
    } catch (error42) {
      logger54.warn(ctx, "Failed to write external link content to file", {
        url: url2,
        error: error42 instanceof Error ? error42.message : String(error42)
      });
      return void 0;
    }
  };
  const externalLinksTask = async () => {
    if (selectedContext.externalLinks.length === 0) {
      return {
        linkContents: [],
        externalDocumentInfos: [],
        externalImages: []
      };
    }
    const indexedExternalLinks = selectedContext.externalLinks.map((link, i) => ({
      link,
      i
    }));
    const externalLinkResults = await asyncMapValues(indexedExternalLinks, async ({ link, i }) => {
      const pageData = await config2.webScraperService.getContentInWebsiteFast(ctx, link.url);
      if (pageData === null) {
        return {
          linkContent: void 0,
          documentInfo: void 0,
          imageData: void 0
        };
      }
      if (pageData.imageData !== void 0 && pageData.imageData.length > 0 && pageData.imageMimeType !== void 0) {
        return {
          linkContent: void 0,
          documentInfo: void 0,
          imageData: {
            imageBytes: pageData.imageData,
            mimeType: pageData.imageMimeType
          }
        };
      }
      if (pageData.partialParsedPageContents.length <= EXTERNAL_LINK_INLINE_LIMIT) {
        return {
          linkContent: {
            url: pageData.pageUrl,
            title: pageData.pageTitle,
            content: pageData.partialParsedPageContents
          },
          documentInfo: void 0,
          imageData: void 0
        };
      }
      const documentInfo = await writeExternalLinkContentToFile({
        content: pageData.partialParsedPageContents,
        url: pageData.pageUrl,
        title: pageData.pageTitle,
        index: i
      });
      if (documentInfo !== void 0) {
        return {
          linkContent: void 0,
          documentInfo,
          imageData: void 0
        };
      }
      let content = pageData.partialParsedPageContents;
      if (content.length > EXTERNAL_LINK_INLINE_LIMIT) {
        const truncatedChars = content.length - EXTERNAL_LINK_INLINE_LIMIT;
        content = content.slice(0, EXTERNAL_LINK_INLINE_LIMIT) + `

[${truncatedChars.toLocaleString()} characters truncated due to size]`;
      }
      return {
        linkContent: {
          url: pageData.pageUrl,
          title: pageData.pageTitle,
          content
        },
        documentInfo: void 0,
        imageData: void 0
      };
    }, { max: EXTERNAL_LINK_ENRICHMENT_MAX_CONCURRENCY });
    const linkContents = [];
    const externalDocumentInfos = [];
    const externalImages = [];
    for (const result of externalLinkResults) {
      if (result.linkContent !== void 0) {
        linkContents.push(result.linkContent);
      }
      if (result.documentInfo !== void 0) {
        externalDocumentInfos.push(result.documentInfo);
      }
      if (result.imageData !== void 0) {
        externalImages.push(result.imageData);
      }
    }
    return { linkContents, externalDocumentInfos, externalImages };
  };
  const documentationTask = async () => {
    if (selectedContext.documentations.length === 0) {
      return void 0;
    }
    const documentationIdentifiers = selectedContext.documentations.map((doc) => ({
      docId: doc.docId,
      name: doc.name
    }));
    return config2.documentationHydrationService.hydrateDocumentation(ctx, documentationIdentifiers, conversationQuery);
  };
  const hydrateSelectedPullRequestsTask = async () => {
    return Promise.all(selectedContext.selectedPullRequests.map(async (pr2) => {
      if (pr2.blobId !== void 0 && pr2.blobId.length > 0) {
        if (!blobStore) {
          throw new Error("Blob store is required to hydrate selected pull request blob");
        }
        const blobData = await blobStore.getBlob(ctx, pr2.blobId);
        if (!blobData) {
          throw new Error("Selected pull request blob not found");
        }
        return SelectedPullRequest.fromBinary(blobData);
      }
      return pr2;
    }));
  };
  const hydrateGitPrDiffSelectionsTask = async () => {
    return Promise.all(selectedContext.gitPrDiffSelections.map(async (selection) => {
      if (selection.blobId !== void 0 && selection.blobId.length > 0) {
        if (!blobStore) {
          throw new Error("Blob store is required to hydrate git PR diff selection blob");
        }
        const blobData = await blobStore.getBlob(ctx, selection.blobId);
        if (!blobData) {
          throw new Error("Git PR diff selection blob not found");
        }
        return SelectedGitPRDiffSelection.fromBinary(blobData);
      }
      return selection;
    }));
  };
  const extraContextTask = async () => {
    const extraContextsToInclude2 = [];
    const seenExtraContexts = /* @__PURE__ */ new Set();
    const textDecoder3 = new TextDecoder();
    const appendExtraContext = (value) => {
      if (value.length === 0 || seenExtraContexts.has(value)) {
        return;
      }
      seenExtraContexts.add(value);
      extraContextsToInclude2.push(value);
    };
    const hydratedExtraContextEntries = await Promise.all(selectedContext.extraContextEntries.map(async (entry) => {
      if (entry.dataOrBlobId.case === void 0) {
        return void 0;
      }
      if (entry.dataOrBlobId.case === "data") {
        return entry.dataOrBlobId.value;
      }
      if (entry.dataOrBlobId.case === "blobId") {
        if (!blobStore) {
          throw new Error("Blob store is required to hydrate extra context blob");
        }
        const blob = await blobStore.getBlob(ctx, entry.dataOrBlobId.value);
        if (!blob) {
          throw new Error("Extra context blob not found");
        }
        return textDecoder3.decode(blob);
      }
      return void 0;
    }));
    for (const extraContext of hydratedExtraContextEntries) {
      if (extraContext !== void 0) {
        appendExtraContext(extraContext);
      }
    }
    for (const extraContext of selectedContext.extraContext) {
      appendExtraContext(extraContext);
    }
    return extraContextsToInclude2;
  };
  const hydrateBlobStoreTask = async () => {
    const prs = await hydrateSelectedPullRequestsTask();
    const diffs = await hydrateGitPrDiffSelectionsTask();
    const extra = await extraContextTask();
    return { prs, diffs, extra };
  };
  const enrichStart = performance.now();
  const hasExternalLinks = selectedContext.externalLinks.length > 0;
  const hasDocumentation = selectedContext.documentations.length > 0;
  const hasBlobStoreWork = selectedContext.selectedPullRequests.length > 0 || selectedContext.gitPrDiffSelections.length > 0 || selectedContext.extraContextEntries.length > 0 || selectedContext.extraContext.length > 0;
  const timedExternalLinksTask = async () => {
    const start = performance.now();
    const result = await externalLinksTask();
    enrichContextExternalLinksDuration.histogram(ctx, performance.now() - start, {
      hasWork: hasExternalLinks ? "true" : "false"
    });
    return result;
  };
  const timedDocumentationTask = async () => {
    const start = performance.now();
    const result = await documentationTask();
    enrichContextDocumentationDuration.histogram(ctx, performance.now() - start, {
      hasWork: hasDocumentation ? "true" : "false"
    });
    return result;
  };
  const timedBlobStoreTask = async () => {
    const start = performance.now();
    const result = await hydrateBlobStoreTask();
    enrichContextBlobStoreDuration.histogram(ctx, performance.now() - start, {
      hasWork: hasBlobStoreWork ? "true" : "false"
    });
    return result;
  };
  const externalLinksResult = await timedExternalLinksTask();
  const documentationResult = await timedDocumentationTask();
  const blobResult = await timedBlobStoreTask();
  const { prs: hydratedSelectedPullRequests, diffs: hydratedGitPrDiffSelections, extra: extraContextsToInclude } = blobResult;
  const activeTaskCount = (hasExternalLinks ? 1 : 0) + (hasDocumentation ? 1 : 0) + (hasBlobStoreWork ? 1 : 0);
  enrichContextActiveTaskCount.histogram(ctx, activeTaskCount);
  enrichContextDuration.histogram(ctx, performance.now() - enrichStart);
  const postEnrichmentStart = performance.now();
  for (const documentInfo of externalLinksResult.externalDocumentInfos) {
    documentFilePaths.push(documentInfo.path);
    allDocumentInfos.push(documentInfo);
  }
  for (const externalImage of externalLinksResult.externalImages) {
    userContent.push({
      type: "image",
      image: externalImage.imageBytes,
      mimeType: externalImage.mimeType
    });
  }
  if (externalLinksResult.linkContents.length > 0) {
    let linksText = `<external_links>
### Potentially Relevant Websearch Results

You should respond as if these information are known to you. Refrain from saying "I am unable to browse the internet" or "I don't have access to the internet" or "I'm unable to provide real-time news updates". This is your internet search results. Please always cite any links you referenced from the above search results in your response in markdown format.

-------
`;
    for (const linkContent of externalLinksResult.linkContents) {
      linksText += `Website URL: ${linkContent.url}
Website Title: ${linkContent.title}
Website Content:
${linkContent.content}
____

`;
    }
    linksText += `</external_links>`;
    userContent.push({
      type: "text",
      text: linksText
    });
  }
  if (allDocumentInfos.length > 0) {
    const documentsList = allDocumentInfos.map((d) => `- ${d.path}`).join("\n");
    userContent.push({
      type: "text",
      text: `<uploaded_documents>
The following documents have been saved to your filesystem. You can read them using your file-reading tool or other tools:
${documentsList}
</uploaded_documents>`
    });
  }
  if (allVideoInfos.length > 0) {
    const videosList = allVideoInfos.map((v2) => `- ${v2.path}`).join("\n");
    const watchVideoInstruction = canUseWatchVideoSubagent(config2) ? " You can watch them using your WatchVideo subagent." : "";
    userContent.push({
      type: "text",
      text: `<attached_videos>
The following videos have been attached by the user and saved to your filesystem.${watchVideoInstruction}
${videosList}
</attached_videos>`
    });
  }
  if (documentationResult !== void 0 && documentationResult.chunks.length > 0) {
    let docsText = `<documentation_context>
## Potentially Relevant Documentation:
-------
`;
    for (const chunk of documentationResult.chunks) {
      docsText += `Document Name: ${chunk.docName}
Document URL: ${chunk.pageUrl}
Document content:
${chunk.documentationChunk}
____

`;
    }
    docsText += `</documentation_context>`;
    userContent.push({
      type: "text",
      text: docsText
    });
  }
  const { selectedSkills, regularRules } = resolveSelectedContextSkillSections(selectedContext);
  const dropCustomPromptContext = config2.featureFlags?.dropCustomPromptContext === true;
  if (!dropCustomPromptContext && regularRules.length > 0) {
    const prefix = `<cursor_rules_context>
Cursor Rules are extra documentation provided by the user to help the AI understand the codebase.
Use them if they seem useful to the users most recent query, but do not use them if they seem unrelated.
`;
    const suffix = `</cursor_rules_context>`;
    const rulesText = regularRules.map((rule) => {
      const ruleName = rule.fullPath ? getFilenameWithoutExtension(rule.fullPath) : "Cursor Rule";
      const content = rule.content?.slice(0, MAX_RULE_LENGTH) ?? "";
      return `Rule Name: ${ruleName}
Description: ${content}`;
    }).join("\n\n");
    userContent.push({
      type: "text",
      text: `${prefix}
${rulesText}
${suffix}

`
    });
  }
  if (!dropCustomPromptContext && selectedSkills.length > 0) {
    const trackedSkillPaths = /* @__PURE__ */ new Set();
    for (const skill of selectedSkills) {
      const fullPath = skill.fullPath?.trim();
      if (!fullPath || trackedSkillPaths.has(fullPath)) {
        continue;
      }
      trackedSkillPaths.add(fullPath);
      recordSkillApplied(ctx, {
        entrypoint: "manually_attached",
        skillId: getSkillIdFromPath(fullPath),
        skillSource: getSkillSourceFromPath(fullPath),
        plugin: skill.plugin,
        marketplace: skill.marketplace,
        pluginId: skill.pluginId,
        marketplaceId: skill.marketplaceId
      });
    }
    userContent.push({
      type: "text",
      text: renderManuallyAttachedSkillsSection(selectedSkills) ?? ""
    });
  }
  if (selectedContext.cursorCommands.length > 0) {
    const commandsText = selectedContext.cursorCommands.map((cmd) => `

--- Cursor Command: ${cmd.name} ---
${cmd.content}
--- End Command ---`).join("\n");
    if (commandsText) {
      userContent.push({
        type: "text",
        text: `<cursor_commands>${commandsText}
</cursor_commands>`
      });
    }
  }
  if (selectedContext.gitDiff) {
    userContent.push(buildGitDiffUncommittedUserContent(selectedContext.gitDiff));
  }
  if (selectedContext.gitDiffFromBranchToMain) {
    userContent.push(buildGitDiffUserContent(selectedContext.gitDiffFromBranchToMain));
  }
  if (selectedContext.gitCommits.length > 0) {
    userContent.push(buildGitCommitsUserContent(selectedContext.gitCommits));
  }
  if (hydratedSelectedPullRequests.length > 0) {
    userContent.push(buildGitPullRequestsUserContent(hydratedSelectedPullRequests));
  }
  const recentAgents = config2.modelInfo?.isComposerMatterhorn === true && config2.modelInfo?.isRawTrainingSlug === true ? [] : selectedContext.recentAgentsContext?.recentAgents ?? [];
  if (recentAgents.length > 0) {
    const recentAgentsText = recentAgents.map((recentAgent) => {
      const trimmedOverview = recentAgent.overview?.trim();
      const overviewLine = trimmedOverview ? `
  overview: ${trimmedOverview}` : "";
      return `- ${recentAgent.name}${overviewLine}
  transcript_path: ${recentAgent.path}`;
    }).join("\n");
    userContent.push({
      type: "text",
      text: `<recent_agents_context>
The user has other recent agent conversations available as transcript files.
If they seem relevant to the user's current query, you may read them for additional context.
Do not read full transcript files in one go; search and read in targeted chunks.
${recentAgentsText}
</recent_agents_context>`
    });
  }
  if (selectedContext.selectedSubagents.length > 0) {
    const subagentNames = selectedContext.selectedSubagents.map((s3) => s3.name).join(", ");
    userContent.push({
      type: "text",
      text: `<subagent_delegation_context>
The user has indicated they want you to delegate work to the following subagent(s): ${subagentNames}

To delegate, call the Task tool with the subagent_type parameter. Example:
Task(subagent_type="${selectedContext.selectedSubagents[0]?.name}", prompt="your detailed task description")
</subagent_delegation_context>
`
    });
  }
  if (hydratedGitPrDiffSelections.length > 0) {
    const prDiffText = hydratedGitPrDiffSelections.map((selection) => {
      const lineRange = selection.startLine === selection.endLine ? `line ${selection.startLine}` : `lines ${selection.startLine}-${selection.endLine}`;
      let text2 = `<pr_review_content>
File: ${selection.filePath}
Location: ${lineRange}
PR URL: ${selection.prUrl}`;
      if (selection.diffContent) {
        text2 += `
Diff Content:
${selection.diffContent}`;
      }
      text2 += `
</pr_review_content>`;
      return text2;
    }).join("\n\n");
    userContent.push({
      type: "text",
      text: `<pr_review_context>
The user has attached diffs from a pull request
${prDiffText}
</pr_review_context>`
    });
  }
  if (selectedContext.consoleLogs.length > 0) {
    const logsText = selectedContext.consoleLogs.map((log5) => `${log5.level} ${new Date(log5.timestamp).toLocaleTimeString()}: ${log5.message}`).join("\n");
    userContent.push({
      type: "text",
      text: `<console_logs_context>
Recent logs from the runtime connected to the AI agent.
${logsText}
</console_logs_context>`
    });
  }
  if (selectedContext.uiElements.length > 0) {
    const uiElementsText = selectedContext.uiElements.map((uiElement) => {
      if (uiElement.component !== void 0 && uiElement.component !== "") {
        let parsedProps;
        if (uiElement.componentPropsJson !== void 0 && uiElement.componentPropsJson !== "") {
          try {
            parsedProps = JSON.parse(uiElement.componentPropsJson);
          } catch (_e2) {
            parsedProps = { error: "Invalid JSON" };
          }
        }
        return `<ui_element>
React Component: ${uiElement.component}
Props: ${parsedProps ? JSON.stringify(parsedProps, null, 2) : "None"}
xpath: ${uiElement.xpath}
</ui_element>`;
      } else {
        return `<ui_element>
${uiElement.element}
xpath: ${uiElement.xpath}
textContent: ${uiElement.textContent}
</ui_element>`;
      }
    }).join("\n\n");
    userContent.push({
      type: "text",
      text: `<selected_ui_elements>
The following UI elements have been selected by the user from the runtime.
${uiElementsText}
</selected_ui_elements>`
    });
  }
  if (selectedContext.selectedBrowsers.length > 0) {
    const browsersText = selectedContext.selectedBrowsers.map((browser) => {
      const title = browser.pageTitle || "Untitled";
      return `- ${title}
  URL: ${browser.url}
  Browser ID: ${browser.browserId}`;
    }).join("\n");
    userContent.push({
      type: "text",
      text: `<browser_context>
The user has attached the following browser tab(s) as context. You can use the Browser ID to interact with these tabs using browser tools:
${browsersText}
</browser_context>`
    });
  }
  userContent.push(...buildSimulatedMessagePromptUserContent({
    selectedContext,
    simulatedMsgReason,
    modelInfo: config2.modelInfo,
    environmentParamForSubagent: config2.featureFlags?.environmentParamForSubagent === true,
    babysitV2Prompt: config2.featureFlags?.babysitV2Prompt === true,
    enablePrCreationForgeGuidance: config2.featureFlags?.prCreationForgeGuidance === true,
    resolvedMode: mode
  }));
  for (const extraContext of extraContextsToInclude) {
    userContent.push({
      type: "text",
      text: extraContext
    });
  }
  postEnrichmentAssemblyDuration.histogram(ctx, performance.now() - postEnrichmentStart);
  processSelectedContextDuration.histogram(ctx, performance.now() - processSelectedContextStart);
  return {
    userContent,
    selectedImages,
    selectedVideos,
    selectedDocuments,
    imageFilePaths,
    videoFilePaths,
    documentFilePaths
  };
}

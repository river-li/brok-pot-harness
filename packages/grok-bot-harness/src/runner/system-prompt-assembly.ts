function createSystemPromptAssembly(deps) {
  let inMemoryProfilePromptSnapshot = null;
  let lastRenderedSectionShas = [];
  const hasParentPromptParity = !deps.isSubagentRunner || deps.isParentMediatedAutomationSubagent;
  function resolveProfileForPrompt() {
    const provider = deps.agentProfileProvider();
    if (provider != null) return provider();
    if (!hasParentPromptParity) return null;
    const agentStore = deps.agentStore();
    if (agentStore != null) {
      return {
        name: agentStore.getMetadata("name"),
        description: "",
        filePath: "",
        settingsFilePath: ""
      };
    }
    return null;
  }
  function getProfileSection(profile) {
    if (profile == null) return null;
    const isDescriptionPrompted = deps.gates.agentDescription();
    const title = profile.name.trim();
    const description10 = profile.description.trim();
    const lines2 = [];
    if (title.length > 0) {
      lines2.push(`Title: ${title}`);
      lines2.push(
        `Your agent name is "${title}". If the user asks for your name, answer with "${title}".`
      );
    }
    if (isDescriptionPrompted && description10.length > 0) {
      lines2.push(`Description: ${description10}`);
    }
    if (profile.filePath.length > 0) {
      const fields2 = isDescriptionPrompted ? '"name", "description", and "title" fields' : '"name" and "title" fields';
      const selfEdit = isDescriptionPrompted ? "To rename yourself or rewrite your own description" : "To rename yourself";
      const announced = isDescriptionPrompted ? "Name and description edits" : "Name edits";
      lines2.push(
        `Your profile is a JSON config file at ${profile.filePath} with ${fields2}, which you can read with your shell tools. ${selfEdit}, use the update_state tool (target "profile", action "set"); it preserves every field you do not pass. ${announced} are announced in a profile-update message for the current context and folded into this Agent profile section after the next conversation summary.`
      );
      lines2.push(
        'Your profile picture is NOT part of that config \u2014 it is a conventional image file named "avatar.png" (or avatar.jpg/.jpeg/.webp/.gif/.svg) in the same directory, which you can read with your shell tools. To set it, put the image somewhere first (Shell under /workspace is fine \u2014 no CopyFromBox needed \u2014 or Shell with machineId on a selected registered user computer), then call update_state (target "avatar", action "set", path=...); to go back to the default picture, update_state target "avatar", action "clear". Never change your picture unless the user asks.'
      );
    }
    if (profile.settingsFilePath.length > 0) {
      lines2.push(
        `Your per-agent settings live in a separate JSON config file at ${profile.settingsFilePath}, readable the same way and changed with update_state (target "settings", action "set"). "hidden_from_sidebar" (true/false) removes your own row from the user's sidebar: you stay fully functional \u2014 you keep your conversation, keep receiving messages, keep running your routines, and still accrue unread \u2014 and the user can still reach you through the Hidden chats manager and Cmd-K; the default is visible. Pass only the fields you mean to change; the rest are preserved.`
      );
    }
    if (lines2.length === 0) return null;
    return ["Agent profile:", ...lines2].join("\n");
  }
  function readAgentProfilePromptSnapshot(store) {
    return store != null ? store.getAgentProfilePromptSnapshot() : inMemoryProfilePromptSnapshot;
  }
  function persistAgentProfilePromptSnapshot(store, snapshot) {
    inMemoryProfilePromptSnapshot = snapshot;
    store?.setAgentProfilePromptSnapshot(snapshot);
  }
  function prepareAgentProfilePromptSnapshot(store) {
    if (!hasParentPromptParity || deps.agentProfileProvider() == null) {
      return void 0;
    }
    const profile = resolveProfileForPrompt();
    const profileSection = getProfileSection(profile);
    if (profile == null || profileSection == null) return void 0;
    const current = store?.getAgentProfilePromptSnapshot() ?? (store == null ? inMemoryProfilePromptSnapshot : null);
    const resolved = resolveAgentProfilePromptSnapshot({
      snapshot: current,
      profileSection,
      identity: promptedAgentProfileIdentity(profile, deps.gates.agentDescription()),
      compactionEpoch: deps.compactionEpoch()
    });
    inMemoryProfilePromptSnapshot = resolved;
    if (resolved !== current) {
      store?.setAgentProfilePromptSnapshot(resolved);
    }
    return resolved;
  }
  function persistAnnouncedAgentProfile(store, turnSnapshot, identity) {
    const current = readAgentProfilePromptSnapshot(store);
    if (current == null || current.compactionEpoch !== turnSnapshot.compactionEpoch || current.profileSection !== turnSnapshot.profileSection || !agentProfileIdentitiesEqual(current.systemIdentity, turnSnapshot.systemIdentity) || agentProfileIdentitiesEqual(current.announcedIdentity, identity)) {
      return;
    }
    persistAgentProfilePromptSnapshot(store, {
      ...current,
      announcedIdentity: identity
    });
  }
  function getAgentProfileUpdateForTurn(snapshot) {
    const provider = deps.agentProfileProvider();
    if (snapshot == null || provider == null) return null;
    const isDescriptionPrompted = deps.gates.agentDescription();
    const identity = promptedAgentProfileIdentity(provider(), isDescriptionPrompted);
    const announced = promptedAgentProfileIdentity(
      snapshot.announcedIdentity,
      isDescriptionPrompted
    );
    if (agentProfileIdentitiesEqual(identity, announced)) {
      return null;
    }
    return { text: renderAgentProfileUpdate(identity), identity };
  }
  function renderMemoryLive() {
    const store = deps.memoryStore();
    if (store == null) return null;
    const renderLive = () => {
      const agentRecall = store.recall(MEMORY_RECENT_PROMPT_LIMIT);
      const agentRender = renderMemorySystemPrompt(agentRecall, store.getLocation(), {
        conversationMemory: store.memoryScopes
      });
      let hasFacts = agentRecall.profile.length > 0 || agentRecall.recent.length > 0;
      const parts = [];
      const userMemory = deps.userMemory();
      if (userMemory != null) {
        const userRecall = userMemory.recall({
          profileLimit: MEMORY_USER_PROFILE_PROMPT_LIMIT,
          recentLimit: MEMORY_USER_RECENT_PROMPT_LIMIT
        });
        const userRender = renderUserMemorySystemPrompt(userRecall, {
          userMemoryDir: userMemory.getLocation(),
          ownShardDir: userMemory.getOwnShardLocation()
        });
        if (userRender.length > 0) parts.push(userRender);
        if (userRecall.profile.length > 0 || userRecall.recent.length > 0) {
          hasFacts = true;
        }
      }
      const projectMemory = deps.projectMemory();
      if (projectMemory != null) {
        const projectRecall = projectMemory.recall(
          {
            profileLimit: MEMORY_PROJECT_PROFILE_PROMPT_LIMIT,
            recentLimit: MEMORY_PROJECT_RECENT_PROMPT_LIMIT
          },
          MEMORY_PROJECT_INJECTED_CAP
        );
        const projectRender = renderProjectMemorySystemPrompt(projectRecall, {
          projectsRootDir: projectMemory.getLocation()
        });
        if (projectRender.length > 0) parts.push(projectRender);
        if (projectMemoryHasFacts(projectRecall)) hasFacts = true;
      }
      if (agentRender.length > 0) parts.push(agentRender);
      return { render: parts.join("\n\n"), hasFacts };
    };
    return renderLive();
  }
  function memoryLiveOrNull() {
    const live = renderMemoryLive();
    return live != null && live.render.length > 0 ? live.render : null;
  }
  function memoryPinUnlessUserTierLost(pin) {
    if (pin === null || deps.userMemory() != null) return pin;
    return pin.render.includes(USER_MEMORY_PROMPT_HEADER) ? null : pin;
  }
  function pinnedSection(store, name17) {
    const pin = store.getPromptSectionSnapshot(name17);
    if (name17 === "memory") return memoryPinUnlessUserTierLost(pin);
    if (name17 === "tool_notes" && pin?.render === "") return null;
    return pin;
  }
  function getMemorySection() {
    if (deps.memoryStore() == null) return null;
    if (deps.promptSectionSnapshots() !== void 0) return frozen("memory", memoryLiveOrNull);
    const snapshots = deps.memorySnapshots();
    const renderLive = () => renderMemoryLive() ?? { render: "", hasFacts: false };
    if (snapshots == null || !isMemoryFreezeEnabled()) {
      const { render: render2 } = renderLive();
      return render2.length > 0 ? render2 : null;
    }
    const stored = snapshots.getMemoryPromptSnapshot();
    const snapshot = memoryPinUnlessUserTierLost(stored);
    const resolved = resolveFrozenMemoryPrompt({
      snapshot,
      compactionEpoch: deps.compactionEpoch(),
      renderLive
    });
    if (resolved.snapshotToPersist != null) {
      snapshots.setMemoryPromptSnapshot(resolved.snapshotToPersist);
    } else if (snapshot !== stored) {
      snapshots.clearMemoryPromptSnapshot();
    }
    return resolved.render.length > 0 ? resolved.render : null;
  }
  function frozen(name17, renderLive) {
    const store = deps.promptSectionSnapshots();
    if (store === void 0) return renderLive();
    const resolved = resolveFrozenPromptSection({
      snapshot: pinnedSection(store, name17),
      compactionEpoch: deps.compactionEpoch(),
      renderLive,
      absentIsUnresolved: isFrozenPromptSectionAbsenceUnresolved(name17)
    });
    if (resolved.snapshotToPersist !== void 0) {
      store.setPromptSectionSnapshot(name17, resolved.snapshotToPersist);
    }
    return resolved.render;
  }
  function liveFrozenSection(name17) {
    switch (name17) {
      case "timezone":
        return renderTimeZoneSectionLive();
      case "memory":
        return deps.memoryStore() == null ? null : memoryLiveOrNull();
      case "automations":
        return renderAutomationsLive(skillifyEnabled());
      case "agent_directory":
        return renderAgentDirectoryLive();
      case "mcp_instructions":
        return deps.mcpCustomInstructionsSection();
      case "tool_notes":
        return renderToolNotesLive();
    }
  }
  function renderToolNotesLive() {
    return deps.toolNotesSection?.() ?? null;
  }
  function getToolNotesSection() {
    if (renderToolNotesLive() === null) return null;
    return frozen("tool_notes", renderToolNotesLive);
  }
  function getFrozenSectionUpdatesForTurn() {
    const store = deps.promptSectionSnapshots();
    if (store === void 0) return null;
    const compactionEpoch = deps.compactionEpoch();
    const updates = [];
    for (const name17 of SAND_FROZEN_PROMPT_SECTIONS_WITH_TURN_NOTES) {
      if (name17 === "tool_notes" && renderToolNotesLive() === null) continue;
      const update = resolveFrozenPromptSectionUpdate({
        name: name17,
        snapshot: pinnedSection(store, name17),
        compactionEpoch,
        live: liveFrozenSection(name17)
      });
      if (update !== null) updates.push(update);
    }
    const text2 = renderFrozenPromptSectionUpdates(updates);
    if (text2 === null) return null;
    return {
      text: text2,
      commit: () => {
        for (const update of updates) {
          store.setPromptSectionSnapshot(update.name, update.snapshotToPersist);
        }
      }
    };
  }
  function renderTimeZoneSectionLive() {
    if (deps.isBoxScopedSubagent()) return null;
    const rendered = renderTimeZoneSystemPrompt(deps.requestContext.resolve().timeZone);
    return rendered.length > 0 ? rendered : null;
  }
  function getTimeZoneSection() {
    return frozen("timezone", renderTimeZoneSectionLive);
  }
  function getUserIdentitySection() {
    const rendered = renderUserIdentitySystemPrompt(deps.requestContext.resolve().userFullName);
    return rendered.length > 0 ? rendered : null;
  }
  function getAutomationsSection(skillify) {
    if (deps.automationStore() == null) return null;
    return frozen("automations", () => renderAutomationsLive(skillify));
  }
  function renderAutomationsLive(skillify) {
    const store = deps.automationStore();
    if (store == null) return null;
    const teamBot = deps.teamBot?.();
    const slackListenerInvite = teamBotSlackListenerInvite(teamBot?.slack);
    const rendered = renderAutomationsSystemPrompt(
      (store.listDefinitions?.() ?? store.list()).slice(0, AUTOMATION_UI_LIMIT),
      store.getLocation(),
      deps.requestContext.resolve().timeZone,
      {
        mcpDiscoveryToolName: sandMcpMetaToolNames(usesDynamicToolNamespaces()).discovery,
        fiveMinuteAutomationFloorEnabled: deps.gates.fiveMinuteAutomationFloor(),
        communicationMode: deps.isParentMediatedAutomationSubagent ? "parent-mediated" : "direct",
        folderOnBox: store.hostedOnServer !== true,
        skillify,
        ...slackListenerInvite === void 0 ? {} : { slackListenerBotMention: slackListenerInvite.botMention },
        ...teamBot === void 0 ? {} : { teamBot: true }
      }
    );
    return rendered.length > 0 ? rendered : null;
  }
  function getSkillsSection(skillify) {
    const store = deps.skillStore();
    if (store == null) return null;
    const teamBot = deps.teamBot?.() !== void 0;
    const rendered = renderSkillsSystemPrompt(store.getLocation(), {
      ...skillify ? { skillPointer: SKILLIFY_SKILLS_POINTER } : {},
      virtualSkillFiles: store.virtualSkillFiles === true,
      ...teamBot ? {
        teamBot: true,
        ownerSkillsListed: store.list().some((skill) => skill.source === "workflow")
      } : {}
    });
    return rendered.length > 0 ? rendered : null;
  }
  function getChannelsSection(skillify) {
    if (deps.isParentMediatedAutomationSubagent) return null;
    const store = deps.channelStore();
    if (store == null) return null;
    const manifests = deps.connectorManifests;
    const enabledPlatforms = new Set(manifests.map((manifest) => manifest.platform));
    const connections = store.listConnections().filter((connection) => enabledPlatforms.has(connection.platform));
    const rendered = renderChannelsSystemPrompt(
      manifests,
      connections,
      store.getLocation(),
      skillify ? { skillPointer: SKILLIFY_CHANNELS_POINTER } : void 0
    );
    return rendered.length > 0 ? rendered : null;
  }
  function getAgentDirectorySection() {
    if (!hasParentPromptParity || deps.isParentMediatedAutomationSubagent) return null;
    return frozen("agent_directory", renderAgentDirectoryLive);
  }
  function renderAgentDirectoryLive() {
    if (!hasParentPromptParity || deps.isParentMediatedAutomationSubagent) return null;
    if (deps.sendToAgentImpl == null && deps.agentManagement == null) {
      return null;
    }
    const others = deps.agentDirectory?.() ?? [];
    const groups = deps.agentGroups?.() ?? [];
    return renderAgentDirectorySystemPrompt(others, groups, deps.agentsRootDir?.(), {
      hasChannelTools: deps.channelManagement != null,
      canonicalArgumentNames: deps.gates.reducePeerChatter()
    });
  }
  function getMultitaskSection(conservativeExecutorReuse) {
    if (!hasParentPromptParity || deps.isSystemPromptOverridden) {
      return null;
    }
    if (deps.isParentMediatedAutomationSubagent) {
      return conservativeExecutorReuse ? sandParentMediatedAutomationMultitaskPromptSection({
        conservativeExecutorReuse: true
      }) : SAND_PARENT_MEDIATED_AUTOMATION_MULTITASK_PROMPT_SECTION;
    }
    return conservativeExecutorReuse ? sandDelegationAndMultitaskPromptSection({ conservativeExecutorReuse: true }) : SAND_DELEGATION_AND_MULTITASK_PROMPT_SECTION;
  }
  function getMcpMultiAccountSection(skillify) {
    if (!hasParentPromptParity || deps.mcpManagement() == null) return null;
    if (!deps.gates.mcpMultiAccount()) return null;
    if (deps.isParentMediatedAutomationSubagent) {
      return SAND_PARENT_MEDIATED_AUTOMATION_SUBAGENT_MCP_MULTI_ACCOUNT_PROMPT_SECTION;
    }
    return skillify ? null : SAND_MCP_MULTI_ACCOUNT_PROMPT_SECTION;
  }
  function getInternalDetailsBoundaryLine() {
    if (deps.isSubagentRunner || deps.isSystemPromptOverridden) return null;
    if (!deps.gates.internalDetailsBoundary()) return null;
    return SAND_INTERNAL_DETAILS_BOUNDARY_PROMPT_LINE;
  }
  function getDraftExternalMessageSection(skillify) {
    if (!hasParentPromptParity || deps.isParentMediatedAutomationSubagent || deps.isSystemPromptOverridden) {
      return null;
    }
    if (!deps.gates.draftExternalMessage()) return null;
    return skillify ? null : SAND_DRAFT_EXTERNAL_MESSAGE_PROMPT_SECTION;
  }
  function getUserFormSection(skillify) {
    if (!hasParentPromptParity || deps.isParentMediatedAutomationSubagent || deps.isSystemPromptOverridden) {
      return null;
    }
    if (deps.isUserFormEnabled?.() !== true) return null;
    return skillify ? null : SAND_USER_FORM_PROMPT_SECTION;
  }
  function skillifyEnabled() {
    if (deps.isSystemPromptOverridden || !hasParentPromptParity) return false;
    return !deps.isParentMediatedAutomationSubagent;
  }
  function usesDynamicToolNamespaces() {
    return hasParentPromptParity && !deps.isBoxScopedSubagent() && deps.gates.dynamicTools();
  }
  function includesVoiceCallPrompt() {
    return deps.gates.voiceCall() && !deps.isSubagentRunner;
  }
  function getBaseSystemPrompt(sendToUserEndTurnEnabled, useSkillify) {
    if (deps.isSystemPromptOverridden) return deps.basePrompt;
    const cloudAgentsEnabled = !deps.gates.cloudAgentsDisabledByTeam();
    const canvasesEnabled = deps.gates.canvases();
    const dynamicToolsEnabled = usesDynamicToolNamespaces();
    const voiceCallEnabled = deps.gates.voiceCall();
    const cloudAgentArtifactsEnabled = deps.gates.cloudAgentArtifacts();
    const cloudAgentDurableWatchEnabled = deps.gates.cloudAgentDurableWatch();
    const cloudAgentReplyModesEnabled = deps.gates.cloudAgentReplyModes();
    const updateCommunication = deps.gates.updateCommunication();
    const hostSurfaces = {
      userComputer: deps.hasUserComputer?.() !== false,
      generateImage: deps.hasGenerateImage?.() !== false
    };
    const agentEmailEnabled = deps.gates.agentEmail();
    if (deps.isParentMediatedAutomationSubagent) {
      return sandAutomationSubagentSystemPromptVariant({
        cloudAgentsEnabled,
        canvasesEnabled,
        dynamicToolsEnabled,
        credentialFillEnabled: deps.credentialFillEnabled === true,
        voiceCallEnabled,
        cloudAgentArtifactsEnabled,
        cloudAgentDurableWatchEnabled,
        cloudAgentReplyModesEnabled,
        hostSurfaces,
        updateCommunication,
        agentEmailEnabled
      });
    }
    return sandBaseSystemPromptVariant({
      sendToUserEndTurnEnabled,
      cloudAgentsEnabled,
      canvasesEnabled,
      dynamicToolsEnabled,
      credentialFillEnabled: deps.credentialFillEnabled === true,
      voiceCallEnabled,
      cloudAgentArtifactsEnabled,
      cloudAgentDurableWatchEnabled,
      cloudAgentReplyModesEnabled,
      hostSurfaces,
      skillifyEnabled: useSkillify,
      updateCommunication,
      activeReactions: deps.gates.activeReactions(),
      agentEmailEnabled
    });
  }
  function getStripeLinkPurchasingSection(skillify) {
    if (!hasParentPromptParity || deps.isParentMediatedAutomationSubagent) return null;
    if (!deps.gates.stripeLink()) return null;
    return skillify ? null : STRIPE_LINK_PURCHASING_SYSTEM_PROMPT_SECTION;
  }
  function getCurrentSessionSection() {
    if (!hasParentPromptParity || deps.isSystemPromptOverridden) return null;
    return renderCurrentSessionPrompt(deps.currentSession?.());
  }
  function getTeamBotSection() {
    if (!hasParentPromptParity || deps.isSystemPromptOverridden) return null;
    return renderTeamBotPrompt(deps.teamBot?.());
  }
  function getActiveSessionsSection() {
    if (!hasParentPromptParity || deps.isSystemPromptOverridden) return null;
    const sessions = deps.activeSessionsDigest?.();
    if (sessions == null || sessions.length === 0) return null;
    const rendered = renderActiveSessionsDigest(sessions);
    return rendered.length > 0 ? rendered : null;
  }
  function getGroupChatTurnsSection(skillify) {
    if (!hasParentPromptParity || deps.isParentMediatedAutomationSubagent) return null;
    if ((deps.agentGroups?.() ?? []).length === 0) return null;
    return skillify ? null : SAND_GROUP_CHAT_TURNS_PROMPT_SECTION;
  }
  function renderSystemPrompt(profileSnapshot, sendToUserEndTurnEnabled = false, conservativeExecutorReuse = !deps.isSystemPromptOverridden && deps.gates.lessSubagentFanout(), useSkillify = skillifyEnabled()) {
    const basePrompt = getBaseSystemPrompt(
      sendToUserEndTurnEnabled && !deps.isSubagentRunner,
      useSkillify
    );
    const sections = [];
    const shas = [];
    const push = (name17, text2) => {
      if (text2 == null) return;
      sections.push(text2);
      shas.push({ name: name17, sha: sha256HexOfText(text2) });
    };
    push("base", basePrompt);
    if (deps.gates.spotlight()) {
      push(
        "spotlight",
        spotlightPromptSection({
          canSendMessage: hasParentPromptParity,
          omitSendToolName: deps.isParentMediatedAutomationSubagent
        })
      );
    }
    if (includesVoiceCallPrompt()) {
      push(
        "voice_channel",
        useSkillify ? SKILLIFY_VOICE_CHANNEL_STUB : MainLoopVoicePrompt.channelSection({ sendTool: SAND_SEND_TO_USER_TOOL_NAME })
      );
    }
    const profile = resolveProfileForPrompt();
    push("profile", profileSnapshot?.profileSection ?? getProfileSection(profile));
    push("user_identity", getUserIdentitySection());
    push("team_bot", getTeamBotSection());
    push("multitask", getMultitaskSection(conservativeExecutorReuse));
    push("internal_details_boundary", getInternalDetailsBoundaryLine());
    push("mcp_multi_account", getMcpMultiAccountSection(useSkillify));
    push("user_form", getUserFormSection(useSkillify));
    push("draft_external_message", getDraftExternalMessageSection(useSkillify));
    push("timezone", getTimeZoneSection());
    push("memory", getMemorySection());
    push("current_session", getCurrentSessionSection());
    push("active_sessions", getActiveSessionsSection());
    push("automations", getAutomationsSection(useSkillify));
    push("skills", getSkillsSection(useSkillify));
    push("stripe_link_purchasing", getStripeLinkPurchasingSection(useSkillify));
    push("channels", getChannelsSection(useSkillify));
    push("agent_directory", getAgentDirectorySection());
    push("group_chat_turns", getGroupChatTurnsSection(useSkillify));
    push("mcp_instructions", frozen("mcp_instructions", deps.mcpCustomInstructionsSection));
    push("tool_notes", getToolNotesSection());
    push("mcp_status", deps.mcpDiscoveryStatusSection());
    push("remote_box", deps.remoteBoxSection());
    push("bot_secrets", renderBotSecretsSection(deps.botSecrets()));
    push("computer", deps.computerSection(useSkillify));
    lastRenderedSectionShas = shas;
    return sections.join("\n\n");
  }
  function createSystemPromptGeneratorForRun({
    profileSnapshot,
    sendToUserEndTurnEnabled = () => false,
    promptPolicy
  }) {
    const { conservativeExecutorReuse } = promptPolicy;
    const useSkillify = skillifyEnabled();
    return () => renderSystemPrompt(
      profileSnapshot,
      sendToUserEndTurnEnabled(),
      conservativeExecutorReuse,
      useSkillify
    );
  }
  return {
    getSystemPrompt: (profileSnapshot) => renderSystemPrompt(profileSnapshot),
    getLastRenderedSectionShas: () => lastRenderedSectionShas,
    getFrozenSectionUpdatesForTurn,
    createSystemPromptGeneratorForRun,
    prepareAgentProfilePromptSnapshot,
    getAgentProfileUpdateForTurn,
    persistAnnouncedAgentProfile,
    resetProfileSnapshotFallback: () => {
      inMemoryProfilePromptSnapshot = null;
    }
  };
}

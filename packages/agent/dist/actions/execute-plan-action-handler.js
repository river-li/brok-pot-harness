/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/agent/dist/actions/execute-plan-action-handler.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/2
init_dist4();
init_agent_pb();
init_read_exec_pb();
init_selected_context_pb();
init_todo_tool_pb();
init_utils_pb2();
init_write_exec_pb();

// @recovered-fragment 2/2
var __addDisposableResource26 = function(env, value, async) {
  if (value !== null && value !== void 0) {
    if (typeof value !== "object" && typeof value !== "function") throw new TypeError("Object expected.");
    var dispose, inner;
    if (async) {
      if (!Symbol.asyncDispose) throw new TypeError("Symbol.asyncDispose is not defined.");
      dispose = value[Symbol.asyncDispose];
    }
    if (dispose === void 0) {
      if (!Symbol.dispose) throw new TypeError("Symbol.dispose is not defined.");
      dispose = value[Symbol.dispose];
      if (async) inner = dispose;
    }
    if (typeof dispose !== "function") throw new TypeError("Object not disposable.");
    if (inner) dispose = function() {
      try {
        inner.call(this);
      } catch (e) {
        return Promise.reject(e);
      }
    };
    env.stack.push({ value, dispose, async });
  } else if (async) {
    env.stack.push({ async: true });
  }
  return value;
};
var __disposeResources26 = /* @__PURE__ */ (function(SuppressedError2) {
  return function(env) {
    function fail(e) {
      env.error = env.hasError ? new SuppressedError2(e, env.error, "An error was suppressed during disposal.") : e;
      env.hasError = true;
    }
    var r, s3 = 0;
    function next() {
      while (r = env.stack.pop()) {
        try {
          if (!r.async && s3 === 1) return s3 = 0, env.stack.push(r), Promise.resolve().then(next);
          if (r.dispose) {
            var result = r.dispose.call(r.value);
            if (r.async) return s3 |= 2, Promise.resolve(result).then(next, function(e) {
              fail(e);
              return next();
            });
          } else s3 |= 1;
        } catch (e) {
          fail(e);
        }
      }
      if (s3 === 1) return env.hasError ? Promise.reject(env.error) : Promise.resolve();
      if (env.hasError) throw env.error;
    }
    return next();
  };
})(typeof SuppressedError === "function" ? SuppressedError : function(error42, suppressed, message) {
  var e = new Error(message);
  return e.name = "SuppressedError", e.error = error42, e.suppressed = suppressed, e;
});
var logger68 = createLogger("@anysphere/agent:execute-plan");
function sanitizePlanFileName(candidate) {
  const lastSegment = candidate.split(/[/\\]/).pop() ?? "";
  const sanitized = lastSegment.replace(/[^A-Za-z0-9._-]/g, "_");
  if (sanitized.length === 0 || sanitized === "." || sanitized === "..") {
    return void 0;
  }
  return sanitized;
}
var ExecutePlanActionHandler = class extends AbstractUserMessageActionHandler {
  getFirstUserInfoRequestContextCompleteness(priorMessages) {
    const firstMsg = priorMessages[0];
    if (firstMsg?.role !== "user") {
      return void 0;
    }
    return parseRequestContextCompletenessMetadata(firstMsg.providerOptions?.cursor?.requestContextCompleteness);
  }
  getFirstUserInfoSummarizationEpoch(priorMessages) {
    const firstMsg = priorMessages[0];
    if (firstMsg?.role !== "user") {
      return void 0;
    }
    return parseUserInfoSummarizationEpochMetadata(firstMsg.providerOptions?.cursor?.userInfoSummarizationEpoch);
  }
  async resolvePlanFilePath(ctx, requestContext, action, planFileContent) {
    const providedPlanFilePath = action.planFilePath?.unwrap(PrivacyCapability.UNSAFE_ALWAYS_ALLOWED) || void 0;
    const artifactsFolder = requestContext.env?.artifactsFolder;
    if (artifactsFolder === void 0 || artifactsFolder.length === 0) {
      return {
        planFilePath: providedPlanFilePath,
        recreatedPlanFilePath: void 0,
        shouldUpsertPlanRegistryEntry: false,
        availability: "unknown"
      };
    }
    let readResultCase;
    try {
      if (providedPlanFilePath !== void 0) {
        const readResult = await this.resourceAccessor.get(readExecutorResource).execute(
          ctx,
          // Probe existence only; plan content is already available in-memory.
          new ReadArgs({ path: providedPlanFilePath, limit: 1 })
        );
        readResultCase = readResult.result.case;
        if (readResult.result.case === "success") {
          return {
            planFilePath: providedPlanFilePath,
            recreatedPlanFilePath: void 0,
            shouldUpsertPlanRegistryEntry: true,
            availability: "on_disk"
          };
        }
      }
      const pathModule = getRequestPathModule(requestContext);
      const fallbackFileName = (providedPlanFilePath !== void 0 ? sanitizePlanFileName(providedPlanFilePath) : void 0) ?? (action.planId !== void 0 ? sanitizePlanFileName(`${action.planId}.plan.md`) : void 0) ?? "plan.md";
      const recreatedPlanFilePath = pathModule.join(artifactsFolder, "plans", fallbackFileName);
      const writeResult = await this.resourceAccessor.get(writeExecutorResource).execute(ctx, new WriteArgs({
        path: recreatedPlanFilePath,
        fileText: planFileContent,
        returnFileContentAfterWrite: false
      }));
      if (writeResult.result.case !== "success") {
        logger68.warn(ctx, "agent.execute_plan.plan_file_recreate_failed", {
          planId: action.planId,
          hasProvidedPlanFilePath: providedPlanFilePath !== void 0,
          readResultCase,
          writeResultCase: writeResult.result.case
        });
        return {
          planFilePath: providedPlanFilePath,
          recreatedPlanFilePath: void 0,
          shouldUpsertPlanRegistryEntry: false,
          availability: "unavailable"
        };
      }
      logger68.info(ctx, "agent.execute_plan.plan_file_recreated", {
        planId: action.planId,
        hasProvidedPlanFilePath: providedPlanFilePath !== void 0,
        readResultCase
      });
      return {
        planFilePath: recreatedPlanFilePath,
        recreatedPlanFilePath,
        shouldUpsertPlanRegistryEntry: true,
        availability: "on_disk"
      };
    } catch (error42) {
      logger68.error(ctx, "agent.execute_plan.plan_file_resolution_failed", error42, {
        planId: action.planId,
        hasProvidedPlanFilePath: providedPlanFilePath !== void 0,
        readResultCase
      });
      return {
        planFilePath: providedPlanFilePath,
        recreatedPlanFilePath: void 0,
        shouldUpsertPlanRegistryEntry: false,
        availability: "unavailable"
      };
    }
  }
  async initializeConversation(ctx, action, rootPromptExecutor, stateHandler, mcpTools) {
    const { requestContext, provenance: requestContextProvenance } = await resolveRequestContext({
      parentCtx: ctx,
      maybeRequestContext: action.requestContext ? fromRedactedRequestContext(action.requestContext, PrivacyCapability.UNSAFE_ALWAYS_ALLOWED) : void 0,
      resources: this.resourceAccessor,
      options: buildRequestContextOptions(this.config)
    });
    const unredResolvedPlanContent = action.planFileContent?.unwrap(PrivacyCapability.UNSAFE_ALWAYS_ALLOWED) ?? (stateHandler.plan ? (await stateHandler.plan.get(ctx)).plan.unwrap(PrivacyCapability.UNSAFE_ALWAYS_ALLOWED) : void 0);
    let planMarksProject = false;
    try {
      planMarksProject = unredResolvedPlanContent !== void 0 && grayMatter(unredResolvedPlanContent).data.isProject === true;
    } catch {
    }
    let isRootProject = this.config.agentType === AgentType.IDE && await isProjectWorkspaceConversation(ctx, stateHandler);
    isRootProject ||= this.config.agentType === AgentType.IDE && planMarksProject;
    const projectConversationContext = await resolveProjectConversationContext(ctx, stateHandler);
    if (isRootProject || projectConversationContext.hasProjectBoundary && projectConversationContext.isRootProject) {
      stateHandler.isRootProjectConversation = true;
    }
    const executionMode = stateHandler.resolveTurnMode({
      mode: action.executionMode !== void 0 && action.executionMode !== AgentMode.UNSPECIFIED ? action.executionMode : AgentMode.AGENT
    });
    const { omitCloudWorkerProcedure, useProjectCoordinatorPrompting } = resolveRootCoordinatorPrompting({
      omitCloudWorkerProcedureGateEnabled: this.config.featureFlags?.projectRootCoordinatorPrompt === true,
      localParityPromptGateEnabled: this.config.featureFlags?.projectRootCoordinatorLocalParityPrompt === true,
      agentType: this.config.agentType,
      mode: executionMode,
      useLocalAgentPrompting: this.config.useLocalAgentPrompting === true,
      isNamedAgentSession: getNamedAgentSessionPromptContext(this.config) !== void 0 || isNamedAgentHomePromptSession(this.config),
      isRootProject: projectConversationContext.hasProjectBoundary ? projectConversationContext.isRootProject : planMarksProject
    });
    const rules = getAllRules(requestContext, this.config.nonFileRules, this.config.featureFlags);
    const mergedMcpTools = this.mergeRequestContextTools(mcpTools, requestContext.tools);
    const toolSetHandle = this.config.toolsGenerator({
      resourceAccessor: this.resourceAccessor,
      stateHandler,
      agentSessionId: this.config.agentSessionId,
      mcpTools: mergedMcpTools,
      repositoryInfos: requestContext.repositoryInfo,
      blobStore: stateHandler.getBlobStore(),
      mode: executionMode,
      loggingContext: ctx,
      requestContext,
      fileOperationLockManager: new FileOperationLockManager(),
      smartModeClassifierMode: this.config.smartModeClassifierMode,
      smartModeClassifierShadowMode: this.config.smartModeClassifierShadowMode,
      autoRejectFirstAskQuestion: this.config.autoRejectFirstAskQuestion
    });
    const toolInfo = extractToolInfo(toolSetHandle);
    const priorMessages = rootPromptExecutor.getMessages().filter((m2) => m2.role !== "system");
    const hasExistingNonSystemMessages = priorMessages.length > 0;
    const firstUserInfoRequestContextCompleteness = this.getFirstUserInfoRequestContextCompleteness(priorMessages);
    const requestContextCompleteness = getRequestContextCompleteness(requestContext);
    const userInfoMcpMetaToolOptions = getUserInfoMcpMetaToolOptions(requestContext.mcpMetaToolOptions, mergedMcpTools, toolSetHandle);
    const userInfoRerenderReason = getUserInfoRerenderReason({
      priorMessages,
      agentTypeChanged: stateHandler.hasAgentTypeChangedFromPersistedState(),
      availableSubagentModelsDescription: toolInfo.availableSubagentModelsDescription,
      availableSubagentTypesDescription: toolInfo.availableSubagentTypesDescription,
      mcpMetaToolOptions: userInfoMcpMetaToolOptions
    });
    const needsUserInfoRerender = userInfoRerenderReason !== void 0;
    const needsRequestContextRecoveryRerender = this.config.featureFlags?.rerenderUserInfoOnRequestContextRecovery === true && shouldRerenderUserInfoForRequestContextRecovery({
      previousCompleteness: firstUserInfoRequestContextCompleteness,
      currentCompleteness: requestContextCompleteness
    });
    const currentSummarizationEpoch = stateHandler.summaryArchives.length;
    const firstUserInfoContent = getFirstUserInfoMessageContent(priorMessages);
    const needsSummarizationRerender = this.config.featureFlags?.rerenderUserInfoOnSummarization === true && shouldRerenderUserInfoAfterSummarization({
      previousEpoch: this.getFirstUserInfoSummarizationEpoch(priorMessages),
      currentEpoch: currentSummarizationEpoch,
      hasUserInfo: firstUserInfoContent !== void 0
    });
    const userInfoCloudTestingSectionsPlacement = getComposer2CloudTestingSectionsPlacement({
      modelInfo: this.config.modelInfo,
      enableComposer2IntelligentTestingPromptSection: this.config.enableComposer2IntelligentTestingPromptSection,
      backgroundAgentSource: this.config.backgroundAgentSource,
      agentType: this.config.agentType,
      enableCloudTesting: this.config.enableCloudTesting,
      featureFlags: this.config.featureFlags,
      namedAgentSessionKind: this.config.namedAgentSessionKind,
      isCloudMetaAgentParent: this.config.isCloudMetaAgentParent
    });
    const needsCloudTestingPlacementRerender = hasExistingNonSystemMessages && firstUserInfoContent !== void 0 && userInfoCloudTestingSectionsPlacement !== void 0 && getFirstUserInfoCloudTestingSectionsPlacement(priorMessages) !== userInfoCloudTestingSectionsPlacement;
    const needsOmitCloudWorkerProcedureRerender = hasExistingNonSystemMessages && getFirstUserInfoOmitCloudWorkerProcedure(priorMessages) !== omitCloudWorkerProcedure;
    const needsProjectCoordinatorPromptingRerender = hasExistingNonSystemMessages && getFirstUserInfoProjectCoordinatorPrompting(priorMessages) !== useProjectCoordinatorPrompting;
    const newMessages = [];
    const systemPromptProps = {
      requestContext,
      cursorRules: rules,
      env: requestContext.env,
      cloudRule: requestContext.cloudRule ?? void 0,
      mode: executionMode,
      omitCloudWorkerProcedure,
      useProjectCoordinatorPrompting
    };
    const systemPromptContent = this.config.systemPromptGenerator(systemPromptProps, toolSetHandle);
    const systemPromptFingerprint = buildSystemPromptFingerprint({
      props: systemPromptProps,
      content: systemPromptContent,
      modelInfo: this.config.modelInfo,
      agentType: this.config.agentType,
      featureFlags: this.config.featureFlags,
      toolSetHandle,
      mcpTools: mergedMcpTools
    });
    recordSystemPromptRebuild(ctx, {
      previousMessages: rootPromptExecutor.getMessages(),
      current: systemPromptFingerprint,
      modelInfo: this.config.modelInfo
    });
    newMessages.push({
      role: "system",
      content: systemPromptContent,
      providerOptions: { cursor: { systemPromptFingerprint } }
    });
    let didReplaceUserInfo = false;
    if ((!hasExistingNonSystemMessages || needsUserInfoRerender || needsRequestContextRecoveryRerender || needsSummarizationRerender || needsCloudTestingPlacementRerender || needsOmitCloudWorkerProcedureRerender || needsProjectCoordinatorPromptingRerender) && !this.config.userInfoDisplayOptions?.disable) {
      didReplaceUserInfo = hasExistingNonSystemMessages;
      if (didReplaceUserInfo) {
        const reasons = [];
        if (userInfoRerenderReason !== void 0) {
          reasons.push(userInfoRerenderReason);
        }
        if (needsRequestContextRecoveryRerender) {
          reasons.push("request_context_recovery");
        }
        if (needsSummarizationRerender) {
          reasons.push("summarization_epoch_advanced");
        }
        if (needsCloudTestingPlacementRerender) {
          reasons.push("cloud_testing_placement_recovery");
        }
        if (needsOmitCloudWorkerProcedureRerender) {
          reasons.push("omit_cloud_worker_procedure_change");
        }
        if (needsProjectCoordinatorPromptingRerender) {
          reasons.push("project_coordinator_prompting_change");
        }
        logger68.info(ctx, "agent.user_info.rerendered", { reasons });
        recordUserInfoRerendered(ctx, reasons, this.config.modelInfo);
      }
      newMessages.push({
        role: "user",
        content: UserInfo({
          cursorRules: rules,
          agentSkills: requestContext.agentSkills,
          env: requestContext.env,
          cloudRule: requestContext.cloudRule ?? void 0,
          gitRepos: requestContext.gitRepos,
          gitRepoInfoComplete: requestContext.gitRepoInfoComplete,
          isRootProject,
          omitCloudWorkerProcedure,
          useProjectCoordinatorPrompting,
          dsv3: stateHandler.isDsv3(),
          displayOptions: this.config.userInfoDisplayOptions,
          mcpInfoComplete: requestContext.mcpInfoComplete,
          mcpInstructions: requestContext.mcpInstructions,
          mcpFileSystemOptions: requestContext.mcpFileSystemOptions,
          mcpMetaToolOptions: userInfoMcpMetaToolOptions,
          userIntentSummary: requestContext.userIntentSummary,
          featureFlags: this.config.featureFlags,
          enableFilterEditToolsInAskMode: this.config.enableFilterEditToolsInAskMode,
          skipMcpInstructions: (requestContext.mcpFileSystemOptions?.enabled ?? false) || (userInfoMcpMetaToolOptions?.enabled ?? false),
          hooksAdditionalContext: requestContext.hooksAdditionalContext,
          automationInstructions: this.config.automationInstructions,
          ...this.config.enableTerminalFiles !== false && {
            terminalsFolder: requestContext.env?.terminalsFolder
          },
          ...buildUserInfoAgentNotesProps(this.config, executionMode, requestContext.env),
          designatedBranches: this.config.designatedBranches,
          startedAsNewProject: this.config.startedAsNewProject,
          newProjectSeededEmptyRoot: this.config.newProjectSeededEmptyRoot,
          branchPrefix: this.config.branchPrefix,
          branchSuffix: this.config.branchSuffix,
          preferCurrentBranchInMultiPrMode: this.config.preferCurrentBranchInMultiPrMode,
          toolInfo,
          browserTools: getBrowserToolNames(mcpTools),
          agentType: this.config.agentType,
          backgroundAgentSource: this.config.backgroundAgentSource,
          isSlackV1_5: this.config.isSlackV1_5,
          namedAgentSessionKind: this.config.namedAgentSessionKind,
          enableCloudTesting: this.config.enableCloudTesting,
          useLocalAgentPrompting: this.config.useLocalAgentPrompting,
          isRepoless: this.config.isRepoless,
          repolessPromptVariant: this.config.repolessPromptVariant,
          modelInfo: this.config.modelInfo,
          agentTokenLimit: this.config.agentTokenLimit,
          enableComposer2IntelligentTestingPromptSection: this.config.enableComposer2IntelligentTestingPromptSection
        }),
        providerOptions: {
          cursor: {
            requestContextCompleteness,
            // Stamped unconditionally (like the user-message handler) so a
            // plan-path user_info replacement never wipes the epoch and
            // permanently disables the post-summarization rerender.
            userInfoSummarizationEpoch: currentSummarizationEpoch,
            omitCloudWorkerProcedure,
            useProjectCoordinatorPrompting,
            ...userInfoCloudTestingSectionsPlacement !== void 0 && {
              composer2CloudTestingSectionsPlacement: userInfoCloudTestingSectionsPlacement
            }
          }
        }
      });
    }
    const effectivePriorMessages = didReplaceUserInfo ? priorMessages.slice(1) : priorMessages;
    rootPromptExecutor.clearMessages();
    rootPromptExecutor.appendMessages(toRedactedCoreMessages(newMessages, stateHandler.getPrivacyMode()));
    rootPromptExecutor.appendMessages(effectivePriorMessages);
    if (!unredResolvedPlanContent) {
      throw new Error("No plan content available for ExecutePlanAction (missing state and planFileContent)");
    }
    if (stateHandler.todos.length === 0) {
      try {
        const parsed2 = grayMatter(unredResolvedPlanContent);
        const frontmatter = parsed2.data;
        let rawTodos = [];
        if (Array.isArray(frontmatter.phases)) {
          rawTodos = frontmatter.phases.flatMap((phase) => phase.todos ?? []);
        } else if (Array.isArray(frontmatter.todos)) {
          rawTodos = frontmatter.todos;
        }
        if (rawTodos.length > 0) {
          const validStatuses = /* @__PURE__ */ new Set(["pending", "in_progress", "completed", "cancelled"]);
          const todoItems = rawTodos.filter((t) => t.id && t.content).map((t) => new TodoItem({
            id: t.id,
            content: t.content,
            status: validStatuses.has(t.status ?? "") ? stringToTodoStatus(t.status) : TodoStatus.PENDING,
            createdAt: BigInt(Date.now()),
            updatedAt: BigInt(Date.now()),
            dependencies: t.dependencies ?? []
          }));
          if (todoItems.length > 0) {
            stateHandler.setTodos(todoItems.map((t) => toRedactedTodoItem(t, stateHandler.getPrivacyMode())));
          }
        }
      } catch {
      }
    }
    const { planFilePath: planFilePath2, recreatedPlanFilePath, shouldUpsertPlanRegistryEntry, availability: planFileAvailability } = await this.resolvePlanFilePath(ctx, requestContext, action, unredResolvedPlanContent);
    if (requestContext.env?.artifactsFolder !== void 0 && action.planId && planFilePath2 && shouldUpsertPlanRegistryEntry) {
      stateHandler.upsertPlanEntry(new PlanRegistryEntry({
        id: action.planId,
        path: planFilePath2
      }));
    }
    const resolvedPlanContent = createRedactedString(unredResolvedPlanContent, DataClassification.CODE, "plan", action._privacyMode);
    if (stateHandler.plan) {
      stateHandler.setPlan(void 0);
    }
    const planTitle = resolvedPlanContent.safeTransform((pc) => pc.match(/^#\s*(.+)$/m)?.[1]?.trim() ?? "Plan");
    const planFileNote = planFileAvailability === "unavailable" ? "\n\nThe plan file is not available on disk in this environment. The attached plan content above is complete, so work from it directly and do not try to read the plan from a file." : recreatedPlanFilePath !== void 0 ? `

The plan has been moved to ${recreatedPlanFilePath}` : "";
    const planInstruction = planTitle.safeTransform((planTitle2) => `${planTitle2}

Implement the plan as specified, it is attached for your reference. Do NOT edit the plan file itself.${planFileNote}

To-do's from the plan have already been created. Do not create them again. Mark them as in_progress as you work, starting with the first one. Don't stop until you have completed all the to-dos.`);
    const planFileContent = resolvedPlanContent.unwrap(PrivacyCapability.UNSAFE_ALWAYS_ALLOWED);
    const endLine = Math.max(1, resolvedPlanContent.split("\n").length);
    const selectedPlanPath = (planFileAvailability === "unavailable" ? void 0 : planFilePath2) ?? action.planFileUri?.unwrap(PrivacyCapability.UNSAFE_ALWAYS_ALLOWED) ?? "cursor-plan://plan.md";
    const codeSelection = new SelectedCodeSelection({
      content: planFileContent,
      path: selectedPlanPath,
      range: new Range2({
        start: new Position({ line: 1, column: 0 }),
        end: new Position({ line: endLine, column: 0 })
      })
    });
    const selectedContext = new SelectedContext({
      codeSelections: [codeSelection]
    });
    const messageId = action.kickoffMessageId ?? crypto.randomUUID();
    const userMessage2 = new UserMessage({
      text: planInstruction.unwrap(PrivacyCapability.UNSAFE_ALWAYS_ALLOWED),
      messageId,
      selectedContext,
      mode: executionMode,
      ...isRootProject ? { projectDetails: new ProjectDetails() } : {},
      // Mark as simulated to indicate this is an auto-generated message (not typed by user)
      isSimulatedMsg: true,
      // Specify the reason for simulation so portal-website renders special display
      simulatedMsgReason: SimulatedMsgReason.PLAN_EXECUTION,
      ...action.planId !== void 0 && action.planId.length > 0 ? {
        executePlanInfo: new ExecutePlanInfo({
          planId: action.planId,
          planTitle: planTitle.unwrap(PrivacyCapability.UNSAFE_ALWAYS_ALLOWED)
        })
      } : {}
    });
    ensureUserMessageTiming(userMessage2);
    await this.interactionListener.sendUpdate(ctx, toRedactedInteractionUpdate(Updates.userMessageAppended(userMessage2), stateHandler.getPrivacyMode()));
    const turn = await stateHandler.createAgentTurn(ctx, userMessage2, requestContext, this.config, this.resourceAccessor, { recordRoutedModelDisplayName: true });
    stateHandler.setMode(executionMode);
    return {
      turn,
      mergedMcpTools,
      requestContext,
      requestContextProvenance
    };
  }
  async handle(parentCtx, action, rootPromptExecutor, stateHandler, mcpTools, onStateUpdate) {
    const env_1 = { stack: [], error: void 0, hasError: false };
    try {
      const span = __addDisposableResource26(env_1, createSpan(parentCtx.withName("ExecutePlanActionHandler.handle")), false);
      const ctx = span.ctx;
      const { turn, mergedMcpTools, requestContext } = await this.initializeConversation(ctx, action, rootPromptExecutor, stateHandler, mcpTools);
      const planExecutionStartTime = performance.now();
      const initialTurnCount = stateHandler.turns.length;
      const initialTodos = await Promise.all(stateHandler.todos.map((todoRef) => todoRef.get(ctx)));
      const initialTodoIds = initialTodos.map((todo) => todo.id);
      await this.runTurnLoop(ctx, rootPromptExecutor, stateHandler, turn, this.config.toolsGenerator, mergedMcpTools, requestContext.repositoryInfo, requestContext, onStateUpdate);
      const finalTodos = await Promise.all(stateHandler.todos.map((todoRef) => todoRef.get(ctx)));
      const finalStatusByTodoId = new Map(finalTodos.map((todo) => [todo.id, todo.status]));
      getAgentEventTracker(ctx).trackPlanModeModelFinished(ctx, {
        durationInMode: Math.max(0, performance.now() - planExecutionStartTime),
        todosProposed: initialTodoIds.length,
        todosCompleted: initialTodoIds.filter((todoId) => finalStatusByTodoId.get(todoId) === TodoStatus.COMPLETED).length,
        userMessagesDuringExecution: Math.max(0, stateHandler.turns.length - initialTurnCount),
        modelName: this.config.modelId,
        requestId: getRequestId(ctx),
        conversationId: getConversationId(ctx),
        planId: action.planId
      });
      return await stateHandler.computeNewStructure(ctx);
    } catch (e_1) {
      env_1.error = e_1;
      env_1.hasError = true;
    } finally {
      __disposeResources26(env_1);
    }
  }
  async handleSingleStep(parentCtx, action, rootPromptExecutor, stateHandler, mcpTools, onStateUpdate) {
    const env_2 = { stack: [], error: void 0, hasError: false };
    try {
      const span = __addDisposableResource26(env_2, createSpan(parentCtx.withName("ExecutePlanActionHandler.handleSingleStep")), false);
      const ctx = span.ctx;
      const { turn, mergedMcpTools, requestContext } = await this.initializeConversation(ctx, action, rootPromptExecutor, stateHandler, mcpTools);
      const { hasToolCall } = await this.runSingleStep(ctx, rootPromptExecutor, stateHandler, turn, this.config.toolsGenerator, mergedMcpTools, requestContext.repositoryInfo, requestContext, onStateUpdate);
      return {
        state: await stateHandler.computeNewStructure(ctx),
        hasToolCall
      };
    } catch (e_2) {
      env_2.error = e_2;
      env_2.hasError = true;
    } finally {
      __disposeResources26(env_2);
    }
  }
  async handleModelStep(parentCtx, action, rootPromptExecutor, stateHandler, mcpTools, onStateUpdate) {
    const env_3 = { stack: [], error: void 0, hasError: false };
    try {
      const span = __addDisposableResource26(env_3, createSpan(parentCtx.withName("ExecutePlanActionHandler.handleModelStep")), false);
      const ctx = span.ctx;
      const { turn, mergedMcpTools, requestContext, requestContextProvenance } = await this.initializeConversation(ctx, action, rootPromptExecutor, stateHandler, mcpTools);
      const { toolCallDescriptors, splitStepData } = await this.runModelStep(ctx, rootPromptExecutor, stateHandler, turn, this.config.toolsGenerator, mergedMcpTools, requestContext.repositoryInfo, requestContext, onStateUpdate);
      return {
        state: await stateHandler.computeNewStructure(ctx),
        toolCallDescriptors,
        splitStepData: {
          ...splitStepData,
          requestContextProvenance
        }
      };
    } catch (e_3) {
      env_3.error = e_3;
      env_3.hasError = true;
    } finally {
      __disposeResources26(env_3);
    }
  }
};


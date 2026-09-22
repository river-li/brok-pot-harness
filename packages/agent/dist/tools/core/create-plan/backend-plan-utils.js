var logger82 = createLogger("@anysphere/agent:backend-plan-utils");
var planTodoFrontmatterSchema = external_exports.object({
  id: external_exports.string(),
  status: external_exports.unknown().optional()
}).passthrough();
var planPhaseFrontmatterSchema = external_exports.object({
  todos: external_exports.array(external_exports.unknown()).optional()
}).passthrough();
var planFrontmatterSchema = external_exports.object({
  todos: external_exports.array(external_exports.unknown()).optional(),
  phases: external_exports.array(external_exports.unknown()).optional()
}).passthrough();
var planFrontmatterStringifyOptions = {
  indent: 2,
  lineWidth: -1,
  quotingType: '"',
  forceQuotes: false
};
function stringifyPlanFrontmatter(content, data) {
  return grayMatterStringify(content, data, planFrontmatterStringifyOptions);
}
function getLatestPlanRegistryEntry(stateHandler) {
  let latestPlanEntry;
  for (const planEntry of stateHandler.plans.values()) {
    latestPlanEntry = planEntry;
  }
  return latestPlanEntry;
}
async function buildTodoStatusMap(ctx, stateHandler) {
  const todoStatuses = /* @__PURE__ */ new Map();
  for (const todoRef of stateHandler.todos) {
    const todo = fromRedactedTodoItem(await todoRef.get(ctx), PrivacyCapability.UNSAFE_ALWAYS_ALLOWED);
    todoStatuses.set(todo.id, todoStatusToString(todo.status));
  }
  return todoStatuses;
}
function updateTodoStatusArray(todos, todoStatuses) {
  let didUpdate = false;
  const updatedTodos = todos.map((todo) => {
    const parsedTodo = planTodoFrontmatterSchema.safeParse(todo);
    if (!parsedTodo.success) {
      return todo;
    }
    const nextStatus = todoStatuses.get(parsedTodo.data.id);
    if (nextStatus === void 0 || parsedTodo.data.status === nextStatus) {
      return todo;
    }
    didUpdate = true;
    return { ...parsedTodo.data, status: nextStatus };
  });
  return { didUpdate, updatedTodos };
}
async function syncLatestPlanTodosToFile(options2) {
  const { ctx, resourceAccessor, stateHandler, toolCallId } = options2;
  const latestPlanEntry = getLatestPlanRegistryEntry(stateHandler);
  if (!latestPlanEntry?.path) {
    return;
  }
  const todoStatuses = await buildTodoStatusMap(ctx, stateHandler);
  if (todoStatuses.size === 0) {
    return;
  }
  try {
    const readExecutor = resourceAccessor.get(readExecutorResource);
    const readResult = await readExecutor.execute(ctx, new ReadArgs({
      path: latestPlanEntry.path,
      toolCallId
    }), { execId: generateSeededUuid(`${toolCallId}-sync-plan-read`) });
    if (readResult.result.case !== "success") {
      logger82.warn(ctx, "Failed to read latest plan file while syncing todos", {
        planPath: latestPlanEntry.path,
        resultCase: readResult.result.case
      });
      return;
    }
    if (readResult.result.value.output.case !== "content") {
      logger82.warn(ctx, "Latest plan file is not readable as text", {
        planPath: latestPlanEntry.path,
        outputCase: readResult.result.value.output.case
      });
      return;
    }
    const originalContent = readResult.result.value.output.value;
    const parsedPlan = grayMatter(originalContent);
    const parsedFrontmatter = planFrontmatterSchema.safeParse(parsedPlan.data);
    if (!parsedFrontmatter.success) {
      return;
    }
    let updatedFrontmatter = parsedFrontmatter.data;
    let didUpdate = false;
    if (updatedFrontmatter.todos !== void 0) {
      const updatedTodos = updateTodoStatusArray(updatedFrontmatter.todos, todoStatuses);
      if (updatedTodos.didUpdate) {
        updatedFrontmatter = {
          ...updatedFrontmatter,
          todos: updatedTodos.updatedTodos
        };
        didUpdate = true;
      }
    }
    if (updatedFrontmatter.phases !== void 0) {
      let didUpdatePhases = false;
      const updatedPhases = updatedFrontmatter.phases.map((phase) => {
        const parsedPhase = planPhaseFrontmatterSchema.safeParse(phase);
        if (!parsedPhase.success || parsedPhase.data.todos === void 0) {
          return phase;
        }
        const updatedTodos = updateTodoStatusArray(parsedPhase.data.todos, todoStatuses);
        if (!updatedTodos.didUpdate) {
          return phase;
        }
        didUpdatePhases = true;
        return {
          ...parsedPhase.data,
          todos: updatedTodos.updatedTodos
        };
      });
      if (didUpdatePhases) {
        updatedFrontmatter = {
          ...updatedFrontmatter,
          phases: updatedPhases
        };
        didUpdate = true;
      }
    }
    if (!didUpdate) {
      return;
    }
    const updatedContent = stringifyPlanFrontmatter(parsedPlan.content, updatedFrontmatter);
    if (updatedContent === originalContent) {
      return;
    }
    const { diffString, linesAdded, linesRemoved } = await getDiffString({
      original: originalContent,
      new: updatedContent
    });
    await performWrite(ctx, resourceAccessor, latestPlanEntry.path, updatedContent, {
      resultForModel: `Synced TODO states to ${latestPlanEntry.path}`,
      linesAdded,
      linesRemoved,
      diffString,
      originalContent
    }, { toolCallId }, stateHandler);
  } catch (error42) {
    logger82.error(ctx, "Failed to sync latest plan file todos", error42, {
      planPath: latestPlanEntry.path
    });
  }
}

/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/agent/dist/tools/core/todo/todo.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_dist4();
init_todo_tool_pb();
init_zod();
var __addDisposableResource34 = function(env, value, async) {
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
var __disposeResources34 = /* @__PURE__ */ (function(SuppressedError2) {
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
var FINISHED_TODO_CLEANUP_REMINDER = "You have many finished todos. Consider cleaning up old ones.";
var FINISHED_TODO_CLEANUP_REMINDER_THRESHOLD = 20;
var todoItemSchemaTowardsModelDsv3 = external_exports.object({
  content: external_exports.string().optional().describe("The description/content of the todo item"),
  status: todoStatusSchema.describe("The current status of the todo item"),
  id: external_exports.string().describe("Unique identifier for the todo item")
});
var todoItemSchemaTowardsModel = external_exports.object({
  id: external_exports.string().describe("Unique identifier for the TODO item"),
  content: external_exports.string().describe("The description/content of the todo item"),
  status: todoStatusSchema.describe("The current status of the TODO item")
});
var todoItemSchemaTowardsModelDsv31205 = external_exports.object({
  id: external_exports.string().describe("Unique identifier for the TODO item"),
  content: external_exports.string().describe("The description/content of the TODO item"),
  status: todoStatusSchema.describe("The current status of the TODO item")
});
function createSchemaTowardsModel(version3, options2) {
  if (version3 === "dsv3-1018") {
    return external_exports.object({
      merge: external_exports.boolean().describe("Whether to merge the todos with the existing todos. If true, the todos will be merged into the existing todos based on the id field. You can leave unchanged properties undefined. If false, the new todos will replace the existing todos."),
      todos: external_exports.array(todoItemSchemaTowardsModelDsv3).describe("Array of todo items to write to the workspace")
    });
  }
  if (version3 === "dsv3-1205") {
    return external_exports.object({
      todos: external_exports.array(todoItemSchemaTowardsModelDsv31205).describe("Array of TODO items to update or create"),
      merge: external_exports.boolean().describe("Whether to merge the todos with the existing todos. If true, the todos will be merged into the existing todos based on the id field. You can leave unchanged properties undefined. If false, the new todos will replace the existing todos.")
    });
  }
  if (version3 === "cursor-0226") {
    const todosField2 = external_exports.array(todoItemSchemaTowardsModelDsv31205).describe("Array of TODO items to update or create");
    const todosFieldWithMin2 = options2?.minTodos ? todosField2.min(options2.minTodos) : todosField2;
    return external_exports.object({
      todos: todosFieldWithMin2,
      merge: external_exports.boolean().describe("Whether to merge the todos with the existing todos. If true, the todos will be merged into the existing todos based on the id field. You can leave unchanged properties undefined. If false, the new todos will replace the existing todos.")
    });
  }
  const todosField = external_exports.array(todoItemSchemaTowardsModel).describe("Array of TODO items to update or create");
  const todosFieldWithMin = options2?.minTodos ? todosField.min(options2.minTodos) : todosField;
  const mergeField = external_exports.boolean().describe("Whether to merge the todos with the existing todos. If true, the todos will be merged into the existing todos based on the id field. You can leave unchanged properties undefined. If false, the new todos will replace the existing todos.");
  if (options2?.mergeTodosFirst) {
    return external_exports.object({
      merge: mergeField,
      todos: todosFieldWithMin
    });
  }
  return external_exports.object({
    todos: todosFieldWithMin,
    merge: mergeField
  });
}
var todoItemCreateSchemaForParsing = external_exports.object({
  id: external_exports.string().describe("Unique identifier for the TODO item"),
  content: external_exports.string().describe("The description/content of the TODO item"),
  status: todoStatusSchema.describe("The current status of the TODO item")
});
var todoItemUpdateSchemaForParsing = external_exports.object({
  id: external_exports.string().describe("Unique identifier for the TODO item"),
  content: external_exports.string().optional().describe("The description/content of the TODO item"),
  status: todoStatusSchema.describe("The current status of the TODO item")
});
var strictTodoToolSchemaForParsing = external_exports.discriminatedUnion("merge", [
  external_exports.object({
    merge: external_exports.literal(true),
    // Todo items are objects, so bare scalars are never wrapped; only
    // losslessly-recoverable stringified arrays are accepted.
    todos: lenientArray(external_exports.array(todoItemUpdateSchemaForParsing).describe("Array of TODO items to update"), { field: "todos" })
  }),
  external_exports.object({
    merge: external_exports.literal(false),
    todos: lenientArray(external_exports.array(todoItemCreateSchemaForParsing).describe("Array of TODO items to overwrite the existing TODO list with"), { field: "todos" })
  })
]);
function preprocessTodoMerge(value) {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return value;
  }
  if (!("merge" in value) || !Object.hasOwn(value, "merge")) {
    return { ...value, merge: true };
  }
  const merge3 = preprocessLenientBoolean(value.merge);
  return merge3 === value.merge ? value : { ...value, merge: merge3 };
}
var todoToolSchemaForParsing = external_exports.preprocess(preprocessTodoMerge, strictTodoToolSchemaForParsing);
function renderUpdateTodosSuccessMessage(success2, promptVersion) {
  let message = "Successfully updated TODOs. Make sure to follow and update your TODO list as you make progress. Cancel and add new TODO tasks as needed when the user makes a correction or follow-up request.";
  if (success2.todos.some((t) => t.status === TodoStatus.PENDING) && success2.todos.every((t) => t.status !== TodoStatus.IN_PROGRESS)) {
    message += " No TODOs are marked in-progress, make sure to mark them before starting the next.";
  }
  let finishedTodoCount = 0;
  for (const todo of success2.todos) {
    if (todo.status !== TodoStatus.COMPLETED && todo.status !== TodoStatus.CANCELLED) {
      continue;
    }
    finishedTodoCount++;
    if (finishedTodoCount > FINISHED_TODO_CLEANUP_REMINDER_THRESHOLD) {
      message += `

<system_reminder>${FINISHED_TODO_CLEANUP_REMINDER}</system_reminder>`;
      break;
    }
  }
  if (promptVersion === "dsv3-1018") {
    const wasMerge = success2.wasMerge ?? true;
    if (wasMerge) {
      message += "\n\nHere are the latest contents of your todo list:";
      const todosJson = success2.todos.map((t) => ({
        id: t.id,
        content: t.content,
        status: todoStatusToString(t.status)
      }));
      message += `
${JSON.stringify(todosJson)}`;
    }
  } else {
    message += `

Here are the latest contents of your todo list:
${success2.todos.map((todo) => `- **${todoStatusToString(todo.status).toUpperCase()}**: ${todo.content} (id: ${todo.id})`).join("\n")}`;
  }
  return message;
}
var createUpdateTodosTool = (resourceAccessor, stateHandler, promptVersion = "latest") => {
  const isCodexPrompt = isCodexPromptVersion(promptVersion);
  const executeCore = async (ctx, _interactionHandler, rawArgs, meta) => {
    const existingMap = /* @__PURE__ */ new Map();
    for (const existingTodo of stateHandler.todos) {
      const redactedValue = await existingTodo.get(ctx);
      const value = fromRedactedTodoItem(redactedValue, PrivacyCapability.UNSAFE_ALWAYS_ALLOWED);
      existingMap.set(value.id, value);
    }
    const todos = rawArgs.todos.map((todo) => {
      const existing = existingMap.get(todo.id);
      return createTodoItem(todo, existing);
    });
    const updatedTodos = [];
    const todoMap = new Map(existingMap);
    const mergeFlag = rawArgs.merge ?? true;
    if (mergeFlag) {
      for (const todo of todos) {
        const existingTodo = todoMap.get(todo.id);
        if ((existingTodo === void 0 || existingTodo?.content === "") && todo.content === "") {
          throw new ToolCallArgParseError("Invalid argument: must provide 'content' for new todos items");
        }
        const updatedTodo = new TodoItem({
          id: todo.id,
          content: promptVersion === "dsv3-1018" ? todo.content ?? existingTodo?.content ?? "" : todo.content,
          status: todo.status,
          createdAt: existingTodo?.createdAt || todo.createdAt,
          updatedAt: todo.updatedAt
        });
        todoMap.set(todo.id, updatedTodo);
        updatedTodos.push(updatedTodo);
      }
      stateHandler.setTodos(pruneFinishedTodos(Array.from(todoMap.values())).map((t) => toRedactedTodoItem(t, stateHandler.getPrivacyMode())));
    } else {
      const replacedTodos = todos.map((todo) => {
        const existingTodo = todoMap.get(todo.id);
        return new TodoItem({
          id: todo.id,
          content: promptVersion === "dsv3-1018" ? todo.content ?? existingTodo?.content ?? "" : todo.content,
          status: todo.status,
          createdAt: existingTodo?.createdAt || todo.createdAt,
          updatedAt: todo.updatedAt
        });
      });
      const prunedReplacedTodos = pruneFinishedTodos(replacedTodos);
      stateHandler.setTodos(prunedReplacedTodos.map((t) => toRedactedTodoItem(t, stateHandler.getPrivacyMode())));
      updatedTodos.push(...prunedReplacedTodos);
    }
    await syncLatestPlanTodosToFile({
      ctx,
      resourceAccessor,
      stateHandler,
      toolCallId: meta.toolCallId
    });
    return new UpdateTodosResult({
      result: {
        case: "success",
        value: new UpdateTodosSuccess({
          todos: mergeFlag ? await Promise.all(stateHandler.todos.map(async (t) => fromRedactedTodoItem(await t.get(ctx), PrivacyCapability.UNSAFE_ALWAYS_ALLOWED))) : updatedTodos,
          totalCount: stateHandler.todos.length,
          wasMerge: mergeFlag
        })
      }
    });
  };
  const execute = async (parentCtx, interactionHandler, argsStream, meta) => {
    const env_1 = { stack: [], error: void 0, hasError: false };
    try {
      const spanCtxt = __addDisposableResource34(env_1, createSpan(parentCtx.withName("updateTodosExecute")), false);
      interactionHandler.emitPartialToolCall(spanCtxt.ctx, meta.toolCallId, createUpdateTodosToolCall(new UpdateTodosToolCall()));
      const existingMap = /* @__PURE__ */ new Map();
      for (const existingTodo of stateHandler.todos) {
        const redactedValue = await existingTodo.get(parentCtx);
        const value = fromRedactedTodoItem(redactedValue, PrivacyCapability.UNSAFE_ALWAYS_ALLOWED);
        existingMap.set(value.id, value);
      }
      const { parser } = createStreamingTodoParser(spanCtxt.ctx, interactionHandler, meta, existingMap);
      let args = "";
      try {
        for await (const chunk of argsStream) {
          args += chunk;
          parser.write(chunk);
        }
      } catch (e) {
        throw new ToolCallArgParseError(e instanceof Error ? e.message : String(e));
      }
      let parsedJson;
      try {
        parsedJson = JSON.parse(args);
      } catch (e) {
        throw new ToolCallArgParseError(e instanceof Error ? e.message : "Invalid JSON");
      }
      const parsedArgs = todoToolSchemaForParsing.safeParse(parsedJson);
      if (!parsedArgs.success) {
        throw new ToolCallArgParseError(`Invalid arguments: ${parsedArgs.error.message}`);
      }
      const rawArgs = parsedArgs.data;
      const todos = rawArgs.todos.map((todo) => {
        const existing = existingMap.get(todo.id);
        return createTodoItem(todo, existing);
      });
      const updateArgs = new UpdateTodosArgs({ todos, merge: rawArgs.merge });
      const baseToolCall = new UpdateTodosToolCall({
        args: updateArgs,
        result: void 0
      });
      const execResult = await interactionHandler.executeToolCall(spanCtxt.ctx, createUpdateTodosToolCall(baseToolCall), meta.toolCallId, async (ctx) => executeCore(ctx, interactionHandler, rawArgs, meta), (result) => createUpdateTodosToolCall(new UpdateTodosToolCall({ ...baseToolCall, result })));
      return execResult;
    } catch (e_1) {
      env_1.error = e_1;
      env_1.hasError = true;
    } finally {
      __disposeResources34(env_1);
    }
  };
  const render2 = async (_ctx, execResult, _props) => {
    const result = execResult.result;
    switch (result?.case) {
      case "success": {
        return createStringResult(renderUpdateTodosSuccessMessage(result.value, promptVersion));
      }
      case "error":
        return createStringResult(result.value.error);
      case void 0:
        return createStringResult("Unknown error");
      default: {
        const _exhaustiveCheck = result;
        throw new Error(`Unhandled result case: ${String(_exhaustiveCheck)}`);
      }
    }
  };
  function getToolName5(version3) {
    switch (version3) {
      case "dsv3-1018":
        return "todo_write";
      case "cursor-0226":
      case "dsv3-1205":
      case "latest":
      case "gpt5-codex":
      case "codex-cloud":
      case "haiku":
        return "TodoWrite";
      default: {
        const _exhaustive = version3;
        throw new Error(`Unhandled version: ${_exhaustive}`);
      }
    }
  }
  function getDescription4(version3) {
    switch (version3) {
      case "gpt5-codex":
      case "codex-cloud":
        return `Updates the todo list. Provide a list of todo items, each with an id, content, and status. Provide merge=true to update existing tasks.

### Guidelines
- At most one task can be in_progress at a time.
- Cancel tasks that are no longer needed immediately.
- Prefer creating the first todo as in_progress
- Batch todo updates with other tool calls in parallel`;
      case "cursor-0226":
        return "Use this tool to create and manage a structured task list for your current coding session.";
      case "dsv3-1205":
      case "dsv3-1018":
      case "latest":
      case "haiku":
        return `Use this tool to create and manage a structured task list for your current coding session. This helps track progress, organize complex tasks, and demonstrate thoroughness.

Note: Other than when first creating todos, don't tell the user you're updating todos, just do it.

### When to Use This Tool

Use proactively for:
1. Complex multi-step tasks (3+ distinct steps)
2. Non-trivial tasks requiring careful planning
3. User explicitly requests todo list
4. User provides multiple tasks (numbered/comma-separated)
5. After receiving new instructions - capture requirements as todos (use merge=false to add new ones)
6. After completing tasks - mark complete with merge=true and add follow-ups
7. When starting new tasks - mark as in_progress (ideally only one at a time)

### When NOT to Use

Skip for:
1. Single, straightforward tasks
2. Trivial tasks with no organizational benefit
3. Tasks completable in < 3 trivial steps
4. Purely conversational/informational requests
5. Don't add a task to test the change unless asked, or you'll overfocus on testing

### Examples

<example>
  User: Add dark mode toggle to settings
  Assistant:
    - *Creates todo list:*
      1. Add state management [in_progress]
      2. Implement styles
      3. Create toggle component
      4. Update components
    - [Immediately begins working on todo 1 in the same tool call batch]
<reasoning>
  Multi-step feature with dependencies.
</reasoning>
</example>

<example>
  User: Rename getCwd to getCurrentWorkingDirectory across my project
  Assistant: *Searches codebase, finds 15 instances across 8 files*
  *Creates todo list with specific items for each file that needs updating*

<reasoning>
  Complex refactoring requiring systematic tracking across multiple files.
</reasoning>
</example>

<example>
  User: Implement user registration, product catalog, shopping cart, checkout flow.
  Assistant: *Creates todo list breaking down each feature into specific tasks*

<reasoning>
  Multiple complex features provided as list requiring organized task management.
</reasoning>
</example>

<example>
  User: Optimize my React app - it's rendering slowly.
  Assistant: *Analyzes codebase, identifies issues*
  *Creates todo list: 1) Memoization, 2) Virtualization, 3) Image optimization, 4) Fix state loops, 5) Code splitting*

<reasoning>
  Performance optimization requires multiple steps across different components.
</reasoning>
</example>

### Examples of When NOT to Use the Todo List

<example>
  User: What does git status do?
  Assistant: Shows current state of working directory and staging area...

<reasoning>
  Informational request with no coding task to complete.
</reasoning>
</example>

<example>
  User: Add comment to calculateTotal function.
  Assistant: *Uses edit tool to add comment*

<reasoning>
  Single straightforward task in one location.
</reasoning>
</example>

<example>
  User: Run npm install for me.
  Assistant: *Executes npm install* Command completed successfully...

<reasoning>
  Single command execution with immediate results.
</reasoning>
</example>

### Task States and Management

1. **Task States:**
  - pending: Not yet started
  - in_progress: Currently working on
  - completed: Finished successfully
  - cancelled: No longer needed

2. **Task Management:**
  - Update status in real-time
  - Mark complete IMMEDIATELY after finishing
  - Only ONE task in_progress at a time
  - Complete current tasks before starting new ones

3. **Task Breakdown:**
  - Create specific, actionable items
  - Break complex tasks into manageable steps
  - Use clear, descriptive names

4. **Parallel Todo Writes:**
  - Prefer creating the first todo as in_progress
  - Start working on todos by using tool calls in the same tool call batch as the todo write
  - Batch todo updates with other tool calls for better latency and lower costs for the user

When in doubt, use this tool. Proactive task management demonstrates attentiveness and ensures complete requirements.`;
      default: {
        const _exhaustive = version3;
        throw new Error(`Unhandled version: ${_exhaustive}`);
      }
    }
  }
  const toolName = getToolName5(promptVersion);
  const description9 = getDescription4(promptVersion);
  return createZodAgentTool("TODO_WRITE", {
    name: toolName,
    contextType: {
      type: "dynamic",
      conciseStaticContext: "Use this tool to manage complex multi-step tasks."
    },
    descriptionGenerator: (_props) => description9,
    // Model-facing schema has minTodos: 2 to encourage the model to create at least 2 todos.
    // dsv3 versions ignore minTodos (they return early in createSchemaTowardsModel).
    // Actual validation (todoToolSchemaForParsing in execute) does not enforce this minimum.
    parameters: createSchemaTowardsModel(promptVersion, {
      mergeTodosFirst: isCodexPrompt,
      minTodos: 2
    }),
    execute,
    render: render2,
    serializeError: (error42) => {
      const errorMessage6 = error42 instanceof Error ? error42.message : String(error42);
      return createUpdateTodosToolCall(new UpdateTodosToolCall({
        result: new UpdateTodosResult({
          result: {
            case: "error",
            value: new UpdateTodosError({
              error: errorMessage6
            })
          }
        })
      }));
    }
  });
};


var baseDescriptionDsv3 = `PROPOSE a command to run on behalf of the user.
If you have this tool, note that you DO have the ability to run commands directly on the USER's system.
Note that the user may have to approve the command before it is executed.
The user may reject it if it is not to their liking, or may modify the command before approving it.  If they do change it, take those changes into account.
In using these tools, adhere to the following guidelines:
1. Based on the contents of the conversation, you will be told if you are in the same shell as a previous step or a different shell.
2. If in a new shell, you should \`cd\` to the appropriate directory and do necessary setup in addition to running the command. By default, the shell will initialize in the project root.
3. If in the same shell, LOOK IN CHAT HISTORY for your current working directory.
4. For ANY commands that would require user interaction, ASSUME THE USER IS NOT AVAILABLE TO INTERACT and PASS THE NON-INTERACTIVE FLAGS (e.g. --yes for npx).
5. If the command would use a pager, append \` | cat\` to the command.
6. For commands that are long running/expected to run indefinitely until interruption, please run them in the background. To run jobs in the background, set \`is_background\` to true rather than changing the details of the command.
7. Dont include any newlines in the command.`;
var baseDescriptionDsv31205 = `Executes a given command in a shell session with optional timeout.
Before executing the command, please follow these steps:
1. Check for Running Processes:
   - Before starting dev servers or long-running processes that should not be duplicated, search the terminals folder to check if they are already running in existing terminals.
   - You can use this information to determine which terminal, if any, matches the command you want to run, contains the output from the command you want to inspect, or has changed since you last read them.
   - Since these are text files, you can read any terminal's contents simply by reading the file, search using the grep tool, etc.
2. Command Execution:
   - Always quote file paths that contain spaces with double quotes (e.g., cd "path with spaces/file.txt")
   - Examples of proper quoting:
     - cd "/Users/name/My Documents" (correct)
     - cd /Users/name/My Documents (incorrect - will fail)
     - python "/path/with spaces/script.py" (correct)
     - python /path/with spaces/script.py (incorrect - will fail)
   - After ensuring proper quoting, execute the command.
   - Capture the output of the command.
Usage notes:
- The command argument is required.
- You can specify an optional timeout in milliseconds (up to 600000ms / 10 minutes). If not specified, commands will timeout after 30000ms (30 seconds).
- It is very helpful if you write a clear, concise description of what this command does in 5-10 words.
- Avoid using search commands like \`find\` and \`grep\`. Instead prefer Grep, Glob to search. Avoid read tools like \`cat\`, \`head\`, and \`tail\`, and prefer Read to read files.
- If you _still_ need to run \`grep\`, STOP. ALWAYS USE ripgrep at \`rg\` first, which all users have pre-installed.
- When issuing multiple commands, use the ';' or '&&' operator to separate them. DO NOT use newlines (newlines are ok in quoted strings).
- Try to maintain your current working directory throughout the session by using absolute paths and avoiding usage of \`cd\`. You may use \`cd\` if the User explicitly requests it.<good-example>pytest /foo/bar/tests</good-example><bad-example>cd /foo/bar && pytest tests</bad-example>`;
function getDescriptionDsv3(sandboxEnabled, version3, options2) {
  const { isReadonly, enableBlockUntilMs, enableTmuxGuidance, sandboxNetworkInfo, awaitToolName, tmuxSharedSessionName, useMinimalHarness, requireBlockUntilMs, defaultBlockUntilMs, enableJobCompletionNotifications, enableJobProgressNotifications } = options2 ?? {};
  const outputNotificationSection = enableJobProgressNotifications === true ? "You can monitor commands by configuring `notify_on_output`. You will be notified at the end of your turn whenever stdout/stderr output matches the regex `pattern`. Output redirected only to a file will not trigger it. Configure a 5-or-fewer-word `reason` explaining what you are watching for, and optionally configure `debounce_ms`." : void 0;
  const sandboxDescription = sandboxEnabled ? renderContent(SandboxingDescriptionBody({
    isReadonly: isReadonly === true,
    sandboxNetworkInfo
  })) : void 0;
  const tmuxGuidanceSection = enableTmuxGuidance === true ? getTmuxBackedShellSessionsSectionText({
    sharedSessionName: tmuxSharedSessionName
  }) : void 0;
  const appendDescriptionSections = (base) => {
    const sections = [tmuxGuidanceSection, sandboxDescription].filter((section) => section !== void 0);
    if (sections.length === 0) {
      return base;
    }
    return `${base}

${sections.join("\n\n")}`;
  };
  if (useMinimalHarness === true) {
    const minimalHarnessDescription = `Execute shell commands in the workspace.

- The shell is stateful - cwd & env vars persist for subsequent calls.
- Make efficient use of shell calls and minimize wasted tokens.
- Batch related shell work together or run independent checks in parallel when safe. Make liberal use of \`&&\`, \`;\`, pipes, greps and other efficient shell use.
- Use targeted, output-limited terminal commands such as \`rg\`, \`head\`, \`tail\`, \`sed -n\`, when relevant to limit output.
- NEVER use \`set -x\`; it breaks this tool. If it gets set, run \`set +x\` to fix the shell.
- Optimize for overall cost, including cache reads, cache writes, and output tokens.
- Use the 'Workspace Path' field in the \`<user_info>\` section to resolve the workspace path. It will likely NOT be at \`/workspace\`; don't waste time trying that.
- Still do whatever validation is necessary to ensure the judgment is correct; efficiency means avoiding waste, not skipping verification.
- This may still be a long-running investigation if correctness requires it, but do not spend tokens on status updates, progress narration, or UX niceties while judging.
- Always quote paths that contain spaces.`;
    const minimalSections = [
      outputNotificationSection,
      tmuxGuidanceSection
    ].filter((section) => section !== void 0);
    if (minimalSections.length === 0) {
      return minimalHarnessDescription;
    }
    return `${minimalHarnessDescription}

${minimalSections.join("\n\n")}`;
  }
  if (version3 === "cursor-0226") {
    const base = "Executes a given command in a shell session, waiting for output for `block_until_ms` millis.";
    const baseWithProgress = outputNotificationSection === void 0 ? base : `${base}

${outputNotificationSection}`;
    if (tmuxGuidanceSection === void 0) {
      return sandboxEnabled ? `${baseWithProgress}
${sandboxDescription}` : baseWithProgress;
    }
    return appendDescriptionSections(baseWithProgress);
  }
  if (version3 === "dsv3-1205") {
    const outputNotificationBullet = outputNotificationSection === void 0 ? "" : `
- ${outputNotificationSection}`;
    if (enableBlockUntilMs === true) {
      const monitoringSection = !awaitToolName ? `
- Monitoring backgrounded commands:
  - When command moves to background, check status immediately by reading the terminal file.
  - Header has \`pid\` and \`running_for_ms\` (updated every 5000ms)
  - When finished, footer with \`exit_code\` and \`elapsed_ms\` appears.
  - Poll repeatedly to monitor by sleeping between checks. If the file gets large, read from the end of the file to capture the latest content.
  - Pick your sleep intervals using best guess/judgment based on any knowledge you have about the command and its expected runtime, and any output from monitoring the command. When no new output, exponential backoff is a good strategy (e.g. sleep 2000ms, 4000ms, 8000ms, 16000ms...), using educated guess for min and max wait.
  - If it's longer than expected and the command seems like it is hung, kill the process if safe to do so using the pid that appears in the header. If possible, try to fix the hang and proceed.
  - Don't stop polling until: (a) \`exit_code\` footer appears (terminating command), (b) the command reaches a healthy steady state (only for non-terminating command, e.g. dev server/watcher), or (c) command is hung - follow guidance above.` : enableJobCompletionNotifications ? `
- You'll be notified when the backgrounded command completes. Only poll with \`${awaitToolName}\` when the command requires close monitoring \u2014 long-running jobs that can silently hang or degrade before completing (training runs, eval runs, deployments, long builds, datagen pipelines, DB migrations, large data transfers). For fire-and-forget commands (tests, installs, dev servers/watchers, short scripts), start them and keep working \u2014 you can always poll with \`${awaitToolName}\` later if you end up blocked on the result.` : `
- Use \`${awaitToolName}\` to monitor the background command.`;
      const blockUntilSection = `Managing long-running commands:
- Commands that don't complete within \`block_until_ms\`${requireBlockUntilMs ? "" : ` (default ${formatBlockUntilDefaultForDescription(defaultBlockUntilMs ?? 3e4)})`} are moved to background. The command keeps running and output streams to a terminal file. Set \`block_until_ms: 0\` to immediately background (use for dev servers, watchers, or any long-running process).
- You do not need to use '&' at the end of commands.
- Make sure to set \`block_until_ms\` to higher than the command's expected runtime. Add some buffer since block_until_ms includes shell startup time; increase buffer next time based on \`elapsed_ms\` if you chose too low. E.g. if you sleep for 40s, recommended \`block_until_ms\` is 45s.
${monitoringSection}${outputNotificationBullet}`;
      const baseDescriptionDsv31205WithBlockUntil = `Executes a given command in a shell session with optional foreground timeout.
Before executing the command, please follow these steps:
1. Check for Running Processes:
   - Before starting dev servers or long-running processes that should not be duplicated, search the terminals folder to check if they are already running in existing terminals.
   - You can use this information to determine which terminal, if any, matches the command you want to run, contains the output from the command you want to inspect, or has changed since you last read them.
   - Since these are text files, you can read any terminal's contents simply by reading the file, search using the grep tool, etc.
2. Command Execution:
   - Always quote file paths that contain spaces with double quotes (e.g., cd "path with spaces/file.txt")
   - Examples of proper quoting:
     - cd "/Users/name/My Documents" (correct)
     - cd /Users/name/My Documents (incorrect - will fail)
     - python "/path/with spaces/script.py" (correct)
     - python /path/with spaces/script.py (incorrect - will fail)
   - After ensuring proper quoting, execute the command.
   - Capture the output of the command.
Usage notes:
- The command argument is required.
- The shell starts in the workspace root and is stateful across sequential calls. Current working directory and environment variables persist between calls. Use the \`working_directory\` parameter to run commands in different directories.
- It is very helpful if you write a clear, concise description of what this command does in 5-10 words.
- Avoid using search commands like \`find\` and \`grep\`. Instead prefer Grep, Glob to search. Avoid read tools like \`cat\`, \`head\`, and \`tail\`, and prefer Read to read files. Avoid editing files with tools like \`sed\` and \`awk\`, use Edit instead.
- If you _still_ need to run \`grep\`, STOP. ALWAYS USE ripgrep at \`rg\` first, which all users have pre-installed.
- When issuing multiple commands, use the ';' or '&&' operator to separate them. DO NOT use newlines (newlines are ok in quoted strings).
- Try to maintain your current working directory throughout the session by using absolute paths and avoiding usage of \`cd\`. You may use \`cd\` if the User explicitly requests it.

${blockUntilSection}`;
      return appendDescriptionSections(baseDescriptionDsv31205WithBlockUntil);
    }
    return appendDescriptionSections(outputNotificationSection === void 0 ? baseDescriptionDsv31205 : `${baseDescriptionDsv31205}
- ${outputNotificationSection}`);
  }
  return appendDescriptionSections(baseDescriptionDsv3);
}
var baseParametersSchemaDsv3 = external_exports.object({
  command: external_exports.string().describe("The terminal command to execute"),
  is_background: external_exports.boolean().describe("Whether the command should be run in the background"),
  explanation: external_exports.string().optional().describe("One sentence explanation as to why this command needs to be run and how it contributes to the goal.")
});
var baseParametersSchemaDsv31205 = external_exports.object({
  command: external_exports.string().describe("The command to execute"),
  working_directory: external_exports.string().optional().describe("The absolute path to the working directory to execute the command in (defaults to current directory)"),
  timeout: lenientNumber().optional().describe("Timeout in milliseconds (defaults to 30000ms/30s)"),
  description: external_exports.string().optional().describe(`Clear, concise description of what this command does in 5-10 words. Examples:
Input: ls
Output: Lists files in current directory

Input: git status
Output: Shows working tree status

Input: npm install
Output: Installs package dependencies

Input: mkdir foo
Output: Creates directory 'foo'`),
  is_background: external_exports.boolean().optional().describe("Whether the command should be run in the background")
});
function formatBlockUntilDefaultForDescription(ms2) {
  const sec = ms2 / 1e3;
  if (Number.isInteger(sec)) {
    return `${sec}s`;
  }
  return `${ms2}ms`;
}
function formatBlockUntilMsDefaultForSchema(ms2) {
  const sec = ms2 / 1e3;
  if (Number.isInteger(sec) && sec > 0 && sec <= 120) {
    return `${ms2}ms (${sec} second${sec === 1 ? "" : "s"})`;
  }
  const min = ms2 / 6e4;
  if (Number.isInteger(min) && min >= 1) {
    return `${ms2}ms (${min} minute${min === 1 ? "" : "s"})`;
  }
  return `${ms2}ms`;
}
function blockUntilMsDescriptionOptional(defaultBlockUntilMs) {
  return `How long to block and wait for the command to complete before moving it to background (in milliseconds). Defaults to ${formatBlockUntilMsDefaultForSchema(defaultBlockUntilMs)}. Set to 0 to immediately run the command in the background. The timer includes the shell startup time.`;
}
var blockUntilMsDescriptionRequired = "How long to block and wait for the command to complete before moving it to background (in milliseconds). Set to 0 to immediately run the command in the background. The timer includes the shell startup time.";
var baseParametersSchemaDsv31205WithBlockUntilShared = external_exports.object({
  command: external_exports.string().describe("The command to execute"),
  working_directory: external_exports.string().optional().describe("The absolute path to the working directory to execute the command in (defaults to current directory)"),
  description: external_exports.string().optional().describe(`Clear, concise description of what this command does in 5-10 words. Examples:
Input: ls
Output: Lists files in current directory

Input: git status
Output: Shows working tree status

Input: npm install
Output: Installs package dependencies

Input: mkdir foo
Output: Creates directory 'foo'`)
});
function baseParametersSchemaDsv31205WithBlockUntilOptional(defaultBlockUntilMs) {
  return baseParametersSchemaDsv31205WithBlockUntilShared.extend({
    block_until_ms: lenientNumber().optional().describe(blockUntilMsDescriptionOptional(defaultBlockUntilMs))
  });
}
var baseParametersSchemaDsv31205WithBlockUntilRequired = baseParametersSchemaDsv31205WithBlockUntilShared.extend({
  block_until_ms: lenientNumber().describe(blockUntilMsDescriptionRequired)
});
var baseParametersSchemaDsv30226 = baseParametersSchemaDsv31205WithBlockUntilShared.extend({
  block_until_ms: lenientNumber().optional().describe("How long to block and wait for the command to complete before moving it to background (in milliseconds). Defaults to 30000ms (30 seconds). Set to 0 to immediately run the command in the background. Make sure to set `block_until_ms` to higher than the command's expected runtime. Add some buffer since block_until_ms includes shell startup time; increase buffer next time based on previous elapsed times if you chose too low. E.g. if you sleep for 40s, recommended `block_until_ms` is 45s. Do not specify a 'timeout' parameter; no such param exists.")
});
function getParametersSchemaDsv3(sandboxEnabled, version3, options2) {
  const { isReadonly, enableBlockUntilMs, strictArgParsing, requireBlockUntilMs, defaultBlockUntilMs, enableJobProgressNotifications } = options2 ?? {};
  const addOptionalParameters = (schema2) => {
    let nextSchema = schema2;
    if (enableJobProgressNotifications === true) {
      nextSchema = nextSchema.extend({
        notify_on_output: notifyOnOutputSchema
      });
    }
    if (sandboxEnabled) {
      nextSchema = nextSchema.extend({
        required_permissions: getRequiredPermissionsSchema({
          isReadonly: isReadonly === true,
          strict: strictArgParsing === true
        })
      });
    }
    return nextSchema;
  };
  const finalizeSchema = (schema2) => addOptionalParameters(schema2);
  if (version3 === "dsv3-1205" || version3 === "cursor-0226") {
    if (enableBlockUntilMs === true) {
      let blockUntilSchema;
      if (version3 === "cursor-0226" && requireBlockUntilMs !== true) {
        blockUntilSchema = baseParametersSchemaDsv30226;
      } else if (requireBlockUntilMs === true) {
        blockUntilSchema = baseParametersSchemaDsv31205WithBlockUntilRequired;
      } else {
        blockUntilSchema = baseParametersSchemaDsv31205WithBlockUntilOptional(defaultBlockUntilMs ?? 3e4);
      }
      return finalizeSchema(blockUntilSchema);
    }
    return finalizeSchema(baseParametersSchemaDsv31205);
  }
  return finalizeSchema(baseParametersSchemaDsv3);
}

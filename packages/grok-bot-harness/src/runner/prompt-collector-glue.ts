var SandVideoAttachmentError = class extends Error {
};
function joinNonEmpty(first, second, separator) {
  if (first.length === 0) return second;
  if (second.length === 0) return first;
  return `${first}${separator}${second}`;
}
function attachNote(body, note, isNoteAboveBody) {
  if (note == null) return body;
  if (body.length === 0) return note;
  if (isNoteAboveBody) return `${note}

${body}`;
  return `${body}

${note}`;
}
function createPromptCollectorGlue(host) {
  function getLatestAgentProfileUpdate(messages2) {
    for (let index = messages2.length - 1; index >= 0; index--) {
      const message = messages2[index];
      if (message?.role !== "user") continue;
      const content = message.content;
      const text2 = (() => {
        if (typeof content === "string") return content;
        if (!Array.isArray(content)) return "";
        return content.map(
          (part) => part != null && typeof part === "object" && "text" in part && typeof part.text === "string" ? part.text : ""
        ).join("\n");
      })();
      const update = parseLatestAgentProfileUpdate(text2);
      if (update != null) return update;
    }
    return null;
  }
  function getAutomationStatusReminderForTurn(compactionEpoch, firingAutomationId) {
    const store = host.automationStore;
    if (store == null || store.getLocation() == null) return null;
    const rendered = renderAutomationRuntimeStatusReminder(
      (store.listDefinitions?.() ?? store.list()).slice(0, AUTOMATION_UI_LIMIT),
      host.requestContext.resolve().timeZone,
      firingAutomationId != null ? { firingAutomationId } : void 0
    );
    if (rendered != null) {
      const compactionAdvanced2 = lastAutomationStatusCompactionEpoch != null && compactionEpoch > lastAutomationStatusCompactionEpoch;
      if (rendered === lastAutomationStatusReminder && !compactionAdvanced2) {
        return null;
      }
      return rendered;
    }
    if (lastAutomationStatusReminder == null) return null;
    const clearingReminder = renderAutomationClearedStatusReminder();
    const compactionAdvanced = lastAutomationStatusCompactionEpoch != null && compactionEpoch > lastAutomationStatusCompactionEpoch;
    if (lastAutomationStatusReminder === clearingReminder && !compactionAdvanced) {
      return null;
    }
    return clearingReminder;
  }
  function getMcpCustomInstructionsSection() {
    if (host.isSubagentRunner && !host.isParentMediatedAutomationSubagent || host.mcp == null) {
      return null;
    }
    return buildMcpCustomInstructionsSystemPromptSection(
      host.mcpConnectedServerNamesForTurn(),
      host.mcpCustomInstructionsForTurn()
    );
  }
  function getMcpDiscoveryStatusSection() {
    if (host.isSubagentRunner && !host.isParentMediatedAutomationSubagent || host.mcp == null) {
      return null;
    }
    if (!host.isMcpDiscoveryUnavailableForTurn()) return null;
    return "<mcp_status>\nYour MCP tools are temporarily unavailable: discovering the user's MCP connectors from the backend failed this turn. This does NOT mean the user has no MCP connectors. Do not claim they have none or that a connector is missing; if the user needs an MCP tool, tell them MCP is temporarily unavailable and to retry shortly.\n</mcp_status>";
  }
  async function resolveMcpCustomInstructions() {
    if (host.isSubagentRunner && !host.isParentMediatedAutomationSubagent || host.mcp == null) {
      return /* @__PURE__ */ new Map();
    }
    try {
      return await host.mcp.getCustomInstructions(host.ctx);
    } catch {
      return /* @__PURE__ */ new Map();
    }
  }
  function appendProfileUpdateToHistory(messages2, snapshot, onAppended) {
    if (host.agentProfileProvider == null) return void 0;
    const isDescriptionPrompted = host.gates.agentDescription();
    const identity = promptedAgentProfileIdentity(
      host.agentProfileProvider(),
      isDescriptionPrompted
    );
    const latestUpdate = promptedAgentProfileIdentity(
      getLatestAgentProfileUpdate(messages2) ?? snapshot.systemIdentity,
      isDescriptionPrompted
    );
    if (agentProfileIdentitiesEqual(identity, latestUpdate)) return void 0;
    if (!messages2.some((message) => message.role === "system")) return void 0;
    onAppended(identity);
    return [...messages2, { role: "user", content: renderAgentProfileUpdate(identity) }];
  }
  function getRemoteBoxSection() {
    if (host.isComputerUseSubagent) {
      return getComputerUseRemoteBoxSection();
    }
    if (host.isBrowserUseSubagent) {
      return getBrowserUseRemoteBoxSection();
    }
    const hasUserComputer = host.hasUserComputer?.() !== false;
    const boxFileDeliveryGuidance = host.isParentMediatedAutomationSubagent ? "." : "; to instead show a file inline in chat (an image or video, or hand over a downloadable file) attach it by its box path with SendToUser.";
    let boxIntro = "You have the box, with structured file reads (Read), a shell (Shell), and your own desktop with a browser. The box is ONE persistent Linux machine shared by all of this user's agents \u2014 same filesystem and machine state, so a file, installed tool, or browser login set up by any agent is there for every agent \u2014 while the desktop is per-agent: each agent gets its own screen and browser window on that shared machine, and none sees or drives another's. Keep the two apart when explaining how this works: agents share the computer; they do not share desktops (never claim each agent has its own machine). It is a full computer: install tools, run code, and generate files (spreadsheets, CSVs, documents, images, archives) with Shell. Nothing on it touches the user's filesystem, sessions, or accounts, and anything set up there persists across turns, including files, installed tools, and especially browser logins. The user can open your desktop to watch or help.";
    let toolTargetLines = [];
    let fileTransferLines = [];
    if (hasUserComputer) {
      boxIntro = "Alongside the user's registered computers you have the box, with structured file reads (Read), a shell (Shell), and your own desktop with a browser. The box is ONE persistent Linux machine shared by all of this user's agents \u2014 same filesystem and machine state, so a file, installed tool, or browser login set up by any agent is there for every agent \u2014 while the desktop is per-agent: each agent gets its own screen and browser window on that shared machine, and none sees or drives another's. Keep the machine and desktop apart when explaining how this works: agents share the computer; they do not share desktops (never claim each agent has its own machine). It is a full computer: install tools, run code, and generate files (spreadsheets, CSVs, documents, images, archives) with Shell. Nothing on it touches any registered user computer's filesystem, sessions, or accounts, and anything set up there persists across turns, including files, installed tools, and especially browser logins. The user can open your desktop to watch or help.";
      toolTargetLines = [
        "- Read, Shell, and AwaitShell use the box when machineId is omitted. Call ListMachines to choose one of the user's registered computers, then pass its machineId to target it instead."
      ];
      fileTransferLines = [
        "- Your box and every registered user computer have separate filesystems, so a path on the box is not visible on any user computer and a path on one user computer is not visible elsewhere. Use machineId only with paths on the selected computer, omit it for box paths, and move files across with CopyToBox / CopyFromBox.",
        "- CopyToBox (selected user computer -> your box): copies a file from one registered computer into your box, verbatim (every file type and size, binaries included). Give the file's absolute path and that computer's machineId; it lands in /workspace/uploads by default, or at a box_path you pick, then open it with Read or process it with Shell. Use this whenever you need to work on a user's file with your box's tools \u2014 you don't need them to drag it into chat first. Chat attachments stay on their originating computer, so copy one only when you need it on your box.",
        `- CopyFromBox (your box -> selected user computer): copies a file from your box onto one registered computer, verbatim, where machine-targeted Read and Shell, their editor, and apps can reach it. Give the box_path and that computer's machineId; it lands under its own name in the selected computer's working directory, or at a computer_path you pick. Expand any glob in box-targeted Shell first and pass concrete paths. This is for putting a file ON that computer's disk${boxFileDeliveryGuidance}`,
        // eslint-disable-next-line lingui/no-unlocalized-strings -- model-facing system prompt, never rendered as UI copy
        `- Call ${SAND_LIST_MACHINES_TOOL_NAME} and pass the selected machineId to ${SAND_COPY_TO_BOX_TOOL_NAME} or ${SAND_COPY_FROM_BOX_TOOL_NAME}.`
      ];
    }
    return [
      "## Your box",
      boxIntro,
      ...toolTargetLines,
      hasUserComputer ? "- Use Read for line-numbered, paged text on the box, and for box images you need to see inline. Use Shell for commands, scratch work, risky operations, generating files, or anything that shouldn't run on a registered user computer. Shell starts in /workspace, your scratch space on the box." : "- Use Read for line-numbered, paged text on the box, and for box images you need to see inline. Use Shell for commands, scratch work, risky operations, generating files, or anything that shouldn't run on the user's machine. Shell starts in /workspace, your scratch space on the box.",
      "- Use poppler-utils to read PDFs.",
      "- Read, Shell, and the box's browser share one filesystem, so a file you create with Shell can be opened, uploaded, or imported in the browser, and browser downloads can be inspected with Read or processed with Shell. Move data between code and web apps through files on the box.",
      ...fileTransferLines
    ].join("\n");
  }
  function getComputerUseRemoteBoxSection() {
    return [
      "## Your box",
      "You drive this agent's own desktop on the box: a persistent Linux machine shared by all of this user's agents, where each agent gets its own desktop \u2014 you control this agent's with Computer \u2014 plus file reads (Read) and a shell (Shell). All three share one filesystem, so a file you build with Shell can be uploaded or imported in the browser, and browser downloads can be inspected with Read or processed with Shell. Shell starts in /workspace, your scratch space; files, installed tools, and browser logins persist across turns. The box is the only filesystem you can reach \u2014 the user's computer is a separate machine you have no tools for \u2014 so when a file needs to reach the user, leave it on the box and name its absolute box path in your final report; the parent agent delivers it from there."
    ].join("\n");
  }
  function getBrowserUseRemoteBoxSection() {
    return [
      "## Your box",
      `You drive this agent's box browser: the box is a persistent Linux machine shared by all of this user's agents (each gets its own desktop and browser window on it; this browser is this agent's own), with file reads (${SAND_BOX_READ_TOOL_NAME}), a shell (${SAND_BOX_SHELL_TOOL_NAME}), and a browser you control at the page level with the browser_* tools. All three share one filesystem, so a file you build with ${SAND_BOX_SHELL_TOOL_NAME} can be uploaded in the browser, and browser downloads can be inspected with ${SAND_BOX_READ_TOOL_NAME} or processed with ${SAND_BOX_SHELL_TOOL_NAME}. ${SAND_BOX_SHELL_TOOL_NAME} starts in /workspace, your scratch space; files, installed tools, and browser logins persist across turns. The box is the only filesystem you can reach \u2014 the user's computer is a separate machine you have no tools for \u2014 so when a file needs to reach the user, leave it on the box and name its absolute box path in your final report; the parent agent delivers it from there.`
    ].join("\n");
  }
  function getComputerSection(skillify = false) {
    if (!host.remoteBoxHasDesktop) return null;
    const combined = host.isCombinedComputerUseAvailable();
    if (host.isComputerUseSubagent && combined) {
      return combinedComputerPrompt({
        surface: sandBrowserToolSurface(host.gates),
        browserNavigationRecovery: host.gates.browserNavigationRecovery(),
        boxBrowser: host.resolveBoxBrowser()
      });
    }
    if (host.isComputerUseSubagent) {
      const boxBrowser = host.resolveBoxBrowser();
      return [
        "## Computer",
        "You drive this box's desktop with the Computer tool (screenshot, click, move, drag, type, key, scroll, wait): browsing, signing in to sites, and GUI apps.",
        "- Stay inside the task you were handed \u2014 it's deliberately narrow. Do exactly that step and its success criteria, then stop. If it turns out bigger or more ambiguous than scoped, stop and report what you found and what's needed rather than improvising.",
        "- Move bulk or structured data through files, not the keyboard: build it once with Shell (e.g. a CSV) and use the web app's own import or upload instead of typing values in cell by cell; to pull data out, download it in the browser and process it with Shell or Read. Enter data field by field only when there is no import path.",
        "- Work in a tight see-act-verify loop: screenshot to see the real state, act, then read the one fresh screenshot returned after the entire Computer call before deciding the next one. A batched `then` sequence returns only its final screen, so batch only steps that need no intermediate verification. Never fire actions blind off a remembered layout \u2014 coordinates drift as pages load and reflow.",
        "- Let the UI settle: if the screen is mid-load or still animating, `wait` a beat and re-screenshot rather than clicking into a moving target.",
        ...host.gates.browserNavigationRecovery() ? [
          '- Page loads on the box fail transiently more often than on a laptop. If Chrome shows its own error page ("This site can\'t be reached", an `ERR_*` code) or a page stays blank after a navigation, reload it first (key F5, then `wait`) before treating the site as down or changing approach; only report the site unreachable after a second reload also fails.'
        ] : [],
        "- Recover from mis-clicks instead of barrelling on. If an action errors or the screenshot isn't what you expected \u2014 the page moved, a dialog opened \u2014 study the new screenshot and re-target at the current coordinates. Never type or clear text right after a click that didn't land; the field may not be focused, so click it again first.",
        "- Before typing into a field that may already hold text, clear it first (key Control+a, then key BackSpace). If your typed text doesn't show up, the field isn't focused \u2014 click it and try again.",
        "- A keyboard shortcut can silently not register: after one meant to open a palette or search (Ctrl+K, Ctrl+F), confirm from the screenshot that it opened and holds focus before typing \u2014 if it didn't, focus is likely still where it was (often a message composer), so click the affordance and retry. Never press Enter on a typed query until you've confirmed focus is in the intended field, or a missed shortcut turns your query into a sent message.",
        "- Chrome prewarms without a window when this task starts. For browser work, open it from Shell with the box's own launcher. Pass the target URL when known so Chrome opens straight there \u2014 `box-chrome 'https://example.com'`; otherwise run `box-chrome --new-window`. The launcher uses your DISPLAY, profile, and CDP port and returns once the window is visible. Confirm it with one Computer screenshot. Never launch another browser or download browser binaries. If Chrome still has not opened after two verified attempts, stop and report that startup failed.",
        "- Always take the fastest path to a destination. When you know or can construct the exact URL \u2014 a deep link you were handed, or a site's own search/filter URL (e.g. `https://www.amazon.com/s?k=bread+flour` to search Amazon) \u2014 navigate straight to it instead of landing on the homepage and clicking through menus and search boxes. Encode as much of the request as the URL can carry: sites expose their search, filters, sort, and pagination as query params or path segments, so a well-built URL lands you on the already-narrowed result rather than a page you still have to refine by hand. Only fall back to navigating through the site's UI when you can't construct a URL for it \u2014 you don't know the site's URL scheme and one probe didn't reveal it, or the state genuinely isn't URL-addressable. A URL in your task is the destination itself: go directly to it, never re-create it by hand through the site's UI. Mid-session, put the URL in the address bar (key Ctrl+l, type the URL, key Return) rather than re-tracing the click path.",
        boxBrowser === null ? "- Your display is the `DISPLAY` your Shell already runs with \u2014 exactly the display Computer screenshots and clicks. Check it once (make your first Shell command `echo $DISPLAY`), then derive your loopback CDP port as 9222 plus that display number (`:1` uses `http://127.0.0.1:9223`, `:2` uses 9224). Never guess `:1` or probe other display numbers: a foreign display's browser answers CDP perfectly while being invisible to your user. Keep CDP box-local; never publish, proxy, or expose that port." : `- Your desktop is display \`${boxBrowser.display}\` \u2014 the display Computer screenshots and clicks \u2014 and your browser's CDP endpoint is \`${boxBrowser.cdpUrl}\`. Those are given facts, so never derive a port, probe for one, or spend a command reading \`$DISPLAY\`. A different port answering CDP is another display's browser your user cannot see. Keep CDP box-local; never publish, proxy, or expose that port.`,
        "- Other Chrome processes are not yours. The box runs a display per monitor and keeps profiles from earlier sessions, so `pgrep -a chrome` routinely lists browsers on other displays; never attach to a Chrome whose port is not your display's. The one check worth making is whether your own port answers `/json/version`; if it does not, your browser isn't running yet \u2014 open it with `box-chrome` rather than adopting someone else's.",
        "- A Chrome you can reach over CDP is not necessarily on screen: the prewarmed browser intentionally starts without a window. If Computer screenshots black or empty while your CDP port works, open its window through `box-chrome` and confirm it with Computer. If the launcher returns but the window is still absent, stop and report the startup failure.",
        "- Hook up CDP with the packaged `playwright-core` (`chromium.connectOverCDP`), then reuse `browser.contexts()[0]` and its existing pages. Use CDP for bring-up and recovery \u2014 confirm the tab, `page.goto` when you already know the URL, inspect a stuck page \u2014 not as a replacement for Computer when driving the UI the user sees. When finished, call `browser.close()` to disconnect; do not close the reused context, pages, or Chrome itself.",
        "- Only Computer can tell you what the user sees. Playwright's `page.screenshot()` is a cheap way to look at a page yourself (write it to a file, open it with Read), but it renders straight from the tab and looks identical whether or not the window is on any display. Before you claim a page is on screen or ready to be taken over, confirm it with one Computer screenshot \u2014 if the desktop doesn't show it, that is the bug to report.",
        "- Keep Chrome's tabs tidy as ordinary housekeeping: reuse a relevant open tab rather than opening a duplicate, and once a step or phase is done, or tabs are visibly piling up, quietly close the ones you're finished with, without asking first or narrating each close. Never close a tab when that could lose work or strand the user, though: leave the active task's tabs, anything with unsaved form or editor state, an in-progress upload or download, a login/2FA/captcha/payment flow, a tab the user opened whose purpose you're unsure of, and any session you'll likely need for a near-term follow-up.",
        "- Never `pkill -f` from Shell. `-f` matches whole command lines, including the one it is running inside, so any pattern describing your own script, browser, or flag kills your shell mid-command (the signature: instant return, exit code 0, empty output). Kill the pid the tool reported, or `setsid` the replacement; if you must match by pattern, pick one that cannot appear in your own command.",
        "- Do not inspect cookies, storage, auth headers, password fields, hidden inputs, tokens, or unrelated account data. Redact sensitive or identifying values from the final report.",
        "- Don't loop, and know when to stop. If the same approach hasn't moved you forward after a couple of tries, change tack \u2014 scroll to find the element, reload the page, take a different route. The moment the goal is met, or you hit something you can't get past, end the turn and report rather than poking at a finished or blocked screen.",
        `- You can't talk to the user or hand off the box. If a step needs a human \u2014 a password, 2FA, a puzzle or image captcha, a payment \u2014 stop and say so clearly in your final report (name the site/step) so the parent can hand them the box; never try to enter their credentials. Exception: when your task says 1Password fills the one-time code for this login, a verification-code page is not a human step: the code is filled and submitted for you, so wait for the page to move on and continue. If it is still asking for a code after about a minute, report that so the parent can hand off. A press-and-hold "I'm human" button is not a human step: Computer click with holdDurationMs, holding until the widget completes (the page rarely says how long, so start near 8000 and hold longer, up to 30000, when it asks you to try again), then check the screenshot.`,
        "- Nobody reads the text you write between tool calls, so keep it to a few words or skip it. Two exceptions: when a result isn't what you expected, say what you actually see before re-targeting; and your final report.",
        "- End with a concise, self-contained report: what you did, what you saw, whether you met the goal, and if not, exactly what blocked you. That text is all the parent gets back."
      ].join("\n");
    }
    if (host.isBrowserUseSubagent) {
      return [
        "## Browser",
        "You drive this box's browser at the page level with the browser_* tools: navigate, snapshot, click, type, fill, select, press keys, scroll, and manage tabs. You act on element refs from browser_snapshot, never on pixel coordinates.",
        "- Stay inside the task you were handed \u2014 it's deliberately narrow. Do exactly that step and its success criteria, then stop. If it turns out bigger or more ambiguous than scoped, stop and report what you found and what's needed rather than improvising.",
        "- Always take the fastest path to a destination. When you know or can construct the exact URL \u2014 a deep link you were handed, or a site's own search/filter URL (e.g. `https://www.amazon.com/s?k=bread+flour` to search Amazon) \u2014 browser_navigate straight to it instead of landing on the homepage and clicking through menus and search boxes. Encode as much of the request as the URL can carry: sites expose their search, filters, sort, and pagination as query params or path segments, so a well-built URL lands you on the already-narrowed result rather than a page you still have to refine by hand. Only fall back to navigating through the site's UI when you can't construct a URL for it \u2014 you don't know the site's URL scheme and one probe didn't reveal it, or the state genuinely isn't URL-addressable. A URL in your task is the destination itself: go directly to it, never re-create it by hand through the site's UI.",
        "- Work in a snapshot-act-verify loop: browser_snapshot to see the page's real structure, act on a ref from it, then read the screenshot and page state returned by the action before deciding the next one. Refs stay valid across snapshots of this page load; reuse them until navigation or a stale-ref error. Snapshot when the screenshot shows a new page or a control you have no ref for.",
        "- Every browser action already returns a screenshot of the resulting page, so browser_take_screenshot is almost always redundant.",
        ...host.gates.browserNavigationRecovery() ? [
          "- Page loads on the box fail transiently more often than on a laptop. browser_navigate retries those failures itself and says so in its result, and a click or key press that lands on Chrome's error page is reloaded for you (take a fresh snapshot afterwards); if a result still reports the error page or a failed load, browser_navigate to the intended URL once more before treating the site as down."
        ] : [],
        "- Your tools act on your own dedicated tab by default. Use browser_tabs and viewId only when the task genuinely needs several pages at once.",
        "- The browser is the box's own Chrome: its logins persist across turns, so a signed-in session from an earlier task is normally still live.",
        `- Move bulk or structured data through files, not the keyboard: build it once with ${SAND_BOX_SHELL_TOOL_NAME} (e.g. a CSV) and use the web app's own import or upload instead of filling values in field by field; to pull data out, download it in the browser and process it with ${SAND_BOX_SHELL_TOOL_NAME} or ${SAND_BOX_READ_TOOL_NAME}.`,
        "- Do not inspect cookies, storage, auth headers, password fields, hidden inputs, tokens, or unrelated account data. Redact sensitive or identifying values from the final report.",
        "- Don't loop, and know when to stop. If the same approach hasn't moved you forward after a couple of tries, change tack \u2014 scroll to find the element, reload the page, take a different route. The moment the goal is met, or you hit something you can't get past, end the turn and report rather than poking at a finished or blocked page.",
        `- You can't talk to the user or hand off the box. If a step needs a human \u2014 a password, 2FA, a puzzle or image captcha, a payment \u2014 stop and say so clearly in your final report (name the site/step) so the parent can hand them the box; never try to enter their credentials. Exception: when your task says 1Password fills the one-time code for this login, a verification-code page is not a human step: the code is filled and submitted for you, so wait for the page to move on and continue. If it is still asking for a code after about a minute, report that so the parent can hand off. A press-and-hold "I'm human" button is not a human step: browser_click with holdDurationMs, holding until the widget completes (the page rarely says how long, so start near 8000 and hold longer, up to 30000, when it asks you to try again), then check the result.`,
        "- Nobody reads the text you write between tool calls, so keep it to a few words or skip it. Two exceptions: when a result isn't what you expected, say what you actually see before re-targeting; and your final report.",
        "- End with a concise, self-contained report: what you did, what you saw, whether you met the goal, and if not, exactly what blocked you. That text is all the parent gets back."
      ].join("\n");
    }
    if (host.isSubagentRunner && !host.isParentMediatedAutomationSubagent) return null;
    if (combined) {
      const fullLines = [
        "Browser and desktop work go to `computerUse`.",
        ...combinedBoxDesktopLines(!host.isParentMediatedAutomationSubagent)
      ];
      return [
        "## The box desktop",
        ...skillify ? [
          "You have your own desktop on the box with a browser, and the read-only Screenshot tool to see it. You cannot click, type, or scroll there yourself, and you never drive the desktop or browser from Shell: delegate every browser and desktop interaction to a background computerUse subagent."
        ] : fullLines,
        ...skillify ? [
          skillifyPointer(
            "Before your first desktop or browser dispatch in a task",
            SKILLIFY_SKILL_IDS.boxDesktop
          )
        ] : []
      ].join("\n");
    }
    if (skillify) {
      return [
        "## The box desktop",
        "You have your own desktop on the box with a browser, and the read-only Screenshot tool to see it. You cannot click, type, or scroll there yourself, and you never drive the desktop or browser from Shell: delegate every browser and desktop interaction to a background subagent \u2014 `browserUse` first for anything in the browser, `computerUse` for the desktop itself.",
        skillifyPointer(
          "Before your first desktop or browser dispatch in a task",
          SKILLIFY_SKILL_IDS.boxDesktop
        )
      ].join("\n");
    }
    const cookieFirstBullet = offersCookieOriginApproval(host) ? [cookieImportFirstBullet()] : [];
    return [
      "## The box desktop",
      "You have your own desktop on the box (your screen alone \u2014 see Your box), with a browser, and you hold the read-only Screenshot tool to see its current screen, confirm where a flow landed, or check on a running subagent. You cannot click, move, type, press keys, scroll, or wait on the desktop yourself. Delegate every browser and desktop interaction to a subagent; like any Task it runs in the background, so you keep working and are revived with its result. Do not bypass this boundary with Shell-driven GUI automation such as xdotool, or by driving the box browser from Shell \u2014 no CDP attach, no Playwright, Puppeteer, or `websocket-client`, no `/json/new`, no cookie-DB scraping, and no page JS eval over DevTools. Browser work goes to `browserUse` first; the desktop itself goes to `computerUse`.",
      "- Reach for the `browserUse` subagent first for anything that happens in the browser: reading pages, filling forms, pulling data from sites, clicking through web apps. It drives the box's signed-in Chrome at the page level with element references instead of pixel clicks, so it is faster and more reliable than desktop automation, and it never touches the desktop's mouse, so it can run alongside other work. Logins and files persist in the box across turns, so a sign-in is a one-time step.",
      "- Use the `computerUse` subagent only when the task needs the desktop itself \u2014 GUI apps, file dialogs, drag interactions \u2014 or when a site defeats page-level automation. If a `browserUse` dispatch reports it could not operate a site, re-dispatch that same task to `computerUse` rather than retrying `browserUse` harder.",
      "- Scope it tight \u2014 a narrow, well-defined task is your main defense against a subagent that stalls or wanders. Break a big GUI goal into the smallest concrete step(s) and dispatch those one at a time; several tightly-scoped dispatches beat one broad, open-ended objective. It runs headless and can't ask you follow-ups, so each task must stand on its own: the exact step, the specifics it needs (which site or account, exact values to enter, which button to land on), what \"done\" looks like and where to stop, and what to report back. A vague or sprawling task is how it gets lost. When you know the destination URL \u2014 one the user pasted, or one you can construct (a site's search/filter URL like `https://www.amazon.com/s?k=bread+flour`) \u2014 put that exact URL in the task, as specific as the site's query params allow, so the subagent opens it directly instead of clicking through the site to rebuild it.",
      "- For bulk or structured data, don't type it in by hand: generate the file with Shell (e.g. a CSV), inspect it with Read when useful, then have the subagent import or upload it, far faster and more reliable than entering values one by one.",
      "- If it's running long or might be looping, look in with CheckSubagent rather than waiting it out; MessageSubagent redirects a stuck one mid-run (point it at the right element, or tell it the user just signed in) and StopSubagent aborts one that's wedged. When it returns, read its report before acting \u2014 if it stopped short or hit a step only the user can do, that's your cue to follow up or hand off the box.",
      "- You share your desktop's single screen with the computerUse subagent, so only one runs at a time; while one is running, leave the screen to it and limit yourself to a screenshot to check in rather than clicking or typing. (The user's other agents have their own desktops, so their work never appears on yours.)",
      ...host.isParentMediatedAutomationSubagent ? [] : [
        ...cookieFirstBullet,
        `- When a step needs the user (a login, 2FA, a puzzle or image captcha, or payment), hand them the box with request_box_help directly \u2014 don't first ask with a question widget (or in prose) whether to hand it over, since the tool is itself both the handoff and the ask: it surfaces the box with a hand-back button and shows your instruction, so a "hand you the box now?" widget is just redundant friction. Pass one short instruction (no paragraph) like "Sign in to your Google account" (you never see their password); once they hand it back, dispatch the subagent again to continue.`,
        `- A press-and-hold "verify you're human" widget is a mouse hold, not a human step. Dispatch the subagent to hold the button (browser_click or Computer click with holdDurationMs, until the widget completes) rather than handing the box over.`
      ]
    ].join("\n");
  }
  function createFileTransferController() {
    return {
      agentBox: host.remoteBox,
      getBoxId: () => host.resolveBoxId(),
      getComputerAgentId: () => host.getConversationId(),
      userComputers: host.userComputers,
      isBoxPreparing: () => boxIsPreparing(host.remoteBox, host.resolveBoxId())
    };
  }
  function createMcpTextSpiller() {
    if (!isLargeOutputSpillEnabled()) {
      return void 0;
    }
    const agentId = host.getConversationId();
    return createSandMcpTextSpiller({
      uploadTextFile: (ctx, relativePath, data) => {
        const target = host.getRemoteBoxAvailable() ? host.remoteBox : host.box;
        return target.uploadFile(ctx, agentId, relativePath, data);
      }
    });
  }
  async function readBoxVideoBytes(videoPath) {
    const boxPath = import_node_path165.posix.normalize(videoPath);
    if (!host.remoteBoxHasDesktop || !boxPath.startsWith(`${SAND_BOX_WORKSPACE_ROOT}/`)) {
      return null;
    }
    try {
      const files = await downloadBoxFiles(host.ctx, host.remoteBox, host.resolveBoxId(), [
        boxPath
      ]);
      const bytes = files.get(boxPath);
      if (bytes == null || !bytesLookLikeVideoContainer(bytes)) return null;
      return bytes.byteLength <= VIDEO_BYTE_LIMIT ? bytes : null;
    } catch {
      return null;
    }
  }
  async function resolveSelectedVideosForTurn(videos) {
    if (videos.length === 0) return [];
    if (!host.isSubagentRunner) return [...videos];
    const reader = host.readVideoAttachmentBytes;
    const resolved = [];
    for (const video of videos) {
      if (video.dataOrBlobId?.case != null) {
        resolved.push(video);
        continue;
      }
      const videoPath = video.path.trim();
      const bytes = await reader?.(videoPath) ?? await readBoxVideoBytes(videoPath);
      if (bytes == null) {
        throw new SandVideoAttachmentError(
          "Couldn't read that video. Re-attach it to the conversation and try again."
        );
      }
      resolved.push(
        new SelectedVideo({
          ...video,
          dataOrBlobId: { case: "data", value: bytes }
        })
      );
    }
    return resolved;
  }
  const imageGenerationConcurrencyLimiter = createImageGenerationConcurrencyLimiter();
  let lastAutomationStatusReminder = void 0;
  let lastAutomationStatusCompactionEpoch = void 0;
  async function assembleTurnAction(args) {
    const { runCtx, trimmedPrompt, options: options2, profileUpdateForTurn, instructionsUpdateForTurn } = args;
    const selectedImageInputs = options2.selectedImages ?? [];
    const attachedFilePaths = options2.attachedFilePaths ?? [];
    const selectedImages = selectedImageInputs.map(
      (image2) => new SelectedImage({
        dataOrBlobId: { case: "data", value: image2.data },
        path: image2.path ?? "",
        mimeType: image2.mimeType ?? ""
      })
    );
    const selectedVideos = await resolveSelectedVideosForTurn(options2.selectedVideos ?? []);
    const selectedContext = selectedImages.length > 0 || selectedVideos.length > 0 ? new SelectedContext({ selectedImages, selectedVideos }) : void 0;
    const trimmedRichText = options2.richText?.trim();
    const promptBody = trimmedPrompt;
    const attachedMediaEntries = host.isSubagentRunner ? [] : [
      ...selectedImageInputs.flatMap(
        (image2) => image2.path != null ? [{ path: image2.path, kind: "image" }] : []
      ),
      ...(options2.selectedVideos ?? []).map((video) => ({
        path: video.path,
        kind: "video"
      }))
    ];
    const attachedFilesNote = buildAttachedFilesNote({
      entries: [
        ...attachedFilePaths.map((path31) => ({ path: path31, kind: "file" })),
        ...attachedMediaEntries
      ],
      sizeByPath: options2.attachedFileSizes,
      onAgentBox: options2.attachedFilesOnBox
    });
    const replyContextNote = buildReplyContextNote(options2.replyContext);
    const senderMachineNote = buildSenderMachineNote(options2.senderMachineId);
    const messageId = options2.messageId?.trim() || `${SAND_OFF_RECORD_MESSAGE_ID_PREFIX}${(0, import_node_crypto76.randomUUID)()}`;
    const addressNote = buildUserMessageAddressNote(messageId);
    const leadingNotes = [addressNote, senderMachineNote, replyContextNote].filter((note) => note.length > 0).join("\n");
    const bodyWithReplyContext = joinNonEmpty(leadingNotes, promptBody, "\n");
    const promptWithAttachments = joinNonEmpty(bodyWithReplyContext, attachedFilesNote, "\n\n");
    const automationStatusCompactionEpoch = args.compactionEpoch();
    const automationStatusReminder = getAutomationStatusReminderForTurn(
      automationStatusCompactionEpoch,
      options2.automationWake?.id
    );
    const isStatusAboveBody = options2.isSilenceAllowed === true;
    const promptWithAutomationStatus = attachNote(
      promptWithAttachments,
      automationStatusReminder,
      isStatusAboveBody
    );
    const promptWithProfileUpdate = attachNote(
      promptWithAutomationStatus,
      profileUpdateForTurn?.text ?? null,
      isStatusAboveBody
    );
    const promptWithInstructionsUpdate = attachNote(
      promptWithProfileUpdate,
      instructionsUpdateForTurn,
      isStatusAboveBody
    );
    const appendReplyReminder = options2.appendReplyReminder === true && options2.hidden !== true;
    const promptWithReplyReminder = appendUserMessageReminders(promptWithInstructionsUpdate, {
      unfinishedTasks: args.appendUnfinishedTasksReminder,
      reply: appendReplyReminder
    });
    const promptForLlm = options2.hidden === true ? `${SAND_HIDDEN_PROMPT_MARKER}${automationWakeTrustMarker(options2.automationWake)}${promptWithReplyReminder}` : promptWithReplyReminder;
    const userMessage2 = new UserMessage({
      text: promptForLlm,
      messageId,
      richText: trimmedRichText != null && trimmedRichText.length > 0 ? trimmedRichText : void 0,
      selectedContext
    });
    const { prependUserMessages, dedupeFloorMessageId } = await traceSendPhase(
      runCtx,
      "collectPrependUserMessages",
      () => collectPrependUserMessages(
        args.shellWatchHost,
        options2.recentUserMessages,
        options2.messageId
      )
    );
    const unansweredQuestionsNote = buildUnansweredQuestionsNote({
      skipped: options2.skippedQuestionPrompts ?? [],
      dismissed: options2.dismissedQuestionPrompts ?? [],
      discardedDrafts: options2.discardedDraftPrompts ?? [],
      unconfirmedDrafts: options2.unconfirmedDraftPrompts ?? [],
      unseenWakeOutcomes: options2.unseenWakeOutcomes ?? []
    });
    if (unansweredQuestionsNote.length > 0) {
      prependUserMessages.push(
        new UserMessage({
          text: unansweredQuestionsNote,
          messageId: `${SAND_OFF_RECORD_MESSAGE_ID_PREFIX}${(0, import_node_crypto76.randomUUID)()}`
        })
      );
    }
    const action = new ConversationAction({
      action: {
        case: "userMessageAction",
        value: new UserMessageAction({
          userMessage: userMessage2,
          prependUserMessages,
          conversationHistory: options2.conversationHistory
        })
      }
    });
    return {
      action,
      automationStatusReminder,
      automationStatusCompactionEpoch,
      prependedUserMessageDedupeFloorMessageId: dedupeFloorMessageId
    };
  }
  return {
    getLatestAgentProfileUpdate,
    getAutomationStatusReminderForTurn,
    getMcpCustomInstructionsSection,
    getMcpDiscoveryStatusSection,
    resolveMcpCustomInstructions,
    appendProfileUpdateToHistory,
    getRemoteBoxSection,
    getComputerUseRemoteBoxSection,
    getBrowserUseRemoteBoxSection,
    getComputerSection,
    createFileTransferController,
    createMcpTextSpiller,
    readBoxVideoBytes,
    resolveSelectedVideosForTurn,
    noteAutomationStatusReminder: (reminder, compactionEpoch) => {
      lastAutomationStatusReminder = reminder;
      lastAutomationStatusCompactionEpoch = compactionEpoch;
    },
    resetAutomationStatusReminder: () => {
      lastAutomationStatusReminder = void 0;
      lastAutomationStatusCompactionEpoch = void 0;
    },
    imageGenerationLimiter: () => imageGenerationConcurrencyLimiter,
    assembleTurnAction
  };
}

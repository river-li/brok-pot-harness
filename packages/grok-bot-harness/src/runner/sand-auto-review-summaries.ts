/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/grok-bot-harness/src/runner/sand-auto-review-summaries.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
function compact(value, maxChars) {
  const normalized = value.replace(/\s+/g, " ").trim();
  return normalized.length <= maxChars ? normalized : `${normalized.slice(0, maxChars - 1)}\u2026`;
}
function compactHeadAndTail(value, maxChars) {
  const normalized = value.replace(/\s+/g, " ").trim();
  if (normalized.length <= maxChars) return normalized;
  let omittedChars = normalized.length - maxChars;
  let omittedLabel = "";
  let available = 2;
  for (let attempt = 0; attempt < 4; attempt += 1) {
    omittedLabel = `\u2026[${omittedChars} chars omitted]\u2026`;
    available = Math.max(2, maxChars - omittedLabel.length);
    const actualOmittedChars = normalized.length - available;
    if (actualOmittedChars === omittedChars) break;
    omittedChars = actualOmittedChars;
  }
  const headChars = Math.ceil(available / 2);
  const tailChars = Math.floor(available / 2);
  return `${normalized.slice(0, headChars)}${omittedLabel}${normalized.slice(-tailChars)}`;
}
function shellLocationPhrase(surface) {
  return surface === "host_shell" ? "on your local computer" : "on Grok Bot's computer";
}
function genericSandShellAutoReviewSummary(surface) {
  return surface === "host_shell" ? "Run a command on your local computer" : "Run a command on Grok Bot's computer";
}
function describeSandShellAutoReviewAction(args) {
  const location2 = shellLocationPhrase(args.surface);
  const description9 = args.description?.replace(/\s+/g, " ").trim();
  const cwd = args.workingDirectory === void 0 ? "" : ` from ${compact(args.workingDirectory, 100)}`;
  if (description9 !== void 0 && description9.length > 0) {
    const head = description9.replace(/[.!?]+$/u, "");
    return compact(`${head} ${location2}${cwd}`, 340);
  }
  return compact(`${genericSandShellAutoReviewSummary(args.surface)}${cwd}`, 340);
}
function describeSandShellAutoReviewActionSource(args) {
  const summary = describeSandShellAutoReviewAction(args);
  const description9 = args.description?.replace(/\s+/g, " ").trim();
  const head = description9 === void 0 || description9.length === 0 ? void 0 : compact(description9.replace(/[.!?]+$/u, ""), 220);
  const workingDirectory = args.workingDirectory === void 0 ? void 0 : compact(args.workingDirectory, 100);
  return {
    summary,
    summaryCopy: {
      kind: "shell",
      params: {
        surface: args.surface,
        ...head === void 0 ? {} : { description: head },
        ...workingDirectory === void 0 ? {} : { workingDirectory }
      }
    }
  };
}
function redactMcpValue(value, key, depth = 0) {
  if (key !== void 0 && SAND_AUTO_REVIEW_SECRET_KEY_PATTERN.test(key)) {
    return "\u2026";
  }
  if (typeof value === "string") {
    const redacted2 = redactSandAutoReviewInlineSecrets(value);
    return SAND_AUTO_REVIEW_SECRET_VALUE_PATTERN.test(redacted2) ? "\u2026" : compactHeadAndTail(redacted2, 160);
  }
  if (value === null || typeof value !== "object") return value;
  if (depth >= 3) {
    return Array.isArray(value) ? `[${value.length} items]` : "{\u2026}";
  }
  if (Array.isArray(value)) {
    const selected = value.length <= 6 ? value : [...value.slice(0, 3), `${value.length - 6} items omitted`, ...value.slice(-3)];
    return selected.map((entry) => redactMcpValue(entry, void 0, depth + 1));
  }
  const allEntries = Object.entries(value);
  const entries = allEntries.length <= 12 ? allEntries : [
    ...allEntries.slice(0, 6),
    ["\u2026", `${allEntries.length - 12} fields omitted`],
    ...allEntries.slice(-6)
  ];
  const redacted = Object.fromEntries(
    entries.map(([entryKey, entry]) => [
      compact(entryKey, 60),
      redactMcpValue(entry, entryKey, depth + 1)
    ])
  );
  return redacted;
}
function summarizeSandMcpAutoReviewAction(args) {
  const safeServer = compact(args.serverDisplayName, 80);
  const safeTool = compact(args.toolName, 80);
  const payload = redactMcpValue(args.mcpArguments ?? {}, void 0);
  const details = compactHeadAndTail(JSON.stringify(payload), 300);
  return `Use ${safeServer || "a connected service"} tool ${safeTool || "action"} with ${details}`;
}
function genericSandMcpAutoReviewSummary(serverDisplayName) {
  const safeServer = compact(serverDisplayName, 80);
  return safeServer.length > 0 ? `Use ${safeServer}` : "Use a connected service";
}
var MCP_DESTINATION_KEYS = /* @__PURE__ */ new Set([
  "channel",
  "channel_id",
  "channelid",
  "path",
  "page",
  "page_id",
  "pageid",
  "repo",
  "repository",
  "title",
  "name",
  "url"
]);
function humanizeMcpToolAction(toolName) {
  const words2 = compact(toolName, 80).replace(/([a-z0-9])([A-Z])/g, "$1 $2").replace(/[-_.]+/g, " ").trim().toLowerCase().split(/\s+/).filter((word) => word.length > 0);
  if (words2.length === 0) return void 0;
  if (words2.length === 2 && /^(send|create|update|delete|post|write|read|add|remove|open|close|list|search|fetch|get|set|upload|download|invite|share)$/.test(
    words2[0] ?? ""
  ) && !/s$/i.test(words2[1] ?? "")) {
    const article = /^[aeiou]/i.test(words2[1] ?? "") ? "an" : "a";
    return `${words2[0]} ${article} ${words2[1]}`;
  }
  return words2.join(" ");
}
function mentionsServer(text2, serverDisplayName) {
  const server = serverDisplayName.trim();
  if (server.length === 0) return false;
  return text2.toLowerCase().includes(server.toLowerCase());
}
function safeMcpDestinationHint(mcpArguments) {
  if (mcpArguments === void 0) return void 0;
  for (const [rawKey, value] of Object.entries(mcpArguments)) {
    if (typeof value !== "string") continue;
    const key = rawKey.replace(/[^a-z0-9]/gi, "").toLowerCase();
    if (!MCP_DESTINATION_KEYS.has(key) || SAND_AUTO_REVIEW_SECRET_KEY_PATTERN.test(rawKey)) {
      continue;
    }
    const redacted = redactSandAutoReviewInlineSecrets(value).replace(/\s+/g, " ").trim();
    if (redacted.length === 0 || redacted.length > 80 || SAND_AUTO_REVIEW_SECRET_VALUE_PATTERN.test(redacted)) {
      continue;
    }
    return compact(redacted, 60);
  }
  return void 0;
}
function fallbackSandMcpAutoReviewSummary(args) {
  const server = compact(args.serverDisplayName, 80);
  const action = humanizeMcpToolAction(args.toolName);
  const hint = safeMcpDestinationHint(args.mcpArguments);
  if (server.length === 0 && action === void 0) {
    return "Use a connected service";
  }
  if (action === void 0) {
    return genericSandMcpAutoReviewSummary(server);
  }
  const base = server.length > 0 ? `Use ${server} to ${action}` : `Use a connected service to ${action}`;
  if (hint === void 0 || base.toLowerCase().includes(hint.toLowerCase())) {
    return base;
  }
  return `${base} to ${hint}`;
}
function describeSandMcpAutoReviewAction(args) {
  const description9 = args.description?.replace(/\s+/g, " ").trim();
  const server = compact(args.serverDisplayName, 80);
  if (description9 !== void 0 && description9.length > 0) {
    const head = description9.replace(/[.!?]+$/u, "");
    if (server.length > 0 && !mentionsServer(head, server)) {
      return compact(`${head} with ${server}`, 340);
    }
    return compact(head, 340);
  }
  return fallbackSandMcpAutoReviewSummary({
    serverDisplayName: args.serverDisplayName,
    toolName: args.toolName,
    ...args.mcpArguments === void 0 ? {} : { mcpArguments: args.mcpArguments }
  });
}
function describeSandMcpAutoReviewActionSource(args) {
  const summary = describeSandMcpAutoReviewAction(args);
  const description9 = args.description?.replace(/\s+/g, " ").trim();
  const head = description9 === void 0 || description9.length === 0 ? void 0 : compact(description9.replace(/[.!?]+$/u, ""), 240);
  const server = compact(args.serverDisplayName, 80);
  const toolName = head === void 0 ? compact(args.toolName, 80) || void 0 : void 0;
  const destinationHint = head === void 0 ? safeMcpDestinationHint(args.mcpArguments) : void 0;
  return {
    summary,
    summaryCopy: {
      kind: "mcp",
      params: {
        ...head === void 0 ? {} : { description: head },
        ...server.length === 0 ? {} : { serverDisplayName: server },
        ...toolName === void 0 ? {} : { toolName },
        ...destinationHint === void 0 ? {} : { destinationHint }
      }
    }
  };
}
function summarizeSandAutomationWriteAction(args) {
  const name17 = compact(args.name, 80) || "a routine";
  const instruction = compactHeadAndTail(redactSandAutoReviewInlineSecrets(args.prompt), 240);
  if (args.operation === "workflow_body") {
    const automations = args.referencingAutomationNames?.flatMap((n) => {
      const compacted = compact(n, 40);
      return compacted.length > 0 ? [compacted] : [];
    }).slice(0, 3).join(", ") || "routines";
    return `Change skill \u201C${name17}\u201D used by ${automations}: \u201C${instruction}\u201D`;
  }
  const when = compact(args.triggerDescription, 120) || "on a trigger";
  const verb = args.operation === "create" ? "Save" : "Change";
  const paused = args.isEnabled === false ? " (paused)" : "";
  return `${verb} the routine \u201C${name17}\u201D${paused} to run ${when.toLowerCase()}: \u201C${instruction}\u201D`;
}
function describeReplyDelivery(mode, interrupt) {
  if (mode === "steer") return " (steer: into its running turn)";
  if (mode === "interrupt") return " (interrupt)";
  if (mode === void 0 && interrupt === true) return " (interrupt)";
  return "";
}
function summarizeSandEmailSendAction(args) {
  const fromMailbox = args.fromDisplayName === void 0 || args.fromDisplayName.length === 0 ? args.from : `${args.fromDisplayName} <${args.from}>`;
  const replyTo = args.replyTo ?? [];
  const recipients = [
    `to ${args.to.map((address) => compact(address, 80)).join(", ")}`,
    ...args.cc.length === 0 ? [] : [`cc ${args.cc.map((a) => compact(a, 80)).join(", ")}`],
    ...args.bcc.length === 0 ? [] : [`bcc ${args.bcc.map((a) => compact(a, 80)).join(", ")}`],
    ...replyTo.length === 0 ? [] : [
      `reply-to ${replyTo.map(
        (address) => address.name.length === 0 ? compact(address.email, 80) : `${address.name} <${address.email}>`
      ).join(", ")}`
    ]
  ].join("; ");
  const files = args.attachments.length === 0 ? " with no attachments" : ` attaching ${args.attachments.length} file${args.attachments.length === 1 ? "" : "s"}: ${args.attachments.map((file2) => {
    const size = `${Math.max(1, Math.round(file2.sizeBytes / 1024))} KB`;
    const excerpt = file2.textPreview === void 0 ? " [binary, content not shown]" : ` \u201C${compactHeadAndTail(redactSandAutoReviewInlineSecrets(file2.textPreview), 160)}\u201D`;
    return `${compact(file2.filename, 80)} (${size})${excerpt}`;
  }).join(", ")}`;
  const body = compactHeadAndTail(redactSandAutoReviewInlineSecrets(args.textBody), 200);
  return `Send email from ${fromMailbox} ${recipients}, subject \u201C${compact(redactSandAutoReviewInlineSecrets(args.subject), 120)}\u201D${files}: \u201C${body}\u201D`;
}
function summarizeSandCloudAgentAction(args) {
  const instruction = compactHeadAndTail(redactSandAutoReviewInlineSecrets(args.prompt), 240);
  const imageCount = args.imageCount ?? 0;
  const fileCount = args.fileCount ?? 0;
  const attachedImages = imageCount > 0 ? `${imageCount} attached image${imageCount === 1 ? "" : "s"} it can see` : "";
  const attachedFiles = fileCount > 0 ? `${fileCount} attached file${fileCount === 1 ? "" : "s"} saved to its workspace` : "";
  const attachedParts = [attachedImages, attachedFiles].filter((part) => part.length > 0);
  const images = attachedParts.length > 0 ? ` with ${attachedParts.join(" and ")}` : "";
  if (args.action === "rename") {
    const target = compact(args.agentId ?? "", 40) || "a cloud agent";
    const title = compact(redactSandAutoReviewInlineSecrets(args.title ?? ""), 80);
    return `Rename cloud agent ${target} to \u201C${title}\u201D`;
  }
  if (args.action === "delete") {
    const target = compact(args.agentId ?? "", 40) || "a cloud agent";
    return `Permanently delete cloud agent ${target}`;
  }
  if (args.action === "watch") {
    const target = compact(args.agentId ?? "", 40) || "a cloud agent";
    return `Adopt cloud agent ${target} (not launched here): follow it after every later run, and reply to, cancel or archive it without asking again`;
  }
  if (args.action === "reply") {
    const target = compact(args.agentId ?? "", 40) || "a cloud agent";
    const delivery = describeReplyDelivery(args.mode, args.interrupt);
    return `Send a follow-up to cloud agent ${target}${delivery}${images}: \u201C${instruction}\u201D`;
  }
  const repo = compact(args.repoUrl ?? "", 120);
  const titled = args.title !== void 0 && args.title.trim().length > 0 ? ` \u201C${compact(args.title, 80)}\u201D` : "";
  let where = "";
  if (args.isCanvas === true) {
    where = " to produce a canvas in a new private Origin scratch repo without a PR";
  } else if (args.newRepo === true) {
    where = " in a new private Origin repo on its main branch without a PR";
  } else if (repo.length > 0) {
    where = ` on ${repo}`;
  }
  const what = args.project === true ? "Launch a Project" : "Launch a cloud agent";
  return `${what}${titled}${where}${images}: \u201C${instruction}\u201D`;
}
function summarizeSandSubagentAction(args) {
  const instruction = compactHeadAndTail(redactSandAutoReviewInlineSecrets(args.prompt), 240);
  if (args.action === "steer") {
    return `Send a follow-up to a running task: \u201C${instruction}\u201D`;
  }
  return `Run a task on Grok Bot's computer: \u201C${instruction}\u201D`;
}
function summarizeSandBrowserAutoReviewAction(args) {
  const element = args.element?.replace(/\s+/g, " ").trim();
  const target = element !== void 0 && element.length > 0 ? `\u201C${compact(element, 160)}\u201D` : "an element";
  const page = args.targetPageUrl !== void 0 && args.targetPageUrl.length > 0 ? ` on ${compactHeadAndTail(redactSandAutoReviewInlineSecrets(args.targetPageUrl), 120)}` : "";
  const summarize = (action) => compact(`${action}${page} in the box browser`, 340);
  switch (args.op) {
    case "navigate":
      return compact(
        `Open \u201C${redactSandAutoReviewInlineSecrets(args.url ?? "")}\u201D in the box browser`,
        340
      );
    case "click":
    case "mouse_click_xy":
      return summarize(`Click ${target}`);
    case "type":
      return summarize(summarizeTypedText(args.text ?? ""));
    case "fill":
      return summarize(summarizeTypedText(args.value ?? ""));
    case "select_option":
      return summarize(
        `Select \u201C${redactSandAutoReviewInlineSecrets((args.values ?? []).join(", "))}\u201D in ${target}`
      );
    case "press_key":
      return summarize(`Press ${args.key?.slice(0, 80) ?? "a key"}`);
    case "drag":
      return summarize(`Drag ${target}`);
    case "cdp":
      return summarize(
        `Run CDP command ${args.cdpMethod?.slice(0, 120) ?? ""} with ${compactHeadAndTail(redactSandAutoReviewInlineSecrets(args.cdpParams ?? "{}"), 160)}`
      );
    case "tabs":
      if (args.tabsAction === "new" && args.url !== void 0 && args.url.length > 0) {
        return compact(
          `Open \u201C${redactSandAutoReviewInlineSecrets(args.url)}\u201D in a new box browser tab`,
          340
        );
      }
      return summarize(
        args.tabsAction === "close" ? `Close browser tab${args.tabIndex !== void 0 ? ` ${args.tabIndex}` : ""}` : "Open a new browser tab"
      );
    default:
      return compact(`Browser ${args.op} on Grok Bot's computer`, 340);
  }
}
function summarizeTypedText(text2) {
  const redacted = redactSandAutoReviewInlineSecrets(text2);
  const normalized = compactHeadAndTail(redacted, 80);
  const looksSensitive = redacted !== text2 || SAND_AUTO_REVIEW_SECRET_VALUE_PATTERN.test(text2.trim()) || /(?:api[_ -]?key|authorization|credential|password|secret|token)\s*[:=]/i.test(text2) || /^[A-Za-z0-9+/_=-]{24,}$/.test(text2.trim()) && !text2.trim().includes(" ");
  return looksSensitive || normalized.length === 0 ? `Type ${text2.length} characters` : `Type ${text2.length} characters (\u201C${normalized}\u201D)`;
}
function summarizeSandComputerTypedText(text2) {
  return `${summarizeTypedText(text2)} on Grok Bot's computer`;
}


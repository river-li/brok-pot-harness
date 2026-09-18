init_dist4();
init_unknown_record();
init_proto();
var SKILL_FILENAME = "SKILL.md";
var LEGACY_WORKFLOW_FILENAME = "workflow.md";
var AGENT_READABLE_SKILL_DIR_MODE = 493;
var AGENT_READABLE_SKILL_FILE_MODE = 420;
var SKILL_MAX_NAME_LENGTH = 80;
var SKILL_MAX_DESCRIPTION_LENGTH = 1536;
var SKILL_MAX_BODY_LENGTH = 1e5;
var SKILL_INJECTED_BODY_LIMIT = 8e3;
var SKILL_UI_LIMIT = 100;
var SKILL_MAX_PER_AGENT = 100;
function limitSurfacedSkills(skills) {
  const managed = [];
  const userOwned = [];
  for (const skill of skills) {
    (skill.source === "managed" || skill.source === "plugin" ? managed : userOwned).push(skill);
  }
  return [...managed, ...userOwned.slice(0, SKILL_UI_LIMIT)];
}
function toAgentSkills(skills) {
  return limitSurfacedSkills(skills).filter((skill) => skill.trigger == null && skill.disableModelInvocation !== true && skill.filePath.length > 0).map((skill) => new AgentSkill({
    fullPath: skill.filePath,
    description: skill.description
  }));
}
function clampSkillName(name17) {
  return clampLine(name17, SKILL_MAX_NAME_LENGTH);
}
function clampSkillDescription(description10) {
  return clampLine(description10, SKILL_MAX_DESCRIPTION_LENGTH);
}
function clampSkillBody(body) {
  return clampBlock(body, SKILL_MAX_BODY_LENGTH);
}
function slugifySkillName(name17) {
  return slugifyName(name17, "skill");
}
function isYamlValue(value) {
  if (value === null || value instanceof Date || value instanceof Uint8Array) return true;
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") return true;
  if (Array.isArray(value)) return value.every(isYamlValue);
  return isSkillFrontmatter(value);
}
function isSkillFrontmatter(value) {
  return isUnknownRecord(value) && Object.values(value).every(isYamlValue);
}
var METADATA_KEY = "metadata";
var SOURCE_KEY = "source";
function readSourceRef(data) {
  const metadata = data[METADATA_KEY];
  const nested = isUnknownRecord(metadata) ? metadata[SOURCE_KEY] : void 0;
  const raw = typeof nested === "string" ? nested : data[SOURCE_KEY];
  if (typeof raw !== "string") return null;
  const trimmed = raw.trim();
  return trimmed.length > 0 ? trimmed : null;
}
function readTrigger(data) {
  const trigger2 = data.trigger;
  if (!isUnknownRecord(trigger2)) return null;
  const schedule = normalizeSchedule(typeof trigger2.schedule === "string" ? trigger2.schedule : "");
  if (schedule.length === 0) return null;
  return {
    schedule,
    isEnabled: trigger2.enabled !== false
  };
}
function parseSkillFile(raw) {
  let data;
  let content;
  try {
    const parsed2 = grayMatter(raw);
    data = isSkillFrontmatter(parsed2.data) ? parsed2.data : {};
    content = parsed2.content;
  } catch {
    data = {};
    content = raw;
  }
  const body = clampSkillBody(content);
  if (body.length === 0 && Object.keys(data).length === 0) return null;
  return {
    name: clampSkillName(typeof data.name === "string" ? data.name : ""),
    description: clampSkillDescription(typeof data.description === "string" ? data.description : ""),
    trigger: readTrigger(data),
    body,
    sourceRef: readSourceRef(data),
    data
  };
}
function serializeSkillFile(spec, existingData) {
  const data = {
    ...existingData ?? {}
  };
  data.name = spec.name;
  if (spec.description.length > 0) {
    data.description = spec.description;
  } else {
    delete data.description;
  }
  const legacySource = data[SOURCE_KEY];
  delete data[SOURCE_KEY];
  const existingMetadata = data[METADATA_KEY];
  const metadata = isSkillFrontmatter(existingMetadata) ? {
    ...existingMetadata
  } : {};
  const nextSource = spec.sourceRef === void 0 ? metadata[SOURCE_KEY] ?? legacySource : spec.sourceRef;
  if (typeof nextSource === "string" && nextSource.length > 0) {
    metadata[SOURCE_KEY] = nextSource;
  } else {
    delete metadata[SOURCE_KEY];
  }
  if (Object.keys(metadata).length > 0) {
    data[METADATA_KEY] = metadata;
  } else {
    delete data[METADATA_KEY];
  }
  if (spec.trigger != null) {
    data.trigger = {
      schedule: spec.trigger.schedule,
      enabled: spec.trigger.isEnabled
    };
  }
  return grayMatterStringify(`${spec.body.trim()}
`, data);
}
function skillToAutomation(skill) {
  if (skill.trigger == null) return null;
  return {
    id: skill.id,
    name: skill.name,
    prompt: skill.body,
    trigger: cronTrigger(skill.trigger.schedule),
    schedule: skill.trigger.schedule,
    triggerDescription: skill.scheduleDescription ?? describeSchedule(skill.trigger.schedule),
    isEnabled: skill.trigger.isEnabled,
    createdAt: skill.createdAt,
    lastRunAt: skill.lastRunAt,
    nextRunAt: skill.nextRunAt,
    runs: skill.runs,
    filePath: skill.filePath
  };
}
function automationToSkill(automation) {
  return {
    id: automation.id,
    name: automation.name,
    description: "",
    body: automation.prompt,
    trigger: {
      schedule: automation.trigger.type === "cron" ? automation.trigger.schedule : "",
      isEnabled: automation.isEnabled
    },
    source: "automation",
    sourceRef: null,
    pluginId: null,
    publishedByCurrentUser: false,
    scheduleDescription: automation.triggerDescription,
    triggerPresentation: {
      version: 1,
      trigger: automation.trigger
    },
    createdAt: automation.createdAt,
    lastRunAt: automation.lastRunAt,
    nextRunAt: automation.nextRunAt,
    helperScripts: [],
    runs: automation.runs,
    filePath: automation.filePath
  };
}
function skillSpecFromMarkdown(markdown, fallbackName) {
  const parsed2 = parseSkillFile(markdown);
  if (parsed2 == null) return null;
  const name17 = parsed2.name.length > 0 ? parsed2.name : clampSkillName(deriveSkillNameFromMarkdown(parsed2.body) ?? fallbackName ?? "");
  const body = parsed2.body;
  if (name17.length === 0 || body.length === 0) return null;
  return {
    name: name17,
    description: parsed2.description,
    body,
    trigger: parsed2.trigger,
    sourceRef: parsed2.sourceRef
  };
}
function buildLiveSourcePointerBody(source) {
  return [`This skill is a live reference to the skill at \`${source}\`.`, `Read that source now with your file or fetch tools and follow it as written. Do not assume its contents from this note; the source is the source of truth and may have changed since this skill was created.`].join("\n");
}
function buildLiveSourceDescription(name17, source) {
  return `Use when the "${name17}" skill applies; it is a live reference to ${source}.`;
}
function liveSkillSpecFromSource(args) {
  const source = args.source.trim();
  const name17 = clampSkillName(args.name);
  const description10 = clampSkillDescription(args.description ?? "");
  return {
    name: name17,
    description: description10.length > 0 ? description10 : clampSkillDescription(buildLiveSourceDescription(name17, source)),
    body: clampSkillBody(buildLiveSourcePointerBody(source)),
    trigger: null,
    sourceRef: source
  };
}
function deriveSkillNameFromMarkdown(body) {
  for (const raw of body.split("\n")) {
    const line = raw.trim();
    if (line.length === 0) continue;
    const heading = /^#+\s+(.*)$/.exec(line);
    const text2 = (heading?.[1] ?? line).replace(/[*_`#>]/g, "").trim();
    if (text2.length === 0) continue;
    return text2.length > SKILL_MAX_NAME_LENGTH ? text2.slice(0, SKILL_MAX_NAME_LENGTH) : text2;
  }
  return null;
}
function importedSkillDefaultName() {
  return i18n._(
    /*i18n*/
    {
      id: "bjdm+P",
      message: "Imported skill"
    }
  );
}
function deriveSkillNameFromUrl(url2) {
  const pathname = URL.canParse(url2) ? new URL(url2).pathname : url2;
  const segments = pathname.split("/").filter((segment) => segment.length > 0);
  const last = segments[segments.length - 1];
  const derived = last == null ? "" : last.replace(/\.(md|markdown|mdc|txt)$/i, "").replace(/[-_]+/g, " ").trim();
  return clampSkillName(derived.length > 0 ? derived : importedSkillDefaultName());
}
function collectSkillReferences(richText) {
  if (richText == null || richText.length === 0) return [];
  const doc = parseJsonOrUndefined(richText);
  const references = [];
  const seen = /* @__PURE__ */ new Set();
  const visit2 = (node) => {
    if (node === null || typeof node !== "object") return;
    if ("type" in node && (node.type === SKILL_REFERENCE_NODE_TYPE || node.type === LEGACY_SKILL_REFERENCE_NODE_TYPE) && "attrs" in node && node.attrs !== null && typeof node.attrs === "object" && "id" in node.attrs && typeof node.attrs.id === "string" && node.attrs.id.length > 0 && !seen.has(node.attrs.id)) {
      seen.add(node.attrs.id);
      references.push({
        id: node.attrs.id,
        teachQueueScope: "teachQueueScope" in node.attrs && typeof node.attrs.teachQueueScope === "string" ? node.attrs.teachQueueScope : null
      });
    }
    if ("content" in node && Array.isArray(node.content)) {
      for (const child of node.content) visit2(child);
    }
  };
  visit2(doc);
  return references;
}
function isMentionWordChar(char) {
  return char !== void 0 && /[a-z0-9]/.test(char);
}
function skillMentionHandles(skill) {
  const handles = /* @__PURE__ */ new Set();
  const name17 = skill.name.trim().toLowerCase();
  if (name17.length > 0) {
    handles.add(name17);
    handles.add(name17.replace(/\s+/g, ""));
  }
  const id = skill.id.trim().toLowerCase();
  if (id.length > 0) handles.add(id);
  return [...handles];
}
var SAND_SKILL_LINK_RE = /sand-workflow:([a-z0-9]+(?:-[a-z0-9]+)*)/gi;
function collectMentionedSkills(prompt, skills) {
  if (prompt.length === 0 || skills.length === 0) return [];
  const byId = /* @__PURE__ */ new Map();
  for (const skill of skills) {
    byId.set(skill.id.toLowerCase(), skill);
  }
  const found = /* @__PURE__ */ new Set();
  for (const match2 of prompt.matchAll(SAND_SKILL_LINK_RE)) {
    const id = match2[1]?.toLowerCase();
    if (id != null && byId.has(id)) found.add(id);
  }
  const handles = [];
  for (const skill of skills) {
    for (const handle of skillMentionHandles(skill)) {
      handles.push({
        handle,
        id: skill.id.toLowerCase()
      });
    }
  }
  handles.sort((a, b2) => b2.handle.length - a.handle.length);
  const lower = prompt.toLowerCase();
  const claimedPositions = /* @__PURE__ */ new Set();
  for (const {
    handle,
    id
  } of handles) {
    const needle = `@${handle}`;
    let index = lower.indexOf(needle);
    while (index >= 0) {
      const end = index + needle.length;
      const before = lower[index - 1];
      const after = lower[end];
      const boundary = !isMentionWordChar(before) && !isMentionWordChar(after);
      let overlaps = false;
      for (let position = index; position < end; position += 1) {
        if (claimedPositions.has(position)) {
          overlaps = true;
          break;
        }
      }
      if (boundary && !overlaps) {
        for (let position = index; position < end; position += 1) {
          claimedPositions.add(position);
        }
        found.add(id);
      }
      index = lower.indexOf(needle, index + 1);
    }
  }
  return skills.filter((skill) => found.has(skill.id.toLowerCase()));
}
function promptReferencesSkill(prompt, skill) {
  return collectMentionedSkills(prompt, [skill]).length > 0;
}
function buildSkillRunPrompt(skill, options2, timeZone) {
  const lines2 = [];
  if (options2.trigger === "schedule") {
    lines2.push(`${AUTOMATION_WAKE_CUE} skill "${skill.name}" (folder ${skill.id}) is due on its schedule \u2014 fired ${formatTimestamp2(Date.now(), timeZone)}.`, "This is your own routine firing on schedule, not a message the user just typed.");
  } else {
    let identity;
    if (skill.source === "managed") {
      identity = `managed skill id ${skill.id}`;
    } else if (skill.source === "plugin") {
      identity = `plugin skill id ${skill.id}, file ${skill.filePath}`;
    } else {
      identity = `folder ${skill.id}`;
    }
    if (options2.trigger === "first-run") {
      lines2.push(`Your create recipe names the "${skill.name}" skill (${identity}) as your getting-started guide. Run it now as your first turn; the user hasn't invoked it or sent anything yet.`);
    } else {
      lines2.push(`The user invoked the "${skill.name}" skill (${identity}). Run it now.`);
    }
  }
  if (skill.description.length > 0) {
    lines2.push(`What it does: ${skill.description}`);
  }
  lines2.push("Recipe to follow:", clampBlock(skill.body, SKILL_INJECTED_BODY_LIMIT));
  if (skill.helperScripts.length > 0) {
    const dir = skillDir(skill.filePath);
    lines2.push(`Helper files live beside this skill in ${dir}: ${skill.helperScripts.join(", ")}. Use them with Shell as the recipe directs.`);
  }
  if (options2.trigger === "schedule") {
    lines2.push("Carry it out now and surface anything worth sharing with SendToUser, casually \u2014 unless the recipe says to stay quiet when there's nothing to report.");
  } else if (options2.trigger === "first-run") {
    lines2.push("Carry out the recipe now. There is no user message to adapt to; the recipe is the whole instruction for this turn.");
  } else {
    lines2.push("Carry out the recipe now, adapting it to anything else the user said in this message.");
  }
  return lines2.join("\n");
}
function skillDir(filePath) {
  const slash = Math.max(filePath.lastIndexOf("/"), filePath.lastIndexOf("\\"));
  return slash === -1 ? filePath : filePath.slice(0, slash);
}
var SKILLS_LIBRARY_LINE = "Skills are a GLOBAL, shared library across all of the user's assistants. A skill is a clean generic template with no assistant-specific details, that any assistant can run. Every skill is available to every assistant; Cursor-managed skills and installed plugin skills are additionally read-only.";
var SKILLS_CATALOG_ON_DISK_LINE = "Your skills are cataloged (file path plus a when-to-use description) in the agent_skills section of the user_info block near the start of the conversation. That catalog refreshes when the conversation is summarized, so a skill you just saved or that was just installed may not be listed yet \u2014 it is still on disk, readable, and invocable immediately.";
var SKILLS_CATALOG_VIRTUAL_LINE = "Your skills are cataloged (file path plus a when-to-use description) in the agent_skills section of the user_info block near the start of the conversation. That catalog refreshes when the conversation is summarized, so a skill that was just added may not be listed yet.";
function skillsLocationLine(location2) {
  return `User-created skills live as files at ${location2}: one subfolder per skill (a short kebab-case slug is its id), each holding a SKILL.md you can read and grep with Read and Shell on your own computer. Prefer the update_state tool (target "skill") to save, rewrite, and delete them. Cursor-managed skills are supplied by Cursor, do NOT live in those folders, and cannot be edited or deleted at all.`;
}
function virtualSkillFilesLines(location2) {
  return [`Cursor-managed and plugin skill paths in the catalog (every catalog path outside ${location2}) are not files on your computer. Open them only with the Read tool at exactly the listed path. Shell commands (ls, find, grep, cat) cannot see them, so a listed path that is missing from Shell output does not mean the skill was removed.`, "A skill's name is the name field in its SKILL.md frontmatter, which can differ from its folder and its description. When the user asks for a skill by name and no catalog entry clearly matches, Read the SKILL.md of each entry whose description could fit and check its name before answering. If none matches, tell the user the skill is not in your skill list yet instead of searching your computer for it."];
}
var PLUGIN_SKILL_FILES_ON_DISK_LINE = "Skills from installed Cursor plugins are real SKILL.md files on your own computer too (their file paths appear in the agent_skills catalog). Read them \u2014 and any helper files beside them \u2014 with Read and Shell like any other skill file, but treat them as READ-ONLY: they are managed by installing or uninstalling the plugin in Settings, never by editing the files.";
var SKILL_FORMAT_LINE = "SKILL.md is the same format Cursor uses: YAML frontmatter followed by the markdown recipe body.";
var SKILL_FRONTMATTER_EXAMPLE_LINE = "  ---\n  name: Daily standup\n  description: One line on WHEN to use this skill (required)\n  ---\n  # Steps\n  1. ...\n  2. ...";
var SKILL_OTHER_FRONTMATTER_LINE = "A SKILL.md may carry other frontmatter Cursor understands and Grok Bot does not (globs, alwaysApply, environments, metadata). Leave those keys alone: update_state preserves them, and hand-editing the file to drop them breaks the skill for whoever shares it.";
var SKILL_INVOKE_LINE = "The user can invoke a skill in chat with / or @ (an autocomplete lists them); when they do, that skill's recipe is injected into your turn and you run it.";
var SKILL_AUTOMATION_POINTER_LINE = 'A routine can mention a skill inline (e.g. "Run @Daily standup, then ..."); that mention is a pointer you read and run when the routine fires, not a copy.';
var SKILL_FILE_AUTHORING_LINES = [SKILL_FORMAT_LINE, SKILL_FRONTMATTER_EXAMPLE_LINE, SKILL_OTHER_FRONTMATTER_LINE, 'Manage user-created skills with update_state (target "skill"):', '  - Save a repeated task as a skill: when you notice a multi-step task worth reusing (or the user asks), call action "write" with a name, a description, and a body holding the GENERIC, reusable steps. The description is required and is the only thing a reader sees when deciding whether to run the skill, so say when it applies. Keep assistant-specific details (which Slack channel, which repo, whose calendar) OUT of the recipe; those belong in the routine that runs it, not in the shared template. Saving a skill is a normal autonomous action, the same way you manage memory and routines: for a clearly reusable, unambiguous multi-step task, just write it and then mention it to the user, and only ask first when it is ambiguous whether it is worth saving.', '  - Rewrite one by passing its id to action "write"; remove one with action "delete". Deleting is global (every assistant loses it), so confirm with the user first.', SKILL_INVOKE_LINE, "When you create or mention a skill, reference it in your reply as a markdown link [name](sand-workflow:<id>) (id is the folder slug); it renders as a clickable pill the user taps to open that skill in Settings.", SKILL_AUTOMATION_POINTER_LINE];
var SKILLS_AUTHORING_LINES = [PLUGIN_SKILL_FILES_ON_DISK_LINE, ...SKILL_FILE_AUTHORING_LINES];
var TEAM_BOT_SKILLS_LIBRARY_LINE = "Skills you save are this bot's team skills: every teammate who talks to this bot gets them, and no other bot does. A skill is a clean generic template with no conversation-specific details, that any teammate's turn can run. Cursor-managed skills and other plugins' skills are read-only; the bot's own bot-skills entries are the ones you edit.";
var TEAM_BOT_SKILLS_CATALOG_LINE = "Your skills are cataloged (file path plus a when-to-use description) in the agent_skills section of the user_info block near the start of the conversation. A skill you save or delete this turn is not listed or readable until your next turn; say so instead of trying to Read it now. Adding or removing one refreshes the catalog on your next turn; rewriting a body does not, so re-Read a skill before relying on it.";
function teamBotSkillsLocationLine(location2, ownerSkillsListed) {
  const ownerSkills = ownerSkillsListed ? ` The owner's own skills under ${location2} may also be listed; those are the owner's personal files, not the bot's, and are not readable from a teammate's conversation.` : "";
  return `Skills you save live on the bot, not on any computer: the catalog lists them under a plugins/bot-skills@\u2026/skills/<slug>/SKILL.md path. Open them only with Read at exactly the listed path; Shell cannot see them. Prefer the update_state tool (target "skill") to save, rewrite, and delete them. Cursor-managed skills are supplied by Cursor and cannot be edited or deleted at all.${ownerSkills}`;
}
var TEAM_BOT_SKILL_AUTHORITY_LINE = "  - Only the bot owner can save or delete skills on this bot. From anyone else's conversation, including a team admin's, say the owner can add it from their own main conversation with you or from Team access, and do not call update_state.";
var TEAM_BOT_SKILL_FILE_AUTHORING_LINES = [SKILL_FORMAT_LINE, SKILL_FRONTMATTER_EXAMPLE_LINE, SKILL_OTHER_FRONTMATTER_LINE, `Manage this bot's team skills with update_state (target "skill"):`, '  - Save a repeated task as a team skill: when you notice a multi-step task worth reusing (or the user asks), call action "write" with a name, a description, and a body holding the GENERIC, reusable steps. The description is required and is the only thing a reader sees when deciding whether to run the skill, so say when it applies. Keep conversation-specific details (which Slack channel, which repo, whose calendar) OUT of the recipe; those belong in the routine that runs it, not in the shared template. Saving a skill is a normal autonomous action, the same way you manage memory and routines: for a clearly reusable, unambiguous multi-step task, just write it and then mention it to the user, and only ask first when it is ambiguous whether it is worth saving.', `  - Rewrite one by passing its id to action "write"; remove one with action "delete". A bot skill's id is the slug from its catalog path: the folder under skills/, so plugins/bot-skills@\u2026/skills/release-notes/SKILL.md has the id release-notes (the full path works too). If the owner also has a personal skill with that slug, the bare slug names the bot skill; pass the personal skill's path to name that one instead. Deleting removes it for the whole team, so confirm with the user first.`, TEAM_BOT_SKILL_AUTHORITY_LINE, SKILL_INVOKE_LINE, "When you create or mention a bot skill, name it in plain text. Do not emit sand-workflow: links for bot skills; the Team access Context tab is where the owner sees them.", SKILL_AUTOMATION_POINTER_LINE];
var TEAM_BOT_SKILLIFY_AUTHORING_LINE = 'Saving a clearly reusable multi-step task as a team skill is a normal autonomous action (update_state, target "skill", action "write") when the bot owner is the one asking; anyone else, including a team admin, is told the owner can add it from their own main conversation or from Team access. Name bot skills in plain text, never as sand-workflow: links.';
function renderTeamBotSkillsSystemPrompt(location2, options2) {
  const catalog = [TEAM_BOT_SKILLS_LIBRARY_LINE, TEAM_BOT_SKILLS_CATALOG_LINE, teamBotSkillsLocationLine(location2, options2.ownerSkillsListed === true), ...virtualSkillFilesLines(location2)];
  const authoring = options2.skillPointer != null ? [TEAM_BOT_SKILLIFY_AUTHORING_LINE, options2.skillPointer] : TEAM_BOT_SKILL_FILE_AUTHORING_LINES;
  return [...catalog, ...authoring].join("\n");
}
function renderSkillsSystemPrompt(location2, options2) {
  if (location2 == null) return "";
  if (options2?.teamBot === true) return renderTeamBotSkillsSystemPrompt(location2, options2);
  const virtual = options2?.virtualSkillFiles === true;
  const catalog = [SKILLS_LIBRARY_LINE, virtual ? SKILLS_CATALOG_VIRTUAL_LINE : SKILLS_CATALOG_ON_DISK_LINE, skillsLocationLine(location2), ...virtual ? virtualSkillFilesLines(location2) : []];
  const authoring = options2?.skillPointer != null ? ['Saving a clearly reusable multi-step task as a skill is a normal autonomous action (update_state, target "skill", action "write"); mention a skill as [name](sand-workflow:<id>) so it renders as a pill.', options2.skillPointer] : virtual ? SKILL_FILE_AUTHORING_LINES : SKILLS_AUTHORING_LINES;
  return [...catalog, ...authoring].join("\n");
}

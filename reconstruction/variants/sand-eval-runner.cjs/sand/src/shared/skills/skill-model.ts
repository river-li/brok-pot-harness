/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/shared/skills/skill-model.ts
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var SKILL_UI_LIMIT = 100;
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
function slugifySkillName(name17) {
  return slugifyName(name17, "skill");
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
var SKILLS_LIBRARY_LINE = "Skills are a GLOBAL, shared library across all of the user's assistants. A skill is a clean generic template with no assistant-specific details, that any assistant can run. Every skill is available to every assistant; Cursor-managed skills and installed plugin skills are additionally read-only.";
var SKILLS_CATALOG_ON_DISK_LINE = "Your skills are cataloged (file path plus a when-to-use description) in the agent_skills section of the user_info block near the start of the conversation. That catalog refreshes when the conversation is summarized, so a skill you just saved or that was just installed may not be listed yet \u2014 it is still on disk, readable, and invocable immediately.";
var SKILLS_CATALOG_VIRTUAL_LINE = "Your skills are cataloged (file path plus a when-to-use description) in the agent_skills section of the user_info block near the start of the conversation. That catalog refreshes when the conversation is summarized, so a skill that was just added may not be listed yet.";
function skillsLocationLine(location) {
  return `User-created skills live as files at ${location}: one subfolder per skill (a short kebab-case slug is its id), each holding a SKILL.md you can read and grep with Read and Shell on your own computer. Prefer the update_state tool (target "skill") to save, rewrite, and delete them. Cursor-managed skills are supplied by Cursor, do NOT live in those folders, and cannot be edited or deleted at all.`;
}
function virtualSkillFilesLines(location) {
  return [`Cursor-managed and plugin skill paths in the catalog (every catalog path outside ${location}) are not files on your computer. Open them only with the Read tool at exactly the listed path. Shell commands (ls, find, grep, cat) cannot see them, so a listed path that is missing from Shell output does not mean the skill was removed.`, "A skill's name is the name field in its SKILL.md frontmatter, which can differ from its folder and its description. When the user asks for a skill by name and no catalog entry clearly matches, Read the SKILL.md of each entry whose description could fit and check its name before answering. If none matches, tell the user the skill is not in your skill list yet instead of searching your computer for it."];
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
function teamBotSkillsLocationLine(location, ownerSkillsListed) {
  const ownerSkills = ownerSkillsListed ? ` The owner's own skills under ${location} may also be listed; those are the owner's personal files, not the bot's, and are not readable from a teammate's conversation.` : "";
  return `Skills you save live on the bot, not on any computer: the catalog lists them under a plugins/bot-skills@\u2026/skills/<slug>/SKILL.md path. Open them only with Read at exactly the listed path; Shell cannot see them. Prefer the update_state tool (target "skill") to save, rewrite, and delete them. Cursor-managed skills are supplied by Cursor and cannot be edited or deleted at all.${ownerSkills}`;
}
var TEAM_BOT_SKILL_AUTHORITY_LINE = "  - Only the bot owner can save or delete skills on this bot. From anyone else's conversation, including a team admin's, say the owner can add it from their own main conversation with you or from Team access, and do not call update_state.";
var TEAM_BOT_SKILL_FILE_AUTHORING_LINES = [SKILL_FORMAT_LINE, SKILL_FRONTMATTER_EXAMPLE_LINE, SKILL_OTHER_FRONTMATTER_LINE, `Manage this bot's team skills with update_state (target "skill"):`, '  - Save a repeated task as a team skill: when you notice a multi-step task worth reusing (or the user asks), call action "write" with a name, a description, and a body holding the GENERIC, reusable steps. The description is required and is the only thing a reader sees when deciding whether to run the skill, so say when it applies. Keep conversation-specific details (which Slack channel, which repo, whose calendar) OUT of the recipe; those belong in the routine that runs it, not in the shared template. Saving a skill is a normal autonomous action, the same way you manage memory and routines: for a clearly reusable, unambiguous multi-step task, just write it and then mention it to the user, and only ask first when it is ambiguous whether it is worth saving.', `  - Rewrite one by passing its id to action "write"; remove one with action "delete". A bot skill's id is the slug from its catalog path: the folder under skills/, so plugins/bot-skills@\u2026/skills/release-notes/SKILL.md has the id release-notes (the full path works too). If the owner also has a personal skill with that slug, the bare slug names the bot skill; pass the personal skill's path to name that one instead. Deleting removes it for the whole team, so confirm with the user first.`, TEAM_BOT_SKILL_AUTHORITY_LINE, SKILL_INVOKE_LINE, "When you create or mention a bot skill, name it in plain text. Do not emit sand-workflow: links for bot skills; the Team access Context tab is where the owner sees them.", SKILL_AUTOMATION_POINTER_LINE];
var TEAM_BOT_SKILLIFY_AUTHORING_LINE = 'Saving a clearly reusable multi-step task as a team skill is a normal autonomous action (update_state, target "skill", action "write") when the bot owner is the one asking; anyone else, including a team admin, is told the owner can add it from their own main conversation or from Team access. Name bot skills in plain text, never as sand-workflow: links.';
function renderTeamBotSkillsSystemPrompt(location, options2) {
  const catalog = [TEAM_BOT_SKILLS_LIBRARY_LINE, TEAM_BOT_SKILLS_CATALOG_LINE, teamBotSkillsLocationLine(location, options2.ownerSkillsListed === true), ...virtualSkillFilesLines(location)];
  const authoring = options2.skillPointer != null ? [TEAM_BOT_SKILLIFY_AUTHORING_LINE, options2.skillPointer] : TEAM_BOT_SKILL_FILE_AUTHORING_LINES;
  return [...catalog, ...authoring].join("\n");
}
function renderSkillsSystemPrompt(location, options2) {
  if (location == null) return "";
  if (options2?.teamBot === true) return renderTeamBotSkillsSystemPrompt(location, options2);
  const virtual = options2?.virtualSkillFiles === true;
  const catalog = [SKILLS_LIBRARY_LINE, virtual ? SKILLS_CATALOG_VIRTUAL_LINE : SKILLS_CATALOG_ON_DISK_LINE, skillsLocationLine(location), ...virtual ? virtualSkillFilesLines(location) : []];
  const authoring = options2?.skillPointer != null ? ['Saving a clearly reusable multi-step task as a skill is a normal autonomous action (update_state, target "skill", action "write"); mention a skill as [name](sand-workflow:<id>) so it renders as a pill.', options2.skillPointer] : virtual ? SKILL_FILE_AUTHORING_LINES : SKILLS_AUTHORING_LINES;
  return [...catalog, ...authoring].join("\n");
}


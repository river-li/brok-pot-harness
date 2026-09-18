var import_node_fs71 = require("node:fs");
var import_promises59 = require("node:fs/promises");
var import_node_os25 = require("node:os");
var import_node_path118 = require("node:path");
init_dist();
init_dashboard_connect();
init_dashboard_pb();
init_errors();
init_cursor_inference();
var PUBLISH_SKILL_RPC_TIMEOUT_MS = 6e4;
var PUBLISH_TARGETS_RPC_TIMEOUT_MS = 1e4;
var CONFIRM_PUBLISH_MAX_ATTEMPTS = 5;
var UNPUBLISHABLE_FILES = /* @__PURE__ */ new Set([LEGACY_WORKFLOW_FILENAME, "runs.json"]);
function createSandSkillPublishClient(deps) {
  return createSandCursorBackendClient(DashboardService, {
    backend: deps.backend,
    getAccessToken: deps.auth.getAccessToken,
    getTeamId: deps.auth.getTeamId,
    getMachineId: deps.auth.getMachineId
  });
}
function teamIdsWhereOnlyAdminsMayPublish(memberPublishSettings) {
  const adminOnly = /* @__PURE__ */ new Set();
  for (const marketplace of memberPublishSettings ?? []) {
    if (marketplace.isDefault && marketplace.allowUserPublish === false) {
      adminOnly.add(marketplace.teamId);
    }
  }
  return adminOnly;
}
function noPublishTargetsReason(counts) {
  if (counts.publishableTeamCount > 0) return null;
  if (counts.seatedTeamCount > 0) {
    return "Your team admin has turned off publishing for members. Ask an admin to publish this skill.";
  }
  return "Publishing a skill needs a Cursor team. Join or create one, then try again.";
}
function noPublishTargetsRefusal(counts) {
  const fallback2 = noPublishTargetsReason(counts);
  if (fallback2 === null) return null;
  return {
    kind: counts.seatedTeamCount > 0 ? "team_member_publishing_disabled" : "team_required",
    fallback: fallback2
  };
}
function publishableTeams(response, memberPublishSettingsOrUnknown = void 0) {
  const adminOnly = teamIdsWhereOnlyAdminsMayPublish(memberPublishSettingsOrUnknown);
  return response.teams.filter((team) => team.id > 0 && team.isDirectMember).filter(
    (team) => !adminOnly.has(team.id) || team.grantedPermissions.includes(TeamPermission.ManageTeamPlugins)
  ).map((team) => ({ teamId: team.id, name: team.name }));
}
async function stageSkillDirForPublish(args) {
  const staged = (0, import_node_path118.join)(args.targetDir, (0, import_node_path118.basename)(args.skillDir));
  await (0, import_promises59.cp)(args.skillDir, staged, {
    recursive: true,
    dereference: true,
    filter: (source) => {
      if ((0, import_node_path118.dirname)(source) !== args.skillDir) return true;
      return !UNPUBLISHABLE_FILES.has((0, import_node_path118.basename)(source));
    }
  });
  return staged;
}
var SandSkillPublishService = class {
  constructor(options2) {
    this.options = options2;
    this.library = new GlobalSkillLibrary(getGlobalSkillsDir(options2.sandRootDir));
  }
  options;
  library;
  async listTargets() {
    let response;
    try {
      response = await this.options.client.getTeams(new GetTeamsRequest({ activeOnly: true }), {
        timeoutMs: PUBLISH_TARGETS_RPC_TIMEOUT_MS
      });
    } catch (error41) {
      this.options.log?.(
        `[sand:skill-publish] failed to resolve publishable teams: ${errorMessage5(error41)}`
      );
      this.options.reportEdgeFailed?.({
        stage: "list_targets",
        errorClass: errorLogTag(error41)
      });
      return {
        teams: [],
        unavailableReason: "Could not reach Cursor to check your teams.",
        unavailableReasonKind: "targets_unreachable"
      };
    }
    const memberPublishSettingsOrUnknown = await this.options.readMemberPublishMarketplaces();
    const seatedTeams = publishableTeams(response);
    const teams = publishableTeams(response, memberPublishSettingsOrUnknown);
    const unavailable2 = noPublishTargetsRefusal({
      publishableTeamCount: teams.length,
      seatedTeamCount: seatedTeams.length
    });
    return {
      teams,
      unavailableReason: unavailable2?.fallback ?? null,
      ...unavailable2 === null ? {} : { unavailableReasonKind: unavailable2.kind }
    };
  }
  async publish(args) {
    const record2 = this.requireLibraryRecord(args.workflowId);
    if (!Number.isInteger(args.teamId) || args.teamId <= 0) {
      throw new SandSkillPublishError("Choose a team to publish this skill to.");
    }
    const published = await this.upload({
      skillDir: (0, import_node_path118.dirname)(record2.filePath),
      skillRelativePath: record2.id,
      name: record2.name,
      description: record2.description,
      teamId: args.teamId,
      pluginName: record2.name,
      displayName: void 0
    });
    const landedId = await this.confirmPublishLanded(published);
    const promotedWorkflowId = landedId != null && this.library.remove(record2.id) ? landedId : null;
    if (promotedWorkflowId == null) {
      this.options.log?.(
        `[sand:skill-publish] kept the library copy of ${record2.id}: commit ${published.commitSha} was not confirmed installed`
      );
    }
    return { ...published, promotedWorkflowId };
  }
  async resync(args) {
    const { record: record2, teamId } = this.requirePublishedPluginSkill(args.workflowId);
    const parsed2 = readSkillFrontmatter(record2.filePath);
    const name17 = parsed2.name.length > 0 ? parsed2.name : record2.name;
    const published = await this.upload({
      skillDir: (0, import_node_path118.dirname)(record2.filePath),
      skillRelativePath: skillsRootRelativePath(record2.skillRelativePath),
      name: name17,
      description: parsed2.description,
      teamId,
      pluginName: await requireManifestName(record2.installPath),
      displayName: name17
    });
    await this.syncBestEffort();
    return { ...published, promotedWorkflowId: null };
  }
  async unpublish(args) {
    const { record: record2, teamId } = this.requirePublishedPluginSkill(args.workflowId);
    const restoredWorkflowId = await this.restoreToLibrary(record2);
    await this.options.client.unpublishPlugin(
      new UnpublishPluginRequest({ pluginId: BigInt(record2.pluginId), teamId }),
      { timeoutMs: PUBLISH_SKILL_RPC_TIMEOUT_MS }
    );
    await this.syncBestEffort();
    return { restoredWorkflowId };
  }
  async restoreToLibrary(record2) {
    const skillsRoot = getGlobalSkillsDir(this.options.sandRootDir);
    const skillDir2 = (0, import_node_path118.dirname)(record2.filePath);
    const libraryId = (0, import_node_path118.basename)(skillDir2);
    if (this.library.get(libraryId) != null) return libraryId;
    const [restored] = await restoreSkillsFromPluginDir({
      skillDirs: [skillDir2],
      pluginSkillsRoot: (0, import_node_path118.join)(record2.installPath, "skills"),
      skillsRoot
    });
    return restored != null && (0, import_node_path118.dirname)(restored) === skillsRoot ? (0, import_node_path118.basename)(restored) : null;
  }
  async upload(args) {
    if (args.description.trim().length === 0) {
      throw new SandSkillPublishError(
        "Add a description before publishing \u2014 it is how teammates and agents know when to use this skill.",
        "description_required"
      );
    }
    const workDir = await (0, import_promises59.mkdtemp)((0, import_node_path118.join)((0, import_node_os25.tmpdir)(), "sand-publish-skill-"));
    try {
      const staged = await stageSkillDirForPublish({
        skillDir: args.skillDir,
        targetDir: (0, import_node_path118.join)(workDir, "staged")
      });
      const pluginDir = await synthesizeSkillPluginDir({
        skills: [{ dir: staged, relativePath: args.skillRelativePath }],
        targetDir: (0, import_node_path118.join)(workDir, "plugin"),
        pluginName: args.pluginName,
        ...args.displayName != null ? { displayName: args.displayName } : {}
      });
      const manifestName = await readManifestName(pluginDir) ?? args.pluginName;
      const tarGz = new Uint8Array(await packPluginArtifact(pluginDir));
      const response = await this.options.client.publishPlugin(
        new PublishPluginRequest({
          teamId: args.teamId,
          name: manifestName,
          displayName: args.displayName ?? args.name,
          description: args.description,
          pluginTarGz: tarGz
        }),
        { timeoutMs: PUBLISH_SKILL_RPC_TIMEOUT_MS }
      );
      return {
        pluginId: response.pluginId.toString(),
        commitSha: response.commitSha
      };
    } finally {
      try {
        await (0, import_promises59.rm)(workDir, { recursive: true, force: true });
      } catch (error41) {
        this.options.log?.(
          `[sand:skill-publish] failed to clean up ${workDir}: ${errorMessage5(error41)}`
        );
        this.options.reportEdgeFailed?.({
          stage: "cleanup",
          errorClass: errorLogTag(error41)
        });
      }
    }
  }
  async confirmPublishLanded(published) {
    for (let attempt = 0; attempt < CONFIRM_PUBLISH_MAX_ATTEMPTS; attempt++) {
      await this.syncBestEffort();
      const landed = this.options.pluginSkills.currentIndex()?.skills.find(
        (record2) => record2.pluginId === published.pluginId && record2.pluginVersion === published.commitSha && (0, import_node_fs71.existsSync)(record2.filePath)
      );
      if (landed != null) return landed.id;
    }
    return null;
  }
  requireLibraryRecord(workflowId) {
    const record2 = this.library.get(workflowId);
    if (record2 == null) {
      throw new SandSkillPublishError("That skill no longer exists in your library.");
    }
    return record2;
  }
  requirePublishedPluginSkill(workflowId) {
    const index = this.options.pluginSkills.currentIndex();
    const record2 = index?.skills.find((candidate) => candidate.id === workflowId);
    if (index == null || record2 == null) {
      throw new SandSkillPublishError("That skill is no longer installed.");
    }
    if (record2.publisherUserId == null || record2.publisherUserId !== index.currentUserId) {
      throw new SandSkillPublishError(`"${record2.name}" belongs to a plugin you did not publish.`);
    }
    if (record2.marketplaceTeamId == null) {
      throw new SandSkillPublishError(
        `"${record2.name}" is not in a team marketplace, so there is nothing to sync it back to.`
      );
    }
    return { record: record2, teamId: record2.marketplaceTeamId };
  }
  async syncBestEffort() {
    try {
      await this.options.pluginSkills.sync("install");
    } catch (error41) {
      this.options.log?.(
        `[sand:skill-publish] plugin-skills sync after publish failed: ${errorMessage5(error41)}`
      );
      this.options.reportEdgeFailed?.({
        stage: "sync",
        errorClass: errorLogTag(error41)
      });
    }
  }
};
function readSkillFrontmatter(filePath) {
  let parsed2 = null;
  try {
    parsed2 = parseSkillFile((0, import_node_fs71.readFileSync)(filePath, "utf8"));
  } catch (error41) {
    reportFallbackUnlessAbsent("skill_publish", error41);
    parsed2 = null;
  }
  if (parsed2 == null) {
    throw new SandSkillPublishError("That skill's file could not be read.");
  }
  return { name: parsed2.name, description: parsed2.description };
}
async function readManifestName(pluginDir) {
  try {
    const raw = await (0, import_promises59.readFile)((0, import_node_path118.join)(pluginDir, "plugin.json"), "utf-8");
    const manifest = JSON.parse(raw);
    if (typeof manifest.name === "string" && manifest.name.trim() !== "") {
      return manifest.name;
    }
  } catch (error41) {
    reportFallbackUnlessAbsent("skill_publish", error41);
    return null;
  }
  return null;
}
async function requireManifestName(installPath) {
  const name17 = await readManifestName(installPath);
  if (name17 == null) {
    throw new SandSkillPublishError(
      "Could not read that plugin's manifest, so syncing would risk publishing a duplicate. Reinstall the plugin and try again."
    );
  }
  return name17;
}
function skillsRootRelativePath(skillRelativePath) {
  const segments = (0, import_node_path118.dirname)(skillRelativePath).split(/[/\\]/).filter((segment) => segment.length > 0);
  const withoutRoot = segments[0] === "skills" ? segments.slice(1) : segments;
  if (withoutRoot.length === 0) {
    throw new SandSkillPublishError("That skill sits at a path Sand cannot re-pack.");
  }
  return withoutRoot.join("/");
}
function errorMessage5(error41) {
  return error41 instanceof Error ? error41.message : String(error41);
}

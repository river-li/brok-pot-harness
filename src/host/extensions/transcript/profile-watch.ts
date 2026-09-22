/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/host/extensions/transcript/profile-watch.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var import_node_fs92 = require("node:fs");
var import_node_path151 = require("node:path");
var PROFILE_WATCH_DEBOUNCE_MS = 50;
var ProfileWatch = class {
  constructor(tm, emitter, rosterEmit) {
    this.tm = tm;
    this.emitter = emitter;
    this.rosterEmit = rosterEmit;
  }
  tm;
  emitter;
  rosterEmit;
  profileWatcher;
  profileWatchTimer;
  watchedProfileAgentId;
  pendingAvatarChange = false;
  hostWrittenAvatarVersions = /* @__PURE__ */ new Map();
  lastKnownAgentNames = /* @__PURE__ */ new Map();
  emitProfileChanged(agentId, avatarChanged = false) {
    this.recordNameChangeEvent(agentId);
    this.emitter.emit("profile-changed", {
      agentId,
      avatarChanged
    });
  }
  noteAgentIdentityRenamed({
    agentId,
    previousName,
    name: name17
  }) {
    if (this.tm.sessions.isAgentGone(agentId)) return;
    const recordedName = this.lastKnownAgentNames.get(agentId);
    this.lastKnownAgentNames.set(agentId, name17);
    if (previousName.trim().length === 0 || previousName === name17 || recordedName === name17) {
      return;
    }
    this.tm.emitTimelineEvent(agentId, {
      type: "name-changed",
      from: previousName,
      to: name17
    });
  }
  noteHostWrittenAvatarVersion(args) {
    this.hostWrittenAvatarVersions.set(args.agentId, args.version);
  }
  recordNameChangeEvent(agentId) {
    const profile = this.tm.sessionStore.getAgentProfileText(agentId);
    const currentName = profile?.name.trim() ?? "";
    if (currentName.length === 0) return;
    const previousName = this.lastKnownAgentNames.get(agentId);
    this.lastKnownAgentNames.set(agentId, currentName);
    if (previousName == null || previousName === currentName) return;
    this.tm.emitTimelineEvent(agentId, {
      type: "name-changed",
      from: previousName,
      to: currentName
    });
  }
  seedKnownAgentName(agentId) {
    if (this.lastKnownAgentNames.has(agentId)) return;
    const profile = this.tm.sessionStore.getAgentProfileText(agentId);
    const name17 = profile?.name.trim() ?? "";
    if (name17.length > 0) this.lastKnownAgentNames.set(agentId, name17);
  }
  subscribeProfileChanged(listener) {
    this.emitter.on("profile-changed", listener);
    return () => {
      this.emitter.off("profile-changed", listener);
    };
  }
  watchSessionProfile(session) {
    if (this.watchedProfileAgentId === session.id) return;
    this.stopWatchingProfile();
    this.watchedProfileAgentId = session.id;
    this.seedKnownAgentName(session.id);
    try {
      this.profileWatcher = (0, import_node_fs92.watch)((0, import_node_path151.dirname)(session.dbPath), (_event, filename) => {
        if (filename !== SAND_PROFILE_FILENAME && filename !== SAND_SETTINGS_FILENAME && (filename == null || !isConventionalAvatarFilename(filename))) {
          return;
        }
        this.scheduleProfileEmit(filename != null && isConventionalAvatarFilename(filename));
      });
    } catch {
    }
  }
  scheduleProfileEmit(avatarChanged) {
    this.pendingAvatarChange ||= avatarChanged;
    if (this.profileWatchTimer != null) return;
    this.profileWatchTimer = this.tm.clock.schedule(PROFILE_WATCH_DEBOUNCE_MS, () => {
      this.profileWatchTimer = void 0;
      const pendingAvatarChange = this.pendingAvatarChange;
      this.pendingAvatarChange = false;
      const agentId = this.watchedProfileAgentId;
      if (agentId != null) {
        const active = this.tm.sessions.activeSession;
        if (active != null && active.id === agentId) {
          invalidateAvatarDataUrlCache((0, import_node_path151.dirname)(active.dbPath));
        }
        void this.rosterEmit.emitAgentUpdate(agentId);
        if (pendingAvatarChange) void this.emitLocalAvatarChange(agentId);
        else this.emitProfileChanged(agentId, false);
      } else {
        void this.rosterEmit.emitAgents();
      }
    });
  }
  async emitLocalAvatarChange(agentId) {
    const onDisk = await this.tm.sessionStore.getAgentAvatar(agentId);
    const isHostWritten = onDisk.version === this.hostWrittenAvatarVersions.get(agentId);
    this.emitProfileChanged(agentId, !isHostWritten);
  }
  stopWatchingProfile() {
    this.profileWatcher?.close();
    this.profileWatcher = void 0;
    this.profileWatchTimer?.dispose();
    this.profileWatchTimer = void 0;
    this.pendingAvatarChange = false;
    this.watchedProfileAgentId = void 0;
  }
  async getAgentDisplayProfile(agentId) {
    const dir = this.tm.sessionStore.getAgentDir(agentId);
    if (!(0, import_node_fs92.existsSync)(dir)) return null;
    const profile = readSandProfileFile(getSandProfilePath(dir));
    return {
      name: profile != null && profile.name.trim().length > 0 ? profile.name.trim() : SAND_DEFAULT_AGENT_NAME,
      description: profile?.description ?? ""
    };
  }
  resolveAgentProfile(session) {
    const filePath = getSandProfilePath((0, import_node_path151.dirname)(session.dbPath));
    const fileProfile = readSandProfileFile(filePath);
    const name17 = fileProfile != null && fileProfile.name.trim().length > 0 ? fileProfile.name : SAND_DEFAULT_AGENT_NAME;
    const description9 = fileProfile?.description ?? "";
    const settingsFilePath = getSandSettingsPath((0, import_node_path151.dirname)(session.dbPath));
    return { name: name17, description: description9, filePath, settingsFilePath };
  }
};


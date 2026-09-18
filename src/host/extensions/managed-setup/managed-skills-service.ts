var SandManagedSkillsService = class {
  constructor(options2) {
    this.options = options2;
  }
  options;
  isDisposed = false;
  refreshPromise = null;
  pendingTrigger = null;
  start() {
    void this.refresh("startup");
  }
  handleAuthChange() {
    void this.refresh("auth_change");
  }
  async ensureSkill(id) {
    if (readManagedSkillsCache(this.options.getCacheDir())?.skills.some((skill) => skill.id === id)) {
      return true;
    }
    await this.refresh("on_demand");
    return readManagedSkillsCache(this.options.getCacheDir())?.skills.some(
      (skill) => skill.id === id
    ) === true;
  }
  dispose() {
    this.isDisposed = true;
  }
  async refresh(trigger2) {
    if (this.isDisposed) return;
    if (this.refreshPromise != null) {
      this.pendingTrigger = trigger2;
      return await this.refreshPromise;
    }
    this.refreshPromise = this.runRefreshes(trigger2);
    try {
      await this.refreshPromise;
    } finally {
      this.refreshPromise = null;
    }
  }
  async runRefreshes(trigger2) {
    let nextTrigger = trigger2;
    while (nextTrigger != null && !this.isDisposed) {
      nextTrigger = null;
      try {
        const fetched = await this.options.fetch();
        if (this.isDisposed) return;
        const skills = [];
        for (const skill of fetched) {
          const normalized = fetchedManagedSkillToSandSkill(skill);
          if (normalized != null) skills.push(normalized);
        }
        writeManagedSkillsCache(this.options.getCacheDir(), skills);
      } catch (error41) {
        this.options.report?.({
          extension: "managed_setup",
          kind: "managed_skills",
          errorClass: errorLogTag(error41)
        });
      } finally {
        nextTrigger = this.pendingTrigger;
        this.pendingTrigger = null;
      }
    }
  }
};

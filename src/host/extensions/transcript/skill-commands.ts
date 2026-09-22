/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/host/extensions/transcript/skill-commands.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var SkillCommands = class {
  constructor(tm) {
    this.tm = tm;
  }
  tm;
  watchedSkills;
  enqueueSkillMutation({
    agentId,
    activeMutation,
    inactiveMutation
  }) {
    return this.tm.automationRuntime.enqueueAutomationLifecycleMutation({
      agentId,
      mutation: () => {
        const active = this.tm.sessions.activeSession;
        if (active?.id === agentId) {
          this.tm.automationRuntime.recordAutomationChangeEvents(active, "agent");
          const skills2 = activeMutation(active);
          this.tm.automationRuntime.recordAutomationChangeEvents(active, "workflow_ui");
          return skills2;
        }
        const before = this.tm.sessionStore.listAgentAutomations(agentId);
        this.tm.automationRuntime.recordInactiveAutomationChanges({
          agentId,
          before,
          after: before,
          source: "agent"
        });
        const skills = inactiveMutation();
        const after = this.tm.sessionStore.listAgentAutomations(agentId);
        this.tm.automationRuntime.recordInactiveAutomationChanges({
          agentId,
          before,
          after,
          source: "workflow_ui"
        });
        return skills;
      }
    });
  }
  watchSessionSkills(session) {
    if (this.watchedSkills === session.skills) return;
    this.watchedSkills?.setOnChange(void 0);
    this.watchedSkills = session.skills;
    session.skills.setOnChange(() => this.emitSkills(session));
  }
  emitSkills(session) {
    if (this.tm.sessions.activeSession?.id !== session.id || !this.tm.shouldEmitAutomations()) {
      return;
    }
    this.tm.roster.emitter.emit("skills", {
      agentId: session.id,
      workflows: limitSurfacedSkills(session.skills.listAll())
    });
  }
  subscribeSkills(listener) {
    this.tm.roster.emitter.on("skills", listener);
    return () => {
      this.tm.roster.emitter.off("skills", listener);
    };
  }
  async getAgentWorkflows(agentId) {
    const active = this.tm.sessions.activeSession;
    if (active != null && active.id === agentId) {
      return limitSurfacedSkills(active.skills.listAll());
    }
    return this.tm.sessionStore.listAgentSkills(agentId);
  }
  async createAgentWorkflow(agentId, spec) {
    return this.enqueueSkillMutation({
      agentId,
      activeMutation: (active) => {
        active.skills.create(spec, "user");
        return limitSurfacedSkills(active.skills.listAll());
      },
      inactiveMutation: () => this.tm.sessionStore.createAgentWorkflow(agentId, spec)
    });
  }
  async updateAgentWorkflow(agentId, workflowId, spec) {
    return this.enqueueSkillMutation({
      agentId,
      activeMutation: (active) => {
        active.skills.update(workflowId, spec, "user");
        return limitSurfacedSkills(active.skills.listAll());
      },
      inactiveMutation: () => this.tm.sessionStore.updateAgentWorkflow(agentId, workflowId, spec)
    });
  }
  async deleteAgentWorkflow(agentId, workflowId) {
    return this.enqueueSkillMutation({
      agentId,
      activeMutation: (active) => {
        active.skills.remove(workflowId);
        return limitSurfacedSkills(active.skills.listAll());
      },
      inactiveMutation: () => this.tm.sessionStore.removeAgentSkill(agentId, workflowId)
    });
  }
  async importAgentSkillMarkdown(agentId, markdown, fallbackName) {
    const active = this.tm.sessions.activeSession;
    if (active != null && active.id === agentId) {
      const imported = active.skills.importMarkdown(markdown, fallbackName);
      return {
        workflows: limitSurfacedSkills(active.skills.listAll()),
        result: imported != null ? { imported: [imported], skipped: [] } : {
          imported: [],
          skipped: [{ source: "pasted skill", reason: "empty or invalid" }]
        }
      };
    }
    return this.tm.sessionStore.importAgentSkillMarkdown(agentId, markdown, fallbackName);
  }
  async importAgentSkillSource(agentId, source, fallbackName) {
    const active = this.tm.sessions.activeSession;
    if (active != null && active.id === agentId) {
      const imported = active.skills.importLiveSource(source, fallbackName);
      return {
        workflows: limitSurfacedSkills(active.skills.listAll()),
        result: imported != null ? { imported: [imported], skipped: [] } : { imported: [], skipped: [{ source, reason: "could not link" }] }
      };
    }
    return this.tm.sessionStore.importAgentSkillSource(agentId, source, fallbackName);
  }
  async importAgentWorkflowUrl(agentId, url2, name17) {
    return this.tm.importAgentSkillSource(agentId, url2, name17 ?? deriveSkillNameFromUrl(url2));
  }
  async runAgentWorkflowNow(agentId, workflowId) {
    const skill = await this.getSkillForAgent(agentId, workflowId);
    if (skill == null) return;
    const automation = skillToAutomation(skill);
    if (automation != null) {
      await this.tm.automationRuntime.fireAutomation({
        agentId,
        automation,
        trigger: "manual"
      });
      return;
    }
    await this.tm.sendPrompt(`@${skill.name}`, {
      richText: JSON.stringify({
        type: "doc",
        content: [
          {
            type: "paragraph",
            content: [
              {
                type: SKILL_REFERENCE_NODE_TYPE,
                attrs: { id: skill.id, label: skill.name }
              }
            ]
          }
        ]
      })
    });
  }
  async getSkillForAgent(agentId, workflowId) {
    const active = this.tm.sessions.activeSession;
    if (active != null && active.id === agentId) {
      return active.skills.get(workflowId);
    }
    return this.tm.sessionStore.getAgentSkill(agentId, workflowId);
  }
  expandSkillReferences(session, prompt, richText) {
    return expandSkillReferences({
      prompt,
      richText,
      getSkill: (skillId) => session.skills.get(skillId),
      timeZone: this.tm.sessionStore.getUserTimeZone()
    });
  }
  withMentionedAgentsContext(session, rawPrompt, promptForRun) {
    if (rawPrompt.length === 0) return promptForRun;
    if (this.tm.groupChat.isGroupSession(session)) return promptForRun;
    const roster = this.tm.listAgentsSync().filter((agent) => {
      if (agent.id === session.id) return false;
      if (agent.isGroup) return agent.memberIds.includes(session.id);
      return true;
    });
    if (roster.length === 0) return promptForRun;
    const { memberIds } = parseGroupMentions(rawPrompt, roster);
    if (memberIds.length === 0) return promptForRun;
    const rosterById = new Map(roster.map((agent) => [agent.id, agent]));
    const mentioned = [];
    for (const id of memberIds) {
      const agent = rosterById.get(id);
      if (agent != null) {
        mentioned.push({
          id: agent.id,
          name: agent.name,
          description: agent.description,
          isGroup: agent.isGroup
        });
      }
    }
    const context2 = buildMentionedAgentsContext(mentioned);
    if (context2 == null) return promptForRun;
    return promptForRun.length > 0 ? `${context2}

${promptForRun}` : context2;
  }
};


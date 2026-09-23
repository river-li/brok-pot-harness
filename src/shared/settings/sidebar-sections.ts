init_unknown_record();
var AGENTS_SECTION_ID = "__agents__";
var AGENTS_SECTION_NAME = "Unassigned";
var NO_SIDEBAR_SECTIONS = [];
var SidebarSections = class _SidebarSections {
  static normalize(sections) {
    const seenSectionIds = /* @__PURE__ */ new Set();
    const claimedAgentIds = /* @__PURE__ */ new Set();
    const normalized = [];
    for (const section of sections) {
      const id = section.id.trim();
      if (id.length === 0 || seenSectionIds.has(id)) continue;
      seenSectionIds.add(id);
      if (id === AGENTS_SECTION_ID) continue;
      const agentIds = [];
      for (const agentId of section.agentIds) {
        if (agentId.length === 0 || claimedAgentIds.has(agentId)) continue;
        claimedAgentIds.add(agentId);
        agentIds.push(agentId);
      }
      normalized.push({
        id,
        name: section.name,
        agentIds
      });
    }
    if (normalized.length === 0) return NO_SIDEBAR_SECTIONS;
    normalized.push({
      id: AGENTS_SECTION_ID,
      name: AGENTS_SECTION_NAME,
      agentIds: []
    });
    return normalized;
  }
  static parse(value) {
    const records2 = [];
    for (const entry of value) {
      if (!isUnknownRecord(entry)) continue;
      if (typeof entry.id !== "string") continue;
      records2.push({
        id: entry.id,
        name: typeof entry.name === "string" ? entry.name : "",
        agentIds: Array.isArray(entry.agentIds) ? entry.agentIds.filter((id) => typeof id === "string") : []
      });
    }
    return _SidebarSections.normalize(records2);
  }
  static areEqual(left, right) {
    return left.length === right.length && left.every((section, index) => {
      const other = right[index];
      return other !== void 0 && section.id === other.id && section.name === other.name && section.agentIds.length === other.agentIds.length && section.agentIds.every((agentId, at3) => agentId === other.agentIds[at3]);
    });
  }
  static withFolds(sections, collapsedSectionIds) {
    const collapsed = new Set(collapsedSectionIds);
    return sections.map((section) => ({
      ...section,
      isCollapsed: collapsed.has(section.id)
    }));
  }
  static assignAgents(sections, agentIds, sectionId) {
    const normalized = _SidebarSections.normalize(sections);
    if (sectionId !== AGENTS_SECTION_ID && !normalized.some((section) => section.id === sectionId)) {
      return null;
    }
    const moved = new Set(agentIds);
    const stripped = normalized.map((section) => ({
      ...section,
      agentIds: section.agentIds.filter((id) => !moved.has(id))
    }));
    return sectionId === AGENTS_SECTION_ID ? stripped : stripped.map((section) => section.id === sectionId ? {
      ...section,
      agentIds: [...section.agentIds, ...moved]
    } : section);
  }
  static carryFolds({
    sections,
    stored = []
  }) {
    const foldBySectionId = /* @__PURE__ */ new Map();
    for (const section of [...stored, ...sections]) {
      if (section.isCollapsed !== void 0) {
        foldBySectionId.set(section.id.trim(), section.isCollapsed);
      }
    }
    return _SidebarSections.normalize(sections).map((section) => ({
      ...section,
      isCollapsed: foldBySectionId.get(section.id) ?? false
    }));
  }
};

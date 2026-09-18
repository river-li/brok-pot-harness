init_unknown_record();
function isStoreUnreadable(error41) {
  return isUnknownRecord(error41) && error41.isSandAgentStoreUnreadable === true;
}
var RosterSearch = class {
  constructor(tm) {
    this.tm = tm;
  }
  tm;
  async searchAgents(query, limit = this.tm.contentSearch.maxResults) {
    const normalized = query.trim().toLowerCase();
    if (normalized.length === 0) return [];
    if (this.tm.contentSearch.isSearchReady) {
      const indexed = await this.tm.contentSearch.searchMessages({
        query: normalized,
        limit: limit + this.tm.contentSearch.maxMatchesPerAgent
      });
      if (indexed != null) {
        const liveAgentId = this.tm.sessions.inMemoryTranscriptAgentId;
        const results = indexed.filter(
          (match2) => match2.agentId !== liveAgentId && this.tm.sessionStore.agentExists(match2.agentId)
        );
        if (liveAgentId != null) {
          const entries = getTranscript();
          const newestLiveMs = entries.reduce((newest, entry) => Math.max(newest, entry.timestampMs ?? 0), 0) || Date.now();
          for (const match2 of this.tm.contentSearch.findTranscriptMatches(entries, normalized)) {
            results.push({
              agentId: liveAgentId,
              entryId: match2.entryId,
              role: match2.role,
              timestampMs: match2.timestampMs > 0 ? match2.timestampMs : newestLiveMs,
              snippet: match2.snippet
            });
          }
        }
        return results.sort((a, b2) => b2.timestampMs - a.timestampMs).slice(0, limit);
      }
    }
    return this.searchAgentsByLinearScan(normalized, limit);
  }
  async searchAgentsByLinearScan(normalized, limit) {
    const activeId = this.tm.getActiveAgentId();
    const agents = await this.tm.sessionStore.listAgents(activeId ?? void 0);
    const results = [];
    for (const agent of agents) {
      let entries;
      try {
        entries = activeId != null && agent.id === activeId ? getTranscript() : this.tm.sessionStore.readAgentTranscriptEntries(agent.id);
      } catch (error41) {
        if (!isStoreUnreadable(error41)) throw error41;
        continue;
      }
      for (const match2 of this.tm.contentSearch.findTranscriptMatches(entries, normalized)) {
        results.push({
          agentId: agent.id,
          entryId: match2.entryId,
          role: match2.role,
          timestampMs: match2.timestampMs > 0 ? match2.timestampMs : agent.updatedAt,
          snippet: match2.snippet
        });
      }
    }
    results.sort((a, b2) => b2.timestampMs - a.timestampMs);
    return results.slice(0, limit);
  }
  async searchMedia(query, limit = this.tm.contentSearch.maxResults) {
    if (!this.tm.contentSearch.isSearchReady) throw new SandSearchUnavailableError();
    const matches = await this.tm.contentSearch.searchMedia({
      query: query.trim(),
      limit
    });
    if (matches == null) throw new SandSearchUnavailableError();
    return matches.filter((match2) => this.tm.sessionStore.agentExists(match2.agentId));
  }
};

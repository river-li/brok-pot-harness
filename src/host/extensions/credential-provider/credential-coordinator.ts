/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/host/extensions/credential-provider/credential-coordinator.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var siteMatchSortScore = { exact: 2, subdomain: 1 };
var CredentialCoordinator = class {
  constructor(options2) {
    this.options = options2;
    this.log = options2.log ?? (() => void 0);
    this.audit = options2.audit ?? (() => void 0);
  }
  options;
  directory = null;
  refreshedAtMs = 0;
  log;
  audit;
  setDirectory(directory) {
    this.directory = directory;
    const count = directory?.items.length ?? 0;
    this.log(
      directory == null ? "credentials: directory cleared (1Password disconnected)" : `credentials: directory synced (${count} item(s), values never mirrored)`
    );
  }
  getDirectory() {
    return this.directory;
  }
  async refresh(mode = "cached") {
    if (this.options.loadDirectory === void 0 || mode === "cached" && Date.now() - this.refreshedAtMs < 1e3) {
      return;
    }
    try {
      this.setDirectory(
        await this.options.loadDirectory(mode === "cached" || mode === "fresh" ? void 0 : mode)
      );
    } catch (error42) {
      const reason = error42 instanceof Error ? error42.name : "unknown";
      this.log(`credentials: backend directory refresh failed (${reason})`);
    } finally {
      this.refreshedAtMs = Date.now();
    }
  }
  async getFreshDirectory() {
    await this.refresh("fresh");
    return this.directory;
  }
  auditAgentAccess(args) {
    this.audit({
      event: "agent-access",
      operation: "resolve-browser-target",
      outcome: args.outcome,
      reason: args.reason,
      targetUrl: args.targetUrl,
      ...args.credentialId !== void 0 ? { credentialId: args.credentialId } : {},
      approvalMode: "allow-once"
    });
  }
  async resolveBrowserTarget(item, siteHint) {
    if (this.options.resolveBrowserTarget == null) {
      this.auditAgentAccess({
        outcome: "failed",
        reason: "target-resolution-unavailable",
        targetUrl: siteHint,
        credentialId: item.credentialId
      });
      return {
        ok: false,
        detail: "Browser credential target resolution is unavailable."
      };
    }
    let result;
    try {
      result = await this.options.resolveBrowserTarget(item, siteHint);
    } catch (error42) {
      this.auditAgentAccess({
        outcome: "failed",
        reason: "target-resolution-failed",
        targetUrl: siteHint,
        credentialId: item.credentialId
      });
      throw error42;
    }
    this.auditAgentAccess({
      outcome: result.ok ? "success" : "refused",
      reason: result.ok ? "target-resolved" : "target-unavailable",
      targetUrl: result.ok ? result.targetSite : siteHint,
      credentialId: item.credentialId
    });
    this.log(`credentials: browser target ${result.ok ? "resolved" : "unavailable"}`);
    return result;
  }
  createAccess() {
    return {
      isConnected: async () => {
        await this.refresh();
        return this.directory !== null;
      },
      list: async (search) => {
        await this.refresh(search?.forceRefresh === true ? "manual" : "stale");
        const directory = this.directory;
        if (directory == null) return [];
        const query = search?.query?.trim().toLowerCase() ?? "";
        const views = directory.items.filter(isBrowserLoginCredential).map((item) => {
          const siteMatch = search?.site != null ? matchCredentialItemToSite(item, search.site) : null;
          return { item, siteMatch };
        }).filter(({ item, siteMatch }) => {
          if (search?.site != null && siteMatch == null) return false;
          if (query.length === 0) return true;
          return [item.title, ...item.sites].some((value) => value.toLowerCase().includes(query));
        }).toSorted((left, right) => {
          if (search?.site == null) return 0;
          const leftScore = left.siteMatch == null ? 0 : siteMatchSortScore[left.siteMatch.kind];
          const rightScore = right.siteMatch == null ? 0 : siteMatchSortScore[right.siteMatch.kind];
          return rightScore - leftScore || left.item.title.localeCompare(right.item.title);
        }).map(({ item, siteMatch }) => ({
          credentialId: item.credentialId,
          connectionId: item.connectionId,
          catalogRevision: item.catalogRevision,
          title: item.title,
          category: item.category,
          sites: item.sites,
          ...siteMatch != null ? { siteMatch: siteMatch.kind } : {},
          hasOneTimeCode: item.hasOneTimeCode
        }));
        this.log(
          `credentials: list completed (${search?.site != null ? "site" : "catalog"}, ${views.length} match(es))`
        );
        return views;
      },
      resolveBrowserTarget: async (reference, siteHint) => {
        await this.refresh();
        const directory = this.directory;
        const item = directory?.items.find(
          (candidate) => candidate.credentialId === reference.credentialId && candidate.connectionId === reference.connectionId && candidate.catalogRevision === reference.catalogRevision
        );
        if (item == null) {
          this.auditAgentAccess({
            outcome: "refused",
            reason: "credential-not-found",
            targetUrl: siteHint
          });
          return {
            ok: false,
            detail: "That credential is no longer in the synced 1Password vault. Sync credentials and try again."
          };
        }
        if (!isBrowserLoginCredential(item)) {
          this.auditAgentAccess({
            outcome: "refused",
            reason: "unsupported-credential",
            targetUrl: siteHint,
            credentialId: item.credentialId
          });
          return {
            ok: false,
            detail: "That credential is not an allowed 1Password browser login."
          };
        }
        const binding = await this.resolveBrowserTarget(item, siteHint);
        if (!binding.ok) return binding;
        return {
          ...binding,
          autoFill: (directory?.alwaysAllowConnectionIds ?? []).includes(item.connectionId)
        };
      }
    };
  }
};


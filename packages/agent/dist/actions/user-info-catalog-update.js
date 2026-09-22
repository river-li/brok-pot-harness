/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/agent/dist/actions/user-info-catalog-update.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var USER_INFO_CATALOG_UPDATE_TAG = "user_info_catalog_update";
var SECTIONS_ATTRIBUTE_PATTERN = new RegExp(`<${USER_INFO_CATALOG_UPDATE_TAG} sections="([a-z_,]*)"`);
function parseUpdateSections(text2) {
  const match2 = SECTIONS_ATTRIBUTE_PATTERN.exec(text2);
  if (match2 === null) {
    return void 0;
  }
  const listed = new Set(match2[1].split(",").filter(Boolean));
  return new Set(USER_INFO_CATALOG_KINDS.filter((kind) => listed.has(kind)));
}
function getUserInfoCatalogUpdateKinds(params) {
  const { priorMessages, userInfoContent, inputs } = params;
  const unresolved = new Set(USER_INFO_CATALOG_KINDS);
  const stale = /* @__PURE__ */ new Set();
  for (let i = priorMessages.length - 1; i >= 1 && unresolved.size > 0; i--) {
    const message = priorMessages[i];
    if (message.role !== "user") {
      continue;
    }
    const text2 = userMessagePlainText(fromRedactedCoreMessage(message, PrivacyCapability.UNSAFE_ALWAYS_ALLOWED));
    if (text2 === void 0 || !text2.includes(`<${USER_INFO_CATALOG_UPDATE_TAG} `)) {
      continue;
    }
    const sections = parseUpdateSections(text2);
    if (sections === void 0) {
      continue;
    }
    for (const kind of sections) {
      if (!unresolved.delete(kind)) {
        continue;
      }
      if (!statementMatchesUserInfoCatalog(text2, kind, inputs)) {
        stale.add(kind);
      }
    }
  }
  if (unresolved.size > 0 && userInfoContent !== void 0) {
    for (const kind of getStaleUserInfoCatalogs(userInfoContent, inputs)) {
      if (unresolved.has(kind)) {
        stale.add(kind);
      }
    }
  }
  return USER_INFO_CATALOG_KINDS.filter((kind) => stale.has(kind));
}
function renderCatalogSection(kind, inputs) {
  switch (kind) {
    case "subagent_models":
      return inputs.availableSubagentModelsDescription === void 0 ? "The subagent models catalog no longer applies." : renderAvailableSubagentModelsSection(inputs.availableSubagentModelsDescription);
    case "subagent_types":
      return inputs.availableSubagentTypesDescription === void 0 ? "The subagent types catalog no longer applies." : renderAvailableSubagentTypesSection(inputs.availableSubagentTypesDescription);
    case "dynamic_tool_snapshot":
      return renderDynamicToolSnapshotStatement(inputs.mcpMetaToolOptions) ?? "Dynamic tool namespaces are no longer available in this conversation.";
    default: {
      const _exhaustive = kind;
      return _exhaustive;
    }
  }
}
function renderUserInfoCatalogUpdateReminder(kinds, inputs) {
  const ordered = USER_INFO_CATALOG_KINDS.filter((kind) => kinds.includes(kind));
  const sections = ordered.map((kind) => renderCatalogSection(kind, inputs));
  return [
    "<system_reminder>",
    `<${USER_INFO_CATALOG_UPDATE_TAG} sections="${ordered.join(",")}">`,
    "The catalogs below have changed since the user_info message at the start of this conversation was written. They replace the same-named sections there; a later update of this kind replaces this one.",
    ...sections,
    `</${USER_INFO_CATALOG_UPDATE_TAG}>`,
    "</system_reminder>"
  ].join("\n");
}


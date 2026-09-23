var SAND_MEMORY_SCOPES = ["conversation", "agent", "user"];
function stateWriteOk(detail) {
  return { ok: true, detail };
}
function stateWriteFailed(reason) {
  return { ok: false, reason };
}
var SAND_PROFILE_UPDATE_FIELD_LABELS = {
  name: "name",
  description: "description",
  title: "title",
  avatarShape: "avatar shape",
  avatarColor: "avatar color"
};
function changedSandProfileFields(patch) {
  const fields2 = [];
  for (const field of Object.keys(SAND_PROFILE_UPDATE_FIELD_LABELS)) {
    if (isKeyOf(SAND_PROFILE_UPDATE_FIELD_LABELS, field) && patch[field] !== void 0) {
      fields2.push(field);
    }
  }
  return fields2;
}
function refuseSandProfileUpdate(patch) {
  if (changedSandProfileFields(patch).length === 0) {
    return stateWriteFailed(
      "nothing to change. Pass at least one of name, description, title, avatar_shape, or avatar_color."
    );
  }
  if (patch.name !== void 0 && patch.name.trim().length === 0) {
    return stateWriteFailed("a blank name is not allowed.");
  }
  return null;
}
function describeSandProfileUpdate(patch) {
  const labels = changedSandProfileFields(patch).map(
    (field) => SAND_PROFILE_UPDATE_FIELD_LABELS[field]
  );
  return `Updated your ${labels.join(", ")}.`;
}

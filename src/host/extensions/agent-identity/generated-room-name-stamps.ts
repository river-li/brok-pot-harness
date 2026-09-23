var import_node_fs47 = require("node:fs");
var import_node_path85 = require("node:path");
var GENERATED_ROOM_NAME_STAMP_CLEANUP_SENTINEL_FILENAME = "generated-room-name-stamp-cleanup.json";
var DIR_NAME_SAFE_UUID2 = /^[0-9a-fA-F]{8}(-[0-9a-fA-F]{4}){3}-[0-9a-fA-F]{12}$/;
async function clearGeneratedRoomNameStamps(args) {
  if ((0, import_node_fs47.existsSync)(args.sentinelPath)) return { outcome: "already_done", clearedIds: [] };
  const clearedIds = [];
  for (const room of args.rooms) {
    if (!DIR_NAME_SAFE_UUID2.test(room.id)) continue;
    const agentDir = (0, import_node_path85.join)(args.agentsRootDir, room.id);
    if (readSandGroupConfig(agentDir) === null) continue;
    const profilePath = getSandProfilePath(agentDir);
    const profile = readSandProfileFile(profilePath);
    if (profile === null || profile.namedBy !== "user" || profile.name !== room.generatedName) {
      continue;
    }
    const { namedBy: _stamp, ...unstamped } = profile;
    writeSandProfileFile(profilePath, unstamped);
    clearedIds.push(room.id);
  }
  (0, import_node_fs47.writeFileSync)(
    args.sentinelPath,
    `${JSON.stringify({ clearedAt: (args.now ?? (() => /* @__PURE__ */ new Date()))().toISOString(), clearedIds }, null, 2)}
`
  );
  if (clearedIds.length > 0) await args.publishAgentRoster();
  return { outcome: "cleared", clearedIds };
}

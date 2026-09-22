/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/host/extensions/resume-ownership/box-rooms.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_errors();
async function summarizeBoxRooms(deps) {
  try {
    const rooms = classifyBoxRoomSeats(await deps.listAgents(), deps.isServerBound).map(
      ({ room, membersServerBound }) => ({ roomId: room.id, membersServerBound })
    );
    return { rooms, unavailable: null };
  } catch (error42) {
    return { rooms: [], unavailable: errorLogTag(error42) };
  }
}


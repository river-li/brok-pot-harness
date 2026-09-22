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

init_errors();
async function summarizeBoxRooms(deps) {
  try {
    const rooms = classifyBoxRoomSeats(await deps.listAgents(), deps.isServerBound).map(
      ({ room, membersServerBound }) => ({ roomId: room.id, membersServerBound })
    );
    return { rooms, unavailable: null };
  } catch (error41) {
    return { rooms: [], unavailable: errorLogTag(error41) };
  }
}

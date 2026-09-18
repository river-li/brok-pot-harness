init_scheduling();
var flushBudget = createDeadlinePolicy({
  name: "sand-promotable-rooms-flush",
  timeoutMs: 45e3
});
async function listPromotableRooms(deps) {
  const rooms = [];
  const skipped2 = [];
  const seats = classifyBoxRoomSeats(await deps.listAgents(), deps.isServerBound);
  const quiet = [];
  for (const { room: agent, memberIds, membersServerBound } of seats) {
    if (!membersServerBound) {
      skipped2.push({ roomId: agent.id, reason: "member_unbound" });
    } else if (deps.isTurnInFlight(agent.id)) {
      skipped2.push({ roomId: agent.id, reason: "turn_inflight" });
    } else {
      quiet.push({ agent, memberIds });
    }
  }
  let next = 0;
  try {
    await (deps.flushBudget ?? flushBudget).run(async (expired) => {
      for (const { agent, memberIds } of quiet) {
        const outcome = await deps.flushTranscript(agent.id);
        if (expired.aborted) return;
        if (outcome === "drained") {
          const clientStateSeed = await deps.readClientStateSeed(agent.id);
          if (expired.aborted) return;
          rooms.push({
            roomId: agent.id,
            name: agent.name,
            description: agent.description,
            memberIds,
            ...clientStateSeed === void 0 ? {} : { clientStateSeed }
          });
        } else {
          skipped2.push({
            roomId: agent.id,
            reason: outcome === "disarmed" ? "publish_disarmed" : "transcript_dirty"
          });
        }
        next++;
      }
    });
  } catch (error41) {
    if (!(error41 instanceof DeadlineExceededError)) throw error41;
    for (const { agent } of quiet.slice(next)) {
      skipped2.push({ roomId: agent.id, reason: "flush_timeout" });
    }
  }
  return { rooms, skipped: skipped2 };
}

/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/grok-bot-harness/src/runner/tools/sand-user-computer-tools.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_zod();
function createListMachinesTool(userComputers) {
  return defineCommunicateTool(userComputers, {
    id: "LIST_MACHINES",
    name: SAND_LIST_MACHINES_TOOL_NAME,
    description: `List the user's registered machines with their machineId, label, and current local-exec connection status. Pass a returned machineId to ${SAND_BOX_SHELL_TOOL_NAME}, ${SAND_BOX_READ_TOOL_NAME}, or ${SAND_BOX_AWAIT_SHELL_TOOL_NAME} to use that machine instead of the box, or to ${SAND_COPY_TO_BOX_TOOL_NAME} and ${SAND_COPY_FROM_BOX_TOOL_NAME} for file transfers. Messages the user sends from their desktop app carry a "[Sent from machine <machineId>]" note naming the machine they are on; when they don't say which machine to use, default to the one their latest message was sent from.`,
    parameters: external_exports.object({}),
    execute: async (_ctx, _args, computers) => {
      const machines = await (computers.status?.() ?? computers.list());
      return JSON.stringify(
        {
          machines: machines.map(({ id, label, connected: connected2 }) => ({
            machineId: id,
            label,
            connected: connected2
          }))
        },
        null,
        2
      );
    }
  });
}


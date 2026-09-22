/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/grok-bot-harness/src/ports/user-computer.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var DEFAULT_SAND_COMPUTER_ID = "this-computer";
var SAND_MACHINE_ID_REQUIRED_MESSAGE = `More than one user machine is registered. Call ${SAND_LIST_MACHINES_TOOL_NAME} and retry with machineId so the action is not sent to the wrong machine.`;
var SandUserComputerResolutionError = class extends Error {
};
function resolveSandUserComputer(userComputers, machineId, scope) {
  let resolvedId = machineId;
  if (resolvedId === void 0) {
    const machines = userComputers.list();
    if (machines.length === 0) {
      throw new SandUserComputerResolutionError(
        `No user machines are registered. Call ${SAND_LIST_MACHINES_TOOL_NAME} after connecting a machine.`
      );
    }
    if (machines.length > 1) {
      throw new SandUserComputerResolutionError(SAND_MACHINE_ID_REQUIRED_MESSAGE);
    }
    resolvedId = machines[0].id;
  }
  const machine = userComputers.resolve(resolvedId, scope);
  if (machine === void 0) {
    throw new SandUserComputerResolutionError(
      `Unknown machineId "${resolvedId}". Call ${SAND_LIST_MACHINES_TOOL_NAME} and use a registered id.`
    );
  }
  return machine;
}
function createSingleUserComputer(args) {
  const id = DEFAULT_SAND_COMPUTER_ID;
  const label = args.label ?? "this computer";
  const connected2 = () => args.isConnected?.() ?? true;
  return {
    list: () => [{ id, label, connected: connected2() }],
    resolve: (requestedId) => {
      if (requestedId !== void 0 && requestedId !== id) return void 0;
      if (!connected2()) return void 0;
      return { id, label, box: args.box };
    }
  };
}


import { validateMachineId, validateMachineLabel } from "./machine-labels.js";

/** Names use the same authenticated loopback gateway as the local desktop. */
export function createLocalMachineLabelClient() {
  const call = async (
    method: string,
    machineId: string,
    label?: string,
  ): Promise<string | undefined> => {
    validateMachineId(machineId);
    const base = new URL(
      process.env.SAND_HOST_GATEWAY_URL || "http://127.0.0.1:1540",
    );
    const token = process.env.SAND_HOST_GATEWAY_TOKEN;
    if (
      !token ||
      !["http:", "https:"].includes(base.protocol) ||
      !["127.0.0.1", "localhost", "[::1]"].includes(base.hostname) ||
      base.username ||
      base.password ||
      base.search ||
      base.hash
    )
      throw new Error(
        "Local machine settings require the authenticated local gateway.",
      );
    const response = await fetch(new URL(`/api/${method}`, base), {
      method: "POST",
      redirect: "error",
      signal: AbortSignal.timeout(10000),
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        machineId,
        ...(label === undefined ? {} : { label: validateMachineLabel(label) }),
      }),
    });
    if (!response.ok)
      throw new Error(`Local machine settings failed (${response.status}).`);
    const result = (await response.json()) as {
      machineId?: unknown;
      label?: unknown;
    };
    if (result.machineId !== machineId)
      throw new Error("Local machine settings returned another machine.");
    return result.label === null
      ? undefined
      : validateMachineLabel(result.label);
  };
  return {
    get: (machineId: string) => call("getLocalMachineLabel", machineId),
    set: (machineId: string, label: string) =>
      call("setLocalMachineLabel", machineId, label),
  };
}

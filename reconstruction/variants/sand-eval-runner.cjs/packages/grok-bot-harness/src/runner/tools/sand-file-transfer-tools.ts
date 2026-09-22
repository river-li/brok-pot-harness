/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/grok-bot-harness/src/runner/tools/sand-file-transfer-tools.ts
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var import_node_path63 = require("node:path");
init_zod();
function formatBytes3(bytes) {
  if (bytes < 1024) return `${bytes} bytes`;
  const units = ["KB", "MB", "GB"];
  let value = bytes / 1024;
  let unitIndex = 0;
  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }
  return `${value.toFixed(value >= 10 || Number.isInteger(value) ? 0 : 1)} ${units[unitIndex]}`;
}
function resolveComputerOrThrow(controller, machineId) {
  try {
    return resolveSandUserComputer(controller.userComputers, machineId, {
      agentId: controller.getComputerAgentId()
    });
  } catch (error3) {
    throw new BoxTransferError(error3 instanceof Error ? error3.message : String(error3));
  }
}
function assertBoxReady(controller) {
  if (controller.isBoxPreparing()) {
    throw new BoxTransferError(SAND_BOX_NOT_READY_MESSAGE);
  }
}
async function copyFileToBox(ctx, args, controller) {
  assertBoxReady(controller);
  const computer = resolveComputerOrThrow(controller, args.machineId);
  const boxPath = resolveBoxWorkspacePath(
    args.box_path ?? import_node_path63.posix.join(SAND_BOX_UPLOADS_DIR, import_node_path63.posix.basename(args.computer_path))
  );
  const bytes = await transferFileBetweenBoxes(ctx, {
    source: {
      box: computer.box,
      agentId: controller.getComputerAgentId(),
      path: args.computer_path,
      label: computer.label
    },
    dest: {
      box: controller.agentBox,
      agentId: controller.getBoxId(),
      path: boxPath,
      label: "your box"
    }
  });
  return `Copied ${args.computer_path} from ${computer.label} into your box at ${boxPath} (${formatBytes3(bytes)}). Open it with Shell.`;
}
async function copyFileFromBox(ctx, args, controller) {
  assertBoxReady(controller);
  const computer = resolveComputerOrThrow(controller, args.machineId);
  const boxPath = resolveBoxWorkspacePath(args.box_path);
  const computerPath = args.computer_path ?? import_node_path63.posix.basename(boxPath);
  const bytes = await transferFileBetweenBoxes(ctx, {
    source: {
      box: controller.agentBox,
      agentId: controller.getBoxId(),
      path: boxPath,
      label: "your box"
    },
    dest: {
      box: computer.box,
      agentId: controller.getComputerAgentId(),
      path: computerPath,
      label: computer.label
    }
  });
  return `Copied ${boxPath} from your box to ${computer.label} at ${computerPath} (${formatBytes3(bytes)}). The user can open it there with Shell using that computer's machineId.`;
}
var copyToBoxParameters = external_exports.object({
  computer_path: external_exports.string().trim().min(1).describe(
    "Absolute path of the file to pull, on the selected user's computer. Any file type and any size; copied verbatim, so binaries and large files are safe \u2014 unlike reading then re-writing it as text."
  ),
  box_path: external_exports.string().trim().min(1).optional().describe(
    "Where to put it inside your box. Absolute (e.g. /workspace/data.csv) or relative to /workspace. Omit to land it in /workspace/uploads under its original filename."
  )
});
var copyFromBoxParameters = external_exports.object({
  box_path: external_exports.string().trim().min(1).describe(
    "Path of the file in your box to push out. Absolute (e.g. /workspace/report.pdf) or relative to /workspace. Any file type and any size; copied verbatim. Expand any glob in Shell first and pass a concrete path."
  ),
  computer_path: external_exports.string().trim().min(1).optional().describe(
    "Destination path on the selected user's computer. Absolute, or relative to that computer's working directory. Omit to land it under its original filename in that directory."
  )
});
function createFileTransferTools(controller, machineIds) {
  const copyToBoxToolParameters = extendRequiredMachineIdParameter(
    copyToBoxParameters,
    machineIds,
    "open"
  );
  const copyFromBoxToolParameters = extendRequiredMachineIdParameter(
    copyFromBoxParameters,
    machineIds,
    "open"
  );
  return [
    defineCommunicateTool(controller, {
      id: "COPY_TO_BOX",
      name: SAND_COPY_TO_BOX_TOOL_NAME,
      description: "Copy a file from the user's computer into your box, verbatim. Use this to bring a user's file (any type or size \u2014 a CSV, PDF, archive, image, dataset, binary) onto your box so you can work on it with Shell or Read, or open it in the box browser (parent agents delegate that GUI interaction to computerUse). This is the deliberate way to get a file into the box: the user does not have to drag it into chat first, and unlike reading the file and re-writing it, the bytes are copied exactly (no truncation, binaries are safe). Give the file's absolute path on the selected user's computer and its machineId; it lands in /workspace/uploads by default, or at a box_path you choose. Then open it with Shell at the path reported back.",
      parameters: copyToBoxToolParameters,
      /*
       * Paths from the user's computer can use Windows or POSIX separators.
       * https://nodejs.org/api/path.html#windows-vs-posix
       */
      describeActivity: (args) => ({
        detail: fileBasename(args.computer_path)
      }),
      execute: (ctx, args, deps) => copyFileToBox(
        ctx,
        { ...args, machineId: resolveMachineIdArgument(machineIds, args) },
        deps
      )
    }),
    defineCommunicateTool(controller, {
      id: "COPY_FROM_BOX",
      name: SAND_COPY_FROM_BOX_TOOL_NAME,
      description: "Copy a file from your box out to the user's computer, verbatim. Use this to hand the user a file you generated or downloaded in the box (a spreadsheet, report, log, archive, anything) by placing it on their selected computer where machine-targeted Shell, their editor, and apps can reach it. Any type or size; the bytes are copied exactly (no truncation, binaries are safe). This is for putting a file ON their disk; to instead show a file inline in chat (an image, a video, or a downloadable attachment) use SendToUser with the box path. Give the box_path of the file and its machineId; it lands under its own name in that computer's working directory by default, or at a computer_path you choose.",
      parameters: copyFromBoxToolParameters,
      describeActivity: (args) => ({ detail: fileBasename(args.box_path) }),
      execute: (ctx, args, deps) => copyFileFromBox(
        ctx,
        { ...args, machineId: resolveMachineIdArgument(machineIds, args) },
        deps
      )
    })
  ];
}


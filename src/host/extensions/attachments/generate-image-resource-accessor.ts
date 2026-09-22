var import_node_fs48 = require("node:fs");
var import_node_path90 = require("node:path");
init_read_exec_pb();
init_write_exec_pb();
init_errors();
function createSandGenerateImageResourceAccessor(agentDir) {
  const assetsDir = getAgentAssetsDir(agentDir);
  const registry2 = new RegistryResourceAccessor();
  registry2.register(writeExecutorResource, {
    execute: async (_ctx, args) => {
      const target = await containWithin([assetsDir], args.path);
      if (target == null) {
        return new WriteResult({
          result: {
            case: "error",
            value: new WriteError({
              error: "Refused to write the generated image outside the agent's media store."
            })
          }
        });
      }
      const bytes = Buffer.from(args.fileBytes);
      await import_node_fs48.promises.mkdir((0, import_node_path90.dirname)(target), { recursive: true });
      await import_node_fs48.promises.writeFile(target, bytes);
      return new WriteResult({
        result: {
          case: "success",
          value: new WriteSuccess({ path: target, fileSize: bytes.length })
        }
      });
    }
  });
  registry2.register(readExecutorResource, {
    execute: async (_ctx, args) => {
      const resolved = await containWithin(getAgentMediaStoreRoots(agentDir), args.path);
      if (resolved == null) {
        return new ReadResult({
          result: {
            case: "error",
            value: new ReadError({
              path: args.path,
              error: "Refused to read a reference image outside the agent's sandboxed media store."
            })
          }
        });
      }
      try {
        const data = await import_node_fs48.promises.readFile(resolved);
        return new ReadResult({
          result: {
            case: "success",
            value: new ReadSuccess({
              output: { case: "data", value: new Uint8Array(data) }
            })
          }
        });
      } catch (error42) {
        return new ReadResult({
          result: {
            case: "error",
            value: new ReadError({
              path: args.path,
              error: errorMessage(error42)
            })
          }
        });
      }
    }
  });
  return registry2;
}

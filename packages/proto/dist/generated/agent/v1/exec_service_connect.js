/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/proto/dist/generated/agent/v1/exec_service_connect.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_exec_pb();
init_esm();
var ExecService = {
  typeName: "agent.v1.ExecService",
  methods: {
    /**
     * @generated from rpc agent.v1.ExecService.Exec
     */
    exec: {
      name: "Exec",
      I: ExecServerMessage,
      O: ExecStreamElement,
      kind: MethodKind.ServerStreaming
    },
    /**
     * Trusted daemon filesystem access with no text/image transformations.
     *
     * @generated from rpc agent.v1.ExecService.ReadFile
     */
    readFile: {
      name: "ReadFile",
      I: ReadFileRequest,
      O: ReadFileResponse,
      kind: MethodKind.ServerStreaming
    }
  }
};


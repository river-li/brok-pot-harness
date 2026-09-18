function rpcType() {
  return {};
}
function isStandardSchema(value) {
  const props = value["~standard"];
  return typeof props === "object" && props !== null && props.version === 1 && typeof props.validate === "function";
}
var RpcMethodDeclarationError = class extends Error {
  constructor(field) {
    super(
      `rpcMethod().args: field "${field}" is not an rpc field validator; pass rpc* combinators or one Standard Schema v1 value.`
    );
    this.name = "RpcMethodDeclarationError";
  }
};
function rpcMethod() {
  return {
    noArgs: { schema: null },
    args: (input) => {
      if (isStandardSchema(input)) return { schema: input };
      for (const [field, validator2] of Object.entries(input)) {
        if (typeof validator2?.check !== "function") {
          throw new RpcMethodDeclarationError(field);
        }
      }
      return { schema: rpcObject(input) };
    }
  };
}
function declareRpcEdge(edge, options2) {
  return Object.freeze({
    kind: "rpc-edge",
    edge,
    methods: options2.methods,
    hasEvents: options2.events != null
  });
}

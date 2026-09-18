var sourceMapExtension = defineHostExtension({
  id: "source-map",
  dependencies: [],
  start: () => new SandSourceMap()
});

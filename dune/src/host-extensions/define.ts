function defineHostExtension(options2) {
  const declaration = Object.freeze({
    kind: "host-extension",
    ...options2,
    dependencies: Object.freeze([...options2.dependencies])
  });
  return declaration;
}

function isKeyOf(table, key) {
  return typeof key === "string" && Object.hasOwn(table, key);
}

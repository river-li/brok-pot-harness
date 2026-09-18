function parseGateOverrides(raw) {
  if (raw == null || raw.length === 0) return {};
  const overrides = {};
  for (const pair of raw.split(",")) {
    const [key, value] = pair.split("=", 2).map((part) => part.trim());
    if (key == null || key.length === 0 || Object.hasOwn(overrides, key)) continue;
    overrides[key] = value === "1" || value === "true" || value === "on";
  }
  return overrides;
}

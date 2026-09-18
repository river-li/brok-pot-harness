var SAND_VARIANTS = ["sand", "sand-lab", "sand-dev"];
function sandVariantOf(packaged, labBuild) {
  if (!packaged) return "sand-dev";
  if (labBuild) return "sand-lab";
  return "sand";
}
function getSandVariant() {
  return sandVariantOf(process.env.SAND_PACKAGED === "1", process.env.SAND_LAB === "1");
}

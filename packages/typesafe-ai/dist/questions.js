function noul(instructions, criteria) {
  return criteria === void 0 ? { type: "noul", instructions } : { type: "noul", instructions, criteria };
}
function choice(instructions, criteria) {
  return { type: "choice", instructions, criteria };
}

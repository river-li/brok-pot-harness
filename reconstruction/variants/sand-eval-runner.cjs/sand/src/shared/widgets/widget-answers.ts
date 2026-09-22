/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/shared/widgets/widget-answers.ts
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
function summarizeWidget(widget) {
  const prompt = typeof widget.prompt === "string" ? widget.prompt : "Question";
  const options2 = Array.isArray(widget.options) ? widget.options : [];
  const labels = options2.map((option) => option.label).join(" / ");
  return labels.length > 0 ? `${prompt} \u2014 ${labels}` : prompt;
}


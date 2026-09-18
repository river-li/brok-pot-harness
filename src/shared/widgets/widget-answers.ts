var MULTI_SELECT_ANSWER_SEPARATOR = "\n";
function normalizeMultiSelectAnswerValues(values) {
  return values.map((value) => value.replace(/\s*\n\s*/g, " ").trim()).filter((value) => value.length > 0);
}
function splitMultiSelectAnswer(answer) {
  return normalizeMultiSelectAnswerValues(answer.split(MULTI_SELECT_ANSWER_SEPARATOR));
}
function canonicalMultiSelectValue(value) {
  return normalizeMultiSelectAnswerValues([value])[0] ?? "";
}
function summarizeWidget(widget) {
  const prompt = typeof widget.prompt === "string" ? widget.prompt : "Question";
  const options2 = Array.isArray(widget.options) ? widget.options : [];
  const labels = options2.map((option) => option.label).join(" / ");
  return labels.length > 0 ? `${prompt} \u2014 ${labels}` : prompt;
}
function getWidgetAnswerLabel(widget, answer) {
  const options2 = Array.isArray(widget.options) ? widget.options : [];
  if (widget.multiSelect === true) {
    return splitMultiSelectAnswer(answer).map(
      (value) => options2.find(
        (option) => canonicalMultiSelectValue(option.value ?? option.label) === value
      )?.label ?? value
    ).join(MULTI_SELECT_ANSWER_SEPARATOR);
  }
  return options2.find((option) => (option.value ?? option.label) === answer)?.label ?? answer;
}

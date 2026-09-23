var JevDecider = class {
  client;
  options;
  constructor(client, options2 = {}) {
    this.client = client;
    this.options = options2;
  }
  async decide(state, questions) {
    const result = await this.client.systemOne({
      // The loop's state is plain JSON (strings, numbers, arrays, objects).
      state,
      questions,
      model: this.options.model
    });
    this.options.onAnswered?.(result.model);
    return result.answers;
  }
};
function topChoices(answer, count) {
  return Object.entries(answer.probabilities).sort((a, b2) => b2[1] - a[1]).slice(0, count).map(([key, probability]) => `${key}=${probability.toFixed(2)}`).join(" ");
}

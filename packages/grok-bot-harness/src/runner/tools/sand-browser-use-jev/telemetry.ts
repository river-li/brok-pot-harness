init_dist4();
var moves = createCounter("sand.browser_use_jev.move", {
  description: "One per loop step: the move the classifier picked and the one that ran after confidence and stall demotion",
  labelNames: ["picked", "executed"]
});
var fallbacks = createCounter("sand.browser_use_jev.fallback", {
  description: "Steps handed to the text (llm) or vision (cua) model instead of a classifier move",
  labelNames: ["tier", "reason"]
});
var picks = createCounter("sand.browser_use_jev.pick", {
  description: "Element picks by the classifier and whether one was confident enough to act on",
  labelNames: ["purpose", "outcome"]
});
var groundings = createCounter("sand.browser_use_jev.grounding", {
  description: "Model-written notes and fill values the classifier kept or dropped as unsupported",
  labelNames: ["subject", "outcome"]
});
var guards = createCounter("sand.browser_use_jev.guard", {
  description: "Loop guards that fired: refused guessed URLs, clicks that changed nothing, note failures",
  labelNames: ["guard"]
});
var runDuration = createHistogram("sand.browser_use_jev.run.duration_ms", {
  description: "Wall time of one browser subagent run from loop start to its report",
  labelNames: ["finished"]
});
var runSteps = createHistogram("sand.browser_use_jev.run.steps", {
  description: "Loop steps taken by one browser subagent run",
  labelNames: ["finished"]
});
var runFallbacks = createHistogram("sand.browser_use_jev.run.fallbacks", {
  description: "Model fallbacks taken within one browser subagent run",
  labelNames: ["finished", "tier"]
});
var actionDuration = createHistogram("sand.browser_use_jev.action.duration_ms", {
  description: "One browser action as the loop sees it (a fill is click, inspect and type), including box round trips",
  labelNames: ["action", "outcome"]
});
var decisionDuration = createHistogram("sand.browser_use_jev.decision.duration_ms", {
  description: "One classifier call",
  labelNames: ["outcome"]
});
var modelDuration = createHistogram("sand.browser_use_jev.model.duration_ms", {
  description: "One text model call, with or without a screenshot attached",
  labelNames: ["call", "outcome", "model"]
});
var logger102 = createLogger("sand:browser-use-jev");
async function timed(run, record2) {
  const startedAt = performance.now();
  try {
    const result = await run();
    record2(performance.now() - startedAt, "ok");
    return result;
  } catch (error42) {
    record2(performance.now() - startedAt, "error");
    throw error42;
  }
}
var TimedBrowser = class {
  constructor(inner, time4) {
    this.inner = inner;
    this.time = time4;
  }
  inner;
  time;
  navigate(url2) {
    return this.time("navigate", () => this.inner.navigate(url2));
  }
  snapshot(source) {
    return this.time(
      source === "deep-a11y" ? "snapshot_deep" : "snapshot",
      () => this.inner.snapshot(source)
    );
  }
  click(element) {
    return this.time("click", () => this.inner.click(element));
  }
  fill(element, value, submit) {
    return this.time("fill", () => this.inner.fill(element, value, submit));
  }
  hover(element) {
    return this.time("hover", () => this.inner.hover(element));
  }
  drag(from2, to3) {
    return this.time("drag", () => this.inner.drag(from2, to3));
  }
  scroll(direction) {
    return this.time("scroll", () => this.inner.scroll(direction));
  }
  back() {
    return this.time("back", () => this.inner.back());
  }
  pressKey(key) {
    return this.time("press_key", () => this.inner.pressKey(key));
  }
  screenshotPng() {
    return this.time("screenshot", () => this.inner.screenshotPng());
  }
  act(action) {
    return this.time(`cua_${action.action}`, () => this.inner.act(action));
  }
  selectOptions(element) {
    return this.time("select_options", () => this.inner.selectOptions(element));
  }
  readValue(element) {
    return this.time("read_value", () => this.inner.readValue(element));
  }
};
function createJevTelemetry(ctx, options2) {
  const startedAt = performance.now();
  const fallbackCounts = { llm: 0, cua: 0 };
  let step = 0;
  let ended = false;
  const recordContentFreePathEvent = (fields2) => {
    logger102.info(ctx, "sand.browser_use_jev", { subagent_id: options2.subagentId, step, ...fields2 });
  };
  const end = (finished, steps) => {
    if (ended) return;
    ended = true;
    const durationMs = performance.now() - startedAt;
    runDuration.histogram(ctx, durationMs, { finished });
    if (steps !== void 0) runSteps.histogram(ctx, steps, { finished });
    runFallbacks.histogram(ctx, fallbackCounts.llm, { finished, tier: "llm" });
    runFallbacks.histogram(ctx, fallbackCounts.cua, { finished, tier: "cua" });
    recordContentFreePathEvent({
      event: "finish",
      finished,
      duration_ms: Math.round(durationMs),
      fallbacks_llm: fallbackCounts.llm,
      fallbacks_cua: fallbackCounts.cua
    });
  };
  const observer = {
    observe(event) {
      if (event.kind !== "finish") {
        if (event.kind === "step") step = event.step;
        const { kind, ...fields2 } = event;
        recordContentFreePathEvent({ event: kind, ...fields2 });
      }
      switch (event.kind) {
        case "step":
          return;
        case "move":
          moves.increment(ctx, 1, { picked: event.picked, executed: event.executed });
          return;
        case "fallback":
          fallbackCounts[event.tier] += 1;
          fallbacks.increment(ctx, 1, { tier: event.tier, reason: event.reason });
          return;
        case "pick":
          picks.increment(ctx, 1, { purpose: event.purpose, outcome: event.outcome });
          return;
        case "grounding":
          groundings.increment(ctx, 1, { subject: event.subject, outcome: event.outcome });
          return;
        case "guard":
          guards.increment(ctx, 1, { guard: event.guard });
          return;
        case "finish":
          end(event.finished, event.steps);
          return;
      }
    }
  };
  return {
    observer,
    browser: (inner) => new TimedBrowser(
      inner,
      (action, run) => timed(
        run,
        (durationMs, outcome) => actionDuration.histogram(ctx, durationMs, { action, outcome })
      )
    ),
    decider: (inner) => ({
      decide(state, questions) {
        return timed(
          () => inner.decide(state, questions),
          (durationMs, outcome) => decisionDuration.histogram(ctx, durationMs, { outcome })
        );
      }
    }),
    model: (inner) => ({
      label: inner.label,
      complete: (args) => timed(
        () => inner.complete(args),
        (durationMs, outcome) => modelDuration.histogram(ctx, durationMs, {
          call: "text",
          outcome,
          model: options2.model
        })
      ),
      completeWithImage: (args) => timed(
        () => inner.completeWithImage(args),
        (durationMs, outcome) => modelDuration.histogram(ctx, durationMs, {
          call: "image",
          outcome,
          model: options2.model
        })
      )
    }),
    endWithoutFinish: end
  };
}

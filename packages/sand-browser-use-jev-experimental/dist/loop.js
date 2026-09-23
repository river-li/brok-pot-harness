var DEFAULT_THRESHOLDS = {
  enough: 0.8,
  act: 0.5,
  move: 0.35,
  pick: 0.5
};
var STALL_LIMIT = 4;
var MAX_NOTES = 40;
var RECENT_ACTIONS = 8;
var RECENT_ACTION_CHARS = 40;
function isRecord3(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
function str3(reply2, key) {
  const value = reply2[key];
  return typeof value === "string" ? value : void 0;
}
function num(reply2, key) {
  const value = reply2[key];
  return typeof value === "number" ? value : void 0;
}
function flag(reply2, key) {
  return reply2[key] === true;
}
function point(reply2, key) {
  const value = reply2[key];
  if (!isRecord3(value))
    return void 0;
  const x = num(value, "x");
  const y = num(value, "y");
  return x === void 0 || y === void 0 ? void 0 : { x, y };
}
function parseFallbackMove(reply2) {
  const action = str3(reply2, "action");
  const ref = str3(reply2, "ref");
  switch (action) {
    case "navigate": {
      const url2 = str3(reply2, "url");
      return url2 === void 0 ? void 0 : { action, url: url2 };
    }
    case "click":
    case "hover":
      return ref === void 0 ? void 0 : { action, ref };
    case "fill": {
      const value = str3(reply2, "value");
      if (ref === void 0 || value === void 0)
        return void 0;
      return { action, ref, value, submit: flag(reply2, "submit") };
    }
    case "drag": {
      const from2 = str3(reply2, "from");
      const to3 = str3(reply2, "to");
      return from2 === void 0 || to3 === void 0 ? void 0 : { action, from: from2, to: to3 };
    }
    case "scroll": {
      const direction = reply2.direction;
      if (direction === void 0)
        return { action };
      return direction === "up" || direction === "down" ? { action, direction } : void 0;
    }
    case "press": {
      const key = str3(reply2, "key");
      return key === void 0 ? void 0 : { action, key };
    }
    case "back":
    case "deeper_a11y":
    case "cua":
    case "done":
    case "wait":
      return { action };
    default:
      return void 0;
  }
}
function parseCuaMove(reply2) {
  const action = str3(reply2, "action");
  const x = num(reply2, "x");
  const y = num(reply2, "y");
  const description9 = str3(reply2, "description");
  switch (action) {
    case "click":
      if (x === void 0 || y === void 0)
        return void 0;
      return {
        action,
        x,
        y,
        double: flag(reply2, "double"),
        ...description9 === void 0 ? {} : { description: description9 }
      };
    case "type": {
      const text2 = str3(reply2, "text");
      if (text2 === void 0)
        return void 0;
      const hasTarget = reply2.x !== void 0 || reply2.y !== void 0;
      if (hasTarget && (x === void 0 || y === void 0))
        return void 0;
      return {
        action,
        text: text2,
        submit: flag(reply2, "submit"),
        ...x === void 0 ? {} : { x },
        ...y === void 0 ? {} : { y },
        ...description9 === void 0 ? {} : { description: description9 }
      };
    }
    case "scroll": {
      const deltaY = num(reply2, "deltaY");
      if (x === void 0 || y === void 0 || deltaY === void 0)
        return void 0;
      return { action, x, y, deltaY };
    }
    case "drag": {
      const from2 = point(reply2, "from");
      const to3 = point(reply2, "to");
      if (from2 === void 0 || to3 === void 0)
        return void 0;
      return { action, from: from2, to: to3, ...description9 === void 0 ? {} : { description: description9 } };
    }
    case "key": {
      const key = str3(reply2, "key");
      return key === void 0 ? void 0 : { action, key };
    }
    case "done":
      return { action };
    default:
      return void 0;
  }
}
var FALLBACK_SYSTEM = `You are the tier-2 planner for a browser agent. The fast classifier could not choose a confident move, so you choose one concrete next move from the page snapshot.
Elements are marked [ref=...]; refer to them by that ref. Return JSON, one of:
{"action":"navigate","url":"https://..."}
{"action":"click","ref":"e12"}
{"action":"fill","ref":"e5","value":"text to type","submit":true}
{"action":"hover","ref":"e9"}
{"action":"drag","from":"e3","to":"e8"}
{"action":"scroll","direction":"down"|"up"}
{"action":"back"}
{"action":"press","key":"Escape"|"Enter"|"Tab"|"PageDown"|...}
{"action":"deeper_a11y"}  (the control the task needs should be on this page but is missing from the snapshot; re-read the page from the full accessibility tree, which includes closed shadow roots and frames)
{"action":"cua"}  (the step depends on visual layout or unnamed imagery; hand it to the vision model)
{"action":"done"}  (the task's action has visibly taken effect, or every required fact is already in the notes/snapshot)
{"action":"wait"}  (only while the page is visibly still loading)
Compare the notes with the desired outcome to see what is still missing, then pick the simplest move that would put it on screen. Never repeat a move that the history shows had no effect.`;
var CUA_SYSTEM = `You are the visual tier of a browser agent. You see a screenshot of the viewport (${String(1280)}x${String(900)} CSS pixels, origin top-left) plus the accessibility text the agent already has. Choose ONE precise coordinate action that makes progress on the task. Return JSON, one of:
{"action":"click","x":123,"y":456,"double":false,"description":"<the control you are clicking and why>"}
{"action":"type","x":123,"y":456,"text":"...","submit":false,"description":"<the field you are typing into>"}   (click the field first, then type)
{"action":"scroll","x":640,"y":450,"deltaY":600}                 (positive scrolls down)
{"action":"drag","from":{"x":1,"y":2},"to":{"x":3,"y":4},"description":"<what is dragged where and why>"}
{"action":"key","key":"Escape"}
{"action":"done"}   (the action has visibly taken effect)
Coordinates must point at the centre of the intended control as seen in the screenshot. Never type a password, one-time code, card number or security code; the user enters those themselves, so return {"action":"done"} at such a field.`;
var FILL_SYSTEM = `You write the text a browser agent should type into one form field. Reply with JSON {"value":"..."} containing only the text to type, nothing else. When the user request supplies the text for this field (a name, a search term, a promo code, or something to post or send), copy it completely and exactly; when the request only describes it approximately, write a short value that fits. Never write a password, passcode, one-time or verification code, card number, security code or expiry, even when the request contains one: the user enters those themselves. For such a field reply {"value":null}. Do not include quotes or explanations inside the value.`;
var NOTES_SYSTEM = `You keep the notebook for a browser agent. From the page snapshot, extract only facts that are needed for the requested outcome and are not already in the notes. Reply with JSON {"notes":["..."]}: each note is one short, self-contained fact that names its source page (e.g. "kakao/actionbase repo page: 227 stars"). Copy numbers and names exactly as shown. Return {"notes":[]} when the page adds nothing new.`;
var ANSWER_SYSTEM = `You are a browser agent reporting back to the user. The browsing is over; write the final report only. Answer the user's request using only what the browser observed: the notes it collected, the current page snapshot, and the action history below. Match the requested outcome format exactly. If something requested was never observed or could not be done, say so plainly instead of inventing it. Never simulate further actions, tool calls or page loads. Do not mention refs, snapshots, or the agent's internal steps. Decide before you write: the report is the finished answer, never a draft, so no thinking aloud, no "wait", and no correcting an earlier line; when two observations disagree, report the one the current page shows and note the discrepancy in one clause.`;
function typedChars(value) {
  return `${String(value.length)} chars`;
}
function loggableMove(move2) {
  const shown = { ...move2 };
  if (typeof shown.value === "string")
    shown.value = typedChars(shown.value);
  if (typeof shown.text === "string")
    shown.text = typedChars(shown.text);
  return JSON.stringify(shown).slice(0, 200);
}
function shortAction(entry) {
  const compact2 = entry.replace(/\[(?:f\d+)?e\d+\]\s*|\[ax\d+\]\s*/gu, "").replace(/\s+/gu, " ").trim();
  return compact2.length <= RECENT_ACTION_CHARS ? compact2 : `${compact2.slice(0, RECENT_ACTION_CHARS - 1)}\u2026`;
}
function pageState(deps, step, snapshot, memory) {
  return {
    request: deps.prompt,
    task: deps.plan.task,
    outcome: deps.plan.outcome,
    step,
    page: {
      url: snapshot.url,
      title: snapshot.title,
      perception: snapshot.source
    },
    notes: memory.notes,
    recentActions: memory.history.slice(-RECENT_ACTIONS).map(shortAction),
    snapshot: snapshot.text
  };
}
function notesBlock(memory) {
  return memory.notes.length === 0 ? "Notes so far: (none)" : `Notes so far:
${memory.notes.map((note) => `- ${note}`).join("\n")}`;
}
function elementLabel(element) {
  if (element.name === "" && element.url !== void 0) {
    return `${element.role} \u2192 ${element.url}`;
  }
  return `${element.role} "${element.name}"`;
}
function resolveHref(href, base) {
  if (href === void 0 || /^(#|javascript:|mailto:|tel:)/i.test(href.trim())) {
    return void 0;
  }
  try {
    const resolved = new URL(href, base);
    if (resolved.protocol !== "http:" && resolved.protocol !== "https:")
      return void 0;
    return resolved.href === base ? void 0 : resolved.href;
  } catch {
    return void 0;
  }
}
var GUESSED_URL_REFUSAL = "refused to navigate to";
function looksLikeGuessedUrl(url2, snapshot, history) {
  let parsed2;
  try {
    parsed2 = new URL(url2);
  } catch {
    return false;
  }
  if (!/\d{3,}/.test(parsed2.pathname))
    return false;
  const recent = history.slice(-6).filter((line) => !line.startsWith(GUESSED_URL_REFUSAL)).join("\n");
  const shown = `${snapshot.text}
${snapshot.elements.map((element) => element.url ?? "").join("\n")}
${recent}`;
  return !shown.includes(parsed2.pathname) && !shown.includes(url2);
}
function clickKey(snapshot, element) {
  const twins = snapshot.elements.filter((candidate) => candidate.role === element.role && candidate.name === element.name);
  const ordinal = Math.max(0, twins.findIndex((candidate) => candidate.ref === element.ref));
  return `${snapshot.url}|${element.role}|${element.name}|${ordinal}`;
}
function observe(options2, event) {
  options2.observer?.observe(event);
}
function findElement(snapshot, ref) {
  return snapshot.elements.find((element) => element.ref === ref);
}
function fingerprint(snapshot) {
  return `${snapshot.url}
${snapshot.source}
${snapshot.text}`;
}
function firstLine(error42) {
  return (error42 instanceof Error ? error42.message : String(error42)).split("\n")[0] ?? "";
}
async function runAgentLoop(deps, options2) {
  const { browser, jev, plan } = deps;
  const { log: log5, thresholds } = options2;
  const memory = {
    history: [],
    notes: [],
    takenClicks: /* @__PURE__ */ new Set(),
    ineffectiveClicks: /* @__PURE__ */ new Set(),
    lastClickKey: void 0,
    lastClickUrl: void 0,
    source: "aria",
    sourceUrl: "",
    drafts: /* @__PURE__ */ new Map()
  };
  const { history } = memory;
  const recentFingerprints = [];
  let stalledSteps = 0;
  let stepsSinceNote = 0;
  log5.info(`navigate ${plan.startingUrl}`);
  await browser.navigate(plan.startingUrl);
  history.push(`navigated to ${plan.startingUrl}`);
  if (plan.viaSearch) {
    const resolved = await resolveStartingUrl(plan, browser, jev, (message) => log5.info(message));
    if (resolved !== plan.startingUrl) {
      history.push(`opened search result ${resolved}`);
    }
  }
  const finish = async (step, snapshot2, finished) => {
    const answer = await composeAnswer(deps, snapshot2, memory, finished);
    await options2.onStep?.({ step, snapshot: snapshot2, action: "answer" });
    observe(options2, { kind: "finish", finished, steps: step });
    return { answer, steps: step, finished, history };
  };
  const handoff = async (step, snapshot2, stop) => {
    log5.info(`  stop ${stop.message}`);
    history.push(stop.message);
    await options2.onStep?.({ step, snapshot: snapshot2, action: "handoff" });
    observe(options2, { kind: "finish", finished: "handoff", steps: step });
    return {
      answer: handoffReport(snapshot2, memory, stop),
      steps: step,
      finished: "handoff",
      history
    };
  };
  let snapshot = await takeSnapshot(browser, memory);
  for (let step = 1; step <= options2.maxSteps; step += 1) {
    log5.info(`step ${step}  ${snapshot.url}  "${snapshot.title}"  (${snapshot.source}, ${snapshot.elements.length} actionable, ${snapshot.text.length} chars${snapshot.offscreenAbove > 0 ? `, ${snapshot.offscreenAbove} above` : ""}${snapshot.offscreenBelow > 0 ? `, ${snapshot.offscreenBelow} below` : ""}${snapshot.truncated ? ", cut" : ""})`);
    log5.debug(snapshot.text);
    const current = fingerprint(snapshot);
    if (memory.lastClickKey !== void 0 && recentFingerprints[recentFingerprints.length - 1] === current) {
      memory.ineffectiveClicks.add(memory.lastClickKey);
      observe(options2, { kind: "guard", guard: "ineffective_click" });
      const href = resolveHref(memory.lastClickUrl, snapshot.url);
      memory.lastClickKey = void 0;
      memory.lastClickUrl = void 0;
      if (href !== void 0) {
        log5.info(`  note click had no effect; following the link's href ${href}`);
        try {
          await browser.navigate(href);
          history.push(`followed link href ${href}`);
          snapshot = await takeSnapshot(browser, memory);
          continue;
        } catch (error42) {
          recordFailure(options2, memory, `navigate ${href}`, error42);
        }
      } else {
        log5.info(`  note click had no effect; excluding it from the next pick`);
      }
    }
    memory.lastClickKey = void 0;
    memory.lastClickUrl = void 0;
    stalledSteps = recentFingerprints.includes(current) ? stalledSteps + 1 : 0;
    recentFingerprints.push(current);
    if (recentFingerprints.length > STALL_LIMIT) {
      recentFingerprints.shift();
    }
    const state = {
      ...pageState(deps, step, snapshot, memory),
      revisitingSeenPage: stalledSteps > 0
    };
    const gates = await jev.decide(state, {
      enough: noul("Do the notes collected so far plus the current snapshot together contain ALL the information needed to write the requested outcome for the task? Answer yes only if every required fact is present in the notes or visible in the snapshot text itself."),
      done: noul("For a task that performs an action (create, delete, post, submit, sign in, follow, ...): does the current page show that the action has already taken effect, so nothing is left to do but report back?"),
      remember: noul("Does the current snapshot show specific facts (names, numbers, dates, labels) that belong in the requested outcome and are not yet in the notes?"),
      move: choice("What should the agent do next to make progress on the task?", {
        click: "press one of the [ref] links, buttons, tabs or options shown in the snapshot",
        fill: "type into one of the [ref] text fields (textbox, searchbox) or choose an option in one of the [ref] dropdowns (combobox) shown in the snapshot",
        hover: "reveal a menu or tooltip by hovering one of the [ref] elements shown",
        drag: "drag one [ref] element onto another (reorder, move between columns)",
        scroll_down: "the content needed for the task is further down this same page",
        scroll_up: "the content needed for the task is above the current viewport",
        deeper_a11y: "a control or widget the task needs should be on this page but is missing from the snapshot; re-read the page from the full accessibility tree (closed shadow roots, frames)",
        defer_llm: "none of the above fits; let the text model choose a move (navigate elsewhere, press a key, raw browser command)",
        defer_cua: "the step depends on visual layout or unnamed imagery that the text cannot express; a vision model must look at the screenshot"
      })
    });
    log5.info(`  jev  enough=${gates.enough.noul.toFixed(2)} done=${gates.done.noul.toFixed(2)} remember=${gates.remember.noul.toFixed(2)}  move \u2192 ${gates.move.choice} (${gates.move.confidence.toFixed(2)})  ${topChoices(gates.move, 3)}`);
    observe(options2, {
      kind: "step",
      step,
      source: snapshot.source,
      elements: snapshot.elements.length,
      enough: gates.enough.noul,
      done: gates.done.noul,
      remember: gates.remember.noul
    });
    const actionPending = (gates.move.choice === "click" || gates.move.choice === "fill") && gates.move.confidence >= 0.85 && gates.done.noul < 0.5;
    if (gates.done.noul >= thresholds.enough || gates.enough.noul >= thresholds.enough && !actionPending) {
      return finish(step, snapshot, "answered");
    }
    if (gates.enough.noul >= thresholds.enough) {
      log5.info("  facts are visible but a confident click/fill is still pending; acting first");
    }
    stepsSinceNote += 1;
    if (gates.remember.noul >= thresholds.act) {
      const added = await takeNotes(deps, options2, snapshot, memory).catch((error42) => {
        log5.info(`  llm  notes failed: ${firstLine(error42)}`);
        observe(options2, { kind: "guard", guard: "notes_failed" });
        return 0;
      });
      if (added > 0) {
        stepsSinceNote = 0;
        if (!actionPending && await notesComplete(deps, options2, memory)) {
          return finish(step, snapshot, "answered");
        }
      }
    }
    if (stalledSteps >= STALL_LIMIT && stepsSinceNote >= STALL_LIMIT) {
      log5.info(`  stop: page unchanged and nothing learned for ${String(STALL_LIMIT)} steps`);
      return finish(step, snapshot, "stalled");
    }
    let move2 = gates.move.choice;
    let fallbackReason = "chosen";
    if (gates.move.confidence < thresholds.move && move2 !== "defer_llm" && move2 !== "defer_cua") {
      log5.info(`  move confidence below ${thresholds.move.toFixed(2)}; deferring to the LLM`);
      move2 = "defer_llm";
      fallbackReason = "low_confidence";
    }
    if (stalledSteps >= 2 && (move2 === "scroll_down" || move2 === "scroll_up")) {
      log5.info("  scrolling has been revisiting the same viewports; deferring to the LLM");
      move2 = "defer_llm";
      fallbackReason = "revisiting_scroll";
    }
    observe(options2, {
      kind: "move",
      picked: gates.move.choice,
      executed: move2,
      confidence: gates.move.confidence
    });
    let action;
    try {
      switch (move2) {
        case "click":
        case "hover":
        case "drag":
          action = await tryPointer(deps, options2, state, snapshot, memory, move2);
          break;
        case "fill":
          action = await tryFill(deps, options2, state, snapshot, memory);
          break;
        case "scroll_down":
        case "scroll_up":
          action = await doScroll(deps, options2, move2 === "scroll_down" ? "down" : "up");
          break;
        case "deeper_a11y":
          action = deeper(memory, snapshot, log5);
          break;
        case "defer_cua":
          observe(options2, { kind: "fallback", tier: "cua", reason: "chosen" });
          action = await visualMove(deps, options2, snapshot, memory);
          break;
        case "defer_llm":
          break;
      }
      if (action === void 0) {
        observe(options2, {
          kind: "fallback",
          tier: "llm",
          reason: move2 === "defer_llm" ? fallbackReason : "move_unresolved"
        });
        action = await fallbackMove(deps, options2, snapshot, memory);
      }
    } catch (error42) {
      if (error42 instanceof CredentialFieldStop)
        return handoff(step, snapshot, error42);
      throw error42;
    }
    if (action === "done") {
      const agreement = Math.max(gates.enough.noul, gates.done.noul);
      if (agreement >= 0.5) {
        return finish(step, snapshot, "answered");
      }
      action = `llm believed the task was complete but the classifier disagreed (enough=${gates.enough.noul.toFixed(2)}, done=${gates.done.noul.toFixed(2)}); keep working`;
      log5.info(`  ${action}`);
    }
    history.push(action);
    await options2.onStep?.({ step, snapshot, action });
    snapshot = await takeSnapshot(browser, memory);
  }
  return finish(options2.maxSteps, snapshot, "max-steps");
}
async function takeSnapshot(browser, memory) {
  const aria = await browser.snapshot("aria");
  if (memory.source === "deep-a11y" && memory.sourceUrl === aria.url) {
    return browser.snapshot("deep-a11y");
  }
  memory.source = "aria";
  return aria;
}
function deeper(memory, snapshot, log5) {
  if (memory.source === "deep-a11y" && memory.sourceUrl === snapshot.url) {
    log5.info("  deeper accessibility tree already in use on this page; deferring to the LLM");
    return void 0;
  }
  memory.source = "deep-a11y";
  memory.sourceUrl = snapshot.url;
  log5.info("  act  re-read the page from the full CDP accessibility tree");
  return "re-read the page from the full accessibility tree (closed shadow roots, frames)";
}
async function notesComplete(deps, options2, memory) {
  const { complete, missing, actionLeft } = await deps.jev.decide({
    request: deps.prompt,
    task: deps.plan.task,
    outcome: deps.plan.outcome,
    notes: memory.notes,
    actionsTaken: memory.history.map(shortAction)
  }, {
    complete: noul("Do the notes contain every fact the desired outcome requires? Answer yes only if nothing required is missing."),
    missing: noul("Is there any fact required by the desired outcome that is still missing from the notes?"),
    actionLeft: noul("Does the task still require an action (enter, submit, post, redeem, follow, delete, ...) that the actions taken so far do not show as performed? Knowing a fact is not the same as having used it.")
  });
  options2.log.info(`  jev  notes complete=${complete.noul.toFixed(2)} missing=${missing.noul.toFixed(2)} actionLeft=${actionLeft.noul.toFixed(2)}`);
  return complete.noul >= options2.thresholds.enough && missing.noul < 0.5 && actionLeft.noul < 0.5;
}
async function groundedNotes(deps, options2, snapshot, candidates) {
  const questions = {};
  candidates.forEach((note, index) => {
    questions[`n${String(index)}`] = noul(`Is this statement directly supported by the snapshot text, with every number, name, version and label in it actually appearing there? Statement: ${JSON.stringify(note)}`);
  });
  const answers = await deps.jev.decide({
    page: { url: snapshot.url, title: snapshot.title },
    snapshot: snapshot.text
  }, questions);
  const kept = [];
  const dropped = [];
  candidates.forEach((note, index) => {
    const probability = answers[`n${String(index)}`]?.noul ?? 0;
    const grounded = probability >= 0.5;
    observe(options2, {
      kind: "grounding",
      subject: "note",
      outcome: grounded ? "kept" : "dropped"
    });
    if (grounded) {
      kept.push(note);
    } else {
      dropped.push(note);
      options2.log.info(`  jev  dropped ungrounded note (${probability.toFixed(2)}): "${note.slice(0, 120)}"`);
    }
  });
  return { kept, dropped };
}
async function extractNotes(deps, snapshot, memory) {
  const reply2 = extractJsonObject(await deps.model.complete({
    system: NOTES_SYSTEM,
    user: [
      `User request: ${deps.prompt}`,
      `Task: ${deps.plan.task}`,
      `Desired outcome: ${deps.plan.outcome}`,
      notesBlock(memory),
      `Page: ${snapshot.title} (${snapshot.url})`,
      `Snapshot:
${snapshot.text}`
    ].filter((part) => part !== "").join("\n\n"),
    json: true,
    maxTokens: 600
  }));
  return Array.isArray(reply2.notes) ? reply2.notes.filter((note) => typeof note === "string" && note.trim() !== "") : [];
}
async function takeNotes(deps, options2, snapshot, memory) {
  const fresh = await extractNotes(deps, snapshot, memory);
  const candidates = fresh.filter((note) => !memory.notes.includes(note)).slice(0, 12);
  const added = candidates.length === 0 ? [] : [...(await groundedNotes(deps, options2, snapshot, candidates)).kept];
  memory.notes.push(...added);
  if (memory.notes.length > MAX_NOTES) {
    memory.notes.splice(0, memory.notes.length - MAX_NOTES);
  }
  options2.log.info(added.length === 0 ? "  llm  notes: nothing new" : `  llm  notes: ${added.map((note) => `"${note}"`).join("; ")}`);
  return added.length;
}
async function pickElement(deps, options2, state, candidates, kind, ask) {
  const { question, label } = ask;
  if (candidates.length === 0) {
    options2.log.info(`  no ${kind === "fill" ? "fillable" : kind === "click" ? "clickable" : "addressable"} elements in the snapshot`);
    return void 0;
  }
  const { which } = await deps.jev.decide(state, {
    which: choice(question, elementCriteria(candidates, kind, options2.maxCandidates))
  });
  options2.log.info(`  jev  ${label} \u2192 ${which.choice} (${which.confidence.toFixed(2)})  ${topChoices(which, 3)}`);
  const element = candidates.find((candidate) => candidate.ref === which.choice);
  const deferred = which.choice === "none" || element === void 0 || which.confidence < options2.thresholds.pick;
  observe(options2, {
    kind: "pick",
    purpose: ask.purpose,
    outcome: deferred ? "deferred" : "picked"
  });
  return deferred ? void 0 : element;
}
async function tryPointer(deps, options2, state, snapshot, memory, move2) {
  const candidates = move2 === "click" ? snapshot.elements.filter((element2) => {
    if (!element2.kinds.includes("click"))
      return false;
    const key2 = clickKey(snapshot, element2);
    return !memory.takenClicks.has(key2) && !memory.ineffectiveClicks.has(key2);
  }) : snapshot.elements;
  const question = move2 === "click" ? "Which element should be clicked next to make progress on the task? Pick `none` if no listed element is the right one." : move2 === "hover" ? "Which element should be hovered to reveal what the task needs? Pick `none` if no listed element is the right one." : "Which element should be dragged (the source)? Pick `none` if no listed element is the right one.";
  const element = await pickElement(deps, options2, state, candidates, move2 === "click" ? "click" : "any", { question, label: move2, purpose: move2 === "drag" ? "drag" : "click" });
  if (element === void 0) {
    return void 0;
  }
  if (move2 === "drag") {
    const target = await pickElement(deps, options2, { ...state, dragSource: element.line }, snapshot.elements.filter((candidate) => candidate.ref !== element.ref), "any", {
      question: "Where should the dragged element be dropped (the target)? Pick `none` if no listed element is the right one.",
      label: "drop target",
      purpose: "drop_target"
    });
    if (target === void 0) {
      return void 0;
    }
    const label2 = `drag [${element.ref}] ${elementLabel(element)} onto [${target.ref}] ${elementLabel(target)}`;
    options2.log.info(`  act  ${label2}`);
    try {
      await deps.browser.drag(element, target);
      return label2;
    } catch (error42) {
      return recordFailure(options2, memory, label2, error42);
    }
  }
  const label = `${move2} [${element.ref}] ${elementLabel(element)}`;
  const key = clickKey(snapshot, element);
  if (move2 === "click" && memory.takenClicks.has(key)) {
    options2.log.info(`  skip ${label}: already taken from this page; deferring to the LLM`);
    return void 0;
  }
  options2.log.info(`  act  ${label}`);
  try {
    if (move2 === "hover") {
      await deps.browser.hover(element);
    } else {
      await deps.browser.click(element);
      memory.takenClicks.add(key);
      memory.lastClickKey = key;
      memory.lastClickUrl = element.url;
    }
    return label;
  } catch (error42) {
    return recordFailure(options2, memory, label, error42);
  }
}
function rethrowIfFatal(options2, error42) {
  if (error42 instanceof CredentialFieldStop || options2.isFatalError?.(error42) === true) {
    throw error42;
  }
}
function recordFailure(options2, memory, label, error42) {
  rethrowIfFatal(options2, error42);
  const failure2 = `${label} failed: ${firstLine(error42)}`;
  options2.log.info(`  act  ${failure2}`);
  memory.history.push(failure2);
  return void 0;
}
async function tryFill(deps, options2, state, snapshot, memory) {
  const fillable = snapshot.elements.filter((element2) => element2.kinds.includes("fill"));
  const element = await pickElement(deps, options2, state, fillable, "fill", {
    question: "Which text field should be typed into, or which dropdown should have an option chosen, next to make progress on the task? Pick `none` if no listed field is the right one.",
    label: "fill",
    purpose: "fill"
  });
  if (element === void 0) {
    return void 0;
  }
  const credential = credentialFieldKind(element);
  if (credential !== void 0)
    throw new CredentialFieldStop(credential);
  const options_ = await deps.browser.selectOptions(element).catch(() => []);
  if (options_.length > 1) {
    const criteria = {};
    for (const option2 of options_.slice(0, options2.maxCandidates)) {
      criteria[option2] = option2;
    }
    criteria.none = "none of these options is right";
    const { option } = await deps.jev.decide({ ...state, field: element.line }, {
      option: choice("Which option should be selected in this dropdown to make progress on the task?", criteria)
    });
    options2.log.info(`  jev  option \u2192 ${option.choice} (${option.confidence.toFixed(2)})  ${topChoices(option, 3)}`);
    if (option.choice !== "none" && option.confidence >= options2.thresholds.pick) {
      const label2 = `select [${element.ref}] ${elementLabel(element)} = "${option.choice}"`;
      options2.log.info(`  act  ${label2}`);
      try {
        await deps.browser.fill(element, option.choice, false);
        return label2;
      } catch (error42) {
        return recordFailure(options2, memory, label2, error42);
      }
    }
  }
  const { kind } = await deps.jev.decide({ ...state, field: element.line }, {
    kind: choice("What kind of value does this field need for the task?", {
      derived: "a short value determined by the request or notes (a name, search term, quantity, promo code, or text the user provided or approximately described)",
      composed: "open-ended prose the user did not supply and expects the agent to write (a message, review, application, description)"
    })
  });
  options2.log.info(`  jev  fill kind \u2192 ${kind.choice} (${kind.confidence.toFixed(2)})  ${topChoices(kind, 2)}`);
  let value;
  let source = "llm";
  if (kind.choice === "composed" && kind.confidence >= 0.5) {
    value = await composeText(deps, options2, snapshot, memory, element);
    source = "composed";
  }
  if (value === void 0) {
    value = await proposeFillValue(deps, options2, state, snapshot, memory, element);
    source = "llm";
  }
  if (value === void 0) {
    return void 0;
  }
  const { submit } = await deps.jev.decide({ ...state, field: element.line, valueToType: value }, {
    submit: noul("After typing the value into this field, should Enter be pressed to submit it (as for a search box), rather than leaving the field for a later click?")
  });
  const pressEnter = submit.noul >= options2.thresholds.act;
  const label = `fill [${element.ref}] ${elementLabel(element)} (${typedChars(value)})${pressEnter ? " + Enter" : ""}`;
  options2.log.info(`  ${source.padEnd(4)} value ${typedChars(value)}  jev submit=${submit.noul.toFixed(2)}`);
  options2.log.info(`  act  ${label}`);
  try {
    await deps.browser.fill(element, value, pressEnter);
    if (!pressEnter) {
      const now = await deps.browser.readValue(element).catch(() => void 0);
      if (now !== void 0 && now.trim() !== value.trim()) {
        options2.log.info(`  read-back mismatch (field holds ${typedChars(now)}); retyping`);
        await deps.browser.fill(element, value, false);
      }
    }
    return label;
  } catch (error42) {
    return recordFailure(options2, memory, label, error42);
  }
}
var COMPOSE_SYSTEM = `You write text on behalf of a user for one form field in a browser. Reply with JSON {"text":"..."}. Write exactly what the user's request asks for (topic, audience, required points, tone and length if given), ready to submit as-is: no placeholders, no preamble, no explanation. Use facts from the notes when relevant and invent none.`;
async function composeText(deps, options2, snapshot, memory, element) {
  const key = `${element.role}|${element.name}`;
  const cached2 = memory.drafts.get(key);
  if (cached2 !== void 0) {
    options2.log.info("  reusing the draft written earlier for this field");
    return cached2;
  }
  for (let attempt = 0; attempt < 2; attempt += 1) {
    let text2;
    try {
      const reply2 = extractJsonObject(await deps.model.complete({
        system: COMPOSE_SYSTEM,
        user: [
          `User request: ${deps.prompt}`,
          `Task: ${deps.plan.task}`,
          notesBlock(memory),
          `Page: ${snapshot.title} (${snapshot.url})`,
          `Field: ${element.line}`
        ].join("\n\n"),
        json: true,
        maxTokens: 1200
      }));
      if (typeof reply2.text !== "string" || reply2.text.trim() === "") {
        continue;
      }
      text2 = reply2.text.trim();
    } catch (error42) {
      options2.log.info(`  llm  compose failed: ${firstLine(error42)}`);
      continue;
    }
    const { fits } = await deps.jev.decide({
      request: deps.prompt,
      notes: memory.notes,
      field: element.line,
      draft: text2
    }, {
      fits: noul("Does the draft fulfil what the request asks to be written for this field (topic, required points, tone and length if specified) without inventing facts absent from the request or notes?")
    });
    options2.log.info(`  llm  composed ${String(text2.length)} chars with ${deps.model.label}; jev fits=${fits.noul.toFixed(2)}`);
    if (fits.noul >= 0.5) {
      memory.drafts.set(key, text2);
      return text2;
    }
  }
  return void 0;
}
async function proposeFillValue(deps, options2, state, snapshot, memory, element) {
  let reply2;
  try {
    reply2 = extractJsonObject(await deps.model.complete({
      system: FILL_SYSTEM,
      user: [
        `User request (verbatim; use its exact names and text, never a password, one-time code or card detail from it): ${deps.prompt}`,
        `Task: ${deps.plan.task}`,
        `Desired outcome: ${deps.plan.outcome}`,
        notesBlock(memory),
        `Page: ${snapshot.title} (${snapshot.url})`,
        `Field: ${element.line}`,
        `Recent actions: ${memory.history.slice(-5).join("; ") || "none"}`
      ].join("\n"),
      json: true,
      maxTokens: 200
    }));
  } catch (error42) {
    options2.log.info(`  llm  fill value failed: ${firstLine(error42)}`);
    return void 0;
  }
  if (reply2.value === null)
    throw new CredentialFieldStop("credential");
  if (typeof reply2.value !== "string" || reply2.value === "") {
    return void 0;
  }
  const value = reply2.value;
  const { grounded } = await deps.jev.decide({ ...state, field: element.line, valueToType: value }, {
    grounded: noul("Is the value to type taken from, or directly required by, the user request or the notes (an exact name, code, message or search term from there), rather than invented?")
  });
  observe(options2, {
    kind: "grounding",
    subject: "fill",
    outcome: grounded.noul >= 0.5 ? "kept" : "dropped"
  });
  if (grounded.noul >= 0.5) {
    return value;
  }
  options2.log.info(`  jev  rejected fill value (${typedChars(value)}) as ungrounded (${grounded.noul.toFixed(2)}); deferring to the LLM`);
  return void 0;
}
async function doScroll(deps, options2, direction) {
  const moved = await deps.browser.scroll(direction);
  const label = moved ? `scroll ${direction}` : `scroll ${direction} had no effect (already at the ${direction === "down" ? "bottom" : "top"})`;
  options2.log.info(`  act  ${label}`);
  return label;
}
async function fallbackMove(deps, options2, snapshot, memory) {
  const { history } = memory;
  let move2;
  try {
    const parsed2 = parseFallbackMove(extractJsonObject(await deps.model.complete({
      system: FALLBACK_SYSTEM,
      user: [
        `User request: ${deps.prompt}`,
        `Task: ${deps.plan.task}`,
        `Desired outcome: ${deps.plan.outcome}`,
        notesBlock(memory),
        `Page: ${snapshot.title} (${snapshot.url}); perception: ${snapshot.source}`,
        `History:
${history.map((entry) => `- ${entry}`).join("\n") || "- (none)"}`,
        `Already clicked from this page (do not repeat): ${[...memory.takenClicks].filter((key) => key.startsWith(`${snapshot.url}|`)).map((key) => key.split("|").slice(1).join(" ")).join("; ") || "(nothing yet)"}`,
        `Snapshot:
${snapshot.text}`
      ].join("\n\n"),
      json: true,
      maxTokens: 400
    })));
    if (parsed2 === void 0) {
      throw new Error("invalid fallback move");
    }
    move2 = parsed2;
  } catch (error42) {
    const failure2 = `llm fallback reply unusable: ${firstLine(error42)}`;
    options2.log.info(`  ${failure2}`);
    return failure2;
  }
  options2.log.info(`  llm  fallback \u2192 ${loggableMove(move2)}`);
  const { browser } = deps;
  try {
    switch (move2.action) {
      case "navigate": {
        if (looksLikeGuessedUrl(move2.url, snapshot, memory.history)) {
          observe(options2, { kind: "guard", guard: "guessed_url" });
          const refusal = `${GUESSED_URL_REFUSAL} ${move2.url}: that URL was not on the page and looks invented; use a link on the page or the site search instead`;
          options2.log.info(`  ${refusal}`);
          return refusal;
        }
        await browser.navigate(move2.url);
        return `navigated to ${move2.url}`;
      }
      case "click": {
        const element = findElement(snapshot, move2.ref);
        if (element === void 0) {
          return `llm asked to click unknown ref ${move2.ref}; nothing happened`;
        }
        const key = clickKey(snapshot, element);
        if (memory.takenClicks.has(key)) {
          const refusal = `refused to repeat click [${element.ref}] ${elementLabel(element)} (already taken from this page); try scrolling or another element`;
          options2.log.info(`  ${refusal}`);
          return refusal;
        }
        await browser.click(element);
        memory.takenClicks.add(key);
        memory.lastClickKey = key;
        memory.lastClickUrl = element.url;
        return `click [${element.ref}] ${elementLabel(element)} (llm fallback)`;
      }
      case "fill": {
        const element = findElement(snapshot, move2.ref);
        if (element === void 0) {
          return `llm asked to fill unknown ref ${move2.ref}; nothing happened`;
        }
        const credential = credentialFieldKind(element);
        if (credential !== void 0)
          throw new CredentialFieldStop(credential);
        await browser.fill(element, move2.value, move2.submit === true);
        return `fill [${element.ref}] (${typedChars(move2.value)})${move2.submit === true ? " + Enter" : ""} (llm fallback)`;
      }
      case "hover": {
        const element = findElement(snapshot, move2.ref);
        if (element === void 0) {
          return `llm asked to hover unknown ref ${move2.ref}; nothing happened`;
        }
        await browser.hover(element);
        return `hover [${element.ref}] ${elementLabel(element)} (llm fallback)`;
      }
      case "drag": {
        const from2 = findElement(snapshot, move2.from);
        const to3 = findElement(snapshot, move2.to);
        if (from2 === void 0 || to3 === void 0) {
          return `llm asked to drag unknown refs ${move2.from} \u2192 ${move2.to}; nothing happened`;
        }
        await browser.drag(from2, to3);
        return `drag [${from2.ref}] onto [${to3.ref}] (llm fallback)`;
      }
      case "scroll": {
        const direction = move2.direction ?? "down";
        const moved = await browser.scroll(direction);
        return moved ? `scroll ${direction} (llm fallback)` : `scroll ${direction} had no effect`;
      }
      case "back":
        await browser.back();
        return "went back (llm fallback)";
      case "press":
        await browser.pressKey(move2.key);
        return `pressed ${move2.key} (llm fallback)`;
      case "deeper_a11y":
        return deeper(memory, snapshot, options2.log) ?? "deeper accessibility tree already in use; nothing happened";
      case "cua":
        return visualMove(deps, options2, snapshot, memory);
      case "done":
        return "done";
      case "wait":
        return "waited";
      default:
        return `llm returned an unknown move ${JSON.stringify(move2).slice(0, 120)}; nothing happened`;
    }
  } catch (error42) {
    rethrowIfFatal(options2, error42);
    return `llm fallback ${move2.action} failed: ${firstLine(error42)}`;
  }
}
async function visualMove(deps, options2, snapshot, memory) {
  let move2;
  try {
    const imagePng = await deps.browser.screenshotPng();
    const parsed2 = parseCuaMove(extractJsonObject(await deps.model.completeWithImage({
      system: CUA_SYSTEM,
      user: [
        `User request: ${deps.prompt}`,
        `Task: ${deps.plan.task}`,
        `Desired outcome: ${deps.plan.outcome}`,
        notesBlock(memory),
        `Page: ${snapshot.title} (${snapshot.url})`,
        `History:
${memory.history.slice(-8).map((entry) => `- ${entry}`).join("\n") || "- (none)"}`,
        `Accessibility text (may be incomplete; trust the screenshot):
${snapshot.text.slice(0, 12e3)}`
      ].join("\n\n"),
      json: true,
      maxTokens: 300,
      imagePng
    })));
    if (parsed2 === void 0) {
      throw new Error("invalid cua move");
    }
    move2 = parsed2;
  } catch (error42) {
    const failure2 = `cua reply unusable: ${firstLine(error42)}`;
    options2.log.info(`  ${failure2}`);
    return failure2;
  }
  options2.log.info(`  cua  \u2192 ${loggableMove(move2)}`);
  if (move2.action === "done") {
    return "done";
  }
  if (move2.action === "type" && move2.description !== void 0) {
    const credential = credentialNameKind(move2.description);
    if (credential !== void 0)
      throw new CredentialFieldStop(credential);
  }
  try {
    await deps.browser.act(move2);
    return `cua ${loggableMove(move2).slice(0, 100)}`;
  } catch (error42) {
    rethrowIfFatal(options2, error42);
    return `cua ${move2.action} failed: ${firstLine(error42)}`;
  }
}
function handoffReport(snapshot, memory, stop) {
  const notes = memory.notes.length === 0 ? "" : `

Facts collected before stopping:
${memory.notes.map((note) => `- ${note}`).join("\n")}`;
  return `Stopped at a ${stop.field} field on ${snapshot.url} (${snapshot.title}). The browser subagent never types passwords, one-time codes or payment details, so the user must complete this step in the box; hand it over with request_box_help and dispatch the subagent again afterwards.${notes}`;
}
async function composeAnswer(deps, snapshot, memory, reason) {
  const caveat = reason === "max-steps" ? "Note: the agent ran out of steps. Give the best answer the observed page supports and state clearly what is missing." : reason === "stalled" ? "Note: the agent could not make further progress on this page. Give the best answer the observations support and state clearly what could not be done or found." : "";
  return (await deps.model.complete({
    system: ANSWER_SYSTEM,
    user: [
      `User request: ${deps.prompt}`,
      `Task: ${deps.plan.task}`,
      `Desired outcome: ${deps.plan.outcome}`,
      caveat,
      notesBlock(memory),
      `Current page: ${snapshot.title} (${snapshot.url})`,
      `Action history:
${memory.history.map((entry) => `- ${entry}`).join("\n")}`,
      `Page snapshot:
${snapshot.text}`
    ].filter((part) => part !== "").join("\n\n"),
    maxTokens: 2e3
  })).trim();
}

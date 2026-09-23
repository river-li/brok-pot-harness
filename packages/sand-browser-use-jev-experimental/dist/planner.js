var DEFAULT_SEARCH_URL_TEMPLATE = "https://html.duckduckgo.com/html/?q={q}";
function searchUrl({ template, query }) {
  if (!template.includes("{q}")) {
    throw new Error(`search URL template must contain {q}: ${template}`);
  }
  return template.replace("{q}", encodeURIComponent(query));
}
var PLANNER_SYSTEM = `You prepare a browsing request for a web agent that can only click, type, and scroll in a browser.
Return JSON with these fields:
- "task": one imperative sentence describing what the agent must do in the browser.
- "outcome": a precise description of what the final answer to the user must contain (format, count, fields).
- "directUrl": the URL to open first when the right site is obvious (a URL the user gave, or a well-known site such as https://github.com, https://news.google.com, https://en.wikipedia.org). Use the most specific page you are sure exists (a search results URL on that site is fine). null when you do not know where the information lives.
- "searchQuery": 2-6 plain keywords a person would type into a web search engine to find the right page, in case directUrl cannot be used.`;
function requireString(value, field) {
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`planner: missing "${field}" in LLM reply`);
  }
  return value.trim();
}
function httpUrl(candidate) {
  if (typeof candidate !== "string") {
    return void 0;
  }
  try {
    const parsed2 = new URL(candidate);
    return parsed2.protocol === "http:" || parsed2.protocol === "https:" ? parsed2.toString() : void 0;
  } catch {
    return void 0;
  }
}
function promptNamesUrl(prompt, url2) {
  let parsed2;
  try {
    parsed2 = new URL(url2);
  } catch {
    return false;
  }
  const host = parsed2.hostname.toLowerCase().replace(/^www\./, "");
  const path31 = `${parsed2.pathname}${parsed2.search}`.replace(/\/$/, "");
  return mentionedAsWhole(prompt.toLowerCase(), `${host}${path31}`);
}
function mentionedAsWhole(text2, target) {
  const escaped = target.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`(^|[^a-z0-9.-])(www\\.)?${escaped}/?(?=$|[\\s,;:!?)\\]"']|\\.(?=\\s|$))`).test(text2);
}
async function planTask(prompt, llm, jev, options2) {
  const reply2 = extractJsonObject(await llm.complete({
    system: PLANNER_SYSTEM,
    user: `User request:
${prompt}`,
    json: true,
    maxTokens: 600
  }));
  const task = requireString(reply2.task, "task");
  const outcome = requireString(reply2.outcome, "outcome");
  const searchQuery = typeof reply2.searchQuery === "string" && reply2.searchQuery.trim() !== "" ? reply2.searchQuery.trim() : prompt.replace(/https?:\/\/\S+/gu, "").split(/\s+/u).filter((word) => word !== "").slice(0, 8).join(" ");
  const directUrl = httpUrl(reply2.directUrl);
  if (options2.startUrl !== void 0) {
    return {
      task,
      outcome,
      searchQuery,
      startingUrl: options2.startUrl,
      viaSearch: false,
      reason: "--start-url"
    };
  }
  if (directUrl === void 0) {
    return {
      task,
      outcome,
      searchQuery,
      startingUrl: searchUrl({ template: options2.searchUrlTemplate, query: searchQuery }),
      viaSearch: true,
      reason: "no obvious site; web search"
    };
  }
  if (promptNamesUrl(prompt, directUrl)) {
    return {
      task,
      outcome,
      searchQuery,
      startingUrl: directUrl,
      viaSearch: false,
      reason: "URL given by the user"
    };
  }
  const { start } = await jev.decide({
    request: prompt,
    task,
    proposedStartUrl: directUrl,
    alternativeWebSearch: searchQuery
  }, {
    start: choice("Where should the browser agent begin?", {
      direct: "the proposed URL is a well-known site that clearly is where this task takes place; open it directly",
      search: "it is not obvious which site or page holds the answer; run the web search first and pick from the results"
    })
  });
  options2.log?.(`  jev  start \u2192 ${start.choice} (${start.confidence.toFixed(2)})  ${topChoices(start, 2)}`);
  if (start.choice === "direct" && start.confidence >= 0.5) {
    return {
      task,
      outcome,
      searchQuery,
      startingUrl: directUrl,
      viaSearch: false,
      reason: "obvious site"
    };
  }
  return {
    task,
    outcome,
    searchQuery,
    startingUrl: searchUrl({ template: options2.searchUrlTemplate, query: searchQuery }),
    viaSearch: true,
    reason: "site not obvious; web search"
  };
}
async function resolveStartingUrl(plan, browser, jev, log5) {
  const snapshot = await browser.snapshot();
  const results = snapshot.elements.filter((element2) => element2.kinds.includes("click") && element2.role === "link" && element2.url !== void 0);
  if (results.length === 0) {
    log5("  search results page has no result links; continuing from here");
    return snapshot.url;
  }
  const criteria = elementCriteria(results, "click", 40);
  criteria.none = "stay on the search results page";
  const { pick: pick2 } = await jev.decide({
    task: plan.task,
    outcome: plan.outcome,
    searchQuery: plan.searchQuery,
    results: snapshot.text
  }, {
    pick: choice("Which search result is the best page to start the task on?", criteria)
  });
  log5(`  jev  result \u2192 ${pick2.choice} (${pick2.confidence.toFixed(2)})  ${topChoices(pick2, 3)}`);
  const element = results.find((candidate) => candidate.ref === pick2.choice);
  if (element === void 0 || pick2.confidence < 0.3) {
    return snapshot.url;
  }
  log5(`  act  open result ${element.role} "${element.name}" \u2192 ${element.url ?? ""}`);
  await browser.click(element);
  return (await browser.snapshot()).url;
}

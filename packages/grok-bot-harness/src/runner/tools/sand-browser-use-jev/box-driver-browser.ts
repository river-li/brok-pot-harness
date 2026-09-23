init_scheduling();
init_unknown_record();
var RETRYABLE_NAVIGATION = /ERR_ABORTED|frame was detached/i;
var STALE_REF = /stale ref|Unknown or stale/i;
var NAVIGATE_RETRY = createRetryPolicy({
  name: "sand-browser-use-jev-navigate",
  maxAttempts: 2,
  initialDelayMs: 1e3,
  maxDelayMs: 1e3,
  jitter: "none",
  shouldRetry: (error42) => RETRYABLE_NAVIGATION.test(errorMessage6(error42))
});
function describe(element) {
  return `${element.role} "${element.name}"`.slice(0, 200);
}
function refLookup(ref) {
  const key = JSON.stringify(ref);
  return `(globalThis.__sandRefs?.get(${key})?.deref?.() ?? globalThis.__sandRefs?.get(${key}))`;
}
function errorMessage6(error42) {
  return error42 instanceof Error ? error42.message : String(error42);
}
function at2(value, ...path31) {
  let current = value;
  for (const key of path31) {
    if (!isUnknownRecord(current)) return void 0;
    current = current[key];
  }
  return current;
}
function numberAt(value, ...path31) {
  const found = at2(value, ...path31);
  return typeof found === "number" ? found : void 0;
}
function stringAt(value, ...path31) {
  const found = at2(value, ...path31);
  return typeof found === "string" ? found : void 0;
}
function isAxNode(value) {
  return isUnknownRecord(value) && typeof value.nodeId === "string";
}
function spilledOutputFile(value) {
  return at2(value, "truncated") === true ? stringAt(value, "outputFile") : void 0;
}
function pointArgs(role, point2) {
  return role === "source" ? { sourceX: point2.x, sourceY: point2.y } : { targetX: point2.x, targetY: point2.y };
}
var UNINSPECTABLE_FRAME_FOCUS = "focus is inside a frame whose control cannot be inspected; nothing was typed";
var BoxDriverBrowser = class {
  options;
  calls = 0;
  lastUrl = "";
  lastTitle = "";
  constructor(options2) {
    this.options = options2;
  }
  async op(op, args, flags = {}) {
    this.calls += 1;
    const result = await this.options.driver.call(this.options.ctx, op, args, {
      toolCallId: `${this.options.callIdPrefix}-${String(this.calls)}`,
      signal: this.options.signal,
      screenshot: flags.screenshot === true,
      readOnlyProbe: flags.readOnlyProbe === true
    });
    if (result.ok) {
      if (result.url !== void 0 && result.url !== "") this.lastUrl = result.url;
      if (result.title !== void 0) this.lastTitle = result.title;
    }
    return result;
  }
  async must(op, args, flags = {}) {
    const result = await this.op(op, args, flags);
    if (!result.ok) throw new Error(result.error);
    return result;
  }
  probe(method, params) {
    return this.cdpCall(method, params, { readOnlyProbe: true });
  }
  async navigate(url2) {
    await NAVIGATE_RETRY.runWithRetry(async () => {
      await this.must("navigate", { url: url2 });
    }, this.options.signal);
  }
  async snapshot(source = "aria") {
    const base = source === "deep-a11y" ? await this.deepSnapshot() : await this.driverSnapshot();
    return { ...base, url: this.lastUrl, title: this.lastTitle };
  }
  async driverSnapshot() {
    const result = await this.must("snapshot", {});
    return buildSnapshot(result.data ?? "", { maxChars: this.options.snapshotMaxChars });
  }
  async deepSnapshot() {
    const nodes = at2(await this.probe("Accessibility.getFullAXTree", {}), "nodes");
    return buildDeepSnapshot(
      Array.isArray(nodes) ? nodes.filter(isAxNode) : [],
      this.options.snapshotMaxChars
    );
  }
  async click(element) {
    const description9 = describe(element);
    if (element.backendNodeId !== void 0) {
      const center = await this.centerOf(element.backendNodeId);
      await this.must("mouse_click_xy", { x: center.x, y: center.y, element: description9 });
      return;
    }
    await this.withFreshRef(element, (ref) => this.must("click", { ref, element: description9 }));
  }
  async withFreshRef(element, act) {
    try {
      await act(element.ref);
      return;
    } catch (error42) {
      if (!STALE_REF.test(errorMessage6(error42))) throw error42;
      this.options.note(`stale ref ${element.ref}; re-resolving ${element.role} by name`);
    }
    const fresh = await this.driverSnapshot();
    const again = fresh.elements.find(
      (candidate) => candidate.role === element.role && candidate.name === element.name
    );
    if (again === void 0) {
      throw new Error(
        `${element.role} "${element.name}" is no longer on the page after a re-render`
      );
    }
    await act(again.ref);
  }
  async fill(element, value, submit) {
    if (element.backendNodeId !== void 0) {
      const center = await this.centerOf(element.backendNodeId);
      await this.must("mouse_click_xy", { x: center.x, y: center.y, element: describe(element) });
      await this.typeInto({ text: value, clear: true, submit, element: describe(element) });
      return;
    }
    let options2 = [];
    try {
      options2 = await this.selectOptions(element);
    } catch (error42) {
      this.options.note(`select options unreadable for ${element.ref}: ${errorMessage6(error42)}`);
    }
    if (options2.length > 0) {
      await this.withFreshRef(element, async (ref) => {
        await this.refuseSecretControl({ ref });
        await this.writeGuarded("select_option", { ref, values: [value], refuseSecret: true });
      });
      return;
    }
    await this.withFreshRef(element, async (ref) => {
      await this.refuseSecretControl({ ref });
      await this.writeGuarded("fill", { ref, value, refuseSecret: true });
    });
    if (submit) await this.pressKeyGuarded("Enter");
  }
  async typeInto(args) {
    if (await this.refuseSecretControl({ element: args.element }) === "frame") {
      throw new Error(UNINSPECTABLE_FRAME_FOCUS);
    }
    await this.writeGuarded("type_focused", { ...args, refuseSecret: true });
  }
  async refuseSecretControl(target) {
    const inspected = parseJsonOrUndefined((await this.must("inspect_control", target)).data ?? "");
    if (at2(inspected, "secret") === true) throw new CredentialFieldStop("credential");
    const focused = at2(inspected, "focused");
    return focused === "none" || focused === "frame" ? focused : "control";
  }
  async pressKeyGuarded(key) {
    if (await this.refuseSecretControl({}) === "frame") {
      throw new Error(UNINSPECTABLE_FRAME_FOCUS);
    }
    await this.writeGuarded("press_key", { key, refuseSecret: true });
  }
  async writeGuarded(op, args) {
    try {
      await this.must(op, args);
    } catch (error42) {
      if (errorMessage6(error42).includes(SAND_BROWSER_SECRET_CONTROL_ERROR)) {
        throw new CredentialFieldStop("credential");
      }
      throw error42;
    }
  }
  async hover(element) {
    const description9 = describe(element);
    if (element.backendNodeId !== void 0) {
      const center = await this.centerOf(element.backendNodeId);
      await this.must("hover", { x: center.x, y: center.y, element: description9 });
      return;
    }
    await this.withFreshRef(element, (ref) => this.must("hover", { ref, element: description9 }));
  }
  async drag(from2, to3) {
    const source = from2.backendNodeId === void 0 ? { sourceRef: from2.ref } : pointArgs("source", await this.centerOf(from2.backendNodeId));
    const target = to3.backendNodeId === void 0 ? { targetRef: to3.ref } : pointArgs("target", await this.centerOf(to3.backendNodeId));
    await this.must("drag", {
      ...source,
      ...target,
      element: `${describe(from2)} to ${describe(to3)}`
    });
  }
  async scroll(direction) {
    const before = await this.scrollY();
    await this.must("scroll", { direction, amount: 700 });
    const after = await this.scrollY();
    return before === void 0 || after === void 0 || Math.abs(after - before) > 2;
  }
  async scrollY() {
    return numberAt(
      await this.probe("Runtime.evaluate", { expression: "window.scrollY", returnByValue: true }),
      "result",
      "value"
    );
  }
  async back() {
    const history = await this.probe("Page.getNavigationHistory", {});
    const currentIndex = numberAt(history, "currentIndex");
    const entries = at2(history, "entries");
    if (currentIndex === void 0 || !Array.isArray(entries)) return;
    const entryId = numberAt(entries[currentIndex - 1], "id");
    if (entryId !== void 0) {
      await this.cdp("Page.navigateToHistoryEntry", { entryId });
    }
  }
  async pressKey(key) {
    await this.pressKeyGuarded(key);
  }
  async screenshotPng() {
    const result = await this.must("screenshot", {}, { screenshot: true });
    if (result.screenshot === void 0) throw new Error("screenshot unavailable");
    return result.screenshot;
  }
  async act(action) {
    switch (action.action) {
      case "click":
        await this.must("mouse_click_xy", {
          x: action.x,
          y: action.y,
          doubleClick: action.double === true,
          element: action.description
        });
        return;
      case "type":
        if (action.x !== void 0 && action.y !== void 0) {
          await this.must("mouse_click_xy", {
            x: action.x,
            y: action.y,
            element: action.description ?? "the text field to type into"
          });
        }
        await this.typeInto({
          text: action.text,
          submit: action.submit === true,
          element: action.description ?? "the text field to type into"
        });
        return;
      case "scroll":
        await this.must("scroll", { deltaY: action.deltaY, deltaX: 0 });
        return;
      case "drag":
        await this.must("drag", {
          ...pointArgs("source", action.from),
          ...pointArgs("target", action.to),
          element: action.description ?? "the element under the drag start point"
        });
        return;
      case "key":
        await this.pressKeyGuarded(action.key);
        return;
    }
  }
  async selectOptions(element) {
    if (element.backendNodeId !== void 0) return [];
    const value = at2(
      await this.probe("Runtime.evaluate", {
        expression: `(() => { const el = ${refLookup(element.ref)}; return el && el.tagName === "SELECT" ? Array.from(el.options).map(o => o.label) : []; })()`,
        returnByValue: true
      }),
      "result",
      "value"
    );
    return Array.isArray(value) ? value.filter((item) => typeof item === "string") : [];
  }
  async readValue(element) {
    const target = element.backendNodeId === void 0 ? refLookup(element.ref) : "document.activeElement";
    return stringAt(
      await this.probe("Runtime.evaluate", {
        expression: `(() => { const el = ${target}; if (!el) return ""; return typeof el.value === "string" ? el.value : (el.textContent ?? ""); })()`,
        returnByValue: true
      }),
      "result",
      "value"
    ) ?? "";
  }
  cdp(method, params) {
    return this.cdpCall(method, params, { readOnlyProbe: false });
  }
  async cdpCall(method, params, flags) {
    const result = await this.must("cdp", { method, params }, flags);
    if (result.data === void 0 || result.data === "") return void 0;
    const parsed2 = parseJsonOrUndefined(result.data);
    if (parsed2 === void 0) return result.data;
    const outputFile = spilledOutputFile(parsed2);
    if (outputFile === void 0) return parsed2;
    const bytes = await this.options.readBoxFile(outputFile);
    return parseJsonOrUndefined(Buffer.from(bytes).toString("utf8"));
  }
  async centerOf(backendNodeId) {
    try {
      await this.probe("DOM.scrollIntoViewIfNeeded", { backendNodeId });
    } catch (error42) {
      this.options.note(
        `scrollIntoView failed for node ${String(backendNodeId)}: ${errorMessage6(error42)}`
      );
    }
    const quad = at2(await this.probe("DOM.getBoxModel", { backendNodeId }), "model", "content");
    if (!Array.isArray(quad) || quad.length < 8) {
      throw new Error(`no box model for node ${String(backendNodeId)}`);
    }
    const xs2 = [quad[0], quad[2], quad[4], quad[6]].map(Number);
    const ys2 = [quad[1], quad[3], quad[5], quad[7]].map(Number);
    return {
      x: (Math.min(...xs2) + Math.max(...xs2)) / 2,
      y: (Math.min(...ys2) + Math.max(...ys2)) / 2
    };
  }
};

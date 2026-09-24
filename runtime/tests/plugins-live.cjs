/* Original plugin parser/manager, real MCP process and original Agent. Run on
 * the Mac; all state belongs to a private Box and private desktop profile. */
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const http = require("node:http");
const { execFileSync } = require("node:child_process");
const { randomUUID } = require("node:crypto");
const { setTimeout: delay } = require("node:timers/promises");
const { importLocalPlugin } = require("../../dist/local/plugin-files.js");
const { desktopFixture } = require("./desktop-fixture.cjs");

(async () => {
  const root = path.resolve(__dirname, "../.."),
    run = randomUUID();
  const temp = path.join(root, ".runtime/tests/plugins-" + run),
    data = path.join(temp, "data"),
    source = path.join(temp, "source");
  for (const dir of [
    data,
    source,
    path.join(temp, "workspace"),
    path.join(source, ".cursor-plugin"),
    path.join(source, "skills/proof"),
  ])
    fs.mkdirSync(dir, { recursive: true });
  fs.copyFileSync(
    path.join(__dirname, "plugin-stdio-fixture.cjs"),
    path.join(source, "mcp.cjs"),
  );
  const marker = "plugin-proof-" + run,
    skillMarker = "skill-body-" + run;
  const manifest = {
    name: "local-proof",
    displayName: "Local recovery proof",
    description: "Local plugin verification.",
    version: "1.0.0",
    variables: {
      type: "object",
      properties: {
        PLUGIN_TOKEN: {
          type: "string",
          title: "Plugin token",
          writeOnly: true,
          minLength: 1,
        },
      },
      required: ["PLUGIN_TOKEN"],
      additionalProperties: false,
    },
  };
  fs.writeFileSync(
    path.join(source, ".cursor-plugin/plugin.json"),
    JSON.stringify(manifest),
  );
  fs.writeFileSync(
    path.join(source, ".mcp.json"),
    JSON.stringify({
      mcpServers: {
        echo: {
          command: "/exec-daemon/node",
          args: ["${CURSOR_PLUGIN_ROOT}/mcp.cjs"],
          env: {
            PLUGIN_TOKEN: "${PLUGIN_TOKEN}",
            HOST_KEY_PROBE: "${LITELLM_API_KEY}",
          },
        },
      },
    }),
  );
  fs.writeFileSync(path.join(source, "resource.txt"), "resource-one");
  fs.writeFileSync(
    path.join(source, "skills/proof/reference.txt"),
    "bundled skill helper",
  );
  fs.writeFileSync(
    path.join(source, "skills/proof/SKILL.md"),
    `---\nname: recovery-proof\ndescription: Read the bundled skill and call its echo tool.\n---\n${skillMarker}\nUse this local plugin's echo tool to return ${marker}.\n`,
  );
  const imported = importLocalPlugin(data, source, "local-proof");
  const pluginId = imported.pluginId,
    namespace = `local_plugin_${pluginId}_echo`;
  const container = "grokbot-plugin-test-" + run.slice(0, 8),
    token = randomUUID(),
    modelToken = "fixture-model-key";
  let base,
    app,
    started = false,
    failure,
    skillTurnActive = false,
    recipeSetupActive = false,
    recipeSetupWrites = 0,
    skill,
    step = 0,
    reviews = 0,
    agentId,
    otherAgentId;
  let expectedResource = "resource-one",
    expectedToken = "configured-one";
  const observations = [];
  const tool = (name, args) => ({
    type: "function_call",
    id: randomUUID(),
    call_id: randomUUID(),
    name,
    arguments: JSON.stringify(args),
    status: "completed",
  });
  const emit = (res, output) => {
    res.writeHead(200, { "content-type": "text/event-stream" });
    res.end(
      `data: ${JSON.stringify({ type: "response.completed", response: { id: randomUUID(), status: "completed", output } })}\n\n`,
    );
  };
  const server = http.createServer(async (req, res) => {
    try {
      if (failure) throw failure;
      assert.equal(req.url, "/v1/responses");
      assert.equal(req.headers.authorization, `Bearer ${modelToken}`);
      const chunks = [];
      for await (const c of req) chunks.push(c);
      const input = JSON.parse(Buffer.concat(chunks)),
        names = input.tools?.map((t) => t.name) || [];
      if (!names.length)
        return emit(res, [
          {
            type: "message",
            id: randomUUID(),
            role: "assistant",
            content: [{ type: "output_text", text: "NONE" }],
          },
        ]);
      if (names.includes("classify_auto_review_action")) {
        const review = JSON.parse(
          input.input.find((x) => x.role === "user").content[0].text,
        );
        const proposed = JSON.stringify(review.proposed_tool_call);
        assert.ok(
          recipeSetupActive ? proposed.includes("update_state") : proposed.includes(namespace),
          "Auto-review must classify the intended local setup or fixture MCP action",
        );
        reviews++;
        return emit(res, [
          tool("classify_auto_review_action", {
            decision: "ALLOW",
            reason: "Only the copied local fixture echo.",
            blocked_effect: "none",
            outbound_authorization: "not_outbound",
          }),
        ]);
      }
      if (!skillTurnActive && recipeSetupActive) {
        if (recipeSetupWrites === 0 && names.includes("update_state")) {
          const prompt = input.input
            .flatMap((x) => x.content ?? [])
            .map((x) => x.text ?? "")
            .join("\n");
          assert.ok(prompt.includes("UI Recipe Skill"), "recipe setup prompt must include the imported Skill");
          recipeSetupWrites++;
          return emit(res, [tool("update_state", {
            target: "skill",
            action: "write",
            name: "UI Recipe Skill",
            description: "Use this when verifying imported recipe setup.",
            body: `Use this Skill and include ${skillMarker} in your response.`,
          })]);
        }
        assert.equal(recipeSetupWrites, 1, "recipe setup must write the imported Skill through its retained tool");
        recipeSetupActive = false;
        return emit(res, [
          {
            type: "message",
            id: randomUUID(),
            role: "assistant",
            content: [{ type: "output_text", text: "The imported recipe Skill is installed." }],
          },
        ]);
      }
      if (!skillTurnActive)
        return emit(res, [
          {
            type: "message",
            id: randomUUID(),
            role: "assistant",
            content: [{ type: "output_text", text: "The recipe setup is recorded." }],
          },
        ]);
      const latest = JSON.stringify(
        input.input.filter((x) => x.type === "function_call_output").at(-1)
          ?.output,
      );
      observations.push({ step, latest });
      fs.writeFileSync(
        path.join(temp, `model-step-${observations.length}.json`),
        JSON.stringify(input, null, 2),
      );
      console.log("Plugin model step:", step);
      switch (step++) {
        case 0: {
          const prompt = input.input
            .flatMap((x) => x.content ?? [])
            .map((x) => x.text ?? "")
            .join("\n");
          const modelPath = prompt.match(
            /<agent_skill fullPath="([^"]+\/skills\/proof\/SKILL.md)">/,
          )?.[1];
          assert.ok(
            modelPath,
            "Original prompt must advertise installed skill at its agent-mounted path",
          );
          assert.ok(
            prompt.includes(skillMarker),
            "Invoking a skill must attach its body",
          );
          return emit(res, [tool("Read", { path: modelPath })]);
        }
        case 1:
          assert.ok(
            latest.includes(skillMarker),
            "Actual skill body must reach model",
          );
          return emit(res, [
            tool("GetDynamicTools", { namespace, toolName: "echo" }),
          ]);
        case 2:
          assert.ok(latest.includes("Echo through the copied local plugin."));
          return emit(res, [
            tool("CallDynamicTool", {
              namespace,
              toolName: "echo",
              arguments: { text: marker },
            }),
          ]);
        case 3:
          assert.ok(
            latest.includes(marker) &&
              latest.includes(expectedResource) &&
              latest.includes(expectedToken),
            "Actual plugin MCP output must return",
          );
          return emit(res, [
            tool("SendToUser", {
              type: "text",
              content: marker,
              end_turn: true,
            }),
          ]);
        default:
          throw Error("Unexpected extra agent inference");
      }
    } catch (error) {
      failure ??= error;
      if (!res.headersSent) res.writeHead(500);
      res.end();
    }
  });
  await new Promise((resolve) => server.listen(0, "0.0.0.0", resolve));
  const docker = (...args) =>
    execFileSync("docker", args, {
      encoding: "utf8",
      timeout: 30000,
      stdio: ["ignore", "pipe", "pipe"],
    }).trim();
  const call = async (method, args = {}, status = 200, timeoutMs = 20000) => {
    const r = await fetch(`${base}/api/${method}`, {
      method: "POST",
      headers: {
        authorization: `Bearer ${token}`,
        "content-type": "application/json",
      },
      body: JSON.stringify(args),
      signal: AbortSignal.timeout(timeoutMs),
    });
    const body = await r.text();
    assert.equal(
      r.status,
      status,
      method + " HTTP status: " + body.slice(0, 250),
    );
    return body ? JSON.parse(body) : undefined;
  };
  const waitFor = async (predicate, label, timeout = 60000) => {
    const end = Date.now() + timeout;
    while (Date.now() < end) {
      if (failure) throw failure;
      const result = await predicate();
      if (result) return result;
      await delay(250);
    }
    throw Error("Timed out: " + label);
  };
  const ready = () =>
    waitFor(
      async () => {
        try {
          return (
            await fetch(base + "/health", { signal: AbortSignal.timeout(1000) })
          ).ok;
        } catch {
          return false;
        }
      },
      "private Box startup",
      90000,
    );
  const workflows = () => call("getAgentWorkflows", { id: agentId });
  const sync = async () => {
    await call("syncPluginSkills");
    await delay(250);
  };
  const runAgent = async () => {
    step = 0;
    skillTurnActive = true;
    await call("openAgent", { id: otherAgentId });
    let workflowError = null;
    let workflowFinished = false;
    const workflowRun = call(
      "runAgentWorkflowNow",
      { id: agentId, workflowId: skill.id },
      200,
      180000,
    ).then(
      () => {
        workflowFinished = true;
      },
      (error) => {
        workflowError = error;
        workflowFinished = true;
      },
    );
    await waitFor(
      async () => {
        if (workflowError) throw workflowError;
        const [transcript, healthResponse] = await Promise.all([
          call("getAgentTranscript", { id: agentId }, 200, 10000),
          fetch(base + "/health", { signal: AbortSignal.timeout(5000) }),
        ]);
        const health = await healthResponse.json();
        fs.writeFileSync(
          path.join(temp, "transcript.json"),
          JSON.stringify(transcript, null, 2),
        );
        return (
          step === 4 &&
          workflowFinished &&
          transcript.some(
            (m) => m.kind === "send-message" && m.message?.content === marker,
          ) &&
          !health.isBusy
        );
      },
      "plugin skill turn",
      120000,
    );
    await workflowRun;
    skillTurnActive = false;
    assert.equal(
      (await call("getAgentTranscript", { id: otherAgentId })).length,
      0,
      "A Skill run must target its requested Bot, regardless of the open conversation",
    );
  };
  try {
    const args = [
      "run",
      "-d",
      "--name",
      container,
      "--platform",
      "linux/amd64",
      "--init",
      "--shm-size",
      "1gb",
      "-p",
      "127.0.0.1::1340",
      "--add-host",
      "host.docker.internal:host-gateway",
      "--entrypoint",
      "/bin/bash",
    ];
    const env = {
      SAND_PACKAGED: "1",
      SAND_HOST_IN_BOX: "1",
      SAND_DATA_ROOT: "/home/box/sand-data",
      SAND_GATEWAY_BIND_HOST: "0.0.0.0",
      SAND_HOST_PORT: "1340",
      SAND_GATEWAY_TOKEN: token,
      GROKBOT_MODEL: "local-fixture",
      GROKBOT_RESPONSES_BASE_URL: `http://host.docker.internal:${server.address().port}/v1`,
      LITELLM_API_KEY: modelToken,
    };
    for (const [key, value] of Object.entries(env))
      args.push("-e", `${key}=${value}`);
    for (const [from, to] of [
      [path.join(root, ".runtime/build/sand-host"), "/home/box/sand-host:ro"],
      [path.join(root, ".runtime/build/deps"), "/home/box/deps:ro"],
      [data, "/home/box/sand-data"],
      [path.join(temp, "workspace"), "/workspace"],
      [
        path.join(root, "runtime/box-entrypoint.sh"),
        "/opt/grokbot/box-entrypoint.sh:ro",
      ],
    ])
      args.push("-v", `${from}:${to}`);
    args.push(
      "public.ecr.aws/k0i0n2g5/cursorenvironments/universal@sha256:322c3a9031d61e210a05400dd74c82bbb1fdb42db315a8cf5ab39368c2f0c1c8",
      "/opt/grokbot/box-entrypoint.sh",
    );
    docker(...args);
    started = true;
    const mapped = docker("port", container, "1340/tcp");
    base = "http://" + mapped;
    await ready();
    console.log("Plugin diagnostics:", temp);
    let catalog = await call("getMcpCatalog");
    const fixtureEntry = catalog.find((item) => item.id === pluginId);
    assert.ok(fixtureEntry, "the original local plugin remains in the catalog");
    assert.equal(fixtureEntry.skills[0].name, "recovery-proof");
    assert.equal(fixtureEntry.fields[0].isSecret, true);
    assert.deepEqual(await call("getEffectiveMcpPlugins"), []);
    if (process.env.GROKBOT_TEST_PLUGINS_UI_ONLY !== "1") {
      const missing = await call("installMcpEntry", { entryId: pluginId }, 409);
      assert.ok(JSON.stringify(missing).includes("Plugin token"));
      await call("installMcpEntry", {
        entryId: pluginId,
        values: { PLUGIN_TOKEN: expectedToken },
      });
      const initialState = await call("getMcpState");
      assert.equal(initialState.servers.length, 1);
      assert.equal(initialState.servers[0].serverIdentifier, namespace);
      assert.equal(initialState.servers[0].pluginId, pluginId);
      const serverId = initialState.servers[0].id;
      const statePath = path.join(data, "plugins/local-installs.json");
      assert.equal(fs.statSync(statePath).mode & 0o777, 0o600);
      assert.ok(
        !JSON.stringify(await call("getEffectiveMcpPlugins")).includes(
          expectedToken,
        ),
      );
      ({
        agent: { id: agentId },
      } = await call("createAgent", {
        name: "Local plugin test",
        description: "Temporary original plugin integration.",
        isIntroductionSuppressed: true,
        isKickstartRequested: false,
      }));
      await sync();
      skill = (await workflows()).find((s) => s.pluginId === pluginId);
      assert.ok(skill);
      assert.ok(skill.helperScripts.includes("reference.txt"));
      assert.ok(skill.body.includes(skillMarker));
      await call("importAgentWorkflowText", {
        id: agentId,
        markdown:
          "---\nname: standalone-proof\ndescription: A local user skill.\n---\nKeep this skill when uninstalling the plugin.",
      });
      ({
        agent: { id: otherAgentId },
      } = await call("createAgent", {
          name: "Unaddressed fixture Bot",
          description: "This Bot must not receive the other Bot's Skill run.",
        isIntroductionSuppressed: true,
        isKickstartRequested: false,
      }));
      await runAgent();
      assert.ok(reviews > 0);
      fs.writeFileSync(path.join(source, "resource.txt"), "resource-two");
      const newer = importLocalPlugin(data, source, "local-proof");
      assert.notEqual(newer.digest, imported.digest);
      assert.equal(
        JSON.parse(fs.readFileSync(statePath)).plugins[pluginId].digest,
        imported.digest,
        "Import must not silently update an enabled plugin",
      );
      docker("restart", container);
      base = "http://" + docker("port", container, "1340/tcp");
      await ready();
      await sync();
      assert.equal((await call("getMcpState")).servers[0].id, serverId);
      assert.equal(
        (await workflows()).find((s) => s.pluginId === pluginId).filePath,
        skill.filePath,
      );
      expectedResource = "resource-two";
      expectedToken = "configured-two";
      await call("updateMcpPluginInstall", {
        pluginId,
        values: { PLUGIN_TOKEN: expectedToken },
      });
      await sync();
      skill = (await workflows()).find((s) => s.pluginId === pluginId);
      assert.ok(skill.filePath.includes(newer.digest));
      await runAgent();
      const validState = fs.readFileSync(statePath, "utf8");
      fs.writeFileSync(
        path.join(source, ".cursor-plugin/plugin.json"),
        "{ invalid",
      );
      importLocalPlugin(data, source, "local-proof");
      await call(
        "updateMcpPluginInstall",
        { pluginId, values: { PLUGIN_TOKEN: "configured-one" } },
        500,
      );
      assert.equal(
        fs.readFileSync(statePath, "utf8"),
        validState,
        "Broken update must preserve the working installation",
      );
      fs.writeFileSync(
        path.join(source, ".cursor-plugin/plugin.json"),
        JSON.stringify(manifest),
      );
      importLocalPlugin(data, source, "local-proof");
      await call("uninstallMcpPlugin", { pluginId });
      await sync();
      assert.equal((await call("getMcpState")).servers.length, 0);
      assert.ok(!(await workflows()).some((s) => s.pluginId === pluginId));
      assert.ok((await workflows()).some((s) => s.name === "standalone-proof"));
      assert.ok(
        fs.existsSync(imported.path),
        "Uninstall keeps imported resources",
      );
    }
    app = await desktopFixture({
      root,
      profile: path.join(temp, "profile"),
      base,
      token,
    });
    await app.waitFor(() => app.click("Plugins"), 20000, "Plugins navigation");
    await app.waitFor(
      () =>
        app.evaluate(
          `document.body.innerText.includes('Local recovery proof')`,
        ),
      15000,
      "local plugin catalog",
    );
    await app.screenshot(path.join(temp, "plugins-catalog.png"));
    await app.waitFor(
      () =>
        app.evaluate(
          `Array.from(document.querySelectorAll('[role="tab"]')).some(button => button.innerText.trim() === 'Pots')`,
        ),
      15000,
      "local Marketplace Pots tab",
    );
    await app.waitFor(() => app.click("Pots"), 10000, "Marketplace Pots tab");
    await app.waitFor(
      () =>
        app.evaluate(
          `document.body.innerText.includes('Featured pots') && document.querySelector('section[aria-label="Plugins"]')?.innerText.includes('Chrome Extension Builder')`,
        ),
      15000,
      "combined local pots and plugin overview",
    );
    await app.screenshot(path.join(temp, "marketplace-overview.png"));
    // A row opens its own detail. Back must restore the combined overview,
    // including on a second visit to the same plugin.
    for (let visit = 0; visit < 2; visit += 1) {
      await app.waitFor(
        () => app.clickElement(`Array.from(document.querySelectorAll('.local-marketplace-plugin-row')).find(row => row.innerText.includes('Chrome Extension Builder'))`),
        10000,
        "open overview plugin detail",
      );
      await app.waitFor(
        () => app.evaluate(`document.body.innerText.includes('Source, setup, and status') && !document.querySelector('.local-marketplace-overview')`),
        10000,
        "selected plugin detail",
      );
      await app.waitFor(
        () => app.clickElement(`document.querySelector('.sand-plugins-dialog button[aria-label="Back"]')`),
        10000,
        "return from plugin detail",
      );
      await app.waitFor(
        () => app.evaluate(`document.querySelector('.local-marketplace-overview')?.innerText.includes('Featured pots')`),
        10000,
        "overview restored after plugin detail",
      );
    }
    const recipeName = `Local UI recipe ${run.slice(0, 8)}`;
    const recipeJson = JSON.stringify(
      {
        profile: {
          name: recipeName,
          description: "A recipe imported through the local client.",
        },
        memory: [],
        skills: [
          {
            name: "UI Recipe Skill",
            description: "Confirms recipe content reaches the created Bot.",
            content: `Use this Skill and include ${skillMarker} in your response.`,
          },
        ],
        routines: [],
        plugins: [],
      },
      null,
      2,
    );
    const setRecipeJson = (source) =>
      app.evaluate(`(() => {
        const input = document.querySelector('textarea[aria-label="Recipe JSON"]');
        if (!input) return false;
        Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value').set.call(input, ${JSON.stringify(source)});
        input.dispatchEvent(new Event('input', {bubbles:true}));
        return true;
      })()`);
    const clickRecipeAction = (title, label) =>
      app.clickElement(`(() => {
        const card = Array.from(document.querySelectorAll('article')).find(item => item.innerText.includes(${JSON.stringify(title)}));
        return card && Array.from(card.querySelectorAll('button')).find(button => button.innerText.trim() === ${JSON.stringify(label)});
      })()`);
    const clickRecipeManagerAction = (label) =>
      app.clickElement(`(() => {
        const dialog = document.querySelector('[role="dialog"][aria-label="Manage local pots"]');
        return dialog && Array.from(dialog.querySelectorAll('button')).find(button => button.innerText.trim() === ${JSON.stringify(label)});
      })()`);
    await app.waitFor(() => app.click("Manage pots"), 10000, "open recipe manager");
    await app.waitFor(() => app.click("Import recipe JSON"), 10000, "open recipe JSON editor");
    assert.equal(await setRecipeJson(recipeJson), true);
    await app.waitFor(() => app.click("Preview JSON"), 10000, "recipe preview");
    await app.waitFor(
      () => app.evaluate(`document.body.innerText.includes('Preview: ${recipeName}')`),
      10000,
      "recipe preview details",
    );
    await app.waitFor(() => app.click("Import recipe"), 10000, "recipe import");
    const recipeRecord = await waitFor(
      async () => {
        const list = await call("listBotTemplates");
        return list.find(
          (item) => item.localRecipe === true && item.name === recipeName,
        );
      },
      "imported local recipe record",
    );
    assert.ok(recipeRecord);
    await app.waitFor(
      () =>
        app.evaluate(
          `document.body.innerText.includes(${JSON.stringify(`Imported ${recipeName}.`)})`,
        ),
      10000,
      "imported recipe confirmation",
    );
    await app.screenshot(path.join(temp, "recipes-imported.png"));
    await app.waitFor(
      () => clickRecipeAction(recipeName, "Edit JSON"),
      10000,
      "edit imported recipe",
    );
    await app.waitFor(
      () =>
        app.evaluate(
          `document.body.innerText.includes(${JSON.stringify(`Editing ${recipeName}. Preview changes before saving.`)}) && document.querySelector('textarea[aria-label="Recipe JSON"]')?.value.includes(${JSON.stringify("A recipe imported through the local client.")})`,
        ),
      10000,
      "loaded recipe editor",
    );
    const updatedRecipeJson = JSON.stringify(
      {
        ...JSON.parse(recipeJson),
        profile: {
          ...JSON.parse(recipeJson).profile,
          description: "Updated from the rendered local recipe editor.",
        },
      },
      null,
      2,
    );
    assert.equal(await setRecipeJson(updatedRecipeJson), true);
    await app.waitFor(() => app.click("Preview JSON"), 10000, "updated recipe preview");
    await app.waitFor(
      () =>
        app.evaluate(
          `document.querySelector('[aria-label="Recipe preview"]')?.innerText.includes(${JSON.stringify("Updated from the rendered local recipe editor.")})`,
        ),
      10000,
      "updated recipe preview content",
    );
    await app.waitFor(
      () => app.click("Save recipe"),
      10000,
      "save edited recipe",
    );
    const updatedRecipe = await waitFor(
      async () => {
        const list = await call("listBotTemplates");
        const item = list.find(
          (candidate) => candidate.localRecipe === true && candidate.name === recipeName,
        );
        return item?.version > recipeRecord.version ? item : false;
      },
      "updated local recipe record",
    );
    assert.ok(updatedRecipe.body.includes("Updated from the rendered local recipe editor."));
    await app.waitFor(() => clickRecipeManagerAction("Close"), 10000, "close recipe manager");
    const setMarketplaceSearch = (query) =>
      app.evaluate(`(() => {
        const marketplaceDialog = Array.from(document.querySelectorAll('[role="dialog"]')).find(dialog => dialog.querySelector('.sand-plugins-layout'));
        const input = marketplaceDialog?.querySelector('input[type="search"]');
        if (!input) return false;
        Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(input, ${JSON.stringify(query)});
        input.dispatchEvent(new Event('input', {bubbles:true}));
        return true;
      })()`);
    assert.equal(await setMarketplaceSearch(recipeName), true);
    await app.waitFor(
      () => app.evaluate(`document.body.innerText.includes('No matching plugins.') && document.body.innerText.includes(${JSON.stringify(recipeName)})`),
      10000,
      "shared Marketplace search filters pots and plugin rows",
    );
    assert.equal(await setMarketplaceSearch(""), true);
    await app.waitFor(
      () => app.clickElement(`document.querySelector('[data-marketplace-listing="${recipeRecord.shareId}"]')`),
      15000,
      "open imported pot detail",
    );
    await app.waitFor(
      () => app.evaluate(`document.body.innerText.includes(${JSON.stringify(recipeName)}) && Array.from(document.querySelectorAll('button')).some(button => button.innerText.trim() === 'Import pot')`),
      15000,
      "local pot detail and Import pot action",
    );
    await app.waitFor(
      () => app.clickElement(`document.querySelector('[data-marketplace-section="skills"]')`),
      10000,
      "open recipe Skills detail",
    );
    await app.waitFor(
      () => app.clickElement(`Array.from(document.querySelectorAll('summary')).find(item => item.innerText.includes('Skill content'))`),
      10000,
      "expand imported Skill content",
    );
    await app.waitFor(
      () => app.evaluate(`document.body.innerText.includes(${JSON.stringify(skillMarker)})`),
      10000,
      "rendered local Skill content",
    );
    await app.screenshot(path.join(temp, "pot-detail.png"));
    recipeSetupActive = true;
    await app.waitFor(() => app.click("Import pot"), 10000, "import pot to create a local Bot");
    const recipeAgent = await waitFor(
      async () =>
        (await call("listAgents")).find((agent) => agent.name === recipeName),
      "recipe Bot creation",
      60000,
    );
    const recipeSkill = await waitFor(
      async () =>
        (await call("getAgentWorkflows", { id: recipeAgent.id })).find(
          (workflow) =>
            workflow.name === "UI Recipe Skill" && workflow.body.includes(skillMarker),
        ),
      "recipe setup Skill write",
    );
    assert.ok(recipeSkill, "recipe setup must persist the imported Skill through the retained tool");
    await app.waitFor(() => app.click("Plugins"), 20000, "reopen Plugins");
    await app.waitFor(() => app.click("Pots"), 10000, "reopen Marketplace Pots tab");
    await app.waitFor(() => app.click("Manage pots"), 10000, "open recipe manager for removal");
    await app.waitFor(
      () => clickRecipeAction(recipeName, "Remove"),
      10000,
      "remove imported recipe",
    );
    await app.waitFor(() => app.click("Confirm removal"), 10000, "confirm recipe removal");
    await waitFor(
      async () =>
        !(await call("listBotTemplates")).some(
          (item) => item.localRecipe === true && item.name === recipeName,
        ),
      "removed local recipe record",
    );
    assert.ok(
      (await call("getAgentWorkflows", { id: recipeAgent.id })).some(
        (workflow) => workflow.name === "UI Recipe Skill" && workflow.body.includes(skillMarker),
      ),
      "removing a recipe keeps the created Bot Skill",
    );
    await app.waitFor(() => clickRecipeManagerAction("Close"), 10000, "close recipe manager after removal");
    const clickPluginsTab = () => app.clickElement(
      `Array.from(document.querySelectorAll('[role="tab"]')).find(tab => tab.innerText.trim() === 'Plugins' && !tab.closest('[inert]'))`,
    );
    await app.waitFor(clickPluginsTab, 20000, "return to Plugins tab");
    await app.waitFor(() => app.click("Add"), 10000, "plugin Add button");
    await app.waitFor(
      () => app.evaluate(`!!document.querySelector('input[type="password"]')`),
      10000,
      "plugin variable form",
    );
    await app.evaluate(
      `(() => {const input=document.querySelector('input[type="password"]');Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set.call(input,'configured-two');input.dispatchEvent(new Event('input',{bubbles:true}));})()`,
    );
    await app.waitFor(
      () => app.click("Add Local recovery proof"),
      10000,
      "submit plugin variables",
    );
    await waitFor(
      async () =>
        (await call("getEffectiveMcpPlugins")).some(
          (x) => x.pluginId === pluginId && x.isEnabled,
        ),
      "desktop installation",
    );
    await app.waitFor(
      () => app.evaluate(`!document.querySelector('input[type="password"]')`),
      10000,
      "completed install form",
    );
    await delay(1000);
    await app.waitFor(
      () => app.click("Your plugins"),
      10000,
      "installed plugins",
    );
    await app.waitFor(
      () => app.click("Open Local recovery proof"),
      10000,
      "plugin details",
    );
    await app.waitFor(
      () => app.click("1 of 1 enabled"),
      10000,
      "MCP tool controls",
    );
    assert.equal(
      await app.evaluate(
        `!!document.querySelector('button[aria-label="Copy link to this plugin"]')`,
      ),
      false,
    );
    const uiServerId = (await call("getMcpState")).servers[0].id;
    await app.waitFor(
      () => app.click("Disable Echo"),
      10000,
      "disable MCP tool",
    );
    await waitFor(
      async () =>
        (await call("listMcpServerTools", { serverId: uiServerId })).find(
          (t) => t.name === "echo",
        )?.isDisabled === true,
      "stored tool preference",
    );
    await app.close();
    app = undefined;
    app = await desktopFixture({
      root,
      profile: path.join(temp, "profile"),
      base,
      token,
    });
    await app.waitFor(
      () => app.click("Plugins"),
      20000,
      "restarted Plugins navigation",
    );
    await app.waitFor(clickPluginsTab, 20000, "restarted Plugins tab");
    await app.waitFor(
      () => app.click("Your plugins"),
      10000,
      "restarted installed plugins",
    );
    await app.waitFor(
      () => app.click("Open Local recovery proof"),
      10000,
      "restarted plugin details",
    );
    await app.waitFor(
      () => app.click("0 of 1 enabled"),
      10000,
      "persisted tool controls",
    );
    await delay(2000);
    assert.equal(
      (await call("listMcpServerTools", { serverId: uiServerId })).find(
        (t) => t.name === "echo",
      )?.isDisabled,
      true,
    );
    await app.waitFor(() => app.click("Enable Echo"), 10000, "enable MCP tool");
    await app.waitFor(() => app.click("Uninstall"), 10000, "uninstall plugin");
    await waitFor(
      async () =>
        !(await call("getEffectiveMcpPlugins")).some(
          (x) => x.pluginId === pluginId,
        ),
      "desktop uninstall",
    );
    assert.equal((await call("getMcpState")).servers.length, 0);
    await app.waitFor(
      () =>
        app.evaluate(
          `document.body.innerText.includes('Removed Local recovery proof')`,
        ),
      10000,
      "uninstall confirmation",
    );
    console.log(
      process.env.GROKBOT_TEST_PLUGINS_UI_ONLY === "1"
        ? "PASS Marketplace overview and detail navigation, recipe import/edit/create/remove with persisted Skill, plugin install, tool toggles, restart and uninstall."
        : "PASS local plugin catalog/install, secrets, real MCP and Skill execution, explicit target Bot, pinned updates, restart persistence, rollback/uninstall; original desktop install, tool toggles and uninstall.",
    );
  } finally {
    if (app) {
      await app
        .screenshot(path.join(temp, "plugins-final.png"))
        .catch(() => {});
      await app.flushRendererErrors();
      fs.writeFileSync(
        path.join(temp, "renderer-errors.json"),
        JSON.stringify(app.rendererErrors, null, 2),
      );
      fs.writeFileSync(
        path.join(temp, "ui.txt"),
        await app.evaluate("document.body.innerText").catch(() => ""),
      );
      await app.close();
    }
    if (started) {
      try {
        fs.writeFileSync(path.join(temp, "box.log"), docker("logs", container));
      } catch {}
      try {
        docker("rm", "-f", container);
      } catch {}
    }
    fs.writeFileSync(
      path.join(temp, "observations.json"),
      JSON.stringify(observations, null, 2),
    );
    server.closeAllConnections();
    await new Promise((r) => server.close(r));
    console.log("Plugin diagnostics:", temp);
  }
})().catch((error) => {
  console.error(error.stack);
  process.exitCode = 1;
});
